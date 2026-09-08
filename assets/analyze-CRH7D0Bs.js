import { s as oo, n as Ct, b as Zt, k as $t, i as Et, z as ft, c as Ht, m as et, t as Kt, a as Rt, e as rt, f as Vt } from "./pureFunctionsAny.generated-DeJSBP3k.js";
function ro(t, s, r, e, c, f) {
  const o = e * f * f * f / (12 * (1 - c * c)), M = [[o, o * c, 0], [o * c, o, 0], [0, 0, o * (1 - c) / 2]], g = 5 / 6 * e * f / (2 * (1 + c)), a = M[0][0] + M[1][1] + M[2][2], y = 1e3, x = [], l = [], Y = [];
  for (let n = 0; n < 4; n++) {
    const m = (n + 1) % 4, A = t[m] - t[n], q = s[m] - s[n], K = Math.hypot(A, q);
    Y.push(K), x.push(K > 0 ? A / K : 1), l.push(K > 0 ? q / K : 0);
  }
  const i = () => new Array(22).fill(0), h = [i(), i(), i(), i()];
  for (let n = 0; n < 4; n++) {
    const m = (n + 1) % 4;
    h[n][3 * m] += 1 / Y[n], h[n][3 * n] -= 1 / Y[n], h[n][3 * n + 1] -= l[n] / 2, h[n][3 * m + 1] -= l[n] / 2, h[n][3 * n + 2] += x[n] / 2, h[n][3 * m + 2] += x[n] / 2, h[n][12 + 2 * n] -= 2 / 3 * l[n], h[n][13 + 2 * n] += 2 / 3 * x[n];
  }
  const X = (n, m) => n.map((A) => A * m), b = (n, m) => n.map((A, q) => A + m[q]), _ = X(h[0], Y[0] / 2), J = X(h[2], -Y[2] / 2), d = X(h[1], Y[1] / 2), u = X(h[3], -Y[3] / 2), v = X(b(_, J), 0.5), Q = X(b(J, X(_, -1)), 0.5), Z = X(b(u, d), 0.5), B = X(b(d, X(u, -1)), 0.5), V = X(b(Q, B), 0.5), N = (n, m) => {
    const A = [-(1 - m) / 4, (1 - m) / 4, (1 + m) / 4, -(1 + m) / 4], q = [-(1 - n) / 4, -(1 + n) / 4, (1 + n) / 4, (1 - n) / 4], K = [-n * (1 - m), (1 - m * m) / 2, -n * (1 + m), -(1 - m * m) / 2], nt = [-(1 - n * n) / 2, -m * (1 + n), (1 - n * n) / 2, -m * (1 - n)];
    let I = 0, ht = 0, pt = 0, bt = 0;
    for (let T = 0; T < 4; T++) I += A[T] * t[T], ht += A[T] * s[T], pt += q[T] * t[T], bt += q[T] * s[T];
    const At = I * bt - ht * pt, ct = [[bt / At, -ht / At], [-pt / At, I / At]], mt = [i(), i(), i(), i(), i()], wt = i(), ut = (T, O, R, Nt, Xt) => {
      mt[0][T] += R * Nt, mt[1][T] -= O * Xt, mt[2][T] += R * Xt - O * Nt, wt[T] += O * Nt + R * Xt;
    };
    for (let T = 0; T < 4; T++) {
      const O = ct[0][0] * A[T] + ct[0][1] * q[T], R = ct[1][0] * A[T] + ct[1][1] * q[T];
      ut(3 * T + 1, 1, 0, O, R), ut(3 * T + 2, 0, 1, O, R);
    }
    for (let T = 0; T < 4; T++) {
      const O = ct[0][0] * K[T] + ct[0][1] * nt[T], R = ct[1][0] * K[T] + ct[1][1] * nt[T];
      ut(12 + 2 * T, 1, 0, O, R), ut(13 + 2 * T, 0, 1, O, R);
    }
    const dt = -2 * n * (1 - m * m), yt = -2 * m * (1 - n * n), qt = ct[0][0] * dt + ct[0][1] * yt, k = ct[1][0] * dt + ct[1][1] * yt;
    ut(20, 1, 0, qt, k), ut(21, 0, 1, qt, k);
    const it = b(v, X(V, m)), Yt = b(Z, X(V, n));
    for (let T = 0; T < 22; T++) mt[3][T] = ct[0][0] * it[T] + ct[0][1] * Yt[T], mt[4][T] = ct[1][0] * it[T] + ct[1][1] * Yt[T];
    return { B: mt, v: wt, dJ: Math.abs(At) };
  }, E = Math.sqrt(7 / 9), P = Math.sqrt(7 / 15), w = [[-E, -E], [E, -E], [E, E], [-E, E], [0, -P], [P, 0], [0, P], [-P, 0]], p = [9 / 49, 9 / 49, 9 / 49, 9 / 49, 40 / 49, 40 / 49, 40 / 49, 40 / 49], z = w.map(([n, m], A) => {
    const q = N(n, m);
    return { B: q.B, v: q.v, w: p[A] * q.dJ };
  }), U = z.reduce((n, m) => n + m.w, 0), L = [i(), i(), i()];
  for (const n of z) for (let m = 0; m < 3; m++) for (let A = 12; A < 22; A++) L[m][A] += n.B[m][A] * n.w / U;
  const j = Array.from({ length: 22 }, () => i());
  for (const n of z) {
    for (let A = 0; A < 3; A++) for (let q = 12; q < 22; q++) n.B[A][q] -= L[A][q];
    const m = [i(), i(), i(), i(), i()];
    for (let A = 0; A < 22; A++) {
      for (let q = 0; q < 3; q++) m[q][A] = M[q][0] * n.B[0][A] + M[q][1] * n.B[1][A] + M[q][2] * n.B[2][A];
      m[3][A] = g * n.B[3][A], m[4][A] = g * n.B[4][A];
    }
    for (let A = 0; A < 22; A++) for (let q = 0; q < 22; q++) {
      let K = 0;
      for (let nt = 0; nt < 5; nt++) K += n.B[nt][A] * m[nt][q];
      j[A][q] += (K + y * a * n.v[A] * n.v[q]) * n.w;
    }
  }
  let $ = 0;
  for (const n of j) for (const m of n) $ = Math.max($, Math.abs(m));
  const C = j.map((n) => n.slice()), H = [];
  for (let n = 12; n < 22; n++) {
    const m = C[n][n];
    if (Math.abs(m) <= 1e-14 * $) continue;
    H.push(n);
    const A = C[n].slice(), q = C.map((K) => K[n]);
    for (let K = 0; K < 22; K++) for (let nt = 0; nt < 22; nt++) C[K][nt] -= q[K] * A[nt] / m;
    for (let K = 0; K < 22; K++) C[n][K] = 0, C[K][n] = 0;
  }
  const W = H.length, D = H.map((n) => H.map((m) => j[n][m])), F = H.map((n) => {
    let m = 0;
    for (let A = 0; A < 12; A++) m -= j[n][A] * r[A];
    return m;
  });
  for (let n = 0; n < W; n++) {
    let m = n;
    for (let A = n + 1; A < W; A++) Math.abs(D[A][n]) > Math.abs(D[m][n]) && (m = A);
    if ([D[n], D[m]] = [D[m], D[n]], [F[n], F[m]] = [F[m], F[n]], !(Math.abs(D[n][n]) < 1e-300)) for (let A = n + 1; A < W; A++) {
      const q = D[A][n] / D[n][n];
      for (let K = n; K < W; K++) D[A][K] -= q * D[n][K];
      F[A] -= q * F[n];
    }
  }
  const tt = new Array(W).fill(0);
  for (let n = W - 1; n >= 0; n--) {
    let m = F[n];
    for (let A = n + 1; A < W; A++) m -= D[n][A] * tt[A];
    tt[n] = Math.abs(D[n][n]) < 1e-300 ? 0 : m / D[n][n];
  }
  const st = i();
  for (let n = 0; n < 12; n++) st[n] = r[n];
  H.forEach((n, m) => {
    st[n] = tt[m];
  });
  const at = (n, m) => {
    const { B: A } = N(n, m);
    for (let K = 0; K < 3; K++) for (let nt = 12; nt < 22; nt++) A[K][nt] -= L[K][nt];
    const q = [0, 1, 2].map((K) => A[K].reduce((nt, I, ht) => nt + I * st[ht], 0));
    return [0, 1, 2].map((K) => M[K][0] * q[0] + M[K][1] * q[1] + M[K][2] * q[2]);
  };
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([n, m]) => at(n, m));
}
function eo(t, s) {
  const r = new Array(8).fill(0), e = new Array(8).fill(0), c = new Array(8).fill(0), f = [-1, 1, 1, -1], o = [-1, -1, 1, 1];
  for (let M = 0; M < 4; M++) {
    const g = f[M] * t, a = o[M] * s;
    r[M] = 0.25 * (1 + g) * (1 + a) * (g + a - 1), e[M] = 0.25 * f[M] * (1 + a) * (2 * g + a), c[M] = 0.25 * o[M] * (1 + g) * (g + 2 * a);
  }
  return r[4] = 0.5 * (1 - t * t) * (1 - s), e[4] = -t * (1 - s), c[4] = -0.5 * (1 - t * t), r[5] = 0.5 * (1 + t) * (1 - s * s), e[5] = 0.5 * (1 - s * s), c[5] = -s * (1 + t), r[6] = 0.5 * (1 - t * t) * (1 + s), e[6] = -t * (1 + s), c[6] = 0.5 * (1 - t * t), r[7] = 0.5 * (1 - t) * (1 - s * s), e[7] = -0.5 * (1 - s * s), c[7] = -s * (1 - t), { N: r, dNxi: e, dNet: c };
}
function ao(t, s, r, e) {
  const c = [], f = [], o = [], M = [], g = [];
  for (let N = 0; N < 4; N++) {
    const E = N, P = (N + 1) % 4, w = t[E] - t[P], p = s[E] - s[P], z = w * w + p * p;
    c.push(-w / z), f.push(0.75 * w * p / z), o.push((0.25 * w * w - 0.5 * p * p) / z), M.push(-p / z), g.push((0.25 * p * p - 0.5 * w * w) / z);
  }
  const { dNxi: a, dNet: y } = eo(r, e), x = [-(1 - e) / 4, (1 - e) / 4, (1 + e) / 4, -(1 + e) / 4], l = [-(1 - r) / 4, -(1 + r) / 4, (1 + r) / 4, (1 - r) / 4];
  let Y = 0, i = 0, h = 0, X = 0;
  for (let N = 0; N < 4; N++) Y += x[N] * t[N], i += x[N] * s[N], h += l[N] * t[N], X += l[N] * s[N];
  const b = Y * X - i * h, _ = X / b, J = -i / b, d = -h / b, u = Y / b, v = new Array(12).fill(0), Q = new Array(12).fill(0), Z = new Array(12).fill(0), B = new Array(12).fill(0);
  for (let N = 0; N < 4; N++) {
    const E = (N + 3) % 4, P = N, w = 4 + E, p = 4 + P, z = 1.5 * (c[P] * a[p] - c[E] * a[w]), U = 1.5 * (c[P] * y[p] - c[E] * y[w]), L = f[P] * a[p] + f[E] * a[w], j = f[P] * y[p] + f[E] * y[w], $ = a[N] - o[P] * a[p] - o[E] * a[w], C = y[N] - o[P] * y[p] - o[E] * y[w];
    v[3 * N] = z, Q[3 * N] = U, v[3 * N + 1] = L, Q[3 * N + 1] = j, v[3 * N + 2] = $, Q[3 * N + 2] = C;
    const H = 1.5 * (M[P] * a[p] - M[E] * a[w]), W = 1.5 * (M[P] * y[p] - M[E] * y[w]), D = -a[N] + g[P] * a[p] + g[E] * a[w], F = -y[N] + g[P] * y[p] + g[E] * y[w];
    Z[3 * N] = H, B[3 * N] = W, Z[3 * N + 1] = D, B[3 * N + 1] = F, Z[3 * N + 2] = -L, B[3 * N + 2] = -j;
  }
  const V = [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
  for (let N = 0; N < 12; N++) {
    const E = _ * v[N] + J * Q[N], P = d * v[N] + u * Q[N], w = _ * Z[N] + J * B[N], p = d * Z[N] + u * B[N];
    V[0][N] = E, V[1][N] = p, V[2][N] = P + w;
  }
  return V;
}
function io(t, s, r, e, c, f, o = "esquinas") {
  const M = e * f * f * f / (12 * (1 - c * c)), g = [[M, M * c, 0], [M * c, M, 0], [0, 0, M * (1 - c) / 2]], a = (Y, i) => {
    const h = ao(t, s, Y, i), X = [0, 1, 2].map((b) => h[b].reduce((_, J, d) => _ + J * r[d], 0));
    return [0, 1, 2].map((b) => g[b][0] * X[0] + g[b][1] * X[1] + g[b][2] * X[2]);
  }, y = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (o === "esquinas") return y.map(([Y, i]) => a(Y, i));
  const x = 1 / Math.sqrt(3), l = y.map(([Y, i]) => a(Y * x, i * x));
  return y.map(([Y, i]) => {
    const h = Y * Math.sqrt(3), X = i * Math.sqrt(3), b = y.map(([_, J]) => (1 + _ * h) * (1 + J * X) / 4);
    return [0, 1, 2].map((_) => b.reduce((J, d, u) => J + d * l[u][_], 0));
  });
}
const Ot = 1 / Math.sqrt(3);
function Pt(t, s) {
  const r = [0.25 * (1 - t) * (1 - s), 0.25 * (1 + t) * (1 - s), 0.25 * (1 + t) * (1 + s), 0.25 * (1 - t) * (1 + s)], e = [-0.25 * (1 - s), 0.25 * (1 - s), 0.25 * (1 + s), -0.25 * (1 + s)], c = [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)];
  return { N: r, dNdxi: e, dNdeta: c };
}
function Wt(t, s, r, e) {
  let c = 0, f = 0, o = 0, M = 0;
  for (let l = 0; l < 4; l++) c += t[l] * r[l], f += t[l] * e[l], o += s[l] * r[l], M += s[l] * e[l];
  const g = c * M - f * o, a = 1 / g, y = [], x = [];
  for (let l = 0; l < 4; l++) y.push(a * (M * t[l] - f * s[l])), x.push(a * (-o * t[l] + c * s[l]));
  return { dNdx: y, dNdy: x, detJ: g, J: [c, f, o, M] };
}
function fo(t, s, r, e, c, f) {
  const o = r * c / (1 - e * e), M = [[o, o * e, 0], [o * e, o, 0], [0, 0, o * (1 - e) / 2]], g = [1, 2, 3, 0], a = [3, 0, 1, 2], y = [], x = [];
  for (let w = 0; w < 4; w++) y.push((s[g[w]] - s[w]) / 8), x.push(-(t[g[w]] - t[w]) / 8);
  const l = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)], Y = [5 / 9, 8 / 9, 5 / 9], i = Bt(14, 14);
  let h = [], X = [], b = [], _ = [], J = [], d = 0, u = 0, v = 0;
  for (let w = 0; w < 3; w++) for (let p = 0; p < 3; p++) {
    const z = l[w], U = l[p], L = Y[w] * Y[p], { N: j, dNdxi: $, dNdeta: C } = Pt(z, U);
    let H = 0, W = 0, D = 0, F = 0;
    for (let k = 0; k < 4; k++) H += $[k] * t[k], W += $[k] * s[k], D += C[k] * t[k], F += C[k] * s[k];
    const tt = H * F - W * D, st = F / tt, at = -W / tt, n = -D / tt, m = H / tt, A = [], q = [];
    for (let k = 0; k < 4; k++) A.push(st * $[k] + at * C[k]), q.push(n * $[k] + m * C[k]);
    const K = [-z * (1 - U), 0.5 * (1 - U * U), -z * (1 + U), -0.5 * (1 - U * U)], nt = [-0.5 * (1 - z * z), -U * (1 + z), 0.5 * (1 - z * z), -U * (1 - z)], I = [], ht = [];
    for (let k = 0; k < 4; k++) I.push(st * K[k] + at * nt[k]), ht.push(n * K[k] + m * nt[k]);
    const pt = -2 * z * (1 - U * U), bt = -2 * U * (1 - z * z), At = st * pt + at * bt, ct = n * pt + m * bt, mt = [], wt = [], ut = [], dt = [];
    for (let k = 0; k < 4; k++) {
      const it = a[k];
      mt.push(I[it] * y[it] - I[k] * y[k]), wt.push(ht[it] * y[it] - ht[k] * y[k]), ut.push(I[it] * x[it] - I[k] * x[k]), dt.push(ht[it] * x[it] - ht[k] * x[k]);
    }
    const yt = Bt(3, 14);
    for (let k = 0; k < 4; k++) yt[0][3 * k] = A[k], yt[1][3 * k + 1] = q[k], yt[2][3 * k] = q[k], yt[2][3 * k + 1] = A[k], yt[0][3 * k + 2] = mt[k], yt[1][3 * k + 2] = dt[k], yt[2][3 * k + 2] = wt[k] + ut[k];
    yt[0][12] = At, yt[2][12] = ct, yt[1][13] = ct, yt[2][13] = At;
    const qt = L * Math.abs(tt);
    for (let k = 0; k < 14; k++) for (let it = 0; it < 14; it++) {
      let Yt = 0;
      for (let T = 0; T < 3; T++) for (let O = 0; O < 3; O++) Yt += yt[T][k] * M[T][O] * yt[O][it];
      i[k][it] += qt * Yt;
    }
    w === 1 && p === 1 && (h = j.slice(), X = A.slice(), b = q.slice(), _ = wt.slice(), J = ut.slice(), d = At, u = ct, v = Math.abs(tt));
  }
  const Q = r / (2 * (1 + e)), Z = new Array(14).fill(0);
  for (let w = 0; w < 4; w++) Z[3 * w] = -0.5 * b[w], Z[3 * w + 1] = 0.5 * X[w], Z[3 * w + 2] = 0.5 * (J[w] - _[w]) - h[w];
  Z[12] = -0.5 * u, Z[13] = 0.5 * d;
  const B = f * Q * c * 4 * v;
  for (let w = 0; w < 14; w++) for (let p = 0; p < 14; p++) i[w][p] += B * Z[w] * Z[p];
  const V = [[i[12][12], i[12][13]], [i[13][12], i[13][13]]], N = V[0][0] * V[1][1] - V[0][1] * V[1][0], E = Bt(12, 12);
  for (let w = 0; w < 12; w++) for (let p = 0; p < 12; p++) E[w][p] = i[w][p];
  if (Math.abs(N) < 1e-30) return E;
  const P = [[V[1][1] / N, -V[0][1] / N], [-V[1][0] / N, V[0][0] / N]];
  for (let w = 0; w < 12; w++) for (let p = 0; p < 12; p++) {
    let z = 0;
    for (let U = 0; U < 2; U++) for (let L = 0; L < 2; L++) z += i[w][12 + U] * P[U][L] * i[12 + L][p];
    E[w][p] -= z;
  }
  return E;
}
function lo(t, s, r, e, c) {
  const f = Bt(12, 12), o = r * c * c * c / (12 * (1 - e * e)), g = 5 / 6 * r / (2 * (1 + e)) * c, a = [[-Ot, -Ot], [Ot, -Ot], [Ot, Ot], [-Ot, Ot]], y = [{ xi: 0, eta: -1 }, { xi: 0, eta: 1 }, { xi: -1, eta: 0 }, { xi: 1, eta: 0 }], x = [];
  for (const l of y) {
    const { N: Y, dNdxi: i, dNdeta: h } = Pt(l.xi, l.eta), { dNdx: X, dNdy: b, J: _ } = Wt(i, h, t, s), J = Bt(2, 12);
    for (let B = 0; B < 4; B++) J[0][B * 3] = X[B], J[0][B * 3 + 1] = -Y[B], J[1][B * 3] = b[B], J[1][B * 3 + 2] = -Y[B];
    const [d, u, v, Q] = _, Z = Bt(2, 12);
    for (let B = 0; B < 12; B++) Z[0][B] = d * J[0][B] + u * J[1][B], Z[1][B] = v * J[0][B] + Q * J[1][B];
    x.push(Z);
  }
  for (const [l, Y] of a) {
    const { dNdxi: i, dNdeta: h } = Pt(l, Y), { dNdx: X, dNdy: b, detJ: _, J } = Wt(i, h, t, s), d = Bt(3, 12);
    for (let p = 0; p < 4; p++) d[0][p * 3 + 1] = X[p], d[1][p * 3 + 2] = b[p], d[2][p * 3 + 1] = b[p], d[2][p * 3 + 2] = X[p];
    for (let p = 0; p < 12; p++) for (let z = 0; z < 12; z++) {
      let U = 0;
      U += o * (d[0][p] * d[0][z] + e * d[0][p] * d[1][z] + e * d[1][p] * d[0][z] + d[1][p] * d[1][z]), U += o * (1 - e) / 2 * d[2][p] * d[2][z], f[p][z] += U * Math.abs(_);
    }
    const u = Bt(2, 12), v = 0.5 * (1 - Y), Q = 0.5 * (1 + Y), Z = 0.5 * (1 - l), B = 0.5 * (1 + l), [V, N, E, P] = J, w = 1 / _;
    for (let p = 0; p < 12; p++) {
      const z = v * x[0][0][p] + Q * x[1][0][p], U = Z * x[2][1][p] + B * x[3][1][p];
      u[0][p] = w * (P * z - N * U), u[1][p] = w * (-E * z + V * U);
    }
    for (let p = 0; p < 12; p++) for (let z = 0; z < 12; z++) f[p][z] += g * (u[0][p] * u[0][z] + u[1][p] * u[1][z]) * Math.abs(_);
  }
  return f;
}
function go(t, s, r) {
  var _a, _b, _c;
  const e = ((_a = s == null ? void 0 : s.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = s == null ? void 0 : s.poissonsRatios) == null ? void 0 : _b.get(r)) ?? 0.2, f = ((_c = s == null ? void 0 : s.thicknesses) == null ? void 0 : _c.get(r)) ?? 0;
  if (e === 0 || f === 0) return Bt(24, 24);
  const { localCoords: o } = no(t), M = o.map((b) => b[0]), g = o.map((b) => b[1]), a = lo(M, g, e, c, f), x = fo(M, g, e, c, f, 0.4), l = Bt(24, 24), Y = [2, 3, 4, 8, 9, 10, 14, 15, 16, 20, 21, 22], i = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], h = Bt(12, 12);
  for (let b = 0; b < 12; b++) for (let _ = 0; _ < 12; _++) {
    let J = 0;
    const d = b / 3 | 0, u = b % 3, v = _ / 3 | 0, Q = _ % 3;
    for (let Z = 0; Z < 3; Z++) {
      const B = i[Z][u];
      if (B !== 0) for (let V = 0; V < 3; V++) {
        const N = i[V][Q];
        N !== 0 && (J += B * a[d * 3 + Z][v * 3 + V] * N);
      }
    }
    h[b][_] = J;
  }
  for (let b = 0; b < 12; b++) for (let _ = 0; _ < 12; _++) l[Y[b]][Y[_]] += h[b][_];
  const X = [0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23];
  for (let b = 0; b < 12; b++) for (let _ = 0; _ < 12; _++) l[X[b]][X[_]] += x[b][_];
  return l;
}
function ho(t) {
  const { localX: s, localY: r, localZ: e } = no(t), c = [[s[0], s[1], s[2]], [r[0], r[1], r[2]], [e[0], e[1], e[2]]], f = Bt(24, 24);
  for (let o = 0; o < 4; o++) for (let M = 0; M < 2; M++) {
    const g = o * 6 + M * 3;
    for (let a = 0; a < 3; a++) for (let y = 0; y < 3; y++) f[g + a][g + y] = c[a][y];
  }
  return f;
}
function no(t) {
  const s = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]], r = [t[3][0] - t[1][0], t[3][1] - t[1][1], t[3][2] - t[1][2]], e = Ut(s, r), c = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), f = e.map((i) => i / c), o = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], M = Math.sqrt(o[0] ** 2 + o[1] ** 2 + o[2] ** 2), g = o.map((i) => i / M), a = Ut(f, g), y = t.map((i) => i[0]).reduce((i, h) => i + h) / 4, x = t.map((i) => i[1]).reduce((i, h) => i + h) / 4, l = t.map((i) => i[2]).reduce((i, h) => i + h) / 4, Y = t.map((i) => {
    const h = i[0] - y, X = i[1] - x, b = i[2] - l;
    return [h * g[0] + X * g[1] + b * g[2], h * a[0] + X * a[1] + b * a[2]];
  });
  return { localX: g, localY: a, localZ: f, localCoords: Y };
}
function Ut(t, s) {
  return [t[1] * s[2] - t[2] * s[1], t[2] * s[0] - t[0] * s[2], t[0] * s[1] - t[1] * s[0]];
}
function Bt(t, s) {
  return Array.from({ length: t }, () => Array(s).fill(0));
}
function It(t, s = 0) {
  if (t.length === 2) return yo(t, s);
  if (t.length === 3) return Mo(t);
  if (t.length === 4) return ho(t);
}
function yo(t, s = 0) {
  const r = (y) => {
    if (Math.abs(s) < 1e-12) return y;
    const x = s * Math.PI / 180, l = Math.cos(x), Y = Math.sin(x);
    return [y[0], [l * y[1][0] + Y * y[2][0], l * y[1][1] + Y * y[2][1], l * y[1][2] + Y * y[2][2]], [-Y * y[1][0] + l * y[2][0], -Y * y[1][1] + l * y[2][1], -Y * y[1][2] + l * y[2][2]]];
  }, e = oo(t[1], t[0]), c = Ct(e), f = Zt(e, [1, 0, 0]) / c, o = Zt(e, [0, 1, 0]) / c, M = Zt(e, [0, 0, 1]) / c, g = Math.sqrt(f ** 2 + o ** 2);
  if (g < 1e-9) {
    const y = M > 0 ? 1 : -1, x = [[0, 0, y], [1, 0, 0], [0, y, 0]];
    return $t(Et(4), r(x)).toArray();
  }
  const a = [[f, o, M], [-f * M / g, -o * M / g, g], [o / g, -f / g, 0]];
  return $t(Et(4), r(a)).toArray();
}
function Mo(t) {
  const f = [t[0], t[1], t[2]], o = ft(3, 3).toArray();
  for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) o[u][v] = f[v][u];
  const M = [-1, 1, 0], g = [-1, 0, 1], a = ft(3, 2).toArray();
  for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) a[u][0] += o[u][v] * M[v], a[u][1] += o[u][v] * g[v];
  const y = a.map((u) => u[0]), x = a.map((u) => u[1]);
  let l = Ht(y, x), Y = Ct(l);
  if (Y === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), ft(18, 18).toArray();
  l = l.map((u) => u / Y);
  const i = [...l], h = Et(3).toArray(), X = l[0];
  let b;
  if (Math.abs(X) > 1 - 1e-10) {
    const u = l[2];
    b = h.map((v, Q) => v[2] - u * l[Q]);
  } else b = h.map((u, v) => u[0] - X * l[v]);
  if (Y = Ct(b), Y === 0) return console.warn("Degenerate local X-axis detected."), ft(18, 18).toArray();
  b = b.map((u) => u / Y);
  let _ = Ht(i, b);
  if (Y = Ct(_), Y === 0) return console.warn("Degenerate local Y-axis detected."), ft(18, 18).toArray();
  _ = _.map((u) => u / Y);
  const J = [b, _, i], d = ft(18, 18).toArray();
  for (let u = 0; u < 3; u++) {
    const v = u * 6, Q = v + 3;
    for (let Z = 0; Z < 3; Z++) for (let B = 0; B < 3; B++) d[v + Z][v + B] = J[Z][B], d[Q + Z][Q + B] = J[Z][B];
  }
  return d;
}
function uo(t, s, r) {
  var _a, _b, _c;
  if (t.length === 2) {
    let e = wo(t, s, r);
    const c = (_a = s == null ? void 0 : s.partialFixitySprings) == null ? void 0 : _a.get(r);
    c && (e = po(e, c));
    const f = (_b = s == null ? void 0 : s.momentReleases) == null ? void 0 : _b.get(r);
    f && (e = bo(e, f));
    const o = (_c = s == null ? void 0 : s.endOffsets) == null ? void 0 : _c.get(r);
    if (o && o[2] > 0 && (o[0] > 0 || o[1] > 0)) {
      const M = Ao(o[2] * o[0], o[2] * o[1]);
      e = Yo(M, e, M);
    }
    return e;
  }
  if (t.length === 3) return Xo(t, s, r);
  if (t.length === 4) return go(t, s, r);
}
function po(t, s) {
  const r = t.map((c) => [...c]), e = Math.min(s.length, 12);
  for (let c = 0; c < e; c++) s[c] > 1e-12 && (r[c][c] += s[c]);
  return r;
}
function bo(t, s) {
  const r = [];
  if (s.length >= 12) for (let i = 0; i < 12; i++) s[i] && r.push(i);
  else {
    const i = [3, 4, 5, 9, 10, 11];
    for (let h = 0; h < Math.min(s.length, 6); h++) s[h] && r.push(i[h]);
  }
  if (r.length === 0) return t;
  const e = t.length, c = [];
  for (let i = 0; i < e; i++) r.includes(i) || c.push(i);
  const f = c.length, o = r.length, M = Array.from({ length: o }, (i, h) => Array.from({ length: o }, (X, b) => t[r[h]][r[b]])), g = Array.from({ length: f }, (i, h) => Array.from({ length: o }, (X, b) => t[c[h]][r[b]])), a = Array.from({ length: o }, (i, h) => Array.from({ length: f }, (X, b) => t[r[h]][c[b]])), y = mo(M);
  if (!y) return t;
  const x = to(g, y), l = to(x, a), Y = Array.from({ length: e }, () => Array(e).fill(0));
  for (let i = 0; i < f; i++) for (let h = 0; h < f; h++) Y[c[i]][c[h]] = t[c[i]][c[h]] - l[i][h];
  return Y;
}
function to(t, s) {
  const r = t.length, e = s[0].length, c = s.length, f = Array.from({ length: r }, () => Array(e).fill(0));
  for (let o = 0; o < r; o++) for (let M = 0; M < e; M++) for (let g = 0; g < c; g++) f[o][M] += t[o][g] * s[g][M];
  return f;
}
function mo(t) {
  const s = t.length, r = t.map((e, c) => {
    const f = [...e];
    for (let o = 0; o < s; o++) f.push(c === o ? 1 : 0);
    return f;
  });
  for (let e = 0; e < s; e++) {
    let c = e;
    for (let o = e + 1; o < s; o++) Math.abs(r[o][e]) > Math.abs(r[c][e]) && (c = o);
    if ([r[e], r[c]] = [r[c], r[e]], Math.abs(r[e][e]) < 1e-15) return null;
    const f = r[e][e];
    for (let o = 0; o < 2 * s; o++) r[e][o] /= f;
    for (let o = 0; o < s; o++) {
      if (o === e) continue;
      const M = r[o][e];
      for (let g = 0; g < 2 * s; g++) r[o][g] -= M * r[e][g];
    }
  }
  return r.map((e) => e.slice(s));
}
function Ao(t, s) {
  const r = Array.from({ length: 12 }, (e, c) => Array.from({ length: 12 }, (f, o) => c === o ? 1 : 0));
  return Math.abs(t) > 1e-12 && (r[1][5] = t, r[2][4] = -t), Math.abs(s) > 1e-12 && (r[7][11] = -s, r[8][10] = s), r;
}
function Yo(t, s, r) {
  const e = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let f = 0; f < 12; f++) for (let o = 0; o < 12; o++) {
    let M = 0;
    for (let g = 0; g < 12; g++) M += t[g][f] * s[g][o];
    e[f][o] = M;
  }
  const c = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let f = 0; f < 12; f++) for (let o = 0; o < 12; o++) {
    let M = 0;
    for (let g = 0; g < 12; g++) M += e[f][g] * r[g][o];
    c[f][o] = M;
  }
  return c;
}
function wo(t, s, r) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const e = ((_a = s == null ? void 0 : s.momentsOfInertiaZ) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = s == null ? void 0 : s.momentsOfInertiaY) == null ? void 0 : _b.get(r)) ?? 0, f = ((_c = s == null ? void 0 : s.elasticities) == null ? void 0 : _c.get(r)) ?? 0, o = ((_d = s == null ? void 0 : s.areas) == null ? void 0 : _d.get(r)) ?? 0, M = ((_e = s == null ? void 0 : s.shearModuli) == null ? void 0 : _e.get(r)) ?? 0, g = ((_f = s == null ? void 0 : s.torsionalConstants) == null ? void 0 : _f.get(r)) ?? 0, a = Ct(oo(t[0], t[1]));
  if (a < 1e-12) return console.warn(`[hekatan-fem] barra ${r} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({ length: 12 }, () => new Array(12).fill(0));
  const y = (_g = s == null ? void 0 : s.endOffsets) == null ? void 0 : _g.get(r), x = y && y[2] > 0 ? a - y[2] * (y[0] + y[1]) : a;
  if (x <= 1e-9) throw new Error(`end offsets se comen la barra ${r}: L = ${a.toFixed(4)} m, rz = ${y[2]}, offsets ${y[0]} y ${y[1]} -> Lf = ${x.toFixed(4)} m`);
  let l = ((_h = s == null ? void 0 : s.shearAreasY) == null ? void 0 : _h.get(r)) ?? 0, Y = ((_i = s == null ? void 0 : s.shearAreasZ) == null ? void 0 : _i.get(r)) ?? 0;
  l === 0 && Y === 0 && o > 0 && M > 0 && (l = Y = 5 / 6 * o);
  const i = Y > 0 && M > 0 ? 12 * f * e / (M * Y * x ** 2) : 0, h = l > 0 && M > 0 ? 12 * f * c / (M * l * x ** 2) : 0, X = f * o / a, b = M * g / a, _ = 12 * f * e / x ** 3 / (1 + i), J = 6 * f * e / x ** 2 / (1 + i), d = 4 * f * e / x * (1 + i / 4) / (1 + i), u = 2 * f * e / x * (1 - i / 2) / (1 + i), v = 12 * f * c / x ** 3 / (1 + h), Q = 6 * f * c / x ** 2 / (1 + h), Z = 4 * f * c / x * (1 + h / 4) / (1 + h), B = 2 * f * c / x * (1 - h / 2) / (1 + h);
  return [[X, 0, 0, 0, 0, 0, -X, 0, 0, 0, 0, 0], [0, _, 0, 0, 0, J, 0, -_, 0, 0, 0, J], [0, 0, v, 0, -Q, 0, 0, 0, -v, 0, -Q, 0], [0, 0, 0, b, 0, 0, 0, 0, 0, -b, 0, 0], [0, 0, -Q, 0, Z, 0, 0, 0, Q, 0, B, 0], [0, J, 0, 0, 0, d, 0, -J, 0, 0, 0, u], [-X, 0, 0, 0, 0, 0, X, 0, 0, 0, 0, 0], [0, -_, 0, 0, 0, -J, 0, _, 0, 0, 0, -J], [0, 0, -v, 0, Q, 0, 0, 0, v, 0, Q, 0], [0, 0, 0, -b, 0, 0, 0, 0, 0, b, 0, 0], [0, 0, -Q, 0, B, 0, 0, 0, Q, 0, Z, 0], [0, J, 0, 0, 0, u, 0, -J, 0, 0, 0, d]];
}
function Xo(t, s, r) {
  var _a, _b, _c, _d, _e;
  const e = ((_a = s.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = s.elasticitiesOrthogonal) == null ? void 0 : _b.get(r)) ?? 0, f = ((_c = s.poissonsRatios) == null ? void 0 : _c.get(r)) ?? 0, o = ((_d = s.shearModuli) == null ? void 0 : _d.get(r)) ?? 0, M = ((_e = s.thicknesses) == null ? void 0 : _e.get(r)) ?? 0, g = c > 0, a = g ? E(e, c, o, f, M) : V(e, f, M), y = g ? P(o, M) : N(e, f, M), x = g ? co(e, c, o, f) : so(e, f), l = t.map(([L, j]) => [L, j]), Y = l[1][0] - l[0][0], i = l[2][0] - l[0][0], h = l[0][1] - l[1][1], X = l[2][1] - l[0][1], b = 0.5 * (Y * X - i * -h), _ = w(l), J = z(l), d = U(l, x, M), u = et(et(Kt(_), y), _), v = et(et(Kt(J), a), J), Q = ft(18, 18).toArray(), Z = et(Rt(u, v), b), B = [[0, 1, 5], [6, 7, 11], [12, 13, 17]];
  for (let L = 0; L < 3; L++) for (let j = 0; j < 3; j++) for (let $ = 0; $ < 3; $++) {
    const C = B[L][j], H = B[$][j];
    Q[C][H] = d[L * 3 + j][$ * 3 + j];
  }
  for (let L = 0; L < 18; L++) for (let j = 0; j < 18; j++) Q[L][j] = (Q[L][j] ?? 0) + Z.get([L, j]);
  return Q;
  function V(L, j, $) {
    const C = L / (1 - j * j), H = rt([[C, C * j, 0], [C * j, C, 0], [0, 0, C * (1 - j) / 2]]);
    return et($ ** 3 / 12, H);
  }
  function N(L, j, $) {
    const C = 0.8333333333333334, H = L / (2 * (1 + j)), W = C * H * $;
    return rt([[W, 0], [0, W]]);
  }
  function E(L, j, $, C, H) {
    const W = j * C / L, D = 1 - C * W, F = L / D, tt = j / D, st = C * j / D, n = rt([[F, st, 0], [st, tt, 0], [0, 0, $]]);
    return et(H ** 3 / 12, n);
  }
  function P(L, j) {
    const C = 0.8333333333333334 * L * j;
    return rt([[C, 0], [0, C]]);
  }
  function w(L) {
    const j = ft(2, 18).toArray(), [$, C] = L[0], [H, W] = L[1], [D, F] = L[2], tt = 0.5 * ((H - $) * (F - C) - (D - $) * -(C - W)), st = ($ + H + D) / 3, at = (C + W + F) / 3, n = [st, $, H], m = [at, C, W], A = [st, H, D], q = [at, W, F], K = [st, D, $], nt = [at, F, C], I = 1 / 3, [ht, pt, bt, At] = p(n, m), [ct, mt, wt, ut] = p(A, q), [dt, yt, qt, k] = p(K, nt), it = ft(2, 18).toArray(), Yt = ft(2, 18).toArray(), T = ft(2, 18).toArray();
    for (let O = 0; O < 2; O++) for (let R = 0; R < 6; R++) it[O][R] = I * ht[O][R] + pt[O][R], it[O][R + 6] = I * ht[O][R] + bt[O][R], it[O][R + 12] = I * ht[O][R], Yt[O][R] = I * ct[O][R], Yt[O][R + 6] = I * ct[O][R] + mt[O][R], Yt[O][R + 12] = I * ct[O][R] + wt[O][R], T[O][R] = I * dt[O][R] + qt[O][R], T[O][R + 6] = I * dt[O][R], T[O][R + 12] = I * dt[O][R] + yt[O][R];
    for (let O = 0; O < 2; O++) for (let R = 0; R < 18; R++) it[O][R] *= At, Yt[O][R] *= ut, T[O][R] *= k, j[O][R] = (it[O][R] + Yt[O][R] + T[O][R]) / tt;
    return j;
  }
  function p(L, j) {
    const $ = ft(2, 6).toArray(), C = ft(2, 6).toArray(), H = ft(2, 6).toArray(), W = L[1] - L[0], D = L[0] - L[2], F = j[2] - j[0], tt = j[0] - j[1], st = L[2] - L[1], at = j[1] - j[2], n = 0.5 * (W * F - D * tt), m = 0.5 * tt * D, A = 0.5 * F * W, q = 0.5 * W * D, K = 0.5 * tt * F;
    return $[0][2] = 0.5 * st / n, $[0][3] = -0.5, $[1][2] = 0.5 * at / n, $[1][4] = 0.5, C[0][2] = 0.5 * D / n, C[0][3] = 0.5 * m / n, C[0][4] = 0.5 * q / n, C[1][2] = 0.5 * F / n, C[1][3] = 0.5 * K / n, C[1][4] = 0.5 * A / n, H[0][2] = 0.5 * W / n, H[0][3] = -0.5 * A / n, H[0][4] = -0.5 * q / n, H[1][2] = 0.5 * tt / n, H[1][3] = -0.5 * K / n, H[1][4] = -0.5 * m / n, [$, C, H, n];
  }
  function z(L) {
    const j = ft(3, 18).toArray(), [$, C] = L[0], [H, W] = L[1], [D, F] = L[2], tt = H - $, st = D - $, at = D - H, n = W - F, m = F - C, A = C - W, q = 0.5 * (tt * m - st * -A), K = n / (2 * q), nt = at / (2 * q), I = m / (2 * q), ht = -st / (2 * q), pt = A / (2 * q), bt = tt / (2 * q);
    return j[0][4] = K, j[0][10] = I, j[0][16] = pt, j[1][3] = -nt, j[1][9] = -ht, j[1][15] = -bt, j[2][3] = -K, j[2][4] = nt, j[2][9] = -I, j[2][10] = ht, j[2][15] = -pt, j[2][16] = bt, j;
  }
  function U(L, j, $) {
    let C = ft(9, 9).toArray(), H = ft(9, 9).toArray(), W = ft(9, 9).toArray(), D = ft(9, 3).toArray(), F = ft(3, 9).toArray(), tt = ft(3, 3).toArray(), st = ft(3, 3).toArray(), at = ft(3, 3).toArray(), n = ft(3, 3).toArray(), m = ft(3, 3).toArray(), A = ft(3, 3).toArray(), q = ft(3, 3).toArray(), K = ft(3, 3).toArray();
    const nt = 1 / 8, I = nt / 6, ht = nt ** 2 / 4, pt = 1, bt = 2, At = 1, ct = 0, mt = 1, wt = -1, ut = -1, dt = -1, yt = -2, qt = L[0][0], k = L[0][1], it = L[1][0], Yt = L[1][1], T = L[2][0], O = L[2][1], R = qt - it, Nt = it - T, Xt = T - qt, Qt = k - Yt, Lt = Yt - O, Tt = O - k, xt = -R, vt = -Nt, _t = -Xt, St = -Qt, jt = -Lt, S = -Tt, ot = 0.5 * (xt * Tt - Xt * -Qt), gt = 2 * ot, G = 4 * ot, Mt = 0.5 * $, Gt = ot * $, kt = xt ** 2 + St ** 2, Jt = vt ** 2 + jt ** 2, Dt = _t ** 2 + S ** 2;
    D[0][0] = Mt * Lt, D[0][2] = Mt * vt, D[1][1] = Mt * vt, D[1][2] = Mt * Lt, D[2][0] = Mt * Lt * (S - St) * I, D[2][1] = Mt * vt * (Xt - R) * I, D[2][2] = Mt * (Xt * S - R * St) * 2 * I, D[3][0] = Mt * Tt, D[3][2] = Mt * _t, D[4][1] = Mt * _t, D[4][2] = Mt * Tt, D[5][0] = Mt * Tt * (St - jt) * I, D[5][1] = Mt * _t * (R - Nt) * I, D[5][2] = Mt * (R * St - Nt * jt) * 2 * I, D[6][0] = Mt * Qt, D[6][2] = Mt * xt, D[7][1] = Mt * xt, D[7][2] = Mt * Qt, D[8][0] = Mt * Qt * (jt - S) * I, D[8][1] = Mt * xt * (Nt - Xt) * I, D[8][2] = Mt * (Nt * jt - Xt * S) * 2 * I, W = et(et(rt(D), j), Kt(rt(D))).toArray(), W = et(rt(W), 1 / Gt).toArray(), F[0][0] = vt / G, F[0][1] = jt / G, F[0][2] = 1, F[0][3] = _t / G, F[0][4] = S / G, F[0][6] = xt / G, F[0][7] = St / G, F[1][0] = vt / G, F[1][1] = jt / G, F[1][3] = _t / G, F[1][4] = S / G, F[1][5] = 1, F[1][6] = xt / G, F[1][7] = St / G, F[2][0] = vt / G, F[2][1] = jt / G, F[2][3] = _t / G, F[2][4] = S / G, F[2][6] = xt / G, F[2][7] = St / G, F[2][8] = 1;
    const zt = 1 / (ot * G);
    tt[0][0] = zt * Lt * S * kt, tt[0][1] = zt * Tt * St * Jt, tt[0][2] = zt * Qt * jt * Dt, tt[1][0] = zt * Nt * _t * kt, tt[1][1] = zt * Xt * xt * Jt, tt[1][2] = zt * R * vt * Dt, tt[2][0] = zt * (Lt * Xt + vt * S) * kt, tt[2][1] = zt * (Tt * R + _t * St) * Jt, tt[2][2] = zt * (Qt * Nt + xt * jt) * Dt;
    const lt = gt / 3;
    st[0][0] = lt * pt / kt, st[0][1] = lt * bt / kt, st[0][2] = lt * At / kt, st[1][0] = lt * ct / Jt, st[1][1] = lt * mt / Jt, st[1][2] = lt * wt / Jt, st[2][0] = lt * ut / Dt, st[2][1] = lt * dt / Dt, st[2][2] = lt * yt / Dt, at[0][0] = lt * yt / kt, at[0][1] = lt * ut / kt, at[0][2] = lt * dt / kt, at[1][0] = lt * At / Jt, at[1][1] = lt * pt / Jt, at[1][2] = lt * bt / Jt, at[2][0] = lt * wt / Dt, at[2][1] = lt * ct / Dt, at[2][2] = lt * mt / Dt, n[0][0] = lt * mt / kt, n[0][1] = lt * wt / kt, n[0][2] = lt * ct / kt, n[1][0] = lt * dt / Jt, n[1][1] = lt * yt / Jt, n[1][2] = lt * ut / Jt, n[2][0] = lt * bt / Dt, n[2][1] = lt * At / Dt, n[2][2] = lt * pt / Dt, m = et(Rt(rt(st), rt(at)), 0.5).toArray(), A = et(Rt(rt(at), rt(n)), 0.5).toArray(), q = et(Rt(rt(n), rt(st)), 0.5).toArray();
    const Ft = et(et(Kt(rt(tt)), j), rt(tt));
    return K = Rt(Rt(et(et(Kt(rt(m)), Ft), rt(m)), et(et(Kt(rt(A)), Ft), rt(A))), et(et(Kt(rt(q)), Ft), rt(q))).toArray(), K = et(rt(K), 3 / 4 * ht * Gt).toArray(), H = et(et(Kt(rt(F)), rt(K)), rt(F)).toArray(), C = Rt(rt(W), rt(H)).toArray(), C;
  }
}
function so(t, s) {
  const r = t / (1 - s * s);
  return rt([[r, r * s, 0], [r * s, r, 0], [0, 0, r * (1 - s) / 2]]);
}
function co(t, s, r, e) {
  const c = s * e / t, f = 1 - e * c, o = t / f, M = s / f, g = e * s / f;
  return rt([[o, g, 0], [g, M, 0], [0, 0, r]]);
}
function Do(t, s, r, e) {
  const c = { normals: /* @__PURE__ */ new Map(), shearsY: /* @__PURE__ */ new Map(), shearsZ: /* @__PURE__ */ new Map(), torsions: /* @__PURE__ */ new Map(), bendingsY: /* @__PURE__ */ new Map(), bendingsZ: /* @__PURE__ */ new Map(), bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() }, f = /* @__PURE__ */ new Map(), o = { bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() };
  s.forEach((g, a) => {
    var _a, _b, _c, _d;
    const y = g.map((l) => t[l]), x = g.reduce((l, Y) => {
      var _a2;
      const i = (_a2 = e.deformations) == null ? void 0 : _a2.get(Y);
      return l.concat(i ?? [0, 0, 0, 0, 0, 0]);
    }, []);
    if (g.length === 2) {
      const l = It(y, ((_a = r == null ? void 0 : r.localAngles) == null ? void 0 : _a.get(a)) ?? 0), Y = et(l, x), i = uo(y, r, a);
      let h = et(i, Y);
      const X = (_b = r == null ? void 0 : r.frameLoads) == null ? void 0 : _b.get(a);
      if (X && (X[0] || X[1] || X[2])) {
        const b = y[0], _ = y[1], J = [_[0] - b[0], _[1] - b[1], _[2] - b[2]], d = Math.hypot(J[0], J[1], J[2]);
        if (d > 1e-9) {
          const u = [J[0] / d, J[1] / d, J[2] / d], v = d * d / 12, Q = [u[1] * X[2] - u[2] * X[1], u[2] * X[0] - u[0] * X[2], u[0] * X[1] - u[1] * X[0]], Z = [-X[0] * d / 2, -X[1] * d / 2, -X[2] * d / 2, -v * Q[0], -v * Q[1], -v * Q[2], -X[0] * d / 2, -X[1] * d / 2, -X[2] * d / 2, +v * Q[0], +v * Q[1], +v * Q[2]], B = et(l, Z);
          h = h.map((V, N) => V + B[N]);
        }
      }
      c.normals.set(a, [h[0], h[6]]), c.shearsY.set(a, [h[1], h[7]]), c.shearsZ.set(a, [h[2], h[8]]), c.torsions.set(a, [h[3], h[9]]), c.bendingsY.set(a, [h[4], h[10]]), c.bendingsZ.set(a, [h[5], h[11]]);
    } else if (g.length === 4) {
      const l = xo(y, x, r, a);
      o.membraneXX.set(a, l.Nx), o.membraneYY.set(a, l.Ny), o.membraneXY.set(a, l.Nxy), o.bendingXX.set(a, l.Mx), o.bendingYY.set(a, l.My), o.bendingXY.set(a, l.Mxy), l.Mj && f.set(a, l.Mj), o.tranverseShearX.set(a, l.Qx), o.tranverseShearY.set(a, l.Qy), o.vonMises.set(a, l.vonMises);
    } else if (g.length === 3) {
      const l = It(y, ((_c = r == null ? void 0 : r.localAngles) == null ? void 0 : _c.get(a)) ?? 0);
      et(l, x);
      const Y = No(r, a), i = vo(y), h = _o(x), X = So(y), _ = et(1 / (2 * X), et(et(Y, i), h)).toArray(), J = ((_d = r.thicknesses) == null ? void 0 : _d.get(a)) ?? 1, d = _[0][0] * J, u = _[1][0] * J, v = _[2][0] * J, Q = _[0][1] * (J ** 3 / 12), Z = _[1][1] * (J ** 3 / 12), B = _[2][1] * (J ** 3 / 12);
      o.membraneXX.set(a, d), o.membraneYY.set(a, u), o.membraneXY.set(a, v), o.bendingXX.set(a, Q), o.bendingYY.set(a, Z), o.bendingXY.set(a, B);
    }
  });
  const { nodeToCentroidElementIndiciesMap: M } = jo(t, s);
  {
    const g = (x) => {
      var _a;
      return (((_a = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _a.get(x)) ?? 0) === 1;
    }, a = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
    if (s.forEach((x, l) => {
      if (x.length !== 4) return;
      const Y = x.map((i) => t[i]);
      a.set(l, [0, 1, 2].map((i) => Y.reduce((h, X) => h + X[i], 0) / 4)), y.set(l, x);
    }), [...y.keys()].some(g)) {
      const x = /* @__PURE__ */ new Map();
      for (const [l, Y] of y) for (const i of Y) {
        const h = x.get(i) ?? [];
        h.push(l), x.set(i, h);
      }
      for (const [l, Y] of y) {
        if (!g(l)) continue;
        const i = /* @__PURE__ */ new Map();
        for (const u of Y) for (const v of x.get(u) ?? []) v !== l && i.set(v, (i.get(v) ?? 0) + 1);
        const h = [...i].filter(([, u]) => u >= 2).map(([u]) => u);
        if (h.length < 2) continue;
        const X = a.get(l), b = (u) => {
          let v = 0, Q = 0, Z = 0, B = 0, V = 0;
          const N = u.get(l) ?? 0;
          for (const P of h) {
            const w = a.get(P), p = w[0] - X[0], z = w[1] - X[1], U = (u.get(P) ?? 0) - N;
            v += p * p, Q += p * z, Z += z * z, B += p * U, V += z * U;
          }
          const E = v * Z - Q * Q;
          return Math.abs(E) < 1e-12 ? [0, 0] : [(B * Z - V * Q) / E, (v * V - Q * B) / E];
        }, _ = b(o.bendingXX), J = b(o.bendingYY), d = b(o.bendingXY);
        o.tranverseShearX.set(l, _[0] + d[1]), o.tranverseShearY.set(l, J[1] + d[0]);
      }
    }
  }
  return s.forEach((g, a) => {
    if (g.length !== 3 && g.length !== 4) return;
    const y = g.length, x = new Array(y).fill(0), l = new Array(y).fill(0), Y = new Array(y).fill(0), i = new Array(y).fill(0), h = new Array(y).fill(0), X = new Array(y).fill(0), b = new Array(y).fill(0), _ = new Array(y).fill(0), J = new Array(y).fill(0);
    g.forEach((v, Q) => {
      const Z = M.get(v) || [], B = (N) => Vt(Z.map((E) => N.get(E) ?? 0));
      x[Q] = B(o.membraneXX), l[Q] = B(o.membraneYY), Y[Q] = B(o.membraneXY);
      const V = (N, E) => Vt(Z.map((P) => {
        const w = f.get(P), p = w ? s[P].indexOf(v) : -1;
        return w && p >= 0 ? w[p][N] : E.get(P) ?? 0;
      }));
      i[Q] = V(0, o.bendingXX), h[Q] = V(1, o.bendingYY), X[Q] = V(2, o.bendingXY), b[Q] = B(o.tranverseShearX), _[Q] = B(o.tranverseShearY), J[Q] = B(o.vonMises);
    }), c.membraneXX.set(a, x), c.membraneYY.set(a, l), c.membraneXY.set(a, Y), c.bendingXX.set(a, i), c.bendingYY.set(a, h), c.bendingXY.set(a, X);
    const d = f.get(a), u = (v, Q) => d ? d.reduce((Z, B) => Z + B[v], 0) / d.length : Q.get(a) ?? 0;
    (c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(a, u(0, o.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(a, u(1, o.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(a, u(2, o.bendingXY)), d && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(a, d.map((v) => v[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(a, d.map((v) => v[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(a, d.map((v) => v[2]))), c.tranverseShearX.set(a, b), c.tranverseShearY.set(a, _), c.vonMises.set(a, J);
  }), c;
}
function xo(t, s, r, e) {
  var _a, _b, _c, _d;
  const c = ((_a = r.elasticities) == null ? void 0 : _a.get(e)) ?? 0, f = ((_b = r.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, o = ((_c = r.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, M = t[0], g = t[1], a = t[2], y = t[3], x = [g[0] - M[0], g[1] - M[1], g[2] - M[2]], l = [a[0] - y[0], a[1] - y[1], a[2] - y[2]];
  let Y = [x[0] + l[0], x[1] + l[1], x[2] + l[2]], i = Math.sqrt(Y[0] * Y[0] + Y[1] * Y[1] + Y[2] * Y[2]);
  i < 1e-14 && (i = 1);
  let h = [Y[0] / i, Y[1] / i, Y[2] / i];
  const X = [a[0] - M[0], a[1] - M[1], a[2] - M[2]], b = [y[0] - g[0], y[1] - g[1], y[2] - g[2]];
  let _ = [X[1] * b[2] - X[2] * b[1], X[2] * b[0] - X[0] * b[2], X[0] * b[1] - X[1] * b[0]], J = Math.sqrt(_[0] * _[0] + _[1] * _[1] + _[2] * _[2]);
  J < 1e-14 && (J = 1);
  let d = [_[0] / J, _[1] / J, _[2] / J], u = [d[1] * h[2] - d[2] * h[1], d[2] * h[0] - d[0] * h[2], d[0] * h[1] - d[1] * h[0]], v = Math.sqrt(u[0] * u[0] + u[1] * u[1] + u[2] * u[2]);
  v < 1e-14 && (v = 1), u = [u[0] / v, u[1] / v, u[2] / v];
  {
    if (Math.abs(d[2]) > 1 - 1e-6) h = [1, 0, 0];
    else {
      const gt = [-d[1], d[0], 0], G = Math.hypot(gt[0], gt[1], gt[2]) || 1;
      h = [gt[0] / G, gt[1] / G, gt[2] / G];
    }
    u = [d[1] * h[2] - d[2] * h[1], d[2] * h[0] - d[0] * h[2], d[0] * h[1] - d[1] * h[0]];
    const ot = Math.hypot(u[0], u[1], u[2]) || 1;
    u = [u[0] / ot, u[1] / ot, u[2] / ot], h = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
  }
  const Q = 0.25 * (M[0] + g[0] + a[0] + y[0]), Z = 0.25 * (M[1] + g[1] + a[1] + y[1]), B = 0.25 * (M[2] + g[2] + a[2] + y[2]), V = [], N = [];
  for (let S = 0; S < 4; S++) {
    const ot = t[S][0] - Q, gt = t[S][1] - Z, G = t[S][2] - B;
    V.push(ot * h[0] + gt * h[1] + G * h[2]), N.push(ot * u[0] + gt * u[1] + G * u[2]);
  }
  const E = [h, u, d], P = new Array(24).fill(0);
  for (let S = 0; S < 4; S++) {
    const ot = S * 6, gt = S * 6;
    for (let G = 0; G < 3; G++) P[gt + G] = E[G][0] * s[ot] + E[G][1] * s[ot + 1] + E[G][2] * s[ot + 2];
    for (let G = 0; G < 3; G++) P[gt + 3 + G] = E[G][0] * s[ot + 3] + E[G][1] * s[ot + 4] + E[G][2] * s[ot + 5];
  }
  const w = c / (1 - f * f), p = [[w * o, w * f * o, 0], [w * f * o, w * o, 0], [0, 0, w * (1 - f) / 2 * o]], z = o * o * o / 12, U = [[w * z, w * f * z, 0], [w * f * z, w * z, 0], [0, 0, w * (1 - f) / 2 * z]], L = [-0.25, 0.25, 0.25, -0.25], j = [-0.25, -0.25, 0.25, 0.25];
  let $ = 0, C = 0, H = 0, W = 0;
  for (let S = 0; S < 4; S++) $ += L[S] * V[S], C += L[S] * N[S], H += j[S] * V[S], W += j[S] * N[S];
  const D = $ * W - C * H;
  if (Math.abs(D) < 1e-20) return { Nx: 0, Ny: 0, Nxy: 0, Mx: 0, My: 0, Mxy: 0, Qx: 0, Qy: 0, vonMises: 0, Mj: null };
  const F = W / D, tt = -C / D, st = -H / D, at = $ / D, n = [], m = [];
  for (let S = 0; S < 4; S++) n.push(F * L[S] + tt * j[S]), m.push(st * L[S] + at * j[S]);
  let A = 0, q = 0, K = 0;
  for (let S = 0; S < 4; S++) {
    const ot = P[S * 6 + 0], gt = P[S * 6 + 1];
    A += n[S] * ot, q += m[S] * gt, K += m[S] * ot + n[S] * gt;
  }
  const nt = p[0][0] * A + p[0][1] * q, I = p[1][0] * A + p[1][1] * q, ht = p[2][2] * K;
  let pt = 0, bt = 0, At = 0;
  for (let S = 0; S < 4; S++) {
    const ot = P[S * 6 + 3], gt = P[S * 6 + 4];
    pt += n[S] * gt, bt += -m[S] * ot, At += m[S] * gt - n[S] * ot;
  }
  const ct = -1, mt = ct * (U[0][0] * pt + U[0][1] * bt), wt = ct * (U[1][0] * pt + U[1][1] * bt), ut = ct * (U[2][2] * At);
  let dt = null;
  const yt = (((_d = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _d.get(e)) ?? 0) !== 1;
  if (Math.abs(D) > 1e-20) {
    const S = [];
    for (let ot = 0; ot < 4; ot++) S.push(P[ot * 6 + 2], P[ot * 6 + 3], P[ot * 6 + 4]);
    try {
      const ot = globalThis.__hekatanDkqJoints ?? "gauss";
      dt = (yt ? ro(V, N, S, c, f, o) : io(V, N, S, c, f, o, ot)).map((gt) => gt.map((G) => ct * G)), dt.some((gt) => gt.some((G) => !Number.isFinite(G))) && (dt = null);
    } catch {
      dt = null;
    }
  }
  const qt = 5 / 6, k = c / (2 * (1 + f)), it = qt * k * o;
  let Yt = 0, T = 0;
  const O = [0.25, 0.25, 0.25, 0.25];
  for (let S = 0; S < 4; S++) {
    const ot = P[S * 6 + 2], gt = P[S * 6 + 3], G = P[S * 6 + 4];
    Yt += n[S] * ot + O[S] * gt, T += m[S] * ot + O[S] * G;
  }
  const R = it * Yt, Nt = it * T, Xt = nt / o + 6 * mt / (o * o), Qt = I / o + 6 * wt / (o * o), Lt = ht / o + 6 * ut / (o * o), Tt = Math.sqrt(Xt * Xt - Xt * Qt + Qt * Qt + 3 * Lt * Lt), xt = nt / o - 6 * mt / (o * o), vt = I / o - 6 * wt / (o * o), _t = ht / o - 6 * ut / (o * o), St = Math.sqrt(xt * xt - xt * vt + vt * vt + 3 * _t * _t), jt = Math.max(Tt, St);
  return { Nx: nt, Ny: I, Nxy: ht, Mx: mt, My: wt, Mxy: ut, Qx: R, Qy: Nt, vonMises: jt, Mj: dt };
}
function No(t, s) {
  var _a, _b, _c, _d, _e;
  const r = ((_a = t.elasticities) == null ? void 0 : _a.get(s)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(s)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(s)) ?? 0, f = ((_d = t.shearModuli) == null ? void 0 : _d.get(s)) ?? 0;
  return (_e = t.thicknesses) == null ? void 0 : _e.get(s), e > 0 ? co(r, e, f, c) : so(r, c);
}
function vo(t) {
  const [s, r] = t[0], [e, c] = t[1], [f, o] = t[2], M = c - o, g = o - r, a = r - c, y = f - e, x = s - f, l = e - s;
  return rt([[M, g, a, 0, 0, 0], [0, 0, 0, y, x, l], [y, x, l, M, g, a]]);
}
function _o(t) {
  const [s, r, e] = [t[0], t[6], t[12]], [c, f, o] = [t[1], t[7], t[13]], [M, g, a] = [t[4], t[10], t[16]], [y, x, l] = [t[3], t[9], t[15]];
  return rt([[s, -M], [r, -g], [e, -a], [c, y], [f, x], [o, l]]);
}
function So(t) {
  const [s, r] = t[0], [e, c] = t[1], [f, o] = t[2], M = e - s, g = f - s, a = o - r, y = r - c;
  return 0.5 * (M * a - g * -y);
}
function jo(t, s) {
  const r = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  return s.forEach((c, f) => {
    const o = c.map((g) => t[g]), M = ko(o);
    c.forEach((g) => {
      var _a, _b;
      r.has(g) || r.set(g, []), (_a = r.get(g)) == null ? void 0 : _a.push(M), e.has(g) || e.set(g, []), (_b = e.get(g)) == null ? void 0 : _b.push(f);
    });
  }), { nodeToCentroidNodesMap: r, nodeToCentroidElementIndiciesMap: e };
}
function ko(t) {
  const s = t.reduce((c, f) => c + f[0], 0) / t.length, r = t.reduce((c, f) => c + f[1], 0) / t.length, e = t.reduce((c, f) => c + f[2], 0) / t.length;
  return [s, r, e];
}
export {
  Do as a,
  It as b,
  uo as g
};
