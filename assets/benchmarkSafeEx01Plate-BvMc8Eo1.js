import { m as tn, p as on, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
let rn;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let g, W, sn, an, K, z, U, E, P, A, Q, q, G, H;
  g = 0.0254;
  W = 0.3048;
  sn = 0.04788;
  an = 6894.76;
  K = 30;
  z = 20;
  U = 8;
  E = K * W;
  P = z * W;
  A = U * g;
  Q = 3e3 * an;
  q = 0.3;
  G = [
    {
      x: 60,
      y: 60,
      label: "P1 (60,60) \u2014 cuadrante"
    },
    {
      x: 60,
      y: 120,
      label: "P2 (60,120) \u2014 borde corto centro"
    },
    {
      x: 180,
      y: 60,
      label: "P3 (180,60) \u2014 borde largo centro"
    },
    {
      x: 180,
      y: 120,
      label: "P4 (180,120) \u2014 CENTRO"
    }
  ];
  H = {
    P1: 0.0492961,
    P2: 0.0684443,
    P3: 0.0906034,
    P4: 0.1265195
  };
  rn = {
    id: "benchmark-safe-ex01-plate",
    name: "SAFE Ex.1 \xB7 Placa SS rectangular (Timoshenko)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
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
      loadCase: {
        default: 1,
        label: "Load case",
        options: {
          "UL Uniform (q=100 psf)": 1
        }
      },
      theoryType: {
        default: 1,
        label: "Plate theory",
        options: {
          "Thin (Kirchhoff)": 1,
          "Thick (Mindlin)": 0
        }
      },
      mesh: {
        default: 8,
        label: "Mesh (n\xD7n_b proportion)",
        options: {
          "4\xD74": 4,
          "8\xD78": 8,
          "12\xD712": 12
        }
      }
    },
    build(v, c) {
      const u = Math.round(v.theoryType), r = Math.round(v.mesh), t = r, o = r, x = 100 * sn, l = on({
        E: Q,
        nu: q,
        thickness: A,
        theoryType: u,
        meshLx: E,
        meshLy: P,
        meshNx: t,
        meshNy: o,
        bcType: "simply-supported",
        pressure: -x
      }), w = l.nodeResults.map((n) => [
        n.x,
        n.y,
        0
      ]), $ = l.elementResults.map((n) => n.nodes);
      c.nodes.val = w, c.elements.val = $;
      const y = /* @__PURE__ */ new Map();
      $.forEach((n, e) => y.set(e, A));
      const b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
      $.forEach((n, e) => {
        b.set(e, Q), h.set(e, q), m.set(e, 24 / 9.81);
      });
      const p = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), _ = E / t, S = P / o, I = _ * S;
      w.forEach((n, e) => {
        const s = Math.abs(n[0]) < 1e-6 || Math.abs(n[0] - E) < 1e-6, a = Math.abs(n[1]) < 1e-6 || Math.abs(n[1] - P) < 1e-6;
        (s || a) && p.set(e, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        const i = s && a ? 0.25 : s || a ? 0.5 : 1;
        M.set(e, [
          0,
          0,
          -x * I * i,
          0,
          0,
          0
        ]);
      }), c.nodeInputs.val = {
        supports: p,
        loads: M
      }, c.elementInputs.val = {
        thicknesses: y,
        elasticities: b,
        poissonsRatios: h,
        densities: m
      };
      const f = /* @__PURE__ */ new Map();
      l.nodeResults.forEach((n, e) => {
        f.set(e, [
          0,
          0,
          n.w,
          n.bx,
          n.by,
          0
        ]);
      }), c.deformOutputs.val = {
        deformations: f
      };
      const F = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), R = A * A / 6;
      l.elementResults.forEach((n, e) => {
        F.set(e, [
          n.Mxx,
          n.Mxx,
          n.Mxx,
          n.Mxx
        ]), T.set(e, [
          n.Myy,
          n.Myy,
          n.Myy,
          n.Myy
        ]), k.set(e, [
          n.Mxy,
          n.Mxy,
          n.Mxy,
          n.Mxy
        ]), N.set(e, [
          n.Qx,
          n.Qx,
          n.Qx,
          n.Qx
        ]), j.set(e, [
          n.Qy,
          n.Qy,
          n.Qy,
          n.Qy
        ]);
        const s = n.Mxx / R, a = n.Myy / R, i = n.Mxy / R, d = Math.sqrt(s * s - s * a + a * a + 3 * i * i);
        C.set(e, [
          d,
          d,
          d,
          d
        ]);
      }), c.analyzeOutputs.val = {
        bendingXX: F,
        bendingYY: T,
        bendingXY: k,
        shearX: N,
        shearY: j,
        vonMises: C
      };
      const L = E / t, O = P / o;
      function Z(n, e) {
        var _a, _b, _c, _d;
        const s = Math.min(t - 1, Math.max(0, Math.floor(n / L))), a = Math.min(o - 1, Math.max(0, Math.floor(e / O))), i = (n - s * L) / L, d = (e - a * O) / O, X = a * (t + 1) + s, Y = a * (t + 1) + s + 1, B = (a + 1) * (t + 1) + s + 1, D = (a + 1) * (t + 1) + s, V = ((_a = f.get(X)) == null ? void 0 : _a[2]) ?? 0, J = ((_b = f.get(Y)) == null ? void 0 : _b[2]) ?? 0, nn = ((_c = f.get(B)) == null ? void 0 : _c[2]) ?? 0, en = ((_d = f.get(D)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - i) * (1 - d) * V + i * (1 - d) * J + i * d * nn + (1 - i) * d * en;
      }
      console.log(`
[SAFE Ex.1 \xB7 ${t}\xD7${o} ${u === 1 ? "Thin (Kirchhoff)" : "Thick (Mindlin)"}]  Geom ${K}'\xD7${z}'\xD7${U}"  E=${(Q / 1e6).toFixed(1)} GPa  \u03BD=${q}`), console.log(`              UL = ${x.toFixed(3)} kN/m\xB2 (= 100 psf)`), console.log("  Punto             X (in)  Y (in)  w_Hek (in)   w_Navier (in)  \u0394%   (bilineal)");
      for (const n of G) {
        const e = n.x * g, s = n.y * g, a = Z(e, s), i = Math.abs(a) / g, d = n.label.split(" ")[0], X = H[d], Y = (i / X - 1) * 100;
        console.log(`  ${n.label.padEnd(36)}  ${n.x.toString().padStart(3)}  ${n.y.toString().padStart(3)}   ${i.toFixed(4)}        ${X.toFixed(4)}     ${Y >= 0 ? "+" : ""}${Y.toFixed(2)}%`);
      }
      c.objects3D.val = [];
    },
    computedLabels: (v, c) => {
      var _a;
      const u = {}, r = (_a = c.deformOutputs.val) == null ? void 0 : _a.deformations;
      if (!r) return u;
      const t = Math.round(v.mesh), o = t, x = t, l = E / o, w = P / x;
      function $(y, b) {
        var _a2, _b, _c, _d;
        const h = Math.min(o - 1, Math.max(0, Math.floor(y / l))), m = Math.min(x - 1, Math.max(0, Math.floor(b / w))), p = (y - h * l) / l, M = (b - m * w) / w, _ = m * (o + 1) + h, S = m * (o + 1) + h + 1, I = (m + 1) * (o + 1) + h + 1, f = (m + 1) * (o + 1) + h, F = ((_a2 = r.get(_)) == null ? void 0 : _a2[2]) ?? 0, T = ((_b = r.get(S)) == null ? void 0 : _b[2]) ?? 0, k = ((_c = r.get(I)) == null ? void 0 : _c[2]) ?? 0, N = ((_d = r.get(f)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - p) * (1 - M) * F + p * (1 - M) * T + p * M * k + (1 - p) * M * N;
      }
      for (const y of G) {
        const b = y.x * g, h = y.y * g, m = $(b, h), p = Math.abs(m) / g, M = y.label.split(" ")[0], _ = H[M], S = (p / _ - 1) * 100;
        u[`${M} w_Hek/w_Navier`] = `${p.toFixed(4)} in / ${_.toFixed(4)} in (${S >= 0 ? "+" : ""}${S.toFixed(2)}%)`;
      }
      return u;
    },
    runModal(v, c, u) {
      var _a, _b, _c;
      const r = c.nodes.val, t = c.elements.val, o = c.nodeInputs.val, x = c.elementInputs.val;
      if (!(!r.length || !t.length || !((_a = o.supports) == null ? void 0 : _a.size) || !((_b = x.densities) == null ? void 0 : _b.size))) try {
        const l = tn(r, t, o, x, 12);
        u.render(l, {
          title: `SAFE Ex.1 SS Plate ${K}'\xD7${z}'\xD7${U}"`,
          properties: [
            "E=20.7 GPa  \u03BD=0.3  \u03C1=24 kN/m\xB3"
          ]
        }), console.log(`[SAFE Ex.1 Modal] f\u2081=${(_c = l.frequencies[0]) == null ? void 0 : _c.toFixed(4)} Hz, T\u2081=${(1 / l.frequencies[0]).toFixed(4)} s`);
      } catch (l) {
        console.warn("Modal SAFE Ex.1 error:", l.message);
      }
    }
  };
});
export {
  __tla,
  rn as b
};
