import { b as F, L as O, E as T, a as A } from "./theme-U-6D_qyI.js";
import { p as Z, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { f as G } from "./f2kPlateQ4-BZ9dGpgS.js";
let K;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const j = 9.80665;
  function H(t, a, c, p) {
    const b = new F(p, p, c), i = new O(new T(b), new A({
      color: 8421504,
      linewidth: 2
    }));
    return i.position.set(t, a, c / 2), [
      i
    ];
  }
  K = {
    id: "safe-bench-zapata-combinada",
    name: "SAFE Benchmark \xB7 Zapata Combinada 4\xD72\xD70.40m, 2 cols (\u0394 +0.08%)",
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
      "Caso 3 del framework Hekatan vs SAFE \u2014 paridad <0.08%",
      "Zapata rectangular 4\xD72m \xD7 0.40m espesor sobre Winkler arena media",
      "2 columnas alineadas en (1.0, 1.0) y (3.0, 1.0), P=30 tonf c/u",
      "Caso t\xEDpico: medianera o muro de propiedad"
    ],
    params: {
      Lz: {
        default: 4,
        min: 2,
        max: 8,
        step: 0.25,
        label: "Lz (m)"
      },
      Bz: {
        default: 2,
        min: 1,
        max: 5,
        step: 0.25,
        label: "Bz (m)"
      },
      tz: {
        default: 0.4,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "t espesor (m)"
      },
      ks_tonfm3: {
        default: 2e3,
        min: 500,
        max: 1e4,
        step: 100,
        label: "ks (tonf/m\xB3)"
      },
      P_tonf: {
        default: 30,
        min: 1,
        max: 100,
        step: 1,
        label: "P por col (tonf)"
      },
      nx: {
        default: 16,
        min: 8,
        max: 32,
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
      h_ped: {
        default: 0.5,
        min: 0.2,
        max: 1.5,
        step: 0.05,
        label: "Hp pedestal (m)"
      },
      b_ped: {
        default: 0.4,
        min: 0.2,
        max: 0.8,
        step: 0.05,
        label: "lado pedestal (m)"
      }
    },
    build(t, a) {
      const c = t.Lz, p = t.Bz, b = t.tz, i = t.ks_tonfm3 * j, C = t.P_tonf * j, y = Math.round(t.nx), h = Math.round(t.ny), d = y + 1, w = h + 1, k = c / y, _ = p / h, v = [
        [
          c / 4,
          p / 2
        ],
        [
          3 * c / 4,
          p / 2
        ]
      ], r = [];
      for (let n = 0; n < w; ++n) for (let e = 0; e < d; ++e) r.push([
        e * k,
        n * _
      ]);
      const m = [];
      for (let n = 0; n < h; ++n) for (let e = 0; e < y; ++e) {
        const s = n * d + e;
        m.push([
          s,
          s + 1,
          s + d + 1,
          s + d
        ]);
      }
      const u = [];
      for (let n = 0; n < w; ++n) for (let e = 0; e < d; ++e) {
        const s = e === 0 || e === d - 1, o = n === 0 || n === w - 1, l = s && o ? 0.25 : s || o ? 0.5 : 1, M = k * _ * l, f = n * d + e;
        if (u.push({
          node: f,
          dof: 0,
          k: i * M
        }), s && o) {
          const x = 1e-6 * i * k * _;
          u.push({
            node: f,
            dof: 1,
            k: x
          }), u.push({
            node: f,
            dof: 2,
            k: x
          });
        }
      }
      const I = (n, e) => {
        let s = -1, o = 1 / 0;
        for (let l = 0; l < r.length; ++l) {
          const M = r[l][0] - n, f = r[l][1] - e, x = M * M + f * f;
          x < o && (o = x, s = l);
        }
        return s;
      }, z = v.map(([n, e]) => ({
        node: I(n, e),
        dof: 0,
        value: -C
      })), E = 24855e3, B = 0.2, g = Z({
        E,
        nu: B,
        thickness: b,
        theoryType: 0,
        bcType: "none",
        nodes: r,
        elements: m,
        bcs: [],
        pointLoads: z,
        springs: u
      }), D = r.map((n) => [
        n[0],
        n[1],
        0
      ]);
      a.nodes.val = D, a.elements.val = m, a.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...G(u, z)
      }, a.elementInputs.val = {
        elasticities: new Map(m.map((n, e) => [
          e,
          E
        ])),
        poissonsRatios: new Map(m.map((n, e) => [
          e,
          B
        ])),
        thicknesses: new Map(m.map((n, e) => [
          e,
          b
        ]))
      };
      const L = /* @__PURE__ */ new Map();
      g.nodeResults.forEach((n, e) => L.set(e, [
        0,
        0,
        n.w,
        n.bx,
        n.by,
        0
      ])), a.deformOutputs.val = {
        deformations: L,
        reactions: /* @__PURE__ */ new Map()
      };
      const N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map();
      m.forEach((n, e) => {
        N.set(e, n.map((l) => i * g.nodeResults[l].w));
        const s = g.elementResults[e];
        P.set(e, [
          s.Mxx,
          s.Mxx,
          s.Mxx,
          s.Mxx
        ]), S.set(e, [
          s.Myy,
          s.Myy,
          s.Myy,
          s.Myy
        ]), R.set(e, [
          s.Mxy,
          s.Mxy,
          s.Mxy,
          s.Mxy
        ]);
        const o = Math.sqrt(s.Mxx ** 2 + s.Myy ** 2 - s.Mxx * s.Myy + 3 * s.Mxy ** 2);
        X.set(e, [
          o,
          o,
          o,
          o
        ]);
      }), a.analyzeOutputs.val = {
        pressure: N,
        bendingXX: P,
        bendingYY: S,
        bendingXY: R,
        vonMises: X
      };
      const Y = [];
      for (const [n, e] of v) Y.push(...H(n, e, t.h_ped, t.b_ped));
      a.objects3D.val = Y;
    }
  };
});
export {
  __tla,
  K as s
};
