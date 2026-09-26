import { a as V, __tla as __tla_0 } from "./analyze-Bun5MfUS.js";
import { d as $, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let te;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
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
      const x = a.Lz, u = a.Bz, T = a.tz, _ = a.ks_tonfm3 * H, D = a.P_tonf * H, M = Math.round(a.nx), k = Math.round(a.ny), l = M + 1, h = k + 1, g = x / M, z = u / k, J = a.h_ped, b = a.b_ped, Z = [
        x / 4,
        3 * x / 4
      ], q = [
        u / 4,
        u / 2,
        3 * u / 4
      ], v = [];
      for (const e of Z) for (const n of q) v.push([
        e,
        n
      ]);
      const r = [];
      for (let e = 0; e < h; ++e) for (let n = 0; n < l; ++n) r.push([
        n * g,
        e * z,
        0
      ]);
      const G = (e, n) => {
        let t = -1, s = 1 / 0;
        for (let o = 0; o < l * h; ++o) {
          const i = (r[o][0] - e) ** 2 + (r[o][1] - n) ** 2;
          i < s && (s = i, t = o);
        }
        return t;
      }, K = v.map(([e, n]) => G(e, n)), E = v.map(([e, n]) => (r.push([
        e,
        n,
        J
      ]), r.length - 1)), c = [], X = 0;
      for (let e = 0; e < k; ++e) for (let n = 0; n < M; ++n) {
        const t = e * l + n;
        c.push([
          t,
          t + 1,
          t + l + 1,
          t + l
        ]);
      }
      const w = c.length;
      K.forEach((e, n) => c.push([
        e,
        E[n]
      ]));
      const d = [];
      for (let e = 0; e < h; ++e) for (let n = 0; n < l; ++n) {
        const t = n === 0 || n === l - 1, s = e === 0 || e === h - 1, o = t && s ? 0.25 : t || s ? 0.5 : 1, i = g * z * o, p = e * l + n;
        if (d.push({
          node: p,
          dof: 2,
          k: _ * i
        }), t && s) {
          const f = 1e-6 * _ * g * z;
          d.push({
            node: p,
            dof: 3,
            k: f
          }), d.push({
            node: p,
            dof: 4,
            k: f
          });
        }
      }
      const j = /* @__PURE__ */ new Map();
      E.forEach((e) => j.set(e, [
        0,
        0,
        -D,
        0,
        0,
        0
      ]));
      const y = 24855e3, I = 0.2, U = y / (2 * (1 + I)), W = b * b, B = b ** 4 / 12, Q = 0.141 * b ** 4, P = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
      for (let e = X; e < w; ++e) P.set(e, y), S.set(e, I), L.set(e, T);
      for (let e = w; e < c.length; ++e) P.set(e, y), S.set(e, I), N.set(e, W), O.set(e, B), A.set(e, B), C.set(e, U), F.set(e, Q);
      const R = {
        supports: /* @__PURE__ */ new Map(),
        loads: j,
        springs: d
      }, Y = {
        elasticities: P,
        poissonsRatios: S,
        thicknesses: L,
        areas: N,
        momentsOfInertiaZ: A,
        momentsOfInertiaY: O,
        shearModuli: C,
        torsionalConstants: F
      };
      m.nodes.val = r, m.elements.val = c, m.nodeInputs.val = R, m.elementInputs.val = Y;
      try {
        const e = $(r, c, R, Y, d);
        m.deformOutputs.val = e;
        const n = V(r, c, Y, e), t = /* @__PURE__ */ new Map();
        for (let s = X; s < w; ++s) {
          const o = c[s];
          if (o.length !== 4) continue;
          const i = o.map((p) => {
            var _a;
            const f = (_a = e.deformations) == null ? void 0 : _a.get(p);
            return f ? _ * f[2] : 0;
          });
          t.set(s, i);
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
