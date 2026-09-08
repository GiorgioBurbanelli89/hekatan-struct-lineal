import { m as M, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { b as P, g as v, d as S, P as _, __tla as __tla_1 } from "./pazFrameE2k-DwsnXikM.js";
import { g as h } from "./chartPanel-DKe9UCQ8.js";
import { s as x, a as y, b as A, p as w, r as H, n as L } from "./newmarkBeta-BvlZHnmY.js";
let W;
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
  let D;
  D = {
    k_lbin: 327.35,
    m_lbs2in: 1,
    freqs_Hz: [
      1,
      2.88,
      4.41,
      5.41
    ],
    omega2: [
      39.48,
      327.35,
      768.3,
      1156
    ],
    modes: [
      [
        0.228,
        0.5774,
        0.6565,
        -0.4285
      ],
      [
        0.4285,
        -0.5774,
        -0.228,
        0.6565
      ],
      [
        0.5774,
        0,
        -0.5774,
        -0.5774
      ],
      [
        0.6565,
        0.5774,
        0.4285,
        0.228
      ]
    ]
  };
  W = {
    id: "benchmark-paz-9-3",
    name: "\u{1F3C1} Frame \xB7 Paz 9.3 (4-story uniform shear bldg)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 9.3 \u2014 Four-story uniform shear building (modal analysis can\xF3nico).",
      "Pisos uniformes: H=10ft, k=327.35 lb/in cada uno, m=1.0 lb\xB7s\xB2/in cada piso.",
      "Resultados del libro: f\u2081=1.00, f\u2082=2.88, f\u2083=4.41, f\u2084=5.41 Hz.",
      "Matriz modal \u03A6 del libro (p.228) coincide con autovectores del solver.",
      "\u{1F4C8} Chart Panel: muestra los 4 modos como gr\xE1ficas piso-vs-\u03C6.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS can\xF3nico para validaci\xF3n."
    ],
    params: {
      H_ft: {
        default: 10,
        min: 6,
        max: 20,
        step: 0.5,
        label: "H piso (ft)",
        folder: "Geometr\xEDa"
      },
      bay_ft: {
        default: 30,
        min: 10,
        max: 60,
        step: 1,
        label: "Ancho bay (ft)",
        folder: "Geometr\xEDa"
      },
      k_lbin: {
        default: 327.35,
        min: 100,
        max: 1e3,
        step: 1,
        label: "k por piso (lb/in)",
        folder: "Rigidez"
      },
      m_lbs2in: {
        default: 1,
        min: 0.1,
        max: 10,
        step: 0.1,
        label: "m por piso (lb\xB7s\xB2/in)",
        folder: "Masa"
      },
      E_psi: {
        default: 3e7,
        min: 25e6,
        max: 35e6,
        step: 5e5,
        label: "E acero (psi)",
        folder: "Material"
      },
      F0_lb: {
        default: 50,
        min: 0,
        max: 500,
        step: 1,
        label: "Pulso F0 piso 4 (lb)",
        folder: "Time History"
      },
      pulseDur_s: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "Duraci\xF3n pulso (s)",
        folder: "Time History"
      },
      tEnd_s: {
        default: 5,
        min: 1,
        max: 20,
        step: 0.5,
        label: "t fin an\xE1lisis (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 0.01,
        min: 1e-3,
        max: 0.05,
        step: 1e-3,
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
        default: 4,
        label: "Tipo gr\xE1fica",
        options: {
          "u(t)": 0,
          "v(t)": 1,
          "a(t)": 2,
          "F(t)": 3,
          Modos: 4
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
    onParamChange(e, t) {
      if (e === "exportE2k" && t.exportE2k > 0.5) {
        const s = z(t), { filename: r, content: m } = v(s, "Paz_9_3");
        S(r, m), console.log(`[Paz 9.3] e2k exportado: ${r} (${m.length} bytes)`), t.exportE2k = 0;
      }
      e === "showTH" && t.showTH < 0.5 && h().hide();
    },
    computedLabels(e) {
      var _a, _b, _c, _d;
      const t = new Array(4).fill(e.m_lbs2in), s = new Array(4).fill(e.k_lbin), { K: r, M: m } = x(t, s);
      let i = [];
      try {
        i = y(r, m).freqs;
      } catch {
      }
      return {
        "f\u2081 calculado": `${((_a = i[0]) == null ? void 0 : _a.toFixed(3)) ?? "?"} Hz  (libro 1.00 Hz)`,
        "f\u2082 calculado": `${((_b = i[1]) == null ? void 0 : _b.toFixed(3)) ?? "?"} Hz  (libro 2.88 Hz)`,
        "f\u2083 calculado": `${((_c = i[2]) == null ? void 0 : _c.toFixed(3)) ?? "?"} Hz  (libro 4.41 Hz)`,
        "f\u2084 calculado": `${((_d = i[3]) == null ? void 0 : _d.toFixed(3)) ?? "?"} Hz  (libro 5.41 Hz)`
      };
    },
    build(e, t) {
      const s = z(e);
      P(s, t);
      const r = new Array(4).fill(e.m_lbs2in), m = new Array(4).fill(e.k_lbin), { K: i, M: c } = x(r, m);
      let f = `[Paz 9.3] 4-story uniform shear building
`;
      try {
        const n = y(i, c);
        f += `  Solver matricial directo:
`, n.freqs.forEach((a, l) => {
          const o = D.freqs_Hz[l], d = (a - o) / o * 100;
          f += `    f${l + 1} = ${a.toFixed(4)} Hz  (libro ${o.toFixed(2)}, \u0394 ${d.toFixed(3)}%)
`;
        });
        const k = Math.sqrt(n.omega2[0]), F = Math.sqrt(n.omega2[n.omega2.length - 1]), T = A(c, i, k, F, e.xi), E = w(H(e.F0_lb, 0, e.pulseDur_s), 3, 4), $ = Math.floor(e.tEnd_s / e.dt_s), b = L({
          M: c,
          K: i,
          C: T,
          loadFunc: E,
          u0: [
            0,
            0,
            0,
            0
          ],
          v0: [
            0,
            0,
            0,
            0
          ],
          dt: e.dt_s,
          nSteps: $,
          gamma: 0.5,
          beta: 0.25
        }), g = [
          0,
          0,
          0,
          0
        ];
        for (const a of b.u) for (let l = 0; l < 4; l++) g[l] = Math.max(g[l], Math.abs(a[l]));
        if (f += `  Newmark-\u03B2 TH (pulso F0=${e.F0_lb} lb por ${e.pulseDur_s}s, \u03BE=${e.xi}):
`, f += `    u_max = ${g.map((a) => a.toExponential(3)).join(", ")} in
`, e.showTH > 0.5) {
          const a = h(), l = Math.round(e.plotType ?? 4);
          if (l === 0) a.setTitle("Paz 9.3 \u2014 Time History u(t)"), a.setSeries([
            0,
            1,
            2,
            3
          ].map((o) => ({
            label: `u${o + 1}(t)`,
            data: b.t.map((d, u) => [
              d,
              b.u[u][o]
            ]),
            color: [
              "#1a4d8c",
              "#2d8659",
              "#d4a017",
              "#c0392b"
            ][o]
          }))), a.setAxes({
            xLabel: "t (s)",
            yLabel: "u (in)",
            grid: true
          });
          else if (l === 1) a.setTitle("Paz 9.3 \u2014 Velocidad v(t)"), a.setSeries([
            0,
            1,
            2,
            3
          ].map((o) => ({
            label: `v${o + 1}(t)`,
            data: b.t.map((d, u) => [
              d,
              b.v[u][o]
            ]),
            color: [
              "#1a4d8c",
              "#2d8659",
              "#d4a017",
              "#c0392b"
            ][o]
          }))), a.setAxes({
            xLabel: "t (s)",
            yLabel: "v (in/s)",
            grid: true
          });
          else if (l === 2) a.setTitle("Paz 9.3 \u2014 Aceleraci\xF3n a(t)"), a.setSeries([
            0,
            1,
            2,
            3
          ].map((o) => ({
            label: `a${o + 1}(t)`,
            data: b.t.map((d, u) => [
              d,
              b.a[u][o]
            ]),
            color: [
              "#1a4d8c",
              "#2d8659",
              "#d4a017",
              "#c0392b"
            ][o]
          }))), a.setAxes({
            xLabel: "t (s)",
            yLabel: "a (in/s\xB2)",
            grid: true
          });
          else if (l === 3) a.setTitle("Paz 9.3 \u2014 Carga F(t) en piso 4"), a.setSeries([
            {
              label: "F(t)",
              data: b.t.map((o) => [
                o,
                H(e.F0_lb, 0, e.pulseDur_s)(o)
              ]),
              color: "#7d3c98"
            }
          ]), a.setAxes({
            xLabel: "t (s)",
            yLabel: "F (lb)",
            grid: true
          });
          else if (l === 4) {
            a.setTitle("Paz 9.3 \u2014 Modos {\u03C6\u2081..\u03C6\u2084}");
            const o = [
              0,
              1,
              2,
              3
            ].map((d) => {
              const u = [
                [
                  0,
                  0
                ]
              ];
              for (let p = 0; p < 4; p++) u.push([
                n.modes[p][d],
                p + 1
              ]);
              return {
                label: `Modo ${d + 1} (f=${n.freqs[d].toFixed(2)} Hz)`,
                data: u,
                color: [
                  "#1a4d8c",
                  "#2d8659",
                  "#d4a017",
                  "#c0392b"
                ][d],
                width: 2.5
              };
            });
            a.setSeries(o), a.setAxes({
              xLabel: "\u03C6",
              yLabel: "piso (0=base)",
              grid: true
            });
          }
          a.show();
        }
      } catch (n) {
        f += `  \u26A0\uFE0F Error: ${n.message}
`;
      }
      console.log(f);
    },
    runModal(e, t, s) {
      if (t.nodes.val.length) try {
        const r = M(t.nodes.val, t.elements.val, t.nodeInputs.val, t.elementInputs.val, 6);
        console.log(`[Paz 9.3 \u2014 Modal Hekatan FEM 3D] frecuencias:
` + r.frequencies.slice(0, 6).map((m, i) => `  Modo ${i + 1}: f = ${m.toFixed(3)} Hz   T = ${(1 / m).toFixed(4)} s`).join(`
`)), (s == null ? void 0 : s.render) && s.render(r, {
          title: "Paz 9.3 \u2014 4-story uniform shear building",
          properties: [
            "Libro: f\u2081=1.00, f\u2082=2.88, f\u2083=4.41, f\u2084=5.41 Hz",
            `H=${e.H_ft}ft, k=${e.k_lbin} lb/in, m=${e.m_lbs2in} lb\xB7s\xB2/in`
          ]
        });
      } catch (r) {
        console.error("[Paz 9.3 Modal FEM] error:", r.message);
      }
    }
  };
  function z(e) {
    const t = _.psi_to_kNm2(e.E_psi), s = _.in_to_m(e.H_ft * 12), r = _.in_to_m(e.bay_ft * 12), m = e.H_ft * 12, i = e.k_lbin * Math.pow(m, 3) / (24 * e.E_psi), c = _.in4_to_m4(i), f = e.m_lbs2in * 386.088, n = _.lb_to_kN(f);
    return {
      nStories: 4,
      storyHeights: [
        s,
        s,
        s,
        s
      ],
      bayWidth: r,
      storyWeights: [
        n,
        n,
        n,
        n
      ],
      I_per_column: [
        c,
        c,
        c,
        c
      ],
      nCols: 2,
      E: t,
      gamma: 76.97,
      colSection: {
        D: 0.2,
        B: 0.2
      },
      materialType: "Steel"
    };
  }
});
export {
  __tla,
  W as b
};
