import { b as A, E as G, L as J, a as R } from "./theme-U-6D_qyI.js";
import { a as me } from "./analyze-CRH7D0Bs.js";
import { d as ue, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let we;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const ne = 9.80665;
  function fe(n, o, i, r, f, l, a = 9127187) {
    const g = Math.abs(o - n), d = new A(g, f, l), _ = new G(d), M = new J(_, new R({
      color: a,
      linewidth: 2
    }));
    return M.position.set((n + o) / 2, i, r + l / 2), [
      M
    ];
  }
  function he(n, o, i, r, f, l = 4620980) {
    const a = new A(f, f, r), g = new G(a), d = new J(g, new R({
      color: l,
      linewidth: 2
    }));
    return d.position.set(n, o, i + r / 2), [
      d
    ];
  }
  function ge(n, o, i, r = 16747520) {
    const f = new A(n, o, i), l = new G(f), a = new J(l, new R({
      color: r,
      linewidth: 2
    }));
    return a.position.set(n / 2, o / 2, i / 2), [
      a
    ];
  }
  we = {
    id: "safe-bench-viga-cimentacion",
    name: "Viga de Cimentaci\xF3n \xB7 Zapata corrida + Viga + Pedestales",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "vonMises",
      "displacementZ"
    ],
    hasModal: false,
    guide: [
      "Modelo estructural compuesto t\xEDpico de cimentaci\xF3n corrida:",
      " \u2022 Zapata corrida \u2192 shell Q4 sobre Winkler springs (Lz \xD7 Bz \xD7 t_zap)",
      " \u2022 Viga de cimentaci\xF3n \u2192 frame longitudinal a lo largo del eje central (b_viga \xD7 h_viga)",
      " \u2022 Pedestales \u2192 frames verticales cortos debajo del contrapiso (b_ped \xD7 h_ped)",
      "Las cargas P bajan por los pedestales \u2192 viga \u2192 distribuidas a la zapata v\xEDa Winkler."
    ],
    params: {
      Lz: {
        default: 8,
        min: 4,
        max: 20,
        step: 0.5,
        label: "Lz longitudinal (m)"
      },
      Bz: {
        default: 1,
        min: 0.5,
        max: 3,
        step: 0.25,
        label: "Bz ancho zapata (m)"
      },
      t_zap: {
        default: 0.4,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "t_zap espesor (m)"
      },
      b_viga: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "b_viga ancho (m)"
      },
      h_viga: {
        default: 0.5,
        min: 0.3,
        max: 1,
        step: 0.05,
        label: "h_viga canto (m)"
      },
      h_ped: {
        default: 0.5,
        min: 0.2,
        max: 1.5,
        step: 0.05,
        label: "Hp pedestal (m)"
      },
      b_ped: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "lado pedestal (m)"
      },
      ks_tonfm3: {
        default: 2e3,
        min: 500,
        max: 1e4,
        step: 100,
        label: "ks (tonf/m\xB3)"
      },
      P_tonf: {
        default: 20,
        min: 1,
        max: 100,
        step: 1,
        label: "P por col (tonf)"
      },
      nCols: {
        default: 4,
        min: 2,
        max: 8,
        step: 1,
        label: "N pedestales"
      },
      nx: {
        default: 32,
        min: 8,
        max: 64,
        step: 4,
        label: "nx mesh (longitudinal)"
      },
      ny: {
        default: 4,
        min: 2,
        max: 10,
        step: 1,
        label: "ny mesh (transversal)"
      }
    },
    build(n, o) {
      const i = n.Lz, r = n.Bz, f = n.t_zap, l = n.b_viga, a = n.h_viga, g = n.h_ped, d = n.b_ped, _ = n.ks_tonfm3 * ne, M = n.P_tonf * ne, X = Math.round(n.nCols), z = Math.round(n.nx), k = Math.round(n.ny), p = z + 1, y = k + 1, E = i / z, N = r / k, D = r / 2, q = Math.round(k / 2), I = [];
      for (let e = 1; e <= X; ++e) {
        const t = e * i / (X + 1);
        I.push([
          t,
          D
        ]);
      }
      const h = [];
      for (let e = 0; e < y; ++e) for (let t = 0; t < p; ++t) h.push([
        t * E,
        e * N,
        0
      ]);
      const se = (e, t) => {
        let s = -1, c = 1 / 0;
        for (let u = 0; u < p * y; ++u) {
          const b = (h[u][0] - e) ** 2 + (h[u][1] - t) ** 2;
          b < c && (c = b, s = u);
        }
        return s;
      }, oe = a + g, ae = I.map(([e, t]) => se(e, t)), F = I.map(([e, t]) => (h.push([
        e,
        t,
        oe
      ]), h.length - 1)), m = [], H = 0;
      for (let e = 0; e < k; ++e) for (let t = 0; t < z; ++t) {
        const s = e * p + t;
        m.push([
          s,
          s + 1,
          s + p + 1,
          s + p
        ]);
      }
      const S = m.length;
      for (let e = 0; e < z; ++e) {
        const t = q * p + e, s = q * p + (e + 1);
        m.push([
          t,
          s
        ]);
      }
      const K = m.length;
      ae.forEach((e, t) => m.push([
        e,
        F[t]
      ]));
      const v = [];
      for (let e = 0; e < y; ++e) for (let t = 0; t < p; ++t) {
        const s = t === 0 || t === p - 1, c = e === 0 || e === y - 1, u = s && c ? 0.25 : s || c ? 0.5 : 1, b = E * N * u, w = e * p + t;
        if (v.push({
          node: w,
          dof: 2,
          k: _ * b
        }), s && c) {
          const x = 1e-6 * _ * E * N;
          v.push({
            node: w,
            dof: 3,
            k: x
          }), v.push({
            node: w,
            dof: 4,
            k: x
          });
        }
      }
      const Q = /* @__PURE__ */ new Map();
      F.forEach((e) => Q.set(e, [
        0,
        0,
        -M,
        0,
        0,
        0
      ]));
      const P = 24855e3, j = 0.2, U = P / (2 * (1 + j)), le = l * a, ie = l * a ** 3 / 12, ce = a * l ** 3 / 12, re = 0.28 * l * a ** 3, de = d * d, $ = d ** 4 / 12, pe = 0.141 * d ** 4, B = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map();
      for (let e = H; e < S; ++e) B.set(e, P), C.set(e, j), ee.set(e, f);
      for (let e = S; e < K; ++e) B.set(e, P), C.set(e, j), O.set(e, le), W.set(e, ie), Z.set(e, ce), T.set(e, U), V.set(e, re);
      for (let e = K; e < m.length; ++e) B.set(e, P), C.set(e, j), O.set(e, de), W.set(e, $), Z.set(e, $), T.set(e, U), V.set(e, pe);
      const te = {
        supports: /* @__PURE__ */ new Map(),
        loads: Q,
        springs: v
      }, Y = {
        elasticities: B,
        poissonsRatios: C,
        thicknesses: ee,
        areas: O,
        momentsOfInertiaZ: Z,
        momentsOfInertiaY: W,
        shearModuli: T,
        torsionalConstants: V
      };
      o.nodes.val = h, o.elements.val = m, o.nodeInputs.val = te, o.elementInputs.val = Y;
      try {
        const e = ue(h, m, te, Y, v);
        o.deformOutputs.val = e;
        const t = me(h, m, Y, e), s = /* @__PURE__ */ new Map();
        for (let c = H; c < S; ++c) {
          const u = m[c];
          if (u.length !== 4) continue;
          const b = u.map((w) => {
            var _a;
            const x = (_a = e.deformations) == null ? void 0 : _a.get(w);
            return x ? _ * x[2] : 0;
          });
          s.set(c, b);
        }
        t.pressure = s, o.analyzeOutputs.val = t;
      } catch (e) {
        console.error("safe-bench-viga solver error:", e);
      }
      const L = [];
      L.push(...ge(i, r, f)), L.push(...fe(0, i, D, 0, l, a));
      for (const [e, t] of I) L.push(...he(e, t, 0, a + g, d));
      o.objects3D.val = L;
    }
  };
});
export {
  __tla,
  we as s
};
