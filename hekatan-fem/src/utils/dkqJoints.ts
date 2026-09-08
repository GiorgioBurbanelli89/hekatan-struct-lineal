/**
 * Momentos del DKQ (Batoz & Tahar 1982, el Shell-Thin de CSI) en los 4 JOINTS.
 *
 * Espejo de `plateDKQ.h` (getBendingK_DKQ_D): la misma B(ξ,η) de 3×12 con las
 * funciones Hx, Hy y el jacobiano real, evaluada en las esquinas del elemento
 * (ξ,η = ±1) en vez de en los puntos de Gauss. GDL por nudo [w, θx, θy] en
 * ejes locales, como el resto del motor. Devuelve [Mx, My, Mxy] por esquina
 * con el signo de la curvatura de Batoz (el que llama pone el signo de CSI).
 */
function serendip8(xi: number, et: number) {
  const N = new Array<number>(8).fill(0), dNxi = new Array<number>(8).fill(0), dNet = new Array<number>(8).fill(0);
  const xn = [-1, 1, 1, -1], yn = [-1, -1, 1, 1];
  for (let i = 0; i < 4; i++) {
    const xx = xn[i] * xi, yy = yn[i] * et;
    N[i] = 0.25 * (1 + xx) * (1 + yy) * (xx + yy - 1);
    dNxi[i] = 0.25 * xn[i] * (1 + yy) * (2 * xx + yy);
    dNet[i] = 0.25 * yn[i] * (1 + xx) * (xx + 2 * yy);
  }
  N[4] = 0.5 * (1 - xi * xi) * (1 - et); dNxi[4] = -xi * (1 - et); dNet[4] = -0.5 * (1 - xi * xi);
  N[5] = 0.5 * (1 + xi) * (1 - et * et); dNxi[5] = 0.5 * (1 - et * et); dNet[5] = -et * (1 + xi);
  N[6] = 0.5 * (1 - xi * xi) * (1 + et); dNxi[6] = -xi * (1 + et); dNet[6] = 0.5 * (1 - xi * xi);
  N[7] = 0.5 * (1 - xi) * (1 - et * et); dNxi[7] = -0.5 * (1 - et * et); dNet[7] = -et * (1 - xi);
  return { N, dNxi, dNet };
}

/** B(ξ,η) del DKQ, 3×12, en cartesianas locales. */
export function dkqB(xl: number[], yl: number[], xi: number, et: number): number[][] {
  const ak: number[] = [], bk: number[] = [], ck: number[] = [], dk: number[] = [], ek: number[] = [];
  for (let k = 0; k < 4; k++) {
    const i = k, j = (k + 1) % 4;
    const xij = xl[i] - xl[j], yij = yl[i] - yl[j], l2 = xij * xij + yij * yij;
    ak.push(-xij / l2); bk.push((0.75 * xij * yij) / l2); ck.push((0.25 * xij * xij - 0.5 * yij * yij) / l2);
    dk.push(-yij / l2); ek.push((0.25 * yij * yij - 0.5 * xij * xij) / l2);
  }
  const { dNxi, dNet } = serendip8(xi, et);
  const dNx4 = [-(1 - et) / 4, (1 - et) / 4, (1 + et) / 4, -(1 + et) / 4];
  const dNy4 = [-(1 - xi) / 4, -(1 + xi) / 4, (1 + xi) / 4, (1 - xi) / 4];
  let J11 = 0, J12 = 0, J21 = 0, J22 = 0;
  for (let i = 0; i < 4; i++) { J11 += dNx4[i] * xl[i]; J12 += dNx4[i] * yl[i]; J21 += dNy4[i] * xl[i]; J22 += dNy4[i] * yl[i]; }
  const dJ = J11 * J22 - J12 * J21;
  const i11 = J22 / dJ, i12 = -J12 / dJ, i21 = -J21 / dJ, i22 = J11 / dJ;
  const Hx_x = new Array<number>(12).fill(0), Hx_e = new Array<number>(12).fill(0);
  const Hy_x = new Array<number>(12).fill(0), Hy_e = new Array<number>(12).fill(0);
  for (let i = 0; i < 4; i++) {
    const kp = (i + 3) % 4, kn = i, m_p = 4 + kp, m_n = 4 + kn;
    const c0x = 1.5 * (ak[kn] * dNxi[m_n] - ak[kp] * dNxi[m_p]), c0e = 1.5 * (ak[kn] * dNet[m_n] - ak[kp] * dNet[m_p]);
    const c1x = bk[kn] * dNxi[m_n] + bk[kp] * dNxi[m_p], c1e = bk[kn] * dNet[m_n] + bk[kp] * dNet[m_p];
    const c2x = dNxi[i] - ck[kn] * dNxi[m_n] - ck[kp] * dNxi[m_p], c2e = dNet[i] - ck[kn] * dNet[m_n] - ck[kp] * dNet[m_p];
    Hx_x[3 * i] = c0x; Hx_e[3 * i] = c0e; Hx_x[3 * i + 1] = c1x; Hx_e[3 * i + 1] = c1e; Hx_x[3 * i + 2] = c2x; Hx_e[3 * i + 2] = c2e;
    const d0x = 1.5 * (dk[kn] * dNxi[m_n] - dk[kp] * dNxi[m_p]), d0e = 1.5 * (dk[kn] * dNet[m_n] - dk[kp] * dNet[m_p]);
    const d1x = -dNxi[i] + ek[kn] * dNxi[m_n] + ek[kp] * dNxi[m_p], d1e = -dNet[i] + ek[kn] * dNet[m_n] + ek[kp] * dNet[m_p];
    Hy_x[3 * i] = d0x; Hy_e[3 * i] = d0e; Hy_x[3 * i + 1] = d1x; Hy_e[3 * i + 1] = d1e; Hy_x[3 * i + 2] = -c1x; Hy_e[3 * i + 2] = -c1e;
  }
  const B = [new Array<number>(12).fill(0), new Array<number>(12).fill(0), new Array<number>(12).fill(0)];
  for (let c = 0; c < 12; c++) {
    const HxX = i11 * Hx_x[c] + i12 * Hx_e[c], HxY = i21 * Hx_x[c] + i22 * Hx_e[c];
    const HyX = i11 * Hy_x[c] + i12 * Hy_e[c], HyY = i21 * Hy_x[c] + i22 * Hy_e[c];
    B[0][c] = HxX; B[1][c] = HyY; B[2][c] = HxY + HyX;
  }
  return B;
}

export function dkqJointMoments(
  xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number,
  modo: "esquinas" | "gauss" = "esquinas"
): number[][] {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  const Men = (xi: number, et: number) => {
    const B = dkqB(xl, yl, xi, et);
    const k = [0, 1, 2].map((i) => B[i].reduce((acc, q, c) => acc + q * u12[c], 0));
    return [0, 1, 2].map((i) => Db[i][0] * k[0] + Db[i][1] * k[1] + Db[i][2] * k[2]);
  };
  const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (modo === "esquinas") return esq.map(([r, s]) => Men(r, s));
  const g = 1 / Math.sqrt(3);
  const Mg = esq.map(([r, s]) => Men(r * g, s * g));
  return esq.map(([r, s]) => {
    const R = r * Math.sqrt(3), S = s * Math.sqrt(3);
    const Nn = esq.map(([a, b]) => ((1 + a * R) * (1 + b * S)) / 4);
    return [0, 1, 2].map((i) => Nn.reduce((acc, q, k) => acc + q * Mg[k][i], 0));
  });
}
