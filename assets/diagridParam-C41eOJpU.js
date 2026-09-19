import { m as h, __tla as __tla_0 } from "./simpleExampleTemplates-CtKQEnRT.js";
let M;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let i;
  i = (r, t, a, m, d, c) => ({
    default: a,
    min: m,
    max: d,
    step: c,
    label: t,
    folder: r
  });
  M = h({
    id: "diagrid",
    name: "Diagrid (Gherkin)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      H: i("Geometr\xEDa", "Altura (m)", 60, 20, 150, 5),
      R: i("Geometr\xEDa", "Radio base (m)", 10, 3, 30, 0.5),
      nSides: i("Geometr\xEDa", "Lados", 8, 4, 16, 1),
      nLv: i("Geometr\xEDa", "Niveles", 10, 4, 30, 1),
      Ex: i("Cargas", "Viento (kN)", 60, 0, 400, 5)
    },
    gen: (r) => {
      const t = Math.round(r.nSides), a = Math.round(r.nLv), m = r.H / a, d = [];
      for (let e = 0; e <= a; e++) {
        const n = m * e, o = r.R * (1 - 0.15 * Math.pow(2 * (e / a) - 1, 2));
        for (let s = 0; s < t; s++) {
          const f = 2 * Math.PI * s / t;
          d.push([
            o * Math.cos(f),
            o * Math.sin(f),
            n
          ]);
        }
      }
      const c = [];
      for (let e = 0; e <= a; e++) {
        const n = e * t;
        for (let o = 0; o < t; o++) c.push([
          n + o,
          n + (o + 1) % t
        ]);
      }
      for (let e = 0; e < a; e++) {
        const n = e * t, o = (e + 1) * t;
        for (let s = 0; s < t; s++) c.push([
          n + s,
          o + (s + 1) % t
        ]), c.push([
          n + (s + 1) % t,
          o + s
        ]);
      }
      const l = /* @__PURE__ */ new Map();
      for (let e = 0; e < t; e++) l.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const u = /* @__PURE__ */ new Map();
      for (let e = 0; e < t; e++) u.set(a * t + e, [
        r.Ex / t,
        0,
        0,
        0,
        0,
        0
      ]);
      return {
        nodes: d,
        elements: c,
        supports: l,
        loads: u,
        material: "acero",
        barA: 8e-3
      };
    }
  });
});
export {
  __tla,
  M as d
};
