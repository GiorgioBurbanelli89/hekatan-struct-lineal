import { a as j } from "./analyze-DgLgRmKg.js";
import { m as J, d as Y, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as U } from "./loadCaseHelpers-D2m4cQgV.js";
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
    id: "W2_viga_flexion_composite_encased_cantilever",
    name: "Viga flexi\xF3n Compuesta SRC Encased cantilever (2 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga compuesta SRC (Steel Reinforced Concrete) bajo peso propio.",
      "Bloque hormig\xF3n 90\xD760 cm con perfil I steel embebido al centro.",
      "Diferente del composite-slab (que tiene losa colaborante encima).",
      "M\xE9todo transformed-section a steel-equivalent (AISC 360 \xA7I).",
      "Peso propio REAL = \u03B3_s\xB7A_s + \u03B3_c\xB7A_c (NO transformado)."
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
      D_out: {
        default: 0.9,
        min: 0.3,
        max: 2,
        step: 0.05,
        label: "D outer (m)",
        folder: "Encasement"
      },
      B_out: {
        default: 0.6,
        min: 0.2,
        max: 2,
        step: 0.05,
        label: "B outer (m)",
        folder: "Encasement"
      },
      h_st: {
        default: 0.3,
        min: 0.1,
        max: 0.6,
        step: 5e-3,
        label: "h Steel I (m)",
        folder: "Steel I embedded"
      },
      B_st: {
        default: 0.15,
        min: 0.05,
        max: 0.4,
        step: 5e-3,
        label: "B flange (m)",
        folder: "Steel I embedded"
      },
      TF_st: {
        default: 0.0107,
        min: 5e-3,
        max: 0.05,
        step: 5e-4,
        label: "TF flange (m)",
        folder: "Steel I embedded"
      },
      TW_st: {
        default: 71e-4,
        min: 3e-3,
        max: 0.03,
        step: 5e-4,
        label: "TW web (m)",
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
      const s = e.h_st - 2 * e.TF_st, n = 2 * e.B_st * e.TF_st + s * e.TW_st, l = e.D_out * e.B_out - n, a = e.E_s / e.E_c, c = n + l / a, o = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * ((e.h_st - e.TF_st) / 2) ** 2) + e.TW_st * s ** 3 / 12, g = e.B_out * e.D_out ** 3 / 12, w = e.B_st * e.h_st ** 3 / 12, x = g - w, F = o + x / a, r = n + l / a, h = e.E_s / (2 * (1 + v)), i = e.gamma_s * n + e.gamma_c * l, u = i * e.L ** 4 / (8 * e.E_s * F), b = i * e.L ** 2 / (2 * h * r), E = (u + b) * 1e3, d = i * e.L ** 2 / 2, m = i * e.L;
      return {
        "n = E_s/E_c": a.toFixed(3),
        A_s: `${(n * 1e4).toFixed(2)} cm\xB2`,
        A_c: `${(l * 1e4).toFixed(2)} cm\xB2`,
        A_eq: `${(c * 1e4).toFixed(2)} cm\xB2`,
        "I_s strong": `${(o * 1e8).toFixed(2)} cm\u2074`,
        "I_c neto": `${(x * 1e8).toFixed(2)} cm\u2074`,
        "I_eq (steel-eq)": `${(F * 1e8).toFixed(2)} cm\u2074`,
        "q peso propio": `${i.toFixed(3)} kN/m`,
        M_base: `${d.toFixed(2)} kN\xB7m`,
        V_base: `${m.toFixed(3)} kN`,
        "w_tip EB": `${(u * 1e3).toFixed(5)} mm`,
        "w_tip + shear": `${E.toFixed(5)} mm`
      };
    },
    build(e, s) {
      var _a, _b;
      const n = e.h_st - 2 * e.TF_st, _ = 2 * e.B_st * e.TF_st + n * e.TW_st, a = e.D_out * e.B_out - _, c = e.E_s / e.E_c, o = _ + a / c, g = 2 * (e.B_st * e.TF_st ** 3 / 12 + e.B_st * e.TF_st * ((e.h_st - e.TF_st) / 2) ** 2) + e.TW_st * n ** 3 / 12, w = e.B_out * e.D_out ** 3 / 12, x = e.B_st * e.h_st ** 3 / 12, F = w - x, r = g + F / c, h = o, i = e.B_out * e.D_out ** 3 / 12 * 0.3, u = e.E_s / (2 * (1 + v)), b = e.gamma_s * _ + e.gamma_c * a, E = U(s), d = b * E, m = Math.max(2, Math.round(e.nElem)), B = e.L / m, I = [];
      for (let t = 0; t <= m; t++) I.push([
        B * t,
        0,
        0
      ]);
      const f = [];
      for (let t = 0; t < m; t++) f.push([
        t,
        t + 1
      ]);
      const R = /* @__PURE__ */ new Map([
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
      for (let t = 0; t <= m; t++) {
        const G = t === 0 || t === m, P = -d * B * (G ? 0.5 : 1);
        A.set(t, [
          0,
          0,
          P,
          0,
          0,
          0
        ]);
      }
      const z = b / (o * 9.80665), q = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
      for (let t = 0; t < f.length; t++) q.set(t, e.E_s), T.set(t, u), L.set(t, o), S.set(t, r), p.set(t, r), C.set(t, i), D.set(t, h), W.set(t, z), k.set(t, v);
      s.nodes.val = I, s.elements.val = f, s.nodeInputs.val = {
        supports: R,
        loads: A
      }, s.elementInputs.val = {
        elasticities: q,
        shearModuli: T,
        areas: L,
        momentsOfInertiaZ: S,
        momentsOfInertiaY: p,
        torsionalConstants: C,
        shearAreasY: D,
        densities: W,
        poissonsRatios: k
      };
      const $ = Y(I, f, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = $, s.analyzeOutputs.val = j(I, f, s.elementInputs.val, $), s.objects3D.val = [];
      const N = d * e.L ** 4 / (8 * e.E_s * r), V = d * e.L ** 2 / (2 * u * h), M = N + V, O = ((_b = (_a = $.deformations) == null ? void 0 : _a.get(m)) == null ? void 0 : _b[2]) ?? 0, y = Math.abs(M) > 1e-15 ? (Math.abs(O) - M) / M * 100 : 0;
      console.log(`[W2 Viga flexi\xF3n COMPUESTA SRC Encased] L=${e.L}m  outer=${e.D_out * 100}\xD7${e.B_out * 100}cm  SWmult=${E}
  A_eq=${(o * 1e4).toFixed(2)} cm\xB2  I_eq=${(r * 1e8).toFixed(2)} cm\u2074  q=${d.toFixed(4)} kN/m
  w_tip EB     = ${(N * 1e3).toFixed(5)} mm
  w_tip Tim    = ${(M * 1e3).toFixed(5)} mm
  w_tip hekatan= ${(O * 1e3).toFixed(5)} mm  (\u0394 ${y.toFixed(4)}%)`);
    },
    runModal(e, s, n) {
      var _a, _b;
      const _ = s.nodes.val, l = s.elements.val, a = s.nodeInputs.val, c = s.elementInputs.val;
      if (!(!_.length || !l.length || !((_a = a.supports) == null ? void 0 : _a.size) || !((_b = c.densities) == null ? void 0 : _b.size))) try {
        const o = J(_, l, a, c, 6);
        n.render(o, {
          title: `W2 Viga flexi\xF3n Compuesta SRC Encased L=${e.L}m`,
          properties: [
            `Outer ${(e.D_out * 100).toFixed(0)}\xD7${(e.B_out * 100).toFixed(0)} cm + IPE ${(e.h_st * 1e3).toFixed(0)}\xD7${(e.B_st * 1e3).toFixed(0)} mm`,
            `n=${(e.E_s / e.E_c).toFixed(2)}  transformed-section`
          ]
        });
      } catch (o) {
        console.warn("Modal W2 flex composite encased error:", o.message);
      }
    }
  };
});
export {
  __tla,
  Q as v
};
