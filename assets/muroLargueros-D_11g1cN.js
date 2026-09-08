import { a as T } from "./analyze-DgLgRmKg.js";
import { d as X, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let J;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  J = {
    id: "muro-largueros",
    name: "\u{1F9F1} Muro cortante con huecos \u2014 modelo de largueros",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultFrameResult: "contour:normals",
    params: {
      L: {
        default: 12,
        min: 4,
        max: 30,
        step: 0.5,
        label: "ancho del muro (m)",
        folder: "\u{1F4D0} Geometr\xEDa"
      },
      H: {
        default: 9,
        min: 3,
        max: 24,
        step: 0.5,
        label: "alto del muro (m)",
        folder: "\u{1F4D0} Geometr\xEDa"
      },
      nx: {
        default: 8,
        min: 3,
        max: 16,
        step: 1,
        label: "columnas de paneles",
        folder: "\u{1F4D0} Geometr\xEDa"
      },
      ny: {
        default: 3,
        min: 2,
        max: 8,
        step: 1,
        label: "filas de paneles",
        folder: "\u{1F4D0} Geometr\xEDa"
      },
      t: {
        default: 0.2,
        min: 0.08,
        max: 0.6,
        step: 0.01,
        label: "espesor (m)",
        folder: "\u{1F4D0} Geometr\xEDa"
      },
      h1c: {
        default: 1,
        min: 0,
        max: 15,
        step: 1,
        label: "ventana \xB7 columna",
        folder: "\u{1F573} Huecos"
      },
      h1a: {
        default: 2,
        min: 1,
        max: 8,
        step: 1,
        label: "ventana \xB7 ancho (celdas)",
        folder: "\u{1F573} Huecos"
      },
      h1f: {
        default: 1,
        min: 0,
        max: 7,
        step: 1,
        label: "ventana \xB7 fila",
        folder: "\u{1F573} Huecos"
      },
      h1h: {
        default: 1,
        min: 1,
        max: 6,
        step: 1,
        label: "ventana \xB7 alto (celdas)",
        folder: "\u{1F573} Huecos"
      },
      h2c: {
        default: 5,
        min: 0,
        max: 15,
        step: 1,
        label: "puerta \xB7 columna",
        folder: "\u{1F573} Huecos"
      },
      h2a: {
        default: 2,
        min: 1,
        max: 8,
        step: 1,
        label: "puerta \xB7 ancho (celdas)",
        folder: "\u{1F573} Huecos"
      },
      h2h: {
        default: 2,
        min: 1,
        max: 7,
        step: 1,
        label: "puerta \xB7 alto (celdas)",
        folder: "\u{1F573} Huecos"
      },
      q: {
        default: 20,
        min: 0,
        max: 200,
        step: 5,
        label: "vertical arriba (kN/m)",
        folder: "\u2B07 Cargas"
      },
      qExt: {
        default: 80,
        min: 0,
        max: 300,
        step: 5,
        label: "  extra en el tramo derecho (kN/m)",
        folder: "\u2B07 Cargas"
      },
      Ph: {
        default: 20,
        min: -200,
        max: 200,
        step: 5,
        label: "horizontal en la cabeza (kN)",
        folder: "\u2B07 Cargas"
      },
      E: {
        default: 25e6,
        min: 1e6,
        max: 4e7,
        step: 1e6,
        label: "E del hormig\xF3n (kN/m\xB2)",
        folder: "\u{1F9F1} Material"
      },
      Al: {
        default: 60,
        min: 5,
        max: 400,
        step: 5,
        label: "\xE1rea del larguero (cm\xB2)",
        folder: "\u{1F9F1} Material"
      }
    },
    computedLabels(a, m) {
      var _a, _b, _c;
      const o = ((_a = m.elements) == null ? void 0 : _a.val) ?? [], l = o.filter((c) => c.length === 2).length, d = (_c = (_b = m.deformOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c.deformations;
      let u = 0;
      for (const [, c] of d ?? []) Math.abs(c[0]) > Math.abs(u) && (u = c[0]);
      return {
        "largueros \xB7 paneles": `${l} \xB7 ${o.length - l}`,
        "corrimiento de cabeza": `${(u * 1e3).toFixed(2)} mm`,
        "qu\xE9 mide el color": "el AXIL de cada barra: rojo tracci\xF3n, azul compresi\xF3n"
      };
    },
    build(a, m) {
      const o = Math.round(a.nx), l = Math.round(a.ny), d = a.L / o, u = a.H / l, c = [], s = [];
      for (let e = 0; e <= l; e++) {
        s[e] = [];
        for (let t = 0; t <= o; t++) s[e][t] = c.length, c.push([
          t * d,
          0,
          e * u
        ]);
      }
      const f = (e, t, n) => Math.max(t, Math.min(n, Math.round(e))), k = [
        {
          c0: f(a.h1c, 0, o - 1),
          c1: f(a.h1c + a.h1a, 1, o),
          f0: f(a.h1f, 0, l - 1),
          f1: f(a.h1f + a.h1h, 1, l)
        },
        {
          c0: f(a.h2c, 0, o - 1),
          c1: f(a.h2c + a.h2a, 1, o),
          f0: 0,
          f1: f(a.h2h, 1, l)
        }
      ], O = (e, t) => k.some((n) => e >= n.c0 && e < n.c1 && t >= n.f0 && t < n.f1), i = [], F = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), H = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), y = 0.2, z = a.E / (2 * (1 + y)), h = [];
      for (let e = 0; e < l; e++) {
        h[e] = [];
        for (let t = 0; t < o; t++) h[e][t] = !O(t, e);
      }
      const C = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), S = a.Al * 1e-4, $ = /* @__PURE__ */ new Set(), M = (e, t, n = S, p = false) => {
        const r = i.length;
        i.push([
          e,
          t
        ]), H.set(r, a.E), j.set(r, z), I.set(r, y), L.set(r, 0), C.set(r, n), p && $.add(r), x.set(r, n * n / 12 * 1e-6);
      }, B = Math.hypot(d, u), E = z * a.t * B ** 3 / (2 * a.E * d * u);
      for (let e = 0; e < l; e++) for (let t = 0; t < o; t++) h[e][t] && (M(s[e][t], s[e + 1][t + 1], E, true), M(s[e][t + 1], s[e + 1][t], E, true));
      const G = (e, t, n, p) => {
        for (let r = Math.max(0, t - 1); r <= Math.min(l - 1, p); r++) for (let w = Math.max(0, e - 1); w <= Math.min(o - 1, n); w++) if (h[r][w]) return true;
        return false;
      };
      for (let e = 0; e <= l; e++) for (let t = 0; t < o; t++) G(t, e, t + 1, e) && M(s[e][t], s[e][t + 1]);
      for (let e = 0; e <= o; e++) for (let t = 0; t < l; t++) G(e, t, e, t + 1) && M(s[t][e], s[t + 1][e]);
      const b = /* @__PURE__ */ new Map();
      for (let e = 0; e < c.length; e++) b.set(e, [
        false,
        true,
        false,
        true,
        true,
        true
      ]);
      for (let e = 0; e <= o; e++) (e > 0 && h[0][e - 1] || e < o && h[0][e]) && b.set(s[0][e], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const q = /* @__PURE__ */ new Set();
      for (const e of i) for (const t of e) q.add(t);
      for (let e = 0; e < c.length; e++) q.has(e) || b.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const g = /* @__PURE__ */ new Map(), A = (e, t) => {
        const n = g.get(e) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        g.set(e, n.map((p, r) => p + t[r]));
      };
      for (let e = 0; e <= o; e++) {
        const t = (e === 0 || e === o ? 0.5 : 1) * d, n = a.q + (e >= o - Math.max(1, Math.round(o / 4)) ? a.qExt : 0);
        A(s[l][e], [
          0,
          0,
          -n * t,
          0,
          0,
          0
        ]);
      }
      a.Ph && A(s[l][0], [
        a.Ph,
        0,
        0,
        0,
        0,
        0
      ]);
      const v = {
        elasticities: H,
        shearModuli: j,
        poissonsRatios: I,
        densities: L,
        areas: C,
        momentsOfInertiaY: x,
        momentsOfInertiaZ: x,
        torsionalConstants: x,
        momentReleases: R,
        thicknesses: F,
        plateFormulations: D,
        shellModifiers: N
      };
      m.nodes.val = c, m.elements.val = i, m.nodeInputs.val = {
        supports: b,
        loads: g
      }, m.elementInputs.val = v, m.objects3D.val = [];
      const P = X(c, i, m.nodeInputs.val, v);
      m.deformOutputs.val = P, m.analyzeOutputs.val = T(c, i, v, P);
    }
  };
});
export {
  __tla,
  J as m
};
