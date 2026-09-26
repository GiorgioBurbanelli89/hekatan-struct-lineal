import { a as ae, __tla as __tla_0 } from "./analyze-ZiWUXQRU.js";
import { m as re, d as ie, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { p as le, F as ce, n as ue, s as Q, e as me, f as pe } from "./paramsSeccion-C710IYP5.js";
import { e as he } from "./cadSections-BcRFaG1j.js";
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
  let R, X, V, de, fe, ge, c;
  R = 2e8;
  X = 0.3;
  V = R / (2 * (1 + X));
  de = 78;
  fe = 9.81;
  ge = de / fe;
  c = (n, o, u, p, m, h) => ({
    default: u,
    min: p,
    max: m,
    step: h,
    label: o,
    folder: n
  });
  Ce = {
    id: "galpon",
    name: "Galp\xF3n (nave industrial)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "none",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    params: {
      span: c("Geometr\xEDa", "Luz (m)", 12, 6, 30, 0.5),
      length: c("Geometr\xEDa", "Largo (m)", 20, 6, 60, 1),
      height: c("Geometr\xEDa", "Altura columna (m)", 6, 3, 15, 0.5),
      archRise: c("Geometr\xEDa", "Flecha arco (m)", 3, 0.5, 8, 0.25),
      xDiv: c("Geometr\xEDa", "Div. X (arco)", 8, 4, 20, 1),
      yDiv: c("Geometr\xEDa", "Div. Y (longitud)", 4, 2, 12, 1),
      ...le("Secciones", {
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
    build(n, o) {
      const u = n.span, p = n.length, m = n.height, h = n.archRise, b = Math.round(n.xDiv), l = Math.round(n.yDiv), B = (e) => m + h * (1 - Math.pow(2 * e / u - 1, 2)), v = l + 1, a = [], r = [];
      for (let e = 0; e < v; e++) {
        const t = [], s = p / l * e;
        t.push(a.length), a.push([
          0,
          s,
          0
        ]), t.push(a.length), a.push([
          u,
          s,
          0
        ]), t.push(a.length), a.push([
          0,
          s,
          m
        ]);
        for (let d = 1; d < b; d++) {
          const w = u / b * d;
          t.push(a.length), a.push([
            w,
            s,
            B(w)
          ]);
        }
        t.push(a.length), a.push([
          u,
          s,
          m
        ]), r.push(t);
      }
      const i = [];
      for (let e = 0; e < v; e++) {
        const t = r[e];
        i.push([
          t[0],
          t[2]
        ]), i.push([
          t[1],
          t[t.length - 1]
        ]);
        for (let s = 2; s < t.length - 1; s++) i.push([
          t[s],
          t[s + 1]
        ]);
      }
      for (let e = 0; e < l; e++) for (let t = 2; t < r[0].length; t++) i.push([
        r[e][t],
        r[e + 1][t]
      ]);
      for (let e = 0; e < l; e++) for (let t = 2; t < r[0].length - 1; t += 2) i.push([
        r[e][t],
        r[e + 1][t + 1]
      ]);
      const A = n.cubierta > 0.5, H = n.tCub / 1e3, z = i.length, F = [];
      if (A) for (let e = 0; e < l; e++) for (let t = 2; t < r[0].length - 1; t++) {
        const s = [
          r[e][t],
          r[e][t + 1],
          r[e + 1][t + 1],
          r[e + 1][t]
        ];
        F.push(s), i.push(s);
      }
      const K = (e) => {
        const t = a[e[0]], s = a[e[1]], d = a[e[2]], w = a[e[3]], j = (f, G, P) => {
          const g = [
            G[0] - f[0],
            G[1] - f[1],
            G[2] - f[2]
          ], M = [
            P[0] - f[0],
            P[1] - f[1],
            P[2] - f[2]
          ], ne = g[1] * M[2] - g[2] * M[1], se = g[2] * M[0] - g[0] * M[2], oe = g[0] * M[1] - g[1] * M[0];
          return 0.5 * Math.hypot(ne, se, oe);
        };
        return j(t, s, d) + j(t, d, w);
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
      const y = /* @__PURE__ */ new Map(), O = (e, t) => {
        const s = y.get(e) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        s[2] += t, y.set(e, s);
      };
      if (n.CM !== 0) for (let e = 0; e < v; e++) for (let t = 2; t < r[e].length; t++) O(r[e][t], n.CM);
      if (A && n.qCub !== 0) for (const e of F) {
        const t = n.qCub * K(e) / 4;
        for (const s of e) O(s, t);
      }
      const I = Q(n), U = I.A, { moiZ: W, moiY: ee } = he(I), x = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), te = pe(n), Z = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
      for (let e = 0; e < z; e++) x.set(e, R), S.set(e, V), D.set(e, X), Y.set(e, ge), $.set(e, U), L.set(e, W), k.set(e, ee), N.set(e, I.J), Z.set(e, te);
      const E = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
      for (let e = z; e < i.length; e++) x.set(e, R), S.set(e, V), D.set(e, X), _.set(e, H), Y.set(e, 0), q.set(e, 2), E.set(e, 1), J.set(e, 0);
      o.nodes.val = a, o.elements.val = i, o.nodeInputs.val = {
        supports: C,
        loads: y
      }, o.elementInputs.val = {
        elasticities: x,
        shearModuli: S,
        areas: $,
        momentsOfInertiaY: k,
        momentsOfInertiaZ: L,
        torsionalConstants: N,
        densities: Y,
        poissonsRatios: D,
        sectionShapes: Z,
        thicknesses: _,
        plateFormulations: q,
        membraneModifiers: E,
        bendingModifiers: J
      };
      const T = ie(a, i, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = T, o.analyzeOutputs.val = ae(a, i, o.elementInputs.val, T), o.objects3D.val = [];
    },
    computedLabels: (n) => me(n),
    runModal(n, o, u) {
      var _a, _b;
      const p = o.nodes.val, m = o.elements.val, h = o.nodeInputs.val, b = o.elementInputs.val;
      if (!(!p.length || !m.length || !((_a = h.supports) == null ? void 0 : _a.size) || !((_b = b.densities) == null ? void 0 : _b.size))) try {
        const l = re(p, m, h, b, 12);
        u.render(l, {
          title: `Galp\xF3n L=${n.span}m largo=${n.length}m`,
          properties: [
            `Altura ${n.height}m + arco ${n.archRise}m  \xB7  ${ue(n)}  \xB7  A=${(Q(n).A * 1e4).toFixed(1)} cm\xB2  acero`
          ]
        });
      } catch (l) {
        console.warn("Modal galp\xF3n error:", l.message);
      }
    }
  };
});
export {
  __tla,
  Ce as g
};
