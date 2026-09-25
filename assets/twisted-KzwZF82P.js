import { m as b, __tla as __tla_0 } from "./simpleExampleTemplates-BqTNz7sr.js";
let P;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let m;
  m = (e, a, p, o, n, c) => ({
    default: p,
    min: o,
    max: n,
    step: c,
    label: a,
    folder: e
  });
  P = b({
    id: "twisted",
    name: "Twisted (Turning Torso)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      H: m("Geometr\xEDa", "Altura (m)", 80, 20, 200, 5),
      baseW: m("Geometr\xEDa", "Lado (m)", 15, 5, 30, 1),
      nLv: m("Geometr\xEDa", "Pisos", 20, 5, 40, 1),
      totalTwist: m("Geometr\xEDa", "Giro total (\xB0)", 90, 0, 180, 5),
      Ex: m("Cargas", "Viento (kN)", 80, 0, 500, 5)
    },
    gen: (e) => {
      const a = Math.round(e.nLv), p = e.H / a, o = e.baseW / 2, n = [];
      for (let t = 0; t <= a; t++) {
        const u = t / a, s = e.totalTwist * Math.PI / 180 * u, r = Math.cos(s), f = Math.sin(s), i = p * t, l = (w, x) => [
          w * r - x * f,
          w * f + x * r
        ], [G, M] = l(-o, -o);
        n.push([
          G,
          M,
          i
        ]);
        const [g, L] = l(o, -o);
        n.push([
          g,
          L,
          i
        ]);
        const [T, k] = l(o, o);
        n.push([
          T,
          k,
          i
        ]);
        const [y, E] = l(-o, o);
        n.push([
          y,
          E,
          i
        ]);
      }
      const c = [];
      for (let t = 0; t < a; t++) {
        const u = t * 4;
        for (let r = 0; r < 4; r++) c.push([
          u + r,
          u + 4 + r
        ]);
        const s = u + 4;
        c.push([
          s,
          s + 1
        ], [
          s + 1,
          s + 2
        ], [
          s + 2,
          s + 3
        ], [
          s + 3,
          s
        ]);
      }
      const h = /* @__PURE__ */ new Map();
      for (let t = 0; t < 4; t++) h.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const d = /* @__PURE__ */ new Map();
      return d.set(a * 4, [
        e.Ex,
        0,
        0,
        0,
        0,
        0
      ]), {
        nodes: n,
        elements: c,
        supports: h,
        loads: d,
        material: "acero",
        barA: 0.012
      };
    }
  });
});
export {
  __tla,
  P as t
};
