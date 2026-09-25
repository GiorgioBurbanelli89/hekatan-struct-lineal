import { b as j, c as q, L as G, E as O } from "./Text-C1TX4d8g.js";
import { a as te, __tla as __tla_0 } from "./analyze-DtswgObf.js";
import { d as ne, __tla as __tla_1 } from "./didacticCpp-ClOTguHC.js";
let me;
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
  const X = 9.80665;
  function ae(t, n, s, a, o, l = 16747520) {
    const m = [], f = new j({
      color: l,
      linewidth: 2
    }), r = new q(t, n, s), u = new G(new O(r), f);
    u.position.set(t / 2, n / 2, s / 2), m.push(u);
    const p = new q(t, a, o), c = new G(new O(p), new j({
      color: 9127187,
      linewidth: 2
    }));
    return c.position.set(t / 2, n / 2, s + o / 2), m.push(c), m;
  }
  function oe(t, n, s, a, o, l = 4620980) {
    const m = new q(o, o, a), f = new O(m), r = new G(f, new j({
      color: l,
      linewidth: 2
    }));
    return r.position.set(t, n, s + a / 2), [
      r
    ];
  }
  function K(t, n, s, a) {
    const o = t * n, l = s * a, m = o + l, f = n / 2, r = n + a / 2, u = (o * f + l * r) / m, p = t * n ** 3 / 12, c = s * a ** 3 / 12, _ = p + o * (u - f) ** 2 + c + l * (u - r) ** 2, x = n * t ** 3 / 12 + a * s ** 3 / 12, g = (w, d) => {
      const h = Math.max(w, d) / 2, v = Math.min(w, d) / 2;
      return h * v ** 3 * (16 / 3 - 3.36 * (v / h) * (1 - (v / h) ** 4 / 12));
    }, L = g(t, n) + g(s, a);
    return {
      A: m,
      ybar: u,
      Iy: _,
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
      const n = t.P1 + t.P2 + t.P3 + t.P4, s = t.M1 + t.M2 + t.M3 + t.M4, a = t.L * t.Bz, o = n / a, l = K(t.Bz, t.t_zap, t.b_viga, t.h_viga);
      return {
        "\u03A3P (tonf)": n.toFixed(1),
        "\u03A3M (tonf\xB7m)": s.toFixed(2),
        "\xC1rea zapata (m\xB2)": a.toFixed(2),
        "q_med (tonf/m\xB2)": o.toFixed(2),
        "ratio q_med/q_adm": (o / t.q_adm).toFixed(3),
        "A_T (m\xB2)": l.A.toFixed(4),
        "\u0233 centroide (m)": l.ybar.toFixed(4),
        "Iy_T (m\u2074) flex.vert": l.Iy.toFixed(5),
        "Iz_T (m\u2074) flex.lat": l.Iz.toFixed(5)
      };
    },
    build(t, n) {
      const s = t.L, a = t.Bz, o = t.t_zap, l = t.b_viga, m = t.h_viga, f = t.h_ped, r = t.b_ped, u = t.ks_tonfm3 * X, p = Math.round(t.nx), c = p + 1, _ = s / p, x = a / 2, g = [
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
      ].map((e) => e * X), w = [
        t.M1,
        t.M2,
        t.M3,
        t.M4
      ].map((e) => e * X), d = [];
      for (let e = 0; e < c; ++e) d.push([
        e * _,
        x,
        0
      ]);
      const h = (e) => {
        let i = -1, y = 1 / 0;
        for (let M = 0; M < c; ++M) {
          const H = Math.abs(d[M][0] - e);
          H < y && (y = H, i = M);
        }
        return i;
      }, v = o + m + f, U = g.map(([e]) => h(e)), B = g.map(([e, i]) => (d.push([
        e,
        i,
        v
      ]), d.length - 1)), b = [], Q = 0;
      for (let e = 0; e < p; ++e) b.push([
        e,
        e + 1
      ]);
      const R = b.length;
      U.forEach((e, i) => b.push([
        e,
        B[i]
      ]));
      const P = [];
      for (let e = 0; e < c; ++e) {
        const i = e === 0 || e === c - 1 ? _ / 2 : _, y = a * i;
        if (P.push({
          node: e,
          dof: 2,
          k: u * y
        }), e === 0 || e === c - 1) {
          const M = 1e-6 * u * a * _;
          P.push({
            node: e,
            dof: 3,
            k: M
          }), P.push({
            node: e,
            dof: 5,
            k: M
          });
        }
      }
      const J = /* @__PURE__ */ new Map();
      B.forEach((e, i) => {
        J.set(e, [
          0,
          0,
          -L[i],
          0,
          w[i],
          0
        ]);
      });
      const A = 228e5, S = 0.2, V = A / (2 * (1 + S)), I = K(a, o, l, m), $ = r * r, W = r ** 4 / 12, ee = 0.141 * r ** 4, T = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
      for (let e = Q; e < R; ++e) T.set(e, A), C.set(e, S), D.set(e, I.A), F.set(e, I.Iz), k.set(e, I.Iy), z.set(e, V), E.set(e, I.J);
      for (let e = R; e < b.length; ++e) T.set(e, A), C.set(e, S), D.set(e, $), F.set(e, W), k.set(e, W), z.set(e, V), E.set(e, ee);
      const Z = {
        supports: /* @__PURE__ */ new Map(),
        loads: J,
        springs: P
      }, Y = {
        elasticities: T,
        poissonsRatios: C,
        areas: D,
        momentsOfInertiaZ: k,
        momentsOfInertiaY: F,
        shearModuli: z,
        torsionalConstants: E
      };
      n.nodes.val = d, n.elements.val = b, n.nodeInputs.val = Z, n.elementInputs.val = Y;
      try {
        const e = ne(d, b, Z, Y, P);
        n.deformOutputs.val = e;
        const i = te(d, b, Y, e);
        n.analyzeOutputs.val = i;
      } catch (e) {
        console.error("viga-cim-guerra-tinv solver error:", e);
      }
      const N = [];
      N.push(...ae(s, a, o, l, m));
      for (const [e, i] of g) N.push(...oe(e, i, o + m, f, r));
      n.objects3D.val = N;
    }
  };
});
export {
  __tla,
  me as v
};
