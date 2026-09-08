import { a as G, b as O, L as B, E as R } from "./theme-U-6D_qyI.js";
import { a as te } from "./analyze-CRH7D0Bs.js";
import { d as ae, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let me;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const q = 9.80665;
  function oe(t, a, s, o, n, l = 16747520) {
    const m = [], f = new G({
      color: l,
      linewidth: 2
    }), c = new O(t, a, s), u = new B(new R(c), f);
    u.position.set(t / 2, a / 2, s / 2), m.push(u);
    const p = new O(t, o, n), r = new B(new R(p), new G({
      color: 9127187,
      linewidth: 2
    }));
    return r.position.set(t / 2, a / 2, s + n / 2), m.push(r), m;
  }
  function ne(t, a, s, o, n, l = 4620980) {
    const m = new O(n, n, o), f = new R(m), c = new B(f, new G({
      color: l,
      linewidth: 2
    }));
    return c.position.set(t, a, s + o / 2), [
      c
    ];
  }
  function Y(t, a, s, o) {
    const n = t * a, l = s * o, m = n + l, f = a / 2, c = a + o / 2, u = (n * f + l * c) / m, p = t * a ** 3 / 12, r = s * o ** 3 / 12, M = p + n * (u - f) ** 2 + r + l * (u - c) ** 2, x = a * t ** 3 / 12 + o * s ** 3 / 12, h = (w, d) => {
      const g = Math.max(w, d) / 2, v = Math.min(w, d) / 2;
      return g * v ** 3 * (16 / 3 - 3.36 * (v / g) * (1 - (v / g) ** 4 / 12));
    }, L = h(t, a) + h(s, o);
    return {
      A: m,
      ybar: u,
      Iy: M,
      Iz: x,
      J: L
    };
  }
  me = {
    id: "viga-cim-guerra-ej7-tinv",
    name: "Ej.7 \xB7 Viga Cimentaci\xF3n (T invertida + pedestales)",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} 2 GDL Flexi\xF3n",
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "displacementZ"
    ],
    hasModal: false,
    guide: [
      "Ejercicio 7 Guerra MDI \u2014 variante VIGA T INVERTIDA (Het\xE9nyi sobre Winkler)",
      "Secci\xF3n T invertida (ala B\xD7t_zap + alma b_viga\xD7h_viga) como UN solo frame longitudinal.",
      "Comparar con `viga-cim-guerra-ej7` (caso shell+frame), mismas cargas y propiedades.",
      "Sin shell: pierde distribuci\xF3n transversal de presi\xF3n, pero m\xE1s r\xE1pido y simple.",
      "Cargas (CM+CV) por columna id\xE9nticas al caso shell \u2014 para comparaci\xF3n 1-a-1."
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
        label: "B ancho ala/pat\xEDn (m)"
      },
      t_zap: {
        default: 0.4,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "t_zap espesor pat\xEDn (m)"
      },
      b_viga: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "b_viga ancho alma (m)"
      },
      h_viga: {
        default: 0.8,
        min: 0.4,
        max: 1.5,
        step: 0.05,
        label: "h_viga canto alma (m)"
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
        label: "nx (segmentos viga)",
        folder: "Mesh"
      }
    },
    computedLabels(t) {
      const a = t.P1 + t.P2 + t.P3 + t.P4, s = t.M1 + t.M2 + t.M3 + t.M4, o = t.L * t.Bz, n = a / o, l = Y(t.Bz, t.t_zap, t.b_viga, t.h_viga);
      return {
        "\u03A3P (tonf)": a.toFixed(1),
        "\u03A3M (tonf\xB7m)": s.toFixed(2),
        "\xC1rea zapata (m\xB2)": o.toFixed(2),
        "q_med (tonf/m\xB2)": n.toFixed(2),
        "ratio q_med/q_adm": (n / t.q_adm).toFixed(3),
        "A_T (m\xB2)": l.A.toFixed(4),
        "\u0233 centroide (m)": l.ybar.toFixed(4),
        "Iy_T (m\u2074) flex.vert": l.Iy.toFixed(5),
        "Iz_T (m\u2074) flex.lat": l.Iz.toFixed(5)
      };
    },
    build(t, a) {
      const s = t.L, o = t.Bz, n = t.t_zap, l = t.b_viga, m = t.h_viga, f = t.h_ped, c = t.b_ped, u = t.ks_tonfm3 * q, p = Math.round(t.nx), r = p + 1, M = s / p, x = o / 2, h = [
        [
          t.x1,
          x
        ],
        [
          t.x2,
          x
        ],
        [
          t.x3,
          x
        ],
        [
          t.x4,
          x
        ]
      ], L = [
        t.P1,
        t.P2,
        t.P3,
        t.P4
      ].map((e) => e * q), w = [
        t.M1,
        t.M2,
        t.M3,
        t.M4
      ].map((e) => e * q), d = [];
      for (let e = 0; e < r; ++e) d.push([
        e * M,
        x,
        0
      ]);
      const g = (e) => {
        let i = -1, y = 1 / 0;
        for (let _ = 0; _ < r; ++_) {
          const U = Math.abs(d[_][0] - e);
          U < y && (y = U, i = _);
        }
        return i;
      }, v = n + m + f, Q = h.map(([e]) => g(e)), J = h.map(([e, i]) => (d.push([
        e,
        i,
        v
      ]), d.length - 1)), b = [], X = 0;
      for (let e = 0; e < p; ++e) b.push([
        e,
        e + 1
      ]);
      const V = b.length;
      Q.forEach((e, i) => b.push([
        e,
        J[i]
      ]));
      const P = [];
      for (let e = 0; e < r; ++e) {
        const i = e === 0 || e === r - 1 ? M / 2 : M, y = o * i;
        if (P.push({
          node: e,
          dof: 2,
          k: u * y
        }), e === 0 || e === r - 1) {
          const _ = 1e-6 * u * o * M;
          P.push({
            node: e,
            dof: 3,
            k: _
          }), P.push({
            node: e,
            dof: 5,
            k: _
          });
        }
      }
      const W = /* @__PURE__ */ new Map();
      J.forEach((e, i) => {
        W.set(e, [
          0,
          0,
          -L[i],
          0,
          w[i],
          0
        ]);
      });
      const A = 228e5, T = 0.2, Z = A / (2 * (1 + T)), I = Y(o, n, l, m), $ = c * c, H = c ** 4 / 12, ee = 0.141 * c ** 4, C = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
      for (let e = X; e < V; ++e) C.set(e, A), D.set(e, T), F.set(e, I.A), k.set(e, I.Iz), z.set(e, I.Iy), S.set(e, Z), E.set(e, I.J);
      for (let e = V; e < b.length; ++e) C.set(e, A), D.set(e, T), F.set(e, $), k.set(e, H), z.set(e, H), S.set(e, Z), E.set(e, ee);
      const K = {
        supports: /* @__PURE__ */ new Map(),
        loads: W,
        springs: P
      }, N = {
        elasticities: C,
        poissonsRatios: D,
        areas: F,
        momentsOfInertiaZ: z,
        momentsOfInertiaY: k,
        shearModuli: S,
        torsionalConstants: E
      };
      a.nodes.val = d, a.elements.val = b, a.nodeInputs.val = K, a.elementInputs.val = N;
      try {
        const e = ae(d, b, K, N, P);
        a.deformOutputs.val = e;
        const i = te(d, b, N, e);
        a.analyzeOutputs.val = i;
      } catch (e) {
        console.error("viga-cim-guerra-tinv solver error:", e);
      }
      const j = [];
      j.push(...oe(s, o, n, l, m));
      for (const [e, i] of h) j.push(...ne(e, i, n + m, f, c));
      a.objects3D.val = j;
    }
  };
});
export {
  __tla,
  me as v
};
