import { m as A, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { i as S, j as I, d as L, P as u, __tla as __tla_1 } from "./pazFrameE2k-DwsnXikM.js";
import { g as y } from "./chartPanel-DKe9UCQ8.js";
import { a as P, z as F, p as $, r as E, n as v } from "./newmarkBeta-BvlZHnmY.js";
let N;
let __tla = Promise.all([
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
  })()
]).then(async () => {
  N = {
    id: "benchmark-paz-13-1",
    name: "\u{1F3C1} Frame \xB7 Paz 13.1 (Space Frame 3D \u2014 4 vigas radiando)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 13.1 \u2014 Space frame 3D, 5 nodos (1 libre + 4 empotrados radiando).",
      "Members 1,3 (verticales/X): A=50 in\xB2, Iy=Iz=200 in\u2074, J=40, m=0.2 lb\xB7s\xB2/in\xB2.",
      "Members 2,4 (Y\xB1): A=28, Iy=Iz=64, J=12.8, m=0.1.",
      "Material: E=30e6 psi, G=12e6 psi (acero).",
      "Carga: F=5000 lb step en Z por 0.1s aplicada en nodo 1.",
      "\u{1F4C8} Chart Panel: time history u_z(t), v_z(t), a_z(t) del nodo 1.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS multi-story para validaci\xF3n."
    ],
    params: {
      L_in: {
        default: 200,
        min: 50,
        max: 500,
        step: 10,
        label: "Longitud miembro (in)",
        folder: "Geometr\xEDa"
      },
      A1_in2: {
        default: 50,
        min: 10,
        max: 200,
        step: 1,
        label: "A miembros 1,3 (in\xB2)",
        folder: "Secci\xF3n"
      },
      I1_in4: {
        default: 200,
        min: 50,
        max: 1e3,
        step: 5,
        label: "Iy=Iz miembros 1,3 (in\u2074)",
        folder: "Secci\xF3n"
      },
      J1_in4: {
        default: 40,
        min: 10,
        max: 200,
        step: 1,
        label: "J miembros 1,3 (in\u2074)",
        folder: "Secci\xF3n"
      },
      A2_in2: {
        default: 28,
        min: 10,
        max: 200,
        step: 1,
        label: "A miembros 2,4 (in\xB2)",
        folder: "Secci\xF3n"
      },
      I2_in4: {
        default: 64,
        min: 20,
        max: 500,
        step: 1,
        label: "Iy=Iz miembros 2,4 (in\u2074)",
        folder: "Secci\xF3n"
      },
      J2_in4: {
        default: 12.8,
        min: 5,
        max: 100,
        step: 0.5,
        label: "J miembros 2,4 (in\u2074)",
        folder: "Secci\xF3n"
      },
      E_psi: {
        default: 3e7,
        min: 25e6,
        max: 35e6,
        step: 5e5,
        label: "E acero (psi)",
        folder: "Material"
      },
      G_psi: {
        default: 12e6,
        min: 1e7,
        max: 14e6,
        step: 5e5,
        label: "G acero (psi)",
        folder: "Material"
      },
      mbar1: {
        default: 0.2,
        min: 0.05,
        max: 1,
        step: 0.05,
        label: "m\u0304 miembros 1,3 (lb\xB7s\xB2/in\xB2)",
        folder: "Masa"
      },
      mbar2: {
        default: 0.1,
        min: 0.05,
        max: 1,
        step: 0.05,
        label: "m\u0304 miembros 2,4 (lb\xB7s\xB2/in\xB2)",
        folder: "Masa"
      },
      F0_lb: {
        default: 5e3,
        min: 0,
        max: 2e4,
        step: 100,
        label: "Step F0 nodo 1 Z (lb)",
        folder: "Time History"
      },
      pulseDur_s: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "Duraci\xF3n step (s)",
        folder: "Time History"
      },
      tEnd_s: {
        default: 0.5,
        min: 0.1,
        max: 5,
        step: 0.1,
        label: "t fin an\xE1lisis (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 1e-3,
        min: 1e-4,
        max: 0.01,
        step: 1e-4,
        label: "\u0394t Newmark (s)",
        folder: "Time History"
      },
      xi: {
        default: 0.05,
        min: 0,
        max: 0.2,
        step: 5e-3,
        label: "Damping \u03BE",
        folder: "Time History"
      },
      showTH: {
        default: 1,
        boolean: true,
        label: "\u{1F4C8} Mostrar Chart Panel",
        folder: "Time History"
      },
      plotType: {
        default: 0,
        label: "Tipo gr\xE1fica",
        options: {
          "u_z(t)": 0,
          "v_z(t)": 1,
          "a_z(t)": 2,
          "F(t)": 3,
          "u_x,y,z(t)": 4
        },
        folder: "Time History"
      },
      exportE2k: {
        default: 0,
        boolean: true,
        label: "\u{1F4E4} Exportar a ETABS .e2k",
        folder: "Exportar"
      }
    },
    hasModal: true,
    onParamChange(e, s) {
      if (e === "exportE2k" && s.exportE2k > 0.5) {
        const c = k(s), { filename: o, content: i } = I(c, "Paz_13_1");
        L(o, i), console.log(`[Paz 13.1] e2k exportado: ${o} (${i.length} bytes)`), s.exportE2k = 0;
      }
      e === "showTH" && s.showTH < 0.5 && y().hide();
    },
    build(e, s) {
      const c = k(e);
      S(c, s);
      let o = `[Paz 13.1] Space Frame 3D \u2014 5 nodos
`;
      if (e.showTH > 0.5) {
        const { K6: i, M6: r } = H(e);
        try {
          const m = P(i, r);
          o += `  Modal (solver matricial directo, 6 DOF nodo 1):
`, m.freqs.forEach((t, a) => {
            o += `    Modo ${a + 1}: f = ${t.toFixed(3)} Hz, \u03C9\xB2 = ${m.omega2[a].toFixed(2)}
`;
          });
          const b = Math.sqrt(m.omega2[0]), f = Math.sqrt(m.omega2[Math.min(5, m.omega2.length - 1)]), z = F(6), _ = 2 * e.xi * b * f / (b + f), x = 2 * e.xi / (b + f);
          for (let t = 0; t < 6; t++) for (let a = 0; a < 6; a++) z[t][a] = _ * r[t][a] + x * i[t][a];
          const M = $(E(e.F0_lb, 0, e.pulseDur_s), 2, 6), g = Math.floor(e.tEnd_s / e.dt_s), n = v({
            M: r,
            K: i,
            C: z,
            loadFunc: M,
            u0: [
              0,
              0,
              0,
              0,
              0,
              0
            ],
            v0: [
              0,
              0,
              0,
              0,
              0,
              0
            ],
            dt: e.dt_s,
            nSteps: g
          }), d = Math.max(...n.u.map((t) => Math.abs(t[2])));
          o += `  Newmark-\u03B2 TH (F=${e.F0_lb} lb step ${e.pulseDur_s}s, \u03BE=${e.xi}):
`, o += `    u_z_max nodo 1 = ${d.toExponential(4)} in
`;
          const l = y(), p = Math.round(e.plotType ?? 0);
          p === 0 ? (l.setTitle("Paz 13.1 \u2014 u_z(t) nodo 1"), l.setSeries([
            {
              label: "u_z(t)",
              data: n.t.map((t, a) => [
                t,
                n.u[a][2]
              ]),
              color: "#1a4d8c",
              width: 2
            }
          ]), l.setAxes({
            xLabel: "t (s)",
            yLabel: "u_z (in)",
            grid: true
          })) : p === 1 ? (l.setTitle("Paz 13.1 \u2014 v_z(t) nodo 1"), l.setSeries([
            {
              label: "v_z(t)",
              data: n.t.map((t, a) => [
                t,
                n.v[a][2]
              ]),
              color: "#1a4d8c",
              width: 2
            }
          ]), l.setAxes({
            xLabel: "t (s)",
            yLabel: "v_z (in/s)",
            grid: true
          })) : p === 2 ? (l.setTitle("Paz 13.1 \u2014 a_z(t) nodo 1"), l.setSeries([
            {
              label: "a_z(t)",
              data: n.t.map((t, a) => [
                t,
                n.a[a][2]
              ]),
              color: "#1a4d8c",
              width: 2
            }
          ]), l.setAxes({
            xLabel: "t (s)",
            yLabel: "a_z (in/s\xB2)",
            grid: true
          })) : p === 3 ? (l.setTitle("Paz 13.1 \u2014 Carga F(t) nodo 1"), l.setSeries([
            {
              label: "F_z(t)",
              data: n.t.map((t) => [
                t,
                E(e.F0_lb, 0, e.pulseDur_s)(t)
              ]),
              color: "#7d3c98"
            }
          ]), l.setAxes({
            xLabel: "t (s)",
            yLabel: "F (lb)",
            grid: true
          })) : p === 4 && (l.setTitle("Paz 13.1 \u2014 Translaciones nodo 1"), l.setSeries([
            {
              label: "u_x(t)",
              data: n.t.map((t, a) => [
                t,
                n.u[a][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "u_y(t)",
              data: n.t.map((t, a) => [
                t,
                n.u[a][1]
              ]),
              color: "#2d8659"
            },
            {
              label: "u_z(t)",
              data: n.t.map((t, a) => [
                t,
                n.u[a][2]
              ]),
              color: "#c0392b"
            }
          ]), l.setAxes({
            xLabel: "t (s)",
            yLabel: "u (in)",
            grid: true
          })), l.show();
        } catch (m) {
          o += `  \u26A0\uFE0F Error TH: ${m.message}
`;
        }
      }
      console.log(o);
    },
    runModal(e, s, c) {
      if (s.nodes.val.length) try {
        const o = A(s.nodes.val, s.elements.val, s.nodeInputs.val, s.elementInputs.val, 6);
        console.log(`[Paz 13.1 \u2014 Modal Hekatan FEM 3D] frecuencias:
` + o.frequencies.slice(0, 6).map((i, r) => `  Modo ${r + 1}: f = ${i.toFixed(3)} Hz   T = ${(1 / i).toFixed(4)} s`).join(`
`)), (c == null ? void 0 : c.render) && c.render(o, {
          title: "Paz 13.1 \u2014 Space frame 3D",
          properties: [
            `5 nodos: 1 libre + 4 empotrados radiando, L=${e.L_in}in`,
            `M1,3: A=${e.A1_in2} I=${e.I1_in4}; M2,4: A=${e.A2_in2} I=${e.I2_in4}`
          ]
        });
      } catch (o) {
        console.error("[Paz 13.1 Modal FEM] error:", o.message);
      }
    }
  };
  function k(e) {
    const s = u.in_to_m(e.L_in), c = u.psi_to_kNm2(e.E_psi), o = u.psi_to_kNm2(e.G_psi), i = u.in2_to_m2(e.A1_in2), r = u.in2_to_m2(e.A2_in2), m = u.in4_to_m4(e.I1_in4), b = u.in4_to_m4(e.I2_in4), f = u.in4_to_m4(e.J1_in4), z = u.in4_to_m4(e.J2_in4), _ = 386.088, x = e.mbar1 * _ / e.A1_in2 * 175.13 / 0.0254, M = e.mbar2 * _ / e.A2_in2 * 175.13 / 0.0254, g = [
      [
        0,
        0,
        0
      ],
      [
        0,
        0,
        -s
      ],
      [
        0,
        s,
        0
      ],
      [
        -s,
        0,
        0
      ],
      [
        0,
        -s,
        0
      ]
    ], T = [
      [
        0,
        1
      ],
      [
        0,
        2
      ],
      [
        0,
        3
      ],
      [
        0,
        4
      ]
    ], h = /* @__PURE__ */ new Map();
    for (let t = 1; t <= 4; t++) h.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const d = (e.F0_lb ?? 5e3) * 444822e-8, l = /* @__PURE__ */ new Map();
    l.set(0, [
      0,
      0,
      d,
      0,
      0,
      0
    ]);
    const p = [
      0,
      1,
      2,
      3
    ].map((t) => {
      const a = t === 0 || t === 2;
      return {
        A: a ? i : r,
        Iy: a ? m : b,
        Iz: a ? m : b,
        J: a ? f : z,
        E: c,
        G: o,
        rho: a ? x : M,
        label: a ? `Member ${t + 1} (type 1)` : `Member ${t + 1} (type 2)`,
        e2kName: a ? "MEM_TYPE1" : "MEM_TYPE2",
        e2kShape: "Steel I/Wide Flange",
        e2kD: a ? 0.3 : 0.2,
        e2kB: a ? 0.2 : 0.15,
        e2kTF: 0.018,
        e2kTW: 0.011
      };
    });
    return {
      nodes: g,
      elements: T,
      supports: h,
      loads: l,
      sectionByElement: p,
      materialName: "A992Fy50",
      materialType: "Steel"
    };
  }
  function H(e) {
    const s = e.E_psi, c = e.G_psi, o = e.L_in, i = F(6), r = F(6);
    function m(b, f, z, _, x) {
      const M = s * b / o, g = 12 * s * f / Math.pow(o, 3), T = c * z / o, h = 4 * s * f / o;
      i[_][_] += M;
      for (let d = 0; d < 3; d++) d !== _ && (i[d][d] += g);
      i[_ + 3][_ + 3] += T;
      for (let d = 3; d < 6; d++) d !== _ + 3 && (i[d][d] += h);
      const n = x * o / 2;
      r[0][0] += n, r[1][1] += n, r[2][2] += n, r[3][3] += n * o * o * 1e-3, r[4][4] += n * o * o * 1e-3, r[5][5] += n * o * o * 1e-3;
    }
    return m(e.A1_in2, e.I1_in4, e.J1_in4, 2, e.mbar1), m(e.A2_in2, e.I2_in4, e.J2_in4, 1, e.mbar2), m(e.A1_in2, e.I1_in4, e.J1_in4, 0, e.mbar1), m(e.A2_in2, e.I2_in4, e.J2_in4, 1, e.mbar2), {
      K6: i,
      M6: r
    };
  }
});
export {
  __tla,
  N as b
};
