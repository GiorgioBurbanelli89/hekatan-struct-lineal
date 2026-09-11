import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-Dxpmbnyd.js";
import { a as S } from "./analyze-DgLgRmKg.js";
import { d as z, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as C } from "./getViewer-D6CRppMe.js";
import { g as M } from "./getParameters-Bf35D0lJ.js";
import { g as _ } from "./styles-DjzQZscE.js";
import { g as k, __tla as __tla_1 } from "./getCad3d-470Zquoa.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./renderModalTable-BJWFR1R0.js";
import "./e2kParser-UQm6yNuB.js";
import "./cadSections-DVtTZU6U.js";
import "./e2kExporter-BnaArqJz.js";
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
  }, i = a.state([]), l = a.state([]), r = a.state({}), u = a.state({}), f = a.state({}), g = a.state({});
  a.derive(() => {
    const b = n.span.value.val, e = n.divisions.value.val, w = n.height.value.val, y = n.elasticity.value.val * 1e6, x = n.area.value.val * 1e-4, I = n.load.value.val, p = [], s = [], d = b / e, c = [];
    for (let t = 0; t <= e; t++) {
      const o = [
        d * t,
        0,
        0
      ];
      p.push(o), c.push(o);
    }
    for (let t = 0; t <= e; t++) p.push([
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
    }, m = {
      elasticities: new Map(s.map((t, o) => [
        o,
        y
      ])),
      areas: new Map(s.map((t, o) => [
        o,
        x
      ]))
    }, h = z(p, s, v, m), O = S(p, s, m, h);
    i.val = p, l.val = s, r.val = v, u.val = m, f.val = h, g.val = O;
  });
  document.body.append(k({
    nodes: i,
    elements: l,
    nodeInputs: r,
    elementInputs: u
  }), M(n), C({
    mesh: {
      nodes: i,
      elements: l,
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
