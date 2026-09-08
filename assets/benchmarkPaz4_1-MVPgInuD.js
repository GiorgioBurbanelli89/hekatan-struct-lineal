import { b as M, g as $, d as D, P as c, __tla as __tla_0 } from "./pazFrameE2k-C_YDGYOS.js";
import { g as p } from "./chartPanel-DKe9UCQ8.js";
import { p as z, r as F, n as w } from "./newmarkBeta-BvlZHnmY.js";
let C;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let d;
  d = {
    DLF_max: 1.9,
    u_max_in: 0.667,
    sigma_max_psi: 15083
  };
  C = {
    id: "benchmark-paz-4-1",
    name: "\u{1F3C1} Frame \xB7 Paz 4.1 (1-DOF rectangular impulse)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 4.1 \u2014 P\xF3rtico 1-DOF bajo pulso rectangular (Duhamel + Newmark).",
      "Geometr\xEDa: H=15ft, 2 cols I=69.2 in\u2074, viga r\xEDgida. m=W/g=12.95 lb\xB7s\xB2/in.",
      "Material steel E=30e6 psi. T=0.2446 s, f=4.09 Hz.",
      "Carga: pulso rect F0=3000 lb, td=0.1s \u2192 td/T=0.408 \u2192 DLF=1.9 (libro).",
      "Resultado libro: u_max=0.667 in, \u03C3_max=15,083 psi en columnas.",
      "\u{1F4C8} Chart Panel: u(t), v(t), a(t), F(t).",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS 1-piso para validaci\xF3n."
    ],
    params: {
      H_ft: {
        default: 15,
        min: 8,
        max: 25,
        step: 0.5,
        label: "H piso (ft)",
        folder: "Geometr\xEDa"
      },
      bay_ft: {
        default: 20,
        min: 10,
        max: 40,
        step: 1,
        label: "Ancho bay (ft)",
        folder: "Geometr\xEDa"
      },
      I_in4: {
        default: 69.2,
        min: 20,
        max: 300,
        step: 1,
        label: "I por columna (in\u2074)",
        folder: "Secci\xF3n"
      },
      S_in3: {
        default: 17,
        min: 5,
        max: 100,
        step: 0.5,
        label: "S m\xF3dulo secci\xF3n (in\xB3)",
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
      W_lb: {
        default: 5e3,
        min: 1e3,
        max: 5e4,
        step: 100,
        label: "W tope (lb)",
        folder: "Cargas"
      },
      F0_lb: {
        default: 3e3,
        min: 0,
        max: 2e4,
        step: 100,
        label: "Pulso F0 (lb)",
        folder: "Time History"
      },
      td_s: {
        default: 0.1,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "Duraci\xF3n pulso td (s)",
        folder: "Time History"
      },
      tEnd_s: {
        default: 1,
        min: 0.2,
        max: 5,
        step: 0.1,
        label: "t fin (s)",
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
          "u(t)": 0,
          "v(t)": 1,
          "a(t)": 2,
          "F(t)": 3
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
    onParamChange(t, o) {
      if (t === "exportE2k" && o.exportE2k > 0.5) {
        const i = g(o), { filename: l, content: a } = $(i, "Paz_4_1");
        D(l, a), console.log(`[Paz 4.1] e2k exportado: ${l}`), o.exportE2k = 0;
      }
      t === "showTH" && o.showTH < 0.5 && p().hide();
    },
    computedLabels(t) {
      const o = t.H_ft * 12, i = 12 * t.E_psi * 2 * t.I_in4 / Math.pow(o, 3), l = t.W_lb / 386.088, a = Math.sqrt(i / l), s = 2 * Math.PI / a, x = 1 / s, b = t.F0_lb / i;
      return {
        "k (lb/in)": i.toFixed(2),
        "m (lb\xB7s\xB2/in)": l.toFixed(4),
        "T calculado": `${s.toFixed(4)} s  (libro 0.2446)`,
        "\u03C9 calculado": `${a.toFixed(2)} rad/s  (libro 25.69)`,
        "f calculado": `${x.toFixed(3)} Hz  (libro 4.09)`,
        "u_st = F0/k": `${b.toFixed(4)} in`,
        "td/T": (t.td_s / s).toFixed(3),
        "u_max esperado libro": `${d.u_max_in} in (DLF=${d.DLF_max})`
      };
    },
    build(t, o) {
      const i = g(t);
      M(i, o);
      const l = t.H_ft * 12, a = 12 * t.E_psi * 2 * t.I_in4 / Math.pow(l, 3), s = t.W_lb / 386.088, x = Math.sqrt(a / s), b = 2 * Math.PI / x;
      let m = `[Paz 4.1] 1-DOF rectangular impulse
`;
      m += `  k=${a.toFixed(2)} lb/in, m=${s.toFixed(4)} lb\xB7s\xB2/in
`, m += `  T=${b.toFixed(4)} s  (libro 0.2446)
`, m += `  td/T=${(t.td_s / b).toFixed(3)}
`;
      const h = [
        [
          s
        ]
      ], T = [
        [
          a
        ]
      ], k = [
        [
          2 * t.xi * Math.sqrt(s * a)
        ]
      ], P = z(F(t.F0_lb, 0, t.td_s), 0, 1), y = Math.floor(t.tEnd_s / t.dt_s), n = w({
        M: h,
        K: T,
        C: k,
        loadFunc: P,
        u0: [
          0
        ],
        v0: [
          0
        ],
        dt: t.dt_s,
        nSteps: y
      }), u = Math.max(...n.u.map((e) => Math.abs(e[0]))), E = t.F0_lb / a, H = u / E, S = (u - d.u_max_in) / d.u_max_in * 100;
      m += `  Newmark-\u03B2: u_max = ${u.toFixed(4)} in  (libro ${d.u_max_in}, \u0394 ${S.toFixed(2)}%)
`, m += `  DLF calculado = ${H.toFixed(3)} (libro ${d.DLF_max})
`;
      const L = a * u * l / 2 / t.S_in3;
      if (m += `  \u03C3_max columnas = ${L.toFixed(0)} psi  (libro ${d.sigma_max_psi})
`, t.showTH > 0.5) {
        const e = p(), f = Math.round(t.plotType ?? 0);
        f === 0 ? (e.setTitle("Paz 4.1 \u2014 u(t)"), e.setSeries([
          {
            label: "u(t)",
            data: n.t.map((r, _) => [
              r,
              n.u[_][0]
            ]),
            color: "#1a4d8c",
            width: 2
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "u (in)",
          grid: true
        })) : f === 1 ? (e.setTitle("Paz 4.1 \u2014 v(t)"), e.setSeries([
          {
            label: "v(t)",
            data: n.t.map((r, _) => [
              r,
              n.v[_][0]
            ]),
            color: "#1a4d8c"
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "v (in/s)",
          grid: true
        })) : f === 2 ? (e.setTitle("Paz 4.1 \u2014 a(t)"), e.setSeries([
          {
            label: "a(t)",
            data: n.t.map((r, _) => [
              r,
              n.a[_][0]
            ]),
            color: "#1a4d8c"
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "a (in/s\xB2)",
          grid: true
        })) : (e.setTitle("Paz 4.1 \u2014 F(t)"), e.setSeries([
          {
            label: "F(t)",
            data: n.t.map((r) => [
              r,
              F(t.F0_lb, 0, t.td_s)(r)
            ]),
            color: "#7d3c98"
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "F (lb)",
          grid: true
        })), e.show();
      }
      console.log(m);
    },
    hasModal: false
  };
  function g(t) {
    const o = c.psi_to_kNm2(t.E_psi), i = c.in_to_m(t.H_ft * 12), l = c.in_to_m(t.bay_ft * 12), a = c.in4_to_m4(t.I_in4), s = c.lb_to_kN(t.W_lb);
    return {
      nStories: 1,
      storyHeights: [
        i
      ],
      bayWidth: l,
      storyWeights: [
        s
      ],
      I_per_column: [
        a
      ],
      nCols: 2,
      E: o,
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
  C as b
};
