import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./Text-C1TX4d8g.js";
import { a as z, __tla as __tla_0 } from "./analyze-B3N25dJu.js";
import { d as w, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as I, c as S, __tla as __tla_2 } from "./aiAgent-DNMetN0d.js";
import { g as O, __tla as __tla_3 } from "./getParameters-d-Bgmcvz.js";
import { g as M, __tla as __tla_4 } from "./getCad3d-9QOyQo4i.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_5 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./modeScale-sgWZ-KrB.js";
import "./e2kParser-2L7GKQGH.js";
import "./cadSections-BcRFaG1j.js";
import "./materials-VwssM8Vw.js";
import "./e2kExporter-BCj3Cdp4.js";
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
  }, i = e.state([]), u = e.state([]), d = e.state({}), c = e.state({}), g = e.state({}), x = e.state({});
  e.derive(() => {
    const v = o.dx.value.val, f = o.dy.value.val, n = o.dz.value.val, l = o.divisions.value.val;
    let s = [], a = [];
    for (let t = 0; t <= l; t++) s.push([
      0,
      0,
      n * t
    ], [
      v,
      0,
      n * t
    ], [
      v,
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
    for (let t = 0; t < l * 4; ) t += 4, a.push([
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
    for (let t = 0; t < l * 4; t++) a.push([
      t,
      t + 4
    ]);
    for (let t = 0; t < l * 4; t += 4) a.push([
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
    const m = [
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
          m
        ],
        [
          1,
          m
        ],
        [
          2,
          m
        ],
        [
          3,
          m
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
    }, p = {
      elasticities: new Map(a.map((t, r) => [
        r,
        100
      ])),
      areas: new Map(a.map((t, r) => [
        r,
        10
      ]))
    }, b = w(s, a, h, p), y = z(s, a, p, b);
    i.val = s, u.val = a, d.val = h, c.val = p, g.val = b, x.val = y;
  });
  document.body.append(M({
    nodes: i,
    elements: u,
    nodeInputs: d,
    elementInputs: c
  }), O(o), I({
    mesh: {
      nodes: i,
      elements: u,
      nodeInputs: d,
      elementInputs: c,
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
