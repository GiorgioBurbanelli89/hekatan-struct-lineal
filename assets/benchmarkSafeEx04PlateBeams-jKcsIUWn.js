import { a as le } from "./analyze-DgLgRmKg.js";
import { m as ce, d as ie, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let ue;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let v, W, re, de, C, V, X, Y, L, Z, y, A, me, H, J, K;
  v = 0.0254;
  W = 0.3048;
  re = 0.04788;
  de = 6894.76;
  C = 30;
  V = 20;
  X = 8;
  Y = C * W;
  L = V * W;
  Z = X * v;
  y = 3e3 * de;
  A = 0.3;
  me = y * Z ** 3 / (12 * (1 - A ** 2));
  H = 100 * re;
  J = [
    {
      x: 180,
      y: 120,
      label: "P1 (180,120) \u2014 CENTRO de placa"
    },
    {
      x: 180,
      y: 60,
      label: "P2 (180,60) \u2014 cuadrante"
    },
    {
      x: 180,
      y: 0,
      label: "P3 (180,0) \u2014 sobre la viga el\xE1stica"
    }
  ];
  K = {
    P1: 0.18572,
    P2: 0.15349,
    P3: 0.07365
  };
  ue = {
    id: "benchmark-safe-ex04-plate-beams",
    name: "SAFE Ex.4 \xB7 Placa SS + vigas el\xE1sticas (Timoshenko, \u03BB=4)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    benchmark: true,
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "displacementZ",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "shearX",
      "shearY",
      "vonMises"
    ],
    hasModal: true,
    params: {
      lambda: {
        default: 4,
        min: 0.5,
        max: 20,
        step: 0.5,
        label: "\u03BB rigidez relativa viga/losa"
      },
      mesh: {
        default: 8,
        label: "Mesh (nx = ny)",
        options: {
          "4\xD74": 4,
          "8\xD78": 8,
          "12\xD712": 12,
          "16\xD716": 16
        }
      }
    },
    build(I, o) {
      const x = I.lambda, d = x * Y * me / y, M = Math.round(I.mesh), t = M, l = M, c = Y / t, a = L / l, E = [];
      for (let e = 0; e <= l; e++) for (let n = 0; n <= t; n++) E.push([
        n * c,
        e * a,
        0
      ]);
      const i = [];
      for (let e = 0; e < l; e++) for (let n = 0; n < t; n++) {
        const s = e * (t + 1) + n;
        i.push([
          s,
          s + 1,
          s + 1 + (t + 1),
          s + (t + 1)
        ]);
      }
      const g = i.length;
      for (let e = 0; e < t; e++) i.push([
        e,
        e + 1
      ]);
      for (let e = 0; e < t; e++) {
        const n = l * (t + 1);
        i.push([
          n + e,
          n + e + 1
        ]);
      }
      const r = /* @__PURE__ */ new Map();
      for (let e = 0; e <= l; e++) {
        const n = e * (t + 1), s = e * (t + 1) + t;
        r.set(n, [
          false,
          false,
          true,
          false,
          false,
          false
        ]), r.set(s, [
          false,
          false,
          true,
          false,
          false,
          false
        ]);
      }
      r.set(0, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), r.set(t, [
        false,
        true,
        true,
        false,
        false,
        false
      ]);
      const f = /* @__PURE__ */ new Map();
      for (let e = 0; e <= l; e++) for (let n = 0; n <= t; n++) {
        const s = n === 0 || n === t, _ = e === 0 || e === l, u = s && _ ? 0.25 : s || _ ? 0.5 : 1, h = e * (t + 1) + n;
        f.set(h, [
          0,
          0,
          -H * c * a * u,
          0,
          0,
          0
        ]);
      }
      const p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
      for (let e = 0; e < g; e++) p.set(e, Z), m.set(e, y), w.set(e, A), S.set(e, 0);
      const P = 0.4, N = Math.pow(12 * d / P, 1 / 3), B = P * N, D = N * Math.pow(P, 3) / 12, Q = 1e-8, U = y / (2 * (1 + A));
      for (let e = g; e < i.length; e++) m.set(e, y), w.set(e, A), G.set(e, U), b.set(e, B), T.set(e, d), O.set(e, D), k.set(e, Q), S.set(e, 0), z.set(e, {
        type: "rect",
        b: P,
        h: N
      }), q.set(e, [
        0,
        0,
        1
      ]);
      o.nodes.val = E, o.elements.val = i, o.nodeInputs.val = {
        supports: r,
        loads: f
      }, o.elementInputs.val = {
        elasticities: m,
        poissonsRatios: w,
        areas: b,
        momentsOfInertiaY: O,
        momentsOfInertiaZ: T,
        torsionalConstants: k,
        shearModuli: G,
        thicknesses: p,
        densities: S,
        sectionShapes: z,
        orientations: q
      };
      try {
        let e = function(s, _) {
          var _a, _b, _c, _d;
          const u = Math.min(t - 1, Math.max(0, Math.floor(s / c))), h = Math.min(l - 1, Math.max(0, Math.floor(_ / a))), $ = (s - u * c) / c, F = (_ - h * a) / a, j = h * (t + 1) + u, R = h * (t + 1) + u + 1, ee = (h + 1) * (t + 1) + u + 1, te = (h + 1) * (t + 1) + u, oe = ((_a = n.get(j)) == null ? void 0 : _a[2]) ?? 0, ne = ((_b = n.get(R)) == null ? void 0 : _b[2]) ?? 0, se = ((_c = n.get(ee)) == null ? void 0 : _c[2]) ?? 0, ae = ((_d = n.get(te)) == null ? void 0 : _d[2]) ?? 0;
          return (1 - $) * (1 - F) * oe + $ * (1 - F) * ne + $ * F * se + (1 - $) * F * ae;
        };
        o.deformOutputs.val = ie(o.nodes.val, o.elements.val, o.nodeInputs.val, o.elementInputs.val), o.analyzeOutputs.val = le(o.nodes.val, o.elements.val, o.elementInputs.val, o.deformOutputs.val);
        const n = o.deformOutputs.val.deformations;
        console.log(`
[SAFE Ex.4 \xB7 ${t}\xD7${l}]  Geom ${C}'\xD7${V}'\xD7${X}"  E=${(y / 1e6).toFixed(1)} GPa  \u03BD=${A}`), console.log(`  q = ${H.toFixed(3)} kN/m\xB2 (= 100 psf)`), console.log(`  \u03BB = ${x} \u2192 Ib = ${(d * 1e6).toFixed(2)} \xD7 10\u207B\u2076 m\u2074 \u2192 viga ${(P * 100).toFixed(1)}cm \xD7 ${(N * 100).toFixed(0)}cm (J\u22480)`), console.log("  Punto                          X(in) Y(in) w_Hek(in)  w_Teor(in) \u0394%");
        for (const s of J) {
          const _ = s.x * v, u = s.y * v, h = e(_, u), $ = Math.abs(h) / v, F = s.label.split(" ")[0], j = K[F], R = ($ / j - 1) * 100;
          console.log(`  ${s.label.padEnd(40)} ${s.x.toString().padStart(3)} ${s.y.toString().padStart(3)}  ${$.toFixed(4)}     ${j.toFixed(4)}    ${R >= 0 ? "+" : ""}${R.toFixed(2)}%`);
        }
      } catch (e) {
        console.error("[SAFE Ex.4 solver error]:", e);
      }
      o.objects3D.val = [];
    },
    computedLabels: (I, o) => {
      var _a;
      const x = {}, d = (_a = o.deformOutputs.val) == null ? void 0 : _a.deformations;
      if (!d) return x;
      const M = Math.round(I.mesh), t = M, l = M, c = Y / t, a = L / l;
      function E(i, g) {
        var _a2, _b, _c, _d;
        const r = Math.min(t - 1, Math.max(0, Math.floor(i / c))), f = Math.min(l - 1, Math.max(0, Math.floor(g / a))), p = (i - r * c) / c, m = (g - f * a) / a, w = f * (t + 1) + r, b = f * (t + 1) + r + 1, O = (f + 1) * (t + 1) + r + 1, T = (f + 1) * (t + 1) + r, k = ((_a2 = d.get(w)) == null ? void 0 : _a2[2]) ?? 0, G = ((_b = d.get(b)) == null ? void 0 : _b[2]) ?? 0, S = ((_c = d.get(O)) == null ? void 0 : _c[2]) ?? 0, z = ((_d = d.get(T)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - p) * (1 - m) * k + p * (1 - m) * G + p * m * S + (1 - p) * m * z;
      }
      for (const i of J) {
        const g = i.x * v, r = i.y * v, f = E(g, r), p = Math.abs(f) / v, m = i.label.split(" ")[0], w = K[m], b = (p / w - 1) * 100;
        x[`${m} w_Hek/teor`] = `${p.toFixed(4)} / ${w.toFixed(4)} in (${b >= 0 ? "+" : ""}${b.toFixed(2)}%)`;
      }
      return x;
    },
    runModal(I, o, x) {
      var _a, _b, _c;
      const d = o.nodes.val, M = o.elements.val, t = o.nodeInputs.val, l = o.elementInputs.val;
      if (!d.length || !M.length || !((_a = t.supports) == null ? void 0 : _a.size) || !((_b = l.densities) == null ? void 0 : _b.size)) return;
      const c = new Map(l.densities);
      for (const [a, E] of c) c.set(a, 24);
      try {
        const a = ce(d, M, t, {
          ...l,
          densities: c
        }, 12);
        x.render(a, {
          title: `SAFE Ex.4 Placa+Vigas ${C}'\xD7${V}'\xD7${X}"  \u03BB=${I.lambda}`,
          properties: [
            "E=20.7 GPa  \u03BD=0.3"
          ]
        }), console.log(`[SAFE Ex.4 Modal] f\u2081=${(_c = a.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081=${(1 / a.frequencies[0]).toFixed(4)} s`);
      } catch (a) {
        console.warn("Modal SAFE Ex.4 error:", a.message);
      }
    }
  };
});
export {
  __tla,
  ue as b
};
