import { m as p, __tla as __tla_0 } from "./simpleExampleTemplates-CG_DvcM8.js";
let c;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let n;
  n = (a, t, u, s, o, r) => ({
    default: u,
    min: s,
    max: o,
    step: r,
    label: t,
    folder: a
  });
  c = p({
    id: "puente",
    name: "Puente reticular",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    params: {
      span: n("Geometr\xEDa", "Luz (m)", 30, 10, 80, 2),
      height: n("Geometr\xEDa", "Canto (m)", 4, 1, 10, 0.5),
      nDiv: n("Geometr\xEDa", "Paneles", 8, 4, 20, 1),
      CM: n("Cargas", "CM tablero (kN)", -50, -300, 0, 5)
    },
    gen: (a) => {
      const t = Math.round(a.nDiv), u = a.span / t, s = [];
      for (let e = 0; e <= t; e++) s.push([
        u * e,
        0,
        0
      ]);
      for (let e = 0; e <= t; e++) s.push([
        u * e,
        0,
        a.height
      ]);
      const o = t + 1, r = [];
      for (let e = 0; e < t; e++) r.push([
        e,
        e + 1
      ]);
      for (let e = 0; e < t; e++) r.push([
        o + e,
        o + e + 1
      ]);
      for (let e = 0; e <= t; e++) r.push([
        e,
        o + e
      ]);
      for (let e = 0; e < t; e++) e < t / 2 ? r.push([
        e,
        o + e + 1
      ]) : r.push([
        o + e,
        e + 1
      ]);
      const l = /* @__PURE__ */ new Map([
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
          t,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), i = /* @__PURE__ */ new Map();
      for (let e = 0; e <= t; e++) i.set(e, [
        0,
        0,
        a.CM,
        0,
        0,
        0
      ]);
      return {
        nodes: s,
        elements: r,
        supports: l,
        loads: i,
        material: "acero",
        barA: 8e-3
      };
    }
  });
});
export {
  __tla,
  c as p
};
