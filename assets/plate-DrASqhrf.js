import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./Text-Br8EG2up.js";
import { a as p } from "./analyze-CWJH9Nzr.js";
import { d as i, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { g as r, a as u, __tla as __tla_1 } from "./aiAgent-BbDbzZHq.js";
import { g as d } from "./getParameters-Dgz5Nzxm.js";
import { g as v, __tla as __tla_2 } from "./getMesh-_M9lDnOs.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_3 } from "./deform-DGwQQaqs.js";
import "./preload-helper-V2P8TQsQ.js";
import "./tweakpane-BXg6ZhiP.js";
import "./__vite-browser-external-D7Ct-6yo.js";
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
    xPosition: {
      value: a.state(15),
      min: 5,
      max: 20
    },
    Ex: {
      value: a.state(100),
      min: 50,
      max: 500
    },
    Ey: {
      value: a.state(100),
      min: 50,
      max: 500
    },
    load: {
      value: a.state(-3),
      min: -10,
      max: 10,
      step: 1
    }
  }, t = {
    nodes: a.state([]),
    elements: a.state([]),
    nodeInputs: a.state({}),
    elementInputs: a.state({}),
    deformOutputs: a.state({}),
    analyzeOutputs: a.state({})
  };
  a.derive(() => {
    const { nodes: m, elements: s, boundaryIndices: l } = v({
      points: [
        [
          0,
          0,
          0
        ],
        [
          15,
          0,
          0
        ],
        [
          n.xPosition.value.val,
          10,
          0
        ],
        [
          0,
          5,
          0
        ]
      ],
      polygon: [
        0,
        1,
        2,
        3
      ],
      maxMeshSize: 0.5
    });
    t.nodeInputs.val = {
      supports: new Map(l.map((o) => [
        o,
        [
          true,
          true,
          true,
          true,
          true,
          true
        ]
      ])),
      loads: new Map(m.map((o, e) => [
        e,
        [
          0,
          0,
          n.load.value.val,
          0,
          0,
          0
        ]
      ]))
    }, t.nodes.val = m, t.elements.val = s, t.elementInputs.val = {
      elasticities: new Map(s.map((o, e) => [
        e,
        n.Ex.value.val
      ])),
      elasticitiesOrthogonal: new Map(s.map((o, e) => [
        e,
        n.Ey.value.val
      ])),
      thicknesses: new Map(s.map((o, e) => [
        e,
        1
      ])),
      poissonsRatios: new Map(s.map((o, e) => [
        e,
        0.3
      ])),
      shearModuli: new Map(s.map((o, e) => [
        e,
        100
      ]))
    }, t.deformOutputs.val = i(m, s, t.nodeInputs.val, t.elementInputs.val), t.analyzeOutputs.val = p(m, s, t.elementInputs.val, t.deformOutputs.val);
  });
  document.body.append(d(n), r({
    mesh: t,
    settingsObj: {
      nodes: false,
      deformedShape: true,
      loads: false,
      shellResults: "displacementZ"
    }
  }), u({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/plate/main.ts",
    author: "https://www.linkedin.com/in/mahjoubmusaab/"
  }));
});
