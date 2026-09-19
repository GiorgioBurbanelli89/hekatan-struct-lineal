import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./Text-BE1eWO-3.js";
import { a as C, __tla as __tla_0 } from "./analyze-CW2pK7-V.js";
import { d as H, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as D, a as G, __tla as __tla_2 } from "./aiAgent-BdxJjwS0.js";
import { g as k, __tla as __tla_3 } from "./getParameters-BfCQ31Oa.js";
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
  }, I = s.state([]), g = s.state([]), _ = s.state({}), x = s.state({}), y = s.state({}), O = s.state({});
  s.derive(() => {
    const S = o.H.value.val, z = o.span.value.val, c = o.depth.value.val, n = Math.round(o.nDiv.value.val), A = o.A.value.val, l = o.I.value.val, d = o.load.value.val, r = [], a = [];
    for (let e = 0; e <= n; e++) {
      const t = e / n, f = z * t, b = S * (1 - Math.pow(2 * t - 1, 2));
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
    for (let e = 0; e < n; e++) a.push([
      e * 2,
      (e + 1) * 2
    ]), a.push([
      e * 2 + 1,
      (e + 1) * 2 + 1
    ]), a.push([
      e * 2,
      e * 2 + 1
    ]), a.push([
      e * 2,
      (e + 1) * 2 + 1
    ]), a.push([
      e * 2 + 1,
      (e + 1) * 2
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
    const p = /* @__PURE__ */ new Map();
    for (let e = 0; e <= n; e++) p.set(e * 2, [
      0,
      0,
      d,
      0,
      0,
      0
    ]), p.set(e * 2 + 1, [
      0,
      0,
      d,
      0,
      0,
      0
    ]);
    const v = {
      supports: u,
      loads: p
    }, m = {
      elasticities: new Map(a.map((e, t) => [
        t,
        w
      ])),
      shearModuli: new Map(a.map((e, t) => [
        t,
        P
      ])),
      areas: new Map(a.map((e, t) => [
        t,
        A
      ])),
      momentsOfInertiaY: new Map(a.map((e, t) => [
        t,
        l
      ])),
      momentsOfInertiaZ: new Map(a.map((e, t) => [
        t,
        l
      ])),
      torsionalConstants: new Map(a.map((e, t) => [
        t,
        2 * l
      ])),
      densities: new Map(a.map((e, t) => [
        t,
        j
      ])),
      poissonsRatios: new Map(a.map((e, t) => [
        t,
        M
      ]))
    };
    let i = {}, h = {};
    try {
      i = H(r, a, v, m), h = C(r, a, m, i);
    } catch (e) {
      console.warn("Gateway Arch deform/analyze:", (e == null ? void 0 : e.message) ?? e);
    }
    I.val = r, g.val = a, _.val = v, x.val = m, y.val = i, O.val = h;
  });
  document.body.append(k(o), D({
    mesh: {
      nodes: I,
      elements: g,
      nodeInputs: _,
      elementInputs: x,
      deformOutputs: y,
      analyzeOutputs: O
    },
    settingsObj: {
      deformedShape: true
    }
  }), G({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/gateway-arch/main.ts"
  }));
});
