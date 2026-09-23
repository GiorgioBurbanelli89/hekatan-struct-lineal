import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as t, Q as x, V as p } from "./Text-Br8EG2up.js";
import { g as Y, a as O, __tla as __tla_0 } from "./aiAgent-UfwFmt02.js";
import { g as I } from "./getParameters-CuMShnHn.js";
import { c as X, g as D, __tla as __tla_1 } from "./getCad3d-DjzuokeJ.js";
import "./tweakpane-BXg6ZhiP.js";
import "./preload-helper-V2P8TQsQ.js";
import "./exampleVersion-D1A_5i59.js";
import "./analyze-C-HJ03ae.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./didacticCpp-iMwzdM-v.js";
import { __tla as __tla_3 } from "./deform-DGwQQaqs.js";
import { __tla as __tla_4 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./modeScale-sgWZ-KrB.js";
import "./e2kParser-Db5bKAgo.js";
import "./cadSections-BcRFaG1j.js";
import "./materials-VwssM8Vw.js";
import "./e2kExporter-BgDRO_ej.js";
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
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })()
]).then(async () => {
  const s = {
    xSpan: {
      value: t.state(16),
      min: 1,
      max: 20,
      step: 0.1,
      label: "xSpan (m)"
    },
    xDivisions: {
      value: t.state(14),
      min: 5,
      max: 20,
      step: 1
    },
    ySpan: {
      value: t.state(5),
      min: 1,
      max: 10,
      step: 0.1,
      label: "ySpan (m)"
    },
    yDivisions: {
      value: t.state(3),
      min: 1,
      max: 5,
      step: 1
    },
    height: {
      value: t.state(9),
      min: 0,
      max: 15,
      step: 0.1,
      label: "height (m)"
    },
    heightOffset: {
      value: t.state(0),
      min: -10,
      max: 10,
      step: 0.1,
      label: "height offset (m)"
    }
  }, i = t.state([]), m = t.state([]), u = t.state({}), c = t.state({}), h = t.state({
    deformations: /* @__PURE__ */ new Map(),
    reactions: /* @__PURE__ */ new Map()
  }), d = t.state({
    normals: /* @__PURE__ */ new Map(),
    shearsY: /* @__PURE__ */ new Map(),
    shearsZ: /* @__PURE__ */ new Map(),
    torsions: /* @__PURE__ */ new Map(),
    bendingsY: /* @__PURE__ */ new Map(),
    bendingsZ: /* @__PURE__ */ new Map(),
    bendingXX: /* @__PURE__ */ new Map(),
    bendingYY: /* @__PURE__ */ new Map(),
    bendingXY: /* @__PURE__ */ new Map(),
    membraneXX: /* @__PURE__ */ new Map(),
    membraneYY: /* @__PURE__ */ new Map(),
    membraneXY: /* @__PURE__ */ new Map(),
    tranverseShearX: /* @__PURE__ */ new Map(),
    tranverseShearY: /* @__PURE__ */ new Map()
  });
  t.derive(() => {
    if (X.val) return;
    const l = s.xSpan.value.val, n = s.xDivisions.value.val, w = s.ySpan.value.val, r = s.yDivisions.value.val, g = s.height.value.val, f = s.heightOffset.value.val, b = new x(new p(0, 0, 0), new p(0 + l / 2 + f, 0, g), new p(0 + l, 0, 0)), v = [], o = [];
    for (let e = 0; e <= r; e++) v.push(...b.getPoints(n).map((a) => (a.setY(0 + e * (w / r)), a.toArray())));
    for (let e = 0; e <= (r + 1) * n; e += n + 1) for (let a = 0; a < n; a++) o.push([
      e + a,
      e + a + 1
    ]);
    for (let e = 0; e < r * (n + 1); e += n + 1) for (let a = 0; a < n + 1; a++) o.push([
      a + e,
      a + n + 1 + e
    ]);
    const y = [
      ...Array(r + 1).keys()
    ].map((e) => (n + 1) * e), S = [
      ...Array(r + 1).keys()
    ].map((e) => (n + 1) * e + n), M = {
      supports: new Map([
        ...y.map((e) => [
          e,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]),
        ...S.map((e) => [
          e,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ])
      ])
    };
    i.val = v, m.val = o, u.val = M;
  });
  document.body.append(D({
    nodes: i,
    elements: m,
    nodeInputs: u,
    elementInputs: c,
    deformOutputs: h,
    analyzeOutputs: d
  }), I(s), Y({
    mesh: {
      nodes: i,
      elements: m,
      nodeInputs: u,
      elementInputs: c,
      deformOutputs: h,
      analyzeOutputs: d
    }
  }), O({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/curves/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
});
