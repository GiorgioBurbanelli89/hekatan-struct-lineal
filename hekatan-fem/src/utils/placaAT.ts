/**
 * Placa cuadrilátera de Auricchio & Taylor (1994) — «A shear deformable plate element with an exact thin
 * limit», CMAME 118, 393-412, doi:10.1016/0045-7825(94)90009-4 — transcrita de FEAPpv (código abierto de
 * R. L. Taylor, Regents of the University of California): `elements/shells/plate2d.f`, subrutinas plate2q,
 * shpspq, geompq, bmatpq y strepq. Espejo de `getBendingK_AT` (shellQ4.cpp) y de
 * `validation/placa-navier/banco/placa_auricchio_taylor.py`.
 *
 * GDL por nudo [w, θx, θy] (giros de mano derecha en ejes del elemento). w LIGADO a los giros por las
 * funciones de lado M_i; 4 burbujas en los giros; cortante MIXTO de 4 parámetros; Gauss 3×3; se condensan
 * primero las burbujas y luego el cortante. La carga de área es la consistente con el w ligado: lleva
 * también momentos en los nudos (sin ellos la placa sale un 2-3 % más flexible, medido 29-sep-2026).
 */
const g3 = Math.sqrt(0.6);
const P3: Array<[number, number]> = [[-g3, 5 / 9], [0, 8 / 9], [g3, 5 / 9]];

function geom(x: number[], y: number[]) {
  const co = [0, 0, 0, 0], si = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; co[i] = -y[i] + y[j]; si[i] = x[i] - x[j]; }
  const j0 = [[0.25 * (-x[0] + x[1] + x[2] - x[3]), 0.25 * (-y[0] + y[1] + y[2] - y[3])],
              [0.25 * (-x[0] - x[1] + x[2] + x[3]), 0.25 * (-y[0] - y[1] + y[2] + y[3])]];
  return { co, si, j0 };
}

function bmat(xi: number, eta: number, x: number[], y: number[], co: number[], si: number[], j0: number[][]) {
  const xp = 1 + xi, xm = 1 - xi, ep = 1 + eta, em = 1 - eta, xi2 = xp * xm, eta2 = ep * em;
  const N = [0.25 * xm * em, 0.25 * xp * em, 0.25 * xp * ep, 0.25 * xm * ep];
  const dxi = [-0.25 * em, 0.25 * em, 0.25 * ep, -0.25 * ep], deta = [-0.25 * xm, -0.25 * xp, 0.25 * xp, 0.25 * xm];
  const J = [[0, 0], [0, 0]];
  for (let k = 0; k < 4; k++) { J[0][0] += dxi[k] * x[k]; J[0][1] += dxi[k] * y[k]; J[1][0] += deta[k] * x[k]; J[1][1] += deta[k] * y[k]; }
  let xsj = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  const Ji = [[J[1][1] / xsj, -J[0][1] / xsj], [-J[1][0] / xsj, J[0][0] / xsj]];
  xsj = Math.abs(xsj);
  const shpn = [-2 * xi * eta2, -2 * eta * xi2, xi2 * eta2];
  const M = [xi2 * em, xp * eta2, xi2 * ep, xm * eta2].map((v) => v * 0.0625);
  const Mxi = [-xi * em * 0.125, eta2 * 0.0625, -xi * ep * 0.125, -eta2 * 0.0625];
  const Meta = [-xi2 * 0.0625, -eta * xp * 0.125, xi2 * 0.0625, -eta * xm * 0.125];
  const b1 = [0, 1, 2, 3].map((i) => Ji[0][0] * dxi[i] + Ji[0][1] * deta[i]);
  const b2 = [0, 1, 2, 3].map((i) => Ji[1][0] * dxi[i] + Ji[1][1] * deta[i]);
  const f1 = [0, 1, 2, 3].map((i) => Ji[0][0] * Mxi[i] + Ji[0][1] * Meta[i]);
  const f2 = [0, 1, 2, 3].map((i) => Ji[1][0] * Mxi[i] + Ji[1][1] * Meta[i]);
  const dj1 = (x[0] - x[1] + x[2] - x[3]) * 0.25, dj2 = (y[0] - y[1] + y[2] - y[3]) * 0.25;
  const aa = j0[0][0] * dj2 - j0[0][1] * dj1, bb = j0[1][1] * dj1 - j0[1][0] * dj2;
  const Nj = shpn[2] / xsj;
  const Nj_xi = (shpn[0] * xsj - shpn[2] * aa) / (xsj * xsj), Nj_eta = (shpn[1] * xsj - shpn[2] * bb) / (xsj * xsj);
  const Nj_x = Ji[0][0] * Nj_xi + Ji[0][1] * Nj_eta, Nj_y = Ji[1][0] * Nj_xi + Ji[1][1] * Nj_eta;
  const xiNj_xi = Nj + xi * Nj_xi, xiNj_eta = xi * Nj_eta, etaNj_xi = eta * Nj_xi, etaNj_eta = Nj + eta * Nj_eta;
  const xiNj_x = Ji[0][0] * xiNj_xi + Ji[0][1] * xiNj_eta, xiNj_y = Ji[1][0] * xiNj_xi + Ji[1][1] * xiNj_eta;
  const etaNj_x = Ji[0][0] * etaNj_xi + Ji[0][1] * etaNj_eta, etaNj_y = Ji[1][0] * etaNj_xi + Ji[1][1] * etaNj_eta;
  const ax = etaNj_x * j0[1][0], ay = etaNj_y * j0[1][0], bx = -xiNj_x * j0[0][0], by = -xiNj_y * j0[0][0];
  const cx = etaNj_x * j0[1][1], cy = etaNj_y * j0[1][1], dx = -xiNj_x * j0[0][1], dy = -xiNj_y * j0[0][1];
  const Bw = [new Array(12).fill(0), new Array(12).fill(0)];
  const Bt = [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
  const Bwt = [new Array(12).fill(0), new Array(12).fill(0)];
  for (let i = 0; i < 4; i++) {
    Bw[0][3 * i] = b1[i]; Bw[1][3 * i] = b2[i];
    Bt[0][3 * i + 2] = b1[i]; Bt[1][3 * i + 1] = -b2[i]; Bt[2][3 * i + 1] = -b1[i]; Bt[2][3 * i + 2] = b2[i];
    const c = (i + 3) % 4;
    Bwt[0][3 * i + 1] = f1[i] * co[i] - f1[c] * co[c];
    Bwt[0][3 * i + 2] = N[i] + f1[i] * si[i] - f1[c] * si[c];
    Bwt[1][3 * i + 1] = -N[i] + f2[i] * co[i] - f2[c] * co[c];
    Bwt[1][3 * i + 2] = f2[i] * si[i] - f2[c] * si[c];
  }
  const Bb = [[j0[1][1] * Nj_x, -j0[0][1] * Nj_x, cx, dx],
              [-j0[1][0] * Nj_y, j0[0][0] * Nj_y, -ay, -by],
              [-j0[1][0] * Nj_x + j0[1][1] * Nj_y, j0[0][0] * Nj_x - j0[0][1] * Nj_y, -ax + cy, -bx + dy]];
  const Ns = [[j0[0][0], j0[1][0], j0[0][0] * eta, j0[1][0] * xi], [j0[0][1], j0[1][1], j0[0][1] * eta, j0[1][1] * xi]];
  return { N, M, xsj, Bw, Bt, Bwt, Bb, Ns };
}

const mul = (A: number[][], B: number[][]) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const tr = (A: number[][]) => A[0].map((_, j) => A.map((r) => r[j]));
function inv(A: number[][]): number[][] {
  const n = A.length, M = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c]; for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
    for (let r = 0; r < n; r++) if (r !== c) { const f = M[r][c]; if (f) for (let k = 0; k < 2 * n; k++) M[r][k] -= f * M[c][k]; }
  }
  return M.map((r) => r.slice(n));
}

/**
 * K 12×12, F 12 (carga q normal, en ejes del elemento) y `momentos(u, xi, eta)` → [Mx, My, Mxy] con las
 * burbujas y el cortante recuperados (strepq). `mod` = [m11, m22, m12, v13, v23] opcional.
 */
export function placaAT(x: number[], y: number[], E: number, nu: number, t: number, q = 0,
                        mod?: number[], kappa = 5 / 6) {
  const { co, si, j0 } = geom(x, y);
  const D0 = (E * t * t * t) / (12 * (1 - nu * nu));
  const Db = [[D0, D0 * nu, 0], [D0 * nu, D0, 0], [0, 0, (D0 * (1 - nu)) / 2]];
  let G = kappa * E / (2 * (1 + nu)) * t;
  const Gs = [G, G];
  if (mod) {
    Db[0][0] *= mod[0]; Db[1][1] *= mod[1]; Db[2][2] *= mod[2];
    const c = Math.sqrt(Math.max(0, mod[0] * mod[1])); Db[0][1] *= c; Db[1][0] *= c;
    Gs[0] *= mod[3]; Gs[1] *= mod[4];
  }
  const Ktt = Array.from({ length: 12 }, () => new Array(12).fill(0));
  const Kbt = Array.from({ length: 4 }, () => new Array(12).fill(0));
  const Kbb = Array.from({ length: 4 }, () => new Array(4).fill(0));
  const Kss = Array.from({ length: 4 }, () => new Array(4).fill(0));
  const Ks = Array.from({ length: 4 }, () => new Array(12).fill(0));
  const F = new Array(12).fill(0);
  for (const [xi, wx] of P3) for (const [eta, we] of P3) {
    const { N, M, xsj, Bw, Bt, Bwt, Bb, Ns } = bmat(xi, eta, x, y, co, si, j0);
    const dA = xsj * wx * we;
    const DBt = mul(Db, Bt), DBb = mul(Db, Bb);
    for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) Ktt[i][j] += (Bt[0][i] * DBt[0][j] + Bt[1][i] * DBt[1][j] + Bt[2][i] * DBt[2][j]) * dA;
    for (let a = 0; a < 4; a++) {
      for (let j = 0; j < 12; j++) {
        Kbt[a][j] += (Bb[0][a] * DBt[0][j] + Bb[1][a] * DBt[1][j] + Bb[2][a] * DBt[2][j]) * dA;
        Ks[a][j] += (Ns[0][a] * (Bw[0][j] + Bwt[0][j]) + Ns[1][a] * (Bw[1][j] + Bwt[1][j])) * dA;
      }
      for (let b = 0; b < 4; b++) {
        Kbb[a][b] += (Bb[0][a] * DBb[0][b] + Bb[1][a] * DBb[1][b] + Bb[2][a] * DBb[2][b]) * dA;
        Kss[a][b] -= (Ns[0][a] * Ns[0][b] / Gs[0] + Ns[1][a] * Ns[1][b] / Gs[1]) * dA;
      }
    }
    for (let i = 0; i < 4; i++) {
      const k = (i + 3) % 4;
      F[3 * i] += q * N[i] * dA;
      F[3 * i + 1] += q * (M[i] * co[i] - M[k] * co[k]) * dA;
      F[3 * i + 2] += q * (M[i] * si[i] - M[k] * si[k]) * dA;
    }
  }
  const dJ0 = j0[0][0] * j0[1][1] - j0[0][1] * j0[1][0];
  const kbs = [1, 1, 0.2, 0.2].map((f) => (16 / 9) * dJ0 * f);
  const Kbbi = inv(Kbb);
  const app1 = mul(Kbbi, Kbt);                                              // 4×12
  const Kss2 = Kss.map((r, a) => r.map((v, b) => v - kbs[a] * Kbbi[a][b] * kbs[b]));
  const Ks2 = Ks.map((r, a) => r.map((v, j) => v - kbs[a] * app1[a][j]));
  const Kssi = inv(Kss2);
  const KbtT_app1 = mul(tr(Kbt), app1), KsT_Kssi_Ks = mul(tr(Ks2), mul(Kssi, Ks2));
  const K = Ktt.map((r, i) => r.map((v, j) => v - KbtT_app1[i][j] - KsT_Kssi_Ks[i][j]));
  const momentos = (u: number[], xi: number, eta: number) => {
    const s = Kssi.map((r) => -r.reduce((acc, v, b) => acc + v * Ks2[b].reduce((z, w, j) => z + w * u[j], 0), 0));
    const rhs = Kbt.map((r, a) => r.reduce((z, w, j) => z + w * u[j], 0) + kbs[a] * s[a]);
    const bub = Kbbi.map((r) => -r.reduce((z, v, b) => z + v * rhs[b], 0));
    const { Bt, Bb } = bmat(xi, eta, x, y, co, si, j0);
    const k = [0, 1, 2].map((r) => Bt[r].reduce((z, v, j) => z + v * u[j], 0) + Bb[r].reduce((z, v, a) => z + v * bub[a], 0));
    return [0, 1, 2].map((r) => Db[r][0] * k[0] + Db[r][1] * k[1] + Db[r][2] * k[2]);
  };
  return { K, F, momentos };
}

/** Momentos [Mx, My, Mxy] en las 4 esquinas (evaluados en la esquina, como strepq). */
export function atJointMoments(x: number[], y: number[], u12: number[], E: number, nu: number, t: number, mod?: number[]) {
  const { momentos } = placaAT(x, y, E, nu, t, 0, mod);
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([r, s]) => momentos(u12, r, s));
}
