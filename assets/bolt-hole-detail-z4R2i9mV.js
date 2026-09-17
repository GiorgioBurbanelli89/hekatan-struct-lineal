import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a, b as et, V as B, d as E, B as G } from "./theme-C-zoknmI.js";
import { a as xt, __tla as __tla_0 } from "./analyze-DWlgMbqF.js";
import { d as It, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { g as Bt, __tla as __tla_2 } from "./getViewer-CHIxMOEz.js";
import { g as Pt } from "./getParameters-Dt61s_50.js";
import { g as Tt } from "./styles-CqEyA8nI.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./Text-Cehu0nom.js";
import "./tweakpane-BXg6ZhiP.js";
Promise.all([
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  const N = 2e8, V = 0.3, st = N / (2 * (1 + V)), ot = 78, i = {
    L: {
      value: a.state(0.2),
      min: 0.1,
      max: 0.5,
      step: 0.02,
      label: "L placa (m, lado)"
    },
    t_plate: {
      value: a.state(0.02),
      min: 8e-3,
      max: 0.05,
      step: 2e-3,
      label: "Espesor placa (m)"
    },
    d_hole: {
      value: a.state(0.03),
      min: 0.012,
      max: 0.08,
      step: 2e-3,
      label: "\xD8 orificio (m)"
    },
    d_bolt: {
      value: a.state(0.024),
      min: 0.01,
      max: 0.06,
      step: 2e-3,
      label: "\xD8 perno (m)"
    },
    L_bolt: {
      value: a.state(0.15),
      min: 0.05,
      max: 0.4,
      step: 0.01,
      label: "L perno (m)"
    },
    nRadial: {
      value: a.state(8),
      min: 4,
      max: 20,
      step: 1,
      label: "Mesh radial"
    },
    nTheta: {
      value: a.state(24),
      min: 12,
      max: 48,
      step: 4,
      label: "Mesh angular"
    },
    Pull: {
      value: a.state(50),
      min: 0,
      max: 500,
      step: 5,
      label: "Tracci\xF3n borde (kN)"
    }
  }, nt = a.state([]), at = a.state([]), lt = a.state({}), ct = a.state({}), rt = a.state({}), it = a.state({}), mt = a.state([]);
  a.derive(() => {
    const r = i.L.value.val, pt = i.t_plate.value.val, A = i.d_hole.value.val, f = i.d_bolt.value.val, p = i.L_bolt.value.val, M = Math.round(i.nRadial.value.val), l = Math.round(i.nTheta.value.val), J = i.Pull.value.val, b = A / 2, dt = r / 2, d = [], m = [], P = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
    function w(t, s, o) {
      return d.push([
        t,
        s,
        o
      ]), d.length - 1;
    }
    function ht(t, s, o, n, c) {
      m.push([
        t,
        s,
        o,
        n
      ]);
      const e = m.length - 1;
      P.set(e, c), T.set(e, N), S.set(e, V), y.set(e, ot), L.set(e, 0), z.set(e, 0), O.set(e, 0), C.set(e, 0), F.set(e, st);
    }
    function R(t, s, o, n, c) {
      m.push([
        t,
        s
      ]);
      const e = m.length - 1;
      T.set(e, N), F.set(e, st), S.set(e, V), y.set(e, ot), L.set(e, o), z.set(e, n), O.set(e, n), C.set(e, c), P.set(e, 0);
    }
    const u = [];
    for (let t = 0; t <= M; t++) {
      const s = b + t / M * (dt - b), o = [];
      for (let n = 0; n < l; n++) {
        const c = n / l * 2 * Math.PI;
        o.push(w(s * Math.cos(c), s * Math.sin(c), 0));
      }
      u.push(o);
    }
    for (let t = 0; t < M; t++) for (let s = 0; s < l; s++) {
      const o = (s + 1) % l;
      ht(u[t][s], u[t][o], u[t + 1][o], u[t + 1][s], pt);
    }
    const $ = Math.PI * f * f / 4, g = Math.PI * Math.pow(f, 4) / 64, H = 2 * g, Y = w(0, 0, -p / 2), j = w(0, 0, 0), ft = w(0, 0, p / 2);
    R(Y, j, $, g, H), R(j, ft, $, g, H);
    const Z = g * 100, Mt = $ * 10;
    for (let t = 0; t < l; t++) R(j, u[0][t], Mt, Z, Z * 2);
    const q = /* @__PURE__ */ new Map();
    q.set(Y, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const v = /* @__PURE__ */ new Map(), vt = Math.round(l * 0.25), bt = Math.round(l * 0.75), _ = Math.max(2, Math.round(l * 0.15));
    let K = 0, Q = 0;
    for (let t = -_; t <= _; t++) K++, Q++;
    const wt = J / K, gt = -J / Q;
    for (let t = -_; t <= _; t++) {
      const s = (vt + t + l) % l, o = (bt + t + l) % l, n = u[M][s], c = u[M][o], e = v.get(n) || [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      v.set(n, [
        e[0],
        e[1] + wt,
        e[2],
        e[3],
        e[4],
        e[5]
      ]);
      const h = v.get(c) || [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      v.set(c, [
        h[0],
        h[1] + gt,
        h[2],
        h[3],
        h[4],
        h[5]
      ]);
    }
    const U = {
      supports: q,
      loads: v
    }, k = {
      elasticities: T,
      shearModuli: F,
      areas: L,
      momentsOfInertiaY: O,
      momentsOfInertiaZ: z,
      torsionalConstants: C,
      densities: y,
      poissonsRatios: S,
      thicknesses: P
    };
    let D = {}, W = {};
    try {
      D = It(d, m, U, k), W = xt(d, m, k, D);
    } catch (t) {
      console.warn("Bolt-hole detail deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    const x = [], _t = new et({
      color: 16744448,
      linewidth: 3
    }), X = [];
    for (let t = 0; t <= 64; t++) {
      const s = t / 64 * 2 * Math.PI;
      X.push(new B(b * Math.cos(s), b * Math.sin(s), 5e-4));
    }
    x.push(new E(new G().setFromPoints(X), _t));
    const tt = new et({
      color: 16755200,
      linewidth: 2
    }), I = f / 2;
    for (let t = 0; t <= 16; t++) {
      const s = t / 16 * 2 * Math.PI, o = I * Math.cos(s), n = I * Math.sin(s), c = new G().setFromPoints([
        new B(o, n, -p / 2),
        new B(o, n, p / 2)
      ]);
      x.push(new E(c, tt));
    }
    for (const t of [
      -p / 2,
      0,
      p / 2
    ]) {
      const s = [];
      for (let o = 0; o <= 32; o++) {
        const n = o / 32 * 2 * Math.PI;
        s.push(new B(I * Math.cos(n), I * Math.sin(n), t));
      }
      x.push(new E(new G().setFromPoints(s), tt));
    }
    mt.val = x, console.log(`Bolt-hole: ${d.length} nodos, ${m.length} elem | placa=${r * 1e3}mm, hole=\xD8${(A * 1e3).toFixed(0)}mm, bolt=\xD8${(f * 1e3).toFixed(0)}mm`), nt.val = d, at.val = m, lt.val = U, ct.val = k, rt.val = D, it.val = W;
  });
  const ut = Bt({
    mesh: {
      nodes: nt,
      elements: at,
      nodeInputs: lt,
      elementInputs: ct,
      deformOutputs: rt,
      analyzeOutputs: it
    },
    objects3D: mt,
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 0.5,
      deformScale: 100,
      custom3D: true
    }
  });
  document.body.append(Pt(i), ut, Tt({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/bolt-hole-detail/main.ts"
  }));
  setTimeout(() => {
    var _a;
    const r = ut.__ctx;
    (r == null ? void 0 : r.camera) && (r == null ? void 0 : r.controls) && (r.camera.up.set(0, 0, 1), r.camera.position.set(0.4, -0.4, 0.3), r.controls.target.set(0, 0, 0), r.controls.update(), (_a = r.render) == null ? void 0 : _a.call(r));
  }, 800);
});
