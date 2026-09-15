function V(n) {
  return { moiZ: n.Iz, moiY: n.Iy };
}
function X(n, o) {
  const c = n * o, s = n * o * o * o / 12, a = o * n * n * n / 12, t = Math.min(n, o), r = Math.max(n, o), i = t * t * t * r * (1 / 3 - 0.21 * (t / r) * (1 - t * t * t * t / (12 * r * r * r * r)));
  return { A: c, Iz: s, Iy: a, J: i };
}
function v(n) {
  const o = n / 2, c = Math.PI * o * o, s = Math.PI * o * o * o * o / 4, a = Math.PI * o * o * o * o / 2;
  return { A: c, Iz: s, Iy: s, J: a };
}
function d(n, o, c, s) {
  const a = o - 2 * c, t = 2 * n * c + a * s, r = (n * o * o * o - (n - s) * a * a * a) / 12, i = (2 * c * n * n * n + a * s * s * s) / 12, u = (2 * n * c * c * c + a * s * s * s) / 3;
  return { A: t, Iz: r, Iy: i, J: u };
}
function E(n, o, c, s, a = o, t = c) {
  const r = n - c - t, i = o * c, u = a * t, l = r * s, A = i + u + l, m = (u * t / 2 + l * (t + r / 2) + i * (n - c / 2)) / A, S = a * t ** 3 / 12 + u * (t / 2 - m) ** 2 + s * r ** 3 / 12 + l * (t + r / 2 - m) ** 2 + o * c ** 3 / 12 + i * (n - c / 2 - m) ** 2, I = (c * o ** 3 + t * a ** 3 + r * s ** 3) / 12, k = (h, _) => h * _ ** 3 / 3 * (1 - 0.63 * _ / h), F = k(o, c) + k(a, t) + k(r, s);
  return { A, Iz: S, Iy: I, J: F, As2: s * n, As3: 5 / 6 * (i + u), yc: m };
}
function w(n, o, c, s) {
  const a = n - 2 * s, t = o - 2 * c, r = n * o - a * t, i = (n * o ** 3 - a * t ** 3) / 12, u = (o * n ** 3 - t * a ** 3) / 12, l = (n - s) * (o - c), A = 4 * l * l / (2 * (n - s) / c + 2 * (o - c) / s);
  return { A: r, Iz: i, Iy: u, J: A, As2: 2 * s * o, As3: 2 * c * n };
}
function D(n, o, c, s) {
  const a = n - 2 * c, t = o * c, r = a * s, i = 2 * t + r, u = (2 * t * o / 2 + r * s / 2) / i, l = (o * n ** 3 - (o - s) * a ** 3) / 12, A = 2 * (c * o ** 3 / 12 + t * (o / 2 - u) ** 2) + a * s ** 3 / 12 + r * (s / 2 - u) ** 2, m = (I, k) => I * k ** 3 / 3 * (1 - 0.63 * k / I), S = 2 * m(o, c) + m(a, s);
  return { A: i, Iz: l, Iy: A, J: S, As2: s * n, As3: 2 * o * c, xc: u };
}
function K(n, o, c, s) {
  const a = Math.min(c, s), t = Math.max(c, s);
  return o * c ** 3 / 3 - 0.21 * c ** 4 + (n - c) * s ** 3 / 3 - 0.105 * s ** 4 + 0.07 * a * t ** 3;
}
function f(n, o, c, s, a) {
  const t = (o - a) / 2, r = t * c, i = (n - c) * s, u = r + i, l = (r * c / 2 + i * (c + (n - c) / 2)) / u, A = 2 * (t * c ** 3 / 12 + r * (c / 2 - l) ** 2 + s * (n - c) ** 3 / 12 + i * (c + (n - c) / 2 - l) ** 2), m = a / 2, S = 2 * (c * t ** 3 / 12 + r * (m + t / 2) ** 2 + (n - c) * s ** 3 / 12 + i * (m + s / 2) ** 2);
  return { A: 2 * u, Iz: A, Iy: S, J: 2 * K(n, t, c, s), As2: 2 * s * n, As3: 2 * t * c, yc: l, w: t };
}
function b(n, o, c) {
  const s = n - 2 * c, a = o - 2 * c, t = n * o - s * a, r = (n * o * o * o - s * a * a * a) / 12, i = (o * n * n * n - a * s * s * s) / 12, u = (n - c) * (o - c), l = 2 * ((n - c) / c + (o - c) / c), A = 4 * u * u / (l > 0 ? l : 1);
  return { A: t, Iz: r, Iy: i, J: A };
}
function Q(n, o = 4e3) {
  const c = Math.min(...n.map((a) => a.y0)), s = Math.max(...n.map((a) => a.y1));
  return Z((a) => {
    const t = n.find((r) => a >= r.y0 && a < r.y1);
    return t ? t.w : 0;
  }, c, s, o);
}
function Z(n, o, c, s = 4e3) {
  const a = (c - o) / s, t = new Float64Array(s), r = new Float64Array(s);
  for (let I = 0; I < s; I++) r[I] = o + (I + 0.5) * a, t[I] = Math.max(0, n(r[I]));
  let i = 0, u = 0;
  for (let I = 0; I < s; I++) i += t[I] * a, u += t[I] * r[I] * a;
  const l = i > 0 ? u / i : 0;
  let A = 0;
  for (let I = 0; I < s; I++) A += t[I] * (r[I] - l) ** 2 * a;
  let m = 0, S = 0;
  for (let I = s - 1; I >= 0; I--) m += t[I] * (r[I] - l) * a, t[I] > 0 && (S += m * m / t[I] * a);
  return S > 0 ? A * A / S : 0;
}
const Y = /* @__PURE__ */ new Map();
function O(n, o, c, s, a = 64, t = c) {
  const r = `${n}|${o}|${c}|${t}|${s}|${a}`, i = Y.get(r);
  if (i !== void 0) return i;
  const u = (F, h) => {
    const _ = n / F, p = o / h, z = F * h, J = h, P = new Float64Array(z);
    for (let e = 0; e < F; e++) for (let M = 0; M < h; M++) {
      const y = (e + 0.5) * _ - n / 2, x = (M + 0.5) * p - o / 2, g = Math.abs(y) < n / 2 - t && Math.abs(x) < o / 2 - c;
      P[e * h + M] = 1 / (g ? s : 1);
    }
    const $ = (e, M) => 2 * e * M / (e + M), G = new Float64Array(z), j = new Float64Array(z), N = new Float64Array(z);
    for (let e = 0; e < F; e++) for (let M = 0; M < h; M++) {
      const y = e * h + M, x = P[y], g = (e < F - 1 ? $(x, P[y + h]) : x) / (_ * _), q = (e > 0 ? $(x, P[y - h]) : x) / (_ * _), W = (M < h - 1 ? $(x, P[y + 1]) : x) / (p * p), H = (M > 0 ? $(x, P[y - 1]) : x) / (p * p);
      G[y] = g + q + W + H, M < h - 1 && (j[y] = -W), e < F - 1 && (N[y] = -g);
    }
    const B = (e, M) => e === M ? G[M] : e === M + 1 ? j[M] : e === M + J ? N[M] : 0, C = new Float64Array(z * (J + 1));
    for (let e = 0; e < z; e++) {
      const M = Math.min(z - 1, e + J);
      for (let y = e; y <= M; y++) {
        let x = B(y, e);
        const g = Math.max(0, y - J);
        for (let q = g; q < e; q++) x -= C[y * (J + 1) + (y - q)] * C[e * (J + 1) + (e - q)];
        y === e ? C[e * (J + 1)] = Math.sqrt(x) : C[y * (J + 1) + (y - e)] = x / C[e * (J + 1)];
      }
    }
    const R = new Float64Array(z);
    for (let e = 0; e < z; e++) {
      let M = 2;
      for (let y = Math.max(0, e - J); y < e; y++) M -= C[e * (J + 1) + (e - y)] * R[y];
      R[e] = M / C[e * (J + 1)];
    }
    const L = new Float64Array(z);
    for (let e = z - 1; e >= 0; e--) {
      let M = R[e];
      const y = Math.min(z - 1, e + J);
      for (let x = e + 1; x <= y; x++) M -= C[x * (J + 1) + (x - e)] * L[x];
      L[e] = M / C[e * (J + 1)];
    }
    let T = 0;
    for (let e = 0; e < z; e++) T += L[e];
    return 2 * T * _ * p;
  }, l = Math.max(2, Math.round(n / t)), A = Math.max(2, Math.round(o / c)), m = 4 * Math.max(l, A) <= 160 ? 2 : 1, S = u(m * l, m * A), k = 2 * u(2 * m * l, 2 * m * A) - S;
  return Y.set(r, k), k;
}
function U(n, o, c, s, a, t, r, i = c) {
  const u = t / s, l = n - 2 * i, A = o - 2 * c, m = n * o - l * A, S = (n * o * o * o - l * A * A * A) / 12, I = (o * n * n * n - A * l * l * l) / 12, k = l * A, F = l * A * A * A / 12, h = A * l * l * l / 12, _ = m + u * k, p = S + u * F, z = I + u * h, J = s / (2 * (1 + a)), P = t / (2 * (1 + r)), $ = Q([{ y0: -o / 2, y1: -A / 2, w: n }, { y0: -A / 2, y1: A / 2, w: 2 * i + u * l }, { y0: A / 2, y1: o / 2, w: n }]), G = Q([{ y0: -n / 2, y1: -l / 2, w: o }, { y0: -l / 2, y1: l / 2, w: 2 * c + u * A }, { y0: l / 2, y1: n / 2, w: o }]), j = O(n, o, c, P / J, 64, i);
  return { A: _, Iz: p, Iy: z, J: j, Es: s, Gs: J, A_steel: m, A_conc: k, As2: $, As3: G, n: u, Ec: t };
}
function nn(n, o, c, s, a, t) {
  const r = a / c, i = n - 2 * o, u = n / 2, l = i / 2, A = Math.PI * (n * n - i * i) / 4, m = Math.PI * i * i / 4, S = Math.PI * (n ** 4 - i ** 4) / 64, I = Math.PI * i ** 4 / 64, k = A + r * m, F = S + r * I, h = c / (2 * (1 + s)), _ = a / (2 * (1 + t)), z = Z((P) => 2 * Math.sqrt(Math.max(0, u * u - P * P)) - (Math.abs(P) < l ? (1 - r) * 2 * Math.sqrt(Math.max(0, l * l - P * P)) : 0), -u, u, 8e3), J = Math.PI * (n ** 4 - i ** 4) / 32 + _ / h * Math.PI * i ** 4 / 32;
  return { A: k, Iz: F, Iy: F, J, Es: c, Gs: h, A_steel: A, A_conc: m, As2: z, As3: z, n: r, Ec: a };
}
function on(n, o, c, s, a, t, r) {
  const i = 4700 * Math.sqrt(t / 1e3) * 1e3;
  return U(n, o, c, s, a, i, r);
}
export {
  nn as a,
  U as b,
  D as c,
  f as d,
  V as e,
  d as f,
  v as g,
  b as h,
  E as i,
  on as j,
  X as r,
  w as t
};
