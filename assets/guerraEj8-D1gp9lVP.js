import { c as G, L as F, E as $, b as K } from "./Text-C1TX4d8g.js";
import { p as H, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
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
    q_adm_tm2: 7,
    R_total_servicio_tonf: 2535
  }, V = {
    sigma_promedio_tm2: 5.85
  }, W = {
    inputs: Q,
    manual_libro: V
  }, b = 9.80665, Z = 1 / b;
  function U(s, a, d, l) {
    const m = new G(l, l, d), c = new F(new $(m), new K({
      color: 11579568,
      linewidth: 2
    }));
    return c.position.set(s, a, d / 2), [
      c
    ];
  }
  let I;
  I = [
    {
      name: "A1",
      x: 1,
      y: 19.4,
      P: 142
    },
    {
      name: "A2",
      x: 1,
      y: 14.9,
      P: 153
    },
    {
      name: "A3",
      x: 1,
      y: 7.1,
      P: 112
    },
    {
      name: "A4",
      x: 1,
      y: 1.6,
      P: 107
    },
    {
      name: "B1",
      x: 7,
      y: 19.4,
      P: 201
    },
    {
      name: "B2",
      x: 7,
      y: 14.9,
      P: 219
    },
    {
      name: "B3",
      x: 7,
      y: 7.1,
      P: 137
    },
    {
      name: "B4",
      x: 7,
      y: 1.6,
      P: 147
    },
    {
      name: "C1",
      x: 14.5,
      y: 19.4,
      P: 233
    },
    {
      name: "C2",
      x: 14.5,
      y: 14.9,
      P: 253
    },
    {
      name: "C3",
      x: 14.5,
      y: 7.1,
      P: 161
    },
    {
      name: "C4",
      x: 14.5,
      y: 1.6,
      P: 164
    },
    {
      name: "D1",
      x: 21.5,
      y: 19.4,
      P: 161
    },
    {
      name: "D2",
      x: 21.5,
      y: 14.9,
      P: 219
    },
    {
      name: "D3",
      x: 21.5,
      y: 7.1,
      P: 129
    },
    {
      name: "D4",
      x: 21.5,
      y: 1.6,
      P: 129
    }
  ];
  ae = {
    id: "guerra-ej8-losa-cimentacion",
    name: "Ej.8 \xB7 Losa de Cimentaci\xF3n (Raft 23\xD721m, 16 cols)",
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
      "EJ.8 pag.149-170. Losa de cimentaci\xF3n (raft).",
      "L=23m \xD7 B=21m, h=0.80m. Grid 4\xD74 = 16 columnas 60\xD760cm.",
      "f'c=240, q_adm=7 (suelo flojo \u2192 losa grande).",
      "Libro pag.151: \u03C3 uniforme ~5.85 t/m\xB2 (entre 5.45-6.01 por col)."
    ],
    params: {
      L: {
        default: 23,
        min: 15,
        max: 35,
        step: 0.5,
        label: "L total (m)"
      },
      B: {
        default: 21,
        min: 15,
        max: 30,
        step: 0.5,
        label: "B total (m)"
      },
      h: {
        default: 0.8,
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
        default: 1500,
        min: 500,
        max: 4e3,
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
      P_scale: {
        default: 1,
        min: 0.1,
        max: 2,
        step: 0.1,
        label: "P scale"
      },
      nx: {
        default: 40,
        min: 20,
        max: 64,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 36,
        min: 16,
        max: 56,
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
    build(s, a) {
      const d = s.L, l = s.B, m = s.h, c = Math.round(s.nx), x = Math.round(s.ny), i = c + 1, r = x + 1, h = d / c, g = l / x, P = s.ks_tm3 * b, L = 14100 * Math.sqrt(s.fc_kgcm2) * 98.0665, C = 0.2, u = [];
      for (let e = 0; e < r; ++e) for (let n = 0; n < i; ++n) u.push([
        n * h,
        e * g
      ]);
      const f = [];
      for (let e = 0; e < x; ++e) for (let n = 0; n < c; ++n) {
        const t = e * i + n;
        f.push([
          t,
          t + 1,
          t + i + 1,
          t + i
        ]);
      }
      const O = 2.4 * b * m, _ = [], N = [];
      for (let e = 0; e < r; ++e) for (let n = 0; n < i; ++n) {
        const t = n === 0 || n === i - 1, o = e === 0 || e === r - 1, p = t && o ? 0.25 : t || o ? 0.5 : 1, M = h * g * p, y = e * i + n;
        if (_.push({
          node: y,
          dof: 0,
          k: P * M
        }), N.push({
          node: y,
          dof: 0,
          value: -O * M
        }), t && o) {
          const D = 1e-6 * P * h * g;
          _.push({
            node: y,
            dof: 1,
            k: D
          }), _.push({
            node: y,
            dof: 2,
            k: D
          });
        }
      }
      const S = (e, n) => {
        const t = [];
        for (let o = 0; o < u.length; o++) {
          const p = u[o][0], M = u[o][1];
          Math.abs(p - e) <= s.col_size / 2 + 1e-6 && Math.abs(M - n) <= s.col_size / 2 + 1e-6 && t.push(o);
        }
        return t;
      }, v = [];
      for (const e of I) {
        const n = e.P * s.P_scale * b, t = S(e.x, e.y);
        if (t.length === 0) continue;
        const o = n / t.length;
        for (const p of t) v.push({
          node: p,
          dof: 0,
          value: -o
        });
      }
      const R = [
        ...v,
        ...N
      ], k = H({
        E: L,
        nu: C,
        thickness: m,
        theoryType: 0,
        bcType: "none",
        nodes: u,
        elements: f,
        bcs: [],
        pointLoads: R,
        springs: _
      }), B = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
      f.forEach((e, n) => {
        B.set(n, e.map((p) => -Math.abs(P * k.nodeResults[p].w)));
        const t = k.elementResults[n];
        E.set(n, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), X.set(n, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), Y.set(n, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]);
        const o = Math.sqrt(t.Mxx ** 2 + t.Myy ** 2 - t.Mxx * t.Myy + 3 * t.Mxy ** 2);
        z.set(n, [
          o,
          o,
          o,
          o
        ]);
      });
      const T = u.map((e) => [
        e[0],
        e[1],
        0
      ]);
      a.nodes.val = T, a.elements.val = f;
      const w = /* @__PURE__ */ new Map(), q = [
        2,
        3,
        4
      ];
      for (const e of v) {
        const n = w.get(e.node) ?? [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        n[q[e.dof] ?? 2] += e.value, w.set(e.node, n);
      }
      a.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: w,
        ...J(_, R)
      }, a.elementInputs.val = {
        elasticities: new Map(f.map((e, n) => [
          n,
          L
        ])),
        poissonsRatios: new Map(f.map((e, n) => [
          n,
          C
        ])),
        thicknesses: new Map(f.map((e, n) => [
          n,
          m
        ]))
      };
      const j = /* @__PURE__ */ new Map();
      k.nodeResults.forEach((e, n) => j.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), a.deformOutputs.val = {
        deformations: j,
        reactions: /* @__PURE__ */ new Map()
      }, a.analyzeOutputs.val = {
        pressure: B,
        bendingXX: E,
        bendingYY: X,
        bendingXY: Y,
        vonMises: z
      };
      const A = [];
      for (const e of I) A.push(...U(e.x, e.y, s.h_col, s.col_size));
      a.objects3D.val = A;
    },
    computedLabels(s, a) {
      var _a, _b, _c;
      const d = a.analyzeOutputs.val.pressure;
      let l = -1 / 0, m = 1 / 0;
      if (d) for (const x of d.values()) for (const i of x) {
        const r = Math.abs(i) * Z;
        r > l && (l = r), r < m && (m = r);
      }
      l === -1 / 0 && (l = 0, m = 0);
      const c = W;
      return {
        "\u{1F4CA} \u03C3_max Hekatan": `${l.toFixed(3)} t/m\xB2`,
        "\u{1F4CA} \u03C3_min Hekatan": `${m.toFixed(3)} t/m\xB2`,
        "\u{1F4D8} \u03C3 promedio libro": `${(_a = c == null ? void 0 : c.manual_libro) == null ? void 0 : _a.sigma_promedio_tm2} t/m\xB2`,
        "\u{1F4D8} q_adm libro": `${(_b = c == null ? void 0 : c.inputs) == null ? void 0 : _b.q_adm_tm2} t/m\xB2`,
        "\u{1F4D8} R_total libro": `${(_c = c == null ? void 0 : c.inputs) == null ? void 0 : _c.R_total_servicio_tonf} t`
      };
    }
  };
});
export {
  __tla,
  ae as g
};
