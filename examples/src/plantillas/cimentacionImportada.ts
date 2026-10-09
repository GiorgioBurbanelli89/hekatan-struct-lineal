/**
 * EDITAR LAS ZAPATAS DE UN MODELO IMPORTADO (.s2k / .e2k) DESDE LA PLANTA.
 *
 * Jorge, 9-oct-2026: «conéctalo al modelo importado del Quispe».
 *
 * La zapata de un modelo de CSI no es un dato: es un racimo de cáscaras (257 en el Quispe) con su
 * muelle de área. Para cambiarle una cara hay que REHACER su malla y todo lo que cuelga de ella:
 *
 *   · las cáscaras nuevas llevan las propiedades de la zapata (espesor, material, formulación);
 *   · los muelles se rehacen por área tributaria con el MISMO balasto (kgf/cm³ → ks·A_trib);
 *   · el peso propio de la zapata se quita de los nudos viejos y se pone en los nuevos;
 *   · los nudos que tocan OTRA cosa (la base de la columna, un pedestal, una viga) se conservan
 *     con su índice: la malla nueva pasa por sus coordenadas, así nada queda suelto;
 *   · los apoyos horizontales se llevan al nudo nuevo de la misma coordenada.
 *
 * El vuelo de cada cara se mide desde la cara de la(s) columna(s) que lleva (0 = lindero), igual que
 * en las plantillas (`cimentacion.ts`).
 *
 * Todo esto es función pura sobre `ModeloEd` para poder probarla sin navegador
 * (`validation/modelos/privado/quispe/editor_importado.mjs`).
 */
import { deform, analyze } from "hekatan-fem";

export interface ModeloEd {
  nodes: number[][];
  elements: (number[] | null)[];
  supports: Map<number, boolean[]>;
  loads: Map<number, number[]>;
  springs: Array<{ node: number; dof: number; k: number }>;
  /** elementInputs: cada entrada es un Map indexado por elemento. */
  ei: Record<string, Map<number, any>>;
}

export interface Grupo {
  id: number;
  elems: number[];
  nodos: Set<number>;
  x0: number; y0: number; x1: number; y1: number; z: number;
  t: number;
  /** ¿la suma de áreas = área de la caja? Si no, la zapata no es un rectángulo y no se edita. */
  rectangular: boolean;
  /** balasto vertical (fuerza/longitud³) = mediana de k_nudo / área tributaria */
  ks: number;
  columnas: Array<{ x: number; y: number; bx: number; by: number }>;
}

export interface VueloZ { w: number; e: number; s: number; n: number; }
export type Rect = { x0: number; y0: number; x1: number; y1: number };

const G = 9.80665;
const eq = (a: number, b: number, t = 1e-6) => Math.abs(a - b) < t;

/** Copia profunda del modelo (los Map y los arreglos de carga se mutan al editar). */
export function copiarModelo(m: ModeloEd): ModeloEd {
  const ei: Record<string, Map<number, any>> = {};
  for (const [k, v] of Object.entries(m.ei)) ei[k] = new Map(v);
  return {
    nodes: m.nodes.map((n) => [...n]),
    elements: m.elements.map((e) => (e ? [...e] : null)),
    supports: new Map([...m.supports].map(([k, v]) => [k, [...v]])),
    loads: new Map([...m.loads].map(([k, v]) => [k, [...v]])),
    springs: m.springs.map((s) => ({ ...s })),
    ei,
  };
}

/** Área de un cuadrilátero en 3D (dos triángulos). */
function areaQuad(P: number[][]): number {
  const tri = (a: number[], b: number[], c: number[]) => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    return 0.5 * Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]);
  };
  return tri(P[0], P[1], P[2]) + tri(P[0], P[2], P[3]);
}

/** Extensión en planta (X, Y) de una columna a partir de su sección y su ángulo local. */
function cajaColumna(m: ModeloEd, e: number): { bx: number; by: number } {
  const A = m.ei.areas?.get(e) ?? 0, Iz = m.ei.momentsOfInertiaZ?.get(e) ?? 0, Iy = m.ei.momentsOfInertiaY?.get(e) ?? 0;
  if (A <= 0 || Iz <= 0 || Iy <= 0) { const s = Math.sqrt(Math.max(A, 1e-6)); return { bx: s, by: s }; }
  // I33 = b·d³/12 con d = canto (eje local 2); I22 = d·b³/12. Una columna vertical: eje 2 = X, eje 3 = Y.
  const d2 = Math.sqrt(12 * Iz / A), d3 = Math.sqrt(12 * Iy / A);
  const ang = Math.abs(((m.ei.localAngles?.get(e) ?? 0) % 180));
  return Math.abs(ang - 90) < 1e-6 ? { bx: d3, by: d2 } : { bx: d2, by: d3 };
}

/** Racimos de cáscaras apoyadas en el suelo (todas sus esquinas con muelle vertical) → zapatas. */
export function detectarZapatas(m: ModeloEd): Grupo[] {
  const conK = new Set<number>();
  for (const s of m.springs) if (s.dof === 2 && s.node >= 0) conK.add(s.node);
  const candidatas: number[] = [];
  m.elements.forEach((el, e) => { if (el && el.length === 4 && el.every((n) => conK.has(n))) candidatas.push(e); });
  // unión de cáscaras que comparten un nudo
  const padre = new Map<number, number>(candidatas.map((e) => [e, e]));
  const raiz = (e: number): number => { let r = e; while (padre.get(r) !== r) r = padre.get(r)!; padre.set(e, r); return r; };
  const dueno = new Map<number, number>();
  for (const e of candidatas) for (const n of m.elements[e]!) {
    const o = dueno.get(n);
    if (o === undefined) dueno.set(n, e); else padre.set(raiz(e), raiz(o));
  }
  const porRaiz = new Map<number, number[]>();
  for (const e of candidatas) { const r = raiz(e); (porRaiz.get(r) ?? porRaiz.set(r, []).get(r)!).push(e); }
  const out: Grupo[] = [];
  for (const elems of porRaiz.values()) {
    const nodos = new Set<number>(); let A = 0;
    for (const e of elems) { for (const n of m.elements[e]!) nodos.add(n); A += areaQuad(m.elements[e]!.map((n) => m.nodes[n])); }
    const P = [...nodos].map((n) => m.nodes[n]);
    const x0 = Math.min(...P.map((p) => p[0])), x1 = Math.max(...P.map((p) => p[0]));
    const y0 = Math.min(...P.map((p) => p[1])), y1 = Math.max(...P.map((p) => p[1]));
    const z = P[0][2];
    const plana = P.every((p) => eq(p[2], z, 1e-6));
    const rectangular = plana && Math.abs(A - (x1 - x0) * (y1 - y0)) < 1e-6 * Math.max(1, A);
    const t = m.ei.thicknesses?.get(elems[0]) ?? 0;
    // columnas: barras VERTICALES cuyo nudo bajo cae en la zapata
    const columnas: Grupo["columnas"] = [];
    m.elements.forEach((el, e) => {
      if (!el || el.length !== 2) return;
      const a = m.nodes[el[0]], b = m.nodes[el[1]];
      if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 1e-6) return;
      const bajo = a[2] <= b[2] ? el[0] : el[1];
      if (!nodos.has(bajo)) return;
      const { bx, by } = cajaColumna(m, e);
      columnas.push({ x: m.nodes[bajo][0], y: m.nodes[bajo][1], bx, by });
    });
    const aT = new Map<number, number>();
    for (const e of elems) { const A = areaQuad(m.elements[e]!.map((n) => m.nodes[n])); for (const n of m.elements[e]!) aT.set(n, (aT.get(n) ?? 0) + A / 4); }
    const kz = m.springs.filter((s) => s.dof === 2 && aT.has(s.node)).map((s) => s.k / aT.get(s.node)!).sort((a, b) => a - b);
    out.push({ id: out.length, elems, nodos, x0, y0, x1, y1, z, t, rectangular, ks: kz.length ? kz[Math.floor(kz.length / 2)] : 0, columnas });
  }
  // orden estable: por posición (de abajo a arriba, de izquierda a derecha) para que el índice no baile
  out.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));
  out.forEach((g, i) => (g.id = i));
  return out;
}

/** Caja de las columnas de la zapata (o un punto en su centro si no lleva columna). */
export function cajaColumnas(g: Grupo): Rect {
  if (!g.columnas.length) { const cx = (g.x0 + g.x1) / 2, cy = (g.y0 + g.y1) / 2; return { x0: cx, x1: cx, y0: cy, y1: cy }; }
  return {
    x0: Math.min(...g.columnas.map((c) => c.x - c.bx / 2)), x1: Math.max(...g.columnas.map((c) => c.x + c.bx / 2)),
    y0: Math.min(...g.columnas.map((c) => c.y - c.by / 2)), y1: Math.max(...g.columnas.map((c) => c.y + c.by / 2)),
  };
}

export function vuelosDe(g: Grupo, r: Rect = g): VueloZ {
  const c = cajaColumnas(g);
  return { w: c.x0 - r.x0, e: r.x1 - c.x1, s: c.y0 - r.y0, n: r.y1 - c.y1 };
}

export function rectDeVuelos(g: Grupo, v: VueloZ): Rect {
  const c = cajaColumnas(g);
  return { x0: c.x0 - Math.max(0, v.w), x1: c.x1 + Math.max(0, v.e), y0: c.y0 - Math.max(0, v.s), y1: c.y1 + Math.max(0, v.n) };
}

/**
 * Líneas de malla nuevas entre a y b. Se conservan las viejas que caben (así una edición que no cambia
 * nada reproduce la malla); un borde nuevo pegado a una línea vieja la absorbe salvo que tenga un nudo
 * ajeno encima; y SOLO los tramos fuera de la malla vieja se subdividen a ≤ ms.
 */
function lineas(viejas: number[], a: number, b: number, ms: number, obligadas: number[]): number[] {
  const oMin = viejas[0], oMax = viejas[viejas.length - 1];
  const obl = (v: number) => obligadas.some((o) => eq(o, v, 1e-6));
  const dentro = viejas.filter((v) => v > a + 1e-9 && v < b - 1e-9 && (obl(v) || (v - a >= 0.3 * ms && b - v >= 0.3 * ms)));
  const claves = [a, ...dentro, b];
  const out: number[] = [a];
  for (let i = 1; i < claves.length; i++) {
    const p = claves[i - 1], q = claves[i], L = q - p;
    const nuevo = p < oMin - 1e-9 || q > oMax + 1e-9;
    const n = nuevo ? Math.max(1, Math.ceil(L / ms - 1e-9)) : 1;
    for (let k = 1; k <= n; k++) out.push(p + (L * k) / n);
  }
  return [...new Set(out.map((v) => +v.toFixed(9)))].sort((x, y) => x - y);
}

/**
 * Reconstruye UNA zapata (grupo detectado en el modelo original) en el rectángulo `r`.
 * Opera sobre `M` (que se muta) con indices ABIERTOS: nada se renumera hasta `compactar()`.
 */
export function reconstruirZapata(M: ModeloEd, g: Grupo, r: Rect): { ok: boolean; aviso?: string } {
  if (!g.rectangular) return { ok: false, aviso: "la zapata no es un rectángulo: no se edita" };
  const cc = cajaColumnas(g);
  // no se puede quedar una columna fuera de la zapata
  const r2: Rect = { x0: Math.min(r.x0, cc.x0), x1: Math.max(r.x1, cc.x1), y0: Math.min(r.y0, cc.y0), y1: Math.max(r.y1, cc.y1) };
  const elemsVivos = g.elems.filter((e) => M.elements[e]);
  if (!elemsVivos.length) return { ok: false, aviso: "zapata ya reconstruida" };
  const e0 = elemsVivos[0];
  const set = new Set(elemsVivos);

  // 1) nudos ajenos (tocan otro elemento vivo) y nudos propios
  const ajenos = new Set<number>();
  M.elements.forEach((el, e) => { if (el && !set.has(e)) for (const n of el) if (g.nodos.has(n)) ajenos.add(n); });
  // 2) propiedades por área: balasto, peso por área, tamaño de malla
  const aTrib = new Map<number, number>();
  for (const e of elemsVivos) { const A = areaQuad(M.elements[e]!.map((n) => M.nodes[n])); for (const n of M.elements[e]!) aTrib.set(n, (aTrib.get(n) ?? 0) + A / 4); }
  const ksDof: number[] = [0, 0, 0];
  for (const dof of [0, 1, 2]) {
    const v: number[] = [];
    for (const s of M.springs) if (s.dof === dof && s.node >= 0 && aTrib.has(s.node)) v.push(s.k / aTrib.get(s.node)!);
    if (v.length) { v.sort((a, b) => a - b); ksDof[dof] = v[Math.floor(v.length / 2)]; }
  }
  const q = M.ei.pesoArea?.get(e0) ?? 0;                            // kgf/m² (o kN/m²) de peso propio de la zapata
  const lados: number[] = [];
  for (const e of elemsVivos) { const P = M.elements[e]!.map((n) => M.nodes[n]); lados.push(Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]), Math.hypot(P[3][0] - P[0][0], P[3][1] - P[0][1])); }
  lados.sort((a, b) => a - b);
  const ms = Math.max(0.1, lados[Math.floor(lados.length / 2)] || 0.4);

  // 3) lo que se QUITA: cáscaras, peso en los nudos, muelles, y los nudos propios
  for (const [n, A] of aTrib) {
    const L = M.loads.get(n); if (L && q) L[2] += q * A;             // quita el peso (la carga es negativa)
  }
  const apoyosViejos = [...g.nodos].filter((n) => M.supports.has(n)).map((n) => ({ p: [...M.nodes[n]], v: [...M.supports.get(n)!], ajeno: ajenos.has(n) }));
  const residuos: Array<{ p: number[]; f: number[] }> = [];
  for (const e of elemsVivos) M.elements[e] = null;
  M.springs = M.springs.filter((s) => !(s.node >= 0 && g.nodos.has(s.node)));
  const propios = [...g.nodos].filter((n) => !ajenos.has(n));
  for (const n of propios) {
    const L = M.loads.get(n);
    if (L && L.slice(0, 6).some((v) => Math.abs(v) > 1e-6)) residuos.push({ p: [...M.nodes[n]], f: [...L] });   // cargas que no eran peso
    M.loads.delete(n); M.supports.delete(n); (M.nodes[n] as any)[3] = "borrado";
  }
  for (const e of elemsVivos) for (const k of Object.keys(M.ei)) M.ei[k].delete(e);   // se reponen al crear

  // 4) malla nueva
  const xsViejas = [...new Set([...g.nodos].map((n) => +M.nodes[n][0].toFixed(9)))].sort((a, b) => a - b);
  const ysViejas = [...new Set([...g.nodos].map((n) => +M.nodes[n][1].toFixed(9)))].sort((a, b) => a - b);
  const obX = [...ajenos].map((n) => M.nodes[n][0]), obY = [...ajenos].map((n) => M.nodes[n][1]);
  const xs = lineas(xsViejas, r2.x0, r2.x1, ms, obX), ys = lineas(ysViejas, r2.y0, r2.y1, ms, obY);
  const porCoord = new Map<string, number>();
  const clave = (x: number, y: number) => `${x.toFixed(6)},${y.toFixed(6)}`;
  for (const n of ajenos) porCoord.set(clave(M.nodes[n][0], M.nodes[n][1]), n);
  const nuevoNodo = (x: number, y: number) => {
    const k = clave(x, y); let i = porCoord.get(k);
    if (i === undefined) { i = M.nodes.length; M.nodes.push([x, y, g.z]); porCoord.set(k, i); }
    return i;
  };
  const grid = ys.map((y) => xs.map((x) => nuevoNodo(x, y)));
  const nuevos: number[] = [];
  for (let j = 0; j < ys.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
    const e = M.elements.length;
    M.elements.push([grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]]);
    nuevos.push(e);
  }
  // propiedades: las del elemento de referencia (guardadas ANTES de borrarlas, por eso van por `g.prop`)
  const prop = (g as any).prop as Record<string, any> | undefined;
  if (prop) for (const e of nuevos) for (const [k, v] of Object.entries(prop)) { (M.ei[k] ??= new Map()).set(e, v); }

  // 5) muelles, peso y apoyos de la malla nueva
  const nuevaA = new Map<number, number>();
  for (const e of nuevos) { const A = areaQuad(M.elements[e]!.map((n) => M.nodes[n])); for (const n of M.elements[e]!) nuevaA.set(n, (nuevaA.get(n) ?? 0) + A / 4); }
  for (const [n, A] of nuevaA) {
    for (const dof of [0, 1, 2]) if (ksDof[dof] > 0) M.springs.push({ node: n, dof, k: ksDof[dof] * A });
    if (q) { const L = M.loads.get(n) ?? [0, 0, 0, 0, 0, 0]; L[2] -= q * A; M.loads.set(n, L); }
  }
  const masCerca = (p: number[]) => { let b = -1, bd = 1e9; for (const n of nuevaA.keys()) { const d = Math.hypot(M.nodes[n][0] - p[0], M.nodes[n][1] - p[1]); if (d < bd) { bd = d; b = n; } } return b; };
  for (const ap of apoyosViejos) {
    if (ap.ajeno) continue;                                              // el nudo ajeno conserva su apoyo
    const n = porCoord.get(clave(ap.p[0], ap.p[1]));
    if (n !== undefined && !M.supports.has(n)) M.supports.set(n, ap.v);
  }
  for (const rs of residuos) {
    const n = masCerca(rs.p); if (n < 0) continue;
    const L = M.loads.get(n) ?? [0, 0, 0, 0, 0, 0]; for (let k = 0; k < 6; k++) L[k] += rs.f[k] ?? 0; M.loads.set(n, L);
  }
  return { ok: true };
}

/** Quita nudos borrados y elementos nulos, y renumera TODO (apoyos, cargas, muelles, propiedades). */
export function compactar(M: ModeloEd): ModeloEd {
  const vivo = new Array(M.nodes.length).fill(true);
  M.nodes.forEach((n, i) => { if ((n as any)[3] === "borrado") vivo[i] = false; });
  const mapN = new Array(M.nodes.length).fill(-1); let c = 0;
  for (let i = 0; i < M.nodes.length; i++) if (vivo[i]) mapN[i] = c++;
  const mapE = new Array(M.elements.length).fill(-1); let ce = 0;
  for (let i = 0; i < M.elements.length; i++) if (M.elements[i]) mapE[i] = ce++;
  const nodes = M.nodes.filter((_, i) => vivo[i]).map((n) => [n[0], n[1], n[2]]);
  const elements = M.elements.filter((e) => e).map((e) => e!.map((n) => mapN[n]));
  const ei: Record<string, Map<number, any>> = {};
  for (const [k, v] of Object.entries(M.ei)) { const o = new Map<number, any>(); for (const [e, x] of v) if (mapE[e] >= 0) o.set(mapE[e], x); ei[k] = o; }
  const supports = new Map<number, boolean[]>(); for (const [n, v] of M.supports) if (mapN[n] >= 0) supports.set(mapN[n], v);
  const loads = new Map<number, number[]>(); for (const [n, v] of M.loads) if (mapN[n] >= 0) loads.set(mapN[n], v);
  const springs = M.springs.filter((s) => s.node < 0 || mapN[s.node] >= 0).map((s) => ({ ...s, node: s.node < 0 ? s.node : mapN[s.node] }));
  return { nodes, elements: elements as number[][], supports, loads, springs, ei };
}

/** Guarda las propiedades del primer elemento de cada zapata ANTES de tocar nada. */
export function anotarPropiedades(M: ModeloEd, grupos: Grupo[]) {
  for (const g of grupos) {
    const p: Record<string, any> = {};
    for (const [k, v] of Object.entries(M.ei)) if (v.has(g.elems[0])) p[k] = v.get(g.elems[0]);
    (g as any).prop = p;
  }
}

/** Aplica una lista de rectángulos nuevos (por zapata) sobre una copia del modelo y lo compacta. */
export function aplicarEdiciones(base: ModeloEd, grupos: Grupo[], ediciones: Map<number, Rect>): { modelo: ModeloEd; avisos: string[] } {
  const M = copiarModelo(base); const avisos: string[] = [];
  for (const [id, r] of ediciones) {
    const g = grupos[id]; if (!g) continue;
    const res = reconstruirZapata(M, g, r);
    if (!res.ok) avisos.push(`zapata ${id + 1}: ${res.aviso}`);
  }
  return { modelo: compactar(M), avisos };
}

/** Resuelve (estático, muelles lineales) y deja la presión del suelo para el colormap. */
export function resolver(M: ModeloEd, ks: number) {
  const nodeInputs: any = { supports: M.supports, loads: M.loads, springs: M.springs };
  const ei: any = M.ei;
  const out = deform(M.nodes as any, M.elements as any, nodeInputs, ei, M.springs);
  const an: any = analyze(M.nodes as any, M.elements as any, ei, out);
  const def: any = out?.deformations;
  if (def) {
    const pres = new Map<number, number[]>();
    M.elements.forEach((el, e) => {
      if (!el || el.length !== 4) return;
      const todos = el.every((n) => M.springs.some((s) => s.node === n && s.dof === 2));
      if (!todos) return;
      pres.set(e, el.map((n) => ks * ((def.get ? def.get(n) : def[n])?.[2] ?? 0)));
    });
    an.pressure = pres;
  }
  return { out, an };
}
