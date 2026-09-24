import { c as Q, L as q, E as J, b as V } from "./Text-C1TX4d8g.js";
import { p as U, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
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
  const ne = {
    with_self_weight: {
      sigma_max_servicio_tm2: 13.264,
      sigma_min_servicio_tm2: 7.305
    },
    without_self_weight: {
      sigma_max_servicio_tm2: 11.86
    }
  }, se = {
    sigma_max_tm2: 13.94,
    sigma_min_tm2: 8.28
  }, te = {
    sigma_max_servicio_tm2: 13.163
  }, oe = {
    safe_api_live: ne,
    manual_libro_pag_19: se,
    safe_libro_pag_36: te
  }, E = 9.80665, ie = 1 / E;
  function me(s, m, d, t) {
    const i = new Q(t, t, d), o = new q(new J(i), new V({
      color: 11579568,
      linewidth: 2
    }));
    return o.position.set(s, m, d / 2), [
      o
    ];
  }
  pe = {
    id: "guerra-ej1-zapata-cuadrada",
    name: "Ej.1 \xB7 Zapata Aislada Cuadrada (3.45\xD73.45\xD70.45)",
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
    build(s, m) {
      const d = s.B, t = s.B, i = s.h, o = Math.round(s.nx), p = Math.round(s.ny), l = o + 1, y = p + 1, u = d / o, x = t / p, w = (s.P_dead + s.P_live) * E, M = (s.M_dead + s.M_live) * E, g = s.ks_tm3 * E, v = 14100 * Math.sqrt(s.fc_kgcm2) * 98.0665, X = 0.2, r = [];
      for (let e = 0; e < y; ++e) for (let a = 0; a < l; ++a) r.push([
        a * u,
        e * x
      ]);
      const f = [];
      for (let e = 0; e < p; ++e) for (let a = 0; a < o; ++a) {
        const n = e * l + a;
        f.push([
          n,
          n + 1,
          n + l + 1,
          n + l
        ]);
      }
      const H = 2.4 * E * i, k = [], C = [];
      for (let e = 0; e < y; ++e) for (let a = 0; a < l; ++a) {
        const n = a === 0 || a === l - 1, c = e === 0 || e === y - 1, _ = n && c ? 0.25 : n || c ? 0.5 : 1, A = u * x * _, h = e * l + a;
        if (k.push({
          node: h,
          dof: 0,
          k: g * A
        }), C.push({
          node: h,
          dof: 0,
          value: -H * A
        }), n && c) {
          const S = 1e-6 * g * u * x;
          k.push({
            node: h,
            dof: 1,
            k: S
          }), k.push({
            node: h,
            dof: 2,
            k: S
          });
        }
      }
      const F = d / 2, P = t / 2;
      ((e, a) => {
        let n = -1, c = 1 / 0;
        for (let _ = 0; _ < r.length; ++_) {
          const A = r[_][0] - e, h = r[_][1] - a, S = A * A + h * h;
          S < c && (c = S, n = _);
        }
        return n;
      })(F, P);
      const N = [];
      for (let e = 0; e < r.length; e++) {
        const a = r[e][0], n = r[e][1];
        Math.abs(a - F) <= s.col_size / 2 + 1e-6 && Math.abs(n - P) <= s.col_size / 2 + 1e-6 && N.push(e);
      }
      const T = ae(r, f, w, F, P, s.col_size, s.col_size), G = M / N.length, L = [
        ...T.pointLoads
      ];
      for (const e of N) L.push({
        node: e,
        dof: 2,
        value: G
      });
      const Y = [
        ...L,
        ...C
      ], I = U({
        E: v,
        nu: X,
        thickness: i,
        theoryType: 0,
        bcType: "none",
        nodes: r,
        elements: f,
        bcs: [],
        pointLoads: Y,
        springs: k
      }), K = r.map((e) => [
        e[0],
        e[1],
        0
      ]);
      m.nodes.val = K, m.elements.val = f;
      const z = /* @__PURE__ */ new Map(), Z = [
        2,
        3,
        4
      ];
      for (const e of L) {
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
      m.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: z,
        ...ee(k, Y)
      }, m.elementInputs.val = {
        elasticities: new Map(f.map((e, a) => [
          a,
          v
        ])),
        poissonsRatios: new Map(f.map((e, a) => [
          a,
          X
        ])),
        thicknesses: new Map(f.map((e, a) => [
          a,
          i
        ]))
      };
      const D = /* @__PURE__ */ new Map();
      I.nodeResults.forEach((e, a) => D.set(a, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), m.deformOutputs.val = {
        deformations: D,
        reactions: /* @__PURE__ */ new Map()
      };
      const W = /* @__PURE__ */ new Map(), $ = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
      f.forEach((e, a) => {
        W.set(a, e.map((_) => -Math.abs(g * I.nodeResults[_].w)));
        const n = I.elementResults[a];
        $.set(a, [
          n.Mxx,
          n.Mxx,
          n.Mxx,
          n.Mxx
        ]), j.set(a, [
          n.Myy,
          n.Myy,
          n.Myy,
          n.Myy
        ]), B.set(a, [
          n.Mxy,
          n.Mxy,
          n.Mxy,
          n.Mxy
        ]);
        const c = Math.sqrt(n.Mxx ** 2 + n.Myy ** 2 - n.Mxx * n.Myy + 3 * n.Mxy ** 2);
        O.set(a, [
          c,
          c,
          c,
          c
        ]);
      }), m.analyzeOutputs.val = {
        pressure: W,
        bendingXX: $,
        bendingYY: j,
        bendingXY: B,
        vonMises: O
      };
      const R = [];
      R.push(...me(F, P, s.h_col, s.col_size)), m.objects3D.val = R;
    },
    computedLabels(s, m) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      const d = m.analyzeOutputs.val.pressure;
      let t = -1 / 0, i = 1 / 0;
      if (d) for (const g of d.values()) for (const b of g) {
        const v = Math.abs(b) * ie;
        v > t && (t = v), v < i && (i = v);
      }
      t === -1 / 0 && (t = 0, i = 0);
      const o = oe, p = (_b = (_a = o == null ? void 0 : o.safe_api_live) == null ? void 0 : _a.with_self_weight) == null ? void 0 : _b.sigma_max_servicio_tm2, l = (_d = (_c = o == null ? void 0 : o.safe_api_live) == null ? void 0 : _c.with_self_weight) == null ? void 0 : _d.sigma_min_servicio_tm2, y = (_f = (_e = o == null ? void 0 : o.safe_api_live) == null ? void 0 : _e.without_self_weight) == null ? void 0 : _f.sigma_max_servicio_tm2, u = (_g = o == null ? void 0 : o.safe_libro_pag_36) == null ? void 0 : _g.sigma_max_servicio_tm2, x = (_h = o == null ? void 0 : o.manual_libro_pag_19) == null ? void 0 : _h.sigma_max_tm2, w = (_i = o == null ? void 0 : o.manual_libro_pag_19) == null ? void 0 : _i.sigma_min_tm2, M = (g, b) => b === void 0 || b === 0 ? "\u2014" : `${((g - b) / b * 100).toFixed(2)} %`;
      return {
        "\u{1F4CA} \u03C3_max Hekatan (con SW)": `${t.toFixed(3)} t/m\xB2`,
        "\u{1F7E2} \u03C3_max SAFE API (con SW)": p !== void 0 ? `${p.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F7E1} \u03C3_max SAFE API (sin SW)": y !== void 0 ? `${y.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4DA} \u03C3_max SAFE (libro p.36)": u !== void 0 ? `${u.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4D8} \u03C3_max manual (libro p.19)": x !== void 0 ? `${x.toFixed(3)} t/m\xB2` : "\u2014",
        "\u0394 Hekatan vs SAFE API": M(t, p),
        "\u0394 Hekatan vs SAFE libro": M(t, u),
        "\u0394 Hekatan vs manual": M(t, x),
        "\u{1F4CA} \u03C3_min Hekatan": `${i.toFixed(3)} t/m\xB2`,
        "\u{1F7E2} \u03C3_min SAFE API (con SW)": l !== void 0 ? `${l.toFixed(3)} t/m\xB2` : "\u2014",
        "\u{1F4D8} \u03C3_min manual (libro p.19)": w !== void 0 ? `${w.toFixed(3)} t/m\xB2` : "\u2014",
        "\u0394 \u03C3_min vs SAFE API": M(i, l),
        "\u0394 \u03C3_min vs manual": M(i, w)
      };
    }
  };
});
export {
  __tla,
  pe as g
};
