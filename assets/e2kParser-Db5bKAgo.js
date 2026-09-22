import { d as es, b as os, a as ns, c as as, t as cs, i as is } from "./cadSections-BcRFaG1j.js";
const Dt = 64, rs = (m) => m * Math.PI / 180;
function bt(m, g = Dt) {
  switch (m.tipo) {
    case "rect": {
      const { d: i, b: r } = m;
      return [[-r / 2, -i / 2], [r / 2, -i / 2], [r / 2, i / 2], [-r / 2, i / 2]];
    }
    case "circle": {
      const i = m.d / 2, r = [];
      for (let p = 0; p < g; p++) {
        const T = 2 * Math.PI * p / g;
        r.push([i * Math.cos(T), i * Math.sin(T)]);
      }
      return r;
    }
    case "angle": {
      const { d: i, b: r, tf: p, tw: T } = m;
      return [[0, 0], [r, 0], [r, p], [T, p], [T, i], [0, i]].map(([L, P]) => [L - r / 2, P - i / 2]);
    }
    case "channel": {
      const { d: i, b: r, tf: p, tw: T } = m;
      return [[0, 0], [r, 0], [r, p], [T, p], [T, i - p], [r, i - p], [r, i], [0, i]].map(([L, P]) => [L - r / 2, P - i / 2]);
    }
    case "tee": {
      const { d: i, b: r, tf: p, tw: T } = m, L = (r - T) / 2;
      return [[0, i - p], [r, i - p], [r, i], [0, i]].concat([]) && [[L, 0], [L + T, 0], [L + T, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [L, i - p]].map(([P, O]) => [P - r / 2, O - i / 2]);
    }
    case "isection": {
      const { d: i, b: r, tf: p, tw: T } = m, L = (r - T) / 2;
      return [[0, 0], [r, 0], [r, p], [L + T, p], [L + T, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [L, i - p], [L, p], [0, p]].map(([P, O]) => [P - r / 2, O - i / 2]);
    }
    case "polygon":
      return m.puntos.slice();
    default:
      return [];
  }
}
function ls(m, g = Dt) {
  if (m.tipo === "tube") {
    const { d: i, b: r, tf: p, tw: T } = m, L = i / 2 - p, P = r / 2 - T;
    return [[[-P, -L], [-P, L], [P, L], [P, -L]]];
  }
  if (m.tipo === "pipe") {
    const i = m.d / 2 - m.t, r = [];
    for (let p = g - 1; p >= 0; p--) {
      const T = 2 * Math.PI * p / g;
      r.push([i * Math.cos(T), i * Math.sin(T)]);
    }
    return [r];
  }
  return [];
}
function fs(m, g = Dt) {
  return m.tipo === "tube" ? bt({ tipo: "rect", d: m.d, b: m.b }) : m.tipo === "pipe" ? bt({ tipo: "circle", d: m.d }, g) : bt(m, g);
}
function ps(m) {
  let g = 0, i = 0, r = 0, p = 0, T = 0, L = 0;
  for (let C = 0; C < m.length; C++) {
    const [y, w] = m[C], [M, B] = m[(C + 1) % m.length], k = y * B - M * w;
    g += k, i += (y + M) * k, r += (w + B) * k, p += (w * w + w * B + B * B) * k, T += (y * y + y * M + M * M) * k, L += (y * B + 2 * y * w + 2 * M * B + M * w) * k;
  }
  if (g /= 2, Math.abs(g) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const P = i / (6 * g), O = r / (6 * g);
  return { A: g, cx: P, cy: O, Ixx: p / 12 - g * O * O, Iyy: T / 12 - g * P * P, Ixy: L / 24 - g * P * O };
}
function ds(m, g) {
  const i = rs(g.rot ?? 0), r = Math.cos(i), p = Math.sin(i), T = g.mirror ? -1 : 1, L = m.map(([P, O]) => {
    const C = P * T;
    return [C * r - O * p + (g.xc ?? 0), C * p + O * r + (g.yc ?? 0)];
  });
  return g.mirror ? L.reverse() : L;
}
function Es(m, g) {
  let i = 0, r = 0, p = 0;
  const T = [];
  for (const M of m) {
    const B = g > 0 && M.E ? M.E / g : 1;
    if (M.forma.tipo === "rebar") {
      const J = M.forma.area * B;
      T.push({ A: J, cx: M.xc ?? 0, cy: M.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), i += J, r += J * (M.xc ?? 0), p += J * (M.yc ?? 0);
      continue;
    }
    const k = [fs(M.forma), ...ls(M.forma)];
    for (const J of k) {
      if (J.length < 3) continue;
      const R = ps(ds(J, M)), F = R.A * B;
      T.push({ ...R, A: F, n: B }), i += F, r += F * R.cx, p += F * R.cy;
    }
  }
  if (Math.abs(i) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: m.length };
  const L = r / i, P = p / i;
  let O = 0, C = 0, y = 0;
  for (const M of T) O += M.Ixx * M.n + M.A * (M.cy - P) ** 2, C += M.Iyy * M.n + M.A * (M.cx - L) ** 2, y += M.Ixy * M.n + M.A * (M.cx - L) * (M.cy - P);
  const w = (O + C) * 0.1;
  return { A: i, Iz: O, Iy: C, Ixy: y, J: w, cx: L, cy: P, As2: 5 / 6 * i, As3: 5 / 6 * i, nPiezas: m.length };
}
function hs(m, g, i, r, p) {
  switch ((m || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":
      return { tipo: "rect", d: g, b: i };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":
      return { tipo: "circle", d: g };
    case "STEEL ANGLE":
    case "ANGLE":
      return { tipo: "angle", d: g, b: i, tf: r, tw: p };
    case "STEEL CHANNEL":
    case "CHANNEL":
      return { tipo: "channel", d: g, b: i, tf: r, tw: p };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":
      return { tipo: "tee", d: g, b: i, tf: r, tw: p };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":
      return { tipo: "isection", d: g, b: i, tf: r, tw: p };
    case "STEEL TUBE":
    case "TUBE":
      return { tipo: "tube", d: g, b: i, tf: r, tw: p };
    case "STEEL PIPE":
    case "PIPE":
      return { tipo: "pipe", d: g, t: r || p };
    default:
      return g > 0 && i > 0 ? { tipo: "rect", d: g, b: i } : null;
  }
}
function Is(m) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
  const g = m.split(/\r?\n/), i = { force: "TONF", length: "M" }, r = [], p = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), P = [], O = [], C = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Set(), F = [], D = [], W = /* @__PURE__ */ new Map(), j = [];
  let Q = 0;
  const et = [], ot = [];
  let tt = "", x = "";
  const ft = /* @__PURE__ */ new Map(), Xt = /(?:WEIGHTPERVOLUME|SLABTHICKNESS|WALLTHICKNESS|HEIGHT|ELEV|SPACING)\s+-?\d+,\d/.test(m), qt = (n) => n.split(/("[^"]*")/).map((s, t) => t % 2 ? s : s.replace(/(^|[\s=])(-?\d+),(\d+)(?=[\s]|$)/g, "$1$2.$3")).join("");
  for (const n of g) {
    const s = Xt ? qt(n.trim()) : n.trim();
    if (!s || s.startsWith("$")) {
      s.startsWith("$ ") && (x = s.substring(2).trim().replace(/^AREA OBJECT CONNECTIVITIES$/, "AREA CONNECTIVITIES").replace(/^AREA OBJECT LOADS$/, "SHELL OBJECT LOADS"));
      continue;
    }
    if (x && (ft.has(x) || ft.set(x, []), ft.get(x).push(n)), x === "CONTROLS") {
      const t = s.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      t && (i.force = t[1], i.length = t[2]);
      const o = s.match(/TITLE2\s+"([^"]+)"/);
      o && (tt = o[1]);
    }
    if (x === "STORIES - IN SEQUENCE FROM TOP") {
      const t = s.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (t) {
        const o = t[1], e = t[2] ? parseFloat(t[2]) : 0, a = t[3] ? parseFloat(t[3]) : void 0;
        r.push({ name: o, height: e, elev: a ?? 0 });
      }
    }
    if (x === "MATERIAL PROPERTIES") {
      const t = s.match(/MATERIAL\s+"([^"]+)"\s+(?:TYPE\s+"([^"]+)")?/);
      if (t) {
        const o = t[1];
        p.has(o) || p.set(o, { type: t[2] || "", E: 0, G: 0, nu: 0 });
        const e = p.get(o);
        t[2] && (e.type = t[2]);
        const a = s.match(/\bE\s+([\d.eE+-]+)/);
        a && (e.E = parseFloat(a[1]));
        const c = s.match(/\bU\s+([\d.eE+-]+)/);
        c && (e.nu = parseFloat(c[1]), e.G = e.E / (2 * (1 + e.nu)));
        const l = s.match(/\bFY\s+([\d.eE+-]+)/);
        l && (e.fy = parseFloat(l[1]));
        const f = s.match(/\bFC\s+([\d.eE+-]+)/);
        f && (e.fc = parseFloat(f[1]));
        const d = s.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        d && (e.density = parseFloat(d[1]));
      }
    }
    if (x === "FRAME SECTIONS") {
      const t = s.match(/FRAMESECTION\s+"([^"]+)"/);
      if (t) {
        const o = t[1];
        T.has(o) || T.set(o, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const e = T.get(o), a = s.match(/MATERIAL\s+"([^"]+)"/);
        a && (e.material = a[1]);
        const c = s.match(/SHAPE\s+"([^"]+)"/);
        c && (e.shape = c[1]);
        const l = s.match(/\bD\s+([\d.eE+-]+)/);
        l && (e.D = parseFloat(l[1]));
        const f = s.match(/\bB\s+([\d.eE+-]+)/);
        f && (e.B = parseFloat(f[1]));
        const d = s.match(/\bTF\s+([\d.eE+-]+)/);
        d && (e.TF = parseFloat(d[1]));
        const S = s.match(/\bTW\s+([\d.eE+-]+)/);
        S && (e.TW = parseFloat(S[1]));
        const u = s.match(/\bR\s+([\d.eE+-]+)/);
        u && (e.R = parseFloat(u[1]));
        const E = s.match(/FILLMATERIAL\s+"([^"]+)"/);
        E && (e.fillMaterial = E[1]);
        const I = s.match(/I2MOD\s+([\d.eE+-]+)/);
        I && (e.modI2 = parseFloat(I[1]));
        const N = s.match(/I3MOD\s+([\d.eE+-]+)/);
        N && (e.modI3 = parseFloat(N[1]));
        for (const [H, h] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const q = s.match(h);
          q && (e[H] = parseFloat(q[1]));
        }
        const b = s.match(/\bT\s+([\d.eE+-]+)/);
        b && !e.TF && !e.TW && (e.TF = parseFloat(b[1]), e.TW = parseFloat(b[1]));
        const $ = s.match(/\bLIP\s+([\d.eE+-]+)/);
        $ && (e.LIP = parseFloat($[1]));
        const G = s.match(/\bDIS\s+([\d.eE+-]+)/);
        G && (e.DIS = parseFloat(G[1]));
      }
    }
    if (x === "POINT COORDINATES") {
      const t = s.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      t && L.set(t[1], [parseFloat(t[2]), parseFloat(t[3]), parseFloat(t[4] ?? "0") || 0]);
    }
    if (x === "LINE CONNECTIVITIES") {
      const t = s.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      t && P.push({ name: t[1], type: t[2], pt1: t[3], pt2: t[4], nStories: parseInt(t[5]) });
    }
    if (x === "POINT ASSIGNS") {
      const t = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      t && M.set(`${t[1]}@${t[2]}`, t[3].split(/\s+/));
      const o = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      o && R.add(`${o[1]}@${o[2]}`);
      const e = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      e && J.set(`${e[1]}@${e[2]}`, e[3]);
    }
    {
      const t = s.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (t) {
        const o = t[1] === "POINTSPRING" ? "point" : t[1] === "LINESPRING" ? "line" : "area", e = ((_a = k.get(t[2])) == null ? void 0 : _a.k) ?? [0, 0, 0, 0, 0, 0], a = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2, RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const c of s.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const l = a[c[1]];
          l !== void 0 && (e[l] = parseFloat(c[2]));
        }
        k.set(t[2], { tipo: o, k: e });
      }
    }
    if (x === "LINE ASSIGNS") {
      const t = s.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
      if (t) {
        const o = { story: t[2], section: t[3], rigidZone: 0, releases: [], angle: 0 }, e = s.match(/RIGIDZONE\s+([\d.eE+-]+)/);
        e && (o.rigidZone = parseFloat(e[1]));
        const a = s.match(/LENGTHOFFI\s+([\d.eE+-]+)/), c = s.match(/LENGTHOFFJ\s+([\d.eE+-]+)/);
        (a || c) && (o.offsets = [a ? parseFloat(a[1]) : 0, c ? parseFloat(c[1]) : 0]);
        const l = s.match(/RELEASE\s+"([^"]+)"/);
        l && (o.releases = l[1].split(/\s+/));
        const f = s.match(/ANG\s+([-\d.eE+]+)/);
        f && (o.angle = parseFloat(f[1]));
        const d = s.match(/SPRINGPROP\s+"([^"]+)"/);
        d && (o.spring = d[1]), o.mallaEnCruces = /MESHATINTERSECTIONS\s+"?YES/i.test(s), B.set(`${t[1]}@${t[2]}`, o);
      }
    }
    if (x === "GRIDS") {
      const t = s.match(/^\s*GRID\s+"[^"]+"\s+LABEL\s+"([^"]+)"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)/);
      t && et.push({ label: t[1], dir: t[2], coord: parseFloat(t[3]) });
      const o = s.match(/^\s*REFERENCEPLANE\s.*\sZ\s+([-\d.eE+]+)/);
      o && ot.push({ z: parseFloat(o[1]) });
    }
    if (x === "FRAME OBJECT LOADS") {
      const t = s.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      t && F.push({ line: t[1], story: t[2], type: t[3], dir: t[4], lc: t[5], val: parseFloat(t[6]) });
    }
    {
      const t = s.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      t && (W.has(t[1]) || W.set(t[1], []), W.get(t[1]).push({ lc: t[2], val: parseFloat(t[3]) }));
    }
    if (x === "LOAD PATTERNS") {
      const t = s.match(/LOADPATTERN\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+SELFWEIGHT\s+([\d.eE+-]+)/);
      t && /dead/i.test(t[2]) && (Q = Math.max(Q, parseFloat(t[3])));
    }
    if (x === "POINT OBJECT LOADS") {
      const t = s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"\s+LC\s+"([^"]+)"(.*)$/) ?? s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"(.*)$/);
      if (t) {
        const o = (e) => {
          const a = t[4].match(new RegExp(`\\b${e}\\s+([-\\d.eE+]+)`));
          return a ? parseFloat(a[1]) : 0;
        };
        j.push({ pt: t[1], story: t[2], lc: t[3], v: ["FX", "FY", "FZ", "MX", "MY", "MZ"].map(o) });
      }
    }
    if (x === "SHELL OBJECT LOADS") {
      const t = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (t) D.push({ area: t[1], story: t[2], tipo: "UNIFF", dir: t[3], lc: t[4], val: parseFloat(t[5]) });
      else {
        const o = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        o && D.push({ area: o[1], story: o[2], tipo: "UNIFLOADSET", dir: "GRAV", lc: "", val: 0, set: o[3] });
      }
    }
    if (x === "AREA CONNECTIVITIES") {
      const t = s.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (t) {
        const o = ((_b = t[3].match(/"([^"]+)"/g)) == null ? void 0 : _b.map((a) => a.replace(/"/g, ""))) || [], e = t[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/).filter(Boolean).map(Number).filter((a) => Number.isFinite(a));
        O.push({ name: t[1], tipo: t[2] || "FLOOR", pts: o, dz: e.length === o.length ? e : o.map(() => 0) });
      }
    }
    if (s.startsWith("SDSECTION")) {
      const t = (_c = s.match(/SDSECTION\s+"([^"]+)"/)) == null ? void 0 : _c[1], o = (_d = s.match(/SHAPETYPE\s+"([^"]+)"/)) == null ? void 0 : _d[1];
      if (t && o) {
        const e = (a) => {
          const c = s.match(a);
          return c ? parseFloat(c[1]) : 0;
        };
        w.has(t) || w.set(t, []), w.get(t).push({ shapeType: o, material: ((_e = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _e[1]) ?? "", D: e(/\bD\s+([\d.eE+-]+)/), B: e(/\bB\s+([\d.eE+-]+)/), TF: e(/\bTF\s+([\d.eE+-]+)/), TW: e(/\bTW\s+([\d.eE+-]+)/), XC: e(/\bXC\s+(-?[\d.eE+-]+)/), YC: e(/\bYC\s+(-?[\d.eE+-]+)/) });
      }
    }
    if (x === "AREA ASSIGNS") {
      const t = s.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/);
      t && (C.get(t[1]) ?? C.set(t[1], []).get(t[1])).push({ story: t[2], section: t[3], spring: (_f = s.match(/SPRINGPROP\s+"([^"]+)"/)) == null ? void 0 : _f[1] });
    }
    if (s.startsWith("SHELLPROP")) {
      const t = (_g = s.match(/SHELLPROP\s+"([^"]+)"/)) == null ? void 0 : _g[1];
      if (t) {
        const o = (E) => {
          const I = s.match(E);
          return I ? parseFloat(I[1]) : void 0;
        }, e = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? o(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? o(/DECKSLABDEPTH\s+([\d.eE+-]+)/), c = /PROPTYPE\s+"Deck"/.test(s) ? { tc: o(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: o(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: o(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: o(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: o(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: o(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, l = (_h = s.match(/SLABTYPE\s+"([^"]+)"/)) == null ? void 0 : _h[1];
        let f;
        if (l === "Ribbed" || l === "Waffle") {
          const E = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? 0, I = o(/OVERALLDEPTH\s+([\d.eE+-]+)/) ?? 0, N = ((o(/SLABRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0) + (o(/SLABRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0)) / 2, b = o(/SLABRIBSPACING1?\s+([\d.eE+-]+)/) ?? 0, $ = o(/SLABRIBSPACING2\s+([\d.eE+-]+)/) ?? b, G = l === "Ribbed" ? b > 0 ? N / b : 0 : b > 0 && $ > 0 ? N / b + N / $ - N * N / (b * $) : 0;
          E > 0 && I > E && (f = (E + (I - E) * G) / E);
        }
        const S = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((E) => o(new RegExp(E + "\\s+([\\d.eE+-]+)"))), u = y.get(t);
        if (S.some((E) => E !== void 0)) {
          const E = S.map((I) => I ?? 1);
          y.set(t, { t: (u == null ? void 0 : u.t) ?? 0, material: (u == null ? void 0 : u.material) ?? "", modeling: (u == null ? void 0 : u.modeling) ?? "ShellThin", mods: E, deck: u == null ? void 0 : u.deck, pesoFactor: u == null ? void 0 : u.pesoFactor });
        } else e !== void 0 && y.set(t, { t: e, mods: u == null ? void 0 : u.mods, deck: c ?? (u == null ? void 0 : u.deck), pesoFactor: f ?? (u == null ? void 0 : u.pesoFactor), material: ((_i = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _i[1]) ?? ((_j = s.match(/CONCMATERIAL\s+"([^"]+)"/)) == null ? void 0 : _j[1]) ?? "", modeling: ((_k = s.match(/MODELINGTYPE\s+"([^"]+)"/)) == null ? void 0 : _k[1]) ?? (/PROPTYPE\s+"Deck"/.test(s) ? "Membrane" : "ShellThin") });
      }
    }
  }
  const pt = /* @__PURE__ */ new Map();
  if (r.length > 0) {
    const n = r.length - 1;
    pt.set(r[n].name, r[n].elev);
    for (let s = n - 1; s >= 0; s--) {
      const o = pt.get(r[s + 1].name) + r[s].height;
      r[s].elev = o, pt.set(r[s].name, o);
    }
  }
  const z = [], wt = [], nt = /* @__PURE__ */ new Map(), Z = (n, s) => `${n}@${s}`, _ = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Map();
  for (const n of P) jt.set(n.name, n);
  for (const n of P) for (const [s, t] of B) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((a) => a.name === o);
    if (!(e < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      _.add(Z(n.pt2, o));
      const a = Math.min(e + n.nStories, r.length - 1);
      _.add(Z(n.pt1, r[a].name));
      for (let c = e + 1; c < a; c++) _.add(Z(n.pt1, r[c].name));
    } else _.add(Z(n.pt1, o)), _.add(Z(n.pt2, o));
  }
  for (const [n] of M) _.add(n);
  for (const n of R) _.add(n);
  const vt = (n, s) => {
    const t = r.findIndex((e) => e.name === n);
    if (t < 0) return;
    const o = t + (s || 0);
    if (!(o < 0 || o > r.length - 1)) return r[o].name;
  };
  for (const n of O) for (const s of C.get(n.name) ?? []) n.pts.forEach((t, o) => {
    const e = vt(s.story, n.dz[o] ?? 0);
    e && _.add(Z(t, e));
  });
  const St = /* @__PURE__ */ new Map();
  for (const n of _) {
    const [s, t] = n.split("@"), o = L.get(s), e = pt.get(t);
    if (o === void 0 || e === void 0) continue;
    z.push([o[0], o[1], e - (o[2] ?? 0)]), wt.push(n), nt.set(n, z.length - 1);
    const a = J.get(n);
    a && St.set(z.length - 1, a);
  }
  const K = [], st = [], Tt = [], it = [], dt = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
  for (const n of P) for (const [s, t] of B) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((f) => f.name === o);
    if (e < 0) continue;
    const a = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const f = Math.min(e + n.nStories, r.length - 1);
      for (let d = f; d > e; d--) a.push(Z(n.pt1, r[d].name));
      a.push(Z(n.pt2, o));
    } else a.push(Z(n.pt1, o), Z(n.pt2, o));
    const c = a.map((f) => nt.get(f)).filter((f) => f !== void 0);
    if (c.length < 2) continue;
    const l = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let f = 0; f < c.length - 1; f++) {
      const d = c[f], S = c[f + 1];
      if (d === S) continue;
      const u = K.length;
      if (K.push([d, S]), st.push(c.length > 2 ? `${n.name}-${f + 1}` : n.name), Tt.push(n.type), it.push(o), dt.set(u, t.section), t.spring && Mt.set(u, t.spring), t.mallaEnCruces && xt.set(u, true), t.rigidZone > 0 && Et.set(u, [t.rigidZone, t.rigidZone]), t.angle && Gt.set(u, t.angle), t.offsets && rt.set(u, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const E = new Array(12).fill(false);
        for (const I of t.releases) {
          const N = l[I];
          N !== void 0 && (N < 6 && f !== 0 || N >= 6 && f !== c.length - 2 || (E[N] = true));
        }
        E.some(Boolean) && kt.set(u, E);
      }
    }
  }
  const ht = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Ot = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  let Bt = 0;
  for (const [n, s] of dt) {
    const t = T.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    o && (ht.set(n, o.E), mt.set(n, o.G));
    const e = t.D, a = t.B, c = t.TF, l = t.TW;
    let f = 0, d = 0, S = 0, u = 0, E = 0, I = 0, N = "rect", b = 0, $ = false, G = false;
    const H = w.get(s);
    if (t.shape === "SD Section" && (H == null ? void 0 : H.length)) {
      const h = (o == null ? void 0 : o.E) || ((_l = p.get(t.material)) == null ? void 0 : _l.E) || 0, q = [];
      for (const v of H) {
        const lt = hs(v.shapeType, v.D, v.B, v.TF, v.TW);
        lt && q.push({ forma: lt, xc: v.XC, yc: v.YC, E: ((_m = p.get(v.material)) == null ? void 0 : _m.E) || h });
      }
      if (q.length) {
        const v = Es(q, h);
        v.A > 0 && (f = v.A, d = v.Iz, S = v.Iy, u = v.J, E = v.As2, I = v.As3, N = "rect", G = true, Bt++);
      }
    }
    if (!G) switch (t.shape) {
      case "Concrete Rectangular":
        f = e * a, d = a * e ** 3 / 12, S = e * a ** 3 / 12, u = a * e ** 3 * (1 / 3 - 0.21 * (e / a) * (1 - e ** 4 / (12 * a ** 4))), E = I = 5 / 6 * f, N = "rect";
        break;
      case "Concrete Circle":
        f = Math.PI * e ** 2 / 4, d = S = Math.PI * e ** 4 / 64, u = Math.PI * e ** 4 / 32, E = I = 0.9 * f, N = "circ";
        break;
      case "Steel I/Wide Flange": {
        const h = is(e, a, c, l);
        f = h.A, d = h.Iz, S = h.Iy, u = h.J, I = h.As2, E = h.As3, N = "I";
        break;
      }
      case "Steel Tube": {
        const h = cs(a, e, c || l, l || c);
        f = h.A, d = h.Iz, S = h.Iy, u = h.J, I = h.As2, E = h.As3, N = "HSS";
        break;
      }
      case "Filled Steel Pipe": {
        const h = (o == null ? void 0 : o.E) || 0, q = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (q == null ? void 0 : q.E) || h * 0.125, lt = t.T || l || c, V = ns(e, lt, h || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (q == null ? void 0 : q.nu) ?? 0.2);
        f = V.A, d = V.Iz, S = V.Iy, u = V.J, I = V.As2, E = V.As3, b = v, $ = true, N = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const h = (o == null ? void 0 : o.E) || 0, q = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (q == null ? void 0 : q.E) || h * 0.125, V = os(a, e, l || c, h || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (q == null ? void 0 : q.nu) ?? 0.2);
        f = V.A, d = V.Iz, S = V.Iy, u = V.J, I = V.As2, E = V.As3, b = v, N = "CFT";
        break;
      }
      case "Steel Angle": {
        const h = c || l;
        f = h * (e + a - h), d = h * (e ** 3 + a * h ** 2 + h ** 2 * (e - h)) / 12, S = h * (a ** 3 + e * h ** 2 + h ** 2 * (a - h)) / 12, u = (e + a - h) * h ** 3 / 3, E = e * h, I = a * h, N = "L";
        break;
      }
      case "Steel Channel": {
        const h = as(e, a, c, l);
        f = h.A, d = h.Iz, S = h.Iy, u = h.J, I = h.As2, E = h.As3, N = "C";
        break;
      }
      case "Steel Double Angle": {
        const h = es(e, a, c, l, t.DIS || 0);
        f = h.A, d = h.Iz, S = h.Iy, u = h.J, I = h.As2, E = h.As3, N = "2L";
        break;
      }
      case "Cold Formed C":
        f = 2 * a * c + (e - 2 * c) * l, d = (l * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, S = (2 * c * a ** 3 + (e - 2 * c) * l ** 3) / 12, u = (2 * a * c ** 3 + (e - 2 * c) * l ** 3) / 3, E = (e - 2 * c) * l, I = 2 * a * c * 5 / 6, N = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        f = 2 * (2 * a * c + (e - 2 * c) * l), d = 2 * (l * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, S = 2 * (2 * c * a ** 3 + (e - 2 * c) * l ** 3) / 12, u = 2 * (2 * a * c ** 3 + (e - 2 * c) * l ** 3) / 3, E = 2 * (e - 2 * c) * l, I = 4 * a * c * 5 / 6, N = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          f = t.AREA, d = t.I33 ?? 0, S = t.I22 ?? 0, u = t.TORSION ?? 0, I = t.AS2 ?? 0, E = t.AS3 ?? 0, N = "general";
          break;
        }
      default:
        e > 0 && a > 0 && (f = e * a, d = a * e ** 3 / 12, S = e * a ** 3 / 12, u = Math.min(e, a) * Math.max(e, a) ** 3 / 3 * 0.3, E = I = 5 / 6 * f);
        break;
    }
    t.modI2 && (S *= t.modI2), t.modI3 && (d *= t.modI3), ut.set(n, f), Ot.set(n, d), Lt.set(n, S), yt.set(n, u), E > 0 && Nt.set(n, E), I > 0 && Rt.set(n, I), It.set(n, { type: N, ...b > 0 ? { fillE: b } : {}, b: $ ? void 0 : a || void 0, h: $ ? void 0 : e || void 0, d: N === "circ" || N === "pipe" || $ ? e : void 0, tw: l || void 0, tf: c || void 0, r: t.R, name: s });
  }
  const At = /* @__PURE__ */ new Map();
  for (const [n, s] of M) {
    const t = nt.get(n);
    if (t === void 0) continue;
    const o = [false, false, false, false, false, false];
    for (const e of s) e === "UX" && (o[0] = true), e === "UY" && (o[1] = true), e === "UZ" && (o[2] = true), e === "RX" && (o[3] = true), e === "RY" && (o[4] = true), e === "RZ" && (o[5] = true);
    At.set(t, o);
  }
  const X = /* @__PURE__ */ new Map(), $t = /* @__PURE__ */ new Map();
  for (let n = 0; n < st.length; n++) $t.set(`${st[n]}@${it[n]}`, n);
  for (const n of F) {
    const s = $t.get(`${n.line}@${n.story}`);
    if (s === void 0) continue;
    const [t, o] = K[s], e = z[t], a = z[o], c = Math.sqrt((a[0] - e[0]) ** 2 + (a[1] - e[1]) ** 2 + (a[2] - e[2]) ** 2);
    if (c < 1e-10) continue;
    const l = [0, 0, 0];
    n.dir === "GRAV" || n.dir === "GRAVITY" ? l[2] = -n.val : n.dir === "X" ? l[0] = n.val : n.dir === "Y" ? l[1] = n.val : n.dir === "Z" && (l[2] = n.val);
    const f = [(a[0] - e[0]) / c, (a[1] - e[1]) / c, (a[2] - e[2]) / c], d = c * c / 12, S = [f[1] * l[2] - f[2] * l[1], f[2] * l[0] - f[0] * l[2], f[0] * l[1] - f[1] * l[0]], u = (E, I) => {
      const N = X.get(E) || [0, 0, 0, 0, 0, 0];
      for (let b = 0; b < 6; b++) N[b] += I[b];
      X.set(E, N);
    };
    u(t, [l[0] * c / 2, l[1] * c / 2, l[2] * c / 2, d * S[0], d * S[1], d * S[2]]), u(o, [l[0] * c / 2, l[1] * c / 2, l[2] * c / 2, -d * S[0], -d * S[1], -d * S[2]]);
  }
  const at = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map();
  for (const [n, s] of dt) {
    const t = T.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    (o == null ? void 0 : o.density) && at.set(n, o.density);
  }
  const gt = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), Ft = [], U = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of O) {
    ((_n = C.get(n.name)) == null ? void 0 : _n.length) || U.sinAssign++;
    for (const s of C.get(n.name) ?? []) {
      const t = n.pts.map((c, l) => {
        const f = vt(s.story, n.dz[l] ?? 0);
        return f === void 0 ? void 0 : nt.get(Z(c, f));
      });
      if (t.some((c) => c === void 0)) {
        U.sinNudo++;
        continue;
      }
      const e = t.filter((c, l, f) => f.indexOf(c) === l);
      if (e.length < 3) {
        U.colapsada++;
        continue;
      }
      const a = e.length <= 4 ? [e.length === 3 ? e : t.slice(0, 4)] : ms(e, z);
      if (!a.length) {
        U.poligono++;
        continue;
      }
      for (const c of a) {
        const l = K.length;
        K.push(c), st.push(n.name), Tt.push(n.tipo), it.push(s.story), Ft.push(n.name), s.spring && Mt.set(l, s.spring);
        const f = y.get(s.section);
        if (f) {
          gt.set(l, f.t);
          const d = p.get(f.material);
          if ((d == null ? void 0 : d.E) && ht.set(l, d.E), (d == null ? void 0 : d.G) && mt.set(l, d.G), (d == null ? void 0 : d.nu) !== void 0 && Ut.set(l, d.nu), (d == null ? void 0 : d.density) && at.set(l, d.density * (f.pesoFactor ?? 1)), f.deck && f.deck.tc > 0) {
            const E = f.deck, I = E.tc + (E.sr > 0 ? E.hr * (E.wrt + E.wrb) / 2 / E.sr : 0);
            at.set(l, (((d == null ? void 0 : d.density) ?? 0) * I + E.w) / E.tc), Ct.set(l, { ...E });
          }
          const S = /membrane/i.test(f.modeling);
          Ht.set(l, /thick/i.test(f.modeling) || S ? 0 : 1);
          const u = f.mods ? f.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
          S && (u[3] = 0, u[4] = 0, u[5] = 0, u[6] = 0, u[7] = 0), (f.mods || S) && Yt.set(l, u);
        }
      }
    }
  }
  const ct = /* @__PURE__ */ new Map();
  for (let n = 0; n < st.length; n++) if (K[n].length > 2) {
    const s = `${st[n]}@${it[n]}`;
    ct.has(s) || ct.set(s, []), ct.get(s).push(n);
  }
  let Pt = 0;
  for (const n of j) {
    const s = nt.get(Z(n.pt, n.story));
    if (s === void 0) {
      Pt++;
      continue;
    }
    const t = X.get(s) || [0, 0, 0, 0, 0, 0];
    for (let o = 0; o < 6; o++) t[o] += n.v[o];
    X.set(s, t);
  }
  j.length && console.log(`[e2kParser] cargas puntuales: ${j.length - Pt} aplicadas \xB7 ${Pt} sin nudo (punto@planta que no existe)`);
  let Wt = 0, zt = 0, Vt = 0, Jt = 0;
  for (const n of D) {
    const s = ct.get(`${n.area}@${n.story}`) ?? ct.get(`${n.area}@`), t = s !== void 0 ? s : (_o = [...ct].find(([e]) => e.startsWith(n.area + "@"))) == null ? void 0 : _o[1];
    if (t === void 0) {
      zt++;
      continue;
    }
    let o = false;
    for (const e of t) {
      const a = K[e], c = a.map((G) => z[G]).filter(Boolean);
      if (c.length < 3) continue;
      let l = 0, f = 0, d = 0;
      for (let G = 0; G < c.length; G++) {
        const H = c[G], h = c[(G + 1) % c.length];
        l += H[1] * h[2] - H[2] * h[1], f += H[2] * h[0] - H[0] * h[2], d += H[0] * h[1] - H[1] * h[0];
      }
      const S = Math.hypot(l, f, d) / 2;
      if (!(S > 0)) continue;
      const u = n.tipo === "UNIFLOADSET" ? W.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
      let E = 0;
      for (const G of u) E += G.val;
      if (!E) {
        o || Vt++, o = true;
        break;
      }
      o || Jt++, o = true;
      const I = E * S / c.length;
      Wt += E * S;
      let N = 0, b = 0, $ = 0;
      n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? $ = -I : n.dir === "X" ? N = I : n.dir === "Y" && (b = I);
      for (const G of a) {
        const H = X.get(G) || [0, 0, 0, 0, 0, 0];
        H[0] += N, H[1] += b, H[2] += $, X.set(G, H);
      }
    }
  }
  D.length && console.info(`[e2kParser] cargas de losa: ${Jt} aplicadas \xB7 ${zt} sin area que las lleve \xB7 ${Vt} sin valor \xB7 total ${Wt.toFixed(0)} (unidades del fichero) \xB7 ${W.size} juegos con nombre`);
  const Zt = U.sinAssign + U.sinNudo + U.colapsada + U.poligono;
  if (Zt) {
    const n = [U.poligono && `${U.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, U.sinAssign && `${U.sinAssign} sin AREAASSIGN`, U.sinNudo && `${U.sinNudo} con algun nudo que no resuelve a planta`, U.colapsada && `${U.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${Zt} de ${O.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const Qt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, _t = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, A = Qt[(i.length || "M").toUpperCase()] ?? 1, Y = _t[(i.force || "KN").toUpperCase()] ?? 1;
  if (A !== 1 || Y !== 1) {
    const n = (s, t) => {
      if (s) for (const [o, e] of s) s.set(o, e * t);
    };
    for (const s of z) s[0] *= A, s[1] *= A, s[2] *= A;
    for (const s of r) s.height *= A, s.elev *= A;
    for (const s of et) s.coord *= A;
    for (const s of ot) s.z *= A;
    n(gt, A), n(ut, A * A);
    for (const s of k.values()) {
      const t = s.tipo === "point" ? Y / A : s.tipo === "line" ? Y / (A * A) : Y / (A * A * A);
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? t : s.tipo === "point" ? Y * A : Y;
    }
    n(Nt, A * A), n(Rt, A * A), n(Lt, A ** 4), n(Ot, A ** 4), n(yt, A ** 4), n(ht, Y / (A * A)), n(mt, Y / (A * A)), n(at, Y / A ** 3);
    for (const s of Ct.values()) s.tc *= A, s.hr *= A, s.wrt *= A, s.wrb *= A, s.sr *= A, s.w *= Y / (A * A);
    for (const [s, t] of Et) Et.set(s, [t[0] * A, t[1] * A]);
    for (const [s, t] of rt) rt.set(s, [t[0] * A, t[1] * A, t[2]]);
    for (const [s, t] of X) X.set(s, t.map((o, e) => o * (e < 3 ? Y : Y * A)));
    for (const [, s] of k) {
      const t = s.tipo === "point" ? 1 : s.tipo === "line" ? 2 : 3;
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? Y / A ** t : Y * A / A ** (t - 1);
    }
    for (const [, s] of It) {
      for (const t of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const o = s;
        typeof o[t] == "number" && (o[t] *= A);
      }
      typeof s.fillE == "number" && (s.fillE *= Y / (A * A));
    }
  }
  {
    const n = Kt(K, At);
    n.nPiezasFlotantes && console.warn(`[e2kParser] ${n.nPiezasFlotantes} trozos (${n.nNudosFlotantes} nudos) no llegan a ningun apoyo: la matriz sale SINGULAR y el modelo no resuelve. En ETABS los sujetan links, muelles de pilote o diafragmas, que este lector aun no importa.`);
  }
  const ts = () => {
    if (!(Q > 0)) return X;
    let n = 0;
    const s = (t, o) => {
      const e = X.get(t) || [0, 0, 0, 0, 0, 0];
      e[2] += o, X.set(t, e), n += o;
    };
    return K.forEach((t, o) => {
      const e = at.get(o);
      if (!e) return;
      const a = t;
      if (a.length === 2) {
        const c = ut.get(o) ?? 0, l = z[a[0]], f = z[a[1]], d = rt.get(o), S = f[0] - l[0], u = f[1] - l[1], E = f[2] - l[2], I = Math.hypot(S, u), N = I > 1e-9 && Math.atan2(Math.abs(E), I) * 180 / Math.PI < 20, b = Math.max(0, Math.hypot(S, u, E) - (d && N ? d[0] + d[1] : 0)), $ = e * c * b * Q;
        s(a[0], -$ / 2), s(a[1], -$ / 2);
      } else if (a.length >= 3) {
        const c = gt.get(o) ?? 0, l = a.map((I) => z[I]);
        let f = 0, d = 0, S = 0;
        for (let I = 0; I < l.length; I++) {
          const N = l[I], b = l[(I + 1) % l.length];
          f += N[1] * b[2] - N[2] * b[1], d += N[2] * b[0] - N[0] * b[2], S += N[0] * b[1] - N[1] * b[0];
        }
        const u = Math.hypot(f, d, S) / 2, E = e * c * u * Q;
        for (const I of a) s(I, -E / a.length);
      }
    }), console.log(`[e2kParser] peso propio (SELFWEIGHT ${Q}): ${n.toFixed(3)} kN repartidos a los nudos`), X;
  }, ss = () => {
    const n = [];
    for (const [s, t] of St) {
      const o = k.get(t);
      !o || o.tipo !== "point" || o.k.forEach((e, a) => {
        e > 0 && n.push({ node: s, dof: a, k: e });
      });
    }
    return n.length ? n : void 0;
  };
  return { units: i, stories: r.reverse(), materials: p, frameSections: T, nodes: z, nodeNames: wt, nodeNameToIdx: nt, elements: K, elementNames: st, elementTypes: Tt, elementStories: it, elementSections: dt, nodeInputs: { supports: At, loads: ts(), springNames: St, springs: ss() }, elementInputs: { elasticities: ht, shearModuli: mt, areas: ut, momentsOfInertiaZ: Ot, momentsOfInertiaY: Lt, torsionalConstants: yt, shearAreasY: Nt, shearAreasZ: Rt, rigidOffsets: Et, momentReleases: kt, localAngles: Gt, endOffsets: rt, densities: new Map([...at].map(([n, s]) => [n, s / 9.80665])), deckSections: Ct, sectionShapes: It, thicknesses: gt, poissonsRatios: Ut, plateFormulations: Ht, shellModifiers: Yt, springNames: Mt, mallaEnCruces: xt }, sectionShapes: It, grids: et, planosRef: ot, springProps: k, info: { ...Kt(K, At), nNodes: z.length, nFrames: K.length - Ft.length, nAreas: O.length, nAreasMontadas: Ft.length, nSDCompuestas: Bt, nSDLeidas: w.size, title: tt }, rawSections: ft };
}
function ms(m, g) {
  const i = m.length;
  if (i < 3) return [];
  const r = [0, 0, 0];
  for (let R = 0; R < i; R++) {
    const F = g[m[R]], D = g[m[(R + 1) % i]];
    r[0] += (F[1] - D[1]) * (F[2] + D[2]), r[1] += (F[2] - D[2]) * (F[0] + D[0]), r[2] += (F[0] - D[0]) * (F[1] + D[1]);
  }
  const p = [Math.abs(r[0]), Math.abs(r[1]), Math.abs(r[2])], T = p[2] >= p[0] && p[2] >= p[1] ? 2 : p[1] >= p[0] ? 1 : 0, [L, P] = T === 2 ? [0, 1] : T === 1 ? [2, 0] : [1, 2], O = m.map((R) => [g[R][L], g[R][P]]);
  let C = 0;
  for (let R = 0; R < i; R++) C += O[R][0] * O[(R + 1) % i][1] - O[(R + 1) % i][0] * O[R][1];
  if (Math.abs(C) < 1e-12) return [];
  const y = [...Array(i).keys()];
  C < 0 && y.reverse();
  const w = (R, F, D) => (F[0] - R[0]) * (D[1] - R[1]) - (F[1] - R[1]) * (D[0] - R[0]), M = (R, F) => Math.abs(R[0] - F[0]) < 1e-9 && Math.abs(R[1] - F[1]) < 1e-9, B = (R, F, D, W) => !M(R, F) && !M(R, D) && !M(R, W) && w(F, D, R) >= -1e-12 && w(D, W, R) >= -1e-12 && w(W, F, R) >= -1e-12, k = [];
  let J = 0;
  for (; y.length > 3 && J++ < 10 * i; ) {
    let R = false;
    for (let F = 0; F < y.length; F++) {
      const D = y[(F + y.length - 1) % y.length], W = y[F], j = y[(F + 1) % y.length], Q = O[D], et = O[W], ot = O[j];
      if (!(w(Q, et, ot) <= 1e-12) && !y.some((tt) => tt !== D && tt !== W && tt !== j && B(O[tt], Q, et, ot))) {
        k.push(C < 0 ? [m[j], m[W], m[D]] : [m[D], m[W], m[j]]), y.splice(F, 1), R = true;
        break;
      }
    }
    if (!R) return [];
  }
  if (y.length === 3) {
    const [R, F, D] = y;
    k.push(C < 0 ? [m[D], m[F], m[R]] : [m[R], m[F], m[D]]);
  }
  return k;
}
function Kt(m, g) {
  const i = /* @__PURE__ */ new Map();
  for (const O of m) for (const C of O) for (const y of O) C !== y && (i.has(C) || i.set(C, []), i.get(C).push(y));
  const r = /* @__PURE__ */ new Set();
  for (const O of m) for (const C of O) r.add(C);
  const p = new Set([...g ?? /* @__PURE__ */ new Map()].map(([O]) => O)), T = /* @__PURE__ */ new Set();
  let L = 0, P = 0;
  for (const O of r) {
    if (T.has(O)) continue;
    const C = [O], y = [];
    for (T.add(O); C.length; ) {
      const w = C.pop();
      y.push(w);
      for (const M of i.get(w) ?? []) T.has(M) || (T.add(M), C.push(M));
    }
    y.some((w) => p.has(w)) || (L++, P += y.length);
  }
  return { nPiezasFlotantes: L, nNudosFlotantes: P };
}
export {
  Kt as a,
  Is as p
};
