/**
 * Tablero de Puente — 3 vigas doble-T + losa shell (test Gustavo Solar).
 *
 * PROBLEMA QUE EL USUARIO REPORTA:
 *   En SAP2000 (y MITC4+) los esfuerzos de la viga difieren MUCHO de su programa
 *   propio. Causa habitual: vinculación incorrecta entre viga frame y losa shell.
 *
 * RECOMENDACIÓN GUSTAVO SOLAR (modelado correcto en SAP2000):
 *   Cuando insertás vigas frame con su EJE en el plano medio de la losa shell
 *   (nodos compartidos, sin offset), DEBES descontar la "ala efectiva de losa"
 *   del cálculo de la sección de la viga. La losa shell ya aporta esa ala como
 *   parte de su rigidez de membrana + flexión. Si modelás la viga T COMPLETA
 *   (con su patín superior), estás DUPLICANDO la rigidez del ala superior.
 *
 *   Sección a usar para la viga frame:
 *     ✓ Solo el alma + patín inferior  (la losa shell aporta el ala superior)
 *     ✗ NO la doble-T completa  (cuenta el ala superior dos veces)
 *
 * 3 MODOS (parámetro «Modo viga-losa», dropdown):
 *   0 = Naive: viga doble-T COMPLETA, eje al plano medio (rigidez duplicada)
 *   1 = Solar: viga "alma + patín inferior" SIN ala superior (correcto)
 *   2 = Eccentric: viga doble-T completa con OFFSET vertical (rigid link al
 *       centroide real, equivalente al método correcto pero con offset)
 *
 * El modo 1 (Solar) o 2 (Eccentric) debería coincidir con SAP2000, mientras que
 * el modo 0 (Naive) sobre-rigidiza por factor ~2.
 *
 * Graduado el 28-sep-2026 desde `main.ts` (página con panel propio). Los ficheros
 * de estudio de la carpeta (.cpd, .py, .e2k, .s2k) NO se tocan — son las réplicas
 * en SAP2000/ETABS con las que se validó el método Solar, quedan como referencia.
 *
 * NOTA (heredada, no corregida): en `elementInputs` los mapas de inercia de los
 * FRAMES se guardan como `Iy`/`Iz` locales pero ambos reciben el MISMO valor
 * `Imom` (I_beam o I_solar, según el modo) — la sección es simétrica alrededor
 * del eje débil solo de forma aproximada; se deja igual que la página original.
 */
import type { ExampleDef, BuildStates } from "../workspace/exampleRegistry";
import type { Node, Element, NodeInputs, ElementInputs, DeformOutputs, AnalyzeOutputs } from "hekatan-fem";
import { analyze, deform } from "hekatan-fem";
import * as THREE from "three";

// Materiales
// LOSA = concreto armado f'c=24 MPa
const Ec = 25e6;       // kN/m²
const nu_c = 0.20;
const Gc = Ec / (2 * (1 + nu_c));
const rho_c = 24 / 9.80665;  // tonf/m³ -> usado como densidad consistente kN/m³ en hekatan-fem
// VIGAS = acero estructural ASTM A36 (Fy=250 MPa, E=200 GPa)
const Es = 200e6;      // kN/m²
const nu_s = 0.30;
const Gs = Es / (2 * (1 + nu_s));
const rho_s = 78 / 9.80665;  // tonf/m³ -> 7.85 t/m³ acero

export interface TableroPuenteParams {
  L: number; W: number; t_s: number;
  s_b: number; bf: number; tf: number; hw: number; tw: number;
  modo: number; q: number; nx: number; ny: number;
}

export interface TableroPuenteMalla {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  objects3D: THREE.Object3D[];
  modo: number;
  beamFrameElements: number[];
  beamRowIndices: number[];
  slabGrid: number[][];
  nx: number;
  A_eff: number; I_eff: number;
  q: number; s_b: number; L: number;
}

/** Malla pura (losa shell + 3 vigas frame), sin estados ni DOM. */
export function mallaTableroPuente(p: TableroPuenteParams): TableroPuenteMalla {
  const { L, W, t_s, s_b, bf, tf, hw, tw, q } = p;
  const modo = Math.round(p.modo);
  const nx = Math.round(p.nx), ny = Math.round(p.ny);

  // ── Sección de la viga FRAME según modo ──
  // Doble-T completa
  const A_full  = 2 * bf * tf + hw * tw;
  const h_total = 2 * tf + hw;
  const I_full  = 2 * (bf * tf * Math.pow(hw / 2 + tf / 2, 2)) + tw * Math.pow(hw, 3) / 12;
  const J_full  = (bf * Math.pow(tf, 3) + bf * Math.pow(tf, 3) + hw * Math.pow(tw, 3)) / 3;

  // Solar: alma + patín inferior (ala superior viene de la losa)
  const A_solar  = bf * tf + hw * tw;
  const y_c_solar = (bf * tf * (tf / 2) + hw * tw * (tf + hw / 2)) / A_solar;
  const I_patin = bf * Math.pow(tf, 3) / 12 + bf * tf * Math.pow(y_c_solar - tf / 2, 2);
  const I_alma  = tw * Math.pow(hw, 3) / 12 + hw * tw * Math.pow(tf + hw / 2 - y_c_solar, 2);
  const I_solar = I_patin + I_alma;
  const J_solar = (bf * Math.pow(tf, 3) + hw * Math.pow(tw, 3)) / 3;

  const A_beam   = (modo === 1) ? A_solar  : A_full;
  const I_beam   = (modo === 1) ? I_solar  : I_full;
  const J_beam   = (modo === 1) ? J_solar  : J_full;
  const Z_BEAM_CENTROID = -t_s / 2 - h_total / 2;
  void Z_BEAM_CENTROID; // documentado en el encabezado; no se usa (no hay offset físico salvo modo 2 por Steiner)

  // ── Generar nodos y elementos ──
  const nodes: Node[] = [];
  const elements: Element[] = [];
  const thicknesses = new Map<number, number>();
  const elasticities = new Map<number, number>();
  const poissonsRatios = new Map<number, number>();
  const densities = new Map<number, number>();
  const shearModuli = new Map<number, number>();
  const areas = new Map<number, number>();
  const Iz = new Map<number, number>();
  const Iy = new Map<number, number>();
  const J = new Map<number, number>();

  function addNode(x: number, y: number, z: number): number {
    nodes.push([x, y, z]); return nodes.length - 1;
  }
  function addShell(n0: number, n1: number, n2: number, n3: number, t: number) {
    elements.push([n0, n1, n2, n3]);
    const i = elements.length - 1;
    thicknesses.set(i, t); elasticities.set(i, Ec); poissonsRatios.set(i, nu_c);
    densities.set(i, rho_c); shearModuli.set(i, Gc);
    areas.set(i, 0); Iy.set(i, 0); Iz.set(i, 0); J.set(i, 0);
  }
  function addFrame(n0: number, n1: number, A: number, Imom: number, Jt: number) {
    elements.push([n0, n1]);
    const i = elements.length - 1;
    elasticities.set(i, Es); poissonsRatios.set(i, nu_s);
    densities.set(i, rho_s); shearModuli.set(i, Gs);
    areas.set(i, A); Iy.set(i, Imom); Iz.set(i, Imom); J.set(i, Jt);
    thicknesses.set(i, 0);
  }

  // ── LOSA SHELL Q4 ──
  const yBeams = [W / 2 - s_b, W / 2, W / 2 + s_b];

  const dx = L / nx, dy = W / ny;
  const ys: number[] = [];
  for (let j = 0; j <= ny; j++) ys.push(j * dy);
  const beamRowIndices: number[] = [];
  for (const yB of yBeams) {
    let bestJ = 0, dmin = Infinity;
    for (let j = 0; j <= ny; j++) {
      const d = Math.abs(ys[j] - yB);
      if (d < dmin) { dmin = d; bestJ = j; }
    }
    ys[bestJ] = yB;
    beamRowIndices.push(bestJ);
  }

  const slabGrid: number[][] = [];
  for (let j = 0; j <= ny; j++) {
    const row: number[] = [];
    for (let i = 0; i <= nx; i++) {
      row.push(addNode(i * dx, ys[j], 0));
    }
    slabGrid.push(row);
  }
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      addShell(slabGrid[j][i], slabGrid[j][i + 1], slabGrid[j + 1][i + 1], slabGrid[j + 1][i], t_s);
    }
  }

  // ── VIGAS FRAME ──
  let I_eff = I_beam, A_eff = A_beam;
  if (modo === 2) {
    const offset = t_s / 2 + h_total / 2;
    I_eff = I_full + A_full * offset * offset;
    A_eff = A_full;
  }

  const beamFrameElements: number[] = [];
  for (const jBeam of beamRowIndices) {
    for (let i = 0; i < nx; i++) {
      const n0 = slabGrid[jBeam][i], n1 = slabGrid[jBeam][i + 1];
      addFrame(n0, n1, A_eff, I_eff, J_beam);
      beamFrameElements.push(elements.length - 1);
    }
  }

  // ── APOYOS SIMPLES en los extremos de cada viga ──
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  for (const jBeam of beamRowIndices) {
    const nL = slabGrid[jBeam][0];
    const nR = slabGrid[jBeam][nx];
    supports.set(nL, [true, true, true, false, false, false]);
    supports.set(nR, [false, true, true, false, false, false]);
  }

  // ── CARGAS: distribuida q (kN/m²) sobre la losa, repartida a nodos ──
  const loads = new Map<number, [number, number, number, number, number, number]>();
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const dy_eff = (j === 0 || j === ny) ? dy / 2 : dy;
      const dx_eff = (i === 0 || i === nx) ? dx / 2 : dx;
      const A_trib = dx_eff * dy_eff;
      const fz = -q * A_trib;
      const id = slabGrid[j][i];
      loads.set(id, [0, 0, fz, 0, 0, 0]);
    }
  }

  const nodeInputs: NodeInputs = { supports, loads };
  const elementInputs: ElementInputs = {
    elasticities, shearModuli, areas,
    momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
    densities, poissonsRatios, thicknesses,
  };

  // ── Decoración 3D EXTRUIDA TRANSPARENTE (tablero compuesto) ──
  const objs: THREE.Object3D[] = [];
  const matSlab = new THREE.MeshStandardMaterial({
    color: 0xbbbbbb, transparent: true, opacity: 0.25,
    roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide,
    depthWrite: false,
  });
  const slabBox = new THREE.Mesh(new THREE.BoxGeometry(L, W, t_s), matSlab);
  slabBox.position.set(L / 2, W / 2, 0);
  objs.push(slabBox);

  const matBeam = new THREE.MeshStandardMaterial({
    color: 0x00ddee, transparent: true, opacity: 0.45,
    roughness: 0.25, metalness: 0.6, side: THREE.DoubleSide,
    depthWrite: false,
  });
  for (const yB of yBeams) {
    if (modo === 1) {
      const beamWeb = new THREE.Mesh(new THREE.BoxGeometry(L, tw, hw), matBeam);
      beamWeb.position.set(L / 2, yB, -t_s / 2 - hw / 2);
      objs.push(beamWeb);
      const beamBot = new THREE.Mesh(new THREE.BoxGeometry(L, bf, tf), matBeam);
      beamBot.position.set(L / 2, yB, -t_s / 2 - hw - tf / 2);
      objs.push(beamBot);
    } else {
      const beamTop = new THREE.Mesh(new THREE.BoxGeometry(L, bf, tf), matBeam);
      beamTop.position.set(L / 2, yB, -t_s / 2 - tf / 2);
      objs.push(beamTop);
      const beamWeb = new THREE.Mesh(new THREE.BoxGeometry(L, tw, hw), matBeam);
      beamWeb.position.set(L / 2, yB, -t_s / 2 - tf - hw / 2);
      objs.push(beamWeb);
      const beamBot = new THREE.Mesh(new THREE.BoxGeometry(L, bf, tf), matBeam);
      beamBot.position.set(L / 2, yB, -t_s / 2 - tf - hw - tf / 2);
      objs.push(beamBot);
    }
  }

  const matBeamLine = new THREE.MeshStandardMaterial({
    color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 0.7,
  });
  for (const yB of yBeams) {
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, L, 16),
      matBeamLine,
    );
    cyl.rotation.z = Math.PI / 2;
    cyl.position.set(L / 2, yB, 0);
    objs.push(cyl);
  }

  return {
    nodes, elements, nodeInputs, elementInputs, objects3D: objs,
    modo, beamFrameElements, beamRowIndices, slabGrid, nx,
    A_eff, I_eff, q, s_b, L,
  };
}

let ultimo: {
  malla: TableroPuenteMalla;
  deformOutputs: DeformOutputs;
  analyzeOutputs: AnalyzeOutputs;
} | null = null;

const F = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });

export const tableroPuente: ExampleDef = {
  id: "tablero-puente",
  name: "Tablero Puente (3 vigas+losa, test Solar)",
  category: "4️⃣ Mixtos · 🌉 Puentes e icónicos",
  defaultShellResult: "vonMises",
  params: {
    L:   F("Geometría", "L luz (m)", 15.0, 5, 30, 0.5),
    W:   F("Geometría", "W ancho (m)", 6.0, 4, 12, 0.5),
    t_s: F("Geometría", "t losa (m)", 0.20, 0.10, 0.40, 0.01),
    s_b:  F("Vigas", "spacing vigas (m)", 2.0, 1.0, 4.0, 0.1),
    bf:   F("Vigas", "bf patines (m)", 0.20, 0.10, 0.50, 0.01),
    tf:   F("Vigas", "tf patines (m)", 0.015, 0.008, 0.040, 0.001),
    hw:   F("Vigas", "hw alma (m)", 0.55, 0.30, 1.20, 0.025),
    tw:   F("Vigas", "tw alma (m)", 0.010, 0.005, 0.030, 0.001),
    modo: {
      default: 1,
      label: "Modo viga-losa",
      options: { "0 — Naive (doble-T completa)": 0, "1 — Solar (alma+patín inf)": 1, "2 — Eccentric (offset rigid link)": 2 },
      folder: "Vinculación viga-losa",
    },
    q:   { ...F("Cargas", "q losa (kN/m²)", 15.0, 1, 50, 0.5) },
    nx:  F("Malla", "Mesh nx (long)", 20, 8, 40, 2),
    ny:  F("Malla", "Mesh ny (transv)", 12, 4, 24, 2),
  },
  guide: [
    "Modo 1 (Solar) coincide con SAP2000: la losa shell YA aporta el ala superior de la viga",
    "Modo 0 (Naive, doble-T completa) SOBRE-rigidiza por ~2× — duplica el ala superior",
    "Modo 2 (Eccentric) ≈ Modo 1 si el offset de Steiner está bien puesto",
  ],
  build: (p: Record<string, number>, states: BuildStates) => {
    const malla = mallaTableroPuente(p as unknown as TableroPuenteParams);
    let deformOutputs: DeformOutputs = {} as DeformOutputs;
    let analyzeOutputs: AnalyzeOutputs = {} as AnalyzeOutputs;
    try {
      deformOutputs = deform(malla.nodes, malla.elements, malla.nodeInputs, malla.elementInputs);
      analyzeOutputs = analyze(malla.nodes, malla.elements, malla.elementInputs, deformOutputs);
    } catch (e: any) { console.warn("tablero-puente:", e?.message ?? e); }
    ultimo = { malla, deformOutputs, analyzeOutputs };

    states.nodes.val = malla.nodes;
    states.elements.val = malla.elements;
    states.nodeInputs.val = malla.nodeInputs;
    states.elementInputs.val = malla.elementInputs;
    states.deformOutputs.val = deformOutputs;
    states.analyzeOutputs.val = analyzeOutputs;
    states.objects3D.val = malla.objects3D;
  },
  computedLabels: () => {
    if (!ultimo) return {};
    const { malla, deformOutputs, analyzeOutputs } = ultimo;
    const ao = analyzeOutputs as any;

    let M_max_kNm = 0, V_max_kN = 0;
    const M_map = ao?.bendingsY as Map<number, number[]> | undefined;
    const V_map = ao?.shearsZ as Map<number, number[]> | undefined;
    const startIdxBeamCentral = malla.nx;
    for (let i = 0; i < malla.nx; i++) {
      const eIdx = malla.beamFrameElements[startIdxBeamCentral + i];
      const ms = M_map?.get(eIdx);
      const vs = V_map?.get(eIdx);
      if (ms) for (const m of ms) if (Math.abs(m) > M_max_kNm) M_max_kNm = Math.abs(m);
      if (vs) for (const v of vs) if (Math.abs(v) > V_max_kN) V_max_kN = Math.abs(v);
    }
    if (M_max_kNm === 0) {
      const M2 = ao?.bendingsZ as Map<number, number[]> | undefined;
      const V2 = ao?.shearsY as Map<number, number[]> | undefined;
      for (let i = 0; i < malla.nx; i++) {
        const eIdx = malla.beamFrameElements[startIdxBeamCentral + i];
        const ms = M2?.get(eIdx); const vs = V2?.get(eIdx);
        if (ms) for (const m of ms) if (Math.abs(m) > M_max_kNm) M_max_kNm = Math.abs(m);
        if (vs) for (const v of vs) if (Math.abs(v) > V_max_kN) V_max_kN = Math.abs(v);
      }
    }

    const jBeamCentral = malla.beamRowIndices[1];
    const i_mid = Math.round(malla.nx / 2);
    const nMid = malla.slabGrid[jBeamCentral][i_mid];
    const def = deformOutputs.deformations;
    const w_mid = def?.get(nMid)?.[2] ?? 0;
    const delta_mm = Math.abs(w_mid * 1000);

    let vM_slab_max = 0;
    const vmMap = ao?.vonMises as Map<number, number[]> | undefined;
    if (vmMap) vmMap.forEach((arr) => arr.forEach((v) => { if (v > vM_slab_max) vM_slab_max = v; }));

    const q_eff = malla.q * malla.s_b;
    const M_naive_teorico = q_eff * malla.L * malla.L / 8;
    const ratio_naive = M_max_kNm / Math.max(0.001, M_naive_teorico);

    const modoLabel = ["0 — Naive (doble-T)", "1 — Solar (alma+patín inf)", "2 — Eccentric (offset)"][malla.modo];

    return {
      "── Sección viga FRAME usada ──": "",
      "Modo activo": modoLabel,
      "A (m²)": malla.A_eff.toFixed(5),
      "Iz (m⁴)": malla.I_eff.toExponential(3),
      "── Resultados análisis ──": "",
      "M max viga (kN·m)": M_max_kNm.toFixed(1),
      "V max viga (kN)": V_max_kN.toFixed(1),
      "δ midspan (mm)": delta_mm.toFixed(2),
      "σvM losa max (kN/m²)": vM_slab_max.toExponential(3),
      "M / (qL²/8)": ratio_naive.toFixed(3),
    };
  },
};
