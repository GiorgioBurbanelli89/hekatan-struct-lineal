import { c as K, L as V, E as $, b as H } from "./Text-C1TX4d8g.js";
import { p as q, __tla as __tla_0 } from "./didacticCpp-ClOTguHC.js";
import { f as J } from "./f2kPlateQ4-BZ9dGpgS.js";
let ae;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const Q = {
    Ru_tonf: 971.85,
    x_centroide_m: 8.514
  }, W = {
    manual_libro: Q
  }, l = 9.80665, Z = 1 / l;
  function U(o, a, f, c) {
    const i = new K(c, c, f), m = new V(new $(i), new H({
      color: 11579568,
      linewidth: 2
    }));
    return m.position.set(o, a, f / 2), [
      m
    ];
  }
  ae = {
    id: "guerra-ej7-viga-cimentacion-new",
    name: "Ej.7 NEW \xB7 Viga Cimentaci\xF3n L=17.20m (4 cols)",
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
      "EJ.7 pag.135-148. Viga de cimentaci\xF3n con 4 columnas.",
      "L=17.20m, B=1.50m. Cols 60\xD760cm.",
      "Cargas (P_D, M_D, P_L, M_L): C1(90,3,37.5,1.5), C2(130,4,57.5,2.75), C3(145,-6,65,-3), C4(95,-3,33,-1.5)"
    ],
    params: {
      L: {
        default: 17.2,
        min: 10,
        max: 25,
        step: 0.1,
        label: "L (m)"
      },
      B: {
        default: 1.5,
        min: 1,
        max: 3,
        step: 0.05,
        label: "B (m)"
      },
      h: {
        default: 0.85,
        min: 0.5,
        max: 1.5,
        step: 0.05,
        label: "h (m)"
      },
      col_size: {
        default: 0.6,
        min: 0.3,
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
      fc_kgcm2: {
        default: 240,
        min: 175,
        max: 600,
        step: 5,
        label: "f'c (kg/cm\xB2)"
      },
      nx: {
        default: 32,
        min: 12,
        max: 48,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 8,
        min: 4,
        max: 16,
        step: 2,
        label: "ny mesh"
      },
      h_col: {
        default: 0.8,
        min: 0.2,
        max: 2,
        step: 0.1,
        label: "Hcol viz (m)"
      }
    },
    build(o, a) {
      const f = o.L, c = o.B, i = o.h, m = Math.round(o.nx), x = Math.round(o.ny), r = m + 1, d = x + 1, y = f / m, g = c / x, v = o.ks_tm3 * l, L = 14100 * Math.sqrt(o.fc_kgcm2) * 98.0665, C = 0.2, P = [
        {
          x: 0.3,
          P: (90 + 37.5) * l,
          M: (3 + 1.5) * l
        },
        {
          x: 5.3,
          P: (130 + 57.5) * l,
          M: (4 + 2.75) * l
        },
        {
          x: 11.3,
          P: 210 * l,
          M: -9 * l
        },
        {
          x: 16.9,
          P: 128 * l,
          M: (-3 + -1.5) * l
        }
      ], M = [];
      for (let n = 0; n < d; ++n) for (let e = 0; e < r; ++e) M.push([
        e * y,
        n * g
      ]);
      const p = [];
      for (let n = 0; n < x; ++n) for (let e = 0; e < m; ++e) {
        const s = n * r + e;
        p.push([
          s,
          s + 1,
          s + r + 1,
          s + r
        ]);
      }
      const A = 2.4 * l * i, _ = [], E = [];
      for (let n = 0; n < d; ++n) for (let e = 0; e < r; ++e) {
        const s = e === 0 || e === r - 1, t = n === 0 || n === d - 1, u = s && t ? 0.25 : s || t ? 0.5 : 1, O = y * g * u, h = n * r + e;
        if (_.push({
          node: h,
          dof: 0,
          k: v * O
        }), E.push({
          node: h,
          dof: 0,
          value: -A * O
        }), s && t) {
          const T = 1e-6 * v * y * g;
          _.push({
            node: h,
            dof: 1,
            k: T
          }), _.push({
            node: h,
            dof: 2,
            k: T
          });
        }
      }
      const N = c / 2, D = (n) => {
        const e = [];
        for (let s = 0; s < M.length; s++) {
          const t = M[s][0], u = M[s][1];
          Math.abs(t - n) <= o.col_size / 2 + 1e-6 && Math.abs(u - N) <= o.col_size / 2 + 1e-6 && e.push(s);
        }
        return e;
      }, b = [];
      for (const n of P) {
        const e = D(n.x);
        if (e.length === 0) continue;
        const s = n.P / e.length, t = n.M / e.length;
        for (const u of e) b.push({
          node: u,
          dof: 0,
          value: -s
        }), b.push({
          node: u,
          dof: 2,
          value: t
        });
      }
      const X = [
        ...b,
        ...E
      ], w = q({
        E: L,
        nu: C,
        thickness: i,
        theoryType: 0,
        bcType: "none",
        nodes: M,
        elements: p,
        bcs: [],
        pointLoads: X,
        springs: _
      }), Y = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map();
      p.forEach((n, e) => {
        Y.set(e, n.map((u) => -Math.abs(v * w.nodeResults[u].w)));
        const s = w.elementResults[e];
        z.set(e, [
          s.Mxx,
          s.Mxx,
          s.Mxx,
          s.Mxx
        ]), R.set(e, [
          s.Myy,
          s.Myy,
          s.Myy,
          s.Myy
        ]), j.set(e, [
          s.Mxy,
          s.Mxy,
          s.Mxy,
          s.Mxy
        ]);
        const t = Math.sqrt(s.Mxx ** 2 + s.Myy ** 2 - s.Mxx * s.Myy + 3 * s.Mxy ** 2);
        S.set(e, [
          t,
          t,
          t,
          t
        ]);
      });
      const F = M.map((n) => [
        n[0],
        n[1],
        0
      ]);
      a.nodes.val = F, a.elements.val = p;
      const k = /* @__PURE__ */ new Map(), G = [
        2,
        3,
        4
      ];
      for (const n of b) {
        const e = k.get(n.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        e[G[n.dof] ?? 2] += n.value, k.set(n.node, e);
      }
      a.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: k,
        ...J(_, X)
      }, a.elementInputs.val = {
        elasticities: new Map(p.map((n, e) => [
          e,
          L
        ])),
        poissonsRatios: new Map(p.map((n, e) => [
          e,
          C
        ])),
        thicknesses: new Map(p.map((n, e) => [
          e,
          i
        ]))
      };
      const B = /* @__PURE__ */ new Map();
      w.nodeResults.forEach((n, e) => B.set(e, [
        0,
        0,
        n.w,
        n.bx,
        n.by,
        0
      ])), a.deformOutputs.val = {
        deformations: B,
        reactions: /* @__PURE__ */ new Map()
      }, a.analyzeOutputs.val = {
        pressure: Y,
        bendingXX: z,
        bendingYY: R,
        bendingXY: j,
        vonMises: S
      };
      const I = [];
      for (const n of P) I.push(...U(n.x, N, o.h_col, o.col_size));
      a.objects3D.val = I;
    },
    computedLabels(o, a) {
      var _a, _b;
      const f = a.analyzeOutputs.val.pressure;
      let c = -1 / 0, i = 1 / 0;
      if (f) for (const x of f.values()) for (const r of x) {
        const d = Math.abs(r) * Z;
        d > c && (c = d), d < i && (i = d);
      }
      c === -1 / 0 && (c = 0, i = 0);
      const m = W;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${c.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${i.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} Ru \xFAltimo libro": `${(_a = m == null ? void 0 : m.manual_libro) == null ? void 0 : _a.Ru_tonf} t`,
        "\u{1F4D8} x centroide": `${(_b = m == null ? void 0 : m.manual_libro) == null ? void 0 : _b.x_centroide_m} m`
      };
    }
  };
});
export {
  __tla,
  ae as g
};
