import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n } from "./Text-BE1eWO-3.js";
import { a as L, __tla as __tla_0 } from "./analyze-BQ-8aq8N.js";
import { d as P, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as R, a as W, __tla as __tla_2 } from "./aiAgent-Ocg1dyZM.js";
import { g as E, __tla as __tla_3 } from "./getParameters-Cpy8HY4C.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })()
]).then(async () => {
  const _ = 2e8, O = 0.3, G = _ / (2 * (1 + O)), T = 78, u = {
    span: {
      value: n.state(60),
      min: 20,
      max: 200,
      step: 5,
      label: "Luz total (m)"
    },
    towerH: {
      value: n.state(20),
      min: 8,
      max: 60,
      step: 2,
      label: "Altura torre (m)"
    },
    deckH: {
      value: n.state(8),
      min: 2,
      max: 20,
      step: 1,
      label: "Altura tablero (m)"
    },
    deckW: {
      value: n.state(6),
      min: 2,
      max: 15,
      step: 0.5,
      label: "Ancho tablero (m)"
    },
    nSpanDiv: {
      value: n.state(16),
      min: 8,
      max: 40,
      step: 1,
      label: "Subdivisiones span"
    },
    loadDeck: {
      value: n.state(-30),
      min: -150,
      max: 0,
      step: 5,
      label: "Carga por nodo (kN)"
    }
  }, y = n.state([]), D = n.state([]), z = n.state({}), H = n.state({}), C = n.state({}), N = n.state({});
  n.derive(() => {
    const m = u.span.value.val, w = u.towerH.value.val, d = u.deckH.value.val, p = u.deckW.value.val, o = Math.round(u.nSpanDiv.value.val), g = u.loadDeck.value.val, a = [], s = [];
    for (let e = 0; e <= o; e++) {
      const t = m * e / o;
      a.push([
        t,
        -p / 2,
        d
      ]), a.push([
        t,
        p / 2,
        d
      ]);
    }
    const k = a.length;
    for (let e = 0; e < o; e++) s.push([
      e * 2,
      (e + 1) * 2
    ]), s.push([
      e * 2 + 1,
      (e + 1) * 2 + 1
    ]), s.push([
      e * 2,
      e * 2 + 1
    ]);
    s.push([
      o * 2,
      o * 2 + 1
    ]);
    const M = [
      Math.round(o / 3),
      Math.round(2 * o / 3)
    ], x = [];
    for (const e of M) {
      const t = m * e / o, l = a.length;
      a.push([
        t,
        -p / 2,
        0
      ]);
      const b = a.length;
      a.push([
        t,
        p / 2,
        0
      ]);
      const c = a.length;
      a.push([
        t,
        -p / 2,
        w + d
      ]);
      const i = a.length;
      a.push([
        t,
        p / 2,
        w + d
      ]), x.push(c, i), s.push([
        l,
        e * 2
      ]), s.push([
        e * 2,
        c
      ]), s.push([
        b,
        e * 2 + 1
      ]), s.push([
        e * 2 + 1,
        i
      ]), s.push([
        c,
        i
      ]);
    }
    for (const e of x) {
      const t = a[e][0];
      for (let l = 0; l <= o; l++) {
        const b = m * l / o, c = Math.abs(b - t);
        if (c > m * 0.05 && c < m * 0.45 && l % 2 === 0) {
          const i = a[e][1] < 0 ? l * 2 : l * 2 + 1;
          s.push([
            e,
            i
          ]);
        }
      }
    }
    const A = o * 3 + 1, r = /* @__PURE__ */ new Map();
    r.set(0, [
      true,
      true,
      true,
      false,
      false,
      false
    ]), r.set(1, [
      true,
      true,
      true,
      false,
      false,
      false
    ]), r.set(o * 2, [
      false,
      true,
      true,
      false,
      false,
      false
    ]), r.set(o * 2 + 1, [
      false,
      true,
      true,
      false,
      false,
      false
    ]);
    for (let e = k; e < k + M.length * 4; e += 4) r.set(e, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), r.set(e + 1, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const f = /* @__PURE__ */ new Map();
    for (let e = 0; e <= o; e++) f.set(e * 2, [
      0,
      0,
      g,
      0,
      0,
      0
    ]), f.set(e * 2 + 1, [
      0,
      0,
      g,
      0,
      0,
      0
    ]);
    const S = {
      supports: r,
      loads: f
    }, h = {
      elasticities: new Map(s.map((e, t) => [
        t,
        _
      ])),
      shearModuli: new Map(s.map((e, t) => [
        t,
        G
      ])),
      areas: new Map(s.map((e, t) => [
        t,
        t < A ? 0.02 : 1e-3
      ])),
      momentsOfInertiaY: new Map(s.map((e, t) => [
        t,
        5e-5
      ])),
      momentsOfInertiaZ: new Map(s.map((e, t) => [
        t,
        2e-5
      ])),
      torsionalConstants: new Map(s.map((e, t) => [
        t,
        1e-5
      ])),
      densities: new Map(s.map((e, t) => [
        t,
        T
      ])),
      poissonsRatios: new Map(s.map((e, t) => [
        t,
        O
      ]))
    };
    let v = {}, I = {};
    try {
      v = P(a, s, S, h), I = L(a, s, h, v);
    } catch (e) {
      console.warn("Puente deform/analyze:", (e == null ? void 0 : e.message) ?? e);
    }
    y.val = a, D.val = s, z.val = S, H.val = h, C.val = v, N.val = I;
  });
  document.body.append(E(u), R({
    mesh: {
      nodes: y,
      elements: D,
      nodeInputs: z,
      elementInputs: H,
      deformOutputs: C,
      analyzeOutputs: N
    },
    settingsObj: {
      deformedShape: true
    }
  }), W({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/cable-stayed-bridge/main.ts"
  }));
});
