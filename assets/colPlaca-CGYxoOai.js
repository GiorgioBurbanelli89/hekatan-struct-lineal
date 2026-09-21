import { m as p, __tla as __tla_0 } from "./simpleExampleTemplates-BP8SSWDv.js";
let y;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let n;
  n = (t, e, a, r, l, m) => ({
    default: a,
    min: r,
    max: l,
    step: m,
    label: e,
    folder: t
  });
  y = p({
    id: "col-placa",
    name: "Columna + Placa Base",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F529} Conexiones",
    params: {
      Lx: n("Geometr\xEDa", "Lx placa (m)", 0.4, 0.2, 1, 0.05),
      Ly: n("Geometr\xEDa", "Ly placa (m)", 0.4, 0.2, 1, 0.05),
      t: n("Secci\xF3n", "espesor placa (m)", 0.025, 0.01, 0.05, 5e-3),
      Hc: n("Geometr\xEDa", "Altura columna (m)", 3, 1, 8, 0.5),
      nx: n("Malla", "nx", 6, 4, 16, 1),
      ny: n("Malla", "ny", 6, 4, 16, 1),
      P: n("Cargas", "P axial tope (kN)", -100, -1e3, 100, 10)
    },
    gen: (t) => {
      const e = Math.round(t.nx), a = Math.round(t.ny), r = [];
      for (let s = 0; s <= a; s++) for (let u = 0; u <= e; u++) r.push([
        u * t.Lx / e - t.Lx / 2,
        s * t.Ly / a - t.Ly / 2,
        0
      ]);
      const l = r.length;
      r.push([
        0,
        0,
        t.Hc
      ]);
      const m = r.length;
      r.push([
        0,
        0,
        0
      ]);
      const x = [];
      for (let s = 0; s < a; s++) for (let u = 0; u < e; u++) {
        const c = s * (e + 1) + u;
        x.push([
          c,
          c + 1,
          c + 1 + (e + 1),
          c + (e + 1)
        ]);
      }
      x.push([
        m,
        l
      ]);
      const o = /* @__PURE__ */ new Map();
      o.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), o.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), o.set(a * (e + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]), o.set(a * (e + 1) + e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const h = /* @__PURE__ */ new Map();
      return h.set(l, [
        0,
        0,
        t.P,
        0,
        0,
        0
      ]), {
        nodes: r,
        elements: x,
        supports: o,
        loads: h,
        material: "hormigon",
        thickness: t.t,
        barA: 0.01
      };
    },
    hasShellResults: true
  });
});
export {
  __tla,
  y as c
};
