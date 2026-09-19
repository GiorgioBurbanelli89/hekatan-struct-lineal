/**
 * DISEÑO DE LOSAS POR FRANJAS (strip-based design) — igual que SAFE 20.3.
 *
 * Algoritmo reescrito a partir de la documentación de CSI (SAFE Key Features §6.2.2-6.2.3,
 * SAFE RC Design cap. 2 ACI 318-19 / cap. 3 ACI 318-14) y confirmado contra el binario
 * (bitácora registros/2026-09-18_franjas_safe_re.md). Validado a 4 cifras contra SAFE:
 * tests/casos/franjas_vs_safe.mjs (radier MOD_002: 1542 fuerzas de franja, 257 estaciones,
 * 264 filas Start/Middle/End).
 *
 * Tres pasos, como SAFE:
 *   1. CORTE: en cada estación, una recta perpendicular a la franja de ancho wL+wR, desplazada
 *      ±2·tolFusión (Before / After). Se trocea por los elementos de losa que atraviesa; donde no
 *      hay losa (hueco, borde) no hay trozo → el ancho efectivo se recorta solo.
 *   2. INTEGRACIÓN: cada trozo reparte su longitud en pesos nodales (integral exacta de la
 *      interpolación lineal por bordes); la fuerza de franja es Σ peso·(fuerza del nudo DE ESE
 *      ELEMENTO, sin promediar) rotada al eje de la franja. Para diseño, Wood-Armer por nudo.
 *   3. DISEÑO ACI: bloque rectangular por cara (arriba/abajo) con el axial de membrana; cortante
 *      en una dirección con Vc de ACI 318-19 22.5.5.1(c) (o 318-14 2√f'c).
 *
 * Todo en unidades del modelo: el llamador da `N` = newtons por unidad de fuerza y `M` = metros
 * por unidad de longitud para convertir las constantes de la norma (psi, pulgadas).
 */

export interface ShellNodeForces { F11: number; F22: number; F12: number; M11: number; M22: number; M12: number; V13: number; V23: number; }

/** Elemento de losa: nudos en el orden del elemento (x,y globales) y fuerzas por nudo DEL ELEMENTO. */
export interface StripMeshElem {
  id: string;
  xy: [number, number][];
  /** espesor (m del modelo) y si entra en el diseño (SAFE excluye "Stiff", aberturas, etc.). */
  h: number;
  design: boolean;
  /** tipo de propiedad "Footing"/"Mat": λs = 1 en ACI 318-19. */
  footing?: boolean;
  /** fuerzas por nudo (mismo orden que xy), en ejes GLOBALES (1 = X, 2 = Y). */
  forces: ShellNodeForces[];
}

export interface DesignStrip {
  name: string;
  layer: "A" | "B";
  start: [number, number];
  end: [number, number];
  wStartLeft: number; wStartRight: number; wEndLeft: number; wEndRight: number;
}

export interface StripPrefs {
  code: "ACI 318-19" | "ACI 318-14";
  fc: number; fy: number;              // resistencias en unidades del modelo (fuerza/longitud²)
  coverTop: number; coverBot: number;  // recubrimiento libre
  barSize: number;                     // diámetro de barra de losa
  innerLayer: "A" | "B";               // capa interior (su d pierde un diámetro)
  phiFlex?: number; phiShear?: number;
  mergeTol?: number;                   // tolerancia de fusión (SAFE: 1 mm)
  lambda?: number;
  /** newtons por unidad de fuerza del modelo y metros por unidad de longitud. */
  N: number; M: number;
}

export interface StripForce { P: number; V2: number; T: number; M3: number; width: number; }

export interface SideDesign {
  empty: boolean;
  width: number; h: number;
  AsTop: number; AsBot: number; MTop: number; MBot: number;
  AminTop: number; AminBot: number;
  V: number; Av_s: number; phiVc: number;
  pieces: { elem: string; t0: number; t1: number }[];
}
export interface StationDesign {
  station: number; x: number; y: number;
  before: SideDesign; after: SideDesign;
  AsTop: number; AsBot: number; MTop: number; MBot: number; AminTop: number; AminBot: number;
  V: number; Av_s: number; width: number;
}
export interface SpanZoneResult { span: string; location: "Start" | "Middle" | "End"; MTop: number; AsTop: number; MBot: number; AsBot: number; V: number; Av_s: number;
  /** ancho de concreto de la estación que gobierna cada cara (para el número de varillas) */
  widthTop: number; widthBot: number; }

const f32 = Math.fround;

// ─────────────────────────────── geometría del corte ───────────────────────────────

interface Piece { elem: StripMeshElem; sloc: number; sedge: number; eloc: number; eedge: number; t0: number; t1: number; tm: number; xa: number; ya: number; xb: number; yb: number; on: boolean; }

class Geo {
  tol: number; ptTol: number; s: number;
  constructor(mergeTolModel: number, M: number) {
    // SAFE trabaja en su unidad de base de datos (mm). Escalamos la geometría a mm para que los
    // empates en bordes caigan igual que en SAFE.
    this.s = 1000 * M;
    this.tol = mergeTolModel * this.s;
    this.ptTol = Math.max(1.01 * this.tol, 0.101 * 25.4);
  }
}

function distParam(px: number, py: number, ax: number, ay: number, bx: number, by: number): [number, number] | null {
  const vx = bx - ax, vy = by - ay, wx = px - ax, wy = py - ay;
  if (Math.hypot(bx - px, by - py) === 0) return [0, 1];
  const L = Math.hypot(vx, vy);
  if (L < 1e-20) return null;
  return [Math.abs(vx * wy - vy * wx) / L, (vx * wx + vy * wy) / (L * L)];
}

function onSegment(px: number, py: number, ax: number, ay: number, bx: number, by: number, tol: number) {
  const r = distParam(px, py, ax, ay, bx, by);
  if (!r) return false;
  const L = Math.hypot(bx - ax, by - ay);
  if (L < 1e-6 || r[0] > tol) return false;
  return !(r[1] < -tol * 0.1 / L || r[1] > 1 + tol * 0.1 / L);
}

/** ¿dónde cae el punto respecto del elemento? null fuera; [1,0] dentro; [3,k] sobre el borde k (1-based). */
function locate(px: number, py: number, P: [number, number][], tol: number): [number, number] | null {
  const n = P.length;
  if (!(P.some(([x]) => x - tol <= px) && P.some(([x]) => x + tol >= px))) return null;
  if (!(P.some(([, y]) => y - tol <= py) && P.some(([, y]) => y + tol >= py))) return null;
  for (let k = 0; k < n; k++) {
    const a = P[k], b = P[(k + 1) % n];
    if (onSegment(px, py, a[0], a[1], b[0], b[1], tol)) return [3, k + 1];
  }
  let s0 = 0;
  for (let k = 0; k < n; k++) {
    const a = P[k], b = P[(k + 1) % n];
    const ex = b[0] - a[0], ey = b[1] - a[1], L1 = Math.hypot(ex, ey);
    if (L1 < 1e-6) continue;
    const qx = px - a[0], qy = py - a[1], L2 = Math.hypot(qx, qy);
    if (L2 < 1e-6) continue;
    const cz = (ex / L1) * (qy / L2) - (ey / L1) * (qx / L2);
    if (Math.abs(cz) < 1e-6) continue;
    const sg = cz < 0 ? -1 : 1;
    if (k === 0) s0 = sg; else if (sg !== s0) return null;
  }
  return [1, 0];
}

function lineInt(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, dx: number, dy: number): [number, number] | null {
  const num = (bx - ax) * (dy - cy) - (dx - cx) * (by - ay);
  if (Math.abs(num) < 1e-20) return null;
  return [((cx - ax) * (dy - cy) - (dx - cx) * (cy - ay)) / num, ((cx - ax) * (by - ay) - (bx - ax) * (cy - ay)) / num];
}

/** ordenación por selección con intercambio (no estable), como SAFE: el orden de empates importa. */
function selSort<T>(a: T[], key: (x: T) => number): T[] {
  const r = a.slice();
  for (let i = 0; i < r.length; i++) {
    let m = key(r[i]), mi = i;
    for (let j = i; j < r.length; j++) if (m > key(r[j])) { m = key(r[j]); mi = j; }
    const t = r[i]; r[i] = r[mi]; r[mi] = t;
  }
  return r;
}

function cutPieces(x1: number, y1: number, x2: number, y2: number, cand: { e: StripMeshElem; P: [number, number][] }[], g: Geo): Piece[] {
  const S: [StripMeshElem, number, number, [number, number][]][] = [];
  const E: [StripMeshElem, number, number, [number, number][]][] = [];
  for (const c of cand) {
    const a = locate(x1, y1, c.P, g.ptTol); if (a) S.push([c.e, a[0], a[1], c.P]);
    const b = locate(x2, y2, c.P, g.ptTol); if (b) E.push([c.e, b[0], b[1], c.P]);
  }
  for (const s of S) for (const t of E) if (s[0] === t[0])
    return [{ elem: s[0], sloc: s[1], sedge: s[2], eloc: t[1], eedge: t[2], t0: 0, t1: 1, tm: 0.5, xa: x1, ya: y1, xb: x2, yb: y2, on: true }];
  let ent: { on: boolean; e: StripMeshElem; loc: number; edge: number; t: number; x: number; y: number }[] = [];
  for (const c of cand) {
    const P = c.P, n = P.length;
    for (let k = 0; k < n; k++) {
      const a = P[k], b = P[(k + 1) % n];
      const r = lineInt(x1, y1, x2, y2, a[0], a[1], b[0], b[1]);
      if (r && r[0] >= 0 && r[0] <= 1 && r[1] >= 0 && r[1] <= 1)
        ent.push({ on: true, e: c.e, loc: 3, edge: k + 1, t: r[0], x: x1 + r[0] * (x2 - x1), y: y1 + r[0] * (y2 - y1) });
    }
  }
  for (const s of S) ent.push({ on: true, e: s[0], loc: s[1], edge: 0, t: 0, x: x1, y: y1 });
  for (const s of E) ent.push({ on: true, e: s[0], loc: s[1], edge: 0, t: 1, x: x2, y: y2 });
  ent = selSort(ent, d => d.t);
  for (let i = 0; i < ent.length; i++) {
    if (!ent[i].on) continue;
    for (let j = i + 1; j < ent.length; j++) {
      if (!ent[j].on) continue;
      if (!(Math.abs(ent[j].t - ent[i].t) < 1e-6)) break;
      if (ent[j].e === ent[i].e) ent[j].on = false;
    }
  }
  ent = ent.filter(d => d.on);
  const used = ent.map(() => false);
  let pcs: Piece[] = [];
  for (let i = 0; i < ent.length; i++) {
    if (used[i]) continue;
    for (let j = ent.length - 1; j > i; j--) {
      if (ent[j].e === ent[i].e) {
        used[i] = used[j] = true;
        const a = ent[i], b = ent[j];
        pcs.push({ elem: a.e, sloc: a.loc, sedge: a.edge, eloc: b.loc, eedge: b.edge, t0: a.t, t1: b.t, tm: (a.t + b.t) / 2, xa: a.x, ya: a.y, xb: b.x, yb: b.y, on: true });
        break;
      }
    }
  }
  for (let i = 0; i < pcs.length; i++) {
    if (!pcs[i].on) continue;
    for (let j = 0; j < pcs.length; j++)
      if (j !== i && pcs[j].on && pcs[j].t0 >= pcs[i].t0 - 1e-6 && pcs[j].t1 <= pcs[i].t1 + 1e-6) pcs[j].on = false;
  }
  pcs = selSort(pcs.filter(p => p.on), d => d.tm);
  const out: Piece[] = []; let last = -1;
  for (const p0 of pcs) {
    if (!(p0.t0 > last + 1e-6)) continue;
    const p = { ...p0 }; out.push(p); last = p.t0;
    if (out.length > 1) {
      const q = out[out.length - 2];
      if (q.t1 > last) {
        const t1o = q.t1; q.t1 = last; q.eloc = 1; q.eedge = 0;
        const f = (q.t1 - q.t0) / (t1o - q.t0);
        q.xb = q.xa + (q.xb - q.xa) * f; q.yb = q.ya + (q.yb - q.ya) * f;
      }
    }
  }
  return out;
}

/** pesos nodales del trozo = integral de la interpolación lineal por bordes (en unidades del modelo). */
function pieceWeights(p: Piece, P: [number, number][], g: Geo): number[] {
  const n = P.length, w = new Array(n).fill(0);
  const A21 = p.xa, A22 = p.ya, A23 = p.xb, A24 = p.yb;
  const L = Math.hypot(A23 - A21, A24 - A22);
  if (L <= 0) return w;
  let n34 = 0, n35 = 0, n36 = 0, n37 = 0, n38 = 0, n39 = 0;
  if (p.sloc === 3 && p.sedge > 0) { n34 = A21; n35 = A22; n36 = p.sedge; }
  else for (let k = 0; k < n; k++) {
    const a = P[k], b = P[(k + 1) % n], r = lineInt(A21, A22, A23, A24, a[0], a[1], b[0], b[1]);
    if (r && r[0] < 1e-6 && r[1] > -1e-6 && r[1] < 1.000001) { n34 = A21 + r[0] * (A23 - A21); n35 = A22 + r[0] * (A24 - A22); n36 = k + 1; break; }
  }
  if (p.eloc === 3 && p.eedge > 0) { n37 = A23; n38 = A24; n39 = p.eedge; }
  else for (let k = 0; k < n; k++) {
    const a = P[k], b = P[(k + 1) % n], r = lineInt(A21, A22, A23, A24, a[0], a[1], b[0], b[1]);
    if (r && r[0] > 1e-6 && r[1] > -1e-6 && r[1] < 1.000001) { n37 = A21 + r[0] * (A23 - A21); n38 = A22 + r[0] * (A24 - A22); n39 = k + 1; break; }
  }
  let n40 = 0, n41 = 0;
  if (Math.abs(n37 - n34) > Math.abs(n38 - n35)) { n40 = (A21 - n34) / (n37 - n34); n41 = (A23 - n34) / (n37 - n34); }
  else if (Math.abs(n38 - n35) > 0) { n40 = (A22 - n35) / (n38 - n35); n41 = (A24 - n35) / (n38 - n35); }
  const edgePar = (k: number, qx: number, qy: number): [number, number, number] => {
    const a = P[k - 1], b = P[k % n];
    let s = 0;
    if (Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1])) s = (qx - a[0]) / (b[0] - a[0]);
    else if (Math.abs(b[1] - a[1]) > 0) s = (qy - a[1]) / (b[1] - a[1]);
    return [s, k - 1, k % n];
  };
  if (n36 > 0) { const [s, i, j] = edgePar(n36, n34, n35); w[j] += 0.5 * (2 - n40 - n41) * s * L; w[i] += 0.5 * (2 - n40 - n41) * (1 - s) * L; }
  if (n39 > 0) { const [s, i, j] = edgePar(n39, n37, n38); w[i] += 0.5 * (n40 + n41) * (1 - s) * L; w[j] += 0.5 * (n40 + n41) * s * L; }
  return w.map(x => x / g.s);
}

/** tensor de la cáscara rotado al eje de la franja (ángulo th). */
function rotate(v: ShellNodeForces, th: number) {
  const c = Math.cos(th), s = Math.sin(th);
  return {
    M11: v.M11 * c * c + v.M22 * s * s + 2 * v.M12 * s * c,
    M22: v.M11 * s * s + v.M22 * c * c - 2 * v.M12 * s * c,
    M12: (v.M22 - v.M11) * s * c + v.M12 * (c * c - s * s),
    F11: v.F11 * c * c + v.F22 * s * s + 2 * v.F12 * s * c,
    F12: (v.F22 - v.F11) * s * c + v.F12 * (c * c - s * s),
    V13: v.V13 * c + v.V23 * s,
  };
}

/** Wood-Armer (SAFE Key Features §6.2.2): devuelve [abajo en 1, arriba en 1 (≤0)]. */
export function woodArmer(m11: number, m22: number, m12: number): [number, number] {
  const flag = !(m22 >= m11);
  const a = flag ? m22 : m11, b = flag ? m11 : m22, c = m12;
  let n4: number, n5: number, n6: number, n7: number;
  if (a >= -Math.abs(c)) { n4 = a + Math.abs(c); n5 = b + Math.abs(c); } else { n4 = 0; n5 = b + c * c / Math.abs(a); }
  n4 = Math.max(n4, 0); n5 = Math.max(n5, 0);
  if (b <= Math.abs(c)) { n6 = -a + Math.abs(c); n7 = -b + Math.abs(c); } else { n6 = -a + c * c / Math.abs(b); n7 = 0; }
  n6 = Math.max(n6, 0); n7 = Math.max(n7, 0);
  return flag ? [n5, -n7] : [n4, -n6];
}

// ─────────────────────────────── franja ───────────────────────────────

export class StripCutter {
  private g: Geo;
  private cand: { e: StripMeshElem; P: [number, number][] }[];
  constructor(elems: StripMeshElem[], private prefs: StripPrefs) {
    this.g = new Geo(prefs.mergeTol ?? 0.001 / prefs.M, prefs.M);
    this.cand = elems.filter(e => e.design).map(e => ({ e, P: e.xy.map(([x, y]) => [x * this.g.s, y * this.g.s] as [number, number]) }));
  }

  /** geometría de la recta de corte de SAFE: de derecha a izquierda, desplazada side·2·tol. */
  cutLine(strip: DesignStrip, station: number, side: -1 | 1) {
    const s = this.g.s;
    const a = [strip.start[0] * s, strip.start[1] * s], b = [strip.end[0] * s, strip.end[1] * s];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const th = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const frac = Math.min(Math.max(station * s / L, 0), 1);
    const wL = (strip.wStartLeft + (strip.wEndLeft - strip.wStartLeft) * frac) * s;
    const wR = (strip.wStartRight + (strip.wEndRight - strip.wStartRight) * frac) * s;
    const s1 = station * s + side * 2 * this.g.tol;
    const px = a[0] + s1 / L * (b[0] - a[0]), py = a[1] + s1 / L * (b[1] - a[1]);
    const x1 = px + wR * Math.sin(th), y1 = py - wR * Math.cos(th);
    const x2 = px - wL * Math.sin(th), y2 = py + wL * Math.cos(th);
    const width = f32(Math.hypot(x2 - x1, y2 - y1)) / s;
    return { x1, y1, x2, y2, th, width, gx: (a[0] + station * s / L * (b[0] - a[0])) / s, gy: (a[1] + station * s / L * (b[1] - a[1])) / s };
  }

  pieces(strip: DesignStrip, station: number, side: -1 | 1) {
    const c = this.cutLine(strip, station, side);
    return { ...c, pcs: cutPieces(c.x1, c.y1, c.x2, c.y2, this.cand, this.g) };
  }

  /** acumula en el corte: fuerzas de franja y (con WA) momentos de diseño. `pick` elige las fuerzas del nudo. */
  integrate(pcs: Piece[], th: number, pick: (e: StripMeshElem, k: number) => ShellNodeForces) {
    const R = { P: 0, V2: 0, T: 0, M3: 0, bot: 0, top: 0, nT: 0, nC: 0 };
    for (const p of pcs) {
      const P = this.cand.find(c => c.e === p.elem)!.P;
      const w = pieceWeights(p, P, this.g);
      for (let k = 0; k < w.length; k++) {
        if (w[k] === 0) continue;
        const r = rotate(pick(p.elem, k), th);
        const [b, t] = woodArmer(r.M11, r.M22, r.M12);
        R.P += r.F11 * w[k]; R.M3 += r.M11 * w[k]; R.T += r.M12 * w[k]; R.V2 += r.V13 * w[k];
        R.bot += b * w[k]; R.top += t * w[k];
        R.nT += (r.F11 + Math.abs(r.F12)) * w[k]; R.nC += (r.F11 - Math.abs(r.F12)) * w[k];
      }
    }
    return R;
  }

  /** Strip Forces de SAFE (P, V2, T, M3) en una estación y lado. */
  stripForce(strip: DesignStrip, station: number, side: -1 | 1, pick?: (e: StripMeshElem, k: number) => ShellNodeForces): StripForce {
    const c = this.pieces(strip, station, side);
    const R = this.integrate(c.pcs, c.th, pick ?? ((e, k) => e.forces[k]));
    return { P: R.P, V2: R.V2, T: R.T, M3: R.M3, width: c.pcs.reduce((a, p) => a + (p.t1 - p.t0), 0) * c.width };
  }

  // ─────────────── diseño ACI ───────────────

  private get u() {
    const p = this.prefs;
    const psi = 6894.757293168 / p.N * p.M * p.M; // 1 psi en unidades del modelo
    return { psi, inch: 0.0254 / p.M };
  }

  /** sección rectangular con axial (bloque rectangular). M≥0; P>0 compresión. → [As, As', falla] */
  private section(M: number, P: number, hc: number, h: number, d: number, b: number, dp: number): [number, number, boolean] {
    const { psi } = this.u, fc = this.prefs.fc, fy = this.prefs.fy, phi = this.prefs.phiFlex ?? 0.9;
    const Es = 29000000 * psi, ec = 0.003, es = 0.003 + fy / Es;
    const fyd = Math.min(fy, 100000 * psi);
    const c085 = 0.85 * fc * phi, T = fyd * phi;
    const b1 = Math.min(Math.max(0.85 - 0.05 * (fc / psi - 4000) / 1000, 0.65), 0.85);
    const amax = b1 * (ec / (ec + es) * d);
    let Mue = Math.abs(M) + P * (hc - (h - d));
    if (Math.abs(Mue) <= 1e-6 * c085 * b * d * d) Mue = 0;
    if (Mue === 0 && P === 0) return [0, 0, false];
    const tail = (C: number, rem: number): [number, number, boolean] => {
      let Cs = 0, fsp = T;
      if (Math.abs(rem / Mue) > 1e-4) {
        if (!(d - dp > 0.01 * d)) return [0, 0, true];
        const esp = ec * (amax / b1 - dp) / (amax / b1);
        if (esp < 0) return [0, 0, true];
        fsp = Math.min(Es * esp * phi, T);
        Cs = rem / (d - dp); C += Cs;
      }
      const Asp = Cs / (fsp - c085);
      if (Asp < 0) return [0, 0, true];
      return [Math.abs((C - P) / T), Asp, false];
    };
    const block = () => {
      const a = Math.min(d - Math.sqrt(Math.max(d * d - 2 * Mue / (c085 * b), 0)), amax);
      const C = b * a * c085;
      return tail(C, Math.max(Mue - C * (d - a / 2), 0));
    };
    if (P === 0) return block();
    if (P < 0) {
      if (Mue <= 0) {
        if (!(d - dp > 0.01 * d)) return [0, 0, true];
        const t = Math.abs(Mue) / (d - dp);
        return [(-P - t) / T, t / T, false];
      }
      return block();
    }
    // compresión (casos de SAFE)
    const e = Math.abs(M) / P;
    const C0 = c085 * Math.max(h - 2 * e, 0) * b;
    if (e < h / 2 && P < C0) return [0, 0, false];
    const Cfull = c085 * h * b, Cmax = c085 * amax * b;
    const big = !(e < 0.9999 * (h / 2 - dp));
    const P36 = big ? Cfull * 1e4 : Cfull * ((h / 2 - dp) / (h / 2 - dp - e));
    const P37 = big ? Cmax * 1e4 : Cmax * ((amax / 2 - dp) / (h / 2 - dp - e));
    if (e <= h / 2 - dp && P > P36) {
      const C = b * h * c085, rem = Math.max(Mue - C * (d - h / 2), 0);
      if (!(d - dp > 0.01 * d)) return [0, 0, true];
      const Cs = rem / (d - dp);
      return [Math.max(P - C - Cs, 0) / (T - c085), Cs / (T - c085), false];
    }
    if (e <= h / 2 - dp && P >= P37) {
      const a = Math.min(dp + Math.sqrt(Math.max(dp * dp + 2 * (P / (c085 * b * h)) * ((h - hc - e - dp) * h), 0)), h);
      const C = b * a * c085, rem = Math.max(Mue - C * (d - a / 2), 0);
      let fsp = T, Cs = 0;
      if (Math.abs(rem / Mue) > 1e-4) {
        const esp = ec * (a / b1 - dp) / (a / b1);
        if (esp < 0) return [0, 0, true];
        fsp = Math.max(Math.min(Es * esp * phi, T), -T);
        Cs = rem / (d - dp);
      }
      return [0, Cs / (fsp - c085), false];
    }
    const a = Math.min(d - Math.sqrt(Math.max(d * d - 2 * Mue / (c085 * b), 0)), amax);
    let C = b * a * c085; const rem = Math.max(Mue - C * (d - a / 2), 0);
    let fsp = T, Cs = 0;
    if (Math.abs(rem / Mue) > 1e-4) {
      if (!(d - dp > 0.01 * d)) return [0, 0, true];
      const esp = ec * (a / b1 - dp) / (a / b1);
      if (esp < 0) return [0, 0, true];
      fsp = Math.max(Math.min(Es * esp * phi, T), -T);
      Cs = rem / (d - dp); C += Cs;
    }
    return [Math.abs((C - P) / T), Cs / (fsp - c085), false];
  }

  private design1(M: number, P: number, hc: number, d: number, dp: number, h: number, b: number): [number, number] {
    const fc = this.prefs.fc;
    let As = 0, Asp = 0;
    if (!(Math.abs(M) < 1e-6 * fc * b * d * d && Math.abs(P) < 1e-6 * fc * b * d)) [As, Asp] = this.section(Math.abs(M), P, hc, h, d, b, dp);
    if (As / (b * d) <= 2e-5) As = 0;
    if (Asp / (b * d) <= 1e-4) Asp = 0;
    return [As, Asp];
  }

  private sideDesign(strip: DesignStrip, station: number, side: -1 | 1, pick: (e: StripMeshElem, k: number) => ShellNodeForces): SideDesign {
    const pf = this.prefs, c = this.pieces(strip, station, side);
    const empty: SideDesign = { empty: true, width: 0, h: 0, AsTop: 0, AsBot: 0, MTop: 0, MBot: 0, AminTop: 0, AminBot: 0, V: 0, Av_s: 0, phiVc: 0, pieces: [] };
    if (!c.pcs.length) return empty;
    const byH = new Map<number, number>();
    for (const p of c.pcs) byH.set(p.elem.h, (byH.get(p.elem.h) ?? 0) + (p.t1 - p.t0) * c.width);
    const h = Math.max(...byH.keys()), b = byH.get(h)!;
    const R = this.integrate(c.pcs, c.th, pick);
    const db = pf.barSize;
    const inner = strip.layer === pf.innerLayer;
    const dT = h - pf.coverTop - db / 2 - (inner ? db : 0), dB = h - pf.coverBot - db / 2 - (inner ? db : 0);
    const dpT = h - dT, dpB = h - dB, hc = h / 2;
    const fc = pf.fc;
    let top = R.top, bot = R.bot;
    if (Math.abs(top) < 1e-5 * fc * b * h * h) top = 0;
    if (Math.abs(bot) < 1e-5 * fc * b * h * h) bot = 0;
    const Ps = [R.nT, R.nC].map(n => (Math.abs(-n) < 1e-5 * fc * b * h ? 0 : -n));
    const cands = Ps.slice(); if (Ps[0] !== 0 && Ps[1] !== 0) cands.push(0);
    let AsT = 0, AsB = 0, MT = 0, MB = 0;
    const better = (n: number, cur: number, m: number, mc: number) => f32(n) > cur || (f32(n) === cur && Math.abs(f32(m)) >= Math.abs(mc));
    // SAFE diseña con los tres axiales (F11+|F12|, F11-|F12|, y 0 si ambos existen): gobierna el mayor As.
    if (Math.abs(top) > 0) for (const P of cands) {
      const [As, Asp] = this.design1(top, P, hc, dT, dpT, h, b);
      if (better(As, AsT, top, MT)) { AsT = f32(As); MT = f32(top); AsB = Math.max(AsB, f32(Asp)); }
    }
    for (const P of cands) {
      const [As, Asp] = this.design1(bot, P, hc, dB, dpB, h, b);
      if (better(As, AsB, bot, MB)) { AsB = f32(As); MB = f32(bot); AsT = Math.max(AsT, f32(Asp)); }
    }
    // As,min losa: 318-19 0.0018·b·h; 318-14 0.0020 (fy<60 ksi), 0.0018 (=60), 0.0018·60000/fy (>60)
    const fyPsi = pf.fy / this.u.psi;
    const rhoMin = pf.code === "ACI 318-19" ? 0.0018 : fyPsi < 60000 ? 0.0020 : fyPsi === 60000 ? 0.0018 : 0.0018 * 60000 / fyPsi;
    const amin = rhoMin * b * h;
    // cortante en una dirección
    const { psi, inch } = this.u, phiV = pf.phiShear ?? 0.75, lam = pf.lambda ?? 1;
    const Mbig = Math.abs(top) > Math.abs(bot) ? top : bot;
    const Ast = Mbig >= 0 ? AsB : AsT;
    const d = Math.max(dT, dB), V = Math.abs(R.V2);
    const sq = Math.min(Math.sqrt(fc / psi), 100) * psi;
    const fyt = Math.min(pf.fy, 60000 * psi);
    let vc: number, vmax: number;
    if (pf.code === "ACI 318-19") {
      const lamS = c.pcs.some(p => p.elem.footing) ? 1 : Math.min(Math.sqrt(2 / (1 + d / inch / 10)), 1);
      vmax = 5 * lam * sq;
      vc = Math.min(8 * lamS * lam * Math.cbrt(Ast / (b * d)) * sq, vmax);
      if (vc < 1e-6) vc = 0;
    } else { vc = 2 * lam * sq; vmax = vc + 8 * sq; }
    const v = V / (b * d);
    const avmin = Math.max(0.75 * sq, 50 * psi) * b / fyt;
    let av = 0;
    if (v > phiV * vc) av = v <= phiV * (pf.code === "ACI 318-19" ? vmax : vmax) ? Math.max((v - phiV * vc) * b / (fyt * phiV), avmin) : NaN;
    return {
      empty: false, width: f32(b), h, AsTop: AsT, AsBot: AsB, MTop: MT, MBot: MB,
      AminTop: AsT > AsB ? amin : 0, AminBot: AsT > AsB ? 0 : amin,
      V, Av_s: av, phiVc: phiV * vc * b * d,
      pieces: c.pcs.map(p => ({ elem: p.elem.id, t0: p.t0, t1: p.t1 })),
    };
  }

  /**
   * DISEÑO POR ELEMENTOS FINITOS (SAFE «Finite Element Based»), un nudo de un elemento.
   * Binario: ᣆ.ᜌ(int, int, ref ᯞ.ᜆ) + ᢣ._1734. Por nudo, SIN promediar entre elementos:
   *   Wood-Armer (M11, M22, M12) → momentos de diseño arriba/abajo en dir 1 (X) y dir 2 (Y);
   *   axial P = −F11 / −F22 (la de ESA dirección, sin |F12|); compresión < 0.1·f'c·h → 0;
   *   |M| < 1e-5·f'c·h² → 0; sección ACI con b = 1 (resultado = área por unidad de ancho);
   *   arriba = máx(As arriba, As' del diseño de abajo) y viceversa.
   *   Con mínimo: ρmin·h en la cara con MÁS acero (empate → abajo).
   * Validado: 3616/3616 valores contra los arrays «Slab Design Data» del FDB de SAFE (1.3e-7).
   * `forces` en ejes globales (dir 1 = X); para combos, llamar por combo y envolver (máximo).
   */
  feNode(f: ShellNodeForces, h: number): { top1: number; bot1: number; top2: number; bot2: number; amin: number } {
    const pf = this.prefs, fc = pf.fc, db = pf.barSize;
    const [b11, t11] = woodArmer(f.M11, f.M22, f.M12);
    const [b22, t22] = woodArmer(f.M22, f.M11, f.M12);
    const out: any = {};
    for (const [dir, top, bot, F] of [[1, t11, b11, f.F11], [2, t22, b22, f.F22]] as [number, number, number, number][]) {
      const layer = dir === 1 ? "A" : "B";
      const inner = layer === pf.innerLayer;
      let P = -F;
      if (P > 0 && P < 0.1 * fc * h) P = 0;
      const thr = 1e-5 * fc * h * h;
      const mt = Math.abs(top) >= thr ? top : 0, mb = Math.abs(bot) >= thr ? bot : 0;
      const dT = h - pf.coverTop - db / 2 - (inner ? db : 0), dB = h - pf.coverBot - db / 2 - (inner ? db : 0);
      const [At, Atp] = mt !== 0 ? this.design1(mt, P, h / 2, dT, h - dT, h, 1) : [0, 0];
      const [Ab, Abp] = mb !== 0 ? this.design1(mb, P, h / 2, dB, h - dB, h, 1) : [0, 0];
      out["top" + dir] = f32(Math.max(At, Abp));
      out["bot" + dir] = f32(Math.max(Ab, Atp));
    }
    const fyPsi = pf.fy / this.u.psi;
    const rhoMin = pf.code === "ACI 318-19" ? 0.0018 : fyPsi < 60000 ? 0.0020 : fyPsi === 60000 ? 0.0018 : 0.0018 * 60000 / fyPsi;
    out.amin = rhoMin * h;
    return out;
  }

  /** diseño de una estación (Before + After), como GetFlexureAndShear de SAFE. */
  designStation(strip: DesignStrip, station: number, pick: (e: StripMeshElem, k: number) => ShellNodeForces = (e, k) => e.forces[k]): StationDesign {
    const before = this.sideDesign(strip, station, -1, pick), after = this.sideDesign(strip, station, 1, pick);
    const g = this.cutLine(strip, station, 1);
    const st: StationDesign = { station, x: g.gx, y: g.gy, before, after, AsTop: 0, AsBot: 0, MTop: 0, MBot: 0, AminTop: 0, AminBot: 0, V: 0, Av_s: 0, width: 0 };
    for (const s of [before, after]) {
      if (s.empty) continue;
      if (f32(s.AsTop) > st.AsTop || (f32(s.AsTop) === st.AsTop && Math.abs(s.MTop) >= Math.abs(st.MTop))) { st.AsTop = f32(s.AsTop); st.MTop = s.MTop; st.AminTop = s.AminTop; }
      if (f32(s.AsBot) > st.AsBot || (f32(s.AsBot) === st.AsBot && Math.abs(s.MBot) >= Math.abs(st.MBot))) { st.AsBot = f32(s.AsBot); st.MBot = s.MBot; st.AminBot = s.AminBot; }
      if (f32(s.Av_s) > st.Av_s || (f32(s.Av_s) === st.Av_s && f32(s.V) >= st.V)) { st.Av_s = f32(s.Av_s); st.V = s.V; }
    }
    // ConcWidth de SAFE: el ancho MENOR de los dos lados (descartando astillas por debajo de la tolerancia)
    const ws = [before, after].filter(s => !s.empty && s.width > 2 * (this.prefs.mergeTol ?? 0.001 / this.prefs.M)).map(s => s.width);
    st.width = ws.length ? Math.min(...ws) : 0;
    return st;
  }
}

/** Con mínimo (AsEnvWithMin de SAFE): ρmin·h a la cara con más acero; empate → abajo. */
export function feConMinimo(top: number, bot: number, amin: number): [number, number] {
  return top > bot ? [Math.max(top, amin), bot] : [top, Math.max(bot, amin)];
}

/** Resumen Start/Middle/End de cada tramo (acero_por_franja de SAFE). spans: [nombre, inicio, fin] en distancia. */
export function summarizeSpans(stations: StationDesign[], spans: { name: string; start: number; end: number }[], tol = 1e-4): SpanZoneResult[] {
  const out: SpanZoneResult[] = [];
  for (const sp of spans) {
    const L = sp.end - sp.start;
    const zones: Record<"Start" | "Middle" | "End", [StationDesign, SideDesign][]> = { Start: [], Middle: [], End: [] };
    for (const st of stations) {
      const s = st.station;
      if (s < sp.start - tol || s > sp.end + tol) continue;
      if (Math.abs(s - sp.start) <= tol) { zones.Start.push([st, st.before]); continue; }
      if (Math.abs(s - sp.end) <= tol) { zones.End.push([st, st.before]); continue; }
      for (const [rel, sd] of [[(s - sp.start) / L - 1e-6, st.before], [(s - sp.start) / L + 1e-6, st.after]] as [number, SideDesign][]) {
        const z = rel <= 0.25 ? "Start" : rel >= 0.75 ? "End" : "Middle";
        zones[z].push([st, sd]);
      }
    }
    for (const loc of ["Start", "Middle", "End"] as const) {
      const T = { MTop: 0, AsTop: 0, MBot: 0, AsBot: 0, V: 0, Av_s: 0, widthTop: 0, widthBot: 0 }; let first = true;
      for (const [st, sd] of zones[loc]) {
        // flexión: estación fusionada (Before, y After solo si As mayor)
        let aT = 0, mT = 0, aB = 0, mB = 0, init = false;
        for (const q of [st.before, st.after]) {
          if (q.empty) continue;
          if (!init || f32(q.AsTop) > aT) { aT = f32(q.AsTop); mT = q.MTop; }
          if (!init || f32(q.AsBot) > aB) { aB = f32(q.AsBot); mB = q.MBot; }
          init = true;
        }
        if (first || aT > T.AsTop) { T.AsTop = aT; T.MTop = mT; T.widthTop = st.width; }
        if (first || aB > T.AsBot) { T.AsBot = aB; T.MBot = mB; T.widthBot = st.width; }
        if (first || f32(sd.Av_s) > T.Av_s) { T.Av_s = f32(sd.Av_s); T.V = sd.V; }
        first = false;
      }
      out.push({ span: sp.name, location: loc, MTop: -Math.abs(T.MTop), AsTop: T.AsTop, MBot: Math.abs(T.MBot), AsBot: T.AsBot, V: T.V, Av_s: T.Av_s, widthTop: T.widthTop, widthBot: T.widthBot });
    }
  }
  return out;
}

/** Estaciones por defecto (sin objetos de SAFE): extremos + cruces del eje con bordes de elementos + subdivisión maxima. */
export function defaultStations(strip: DesignStrip, elems: StripMeshElem[], maxSpacing = 0): number[] {
  const [ax, ay] = strip.start, [bx, by] = strip.end, L = Math.hypot(bx - ax, by - ay);
  const set = [0, L];
  for (const e of elems) {
    if (!e.design) continue;
    const n = e.xy.length;
    for (let k = 0; k < n; k++) {
      const a = e.xy[k], b = e.xy[(k + 1) % n];
      const r = lineInt(ax, ay, bx, by, a[0], a[1], b[0], b[1]);
      if (r && r[0] > 0 && r[0] < 1 && r[1] >= 0 && r[1] <= 1) set.push(r[0] * L);
    }
  }
  set.sort((a, b) => a - b);
  const st: number[] = [];
  for (const s of set) if (!st.length || s > st[st.length - 1] + 1e-6) st.push(s);
  if (maxSpacing > 0) {
    const out: number[] = [st[0]];
    for (let i = 1; i < st.length; i++) {
      const gap = st[i] - st[i - 1], n = Math.ceil(gap / maxSpacing - 1e-9);
      for (let j = 1; j < n; j++) out.push(st[i - 1] + j * gap / n);
      out.push(st[i]);
    }
    return out;
  }
  return st;
}

/** Franjas automáticas sobre ejes de columnas: franja de columna (ancho = mitad del menor vano/2 a cada lado ⇒ l/4)
 *  y franja central entre dos ejes (el resto). ACI 8.4.1.5: franja de columna = 0.25·min(l1,l2) a cada lado. */
export function autoStripsFromGrid(xs: number[], ys: number[], x0: number, x1: number, y0: number, y1: number): DesignStrip[] {
  const out: DesignStrip[] = [];
  const mk = (name: string, layer: "A" | "B", s: [number, number], e: [number, number], wl: number, wr: number) =>
    out.push({ name, layer, start: s, end: e, wStartLeft: wl, wStartRight: wr, wEndLeft: wl, wEndRight: wr });
  const minSpan = (arr: number[], i: number) => {
    const l = i > 0 ? arr[i] - arr[i - 1] : Infinity, r = i < arr.length - 1 ? arr[i + 1] - arr[i] : Infinity;
    return Math.min(l, r);
  };
  // capa A: franjas en X (ejes y = cte)
  const lxMin = Math.min(...xs.slice(1).map((x, i) => x - xs[i]));
  ys.forEach((y, i) => {
    const c = 0.25 * Math.min(minSpan(ys, i), lxMin);
    const wl = i < ys.length - 1 ? c : Math.min(c, y1 - y), wr = i > 0 ? c : Math.min(c, y - y0);
    mk(`CSA${i + 1}`, "A", [x0, y], [x1, y], wl, wr);
    if (i < ys.length - 1) {
      const cn = 0.25 * Math.min(minSpan(ys, i + 1), lxMin);
      const half = (ys[i + 1] - y - c - cn) / 2;
      if (half > 1e-6) mk(`MSA${i + 1}`, "A", [x0, y + c + half], [x1, y + c + half], half, half);
    }
  });
  const lyMin = Math.min(...ys.slice(1).map((y, i) => y - ys[i]));
  xs.forEach((x, i) => {
    const c = 0.25 * Math.min(minSpan(xs, i), lyMin);
    const wl = i > 0 ? c : Math.min(c, x - x0), wr = i < xs.length - 1 ? c : Math.min(c, x1 - x);
    mk(`CSB${i + 1}`, "B", [x, y0], [x, y1], wl, wr);
    if (i < xs.length - 1) {
      const cn = 0.25 * Math.min(minSpan(xs, i + 1), lyMin);
      const half = (xs[i + 1] - x - c - cn) / 2;
      if (half > 1e-6) mk(`MSB${i + 1}`, "B", [x + c + half, y0], [x + c + half, y1], half, half);
    }
  });
  return out;
}

// ─────────────────────────────── armado ───────────────────────────────

/** Serie de varillas corrugadas en mm (INEN 2167 / NEC, Ecuador). Área real π·d²/4. */
export const BARRAS_INEN_MM = [8, 10, 12, 14, 16, 18, 20, 22, 25, 28, 32];
export const areaBarra = (dmm: number) => Math.PI * (dmm / 1000) ** 2 / 4;   // m²

export interface Armado { asReq: number; asTip: number; asAdd: number; n: number; s: number; texto: string; }
/**
 * Armado de una franja con el criterio de SAFE (Display → Strip Design, «Show Number of Bars of Size»,
 * SAFE.exe ᮊ/ᮑ): adicional = max(As − (Ab_típ/s_típ)·ancho, 0) y n = ⌈adicional / Ab⌉.
 * SAFE NO da separación en franjas: la «@ s» es convención de Hekatan, s = ancho/n redondeado hacia
 * abajo a múltiplos de `paso` (2.5 cm). Unidades: m y m².
 */
export function armado(As: number, ancho: number, dmm: number, tipico?: { dmm: number; s: number } | null, paso = 0.025): Armado {
  const asTip = tipico && tipico.s > 0 ? areaBarra(tipico.dmm) / tipico.s * ancho : 0;
  const asAdd = Math.max(As - asTip, 0);
  const Ab = areaBarra(dmm);
  const n = asAdd > 0 ? Math.ceil(asAdd / Ab - 1e-9) : 0;
  let s = n > 0 ? Math.floor((ancho / n) / paso + 1e-9) * paso : 0;
  if (n > 0 && s <= 0) s = paso;
  const cm = (x: number) => (Math.round(x * 1000) / 10).toString().replace(/\.0$/, "");
  const texto = n > 0 ? `${n} Ø ${dmm} mm @ ${cm(s)} cm` : "—";
  return { asReq: As, asTip, asAdd, n, s, texto };
}

/** Franjas del modelo de SAFE (.$sf / .f2k): tablas STRIP OBJECT CONNECTIVITY + POINT OBJECT CONNECTIVITY. */
export function franjasDeSafe(texto: string): DesignStrip[] {
  const unid = /CurrUnits="[^,]*,\s*([a-z]+)/i.exec(texto)?.[1] ?? "m";
  const f = ({ mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 } as Record<string, number>)[unid.toLowerCase()] ?? 1;
  const campo = (l: string, k: string) => {
    const m = new RegExp(`(?:^|[ \\t])(?:"${k}"|${k})=("[^"]*"|[^ \\t]+)`).exec(l);
    return m ? m[1].replace(/"/g, "") : undefined;
  };
  const tabla = (nombre: string) => {
    const i = texto.indexOf(`TABLE:  "${nombre}"`);
    if (i < 0) return [] as string[];
    const resto = texto.slice(i).split(/\r?\n/).slice(1);
    const out: string[] = [];
    for (const l of resto) { if (/^TABLE:/.test(l) || !l.trim()) break; out.push(l); }
    return out;
  };
  const P = new Map<string, [number, number]>();
  for (const l of tabla("POINT OBJECT CONNECTIVITY")) {
    const n = campo(l, "UniqueName") ?? campo(l, "Name"), x = campo(l, "X"), y = campo(l, "Y");
    if (n && x !== undefined && y !== undefined) P.set(n, [parseFloat(x) * f, parseFloat(y) * f]);
  }
  const S: DesignStrip[] = [];
  for (const l of tabla("STRIP OBJECT CONNECTIVITY")) {
    const a = P.get(campo(l, "Strip Start Point") ?? ""), b = P.get(campo(l, "Segment End Point") ?? "");
    if (!a || !b) continue;
    const g = (k: string) => parseFloat(campo(l, k) ?? "0") * f;
    S.push({ name: campo(l, "Name") ?? `S${S.length + 1}`, layer: (campo(l, "Layer") === "B" ? "B" : "A"), start: a, end: b,
             wStartLeft: g("Start Width Left"), wStartRight: g("Start Width Right"), wEndLeft: g("End Width Left"), wEndRight: g("End Width Right") });
  }
  return S;
}
