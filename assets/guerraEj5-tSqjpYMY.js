import { b as se, L as ae, E as le, a as ce } from "./theme-U-6D_qyI.js";
import { p as me, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { f as ie } from "./f2kPlateQ4-BZ9dGpgS.js";
let he;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const _e = {
    sigma_uniforme_tm2: 19.96
  }, fe = {
    manual_libro: _e
  }, d = 9.80665, de = 1 / d;
  function K(t, c, i, s) {
    const m = new se(s, s, i), _ = new ae(new le(m), new ce({
      color: 11579568,
      linewidth: 2
    }));
    return _.position.set(t, c, i / 2), [
      _
    ];
  }
  he = {
    id: "guerra-ej5-zapata-combinada-trapezoidal",
    name: "Ej.5 \xB7 Zapata Trapezoidal (L=5, B1=3.75\u2192B2=1.60)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F0} Cimentaciones",
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
    build(t, c) {
      const i = t.L, s = t.B1, m = t.B2, _ = Math.max(s, m), r = t.h, M = Math.round(t.nx), x = Math.round(t.ny), a = M + 1, C = x + 1, y = i / M, g = _ / x, q = (t.P_D_C1 + t.P_L_C1) * d, H = (t.M_D_C1 + t.M_L_C1) * d, $ = (t.P_D_C2 + t.P_L_C2) * d, J = (t.M_D_C2 + t.M_L_C2) * d, w = t.ks_tm3 * d, B = 14100 * Math.sqrt(t.fc_kgcm2) * 98.0665, E = 0.2, Q = (e) => (s + (m - s) * (e / i)) / 2, U = (e, n) => {
        const o = Q(e), l = _ / 2;
        return Math.abs(n - l) <= o + 1e-6;
      }, u = [];
      for (let e = 0; e < C; ++e) for (let n = 0; n < a; ++n) u.push([
        n * y,
        e * g
      ]);
      const f = [];
      for (let e = 0; e < x; ++e) for (let n = 0; n < M; ++n) {
        const o = e * a + n;
        f.push([
          o,
          o + 1,
          o + a + 1,
          o + a
        ]);
      }
      const V = 2.4 * d * r, h = [], T = [];
      for (let e = 0; e < C; ++e) for (let n = 0; n < a; ++n) {
        const o = n === 0 || n === a - 1, l = e === 0 || e === C - 1, b = o && l ? 0.25 : o || l ? 0.5 : 1, G = y * g * b, v = e * a + n, ne = n * y, oe = e * g, S = U(ne, oe), te = S ? w * G : 0;
        if (h.push({
          node: v,
          dof: 0,
          k: Math.max(te, 1e-6)
        }), S && T.push({
          node: v,
          dof: 0,
          value: -V * G
        }), o && l) {
          const Z = 1e-6 * w * y * g;
          h.push({
            node: v,
            dof: 1,
            k: Z
          }), h.push({
            node: v,
            dof: 2,
            k: Z
          });
        }
      }
      const P = _ / 2, j = (e) => {
        const n = [];
        for (let o = 0; o < u.length; o++) {
          const l = u[o][0], b = u[o][1];
          Math.abs(l - e) <= t.col_size / 2 + 1e-6 && Math.abs(b - P) <= t.col_size / 2 + 1e-6 && n.push(o);
        }
        return n;
      }, L = j(t.col1_x), k = j(t.col2_x), p = [];
      if (L.length > 0) {
        const e = q / L.length, n = H / L.length;
        for (const o of L) p.push({
          node: o,
          dof: 0,
          value: -e
        }), p.push({
          node: o,
          dof: 2,
          value: n
        });
      }
      if (k.length > 0) {
        const e = $ / k.length, n = J / k.length;
        for (const o of k) p.push({
          node: o,
          dof: 0,
          value: -e
        }), p.push({
          node: o,
          dof: 2,
          value: n
        });
      }
      const I = [
        ...p,
        ...T
      ], D = me({
        E: B,
        nu: E,
        thickness: r,
        theoryType: 0,
        bcType: "none",
        nodes: u,
        elements: f,
        bcs: [],
        pointLoads: I,
        springs: h
      }), O = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      f.forEach((e, n) => {
        O.set(n, e.map((b) => -Math.abs(w * D.nodeResults[b].w)));
        const o = D.elementResults[n];
        R.set(n, [
          o.Mxx,
          o.Mxx,
          o.Mxx,
          o.Mxx
        ]), A.set(n, [
          o.Myy,
          o.Myy,
          o.Myy,
          o.Myy
        ]), F.set(n, [
          o.Mxy,
          o.Mxy,
          o.Mxy,
          o.Mxy
        ]);
        const l = Math.sqrt(o.Mxx ** 2 + o.Myy ** 2 - o.Mxx * o.Myy + 3 * o.Mxy ** 2);
        X.set(n, [
          l,
          l,
          l,
          l
        ]);
      });
      const W = u.map((e) => [
        e[0],
        e[1],
        0
      ]);
      c.nodes.val = W, c.elements.val = f;
      const N = /* @__PURE__ */ new Map(), ee = [
        2,
        3,
        4
      ];
      for (const e of p) {
        const n = N.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[ee[e.dof] ?? 2] += e.value, N.set(e.node, n);
      }
      c.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: N,
        ...ie(h, I)
      }, c.elementInputs.val = {
        elasticities: new Map(f.map((e, n) => [
          n,
          B
        ])),
        poissonsRatios: new Map(f.map((e, n) => [
          n,
          E
        ])),
        thicknesses: new Map(f.map((e, n) => [
          n,
          r
        ]))
      };
      const Y = /* @__PURE__ */ new Map();
      D.nodeResults.forEach((e, n) => Y.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), c.deformOutputs.val = {
        deformations: Y,
        reactions: /* @__PURE__ */ new Map()
      }, c.analyzeOutputs.val = {
        pressure: O,
        bendingXX: R,
        bendingYY: A,
        bendingXY: F,
        vonMises: X
      };
      const z = [];
      z.push(...K(t.col1_x, P, t.h_col, t.col_size)), z.push(...K(t.col2_x, P, t.h_col, t.col_size)), c.objects3D.val = z;
    },
    computedLabels(t, c) {
      var _a;
      const i = c.analyzeOutputs.val.pressure;
      let s = -1 / 0, m = 1 / 0;
      if (i) for (const M of i.values()) for (const x of M) {
        const a = Math.abs(x) * de;
        a > s && (s = a), a < m && (m = a);
      }
      s === -1 / 0 && (s = 0, m = 0);
      const r = (_a = fe == null ? void 0 : fe.manual_libro) == null ? void 0 : _a.sigma_uniforme_tm2;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${m.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3 uniforme libro p.95": r ? `${r.toFixed(2)} t/m\xB2` : "\u2014",
        "\u26A0\uFE0F Trapezoidal": "Geometria aproximada con mesh rect + mask"
      };
    }
  };
});
export {
  __tla,
  he as g
};
