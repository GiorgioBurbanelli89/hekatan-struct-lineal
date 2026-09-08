import { a as E } from "./analyze-DgLgRmKg.js";
import { m as L, d as k, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let P;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const S = 76.97 / 9.80665;
  function h(e, t, n, o) {
    const l = e - 2 * n, i = 2 * t * n, s = l * o, r = i + s, c = (e - n) / 2, m = 2 * (t * n ** 3 / 12), d = 2 * (t * n) * c ** 2, u = o * l ** 3 / 12, x = m + d + u, f = 2 * (n * t ** 3 / 12) + l * o ** 3 / 12, A = (2 * t * n ** 3 + l * o ** 3) / 3, p = l * o, I = 5 / 6 * (2 * t * n);
    return {
      A: r,
      I33: x,
      I22: f,
      J: A,
      As2: p,
      As3: I
    };
  }
  P = {
    id: "W2_viga_axial_cantilever",
    name: "Viga axial Acero I-450 cantilever (1 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga horizontal cantilever bajo carga axial puntual en el extremo libre.",
      "Solo 1 grado de libertad efectivo: Ux (axial). Sin flexi\xF3n ni cortante.",
      "Valida que el solver Timoshenko reproduzca exactamente u = P\xB7L / (E\xB7A).",
      "Default: I450 (D=0.45, B=0.25, TF=0.025, TW=0.013), Steel A36, P=100 kN, L=3 m.",
      "Esperado: Ux = 0.0848 mm \u2014 coincide con ETABS (0.085 mm)."
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
      D: {
        default: 0.45,
        min: 0.1,
        max: 1,
        step: 5e-3,
        label: "D depth I (m)",
        folder: "Secci\xF3n"
      },
      B: {
        default: 0.25,
        min: 0.05,
        max: 0.6,
        step: 5e-3,
        label: "B flange width (m)",
        folder: "Secci\xF3n"
      },
      TF: {
        default: 0.025,
        min: 5e-3,
        max: 0.1,
        step: 1e-3,
        label: "TF flange thick (m)",
        folder: "Secci\xF3n"
      },
      TW: {
        default: 0.013,
        min: 3e-3,
        max: 0.05,
        step: 1e-3,
        label: "TW web thick (m)",
        folder: "Secci\xF3n"
      },
      E: {
        default: 19994e4,
        min: 1e8,
        max: 25e7,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD Poisson",
        folder: "Material"
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
      },
      showAnalytical: {
        default: 1,
        boolean: true,
        label: "Mostrar u anal\xEDtico",
        folder: "Reporte"
      }
    },
    computedLabels(e) {
      const t = h(e.D, e.B, e.TF, e.TW), n = e.Fx * e.L / (e.E * t.A) * 1e3;
      return {
        A: `${(t.A * 1e4).toFixed(2)} cm\xB2`,
        "I33 (strong)": `${(t.I33 * 1e8).toFixed(2)} cm\u2074`,
        "I22 (weak)": `${(t.I22 * 1e8).toFixed(2)} cm\u2074`,
        "J (torsion)": `${(t.J * 1e8).toFixed(4)} cm\u2074`,
        "u_x anal\xEDtico": `${n.toFixed(5)} mm`,
        "k_axial = EA/L": `${(e.E * t.A / e.L).toExponential(3)} kN/m`
      };
    },
    build(e, t) {
      var _a, _b;
      const n = h(e.D, e.B, e.TF, e.TW), o = Math.max(1, Math.round(e.nElem)), l = e.L / o, i = [];
      for (let a = 0; a <= o; a++) i.push([
        l * a,
        0,
        0
      ]);
      const s = [];
      for (let a = 0; a < o; a++) s.push([
        a,
        a + 1
      ]);
      const r = /* @__PURE__ */ new Map([
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
      ]), c = /* @__PURE__ */ new Map([
        [
          o,
          [
            e.Fx,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ]), m = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), M = e.E / (2 * (1 + e.nu));
      for (let a = 0; a < s.length; a++) m.set(a, e.E), d.set(a, M), u.set(a, n.A), x.set(a, n.I33), f.set(a, n.I22), A.set(a, n.J), p.set(a, n.As2), I.set(a, n.As3), v.set(a, S), b.set(a, e.nu);
      t.nodes.val = i, t.elements.val = s, t.nodeInputs.val = {
        supports: r,
        loads: c
      }, t.elementInputs.val = {
        elasticities: m,
        shearModuli: d,
        areas: u,
        momentsOfInertiaZ: x,
        momentsOfInertiaY: f,
        torsionalConstants: A,
        shearAreasY: p,
        shearAreasZ: I,
        densities: v,
        poissonsRatios: b
      };
      const g = k(i, s, t.nodeInputs.val, t.elementInputs.val);
      t.deformOutputs.val = g, t.analyzeOutputs.val = E(i, s, t.elementInputs.val, g), t.objects3D.val = [];
      const F = e.Fx * e.L / (e.E * n.A), _ = ((_b = (_a = g.deformations) == null ? void 0 : _a.get(o)) == null ? void 0 : _b[0]) ?? 0, $ = 848e-7, w = F !== 0 ? (_ - F) / F * 100 : 0;
      console.log(`[W2 Viga axial cantilever] L=${e.L}m  P=${e.Fx}kN  A=${(n.A * 1e4).toFixed(2)} cm\xB2
  u_x anal\xEDtico (P\xB7L/E\xB7A) = ${(F * 1e3).toFixed(5)} mm
  u_x hekatan-fem         = ${(_ * 1e3).toFixed(5)} mm  (\u0394 ${w.toFixed(4)}%)
  ETABS referencia        = ${($ * 1e3).toFixed(3)} mm  (defaults L=3 I450 A36 P=100)`);
    },
    runModal(e, t, n) {
      var _a, _b;
      const o = t.nodes.val, l = t.elements.val, i = t.nodeInputs.val, s = t.elementInputs.val;
      if (!(!o.length || !l.length || !((_a = i.supports) == null ? void 0 : _a.size) || !((_b = s.densities) == null ? void 0 : _b.size))) try {
        const r = L(o, l, i, s, 6), c = h(e.D, e.B, e.TF, e.TW);
        n.render(r, {
          title: `W2 Viga axial \u2014 L=${e.L}m  I${(e.D * 1e3).toFixed(0)}`,
          properties: [
            `Secci\xF3n: I custom D=${(e.D * 1e3).toFixed(0)}\xD7B=${(e.B * 1e3).toFixed(0)}\xD7TF=${(e.TF * 1e3).toFixed(0)}\xD7TW=${(e.TW * 1e3).toFixed(0)} mm`,
            `A=${(c.A * 1e4).toFixed(2)} cm\xB2  E=${(e.E / 1e6).toFixed(1)} GPa  \u03B3=76.97 kN/m\xB3`
          ]
        });
      } catch (r) {
        console.warn("Modal W2 axial error:", r.message);
      }
    }
  };
});
export {
  __tla,
  P as v
};
