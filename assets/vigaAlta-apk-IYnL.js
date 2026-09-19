import { m as h, __tla as __tla_0 } from "./simpleExampleTemplates-rH8lVN9H.js";
let g;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let o;
  o = (r, t, n, l, u, s) => ({
    default: n,
    min: l,
    max: u,
    step: s,
    label: t,
    folder: r
  });
  g = h({
    id: "viga-alta",
    name: "Viga alta (Deep Beam)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    params: {
      L: o("Geometr\xEDa", "Luz (m)", 4, 1, 10, 0.5),
      H: o("Geometr\xEDa", "Altura (m)", 2, 0.5, 5, 0.1),
      t: o("Secci\xF3n", "espesor (m)", 0.2, 0.05, 0.5, 0.01),
      nx: o("Malla", "nx", 16, 4, 30, 1),
      ny: o("Malla", "ny", 8, 4, 20, 1),
      CM: o("Cargas", "q arriba (kN/m)", -100, -500, 0, 5)
    },
    gen: (r) => {
      const t = Math.round(r.nx), n = Math.round(r.ny), l = [];
      for (let e = 0; e <= n; e++) for (let a = 0; a <= t; a++) l.push([
        a * r.L / t,
        0,
        e * r.H / n
      ]);
      const u = [];
      for (let e = 0; e < n; e++) for (let a = 0; a < t; a++) {
        const m = e * (t + 1) + a;
        u.push([
          m,
          m + 1,
          m + 1 + (t + 1),
          m + (t + 1)
        ]);
      }
      const s = /* @__PURE__ */ new Map();
      s.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), s.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let e = 0; e < l.length; e++) s.has(e) || s.set(e, [
        false,
        true,
        false,
        true,
        true,
        true
      ]);
      const f = n * (t + 1), c = /* @__PURE__ */ new Map(), i = r.CM * (r.L / t);
      for (let e = 0; e <= t; e++) {
        const a = e === 0 || e === t;
        c.set(f + e, [
          0,
          0,
          a ? i * 0.5 : i,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: l,
        elements: u,
        supports: s,
        loads: c,
        material: "hormigon",
        thickness: r.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  g as v
};
