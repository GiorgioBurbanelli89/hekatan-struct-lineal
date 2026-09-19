import { a as E, __tla as __tla_0 } from "./analyze-CoM5hauA.js";
import { m as g, d as A, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
let V, T;
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
  const O = 9.81, z = 25e6, G = 0.2, Z = z / (2 * (1 + G)), j = 24 / O, R = 2e8, S = 0.3, x = R / (2 * (1 + S)), $ = 78 / O;
  T = function(o) {
    const c = o.hasShellResults;
    return {
      id: o.id,
      name: o.name,
      category: o.category,
      defaultShellResult: c ? "displacementZ" : "none",
      availableShellResults: c ? [
        "bendingXX",
        "bendingYY",
        "bendingXY",
        "membraneXX",
        "vonMises",
        "displacementZ"
      ] : [],
      hasModal: true,
      params: o.params,
      build(a, e) {
        const { nodes: s, elements: t, supports: r, loads: i, material: p = "acero", barA: l = 4e-3, thickness: X = 0.15 } = o.gen(a), m = p === "acero", Y = m ? R : z, _ = m ? x : Z, k = m ? S : G, C = m ? $ : j, d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
        for (let n = 0; n < t.length; n++) if (d.set(n, Y), h.set(n, _), b.set(n, k), w.set(n, C), t[n].length >= 3) y.set(n, X);
        else {
          const u = l * l / 12;
          v.set(n, l), f.set(n, u), M.set(n, u), I.set(n, 2 * u);
        }
        e.nodes.val = s, e.elements.val = t, e.nodeInputs.val = {
          supports: r,
          loads: i
        }, e.elementInputs.val = {
          elasticities: d,
          shearModuli: h,
          areas: v,
          momentsOfInertiaY: f,
          momentsOfInertiaZ: M,
          torsionalConstants: I,
          densities: w,
          poissonsRatios: b,
          thicknesses: y
        };
        try {
          const n = A(s, t, e.nodeInputs.val, e.elementInputs.val);
          e.deformOutputs.val = n, e.analyzeOutputs.val = E(s, t, e.elementInputs.val, n);
        } catch (n) {
          console.warn(`${o.id} solver error:`, n);
        }
        e.objects3D.val = [];
      },
      runModal(a, e, s) {
        var _a, _b;
        const t = e.nodes.val, r = e.elements.val, i = e.nodeInputs.val, p = e.elementInputs.val;
        if (!(!t.length || !r.length || !((_a = i.supports) == null ? void 0 : _a.size) || !((_b = p.densities) == null ? void 0 : _b.size))) try {
          const l = g(t, r, i, p, 12);
          s.render(l, {
            title: o.name,
            properties: []
          });
        } catch (l) {
          console.warn(`Modal ${o.id} error:`, l.message);
        }
      }
    };
  };
  V = function(o, c) {
    const a = {};
    for (const [e, s] of Object.entries(o)) a[e] = {
      ...s,
      default: c[e] ?? s.default
    };
    return a;
  };
});
export {
  __tla,
  V as c,
  T as m
};
