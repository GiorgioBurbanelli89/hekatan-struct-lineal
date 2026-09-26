import { a as $, __tla as __tla_0 } from "./analyze-B3N25dJu.js";
import { m as I, d as H, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let E;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
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
    build(e, t) {
      var _a, _b;
      const a = Math.round(e.nx), r = Math.round(e.nz), m = e.W / a, c = e.H / r, i = [];
      for (let n = 0; n <= r; n++) for (let o = 0; o <= a; o++) i.push([
        o * m,
        0,
        n * c
      ]);
      const l = [];
      for (let n = 0; n < r; n++) for (let o = 0; o < a; o++) {
        const s = n * (a + 1) + o;
        l.push([
          s,
          s + 1,
          s + 1 + (a + 1),
          s + (a + 1)
        ]);
      }
      const u = /* @__PURE__ */ new Map();
      for (let n = 0; n <= a; n++) u.set(n, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = /* @__PURE__ */ new Map(), h = r * (a + 1), p = e.Fx / a, M = e.Fz / a;
      for (let n = 0; n <= a; n++) {
        const o = h + n, s = n === 0 || n === a, x = s ? p * 0.5 : p, f = s ? M * 0.5 : M;
        d.set(o, [
          x,
          0,
          f,
          0,
          0,
          0
        ]);
      }
      const b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
      l.forEach((n, o) => {
        b.set(o, e.t), v.set(o, e.E), F.set(o, e.nu), z.set(o, 24 / 9.81);
      }), t.nodes.val = i, t.elements.val = l, t.nodeInputs.val = {
        supports: u,
        loads: d
      }, t.elementInputs.val = {
        thicknesses: b,
        elasticities: v,
        poissonsRatios: F,
        densities: z
      };
      try {
        t.deformOutputs.val = H(i, l, {
          supports: u,
          loads: d
        }, t.elementInputs.val), t.analyzeOutputs.val = $(i, l, t.elementInputs.val, t.deformOutputs.val);
        const n = e.t * Math.pow(e.W, 3) / 12, o = e.t * e.W, s = e.E / (2 * (1 + e.nu)), x = e.Fx * Math.pow(e.H, 3) / (3 * e.E * n), f = 1.2 * e.Fx * e.H / (s * o), k = h + Math.floor(a / 2), g = ((_b = (_a = t.deformOutputs.val.deformations) == null ? void 0 : _a.get(k)) == null ? void 0 : _b[0]) ?? 0;
        console.log(`[Muro MITC4] W=${e.W}m H=${e.H}m Fx=${e.Fx}kN Fz=${e.Fz}kN  \u2192  \u03B4_top FEM=${(g * 1e3).toFixed(3)} mm | cant. ideal flex+shear=${((x + f) * 1e3).toFixed(3)} mm`);
      } catch (n) {
        console.error("Shell thick solver error:", n);
      }
      t.objects3D.val = [];
    },
    runModal(e, t, a) {
      var _a, _b, _c;
      const r = t.nodes.val, m = t.elements.val, c = t.nodeInputs.val, i = t.elementInputs.val;
      if (!(!r.length || !m.length || !((_a = c.supports) == null ? void 0 : _a.size) || !((_b = i.densities) == null ? void 0 : _b.size))) try {
        const l = I(r, m, c, i, 12);
        a.render(l, {
          title: `Muro MITC4 ${e.W}\xD7${e.H}m t=${e.t}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${e.nu}  \u03C1=24 kN/m\xB3`
          ]
        }), console.log(`[Muro MITC4 Modal] f\u2081=${(_c = l.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081=${(1 / l.frequencies[0]).toFixed(4)} s`);
      } catch (l) {
        console.warn("Modal muro MITC4 error:", l.message);
      }
    }
  };
});
export {
  __tla,
  E as s
};
