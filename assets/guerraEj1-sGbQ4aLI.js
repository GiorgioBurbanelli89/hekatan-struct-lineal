import { b as Q, L as q, E as J, a as V } from "./theme-U-6D_qyI.js";
import { p as U, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
import { f as ee } from "./f2kPlateQ4-BZ9dGpgS.js";
import { c as ae } from "./cargaColumnaConsistente-DPcPMAlx.js";
let pe;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const se = {
    with_self_weight: {
      sigma_max_servicio_tm2: 13.264,
      sigma_min_servicio_tm2: 7.305
    },
    without_self_weight: {
      sigma_max_servicio_tm2: 11.86
    }
  }, ne = {
    sigma_max_tm2: 13.94,
    sigma_min_tm2: 8.28
  }, oe = {
    sigma_max_servicio_tm2: 13.163
  }, te = {
    safe_api_live: se,
    manual_libro_pag_19: ne,
    safe_libro_pag_36: oe
  }, F = 9.80665, ie = 1 / F;
  function le(n, l, d, o) {
    const i = new Q(o, o, d), t = new q(new J(i), new V({
      color: 11579568,
      linewidth: 2
    }));
    return t.position.set(n, l, d / 2), [
      t
    ];
  }
  pe = {
    id: "guerra-ej1-zapata-cuadrada",
    name: "Ej.1 \xB7 Zapata Aislada Cuadrada (3.45\xD73.45\xD70.45)",
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
      "EJ.1 del libro Guerra MDI \u2014 pag. 17-42 (modelado en SAFE: pag. 29-38)",
      "Zapata cuadrada 3.45\xD73.45 m, h=0.45 m, sobre Winkler ks=2920 t/m\xB3",
      "Cargas: D=91tonf+12tonf\xB7m, L=30tonf+5tonf\xB7m (sobre columna 45\xD745cm)",
      "Combo servicio: 1.0D+1.0L \u2192 \u03C3_max libro = 13.163 t/m\xB2 (SAFE) vs 13.94 t/m\xB2 (manual)",
      "Pressure colormap: FEM raw (ks\xB7w nodal) \u2192 patron CURVADO/radial como SAFE.",
      "  La placa flexible concentra la presion cerca de la columna y decae.",
      "  \u03C3_max al lado +X (magenta, max compresion), \u03C3_min al -X (cyan).",
      "Bending Mxx/Myy/Mxy: salida FEM cruda (plate Q4 Hekatan)."
    ],
    params: {
      B: {
        default: 3.45,
        min: 2.5,
        max: 5,
        step: 0.05,
        label: "B = L (m)"
      },
      h: {
        default: 0.45,
        min: 0.3,
        max: 0.8,
        step: 0.05,
        label: "h espesor (m)"
      },
      col_size: {
        default: 0.45,
        min: 0.2,
        max: 0.8,
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
      P_dead: {
        default: 91,
        min: 0,
        max: 300,
        step: 1,
        label: "P_D (tonf)"
      },
      M_dead: {
        default: 12,
        min: -40,
        max: 40,
        step: 0.5,
        label: "M_D (tonf\xB7m)"
      },
      P_live: {
        default: 30,
        min: 0,
        max: 200,
        step: 1,
        label: "P_L (tonf)"
      },
      M_live: {
        default: 5,
        min: -40,
        max: 40,
        step: 0.5,
        label: "M_L (tonf\xB7m)"
      },
      fc_kgcm2: {
        default: 280,
        min: 175,
        max: 600,
        step: 5,
        label: "f'c (kg/cm\xB2)"
      },
      nx: {
        default: 16,
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
    build(n, l) {
      const d = n.B, o = n.B, i = n.h, t = Math.round(n.nx), p = Math.round(n.ny), m = t + 1, y = p + 1, u = d / t, x = o / p, w = (n.P_dead + n.P_live) * F, M = (n.M_dead + n.M_live) * F, g = n.ks_tm3 * F, b = 14100 * Math.sqrt(n.fc_kgcm2) * 98.0665, C = 0.2, _ = [];
      for (let e = 0; e < y; ++e) for (let a = 0; a < m; ++a) _.push([
        a * u,
        e * x
      ]);
      const f = [];
      for (let e = 0; e < p; ++e) for (let a = 0; a < t; ++a) {
        const s = e * m + a;
        f.push([
          s,
          s + 1,
          s + m + 1,
          s + m
        ]);
      }
      const T = 2.4 * F * i, k = [], D = [];
      for (let e = 0; e < y; ++e) for (let a = 0; a < m; ++a) {
        const s = a === 0 || a === m - 1, c = e === 0 || e === y - 1, r = s && c ? 0.25 : s || c ? 0.5 : 1, A = u * x * r, h = e * m + a;
        if (k.push({
          node: h,
          dof: 0,
          k: g * A
        }), D.push({
          node: h,
          dof: 0,
          value: -T * A
        }), s && c) {
          const E = 1e-6 * g * u * x;
          k.push({
            node: h,
            dof: 1,
            k: E
          }), k.push({
            node: h,
            dof: 2,
            k: E
          });
        }
      }
      const S = d / 2, N = o / 2;
      ((e, a) => {
        let s = -1, c = 1 / 0;
        for (let r = 0; r < _.length; ++r) {
          const A = _[r][0] - e, h = _[r][1] - a, E = A * A + h * h;
          E < c && (c = E, s = r);
        }
        return s;
      })(S, N);
      const L = [];
      for (let e = 0; e < _.length; e++) {
        const a = _[e][0], s = _[e][1];
        Math.abs(a - S) <= n.col_size / 2 + 1e-6 && Math.abs(s - N) <= n.col_size / 2 + 1e-6 && L.push(e);
      }
      const Y = ae(_, f, w, S, N, n.col_size, n.col_size), G = M / L.length, P = [
        ...Y.pointLoads
      ];
      for (const e of L) P.push({
        node: e,
        dof: 2,
        value: G
      });
      const W = [
        ...P,
        ...D
      ], I = U({
        E: b,
        nu: C,
        thickness: i,
        theoryType: 0,
        bcType: "none",
        nodes: _,
        elements: f,
        bcs: [],
        pointLoads: W,
        springs: k
      }), K = _.map((e) => [
        e[0],
        e[1],
        0
      ]);
      l.nodes.val = K, l.elements.val = f;
      const z = /* @__PURE__ */ new Map(), Z = [
        2,
        3,
        4
      ];
      for (const e of P) {
        const a = z.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        a[Z[e.dof] ?? 2] += e.value, z.set(e.node, a);
      }
      l.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: z,
        ...ee(k, W)
      }, l.elementInputs.val = {
        elasticities: new Map(f.map((e, a) => [
          a,
          b
        ])),
        poissonsRatios: new Map(f.map((e, a) => [
          a,
          C
        ])),
        thicknesses: new Map(f.map((e, a) => [
          a,
          i
        ]))
      };
      const $ = /* @__PURE__ */ new Map();
      I.nodeResults.forEach((e, a) => $.set(a, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), l.deformOutputs.val = {
        deformations: $,
        reactions: /* @__PURE__ */ new Map()
      };
      const j = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      f.forEach((e, a) => {
        j.set(a, e.map((r) => -Math.abs(g * I.nodeResults[r].w)));
        const s = I.elementResults[a];
        B.set(a, [
          s.Mxx,
          s.Mxx,
          s.Mxx,
          s.Mxx
        ]), O.set(a, [
          s.Myy,
          s.Myy,
          s.Myy,
          s.Myy
        ]), R.set(a, [
          s.Mxy,
          s.Mxy,
          s.Mxy,
          s.Mxy
        ]);
        const c = Math.sqrt(s.Mxx ** 2 + s.Myy ** 2 - s.Mxx * s.Myy + 3 * s.Mxy ** 2);
        X.set(a, [
          c,
          c,
          c,
          c
        ]);
      }), l.analyzeOutputs.val = {
        pressure: j,
        bendingXX: B,
        bendingYY: O,
        bendingXY: R,
        vonMises: X
      };
      const H = [];
      H.push(...le(S, N, n.h_col, n.col_size)), l.objects3D.val = H;
    },
    computedLabels(n, l) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const d = l.analyzeOutputs.val.pressure;
      let o = -1 / 0, i = 1 / 0;
      if (d) for (const g of d.values()) for (const v of g) {
        const b = Math.abs(v) * ie;
        b > o && (o = b), b < i && (i = b);
      }
      o === -1 / 0 && (o = 0, i = 0);
      const t = te, p = (_b = (_a = t == null ? void 0 : t.safe_api_live) == null ? void 0 : _a.with_self_weight) == null ? void 0 : _b.sigma_max_servicio_tm2, m = (_d = (_c = t == null ? void 0 : t.safe_api_live) == null ? void 0 : _c.with_self_weight) == null ? void 0 : _d.sigma_min_servicio_tm2, y = (_f = (_e = t == null ? void 0 : t.safe_api_live) == null ? void 0 : _e.without_self_weight) == null ? void 0 : _f.sigma_max_servicio_tm2, u = (_g = t == null ? void 0 : t.safe_libro_pag_36) == null ? void 0 : _g.sigma_max_servicio_tm2, x = (_h = t == null ? void 0 : t.manual_libro_pag_19) == null ? void 0 : _h.sigma_max_tm2, w = (_i = t == null ? void 0 : t.manual_libro_pag_19) == null ? void 0 : _i.sigma_min_tm2, M = (g, v) => v === void 0 || v === 0 ? "\u2014" : `${((g - v) / v * 100).toFixed(2)} %`;
      return {
        "\u{1F4CA} \u03C3_max Hekatan (con SW)": `${o.toFixed(3)} t/m\xB2`,
        "\u{1F7E2} \u03C3_max SAFE API (con SW)": p !== void 0 ? `${p.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F7E1} \u03C3_max SAFE API (sin SW)": y !== void 0 ? `${y.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4DA} \u03C3_max SAFE (libro p.36)": u !== void 0 ? `${u.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4D8} \u03C3_max manual (libro p.19)": x !== void 0 ? `${x.toFixed(3)} t/m\xB2` : "\u2014",
        "\u0394 Hekatan vs SAFE API": M(o, p),
        "\u0394 Hekatan vs SAFE libro": M(o, u),
        "\u0394 Hekatan vs manual": M(o, x),
        "\u{1F4CA} \u03C3_min Hekatan": `${i.toFixed(3)} t/m\xB2`,
        "\u{1F7E2} \u03C3_min SAFE API (con SW)": m !== void 0 ? `${m.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4D8} \u03C3_min manual (libro p.19)": w !== void 0 ? `${w.toFixed(3)} t/m\xB2` : "\u2014",
        "\u0394 \u03C3_min vs SAFE API": M(i, m),
        "\u0394 \u03C3_min vs manual": M(i, w)
      };
    }
  };
});
export {
  __tla,
  pe as g
};
