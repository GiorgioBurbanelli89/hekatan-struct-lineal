/**
 * Momentos del DKT (Batoz, Bathe & Ho 1980, el Shell-Thin de CSI en TRIANGULOS) en los 3 JOINTS.
 *
 * Espejo de `plateDKT.h` (dktB): la misma B(ξ,η) de 3×9, evaluada en los nudos
 * (ξ,η) = (0,0), (1,0), (0,1). GDL por nudo [w, θx, θy] en ejes locales (mano derecha).
 * Devuelve [Mx, My, Mxy] por esquina con el signo de la curvatura de Batoz (el que llama pone el signo
 * de CSI). Medido contra SAP2000 24 y ETABS 22 (Plate-Thin / Shell-Thin, un triangulo escaleno): 1e-8 %.
 */
export function dktB(x: number[], y: number[], xi: number, eta: number): number[][] {
  const x12 = x[0] - x[1], x23 = x[1] - x[2], x31 = x[2] - x[0];
  const y12 = y[0] - y[1], y23 = y[1] - y[2], y31 = y[2] - y[0];
  // lados 4 = 2-3, 5 = 3-1, 6 = 1-2
  const xs = [x23, x31, x12], ys = [y23, y31, y12];
  const P: number[] = [], t: number[] = [], q: number[] = [], r: number[] = [];
  for (let k = 0; k < 3; k++) {
    const l2 = xs[k] * xs[k] + ys[k] * ys[k];
    P.push(-6 * xs[k] / l2); t.push(-6 * ys[k] / l2);
    q.push(3 * xs[k] * ys[k] / l2); r.push(3 * ys[k] * ys[k] / l2);
  }
  const [P4, P5, P6] = P, [t4, t5, t6] = t, [q4, q5, q6] = q, [r4, r5, r6] = r;
  const a = 1 - 2 * xi, b = 1 - 2 * eta;
  const Hx_x = [P6 * a + (P5 - P6) * eta, q6 * a - (q5 + q6) * eta, -4 + 6 * (xi + eta) + r6 * a - eta * (r5 + r6),
                -P6 * a + eta * (P4 + P6), q6 * a - eta * (q6 - q4), -2 + 6 * xi + r6 * a + eta * (r4 - r6),
                -eta * (P5 + P4), eta * (q4 - q5), -eta * (r5 - r4)];
  const Hy_x = [t6 * a + eta * (t5 - t6), 1 + r6 * a - eta * (r5 + r6), -q6 * a + eta * (q5 + q6),
                -t6 * a + eta * (t4 + t6), -1 + r6 * a + eta * (r4 - r6), -q6 * a - eta * (q4 - q6),
                -eta * (t4 + t5), eta * (r4 - r5), -eta * (q4 - q5)];
  const Hx_e = [-P5 * b - xi * (P6 - P5), q5 * b - xi * (q5 + q6), -4 + 6 * (xi + eta) + r5 * b - xi * (r5 + r6),
                xi * (P4 + P6), xi * (q4 - q6), -xi * (r6 - r4),
                P5 * b - xi * (P4 + P5), q5 * b + xi * (q4 - q5), -2 + 6 * eta + r5 * b + xi * (r4 - r5)];
  const Hy_e = [-t5 * b - xi * (t6 - t5), 1 + r5 * b - xi * (r5 + r6), -q5 * b + xi * (q5 + q6),
                xi * (t4 + t6), xi * (r4 - r6), -xi * (q4 - q6),
                t5 * b - xi * (t4 + t5), -1 + r5 * b + xi * (r4 - r5), -q5 * b - xi * (q4 - q5)];
  const A2 = x31 * y12 - x12 * y31;
  const B = [new Array<number>(9), new Array<number>(9), new Array<number>(9)];
  for (let j = 0; j < 9; j++) {
    B[0][j] = (y31 * Hx_x[j] + y12 * Hx_e[j]) / A2;
    B[1][j] = (-x31 * Hy_x[j] - x12 * Hy_e[j]) / A2;
    B[2][j] = (-x31 * Hx_x[j] - x12 * Hx_e[j] + y31 * Hy_x[j] + y12 * Hy_e[j]) / A2;
  }
  return B;
}

export function dktJointMoments(
  xl: number[], yl: number[], u9: number[], E: number, nu: number, t: number
): number[][] {
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  return [[0, 0], [1, 0], [0, 1]].map(([xi, eta]) => {
    const B = dktB(xl, yl, xi, eta);
    const k = [0, 1, 2].map((i) => B[i].reduce((acc, q, c) => acc + q * u9[c], 0));
    return [0, 1, 2].map((i) => Db[i][0] * k[0] + Db[i][1] * k[1] + Db[i][2] * k[2]);
  });
}
