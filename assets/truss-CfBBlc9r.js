import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-C-zoknmI.js";
import { a as S, __tla as __tla_0 } from "./analyze-D2CgF9kw.js";
import { d as z, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as C, __tla as __tla_2 } from "./getViewer-BHcPQXHj.js";
import { g as M } from "./getParameters-Dt61s_50.js";
import { g as _ } from "./styles-CqEyA8nI.js";
import { g as k, __tla as __tla_3 } from "./getCad3d-CdJtM5b9.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./Text-Cehu0nom.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_4 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./renderModalTable-CaPpqUR8.js";
import "./e2kParser-2258z7Gj.js";
import "./cadSections-Cc6U2MoW.js";
import "./e2kExporter-BO9KJmGa.js";
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
  }, m = a.state([]), i = a.state([]), r = a.state({}), u = a.state({}), f = a.state({}), g = a.state({});
  a.derive(() => {
    const b = n.span.value.val, e = n.divisions.value.val, w = n.height.value.val, y = n.elasticity.value.val * 1e6, x = n.area.value.val * 1e-4, I = n.load.value.val, l = [], s = [], d = b / e, c = [];
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
      w
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
    }, p = {
      elasticities: new Map(s.map((t, o) => [
        o,
        y
      ])),
      areas: new Map(s.map((t, o) => [
        o,
        x
      ]))
    }, h = z(l, s, v, p), O = S(l, s, p, h);
    m.val = l, i.val = s, r.val = v, u.val = p, f.val = h, g.val = O;
  });
  document.body.append(k({
    nodes: m,
    elements: i,
    nodeInputs: r,
    elementInputs: u
  }), M(n), C({
    mesh: {
      nodes: m,
      elements: i,
      nodeInputs: r,
      elementInputs: u,
      deformOutputs: f,
      analyzeOutputs: g
    },
    settingsObj: {
      deformedShape: true
    }
  }), _({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/truss/main.ts",
    author: "https://www.linkedin.com/in/madil4/"
  }));
});
