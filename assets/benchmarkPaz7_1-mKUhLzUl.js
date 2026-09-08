import { m as G, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { b as q, g as R, d as j, P as c, __tla as __tla_1 } from "./pazFrameE2k-DwsnXikM.js";
import { g as E } from "./chartPanel-DKe9UCQ8.js";
import { s as $, a as I, b as K, p as U, r as P, n as V } from "./newmarkBeta-BvlZHnmY.js";
let X;
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
  let b;
  b = {
    H1_ft: 15,
    H2_ft: 10,
    bayWidth_ft: 30,
    W1_lb: 52500,
    W2_lb: 25500,
    m1_lbs2in: 136,
    m2_lbs2in: 66,
    k1_lbin: 30700,
    k2_lbin: 44300,
    I1_in4: 248,
    I2_in4: 118,
    E_psi: 3e7,
    f1_Hz: 1.88,
    f2_Hz: 5.24,
    T1_s: 0.532,
    T2_s: 0.191,
    omega1_rads: 11.83,
    omega2_rads: 32.89,
    mode1: [
      1,
      1.263
    ],
    mode2: [
      1,
      -1.629
    ]
  };
  X = {
    id: "benchmark-paz-7-1",
    name: "\u{1F3C1} Frame \xB7 Paz 7.1 (2-story shear building)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 7.1 \u2014 Two-story steel shear building, validaci\xF3n modal can\xF3nica.",
      "Pisos: H1=15ft, H2=10ft. 2 columnas por marco I=248/118 in\u2074 (W14 W12).",
      "Pesos: W1=52,500 lb (m1=136 lb\xB7s\xB2/in), W2=25,500 lb (m2=66 lb\xB7s\xB2/in).",
      "Vigas idealmente r\xEDgidas \u2192 shear building puro (DIAPHRAGM RIGID en e2k).",
      "Resultados anal\xEDticos (libro p.179): f1=1.88 Hz, f2=5.24 Hz; modos {1, 1.263} y {1, -1.629}.",
      "\u{1F4C8} Chart Panel: muestra time history Newmark-\u03B2 y modos.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS can\xF3nico para validaci\xF3n cruzada."
    ],
    params: {
      useImperial: {
        default: 1,
        boolean: true,
        label: "Usar unidades del libro (lb-in)",
        folder: "Geometr\xEDa"
      },
      H1_ft: {
        default: 15,
        min: 8,
        max: 25,
        step: 0.5,
        label: "H1 piso 1 (ft)",
        folder: "Geometr\xEDa"
      },
      H2_ft: {
        default: 10,
        min: 6,
        max: 20,
        step: 0.5,
        label: "H2 piso 2 (ft)",
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
      I1_in4: {
        default: 248,
        min: 50,
        max: 600,
        step: 1,
        label: "I1 col piso 1 (in\u2074)",
        folder: "Secci\xF3n"
      },
      I2_in4: {
        default: 118,
        min: 50,
        max: 600,
        step: 1,
        label: "I2 col piso 2 (in\u2074)",
        folder: "Secci\xF3n"
      },
      W1_lb: {
        default: 52500,
        min: 1e4,
        max: 15e4,
        step: 500,
        label: "W1 piso 1 (lb)",
        folder: "Cargas"
      },
      W2_lb: {
        default: 25500,
        min: 5e3,
        max: 1e5,
        step: 500,
        label: "W2 piso 2 (lb)",
        folder: "Cargas"
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
        default: 5e3,
        min: 0,
        max: 2e4,
        step: 100,
        label: "Pulso F0 piso 2 (lb)",
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
        default: 2,
        min: 0.5,
        max: 10,
        step: 0.1,
        label: "t fin an\xE1lisis (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 5e-3,
        min: 5e-4,
        max: 0.05,
        step: 5e-4,
        label: "\u0394t Newmark (s)",
        folder: "Time History"
      },
      xi: {
        default: 0.05,
        min: 0,
        max: 0.2,
        step: 5e-3,
        label: "Damping \u03BE (Rayleigh)",
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
          "u(t) \u2014 desplaz.": 0,
          "v(t) \u2014 vel.": 1,
          "a(t) \u2014 acel.": 2,
          "F(t) \u2014 carga": 3,
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
    onParamChange(e, a) {
      if (e === "exportE2k" && a.exportE2k > 0.5) {
        const d = W(a), { filename: i, content: r } = R(d, "Paz_7_1");
        j(i, r), console.log(`[Paz 7.1] e2k exportado: ${i} (${r.length} bytes)`), a.exportE2k = 0;
      }
      e === "showTH" && a.showTH < 0.5 && E().hide();
    },
    computedLabels(e) {
      const a = e.E_psi, d = e.I1_in4, i = e.I2_in4, r = e.H1_ft * 12, _ = e.H2_ft * 12, p = 12 * a * d * 2 / Math.pow(r, 3), H = 12 * a * i * 2 / Math.pow(_, 3), x = e.W1_lb / 386.088, h = e.W2_lb / 386.088, { K: z, M: y } = $([
        x,
        h
      ], [
        p,
        H
      ]);
      let f = NaN, u = NaN;
      try {
        const n = I(z, y);
        f = n.freqs[0], u = n.freqs[1];
      } catch {
      }
      return {
        "k1 (lb/in)": p.toFixed(0),
        "k2 (lb/in)": H.toFixed(0),
        "m1 (lb\xB7s\xB2/in)": x.toFixed(2),
        "m2 (lb\xB7s\xB2/in)": h.toFixed(2),
        "f1 calculado": `${f.toFixed(3)} Hz  (libro 1.880 Hz)`,
        "f2 calculado": `${u.toFixed(3)} Hz  (libro 5.240 Hz)`,
        "T1 calculado": `${(1 / f).toFixed(3)} s  (libro 0.532 s)`,
        "T2 calculado": `${(1 / u).toFixed(3)} s  (libro 0.191 s)`
      };
    },
    build(e, a) {
      const d = W(e);
      q(d, a);
      const i = e.E_psi, r = e.I1_in4, _ = e.I2_in4, p = e.H1_ft * 12, H = e.H2_ft * 12, x = 12 * i * r * 2 / Math.pow(p, 3), h = 12 * i * _ * 2 / Math.pow(H, 3), z = e.W1_lb / 386.088, y = e.W2_lb / 386.088, { K: f, M: u } = $([
        z,
        y
      ], [
        x,
        h
      ]);
      let n = `[Paz 7.1] 2-story shear building
`;
      try {
        const m = I(f, u), F = m.freqs[0], T = m.freqs[1], S = (F - b.f1_Hz) / b.f1_Hz * 100, v = (T - b.f2_Hz) / b.f2_Hz * 100;
        n += `  Solver matricial directo:
`, n += `    f1 = ${F.toFixed(4)} Hz  (libro ${b.f1_Hz}, \u0394 ${S.toFixed(3)}%)
`, n += `    f2 = ${T.toFixed(4)} Hz  (libro ${b.f2_Hz}, \u0394 ${v.toFixed(3)}%)
`;
        const M = m.modes.map((t) => t[0] / m.modes[0][0]), k = m.modes.map((t) => t[1] / m.modes[0][1]);
        n += `    Mode 1: {${M.map((t) => t.toFixed(3)).join(", ")}}  (libro {1.000, 1.263})
`, n += `    Mode 2: {${k.map((t) => t.toFixed(3)).join(", ")}}  (libro {1.000, -1.629})
`;
        const w = Math.sqrt(m.omega2[0]), A = Math.sqrt(m.omega2[1]), L = K(u, f, w, A, e.xi), D = U(P(e.F0_lb, 0, e.pulseDur_s), 1, 2), N = Math.floor(e.tEnd_s / e.dt_s), l = V({
          M: u,
          K: f,
          C: L,
          loadFunc: D,
          u0: [
            0,
            0
          ],
          v0: [
            0,
            0
          ],
          dt: e.dt_s,
          nSteps: N,
          gamma: 0.5,
          beta: 0.25
        }), C = Math.max(...l.u.map((t) => Math.abs(t[0]))), B = Math.max(...l.u.map((t) => Math.abs(t[1])));
        if (n += `  Newmark-\u03B2 TH (pulso F0=${e.F0_lb} lb, td=${e.pulseDur_s}s, \u03BE=${e.xi}):
`, n += `    u1_max = ${C.toExponential(4)} in,  u2_max = ${B.toExponential(4)} in
`, e.showTH > 0.5) {
          const t = E(), g = Math.round(e.plotType ?? 0);
          if (g === 0) t.setTitle("Paz 7.1 \u2014 Time History u(t)"), t.setSeries([
            {
              label: "u\u2081(t) piso 1",
              data: l.t.map((s, o) => [
                s,
                l.u[o][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "u\u2082(t) piso 2",
              data: l.t.map((s, o) => [
                s,
                l.u[o][1]
              ]),
              color: "#c0392b"
            }
          ]), t.setAxes({
            xLabel: "t (s)",
            yLabel: "u (in)",
            grid: true
          });
          else if (g === 1) t.setTitle("Paz 7.1 \u2014 Velocidad v(t)"), t.setSeries([
            {
              label: "v\u2081(t)",
              data: l.t.map((s, o) => [
                s,
                l.v[o][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "v\u2082(t)",
              data: l.t.map((s, o) => [
                s,
                l.v[o][1]
              ]),
              color: "#c0392b"
            }
          ]), t.setAxes({
            xLabel: "t (s)",
            yLabel: "v (in/s)",
            grid: true
          });
          else if (g === 2) t.setTitle("Paz 7.1 \u2014 Aceleraci\xF3n a(t)"), t.setSeries([
            {
              label: "a\u2081(t)",
              data: l.t.map((s, o) => [
                s,
                l.a[o][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "a\u2082(t)",
              data: l.t.map((s, o) => [
                s,
                l.a[o][1]
              ]),
              color: "#c0392b"
            }
          ]), t.setAxes({
            xLabel: "t (s)",
            yLabel: "a (in/s\xB2)",
            grid: true
          });
          else if (g === 3) {
            t.setTitle("Paz 7.1 \u2014 Carga F(t) en piso 2");
            const s = l.t.map((o) => [
              o,
              P(e.F0_lb, 0, e.pulseDur_s)(o)
            ]);
            t.setSeries([
              {
                label: "F\u2082(t) piso 2",
                data: s,
                color: "#7d3c98"
              }
            ]), t.setAxes({
              xLabel: "t (s)",
              yLabel: "F (lb)",
              grid: true
            });
          } else if (g === 4) {
            t.setTitle("Paz 7.1 \u2014 Modos {\u03C6}");
            const s = [
              [
                0,
                0
              ],
              [
                M[0],
                1
              ],
              [
                M[1],
                2
              ]
            ], o = [
              [
                0,
                0
              ],
              [
                k[0],
                1
              ],
              [
                k[1],
                2
              ]
            ];
            t.setSeries([
              {
                label: `Modo 1 (f=${F.toFixed(2)} Hz)`,
                data: s,
                color: "#1a4d8c",
                width: 3
              },
              {
                label: `Modo 2 (f=${T.toFixed(2)} Hz)`,
                data: o,
                color: "#c0392b",
                width: 3
              }
            ]), t.setAxes({
              xLabel: "\u03C6",
              yLabel: "piso (0=base)",
              grid: true
            });
          }
          t.show();
        }
      } catch (m) {
        n += `  \u26A0\uFE0F Error en c\xE1lculo: ${m.message}
`;
      }
      console.log(n);
    },
    runModal(e, a, d) {
      if (a.nodes.val.length) try {
        const i = G(a.nodes.val, a.elements.val, a.nodeInputs.val, a.elementInputs.val, 4);
        console.log(`[Paz 7.1 \u2014 Modal Hekatan FEM 3D] frecuencias:
` + i.frequencies.slice(0, 4).map((r, _) => `  Modo ${_ + 1}: f = ${r.toFixed(3)} Hz   T = ${(1 / r).toFixed(4)} s`).join(`
`)), (d == null ? void 0 : d.render) && d.render(i, {
          title: "Paz 7.1 \u2014 2-story shear building",
          properties: [
            `Libro: f\u2081=${b.f1_Hz} Hz, f\u2082=${b.f2_Hz} Hz`,
            `H1=${e.H1_ft}ft  H2=${e.H2_ft}ft  bay=${e.bay_ft}ft`
          ]
        });
      } catch (i) {
        console.error("[Paz 7.1 Modal FEM] error:", i.message);
      }
    }
  };
  function W(e) {
    const a = c.psi_to_kNm2(e.E_psi), d = c.in_to_m(e.H1_ft * 12), i = c.in_to_m(e.H2_ft * 12), r = c.in_to_m(e.bay_ft * 12), _ = c.in4_to_m4(e.I1_in4), p = c.in4_to_m4(e.I2_in4), H = c.lb_to_kN(e.W1_lb), x = c.lb_to_kN(e.W2_lb);
    return {
      nStories: 2,
      storyHeights: [
        d,
        i
      ],
      bayWidth: r,
      storyWeights: [
        H,
        x
      ],
      I_per_column: [
        _,
        p
      ],
      nCols: 2,
      E: a,
      gamma: 76.97,
      colSection: {
        D: 0.3,
        B: 0.3
      },
      materialType: "Steel"
    };
  }
});
export {
  __tla,
  X as b
};
