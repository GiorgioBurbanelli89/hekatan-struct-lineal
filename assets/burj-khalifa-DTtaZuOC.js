import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as o } from "./Text-BE1eWO-3.js";
import { a as G, __tla as __tla_0 } from "./analyze-CW2pK7-V.js";
import { d as E, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as K, a as N, __tla as __tla_2 } from "./aiAgent-BdxJjwS0.js";
import { g as T, __tla as __tla_3 } from "./getParameters-BfCQ31Oa.js";
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
  const O = 35e6, y = 0.2, V = O / (2 * (1 + y)), W = 24 / 9.81, i = {
    nFloors: {
      value: o.state(20),
      min: 8,
      max: 50,
      step: 1,
      label: "Pisos"
    },
    H_floor: {
      value: o.state(3),
      min: 2.5,
      max: 6,
      step: 0.5,
      label: "Altura piso (m)"
    },
    baseR: {
      value: o.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Radio base (m)"
    },
    windFactor: {
      value: o.state(5),
      min: 0,
      max: 30,
      step: 1,
      label: "Carga viento top (kN)"
    }
  }, z = o.state([]), S = o.state([]), P = o.state({}), R = o.state({}), C = o.state({}), j = o.state({}), m = 3;
  o.derive(() => {
    const c = Math.round(i.nFloors.value.val), k = i.H_floor.value.val, H = i.baseR.value.val, A = i.windFactor.value.val, l = [], s = [];
    for (let t = 0; t <= c; t++) {
      const e = t / c, u = t * k;
      let d = H * (1 - e * 0.7);
      e > 0.4 && (d *= 0.85), e > 0.7 && (d *= 0.7);
      const r = l.length;
      l.push([
        0,
        0,
        u
      ]);
      for (let n = 0; n < m; n++) {
        const p = n * 2 * Math.PI / m - Math.PI / 2, a = d * Math.cos(p), _ = d * Math.sin(p), x = l.length;
        l.push([
          a,
          _,
          u
        ]), s.push([
          r,
          x
        ]);
        const F = l.length;
        l.push([
          a * 0.5,
          _ * 0.5,
          u
        ]), s.push([
          r,
          F
        ]), s.push([
          F,
          x
        ]);
      }
      for (let n = 0; n < m; n++) {
        const p = r + 1 + n * 2, a = r + 1 + (n + 1) % m * 2;
        s.push([
          p,
          a
        ]);
      }
      if (t < c) {
        const n = 1 + m * 2, p = r + n;
        s.push([
          r,
          p
        ]);
        for (let a = 0; a < m; a++) s.push([
          r + 1 + a * 2,
          p + 1 + a * 2
        ]), s.push([
          r + 2 + a * 2,
          p + 2 + a * 2
        ]), s.push([
          r + 1 + a * 2,
          p + 2 + a * 2
        ]);
      }
    }
    const w = 1 + m * 2, b = /* @__PURE__ */ new Map();
    for (let t = 0; t < w; t++) b.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const M = /* @__PURE__ */ new Map();
    for (let t = 1; t <= c; t++) {
      const e = t * w, u = A * t / c;
      M.set(e, [
        u,
        0,
        -10,
        0,
        0,
        0
      ]);
    }
    const g = {
      supports: b,
      loads: M
    }, B = 0.02, h = 5e-5, f = {
      elasticities: new Map(s.map((t, e) => [
        e,
        O
      ])),
      shearModuli: new Map(s.map((t, e) => [
        e,
        V
      ])),
      areas: new Map(s.map((t, e) => [
        e,
        B
      ])),
      momentsOfInertiaY: new Map(s.map((t, e) => [
        e,
        h
      ])),
      momentsOfInertiaZ: new Map(s.map((t, e) => [
        e,
        h
      ])),
      torsionalConstants: new Map(s.map((t, e) => [
        e,
        2 * h
      ])),
      densities: new Map(s.map((t, e) => [
        e,
        W
      ])),
      poissonsRatios: new Map(s.map((t, e) => [
        e,
        y
      ]))
    };
    let v = {}, I = {};
    try {
      v = E(l, s, g, f), I = G(l, s, f, v);
    } catch (t) {
      console.warn("Burj Khalifa deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    z.val = l, S.val = s, P.val = g, R.val = f, C.val = v, j.val = I;
  });
  document.body.append(T(i), K({
    mesh: {
      nodes: z,
      elements: S,
      nodeInputs: P,
      elementInputs: R,
      deformOutputs: C,
      analyzeOutputs: j
    },
    settingsObj: {
      deformedShape: true
    }
  }), N({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/burj-khalifa/main.ts"
  }));
});
