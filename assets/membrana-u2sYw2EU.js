import { a as H } from "./analyze-C-HJ03ae.js";
import { m as X, d as k, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
let _;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  _ = {
    id: "membrana",
    name: "Membrana (Plane Stress) \u2014 Hekatan vs SAP -0.23%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    benchmark: true,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    params: {
      W: {
        default: 3,
        min: 1,
        max: 8,
        step: 0.25,
        label: "W ancho X (m)"
      },
      H: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.25,
        label: "H altura Z (m)"
      },
      t: {
        default: 0.2,
        min: 0.05,
        max: 0.5,
        step: 0.01,
        label: "t espesor (m)"
      },
      E: {
        default: 25e6,
        min: 5e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD"
      },
      F: {
        default: 100,
        min: 10,
        max: 2e3,
        step: 10,
        label: "F lateral tope (kN)"
      },
      nx: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elem X"
      },
      nz: {
        default: 10,
        min: 4,
        max: 30,
        step: 1,
        label: "nz elem Z"
      }
    },
    build(e, t) {
      var _a, _b;
      const a = Math.round(e.nx), l = Math.round(e.nz), d = e.W / a, u = e.H / l, r = [];
      for (let n = 0; n <= l; n++) for (let o = 0; o <= a; o++) r.push([
        o * d,
        0,
        n * u
      ]);
      const s = [];
      for (let n = 0; n < l; n++) for (let o = 0; o < a; o++) {
        const m = n * (a + 1) + o;
        s.push([
          m,
          m + 1,
          m + 1 + (a + 1),
          m + (a + 1)
        ]);
      }
      const i = /* @__PURE__ */ new Map();
      for (let n = 0; n <= a; n++) i.set(n, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const c = /* @__PURE__ */ new Map(), f = l * (a + 1), x = e.F / a;
      for (let n = 0; n <= a; n++) {
        const o = f + n, p = n === 0 || n === a ? x * 0.5 : x;
        c.set(o, [
          p,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      const M = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
      s.forEach((n, o) => {
        M.set(o, e.t), b.set(o, e.E), h.set(o, e.nu), v.set(o, 24 / 9.81);
      }), t.nodes.val = r, t.elements.val = s, t.nodeInputs.val = {
        supports: i,
        loads: c
      }, t.elementInputs.val = {
        thicknesses: M,
        elasticities: b,
        poissonsRatios: h,
        densities: v
      };
      try {
        t.deformOutputs.val = k(r, s, {
          supports: i,
          loads: c
        }, t.elementInputs.val), t.analyzeOutputs.val = H(r, s, t.elementInputs.val, t.deformOutputs.val);
        const n = e.t * Math.pow(e.W, 3) / 12, o = e.t * e.W, m = e.E / (2 * (1 + e.nu)), p = e.F * Math.pow(e.H, 3) / (3 * e.E * n), F = 1.2 * e.F * e.H / (m * o), $ = p + F, g = f + Math.floor(a / 2), z = ((_b = (_a = t.deformOutputs.val.deformations) == null ? void 0 : _a.get(g)) == null ? void 0 : _b[0]) ?? 0;
        console.log(`[Muro Q4] W=${e.W}m H=${e.H}m F=${e.F}kN  \u2192  \u03B4_top FEM=${(z * 1e3).toFixed(3)} mm | te\xF3rico flex+shear=${($ * 1e3).toFixed(3)} mm (flex=${(p * 1e3).toFixed(3)}, shear=${(F * 1e3).toFixed(3)})`);
      } catch (n) {
        console.error("Muro Q4 solver error:", n);
      }
      t.objects3D.val = [];
    },
    runModal(e, t, a) {
      var _a, _b, _c;
      const l = t.nodes.val, d = t.elements.val, u = t.nodeInputs.val, r = t.elementInputs.val;
      if (!(!l.length || !d.length || !((_a = u.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const s = X(l, d, u, r, 12), i = `Muro de corte ${e.W}\xD7${e.H}m t=${e.t}m`, c = [
          `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${e.nu}  \u03C1=24 kN/m\xB3`
        ];
        a.render(s, {
          title: i,
          properties: c
        }), console.log(`[Muro Modal] f\u2081 = ${(_c = s.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081 = ${(1 / s.frequencies[0]).toFixed(4)} s`);
      } catch (s) {
        console.warn("Modal muro error:", s.message);
      }
    }
  };
});
export {
  __tla,
  _ as m
};
