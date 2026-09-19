import { m as x, __tla as __tla_0 } from "./simpleExampleTemplates-DTECciGK.js";
let L;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let n;
  n = (r, t, a, c, f, l) => ({
    default: a,
    min: c,
    max: f,
    step: l,
    label: t,
    folder: r
  });
  L = x({
    id: "losa-rect",
    name: "Losa Rectangular",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    params: {
      Lx: n("Geometr\xEDa", "Lx (m)", 6, 2, 15, 0.5),
      Ly: n("Geometr\xEDa", "Ly (m)", 4, 2, 15, 0.5),
      t: n("Secci\xF3n", "espesor (m)", 0.15, 0.08, 0.4, 0.01),
      nx: n("Malla", "nx", 10, 4, 20, 1),
      ny: n("Malla", "ny", 8, 4, 20, 1),
      CM: n("Cargas", "CM (kN/m\xB2)", -5, -30, 0, 0.5)
    },
    gen: (r) => {
      const t = Math.round(r.nx), a = Math.round(r.ny), c = [];
      for (let e = 0; e <= a; e++) for (let s = 0; s <= t; s++) c.push([
        s * r.Lx / t,
        e * r.Ly / a,
        0
      ]);
      const f = [];
      for (let e = 0; e < a; e++) for (let s = 0; s < t; s++) {
        const o = e * (t + 1) + s;
        f.push([
          o,
          o + 1,
          o + 1 + (t + 1),
          o + (t + 1)
        ]);
      }
      const l = /* @__PURE__ */ new Map();
      for (let e = 0; e <= t; e++) l.set(e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), l.set(a * (t + 1) + e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      for (let e = 0; e <= a; e++) l.set(e * (t + 1), [
        true,
        true,
        true,
        false,
        false,
        false
      ]), l.set(e * (t + 1) + t, [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      const m = r.Lx / t * (r.Ly / a), u = /* @__PURE__ */ new Map();
      for (let e = 0; e <= a; e++) for (let s = 0; s <= t; s++) {
        const o = e * (t + 1) + s, i = (s === 0 || s === t) && (e === 0 || e === a) ? 0.25 : s === 0 || s === t || e === 0 || e === a ? 0.5 : 1;
        u.set(o, [
          0,
          0,
          r.CM * m * i,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: c,
        elements: f,
        supports: l,
        loads: u,
        material: "hormigon",
        thickness: r.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  L as l
};
