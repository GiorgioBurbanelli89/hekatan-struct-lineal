import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as i } from "./theme-Dxpmbnyd.js";
import { P as $t } from "./tweakpane-BXg6ZhiP.js";
import { a as Ut } from "./analyze-DgLgRmKg.js";
import { d as Gt, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Yt, d as _t, e as yt } from "./getViewer-CYaSHj--.js";
import { e as Zt } from "./makeDraggable-zx2br6Yh.js";
import { g as Rt } from "./getParameters-Bf35D0lJ.js";
import { g as Jt } from "./styles-DjzQZscE.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
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
  const Mt = 2e8, wt = 0.3, Kt = Mt / (2 * (1 + wt)), Vt = 78, v = {
    bc: {
      value: i.state(0.4),
      min: 0.25,
      max: 0.8,
      step: 0.05,
      label: "bc col (m)"
    },
    hc: {
      value: i.state(0.4),
      min: 0.25,
      max: 0.8,
      step: 0.05,
      label: "hc col (m)"
    },
    Lz: {
      value: i.state(3),
      min: 1.5,
      max: 5,
      step: 0.5,
      label: "Lz col (m)"
    },
    t_col: {
      value: i.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared col (m)"
    },
    d_v: {
      value: i.state(0.4),
      min: 0.2,
      max: 0.7,
      step: 0.02,
      label: "d viga (m)"
    },
    bf_v: {
      value: i.state(0.2),
      min: 0.1,
      max: 0.4,
      step: 0.02,
      label: "bf viga (m)"
    },
    tf_v: {
      value: i.state(0.018),
      min: 8e-3,
      max: 0.04,
      step: 2e-3,
      label: "tf pat\xEDn (m)"
    },
    tw_v: {
      value: i.state(0.012),
      min: 6e-3,
      max: 0.025,
      step: 2e-3,
      label: "tw alma (m)"
    },
    L_v: {
      value: i.state(2),
      min: 0.8,
      max: 4,
      step: 0.2,
      label: "L viga (m, voladizo)"
    },
    bd: {
      value: i.state(0.1),
      min: 0.04,
      max: 0.2,
      step: 0.02,
      label: "bd diafragma (m, ancho radial)"
    },
    td: {
      value: i.state(0.02),
      min: 0.01,
      max: 0.04,
      step: 2e-3,
      label: "td diafragma (m)"
    },
    nx: {
      value: i.state(4),
      min: 2,
      max: 8,
      step: 2,
      label: "nx col"
    },
    nz: {
      value: i.state(8),
      min: 4,
      max: 14,
      step: 2,
      label: "nz col"
    },
    nv_x: {
      value: i.state(8),
      min: 4,
      max: 14,
      step: 2,
      label: "nx viga"
    },
    nv_z: {
      value: i.state(4),
      min: 2,
      max: 8,
      step: 2,
      label: "nz alma viga"
    },
    P: {
      value: i.state(50),
      min: 0,
      max: 300,
      step: 10,
      label: "P punta viga (kN, -Z)"
    }
  }, kt = i.state([]), Ct = i.state([]), St = i.state({}), It = i.state({}), Ot = i.state({}), zt = i.state({}), Et = i.state({
    M_joint: 0,
    A_d: 0,
    sigma_d_an: 0,
    vmMax: 0,
    ratio: 0
  });
  i.derive(() => {
    const l = v.bc.value.val, d = v.hc.value.val, N = v.Lz.value.val, E = v.t_col.value.val, P = v.d_v.value.val, T = v.bf_v.value.val, Lt = v.tf_v.value.val, Bt = v.tw_v.value.val, H = v.L_v.value.val, M = v.bd.value.val, S = v.td.value.val, u = Math.round(v.nx.value.val), V = Math.round(v.nz.value.val), I = Math.round(v.nv_x.value.val), F = Math.round(v.nv_z.value.val), W = v.P.value.val, $ = N / 2, O = $ + P / 2, w = $ - P / 2, g = [], X = /* @__PURE__ */ new Map(), k = [], q = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map(), U = 5;
    function m(t, e, b) {
      const s = `${t.toFixed(U)},${e.toFixed(U)},${b.toFixed(U)}`;
      let a = X.get(s);
      return a === void 0 && (g.push([
        t,
        e,
        b
      ]), a = g.length - 1, X.set(s, a)), a;
    }
    function _(t, e, b, s, a) {
      k.push([
        t,
        e,
        b,
        s
      ]);
      const o = k.length - 1;
      at.set(o, a), q.set(o, Mt), Q.set(o, wt), tt.set(o, Vt), et.set(o, Kt), nt.set(o, 0), st.set(o, 0), ot.set(o, 0), lt.set(o, 0);
    }
    const z = [], it = /* @__PURE__ */ new Set(), j = (t) => {
      const e = t.toFixed(5);
      it.has(e) || (it.add(e), z.push(t));
    };
    for (let t = 0; t <= V; t++) j(t * N / V);
    j(w), j($), j(O), z.sort((t, e) => t - e);
    const ct = l / u, rt = d / u, A = (t, e, b, s, a, o) => {
      const f = [];
      for (let n = 0; n < z.length; n++) {
        const c = [];
        for (let p = 0; p <= a; p++) {
          const r = -(a * s / 2) + p * s, x = t === "x" ? e : r, h = t === "y" ? e : r;
          c.push(m(x, h, z[n]));
        }
        f.push(c);
      }
      for (let n = 0; n < z.length - 1; n++) for (let c = 0; c < a; c++) _(f[n][c], f[n][c + 1], f[n + 1][c + 1], f[n + 1][c], o);
      return f;
    };
    A("y", -d / 2, "x", ct, u, E), A("y", d / 2, "x", ct, u, E), A("x", -l / 2, "y", rt, u, E), A("x", l / 2, "y", rt, u, E);
    function mt(t) {
      const e = l / 2 + M, b = d / 2 + M, s = 2, a = d / 2, o = b;
      for (let n = 0; n < s; n++) {
        const c = a + n / s * (o - a), p = a + (n + 1) / s * (o - a);
        for (let r = 0; r < u + 2; r++) {
          const x = -e + r / (u + 2) * (2 * e), h = -e + (r + 1) / (u + 2) * (2 * e);
          _(m(x, c, t), m(h, c, t), m(h, p, t), m(x, p, t), S);
        }
      }
      for (let n = 0; n < s; n++) {
        const c = -a - n / s * (o - a), p = -a - (n + 1) / s * (o - a);
        for (let r = 0; r < u + 2; r++) {
          const x = -e + r / (u + 2) * (2 * e), h = -e + (r + 1) / (u + 2) * (2 * e);
          _(m(x, c, t), m(h, c, t), m(h, p, t), m(x, p, t), S);
        }
      }
      const f = l / 2;
      for (let n = 0; n < s; n++) {
        const c = f + n / s * M, p = f + (n + 1) / s * M;
        for (let r = 0; r < u; r++) {
          const x = -d / 2 + r / u * d, h = -d / 2 + (r + 1) / u * d;
          _(m(c, x, t), m(p, x, t), m(p, h, t), m(c, h, t), S);
        }
      }
      for (let n = 0; n < s; n++) {
        const c = -f - n / s * M, p = -f - (n + 1) / s * M;
        for (let r = 0; r < u; r++) {
          const x = -d / 2 + r / u * d, h = -d / 2 + (r + 1) / u * d;
          _(m(c, x, t), m(p, x, t), m(p, h, t), m(c, h, t), S);
        }
      }
    }
    mt(w), mt(O);
    const dt = H / I, Dt = P / F, y = [];
    for (let t = 0; t <= F; t++) {
      const e = [], b = w + t * Dt;
      for (let s = 0; s <= I; s++) {
        const a = d / 2 + s * dt;
        e.push(m(0, a, b));
      }
      y.push(e);
    }
    for (let t = 0; t < F; t++) for (let e = 0; e < I; e++) _(y[t][e], y[t][e + 1], y[t + 1][e + 1], y[t + 1][e], Bt);
    const ut = (t) => {
      const b = T / 4, s = [];
      for (let a = 0; a <= I; a++) {
        const o = [], f = d / 2 + a * dt;
        for (let n = 0; n <= 4; n++) {
          const c = -T / 2 + n * b;
          Math.abs(c) < 1e-7 ? Math.abs(t - O) < 1e-6 ? o.push(y[F][a]) : Math.abs(t - w) < 1e-6 ? o.push(y[0][a]) : o.push(m(0, f, t)) : o.push(m(c, f, t));
        }
        s.push(o);
      }
      for (let a = 0; a < I; a++) for (let o = 0; o < 4; o++) _(s[a][o], s[a][o + 1], s[a + 1][o + 1], s[a + 1][o], Lt);
    };
    ut(O), ut(w);
    const vt = /* @__PURE__ */ new Map();
    g.forEach((t, e) => {
      Math.abs(t[0]) <= l / 2 + 1e-6 && Math.abs(t[1]) <= d / 2 + 1e-6 && (Math.abs(t[2]) < 1e-6 || Math.abs(t[2] - N) < 1e-6) && vt.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const G = [];
    g.forEach((t, e) => {
      Math.abs(t[1] - (d / 2 + H)) < 1e-6 && Math.abs(t[0]) <= T / 2 + 1e-6 && t[2] >= w - 1e-6 && t[2] <= O + 1e-6 && G.push(e);
    });
    const Nt = -W / Math.max(1, G.length), pt = /* @__PURE__ */ new Map();
    for (const t of G) pt.set(t, [
      0,
      0,
      Nt,
      0,
      0,
      0
    ]);
    const ft = {
      supports: vt,
      loads: pt
    }, Y = {
      elasticities: q,
      poissonsRatios: Q,
      densities: tt,
      shearModuli: et,
      thicknesses: at,
      areas: nt,
      momentsOfInertiaZ: ot,
      momentsOfInertiaY: st,
      torsionalConstants: lt
    };
    let Z = {}, R = {};
    try {
      Z = Gt(g, k, ft, Y), R = Ut(g, k, Y, Z), console.log(`Conexi\xF3n diafragma: ${g.length} nodos, ${k.length} shells`);
    } catch (t) {
      console.warn("Conexi\xF3n diafragma:", (t == null ? void 0 : t.message) ?? t);
    }
    const xt = W * H, Tt = xt / P, ht = 2 * (l + d) * S, bt = Tt / ht;
    let L = 0;
    const gt = R == null ? void 0 : R.vonMises;
    gt && gt.forEach((t) => t.forEach((e) => {
      e > L && (L = e);
    }));
    const Ht = L / Math.max(1, bt);
    Et.val = {
      M_joint: xt,
      A_d: ht,
      sigma_d_an: bt,
      vmMax: L,
      ratio: Ht
    }, kt.val = g, Ct.val = k, St.val = ft, It.val = Y, Ot.val = Z, zt.val = R;
  });
  const Pt = Yt({
    mesh: {
      nodes: kt,
      elements: Ct,
      nodeInputs: St,
      elementInputs: It,
      deformOutputs: Ot,
      analyzeOutputs: zt
    },
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 4,
      deformScale: 100,
      loads: true,
      supports: true,
      displayScale: 0.4
    }
  }), J = document.createElement("div");
  J.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const B = new $t({
    title: "\u{1F9EA} Conexi\xF3n diafragma (CIDECT)",
    container: J,
    expanded: true
  }), C = {
    M_joint: 0,
    A_d: 0,
    sigma_d_an: 0,
    vmMax: 0,
    ratio: 0
  }, D = (l) => l.toExponential(3), K = B.addFolder({
    title: "Demanda (CIDECT/Cervantes)"
  });
  K.addBinding(C, "M_joint", {
    readonly: true,
    label: "M en junta (kN\xB7m)",
    format: D
  });
  K.addBinding(C, "A_d", {
    readonly: true,
    label: "A diafragma (m\xB2)",
    format: D
  });
  K.addBinding(C, "sigma_d_an", {
    readonly: true,
    label: "\u03C3 anal\xEDtico (kN/m\xB2)",
    format: D
  });
  const Ft = B.addFolder({
    title: "Hekatan (medido)"
  });
  Ft.addBinding(C, "vmMax", {
    readonly: true,
    label: "\u03C3 vM max (kN/m\xB2)",
    format: D
  });
  Ft.addBinding(C, "ratio", {
    readonly: true,
    label: "ratio Hek/Anal",
    format: (l) => l.toFixed(2)
  });
  const jt = B.addFolder({
    title: "Unidades",
    expanded: false
  }), At = {
    stress: yt.val,
    disp: _t.val
  };
  jt.addBinding(At, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (l) => {
    yt.val = l.value;
  });
  jt.addBinding(At, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (l) => {
    _t.val = l.value;
  });
  document.body.append(J);
  i.derive(() => {
    const l = Et.val;
    Object.assign(C, l), B.refresh();
  });
  document.body.append(Rt(v), Pt, Jt({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/conexion-diafragma-cft/main.ts"
  }));
  setTimeout(() => Zt(), 200);
  setTimeout(() => {
    var _a;
    const l = Pt.__ctx;
    (l == null ? void 0 : l.camera) && (l == null ? void 0 : l.controls) && (l.camera.up.set(0, 0, 1), l.camera.position.set(2.5, 3.5, 2.5), l.controls.target.set(0, 1, 1.5), l.controls.update(), (_a = l.render) == null ? void 0 : _a.call(l));
  }, 800);
});
