import { a as J } from "./analyze-CRH7D0Bs.js";
import { m as T, d as j, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { p as k, F as q, n as E, s as O, e as P, f as V } from "./paramsSeccion-Bn-RQEWN.js";
import { t as X } from "./cadSections-DVtTZU6U.js";
let ne;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let $, z, B, H, K, Q, h;
  $ = 2e8;
  z = 0.3;
  B = $ / (2 * (1 + z));
  H = 78;
  K = 9.81;
  Q = H / K;
  h = (n, o, i, m, c, p) => ({
    default: i,
    min: m,
    max: c,
    step: p,
    label: o,
    folder: n
  });
  ne = {
    id: "galpon",
    name: "Galp\xF3n (nave industrial)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      span: h("Geometr\xEDa", "Luz (m)", 12, 6, 30, 0.5),
      length: h("Geometr\xEDa", "Largo (m)", 20, 6, 60, 1),
      height: h("Geometr\xEDa", "Altura columna (m)", 6, 3, 15, 0.5),
      archRise: h("Geometr\xEDa", "Flecha arco (m)", 3, 0.5, 8, 0.25),
      xDiv: h("Geometr\xEDa", "Div. X (arco)", 8, 4, 20, 1),
      yDiv: h("Geometr\xEDa", "Div. Y (longitud)", 4, 2, 12, 1),
      ...k("Secciones", {
        forma: q["Tubo rectangular"],
        h: 150,
        b: 150,
        t: 6,
        tf: 7.4,
        tw: 5
      }),
      CM: h("Cargas", "CM por nodo (kN)", -1, -10, 0, 0.1)
    },
    build(n, o) {
      const i = n.span, m = n.length, c = n.height, p = n.archRise, d = Math.round(n.xDiv), u = Math.round(n.yDiv), F = (e) => c + p * (1 - Math.pow(2 * e / i - 1, 2)), g = u + 1, s = [], a = [];
      for (let e = 0; e < g; e++) {
        const t = [], r = m / u * e;
        t.push(s.length), s.push([
          0,
          r,
          0
        ]), t.push(s.length), s.push([
          i,
          r,
          0
        ]), t.push(s.length), s.push([
          0,
          r,
          c
        ]);
        for (let M = 1; M < d; M++) {
          const L = i / d * M;
          t.push(s.length), s.push([
            L,
            r,
            F(L)
          ]);
        }
        t.push(s.length), s.push([
          i,
          r,
          c
        ]), a.push(t);
      }
      const l = [];
      for (let e = 0; e < g; e++) {
        const t = a[e];
        l.push([
          t[0],
          t[2]
        ]), l.push([
          t[1],
          t[t.length - 1]
        ]);
        for (let r = 2; r < t.length - 1; r++) l.push([
          t[r],
          t[r + 1]
        ]);
      }
      for (let e = 0; e < u; e++) for (let t = 2; t < a[0].length; t++) l.push([
        a[e][t],
        a[e + 1][t]
      ]);
      for (let e = 0; e < u; e++) for (let t = 2; t < a[0].length - 1; t += 2) l.push([
        a[e][t],
        a[e + 1][t + 1]
      ]);
      const f = /* @__PURE__ */ new Map();
      for (let e = 0; e < g; e++) f.set(a[e][0], [
        true,
        true,
        true,
        true,
        true,
        true
      ]), f.set(a[e][1], [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const w = /* @__PURE__ */ new Map();
      if (n.CM !== 0) for (let e = 0; e < g; e++) for (let t = 2; t < a[e].length; t++) w.set(a[e][t], [
        0,
        0,
        n.CM,
        0,
        0,
        0
      ]);
      const v = O(n), Y = v.A, { moiZ: _, moiY: N } = X(v), y = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), Z = V(n), b = /* @__PURE__ */ new Map();
      for (let e = 0; e < l.length; e++) y.set(e, $), I.set(e, B), C.set(e, z), A.set(e, Q), D.set(e, Y), G.set(e, _), S.set(e, N), R.set(e, v.J), b.set(e, Z);
      o.nodes.val = s, o.elements.val = l, o.nodeInputs.val = {
        supports: f,
        loads: w
      }, o.elementInputs.val = {
        elasticities: y,
        shearModuli: I,
        areas: D,
        momentsOfInertiaY: S,
        momentsOfInertiaZ: G,
        torsionalConstants: R,
        densities: A,
        poissonsRatios: C,
        sectionShapes: b
      };
      const x = j(s, l, o.nodeInputs.val, o.elementInputs.val);
      o.deformOutputs.val = x, o.analyzeOutputs.val = J(s, l, o.elementInputs.val, x), o.objects3D.val = [];
    },
    computedLabels: (n) => P(n),
    runModal(n, o, i) {
      var _a, _b;
      const m = o.nodes.val, c = o.elements.val, p = o.nodeInputs.val, d = o.elementInputs.val;
      if (!(!m.length || !c.length || !((_a = p.supports) == null ? void 0 : _a.size) || !((_b = d.densities) == null ? void 0 : _b.size))) try {
        const u = T(m, c, p, d, 12);
        i.render(u, {
          title: `Galp\xF3n L=${n.span}m largo=${n.length}m`,
          properties: [
            `Altura ${n.height}m + arco ${n.archRise}m  \xB7  ${E(n)}  \xB7  A=${(O(n).A * 1e4).toFixed(1)} cm\xB2  acero`
          ]
        });
      } catch (u) {
        console.warn("Modal galp\xF3n error:", u.message);
      }
    }
  };
});
export {
  __tla,
  ne as g
};
