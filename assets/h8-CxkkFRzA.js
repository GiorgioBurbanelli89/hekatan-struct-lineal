import { M as K, __tla as __tla_0 } from "./deform-CK_Uh0DH.js";
let T, R;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const t = await K();
  function _(u) {
    const r = new Float64Array(u), c = t._malloc(r.length * 8);
    return t.HEAPF64.set(r, c / 8), c;
  }
  function j(u) {
    const r = new Int32Array(u), c = t._malloc(r.length * 4);
    return new Int32Array(t.HEAPF64.buffer).set(r, c / 4), c;
  }
  R = function(u) {
    const { nodes: r, elements: c, E: F, nu: d, supports: f, loads: P } = u, m = r.length, p = c.length, o = [], A = [];
    for (const s of r) A.push(s[0], s[1], s[2]);
    const E = _(A);
    o.push(E);
    const i = [];
    for (const s of c) i.push(...s);
    const e = j(i);
    o.push(e);
    const w = [];
    f.forEach(([s, a, n], l) => {
      w.push(l, s ? 1 : 0, a ? 1 : 0, n ? 1 : 0);
    });
    const U = j(w.length > 0 ? w : [
      0
    ]);
    o.push(U);
    const H = [];
    P.forEach(([s, a, n], l) => {
      H.push(l, s, a, n);
    });
    const x = _(H.length > 0 ? H : [
      0
    ]);
    o.push(x);
    const g = t._malloc(4);
    o.push(g);
    const v = t._malloc(4);
    o.push(v);
    const y = t._malloc(4);
    o.push(y);
    const b = t._malloc(4);
    o.push(b);
    const M = t._malloc(4);
    o.push(M);
    const z = t._malloc(4);
    o.push(z);
    const S = t._malloc(8);
    o.push(S), t._hex8_solve(E, m, e, p, F, d, U, f.size, x, P.size, g, v, y, b, M, z, S, u.incompatible === false ? 0 : 1);
    const D = t.HEAPU32[g / 4], k = t.HEAPU32[v / 4], I = t.HEAPU32[y / 4], q = t.HEAPU32[b / 4], V = t.HEAPU32[M / 4], C = t.HEAPU32[z / 4], G = t.HEAPF64[S / 8], O = new Float64Array(t.HEAPF64.buffer, D, k), B = /* @__PURE__ */ new Map();
    for (let s = 0; s < m; s++) B.set(s, [
      O[3 * s],
      O[3 * s + 1],
      O[3 * s + 2]
    ]);
    const J = new Float64Array(t.HEAPF64.buffer, I, q), L = /* @__PURE__ */ new Map();
    for (let s = 0; s < p; s++) {
      const a = [];
      for (let n = 0; n < 8; n++) a.push(J[s * 8 + n]);
      L.set(s, a);
    }
    const h = new Float64Array(t.HEAPF64.buffer, V, C), N = /* @__PURE__ */ new Map();
    for (let s = 0; s < p; s++) {
      const a = [];
      for (let n = 0; n < 8; n++) {
        const l = (s * 8 + n) * 6;
        a.push([
          h[l + 0],
          h[l + 1],
          h[l + 2],
          h[l + 3],
          h[l + 4],
          h[l + 5]
        ]);
      }
      N.set(s, a);
    }
    for (const s of o) t._free(s);
    return t._free(D), t._free(I), t._free(V), {
      displacements: B,
      vonMisesPerElement: L,
      stressPerElement: N,
      elapsedMs: G
    };
  };
  T = function(u, r, c, F, d = true) {
    const f = [], P = _(u.flatMap((e) => [
      e[0],
      e[1],
      e[2]
    ]));
    f.push(P);
    const m = _(F);
    f.push(m);
    const p = t._malloc(48 * 8);
    f.push(p);
    const o = t._malloc(8 * 8);
    f.push(o), t._hex8_stress(P, r, c, m, d ? 1 : 0, p, o);
    const A = Array.from(new Float64Array(t.HEAPF64.buffer, p, 48)), E = Array.from(new Float64Array(t.HEAPF64.buffer, o, 8)), i = [];
    for (let e = 0; e < 8; e++) i.push(A.slice(e * 6, e * 6 + 6));
    return f.forEach((e) => t._free(e)), {
      stress: i,
      vonMises: E
    };
  };
});
export {
  __tla,
  T as a,
  R as h
};
