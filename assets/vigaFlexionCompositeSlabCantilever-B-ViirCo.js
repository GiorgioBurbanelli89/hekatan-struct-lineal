import { a as j } from "./analyze-DgLgRmKg.js";
import { m as J, d as U, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Y } from "./loadCaseHelpers-D2m4cQgV.js";
let Q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let v;
  v = 0.3;
  Q = {
    id: "W2_viga_flexion_composite_slab_cantilever",
    name: "Viga flexi\xF3n Compuesta Slab colaborante cantilever (2 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga compuesta acero-hormig\xF3n con losa colaborante encima del perfil I.",
      "Cantilever horizontal bajo peso propio (2 DOF: Uz + Ry).",
      "M\xE9todo transformed-section a steel-equivalent (AISC 360-16 \xA7I).",
      "El peso propio es la suma REAL (no transformada): \u03B3_s\xB7A_s + \u03B3_c\xB7A_c_real.",
      "Defaults: IPE 300 + losa b_eff=80\xD7t=12 cm, L=3 m."
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
      gamma_s: {
        default: 76.97,
        min: 60,
        max: 90,
        step: 0.5,
        label: "\u03B3 acero (kN/m\xB3)",
        folder: "Materiales"
      },
      gamma_c: {
        default: 23.56,
        min: 18,
        max: 28,
        step: 0.5,
        label: "\u03B3 hormig\xF3n (kN/m\xB3)",
        folder: "Materiales"
      },
      nElem: {
        default: 10,
        min: 2,
        max: 40,
        step: 1,
        label: "N\xB0 elementos",
        folder: "Malla"
      }
    },
    computedLabels(e) {
      const s = e.h_st - 2 * e.TF_st, a = 2 * e.B_st * e.TF_st + s * e.TW_st, o = e.b_eff * e.t_slab, n = e.E_s / e.E_c, m = a + o / n, l = e.h_st / 2, c = e.h_st + e.t_slab / 2, r = (a * l + o / n * c) / m, b = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * ((e.h_st - e.TF_st) / 2) ** 2) + e.TW_st * s ** 3 / 12, g = e.b_eff * e.t_slab ** 3 / 12, x = b + a * (r - l) ** 2 + (g + o * (r - c) ** 2) / n, _ = e.gamma_s * a + e.gamma_c * o, w = e.E_s / (2 * (1 + v)), F = a, f = _ * e.L ** 4 / (8 * e.E_s * x), h = _ * e.L ** 2 / (2 * w * F), E = (f + h) * 1e3, d = _ * e.L ** 2 / 2, i = _ * e.L;
      return {
        "n = E_s/E_c": n.toFixed(3),
        A_s: `${(a * 1e4).toFixed(2)} cm\xB2`,
        "A_c real": `${(o * 1e4).toFixed(2)} cm\xB2`,
        "A_eq (steel-eq)": `${(m * 1e4).toFixed(2)} cm\xB2`,
        y_centroide: `${(r * 1e3).toFixed(1)} mm`,
        I_eq: `${(x * 1e8).toFixed(2)} cm\u2074`,
        "q peso propio": `${_.toFixed(4)} kN/m`,
        M_base: `${d.toFixed(3)} kN\xB7m`,
        V_base: `${i.toFixed(3)} kN`,
        "w_tip EB": `${(f * 1e3).toFixed(5)} mm`,
        "w_tip + shear": `${E.toFixed(5)} mm`
      };
    },
    build(e, s) {
      var _a, _b;
      const a = e.h_st - 2 * e.TF_st, o = 2 * e.B_st * e.TF_st + a * e.TW_st, n = e.b_eff * e.t_slab, m = e.E_s / e.E_c, l = o + n / m, c = e.h_st / 2, r = e.h_st + e.t_slab / 2, b = (o * c + n / m * r) / l, g = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * ((e.h_st - e.TF_st) / 2) ** 2) + e.TW_st * a ** 3 / 12, x = e.b_eff * e.t_slab ** 3 / 12, _ = g + o * (b - c) ** 2 + (x + n * (b - r) ** 2) / m, w = (2 * e.B_st * e.TF_st ** 3 + a * e.TW_st ** 3) / 3, F = o, f = e.E_s / (2 * (1 + v)), h = e.gamma_s * o + e.gamma_c * n, E = Y(s), d = h * E, i = Math.max(2, Math.round(e.nElem)), T = e.L / i, I = [];
      for (let t = 0; t <= i; t++) I.push([
        T * t,
        0,
        0
      ]);
      const u = [];
      for (let t = 0; t < i; t++) u.push([
        t,
        t + 1
      ]);
      const O = /* @__PURE__ */ new Map([
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
      ]), A = /* @__PURE__ */ new Map();
      for (let t = 0; t <= i; t++) {
        const G = t === 0 || t === i, P = -d * T * (G ? 0.5 : 1);
        A.set(t, [
          0,
          0,
          P,
          0,
          0,
          0
        ]);
      }
      const V = h / (l * 9.80665), L = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
      for (let t = 0; t < u.length; t++) L.set(t, e.E_s), q.set(t, f), S.set(t, l), B.set(t, _), y.set(t, _), W.set(t, w), p.set(t, F), k.set(t, V), C.set(t, v);
      s.nodes.val = I, s.elements.val = u, s.nodeInputs.val = {
        supports: O,
        loads: A
      }, s.elementInputs.val = {
        elasticities: L,
        shearModuli: q,
        areas: S,
        momentsOfInertiaZ: B,
        momentsOfInertiaY: y,
        torsionalConstants: W,
        shearAreasY: p,
        densities: k,
        poissonsRatios: C
      };
      const $ = U(I, u, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = $, s.analyzeOutputs.val = j(I, u, s.elementInputs.val, $), s.objects3D.val = [];
      const N = d * e.L ** 4 / (8 * e.E_s * _), D = d * e.L ** 2 / (2 * f * F), M = N + D, z = ((_b = (_a = $.deformations) == null ? void 0 : _a.get(i)) == null ? void 0 : _b[2]) ?? 0, R = Math.abs(M) > 1e-15 ? (Math.abs(z) - M) / M * 100 : 0;
      console.log(`[W2 Viga flexi\xF3n COMPUESTA Slab] L=${e.L}m  IPE+losa ${(e.b_eff * 100).toFixed(0)}\xD7${(e.t_slab * 100).toFixed(0)}cm  SWmult=${E}
  A_eq=${(l * 1e4).toFixed(2)} cm\xB2  I_eq=${(_ * 1e8).toFixed(2)} cm\u2074  q=${d.toFixed(4)} kN/m
  w_tip EB     = ${(N * 1e3).toFixed(5)} mm
  w_tip Tim    = ${(M * 1e3).toFixed(5)} mm
  w_tip hekatan= ${(z * 1e3).toFixed(5)} mm  (\u0394 ${R.toFixed(4)}%)`);
    },
    runModal(e, s, a) {
      var _a, _b;
      const o = s.nodes.val, n = s.elements.val, m = s.nodeInputs.val, l = s.elementInputs.val;
      if (!(!o.length || !n.length || !((_a = m.supports) == null ? void 0 : _a.size) || !((_b = l.densities) == null ? void 0 : _b.size))) try {
        const c = J(o, n, m, l, 6);
        a.render(c, {
          title: `W2 Viga flexi\xF3n Compuesta Slab L=${e.L}m`,
          properties: [
            `IPE custom ${(e.h_st * 1e3).toFixed(0)}\xD7${(e.B_st * 1e3).toFixed(0)}mm + losa ${(e.b_eff * 100).toFixed(0)}\xD7${(e.t_slab * 100).toFixed(0)}cm`,
            `n=${(e.E_s / e.E_c).toFixed(2)}  transformed-section`
          ]
        });
      } catch (c) {
        console.warn("Modal W2 flex composite slab error:", c.message);
      }
    }
  };
});
export {
  __tla,
  Q as v
};
