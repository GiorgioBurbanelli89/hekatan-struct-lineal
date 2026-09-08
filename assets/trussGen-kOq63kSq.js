import { a as O } from "./analyze-DgLgRmKg.js";
import { m as y, d as L, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { p as R, n as D, s as I, e as F, F as V } from "./paramsSeccion-Bn-RQEWN.js";
import { t as _ } from "./cadSections-DVtTZU6U.js";
let Z;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let w, G, $, E, Y, k;
  w = 2e8;
  G = 0.3;
  $ = w / (2 * (1 + G));
  E = 78;
  Y = 9.81;
  k = E / Y;
  Z = {
    id: "truss-gen",
    name: "Cercha (Warren)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 6 GDL Espacial",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      span: {
        default: 12,
        min: 4,
        max: 30,
        step: 0.5,
        label: "Luz (m)",
        folder: "Geometr\xEDa"
      },
      divisions: {
        default: 6,
        min: 2,
        max: 20,
        step: 1,
        label: "Divisiones",
        folder: "Geometr\xEDa"
      },
      height: {
        default: 1.5,
        min: 0.5,
        max: 5,
        step: 0.1,
        label: "Altura cercha (m)",
        folder: "Geometr\xEDa"
      },
      ...R("Secciones", {
        forma: V["Tubo rectangular"],
        h: 100,
        b: 100,
        t: 4
      }),
      CM: {
        default: -2,
        min: -20,
        max: 0,
        step: 0.5,
        label: "CM por nodo (kN)",
        folder: "Cargas"
      },
      CV: {
        default: -1,
        min: -20,
        max: 0,
        step: 0.5,
        label: "CV por nodo (kN)",
        folder: "Cargas"
      }
    },
    build(t, s) {
      const o = Math.round(t.divisions), l = t.span / o, i = t.height, a = [];
      for (let e = 0; e <= o; e++) a.push([
        l * e,
        0,
        0
      ]);
      for (let e = 0; e <= o; e++) a.push([
        l * e,
        0,
        i
      ]);
      const r = o + 1, n = [];
      for (let e = 0; e < o; e++) n.push([
        e,
        e + 1
      ]);
      for (let e = 0; e < o; e++) n.push([
        r + e,
        r + e + 1
      ]);
      for (let e = 0; e <= o; e++) n.push([
        e,
        r + e
      ]);
      for (let e = 0; e < o; e++) e < o / 2 ? n.push([
        e,
        r + e + 1
      ]) : n.push([
        r + e,
        e + 1
      ]);
      const x = /* @__PURE__ */ new Map([
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
          o,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]), u = t.CM + t.CV, m = /* @__PURE__ */ new Map();
      if (u !== 0) for (let e = 0; e <= o; e++) m.set(e, [
        0,
        0,
        u,
        0,
        0,
        0
      ]);
      const p = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), c = I(t), z = c.A, { moiZ: A, moiY: S } = _(c);
      for (let e = 0; e < n.length; e++) p.set(e, w), d.set(e, $), g.set(e, G), b.set(e, k), f.set(e, z), h.set(e, A), v.set(e, S), M.set(e, c.J);
      s.nodes.val = a, s.elements.val = n, s.nodeInputs.val = {
        supports: x,
        loads: m
      }, s.elementInputs.val = {
        elasticities: p,
        shearModuli: d,
        areas: f,
        momentsOfInertiaY: v,
        momentsOfInertiaZ: h,
        torsionalConstants: M,
        densities: b,
        poissonsRatios: g
      };
      const C = L(a, n, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = C, s.analyzeOutputs.val = O(a, n, s.elementInputs.val, C), s.objects3D.val = [];
    },
    computedLabels: (t) => F(t),
    runModal(t, s, o) {
      var _a, _b;
      const l = s.nodes.val, i = s.elements.val, a = s.nodeInputs.val, r = s.elementInputs.val;
      if (!(!l.length || !i.length || !((_a = a.supports) == null ? void 0 : _a.size) || !((_b = r.densities) == null ? void 0 : _b.size))) try {
        const n = y(l, i, a, r, 12);
        o.render(n, {
          title: `Cercha Warren L=${t.span}m h=${t.height}m`,
          properties: [
            `E=200 GPa (acero)  ${D(t)}  A=${(I(t).A * 1e4).toFixed(1)} cm\xB2`
          ]
        });
      } catch (n) {
        console.warn("Modal truss error:", n.message);
      }
    }
  };
});
export {
  __tla,
  Z as t
};
