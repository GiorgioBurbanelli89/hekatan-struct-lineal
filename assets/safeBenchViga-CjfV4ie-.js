import { c as V, E as A, L as G, b as J } from "./Text-C1TX4d8g.js";
import { a as pe, __tla as __tla_0 } from "./analyze-DtswgObf.js";
import { d as ue, __tla as __tla_1 } from "./didacticCpp-ClOTguHC.js";
let xe;
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
  const te = 9.80665;
  function fe(t, a, i, c, f, l, o = 9127187) {
    const b = Math.abs(a - t), d = new V(b, f, l), _ = new A(d), w = new G(_, new J({
      color: o,
      linewidth: 2
    }));
    return w.position.set((t + a) / 2, i, c + l / 2), [
      w
    ];
  }
  function he(t, a, i, c, f, l = 4620980) {
    const o = new V(f, f, c), b = new A(o), d = new G(b, new J({
      color: l,
      linewidth: 2
    }));
    return d.position.set(t, a, i + c / 2), [
      d
    ];
  }
  function be(t, a, i, c = 16747520) {
    const f = new V(t, a, i), l = new A(f), o = new G(l, new J({
      color: c,
      linewidth: 2
    }));
    return o.position.set(t / 2, a / 2, i / 2), [
      o
    ];
  }
  xe = {
    id: "safe-bench-viga-cimentacion",
    name: "Viga de Cimentaci\xF3n \xB7 Zapata corrida + Viga + Pedestales",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "pressure",
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
    build(t, a) {
      const i = t.Lz, c = t.Bz, f = t.t_zap, l = t.b_viga, o = t.h_viga, b = t.h_ped, d = t.b_ped, _ = t.ks_tonfm3 * te, w = t.P_tonf * te, R = Math.round(t.nCols), z = Math.round(t.nx), k = Math.round(t.ny), m = z + 1, y = k + 1, L = i / z, Y = c / k, D = c / 2, q = Math.round(k / 2), P = [];
      for (let e = 1; e <= R; ++e) {
        const n = e * i / (R + 1);
        P.push([
          n,
          D
        ]);
      }
      const h = [];
      for (let e = 0; e < y; ++e) for (let n = 0; n < m; ++n) h.push([
        n * L,
        e * Y,
        0
      ]);
      const se = (e, n) => {
        let s = -1, r = 1 / 0;
        for (let u = 0; u < m * y; ++u) {
          const g = (h[u][0] - e) ** 2 + (h[u][1] - n) ** 2;
          g < r && (r = g, s = u);
        }
        return s;
      }, ae = o + b, oe = P.map(([e, n]) => se(e, n)), F = P.map(([e, n]) => (h.push([
        e,
        n,
        ae
      ]), h.length - 1)), p = [], H = 0;
      for (let e = 0; e < k; ++e) for (let n = 0; n < z; ++n) {
        const s = e * m + n;
        p.push([
          s,
          s + 1,
          s + m + 1,
          s + m
        ]);
      }
      const X = p.length;
      for (let e = 0; e < z; ++e) {
        const n = q * m + e, s = q * m + (e + 1);
        p.push([
          n,
          s
        ]);
      }
      const K = p.length;
      oe.forEach((e, n) => p.push([
        e,
        F[n]
      ]));
      const v = [];
      for (let e = 0; e < y; ++e) for (let n = 0; n < m; ++n) {
        const s = n === 0 || n === m - 1, r = e === 0 || e === y - 1, u = s && r ? 0.25 : s || r ? 0.5 : 1, g = L * Y * u, x = e * m + n;
        if (v.push({
          node: x,
          dof: 2,
          k: _ * g
        }), s && r) {
          const M = 1e-6 * _ * L * Y;
          v.push({
            node: x,
            dof: 3,
            k: M
          }), v.push({
            node: x,
            dof: 4,
            k: M
          });
        }
      }
      const Q = /* @__PURE__ */ new Map();
      F.forEach((e) => Q.set(e, [
        0,
        0,
        -w,
        0,
        0,
        0
      ]));
      const I = 24855e3, S = 0.2, U = I / (2 * (1 + S)), le = l * o, ie = l * o ** 3 / 12, re = o * l ** 3 / 12, ce = 0.28 * l * o ** 3, de = d * d, $ = d ** 4 / 12, me = 0.141 * d ** 4, j = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map();
      for (let e = H; e < X; ++e) j.set(e, I), B.set(e, S), ee.set(e, f);
      for (let e = X; e < K; ++e) j.set(e, I), B.set(e, S), E.set(e, le), N.set(e, ie), O.set(e, re), W.set(e, U), Z.set(e, ce);
      for (let e = K; e < p.length; ++e) j.set(e, I), B.set(e, S), E.set(e, de), N.set(e, $), O.set(e, $), W.set(e, U), Z.set(e, me);
      const ne = {
        supports: /* @__PURE__ */ new Map(),
        loads: Q,
        springs: v
      }, T = {
        elasticities: j,
        poissonsRatios: B,
        thicknesses: ee,
        areas: E,
        momentsOfInertiaZ: O,
        momentsOfInertiaY: N,
        shearModuli: W,
        torsionalConstants: Z
      };
      a.nodes.val = h, a.elements.val = p, a.nodeInputs.val = ne, a.elementInputs.val = T;
      try {
        const e = ue(h, p, ne, T, v);
        a.deformOutputs.val = e;
        const n = pe(h, p, T, e), s = /* @__PURE__ */ new Map();
        for (let r = H; r < X; ++r) {
          const u = p[r];
          if (u.length !== 4) continue;
          const g = u.map((x) => {
            var _a;
            const M = (_a = e.deformations) == null ? void 0 : _a.get(x);
            return M ? _ * M[2] : 0;
          });
          s.set(r, g);
        }
        n.pressure = s, a.analyzeOutputs.val = n;
      } catch (e) {
        console.error("safe-bench-viga solver error:", e);
      }
      const C = [];
      C.push(...be(i, c, f)), C.push(...fe(0, i, D, 0, l, o));
      for (const [e, n] of P) C.push(...he(e, n, 0, o + b, d));
      a.objects3D.val = C;
    }
  };
});
export {
  __tla,
  xe as s
};
