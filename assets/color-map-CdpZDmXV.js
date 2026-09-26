import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as e } from "./Text-C1TX4d8g.js";
import { h as l, g as p, i as c, c as d, __tla as __tla_0 } from "./aiAgent-DNMetN0d.js";
import { g as u, __tla as __tla_1 } from "./getParameters-d-Bgmcvz.js";
import { g, __tla as __tla_2 } from "./getMesh-_M9lDnOs.js";
import { n as b, s as h } from "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./tweakpane-BXg6ZhiP.js";
import { __tla as __tla_3 } from "./didacticCpp-BoYi16rL.js";
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
  const i = {
    boundary: {
      value: e.state(10),
      min: 1,
      max: 10,
      step: 0.1,
      label: "Boundary point"
    }
  }, o = e.state([]), r = e.state([]), m = e.state([]), n = e.state([
    l(o, r, m)
  ]);
  e.derive(() => {
    const t = [
      i.boundary.value.val,
      0,
      3
    ], { nodes: a, elements: s } = g({
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
        t,
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
      ],
      maxMeshSize: 1
    });
    o.val = a, r.val = s, m.val = v(t, o.val), n.val = [
      ...n.rawVal
    ];
  });
  document.body.append(u(i), p({
    mesh: {
      nodes: o,
      elements: r
    },
    objects3D: n
  }), c(m), d({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/color-map/main.ts",
    author: "https://www.linkedin.com/in/siu-kai-cheung/"
  }));
  function v(t, a) {
    return a.map((s) => b(h(s, t)));
  }
});
