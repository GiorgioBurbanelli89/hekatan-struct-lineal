import { m as d, __tla as __tla_0 } from "./simpleExampleTemplates-R24XgdoT.js";
let A;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let n;
  n = (e, u, r, a, c, o) => ({
    default: r,
    min: a,
    max: c,
    step: o,
    label: u,
    folder: e
  });
  A = d({
    id: "opera",
    name: "Opera Sydney (esquem\xE1tico)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      span: n("Geometr\xEDa", "Luz concha (m)", 30, 10, 60, 2),
      rise: n("Geometr\xEDa", "Altura concha (m)", 20, 5, 40, 1),
      nArcs: n("Geometr\xEDa", "N\xB0 conchas", 3, 1, 6, 1),
      nDiv: n("Geometr\xEDa", "Div. por arco", 12, 6, 30, 1),
      CM: n("Cargas", "CM techo (kN)", -30, -200, 0, 5)
    },
    gen: (e) => {
      const u = Math.round(e.nArcs), r = Math.round(e.nDiv), a = [], c = [], o = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
      for (let m = 0; m < u; m++) {
        const h = m * e.span * 1.2, s = a.length;
        for (let t = 0; t <= r; t++) {
          const p = t / r, l = e.span * p, M = e.rise * Math.sin(Math.PI * p);
          a.push([
            l,
            h,
            M
          ]);
        }
        for (let t = 0; t < r; t++) c.push([
          s + t,
          s + t + 1
        ]);
        o.set(s, [
          true,
          true,
          true,
          true,
          true,
          true
        ]), o.set(s + r, [
          true,
          true,
          true,
          true,
          true,
          true
        ]), i.set(s + Math.round(r / 2), [
          0,
          0,
          e.CM,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: a,
        elements: c,
        supports: o,
        loads: i,
        material: "acero",
        barA: 0.025
      };
    }
  });
});
export {
  __tla,
  A as o
};
