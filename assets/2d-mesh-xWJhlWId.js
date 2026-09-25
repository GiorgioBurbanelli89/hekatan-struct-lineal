import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./Text-C1TX4d8g.js";
import { g as m, c as n, __tla as __tla_0 } from "./aiAgent-CDkRN2K5.js";
import { g as i, __tla as __tla_1 } from "./getParameters-C2E0DZJg.js";
import { g as l, __tla as __tla_2 } from "./getMesh-_M9lDnOs.js";
import "./tweakpane-BXg6ZhiP.js";
import { __tla as __tla_3 } from "./didacticCpp-BoYi16rL.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  const t = {
    boundary: {
      value: e.state(5),
      min: 1,
      max: 10,
      step: 0.1,
      label: "Boundary point"
    }
  }, o = e.state([]), a = e.state([]);
  e.derive(() => {
    const { nodes: s, elements: r } = l({
      points: [
        [
          0,
          0,
          0
        ],
        [
          5,
          0,
          0
        ],
        [
          t.boundary.value.val,
          0,
          3
        ],
        [
          8,
          0,
          7
        ],
        [
          15,
          0,
          5
        ],
        [
          15,
          0,
          0
        ],
        [
          20,
          0,
          0
        ],
        [
          20,
          0,
          10
        ],
        [
          0,
          0,
          10
        ],
        [
          0,
          0,
          0
        ]
      ],
      polygon: [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ]
    });
    o.val = s, a.val = r;
  });
  document.body.append(i(t), m({
    mesh: {
      nodes: o,
      elements: a
    }
  }), n({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/2d-mesh/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
});
