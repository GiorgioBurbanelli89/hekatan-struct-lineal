import { a as ae, __tla as __tla_0 } from "./analyze-BXBBJMWG.js";
import { m as re, d as le, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { p as ie, F as ce, n as ue, s as Q, e as me, f as he } from "./paramsSeccion-aois6PNE.js";
import { t as pe } from "./cadSections-CEHEfdGW.js";
let Ce;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  let z, F, V, fe, de, ge, c;
  z = 2e8;
  F = 0.3;
  V = z / (2 * (1 + F));
  fe = 78;
  de = 9.81;
  ge = fe / de;
  c = (n, s, u, h, m, p) => ({
    default: u,
    min: h,
    max: m,
    step: p,
    label: s,
    folder: n
  });
  Ce = {
    id: "galpon",
    name: "Galp\xF3n (nave industrial)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "membraneXX",
      "membraneYY",
      "vonMises"
    ],
    hasModal: true,
    params: {
      span: c("Geometr\xEDa", "Luz (m)", 12, 6, 30, 0.5),
      length: c("Geometr\xEDa", "Largo (m)", 20, 6, 60, 1),
      height: c("Geometr\xEDa", "Altura columna (m)", 6, 3, 15, 0.5),
      archRise: c("Geometr\xEDa", "Flecha arco (m)", 3, 0.5, 8, 0.25),
      xDiv: c("Geometr\xEDa", "Div. X (arco)", 8, 4, 20, 1),
      yDiv: c("Geometr\xEDa", "Div. Y (longitud)", 4, 2, 12, 1),
      ...ie("Secciones", {
        forma: ce["Tubo rectangular"],
        h: 150,
        b: 150,
        t: 6,
        tf: 7.4,
        tw: 5
      }),
      CM: c("Cargas", "CM por nodo (kN)", -1, -10, 0, 0.1),
      cubierta: {
        default: 1,
        boolean: true,
        label: "Cubierta (membrana)",
        folder: "Cubierta"
      },
      tCub: c("Cubierta", "Espesor cubierta (mm)", 6, 1, 25, 1),
      qCub: c("Cubierta", "Carga cubierta (kN/m\xB2)", -0.15, -3, 0, 0.05)
    },
    build(n, s) {
      const u = n.span, h = n.length, m = n.height, p = n.archRise, b = Math.round(n.xDiv), i = Math.round(n.yDiv), B = (e) => m + p * (1 - Math.pow(2 * e / u - 1, 2)), v = i + 1, a = [], r = [];
      for (let e = 0; e < v; e++) {
        const t = [], o = h / i * e;
        t.push(a.length), a.push([
          0,
          o,
          0
        ]), t.push(a.length), a.push([
          u,
          o,
          0
        ]), t.push(a.length), a.push([
          0,
          o,
          m
        ]);
        for (let f = 1; f < b; f++) {
          const w = u / b * f;
          t.push(a.length), a.push([
            w,
            o,
            B(w)
          ]);
        }
        t.push(a.length), a.push([
          u,
          o,
          m
        ]), r.push(t);
      }
      const l = [];
      for (let e = 0; e < v; e++) {
        const t = r[e];
        l.push([
          t[0],
          t[2]
        ]), l.push([
          t[1],
          t[t.length - 1]
        ]);
        for (let o = 2; o < t.length - 1; o++) l.push([
          t[o],
          t[o + 1]
        ]);
      }
      for (let e = 0; e < i; e++) for (let t = 2; t < r[0].length; t++) l.push([
        r[e][t],
        r[e + 1][t]
      ]);
      for (let e = 0; e < i; e++) for (let t = 2; t < r[0].length - 1; t += 2) l.push([
        r[e][t],
        r[e + 1][t + 1]
      ]);
      const O = n.cubierta > 0.5, H = n.tCub / 1e3, Y = l.length, $ = [];
      if (O) for (let e = 0; e < i; e++) for (let t = 2; t < r[0].length - 1; t++) {
        const o = [
          r[e][t],
          r[e][t + 1],
          r[e + 1][t + 1],
          r[e + 1][t]
        ];
        $.push(o), l.push(o);
      }
      const K = (e) => {
        const t = a[e[0]], o = a[e[1]], f = a[e[2]], w = a[e[3]], j = (d, S, A) => {
          const g = [
            S[0] - d[0],
            S[1] - d[1],
            S[2] - d[2]
          ], M = [
            A[0] - d[0],
            A[1] - d[1],
            A[2] - d[2]
          ], ne = g[1] * M[2] - g[2] * M[1], oe = g[2] * M[0] - g[0] * M[2], se = g[0] * M[1] - g[1] * M[0];
          return 0.5 * Math.hypot(ne, oe, se);
        };
        return j(t, o, f) + j(t, f, w);
      }, C = /* @__PURE__ */ new Map();
      for (let e = 0; e < v; e++) C.set(r[e][0], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), C.set(r[e][1], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const y = /* @__PURE__ */ new Map(), L = (e, t) => {
        const o = y.get(e) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        o[2] += t, y.set(e, o);
      };
      if (n.CM !== 0) for (let e = 0; e < v; e++) for (let t = 2; t < r[e].length; t++) L(r[e][t], n.CM);
      if (O && n.qCub !== 0) for (const e of $) {
        const t = n.qCub * K(e) / 4;
        for (const o of e) L(o, t);
      }
      const I = Q(n), U = I.A, { moiZ: W, moiY: ee } = pe(I), D = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), te = he(n), q = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      for (let e = 0; e < Y; e++) D.set(e, z), G.set(e, V), R.set(e, F), x.set(e, ge), P.set(e, U), k.set(e, W), N.set(e, ee), _.set(e, I.J), q.set(e, te);
      const Z = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
      for (let e = Y; e < l.length; e++) D.set(e, z), G.set(e, V), R.set(e, F), E.set(e, H), x.set(e, 0), X.set(e, 2), Z.set(e, 1), J.set(e, 0);
      s.nodes.val = a, s.elements.val = l, s.nodeInputs.val = {
        supports: C,
        loads: y
      }, s.elementInputs.val = {
        elasticities: D,
        shearModuli: G,
        areas: P,
        momentsOfInertiaY: N,
        momentsOfInertiaZ: k,
        torsionalConstants: _,
        densities: x,
        poissonsRatios: R,
        sectionShapes: q,
        thicknesses: E,
        plateFormulations: X,
        membraneModifiers: Z,
        bendingModifiers: J
      };
      const T = le(a, l, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = T, s.analyzeOutputs.val = ae(a, l, s.elementInputs.val, T), s.objects3D.val = [];
    },
    computedLabels: (n) => me(n),
    runModal(n, s, u) {
      var _a, _b;
      const h = s.nodes.val, m = s.elements.val, p = s.nodeInputs.val, b = s.elementInputs.val;
      if (!(!h.length || !m.length || !((_a = p.supports) == null ? void 0 : _a.size) || !((_b = b.densities) == null ? void 0 : _b.size))) try {
        const i = re(h, m, p, b, 12);
        u.render(i, {
          title: `Galp\xF3n L=${n.span}m largo=${n.length}m`,
          properties: [
            `Altura ${n.height}m + arco ${n.archRise}m  \xB7  ${ue(n)}  \xB7  A=${(Q(n).A * 1e4).toFixed(1)} cm\xB2  acero`
          ]
        });
      } catch (i) {
        console.warn("Modal galp\xF3n error:", i.message);
      }
    }
  };
});
export {
  __tla,
  Ce as g
};
