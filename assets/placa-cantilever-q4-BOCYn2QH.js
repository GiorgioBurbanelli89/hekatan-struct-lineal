import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-U-6D_qyI.js";
import { a as C } from "./analyze-BFwM3Jvn.js";
import { d as N, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { g as G } from "./getViewer-B5ndHpx0.js";
import { g as Q } from "./getParameters-CcvO4YbC.js";
import { g as X } from "./styles-SbI03m7S.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-ZnZ8PQ4z.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
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
  const n = {
    Lx: {
      value: a.state(4),
      min: 1,
      max: 12,
      step: 0.5,
      label: "Lx (m)"
    },
    Ly: {
      value: a.state(2),
      min: 0.5,
      max: 8,
      step: 0.5,
      label: "Ly (m)"
    },
    t: {
      value: a.state(0.15),
      min: 0.05,
      max: 0.5,
      step: 0.05,
      label: "Espesor (m)"
    },
    nx: {
      value: a.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Mesh nx"
    },
    ny: {
      value: a.state(4),
      min: 2,
      max: 12,
      step: 1,
      label: "Mesh ny"
    },
    E: {
      value: a.state(25e6),
      min: 1e7,
      max: 5e7,
      step: 1e6,
      label: "E (kN/m\xB2)"
    },
    nu: {
      value: a.state(0.2),
      min: 0,
      max: 0.49,
      step: 0.05,
      label: "\u03BD"
    },
    P: {
      value: a.state(20),
      min: 0,
      max: 200,
      step: 5,
      label: "Carga total borde (kN)"
    }
  }, b = a.state([]), h = a.state([]), g = a.state({}), M = a.state({}), w = a.state({}), L = a.state({});
  a.derive(() => {
    const E = n.Lx.value.val, O = n.Ly.value.val, S = n.t.value.val, l = Math.round(n.nx.value.val), m = Math.round(n.ny.value.val), c = n.E.value.val, v = n.nu.value.val, I = n.P.value.val, P = c / (2 * (1 + v)), _ = E / l, j = O / m, p = [], s = [];
    for (let t = 0; t <= m; t++) for (let e = 0; e <= l; e++) p.push([
      e * _,
      0,
      t * j
    ]);
    const o = l + 1;
    for (let t = 0; t < m; t++) for (let e = 0; e < l; e++) s.push([
      t * o + e,
      t * o + e + 1,
      (t + 1) * o + e + 1,
      (t + 1) * o + e
    ]);
    const d = /* @__PURE__ */ new Map();
    for (let t = 0; t <= m; t++) d.set(t * o, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const u = [];
    for (let t = 0; t <= m; t++) u.push(t * o + l);
    const z = I / u.length, f = /* @__PURE__ */ new Map();
    for (const t of u) f.set(t, [
      0,
      -z,
      0,
      0,
      0,
      0
    ]);
    const x = {
      supports: d,
      loads: f
    }, i = {
      elasticities: new Map(s.map((t, e) => [
        e,
        c
      ])),
      poissonsRatios: new Map(s.map((t, e) => [
        e,
        v
      ])),
      thicknesses: new Map(s.map((t, e) => [
        e,
        S
      ])),
      shearModuli: new Map(s.map((t, e) => [
        e,
        P
      ])),
      densities: new Map(s.map((t, e) => [
        e,
        24 / 9.80665
      ]))
    };
    let r = {}, y = {};
    try {
      r = N(p, s, x, i), y = C(p, s, i, r);
      const t = (m / 2 | 0) * o + l, e = r.deformations.get(t), k = e ? e[1] : 0;
      console.log(`Placa XY Q4: Uy_tip=${k.toExponential(4)} m`);
    } catch (t) {
      console.warn("Placa XY Q4 deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    b.val = p, h.val = s, g.val = x, M.val = i, w.val = r, L.val = y;
  });
  document.body.append(Q(n), G({
    mesh: {
      nodes: b,
      elements: h,
      nodeInputs: g,
      elementInputs: M,
      deformOutputs: w,
      analyzeOutputs: L
    },
    settingsObj: {
      deformedShape: true
    }
  }), X({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-cantilever-q4/main.ts"
  }));
});
