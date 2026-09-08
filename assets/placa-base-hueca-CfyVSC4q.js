import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n, a as ta, e as pe, C as ue, M as he, V as ea, B as aa, d as oa } from "./theme-U-6D_qyI.js";
import { P as sa } from "./tweakpane-BXg6ZhiP.js";
import { a as na } from "./analyze-DgLgRmKg.js";
import { d as la, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as ca, d as ve, e as be } from "./getViewer-DUS_a8CS.js";
import { e as ra } from "./makeDraggable-zx2br6Yh.js";
import { g as ia } from "./getParameters-CcvO4YbC.js";
import { g as da } from "./styles-SbI03m7S.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
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
  const kt = 2e8, St = 0.3, fe = kt / (2 * (1 + St)), xe = 78, ma = 25e4, pa = 6e5, i = {
    B: {
      value: n.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "B placa (m)"
    },
    H: {
      value: n.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "H placa (m)"
    },
    t_plate: {
      value: n.state(0.025),
      min: 0.012,
      max: 0.06,
      step: 2e-3,
      label: "t placa (m)"
    },
    bc: {
      value: n.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "bc col (m)"
    },
    hc: {
      value: n.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "hc col (m)"
    },
    t_col: {
      value: n.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared HSS (m)"
    },
    L_col: {
      value: n.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "L stub col (m)"
    },
    nBoltsX: {
      value: n.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en X"
    },
    nBoltsY: {
      value: n.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en Y"
    },
    sx: {
      value: n.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sx borde (m)"
    },
    sy: {
      value: n.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sy borde (m)"
    },
    d_bolt: {
      value: n.state(0.024),
      min: 0.012,
      max: 0.04,
      step: 2e-3,
      label: "\xD8 perno (m)"
    },
    L_bolt: {
      value: n.state(0.3),
      min: 0.15,
      max: 0.6,
      step: 0.02,
      label: "L embebido (m)"
    },
    L_proj: {
      value: n.state(0.05),
      min: 0.02,
      max: 0.1,
      step: 5e-3,
      label: "L proyec (m)"
    },
    B_ped: {
      value: n.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "B pedestal (m)"
    },
    H_ped: {
      value: n.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "H pedestal (m)"
    },
    h_ped: {
      value: n.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "h pedestal (m)"
    },
    fc: {
      value: n.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c (kN/m\xB2)"
    },
    Pu: {
      value: n.state(300),
      min: 0,
      max: 5e3,
      step: 25,
      label: "Pu axial (kN)"
    },
    Mx: {
      value: n.state(20),
      min: 0,
      max: 500,
      step: 5,
      label: "Mx (kN\xB7m)"
    },
    My: {
      value: n.state(30),
      min: 0,
      max: 500,
      step: 5,
      label: "My (kN\xB7m)"
    },
    nx: {
      value: n.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh nx"
    },
    ny: {
      value: n.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh ny"
    },
    nz_col: {
      value: n.state(6),
      min: 4,
      max: 12,
      step: 2,
      label: "nz col"
    }
  }, Me = n.state([]), _e = n.state([]), ye = n.state({}), ge = n.state({}), we = n.state({}), Be = n.state({}), Pe = n.state([]), Ne = n.state({
    vmMax: 0,
    A1: 0,
    A2: 0,
    phiPp: 0,
    demandCapPp: 0,
    m_cant: 0,
    t_req: 0,
    demandCapT: 0,
    T_anchor: 0,
    phiNn: 0,
    demandCapAnchor: 0
  });
  n.derive(() => {
    const o = i.B.value.val, p = i.H.value.val, L = i.t_plate.value.val, d = i.bc.value.val, m = i.hc.value.val, O = i.t_col.value.val, it = i.L_col.value.val, Et = Math.round(i.nBoltsX.value.val), dt = Math.round(i.nBoltsY.value.val), mt = i.sx.value.val, Lt = i.sy.value.val, y = i.d_bolt.value.val, D = i.L_bolt.value.val, J = i.L_proj.value.val, U = i.B_ped.value.val, V = i.H_ped.value.val, pt = i.h_ped.value.val, ut = i.fc.value.val, X = i.Pu.value.val, ht = i.Mx.value.val, ft = i.My.value.val, $ = Math.round(i.nx.value.val), R = Math.round(i.ny.value.val), g = Math.round(i.nz_col.value.val), u = 0.04, w = [], B = [], Z = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map();
    function C(t, e, a) {
      return w.push([
        t,
        e,
        a
      ]), w.length - 1;
    }
    function S(t, e, a, s, c) {
      B.push([
        t,
        e,
        a,
        s
      ]);
      const l = B.length - 1;
      Z.set(l, c), K.set(l, kt), Q.set(l, St), W.set(l, xe), tt.set(l, fe), et.set(l, 0), ot.set(l, 0), at.set(l, 0), st.set(l, 0);
    }
    function Ot(t, e, a, s, c) {
      B.push([
        t,
        e
      ]);
      const l = B.length - 1;
      K.set(l, kt), Q.set(l, St), W.set(l, xe), tt.set(l, fe), et.set(l, a), ot.set(l, s), at.set(l, s), st.set(l, c), Z.set(l, 0);
    }
    const qt = o / $, Ht = p / R, F = [];
    for (let t = 0; t <= R; t++) {
      const e = [];
      for (let a = 0; a <= $; a++) e.push(C(-o / 2 + a * qt, -p / 2 + t * Ht, u));
      F.push(e);
    }
    for (let t = 0; t < R; t++) for (let e = 0; e < $; e++) S(F[t][e], F[t][e + 1], F[t + 1][e + 1], F[t + 1][e], L);
    function j(t, e) {
      let a = -1, s = 1 / 0;
      for (let c = 0; c <= R; c++) for (let l = 0; l <= $; l++) {
        const _ = F[c][l], T = Math.hypot(w[_][0] - t, w[_][1] - e);
        T < s && (s = T, a = _);
      }
      return a;
    }
    const f = Math.max(2, Math.round(d / qt)), x = Math.max(2, Math.round(m / Ht)), nt = d / f, lt = m / x, q = it / g, P = [];
    for (let t = 0; t <= g; t++) {
      const e = [];
      for (let a = 0; a <= f; a++) {
        const s = -d / 2 + a * nt;
        t === 0 ? e.push(j(s, -m / 2)) : e.push(C(s, -m / 2, u + t * q));
      }
      P.push(e);
    }
    for (let t = 0; t < g; t++) for (let e = 0; e < f; e++) S(P[t][e], P[t][e + 1], P[t + 1][e + 1], P[t + 1][e], O);
    const N = [];
    for (let t = 0; t <= g; t++) {
      const e = [];
      for (let a = 0; a <= f; a++) {
        const s = -d / 2 + a * nt;
        t === 0 ? e.push(j(s, m / 2)) : e.push(C(s, m / 2, u + t * q));
      }
      N.push(e);
    }
    for (let t = 0; t < g; t++) for (let e = 0; e < f; e++) S(N[t][e], N[t][e + 1], N[t + 1][e + 1], N[t + 1][e], O);
    const z = [];
    for (let t = 0; t <= g; t++) {
      const e = [];
      for (let a = 0; a <= x; a++) {
        const s = -m / 2 + a * lt;
        t === 0 ? e.push(j(-d / 2, s)) : a === 0 ? e.push(P[t][0]) : a === x ? e.push(N[t][0]) : e.push(C(-d / 2, s, u + t * q));
      }
      z.push(e);
    }
    for (let t = 0; t < g; t++) for (let e = 0; e < x; e++) S(z[t][e], z[t][e + 1], z[t + 1][e + 1], z[t + 1][e], O);
    const k = [];
    for (let t = 0; t <= g; t++) {
      const e = [];
      for (let a = 0; a <= x; a++) {
        const s = -m / 2 + a * lt;
        t === 0 ? e.push(j(d / 2, s)) : a === 0 ? e.push(P[t][f]) : a === x ? e.push(N[t][f]) : e.push(C(d / 2, s, u + t * q));
      }
      k.push(e);
    }
    for (let t = 0; t < g; t++) for (let e = 0; e < x; e++) S(k[t][e], k[t][e + 1], k[t + 1][e + 1], k[t + 1][e], O);
    const ke = Math.min(0.2, it * 0.4), Gt = Math.min(0.1, (o - d) / 2 * 0.7), Se = Math.max(1, Math.round(ke / q));
    function A(t, e, a, s) {
      const [c, l] = t, [_, T] = e, At = a[0][s], zt = j(c + _ * Gt, l + T * Gt), me = a[Math.min(Se, a.length - 1)][s];
      S(At, zt, me, me, O);
    }
    const Yt = Math.max(1, Math.round(f * 0.25)), Dt = Math.max(1, Math.round(x * 0.25)), xt = Math.round(f / 2) - Yt, vt = Math.round(f / 2) + Yt, bt = Math.round(x / 2) - Dt, Mt = Math.round(x / 2) + Dt, Jt = -d / 2 + xt * nt, Ut = -d / 2 + vt * nt;
    A([
      Jt,
      m / 2
    ], [
      0,
      1
    ], N, xt), A([
      Ut,
      m / 2
    ], [
      0,
      1
    ], N, vt), A([
      Jt,
      -m / 2
    ], [
      0,
      -1
    ], P, xt), A([
      Ut,
      -m / 2
    ], [
      0,
      -1
    ], P, vt);
    const Vt = -m / 2 + bt * lt, Xt = -m / 2 + Mt * lt;
    A([
      d / 2,
      Vt
    ], [
      1,
      0
    ], k, bt), A([
      d / 2,
      Xt
    ], [
      1,
      0
    ], k, Mt), A([
      -d / 2,
      Vt
    ], [
      -1,
      0
    ], z, bt), A([
      -d / 2,
      Xt
    ], [
      -1,
      0
    ], z, Mt);
    const $t = Math.PI * y * y / 4, _t = Math.PI * y ** 4 / 64, Rt = 2 * _t, H = [], Fe = (o - 2 * mt) / Math.max(1, Et - 1), je = (p - 2 * Lt) / Math.max(1, dt - 1);
    for (let t = 0; t < Et; t++) for (let e = 0; e < dt; e++) {
      const a = -o / 2 + mt + t * Fe, s = -p / 2 + Lt + e * je;
      Math.abs(a) < d / 2 + 5e-3 && Math.abs(s) < m / 2 + 5e-3 || H.push([
        a,
        s
      ]);
    }
    const Ie = [
      ...H
    ], Zt = 4700 * Math.sqrt(ut / 1e3) * 1e3, Kt = 0.2, Te = Zt / (2 * (1 + Kt)), v = 10, b = 10, M = 6, yt = U / v, Qt = V / b, Ee = pt / M, r = [];
    for (let t = 0; t <= M; t++) {
      const e = [];
      for (let a = 0; a <= b; a++) {
        const s = [];
        for (let c = 0; c <= v; c++) s.push(C(-U / 2 + c * yt, -V / 2 + a * Qt, -pt + t * Ee));
        e.push(s);
      }
      r.push(e);
    }
    function I(t, e, a, s) {
      B.push([
        t,
        e,
        a,
        s
      ]);
      const c = B.length - 1;
      Z.set(c, 1e-3), K.set(c, Zt), Q.set(c, Kt), W.set(c, 24 / 9.80665), tt.set(c, Te), et.set(c, 0), ot.set(c, 0), at.set(c, 0), st.set(c, 0);
    }
    for (let t = 0; t < b; t++) for (let e = 0; e < v; e++) I(r[0][t][e], r[0][t][e + 1], r[0][t + 1][e + 1], r[0][t + 1][e]);
    function Le(t, e) {
      for (const [a, s] of H) if (Math.hypot(t - a, e - s) < yt * 0.6) return true;
      return false;
    }
    for (let t = 0; t < b; t++) for (let e = 0; e < v; e++) {
      const a = -U / 2 + (e + 0.5) * yt, s = -V / 2 + (t + 0.5) * Qt;
      Le(a, s) || I(r[M][t][e], r[M][t][e + 1], r[M][t + 1][e + 1], r[M][t + 1][e]);
    }
    for (let t = 0; t < M; t++) for (let e = 0; e < v; e++) I(r[t][0][e], r[t][0][e + 1], r[t + 1][0][e + 1], r[t + 1][0][e]);
    for (let t = 0; t < M; t++) for (let e = 0; e < v; e++) I(r[t][b][e], r[t][b][e + 1], r[t + 1][b][e + 1], r[t + 1][b][e]);
    for (let t = 0; t < M; t++) for (let e = 0; e < b; e++) I(r[t][e][0], r[t][e + 1][0], r[t + 1][e + 1][0], r[t + 1][e][0]);
    for (let t = 0; t < M; t++) for (let e = 0; e < b; e++) I(r[t][e][v], r[t][e + 1][v], r[t + 1][e + 1][v], r[t + 1][e][v]);
    for (const [t, e] of Ie) {
      const a = C(t, e, u + J), s = j(t, e), c = C(t, e, u - D);
      Ot(a, s, $t, _t, Rt), Ot(s, c, $t, _t, Rt);
    }
    const Wt = /* @__PURE__ */ new Map();
    w.forEach((t, e) => {
      const a = Math.abs(t[2] - (u - D)) < 1e-6 && H.some(([c, l]) => Math.abs(t[0] - c) < 1e-6 && Math.abs(t[1] - l) < 1e-6), s = Math.abs(t[2] - -pt) < 1e-6;
      (a || s) && Wt.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const gt = [];
    w.forEach((t, e) => {
      Math.abs(t[2] - (u + it)) < 1e-6 && Math.abs(t[0]) <= d / 2 + 1e-6 && Math.abs(t[1]) <= m / 2 + 1e-6 && gt.push(e);
    });
    const wt = Math.max(1, gt.length), Oe = -X / wt, qe = ht / wt, He = ft / wt, te = /* @__PURE__ */ new Map();
    for (const t of gt) te.set(t, [
      0,
      0,
      Oe,
      qe,
      He,
      0
    ]);
    const ee = {
      supports: Wt,
      loads: te
    }, Bt = {
      elasticities: K,
      shearModuli: tt,
      areas: et,
      momentsOfInertiaY: at,
      momentsOfInertiaZ: ot,
      torsionalConstants: st,
      densities: W,
      poissonsRatios: Q,
      thicknesses: Z
    };
    let Pt = {}, Nt = {};
    try {
      Pt = la(w, B, ee, Bt), Nt = na(w, B, Bt, Pt);
    } catch (t) {
      console.warn("placa-base-hueca:", (t == null ? void 0 : t.message) ?? t);
    }
    const ct = [], Ge = new ta({
      color: 16755200
    });
    function G(t, e) {
      const s = [];
      for (let _ = 0; _ <= 5 * 2; _++) {
        const T = _ / 10, At = u * (1 - T), zt = _ % 2 === 0 ? 0 : 8e-3;
        s.push(new ea(t + zt, e, At));
      }
      const c = new aa().setFromPoints(s), l = new oa(c, Ge);
      ct.push(l);
    }
    G(o / 2 - 0.04, p / 2 - 0.04), G(-o / 2 + 0.04, p / 2 - 0.04), G(o / 2 - 0.04, -p / 2 + 0.04), G(-o / 2 + 0.04, -p / 2 + 0.04), G(0, 0);
    const Ye = new pe({
      color: 6710886,
      metalness: 0.5
    }), De = new pe({
      color: 4473924,
      metalness: 0.7,
      roughness: 0.3
    }), ae = y * 0.8, oe = y * 0.85, Je = u + J + ae / 2;
    for (const [t, e] of H) {
      const a = new ue(y / 2, y / 2, D + J, 12), s = new he(a, Ye);
      s.position.set(t, e, u + (-D + J) / 2), s.rotation.x = Math.PI / 2, ct.push(s);
      const c = new ue(oe, oe, ae, 6), l = new he(c, De);
      l.position.set(t, e, Je), l.rotation.x = Math.PI / 2, ct.push(l);
    }
    let Ct = 0;
    const se = Nt == null ? void 0 : Nt.vonMises;
    se && se.forEach((t) => t.forEach((e) => {
      e > Ct && (Ct = e);
    }));
    const Ue = 0.65, Y = o * p, ne = U * V, Ve = Math.min(2, Math.sqrt(ne / Y)), Xe = Math.min(0.85 * ut * Y * Ve, 1.7 * ut * Y), le = Ue * Xe, $e = X / Math.max(1, le), ce = Math.max(0, (o - 0.95 * Math.max(d, m)) / 2), Re = X / Y, re = ce * Math.sqrt(2 * Math.max(0, Re) / (0.9 * ma)), Ze = re / Math.max(1e-6, L), Ke = Math.max(0.05, o - 2 * mt), Qe = Math.sqrt(ht * ht + ft * ft), ie = Math.max(0, Qe / Ke - X / 2) / Math.max(1, dt), de = 0.75 * (0.75 * Math.PI * y * y / 4) * pa, We = ie / Math.max(1, de);
    Ne.val = {
      vmMax: Ct,
      A1: Y,
      A2: ne,
      phiPp: le,
      demandCapPp: $e,
      m_cant: ce,
      t_req: re,
      demandCapT: Ze,
      T_anchor: ie,
      phiNn: de,
      demandCapAnchor: We
    }, Me.val = w, _e.val = B, ye.val = ee, ge.val = Bt, we.val = Pt, Be.val = Nt, Pe.val = ct;
  });
  const Ce = ca({
    mesh: {
      nodes: Me,
      elements: _e,
      nodeInputs: ye,
      elementInputs: ge,
      deformOutputs: we,
      analyzeOutputs: Be
    },
    objects3D: Pe,
    settingsObj: {
      deformedShape: false,
      shellResults: "vonMises",
      gridSize: 1,
      deformScale: 1,
      custom3D: true,
      loads: true,
      supports: false,
      showCotas: false,
      displayScale: 0.15
    }
  }), Ft = document.createElement("div");
  Ft.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const E = new sa({
    title: "\u{1F9EA} Placa base + col HSS hueca",
    container: Ft,
    expanded: true
  }), h = {
    vmMax: 0,
    A1: 0,
    A2: 0,
    phiPp: 0,
    demandCapPp: 0,
    m_cant: 0,
    t_req: 0,
    demandCapT: 0,
    T_anchor: 0,
    phiNn: 0,
    demandCapAnchor: 0
  }, jt = (o) => o < 1 ? `${o.toFixed(2)} \u2713` : o < 1.2 ? `${o.toFixed(2)} \u26A0` : `${o.toFixed(2)} \u2717`, rt = E.addFolder({
    title: "AISC \xA7J8 bearing concreto"
  });
  rt.addBinding(h, "A1", {
    readonly: true,
    label: "A1 (m\xB2)",
    format: (o) => o.toFixed(4)
  });
  rt.addBinding(h, "A2", {
    readonly: true,
    label: "A2 (m\xB2)",
    format: (o) => o.toFixed(4)
  });
  rt.addBinding(h, "phiPp", {
    readonly: true,
    label: "\u03C6Pp (kN)",
    format: (o) => o.toFixed(0)
  });
  rt.addBinding(h, "demandCapPp", {
    readonly: true,
    label: "Pu/\u03C6Pp",
    format: jt
  });
  const It = E.addFolder({
    title: "DG-1 espesor placa"
  });
  It.addBinding(h, "m_cant", {
    readonly: true,
    label: "m cant (m)",
    format: (o) => o.toFixed(4)
  });
  It.addBinding(h, "t_req", {
    readonly: true,
    label: "t_req (mm)",
    format: (o) => (o * 1e3).toFixed(1)
  });
  It.addBinding(h, "demandCapT", {
    readonly: true,
    label: "t_req/t_act",
    format: jt
  });
  const Tt = E.addFolder({
    title: "ACI \xA717 anclaje"
  });
  Tt.addBinding(h, "T_anchor", {
    readonly: true,
    label: "T (kN/perno)",
    format: (o) => o.toFixed(1)
  });
  Tt.addBinding(h, "phiNn", {
    readonly: true,
    label: "\u03C6Nn (kN)",
    format: (o) => o.toFixed(1)
  });
  Tt.addBinding(h, "demandCapAnchor", {
    readonly: true,
    label: "T/\u03C6Nn",
    format: jt
  });
  const ua = E.addFolder({
    title: "FEM"
  });
  ua.addBinding(h, "vmMax", {
    readonly: true,
    label: "\u03C3 vM max (kN/m\xB2)",
    format: (o) => o.toExponential(3)
  });
  const Ae = E.addFolder({
    title: "Unidades",
    expanded: false
  }), ze = {
    stress: be.val,
    disp: ve.val
  };
  Ae.addBinding(ze, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (o) => {
    be.val = o.value;
  });
  Ae.addBinding(ze, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (o) => {
    ve.val = o.value;
  });
  document.body.append(Ft);
  n.derive(() => {
    const o = Ne.val;
    Object.assign(h, o), E.refresh();
  });
  document.body.append(ia(i), Ce, da({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-hueca/main.ts"
  }));
  setTimeout(() => ra(), 200);
  setTimeout(() => {
    var _a;
    const o = Ce.__ctx;
    (o == null ? void 0 : o.camera) && (o == null ? void 0 : o.controls) && (o.camera.up.set(0, 0, 1), o.camera.position.set(1.5, -1.5, 2), o.controls.target.set(0, 0, 0.4), o.controls.update(), (_a = o.render) == null ? void 0 : _a.call(o));
    const p = window.__hekatanClip, L = window.__hekatanClipApply;
    p && L && (p.enableY = true, p.posY = 0, p.invertY = false, L());
  }, 800);
});
