import { a as O } from "./analyze-CRH7D0Bs.js";
import { m as k, d as P, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let z;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let g, D;
  g = 0.3;
  D = 76.97 / 9.80665;
  z = {
    id: "W2_viga_axial_composite_cantilever",
    name: "Viga axial Compuesta Slab colaborante (Acero+Losa) cantilever (1 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga compuesta cantilever Acero (IPE) + Losa colaborante hormig\xF3n.",
      "M\xE9todo transformed-section: losa transformada a steel-equivalent.",
      "1 DOF efectivo (Ux) \u2014 peso propio DESACTIVADO.",
      "Defaults: IPE 300 + losa b_eff=80\xD7t=12 cm, n=8.007, P=100 kN, L=3 m.",
      "Esperado: u_x = P\xB7L/(E_s\xB7A_comp_eq) = 0.0864 mm."
    ],
    params: {
      L: {
        default: 3,
        min: 0.5,
        max: 10,
        step: 0.1,
        label: "L (m)",
        folder: "Geometr\xEDa"
      },
      h_st: {
        default: 0.3,
        min: 0.1,
        max: 0.6,
        step: 5e-3,
        label: "h Steel I (m)",
        folder: "Steel I"
      },
      B_st: {
        default: 0.15,
        min: 0.05,
        max: 0.4,
        step: 5e-3,
        label: "B flange (m)",
        folder: "Steel I"
      },
      TF_st: {
        default: 0.0107,
        min: 5e-3,
        max: 0.05,
        step: 5e-4,
        label: "TF flange (m)",
        folder: "Steel I"
      },
      TW_st: {
        default: 71e-4,
        min: 3e-3,
        max: 0.03,
        step: 5e-4,
        label: "TW web (m)",
        folder: "Steel I"
      },
      b_eff: {
        default: 0.8,
        min: 0.2,
        max: 2,
        step: 0.05,
        label: "b_eff losa (m)",
        folder: "Losa"
      },
      t_slab: {
        default: 0.12,
        min: 0.05,
        max: 0.3,
        step: 0.01,
        label: "t_slab (m)",
        folder: "Losa"
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
      const s = e.h_st - 2 * e.TF_st, o = 2 * e.B_st * e.TF_st + s * e.TW_st, l = e.E_s / e.E_c, n = e.b_eff * e.t_slab, m = n / l, a = o + m, _ = e.Fx * e.L / (e.E_s * a) * 1e3;
      return {
        "n = E_s/E_c": l.toFixed(3),
        "A acero": `${(o * 1e4).toFixed(2)} cm\xB2`,
        "A losa real": `${(n * 1e4).toFixed(2)} cm\xB2`,
        "A losa eq (steel)": `${(m * 1e4).toFixed(2)} cm\xB2`,
        A_comp_eq: `${(a * 1e4).toFixed(2)} cm\xB2`,
        EA_comp_eq: `${(e.E_s * a).toFixed(0)} kN`,
        "u_x anal\xEDtico": `${_.toFixed(5)} mm`
      };
    },
    build(e, s) {
      var _a, _b;
      const o = e.h_st - 2 * e.TF_st, l = 2 * e.B_st * e.TF_st + o * e.TW_st, n = e.E_s / e.E_c, m = e.b_eff * e.t_slab / n, a = l + m, _ = (e.h_st - e.TF_st) / 2, T = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * _ ** 2) + e.TW_st * o ** 3 / 12, $ = e.b_eff * e.t_slab ** 3 / 12 / n, u = T + $, L = (2 * e.B_st * e.TF_st ** 3 + o * e.TW_st ** 3) / 3, q = e.h_st * e.TW_st, w = e.E_s / (2 * (1 + g)), i = Math.max(1, Math.round(e.nElem)), S = e.L / i, r = [];
      for (let t = 0; t <= i; t++) r.push([
        S * t,
        0,
        0
      ]);
      const c = [];
      for (let t = 0; t < i; t++) c.push([
        t,
        t + 1
      ]);
      const W = /* @__PURE__ */ new Map([
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
      ]), C = /* @__PURE__ */ new Map([
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
      ]), x = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (let t = 0; t < c.length; t++) x.set(t, e.E_s), b.set(t, w), F.set(t, a), E.set(t, u), h.set(t, u), A.set(t, L), p.set(t, q), v.set(t, D), I.set(t, g);
      s.nodes.val = r, s.elements.val = c, s.nodeInputs.val = {
        supports: W,
        loads: C
      }, s.elementInputs.val = {
        elasticities: x,
        shearModuli: b,
        areas: F,
        momentsOfInertiaZ: E,
        momentsOfInertiaY: h,
        torsionalConstants: A,
        shearAreasY: p,
        densities: v,
        poissonsRatios: I
      };
      const f = P(r, c, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = f, s.analyzeOutputs.val = O(r, c, s.elementInputs.val, f), s.objects3D.val = [];
      const d = e.Fx * e.L / (e.E_s * a), M = ((_b = (_a = f.deformations) == null ? void 0 : _a.get(i)) == null ? void 0 : _b[0]) ?? 0, B = d !== 0 ? (M - d) / d * 100 : 0;
      console.log(`[W2 Viga axial COMPUESTA] L=${e.L}m  IPE+losa  P=${e.Fx}kN
  A_s=${(l * 1e4).toFixed(2)} cm\xB2  A_slab_eq=${(m * 1e4).toFixed(2)} cm\xB2  A_comp=${(a * 1e4).toFixed(2)} cm\xB2 (steel-eq)
  u_x anal\xEDtico = ${(d * 1e3).toFixed(5)} mm
  u_x hekatan   = ${(M * 1e3).toFixed(5)} mm  (\u0394 ${B.toFixed(4)}%)`);
    },
    runModal(e, s, o) {
      var _a, _b;
      const l = s.nodes.val, n = s.elements.val, m = s.nodeInputs.val, a = s.elementInputs.val;
      if (!(!l.length || !n.length || !((_a = m.supports) == null ? void 0 : _a.size) || !((_b = a.densities) == null ? void 0 : _b.size))) try {
        const _ = k(l, n, m, a, 6);
        o.render(_, {
          title: `W2 Viga axial Compuesta L=${e.L}m`,
          properties: [
            `IPE custom h=${(e.h_st * 1e3).toFixed(0)}\xD7B=${(e.B_st * 1e3).toFixed(0)}mm + losa b_eff=${(e.b_eff * 100).toFixed(0)}\xD7t=${(e.t_slab * 100).toFixed(0)}cm`,
            `n=${(e.E_s / e.E_c).toFixed(2)}  (transformed-section steel-equivalent, sin peso propio)`
          ]
        });
      } catch (_) {
        console.warn("Modal W2 axial composite error:", _.message);
      }
    }
  };
});
export {
  __tla,
  z as v
};
