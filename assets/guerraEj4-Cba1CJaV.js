import { b as ee, L as ne, E as oe, a as te } from "./theme-Dxpmbnyd.js";
import { p as se, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { f as ae } from "./f2kPlateQ4-BZ9dGpgS.js";
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
    sigma_max_servicio_tm2: 16.018,
    sigma_min_servicio_tm2: 9.901
  }, ce = {
    manual_libro: le
  }, M = 9.80665, me = 1 / M;
  function S(t, a, d, s) {
    const l = new ee(s, s, d), _ = new ne(new oe(l), new te({
      color: 11579568,
      linewidth: 2
    }));
    return _.position.set(t, a, d / 2), [
      _
    ];
  }
  ue = {
    id: "guerra-ej4-zapata-combinada-rectangular",
    name: "Ej.4 \xB7 Zapata Combinada Rectangular (7.50\xD72.50)",
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
      "EJ.4 Guerra MDI - pag. 74-90. Zapata COMBINADA con 2 columnas.",
      "L=7.50m, B=2.50m, h=0.50m. Col 45\xD745cm en x=1.00m y x=6.50m.",
      "Col 1: P_D=90, M_D=7, P_L=23, M_L=3 (tonf, tonf\xB7m)",
      "Col 2: P_D=100, M_D=14, P_L=30, M_L=4",
      "Libro pag.76: \u03C3_max=16.018, \u03C3_min=9.901 t/m\xB2 (cumple q_adm=18)."
    ],
    params: {
      L: {
        default: 7.5,
        min: 5,
        max: 10,
        step: 0.1,
        label: "L (m)"
      },
      B: {
        default: 2.5,
        min: 1.5,
        max: 4,
        step: 0.05,
        label: "B (m)"
      },
      h: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.05,
        label: "h espesor (m)"
      },
      col1_x: {
        default: 1,
        min: 0.3,
        max: 3,
        step: 0.05,
        label: "col1 x (m)"
      },
      col2_x: {
        default: 6.5,
        min: 3,
        max: 9,
        step: 0.05,
        label: "col2 x (m)"
      },
      col_size: {
        default: 0.45,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "col lado (m)"
      },
      ks_tm3: {
        default: 3640,
        min: 500,
        max: 8e3,
        step: 50,
        label: "ks (tonf/m\xB3)"
      },
      P_dead_c1: {
        default: 90,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D col1 (tonf)"
      },
      M_dead_c1: {
        default: 7,
        min: -50,
        max: 50,
        step: 0.5,
        label: "M_D col1 (tonf\xB7m)"
      },
      P_live_c1: {
        default: 23,
        min: 0,
        max: 100,
        step: 1,
        label: "P_L col1 (tonf)"
      },
      M_live_c1: {
        default: 3,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_L col1 (tonf\xB7m)"
      },
      P_dead_c2: {
        default: 100,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D col2 (tonf)"
      },
      M_dead_c2: {
        default: 14,
        min: -50,
        max: 50,
        step: 0.5,
        label: "M_D col2 (tonf\xB7m)"
      },
      P_live_c2: {
        default: 30,
        min: 0,
        max: 100,
        step: 1,
        label: "P_L col2 (tonf)"
      },
      M_live_c2: {
        default: 4,
        min: -30,
        max: 30,
        step: 0.5,
        label: "M_L col2 (tonf\xB7m)"
      },
      fc_kgcm2: {
        default: 240,
        min: 175,
        max: 600,
        step: 5,
        label: "f'c (kg/cm\xB2)"
      },
      nx: {
        default: 30,
        min: 12,
        max: 48,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 10,
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
    build(t, a) {
      const d = t.L, s = t.B, l = t.h, _ = Math.round(t.nx), f = Math.round(t.ny), c = _ + 1, x = f + 1, r = d / _, m = s / f, p = (t.P_dead_c1 + t.P_live_c1) * M, $ = (t.M_dead_c1 + t.M_live_c1) * M, K = (t.P_dead_c2 + t.P_live_c2) * M, Z = (t.M_dead_c2 + t.M_live_c2) * M, k = t.ks_tm3 * M, C = 14100 * Math.sqrt(t.fc_kgcm2) * 98.0665, E = 0.2, b = [];
      for (let e = 0; e < x; ++e) for (let n = 0; n < c; ++n) b.push([
        n * r,
        e * m
      ]);
      const u = [];
      for (let e = 0; e < f; ++e) for (let n = 0; n < _; ++n) {
        const o = e * c + n;
        u.push([
          o,
          o + 1,
          o + c + 1,
          o + c
        ]);
      }
      const q = 2.4 * M * l, v = [], I = [];
      for (let e = 0; e < x; ++e) for (let n = 0; n < c; ++n) {
        const o = n === 0 || n === c - 1, i = e === 0 || e === x - 1, y = o && i ? 0.25 : o || i ? 0.5 : 1, Y = r * m * y, g = e * c + n;
        if (v.push({
          node: g,
          dof: 0,
          k: k * Y
        }), I.push({
          node: g,
          dof: 0,
          value: -q * Y
        }), o && i) {
          const G = 1e-6 * k * r * m;
          v.push({
            node: g,
            dof: 1,
            k: G
          }), v.push({
            node: g,
            dof: 2,
            k: G
          });
        }
      }
      const L = s / 2, j = (e) => {
        const n = [];
        for (let o = 0; o < b.length; o++) {
          const i = b[o][0], y = b[o][1];
          Math.abs(i - e) <= t.col_size / 2 + 1e-6 && Math.abs(y - L) <= t.col_size / 2 + 1e-6 && n.push(o);
        }
        return n;
      }, w = j(t.col1_x), P = j(t.col2_x), h = [], H = p / w.length, J = $ / w.length, Q = K / P.length, V = Z / P.length;
      for (const e of w) h.push({
        node: e,
        dof: 0,
        value: -H
      }), h.push({
        node: e,
        dof: 2,
        value: J
      });
      for (const e of P) h.push({
        node: e,
        dof: 0,
        value: -Q
      }), h.push({
        node: e,
        dof: 2,
        value: V
      });
      const B = [
        ...h,
        ...I
      ], N = se({
        E: C,
        nu: E,
        thickness: l,
        theoryType: 0,
        bcType: "none",
        nodes: b,
        elements: u,
        bcs: [],
        pointLoads: B,
        springs: v
      }), F = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
      u.forEach((e, n) => {
        F.set(n, e.map((y) => -Math.abs(k * N.nodeResults[y].w)));
        const o = N.elementResults[n];
        O.set(n, [
          o.Mxx,
          o.Mxx,
          o.Mxx,
          o.Mxx
        ]), R.set(n, [
          o.Myy,
          o.Myy,
          o.Myy,
          o.Myy
        ]), A.set(n, [
          o.Mxy,
          o.Mxy,
          o.Mxy,
          o.Mxy
        ]);
        const i = Math.sqrt(o.Mxx ** 2 + o.Myy ** 2 - o.Mxx * o.Myy + 3 * o.Mxy ** 2);
        T.set(n, [
          i,
          i,
          i,
          i
        ]);
      });
      const W = b.map((e) => [
        e[0],
        e[1],
        0
      ]);
      a.nodes.val = W, a.elements.val = u;
      const D = /* @__PURE__ */ new Map(), U = [
        2,
        3,
        4
      ];
      for (const e of h) {
        const n = D.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[U[e.dof] ?? 2] += e.value, D.set(e.node, n);
      }
      a.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: D,
        ...ae(v, B)
      }, a.elementInputs.val = {
        elasticities: new Map(u.map((e, n) => [
          n,
          C
        ])),
        poissonsRatios: new Map(u.map((e, n) => [
          n,
          E
        ])),
        thicknesses: new Map(u.map((e, n) => [
          n,
          l
        ]))
      };
      const X = /* @__PURE__ */ new Map();
      N.nodeResults.forEach((e, n) => X.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), a.deformOutputs.val = {
        deformations: X,
        reactions: /* @__PURE__ */ new Map()
      }, a.analyzeOutputs.val = {
        pressure: F,
        bendingXX: O,
        bendingYY: R,
        bendingXY: A,
        vonMises: T
      };
      const z = [];
      z.push(...S(t.col1_x, L, t.h_col, t.col_size)), z.push(...S(t.col2_x, L, t.h_col, t.col_size)), a.objects3D.val = z;
    },
    computedLabels(t, a) {
      var _a, _b;
      const d = a.analyzeOutputs.val.pressure;
      let s = -1 / 0, l = 1 / 0;
      if (d) for (const r of d.values()) for (const m of r) {
        const p = Math.abs(m) * me;
        p > s && (s = p), p < l && (l = p);
      }
      s === -1 / 0 && (s = 0, l = 0);
      const _ = ce, f = (_a = _ == null ? void 0 : _.manual_libro) == null ? void 0 : _a.sigma_max_servicio_tm2, c = (_b = _ == null ? void 0 : _.manual_libro) == null ? void 0 : _b.sigma_min_servicio_tm2, x = (r, m) => m === void 0 || m === 0 ? "\u2014" : `${((r - m) / m * 100).toFixed(2)} %`;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${l.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3_max libro p.76": f ? `${f.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4D8} \u03C3_min libro p.76": c ? `${c.toFixed(3)} t/m\xB2` : "\u2014",
        "\u0394 \u03C3_max vs libro": x(s, f),
        "\u0394 \u03C3_min vs libro": x(l, c)
      };
    }
  };
});
export {
  __tla,
  ue as g
};
