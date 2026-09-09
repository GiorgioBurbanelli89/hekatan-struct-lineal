import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as t } from "./theme-U-6D_qyI.js";
import { a as S } from "./analyze-DgLgRmKg.js";
import { d as Y, m as z, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as E } from "./getViewer-DTlZA20h.js";
import { g as G } from "./getParameters-CcvO4YbC.js";
import { g as A } from "./styles-SbI03m7S.js";
import { g as R, __tla as __tla_1 } from "./getCad3d-BI1h__ua.js";
import { c as k } from "./renderModalTable-BJWFR1R0.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
import "./tweakpane-BXg6ZhiP.js";
import "./exampleVersion-D1A_5i59.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
import "./__vite-browser-external-D7Ct-6yo.js";
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
  const l = 29500, H = 0.3, v = l / (2 * (1 + H)), L = 180, B = 114, J = 240, I = 490 / 1e3 / 12 ** 3 / 386.4, _ = 43, O = 5630, g = 391, x = 34.8, C = 24.7, $ = 928, h = 225, w = 5.9, T = 6, p = {
    storyH: {
      value: t.state(L),
      min: 100,
      max: 300,
      step: 10,
      label: "Story H (in)"
    },
    bayX: {
      value: t.state(B),
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
  }, s = t.state([]), e = t.state([]), n = t.state({}), r = t.state({}), u = t.state({}), y = t.state({}), c = k();
  t.derive(() => {
    const a = p.storyH.value.val, i = p.bayX.value.val, m = p.bayY.value.val;
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
        m,
        0
      ],
      [
        0,
        m,
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
        m,
        0
      ],
      [
        i,
        m,
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
    const o = (b, d) => new Map(e.val.map((X, f) => [
      f,
      f < 4 ? b : d
    ]));
    r.val = {
      elasticities: o(l, l),
      shearModuli: o(v, v),
      areas: o(_, C),
      momentsOfInertiaY: o(g, h),
      momentsOfInertiaZ: o(O, $),
      torsionalConstants: o(x, w),
      densities: new Map(e.val.map((b, d) => [
        d,
        I
      ]))
    }, u.val = Y(s.val, e.val, n.val, r.val), y.val = S(s.val, e.val, r.val, u.val);
    const M = z(s.val, e.val, n.val, r.val, T);
    c.render(M, {
      title: "Example 6.3 Space Frame",
      properties: [
        `E=${l} ksi, G=${v.toFixed(0)} ksi, \u03C1=${I.toExponential(3)} kip\xB7s\xB2/in\u2074`,
        `Cols: W24x146 (A=${_}, Iz=${O}, Iy=${g}, J=${x})`,
        `Girs: W14x84  (A=${C}, Iz=${$}, Iy=${h}, J=${w})`
      ]
    });
  });
  document.body.append(R({
    nodes: s,
    elements: e,
    nodeInputs: n,
    elementInputs: r,
    deformOutputs: u,
    analyzeOutputs: y
  }), G(p), E({
    mesh: {
      nodes: s,
      elements: e,
      nodeInputs: n,
      elementInputs: r,
      deformOutputs: u,
      analyzeOutputs: y
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 300
    }
  }), A({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/beams/main.ts",
    author: "https://www.linkedin.com/in/madil4/"
  }));
  document.body.appendChild(c.div);
  setTimeout(() => {
    const a = document.querySelector('[data-ex="edificio"]');
    a && a.click(), c.div && (c.div.style.display = "none");
  }, 200);
});
