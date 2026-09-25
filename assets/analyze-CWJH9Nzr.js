import { s as nn, n as Ct, b as Pt, k as Ht, i as Gt, z as at, c as Vt, m as ct, t as Ot, a as Kt, e as rt, f as Et } from "./pureFunctionsAny.generated-DeJSBP3k.js";
function rn(t, n, r, e, c, i) {
  const s = e * i * i * i / (12 * (1 - c * c)), a = [[s, s * c, 0], [s * c, s, 0], [0, 0, s * (1 - c) / 2]], y = (g, h) => {
    const f = [-0.25 * (1 - h), 0.25 * (1 - h), 0.25 * (1 + h), -0.25 * (1 + h)], m = [-0.25 * (1 - g), -0.25 * (1 + g), 0.25 * (1 + g), 0.25 * (1 - g)];
    let j = 0, u = 0, x = 0, q = 0;
    for (let k = 0; k < 4; k++) j += f[k] * t[k], u += f[k] * n[k], x += m[k] * t[k], q += m[k] * n[k];
    const N = j * q - u * x, p = q / N, _ = -u / N, R = -x / N, O = j / N;
    let S = 0, z = 0, Y = 0;
    for (let k = 0; k < 4; k++) {
      const w = p * f[k] + _ * m[k], M = R * f[k] + O * m[k], Q = r[3 * k + 1], C = r[3 * k + 2];
      S += w * C, z += -M * Q, Y += M * C - w * Q;
    }
    const P = [S, z, Y];
    return [0, 1, 2].map((k) => a[k][0] * P[0] + a[k][1] * P[1] + a[k][2] * P[2]);
  }, d = [[-1, -1], [1, -1], [1, 1], [-1, 1]], o = 1 / Math.sqrt(3), X = d.map(([g, h]) => y(g * o, h * o));
  return d.map(([g, h]) => {
    const f = g * Math.sqrt(3), m = h * Math.sqrt(3), j = d.map(([u, x]) => (1 + u * f) * (1 + x * m) / 4);
    return [0, 1, 2].map((u) => j.reduce((x, q, N) => x + q * X[N][u], 0));
  });
}
function en(t, n) {
  const r = new Array(8).fill(0), e = new Array(8).fill(0), c = new Array(8).fill(0), i = [-1, 1, 1, -1], s = [-1, -1, 1, 1];
  for (let a = 0; a < 4; a++) {
    const y = i[a] * t, d = s[a] * n;
    r[a] = 0.25 * (1 + y) * (1 + d) * (y + d - 1), e[a] = 0.25 * i[a] * (1 + d) * (2 * y + d), c[a] = 0.25 * s[a] * (1 + y) * (y + 2 * d);
  }
  return r[4] = 0.5 * (1 - t * t) * (1 - n), e[4] = -t * (1 - n), c[4] = -0.5 * (1 - t * t), r[5] = 0.5 * (1 + t) * (1 - n * n), e[5] = 0.5 * (1 - n * n), c[5] = -n * (1 + t), r[6] = 0.5 * (1 - t * t) * (1 + n), e[6] = -t * (1 + n), c[6] = 0.5 * (1 - t * t), r[7] = 0.5 * (1 - t) * (1 - n * n), e[7] = -0.5 * (1 - n * n), c[7] = -n * (1 - t), { N: r, dNxi: e, dNet: c };
}
function an(t, n, r, e) {
  const c = [], i = [], s = [], a = [], y = [];
  for (let Y = 0; Y < 4; Y++) {
    const P = Y, k = (Y + 1) % 4, w = t[P] - t[k], M = n[P] - n[k], Q = w * w + M * M;
    c.push(-w / Q), i.push(0.75 * w * M / Q), s.push((0.25 * w * w - 0.5 * M * M) / Q), a.push(-M / Q), y.push((0.25 * M * M - 0.5 * w * w) / Q);
  }
  const { dNxi: d, dNet: o } = en(r, e), X = [-(1 - e) / 4, (1 - e) / 4, (1 + e) / 4, -(1 + e) / 4], g = [-(1 - r) / 4, -(1 + r) / 4, (1 + r) / 4, (1 - r) / 4];
  let h = 0, f = 0, m = 0, j = 0;
  for (let Y = 0; Y < 4; Y++) h += X[Y] * t[Y], f += X[Y] * n[Y], m += g[Y] * t[Y], j += g[Y] * n[Y];
  const u = h * j - f * m, x = j / u, q = -f / u, N = -m / u, p = h / u, _ = new Array(12).fill(0), R = new Array(12).fill(0), O = new Array(12).fill(0), S = new Array(12).fill(0);
  for (let Y = 0; Y < 4; Y++) {
    const P = (Y + 3) % 4, k = Y, w = 4 + P, M = 4 + k, Q = 1.5 * (c[k] * d[M] - c[P] * d[w]), C = 1.5 * (c[k] * o[M] - c[P] * o[w]), B = i[k] * d[M] + i[P] * d[w], J = i[k] * o[M] + i[P] * o[w], U = d[Y] - s[k] * d[M] - s[P] * d[w], E = o[Y] - s[k] * o[M] - s[P] * o[w];
    _[3 * Y] = Q, R[3 * Y] = C, _[3 * Y + 1] = B, R[3 * Y + 1] = J, _[3 * Y + 2] = U, R[3 * Y + 2] = E;
    const I = 1.5 * (a[k] * d[M] - a[P] * d[w]), nt = 1.5 * (a[k] * o[M] - a[P] * o[w]), l = -d[Y] + y[k] * d[M] + y[P] * d[w], b = -o[Y] + y[k] * o[M] + y[P] * o[w];
    O[3 * Y] = I, S[3 * Y] = nt, O[3 * Y + 1] = l, S[3 * Y + 1] = b, O[3 * Y + 2] = -B, S[3 * Y + 2] = -J;
  }
  const z = [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
  for (let Y = 0; Y < 12; Y++) {
    const P = x * _[Y] + q * R[Y], k = N * _[Y] + p * R[Y], w = x * O[Y] + q * S[Y], M = N * O[Y] + p * S[Y];
    z[0][Y] = P, z[1][Y] = M, z[2][Y] = k + w;
  }
  return z;
}
function fn(t, n, r, e, c, i, s = "esquinas") {
  const a = e * i * i * i / (12 * (1 - c * c)), y = [[a, a * c, 0], [a * c, a, 0], [0, 0, a * (1 - c) / 2]], d = (h, f) => {
    const m = an(t, n, h, f), j = [0, 1, 2].map((u) => m[u].reduce((x, q, N) => x + q * r[N], 0));
    return [0, 1, 2].map((u) => y[u][0] * j[0] + y[u][1] * j[1] + y[u][2] * j[2]);
  }, o = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (s === "esquinas") return o.map(([h, f]) => d(h, f));
  const X = 1 / Math.sqrt(3), g = o.map(([h, f]) => d(h * X, f * X));
  return o.map(([h, f]) => {
    const m = h * Math.sqrt(3), j = f * Math.sqrt(3), u = o.map(([x, q]) => (1 + x * m) * (1 + q * j) / 4);
    return [0, 1, 2].map((x) => u.reduce((q, N, p) => q + N * g[p][x], 0));
  });
}
function ln(t, n) {
  return { N: [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], dNxi: [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], dNeta: [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)] };
}
function gn(t, n, r, e) {
  let c = 0, i = 0, s = 0, a = 0;
  for (let o = 0; o < 4; o++) c += r[o] * t[o], i += r[o] * n[o], s += e[o] * t[o], a += e[o] * n[o];
  let y = c * a - i * s;
  Math.abs(y) < 1e-15 && (y = 1e-15);
  const d = 1 / y;
  return { det: y, Ji: [[a * d, -i * d], [-s * d, c * d]] };
}
function hn(t, n, r, e, c, i, s = {}) {
  const a = s.tipo ?? 13, y = s.gammaFac ?? 0.4, d = s.mod ?? null;
  let o, X, g;
  if (a === 8) o = 3, X = true, g = 0;
  else if (a === 3) o = 3, X = false, g = 0;
  else if (a === 6) o = 2, X = false, g = 2e-4;
  else if (a === 13) o = 2, X = true, g = 2e-4;
  else return null;
  const h = e / (1 - c * c), f = [[h, h * c, 0], [h * c, h, 0], [0, 0, h * (1 - c) / 2]];
  if (d) {
    const l = d[0], b = d[1], T = d[2];
    f[0][0] *= l, f[1][1] *= b, f[2][2] *= T;
    const D = Math.sqrt(Math.max(0, l * b));
    f[0][1] *= D, f[1][0] *= D;
  }
  for (const l of f) for (let b = 0; b < 3; b++) l[b] *= i;
  const m = [1, 2, 3, 0], j = [3, 0, 1, 2], u = [], x = [];
  for (let l = 0; l < 4; l++) u.push((n[m[l]] - n[l]) / 8), x.push(-(t[m[l]] - t[l]) / 8);
  const q = 0.5773502691896258, N = [-0.7745966692414834, 0, 0.7745966692414834], p = [5 / 9, 8 / 9, 5 / 9], _ = o === 2 ? [-q, q] : N, R = o === 2 ? [1, 1] : p, O = [];
  for (let l = 0; l < o; l++) for (let b = 0; b < o; b++) O.push({ r: _[l], s: _[b], w: R[l] * R[b] });
  const S = (l, b) => {
    const { N: T, dNxi: D, dNeta: v } = ln(l, b), { det: A, Ji: K } = gn(t, n, D, v), st = [], $ = [];
    for (let G = 0; G < 4; G++) st.push(K[0][0] * D[G] + K[0][1] * v[G]), $.push(K[1][0] * D[G] + K[1][1] * v[G]);
    const et = [-l * (1 - b), 0.5 * (1 - b * b), -l * (1 + b), -0.5 * (1 - b * b)], Mt = [-0.5 * (1 - l * l), -b * (1 + l), 0.5 * (1 - l * l), -b * (1 - l)], tt = [], ft = [];
    for (let G = 0; G < 4; G++) tt.push(K[0][0] * et[G] + K[0][1] * Mt[G]), ft.push(K[1][0] * et[G] + K[1][1] * Mt[G]);
    const yt = -2 * l * (1 - b * b), ut = -2 * b * (1 - l * l), Yt = K[0][0] * yt + K[0][1] * ut, pt = K[1][0] * yt + K[1][1] * ut, wt = [], bt = [], dt = [], gt = [];
    for (let G = 0; G < 4; G++) {
      const mt = j[G];
      wt.push(tt[mt] * u[mt] - tt[G] * u[G]), bt.push(ft[mt] * u[mt] - ft[G] * u[G]), dt.push(tt[mt] * x[mt] - tt[G] * x[G]), gt.push(ft[mt] * x[mt] - ft[G] * x[G]);
    }
    return { N: T, dNx: st, dNy: $, dNBx: Yt, dNBy: pt, gt1: wt, gt2: bt, gt3: dt, gt4: gt, dJ: Math.abs(A) };
  }, z = [0, 0, 0, 0], Y = [0, 0, 0, 0], P = [0, 0, 0, 0];
  if (X) {
    let l = 0;
    for (const b of O) {
      const T = S(b.r, b.s), D = b.w * T.dJ;
      for (let v = 0; v < 4; v++) z[v] += T.gt1[v] * D, Y[v] += T.gt4[v] * D, P[v] += (T.gt2[v] + T.gt3[v]) * D;
      l += D;
    }
    for (let b = 0; b < 4; b++) z[b] /= l, Y[b] /= l, P[b] /= l;
  }
  const k = (l, b) => {
    const T = S(l, b), D = [new Array(14).fill(0), new Array(14).fill(0), new Array(14).fill(0)];
    for (let v = 0; v < 4; v++) D[0][3 * v] = T.dNx[v], D[1][3 * v + 1] = T.dNy[v], D[2][3 * v] = T.dNy[v], D[2][3 * v + 1] = T.dNx[v], D[0][3 * v + 2] = T.gt1[v] - z[v], D[1][3 * v + 2] = T.gt4[v] - Y[v], D[2][3 * v + 2] = T.gt2[v] + T.gt3[v] - P[v];
    return D[0][12] = T.dNBx, D[2][12] = T.dNBy, D[1][13] = T.dNBy, D[2][13] = T.dNBx, { B: D, d: T };
  }, w = Array.from({ length: 14 }, () => new Array(14).fill(0));
  for (const l of O) {
    const { B: b, d: T } = k(l.r, l.s), D = l.w * T.dJ, v = [0, 1, 2].map((A) => b[0].map((K, st) => f[A][0] * b[0][st] + f[A][1] * b[1][st] + f[A][2] * b[2][st]));
    for (let A = 0; A < 14; A++) for (let K = 0; K < 14; K++) w[A][K] += (b[0][A] * v[0][K] + b[1][A] * v[1][K] + b[2][A] * v[2][K]) * D;
  }
  {
    const l = S(0, 0), b = e / (2 * (1 + c)), T = y * b, D = new Array(14).fill(0);
    for (let A = 0; A < 4; A++) D[3 * A] = -0.5 * l.dNy[A], D[3 * A + 1] = 0.5 * l.dNx[A], D[3 * A + 2] = 0.5 * (l.gt3[A] - l.gt2[A]) - l.N[A];
    D[12] = 0, D[13] = 0;
    const v = T * i * 4 * l.dJ;
    for (let A = 0; A < 14; A++) for (let K = 0; K < 14; K++) w[A][K] += v * D[A] * D[K];
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
  const M = [...r, 0, 0], Q = [[w[12][12], w[12][13]], [w[13][12], w[13][13]]], C = Q[0][0] * Q[1][1] - Q[0][1] * Q[1][0];
  if (Math.abs(C) > 1e-30) {
    const l = w[12].slice(0, 12).reduce((T, D, v) => T + D * r[v], 0), b = w[13].slice(0, 12).reduce((T, D, v) => T + D * r[v], 0);
    M[12] = -(Q[1][1] * l - Q[0][1] * b) / C, M[13] = -(-Q[1][0] * l + Q[0][0] * b) / C;
  }
  const B = globalThis.__hekatanItwRec ?? "", J = M.slice();
  if (B.includes("conBurbuja") || (J[12] = 0, J[13] = 0), B.includes("sinTheta")) for (let l = 0; l < 4; l++) J[3 * l + 2] = 0;
  const U = (l, b) => {
    const { B: T, d: D } = k(l, b);
    if (B.includes("sinProy")) for (let A = 0; A < 4; A++) T[0][3 * A + 2] = D.gt1[A], T[1][3 * A + 2] = D.gt4[A], T[2][3 * A + 2] = D.gt2[A] + D.gt3[A];
    const v = [0, 1, 2].map((A) => T[A].reduce((K, st, $) => K + st * J[$], 0));
    return [0, 1, 2].map((A) => f[A][0] * v[0] + f[A][1] * v[1] + f[A][2] * v[2]);
  }, E = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (B.includes("esquinas")) return E.map(([l, b]) => U(l, b));
  const I = q, nt = E.map(([l, b]) => U(l * I, b * I));
  return E.map(([l, b]) => {
    const T = l / I, D = b / I, v = E.map(([A, K]) => (1 + A * T) * (1 + K * D) / 4);
    return [0, 1, 2].map((A) => v.reduce((K, st, $) => K + st * nt[$][A], 0));
  });
}
const zt = 1 / Math.sqrt(3);
function $t(t, n) {
  const r = [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], e = [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], c = [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)];
  return { N: r, dNdxi: e, dNdeta: c };
}
function Wt(t, n, r, e) {
  let c = 0, i = 0, s = 0, a = 0;
  for (let g = 0; g < 4; g++) c += t[g] * r[g], i += t[g] * e[g], s += n[g] * r[g], a += n[g] * e[g];
  const y = c * a - i * s, d = 1 / y, o = [], X = [];
  for (let g = 0; g < 4; g++) o.push(d * (a * t[g] - i * n[g])), X.push(d * (-s * t[g] + c * n[g]));
  return { dNdx: o, dNdy: X, detJ: y, J: [c, i, s, a] };
}
function yn(t, n, r, e, c, i) {
  const s = r * c / (1 - e * e), a = [[s, s * e, 0], [s * e, s, 0], [0, 0, s * (1 - e) / 2]], y = [1, 2, 3, 0], d = [3, 0, 1, 2], o = [], X = [];
  for (let w = 0; w < 4; w++) o.push((n[y[w]] - n[w]) / 8), X.push(-(t[y[w]] - t[w]) / 8);
  const g = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)], h = [5 / 9, 8 / 9, 5 / 9], f = Dt(14, 14);
  let m = [], j = [], u = [], x = [], q = [], N = 0, p = 0, _ = 0;
  for (let w = 0; w < 3; w++) for (let M = 0; M < 3; M++) {
    const Q = g[w], C = g[M], B = h[w] * h[M], { N: J, dNdxi: U, dNdeta: E } = $t(Q, C);
    let I = 0, nt = 0, l = 0, b = 0;
    for (let L = 0; L < 4; L++) I += U[L] * t[L], nt += U[L] * n[L], l += E[L] * t[L], b += E[L] * n[L];
    const T = I * b - nt * l, D = b / T, v = -nt / T, A = -l / T, K = I / T, st = [], $ = [];
    for (let L = 0; L < 4; L++) st.push(D * U[L] + v * E[L]), $.push(A * U[L] + K * E[L]);
    const et = [-Q * (1 - C), 0.5 * (1 - C * C), -Q * (1 + C), -0.5 * (1 - C * C)], Mt = [-0.5 * (1 - Q * Q), -C * (1 + Q), 0.5 * (1 - Q * Q), -C * (1 - Q)], tt = [], ft = [];
    for (let L = 0; L < 4; L++) tt.push(D * et[L] + v * Mt[L]), ft.push(A * et[L] + K * Mt[L]);
    const yt = -2 * Q * (1 - C * C), ut = -2 * C * (1 - Q * Q), Yt = D * yt + v * ut, pt = A * yt + K * ut, wt = [], bt = [], dt = [], gt = [];
    for (let L = 0; L < 4; L++) {
      const lt = d[L];
      wt.push(tt[lt] * o[lt] - tt[L] * o[L]), bt.push(ft[lt] * o[lt] - ft[L] * o[L]), dt.push(tt[lt] * X[lt] - tt[L] * X[L]), gt.push(ft[lt] * X[lt] - ft[L] * X[L]);
    }
    const G = Dt(3, 14);
    for (let L = 0; L < 4; L++) G[0][3 * L] = st[L], G[1][3 * L + 1] = $[L], G[2][3 * L] = $[L], G[2][3 * L + 1] = st[L], G[0][3 * L + 2] = wt[L], G[1][3 * L + 2] = gt[L], G[2][3 * L + 2] = bt[L] + dt[L];
    G[0][12] = Yt, G[2][12] = pt, G[1][13] = pt, G[2][13] = Yt;
    const mt = B * Math.abs(T);
    for (let L = 0; L < 14; L++) for (let lt = 0; lt < 14; lt++) {
      let Xt = 0;
      for (let At = 0; At < 3; At++) for (let H = 0; H < 3; H++) Xt += G[At][L] * a[At][H] * G[H][lt];
      f[L][lt] += mt * Xt;
    }
    w === 1 && M === 1 && (m = J.slice(), j = st.slice(), u = $.slice(), x = bt.slice(), q = dt.slice(), N = Yt, p = pt, _ = Math.abs(T));
  }
  const R = r / (2 * (1 + e)), O = new Array(14).fill(0);
  for (let w = 0; w < 4; w++) O[3 * w] = -0.5 * u[w], O[3 * w + 1] = 0.5 * j[w], O[3 * w + 2] = 0.5 * (q[w] - x[w]) - m[w];
  O[12] = -0.5 * p, O[13] = 0.5 * N;
  const S = i * R * c * 4 * _;
  for (let w = 0; w < 14; w++) for (let M = 0; M < 14; M++) f[w][M] += S * O[w] * O[M];
  const z = [[f[12][12], f[12][13]], [f[13][12], f[13][13]]], Y = z[0][0] * z[1][1] - z[0][1] * z[1][0], P = Dt(12, 12);
  for (let w = 0; w < 12; w++) for (let M = 0; M < 12; M++) P[w][M] = f[w][M];
  if (Math.abs(Y) < 1e-30) return P;
  const k = [[z[1][1] / Y, -z[0][1] / Y], [-z[1][0] / Y, z[0][0] / Y]];
  for (let w = 0; w < 12; w++) for (let M = 0; M < 12; M++) {
    let Q = 0;
    for (let C = 0; C < 2; C++) for (let B = 0; B < 2; B++) Q += f[w][12 + C] * k[C][B] * f[12 + B][M];
    P[w][M] -= Q;
  }
  return P;
}
function un(t, n, r, e, c) {
  const i = Dt(12, 12), s = r * c * c * c / (12 * (1 - e * e)), y = 5 / 6 * r / (2 * (1 + e)) * c, d = [[-zt, -zt], [zt, -zt], [zt, zt], [-zt, zt]], o = [{ xi: 0, eta: -1 }, { xi: 0, eta: 1 }, { xi: -1, eta: 0 }, { xi: 1, eta: 0 }], X = [];
  for (const g of o) {
    const { N: h, dNdxi: f, dNdeta: m } = $t(g.xi, g.eta), { dNdx: j, dNdy: u, J: x } = Wt(f, m, t, n), q = Dt(2, 12);
    for (let S = 0; S < 4; S++) q[0][S * 3] = j[S], q[0][S * 3 + 1] = -h[S], q[1][S * 3] = u[S], q[1][S * 3 + 2] = -h[S];
    const [N, p, _, R] = x, O = Dt(2, 12);
    for (let S = 0; S < 12; S++) O[0][S] = N * q[0][S] + p * q[1][S], O[1][S] = _ * q[0][S] + R * q[1][S];
    X.push(O);
  }
  for (const [g, h] of d) {
    const { dNdxi: f, dNdeta: m } = $t(g, h), { dNdx: j, dNdy: u, detJ: x, J: q } = Wt(f, m, t, n), N = Dt(3, 12);
    for (let M = 0; M < 4; M++) N[0][M * 3 + 1] = j[M], N[1][M * 3 + 2] = u[M], N[2][M * 3 + 1] = u[M], N[2][M * 3 + 2] = j[M];
    for (let M = 0; M < 12; M++) for (let Q = 0; Q < 12; Q++) {
      let C = 0;
      C += s * (N[0][M] * N[0][Q] + e * N[0][M] * N[1][Q] + e * N[1][M] * N[0][Q] + N[1][M] * N[1][Q]), C += s * (1 - e) / 2 * N[2][M] * N[2][Q], i[M][Q] += C * Math.abs(x);
    }
    const p = Dt(2, 12), _ = 0.5 * (1 - h), R = 0.5 * (1 + h), O = 0.5 * (1 - g), S = 0.5 * (1 + g), [z, Y, P, k] = q, w = 1 / x;
    for (let M = 0; M < 12; M++) {
      const Q = _ * X[0][0][M] + R * X[1][0][M], C = O * X[2][1][M] + S * X[3][1][M];
      p[0][M] = w * (k * Q - Y * C), p[1][M] = w * (-P * Q + z * C);
    }
    for (let M = 0; M < 12; M++) for (let Q = 0; Q < 12; Q++) i[M][Q] += y * (p[0][M] * p[0][Q] + p[1][M] * p[1][Q]) * Math.abs(x);
  }
  return i;
}
function pn(t, n, r) {
  var _a, _b, _c;
  const e = ((_a = n == null ? void 0 : n.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = n == null ? void 0 : n.poissonsRatios) == null ? void 0 : _b.get(r)) ?? 0.2, i = ((_c = n == null ? void 0 : n.thicknesses) == null ? void 0 : _c.get(r)) ?? 0;
  if (e === 0 || i === 0) return Dt(24, 24);
  const { localCoords: s } = on(t), a = s.map((u) => u[0]), y = s.map((u) => u[1]), d = un(a, y, e, c, i), X = yn(a, y, e, c, i, 0.4), g = Dt(24, 24), h = [2, 3, 4, 8, 9, 10, 14, 15, 16, 20, 21, 22], f = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], m = Dt(12, 12);
  for (let u = 0; u < 12; u++) for (let x = 0; x < 12; x++) {
    let q = 0;
    const N = u / 3 | 0, p = u % 3, _ = x / 3 | 0, R = x % 3;
    for (let O = 0; O < 3; O++) {
      const S = f[O][p];
      if (S !== 0) for (let z = 0; z < 3; z++) {
        const Y = f[z][R];
        Y !== 0 && (q += S * d[N * 3 + O][_ * 3 + z] * Y);
      }
    }
    m[u][x] = q;
  }
  for (let u = 0; u < 12; u++) for (let x = 0; x < 12; x++) g[h[u]][h[x]] += m[u][x];
  const j = [0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23];
  for (let u = 0; u < 12; u++) for (let x = 0; x < 12; x++) g[j[u]][j[x]] += X[u][x];
  return g;
}
function Mn(t) {
  const { localX: n, localY: r, localZ: e } = on(t), c = [[n[0], n[1], n[2]], [r[0], r[1], r[2]], [e[0], e[1], e[2]]], i = Dt(24, 24);
  for (let s = 0; s < 4; s++) for (let a = 0; a < 2; a++) {
    const y = s * 6 + a * 3;
    for (let d = 0; d < 3; d++) for (let o = 0; o < 3; o++) i[y + d][y + o] = c[d][o];
  }
  return i;
}
function on(t) {
  const n = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]], r = [t[3][0] - t[1][0], t[3][1] - t[1][1], t[3][2] - t[1][2]], e = Ut(n, r), c = Math.sqrt(e[0] ** 2 + e[1] ** 2 + e[2] ** 2), i = e.map((f) => f / c), s = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], a = Math.sqrt(s[0] ** 2 + s[1] ** 2 + s[2] ** 2), y = s.map((f) => f / a), d = Ut(i, y), o = t.map((f) => f[0]).reduce((f, m) => f + m) / 4, X = t.map((f) => f[1]).reduce((f, m) => f + m) / 4, g = t.map((f) => f[2]).reduce((f, m) => f + m) / 4, h = t.map((f) => {
    const m = f[0] - o, j = f[1] - X, u = f[2] - g;
    return [m * y[0] + j * y[1] + u * y[2], m * d[0] + j * d[1] + u * d[2]];
  });
  return { localX: y, localY: d, localZ: i, localCoords: h };
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
  const r = (o) => {
    if (Math.abs(n) < 1e-12) return o;
    const X = n * Math.PI / 180, g = Math.cos(X), h = Math.sin(X);
    return [o[0], [g * o[1][0] + h * o[2][0], g * o[1][1] + h * o[2][1], g * o[1][2] + h * o[2][2]], [-h * o[1][0] + g * o[2][0], -h * o[1][1] + g * o[2][1], -h * o[1][2] + g * o[2][2]]];
  }, e = nn(t[1], t[0]), c = Ct(e), i = Pt(e, [1, 0, 0]) / c, s = Pt(e, [0, 1, 0]) / c, a = Pt(e, [0, 0, 1]) / c, y = Math.sqrt(i ** 2 + s ** 2);
  if (y < 1e-9) {
    const o = a > 0 ? 1 : -1, X = [[0, 0, o], [1, 0, 0], [0, o, 0]];
    return Ht(Gt(4), r(X)).toArray();
  }
  const d = [[i, s, a], [-i * a / y, -s * a / y, y], [s / y, -i / y, 0]];
  return Ht(Gt(4), r(d)).toArray();
}
function bn(t) {
  const i = [t[0], t[1], t[2]], s = at(3, 3).toArray();
  for (let p = 0; p < 3; p++) for (let _ = 0; _ < 3; _++) s[p][_] = i[_][p];
  const a = [-1, 1, 0], y = [-1, 0, 1], d = at(3, 2).toArray();
  for (let p = 0; p < 3; p++) for (let _ = 0; _ < 3; _++) d[p][0] += s[p][_] * a[_], d[p][1] += s[p][_] * y[_];
  const o = d.map((p) => p[0]), X = d.map((p) => p[1]);
  let g = Vt(o, X), h = Ct(g);
  if (h === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), at(18, 18).toArray();
  g = g.map((p) => p / h);
  const f = [...g], m = Gt(3).toArray(), j = g[0];
  let u;
  if (Math.abs(j) > 1 - 1e-10) {
    const p = g[2];
    u = m.map((_, R) => _[2] - p * g[R]);
  } else u = m.map((p, _) => p[0] - j * g[_]);
  if (h = Ct(u), h === 0) return console.warn("Degenerate local X-axis detected."), at(18, 18).toArray();
  u = u.map((p) => p / h);
  let x = Vt(f, u);
  if (h = Ct(x), h === 0) return console.warn("Degenerate local Y-axis detected."), at(18, 18).toArray();
  x = x.map((p) => p / h);
  const q = [u, x, f], N = at(18, 18).toArray();
  for (let p = 0; p < 3; p++) {
    const _ = p * 6, R = _ + 3;
    for (let O = 0; O < 3; O++) for (let S = 0; S < 3; S++) N[_ + O][_ + S] = q[O][S], N[R + O][R + S] = q[O][S];
  }
  return N;
}
function dn(t, n, r) {
  var _a, _b, _c;
  if (t.length === 2) {
    let e = Sn(t, n, r);
    const c = (_a = n == null ? void 0 : n.partialFixitySprings) == null ? void 0 : _a.get(r);
    c && (e = An(e, c));
    const i = (_b = n == null ? void 0 : n.momentReleases) == null ? void 0 : _b.get(r);
    i && (e = wn(e, i));
    const s = (_c = n == null ? void 0 : n.endOffsets) == null ? void 0 : _c.get(r);
    if (s && s[2] > 0 && (s[0] > 0 || s[1] > 0)) {
      const a = Xn(s[2] * s[0], s[2] * s[1]);
      e = Nn(a, e, a);
    }
    return e;
  }
  if (t.length === 3) return jn(t, n, r);
  if (t.length === 4) return pn(t, n, r);
}
function An(t, n) {
  const r = t.map((c) => [...c]), e = Math.min(n.length, 12);
  for (let c = 0; c < e; c++) n[c] > 1e-12 && (r[c][c] += n[c]);
  return r;
}
function wn(t, n) {
  const r = [];
  if (n.length >= 12) for (let f = 0; f < 12; f++) n[f] && r.push(f);
  else {
    const f = [3, 4, 5, 9, 10, 11];
    for (let m = 0; m < Math.min(n.length, 6); m++) n[m] && r.push(f[m]);
  }
  if (r.length === 0) return t;
  const e = t.length, c = [];
  for (let f = 0; f < e; f++) r.includes(f) || c.push(f);
  const i = c.length, s = r.length, a = Array.from({ length: s }, (f, m) => Array.from({ length: s }, (j, u) => t[r[m]][r[u]])), y = Array.from({ length: i }, (f, m) => Array.from({ length: s }, (j, u) => t[c[m]][r[u]])), d = Array.from({ length: s }, (f, m) => Array.from({ length: i }, (j, u) => t[r[m]][c[u]])), o = Yn(a);
  if (!o) return t;
  const X = tn(y, o), g = tn(X, d), h = Array.from({ length: e }, () => Array(e).fill(0));
  for (let f = 0; f < i; f++) for (let m = 0; m < i; m++) h[c[f]][c[m]] = t[c[f]][c[m]] - g[f][m];
  return h;
}
function tn(t, n) {
  const r = t.length, e = n[0].length, c = n.length, i = Array.from({ length: r }, () => Array(e).fill(0));
  for (let s = 0; s < r; s++) for (let a = 0; a < e; a++) for (let y = 0; y < c; y++) i[s][a] += t[s][y] * n[y][a];
  return i;
}
function Yn(t) {
  const n = t.length, r = t.map((e, c) => {
    const i = [...e];
    for (let s = 0; s < n; s++) i.push(c === s ? 1 : 0);
    return i;
  });
  for (let e = 0; e < n; e++) {
    let c = e;
    for (let s = e + 1; s < n; s++) Math.abs(r[s][e]) > Math.abs(r[c][e]) && (c = s);
    if ([r[e], r[c]] = [r[c], r[e]], Math.abs(r[e][e]) < 1e-15) return null;
    const i = r[e][e];
    for (let s = 0; s < 2 * n; s++) r[e][s] /= i;
    for (let s = 0; s < n; s++) {
      if (s === e) continue;
      const a = r[s][e];
      for (let y = 0; y < 2 * n; y++) r[s][y] -= a * r[e][y];
    }
  }
  return r.map((e) => e.slice(n));
}
function Xn(t, n) {
  const r = Array.from({ length: 12 }, (e, c) => Array.from({ length: 12 }, (i, s) => c === s ? 1 : 0));
  return Math.abs(t) > 1e-12 && (r[1][5] = t, r[2][4] = -t), Math.abs(n) > 1e-12 && (r[7][11] = -n, r[8][10] = n), r;
}
function Nn(t, n, r) {
  const e = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let i = 0; i < 12; i++) for (let s = 0; s < 12; s++) {
    let a = 0;
    for (let y = 0; y < 12; y++) a += t[y][i] * n[y][s];
    e[i][s] = a;
  }
  const c = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let i = 0; i < 12; i++) for (let s = 0; s < 12; s++) {
    let a = 0;
    for (let y = 0; y < 12; y++) a += e[i][y] * r[y][s];
    c[i][s] = a;
  }
  return c;
}
function Sn(t, n, r) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const e = ((_a = n == null ? void 0 : n.momentsOfInertiaZ) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = n == null ? void 0 : n.momentsOfInertiaY) == null ? void 0 : _b.get(r)) ?? 0, i = ((_c = n == null ? void 0 : n.elasticities) == null ? void 0 : _c.get(r)) ?? 0, s = ((_d = n == null ? void 0 : n.areas) == null ? void 0 : _d.get(r)) ?? 0, a = ((_e = n == null ? void 0 : n.shearModuli) == null ? void 0 : _e.get(r)) ?? 0, y = ((_f = n == null ? void 0 : n.torsionalConstants) == null ? void 0 : _f.get(r)) ?? 0, d = Ct(nn(t[0], t[1]));
  if (d < 1e-12) return console.warn(`[hekatan-fem] barra ${r} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({ length: 12 }, () => new Array(12).fill(0));
  const o = (_g = n == null ? void 0 : n.endOffsets) == null ? void 0 : _g.get(r), X = o && o[2] > 0 ? d - o[2] * (o[0] + o[1]) : d;
  if (X <= 1e-9) throw new Error(`end offsets se comen la barra ${r}: L = ${d.toFixed(4)} m, rz = ${o[2]}, offsets ${o[0]} y ${o[1]} -> Lf = ${X.toFixed(4)} m`);
  let g = ((_h = n == null ? void 0 : n.shearAreasY) == null ? void 0 : _h.get(r)) ?? 0, h = ((_i = n == null ? void 0 : n.shearAreasZ) == null ? void 0 : _i.get(r)) ?? 0;
  g === 0 && h === 0 && s > 0 && a > 0 && (g = h = 5 / 6 * s);
  const f = h > 0 && a > 0 ? 12 * i * e / (a * h * X ** 2) : 0, m = g > 0 && a > 0 ? 12 * i * c / (a * g * X ** 2) : 0, j = i * s / d, u = a * y / d, x = 12 * i * e / X ** 3 / (1 + f), q = 6 * i * e / X ** 2 / (1 + f), N = 4 * i * e / X * (1 + f / 4) / (1 + f), p = 2 * i * e / X * (1 - f / 2) / (1 + f), _ = 12 * i * c / X ** 3 / (1 + m), R = 6 * i * c / X ** 2 / (1 + m), O = 4 * i * c / X * (1 + m / 4) / (1 + m), S = 2 * i * c / X * (1 - m / 2) / (1 + m);
  return [[j, 0, 0, 0, 0, 0, -j, 0, 0, 0, 0, 0], [0, x, 0, 0, 0, q, 0, -x, 0, 0, 0, q], [0, 0, _, 0, -R, 0, 0, 0, -_, 0, -R, 0], [0, 0, 0, u, 0, 0, 0, 0, 0, -u, 0, 0], [0, 0, -R, 0, O, 0, 0, 0, R, 0, S, 0], [0, q, 0, 0, 0, N, 0, -q, 0, 0, 0, p], [-j, 0, 0, 0, 0, 0, j, 0, 0, 0, 0, 0], [0, -x, 0, 0, 0, -q, 0, x, 0, 0, 0, -q], [0, 0, -_, 0, R, 0, 0, 0, _, 0, R, 0], [0, 0, 0, -u, 0, 0, 0, 0, 0, u, 0, 0], [0, 0, -R, 0, S, 0, 0, 0, R, 0, O, 0], [0, q, 0, 0, 0, p, 0, -q, 0, 0, 0, N]];
}
function jn(t, n, r) {
  var _a, _b, _c, _d, _e;
  const e = ((_a = n.elasticities) == null ? void 0 : _a.get(r)) ?? 0, c = ((_b = n.elasticitiesOrthogonal) == null ? void 0 : _b.get(r)) ?? 0, i = ((_c = n.poissonsRatios) == null ? void 0 : _c.get(r)) ?? 0, s = ((_d = n.shearModuli) == null ? void 0 : _d.get(r)) ?? 0, a = ((_e = n.thicknesses) == null ? void 0 : _e.get(r)) ?? 0, y = c > 0, d = y ? P(e, c, s, i, a) : z(e, i, a), o = y ? k(s, a) : Y(e, i, a), X = y ? cn(e, c, s, i) : sn(e, i), g = t.map(([B, J]) => [B, J]), h = g[1][0] - g[0][0], f = g[2][0] - g[0][0], m = g[0][1] - g[1][1], j = g[2][1] - g[0][1], u = 0.5 * (h * j - f * -m), x = w(g), q = Q(g), N = C(g, X, a), p = ct(ct(Ot(x), o), x), _ = ct(ct(Ot(q), d), q), R = at(18, 18).toArray(), O = ct(Kt(p, _), u), S = [[0, 1, 5], [6, 7, 11], [12, 13, 17]];
  for (let B = 0; B < 3; B++) for (let J = 0; J < 3; J++) for (let U = 0; U < 3; U++) {
    const E = S[B][J], I = S[U][J];
    R[E][I] = N[B * 3 + J][U * 3 + J];
  }
  for (let B = 0; B < 18; B++) for (let J = 0; J < 18; J++) R[B][J] = (R[B][J] ?? 0) + O.get([B, J]);
  return R;
  function z(B, J, U) {
    const E = B / (1 - J * J), I = rt([[E, E * J, 0], [E * J, E, 0], [0, 0, E * (1 - J) / 2]]);
    return ct(U ** 3 / 12, I);
  }
  function Y(B, J, U) {
    const E = 0.8333333333333334, I = B / (2 * (1 + J)), nt = E * I * U;
    return rt([[nt, 0], [0, nt]]);
  }
  function P(B, J, U, E, I) {
    const nt = J * E / B, l = 1 - E * nt, b = B / l, T = J / l, D = E * J / l, A = rt([[b, D, 0], [D, T, 0], [0, 0, U]]);
    return ct(I ** 3 / 12, A);
  }
  function k(B, J) {
    const E = 0.8333333333333334 * B * J;
    return rt([[E, 0], [0, E]]);
  }
  function w(B) {
    const J = at(2, 18).toArray(), [U, E] = B[0], [I, nt] = B[1], [l, b] = B[2], T = 0.5 * ((I - U) * (b - E) - (l - U) * -(E - nt)), D = (U + I + l) / 3, v = (E + nt + b) / 3, A = [D, U, I], K = [v, E, nt], st = [D, I, l], $ = [v, nt, b], et = [D, l, U], Mt = [v, b, E], tt = 1 / 3, [ft, yt, ut, Yt] = M(A, K), [pt, wt, bt, dt] = M(st, $), [gt, G, mt, L] = M(et, Mt), lt = at(2, 18).toArray(), Xt = at(2, 18).toArray(), At = at(2, 18).toArray();
    for (let H = 0; H < 2; H++) for (let V = 0; V < 6; V++) lt[H][V] = tt * ft[H][V] + yt[H][V], lt[H][V + 6] = tt * ft[H][V] + ut[H][V], lt[H][V + 12] = tt * ft[H][V], Xt[H][V] = tt * pt[H][V], Xt[H][V + 6] = tt * pt[H][V] + wt[H][V], Xt[H][V + 12] = tt * pt[H][V] + bt[H][V], At[H][V] = tt * gt[H][V] + mt[H][V], At[H][V + 6] = tt * gt[H][V], At[H][V + 12] = tt * gt[H][V] + G[H][V];
    for (let H = 0; H < 2; H++) for (let V = 0; V < 18; V++) lt[H][V] *= Yt, Xt[H][V] *= dt, At[H][V] *= L, J[H][V] = (lt[H][V] + Xt[H][V] + At[H][V]) / T;
    return J;
  }
  function M(B, J) {
    const U = at(2, 6).toArray(), E = at(2, 6).toArray(), I = at(2, 6).toArray(), nt = B[1] - B[0], l = B[0] - B[2], b = J[2] - J[0], T = J[0] - J[1], D = B[2] - B[1], v = J[1] - J[2], A = 0.5 * (nt * b - l * T), K = 0.5 * T * l, st = 0.5 * b * nt, $ = 0.5 * nt * l, et = 0.5 * T * b;
    return U[0][2] = 0.5 * D / A, U[0][3] = -0.5, U[1][2] = 0.5 * v / A, U[1][4] = 0.5, E[0][2] = 0.5 * l / A, E[0][3] = 0.5 * K / A, E[0][4] = 0.5 * $ / A, E[1][2] = 0.5 * b / A, E[1][3] = 0.5 * et / A, E[1][4] = 0.5 * st / A, I[0][2] = 0.5 * nt / A, I[0][3] = -0.5 * st / A, I[0][4] = -0.5 * $ / A, I[1][2] = 0.5 * T / A, I[1][3] = -0.5 * et / A, I[1][4] = -0.5 * K / A, [U, E, I, A];
  }
  function Q(B) {
    const J = at(3, 18).toArray(), [U, E] = B[0], [I, nt] = B[1], [l, b] = B[2], T = I - U, D = l - U, v = l - I, A = nt - b, K = b - E, st = E - nt, $ = 0.5 * (T * K - D * -st), et = A / (2 * $), Mt = v / (2 * $), tt = K / (2 * $), ft = -D / (2 * $), yt = st / (2 * $), ut = T / (2 * $);
    return J[0][4] = et, J[0][10] = tt, J[0][16] = yt, J[1][3] = -Mt, J[1][9] = -ft, J[1][15] = -ut, J[2][3] = -et, J[2][4] = Mt, J[2][9] = -tt, J[2][10] = ft, J[2][15] = -yt, J[2][16] = ut, J;
  }
  function C(B, J, U) {
    let E = at(9, 9).toArray(), I = at(9, 9).toArray(), nt = at(9, 9).toArray(), l = at(9, 3).toArray(), b = at(3, 9).toArray(), T = at(3, 3).toArray(), D = at(3, 3).toArray(), v = at(3, 3).toArray(), A = at(3, 3).toArray(), K = at(3, 3).toArray(), st = at(3, 3).toArray(), $ = at(3, 3).toArray(), et = at(3, 3).toArray();
    const Mt = 1 / 8, tt = Mt / 6, ft = Mt ** 2 / 4, yt = 1, ut = 2, Yt = 1, pt = 0, wt = 1, bt = -1, dt = -1, gt = -1, G = -2, mt = B[0][0], L = B[0][1], lt = B[1][0], Xt = B[1][1], At = B[2][0], H = B[2][1], V = mt - lt, Ft = lt - At, Bt = At - mt, qt = L - Xt, Qt = Xt - H, Tt = H - L, vt = -V, jt = -Ft, xt = -Bt, _t = -qt, Jt = -Qt, kt = -Tt, F = 0.5 * (vt * Tt - Bt * -qt), ot = 2 * F, W = 4 * F, Z = 0.5 * U, Rt = F * U, Nt = vt ** 2 + _t ** 2, ht = jt ** 2 + Jt ** 2, St = xt ** 2 + kt ** 2;
    l[0][0] = Z * Qt, l[0][2] = Z * jt, l[1][1] = Z * jt, l[1][2] = Z * Qt, l[2][0] = Z * Qt * (kt - _t) * tt, l[2][1] = Z * jt * (Bt - V) * tt, l[2][2] = Z * (Bt * kt - V * _t) * 2 * tt, l[3][0] = Z * Tt, l[3][2] = Z * xt, l[4][1] = Z * xt, l[4][2] = Z * Tt, l[5][0] = Z * Tt * (_t - Jt) * tt, l[5][1] = Z * xt * (V - Ft) * tt, l[5][2] = Z * (V * _t - Ft * Jt) * 2 * tt, l[6][0] = Z * qt, l[6][2] = Z * vt, l[7][1] = Z * vt, l[7][2] = Z * qt, l[8][0] = Z * qt * (Jt - kt) * tt, l[8][1] = Z * vt * (Ft - Bt) * tt, l[8][2] = Z * (Ft * Jt - Bt * kt) * 2 * tt, nt = ct(ct(rt(l), J), Ot(rt(l))).toArray(), nt = ct(rt(nt), 1 / Rt).toArray(), b[0][0] = jt / W, b[0][1] = Jt / W, b[0][2] = 1, b[0][3] = xt / W, b[0][4] = kt / W, b[0][6] = vt / W, b[0][7] = _t / W, b[1][0] = jt / W, b[1][1] = Jt / W, b[1][3] = xt / W, b[1][4] = kt / W, b[1][5] = 1, b[1][6] = vt / W, b[1][7] = _t / W, b[2][0] = jt / W, b[2][1] = Jt / W, b[2][3] = xt / W, b[2][4] = kt / W, b[2][6] = vt / W, b[2][7] = _t / W, b[2][8] = 1;
    const Lt = 1 / (F * W);
    T[0][0] = Lt * Qt * kt * Nt, T[0][1] = Lt * Tt * _t * ht, T[0][2] = Lt * qt * Jt * St, T[1][0] = Lt * Ft * xt * Nt, T[1][1] = Lt * Bt * vt * ht, T[1][2] = Lt * V * jt * St, T[2][0] = Lt * (Qt * Bt + jt * kt) * Nt, T[2][1] = Lt * (Tt * V + xt * _t) * ht, T[2][2] = Lt * (qt * Ft + vt * Jt) * St;
    const it = ot / 3;
    D[0][0] = it * yt / Nt, D[0][1] = it * ut / Nt, D[0][2] = it * Yt / Nt, D[1][0] = it * pt / ht, D[1][1] = it * wt / ht, D[1][2] = it * bt / ht, D[2][0] = it * dt / St, D[2][1] = it * gt / St, D[2][2] = it * G / St, v[0][0] = it * G / Nt, v[0][1] = it * dt / Nt, v[0][2] = it * gt / Nt, v[1][0] = it * Yt / ht, v[1][1] = it * yt / ht, v[1][2] = it * ut / ht, v[2][0] = it * bt / St, v[2][1] = it * pt / St, v[2][2] = it * wt / St, A[0][0] = it * wt / Nt, A[0][1] = it * bt / Nt, A[0][2] = it * pt / Nt, A[1][0] = it * gt / ht, A[1][1] = it * G / ht, A[1][2] = it * dt / ht, A[2][0] = it * ut / St, A[2][1] = it * Yt / St, A[2][2] = it * yt / St, K = ct(Kt(rt(D), rt(v)), 0.5).toArray(), st = ct(Kt(rt(v), rt(A)), 0.5).toArray(), $ = ct(Kt(rt(A), rt(D)), 0.5).toArray();
    const Zt = ct(ct(Ot(rt(T)), J), rt(T));
    return et = Kt(Kt(ct(ct(Ot(rt(K)), Zt), rt(K)), ct(ct(Ot(rt(st)), Zt), rt(st))), ct(ct(Ot(rt($)), Zt), rt($))).toArray(), et = ct(rt(et), 3 / 4 * ft * Rt).toArray(), I = ct(ct(Ot(rt(b)), rt(et)), rt(b)).toArray(), E = Kt(rt(nt), rt(I)).toArray(), E;
  }
}
function sn(t, n) {
  const r = t / (1 - n * n);
  return rt([[r, r * n, 0], [r * n, r, 0], [0, 0, r * (1 - n) / 2]]);
}
function cn(t, n, r, e) {
  const c = n * e / t, i = 1 - e * c, s = t / i, a = n / i, y = e * n / i;
  return rt([[s, y, 0], [y, a, 0], [0, 0, r]]);
}
function Qn(t, n, r, e) {
  const c = { normals: /* @__PURE__ */ new Map(), shearsY: /* @__PURE__ */ new Map(), shearsZ: /* @__PURE__ */ new Map(), torsions: /* @__PURE__ */ new Map(), bendingsY: /* @__PURE__ */ new Map(), bendingsZ: /* @__PURE__ */ new Map(), bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() }, i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = { bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() };
  n.forEach((d, o) => {
    var _a, _b, _c, _d, _e;
    const X = d.map((h) => t[h]), g = d.reduce((h, f) => {
      var _a2;
      const m = (_a2 = e.deformations) == null ? void 0 : _a2.get(f);
      return h.concat(m ?? [0, 0, 0, 0, 0, 0]);
    }, []);
    if (d.length === 2) {
      const h = It(X, ((_a = r == null ? void 0 : r.localAngles) == null ? void 0 : _a.get(o)) ?? 0), f = ct(h, g), m = dn(X, r, o);
      let j = ct(m, f);
      const u = (_b = r == null ? void 0 : r.frameLoads) == null ? void 0 : _b.get(o);
      if (u && (u[0] || u[1] || u[2])) {
        const q = X[0], N = X[1], p = [N[0] - q[0], N[1] - q[1], N[2] - q[2]], _ = Math.hypot(p[0], p[1], p[2]);
        if (_ > 1e-9) {
          const R = [p[0] / _, p[1] / _, p[2] / _], O = _ * _ / 12, S = [R[1] * u[2] - R[2] * u[1], R[2] * u[0] - R[0] * u[2], R[0] * u[1] - R[1] * u[0]], z = [-u[0] * _ / 2, -u[1] * _ / 2, -u[2] * _ / 2, -O * S[0], -O * S[1], -O * S[2], -u[0] * _ / 2, -u[1] * _ / 2, -u[2] * _ / 2, +O * S[0], +O * S[1], +O * S[2]], Y = ct(h, z);
          j = j.map((P, k) => P + Y[k]);
        }
      }
      const x = (_c = r == null ? void 0 : r.frameFixedEnd) == null ? void 0 : _c.get(o);
      if (x) {
        const q = ct(h, x);
        j = j.map((N, p) => N + q[p]);
      }
      c.normals.set(o, [j[0], j[6]]), c.shearsY.set(o, [j[1], j[7]]), c.shearsZ.set(o, [j[2], j[8]]), c.torsions.set(o, [j[3], j[9]]), c.bendingsY.set(o, [j[4], j[10]]), c.bendingsZ.set(o, [j[5], j[11]]);
    } else if (d.length === 4) {
      const h = xn(X, g, r, o);
      a.membraneXX.set(o, h.Nx), a.membraneYY.set(o, h.Ny), a.membraneXY.set(o, h.Nxy), a.bendingXX.set(o, h.Mx), a.bendingYY.set(o, h.My), a.bendingXY.set(o, h.Mxy), h.Mj && i.set(o, h.Mj), h.Nj && s.set(o, h.Nj), a.tranverseShearX.set(o, h.Qx), a.tranverseShearY.set(o, h.Qy), a.vonMises.set(o, h.vonMises);
    } else if (d.length === 3) {
      const h = It(X, ((_d = r == null ? void 0 : r.localAngles) == null ? void 0 : _d.get(o)) ?? 0);
      ct(h, g);
      const f = _n(r, o), m = vn(X), j = Jn(g), u = kn(X), q = ct(1 / (2 * u), ct(ct(f, m), j)).toArray(), N = ((_e = r.thicknesses) == null ? void 0 : _e.get(o)) ?? 1, p = q[0][0] * N, _ = q[1][0] * N, R = q[2][0] * N, O = q[0][1] * (N ** 3 / 12), S = q[1][1] * (N ** 3 / 12), z = q[2][1] * (N ** 3 / 12);
      a.membraneXX.set(o, p), a.membraneYY.set(o, _), a.membraneXY.set(o, R), a.bendingXX.set(o, O), a.bendingYY.set(o, S), a.bendingXY.set(o, z);
    }
  });
  const { nodeToCentroidElementIndiciesMap: y } = Dn(t, n);
  {
    const d = (g) => {
      var _a;
      return (((_a = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _a.get(g)) ?? 0) === 1;
    }, o = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
    if (n.forEach((g, h) => {
      if (g.length !== 4) return;
      const f = g.map((m) => t[m]);
      o.set(h, [0, 1, 2].map((m) => f.reduce((j, u) => j + u[m], 0) / 4)), X.set(h, g);
    }), [...X.keys()].some(d)) {
      const g = /* @__PURE__ */ new Map();
      for (const [h, f] of X) for (const m of f) {
        const j = g.get(m) ?? [];
        j.push(h), g.set(m, j);
      }
      for (const [h, f] of X) {
        if (!d(h)) continue;
        const m = /* @__PURE__ */ new Map();
        for (const _ of f) for (const R of g.get(_) ?? []) R !== h && m.set(R, (m.get(R) ?? 0) + 1);
        const j = [...m].filter(([, _]) => _ >= 2).map(([_]) => _);
        if (j.length < 2) continue;
        const u = o.get(h), x = (_) => {
          let R = 0, O = 0, S = 0, z = 0, Y = 0;
          const P = _.get(h) ?? 0;
          for (const w of j) {
            const M = o.get(w), Q = M[0] - u[0], C = M[1] - u[1], B = (_.get(w) ?? 0) - P;
            R += Q * Q, O += Q * C, S += C * C, z += Q * B, Y += C * B;
          }
          const k = R * S - O * O;
          return Math.abs(k) < 1e-12 ? [0, 0] : [(z * S - Y * O) / k, (R * Y - O * z) / k];
        }, q = x(a.bendingXX), N = x(a.bendingYY), p = x(a.bendingXY);
        a.tranverseShearX.set(h, q[0] + p[1]), a.tranverseShearY.set(h, N[1] + p[0]);
      }
    }
  }
  return n.forEach((d, o) => {
    if (d.length !== 3 && d.length !== 4) return;
    const X = d.length, g = new Array(X).fill(0), h = new Array(X).fill(0), f = new Array(X).fill(0), m = new Array(X).fill(0), j = new Array(X).fill(0), u = new Array(X).fill(0), x = new Array(X).fill(0), q = new Array(X).fill(0), N = new Array(X).fill(0);
    d.forEach((S, z) => {
      const Y = (y.get(S) || []).filter((M) => n[M].length === 3 || n[M].length === 4), P = (M) => Et(Y.map((Q) => M.get(Q) ?? 0)), k = (M, Q) => Et(Y.map((C) => {
        const B = s.get(C), J = B ? n[C].indexOf(S) : -1;
        return B && J >= 0 ? B[J][M] : Q.get(C) ?? 0;
      }));
      g[z] = k(0, a.membraneXX), h[z] = k(1, a.membraneYY), f[z] = k(2, a.membraneXY);
      const w = (M, Q) => Et(Y.map((C) => {
        const B = i.get(C), J = B ? n[C].indexOf(S) : -1;
        return B && J >= 0 ? B[J][M] : Q.get(C) ?? 0;
      }));
      m[z] = w(0, a.bendingXX), j[z] = w(1, a.bendingYY), u[z] = w(2, a.bendingXY), x[z] = P(a.tranverseShearX), q[z] = P(a.tranverseShearY), N[z] = P(a.vonMises);
    }), c.membraneXX.set(o, g), c.membraneYY.set(o, h), c.membraneXY.set(o, f), c.bendingXX.set(o, m), c.bendingYY.set(o, j), c.bendingXY.set(o, u);
    const p = s.get(o), _ = (S, z) => p ? p.reduce((Y, P) => Y + P[S], 0) / p.length : z.get(o) ?? 0;
    (c.membraneXXcentro ?? (c.membraneXXcentro = /* @__PURE__ */ new Map())).set(o, _(0, a.membraneXX)), (c.membraneYYcentro ?? (c.membraneYYcentro = /* @__PURE__ */ new Map())).set(o, _(1, a.membraneYY)), (c.membraneXYcentro ?? (c.membraneXYcentro = /* @__PURE__ */ new Map())).set(o, _(2, a.membraneXY)), p && ((c.membraneXXjoint ?? (c.membraneXXjoint = /* @__PURE__ */ new Map())).set(o, p.map((S) => S[0])), (c.membraneYYjoint ?? (c.membraneYYjoint = /* @__PURE__ */ new Map())).set(o, p.map((S) => S[1])), (c.membraneXYjoint ?? (c.membraneXYjoint = /* @__PURE__ */ new Map())).set(o, p.map((S) => S[2])));
    const R = i.get(o), O = (S, z) => R ? R.reduce((Y, P) => Y + P[S], 0) / R.length : z.get(o) ?? 0;
    (c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(o, O(0, a.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(o, O(1, a.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(o, O(2, a.bendingXY)), R && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(o, R.map((S) => S[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(o, R.map((S) => S[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(o, R.map((S) => S[2]))), c.tranverseShearX.set(o, x), c.tranverseShearY.set(o, q), c.vonMises.set(o, N);
  }), c;
}
function xn(t, n, r, e) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const c = ((_a = r.elasticities) == null ? void 0 : _a.get(e)) ?? 0, i = ((_b = r.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0, s = ((_c = r.thicknesses) == null ? void 0 : _c.get(e)) ?? 1, a = t[0], y = t[1], d = t[2], o = t[3], X = [y[0] - a[0], y[1] - a[1], y[2] - a[2]], g = [d[0] - o[0], d[1] - o[1], d[2] - o[2]];
  let h = [X[0] + g[0], X[1] + g[1], X[2] + g[2]], f = Math.sqrt(h[0] * h[0] + h[1] * h[1] + h[2] * h[2]);
  f < 1e-14 && (f = 1);
  let m = [h[0] / f, h[1] / f, h[2] / f];
  const j = [d[0] - a[0], d[1] - a[1], d[2] - a[2]], u = [o[0] - y[0], o[1] - y[1], o[2] - y[2]];
  let x = [j[1] * u[2] - j[2] * u[1], j[2] * u[0] - j[0] * u[2], j[0] * u[1] - j[1] * u[0]], q = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
  q < 1e-14 && (q = 1);
  let N = [x[0] / q, x[1] / q, x[2] / q], p = [N[1] * m[2] - N[2] * m[1], N[2] * m[0] - N[0] * m[2], N[0] * m[1] - N[1] * m[0]], _ = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
  _ < 1e-14 && (_ = 1), p = [p[0] / _, p[1] / _, p[2] / _];
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
  const R = 0.25 * (a[0] + y[0] + d[0] + o[0]), O = 0.25 * (a[1] + y[1] + d[1] + o[1]), S = 0.25 * (a[2] + y[2] + d[2] + o[2]), z = [], Y = [];
  for (let F = 0; F < 4; F++) {
    const ot = t[F][0] - R, W = t[F][1] - O, Z = t[F][2] - S;
    z.push(ot * m[0] + W * m[1] + Z * m[2]), Y.push(ot * p[0] + W * p[1] + Z * p[2]);
  }
  const P = [m, p, N], k = new Array(24).fill(0);
  for (let F = 0; F < 4; F++) {
    const ot = F * 6, W = F * 6;
    for (let Z = 0; Z < 3; Z++) k[W + Z] = P[Z][0] * n[ot] + P[Z][1] * n[ot + 1] + P[Z][2] * n[ot + 2];
    for (let Z = 0; Z < 3; Z++) k[W + 3 + Z] = P[Z][0] * n[ot + 3] + P[Z][1] * n[ot + 4] + P[Z][2] * n[ot + 5];
  }
  const w = c / (1 - i * i), M = [[w * s, w * i * s, 0], [w * i * s, w * s, 0], [0, 0, w * (1 - i) / 2 * s]], Q = s * s * s / 12, C = [[w * Q, w * i * Q, 0], [w * i * Q, w * Q, 0], [0, 0, w * (1 - i) / 2 * Q]], B = [-0.25, 0.25, 0.25, -0.25], J = [-0.25, -0.25, 0.25, 0.25];
  let U = 0, E = 0, I = 0, nt = 0;
  for (let F = 0; F < 4; F++) U += B[F] * z[F], E += B[F] * Y[F], I += J[F] * z[F], nt += J[F] * Y[F];
  const l = U * nt - E * I;
  if (Math.abs(l) < 1e-20) return { Nx: 0, Ny: 0, Nxy: 0, Mx: 0, My: 0, Mxy: 0, Qx: 0, Qy: 0, vonMises: 0, Mj: null, Nj: null };
  const b = nt / l, T = -E / l, D = -I / l, v = U / l, A = [], K = [];
  for (let F = 0; F < 4; F++) A.push(b * B[F] + T * J[F]), K.push(D * B[F] + v * J[F]);
  let st = 0, $ = 0, et = 0;
  for (let F = 0; F < 4; F++) {
    const ot = k[F * 6 + 0], W = k[F * 6 + 1];
    st += A[F] * ot, $ += K[F] * W, et += K[F] * ot + A[F] * W;
  }
  const Mt = M[0][0] * st + M[0][1] * $, tt = M[1][0] * st + M[1][1] * $, ft = M[2][2] * et;
  let yt = 0, ut = 0, Yt = 0;
  for (let F = 0; F < 4; F++) {
    const ot = k[F * 6 + 3], W = k[F * 6 + 4];
    yt += A[F] * W, ut += -K[F] * ot, Yt += K[F] * W - A[F] * ot;
  }
  const pt = -1, wt = pt * (C[0][0] * yt + C[0][1] * ut), bt = pt * (C[1][0] * yt + C[1][1] * ut), dt = pt * (C[2][2] * Yt);
  let gt = null;
  if (Math.abs(l) > 1e-20) {
    const F = [];
    for (let ht = 0; ht < 4; ht++) F.push(k[ht * 6 + 0], k[ht * 6 + 1], k[ht * 6 + 5]);
    const ot = ((_d = r == null ? void 0 : r.drillingTypes) == null ? void 0 : _d.get(e)) ?? 13, W = ((_e = r == null ? void 0 : r.drillingPenaltyScales) == null ? void 0 : _e.get(e)) ?? 0.4, Z = (_f = r == null ? void 0 : r.membraneModifiers) == null ? void 0 : _f.get(e), Rt = (_g = r == null ? void 0 : r.shellModifiers) == null ? void 0 : _g.get(e), Nt = Array.isArray(Rt) && Rt.length >= 3 ? [Rt[0], Rt[1], Rt[2]] : typeof Z == "number" && Z !== 1 ? [Z, Z, Z] : null;
    try {
      gt = hn(z, Y, F, c, i, s, { tipo: ot, gammaFac: W, mod: Nt }), gt && gt.some((ht) => ht.some((St) => !Number.isFinite(St))) && (gt = null);
    } catch {
      gt = null;
    }
  }
  let G = null;
  const mt = (((_h = r == null ? void 0 : r.plateFormulations) == null ? void 0 : _h.get(e)) ?? 0) !== 1;
  if (Math.abs(l) > 1e-20) {
    const F = [];
    for (let ot = 0; ot < 4; ot++) F.push(k[ot * 6 + 2], k[ot * 6 + 3], k[ot * 6 + 4]);
    try {
      const ot = globalThis.__hekatanDkqJoints ?? "gauss";
      G = (mt ? rn(z, Y, F, c, i, s) : fn(z, Y, F, c, i, s, ot)).map((W) => W.map((Z) => pt * Z)), G.some((W) => W.some((Z) => !Number.isFinite(Z))) && (G = null);
    } catch {
      G = null;
    }
  }
  const L = 5 / 6, lt = c / (2 * (1 + i)), Xt = L * lt * s;
  let At = 0, H = 0;
  const V = [0.25, 0.25, 0.25, 0.25];
  for (let F = 0; F < 4; F++) {
    const ot = k[F * 6 + 2], W = k[F * 6 + 3], Z = k[F * 6 + 4];
    At += A[F] * ot + V[F] * W, H += K[F] * ot + V[F] * Z;
  }
  const Ft = Xt * At, Bt = Xt * H, qt = Mt / s + 6 * wt / (s * s), Qt = tt / s + 6 * bt / (s * s), Tt = ft / s + 6 * dt / (s * s), vt = Math.sqrt(qt * qt - qt * Qt + Qt * Qt + 3 * Tt * Tt), jt = Mt / s - 6 * wt / (s * s), xt = tt / s - 6 * bt / (s * s), _t = ft / s - 6 * dt / (s * s), Jt = Math.sqrt(jt * jt - jt * xt + xt * xt + 3 * _t * _t), kt = Math.max(vt, Jt);
  return { Nx: Mt, Ny: tt, Nxy: ft, Mx: wt, My: bt, Mxy: dt, Qx: Ft, Qy: Bt, vonMises: kt, Mj: G, Nj: gt };
}
function _n(t, n) {
  var _a, _b, _c, _d, _e;
  const r = ((_a = t.elasticities) == null ? void 0 : _a.get(n)) ?? 0, e = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(n)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(n)) ?? 0, i = ((_d = t.shearModuli) == null ? void 0 : _d.get(n)) ?? 0;
  return (_e = t.thicknesses) == null ? void 0 : _e.get(n), e > 0 ? cn(r, e, i, c) : sn(r, c);
}
function vn(t) {
  const [n, r] = t[0], [e, c] = t[1], [i, s] = t[2], a = c - s, y = s - r, d = r - c, o = i - e, X = n - i, g = e - n;
  return rt([[a, y, d, 0, 0, 0], [0, 0, 0, o, X, g], [o, X, g, a, y, d]]);
}
function Jn(t) {
  const [n, r, e] = [t[0], t[6], t[12]], [c, i, s] = [t[1], t[7], t[13]], [a, y, d] = [t[4], t[10], t[16]], [o, X, g] = [t[3], t[9], t[15]];
  return rt([[n, -a], [r, -y], [e, -d], [c, o], [i, X], [s, g]]);
}
function kn(t) {
  const [n, r] = t[0], [e, c] = t[1], [i, s] = t[2], a = e - n, y = i - n, d = s - r, o = r - c;
  return 0.5 * (a * d - y * -o);
}
function Dn(t, n) {
  const r = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map();
  return n.forEach((c, i) => {
    const s = c.map((y) => t[y]), a = qn(s);
    c.forEach((y) => {
      var _a, _b;
      r.has(y) || r.set(y, []), (_a = r.get(y)) == null ? void 0 : _a.push(a), e.has(y) || e.set(y, []), (_b = e.get(y)) == null ? void 0 : _b.push(i);
    });
  }), { nodeToCentroidNodesMap: r, nodeToCentroidElementIndiciesMap: e };
}
function qn(t) {
  const n = t.reduce((c, i) => c + i[0], 0) / t.length, r = t.reduce((c, i) => c + i[1], 0) / t.length, e = t.reduce((c, i) => c + i[2], 0) / t.length;
  return [n, r, e];
}
export {
  Qn as a,
  It as b,
  dn as g
};
