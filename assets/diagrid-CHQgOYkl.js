import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n } from "./theme-Dxpmbnyd.js";
import { a as H } from "./analyze-DgLgRmKg.js";
import { d as k, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as A } from "./getViewer-B2nTowOf.js";
import { g as B } from "./getParameters-BHL5hAP0.js";
import { g as G } from "./styles-Ce_UnsFA.js";
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
  const _ = 2e8, I = 0.3, j = _ / (2 * (1 + I)), D = 78, p = {
    nFloors: {
      value: n.state(15),
      min: 5,
      max: 30,
      step: 1,
      label: "Pisos"
    },
    H_floor: {
      value: n.state(3.5),
      min: 2,
      max: 6,
      step: 0.5,
      label: "Altura piso (m)"
    },
    nCols: {
      value: n.state(12),
      min: 6,
      max: 20,
      step: 1,
      label: "Columnas per\xEDmetro"
    },
    baseR: {
      value: n.state(5),
      min: 2,
      max: 15,
      step: 0.5,
      label: "Radio base (m)"
    },
    windFactor: {
      value: n.state(3),
      min: 0,
      max: 20,
      step: 1,
      label: "Carga viento top (kN)"
    }
  }, x = n.state([]), z = n.state([]), C = n.state({}), O = n.state({}), R = n.state({}), y = n.state({});
  n.derive(() => {
    const r = Math.round(p.nFloors.value.val), F = p.H_floor.value.val, s = Math.round(p.nCols.value.val), v = p.baseR.value.val, S = p.windFactor.value.val, i = [], o = [];
    for (let t = 0; t <= r; t++) {
      const e = t / r, m = t * F;
      let l = v * (0.6 + 0.4 * Math.sin(Math.PI * e));
      e > 0.9 && (l = v * (0.6 + 0.4 * Math.sin(Math.PI * 0.9)) * (1 - (e - 0.9) * 8), l = Math.max(l, 1));
      for (let a = 0; a < s; a++) {
        const c = 2 * Math.PI * a / s;
        i.push([
          l * Math.cos(c),
          l * Math.sin(c),
          m
        ]);
      }
    }
    for (let t = 0; t < r; t++) {
      const e = t * s, m = (t + 1) * s;
      for (let a = 0; a < s; a++) o.push([
        e + a,
        e + (a + 1) % s
      ]);
      const l = t % 2 === 0 ? 1 : -1;
      for (let a = 0; a < s; a++) {
        const c = (a + l + s) % s;
        o.push([
          e + a,
          m + c
        ]), o.push([
          e + a,
          m + a
        ]);
      }
    }
    const h = r * s;
    for (let t = 0; t < s; t++) o.push([
      h + t,
      h + (t + 1) % s
    ]);
    const M = /* @__PURE__ */ new Map();
    for (let t = 0; t < s; t++) M.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const b = /* @__PURE__ */ new Map();
    for (let t = 1; t <= r; t++) {
      const e = t * s, m = S * t / r;
      for (let l = 0; l < s; l += 3) b.set(e + l, [
        m,
        0,
        -8,
        0,
        0,
        0
      ]);
    }
    const w = {
      supports: M,
      loads: b
    }, P = 6e-3, u = 8e-6, d = {
      elasticities: new Map(o.map((t, e) => [
        e,
        _
      ])),
      shearModuli: new Map(o.map((t, e) => [
        e,
        j
      ])),
      areas: new Map(o.map((t, e) => [
        e,
        P
      ])),
      momentsOfInertiaY: new Map(o.map((t, e) => [
        e,
        u
      ])),
      momentsOfInertiaZ: new Map(o.map((t, e) => [
        e,
        u
      ])),
      torsionalConstants: new Map(o.map((t, e) => [
        e,
        2 * u
      ])),
      densities: new Map(o.map((t, e) => [
        e,
        D
      ])),
      poissonsRatios: new Map(o.map((t, e) => [
        e,
        I
      ]))
    };
    let f = {}, g = {};
    try {
      f = k(i, o, w, d), g = H(i, o, d, f);
    } catch (t) {
      console.warn("Diagrid deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    x.val = i, z.val = o, C.val = w, O.val = d, R.val = f, y.val = g;
  });
  document.body.append(B(p), A({
    mesh: {
      nodes: x,
      elements: z,
      nodeInputs: C,
      elementInputs: O,
      deformOutputs: R,
      analyzeOutputs: y
    },
    settingsObj: {
      deformedShape: true
    }
  }), G({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/diagrid/main.ts"
  }));
});
