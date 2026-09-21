import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./Text-Br8EG2up.js";
import { g as m, a as n } from "./aiAgent-eluwsz52.js";
import { g as i } from "./getParameters-BtwadT6l.js";
import { g as l, __tla as __tla_0 } from "./getMesh-_M9lDnOs.js";
import "./tweakpane-BXg6ZhiP.js";
import "./__vite-browser-external-D7Ct-6yo.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
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
