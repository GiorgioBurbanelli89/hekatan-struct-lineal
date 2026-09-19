import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./Text-BE1eWO-3.js";
import { a as S, __tla as __tla_0 } from "./analyze-CoM5hauA.js";
import { d as z, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as C, a as M, __tla as __tla_2 } from "./aiAgent-DlwrNRGZ.js";
import { g as k, __tla as __tla_3 } from "./getParameters-MpK2zdCh.js";
import { g as _, __tla as __tla_4 } from "./getCad3d-D3TiSTj0.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_5 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./modeScale-DSJIAfp5.js";
import "./e2kParser-Dssv0x8x.js";
import "./cadSections-BcRFaG1j.js";
import "./materials-VwssM8Vw.js";
import "./e2kExporter-nCEi9nQ_.js";
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
  })(),
  (() => {
    try {
      return __tla_5;
    } catch {
    }
  })()
]).then(async () => {
  const n = {
    span: {
      value: a.state(15),
      min: 5,
      max: 20,
      step: 1,
      label: "span (m)"
    },
    divisions: {
      value: a.state(5),
      min: 2,
      max: 5,
      step: 1
    },
    height: {
      value: a.state(2),
      min: 1,
      max: 5,
      step: 0.1,
      label: "height (m)"
    },
    elasticity: {
      value: a.state(10),
      min: 1,
      max: 250,
      step: 1,
      label: "Elasticity (gpa)"
    },
    area: {
      value: a.state(10),
      min: 1,
      max: 300,
      step: 1,
      label: "area (cm2)"
    },
    load: {
      value: a.state(250),
      min: 1,
      max: 500,
      step: 1,
      label: "load (kN)"
    }
  }, p = a.state([]), i = a.state([]), m = a.state({}), u = a.state({}), f = a.state({}), g = a.state({});
  a.derive(() => {
    const b = n.span.value.val, e = n.divisions.value.val, y = n.height.value.val, w = n.elasticity.value.val * 1e6, x = n.area.value.val * 1e-4, I = n.load.value.val, l = [], s = [], d = b / e, c = [];
    for (let t = 0; t <= e; t++) {
      const o = [
        d * t,
        0,
        0
      ];
      l.push(o), c.push(o);
    }
    for (let t = 0; t <= e; t++) l.push([
      d * t,
      0,
      y
    ]);
    for (let t = 0; t < e; t++) s.push([
      t,
      t + 1
    ]);
    for (let t = 0; t < e; t++) s.push([
      e + 1 + t,
      e + 1 + t + 1
    ]);
    for (let t = 0; t <= e; t++) s.push([
      t,
      e + 1 + t
    ]);
    for (let t = 0; t < e; t++) t < e / 2 ? s.push([
      t,
      e + 1 + t + 1
    ]) : s.push([
      e + 1 + t,
      t + 1
    ]);
    const v = {
      supports: /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ],
        [
          e,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]),
      loads: new Map(c.map((t, o) => [
        o,
        [
          0,
          0,
          -I,
          0,
          0,
          0
        ]
      ]))
    }, r = {
      elasticities: new Map(s.map((t, o) => [
        o,
        w
      ])),
      areas: new Map(s.map((t, o) => [
        o,
        x
      ]))
    }, h = z(l, s, v, r), O = S(l, s, r, h);
    p.val = l, i.val = s, m.val = v, u.val = r, f.val = h, g.val = O;
  });
  document.body.append(_({
    nodes: p,
    elements: i,
    nodeInputs: m,
    elementInputs: u
  }), k(n), C({
    mesh: {
      nodes: p,
      elements: i,
      nodeInputs: m,
      elementInputs: u,
      deformOutputs: f,
      analyzeOutputs: g
    },
    settingsObj: {
      deformedShape: true
    }
  }), M({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/truss/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
});
