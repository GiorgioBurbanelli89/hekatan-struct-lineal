import { m as i, __tla as __tla_0 } from "./simpleExampleTemplates-R24XgdoT.js";
let M;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let l;
  l = (a, n, m, c, u, f) => ({
    default: m,
    min: c,
    max: u,
    step: f,
    label: n,
    folder: a
  });
  M = i({
    id: "eiffel",
    name: "Torre Eiffel",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    params: {
      H: l("Geometr\xEDa", "Altura total (m)", 30, 10, 80, 1),
      baseW: l("Geometr\xEDa", "Base (m)", 15, 5, 30, 1),
      topW: l("Geometr\xEDa", "Tope (m)", 2, 0.5, 8, 0.5),
      nLv: l("Geometr\xEDa", "Niveles", 8, 4, 20, 1),
      CM: l("Cargas", "CM tope (kN)", -100, -1e3, 0, 10)
    },
    gen: (a) => {
      const n = Math.round(a.nLv), m = [];
      for (let e = 0; e <= n; e++) {
        const t = e / n, o = a.baseW + (a.topW - a.baseW) * t, s = a.H * t, r = o / 2;
        m.push([
          -r,
          -r,
          s
        ], [
          r,
          -r,
          s
        ], [
          r,
          r,
          s
        ], [
          -r,
          r,
          s
        ]);
      }
      const c = [];
      for (let e = 0; e < n; e++) {
        const t = e * 4;
        for (let s = 0; s < 4; s++) c.push([
          t + s,
          t + 4 + s
        ]);
        c.push([
          t,
          t + 5
        ], [
          t + 1,
          t + 6
        ], [
          t + 2,
          t + 7
        ], [
          t + 3,
          t + 4
        ]);
        const o = t + 4;
        c.push([
          o,
          o + 1
        ], [
          o + 1,
          o + 2
        ], [
          o + 2,
          o + 3
        ], [
          o + 3,
          o
        ]);
      }
      const u = /* @__PURE__ */ new Map();
      for (let e = 0; e < 4; e++) u.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const f = /* @__PURE__ */ new Map(), p = n * 4;
      for (let e = 0; e < 4; e++) f.set(p + e, [
        0,
        0,
        a.CM / 4,
        0,
        0,
        0
      ]);
      return {
        nodes: m,
        elements: c,
        supports: u,
        loads: f,
        material: "acero"
      };
    }
  });
});
export {
  __tla,
  M as e
};
