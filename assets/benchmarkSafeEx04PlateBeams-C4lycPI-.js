import { a as le, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { m as ce, d as ie, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
let ue;
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
  let $, W, re, me, R, C, V, j, L, Z, y, A, de, H, J, K;
  $ = 0.0254;
  W = 0.3048;
  re = 0.04788;
  me = 6894.76;
  R = 30;
  C = 20;
  V = 8;
  j = R * W;
  L = C * W;
  Z = V * $;
  y = 3e3 * me;
  A = 0.3;
  de = y * Z ** 3 / (12 * (1 - A ** 2));
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
    build(I, t) {
      const x = I.lambda, m = x * j * de / y, M = Math.round(I.mesh), n = M, l = M, c = j / n, a = L / l, S = [];
      for (let e = 0; e <= l; e++) for (let o = 0; o <= n; o++) S.push([
        o * c,
        e * a,
        0
      ]);
      const i = [];
      for (let e = 0; e < l; e++) for (let o = 0; o < n; o++) {
        const s = e * (n + 1) + o;
        i.push([
          s,
          s + 1,
          s + 1 + (n + 1),
          s + (n + 1)
        ]);
      }
      const g = i.length;
      for (let e = 0; e < n; e++) i.push([
        e,
        e + 1
      ]);
      for (let e = 0; e < n; e++) {
        const o = l * (n + 1);
        i.push([
          o + e,
          o + e + 1
        ]);
      }
      const r = /* @__PURE__ */ new Map();
      for (let e = 0; e <= l; e++) {
        const o = e * (n + 1), s = e * (n + 1) + n;
        r.set(o, [
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
      ]), r.set(n, [
        false,
        true,
        true,
        false,
        false,
        false
      ]);
      const f = /* @__PURE__ */ new Map();
      for (let e = 0; e <= l; e++) for (let o = 0; o <= n; o++) {
        const s = o === 0 || o === n, _ = e === 0 || e === l, u = s && _ ? 0.25 : s || _ ? 0.5 : 1, h = e * (n + 1) + o;
        f.set(h, [
          0,
          0,
          -H * c * a * u,
          0,
          0,
          0
        ]);
      }
      const p = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map(), w = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map();
      for (let e = 0; e < g; e++) p.set(e, Z), d.set(e, y), b.set(e, A), E.set(e, 0);
      const P = 0.4, X = Math.pow(12 * m / P, 1 / 3), B = P * X, D = X * Math.pow(P, 3) / 12, Q = 1e-8, U = y / (2 * (1 + A));
      for (let e = g; e < i.length; e++) d.set(e, y), b.set(e, A), Y.set(e, U), w.set(e, B), T.set(e, m), O.set(e, D), k.set(e, Q), E.set(e, 0), G.set(e, {
        type: "rect",
        b: P,
        h: X
      }), q.set(e, [
        0,
        0,
        1
      ]);
      t.nodes.val = S, t.elements.val = i, t.nodeInputs.val = {
        supports: r,
        loads: f
      }, t.elementInputs.val = {
        elasticities: d,
        poissonsRatios: b,
        areas: w,
        momentsOfInertiaY: O,
        momentsOfInertiaZ: T,
        torsionalConstants: k,
        shearModuli: Y,
        thicknesses: p,
        densities: E,
        sectionShapes: G,
        orientations: q
      };
      try {
        let e = function(s, _) {
          var _a, _b, _c, _d;
          const u = Math.min(n - 1, Math.max(0, Math.floor(s / c))), h = Math.min(l - 1, Math.max(0, Math.floor(_ / a))), v = (s - u * c) / c, F = (_ - h * a) / a, z = h * (n + 1) + u, N = h * (n + 1) + u + 1, ee = (h + 1) * (n + 1) + u + 1, ne = (h + 1) * (n + 1) + u, te = ((_a = o.get(z)) == null ? void 0 : _a[2]) ?? 0, oe = ((_b = o.get(N)) == null ? void 0 : _b[2]) ?? 0, se = ((_c = o.get(ee)) == null ? void 0 : _c[2]) ?? 0, ae = ((_d = o.get(ne)) == null ? void 0 : _d[2]) ?? 0;
          return (1 - v) * (1 - F) * te + v * (1 - F) * oe + v * F * se + (1 - v) * F * ae;
        };
        t.deformOutputs.val = ie(t.nodes.val, t.elements.val, t.nodeInputs.val, t.elementInputs.val), t.analyzeOutputs.val = le(t.nodes.val, t.elements.val, t.elementInputs.val, t.deformOutputs.val);
        const o = t.deformOutputs.val.deformations;
        console.log(`
[SAFE Ex.4 \xB7 ${n}\xD7${l}]  Geom ${R}'\xD7${C}'\xD7${V}"  E=${(y / 1e6).toFixed(1)} GPa  \u03BD=${A}`), console.log(`  q = ${H.toFixed(3)} kN/m\xB2 (= 100 psf)`), console.log(`  \u03BB = ${x} \u2192 Ib = ${(m * 1e6).toFixed(2)} \xD7 10\u207B\u2076 m\u2074 \u2192 viga ${(P * 100).toFixed(1)}cm \xD7 ${(X * 100).toFixed(0)}cm (J\u22480)`), console.log("  Punto                          X(in) Y(in) w_Hek(in)  w_Teor(in) \u0394%");
        for (const s of J) {
          const _ = s.x * $, u = s.y * $, h = e(_, u), v = Math.abs(h) / $, F = s.label.split(" ")[0], z = K[F], N = (v / z - 1) * 100;
          console.log(`  ${s.label.padEnd(40)} ${s.x.toString().padStart(3)} ${s.y.toString().padStart(3)}  ${v.toFixed(4)}     ${z.toFixed(4)}    ${N >= 0 ? "+" : ""}${N.toFixed(2)}%`);
        }
      } catch (e) {
        console.error("[SAFE Ex.4 solver error]:", e);
      }
      t.objects3D.val = [];
    },
    computedLabels: (I, t) => {
      var _a;
      const x = {}, m = (_a = t.deformOutputs.val) == null ? void 0 : _a.deformations;
      if (!m) return x;
      const M = Math.round(I.mesh), n = M, l = M, c = j / n, a = L / l;
      function S(i, g) {
        var _a2, _b, _c, _d;
        const r = Math.min(n - 1, Math.max(0, Math.floor(i / c))), f = Math.min(l - 1, Math.max(0, Math.floor(g / a))), p = (i - r * c) / c, d = (g - f * a) / a, b = f * (n + 1) + r, w = f * (n + 1) + r + 1, O = (f + 1) * (n + 1) + r + 1, T = (f + 1) * (n + 1) + r, k = ((_a2 = m.get(b)) == null ? void 0 : _a2[2]) ?? 0, Y = ((_b = m.get(w)) == null ? void 0 : _b[2]) ?? 0, E = ((_c = m.get(O)) == null ? void 0 : _c[2]) ?? 0, G = ((_d = m.get(T)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - p) * (1 - d) * k + p * (1 - d) * Y + p * d * E + (1 - p) * d * G;
      }
      for (const i of J) {
        const g = i.x * $, r = i.y * $, f = S(g, r), p = Math.abs(f) / $, d = i.label.split(" ")[0], b = K[d], w = (p / b - 1) * 100;
        x[`${d} w_Hek/teor`] = `${p.toFixed(4)} / ${b.toFixed(4)} in (${w >= 0 ? "+" : ""}${w.toFixed(2)}%)`;
      }
      return x;
    },
    runModal(I, t, x) {
      var _a, _b, _c;
      const m = t.nodes.val, M = t.elements.val, n = t.nodeInputs.val, l = t.elementInputs.val;
      if (!m.length || !M.length || !((_a = n.supports) == null ? void 0 : _a.size) || !((_b = l.densities) == null ? void 0 : _b.size)) return;
      const c = new Map(l.densities);
      for (const [a, S] of c) c.set(a, 24);
      try {
        const a = ce(m, M, n, {
          ...l,
          densities: c
        }, 12);
        x.render(a, {
          title: `SAFE Ex.4 Placa+Vigas ${R}'\xD7${C}'\xD7${V}"  \u03BB=${I.lambda}`,
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
