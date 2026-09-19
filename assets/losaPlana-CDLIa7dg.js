import { m as h, __tla as __tla_0 } from "./simpleExampleTemplates-DTECciGK.js";
let M;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let r;
  r = (t, a, s, f, u, n) => ({
    default: s,
    min: f,
    max: u,
    step: n,
    label: a,
    folder: t
  });
  M = h({
    id: "losa-plana",
    name: "Losa plana (con columnas internas)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
    params: {
      Lx: r("Geometr\xEDa", "Lx (m)", 8, 3, 16, 0.5),
      Ly: r("Geometr\xEDa", "Ly (m)", 6, 3, 16, 0.5),
      t: r("Secci\xF3n", "espesor (m)", 0.2, 0.1, 0.4, 0.01),
      nx: r("Malla", "nx", 12, 4, 24, 1),
      ny: r("Malla", "ny", 8, 4, 20, 1),
      CM: r("Cargas", "q (kN/m\xB2)", -8, -30, 0, 0.5)
    },
    gen: (t) => {
      const a = Math.round(t.nx), s = Math.round(t.ny), f = [];
      for (let e = 0; e <= s; e++) for (let l = 0; l <= a; l++) f.push([
        l * t.Lx / a,
        e * t.Ly / s,
        0
      ]);
      const u = [];
      for (let e = 0; e < s; e++) for (let l = 0; l < a; l++) {
        const o = e * (a + 1) + l;
        u.push([
          o,
          o + 1,
          o + 1 + (a + 1),
          o + (a + 1)
        ]);
      }
      const n = /* @__PURE__ */ new Map();
      for (let e = 0; e <= a; e++) n.set(e, [
        false,
        false,
        true,
        false,
        false,
        false
      ]), n.set(s * (a + 1) + e, [
        false,
        false,
        true,
        false,
        false,
        false
      ]);
      for (let e = 0; e <= s; e++) n.set(e * (a + 1), [
        false,
        false,
        true,
        false,
        false,
        false
      ]), n.set(e * (a + 1) + a, [
        false,
        false,
        true,
        false,
        false,
        false
      ]);
      n.set(Math.round(s / 3) * (a + 1) + Math.round(a / 3), [
        true,
        true,
        true,
        false,
        false,
        false
      ]), n.set(Math.round(2 * s / 3) * (a + 1) + Math.round(2 * a / 3), [
        true,
        true,
        true,
        false,
        false,
        false
      ]);
      const c = t.Lx / a * (t.Ly / s), m = /* @__PURE__ */ new Map();
      for (let e = 0; e <= s; e++) for (let l = 0; l <= a; l++) {
        const o = e * (a + 1) + l;
        m.set(o, [
          0,
          0,
          t.CM * c,
          0,
          0,
          0
        ]);
      }
      return {
        nodes: f,
        elements: u,
        supports: n,
        loads: m,
        material: "hormigon",
        thickness: t.t
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  M as l
};
