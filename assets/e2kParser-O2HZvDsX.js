import { d as es, a as os, b as ns, e as as, f as cs, g as is } from "./cadSections-CEHEfdGW.js";
const wt = 64, rs = (h) => h * Math.PI / 180;
function bt(h, g = wt) {
  switch (h.tipo) {
    case "rect": {
      const { d: i, b: r } = h;
      return [[-r / 2, -i / 2], [r / 2, -i / 2], [r / 2, i / 2], [-r / 2, i / 2]];
    }
    case "circle": {
      const i = h.d / 2, r = [];
      for (let p = 0; p < g; p++) {
        const S = 2 * Math.PI * p / g;
        r.push([i * Math.cos(S), i * Math.sin(S)]);
      }
      return r;
    }
    case "angle": {
      const { d: i, b: r, tf: p, tw: S } = h;
      return [[0, 0], [r, 0], [r, p], [S, p], [S, i], [0, i]].map(([y, F]) => [y - r / 2, F - i / 2]);
    }
    case "channel": {
      const { d: i, b: r, tf: p, tw: S } = h;
      return [[0, 0], [r, 0], [r, p], [S, p], [S, i - p], [r, i - p], [r, i], [0, i]].map(([y, F]) => [y - r / 2, F - i / 2]);
    }
    case "tee": {
      const { d: i, b: r, tf: p, tw: S } = h, y = (r - S) / 2;
      return [[0, i - p], [r, i - p], [r, i], [0, i]].concat([]) && [[y, 0], [y + S, 0], [y + S, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [y, i - p]].map(([F, N]) => [F - r / 2, N - i / 2]);
    }
    case "isection": {
      const { d: i, b: r, tf: p, tw: S } = h, y = (r - S) / 2;
      return [[0, 0], [r, 0], [r, p], [y + S, p], [y + S, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [y, i - p], [y, p], [0, p]].map(([F, N]) => [F - r / 2, N - i / 2]);
    }
    case "polygon":
      return h.puntos.slice();
    default:
      return [];
  }
}
function ls(h, g = wt) {
  if (h.tipo === "tube") {
    const { d: i, b: r, tf: p, tw: S } = h, y = i / 2 - p, F = r / 2 - S;
    return [[[-F, -y], [-F, y], [F, y], [F, -y]]];
  }
  if (h.tipo === "pipe") {
    const i = h.d / 2 - h.t, r = [];
    for (let p = g - 1; p >= 0; p--) {
      const S = 2 * Math.PI * p / g;
      r.push([i * Math.cos(S), i * Math.sin(S)]);
    }
    return [r];
  }
  return [];
}
function fs(h, g = wt) {
  return h.tipo === "tube" ? bt({ tipo: "rect", d: h.d, b: h.b }) : h.tipo === "pipe" ? bt({ tipo: "circle", d: h.d }, g) : bt(h, g);
}
function ps(h) {
  let g = 0, i = 0, r = 0, p = 0, S = 0, y = 0;
  for (let P = 0; P < h.length; P++) {
    const [L, w] = h[P], [T, G] = h[(P + 1) % h.length], k = L * G - T * w;
    g += k, i += (L + T) * k, r += (w + G) * k, p += (w * w + w * G + G * G) * k, S += (L * L + L * T + T * T) * k, y += (L * G + 2 * L * w + 2 * T * G + T * w) * k;
  }
  if (g /= 2, Math.abs(g) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const F = i / (6 * g), N = r / (6 * g);
  return { A: g, cx: F, cy: N, Ixx: p / 12 - g * N * N, Iyy: S / 12 - g * F * F, Ixy: y / 24 - g * F * N };
}
function ds(h, g) {
  const i = rs(g.rot ?? 0), r = Math.cos(i), p = Math.sin(i), S = g.mirror ? -1 : 1, y = h.map(([F, N]) => {
    const P = F * S;
    return [P * r - N * p + (g.xc ?? 0), P * p + N * r + (g.yc ?? 0)];
  });
  return g.mirror ? y.reverse() : y;
}
function Es(h, g) {
  let i = 0, r = 0, p = 0;
  const S = [];
  for (const T of h) {
    const G = g > 0 && T.E ? T.E / g : 1;
    if (T.forma.tipo === "rebar") {
      const J = T.forma.area * G;
      S.push({ A: J, cx: T.xc ?? 0, cy: T.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), i += J, r += J * (T.xc ?? 0), p += J * (T.yc ?? 0);
      continue;
    }
    const k = [fs(T.forma), ...ls(T.forma)];
    for (const J of k) {
      if (J.length < 3) continue;
      const M = ps(ds(J, T)), C = M.A * G;
      S.push({ ...M, A: C, n: G }), i += C, r += C * M.cx, p += C * M.cy;
    }
  }
  if (Math.abs(i) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: h.length };
  const y = r / i, F = p / i;
  let N = 0, P = 0, L = 0;
  for (const T of S) N += T.Ixx * T.n + T.A * (T.cy - F) ** 2, P += T.Iyy * T.n + T.A * (T.cx - y) ** 2, L += T.Ixy * T.n + T.A * (T.cx - y) * (T.cy - F);
  const w = (N + P) * 0.1;
  return { A: i, Iz: N, Iy: P, Ixy: L, J: w, cx: y, cy: F, As2: 5 / 6 * i, As3: 5 / 6 * i, nPiezas: h.length };
}
function hs(h, g, i, r, p) {
  switch ((h || "").toUpperCase()) {
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
function Is(h) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const g = h.split(/\r?\n/), i = { force: "TONF", length: "M" }, r = [], p = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), F = [], N = [], P = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Set(), C = [], b = [], z = /* @__PURE__ */ new Map(), j = [];
  let Q = 0;
  const et = [], ot = [];
  let tt = "", x = "";
  const ft = /* @__PURE__ */ new Map(), Xt = /(?:WEIGHTPERVOLUME|SLABTHICKNESS|WALLTHICKNESS|HEIGHT|ELEV|SPACING)\s+-?\d+,\d/.test(h), qt = (n) => n.split(/("[^"]*")/).map((s, t) => t % 2 ? s : s.replace(/(^|[\s=])(-?\d+),(\d+)(?=[\s]|$)/g, "$1$2.$3")).join("");
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
        const f = s.match(/\bFY\s+([\d.eE+-]+)/);
        f && (e.fy = parseFloat(f[1]));
        const l = s.match(/\bFC\s+([\d.eE+-]+)/);
        l && (e.fc = parseFloat(l[1]));
        const d = s.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        d && (e.density = parseFloat(d[1]));
      }
    }
    if (x === "FRAME SECTIONS") {
      const t = s.match(/FRAMESECTION\s+"([^"]+)"/);
      if (t) {
        const o = t[1];
        S.has(o) || S.set(o, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const e = S.get(o), a = s.match(/MATERIAL\s+"([^"]+)"/);
        a && (e.material = a[1]);
        const c = s.match(/SHAPE\s+"([^"]+)"/);
        c && (e.shape = c[1]);
        const f = s.match(/\bD\s+([\d.eE+-]+)/);
        f && (e.D = parseFloat(f[1]));
        const l = s.match(/\bB\s+([\d.eE+-]+)/);
        l && (e.B = parseFloat(l[1]));
        const d = s.match(/\bTF\s+([\d.eE+-]+)/);
        d && (e.TF = parseFloat(d[1]));
        const m = s.match(/\bTW\s+([\d.eE+-]+)/);
        m && (e.TW = parseFloat(m[1]));
        const I = s.match(/\bR\s+([\d.eE+-]+)/);
        I && (e.R = parseFloat(I[1]));
        const A = s.match(/FILLMATERIAL\s+"([^"]+)"/);
        A && (e.fillMaterial = A[1]);
        const R = s.match(/I2MOD\s+([\d.eE+-]+)/);
        R && (e.modI2 = parseFloat(R[1]));
        const O = s.match(/I3MOD\s+([\d.eE+-]+)/);
        O && (e.modI3 = parseFloat(O[1]));
        for (const [U, E] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const q = s.match(E);
          q && (e[U] = parseFloat(q[1]));
        }
        const D = s.match(/\bT\s+([\d.eE+-]+)/);
        D && !e.TF && !e.TW && (e.TF = parseFloat(D[1]), e.TW = parseFloat(D[1]));
        const W = s.match(/\bLIP\s+([\d.eE+-]+)/);
        W && (e.LIP = parseFloat(W[1]));
        const $ = s.match(/\bDIS\s+([\d.eE+-]+)/);
        $ && (e.DIS = parseFloat($[1]));
      }
    }
    if (x === "POINT COORDINATES") {
      const t = s.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      t && y.set(t[1], [parseFloat(t[2]), parseFloat(t[3]), parseFloat(t[4] ?? "0") || 0]);
    }
    if (x === "LINE CONNECTIVITIES") {
      const t = s.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      t && F.push({ name: t[1], type: t[2], pt1: t[3], pt2: t[4], nStories: parseInt(t[5]) });
    }
    if (x === "POINT ASSIGNS") {
      const t = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      t && T.set(`${t[1]}@${t[2]}`, t[3].split(/\s+/));
      const o = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      o && M.add(`${o[1]}@${o[2]}`);
      const e = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      e && J.set(`${e[1]}@${e[2]}`, e[3]);
    }
    {
      const t = s.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (t) {
        const o = t[1] === "POINTSPRING" ? "point" : t[1] === "LINESPRING" ? "line" : "area", e = ((_a = k.get(t[2])) == null ? void 0 : _a.k) ?? [0, 0, 0, 0, 0, 0], a = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2, RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const c of s.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const f = a[c[1]];
          f !== void 0 && (e[f] = parseFloat(c[2]));
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
        const f = s.match(/RELEASE\s+"([^"]+)"/);
        f && (o.releases = f[1].split(/\s+/));
        const l = s.match(/ANG\s+([-\d.eE+]+)/);
        l && (o.angle = parseFloat(l[1]));
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
      t && C.push({ line: t[1], story: t[2], type: t[3], dir: t[4], lc: t[5], val: parseFloat(t[6]) });
    }
    {
      const t = s.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      t && (z.has(t[1]) || z.set(t[1], []), z.get(t[1]).push({ lc: t[2], val: parseFloat(t[3]) }));
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
      if (t) b.push({ area: t[1], story: t[2], tipo: "UNIFF", dir: t[3], lc: t[4], val: parseFloat(t[5]) });
      else {
        const o = s.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        o && b.push({ area: o[1], story: o[2], tipo: "UNIFLOADSET", dir: "GRAV", lc: "", val: 0, set: o[3] });
      }
    }
    if (x === "AREA CONNECTIVITIES") {
      const t = s.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (t) {
        const o = ((_b = t[3].match(/"([^"]+)"/g)) == null ? void 0 : _b.map((a) => a.replace(/"/g, ""))) || [], e = t[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/).filter(Boolean).map(Number).filter((a) => Number.isFinite(a));
        N.push({ name: t[1], tipo: t[2] || "FLOOR", pts: o, dz: e.length === o.length ? e : o.map(() => 0) });
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
      t && P.set(t[1], { story: t[2], section: t[3], spring: (_f = s.match(/SPRINGPROP\s+"([^"]+)"/)) == null ? void 0 : _f[1] });
    }
    if (s.startsWith("SHELLPROP")) {
      const t = (_g = s.match(/SHELLPROP\s+"([^"]+)"/)) == null ? void 0 : _g[1];
      if (t) {
        const o = (m) => {
          const I = s.match(m);
          return I ? parseFloat(I[1]) : void 0;
        }, e = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? o(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? o(/DECKSLABDEPTH\s+([\d.eE+-]+)/), c = /PROPTYPE\s+"Deck"/.test(s) ? { tc: o(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: o(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: o(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: o(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: o(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: o(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, l = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((m) => o(new RegExp(m + "\\s+([\\d.eE+-]+)"))), d = L.get(t);
        if (l.some((m) => m !== void 0)) {
          const m = l.map((I) => I ?? 1);
          L.set(t, { t: (d == null ? void 0 : d.t) ?? 0, material: (d == null ? void 0 : d.material) ?? "", modeling: (d == null ? void 0 : d.modeling) ?? "ShellThin", mods: m, deck: d == null ? void 0 : d.deck });
        } else e !== void 0 && L.set(t, { t: e, mods: d == null ? void 0 : d.mods, deck: c ?? (d == null ? void 0 : d.deck), material: ((_h = s.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _h[1]) ?? ((_i = s.match(/CONCMATERIAL\s+"([^"]+)"/)) == null ? void 0 : _i[1]) ?? "", modeling: ((_j = s.match(/MODELINGTYPE\s+"([^"]+)"/)) == null ? void 0 : _j[1]) ?? (/PROPTYPE\s+"Deck"/.test(s) ? "Membrane" : "ShellThin") });
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
  const H = [], Dt = [], nt = /* @__PURE__ */ new Map(), Z = (n, s) => `${n}@${s}`, _ = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Map();
  for (const n of F) jt.set(n.name, n);
  for (const n of F) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((a) => a.name === o);
    if (!(e < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      _.add(Z(n.pt2, o));
      const a = Math.min(e + n.nStories, r.length - 1);
      _.add(Z(n.pt1, r[a].name));
      for (let c = e + 1; c < a; c++) _.add(Z(n.pt1, r[c].name));
    } else _.add(Z(n.pt1, o)), _.add(Z(n.pt2, o));
  }
  for (const [n] of T) _.add(n);
  for (const n of M) _.add(n);
  const vt = (n, s) => {
    const t = r.findIndex((e) => e.name === n);
    if (t < 0) return;
    const o = t + (s || 0);
    if (!(o < 0 || o > r.length - 1)) return r[o].name;
  };
  for (const n of N) {
    const s = P.get(n.name);
    s && n.pts.forEach((t, o) => {
      const e = vt(s.story, n.dz[o] ?? 0);
      e && _.add(Z(t, e));
    });
  }
  const St = /* @__PURE__ */ new Map();
  for (const n of _) {
    const [s, t] = n.split("@"), o = y.get(s), e = pt.get(t);
    if (o === void 0 || e === void 0) continue;
    H.push([o[0], o[1], e - (o[2] ?? 0)]), Dt.push(n), nt.set(n, H.length - 1);
    const a = J.get(n);
    a && St.set(H.length - 1, a);
  }
  const K = [], st = [], Tt = [], it = [], dt = /* @__PURE__ */ new Map(), Mt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
  for (const n of F) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((l) => l.name === o);
    if (e < 0) continue;
    const a = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const l = Math.min(e + n.nStories, r.length - 1);
      for (let d = l; d > e; d--) a.push(Z(n.pt1, r[d].name));
      a.push(Z(n.pt2, o));
    } else a.push(Z(n.pt1, o), Z(n.pt2, o));
    const c = a.map((l) => nt.get(l)).filter((l) => l !== void 0);
    if (c.length < 2) continue;
    const f = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let l = 0; l < c.length - 1; l++) {
      const d = c[l], m = c[l + 1];
      if (d === m) continue;
      const I = K.length;
      if (K.push([d, m]), st.push(c.length > 2 ? `${n.name}-${l + 1}` : n.name), Tt.push(n.type), it.push(o), dt.set(I, t.section), t.spring && Mt.set(I, t.spring), t.mallaEnCruces && xt.set(I, true), t.rigidZone > 0 && Et.set(I, [t.rigidZone, t.rigidZone]), t.angle && Gt.set(I, t.angle), t.offsets && rt.set(I, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const A = new Array(12).fill(false);
        for (const R of t.releases) {
          const O = f[R];
          O !== void 0 && (O < 6 && l !== 0 || O >= 6 && l !== c.length - 2 || (A[O] = true));
        }
        A.some(Boolean) && kt.set(I, A);
      }
    }
  }
  const ht = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Ot = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  let $t = 0;
  for (const [n, s] of dt) {
    const t = S.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    o && (ht.set(n, o.E), mt.set(n, o.G));
    const e = t.D, a = t.B, c = t.TF, f = t.TW;
    let l = 0, d = 0, m = 0, I = 0, A = 0, R = 0, O = "rect", D = 0, W = false, $ = false;
    const U = w.get(s);
    if (t.shape === "SD Section" && (U == null ? void 0 : U.length)) {
      const E = (o == null ? void 0 : o.E) || ((_k = p.get(t.material)) == null ? void 0 : _k.E) || 0, q = [];
      for (const v of U) {
        const lt = hs(v.shapeType, v.D, v.B, v.TF, v.TW);
        lt && q.push({ forma: lt, xc: v.XC, yc: v.YC, E: ((_l = p.get(v.material)) == null ? void 0 : _l.E) || E });
      }
      if (q.length) {
        const v = Es(q, E);
        v.A > 0 && (l = v.A, d = v.Iz, m = v.Iy, I = v.J, A = v.As2, R = v.As3, O = "rect", $ = true, $t++);
      }
    }
    if (!$) switch (t.shape) {
      case "Concrete Rectangular":
        l = e * a, d = a * e ** 3 / 12, m = e * a ** 3 / 12, I = a * e ** 3 * (1 / 3 - 0.21 * (e / a) * (1 - e ** 4 / (12 * a ** 4))), A = R = 5 / 6 * l, O = "rect";
        break;
      case "Concrete Circle":
        l = Math.PI * e ** 2 / 4, d = m = Math.PI * e ** 4 / 64, I = Math.PI * e ** 4 / 32, A = R = 0.9 * l, O = "circ";
        break;
      case "Steel I/Wide Flange": {
        const E = is(e, a, c, f);
        l = E.A, d = E.Iz, m = E.Iy, I = E.J, R = E.As2, A = E.As3, O = "I";
        break;
      }
      case "Steel Tube": {
        const E = cs(a, e, c || f, f || c);
        l = E.A, d = E.Iz, m = E.Iy, I = E.J, R = E.As2, A = E.As3, O = "HSS";
        break;
      }
      case "Filled Steel Pipe": {
        const E = (o == null ? void 0 : o.E) || 0, q = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (q == null ? void 0 : q.E) || E * 0.125, lt = t.T || f || c, V = ns(e, lt, E || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (q == null ? void 0 : q.nu) ?? 0.2);
        l = V.A, d = V.Iz, m = V.Iy, I = V.J, R = V.As2, A = V.As3, D = v, W = true, O = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const E = (o == null ? void 0 : o.E) || 0, q = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (q == null ? void 0 : q.E) || E * 0.125, V = os(a, e, f || c, E || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (q == null ? void 0 : q.nu) ?? 0.2);
        l = V.A, d = V.Iz, m = V.Iy, I = V.J, R = V.As2, A = V.As3, D = v, O = "CFT";
        break;
      }
      case "Steel Angle": {
        const E = c || f;
        l = E * (e + a - E), d = E * (e ** 3 + a * E ** 2 + E ** 2 * (e - E)) / 12, m = E * (a ** 3 + e * E ** 2 + E ** 2 * (a - E)) / 12, I = (e + a - E) * E ** 3 / 3, A = e * E, R = a * E, O = "L";
        break;
      }
      case "Steel Channel": {
        const E = as(e, a, c, f);
        l = E.A, d = E.Iz, m = E.Iy, I = E.J, R = E.As2, A = E.As3, O = "C";
        break;
      }
      case "Steel Double Angle": {
        const E = es(e, a, c, f, t.DIS || 0);
        l = E.A, d = E.Iz, m = E.Iy, I = E.J, R = E.As2, A = E.As3, O = "2L";
        break;
      }
      case "Cold Formed C":
        l = 2 * a * c + (e - 2 * c) * f, d = (f * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, m = (2 * c * a ** 3 + (e - 2 * c) * f ** 3) / 12, I = (2 * a * c ** 3 + (e - 2 * c) * f ** 3) / 3, A = (e - 2 * c) * f, R = 2 * a * c * 5 / 6, O = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        l = 2 * (2 * a * c + (e - 2 * c) * f), d = 2 * (f * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, m = 2 * (2 * c * a ** 3 + (e - 2 * c) * f ** 3) / 12, I = 2 * (2 * a * c ** 3 + (e - 2 * c) * f ** 3) / 3, A = 2 * (e - 2 * c) * f, R = 4 * a * c * 5 / 6, O = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          l = t.AREA, d = t.I33 ?? 0, m = t.I22 ?? 0, I = t.TORSION ?? 0, R = t.AS2 ?? 0, A = t.AS3 ?? 0, O = "general";
          break;
        }
      default:
        e > 0 && a > 0 && (l = e * a, d = a * e ** 3 / 12, m = e * a ** 3 / 12, I = Math.min(e, a) * Math.max(e, a) ** 3 / 3 * 0.3, A = R = 5 / 6 * l);
        break;
    }
    t.modI2 && (m *= t.modI2), t.modI3 && (d *= t.modI3), ut.set(n, l), Ot.set(n, d), yt.set(n, m), Lt.set(n, I), A > 0 && Nt.set(n, A), R > 0 && Rt.set(n, R), It.set(n, { type: O, ...D > 0 ? { fillE: D } : {}, b: W ? void 0 : a || void 0, h: W ? void 0 : e || void 0, d: O === "circ" || O === "pipe" || W ? e : void 0, tw: f || void 0, tf: c || void 0, r: t.R, name: s });
  }
  const gt = /* @__PURE__ */ new Map();
  for (const [n, s] of T) {
    const t = nt.get(n);
    if (t === void 0) continue;
    const o = [false, false, false, false, false, false];
    for (const e of s) e === "UX" && (o[0] = true), e === "UY" && (o[1] = true), e === "UZ" && (o[2] = true), e === "RX" && (o[3] = true), e === "RY" && (o[4] = true), e === "RZ" && (o[5] = true);
    gt.set(t, o);
  }
  const X = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map();
  for (let n = 0; n < st.length; n++) Bt.set(`${st[n]}@${it[n]}`, n);
  for (const n of C) {
    const s = Bt.get(`${n.line}@${n.story}`);
    if (s === void 0) continue;
    const [t, o] = K[s], e = H[t], a = H[o], c = Math.sqrt((a[0] - e[0]) ** 2 + (a[1] - e[1]) ** 2 + (a[2] - e[2]) ** 2);
    if (c < 1e-10) continue;
    const f = [0, 0, 0];
    n.dir === "GRAV" || n.dir === "GRAVITY" ? f[2] = -n.val : n.dir === "X" ? f[0] = n.val : n.dir === "Y" ? f[1] = n.val : n.dir === "Z" && (f[2] = n.val);
    const l = [(a[0] - e[0]) / c, (a[1] - e[1]) / c, (a[2] - e[2]) / c], d = c * c / 12, m = [l[1] * f[2] - l[2] * f[1], l[2] * f[0] - l[0] * f[2], l[0] * f[1] - l[1] * f[0]], I = (A, R) => {
      const O = X.get(A) || [0, 0, 0, 0, 0, 0];
      for (let D = 0; D < 6; D++) O[D] += R[D];
      X.set(A, O);
    };
    I(t, [f[0] * c / 2, f[1] * c / 2, f[2] * c / 2, d * m[0], d * m[1], d * m[2]]), I(o, [f[0] * c / 2, f[1] * c / 2, f[2] * c / 2, -d * m[0], -d * m[1], -d * m[2]]);
  }
  const at = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map();
  for (const [n, s] of dt) {
    const t = S.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    (o == null ? void 0 : o.density) && at.set(n, o.density);
  }
  const At = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map(), Ft = [], B = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of N) {
    const s = P.get(n.name);
    if (!s) {
      B.sinAssign++;
      continue;
    }
    const t = n.pts.map((c, f) => {
      const l = vt(s.story, n.dz[f] ?? 0);
      return l === void 0 ? void 0 : nt.get(Z(c, l));
    });
    if (t.some((c) => c === void 0)) {
      B.sinNudo++;
      continue;
    }
    const e = t.filter((c, f, l) => l.indexOf(c) === f);
    if (e.length < 3) {
      B.colapsada++;
      continue;
    }
    const a = e.length <= 4 ? [e.length === 3 ? e : t.slice(0, 4)] : ms(e, H);
    if (!a.length) {
      B.poligono++;
      continue;
    }
    for (const c of a) {
      const f = K.length;
      K.push(c), st.push(n.name), Tt.push(n.tipo), it.push(s.story), Ft.push(n.name), s.spring && Mt.set(f, s.spring);
      const l = L.get(s.section);
      if (l) {
        At.set(f, l.t);
        const d = p.get(l.material);
        if ((d == null ? void 0 : d.E) && ht.set(f, d.E), (d == null ? void 0 : d.G) && mt.set(f, d.G), (d == null ? void 0 : d.nu) !== void 0 && Ut.set(f, d.nu), (d == null ? void 0 : d.density) && at.set(f, d.density), l.deck && l.deck.tc > 0) {
          const A = l.deck, R = A.tc + (A.sr > 0 ? A.hr * (A.wrt + A.wrb) / 2 / A.sr : 0);
          at.set(f, (((d == null ? void 0 : d.density) ?? 0) * R + A.w) / A.tc), Ct.set(f, { ...A });
        }
        const m = /membrane/i.test(l.modeling);
        Yt.set(f, /thick/i.test(l.modeling) || m ? 0 : 1);
        const I = l.mods ? l.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
        m && (I[3] = 0, I[4] = 0, I[5] = 0, I[6] = 0, I[7] = 0), (l.mods || m) && zt.set(f, I);
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
  let Ht = 0, Wt = 0, Vt = 0, Jt = 0;
  for (const n of b) {
    const s = ct.get(`${n.area}@${n.story}`) ?? ct.get(`${n.area}@`), t = s !== void 0 ? s : (_m = [...ct].find(([e]) => e.startsWith(n.area + "@"))) == null ? void 0 : _m[1];
    if (t === void 0) {
      Wt++;
      continue;
    }
    let o = false;
    for (const e of t) {
      const a = K[e], c = a.map(($) => H[$]).filter(Boolean);
      if (c.length < 3) continue;
      let f = 0, l = 0, d = 0;
      for (let $ = 0; $ < c.length; $++) {
        const U = c[$], E = c[($ + 1) % c.length];
        f += U[1] * E[2] - U[2] * E[1], l += U[2] * E[0] - U[0] * E[2], d += U[0] * E[1] - U[1] * E[0];
      }
      const m = Math.hypot(f, l, d) / 2;
      if (!(m > 0)) continue;
      const I = n.tipo === "UNIFLOADSET" ? z.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
      let A = 0;
      for (const $ of I) A += $.val;
      if (!A) {
        o || Vt++, o = true;
        break;
      }
      o || Jt++, o = true;
      const R = A * m / c.length;
      Ht += A * m;
      let O = 0, D = 0, W = 0;
      n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? W = -R : n.dir === "X" ? O = R : n.dir === "Y" && (D = R);
      for (const $ of a) {
        const U = X.get($) || [0, 0, 0, 0, 0, 0];
        U[0] += O, U[1] += D, U[2] += W, X.set($, U);
      }
    }
  }
  b.length && console.info(`[e2kParser] cargas de losa: ${Jt} aplicadas \xB7 ${Wt} sin area que las lleve \xB7 ${Vt} sin valor \xB7 total ${Ht.toFixed(0)} (unidades del fichero) \xB7 ${z.size} juegos con nombre`);
  const Zt = B.sinAssign + B.sinNudo + B.colapsada + B.poligono;
  if (Zt) {
    const n = [B.poligono && `${B.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, B.sinAssign && `${B.sinAssign} sin AREAASSIGN`, B.sinNudo && `${B.sinNudo} con algun nudo que no resuelve a planta`, B.colapsada && `${B.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${Zt} de ${N.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const Qt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, _t = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, u = Qt[(i.length || "M").toUpperCase()] ?? 1, Y = _t[(i.force || "KN").toUpperCase()] ?? 1;
  if (u !== 1 || Y !== 1) {
    const n = (s, t) => {
      if (s) for (const [o, e] of s) s.set(o, e * t);
    };
    for (const s of H) s[0] *= u, s[1] *= u, s[2] *= u;
    for (const s of r) s.height *= u, s.elev *= u;
    for (const s of et) s.coord *= u;
    for (const s of ot) s.z *= u;
    n(At, u), n(ut, u * u);
    for (const s of k.values()) {
      const t = s.tipo === "point" ? Y / u : s.tipo === "line" ? Y / (u * u) : Y / (u * u * u);
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? t : s.tipo === "point" ? Y * u : Y;
    }
    n(Nt, u * u), n(Rt, u * u), n(yt, u ** 4), n(Ot, u ** 4), n(Lt, u ** 4), n(ht, Y / (u * u)), n(mt, Y / (u * u)), n(at, Y / u ** 3);
    for (const s of Ct.values()) s.tc *= u, s.hr *= u, s.wrt *= u, s.wrb *= u, s.sr *= u, s.w *= Y / (u * u);
    for (const [s, t] of Et) Et.set(s, [t[0] * u, t[1] * u]);
    for (const [s, t] of rt) rt.set(s, [t[0] * u, t[1] * u, t[2]]);
    for (const [s, t] of X) X.set(s, t.map((o, e) => o * (e < 3 ? Y : Y * u)));
    for (const [, s] of k) {
      const t = s.tipo === "point" ? 1 : s.tipo === "line" ? 2 : 3;
      for (let o = 0; o < 6; o++) s.k[o] *= o < 3 ? Y / u ** t : Y * u / u ** (t - 1);
    }
    for (const [, s] of It) {
      for (const t of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const o = s;
        typeof o[t] == "number" && (o[t] *= u);
      }
      typeof s.fillE == "number" && (s.fillE *= Y / (u * u));
    }
  }
  {
    const n = Kt(K, gt);
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
        const c = ut.get(o) ?? 0, f = H[a[0]], l = H[a[1]], d = rt.get(o), m = l[0] - f[0], I = l[1] - f[1], A = l[2] - f[2], R = Math.hypot(m, I), O = R > 1e-9 && Math.atan2(Math.abs(A), R) * 180 / Math.PI < 20, D = Math.max(0, Math.hypot(m, I, A) - (d && O ? d[0] + d[1] : 0)), W = e * c * D * Q;
        s(a[0], -W / 2), s(a[1], -W / 2);
      } else if (a.length >= 3) {
        const c = At.get(o) ?? 0, f = a.map((R) => H[R]);
        let l = 0, d = 0, m = 0;
        for (let R = 0; R < f.length; R++) {
          const O = f[R], D = f[(R + 1) % f.length];
          l += O[1] * D[2] - O[2] * D[1], d += O[2] * D[0] - O[0] * D[2], m += O[0] * D[1] - O[1] * D[0];
        }
        const I = Math.hypot(l, d, m) / 2, A = e * c * I * Q;
        for (const R of a) s(R, -A / a.length);
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
  return { units: i, stories: r.reverse(), materials: p, frameSections: S, nodes: H, nodeNames: Dt, nodeNameToIdx: nt, elements: K, elementNames: st, elementTypes: Tt, elementStories: it, elementSections: dt, nodeInputs: { supports: gt, loads: ts(), springNames: St, springs: ss() }, elementInputs: { elasticities: ht, shearModuli: mt, areas: ut, momentsOfInertiaZ: Ot, momentsOfInertiaY: yt, torsionalConstants: Lt, shearAreasY: Nt, shearAreasZ: Rt, rigidOffsets: Et, momentReleases: kt, localAngles: Gt, endOffsets: rt, densities: new Map([...at].map(([n, s]) => [n, s / 9.80665])), deckSections: Ct, sectionShapes: It, thicknesses: At, poissonsRatios: Ut, plateFormulations: Yt, shellModifiers: zt, springNames: Mt, mallaEnCruces: xt }, sectionShapes: It, grids: et, planosRef: ot, springProps: k, info: { ...Kt(K, gt), nNodes: H.length, nFrames: K.length - Ft.length, nAreas: N.length, nAreasMontadas: Ft.length, nSDCompuestas: $t, nSDLeidas: w.size, title: tt }, rawSections: ft };
}
function ms(h, g) {
  const i = h.length;
  if (i < 3) return [];
  const r = [0, 0, 0];
  for (let M = 0; M < i; M++) {
    const C = g[h[M]], b = g[h[(M + 1) % i]];
    r[0] += (C[1] - b[1]) * (C[2] + b[2]), r[1] += (C[2] - b[2]) * (C[0] + b[0]), r[2] += (C[0] - b[0]) * (C[1] + b[1]);
  }
  const p = [Math.abs(r[0]), Math.abs(r[1]), Math.abs(r[2])], S = p[2] >= p[0] && p[2] >= p[1] ? 2 : p[1] >= p[0] ? 1 : 0, [y, F] = S === 2 ? [0, 1] : S === 1 ? [2, 0] : [1, 2], N = h.map((M) => [g[M][y], g[M][F]]);
  let P = 0;
  for (let M = 0; M < i; M++) P += N[M][0] * N[(M + 1) % i][1] - N[(M + 1) % i][0] * N[M][1];
  if (Math.abs(P) < 1e-12) return [];
  const L = [...Array(i).keys()];
  P < 0 && L.reverse();
  const w = (M, C, b) => (C[0] - M[0]) * (b[1] - M[1]) - (C[1] - M[1]) * (b[0] - M[0]), T = (M, C) => Math.abs(M[0] - C[0]) < 1e-9 && Math.abs(M[1] - C[1]) < 1e-9, G = (M, C, b, z) => !T(M, C) && !T(M, b) && !T(M, z) && w(C, b, M) >= -1e-12 && w(b, z, M) >= -1e-12 && w(z, C, M) >= -1e-12, k = [];
  let J = 0;
  for (; L.length > 3 && J++ < 10 * i; ) {
    let M = false;
    for (let C = 0; C < L.length; C++) {
      const b = L[(C + L.length - 1) % L.length], z = L[C], j = L[(C + 1) % L.length], Q = N[b], et = N[z], ot = N[j];
      if (!(w(Q, et, ot) <= 1e-12) && !L.some((tt) => tt !== b && tt !== z && tt !== j && G(N[tt], Q, et, ot))) {
        k.push(P < 0 ? [h[j], h[z], h[b]] : [h[b], h[z], h[j]]), L.splice(C, 1), M = true;
        break;
      }
    }
    if (!M) return [];
  }
  if (L.length === 3) {
    const [M, C, b] = L;
    k.push(P < 0 ? [h[b], h[C], h[M]] : [h[M], h[C], h[b]]);
  }
  return k;
}
function Kt(h, g) {
  const i = /* @__PURE__ */ new Map();
  for (const N of h) for (const P of N) for (const L of N) P !== L && (i.has(P) || i.set(P, []), i.get(P).push(L));
  const r = /* @__PURE__ */ new Set();
  for (const N of h) for (const P of N) r.add(P);
  const p = new Set([...g ?? /* @__PURE__ */ new Map()].map(([N]) => N)), S = /* @__PURE__ */ new Set();
  let y = 0, F = 0;
  for (const N of r) {
    if (S.has(N)) continue;
    const P = [N], L = [];
    for (S.add(N); P.length; ) {
      const w = P.pop();
      L.push(w);
      for (const T of i.get(w) ?? []) S.has(T) || (S.add(T), P.push(T));
    }
    L.some((w) => p.has(w)) || (y++, F += L.length);
  }
  return { nPiezasFlotantes: y, nNudosFlotantes: F };
}
export {
  Kt as a,
  Is as p
};
