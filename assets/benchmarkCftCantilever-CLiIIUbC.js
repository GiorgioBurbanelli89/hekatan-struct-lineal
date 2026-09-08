import { m as y, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { a as i, b as f, c as $ } from "./units-C7eDg0Ff.js";
import { b as T, e as C, __tla as __tla_1 } from "./cantileverE2k-DpuPzqfe.js";
import { g as v } from "./loadCaseHelpers-D2m4cQgV.js";
let q;
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
  let p;
  p = {
    Uz_top_mm: -28e-4
  };
  q = {
    id: "benchmark-cft-cantilever",
    name: "\u{1F3C1} Frame \xB7 Columna CFT Cantilever",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    guide: [
      "Caso CAN\xD3NICO de validaci\xF3n FRAME: 1 columna CFT cantilever, L=3m, peso propio.",
      "Secci\xF3n CR300\xD7300\xD7121mm = HSS 300\xD7300\xD712 + concreto fill 4000Psi (Filled Steel Tube).",
      "Empotramiento total en base (UX UY UZ RX RY RZ) \u2014 coincide con ETABS can\xF3nico.",
      "Carga: peso propio aplicado como punto equivalente P=qL/2 en tope (u_top match exacto).",
      "Hover sobre nodo top \u2192 ver Uz; hover sobre base \u2192 ver reacci\xF3n Fz=qL=8.58 kN.",
      "Compara consola: Hekatan \u2248 ETABS API (-0.0028 mm) \u2248 anal\xEDtico (qL\xB2/2EA = -0.00276 mm).",
      "\u2705 Toggle 'Exportar a .e2k' \u2192 descarga archivo ETABS para validaci\xF3n cruzada."
    ],
    params: {
      materialType: {
        default: 2,
        label: "Tipo de columna",
        options: {
          "Acero (HSS hueco)": 0,
          "Hormig\xF3n (rectangular)": 1,
          "Mixta CFT (Filled Steel Tube)": 2
        },
        folder: "Secci\xF3n",
        regenOnChange: true
      },
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
        label: "t pared (m, s\xF3lo Acero/CFT)",
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
      E_c: {
        default: 2486e4,
        min: 1e7,
        max: 5e7,
        step: 1e6,
        label: "E concreto (kN/m\xB2)",
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
      gamma_c: {
        default: 23.56,
        min: 18,
        max: 28,
        step: 0.5,
        label: "\u03B3_c concreto (kN/m\xB3)",
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
      }
    },
    hasModal: true,
    customE2kExport(e, a) {
      const r = Math.round(e.materialType ?? 2);
      C(e, r);
    },
    computedLabels(e) {
      const a = e.D_out, r = e.t_HSS, l = a - 2 * r, o = a * a - l * l, t = l * l, c = (a ** 4 - l ** 4) / 12, d = l ** 4 / 12, m = e.E_s / e.E_c, n = o + t / m, _ = c + d / m, s = e.gamma_s * o + e.gamma_c * t, b = s * e.L, x = s * e.L * e.L / (2 * e.E_s * n) * 1e3;
      return {
        "A_s (HSS)": `${(o * 1e4).toFixed(2)} cm\xB2`,
        "A_c (fill)": `${(t * 1e4).toFixed(2)} cm\xB2`,
        "n=E_s/E_c": m.toFixed(3),
        A_eq: `${(n * 1e4).toFixed(2)} cm\xB2 (E\xB7A=${(e.E_s * n).toFixed(0)} kN)`,
        I_eq: `${(_ * 1e8).toFixed(2)} cm\u2074 (E\xB7I=${(e.E_s * _).toFixed(0)} kN\xB7m\xB2)`,
        "q peso propio": `${s.toFixed(3)} kN/m`,
        "W = q\xB7L": `${b.toFixed(3)} kN`,
        "Uz_top anal\xEDtico": `${x.toFixed(5)} mm`,
        "ETABS API ref": `${p.Uz_top_mm} mm`
      };
    },
    build(e, a) {
      var _a, _b;
      const r = Math.round(e.materialType ?? 2), l = v(a), { sec: o } = T(e, a, r, l), t = e.L, c = Math.max(1, Math.round(e.nSegments)), d = (_a = a.deformOutputs.val.deformations) == null ? void 0 : _a.get(c), m = (_b = a.deformOutputs.val.reactions) == null ? void 0 : _b.get(0);
      if (d) {
        const n = d[2], _ = d[0], s = -o.q * t * t / (2 * o.E_col * o.A_eq), b = (n * 1e3 - p.Uz_top_mm) / Math.abs(p.Uz_top_mm) * 100, x = (n - s) / Math.abs(s) * 100;
        let u = `[Cantilever ${o.materialType}] ${c} segmentos
  Secci\xF3n: ${o.sectionLabel}
  Modifiers: A=${e.A_mod} As2=${e.As2_mod} As3=${e.As3_mod} J=${e.J_mod} I22=${e.I22_mod} I33=${e.I33_mod}
  Uz_top   = ${i(n, 5)}  (anal\xEDtico ${i(s, 5)}, \u0394 ${x.toFixed(3)}%)
`;
        if (r === 2 && (u += `  ETABS API: ${p.Uz_top_mm.toFixed(5)} mm  (\u0394 ${b.toFixed(2)}%)
`), Math.abs(e.P_lat) > 1e-9) {
          const M = 0.8333333333333334 * o.A_eq, A = e.P_lat * t * t * t / (3 * o.E_col * o.I_eq), g = e.P_lat * t / (o.G_col * M), F = A + g, E = e.P_lat * t, S = e.P_lat;
          u += `  Ux_top = ${i(_, 4)} (lateral, P=${f(e.P_lat)})
    Anal\xEDtico Timoshenko: ${i(F, 4)} (bending ${i(A, 4)} + shear ${i(g, 4)})
  Esperado en base: M = P\xB7L = ${$(E)},  V = P = ${f(S)}
`;
        }
        m && (u += `  Reacci\xF3n base: Fz=${f(m[2], 3)}  My=${$(m[4], 3)}  (W=${f(o.q * t, 3)} esperado)`), console.log(u);
      }
    },
    runModal(e, a, r) {
      if (a.nodes.val.length) try {
        const l = y(a.nodes.val, a.elements.val, a.nodeInputs.val, a.elementInputs.val, 3);
        console.log(`[Cantilever \u2014 Modal] 3 primeros modos:
` + l.frequencies.map((o, t) => `  Modo ${t + 1}: f = ${o.toFixed(3)} Hz   T = ${(1 / o).toFixed(4)} s`).join(`
`)), (r == null ? void 0 : r.render) && r.render(l, {
          title: `Cantilever ${e.materialType === 0 ? "Acero" : e.materialType === 1 ? "Hormig\xF3n" : "CFT"} L=${e.L}m`,
          properties: [
            `D=${(e.D_out * 1e3).toFixed(0)}mm  t=${(e.t_HSS * 1e3).toFixed(0)}mm  E=${(e.E_s / 1e6).toFixed(1)} GPa`
          ]
        });
      } catch (l) {
        console.error("[Cantilever Modal] error:", l.message);
      }
    }
  };
});
export {
  __tla,
  q as b
};
