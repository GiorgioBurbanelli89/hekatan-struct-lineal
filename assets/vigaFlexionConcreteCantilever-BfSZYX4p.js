import { a as V } from "./analyze-DgLgRmKg.js";
import { m as B, d as O, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let _, S, D;
  _ = 0.2;
  S = 23.56;
  D = S / 9.80665;
  q = {
    id: "W2_viga_flexion_concrete_cantilever",
    name: "Viga flexi\xF3n Hormig\xF3n 30\xD760 cantilever (2 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga horizontal cantilever de hormig\xF3n bajo peso propio (flexi\xF3n 2D).",
      "2 grados de libertad efectivos: Uz (deflexi\xF3n vertical) + Ry (rotaci\xF3n).",
      "Validado contra ETABS: \u0394=0.000% vs Timoshenko anal\xEDtico.",
      "Default 30\xD760 cm \xD7 L=3 m. Cambi\xE1 b/h para explorar sensibilidad.",
      "Esperado: w_tip = 0.33054 mm (incluye correcci\xF3n de cortante Timoshenko)."
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
      b: {
        default: 0.3,
        min: 0.1,
        max: 0.6,
        step: 0.01,
        label: "b ancho (m)",
        folder: "Secci\xF3n"
      },
      h: {
        default: 0.6,
        min: 0.2,
        max: 1.2,
        step: 0.01,
        label: "h alto (m)",
        folder: "Secci\xF3n"
      },
      E: {
        default: 2498e4,
        min: 15e6,
        max: 4e7,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      gamma: {
        default: 23.56,
        min: 18,
        max: 28,
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
      const o = e.b * e.h, a = e.b * e.h ** 3 / 12, i = 5 / 6 * o, r = e.E / (2 * (1 + _)), n = e.gamma * o, m = n * e.L ** 4 / (8 * e.E * a), s = n * e.L ** 2 / (2 * r * i), c = (m + s) * 1e3, l = n * e.L ** 2 / 2, u = n * e.L;
      return {
        A: `${(o * 1e4).toFixed(2)} cm\xB2`,
        I33: `${(a * 1e8).toFixed(2)} cm\u2074`,
        "q peso propio": `${n.toFixed(4)} kN/m`,
        "w_tip EB": `${(m * 1e3).toFixed(5)} mm`,
        "w_tip + shear": `${c.toFixed(5)} mm`,
        M_base: `${l.toFixed(3)} kN\xB7m`,
        V_base: `${u.toFixed(3)} kN`
      };
    },
    build(e, o) {
      var _a, _b;
      const a = e.b * e.h, i = e.b * e.h ** 3 / 12, r = e.h * e.b ** 3 / 12, n = 5 / 6 * a, m = e.b * e.h ** 3 / 12 * 0.3, s = e.E / (2 * (1 + _)), c = e.gamma * a, l = Math.max(2, Math.round(e.nElem)), u = e.L / l, f = [];
      for (let t = 0; t <= l; t++) f.push([
        u * t,
        0,
        0
      ]);
      const d = [];
      for (let t = 0; t < l; t++) d.push([
        t,
        t + 1
      ]);
      const z = /* @__PURE__ */ new Map([
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
      ]), b = /* @__PURE__ */ new Map();
      for (let t = 0; t <= l; t++) {
        const N = t === 0 || t === l, y = -c * u * (N ? 0.5 : 1);
        b.set(t, [
          0,
          0,
          y,
          0,
          0,
          0
        ]);
      }
      const p = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map();
      for (let t = 0; t < d.length; t++) p.set(t, e.E), g.set(t, s), v.set(t, a), w.set(t, i), M.set(t, r), E.set(t, m), F.set(t, n), $.set(t, D), L.set(t, _);
      o.nodes.val = f, o.elements.val = d, o.nodeInputs.val = {
        supports: z,
        loads: b
      }, o.elementInputs.val = {
        elasticities: p,
        shearModuli: g,
        areas: v,
        momentsOfInertiaZ: w,
        momentsOfInertiaY: M,
        torsionalConstants: E,
        shearAreasY: F,
        densities: $,
        poissonsRatios: L
      };
      const x = O(f, d, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = x, o.analyzeOutputs.val = V(f, d, o.elementInputs.val, x), o.objects3D.val = [];
      const I = c * e.L ** 4 / (8 * e.E * i), A = c * e.L ** 2 / (2 * s * n), h = I + A, k = ((_b = (_a = x.deformations) == null ? void 0 : _a.get(l)) == null ? void 0 : _b[2]) ?? 0, C = Math.abs(h) > 1e-15 ? (Math.abs(k) - h) / h * 100 : 0;
      console.log(`[W2 Viga flexi\xF3n Hormig\xF3n] L=${e.L}m  ${e.b * 100}\xD7${e.h * 100}cm  q=${c.toFixed(3)} kN/m
  w_tip Euler-Bernoulli  = ${(I * 1e3).toFixed(5)} mm
  w_tip Timoshenko total = ${(h * 1e3).toFixed(5)} mm  (ETABS validado 0.000%)
  w_tip hekatan-fem      = ${(k * 1e3).toFixed(5)} mm  (\u0394 ${C.toFixed(4)}%)`);
    },
    runModal(e, o, a) {
      var _a, _b;
      const i = o.nodes.val, r = o.elements.val, n = o.nodeInputs.val, m = o.elementInputs.val;
      if (!(!i.length || !r.length || !((_a = n.supports) == null ? void 0 : _a.size) || !((_b = m.densities) == null ? void 0 : _b.size))) try {
        const s = B(i, r, n, m, 6);
        a.render(s, {
          title: `W2 Viga flexi\xF3n Hormig\xF3n ${(e.b * 100).toFixed(0)}\xD7${(e.h * 100).toFixed(0)}cm  L=${e.L}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(1)} GPa  \u03B3=${e.gamma.toFixed(2)} kN/m\xB3`
          ]
        });
      } catch (s) {
        console.warn("Modal W2 hormig\xF3n error:", s.message);
      }
    }
  };
});
export {
  __tla,
  q as v
};
