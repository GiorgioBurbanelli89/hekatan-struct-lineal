import { m as W, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { p as X } from "./planeQ4-DsCzHfbV.js";
let I;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  I = {
    id: "plane",
    name: "Plane Element (Q4 plane stress)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
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
        max: 6,
        step: 0.25,
        label: "W ancho X (m)"
      },
      H: {
        default: 6,
        min: 2,
        max: 12,
        step: 0.25,
        label: "H altura Z (m)"
      },
      t: {
        default: 0.3,
        min: 0.05,
        max: 0.6,
        step: 0.05,
        label: "t espesor (m)"
      },
      E: {
        default: 25e6,
        min: 1e7,
        max: 5e7,
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
        default: 200,
        min: 0,
        max: 400,
        step: 10,
        label: "F lateral tope",
        unitType: "force"
      },
      nx: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elem X"
      },
      nz: {
        default: 16,
        min: 6,
        max: 30,
        step: 1,
        label: "nz elem Z"
      }
    },
    build(e, n) {
      var _a;
      const c = Math.round(e.nx), m = Math.round(e.nz), d = m * (c + 1) + c, o = X({
        E: e.E,
        nu: e.nu,
        thickness: e.t,
        meshLx: e.W,
        meshLy: e.H,
        meshNx: c,
        meshNy: m,
        bcType: "cantilever-bottom",
        pointLoads: [
          {
            node: d,
            fx: e.F,
            fy: 0
          }
        ]
      }), u = o.nodeResults.map((t) => [
        t.x,
        0,
        t.y
      ]), i = o.elementResults.map((t) => t.nodes);
      n.nodes.val = u, n.elements.val = i;
      const r = /* @__PURE__ */ new Map();
      u.forEach((t, s) => {
        Math.abs(t[2]) < 1e-6 && r.set(s, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
      });
      const a = /* @__PURE__ */ new Map(), l = u.findIndex((t) => Math.abs(t[0] - e.W) < 1e-6 && Math.abs(t[2] - e.H) < 1e-6);
      l >= 0 && a.set(l, [
        e.F,
        0,
        0,
        0,
        0,
        0
      ]), n.nodeInputs.val = {
        supports: r,
        loads: a
      };
      const f = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
      i.forEach((t, s) => {
        f.set(s, e.t), M.set(s, e.E), h.set(s, e.nu), p.set(s, 24 / 9.81);
      }), n.elementInputs.val = {
        thicknesses: f,
        elasticities: M,
        poissonsRatios: h,
        densities: p
      };
      const x = /* @__PURE__ */ new Map();
      o.nodeResults.forEach((t, s) => {
        x.set(s, [
          t.ux,
          0,
          t.uy,
          0,
          0,
          0
        ]);
      }), n.deformOutputs.val = {
        deformations: x
      };
      const b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
      o.elementResults.forEach((t, s) => {
        b.set(s, [
          t.sigma_xx,
          t.sigma_xx,
          t.sigma_xx,
          t.sigma_xx
        ]), v.set(s, [
          t.sigma_yy,
          t.sigma_yy,
          t.sigma_yy,
          t.sigma_yy
        ]), y.set(s, [
          t.tau_xy,
          t.tau_xy,
          t.tau_xy,
          t.tau_xy
        ]), F.set(s, [
          t.vonMises,
          t.vonMises,
          t.vonMises,
          t.vonMises
        ]);
      }), n.analyzeOutputs.val = {
        membraneXX: b,
        membraneYY: v,
        membraneXY: y,
        vonMises: F
      }, n.objects3D.val = [];
      const E = e.t * Math.pow(e.W, 3) / 12, $ = e.t * e.W, w = e.E / (2 * (1 + e.nu)), _ = e.F * Math.pow(e.H, 3) / (3 * e.E * E), g = 1.2 * e.F * e.H / (w * $), H = _ + g, R = l >= 0 ? ((_a = x.get(l)) == null ? void 0 : _a[0]) ?? 0 : 0;
      console.log(`[Plane Q4] W=${e.W}m H=${e.H}m t=${e.t}m F=${e.F}kN \u2192 \u03B4_top FEM=${(R * 1e3).toFixed(3)} mm | te\xF3rico flex+shear=${(H * 1e3).toFixed(3)} mm (flex=${(_ * 1e3).toFixed(3)}, shear=${(g * 1e3).toFixed(3)}) | max \u03C3vm=${o.maxVonMises.toFixed(1)} kN/m\xB2 | nDOF=${o.nDOF}`);
    },
    runModal(e, n, c) {
      var _a, _b;
      const m = n.nodes.val, d = n.elements.val, o = n.nodeInputs.val, u = n.elementInputs.val;
      if (!m.length || !d.length || !((_a = u.densities) == null ? void 0 : _a.size)) return;
      const i = /* @__PURE__ */ new Map();
      m.forEach((a, l) => {
        Math.abs(a[2]) < 1e-6 ? i.set(l, [
          true,
          true,
          true,
          true,
          true,
          true
        ]) : i.set(l, [
          false,
          true,
          false,
          true,
          true,
          true
        ]);
      });
      const r = {
        ...o,
        supports: i
      };
      try {
        const a = W(m, d, r, u, 12);
        c.render(a, {
          title: `Plane Q4 ${e.W}\xD7${e.H}m t=${e.t}m`,
          properties: [
            `E=${(e.E / 1e6).toFixed(1)} GPa  \u03BD=${e.nu}  \u03C1=24 kN/m\xB3`
          ]
        }), console.log(`[Plane Q4 Modal] f\u2081 = ${(_b = a.frequencies[0]) == null ? void 0 : _b.toFixed(4)} Hz`);
      } catch (a) {
        console.warn("Modal plane error:", a.message);
      }
    }
  };
});
export {
  __tla,
  I as p
};
