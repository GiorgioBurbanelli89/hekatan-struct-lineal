import { m as ot, p as et, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
let it;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let w, W, st, at, K, z, U, v, P, R, Q, q, G, H;
  w = 0.0254;
  W = 0.3048;
  st = 0.04788;
  at = 6894.76;
  K = 30;
  z = 20;
  U = 8;
  v = K * W;
  P = z * W;
  R = U * w;
  Q = 3e3 * at;
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
  it = {
    id: "benchmark-safe-ex01-plate",
    name: "SAFE Ex.1 \xB7 Placa SS rectangular (Timoshenko)",
    category: "2\uFE0F\u20E3 Shells \xB7 \u{1F9F1} Placas",
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
    build(E, c) {
      const u = Math.round(E.theoryType), r = Math.round(E.mesh), o = r, e = r, m = 100 * st, l = et({
        E: Q,
        nu: q,
        thickness: R,
        theoryType: u,
        meshLx: v,
        meshLy: P,
        meshNx: o,
        meshNy: e,
        bcType: "simply-supported",
        pressure: -m
      }), _ = l.nodeResults.map((t) => [
        t.x,
        t.y,
        0
      ]), S = l.elementResults.map((t) => t.nodes);
      c.nodes.val = _, c.elements.val = S;
      const y = /* @__PURE__ */ new Map();
      S.forEach((t, n) => y.set(n, R));
      const b = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Map();
      S.forEach((t, n) => {
        b.set(n, Q), h.set(n, q), x.set(n, 24 / 9.81);
      });
      const M = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), g = v / o, $ = P / e, X = g * $;
      _.forEach((t, n) => {
        const s = Math.abs(t[0]) < 1e-6 || Math.abs(t[0] - v) < 1e-6, a = Math.abs(t[1]) < 1e-6 || Math.abs(t[1] - P) < 1e-6;
        (s || a) && M.set(n, [
          true,
          true,
          true,
          false,
          false,
          false
        ]);
        const i = s && a ? 0.25 : s || a ? 0.5 : 1;
        p.set(n, [
          0,
          0,
          -m * X * i,
          0,
          0,
          0
        ]);
      }), c.nodeInputs.val = {
        supports: M,
        loads: p
      }, c.elementInputs.val = {
        thicknesses: y,
        elasticities: b,
        poissonsRatios: h,
        densities: x
      };
      const f = /* @__PURE__ */ new Map();
      l.nodeResults.forEach((t, n) => {
        f.set(n, [
          0,
          0,
          t.w,
          t.bx,
          t.by,
          0
        ]);
      }), c.deformOutputs.val = {
        deformations: f
      };
      const F = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), Y = R * R / 6;
      l.elementResults.forEach((t, n) => {
        F.set(n, [
          t.Mxx,
          t.Mxx,
          t.Mxx,
          t.Mxx
        ]), T.set(n, [
          t.Myy,
          t.Myy,
          t.Myy,
          t.Myy
        ]), k.set(n, [
          t.Mxy,
          t.Mxy,
          t.Mxy,
          t.Mxy
        ]), N.set(n, [
          t.Qx,
          t.Qx,
          t.Qx,
          t.Qx
        ]), j.set(n, [
          t.Qy,
          t.Qy,
          t.Qy,
          t.Qy
        ]);
        const s = t.Mxx / Y, a = t.Myy / Y, i = t.Mxy / Y, d = Math.sqrt(s * s - s * a + a * a + 3 * i * i);
        C.set(n, [
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
      const L = v / o, O = P / e;
      function Z(t, n) {
        var _a, _b, _c, _d;
        const s = Math.min(o - 1, Math.max(0, Math.floor(t / L))), a = Math.min(e - 1, Math.max(0, Math.floor(n / O))), i = (t - s * L) / L, d = (n - a * O) / O, A = a * (o + 1) + s, I = a * (o + 1) + s + 1, B = (a + 1) * (o + 1) + s + 1, D = (a + 1) * (o + 1) + s, V = ((_a = f.get(A)) == null ? void 0 : _a[2]) ?? 0, J = ((_b = f.get(I)) == null ? void 0 : _b[2]) ?? 0, tt = ((_c = f.get(B)) == null ? void 0 : _c[2]) ?? 0, nt = ((_d = f.get(D)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - i) * (1 - d) * V + i * (1 - d) * J + i * d * tt + (1 - i) * d * nt;
      }
      console.log(`
[SAFE Ex.1 \xB7 ${o}\xD7${e} ${u === 1 ? "Thin (Kirchhoff)" : "Thick (Mindlin)"}]  Geom ${K}'\xD7${z}'\xD7${U}"  E=${(Q / 1e6).toFixed(1)} GPa  \u03BD=${q}`), console.log(`              UL = ${m.toFixed(3)} kN/m\xB2 (= 100 psf)`), console.log("  Punto             X (in)  Y (in)  w_Hek (in)   w_Navier (in)  \u0394%   (bilineal)");
      for (const t of G) {
        const n = t.x * w, s = t.y * w, a = Z(n, s), i = Math.abs(a) / w, d = t.label.split(" ")[0], A = H[d], I = (i / A - 1) * 100;
        console.log(`  ${t.label.padEnd(36)}  ${t.x.toString().padStart(3)}  ${t.y.toString().padStart(3)}   ${i.toFixed(4)}        ${A.toFixed(4)}     ${I >= 0 ? "+" : ""}${I.toFixed(2)}%`);
      }
      c.objects3D.val = [];
    },
    computedLabels: (E, c) => {
      var _a;
      const u = {}, r = (_a = c.deformOutputs.val) == null ? void 0 : _a.deformations;
      if (!r) return u;
      const o = Math.round(E.mesh), e = o, m = o, l = v / e, _ = P / m;
      function S(y, b) {
        var _a2, _b, _c, _d;
        const h = Math.min(e - 1, Math.max(0, Math.floor(y / l))), x = Math.min(m - 1, Math.max(0, Math.floor(b / _))), M = (y - h * l) / l, p = (b - x * _) / _, g = x * (e + 1) + h, $ = x * (e + 1) + h + 1, X = (x + 1) * (e + 1) + h + 1, f = (x + 1) * (e + 1) + h, F = ((_a2 = r.get(g)) == null ? void 0 : _a2[2]) ?? 0, T = ((_b = r.get($)) == null ? void 0 : _b[2]) ?? 0, k = ((_c = r.get(X)) == null ? void 0 : _c[2]) ?? 0, N = ((_d = r.get(f)) == null ? void 0 : _d[2]) ?? 0;
        return (1 - M) * (1 - p) * F + M * (1 - p) * T + M * p * k + (1 - M) * p * N;
      }
      for (const y of G) {
        const b = y.x * w, h = y.y * w, x = S(b, h), M = Math.abs(x) / w, p = y.label.split(" ")[0], g = H[p], $ = (M / g - 1) * 100;
        u[`${p} w_Hek/w_Navier`] = `${M.toFixed(4)} in / ${g.toFixed(4)} in (${$ >= 0 ? "+" : ""}${$.toFixed(2)}%)`;
      }
      return u;
    },
    runModal(E, c, u) {
      var _a, _b, _c;
      const r = c.nodes.val, o = c.elements.val, e = c.nodeInputs.val, m = c.elementInputs.val;
      if (!(!r.length || !o.length || !((_a = e.supports) == null ? void 0 : _a.size) || !((_b = m.densities) == null ? void 0 : _b.size))) try {
        const l = ot(r, o, e, m, 12);
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
  it as b
};
