import { e as K } from "./materials-VwssM8Vw.js";
function v(n) {
  return { moiZ: n.Iz, moiY: n.Iy };
}
function d(n, o) {
  const c = n * o, s = n * o * o * o / 12, e = o * n * n * n / 12, t = Math.min(n, o), r = Math.max(n, o), i = t * t * t * r * (1 / 3 - 0.21 * (t / r) * (1 - t * t * t * t / (12 * r * r * r * r)));
  return { A: c, Iz: s, Iy: e, J: i };
}
function E(n) {
  const o = n / 2, c = Math.PI * o * o, s = Math.PI * o * o * o * o / 4, e = Math.PI * o * o * o * o / 2;
  return { A: c, Iz: s, Iy: s, J: e };
}
function w(n, o, c, s) {
  const e = o - 2 * c, t = 2 * n * c + e * s, r = (n * o * o * o - (n - s) * e * e * e) / 12, i = (2 * c * n * n * n + e * s * s * s) / 12, u = (2 * n * c * c * c + e * s * s * s) / 3;
  return { A: t, Iz: r, Iy: i, J: u };
}
function D(n, o, c, s, e = o, t = c) {
  const r = n - c - t, i = o * c, u = e * t, A = r * s, l = i + u + A, m = (u * t / 2 + A * (t + r / 2) + i * (n - c / 2)) / l, h = e * t ** 3 / 12 + u * (t / 2 - m) ** 2 + s * r ** 3 / 12 + A * (t + r / 2 - m) ** 2 + o * c ** 3 / 12 + i * (n - c / 2 - m) ** 2, I = (c * o ** 3 + t * e ** 3 + r * s ** 3) / 12, k = (z, C) => z * C ** 3 / 3 * (1 - 0.63 * C / z), p = k(o, c) + k(e, t) + k(r, s);
  return { A: l, Iz: h, Iy: I, J: p, As2: s * n, As3: 5 / 6 * (i + u), yc: m };
}
function f(n, o, c, s) {
  const e = n - 2 * s, t = o - 2 * c, r = n * o - e * t, i = (n * o ** 3 - e * t ** 3) / 12, u = (o * n ** 3 - t * e ** 3) / 12, A = (n - s) * (o - c), l = 4 * A * A / (2 * (n - s) / c + 2 * (o - c) / s);
  return { A: r, Iz: i, Iy: u, J: l, As2: 2 * s * o, As3: 2 * c * n };
}
function b(n, o, c, s) {
  const e = n - 2 * c, t = o * c, r = e * s, i = 2 * t + r, u = (2 * t * o / 2 + r * s / 2) / i, A = (o * n ** 3 - (o - s) * e ** 3) / 12, l = 2 * (c * o ** 3 / 12 + t * (o / 2 - u) ** 2) + e * s ** 3 / 12 + r * (s / 2 - u) ** 2, m = (I, k) => I * k ** 3 / 3 * (1 - 0.63 * k / I), h = 2 * m(o, c) + m(e, s);
  return { A: i, Iz: A, Iy: l, J: h, As2: s * n, As3: 2 * o * c, xc: u };
}
function O(n, o, c, s) {
  const e = Math.min(c, s), t = Math.max(c, s);
  return o * c ** 3 / 3 - 0.21 * c ** 4 + (n - c) * s ** 3 / 3 - 0.105 * s ** 4 + 0.07 * e * t ** 3;
}
function nn(n, o, c, s, e) {
  const t = (o - e) / 2, r = t * c, i = (n - c) * s, u = r + i, A = (r * c / 2 + i * (c + (n - c) / 2)) / u, l = 2 * (t * c ** 3 / 12 + r * (c / 2 - A) ** 2 + s * (n - c) ** 3 / 12 + i * (c + (n - c) / 2 - A) ** 2), m = e / 2, h = 2 * (c * t ** 3 / 12 + r * (m + t / 2) ** 2 + (n - c) * s ** 3 / 12 + i * (m + s / 2) ** 2);
  return { A: 2 * u, Iz: l, Iy: h, J: 2 * O(n, t, c, s), As2: 2 * s * n, As3: 2 * t * c, yc: A, w: t };
}
function on(n, o, c) {
  const s = n - 2 * c, e = o - 2 * c, t = n * o - s * e, r = (n * o * o * o - s * e * e * e) / 12, i = (o * n * n * n - e * s * s * s) / 12, u = (n - c) * (o - c), A = 2 * ((n - c) / c + (o - c) / c), l = 4 * u * u / (A > 0 ? A : 1);
  return { A: t, Iz: r, Iy: i, J: l };
}
function H(n, o = 4e3) {
  const c = Math.min(...n.map((e) => e.y0)), s = Math.max(...n.map((e) => e.y1));
  return Y((e) => {
    const t = n.find((r) => e >= r.y0 && e < r.y1);
    return t ? t.w : 0;
  }, c, s, o);
}
function Y(n, o, c, s = 4e3) {
  const e = (c - o) / s, t = new Float64Array(s), r = new Float64Array(s);
  for (let I = 0; I < s; I++) r[I] = o + (I + 0.5) * e, t[I] = Math.max(0, n(r[I]));
  let i = 0, u = 0;
  for (let I = 0; I < s; I++) i += t[I] * e, u += t[I] * r[I] * e;
  const A = i > 0 ? u / i : 0;
  let l = 0;
  for (let I = 0; I < s; I++) l += t[I] * (r[I] - A) ** 2 * e;
  let m = 0, h = 0;
  for (let I = s - 1; I >= 0; I--) m += t[I] * (r[I] - A) * e, t[I] > 0 && (h += m * m / t[I] * e);
  return h > 0 ? l * l / h : 0;
}
const Q = /* @__PURE__ */ new Map();
function U(n, o, c, s, e = 64, t = c) {
  const r = `${n}|${o}|${c}|${t}|${s}|${e}`, i = Q.get(r);
  if (i !== void 0) return i;
  const u = (p, z) => {
    const C = n / p, F = o / z, S = p * z, J = z, P = new Float64Array(S);
    for (let a = 0; a < p; a++) for (let M = 0; M < z; M++) {
      const y = (a + 0.5) * C - n / 2, x = (M + 0.5) * F - o / 2, $ = Math.abs(y) < n / 2 - t && Math.abs(x) < o / 2 - c;
      P[a * z + M] = 1 / ($ ? s : 1);
    }
    const g = (a, M) => 2 * a * M / (a + M), j = new Float64Array(S), q = new Float64Array(S), N = new Float64Array(S);
    for (let a = 0; a < p; a++) for (let M = 0; M < z; M++) {
      const y = a * z + M, x = P[y], $ = (a < p - 1 ? g(x, P[y + z]) : x) / (C * C), G = (a > 0 ? g(x, P[y - z]) : x) / (C * C), W = (M < z - 1 ? g(x, P[y + 1]) : x) / (F * F), B = (M > 0 ? g(x, P[y - 1]) : x) / (F * F);
      j[y] = $ + G + W + B, M < z - 1 && (q[y] = -W), a < p - 1 && (N[y] = -$);
    }
    const Z = (a, M) => a === M ? j[M] : a === M + 1 ? q[M] : a === M + J ? N[M] : 0, _ = new Float64Array(S * (J + 1));
    for (let a = 0; a < S; a++) {
      const M = Math.min(S - 1, a + J);
      for (let y = a; y <= M; y++) {
        let x = Z(y, a);
        const $ = Math.max(0, y - J);
        for (let G = $; G < a; G++) x -= _[y * (J + 1) + (y - G)] * _[a * (J + 1) + (a - G)];
        y === a ? _[a * (J + 1)] = Math.sqrt(x) : _[y * (J + 1) + (y - a)] = x / _[a * (J + 1)];
      }
    }
    const R = new Float64Array(S);
    for (let a = 0; a < S; a++) {
      let M = 2;
      for (let y = Math.max(0, a - J); y < a; y++) M -= _[a * (J + 1) + (a - y)] * R[y];
      R[a] = M / _[a * (J + 1)];
    }
    const L = new Float64Array(S);
    for (let a = S - 1; a >= 0; a--) {
      let M = R[a];
      const y = Math.min(S - 1, a + J);
      for (let x = a + 1; x <= y; x++) M -= _[x * (J + 1) + (x - a)] * L[x];
      L[a] = M / _[a * (J + 1)];
    }
    let T = 0;
    for (let a = 0; a < S; a++) T += L[a];
    return 2 * T * C * F;
  }, A = Math.max(2, Math.round(n / t)), l = Math.max(2, Math.round(o / c)), m = 4 * Math.max(A, l) <= 160 ? 2 : 1, h = u(m * A, m * l), k = 2 * u(2 * m * A, 2 * m * l) - h;
  return Q.set(r, k), k;
}
function V(n, o, c, s, e, t, r, i = c) {
  const u = t / s, A = n - 2 * i, l = o - 2 * c, m = n * o - A * l, h = (n * o * o * o - A * l * l * l) / 12, I = (o * n * n * n - l * A * A * A) / 12, k = A * l, p = A * l * l * l / 12, z = l * A * A * A / 12, C = m + u * k, F = h + u * p, S = I + u * z, J = s / (2 * (1 + e)), P = t / (2 * (1 + r)), g = H([{ y0: -o / 2, y1: -l / 2, w: n }, { y0: -l / 2, y1: l / 2, w: 2 * i + u * A }, { y0: l / 2, y1: o / 2, w: n }]), j = H([{ y0: -n / 2, y1: -A / 2, w: o }, { y0: -A / 2, y1: A / 2, w: 2 * c + u * l }, { y0: A / 2, y1: n / 2, w: o }]), q = U(n, o, c, P / J, 64, i);
  return { A: C, Iz: F, Iy: S, J: q, Es: s, Gs: J, A_steel: m, A_conc: k, As2: g, As3: j, n: u, Ec: t };
}
function cn(n, o, c, s, e, t) {
  const r = e / c, i = n - 2 * o, u = n / 2, A = i / 2, l = Math.PI * (n * n - i * i) / 4, m = Math.PI * i * i / 4, h = Math.PI * (n ** 4 - i ** 4) / 64, I = Math.PI * i ** 4 / 64, k = l + r * m, p = h + r * I, z = c / (2 * (1 + s)), C = e / (2 * (1 + t)), S = Y((P) => 2 * Math.sqrt(Math.max(0, u * u - P * P)) - (Math.abs(P) < A ? (1 - r) * 2 * Math.sqrt(Math.max(0, A * A - P * P)) : 0), -u, u, 8e3), J = Math.PI * (n ** 4 - i ** 4) / 32 + C / z * Math.PI * i ** 4 / 32;
  return { A: k, Iz: p, Iy: p, J, Es: c, Gs: z, A_steel: l, A_conc: m, As2: S, As3: S, n: r, Ec: e };
}
function sn(n, o, c, s, e, t, r) {
  const i = K(t / 1e3);
  return V(n, o, c, s, e, i, r);
}
export {
  cn as a,
  V as b,
  b as c,
  nn as d,
  v as e,
  w as f,
  E as g,
  on as h,
  D as i,
  sn as j,
  d as r,
  f as t
};
