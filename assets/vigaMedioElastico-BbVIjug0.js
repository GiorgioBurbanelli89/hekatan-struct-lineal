import { b as q, V as x, B as T, d as z } from "./Text-BE1eWO-3.js";
import { m as W, d as B, __tla as __tla_0 } from "./didacticCpp-Czy7NlhT.js";
import { e as C } from "./materials-VwssM8Vw.js";
let U;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let D, N, k, J;
  D = 9.81;
  N = 24 / D;
  k = (e, o, c, s, a, d) => ({
    default: c,
    min: s,
    max: a,
    step: d,
    label: o,
    folder: e
  });
  J = (e, o, c, s) => ({
    default: c,
    label: o,
    folder: e,
    options: s
  });
  U = {
    id: "viga-medio-elastico",
    name: "Viga sobre Medio El\xE1stico (Winkler)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      L: k("Geometr\xEDa", "Longitud L (m)", 5, 1, 20, 0.5),
      b: k("Geometr\xEDa", "Ancho viga b (m)", 0.25, 0.1, 1, 0.05),
      h: k("Geometr\xEDa", "Alto viga h (m)", 0.4, 0.1, 1.5, 0.05),
      fc: k("Material", "f'c hormig\xF3n (kg/cm\xB2)", 240, 140, 420, 10),
      ks: k("Winkler", "ks suelo (kN/m\xB3)", 2e4, 1e3, 2e5, 1e3),
      N: k("Discretizaci\xF3n", "N\xBA elementos FEM N", 16, 2, 64, 2),
      bcType: J("Apoyo", "Condiciones de borde", 0, {
        "Simply supported (w=0 ambos extremos)": 0,
        "Fixed-Free (cantilever)": 1,
        "Fixed-Fixed": 2,
        "Free-Free (libre-libre)": 3
      })
    },
    computedLabels(e, o) {
      var _a, _b;
      const c = e.fc * 0.0981, s = C(c), a = e.b * e.h, d = e.b * e.h ** 3 / 12, m = s * d, r = N * a, f = e.ks * e.b, h = Math.sqrt(f / r) / (2 * Math.PI), l = {
        "EI (kN\xB7m\xB2)": m.toExponential(3),
        "A (m\xB2)": a.toFixed(4),
        "\u03C1A (ton/m)": r.toFixed(4),
        "k_winkler dist (kN/m\xB2)": f.toFixed(0),
        "f_cutoff medio (Hz)": h.toFixed(2)
      };
      if (Math.round(e.bcType ?? 0) === 0) {
        l["\u2500\u2500 Modos anal\xEDticos (SS) \u2500\u2500"] = "";
        for (let n = 1; n <= 4; n++) {
          const u = Math.sqrt((n * Math.PI / e.L) ** 4 * m / r + f / r) / (2 * Math.PI);
          l[`f_${n} anal\xEDtico`] = u.toFixed(2) + " Hz";
        }
      }
      const i = (_a = o.modalOutputs) == null ? void 0 : _a.rawVal;
      if ((_b = i == null ? void 0 : i.frequencies) == null ? void 0 : _b.length) {
        l["\u2500\u2500 Modos FEM (Hekatan) \u2500\u2500"] = "";
        for (let n = 0; n < Math.min(4, i.frequencies.length); n++) l[`f_${n + 1} FEM`] = i.frequencies[n].toFixed(2) + " Hz";
      }
      return l;
    },
    build(e, o) {
      var _a, _b;
      const c = e.L, s = Math.max(2, Math.round(e.N)), a = c / s, d = e.fc * 0.0981, m = C(d), r = 0.2, f = m / (2 * (1 + r)), g = e.b * e.h, h = e.b * e.h ** 3 / 12, l = 0.21 * Math.pow(Math.min(e.b, e.h), 3) * Math.max(e.b, e.h), M = [];
      for (let t = 0; t <= s; t++) M.push([
        t * a,
        0,
        0
      ]);
      const i = [];
      for (let t = 0; t < s; t++) i.push([
        t,
        t + 1
      ]);
      const n = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
      for (let t = 0; t < s; t++) n.set(t, m), w.set(t, f), u.set(t, g), p.set(t, h), F.set(t, h), E.set(t, l), L.set(t, N), y.set(t, r);
      const b = /* @__PURE__ */ new Map(), G = Math.round(e.bcType ?? 0);
      (_b = (_a = {
        0: () => {
          b.set(0, [
            true,
            true,
            true,
            true,
            false,
            false
          ]), b.set(s, [
            false,
            true,
            true,
            true,
            false,
            false
          ]);
        },
        1: () => {
          b.set(0, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        },
        2: () => {
          b.set(0, [
            true,
            true,
            true,
            true,
            true,
            true
          ]), b.set(s, [
            true,
            true,
            true,
            true,
            true,
            true
          ]);
        },
        3: () => {
          b.set(0, [
            false,
            false,
            false,
            false,
            false,
            false
          ]);
        }
      })[G]) == null ? void 0 : _b.call(_a);
      const A = /* @__PURE__ */ new Map(), H = Math.floor(s / 2);
      A.set(H, [
        0,
        0,
        -1,
        0,
        0,
        0
      ]);
      const R = e.ks * e.b, P = [];
      for (let t = 0; t <= s; t++) {
        const I = t === 0 || t === s ? a / 2 : a, v = R * I;
        P.push({
          node: t,
          dof: 2,
          k: v
        });
      }
      o.nodes.val = M, o.elements.val = i;
      const $ = {
        supports: b,
        loads: A
      }, O = {
        elasticities: n,
        shearModuli: w,
        areas: u,
        momentsOfInertiaY: p,
        momentsOfInertiaZ: F,
        torsionalConstants: E,
        densities: L,
        poissonsRatios: y
      };
      o.nodeInputs.val = $, o.elementInputs.val = O;
      try {
        o.deformOutputs.val = B(M, i, $, O, P);
      } catch (t) {
        console.warn("[Viga Winkler] deform error:", t);
      }
      const _ = [], j = new q({
        color: 6333946,
        linewidth: 2
      });
      for (let t = 0; t <= s; t++) {
        const I = [
          new x(t * a, 0, 0),
          new x(t * a, 0, -0.3)
        ], v = new T().setFromPoints(I);
        _.push(new z(v, j));
      }
      const V = [];
      for (let t = 0; t <= s; t++) V.push(new x(t * a, 0, -0.3));
      const S = new z(new T().setFromPoints(V), new q({
        color: 1096065,
        linewidth: 3
      }));
      _.push(S), o.objects3D.val = _;
    },
    runModal(e, o, c) {
      var _a, _b, _c;
      const s = o.nodes.val, a = o.elements.val, d = o.nodeInputs.val, m = o.elementInputs.val;
      if (!(!s.length || !a.length || !((_a = m.densities) == null ? void 0 : _a.size))) try {
        const r = Math.round(e.N), f = Math.min(10, Math.max(4, r)), g = W(s, a, d, m, f), h = e.ks * e.b, l = e.b * e.h, M = N * l, i = h / M, n = g.frequencies.map((u) => {
          const p = 2 * Math.PI * u;
          return Math.sqrt(p * p + i) / (2 * Math.PI);
        }), w = {
          ...g,
          frequencies: n
        };
        o.modalOutputs = o.modalOutputs ?? {
          rawVal: void 0
        }, o.modalOutputs.rawVal = w, c.render(w, {
          title: `Viga ${e.L}m \xD7 ${e.b}\xD7${e.h}m sobre Winkler ks=${e.ks} kN/m\xB3 (N=${r} elementos)`,
          properties: [
            `EI = ${((_c = (_b = g.EI) == null ? void 0 : _b.toExponential) == null ? void 0 : _c.call(_b, 3)) ?? "\u2014"} kN\xB7m\xB2`,
            `\u03C1A = ${M.toFixed(3)} ton/m`,
            `k_winkler distribuido = ${h.toFixed(0)} kN/m\xB2`,
            `f_cutoff = ${(Math.sqrt(i) / (2 * Math.PI)).toFixed(2)} Hz`,
            "Frecuencias mostradas = \u221A(\u03C9_viga\xB2 + \u03C9_medio\xB2)/(2\u03C0) [combinado por superposici\xF3n cuadr\xE1tica]"
          ]
        }), console.log(`[Viga Winkler] N=${r}, BC=${e.bcType}, modos:`, n.slice(0, 4).map((u) => u.toFixed(2) + " Hz").join(", "));
      } catch (r) {
        console.warn("Modal viga error:", (r == null ? void 0 : r.message) ?? r);
      }
    }
  };
});
export {
  __tla,
  U as v
};
