function H(n) {
  return { moiZ: n.Iz, moiY: n.Iy };
}
function K(n, o) {
  const t = n * o, s = n * o * o * o / 12, e = o * n * n * n / 12, a = Math.min(n, o), r = Math.max(n, o), l = a * a * a * r * (1 / 3 - 0.21 * (a / r) * (1 - a * a * a * a / (12 * r * r * r * r)));
  return { A: t, Iz: s, Iy: e, J: l };
}
function O(n) {
  const o = n / 2, t = Math.PI * o * o, s = Math.PI * o * o * o * o / 4, e = Math.PI * o * o * o * o / 2;
  return { A: t, Iz: s, Iy: s, J: e };
}
function U(n, o, t, s) {
  const e = o - 2 * t, a = 2 * n * t + e * s, r = (n * o * o * o - (n - s) * e * e * e) / 12, l = (2 * t * n * n * n + e * s * s * s) / 12, I = (2 * n * t * t * t + e * s * s * s) / 3;
  return { A: a, Iz: r, Iy: l, J: I };
}
function V(n, o, t, s, e = o, a = t) {
  const r = n - t - a, l = o * t, I = e * a, i = r * s, u = l + I + i, k = (I * a / 2 + i * (a + r / 2) + l * (n - t / 2)) / u, h = e * a ** 3 / 12 + I * (a / 2 - k) ** 2 + s * r ** 3 / 12 + i * (a + r / 2 - k) ** 2 + o * t ** 3 / 12 + l * (n - t / 2 - k) ** 2, A = (t * o ** 3 + a * e ** 3 + r * s ** 3) / 12, F = (x, f) => x * f ** 3 / 3 * (1 - 0.63 * f / x), S = F(o, t) + F(e, a) + F(r, s);
  return { A: u, Iz: h, Iy: A, J: S, As2: s * n, As3: 5 / 6 * (l + I), yc: k };
}
function X(n, o, t, s) {
  const e = n - 2 * s, a = o - 2 * t, r = n * o - e * a, l = (n * o ** 3 - e * a ** 3) / 12, I = (o * n ** 3 - a * e ** 3) / 12, i = (n - s) * (o - t), u = 4 * i * i / (2 * (n - s) / t + 2 * (o - t) / s);
  return { A: r, Iz: l, Iy: I, J: u, As2: 2 * s * o, As3: 2 * t * n };
}
function v(n, o, t) {
  const s = n - 2 * t, e = o - 2 * t, a = n * o - s * e, r = (n * o * o * o - s * e * e * e) / 12, l = (o * n * n * n - e * s * s * s) / 12, I = (n - t) * (o - t), i = 2 * ((n - t) / t + (o - t) / t), u = 4 * I * I / (i > 0 ? i : 1);
  return { A: a, Iz: r, Iy: l, J: u };
}
function N(n, o = 4e3) {
  const t = Math.min(...n.map((e) => e.y0)), s = Math.max(...n.map((e) => e.y1));
  return W((e) => {
    const a = n.find((r) => e >= r.y0 && e < r.y1);
    return a ? a.w : 0;
  }, t, s, o);
}
function W(n, o, t, s = 4e3) {
  const e = (t - o) / s, a = new Float64Array(s), r = new Float64Array(s);
  for (let A = 0; A < s; A++) r[A] = o + (A + 0.5) * e, a[A] = Math.max(0, n(r[A]));
  let l = 0, I = 0;
  for (let A = 0; A < s; A++) l += a[A] * e, I += a[A] * r[A] * e;
  const i = l > 0 ? I / l : 0;
  let u = 0;
  for (let A = 0; A < s; A++) u += a[A] * (r[A] - i) ** 2 * e;
  let k = 0, h = 0;
  for (let A = s - 1; A >= 0; A--) k += a[A] * (r[A] - i) * e, a[A] > 0 && (h += k * k / a[A] * e);
  return h > 0 ? u * u / h : 0;
}
const T = /* @__PURE__ */ new Map();
function Z(n, o, t, s, e = 64, a = t) {
  const r = `${n}|${o}|${t}|${a}|${s}|${e}`, l = T.get(r);
  if (l !== void 0) return l;
  const I = (S, x) => {
    const f = n / S, _ = o / x, z = S * x, m = x, P = new Float64Array(z);
    for (let c = 0; c < S; c++) for (let M = 0; M < x; M++) {
      const y = (c + 0.5) * f - n / 2, J = (M + 0.5) * _ - o / 2, w = Math.abs(y) < n / 2 - a && Math.abs(J) < o / 2 - t;
      P[c * x + M] = 1 / (w ? s : 1);
    }
    const d = (c, M) => 2 * c * M / (c + M), C = new Float64Array(z), q = new Float64Array(z), g = new Float64Array(z);
    for (let c = 0; c < S; c++) for (let M = 0; M < x; M++) {
      const y = c * x + M, J = P[y], w = (c < S - 1 ? d(J, P[y + x]) : J) / (f * f), $ = (c > 0 ? d(J, P[y - x]) : J) / (f * f), L = (M < x - 1 ? d(J, P[y + 1]) : J) / (_ * _), Y = (M > 0 ? d(J, P[y - 1]) : J) / (_ * _);
      C[y] = w + $ + L + Y, M < x - 1 && (q[y] = -L), c < S - 1 && (g[y] = -w);
    }
    const Q = (c, M) => c === M ? C[M] : c === M + 1 ? q[M] : c === M + m ? g[M] : 0, p = new Float64Array(z * (m + 1));
    for (let c = 0; c < z; c++) {
      const M = Math.min(z - 1, c + m);
      for (let y = c; y <= M; y++) {
        let J = Q(y, c);
        const w = Math.max(0, y - m);
        for (let $ = w; $ < c; $++) J -= p[y * (m + 1) + (y - $)] * p[c * (m + 1) + (c - $)];
        y === c ? p[c * (m + 1)] = Math.sqrt(J) : p[y * (m + 1) + (y - c)] = J / p[c * (m + 1)];
      }
    }
    const G = new Float64Array(z);
    for (let c = 0; c < z; c++) {
      let M = 2;
      for (let y = Math.max(0, c - m); y < c; y++) M -= p[c * (m + 1) + (c - y)] * G[y];
      G[c] = M / p[c * (m + 1)];
    }
    const R = new Float64Array(z);
    for (let c = z - 1; c >= 0; c--) {
      let M = G[c];
      const y = Math.min(z - 1, c + m);
      for (let J = c + 1; J <= y; J++) M -= p[J * (m + 1) + (J - c)] * R[J];
      R[c] = M / p[c * (m + 1)];
    }
    let j = 0;
    for (let c = 0; c < z; c++) j += R[c];
    return 2 * j * f * _;
  }, i = Math.max(2, Math.round(n / a)), u = Math.max(2, Math.round(o / t)), k = 4 * Math.max(i, u) <= 160 ? 2 : 1, h = I(k * i, k * u), F = 2 * I(2 * k * i, 2 * k * u) - h;
  return T.set(r, F), F;
}
function B(n, o, t, s, e, a, r, l = t) {
  const I = a / s, i = n - 2 * l, u = o - 2 * t, k = n * o - i * u, h = (n * o * o * o - i * u * u * u) / 12, A = (o * n * n * n - u * i * i * i) / 12, F = i * u, S = i * u * u * u / 12, x = u * i * i * i / 12, f = k + I * F, _ = h + I * S, z = A + I * x, m = s / (2 * (1 + e)), P = a / (2 * (1 + r)), d = N([{ y0: -o / 2, y1: -u / 2, w: n }, { y0: -u / 2, y1: u / 2, w: 2 * l + I * i }, { y0: u / 2, y1: o / 2, w: n }]), C = N([{ y0: -n / 2, y1: -i / 2, w: o }, { y0: -i / 2, y1: i / 2, w: 2 * t + I * u }, { y0: i / 2, y1: n / 2, w: o }]), q = Z(n, o, t, P / m, 64, l);
  return { A: f, Iz: _, Iy: z, J: q, Es: s, Gs: m, A_steel: k, A_conc: F, As2: d, As3: C, n: I, Ec: a };
}
function E(n, o, t, s, e, a) {
  const r = e / t, l = n - 2 * o, I = n / 2, i = l / 2, u = Math.PI * (n * n - l * l) / 4, k = Math.PI * l * l / 4, h = Math.PI * (n ** 4 - l ** 4) / 64, A = Math.PI * l ** 4 / 64, F = u + r * k, S = h + r * A, x = t / (2 * (1 + s)), f = e / (2 * (1 + a)), z = W((P) => 2 * Math.sqrt(Math.max(0, I * I - P * P)) - (Math.abs(P) < i ? (1 - r) * 2 * Math.sqrt(Math.max(0, i * i - P * P)) : 0), -I, I, 8e3), m = Math.PI * (n ** 4 - l ** 4) / 32 + f / x * Math.PI * l ** 4 / 32;
  return { A: F, Iz: S, Iy: S, J: m, Es: t, Gs: x, A_steel: u, A_conc: k, As2: z, As3: z, n: r, Ec: e };
}
function D(n, o, t, s, e, a, r) {
  const l = 4700 * Math.sqrt(a / 1e3) * 1e3;
  return B(n, o, t, s, e, l, r);
}
export {
  B as a,
  H as b,
  E as c,
  U as d,
  O as e,
  D as f,
  v as h,
  V as i,
  K as r,
  X as t
};
