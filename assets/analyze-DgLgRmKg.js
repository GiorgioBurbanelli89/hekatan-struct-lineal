import { s as oo, n as Ct, b as Pt, k as Ht, i as Gt, z as lt, c as Vt, m as it, t as Rt, a as Ot, e as at, f as Et } from "./pureFunctionsAny.generated-DeJSBP3k.js";
function ro(t, n, e, a, c, f, r = 1e3) {
  const i = a * f * f * f / (12 * (1 - c * c)), h = [[i, i * c, 0], [i * c, i, 0], [0, 0, i * (1 - c) / 2]], w = 5 / 6 * a * f / (2 * (1 + c)), s = h[0][0] + h[1][1] + h[2][2], J = r, d = [], b = [], g = [];
  for (let o = 0; o < 4; o++) {
    const Y = (o + 1) % 4, m = t[Y] - t[o], K = n[Y] - n[o], $ = Math.hypot(m, K);
    g.push($), d.push($ > 0 ? m / $ : 1), b.push($ > 0 ? K / $ : 0);
  }
  const p = () => new Array(22).fill(0), S = [p(), p(), p(), p()];
  for (let o = 0; o < 4; o++) {
    const Y = (o + 1) % 4;
    S[o][3 * Y] += 1 / g[o], S[o][3 * o] -= 1 / g[o], S[o][3 * o + 1] -= b[o] / 2, S[o][3 * Y + 1] -= b[o] / 2, S[o][3 * o + 2] += d[o] / 2, S[o][3 * Y + 2] += d[o] / 2, S[o][12 + 2 * o] -= 2 / 3 * b[o], S[o][13 + 2 * o] += 2 / 3 * d[o];
  }
  const y = (o, Y) => o.map((m) => m * Y), x = (o, Y) => o.map((m, K) => m + Y[K]), R = y(S[0], g[0] / 2), _ = y(S[2], -g[2] / 2), M = y(S[1], g[1] / 2), L = y(S[3], -g[3] / 2), C = y(x(R, _), 0.5), Z = y(x(_, y(R, -1)), 0.5), B = y(x(L, M), 0.5), G = y(x(M, y(L, -1)), 0.5), v = y(x(Z, G), 0.5), tt = (o, Y) => {
    const m = [-(1 - Y) / 4, (1 - Y) / 4, (1 + Y) / 4, -(1 + Y) / 4], K = [-(1 - o) / 4, -(1 + o) / 4, (1 + o) / 4, (1 - o) / 4], $ = [-o * (1 - Y), (1 - Y * Y) / 2, -o * (1 + Y), -(1 - Y * Y) / 2], E = [-(1 - o * o) / 2, -Y * (1 + o), (1 - o * o) / 2, -Y * (1 - o)];
    let ft = 0, pt = 0, Mt = 0, Xt = 0;
    for (let j = 0; j < 4; j++) ft += m[j] * t[j], pt += m[j] * n[j], Mt += K[j] * t[j], Xt += K[j] * n[j];
    const yt = ft * Xt - pt * Mt, et = [[Xt / yt, -pt / yt], [-Mt / yt, ft / yt]], mt = [p(), p(), p(), p(), p()], At = p(), gt = (j, H, Yt, jt, vt) => {
      mt[0][j] += Yt * jt, mt[1][j] -= H * vt, mt[2][j] += Yt * vt - H * jt, At[j] += H * jt + Yt * vt;
    };
    for (let j = 0; j < 4; j++) {
      const H = et[0][0] * m[j] + et[0][1] * K[j], Yt = et[1][0] * m[j] + et[1][1] * K[j];
      gt(3 * j + 1, 1, 0, H, Yt), gt(3 * j + 2, 0, 1, H, Yt);
    }
    for (let j = 0; j < 4; j++) {
      const H = et[0][0] * $[j] + et[0][1] * E[j], Yt = et[1][0] * $[j] + et[1][1] * E[j];
      gt(12 + 2 * j, 1, 0, H, Yt), gt(13 + 2 * j, 0, 1, H, Yt);
    }
    const U = -2 * o * (1 - Y * Y), bt = -2 * Y * (1 - o * o), z = et[0][0] * U + et[0][1] * bt, ht = et[1][0] * U + et[1][1] * bt;
    gt(20, 1, 0, z, ht), gt(21, 0, 1, z, ht);
    const Nt = x(C, y(v, Y)), wt = x(B, y(v, o));
    for (let j = 0; j < 22; j++) mt[3][j] = et[0][0] * Nt[j] + et[0][1] * wt[j], mt[4][j] = et[1][0] * Nt[j] + et[1][1] * wt[j];
    return { B: mt, v: At, dJ: Math.abs(yt) };
  }, P = Math.sqrt(7 / 9), N = Math.sqrt(7 / 15), A = [[-P, -P], [P, -P], [P, P], [-P, P], [0, -N], [N, 0], [0, N], [-N, 0]], F = [9 / 49, 9 / 49, 9 / 49, 9 / 49, 40 / 49, 40 / 49, 40 / 49, 40 / 49], W = A.map(([o, Y], m) => {
    const K = tt(o, Y);
    return { B: K.B, v: K.v, w: F[m] * K.dJ };
  }), T = W.reduce((o, Y) => o + Y.w, 0), D = [p(), p(), p()];
  for (const o of W) for (let Y = 0; Y < 3; Y++) for (let m = 12; m < 22; m++) D[Y][m] += o.B[Y][m] * o.w / T;
  const ot = Array.from({ length: 22 }, () => p());
  for (const o of W) {
    for (let m = 0; m < 3; m++) for (let K = 12; K < 22; K++) o.B[m][K] -= D[m][K];
    const Y = [p(), p(), p(), p(), p()];
    for (let m = 0; m < 22; m++) {
      for (let K = 0; K < 3; K++) Y[K][m] = h[K][0] * o.B[0][m] + h[K][1] * o.B[1][m] + h[K][2] * o.B[2][m];
      Y[3][m] = w * o.B[3][m], Y[4][m] = w * o.B[4][m];
    }
    for (let m = 0; m < 22; m++) for (let K = 0; K < 22; K++) {
      let $ = 0;
      for (let E = 0; E < 5; E++) $ += o.B[E][m] * Y[E][K];
      ot[m][K] += ($ + J * s * o.v[m] * o.v[K]) * o.w;
    }
  }
  let V = 0;
  for (const o of ot) for (const Y of o) V = Math.max(V, Math.abs(Y));
  const nt = ot.map((o) => o.slice()), ct = [];
  for (let o = 12; o < 22; o++) {
    const Y = nt[o][o];
    if (Math.abs(Y) <= 1e-14 * V) continue;
    ct.push(o);
    const m = nt[o].slice(), K = nt.map(($) => $[o]);
    for (let $ = 0; $ < 22; $++) for (let E = 0; E < 22; E++) nt[$][E] -= K[$] * m[E] / Y;
    for (let $ = 0; $ < 22; $++) nt[o][$] = 0, nt[$][o] = 0;
  }
  const l = ct.length, u = ct.map((o) => ct.map((Y) => ot[o][Y])), q = ct.map((o) => {
    let Y = 0;
    for (let m = 0; m < 12; m++) Y -= ot[o][m] * e[m];
    return Y;
  });
  for (let o = 0; o < l; o++) {
    let Y = o;
    for (let m = o + 1; m < l; m++) Math.abs(u[m][o]) > Math.abs(u[Y][o]) && (Y = m);
    if ([u[o], u[Y]] = [u[Y], u[o]], [q[o], q[Y]] = [q[Y], q[o]], !(Math.abs(u[o][o]) < 1e-300)) for (let m = o + 1; m < l; m++) {
      const K = u[m][o] / u[o][o];
      for (let $ = o; $ < l; $++) u[m][$] -= K * u[o][$];
      q[m] -= K * q[o];
    }
  }
  const Q = new Array(l).fill(0);
  for (let o = l - 1; o >= 0; o--) {
    let Y = q[o];
    for (let m = o + 1; m < l; m++) Y -= u[o][m] * Q[m];
    Q[o] = Math.abs(u[o][o]) < 1e-300 ? 0 : Y / u[o][o];
  }
  const k = p();
  for (let o = 0; o < 12; o++) k[o] = e[o];
  ct.forEach((o, Y) => {
    k[o] = Q[Y];
  });
  const X = (o, Y) => {
    const { B: m } = tt(o, Y);
    for (let $ = 0; $ < 3; $++) for (let E = 12; E < 22; E++) m[$][E] -= D[$][E];
    const K = [0, 1, 2].map(($) => m[$].reduce((E, ft, pt) => E + ft * k[pt], 0));
    return [0, 1, 2].map(($) => h[$][0] * K[0] + h[$][1] * K[1] + h[$][2] * K[2]);
  };
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([o, Y]) => X(o, Y));
}
function eo(t, n) {
  const e = new Array(8).fill(0), a = new Array(8).fill(0), c = new Array(8).fill(0), f = [-1, 1, 1, -1], r = [-1, -1, 1, 1];
  for (let i = 0; i < 4; i++) {
    const h = f[i] * t, w = r[i] * n;
    e[i] = 0.25 * (1 + h) * (1 + w) * (h + w - 1), a[i] = 0.25 * f[i] * (1 + w) * (2 * h + w), c[i] = 0.25 * r[i] * (1 + h) * (h + 2 * w);
  }
  return e[4] = 0.5 * (1 - t * t) * (1 - n), a[4] = -t * (1 - n), c[4] = -0.5 * (1 - t * t), e[5] = 0.5 * (1 + t) * (1 - n * n), a[5] = 0.5 * (1 - n * n), c[5] = -n * (1 + t), e[6] = 0.5 * (1 - t * t) * (1 + n), a[6] = -t * (1 + n), c[6] = 0.5 * (1 - t * t), e[7] = 0.5 * (1 - t) * (1 - n * n), a[7] = -0.5 * (1 - n * n), c[7] = -n * (1 - t), { N: e, dNxi: a, dNet: c };
}
function ao(t, n, e, a) {
  const c = [], f = [], r = [], i = [], h = [];
  for (let v = 0; v < 4; v++) {
    const tt = v, P = (v + 1) % 4, N = t[tt] - t[P], A = n[tt] - n[P], F = N * N + A * A;
    c.push(-N / F), f.push(0.75 * N * A / F), r.push((0.25 * N * N - 0.5 * A * A) / F), i.push(-A / F), h.push((0.25 * A * A - 0.5 * N * N) / F);
  }
  const { dNxi: w, dNet: s } = eo(e, a), J = [-(1 - a) / 4, (1 - a) / 4, (1 + a) / 4, -(1 + a) / 4], d = [-(1 - e) / 4, -(1 + e) / 4, (1 + e) / 4, (1 - e) / 4];
  let b = 0, g = 0, p = 0, S = 0;
  for (let v = 0; v < 4; v++) b += J[v] * t[v], g += J[v] * n[v], p += d[v] * t[v], S += d[v] * n[v];
  const y = b * S - g * p, x = S / y, R = -g / y, _ = -p / y, M = b / y, L = new Array(12).fill(0), C = new Array(12).fill(0), Z = new Array(12).fill(0), B = new Array(12).fill(0);
  for (let v = 0; v < 4; v++) {
    const tt = (v + 3) % 4, P = v, N = 4 + tt, A = 4 + P, F = 1.5 * (c[P] * w[A] - c[tt] * w[N]), W = 1.5 * (c[P] * s[A] - c[tt] * s[N]), T = f[P] * w[A] + f[tt] * w[N], D = f[P] * s[A] + f[tt] * s[N], ot = w[v] - r[P] * w[A] - r[tt] * w[N], V = s[v] - r[P] * s[A] - r[tt] * s[N];
    L[3 * v] = F, C[3 * v] = W, L[3 * v + 1] = T, C[3 * v + 1] = D, L[3 * v + 2] = ot, C[3 * v + 2] = V;
    const nt = 1.5 * (i[P] * w[A] - i[tt] * w[N]), ct = 1.5 * (i[P] * s[A] - i[tt] * s[N]), l = -w[v] + h[P] * w[A] + h[tt] * w[N], u = -s[v] + h[P] * s[A] + h[tt] * s[N];
    Z[3 * v] = nt, B[3 * v] = ct, Z[3 * v + 1] = l, B[3 * v + 1] = u, Z[3 * v + 2] = -T, B[3 * v + 2] = -D;
  }
  const G = [new Array(12).fill(0), new Array(12).fill(0), new Array(12).fill(0)];
  for (let v = 0; v < 12; v++) {
    const tt = x * L[v] + R * C[v], P = _ * L[v] + M * C[v], N = x * Z[v] + R * B[v], A = _ * Z[v] + M * B[v];
    G[0][v] = tt, G[1][v] = A, G[2][v] = P + N;
  }
  return G;
}
function io(t, n, e, a, c, f, r = "esquinas") {
  const i = a * f * f * f / (12 * (1 - c * c)), h = [[i, i * c, 0], [i * c, i, 0], [0, 0, i * (1 - c) / 2]], w = (b, g) => {
    const p = ao(t, n, b, g), S = [0, 1, 2].map((y) => p[y].reduce((x, R, _) => x + R * e[_], 0));
    return [0, 1, 2].map((y) => h[y][0] * S[0] + h[y][1] * S[1] + h[y][2] * S[2]);
  }, s = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (r === "esquinas") return s.map(([b, g]) => w(b, g));
  const J = 1 / Math.sqrt(3), d = s.map(([b, g]) => w(b * J, g * J));
  return s.map(([b, g]) => {
    const p = b * Math.sqrt(3), S = g * Math.sqrt(3), y = s.map(([x, R]) => (1 + x * p) * (1 + R * S) / 4);
    return [0, 1, 2].map((x) => y.reduce((R, _, M) => R + _ * d[M][x], 0));
  });
}
function fo(t, n) {
  return { N: [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], dNxi: [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], dNeta: [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)] };
}
function lo(t, n, e, a) {
  let c = 0, f = 0, r = 0, i = 0;
  for (let s = 0; s < 4; s++) c += e[s] * t[s], f += e[s] * n[s], r += a[s] * t[s], i += a[s] * n[s];
  let h = c * i - f * r;
  Math.abs(h) < 1e-15 && (h = 1e-15);
  const w = 1 / h;
  return { det: h, Ji: [[i * w, -f * w], [-r * w, c * w]] };
}
function go(t, n, e, a, c, f, r = {}) {
  const i = r.tipo ?? 12, h = r.gammaFac ?? 0.4, w = r.mod ?? null;
  let s, J, d;
  if (i === 12) s = 2, J = true, d = 2e-4;
  else if (i === 3) s = 3, J = false, d = 0;
  else return null;
  const b = a / (1 - c * c), g = [[b, b * c, 0], [b * c, b, 0], [0, 0, b * (1 - c) / 2]];
  if (w) {
    const l = w[0], u = w[1], q = w[2];
    g[0][0] *= l, g[1][1] *= u, g[2][2] *= q;
    const Q = Math.sqrt(Math.max(0, l * u));
    g[0][1] *= Q, g[1][0] *= Q;
  }
  for (const l of g) for (let u = 0; u < 3; u++) l[u] *= f;
  const p = [1, 2, 3, 0], S = [3, 0, 1, 2], y = [], x = [];
  for (let l = 0; l < 4; l++) y.push((n[p[l]] - n[l]) / 8), x.push(-(t[p[l]] - t[l]) / 8);
  const R = 0.5773502691896258, _ = [-0.7745966692414834, 0, 0.7745966692414834], M = [5 / 9, 8 / 9, 5 / 9], L = s === 2 ? [-R, R] : _, C = s === 2 ? [1, 1] : M, Z = [];
  for (let l = 0; l < s; l++) for (let u = 0; u < s; u++) Z.push({ r: L[l], s: L[u], w: C[l] * C[u] });
  const B = (l, u) => {
    const { N: q, dNxi: Q, dNeta: k } = fo(l, u), { det: X, Ji: o } = lo(t, n, Q, k), Y = [], m = [];
    for (let U = 0; U < 4; U++) Y.push(o[0][0] * Q[U] + o[0][1] * k[U]), m.push(o[1][0] * Q[U] + o[1][1] * k[U]);
    const K = [-l * (1 - u), 0.5 * (1 - u * u), -l * (1 + u), -0.5 * (1 - u * u)], $ = [-0.5 * (1 - l * l), -u * (1 + l), 0.5 * (1 - l * l), -u * (1 - l)], E = [], ft = [];
    for (let U = 0; U < 4; U++) E.push(o[0][0] * K[U] + o[0][1] * $[U]), ft.push(o[1][0] * K[U] + o[1][1] * $[U]);
    const pt = -2 * l * (1 - u * u), Mt = -2 * u * (1 - l * l), Xt = o[0][0] * pt + o[0][1] * Mt, yt = o[1][0] * pt + o[1][1] * Mt, et = [], mt = [], At = [], gt = [];
    for (let U = 0; U < 4; U++) {
      const bt = S[U];
      et.push(E[bt] * y[bt] - E[U] * y[U]), mt.push(ft[bt] * y[bt] - ft[U] * y[U]), At.push(E[bt] * x[bt] - E[U] * x[U]), gt.push(ft[bt] * x[bt] - ft[U] * x[U]);
    }
    return { N: q, dNx: Y, dNy: m, dNBx: Xt, dNBy: yt, gt1: et, gt2: mt, gt3: At, gt4: gt, dJ: Math.abs(X) };
  }, G = [0, 0, 0, 0], v = [0, 0, 0, 0], tt = [0, 0, 0, 0];
  if (J) {
    let l = 0;
    for (const u of Z) {
      const q = B(u.r, u.s), Q = u.w * q.dJ;
      for (let k = 0; k < 4; k++) G[k] += q.gt1[k] * Q, v[k] += q.gt4[k] * Q, tt[k] += (q.gt2[k] + q.gt3[k]) * Q;
      l += Q;
    }
    for (let u = 0; u < 4; u++) G[u] /= l, v[u] /= l, tt[u] /= l;
  }
  const P = (l, u) => {
    const q = B(l, u), Q = [new Array(14).fill(0), new Array(14).fill(0), new Array(14).fill(0)];
    for (let k = 0; k < 4; k++) Q[0][3 * k] = q.dNx[k], Q[1][3 * k + 1] = q.dNy[k], Q[2][3 * k] = q.dNy[k], Q[2][3 * k + 1] = q.dNx[k], Q[0][3 * k + 2] = q.gt1[k] - G[k], Q[1][3 * k + 2] = q.gt4[k] - v[k], Q[2][3 * k + 2] = q.gt2[k] + q.gt3[k] - tt[k];
    return Q[0][12] = q.dNBx, Q[2][12] = q.dNBy, Q[1][13] = q.dNBy, Q[2][13] = q.dNBx, { B: Q, d: q };
  }, N = Array.from({ length: 14 }, () => new Array(14).fill(0));
  for (const l of Z) {
    const { B: u, d: q } = P(l.r, l.s), Q = l.w * q.dJ, k = [0, 1, 2].map((X) => u[0].map((o, Y) => g[X][0] * u[0][Y] + g[X][1] * u[1][Y] + g[X][2] * u[2][Y]));
    for (let X = 0; X < 14; X++) for (let o = 0; o < 14; o++) N[X][o] += (u[0][X] * k[0][o] + u[1][X] * k[1][o] + u[2][X] * k[2][o]) * Q;
  }
  {
    const l = B(0, 0), u = a / (2 * (1 + c)), q = h * u, Q = new Array(14).fill(0);
    for (let X = 0; X < 4; X++) Q[3 * X] = -0.5 * l.dNy[X], Q[3 * X + 1] = 0.5 * l.dNx[X], Q[3 * X + 2] = 0.5 * (l.gt3[X] - l.gt2[X]) - l.N[X];
    Q[12] = 0, Q[13] = 0;
    const k = q * f * 4 * l.dJ;
    for (let X = 0; X < 14; X++) for (let o = 0; o < 14; o++) N[X][o] += k * Q[X] * Q[o];
    if (d > 0) {
      let X = 0;
      for (let m = 0; m < 4; m++) {
        const K = (m + 1) % 4;
        X += t[m] * n[K] - t[K] * n[m];
      }
      X = Math.abs(X) / 2;
      const o = new Array(14).fill(0);
      for (let m = 0; m < 4; m++) o[3 * m + 2] = m % 2 === 0 ? 1 : -1;
      const Y = d * u * f * X / 4;
      for (let m = 0; m < 14; m++) for (let K = 0; K < 14; K++) N[m][K] += Y * o[m] * o[K];
    }
  }
  const A = [...e, 0, 0], F = [[N[12][12], N[12][13]], [N[13][12], N[13][13]]], W = F[0][0] * F[1][1] - F[0][1] * F[1][0];
  if (Math.abs(W) > 1e-30) {
    const l = N[12].slice(0, 12).reduce((q, Q, k) => q + Q * e[k], 0), u = N[13].slice(0, 12).reduce((q, Q, k) => q + Q * e[k], 0);
    A[12] = -(F[1][1] * l - F[0][1] * u) / W, A[13] = -(-F[1][0] * l + F[0][0] * u) / W;
  }
  const T = globalThis.__hekatanItwRec ?? "", D = A.slice();
  if (T.includes("conBurbuja") || (D[12] = 0, D[13] = 0), T.includes("sinTheta")) for (let l = 0; l < 4; l++) D[3 * l + 2] = 0;
  const ot = (l, u) => {
    const { B: q, d: Q } = P(l, u);
    if (T.includes("sinProy")) for (let X = 0; X < 4; X++) q[0][3 * X + 2] = Q.gt1[X], q[1][3 * X + 2] = Q.gt4[X], q[2][3 * X + 2] = Q.gt2[X] + Q.gt3[X];
    const k = [0, 1, 2].map((X) => q[X].reduce((o, Y, m) => o + Y * D[m], 0));
    return [0, 1, 2].map((X) => g[X][0] * k[0] + g[X][1] * k[1] + g[X][2] * k[2]);
  }, V = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (T.includes("esquinas")) return V.map(([l, u]) => ot(l, u));
  const nt = R, ct = V.map(([l, u]) => ot(l * nt, u * nt));
  return V.map(([l, u]) => {
    const q = l / nt, Q = u / nt, k = V.map(([X, o]) => (1 + X * q) * (1 + o * Q) / 4);
    return [0, 1, 2].map((X) => k.reduce((o, Y, m) => o + Y * ct[m][X], 0));
  });
}
const zt = 1 / Math.sqrt(3);
function $t(t, n) {
  const e = [0.25 * (1 - t) * (1 - n), 0.25 * (1 + t) * (1 - n), 0.25 * (1 + t) * (1 + n), 0.25 * (1 - t) * (1 + n)], a = [-0.25 * (1 - n), 0.25 * (1 - n), 0.25 * (1 + n), -0.25 * (1 + n)], c = [-0.25 * (1 - t), -0.25 * (1 + t), 0.25 * (1 + t), 0.25 * (1 - t)];
  return { N: e, dNdxi: a, dNdeta: c };
}
function Wt(t, n, e, a) {
  let c = 0, f = 0, r = 0, i = 0;
  for (let d = 0; d < 4; d++) c += t[d] * e[d], f += t[d] * a[d], r += n[d] * e[d], i += n[d] * a[d];
  const h = c * i - f * r, w = 1 / h, s = [], J = [];
  for (let d = 0; d < 4; d++) s.push(w * (i * t[d] - f * n[d])), J.push(w * (-r * t[d] + c * n[d]));
  return { dNdx: s, dNdy: J, detJ: h, J: [c, f, r, i] };
}
function ho(t, n, e, a, c, f) {
  const r = e * c / (1 - a * a), i = [[r, r * a, 0], [r * a, r, 0], [0, 0, r * (1 - a) / 2]], h = [1, 2, 3, 0], w = [3, 0, 1, 2], s = [], J = [];
  for (let N = 0; N < 4; N++) s.push((n[h[N]] - n[N]) / 8), J.push(-(t[h[N]] - t[N]) / 8);
  const d = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)], b = [5 / 9, 8 / 9, 5 / 9], g = Qt(14, 14);
  let p = [], S = [], y = [], x = [], R = [], _ = 0, M = 0, L = 0;
  for (let N = 0; N < 3; N++) for (let A = 0; A < 3; A++) {
    const F = d[N], W = d[A], T = b[N] * b[A], { N: D, dNdxi: ot, dNdeta: V } = $t(F, W);
    let nt = 0, ct = 0, l = 0, u = 0;
    for (let z = 0; z < 4; z++) nt += ot[z] * t[z], ct += ot[z] * n[z], l += V[z] * t[z], u += V[z] * n[z];
    const q = nt * u - ct * l, Q = u / q, k = -ct / q, X = -l / q, o = nt / q, Y = [], m = [];
    for (let z = 0; z < 4; z++) Y.push(Q * ot[z] + k * V[z]), m.push(X * ot[z] + o * V[z]);
    const K = [-F * (1 - W), 0.5 * (1 - W * W), -F * (1 + W), -0.5 * (1 - W * W)], $ = [-0.5 * (1 - F * F), -W * (1 + F), 0.5 * (1 - F * F), -W * (1 - F)], E = [], ft = [];
    for (let z = 0; z < 4; z++) E.push(Q * K[z] + k * $[z]), ft.push(X * K[z] + o * $[z]);
    const pt = -2 * F * (1 - W * W), Mt = -2 * W * (1 - F * F), Xt = Q * pt + k * Mt, yt = X * pt + o * Mt, et = [], mt = [], At = [], gt = [];
    for (let z = 0; z < 4; z++) {
      const ht = w[z];
      et.push(E[ht] * s[ht] - E[z] * s[z]), mt.push(ft[ht] * s[ht] - ft[z] * s[z]), At.push(E[ht] * J[ht] - E[z] * J[z]), gt.push(ft[ht] * J[ht] - ft[z] * J[z]);
    }
    const U = Qt(3, 14);
    for (let z = 0; z < 4; z++) U[0][3 * z] = Y[z], U[1][3 * z + 1] = m[z], U[2][3 * z] = m[z], U[2][3 * z + 1] = Y[z], U[0][3 * z + 2] = et[z], U[1][3 * z + 2] = gt[z], U[2][3 * z + 2] = mt[z] + At[z];
    U[0][12] = Xt, U[2][12] = yt, U[1][13] = yt, U[2][13] = Xt;
    const bt = T * Math.abs(q);
    for (let z = 0; z < 14; z++) for (let ht = 0; ht < 14; ht++) {
      let Nt = 0;
      for (let wt = 0; wt < 3; wt++) for (let j = 0; j < 3; j++) Nt += U[wt][z] * i[wt][j] * U[j][ht];
      g[z][ht] += bt * Nt;
    }
    N === 1 && A === 1 && (p = D.slice(), S = Y.slice(), y = m.slice(), x = mt.slice(), R = At.slice(), _ = Xt, M = yt, L = Math.abs(q));
  }
  const C = e / (2 * (1 + a)), Z = new Array(14).fill(0);
  for (let N = 0; N < 4; N++) Z[3 * N] = -0.5 * y[N], Z[3 * N + 1] = 0.5 * S[N], Z[3 * N + 2] = 0.5 * (R[N] - x[N]) - p[N];
  Z[12] = -0.5 * M, Z[13] = 0.5 * _;
  const B = f * C * c * 4 * L;
  for (let N = 0; N < 14; N++) for (let A = 0; A < 14; A++) g[N][A] += B * Z[N] * Z[A];
  const G = [[g[12][12], g[12][13]], [g[13][12], g[13][13]]], v = G[0][0] * G[1][1] - G[0][1] * G[1][0], tt = Qt(12, 12);
  for (let N = 0; N < 12; N++) for (let A = 0; A < 12; A++) tt[N][A] = g[N][A];
  if (Math.abs(v) < 1e-30) return tt;
  const P = [[G[1][1] / v, -G[0][1] / v], [-G[1][0] / v, G[0][0] / v]];
  for (let N = 0; N < 12; N++) for (let A = 0; A < 12; A++) {
    let F = 0;
    for (let W = 0; W < 2; W++) for (let T = 0; T < 2; T++) F += g[N][12 + W] * P[W][T] * g[12 + T][A];
    tt[N][A] -= F;
  }
  return tt;
}
function uo(t, n, e, a, c) {
  const f = Qt(12, 12), r = e * c * c * c / (12 * (1 - a * a)), h = 5 / 6 * e / (2 * (1 + a)) * c, w = [[-zt, -zt], [zt, -zt], [zt, zt], [-zt, zt]], s = [{ xi: 0, eta: -1 }, { xi: 0, eta: 1 }, { xi: -1, eta: 0 }, { xi: 1, eta: 0 }], J = [];
  for (const d of s) {
    const { N: b, dNdxi: g, dNdeta: p } = $t(d.xi, d.eta), { dNdx: S, dNdy: y, J: x } = Wt(g, p, t, n), R = Qt(2, 12);
    for (let B = 0; B < 4; B++) R[0][B * 3] = S[B], R[0][B * 3 + 1] = -b[B], R[1][B * 3] = y[B], R[1][B * 3 + 2] = -b[B];
    const [_, M, L, C] = x, Z = Qt(2, 12);
    for (let B = 0; B < 12; B++) Z[0][B] = _ * R[0][B] + M * R[1][B], Z[1][B] = L * R[0][B] + C * R[1][B];
    J.push(Z);
  }
  for (const [d, b] of w) {
    const { dNdxi: g, dNdeta: p } = $t(d, b), { dNdx: S, dNdy: y, detJ: x, J: R } = Wt(g, p, t, n), _ = Qt(3, 12);
    for (let A = 0; A < 4; A++) _[0][A * 3 + 1] = S[A], _[1][A * 3 + 2] = y[A], _[2][A * 3 + 1] = y[A], _[2][A * 3 + 2] = S[A];
    for (let A = 0; A < 12; A++) for (let F = 0; F < 12; F++) {
      let W = 0;
      W += r * (_[0][A] * _[0][F] + a * _[0][A] * _[1][F] + a * _[1][A] * _[0][F] + _[1][A] * _[1][F]), W += r * (1 - a) / 2 * _[2][A] * _[2][F], f[A][F] += W * Math.abs(x);
    }
    const M = Qt(2, 12), L = 0.5 * (1 - b), C = 0.5 * (1 + b), Z = 0.5 * (1 - d), B = 0.5 * (1 + d), [G, v, tt, P] = R, N = 1 / x;
    for (let A = 0; A < 12; A++) {
      const F = L * J[0][0][A] + C * J[1][0][A], W = Z * J[2][1][A] + B * J[3][1][A];
      M[0][A] = N * (P * F - v * W), M[1][A] = N * (-tt * F + G * W);
    }
    for (let A = 0; A < 12; A++) for (let F = 0; F < 12; F++) f[A][F] += h * (M[0][A] * M[0][F] + M[1][A] * M[1][F]) * Math.abs(x);
  }
  return f;
}
function po(t, n, e) {
  var _a, _b, _c;
  const a = ((_a = n == null ? void 0 : n.elasticities) == null ? void 0 : _a.get(e)) ?? 0, c = ((_b = n == null ? void 0 : n.poissonsRatios) == null ? void 0 : _b.get(e)) ?? 0.2, f = ((_c = n == null ? void 0 : n.thicknesses) == null ? void 0 : _c.get(e)) ?? 0;
  if (a === 0 || f === 0) return Qt(24, 24);
  const { localCoords: r } = no(t), i = r.map((y) => y[0]), h = r.map((y) => y[1]), w = uo(i, h, a, c, f), J = ho(i, h, a, c, f, 0.4), d = Qt(24, 24), b = [2, 3, 4, 8, 9, 10, 14, 15, 16, 20, 21, 22], g = [[1, 0, 0], [0, 0, -1], [0, 1, 0]], p = Qt(12, 12);
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
    let R = 0;
    const _ = y / 3 | 0, M = y % 3, L = x / 3 | 0, C = x % 3;
    for (let Z = 0; Z < 3; Z++) {
      const B = g[Z][M];
      if (B !== 0) for (let G = 0; G < 3; G++) {
        const v = g[G][C];
        v !== 0 && (R += B * w[_ * 3 + Z][L * 3 + G] * v);
      }
    }
    p[y][x] = R;
  }
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) d[b[y]][b[x]] += p[y][x];
  const S = [0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23];
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) d[S[y]][S[x]] += J[y][x];
  return d;
}
function yo(t) {
  const { localX: n, localY: e, localZ: a } = no(t), c = [[n[0], n[1], n[2]], [e[0], e[1], e[2]], [a[0], a[1], a[2]]], f = Qt(24, 24);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 2; i++) {
    const h = r * 6 + i * 3;
    for (let w = 0; w < 3; w++) for (let s = 0; s < 3; s++) f[h + w][h + s] = c[w][s];
  }
  return f;
}
function no(t) {
  const n = [t[2][0] - t[0][0], t[2][1] - t[0][1], t[2][2] - t[0][2]], e = [t[3][0] - t[1][0], t[3][1] - t[1][1], t[3][2] - t[1][2]], a = Ut(n, e), c = Math.sqrt(a[0] ** 2 + a[1] ** 2 + a[2] ** 2), f = a.map((g) => g / c), r = [t[1][0] - t[0][0], t[1][1] - t[0][1], t[1][2] - t[0][2]], i = Math.sqrt(r[0] ** 2 + r[1] ** 2 + r[2] ** 2), h = r.map((g) => g / i), w = Ut(f, h), s = t.map((g) => g[0]).reduce((g, p) => g + p) / 4, J = t.map((g) => g[1]).reduce((g, p) => g + p) / 4, d = t.map((g) => g[2]).reduce((g, p) => g + p) / 4, b = t.map((g) => {
    const p = g[0] - s, S = g[1] - J, y = g[2] - d;
    return [p * h[0] + S * h[1] + y * h[2], p * w[0] + S * w[1] + y * w[2]];
  });
  return { localX: h, localY: w, localZ: f, localCoords: b };
}
function Ut(t, n) {
  return [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
}
function Qt(t, n) {
  return Array.from({ length: t }, () => Array(n).fill(0));
}
function It(t, n = 0) {
  if (t.length === 2) return mo(t, n);
  if (t.length === 3) return Mo(t);
  if (t.length === 4) return yo(t);
}
function mo(t, n = 0) {
  const e = (s) => {
    if (Math.abs(n) < 1e-12) return s;
    const J = n * Math.PI / 180, d = Math.cos(J), b = Math.sin(J);
    return [s[0], [d * s[1][0] + b * s[2][0], d * s[1][1] + b * s[2][1], d * s[1][2] + b * s[2][2]], [-b * s[1][0] + d * s[2][0], -b * s[1][1] + d * s[2][1], -b * s[1][2] + d * s[2][2]]];
  }, a = oo(t[1], t[0]), c = Ct(a), f = Pt(a, [1, 0, 0]) / c, r = Pt(a, [0, 1, 0]) / c, i = Pt(a, [0, 0, 1]) / c, h = Math.sqrt(f ** 2 + r ** 2);
  if (h < 1e-9) {
    const s = i > 0 ? 1 : -1, J = [[0, 0, s], [1, 0, 0], [0, s, 0]];
    return Ht(Gt(4), e(J)).toArray();
  }
  const w = [[f, r, i], [-f * i / h, -r * i / h, h], [r / h, -f / h, 0]];
  return Ht(Gt(4), e(w)).toArray();
}
function Mo(t) {
  const f = [t[0], t[1], t[2]], r = lt(3, 3).toArray();
  for (let M = 0; M < 3; M++) for (let L = 0; L < 3; L++) r[M][L] = f[L][M];
  const i = [-1, 1, 0], h = [-1, 0, 1], w = lt(3, 2).toArray();
  for (let M = 0; M < 3; M++) for (let L = 0; L < 3; L++) w[M][0] += r[M][L] * i[L], w[M][1] += r[M][L] * h[L];
  const s = w.map((M) => M[0]), J = w.map((M) => M[1]);
  let d = Vt(s, J), b = Ct(d);
  if (b === 0) return console.warn("Degenerate triangle: nodes are collinear or coincident."), lt(18, 18).toArray();
  d = d.map((M) => M / b);
  const g = [...d], p = Gt(3).toArray(), S = d[0];
  let y;
  if (Math.abs(S) > 1 - 1e-10) {
    const M = d[2];
    y = p.map((L, C) => L[2] - M * d[C]);
  } else y = p.map((M, L) => M[0] - S * d[L]);
  if (b = Ct(y), b === 0) return console.warn("Degenerate local X-axis detected."), lt(18, 18).toArray();
  y = y.map((M) => M / b);
  let x = Vt(g, y);
  if (b = Ct(x), b === 0) return console.warn("Degenerate local Y-axis detected."), lt(18, 18).toArray();
  x = x.map((M) => M / b);
  const R = [y, x, g], _ = lt(18, 18).toArray();
  for (let M = 0; M < 3; M++) {
    const L = M * 6, C = L + 3;
    for (let Z = 0; Z < 3; Z++) for (let B = 0; B < 3; B++) _[L + Z][L + B] = R[Z][B], _[C + Z][C + B] = R[Z][B];
  }
  return _;
}
function bo(t, n, e) {
  var _a, _b, _c;
  if (t.length === 2) {
    let a = vo(t, n, e);
    const c = (_a = n == null ? void 0 : n.partialFixitySprings) == null ? void 0 : _a.get(e);
    c && (a = Ao(a, c));
    const f = (_b = n == null ? void 0 : n.momentReleases) == null ? void 0 : _b.get(e);
    f && (a = wo(a, f));
    const r = (_c = n == null ? void 0 : n.endOffsets) == null ? void 0 : _c.get(e);
    if (r && r[2] > 0 && (r[0] > 0 || r[1] > 0)) {
      const i = Xo(r[2] * r[0], r[2] * r[1]);
      a = No(i, a, i);
    }
    return a;
  }
  if (t.length === 3) return jo(t, n, e);
  if (t.length === 4) return po(t, n, e);
}
function Ao(t, n) {
  const e = t.map((c) => [...c]), a = Math.min(n.length, 12);
  for (let c = 0; c < a; c++) n[c] > 1e-12 && (e[c][c] += n[c]);
  return e;
}
function wo(t, n) {
  const e = [];
  if (n.length >= 12) for (let g = 0; g < 12; g++) n[g] && e.push(g);
  else {
    const g = [3, 4, 5, 9, 10, 11];
    for (let p = 0; p < Math.min(n.length, 6); p++) n[p] && e.push(g[p]);
  }
  if (e.length === 0) return t;
  const a = t.length, c = [];
  for (let g = 0; g < a; g++) e.includes(g) || c.push(g);
  const f = c.length, r = e.length, i = Array.from({ length: r }, (g, p) => Array.from({ length: r }, (S, y) => t[e[p]][e[y]])), h = Array.from({ length: f }, (g, p) => Array.from({ length: r }, (S, y) => t[c[p]][e[y]])), w = Array.from({ length: r }, (g, p) => Array.from({ length: f }, (S, y) => t[e[p]][c[y]])), s = Yo(i);
  if (!s) return t;
  const J = to(h, s), d = to(J, w), b = Array.from({ length: a }, () => Array(a).fill(0));
  for (let g = 0; g < f; g++) for (let p = 0; p < f; p++) b[c[g]][c[p]] = t[c[g]][c[p]] - d[g][p];
  return b;
}
function to(t, n) {
  const e = t.length, a = n[0].length, c = n.length, f = Array.from({ length: e }, () => Array(a).fill(0));
  for (let r = 0; r < e; r++) for (let i = 0; i < a; i++) for (let h = 0; h < c; h++) f[r][i] += t[r][h] * n[h][i];
  return f;
}
function Yo(t) {
  const n = t.length, e = t.map((a, c) => {
    const f = [...a];
    for (let r = 0; r < n; r++) f.push(c === r ? 1 : 0);
    return f;
  });
  for (let a = 0; a < n; a++) {
    let c = a;
    for (let r = a + 1; r < n; r++) Math.abs(e[r][a]) > Math.abs(e[c][a]) && (c = r);
    if ([e[a], e[c]] = [e[c], e[a]], Math.abs(e[a][a]) < 1e-15) return null;
    const f = e[a][a];
    for (let r = 0; r < 2 * n; r++) e[a][r] /= f;
    for (let r = 0; r < n; r++) {
      if (r === a) continue;
      const i = e[r][a];
      for (let h = 0; h < 2 * n; h++) e[r][h] -= i * e[a][h];
    }
  }
  return e.map((a) => a.slice(n));
}
function Xo(t, n) {
  const e = Array.from({ length: 12 }, (a, c) => Array.from({ length: 12 }, (f, r) => c === r ? 1 : 0));
  return Math.abs(t) > 1e-12 && (e[1][5] = t, e[2][4] = -t), Math.abs(n) > 1e-12 && (e[7][11] = -n, e[8][10] = n), e;
}
function No(t, n, e) {
  const a = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let f = 0; f < 12; f++) for (let r = 0; r < 12; r++) {
    let i = 0;
    for (let h = 0; h < 12; h++) i += t[h][f] * n[h][r];
    a[f][r] = i;
  }
  const c = Array.from({ length: 12 }, () => Array(12).fill(0));
  for (let f = 0; f < 12; f++) for (let r = 0; r < 12; r++) {
    let i = 0;
    for (let h = 0; h < 12; h++) i += a[f][h] * e[h][r];
    c[f][r] = i;
  }
  return c;
}
function vo(t, n, e) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const a = ((_a = n == null ? void 0 : n.momentsOfInertiaZ) == null ? void 0 : _a.get(e)) ?? 0, c = ((_b = n == null ? void 0 : n.momentsOfInertiaY) == null ? void 0 : _b.get(e)) ?? 0, f = ((_c = n == null ? void 0 : n.elasticities) == null ? void 0 : _c.get(e)) ?? 0, r = ((_d = n == null ? void 0 : n.areas) == null ? void 0 : _d.get(e)) ?? 0, i = ((_e = n == null ? void 0 : n.shearModuli) == null ? void 0 : _e.get(e)) ?? 0, h = ((_f = n == null ? void 0 : n.torsionalConstants) == null ? void 0 : _f.get(e)) ?? 0, w = Ct(oo(t[0], t[1]));
  if (w < 1e-12) return console.warn(`[hekatan-fem] barra ${e} de longitud CERO: matriz nula (no aporta rigidez). Mismo criterio que getLocalStiffnessMatrix.cpp.`), Array.from({ length: 12 }, () => new Array(12).fill(0));
  const s = (_g = n == null ? void 0 : n.endOffsets) == null ? void 0 : _g.get(e), J = s && s[2] > 0 ? w - s[2] * (s[0] + s[1]) : w;
  if (J <= 1e-9) throw new Error(`end offsets se comen la barra ${e}: L = ${w.toFixed(4)} m, rz = ${s[2]}, offsets ${s[0]} y ${s[1]} -> Lf = ${J.toFixed(4)} m`);
  let d = ((_h = n == null ? void 0 : n.shearAreasY) == null ? void 0 : _h.get(e)) ?? 0, b = ((_i = n == null ? void 0 : n.shearAreasZ) == null ? void 0 : _i.get(e)) ?? 0;
  d === 0 && b === 0 && r > 0 && i > 0 && (d = b = 5 / 6 * r);
  const g = b > 0 && i > 0 ? 12 * f * a / (i * b * J ** 2) : 0, p = d > 0 && i > 0 ? 12 * f * c / (i * d * J ** 2) : 0, S = f * r / w, y = i * h / w, x = 12 * f * a / J ** 3 / (1 + g), R = 6 * f * a / J ** 2 / (1 + g), _ = 4 * f * a / J * (1 + g / 4) / (1 + g), M = 2 * f * a / J * (1 - g / 2) / (1 + g), L = 12 * f * c / J ** 3 / (1 + p), C = 6 * f * c / J ** 2 / (1 + p), Z = 4 * f * c / J * (1 + p / 4) / (1 + p), B = 2 * f * c / J * (1 - p / 2) / (1 + p);
  return [[S, 0, 0, 0, 0, 0, -S, 0, 0, 0, 0, 0], [0, x, 0, 0, 0, R, 0, -x, 0, 0, 0, R], [0, 0, L, 0, -C, 0, 0, 0, -L, 0, -C, 0], [0, 0, 0, y, 0, 0, 0, 0, 0, -y, 0, 0], [0, 0, -C, 0, Z, 0, 0, 0, C, 0, B, 0], [0, R, 0, 0, 0, _, 0, -R, 0, 0, 0, M], [-S, 0, 0, 0, 0, 0, S, 0, 0, 0, 0, 0], [0, -x, 0, 0, 0, -R, 0, x, 0, 0, 0, -R], [0, 0, -L, 0, C, 0, 0, 0, L, 0, C, 0], [0, 0, 0, -y, 0, 0, 0, 0, 0, y, 0, 0], [0, 0, -C, 0, B, 0, 0, 0, C, 0, Z, 0], [0, R, 0, 0, 0, M, 0, -R, 0, 0, 0, _]];
}
function jo(t, n, e) {
  var _a, _b, _c, _d, _e;
  const a = ((_a = n.elasticities) == null ? void 0 : _a.get(e)) ?? 0, c = ((_b = n.elasticitiesOrthogonal) == null ? void 0 : _b.get(e)) ?? 0, f = ((_c = n.poissonsRatios) == null ? void 0 : _c.get(e)) ?? 0, r = ((_d = n.shearModuli) == null ? void 0 : _d.get(e)) ?? 0, i = ((_e = n.thicknesses) == null ? void 0 : _e.get(e)) ?? 0, h = c > 0, w = h ? tt(a, c, r, f, i) : G(a, f, i), s = h ? P(r, i) : v(a, f, i), J = h ? co(a, c, r, f) : so(a, f), d = t.map(([T, D]) => [T, D]), b = d[1][0] - d[0][0], g = d[2][0] - d[0][0], p = d[0][1] - d[1][1], S = d[2][1] - d[0][1], y = 0.5 * (b * S - g * -p), x = N(d), R = F(d), _ = W(d, J, i), M = it(it(Rt(x), s), x), L = it(it(Rt(R), w), R), C = lt(18, 18).toArray(), Z = it(Ot(M, L), y), B = [[0, 1, 5], [6, 7, 11], [12, 13, 17]];
  for (let T = 0; T < 3; T++) for (let D = 0; D < 3; D++) for (let ot = 0; ot < 3; ot++) {
    const V = B[T][D], nt = B[ot][D];
    C[V][nt] = _[T * 3 + D][ot * 3 + D];
  }
  for (let T = 0; T < 18; T++) for (let D = 0; D < 18; D++) C[T][D] = (C[T][D] ?? 0) + Z.get([T, D]);
  return C;
  function G(T, D, ot) {
    const V = T / (1 - D * D), nt = at([[V, V * D, 0], [V * D, V, 0], [0, 0, V * (1 - D) / 2]]);
    return it(ot ** 3 / 12, nt);
  }
  function v(T, D, ot) {
    const V = 0.8333333333333334, nt = T / (2 * (1 + D)), ct = V * nt * ot;
    return at([[ct, 0], [0, ct]]);
  }
  function tt(T, D, ot, V, nt) {
    const ct = D * V / T, l = 1 - V * ct, u = T / l, q = D / l, Q = V * D / l, X = at([[u, Q, 0], [Q, q, 0], [0, 0, ot]]);
    return it(nt ** 3 / 12, X);
  }
  function P(T, D) {
    const V = 0.8333333333333334 * T * D;
    return at([[V, 0], [0, V]]);
  }
  function N(T) {
    const D = lt(2, 18).toArray(), [ot, V] = T[0], [nt, ct] = T[1], [l, u] = T[2], q = 0.5 * ((nt - ot) * (u - V) - (l - ot) * -(V - ct)), Q = (ot + nt + l) / 3, k = (V + ct + u) / 3, X = [Q, ot, nt], o = [k, V, ct], Y = [Q, nt, l], m = [k, ct, u], K = [Q, l, ot], $ = [k, u, V], E = 1 / 3, [ft, pt, Mt, Xt] = A(X, o), [yt, et, mt, At] = A(Y, m), [gt, U, bt, z] = A(K, $), ht = lt(2, 18).toArray(), Nt = lt(2, 18).toArray(), wt = lt(2, 18).toArray();
    for (let j = 0; j < 2; j++) for (let H = 0; H < 6; H++) ht[j][H] = E * ft[j][H] + pt[j][H], ht[j][H + 6] = E * ft[j][H] + Mt[j][H], ht[j][H + 12] = E * ft[j][H], Nt[j][H] = E * yt[j][H], Nt[j][H + 6] = E * yt[j][H] + et[j][H], Nt[j][H + 12] = E * yt[j][H] + mt[j][H], wt[j][H] = E * gt[j][H] + bt[j][H], wt[j][H + 6] = E * gt[j][H], wt[j][H + 12] = E * gt[j][H] + U[j][H];
    for (let j = 0; j < 2; j++) for (let H = 0; H < 18; H++) ht[j][H] *= Xt, Nt[j][H] *= At, wt[j][H] *= z, D[j][H] = (ht[j][H] + Nt[j][H] + wt[j][H]) / q;
    return D;
  }
  function A(T, D) {
    const ot = lt(2, 6).toArray(), V = lt(2, 6).toArray(), nt = lt(2, 6).toArray(), ct = T[1] - T[0], l = T[0] - T[2], u = D[2] - D[0], q = D[0] - D[1], Q = T[2] - T[1], k = D[1] - D[2], X = 0.5 * (ct * u - l * q), o = 0.5 * q * l, Y = 0.5 * u * ct, m = 0.5 * ct * l, K = 0.5 * q * u;
    return ot[0][2] = 0.5 * Q / X, ot[0][3] = -0.5, ot[1][2] = 0.5 * k / X, ot[1][4] = 0.5, V[0][2] = 0.5 * l / X, V[0][3] = 0.5 * o / X, V[0][4] = 0.5 * m / X, V[1][2] = 0.5 * u / X, V[1][3] = 0.5 * K / X, V[1][4] = 0.5 * Y / X, nt[0][2] = 0.5 * ct / X, nt[0][3] = -0.5 * Y / X, nt[0][4] = -0.5 * m / X, nt[1][2] = 0.5 * q / X, nt[1][3] = -0.5 * K / X, nt[1][4] = -0.5 * o / X, [ot, V, nt, X];
  }
  function F(T) {
    const D = lt(3, 18).toArray(), [ot, V] = T[0], [nt, ct] = T[1], [l, u] = T[2], q = nt - ot, Q = l - ot, k = l - nt, X = ct - u, o = u - V, Y = V - ct, m = 0.5 * (q * o - Q * -Y), K = X / (2 * m), $ = k / (2 * m), E = o / (2 * m), ft = -Q / (2 * m), pt = Y / (2 * m), Mt = q / (2 * m);
    return D[0][4] = K, D[0][10] = E, D[0][16] = pt, D[1][3] = -$, D[1][9] = -ft, D[1][15] = -Mt, D[2][3] = -K, D[2][4] = $, D[2][9] = -E, D[2][10] = ft, D[2][15] = -pt, D[2][16] = Mt, D;
  }
  function W(T, D, ot) {
    let V = lt(9, 9).toArray(), nt = lt(9, 9).toArray(), ct = lt(9, 9).toArray(), l = lt(9, 3).toArray(), u = lt(3, 9).toArray(), q = lt(3, 3).toArray(), Q = lt(3, 3).toArray(), k = lt(3, 3).toArray(), X = lt(3, 3).toArray(), o = lt(3, 3).toArray(), Y = lt(3, 3).toArray(), m = lt(3, 3).toArray(), K = lt(3, 3).toArray();
    const $ = 1 / 8, E = $ / 6, ft = $ ** 2 / 4, pt = 1, Mt = 2, Xt = 1, yt = 0, et = 1, mt = -1, At = -1, gt = -1, U = -2, bt = T[0][0], z = T[0][1], ht = T[1][0], Nt = T[1][1], wt = T[2][0], j = T[2][1], H = bt - ht, Yt = ht - wt, jt = wt - bt, vt = z - Nt, Tt = Nt - j, Lt = j - z, kt = -H, _t = -Yt, xt = -jt, Bt = -vt, Dt = -Tt, qt = -Lt, O = 0.5 * (kt * Lt - jt * -vt), rt = 2 * O, st = 4 * O, I = 0.5 * ot, Kt = O * ot, Jt = kt ** 2 + Bt ** 2, dt = _t ** 2 + Dt ** 2, St = xt ** 2 + qt ** 2;
    l[0][0] = I * Tt, l[0][2] = I * _t, l[1][1] = I * _t, l[1][2] = I * Tt, l[2][0] = I * Tt * (qt - Bt) * E, l[2][1] = I * _t * (jt - H) * E, l[2][2] = I * (jt * qt - H * Bt) * 2 * E, l[3][0] = I * Lt, l[3][2] = I * xt, l[4][1] = I * xt, l[4][2] = I * Lt, l[5][0] = I * Lt * (Bt - Dt) * E, l[5][1] = I * xt * (H - Yt) * E, l[5][2] = I * (H * Bt - Yt * Dt) * 2 * E, l[6][0] = I * vt, l[6][2] = I * kt, l[7][1] = I * kt, l[7][2] = I * vt, l[8][0] = I * vt * (Dt - qt) * E, l[8][1] = I * kt * (Yt - jt) * E, l[8][2] = I * (Yt * Dt - jt * qt) * 2 * E, ct = it(it(at(l), D), Rt(at(l))).toArray(), ct = it(at(ct), 1 / Kt).toArray(), u[0][0] = _t / st, u[0][1] = Dt / st, u[0][2] = 1, u[0][3] = xt / st, u[0][4] = qt / st, u[0][6] = kt / st, u[0][7] = Bt / st, u[1][0] = _t / st, u[1][1] = Dt / st, u[1][3] = xt / st, u[1][4] = qt / st, u[1][5] = 1, u[1][6] = kt / st, u[1][7] = Bt / st, u[2][0] = _t / st, u[2][1] = Dt / st, u[2][3] = xt / st, u[2][4] = qt / st, u[2][6] = kt / st, u[2][7] = Bt / st, u[2][8] = 1;
    const Ft = 1 / (O * st);
    q[0][0] = Ft * Tt * qt * Jt, q[0][1] = Ft * Lt * Bt * dt, q[0][2] = Ft * vt * Dt * St, q[1][0] = Ft * Yt * xt * Jt, q[1][1] = Ft * jt * kt * dt, q[1][2] = Ft * H * _t * St, q[2][0] = Ft * (Tt * jt + _t * qt) * Jt, q[2][1] = Ft * (Lt * H + xt * Bt) * dt, q[2][2] = Ft * (vt * Yt + kt * Dt) * St;
    const ut = rt / 3;
    Q[0][0] = ut * pt / Jt, Q[0][1] = ut * Mt / Jt, Q[0][2] = ut * Xt / Jt, Q[1][0] = ut * yt / dt, Q[1][1] = ut * et / dt, Q[1][2] = ut * mt / dt, Q[2][0] = ut * At / St, Q[2][1] = ut * gt / St, Q[2][2] = ut * U / St, k[0][0] = ut * U / Jt, k[0][1] = ut * At / Jt, k[0][2] = ut * gt / Jt, k[1][0] = ut * Xt / dt, k[1][1] = ut * pt / dt, k[1][2] = ut * Mt / dt, k[2][0] = ut * mt / St, k[2][1] = ut * yt / St, k[2][2] = ut * et / St, X[0][0] = ut * et / Jt, X[0][1] = ut * mt / Jt, X[0][2] = ut * yt / Jt, X[1][0] = ut * gt / dt, X[1][1] = ut * U / dt, X[1][2] = ut * At / dt, X[2][0] = ut * Mt / St, X[2][1] = ut * Xt / St, X[2][2] = ut * pt / St, o = it(Ot(at(Q), at(k)), 0.5).toArray(), Y = it(Ot(at(k), at(X)), 0.5).toArray(), m = it(Ot(at(X), at(Q)), 0.5).toArray();
    const Zt = it(it(Rt(at(q)), D), at(q));
    return K = Ot(Ot(it(it(Rt(at(o)), Zt), at(o)), it(it(Rt(at(Y)), Zt), at(Y))), it(it(Rt(at(m)), Zt), at(m))).toArray(), K = it(at(K), 3 / 4 * ft * Kt).toArray(), nt = it(it(Rt(at(u)), at(K)), at(u)).toArray(), V = Ot(at(ct), at(nt)).toArray(), V;
  }
}
function so(t, n) {
  const e = t / (1 - n * n);
  return at([[e, e * n, 0], [e * n, e, 0], [0, 0, e * (1 - n) / 2]]);
}
function co(t, n, e, a) {
  const c = n * a / t, f = 1 - a * c, r = t / f, i = n / f, h = a * n / f;
  return at([[r, h, 0], [h, i, 0], [0, 0, e]]);
}
function Qo(t, n, e, a) {
  const c = { normals: /* @__PURE__ */ new Map(), shearsY: /* @__PURE__ */ new Map(), shearsZ: /* @__PURE__ */ new Map(), torsions: /* @__PURE__ */ new Map(), bendingsY: /* @__PURE__ */ new Map(), bendingsZ: /* @__PURE__ */ new Map(), bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() }, f = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = { bendingXX: /* @__PURE__ */ new Map(), bendingYY: /* @__PURE__ */ new Map(), bendingXY: /* @__PURE__ */ new Map(), membraneXX: /* @__PURE__ */ new Map(), membraneYY: /* @__PURE__ */ new Map(), membraneXY: /* @__PURE__ */ new Map(), tranverseShearX: /* @__PURE__ */ new Map(), tranverseShearY: /* @__PURE__ */ new Map(), vonMises: /* @__PURE__ */ new Map() };
  n.forEach((w, s) => {
    var _a, _b, _c, _d;
    const J = w.map((b) => t[b]), d = w.reduce((b, g) => {
      var _a2;
      const p = (_a2 = a.deformations) == null ? void 0 : _a2.get(g);
      return b.concat(p ?? [0, 0, 0, 0, 0, 0]);
    }, []);
    if (w.length === 2) {
      const b = It(J, ((_a = e == null ? void 0 : e.localAngles) == null ? void 0 : _a.get(s)) ?? 0), g = it(b, d), p = bo(J, e, s);
      let S = it(p, g);
      const y = (_b = e == null ? void 0 : e.frameLoads) == null ? void 0 : _b.get(s);
      if (y && (y[0] || y[1] || y[2])) {
        const x = J[0], R = J[1], _ = [R[0] - x[0], R[1] - x[1], R[2] - x[2]], M = Math.hypot(_[0], _[1], _[2]);
        if (M > 1e-9) {
          const L = [_[0] / M, _[1] / M, _[2] / M], C = M * M / 12, Z = [L[1] * y[2] - L[2] * y[1], L[2] * y[0] - L[0] * y[2], L[0] * y[1] - L[1] * y[0]], B = [-y[0] * M / 2, -y[1] * M / 2, -y[2] * M / 2, -C * Z[0], -C * Z[1], -C * Z[2], -y[0] * M / 2, -y[1] * M / 2, -y[2] * M / 2, +C * Z[0], +C * Z[1], +C * Z[2]], G = it(b, B);
          S = S.map((v, tt) => v + G[tt]);
        }
      }
      c.normals.set(s, [S[0], S[6]]), c.shearsY.set(s, [S[1], S[7]]), c.shearsZ.set(s, [S[2], S[8]]), c.torsions.set(s, [S[3], S[9]]), c.bendingsY.set(s, [S[4], S[10]]), c.bendingsZ.set(s, [S[5], S[11]]);
    } else if (w.length === 4) {
      const b = Jo(J, d, e, s);
      i.membraneXX.set(s, b.Nx), i.membraneYY.set(s, b.Ny), i.membraneXY.set(s, b.Nxy), i.bendingXX.set(s, b.Mx), i.bendingYY.set(s, b.My), i.bendingXY.set(s, b.Mxy), b.Mj && f.set(s, b.Mj), b.Nj && r.set(s, b.Nj), i.tranverseShearX.set(s, b.Qx), i.tranverseShearY.set(s, b.Qy), i.vonMises.set(s, b.vonMises);
    } else if (w.length === 3) {
      const b = It(J, ((_c = e == null ? void 0 : e.localAngles) == null ? void 0 : _c.get(s)) ?? 0);
      it(b, d);
      const g = So(e, s), p = _o(J), S = xo(d), y = Bo(J), R = it(1 / (2 * y), it(it(g, p), S)).toArray(), _ = ((_d = e.thicknesses) == null ? void 0 : _d.get(s)) ?? 1, M = R[0][0] * _, L = R[1][0] * _, C = R[2][0] * _, Z = R[0][1] * (_ ** 3 / 12), B = R[1][1] * (_ ** 3 / 12), G = R[2][1] * (_ ** 3 / 12);
      i.membraneXX.set(s, M), i.membraneYY.set(s, L), i.membraneXY.set(s, C), i.bendingXX.set(s, Z), i.bendingYY.set(s, B), i.bendingXY.set(s, G);
    }
  });
  const { nodeToCentroidElementIndiciesMap: h } = ko(t, n);
  {
    const w = (d) => {
      var _a;
      return (((_a = e == null ? void 0 : e.plateFormulations) == null ? void 0 : _a.get(d)) ?? 0) === 1;
    }, s = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
    if (n.forEach((d, b) => {
      if (d.length !== 4) return;
      const g = d.map((p) => t[p]);
      s.set(b, [0, 1, 2].map((p) => g.reduce((S, y) => S + y[p], 0) / 4)), J.set(b, d);
    }), [...J.keys()].some(w)) {
      const d = /* @__PURE__ */ new Map();
      for (const [b, g] of J) for (const p of g) {
        const S = d.get(p) ?? [];
        S.push(b), d.set(p, S);
      }
      for (const [b, g] of J) {
        if (!w(b)) continue;
        const p = /* @__PURE__ */ new Map();
        for (const L of g) for (const C of d.get(L) ?? []) C !== b && p.set(C, (p.get(C) ?? 0) + 1);
        const S = [...p].filter(([, L]) => L >= 2).map(([L]) => L);
        if (S.length < 2) continue;
        const y = s.get(b), x = (L) => {
          let C = 0, Z = 0, B = 0, G = 0, v = 0;
          const tt = L.get(b) ?? 0;
          for (const N of S) {
            const A = s.get(N), F = A[0] - y[0], W = A[1] - y[1], T = (L.get(N) ?? 0) - tt;
            C += F * F, Z += F * W, B += W * W, G += F * T, v += W * T;
          }
          const P = C * B - Z * Z;
          return Math.abs(P) < 1e-12 ? [0, 0] : [(G * B - v * Z) / P, (C * v - Z * G) / P];
        }, R = x(i.bendingXX), _ = x(i.bendingYY), M = x(i.bendingXY);
        i.tranverseShearX.set(b, R[0] + M[1]), i.tranverseShearY.set(b, _[1] + M[0]);
      }
    }
  }
  return n.forEach((w, s) => {
    if (w.length !== 3 && w.length !== 4) return;
    const J = w.length, d = new Array(J).fill(0), b = new Array(J).fill(0), g = new Array(J).fill(0), p = new Array(J).fill(0), S = new Array(J).fill(0), y = new Array(J).fill(0), x = new Array(J).fill(0), R = new Array(J).fill(0), _ = new Array(J).fill(0);
    w.forEach((B, G) => {
      const v = (h.get(B) || []).filter((A) => n[A].length === 3 || n[A].length === 4), tt = (A) => Et(v.map((F) => A.get(F) ?? 0)), P = (A, F) => Et(v.map((W) => {
        const T = r.get(W), D = T ? n[W].indexOf(B) : -1;
        return T && D >= 0 ? T[D][A] : F.get(W) ?? 0;
      }));
      d[G] = P(0, i.membraneXX), b[G] = P(1, i.membraneYY), g[G] = P(2, i.membraneXY);
      const N = (A, F) => Et(v.map((W) => {
        const T = f.get(W), D = T ? n[W].indexOf(B) : -1;
        return T && D >= 0 ? T[D][A] : F.get(W) ?? 0;
      }));
      p[G] = N(0, i.bendingXX), S[G] = N(1, i.bendingYY), y[G] = N(2, i.bendingXY), x[G] = tt(i.tranverseShearX), R[G] = tt(i.tranverseShearY), _[G] = tt(i.vonMises);
    }), c.membraneXX.set(s, d), c.membraneYY.set(s, b), c.membraneXY.set(s, g), c.bendingXX.set(s, p), c.bendingYY.set(s, S), c.bendingXY.set(s, y);
    const M = r.get(s), L = (B, G) => M ? M.reduce((v, tt) => v + tt[B], 0) / M.length : G.get(s) ?? 0;
    (c.membraneXXcentro ?? (c.membraneXXcentro = /* @__PURE__ */ new Map())).set(s, L(0, i.membraneXX)), (c.membraneYYcentro ?? (c.membraneYYcentro = /* @__PURE__ */ new Map())).set(s, L(1, i.membraneYY)), (c.membraneXYcentro ?? (c.membraneXYcentro = /* @__PURE__ */ new Map())).set(s, L(2, i.membraneXY)), M && ((c.membraneXXjoint ?? (c.membraneXXjoint = /* @__PURE__ */ new Map())).set(s, M.map((B) => B[0])), (c.membraneYYjoint ?? (c.membraneYYjoint = /* @__PURE__ */ new Map())).set(s, M.map((B) => B[1])), (c.membraneXYjoint ?? (c.membraneXYjoint = /* @__PURE__ */ new Map())).set(s, M.map((B) => B[2])));
    const C = f.get(s), Z = (B, G) => C ? C.reduce((v, tt) => v + tt[B], 0) / C.length : G.get(s) ?? 0;
    (c.bendingXXcentro ?? (c.bendingXXcentro = /* @__PURE__ */ new Map())).set(s, Z(0, i.bendingXX)), (c.bendingYYcentro ?? (c.bendingYYcentro = /* @__PURE__ */ new Map())).set(s, Z(1, i.bendingYY)), (c.bendingXYcentro ?? (c.bendingXYcentro = /* @__PURE__ */ new Map())).set(s, Z(2, i.bendingXY)), C && ((c.bendingXXjoint ?? (c.bendingXXjoint = /* @__PURE__ */ new Map())).set(s, C.map((B) => B[0])), (c.bendingYYjoint ?? (c.bendingYYjoint = /* @__PURE__ */ new Map())).set(s, C.map((B) => B[1])), (c.bendingXYjoint ?? (c.bendingXYjoint = /* @__PURE__ */ new Map())).set(s, C.map((B) => B[2]))), c.tranverseShearX.set(s, x), c.tranverseShearY.set(s, R), c.vonMises.set(s, _);
  }), c;
}
function Jo(t, n, e, a) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const c = ((_a = e.elasticities) == null ? void 0 : _a.get(a)) ?? 0, f = ((_b = e.poissonsRatios) == null ? void 0 : _b.get(a)) ?? 0, r = ((_c = e.thicknesses) == null ? void 0 : _c.get(a)) ?? 1, i = t[0], h = t[1], w = t[2], s = t[3], J = [h[0] - i[0], h[1] - i[1], h[2] - i[2]], d = [w[0] - s[0], w[1] - s[1], w[2] - s[2]];
  let b = [J[0] + d[0], J[1] + d[1], J[2] + d[2]], g = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
  g < 1e-14 && (g = 1);
  let p = [b[0] / g, b[1] / g, b[2] / g];
  const S = [w[0] - i[0], w[1] - i[1], w[2] - i[2]], y = [s[0] - h[0], s[1] - h[1], s[2] - h[2]];
  let x = [S[1] * y[2] - S[2] * y[1], S[2] * y[0] - S[0] * y[2], S[0] * y[1] - S[1] * y[0]], R = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);
  R < 1e-14 && (R = 1);
  let _ = [x[0] / R, x[1] / R, x[2] / R], M = [_[1] * p[2] - _[2] * p[1], _[2] * p[0] - _[0] * p[2], _[0] * p[1] - _[1] * p[0]], L = Math.sqrt(M[0] * M[0] + M[1] * M[1] + M[2] * M[2]);
  L < 1e-14 && (L = 1), M = [M[0] / L, M[1] / L, M[2] / L];
  {
    if (Math.abs(_[2]) > 1 - 1e-6) p = [1, 0, 0];
    else {
      const st = [-_[1], _[0], 0], I = Math.hypot(st[0], st[1], st[2]) || 1;
      p = [st[0] / I, st[1] / I, st[2] / I];
    }
    M = [_[1] * p[2] - _[2] * p[1], _[2] * p[0] - _[0] * p[2], _[0] * p[1] - _[1] * p[0]];
    const rt = Math.hypot(M[0], M[1], M[2]) || 1;
    M = [M[0] / rt, M[1] / rt, M[2] / rt], p = [M[1] * _[2] - M[2] * _[1], M[2] * _[0] - M[0] * _[2], M[0] * _[1] - M[1] * _[0]];
  }
  const C = 0.25 * (i[0] + h[0] + w[0] + s[0]), Z = 0.25 * (i[1] + h[1] + w[1] + s[1]), B = 0.25 * (i[2] + h[2] + w[2] + s[2]), G = [], v = [];
  for (let O = 0; O < 4; O++) {
    const rt = t[O][0] - C, st = t[O][1] - Z, I = t[O][2] - B;
    G.push(rt * p[0] + st * p[1] + I * p[2]), v.push(rt * M[0] + st * M[1] + I * M[2]);
  }
  const tt = [p, M, _], P = new Array(24).fill(0);
  for (let O = 0; O < 4; O++) {
    const rt = O * 6, st = O * 6;
    for (let I = 0; I < 3; I++) P[st + I] = tt[I][0] * n[rt] + tt[I][1] * n[rt + 1] + tt[I][2] * n[rt + 2];
    for (let I = 0; I < 3; I++) P[st + 3 + I] = tt[I][0] * n[rt + 3] + tt[I][1] * n[rt + 4] + tt[I][2] * n[rt + 5];
  }
  const N = c / (1 - f * f), A = [[N * r, N * f * r, 0], [N * f * r, N * r, 0], [0, 0, N * (1 - f) / 2 * r]], F = r * r * r / 12, W = [[N * F, N * f * F, 0], [N * f * F, N * F, 0], [0, 0, N * (1 - f) / 2 * F]], T = [-0.25, 0.25, 0.25, -0.25], D = [-0.25, -0.25, 0.25, 0.25];
  let ot = 0, V = 0, nt = 0, ct = 0;
  for (let O = 0; O < 4; O++) ot += T[O] * G[O], V += T[O] * v[O], nt += D[O] * G[O], ct += D[O] * v[O];
  const l = ot * ct - V * nt;
  if (Math.abs(l) < 1e-20) return { Nx: 0, Ny: 0, Nxy: 0, Mx: 0, My: 0, Mxy: 0, Qx: 0, Qy: 0, vonMises: 0, Mj: null, Nj: null };
  const u = ct / l, q = -V / l, Q = -nt / l, k = ot / l, X = [], o = [];
  for (let O = 0; O < 4; O++) X.push(u * T[O] + q * D[O]), o.push(Q * T[O] + k * D[O]);
  let Y = 0, m = 0, K = 0;
  for (let O = 0; O < 4; O++) {
    const rt = P[O * 6 + 0], st = P[O * 6 + 1];
    Y += X[O] * rt, m += o[O] * st, K += o[O] * rt + X[O] * st;
  }
  const $ = A[0][0] * Y + A[0][1] * m, E = A[1][0] * Y + A[1][1] * m, ft = A[2][2] * K;
  let pt = 0, Mt = 0, Xt = 0;
  for (let O = 0; O < 4; O++) {
    const rt = P[O * 6 + 3], st = P[O * 6 + 4];
    pt += X[O] * st, Mt += -o[O] * rt, Xt += o[O] * st - X[O] * rt;
  }
  const yt = -1, et = yt * (W[0][0] * pt + W[0][1] * Mt), mt = yt * (W[1][0] * pt + W[1][1] * Mt), At = yt * (W[2][2] * Xt);
  let gt = null;
  if (Math.abs(l) > 1e-20) {
    const O = [];
    for (let dt = 0; dt < 4; dt++) O.push(P[dt * 6 + 0], P[dt * 6 + 1], P[dt * 6 + 5]);
    const rt = ((_d = e == null ? void 0 : e.drillingTypes) == null ? void 0 : _d.get(a)) ?? 12, st = ((_e = e == null ? void 0 : e.drillingPenaltyScales) == null ? void 0 : _e.get(a)) ?? 0.4, I = (_f = e == null ? void 0 : e.membraneModifiers) == null ? void 0 : _f.get(a), Kt = (_g = e == null ? void 0 : e.shellModifiers) == null ? void 0 : _g.get(a), Jt = Array.isArray(Kt) && Kt.length >= 3 ? [Kt[0], Kt[1], Kt[2]] : typeof I == "number" && I !== 1 ? [I, I, I] : null;
    try {
      gt = go(G, v, O, c, f, r, { tipo: rt, gammaFac: st, mod: Jt }), gt && gt.some((dt) => dt.some((St) => !Number.isFinite(St))) && (gt = null);
    } catch {
      gt = null;
    }
  }
  let U = null;
  const bt = (((_h = e == null ? void 0 : e.plateFormulations) == null ? void 0 : _h.get(a)) ?? 0) !== 1;
  if (Math.abs(l) > 1e-20) {
    const O = [];
    for (let rt = 0; rt < 4; rt++) O.push(P[rt * 6 + 2], P[rt * 6 + 3], P[rt * 6 + 4]);
    try {
      const rt = globalThis.__hekatanDkqJoints ?? "gauss";
      U = (bt ? ro(G, v, O, c, f, r) : io(G, v, O, c, f, r, rt)).map((st) => st.map((I) => yt * I)), U.some((st) => st.some((I) => !Number.isFinite(I))) && (U = null);
    } catch {
      U = null;
    }
  }
  const z = 5 / 6, ht = c / (2 * (1 + f)), Nt = z * ht * r;
  let wt = 0, j = 0;
  const H = [0.25, 0.25, 0.25, 0.25];
  for (let O = 0; O < 4; O++) {
    const rt = P[O * 6 + 2], st = P[O * 6 + 3], I = P[O * 6 + 4];
    wt += X[O] * rt + H[O] * st, j += o[O] * rt + H[O] * I;
  }
  const Yt = Nt * wt, jt = Nt * j, vt = $ / r + 6 * et / (r * r), Tt = E / r + 6 * mt / (r * r), Lt = ft / r + 6 * At / (r * r), kt = Math.sqrt(vt * vt - vt * Tt + Tt * Tt + 3 * Lt * Lt), _t = $ / r - 6 * et / (r * r), xt = E / r - 6 * mt / (r * r), Bt = ft / r - 6 * At / (r * r), Dt = Math.sqrt(_t * _t - _t * xt + xt * xt + 3 * Bt * Bt), qt = Math.max(kt, Dt);
  return { Nx: $, Ny: E, Nxy: ft, Mx: et, My: mt, Mxy: At, Qx: Yt, Qy: jt, vonMises: qt, Mj: U, Nj: gt };
}
function So(t, n) {
  var _a, _b, _c, _d, _e;
  const e = ((_a = t.elasticities) == null ? void 0 : _a.get(n)) ?? 0, a = ((_b = t.elasticitiesOrthogonal) == null ? void 0 : _b.get(n)) ?? 0, c = ((_c = t.poissonsRatios) == null ? void 0 : _c.get(n)) ?? 0, f = ((_d = t.shearModuli) == null ? void 0 : _d.get(n)) ?? 0;
  return (_e = t.thicknesses) == null ? void 0 : _e.get(n), a > 0 ? co(e, a, f, c) : so(e, c);
}
function _o(t) {
  const [n, e] = t[0], [a, c] = t[1], [f, r] = t[2], i = c - r, h = r - e, w = e - c, s = f - a, J = n - f, d = a - n;
  return at([[i, h, w, 0, 0, 0], [0, 0, 0, s, J, d], [s, J, d, i, h, w]]);
}
function xo(t) {
  const [n, e, a] = [t[0], t[6], t[12]], [c, f, r] = [t[1], t[7], t[13]], [i, h, w] = [t[4], t[10], t[16]], [s, J, d] = [t[3], t[9], t[15]];
  return at([[n, -i], [e, -h], [a, -w], [c, s], [f, J], [r, d]]);
}
function Bo(t) {
  const [n, e] = t[0], [a, c] = t[1], [f, r] = t[2], i = a - n, h = f - n, w = r - e, s = e - c;
  return 0.5 * (i * w - h * -s);
}
function ko(t, n) {
  const e = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  return n.forEach((c, f) => {
    const r = c.map((h) => t[h]), i = Do(r);
    c.forEach((h) => {
      var _a, _b;
      e.has(h) || e.set(h, []), (_a = e.get(h)) == null ? void 0 : _a.push(i), a.has(h) || a.set(h, []), (_b = a.get(h)) == null ? void 0 : _b.push(f);
    });
  }), { nodeToCentroidNodesMap: e, nodeToCentroidElementIndiciesMap: a };
}
function Do(t) {
  const n = t.reduce((c, f) => c + f[0], 0) / t.length, e = t.reduce((c, f) => c + f[1], 0) / t.length, a = t.reduce((c, f) => c + f[2], 0) / t.length;
  return [n, e, a];
}
export {
  Qo as a,
  It as b,
  bo as g
};
