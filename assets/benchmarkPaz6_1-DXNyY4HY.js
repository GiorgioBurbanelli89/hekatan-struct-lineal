import { b as z, g as w, d as H, P as p, __tla as __tla_0 } from "./pazFrameE2k-DwsnXikM.js";
import { g as v } from "./chartPanel-DKe9UCQ8.js";
import { n as F } from "./newmarkBeta-BvlZHnmY.js";
let A;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  A = {
    id: "benchmark-paz-6-1",
    name: "\u{1F3C1} Frame \xB7 Paz 6.1 (Newmark-\u03B2 can\xF3nico 1-DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 6.1 \u2014 1-DOF con carga TRAPEZOIDAL: subida 0\u2192120 (0-0.02s), plateau (0.02-0.04s), bajada 120\u21920 (0.04-0.06s).",
      "Sistema: m=0.1 kip\xB7s\xB2/in, k=100 kip/in, \u03BE=0.2.",
      "T=0.20 s, \u0394t=0.02 s = T/10.",
      "Newmark \u03B3=1/2, \u03B2=1/6 (linear acceleration) y \u03B3=1/2, \u03B2=1/4 (average) \u2014 ambos comparables.",
      "Validaci\xF3n: solver Newmark-\u03B2 del libro vs implementaci\xF3n TS Hekatan.",
      "\u{1F4C8} Chart Panel: u(t), v(t), a(t), F(t) \u2014 trapezoidal vs respuesta.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 1-DOF equivalente como columna 1-piso."
    ],
    params: {
      m_kips2in: {
        default: 0.1,
        min: 0.01,
        max: 5,
        step: 0.01,
        label: "m (kip\xB7s\xB2/in)",
        folder: "Sistema"
      },
      k_kipin: {
        default: 100,
        min: 10,
        max: 1e3,
        step: 1,
        label: "k (kip/in)",
        folder: "Sistema"
      },
      xi: {
        default: 0.2,
        min: 0,
        max: 0.5,
        step: 5e-3,
        label: "Damping \u03BE",
        folder: "Sistema"
      },
      Fmax_kip: {
        default: 120,
        min: 0,
        max: 500,
        step: 1,
        label: "F_max trapezoide (kip)",
        folder: "Carga"
      },
      t1_s: {
        default: 0.02,
        min: 5e-3,
        max: 0.2,
        step: 5e-3,
        label: "t\u2081 rampa subida (s)",
        folder: "Carga"
      },
      t2_s: {
        default: 0.04,
        min: 0.01,
        max: 0.3,
        step: 5e-3,
        label: "t\u2082 fin plateau (s)",
        folder: "Carga"
      },
      t3_s: {
        default: 0.06,
        min: 0.02,
        max: 0.4,
        step: 5e-3,
        label: "t\u2083 fin bajada (s)",
        folder: "Carga"
      },
      tEnd_s: {
        default: 0.5,
        min: 0.1,
        max: 5,
        step: 0.1,
        label: "t fin (s)",
        folder: "Time History"
      },
      dt_s: {
        default: 1e-3,
        min: 1e-4,
        max: 0.05,
        step: 1e-4,
        label: "\u0394t Newmark (s)",
        folder: "Time History"
      },
      schemeBeta: {
        default: 0,
        label: "Esquema Newmark",
        options: {
          "\u03B3=\xBD, \u03B2=\xBC (avg accel \u2014 incond.)": 0,
          "\u03B3=\xBD, \u03B2=\u2159 (linear accel \u2014 Paz)": 1
        },
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
          "F(t)": 3,
          "Comparaci\xF3n esquemas": 4
        },
        folder: "Time History"
      },
      H_in: {
        default: 120,
        min: 60,
        max: 360,
        step: 6,
        label: "H equivalente (in, e2k)",
        folder: "Exportar"
      },
      exportE2k: {
        default: 0,
        boolean: true,
        label: "\u{1F4E4} Exportar a ETABS .e2k",
        folder: "Exportar"
      }
    },
    onParamChange(a, s) {
      if (a === "exportE2k" && s.exportE2k > 0.5) {
        const i = P(s), { filename: n, content: r } = w(i, "Paz_6_1");
        H(n, r), console.log(`[Paz 6.1] e2k exportado: ${n}`), s.exportE2k = 0;
      }
      a === "showTH" && s.showTH < 0.5 && v().hide();
    },
    computedLabels(a) {
      const s = Math.sqrt(a.k_kipin / a.m_kips2in), i = 2 * Math.PI / s;
      return {
        \u03C9: `${s.toFixed(3)} rad/s`,
        T: `${i.toFixed(4)} s  (libro 0.2000)`,
        f: `${(1 / i).toFixed(3)} Hz`,
        "\u0394t/T": (a.dt_s / i).toFixed(4),
        "c (kip\xB7s/in)": (2 * a.xi * Math.sqrt(a.m_kips2in * a.k_kipin)).toFixed(4)
      };
    },
    build(a, s) {
      const i = P(a);
      z(i, s);
      const n = [
        [
          a.m_kips2in
        ]
      ], r = [
        [
          a.k_kipin
        ]
      ], d = [
        [
          2 * a.xi * Math.sqrt(a.m_kips2in * a.k_kipin)
        ]
      ], c = a.Fmax_kip, b = a.t1_s, x = a.t2_s, u = a.t3_s, k = (e) => e <= 0 ? [
        0
      ] : e <= b ? [
        c * e / b
      ] : e <= x ? [
        c
      ] : e <= u ? [
        Math.max(0, c * (u - e) / (u - x))
      ] : [
        0
      ], f = Math.floor(a.tEnd_s / a.dt_s), h = Math.round(a.schemeBeta ?? 0), S = h === 0 ? 0.25 : 1 / 6, o = F({
        M: n,
        K: r,
        C: d,
        loadFunc: k,
        u0: [
          0
        ],
        v0: [
          0
        ],
        dt: a.dt_s,
        nSteps: f,
        gamma: 0.5,
        beta: S
      }), E = Math.max(...o.u.map((e) => Math.abs(e[0]))), M = Math.max(...o.v.map((e) => Math.abs(e[0]))), y = Math.max(...o.a.map((e) => Math.abs(e[0])));
      let m = `[Paz 6.1] Newmark-\u03B2 canonical 1-DOF
`;
      if (m += `  Esquema: \u03B3=\xBD, \u03B2=${h === 0 ? "\xBC" : "\u2159"} (${h === 0 ? "avg accel" : "linear accel \u2014 Paz"})
`, m += `  \u0394t=${a.dt_s} s, nSteps=${f}
`, m += `  u_max = ${E.toFixed(5)} in
`, m += `  v_max = ${M.toFixed(4)} in/s
`, m += `  a_max = ${y.toFixed(2)} in/s\xB2
`, a.showTH > 0.5) {
        const e = v(), _ = Math.round(a.plotType ?? 0);
        if (_ === 0) e.setTitle("Paz 6.1 \u2014 u(t)"), e.setSeries([
          {
            label: `u(t) \u03B2=${h === 0 ? "\xBC" : "\u2159"}`,
            data: o.t.map((t, l) => [
              t,
              o.u[l][0]
            ]),
            color: "#1a4d8c",
            width: 2
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "u (in)",
          grid: true
        });
        else if (_ === 1) e.setTitle("Paz 6.1 \u2014 v(t)"), e.setSeries([
          {
            label: "v(t)",
            data: o.t.map((t, l) => [
              t,
              o.v[l][0]
            ]),
            color: "#1a4d8c"
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "v (in/s)",
          grid: true
        });
        else if (_ === 2) e.setTitle("Paz 6.1 \u2014 a(t)"), e.setSeries([
          {
            label: "a(t)",
            data: o.t.map((t, l) => [
              t,
              o.a[l][0]
            ]),
            color: "#1a4d8c"
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "a (in/s\xB2)",
          grid: true
        });
        else if (_ === 3) e.setTitle("Paz 6.1 \u2014 Carga F(t) trapezoidal"), e.setSeries([
          {
            label: "F(t)",
            data: o.t.map((t) => [
              t,
              k(t)[0]
            ]),
            color: "#7d3c98",
            width: 2
          }
        ]), e.setAxes({
          xLabel: "t (s)",
          yLabel: "F (kip)",
          grid: true
        });
        else if (_ === 4) {
          const t = F({
            M: n,
            K: r,
            C: d,
            loadFunc: k,
            u0: [
              0
            ],
            v0: [
              0
            ],
            dt: a.dt_s,
            nSteps: f,
            gamma: 0.5,
            beta: 0.25
          }), l = F({
            M: n,
            K: r,
            C: d,
            loadFunc: k,
            u0: [
              0
            ],
            v0: [
              0
            ],
            dt: a.dt_s,
            nSteps: f,
            gamma: 0.5,
            beta: 1 / 6
          });
          e.setTitle("Paz 6.1 \u2014 Comparaci\xF3n \u03B2=\xBC vs \u03B2=\u2159"), e.setSeries([
            {
              label: "u(t) \u03B2=\xBC avg accel",
              data: t.t.map((g, T) => [
                g,
                t.u[T][0]
              ]),
              color: "#1a4d8c"
            },
            {
              label: "u(t) \u03B2=\u2159 linear accel",
              data: l.t.map((g, T) => [
                g,
                l.u[T][0]
              ]),
              color: "#c0392b"
            }
          ]), e.setAxes({
            xLabel: "t (s)",
            yLabel: "u (in)",
            grid: true
          });
        }
        e.show();
      }
      console.log(m);
    },
    hasModal: false
  };
  function P(a) {
    const i = a.H_in, r = a.k_kipin * 1e3 * Math.pow(i, 3) / (24 * 3e7), d = a.m_kips2in * 1e3 * 386.088, c = p.psi_to_kNm2(3e7), b = p.in_to_m(i), x = p.in4_to_m4(r), u = p.lb_to_kN(d);
    return {
      nStories: 1,
      storyHeights: [
        b
      ],
      bayWidth: p.in_to_m(120),
      storyWeights: [
        u
      ],
      I_per_column: [
        x
      ],
      nCols: 2,
      E: c,
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
  A as b
};
