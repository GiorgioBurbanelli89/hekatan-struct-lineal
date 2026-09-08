import { b as p, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { i as b, j as E, d as h, P as l, __tla as __tla_1 } from "./pazFrameE2k-C_YDGYOS.js";
let A;
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
  let I;
  I = {
    freqs_Hz: [
      4.02,
      4.97,
      10.33
    ],
    L_in: 100,
    AE_lb: 6e4,
    EI_lbin2: 1e6
  };
  A = {
    id: "benchmark-paz-11-1",
    name: "\u{1F3C1} Frame \xB7 Paz 11.1 (plane frame inclinado 45\xB0)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 11.1 \u2014 Plane frame 2 elementos: barra inclinada 45\xB0 + horizontal.",
      "Datos derivados: L=100 in, AE=60,000 lb, EI=1e6 lb\xB7in\xB2.",
      "Resultados libro: f\u2081=4.02 Hz, f\u2082=4.97 Hz, f\u2083=10.33 Hz (3 modos in-plane).",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS plane frame 2D."
    ],
    params: {
      L_in: {
        default: 100,
        min: 50,
        max: 300,
        step: 5,
        label: "L cada barra (in)",
        folder: "Geometr\xEDa"
      },
      A_in2: {
        default: 2,
        min: 0.5,
        max: 50,
        step: 0.1,
        label: "A barra (in\xB2)",
        folder: "Secci\xF3n"
      },
      I_in4: {
        default: 33.33,
        min: 10,
        max: 200,
        step: 0.5,
        label: "I barra (in\u2074)",
        folder: "Secci\xF3n"
      },
      E_psi: {
        default: 3e7,
        min: 25e6,
        max: 35e6,
        step: 5e5,
        label: "E (psi)",
        folder: "Material"
      },
      G_psi: {
        default: 12e6,
        min: 1e7,
        max: 14e6,
        step: 5e5,
        label: "G (psi)",
        folder: "Material"
      },
      mbar: {
        default: 4.2,
        min: 0.01,
        max: 10,
        step: 1e-3,
        label: "m\u0304 (lb\xB7s\xB2/in/in)",
        folder: "Masa"
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
        const n = c(a), { filename: t, content: o } = E(n, "Paz_11_1");
        h(t, o), console.log(`[Paz 11.1] e2k exportado: ${t}`), a.exportE2k = 0;
      }
    },
    computedLabels(e) {
      const a = e.A_in2 * e.E_psi, n = e.E_psi * e.I_in4;
      return {
        AE: `${a.toFixed(0)} lb  (libro 60,000)`,
        EI: `${n.toExponential(3)} lb\xB7in\xB2  (libro 1.0e6)`,
        "AE/L": (a / e.L_in).toFixed(2),
        "EI/L\xB3 \xD712": (12 * n / Math.pow(e.L_in, 3)).toFixed(2)
      };
    },
    build(e, a) {
      const n = c(e);
      b(n, a), console.log(`[Paz 11.1] Modelo construido. L=${e.L_in}in, A=${e.A_in2}in\xB2, I=${e.I_in4}in\u2074`);
    },
    runModal(e, a, n) {
      if (a.nodes.val.length) try {
        const t = p(a.nodes.val, a.elements.val, a.nodeInputs.val, a.elementInputs.val, 6);
        console.log(`[Paz 11.1 \u2014 Modal] frecuencias:
` + t.frequencies.slice(0, 6).map((o, r) => {
          const s = I.freqs_Hz[r] ?? null, m = s ? ` (libro ${s.toFixed(2)})` : "";
          return `  Modo ${r + 1}: f = ${o.toFixed(3)} Hz${m}`;
        }).join(`
`)), (n == null ? void 0 : n.render) && n.render(t, {
          title: "Paz 11.1 \u2014 Plane frame inclinado 45\xB0",
          properties: [
            "Libro: f\u2081=4.02, f\u2082=4.97, f\u2083=10.33 Hz"
          ]
        });
      } catch (t) {
        console.error("[Paz 11.1 Modal]", t.message);
      }
    }
  };
  function c(e) {
    const a = l.in_to_m(e.L_in), n = l.psi_to_kNm2(e.E_psi), t = l.psi_to_kNm2(e.G_psi), o = l.in2_to_m2(e.A_in2), r = l.in4_to_m4(e.I_in4), d = e.mbar * 386.088 * 175.13 / 9.80665 / o / 1e3, u = [
      [
        0,
        0,
        0
      ],
      [
        a * Math.cos(Math.PI / 4),
        0,
        a * Math.sin(Math.PI / 4)
      ],
      [
        a * Math.cos(Math.PI / 4) + a,
        0,
        a * Math.sin(Math.PI / 4)
      ]
    ], f = [
      [
        0,
        1
      ],
      [
        1,
        2
      ]
    ], i = /* @__PURE__ */ new Map();
    i.set(0, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), i.set(2, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), i.set(1, [
      false,
      true,
      false,
      true,
      false,
      true
    ]);
    const _ = {
      A: o,
      Iy: r,
      Iz: r,
      J: r * 0.05,
      E: n,
      G: t,
      rho: d,
      label: `Paz 11.1 frame elem (A=${e.A_in2}in\xB2, I=${e.I_in4}in\u2074)`,
      e2kName: "FRAME_PAZ11_1",
      e2kShape: "Steel I/Wide Flange",
      e2kD: 0.3,
      e2kB: 0.2,
      e2kTF: 0.018,
      e2kTW: 0.011
    };
    return {
      nodes: u,
      elements: f,
      supports: i,
      sectionByElement: [
        _,
        _
      ],
      materialName: "A992Fy50",
      materialType: "Steel"
    };
  }
});
export {
  __tla,
  A as b
};
