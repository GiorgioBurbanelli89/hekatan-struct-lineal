import { a as ts, c as ss } from "./cadSections-DVtTZU6U.js";
const wt = 64, es = (g) => g * Math.PI / 180;
function Pt(g, u = wt) {
  switch (g.tipo) {
    case "rect": {
      const { d: l, b: r } = g;
      return [[-r / 2, -l / 2], [r / 2, -l / 2], [r / 2, l / 2], [-r / 2, l / 2]];
    }
    case "circle": {
      const l = g.d / 2, r = [];
      for (let p = 0; p < u; p++) {
        const I = 2 * Math.PI * p / u;
        r.push([l * Math.cos(I), l * Math.sin(I)]);
      }
      return r;
    }
    case "angle": {
      const { d: l, b: r, tf: p, tw: I } = g;
      return [[0, 0], [r, 0], [r, p], [I, p], [I, l], [0, l]].map(([N, O]) => [N - r / 2, O - l / 2]);
    }
    case "channel": {
      const { d: l, b: r, tf: p, tw: I } = g;
      return [[0, 0], [r, 0], [r, p], [I, p], [I, l - p], [r, l - p], [r, l], [0, l]].map(([N, O]) => [N - r / 2, O - l / 2]);
    }
    case "tee": {
      const { d: l, b: r, tf: p, tw: I } = g, N = (r - I) / 2;
      return [[0, l - p], [r, l - p], [r, l], [0, l]].concat([]) && [[N, 0], [N + I, 0], [N + I, l - p], [r, l - p], [r, l], [0, l], [0, l - p], [N, l - p]].map(([O, R]) => [O - r / 2, R - l / 2]);
    }
    case "isection": {
      const { d: l, b: r, tf: p, tw: I } = g, N = (r - I) / 2;
      return [[0, 0], [r, 0], [r, p], [N + I, p], [N + I, l - p], [r, l - p], [r, l], [0, l], [0, l - p], [N, l - p], [N, p], [0, p]].map(([O, R]) => [O - r / 2, R - l / 2]);
    }
    case "polygon":
      return g.puntos.slice();
    default:
      return [];
  }
}
function os(g, u = wt) {
  if (g.tipo === "tube") {
    const { d: l, b: r, tf: p, tw: I } = g, N = l / 2 - p, O = r / 2 - I;
    return [[[-O, -N], [-O, N], [O, N], [O, -N]]];
  }
  if (g.tipo === "pipe") {
    const l = g.d / 2 - g.t, r = [];
    for (let p = u - 1; p >= 0; p--) {
      const I = 2 * Math.PI * p / u;
      r.push([l * Math.cos(I), l * Math.sin(I)]);
    }
    return [r];
  }
  return [];
}
function ns(g, u = wt) {
  return g.tipo === "tube" ? Pt({ tipo: "rect", d: g.d, b: g.b }) : g.tipo === "pipe" ? Pt({ tipo: "circle", d: g.d }, u) : Pt(g, u);
}
function as(g) {
  let u = 0, l = 0, r = 0, p = 0, I = 0, N = 0;
  for (let F = 0; F < g.length; F++) {
    const [C, b] = g[F], [A, x] = g[(F + 1) % g.length], k = C * x - A * b;
    u += k, l += (C + A) * k, r += (b + x) * k, p += (b * b + b * x + x * x) * k, I += (C * C + C * A + A * A) * k, N += (C * x + 2 * C * b + 2 * A * x + A * b) * k;
  }
  if (u /= 2, Math.abs(u) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const O = l / (6 * u), R = r / (6 * u);
  return { A: u, cx: O, cy: R, Ixx: p / 12 - u * R * R, Iyy: I / 12 - u * O * O, Ixy: N / 24 - u * O * R };
}
function cs(g, u) {
  const l = es(u.rot ?? 0), r = Math.cos(l), p = Math.sin(l), I = u.mirror ? -1 : 1, N = g.map(([O, R]) => {
    const F = O * I;
    return [F * r - R * p + (u.xc ?? 0), F * p + R * r + (u.yc ?? 0)];
  });
  return u.mirror ? N.reverse() : N;
}
function is(g, u) {
  let l = 0, r = 0, p = 0;
  const I = [];
  for (const A of g) {
    const x = u > 0 && A.E ? A.E / u : 1;
    if (A.forma.tipo === "rebar") {
      const H = A.forma.area * x;
      I.push({ A: H, cx: A.xc ?? 0, cy: A.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 }), l += H, r += H * (A.xc ?? 0), p += H * (A.yc ?? 0);
      continue;
    }
    const k = [ns(A.forma), ...os(A.forma)];
    for (const H of k) {
      if (H.length < 3) continue;
      const J = as(cs(H, A)), K = J.A * x;
      I.push({ ...J, A: K, n: x }), l += K, r += K * J.cx, p += K * J.cy;
    }
  }
  if (Math.abs(l) < 1e-18) return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: g.length };
  const N = r / l, O = p / l;
  let R = 0, F = 0, C = 0;
  for (const A of I) R += A.Ixx * A.n + A.A * (A.cy - O) ** 2, F += A.Iyy * A.n + A.A * (A.cx - N) ** 2, C += A.Ixy * A.n + A.A * (A.cx - N) * (A.cy - O);
  const b = (R + F) * 0.1;
  return { A: l, Iz: R, Iy: F, Ixy: C, J: b, cx: N, cy: O, As2: 5 / 6 * l, As3: 5 / 6 * l, nPiezas: g.length };
}
function rs(g, u, l, r, p) {
  switch ((g || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":
      return { tipo: "rect", d: u, b: l };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":
      return { tipo: "circle", d: u };
    case "STEEL ANGLE":
    case "ANGLE":
      return { tipo: "angle", d: u, b: l, tf: r, tw: p };
    case "STEEL CHANNEL":
    case "CHANNEL":
      return { tipo: "channel", d: u, b: l, tf: r, tw: p };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":
      return { tipo: "tee", d: u, b: l, tf: r, tw: p };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":
      return { tipo: "isection", d: u, b: l, tf: r, tw: p };
    case "STEEL TUBE":
    case "TUBE":
      return { tipo: "tube", d: u, b: l, tf: r, tw: p };
    case "STEEL PIPE":
    case "PIPE":
      return { tipo: "pipe", d: u, t: r || p };
    default:
      return u > 0 && l > 0 ? { tipo: "rect", d: u, b: l } : null;
  }
}
function fs(g) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  const u = g.split(/\r?\n/), l = { force: "TONF", length: "M" }, r = [], p = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), O = [], R = [], F = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Set(), K = [], ot = [], _ = /* @__PURE__ */ new Map(), nt = [];
  let q = 0;
  const It = [], gt = [];
  let bt = "", D = "";
  const at = /* @__PURE__ */ new Map();
  for (const n of u) {
    const e = n.trim();
    if (!e || e.startsWith("$")) {
      e.startsWith("$ ") && (D = e.substring(2).trim());
      continue;
    }
    if (D && (at.has(D) || at.set(D, []), at.get(D).push(n)), D === "CONTROLS") {
      const t = e.match(/UNITS\s+"([^"]+)"\s+"([^"]+)"/);
      t && (l.force = t[1], l.length = t[2]);
      const o = e.match(/TITLE2\s+"([^"]+)"/);
      o && (bt = o[1]);
    }
    if (D === "STORIES - IN SEQUENCE FROM TOP") {
      const t = e.match(/STORY\s+"([^"]+)"\s+(?:HEIGHT\s+([\d.]+)|ELEV\s+([-\d.]+))/);
      if (t) {
        const o = t[1], s = t[2] ? parseFloat(t[2]) : 0, a = t[3] ? parseFloat(t[3]) : void 0;
        r.push({ name: o, height: s, elev: a ?? 0 });
      }
    }
    if (D === "MATERIAL PROPERTIES") {
      const t = e.match(/MATERIAL\s+"([^"]+)"\s+(?:TYPE\s+"([^"]+)")?/);
      if (t) {
        const o = t[1];
        p.has(o) || p.set(o, { type: t[2] || "", E: 0, G: 0, nu: 0 });
        const s = p.get(o);
        t[2] && (s.type = t[2]);
        const a = e.match(/\bE\s+([\d.eE+-]+)/);
        a && (s.E = parseFloat(a[1]));
        const c = e.match(/\bU\s+([\d.eE+-]+)/);
        c && (s.nu = parseFloat(c[1]), s.G = s.E / (2 * (1 + s.nu)));
        const i = e.match(/\bFY\s+([\d.eE+-]+)/);
        i && (s.fy = parseFloat(i[1]));
        const f = e.match(/\bFC\s+([\d.eE+-]+)/);
        f && (s.fc = parseFloat(f[1]));
        const d = e.match(/WEIGHTPERVOLUME\s+([\d.eE+-]+)/);
        d && (s.density = parseFloat(d[1]));
      }
    }
    if (D === "FRAME SECTIONS") {
      const t = e.match(/FRAMESECTION\s+"([^"]+)"/);
      if (t) {
        const o = t[1];
        I.has(o) || I.set(o, { material: "", shape: "", D: 0, B: 0, TF: 0, TW: 0 });
        const s = I.get(o), a = e.match(/MATERIAL\s+"([^"]+)"/);
        a && (s.material = a[1]);
        const c = e.match(/SHAPE\s+"([^"]+)"/);
        c && (s.shape = c[1]);
        const i = e.match(/\bD\s+([\d.eE+-]+)/);
        i && (s.D = parseFloat(i[1]));
        const f = e.match(/\bB\s+([\d.eE+-]+)/);
        f && (s.B = parseFloat(f[1]));
        const d = e.match(/\bTF\s+([\d.eE+-]+)/);
        d && (s.TF = parseFloat(d[1]));
        const E = e.match(/\bTW\s+([\d.eE+-]+)/);
        E && (s.TW = parseFloat(E[1]));
        const h = e.match(/\bR\s+([\d.eE+-]+)/);
        h && (s.R = parseFloat(h[1]));
        const y = e.match(/FILLMATERIAL\s+"([^"]+)"/);
        y && (s.fillMaterial = y[1]);
        const T = e.match(/I2MOD\s+([\d.eE+-]+)/);
        T && (s.modI2 = parseFloat(T[1]));
        const M = e.match(/I3MOD\s+([\d.eE+-]+)/);
        M && (s.modI3 = parseFloat(M[1]));
        for (const [z, ut] of [["AREA", /\bAREA\s+([\d.eE+-]+)/], ["AS2", /\bAS2\s+([\d.eE+-]+)/], ["AS3", /\bAS3\s+([\d.eE+-]+)/], ["I33", /\bI33\s+([\d.eE+-]+)/], ["I22", /\bI22\s+([\d.eE+-]+)/], ["TORSION", /\bTORSION\s+([\d.eE+-]+)/]]) {
          const L = e.match(ut);
          L && (s[z] = parseFloat(L[1]));
        }
        const S = e.match(/\bT\s+([\d.eE+-]+)/);
        S && !s.TF && !s.TW && (s.TF = parseFloat(S[1]), s.TW = parseFloat(S[1]));
        const P = e.match(/\bLIP\s+([\d.eE+-]+)/);
        P && (s.LIP = parseFloat(P[1]));
      }
    }
    if (D === "POINT COORDINATES") {
      const t = e.match(/POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)(?:\s+([-\d.eE+]+))?/);
      t && N.set(t[1], [parseFloat(t[2]), parseFloat(t[3]), parseFloat(t[4] ?? "0") || 0]);
    }
    if (D === "LINE CONNECTIVITIES") {
      const t = e.match(/LINE\s+"([^"]+)"\s+(COLUMN|BEAM|BRACE)\s+"([^"]+)"\s+"([^"]+)"\s+(\d+)/);
      t && O.push({ name: t[1], type: t[2], pt1: t[3], pt2: t[4], nStories: parseInt(t[5]) });
    }
    if (D === "POINT ASSIGNS") {
      const t = e.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*RESTRAINT\s+"([^"]+)"/);
      t && A.set(`${t[1]}@${t[2]}`, t[3].split(/\s+/));
      const o = e.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)"/);
      o && J.add(`${o[1]}@${o[2]}`);
      const s = e.match(/POINTASSIGN\s+"([^"]+)"\s+"([^"]+)".*SPRINGPROP\s+"([^"]+)"/);
      s && H.set(`${s[1]}@${s[2]}`, s[3]);
    }
    {
      const t = e.match(/(POINTSPRING|LINESPRING|AREASPRING)\s+"([^"]+)"/);
      if (t) {
        const o = t[1] === "POINTSPRING" ? "point" : t[1] === "LINESPRING" ? "line" : "area", s = ((_a = k.get(t[2])) == null ? void 0 : _a.k) ?? [0, 0, 0, 0, 0, 0], a = { UX: 0, UY: 1, UZ: 2, U1: 0, U2: 1, U3: 2, RX: 3, RY: 4, RZ: 5, R1: 3, R2: 4, R3: 5 };
        for (const c of e.matchAll(/(UX|UY|UZ|U1|U2|U3|RX|RY|RZ|R1|R2|R3)\s+([\d.eE+-]+)/g)) {
          const i = a[c[1]];
          i !== void 0 && (s[i] = parseFloat(c[2]));
        }
        k.set(t[2], { tipo: o, k: s });
      }
    }
    if (D === "LINE ASSIGNS") {
      const t = e.match(/LINEASSIGN\s+"([^"]+)"\s+"([^"]+)".*SECTION\s+"([^"]+)"/);
      if (t) {
        const o = { story: t[2], section: t[3], rigidZone: 0, releases: [], angle: 0 }, s = e.match(/RIGIDZONE\s+([\d.eE+-]+)/);
        s && (o.rigidZone = parseFloat(s[1]));
        const a = e.match(/LENGTHOFFI\s+([\d.eE+-]+)/), c = e.match(/LENGTHOFFJ\s+([\d.eE+-]+)/);
        (a || c) && (o.offsets = [a ? parseFloat(a[1]) : 0, c ? parseFloat(c[1]) : 0]);
        const i = e.match(/RELEASE\s+"([^"]+)"/);
        i && (o.releases = i[1].split(/\s+/));
        const f = e.match(/ANG\s+([-\d.eE+]+)/);
        f && (o.angle = parseFloat(f[1]));
        const d = e.match(/SPRINGPROP\s+"([^"]+)"/);
        d && (o.spring = d[1]), o.mallaEnCruces = /MESHATINTERSECTIONS\s+"?YES/i.test(e), x.set(`${t[1]}@${t[2]}`, o);
      }
    }
    if (D === "GRIDS") {
      const t = e.match(/^\s*GRID\s+"[^"]+"\s+LABEL\s+"([^"]+)"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)/);
      t && It.push({ label: t[1], dir: t[2], coord: parseFloat(t[3]) });
      const o = e.match(/^\s*REFERENCEPLANE\s.*\sZ\s+([-\d.eE+]+)/);
      o && gt.push({ z: parseFloat(o[1]) });
    }
    if (D === "FRAME OBJECT LOADS") {
      const t = e.match(/LINELOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      t && K.push({ line: t[1], story: t[2], type: t[3], dir: t[4], lc: t[5], val: parseFloat(t[6]) });
    }
    {
      const t = e.match(/SHELLUNIFORMLOADSET\s+"([^"]+)"\s+LOADPAT\s+"([^"]+)"\s+VALUE\s+([-\d.eE+]+)/);
      t && (_.has(t[1]) || _.set(t[1], []), _.get(t[1]).push({ lc: t[2], val: parseFloat(t[3]) }));
    }
    if (D === "LOAD PATTERNS") {
      const t = e.match(/LOADPATTERN\s+"([^"]+)"\s+TYPE\s+"([^"]+)"\s+SELFWEIGHT\s+([\d.eE+-]+)/);
      t && /dead/i.test(t[2]) && (q = Math.max(q, parseFloat(t[3])));
    }
    if (D === "POINT OBJECT LOADS") {
      const t = e.match(/POINTLOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"FORCE"\s+LC\s+"([^"]+)"(.*)$/);
      if (t) {
        const o = (s) => {
          const a = t[4].match(new RegExp(`\\b${s}\\s+([-\\d.eE+]+)`));
          return a ? parseFloat(a[1]) : 0;
        };
        nt.push({ pt: t[1], story: t[2], lc: t[3], v: ["FX", "FY", "FZ", "MX", "MY", "MZ"].map(o) });
      }
    }
    if (D === "SHELL OBJECT LOADS") {
      const t = e.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFF"\s+DIR\s+"([^"]+)"\s+LC\s+"([^"]+)"\s+FVAL\s+([-\d.eE+]+)/);
      if (t) ot.push({ area: t[1], story: t[2], tipo: "UNIFF", dir: t[3], lc: t[4], val: parseFloat(t[5]) });
      else {
        const o = e.match(/AREALOAD\s+"([^"]+)"\s+"([^"]+)"\s+TYPE\s+"UNIFLOADSET"\s+"([^"]+)"/);
        o && ot.push({ area: o[1], story: o[2], tipo: "UNIFLOADSET", dir: "GRAV", lc: "", val: 0, set: o[3] });
      }
    }
    if (D === "AREA CONNECTIVITIES") {
      const t = e.match(/AREA\s+"([^"]+)"\s+(?:([A-Za-z]\w*)\s+)?\d+\s+(.+)/);
      if (t) {
        const o = ((_b = t[3].match(/"([^"]+)"/g)) == null ? void 0 : _b.map((a) => a.replace(/"/g, ""))) || [], s = t[3].replace(/"[^"]*"/g, " ").trim().split(/\s+/).filter(Boolean).map(Number).filter((a) => Number.isFinite(a));
        R.push({ name: t[1], tipo: t[2] || "FLOOR", pts: o, dz: s.length === o.length ? s : o.map(() => 0) });
      }
    }
    if (e.startsWith("SDSECTION")) {
      const t = (_c = e.match(/SDSECTION\s+"([^"]+)"/)) == null ? void 0 : _c[1], o = (_d = e.match(/SHAPETYPE\s+"([^"]+)"/)) == null ? void 0 : _d[1];
      if (t && o) {
        const s = (a) => {
          const c = e.match(a);
          return c ? parseFloat(c[1]) : 0;
        };
        b.has(t) || b.set(t, []), b.get(t).push({ shapeType: o, material: ((_e = e.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _e[1]) ?? "", D: s(/\bD\s+([\d.eE+-]+)/), B: s(/\bB\s+([\d.eE+-]+)/), TF: s(/\bTF\s+([\d.eE+-]+)/), TW: s(/\bTW\s+([\d.eE+-]+)/), XC: s(/\bXC\s+(-?[\d.eE+-]+)/), YC: s(/\bYC\s+(-?[\d.eE+-]+)/) });
      }
    }
    if (D === "AREA ASSIGNS") {
      const t = e.match(/AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)"/);
      t && F.set(t[1], { story: t[2], section: t[3], spring: (_f = e.match(/SPRINGPROP\s+"([^"]+)"/)) == null ? void 0 : _f[1] });
    }
    if (e.startsWith("SHELLPROP")) {
      const t = (_g = e.match(/SHELLPROP\s+"([^"]+)"/)) == null ? void 0 : _g[1];
      if (t) {
        const o = (E) => {
          const h = e.match(E);
          return h ? parseFloat(h[1]) : void 0;
        }, s = o(/SLABTHICKNESS\s+([\d.eE+-]+)/) ?? o(/WALLTHICKNESS\s+([\d.eE+-]+)/) ?? o(/DECKSLABDEPTH\s+([\d.eE+-]+)/), c = /PROPTYPE\s+"Deck"/.test(e) ? { tc: o(/DECKSLABDEPTH\s+([\d.eE+-]+)/) ?? 0, hr: o(/DECKRIBDEPTH\s+([\d.eE+-]+)/) ?? 0, wrt: o(/DECKRIBWIDTHTOP\s+([\d.eE+-]+)/) ?? 0, wrb: o(/DECKRIBWIDTHBOTTOM\s+([\d.eE+-]+)/) ?? 0, sr: o(/DECKRIBSPACING\s+([\d.eE+-]+)/) ?? 0, w: o(/DECKUNITWEIGHT\s+([\d.eE+-]+)/) ?? 0 } : void 0, f = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD"].map((E) => o(new RegExp(E + "\\s+([\\d.eE+-]+)"))), d = C.get(t);
        if (f.some((E) => E !== void 0)) {
          const E = f.map((h) => h ?? 1);
          C.set(t, { t: (d == null ? void 0 : d.t) ?? 0, material: (d == null ? void 0 : d.material) ?? "", modeling: (d == null ? void 0 : d.modeling) ?? "ShellThin", mods: E, deck: d == null ? void 0 : d.deck });
        } else s !== void 0 && C.set(t, { t: s, mods: d == null ? void 0 : d.mods, deck: c ?? (d == null ? void 0 : d.deck), material: ((_h = e.match(/MATERIAL\s+"([^"]+)"/)) == null ? void 0 : _h[1]) ?? ((_i = e.match(/CONCMATERIAL\s+"([^"]+)"/)) == null ? void 0 : _i[1]) ?? "", modeling: ((_j = e.match(/MODELINGTYPE\s+"([^"]+)"/)) == null ? void 0 : _j[1]) ?? (/PROPTYPE\s+"Deck"/.test(e) ? "Membrane" : "ShellThin") });
      }
    }
  }
  const ct = /* @__PURE__ */ new Map();
  if (r.length > 0) {
    const n = r.length - 1;
    ct.set(r[n].name, r[n].elev);
    for (let e = n - 1; e >= 0; e--) {
      const o = ct.get(r[e + 1].name) + r[e].height;
      r[e].elev = o, ct.set(r[e].name, o);
    }
  }
  const U = [], Dt = [], j = /* @__PURE__ */ new Map(), B = (n, e) => `${n}@${e}`, Z = /* @__PURE__ */ new Set(), Xt = /* @__PURE__ */ new Map();
  for (const n of O) Xt.set(n.name, n);
  for (const n of O) for (const [e, t] of x) {
    if (!e.startsWith(n.name + "@")) continue;
    const o = t.story, s = r.findIndex((a) => a.name === o);
    if (!(s < 0)) if (n.type === "COLUMN" || n.type === "BRACE") {
      Z.add(B(n.pt2, o));
      const a = Math.min(s + n.nStories, r.length - 1);
      Z.add(B(n.pt1, r[a].name));
      for (let c = s + 1; c < a; c++) Z.add(B(n.pt1, r[c].name));
    } else Z.add(B(n.pt1, o)), Z.add(B(n.pt2, o));
  }
  for (const [n] of A) Z.add(n);
  for (const n of J) Z.add(n);
  const vt = (n, e) => {
    const t = r.findIndex((s) => s.name === n);
    if (t < 0) return;
    const o = t + (e || 0);
    if (!(o < 0 || o > r.length - 1)) return r[o].name;
  };
  for (const n of R) {
    const e = F.get(n.name);
    e && n.pts.forEach((t, o) => {
      const s = vt(e.story, n.dz[o] ?? 0);
      s && Z.add(B(t, s));
    });
  }
  const At = /* @__PURE__ */ new Map();
  for (const n of Z) {
    const [e, t] = n.split("@"), o = N.get(e), s = ct.get(t);
    if (o === void 0 || s === void 0) continue;
    U.push([o[0], o[1], s - (o[2] ?? 0)]), Dt.push(n), j.set(n, U.length - 1);
    const a = H.get(n);
    a && At.set(U.length - 1, a);
  }
  const Y = [], X = [], Mt = [], tt = [], it = /* @__PURE__ */ new Map(), Tt = /* @__PURE__ */ new Map(), xt = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map(), kt = /* @__PURE__ */ new Map(), Gt = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map();
  for (const n of O) for (const [e, t] of x) {
    if (!e.startsWith(n.name + "@")) continue;
    const o = t.story, s = r.findIndex((f) => f.name === o);
    if (s < 0) continue;
    const a = [];
    if (n.type === "COLUMN" || n.type === "BRACE") {
      const f = Math.min(s + n.nStories, r.length - 1);
      for (let d = f; d > s; d--) a.push(B(n.pt1, r[d].name));
      a.push(B(n.pt2, o));
    } else a.push(B(n.pt1, o), B(n.pt2, o));
    const c = a.map((f) => j.get(f)).filter((f) => f !== void 0);
    if (c.length < 2) continue;
    const i = { PI: 0, V2I: 1, V3I: 2, TI: 3, M2I: 4, M3I: 5, PJ: 6, V2J: 7, V3J: 8, TJ: 9, M2J: 10, M3J: 11 };
    for (let f = 0; f < c.length - 1; f++) {
      const d = c[f], E = c[f + 1];
      if (d === E) continue;
      const h = Y.length;
      if (Y.push([d, E]), X.push(c.length > 2 ? `${n.name}-${f + 1}` : n.name), Mt.push(n.type), tt.push(o), it.set(h, t.section), t.spring && Tt.set(h, t.spring), t.mallaEnCruces && xt.set(h, true), t.rigidZone > 0 && rt.set(h, [t.rigidZone, t.rigidZone]), t.angle && Gt.set(h, t.angle), t.offsets && st.set(h, [t.offsets[0], t.offsets[1], t.rigidZone]), t.releases.length > 0) {
        const y = new Array(12).fill(false);
        for (const T of t.releases) {
          const M = i[T];
          M !== void 0 && (M < 6 && f !== 0 || M >= 6 && f !== c.length - 2 || (y[M] = true));
        }
        y.some(Boolean) && kt.set(h, y);
      }
    }
  }
  const lt = /* @__PURE__ */ new Map(), ft = /* @__PURE__ */ new Map(), pt = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Map(), Nt = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), yt = /* @__PURE__ */ new Map(), Ot = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map();
  let $t = 0;
  for (const [n, e] of it) {
    const t = I.get(e);
    if (!t) continue;
    const o = p.get(t.material);
    o && (lt.set(n, o.E), ft.set(n, o.G));
    const s = t.D, a = t.B, c = t.TF, i = t.TW;
    let f = 0, d = 0, E = 0, h = 0, y = 0, T = 0, M = "rect", S = 0, P = false, z = false;
    const ut = b.get(e);
    if (t.shape === "SD Section" && (ut == null ? void 0 : ut.length)) {
      const L = (o == null ? void 0 : o.E) || ((_k = p.get(t.material)) == null ? void 0 : _k.E) || 0, V = [];
      for (const w of ut) {
        const et = rs(w.shapeType, w.D, w.B, w.TF, w.TW);
        et && V.push({ forma: et, xc: w.XC, yc: w.YC, E: ((_l = p.get(w.material)) == null ? void 0 : _l.E) || L });
      }
      if (V.length) {
        const w = is(V, L);
        w.A > 0 && (f = w.A, d = w.Iz, E = w.Iy, h = w.J, y = w.As2, T = w.As3, M = "rect", z = true, $t++);
      }
    }
    if (!z) switch (t.shape) {
      case "Concrete Rectangular":
        f = s * a, d = a * s ** 3 / 12, E = s * a ** 3 / 12, h = a * s ** 3 * (1 / 3 - 0.21 * (s / a) * (1 - s ** 4 / (12 * a ** 4))), y = T = 5 / 6 * f, M = "rect";
        break;
      case "Concrete Circle":
        f = Math.PI * s ** 2 / 4, d = E = Math.PI * s ** 4 / 64, h = Math.PI * s ** 4 / 32, y = T = 0.9 * f, M = "circ";
        break;
      case "Steel I/Wide Flange":
        f = 2 * a * c + (s - 2 * c) * i, d = (a * s ** 3 - (a - i) * (s - 2 * c) ** 3) / 12, E = (2 * c * a ** 3 + (s - 2 * c) * i ** 3) / 12, h = (2 * a * c ** 3 + (s - 2 * c) * i ** 3) / 3, y = (s - 2 * c) * i, T = 2 * a * c * 5 / 6, M = "I";
        break;
      case "Steel Tube":
        f = s * a - (s - 2 * i) * (a - 2 * i), d = (a * s ** 3 - (a - 2 * i) * (s - 2 * i) ** 3) / 12, E = (s * a ** 3 - (s - 2 * i) * (a - 2 * i) ** 3) / 12, h = 2 * i * (s - i) * (a - i) * ((s - i) * (a - i)) / (s - i + (a - i)), y = 2 * s * i, T = 2 * a * i, M = "HSS";
        break;
      case "Filled Steel Pipe": {
        const L = (o == null ? void 0 : o.E) || 0, V = t.fillMaterial ? p.get(t.fillMaterial) : void 0, w = (V == null ? void 0 : V.E) || L * 0.125, et = t.T || i || c, $ = ss(s, et, L || 1, (o == null ? void 0 : o.nu) ?? 0.3, w || 0.125, (V == null ? void 0 : V.nu) ?? 0.2);
        f = $.A, d = $.Iz, E = $.Iy, h = $.J, T = $.As2, y = $.As3, S = w, P = true, M = "CFT";
        break;
      }
      case "Filled Steel Tube": {
        const L = (o == null ? void 0 : o.E) || 0, V = t.fillMaterial ? p.get(t.fillMaterial) : void 0, w = (V == null ? void 0 : V.E) || L * 0.125, $ = ts(a, s, i || c, L || 1, (o == null ? void 0 : o.nu) ?? 0.3, w || 0.125, (V == null ? void 0 : V.nu) ?? 0.2);
        f = $.A, d = $.Iz, E = $.Iy, h = $.J, T = $.As2, y = $.As3, S = w, M = "CFT";
        break;
      }
      case "Steel Angle": {
        const L = c || i;
        f = L * (s + a - L), d = L * (s ** 3 + a * L ** 2 + L ** 2 * (s - L)) / 12, E = L * (a ** 3 + s * L ** 2 + L ** 2 * (a - L)) / 12, h = (s + a - L) * L ** 3 / 3, y = s * L, T = a * L, M = "L";
        break;
      }
      case "Steel Channel":
      case "Cold Formed C":
        f = 2 * a * c + (s - 2 * c) * i, d = (i * s ** 3 + 2 * a * c * (s - c) ** 2) / 12, E = (2 * c * a ** 3 + (s - 2 * c) * i ** 3) / 12, h = (2 * a * c ** 3 + (s - 2 * c) * i ** 3) / 3, y = (s - 2 * c) * i, T = 2 * a * c * 5 / 6, M = t.shape === "Cold Formed C" ? "coldC" : "C";
        break;
      case "Steel Double Channel":
        f = 2 * (2 * a * c + (s - 2 * c) * i), d = 2 * (i * s ** 3 + 2 * a * c * (s - c) ** 2) / 12, E = 2 * (2 * c * a ** 3 + (s - 2 * c) * i ** 3) / 12, h = 2 * (2 * a * c ** 3 + (s - 2 * c) * i ** 3) / 3, y = 2 * (s - 2 * c) * i, T = 4 * a * c * 5 / 6, M = "2C";
        break;
      case "General":
        if (t.AREA && t.AREA > 0) {
          f = t.AREA, d = t.I33 ?? 0, E = t.I22 ?? 0, h = t.TORSION ?? 0, T = t.AS2 ?? 0, y = t.AS3 ?? 0, M = "general";
          break;
        }
      default:
        s > 0 && a > 0 && (f = s * a, d = a * s ** 3 / 12, E = s * a ** 3 / 12, h = Math.min(s, a) * Math.max(s, a) ** 3 / 3 * 0.3, y = T = 5 / 6 * f);
        break;
    }
    t.modI2 && (E *= t.modI2), t.modI3 && (d *= t.modI3), pt.set(n, f), Rt.set(n, d), yt.set(n, E), Ot.set(n, h), y > 0 && St.set(n, y), T > 0 && Nt.set(n, T), dt.set(n, { type: M, ...S > 0 ? { fillE: S } : {}, b: P ? void 0 : a || void 0, h: P ? void 0 : s || void 0, d: M === "circ" || M === "pipe" || P ? s : void 0, tw: i || void 0, tf: c || void 0, r: t.R, name: e });
  }
  const Et = /* @__PURE__ */ new Map();
  for (const [n, e] of A) {
    const t = j.get(n);
    if (t === void 0) continue;
    const o = [false, false, false, false, false, false];
    for (const s of e) s === "UX" && (o[0] = true), s === "UY" && (o[1] = true), s === "UZ" && (o[2] = true), s === "RX" && (o[3] = true), s === "RY" && (o[4] = true), s === "RZ" && (o[5] = true);
    Et.set(t, o);
  }
  const W = /* @__PURE__ */ new Map(), Ut = /* @__PURE__ */ new Map();
  for (let n = 0; n < X.length; n++) Ut.set(`${X[n]}@${tt[n]}`, n);
  for (const n of K) {
    const e = Ut.get(`${n.line}@${n.story}`);
    if (e === void 0) continue;
    const [t, o] = Y[e], s = U[t], a = U[o], c = Math.sqrt((a[0] - s[0]) ** 2 + (a[1] - s[1]) ** 2 + (a[2] - s[2]) ** 2);
    if (c < 1e-10) continue;
    const i = [0, 0, 0];
    n.dir === "GRAV" || n.dir === "GRAVITY" ? i[2] = -n.val : n.dir === "X" ? i[0] = n.val : n.dir === "Y" ? i[1] = n.val : n.dir === "Z" && (i[2] = n.val);
    const f = [(a[0] - s[0]) / c, (a[1] - s[1]) / c, (a[2] - s[2]) / c], d = c * c / 12, E = [f[1] * i[2] - f[2] * i[1], f[2] * i[0] - f[0] * i[2], f[0] * i[1] - f[1] * i[0]], h = (y, T) => {
      const M = W.get(y) || [0, 0, 0, 0, 0, 0];
      for (let S = 0; S < 6; S++) M[S] += T[S];
      W.set(y, M);
    };
    h(t, [i[0] * c / 2, i[1] * c / 2, i[2] * c / 2, d * E[0], d * E[1], d * E[2]]), h(o, [i[0] * c / 2, i[1] * c / 2, i[2] * c / 2, -d * E[0], -d * E[1], -d * E[2]]);
  }
  const Q = /* @__PURE__ */ new Map(), Ft = /* @__PURE__ */ new Map();
  for (const [n, e] of it) {
    const t = I.get(e);
    if (!t) continue;
    const o = p.get(t.material);
    (o == null ? void 0 : o.density) && Q.set(n, o.density);
  }
  const mt = /* @__PURE__ */ new Map(), Bt = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map(), Wt = /* @__PURE__ */ new Map(), Lt = [], v = { sinAssign: 0, sinNudo: 0, colapsada: 0, poligono: 0 };
  for (const n of R) {
    const e = F.get(n.name);
    if (!e) {
      v.sinAssign++;
      continue;
    }
    if (n.pts.length > 4) {
      v.poligono++;
      continue;
    }
    const t = n.pts.map((i, f) => {
      const d = vt(e.story, n.dz[f] ?? 0);
      return d === void 0 ? void 0 : j.get(B(i, d));
    });
    if (t.some((i) => i === void 0)) {
      v.sinNudo++;
      continue;
    }
    const o = [...new Set(t)];
    if (o.length < 3) {
      v.colapsada++;
      continue;
    }
    const s = o.length === 3 ? o : t.slice(0, 4), a = Y.length;
    Y.push(s), X.push(n.name), Mt.push(n.tipo), tt.push(e.story), Lt.push(n.name), e.spring && Tt.set(a, e.spring);
    const c = C.get(e.section);
    if (c) {
      mt.set(a, c.t);
      const i = p.get(c.material);
      if ((i == null ? void 0 : i.E) && lt.set(a, i.E), (i == null ? void 0 : i.G) && ft.set(a, i.G), (i == null ? void 0 : i.nu) !== void 0 && Bt.set(a, i.nu), (i == null ? void 0 : i.density) && Q.set(a, i.density), c.deck && c.deck.tc > 0) {
        const E = c.deck, h = E.tc + (E.sr > 0 ? E.hr * (E.wrt + E.wrb) / 2 / E.sr : 0);
        Q.set(a, (((i == null ? void 0 : i.density) ?? 0) * h + E.w) / E.tc), Ft.set(a, { ...E });
      }
      const f = /membrane/i.test(c.modeling);
      Yt.set(a, /thick/i.test(c.modeling) || f ? 0 : 1);
      const d = c.mods ? c.mods.slice(0, 8) : [1, 1, 1, 1, 1, 1, 1, 1];
      f && (d[3] = 0, d[4] = 0, d[5] = 0, d[6] = 0, d[7] = 0), (c.mods || f) && Wt.set(a, d);
    }
  }
  const ht = /* @__PURE__ */ new Map();
  for (let n = 0; n < X.length; n++) Y[n].length > 2 && ht.set(`${X[n]}@${tt[n]}`, n);
  let Ct = 0;
  for (const n of nt) {
    const e = j.get(B(n.pt, n.story));
    if (e === void 0) {
      Ct++;
      continue;
    }
    const t = W.get(e) || [0, 0, 0, 0, 0, 0];
    for (let o = 0; o < 6; o++) t[o] += n.v[o];
    W.set(e, t);
  }
  nt.length && console.log(`[e2kParser] cargas puntuales: ${nt.length - Ct} aplicadas \xB7 ${Ct} sin nudo (punto@planta que no existe)`);
  let zt = 0, Ht = 0, Zt = 0, Vt = 0;
  for (const n of ot) {
    const e = ht.get(`${n.area}@${n.story}`) ?? ht.get(`${n.area}@`), t = e !== void 0 ? e : (_m = [...ht].find(([S]) => S.startsWith(n.area + "@"))) == null ? void 0 : _m[1];
    if (t === void 0) {
      Ht++;
      continue;
    }
    const o = Y[t], s = o.map((S) => U[S]).filter(Boolean);
    if (s.length < 3) continue;
    let a = 0, c = 0, i = 0;
    for (let S = 0; S < s.length; S++) {
      const P = s[S], z = s[(S + 1) % s.length];
      a += P[1] * z[2] - P[2] * z[1], c += P[2] * z[0] - P[0] * z[2], i += P[0] * z[1] - P[1] * z[0];
    }
    const f = Math.hypot(a, c, i) / 2;
    if (!(f > 0)) continue;
    const d = n.tipo === "UNIFLOADSET" ? _.get(n.set ?? "") ?? [] : [{ lc: n.lc, val: n.val }];
    let E = 0;
    for (const S of d) E += S.val;
    if (!E) {
      Zt++;
      continue;
    }
    Vt++;
    const h = E * f / s.length;
    zt += E * f;
    let y = 0, T = 0, M = 0;
    n.dir === "GRAV" || n.dir === "GRAVITY" || n.dir === "Z" ? M = -h : n.dir === "X" ? y = h : n.dir === "Y" && (T = h);
    for (const S of o) {
      const P = W.get(S) || [0, 0, 0, 0, 0, 0];
      P[0] += y, P[1] += T, P[2] += M, W.set(S, P);
    }
  }
  ot.length && console.info(`[e2kParser] cargas de losa: ${Vt} aplicadas \xB7 ${Ht} sin area que las lleve \xB7 ${Zt} sin valor \xB7 total ${zt.toFixed(0)} (unidades del fichero) \xB7 ${_.size} juegos con nombre`);
  const Jt = v.sinAssign + v.sinNudo + v.colapsada + v.poligono;
  if (Jt) {
    const n = [v.poligono && `${v.poligono} son POLIGONOS de mas de 4 lados (ETABS los admite, hekatan-fem tiene Q4 y T3: habria que triangularlos)`, v.sinAssign && `${v.sinAssign} sin AREAASSIGN`, v.sinNudo && `${v.sinNudo} con algun nudo que no resuelve a planta`, v.colapsada && `${v.colapsada} colapsadas (menos de 3 nudos distintos)`].filter(Boolean).join(" \xB7 ");
    console.warn(`[e2kParser] ${Jt} de ${R.length} areas no se montaron: ${n}. Se pierden, y el modelo sale mas flojo sin que la geometria lo delate.`);
  }
  const qt = { MM: 1e-3, CM: 0.01, M: 1, IN: 0.0254, FT: 0.3048 }, jt = { N: 1e-3, KN: 1, KGF: 980665e-8, TONF: 9.80665, LB: 444822e-8, KIP: 4.44822 }, m = qt[(l.length || "M").toUpperCase()] ?? 1, G = jt[(l.force || "KN").toUpperCase()] ?? 1;
  if (m !== 1 || G !== 1) {
    const n = (e, t) => {
      if (e) for (const [o, s] of e) e.set(o, s * t);
    };
    for (const e of U) e[0] *= m, e[1] *= m, e[2] *= m;
    for (const e of r) e.height *= m, e.elev *= m;
    for (const e of It) e.coord *= m;
    for (const e of gt) e.z *= m;
    n(mt, m), n(pt, m * m);
    for (const e of k.values()) {
      const t = e.tipo === "point" ? G / m : e.tipo === "line" ? G / (m * m) : G / (m * m * m);
      for (let o = 0; o < 6; o++) e.k[o] *= o < 3 ? t : e.tipo === "point" ? G * m : G;
    }
    n(St, m * m), n(Nt, m * m), n(yt, m ** 4), n(Rt, m ** 4), n(Ot, m ** 4), n(lt, G / (m * m)), n(ft, G / (m * m)), n(Q, G / m ** 3);
    for (const e of Ft.values()) e.tc *= m, e.hr *= m, e.wrt *= m, e.wrb *= m, e.sr *= m, e.w *= G / (m * m);
    for (const [e, t] of rt) rt.set(e, [t[0] * m, t[1] * m]);
    for (const [e, t] of st) st.set(e, [t[0] * m, t[1] * m, t[2]]);
    for (const [e, t] of W) W.set(e, t.map((o, s) => o * (s < 3 ? G : G * m)));
    for (const [, e] of k) {
      const t = e.tipo === "point" ? 1 : e.tipo === "line" ? 2 : 3;
      for (let o = 0; o < 6; o++) e.k[o] *= o < 3 ? G / m ** t : G * m / m ** (t - 1);
    }
    for (const [, e] of dt) {
      for (const t of ["d", "b", "h", "tf", "tw", "t", "r", "lip", "dis", "D", "B", "TF", "TW"]) {
        const o = e;
        typeof o[t] == "number" && (o[t] *= m);
      }
      typeof e.fillE == "number" && (e.fillE *= G / (m * m));
    }
  }
  {
    const n = Kt(Y, Et);
    n.nPiezasFlotantes && console.warn(`[e2kParser] ${n.nPiezasFlotantes} trozos (${n.nNudosFlotantes} nudos) no llegan a ningun apoyo: la matriz sale SINGULAR y el modelo no resuelve. En ETABS los sujetan links, muelles de pilote o diafragmas, que este lector aun no importa.`);
  }
  const Qt = () => {
    if (!(q > 0)) return W;
    let n = 0;
    const e = (t, o) => {
      const s = W.get(t) || [0, 0, 0, 0, 0, 0];
      s[2] += o, W.set(t, s), n += o;
    };
    return Y.forEach((t, o) => {
      const s = Q.get(o);
      if (!s) return;
      const a = t;
      if (a.length === 2) {
        const c = pt.get(o) ?? 0, i = U[a[0]], f = U[a[1]], d = st.get(o), E = f[0] - i[0], h = f[1] - i[1], y = f[2] - i[2], T = Math.hypot(E, h), M = T > 1e-9 && Math.atan2(Math.abs(y), T) * 180 / Math.PI < 20, S = Math.max(0, Math.hypot(E, h, y) - (d && M ? d[0] + d[1] : 0)), P = s * c * S * q;
        e(a[0], -P / 2), e(a[1], -P / 2);
      } else if (a.length >= 3) {
        const c = mt.get(o) ?? 0, i = a.map((T) => U[T]);
        let f = 0, d = 0, E = 0;
        for (let T = 0; T < i.length; T++) {
          const M = i[T], S = i[(T + 1) % i.length];
          f += M[1] * S[2] - M[2] * S[1], d += M[2] * S[0] - M[0] * S[2], E += M[0] * S[1] - M[1] * S[0];
        }
        const h = Math.hypot(f, d, E) / 2, y = s * c * h * q;
        for (const T of a) e(T, -y / a.length);
      }
    }), console.log(`[e2kParser] peso propio (SELFWEIGHT ${q}): ${n.toFixed(3)} kN repartidos a los nudos`), W;
  }, _t = () => {
    const n = [];
    for (const [e, t] of At) {
      const o = k.get(t);
      !o || o.tipo !== "point" || o.k.forEach((s, a) => {
        s > 0 && n.push({ node: e, dof: a, k: s });
      });
    }
    return n.length ? n : void 0;
  };
  return { units: l, stories: r.reverse(), materials: p, frameSections: I, nodes: U, nodeNames: Dt, nodeNameToIdx: j, elements: Y, elementNames: X, elementTypes: Mt, elementStories: tt, elementSections: it, nodeInputs: { supports: Et, loads: Qt(), springNames: At, springs: _t() }, elementInputs: { elasticities: lt, shearModuli: ft, areas: pt, momentsOfInertiaZ: Rt, momentsOfInertiaY: yt, torsionalConstants: Ot, shearAreasY: St, shearAreasZ: Nt, rigidOffsets: rt, momentReleases: kt, localAngles: Gt, endOffsets: st, densities: new Map([...Q].map(([n, e]) => [n, e / 9.80665])), deckSections: Ft, sectionShapes: dt, thicknesses: mt, poissonsRatios: Bt, plateFormulations: Yt, shellModifiers: Wt, springNames: Tt, mallaEnCruces: xt }, sectionShapes: dt, grids: It, planosRef: gt, springProps: k, info: { ...Kt(Y, Et), nNodes: U.length, nFrames: Y.length - Lt.length, nAreas: R.length, nAreasMontadas: Lt.length, nSDCompuestas: $t, nSDLeidas: b.size, title: bt }, rawSections: at };
}
function Kt(g, u) {
  const l = /* @__PURE__ */ new Map();
  for (const R of g) for (const F of R) for (const C of R) F !== C && (l.has(F) || l.set(F, []), l.get(F).push(C));
  const r = /* @__PURE__ */ new Set();
  for (const R of g) for (const F of R) r.add(F);
  const p = new Set([...u ?? /* @__PURE__ */ new Map()].map(([R]) => R)), I = /* @__PURE__ */ new Set();
  let N = 0, O = 0;
  for (const R of r) {
    if (I.has(R)) continue;
    const F = [R], C = [];
    for (I.add(R); F.length; ) {
      const b = F.pop();
      C.push(b);
      for (const A of l.get(b) ?? []) I.has(A) || (I.add(A), F.push(A));
    }
    C.some((b) => p.has(b)) || (N++, O += C.length);
  }
  return { nPiezasFlotantes: N, nNudosFlotantes: O };
}
export {
  Kt as a,
  fs as p
};
