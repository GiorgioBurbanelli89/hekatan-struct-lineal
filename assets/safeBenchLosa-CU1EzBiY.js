import { a as V } from "./analyze-CRH7D0Bs.js";
import { d as $, __tla as __tla_0 } from "./didacticCpp-DaEmtxPu.js";
let te;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let H;
  H = 9.80665;
  te = {
    id: "safe-bench-losa-cimentacion",
    name: "SAFE Benchmark \xB7 Losa Cimentaci\xF3n 6\xD78\xD70.50m, 6 cols (\u0394 +0.33%)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
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
      "Caso 2 del framework Hekatan vs SAFE 20 (paridad <0.33% en w_max)",
      "Losa rectangular 6\xD78m \xD7 0.50m espesor sobre Winkler arena media (ks=2000 tonf/m\xB3)",
      "6 columnas en grilla 2\xD73 (luz 3m\xD74m), P=20 tonf c/u (P_total=120 tonf)",
      "Resultado SAFE referencia: w_max col centrales = -1.587 mm (Hekatan -1.582)",
      "El colormap muestra Uz (desplazamiento vertical), max en bajo cols 3,4 (centrales)"
    ],
    params: {
      Lz: {
        default: 6,
        min: 3,
        max: 15,
        step: 0.5,
        label: "Lz (m, eje x)"
      },
      Bz: {
        default: 8,
        min: 3,
        max: 20,
        step: 0.5,
        label: "Bz (m, eje y)"
      },
      tz: {
        default: 0.5,
        min: 0.2,
        max: 1.5,
        step: 0.05,
        label: "t (m, espesor)"
      },
      ks_tonfm3: {
        default: 2e3,
        min: 500,
        max: 1e4,
        step: 100,
        label: "ks (tonf/m\xB3)"
      },
      P_tonf: {
        default: 20,
        min: 1,
        max: 100,
        step: 1,
        label: "P por col (tonf)"
      },
      nx: {
        default: 12,
        min: 6,
        max: 24,
        step: 2,
        label: "nx mesh"
      },
      ny: {
        default: 16,
        min: 6,
        max: 32,
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
    build(a, m) {
      const x = a.Lz, u = a.Bz, T = a.tz, _ = a.ks_tonfm3 * H, D = a.P_tonf * H, k = Math.round(a.nx), M = Math.round(a.ny), l = k + 1, h = M + 1, z = x / k, g = u / M, J = a.h_ped, b = a.b_ped, Z = [
        x / 4,
        3 * x / 4
      ], q = [
        u / 4,
        u / 2,
        3 * u / 4
      ], w = [];
      for (const e of Z) for (const n of q) w.push([
        e,
        n
      ]);
      const c = [];
      for (let e = 0; e < h; ++e) for (let n = 0; n < l; ++n) c.push([
        n * z,
        e * g,
        0
      ]);
      const G = (e, n) => {
        let t = -1, s = 1 / 0;
        for (let o = 0; o < l * h; ++o) {
          const d = (c[o][0] - e) ** 2 + (c[o][1] - n) ** 2;
          d < s && (s = d, t = o);
        }
        return t;
      }, K = w.map(([e, n]) => G(e, n)), B = w.map(([e, n]) => (c.push([
        e,
        n,
        J
      ]), c.length - 1)), r = [], L = 0;
      for (let e = 0; e < M; ++e) for (let n = 0; n < k; ++n) {
        const t = e * l + n;
        r.push([
          t,
          t + 1,
          t + l + 1,
          t + l
        ]);
      }
      const y = r.length;
      K.forEach((e, n) => r.push([
        e,
        B[n]
      ]));
      const i = [];
      for (let e = 0; e < h; ++e) for (let n = 0; n < l; ++n) {
        const t = n === 0 || n === l - 1, s = e === 0 || e === h - 1, o = t && s ? 0.25 : t || s ? 0.5 : 1, d = z * g * o, p = e * l + n;
        if (i.push({
          node: p,
          dof: 2,
          k: _ * d
        }), t && s) {
          const f = 1e-6 * _ * z * g;
          i.push({
            node: p,
            dof: 3,
            k: f
          }), i.push({
            node: p,
            dof: 4,
            k: f
          });
        }
      }
      const S = /* @__PURE__ */ new Map();
      B.forEach((e) => S.set(e, [
        0,
        0,
        -D,
        0,
        0,
        0
      ]));
      const v = 24855e3, I = 0.2, U = v / (2 * (1 + I)), W = b * b, N = b ** 4 / 12, Q = 0.141 * b ** 4, E = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map();
      for (let e = L; e < y; ++e) E.set(e, v), P.set(e, I), O.set(e, T);
      for (let e = y; e < r.length; ++e) E.set(e, v), P.set(e, I), A.set(e, W), C.set(e, N), Y.set(e, N), F.set(e, U), R.set(e, Q);
      const X = {
        supports: /* @__PURE__ */ new Map(),
        loads: S,
        springs: i
      }, j = {
        elasticities: E,
        poissonsRatios: P,
        thicknesses: O,
        areas: A,
        momentsOfInertiaZ: Y,
        momentsOfInertiaY: C,
        shearModuli: F,
        torsionalConstants: R
      };
      m.nodes.val = c, m.elements.val = r, m.nodeInputs.val = X, m.elementInputs.val = j;
      try {
        const e = $(c, r, X, j, i);
        m.deformOutputs.val = e;
        const n = V(c, r, j, e), t = /* @__PURE__ */ new Map();
        for (let s = L; s < y; ++s) {
          const o = r[s];
          if (o.length !== 4) continue;
          const d = o.map((p) => {
            var _a;
            const f = (_a = e.deformations) == null ? void 0 : _a.get(p);
            return f ? _ * f[2] : 0;
          });
          t.set(s, d);
        }
        n.pressure = t, m.analyzeOutputs.val = n;
      } catch (e) {
        console.error("safe-bench-losa solver error:", e);
      }
      m.objects3D.val = [];
    }
  };
});
export {
  __tla,
  te as s
};
