import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as l, e as at, D as vt, M as y, c as S, C as ae } from "./theme-DQ--CgsI.js";
import { P as se } from "./tweakpane-BXg6ZhiP.js";
import { a as oe } from "./analyze-DgLgRmKg.js";
import { d as ne, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as le, d as bt, e as ht } from "./getViewer-BK63FXRH.js";
import { e as ie } from "./makeDraggable-zx2br6Yh.js";
import { g as me } from "./getParameters-DTL1yrut.js";
import { g as ce } from "./styles-0iLl92Fx.js";
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
  const _t = 25e6, Mt = 0.2, re = _t / (2 * (1 + Mt)), de = 24 / 9.80665, xt = 2e8, gt = 0.3, pe = xt / (2 * (1 + gt)), fe = 78 / 9.80665, r = {
    L: {
      value: l.state(15),
      min: 5,
      max: 30,
      step: 0.5,
      label: "L luz (m)"
    },
    W: {
      value: l.state(6),
      min: 4,
      max: 12,
      step: 0.5,
      label: "W ancho (m)"
    },
    t_s: {
      value: l.state(0.2),
      min: 0.1,
      max: 0.4,
      step: 0.01,
      label: "t losa (m)"
    },
    s_b: {
      value: l.state(2),
      min: 1,
      max: 4,
      step: 0.1,
      label: "spacing vigas (m)"
    },
    bf: {
      value: l.state(0.2),
      min: 0.1,
      max: 0.5,
      step: 0.01,
      label: "bf patines (m)"
    },
    tf: {
      value: l.state(0.015),
      min: 8e-3,
      max: 0.04,
      step: 1e-3,
      label: "tf patines (m)"
    },
    hw: {
      value: l.state(0.55),
      min: 0.3,
      max: 1.2,
      step: 0.025,
      label: "hw alma (m)"
    },
    tw: {
      value: l.state(0.01),
      min: 5e-3,
      max: 0.03,
      step: 1e-3,
      label: "tw alma (m)"
    },
    modo: {
      value: l.state(1),
      options: {
        "0 \u2014 Naive (doble-T completa)": 0,
        "1 \u2014 Solar (alma+pat\xEDn inf)": 1,
        "2 \u2014 Eccentric (offset rigid link)": 2
      },
      label: "Modo viga-losa"
    },
    q: {
      value: l.state(15),
      min: 1,
      max: 50,
      step: 0.5,
      label: "q losa (kN/m\xB2)"
    },
    nx: {
      value: l.state(20),
      min: 8,
      max: 40,
      step: 2,
      label: "Mesh nx (long)"
    },
    ny: {
      value: l.state(12),
      min: 4,
      max: 24,
      step: 2,
      label: "Mesh ny (transv)"
    }
  }, wt = l.state([]), yt = l.state([]), Bt = l.state({}), It = l.state({}), St = l.state({}), kt = l.state({}), Nt = l.state([]), zt = l.state({
    modo: "\u2014",
    M_max_kNm: 0,
    V_max_kN: 0,
    delta_mm: 0,
    vM_slab_max: 0,
    ratio_naive: 1,
    A_beam: 0,
    Iz_beam: 0
  });
  l.derive(() => {
    var _a, _b;
    const a = r.L.value.val, v = r.W.value.val, d = r.t_s.value.val, B = r.s_b.value.val, p = r.bf.value.val, n = r.tf.value.val, m = r.hw.value.val, b = r.tw.value.val, I = Math.round(r.modo.value.val), lt = r.q.value.val, f = Math.round(r.nx.value.val), x = Math.round(r.ny.value.val), C = 2 * p * n + m * b, Ot = 2 * n + m, it = 2 * (p * n * Math.pow(m / 2 + n / 2, 2)) + b * Math.pow(m, 3) / 12, Ft = (p * Math.pow(n, 3) + p * Math.pow(n, 3) + m * Math.pow(b, 3)) / 3, mt = p * n + m * b, ct = (p * n * (n / 2) + m * b * (n + m / 2)) / mt, Wt = p * Math.pow(n, 3) / 12 + p * n * Math.pow(ct - n / 2, 2), Ct = b * Math.pow(m, 3) / 12 + m * b * Math.pow(n + m / 2 - ct, 2), Lt = Wt + Ct, Pt = (p * Math.pow(n, 3) + m * Math.pow(b, 3)) / 3, Rt = I === 1 ? mt : C, Dt = I === 1 ? Lt : it, Tt = I === 1 ? Pt : Ft, k = [], _ = [], L = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map(), T = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), G = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map();
    function Vt(t, e, s) {
      return k.push([
        t,
        e,
        s
      ]), k.length - 1;
    }
    function qt(t, e, s, i, c) {
      _.push([
        t,
        e,
        s,
        i
      ]);
      const o = _.length - 1;
      L.set(o, c), P.set(o, _t), R.set(o, Mt), D.set(o, de), T.set(o, re), V.set(o, 0), G.set(o, 0), q.set(o, 0), J.set(o, 0);
    }
    function Gt(t, e, s, i, c) {
      _.push([
        t,
        e
      ]);
      const o = _.length - 1;
      P.set(o, xt), R.set(o, gt), D.set(o, fe), T.set(o, pe), V.set(o, s), G.set(o, i), q.set(o, i), J.set(o, c), L.set(o, 0);
    }
    const U = [
      v / 2 - B,
      v / 2,
      v / 2 + B
    ], Y = a / f, Z = v / x, O = [];
    for (let t = 0; t <= x; t++) O.push(t * Z);
    const F = [];
    for (const t of U) {
      let e = 0, s = 1 / 0;
      for (let i = 0; i <= x; i++) {
        const c = Math.abs(O[i] - t);
        c < s && (s = c, e = i);
      }
      O[e] = t, F.push(e);
    }
    const u = [];
    for (let t = 0; t <= x; t++) {
      const e = [];
      for (let s = 0; s <= f; s++) e.push(Vt(s * Y, O[t], 0));
      u.push(e);
    }
    for (let t = 0; t < x; t++) for (let e = 0; e < f; e++) qt(u[t][e], u[t][e + 1], u[t + 1][e + 1], u[t + 1][e], d);
    let H = Dt, K = Rt;
    if (I === 2) {
      const t = d / 2 + Ot / 2;
      H = it + C * t * t, K = C;
    }
    const Q = [];
    for (const t of F) for (let e = 0; e < f; e++) {
      const s = u[t][e], i = u[t][e + 1];
      Gt(s, i, K, H, Tt), Q.push(_.length - 1);
    }
    const X = /* @__PURE__ */ new Map();
    for (const t of F) {
      const e = u[t][0], s = u[t][f];
      X.set(e, [
        true,
        true,
        true,
        false,
        false,
        false
      ]), X.set(s, [
        false,
        true,
        true,
        false,
        false,
        false
      ]);
    }
    const rt = /* @__PURE__ */ new Map();
    for (let t = 0; t <= x; t++) for (let e = 0; e <= f; e++) {
      const s = t === 0 || t === x ? Z / 2 : Z, c = (e === 0 || e === f ? Y / 2 : Y) * s, o = -lt * c, w = u[t][e];
      rt.set(w, [
        0,
        0,
        o,
        0,
        0,
        0
      ]);
    }
    const dt = {
      supports: X,
      loads: rt
    }, $ = {
      elasticities: P,
      shearModuli: T,
      areas: V,
      momentsOfInertiaY: q,
      momentsOfInertiaZ: G,
      torsionalConstants: J,
      densities: D,
      poissonsRatios: R,
      thicknesses: L
    };
    let W = {}, tt = {};
    try {
      W = ne(k, _, dt, $), tt = oe(k, _, $, W);
    } catch (t) {
      console.warn("tablero-puente:", (t == null ? void 0 : t.message) ?? t);
    }
    let g = 0, N = 0;
    const z = tt, Jt = z == null ? void 0 : z.bendingsY, Ut = z == null ? void 0 : z.shearsZ, Yt = F[1], Zt = Math.round(f / 2), pt = f;
    for (let t = 0; t < f; t++) {
      const e = Q[pt + t], s = Jt == null ? void 0 : Jt.get(e), i = Ut == null ? void 0 : Ut.get(e);
      if (s) for (const c of s) Math.abs(c) > g && (g = Math.abs(c));
      if (i) for (const c of i) Math.abs(c) > N && (N = Math.abs(c));
    }
    if (g === 0) {
      const t = z == null ? void 0 : z.bendingsZ, e = z == null ? void 0 : z.shearsY;
      for (let s = 0; s < f; s++) {
        const i = Q[pt + s], c = t == null ? void 0 : t.get(i), o = e == null ? void 0 : e.get(i);
        if (c) for (const w of c) Math.abs(w) > g && (g = Math.abs(w));
        if (o) for (const w of o) Math.abs(w) > N && (N = Math.abs(w));
      }
    }
    const Ht = u[Yt][Zt], Kt = ((_b = (_a = W == null ? void 0 : W.deformations) == null ? void 0 : _a.get(Ht)) == null ? void 0 : _b[2]) ?? 0, Qt = Math.abs(Kt * 1e3);
    let et = 0;
    const ft = z == null ? void 0 : z.vonMises;
    ft && ft.forEach((t) => t.forEach((e) => {
      e > et && (et = e);
    }));
    const Xt = lt * B * a * a / 8, $t = g / Math.max(1e-3, Xt);
    zt.val = {
      modo: [
        "0 \u2014 Naive (doble-T)",
        "1 \u2014 Solar (alma+pat\xEDn inf)",
        "2 \u2014 Eccentric (offset)"
      ][I],
      M_max_kNm: g,
      V_max_kN: N,
      delta_mm: Qt,
      vM_slab_max: et,
      ratio_naive: $t,
      A_beam: K,
      Iz_beam: H
    };
    const M = [], te = new at({
      color: 12303291,
      transparent: true,
      opacity: 0.25,
      roughness: 0.85,
      metalness: 0.05,
      side: vt,
      depthWrite: false
    }), ut = new y(new S(a, v, d), te);
    ut.position.set(a / 2, v / 2, 0), M.push(ut);
    const j = new at({
      color: 56814,
      transparent: true,
      opacity: 0.45,
      roughness: 0.25,
      metalness: 0.6,
      side: vt,
      depthWrite: false
    });
    for (const t of U) if (I === 1) {
      const e = new y(new S(a, b, m), j);
      e.position.set(a / 2, t, -d / 2 - m / 2), M.push(e);
      const s = new y(new S(a, p, n), j);
      s.position.set(a / 2, t, -d / 2 - m - n / 2), M.push(s);
    } else {
      const e = new y(new S(a, p, n), j);
      e.position.set(a / 2, t, -d / 2 - n / 2), M.push(e);
      const s = new y(new S(a, b, m), j);
      s.position.set(a / 2, t, -d / 2 - n - m / 2), M.push(s);
      const i = new y(new S(a, p, n), j);
      i.position.set(a / 2, t, -d / 2 - n - m - n / 2), M.push(i);
    }
    const ee = new at({
      color: 16737792,
      emissive: 16729088,
      emissiveIntensity: 0.7
    });
    for (const t of U) {
      const e = new y(new ae(0.04, 0.04, a, 16), ee);
      e.rotation.z = Math.PI / 2, e.position.set(a / 2, t, 0), M.push(e);
    }
    wt.val = k, yt.val = _, Bt.val = dt, It.val = $, St.val = W, kt.val = tt, Nt.val = M;
  });
  const jt = le({
    mesh: {
      nodes: wt,
      elements: yt,
      nodeInputs: Bt,
      elementInputs: It,
      deformOutputs: St,
      analyzeOutputs: kt
    },
    objects3D: Nt,
    settingsObj: {
      deformedShape: false,
      shellResults: "vonMises",
      gridSize: 2,
      deformScale: 5,
      custom3D: true,
      loads: false,
      supports: true,
      showCotas: false,
      displayScale: 0.3
    }
  }), st = document.createElement("div");
  st.style.cssText = "position:fixed;top:8px;right:8px;width:340px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const E = new se({
    title: "\u{1F309} Tablero puente \u2014 vigas+losa",
    container: st,
    expanded: true
  }), h = {
    modo: "\u2014",
    M_max_kNm: 0,
    V_max_kN: 0,
    delta_mm: 0,
    vM_slab_max: 0,
    ratio_naive: 1,
    A_beam: 0,
    Iz_beam: 0
  }, ot = E.addFolder({
    title: "\u2139\uFE0F Recomendaci\xF3n Solar"
  });
  ot.addBinding({
    msg: "Modo 1 (Solar) coincide con SAP2000"
  }, "msg", {
    readonly: true,
    view: "text",
    interval: 0
  });
  ot.addBinding({
    msg: "Modo 0 SOBRE-rigidiza por ~2x"
  }, "msg", {
    readonly: true,
    view: "text",
    interval: 0
  });
  ot.addBinding({
    msg: "Modo 2 (Eccentric) \u2248 Modo 1 si offset bien"
  }, "msg", {
    readonly: true,
    view: "text",
    interval: 0
  });
  const nt = E.addFolder({
    title: "\u{1F4D0} Secci\xF3n viga FRAME usada"
  });
  nt.addBinding(h, "modo", {
    readonly: true,
    label: "Modo activo",
    view: "text",
    interval: 0
  });
  nt.addBinding(h, "A_beam", {
    readonly: true,
    label: "A (m\xB2)",
    format: (a) => a.toFixed(5)
  });
  nt.addBinding(h, "Iz_beam", {
    readonly: true,
    label: "Iz (m\u2074)",
    format: (a) => a.toExponential(3)
  });
  const A = E.addFolder({
    title: "\u{1F4CA} Resultados an\xE1lisis"
  });
  A.addBinding(h, "M_max_kNm", {
    readonly: true,
    label: "M max viga (kN\xB7m)",
    format: (a) => a.toFixed(1)
  });
  A.addBinding(h, "V_max_kN", {
    readonly: true,
    label: "V max viga (kN)",
    format: (a) => a.toFixed(1)
  });
  A.addBinding(h, "delta_mm", {
    readonly: true,
    label: "\u03B4 midspan (mm)",
    format: (a) => a.toFixed(2)
  });
  A.addBinding(h, "vM_slab_max", {
    readonly: true,
    label: "\u03C3vM losa max (kN/m\xB2)",
    format: (a) => a.toExponential(3)
  });
  A.addBinding(h, "ratio_naive", {
    readonly: true,
    label: "M / (qL\xB2/8)",
    format: (a) => a.toFixed(3)
  });
  const Et = E.addFolder({
    title: "Unidades",
    expanded: false
  }), At = {
    stress: ht.val,
    disp: bt.val
  };
  Et.addBinding(At, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (a) => {
    ht.val = a.value;
  });
  Et.addBinding(At, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (a) => {
    bt.val = a.value;
  });
  document.body.append(st);
  l.derive(() => {
    Object.assign(h, zt.val), E.refresh();
  });
  document.body.append(me(r), jt, ce({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/tablero-puente/main.ts"
  }));
  setTimeout(() => ie(), 200);
  setTimeout(() => {
    var _a;
    const a = jt.__ctx;
    if ((a == null ? void 0 : a.camera) && (a == null ? void 0 : a.controls)) {
      a.camera.up.set(0, 0, 1);
      const v = r.L.value.val, d = r.W.value.val, B = Math.max(v, d);
      a.camera.position.set(v / 2, d / 2 - B * 1.2, B * 1.5), a.controls.target.set(v / 2, d / 2, 0), a.controls.update(), (_a = a.render) == null ? void 0 : _a.call(a);
    }
  }, 800);
});
