import { p as D, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
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
      "pressure",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "vonMises",
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
      const u = o.Lz, x = o.Bz, _ = o.t_zap, j = o.t_vig, r = o.Lzap, M = o.ks_tonfm3 * T, w = o.P_tonf * T, y = Math.round(o.nx), h = Math.round(o.ny), c = y + 1, b = h + 1, i = u / y, v = x / h, p = [];
      for (let a = 0; a < b; ++a) for (let e = 0; e < c; ++e) p.push([
        e * i,
        a * v
      ]);
      const d = [], g = [];
      for (let a = 0; a < h; ++a) for (let e = 0; e < y; ++e) {
        const n = a * c + e;
        d.push([
          n,
          n + 1,
          n + c + 1,
          n + c
        ]);
        const t = (e + 0.5) * i, s = t < r || t > u - r;
        g.push(s ? _ : j);
      }
      const m = [];
      for (let a = 0; a < b; ++a) for (let e = 0; e < c; ++e) {
        const n = e === 0 || e === c - 1, t = a === 0 || a === b - 1, s = n && t ? 0.25 : n || t ? 0.5 : 1, f = i * v * s, z = a * c + e;
        if (m.push({
          node: z,
          dof: 0,
          k: M * f
        }), n && t) {
          const P = 1e-6 * M * i * v;
          m.push({
            node: z,
            dof: 1,
            k: P
          }), m.push({
            node: z,
            dof: 2,
            k: P
          });
        }
      }
      const L = (a, e) => {
        let n = -1, t = 1 / 0;
        for (let s = 0; s < p.length; ++s) {
          const f = (p[s][0] - a) ** 2 + (p[s][1] - e) ** 2;
          f < t && (t = f, n = s);
        }
        return n;
      }, E = [
        {
          node: L(r / 2, x / 2),
          dof: 0,
          value: -w
        },
        {
          node: L(u - r / 2, x / 2),
          dof: 0,
          value: -w
        }
      ], S = 24855e3, R = 0.2, k = D({
        E: S,
        nu: R,
        thickness: _,
        theoryType: 0,
        bcType: "none",
        nodes: p,
        elements: d,
        bcs: [],
        pointLoads: E,
        springs: m,
        thicknesses: g
      }), A = p.map((a) => [
        a[0],
        a[1],
        0
      ]);
      l.nodes.val = A, l.elements.val = d, l.nodeInputs.val = {
        supports: /* @__PURE__ */ new Map(),
        loads: /* @__PURE__ */ new Map(),
        ...O(m, E)
      }, l.elementInputs.val = {
        elasticities: new Map(d.map((a, e) => [
          e,
          S
        ])),
        poissonsRatios: new Map(d.map((a, e) => [
          e,
          R
        ])),
        thicknesses: new Map(d.map((a, e) => [
          e,
          g[e]
        ]))
      };
      const B = /* @__PURE__ */ new Map();
      k.nodeResults.forEach((a, e) => B.set(e, [
        0,
        0,
        a.w,
        a.bx,
        a.by,
        0
      ])), l.deformOutputs.val = {
        deformations: B,
        reactions: /* @__PURE__ */ new Map()
      };
      const N = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
      d.forEach((a, e) => {
        N.set(e, a.map((s) => M * k.nodeResults[s].w));
        const n = k.elementResults[e];
        X.set(e, [
          n.Mxx,
          n.Mxx,
          n.Mxx,
          n.Mxx
        ]), Y.set(e, [
          n.Myy,
          n.Myy,
          n.Myy,
          n.Myy
        ]), C.set(e, [
          n.Mxy,
          n.Mxy,
          n.Mxy,
          n.Mxy
        ]);
        const t = Math.sqrt(n.Mxx ** 2 + n.Myy ** 2 - n.Mxx * n.Myy + 3 * n.Mxy ** 2);
        I.set(e, [
          t,
          t,
          t,
          t
        ]);
      }), l.analyzeOutputs.val = {
        pressure: N,
        bendingXX: X,
        bendingYY: Y,
        bendingXY: C,
        vonMises: I
      }, l.objects3D.val = [];
    }
  };
});
export {
  __tla,
  Z as s
};
