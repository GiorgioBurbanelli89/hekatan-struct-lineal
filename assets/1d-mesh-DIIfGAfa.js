import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./Text-Br8EG2up.js";
import { a as M } from "./analyze-C-HJ03ae.js";
import { d as O, __tla as __tla_0 } from "./didacticCpp-CzlDWovh.js";
import { g as k, a as S } from "./aiAgent-G2d7QJNc.js";
import { g as A } from "./getParameters-YeWGJ-Q0.js";
import { g as _, __tla as __tla_1 } from "./getCad3d-C16TdqEa.js";
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
  const r = {
    meshDensity: {
      value: s.state(7),
      min: 1,
      max: 7,
      step: 1,
      label: "mesh density"
    },
    span: {
      value: s.state(10),
      min: 1,
      max: 20
    },
    height: {
      value: s.state(10),
      min: 1,
      max: 10
    },
    load: {
      value: s.state(10),
      min: 0,
      max: 20
    }
  }, l = s.state([]), i = s.state([]), d = s.state({}), h = s.state({}), g = s.state({}), f = s.state({});
  s.derive(() => {
    const o = [], e = [], p = r.meshDensity.value.val, m = r.height.value.val, c = r.span.value.val, w = r.load.value.val;
    o.push(...[
      ...Array(p + 1).keys()
    ].map((t) => [
      0,
      0,
      m / p * t
    ])), e.push(...[
      ...Array(p).keys()
    ].map((t) => [
      t,
      t + 1
    ]));
    let n = o.length;
    o.push(...[
      ...Array(p).keys()
    ].map((t) => [
      c / p * (t + 1),
      0,
      m
    ])), e.push(...[
      ...Array(p - 1).keys()
    ].map((t) => [
      n + t,
      n + t + 1
    ])), e.push([
      n - 1,
      n
    ]), n = o.length;
    const b = n - 1;
    o.push(...[
      ...Array(p).keys()
    ].map((t) => [
      c,
      0,
      m - m / p * (t + 1)
    ])), e.push(...[
      ...Array(p - 1).keys()
    ].map((t) => [
      n + t,
      n + t + 1
    ])), e.push([
      n - 1,
      n
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
          o.length - 1,
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
      loads: /* @__PURE__ */ new Map([
        [
          b,
          [
            w,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ])
    }, u = {
      elasticities: new Map(e.map((t, a) => [
        a,
        10
      ])),
      shearModuli: new Map(e.map((t, a) => [
        a,
        10
      ])),
      areas: new Map(e.map((t, a) => [
        a,
        10
      ])),
      torsionalConstants: new Map(e.map((t, a) => [
        a,
        10
      ])),
      momentsOfInertiaZ: new Map(e.map((t, a) => [
        a,
        10
      ])),
      momentsOfInertiaY: new Map(e.map((t, a) => [
        a,
        10
      ]))
    }, y = O(o, e, v, u), I = M(o, e, u, y);
    l.val = o, i.val = e, d.val = v, h.val = u, g.val = y, f.val = I;
  });
  document.body.append(_({
    nodes: l,
    elements: i,
    nodeInputs: d,
    elementInputs: h
  }), A(r), k({
    mesh: {
      nodes: l,
      elements: i,
      nodeInputs: d,
      elementInputs: h,
      deformOutputs: g,
      analyzeOutputs: f
    },
    settingsObj: {
      deformedShape: true
    }
  }), S({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/1d-mesh/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
});
