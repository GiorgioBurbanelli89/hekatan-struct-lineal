/**
 * PANDEO LINEAL — ejemplo del Load Case «Buckling» de SAP2000 (1-oct-2026).
 *   [K − λ·G(r)]·Ψ = 0    λ = factor que multiplica las cargas r hasta que la estructura pandea.
 *
 * Los MISMOS modelos que se armaron en SAP2000 24 por OAPI (validation/pandeo/sap_pandeo.py): las secciones son las
 * que reporta SAP2000 para cada rectángulo (A, I22, I33, As2, As3, J) y sus factores van al lado de los de Hekatan.
 * Test: `node tests/run.mjs pandeo` → 0.0000 % en los 28 modos.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { deform, analyze, bucklingAnalysis } from "hekatan-fem";

const E = 2.5e7, NU = 0.2;
// propiedades de sección que devuelve SAP2000 (PropFrame.GetSectProps) para SetRectangle(t3 = canto, t2 = ancho)
export const SEC: Record<string, { A: number; As2: number; As3: number; J: number; I22: number; I33: number }> = {
  "R0.3x0.3": { A: 0.09, As2: 0.075, As3: 0.075, J: 0.0011407499999999994, I22: 0.000675, I33: 0.000675 },
  "R0.3x0.4": { A: 0.12, As2: 0.1, As3: 0.1, J: 0.0019438505859374997, I22: 0.0009, I33: 0.0016 },
  "R0.25x0.5": { A: 0.125, As2: 0.10416666666666667, As3: 0.10416666666666667, J: 0.0017881266276041667, I22: 0.0006510416666666666, I33: 0.0026041666666666665 },
  "R0.4x0.4": { A: 0.16, As2: 0.13333333333333333, As3: 0.13333333333333333, J: 0.003605333333333335, I22: 0.002133333333333334, I33: 0.002133333333333334 },
  "R0.3x0.5": { A: 0.15, As2: 0.125, As3: 0.125, J: 0.0028173708, I22: 0.001125, I33: 0.003125 },
};
// factores λ de SAP2000 24 (Buckling, 6 modos, tol 1e-12)
const SAP: Record<string, number[]> = {
  columna_1: [4.638402, 4.638402, 60.420115, 60.420115], columna_4: [4.599634, 4.599634, 39.828951, 39.828951, 105.397217, 105.397217],
  portico_1: [1.273925, 11.212144, 22.736013, 46.395383, 100.58626, 112.017677], portico_4: [1.273796, 11.093522, 22.286682, 36.486682, 69.325426, 72.979775],
  edificio_4: [7.537365, 10.474545, 10.598172, 14.396064, 18.404848, 19.786311],
};

type Barra = [number, number, string, number];   // nudo i, nudo j, sección, ángulo
export type Modelo = { nodes: number[][]; frames: Barra[]; apoyos: Map<number, boolean[]>; cargas: Map<number, number[]> };

export function armar(tipo: number, n: number): Modelo {
  const nodes: number[][] = [], frames: Barra[] = [];
  const nudo = (p: number[]) => { const q = nodes.findIndex((x) => Math.max(...x.map((v, c) => Math.abs(v - p[c]))) < 1e-9); if (q >= 0) return q; nodes.push(p); return nodes.length - 1; };
  const linea = (a: number[], b: number[], sec: string, ang = 0) => {
    const ids = Array.from({ length: n + 1 }, (_, k) => nudo([0, 1, 2].map((c) => a[c] + ((b[c] - a[c]) * k) / n)));
    for (let k = 0; k < n; k++) frames.push([ids[k], ids[k + 1], sec, ang]);
  };
  const apoyos = new Map<number, boolean[]>(), cargas = new Map<number, number[]>();
  const fijo = [true, true, true, true, true, true], art = [true, true, true, false, false, false];
  if (tipo === 0) {               // columna en voladizo: Euler P = π²EI/(4L²)
    linea([0, 0, 0], [0, 0, 3], "R0.3x0.3");
    apoyos.set(0, fijo); cargas.set(nudo([0, 0, 3]), [0, 0, -1000, 0, 0, 0]);
  } else if (tipo === 1) {        // pórtico: una columna girada 30°, la otra articulada
    linea([0, 0, 0], [0, 0, 3], "R0.3x0.4"); linea([5, 0, 0], [5, 0, 3], "R0.3x0.4", 30); linea([0, 0, 3], [5, 0, 3], "R0.25x0.5");
    apoyos.set(nudo([0, 0, 0]), fijo); apoyos.set(nudo([5, 0, 0]), art);
    cargas.set(nudo([0, 0, 3]), [20, 0, -800, 0, 0, 0]); cargas.set(nudo([5, 0, 3]), [0, 0, -800, 0, 0, 0]);
  } else {                        // edificio 2×2 vanos, 2 pisos
    for (const [z0, z1] of [[0, 3], [3, 6]]) {
      for (const x of [0, 4, 8]) for (const y of [0, 4, 8]) linea([x, y, z0], [x, y, z1], "R0.4x0.4");
      for (const y of [0, 4, 8]) for (const x0 of [0, 4]) linea([x0, y, z1], [x0 + 4, y, z1], "R0.3x0.5");
      for (const x of [0, 4, 8]) for (const y0 of [0, 4]) linea([x, y0, z1], [x, y0 + 4, z1], "R0.3x0.5", 90);
    }
    nodes.forEach((p, q) => {
      if (Math.abs(p[2]) < 1e-9) apoyos.set(q, fijo);
      if (Math.abs(p[2] - 3) < 1e-9 || Math.abs(p[2] - 6) < 1e-9) cargas.set(q, [0, 0, -400, 0, 0, 0]);
      if (Math.abs(p[2] - 6) < 1e-9 && p[0] === 0 && [0, 4, 8].includes(p[1])) cargas.set(q, [30, 0, -400, 0, 0, 0]);
    });
  }
  return { nodes, frames, apoyos, cargas };
}

let ultimo: { lam: number[]; ref?: number[]; clave: string } | null = null;

export const pandeoSap: ExampleDef = {
  id: "pandeo-sap2000",
  name: "Pandeo lineal (Buckling) — igual que SAP2000",
  category: "1️⃣ Frames · 🏢 Edificios",
  params: {
    tipo: { default: 1, label: "Modelo", folder: "Modelo", options: { "Columna en voladizo (Euler)": 0, "Pórtico 3D": 1, "Edificio 2×2 vanos, 2 pisos": 2 } },
    n: { default: 4, label: "trozos por barra", folder: "Modelo", options: { "1": 1, "2": 2, "4": 4, "8": 8 } },
    modos: { default: 6, label: "N° de modos", folder: "Modelo", min: 1, max: 12, step: 1 },
  },
  guide: [
    "Pandeo = el factor λ por el que hay que multiplicar las cargas para que la estructura se vuelva inestable",
    "λ > 1: aguanta las cargas · λ < 1: pandea antes de llegar a ellas",
    "📊 Calculados: λ de Hekatan Struct y de SAP2000 (mismo modelo, misma malla); con 1 o 4 trozos hay referencia",
    "Panel izquierdo (Settings) › ⟂ Pandeo (lineal): ▶ Calcular y 🎞 animar cada modo",
  ],
  build(p, states) {
    const tipo = Math.round(p.tipo), n = Math.round(p.n);
    const M = armar(tipo, n);
    const ei: any = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(), momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(),
      torsionalConstants: new Map(), poissonsRatios: new Map(), densities: new Map(), shearAreasY: new Map(), shearAreasZ: new Map(), localAngles: new Map() };
    M.frames.forEach(([, , s, ang], e) => {
      const S = SEC[s];
      ei.elasticities.set(e, E); ei.shearModuli.set(e, E / (2 * (1 + NU))); ei.poissonsRatios.set(e, NU); ei.densities.set(e, 0);
      ei.areas.set(e, S.A); ei.momentsOfInertiaZ.set(e, S.I33); ei.momentsOfInertiaY.set(e, S.I22); ei.torsionalConstants.set(e, S.J);
      ei.shearAreasZ.set(e, S.As2); ei.shearAreasY.set(e, S.As3); if (ang) ei.localAngles.set(e, ang);
    });
    const elements = M.frames.map(([i, j]) => [i, j]);
    states.nodes.val = M.nodes as any; states.elements.val = elements as any;
    states.nodeInputs.val = { supports: M.apoyos, loads: M.cargas } as any;
    states.elementInputs.val = ei;
    try {
      const d = deform(M.nodes as any, elements as any, states.nodeInputs.val, ei);
      states.deformOutputs.val = d;
      const a = analyze(M.nodes as any, elements as any, ei, d);
      states.analyzeOutputs.val = a;
      const r = bucklingAnalysis(M.nodes as any, elements as any, states.nodeInputs.val, ei, (a as any).normals, Math.round(p.modos));
      const clave = ["columna", "portico", "edificio"][tipo] + "_" + n;
      ultimo = { lam: r?.factors ?? [], ref: SAP[clave], clave };
    } catch (e) { console.warn("[pandeo-sap2000]", e); ultimo = null; }
    states.objects3D.val = [];
  },
  computedLabels() {
    const o: Record<string, string> = {};
    if (!ultimo || !ultimo.lam.length) { o["Pandeo"] = "✗ no se pudo calcular"; return o; }
    ultimo.lam.forEach((l, k) => {
      const ref = ultimo!.ref?.[k];
      o[`modo ${k + 1}: λ`] = ref !== undefined ? `${l.toFixed(4)}  · SAP2000 ${ref.toFixed(4)}  (${(100 * (l / ref - 1)).toFixed(4)} %)` : `${l.toFixed(4)}  · SAP2000 —`;
    });
    o["λ₁"] = ultimo.lam[0] > 1 ? "> 1: aguanta las cargas" : "< 1: PANDEA antes";
    o["Referencia"] = ultimo.ref ? "SAP2000 24, mismo modelo (validation/pandeo)" : "sin referencia de SAP2000 con estos trozos (use 1 o 4)";
    return o;
  },
};
