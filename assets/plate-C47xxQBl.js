import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-DQ--CgsI.js";
import { a as l } from "./analyze-DgLgRmKg.js";
import { d as i, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as r } from "./getViewer-D80RC-bP.js";
import { g as u } from "./getParameters-DTL1yrut.js";
import { g as d } from "./styles-0iLl92Fx.js";
import { g as v, __tla as __tla_1 } from "./getMesh-_M9lDnOs.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-ERv22veQ.js";
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
  })()
]).then(async () => {
  const m = {
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
    const { nodes: n, elements: s, boundaryIndices: p } = v({
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
          m.xPosition.value.val,
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
      supports: new Map(p.map((o) => [
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
      loads: new Map(n.map((o, e) => [
        e,
        [
          0,
          0,
          m.load.value.val,
          0,
          0,
          0
        ]
      ]))
    }, t.nodes.val = n, t.elements.val = s, t.elementInputs.val = {
      elasticities: new Map(s.map((o, e) => [
        e,
        m.Ex.value.val
      ])),
      elasticitiesOrthogonal: new Map(s.map((o, e) => [
        e,
        m.Ey.value.val
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
    }, t.deformOutputs.val = i(n, s, t.nodeInputs.val, t.elementInputs.val), t.analyzeOutputs.val = l(n, s, t.elementInputs.val, t.deformOutputs.val);
  });
  document.body.append(u(m), r({
    mesh: t,
    settingsObj: {
      nodes: false,
      deformedShape: true,
      loads: false,
      shellResults: "displacementZ"
    }
  }), d({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/plate/main.ts",
    author: "https://www.linkedin.com/in/mahjoubmusaab/"
  }));
});
