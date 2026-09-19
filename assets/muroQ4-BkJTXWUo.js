import { m as h, __tla as __tla_0 } from "./simpleExampleTemplates-DTECciGK.js";
let M;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let a;
  a = (n, t, o, l, u, s) => ({
    default: o,
    min: l,
    max: u,
    step: s,
    label: t,
    folder: n
  });
  M = h({
    id: "muro-q4",
    name: "Muro Q4 (cantil\xE9ver)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    params: {
      W: a("Geometr\xEDa", "Ancho (m)", 3, 1, 8, 0.25),
      H: a("Geometr\xEDa", "Altura (m)", 5, 2, 15, 0.5),
      t: a("Secci\xF3n", "espesor (m)", 0.25, 0.1, 0.5, 0.05),
      nx: a("Malla", "nx", 6, 4, 16, 1),
      nz: a("Malla", "nz", 12, 4, 30, 1),
      F: a("Cargas", "F lateral (kN)", 200, 0, 2e3, 20)
    },
    gen: (n) => {
      const t = Math.round(n.nx), o = Math.round(n.nz), l = [];
      for (let e = 0; e <= o; e++) for (let r = 0; r <= t; r++) l.push([
        r * n.W / t,
        0,
        e * n.H / o
      ]);
      const u = [];
      for (let e = 0; e < o; e++) for (let r = 0; r < t; r++) {
        const m = e * (t + 1) + r;
        u.push([
          m,
          m + 1,
          m + 1 + (t + 1),
          m + (t + 1)
        ]);
      }
      const s = /* @__PURE__ */ new Map();
      for (let e = 0; e <= t; e++) s.set(e, [
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
      const c = /* @__PURE__ */ new Map(), f = o * (t + 1), i = n.F / t;
      for (let e = 0; e <= t; e++) {
        const r = e === 0 || e === t;
        c.set(f + e, [
          r ? i * 0.5 : i,
          0,
          0,
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
        thickness: n.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  M as m
};
