/**
 * PAVIMENTADOR — automallado en CUADRILÁTEROS de un paño POLIGONAL plano: bordes en L, huecos,
 * lados oblicuos. Es lo que la interpolación transfinita (`transfinito.ts`) no puede hacer,
 * porque ésta exige exactamente cuatro bordes.
 *
 * Qué hace ETABS ahí (medido en su binario el 17-sep-2026,
 * `registros/2026-09-17_automesh_etabs_binario.md`): si el paño no es un cuadrilátero limpio
 * entra `Quad_Build` = pavimentado por capas desde el contorno + suavizado laplaciano en tres
 * pasadas + reconocimiento de huecos. Siempre cuadriláteros, nunca triángulos.
 *
 * De ahí se toma la IDEA (contorno → cuadriláteros → laplaciano) y nada más: ni código ni datos.
 * Lo escrito aquí sale de matemática pública:
 *
 *   (A) Polígono RECTILÍNEO (todos los bordes paralelos a dos ejes del plano — la L, el hueco
 *       rectangular, la planta escalonada: el 90 % de los edificios). Rejilla estructurada con
 *       líneas de corte en TODOS los vértices, cada tramo partido en ceil(L/tam) celdas iguales,
 *       y se conservan las celdas cuyo centro cae dentro del polígono y fuera de los huecos.
 *       Es el «cookie cut» de toda la vida. Exacto: los vértices son nudos, las celdas son
 *       rectángulos, no hay nada que suavizar. En un rectángulo sin huecos da BIT A BIT la misma
 *       malla que la transfinita/bilineal (mismo ceil(L/tam), mismas posiciones).
 *
 *   (B) Polígono GENERAL (lados oblicuos, hueco girado…). Método indirecto clásico:
 *       1. muestreo del contorno y de los huecos a paso 2·tam, más una retícula hexagonal interior
 *          al mismo paso (lejos del borde: no se crean triángulos-aguja);
 *       2. triangulación de Delaunay por Bowyer (1981) – Watson (1981), quitando los triángulos
 *          que caen fuera del polígono o dentro de un hueco, y comprobando que cada segmento del
 *          contorno es arista de la malla (si no, se inserta su punto medio y se repite);
 *       3. cada triángulo se parte en TRES cuadriláteros por su baricentro y los puntos medios de
 *          sus lados (la partición de Catmull–Clark, 1978). Con eso el lado de las celdas queda
 *          ≈ tam y la malla es TODA de cuadriláteros;
 *       4. suavizado laplaciano (cada nudo interior al promedio de sus vecinos), con los nudos del
 *          borde fijos y rechazando cualquier movimiento que invierta una celda.
 *
 * La función `pavimentar()` decide sola el camino (A si puede, B si no) y lo dice en la salida.
 *
 * Referencias: Bowyer, A. (1981) Computer J. 24(2) · Watson, D. F. (1981) Computer J. 24(2) ·
 * Catmull, E. & Clark, J. (1978) Computer-Aided Design 10(6) · Field, D. A. (1988) «Laplacian
 * smoothing and Delaunay triangulations», Comm. Appl. Numer. Methods 4.
 */
import type { V3 } from "./transfinito";

type P2 = [number, number];

export interface PanoPoligonal {
  /** vértices del contorno, en orden (el sentido de recorrido fija la normal de las celdas) */
  contorno: V3[];
  /** lazos de los huecos (cualquier sentido) */
  huecos: V3[][];
}

export interface MallaPavimentada {
  nudos: V3[];
  /** cuadriláteros, índices en `nudos`, en el mismo sentido que el contorno */
  celdas: [number, number, number, number][];
  metodo: "rejilla" | "delaunay";
  /** índices de los nudos que están sobre el contorno o sobre un hueco */
  enBorde: Set<number>;
  /** informe corto del camino seguido (nº de pasadas, inserciones…) */
  nota: string;
}

// ── álgebra mínima ─────────────────────────────────────────────────────────────────────────────
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const unit = (a: V3): V3 => { const L = norm(a); return [a[0] / L, a[1] / L, a[2] / L]; };

/** Marco local del plano del paño: origen en el primer vértice, `u` a lo largo del lado MÁS LARGO
 *  del contorno (así una L girada sigue siendo rectilínea en su propio marco), `n` por Newell. */
export function marcoLocal(contorno: V3[]): { O: V3; u: V3; v: V3; n: V3 } {
  const O = contorno[0];
  let nn: V3 = [0, 0, 0];
  for (let i = 0; i < contorno.length; i++) {
    const a = contorno[i], b = contorno[(i + 1) % contorno.length];
    nn = [nn[0] + (a[1] - b[1]) * (a[2] + b[2]), nn[1] + (a[2] - b[2]) * (a[0] + b[0]), nn[2] + (a[0] - b[0]) * (a[1] + b[1])];
  }
  const n = unit(nn);
  let mejor = 0, uu: V3 = [1, 0, 0];
  for (let i = 0; i < contorno.length; i++) {
    const d = sub(contorno[(i + 1) % contorno.length], contorno[i]);
    const L = norm(d); if (L > mejor) { mejor = L; uu = d; }
  }
  // proyectar el lado sobre el plano (por si el polígono no es exactamente plano)
  const u = unit(sub(uu, [n[0] * dot(uu, n), n[1] * dot(uu, n), n[2] * dot(uu, n)]));
  const v = cross(n, u);
  return { O, u, v, n };
}

const a2d = (M: { O: V3; u: V3; v: V3 }, p: V3): P2 => { const d = sub(p, M.O); return [dot(d, M.u), dot(d, M.v)]; };
const a3d = (M: { O: V3; u: V3; v: V3 }, q: P2): V3 =>
  [M.O[0] + q[0] * M.u[0] + q[1] * M.v[0], M.O[1] + q[0] * M.u[1] + q[1] * M.v[1], M.O[2] + q[0] * M.u[2] + q[1] * M.v[2]];

const area2 = (P: P2[]) => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; };

/** dentro/fuera por paridad de cruces (Jordan). Los puntos que se preguntan son centros de celda
 *  o de triángulo, nunca puntos del borde. */
function dentro(P: P2[], q: P2): boolean {
  let c = false;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const a = P[i], b = P[j];
    if ((a[1] > q[1]) !== (b[1] > q[1]) && q[0] < ((b[0] - a[0]) * (q[1] - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
const dentroDelPano = (cont: P2[], huecos: P2[][], q: P2) => dentro(cont, q) && !huecos.some((h) => dentro(h, q));

function distSeg(q: P2, a: P2, b: P2): number {
  const dx = b[0] - a[0], dy = b[1] - a[1]; const L2 = dx * dx + dy * dy;
  const t = L2 > 0 ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0;
  return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
}

// ── (A) rejilla recortada ──────────────────────────────────────────────────────────────────────
function esRectilineo(lazos: P2[][], tol: number): boolean {
  for (const L of lazos) for (let i = 0; i < L.length; i++) {
    const a = L[i], b = L[(i + 1) % L.length];
    if (Math.abs(a[0] - b[0]) > tol && Math.abs(a[1] - b[1]) > tol) return false;
  }
  return true;
}

function cortes(valores: number[], tam: number, tol: number): number[] {
  const u = [...valores].sort((a, b) => a - b).filter((x, i, arr) => i === 0 || x - arr[i - 1] > tol);
  const out: number[] = [u[0]];
  for (let i = 0; i + 1 < u.length; i++) {
    const L = u[i + 1] - u[i]; const n = Math.max(1, Math.ceil(L / tam - 1e-9));
    for (let k = 1; k <= n; k++) out.push(u[i] + (L * k) / n);
  }
  return out;
}

function rejilla(cont: P2[], huecos: P2[][], tam: number, tol: number) {
  const todos = [cont, ...huecos].flat();
  const X = cortes(todos.map((p) => p[0]), tam, tol), Y = cortes(todos.map((p) => p[1]), tam, tol);
  const nudos: P2[] = []; const idx = new Map<string, number>();
  const nudo = (i: number, j: number) => {
    const k = `${i},${j}`; let id = idx.get(k);
    if (id === undefined) { id = nudos.length; nudos.push([X[i], Y[j]]); idx.set(k, id); }
    return id;
  };
  const celdas: [number, number, number, number][] = [];
  for (let i = 0; i + 1 < X.length; i++) for (let j = 0; j + 1 < Y.length; j++) {
    if (!dentroDelPano(cont, huecos, [(X[i] + X[i + 1]) / 2, (Y[j] + Y[j + 1]) / 2])) continue;
    celdas.push([nudo(i, j), nudo(i + 1, j), nudo(i + 1, j + 1), nudo(i, j + 1)]);
  }
  return { nudos, celdas };
}

// ── (B) Delaunay + partición en cuadriláteros + laplaciano ────────────────────────────────────
interface Tri { a: number; b: number; c: number; cx: number; cy: number; r2: number }

function triangulo(P: P2[], a: number, b: number, c: number): Tri {
  const A = P[a], B = P[b], C = P[c];
  // orientación positiva siempre
  if ((B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]) < 0) { const t = b; b = c; c = t; }
  const Bq = P[b], Cq = P[c];
  const d = 2 * (A[0] * (Bq[1] - Cq[1]) + Bq[0] * (Cq[1] - A[1]) + Cq[0] * (A[1] - Bq[1]));
  const a2 = A[0] * A[0] + A[1] * A[1], b2 = Bq[0] * Bq[0] + Bq[1] * Bq[1], c2 = Cq[0] * Cq[0] + Cq[1] * Cq[1];
  const cx = (a2 * (Bq[1] - Cq[1]) + b2 * (Cq[1] - A[1]) + c2 * (A[1] - Bq[1])) / d;
  const cy = (a2 * (Cq[0] - Bq[0]) + b2 * (A[0] - Cq[0]) + c2 * (Bq[0] - A[0])) / d;
  return { a, b, c, cx, cy, r2: (A[0] - cx) ** 2 + (A[1] - cy) ** 2 };
}

/** Delaunay de Bowyer–Watson: se inserta punto a punto, se vacía la cavidad de los triángulos
 *  cuyo círculo circunscrito lo contiene y se vuelve a tejer desde el borde de la cavidad. */
export function delaunay(pts: P2[]): [number, number, number][] {
  const n = pts.length; if (n < 3) return [];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const D = Math.max(x1 - x0, y1 - y0) * 20, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  const P: P2[] = [...pts, [mx - D, my - D / 2], [mx + D, my - D / 2], [mx, my + D]];
  let tris: Tri[] = [triangulo(P, n, n + 1, n + 2)];
  for (let i = 0; i < n; i++) {
    const p = P[i]; const malos: Tri[] = []; const buenos: Tri[] = [];
    for (const t of tris) (((p[0] - t.cx) ** 2 + (p[1] - t.cy) ** 2) < t.r2 * (1 - 1e-12) ? malos : buenos).push(t);
    // borde de la cavidad: aristas que NO comparten dos triángulos malos
    const aristas = new Map<string, [number, number]>();
    for (const t of malos) for (const [a, b] of [[t.a, t.b], [t.b, t.c], [t.c, t.a]] as [number, number][]) {
      const k = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (aristas.has(k)) aristas.delete(k); else aristas.set(k, [a, b]);
    }
    for (const [a, b] of aristas.values()) buenos.push(triangulo(P, a, b, i));
    tris = buenos;
  }
  return tris.filter((t) => t.a < n && t.b < n && t.c < n).map((t) => [t.a, t.b, t.c]);
}

/** muestreo de un lazo a paso `h`: cada lado en ceil(L/h) tramos iguales. Devuelve los puntos y
 *  los segmentos (pares de índices en el vector devuelto). Los vértices no se mueven; los puntos
 *  intermedios llevan una perturbación ínfima A LO LARGO del lado (siguen sobre él) para que no
 *  haya cuatro puntos exactamente cocirculares, que es lo único que descoloca a Bowyer–Watson. */
function muestrear(L: P2[], h: number, base: number) {
  const pts: P2[] = []; const segs: [number, number][] = [];
  const inicio: number[] = [];
  for (let i = 0; i < L.length; i++) {
    const a = L[i], b = L[(i + 1) % L.length];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / h - 1e-9));
    inicio.push(pts.length);
    pts.push(a);
    for (let k = 1; k < n; k++) {
      const t = k / n + 1e-7 * Math.sin(1000 * (base + pts.length));
      pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  for (let i = 0; i < L.length; i++) {
    const de = inicio[i], hasta = i + 1 < L.length ? inicio[i + 1] : pts.length;
    // el último punto del lado i enlaza con el PRIMER punto del lado i+1 (y el del último lado,
    // con el vértice inicial): así el contorno queda cerrado sin diagonales
    const siguiente = i + 1 < L.length ? inicio[i + 1] : inicio[0];
    for (let k = de; k < hasta; k++) segs.push([k, k + 1 < hasta ? k + 1 : siguiente]);
  }
  return { pts, segs };
}

function delaunayCuadrilateros(cont: P2[], huecos: P2[][], tam: number, pasadas: number) {
  const h = 2 * tam;
  // 1) puntos: contorno + huecos + retícula hexagonal interior lejos del borde
  const P: P2[] = []; const segs: [number, number][] = []; const fijos = new Set<number>();
  for (const lazo of [cont, ...huecos]) {
    const m = muestrear(lazo, h, P.length); const off = P.length;
    for (const p of m.pts) { fijos.add(P.length); P.push(p); }
    for (const [a, b] of m.segs) segs.push([a + off, b + off]);
  }
  const lados = segs.map(([a, b]) => [P[a], P[b]] as [P2, P2]);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of cont) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
  const dy = h * Math.sqrt(3) / 2;
  let fila = 0;
  for (let y = y0 + dy; y < y1 - 0.25 * dy; y += dy, fila++)
    for (let x = x0 + (fila % 2 ? h : h / 2); x < x1 - 0.25 * h; x += h) {
      const q: P2 = [x + 1e-6 * h * Math.sin(7 * fila + x), y + 1e-6 * h * Math.cos(3 * fila + y)];
      if (!dentroDelPano(cont, huecos, q)) continue;
      if (lados.some(([a, b]) => distSeg(q, a, b) < 0.5 * h)) continue;
      P.push(q);
    }
  // 2) Delaunay, filtrado por el polígono, y comprobación de que el contorno es arista
  let tris: [number, number, number][] = []; let inserciones = 0;
  for (let intento = 0; intento < 6; intento++) {
    tris = delaunay(P).filter(([a, b, c]) =>
      dentroDelPano(cont, huecos, [(P[a][0] + P[b][0] + P[c][0]) / 3, (P[a][1] + P[b][1] + P[c][1]) / 3]));
    const aristas = new Set<string>();
    for (const [a, b, c] of tris) for (const [i, j] of [[a, b], [b, c], [c, a]]) aristas.add(i < j ? `${i}-${j}` : `${j}-${i}`);
    const faltan = segs.filter(([a, b]) => !aristas.has(a < b ? `${a}-${b}` : `${b}-${a}`));
    if (!faltan.length) break;
    // el segmento no salió: se parte por su punto medio (sigue sobre el borde) y se repite
    for (const s of faltan) {
      const [a, b] = s; const id = P.length;
      P.push([(P[a][0] + P[b][0]) / 2, P[a][1] / 2 + P[b][1] / 2]); fijos.add(id);
      s[1] = id; segs.push([id, b]); inserciones++;
    }
  }
  // 3) cada triángulo -> 3 cuadriláteros (baricentro + puntos medios)
  const nudos: P2[] = P.map((p) => [p[0], p[1]]);
  const enBorde = new Set<number>(fijos);
  const medios = new Map<string, number>();
  const segSet = new Set(segs.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)));
  const medio = (i: number, j: number) => {
    const k = i < j ? `${i}-${j}` : `${j}-${i}`; let id = medios.get(k);
    if (id === undefined) {
      id = nudos.length; nudos.push([(nudos[i][0] + nudos[j][0]) / 2, (nudos[i][1] + nudos[j][1]) / 2]); medios.set(k, id);
      if (segSet.has(k)) enBorde.add(id);
    }
    return id;
  };
  const celdas: [number, number, number, number][] = [];
  for (const [a, b, c] of tris) {
    const g = nudos.length; nudos.push([(nudos[a][0] + nudos[b][0] + nudos[c][0]) / 3, (nudos[a][1] + nudos[b][1] + nudos[c][1]) / 3]);
    const mab = medio(a, b), mbc = medio(b, c), mca = medio(c, a);
    celdas.push([a, mab, g, mca], [b, mbc, g, mab], [c, mca, g, mbc]);
  }
  // 4) laplaciano: nudos interiores al promedio de sus vecinos; borde fijo; sin invertir celdas
  const vecinos: Set<number>[] = nudos.map(() => new Set<number>());
  const deNudo: number[][] = nudos.map(() => []);
  celdas.forEach((q, ci) => { for (let k = 0; k < 4; k++) { vecinos[q[k]].add(q[(k + 1) % 4]); vecinos[q[k]].add(q[(k + 3) % 4]); deNudo[q[k]].push(ci); } });
  const jacMin = (ci: number) => {
    const q = celdas[ci]; let mn = Infinity;
    for (let k = 0; k < 4; k++) {
      const p0 = nudos[q[k]], p1 = nudos[q[(k + 1) % 4]], p3 = nudos[q[(k + 3) % 4]];
      mn = Math.min(mn, (p1[0] - p0[0]) * (p3[1] - p0[1]) - (p1[1] - p0[1]) * (p3[0] - p0[0]));
    }
    return mn;
  };
  let rechazos = 0;
  for (let pasada = 0; pasada < pasadas; pasada++)
    for (let i = 0; i < nudos.length; i++) {
      if (enBorde.has(i) || !vecinos[i].size) continue;
      let sx = 0, sy = 0; for (const j of vecinos[i]) { sx += nudos[j][0]; sy += nudos[j][1]; }
      const antes: P2 = [nudos[i][0], nudos[i][1]];
      nudos[i] = [sx / vecinos[i].size, sy / vecinos[i].size];
      if (deNudo[i].some((ci) => jacMin(ci) <= 0)) { nudos[i] = antes; rechazos++; }
    }
  const nota = `delaunay: ${P.length} puntos, ${tris.length} triángulos -> ${celdas.length} cuadriláteros; ` +
    `${inserciones} inserción(es) de borde; laplaciano ${pasadas} pasadas, ${rechazos} movimiento(s) rechazado(s)`;
  return { nudos, celdas, enBorde, nota };
}

// ── entrada única ─────────────────────────────────────────────────────────────────────────────
export function pavimentar(pano: PanoPoligonal, tam: number, opts: { pasadas?: number; forzarDelaunay?: boolean } = {}): MallaPavimentada {
  if (!(tam > 0)) throw new Error("pavimentar: tam debe ser > 0");
  if (pano.contorno.length < 3) throw new Error("pavimentar: el contorno necesita 3 vértices o más");
  const M = marcoLocal(pano.contorno);
  let cont = pano.contorno.map((p) => a2d(M, p));
  if (area2(cont) < 0) cont = cont.reverse();     // no debería pasar (n sale de Newell), por si acaso
  const huecos = pano.huecos.filter((h) => h.length >= 3).map((h) => h.map((p) => a2d(M, p)));
  let escala = 0; for (const p of cont) escala = Math.max(escala, Math.abs(p[0]), Math.abs(p[1]));
  const tol = 1e-9 * Math.max(1, escala);
  const lazos = [cont, ...huecos];
  if (!opts.forzarDelaunay && esRectilineo(lazos, tol)) {
    const r = rejilla(cont, huecos, tam, tol);
    const enBorde = new Set<number>();
    r.nudos.forEach((q, i) => { if (lazos.some((L) => L.some((a, k) => distSeg(q, a, L[(k + 1) % L.length]) < tol))) enBorde.add(i); });
    return { nudos: r.nudos.map((q) => a3d(M, q)), celdas: r.celdas, metodo: "rejilla", enBorde,
             nota: `rejilla recortada: ${r.nudos.length} nudos, ${r.celdas.length} celdas` };
  }
  const d = delaunayCuadrilateros(cont, huecos, tam, opts.pasadas ?? 10);
  return { nudos: d.nudos.map((q) => a3d(M, q)), celdas: d.celdas, metodo: "delaunay", enBorde: d.enBorde, nota: d.nota };
}

/** área de una malla (suma de sus cuadriláteros, con signo según el marco) — para comprobar que
 *  cubre exactamente el polígono menos los huecos */
export function areaMalla(m: MallaPavimentada): number {
  const M = marcoLocal(m.nudos.length >= 3 ? [m.nudos[m.celdas[0][0]], m.nudos[m.celdas[0][1]], m.nudos[m.celdas[0][2]]] : [[0, 0, 0], [1, 0, 0], [0, 1, 0]]);
  let s = 0;
  for (const q of m.celdas) s += area2(q.map((i) => a2d(M, m.nudos[i])));
  return Math.abs(s);
}
