/**
 * Columna CFT (tubo de acero relleno de hormigón): paredes del tubo HSS como cáscaras Q4 y
 * núcleo de hormigón como sólidos H8, en UNA sola matriz de rigidez.
 *
 * Tubo HSS rectangular (cáscaras Q4, espesor t): 4 paredes verticales en las caras
 * INTERIORES del tubo, x = ±(bc/2 − t) e y = ±(hc/2 − t).
 * Relleno de hormigón (H8): llena ese interior y COMPARTE los nudos de las paredes.
 * Base (z = 0) empotrada; carga axial Pu repartida por igual en TODOS los nudos de z = Lz.
 *
 * ACOPLAMIENTO — opción A (nudos comunes, adherencia perfecta), decidida leyendo la página de
 * antes y midiendo: las paredes se generan con `concIdx(…)`, la MISMA función que numera los
 * nudos del hormigón, así que tubo y núcleo ya tenían los mismos nudos (16 de los 25 de cada
 * planta con la malla por defecto). La página, sin embargo, resolvía el tubo solo con
 * `deform`/`analyze` y el hormigón aparte con `hex8Solve`, cuyo resultado solo salía por
 * consola y se tiraba. Aquí va todo en una llamada a `deform` (el H8 se ensambla con las
 * cáscaras desde el 3-sep-2026, validado contra SAP2000 en `tests/casos/solidos_mixtos.mjs`)
 * y las tensiones de los H8 se recuperan con `hex8Stress`, como `cliModeler.ts`.
 *
 * La carga NO cambia: mismos nudos, mismo valor −Pu/n. Lo que cambia es lo que la recibe: en
 * la página de antes los 9 nudos interiores de la cara superior no tocaban ninguna cáscara,
 * `deform` los sacaba como GDL sin rigidez y su parte de la carga (9/25 de Pu) se perdía.
 *
 * Panel (el de la página): As, Ac, Is, Ic, EI_eff y Pno de AISC 360-22 §I2.1b, Pu/φPno y el
 * acortamiento axial del modelo contra δ = Pu·Lz/(Es·As + Ec·Ac). Y, nuevo, el reparto de la
 * carga entre acero y hormigón medido en las reacciones, junto al que predicen Es·As y Ec·Ac.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { analyze, deform, hex8Stress } from "hekatan-fem";
import { ecHormigonACI } from "../shared/materials";

// Acero HSS (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 7.85;   // MASA del acero en t/m³ (kN·s²/m⁴). Iba 78 = su PESO en kN/m³: 10 veces de más (29-sep-2026)
const Fy_s = 350000;  // 350 MPa, ASTM A500 Gr. C
// Hormigón
const nu_c = 0.20;

export interface CftParams {
  bc: number; hc: number; Lz: number; t: number;
  nx: number; ny: number; nz: number;
  fc: number; Pu: number;
}

export const CFT_DEFAULT: CftParams = {
  bc: 0.40, hc: 0.40, Lz: 3.00, t: 0.012, nx: 4, ny: 4, nz: 8, fc: 28000, Pu: 2000,
};

export interface CftMalla {
  nodes: Node[];
  shellElements: Element[];
  concH8: Element[];
  /** Todo el modelo: primero las cáscaras (mismos índices que la página), luego los H8. */
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  topNodes: number[];
  baseNodes: number[];
  Ec: number;
  /** Área de acero que ve la malla: perímetro interior · t. */
  AsMalla: number;
  /** Área de hormigón de la malla: 2·x_int · 2·y_int = (bc − 2t)(hc − 2t). */
  AcMalla: number;
  dx: number; dy: number;
}

/** La malla, pura: la misma cuenta que llevaba la página; al final, tubo y núcleo juntos. */
export function mallaColumnaCft(p: CftParams): CftMalla {
  const { bc, hc, Lz, t, fc, Pu } = p;
  const nx = Math.round(p.nx);
  const ny = Math.round(p.ny);
  const nz = Math.round(p.nz);
  // E hormigón: Ec = 4700·√(f'c en MPa) [MPa] → kN/m²
  const Ec = ecHormigonACI(fc / 1000);

  // ── Geometría: el tubo HSS va en la cara INTERIOR (x = ±(bc/2 − t), y = ±(hc/2 − t)) ──
  const x_int = bc / 2 - t;
  const y_int = hc / 2 - t;

  // Dedup espacial de nudos
  const nodes: Node[] = [];
  const nodeMap = new Map<string, number>();
  const KEY_DEC = 5;
  function addNode(x: number, y: number, z: number): number {
    const key = `${x.toFixed(KEY_DEC)},${y.toFixed(KEY_DEC)},${z.toFixed(KEY_DEC)}`;
    let id = nodeMap.get(key);
    if (id === undefined) {
      nodes.push([x, y, z]);
      id = nodes.length - 1;
      nodeMap.set(key, id);
    }
    return id;
  }

  // Cáscaras Q4 (paredes de acero)
  const shellElements: Element[] = [];
  const shellThicknesses = new Map<number, number>();
  const shellElast = new Map<number, number>();
  const shellNu = new Map<number, number>();
  const shellRho = new Map<number, number>();
  const shellG = new Map<number, number>();
  const dummyA = new Map<number, number>();
  const dummyIz = new Map<number, number>();
  const dummyIy = new Map<number, number>();
  const dummyJ = new Map<number, number>();

  function addShell(n0: number, n1: number, n2: number, n3: number) {
    shellElements.push([n0, n1, n2, n3]);
    const i = shellElements.length - 1;
    shellThicknesses.set(i, t);
    shellElast.set(i, Es);
    shellNu.set(i, nu_s);
    shellRho.set(i, rho_s);
    shellG.set(i, Gs);
    dummyA.set(i, 0); dummyIz.set(i, 0); dummyIy.set(i, 0); dummyJ.set(i, 0);
  }

  // ── Rejilla 3D de nudos del HORMIGÓN (incluye las caras que coinciden con el tubo) ──
  const dx = (2 * x_int) / nx;
  const dy = (2 * y_int) / ny;
  const dz = Lz / nz;
  const concIdx = (i: number, j: number, k: number) =>
    addNode(-x_int + i * dx, -y_int + j * dy, k * dz);

  // ── H8 de hormigón ──
  const concH8: Element[] = [];
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        concH8.push([
          concIdx(i, j, k),
          concIdx(i + 1, j, k),
          concIdx(i + 1, j + 1, k),
          concIdx(i, j + 1, k),
          concIdx(i, j, k + 1),
          concIdx(i + 1, j, k + 1),
          concIdx(i + 1, j + 1, k + 1),
          concIdx(i, j + 1, k + 1),
        ]);
      }
    }
  }

  // ── Cáscaras Q4 de las 4 paredes del tubo (en las caras interiores) ──
  // Pared x = −x_int
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      addShell(concIdx(0, j, k), concIdx(0, j + 1, k),
               concIdx(0, j + 1, k + 1), concIdx(0, j, k + 1));
    }
  }
  // Pared x = +x_int
  for (let k = 0; k < nz; k++) {
    for (let j = 0; j < ny; j++) {
      addShell(concIdx(nx, j, k), concIdx(nx, j + 1, k),
               concIdx(nx, j + 1, k + 1), concIdx(nx, j, k + 1));
    }
  }
  // Pared y = −y_int
  for (let k = 0; k < nz; k++) {
    for (let i = 0; i < nx; i++) {
      addShell(concIdx(i, 0, k), concIdx(i + 1, 0, k),
               concIdx(i + 1, 0, k + 1), concIdx(i, 0, k + 1));
    }
  }
  // Pared y = +y_int
  for (let k = 0; k < nz; k++) {
    for (let i = 0; i < nx; i++) {
      addShell(concIdx(i, ny, k), concIdx(i + 1, ny, k),
               concIdx(i + 1, ny, k + 1), concIdx(i, ny, k + 1));
    }
  }

  // ── Apoyos: empotrar todos los nudos de z = 0 ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  const baseNodes: number[] = [];
  nodes.forEach((q, id) => {
    if (Math.abs(q[2]) < 1e-7) { supports.set(id, [true, true, true, true, true, true]); baseNodes.push(id); }
  });

  // ── Carga axial Pu en los nudos de z = Lz (la misma que la página) ──
  const topNodes: number[] = [];
  nodes.forEach((q, id) => {
    if (Math.abs(q[2] - Lz) < 1e-6) topNodes.push(id);
  });
  const fz = -Pu / Math.max(1, topNodes.length);
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const id of topNodes) loads.set(id, [0, 0, fz, 0, 0, 0]);

  // ── Tubo y núcleo en el MISMO modelo: cáscaras primero (índices de la página), H8 después ──
  const elements: Element[] = [...shellElements, ...concH8];
  const nS = shellElements.length;
  const Gc = Ec / (2 * (1 + nu_c));
  concH8.forEach((_, i) => {
    shellElast.set(nS + i, Ec);
    shellNu.set(nS + i, nu_c);
    shellG.set(nS + i, Gc);
  });
  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities: shellElast,
    poissonsRatios: shellNu,
    densities: shellRho,
    shearModuli: shellG,
    thicknesses: shellThicknesses,
    areas: dummyA, momentsOfInertiaZ: dummyIy, momentsOfInertiaY: dummyIz, torsionalConstants: dummyJ,
    // hex8Solve de la página iba con su defecto: modos incompatibles de Wilson–Taylor
    solidIncompatible: true,
  } as any;

  return {
    nodes, shellElements, concH8, elements, nodeInputs, elementInputs, topNodes, baseNodes, Ec,
    AsMalla: 2 * (2 * x_int + 2 * y_int) * t,
    AcMalla: (2 * x_int) * (2 * y_int),
    dx, dy,
  };
}

export interface CftResultado {
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
  solidStress: Map<number, number[][]>;
  solidVonMises: Map<number, number[]>;
  error?: string;
}

/** Resuelve tubo + núcleo en una sola K y recupera las tensiones de los H8. */
export function resolverColumnaCft(m: CftMalla): CftResultado {
  const r: CftResultado = {
    deformOutputs: {} as DeformOutputs, analyzeOutputs: {} as AnalyzeOutputs,
    solidStress: new Map(), solidVonMises: new Map(),
  };
  try {
    r.deformOutputs = deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    r.analyzeOutputs = analyze(m.nodes, m.elements, m.elementInputs, r.deformOutputs);
    // Tensiones de los sólidos mezclados (analyze no sabe de H8): la misma recuperación que
    // hex8Solve, elemento a elemento, con los desplazamientos de deform (cliModeler.ts).
    const U = r.deformOutputs.deformations;
    const nS = m.shellElements.length;
    m.concH8.forEach((el, i) => {
      const e = nS + i;
      const coords = el.map((n) => m.nodes[n]) as [number, number, number][];
      const u = el.flatMap((n) => { const d = U.get(n) ?? [0, 0, 0]; return [d[0], d[1], d[2]]; });
      const s = hex8Stress(coords, m.elementInputs.elasticities!.get(e)!, m.elementInputs.poissonsRatios!.get(e)!, u, true);
      r.solidStress.set(e, s.stress);
      r.solidVonMises.set(e, s.vonMises);
    });
  } catch (e: any) {
    r.error = e?.message ?? String(e);
    console.warn("CFT deform/analyze:", r.error);
  }
  return r;
}

export interface CftPanel {
  As: number; Ac: number; Is: number; Ic: number;
  C3: number; EI_eff: number; Pno_AISC: number; phiPno: number; demandCap: number;
  uz_top_he: number; uz_axial_an: number; errPct: number;
  /** Reparto medido: suma de reacciones verticales y la parte que baja por el hormigón. */
  sumRz: number; Nc: number; Ns: number;
  /** Reparto que predicen las rigideces Es·As y Ec·Ac (fracción del hormigón, 0..1). */
  fracHormigonEA: number; fracHormigonEAMalla: number;
}

/**
 * Los números del panel de la página + el reparto de carga.
 *
 * Nc (hormigón) = −Σ media(σzz de los 8 puntos de Gauss)·dx·dy sobre los H8 de la primera
 * planta. Es EXACTAMENTE la suma de las fuerzas nodales de esos H8 sobre los nudos de la base:
 * con el campo virtual w = z/dz (compatible, lineal en el elemento) ∫σzz/dz dV = Σ f_z de la
 * cara superior = −Σ f_z de la inferior, y la regla 2×2×2 integra exacto un ladrillo recto.
 * Ns (acero) = ΣRz − Nc: lo que queda en los nudos de la base es de las cáscaras.
 */
export function panelColumnaCft(p: CftParams, m: CftMalla, r: CftResultado): CftPanel {
  const { bc, hc, Lz, t, fc, Pu } = p;
  const Ec = m.Ec;
  // As (área acero), Ac (área hormigón), Is, Ic
  const Ac = (bc - 2 * t) * (hc - 2 * t);
  const Atot = bc * hc;
  const As = Atot - Ac;
  // Inercias respecto al eje fuerte: I = b·h³/12
  const Itot = (bc * hc * hc * hc) / 12;
  const Ic = ((bc - 2 * t) * (hc - 2 * t) ** 3) / 12;
  const Is = Itot - Ic;
  // EI_eff (AISC §I2.1b): Es·Is + C3·Ec·Ic, C3 = min(0.9, 0.45 + 3·(As + Asr)/(As + Ac)), Asr = 0
  const C3 = Math.min(0.9, 0.45 + 3 * As / (As + Ac));
  const EI_eff = Es * Is + C3 * Ec * Ic;
  // Pno = Pp = Fy·As + 0.85·f'c·Ac (sección compacta, AISC ec. I2-9a)
  const Pno = Fy_s * As + 0.85 * fc * Ac;
  const phi_c = 0.75;
  const phiPno = phi_c * Pno;
  const demandCap = Pu / Math.max(1, phiPno);
  // δ axial homogeneizado: δ = Pu·Lz/(Es·As + Ec·Ac)
  const EA_eff = Es * As + Ec * Ac;
  const uz_axial_an = -Pu * Lz / EA_eff;
  // δ Hekatan: máx |uz| en el tope
  let uz_top_he = 0;
  for (const id of m.topNodes) {
    const u = r.deformOutputs.deformations?.get(id);
    if (u && Math.abs(u[2]) > Math.abs(uz_top_he)) uz_top_he = u[2];
  }
  const errPct = Math.abs(uz_top_he - uz_axial_an) / Math.abs(uz_axial_an || 1) * 100;

  // ── Reparto de la carga ──
  let sumRz = 0;
  r.deformOutputs.reactions?.forEach((rr) => { sumRz += rr[2]; });
  const nS = m.shellElements.length;
  const nxy = Math.round(p.nx) * Math.round(p.ny);
  let Nc = 0;
  for (let i = 0; i < nxy; i++) {
    const g = r.solidStress.get(nS + i);
    if (!g) continue;
    const szMedia = g.reduce((s, v) => s + v[2], 0) / g.length;
    Nc += -szMedia * m.dx * m.dy;
  }
  const Ns = sumRz - Nc;
  const fracHormigonEA = (Ec * Ac) / EA_eff;
  const fracHormigonEAMalla = (Ec * m.AcMalla) / (Es * m.AsMalla + Ec * m.AcMalla);

  return {
    As, Ac, Is, Ic, C3, EI_eff, Pno_AISC: Pno, phiPno, demandCap, uz_top_he, uz_axial_an, errPct,
    sumRz, Nc, Ns, fracHormigonEA, fracHormigonEAMalla,
  };
}

const D = CFT_DEFAULT;
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

let ultimo: { p: CftParams; malla: CftMalla; res: CftResultado } | null = null;

export const columnaCftH8: ExampleDef = {
  id: "columna-cft-h8",
  name: "Columna CFT con sólidos H8",
  category: "3️⃣ Sólidos",
  benchmark: false,
  // Abre con el ACERO (von Mises de las cáscaras del tubo), que es lo que se ve por fuera. El
  // colormap va por nudo y el tubo comparte nudos con el hormigón: no puede enseñar los dos a
  // la vez. Para ver el hormigón se elige un campo en «Resultados de sólido»: entonces el
  // visor pinta solo la piel de los hexaedros.
  defaultShellResult: "vonMises",
  params: {
    bc: P("Geometría", "bc tubo (m, eje X)", D.bc, 0.20, 0.80, 0.05),
    hc: P("Geometría", "hc tubo (m, eje Y)", D.hc, 0.20, 0.80, 0.05),
    Lz: P("Geometría", "Altura Lz (m)", D.Lz, 1.5, 6.0, 0.5),
    t:  P("Geometría", "t pared HSS (m)", D.t, 0.006, 0.030, 0.002),
    nx: P("Malla", "nx (X)", D.nx, 2, 8, 2),
    ny: P("Malla", "ny (Y)", D.ny, 2, 8, 2),
    nz: P("Malla", "nz (Z)", D.nz, 4, 16, 2),
    fc: P("Material", "f'c hormigón (kN/m²)", D.fc, 17000, 50000, 1000),
    Pu: P("Cargas", "Pu axial (kN, −Z)", D.Pu, 0, 10000, 100),
  },
  guide: [
    "El tubo de acero son cáscaras Q4 y el relleno sólidos H8: comparten los nudos (adherencia perfecta)",
    "Pu se reparte por igual en todos los nudos del tope; la base está empotrada",
    "«Calculados»: AISC 360-22 §I2.1b y cuánto de Pu baja por el acero y por el hormigón",
    "«Resultados de sólido» pinta el núcleo; «Resultados de cáscara», el tubo",
  ],
  build: (params: Record<string, number>, states: BuildStates) => {
    const p: CftParams = {
      bc: params.bc, hc: params.hc, Lz: params.Lz, t: params.t,
      nx: params.nx, ny: params.ny, nz: params.nz, fc: params.fc, Pu: params.Pu,
    };
    const malla = mallaColumnaCft(p);
    const res = resolverColumnaCft(malla);
    ultimo = { p, malla, res };
    states.nodes.val = malla.nodes;
    states.elements.val = malla.elements;
    states.nodeInputs.val = malla.nodeInputs;
    states.elementInputs.val = malla.elementInputs;
    states.deformOutputs.val = res.deformOutputs;
    states.analyzeOutputs.val = res.error
      ? ({} as AnalyzeOutputs)
      : ({ ...(res.analyzeOutputs ?? {}), solidStress: res.solidStress, solidVonMises: res.solidVonMises } as any);
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { p, malla, res } = ultimo;
    const e = (v: number) => v.toExponential(3);
    const out: Record<string, string> = {
      "Nudos": String(malla.nodes.length),
      "Elementos": `${malla.shellElements.length} cáscaras Q4 (acero) + ${malla.concH8.length} H8 (hormigón)`,
      "Ec = 4700·√f'c": `${(malla.Ec / 1000).toFixed(0)} MPa`,
    };
    if (res.error) { out["Solver"] = `falló: ${res.error}`; return out; }
    const c = panelColumnaCft(p, malla, res);
    out["As acero"] = `${e(c.As)} m²`;
    out["Ac hormigón"] = `${e(c.Ac)} m²`;
    out["Is"] = `${e(c.Is)} m⁴`;
    out["Ic"] = `${e(c.Ic)} m⁴`;
    out["EI_eff = Es·Is + C3·Ec·Ic (AISC §I2.1b)"] = `${e(c.EI_eff)} kN·m² (C3 = ${c.C3.toFixed(3)})`;
    out["Pno = Fy·As + 0.85·f'c·Ac (AISC I2-9a)"] = `${c.Pno_AISC.toFixed(0)} kN`;
    out["Pu / φPno (φ = 0.75)"] = c.demandCap.toFixed(3);
    out["δ axial = Pu·Lz/(Es·As + Ec·Ac)"] = `${e(c.uz_axial_an)} m`;
    out["δ tope medido (máx |uz|)"] = `${e(c.uz_top_he)} m`;
    out["Δ vs AISC"] = `${c.errPct.toFixed(1)} %`;
    out["ΣRz (base)"] = `${c.sumRz.toFixed(2)} kN`;
    out["Carga por el hormigón (reacciones)"] = `${c.Nc.toFixed(1)} kN = ${(100 * c.Nc / c.sumRz).toFixed(1)} %`;
    out["Carga por el acero (reacciones)"] = `${c.Ns.toFixed(1)} kN = ${(100 * c.Ns / c.sumRz).toFixed(1)} %`;
    out["Reparto por rigidez Ec·Ac/(Es·As + Ec·Ac)"] = `hormigón ${(100 * c.fracHormigonEA).toFixed(1)} %, acero ${(100 * (1 - c.fracHormigonEA)).toFixed(1)} %`;
    out["Ídem con las áreas de la malla"] = `hormigón ${(100 * c.fracHormigonEAMalla).toFixed(1)} % (acero = perímetro interior·t)`;
    return out;
  },
};
