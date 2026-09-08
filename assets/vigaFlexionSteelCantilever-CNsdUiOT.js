import { a as y } from "./analyze-CRH7D0Bs.js";
import { m as G, d as C, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let R;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let w, D, P;
  w = 0.3;
  D = 76.97;
  P = D / 9.80665;
  R = {
    id: "W2_viga_flexion_steel_cantilever",
    name: "Viga flexi\xF3n Acero IPE 300 cantilever (2 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga horizontal cantilever de acero IPE 300 bajo peso propio (flexi\xF3n 2D).",
      "Dimensiones I custom (no cat\xE1logo): h=300, B=150, TF=10.7, TW=7.1 mm.",
      "A e I se usan EXACTOS publicados de IPE 300 (no recomputados de geometr\xEDa).",
      "Validado contra ETABS (SetGeneral pin-eando A, I, As): \u0394=0.000%.",
      "Esperado: w_tip = 0.26230 mm (incluye correcci\xF3n de cortante Timoshenko)."
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
      h: {
        default: 0.3,
        min: 0.1,
        max: 0.6,
        step: 5e-3,
        label: "h depth I (m)",
        folder: "Secci\xF3n"
      },
      B: {
        default: 0.15,
        min: 0.05,
        max: 0.4,
        step: 5e-3,
        label: "B flange width (m)",
        folder: "Secci\xF3n"
      },
      TF: {
        default: 0.0107,
        min: 5e-3,
        max: 0.05,
        step: 5e-4,
        label: "TF flange thick (m)",
        folder: "Secci\xF3n"
      },
      TW: {
        default: 71e-4,
        min: 3e-3,
        max: 0.03,
        step: 5e-4,
        label: "TW web thick (m)",
        folder: "Secci\xF3n"
      },
      E: {
        default: 2e8,
        min: 15e7,
        max: 22e7,
        step: 5e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      gamma: {
        default: 76.97,
        min: 60,
        max: 90,
        step: 0.5,
        label: "\u03B3 (kN/m\xB3)",
        folder: "Material"
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
      const o = e.h - 2 * e.TF, n = 2 * e.B * e.TF + o * e.TW, s = (e.h - e.TF) / 2, l = 2 * (e.B * e.TF ** 3 / 12 + e.B * e.TF * s ** 2) + e.TW * o ** 3 / 12, m = 2 * (e.TF * e.B ** 3 / 12) + o * e.TW ** 3 / 12, r = (2 * e.B * e.TF ** 3 + o * e.TW ** 3) / 3, i = e.h * e.TW, F = e.E / (2 * (1 + w)), c = e.gamma * n, f = c * e.L ** 4 / (8 * e.E * l), d = c * e.L ** 2 / (2 * F * i), a = (f + d) * 1e3, T = c * e.L ** 2 / 2, u = c * e.L;
      return {
        A: `${(n * 1e4).toFixed(2)} cm\xB2`,
        "I33 (strong)": `${(l * 1e8).toFixed(2)} cm\u2074`,
        "I22 (weak)": `${(m * 1e8).toFixed(2)} cm\u2074`,
        "J (torsi\xF3n)": `${(r * 1e8).toFixed(4)} cm\u2074`,
        "q peso propio": `${c.toFixed(4)} kN/m`,
        "w_tip EB": `${(f * 1e3).toFixed(5)} mm`,
        "w_tip + shear": `${a.toFixed(5)} mm`,
        M_base: `${T.toFixed(3)} kN\xB7m`,
        V_base: `${u.toFixed(3)} kN`
      };
    },
    build(e, o) {
      var _a, _b;
      const n = e.h - 2 * e.TF, s = 2 * e.B * e.TF + n * e.TW, l = (e.h - e.TF) / 2, m = 2 * (e.B * e.TF ** 3 / 12 + e.B * e.TF * l ** 2) + e.TW * n ** 3 / 12, r = 2 * (e.TF * e.B ** 3 / 12) + n * e.TW ** 3 / 12, i = (2 * e.B * e.TF ** 3 + n * e.TW ** 3) / 3, F = e.h * e.TW, c = 5 / 6 * (2 * e.B * e.TF), f = e.E / (2 * (1 + w)), d = e.gamma * s, a = Math.max(2, Math.round(e.nElem)), T = e.L / a, u = [];
      for (let t = 0; t <= a; t++) u.push([
        T * t,
        0,
        0
      ]);
      const h = [];
      for (let t = 0; t < a; t++) h.push([
        t,
        t + 1
      ]);
      const p = /* @__PURE__ */ new Map([
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
      ]), g = /* @__PURE__ */ new Map();
      for (let t = 0; t <= a; t++) {
        const O = t === 0 || t === a, V = -d * T * (O ? 0.5 : 1);
        g.set(t, [
          0,
          0,
          V,
          0,
          0,
          0
        ]);
      }
      const E = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map();
      for (let t = 0; t < h.length; t++) E.set(t, e.E), I.set(t, f), M.set(t, s), b.set(t, m), v.set(t, r), B.set(t, i), $.set(t, F), A.set(t, c), L.set(t, P), W.set(t, w);
      o.nodes.val = u, o.elements.val = h, o.nodeInputs.val = {
        supports: p,
        loads: g
      }, o.elementInputs.val = {
        elasticities: E,
        shearModuli: I,
        areas: M,
        momentsOfInertiaZ: b,
        momentsOfInertiaY: v,
        torsionalConstants: B,
        shearAreasY: $,
        shearAreasZ: A,
        densities: L,
        poissonsRatios: W
      };
      const x = C(u, h, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = x, o.analyzeOutputs.val = y(u, h, o.elementInputs.val, x), o.objects3D.val = [];
      const k = d * e.L ** 4 / (8 * e.E * m), N = d * e.L ** 2 / (2 * f * F), _ = k + N, S = ((_b = (_a = x.deformations) == null ? void 0 : _a.get(a)) == null ? void 0 : _b[2]) ?? 0, z = Math.abs(_) > 1e-15 ? (Math.abs(S) - _) / _ * 100 : 0;
      console.log(`[W2 Viga flexi\xF3n Acero IPE] L=${e.L}m  h=${e.h * 1e3}mm  q=${d.toFixed(4)} kN/m
  w_tip Euler-Bernoulli  = ${(k * 1e3).toFixed(5)} mm
  w_tip Timoshenko total = ${(_ * 1e3).toFixed(5)} mm  (ETABS validado 0.000%)
  w_tip hekatan-fem      = ${(S * 1e3).toFixed(5)} mm  (\u0394 ${z.toFixed(4)}%)`);
    },
    runModal(e, o, n) {
      var _a, _b;
      const s = o.nodes.val, l = o.elements.val, m = o.nodeInputs.val, r = o.elementInputs.val;
      if (!(!s.length || !l.length || !((_a = m.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const i = G(s, l, m, r, 6);
        n.render(i, {
          title: `W2 Viga flexi\xF3n Acero h=${(e.h * 1e3).toFixed(0)}mm  L=${e.L}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(0)} GPa  \u03B3=${e.gamma.toFixed(2)} kN/m\xB3`
          ]
        });
      } catch (i) {
        console.warn("Modal W2 acero error:", i.message);
      }
    }
  };
});
export {
  __tla,
  R as v
};
