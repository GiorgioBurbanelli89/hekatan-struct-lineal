import { m as h, __tla as __tla_0 } from "./simpleExampleTemplates-as8LNrv1.js";
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
  r = (n, e, o, l, u, m) => ({
    default: o,
    min: l,
    max: u,
    step: m,
    label: e,
    folder: n
  });
  f = h({
    id: "talud",
    name: "Talud (slope)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F578} Membranas",
    params: {
      L: r("Geometr\xEDa", "Longitud (m)", 20, 5, 50, 1),
      H: r("Geometr\xEDa", "Altura (m)", 10, 2, 30, 0.5),
      angle: r("Geometr\xEDa", "Pendiente (\xB0)", 30, 15, 60, 1),
      t: r("Secci\xF3n", "espesor slab (m)", 0.3, 0.1, 1, 0.05),
      nx: r("Malla", "nx", 12, 4, 24, 1),
      ny: r("Malla", "ny", 4, 2, 10, 1),
      CM: r("Cargas", "q (kN/m\xB2)", -20, -100, 0, 2)
    },
    gen: (n) => {
      const e = Math.round(n.nx), o = Math.round(n.ny), l = [], u = n.angle * Math.PI / 180;
      for (let t = 0; t <= o; t++) for (let a = 0; a <= e; a++) {
        const s = n.L * (a / e);
        l.push([
          s * Math.cos(u),
          t * 5 / o,
          s * Math.sin(u)
        ]);
      }
      const m = [];
      for (let t = 0; t < o; t++) for (let a = 0; a < e; a++) {
        const s = t * (e + 1) + a;
        m.push([
          s,
          s + 1,
          s + 1 + (e + 1),
          s + (e + 1)
        ]);
      }
      const c = /* @__PURE__ */ new Map();
      for (let t = 0; t <= o; t++) c.set(t * (e + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = n.L / e * (5 / o), i = /* @__PURE__ */ new Map();
      for (let t = 0; t <= o; t++) for (let a = 0; a <= e; a++) {
        const s = t * (e + 1) + a;
        i.set(s, [
          0,
          0,
          n.CM * d,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: l,
        elements: m,
        supports: c,
        loads: i,
        material: "hormigon",
        thickness: n.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  f as t
};
