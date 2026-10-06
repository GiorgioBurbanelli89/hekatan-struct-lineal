/**
 * HYPERSTATIC — Load Case de SAP2000 (ayuda de SAP2000 24, «Load Case Data - Hyperstatic Form»):
 *   «calcula la respuesta lineal de la estructura SIN APOYOS cargada solo con las REACCIONES de otro caso lineal estático».
 *   Uso típico: fuerzas SECUNDARIAS (hiperestáticas) del pretensado: caso base = cargas equivalentes del tendón
 *   (autoequilibradas) → sus reacciones R → la estructura libre cargada con R da los esfuerzos secundarios.
 *
 * La estructura libre es singular (6 modos de sólido rígido). Con cargas autoequilibradas los esfuerzos NO dependen de
 * cómo se fijen esos modos: se empotra UN nudo (isostático: reacción nula) y después se quita a los desplazamientos su
 * parte de sólido rígido (proyección ortogonal, como sale en SAP2000: Σuz ≈ 0, Σx·uz ≈ 0).
 */
import type { Node, Element, NodeInputs, ElementInputs } from "./data-model";
import { deformCpp as deform } from "./deformCpp";
import { analyze } from "./analyze";

export type V6h = [number, number, number, number, number, number];

export interface HiperestaticoResultado {
  /** reacciones del caso base (las que cargan la estructura libre) */
  reaccionesBase: Map<number, V6h>;
  deformations: Map<number, V6h>;
  reactions: Map<number, V6h>;
  normals: Map<number, [number, number]>;
  shearsY: Map<number, [number, number]>;
  shearsZ: Map<number, [number, number]>;
  torsions: Map<number, [number, number]>;
  bendingsY: Map<number, [number, number]>;
  bendingsZ: Map<number, [number, number]>;
}

/** Quita a u (6 por nudo) su componente de sólido rígido (6 modos: 3 traslaciones + 3 giros alrededor del centroide). */
export function quitarSolidoRigido(nodes: Node[], u: Map<number, V6h>, nudos?: number[]): Map<number, V6h> {
  const ids = nudos ?? [...u.keys()];
  const c = [0, 1, 2].map((k) => ids.reduce((s, q) => s + nodes[q][k], 0) / Math.max(1, ids.length));
  // modos rígidos en el vector de 6·n: traslación k y giro alrededor del eje k por el centroide
  const modo = (m: number, q: number): number[] => {
    const v = [0, 0, 0, 0, 0, 0];
    if (m < 3) { v[m] = 1; return v; }
    const a = m - 3, r = [nodes[q][0] - c[0], nodes[q][1] - c[1], nodes[q][2] - c[2]];
    const w = [0, 0, 0]; w[a] = 1;                                   // u = w × r, giro = w
    v[0] = w[1] * r[2] - w[2] * r[1]; v[1] = w[2] * r[0] - w[0] * r[2]; v[2] = w[0] * r[1] - w[1] * r[0];
    v[3 + a] = 1; return v;
  };
  // Gram (6×6) y proyección: u − Φ (ΦᵀΦ)⁻¹ Φᵀ u
  const G = Array.from({ length: 6 }, () => new Array(6).fill(0)), b = new Array(6).fill(0);
  for (const q of ids) {
    const uq = u.get(q) ?? [0, 0, 0, 0, 0, 0];
    const F = [0, 1, 2, 3, 4, 5].map((m) => modo(m, q));
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) for (let k = 0; k < 6; k++) G[i][j] += F[i][k] * F[j][k];
      for (let k = 0; k < 6; k++) b[i] += F[i][k] * uq[k];
    }
  }
  // resolver G a = b (Gauss con pivoteo; modos sin rigidez de verdad quedan con G bien condicionada salvo líneas rectas)
  const n = 6, A = G.map((r, i) => [...r, b[i]]);
  const usar = new Array(6).fill(true);
  for (let i = 0; i < n; i++) {
    let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]];
    if (Math.abs(A[i][i]) < 1e-12 * (1 + Math.abs(G[0][0]))) { usar[i] = false; continue; }
    for (let r = 0; r < n; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let k = i; k <= n; k++) A[r][k] -= f * A[i][k]; }
  }
  const a = A.map((r, i) => (usar[i] ? r[n] / r[i] : 0));
  const out = new Map<number, V6h>();
  for (const [q, uq] of u) {
    if (!ids.includes(q)) { out.set(q, [...uq] as V6h); continue; }
    const v = [...uq];
    for (let m = 0; m < 6; m++) { const f = modo(m, q); for (let k = 0; k < 6; k++) v[k] -= a[m] * f[k]; }
    out.set(q, v as V6h);
  }
  return out;
}

/**
 * Caso HYPERSTATIC sobre el caso base dado por `nodeInputs.loads` (+ `elementInputs.frameLoads/frameFixedEnd` del base).
 * Devuelve los esfuerzos secundarios (los de la estructura libre cargada con las reacciones del base).
 */
export function hyperstaticAnalysis(nodes: Node[], elements: Element[], nodeInputs: NodeInputs, elementInputs: ElementInputs,
  springs?: Array<{ node: number; dof: number; k: number }>): HiperestaticoResultado {
  const base = deform(nodes, elements, nodeInputs, elementInputs, springs) as any;
  const R: Map<number, V6h> = base.reactions ?? new Map();
  const apoyos = [...(nodeInputs.supports?.keys() ?? [])];
  if (!apoyos.length) throw new Error("el caso base no tiene apoyos: no hay reacciones que aplicar");
  // isostático: un solo nudo empotrado (el primer apoyo)
  const fijo = apoyos[0];
  const loads = new Map<number, V6h>();
  for (const [q, r] of R) loads.set(q, [...r] as V6h);
  const ni = { ...nodeInputs, supports: new Map([[fijo, [true, true, true, true, true, true]]]), loads } as NodeInputs;
  const ei = { ...elementInputs, frameLoads: undefined, frameFixedEnd: undefined } as ElementInputs;
  const d = deform(nodes, elements, ni, ei) as any;
  const a = analyze(nodes, elements, ei, d) as any;
  const conectados = [...new Set(elements.flat())];
  return {
    reaccionesBase: R, deformations: quitarSolidoRigido(nodes, d.deformations, conectados), reactions: d.reactions,
    normals: a.normals, shearsY: a.shearsY, shearsZ: a.shearsZ, torsions: a.torsions, bendingsY: a.bendingsY, bendingsZ: a.bendingsZ,
  };
}
