import { a as F } from "./analyze-DgLgRmKg.js";
import { m as L, d as T, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let ee;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let x, b, G, W, Z, z, y, q, K, c, Q;
  x = 9.81;
  b = 25e6;
  G = 0.2;
  W = b / (2 * (1 + G));
  Z = 24 / x;
  z = 2e8;
  y = 0.3;
  q = z / (2 * (1 + y));
  K = 78 / x;
  c = (e, o, l, s, i, r) => ({
    default: l,
    min: s,
    max: i,
    step: r,
    label: o,
    folder: e
  });
  Q = (e, o, l, s) => ({
    default: l,
    label: o,
    folder: e,
    options: s
  });
  ee = {
    id: "portico-2d",
    name: "P\xF3rtico 2D (un piso)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      width: c("Geometr\xEDa", "Ancho vano (m)", 5, 2, 12, 0.5),
      height: c("Geometr\xEDa", "Altura (m)", 3, 2, 6, 0.1),
      nSub: c("Geometr\xEDa", "Div. viga", 4, 1, 10, 1),
      mat: Q("Secciones", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      colB: c("Secciones", "b columna (m)", 0.4, 0.2, 0.8, 0.05),
      colH: c("Secciones", "h columna (m)", 0.4, 0.2, 0.8, 0.05),
      vigaB: c("Secciones", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: c("Secciones", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      CM: c("Cargas", "CM por nodo (kN)", -10, -50, 0, 1),
      CV: c("Cargas", "CV por nodo (kN)", -5, -30, 0, 1),
      Ex: c("Cargas", "Ex lateral tope (kN)", 30, -200, 200, 5)
    },
    build(e, o) {
      const l = e.width, s = e.height, i = Math.max(1, Math.round(e.nSub)), r = e.CM + e.CV, u = e.Ex, a = [
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          s
        ],
        [
          l,
          0,
          s
        ],
        [
          l,
          0,
          0
        ]
      ], n = [], d = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
      d.add(n.length), n.push([
        0,
        1
      ]), d.add(n.length), n.push([
        2,
        3
      ]);
      let h = 1;
      for (let t = 1; t < i; t++) {
        const j = t / i, S = a.length;
        a.push([
          j * l,
          0,
          s
        ]), p.add(n.length), n.push([
          h,
          S
        ]), h = S;
      }
      p.add(n.length), n.push([
        h,
        2
      ]);
      const A = /* @__PURE__ */ new Map([
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
          3,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), m = /* @__PURE__ */ new Map();
      if (r !== 0) for (let t = 1; t < a.length; t++) t !== 3 && m.set(t, [
        0,
        0,
        r,
        0,
        0,
        0
      ]);
      if (u !== 0) {
        const t = m.get(2) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        m.set(2, [
          u,
          0,
          t[2],
          0,
          0,
          0
        ]);
      }
      const D = e.mat < 0.5 ? b : z, E = e.mat < 0.5 ? W : q, $ = e.mat < 0.5 ? G : y, O = e.mat < 0.5 ? Z : K, P = e.colB * e.colH, _ = e.colB * e.colH ** 3 / 12, k = e.colH * e.colB ** 3 / 12, R = 0.14 * Math.pow(Math.min(e.colB, e.colH), 4), V = e.vigaB * e.vigaH, J = e.vigaB * e.vigaH ** 3 / 12, N = e.vigaH * e.vigaB ** 3 / 12, Y = 0.21 * Math.pow(Math.min(e.vigaB, e.vigaH), 3) * Math.max(e.vigaB, e.vigaH), w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
      for (let t = 0; t < n.length; t++) w.set(t, D), I.set(t, E), B.set(t, $), H.set(t, O), d.has(t) ? (v.set(t, P), g.set(t, k), M.set(t, _), f.set(t, R)) : (v.set(t, V), g.set(t, N), M.set(t, J), f.set(t, Y));
      o.nodes.val = a, o.elements.val = n, o.nodeInputs.val = {
        supports: A,
        loads: m
      }, o.elementInputs.val = {
        elasticities: w,
        shearModuli: I,
        areas: v,
        momentsOfInertiaY: g,
        momentsOfInertiaZ: M,
        torsionalConstants: f,
        densities: H,
        poissonsRatios: B
      };
      const C = T(a, n, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = C, o.analyzeOutputs.val = F(a, n, o.elementInputs.val, C), o.objects3D.val = [];
    },
    runModal(e, o, l) {
      var _a, _b;
      const s = o.nodes.val, i = o.elements.val, r = o.nodeInputs.val, u = o.elementInputs.val;
      if (!(!s.length || !i.length || !((_a = r.supports) == null ? void 0 : _a.size) || !((_b = u.densities) == null ? void 0 : _b.size))) try {
        const a = L(s, i, r, u, 8);
        l.render(a, {
          title: `P\xF3rtico 2D W=${e.width}m H=${e.height}m`,
          properties: [
            `${e.mat < 0.5 ? "Hormig\xF3n" : "Acero"}  col ${e.colB}\xD7${e.colH}  viga ${e.vigaB}\xD7${e.vigaH}`
          ]
        });
      } catch (a) {
        console.warn("Modal p\xF3rtico 2D error:", a.message);
      }
    }
  };
});
export {
  __tla,
  ee as p
};
