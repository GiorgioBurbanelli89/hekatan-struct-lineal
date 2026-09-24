import { c as V, L as W, E as U, b as ee } from "./Text-C1TX4d8g.js";
import { p as ne, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
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
    e_DL_m: 0.79,
    e_DLS_m: 0.84,
    L_sobre_6_m: 0.65,
    iteration_1: {
      sigma_max_tm2: 21.07
    }
  }, se = {
    manual_libro: oe
  }, g = 9.80665, le = 1 / g;
  function me(a, o, r, s, l) {
    const m = new V(s, l, r), c = new W(new U(m), new ee({
      color: 11579568,
      linewidth: 2
    }));
    return c.position.set(a, o, r / 2), [
      c
    ];
  }
  fe = {
    id: "guerra-ej2-zapata-rectangular-sismo",
    name: "Ej.2 \xB7 Zapata Rectangular + Sismo (4.60\xD74.00\xD70.55)",
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
    build(a, o) {
      const r = a.L, s = a.B, l = a.h, m = Math.round(a.nx), c = Math.round(a.ny), i = m + 1, M = c + 1, p = r / m, x = s / c, y = Math.round(a.combo);
      let d, L;
      y === 1 ? (d = a.P_dead + a.P_live + a.P_sismo, L = a.M_dead + a.M_live + a.M_sismo) : (d = a.P_dead + a.P_live, L = a.M_dead + a.M_live);
      const G = d * g, K = L * g, v = a.ks_tm3 * g, X = 14100 * Math.sqrt(a.fc_kgcm2) * 98.0665, Y = 0.2, f = [];
      for (let e = 0; e < M; ++e) for (let n = 0; n < i; ++n) f.push([
        n * p,
        e * x
      ]);
      const _ = [];
      for (let e = 0; e < c; ++e) for (let n = 0; n < m; ++n) {
        const t = e * i + n;
        _.push([
          t,
          t + 1,
          t + i + 1,
          t + i
        ]);
      }
      const Z = 2.4 * g * l, b = [], z = [];
      for (let e = 0; e < M; ++e) for (let n = 0; n < i; ++n) {
        const t = n === 0 || n === i - 1, u = e === 0 || e === M - 1, N = t && u ? 0.25 : t || u ? 0.5 : 1, A = p * x * N, h = e * i + n;
        if (b.push({
          node: h,
          dof: 0,
          k: v * A
        }), z.push({
          node: h,
          dof: 0,
          value: -Z * A
        }), t && u) {
          const $ = 1e-6 * v * p * x;
          b.push({
            node: h,
            dof: 1,
            k: $
          }), b.push({
            node: h,
            dof: 2,
            k: $
          });
        }
      }
      const k = r / 2, w = s / 2, P = [];
      for (let e = 0; e < f.length; e++) {
        const n = f[e][0], t = f[e][1];
        Math.abs(n - k) <= a.col_x / 2 + 1e-6 && Math.abs(t - w) <= a.col_y / 2 + 1e-6 && P.push(e);
      }
      const q = te(f, _, G, k, w, a.col_x, a.col_y), H = K / P.length, D = [
        ...q.pointLoads
      ];
      for (const e of P) D.push({
        node: e,
        dof: 2,
        value: H
      });
      const j = [
        ...D,
        ...z
      ], S = ne({
        E: X,
        nu: Y,
        thickness: l,
        theoryType: 0,
        bcType: "none",
        nodes: f,
        elements: _,
        bcs: [],
        pointLoads: j,
        springs: b
      }), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map();
      _.forEach((e, n) => {
        C.set(n, e.map((N) => -Math.abs(v * S.nodeResults[N].w)));
        const t = S.elementResults[n];
        F.set(n, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), I.set(n, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), R.set(n, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]);
        const u = Math.sqrt(t.Mxx ** 2 + t.Myy ** 2 - t.Mxx * t.Myy + 3 * t.Mxy ** 2);
        B.set(n, [
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
      const E = /* @__PURE__ */ new Map(), Q = [
        2,
        3,
        4
      ];
      for (const e of D) {
        const n = E.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[Q[e.dof] ?? 2] += e.value, E.set(e.node, n);
      }
      o.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: E,
        ...ae(b, j)
      }, o.elementInputs.val = {
        elasticities: new Map(_.map((e, n) => [
          n,
          X
        ])),
        poissonsRatios: new Map(_.map((e, n) => [
          n,
          Y
        ])),
        thicknesses: new Map(_.map((e, n) => [
          n,
          l
        ]))
      };
      const O = /* @__PURE__ */ new Map();
      S.nodeResults.forEach((e, n) => O.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), o.deformOutputs.val = {
        deformations: O,
        reactions: /* @__PURE__ */ new Map()
      }, o.analyzeOutputs.val = {
        pressure: C,
        bendingXX: F,
        bendingYY: I,
        bendingXY: R,
        vonMises: B
      };
      const T = [];
      T.push(...me(k, w, a.h_col, a.col_x, a.col_y)), o.objects3D.val = T;
    },
    computedLabels(a, o) {
      var _a, _b, _c, _d, _e;
      const r = o.analyzeOutputs.val.pressure;
      let s = -1 / 0, l = 1 / 0;
      if (r) for (const x of r.values()) for (const y of x) {
        const d = Math.abs(y) * le;
        d > s && (s = d), d < l && (l = d);
      }
      s === -1 / 0 && (s = 0, l = 0);
      const m = se, c = (_b = (_a = m == null ? void 0 : m.manual_libro) == null ? void 0 : _a.iteration_1) == null ? void 0 : _b.sigma_max_tm2, i = (_c = m == null ? void 0 : m.manual_libro) == null ? void 0 : _c.e_DL_m, M = (_d = m == null ? void 0 : m.manual_libro) == null ? void 0 : _d.e_DLS_m, p = (_e = m == null ? void 0 : m.manual_libro) == null ? void 0 : _e.L_sobre_6_m;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${s.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${l.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3_max iter1 (libro)": c ? `${c.toFixed(2)} t/m\xB2 (L=3.90)` : "\u2014",
        "\u{1F4D8} e (D+L) libro": i ? `${i.toFixed(3)} m` : "\u2014",
        "\u{1F4D8} e (D+L+S) libro": M ? `${M.toFixed(3)} m` : "\u2014",
        "\u{1F4D8} L/6": p ? `${p.toFixed(3)} m` : "\u2014",
        "\u26A0\uFE0F Excentricidad": "e > L/6 \u2192 zona de despegue (libro pag.43)"
      };
    }
  };
});
export {
  __tla,
  fe as g
};
