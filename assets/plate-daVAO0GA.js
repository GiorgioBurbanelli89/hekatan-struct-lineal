import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as t } from "./Text-C1TX4d8g.js";
import { a as p, __tla as __tla_0 } from "./analyze-B3N25dJu.js";
import { d as i, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as r, c as u, __tla as __tla_2 } from "./aiAgent-DNMetN0d.js";
import { g as d, __tla as __tla_3 } from "./getParameters-d-Bgmcvz.js";
import { g as v, __tla as __tla_4 } from "./getMesh-_M9lDnOs.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })()
]).then(async () => {
  const n = {
    xPosition: {
      value: t.state(15),
      min: 5,
      max: 20
    },
    Ex: {
      value: t.state(100),
      min: 50,
      max: 500
    },
    Ey: {
      value: t.state(100),
      min: 50,
      max: 500
    },
    load: {
      value: t.state(-3),
      min: -10,
      max: 10,
      step: 1
    }
  }, a = {
    nodes: t.state([]),
    elements: t.state([]),
    nodeInputs: t.state({}),
    elementInputs: t.state({}),
    deformOutputs: t.state({}),
    analyzeOutputs: t.state({})
  };
  t.derive(() => {
    const { nodes: l, elements: s, boundaryIndices: m } = v({
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
    a.nodeInputs.val = {
      supports: new Map(m.map((o) => [
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
      loads: new Map(l.map((o, e) => [
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
    }, a.nodes.val = l, a.elements.val = s, a.elementInputs.val = {
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
    }, a.deformOutputs.val = i(l, s, a.nodeInputs.val, a.elementInputs.val), a.analyzeOutputs.val = p(l, s, a.elementInputs.val, a.deformOutputs.val);
  });
  document.body.append(d(n), r({
    mesh: a,
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
