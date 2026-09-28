/**
 * Viga Doble T ASIMÉTRICA modelada con shells Q4.
 *
 * Sección con patines superior e inferior INDEPENDIENTES (CBFEM-style):
 *   - Patín superior: bf_sup × tb_sup
 *   - Alma: hw × tw
 *   - Patín inferior: bf_inf × tb_inf  (puede ser diferente al superior)
 *
 * Soldadura alma↔patines = nodos compartidos en y=0 (centerline alma).
 *
 * Empotrada en x=0, carga puntual P en x=L (extremo libre, dirección -Z).
 *
 * Benchmark: tensión flexional σ = M·c/I con eje neutro desplazado
 * (sección asimétrica → centroide no está en h/2), comparado contra Euler-Bernoulli.
 *
 * Graduado el 28-sep-2026 desde la página con panel propio `main.ts` (docs/GRADUAR_UN_EJEMPLO.md).
 * El modelo (malla, apoyos, cargas) se movió TAL CUAL; el panel «Benchmark» pasó a `computedLabels`.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";

// Material acero (kN/m², kN/m³)
const Es = 200e6;
const nu_s = 0.3;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78;

export interface VigaDobleTParams {
  L: number; hw: number; tw: number;
  bf_sup: number; tb_sup: number;
  bf_inf: number; tb_inf: number;
  nx: number; ny_w: number; ny_f: number;
  P: number;
}

export interface VigaDobleTMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  tipNodes: number[];
  // sección asimétrica (geometría pura, no depende del solver)
  A_total: number; y_c: number; I: number;
  M_max: number; sigma_top_an: number; sigma_bot_an: number; delta_an: number;
}

/** Malla pura: nodos, elementos, apoyos y cargas — sin estados ni DOM. */
export function mallaVigaDobleT(p: VigaDobleTParams): VigaDobleTMalla {
  const { L, hw, tw, bf_sup, tb_sup, bf_inf, tb_inf, P } = p;
  const nx = Math.round(p.nx);
  const ny_w = Math.round(p.ny_w);
  const ny_f = Math.round(p.ny_f);

  // ── Geometría: viga horizontal en eje X, sección en YZ ──
  // Z = altura (vertical), Y = ancho (transversal).
  // Patín inferior:  z = 0..tb_inf (rectángulo de bf_inf × tb_inf en Y×Z)
  // Alma: z = tb_inf..tb_inf+hw (rectángulo tw en Y, hw en Z)
  // Patín superior: z = tb_inf+hw..tb_inf+hw+tb_sup (rectángulo bf_sup × tb_sup)
  const z_inf_top = tb_inf;
  const z_web_top = tb_inf + hw;

  // Posiciones X uniformes a lo largo de L
  const dx = L / nx;

  const nodes: Node[] = [];
  const elements: Element[] = [];
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
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t);
    elasticities.set(i, Es);
    poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s);
    shearModuli.set(i, Gs);
    areas.set(i, 0); Iz.set(i, 0); Iy.set(i, 0); J.set(i, 0);
  }

  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();

  // ── ALMA: plano y=0, malla nx × ny_w ──
  const dz_w = hw / ny_w;
  const webGrid: number[][] = [];
  for (let iz = 0; iz <= ny_w; iz++) {
    const row: number[] = [];
    const z = z_inf_top + iz * dz_w;
    for (let ix = 0; ix <= nx; ix++) {
      row.push(addNode(ix * dx, 0, z));
    }
    webGrid.push(row);
  }
  for (let iz = 0; iz < ny_w; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(webGrid[iz][ix], webGrid[iz][ix + 1], webGrid[iz + 1][ix + 1], webGrid[iz + 1][ix], tw);
    }
  }

  // ── PATÍN INFERIOR: en plano z=z_inf_top ──
  const ny_f_even = ny_f % 2 === 0 ? ny_f : ny_f + 1;
  const dy_inf_e = bf_inf / ny_f_even;
  const infGrid: number[][] = [];
  for (let iy = 0; iy <= ny_f_even; iy++) {
    const row: number[] = [];
    const y = -bf_inf / 2 + iy * dy_inf_e;
    for (let ix = 0; ix <= nx; ix++) {
      if (Math.abs(y) < 1e-7) {
        row.push(webGrid[0][ix]);  // soldadura ↔ alma
      } else {
        row.push(addNode(ix * dx, y, z_inf_top));
      }
    }
    infGrid.push(row);
  }
  for (let iy = 0; iy < ny_f_even; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(infGrid[iy][ix], infGrid[iy][ix + 1], infGrid[iy + 1][ix + 1], infGrid[iy + 1][ix], tb_inf);
    }
  }

  // ── PATÍN SUPERIOR: plano z=z_web_top ──
  const ny_f_even2 = ny_f % 2 === 0 ? ny_f : ny_f + 1;
  const dy_sup_e = bf_sup / ny_f_even2;
  const supGrid: number[][] = [];
  for (let iy = 0; iy <= ny_f_even2; iy++) {
    const row: number[] = [];
    const y = -bf_sup / 2 + iy * dy_sup_e;
    for (let ix = 0; ix <= nx; ix++) {
      if (Math.abs(y) < 1e-7) {
        row.push(webGrid[ny_w][ix]);  // soldadura ↔ alma fila superior
      } else {
        row.push(addNode(ix * dx, y, z_web_top));
      }
    }
    supGrid.push(row);
  }
  for (let iy = 0; iy < ny_f_even2; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      addShell(supGrid[iy][ix], supGrid[iy][ix + 1], supGrid[iy + 1][ix + 1], supGrid[iy + 1][ix], tb_sup);
    }
  }

  // ── BCs: empotrar todos los nodos en x=0 ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((pt, id) => {
    if (Math.abs(pt[0]) < 1e-7) supports.set(id, [true, true, true, true, true, true]);
  });

  // ── Carga: distribuir P en nodos del extremo x=L ──
  const tipNodes: number[] = [];
  nodes.forEach((pt, id) => {
    if (Math.abs(pt[0] - L) < 1e-6) tipNodes.push(id);
  });
  const loads = new Map<number, [number, number, number, number, number, number]>();
  const fz = -P / Math.max(1, tipNodes.length);
  for (const id of tipNodes) loads.set(id, [0, 0, fz, 0, 0, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };

  // ── BENCHMARK: σ flexional con eje neutro asimétrico ──
  const A_inf = bf_inf * tb_inf;
  const A_w = tw * hw;
  const A_sup = bf_sup * tb_sup;
  const A_total = A_inf + A_w + A_sup;
  const zc_inf = tb_inf / 2;
  const zc_w = tb_inf + hw / 2;
  const zc_sup = tb_inf + hw + tb_sup / 2;
  const y_c = (A_inf * zc_inf + A_w * zc_w + A_sup * zc_sup) / A_total;
  const I_inf_own = (bf_inf * tb_inf ** 3) / 12;
  const I_w_own = (tw * hw ** 3) / 12;
  const I_sup_own = (bf_sup * tb_sup ** 3) / 12;
  const I = I_inf_own + A_inf * (zc_inf - y_c) ** 2 +
            I_w_own + A_w * (zc_w - y_c) ** 2 +
            I_sup_own + A_sup * (zc_sup - y_c) ** 2;
  const M_max = P * L;
  const c_top = (tb_inf + hw + tb_sup) - y_c;
  const c_bot = y_c;
  const sigma_top_an = (M_max * c_top) / I;
  const sigma_bot_an = -(M_max * c_bot) / I;
  const delta_an = -(P * L * L * L) / (3 * Es * I);

  return { nodes, elements, nodeInputs, elementInputs, tipNodes, A_total, y_c, I, M_max, sigma_top_an, sigma_bot_an, delta_an };
}

// Lo último construido, para computedLabels (patrón de muroContencionSolido.ts).
let ultimo: {
  malla: VigaDobleTMalla;
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
} | null = null;

const F = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const vigaDobleT: ExampleDef = {
  id: "viga-doble-t",
  name: "Viga Doble-T (perfil W)",
  category: "2️⃣ Shells · 🐚 Cáscaras",
  defaultShellResult: "vonMises",
  params: {
    L:      F("Geometría", "Luz L (m)", 4.0, 1.0, 10.0, 0.5),
    hw:     F("Geometría", "hw alma (m)", 0.40, 0.20, 1.20, 0.05),
    tw:     F("Geometría", "tw alma (m)", 0.012, 0.006, 0.030, 0.002),
    bf_sup: F("Geometría", "bf SUP (m)", 0.20, 0.10, 0.50, 0.02),
    tb_sup: F("Geometría", "tb SUP (m)", 0.018, 0.008, 0.040, 0.002),
    bf_inf: F("Geometría", "bf INF (m)", 0.30, 0.10, 0.50, 0.02),
    tb_inf: F("Geometría", "tb INF (m)", 0.022, 0.008, 0.040, 0.002),
    nx:     F("Malla", "Mesh nx (luz)", 20, 8, 48, 2),
    ny_w:   F("Malla", "Mesh ny alma", 6, 2, 12, 1),
    ny_f:   F("Malla", "Mesh ny patín", 4, 2, 10, 1),
    P:      { ...F("Cargas", "P punta (kN, -Z)", 50, 0, 500, 10), unitType: "force" },
  },
  guide: [
    "P en la punta (x=L) genera M_max = P·L en el empotramiento (x=0)",
    "El eje neutro real (y_c) está desplazado por la asimetría de los patines (Steiner)",
    "«📊 Calculados» compara σ y δ analíticos (Euler-Bernoulli) contra el FEM Q4",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaVigaDobleT(p as unknown as VigaDobleTParams);
    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(malla.nodes, malla.elements, malla.nodeInputs, malla.elementInputs);
      analyzeOutputs = analyze(malla.nodes, malla.elements, malla.elementInputs, deformOutputs);
    } catch (e: any) {
      console.warn("Viga doble T asim deform/analyze:", e?.message ?? e);
    }
    ultimo = { malla, deformOutputs, analyzeOutputs };

    states.nodes.val = malla.nodes;
    states.elements.val = malla.elements;
    states.nodeInputs.val = malla.nodeInputs;
    states.elementInputs.val = malla.elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = [];
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { malla, deformOutputs, analyzeOutputs } = ultimo;
    const fmtSci = (v: number) => v.toExponential(3);

    // σ máx Hekatan: max von Mises
    let sigma_max_he = 0;
    const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
    if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > sigma_max_he) sigma_max_he = v; }));

    // δ Hekatan: max |Uz| en x=L
    let delta_he = 0;
    for (const id of malla.tipNodes) {
      const u = deformOutputs.deformations?.get(id);
      if (u && Math.abs(u[2]) > Math.abs(delta_he)) delta_he = u[2];
    }
    const errPct = Math.abs(delta_he - malla.delta_an) / Math.abs(malla.delta_an || 1) * 100;
    const status = errPct < 5 ? "✓ PASA (<5%)"
      : errPct < 15 ? "⚠ ACEPTABLE (5-15%)"
      : "✗ revisar (>15%)";

    return {
      "── Sección asimétrica ──": "",
      "Área total (m²)": fmtSci(malla.A_total),
      "Centroide y_c (m)": malla.y_c.toFixed(4),
      "I (m⁴)": fmtSci(malla.I),
      "── Analítico (Euler-Bernoulli) ──": "",
      "M_max (kN·m)": fmtSci(malla.M_max),
      "σ top (kN/m²)": fmtSci(malla.sigma_top_an),
      "σ bot (kN/m²)": fmtSci(malla.sigma_bot_an),
      "δ punta analítica (m)": fmtSci(malla.delta_an),
      "── Hekatan Q4 (medido) ──": "",
      "σ vM max (kN/m²)": fmtSci(sigma_max_he),
      "δ punta FEM (m)": fmtSci(delta_he),
      "Δ vs E-B (%)": errPct.toFixed(2),
      "Status": status,
    };
  },
};
