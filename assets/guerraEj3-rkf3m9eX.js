import { b as U, L as V, E as W, a as ee } from "./theme-U-6D_qyI.js";
import { p as ne, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { f as oe } from "./f2kPlateQ4-BZ9dGpgS.js";
import { c as te } from "./cargaColumnaConsistente-DPcPMAlx.js";
let fe;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const se = {
    e_DL_m: 1.289,
    e_DLS_m: 1.331,
    L_sobre_6_m: 0.767
  }, ae = {
    manual_libro: se
  }, p = 9.80665, le = 1 / p;
  function me(o, s, i, a, l) {
    const m = new U(a, l, i), r = new V(new W(m), new ee({
      color: 11579568,
      linewidth: 2
    }));
    return r.position.set(o, s, i / 2), [
      r
    ];
  }
  fe = {
    id: "guerra-ej3-zapata-rectangular-eccentricidad-grande",
    name: "Ej.3 \xB7 Zapata Rectangular EXCENTRICIDAD GRANDE (4.60\xD74.00\xD70.55)",
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
      "EJ.3 Guerra MDI - pag. 69-72. Excentricidad MUY GRANDE.",
      "Mismas dim Ej.2 (L=4.60, B=4.00) pero M_live=96t\xB7m (vs 36 en Ej.2).",
      "q_adm=20 t/m\xB2 (suelo mejor para soportar la mayor demanda).",
      "e_DL=1.289 m >> L/6=0.767 m \u2192 zona de despegue grande.",
      "El libro pag.69 muestra que aunque e es enorme, \u03C3_max sigue cumpliendo."
    ],
    params: {
      L: {
        default: 4.6,
        min: 3.5,
        max: 6,
        step: 0.05,
        label: "L (m)"
      },
      B: {
        default: 4,
        min: 3,
        max: 5.5,
        step: 0.05,
        label: "B (m)"
      },
      h: {
        default: 0.55,
        min: 0.4,
        max: 0.9,
        step: 0.05,
        label: "h espesor (m)"
      },
      col_x: {
        default: 1.2,
        min: 0.4,
        max: 2,
        step: 0.05,
        label: "col Lx (m)"
      },
      col_y: {
        default: 0.6,
        min: 0.3,
        max: 1.5,
        step: 0.05,
        label: "col Ly (m)"
      },
      ks_tm3: {
        default: 4400,
        min: 500,
        max: 12e3,
        step: 100,
        label: "ks (tonf/m\xB3)"
      },
      P_dead: {
        default: 91,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D (tonf)"
      },
      M_dead: {
        default: 60,
        min: 0,
        max: 200,
        step: 1,
        label: "M_D (tonf\xB7m)"
      },
      P_live: {
        default: 30,
        min: 0,
        max: 150,
        step: 1,
        label: "P_L (tonf)"
      },
      M_live: {
        default: 96,
        min: 0,
        max: 200,
        step: 1,
        label: "M_L (tonf\xB7m)"
      },
      P_sismo: {
        default: 3,
        min: 0,
        max: 100,
        step: 0.5,
        label: "P_S (tonf)"
      },
      M_sismo: {
        default: 9,
        min: 0,
        max: 80,
        step: 0.5,
        label: "M_S (tonf\xB7m)"
      },
      combo: {
        default: 1,
        min: 0,
        max: 1,
        step: 1,
        label: "combo (0=DL, 1=DLS)"
      },
      fc_kgcm2: {
        default: 280,
        min: 175,
        max: 600,
        step: 5,
        label: "f'c (kg/cm\xB2)"
      },
      nx: {
        default: 18,
        min: 8,
        max: 32,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 16,
        min: 8,
        max: 32,
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
    build(o, s) {
      const i = o.L, a = o.B, l = o.h, m = Math.round(o.nx), r = Math.round(o.ny), c = m + 1, d = r + 1, b = i / m, y = a / r, Y = Math.round(o.combo);
      let h, g;
      Y === 1 ? (h = o.P_dead + o.P_live + o.P_sismo, g = o.M_dead + o.M_live + o.M_sismo) : (h = o.P_dead + o.P_live, g = o.M_dead + o.M_live);
      const q = h * p, $ = g * p, L = o.ks_tm3 * p, R = 14100 * Math.sqrt(o.fc_kgcm2) * 98.0665, S = 0.2, f = [];
      for (let e = 0; e < d; ++e) for (let n = 0; n < c; ++n) f.push([
        n * b,
        e * y
      ]);
      const _ = [];
      for (let e = 0; e < r; ++e) for (let n = 0; n < m; ++n) {
        const t = e * c + n;
        _.push([
          t,
          t + 1,
          t + c + 1,
          t + c
        ]);
      }
      const K = 2.4 * p * l, M = [], j = [];
      for (let e = 0; e < d; ++e) for (let n = 0; n < c; ++n) {
        const t = n === 0 || n === c - 1, u = e === 0 || e === d - 1, P = t && u ? 0.25 : t || u ? 0.5 : 1, O = b * y * P, x = e * c + n;
        if (M.push({
          node: x,
          dof: 0,
          k: L * O
        }), j.push({
          node: x,
          dof: 0,
          value: -K * O
        }), t && u) {
          const X = 1e-6 * L * b * y;
          M.push({
            node: x,
            dof: 1,
            k: X
          }), M.push({
            node: x,
            dof: 2,
            k: X
          });
        }
      }
      const v = i / 2, E = a / 2, k = [];
      for (let e = 0; e < f.length; e++) {
        const n = f[e][0], t = f[e][1];
        Math.abs(n - v) <= o.col_x / 2 + 1e-6 && Math.abs(t - E) <= o.col_y / 2 + 1e-6 && k.push(e);
      }
      const H = te(f, _, q, v, E, o.col_x, o.col_y), Z = $ / k.length, w = [
        ...H.pointLoads
      ];
      for (const e of k) w.push({
        node: e,
        dof: 2,
        value: Z
      });
      const A = [
        ...w,
        ...j
      ], D = ne({
        E: R,
        nu: S,
        thickness: l,
        theoryType: 0,
        bcType: "none",
        nodes: f,
        elements: _,
        bcs: [],
        pointLoads: A,
        springs: M
      }), G = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
      _.forEach((e, n) => {
        G.set(n, e.map((P) => -Math.abs(L * D.nodeResults[P].w)));
        const t = D.elementResults[n];
        I.set(n, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), z.set(n, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), C.set(n, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]);
        const u = Math.sqrt(t.Mxx ** 2 + t.Myy ** 2 - t.Mxx * t.Myy + 3 * t.Mxy ** 2);
        F.set(n, [
          u,
          u,
          u,
          u
        ]);
      });
      const J = f.map((e) => [
        e[0],
        e[1],
        0
      ]);
      s.nodes.val = J, s.elements.val = _;
      const N = /* @__PURE__ */ new Map(), Q = [
        2,
        3,
        4
      ];
      for (const e of w) {
        const n = N.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[Q[e.dof] ?? 2] += e.value, N.set(e.node, n);
      }
      s.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: N,
        ...oe(M, A)
      }, s.elementInputs.val = {
        elasticities: new Map(_.map((e, n) => [
          n,
          R
        ])),
        poissonsRatios: new Map(_.map((e, n) => [
          n,
          S
        ])),
        thicknesses: new Map(_.map((e, n) => [
          n,
          l
        ]))
      };
      const T = /* @__PURE__ */ new Map();
      D.nodeResults.forEach((e, n) => T.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), s.deformOutputs.val = {
        deformations: T,
        reactions: /* @__PURE__ */ new Map()
      }, s.analyzeOutputs.val = {
        pressure: G,
        bendingXX: I,
        bendingYY: z,
        bendingXY: C,
        vonMises: F
      };
      const B = [];
      B.push(...me(v, E, o.h_col, o.col_x, o.col_y)), s.objects3D.val = B;
    },
    computedLabels(o, s) {
      var _a, _b, _c, _d, _e, _f;
      const i = s.analyzeOutputs.val.pressure;
      let a = -1 / 0, l = 1 / 0;
      if (i) for (const r of i.values()) for (const c of r) {
        const d = Math.abs(c) * le;
        d > a && (a = d), d < l && (l = d);
      }
      a === -1 / 0 && (a = 0, l = 0);
      const m = ae;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${a.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${l.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} e (D+L) libro": `${(_b = (_a = m == null ? void 0 : m.manual_libro) == null ? void 0 : _a.e_DL_m) == null ? void 0 : _b.toFixed(3)} m`,
        "\u{1F4D8} e (D+L+S) libro": `${(_d = (_c = m == null ? void 0 : m.manual_libro) == null ? void 0 : _c.e_DLS_m) == null ? void 0 : _d.toFixed(3)} m`,
        "\u{1F4D8} L/6": `${(_f = (_e = m == null ? void 0 : m.manual_libro) == null ? void 0 : _e.L_sobre_6_m) == null ? void 0 : _f.toFixed(3)} m`,
        "\u26A0\uFE0F Excentricidad": "e >> L/6 \u2192 DESPEGUE GRANDE"
      };
    }
  };
});
export {
  __tla,
  fe as g
};
