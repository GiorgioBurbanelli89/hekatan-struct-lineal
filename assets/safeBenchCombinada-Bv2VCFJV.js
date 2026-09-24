import { c as F, L as O, E as T, b as A } from "./Text-C1TX4d8g.js";
import { p as Z, __tla as __tla_0 } from "./didacticCpp-BoYi16rL.js";
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
  function H(s, o, i, d) {
    const x = new F(d, d, i), c = new O(new T(x), new A({
      color: 8421504,
      linewidth: 2
    }));
    return c.position.set(s, o, i / 2), [
      c
    ];
  }
  K = {
    id: "safe-bench-zapata-combinada",
    name: "SAFE Benchmark \xB7 Zapata Combinada 4\xD72\xD70.40m, 2 cols (\u0394 +0.08%)",
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
    build(s, o) {
      const i = s.Lz, d = s.Bz, x = s.tz, c = s.ks_tonfm3 * j, C = s.P_tonf * j, y = Math.round(s.nx), h = Math.round(s.ny), m = y + 1, w = h + 1, k = i / y, g = d / h, _ = [
        [
          i / 4,
          d / 2
        ],
        [
          3 * i / 4,
          d / 2
        ]
      ], p = [];
      for (let n = 0; n < w; ++n) for (let e = 0; e < m; ++e) p.push([
        e * k,
        n * g
      ]);
      const r = [];
      for (let n = 0; n < h; ++n) for (let e = 0; e < y; ++e) {
        const a = n * m + e;
        r.push([
          a,
          a + 1,
          a + m + 1,
          a + m
        ]);
      }
      const u = [];
      for (let n = 0; n < w; ++n) for (let e = 0; e < m; ++e) {
        const a = e === 0 || e === m - 1, t = n === 0 || n === w - 1, l = a && t ? 0.25 : a || t ? 0.5 : 1, M = k * g * l, f = n * m + e;
        if (u.push({
          node: f,
          dof: 0,
          k: c * M
        }), a && t) {
          const b = 1e-6 * c * k * g;
          u.push({
            node: f,
            dof: 1,
            k: b
          }), u.push({
            node: f,
            dof: 2,
            k: b
          });
        }
      }
      const I = (n, e) => {
        let a = -1, t = 1 / 0;
        for (let l = 0; l < p.length; ++l) {
          const M = p[l][0] - n, f = p[l][1] - e, b = M * M + f * f;
          b < t && (t = b, a = l);
        }
        return a;
      }, z = _.map(([n, e]) => ({
        node: I(n, e),
        dof: 0,
        value: -C
      })), P = 24855e3, X = 0.2, v = Z({
        E: P,
        nu: X,
        thickness: x,
        theoryType: 0,
        bcType: "none",
        nodes: p,
        elements: r,
        bcs: [],
        pointLoads: z,
        springs: u
      }), D = p.map((n) => [
        n[0],
        n[1],
        0
      ]);
      o.nodes.val = D, o.elements.val = r, o.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...G(u, z)
      }, o.elementInputs.val = {
        elasticities: new Map(r.map((n, e) => [
          e,
          P
        ])),
        poissonsRatios: new Map(r.map((n, e) => [
          e,
          X
        ])),
        thicknesses: new Map(r.map((n, e) => [
          e,
          x
        ]))
      };
      const Y = /* @__PURE__ */ new Map();
      v.nodeResults.forEach((n, e) => Y.set(e, [
        0,
        0,
        n.w,
        n.bx,
        n.by,
        0
      ])), o.deformOutputs.val = {
        deformations: Y,
        reactions: /* @__PURE__ */ new Map()
      };
      const E = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map();
      r.forEach((n, e) => {
        E.set(e, n.map((l) => c * v.nodeResults[l].w));
        const a = v.elementResults[e];
        S.set(e, [
          a.Mxx,
          a.Mxx,
          a.Mxx,
          a.Mxx
        ]), B.set(e, [
          a.Myy,
          a.Myy,
          a.Myy,
          a.Myy
        ]), L.set(e, [
          a.Mxy,
          a.Mxy,
          a.Mxy,
          a.Mxy
        ]);
        const t = Math.sqrt(a.Mxx ** 2 + a.Myy ** 2 - a.Mxx * a.Myy + 3 * a.Mxy ** 2);
        N.set(e, [
          t,
          t,
          t,
          t
        ]);
      }), o.analyzeOutputs.val = {
        pressure: E,
        bendingXX: S,
        bendingYY: B,
        bendingXY: L,
        vonMises: N
      };
      const R = [];
      for (const [n, e] of _) R.push(...H(n, e, s.h_ped, s.b_ped));
      o.objects3D.val = R;
    }
  };
});
export {
  __tla,
  K as s
};
