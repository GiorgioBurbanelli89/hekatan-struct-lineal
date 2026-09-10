import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./theme-Dxpmbnyd.js";
import { a as y } from "./analyze-DgLgRmKg.js";
import { d as z, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as I } from "./getViewer-B0x6YucZ.js";
import { g as S } from "./getParameters-Bf35D0lJ.js";
import { g as O } from "./styles-DjzQZscE.js";
import { g as M, __tla as __tla_1 } from "./getCad3d-470Zquoa.js";
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
  const o = {
    dx: {
      value: e.state(2),
      min: 1,
      max: 5,
      step: 0.1,
      label: "dx (m)"
    },
    dy: {
      value: e.state(2),
      min: 1,
      max: 5,
      step: 0.1,
      label: "dy (m)"
    },
    dz: {
      value: e.state(2),
      min: 1,
      max: 5,
      step: 0.1,
      label: "dz (m)"
    },
    divisions: {
      value: e.state(4),
      min: 1,
      max: 10,
      step: 1
    },
    load: {
      value: e.state(30),
      min: 1,
      max: 50,
      step: 0.5,
      label: "load (kN)"
    }
  }, i = e.state([]), u = e.state([]), d = e.state({}), v = e.state({}), x = e.state({}), b = e.state({});
  e.derive(() => {
    const c = o.dx.value.val, f = o.dy.value.val, m = o.dz.value.val, n = o.divisions.value.val;
    let s = [], a = [];
    for (let t = 0; t <= n; t++) s.push([
      0,
      0,
      m * t
    ], [
      c,
      0,
      m * t
    ], [
      c,
      f,
      m * t
    ], [
      0,
      f,
      m * t
    ]);
    s = s.map((t) => [
      6 + t[0],
      6 + t[1],
      t[2]
    ]);
    for (let t = 0; t < n * 4; ) t += 4, a.push([
      t,
      t + 1
    ], [
      t + 1,
      t + 2
    ], [
      t + 2,
      t + 3
    ], [
      t + 3,
      t
    ]), a.push([
      t,
      t + 2
    ]);
    for (let t = 0; t < n * 4; t++) a.push([
      t,
      t + 4
    ]);
    for (let t = 0; t < n * 4; t += 4) a.push([
      t,
      t + 5
    ], [
      t + 3,
      t + 6
    ]), a.push([
      t,
      t + 7
    ], [
      t + 1,
      t + 6
    ]);
    const p = [
      true,
      true,
      true,
      true,
      true,
      true
    ], h = {
      supports: /* @__PURE__ */ new Map([
        [
          0,
          p
        ],
        [
          1,
          p
        ],
        [
          2,
          p
        ],
        [
          3,
          p
        ]
      ]),
      loads: /* @__PURE__ */ new Map([
        [
          s.length - 2,
          [
            o.load.value.val,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ])
    }, l = {
      elasticities: new Map(a.map((t, r) => [
        r,
        100
      ])),
      areas: new Map(a.map((t, r) => [
        r,
        10
      ]))
    }, g = z(s, a, h, l), w = y(s, a, l, g);
    i.val = s, u.val = a, d.val = h, v.val = l, x.val = g, b.val = w;
  });
  document.body.append(M({
    nodes: i,
    elements: u,
    nodeInputs: d,
    elementInputs: v
  }), S(o), I({
    mesh: {
      nodes: i,
      elements: u,
      nodeInputs: d,
      elementInputs: v,
      deformOutputs: x,
      analyzeOutputs: b
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 15
    }
  }), O({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/3d-structure/main.ts",
    author: "https://www.linkedin.com/in/madil4/"
  }));
});
