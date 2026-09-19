import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as l } from "./theme-C-zoknmI.js";
import { P as ke } from "./tweakpane-BXg6ZhiP.js";
import { a as Ce, __tla as __tla_0 } from "./analyze-h3F5Phoi.js";
import { d as we, __tla as __tla_1 } from "./didacticCpp-Czy7NlhT.js";
import { h as Ee, __tla as __tla_2 } from "./h8-Dq5Es-cV.js";
import { g as Fe, c as Be, f as ne, h as oe, __tla as __tla_3 } from "./getViewer-BwuXkQzt.js";
import { e as Oe } from "./makeDraggable-zx2br6Yh.js";
import { g as Te } from "./getParameters-COJmAxBJ.js";
import { g as je } from "./aiAgent-DN1k8d69.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./Text-Cehu0nom.js";
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
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })()
]).then(async () => {
  const P = 2e8, se = 0.3, Ne = P / (2 * (1 + se)), He = 78, Ge = 35e4, Le = 0.2, d = {
    bc: {
      value: l.state(0.4),
      min: 0.2,
      max: 0.8,
      step: 0.05,
      label: "bc tubo (m, eje X)"
    },
    hc: {
      value: l.state(0.4),
      min: 0.2,
      max: 0.8,
      step: 0.05,
      label: "hc tubo (m, eje Y)"
    },
    Lz: {
      value: l.state(3),
      min: 1.5,
      max: 6,
      step: 0.5,
      label: "Altura Lz (m)"
    },
    t: {
      value: l.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared HSS (m)"
    },
    nx: {
      value: l.state(4),
      min: 2,
      max: 8,
      step: 2,
      label: "nx (X)"
    },
    ny: {
      value: l.state(4),
      min: 2,
      max: 8,
      step: 2,
      label: "ny (Y)"
    },
    nz: {
      value: l.state(8),
      min: 4,
      max: 16,
      step: 2,
      label: "nz (Z)"
    },
    fc: {
      value: l.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c concreto (kN/m\xB2)"
    },
    Pu: {
      value: l.state(2e3),
      min: 0,
      max: 1e4,
      step: 100,
      label: "Pu axial (kN, -Z)"
    }
  }, le = l.state([]), ce = l.state([]), re = l.state({}), de = l.state({}), ie = l.state({}), me = l.state({}), ue = l.state({
    As: 0,
    Ac: 0,
    Is: 0,
    Ic: 0,
    EI_eff: 0,
    Pno_AISC: 0,
    demandCap: 0,
    uz_top_he: 0,
    uz_axial_an: 0,
    errPct: 0
  });
  l.derive(() => {
    var _a;
    const a = d.bc.value.val, p = d.hc.value.val, A = d.Lz.value.val, f = d.t.value.val, i = Math.round(d.nx.value.val), m = Math.round(d.ny.value.val), b = Math.round(d.nz.value.val), L = d.fc.value.val, k = d.Pu.value.val, C = 4700 * Math.sqrt(L / 1e3) * 1e3, U = a / 2 - f, $ = p / 2 - f, u = [], D = /* @__PURE__ */ new Map(), w = 5;
    function be(e, t, o) {
      const c = `${e.toFixed(w)},${t.toFixed(w)},${o.toFixed(w)}`;
      let s = D.get(c);
      return s === void 0 && (u.push([
        e,
        t,
        o
      ]), s = u.length - 1, D.set(c, s)), s;
    }
    const v = [], R = /* @__PURE__ */ new Map(), Y = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), V = /* @__PURE__ */ new Map(), X = /* @__PURE__ */ new Map(), q = /* @__PURE__ */ new Map(), J = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map();
    function I(e, t, o, c) {
      v.push([
        e,
        t,
        o,
        c
      ]);
      const s = v.length - 1;
      R.set(s, f), Y.set(s, P), Z.set(s, se), V.set(s, He), X.set(s, Ne), q.set(s, 0), J.set(s, 0), K.set(s, 0), Q.set(s, 0);
    }
    const ve = 2 * U / i, xe = 2 * $ / m, ge = A / b, n = (e, t, o) => be(-U + e * ve, -$ + t * xe, o * ge), E = [];
    for (let e = 0; e < b; e++) for (let t = 0; t < m; t++) for (let o = 0; o < i; o++) E.push([
      n(o, t, e),
      n(o + 1, t, e),
      n(o + 1, t + 1, e),
      n(o, t + 1, e),
      n(o, t, e + 1),
      n(o + 1, t, e + 1),
      n(o + 1, t + 1, e + 1),
      n(o, t + 1, e + 1)
    ]);
    for (let e = 0; e < b; e++) for (let t = 0; t < m; t++) I(n(0, t, e), n(0, t + 1, e), n(0, t + 1, e + 1), n(0, t, e + 1));
    for (let e = 0; e < b; e++) for (let t = 0; t < m; t++) I(n(i, t, e), n(i, t + 1, e), n(i, t + 1, e + 1), n(i, t, e + 1));
    for (let e = 0; e < b; e++) for (let t = 0; t < i; t++) I(n(t, 0, e), n(t + 1, 0, e), n(t + 1, 0, e + 1), n(t, 0, e + 1));
    for (let e = 0; e < b; e++) for (let t = 0; t < i; t++) I(n(t, m, e), n(t + 1, m, e), n(t + 1, m, e + 1), n(t, m, e + 1));
    const F = /* @__PURE__ */ new Map();
    u.forEach((e, t) => {
      Math.abs(e[2]) < 1e-7 && F.set(t, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const M = [];
    u.forEach((e, t) => {
      Math.abs(e[2] - A) < 1e-6 && M.push(t);
    });
    const _e = -k / Math.max(1, M.length), B = /* @__PURE__ */ new Map();
    for (const e of M) B.set(e, [
      0,
      0,
      _e,
      0,
      0,
      0
    ]);
    const W = {
      supports: F,
      loads: B
    }, O = {
      elasticities: Y,
      poissonsRatios: Z,
      densities: V,
      shearModuli: X,
      thicknesses: R,
      areas: q,
      momentsOfInertiaZ: K,
      momentsOfInertiaY: J,
      torsionalConstants: Q
    };
    let y = {}, ee = {};
    try {
      y = we(u, v, W, O), ee = Ce(u, v, O, y);
    } catch (e) {
      console.warn("CFT shell deform/analyze:", (e == null ? void 0 : e.message) ?? e);
    }
    try {
      const e = /* @__PURE__ */ new Map();
      F.forEach((c, s) => e.set(s, [
        c[0],
        c[1],
        c[2]
      ]));
      const t = /* @__PURE__ */ new Map();
      B.forEach((c, s) => t.set(s, [
        c[0],
        c[1],
        c[2]
      ]));
      const o = Ee({
        nodes: u,
        elements: E,
        E: C,
        nu: Le,
        supports: e,
        loads: t
      });
      console.log(`CFT concreto H8: ${E.length} elem \xB7 ${o.elapsedMs.toFixed(0)}ms`);
    } catch (e) {
      console.warn("CFT concreto H8:", (e == null ? void 0 : e.message) ?? e);
    }
    const x = (a - 2 * f) * (p - 2 * f), g = a * p - x, Ie = a * p * p * p / 12, T = (a - 2 * f) * (p - 2 * f) ** 3 / 12, te = Ie - T, Me = Math.min(0.9, 0.45 + 3 * g / (g + x)), ye = P * te + Me * C * T, ae = Ge * g + 0.85 * L * x, Se = 0.75 * ae, Pe = k / Math.max(1, Se), ze = P * g + C * x, j = -k * A / ze;
    let S = 0;
    for (const e of M) {
      const t = (_a = y.deformations) == null ? void 0 : _a.get(e);
      t && Math.abs(t[2]) > Math.abs(S) && (S = t[2]);
    }
    const Ae = Math.abs(S - j) / Math.abs(j || 1) * 100;
    ue.val = {
      As: g,
      Ac: x,
      Is: te,
      Ic: T,
      EI_eff: ye,
      Pno_AISC: ae,
      demandCap: Pe,
      uz_top_he: S,
      uz_axial_an: j,
      errPct: Ae
    }, le.val = u, ce.val = v, re.val = W, de.val = O, ie.val = y, me.val = ee;
  });
  const pe = Fe({
    mesh: {
      nodes: le,
      elements: ce,
      nodeInputs: re,
      elementInputs: de,
      deformOutputs: ie,
      analyzeOutputs: me
    },
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 4,
      deformScale: 200,
      loads: true,
      supports: true,
      displayScale: 0.4
    }
  }), N = document.createElement("div");
  N.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const _ = new ke({
    title: "\u{1F9EA} Benchmark \u2014 CFT (HSS+H8)",
    container: N,
    expanded: true
  }), r = {
    As: 0,
    Ac: 0,
    Is: 0,
    Ic: 0,
    EI_eff: 0,
    Pno_AISC: 0,
    demandCap: 0,
    uz_top_he: 0,
    uz_axial_an: 0,
    errPct: 0
  }, h = (a) => a.toExponential(3), z = _.addFolder({
    title: "Secci\xF3n compuesta"
  });
  z.addBinding(r, "As", {
    readonly: true,
    label: "As acero (m\xB2)",
    format: h
  });
  z.addBinding(r, "Ac", {
    readonly: true,
    label: "Ac concreto (m\xB2)",
    format: h
  });
  z.addBinding(r, "Is", {
    readonly: true,
    label: "Is (m\u2074)",
    format: h
  });
  z.addBinding(r, "Ic", {
    readonly: true,
    label: "Ic (m\u2074)",
    format: h
  });
  const H = _.addFolder({
    title: "AISC 360-22 \xA7I2.1b"
  });
  H.addBinding(r, "EI_eff", {
    readonly: true,
    label: "EI_eff (kN\xB7m\xB2)",
    format: h
  });
  H.addBinding(r, "Pno_AISC", {
    readonly: true,
    label: "Pno (kN)",
    format: (a) => a.toFixed(0)
  });
  H.addBinding(r, "demandCap", {
    readonly: true,
    label: "Pu / \u03C6Pno",
    format: (a) => a.toFixed(3)
  });
  const G = _.addFolder({
    title: "Hekatan (medido)"
  });
  G.addBinding(r, "uz_axial_an", {
    readonly: true,
    label: "\u03B4 axial AISC (m)",
    format: h
  });
  G.addBinding(r, "uz_top_he", {
    readonly: true,
    label: "\u03B4 top medido (m)",
    format: h
  });
  G.addBinding(r, "errPct", {
    readonly: true,
    label: "\u0394 vs AISC (%)",
    format: (a) => a.toFixed(1)
  });
  const fe = _.addFolder({
    title: "Unidades color map",
    expanded: false
  }), he = {
    stress: oe.val,
    disp: ne.val,
    force: Be.val
  };
  fe.addBinding(he, "stress", {
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
    oe.val = a.value;
  });
  fe.addBinding(he, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm",
      \u00B5m: "\xB5m"
    },
    label: "Desplaz."
  }).on("change", (a) => {
    ne.val = a.value;
  });
  document.body.append(N);
  l.derive(() => {
    const a = ue.val;
    Object.assign(r, a), _.refresh();
  });
  document.body.append(Te(d), pe, je({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/columna-cft-h8/main.ts"
  }));
  setTimeout(() => Oe(), 200);
  setTimeout(() => {
    var _a;
    const a = pe.__ctx;
    (a == null ? void 0 : a.camera) && (a == null ? void 0 : a.controls) && (a.camera.up.set(0, 0, 1), a.camera.position.set(2, -2, 1.8), a.controls.target.set(0, 0, 1.5), a.controls.update(), (_a = a.render) == null ? void 0 : _a.call(a));
  }, 800);
});
