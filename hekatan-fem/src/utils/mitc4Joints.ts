/**
 * Momentos del Shell-Thick (MITC4 + modos incompatibles de Wilson, `getBendingK`
 * en shellQ4.cpp) en los 4 JOINTS de un Q4: recuperacion clasica de esfuerzos.
 *
 * La curvatura sale de los giros nodales con las bilineales (Bathe, *Finite
 * Element Procedures*: kx = θy,x, ky = −θx,y, kxy = θy,y − θx,x),
 * se evalua en los 4 puntos de Gauss 2×2 —los puntos optimos de esfuerzo del
 * Q4 (Barlow 1976)— y se extrapola bilinealmente a las esquinas, igual que
 * `dkqJointMoments(..., "gauss")`. Los modos incompatibles son internos y no se
 * recuperan: su aporte a la curvatura media es nulo (Taylor, Beresford & Wilson 1976).
 *
 * Ejes: xl, yl locales del elemento; u12 = [w, θx, θy]×4 en ejes locales.
 * Devuelve, por esquina (orden de los nudos), [Mx, My, Mxy] con el signo de la
 * curvatura del solver (el que llama pone el signo de CSI).
 */
export function mitc4JointMoments(
  xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number
): number[][] {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const Men = (xi: number, et: number) => {
    const dNxi = [-0.25 * (1 - et), 0.25 * (1 - et), 0.25 * (1 + et), -0.25 * (1 + et)];
    const dNet = [-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi)];
    let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (let i = 0; i < 4; i++) {
      J00 += dNxi[i] * xl[i]; J01 += dNxi[i] * yl[i];
      J10 += dNet[i] * xl[i]; J11 += dNet[i] * yl[i];
    }
    const det = J00 * J11 - J01 * J10;
    const i00 = J11 / det, i01 = -J01 / det, i10 = -J10 / det, i11 = J00 / det;
    let kx = 0, ky = 0, kxy = 0;
    for (let i = 0; i < 4; i++) {
      const dx = i00 * dNxi[i] + i01 * dNet[i], dy = i10 * dNxi[i] + i11 * dNet[i];
      const thx = u12[3 * i + 1], thy = u12[3 * i + 2];
      kx += dx * thy; ky += -dy * thx; kxy += dy * thy - dx * thx;
    }
    const k = [kx, ky, kxy];
    return [0, 1, 2].map((r) => Db[r][0] * k[0] + Db[r][1] * k[1] + Db[r][2] * k[2]);
  };
  const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const g = 1 / Math.sqrt(3);
  const Mg = esq.map(([r, s]) => Men(r * g, s * g));
  return esq.map(([r, s]) => {
    const R = r * Math.sqrt(3), S = s * Math.sqrt(3);
    const Nn = esq.map(([a, b]) => ((1 + a * R) * (1 + b * S)) / 4);
    return [0, 1, 2].map((i) => Nn.reduce((acc, q, k) => acc + q * Mg[k][i], 0));
  });
}
