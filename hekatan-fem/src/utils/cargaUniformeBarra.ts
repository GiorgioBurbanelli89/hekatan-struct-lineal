/**
 * Carga UNIFORME de vano -> fuerzas nodales equivalentes (12, ejes GLOBALES), con los brazos
 * rigidos de CSI (`endOffsets` = [offI, offJ, rz]).
 *
 *   sin brazos (o rz = 0):   F = w·L/2          M = ±(L²/12)·(t × w)
 *   con brazos (rz > 0):     lI = rz·offI, lJ = rz·offJ, Lf = L − lI − lJ
 *       parte flexible   ->  w·Lf/2 y ±(Lf²/12)·(t × w) en sus CARAS
 *       llevar al nudo   ->  el cortante de la cara por su brazo: lI·Lf/2
 *       carga del brazo  ->  va directa al nudo: w·lI, con momento w·lI²/2
 *
 *       F_I = w·(Lf/2 + lI)      M_I = +(Lf²/12 + lI·Lf/2 + lI²/2)·(t × w)
 *       F_J = w·(Lf/2 + lJ)      M_J = −(Lf²/12 + lJ·Lf/2 + lJ²/2)·(t × w)
 *
 * Medido contra ETABS 22.6 en un portico (tests/casos/brazos_portico_csi.mjs, patron W): con la
 * formula sin brazos el giro del nudo se iba 3.2 % (rz = 0.5) y 6.1 % (rz = 1).
 *
 * Lo usan `cliModeler` (para cargar la estructura) y `analyze` (para recuperar el esfuerzo de la
 * barra, con el signo contrario): un solo sitio, para que no puedan discrepar.
 */
export function cargaUniformeBarra(
  a: number[], b: number[], w: number[], endOffset?: number[] | null
): number[] | null {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]);
  if (L < 1e-9) return null;
  const t = [d[0] / L, d[1] / L, d[2] / L];
  const rz = endOffset && endOffset[2] > 0 ? endOffset[2] : 0;
  const lI = rz * (endOffset?.[0] ?? 0), lJ = rz * (endOffset?.[1] ?? 0);
  const Lf = L - lI - lJ;
  if (Lf <= 1e-9) return null;
  const fI = Lf / 2 + lI, fJ = Lf / 2 + lJ;
  const cI = (Lf * Lf) / 12 + (lI * Lf) / 2 + (lI * lI) / 2;
  const cJ = (Lf * Lf) / 12 + (lJ * Lf) / 2 + (lJ * lJ) / 2;
  const txw = [t[1] * w[2] - t[2] * w[1],
               t[2] * w[0] - t[0] * w[2],
               t[0] * w[1] - t[1] * w[0]];
  return [
    w[0] * fI, w[1] * fI, w[2] * fI,  cI * txw[0],  cI * txw[1],  cI * txw[2],
    w[0] * fJ, w[1] * fJ, w[2] * fJ, -cJ * txw[0], -cJ * txw[1], -cJ * txw[2],
  ];
}
