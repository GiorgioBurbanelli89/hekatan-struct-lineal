import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a, b as et, V as B, d as E, B as G } from "./Text-Br8EG2up.js";
import { a as xt } from "./analyze-C-HJ03ae.js";
import { d as It, __tla as __tla_0 } from "./didacticCpp-CzlDWovh.js";
import { g as Bt, a as Pt } from "./aiAgent-DgA67aIB.js";
import { g as Tt } from "./getParameters-CXLHIsuY.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-DmQkkByq.js";
import "./preload-helper-V2P8TQsQ.js";
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
  }, nt = a.state([]), at = a.state([]), lt = a.state({}), ct = a.state({}), rt = a.state({}), it = a.state({}), ut = a.state([]);
  a.derive(() => {
    const r = i.L.value.val, pt = i.t_plate.value.val, A = i.d_hole.value.val, M = i.d_bolt.value.val, p = i.L_bolt.value.val, f = Math.round(i.nRadial.value.val), l = Math.round(i.nTheta.value.val), J = i.Pull.value.val, b = A / 2, dt = r / 2, d = [], u = [], P = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), S = /* @__PURE__ */ new Map(), y = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map();
    function w(t, s, o) {
      return d.push([
        t,
        s,
        o
      ]), d.length - 1;
    }
    function ht(t, s, o, n, c) {
      u.push([
        t,
        s,
        o,
        n
      ]);
      const e = u.length - 1;
      P.set(e, c), T.set(e, N), S.set(e, V), y.set(e, ot), L.set(e, 0), z.set(e, 0), O.set(e, 0), C.set(e, 0), F.set(e, st);
    }
    function R(t, s, o, n, c) {
      u.push([
        t,
        s
      ]);
      const e = u.length - 1;
      T.set(e, N), F.set(e, st), S.set(e, V), y.set(e, ot), L.set(e, o), z.set(e, n), O.set(e, n), C.set(e, c), P.set(e, 0);
    }
    const m = [];
    for (let t = 0; t <= f; t++) {
      const s = b + t / f * (dt - b), o = [];
      for (let n = 0; n < l; n++) {
        const c = n / l * 2 * Math.PI;
        o.push(w(s * Math.cos(c), s * Math.sin(c), 0));
      }
      m.push(o);
    }
    for (let t = 0; t < f; t++) for (let s = 0; s < l; s++) {
      const o = (s + 1) % l;
      ht(m[t][s], m[t][o], m[t + 1][o], m[t + 1][s], pt);
    }
    const $ = Math.PI * M * M / 4, g = Math.PI * Math.pow(M, 4) / 64, H = 2 * g, Y = w(0, 0, -p / 2), j = w(0, 0, 0), Mt = w(0, 0, p / 2);
    R(Y, j, $, g, H), R(j, Mt, $, g, H);
    const Z = g * 100, ft = $ * 10;
    for (let t = 0; t < l; t++) R(j, m[0][t], ft, Z, Z * 2);
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
      const s = (vt + t + l) % l, o = (bt + t + l) % l, n = m[f][s], c = m[f][o], e = v.get(n) || [
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
      D = It(d, u, U, k), W = xt(d, u, k, D);
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
    }), I = M / 2;
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
    ut.val = x, console.log(`Bolt-hole: ${d.length} nodos, ${u.length} elem | placa=${r * 1e3}mm, hole=\xD8${(A * 1e3).toFixed(0)}mm, bolt=\xD8${(M * 1e3).toFixed(0)}mm`), nt.val = d, at.val = u, lt.val = U, ct.val = k, rt.val = D, it.val = W;
  });
  const mt = Bt({
    mesh: {
      nodes: nt,
      elements: at,
      nodeInputs: lt,
      elementInputs: ct,
      deformOutputs: rt,
      analyzeOutputs: it
    },
    objects3D: ut,
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 0.5,
      deformScale: 100,
      custom3D: true
    }
  });
  document.body.append(Tt(i), mt, Pt({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/bolt-hole-detail/main.ts"
  }));
  setTimeout(() => {
    var _a;
    const r = mt.__ctx;
    (r == null ? void 0 : r.camera) && (r == null ? void 0 : r.controls) && (r.camera.up.set(0, 0, 1), r.camera.position.set(0.4, -0.4, 0.3), r.controls.target.set(0, 0, 0), r.controls.update(), (_a = r.render) == null ? void 0 : _a.call(r));
  }, 800);
});
