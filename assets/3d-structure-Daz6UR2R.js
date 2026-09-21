import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./Text-Br8EG2up.js";
import { a as z } from "./analyze-C-HJ03ae.js";
import { d as w, __tla as __tla_0 } from "./didacticCpp-CzlDWovh.js";
import { g as I, a as S } from "./aiAgent-_ArHj5zk.js";
import { g as O } from "./getParameters-BwnrNJjy.js";
import { g as M, __tla as __tla_1 } from "./getCad3d-C16TdqEa.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-DmQkkByq.js";
import "./preload-helper-V2P8TQsQ.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./modeScale-DSJIAfp5.js";
import "./e2kParser-Dssv0x8x.js";
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
  }, i = e.state([]), u = e.state([]), d = e.state({}), v = e.state({}), g = e.state({}), x = e.state({});
  e.derive(() => {
    const c = o.dx.value.val, f = o.dy.value.val, n = o.dz.value.val, m = o.divisions.value.val;
    let s = [], a = [];
    for (let t = 0; t <= m; t++) s.push([
      0,
      0,
      n * t
    ], [
      c,
      0,
      n * t
    ], [
      c,
      f,
      n * t
    ], [
      0,
      f,
      n * t
    ]);
    s = s.map((t) => [
      6 + t[0],
      6 + t[1],
      t[2]
    ]);
    for (let t = 0; t < m * 4; ) t += 4, a.push([
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
    for (let t = 0; t < m * 4; t++) a.push([
      t,
      t + 4
    ]);
    for (let t = 0; t < m * 4; t += 4) a.push([
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
    }, b = w(s, a, h, l), y = z(s, a, l, b);
    i.val = s, u.val = a, d.val = h, v.val = l, g.val = b, x.val = y;
  });
  document.body.append(M({
    nodes: i,
    elements: u,
    nodeInputs: d,
    elementInputs: v
  }), O(o), I({
    mesh: {
      nodes: i,
      elements: u,
      nodeInputs: d,
      elementInputs: v,
      deformOutputs: g,
      analyzeOutputs: x
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 15
    }
  }), S({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/3d-structure/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
});
