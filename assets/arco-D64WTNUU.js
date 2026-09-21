import { m as p, __tla as __tla_0 } from "./simpleExampleTemplates-BP8SSWDv.js";
let M;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let n;
  n = (t, r, a, o, u, s) => ({
    default: a,
    min: o,
    max: u,
    step: s,
    label: r,
    folder: t
  });
  M = p({
    id: "arco",
    name: "Arco (Gateway)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    params: {
      span: n("Geometr\xEDa", "Luz (m)", 40, 10, 100, 2),
      rise: n("Geometr\xEDa", "Flecha (m)", 20, 5, 60, 1),
      nDiv: n("Geometr\xEDa", "Divisiones arco", 20, 8, 60, 1),
      CM: n("Cargas", "CM centro (kN)", -200, -2e3, 0, 10)
    },
    gen: (t) => {
      const r = Math.round(t.nDiv), a = [];
      for (let e = 0; e <= r; e++) {
        const c = e / r, m = -t.span / 2 + t.span * c, i = t.rise * (1 - Math.pow(2 * c - 1, 2));
        a.push([
          m,
          0,
          i
        ]);
      }
      const o = [];
      for (let e = 0; e < r; e++) o.push([
        e,
        e + 1
      ]);
      const u = /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ],
        [
          r,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), s = /* @__PURE__ */ new Map();
      return s.set(Math.round(r / 2), [
        0,
        0,
        t.CM,
        0,
        0,
        0
      ]), {
        nodes: a,
        elements: o,
        supports: u,
        loads: s,
        material: "acero",
        barA: 0.05
      };
    }
  });
});
export {
  __tla,
  M as a
};
