function H(t) {
  return { moiZ: t.Iz, moiY: t.Iy };
}
function K(t, n) {
  const a = t * n, c = t * n * n * n / 12, s = n * t * t * t / 12, e = Math.min(t, n), r = Math.max(t, n), I = e * e * e * r * (1 / 3 - 0.21 * (e / r) * (1 - e * e * e * e / (12 * r * r * r * r)));
  return { A: a, Iz: c, Iy: s, J: I };
}
function O(t) {
  const n = t / 2, a = Math.PI * n * n, c = Math.PI * n * n * n * n / 4, s = Math.PI * n * n * n * n / 2;
  return { A: a, Iz: c, Iy: c, J: s };
}
function U(t, n, a, c) {
  const s = n - 2 * a, e = 2 * t * a + s * c, r = (t * n * n * n - (t - c) * s * s * s) / 12, I = (2 * a * t * t * t + s * c * c * c) / 12, y = (2 * t * a * a * a + s * c * c * c) / 3;
  return { A: e, Iz: r, Iy: I, J: y };
}
function V(t, n, a) {
  const c = t - 2 * a, s = n - 2 * a, e = t * n - c * s, r = (t * n * n * n - c * s * s * s) / 12, I = (n * t * t * t - s * c * c * c) / 12, y = (t - a) * (n - a), i = 2 * ((t - a) / a + (n - a) / a), u = 4 * y * y / (i > 0 ? i : 1);
  return { A: e, Iz: r, Iy: I, J: u };
}
function N(t, n = 4e3) {
  const a = Math.min(...t.map((s) => s.y0)), c = Math.max(...t.map((s) => s.y1));
  return W((s) => {
    const e = t.find((r) => s >= r.y0 && s < r.y1);
    return e ? e.w : 0;
  }, a, c, n);
}
function W(t, n, a, c = 4e3) {
  const s = (a - n) / c, e = new Float64Array(c), r = new Float64Array(c);
  for (let l = 0; l < c; l++) r[l] = n + (l + 0.5) * s, e[l] = Math.max(0, t(r[l]));
  let I = 0, y = 0;
  for (let l = 0; l < c; l++) I += e[l] * s, y += e[l] * r[l] * s;
  const i = I > 0 ? y / I : 0;
  let u = 0;
  for (let l = 0; l < c; l++) u += e[l] * (r[l] - i) ** 2 * s;
  let J = 0, d = 0;
  for (let l = c - 1; l >= 0; l--) J += e[l] * (r[l] - i) * s, e[l] > 0 && (d += J * J / e[l] * s);
  return d > 0 ? u * u / d : 0;
}
const T = /* @__PURE__ */ new Map();
function Z(t, n, a, c, s = 64, e = a) {
  const r = `${t}|${n}|${a}|${e}|${c}|${s}`, I = T.get(r);
  if (I !== void 0) return I;
  const y = (x, w) => {
    const P = t / x, z = n / w, h = x * w, A = w, k = new Float64Array(h);
    for (let o = 0; o < x; o++) for (let M = 0; M < w; M++) {
      const f = (o + 0.5) * P - t / 2, m = (M + 0.5) * z - n / 2, p = Math.abs(f) < t / 2 - e && Math.abs(m) < n / 2 - a;
      k[o * w + M] = 1 / (p ? c : 1);
    }
    const _ = (o, M) => 2 * o * M / (o + M), q = new Float64Array(h), G = new Float64Array(h), g = new Float64Array(h);
    for (let o = 0; o < x; o++) for (let M = 0; M < w; M++) {
      const f = o * w + M, m = k[f], p = (o < x - 1 ? _(m, k[f + w]) : m) / (P * P), $ = (o > 0 ? _(m, k[f - w]) : m) / (P * P), L = (M < w - 1 ? _(m, k[f + 1]) : m) / (z * z), Y = (M > 0 ? _(m, k[f - 1]) : m) / (z * z);
      q[f] = p + $ + L + Y, M < w - 1 && (G[f] = -L), o < x - 1 && (g[f] = -p);
    }
    const Q = (o, M) => o === M ? q[M] : o === M + 1 ? G[M] : o === M + A ? g[M] : 0, F = new Float64Array(h * (A + 1));
    for (let o = 0; o < h; o++) {
      const M = Math.min(h - 1, o + A);
      for (let f = o; f <= M; f++) {
        let m = Q(f, o);
        const p = Math.max(0, f - A);
        for (let $ = p; $ < o; $++) m -= F[f * (A + 1) + (f - $)] * F[o * (A + 1) + (o - $)];
        f === o ? F[o * (A + 1)] = Math.sqrt(m) : F[f * (A + 1) + (f - o)] = m / F[o * (A + 1)];
      }
    }
    const C = new Float64Array(h);
    for (let o = 0; o < h; o++) {
      let M = 2;
      for (let f = Math.max(0, o - A); f < o; f++) M -= F[o * (A + 1) + (o - f)] * C[f];
      C[o] = M / F[o * (A + 1)];
    }
    const R = new Float64Array(h);
    for (let o = h - 1; o >= 0; o--) {
      let M = C[o];
      const f = Math.min(h - 1, o + A);
      for (let m = o + 1; m <= f; m++) M -= F[m * (A + 1) + (m - o)] * R[m];
      R[o] = M / F[o * (A + 1)];
    }
    let j = 0;
    for (let o = 0; o < h; o++) j += R[o];
    return 2 * j * P * z;
  }, i = Math.max(2, Math.round(t / e)), u = Math.max(2, Math.round(n / a)), J = 4 * Math.max(i, u) <= 160 ? 2 : 1, d = y(J * i, J * u), S = 2 * y(2 * J * i, 2 * J * u) - d;
  return T.set(r, S), S;
}
function B(t, n, a, c, s, e, r, I = a) {
  const y = e / c, i = t - 2 * I, u = n - 2 * a, J = t * n - i * u, d = (t * n * n * n - i * u * u * u) / 12, l = (n * t * t * t - u * i * i * i) / 12, S = i * u, x = i * u * u * u / 12, w = u * i * i * i / 12, P = J + y * S, z = d + y * x, h = l + y * w, A = c / (2 * (1 + s)), k = e / (2 * (1 + r)), _ = N([{ y0: -n / 2, y1: -u / 2, w: t }, { y0: -u / 2, y1: u / 2, w: 2 * I + y * i }, { y0: u / 2, y1: n / 2, w: t }]), q = N([{ y0: -t / 2, y1: -i / 2, w: n }, { y0: -i / 2, y1: i / 2, w: 2 * a + y * u }, { y0: i / 2, y1: t / 2, w: n }]), G = Z(t, n, a, k / A, 64, I);
  return { A: P, Iz: z, Iy: h, J: G, Es: c, Gs: A, A_steel: J, A_conc: S, As2: _, As3: q, n: y, Ec: e };
}
function X(t, n, a, c, s, e) {
  const r = s / a, I = t - 2 * n, y = t / 2, i = I / 2, u = Math.PI * (t * t - I * I) / 4, J = Math.PI * I * I / 4, d = Math.PI * (t ** 4 - I ** 4) / 64, l = Math.PI * I ** 4 / 64, S = u + r * J, x = d + r * l, w = a / (2 * (1 + c)), P = s / (2 * (1 + e)), h = W((k) => 2 * Math.sqrt(Math.max(0, y * y - k * k)) - (Math.abs(k) < i ? (1 - r) * 2 * Math.sqrt(Math.max(0, i * i - k * k)) : 0), -y, y, 8e3), A = Math.PI * (t ** 4 - I ** 4) / 32 + P / w * Math.PI * I ** 4 / 32;
  return { A: S, Iz: x, Iy: x, J: A, Es: a, Gs: w, A_steel: u, A_conc: J, As2: h, As3: h, n: r, Ec: s };
}
function v(t, n, a, c, s, e, r) {
  const I = 4700 * Math.sqrt(e / 1e3) * 1e3;
  return B(t, n, a, c, s, I, r);
}
export {
  B as a,
  O as b,
  X as c,
  v as d,
  V as h,
  U as i,
  K as r,
  H as t
};
