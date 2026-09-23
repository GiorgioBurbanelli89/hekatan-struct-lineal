import { c as U, L as V, E as W, b as ee } from "./Text-Br8EG2up.js";
import { p as ne, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { f as ae } from "./f2kPlateQ4-BZ9dGpgS.js";
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
  const oe = {
    e_DL_m: 1.289,
    e_DLS_m: 1.331,
    L_sobre_6_m: 0.767
  }, se = {
    manual_libro: oe
  }, p = 9.80665, le = 1 / p;
  function me(a, o, i, s, l) {
    const m = new U(s, l, i), r = new V(new W(m), new ee({
      color: 11579568,
      linewidth: 2
    }));
    return r.position.set(a, o, i / 2), [
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
    build(a, o) {
      const i = a.L, s = a.B, l = a.h, m = Math.round(a.nx), r = Math.round(a.ny), c = m + 1, d = r + 1, b = i / m, y = s / r, O = Math.round(a.combo);
      let h, g;
      O === 1 ? (h = a.P_dead + a.P_live + a.P_sismo, g = a.M_dead + a.M_live + a.M_sismo) : (h = a.P_dead + a.P_live, g = a.M_dead + a.M_live);
      const q = h * p, $ = g * p, v = a.ks_tm3 * p, S = 14100 * Math.sqrt(a.fc_kgcm2) * 98.0665, R = 0.2, f = [];
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
      const K = 2.4 * p * l, M = [], X = [];
      for (let e = 0; e < d; ++e) for (let n = 0; n < c; ++n) {
        const t = n === 0 || n === c - 1, u = e === 0 || e === d - 1, N = t && u ? 0.25 : t || u ? 0.5 : 1, T = b * y * N, x = e * c + n;
        if (M.push({
          node: x,
          dof: 0,
          k: v * T
        }), X.push({
          node: x,
          dof: 0,
          value: -K * T
        }), t && u) {
          const B = 1e-6 * v * b * y;
          M.push({
            node: x,
            dof: 1,
            k: B
          }), M.push({
            node: x,
            dof: 2,
            k: B
          });
        }
      }
      const L = i / 2, E = s / 2, k = [];
      for (let e = 0; e < f.length; e++) {
        const n = f[e][0], t = f[e][1];
        Math.abs(n - L) <= a.col_x / 2 + 1e-6 && Math.abs(t - E) <= a.col_y / 2 + 1e-6 && k.push(e);
      }
      const H = te(f, _, q, L, E, a.col_x, a.col_y), Z = $ / k.length, w = [
        ...H.pointLoads
      ];
      for (const e of k) w.push({
        node: e,
        dof: 2,
        value: Z
      });
      const Y = [
        ...w,
        ...X
      ], D = ne({
        E: S,
        nu: R,
        thickness: l,
        theoryType: 0,
        bcType: "none",
        nodes: f,
        elements: _,
        bcs: [],
        pointLoads: Y,
        springs: M
      }), j = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
      _.forEach((e, n) => {
        j.set(n, e.map((N) => -Math.abs(v * D.nodeResults[N].w)));
        const t = D.elementResults[n];
        A.set(n, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), G.set(n, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), I.set(n, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]);
        const u = Math.sqrt(t.Mxx ** 2 + t.Myy ** 2 - t.Mxx * t.Myy + 3 * t.Mxy ** 2);
        z.set(n, [
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
      o.nodes.val = J, o.elements.val = _;
      const P = /* @__PURE__ */ new Map(), Q = [
        2,
        3,
        4
      ];
      for (const e of w) {
        const n = P.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[Q[e.dof] ?? 2] += e.value, P.set(e.node, n);
      }
      o.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: P,
        ...ae(M, Y)
      }, o.elementInputs.val = {
        elasticities: new Map(_.map((e, n) => [
          n,
          S
        ])),
        poissonsRatios: new Map(_.map((e, n) => [
          n,
          R
        ])),
        thicknesses: new Map(_.map((e, n) => [
          n,
          l
        ]))
      };
      const C = /* @__PURE__ */ new Map();
      D.nodeResults.forEach((e, n) => C.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), o.deformOutputs.val = {
        deformations: C,
        reactions: /* @__PURE__ */ new Map()
      }, o.analyzeOutputs.val = {
        pressure: j,
        bendingXX: A,
        bendingYY: G,
        bendingXY: I,
        vonMises: z
      };
      const F = [];
      F.push(...me(L, E, a.h_col, a.col_x, a.col_y)), o.objects3D.val = F;
    },
    computedLabels(a, o) {
      var _a, _b, _c, _d, _e, _f;
      const i = o.analyzeOutputs.val.pressure;
      let s = -1 / 0, l = 1 / 0;
      if (i) for (const r of i.values()) for (const c of r) {
        const d = Math.abs(c) * le;
        d > s && (s = d), d < l && (l = d);
      }
      s === -1 / 0 && (s = 0, l = 0);
      const m = se;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
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
