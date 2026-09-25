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
