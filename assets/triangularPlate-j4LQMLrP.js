import { __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { m as I } from "./mitc3-2FJr2z_r.js";
let j;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  j = {
    id: "triangular-plate",
    name: "Placa Triangular MITC3 (Bathe)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: false,
    params: {
      Lx: {
        default: 5,
        min: 2,
        max: 10,
        step: 0.5,
        label: "Lx (m)"
      },
      Ly: {
        default: 5,
        min: 2,
        max: 10,
        step: 0.5,
        label: "Ly (m)"
      },
      t: {
        default: 0.15,
        min: 0.05,
        max: 0.5,
        step: 0.01,
        label: "t espesor (m)"
      },
      nx: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "nx divisiones X"
      },
      ny: {
        default: 8,
        min: 4,
        max: 20,
        step: 1,
        label: "ny divisiones Y"
      },
      E: {
        default: 25e6,
        min: 5e6,
        max: 2e8,
        step: 1e6,
        label: "E (kN/m\xB2)",
        folder: "Material"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.4,
        step: 0.01,
        label: "\u03BD",
        folder: "Material"
      },
      q: {
        default: -10,
        min: -50,
        max: 0,
        step: 1,
        label: "q distribuida (kN/m\xB2)",
        folder: "Cargas"
      }
    },
    build(e, r) {
      const c = e.Lx, d = e.Ly, o = Math.round(e.nx), i = Math.round(e.ny), h = c / o, f = d / i, p = [];
      for (let n = 0; n <= i; n++) for (let s = 0; s <= o; s++) p.push([
        s * h,
        n * f
      ]);
      const m = [];
      for (let n = 0; n < i; n++) for (let s = 0; s < o; s++) {
        const l = n * (o + 1) + s, M = l + 1, w = l + (o + 1), x = w + 1;
        m.push([
          l,
          M,
          x
        ]), m.push([
          l,
          x,
          w
        ]);
      }
      const u = [];
      for (let n = 0; n <= i; n++) for (let s = 0; s <= o; s++) {
        const l = n * (o + 1) + s;
        (s === 0 || s === o || n === 0 || n === i) && (u.push({
          node: l,
          dof: 0,
          value: 0
        }), u.push({
          node: l,
          dof: 1,
          value: 0
        }), u.push({
          node: l,
          dof: 2,
          value: 0
        }));
      }
      let y = 0;
      try {
        const n = I({
          E: e.E,
          nu: e.nu,
          thickness: e.t,
          nodes: p,
          elements: m,
          bcs: u,
          pressure: e.q
        }), s = n.nodeResults.map((t) => [
          t.x,
          t.y,
          0
        ]), l = n.elementResults.map((t) => t.nodes);
        r.nodes.val = s, r.elements.val = l;
        const M = /* @__PURE__ */ new Map();
        for (let t = 0; t <= i; t++) for (let a = 0; a <= o; a++) {
          const D = t * (o + 1) + a;
          (a === 0 || a === o || t === 0 || t === i) && M.set(D, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        }
        const w = /* @__PURE__ */ new Map();
        r.nodeInputs.val = {
          supports: M,
          loads: w
        };
        const x = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
        l.forEach((t, a) => {
          x.set(a, e.t), b.set(a, e.E), g.set(a, e.nu), v.set(a, 24);
        }), r.elementInputs.val = {
          thicknesses: x,
          elasticities: b,
          poissonsRatios: g,
          densities: v
        };
        const E = /* @__PURE__ */ new Map();
        n.nodeResults.forEach((t, a) => {
          E.set(a, [
            0,
            0,
            t.w,
            t.thetaX,
            t.thetaY,
            0
          ]);
        }), r.deformOutputs.val = {
          deformations: E
        };
        const $ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
        n.elementResults.forEach((t, a) => {
          $.set(a, [
            t.Mxx,
            t.Mxx,
            t.Mxx
          ]), L.set(a, [
            t.Myy,
            t.Myy,
            t.Myy
          ]), _.set(a, [
            t.Mxy,
            t.Mxy,
            t.Mxy
          ]);
        }), r.analyzeOutputs.val = {
          bendingXX: $,
          bendingYY: L,
          bendingXY: _
        }, r.objects3D.val = [];
        const R = Math.floor(i / 2) * (o + 1) + Math.floor(o / 2);
        y = Math.abs(n.nodeResults[R].w);
        const T = e.E * Math.pow(e.t, 3) / (12 * (1 - e.nu * e.nu)), k = Math.min(c, d), F = 126e-5 * Math.abs(e.q) * Math.pow(k, 4) / T;
        console.log(`[Triangular Plate MITC3] ${c}\xD7${d}m, t=${e.t}m, q=${e.q}kN/m\xB2 \u2192 w_center FEM = ${(y * 1e3).toFixed(3)} mm | te\xF3rico Timoshenko \xA742 (clamped a\xB2) = ${(F * 1e3).toFixed(3)} mm | ratio = ${(y / F).toFixed(3)}`);
      } catch (n) {
        console.error("[Triangular Plate MITC3]", n);
      }
    },
    computedLabels(e, r) {
      var _a, _b;
      const c = (_a = r.deformOutputs.rawVal) == null ? void 0 : _a.deformations;
      if (!c) return {
        w_center: "\u2014"
      };
      const d = Math.round(e.nx), o = Math.round(e.ny), i = Math.floor(o / 2) * (d + 1) + Math.floor(d / 2), h = Math.abs(((_b = c.get(i)) == null ? void 0 : _b[2]) ?? 0), f = e.E * Math.pow(e.t, 3) / (12 * (1 - e.nu * e.nu)), p = Math.min(e.Lx, e.Ly), m = 126e-5 * Math.abs(e.q) * Math.pow(p, 4) / f, u = h / m;
      return {
        "\u2500\u2500 MITC3 (Bathe 2014) \u2500\u2500": "",
        "w_center FEM": `${(h * 1e3).toFixed(4)} mm`,
        "w_max te\xF3rico Timoshenko \xA742": `${(m * 1e3).toFixed(4)} mm`,
        "Ratio FEM/te\xF3rico": `${u.toFixed(3)}`,
        "Elementos triangulares": `${2 * d * o}`,
        "Rigidez flexural D": `${(f / 1e3).toFixed(1)} kN\xB7m\xB2`
      };
    }
  };
});
export {
  __tla,
  j as t
};
