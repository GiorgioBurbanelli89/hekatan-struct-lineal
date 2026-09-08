import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as t } from "./theme-U-6D_qyI.js";
import { g as J } from "./getViewer-0VoGjneE.js";
import { g as Z } from "./getParameters-CcvO4YbC.js";
import { g as q } from "./getTables-DFR-40uK.js";
import { b as Q, c as N, g as W } from "./styles-SbI03m7S.js";
import { g as Y } from "./getDialog-DfUPuqg5.js";
import { g as tt } from "./getReport-B3uuPMpS.js";
import { a as at } from "./analyze-DgLgRmKg.js";
import { d as et, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as st, a as lt, b as ot, c as A, d as H, __tla as __tla_1 } from "./getSolids-CHplZCe6.js";
import "./Text-CUW6lNkV.js";
import "./tweakpane-BXg6ZhiP.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_2 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import { __tla as __tla_3 } from "./getMesh-_M9lDnOs.js";
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
  function nt({ onToolbarClick: e, onClearPoints: s }) {
    const n = document.createElement("div");
    return n.id = "drawing-toolbar", new Q({
      name: "toolbar",
      box: n,
      items: [
        {
          type: "radio",
          id: "1st-floor",
          text: "Columns",
          checked: true,
          tooltip: "Create Columns"
        },
        {
          type: "radio",
          id: "2nd-floor",
          text: "Slab",
          tooltip: "Create Slab"
        },
        {
          type: "break"
        },
        {
          type: "button",
          id: "clear-points",
          text: "Clear Points",
          tooltip: "Remove all points of selected level",
          icon: "w2ui-icon-cross"
        }
      ],
      onClick(l) {
        l.target === "clear-points" ? s() : e(l.target);
      }
    }), n;
  }
  function it() {
    const e = document.createElement("div"), s = navigator.userAgent.includes("Macintosh");
    e.className = "snap-tip", e.innerHTML = `
      <span>Tip: Hold</span>
      <span class="key">${s ? "Cmd" : "Ctrl"}</span>
      <span>to snap to grid points</span>
    `, e.classList.add("show"), document.addEventListener("keydown", (l) => {
      (l.ctrlKey || l.metaKey) && e.classList.remove("show");
    });
    const n = document.createElement("style");
    return n.textContent = `
  @media (max-width: 600px) {
    .snap-tip {
      display: none;
    }
  }
`, document.head.appendChild(n), e;
  }
  function rt(e, s, n, l, u, C) {
    const p = n - 1, b = s * n + l * p, o = Array.from({
      length: n + p
    }, (i, y) => y % 2 === 0 ? s : l);
    let d = [
      0
    ], L = 0;
    for (let i of o) L += i, d.push(L);
    const M = d.map((i) => i - b / 2);
    let k = 0, $ = [];
    const F = 1e3;
    for (let i = 0; i < o.length; i++) {
      let y = o[i], G = F * y ** 3 / 12, K = F * y, X = M[i + 1], E = G + K * X ** 2;
      $.push(E), k += E;
    }
    const B = M.map((i) => Number((u * 1e6 * i / k).toFixed(2))), U = Math.max(...B), R = e.f_mk * C, _ = B.map((i) => Number((i / R).toFixed(2))), j = Math.max(..._);
    return {
      slabHeight: b,
      thicknesses: o,
      zCordsFromMid: M,
      inertiaList: $,
      inertia: k,
      bendingStresses: B,
      bendingStressMax: U,
      f_md: R,
      eta: _,
      etaMax: j
    };
  }
  const dt = "/hekatan-struct-lineal/assets/awatif-logo-DnnuEFJ2.png", mt = "/hekatan-struct-lineal/assets/clt-bending-stress-DvR3Ux1R.png", ct = ({ designMomentInput: e, designOutputs: s }) => N`
    <div id="report">
      <header class="header">
        <div class="header-left">
          <p class="header-title">Report</p>
          <a href="https://awatif.co" class="header-link" target="_blank"
            >https://awatif.co</a
          >
        </div>
        <div class="header-right">
          <img src="${dt}" id="headerLogo" />
        </div>
      </header>

      <br />
      <h1>Cross-Laminated Timber (CLT)</h1>
      <p class="caption">EN 1995-1-1: 2004</p>

      <br />
      <h2>Bending Design</h2>
      <p class="caption">EN 1995-1-1: 2004</p>
      <p class="p1">The following shows the results of the maximum node.</p>

      <h3>Summary Table</h3>
      <table>
        <tr>
          <th>Property</th>
          <th>Value</th>
          <th>Unit</th>
        </tr>
        <tr>
          <td>Slab Height</td>
          <td>${s.val.slabHeight}</td>
          <td>mm</td>
        </tr>
        <tr>
          <td>Moment of Inertia</td>
          <td>${s.val.inertia.toFixed(0)}</td>
          <td>mm⁴</td>
        </tr>
        <tr>
          <td>Bending Moment</td>
          <td>${e.val.toFixed(1)}</td>
          <td>kNm</td>
        </tr>
        <tr>
          <td>Bending Stress</td>
          <td>${s.val.bendingStressMax.toFixed(1)}</td>
          <td>N/mm²</td>
        </tr>
        <tr>
          <td>Bending Resistance</td>
          <td>${s.val.f_md.toFixed(1)}</td>
          <td>N/mm²</td>
        </tr>
        <tr>
          <td>Maximum Utilization Ratio</td>
          <td>${(s.val.etaMax * 100).toFixed(0)}</td>
          <td>%</td>
        </tr>
      </table>

      <br />

      <h3>Bending Stress Layout Table</h3>
      <table>
        <tr>
          <th>Layer</th>
          <th>z-Coordinate</th>
          <th>Bending Stress</th>
          <th>Utilization Ratio</th>
        </tr>
        <tbody id="stressTable">
          ${s.val.bendingStresses.map((n, l) => N`
              <tr>
                <td>Layer ${l + 1}</td>
                <td>${s.val.zCordsFromMid[l]} mm</td>
                <td>${n.toFixed(2)} N/mm²</td>
                <td>${(s.val.eta[l] * 100).toFixed(0)}%</td>
              </tr>
            `)}
        </tbody>
      </table>

      <br /><br />

      <h3>Structural Sketch</h3>
      <img
        id="threeCanvas"
        width="600"
        height="400"
        style="border:1px solid #ccc;"
        src=${mt}
      />

      <br /><br />
    </div>
  `, v = {
    meshSize: {
      value: t.state(0.5),
      min: 0.5,
      max: 2,
      step: 0.1,
      label: "mesh size (m)"
    },
    loads: {
      value: t.state(30),
      min: 0,
      max: 100,
      label: "Load (kN/m\xB2)"
    },
    elasticity: {
      value: t.state(1e3),
      min: 100,
      max: 5e4,
      step: 100,
      label: "elasticity (mpa)"
    },
    poisson: {
      value: t.state(0.3),
      min: 0.1,
      max: 0.5,
      step: 0.05,
      label: "poisson's ratio"
    },
    thickness: {
      value: t.state(0.2),
      min: 0.1,
      max: 0.5,
      step: 0.05,
      label: "thickness (m)"
    }
  }, a = {
    points: t.state([]),
    stories: t.state([
      0
    ]),
    columns: t.state([]),
    slabs: t.state([]),
    columnsByStory: t.state(/* @__PURE__ */ new Map()),
    slabsByStory: t.state(/* @__PURE__ */ new Map()),
    columnData: t.state(/* @__PURE__ */ new Map()),
    slabData: t.state(/* @__PURE__ */ new Map())
  }, I = st(), P = lt(), g = t.state([
    P
  ]), pt = t.state([
    I
  ]), r = {
    nodes: t.state([]),
    elements: t.state([]),
    nodeInputs: t.state({}),
    elementInputs: t.state({}),
    deformOutputs: t.state({}),
    analyzeOutputs: t.state({})
  }, T = t.state(10), V = t.state(), vt = [
    [
      3,
      2,
      0
    ],
    [
      3,
      11,
      0
    ],
    [
      12,
      11,
      0
    ],
    [
      18,
      11,
      0
    ],
    [
      18,
      6,
      0
    ],
    [
      12,
      6,
      0
    ],
    [
      12,
      2,
      0
    ],
    [
      3,
      6,
      0
    ]
  ], ht = [
    [
      3,
      2,
      4
    ],
    [
      3,
      11,
      4
    ],
    [
      12,
      11,
      4
    ],
    [
      18,
      11,
      4
    ],
    [
      18,
      6,
      4
    ],
    [
      12,
      6,
      4
    ],
    [
      12,
      2,
      4
    ],
    [
      3,
      6,
      4
    ]
  ], ut = [
    [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    []
  ], c = t.state([]), m = t.state(ht), h = t.state(ut), f = t.state(vt), S = t.state([]), O = t.state({
    position: [
      10,
      10,
      0
    ],
    rotation: [
      Math.PI / 2,
      0,
      0
    ]
  }), z = t.state(""), D = t.state(void 0), w = 4;
  let x = "1st-floor";
  function bt(e) {
    x = e, O.val = {
      position: [
        10,
        10,
        e == "1st-floor" ? 0 : w
      ],
      rotation: [
        Math.PI / 2,
        0,
        0
      ]
    }, f.val = e === "1st-floor" ? c.val : m.val, S.val = e === "1st-floor" ? [] : h.val;
  }
  function gt() {
    x === "1st-floor" ? c.val = [] : (m.val = [], h.val = []), f.val = [], S.val = [], a.points.val = [], a.columns.val = [], a.slabs.val = [], a.columnsByStory.val = /* @__PURE__ */ new Map(), a.slabsByStory.val = /* @__PURE__ */ new Map(), a.columnData.val = /* @__PURE__ */ new Map(), a.slabData.val = /* @__PURE__ */ new Map(), r.nodes.val = [], r.elements.val = [], r.nodeInputs.val = {}, P.geometry = A(a.points.val, a.slabs.val, a.columns.val), I.geometry = H(a.points.val, a.slabs.val, a.columns.val), g.val = [
      ...g.rawVal
    ];
  }
  t.derive(() => {
    x == "1st-floor" && (c.val = f.val), x == "2nd-floor" && (m.val = f.val, h.val = S.val);
  });
  t.derive(() => {
    const e = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), l = [], u = [], C = [], p = [];
    if (l.length, m.val.length > 0) for (let o = 0; o < m.val.length; o++) C.push([
      m.val[o][0],
      m.val[o][1],
      w
    ]), l.push([
      m.val[o][0],
      m.val[o][1],
      w
    ]);
    s.set(0, Array.from(h.rawVal.keys())), h.rawVal.forEach((o, d) => {
      n.set(d, {
        analysisInput: {
          meshSize: v.meshSize.value.val,
          areaLoad: -v.loads.value.val * 1e3,
          isOpening: false,
          thickness: v.thickness.value.val,
          material: {
            elasticity: v.elasticity.value.val * 1e6,
            poissonsRatio: v.poisson.value.val
          }
        }
      });
    });
    const b = [];
    if (c.val.length > 0) {
      for (let o = 0; o < c.val.length; o++) {
        const d = c.val[o];
        p.push([
          [
            d[0],
            d[1],
            d[2] + w
          ]
        ]);
      }
      for (let o = 0; o < p.length; o++) {
        const d = l.length;
        l.push(...p[o]), u.push(d), b.push(u.length - 1);
      }
    }
    e.set(0, b), a.points.val = l, a.columns.val = u, a.slabs.val = h.val, a.columnsByStory.val = e, a.slabsByStory.val = s, a.slabData.val = n;
  });
  t.derive(() => {
    const { nodes: e, elements: s, nodeInputs: n, elementInputs: l } = ot(a.points.val, a.stories.val, a.columns.val, a.slabs.val, a.columnsByStory.val, a.slabsByStory.val, a.columnData.val, a.slabData.val);
    P.geometry = A(a.points.val, [], a.columns.val), I.geometry = H(a.points.val, a.slabs.val, a.columns.val), g.val = [
      ...g.rawVal
    ], r.deformOutputs.val = et(e, s, n, l), r.analyzeOutputs.val = at(e, s, l, r.deformOutputs.val), T.val = Math.max(...Array.from(r.analyzeOutputs.val.bendingXX.values()).flat()) * 1e-3, V.val = rt({
      f_mk: 24
    }, 55, 3, 20, T.val, 0.8), r.nodes.val = e, r.elements.val = s, r.nodeInputs.val = n, r.elementInputs.val = l;
  });
  t.derive(() => {
    z.val === "Tables" && (D.val = q({
      tables: /* @__PURE__ */ new Map([
        [
          "columns",
          {
            text: "Columns",
            fields: [
              {
                field: "A",
                text: "x-Coordinate"
              },
              {
                field: "B",
                text: "y-Coordinate"
              },
              {
                field: "C",
                text: "z-Coordinate"
              }
            ],
            data: c
          }
        ],
        [
          "slabs",
          {
            text: "Slabs",
            fields: [
              {
                field: "A",
                text: "x-Coordinate"
              },
              {
                field: "B",
                text: "y-Coordinate"
              },
              {
                field: "C",
                text: "z-Coordinate"
              }
            ],
            data: m
          }
        ]
      ])
    })), z.val === "Report" && (D.val = tt({
      template: ct,
      data: {
        designMomentInput: T,
        designOutputs: V
      }
    }));
  });
  document.body.append(Z(v), J({
    objects3D: g,
    solids: pt,
    mesh: r,
    drawingObj: {
      points: f,
      polylines: S,
      gridTarget: O
    },
    settingsObj: {
      nodes: false,
      loads: false,
      deformedShape: true,
      solids: false,
      shellResults: "displacementZ"
    }
  }), it(), nt({
    onToolbarClick: bt,
    onClearPoints: gt
  }), W({
    clickedButton: z,
    buttons: [
      "Tables",
      "Report"
    ],
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/slab-designer/main.ts",
    author: "https://www.linkedin.com/in/abderrahmane-mazri-4638a81b8/"
  }), Y({
    dialogBody: D
  }));
});
