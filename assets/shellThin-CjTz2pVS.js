import { a as v, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { m as M, d as y, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let Y;
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
  Y = {
    id: "shell-thin",
    name: "Shell Thin (Kirchhoff-Love) \u2014 Hekatan vs SAP \u03B4+4.31% M+0.47%",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F41A} C\xE1scaras",
    benchmark: true,
    defaultShellResult: "displacementZ",
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
        default: 0.05,
        min: 0.01,
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
        default: 0.2,
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
        default: 8,
        min: 4,
        max: 16,
        step: 1,
        label: "nx"
      },
      ny: {
        default: 8,
        min: 4,
        max: 16,
        step: 1,
        label: "ny"
      }
    },
    build(t, s) {
      const l = Math.round(t.nx), a = Math.round(t.ny), i = [];
      for (let e = 0; e <= a; e++) for (let n = 0; n <= l; n++) i.push([
        n * t.Lx / l,
        e * t.Ly / a,
        0
      ]);
      const o = [];
      for (let e = 0; e < a; e++) for (let n = 0; n < l; n++) {
        const u = e * (l + 1) + n;
        o.push([
          u,
          u + 1,
          u + 1 + (l + 1),
          u + (l + 1)
        ]);
      }
      const r = /* @__PURE__ */ new Map();
      for (let e = 0; e <= l; e++) r.set(e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), r.set(a * (l + 1) + e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      for (let e = 0; e <= a; e++) r.set(e * (l + 1), [
        true,
        true,
        true,
        false,
        false,
        false
      ]), r.set(e * (l + 1) + l, [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      const m = t.Lx / l * (t.Ly / a), c = /* @__PURE__ */ new Map();
      for (let e = 0; e <= a; e++) for (let n = 0; n <= l; n++) {
        const u = e * (l + 1) + n, x = (n === 0 || n === l) && (e === 0 || e === a) ? 0.25 : n === 0 || n === l || e === 0 || e === a ? 0.5 : 1, b = -t.q * m * x;
        c.set(u, [
          0,
          0,
          b,
          0,
          0,
          0
        ]);
      }
      const d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
      o.forEach((e, n) => {
        d.set(n, t.t), f.set(n, t.E), p.set(n, t.nu), h.set(n, 24 / 9.81);
      }), s.nodes.val = i, s.elements.val = o, s.nodeInputs.val = {
        supports: r,
        loads: c
      }, s.elementInputs.val = {
        thicknesses: d,
        elasticities: f,
        poissonsRatios: p,
        densities: h
      };
      try {
        s.deformOutputs.val = y(i, o, {
          supports: r,
          loads: c
        }, s.elementInputs.val), s.analyzeOutputs.val = v(i, o, s.elementInputs.val, s.deformOutputs.val);
      } catch (e) {
        console.error("Shell thin solver error:", e);
      }
      s.objects3D.val = [];
    },
    runModal(t, s, l) {
      var _a, _b, _c;
      const a = s.nodes.val, i = s.elements.val, o = s.nodeInputs.val, r = s.elementInputs.val;
      if (!(!a.length || !i.length || !((_a = o.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const m = M(a, i, o, r, 12);
        l.render(m, {
          title: `Shell Thin ${t.Lx}\xD7${t.Ly}m t=${t.t}m`,
          properties: [
            `E=${(t.E / 1e6).toFixed(1)} GPa  \u03BD=${t.nu}  \u03C1=24 kN/m\xB3`
          ]
        }), console.log(`[Shell Thin Modal] f\u2081=${(_c = m.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz`);
      } catch (m) {
        console.warn("Modal shell-thin error:", m.message);
      }
    }
  };
});
export {
  __tla,
  Y as s
};
