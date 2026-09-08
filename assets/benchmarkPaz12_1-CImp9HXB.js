import { m as g, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { i as k, j as z, d as x, P as t, __tla as __tla_1 } from "./pazFrameE2k-C_YDGYOS.js";
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
  let E;
  E = {
    freqs_Hz: [
      2.24,
      16.23,
      34.81
    ]
  };
  A = {
    id: "benchmark-paz-12-1",
    name: "\u{1F3C1} Frame \xB7 Paz 12.1 (grid frame 3D \u2014 L horizontal)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Paz Ej. 12.1 \u2014 Grid frame en plano horizontal: 2 vigas perpendiculares en L.",
      "Elemento 1 (\u03B8=0\xB0) eje X; Elemento 2 (\u03B8=90\xB0) eje Y.",
      "Nodo central LIBRE (3 DOFs: w_z, \u03B8_x, \u03B8_y). Extremos empotrados.",
      "Resultados libro: f\u2081=2.24 Hz, f\u2082=16.23 Hz, f\u2083=34.81 Hz.",
      "\u{1F4E4} Toggle 'Exportar a .e2k' \u2192 modelo ETABS grid frame."
    ],
    params: {
      L_in: {
        default: 100,
        min: 50,
        max: 500,
        step: 5,
        label: "L cada viga (in)",
        folder: "Geometr\xEDa"
      },
      A_in2: {
        default: 10,
        min: 1,
        max: 100,
        step: 0.5,
        label: "A (in\xB2)",
        folder: "Secci\xF3n"
      },
      Iy_in4: {
        default: 200,
        min: 50,
        max: 1e3,
        step: 5,
        label: "Iy strong (in\u2074)",
        folder: "Secci\xF3n"
      },
      J_in4: {
        default: 40,
        min: 5,
        max: 200,
        step: 1,
        label: "J torsi\xF3n (in\u2074)",
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
        default: 0.2,
        min: 0.01,
        max: 1,
        step: 0.01,
        label: "m\u0304 (lb\xB7s\xB2/in/in)",
        folder: "Masa"
      },
      F_lb: {
        default: 5e3,
        min: 0,
        max: 2e4,
        step: 100,
        label: "F vertical nodo central (lb)",
        folder: "Cargas"
      },
      exportE2k: {
        default: 0,
        boolean: true,
        label: "\u{1F4E4} Exportar a ETABS .e2k",
        folder: "Exportar"
      }
    },
    hasModal: true,
    onParamChange(e, n) {
      if (e === "exportE2k" && n.exportE2k > 0.5) {
        const a = c(n), { filename: o, content: r } = z(a, "Paz_12_1");
        x(o, r), console.log(`[Paz 12.1] e2k exportado: ${o}`), n.exportE2k = 0;
      }
    },
    build(e, n) {
      const a = c(e);
      k(a, n), console.log(`[Paz 12.1] Grid frame L=${e.L_in}in, A=${e.A_in2}in\xB2, I=${e.Iy_in4}in\u2074, J=${e.J_in4}in\u2074`);
    },
    runModal(e, n, a) {
      if (n.nodes.val.length) try {
        const o = g(n.nodes.val, n.elements.val, n.nodeInputs.val, n.elementInputs.val, 6);
        console.log(`[Paz 12.1 \u2014 Modal] frecuencias:
` + o.frequencies.slice(0, 6).map((r, l) => {
          const i = E.freqs_Hz[l] ?? null, m = i ? ` (libro ${i.toFixed(2)})` : "";
          return `  Modo ${l + 1}: f = ${r.toFixed(3)} Hz${m}`;
        }).join(`
`)), (a == null ? void 0 : a.render) && a.render(o, {
          title: "Paz 12.1 \u2014 Grid frame horizontal",
          properties: [
            "Libro: f\u2081=2.24, f\u2082=16.23, f\u2083=34.81 Hz"
          ]
        });
      } catch (o) {
        console.error("[Paz 12.1 Modal]", o.message);
      }
    }
  };
  function c(e) {
    const n = t.in_to_m(e.L_in), a = t.psi_to_kNm2(e.E_psi), o = t.psi_to_kNm2(e.G_psi), r = t.in2_to_m2(e.A_in2), l = t.in4_to_m4(e.Iy_in4), i = t.in4_to_m4(e.J_in4), f = e.mbar * 386.088 * 175.13 / 9.80665 / r, u = [
      [
        0,
        0,
        0
      ],
      [
        n,
        0,
        0
      ],
      [
        n,
        n,
        0
      ]
    ], p = [
      [
        0,
        1
      ],
      [
        1,
        2
      ]
    ], s = /* @__PURE__ */ new Map();
    s.set(0, [
      true,
      true,
      true,
      true,
      true,
      true
    ]), s.set(2, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const _ = {
      A: r,
      Iy: l,
      Iz: l,
      J: i,
      E: a,
      G: o,
      rho: f,
      label: `Paz 12.1 grid (A=${e.A_in2}, I=${e.Iy_in4}, J=${e.J_in4} in)`,
      e2kName: "GRID_PAZ12_1",
      e2kShape: "Steel I/Wide Flange",
      e2kD: 0.3,
      e2kB: 0.2,
      e2kTF: 0.018,
      e2kTW: 0.011
    }, d = /* @__PURE__ */ new Map();
    if (e.F_lb > 0) {
      const b = t.lb_to_kN(e.F_lb);
      d.set(1, [
        0,
        0,
        -b,
        0,
        0,
        0
      ]);
    }
    return {
      nodes: u,
      elements: p,
      supports: s,
      loads: d,
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
