import { c as F, L as S, E as $, b as K } from "./theme-DQ--CgsI.js";
import { p as H, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
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
    const m = new F(l, l, d), c = new S(new $(m), new K({
      color: 11579568,
      linewidth: 2
    }));
    return c.position.set(s, a, d / 2), [
      c
    ];
  }
  let T;
  T = [
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
      "pressure",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "vonMises",
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
      const d = s.L, l = s.B, m = s.h, c = Math.round(s.nx), x = Math.round(s.ny), i = c + 1, r = x + 1, h = d / c, g = l / x, k = s.ks_tm3 * b, L = 14100 * Math.sqrt(s.fc_kgcm2) * 98.0665, C = 0.2, p = [];
      for (let e = 0; e < r; ++e) for (let n = 0; n < i; ++n) p.push([
        n * h,
        e * g
      ]);
      const f = [];
      for (let e = 0; e < x; ++e) for (let n = 0; n < c; ++n) {
        const o = e * i + n;
        f.push([
          o,
          o + 1,
          o + i + 1,
          o + i
        ]);
      }
      const q = 2.4 * b * m, _ = [], N = [];
      for (let e = 0; e < r; ++e) for (let n = 0; n < i; ++n) {
        const o = n === 0 || n === i - 1, t = e === 0 || e === r - 1, u = o && t ? 0.25 : o || t ? 0.5 : 1, y = h * g * u, M = e * i + n;
        if (_.push({
          node: M,
          dof: 0,
          k: k * y
        }), N.push({
          node: M,
          dof: 0,
          value: -q * y
        }), o && t) {
          const O = 1e-6 * k * h * g;
          _.push({
            node: M,
            dof: 1,
            k: O
          }), _.push({
            node: M,
            dof: 2,
            k: O
          });
        }
      }
      const G = (e, n) => {
        const o = [];
        for (let t = 0; t < p.length; t++) {
          const u = p[t][0], y = p[t][1];
          Math.abs(u - e) <= s.col_size / 2 + 1e-6 && Math.abs(y - n) <= s.col_size / 2 + 1e-6 && o.push(t);
        }
        return o;
      }, v = [];
      for (const e of T) {
        const n = e.P * s.P_scale * b, o = G(e.x, e.y);
        if (o.length === 0) continue;
        const t = n / o.length;
        for (const u of o) v.push({
          node: u,
          dof: 0,
          value: -t
        });
      }
      const R = [
        ...v,
        ...N
      ], P = H({
        E: L,
        nu: C,
        thickness: m,
        theoryType: 0,
        bcType: "none",
        nodes: p,
        elements: f,
        bcs: [],
        pointLoads: R,
        springs: _
      }), B = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map();
      f.forEach((e, n) => {
        B.set(n, e.map((u) => -Math.abs(k * P.nodeResults[u].w)));
        const o = P.elementResults[n];
        E.set(n, [
          o.Mxx,
          o.Mxx,
          o.Mxx,
          o.Mxx
        ]), z.set(n, [
          o.Myy,
          o.Myy,
          o.Myy,
          o.Myy
        ]), j.set(n, [
          o.Mxy,
          o.Mxy,
          o.Mxy,
          o.Mxy
        ]);
        const t = Math.sqrt(o.Mxx ** 2 + o.Myy ** 2 - o.Mxx * o.Myy + 3 * o.Mxy ** 2);
        A.set(n, [
          t,
          t,
          t,
          t
        ]);
      });
      const X = p.map((e) => [
        e[0],
        e[1],
        0
      ]);
      a.nodes.val = X, a.elements.val = f;
      const w = /* @__PURE__ */ new Map(), Y = [
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
        n[Y[e.dof] ?? 2] += e.value, w.set(e.node, n);
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
      const D = /* @__PURE__ */ new Map();
      P.nodeResults.forEach((e, n) => D.set(n, [
        0,
        0,
        e.w,
        e.bx,
        e.by,
        0
      ])), a.deformOutputs.val = {
        deformations: D,
        reactions: /* @__PURE__ */ new Map()
      }, a.analyzeOutputs.val = {
        pressure: B,
        bendingXX: E,
        bendingYY: z,
        bendingXY: j,
        vonMises: A
      };
      const I = [];
      for (const e of T) I.push(...U(e.x, e.y, s.h_col, s.col_size));
      a.objects3D.val = I;
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
