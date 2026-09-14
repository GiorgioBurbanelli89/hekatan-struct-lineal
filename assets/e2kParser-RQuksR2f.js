import { a as es, c as os } from "./cadSections-DVtTZU6U.js";
const bt = 64, ns = (E) => E * Math.PI / 180;
function wt(E, u = bt) {
  switch (E.tipo) {
    case "rect": {
      const { d: r, b: l } = E;
      return [[-l / 2, -r / 2], [l / 2, -r / 2], [l / 2, r / 2], [-l / 2, r / 2]];
    }
    case "circle": {
      const r = E.d / 2, l = [];
      for (let p = 0; p < u; p++) {
        const g = 2 * Math.PI * p / u;
        l.push([r * Math.cos(g), r * Math.sin(g)]);
      }
      return l;
    }
    case "angle": {
      const { d: r, b: l, tf: p, tw: g } = E;
      return [[0, 0], [l, 0], [l, p], [g, p], [g, r], [0, r]].map(([O, C]) => [O - l / 2, C - r / 2]);
    }
    case "channel": {
      const { d: r, b: l, tf: p, tw: g } = E;
      return [[0, 0], [l, 0], [l, p], [g, p], [g, r - p], [l, r - p], [l, r], [0, r]].map(([O, C]) => [O - l / 2, C - r / 2]);
    }
    case "tee": {
      const { d: r, b: l, tf: p, tw: g } = E, O = (l - g) / 2;
      return [[0, r - p], [l, r - p], [l, r], [0, r]].concat([]) && [[O, 0], [O + g, 0], [O + g, r - p], [l, r - p], [l, r], [0, r], [0, r - p], [O, r - p]].map(([C, S]) => [C - l / 2, S - r / 2]);
    }
    case "isection": {
      const { d: r, b: l, tf: p, tw: g } = E, O = (l - g) / 2;
      return [[0, 0], [l, 0], [l, p], [O + g, p], [O + g, r - p], [l, r - p], [l, r], [0, r], [0, r - p], [O, r - p], [O, p], [0, p]].map(([C, S]) => [C - l / 2, S - r / 2]);
    }
    case "polygon":
      return E.puntos.slice();
    default:
      return [];
  }
}
function as(E, u = bt) {
  if (E.tipo === "tube") {
    const { d: r, b: l, tf: p, tw: g } = E, O = r / 2 - p, C = l / 2 - g;
    return [[[-C, -O], [-C, O], [C, O], [C, -O]]];
  }
  if (E.tipo === "pipe") {
    const r = E.d / 2 - E.t, l = [];
    for (let p = u - 1; p >= 0; p--) {
      const g = 2 * Math.PI * p / u;
      l.push([r * Math.cos(g), r * Math.sin(g)]);
    }
    return [l];
  }
  return [];
}
function cs(E, u = bt) {
  return E.tipo === "tube" ? wt({ tipo: "rect", d: E.d, b: E.b }) : E.tipo === "pipe" ? wt({ tipo: "circle", d: E.d }, u) : wt(E, u);
}
function is(E) {
  let u = 0, r = 0, l = 0, p = 0, g = 0, O = 0;
  for (let P = 0; P < E.length; P++) {
    const [y, b] = E[P], [A, G] = E[(P + 1) % E.length], k = y * G - A * b;
    u += k, r += (y + A) * k, l += (b + G) * k, p += (b * b + b * G + G * G) * k, g += (y * y + y * A + A * A) * k, O += (y * G + 2 * y * b + 2 * A * G + A * b) * k;
  }
  if (u /= 2, Math.abs(u) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const C = r / (6 * u), S = l / (6 * u);
  return { A: u, cx: C, cy: S, Ixx: p / 12 - u * S * S, Iyy: g / 12 - u * C * C, Ixy: O / 24 - u * C * S };
}
function rs(E, u) {
  const r = ns(u.rot ?? 0), l = Math.cos(r), p = Math.sin(r), g = u.mirror ? -1 : 1, O = E.map(([C, S]) => {
    const P = C * g;
    return [P * l - S * p + (u.xc ?? 0), P * p + S * l + (u.yc ?? 0)];
  });
  return u.mirror ? O.reverse() : O;
}
function ls(E, u) {
  let r = 0, l = 0, p = 0;
  const g = [];
  for (const A of E) {
    const G = u > 0 && A.E ? A.E / u : 1;
    if (A.forma.tipo === "rebar") {
      const Z = A.forma.area * G;
      g.push({ A: Z, cx: A.xc ?? 0, cy: A.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), r += Z, l += Z * (A.xc ?? 0), p += Z * (A.yc ?? 0);
      continue;
    }
    const k = [cs(A.forma), ...as(A.forma)];
    for (const Z of k) {
      if (Z.length < 3) continue;
      const M = is(rs(Z, A)), L = M.A * G;
      g.push({ ...M, A: L, n: G }), r += L, l += L * M.cx, p += L * M.cy;
    }
  }
  if (Math.abs(r) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: E.length };
  const O = l / r, C = p / r;
  let S = 0, P = 0, y = 0;
  for (const A of g) S += A.Ixx * A.n + A.A * (A.cy - C) ** 2, P += A.Iyy * A.n + A.A * (A.cx - O) ** 2, y += A.Ixy * A.n + A.A * (A.cx - O) * (A.cy - C);
  const b = (S + P) * 0.1;
  return { A: r, Iz: S, Iy: P, Ixy: y, J: b, cx: O, cy: C, As2: 5 / 6 * r, As3: 5 / 6 * r, nPiezas: E.length };
}
function fs(E, u, r, l, p) {
  switch ((E || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":
      return { tipo: "rect", d: u, b: r };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":
      return { tipo: "circle", d: u };
    case "STEEL ANGLE":
    case "ANGLE":
      return { tipo: "angle", d: u, b: r, tf: l, tw: p };
    case "STEEL CHANNEL":
    case "CHANNEL":
      return { tipo: "channel", d: u, b: r, tf: l, tw: p };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":
      return { tipo: "tee", d: u, b: r, tf: l, tw: p };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":
      return { tipo: "isection", d: u, b: r, tf: l, tw: p };
    case "STEEL TUBE":
    case "TUBE":
      return { tipo: "tube", d: u, b: r, tf: l, tw: p };
    case "STEEL PIPE":
    case "PIPE":
      return { tipo: "pipe", d: u, t: l || p };
    default:
      return u > 0 && r > 0 ? { tipo: "rect", d: u, b: r } : null;
  }
}
function Es(E) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const u = E.split(/\r?\n/), r = { force: "TONF", length: "M" }, l = [], p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), C = [], S = [], P = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), L = [], w = [], H = /* @__PURE__ */ new Map(), q = [];
  let j = 0;
  const et = [], ot = [];
  let tt = "", x = "";
  const ft = /* @__PURE__ */ new Map(), Xt = /(?:WEIGHTPERVOLUME|SLABTHICKNESS|WALLTHICKNESS|HEIGHT|ELEV|SPACING)\s+-?\d+,\d/.test(E), qt = (n) => n.split(/("[^"]*")/).map((s, t) => t % 2 ? s : s.replace(/(^|[\s=])(-?\d+),(\d+)(?=[\s]|$)/g, "$1$2.$3")).join("");
  for (const n of u) {
    const s = Xt ? qt(n.trim()) : n.trim();
    if (!s || s.startsWith("$")) {
      s.startsWith("$ ") && (x = s.substring(2).trim().replace(/^AREA OBJECT CONNECTIVITIES$/, "AREA CONNECTIVITIES").replace(/^AREA OBJECT LOADS$/, "SHELL OBJECT LOADS"));
      continue;
    }
    if (x && (ft.has(x) || ft.set(x, []), ft.get(x).push(n)), x === "CONTROLS") {
      const t = s.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      t && (r.force = t[1], r.length = t[2]);
      const o = s.match(/TITLE2\s+"([^"]+)"/);
      o && (tt = o[1]);
    }
    if (x === "STORIES - IN SEQUENCE FROM TOP") {
      const t = s.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (t) {
        const o = t[1], e = t[2] ? parseFloat(t[2]) : 0, a = t[3] ? parseFloat(t[3]) : void 0;
        l.push({ name: o, height: e, elev: a ?? 0 });
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
        const i = s.match(/\bFY\s+([\d.eE+-]+)/);
        i && (e.fy = parseFloat(i[1]));
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
        g.has(o) || g.set(o, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const e = g.get(o), a = s.match(/MATERIAL\s+"([^"]+)"/);
        a && (e.material = a[1]);
        const c = s.match(/SHAPE\s+"([^"]+)"/);
        c && (e.shape = c[1]);
        const i = s.match(/\bD\s+([\d.eE+-]+)/);
        i && (e.D = parseFloat(i[1]));
        const f = s.match(/\bB\s+([\d.eE+-]+)/);
        f && (e.B = parseFloat(f[1]));
        const d = s.match(/\bTF\s+([\d.eE+-]+)/);
        d && (e.TF = parseFloat(d[1]));
        const h = s.match(/\bTW\s+([\d.eE+-]+)/);
        h && (e.TW = parseFloat(h[1]));
        const I = s.match(/\bR\s+([\d.eE+-]+)/);
        I && (e.R = parseFloat(I[1]));
        const T = s.match(/FILLMATERIAL\s+"([^"]+)"/);
        T && (e.fillMaterial = T[1]);
        const N = s.match(/I2MOD\s+([\d.eE+-]+)/);
        N && (e.modI2 = parseFloat(N[1]));
        const R = s.match(/I3MOD\s+([\d.eE+-]+)/);
        R && (e.modI3 = parseFloat(R[1]));
        for (const [B, U] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const F = s.match(U);
          F && (e[B] = parseFloat(F[1]));
        }
        const D = s.match(/\bT\s+([\d.eE+-]+)/);
        D && !e.TF && !e.TW && (e.TF = parseFloat(D[1]), e.TW = parseFloat(D[1]));
        const z = s.match(/\bLIP\s+([\d.eE+-]+)/);
        z && (e.LIP = parseFloat(z[1]));
      }
    }
    if (x === "POINT COORDINATES") {
      const t = s.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      t && O.set(t[1], [parseFloat(t[2]), parseFloat(t[3]), parseFloat(t[4] ?? "0") || 0]);
    }
    if (x === "LINE CONNECTIVITIES") {
      const t = s.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      t && C.push({ name: t[1], type: t[2], pt1: t[3], pt2: t[4], nStories: parseInt(t[5]) });
    }
    if (x === "POINT ASSIGNS") {
      const t = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      t && A.set(`${t[1]}@${t[2]}`, t[3].split(/\s+/));
      const o = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      o && M.add(`${o[1]}@${o[2]}`);
      const e = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      e && Z.set(`${e[1]}@${e[2]}`, e[3]);
    }
    {
      const t = s.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (t) {
        const o = t[1] === "POINTSPRING" ? "point" : t[1] === "LINESPRING" ? "line" : "area", e = ((_a = k.get(t[2])) == null ? void 0 : _a.k) ?? [0, 0, 0, 0, 0, 0], a = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2, RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const c of s.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const i = a[c[1]];
          i !== void 0 && (e[i] = parseFloat(c[2]));
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
        const i = s.match(/RELEASE\s+"([^"]+)"/);
        i && (o.releases = i[1].split(/\s+/));
        const f = s.match(/ANG\s+([-\d.eE+]+)/);
        f && (o.angle = parseFloat(f[1]));
        const d = s.match(/SPRINGPROP\s+"([^"]+)"/);
        d && (o.spring = d[1]), o.mallaEnCruces = /MESHATINTERSECTIONS\s+"?YES/i.test(s), G.set(`${t[1]}@${t[2]}`, o);
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
      t && L.push({ line: t[1], story: t[2], type: t[3], dir: t[4], lc: t[5], val: parseFloat(t[6]) });
    }
    {
      const t = s.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      t && (H.has(t[1]) || H.set(t[1], []), H.get(t[1]).push({ lc: t[2], val: parseFloat(t[3]) }));
    }
    if (x === "LOAD PATTERNS") {
      const t = s.match(/LOADPATTERN\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+SELFWEIGHT\s+([\d.eE+-]+)/);
      t && /dead/i.test(t[2]) && (j = Math.max(j, parseFloat(t[3])));
    }
    if (x === "POINT OBJECT LOADS") {
      const t = s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"\s+LC\s+"([^"]+)"(.*)$/) ?? s.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"(.*)$/);
      if (t) {
        const o = (e) => {
          const a = t[4].match(new RegExp(`\\b${e}\\s+([-\\d.eE+]+)`));
          return a ? parseFloat(a[1]) : 0;
        };
        q.push({ pt: t[1], story: t[2], lc: t[3], v: ["FX", "FY", "FZ", "MX", "MY", "MZ"].map(o) });
      }
    }
    if (x === "SHELL OBJECT LOADS") {
      const t = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (t) w.push({ area: t[1], story: t[2], tipo: "UNIFF", dir: t[3], lc: t[4], val: parseFloat(t[5]) });
      else {
        const o = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        o && w.push({ area: o[1], story: o[2], tipo: "UNIFLOADSET", dir: "GRAV", lc: "", val: 0, set: o[3] });
      }
    }
    if (x === "AREA CONNECTIVITIES") {
      const t = s.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (t) {
        const o = ((_b = t[3].match(/"([^"]+)"/g)) == null ? void 0 : _b.map((a) => a.replace(/"/g, ""))) || [], e = t[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/).filter(Boolean).map(Number).filter((a) => Number.isFinite(a));
        S.push({ name: t[1], tipo: t[2] || "FLOOR", pts: o, dz: e.length === o.length ? e : o.map(() => 0) });
      }
    }
    if (s.startsWith("SDSECTION")) {
      const t = (_c = s.match(/SDSECTION\s+"([^"]+)"/)) == null ? void 0 : _c[1], o = (_d = s.match(/SHAPETYPE\s+"([^"]+)"/)) == null ? void 0 : _d[1];
      if (t && o) {
        const e = (a) => {
          const c = s.match(a);
          return c ? parseFloat(c[1]) : 0;
        };
        b.has(t) || b.set(t, []), b.get(t).push({ shapeType: o, material: ((_e = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _e[1]) ?? "", D: e(/\bD\s+([\d.eE+-]+)/), B: e(/\bB\s+([\d.eE+-]+)/), TF: e(/\bTF\s+([\d.eE+-]+)/), TW: e(/\bTW\s+([\d.eE+-]+)/), XC: e(/\bXC\s+(-?[\d.eE+-]+)/), YC: e(/\bYC\s+(-?[\d.eE+-]+)/) });
      }
    }
    if (x === "AREA ASSIGNS") {
      const t = s.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/);
      t && P.set(t[1], { story: t[2], section: t[3], spring: (_f = s.match(/SPRINGPROP\s+"([^"]+)"/)) == null ? void 0 : _f[1] });
    }
    if (s.startsWith("SHELLPROP")) {
      const t = (_g = s.match(/SHELLPROP\s+"([^"]+)"/)) == null ? void 0 : _g[1];
      if (t) {
        const o = (h) => {
          const I = s.match(h);
          return I ? parseFloat(I[1]) : void 0;
        }, e = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? o(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? o(/DECKSLABDEPTH\s+([\d.eE+-]+)/), c = /PROPTYPE\s+"Deck"/.test(s) ? { tc: o(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: o(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: o(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: o(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: o(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: o(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, f = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((h) => o(new RegExp(h + "\\s+([\\d.eE+-]+)"))), d = y.get(t);
        if (f.some((h) => h !== void 0)) {
          const h = f.map((I) => I ?? 1);
          y.set(t, { t: (d == null ? void 0 : d.t) ?? 0, material: (d == null ? void 0 : d.material) ?? "", modeling: (d == null ? void 0 : d.modeling) ?? "ShellThin", mods: h, deck: d == null ? void 0 : d.deck });
        } else e !== void 0 && y.set(t, { t: e, mods: d == null ? void 0 : d.mods, deck: c ?? (d == null ? void 0 : d.deck), material: ((_h = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _h[1]) ?? ((_i = s.match(/CONCMATERIAL\s+"([^"]+)"/)) == null ? void 0 : _i[1]) ?? "", modeling: ((_j = s.match(/MODELINGTYPE\s+"([^"]+)"/)) == null ? void 0 : _j[1]) ?? (/PROPTYPE\s+"Deck"/.test(s) ? "Membrane" : "ShellThin") });
      }
    }
  }
  const pt = /* @__PURE__ */ new Map();
  if (l.length > 0) {
    const n = l.length - 1;
    pt.set(l[n].name, l[n].elev);
    for (let s = n - 1; s >= 0; s--) {
      const o = pt.get(l[s + 1].name) + l[s].height;
      l[s].elev = o, pt.set(l[s].name, o);
    }
  }
  const W = [], Dt = [], nt = /* @__PURE__ */ new Map(), J = (n, s) => `${n}@${s}`, Q = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Map();
  for (const n of C) jt.set(n.name, n);
  for (const n of C) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = l.findIndex((a) => a.name === o);
    if (!(e < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      Q.add(J(n.pt2, o));
      const a = Math.min(e + n.nStories, l.length - 1);
      Q.add(J(n.pt1, l[a].name));
      for (let c = e + 1; c < a; c++) Q.add(J(n.pt1, l[c].name));
    } else Q.add(J(n.pt1, o)), Q.add(J(n.pt2, o));
  }
  for (const [n] of A) Q.add(n);
  for (const n of M) Q.add(n);
  const vt = (n, s) => {
    const t = l.findIndex((e) => e.name === n);
    if (t < 0) return;
    const o = t + (s || 0);
    if (!(o < 0 || o > l.length - 1)) return l[o].name;
  };
  for (const n of S) {
    const s = P.get(n.name);
    s && n.pts.forEach((t, o) => {
      const e = vt(s.story, n.dz[o] ?? 0);
      e && Q.add(J(t, e));
    });
  }
  const Tt = /* @__PURE__ */ new Map();
  for (const n of Q) {
    const [s, t] = n.split("@"), o = O.get(s), e = pt.get(t);
    if (o === void 0 || e === void 0) continue;
    W.push([o[0], o[1], e - (o[2] ?? 0)]), Dt.push(n), nt.set(n, W.length - 1);
    const a = Z.get(n);
    a && Tt.set(W.length - 1, a);
  }
  const K = [], st = [], Mt = [], it = [], dt = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
  for (const n of C) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = l.findIndex((f) => f.name === o);
    if (e < 0) continue;
    const a = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const f = Math.min(e + n.nStories, l.length - 1);
      for (let d = f; d > e; d--) a.push(J(n.pt1, l[d].name));
      a.push(J(n.pt2, o));
    } else a.push(J(n.pt1, o), J(n.pt2, o));
    const c = a.map((f) => nt.get(f)).filter((f) => f !== void 0);
    if (c.length < 2) continue;
    const i = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let f = 0; f < c.length - 1; f++) {
      const d = c[f], h = c[f + 1];
      if (d === h) continue;
      const I = K.length;
      if (K.push([d, h]), st.push(c.length > 2 ? `${n.name}-${f + 1}` : n.name), Mt.push(n.type), it.push(o), dt.set(I, t.section), t.spring && St.set(I, t.spring), t.mallaEnCruces && xt.set(I, true), t.rigidZone > 0 && Et.set(I, [t.rigidZone, t.rigidZone]), t.angle && Gt.set(I, t.angle), t.offsets && rt.set(I, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const T = new Array(12).fill(false);
        for (const N of t.releases) {
          const R = i[N];
          R !== void 0 && (R < 6 && f !== 0 || R >= 6 && f !== c.length - 2 || (T[R] = true));
        }
        T.some(Boolean) && kt.set(I, T);
      }
    }
  }
  const ht = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Ot = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  let $t = 0;
  for (const [n, s] of dt) {
    const t = g.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    o && (ht.set(n, o.E), mt.set(n, o.G));
    const e = t.D, a = t.B, c = t.TF, i = t.TW;
    let f = 0, d = 0, h = 0, I = 0, T = 0, N = 0, R = "rect", D = 0, z = false, B = false;
    const U = b.get(s);
    if (t.shape === "SD Section" && (U == null ? void 0 : U.length)) {
      const F = (o == null ? void 0 : o.E) || ((_k = p.get(t.material)) == null ? void 0 : _k.E) || 0, _ = [];
      for (const v of U) {
        const lt = fs(v.shapeType, v.D, v.B, v.TF, v.TW);
        lt && _.push({ forma: lt, xc: v.XC, yc: v.YC, E: ((_l = p.get(v.material)) == null ? void 0 : _l.E) || F });
      }
      if (_.length) {
        const v = ls(_, F);
        v.A > 0 && (f = v.A, d = v.Iz, h = v.Iy, I = v.J, T = v.As2, N = v.As3, R = "rect", B = true, $t++);
      }
    }
    if (!B) switch (t.shape) {
      case "Concrete Rectangular":
        f = e * a, d = a * e ** 3 / 12, h = e * a ** 3 / 12, I = a * e ** 3 * (1 / 3 - 0.21 * (e / a) * (1 - e ** 4 / (12 * a ** 4))), T = N = 5 / 6 * f, R = "rect";
        break;
      case "Concrete Circle":
        f = Math.PI * e ** 2 / 4, d = h = Math.PI * e ** 4 / 64, I = Math.PI * e ** 4 / 32, T = N = 0.9 * f, R = "circ";
        break;
      case "Steel I/Wide Flange":
        f = 2 * a * c + (e - 2 * c) * i, d = (a * e ** 3 - (a - i) * (e - 2 * c) ** 3) / 12, h = (2 * c * a ** 3 + (e - 2 * c) * i ** 3) / 12, I = (2 * a * c ** 3 + (e - 2 * c) * i ** 3) / 3, T = (e - 2 * c) * i, N = 2 * a * c * 5 / 6, R = "I";
        break;
      case "Steel Tube":
        f = e * a - (e - 2 * i) * (a - 2 * i), d = (a * e ** 3 - (a - 2 * i) * (e - 2 * i) ** 3) / 12, h = (e * a ** 3 - (e - 2 * i) * (a - 2 * i) ** 3) / 12, I = 2 * i * (e - i) * (a - i) * ((e - i) * (a - i)) / (e - i + (a - i)), T = 2 * e * i, N = 2 * a * i, R = "HSS";
        break;
      case "Filled Steel Pipe": {
        const F = (o == null ? void 0 : o.E) || 0, _ = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (_ == null ? void 0 : _.E) || F * 0.125, lt = t.T || i || c, V = os(e, lt, F || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (_ == null ? void 0 : _.nu) ?? 0.2);
        f = V.A, d = V.Iz, h = V.Iy, I = V.J, N = V.As2, T = V.As3, D = v, z = true, R = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const F = (o == null ? void 0 : o.E) || 0, _ = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (_ == null ? void 0 : _.E) || F * 0.125, V = es(a, e, i || c, F || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (_ == null ? void 0 : _.nu) ?? 0.2);
        f = V.A, d = V.Iz, h = V.Iy, I = V.J, N = V.As2, T = V.As3, D = v, R = "CFT";
        break;
      }
      case "Steel Angle": {
        const F = c || i;
        f = F * (e + a - F), d = F * (e ** 3 + a * F ** 2 + F ** 2 * (e - F)) / 12, h = F * (a ** 3 + e * F ** 2 + F ** 2 * (a - F)) / 12, I = (e + a - F) * F ** 3 / 3, T = e * F, N = a * F, R = "L";
        break;
      }
      case "Steel Channel":
      case "Cold Formed C":
        f = 2 * a * c + (e - 2 * c) * i, d = (i * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, h = (2 * c * a ** 3 + (e - 2 * c) * i ** 3) / 12, I = (2 * a * c ** 3 + (e - 2 * c) * i ** 3) / 3, T = (e - 2 * c) * i, N = 2 * a * c * 5 / 6, R = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        f = 2 * (2 * a * c + (e - 2 * c) * i), d = 2 * (i * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, h = 2 * (2 * c * a ** 3 + (e - 2 * c) * i ** 3) / 12, I = 2 * (2 * a * c ** 3 + (e - 2 * c) * i ** 3) / 3, T = 2 * (e - 2 * c) * i, N = 4 * a * c * 5 / 6, R = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          f = t.AREA, d = t.I33 ?? 0, h = t.I22 ?? 0, I = t.TORSION ?? 0, N = t.AS2 ?? 0, T = t.AS3 ?? 0, R = "general";
          break;
        }
      default:
        e > 0 && a > 0 && (f = e * a, d = a * e ** 3 / 12, h = e * a ** 3 / 12, I = Math.min(e, a) * Math.max(e, a) ** 3 / 3 * 0.3, T = N = 5 / 6 * f);
        break;
    }
    t.modI2 && (h *= t.modI2), t.modI3 && (d *= t.modI3), ut.set(n, f), Ot.set(n, d), yt.set(n, h), Lt.set(n, I), T > 0 && Nt.set(n, T), N > 0 && Rt.set(n, N), It.set(n, { type: R, ...D > 0 ? { fillE: D } : {}, b: z ? void 0 : a || void 0, h: z ? void 0 : e || void 0, d: R === "circ" || R === "pipe" || z ? e : void 0, tw: i || void 0, tf: c || void 0, r: t.R, name: s });
  }
  const gt = /* @__PURE__ */ new Map();
  for (const [n, s] of A) {
    const t = nt.get(n);
    if (t === void 0) continue;
    const o = [false, false, false, false, false, false];
    for (const e of s) e === "UX" && (o[0] = true), e === "UY" && (o[1] = true), e === "UZ" && (o[2] = true), e === "RX" && (o[3] = true), e === "RY" && (o[4] = true), e === "RZ" && (o[5] = true);
    gt.set(t, o);
  }
  const X = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map();
  for (let n = 0; n < st.length; n++) Bt.set(`${st[n]}@${it[n]}`, n);
  for (const n of L) {
    const s = Bt.get(`${n.line}@${n.story}`);
    if (s === void 0) continue;
    const [t, o] = K[s], e = W[t], a = W[o], c = Math.sqrt((a[0] - e[0]) ** 2 + (a[1] - e[1]) ** 2 + (a[2] - e[2]) ** 2);
    if (c < 1e-10) continue;
    const i = [0, 0, 0];
    n.dir === "GRAV" || n.dir === "GRAVITY" ? i[2] = -n.val : n.dir === "X" ? i[0] = n.val : n.dir === "Y" ? i[1] = n.val : n.dir === "Z" && (i[2] = n.val);
    const f = [(a[0] - e[0]) / c, (a[1] - e[1]) / c, (a[2] - e[2]) / c], d = c * c / 12, h = [f[1] * i[2] - f[2] * i[1], f[2] * i[0] - f[0] * i[2], f[0] * i[1] - f[1] * i[0]], I = (T, N) => {
      const R = X.get(T) || [0, 0, 0, 0, 0, 0];
      for (let D = 0; D < 6; D++) R[D] += N[D];
      X.set(T, R);
    };
    I(t, [i[0] * c / 2, i[1] * c / 2, i[2] * c / 2, d * h[0], d * h[1], d * h[2]]), I(o, [i[0] * c / 2, i[1] * c / 2, i[2] * c / 2, -d * h[0], -d * h[1], -d * h[2]]);
  }
  const at = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map();
  for (const [n, s] of dt) {
    const t = g.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    (o == null ? void 0 : o.density) && at.set(n, o.density);
  }
  const At = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new Map(), Ft = [], $ = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of S) {
    const s = P.get(n.name);
    if (!s) {
      $.sinAssign++;
      continue;
    }
    const t = n.pts.map((c, i) => {
      const f = vt(s.story, n.dz[i] ?? 0);
      return f === void 0 ? void 0 : nt.get(J(c, f));
    });
    if (t.some((c) => c === void 0)) {
      $.sinNudo++;
      continue;
    }
    const e = t.filter((c, i, f) => f.indexOf(c) === i);
    if (e.length < 3) {
      $.colapsada++;
      continue;
    }
    const a = e.length <= 4 ? [e.length === 3 ? e : t.slice(0, 4)] : ps(e, W);
    if (!a.length) {
      $.poligono++;
      continue;
    }
    for (const c of a) {
      const i = K.length;
      K.push(c), st.push(n.name), Mt.push(n.tipo), it.push(s.story), Ft.push(n.name), s.spring && St.set(i, s.spring);
      const f = y.get(s.section);
      if (f) {
        At.set(i, f.t);
        const d = p.get(f.material);
        if ((d == null ? void 0 : d.E) && ht.set(i, d.E), (d == null ? void 0 : d.G) && mt.set(i, d.G), (d == null ? void 0 : d.nu) !== void 0 && Ut.set(i, d.nu), (d == null ? void 0 : d.density) && at.set(i, d.density), f.deck && f.deck.tc > 0) {
          const T = f.deck, N = T.tc + (T.sr > 0 ? T.hr * (T.wrt + T.wrb) / 2 / T.sr : 0);
          at.set(i, (((d == null ? void 0 : d.density) ?? 0) * N + T.w) / T.tc), Ct.set(i, { ...T });
        }
        const h = /membrane/i.test(f.modeling);
        Yt.set(i, /thick/i.test(f.modeling) || h ? 0 : 1);
        const I = f.mods ? f.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
        h && (I[3] = 0, I[4] = 0, I[5] = 0, I[6] = 0, I[7] = 0), (f.mods || h) && Ht.set(i, I);
      }
    }
  }
  const ct = /* @__PURE__ */ new Map();
  for (let n = 0; n < st.length; n++) if (K[n].length > 2) {
    const s = `${st[n]}@${it[n]}`;
    ct.has(s) || ct.set(s, []), ct.get(s).push(n);
  }
  let Pt = 0;
  for (const n of q) {
    const s = nt.get(J(n.pt, n.story));
    if (s === void 0) {
      Pt++;
      continue;
    }
    const t = X.get(s) || [0, 0, 0, 0, 0, 0];
    for (let o = 0; o < 6; o++) t[o] += n.v[o];
    X.set(s, t);
  }
  q.length && console.log(`[e2kParser] cargas puntuales: ${q.length - Pt} aplicadas \xB7 ${Pt} sin nudo (punto@planta que no existe)`);
  let Wt = 0, zt = 0, Vt = 0, Zt = 0;
  for (const n of w) {
    const s = ct.get(`${n.area}@${n.story}`) ?? ct.get(`${n.area}@`), t = s !== void 0 ? s : (_m = [...ct].find(([e]) => e.startsWith(n.area + "@"))) == null ? void 0 : _m[1];
    if (t === void 0) {
      zt++;
      continue;
    }
    let o = false;
    for (const e of t) {
      const a = K[e], c = a.map((B) => W[B]).filter(Boolean);
      if (c.length < 3) continue;
      let i = 0, f = 0, d = 0;
      for (let B = 0; B < c.length; B++) {
        const U = c[B], F = c[(B + 1) % c.length];
        i += U[1] * F[2] - U[2] * F[1], f += U[2] * F[0] - U[0] * F[2], d += U[0] * F[1] - U[1] * F[0];
      }
      const h = Math.hypot(i, f, d) / 2;
      if (!(h > 0)) continue;
      const I = n.tipo === "UNIFLOADSET" ? H.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
      let T = 0;
      for (const B of I) T += B.val;
      if (!T) {
        o || Vt++, o = true;
        break;
      }
      o || Zt++, o = true;
      const N = T * h / c.length;
      Wt += T * h;
      let R = 0, D = 0, z = 0;
      n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? z = -N : n.dir === "X" ? R = N : n.dir === "Y" && (D = N);
      for (const B of a) {
        const U = X.get(B) || [0, 0, 0, 0, 0, 0];
        U[0] += R, U[1] += D, U[2] += z, X.set(B, U);
      }
    }
  }
  w.length && console.info(`[e2kParser] cargas de losa: ${Zt} aplicadas \xB7 ${zt} sin area que las lleve \xB7 ${Vt} sin valor \xB7 total ${Wt.toFixed(0)} (unidades del fichero) \xB7 ${H.size} juegos con nombre`);
  const Jt = $.sinAssign + $.sinNudo + $.colapsada + $.poligono;
  if (Jt) {
    const n = [$.poligono && `${$.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, $.sinAssign && `${$.sinAssign} sin AREAASSIGN`, $.sinNudo && `${$.sinNudo} con algun nudo que no resuelve a planta`, $.colapsada && `${$.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${Jt} de ${S.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const Qt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, _t = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, m = Qt[(r.length || "M").toUpperCase()] ?? 1, Y = _t[(r.force || "KN").toUpperCase()] ?? 1;
  if (m !== 1 || Y !== 1) {
    const n = (s, t) => {
      if (s) for (const [o, e] of s) s.set(o, e * t);
    };
    for (const s of W) s[0] *= m, s[1] *= m, s[2] *= m;
    for (const s of l) s.height *= m, s.elev *= m;
    for (const s of et) s.coord *= m;
    for (const s of ot) s.z *= m;
    n(At, m), n(ut, m * m);
    for (const s of k.values()) {
      const t = s.tipo === "point" ? Y / m : s.tipo === "line" ? Y / (m * m) : Y / (m * m * m);
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? t : s.tipo === "point" ? Y * m : Y;
    }
    n(Nt, m * m), n(Rt, m * m), n(yt, m ** 4), n(Ot, m ** 4), n(Lt, m ** 4), n(ht, Y / (m * m)), n(mt, Y / (m * m)), n(at, Y / m ** 3);
    for (const s of Ct.values()) s.tc *= m, s.hr *= m, s.wrt *= m, s.wrb *= m, s.sr *= m, s.w *= Y / (m * m);
    for (const [s, t] of Et) Et.set(s, [t[0] * m, t[1] * m]);
    for (const [s, t] of rt) rt.set(s, [t[0] * m, t[1] * m, t[2]]);
    for (const [s, t] of X) X.set(s, t.map((o, e) => o * (e < 3 ? Y : Y * m)));
    for (const [, s] of k) {
      const t = s.tipo === "point" ? 1 : s.tipo === "line" ? 2 : 3;
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? Y / m ** t : Y * m / m ** (t - 1);
    }
    for (const [, s] of It) {
      for (const t of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const o = s;
        typeof o[t] == "number" && (o[t] *= m);
      }
      typeof s.fillE == "number" && (s.fillE *= Y / (m * m));
    }
  }
  {
    const n = Kt(K, gt);
    n.nPiezasFlotantes && console.warn(`[e2kParser] ${n.nPiezasFlotantes} trozos (${n.nNudosFlotantes} nudos) no llegan a ningun apoyo: la matriz sale SINGULAR y el modelo no resuelve. En ETABS los sujetan links, muelles de pilote o diafragmas, que este lector aun no importa.`);
  }
  const ts = () => {
    if (!(j > 0)) return X;
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
        const c = ut.get(o) ?? 0, i = W[a[0]], f = W[a[1]], d = rt.get(o), h = f[0] - i[0], I = f[1] - i[1], T = f[2] - i[2], N = Math.hypot(h, I), R = N > 1e-9 && Math.atan2(Math.abs(T), N) * 180 / Math.PI < 20, D = Math.max(0, Math.hypot(h, I, T) - (d && R ? d[0] + d[1] : 0)), z = e * c * D * j;
        s(a[0], -z / 2), s(a[1], -z / 2);
      } else if (a.length >= 3) {
        const c = At.get(o) ?? 0, i = a.map((N) => W[N]);
        let f = 0, d = 0, h = 0;
        for (let N = 0; N < i.length; N++) {
          const R = i[N], D = i[(N + 1) % i.length];
          f += R[1] * D[2] - R[2] * D[1], d += R[2] * D[0] - R[0] * D[2], h += R[0] * D[1] - R[1] * D[0];
        }
        const I = Math.hypot(f, d, h) / 2, T = e * c * I * j;
        for (const N of a) s(N, -T / a.length);
      }
    }), console.log(`[e2kParser] peso propio (SELFWEIGHT ${j}): ${n.toFixed(3)} kN repartidos a los nudos`), X;
  }, ss = () => {
    const n = [];
    for (const [s, t] of Tt) {
      const o = k.get(t);
      !o || o.tipo !== "point" || o.k.forEach((e, a) => {
        e > 0 && n.push({ node: s, dof: a, k: e });
      });
    }
    return n.length ? n : void 0;
  };
  return { units: r, stories: l.reverse(), materials: p, frameSections: g, nodes: W, nodeNames: Dt, nodeNameToIdx: nt, elements: K, elementNames: st, elementTypes: Mt, elementStories: it, elementSections: dt, nodeInputs: { supports: gt, loads: ts(), springNames: Tt, springs: ss() }, elementInputs: { elasticities: ht, shearModuli: mt, areas: ut, momentsOfInertiaZ: Ot, momentsOfInertiaY: yt, torsionalConstants: Lt, shearAreasY: Nt, shearAreasZ: Rt, rigidOffsets: Et, momentReleases: kt, localAngles: Gt, endOffsets: rt, densities: new Map([...at].map(([n, s]) => [n, s / 9.80665])), deckSections: Ct, sectionShapes: It, thicknesses: At, poissonsRatios: Ut, plateFormulations: Yt, shellModifiers: Ht, springNames: St, mallaEnCruces: xt }, sectionShapes: It, grids: et, planosRef: ot, springProps: k, info: { ...Kt(K, gt), nNodes: W.length, nFrames: K.length - Ft.length, nAreas: S.length, nAreasMontadas: Ft.length, nSDCompuestas: $t, nSDLeidas: b.size, title: tt }, rawSections: ft };
}
function ps(E, u) {
  const r = E.length;
  if (r < 3) return [];
  const l = [0, 0, 0];
  for (let M = 0; M < r; M++) {
    const L = u[E[M]], w = u[E[(M + 1) % r]];
    l[0] += (L[1] - w[1]) * (L[2] + w[2]), l[1] += (L[2] - w[2]) * (L[0] + w[0]), l[2] += (L[0] - w[0]) * (L[1] + w[1]);
  }
  const p = [Math.abs(l[0]), Math.abs(l[1]), Math.abs(l[2])], g = p[2] >= p[0] && p[2] >= p[1] ? 2 : p[1] >= p[0] ? 1 : 0, [O, C] = g === 2 ? [0, 1] : g === 1 ? [2, 0] : [1, 2], S = E.map((M) => [u[M][O], u[M][C]]);
  let P = 0;
  for (let M = 0; M < r; M++) P += S[M][0] * S[(M + 1) % r][1] - S[(M + 1) % r][0] * S[M][1];
  if (Math.abs(P) < 1e-12) return [];
  const y = [...Array(r).keys()];
  P < 0 && y.reverse();
  const b = (M, L, w) => (L[0] - M[0]) * (w[1] - M[1]) - (L[1] - M[1]) * (w[0] - M[0]), A = (M, L) => Math.abs(M[0] - L[0]) < 1e-9 && Math.abs(M[1] - L[1]) < 1e-9, G = (M, L, w, H) => !A(M, L) && !A(M, w) && !A(M, H) && b(L, w, M) >= -1e-12 && b(w, H, M) >= -1e-12 && b(H, L, M) >= -1e-12, k = [];
  let Z = 0;
  for (; y.length > 3 && Z++ < 10 * r; ) {
    let M = false;
    for (let L = 0; L < y.length; L++) {
      const w = y[(L + y.length - 1) % y.length], H = y[L], q = y[(L + 1) % y.length], j = S[w], et = S[H], ot = S[q];
      if (!(b(j, et, ot) <= 1e-12) && !y.some((tt) => tt !== w && tt !== H && tt !== q && G(S[tt], j, et, ot))) {
        k.push(P < 0 ? [E[q], E[H], E[w]] : [E[w], E[H], E[q]]), y.splice(L, 1), M = true;
        break;
      }
    }
    if (!M) return [];
  }
  if (y.length === 3) {
    const [M, L, w] = y;
    k.push(P < 0 ? [E[w], E[L], E[M]] : [E[M], E[L], E[w]]);
  }
  return k;
}
function Kt(E, u) {
  const r = /* @__PURE__ */ new Map();
  for (const S of E) for (const P of S) for (const y of S) P !== y && (r.has(P) || r.set(P, []), r.get(P).push(y));
  const l = /* @__PURE__ */ new Set();
  for (const S of E) for (const P of S) l.add(P);
  const p = new Set([...u ?? /* @__PURE__ */ new Map()].map(([S]) => S)), g = /* @__PURE__ */ new Set();
  let O = 0, C = 0;
  for (const S of l) {
    if (g.has(S)) continue;
    const P = [S], y = [];
    for (g.add(S); P.length; ) {
      const b = P.pop();
      y.push(b);
      for (const A of r.get(b) ?? []) g.has(A) || (g.add(A), P.push(A));
    }
    y.some((b) => p.has(b)) || (O++, C += y.length);
  }
  return { nPiezasFlotantes: O, nNudosFlotantes: C };
}
export {
  Kt as a,
  Es as p
};
