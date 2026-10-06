/**
 * PANDEO DE MUROS Y LOSAS (cáscaras) — Load Case «Buckling» de SAP2000 (5-oct-2026).
 *   [K − λ·G(r)]·Ψ = 0     G de la cáscara (CSiRefer p.444): las fuerzas de membrana del estático de r (Nxx, Nyy, Nxy en
 *   Gauss 2×2) integradas con las derivadas de las funciones de forma, sobre u, v, w de cada nudo.
 *
 * Tres casos con solución conocida (Timoshenko) y la MISMA malla que se armó en SAP2000 24 por OAPI
 * (validation/pandeo_cascara: modelos.py, sap_pandeo_cascara.py). Con las medidas de SAP, sus λ van al lado.
 * Test: `node tests/run.mjs pandeo-cascara` → λ de todos los modos y formas (MAC) = SAP2000.
 * La deformada que se ve ES la forma de pandeo del modo elegido; el colormap de membrana es el estático (compresión).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { deform, analyze, bucklingAnalysis } from "hekatan-fem";

const E = 2.0e8, NU = 0.3;   // acero, kN/m²

// λ de SAP2000 24 (Buckling, 8 modos pedidos, tol 1e-12), Shell-Thin, la malla de abajo nudo a nudo
const SAP: Record<string, number[]> = {
  placa_4x2: [9.062891, 11.307982, 15.206642, 2661.350807, 5635.781318, 5767.735991],
  placa_16x8: [7.340326, 8.675551, 11.520258, 11.752693, 16.225668, 22.147228],
  muro_2x3: [16.467314, 177.394403, 278.703012, 457.269373, 598.636276, 899.23643],
  muro_8x12: [16.134187, 147.091117, 265.23099, 405.758275, 424.037198, 685.312405],
  losa_4x4: [13.20701, -13.20701, 19.307249, -19.307249, 7756.141277, -7756.141277],
  losa_12x12: [8.825065, -8.825065, 11.098866, -11.098866, -26.077947, 26.077948],
  // 6-oct-2026: la MISMA malla con cada Q4 partido en dos triángulos por la diagonal 1-3
  placa_t4x2: [6.862349, 8.43578, 10.449085, 3804.175594, 6564.008082, 7858.315913],
  placa_t16x8: [7.218383, 8.555321, 11.26157, 11.590099, 15.967785, 21.704833],
  muro_t2x3: [16.555252, 171.475711, 195.175191, 336.290804, 539.452674, 626.036192],
  muro_t8x12: [16.156489, 147.279822, 259.154472, 399.014548, 424.587669, 678.689665],
  losa_t4x4: [6.76469, 9.795688, 14.792096, 17.335286, 17.947872, 30.212854],
  losa_t12x12: [8.247531, -9.714253, 10.397831, -12.154781, 22.066929, 23.765358],
};
// medidas con que se armaron en SAP2000 (tipo → a, b, t, q)
const MEDIDAS_SAP = [[2, 1, 0.01, 100], [2, 3, 0.15, 1000], [4, 4, 0.02, 100]];
const DEFECTOS = [{ a: 2, b: 1, t: 0.01, q: 100, nx: 16, ny: 8 }, { a: 2, b: 3, t: 0.15, q: 1000, nx: 8, ny: 12 },
  { a: 4, b: 4, t: 0.02, q: 100, nx: 12, ny: 12 }];

export type ModeloCascara = { nodes: number[][]; elements: number[][]; apoyos: Map<number, boolean[]>; cargas: Map<number, number[]>; lamTimoshenko: number; nombre: string };

/** La malla de validation/pandeo_cascara/modelos.py (misma numeración). tipo 0 placa, 1 muro (plano XZ), 2 losa en cortante. */
export function armarCascara(tipo: number, a: number, b: number, t: number, q: number, nx: number, ny: number, triangulos = false): ModeloCascara {
  if (tipo === 2) ny = nx, b = a;
  const nodes: number[][] = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const x = (a * i) / nx, y = (b * j) / ny;
    nodes.push(tipo === 1 ? [x, 0, y] : [x, y, 0]);
  }
  const id = (i: number, j: number) => i + j * (nx + 1);
  const elements: number[][] = [];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const c = [id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)];
    if (triangulos) elements.push([c[0], c[1], c[2]], [c[0], c[2], c[3]]);   // como modelos.py: diagonal 1-3
    else elements.push(c);
  }
  const apoyos = new Map<number, boolean[]>(), cargas = new Map<number, number[]>();
  const suma = (k: number, v: number[]) => { const c = cargas.get(k) ?? [0, 0, 0, 0, 0, 0]; v.forEach((x, z) => (c[z] += x)); cargas.set(k, c); };
  const D = (E * t ** 3) / (12 * (1 - NU ** 2));
  let lam = 0;
  if (tipo === 1) {                     // muro ménsula: base empotrada, carga vertical repartida en la cabeza
    for (let i = 0; i <= nx; i++) apoyos.set(id(i, 0), [true, true, true, true, true, true]);
    const h = a / nx;
    for (let i = 0; i <= nx; i++) suma(id(i, ny), [0, 0, -q * h * (i === 0 || i === nx ? 0.5 : 1), 0, 0, 0]);
    lam = (Math.PI ** 2 * D) / (4 * b * b) / q;
  } else {                              // placa / losa simplemente apoyada en los 4 bordes
    for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++)
      if (i === 0 || i === nx || j === 0 || j === ny) apoyos.set(id(i, j), [false, false, true, false, false, false]);
    apoyos.set(id(0, 0), [true, true, true, false, false, false]); apoyos.set(id(nx, 0), [false, true, true, false, false, false]);
    if (tipo === 0) {                   // compresión q (kN/m) en x = 0 y x = a
      const h = b / ny;
      for (let j = 0; j <= ny; j++) { const f = q * h * (j === 0 || j === ny ? 0.5 : 1); suma(id(0, j), [f, 0, 0, 0, 0, 0]); suma(id(nx, j), [-f, 0, 0, 0, 0, 0]); }
      // Timoshenko: k = mín (m·b/a + a/(m·b))² (k = 4 con a/b entero)
      let k = Infinity; for (let m = 1; m <= 20; m++) k = Math.min(k, ((m * b) / a + a / (m * b)) ** 2);
      lam = (k * Math.PI ** 2 * D) / (b * b) / q;
    } else {                            // cortante puro τ·t = q en los cuatro bordes
      const h = a / nx;
      for (let k = 0; k <= nx; k++) {
        const f = q * h * (k === 0 || k === nx ? 0.5 : 1);
        suma(id(k, nx), [f, 0, 0, 0, 0, 0]); suma(id(k, 0), [-f, 0, 0, 0, 0, 0]);
        suma(id(nx, k), [0, f, 0, 0, 0, 0]); suma(id(0, k), [0, -f, 0, 0, 0, 0]);
      }
      lam = (9.34 * Math.PI ** 2 * D) / (a * a) / q;
    }
  }
  const nombre = ["placa", "muro", "losa"][tipo] + `_${triangulos ? "t" : ""}${nx}x${ny}`;
  return { nodes, elements, apoyos, cargas, lamTimoshenko: lam, nombre };
}

let ultimo: { lam: number[]; ref?: number[]; timo: number; nombre: string; ms: number; err?: string } | null = null;
const NFIL = 6;

export const pandeoCascara: ExampleDef = {
  id: "pandeo-cascara-sap2000",
  name: "Pandeo de muros y losas (Buckling de cáscaras) — igual que SAP2000",
  category: "2️⃣ Shells · ✅ Validación CSI",
  params: {
    tipo: { default: 0, label: "Caso", folder: "Modelo", options: { "Placa comprimida (k = 4)": 0, "Muro ménsula, carga en la cabeza": 1, "Losa en cortante puro (k = 9.34)": 2 } },
    a: { default: 2, label: "Largo a (m)", folder: "Modelo", min: 0.5, max: 20, step: 0.1 },
    b: { default: 1, label: "Ancho b / alto H (m)", folder: "Modelo", min: 0.5, max: 20, step: 0.1 },
    t: { default: 0.01, label: "Espesor t (m)", folder: "Modelo", min: 0.002, max: 0.5, step: 0.001 },
    q: { default: 100, label: "Carga q (kN/m de borde)", folder: "Modelo", min: 1, max: 100000, step: 1 },
    nx: { default: 16, label: "Malla nx", folder: "Malla", min: 1, max: 40, step: 1 },
    ny: { default: 8, label: "Malla ny", folder: "Malla", min: 1, max: 40, step: 1 },
    elem: { default: 0, label: "Elemento", folder: "Malla", options: { "Q4 (cuadriláteros)": 0, "Triángulos (cada Q4 en dos)": 1 } },
    modo: { default: 1, label: "Modo que se dibuja", folder: "Pandeo", min: 1, max: NFIL, step: 1 },
  },
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementX", "displacementY", "displacementZ", "membraneXX", "membraneYY", "membraneXY"],
  guide: [
    "Pandeo = el factor λ por el que hay que multiplicar las cargas para que la placa o el muro se vuelva inestable",
    "La deformada 3D ES la forma de pandeo del «Modo que se dibuja»; el muro pandea en Y (colormap displacementY)",
    "📊 Calculados: λ de Hekatan Struct, de SAP2000 (con las medidas de la validación) y de Timoshenko",
    "Settings › ⟂ Pandeo (lineal): ▶ Calcular y 🎞 animar cualquier modelo con cáscaras",
  ],
  onParamChange(key, p) {
    if (key !== "tipo") return;
    const d = DEFECTOS[Math.round(p.tipo)];
    Object.assign(p, d);
    try { const s = (window as any).__hekatanSettings?.(); if (s?.shellResults) setTimeout(() => (s.shellResults.val = Math.round(p.tipo) === 1 ? "displacementY" : "displacementZ"), 0); } catch { /* sin visor */ }
  },
  build(p, states) {
    const tipo = Math.round(p.tipo), nx = Math.max(1, Math.round(p.nx)), ny = Math.max(1, Math.round(p.ny));
    const M = armarCascara(tipo, p.a, p.b, p.t, p.q, nx, ny, Math.round(p.elem ?? 0) === 1);
    const em = (v: number) => new Map(M.elements.map((_, e) => [e, v]));
    const ei: any = { elasticities: em(E), poissonsRatios: em(NU), thicknesses: em(p.t), shearModuli: em(E / (2 * (1 + NU))),
      plateFormulations: em(1), densities: em(0), etabsWallJoint: false };
    states.nodes.val = M.nodes as any; states.elements.val = M.elements as any;
    states.nodeInputs.val = { supports: M.apoyos, loads: M.cargas } as any;
    states.elementInputs.val = ei;
    const med = MEDIDAS_SAP[tipo];
    const igual = Math.abs(p.a - med[0]) < 1e-9 && (tipo === 2 || Math.abs(p.b - med[1]) < 1e-9) && Math.abs(p.t - med[2]) < 1e-12 && Math.abs(p.q - med[3]) < 1e-9;
    const t0 = performance.now();
    try {
      const d = deform(M.nodes as any, M.elements as any, states.nodeInputs.val, ei);
      states.analyzeOutputs.val = analyze(M.nodes as any, M.elements as any, ei, d);
      const r = bucklingAnalysis(M.nodes as any, M.elements as any, states.nodeInputs.val, ei, undefined, NFIL + 2, d.deformations);
      if (!r || !r.factors.length) throw new Error("sin modos (¿no hay compresión?)");
      // orden: |λ| creciente y, a igual |λ| (losa en cortante: ±λ), el positivo primero
      const orden = r.factors.map((_, k) => k).sort((i, j) => {
        const a = Math.abs(r.factors[i]), b = Math.abs(r.factors[j]);
        return Math.abs(a - b) > 1e-9 * Math.max(a, b) ? a - b : r.factors[j] - r.factors[i];
      });
      const lam = orden.map((k) => r.factors[k]), formas = orden.map((k) => r.modeShapes[k]);
      const m = Math.min(formas.length, Math.max(1, Math.round(p.modo))) - 1, psi = formas[m];
      const def = new Map<number, number[]>();
      M.nodes.forEach((_, q) => def.set(q, psi.slice(6 * q, 6 * q + 6)));
      states.deformOutputs.val = { deformations: def, reactions: new Map() } as any;
      ultimo = { lam, ref: igual ? SAP[M.nombre] : undefined, timo: M.lamTimoshenko, nombre: M.nombre, ms: performance.now() - t0 };
    } catch (e) { console.warn("[pandeo-cascara]", e); ultimo = { lam: [], timo: M.lamTimoshenko, nombre: M.nombre, ms: 0, err: String(e) }; }
    states.objects3D.val = [];
  },
  computedLabels() {
    const o: Record<string, string> = {};
    const u = ultimo;
    for (let k = 0; k < NFIL; k++) {
      const l = u?.lam[k];
      if (l === undefined) { o[`modo ${k + 1}: λ`] = "—"; continue; }
      // SAP: el λ más cercano (±λ de la losa en cortante salen en otro orden)
      let ref: number | undefined;
      if (u?.ref) ref = u.ref.reduce((b, x) => (Math.abs(x / l - 1) < Math.abs(b / l - 1) ? x : b), u.ref[0]);
      o[`modo ${k + 1}: λ`] = ref !== undefined && Math.abs(ref / l - 1) < 1e-3
        ? `${l.toFixed(4)} · SAP2000 ${ref.toFixed(4)} (${(100 * (l / ref - 1)).toFixed(4)} %)` : `${l.toFixed(4)} · SAP2000 —`;
    }
    o["Timoshenko (λ₁ placa continua)"] = u ? `${u.timo.toFixed(4)}${u.lam[0] ? `  (malla: ${(100 * (u.lam[0] / u.timo - 1)).toFixed(2)} %)` : ""}` : "—";
    o["λ₁"] = !u || !u.lam.length ? `✗ ${u?.err ?? "no se pudo calcular"}` : u.lam[0] > 1 ? "> 1: aguanta las cargas" : u.lam[0] > 0 ? "< 1: PANDEA antes" : "< 0: pandea con las cargas invertidas";
    o["Referencia"] = u?.ref ? `SAP2000 24, ${u.nombre}, misma malla (validation/pandeo_cascara)` : "SAP2000 — con las medidas de la validación y malla 4×2/16×8 (placa), 2×3/8×12 (muro), 4×4/12×12 (losa)";
    o["Tiempo"] = u ? `${u.ms.toFixed(0)} ms` : "—";
    return o;
  },
};
