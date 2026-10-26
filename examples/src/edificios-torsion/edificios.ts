/**
 * Los 20 EDIFICIOS del estudio del Tu (torsión de diseño) con el Insertion Point: 10 regulares (R1-R10) y 10 irregulares (I1-I10).
 *
 * Misma geometría, cargas y combinaciones que `validation/insercion/edificios_estudio.mjs`, cuya referencia es ETABS 22:
 * Struct = ETABS a ≤ 0.001 % en los 20 (ver `tests/casos/edificios_torsion_vs_etabs.mjs`).
 * kN, m. Losa Shell-Thin (DKQ) de malla 1 m, vigas 1 m, sin agrietar (J completa), sin diafragma rígido (la losa lleva el plano).
 */
import type { Node, Element } from "hekatan-fem";
import type { Carga6 } from "../shared/cargasPorCaso";

export interface EspecEdificio {
  id: string; nombre: string;
  bx: number[]; by: number[]; h: number[];          // luces en X e Y (m) y alturas de piso (m)
  bb: number; bh: number; col: number; t: number;   // viga b×h, columna (lado), espesor de losa (m)
  quita?: (s: number, ix: number, iy: number) => boolean;     // la crujía NO existe en el piso s
  hueco?: (s: number, ix: number, iy: number) => boolean;     // la crujía existe con vigas pero sin losa
  sinCol?: (s: number, i: number, j: number) => boolean;      // falta la columna del piso s en ese cruce de ejes
  extraD?: (s: number, ix: number, iy: number) => number;     // carga muerta adicional (kN/m²)
  colDe?: (s: number, i: number, j: number) => number;        // lado de la columna en ese cruce
}

const REG = { bx: [5, 5, 5], by: [5, 5, 5], h: [3, 3, 3], bb: 0.30, bh: 0.50, col: 0.40, t: 0.15 };
const e = (id: string, nombre: string, o: Partial<EspecEdificio> = {}): EspecEdificio => ({ id, nombre, ...REG, ...o });

export const EDIFICIOS: EspecEdificio[] = [
  e("R1", "R1  regular 2×2 crujías de 5 m, 3 pisos", { bx: [5, 5], by: [5, 5] }),
  e("R2", "R2  regular 3×3 crujías de 5 m, 3 pisos"),
  e("R3", "R3  regular 3×3, 6 pisos", { h: [3, 3, 3, 3, 3, 3] }),
  e("R4", "R4  regular 2×2 crujías de 7 m (luces grandes)", { bx: [7, 7], by: [7, 7] }),
  e("R5", "R5  regular rectangular 4×2 crujías", { bx: [5, 5, 5, 5], by: [5, 5] }),
  e("R6", "R6  regular 3×3 de 4 m, vigas 0.30×0.60", { bx: [4, 4, 4], by: [4, 4, 4], bh: 0.60 }),
  e("R7", "R7  regular, losa gruesa t = 0.20", { t: 0.20 }),
  e("R8", "R8  regular, columnas 0.60", { col: 0.60 }),
  e("R9", "R9  regular, vigas esbeltas 0.25×0.40", { bb: 0.25, bh: 0.40 }),
  e("R10", "R10 regular, 4 pisos de 3.6 m", { h: [3.6, 3.6, 3.6, 3.6] }),
  e("I1", "I1  en L (planta 4×4 sin una esquina de 2×2)", { bx: [4, 4, 4, 4], by: [4, 4, 4, 4], quita: (s, ix, iy) => ix >= 2 && iy >= 2 }),
  e("I2", "I2  en U (falta la crujía central de un lado)", { bx: [4, 4, 4], by: [4, 4, 4], quita: (s, ix, iy) => ix === 1 && iy >= 1 }),
  e("I3", "I3  en T", { bx: [4, 4, 4], by: [4, 4, 4], quita: (s, ix, iy) => iy >= 1 && ix !== 1 }),
  e("I4", "I4  con hueco de losa central", { hueco: (s, ix, iy) => ix === 1 && iy === 1 }),
  e("I5", "I5  con retranqueo (pisos altos más pequeños)", { quita: (s, ix, iy) => s >= 2 && !(ix <= 1 && iy <= 1) }),
  e("I6", "I6  piso blando (primer piso de 5 m)", { h: [5, 3, 3] }),
  e("I7", "I7  columna interior faltante en el primer piso", { sinCol: (s, i, j) => s === 1 && i === 1 && j === 1 }),
  e("I8", "I8  crujías desiguales 3-6-3", { bx: [3, 6, 3], by: [4, 4, 4] }),
  e("I9", "I9  masa irregular (carga muerta extra en una crujía)", { extraD: (s, ix, iy) => (s === 2 && ix === 2 && iy === 2 ? 8 : 0) }),
  e("I10", "I10 torsional: columnas rígidas a un lado, flexibles al otro", { colDe: (s, i) => (i <= 1 ? 0.60 : 0.30) }),
];

export const NOMBRES_EDIFICIOS: Record<string, number> = Object.fromEntries(EDIFICIOS.map((s, i) => [s.nombre, i]));

const QD = 6, QL = 2, CS = 0.12;                        // kN/m²: muerta (con peso propio), viva; coeficiente sísmico V = CS·W
export const E_HORMIGON = 2.5e7, NU = 0.2, G_HORMIGON = E_HORMIGON / (2 * (1 + NU));

/** J de una sección rectangular (misma fórmula que el estudio). */
export const jRect = (a: number, b: number) => {
  const A = Math.max(a, b), B = Math.min(a, b);
  return A * B ** 3 * (1 / 3 - 0.21 * (B / A) * (1 - B ** 4 / (12 * A ** 4)));
};

export interface Edificio {
  nodes: Node[]; elements: Element[];
  tipo: ("viga" | "col" | "losa")[]; piso: number[]; lado: number[];
  cargas: { Dead: Map<number, Carga6>; Live: Map<number, Carga6>; Ex: Map<number, Carga6>; Ey: Map<number, Carga6> };
  supports: Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>;
  V: number; zs: number[];
}

export function construirEdificio(S: EspecEdificio): Edificio {
  const nbx = S.bx.length, nby = S.by.length, ns = S.h.length;
  const xs = [0], ys = [0], zs = [0];
  S.bx.forEach(b => xs.push(xs[xs.length - 1] + b)); S.by.forEach(b => ys.push(ys[ys.length - 1] + b)); S.h.forEach(h => zs.push(zs[zs.length - 1] + h));
  const existe = (s: number, ix: number, iy: number) => ix >= 0 && iy >= 0 && ix < nbx && iy < nby && !(S.quita && S.quita(s, ix, iy));
  const nodes: Node[] = [], idx = new Map<string, number>();
  const nodo = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = idx.get(k); if (i === undefined) { i = nodes.length; idx.set(k, i); nodes.push([x, y, z]); } return i;
  };
  const elements: Element[] = [], tipo: Edificio["tipo"] = [], piso: number[] = [], lado: number[] = [], extra: number[] = [];
  const vistos = new Set<string>();
  const viga = (s: number, a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`; if (vistos.has(k)) return; vistos.add(k);
    elements.push([a, b]); tipo.push("viga"); piso.push(s); lado.push(0); extra.push(0);
  };
  for (let s = 1; s <= ns; s++) {
    const z = zs[s];
    for (let ix = 0; ix < nbx; ix++) for (let iy = 0; iy < nby; iy++) {
      if (!existe(s, ix, iy)) continue;
      const x0 = xs[ix], x1 = xs[ix + 1], y0 = ys[iy], y1 = ys[iy + 1];
      for (let x = x0; x < x1; x++) { viga(s, nodo(x, y0, z), nodo(x + 1, y0, z)); viga(s, nodo(x, y1, z), nodo(x + 1, y1, z)); }
      for (let y = y0; y < y1; y++) { viga(s, nodo(x0, y, z), nodo(x0, y + 1, z)); viga(s, nodo(x1, y, z), nodo(x1, y + 1, z)); }
      if (S.hueco && S.hueco(s, ix, iy)) continue;
      for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) {
        elements.push([nodo(x, y, z), nodo(x + 1, y, z), nodo(x + 1, y + 1, z), nodo(x, y + 1, z)]);
        tipo.push("losa"); piso.push(s); lado.push(0); extra.push(S.extraD ? S.extraD(s, ix, iy) : 0);
      }
    }
    for (let i = 0; i <= nbx; i++) for (let j = 0; j <= nby; j++) {
      const toca = existe(s, i - 1, j - 1) || existe(s, i, j - 1) || existe(s, i - 1, j) || existe(s, i, j);
      if (!toca || (S.sinCol && S.sinCol(s, i, j))) continue;
      elements.push([nodo(xs[i], ys[j], zs[s - 1]), nodo(xs[i], ys[j], z)]);
      tipo.push("col"); piso.push(s); lado.push(S.colDe ? S.colDe(s, i, j) : S.col); extra.push(0);
    }
  }
  const mk = () => new Map<number, Carga6>();
  const Dead = mk(), Live = mk(), Ex = mk(), Ey = mk();
  const add = (m: Map<number, Carga6>, n: number, v: Carga6) => {
    const q = m.get(n) ?? [0, 0, 0, 0, 0, 0] as Carga6; for (let k = 0; k < 6; k++) q[k] += v[k]; m.set(n, q);
  };
  const area = new Array(ns + 1).fill(0), peso = new Array(ns + 1).fill(0);
  elements.forEach((_, i) => { if (tipo[i] === "losa") { area[piso[i]] += 1; peso[piso[i]] += QD + QL * 0.25 + extra[i]; } });
  let sumWh = 0, sumW = 0; for (let s = 1; s <= ns; s++) { sumWh += peso[s] * zs[s]; sumW += peso[s]; }
  const V = CS * sumW;
  elements.forEach((el, i) => {
    if (tipo[i] !== "losa") return;
    const s = piso[i], Fs = V * peso[s] * zs[s] / sumWh;
    for (const n of el) {
      add(Dead, n, [0, 0, -(QD + extra[i]) / 4, 0, 0, 0]); add(Live, n, [0, 0, -QL / 4, 0, 0, 0]);
      add(Ex, n, [Fs / area[s] / 4, 0, 0, 0, 0, 0]); add(Ey, n, [0, Fs / area[s] / 4, 0, 0, 0, 0]);
    }
  });
  const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
  elements.forEach((el, i) => { if (tipo[i] === "col" && nodes[el[0]][2] === 0) supports.set(el[0], [true, true, true, true, true, true]); });
  return { nodes, elements, tipo, piso, lado, cargas: { Dead, Live, Ex, Ey }, supports, V, zs };
}
