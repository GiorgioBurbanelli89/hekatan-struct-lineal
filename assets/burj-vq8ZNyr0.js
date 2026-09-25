import { m as f, __tla as __tla_0 } from "./simpleExampleTemplates-BqTNz7sr.js";
let h;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let m;
  m = (a, n, u, c, l, p) => ({
    default: u,
    min: c,
    max: l,
    step: p,
    label: n,
    folder: a
  });
  h = f({
    id: "burj",
    name: "Burj (torre esbelta)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      H: m("Geometr\xEDa", "Altura (m)", 100, 30, 300, 5),
      baseW: m("Geometr\xEDa", "Base (m)", 20, 5, 40, 1),
      nLv: m("Geometr\xEDa", "Pisos", 20, 5, 50, 1),
      taper: m("Geometr\xEDa", "Estrechamiento (%)", 40, 0, 80, 5),
      Ex: m("Cargas", "Viento (kN)", 100, 0, 1e3, 10)
    },
    gen: (a) => {
      const n = Math.round(a.nLv), u = [];
      for (let t = 0; t <= n; t++) {
        const o = t / n, e = a.baseW * (1 - a.taper / 100 * o), r = a.H / n * t, s = e / 2;
        u.push([
          -s,
          -s,
          r
        ], [
          s,
          -s,
          r
        ], [
          s,
          s,
          r
        ], [
          -s,
          s,
          r
        ]);
      }
      const c = [];
      for (let t = 0; t < n; t++) {
        const o = t * 4;
        for (let r = 0; r < 4; r++) c.push([
          o + r,
          o + 4 + r
        ]);
        const e = o + 4;
        c.push([
          e,
          e + 1
        ], [
          e + 1,
          e + 2
        ], [
          e + 2,
          e + 3
        ], [
          e + 3,
          e
        ]), t % 3 === 0 && c.push([
          o,
          o + 5
        ], [
          o + 2,
          o + 7
        ]);
      }
      const l = /* @__PURE__ */ new Map();
      for (let t = 0; t < 4; t++) l.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const p = /* @__PURE__ */ new Map(), i = n * 4;
      return p.set(i, [
        a.Ex,
        0,
        0,
        0,
        0,
        0
      ]), {
        nodes: u,
        elements: c,
        supports: l,
        loads: p,
        material: "acero",
        barA: 0.015
      };
    }
  });
});
export {
  __tla,
  h as b
};
