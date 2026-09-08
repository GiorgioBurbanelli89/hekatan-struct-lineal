import { a as V } from "./analyze-CRH7D0Bs.js";
import { m as O, d as X, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { c as Z } from "./espectroNec-CMQq_yyp.js";
let K;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let A, C, P, D, J, i;
  A = 9.81;
  C = 249e5;
  P = 0.2;
  D = C / (2 * (1 + P));
  J = 24 / A;
  i = (o, s, u, d, v, a) => ({
    default: u,
    min: d,
    max: v,
    step: a,
    label: s,
    folder: o
  });
  K = {
    id: "edificio-frame-nec",
    name: "Edificio p\xF3rtico \xB7 carga lateral NEC",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    defaultShellResult: "none",
    availableShellResults: [],
    hasModal: true,
    params: {
      pisos: i("Geometr\xEDa", "N\xB0 pisos", 5, 1, 15, 1),
      vanosX: i("Geometr\xEDa", "Vanos X", 3, 1, 6, 1),
      vanosY: i("Geometr\xEDa", "Vanos Y", 2, 1, 6, 1),
      Lx: i("Geometr\xEDa", "Luz X (m)", 5, 3, 8, 0.5),
      Ly: i("Geometr\xEDa", "Luz Y (m)", 5, 3, 8, 0.5),
      he: i("Geometr\xEDa", "Entrepiso (m)", 3, 2.5, 4, 0.1),
      colB: i("Secciones", "b columna (m)", 0.45, 0.25, 0.9, 0.05),
      colH: i("Secciones", "h columna (m)", 0.45, 0.25, 0.9, 0.05),
      vigaB: i("Secciones", "b viga (m)", 0.3, 0.2, 0.6, 0.05),
      vigaH: i("Secciones", "h viga (m)", 0.5, 0.3, 0.9, 0.05),
      Z: i("Sismo NEC", "Factor Z (g)", 0.4, 0.1, 0.5, 0.05),
      R: i("Sismo NEC", "R", 8, 1, 8, 0.5),
      wPiso: i("Sismo NEC", "Peso/piso W (kN)", 1500, 200, 5e3, 50)
    },
    build(o, s) {
      const u = Math.round(o.pisos), d = Math.round(o.vanosX), v = Math.round(o.vanosY), a = d + 1, l = v + 1, c = u + 1, r = (e, t, n) => n * (a * l) + t * a + e, h = [];
      for (let e = 0; e < c; e++) for (let t = 0; t < l; t++) for (let n = 0; n < a; n++) h.push([
        n * o.Lx,
        t * o.Ly,
        e * o.he
      ]);
      const m = [], H = /* @__PURE__ */ new Set();
      for (let e = 0; e < l; e++) for (let t = 0; t < a; t++) for (let n = 0; n < c - 1; n++) H.add(m.length), m.push([
        r(t, e, n),
        r(t, e, n + 1)
      ]);
      for (let e = 1; e < c; e++) {
        for (let t = 0; t < l; t++) for (let n = 0; n < a - 1; n++) m.push([
          r(n, t, e),
          r(n + 1, t, e)
        ]);
        for (let t = 0; t < a; t++) for (let n = 0; n < l - 1; n++) m.push([
          r(t, n, e),
          r(t, n + 1, e)
        ]);
      }
      const x = /* @__PURE__ */ new Map();
      for (let e = 0; e < l; e++) for (let t = 0; t < a; t++) x.set(r(t, e, 0), [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const f = Z({
        norma: "NEC15",
        Z: o.Z,
        suelo: "D",
        region: "Costa",
        R: o.R,
        I: 1,
        phiP: 1,
        phiE: 1,
        N: u,
        he: o.he,
        wPiso: o.wPiso,
        tipoTa: "Hormig\xF3n sin muros"
      }), S = a * l, y = /* @__PURE__ */ new Map();
      for (let e = 1; e < c; e++) {
        const t = f.pisos[e - 1].Fx / S, n = -o.wPiso / S;
        for (let I = 0; I < l; I++) for (let B = 0; B < a; B++) y.set(r(B, I, e), [
          t,
          0,
          n,
          0,
          0,
          0
        ]);
      }
      const F = o.colB * o.colH, R = o.colB * o.colH ** 3 / 12, j = o.colH * o.colB ** 3 / 12, k = 0.14 * Math.pow(Math.min(o.colB, o.colH), 4), L = o.vigaB * o.vigaH, T = o.vigaB * o.vigaH ** 3 / 12, Y = o.vigaH * o.vigaB ** 3 / 12, b = 0.21 * Math.pow(Math.min(o.vigaB, o.vigaH), 3) * Math.max(o.vigaB, o.vigaH), E = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
      for (let e = 0; e < m.length; e++) E.set(e, C), G.set(e, D), $.set(e, P), N.set(e, J), H.has(e) ? (g.set(e, F), M.set(e, R), p.set(e, j), w.set(e, k)) : (g.set(e, L), M.set(e, Y), p.set(e, T), w.set(e, b));
      s.nodes.val = h, s.elements.val = m, s.nodeInputs.val = {
        supports: x,
        loads: y
      }, s.elementInputs.val = {
        elasticities: E,
        shearModuli: G,
        areas: g,
        momentsOfInertiaY: M,
        momentsOfInertiaZ: p,
        torsionalConstants: w,
        densities: N,
        poissonsRatios: $
      };
      const z = X(h, m, s.nodeInputs.val, s.elementInputs.val);
      s.deformOutputs.val = z, s.analyzeOutputs.val = V(h, m, s.elementInputs.val, z), s.objects3D.val = [], console.log(`[Test M \xB7 edificio-frame-nec] V=${f.V.toFixed(1)} kN  W=${f.W} kN  Ta=${f.Ta.toFixed(3)}s  Sa(Ta)=${f.SaTa.toFixed(3)}g`);
    },
    runModal(o, s, u) {
      var _a;
      const { nodes: d, elements: v } = {
        nodes: s.nodes.val,
        elements: s.elements.val
      }, a = s.nodeInputs.val, l = s.elementInputs.val;
      if (!(!d.length || !((_a = l.densities) == null ? void 0 : _a.size))) try {
        const c = O(d, v, a, l, 12);
        u.render(c, {
          title: `Edificio p\xF3rtico ${Math.round(o.pisos)} pisos`,
          properties: [
            `Vanos ${Math.round(o.vanosX)}\xD7${Math.round(o.vanosY)}  \xB7  col ${o.colB}\xD7${o.colH}  viga ${o.vigaB}\xD7${o.vigaH}`
          ]
        });
      } catch (c) {
        console.warn("Modal edificio-frame-nec error:", c.message);
      }
    }
  };
});
export {
  __tla,
  K as e
};
