import { d as fs, b as ps, a as ds, c as ms, t as Es, i as hs } from "./cadSections-BcRFaG1j.js";
const Wt = 64, us = (r) => r * Math.PI / 180;
function $t(r, E = Wt) {
  switch (r.tipo) {
    case "rect": {
      const { d: a, b: c } = r;
      return [[-c / 2, -a / 2], [c / 2, -a / 2], [c / 2, a / 2], [-c / 2, a / 2]];
    }
    case "circle": {
      const a = r.d / 2, c = [];
      for (let l = 0; l < E; l++) {
        const A = 2 * Math.PI * l / E;
        c.push([a * Math.cos(A), a * Math.sin(A)]);
      }
      return c;
    }
    case "angle": {
      const { d: a, b: c, tf: l, tw: A } = r;
      return [[0, 0], [c, 0], [c, l], [A, l], [A, a], [0, a]].map(([u, R]) => [u - c / 2, R - a / 2]);
    }
    case "channel": {
      const { d: a, b: c, tf: l, tw: A } = r;
      return [[0, 0], [c, 0], [c, l], [A, l], [A, a - l], [c, a - l], [c, a], [0, a]].map(([u, R]) => [u - c / 2, R - a / 2]);
    }
    case "tee": {
      const { d: a, b: c, tf: l, tw: A } = r, u = (c - A) / 2;
      return [[0, a - l], [c, a - l], [c, a], [0, a]].concat([]) && [[u, 0], [u + A, 0], [u + A, a - l], [c, a - l], [c, a], [0, a], [0, a - l], [u, a - l]].map(([R, I]) => [R - c / 2, I - a / 2]);
    }
    case "isection": {
      const { d: a, b: c, tf: l, tw: A } = r, u = (c - A) / 2;
      return [[0, 0], [c, 0], [c, l], [u + A, l], [u + A, a - l], [c, a - l], [c, a], [0, a], [0, a - l], [u, a - l], [u, l], [0, l]].map(([R, I]) => [R - c / 2, I - a / 2]);
    }
    case "polygon":
      return r.puntos.slice();
    default:
      return [];
  }
}
function Is(r, E = Wt) {
  if (r.tipo === "tube") {
    const { d: a, b: c, tf: l, tw: A } = r, u = a / 2 - l, R = c / 2 - A;
    return [[[-R, -u], [-R, u], [R, u], [R, -u]]];
  }
  if (r.tipo === "pipe") {
    const a = r.d / 2 - r.t, c = [];
    for (let l = E - 1; l >= 0; l--) {
      const A = 2 * Math.PI * l / E;
      c.push([a * Math.cos(A), a * Math.sin(A)]);
    }
    return [c];
  }
  return [];
}
function As(r, E = Wt) {
  return r.tipo === "tube" ? $t({ tipo: "rect", d: r.d, b: r.b }) : r.tipo === "pipe" ? $t({ tipo: "circle", d: r.d }, E) : $t(r, E);
}
function gs(r) {
  let E = 0, a = 0, c = 0, l = 0, A = 0, u = 0;
  for (let S = 0; S < r.length; S++) {
    const [d, N] = r[S], [T, k] = r[(S + 1) % r.length], b = d * k - T * N;
    E += b, a += (d + T) * b, c += (N + k) * b, l += (N * N + N * k + k * k) * b, A += (d * d + d * T + T * T) * b, u += (d * k + 2 * d * N + 2 * T * k + T * N) * b;
  }
  if (E /= 2, Math.abs(E) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const R = a / (6 * E), I = c / (6 * E);
  return { A: E, cx: R, cy: I, Ixx: l / 12 - E * I * I, Iyy: A / 12 - E * R * R, Ixy: u / 24 - E * R * I };
}
function Ts(r, E) {
  const a = us(E.rot ?? 0), c = Math.cos(a), l = Math.sin(a), A = E.mirror ? -1 : 1, u = r.map(([R, I]) => {
    const S = R * A;
    return [S * c - I * l + (E.xc ?? 0), S * l + I * c + (E.yc ?? 0)];
  });
  return E.mirror ? u.reverse() : u;
}
function Ms(r, E) {
  let a = 0, c = 0, l = 0;
  const A = [];
  for (const T of r) {
    const k = E > 0 && T.E ? T.E / E : 1;
    if (T.forma.tipo === "rebar") {
      const B = T.forma.area * k;
      A.push({ A: B, cx: T.xc ?? 0, cy: T.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), a += B, c += B * (T.xc ?? 0), l += B * (T.yc ?? 0);
      continue;
    }
    const b = [As(T.forma), ...Is(T.forma)];
    for (const B of b) {
      if (B.length < 3) continue;
      const L = gs(Ts(B, T)), P = L.A * k;
      A.push({ ...L, A: P, n: k }), a += P, c += P * L.cx, l += P * L.cy;
    }
  }
  if (Math.abs(a) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: r.length };
  const u = c / a, R = l / a;
  let I = 0, S = 0, d = 0;
  for (const T of A) I += T.Ixx * T.n + T.A * (T.cy - R) ** 2, S += T.Iyy * T.n + T.A * (T.cx - u) ** 2, d += T.Ixy * T.n + T.A * (T.cx - u) * (T.cy - R);
  const N = (I + S) * 0.1;
  return { A: a, Iz: I, Iy: S, Ixy: d, J: N, cx: u, cy: R, As2: 5 / 6 * a, As3: 5 / 6 * a, nPiezas: r.length };
}
function Ss(r, E, a, c, l) {
  switch ((r || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":
      return { tipo: "rect", d: E, b: a };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":
      return { tipo: "circle", d: E };
    case "STEEL ANGLE":
    case "ANGLE":
      return { tipo: "angle", d: E, b: a, tf: c, tw: l };
    case "STEEL CHANNEL":
    case "CHANNEL":
      return { tipo: "channel", d: E, b: a, tf: c, tw: l };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":
      return { tipo: "tee", d: E, b: a, tf: c, tw: l };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":
      return { tipo: "isection", d: E, b: a, tf: c, tw: l };
    case "STEEL TUBE":
    case "TUBE":
      return { tipo: "tube", d: E, b: a, tf: c, tw: l };
    case "STEEL PIPE":
    case "PIPE":
      return { tipo: "pipe", d: E, t: c || l };
    default:
      return E > 0 && a > 0 ? { tipo: "rect", d: E, b: a } : null;
  }
}
const Rs = [-Math.sqrt(3 / 5), 0, Math.sqrt(3 / 5)], Ls = [5 / 9, 8 / 9, 5 / 9];
function Ut(r, E, a, c, l, A, u) {
  const R = [E[0] - r[0], E[1] - r[1], E[2] - r[2]], I = Math.hypot(R[0], R[1], R[2]), S = new Array(12).fill(0);
  if (!(I > 1e-12) || !(c - a > 1e-12)) return S;
  const d = [R[0] / I, R[1] / I, R[2] / I], N = d[0] * u[0] + d[1] * u[1] + d[2] * u[2], T = [u[0] - N * d[0], u[1] - N * d[1], u[2] - N * d[2]], k = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
  let b = 0, B = 0, L = 0, P = 0, G = 0, Z = 0;
  const ot = (c - a) / 2, nt = (c + a) / 2;
  for (let $ = 0; $ < 3; $++) {
    const tt = nt + ot * Rs[$], j = ot * Ls[$], Y = l + (A - l) * (tt - a) / (c - a), q = tt / I;
    b += j * Y * (1 - 3 * q * q + 2 * q ** 3), B += j * Y * I * q * (1 - q) ** 2, L += j * Y * (3 * q * q - 2 * q ** 3), P += j * Y * I * q * q * (q - 1), G += j * Y * (1 - q), Z += j * Y * q;
  }
  for (let $ = 0; $ < 3; $++) S[$] = b * T[$] + G * N * d[$], S[3 + $] = B * k[$], S[6 + $] = L * T[$] + Z * N * d[$], S[9 + $] = P * k[$];
  return S;
}
function os(r, E, a, c, l, A) {
  const u = (I, S) => {
    const d = r.get(I) ?? [0, 0, 0, 0, 0, 0];
    for (let N = 0; N < 6; N++) d[N] += A[S + N];
    r.set(I, d);
  };
  u(c, 0), u(l, 6);
  const R = E.get(a) ?? new Array(12).fill(0);
  for (let I = 0; I < 12; I++) R[I] -= A[I];
  E.set(a, R);
}
function Ns(r, E, a, c, l) {
  const A = r - E, u = 0.5 * (a + c) * A, R = u > 0 ? A * (2 * a + c) / (3 * (a + c)) : 0, I = u > 0 ? A ** 3 * (a * a + 4 * a * c + c * c) / (36 * (a + c)) : 0, S = l * E, d = A + E / 2, N = u + S, T = (u * R + S * d) / N, k = I + u * (R - T) ** 2 + l * E ** 3 / 12 + S * (d - T) ** 2;
  return [N, k];
}
const ns = (r) => {
  const E = Math.floor(r), a = r - E;
  return a > 0.5 ? E + 1 : a < 0.5 || E % 2 === 0 ? E : E + 1;
};
function ys(r, E, a, c, l) {
  const A = (S) => {
    const d = ns(l / S), N = ns(r / S), T = l / d, k = r / N, b = new Int32Array(d * N).fill(-1);
    let B = 0;
    for (let w = 0; w < N; w++) for (let z = 0; z < d; z++) {
      const et = (z + 0.5) * T - l / 2, K = (w + 0.5) * k, V = c + (a - c) * Math.min(1, Math.max(0, K / (r - E)));
      (K >= r - E || Math.abs(et) <= V / 2) && (b[w * d + z] = B++);
    }
    const L = 1 / (T * T), P = 1 / (k * k), G = [], Z = new Float64Array(B);
    for (let w = 0; w < N; w++) for (let z = 0; z < d; z++) {
      const et = b[w * d + z];
      if (et < 0) continue;
      let K = 0;
      for (const [V, Q, C] of [[1, 0, P], [-1, 0, P], [0, 1, L], [0, -1, L]]) {
        const pt = w + V, lt = z + Q;
        K += pt >= 0 && pt < N && lt >= 0 && lt < d && b[pt * d + lt] >= 0 ? C : 2 * C;
      }
      Z[et] = K, G.push([et, w, z]);
    }
    const ot = (w, z) => {
      for (const [et, K, V] of G) {
        let Q = Z[et] * w[et];
        if (K + 1 < N) {
          const C = b[(K + 1) * d + V];
          C >= 0 && (Q -= P * w[C]);
        }
        if (K > 0) {
          const C = b[(K - 1) * d + V];
          C >= 0 && (Q -= P * w[C]);
        }
        if (V + 1 < d) {
          const C = b[K * d + V + 1];
          C >= 0 && (Q -= L * w[C]);
        }
        if (V > 0) {
          const C = b[K * d + V - 1];
          C >= 0 && (Q -= L * w[C]);
        }
        z[et] = Q;
      }
    }, nt = new Float64Array(B), $ = new Float64Array(B).fill(2), tt = new Float64Array(B), j = new Float64Array(B), Y = new Float64Array(B);
    for (let w = 0; w < B; w++) tt[w] = $[w] / Z[w], j[w] = tt[w];
    let q = 0;
    for (let w = 0; w < B; w++) q += $[w] * tt[w];
    const yt = Math.sqrt(4 * B);
    for (let w = 0; w < 20 * B; w++) {
      ot(j, Y);
      let z = 0;
      for (let C = 0; C < B; C++) z += j[C] * Y[C];
      const et = q / z;
      let K = 0;
      for (let C = 0; C < B; C++) nt[C] += et * j[C], $[C] -= et * Y[C], K += $[C] * $[C];
      if (Math.sqrt(K) < 1e-14 * yt) break;
      let V = 0;
      for (let C = 0; C < B; C++) tt[C] = $[C] / Z[C], V += $[C] * tt[C];
      const Q = V / q;
      q = V;
      for (let C = 0; C < B; C++) j[C] = tt[C] + Q * j[C];
    }
    let It = 0;
    for (let w = 0; w < B; w++) It += nt[w];
    return 2 * It * T * k;
  }, u = Math.min(E, c, a) / 10, R = A(u), I = A(u / 2);
  return I + (I - R) / 3;
}
function Os(r, E, a, c, l, A) {
  const u = [], R = [];
  for (const k of [l, A]) {
    const b = Ns(r, E, a, c, k)[1];
    u.push((12 * b / k) ** (1 / 3)), R.push((3 * ys(r, E, a, c, k) / k) ** (1 / 3));
  }
  const I = (l - a) * (A - a), S = (l - c) * (A - c), d = r - (r - E) / 3 * (I + S + Math.sqrt(I * S)) / (l * A), N = Math.min(R[0], R[1]), T = [d / r, d / r, E / r, (u[0] / r) ** 3, (u[1] / r) ** 3, (N / r) ** 3, 1, 1, d / r, d / r];
  return { t: r, tv: d, tb: [u[0], u[1]], tt: N, mods: T };
}
function Ps(r) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const E = r.split(/\r?\n/), a = { force: "TONF", length: "M" }, c = [], l = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), R = [], I = [], S = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Set(), P = [], G = [], Z = /* @__PURE__ */ new Map(), ot = [];
  let nt = 0;
  const $ = [], tt = [];
  let j = "", Y = "";
  const q = /* @__PURE__ */ new Map(), yt = /(?:WEIGHTPERVOLUME|SLABTHICKNESS|WALLTHICKNESS|HEIGHT|ELEV|SPACING)\s+-?\d+,\d/.test(r), It = (n) => n.split(/("[^"]*")/).map((s, t) => t % 2 ? s : s.replace(/(^|[\s=])(-?\d+),(\d+)(?=[\s]|$)/g, "$1$2.$3")).join("");
  for (const n of E) {
    const s = yt ? It(n.trim()) : n.trim();
    if (!s || s.startsWith("$")) {
      s.startsWith("$ ") && (Y = s.substring(2).trim().replace(/^AREA OBJECT CONNECTIVITIES$/, "AREA CONNECTIVITIES").replace(/^AREA OBJECT LOADS$/, "SHELL OBJECT LOADS"));
      continue;
    }
    if (Y && (q.has(Y) || q.set(Y, []), q.get(Y).push(n)), Y === "CONTROLS") {
      const t = s.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      t && (a.force = t[1], a.length = t[2]);
      const e = s.match(/TITLE2\s+"([^"]+)"/);
      e && (j = e[1]);
    }
    if (Y === "STORIES - IN SEQUENCE FROM TOP") {
      const t = s.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (t) {
        const e = t[1], o = t[2] ? parseFloat(t[2]) : 0, i = t[3] ? parseFloat(t[3]) : void 0;
        c.push({ name: e, height: o, elev: i ?? 0 });
      }
    }
    if (Y === "MATERIAL PROPERTIES") {
      const t = s.match(/MATERIAL\s+"([^"]+)"\s+(?:TYPE\s+"([^"]+)")?/);
      if (t) {
        const e = t[1];
        l.has(e) || l.set(e, { type: t[2] || "", E: 0, G: 0, nu: 0 });
        const o = l.get(e);
        t[2] && (o.type = t[2]);
        const i = s.match(/\bE\s+([\d.eE+-]+)/);
        i && (o.E = parseFloat(i[1]));
        const p = s.match(/\bU\s+([\d.eE+-]+)/);
        p && (o.nu = parseFloat(p[1]), o.G = o.E / (2 * (1 + o.nu)));
        const m = s.match(/\bFY\s+([\d.eE+-]+)/);
        m && (o.fy = parseFloat(m[1]));
        const f = s.match(/\bFC\s+([\d.eE+-]+)/);
        f && (o.fc = parseFloat(f[1]));
        const M = s.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        M && (o.density = parseFloat(M[1]));
      }
    }
    if (Y === "FRAME SECTIONS") {
      const t = s.match(/FRAMESECTION\s+"([^"]+)"/);
      if (t) {
        const e = t[1];
        A.has(e) || A.set(e, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const o = A.get(e), i = s.match(/MATERIAL\s+"([^"]+)"/);
        i && (o.material = i[1]);
        const p = s.match(/SHAPE\s+"([^"]+)"/);
        p && (o.shape = p[1]);
        const m = s.match(/\bD\s+([\d.eE+-]+)/);
        m && (o.D = parseFloat(m[1]));
        const f = s.match(/\bB\s+([\d.eE+-]+)/);
        f && (o.B = parseFloat(f[1]));
        const M = s.match(/\bTF\s+([\d.eE+-]+)/);
        M && (o.TF = parseFloat(M[1]));
        const F = s.match(/\bTW\s+([\d.eE+-]+)/);
        F && (o.TW = parseFloat(F[1]));
        const x = s.match(/\bR\s+([\d.eE+-]+)/);
        x && (o.R = parseFloat(x[1]));
        const v = s.match(/FILLMATERIAL\s+"([^"]+)"/);
        v && (o.fillMaterial = v[1]);
        const g = s.match(/I2MOD\s+([\d.eE+-]+)/);
        g && (o.modI2 = parseFloat(g[1]));
        const O = s.match(/I3MOD\s+([\d.eE+-]+)/);
        O && (o.modI3 = parseFloat(O[1]));
        for (const [H, h] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const X = s.match(h);
          X && (o[H] = parseFloat(X[1]));
        }
        const D = s.match(/\bT\s+([\d.eE+-]+)/);
        D && !o.TF && !o.TW && (o.TF = parseFloat(D[1]), o.TW = parseFloat(D[1]));
        const U = s.match(/\bLIP\s+([\d.eE+-]+)/);
        U && (o.LIP = parseFloat(U[1]));
        const W = s.match(/\bDIS\s+([\d.eE+-]+)/);
        W && (o.DIS = parseFloat(W[1]));
      }
    }
    if (Y === "POINT COORDINATES") {
      const t = s.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      t && u.set(t[1], [parseFloat(t[2]), parseFloat(t[3]), parseFloat(t[4] ?? "0") || 0]);
    }
    if (Y === "LINE CONNECTIVITIES") {
      const t = s.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      t && R.push({ name: t[1], type: t[2], pt1: t[3], pt2: t[4], nStories: parseInt(t[5]) });
    }
    if (Y === "POINT ASSIGNS") {
      const t = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      t && T.set(`${t[1]}@${t[2]}`, t[3].split(/\s+/));
      const e = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      e && L.add(`${e[1]}@${e[2]}`);
      const o = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      o && B.set(`${o[1]}@${o[2]}`, o[3]);
    }
    {
      const t = s.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (t) {
        const e = t[1] === "POINTSPRING" ? "point" : t[1] === "LINESPRING" ? "line" : "area", o = ((_a = b.get(t[2])) == null ? void 0 : _a.k) ?? [0, 0, 0, 0, 0, 0], i = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2, RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const p of s.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const m = i[p[1]];
          m !== void 0 && (o[m] = parseFloat(p[2]));
        }
        b.set(t[2], { tipo: e, k: o });
      }
    }
    if (Y === "LINE ASSIGNS") {
      const t = s.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
      if (t) {
        const e = { story: t[2], section: t[3], rigidZone: 0, releases: [], angle: 0 }, o = s.match(/RIGIDZONE\s+([\d.eE+-]+)/);
        o && (e.rigidZone = parseFloat(o[1]));
        const i = s.match(/LENGTHOFFI\s+([\d.eE+-]+)/), p = s.match(/LENGTHOFFJ\s+([\d.eE+-]+)/);
        (i || p) && (e.offsets = [i ? parseFloat(i[1]) : 0, p ? parseFloat(p[1]) : 0]);
        const m = s.match(/RELEASE\s+"([^"]+)"/);
        m && (e.releases = m[1].split(/\s+/));
        const f = s.match(/ANG\s+([-\d.eE+]+)/);
        f && (e.angle = parseFloat(f[1]));
        const M = s.match(/SPRINGPROP\s+"([^"]+)"/);
        M && (e.spring = M[1]), e.mallaEnCruces = /MESHATINTERSECTIONS\s+"?YES/i.test(s), k.set(`${t[1]}@${t[2]}`, e);
      }
    }
    if (Y === "GRIDS") {
      const t = s.match(/^\s*GRID\s+"[^"]+"\s+LABEL\s+"([^"]+)"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)/);
      t && $.push({ label: t[1], dir: t[2], coord: parseFloat(t[3]) });
      const e = s.match(/^\s*REFERENCEPLANE\s.*\sZ\s+([-\d.eE+]+)/);
      e && tt.push({ z: parseFloat(e[1]) });
    }
    if (Y === "FRAME OBJECT LOADS") {
      const t = s.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (t) P.push({ line: t[1], story: t[2], type: t[3], dir: t[4], lc: t[5], val: parseFloat(t[6]) });
      else {
        const e = s.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"TRAPF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"(.*)$/);
        if (e) {
          const o = (i, p) => {
            const m = e[5].match(new RegExp(`\\b${i}\\s+([-\\d.eE+]+)`));
            return m ? parseFloat(m[1]) : p;
          };
          P.push({ line: e[1], story: e[2], type: "TRAPF", dir: e[3], lc: e[4], val: 0, fs: o("FSTART", 0), fe: o("FEND", 0), rs: o("RDSTART", 0), re: o("RDEND", 1) });
        }
      }
    }
    {
      const t = s.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      t && (Z.has(t[1]) || Z.set(t[1], []), Z.get(t[1]).push({ lc: t[2], val: parseFloat(t[3]) }));
    }
    if (Y === "LOAD PATTERNS") {
      const t = s.match(/LOADPATTERN\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+SELFWEIGHT\s+([\d.eE+-]+)/);
      t && /dead/i.test(t[2]) && (nt = Math.max(nt, parseFloat(t[3])));
    }
    if (Y === "POINT OBJECT LOADS") {
      const t = s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"\s+LC\s+"([^"]+)"(.*)$/) ?? s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"(.*)$/);
      if (t) {
        const e = (o) => {
          const i = t[4].match(new RegExp(`\\b${o}\\s+([-\\d.eE+]+)`));
          return i ? parseFloat(i[1]) : 0;
        };
        ot.push({ pt: t[1], story: t[2], lc: t[3], v: ["FX", "FY", "FZ", "MX", "MY", "MZ"].map(e) });
      }
    }
    if (Y === "SHELL OBJECT LOADS") {
      const t = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (t) G.push({ area: t[1], story: t[2], tipo: "UNIFF", dir: t[3], lc: t[4], val: parseFloat(t[5]) });
      else {
        const e = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        e && G.push({ area: e[1], story: e[2], tipo: "UNIFLOADSET", dir: "GRAV", lc: "", val: 0, set: e[3] });
      }
    }
    if (Y === "AREA CONNECTIVITIES") {
      const t = s.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (t) {
        const e = ((_b = t[3].match(/"([^"]+)"/g)) == null ? void 0 : _b.map((i) => i.replace(/"/g, ""))) || [], o = t[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/).filter(Boolean).map(Number).filter((i) => Number.isFinite(i));
        I.push({ name: t[1], tipo: t[2] || "FLOOR", pts: e, dz: o.length === e.length ? o : e.map(() => 0) });
      }
    }
    if (s.startsWith("SDSECTION")) {
      const t = (_c = s.match(/SDSECTION\s+"([^"]+)"/)) == null ? void 0 : _c[1], e = (_d = s.match(/SHAPETYPE\s+"([^"]+)"/)) == null ? void 0 : _d[1];
      if (t && e) {
        const o = (i) => {
          const p = s.match(i);
          return p ? parseFloat(p[1]) : 0;
        };
        N.has(t) || N.set(t, []), N.get(t).push({ shapeType: e, material: ((_e = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _e[1]) ?? "", D: o(/\bD\s+([\d.eE+-]+)/), B: o(/\bB\s+([\d.eE+-]+)/), TF: o(/\bTF\s+([\d.eE+-]+)/), TW: o(/\bTW\s+([\d.eE+-]+)/), XC: o(/\bXC\s+(-?[\d.eE+-]+)/), YC: o(/\bYC\s+(-?[\d.eE+-]+)/) });
      }
    }
    if (Y === "AREA ASSIGNS") {
      const t = s.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/);
      t && (S.get(t[1]) ?? S.set(t[1], []).get(t[1])).push({ story: t[2], section: t[3], spring: (_f = s.match(/SPRINGPROP\s+"([^"]+)"/)) == null ? void 0 : _f[1] });
    }
    if (s.startsWith("SHELLPROP")) {
      const t = (_g = s.match(/SHELLPROP\s+"([^"]+)"/)) == null ? void 0 : _g[1];
      if (t) {
        const e = (U) => {
          const W = s.match(U);
          return W ? parseFloat(W[1]) : void 0;
        }, o = e(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? e(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? e(/DECKSLABDEPTH\s+([\d.eE+-]+)/), p = /PROPTYPE\s+"Deck"/.test(s) ? { tc: e(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: e(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: e(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: e(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: e(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: e(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, m = (_h = s.match(/SLABTYPE\s+"([^"]+)"/)) == null ? void 0 : _h[1];
        let f;
        if (m === "Ribbed" || m === "Waffle") {
          const U = e(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? 0, W = e(/OVERALLDEPTH\s+([\d.eE+-]+)/) ?? 0, H = ((e(/SLABRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0) + (e(/SLABRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0)) / 2, h = e(/SLABRIBSPACING1?\s+([\d.eE+-]+)/) ?? 0, X = e(/SLABRIBSPACING2\s+([\d.eE+-]+)/) ?? h, J = m === "Ribbed" ? h > 0 ? H / h : 0 : h > 0 && X > 0 ? H / h + H / X - H * H / (h * X) : 0;
          U > 0 && W > U && (f = (U + (W - U) * J) / U);
        }
        let M, F;
        if (m === "Waffle") {
          const U = e(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? 0, W = e(/OVERALLDEPTH\s+([\d.eE+-]+)/) ?? 0, H = e(/SLABRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, h = e(/SLABRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? H, X = e(/SLABRIBSPACING1?\s+([\d.eE+-]+)/) ?? 0, J = e(/SLABRIBSPACING2\s+([\d.eE+-]+)/) ?? X, rt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }[(a.length || "M").toUpperCase()] ?? 1;
          U > 0 && W > U && H > 0 && X > H && J > H && (M = Os(W * rt, U * rt, H * rt, h * rt, X * rt, J * rt).mods, F = W, f = void 0);
        }
        const v = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((U) => e(new RegExp(U + "\\s+([\\d.eE+-]+)"))), g = d.get(t), O = e(/\bMMOD\s+([\d.eE+-]+)/), D = e(/\bWMOD\s+([\d.eE+-]+)/);
        if (g && O !== void 0 && (g.mmod = O), g && D !== void 0 && (g.wmod = D), v.some((U) => U !== void 0)) {
          const U = v.map((W) => W ?? 1);
          d.set(t, { t: (g == null ? void 0 : g.t) ?? 0, material: (g == null ? void 0 : g.material) ?? "", modeling: (g == null ? void 0 : g.modeling) ?? "ShellThin", mods: U, deck: g == null ? void 0 : g.deck, pesoFactor: g == null ? void 0 : g.pesoFactor, mmod: g == null ? void 0 : g.mmod, wmod: g == null ? void 0 : g.wmod, reticular: g == null ? void 0 : g.reticular });
        } else o !== void 0 && d.set(t, { t: F ?? o, mods: g == null ? void 0 : g.mods, deck: p ?? (g == null ? void 0 : g.deck), pesoFactor: f ?? (g == null ? void 0 : g.pesoFactor), mmod: g == null ? void 0 : g.mmod, wmod: g == null ? void 0 : g.wmod, reticular: M ?? (g == null ? void 0 : g.reticular), material: ((_i = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _i[1]) ?? ((_j = s.match(/CONCMATERIAL\s+"([^"]+)"/)) == null ? void 0 : _j[1]) ?? "", modeling: ((_k = s.match(/MODELINGTYPE\s+"([^"]+)"/)) == null ? void 0 : _k[1]) ?? (/PROPTYPE\s+"Deck"/.test(s) ? "Membrane" : "ShellThin") });
      }
    }
  }
  const w = /* @__PURE__ */ new Map();
  if (c.length > 0) {
    const n = c.length - 1;
    w.set(c[n].name, c[n].elev);
    for (let s = n - 1; s >= 0; s--) {
      const e = w.get(c[s + 1].name) + c[s].height;
      c[s].elev = e, w.set(c[s].name, e);
    }
  }
  const z = [], et = [], K = /* @__PURE__ */ new Map(), V = (n, s) => `${n}@${s}`, Q = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Map();
  for (const n of R) C.set(n.name, n);
  for (const n of R) for (const [s, t] of k) {
    if (!s.startsWith(n.name + "@")) continue;
    const e = t.story, o = c.findIndex((i) => i.name === e);
    if (!(o < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      Q.add(V(n.pt2, e));
      const i = Math.min(o + n.nStories, c.length - 1);
      Q.add(V(n.pt1, c[i].name));
      for (let p = o + 1; p < i; p++) Q.add(V(n.pt1, c[p].name));
    } else Q.add(V(n.pt1, e)), Q.add(V(n.pt2, e));
  }
  for (const [n] of T) Q.add(n);
  for (const n of L) Q.add(n);
  const pt = (n, s) => {
    const t = c.findIndex((o) => o.name === n);
    if (t < 0) return;
    const e = t + (s || 0);
    if (!(e < 0 || e > c.length - 1)) return c[e].name;
  };
  for (const n of I) for (const s of S.get(n.name) ?? []) n.pts.forEach((t, e) => {
    const o = pt(s.story, n.dz[e] ?? 0);
    o && Q.add(V(t, o));
  });
  const lt = /* @__PURE__ */ new Map();
  for (const n of Q) {
    const [s, t] = n.split("@"), e = u.get(s), o = w.get(t);
    if (e === void 0 || o === void 0) continue;
    z.push([e[0], e[1], o - (e[2] ?? 0)]), et.push(n), K.set(n, z.length - 1);
    const i = B.get(n);
    i && lt.set(z.length - 1, i);
  }
  const ct = [], ft = [], Ot = [], Et = [], At = /* @__PURE__ */ new Map(), Ft = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new Map(), gt = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map(), ht = /* @__PURE__ */ new Map();
  for (const n of R) for (const [s, t] of k) {
    if (!s.startsWith(n.name + "@")) continue;
    const e = t.story, o = c.findIndex((f) => f.name === e);
    if (o < 0) continue;
    const i = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const f = Math.min(o + n.nStories, c.length - 1);
      for (let M = f; M > o; M--) i.push(V(n.pt1, c[M].name));
      i.push(V(n.pt2, e));
    } else i.push(V(n.pt1, e), V(n.pt2, e));
    const p = i.map((f) => K.get(f)).filter((f) => f !== void 0);
    if (p.length < 2) continue;
    const m = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let f = 0; f < p.length - 1; f++) {
      const M = p[f], F = p[f + 1];
      if (M === F) continue;
      const x = ct.length;
      if (ct.push([M, F]), ft.push(p.length > 2 ? `${n.name}-${f + 1}` : n.name), Ot.push(n.type), Et.push(e), At.set(x, t.section), t.spring && Ft.set(x, t.spring), t.mallaEnCruces && Ht.set(x, true), t.rigidZone > 0 && gt.set(x, [t.rigidZone, t.rigidZone]), t.angle && zt.set(x, t.angle), t.offsets && ht.set(x, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const v = new Array(12).fill(false);
        for (const g of t.releases) {
          const O = m[g];
          O !== void 0 && (O < 6 && f !== 0 || O >= 6 && f !== p.length - 2 || (v[O] = true));
        }
        v.some(Boolean) && Yt.set(x, v);
      }
    }
  }
  const Tt = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map(), Pt = /* @__PURE__ */ new Map(), wt = /* @__PURE__ */ new Map(), Dt = /* @__PURE__ */ new Map(), vt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map();
  let Jt = 0;
  const xt = /* @__PURE__ */ new Map();
  for (const [n, s] of At) {
    const t = A.get(s);
    if (!t) continue;
    const e = l.get(t.material);
    e && (Tt.set(n, e.E), Mt.set(n, e.G));
    const o = t.D, i = t.B, p = t.TF, m = t.TW;
    let f = 0, M = 0, F = 0, x = 0, v = 0, g = 0, O = "rect", D = 0, U = false, W = false;
    const H = N.get(s);
    if (t.shape === "SD Section" && (H == null ? void 0 : H.length)) {
      const h = (e == null ? void 0 : e.E) || ((_l = l.get(t.material)) == null ? void 0 : _l.E) || 0, X = [];
      for (const J of H) {
        const rt = Ss(J.shapeType, J.D, J.B, J.TF, J.TW);
        rt && X.push({ forma: rt, xc: J.XC, yc: J.YC, E: ((_m = l.get(J.material)) == null ? void 0 : _m.E) || h });
      }
      if (X.length) {
        const J = Ms(X, h);
        J.A > 0 && (f = J.A, M = J.Iz, F = J.Iy, x = J.J, v = J.As2, g = J.As3, O = "rect", W = true, Jt++);
      }
    }
    if (!W) switch (t.shape) {
      case "Concrete Rectangular":
        f = o * i, M = i * o ** 3 / 12, F = o * i ** 3 / 12, x = i * o ** 3 * (1 / 3 - 0.21 * (o / i) * (1 - o ** 4 / (12 * i ** 4))), v = g = 5 / 6 * f, O = "rect";
        break;
      case "Concrete Circle":
        f = Math.PI * o ** 2 / 4, M = F = Math.PI * o ** 4 / 64, x = Math.PI * o ** 4 / 32, v = g = 0.9 * f, O = "circ";
        break;
      case "Steel I/Wide Flange": {
        const h = hs(o, i, p, m);
        f = h.A, M = h.Iz, F = h.Iy, x = h.J, g = h.As2, v = h.As3, O = "I";
        break;
      }
      case "Steel Tube": {
        const h = Es(i, o, p || m, m || p);
        f = h.A, M = h.Iz, F = h.Iy, x = h.J, g = h.As2, v = h.As3, O = "HSS";
        break;
      }
      case "Filled Steel Pipe": {
        const h = (e == null ? void 0 : e.E) || 0, X = t.fillMaterial ? l.get(t.fillMaterial) : void 0, J = (X == null ? void 0 : X.E) || h * 0.125, rt = t.T || m || p, at = ds(o, rt, h || 1, (e == null ? void 0 : e.nu) ?? 0.3, J || 0.125, (X == null ? void 0 : X.nu) ?? 0.2);
        f = at.A, M = at.Iz, F = at.Iy, x = at.J, g = at.As2, v = at.As3, D = J, U = true, O = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const h = (e == null ? void 0 : e.E) || 0, X = t.fillMaterial ? l.get(t.fillMaterial) : void 0, J = (X == null ? void 0 : X.E) || h * 0.125, at = ps(i, o, m || p, h || 1, (e == null ? void 0 : e.nu) ?? 0.3, J || 0.125, (X == null ? void 0 : X.nu) ?? 0.2);
        f = at.A, M = at.Iz, F = at.Iy, x = at.J, g = at.As2, v = at.As3, D = J, O = "CFT";
        break;
      }
      case "Steel Angle": {
        const h = p || m;
        f = h * (o + i - h), M = h * (o ** 3 + i * h ** 2 + h ** 2 * (o - h)) / 12, F = h * (i ** 3 + o * h ** 2 + h ** 2 * (i - h)) / 12, x = (o + i - h) * h ** 3 / 3, v = o * h, g = i * h, O = "L";
        break;
      }
      case "Steel Channel": {
        const h = ms(o, i, p, m);
        f = h.A, M = h.Iz, F = h.Iy, x = h.J, g = h.As2, v = h.As3, O = "C";
        break;
      }
      case "Steel Double Angle": {
        const h = fs(o, i, p, m, t.DIS || 0);
        f = h.A, M = h.Iz, F = h.Iy, x = h.J, g = h.As2, v = h.As3, O = "2L";
        break;
      }
      case "Cold Formed C":
        f = 2 * i * p + (o - 2 * p) * m, M = (m * o ** 3 + 2 * i * p * (o - p) ** 2) / 12, F = (2 * p * i ** 3 + (o - 2 * p) * m ** 3) / 12, x = (2 * i * p ** 3 + (o - 2 * p) * m ** 3) / 3, v = (o - 2 * p) * m, g = 2 * i * p * 5 / 6, O = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        f = 2 * (2 * i * p + (o - 2 * p) * m), M = 2 * (m * o ** 3 + 2 * i * p * (o - p) ** 2) / 12, F = 2 * (2 * p * i ** 3 + (o - 2 * p) * m ** 3) / 12, x = 2 * (2 * i * p ** 3 + (o - 2 * p) * m ** 3) / 3, v = 2 * (o - 2 * p) * m, g = 4 * i * p * 5 / 6, O = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          f = t.AREA, M = t.I33 ?? 0, F = t.I22 ?? 0, x = t.TORSION ?? 0, g = t.AS2 ?? 0, v = t.AS3 ?? 0, O = "general";
          break;
        }
      default:
        o > 0 && i > 0 && (f = o * i, M = i * o ** 3 / 12, F = o * i ** 3 / 12, x = Math.min(o, i) * Math.max(o, i) ** 3 / 3 * 0.3, v = g = 5 / 6 * f);
        break;
    }
    t.modI2 && (F *= t.modI2), t.modI3 && (M *= t.modI3), St.set(n, f), wt.set(n, M), Dt.set(n, F), vt.set(n, x), v > 0 && Ct.set(n, v), g > 0 && Pt.set(n, g), Rt.set(n, { type: O, ...D > 0 ? { fillE: D } : {}, b: U ? void 0 : i || void 0, h: U ? void 0 : o || void 0, d: O === "circ" || O === "pipe" || U ? o : void 0, tw: m || void 0, tf: p || void 0, r: t.R, name: s }), xt.set(n, { name: s, shape: t.shape, D: t.D > 0 ? t.D : void 0, B: t.B > 0 ? t.B : void 0, TF: t.TF > 0 ? t.TF : void 0, TW: t.TW > 0 ? t.TW : void 0, r: t.R, material: t.material, ...t.fillMaterial ? { fillMaterial: t.fillMaterial } : {} });
  }
  const Lt = /* @__PURE__ */ new Map();
  for (const [n, s] of T) {
    const t = K.get(n);
    if (t === void 0) continue;
    const e = [false, false, false, false, false, false];
    for (const o of s) o === "UX" && (e[0] = true), o === "UY" && (e[1] = true), o === "UZ" && (e[2] = true), o === "RX" && (e[3] = true), o === "RY" && (e[4] = true), o === "RZ" && (e[5] = true);
    Lt.set(t, e);
  }
  const it = /* @__PURE__ */ new Map(), Vt = /* @__PURE__ */ new Map();
  for (let n = 0; n < ft.length; n++) Vt.set(`${ft[n]}@${Et[n]}`, n);
  const ut = /* @__PURE__ */ new Map();
  let kt = 0;
  for (const n of P) {
    const s = Vt.get(`${n.line}@${n.story}`);
    if (s === void 0) continue;
    const [t, e] = ct[s], o = z[t], i = z[e], p = Math.sqrt((i[0] - o[0]) ** 2 + (i[1] - o[1]) ** 2 + (i[2] - o[2]) ** 2);
    if (p < 1e-10) continue;
    const m = n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "GRAVPROJ" ? [0, 0, -1] : n.dir === "X" ? [1, 0, 0] : n.dir === "Y" ? [0, 1, 0] : n.dir === "Z" ? [0, 0, 1] : null;
    if (!m) {
      kt++;
      continue;
    }
    const f = n.type === "TRAPF" ? Ut(o, i, (n.rs ?? 0) * p, (n.re ?? 1) * p, n.fs ?? 0, n.fe ?? 0, m) : Ut(o, i, 0, p, n.val, n.val, m);
    os(it, ut, s, t, e, f);
  }
  kt && console.warn(`[e2kParser] ${kt} LINELOAD en ejes LOCALES (DIR 1/2/3) no se leen: esa carga se pierde.`);
  const dt = /* @__PURE__ */ new Map(), bt = /* @__PURE__ */ new Map();
  for (const [n, s] of At) {
    const t = A.get(s);
    if (!t) continue;
    const e = l.get(t.material);
    (e == null ? void 0 : e.density) && dt.set(n, e.density);
  }
  const Nt = /* @__PURE__ */ new Map(), qt = /* @__PURE__ */ new Map(), Zt = /* @__PURE__ */ new Map(), Kt = /* @__PURE__ */ new Map(), Xt = /* @__PURE__ */ new Map(), jt = /* @__PURE__ */ new Map(), Bt = [], st = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of I) {
    ((_n = S.get(n.name)) == null ? void 0 : _n.length) || st.sinAssign++;
    for (const s of S.get(n.name) ?? []) {
      const t = n.pts.map((p, m) => {
        const f = pt(s.story, n.dz[m] ?? 0);
        return f === void 0 ? void 0 : K.get(V(p, f));
      });
      if (t.some((p) => p === void 0)) {
        st.sinNudo++;
        continue;
      }
      const o = t.filter((p, m, f) => f.indexOf(p) === m);
      if (o.length < 3) {
        st.colapsada++;
        continue;
      }
      const i = o.length <= 4 ? [o.length === 3 ? o : t.slice(0, 4)] : Fs(o, z);
      if (!i.length) {
        st.poligono++;
        continue;
      }
      for (const p of i) {
        const m = ct.length;
        ct.push(p), ft.push(n.name), Ot.push(n.tipo), Et.push(s.story), Bt.push(n.name), s.spring && Ft.set(m, s.spring);
        const f = d.get(s.section);
        if (f) {
          Nt.set(m, f.t);
          const M = l.get(f.material);
          (M == null ? void 0 : M.E) && Tt.set(m, M.E), (M == null ? void 0 : M.G) && Mt.set(m, M.G), (M == null ? void 0 : M.nu) !== void 0 && qt.set(m, M.nu), (M == null ? void 0 : M.density) && dt.set(m, M.density * (f.pesoFactor ?? 1));
          const F = f.reticular, x = (f.wmod ?? 1) * (F ? F[9] : 1), v = (f.mmod ?? 1) * (F ? F[8] : 1);
          if ((f.wmod !== void 0 || F) && Zt.set(m, x), (f.mmod !== void 0 || F) && Kt.set(m, v), f.deck && f.deck.tc > 0) {
            const D = f.deck, U = D.tc + (D.sr > 0 ? D.hr * (D.wrt + D.wrb) / 2 / D.sr : 0);
            dt.set(m, (((M == null ? void 0 : M.density) ?? 0) * U + D.w) / D.tc), bt.set(m, { ...D });
          }
          const g = /membrane/i.test(f.modeling);
          Xt.set(m, /thick/i.test(f.modeling) || g ? 0 : 1);
          const O = f.mods ? f.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
          if (F) for (let D = 0; D < 8; D++) O[D] *= F[D];
          g && (O[3] = 0, O[4] = 0, O[5] = 0, O[6] = 0, O[7] = 0), (f.mods || g || F) && jt.set(m, O);
        }
        f && xt.set(m, { name: s.section, shape: f.modeling, t: f.t > 0 ? f.t : void 0, material: f.material });
      }
    }
  }
  const mt = /* @__PURE__ */ new Map();
  for (let n = 0; n < ft.length; n++) if (ct[n].length > 2) {
    const s = `${ft[n]}@${Et[n]}`;
    mt.has(s) || mt.set(s, []), mt.get(s).push(n);
  }
  let Gt = 0;
  for (const n of ot) {
    const s = K.get(V(n.pt, n.story));
    if (s === void 0) {
      Gt++;
      continue;
    }
    const t = it.get(s) || [0, 0, 0, 0, 0, 0];
    for (let e = 0; e < 6; e++) t[e] += n.v[e];
    it.set(s, t);
  }
  ot.length && console.log(`[e2kParser] cargas puntuales: ${ot.length - Gt} aplicadas \xB7 ${Gt} sin nudo (punto@planta que no existe)`);
  let Qt = 0, _t = 0, ts = 0, ss = 0;
  for (const n of G) {
    const s = mt.get(`${n.area}@${n.story}`) ?? mt.get(`${n.area}@`), t = s !== void 0 ? s : (_o = [...mt].find(([o]) => o.startsWith(n.area + "@"))) == null ? void 0 : _o[1];
    if (t === void 0) {
      _t++;
      continue;
    }
    let e = false;
    for (const o of t) {
      const i = ct[o], p = i.map((W) => z[W]).filter(Boolean);
      if (p.length < 3) continue;
      let m = 0, f = 0, M = 0;
      for (let W = 0; W < p.length; W++) {
        const H = p[W], h = p[(W + 1) % p.length];
        m += H[1] * h[2] - H[2] * h[1], f += H[2] * h[0] - H[0] * h[2], M += H[0] * h[1] - H[1] * h[0];
      }
      const F = Math.hypot(m, f, M) / 2;
      if (!(F > 0)) continue;
      const x = n.tipo === "UNIFLOADSET" ? Z.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
      let v = 0;
      for (const W of x) v += W.val;
      if (!v) {
        e || ts++, e = true;
        break;
      }
      e || ss++, e = true;
      const g = v * F / p.length;
      Qt += v * F;
      let O = 0, D = 0, U = 0;
      n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? U = -g : n.dir === "X" ? O = g : n.dir === "Y" && (D = g);
      for (const W of i) {
        const H = it.get(W) || [0, 0, 0, 0, 0, 0];
        H[0] += O, H[1] += D, H[2] += U, it.set(W, H);
      }
    }
  }
  G.length && console.info(`[e2kParser] cargas de losa: ${ss} aplicadas \xB7 ${_t} sin area que las lleve \xB7 ${ts} sin valor \xB7 total ${Qt.toFixed(0)} (unidades del fichero) \xB7 ${Z.size} juegos con nombre`);
  const es = st.sinAssign + st.sinNudo + st.colapsada + st.poligono;
  if (es) {
    const n = [st.poligono && `${st.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, st.sinAssign && `${st.sinAssign} sin AREAASSIGN`, st.sinNudo && `${st.sinNudo} con algun nudo que no resuelve a planta`, st.colapsada && `${st.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${es} de ${I.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const cs = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, is = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, y = cs[(a.length || "M").toUpperCase()] ?? 1, _ = is[(a.force || "KN").toUpperCase()] ?? 1;
  if (y !== 1 || _ !== 1) {
    const n = (s, t) => {
      if (s) for (const [e, o] of s) s.set(e, o * t);
    };
    for (const s of z) s[0] *= y, s[1] *= y, s[2] *= y;
    for (const s of c) s.height *= y, s.elev *= y;
    for (const s of $) s.coord *= y;
    for (const s of tt) s.z *= y;
    n(Nt, y), n(St, y * y);
    for (const s of b.values()) {
      const t = s.tipo === "point" ? _ / y : s.tipo === "line" ? _ / (y * y) : _ / (y * y * y);
      for (let e = 0; e < 6; e++) s.k[e] *= e < 3 ? t : s.tipo === "point" ? _ * y : _;
    }
    n(Ct, y * y), n(Pt, y * y), n(Dt, y ** 4), n(wt, y ** 4), n(vt, y ** 4), n(Tt, _ / (y * y)), n(Mt, _ / (y * y)), n(dt, _ / y ** 3);
    for (const s of bt.values()) s.tc *= y, s.hr *= y, s.wrt *= y, s.wrb *= y, s.sr *= y, s.w *= _ / (y * y);
    for (const [s, t] of gt) gt.set(s, [t[0] * y, t[1] * y]);
    for (const [s, t] of ht) ht.set(s, [t[0] * y, t[1] * y, t[2]]);
    for (const [s, t] of it) it.set(s, t.map((e, o) => e * (o < 3 ? _ : _ * y)));
    for (const [s, t] of ut) ut.set(s, t.map((e, o) => e * (o % 6 < 3 ? _ : _ * y)));
    for (const [, s] of b) {
      const t = s.tipo === "point" ? 1 : s.tipo === "line" ? 2 : 3;
      for (let e = 0; e < 6; e++) s.k[e] *= e < 3 ? _ / y ** t : _ * y / y ** (t - 1);
    }
    for (const [, s] of Rt) {
      for (const t of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const e = s;
        typeof e[t] == "number" && (e[t] *= y);
      }
      typeof s.fillE == "number" && (s.fillE *= _ / (y * y));
    }
  }
  {
    const n = as(ct, Lt);
    n.nPiezasFlotantes && console.warn(`[e2kParser] ${n.nPiezasFlotantes} trozos (${n.nNudosFlotantes} nudos) no llegan a ningun apoyo: la matriz sale SINGULAR y el modelo no resuelve. En ETABS los sujetan links, muelles de pilote o diafragmas, que este lector aun no importa.`);
  }
  const rs = () => {
    if (!(nt > 0)) return it;
    let n = 0;
    const s = (t, e) => {
      const o = it.get(t) || [0, 0, 0, 0, 0, 0];
      o[2] += e, it.set(t, o), n += e;
    };
    return ct.forEach((t, e) => {
      const o = dt.get(e);
      if (!o) return;
      const i = t;
      if (i.length === 2) {
        const p = St.get(e) ?? 0, m = z[i[0]], f = z[i[1]], M = ht.get(e), F = f[0] - m[0], x = f[1] - m[1], v = f[2] - m[2], g = Math.hypot(F, x), O = g > 1e-9 && Math.atan2(Math.abs(v), g) * 180 / Math.PI < 20, D = Math.hypot(F, x, v), U = Math.max(0, D - (M && O ? M[0] + M[1] : 0)), W = o * p * nt, H = D > 0 ? U / D : 0, h = Ut(m, f, 0, D, W, W, [0, 0, -1]).map((X, J) => X * (J % 6 < 3 ? H : H * H));
        n += h[2] + h[8], os(it, ut, e, i[0], i[1], h);
      } else if (i.length >= 3) {
        const p = Nt.get(e) ?? 0, m = i.map((g) => z[g]);
        let f = 0, M = 0, F = 0;
        for (let g = 0; g < m.length; g++) {
          const O = m[g], D = m[(g + 1) % m.length];
          f += O[1] * D[2] - O[2] * D[1], M += O[2] * D[0] - O[0] * D[2], F += O[0] * D[1] - O[1] * D[0];
        }
        const x = Math.hypot(f, M, F) / 2, v = o * p * x * nt * (Zt.get(e) ?? 1);
        for (const g of i) s(g, -v / i.length);
      }
    }), console.log(`[e2kParser] peso propio (SELFWEIGHT ${nt}): ${n.toFixed(3)} kN repartidos a los nudos`), it;
  }, ls = () => {
    const n = [];
    for (const [s, t] of lt) {
      const e = b.get(t);
      !e || e.tipo !== "point" || e.k.forEach((o, i) => {
        o > 0 && n.push({ node: s, dof: i, k: o });
      });
    }
    return n.length ? n : void 0;
  };
  return { units: a, stories: c.reverse(), materials: l, frameSections: A, nodes: z, nodeNames: et, nodeNameToIdx: K, elements: ct, elementNames: ft, elementTypes: Ot, elementStories: Et, elementSections: At, nodeInputs: { supports: Lt, loads: rs(), springNames: lt, springs: ls() }, elementInputs: { elasticities: Tt, shearModuli: Mt, areas: St, momentsOfInertiaZ: wt, momentsOfInertiaY: Dt, torsionalConstants: vt, shearAreasY: Ct, shearAreasZ: Pt, rigidOffsets: gt, momentReleases: Yt, localAngles: zt, endOffsets: ht, densities: new Map([...dt].map(([n, s]) => [n, s / 9.80665 * (Kt.get(n) ?? 1)])), deckSections: bt, sectionShapes: Rt, thicknesses: Nt, poissonsRatios: qt, plateFormulations: Xt, shellModifiers: jt, frameFixedEnd: ut, sectionInfo: xt, springNames: Ft, mallaEnCruces: Ht }, sectionShapes: Rt, grids: $, planosRef: tt, springProps: b, info: { ...as(ct, Lt), nNodes: z.length, nFrames: ct.length - Bt.length, nAreas: I.length, nAreasMontadas: Bt.length, nSDCompuestas: Jt, nSDLeidas: N.size, title: j }, rawSections: q };
}
function Fs(r, E) {
  const a = r.length;
  if (a < 3) return [];
  const c = [0, 0, 0];
  for (let L = 0; L < a; L++) {
    const P = E[r[L]], G = E[r[(L + 1) % a]];
    c[0] += (P[1] - G[1]) * (P[2] + G[2]), c[1] += (P[2] - G[2]) * (P[0] + G[0]), c[2] += (P[0] - G[0]) * (P[1] + G[1]);
  }
  const l = [Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[2])], A = l[2] >= l[0] && l[2] >= l[1] ? 2 : l[1] >= l[0] ? 1 : 0, [u, R] = A === 2 ? [0, 1] : A === 1 ? [2, 0] : [1, 2], I = r.map((L) => [E[L][u], E[L][R]]);
  let S = 0;
  for (let L = 0; L < a; L++) S += I[L][0] * I[(L + 1) % a][1] - I[(L + 1) % a][0] * I[L][1];
  if (Math.abs(S) < 1e-12) return [];
  const d = [...Array(a).keys()];
  S < 0 && d.reverse();
  const N = (L, P, G) => (P[0] - L[0]) * (G[1] - L[1]) - (P[1] - L[1]) * (G[0] - L[0]), T = (L, P) => Math.abs(L[0] - P[0]) < 1e-9 && Math.abs(L[1] - P[1]) < 1e-9, k = (L, P, G, Z) => !T(L, P) && !T(L, G) && !T(L, Z) && N(P, G, L) >= -1e-12 && N(G, Z, L) >= -1e-12 && N(Z, P, L) >= -1e-12, b = [];
  let B = 0;
  for (; d.length > 3 && B++ < 10 * a; ) {
    let L = false;
    for (let P = 0; P < d.length; P++) {
      const G = d[(P + d.length - 1) % d.length], Z = d[P], ot = d[(P + 1) % d.length], nt = I[G], $ = I[Z], tt = I[ot];
      if (!(N(nt, $, tt) <= 1e-12) && !d.some((j) => j !== G && j !== Z && j !== ot && k(I[j], nt, $, tt))) {
        b.push(S < 0 ? [r[ot], r[Z], r[G]] : [r[G], r[Z], r[ot]]), d.splice(P, 1), L = true;
        break;
      }
    }
    if (!L) return [];
  }
  if (d.length === 3) {
    const [L, P, G] = d;
    b.push(S < 0 ? [r[G], r[P], r[L]] : [r[L], r[P], r[G]]);
  }
  return b;
}
function as(r, E) {
  const a = /* @__PURE__ */ new Map();
  for (const I of r) for (const S of I) for (const d of I) S !== d && (a.has(S) || a.set(S, []), a.get(S).push(d));
  const c = /* @__PURE__ */ new Set();
  for (const I of r) for (const S of I) c.add(S);
  const l = new Set([...E ?? /* @__PURE__ */ new Map()].map(([I]) => I)), A = /* @__PURE__ */ new Set();
  let u = 0, R = 0;
  for (const I of c) {
    if (A.has(I)) continue;
    const S = [I], d = [];
    for (A.add(I); S.length; ) {
      const N = S.pop();
      d.push(N);
      for (const T of a.get(N) ?? []) A.has(T) || (A.add(T), S.push(T));
    }
    d.some((N) => l.has(N)) || (u++, R += d.length);
  }
  return { nPiezasFlotantes: u, nNudosFlotantes: R };
}
export {
  os as a,
  as as b,
  Ut as c,
  Ps as p
};
