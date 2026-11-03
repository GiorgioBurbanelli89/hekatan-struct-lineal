/**
 * Carga repartida LINEAL A TROZOS sobre una barra -> vector nodal CONSISTENTE (12, globales).
 *
 * La usan los lectores de CSI (e2kParser: LINELOAD UNIFF/TRAPF y peso propio; s2kParser:
 * FRAME LOADS - DISTRIBUTED con RelDist y peso propio) para que una carga parcial o trapecial
 * entre al solver igual que en mesa_modelo.py (`_hermite_loads`) y en CSI:
 *
 *   q(s) = q0 + (q1 - q0)(s - s0)/(s1 - s0)  en  [s0, s1] (s desde el nudo i, longitud real)
 *   w(s) = q(s) * dir   (dir = vector unitario GLOBAL; GRAV = [0, 0, -1])
 *
 *   componente transversal  -> Hermite:  F_i = ∫q N1 ds, M_i = ∫q N2 ds (t × dir),
 *                                         F_j = ∫q N3 ds, M_j = ∫q N4 ds (t × dir)
 *   componente axial        -> lineal:   F_i = ∫q (1-x) ds, F_j = ∫q x ds
 *
 * Para la uniforme de extremo a extremo da exactamente w·L/2 y ±(L²/12)(t×w): lo mismo que
 * ya escribian el cliModeler y los parsers para UNIFF. Integracion: Gauss de 3 puntos por
 * trozo (q lineal × cubica = grado 4: exacta).
 *
 * El vector de EMPOTRAMIENTO PERFECTO es el opuesto (fe = -eq): `analyze()` lo suma a k·u
 * (campo `elementInputs.frameFixedEnd`) para dar los esfuerzos de barra de verdad.
 */
const GP = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)];
const GW = [5 / 9, 8 / 9, 5 / 9];

export function cargaBarraConsistente(
  a: number[], b: number[], s0: number, s1: number, q0: number, q1: number, dir: number[],
): number[] {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  const out = new Array(12).fill(0);
  if (!(L > 1e-12) || !(s1 - s0 > 1e-12)) return out;
  const t = [d[0] / L, d[1] / L, d[2] / L];
  const da = t[0] * dir[0] + t[1] * dir[1] + t[2] * dir[2];             // componente axial
  const dp = [dir[0] - da * t[0], dir[1] - da * t[1], dir[2] - da * t[2]]; // transversal
  const txd = [t[1] * dir[2] - t[2] * dir[1], t[2] * dir[0] - t[0] * dir[2], t[0] * dir[1] - t[1] * dir[0]];
  let n1 = 0, n2 = 0, n3 = 0, n4 = 0, l1 = 0, l2 = 0;
  const h = (s1 - s0) / 2, c = (s1 + s0) / 2;
  for (let k = 0; k < 3; k++) {
    const s = c + h * GP[k], w = h * GW[k];
    const q = q0 + (q1 - q0) * (s - s0) / (s1 - s0);
    const x = s / L;
    n1 += w * q * (1 - 3 * x * x + 2 * x ** 3);
    n2 += w * q * L * x * (1 - x) ** 2;
    n3 += w * q * (3 * x * x - 2 * x ** 3);
    n4 += w * q * L * x * x * (x - 1);
    l1 += w * q * (1 - x);
    l2 += w * q * x;
  }
  for (let k = 0; k < 3; k++) {
    out[k] = n1 * dp[k] + l1 * da * t[k];
    out[3 + k] = n2 * txd[k];
    out[6 + k] = n3 * dp[k] + l2 * da * t[k];
    out[9 + k] = n4 * txd[k];
  }
  return out;
}

/** Suma `eq` (12) a las cargas nodales y su opuesto al empotramiento de la barra `elem`. */
export function acumularCargaBarra(
  loads: Map<number, number[]>, frameFixedEnd: Map<number, number[]>,
  elem: number, ni: number, nj: number, eq: number[],
) {
  const suma = (n: number, off: number) => {
    const p = loads.get(n) ?? [0, 0, 0, 0, 0, 0];
    for (let k = 0; k < 6; k++) p[k] += eq[off + k];
    loads.set(n, p);
  };
  suma(ni, 0); suma(nj, 6);
  const fe = frameFixedEnd.get(elem) ?? new Array(12).fill(0);
  for (let k = 0; k < 12; k++) fe[k] -= eq[k];
  frameFixedEnd.set(elem, fe);
}

/**
 * Condensa el vector de empotramiento `eq` (12, globales) por los GIROS liberados de la barra (M2/M3 en I y J).
 *
 * POR QUÉ. El peso propio y las cargas de vano se hornean en los nudos como vector CONSISTENTE de barra EMPOTRADA
 * (F = wL/2, M = ±wL²/12). Si la barra está articulada (correas, tubos de arriostre con `RELEASE "… M2I M2J M3I M3J"`)
 * ese momento de empotramiento NO existe: la barra no lo transmite al nudo. Dejarlo ponía un par espurio en cada
 * nudo de la correa. Medido en un galpón recortado del «mercado» (ETABS 22, Dead, sin cubierta ni punto de inserción):
 * con los momentos puestos a cero Uz pasaba de 11 % a 5 %, Ux de 42 % a 6 % (del máximo, 0.27 mm).
 *
 * Es la condensación estática de siempre, por plano de flexión (EI se cancela, vale cualquier EI):
 *   f' = f − K[:,R]·K[R,R]⁻¹·f[R]        (R = giros liberados; f'[R] = 0)
 * con la K de viga Euler–Bernoulli 4×4 de cada plano: 1-2 (v2, θ3) y 1-3 (v3, θ2, con θ2 = −dw/dx).
 * Ejes locales de CSI: e1 = i→j; e2 en el plano vertical hacia arriba (barra vertical: +X); e3 = e1×e2; `angDeg` gira e2/e3 sobre e1.
 * `rel` lleva 12 banderas [P V2 V3 T M2 M3] de I y de J.
 */
export function condensarCargaPorLiberaciones(eq: number[], a: number[], b: number[], rel: boolean[] | undefined, angDeg = 0): number[] {
  if (!rel || !(rel[4] || rel[5] || rel[10] || rel[11])) return eq;
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  if (!(L > 1e-12)) return eq;
  const e1 = d.map((v) => v / L);
  let e2: number[];
  const hz = [e1[0], e1[1], 0], nh = Math.hypot(hz[0], hz[1]);
  if (nh < 1e-9) e2 = [1, 0, 0];
  else { const k = e1[2]; const u = [-e1[0] * k, -e1[1] * k, 1 - e1[2] * e1[2]]; const nu = Math.hypot(u[0], u[1], u[2]); e2 = u.map((v) => v / nu); }
  let e3 = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  if (angDeg) {
    const c = Math.cos(angDeg * Math.PI / 180), s = Math.sin(angDeg * Math.PI / 180);
    const n2 = e2.map((v, k) => c * v + s * e3[k]), n3 = e3.map((v, k) => -s * e2[k] + c * v);
    e2 = n2; e3 = n3;
  }
  const loc = (v: number[], o: number) => [0, 1, 2].map((r) => [e1, e2, e3][r][0] * v[o] + [e1, e2, e3][r][1] * v[o + 1] + [e1, e2, e3][r][2] * v[o + 2]);
  const FI = loc(eq, 0), MI = loc(eq, 3), FJ = loc(eq, 6), MJ = loc(eq, 9);
  const L2 = L * L, L3 = L2 * L;
  // plano 1-2: [v2_i, θ3_i, v2_j, θ3_j]; plano 1-3: [v3_i, θ2_i, v3_j, θ2_j] (θ2 = −dw/dx → signo cruzado en los términos v·θ)
  const kBase = (sg: number) => [
    [12 / L3, sg * 6 / L2, -12 / L3, sg * 6 / L2],
    [sg * 6 / L2, 4 / L, -sg * 6 / L2, 2 / L],
    [-12 / L3, -sg * 6 / L2, 12 / L3, -sg * 6 / L2],
    [sg * 6 / L2, 2 / L, -sg * 6 / L2, 4 / L],
  ];
  const cond = (f: number[], K: number[][], R: number[]): number[] => {
    if (!R.length) return f;
    const n = R.length;
    const Krr = R.map((i) => R.map((j) => K[i][j])), fr = R.map((i) => f[i]);
    // resolver Krr·x = fr (n = 1 o 2 o 3 o 4 pero pequeño): eliminación gaussiana
    const M = Krr.map((row, i) => [...row, fr[i]]);
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) { const q = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= q * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    const out = f.slice();
    for (let i = 0; i < 4; i++) { let s = 0; R.forEach((j, q) => { s += K[i][j] * x[q]; }); out[i] -= s; }
    R.forEach((j) => { out[j] = 0; });
    return out;
  };
  // plano 1-2
  const R12 = [rel[5] ? 1 : -1, rel[11] ? 3 : -1].filter((v) => v >= 0);
  const f12 = cond([FI[1], MI[2], FJ[1], MJ[2]], kBase(1), R12);
  // plano 1-3
  const R13 = [rel[4] ? 1 : -1, rel[10] ? 3 : -1].filter((v) => v >= 0);
  const f13 = cond([FI[2], MI[1], FJ[2], MJ[1]], kBase(-1), R13);
  const FIn = [FI[0], f12[0], f13[0]], MIn = [MI[0], f13[1], f12[1]];
  const FJn = [FJ[0], f12[2], f13[2]], MJn = [MJ[0], f13[3], f12[3]];
  const glob = (v: number[]) => [0, 1, 2].map((k) => v[0] * e1[k] + v[1] * e2[k] + v[2] * e3[k]);
  return [...glob(FIn), ...glob(MIn), ...glob(FJn), ...glob(MJn)];
}
