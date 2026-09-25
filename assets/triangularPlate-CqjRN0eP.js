import { __tla as __tla_0 } from "./didacticCpp-ClOTguHC.js";
import { m as T } from "./mitc3-2FJr2z_r.js";
let q;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  q = {
    id: "triangular-plate",
    name: "Placa Triangular MITC3 (Bathe)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
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
    build(e, i) {
      const c = e.Lx, m = e.Ly, a = Math.round(e.nx), r = Math.round(e.ny), h = c / a, f = m / r, p = [];
      for (let n = 0; n <= r; n++) for (let o = 0; o <= a; o++) p.push([
        o * h,
        n * f
      ]);
      const d = [];
      for (let n = 0; n < r; n++) for (let o = 0; o < a; o++) {
        const l = n * (a + 1) + o, M = l + 1, b = l + (a + 1), x = b + 1;
        d.push([
          l,
          M,
          x
        ]), d.push([
          l,
          x,
          b
        ]);
      }
      const u = [];
      for (let n = 0; n <= r; n++) for (let o = 0; o <= a; o++) {
        const l = n * (a + 1) + o;
        (o === 0 || o === a || n === 0 || n === r) && (u.push({
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
      let w = 0;
      try {
        const n = T({
          E: e.E,
          nu: e.nu,
          thickness: e.t,
          nodes: p,
          elements: d,
          bcs: u,
          pressure: e.q
        }), o = n.nodeResults.map((t) => [
          t.x,
          t.y,
          0
        ]), l = n.elementResults.map((t) => t.nodes);
        i.nodes.val = o, i.elements.val = l;
        const M = /* @__PURE__ */ new Map();
        for (let t = 0; t <= r; t++) for (let s = 0; s <= a; s++) {
          const P = t * (a + 1) + s;
          (s === 0 || s === a || t === 0 || t === r) && M.set(P, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        }
        const b = /* @__PURE__ */ new Map();
        i.nodeInputs.val = {
          supports: M,
          loads: b
        };
        const x = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
        l.forEach((t, s) => {
          x.set(s, e.t), y.set(s, e.E), g.set(s, e.nu), v.set(s, 24 / 9.80665);
        }), i.elementInputs.val = {
          thicknesses: x,
          elasticities: y,
          poissonsRatios: g,
          densities: v
        };
        const E = /* @__PURE__ */ new Map();
        n.nodeResults.forEach((t, s) => {
          E.set(s, [
            0,
            0,
            t.w,
            t.thetaX,
            t.thetaY,
            0
          ]);
        }), i.deformOutputs.val = {
          deformations: E
        };
        const X = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
        n.elementResults.forEach((t, s) => {
          X.set(s, [
            t.Mxx,
            t.Mxx,
            t.Mxx
          ]), Y.set(s, [
            t.Myy,
            t.Myy,
            t.Myy
          ]), $.set(s, [
            t.Mxy,
            t.Mxy,
            t.Mxy
          ]);
        }), i.analyzeOutputs.val = {
          bendingXX: X,
          bendingYY: Y,
          bendingXY: $
        }, i.objects3D.val = [];
        const _ = Math.floor(r / 2) * (a + 1) + Math.floor(a / 2);
        w = Math.abs(n.nodeResults[_].w);
        const F = e.E * Math.pow(e.t, 3) / (12 * (1 - e.nu * e.nu)), R = Math.min(c, m), L = 126e-5 * Math.abs(e.q) * Math.pow(R, 4) / F;
        console.log(`[Triangular Plate MITC3] ${c}\xD7${m}m, t=${e.t}m, q=${e.q}kN/m\xB2 \u2192 w_center FEM = ${(w * 1e3).toFixed(3)} mm | te\xF3rico Timoshenko \xA742 (clamped a\xB2) = ${(L * 1e3).toFixed(3)} mm | ratio = ${(w / L).toFixed(3)}`);
      } catch (n) {
        console.error("[Triangular Plate MITC3]", n);
      }
    },
    computedLabels(e, i) {
      var _a, _b;
      const c = (_a = i.deformOutputs.rawVal) == null ? void 0 : _a.deformations;
      if (!c) return {
        w_center: "\u2014"
      };
      const m = Math.round(e.nx), a = Math.round(e.ny), r = Math.floor(a / 2) * (m + 1) + Math.floor(m / 2), h = Math.abs(((_b = c.get(r)) == null ? void 0 : _b[2]) ?? 0), f = e.E * Math.pow(e.t, 3) / (12 * (1 - e.nu * e.nu)), p = Math.min(e.Lx, e.Ly), d = 126e-5 * Math.abs(e.q) * Math.pow(p, 4) / f, u = h / d;
      return {
        "\u2500\u2500 MITC3 (Bathe 2014) \u2500\u2500": "",
        "w_center FEM": `${(h * 1e3).toFixed(4)} mm`,
        "w_max te\xF3rico Timoshenko \xA742": `${(d * 1e3).toFixed(4)} mm`,
        "Ratio FEM/te\xF3rico": `${u.toFixed(3)}`,
        "Elementos triangulares": `${2 * m * a}`,
        "Rigidez flexural D": `${(f / 1e3).toFixed(1)} kN\xB7m\xB2`
      };
    }
  };
});
export {
  __tla,
  q as t
};
