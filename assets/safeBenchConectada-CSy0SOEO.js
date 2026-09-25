import { p as D, __tla as __tla_0 } from "./didacticCpp-ClOTguHC.js";
import { f as O } from "./f2kPlateQ4-BZ9dGpgS.js";
let Z;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let T;
  T = 9.80665;
  Z = {
    id: "safe-bench-zapata-conectada",
    name: "SAFE Benchmark \xB7 Zapata Conectada 5\xD71m t variable (\u0394 -0.25%)",
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
      "Caso 4 del framework Hekatan vs SAFE \u2014 paridad -0.25%",
      "Losa con espesor variable: zapatas extremas t=0.40m, viga centro t=0.20m",
      "2 columnas centradas en cada zapata: x=0.5 y x=4.5",
      "MUESTRA artefacto f\xEDsico: viga delgada genera rotaci\xF3n, esquinas hunden M\xC1S que las cargas"
    ],
    params: {
      Lz: {
        default: 5,
        min: 3,
        max: 10,
        step: 0.25,
        label: "Lz total (m)"
      },
      Bz: {
        default: 1,
        min: 0.5,
        max: 2,
        step: 0.25,
        label: "Bz ancho (m)"
      },
      t_zap: {
        default: 0.4,
        min: 0.2,
        max: 1,
        step: 0.05,
        label: "t zapata (m)"
      },
      t_vig: {
        default: 0.2,
        min: 0.1,
        max: 0.5,
        step: 0.05,
        label: "t viga centro (m)"
      },
      Lzap: {
        default: 1,
        min: 0.5,
        max: 2,
        step: 0.25,
        label: "L zapata extremo (m)"
      },
      ks_tonfm3: {
        default: 105,
        min: 50,
        max: 5e3,
        step: 50,
        label: "ks (tonf/m\xB3)"
      },
      P_tonf: {
        default: 20,
        min: 1,
        max: 50,
        step: 1,
        label: "P por col (tonf)"
      },
      nx: {
        default: 20,
        min: 10,
        max: 40,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 4,
        min: 2,
        max: 8,
        step: 1,
        label: "ny mesh"
      }
    },
    build(o, l) {
      const u = o.Lz, x = o.Bz, _ = o.t_zap, j = o.t_vig, p = o.Lzap, M = o.ks_tonfm3 * T, w = o.P_tonf * T, b = Math.round(o.nx), h = Math.round(o.ny), c = b + 1, y = h + 1, d = u / b, v = x / h, m = [];
      for (let a = 0; a < y; ++a) for (let e = 0; e < c; ++e) m.push([
        e * d,
        a * v
      ]);
      const r = [], g = [];
      for (let a = 0; a < h; ++a) for (let e = 0; e < b; ++e) {
        const n = a * c + e;
        r.push([
          n,
          n + 1,
          n + c + 1,
          n + c
        ]);
        const t = (e + 0.5) * d, s = t < p || t > u - p;
        g.push(s ? _ : j);
      }
      const i = [];
      for (let a = 0; a < y; ++a) for (let e = 0; e < c; ++e) {
        const n = e === 0 || e === c - 1, t = a === 0 || a === y - 1, s = n && t ? 0.25 : n || t ? 0.5 : 1, f = d * v * s, z = a * c + e;
        if (i.push({
          node: z,
          dof: 0,
          k: M * f
        }), n && t) {
          const I = 1e-6 * M * d * v;
          i.push({
            node: z,
            dof: 1,
            k: I
          }), i.push({
            node: z,
            dof: 2,
            k: I
          });
        }
      }
      const S = (a, e) => {
        let n = -1, t = 1 / 0;
        for (let s = 0; s < m.length; ++s) {
          const f = (m[s][0] - a) ** 2 + (m[s][1] - e) ** 2;
          f < t && (t = f, n = s);
        }
        return n;
      }, X = [
        {
          node: S(p / 2, x / 2),
          dof: 0,
          value: -w
        },
        {
          node: S(u - p / 2, x / 2),
          dof: 0,
          value: -w
        }
      ], Y = 24855e3, L = 0.2, k = D({
        E: Y,
        nu: L,
        thickness: _,
        theoryType: 0,
        bcType: "none",
        nodes: m,
        elements: r,
        bcs: [],
        pointLoads: X,
        springs: i,
        thicknesses: g
      }), A = m.map((a) => [
        a[0],
        a[1],
        0
      ]);
      l.nodes.val = A, l.elements.val = r, l.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...O(i, X)
      }, l.elementInputs.val = {
        elasticities: new Map(r.map((a, e) => [
          e,
          Y
        ])),
        poissonsRatios: new Map(r.map((a, e) => [
          e,
          L
        ])),
        thicknesses: new Map(r.map((a, e) => [
          e,
          g[e]
        ]))
      };
      const E = /* @__PURE__ */ new Map();
      k.nodeResults.forEach((a, e) => E.set(e, [
        0,
        0,
        a.w,
        a.bx,
        a.by,
        0
      ])), l.deformOutputs.val = {
        deformations: E,
        reactions: /* @__PURE__ */ new Map()
      };
      const P = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), B = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
      r.forEach((a, e) => {
        P.set(e, a.map((s) => M * k.nodeResults[s].w));
        const n = k.elementResults[e];
        R.set(e, [
          n.Mxx,
          n.Mxx,
          n.Mxx,
          n.Mxx
        ]), B.set(e, [
          n.Myy,
          n.Myy,
          n.Myy,
          n.Myy
        ]), N.set(e, [
          n.Mxy,
          n.Mxy,
          n.Mxy,
          n.Mxy
        ]);
        const t = Math.sqrt(n.Mxx ** 2 + n.Myy ** 2 - n.Mxx * n.Myy + 3 * n.Mxy ** 2);
        C.set(e, [
          t,
          t,
          t,
          t
        ]);
      }), l.analyzeOutputs.val = {
        pressure: P,
        bendingXX: R,
        bendingYY: B,
        bendingXY: N,
        vonMises: C
      }, l.objects3D.val = [];
    }
  };
});
export {
  __tla,
  Z as s
};
