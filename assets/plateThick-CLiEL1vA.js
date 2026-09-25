import { m as v, p as L, __tla as __tla_0 } from "./didacticCpp-ClOTguHC.js";
let X;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  X = {
    id: "plate-thick",
    name: "Plate Thick (Mindlin-Reissner) \u2014 Hekatan vs SAP +0.30%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    benchmark: true,
    defaultShellResult: "bendingXX",
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
      Lx: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Lx (m)"
      },
      Ly: {
        default: 4,
        min: 1,
        max: 10,
        step: 0.5,
        label: "Ly (m)"
      },
      t: {
        default: 0.3,
        min: 0.1,
        max: 0.8,
        step: 0.05,
        label: "espesor t (m)"
      },
      E: {
        default: 3e7,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)"
      },
      nu: {
        default: 0.3,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD"
      },
      q: {
        default: 10,
        min: 1,
        max: 30,
        step: 1,
        label: "q presi\xF3n \u2193 (kN/m\xB2)"
      },
      nx: {
        default: 10,
        min: 4,
        max: 20,
        step: 1,
        label: "nx elementos"
      },
      ny: {
        default: 10,
        min: 4,
        max: 20,
        step: 1,
        label: "ny elementos"
      }
    },
    build(n, s) {
      const t = L({
        E: n.E,
        nu: n.nu,
        thickness: n.t,
        theoryType: 0,
        meshLx: n.Lx,
        meshLy: n.Ly,
        meshNx: Math.round(n.nx),
        meshNy: Math.round(n.ny),
        bcType: "simply-supported",
        pressure: -n.q
      }), i = t.nodeResults.map((e) => [
        e.x,
        e.y,
        0
      ]), l = t.elementResults.map((e) => e.nodes);
      s.nodes.val = i, s.elements.val = l;
      const o = /* @__PURE__ */ new Map();
      l.forEach((e, a) => o.set(a, n.t));
      const r = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), y = n.Lx / Math.round(n.nx) * (n.Ly / Math.round(n.ny));
      i.forEach((e, a) => {
        const b = Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - n.Lx) < 1e-6 || Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - n.Ly) < 1e-6;
        b && r.set(a, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        const f = (Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - n.Lx) < 1e-6) && (Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - n.Ly) < 1e-6) ? 0.25 : b ? 0.5 : 1;
        m.set(a, [
          0,
          0,
          -n.q * y * f,
          0,
          0,
          0
        ]);
      }), s.nodeInputs.val = {
        supports: r,
        loads: m
      }, s.elementInputs.val = {
        thicknesses: o
      };
      const c = /* @__PURE__ */ new Map();
      t.nodeResults.forEach((e, a) => {
        c.set(a, [
          0,
          0,
          e.w,
          e.bx,
          e.by,
          0
        ]);
      }), s.deformOutputs.val = {
        deformations: c
      };
      const d = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map();
      t.elementResults.forEach((e, a) => {
        d.set(a, [
          e.Mxx,
          e.Mxx,
          e.Mxx,
          e.Mxx
        ]), u.set(a, [
          e.Myy,
          e.Myy,
          e.Myy,
          e.Myy
        ]), M.set(a, [
          e.Mxy,
          e.Mxy,
          e.Mxy,
          e.Mxy
        ]);
      }), s.analyzeOutputs.val = {
        bendingXX: d,
        bendingYY: u,
        bendingXY: M
      };
      const h = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
      l.forEach((e, a) => {
        h.set(a, n.E), x.set(a, n.nu), p.set(a, 24 / 9.81);
      }), s.elementInputs.val = {
        thicknesses: o,
        elasticities: h,
        poissonsRatios: x,
        densities: p
      }, s.objects3D.val = [];
    },
    runModal(n, s, t) {
      var _a, _b;
      const i = s.nodes.val, l = s.elements.val, o = s.nodeInputs.val, r = s.elementInputs.val;
      if (!(!i.length || !l.length || !((_a = o.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const m = v(i, l, o, r, 12);
        t.render(m, {
          title: `Plate Thick ${n.Lx}\xD7${n.Ly}m t=${n.t}m`,
          properties: [
            `E=${(n.E / 1e6).toFixed(1)} GPa  \u03BD=${n.nu}  \u03C1=24 kN/m\xB3`
          ]
        });
      } catch (m) {
        console.warn("Modal plate-thick error:", m.message);
      }
    }
  };
});
export {
  __tla,
  X as p
};
