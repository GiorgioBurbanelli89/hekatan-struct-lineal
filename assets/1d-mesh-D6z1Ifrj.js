import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./theme-Dxpmbnyd.js";
import { a as O } from "./analyze-DgLgRmKg.js";
import { d as b, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as k } from "./getViewer-Druzr40L.js";
import { g as S } from "./getParameters-BHL5hAP0.js";
import { g as A } from "./styles-Ce_UnsFA.js";
import { g as _, __tla as __tla_1 } from "./getCad3d-470Zquoa.js";
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
  const p = {
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
    const o = [], e = [], m = p.meshDensity.value.val, r = p.height.value.val, c = p.span.value.val, w = p.load.value.val;
    o.push(...[
      ...Array(m + 1).keys()
    ].map((t) => [
      0,
      0,
      r / m * t
    ])), e.push(...[
      ...Array(m).keys()
    ].map((t) => [
      t,
      t + 1
    ]));
    let n = o.length;
    o.push(...[
      ...Array(m).keys()
    ].map((t) => [
      c / m * (t + 1),
      0,
      r
    ])), e.push(...[
      ...Array(m - 1).keys()
    ].map((t) => [
      n + t,
      n + t + 1
    ])), e.push([
      n - 1,
      n
    ]), n = o.length;
    const I = n - 1;
    o.push(...[
      ...Array(m).keys()
    ].map((t) => [
      c,
      0,
      r - r / m * (t + 1)
    ])), e.push(...[
      ...Array(m - 1).keys()
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
          I,
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
    }, y = b(o, e, v, u), M = O(o, e, u, y);
    l.val = o, i.val = e, d.val = v, h.val = u, g.val = y, f.val = M;
  });
  document.body.append(_({
    nodes: l,
    elements: i,
    nodeInputs: d,
    elementInputs: h
  }), S(p), k({
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
  }), A({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/1d-mesh/main.ts",
    author: "https://www.linkedin.com/in/madil4/"
  }));
});
