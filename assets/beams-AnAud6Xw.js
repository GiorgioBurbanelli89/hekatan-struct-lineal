import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as t } from "./Text-C1TX4d8g.js";
import { a as G, __tla as __tla_0 } from "./analyze-Bun5MfUS.js";
import { d as S, m as Y, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as z, c as E, __tla as __tla_2 } from "./aiAgent-BCa8AtfT.js";
import { g as k, __tla as __tla_3 } from "./getParameters-CKhRkzmO.js";
import { g as A, __tla as __tla_4 } from "./getCad3d-CHHHWVsm.js";
import { c as R } from "./modeScale-sgWZ-KrB.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_5 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
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
  const m = 29500, B = 0.3, v = m / (2 * (1 + B)), H = 180, L = 114, J = 240, f = 490 / 1e3 / 12 ** 3 / 386.4, _ = 43, O = 5630, g = 391, x = 34.8, C = 24.7, $ = 928, h = 225, M = 5.9, T = 6, p = {
    storyH: {
      value: t.state(H),
      min: 100,
      max: 300,
      step: 10,
      label: "Story H (in)"
    },
    bayX: {
      value: t.state(L),
      min: 50,
      max: 300,
      step: 10,
      label: "Bay X (in)"
    },
    bayY: {
      value: t.state(J),
      min: 100,
      max: 400,
      step: 10,
      label: "Bay Y (in)"
    }
  }, s = t.state([]), e = t.state([]), n = t.state({}), r = t.state({}), u = t.state({}), b = t.state({}), c = R();
  t.derive(() => {
    const a = p.storyH.value.val, i = p.bayX.value.val, l = p.bayY.value.val;
    s.val = [
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        a
      ],
      [
        0,
        l,
        0
      ],
      [
        0,
        l,
        a
      ],
      [
        i,
        0,
        0
      ],
      [
        i,
        0,
        a
      ],
      [
        i,
        l,
        0
      ],
      [
        i,
        l,
        a
      ]
    ], e.val = [
      [
        0,
        1
      ],
      [
        2,
        3
      ],
      [
        4,
        5
      ],
      [
        6,
        7
      ],
      [
        1,
        5
      ],
      [
        3,
        7
      ],
      [
        1,
        3
      ],
      [
        5,
        7
      ]
    ], n.val = {
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
          2,
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
          4,
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
          6,
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
          3,
          [
            10,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ])
    };
    const o = (y, d) => new Map(e.val.map((X, I) => [
      I,
      I < 4 ? y : d
    ]));
    r.val = {
      elasticities: o(m, m),
      shearModuli: o(v, v),
      areas: o(_, C),
      momentsOfInertiaY: o(g, h),
      momentsOfInertiaZ: o(O, $),
      torsionalConstants: o(x, M),
      densities: new Map(e.val.map((y, d) => [
        d,
        f
      ]))
    }, u.val = S(s.val, e.val, n.val, r.val), b.val = G(s.val, e.val, r.val, u.val);
    const w = Y(s.val, e.val, n.val, r.val, T);
    c.render(w, {
      title: "Example 6.3 Space Frame",
      properties: [
        `E=${m} ksi, G=${v.toFixed(0)} ksi, \u03C1=${f.toExponential(3)} kip\xB7s\xB2/in\u2074`,
        `Cols: W24x146 (A=${_}, Iz=${O}, Iy=${g}, J=${x})`,
        `Girs: W14x84  (A=${C}, Iz=${$}, Iy=${h}, J=${M})`
      ]
    });
  });
  document.body.append(A({
    nodes: s,
    elements: e,
    nodeInputs: n,
    elementInputs: r,
    deformOutputs: u,
    analyzeOutputs: b
  }), k(p), z({
    mesh: {
      nodes: s,
      elements: e,
      nodeInputs: n,
      elementInputs: r,
      deformOutputs: u,
      analyzeOutputs: b
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 300
    }
  }), E({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/beams/main.ts",
    author: "https://www.linkedin.com/in/jorge-burbano-037444113/"
  }));
  document.body.appendChild(c.div);
  setTimeout(() => {
    const a = document.querySelector('[data-ex="edificio"]');
    a && a.click(), c.div && (c.div.style.display = "none");
  }, 200);
});
