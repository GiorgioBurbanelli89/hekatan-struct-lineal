import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n } from "./theme-Dxpmbnyd.js";
import { a as nt } from "./analyze-DgLgRmKg.js";
import { d as at, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as lt } from "./getViewer-Druzr40L.js";
import { g as rt } from "./getParameters-BHL5hAP0.js";
import { g as ct } from "./styles-Ce_UnsFA.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
import "./tweakpane-BXg6ZhiP.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const M = 2e8, F = 0.3, L = M / (2 * (1 + F)), j = 78, f = {
    Lx: {
      value: n.state(5.5),
      min: 2,
      max: 15,
      step: 0.5,
      label: "Lx (m)"
    },
    Ly: {
      value: n.state(8),
      min: 3,
      max: 20,
      step: 0.5,
      label: "Ly (m)"
    },
    H1: {
      value: n.state(3),
      min: 2,
      max: 6,
      step: 0.25,
      label: "H1 \u2014 bajo (m)"
    },
    H2: {
      value: n.state(4),
      min: 2,
      max: 8,
      step: 0.25,
      label: "H2 \u2014 alto (m)"
    },
    nCol: {
      value: n.state(4),
      min: 2,
      max: 10,
      step: 1,
      label: "Columnas (Y)"
    },
    nCorr: {
      value: n.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Correas"
    },
    tPanel: {
      value: n.state(5e-4),
      min: 1e-4,
      max: 5e-3,
      step: 1e-4,
      label: "Espesor panel (m)"
    },
    q: {
      value: n.state(1),
      min: 0,
      max: 5,
      step: 0.25,
      label: "Carga distribuida (kN/m\xB2)"
    }
  }, N = n.state([]), X = n.state([]), $ = n.state({}), K = n.state({}), Q = n.state({}), W = n.state({});
  function tt(d, c, u, m) {
    const l = d - 2 * u, C = 2 * c * u + l * m, R = (c * d * d * d - (c - m) * l * l * l) / 12, E = (2 * u * c * c * c + l * m * m * m) / 12, r = (2 * c * u * u * u + l * m * m * m) / 3;
    return {
      A: C,
      Iz: R,
      Iy: E,
      J: r
    };
  }
  const P = tt(0.16, 0.16, 0.013, 8e-3), Y = tt(0.2, 0.1, 85e-4, 56e-4), x = 0.06, A = 4e-3, it = x * x - (x - 2 * A) ** 2, V = (x ** 4 - (x - 2 * A) ** 4) / 12, mt = 2 * A * (x - A) ** 3 / 2;
  n.derive(() => {
    const d = f.Lx.value.val, c = f.Ly.value.val, u = f.H1.value.val, m = f.H2.value.val, l = Math.round(f.nCol.value.val), C = Math.round(f.nCorr.value.val), R = f.tPanel.value.val, E = f.q.value.val, r = 3, h = [
      0,
      d / 2,
      d
    ], z = [];
    for (let t = 0; t < l; t++) z.push(t * c / (l - 1));
    const G = /* @__PURE__ */ new Set();
    for (const t of z) G.add(t);
    for (let t = 0; t < C; t++) G.add(t * c / (C - 1));
    const p = Array.from(G).sort((t, e) => t - e), v = p.length, et = (t) => u + (m - u) * t / c, g = [], a = [], J = [], i = [];
    for (let t = 0; t < r; t++) {
      const e = [];
      for (let o = 0; o < l; o++) e.push(g.length), g.push([
        h[t],
        z[o],
        0
      ]);
      J.push(e);
      const s = [];
      for (let o = 0; o < v; o++) s.push(g.length), g.push([
        h[t],
        p[o],
        et(p[o])
      ]);
      i.push(s);
    }
    const y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
    for (let t = 0; t < r; t++) for (let e = 0; e < l; e++) {
      const s = p.indexOf(z[e]);
      if (s < 0) continue;
      const o = a.length;
      a.push([
        J[t][e],
        i[t][s]
      ]), y.set(o, M), b.set(o, L), S.set(o, P.A), k.set(o, P.Iy), w.set(o, P.Iz), O.set(o, P.J), I.set(o, j);
    }
    for (let t = 0; t < r; t++) for (let e = 0; e < v - 1; e++) {
      const s = a.length;
      a.push([
        i[t][e],
        i[t][e + 1]
      ]), y.set(s, M), b.set(s, L), S.set(s, Y.A), k.set(s, Y.Iy), w.set(s, Y.Iz), O.set(s, Y.J), I.set(s, j);
    }
    for (let t = 0; t < v; t++) for (let e = 0; e < r - 1; e++) {
      const s = a.length;
      a.push([
        i[e][t],
        i[e + 1][t]
      ]), y.set(s, M), b.set(s, L), S.set(s, it), k.set(s, V), w.set(s, V), O.set(s, mt), I.set(s, j);
    }
    for (let t = 0; t < r - 1; t++) for (let e = 0; e < v - 1; e++) {
      const s = a.length;
      a.push([
        i[t][e],
        i[t + 1][e],
        i[t + 1][e + 1],
        i[t][e + 1]
      ]), y.set(s, M), b.set(s, L), I.set(s, j);
    }
    const q = /* @__PURE__ */ new Map(), st = [
      true,
      true,
      true,
      true,
      true,
      true
    ];
    for (let t = 0; t < r; t++) for (let e = 0; e < l; e++) q.set(J[t][e], st);
    const D = /* @__PURE__ */ new Map();
    for (let t = 0; t < r; t++) for (let e = 0; e < v; e++) {
      let s = 0;
      t === 0 ? s = (h[1] - h[0]) / 2 : t === r - 1 ? s = (h[r - 1] - h[r - 2]) / 2 : s = (h[t + 1] - h[t - 1]) / 2;
      let o = 0;
      e === 0 ? o = (p[1] - p[0]) / 2 : e === v - 1 ? o = (p[v - 1] - p[v - 2]) / 2 : o = (p[e + 1] - p[e - 1]) / 2;
      const ot = -E * s * o;
      D.set(i[t][e], [
        0,
        0,
        ot,
        0,
        0,
        0
      ]);
    }
    const Z = {
      supports: q,
      loads: D
    }, B = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
    for (let t = 0; t < a.length; t++) a[t].length === 4 && (B.set(t, R), T.set(t, F));
    const _ = {
      elasticities: y,
      shearModuli: b,
      areas: S,
      momentsOfInertiaY: k,
      momentsOfInertiaZ: w,
      torsionalConstants: O,
      densities: I,
      thicknesses: B,
      poissonsRatios: T
    };
    let H = {}, U = {};
    try {
      H = at(g, a, Z, _), U = nt(g, a, _, H);
      let t = 0;
      H.deformations.forEach((e) => {
        Math.abs(e[2]) > Math.abs(t) && (t = e[2]);
      }), console.log(`P\xE9rgola: Uz_max=${t.toExponential(4)} m`);
    } catch (t) {
      console.warn("P\xE9rgola deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    N.val = g, X.val = a, $.val = Z, K.val = _, Q.val = H, W.val = U;
  });
  document.body.append(rt(f), lt({
    mesh: {
      nodes: N,
      elements: X,
      nodeInputs: $,
      elementInputs: K,
      deformOutputs: Q,
      analyzeOutputs: W
    },
    settingsObj: {
      deformedShape: true,
      shellResults: "displacementZ"
    }
  }), ct({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/pergola/main.ts"
  }));
});
