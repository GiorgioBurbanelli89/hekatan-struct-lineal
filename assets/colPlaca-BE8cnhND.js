import { m as i, __tla as __tla_0 } from "./simpleExampleTemplates-DQEnfnkD.js";
let d;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let u;
  u = (t, e, r, n, l, m) => ({
    default: r,
    min: n,
    max: l,
    step: m,
    label: e,
    folder: t
  });
  d = i({
    id: "col-placa",
    name: "Columna + Placa Base",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F529} Conexiones",
    params: {
      Lx: u("Geometr\xEDa", "Lx placa (m)", 0.4, 0.2, 1, 0.05),
      Ly: u("Geometr\xEDa", "Ly placa (m)", 0.4, 0.2, 1, 0.05),
      t: u("Secci\xF3n", "espesor placa (m)", 0.025, 0.01, 0.05, 5e-3),
      Hc: u("Geometr\xEDa", "Altura columna (m)", 3, 1, 8, 0.5),
      nx: u("Malla", "nx", 6, 4, 16, 1),
      ny: u("Malla", "ny", 6, 4, 16, 1),
      P: u("Cargas", "P axial tope (kN)", -100, -1e3, 100, 10)
    },
    gen: (t) => {
      const e = Math.round(t.nx), r = Math.round(t.ny), n = [];
      for (let a = 0; a <= r; a++) for (let o = 0; o <= e; o++) n.push([
        o * t.Lx / e - t.Lx / 2,
        a * t.Ly / r - t.Ly / 2,
        0
      ]);
      const l = n.length;
      n.push([
        0,
        0,
        t.Hc
      ]);
      const m = Math.round(r / 2) * (e + 1) + Math.round(e / 2), x = [];
      for (let a = 0; a < r; a++) for (let o = 0; o < e; o++) {
        const c = a * (e + 1) + o;
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
      const s = /* @__PURE__ */ new Map();
      s.set(0, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), s.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]), s.set(r * (e + 1), [
        true,
        true,
        true,
        true,
        true,
        true
      ]), s.set(r * (e + 1) + e, [
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
        nodes: n,
        elements: x,
        supports: s,
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
  d as c
};
