import { m as E, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as n, b as i, c as b } from "./units-0QyZKvTL.js";
import { g as v } from "./loadCaseHelpers-D2m4cQgV.js";
import { b as y, e as F, __tla as __tla_1 } from "./cantileverE2k-DpuPzqfe.js";
let L;
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
  L = {
    id: "benchmark-steel-cantilever",
    name: "\u{1F3C1} Frame \xB7 Columna ACERO Cantilever",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Caso CAN\xD3NICO de validaci\xF3n FRAME ACERO: 1 columna HSS hueca cantilever, L=3m.",
      "Secci\xF3n HSS300\xD7300\xD712mm (Steel Tube hueco) \u2014 material A572Gr50.",
      "Empotramiento total en base (UX UY UZ RX RY RZ) \u2014 coincide con ETABS can\xF3nico.",
      "Peso propio aplicado como nodal equivalente q\xB7L = 3.19 kN distribuido.",
      "Hover sobre nodo top \u2192 ver Uz; hover sobre base \u2192 ver reacci\xF3n Fz=qL.",
      "\u2705 Toggle 'Exportar a .e2k' \u2192 descarga archivo ETABS para validaci\xF3n cruzada."
    ],
    params: {
      L: {
        default: 3,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Altura columna (m)",
        folder: "Geometr\xEDa"
      },
      D_out: {
        default: 0.3,
        min: 0.15,
        max: 0.5,
        step: 0.01,
        label: "D / B (m)",
        folder: "Secci\xF3n"
      },
      t_HSS: {
        default: 0.012,
        min: 5e-3,
        max: 0.03,
        step: 1e-3,
        label: "t pared (m)",
        folder: "Secci\xF3n"
      },
      E_s: {
        default: 2e8,
        min: 15e7,
        max: 22e7,
        step: 5e6,
        label: "E acero (kN/m\xB2)",
        folder: "Material"
      },
      gamma_s: {
        default: 76.97,
        min: 60,
        max: 90,
        step: 0.5,
        label: "\u03B3_s acero (kN/m\xB3)",
        folder: "Material"
      },
      A_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Area mod (axial)",
        folder: "Property Modifiers"
      },
      As2_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "As2 mod (cortante 2)",
        folder: "Property Modifiers"
      },
      As3_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "As3 mod (cortante 3)",
        folder: "Property Modifiers"
      },
      J_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "Torsion mod (J)",
        folder: "Property Modifiers"
      },
      I22_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "I22 mod (flexi\xF3n weak)",
        folder: "Property Modifiers"
      },
      I33_mod: {
        default: 1,
        min: 0,
        max: 1,
        step: 0.01,
        label: "I33 mod (flexi\xF3n strong)",
        folder: "Property Modifiers"
      },
      P_lat: {
        default: 0,
        min: -100,
        max: 100,
        step: 1,
        label: "Fx top (carga lateral X)",
        folder: "Cargas",
        unitType: "force",
        rangeAdjustable: true
      },
      P_lat_y: {
        default: 0,
        min: -100,
        max: 100,
        step: 1,
        label: "Fy top (carga lateral Y)",
        folder: "Cargas",
        unitType: "force",
        rangeAdjustable: true
      },
      M_top_x: {
        default: 0,
        min: -100,
        max: 100,
        step: 0.5,
        label: "Mx top (alrededor X global)",
        folder: "Cargas",
        unitType: "moment",
        rangeAdjustable: true
      },
      M_top_y: {
        default: 0,
        min: -100,
        max: 100,
        step: 0.5,
        label: "My top (alrededor Y global)",
        folder: "Cargas",
        unitType: "moment",
        rangeAdjustable: true
      },
      M_top_z: {
        default: 0,
        min: -100,
        max: 100,
        step: 0.5,
        label: "Mz top (torsor)",
        folder: "Cargas",
        unitType: "moment",
        rangeAdjustable: true
      },
      nSegments: {
        default: 10,
        min: 1,
        max: 50,
        step: 1,
        label: "Segmentos columna",
        folder: "Mesh"
      },
      _E_c: {
        default: 2486e4,
        label: "(no usar)",
        folder: "Avanzado"
      },
      _gamma_c: {
        default: 23.56,
        label: "(no usar)",
        folder: "Avanzado"
      }
    },
    hasModal: true,
    customE2kExport(e, a) {
      F(x(e), 0);
    },
    computedLabels(e) {
      const a = e.D_out, m = e.t_HSS, o = a - 2 * m, t = a * a - o * o, l = (a ** 4 - o ** 4) / 12, r = e.gamma_s * t, s = r * e.L, d = r * e.L * e.L / (2 * e.E_s * t) * 1e3;
      return {
        "A_s (HSS hueca)": `${(t * 1e4).toFixed(2)} cm\xB2`,
        I_s: `${(l * 1e8).toFixed(2)} cm\u2074`,
        EA: `${(e.E_s * t).toFixed(0)} kN`,
        EI: `${(e.E_s * l).toFixed(0)} kN\xB7m\xB2`,
        "q peso propio": `${r.toFixed(3)} kN/m`,
        "W = q\xB7L": `${s.toFixed(3)} kN`,
        "Uz_top anal\xEDtico": `${d.toFixed(5)} mm`
      };
    },
    build(e, a) {
      var _a, _b;
      const m = v(a), { sec: o } = y(x(e), a, 0, m), t = e.L, l = Math.max(1, Math.round(e.nSegments)), r = (_a = a.deformOutputs.val.deformations) == null ? void 0 : _a.get(l), s = (_b = a.deformOutputs.val.reactions) == null ? void 0 : _b.get(0);
      if (r) {
        const d = r[2], A = r[0], _ = -o.q * t * t / (2 * o.E_col * o.A_eq), g = (d - _) / Math.abs(_) * 100;
        let c = `[Cantilever ACERO] ${l} segmentos
  Secci\xF3n: ${o.sectionLabel}
  Modifiers: A=${e.A_mod} As2=${e.As2_mod} As3=${e.As3_mod} J=${e.J_mod} I22=${e.I22_mod} I33=${e.I33_mod}
  Uz_top   = ${n(d, 5)}  (anal\xEDtico ${n(_, 5)}, \u0394 ${g.toFixed(3)}%)
`;
        if (Math.abs(e.P_lat) > 1e-9) {
          const M = 0.8333333333333334 * o.A_eq, u = e.P_lat * t * t * t / (3 * o.E_col * o.I_eq), f = e.P_lat * t / (o.G_col * M), p = u + f, $ = e.P_lat * t, S = e.P_lat;
          c += `  Ux_top = ${n(A, 4)} (lateral, P=${i(e.P_lat)})
    Anal\xEDtico Timoshenko: ${n(p, 4)} (bending ${n(u, 4)} + shear ${n(f, 4)})
  Esperado en base: M = P\xB7L = ${b($)},  V = P = ${i(S)}
`;
        }
        s && (c += `  Reacci\xF3n base: Fz=${i(s[2], 3)}  My=${b(s[4], 3)}  (W=${i(o.q * t, 3)} esperado)`), console.log(c);
      }
    },
    runModal(e, a, m) {
      if (a.nodes.val.length) try {
        const o = E(a.nodes.val, a.elements.val, a.nodeInputs.val, a.elementInputs.val, 3);
        console.log(`[Cantilever Acero \u2014 Modal] 3 primeros modos:
` + o.frequencies.map((t, l) => `  Modo ${l + 1}: f = ${t.toFixed(3)} Hz   T = ${(1 / t).toFixed(4)} s`).join(`
`)), (m == null ? void 0 : m.render) && m.render(o, {
          title: `Cantilever ACERO L=${e.L}m  HSS${(e.D_out * 1e3).toFixed(0)}\xD7${(e.D_out * 1e3).toFixed(0)}\xD7${(e.t_HSS * 1e3).toFixed(0)}mm`,
          properties: [
            `E=${(e.E_s / 1e6).toFixed(1)} GPa  \u03B3=${e.gamma_s.toFixed(2)} kN/m\xB3`
          ]
        });
      } catch (o) {
        console.error("[Cantilever Acero Modal] error:", o.message);
      }
    }
  };
  function x(e) {
    return {
      L: e.L,
      D_out: e.D_out,
      t_HSS: e.t_HSS,
      E_s: e.E_s,
      E_c: e._E_c ?? 2486e4,
      gamma_s: e.gamma_s,
      gamma_c: e._gamma_c ?? 23.56,
      A_mod: e.A_mod,
      As2_mod: e.As2_mod,
      As3_mod: e.As3_mod,
      J_mod: e.J_mod,
      I22_mod: e.I22_mod,
      I33_mod: e.I33_mod,
      P_lat: e.P_lat,
      P_lat_y: e.P_lat_y ?? 0,
      M_top_x: e.M_top_x ?? 0,
      M_top_y: e.M_top_y ?? 0,
      M_top_z: e.M_top_z ?? 0,
      nSegments: e.nSegments
    };
  }
});
export {
  __tla,
  L as b
};
