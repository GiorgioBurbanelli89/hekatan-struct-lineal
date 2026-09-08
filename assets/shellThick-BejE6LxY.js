import { a as I } from "./analyze-DgLgRmKg.js";
import { m as g, d as H, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let E;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  E = {
    id: "shell-thick",
    name: "Shell Thick (MITC4) \u2014 Hekatan vs SAP +0.30%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    benchmark: true,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "vonMises",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "shearX",
      "shearY",
      "displacementX",
      "displacementZ"
    ],
    hasModal: true,
    params: {
      W: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.25,
        label: "W ancho X (m)"
      },
      H: {
        default: 5,
        min: 2,
        max: 15,
        step: 0.25,
        label: "H altura Z (m)"
      },
      t: {
        default: 0.25,
        min: 0.1,
        max: 0.6,
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
      Fx: {
        default: 300,
        min: 0,
        max: 3e3,
        step: 10,
        label: "Fx lateral tope (kN)"
      },
      Fz: {
        default: -500,
        min: -5e3,
        max: 0,
        step: 50,
        label: "Fz gravitacional tope (kN)"
      },
      nx: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elem X"
      },
      nz: {
        default: 12,
        min: 4,
        max: 30,
        step: 1,
        label: "nz elem Z"
      }
    },
    build(e, n) {
      var _a, _b;
      const l = Math.round(e.nx), r = Math.round(e.nz), i = e.W / l, c = e.H / r, m = [];
      for (let t = 0; t <= r; t++) for (let o = 0; o <= l; o++) m.push([
        o * i,
        0,
        t * c
      ]);
      const s = [];
      for (let t = 0; t < r; t++) for (let o = 0; o < l; o++) {
        const a = t * (l + 1) + o;
        s.push([
          a,
          a + 1,
          a + 1 + (l + 1),
          a + (l + 1)
        ]);
      }
      const u = /* @__PURE__ */ new Map();
      for (let t = 0; t <= l; t++) u.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = /* @__PURE__ */ new Map(), h = r * (l + 1), M = e.Fx / l, p = e.Fz / l;
      for (let t = 0; t <= l; t++) {
        const o = h + t, a = t === 0 || t === l, x = a ? M * 0.5 : M, f = a ? p * 0.5 : p;
        d.set(o, [
          x,
          0,
          f,
          0,
          0,
          0
        ]);
      }
      const F = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
      s.forEach((t, o) => {
        F.set(o, e.t), v.set(o, e.E), b.set(o, e.nu), z.set(o, 24 / 9.81);
      }), n.nodes.val = m, n.elements.val = s, n.nodeInputs.val = {
        supports: u,
        loads: d
      }, n.elementInputs.val = {
        thicknesses: F,
        elasticities: v,
        poissonsRatios: b,
        densities: z
      };
      try {
        n.deformOutputs.val = H(m, s, {
          supports: u,
          loads: d
        }, n.elementInputs.val), n.analyzeOutputs.val = I(m, s, n.elementInputs.val, n.deformOutputs.val);
        const t = e.t * Math.pow(e.W, 3) / 12, o = e.t * e.W, a = e.E / (2 * (1 + e.nu)), x = e.Fx * Math.pow(e.H, 3) / (3 * e.E * t), f = 1.2 * e.Fx * e.H / (a * o), k = h + Math.floor(l / 2), $ = ((_b = (_a = n.deformOutputs.val.deformations) == null ? void 0 : _a.get(k)) == null ? void 0 : _b[0]) ?? 0;
        console.log(`[Muro MITC4] W=${e.W}m H=${e.H}m Fx=${e.Fx}kN Fz=${e.Fz}kN  \u2192  \u03B4_top FEM=${($ * 1e3).toFixed(3)} mm | cant. ideal flex+shear=${((x + f) * 1e3).toFixed(3)} mm`);
      } catch (t) {
        console.error("Shell thick solver error:", t);
      }
      n.objects3D.val = [];
    },
    runModal(e, n, l) {
      var _a, _b, _c;
      const r = n.nodes.val, i = n.elements.val, c = n.nodeInputs.val, m = n.elementInputs.val;
      if (!(!r.length || !i.length || !((_a = c.supports) == null ? void 0 : _a.size) || !((_b = m.densities) == null ? void 0 : _b.size))) try {
        const s = g(r, i, c, m, 12);
        l.render(s, {
          title: `Muro MITC4 ${e.W}\xD7${e.H}m t=${e.t}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${e.nu}  \u03C1=24 kN/m\xB3`
          ]
        }), console.log(`[Muro MITC4 Modal] f\u2081=${(_c = s.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081=${(1 / s.frequencies[0]).toFixed(4)} s`);
      } catch (s) {
        console.warn("Modal muro MITC4 error:", s.message);
      }
    }
  };
});
export {
  __tla,
  E as s
};
