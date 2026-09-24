import { m as H, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
import { p as P } from "./planeQ4-DsCzHfbV.js";
let N;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  N = {
    id: "plane",
    name: "Plane Element (Q4 plane stress)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
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
    build(e, s) {
      var _a;
      const u = Math.round(e.nx), m = Math.round(e.nz), c = m * (u + 1) + u, o = P({
        E: e.E,
        nu: e.nu,
        thickness: e.t,
        meshLx: e.W,
        meshLy: e.H,
        meshNx: u,
        meshNy: m,
        bcType: "cantilever-bottom",
        pointLoads: [
          {
            node: c,
            fx: e.F,
            fy: 0
          }
        ]
      }), i = o.nodeResults.map((n) => [
        n.x,
        0,
        n.y
      ]), r = o.elementResults.map((n) => n.nodes);
      s.nodes.val = i, s.elements.val = r;
      const d = /* @__PURE__ */ new Map();
      i.forEach((n, t) => {
        Math.abs(n[2]) < 1e-6 && d.set(t, [
          true,
          true,
          true,
          true,
          true,
          true
        ]);
      });
      const a = /* @__PURE__ */ new Map(), l = i.findIndex((n) => Math.abs(n[0] - e.W) < 1e-6 && Math.abs(n[2] - e.H) < 1e-6);
      l >= 0 && a.set(l, [
        e.F,
        0,
        0,
        0,
        0,
        0
      ]), s.nodeInputs.val = {
        supports: d,
        loads: a
      };
      const M = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map();
      r.forEach((n, t) => {
        M.set(t, e.t), p.set(t, e.E), h.set(t, e.nu), f.set(t, 24 / 9.81);
      }), s.elementInputs.val = {
        thicknesses: M,
        elasticities: p,
        poissonsRatios: h,
        densities: f
      };
      const x = /* @__PURE__ */ new Map();
      o.nodeResults.forEach((n, t) => {
        x.set(t, [
          n.ux,
          0,
          n.uy,
          0,
          0,
          0
        ]);
      }), s.deformOutputs.val = {
        deformations: x
      };
      const b = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
      o.elementResults.forEach((n, t) => {
        b.set(t, [
          n.sigma_xx,
          n.sigma_xx,
          n.sigma_xx,
          n.sigma_xx
        ]), v.set(t, [
          n.sigma_yy,
          n.sigma_yy,
          n.sigma_yy,
          n.sigma_yy
        ]), g.set(t, [
          n.tau_xy,
          n.tau_xy,
          n.tau_xy,
          n.tau_xy
        ]), y.set(t, [
          n.vonMises,
          n.vonMises,
          n.vonMises,
          n.vonMises
        ]);
      }), s.analyzeOutputs.val = {
        membraneXX: b,
        membraneYY: v,
        membraneXY: g,
        vonMises: y
      }, s.objects3D.val = [];
      const E = e.t * Math.pow(e.W, 3) / 12, $ = e.t * e.W, w = e.E / (2 * (1 + e.nu)), F = e.F * Math.pow(e.H, 3) / (3 * e.E * E), _ = 1.2 * e.F * e.H / (w * $), X = F + _, Y = l >= 0 ? ((_a = x.get(l)) == null ? void 0 : _a[0]) ?? 0 : 0;
      console.log(`[Plane Q4] W=${e.W}m H=${e.H}m t=${e.t}m F=${e.F}kN \u2192 \u03B4_top FEM=${(Y * 1e3).toFixed(3)} mm | te\xF3rico flex+shear=${(X * 1e3).toFixed(3)} mm (flex=${(F * 1e3).toFixed(3)}, shear=${(_ * 1e3).toFixed(3)}) | max \u03C3vm=${o.maxVonMises.toFixed(1)} kN/m\xB2 | nDOF=${o.nDOF}`);
    },
    runModal(e, s, u) {
      var _a, _b;
      const m = s.nodes.val, c = s.elements.val, o = s.nodeInputs.val, i = s.elementInputs.val;
      if (!m.length || !c.length || !((_a = i.densities) == null ? void 0 : _a.size)) return;
      const r = /* @__PURE__ */ new Map();
      m.forEach((a, l) => {
        Math.abs(a[2]) < 1e-6 ? r.set(l, [
          true,
          true,
          true,
          true,
          true,
          true
        ]) : r.set(l, [
          false,
          true,
          false,
          true,
          true,
          true
        ]);
      });
      const d = {
        ...o,
        supports: r
      };
      try {
        const a = H(m, c, d, i, 12);
        u.render(a, {
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
  N as p
};
