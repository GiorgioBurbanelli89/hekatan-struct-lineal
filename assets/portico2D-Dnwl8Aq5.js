import { a as W } from "./analyze-DgLgRmKg.js";
import { m as Z, d as q, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { s as M, c as K } from "./cargasPorCaso-B_GZ_-rO.js";
let ae;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let D, E, G, Q, U, y, z, X, ee, a, oe;
  D = 9.81;
  E = 25e6;
  G = 0.2;
  Q = E / (2 * (1 + G));
  U = 24 / D;
  y = 2e8;
  z = 0.3;
  X = y / (2 * (1 + z));
  ee = 78 / D;
  a = (e, t, c, s, l, r) => ({
    default: c,
    min: s,
    max: l,
    step: r,
    label: t,
    folder: e
  });
  oe = (e, t, c, s) => ({
    default: c,
    label: t,
    folder: e,
    options: s
  });
  ae = {
    id: "portico-2d",
    name: "P\xF3rtico 2D (un piso)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 3 GDL P\xF3rtico plano",
    patrones: [
      {
        nombre: "Ex",
        tipo: "Seismic"
      }
    ],
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      width: a("Geometr\xEDa", "Ancho vano (m)", 5, 2, 12, 0.5),
      height: a("Geometr\xEDa", "Altura (m)", 3, 2, 6, 0.1),
      nSub: a("Geometr\xEDa", "Div. viga", 4, 1, 10, 1),
      mat: oe("Secciones", "Material", 0, {
        Hormig\u00F3n: 0,
        Acero: 1
      }),
      colB: a("Secciones", "b columna (m)", 0.4, 0.2, 0.8, 0.05),
      colH: a("Secciones", "h columna (m)", 0.4, 0.2, 0.8, 0.05),
      vigaB: a("Secciones", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: a("Secciones", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      CM: a("Cargas", "CM por nodo (kN)", -10, -50, 0, 1),
      CV: a("Cargas", "CV por nodo (kN)", -5, -30, 0, 1),
      Ex: a("Cargas", "Ex lateral tope (kN)", 30, -200, 200, 5)
    },
    build(e, t) {
      const c = e.width, s = e.height, l = Math.max(1, Math.round(e.nSub));
      e.CM + e.CV;
      const r = e.Ex, i = [
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
          c,
          0,
          s
        ],
        [
          c,
          0,
          0
        ]
      ], n = [], m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
      m.add(n.length), n.push([
        0,
        1
      ]), m.add(n.length), n.push([
        2,
        3
      ]);
      let u = 1;
      for (let o = 1; o < l; o++) {
        const T = o / l, b = i.length;
        i.push([
          T * c,
          0,
          s
        ]), p.add(n.length), n.push([
          u,
          b
        ]), u = b;
      }
      p.add(n.length), n.push([
        u,
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
      ]), f = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      for (let o = 1; o < i.length; o++) o !== 3 && (e.CM && M(f, o, [
        0,
        0,
        e.CM,
        0,
        0,
        0
      ]), e.CV && M(w, o, [
        0,
        0,
        e.CV,
        0,
        0,
        0
      ]));
      r !== 0 && M(I, 2, [
        r,
        0,
        0,
        0,
        0,
        0
      ]);
      const $ = K({
        Dead: f,
        Live: w,
        Ex: I
      }), V = e.mat < 0.5 ? E : y, O = e.mat < 0.5 ? Q : X, P = e.mat < 0.5 ? G : z, _ = e.mat < 0.5 ? U : ee, k = e.colB * e.colH, R = e.colB * e.colH ** 3 / 12, J = e.colH * e.colB ** 3 / 12, L = 0.14 * Math.pow(Math.min(e.colB, e.colH), 4), N = e.vigaB * e.vigaH, Y = e.vigaB * e.vigaH ** 3 / 12, j = e.vigaH * e.vigaB ** 3 / 12, F = 0.21 * Math.pow(Math.min(e.vigaB, e.vigaH), 3) * Math.max(e.vigaB, e.vigaH), C = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
      for (let o = 0; o < n.length; o++) C.set(o, V), H.set(o, O), S.set(o, P), B.set(o, _), m.has(o) ? (d.set(o, k), h.set(o, J), v.set(o, R), g.set(o, L)) : (d.set(o, N), h.set(o, j), v.set(o, Y), g.set(o, F));
      t.nodes.val = i, t.elements.val = n, t.nodeInputs.val = {
        supports: A,
        loads: $
      }, t.elementInputs.val = {
        elasticities: C,
        shearModuli: H,
        areas: d,
        momentsOfInertiaY: h,
        momentsOfInertiaZ: v,
        torsionalConstants: g,
        densities: B,
        poissonsRatios: S
      };
      const x = q(i, n, t.nodeInputs.val, t.elementInputs.val);
      t.deformOutputs.val = x, t.analyzeOutputs.val = W(i, n, t.elementInputs.val, x), t.objects3D.val = [];
    },
    runModal(e, t, c) {
      var _a, _b;
      const s = t.nodes.val, l = t.elements.val, r = t.nodeInputs.val, i = t.elementInputs.val;
      if (!(!s.length || !l.length || !((_a = r.supports) == null ? void 0 : _a.size) || !((_b = i.densities) == null ? void 0 : _b.size))) try {
        const n = Z(s, l, r, i, 8);
        c.render(n, {
          title: `P\xF3rtico 2D W=${e.width}m H=${e.height}m`,
          properties: [
            `${e.mat < 0.5 ? "Hormig\xF3n" : "Acero"}  col ${e.colB}\xD7${e.colH}  viga ${e.vigaB}\xD7${e.vigaH}`
          ]
        });
      } catch (n) {
        console.warn("Modal p\xF3rtico 2D error:", n.message);
      }
    }
  };
});
export {
  __tla,
  ae as p
};
