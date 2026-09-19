import { m as n, __tla as __tla_0 } from "./simpleExampleTemplates-AW8VSeqX.js";
let c;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let t;
  t = (e, m, r, o, s, a) => ({
    default: r,
    min: o,
    max: s,
    step: a,
    label: m,
    folder: e
  });
  c = n({
    id: "pergola",
    name: "P\xE9rgola",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      W: t("Geometr\xEDa", "Ancho (m)", 4, 2, 10, 0.25),
      L: t("Geometr\xEDa", "Largo (m)", 5, 2, 12, 0.5),
      H1: t("Geometr\xEDa", "H frontal (m)", 3, 2, 5, 0.1),
      H2: t("Geometr\xEDa", "H trasera (m)", 4, 2, 6, 0.1),
      nSub: t("Geometr\xEDa", "Div. vigas", 2, 1, 6, 1),
      CM: t("Cargas", "CM techo (kN)", -5, -30, 0, 0.5)
    },
    gen: (e) => {
      const m = [
        [
          0,
          0,
          0
        ],
        [
          e.W,
          0,
          0
        ],
        [
          e.W,
          e.L,
          0
        ],
        [
          0,
          e.L,
          0
        ],
        [
          0,
          0,
          e.H1
        ],
        [
          e.W,
          0,
          e.H1
        ],
        [
          e.W,
          e.L,
          e.H2
        ],
        [
          0,
          e.L,
          e.H2
        ]
      ], r = [];
      for (let a = 0; a < 4; a++) r.push([
        a,
        a + 4
      ]);
      r.push([
        4,
        5
      ], [
        5,
        6
      ], [
        6,
        7
      ], [
        7,
        4
      ]), r.push([
        4,
        6
      ]);
      const o = /* @__PURE__ */ new Map();
      for (let a = 0; a < 4; a++) o.set(a, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const s = /* @__PURE__ */ new Map();
      for (let a = 4; a < 8; a++) s.set(a, [
        0,
        0,
        e.CM / 4,
        0,
        0,
        0
      ]);
      return {
        nodes: m,
        elements: r,
        supports: o,
        loads: s,
        material: "hormigon",
        barA: 0.16
      };
    }
  });
});
export {
  __tla,
  c as p
};
