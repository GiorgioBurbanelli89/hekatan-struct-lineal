import { a as A } from "./analyze-DgLgRmKg.js";
import { d as F, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let C;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
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
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "shearX",
      "shearY",
      "vonMises",
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
    build(n, a) {
      const o = Math.round(n.nx), l = Math.round(n.ny), M = n.Lx / o, v = n.Ly / l, r = [], s = (e, t) => t * (o + 1) + e;
      for (let e = 0; e <= l; e++) for (let t = 0; t <= o; t++) r.push([
        t * M,
        e * v,
        0
      ]);
      const u = [];
      for (let e = 0; e < l; e++) for (let t = 0; t < o; t++) u.push([
        s(t, e),
        s(t + 1, e),
        s(t + 1, e + 1),
        s(t, e + 1)
      ]);
      const i = u.length, m = [];
      for (let e = 0; e < o; e++) m.push([
        s(e, 0),
        s(e + 1, 0)
      ]);
      for (let e = 0; e < o; e++) m.push([
        s(e, l),
        s(e + 1, l)
      ]);
      for (let e = 0; e < l; e++) m.push([
        s(0, e),
        s(0, e + 1)
      ]);
      for (let e = 0; e < l; e++) m.push([
        s(o, e),
        s(o, e + 1)
      ]);
      const d = m.length, f = [
        ...u,
        ...m
      ];
      a.nodes.val = r, a.elements.val = f;
      const _ = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
      for (let e = 0; e < i; e++) _.set(e, n.t), b.set(e, n.E), p.set(e, n.nu), h.set(e, 24), O.set(e, 2);
      const S = n.bW * n.bH, R = n.bW * n.bH ** 3 / 12, X = n.bH * n.bW ** 3 / 12, W = R + X, Y = n.E / (2 * (1 + n.nu)), j = /* @__PURE__ */ new Map();
      for (let e = 0; e < d; e++) {
        const t = i + e;
        b.set(t, n.E), p.set(t, n.nu), h.set(t, 24), g.set(t, S), y.set(t, R), E.set(t, X), I.set(t, W), j.set(t, Y), L.set(t, [
          n.bH,
          n.bW
        ]), H.set(t, [
          0,
          0,
          1
        ]);
      }
      a.elementInputs.val = {
        thicknesses: _,
        elasticities: b,
        poissonsRatios: p,
        densities: h,
        areas: g,
        momentsOfInertiaY: E,
        momentsOfInertiaZ: y,
        torsionalConstants: I,
        orientations: H,
        sections: L,
        shearModuli: j,
        plateFormulations: O
      };
      const k = /* @__PURE__ */ new Map(), z = [
        s(0, 0),
        s(o, 0),
        s(0, l),
        s(o, l)
      ];
      for (const e of z) k.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const N = /* @__PURE__ */ new Map(), q = n.q * M * v;
      for (let e = 0; e <= l; e++) for (let t = 0; t <= o; t++) {
        const x = t === 0 || t === o, w = e === 0 || e === l, c = x && w ? 0.25 : x || w ? 0.5 : 1;
        N.set(s(t, e), [
          0,
          0,
          -q * c,
          0,
          0,
          0
        ]);
      }
      a.nodeInputs.val = {
        supports: k,
        loads: N
      };
      try {
        a.deformOutputs.val = F(r, f, a.nodeInputs.val, a.elementInputs.val), a.analyzeOutputs.val = A(r, f, a.elementInputs.val, a.deformOutputs.val);
        const e = a.deformOutputs.val.deformations;
        let t = 0;
        e == null ? void 0 : e.forEach((c) => {
          Math.abs(c[2]) > Math.abs(t) && (t = c[2]);
        });
        const x = {
          inf: [],
          sup: [],
          izq: [],
          der: []
        }, w = a.analyzeOutputs.val;
        window.__lastHekatanResult = {
          example: "plate-with-beams",
          params: {
            ...n
          },
          n_nodes: r.length,
          n_shells: i,
          n_frames: d,
          w_max_m: t,
          w_max_mm: t * 1e3,
          frameElemsRange: {
            start: i,
            end: i + d - 1
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
