import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./theme-DQ--CgsI.js";
import { P as $t } from "./tweakpane-BXg6ZhiP.js";
import { a as Ht } from "./analyze-DgLgRmKg.js";
import { d as Rt, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Yt, c as vt, d as gt, e as xt } from "./getViewer-CRPCX0Ye.js";
import { e as Zt } from "./makeDraggable-zx2br6Yh.js";
import { g as Jt } from "./getParameters-DTL1yrut.js";
import { g as Kt } from "./styles-0iLl92Fx.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-ERv22veQ.js";
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
  const J = 2e8, yt = 0.3, Qt = J / (2 * (1 + yt)), qt = 78, i = {
    L: {
      value: s.state(4),
      min: 1,
      max: 10,
      step: 0.5,
      label: "Luz L (m)"
    },
    hw: {
      value: s.state(0.4),
      min: 0.2,
      max: 1.2,
      step: 0.05,
      label: "hw alma (m)"
    },
    tw: {
      value: s.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "tw alma (m)"
    },
    bf_sup: {
      value: s.state(0.2),
      min: 0.1,
      max: 0.5,
      step: 0.02,
      label: "bf SUP (m)"
    },
    tb_sup: {
      value: s.state(0.018),
      min: 8e-3,
      max: 0.04,
      step: 2e-3,
      label: "tb SUP (m)"
    },
    bf_inf: {
      value: s.state(0.3),
      min: 0.1,
      max: 0.5,
      step: 0.02,
      label: "bf INF (m)"
    },
    tb_inf: {
      value: s.state(0.022),
      min: 8e-3,
      max: 0.04,
      step: 2e-3,
      label: "tb INF (m)"
    },
    nx: {
      value: s.state(20),
      min: 8,
      max: 48,
      step: 2,
      label: "Mesh nx (luz)"
    },
    ny_w: {
      value: s.state(6),
      min: 2,
      max: 12,
      step: 1,
      label: "Mesh ny alma"
    },
    ny_f: {
      value: s.state(4),
      min: 2,
      max: 10,
      step: 1,
      label: "Mesh ny pat\xEDn"
    },
    P: {
      value: s.state(50),
      min: 0,
      max: 500,
      step: 10,
      label: "P punta (kN, -Z)"
    }
  }, Mt = s.state([]), wt = s.state([]), Pt = s.state({}), kt = s.state({}), It = s.state({}), zt = s.state({}), Bt = s.state({
    A: 0,
    y_c: 0,
    I: 0,
    M_max: 0,
    sigma_top_an: 0,
    sigma_bot_an: 0,
    sigma_max_he: 0,
    delta_an: 0,
    delta_he: 0,
    errPct: 0
  });
  s.derive(() => {
    var _a;
    const a = i.L.value.val, d = i.hw.value.val, F = i.tw.value.val, w = i.bf_sup.value.val, v = i.tb_sup.value.val, P = i.bf_inf.value.val, r = i.tb_inf.value.val, p = Math.round(i.nx.value.val), k = Math.round(i.ny_w.value.val), f = Math.round(i.ny_f.value.val), N = i.P.value.val, X = r, At = r + d, O = a / p, u = [], g = [], tt = /* @__PURE__ */ new Map(), T = 5;
    function C(t, e, l) {
      const o = `${t.toFixed(T)},${e.toFixed(T)},${l.toFixed(T)}`;
      let h = tt.get(o);
      return h === void 0 && (u.push([
        t,
        e,
        l
      ]), h = u.length - 1, tt.set(o, h)), h;
    }
    function G(t, e, l, o, h) {
      g.push([
        t,
        e,
        l,
        o
      ]);
      const c = g.length - 1;
      et.set(c, h), at.set(c, J), nt.set(c, yt), st.set(c, qt), ot.set(c, Qt), lt.set(c, 0), it.set(c, 0), rt.set(c, 0), ct.set(c, 0);
    }
    const et = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map(), it = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map(), ct = /* @__PURE__ */ new Map(), Et = d / k, _ = [];
    for (let t = 0; t <= k; t++) {
      const e = [], l = X + t * Et;
      for (let o = 0; o <= p; o++) e.push(C(o * O, 0, l));
      _.push(e);
    }
    for (let t = 0; t < k; t++) for (let e = 0; e < p; e++) G(_[t][e], _[t][e + 1], _[t + 1][e + 1], _[t + 1][e], F);
    const U = f % 2 === 0 ? f : f + 1, Ft = P / U, x = [];
    for (let t = 0; t <= U; t++) {
      const e = [], l = -P / 2 + t * Ft;
      for (let o = 0; o <= p; o++) Math.abs(l) < 1e-7 ? e.push(_[0][o]) : e.push(C(o * O, l, X));
      x.push(e);
    }
    for (let t = 0; t < U; t++) for (let e = 0; e < p; e++) G(x[t][e], x[t][e + 1], x[t + 1][e + 1], x[t + 1][e], r);
    const L = f % 2 === 0 ? f : f + 1, Nt = w / L, y = [];
    for (let t = 0; t <= L; t++) {
      const e = [], l = -w / 2 + t * Nt;
      for (let o = 0; o <= p; o++) Math.abs(l) < 1e-7 ? e.push(_[k][o]) : e.push(C(o * O, l, At));
      y.push(e);
    }
    for (let t = 0; t < L; t++) for (let e = 0; e < p; e++) G(y[t][e], y[t][e + 1], y[t + 1][e + 1], y[t + 1][e], v);
    const mt = /* @__PURE__ */ new Map();
    u.forEach((t, e) => {
      Math.abs(t[0]) < 1e-7 && mt.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const I = [];
    u.forEach((t, e) => {
      Math.abs(t[0] - a) < 1e-6 && I.push(e);
    });
    const dt = /* @__PURE__ */ new Map(), Ot = -N / Math.max(1, I.length);
    for (const t of I) dt.set(t, [
      0,
      0,
      Ot,
      0,
      0,
      0
    ]);
    const pt = {
      supports: mt,
      loads: dt
    }, D = {
      elasticities: at,
      shearModuli: ot,
      areas: lt,
      momentsOfInertiaY: it,
      momentsOfInertiaZ: rt,
      torsionalConstants: ct,
      densities: st,
      poissonsRatios: nt,
      thicknesses: et
    };
    let z = {}, j = {};
    try {
      z = Rt(u, g, pt, D), j = Ht(u, g, D, z);
    } catch (t) {
      console.warn("Viga doble T asim deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    const V = P * r, $ = F * d, H = w * v, ut = V + $ + H, _t = r / 2, ft = r + d / 2, bt = r + d + v / 2, b = (V * _t + $ * ft + H * bt) / ut, Tt = P * r ** 3 / 12, Ct = F * d ** 3 / 12, Gt = w * v ** 3 / 12, B = Tt + V * (_t - b) ** 2 + Ct + $ * (ft - b) ** 2 + Gt + H * (bt - b) ** 2, R = N * a, Ut = r + d + v - b, Lt = b, Dt = R * Ut / B, jt = -(R * Lt) / B, Y = -(N * a * a * a) / (3 * J * B);
    let Z = 0;
    const ht = j == null ? void 0 : j.vonMises;
    ht && ht.forEach((t) => t.forEach((e) => {
      e > Z && (Z = e);
    }));
    let S = 0;
    for (const t of I) {
      const e = (_a = z.deformations) == null ? void 0 : _a.get(t);
      e && Math.abs(e[2]) > Math.abs(S) && (S = e[2]);
    }
    const Vt = Math.abs(S - Y) / Math.abs(Y || 1) * 100;
    Bt.val = {
      A: ut,
      y_c: b,
      I: B,
      M_max: R,
      sigma_top_an: Dt,
      sigma_bot_an: jt,
      sigma_max_he: Z,
      delta_an: Y,
      delta_he: S,
      errPct: Vt
    }, Mt.val = u, wt.val = g, Pt.val = pt, kt.val = D, It.val = z, zt.val = j;
  });
  const St = Yt({
    mesh: {
      nodes: Mt,
      elements: wt,
      nodeInputs: Pt,
      elementInputs: kt,
      deformOutputs: It,
      analyzeOutputs: zt
    },
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 2,
      deformScale: 50,
      loads: true,
      supports: true,
      displayScale: 0.4
    }
  }), K = document.createElement("div");
  K.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const M = new $t({
    title: "\u{1F9EA} Benchmark \u2014 viga doble T asim",
    container: K,
    expanded: true
  }), n = {
    A: 0,
    y_c: 0,
    I: 0,
    M_max: 0,
    sigma_top_an: 0,
    sigma_bot_an: 0,
    sigma_max_he: 0,
    delta_an: 0,
    delta_he: 0,
    errPct: 0,
    status: "\u2014"
  }, m = (a) => a.toExponential(3), Wt = (a) => a.toFixed(4), Q = M.addFolder({
    title: "Secci\xF3n asim\xE9trica"
  });
  Q.addBinding(n, "A", {
    readonly: true,
    label: "\xC1rea total (m\xB2)",
    format: m
  });
  Q.addBinding(n, "y_c", {
    readonly: true,
    label: "Centroide y_c (m)",
    format: Wt
  });
  Q.addBinding(n, "I", {
    readonly: true,
    label: "I (m\u2074)",
    format: m
  });
  const A = M.addFolder({
    title: "Anal\xEDtico (Euler-Bernoulli)"
  });
  A.addBinding(n, "M_max", {
    readonly: true,
    label: "M_max (kN\xB7m)",
    format: m
  });
  A.addBinding(n, "sigma_top_an", {
    readonly: true,
    label: "\u03C3 top (kN/m\xB2)",
    format: m
  });
  A.addBinding(n, "sigma_bot_an", {
    readonly: true,
    label: "\u03C3 bot (kN/m\xB2)",
    format: m
  });
  A.addBinding(n, "delta_an", {
    readonly: true,
    label: "\u03B4 punta (m)",
    format: m
  });
  const E = M.addFolder({
    title: "Hekatan Q4 (medido)"
  });
  E.addBinding(n, "sigma_max_he", {
    readonly: true,
    label: "\u03C3 vM max (kN/m\xB2)",
    format: m
  });
  E.addBinding(n, "delta_he", {
    readonly: true,
    label: "\u03B4 punta (m)",
    format: m
  });
  E.addBinding(n, "errPct", {
    readonly: true,
    label: "\u0394 vs E-B (%)",
    format: (a) => a.toFixed(2)
  });
  E.addBinding(n, "status", {
    readonly: true,
    label: "Status"
  });
  const q = M.addFolder({
    title: "Unidades color map",
    expanded: false
  }), W = {
    stress: xt.val,
    disp: gt.val,
    force: vt.val
  };
  q.addBinding(W, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      kPa: "kPa",
      MPa: "MPa",
      GPa: "GPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      "tonf/m\xB2": "tonf/m\xB2",
      ksi: "ksi",
      psi: "psi"
    },
    label: "Tensi\xF3n"
  }).on("change", (a) => {
    xt.val = a.value;
  });
  q.addBinding(W, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm",
      \u00B5m: "\xB5m"
    },
    label: "Desplaz."
  }).on("change", (a) => {
    gt.val = a.value;
  });
  q.addBinding(W, "force", {
    options: {
      kN: "kN",
      tonf: "tonf",
      kip: "kip"
    },
    label: "Fuerza"
  }).on("change", (a) => {
    vt.val = a.value;
  });
  document.body.append(K);
  s.derive(() => {
    const a = Bt.val;
    n.A = a.A, n.y_c = a.y_c, n.I = a.I, n.M_max = a.M_max, n.sigma_top_an = a.sigma_top_an, n.sigma_bot_an = a.sigma_bot_an, n.sigma_max_he = a.sigma_max_he, n.delta_an = a.delta_an, n.delta_he = a.delta_he, n.errPct = a.errPct, n.status = a.errPct < 5 ? "\u2713 PASA (<5%)" : a.errPct < 15 ? "\u26A0 ACEPTABLE (5-15%)" : "\u2717 revisar (>15%)", M.refresh();
  });
  document.body.append(Jt(i), St, Kt({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/viga-doble-t/main.ts"
  }));
  setTimeout(() => Zt(), 200);
  setTimeout(() => {
    var _a;
    const a = St.__ctx;
    (a == null ? void 0 : a.camera) && (a == null ? void 0 : a.controls) && (a.camera.up.set(0, 0, 1), a.camera.position.set(2, 3, 1.5), a.controls.target.set(2, 0, 0.25), a.controls.update(), (_a = a.render) == null ? void 0 : _a.call(a));
  }, 800);
});
