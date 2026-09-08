import { a as R } from "./analyze-CRH7D0Bs.js";
import { d as k, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let P;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  P = function(i) {
    const { nodes: h, elements: l, nodeInputs: w, elementInputs: v, Fy: r } = i, E = i.maxIter ?? 12, y = i.tol ?? 0.03, I = i.softeningFactor ?? 0.9, f = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), O = v.elasticities;
    for (let t = 0; t < l.length; t++) {
      const o = O.get(t) ?? 2e8;
      f.set(t, o), c.set(t, o);
    }
    let m = {}, u = {}, s = 0, x = 1, _ = false, d = 0;
    for (s = 0; s < E; s++) {
      const t = {
        ...v,
        elasticities: new Map(c)
      };
      m = k(h, l, w, t), u = R(h, l, t, m);
      let o = false, g = 1;
      d = 0;
      const F = u.vonMises ?? /* @__PURE__ */ new Map();
      for (let e = 0; e < l.length; e++) {
        const p = F.get(e);
        if (!p || p.length === 0) continue;
        let a = 0;
        for (const n of p) Math.abs(n) > a && (a = Math.abs(n));
        if (a > r) {
          const n = a / r, M = c.get(e) ?? f.get(e), z = f.get(e), b = Math.max(M * (r / a) * I, z * 0.01);
          Math.abs(b - M) / M > y && (c.set(e, b), o = true), d++, s === 0 && n > g && (g = n);
        }
      }
      if (s === 0 && (x = g), !o) {
        _ = true;
        break;
      }
    }
    return {
      deformOutputs: m,
      analyzeOutputs: u,
      iterations: s + 1,
      converged: _,
      elementsYielded: d,
      maxRatio: x
    };
  };
});
export {
  __tla,
  P as s
};
