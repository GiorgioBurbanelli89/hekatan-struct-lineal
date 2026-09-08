import { a as p } from "./analyze-CRH7D0Bs.js";
import { m as k, d as W, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let y;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let g, R;
  g = 0.3;
  R = 76.97 / 9.80665;
  y = {
    id: "W2_viga_axial_composite_encased_cantilever",
    name: "Viga axial Compuesta SRC Encased cantilever (1 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga compuesta SRC (Steel Reinforced Concrete) \u2014 bloque hormig\xF3n con I steel embebido.",
      "Diferente a composite-slab (que tiene losa colaborante encima).",
      "Validado contra ETABS Concrete Encasement Rectangle: \u0394=0.000%.",
      "Defaults: outer 0.9\xD70.6 m, IPE 300 embed, n=8.006, P=100 kN, L=3 m.",
      "Esperado: u_x = P\xB7L/(E_s\xB7A_eq) = 0.02084 mm."
    ],
    params: {
      L: {
        default: 3,
        min: 0.5,
        max: 10,
        step: 0.1,
        label: "Longitud L (m)",
        folder: "Geometr\xEDa"
      },
      D_out: {
        default: 0.9,
        min: 0.3,
        max: 2,
        step: 0.05,
        label: "D outer encasement (m)",
        folder: "Encasement"
      },
      B_out: {
        default: 0.6,
        min: 0.2,
        max: 2,
        step: 0.05,
        label: "B outer encasement (m)",
        folder: "Encasement"
      },
      D_st: {
        default: 0.3,
        min: 0.1,
        max: 0.6,
        step: 5e-3,
        label: "D Steel I (m)",
        folder: "Steel I embedded"
      },
      B_st: {
        default: 0.15,
        min: 0.05,
        max: 0.4,
        step: 5e-3,
        label: "B Steel flange (m)",
        folder: "Steel I embedded"
      },
      TF_st: {
        default: 0.0107,
        min: 5e-3,
        max: 0.05,
        step: 5e-4,
        label: "TF flange thick (m)",
        folder: "Steel I embedded"
      },
      TW_st: {
        default: 71e-4,
        min: 3e-3,
        max: 0.03,
        step: 5e-4,
        label: "TW web thick (m)",
        folder: "Steel I embedded"
      },
      E_s: {
        default: 2e8,
        min: 15e7,
        max: 22e7,
        step: 5e6,
        label: "E acero (kN/m\xB2)",
        folder: "Materiales"
      },
      E_c: {
        default: 2498e4,
        min: 15e6,
        max: 4e7,
        step: 1e6,
        label: "E hormig\xF3n (kN/m\xB2)",
        folder: "Materiales"
      },
      nElem: {
        default: 1,
        min: 1,
        max: 20,
        step: 1,
        label: "N\xB0 elementos",
        folder: "Malla"
      },
      Fx: {
        default: 100,
        min: -500,
        max: 500,
        step: 5,
        label: "Fx axial (kN)",
        folder: "Cargas",
        unitType: "force"
      }
    },
    computedLabels(e) {
      const o = e.D_st - 2 * e.TF_st, m = 2 * e.B_st * e.TF_st + o * e.TW_st, a = e.D_out * e.B_out, c = a - m, l = e.E_s / e.E_c, s = m + c / l, n = e.Fx * e.L / (e.E_s * s) * 1e3;
      return {
        "A outer (D\xB7B)": `${(a * 1e4).toFixed(2)} cm\xB2`,
        "A_steel (IPE)": `${(m * 1e4).toFixed(2)} cm\xB2`,
        "A_concrete neto": `${(c * 1e4).toFixed(2)} cm\xB2`,
        "n = E_s/E_c": l.toFixed(3),
        "A_eq (steel-eq)": `${(s * 1e4).toFixed(2)} cm\xB2`,
        EA_eq: `${(e.E_s * s).toFixed(0)} kN`,
        "u_x anal\xEDtico": `${n.toFixed(5)} mm`
      };
    },
    build(e, o) {
      var _a, _b;
      const m = e.D_st - 2 * e.TF_st, a = 2 * e.B_st * e.TF_st + m * e.TW_st, l = e.D_out * e.B_out - a, s = e.E_s / e.E_c, n = a + l / s, M = e.B_out * e.D_out ** 3 / 12 - e.B_st * e.D_st ** 3 / 12, x = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * ((e.D_st - e.TF_st) / 2) ** 2) + e.TW_st * m ** 3 / 12 + M / s, B = e.B_out * e.D_out ** 3 / 12 * 0.3, T = e.D_st * e.TW_st + l / s, S = e.E_s / (2 * (1 + g)), i = Math.max(1, Math.round(e.nElem)), w = e.L / i, _ = [];
      for (let t = 0; t <= i; t++) _.push([
        w * t,
        0,
        0
      ]);
      const d = [];
      for (let t = 0; t < i; t++) d.push([
        t,
        t + 1
      ]);
      const C = /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), L = /* @__PURE__ */ new Map([
        [
          i,
          [
            e.Fx,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ]), f = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
      for (let t = 0; t < d.length; t++) f.set(t, e.E_s), E.set(t, S), F.set(t, n), b.set(t, x), A.set(t, x), I.set(t, B), $.set(t, T), v.set(t, R), h.set(t, g);
      o.nodes.val = _, o.elements.val = d, o.nodeInputs.val = {
        supports: C,
        loads: L
      }, o.elementInputs.val = {
        elasticities: f,
        shearModuli: E,
        areas: F,
        momentsOfInertiaZ: b,
        momentsOfInertiaY: A,
        torsionalConstants: I,
        shearAreasY: $,
        densities: v,
        poissonsRatios: h
      };
      const u = W(_, d, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = u, o.analyzeOutputs.val = p(_, d, o.elementInputs.val, u), o.objects3D.val = [];
      const r = e.Fx * e.L / (e.E_s * n), D = ((_b = (_a = u.deformations) == null ? void 0 : _a.get(i)) == null ? void 0 : _b[0]) ?? 0, q = r !== 0 ? (D - r) / r * 100 : 0;
      console.log(`[W2 Viga axial COMPUESTA SRC Encased] L=${e.L}m  outer=${e.D_out * 100}\xD7${e.B_out * 100}cm  P=${e.Fx}kN
  A_s=${(a * 1e4).toFixed(2)} cm\xB2  A_c=${(l * 1e4).toFixed(0)} cm\xB2  n=${s.toFixed(2)}
  A_eq=${(n * 1e4).toFixed(2)} cm\xB2 (steel-eq)  EA=${(e.E_s * n).toFixed(0)} kN
  u_x anal\xEDtico  = ${(r * 1e3).toFixed(5)} mm
  u_x hekatan    = ${(D * 1e3).toFixed(5)} mm  (\u0394 ${q.toFixed(4)}%)
  ETABS validado = 0.02084 mm  (\u0394 +0.000%)`);
    },
    runModal(e, o, m) {
      var _a, _b;
      const a = o.nodes.val, c = o.elements.val, l = o.nodeInputs.val, s = o.elementInputs.val;
      if (!(!a.length || !c.length || !((_a = l.supports) == null ? void 0 : _a.size) || !((_b = s.densities) == null ? void 0 : _b.size))) try {
        const n = k(a, c, l, s, 6);
        m.render(n, {
          title: `W2 Viga axial Compuesta SRC Encased L=${e.L}m`,
          properties: [
            `Outer ${(e.D_out * 100).toFixed(0)}\xD7${(e.B_out * 100).toFixed(0)} cm + IPE embed ${(e.D_st * 1e3).toFixed(0)}\xD7${(e.B_st * 1e3).toFixed(0)} mm`,
            `n=${(e.E_s / e.E_c).toFixed(2)}  transformed-section steel-equivalent (sin peso propio)`
          ]
        });
      } catch (n) {
        console.warn("Modal W2 axial composite encased error:", n.message);
      }
    }
  };
});
export {
  __tla,
  y as v
};
