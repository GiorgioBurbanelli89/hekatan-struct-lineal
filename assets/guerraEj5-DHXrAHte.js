import { c as ee, L as ne, E as oe, b as te } from "./Text-Br8EG2up.js";
import { p as ae, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { f as se } from "./f2kPlateQ4-BZ9dGpgS.js";
let ue;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const le = {
    sigma_uniforme_tm2: 19.96
  }, ce = {
    manual_libro: le
  }, u = 9.80665, me = 1 / u;
  function F(t, m, _, s) {
    const i = new ee(s, s, _), d = new ne(new oe(i), new te({
      color: 11579568,
      linewidth: 2
    }));
    return d.position.set(t, m, _ / 2), [
      d
    ];
  }
  ue = {
    id: "guerra-ej5-zapata-combinada-trapezoidal",
    name: "Ej.5 \xB7 Zapata Trapezoidal (L=5, B1=3.75\u2192B2=1.60)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F0} Cimentaciones",
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
      "EJ.5 pag.93-112. Zapata combinada TRAPEZOIDAL.",
      "L=5m, ancho varia linealmente de B1=3.75 (col1) a B2=1.60 (col2).",
      "Cols 50\xD750cm. Col 1: P_D=108 M_D=-4.3, P_L=45 M_L=-2. Col 2: P_D=78 M_D=3.2 P_L=36 M_L=2.4",
      "Libro pag.95: \u03C3 uniforme = 19.96 t/m\xB2 (< q_adm=20)."
    ],
    params: {
      L: {
        default: 5,
        min: 3,
        max: 7,
        step: 0.05,
        label: "L (m)"
      },
      B1: {
        default: 3.75,
        min: 2,
        max: 5,
        step: 0.05,
        label: "B1 (m)"
      },
      B2: {
        default: 1.6,
        min: 1,
        max: 3,
        step: 0.05,
        label: "B2 (m)"
      },
      h: {
        default: 1.15,
        min: 0.5,
        max: 1.5,
        step: 0.05,
        label: "h espesor (m)"
      },
      col1_x: {
        default: 0.25,
        min: 0.1,
        max: 1.5,
        step: 0.05,
        label: "col1 x (m)"
      },
      col2_x: {
        default: 4.75,
        min: 3,
        max: 6,
        step: 0.05,
        label: "col2 x (m)"
      },
      col_size: {
        default: 0.5,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "col lado (m)"
      },
      ks_tm3: {
        default: 2920,
        min: 500,
        max: 8e3,
        step: 50,
        label: "ks (tonf/m\xB3)"
      },
      P_D_C1: {
        default: 108,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D col1 (tonf)"
      },
      M_D_C1: {
        default: -4.3,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_D col1 (tonf\xB7m)"
      },
      P_L_C1: {
        default: 45,
        min: 0,
        max: 150,
        step: 1,
        label: "P_L col1 (tonf)"
      },
      M_L_C1: {
        default: -2,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_L col1 (tonf\xB7m)"
      },
      P_D_C2: {
        default: 78,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D col2 (tonf)"
      },
      M_D_C2: {
        default: 3.2,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_D col2 (tonf\xB7m)"
      },
      P_L_C2: {
        default: 36,
        min: 0,
        max: 150,
        step: 1,
        label: "P_L col2 (tonf)"
      },
      M_L_C2: {
        default: 2.4,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_L col2 (tonf\xB7m)"
      },
      fc_kgcm2: {
        default: 210,
        min: 175,
        max: 600,
        step: 5,
        label: "f'c (kg/cm\xB2)"
      },
      nx: {
        default: 24,
        min: 12,
        max: 40,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 14,
        min: 6,
        max: 24,
        step: 2,
        label: "ny mesh"
      },
      h_col: {
        default: 0.6,
        min: 0.2,
        max: 2,
        step: 0.1,
        label: "Hcol viz (m)"
      }
    },
    build(t, m) {
      const _ = t.L, s = t.B1, i = t.B2, d = Math.max(s, i), p = t.h, b = Math.round(t.nx), M = Math.round(t.ny), l = b + 1, v = M + 1, B = _ / b, G = d / M, Z = (t.P_D_C1 + t.P_L_C1) * u, K = (t.M_D_C1 + t.M_L_C1) * u, q = (t.P_D_C2 + t.P_L_C2) * u, H = (t.M_D_C2 + t.M_L_C2) * u, k = t.ks_tm3 * u, z = 14100 * Math.sqrt(t.fc_kgcm2) * 98.0665, E = 0.2, $ = d / 2, J = (n) => (s + (i - s) * (n / _)) / 2, r = [];
      for (let n = 0; n < v; ++n) for (let o = 0; o < l; ++o) {
        const e = o * B, a = J(e);
        r.push([
          e,
          $ - a + 2 * a * n / M
        ]);
      }
      const f = [];
      for (let n = 0; n < M; ++n) for (let o = 0; o < b; ++o) {
        const e = n * l + o;
        f.push([
          e,
          e + 1,
          e + l + 1,
          e + l
        ]);
      }
      const P = new Array(r.length).fill(0);
      for (const n of f) {
        let o = 0;
        for (let e = 0; e < 4; e++) {
          const [a, c] = r[n[e]], [L, W] = r[n[(e + 1) % 4]];
          o += a * W - L * c;
        }
        for (const e of n) P[e] += Math.abs(o) / 2 / 4;
      }
      const Q = 2.4 * u * p, h = [], X = [];
      for (let n = 0; n < v; ++n) for (let o = 0; o < l; ++o) {
        const e = o === 0 || o === l - 1, a = n === 0 || n === v - 1, c = n * l + o;
        if (h.push({
          node: c,
          dof: 0,
          k: k * P[c]
        }), X.push({
          node: c,
          dof: 0,
          value: -Q * P[c]
        }), e && a) {
          const L = 1e-6 * k * B * G;
          h.push({
            node: c,
            dof: 1,
            k: L
          }), h.push({
            node: c,
            dof: 2,
            k: L
          });
        }
      }
      const C = d / 2, Y = (n) => {
        const o = [];
        for (let e = 0; e < r.length; e++) {
          const a = r[e][0], c = r[e][1];
          Math.abs(a - n) <= t.col_size / 2 + 1e-6 && Math.abs(c - C) <= t.col_size / 2 + 1e-6 && o.push(e);
        }
        return o;
      }, y = Y(t.col1_x), g = Y(t.col2_x), x = [];
      if (y.length > 0) {
        const n = Z / y.length, o = K / y.length;
        for (const e of y) x.push({
          node: e,
          dof: 0,
          value: -n
        }), x.push({
          node: e,
          dof: 2,
          value: o
        });
      }
      if (g.length > 0) {
        const n = q / g.length, o = H / g.length;
        for (const e of g) x.push({
          node: e,
          dof: 0,
          value: -n
        }), x.push({
          node: e,
          dof: 2,
          value: o
        });
      }
      const T = [
        ...x,
        ...X
      ], w = ae({
        E: z,
        nu: E,
        thickness: p,
        theoryType: 0,
        bcType: "none",
        nodes: r,
        elements: f,
        bcs: [],
        pointLoads: T,
        springs: h
      }), A = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
      f.forEach((n, o) => {
        A.set(o, n.map((c) => -Math.abs(k * w.nodeResults[c].w)));
        const e = w.elementResults[o];
        j.set(o, [
          e.Mxx,
          e.Mxx,
          e.Mxx,
          e.Mxx
        ]), I.set(o, [
          e.Myy,
          e.Myy,
          e.Myy,
          e.Myy
        ]), O.set(o, [
          e.Mxy,
          e.Mxy,
          e.Mxy,
          e.Mxy
        ]);
        const a = Math.sqrt(e.Mxx ** 2 + e.Myy ** 2 - e.Mxx * e.Myy + 3 * e.Mxy ** 2);
        R.set(o, [
          a,
          a,
          a,
          a
        ]);
      });
      const U = r.map((n) => [
        n[0],
        n[1],
        0
      ]);
      m.nodes.val = U, m.elements.val = f;
      const D = /* @__PURE__ */ new Map(), V = [
        2,
        3,
        4
      ];
      for (const n of x) {
        const o = D.get(n.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        o[V[n.dof] ?? 2] += n.value, D.set(n.node, o);
      }
      m.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: D,
        ...se(h, T)
      }, m.elementInputs.val = {
        elasticities: new Map(f.map((n, o) => [
          o,
          z
        ])),
        poissonsRatios: new Map(f.map((n, o) => [
          o,
          E
        ])),
        thicknesses: new Map(f.map((n, o) => [
          o,
          p
        ]))
      };
      const S = /* @__PURE__ */ new Map();
      w.nodeResults.forEach((n, o) => S.set(o, [
        0,
        0,
        n.w,
        n.bx,
        n.by,
        0
      ])), m.deformOutputs.val = {
        deformations: S,
        reactions: /* @__PURE__ */ new Map()
      }, m.analyzeOutputs.val = {
        pressure: A,
        bendingXX: j,
        bendingYY: I,
        bendingXY: O,
        vonMises: R
      };
      const N = [];
      N.push(...F(t.col1_x, C, t.h_col, t.col_size)), N.push(...F(t.col2_x, C, t.h_col, t.col_size)), m.objects3D.val = N;
    },
    computedLabels(t, m) {
      var _a;
      const _ = m.analyzeOutputs.val.pressure;
      let s = -1 / 0, i = 1 / 0;
      if (_) for (const b of _.values()) for (const M of b) {
        const l = Math.abs(M) * me;
        l > s && (s = l), l < i && (i = l);
      }
      s === -1 / 0 && (s = 0, i = 0);
      const p = (_a = ce == null ? void 0 : ce.manual_libro) == null ? void 0 : _a.sigma_uniforme_tm2;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${i.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3 uniforme libro p.95": p ? `${p.toFixed(2)} t/m\xB2` : "\u2014",
        "\u{1F4D0} Geometr\xEDa": "trapecio real (malla trapezoidal)"
      };
    }
  };
});
export {
  __tla,
  ue as g
};
