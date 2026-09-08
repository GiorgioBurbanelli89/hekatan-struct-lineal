import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./theme-U-6D_qyI.js";
import { a as C } from "./analyze-BFwM3Jvn.js";
import { d as H, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { g as D } from "./getViewer-DinxSNay.js";
import { g as G } from "./getParameters-CcvO4YbC.js";
import { g as k } from "./styles-SbI03m7S.js";
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
  const w = 2e8, M = 0.3, P = w / (2 * (1 + M)), j = 78, o = {
    H: {
      value: s.state(20),
      min: 5,
      max: 50,
      step: 1,
      label: "Altura H (m)"
    },
    span: {
      value: s.state(20),
      min: 5,
      max: 60,
      step: 1,
      label: "Luz (m)"
    },
    depth: {
      value: s.state(2),
      min: 0.5,
      max: 8,
      step: 0.5,
      label: "Profundidad arcos (m)"
    },
    nDiv: {
      value: s.state(20),
      min: 6,
      max: 50,
      step: 1,
      label: "Subdivisiones"
    },
    A: {
      value: s.state(0.01),
      min: 1e-3,
      max: 0.05,
      step: 1e-3,
      label: "\xC1rea (m\xB2)"
    },
    I: {
      value: s.state(5e-6),
      min: 5e-7,
      max: 5e-5,
      step: 5e-7,
      label: "Inercia (m\u2074)"
    },
    load: {
      value: s.state(-20),
      min: -100,
      max: 0,
      step: 5,
      label: "Carga por nodo (kN)"
    }
  }, g = s.state([]), I = s.state([]), _ = s.state({}), x = s.state({}), y = s.state({}), O = s.state({});
  s.derive(() => {
    const S = o.H.value.val, z = o.span.value.val, c = o.depth.value.val, n = Math.round(o.nDiv.value.val), A = o.A.value.val, p = o.I.value.val, d = o.load.value.val, r = [], a = [];
    for (let t = 0; t <= n; t++) {
      const e = t / n, f = z * e, b = S * (1 - Math.pow(2 * e - 1, 2));
      r.push([
        f,
        -c / 2,
        b
      ]), r.push([
        f,
        c / 2,
        b
      ]);
    }
    for (let t = 0; t < n; t++) a.push([
      t * 2,
      (t + 1) * 2
    ]), a.push([
      t * 2 + 1,
      (t + 1) * 2 + 1
    ]), a.push([
      t * 2,
      t * 2 + 1
    ]), a.push([
      t * 2,
      (t + 1) * 2 + 1
    ]), a.push([
      t * 2 + 1,
      (t + 1) * 2
    ]);
    a.push([
      n * 2,
      n * 2 + 1
    ]);
    const u = /* @__PURE__ */ new Map();
    u.set(0, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), u.set(1, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), u.set(n * 2, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), u.set(n * 2 + 1, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const l = /* @__PURE__ */ new Map();
    for (let t = 0; t <= n; t++) l.set(t * 2, [
      0,
      0,
      d,
      0,
      0,
      0
    ]), l.set(t * 2 + 1, [
      0,
      0,
      d,
      0,
      0,
      0
    ]);
    const v = {
      supports: u,
      loads: l
    }, m = {
      elasticities: new Map(a.map((t, e) => [
        e,
        w
      ])),
      shearModuli: new Map(a.map((t, e) => [
        e,
        P
      ])),
      areas: new Map(a.map((t, e) => [
        e,
        A
      ])),
      momentsOfInertiaY: new Map(a.map((t, e) => [
        e,
        p
      ])),
      momentsOfInertiaZ: new Map(a.map((t, e) => [
        e,
        p
      ])),
      torsionalConstants: new Map(a.map((t, e) => [
        e,
        2 * p
      ])),
      densities: new Map(a.map((t, e) => [
        e,
        j
      ])),
      poissonsRatios: new Map(a.map((t, e) => [
        e,
        M
      ]))
    };
    let i = {}, h = {};
    try {
      i = H(r, a, v, m), h = C(r, a, m, i);
    } catch (t) {
      console.warn("Gateway Arch deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    g.val = r, I.val = a, _.val = v, x.val = m, y.val = i, O.val = h;
  });
  document.body.append(G(o), D({
    mesh: {
      nodes: g,
      elements: I,
      nodeInputs: _,
      elementInputs: x,
      deformOutputs: y,
      analyzeOutputs: O
    },
    settingsObj: {
      deformedShape: true
    }
  }), k({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/gateway-arch/main.ts"
  }));
});
