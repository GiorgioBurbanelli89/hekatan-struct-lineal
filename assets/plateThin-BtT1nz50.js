import { m as v, p as g, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
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
    id: "plate-thin",
    name: "Plate Thin (Kirchhoff) \u2014 Hekatan vs SAP -0.32%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    benchmark: true,
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
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
        default: 0.05,
        min: 0.02,
        max: 0.2,
        step: 0.01,
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
        default: 5,
        min: 1,
        max: 20,
        step: 0.5,
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
    build(t, s) {
      const a = g({
        E: t.E,
        nu: t.nu,
        thickness: t.t,
        theoryType: 1,
        meshLx: t.Lx,
        meshLy: t.Ly,
        meshNx: Math.round(t.nx),
        meshNy: Math.round(t.ny),
        bcType: "simply-supported",
        pressure: -t.q
      }), u = a.nodeResults.map((e) => [
        e.x,
        e.y,
        0
      ]), l = a.elementResults.map((e) => e.nodes);
      s.nodes.val = u, s.elements.val = l;
      const o = /* @__PURE__ */ new Map();
      l.forEach((e, n) => o.set(n, t.t));
      const d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), b = t.Lx / Math.round(t.nx) * (t.Ly / Math.round(t.ny));
      u.forEach((e, n) => {
        const p = Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - t.Lx) < 1e-6 || Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - t.Ly) < 1e-6;
        p && d.set(n, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        const f = (Math.abs(e[0]) < 1e-6 || Math.abs(e[0] - t.Lx) < 1e-6) && (Math.abs(e[1]) < 1e-6 || Math.abs(e[1] - t.Ly) < 1e-6) ? 0.25 : p ? 0.5 : 1, L = -t.q * b * f;
        m.set(n, [
          0,
          0,
          L,
          0,
          0,
          0
        ]);
      }), s.nodeInputs.val = {
        supports: d,
        loads: m
      }, s.elementInputs.val = {
        thicknesses: o
      };
      const c = /* @__PURE__ */ new Map();
      a.nodeResults.forEach((e, n) => {
        c.set(n, [
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
      const i = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
      a.elementResults.forEach((e, n) => {
        i.set(n, [
          e.Mxx,
          e.Mxx,
          e.Mxx,
          e.Mxx
        ]), h.set(n, [
          e.Myy,
          e.Myy,
          e.Myy,
          e.Myy
        ]), r.set(n, [
          e.Mxy,
          e.Mxy,
          e.Mxy,
          e.Mxy
        ]);
      }), s.analyzeOutputs.val = {
        bendingXX: i,
        bendingYY: h,
        bendingXY: r
      };
      const x = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
      l.forEach((e, n) => {
        x.set(n, t.E), M.set(n, t.nu), y.set(n, 24 / 9.81);
      }), s.elementInputs.val = {
        thicknesses: o,
        elasticities: x,
        poissonsRatios: M,
        densities: y
      }, s.objects3D.val = [];
    },
    runModal(t, s, a) {
      var _a, _b;
      const u = s.nodes.val, l = s.elements.val, o = s.nodeInputs.val, d = s.elementInputs.val;
      if (!(!u.length || !l.length || !((_a = o.supports) == null ? void 0 : _a.size) || !((_b = d.densities) == null ? void 0 : _b.size))) try {
        const m = v(u, l, o, d, 12);
        a.render(m, {
          title: `Plate Thin ${t.Lx}\xD7${t.Ly}m t=${t.t}m`,
          properties: [
            `E=${(t.E / 1e6).toFixed(1)} GPa  \u03BD=${t.nu}  \u03C1=24 kN/m\xB3`
          ]
        });
      } catch (m) {
        console.warn("Modal plate-thin error:", m.message);
      }
    }
  };
});
export {
  __tla,
  k as p
};
