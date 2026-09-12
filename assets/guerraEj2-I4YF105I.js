import { c as V, L as W, E as U, b as ee } from "./theme-DQ--CgsI.js";
import { p as oe, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { f as ne } from "./f2kPlateQ4-BZ9dGpgS.js";
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
  const ae = {
    e_DL_m: 0.79,
    e_DLS_m: 0.84,
    L_sobre_6_m: 0.65,
    iteration_1: {
      sigma_max_tm2: 21.07
    }
  }, se = {
    manual_libro: ae
  }, g = 9.80665, le = 1 / g;
  function me(n, a, r, s, l) {
    const m = new V(s, l, r), i = new W(new U(m), new ee({
      color: 11579568,
      linewidth: 2
    }));
    return i.position.set(n, a, r / 2), [
      i
    ];
  }
  fe = {
    id: "guerra-ej2-zapata-rectangular-sismo",
    name: "Ej.2 \xB7 Zapata Rectangular + Sismo (4.60\xD74.00\xD70.55)",
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
      "EJ.2 Guerra MDI - pag. 42-58. Zapata rectangular bajo carga s\xEDsmica.",
      "L=4.60m, B=4.00m, h=0.55m. Columna 1.20\xD70.60m (rectangular).",
      "Cargas D+L+S: P=124t, M=105t\xB7m \u2192 excentricidad e=0.84m > L/6=0.65m",
      "Excentricidad grande \u2192 zona de despegue (parte de zapata no en contacto).",
      "Libro: \u03C3_max iter1 (L=3.90, B=3.30) = 21.07 t/m\xB2 >q_adm. Iter2 dimensiones finales.",
      "Combo seleccion: D+L (servicio) o D+L+S (servicio+sismo) en el slider 'combo'."
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
        default: 2920,
        min: 500,
        max: 8e3,
        step: 50,
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
        default: 36,
        min: 0,
        max: 100,
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
    build(n, a) {
      const r = n.L, s = n.B, l = n.h, m = Math.round(n.nx), i = Math.round(n.ny), c = m + 1, M = i + 1, x = r / m, p = s / i, h = Math.round(n.combo);
      let d, L;
      h === 1 ? (d = n.P_dead + n.P_live + n.P_sismo, L = n.M_dead + n.M_live + n.M_sismo) : (d = n.P_dead + n.P_live, L = n.M_dead + n.M_live);
      const G = d * g, K = L * g, v = n.ks_tm3 * g, z = 14100 * Math.sqrt(n.fc_kgcm2) * 98.0665, j = 0.2, f = [];
      for (let e = 0; e < M; ++e) for (let o = 0; o < c; ++o) f.push([
        o * x,
        e * p
      ]);
      const _ = [];
      for (let e = 0; e < i; ++e) for (let o = 0; o < m; ++o) {
        const t = e * c + o;
        _.push([
          t,
          t + 1,
          t + c + 1,
          t + c
        ]);
      }
      const Z = 2.4 * g * l, b = [], C = [];
      for (let e = 0; e < M; ++e) for (let o = 0; o < c; ++o) {
        const t = o === 0 || o === c - 1, u = e === 0 || e === M - 1, N = t && u ? 0.25 : t || u ? 0.5 : 1, Y = x * p * N, y = e * c + o;
        if (b.push({
          node: y,
          dof: 0,
          k: v * Y
        }), C.push({
          node: y,
          dof: 0,
          value: -Z * Y
        }), t && u) {
          const $ = 1e-6 * v * x * p;
          b.push({
            node: y,
            dof: 1,
            k: $
          }), b.push({
            node: y,
            dof: 2,
            k: $
          });
        }
      }
      const k = r / 2, w = s / 2, D = [];
      for (let e = 0; e < f.length; e++) {
        const o = f[e][0], t = f[e][1];
        Math.abs(o - k) <= n.col_x / 2 + 1e-6 && Math.abs(t - w) <= n.col_y / 2 + 1e-6 && D.push(e);
      }
      const q = te(f, _, G, k, w, n.col_x, n.col_y), H = K / D.length, P = [
        ...q.pointLoads
      ];
      for (const e of D) P.push({
        node: e,
        dof: 2,
        value: H
      });
      const F = [
        ...P,
        ...C
      ], E = oe({
        E: z,
        nu: j,
        thickness: l,
        theoryType: 0,
        bcType: "none",
        nodes: f,
        elements: _,
        bcs: [],
        pointLoads: F,
        springs: b
      }), I = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map();
      _.forEach((e, o) => {
        I.set(o, e.map((N) => -Math.abs(v * E.nodeResults[N].w)));
        const t = E.elementResults[o];
        R.set(o, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), B.set(o, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), O.set(o, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]);
        const u = Math.sqrt(t.Mxx ** 2 + t.Myy ** 2 - t.Mxx * t.Myy + 3 * t.Mxy ** 2);
        T.set(o, [
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
      a.nodes.val = J, a.elements.val = _;
      const S = /* @__PURE__ */ new Map(), Q = [
        2,
        3,
        4
      ];
      for (const e of P) {
        const o = S.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        o[Q[e.dof] ?? 2] += e.value, S.set(e.node, o);
      }
      a.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: S,
        ...ne(b, F)
      }, a.elementInputs.val = {
        elasticities: new Map(_.map((e, o) => [
          o,
          z
        ])),
        poissonsRatios: new Map(_.map((e, o) => [
          o,
          j
        ])),
        thicknesses: new Map(_.map((e, o) => [
          o,
          l
        ]))
      };
      const A = /* @__PURE__ */ new Map();
      E.nodeResults.forEach((e, o) => A.set(o, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), a.deformOutputs.val = {
        deformations: A,
        reactions: /* @__PURE__ */ new Map()
      }, a.analyzeOutputs.val = {
        pressure: I,
        bendingXX: R,
        bendingYY: B,
        bendingXY: O,
        vonMises: T
      };
      const X = [];
      X.push(...me(k, w, n.h_col, n.col_x, n.col_y)), a.objects3D.val = X;
    },
    computedLabels(n, a) {
      var _a, _b, _c, _d, _e;
      const r = a.analyzeOutputs.val.pressure;
      let s = -1 / 0, l = 1 / 0;
      if (r) for (const p of r.values()) for (const h of p) {
        const d = Math.abs(h) * le;
        d > s && (s = d), d < l && (l = d);
      }
      s === -1 / 0 && (s = 0, l = 0);
      const m = se, i = (_b = (_a = m == null ? void 0 : m.manual_libro) == null ? void 0 : _a.iteration_1) == null ? void 0 : _b.sigma_max_tm2, c = (_c = m == null ? void 0 : m.manual_libro) == null ? void 0 : _c.e_DL_m, M = (_d = m == null ? void 0 : m.manual_libro) == null ? void 0 : _d.e_DLS_m, x = (_e = m == null ? void 0 : m.manual_libro) == null ? void 0 : _e.L_sobre_6_m;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${l.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3_max iter1 (libro)": i ? `${i.toFixed(2)} t/m\xB2 (L=3.90)` : "\u2014",
        "\u{1F4D8} e (D+L) libro": c ? `${c.toFixed(3)} m` : "\u2014",
        "\u{1F4D8} e (D+L+S) libro": M ? `${M.toFixed(3)} m` : "\u2014",
        "\u{1F4D8} L/6": x ? `${x.toFixed(3)} m` : "\u2014",
        "\u26A0\uFE0F Excentricidad": "e > L/6 \u2192 zona de despegue (libro pag.43)"
      };
    }
  };
});
export {
  __tla,
  fe as g
};
