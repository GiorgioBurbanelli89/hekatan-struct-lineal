import { a as k } from "./analyze-DgLgRmKg.js";
import { m as C, d as O, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let D;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let x, N;
  x = 0.2;
  N = 23.56 / 9.80665;
  D = {
    id: "W2_viga_axial_concrete_cantilever",
    name: "Viga axial Hormig\xF3n 30\xD730 cantilever (1 DOF)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 1 GDL Axial",
    benchmark: true,
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    guide: [
      "Viga horizontal cantilever de hormig\xF3n bajo carga axial puntual.",
      "1 DOF efectivo (Ux) \u2014 peso propio DESACTIVADO para mantener axial puro.",
      "Secci\xF3n 30\xD730 cm, L=3 m, P=100 kN, f'c=25 MPa (E=24.98 GPa).",
      "Esperado: u_x = P\xB7L/(E\xB7A) = 0.13344 mm."
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
        default: 0.3,
        min: 0.1,
        max: 0.6,
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
      const n = e.b * e.h, o = e.b * e.h ** 3 / 12, l = e.Fx * e.L / (e.E * n) * 1e3;
      return {
        A: `${(n * 1e4).toFixed(2)} cm\xB2`,
        I: `${(o * 1e8).toFixed(2)} cm\u2074`,
        EA: `${(e.E * n).toFixed(0)} kN`,
        "u_x anal\xEDtico": `${l.toFixed(5)} mm`,
        "k_axial = EA/L": `${(e.E * n / e.L).toExponential(3)} kN/m`
      };
    },
    build(e, n) {
      var _a, _b;
      const o = e.b * e.h, l = e.b * e.h ** 3 / 12, r = e.b * e.h ** 3 / 12 * 0.3, s = 5 / 6 * o, m = e.E / (2 * (1 + x)), t = Math.max(1, Math.round(e.nElem)), $ = e.L / t, c = [];
      for (let a = 0; a <= t; a++) c.push([
        $ * a,
        0,
        0
      ]);
      const i = [];
      for (let a = 0; a < t; a++) i.push([
        a,
        a + 1
      ]);
      const I = /* @__PURE__ */ new Map([
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
      ]), A = /* @__PURE__ */ new Map([
        [
          t,
          [
            e.Fx,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ]), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map();
      for (let a = 0; a < i.length; a++) p.set(a, e.E), f.set(a, m), h.set(a, o), v.set(a, l), M.set(a, l), b.set(a, r), g.set(a, s), E.set(a, s), F.set(a, N), L.set(a, x);
      n.nodes.val = c, n.elements.val = i, n.nodeInputs.val = {
        supports: I,
        loads: A
      }, n.elementInputs.val = {
        elasticities: p,
        shearModuli: f,
        areas: h,
        momentsOfInertiaZ: v,
        momentsOfInertiaY: M,
        torsionalConstants: b,
        shearAreasY: g,
        shearAreasZ: E,
        densities: F,
        poissonsRatios: L
      };
      const d = O(c, i, n.nodeInputs.val, n.elementInputs.val);
      n.deformOutputs.val = d, n.analyzeOutputs.val = k(c, i, n.elementInputs.val, d), n.objects3D.val = [];
      const u = e.Fx * e.L / (e.E * o), _ = ((_b = (_a = d.deformations) == null ? void 0 : _a.get(t)) == null ? void 0 : _b[0]) ?? 0, w = u !== 0 ? (_ - u) / u * 100 : 0;
      console.log(`[W2 Viga axial HORMIG\xD3N] L=${e.L}m  ${e.b * 100}\xD7${e.h * 100}cm  P=${e.Fx}kN
  u_x anal\xEDtico = ${(u * 1e3).toFixed(5)} mm
  u_x hekatan   = ${(_ * 1e3).toFixed(5)} mm  (\u0394 ${w.toFixed(4)}%)`);
    },
    runModal(e, n, o) {
      var _a, _b;
      const l = n.nodes.val, r = n.elements.val, s = n.nodeInputs.val, m = n.elementInputs.val;
      if (!(!l.length || !r.length || !((_a = s.supports) == null ? void 0 : _a.size) || !((_b = m.densities) == null ? void 0 : _b.size))) try {
        const t = C(l, r, s, m, 6);
        o.render(t, {
          title: `W2 Viga axial Hormig\xF3n ${(e.b * 100).toFixed(0)}\xD7${(e.h * 100).toFixed(0)}cm  L=${e.L}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${x}  (sin peso propio)`
          ]
        });
      } catch (t) {
        console.warn("Modal W2 axial concrete error:", t.message);
      }
    }
  };
});
export {
  __tla,
  D as v
};
