/**
 * 🔒 Mesa Torsión No Lineal — vitrina pública del análisis NO-LINEAL de torsión por
 * compatibilidad. Construye la "mesa" (losa 6×6 sobre 4 vigas + 4 columnas) y presenta,
 * en el panel "📊 Resultados", el concepto y los números clave.
 *
 * IMPORTANTE: el SOLVER no-lineal (iteración del modificador J en ETABS, redistribución a
 * la losa al fisurar) vive en el repo PRIVADO `hekatan-pro-struct`. Este ejemplo público
 * es solo la PRESENTACIÓN del tema (el deploy es el link compartible). Los números mostrados
 * fueron validados contra ETABS (Mesa torsiónT.EDB) con la API.
 */
import type { ExampleDef, ParamDef } from "../workspace/exampleRegistry";
import { deform, type Node, type Element } from "hekatan-fem";

const E = 2534564, NU = 0.20, RHO = 2.40277, G = E / (2 * (1 + NU));

// ── ACI 318 §22.7.5: φTcr = φ·0.33·λ·√f'c·(Acp²/pcp) ──
function phiTcr(fcMPa: number, b: number, h: number): { Tcr: number; phiTcr: number } {
  const Acp = b * h * 1e6, pcp = 2 * (b + h) * 1e3;          // mm², mm
  const Tcr = 0.33 * 1.0 * Math.sqrt(fcMPa) * (Acp ** 2 / pcp) / 1e6 / 9.80665; // tonf·m
  return { Tcr, phiTcr: 0.75 * Tcr };
}

const BASE: Record<string, ParamDef> = {
  Lx:    { default: 6, min: 4, max: 10, step: 0.5, label: "Lado X [m]", folder: "Geometría" },
  Ly:    { default: 6, min: 4, max: 10, step: 0.5, label: "Lado Y [m]", folder: "Geometría" },
  hcol:  { default: 4, min: 3, max: 6, step: 0.5, label: "Altura columna [m]", folder: "Geometría" },
  ms:    { default: 1.0, min: 0.5, max: 2.0, step: 0.25, label: "Malla losa [m]", folder: "Geometría" },
  bBeam: { default: 0.30, min: 0.25, max: 0.40, step: 0.05, label: "Viga b [m]", folder: "Sección viga" },
  hBeam: { default: 0.50, min: 0.40, max: 0.70, step: 0.05, label: "Viga h [m]", folder: "Sección viga" },
  fc:    { default: 281, min: 210, max: 350, step: 1, label: "f'c [kgf/cm²]", folder: "Material" },
  tSlab: { default: 0.10, min: 0.08, max: 0.20, step: 0.01, label: "Espesor losa [m]", folder: "Sección losa" },
  q:     { default: 1.7, min: 0.5, max: 3.0, step: 0.1, label: "Carga UDCon2 [tonf/m²]", folder: "Cargas" },
  // ⬇ NO LINEALIDAD: modificador de la Constante Torsional J de las vigas. fJ=1 = sin fisurar
  // (lineal, GJ íntegro → torsión grande). fJ→0 = viga agrietada → la torsión cae y redistribuye.
  fJ:    { default: 1.0, min: 0.01, max: 1.0, step: 0.01, label: "🔧 Modificador J viga (fisuración)", folder: "🔒 No Lineal" },
};

function build(p: Record<string, number>, states: any) {
  const Lx = p.Lx, Ly = p.Ly, hc = p.hcol, ms = Math.max(0.5, p.ms);
  const nodes: Node[] = [], elements: Element[] = [], kinds: string[] = [];
  const key = new Map<string, number>();
  const nid = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = key.get(k); if (i === undefined) { i = nodes.length; nodes.push([x, y, z]); key.set(k, i); } return i;
  };
  // 4 columnas de esquina
  for (const [x, y] of [[0, 0], [Lx, 0], [Lx, Ly], [0, Ly]])
    { elements.push([nid(x, y, 0), nid(x, y, hc)]); kinds.push("col"); }
  const meshLine = (L: number) => { const out: number[] = [0]; const n = Math.max(1, Math.round(L / ms)); for (let s = 1; s <= n; s++) out.push(L * s / n); return out; };
  const xm = meshLine(Lx), ym = meshLine(Ly);
  // 4 vigas perimetrales MALLADAS: cada segmento comparte nodo con el borde de la losa, así
  // la losa le transfiere el giro a lo LARGO de la viga → se desarrolla la torsión de
  // compatibilidad (si la viga fuera 1 solo elemento, la losa solo tocaría las esquinas y T=0).
  for (let i = 0; i < xm.length - 1; i++) {
    elements.push([nid(xm[i], 0, hc), nid(xm[i + 1], 0, hc)]); kinds.push("beam");     // borde y=0
    elements.push([nid(xm[i], Ly, hc), nid(xm[i + 1], Ly, hc)]); kinds.push("beam");   // borde y=Ly
  }
  for (let j = 0; j < ym.length - 1; j++) {
    elements.push([nid(0, ym[j], hc), nid(0, ym[j + 1], hc)]); kinds.push("beam");      // borde x=0
    elements.push([nid(Lx, ym[j], hc), nid(Lx, ym[j + 1], hc)]); kinds.push("beam");    // borde x=Lx
  }
  // losa Q4 (mismos nodos de borde que las vigas)
  for (let i = 0; i < xm.length - 1; i++) for (let j = 0; j < ym.length - 1; j++) {
    elements.push([nid(xm[i], ym[j], hc), nid(xm[i + 1], ym[j], hc), nid(xm[i + 1], ym[j + 1], hc), nid(xm[i], ym[j + 1], hc)]); kinds.push("slab");
  }
  // inputs
  const m = <T,>() => new Map<number, T>();
  const elasticities = m<number>(), poissonsRatios = m<number>(), shearModuli = m<number>(), densities = m<number>(),
    areas = m<number>(), momentsOfInertiaY = m<number>(), momentsOfInertiaZ = m<number>(), torsionalConstants = m<number>(),
    thicknesses = m<number>(), plateFormulations = m<number>(), drillingTypes = m<number>(), shearAreasY = m<number>(), shearAreasZ = m<number>();
  const Ac = 0.40 * 0.40, Ic = 0.40 ** 4 / 12, Jc = 0.141 * 0.40 ** 4;
  const Av = p.bBeam * p.hBeam, Iyv = p.bBeam * p.hBeam ** 3 / 12, Izv = p.hBeam * p.bBeam ** 3 / 12;
  const beta = 1 / 3 - 0.21 * (p.bBeam / p.hBeam) * (1 - (p.bBeam ** 4) / (12 * p.hBeam ** 4));
  const Jv = beta * p.hBeam * p.bBeam ** 3;   // J Saint-Venant (lado corto al cubo)
  kinds.forEach((k, e) => {
    elasticities.set(e, E); poissonsRatios.set(e, NU); densities.set(e, RHO); shearModuli.set(e, G);
    if (k === "slab") { thicknesses.set(e, p.tSlab); plateFormulations.set(e, 2); drillingTypes.set(e, 2); }
    else if (k === "col") { areas.set(e, Ac); momentsOfInertiaY.set(e, Ic); momentsOfInertiaZ.set(e, Ic); torsionalConstants.set(e, Jc); shearAreasY.set(e, 5 / 6 * Ac); shearAreasZ.set(e, 5 / 6 * Ac); }
    else { areas.set(e, Av); momentsOfInertiaY.set(e, Iyv); momentsOfInertiaZ.set(e, Izv); torsionalConstants.set(e, Jv * (p.fJ ?? 1)); shearAreasY.set(e, 5 / 6 * Av); shearAreasZ.set(e, 5 / 6 * Av); }
  });
  const supports = new Map<number, boolean[]>();
  nodes.forEach((pt, i) => { if (Math.abs(pt[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]); });
  const loads = new Map<number, number[]>();
  kinds.forEach((k, e) => { if (k !== "slab") return; const pp = elements[e].map(n => nodes[n]); const a = Math.hypot(pp[1][0] - pp[0][0], pp[1][1] - pp[0][1]); const b = Math.hypot(pp[3][0] - pp[0][0], pp[3][1] - pp[0][1]); const me = p.q * a * b / 4; for (const n of elements[e]) { const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0]; c[2] -= me; loads.set(n, c); } });

  states.nodes.val = nodes;
  states.elements.val = elements;
  states.nodeInputs.val = { supports, loads };
  states.elementInputs.val = { elasticities, poissonsRatios, shearModuli, densities, areas, momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants, thicknesses, plateFormulations, drillingTypes, shearAreasY, shearAreasZ };
}

export const mesaTorsionNoLineal: ExampleDef = {
  id: "mesa-torsion-no-lineal",
  name: "🔒 Mesa Torsión No Lineal (Pro)",
  category: "🔒 Hekatan Pro · No Lineal",
  params: { ...BASE },
  build,
  defaultShellResult: "vonMises",
  computedLabels: (p, states: any) => {
    const fcMPa = p.fc * 0.0980665;
    const { Tcr, phiTcr: pT } = phiTcr(fcMPa, p.bBeam, p.hBeam);
    // Tu REAL del solver de Hekatan, con la J de la viga ya escalada por fJ (la NO LINEALIDAD).
    // Recupera la torsión de cada viga: T = G·J/L·(θxj − θxi) (giro relativo sobre el eje local).
    let Tu = 0;
    try {
      const nodes = states.nodes.val, elements = states.elements.val;
      const ni = states.nodeInputs.val, ei = states.elementInputs.val;
      const d: any = deform(nodes, elements, ni, ei);
      const U = d.deformations;
      elements.forEach((el: number[], idx: number) => {
        if (el.length !== 2) return;                                   // solo frames
        const a = nodes[el[0]], b = nodes[el[1]];
        if (Math.abs(a[2] - b[2]) > 1e-6) return;                      // solo vigas (horizontales)
        const v = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        const L = Math.hypot(v[0], v[1], v[2]); const ex = [v[0] / L, v[1] / L, v[2] / L];
        const Jb = ei.torsionalConstants.get(idx) ?? 0;                // J real usada en deform (×fJ)
        const ri = (U.get ? U.get(el[0]) : U[el[0]]) || [0, 0, 0, 0, 0, 0];
        const rj = (U.get ? U.get(el[1]) : U[el[1]]) || [0, 0, 0, 0, 0, 0];
        const thi = ri[3] * ex[0] + ri[4] * ex[1] + ri[5] * ex[2];
        const thj = rj[3] * ex[0] + rj[4] * ex[1] + rj[5] * ex[2];
        const T = Math.abs(G * Jb / L * (thj - thi));                  // torsión de la viga (tonf·m)
        if (T > Tu) Tu = T;
      });
    } catch { /* WASM no lista todavía */ }
    const fJ = p.fJ ?? 1;
    return {
      "ⓘ Tema": "Torsión de COMPATIBILIDAD (no lineal, reducible)",
      "Tcr (fisuración)": `${Tcr.toFixed(2)} tonf·m`,
      "φTcr (piso ACI §22.7.3)": `${pT.toFixed(2)} tonf·m`,
      [`🔧 Tu viga (Hekatan, fJ=${fJ.toFixed(2)})`]: `${Tu.toFixed(2)} tonf·m`,
      "Tu / φTcr": pT > 0 ? `${(Tu / pT).toFixed(2)}` : "—",
      "Estado": Tu > pT
        ? `Tu > φTcr → la viga fisura y redistribuye a la losa (bajá fJ ↓)`
        : `Tu ≤ φTcr ✓ — la viga agrietada ya no controla`,
      "Solver no-lineal completo": "Hekatan Pro (privado) — iteración auto en ETABS",
    };
  },
};
