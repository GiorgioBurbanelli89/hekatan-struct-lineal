import { a as es, c as os, t as ns, i as as } from "./cadSections-CAjAf4am.js";
const wt = 64, cs = (E) => E * Math.PI / 180;
function bt(E, u = wt) {
  switch (E.tipo) {
    case "rect": {
      const { d: i, b: r } = E;
      return [[-r / 2, -i / 2], [r / 2, -i / 2], [r / 2, i / 2], [-r / 2, i / 2]];
    }
    case "circle": {
      const i = E.d / 2, r = [];
      for (let p = 0; p < u; p++) {
        const A = 2 * Math.PI * p / u;
        r.push([i * Math.cos(A), i * Math.sin(A)]);
      }
      return r;
    }
    case "angle": {
      const { d: i, b: r, tf: p, tw: A } = E;
      return [[0, 0], [r, 0], [r, p], [A, p], [A, i], [0, i]].map(([y, F]) => [y - r / 2, F - i / 2]);
    }
    case "channel": {
      const { d: i, b: r, tf: p, tw: A } = E;
      return [[0, 0], [r, 0], [r, p], [A, p], [A, i - p], [r, i - p], [r, i], [0, i]].map(([y, F]) => [y - r / 2, F - i / 2]);
    }
    case "tee": {
      const { d: i, b: r, tf: p, tw: A } = E, y = (r - A) / 2;
      return [[0, i - p], [r, i - p], [r, i], [0, i]].concat([]) && [[y, 0], [y + A, 0], [y + A, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [y, i - p]].map(([F, N]) => [F - r / 2, N - i / 2]);
    }
    case "isection": {
      const { d: i, b: r, tf: p, tw: A } = E, y = (r - A) / 2;
      return [[0, 0], [r, 0], [r, p], [y + A, p], [y + A, i - p], [r, i - p], [r, i], [0, i], [0, i - p], [y, i - p], [y, p], [0, p]].map(([F, N]) => [F - r / 2, N - i / 2]);
    }
    case "polygon":
      return E.puntos.slice();
    default:
      return [];
  }
}
function is(E, u = wt) {
  if (E.tipo === "tube") {
    const { d: i, b: r, tf: p, tw: A } = E, y = i / 2 - p, F = r / 2 - A;
    return [[[-F, -y], [-F, y], [F, y], [F, -y]]];
  }
  if (E.tipo === "pipe") {
    const i = E.d / 2 - E.t, r = [];
    for (let p = u - 1; p >= 0; p--) {
      const A = 2 * Math.PI * p / u;
      r.push([i * Math.cos(A), i * Math.sin(A)]);
    }
    return [r];
  }
  return [];
}
function rs(E, u = wt) {
  return E.tipo === "tube" ? bt({ tipo: "rect", d: E.d, b: E.b }) : E.tipo === "pipe" ? bt({ tipo: "circle", d: E.d }, u) : bt(E, u);
}
function ls(E) {
  let u = 0, i = 0, r = 0, p = 0, A = 0, y = 0;
  for (let P = 0; P < E.length; P++) {
    const [L, w] = E[P], [T, G] = E[(P + 1) % E.length], k = L * G - T * w;
    u += k, i += (L + T) * k, r += (w + G) * k, p += (w * w + w * G + G * G) * k, A += (L * L + L * T + T * T) * k, y += (L * G + 2 * L * w + 2 * T * G + T * w) * k;
  }
  if (u /= 2, Math.abs(u) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const F = i / (6 * u), N = r / (6 * u);
  return { A: u, cx: F, cy: N, Ixx: p / 12 - u * N * N, Iyy: A / 12 - u * F * F, Ixy: y / 24 - u * F * N };
}
function fs(E, u) {
  const i = cs(u.rot ?? 0), r = Math.cos(i), p = Math.sin(i), A = u.mirror ? -1 : 1, y = E.map(([F, N]) => {
    const P = F * A;
    return [P * r - N * p + (u.xc ?? 0), P * p + N * r + (u.yc ?? 0)];
  });
  return u.mirror ? y.reverse() : y;
}
function ps(E, u) {
  let i = 0, r = 0, p = 0;
  const A = [];
  for (const T of E) {
    const G = u > 0 && T.E ? T.E / u : 1;
    if (T.forma.tipo === "rebar") {
      const Z = T.forma.area * G;
      A.push({ A: Z, cx: T.xc ?? 0, cy: T.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), i += Z, r += Z * (T.xc ?? 0), p += Z * (T.yc ?? 0);
      continue;
    }
    const k = [rs(T.forma), ...is(T.forma)];
    for (const Z of k) {
      if (Z.length < 3) continue;
      const S = ls(fs(Z, T)), C = S.A * G;
      A.push({ ...S, A: C, n: G }), i += C, r += C * S.cx, p += C * S.cy;
    }
  }
  if (Math.abs(i) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: E.length };
  const y = r / i, F = p / i;
  let N = 0, P = 0, L = 0;
  for (const T of A) N += T.Ixx * T.n + T.A * (T.cy - F) ** 2, P += T.Iyy * T.n + T.A * (T.cx - y) ** 2, L += T.Ixy * T.n + T.A * (T.cx - y) * (T.cy - F);
  const w = (N + P) * 0.1;
  return { A: i, Iz: N, Iy: P, Ixy: L, J: w, cx: y, cy: F, As2: 5 / 6 * i, As3: 5 / 6 * i, nPiezas: E.length };
}
function ds(E, u, i, r, p) {
  switch ((E || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":
      return { tipo: "rect", d: u, b: i };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":
      return { tipo: "circle", d: u };
    case "STEEL ANGLE":
    case "ANGLE":
      return { tipo: "angle", d: u, b: i, tf: r, tw: p };
    case "STEEL CHANNEL":
    case "CHANNEL":
      return { tipo: "channel", d: u, b: i, tf: r, tw: p };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":
      return { tipo: "tee", d: u, b: i, tf: r, tw: p };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":
      return { tipo: "isection", d: u, b: i, tf: r, tw: p };
    case "STEEL TUBE":
    case "TUBE":
      return { tipo: "tube", d: u, b: i, tf: r, tw: p };
    case "STEEL PIPE":
    case "PIPE":
      return { tipo: "pipe", d: u, t: r || p };
    default:
      return u > 0 && i > 0 ? { tipo: "rect", d: u, b: i } : null;
  }
}
function ms(E) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const u = E.split(/\r?\n/), i = { force: "TONF", length: "M" }, r = [], p = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), F = [], N = [], P = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Set(), C = [], b = [], H = /* @__PURE__ */ new Map(), q = [];
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
        A.has(o) || A.set(o, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const e = A.get(o), a = s.match(/MATERIAL\s+"([^"]+)"/);
        a && (e.material = a[1]);
        const c = s.match(/SHAPE\s+"([^"]+)"/);
        c && (e.shape = c[1]);
        const f = s.match(/\bD\s+([\d.eE+-]+)/);
        f && (e.D = parseFloat(f[1]));
        const l = s.match(/\bB\s+([\d.eE+-]+)/);
        l && (e.B = parseFloat(l[1]));
        const d = s.match(/\bTF\s+([\d.eE+-]+)/);
        d && (e.TF = parseFloat(d[1]));
        const h = s.match(/\bTW\s+([\d.eE+-]+)/);
        h && (e.TW = parseFloat(h[1]));
        const g = s.match(/\bR\s+([\d.eE+-]+)/);
        g && (e.R = parseFloat(g[1]));
        const M = s.match(/FILLMATERIAL\s+"([^"]+)"/);
        M && (e.fillMaterial = M[1]);
        const R = s.match(/I2MOD\s+([\d.eE+-]+)/);
        R && (e.modI2 = parseFloat(R[1]));
        const O = s.match(/I3MOD\s+([\d.eE+-]+)/);
        O && (e.modI3 = parseFloat(O[1]));
        for (const [B, U] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const I = s.match(U);
          I && (e[B] = parseFloat(I[1]));
        }
        const D = s.match(/\bT\s+([\d.eE+-]+)/);
        D && !e.TF && !e.TW && (e.TF = parseFloat(D[1]), e.TW = parseFloat(D[1]));
        const W = s.match(/\bLIP\s+([\d.eE+-]+)/);
        W && (e.LIP = parseFloat(W[1]));
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
      o && S.add(`${o[1]}@${o[2]}`);
      const e = s.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      e && Z.set(`${e[1]}@${e[2]}`, e[3]);
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
        const o = (h) => {
          const g = s.match(h);
          return g ? parseFloat(g[1]) : void 0;
        }, e = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? o(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? o(/DECKSLABDEPTH\s+([\d.eE+-]+)/), c = /PROPTYPE\s+"Deck"/.test(s) ? { tc: o(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: o(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: o(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: o(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: o(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: o(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, l = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((h) => o(new RegExp(h + "\\s+([\\d.eE+-]+)"))), d = L.get(t);
        if (l.some((h) => h !== void 0)) {
          const h = l.map((g) => g ?? 1);
          L.set(t, { t: (d == null ? void 0 : d.t) ?? 0, material: (d == null ? void 0 : d.material) ?? "", modeling: (d == null ? void 0 : d.modeling) ?? "ShellThin", mods: h, deck: d == null ? void 0 : d.deck });
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
  const z = [], Dt = [], nt = /* @__PURE__ */ new Map(), J = (n, s) => `${n}@${s}`, Q = /* @__PURE__ */ new Set(), jt = /* @__PURE__ */ new Map();
  for (const n of F) jt.set(n.name, n);
  for (const n of F) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((a) => a.name === o);
    if (!(e < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      Q.add(J(n.pt2, o));
      const a = Math.min(e + n.nStories, r.length - 1);
      Q.add(J(n.pt1, r[a].name));
      for (let c = e + 1; c < a; c++) Q.add(J(n.pt1, r[c].name));
    } else Q.add(J(n.pt1, o)), Q.add(J(n.pt2, o));
  }
  for (const [n] of T) Q.add(n);
  for (const n of S) Q.add(n);
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
      e && Q.add(J(t, e));
    });
  }
  const Tt = /* @__PURE__ */ new Map();
  for (const n of Q) {
    const [s, t] = n.split("@"), o = y.get(s), e = pt.get(t);
    if (o === void 0 || e === void 0) continue;
    z.push([o[0], o[1], e - (o[2] ?? 0)]), Dt.push(n), nt.set(n, z.length - 1);
    const a = Z.get(n);
    a && Tt.set(z.length - 1, a);
  }
  const K = [], st = [], Mt = [], it = [], dt = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), Et = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
  for (const n of F) for (const [s, t] of G) {
    if (!s.startsWith(n.name + "@")) continue;
    const o = t.story, e = r.findIndex((l) => l.name === o);
    if (e < 0) continue;
    const a = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const l = Math.min(e + n.nStories, r.length - 1);
      for (let d = l; d > e; d--) a.push(J(n.pt1, r[d].name));
      a.push(J(n.pt2, o));
    } else a.push(J(n.pt1, o), J(n.pt2, o));
    const c = a.map((l) => nt.get(l)).filter((l) => l !== void 0);
    if (c.length < 2) continue;
    const f = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let l = 0; l < c.length - 1; l++) {
      const d = c[l], h = c[l + 1];
      if (d === h) continue;
      const g = K.length;
      if (K.push([d, h]), st.push(c.length > 2 ? `${n.name}-${l + 1}` : n.name), Mt.push(n.type), it.push(o), dt.set(g, t.section), t.spring && St.set(g, t.spring), t.mallaEnCruces && xt.set(g, true), t.rigidZone > 0 && Et.set(g, [t.rigidZone, t.rigidZone]), t.angle && Gt.set(g, t.angle), t.offsets && rt.set(g, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const M = new Array(12).fill(false);
        for (const R of t.releases) {
          const O = f[R];
          O !== void 0 && (O < 6 && l !== 0 || O >= 6 && l !== c.length - 2 || (M[O] = true));
        }
        M.some(Boolean) && kt.set(g, M);
      }
    }
  }
  const ht = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), Ot = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map(), Lt = /* @__PURE__ */ new Map(), It = /* @__PURE__ */ new Map();
  let $t = 0;
  for (const [n, s] of dt) {
    const t = A.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    o && (ht.set(n, o.E), mt.set(n, o.G));
    const e = t.D, a = t.B, c = t.TF, f = t.TW;
    let l = 0, d = 0, h = 0, g = 0, M = 0, R = 0, O = "rect", D = 0, W = false, B = false;
    const U = w.get(s);
    if (t.shape === "SD Section" && (U == null ? void 0 : U.length)) {
      const I = (o == null ? void 0 : o.E) || ((_k = p.get(t.material)) == null ? void 0 : _k.E) || 0, _ = [];
      for (const v of U) {
        const lt = ds(v.shapeType, v.D, v.B, v.TF, v.TW);
        lt && _.push({ forma: lt, xc: v.XC, yc: v.YC, E: ((_l = p.get(v.material)) == null ? void 0 : _l.E) || I });
      }
      if (_.length) {
        const v = ps(_, I);
        v.A > 0 && (l = v.A, d = v.Iz, h = v.Iy, g = v.J, M = v.As2, R = v.As3, O = "rect", B = true, $t++);
      }
    }
    if (!B) switch (t.shape) {
      case "Concrete Rectangular":
        l = e * a, d = a * e ** 3 / 12, h = e * a ** 3 / 12, g = a * e ** 3 * (1 / 3 - 0.21 * (e / a) * (1 - e ** 4 / (12 * a ** 4))), M = R = 5 / 6 * l, O = "rect";
        break;
      case "Concrete Circle":
        l = Math.PI * e ** 2 / 4, d = h = Math.PI * e ** 4 / 64, g = Math.PI * e ** 4 / 32, M = R = 0.9 * l, O = "circ";
        break;
      case "Steel I/Wide Flange": {
        const I = as(e, a, c, f);
        l = I.A, d = I.Iz, h = I.Iy, g = I.J, R = I.As2, M = I.As3, O = "I";
        break;
      }
      case "Steel Tube": {
        const I = ns(a, e, c || f, f || c);
        l = I.A, d = I.Iz, h = I.Iy, g = I.J, R = I.As2, M = I.As3, O = "HSS";
        break;
      }
      case "Filled Steel Pipe": {
        const I = (o == null ? void 0 : o.E) || 0, _ = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (_ == null ? void 0 : _.E) || I * 0.125, lt = t.T || f || c, V = os(e, lt, I || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (_ == null ? void 0 : _.nu) ?? 0.2);
        l = V.A, d = V.Iz, h = V.Iy, g = V.J, R = V.As2, M = V.As3, D = v, W = true, O = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const I = (o == null ? void 0 : o.E) || 0, _ = t.fillMaterial ? p.get(t.fillMaterial) : void 0, v = (_ == null ? void 0 : _.E) || I * 0.125, V = es(a, e, f || c, I || 1, (o == null ? void 0 : o.nu) ?? 0.3, v || 0.125, (_ == null ? void 0 : _.nu) ?? 0.2);
        l = V.A, d = V.Iz, h = V.Iy, g = V.J, R = V.As2, M = V.As3, D = v, O = "CFT";
        break;
      }
      case "Steel Angle": {
        const I = c || f;
        l = I * (e + a - I), d = I * (e ** 3 + a * I ** 2 + I ** 2 * (e - I)) / 12, h = I * (a ** 3 + e * I ** 2 + I ** 2 * (a - I)) / 12, g = (e + a - I) * I ** 3 / 3, M = e * I, R = a * I, O = "L";
        break;
      }
      case "Steel Channel":
      case "Cold Formed C":
        l = 2 * a * c + (e - 2 * c) * f, d = (f * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, h = (2 * c * a ** 3 + (e - 2 * c) * f ** 3) / 12, g = (2 * a * c ** 3 + (e - 2 * c) * f ** 3) / 3, M = (e - 2 * c) * f, R = 2 * a * c * 5 / 6, O = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        l = 2 * (2 * a * c + (e - 2 * c) * f), d = 2 * (f * e ** 3 + 2 * a * c * (e - c) ** 2) / 12, h = 2 * (2 * c * a ** 3 + (e - 2 * c) * f ** 3) / 12, g = 2 * (2 * a * c ** 3 + (e - 2 * c) * f ** 3) / 3, M = 2 * (e - 2 * c) * f, R = 4 * a * c * 5 / 6, O = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          l = t.AREA, d = t.I33 ?? 0, h = t.I22 ?? 0, g = t.TORSION ?? 0, R = t.AS2 ?? 0, M = t.AS3 ?? 0, O = "general";
          break;
        }
      default:
        e > 0 && a > 0 && (l = e * a, d = a * e ** 3 / 12, h = e * a ** 3 / 12, g = Math.min(e, a) * Math.max(e, a) ** 3 / 3 * 0.3, M = R = 5 / 6 * l);
        break;
    }
    t.modI2 && (h *= t.modI2), t.modI3 && (d *= t.modI3), ut.set(n, l), Ot.set(n, d), yt.set(n, h), Lt.set(n, g), M > 0 && Nt.set(n, M), R > 0 && Rt.set(n, R), It.set(n, { type: O, ...D > 0 ? { fillE: D } : {}, b: W ? void 0 : a || void 0, h: W ? void 0 : e || void 0, d: O === "circ" || O === "pipe" || W ? e : void 0, tw: f || void 0, tf: c || void 0, r: t.R, name: s });
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
    const [t, o] = K[s], e = z[t], a = z[o], c = Math.sqrt((a[0] - e[0]) ** 2 + (a[1] - e[1]) ** 2 + (a[2] - e[2]) ** 2);
    if (c < 1e-10) continue;
    const f = [0, 0, 0];
    n.dir === "GRAV" || n.dir === "GRAVITY" ? f[2] = -n.val : n.dir === "X" ? f[0] = n.val : n.dir === "Y" ? f[1] = n.val : n.dir === "Z" && (f[2] = n.val);
    const l = [(a[0] - e[0]) / c, (a[1] - e[1]) / c, (a[2] - e[2]) / c], d = c * c / 12, h = [l[1] * f[2] - l[2] * f[1], l[2] * f[0] - l[0] * f[2], l[0] * f[1] - l[1] * f[0]], g = (M, R) => {
      const O = X.get(M) || [0, 0, 0, 0, 0, 0];
      for (let D = 0; D < 6; D++) O[D] += R[D];
      X.set(M, O);
    };
    g(t, [f[0] * c / 2, f[1] * c / 2, f[2] * c / 2, d * h[0], d * h[1], d * h[2]]), g(o, [f[0] * c / 2, f[1] * c / 2, f[2] * c / 2, -d * h[0], -d * h[1], -d * h[2]]);
  }
  const at = /* @__PURE__ */ new Map(), Ct = /* @__PURE__ */ new Map();
  for (const [n, s] of dt) {
    const t = A.get(s);
    if (!t) continue;
    const o = p.get(t.material);
    (o == null ? void 0 : o.density) && at.set(n, o.density);
  }
  const At = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new Map(), Ft = [], $ = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of N) {
    const s = P.get(n.name);
    if (!s) {
      $.sinAssign++;
      continue;
    }
    const t = n.pts.map((c, f) => {
      const l = vt(s.story, n.dz[f] ?? 0);
      return l === void 0 ? void 0 : nt.get(J(c, l));
    });
    if (t.some((c) => c === void 0)) {
      $.sinNudo++;
      continue;
    }
    const e = t.filter((c, f, l) => l.indexOf(c) === f);
    if (e.length < 3) {
      $.colapsada++;
      continue;
    }
    const a = e.length <= 4 ? [e.length === 3 ? e : t.slice(0, 4)] : Es(e, z);
    if (!a.length) {
      $.poligono++;
      continue;
    }
    for (const c of a) {
      const f = K.length;
      K.push(c), st.push(n.name), Mt.push(n.tipo), it.push(s.story), Ft.push(n.name), s.spring && St.set(f, s.spring);
      const l = L.get(s.section);
      if (l) {
        At.set(f, l.t);
        const d = p.get(l.material);
        if ((d == null ? void 0 : d.E) && ht.set(f, d.E), (d == null ? void 0 : d.G) && mt.set(f, d.G), (d == null ? void 0 : d.nu) !== void 0 && Ut.set(f, d.nu), (d == null ? void 0 : d.density) && at.set(f, d.density), l.deck && l.deck.tc > 0) {
          const M = l.deck, R = M.tc + (M.sr > 0 ? M.hr * (M.wrt + M.wrb) / 2 / M.sr : 0);
          at.set(f, (((d == null ? void 0 : d.density) ?? 0) * R + M.w) / M.tc), Ct.set(f, { ...M });
        }
        const h = /membrane/i.test(l.modeling);
        Yt.set(f, /thick/i.test(l.modeling) || h ? 0 : 1);
        const g = l.mods ? l.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
        h && (g[3] = 0, g[4] = 0, g[5] = 0, g[6] = 0, g[7] = 0), (l.mods || h) && Ht.set(f, g);
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
  let zt = 0, Wt = 0, Vt = 0, Zt = 0;
  for (const n of b) {
    const s = ct.get(`${n.area}@${n.story}`) ?? ct.get(`${n.area}@`), t = s !== void 0 ? s : (_m = [...ct].find(([e]) => e.startsWith(n.area + "@"))) == null ? void 0 : _m[1];
    if (t === void 0) {
      Wt++;
      continue;
    }
    let o = false;
    for (const e of t) {
      const a = K[e], c = a.map((B) => z[B]).filter(Boolean);
      if (c.length < 3) continue;
      let f = 0, l = 0, d = 0;
      for (let B = 0; B < c.length; B++) {
        const U = c[B], I = c[(B + 1) % c.length];
        f += U[1] * I[2] - U[2] * I[1], l += U[2] * I[0] - U[0] * I[2], d += U[0] * I[1] - U[1] * I[0];
      }
      const h = Math.hypot(f, l, d) / 2;
      if (!(h > 0)) continue;
      const g = n.tipo === "UNIFLOADSET" ? H.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
      let M = 0;
      for (const B of g) M += B.val;
      if (!M) {
        o || Vt++, o = true;
        break;
      }
      o || Zt++, o = true;
      const R = M * h / c.length;
      zt += M * h;
      let O = 0, D = 0, W = 0;
      n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? W = -R : n.dir === "X" ? O = R : n.dir === "Y" && (D = R);
      for (const B of a) {
        const U = X.get(B) || [0, 0, 0, 0, 0, 0];
        U[0] += O, U[1] += D, U[2] += W, X.set(B, U);
      }
    }
  }
  b.length && console.info(`[e2kParser] cargas de losa: ${Zt} aplicadas \xB7 ${Wt} sin area que las lleve \xB7 ${Vt} sin valor \xB7 total ${zt.toFixed(0)} (unidades del fichero) \xB7 ${H.size} juegos con nombre`);
  const Jt = $.sinAssign + $.sinNudo + $.colapsada + $.poligono;
  if (Jt) {
    const n = [$.poligono && `${$.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, $.sinAssign && `${$.sinAssign} sin AREAASSIGN`, $.sinNudo && `${$.sinNudo} con algun nudo que no resuelve a planta`, $.colapsada && `${$.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${Jt} de ${N.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const Qt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, _t = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, m = Qt[(i.length || "M").toUpperCase()] ?? 1, Y = _t[(i.force || "KN").toUpperCase()] ?? 1;
  if (m !== 1 || Y !== 1) {
    const n = (s, t) => {
      if (s) for (const [o, e] of s) s.set(o, e * t);
    };
    for (const s of z) s[0] *= m, s[1] *= m, s[2] *= m;
    for (const s of r) s.height *= m, s.elev *= m;
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
        const c = ut.get(o) ?? 0, f = z[a[0]], l = z[a[1]], d = rt.get(o), h = l[0] - f[0], g = l[1] - f[1], M = l[2] - f[2], R = Math.hypot(h, g), O = R > 1e-9 && Math.atan2(Math.abs(M), R) * 180 / Math.PI < 20, D = Math.max(0, Math.hypot(h, g, M) - (d && O ? d[0] + d[1] : 0)), W = e * c * D * j;
        s(a[0], -W / 2), s(a[1], -W / 2);
      } else if (a.length >= 3) {
        const c = At.get(o) ?? 0, f = a.map((R) => z[R]);
        let l = 0, d = 0, h = 0;
        for (let R = 0; R < f.length; R++) {
          const O = f[R], D = f[(R + 1) % f.length];
          l += O[1] * D[2] - O[2] * D[1], d += O[2] * D[0] - O[0] * D[2], h += O[0] * D[1] - O[1] * D[0];
        }
        const g = Math.hypot(l, d, h) / 2, M = e * c * g * j;
        for (const R of a) s(R, -M / a.length);
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
  return { units: i, stories: r.reverse(), materials: p, frameSections: A, nodes: z, nodeNames: Dt, nodeNameToIdx: nt, elements: K, elementNames: st, elementTypes: Mt, elementStories: it, elementSections: dt, nodeInputs: { supports: gt, loads: ts(), springNames: Tt, springs: ss() }, elementInputs: { elasticities: ht, shearModuli: mt, areas: ut, momentsOfInertiaZ: Ot, momentsOfInertiaY: yt, torsionalConstants: Lt, shearAreasY: Nt, shearAreasZ: Rt, rigidOffsets: Et, momentReleases: kt, localAngles: Gt, endOffsets: rt, densities: new Map([...at].map(([n, s]) => [n, s / 9.80665])), deckSections: Ct, sectionShapes: It, thicknesses: At, poissonsRatios: Ut, plateFormulations: Yt, shellModifiers: Ht, springNames: St, mallaEnCruces: xt }, sectionShapes: It, grids: et, planosRef: ot, springProps: k, info: { ...Kt(K, gt), nNodes: z.length, nFrames: K.length - Ft.length, nAreas: N.length, nAreasMontadas: Ft.length, nSDCompuestas: $t, nSDLeidas: w.size, title: tt }, rawSections: ft };
}
function Es(E, u) {
  const i = E.length;
  if (i < 3) return [];
  const r = [0, 0, 0];
  for (let S = 0; S < i; S++) {
    const C = u[E[S]], b = u[E[(S + 1) % i]];
    r[0] += (C[1] - b[1]) * (C[2] + b[2]), r[1] += (C[2] - b[2]) * (C[0] + b[0]), r[2] += (C[0] - b[0]) * (C[1] + b[1]);
  }
  const p = [Math.abs(r[0]), Math.abs(r[1]), Math.abs(r[2])], A = p[2] >= p[0] && p[2] >= p[1] ? 2 : p[1] >= p[0] ? 1 : 0, [y, F] = A === 2 ? [0, 1] : A === 1 ? [2, 0] : [1, 2], N = E.map((S) => [u[S][y], u[S][F]]);
  let P = 0;
  for (let S = 0; S < i; S++) P += N[S][0] * N[(S + 1) % i][1] - N[(S + 1) % i][0] * N[S][1];
  if (Math.abs(P) < 1e-12) return [];
  const L = [...Array(i).keys()];
  P < 0 && L.reverse();
  const w = (S, C, b) => (C[0] - S[0]) * (b[1] - S[1]) - (C[1] - S[1]) * (b[0] - S[0]), T = (S, C) => Math.abs(S[0] - C[0]) < 1e-9 && Math.abs(S[1] - C[1]) < 1e-9, G = (S, C, b, H) => !T(S, C) && !T(S, b) && !T(S, H) && w(C, b, S) >= -1e-12 && w(b, H, S) >= -1e-12 && w(H, C, S) >= -1e-12, k = [];
  let Z = 0;
  for (; L.length > 3 && Z++ < 10 * i; ) {
    let S = false;
    for (let C = 0; C < L.length; C++) {
      const b = L[(C + L.length - 1) % L.length], H = L[C], q = L[(C + 1) % L.length], j = N[b], et = N[H], ot = N[q];
      if (!(w(j, et, ot) <= 1e-12) && !L.some((tt) => tt !== b && tt !== H && tt !== q && G(N[tt], j, et, ot))) {
        k.push(P < 0 ? [E[q], E[H], E[b]] : [E[b], E[H], E[q]]), L.splice(C, 1), S = true;
        break;
      }
    }
    if (!S) return [];
  }
  if (L.length === 3) {
    const [S, C, b] = L;
    k.push(P < 0 ? [E[b], E[C], E[S]] : [E[S], E[C], E[b]]);
  }
  return k;
}
function Kt(E, u) {
  const i = /* @__PURE__ */ new Map();
  for (const N of E) for (const P of N) for (const L of N) P !== L && (i.has(P) || i.set(P, []), i.get(P).push(L));
  const r = /* @__PURE__ */ new Set();
  for (const N of E) for (const P of N) r.add(P);
  const p = new Set([...u ?? /* @__PURE__ */ new Map()].map(([N]) => N)), A = /* @__PURE__ */ new Set();
  let y = 0, F = 0;
  for (const N of r) {
    if (A.has(N)) continue;
    const P = [N], L = [];
    for (A.add(N); P.length; ) {
      const w = P.pop();
      L.push(w);
      for (const T of i.get(w) ?? []) A.has(T) || (A.add(T), P.push(T));
    }
    L.some((w) => p.has(w)) || (y++, F += L.length);
  }
  return { nPiezasFlotantes: y, nNudosFlotantes: F };
}
export {
  Kt as a,
  ms as p
};
