import { m as L, p as v, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let k;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  k = {
    id: "plate-thick",
    name: "Plate Thick (Mindlin-Reissner) \u2014 Hekatan vs SAP +0.30%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    benchmark: true,
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "displacementZ",
      "shearX",
      "shearY"
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
    build(t, n) {
      const a = v({
        E: t.E,
        nu: t.nu,
        thickness: t.t,
        theoryType: 0,
        meshLx: t.Lx,
        meshLy: t.Ly,
        meshNx: Math.round(t.nx),
        meshNy: Math.round(t.ny),
        bcType: "simply-supported",
        pressure: -t.q
      }), c = a.nodeResults.map((e) => [
        e.x,
        e.y,
        0
      ]), l = a.elementResults.map((e) => e.nodes);
      n.nodes.val = c, n.elements.val = l;
      const o = /* @__PURE__ */ new Map();
      l.forEach((e, s) => o.set(s, t.t));
      const i = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), b = t.Lx / Math.round(t.nx) * (t.Ly / Math.round(t.ny));
      c.forEach((e, s) => {
        const p = Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - t.Lx) < 1e-6 || Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - t.Ly) < 1e-6;
        p && i.set(s, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        const f = (Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - t.Lx) < 1e-6) && (Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - t.Ly) < 1e-6) ? 0.25 : p ? 0.5 : 1;
        m.set(s, [
          0,
          0,
          -t.q * b * f,
          0,
          0,
          0
        ]);
      }), n.nodeInputs.val = {
        supports: i,
        loads: m
      }, n.elementInputs.val = {
        thicknesses: o
      };
      const u = /* @__PURE__ */ new Map();
      a.nodeResults.forEach((e, s) => {
        u.set(s, [
          0,
          0,
          e.w,
          e.bx,
          e.by,
          0
        ]);
      }), n.deformOutputs.val = {
        deformations: u
      };
      const d = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
      a.elementResults.forEach((e, s) => {
        d.set(s, [
          e.Mxx,
          e.Mxx,
          e.Mxx,
          e.Mxx
        ]), r.set(s, [
          e.Myy,
          e.Myy,
          e.Myy,
          e.Myy
        ]), h.set(s, [
          e.Mxy,
          e.Mxy,
          e.Mxy,
          e.Mxy
        ]);
      }), n.analyzeOutputs.val = {
        bendingXX: d,
        bendingYY: r,
        bendingXY: h
      };
      const M = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
      l.forEach((e, s) => {
        M.set(s, t.E), x.set(s, t.nu), y.set(s, 24 / 9.81);
      }), n.elementInputs.val = {
        thicknesses: o,
        elasticities: M,
        poissonsRatios: x,
        densities: y
      }, n.objects3D.val = [];
    },
    runModal(t, n, a) {
      var _a, _b;
      const c = n.nodes.val, l = n.elements.val, o = n.nodeInputs.val, i = n.elementInputs.val;
      if (!(!c.length || !l.length || !((_a = o.supports) == null ? void 0 : _a.size) || !((_b = i.densities) == null ? void 0 : _b.size))) try {
        const m = L(c, l, o, i, 12);
        a.render(m, {
          title: `Plate Thick ${t.Lx}\xD7${t.Ly}m t=${t.t}m`,
          properties: [
            `E=${(t.E / 1e6).toFixed(1)} GPa  \u03BD=${t.nu}  \u03C1=24 kN/m\xB3`
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
  k as p
};
