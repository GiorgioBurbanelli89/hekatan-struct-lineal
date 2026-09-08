import { a as k } from "./analyze-DgLgRmKg.js";
import { m as w, d as E, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let g;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  g = {
    id: "membrana",
    name: "Membrana (Plane Stress) \u2014 Hekatan vs SAP -0.23%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    benchmark: true,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "vonMises",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "displacementX",
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
    build(e, n) {
      var _a, _b;
      const s = Math.round(e.nx), l = Math.round(e.nz), d = e.W / s, i = e.H / l, r = [];
      for (let t = 0; t <= l; t++) for (let o = 0; o <= s; o++) r.push([
        o * d,
        0,
        t * i
      ]);
      const a = [];
      for (let t = 0; t < l; t++) for (let o = 0; o < s; o++) {
        const m = t * (s + 1) + o;
        a.push([
          m,
          m + 1,
          m + 1 + (s + 1),
          m + (s + 1)
        ]);
      }
      const c = /* @__PURE__ */ new Map();
      for (let t = 0; t <= s; t++) c.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const u = /* @__PURE__ */ new Map(), x = l * (s + 1), p = e.F / s;
      for (let t = 0; t <= s; t++) {
        const o = x + t, f = t === 0 || t === s ? p * 0.5 : p;
        u.set(o, [
          f,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      const M = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
      a.forEach((t, o) => {
        M.set(o, e.t), h.set(o, e.E), v.set(o, e.nu), b.set(o, 24 / 9.81);
      }), n.nodes.val = r, n.elements.val = a, n.nodeInputs.val = {
        supports: c,
        loads: u
      }, n.elementInputs.val = {
        thicknesses: M,
        elasticities: h,
        poissonsRatios: v,
        densities: b
      };
      try {
        n.deformOutputs.val = E(r, a, {
          supports: c,
          loads: u
        }, n.elementInputs.val), n.analyzeOutputs.val = k(r, a, n.elementInputs.val, n.deformOutputs.val);
        const t = e.t * Math.pow(e.W, 3) / 12, o = e.t * e.W, m = e.E / (2 * (1 + e.nu)), f = e.F * Math.pow(e.H, 3) / (3 * e.E * t), F = 1.2 * e.F * e.H / (m * o), $ = f + F, z = x + Math.floor(s / 2), H = ((_b = (_a = n.deformOutputs.val.deformations) == null ? void 0 : _a.get(z)) == null ? void 0 : _b[0]) ?? 0;
        console.log(`[Muro Q4] W=${e.W}m H=${e.H}m F=${e.F}kN  \u2192  \u03B4_top FEM=${(H * 1e3).toFixed(3)} mm | te\xF3rico flex+shear=${($ * 1e3).toFixed(3)} mm (flex=${(f * 1e3).toFixed(3)}, shear=${(F * 1e3).toFixed(3)})`);
      } catch (t) {
        console.error("Muro Q4 solver error:", t);
      }
      n.objects3D.val = [];
    },
    runModal(e, n, s) {
      var _a, _b, _c;
      const l = n.nodes.val, d = n.elements.val, i = n.nodeInputs.val, r = n.elementInputs.val;
      if (!(!l.length || !d.length || !((_a = i.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const a = w(l, d, i, r, 12), c = `Muro de corte ${e.W}\xD7${e.H}m t=${e.t}m`, u = [
          `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${e.nu}  \u03C1=24 kN/m\xB3`
        ];
        s.render(a, {
          title: c,
          properties: u
        }), console.log(`[Muro Modal] f\u2081 = ${(_c = a.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081 = ${(1 / a.frequencies[0]).toFixed(4)} s`);
      } catch (a) {
        console.warn("Modal muro error:", a.message);
      }
    }
  };
});
export {
  __tla,
  g as m
};
