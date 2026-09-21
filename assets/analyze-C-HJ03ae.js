import { s as nn, n as Ct, b as Pt, k as Ht, i as Gt, z as at, c as Vt, m as ct, t as Ot, a as Kt, e as rt, f as Et } from "./pureFunctionsAny.generated-DeJSBP3k.js";
function cn(t, n, c, e, r, i) {
  const s = e * i * i * i / (12 * (1 - r * r)), a = [[s, s * r, 0], [s * r, s, 0], [0, 0, s * (1 - r) / 2]], u = (g, h) => {
    const f = [-0.25 * (1 - h), 0.25 * (1 - h), 0.25 * (1 + h), -0.25 * (1 + h)], m = [-0.25 * (1 - g), -0.25 * (1 + g), 0.25 * (1 + g), 0.25 * (1 - g)];
    let _ = 0, y = 0, S = 0, B = 0;
    for (let q = 0; q < 4; q++) _ += f[q] * t[q], y += f[q] * n[q], S += m[q] * t[q], B += m[q] * n[q];
    const N = _ * B - y * S, p = B / N, k = -y / N, L = -S / N, O = _ / N;
    let j = 0, z = 0, Y = 0;
    for (let q = 0; q < 4; q++) {
      const w = p * f[q] + k * m[q], M = L * f[q] + O * m[q], Q = c[3 * q + 1], C = c[3 * q + 2];
      j += w * C, z += -M * Q, Y += M * C - w * Q;
    }
    const P = [j, z, Y];
    return [0, 1, 2].map((q) => a[q][0] * P[0] + a[q][1] * P[1] + a[q][2] * P[2]);
  }, d = [[-1, -1], [1, -1], [1, 1], [-1, 1]], o = 1 / Math.sqrt(3), X = d.map(([g, h]) => u(g * o, h * o));
  return d.map(([g, h]) => {
    const f = g * Math.sqrt(3), m = h * Math.sqrt(3), _ = d.map(([y, S]) => (1 + y * f) * (1 + S * m) / 4);
    return [0, 1, 2].map((y) => _.reduce((S, B, N) => S + B * X[N][y], 0));
  });
}
function en(t, n) {
  const c = new Array(8).fill(0), e = new Array(8).fill(0), r = new Array(8).fill(0), i = [-1, 1, 1, -1], s = [-1, -1, 1, 1];
  for (let a = 0; a < 4; a++) {
    const u = i[a] * t, d = s[a] * n;
    c[a] = 0.25 * (1 + u) * (1 + d) * (u + d - 1), e[a] = 0.25 * i[a] * (1 + d) * (2 * u + d), r[a] = 0.25 * s[a] * (1 + u) * (u + 2 * d);
  }
  return c[4] = 0.5 * (1 - t * t) * (1 - n), e[4] = -t * (1 - n), r[4] = -0.5 * (1 - t * t), c[5] = 0.5 * (1 + t) * (1 - n * n), e[5] = 0.5 * (1 - n * n), r[5] = -n * (1 + t), c[6] = 0.5 * (1 - t * t) * (1 + n), e[6] = -t * (1 + n), r[6] = 0.5 * (1 - t * t), c[7] = 0.5 * (1 - t) * (1 - n * n), e[7] = -0.5 * (1 - n * n), r[7] = -n * (1 - t), { N: c, dNxi: e, dNet: r };
}
function an(t, n, c, e) {
  const r = [], i = [], s = [], a = [], u = [];
  for (let Y = 0; Y < 4; Y++) {
    const P = Y, q = (Y + 1) % 4, w = t[P] - t[q], M = n[P] - n[q], Q = w * w + M * M;
    r.push(-w / Q), i.push(0.75 * w * M / Q), s.push((0.25 * w * w - 0.5 * M * M) / Q), a.push(-M / Q), u.push((0.25 * M * M - 0.5 * w * w) / Q);
  }
  const { dNxi: d, dNet: o } = en(c, e), X = [-(1 - e) / 4, (1 - e) / 4, (1 + e) / 4, -(1 + e) / 4], g = [-(1 - c) / 4, -(1 + c) / 4, (1 + c) / 4, (1 - c) / 4];
  let h = 0, f = 0, m = 0, _ = 0;
  for (let Y = 0; Y < 4; Y++) h += X[Y] * t[Y], f += X[Y] * n[Y], m += g[Y] * t[Y], _ += g[Y] * n[Y];
  const y = h * _ - f * m, S = _ / y, B = -f / y, N = -m / y, p = h / y, k = new Array(12).fill(0), L = new Array(12).fill(0), O = new Array(12).fill(0), j = new Array(12).fill(0);
  for (let Y = 0; Y < 4; Y++) {
    const P = (Y + 3) % 4, q = Y, w = 4 + P, M = 4 + q, Q = 1.5 * (r[q] * d[M] - r[P] * d[w]), C = 1.5 * (r[q] * o[M] - r[P] * o[w]), D = i[q] * d[M] + i[P] * d[w], x = i[q] * o[M] + i[P] * o[w], U = d[Y] - s[q] * d[M] - s[P] * d[w], E = o[Y] - s[q] * o[M] - s[P] * o[w];
    k[3 * Y] = Q, L[3 * Y] = C, k[3 * Y + 1] = D, L[3 * Y + 1] = x, k[3 * Y + 2] = U, L[3 * Y + 2] = E;
    const I = 1.5 * (a[q] * d[M] - a[P] * d[w]), nt = 1.5 * (a[q] * o[M] - a[P] * o[w]), l = -d[Y] + u[q] * d[M] + u[P] * d[w], b = -o[Y] + u[q] * o[M] + u[P] * o[w];
    O[3 * Y] = I, j[3 * Y] = nt, O[3 * Y + 1] = l, j[3 * Y + 1] = b, O[3 * Y + 2] = -D, j[3 * Y + 2] = -x;
  }
  const z = [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
  for (let Y = 0; Y < 12; Y++) {
    const P = S * k[Y] + B * L[Y], q = N * k[Y] + p * L[Y], w = S * O[Y] + B * j[Y], M = N * O[Y] + p * j[Y];
    z[0][Y] = P, z[1][Y] = M, z[2][Y] = q + w;
  }
  return z;
}
function fn(t, n, c, e, r, i, s = "esquinas") {
  const a = e * i * i * i / (12 * (1 - r * r)), u = [[a, a * r, 0], [a * r, a, 0], [0, 0, a * (1 - r) / 2]], d = (h, f) => {
    const m = an(t, n, h, f), _ = [0, 1, 2].map((y) => m[y].reduce((S, B, N) => S + B * c[N], 0));
    return [0, 1, 2].map((y) => u[y][0] * _[0] + u[y][1] * _[1] + u[y][2] * _[2]);
  }, o = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (s === "esquinas") return o.map(([h, f]) => d(h, f));
  const X = 1 / Math.sqrt(3), g = o.map(([h, f]) => d(h * X, f * X));
  return o.map(([h, f]) => {
    const m = h * Math.sqrt(3), _ = f * Math.sqrt(3), y = o.map(([S, B]) => (1 + S * m) * (1 + B * _) / 4);
    return [0, 1, 2].map((S) => y.reduce((B, N, p) => B + N * g[p][S], 0));
  });
}
function ln(t, n) {
  return { N: [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], dNxi: [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], dNeta: [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)] };
}
function gn(t, n, c, e) {
  let r = 0, i = 0, s = 0, a = 0;
  for (let o = 0; o < 4; o++) r += c[o] * t[o], i += c[o] * n[o], s += e[o] * t[o], a += e[o] * n[o];
  let u = r * a - i * s;
  Math.abs(u) < 1e-15 && (u = 1e-15);
  const d = 1 / u;
  return { det: u, Ji: [[a * d, -i * d], [-s * d, r * d]] };
}
function hn(t, n, c, e, r, i, s = {}) {
  const a = s.tipo ?? 13, u = s.gammaFac ?? 0.4, d = s.mod ?? null;
  let o, X, g;
  if (a === 8) o = 3, X = true, g = 0;
  else if (a === 3) o = 3, X = false, g = 0;
  else if (a === 6) o = 2, X = false, g = 2e-4;
  else if (a === 13) o = 2, X = true, g = 2e-4;
  else return null;
  const h = e / (1 - r * r), f = [[h, h * r, 0], [h * r, h, 0], [0, 0, h * (1 - r) / 2]];
  if (d) {
    const l = d[0], b = d[1], T = d[2];
    f[0][0] *= l, f[1][1] *= b, f[2][2] *= T;
    const J = Math.sqrt(Math.max(0, l * b));
    f[0][1] *= J, f[1][0] *= J;
  }
  for (const l of f) for (let b = 0; b < 3; b++) l[b] *= i;
  const m = [1, 2, 3, 0], _ = [3, 0, 1, 2], y = [], S = [];
  for (let l = 0; l < 4; l++) y.push((n[m[l]] - n[l]) / 8), S.push(-(t[m[l]] - t[l]) / 8);
  const B = 0.5773502691896258, N = [-0.7745966692414834, 0, 0.7745966692414834], p = [5 / 9, 8 / 9, 5 / 9], k = o === 2 ? [-B, B] : N, L = o === 2 ? [1, 1] : p, O = [];
  for (let l = 0; l < o; l++) for (let b = 0; b < o; b++) O.push({ r: k[l], s: k[b], w: L[l] * L[b] });
  const j = (l, b) => {
    const { N: T, dNxi: J, dNeta: v } = ln(l, b), { det: A, Ji: K } = gn(t, n, J, v), st = [], $ = [];
    for (let G = 0; G < 4; G++) st.push(K[0][0] * J[G] + K[0][1] * v[G]), $.push(K[1][0] * J[G] + K[1][1] * v[G]);
    const et = [-l * (1 - b), 0.5 * (1 - b * b), -l * (1 + b), -0.5 * (1 - b * b)], Mt = [-0.5 * (1 - l * l), -b * (1 + l), 0.5 * (1 - l * l), -b * (1 - l)], tt = [], ft = [];
    for (let G = 0; G < 4; G++) tt.push(K[0][0] * et[G] + K[0][1] * Mt[G]), ft.push(K[1][0] * et[G] + K[1][1] * Mt[G]);
    const ut = -2 * l * (1 - b * b), yt = -2 * b * (1 - l * l), Yt = K[0][0] * ut + K[0][1] * yt, pt = K[1][0] * ut + K[1][1] * yt, wt = [], bt = [], dt = [], gt = [];
    for (let G = 0; G < 4; G++) {
      const mt = _[G];
      wt.push(tt[mt] * y[mt] - tt[G] * y[G]), bt.push(ft[mt] * y[mt] - ft[G] * y[G]), dt.push(tt[mt] * S[mt] - tt[G] * S[G]), gt.push(ft[mt] * S[mt] - ft[G] * S[G]);
    }
    return { N: T, dNx: st, dNy: $, dNBx: Yt, dNBy: pt, gt1: wt, gt2: bt, gt3: dt, gt4: gt, dJ: Math.abs(A) };
  }, z = [0, 0, 0, 0], Y = [0, 0, 0, 0], P = [0, 0, 0, 0];
  if (X) {
    let l = 0;
    for (const b of O) {
      const T = j(b.r, b.s), J = b.w * T.dJ;
      for (let v = 0; v < 4; v++) z[v] += T.gt1[v] * J, Y[v] += T.gt4[v] * J, P[v] += (T.gt2[v] + T.gt3[v]) * J;
      l += J;
    }
    for (let b = 0; b < 4; b++) z[b] /= l, Y[b] /= l, P[b] /= l;
  }
  const q = (l, b) => {
    const T = j(l, b), J = [new Array(14).fill(0), new Array(14).fill(0), new Array(14).fill(0)];
    for (let v = 0; v < 4; v++) J[0][3 * v] = T.dNx[v], J[1][3 * v + 1] = T.dNy[v], J[2][3 * v] = T.dNy[v], J[2][3 * v + 1] = T.dNx[v], J[0][3 * v + 2] = T.gt1[v] - z[v], J[1][3 * v + 2] = T.gt4[v] - Y[v], J[2][3 * v + 2] = T.gt2[v] + T.gt3[v] - P[v];
    return J[0][12] = T.dNBx, J[2][12] = T.dNBy, J[1][13] = T.dNBy, J[2][13] = T.dNBx, { B: J, d: T };
  }, w = Array.from({ length: 14 }, () => new Array(14).fill(0));
  for (const l of O) {
    const { B: b, d: T } = q(l.r, l.s), J = l.w * T.dJ, v = [0, 1, 2].map((A) => b[0].map((K, st) => f[A][0] * b[0][st] + f[A][1] * b[1][st] + f[A][2] * b[2][st]));
    for (let A = 0; A < 14; A++) for (let K = 0; K < 14; K++) w[A][K] += (b[0][A] * v[0][K] + b[1][A] * v[1][K] + b[2][A] * v[2][K]) * J;
  }
  {
    const l = j(0, 0), b = e / (2 * (1 + r)), T = u * b, J = new Array(14).fill(0);
    for (let A = 0; A < 4; A++) J[3 * A] = -0.5 * l.dNy[A], J[3 * A + 1] = 0.5 * l.dNx[A], J[3 * A + 2] = 0.5 * (l.gt3[A] - l.gt2[A]) - l.N[A];
    J[12] = 0, J[13] = 0;
    const v = T * i * 4 * l.dJ;
    for (let A = 0; A < 14; A++) for (let K = 0; K < 14; K++) w[A][K] += v * J[A] * J[K];
    if (g > 0) {
      let A = 0;
      for (let $ = 0; $ < 4; $++) {
        const et = ($ + 1) % 4;
        A += t[$] * n[et] - t[et] * n[$];
      }
      A = Math.abs(A) / 2;
      const K = new Array(14).fill(0);
      for (let $ = 0; $ < 4; $++) K[3 * $ + 2] = $ % 2 === 0 ? 1 : -1;
      const st = g * b * i * A / 4;
      for (let $ = 0; $ < 14; $++) for (let et = 0; et < 14; et++) w[$][et] += st * K[$] * K[et];
    }
  }
  const M = [...c, 0, 0], Q = [[w[12][12], w[12][13]], [w[13][12], w[13][13]]], C = Q[0][0] * Q[1][1] - Q[0][1] * Q[1][0];
  if (Math.abs(C) > 1e-30) {
    const l = w[12].slice(0, 12).reduce((T, J, v) => T + J * c[v], 0), b = w[13].slice(0, 12).reduce((T, J, v) => T + J * c[v], 0);
    M[12] = -(Q[1][1] * l - Q[0][1] * b) / C, M[13] = -(-Q[1][0] * l + Q[0][0] * b) / C;
  }
  const D = globalThis.__hekatanItwRec ?? "", x = M.slice();
  if (D.includes("conBurbuja") || (x[12] = 0, x[13] = 0), D.includes("sinTheta")) for (let l = 0; l < 4; l++) x[3 * l + 2] = 0;
  const U = (l, b) => {
    const { B: T, d: J } = q(l, b);
    if (D.includes("sinProy")) for (let A = 0; A < 4; A++) T[0][3 * A + 2] = J.gt1[A], T[1][3 * A + 2] = J.gt4[A], T[2][3 * A + 2] = J.gt2[A] + J.gt3[A];
    const v = [0, 1, 2].map((A) => T[A].reduce((K, st, $) => K + st * x[$], 0));
    return [0, 1, 2].map((A) => f[A][0] * v[0] + f[A][1] * v[1] + f[A][2] * v[2]);
  }, E = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (D.includes("esquinas")) return E.map(([l, b]) => U(l, b));
  const I = B, nt = E.map(([l, b]) => U(l * I, b * I));
  return E.map(([l, b]) => {
    const T = l / I, J = b / I, v = E.map(([A, K]) => (1 + A * T) * (1 + K * J) / 4);
    return [0, 1, 2].map((A) => v.reduce((K, st, $) => K + st * nt[$][A], 0));
  });
}
const zt = 1 / Math.sqrt(3);
function $t(t, n) {
  const c = [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], e = [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], r = [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)];
  return { N: c, dNdxi: e, dNdeta: r };
}
function Wt(t, n, c, e) {
  let r = 0, i = 0, s = 0, a = 0;
  for (let g = 0; g < 4; g++) r += t[g] * c[g], i += t[g] * e[g], s += n[g] * c[g], a += n[g] * e[g];
  const u = r * a - i * s, d = 1 / u, o = [], X = [];
  for (let g = 0; g < 4; g++) o.push(d * (a * t[g] - i * n[g])), X.push(d * (-s * t[g] + r * n[g]));
  return { dNdx: o, dNdy: X, detJ: u, J: [r, i, s, a] };
}
function un(t, n, c, e, r, i) {
  const s = c * r / (1 - e * e), a = [[s, s * e, 0], [s * e, s, 0], [0, 0, s * (1 - e) / 2]], u = [1, 2, 3, 0], d = [3, 0, 1, 2], o = [], X = [];
  for (let w = 0; w < 4; w++) o.push((n[u[w]] - n[w]) / 8), X.push(-(t[u[w]] - t[w]) / 8);
  const g = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)], h = [5 / 9, 8 / 9, 5 / 9], f = Dt(14, 14);
  let m = [], _ = [], y = [], S = [], B = [], N = 0, p = 0, k = 0;
  for (let w = 0; w < 3; w++) for (let M = 0; M < 3; M++) {
    const Q = g[w], C = g[M], D = h[w] * h[M], { N: x, dNdxi: U, dNdeta: E } = $t(Q, C);
    let I = 0, nt = 0, l = 0, b = 0;
    for (let R = 0; R < 4; R++) I += U[R] * t[R], nt += U[R] * n[R], l += E[R] * t[R], b += E[R] * n[R];
    const T = I * b - nt * l, J = b / T, v = -nt / T, A = -l / T, K = I / T, st = [], $ = [];
    for (let R = 0; R < 4; R++) st.push(J * U[R] + v * E[R]), $.push(A * U[R] + K * E[R]);
    const et = [-Q * (1 - C), 0.5 * (1 - C * C), -Q * (1 + C), -0.5 * (1 - C * C)], Mt = [-0.5 * (1 - Q * Q), -C * (1 + Q), 0.5 * (1 - Q * Q), -C * (1 - Q)], tt = [], ft = [];
    for (let R = 0; R < 4; R++) tt.push(J * et[R] + v * Mt[R]), ft.push(A * et[R] + K * Mt[R]);
    const ut = -2 * Q * (1 - C * C), yt = -2 * C * (1 - Q * Q), Yt = J * ut + v * yt, pt = A * ut + K * yt, wt = [], bt = [], dt = [], gt = [];
    for (let R = 0; R < 4; R++) {
      const lt = d[R];
      wt.push(tt[lt] * o[lt] - tt[R] * o[R]), bt.push(ft[lt] * o[lt] - ft[R] * o[R]), dt.push(tt[lt] * X[lt] - tt[R] * X[R]), gt.push(ft[lt] * X[lt] - ft[R] * X[R]);
    }
    const G = Dt(3, 14);
    for (let R = 0; R < 4; R++) G[0][3 * R] = st[R], G[1][3 * R + 1] = $[R], G[2][3 * R] = $[R], G[2][3 * R + 1] = st[R], G[0][3 * R + 2] = wt[R], G[1][3 * R + 2] = gt[R], G[2][3 * R + 2] = bt[R] + dt[R];
    G[0][12] = Yt, G[2][12] = pt, G[1][13] = pt, G[2][13] = Yt;
    const mt = D * Math.abs(T);
    for (let R = 0; R < 14; R++) for (let lt = 0; lt < 14; lt++) {
      let Xt = 0;
      for (let At = 0; At < 3; At++) for (let H = 0; H < 3; H++) Xt += G[At][R] * a[At][H] * G[H][lt];
      f[R][lt] += mt * Xt;
    }
    w === 1 && M === 1 && (m = x.slice(), _ = st.slice(), y = $.slice(), S = bt.slice(), B = dt.slice(), N = Yt, p = pt, k = Math.abs(T));
  }
  const L = c / (2 * (1 + e)), O = new Array(14).fill(0);
  for (let w = 0; w < 4; w++) O[3 * w] = -0.5 * y[w], O[3 * w + 1] = 0.5 * _[w], O[3 * w + 2] = 0.5 * (B[w] - S[w]) - m[w];
  O[12] = -0.5 * p, O[13] = 0.5 * N;
  const j = i * L * r * 4 * k;
  for (let w = 0; w < 14; w++) for (let M = 0; M < 14; M++) f[w][M] += j * O[w] * O[M];
  const z = [[f[12][12], f[12][13]], [f[13][12], f[13][13]]], Y = z[0][0] * z[1][1] - z[0][1] * z[1][0], P = Dt(12, 12);
  for (let w = 0; w < 12; w++) for (let M = 0; M < 12; M++) P[w][M] = f[w][M];
  if (Math.abs(Y) < 1e-30) return P;
  const q = [[z[1][1] / Y, -z[0][1] / Y], [-z[1][0] / Y, z[0][0] / Y]];
  for (let w = 0; w < 12; w++) for (let M = 0; M < 12; M++) {
    let Q = 0;
    for (let C = 0; C < 2; C++) for (let D = 0; D < 2; D++) Q += f[w][12 + C] * q[C][D] * f[12 + D][M];
    P[w][M] -= Q;
  }
  return P;
}
function yn(t, n, c, e, r) {
  const i = Dt(12, 12), s = c * r * r * r / (12 * (1 - e * e)), u = 5 / 6 * c / (2 * (1 + e)) * r, d = [[-zt, -zt], [zt, -zt], [zt, zt], [-zt, zt]], o = [{ xi: 0, eta: -1 }, { xi: 0, eta: 1 }, { xi: -1, eta: 0 }, { xi: 1, eta: 0 }], X = [];
  for (const g of o) {
    const { N: h, dNdxi: f, dNdeta: m } = $t(g.xi, g.eta), { dNdx: _, dNdy: y, J: S } = Wt(f, m, t, n), B = Dt(2, 12);
    for (let j = 0; j < 4; j++) B[0][j * 3] = _[j], B[0][j * 3 + 1] = -h[j], B[1][j * 3] = y[j], B[1][j * 3 + 2] = -h[j];
    const [N, p, k, L] = S, O = Dt(2, 12);
    for (let j = 0; j < 12; j++) O[0][j] = N * B[0][j] + p * B[1][j], O[1][j] = k * B[0][j] + L * B[1][j];
    X.push(O);
  }
  for (const [g, h] of d) {
    const { dNdxi: f, dNdeta: m } = $t(g, h), { dNdx: _, dNdy: y, detJ: S, J: B } = Wt(f, m, t, n), N = Dt(3, 12);
    for (let M = 0; M < 4; M++) N[0][M * 3 + 1] = _[M], N[1][M * 3 + 2] = y[M], N[2][M * 3 + 1] = y[M], N[2][M * 3 + 2] = _[M];
    for (let M = 0; M < 12; M++) for (let Q = 0; Q < 12; Q++) {
      let C = 0;
      C += s * (N[0][M] * N[0][Q] + e * N[0][M] * N[1][Q] + e * N[1][M] * N[0][Q] + N[1][M] * N[1][Q]), C += s * (1 - e) / 2 * N[2][M] * N[2][Q], i[M][Q] += C * Math.abs(S);
    }
    const p = Dt(2, 12), k = 0.5 * (1 - h), L = 0.5 * (1 + h), O = 0.5 * (1 - g), j = 0.5 * (1 + g), [z, Y, P, q] = B, w = 1 / S;
    for (let M = 0; M < 12; M++) {
      const Q = k * X[0][0][M] + L * X[1][0][M], C = O * X[2][1][M] + j * X[3][1][M];
      p[0][M] = w * (q * Q - Y * C), p[1][M] = w * (-P * Q + z * C);
    }
    for (let M = 0; M < 12; M++) for (let Q = 0; Q < 12; Q++) i[M][Q] += u * (p[0][M] * p[0][Q] + p[1][M] * p[1][Q]) * Math.abs(S);
  }
  return i;
}
function pn(t, n, c) {
  var _a, _b, _c;
  const e = ((_a = n == null ? void 0 : n.elasticities) == null ? void 0 : _a.get(c)) ?? 0, r = ((_b = n == null ? void 0 : n.poissonsRatios) == null ? void 0 : _b.get(c)) ?? 0.2, i = ((_c = n == null ? void 0 : n.thicknesses) == null ? void 0 : _c.get(c)) ?? 0;
  if (e === 0 || i === 0) return Dt(24, 24);
  const { localCoords: s } = on(t), a = s.map((y) => y[0]), u = s.map((y) => y[1]), d = yn(a, u, e, r, i), X = un(a, u, e, r, i, 0.4), g = Dt(24, 24), h = [2, 3, 4, 8, 9, 10, 14, 15, 16, 20, 21, 22], f = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], m = Dt(12, 12);
  for (let y = 0; y < 12; y++) for (let S = 0; S < 12; S++) {
    let B = 0;
    const N = y / 3 | 0, p = y % 3, k = S / 3 | 0, L = S % 3;
    for (let O = 0; O < 3; O++) {
      const j = f[O][p];
      if (j !== 0) for (let z = 0; z < 3; z++) {
        const Y = f[z][L];
        Y !== 0 && (B += j * d[N * 3 + O][k * 3 + z] * Y);
      }
    }
    m[y][S] = B;
  }
  for (let y = 0; y < 12; y++) for (let S = 0; S < 12; S++) g[h[y]][h[S]] += m[y][S];
  const _ = [0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23];
  for (let y = 0; y < 12; y++) for (let S = 0; S < 12; S++) g[_[y]][_[S]] += X[y][S];
  return g;
}
function Mn(t) {
  const { localX: n, localY: c, localZ: e } = on(t), r = [[n[0], n[1], n[2]], [c[0], c[1], c[2]], [e[0], e[1], e[2]]], i = Dt(24, 24);
  for (let s = 0; s < 4; s++) for (let a = 0; a < 2; a++) {
    const u = s * 6 + a * 3;
    for (let d = 0; d < 3; d++) for (let o = 0; o < 3; o++) i[u + d][u + o] = r[d][o];
  }
  return i;
}
function on(t) {
  const n = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]], c = [t[3][0] - t[1][0], t[3][1] - t[1][1], t[3][2] - t[1][2]], e = Ut(n, c), r = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((f) => f / r), s = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], a = Math.sqrt(s[0] ** 2 + s[1] ** 2 + s[2] ** 2), u = s.map((f) => f / a), d = Ut(i, u), o = t.map((f) => f[0]).reduce((f, m) => f + m) / 4, X = t.map((f) => f[1]).reduce((f, m) => f + m) / 4, g = t.map((f) => f[2]).reduce((f, m) => f + m) / 4, h = t.map((f) => {
    const m = f[0] - o, _ = f[1] - X, y = f[2] - g;
    return [m * u[0] + _ * u[1] + y * u[2], m * d[0] + _ * d[1] + y * d[2]];
  });
  return { localX: u, localY: d, localZ: i, localCoords: h };
}
function Ut(t, n) {
  return [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
}
function Dt(t, n) {
  return Array.from({ length: t }, () => Array(n).fill(0));
}
function It(t, n = 0) {
  if (t.length === 2) return mn(t, n);
  if (t.length === 3) return bn(t);
  if (t.length === 4) return Mn(t);
}
function mn(t, n = 0) {
  const c = (o) => {
    if (Math.abs(n) < 1e-12) return o;
    const X = n * Math.PI / 180, g = Math.cos(X), h = Math.sin(X);
    return [o[0], [g * o[1][0] + h * o[2][0], g * o[1][1] + h * o[2][1], g * o[1][2] + h * o[2][2]], [-h * o[1][0] + g * o[2][0], -h * o[1][1] + g * o[2][1], -h * o[1][2] + g * o[2][2]]];
  }, e = nn(t[1], t[0]), r = Ct(e), i = Pt(e, [1, 0, 0]) / r, s = Pt(e, [0, 1, 0]) / r, a = Pt(e, [0, 0, 1]) / r, u = Math.sqrt(i ** 2 + s ** 2);
  if (u < 1e-9) {
    const o = a > 0 ? 1 : -1, X = [[0, 0, o], [1, 0, 0], [0, o, 0]];
    return Ht(Gt(4), c(X)).toArray();
  }
  const d = [[i, s, a], [-i * a / u, -s * a / u, u], [s / u, -i / u, 0]];
  return Ht(Gt(4), c(d)).toArray();
}
function bn(t) {
  const i = [t[0], t[1], t[2]], s = at(3, 3).toArray();
  for (let p = 0; p < 3; p++) for (let k = 0; k < 3; k++) s[p][k] = i[k][p];
  const a = [-1, 1, 0], u = [-1, 0, 1], d = at(3, 2).toArray();
  for (let p = 0; p < 3; p++) for (let k = 0; k < 3; k++) d[p][0] += s[p][k] * a[k], d[p][1] += s[p][k] * u[k];
  const o = d.map((p) => p[0]), X = d.map((p) => p[1]);
  let g = Vt(o, X), h = Ct(g);
  if (h === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), at(18, 18).toArray();
  g = g.map((p) => p / h);
  const f = [...g], m = Gt(3).toArray(), _ = g[0];
  let y;
  if (Math.abs(_) > 1 - 1e-10) {
    const p = g[2];
    y = m.map((k, L) => k[2] - p * g[L]);
  } else y = m.map((p, k) => p[0] - _ * g[k]);
  if (h = Ct(y), h === 0) return console.warn("Degenerate local X-axis detected."), at(18, 18).toArray();
  y = y.map((p) => p / h);
  let S = Vt(f, y);
  if (h = Ct(S), h === 0) return console.warn("Degenerate local Y-axis detected."), at(18, 18).toArray();
  S = S.map((p) => p / h);
  const B = [y, S, f], N = at(18, 18).toArray();
  for (let p = 0; p < 3; p++) {
    const k = p * 6, L = k + 3;
    for (let O = 0; O < 3; O++) for (let j = 0; j < 3; j++) N[k + O][k + j] = B[O][j], N[L + O][L + j] = B[O][j];
  }
  return N;
}
function dn(t, n, c) {
  var _a, _b, _c;
  if (t.length === 2) {
    let e = Sn(t, n, c);
    const r = (_a = n == null ? void 0 : n.partialFixitySprings) == null ? void 0 : _a.get(c);
    r && (e = An(e, r));
    const i = (_b = n == null ? void 0 : n.momentReleases) == null ? void 0 : _b.get(c);
    i && (e = wn(e, i));
    const s = (_c = n == null ? void 0 : n.endOffsets) == null ? void 0 : _c.get(c);
    if (s && s[2] > 0 && (s[0] > 0 || s[1] > 0)) {
      const a = Xn(s[2] * s[0], s[2] * s[1]);
      e = Nn(a, e, a);
    }
    return e;
  }
  if (t.length === 3) return jn(t, n, c);
  if (t.length === 4) return pn(t, n, c);
}
function An(t, n) {
  const c = t.map((r) => [...r]), e = Math.min(n.length, 12);
  for (let r = 0; r < e; r++) n[r] > 1e-12 && (c[r][r] += n[r]);
  return c;
}
function wn(t, n) {
  const c = [];
  if (n.length >= 12) for (let f = 0; f < 12; f++) n[f] && c.push(f);
  else {
    const f = [3, 4, 5, 9, 10, 11];
    for (let m = 0; m < Math.min(n.length, 6); m++) n[m] && c.push(f[m]);
  }
  if (c.length === 0) return t;
  const e = t.length, r = [];
  for (let f = 0; f < e; f++) c.includes(f) || r.push(f);
  const i = r.length, s = c.length, a = Array.from({ length: s }, (f, m) => Array.from({ length: s }, (_, y) => t[c[m]][c[y]])), u = Array.from({ length: i }, (f, m) => Array.from({ length: s }, (_, y) => t[r[m]][c[y]])), d = Array.from({ length: s }, (f, m) => Array.from({ length: i }, (_, y) => t[c[m]][r[y]])), o = Yn(a);
  if (!o) return t;
  const X = tn(u, o), g = tn(X, d), h = Array.from({ length: e }, () => Array(e).fill(0));
  for (let f = 0; f < i; f++) for (let m = 0; m < i; m++) h[r[f]][r[m]] = t[r[f]][r[m]] - g[f][m];
  return h;
}
function tn(t, n) {
  const c = t.length, e = n[0].length, r = n.length, i = Array.from({ length: c }, () => Array(e).fill(0));
  for (let s = 0; s < c; s++) for (let a = 0; a < e; a++) for (let u = 0; u < r; u++) i[s][a] += t[s][u] * n[u][a];
  return i;
}
function Yn(t) {
  const n = t.length, c = t.map((e, r) => {
    const i = [...e];
    for (let s = 0; s < n; s++) i.push(r === s ? 1 : 0);
    return i;
  });
  for (let e = 0; e < n; e++) {
    let r = e;
    for (let s = e + 1; s < n; s++) Math.abs(c[s][e]) > Math.abs(c[r][e]) && (r = s);
    if ([c[e], c[r]] = [c[r], c[e]], Math.abs(c[e][e]) < 1e-15) return null;
    const i = c[e][e];
    for (let s = 0; s < 2 * n; s++) c[e][s] /= i;
    for (let s = 0; s < n; s++) {
      if (s === e) continue;
      const a = c[s][e];
      for (let u = 0; u < 2 * n; u++) c[s][u] -= a * c[e][u];
    }
  }
  return c.map((e) => e.slice(n));
}
function Xn(t, n) {
  const c = Array.from({ length: 12 }, (e, r) => Array.from({ length: 12 }, (i, s) => r === s ? 1 : 0));
  return Math.abs(t) > 1e-12 && (c[1][5] = t, c[2][4] = -t), Math.abs(n) > 1e-12 && (c[7][11] = -n, c[8][10] = n), c;
}
function Nn(t, n, c) {
  const e = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let i = 0; i < 12; i++) for (let s = 0; s < 12; s++) {
    let a = 0;
    for (let u = 0; u < 12; u++) a += t[u][i] * n[u][s];
    e[i][s] = a;
  }
  const r = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let i = 0; i < 12; i++) for (let s = 0; s < 12; s++) {
    let a = 0;
    for (let u = 0; u < 12; u++) a += e[i][u] * c[u][s];
    r[i][s] = a;
  }
  return r;
}
function Sn(t, n, c) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const e = ((_a = n == null ? void 0 : n.momentsOfInertiaZ) == null ? void 0 : _a.get(c)) ?? 0, r = ((_b = n == null ? void 0 : n.momentsOfInertiaY) == null ? void 0 : _b.get(c)) ?? 0, i = ((_c = n == null ? void 0 : n.elasticities) == null ? void 0 : _c.get(c)) ?? 0, s = ((_d = n == null ? void 0 : n.areas) == null ? void 0 : _d.get(c)) ?? 0, a = ((_e = n == null ? void 0 : n.shearModuli) == null ? void 0 : _e.get(c)) ?? 0, u = ((_f = n == null ? void 0 : n.torsionalConstants) == null ? void 0 : _f.get(c)) ?? 0, d = Ct(nn(t[0], t[1]));
  if (d < 1e-12) return console.warn(`[hekatan-fem] barra ${c} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({ length: 12 }, () => new Array(12).fill(0));
  const o = (_g = n == null ? void 0 : n.endOffsets) == null ? void 0 : _g.get(c), X = o && o[2] > 0 ? d - o[2] * (o[0] + o[1]) : d;
  if (X <= 1e-9) throw new Error(`end offsets se comen la barra ${c}: L = ${d.toFixed(4)} m, rz = ${o[2]}, offsets ${o[0]} y ${o[1]} -> Lf = ${X.toFixed(4)} m`);
  let g = ((_h = n == null ? void 0 : n.shearAreasY) == null ? void 0 : _h.get(c)) ?? 0, h = ((_i = n == null ? void 0 : n.shearAreasZ) == null ? void 0 : _i.get(c)) ?? 0;
  g === 0 && h === 0 && s > 0 && a > 0 && (g = h = 5 / 6 * s);
  const f = h > 0 && a > 0 ? 12 * i * e / (a * h * X ** 2) : 0, m = g > 0 && a > 0 ? 12 * i * r / (a * g * X ** 2) : 0, _ = i * s / d, y = a * u / d, S = 12 * i * e / X ** 3 / (1 + f), B = 6 * i * e / X ** 2 / (1 + f), N = 4 * i * e / X * (1 + f / 4) / (1 + f), p = 2 * i * e / X * (1 - f / 2) / (1 + f), k = 12 * i * r / X ** 3 / (1 + m), L = 6 * i * r / X ** 2 / (1 + m), O = 4 * i * r / X * (1 + m / 4) / (1 + m), j = 2 * i * r / X * (1 - m / 2) / (1 + m);
  return [[_, 0, 0, 0, 0, 0, -_, 0, 0, 0, 0, 0], [0, S, 0, 0, 0, B, 0, -S, 0, 0, 0, B], [0, 0, k, 0, -L, 0, 0, 0, -k, 0, -L, 0], [0, 0, 0, y, 0, 0, 0, 0, 0, -y, 0, 0], [0, 0, -L, 0, O, 0, 0, 0, L, 0, j, 0], [0, B, 0, 0, 0, N, 0, -B, 0, 0, 0, p], [-_, 0, 0, 0, 0, 0, _, 0, 0, 0, 0, 0], [0, -S, 0, 0, 0, -B, 0, S, 0, 0, 0, -B], [0, 0, -k, 0, L, 0, 0, 0, k, 0, L, 0], [0, 0, 0, -y, 0, 0, 0, 0, 0, y, 0, 0], [0, 0, -L, 0, j, 0, 0, 0, L, 0, O, 0], [0, B, 0, 0, 0, p, 0, -B, 0, 0, 0, N]];
}
function jn(t, n, c) {
  var _a, _b, _c, _d, _e;
  const e = ((_a = n.elasticities) == null ? void 0 : _a.get(c)) ?? 0, r = ((_b = n.elasticitiesOrthogonal) == null ? void 0 : _b.get(c)) ?? 0, i = ((_c = n.poissonsRatios) == null ? void 0 : _c.get(c)) ?? 0, s = ((_d = n.shearModuli) == null ? void 0 : _d.get(c)) ?? 0, a = ((_e = n.thicknesses) == null ? void 0 : _e.get(c)) ?? 0, u = r > 0, d = u ? P(e, r, s, i, a) : z(e, i, a), o = u ? q(s, a) : Y(e, i, a), X = u ? rn(e, r, s, i) : sn(e, i), g = t.map(([D, x]) => [D, x]), h = g[1][0] - g[0][0], f = g[2][0] - g[0][0], m = g[0][1] - g[1][1], _ = g[2][1] - g[0][1], y = 0.5 * (h * _ - f * -m), S = w(g), B = Q(g), N = C(g, X, a), p = ct(ct(Ot(S), o), S), k = ct(ct(Ot(B), d), B), L = at(18, 18).toArray(), O = ct(Kt(p, k), y), j = [[0, 1, 5], [6, 7, 11], [12, 13, 17]];
  for (let D = 0; D < 3; D++) for (let x = 0; x < 3; x++) for (let U = 0; U < 3; U++) {
    const E = j[D][x], I = j[U][x];
    L[E][I] = N[D * 3 + x][U * 3 + x];
  }
  for (let D = 0; D < 18; D++) for (let x = 0; x < 18; x++) L[D][x] = (L[D][x] ?? 0) + O.get([D, x]);
  return L;
  function z(D, x, U) {
    const E = D / (1 - x * x), I = rt([[E, E * x, 0], [E * x, E, 0], [0, 0, E * (1 - x) / 2]]);
    return ct(U ** 3 / 12, I);
  }
  function Y(D, x, U) {
    const E = 0.8333333333333334, I = D / (2 * (1 + x)), nt = E * I * U;
    return rt([[nt, 0], [0, nt]]);
  }
  function P(D, x, U, E, I) {
    const nt = x * E / D, l = 1 - E * nt, b = D / l, T = x / l, J = E * x / l, A = rt([[b, J, 0], [J, T, 0], [0, 0, U]]);
    return ct(I ** 3 / 12, A);
  }
  function q(D, x) {
    const E = 0.8333333333333334 * D * x;
    return rt([[E, 0], [0, E]]);
  }
  function w(D) {
    const x = at(2, 18).toArray(), [U, E] = D[0], [I, nt] = D[1], [l, b] = D[2], T = 0.5 * ((I - U) * (b - E) - (l - U) * -(E - nt)), J = (U + I + l) / 3, v = (E + nt + b) / 3, A = [J, U, I], K = [v, E, nt], st = [J, I, l], $ = [v, nt, b], et = [J, l, U], Mt = [v, b, E], tt = 1 / 3, [ft, ut, yt, Yt] = M(A, K), [pt, wt, bt, dt] = M(st, $), [gt, G, mt, R] = M(et, Mt), lt = at(2, 18).toArray(), Xt = at(2, 18).toArray(), At = at(2, 18).toArray();
    for (let H = 0; H < 2; H++) for (let V = 0; V < 6; V++) lt[H][V] = tt * ft[H][V] + ut[H][V], lt[H][V + 6] = tt * ft[H][V] + yt[H][V], lt[H][V + 12] = tt * ft[H][V], Xt[H][V] = tt * pt[H][V], Xt[H][V + 6] = tt * pt[H][V] + wt[H][V], Xt[H][V + 12] = tt * pt[H][V] + bt[H][V], At[H][V] = tt * gt[H][V] + mt[H][V], At[H][V + 6] = tt * gt[H][V], At[H][V + 12] = tt * gt[H][V] + G[H][V];
    for (let H = 0; H < 2; H++) for (let V = 0; V < 18; V++) lt[H][V] *= Yt, Xt[H][V] *= dt, At[H][V] *= R, x[H][V] = (lt[H][V] + Xt[H][V] + At[H][V]) / T;
    return x;
  }
  function M(D, x) {
    const U = at(2, 6).toArray(), E = at(2, 6).toArray(), I = at(2, 6).toArray(), nt = D[1] - D[0], l = D[0] - D[2], b = x[2] - x[0], T = x[0] - x[1], J = D[2] - D[1], v = x[1] - x[2], A = 0.5 * (nt * b - l * T), K = 0.5 * T * l, st = 0.5 * b * nt, $ = 0.5 * nt * l, et = 0.5 * T * b;
    return U[0][2] = 0.5 * J / A, U[0][3] = -0.5, U[1][2] = 0.5 * v / A, U[1][4] = 0.5, E[0][2] = 0.5 * l / A, E[0][3] = 0.5 * K / A, E[0][4] = 0.5 * $ / A, E[1][2] = 0.5 * b / A, E[1][3] = 0.5 * et / A, E[1][4] = 0.5 * st / A, I[0][2] = 0.5 * nt / A, I[0][3] = -0.5 * st / A, I[0][4] = -0.5 * $ / A, I[1][2] = 0.5 * T / A, I[1][3] = -0.5 * et / A, I[1][4] = -0.5 * K / A, [U, E, I, A];
  }
  function Q(D) {
    const x = at(3, 18).toArray(), [U, E] = D[0], [I, nt] = D[1], [l, b] = D[2], T = I - U, J = l - U, v = l - I, A = nt - b, K = b - E, st = E - nt, $ = 0.5 * (T * K - J * -st), et = A / (2 * $), Mt = v / (2 * $), tt = K / (2 * $), ft = -J / (2 * $), ut = st / (2 * $), yt = T / (2 * $);
    return x[0][4] = et, x[0][10] = tt, x[0][16] = ut, x[1][3] = -Mt, x[1][9] = -ft, x[1][15] = -yt, x[2][3] = -et, x[2][4] = Mt, x[2][9] = -tt, x[2][10] = ft, x[2][15] = -ut, x[2][16] = yt, x;
  }
  function C(D, x, U) {
    let E = at(9, 9).toArray(), I = at(9, 9).toArray(), nt = at(9, 9).toArray(), l = at(9, 3).toArray(), b = at(3, 9).toArray(), T = at(3, 3).toArray(), J = at(3, 3).toArray(), v = at(3, 3).toArray(), A = at(3, 3).toArray(), K = at(3, 3).toArray(), st = at(3, 3).toArray(), $ = at(3, 3).toArray(), et = at(3, 3).toArray();
    const Mt = 1 / 8, tt = Mt / 6, ft = Mt ** 2 / 4, ut = 1, yt = 2, Yt = 1, pt = 0, wt = 1, bt = -1, dt = -1, gt = -1, G = -2, mt = D[0][0], R = D[0][1], lt = D[1][0], Xt = D[1][1], At = D[2][0], H = D[2][1], V = mt - lt, Ft = lt - At, Bt = At - mt, qt = R - Xt, Qt = Xt - H, Tt = H - R, xt = -V, jt = -Ft, _t = -Bt, vt = -qt, Jt = -Qt, kt = -Tt, F = 0.5 * (xt * Tt - Bt * -qt), ot = 2 * F, W = 4 * F, Z = 0.5 * U, Lt = F * U, Nt = xt ** 2 + vt ** 2, ht = jt ** 2 + Jt ** 2, St = _t ** 2 + kt ** 2;
    l[0][0] = Z * Qt, l[0][2] = Z * jt, l[1][1] = Z * jt, l[1][2] = Z * Qt, l[2][0] = Z * Qt * (kt - vt) * tt, l[2][1] = Z * jt * (Bt - V) * tt, l[2][2] = Z * (Bt * kt - V * vt) * 2 * tt, l[3][0] = Z * Tt, l[3][2] = Z * _t, l[4][1] = Z * _t, l[4][2] = Z * Tt, l[5][0] = Z * Tt * (vt - Jt) * tt, l[5][1] = Z * _t * (V - Ft) * tt, l[5][2] = Z * (V * vt - Ft * Jt) * 2 * tt, l[6][0] = Z * qt, l[6][2] = Z * xt, l[7][1] = Z * xt, l[7][2] = Z * qt, l[8][0] = Z * qt * (Jt - kt) * tt, l[8][1] = Z * xt * (Ft - Bt) * tt, l[8][2] = Z * (Ft * Jt - Bt * kt) * 2 * tt, nt = ct(ct(rt(l), x), Ot(rt(l))).toArray(), nt = ct(rt(nt), 1 / Lt).toArray(), b[0][0] = jt / W, b[0][1] = Jt / W, b[0][2] = 1, b[0][3] = _t / W, b[0][4] = kt / W, b[0][6] = xt / W, b[0][7] = vt / W, b[1][0] = jt / W, b[1][1] = Jt / W, b[1][3] = _t / W, b[1][4] = kt / W, b[1][5] = 1, b[1][6] = xt / W, b[1][7] = vt / W, b[2][0] = jt / W, b[2][1] = Jt / W, b[2][3] = _t / W, b[2][4] = kt / W, b[2][6] = xt / W, b[2][7] = vt / W, b[2][8] = 1;
    const Rt = 1 / (F * W);
    T[0][0] = Rt * Qt * kt * Nt, T[0][1] = Rt * Tt * vt * ht, T[0][2] = Rt * qt * Jt * St, T[1][0] = Rt * Ft * _t * Nt, T[1][1] = Rt * Bt * xt * ht, T[1][2] = Rt * V * jt * St, T[2][0] = Rt * (Qt * Bt + jt * kt) * Nt, T[2][1] = Rt * (Tt * V + _t * vt) * ht, T[2][2] = Rt * (qt * Ft + xt * Jt) * St;
    const it = ot / 3;
    J[0][0] = it * ut / Nt, J[0][1] = it * yt / Nt, J[0][2] = it * Yt / Nt, J[1][0] = it * pt / ht, J[1][1] = it * wt / ht, J[1][2] = it * bt / ht, J[2][0] = it * dt / St, J[2][1] = it * gt / St, J[2][2] = it * G / St, v[0][0] = it * G / Nt, v[0][1] = it * dt / Nt, v[0][2] = it * gt / Nt, v[1][0] = it * Yt / ht, v[1][1] = it * ut / ht, v[1][2] = it * yt / ht, v[2][0] = it * bt / St, v[2][1] = it * pt / St, v[2][2] = it * wt / St, A[0][0] = it * wt / Nt, A[0][1] = it * bt / Nt, A[0][2] = it * pt / Nt, A[1][0] = it * gt / ht, A[1][1] = it * G / ht, A[1][2] = it * dt / ht, A[2][0] = it * yt / St, A[2][1] = it * Yt / St, A[2][2] = it * ut / St, K = ct(Kt(rt(J), rt(v)), 0.5).toArray(), st = ct(Kt(rt(v), rt(A)), 0.5).toArray(), $ = ct(Kt(rt(A), rt(J)), 0.5).toArray();
    const Zt = ct(ct(Ot(rt(T)), x), rt(T));
    return et = Kt(Kt(ct(ct(Ot(rt(K)), Zt), rt(K)), ct(ct(Ot(rt(st)), Zt), rt(st))), ct(ct(Ot(rt($)), Zt), rt($))).toArray(), et = ct(rt(et), 3 / 4 * ft * Lt).toArray(), I = ct(ct(Ot(rt(b)), rt(et)), rt(b)).toArray(), E = Kt(rt(nt), rt(I)).toArray(), E;
  }
}
function sn(t, n) {
  const c = t / (1 - n * n);
  return rt([[c, c * n, 0], [c * n, c, 0], [0, 0, c * (1 - n) / 2]]);
}
function rn(t, n, c, e) {
  const r = n * e / t, i = 1 - e * r, s = t / i, a = n / i, u = e * n / i;
  return rt([[s, u, 0], [u, a, 0], [0, 0, c]]);
}
function Qn(t, n, c, e) {
  const r = { normals: /* @__PURE__ */ new Map(), shearsY: /* @__PURE__ */ new Map(), shearsZ: /* @__PURE__ */ new Map(), torsions: /* @__PURE__ */ new Map(), bendingsY: /* @__PURE__ */ new Map(), bendingsZ: /* @__PURE__ */ new Map(), bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() }, i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = { bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() };
  n.forEach((d, o) => {
    var _a, _b, _c, _d;
    const X = d.map((h) => t[h]), g = d.reduce((h, f) => {
      var _a2;
      const m = (_a2 = e.deformations) == null ? void 0 : _a2.get(f);
      return h.concat(m ?? [0, 0, 0, 0, 0, 0]);
    }, []);
    if (d.length === 2) {
      const h = It(X, ((_a = c == null ? void 0 : c.localAngles) == null ? void 0 : _a.get(o)) ?? 0), f = ct(h, g), m = dn(X, c, o);
      let _ = ct(m, f);
      const y = (_b = c == null ? void 0 : c.frameLoads) == null ? void 0 : _b.get(o);
      if (y && (y[0] || y[1] || y[2])) {
        const S = X[0], B = X[1], N = [B[0] - S[0], B[1] - S[1], B[2] - S[2]], p = Math.hypot(N[0], N[1], N[2]);
        if (p > 1e-9) {
          const k = [N[0] / p, N[1] / p, N[2] / p], L = p * p / 12, O = [k[1] * y[2] - k[2] * y[1], k[2] * y[0] - k[0] * y[2], k[0] * y[1] - k[1] * y[0]], j = [-y[0] * p / 2, -y[1] * p / 2, -y[2] * p / 2, -L * O[0], -L * O[1], -L * O[2], -y[0] * p / 2, -y[1] * p / 2, -y[2] * p / 2, +L * O[0], +L * O[1], +L * O[2]], z = ct(h, j);
          _ = _.map((Y, P) => Y + z[P]);
        }
      }
      r.normals.set(o, [_[0], _[6]]), r.shearsY.set(o, [_[1], _[7]]), r.shearsZ.set(o, [_[2], _[8]]), r.torsions.set(o, [_[3], _[9]]), r.bendingsY.set(o, [_[4], _[10]]), r.bendingsZ.set(o, [_[5], _[11]]);
    } else if (d.length === 4) {
      const h = _n(X, g, c, o);
      a.membraneXX.set(o, h.Nx), a.membraneYY.set(o, h.Ny), a.membraneXY.set(o, h.Nxy), a.bendingXX.set(o, h.Mx), a.bendingYY.set(o, h.My), a.bendingXY.set(o, h.Mxy), h.Mj && i.set(o, h.Mj), h.Nj && s.set(o, h.Nj), a.tranverseShearX.set(o, h.Qx), a.tranverseShearY.set(o, h.Qy), a.vonMises.set(o, h.vonMises);
    } else if (d.length === 3) {
      const h = It(X, ((_c = c == null ? void 0 : c.localAngles) == null ? void 0 : _c.get(o)) ?? 0);
      ct(h, g);
      const f = vn(c, o), m = xn(X), _ = Jn(g), y = kn(X), B = ct(1 / (2 * y), ct(ct(f, m), _)).toArray(), N = ((_d = c.thicknesses) == null ? void 0 : _d.get(o)) ?? 1, p = B[0][0] * N, k = B[1][0] * N, L = B[2][0] * N, O = B[0][1] * (N ** 3 / 12), j = B[1][1] * (N ** 3 / 12), z = B[2][1] * (N ** 3 / 12);
      a.membraneXX.set(o, p), a.membraneYY.set(o, k), a.membraneXY.set(o, L), a.bendingXX.set(o, O), a.bendingYY.set(o, j), a.bendingXY.set(o, z);
    }
  });
  const { nodeToCentroidElementIndiciesMap: u } = Dn(t, n);
  {
    const d = (g) => {
      var _a;
      return (((_a = c == null ? void 0 : c.plateFormulations) == null ? void 0 : _a.get(g)) ?? 0) === 1;
    }, o = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
    if (n.forEach((g, h) => {
      if (g.length !== 4) return;
      const f = g.map((m) => t[m]);
      o.set(h, [0, 1, 2].map((m) => f.reduce((_, y) => _ + y[m], 0) / 4)), X.set(h, g);
    }), [...X.keys()].some(d)) {
      const g = /* @__PURE__ */ new Map();
      for (const [h, f] of X) for (const m of f) {
        const _ = g.get(m) ?? [];
        _.push(h), g.set(m, _);
      }
      for (const [h, f] of X) {
        if (!d(h)) continue;
        const m = /* @__PURE__ */ new Map();
        for (const k of f) for (const L of g.get(k) ?? []) L !== h && m.set(L, (m.get(L) ?? 0) + 1);
        const _ = [...m].filter(([, k]) => k >= 2).map(([k]) => k);
        if (_.length < 2) continue;
        const y = o.get(h), S = (k) => {
          let L = 0, O = 0, j = 0, z = 0, Y = 0;
          const P = k.get(h) ?? 0;
          for (const w of _) {
            const M = o.get(w), Q = M[0] - y[0], C = M[1] - y[1], D = (k.get(w) ?? 0) - P;
            L += Q * Q, O += Q * C, j += C * C, z += Q * D, Y += C * D;
          }
          const q = L * j - O * O;
          return Math.abs(q) < 1e-12 ? [0, 0] : [(z * j - Y * O) / q, (L * Y - O * z) / q];
        }, B = S(a.bendingXX), N = S(a.bendingYY), p = S(a.bendingXY);
        a.tranverseShearX.set(h, B[0] + p[1]), a.tranverseShearY.set(h, N[1] + p[0]);
      }
    }
  }
  return n.forEach((d, o) => {
    if (d.length !== 3 && d.length !== 4) return;
    const X = d.length, g = new Array(X).fill(0), h = new Array(X).fill(0), f = new Array(X).fill(0), m = new Array(X).fill(0), _ = new Array(X).fill(0), y = new Array(X).fill(0), S = new Array(X).fill(0), B = new Array(X).fill(0), N = new Array(X).fill(0);
    d.forEach((j, z) => {
      const Y = (u.get(j) || []).filter((M) => n[M].length === 3 || n[M].length === 4), P = (M) => Et(Y.map((Q) => M.get(Q) ?? 0)), q = (M, Q) => Et(Y.map((C) => {
        const D = s.get(C), x = D ? n[C].indexOf(j) : -1;
        return D && x >= 0 ? D[x][M] : Q.get(C) ?? 0;
      }));
      g[z] = q(0, a.membraneXX), h[z] = q(1, a.membraneYY), f[z] = q(2, a.membraneXY);
      const w = (M, Q) => Et(Y.map((C) => {
        const D = i.get(C), x = D ? n[C].indexOf(j) : -1;
        return D && x >= 0 ? D[x][M] : Q.get(C) ?? 0;
      }));
      m[z] = w(0, a.bendingXX), _[z] = w(1, a.bendingYY), y[z] = w(2, a.bendingXY), S[z] = P(a.tranverseShearX), B[z] = P(a.tranverseShearY), N[z] = P(a.vonMises);
    }), r.membraneXX.set(o, g), r.membraneYY.set(o, h), r.membraneXY.set(o, f), r.bendingXX.set(o, m), r.bendingYY.set(o, _), r.bendingXY.set(o, y);
    const p = s.get(o), k = (j, z) => p ? p.reduce((Y, P) => Y + P[j], 0) / p.length : z.get(o) ?? 0;
    (r.membraneXXcentro ?? (r.membraneXXcentro = /* @__PURE__ */ new Map())).set(o, k(0, a.membraneXX)), (r.membraneYYcentro ?? (r.membraneYYcentro = /* @__PURE__ */ new Map())).set(o, k(1, a.membraneYY)), (r.membraneXYcentro ?? (r.membraneXYcentro = /* @__PURE__ */ new Map())).set(o, k(2, a.membraneXY)), p && ((r.membraneXXjoint ?? (r.membraneXXjoint = /* @__PURE__ */ new Map())).set(o, p.map((j) => j[0])), (r.membraneYYjoint ?? (r.membraneYYjoint = /* @__PURE__ */ new Map())).set(o, p.map((j) => j[1])), (r.membraneXYjoint ?? (r.membraneXYjoint = /* @__PURE__ */ new Map())).set(o, p.map((j) => j[2])));
    const L = i.get(o), O = (j, z) => L ? L.reduce((Y, P) => Y + P[j], 0) / L.length : z.get(o) ?? 0;
    (r.bendingXXcentro ?? (r.bendingXXcentro = /* @__PURE__ */ new Map())).set(o, O(0, a.bendingXX)), (r.bendingYYcentro ?? (r.bendingYYcentro = /* @__PURE__ */ new Map())).set(o, O(1, a.bendingYY)), (r.bendingXYcentro ?? (r.bendingXYcentro = /* @__PURE__ */ new Map())).set(o, O(2, a.bendingXY)), L && ((r.bendingXXjoint ?? (r.bendingXXjoint = /* @__PURE__ */ new Map())).set(o, L.map((j) => j[0])), (r.bendingYYjoint ?? (r.bendingYYjoint = /* @__PURE__ */ new Map())).set(o, L.map((j) => j[1])), (r.bendingXYjoint ?? (r.bendingXYjoint = /* @__PURE__ */ new Map())).set(o, L.map((j) => j[2]))), r.tranverseShearX.set(o, S), r.tranverseShearY.set(o, B), r.vonMises.set(o, N);
  }), r;
}
function _n(t, n, c, e) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const r = ((_a = c.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = c.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, s = ((_c = c.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], u = t[1], d = t[2], o = t[3], X = [u[0] - a[0], u[1] - a[1], u[2] - a[2]], g = [d[0] - o[0], d[1] - o[1], d[2] - o[2]];
  let h = [X[0] + g[0], X[1] + g[1], X[2] + g[2]], f = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);
  f < 1e-14 && (f = 1);
  let m = [h[0] / f, h[1] / f, h[2] / f];
  const _ = [d[0] - a[0], d[1] - a[1], d[2] - a[2]], y = [o[0] - u[0], o[1] - u[1], o[2] - u[2]];
  let S = [_[1] * y[2] - _[2] * y[1], _[2] * y[0] - _[0] * y[2], _[0] * y[1] - _[1] * y[0]], B = Math.sqrt(S[0] * S[0] + S[1] * S[1] + S[2] * S[2]);
  B < 1e-14 && (B = 1);
  let N = [S[0] / B, S[1] / B, S[2] / B], p = [N[1] * m[2] - N[2] * m[1], N[2] * m[0] - N[0] * m[2], N[0] * m[1] - N[1] * m[0]], k = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
  k < 1e-14 && (k = 1), p = [p[0] / k, p[1] / k, p[2] / k];
  {
    if (Math.abs(N[2]) > 1 - 1e-6) m = [1, 0, 0];
    else {
      const W = [-N[1], N[0], 0], Z = Math.hypot(W[0], W[1], W[2]) || 1;
      m = [W[0] / Z, W[1] / Z, W[2] / Z];
    }
    p = [N[1] * m[2] - N[2] * m[1], N[2] * m[0] - N[0] * m[2], N[0] * m[1] - N[1] * m[0]];
    const ot = Math.hypot(p[0], p[1], p[2]) || 1;
    p = [p[0] / ot, p[1] / ot, p[2] / ot], m = [p[1] * N[2] - p[2] * N[1], p[2] * N[0] - p[0] * N[2], p[0] * N[1] - p[1] * N[0]];
  }
  const L = 0.25 * (a[0] + u[0] + d[0] + o[0]), O = 0.25 * (a[1] + u[1] + d[1] + o[1]), j = 0.25 * (a[2] + u[2] + d[2] + o[2]), z = [], Y = [];
  for (let F = 0; F < 4; F++) {
    const ot = t[F][0] - L, W = t[F][1] - O, Z = t[F][2] - j;
    z.push(ot * m[0] + W * m[1] + Z * m[2]), Y.push(ot * p[0] + W * p[1] + Z * p[2]);
  }
  const P = [m, p, N], q = new Array(24).fill(0);
  for (let F = 0; F < 4; F++) {
    const ot = F * 6, W = F * 6;
    for (let Z = 0; Z < 3; Z++) q[W + Z] = P[Z][0] * n[ot] + P[Z][1] * n[ot + 1] + P[Z][2] * n[ot + 2];
    for (let Z = 0; Z < 3; Z++) q[W + 3 + Z] = P[Z][0] * n[ot + 3] + P[Z][1] * n[ot + 4] + P[Z][2] * n[ot + 5];
  }
  const w = r / (1 - i * i), M = [[w * s, w * i * s, 0], [w * i * s, w * s, 0], [0, 0, w * (1 - i) / 2 * s]], Q = s * s * s / 12, C = [[w * Q, w * i * Q, 0], [w * i * Q, w * Q, 0], [0, 0, w * (1 - i) / 2 * Q]], D = [-0.25, 0.25, 0.25, -0.25], x = [-0.25, -0.25, 0.25, 0.25];
  let U = 0, E = 0, I = 0, nt = 0;
  for (let F = 0; F < 4; F++) U += D[F] * z[F], E += D[F] * Y[F], I += x[F] * z[F], nt += x[F] * Y[F];
  const l = U * nt - E * I;
  if (Math.abs(l) < 1e-20) return { Nx: 0, Ny: 0, Nxy: 0, Mx: 0, My: 0, Mxy: 0, Qx: 0, Qy: 0, vonMises: 0, Mj: null, Nj: null };
  const b = nt / l, T = -E / l, J = -I / l, v = U / l, A = [], K = [];
  for (let F = 0; F < 4; F++) A.push(b * D[F] + T * x[F]), K.push(J * D[F] + v * x[F]);
  let st = 0, $ = 0, et = 0;
  for (let F = 0; F < 4; F++) {
    const ot = q[F * 6 + 0], W = q[F * 6 + 1];
    st += A[F] * ot, $ += K[F] * W, et += K[F] * ot + A[F] * W;
  }
  const Mt = M[0][0] * st + M[0][1] * $, tt = M[1][0] * st + M[1][1] * $, ft = M[2][2] * et;
  let ut = 0, yt = 0, Yt = 0;
  for (let F = 0; F < 4; F++) {
    const ot = q[F * 6 + 3], W = q[F * 6 + 4];
    ut += A[F] * W, yt += -K[F] * ot, Yt += K[F] * W - A[F] * ot;
  }
  const pt = -1, wt = pt * (C[0][0] * ut + C[0][1] * yt), bt = pt * (C[1][0] * ut + C[1][1] * yt), dt = pt * (C[2][2] * Yt);
  let gt = null;
  if (Math.abs(l) > 1e-20) {
    const F = [];
    for (let ht = 0; ht < 4; ht++) F.push(q[ht * 6 + 0], q[ht * 6 + 1], q[ht * 6 + 5]);
    const ot = ((_d = c == null ? void 0 : c.drillingTypes) == null ? void 0 : _d.get(e)) ?? 13, W = ((_e = c == null ? void 0 : c.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, Z = (_f = c == null ? void 0 : c.membraneModifiers) == null ? void 0 : _f.get(e), Lt = (_g = c == null ? void 0 : c.shellModifiers) == null ? void 0 : _g.get(e), Nt = Array.isArray(Lt) && Lt.length >= 3 ? [Lt[0], Lt[1], Lt[2]] : typeof Z == "number" && Z !== 1 ? [Z, Z, Z] : null;
    try {
      gt = hn(z, Y, F, r, i, s, { tipo: ot, gammaFac: W, mod: Nt }), gt && gt.some((ht) => ht.some((St) => !Number.isFinite(St))) && (gt = null);
    } catch {
      gt = null;
    }
  }
  let G = null;
  const mt = (((_h = c == null ? void 0 : c.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1;
  if (Math.abs(l) > 1e-20) {
    const F = [];
    for (let ot = 0; ot < 4; ot++) F.push(q[ot * 6 + 2], q[ot * 6 + 3], q[ot * 6 + 4]);
    try {
      const ot = globalThis.__hekatanDkqJoints ?? "gauss";
      G = (mt ? cn(z, Y, F, r, i, s) : fn(z, Y, F, r, i, s, ot)).map((W) => W.map((Z) => pt * Z)), G.some((W) => W.some((Z) => !Number.isFinite(Z))) && (G = null);
    } catch {
      G = null;
    }
  }
  const R = 5 / 6, lt = r / (2 * (1 + i)), Xt = R * lt * s;
  let At = 0, H = 0;
  const V = [0.25, 0.25, 0.25, 0.25];
  for (let F = 0; F < 4; F++) {
    const ot = q[F * 6 + 2], W = q[F * 6 + 3], Z = q[F * 6 + 4];
    At += A[F] * ot + V[F] * W, H += K[F] * ot + V[F] * Z;
  }
  const Ft = Xt * At, Bt = Xt * H, qt = Mt / s + 6 * wt / (s * s), Qt = tt / s + 6 * bt / (s * s), Tt = ft / s + 6 * dt / (s * s), xt = Math.sqrt(qt * qt - qt * Qt + Qt * Qt + 3 * Tt * Tt), jt = Mt / s - 6 * wt / (s * s), _t = tt / s - 6 * bt / (s * s), vt = ft / s - 6 * dt / (s * s), Jt = Math.sqrt(jt * jt - jt * _t + _t * _t + 3 * vt * vt), kt = Math.max(xt, Jt);
  return { Nx: Mt, Ny: tt, Nxy: ft, Mx: wt, My: bt, Mxy: dt, Qx: Ft, Qy: Bt, vonMises: kt, Mj: G, Nj: gt };
}
function vn(t, n) {
  var _a, _b, _c, _d, _e;
  const c = ((_a = t.elasticities) == null ? void 0 : _a.get(n)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(n)) ?? 0, r = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(n)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(n)) ?? 0;
  return (_e = t.thicknesses) == null ? void 0 : _e.get(n), e > 0 ? rn(c, e, i, r) : sn(c, r);
}
function xn(t) {
  const [n, c] = t[0], [e, r] = t[1], [i, s] = t[2], a = r - s, u = s - c, d = c - r, o = i - e, X = n - i, g = e - n;
  return rt([[a, u, d, 0, 0, 0], [0, 0, 0, o, X, g], [o, X, g, a, u, d]]);
}
function Jn(t) {
  const [n, c, e] = [t[0], t[6], t[12]], [r, i, s] = [t[1], t[7], t[13]], [a, u, d] = [t[4], t[10], t[16]], [o, X, g] = [t[3], t[9], t[15]];
  return rt([[n, -a], [c, -u], [e, -d], [r, o], [i, X], [s, g]]);
}
function kn(t) {
  const [n, c] = t[0], [e, r] = t[1], [i, s] = t[2], a = e - n, u = i - n, d = s - c, o = c - r;
  return 0.5 * (a * d - u * -o);
}
function Dn(t, n) {
  const c = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  return n.forEach((r, i) => {
    const s = r.map((u) => t[u]), a = qn(s);
    r.forEach((u) => {
      var _a, _b;
      c.has(u) || c.set(u, []), (_a = c.get(u)) == null ? void 0 : _a.push(a), e.has(u) || e.set(u, []), (_b = e.get(u)) == null ? void 0 : _b.push(i);
    });
  }), { nodeToCentroidNodesMap: c, nodeToCentroidElementIndiciesMap: e };
}
function qn(t) {
  const n = t.reduce((r, i) => r + i[0], 0) / t.length, c = t.reduce((r, i) => r + i[1], 0) / t.length, e = t.reduce((r, i) => r + i[2], 0) / t.length;
  return [n, c, e];
}
export {
  Qn as a,
  It as b,
  dn as g
};
