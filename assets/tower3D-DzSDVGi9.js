import { a as F } from "./analyze-CRH7D0Bs.js";
import { m as L, d as P, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let U;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let X, O, k, Z, q, a;
  X = 9.81;
  O = 25e6;
  k = 0.2;
  Z = O / (2 * (1 + k));
  q = 24 / X;
  a = (o, s, l, i, r, d) => ({
    default: l,
    min: i,
    max: r,
    step: d,
    label: s,
    folder: o
  });
  U = {
    id: "tower-3d",
    name: "Torre 3D (con diagonales)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      dx: a("Geometr\xEDa", "Ancho X (m)", 4, 2, 10, 0.25),
      dy: a("Geometr\xEDa", "Ancho Y (m)", 4, 2, 10, 0.25),
      dz: a("Geometr\xEDa", "Altura piso (m)", 3, 2, 5, 0.1),
      stories: a("Geometr\xEDa", "N\xB0 pisos", 3, 1, 10, 1),
      nSub: a("Geometr\xEDa", "Div. vigas", 3, 1, 8, 1),
      colSize: a("Secciones", "b\xD7h columna (m)", 0.35, 0.2, 0.6, 0.05),
      vigaB: a("Secciones", "b viga (m)", 0.25, 0.15, 0.5, 0.05),
      vigaH: a("Secciones", "h viga (m)", 0.4, 0.2, 0.8, 0.05),
      CM: a("Cargas", "CM por nodo (kN)", -5, -30, 0, 1),
      CV: a("Cargas", "CV por nodo (kN)", -2, -20, 0, 1),
      Ex: a("Cargas", "Ex lateral tope (kN)", 30, 0, 300, 5)
    },
    build(o, s) {
      const l = Math.round(o.stories), i = Math.max(1, Math.round(o.nSub)), r = o.CM + o.CV, d = o.Ex, c = [];
      for (let e = 0; e <= l; e++) c.push([
        0,
        0,
        o.dz * e
      ], [
        o.dx,
        0,
        o.dz * e
      ], [
        o.dx,
        o.dy,
        o.dz * e
      ], [
        0,
        o.dy,
        o.dz * e
      ]);
      const v = c.length, u = [
        ...c
      ], n = [], m = /* @__PURE__ */ new Set(), y = /* @__PURE__ */ new Set();
      for (let e = 0; e < l; e++) for (let t = 0; t < 4; t++) m.add(n.length), n.push([
        e * 4 + t,
        (e + 1) * 4 + t
      ]);
      for (let e = 0; e < l; e++) {
        const t = e * 4;
        m.add(n.length), n.push([
          t,
          t + 5
        ]), m.add(n.length), n.push([
          t + 3,
          t + 6
        ]), m.add(n.length), n.push([
          t,
          t + 7
        ]), m.add(n.length), n.push([
          t + 1,
          t + 6
        ]);
      }
      const b = [];
      for (let e = 1; e <= l; e++) {
        const t = e * 4;
        b.push([
          t,
          t + 1
        ], [
          t + 1,
          t + 2
        ], [
          t + 2,
          t + 3
        ], [
          t + 3,
          t
        ], [
          t,
          t + 2
        ]);
      }
      for (const [e, t] of b) {
        const h = c[e], w = c[t];
        let S = e;
        for (let x = 1; x < i; x++) {
          const C = x / i, E = u.length;
          u.push([
            h[0] + (w[0] - h[0]) * C,
            h[1] + (w[1] - h[1]) * C,
            h[2] + (w[2] - h[2]) * C
          ]), y.add(n.length), n.push([
            S,
            E
          ]), S = E;
        }
        y.add(n.length), n.push([
          S,
          t
        ]);
      }
      const f = /* @__PURE__ */ new Map();
      for (let e = 0; e < 4; e++) f.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const g = /* @__PURE__ */ new Map(), G = v - 2;
      if (r !== 0) for (let e = 0; e < u.length; e++) f.has(e) || g.set(e, [
        0,
        0,
        r,
        0,
        0,
        0
      ]);
      if (d !== 0) {
        const e = g.get(G) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        g.set(G, [
          e[0] + d,
          e[1],
          e[2],
          0,
          0,
          0
        ]);
      }
      const J = o.colSize * o.colSize, B = o.colSize * o.colSize ** 3 / 12, R = B, V = 0.14 * Math.pow(o.colSize, 4), j = o.vigaB * o.vigaH, T = o.vigaB * o.vigaH ** 3 / 12, Y = o.vigaH * o.vigaB ** 3 / 12, _ = 0.21 * Math.pow(Math.min(o.vigaB, o.vigaH), 3) * Math.max(o.vigaB, o.vigaH), D = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
      for (let e = 0; e < n.length; e++) D.set(e, O), H.set(e, Z), A.set(e, k), $.set(e, q), m.has(e) ? (M.set(e, J), p.set(e, B), z.set(e, R), I.set(e, V)) : (M.set(e, j), p.set(e, Y), z.set(e, T), I.set(e, _));
      s.nodes.val = u, s.elements.val = n, s.nodeInputs.val = {
        supports: f,
        loads: g
      }, s.elementInputs.val = {
        elasticities: D,
        shearModuli: H,
        areas: M,
        momentsOfInertiaY: p,
        momentsOfInertiaZ: z,
        torsionalConstants: I,
        densities: $,
        poissonsRatios: A
      };
      const N = P(u, n, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = N, s.analyzeOutputs.val = F(u, n, s.elementInputs.val, N), s.objects3D.val = [];
    },
    runModal(o, s, l) {
      var _a, _b;
      const i = s.nodes.val, r = s.elements.val, d = s.nodeInputs.val, c = s.elementInputs.val;
      if (!(!i.length || !r.length || !((_a = d.supports) == null ? void 0 : _a.size) || !((_b = c.densities) == null ? void 0 : _b.size))) try {
        const v = L(i, r, d, c, 12);
        l.render(v, {
          title: `Torre 3D ${o.dx}\xD7${o.dy}\xD7${Math.round(o.stories) * o.dz}m`,
          properties: [
            `${Math.round(o.stories)} pisos con diagonales  cols ${o.colSize}m  vigas ${o.vigaB}\xD7${o.vigaH}m`
          ]
        });
      } catch (v) {
        console.warn("Modal torre 3D error:", v.message);
      }
    }
  };
});
export {
  __tla,
  U as t
};
