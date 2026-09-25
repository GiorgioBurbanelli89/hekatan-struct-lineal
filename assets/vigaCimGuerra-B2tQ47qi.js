import { c as O, E as R, L as T, b as W } from "./Text-C1TX4d8g.js";
import { a as fe, __tla as __tla_0 } from "./analyze-CC0LMJ9d.js";
import { d as ue, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let _e;
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
  const q = 9.80665;
  function pe(t, o, m, l, i, r, a = 9127187) {
    const b = Math.abs(o - t), d = new O(b, i, r), h = new R(d), x = new T(h, new W({
      color: a,
      linewidth: 2
    }));
    return x.position.set((t + o) / 2, m, l + r / 2), [
      x
    ];
  }
  function Me(t, o, m, l, i, r = 4620980) {
    const a = new O(i, i, l), b = new R(a), d = new T(b, new W({
      color: r,
      linewidth: 2
    }));
    return d.position.set(t, o, m + l / 2), [
      d
    ];
  }
  function xe(t, o, m, l = 16747520) {
    const i = new O(t, o, m), r = new R(i), a = new T(r, new W({
      color: l,
      linewidth: 2
    }));
    return a.position.set(t / 2, o / 2, m / 2), [
      a
    ];
  }
  _e = {
    id: "viga-cim-guerra-ej7",
    name: "Ej.7 \xB7 Viga Cimentaci\xF3n (L=17.20m, 4 cols c/M)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
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
      "Ejercicio 7 \u2014 Ing. Marcelo Guerra Avenda\xF1o MDI (Figura 190)",
      "Viga de cimentaci\xF3n L = 17.20 m, 4 columnas 60\xD760cm con CM+CV y momentos.",
      "Cargas totales por columna (P, M):",
      "  Col 1: P=127.50 t, M= 4.50 t\xB7m   Col 2: P=187.50 t, M= 6.75 t\xB7m",
      "  Col 3: P=210.00 t, M=-9.00 t\xB7m   Col 4: P=128.00 t, M=-4.50 t\xB7m",
      "Materiales: f'c=240 kg/cm\xB2 (E\u224823 GPa) \xB7 q_adm=18 t/m\xB2 \u2192 ks\u22482160 t/m\xB3 (Bowles 120\xB7q_adm)",
      "Modelo: zapata corrida (shell+Winkler) + viga (frame) + pedestales (frames). \u03A3P=653 t."
    ],
    params: {
      L: {
        default: 17.2,
        min: 10,
        max: 25,
        step: 0.2,
        label: "L viga (m)"
      },
      Bz: {
        default: 2,
        min: 0.8,
        max: 3.5,
        step: 0.1,
        label: "B ancho zapata (m)"
      },
      t_zap: {
        default: 0.4,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "t_zap espesor (m)"
      },
      b_viga: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "b_viga ancho (m)"
      },
      h_viga: {
        default: 0.8,
        min: 0.4,
        max: 1.5,
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
        default: 0.6,
        min: 0.4,
        max: 0.8,
        step: 0.05,
        label: "b_ped columna (m)"
      },
      x1: {
        default: 3.44,
        min: 0.5,
        max: 8,
        step: 0.1,
        label: "x col 1 (m)",
        folder: "Posiciones"
      },
      x2: {
        default: 6.88,
        min: 0.5,
        max: 12,
        step: 0.1,
        label: "x col 2 (m)",
        folder: "Posiciones"
      },
      x3: {
        default: 10.32,
        min: 0.5,
        max: 16,
        step: 0.1,
        label: "x col 3 (m)",
        folder: "Posiciones"
      },
      x4: {
        default: 13.76,
        min: 0.5,
        max: 17,
        step: 0.1,
        label: "x col 4 (m)",
        folder: "Posiciones"
      },
      P1: {
        default: 127.5,
        min: 0,
        max: 500,
        step: 1,
        label: "P1 (tonf)",
        folder: "Cargas axiales (D+L)"
      },
      P2: {
        default: 187.5,
        min: 0,
        max: 500,
        step: 1,
        label: "P2 (tonf)",
        folder: "Cargas axiales (D+L)"
      },
      P3: {
        default: 210,
        min: 0,
        max: 500,
        step: 1,
        label: "P3 (tonf)",
        folder: "Cargas axiales (D+L)"
      },
      P4: {
        default: 128,
        min: 0,
        max: 500,
        step: 1,
        label: "P4 (tonf)",
        folder: "Cargas axiales (D+L)"
      },
      M1: {
        default: 4.5,
        min: -30,
        max: 30,
        step: 0.1,
        label: "M1 (tonf\xB7m)",
        folder: "Momentos (D+L)"
      },
      M2: {
        default: 6.75,
        min: -30,
        max: 30,
        step: 0.1,
        label: "M2 (tonf\xB7m)",
        folder: "Momentos (D+L)"
      },
      M3: {
        default: -9,
        min: -30,
        max: 30,
        step: 0.1,
        label: "M3 (tonf\xB7m)",
        folder: "Momentos (D+L)"
      },
      M4: {
        default: -4.5,
        min: -30,
        max: 30,
        step: 0.1,
        label: "M4 (tonf\xB7m)",
        folder: "Momentos (D+L)"
      },
      ks_tonfm3: {
        default: 2160,
        min: 500,
        max: 1e4,
        step: 100,
        label: "ks (tonf/m\xB3)",
        folder: "Suelo"
      },
      q_adm: {
        default: 18,
        min: 5,
        max: 50,
        step: 0.5,
        label: "q_adm (tonf/m\xB2)",
        folder: "Suelo"
      },
      nx: {
        default: 48,
        min: 16,
        max: 96,
        step: 4,
        label: "nx mesh (long)",
        folder: "Mesh"
      },
      ny: {
        default: 6,
        min: 4,
        max: 12,
        step: 2,
        label: "ny mesh (transv)",
        folder: "Mesh"
      }
    },
    computedLabels(t) {
      const o = t.P1 + t.P2 + t.P3 + t.P4, m = t.M1 + t.M2 + t.M3 + t.M4, l = t.L * t.Bz, i = o / l;
      return {
        "\u03A3P (tonf)": o.toFixed(1),
        "\u03A3M (tonf\xB7m)": m.toFixed(2),
        "\xC1rea zapata (m\xB2)": l.toFixed(2),
        "q_med = \u03A3P/A (tonf/m\xB2)": i.toFixed(2),
        "ratio q_med/q_adm": (i / t.q_adm).toFixed(3)
      };
    },
    build(t, o) {
      const m = t.L, l = t.Bz, i = t.t_zap, r = t.b_viga, a = t.h_viga, b = t.h_ped, d = t.b_ped, h = t.ks_tonfm3 * q, x = Math.round(t.nx), L = Math.round(t.ny), f = x + 1, C = L + 1, D = m / x, E = l / L, _ = l / 2, J = Math.round(L / 2), j = [
        [
          t.x1,
          _
        ],
        [
          t.x2,
          _
        ],
        [
          t.x3,
          _
        ],
        [
          t.x4,
          _
        ]
      ], te = [
        t.P1,
        t.P2,
        t.P3,
        t.P4
      ].map((e) => e * q), ne = [
        t.M1,
        t.M2,
        t.M3,
        t.M4
      ].map((e) => e * q), M = [];
      for (let e = 0; e < C; ++e) for (let n = 0; n < f; ++n) M.push([
        n * D,
        e * E,
        0
      ]);
      const oe = (e, n) => {
        let s = -1, c = 1 / 0;
        for (let p = 0; p < f * C; ++p) {
          const g = (M[p][0] - e) ** 2 + (M[p][1] - n) ** 2;
          g < c && (c = g, s = p);
        }
        return s;
      }, se = a + b, ae = j.map(([e, n]) => oe(e, n)), V = j.map(([e, n]) => (M.push([
        e,
        n,
        se
      ]), M.length - 1)), u = [], Z = 0;
      for (let e = 0; e < L; ++e) for (let n = 0; n < x; ++n) {
        const s = e * f + n;
        u.push([
          s,
          s + 1,
          s + f + 1,
          s + f
        ]);
      }
      const B = u.length;
      for (let e = 0; e < x; ++e) {
        const n = J * f + e, s = J * f + (e + 1);
        u.push([
          n,
          s
        ]);
      }
      const H = u.length;
      ae.forEach((e, n) => u.push([
        e,
        V[n]
      ]));
      const P = [];
      for (let e = 0; e < C; ++e) for (let n = 0; n < f; ++n) {
        const s = n === 0 || n === f - 1, c = e === 0 || e === C - 1, p = s && c ? 0.25 : s || c ? 0.5 : 1, g = D * E * p, v = e * f + n;
        if (P.push({
          node: v,
          dof: 2,
          k: h * g
        }), s && c) {
          const w = 1e-6 * h * D * E;
          P.push({
            node: v,
            dof: 3,
            k: w
          }), P.push({
            node: v,
            dof: 4,
            k: w
          });
        }
      }
      const K = /* @__PURE__ */ new Map();
      V.forEach((e, n) => {
        K.set(e, [
          0,
          0,
          -te[n],
          0,
          ne[n],
          0
        ]);
      });
      const y = 228e5, I = 0.2, Q = y / (2 * (1 + I)), le = r * a, me = r * a ** 3 / 12, ie = a * r ** 3 / 12, re = 0.28 * r * a ** 3, ce = d * d, U = d ** 4 / 12, de = 0.141 * d ** 4, k = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
      for (let e = Z; e < B; ++e) k.set(e, y), z.set(e, I), $.set(e, i);
      for (let e = B; e < H; ++e) k.set(e, y), z.set(e, I), Y.set(e, le), X.set(e, me), F.set(e, ie), N.set(e, Q), A.set(e, re);
      for (let e = H; e < u.length; ++e) k.set(e, y), z.set(e, I), Y.set(e, ce), X.set(e, U), F.set(e, U), N.set(e, Q), A.set(e, de);
      const ee = {
        supports: /* @__PURE__ */ new Map(),
        loads: K,
        springs: P
      }, G = {
        elasticities: k,
        poissonsRatios: z,
        thicknesses: $,
        areas: Y,
        momentsOfInertiaZ: F,
        momentsOfInertiaY: X,
        shearModuli: N,
        torsionalConstants: A
      };
      o.nodes.val = M, o.elements.val = u, o.nodeInputs.val = ee, o.elementInputs.val = G;
      try {
        const e = ue(M, u, ee, G, P);
        o.deformOutputs.val = e;
        const n = fe(M, u, G, e), s = /* @__PURE__ */ new Map();
        for (let c = Z; c < B; ++c) {
          const p = u[c];
          if (p.length !== 4) continue;
          const g = p.map((v) => {
            var _a;
            const w = (_a = e.deformations) == null ? void 0 : _a.get(v);
            return w ? h * w[2] : 0;
          });
          s.set(c, g);
        }
        n.pressure = s, n.colorMapRanges = {
          pressure: [
            -t.q_adm * q,
            0
          ]
        }, o.analyzeOutputs.val = n;
      } catch (e) {
        console.error("viga-cim-guerra solver error:", e);
      }
      const S = [];
      S.push(...xe(m, l, i)), S.push(...pe(0, m, _, 0, r, a));
      for (const [e, n] of j) S.push(...Me(e, n, 0, a + b, d));
      o.objects3D.val = S;
    }
  };
});
export {
  __tla,
  _e as v
};
