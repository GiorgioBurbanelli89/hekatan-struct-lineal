import { m as d, __tla as __tla_0 } from "./simpleExampleTemplates-BuIWse2j.js";
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
  a = (t, o, s, l, c, r) => ({
    default: s,
    min: l,
    max: c,
    step: r,
    label: o,
    folder: t
  });
  M = d({
    id: "muro-contencion",
    name: "Muro de contenci\xF3n",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    params: {
      H: a("Geometr\xEDa", "H (m)", 4, 2, 10, 0.25),
      W: a("Geometr\xEDa", "Ancho base (m)", 3, 1, 8, 0.25),
      t: a("Secci\xF3n", "espesor muro (m)", 0.3, 0.15, 0.8, 0.05),
      nx: a("Malla", "nx", 8, 4, 20, 1),
      nz: a("Malla", "nz", 12, 4, 30, 1),
      qSuelo: a("Cargas", "q suelo (kN/m\xB2)", 30, 5, 100, 2)
    },
    gen: (t) => {
      const o = Math.round(t.nx), s = Math.round(t.nz), l = [];
      for (let e = 0; e <= s; e++) for (let n = 0; n <= o; n++) l.push([
        n * t.W / o,
        0,
        e * t.H / s
      ]);
      const c = [];
      for (let e = 0; e < s; e++) for (let n = 0; n < o; n++) {
        const u = e * (o + 1) + n;
        c.push([
          u,
          u + 1,
          u + 1 + (o + 1),
          u + (o + 1)
        ]);
      }
      const r = /* @__PURE__ */ new Map();
      for (let e = 0; e <= o; e++) r.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let e = 0; e < l.length; e++) r.has(e) || r.set(e, [
        false,
        true,
        false,
        true,
        true,
        true
      ]);
      const m = /* @__PURE__ */ new Map(), i = t.H / s;
      for (let e = 1; e <= s; e++) {
        const n = t.H * e / s, f = t.qSuelo * (t.H - n) / t.H * i, h = e * (o + 1);
        m.set(h, [
          f,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: l,
        elements: c,
        supports: r,
        loads: m,
        material: "hormigon",
        thickness: t.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  M as m
};
