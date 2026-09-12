import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-DQ--CgsI.js";
import { a as G } from "./analyze-DgLgRmKg.js";
import { d as E, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as K } from "./getViewer-Bvx7pSSw.js";
import { g as N } from "./getParameters-DTL1yrut.js";
import { g as T } from "./styles-0iLl92Fx.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-ERv22veQ.js";
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
  const O = 35e6, y = 0.2, V = O / (2 * (1 + y)), W = 24 / 9.81, u = {
    nFloors: {
      value: a.state(20),
      min: 8,
      max: 50,
      step: 1,
      label: "Pisos"
    },
    H_floor: {
      value: a.state(3),
      min: 2.5,
      max: 6,
      step: 0.5,
      label: "Altura piso (m)"
    },
    baseR: {
      value: a.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Radio base (m)"
    },
    windFactor: {
      value: a.state(5),
      min: 0,
      max: 30,
      step: 1,
      label: "Carga viento top (kN)"
    }
  }, z = a.state([]), S = a.state([]), P = a.state({}), R = a.state({}), C = a.state({}), j = a.state({}), m = 3;
  a.derive(() => {
    const i = Math.round(u.nFloors.value.val), k = u.H_floor.value.val, H = u.baseR.value.val, A = u.windFactor.value.val, r = [], s = [];
    for (let t = 0; t <= i; t++) {
      const e = t / i, c = t * k;
      let d = H * (1 - e * 0.7);
      e > 0.4 && (d *= 0.85), e > 0.7 && (d *= 0.7);
      const l = r.length;
      r.push([
        0,
        0,
        c
      ]);
      for (let n = 0; n < m; n++) {
        const p = n * 2 * Math.PI / m - Math.PI / 2, o = d * Math.cos(p), _ = d * Math.sin(p), x = r.length;
        r.push([
          o,
          _,
          c
        ]), s.push([
          l,
          x
        ]);
        const F = r.length;
        r.push([
          o * 0.5,
          _ * 0.5,
          c
        ]), s.push([
          l,
          F
        ]), s.push([
          F,
          x
        ]);
      }
      for (let n = 0; n < m; n++) {
        const p = l + 1 + n * 2, o = l + 1 + (n + 1) % m * 2;
        s.push([
          p,
          o
        ]);
      }
      if (t < i) {
        const n = 1 + m * 2, p = l + n;
        s.push([
          l,
          p
        ]);
        for (let o = 0; o < m; o++) s.push([
          l + 1 + o * 2,
          p + 1 + o * 2
        ]), s.push([
          l + 2 + o * 2,
          p + 2 + o * 2
        ]), s.push([
          l + 1 + o * 2,
          p + 2 + o * 2
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
    const g = /* @__PURE__ */ new Map();
    for (let t = 1; t <= i; t++) {
      const e = t * w, c = A * t / i;
      g.set(e, [
        c,
        0,
        -10,
        0,
        0,
        0
      ]);
    }
    const M = {
      supports: b,
      loads: g
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
      v = E(r, s, M, f), I = G(r, s, f, v);
    } catch (t) {
      console.warn("Burj Khalifa deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    z.val = r, S.val = s, P.val = M, R.val = f, C.val = v, j.val = I;
  });
  document.body.append(N(u), K({
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
  }), T({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/burj-khalifa/main.ts"
  }));
});
