import { a as q, __tla as __tla_0 } from "./analyze-CC0LMJ9d.js";
import { d as A, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let C;
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
  C = {
    id: "plate-with-beams",
    name: "Plate + Perimeter Beams (vs SAP)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
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
    params: {
      Lx: {
        default: 6,
        min: 2,
        max: 12,
        step: 0.5,
        label: "Lx (m)"
      },
      Ly: {
        default: 4,
        min: 2,
        max: 12,
        step: 0.5,
        label: "Ly (m)"
      },
      t: {
        default: 0.1,
        min: 0.05,
        max: 0.4,
        step: 0.01,
        label: "t placa (m)"
      },
      bW: {
        default: 0.3,
        min: 0.15,
        max: 0.6,
        step: 0.05,
        label: "viga b (m)"
      },
      bH: {
        default: 0.5,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "viga h (m)"
      },
      E: {
        default: 35e6,
        min: 1e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)"
      },
      nu: {
        default: 0.15,
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
        label: "q \u2193 (kN/m\xB2)"
      },
      nx: {
        default: 6,
        min: 2,
        max: 12,
        step: 1,
        label: "nx"
      },
      ny: {
        default: 4,
        min: 2,
        max: 12,
        step: 1,
        label: "ny"
      }
    },
    build(t, a) {
      const l = Math.round(t.nx), o = Math.round(t.ny), w = t.Lx / l, v = t.Ly / o, m = [], s = (e, n) => n * (l + 1) + e;
      for (let e = 0; e <= o; e++) for (let n = 0; n <= l; n++) m.push([
        n * w,
        e * v,
        0
      ]);
      const u = [];
      for (let e = 0; e < o; e++) for (let n = 0; n < l; n++) u.push([
        s(n, e),
        s(n + 1, e),
        s(n + 1, e + 1),
        s(n, e + 1)
      ]);
      const i = u.length, r = [];
      for (let e = 0; e < l; e++) r.push([
        s(e, 0),
        s(e + 1, 0)
      ]);
      for (let e = 0; e < l; e++) r.push([
        s(e, o),
        s(e + 1, o)
      ]);
      for (let e = 0; e < o; e++) r.push([
        s(0, e),
        s(0, e + 1)
      ]);
      for (let e = 0; e < o; e++) r.push([
        s(l, e),
        s(l, e + 1)
      ]);
      const b = r.length, d = [
        ...u,
        ...r
      ];
      a.nodes.val = m, a.elements.val = d;
      const g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
      for (let e = 0; e < i; e++) g.set(e, t.t), p.set(e, t.E), f.set(e, t.nu), h.set(e, 24 / 9.80665), S.set(e, 2);
      const j = t.bW * t.bH, H = t.bW * t.bH ** 3 / 12, L = t.bH * t.bW ** 3 / 12, k = H + L, N = t.E / (2 * (1 + t.nu)), O = /* @__PURE__ */ new Map();
      for (let e = 0; e < b; e++) {
        const n = i + e;
        p.set(n, t.E), f.set(n, t.nu), h.set(n, 24 / 9.80665), _.set(n, j), y.set(n, H), E.set(n, L), X.set(n, k), O.set(n, N), Y.set(n, [
          t.bH,
          t.bW
        ]), I.set(n, [
          0,
          0,
          1
        ]);
      }
      a.elementInputs.val = {
        thicknesses: g,
        elasticities: p,
        poissonsRatios: f,
        densities: h,
        areas: _,
        momentsOfInertiaY: E,
        momentsOfInertiaZ: y,
        torsionalConstants: X,
        orientations: I,
        sections: Y,
        shearModuli: O,
        plateFormulations: S
      };
      const P = /* @__PURE__ */ new Map(), W = [
        s(0, 0),
        s(l, 0),
        s(0, o),
        s(l, o)
      ];
      for (const e of W) P.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const R = /* @__PURE__ */ new Map(), z = t.q * w * v;
      for (let e = 0; e <= o; e++) for (let n = 0; n <= l; n++) {
        const x = n === 0 || n === l, M = e === 0 || e === o, c = x && M ? 0.25 : x || M ? 0.5 : 1;
        R.set(s(n, e), [
          0,
          0,
          -z * c,
          0,
          0,
          0
        ]);
      }
      a.nodeInputs.val = {
        supports: P,
        loads: R
      };
      try {
        a.deformOutputs.val = A(m, d, a.nodeInputs.val, a.elementInputs.val), a.analyzeOutputs.val = q(m, d, a.elementInputs.val, a.deformOutputs.val);
        const e = a.deformOutputs.val.deformations;
        let n = 0;
        e == null ? void 0 : e.forEach((c) => {
          Math.abs(c[2]) > Math.abs(n) && (n = c[2]);
        });
        const x = {
          inf: [],
          sup: [],
          izq: [],
          der: []
        }, M = a.analyzeOutputs.val;
        window.__lastHekatanResult = {
          example: "plate-with-beams",
          params: {
            ...t
          },
          n_nodes: m.length,
          n_shells: i,
          n_frames: b,
          w_max_m: n,
          w_max_mm: n * 1e3,
          frameElemsRange: {
            start: i,
            end: i + b - 1
          }
        }, console.log("HEKATAN_RESULT:", JSON.stringify(window.__lastHekatanResult));
      } catch (e) {
        console.error("plate-with-beams build error:", e == null ? void 0 : e.message);
      }
      a.objects3D.val = [];
    }
  };
});
export {
  __tla,
  C as p
};
