import { m as c, __tla as __tla_0 } from "./simpleExampleTemplates-BuIWse2j.js";
let h;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let o;
  o = (r, t, a, l, u, n) => ({
    default: a,
    min: l,
    max: u,
    step: n,
    label: t,
    folder: r
  });
  h = c({
    id: "viga-q4",
    name: "Viga Q4 (cantil\xE9ver)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    params: {
      L: o("Geometr\xEDa", "L (m)", 4, 1, 10, 0.5),
      H: o("Geometr\xEDa", "H (m)", 0.6, 0.2, 2, 0.1),
      t: o("Secci\xF3n", "espesor (m)", 0.25, 0.1, 0.5, 0.05),
      nx: o("Malla", "nx", 20, 4, 40, 1),
      ny: o("Malla", "ny", 6, 2, 16, 1),
      F: o("Cargas", "F punta (kN)", 10, -100, 100, 1)
    },
    gen: (r) => {
      const t = Math.round(r.nx), a = Math.round(r.ny), l = [];
      for (let e = 0; e <= a; e++) for (let s = 0; s <= t; s++) l.push([
        s * r.L / t,
        0,
        e * r.H / a
      ]);
      const u = [];
      for (let e = 0; e < a; e++) for (let s = 0; s < t; s++) {
        const m = e * (t + 1) + s;
        u.push([
          m,
          m + 1,
          m + 1 + (t + 1),
          m + (t + 1)
        ]);
      }
      const n = /* @__PURE__ */ new Map();
      for (let e = 0; e <= a; e++) n.set(e * (t + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      for (let e = 0; e < l.length; e++) n.has(e) || n.set(e, [
        false,
        true,
        false,
        true,
        true,
        true
      ]);
      const i = /* @__PURE__ */ new Map();
      for (let e = 0; e <= a; e++) i.set(e * (t + 1) + t, [
        0,
        0,
        r.F / (a + 1),
        0,
        0,
        0
      ]);
      return {
        nodes: l,
        elements: u,
        supports: n,
        loads: i,
        material: "hormigon",
        thickness: r.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  h as v
};
