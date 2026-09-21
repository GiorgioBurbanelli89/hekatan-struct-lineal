import { m as f, __tla as __tla_0 } from "./simpleExampleTemplates-BP8SSWDv.js";
let x;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let u;
  u = (o, e, s, l, c, a) => ({
    default: s,
    min: l,
    max: c,
    step: a,
    label: e,
    folder: o
  });
  x = f({
    id: "placa-orificios",
    name: "Placa con orificios",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    params: {
      Lx: u("Geometr\xEDa", "Lx (m)", 0.5, 0.2, 1.5, 0.05),
      Ly: u("Geometr\xEDa", "Ly (m)", 0.5, 0.2, 1.5, 0.05),
      t: u("Secci\xF3n", "espesor (m)", 0.025, 0.01, 0.05, 5e-3),
      nx: u("Malla", "nx", 10, 4, 20, 1),
      ny: u("Malla", "ny", 10, 4, 20, 1),
      CM: u("Cargas", "q presi\xF3n (kN/m\xB2)", -10, -100, 0, 1)
    },
    gen: (o) => {
      const e = Math.round(o.nx), s = Math.round(o.ny), l = [];
      for (let t = 0; t <= s; t++) for (let r = 0; r <= e; r++) l.push([
        r * o.Lx / e,
        t * o.Ly / s,
        0
      ]);
      const c = [];
      for (let t = 0; t < s; t++) for (let r = 0; r < e; r++) {
        if (r === Math.floor(e / 2) && t === Math.floor(s / 2)) continue;
        const n = t * (e + 1) + r;
        c.push([
          n,
          n + 1,
          n + 1 + (e + 1),
          n + (e + 1)
        ]);
      }
      const a = /* @__PURE__ */ new Map();
      a.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), a.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), a.set(s * (e + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]), a.set(s * (e + 1) + e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const m = o.Lx / e * (o.Ly / s), i = /* @__PURE__ */ new Map();
      for (let t = 0; t <= s; t++) for (let r = 0; r <= e; r++) {
        const n = t * (e + 1) + r;
        i.set(n, [
          0,
          0,
          o.CM * m,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: l,
        elements: c,
        supports: a,
        loads: i,
        material: "hormigon",
        thickness: o.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  x as p
};
