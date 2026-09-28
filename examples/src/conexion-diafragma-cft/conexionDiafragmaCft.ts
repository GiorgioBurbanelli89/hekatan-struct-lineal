/**
 * Conexión Viga–Columna CFT con DIAFRAGMA EXTERNO.
 *
 * Tipología: viga doble T (W-shape) conectada a columna CFT rectangular
 * mediante diafragma externo (anillo perimetral) que envuelve la columna
 * a la altura de los patines de la viga.
 *
 * Referencias:
 *   - CIDECT Design Guide 9 — Beam-to-column connections in HSS
 *   - Christian Cervantes (UNAM México) — investigación en conexiones
 *     viga-columna CFT con diafragma para zonas sísmicas
 *   - AISC 358-22 Chapter 12 — Through-diaphragm connections
 *
 * Componentes (todos shells Q4):
 *   - Columna CFT (HSS rectangular bc × hc, shell paredes)
 *   - Viga W (alma + patín superior + patín inferior)
 *   - Diafragmas externos: 2 placas anulares perimetrales a la columna
 *     a la altura de los patines de la viga (z_bot_flange, z_top_flange)
 *
 * Soldadura: nodos compartidos en interfaces vía dedup espacial.
 *
 * Graduado el 28-sep-2026 desde `main.ts` (página con panel propio). El chequeo
 * en vivo del panel (M_joint, A_d, σ_d analítico CIDECT, σ_vM medido, ratio)
 * pasó a `computedLabels` tal cual estaba.
 *
 * NOTA (heredada, no corregida): en `elementInputs` el mapa local `dummyIy` se
 * asigna a `momentsOfInertiaZ` y `dummyIz` a `momentsOfInertiaY` (nombres
 * cruzados). No afecta el resultado porque el modelo es 100% shells (I no se
 * usa en cáscaras) — se deja igual que la página original.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";

const Es = 200e6, nu_s = 0.3, Gs = Es / (2 * (1 + nu_s)), rho_s = 78;

export interface ConexionDiafragmaCftParams {
  bc: number; hc: number; Lz: number; t_col: number;
  d_v: number; bf_v: number; tf_v: number; tw_v: number; L_v: number;
  bd: number; td: number;
  nx: number; nz: number; nv_x: number; nv_z: number;
  P: number;
}

export interface ConexionDiafragmaCftMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  // demanda analítica CIDECT/Cervantes (geometría pura)
  M_joint: number; A_d: number; sigma_d_an: number;
}

/** Malla pura (columna CFT + viga W + diafragmas), sin estados ni DOM. */
export function mallaConexionDiafragmaCft(p: ConexionDiafragmaCftParams): ConexionDiafragmaCftMalla {
  const { bc, hc, Lz, t_col, d_v, bf_v, tf_v, tw_v, L_v, bd, td, P } = p;
  const nx = Math.round(p.nx);
  const nz = Math.round(p.nz);
  const nv_x = Math.round(p.nv_x);
  const nv_z = Math.round(p.nv_z);

  // ── Geometría ──
  // Columna en eje Z, base z=0, top z=Lz, sección bc(X) × hc(Y), centrada en (0,0)
  // Viga horizontal en +Y, conectada a la cara y=hc/2 de la columna a media altura z=Lz/2
  const z_mid = Lz / 2;
  const z_top_flange = z_mid + d_v / 2;
  const z_bot_flange = z_mid - d_v / 2;

  const nodes: Node[] = [];
  const nodeMap = new Map<string, number>();
  const elements: Element[] = [];
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const thicknesses = new Map<number, number>();
  const dummyA = new Map<number, number>();
  const dummyIz = new Map<number, number>();
  const dummyIy = new Map<number, number>();
  const dummyJ = new Map<number, number>();
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
    dummyA.set(i, 0); dummyIz.set(i, 0); dummyIy.set(i, 0); dummyJ.set(i, 0);
  }

  // Z grid de la columna que incluye z_bot_flange, z_mid, z_top_flange como nodos
  const zList: number[] = [];
  const zSet = new Set<string>();
  const addZ = (z: number) => { const k = z.toFixed(5); if (!zSet.has(k)) { zSet.add(k); zList.push(z); } };
  for (let k = 0; k <= nz; k++) addZ(k * Lz / nz);
  addZ(z_bot_flange);
  addZ(z_mid);
  addZ(z_top_flange);
  zList.sort((a, b) => a - b);

  // ── Columna HSS: 4 paredes verticales en x=±bc/2, y=±hc/2 ──
  const dx_col = bc / nx;
  const dy_col = hc / nx;
  const buildWall = (
    fixedAxis: "x" | "y", fixedVal: number,
    varAxis: "x" | "y", varDelta: number, varN: number,
    t: number,
  ) => {
    const grid: number[][] = [];
    for (let iz = 0; iz < zList.length; iz++) {
      const row: number[] = [];
      for (let iv = 0; iv <= varN; iv++) {
        const v = -((varN * varDelta) / 2) + iv * varDelta;
        const x = fixedAxis === "x" ? fixedVal : v;
        const y = fixedAxis === "y" ? fixedVal : v;
        row.push(addNode(x, y, zList[iz]));
      }
      grid.push(row);
    }
    for (let iz = 0; iz < zList.length - 1; iz++) {
      for (let iv = 0; iv < varN; iv++) {
        addShell(grid[iz][iv], grid[iz][iv + 1], grid[iz + 1][iv + 1], grid[iz + 1][iv], t);
      }
    }
    return grid;
  };
  buildWall("y", -hc / 2, "x", dx_col, nx, t_col);
  const wallFront = buildWall("y", hc / 2, "x", dx_col, nx, t_col);
  buildWall("x", -bc / 2, "y", dy_col, nx, t_col);
  buildWall("x", bc / 2, "y", dy_col, nx, t_col);

  // ── DIAFRAGMAS: 2 placas anulares en z_bot_flange y z_top_flange ──
  function buildDiaphragm(z: number) {
    const outerHalfX = bc / 2 + bd;
    const outerHalfY = hc / 2 + bd;
    const meshD = 2;  // 2 subdivisiones radiales (interior↔exterior)
    // Lado +Y
    const yIn = hc / 2, yOut = outerHalfY;
    for (let iy = 0; iy < meshD; iy++) {
      const y0 = yIn + (iy / meshD) * (yOut - yIn);
      const y1 = yIn + ((iy + 1) / meshD) * (yOut - yIn);
      for (let ix = 0; ix < nx + 2; ix++) {
        const x0 = -outerHalfX + (ix / (nx + 2)) * (2 * outerHalfX);
        const x1 = -outerHalfX + ((ix + 1) / (nx + 2)) * (2 * outerHalfX);
        addShell(addNode(x0, y0, z), addNode(x1, y0, z), addNode(x1, y1, z), addNode(x0, y1, z), td);
      }
    }
    // Lado -Y (espejo)
    for (let iy = 0; iy < meshD; iy++) {
      const y0 = -yIn - (iy / meshD) * (yOut - yIn);
      const y1 = -yIn - ((iy + 1) / meshD) * (yOut - yIn);
      for (let ix = 0; ix < nx + 2; ix++) {
        const x0 = -outerHalfX + (ix / (nx + 2)) * (2 * outerHalfX);
        const x1 = -outerHalfX + ((ix + 1) / (nx + 2)) * (2 * outerHalfX);
        addShell(addNode(x0, y0, z), addNode(x1, y0, z), addNode(x1, y1, z), addNode(x0, y1, z), td);
      }
    }
    // Lado +X
    const xIn = bc / 2;
    for (let ix = 0; ix < meshD; ix++) {
      const x0 = xIn + (ix / meshD) * bd;
      const x1 = xIn + ((ix + 1) / meshD) * bd;
      for (let iy = 0; iy < nx; iy++) {
        const y0 = -hc / 2 + (iy / nx) * hc;
        const y1 = -hc / 2 + ((iy + 1) / nx) * hc;
        addShell(addNode(x0, y0, z), addNode(x1, y0, z), addNode(x1, y1, z), addNode(x0, y1, z), td);
      }
    }
    // Lado -X
    for (let ix = 0; ix < meshD; ix++) {
      const x0 = -xIn - (ix / meshD) * bd;
      const x1 = -xIn - ((ix + 1) / meshD) * bd;
      for (let iy = 0; iy < nx; iy++) {
        const y0 = -hc / 2 + (iy / nx) * hc;
        const y1 = -hc / 2 + ((iy + 1) / nx) * hc;
        addShell(addNode(x0, y0, z), addNode(x1, y0, z), addNode(x1, y1, z), addNode(x0, y1, z), td);
      }
    }
  }
  buildDiaphragm(z_bot_flange);
  buildDiaphragm(z_top_flange);

  // ── VIGA W: alma vertical + 2 patines horizontales ──
  const dy_v = L_v / nv_x;
  const dz_v_alma = d_v / nv_z;

  const almaGrid: number[][] = [];
  for (let iz = 0; iz <= nv_z; iz++) {
    const row: number[] = [];
    const z = z_bot_flange + iz * dz_v_alma;
    for (let iy = 0; iy <= nv_x; iy++) {
      const y = hc / 2 + iy * dy_v;
      row.push(addNode(0, y, z));
    }
    almaGrid.push(row);
  }
  for (let iz = 0; iz < nv_z; iz++) {
    for (let iy = 0; iy < nv_x; iy++) {
      addShell(almaGrid[iz][iy], almaGrid[iz][iy + 1], almaGrid[iz + 1][iy + 1], almaGrid[iz + 1][iy], tw_v);
    }
  }

  const buildFlange = (z: number) => {
    const nx_f = 4;  // par
    const dx_f = bf_v / nx_f;
    const grid: number[][] = [];
    for (let iy = 0; iy <= nv_x; iy++) {
      const row: number[] = [];
      const y = hc / 2 + iy * dy_v;
      for (let ix = 0; ix <= nx_f; ix++) {
        const x = -bf_v / 2 + ix * dx_f;
        if (Math.abs(x) < 1e-7) {
          if (Math.abs(z - z_top_flange) < 1e-6) row.push(almaGrid[nv_z][iy]);
          else if (Math.abs(z - z_bot_flange) < 1e-6) row.push(almaGrid[0][iy]);
          else row.push(addNode(0, y, z));
        } else {
          row.push(addNode(x, y, z));
        }
      }
      grid.push(row);
    }
    for (let iy = 0; iy < nv_x; iy++) {
      for (let ix = 0; ix < nx_f; ix++) {
        addShell(grid[iy][ix], grid[iy][ix + 1], grid[iy + 1][ix + 1], grid[iy + 1][ix], tf_v);
      }
    }
  };
  buildFlange(z_top_flange);
  buildFlange(z_bot_flange);

  void wallFront;

  // ── BCs: empotrar columna en base z=0 y top z=Lz ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  nodes.forEach((pt, id) => {
    const onCol = Math.abs(pt[0]) <= bc / 2 + 1e-6 && Math.abs(pt[1]) <= hc / 2 + 1e-6;
    if (onCol && (Math.abs(pt[2]) < 1e-6 || Math.abs(pt[2] - Lz) < 1e-6)) {
      supports.set(id, [true, true, true, true, true, true]);
    }
  });

  // ── Carga: P en la punta de la viga (y = hc/2 + L_v) ──
  const tipNodes: number[] = [];
  nodes.forEach((pt, id) => {
    if (Math.abs(pt[1] - (hc / 2 + L_v)) < 1e-6 &&
        Math.abs(pt[0]) <= bf_v / 2 + 1e-6 &&
        pt[2] >= z_bot_flange - 1e-6 && pt[2] <= z_top_flange + 1e-6) tipNodes.push(id);
  });
  const fz = -P / Math.max(1, tipNodes.length);
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (const id of tipNodes) loads.set(id, [0, 0, fz, 0, 0, 0]);

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, poissonsRatios, densities, shearModuli, thicknesses,
    areas: dummyA, momentsOfInertiaZ: dummyIy, momentsOfInertiaY: dummyIz, torsionalConstants: dummyJ,
  };

  // ── BENCHMARK CIDECT/Cervantes: tensión en diafragma ──
  const M_joint = P * L_v;
  const F_flange = M_joint / d_v;
  const A_d = 2 * (bc + hc) * td;
  const sigma_d_an = F_flange / A_d;

  return { nodes, elements, nodeInputs, elementInputs, M_joint, A_d, sigma_d_an };
}

let ultimo: {
  malla: ConexionDiafragmaCftMalla;
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
} | null = null;

const F = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const conexionDiafragmaCft: ExampleDef = {
  id: "conexion-diafragma-cft",
  name: "Conexión Viga-Columna CFT con Diafragma (Cervantes)",
  category: "2️⃣ Shells · 🔩 Conexiones",
  defaultShellResult: "vonMises",
  params: {
    bc:    F("Columna CFT", "bc col (m)", 0.40, 0.25, 0.80, 0.05),
    hc:    F("Columna CFT", "hc col (m)", 0.40, 0.25, 0.80, 0.05),
    Lz:    F("Columna CFT", "Lz col (m)", 3.00, 1.5, 5.0, 0.5),
    t_col: F("Columna CFT", "t pared col (m)", 0.012, 0.006, 0.030, 0.002),
    d_v:   F("Viga W", "d viga (m)", 0.40, 0.20, 0.70, 0.02),
    bf_v:  F("Viga W", "bf viga (m)", 0.20, 0.10, 0.40, 0.02),
    tf_v:  F("Viga W", "tf patín (m)", 0.018, 0.008, 0.040, 0.002),
    tw_v:  F("Viga W", "tw alma (m)", 0.012, 0.006, 0.025, 0.002),
    L_v:   F("Viga W", "L viga (m, voladizo)", 2.00, 0.80, 4.00, 0.20),
    bd:    F("Diafragma", "bd diafragma (m, ancho radial)", 0.10, 0.04, 0.20, 0.02),
    td:    F("Diafragma", "td diafragma (m)", 0.020, 0.010, 0.040, 0.002),
    nx:    F("Malla", "nx col", 4, 2, 8, 2),
    nz:    F("Malla", "nz col", 8, 4, 14, 2),
    nv_x:  F("Malla", "nx viga", 8, 4, 14, 2),
    nv_z:  F("Malla", "nz alma viga", 4, 2, 8, 2),
    P:     { ...F("Cargas", "P punta viga (kN, -Z)", 50, 0, 300, 10), unitType: "force" },
  },
  guide: [
    "El diafragma externo transmite el par de patines de la viga a la pared de la columna CFT",
    "M_joint = P·L_v (voladizo); σ_diafragma analítico ≈ (M/d_v) / (2·(bc+hc)·td), aprox. CIDECT",
    "«📊 Calculados» compara σ_vM medido en el FEM contra ese valor analítico",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaConexionDiafragmaCft(p as unknown as ConexionDiafragmaCftParams);
    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(malla.nodes, malla.elements, malla.nodeInputs, malla.elementInputs);
      analyzeOutputs = analyze(malla.nodes, malla.elements, malla.elementInputs, deformOutputs);
      console.log(`Conexión diafragma: ${malla.nodes.length} nodos, ${malla.elements.length} shells`);
    } catch (e: any) {
      console.warn("Conexión diafragma:", e?.message ?? e);
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
    const { malla, analyzeOutputs } = ultimo;
    const fmtSci = (v: number) => v.toExponential(3);

    let vmMax = 0;
    const vmMap = (analyzeOutputs as any)?.vonMises as Map<number, number[]> | undefined;
    if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > vmMax) vmMax = v; }));
    const ratio = vmMax / Math.max(1, malla.sigma_d_an);

    return {
      "── Demanda (CIDECT/Cervantes) ──": "",
      "M en junta (kN·m)": fmtSci(malla.M_joint),
      "A diafragma (m²)": fmtSci(malla.A_d),
      "σ analítico (kN/m²)": fmtSci(malla.sigma_d_an),
      "── Hekatan (medido) ──": "",
      "σ vM max (kN/m²)": fmtSci(vmMax),
      "ratio Hek/Anal": ratio.toFixed(2),
    };
  },
};
