import { m as x, __tla as __tla_0 } from "./simpleExampleTemplates-rH8lVN9H.js";
let f;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let r;
  r = (n, t, s, l, c, m) => ({
    default: s,
    min: l,
    max: c,
    step: m,
    label: t,
    folder: n
  });
  f = x({
    id: "placa-xy",
    name: "Placa XY (cantil\xE9ver)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    params: {
      Lx: r("Geometr\xEDa", "Lx (m)", 4, 1, 10, 0.5),
      Ly: r("Geometr\xEDa", "Ly (m)", 2, 1, 6, 0.25),
      t: r("Secci\xF3n", "espesor (m)", 0.15, 0.08, 0.4, 0.01),
      nx: r("Malla", "nx", 10, 4, 20, 1),
      ny: r("Malla", "ny", 6, 4, 16, 1),
      CM: r("Cargas", "q (kN/m\xB2)", -5, -30, 0, 0.5)
    },
    gen: (n) => {
      const t = Math.round(n.nx), s = Math.round(n.ny), l = [];
      for (let e = 0; e <= s; e++) for (let a = 0; a <= t; a++) l.push([
        a * n.Lx / t,
        e * n.Ly / s,
        0
      ]);
      const c = [];
      for (let e = 0; e < s; e++) for (let a = 0; a < t; a++) {
        const o = e * (t + 1) + a;
        c.push([
          o,
          o + 1,
          o + 1 + (t + 1),
          o + (t + 1)
        ]);
      }
      const m = /* @__PURE__ */ new Map();
      for (let e = 0; e <= s; e++) m.set(e * (t + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const i = n.Lx / t * (n.Ly / s), u = /* @__PURE__ */ new Map();
      for (let e = 0; e <= s; e++) for (let a = 0; a <= t; a++) {
        const o = e * (t + 1) + a;
        u.set(o, [
          0,
          0,
          n.CM * i,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: l,
        elements: c,
        supports: m,
        loads: u,
        material: "hormigon",
        thickness: n.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  f as p
};
