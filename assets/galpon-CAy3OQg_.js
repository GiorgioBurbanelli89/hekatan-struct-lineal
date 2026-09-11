import { a as ne } from "./analyze-DgLgRmKg.js";
import { m as oe, d as se, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { p as ae, F as re, n as le, s as J, e as ce, f as ie } from "./paramsSeccion-Bn-RQEWN.js";
import { t as ue } from "./cadSections-DVtTZU6U.js";
let Me;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let z, F, T, me, he, pe, i;
  z = 2e8;
  F = 0.3;
  T = z / (2 * (1 + F));
  me = 78;
  he = 9.81;
  pe = me / he;
  i = (n, s, u, h, m, p) => ({
    default: u,
    min: h,
    max: m,
    step: p,
    label: s,
    folder: n
  });
  Me = {
    id: "galpon",
    name: "Galp\xF3n (nave industrial)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "membraneXX",
      "membraneYY",
      "vonMises"
    ],
    hasModal: true,
    params: {
      span: i("Geometr\xEDa", "Luz (m)", 12, 6, 30, 0.5),
      length: i("Geometr\xEDa", "Largo (m)", 20, 6, 60, 1),
      height: i("Geometr\xEDa", "Altura columna (m)", 6, 3, 15, 0.5),
      archRise: i("Geometr\xEDa", "Flecha arco (m)", 3, 0.5, 8, 0.25),
      xDiv: i("Geometr\xEDa", "Div. X (arco)", 8, 4, 20, 1),
      yDiv: i("Geometr\xEDa", "Div. Y (longitud)", 4, 2, 12, 1),
      ...ae("Secciones", {
        forma: re["Tubo rectangular"],
        h: 150,
        b: 150,
        t: 6,
        tf: 7.4,
        tw: 5
      }),
      CM: i("Cargas", "CM por nodo (kN)", -1, -10, 0, 0.1),
      cubierta: {
        default: 1,
        boolean: true,
        label: "Cubierta (membrana)",
        folder: "Cubierta"
      },
      tCub: i("Cubierta", "Espesor cubierta (mm)", 6, 1, 25, 1),
      qCub: i("Cubierta", "Carga cubierta (kN/m\xB2)", -0.15, -3, 0, 0.05)
    },
    build(n, s) {
      const u = n.span, h = n.length, m = n.height, p = n.archRise, M = Math.round(n.xDiv), c = Math.round(n.yDiv), j = (e) => m + p * (1 - Math.pow(2 * e / u - 1, 2)), b = c + 1, a = [], r = [];
      for (let e = 0; e < b; e++) {
        const t = [], o = h / c * e;
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
        for (let f = 1; f < M; f++) {
          const C = u / M * f;
          t.push(a.length), a.push([
            C,
            o,
            j(C)
          ]);
        }
        t.push(a.length), a.push([
          u,
          o,
          m
        ]), r.push(t);
      }
      const l = [];
      for (let e = 0; e < b; e++) {
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
      for (let e = 0; e < c; e++) for (let t = 2; t < r[0].length; t++) l.push([
        r[e][t],
        r[e + 1][t]
      ]);
      for (let e = 0; e < c; e++) for (let t = 2; t < r[0].length - 1; t += 2) l.push([
        r[e][t],
        r[e + 1][t + 1]
      ]);
      const L = n.cubierta > 0.5, Q = n.tCub / 1e3, O = l.length, Y = [];
      if (L) for (let e = 0; e < c; e++) for (let t = 2; t < r[0].length - 1; t++) {
        const o = [
          r[e][t],
          r[e][t + 1],
          r[e + 1][t + 1],
          r[e + 1][t]
        ];
        Y.push(o), l.push(o);
      }
      const V = (e) => {
        const t = a[e[0]], o = a[e[1]], f = a[e[2]], C = a[e[3]], E = (d, x, A) => {
          const g = [
            x[0] - d[0],
            x[1] - d[1],
            x[2] - d[2]
          ], v = [
            A[0] - d[0],
            A[1] - d[1],
            A[2] - d[2]
          ], W = g[1] * v[2] - g[2] * v[1], ee = g[2] * v[0] - g[0] * v[2], te = g[0] * v[1] - g[1] * v[0];
          return 0.5 * Math.hypot(W, ee, te);
        };
        return E(t, o, f) + E(t, f, C);
      }, y = /* @__PURE__ */ new Map();
      for (let e = 0; e < b; e++) y.set(r[e][0], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), y.set(r[e][1], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const w = /* @__PURE__ */ new Map(), $ = (e, t) => {
        const o = w.get(e) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        o[2] += t, w.set(e, o);
      };
      if (n.CM !== 0) for (let e = 0; e < b; e++) for (let t = 2; t < r[e].length; t++) $(r[e][t], n.CM);
      if (L && n.qCub !== 0) for (const e of Y) {
        const t = n.qCub * V(e) / 4;
        for (const o of e) $(o, t);
      }
      const I = J(n), B = I.A, { moiZ: H, moiY: K } = ue(I), D = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), U = ie(n), q = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      for (let e = 0; e < O; e++) D.set(e, z), G.set(e, T), R.set(e, F), S.set(e, pe), P.set(e, B), k.set(e, H), N.set(e, K), _.set(e, I.J), q.set(e, U);
      for (let e = O; e < l.length; e++) D.set(e, z), G.set(e, T), R.set(e, F), X.set(e, Q), S.set(e, 0);
      s.nodes.val = a, s.elements.val = l, s.nodeInputs.val = {
        supports: y,
        loads: w
      }, s.elementInputs.val = {
        elasticities: D,
        shearModuli: G,
        areas: P,
        momentsOfInertiaY: N,
        momentsOfInertiaZ: k,
        torsionalConstants: _,
        densities: S,
        poissonsRatios: R,
        sectionShapes: q,
        thicknesses: X
      };
      const Z = se(a, l, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = Z, s.analyzeOutputs.val = ne(a, l, s.elementInputs.val, Z), s.objects3D.val = [];
    },
    computedLabels: (n) => ce(n),
    runModal(n, s, u) {
      var _a, _b;
      const h = s.nodes.val, m = s.elements.val, p = s.nodeInputs.val, M = s.elementInputs.val;
      if (!(!h.length || !m.length || !((_a = p.supports) == null ? void 0 : _a.size) || !((_b = M.densities) == null ? void 0 : _b.size))) try {
        const c = oe(h, m, p, M, 12);
        u.render(c, {
          title: `Galp\xF3n L=${n.span}m largo=${n.length}m`,
          properties: [
            `Altura ${n.height}m + arco ${n.archRise}m  \xB7  ${le(n)}  \xB7  A=${(J(n).A * 1e4).toFixed(1)} cm\xB2  acero`
          ]
        });
      } catch (c) {
        console.warn("Modal galp\xF3n error:", c.message);
      }
    }
  };
});
export {
  __tla,
  Me as g
};
