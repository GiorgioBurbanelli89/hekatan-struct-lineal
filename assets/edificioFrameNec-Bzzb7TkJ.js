import { a as X } from "./analyze-DgLgRmKg.js";
import { m as Z, d as A, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { s as P, c as J } from "./cargasPorCaso-B_GZ_-rO.js";
import { c as W } from "./espectroNec-CMQq_yyp.js";
let se;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let _, F, R, q, K, i;
  _ = 9.81;
  F = 249e5;
  R = 0.2;
  q = F / (2 * (1 + R));
  K = 24 / _;
  i = (o, t, u, d, v, a) => ({
    default: u,
    min: d,
    max: v,
    step: a,
    label: t,
    folder: o
  });
  se = {
    id: "edificio-frame-nec",
    name: "Edificio p\xF3rtico \xB7 carga lateral NEC",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
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
    build(o, t) {
      const u = Math.round(o.pisos), d = Math.round(o.vanosX), v = Math.round(o.vanosY), a = d + 1, l = v + 1, c = u + 1, r = (e, s, n) => n * (a * l) + s * a + e, h = [];
      for (let e = 0; e < c; e++) for (let s = 0; s < l; s++) for (let n = 0; n < a; n++) h.push([
        n * o.Lx,
        s * o.Ly,
        e * o.he
      ]);
      const m = [], B = /* @__PURE__ */ new Set();
      for (let e = 0; e < l; e++) for (let s = 0; s < a; s++) for (let n = 0; n < c - 1; n++) B.add(m.length), m.push([
        r(s, e, n),
        r(s, e, n + 1)
      ]);
      for (let e = 1; e < c; e++) {
        for (let s = 0; s < l; s++) for (let n = 0; n < a - 1; n++) m.push([
          r(n, s, e),
          r(n + 1, s, e)
        ]);
        for (let s = 0; s < a; s++) for (let n = 0; n < l - 1; n++) m.push([
          r(s, n, e),
          r(s, n + 1, e)
        ]);
      }
      const E = /* @__PURE__ */ new Map();
      for (let e = 0; e < l; e++) for (let s = 0; s < a; s++) E.set(r(s, e, 0), [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const f = W({
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
      }), H = a * l, S = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map();
      for (let e = 1; e < c; e++) {
        const s = f.pisos[e - 1].Fx / H, n = -o.wPiso / H;
        for (let g = 0; g < l; g++) for (let M = 0; M < a; M++) P(S, r(M, g, e), [
          0,
          0,
          n,
          0,
          0,
          0
        ]), P(y, r(M, g, e), [
          s,
          0,
          0,
          0,
          0,
          0
        ]);
      }
      const b = J({
        Dead: S,
        Ex: y
      }), j = o.colB * o.colH, k = o.colB * o.colH ** 3 / 12, L = o.colH * o.colB ** 3 / 12, T = 0.14 * Math.pow(Math.min(o.colB, o.colH), 4), Y = o.vigaB * o.vigaH, D = o.vigaB * o.vigaH ** 3 / 12, V = o.vigaH * o.vigaB ** 3 / 12, O = 0.21 * Math.pow(Math.min(o.vigaB, o.vigaH), 3) * Math.max(o.vigaB, o.vigaH), C = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map();
      for (let e = 0; e < m.length; e++) C.set(e, F), G.set(e, q), $.set(e, R), N.set(e, K), B.has(e) ? (p.set(e, j), w.set(e, k), I.set(e, L), x.set(e, T)) : (p.set(e, Y), w.set(e, V), I.set(e, D), x.set(e, O));
      t.nodes.val = h, t.elements.val = m, t.nodeInputs.val = {
        supports: E,
        loads: b
      }, t.elementInputs.val = {
        elasticities: C,
        shearModuli: G,
        areas: p,
        momentsOfInertiaY: w,
        momentsOfInertiaZ: I,
        torsionalConstants: x,
        densities: N,
        poissonsRatios: $
      };
      const z = A(h, m, t.nodeInputs.val, t.elementInputs.val);
      t.deformOutputs.val = z, t.analyzeOutputs.val = X(h, m, t.elementInputs.val, z), t.objects3D.val = [], console.log(`[Test M \xB7 edificio-frame-nec] V=${f.V.toFixed(1)} kN  W=${f.W} kN  Ta=${f.Ta.toFixed(3)}s  Sa(Ta)=${f.SaTa.toFixed(3)}g`);
    },
    runModal(o, t, u) {
      var _a;
      const { nodes: d, elements: v } = {
        nodes: t.nodes.val,
        elements: t.elements.val
      }, a = t.nodeInputs.val, l = t.elementInputs.val;
      if (!(!d.length || !((_a = l.densities) == null ? void 0 : _a.size))) try {
        const c = Z(d, v, a, l, 12);
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
  se as e
};
