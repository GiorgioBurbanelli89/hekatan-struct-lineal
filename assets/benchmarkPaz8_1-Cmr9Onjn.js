import { b as W, g as C, d as A, P as r, __tla as __tla_0 } from "./pazFrameE2k-DwsnXikM.js";
import { g } from "./chartPanel-DKe9UCQ8.js";
import { s as B, a as D, b as N, n as $ } from "./newmarkBeta-BvlZHnmY.js";
let R;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  R = {
    id: "benchmark-paz-8-1",
    name: "\u{1F3C1} Frame \xB7 Paz 8.1 (2-DOF triangular impulse)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 8.1 \u2014 Mismo edificio Paz 7.1 con cargas triangulares en pisos.",
      "F\u2081(t) = 10,000\xB7(1-t/0.1) lb, F\u2082(t) = 20,000\xB7(1-t/0.1) lb (descendiente t\u2208[0,0.1]).",
      "Validaci\xF3n: modal superposition (libro) vs Newmark-\u03B2 directo (TS Hekatan).",
      "Libro: u\u2081_max \u2248 0.70 in, u\u2082_max \u2248 0.92 in (cota superior |\u03A3|\u03C6\u1D62\xB7q\u1D62_max).",
      "\u{1F4C8} Chart Panel: u(t), F(t) descomposici\xF3n por piso.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS con cargas TIME HISTORY function."
    ],
    params: {
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
        label: "I col piso 1 (in\u2074)",
        folder: "Secci\xF3n"
      },
      I2_in4: {
        default: 118,
        min: 50,
        max: 600,
        step: 1,
        label: "I col piso 2 (in\u2074)",
        folder: "Secci\xF3n"
      },
      W1_lb: {
        default: 52500,
        min: 1e4,
        max: 15e4,
        step: 500,
        label: "W1 (lb)",
        folder: "Cargas est\xE1ticas"
      },
      W2_lb: {
        default: 25500,
        min: 5e3,
        max: 1e5,
        step: 500,
        label: "W2 (lb)",
        folder: "Cargas est\xE1ticas"
      },
      E_psi: {
        default: 3e7,
        min: 25e6,
        max: 35e6,
        step: 5e5,
        label: "E (psi)",
        folder: "Material"
      },
      F1_lb: {
        default: 1e4,
        min: 0,
        max: 5e4,
        step: 100,
        label: "F\u2081 pico piso 1 (lb)",
        folder: "Time History"
      },
      F2_lb: {
        default: 2e4,
        min: 0,
        max: 5e4,
        step: 100,
        label: "F\u2082 pico piso 2 (lb)",
        folder: "Time History"
      },
      td_s: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "Duraci\xF3n td (s)",
        folder: "Time History"
      },
      tEnd_s: {
        default: 1,
        min: 0.5,
        max: 5,
        step: 0.1,
        label: "t fin (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 2e-3,
        min: 1e-4,
        max: 0.05,
        step: 1e-4,
        label: "\u0394t Newmark (s)",
        folder: "Time History"
      },
      xi: {
        default: 0,
        min: 0,
        max: 0.2,
        step: 5e-3,
        label: "Damping \u03BE (libro=0)",
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
          "u(t) ambos pisos": 0,
          "F(t) ambos pisos": 1,
          "v(t)": 2,
          "a(t)": 3
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
    onParamChange(e, i) {
      if (e === "exportE2k" && i.exportE2k > 0.5) {
        const b = h(i), { filename: n, content: c } = C(b, "Paz_8_1");
        A(n, c), console.log(`[Paz 8.1] e2k exportado: ${n}`), i.exportE2k = 0;
      }
      e === "showTH" && i.showTH < 0.5 && g().hide();
    },
    build(e, i) {
      const b = h(e);
      W(b, i);
      const n = e.E_psi, c = e.I1_in4, T = e.I2_in4, F = e.H1_ft * 12, H = e.H2_ft * 12, y = 12 * n * c * 2 / Math.pow(F, 3), E = 12 * n * T * 2 / Math.pow(H, 3), k = e.W1_lb / 386.088, S = e.W2_lb / 386.088, { K: f, M: _ } = B([
        k,
        S
      ], [
        y,
        E
      ]), M = e.F1_lb, P = e.F2_lb, x = e.td_s, u = (s) => {
        if (s <= 0 || s >= x) return [
          0,
          0
        ];
        const d = 1 - s / x;
        return [
          M * d,
          P * d
        ];
      };
      let m = `[Paz 8.1] 2-DOF triangular impulse
`;
      try {
        const s = D(f, _), d = Math.sqrt(s.omega2[0]), w = Math.sqrt(s.omega2[1]), z = N(_, f, d, w, e.xi), I = Math.floor(e.tEnd_s / e.dt_s), o = $({
          M: _,
          K: f,
          C: z,
          loadFunc: u,
          u0: [
            0,
            0
          ],
          v0: [
            0,
            0
          ],
          dt: e.dt_s,
          nSteps: I,
          gamma: 0.5,
          beta: 0.25
        }), L = Math.max(...o.u.map((a) => Math.abs(a[0]))), v = Math.max(...o.u.map((a) => Math.abs(a[1])));
        if (m += `  Modal: f1=${s.freqs[0].toFixed(3)}, f2=${s.freqs[1].toFixed(3)} Hz
`, m += `  Newmark-\u03B2: u1_max=${L.toFixed(4)} in (libro \u22480.70)
`, m += `             u2_max=${v.toFixed(4)} in (libro \u22480.92)
`, e.showTH > 0.5) {
          const a = g(), p = Math.round(e.plotType ?? 0);
          p === 0 ? (a.setTitle("Paz 8.1 \u2014 u(t)"), a.setSeries([
            {
              label: "u\u2081(t) piso 1",
              data: o.t.map((t, l) => [
                t,
                o.u[l][0]
              ]),
              color: "#1a4d8c",
              width: 2
            },
            {
              label: "u\u2082(t) piso 2",
              data: o.t.map((t, l) => [
                t,
                o.u[l][1]
              ]),
              color: "#c0392b",
              width: 2
            }
          ]), a.setAxes({
            xLabel: "t (s)",
            yLabel: "u (in)",
            grid: true
          })) : p === 1 ? (a.setTitle("Paz 8.1 \u2014 Cargas F(t) triangulares"), a.setSeries([
            {
              label: "F\u2081(t) piso 1",
              data: o.t.map((t) => [
                t,
                u(t)[0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "F\u2082(t) piso 2",
              data: o.t.map((t) => [
                t,
                u(t)[1]
              ]),
              color: "#c0392b"
            }
          ]), a.setAxes({
            xLabel: "t (s)",
            yLabel: "F (lb)",
            grid: true
          })) : p === 2 ? (a.setTitle("Paz 8.1 \u2014 v(t)"), a.setSeries([
            {
              label: "v\u2081(t)",
              data: o.t.map((t, l) => [
                t,
                o.v[l][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "v\u2082(t)",
              data: o.t.map((t, l) => [
                t,
                o.v[l][1]
              ]),
              color: "#c0392b"
            }
          ]), a.setAxes({
            xLabel: "t (s)",
            yLabel: "v (in/s)",
            grid: true
          })) : (a.setTitle("Paz 8.1 \u2014 a(t)"), a.setSeries([
            {
              label: "a\u2081(t)",
              data: o.t.map((t, l) => [
                t,
                o.a[l][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "a\u2082(t)",
              data: o.t.map((t, l) => [
                t,
                o.a[l][1]
              ]),
              color: "#c0392b"
            }
          ]), a.setAxes({
            xLabel: "t (s)",
            yLabel: "a (in/s\xB2)",
            grid: true
          })), a.show();
        }
      } catch (s) {
        m += `  \u26A0\uFE0F Error: ${s.message}
`;
      }
      console.log(m);
    },
    hasModal: false
  };
  function h(e) {
    const i = r.psi_to_kNm2(e.E_psi);
    return {
      nStories: 2,
      storyHeights: [
        r.in_to_m(e.H1_ft * 12),
        r.in_to_m(e.H2_ft * 12)
      ],
      bayWidth: r.in_to_m(e.bay_ft * 12),
      storyWeights: [
        r.lb_to_kN(e.W1_lb),
        r.lb_to_kN(e.W2_lb)
      ],
      I_per_column: [
        r.in4_to_m4(e.I1_in4),
        r.in4_to_m4(e.I2_in4)
      ],
      nCols: 2,
      E: i,
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
  R as b
};
