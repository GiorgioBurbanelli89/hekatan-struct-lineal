import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s, b as sn, e as ve, C as Me, M as be, V as Et, B as ln, d as cn } from "./Text-C1TX4d8g.js";
import { P as rn } from "./tweakpane-BXg6ZhiP.js";
import { a as dn, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { d as mn, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { n as pn, g as un, l as ge, m as we, c as hn, __tla as __tla_2 } from "./aiAgent-CDkRN2K5.js";
import { e as fn } from "./makeDraggable-zx2br6Yh.js";
import { g as xn, __tla as __tla_3 } from "./getParameters-C2E0DZJg.js";
import { e as vn } from "./materials-VwssM8Vw.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  const Ht = 2e8, Tt = 0.3, _e = Ht / (2 * (1 + Tt)), ye = 78, Mn = 25e4, bn = 6e5, p = {
    B: {
      value: s.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "B placa (m)"
    },
    H: {
      value: s.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "H placa (m)"
    },
    t_plate: {
      value: s.state(0.025),
      min: 0.012,
      max: 0.06,
      step: 2e-3,
      label: "t placa (m)"
    },
    bc: {
      value: s.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "bc col (m)"
    },
    hc: {
      value: s.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "hc col (m)"
    },
    t_col: {
      value: s.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared HSS (m)"
    },
    L_col: {
      value: s.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "L stub col (m)"
    },
    nBoltsX: {
      value: s.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en X"
    },
    nBoltsY: {
      value: s.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en Y"
    },
    sx: {
      value: s.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sx borde (m)"
    },
    sy: {
      value: s.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sy borde (m)"
    },
    d_bolt: {
      value: s.state(0.024),
      min: 0.012,
      max: 0.04,
      step: 2e-3,
      label: "\xD8 perno (m)"
    },
    L_bolt: {
      value: s.state(0.3),
      min: 0.15,
      max: 0.6,
      step: 0.02,
      label: "L embebido (m)"
    },
    L_proj: {
      value: s.state(0.05),
      min: 0.02,
      max: 0.1,
      step: 5e-3,
      label: "L proyec (m)"
    },
    B_ped: {
      value: s.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "B pedestal (m)"
    },
    H_ped: {
      value: s.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "H pedestal (m)"
    },
    h_ped: {
      value: s.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "h pedestal (m)"
    },
    fc: {
      value: s.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c (kN/m\xB2)"
    },
    Pu: {
      value: s.state(300),
      min: 0,
      max: 5e3,
      step: 25,
      label: "Pu axial (kN)"
    },
    Mx: {
      value: s.state(20),
      min: 0,
      max: 500,
      step: 5,
      label: "Mx (kN\xB7m)"
    },
    My: {
      value: s.state(30),
      min: 0,
      max: 500,
      step: 5,
      label: "My (kN\xB7m)"
    },
    nx: {
      value: s.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh nx"
    },
    ny: {
      value: s.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh ny"
    },
    nz_col: {
      value: s.state(6),
      min: 4,
      max: 12,
      step: 2,
      label: "nz col"
    }
  }, Ft = s.state([]), Be = s.state([]), Pe = s.state({}), Ce = s.state({}), Se = s.state({}), ze = s.state({}), Ie = s.state([]), Ne = s.state({
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
  s.derive(() => {
    const n = p.B.value.val, l = p.H.value.val, f = p.t_plate.value.val, d = p.bc.value.val, i = p.hc.value.val, u = p.t_col.value.val, x = p.L_col.value.val, W = Math.round(p.nBoltsX.value.val), S = Math.round(p.nBoltsY.value.val), $ = p.sx.value.val, K = p.sy.value.val, b = p.d_bolt.value.val, _ = p.L_bolt.value.val, h = p.L_proj.value.val, j = p.B_ped.value.val, Q = p.H_ped.value.val, vt = p.h_ped.value.val, Mt = p.fc.value.val, tt = p.Pu.value.val, bt = p.Mx.value.val, _t = p.My.value.val, et = Math.round(p.nx.value.val), nt = Math.round(p.ny.value.val), z = Math.round(p.nz_col.value.val), v = 0.04, I = [], N = [], at = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map(), ct = /* @__PURE__ */ new Map(), it = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), Dt = /* @__PURE__ */ new Set();
    function E(t, e, a) {
      return I.push([
        t,
        e,
        a
      ]), I.length - 1;
    }
    function O(t, e, a, o, r) {
      N.push([
        t,
        e,
        a,
        o
      ]);
      const c = N.length - 1;
      at.set(c, r), ot.set(c, Ht), st.set(c, Tt), lt.set(c, ye), ct.set(c, _e), it.set(c, 0), dt.set(c, 0), rt.set(c, 0), mt.set(c, 0);
    }
    function Gt(t, e, a, o, r) {
      N.push([
        t,
        e
      ]);
      const c = N.length - 1;
      ot.set(c, Ht), st.set(c, Tt), lt.set(c, ye), ct.set(c, _e), it.set(c, a), dt.set(c, o), rt.set(c, o), mt.set(c, r), at.set(c, 0);
    }
    const Rt = n / et, Vt = l / nt, q = [];
    for (let t = 0; t <= nt; t++) {
      const e = [];
      for (let a = 0; a <= et; a++) e.push(E(-n / 2 + a * Rt, -l / 2 + t * Vt, v));
      q.push(e);
    }
    for (let t = 0; t < nt; t++) for (let e = 0; e < et; e++) O(q[t][e], q[t][e + 1], q[t + 1][e + 1], q[t + 1][e], f);
    function Y(t, e) {
      let a = -1, o = 1 / 0;
      for (let r = 0; r <= nt; r++) for (let c = 0; c <= et; c++) {
        const C = q[r][c], G = Math.hypot(I[C][0] - t, I[C][1] - e);
        G < o && (o = G, a = C);
      }
      return a;
    }
    const y = Math.max(2, Math.round(d / Rt)), g = Math.max(2, Math.round(i / Vt)), pt = d / y, ut = i / g, J = x / z, A = [];
    for (let t = 0; t <= z; t++) {
      const e = [];
      for (let a = 0; a <= y; a++) {
        const o = -d / 2 + a * pt;
        t === 0 ? e.push(Y(o, -i / 2)) : e.push(E(o, -i / 2, v + t * J));
      }
      A.push(e);
    }
    for (let t = 0; t < z; t++) for (let e = 0; e < y; e++) O(A[t][e], A[t][e + 1], A[t + 1][e + 1], A[t + 1][e], u);
    const k = [];
    for (let t = 0; t <= z; t++) {
      const e = [];
      for (let a = 0; a <= y; a++) {
        const o = -d / 2 + a * pt;
        t === 0 ? e.push(Y(o, i / 2)) : e.push(E(o, i / 2, v + t * J));
      }
      k.push(e);
    }
    for (let t = 0; t < z; t++) for (let e = 0; e < y; e++) O(k[t][e], k[t][e + 1], k[t + 1][e + 1], k[t + 1][e], u);
    const F = [];
    for (let t = 0; t <= z; t++) {
      const e = [];
      for (let a = 0; a <= g; a++) {
        const o = -i / 2 + a * ut;
        t === 0 ? e.push(Y(-d / 2, o)) : a === 0 ? e.push(A[t][0]) : a === g ? e.push(k[t][0]) : e.push(E(-d / 2, o, v + t * J));
      }
      F.push(e);
    }
    for (let t = 0; t < z; t++) for (let e = 0; e < g; e++) O(F[t][e], F[t][e + 1], F[t + 1][e + 1], F[t + 1][e], u);
    const L = [];
    for (let t = 0; t <= z; t++) {
      const e = [];
      for (let a = 0; a <= g; a++) {
        const o = -i / 2 + a * ut;
        t === 0 ? e.push(Y(d / 2, o)) : a === 0 ? e.push(A[t][y]) : a === g ? e.push(k[t][y]) : e.push(E(d / 2, o, v + t * J));
      }
      L.push(e);
    }
    for (let t = 0; t < z; t++) for (let e = 0; e < g; e++) O(L[t][e], L[t][e + 1], L[t + 1][e + 1], L[t + 1][e], u);
    const He = Math.min(0.2, x * 0.4), Wt = Math.min(0.1, (n - d) / 2 * 0.7), Te = Math.max(1, Math.round(He / J));
    function H(t, e, a, o) {
      const [r, c] = t, [C, G] = e, kt = a[0][o], jt = Y(r + C * Wt, c + G * Wt), xe = a[Math.min(Te, a.length - 1)][o];
      O(kt, jt, xe, xe, u);
    }
    const $t = Math.max(1, Math.round(y * 0.25)), Jt = Math.max(1, Math.round(g * 0.25)), yt = Math.round(y / 2) - $t, gt = Math.round(y / 2) + $t, wt = Math.round(g / 2) - Jt, Bt = Math.round(g / 2) + Jt, Ut = -d / 2 + yt * pt, Xt = -d / 2 + gt * pt;
    H([
      Ut,
      i / 2
    ], [
      0,
      1
    ], k, yt), H([
      Xt,
      i / 2
    ], [
      0,
      1
    ], k, gt), H([
      Ut,
      -i / 2
    ], [
      0,
      -1
    ], A, yt), H([
      Xt,
      -i / 2
    ], [
      0,
      -1
    ], A, gt);
    const Zt = -i / 2 + wt * ut, Kt = -i / 2 + Bt * ut;
    H([
      d / 2,
      Zt
    ], [
      1,
      0
    ], L, wt), H([
      d / 2,
      Kt
    ], [
      1,
      0
    ], L, Bt), H([
      -d / 2,
      Zt
    ], [
      -1,
      0
    ], F, wt), H([
      -d / 2,
      Kt
    ], [
      -1,
      0
    ], F, Bt);
    const Qt = Math.PI * b * b / 4, Pt = Math.PI * b ** 4 / 64, te = 2 * Pt, U = [], Fe = (n - 2 * $) / Math.max(1, W - 1), Le = (l - 2 * K) / Math.max(1, S - 1);
    for (let t = 0; t < W; t++) for (let e = 0; e < S; e++) {
      const a = -n / 2 + $ + t * Fe, o = -l / 2 + K + e * Le;
      Math.abs(a) < d / 2 + 5e-3 && Math.abs(o) < i / 2 + 5e-3 || U.push([
        a,
        o
      ]);
    }
    const Oe = [
      ...U
    ], ee = vn(Mt / 1e3), ne = 0.2, qe = ee / (2 * (1 + ne)), w = 10, B = 10, P = 6, Ct = j / w, ae = Q / B, Ye = vt / P, m = [];
    for (let t = 0; t <= P; t++) {
      const e = [];
      for (let a = 0; a <= B; a++) {
        const o = [];
        for (let r = 0; r <= w; r++) o.push(E(-j / 2 + r * Ct, -Q / 2 + a * ae, -vt + t * Ye));
        e.push(o);
      }
      m.push(e);
    }
    function D(t, e, a, o) {
      N.push([
        t,
        e,
        a,
        o
      ]);
      const r = N.length - 1;
      Dt.add(r), at.set(r, 1e-3), ot.set(r, ee), st.set(r, ne), lt.set(r, 24 / 9.80665), ct.set(r, qe), it.set(r, 0), dt.set(r, 0), rt.set(r, 0), mt.set(r, 0);
    }
    for (let t = 0; t < B; t++) for (let e = 0; e < w; e++) D(m[0][t][e], m[0][t][e + 1], m[0][t + 1][e + 1], m[0][t + 1][e]);
    function De(t, e) {
      for (const [a, o] of U) if (Math.hypot(t - a, e - o) < Ct * 0.6) return true;
      return false;
    }
    for (let t = 0; t < B; t++) for (let e = 0; e < w; e++) {
      const a = -j / 2 + (e + 0.5) * Ct, o = -Q / 2 + (t + 0.5) * ae;
      De(a, o) || D(m[P][t][e], m[P][t][e + 1], m[P][t + 1][e + 1], m[P][t + 1][e]);
    }
    for (let t = 0; t < P; t++) for (let e = 0; e < w; e++) D(m[t][0][e], m[t][0][e + 1], m[t + 1][0][e + 1], m[t + 1][0][e]);
    for (let t = 0; t < P; t++) for (let e = 0; e < w; e++) D(m[t][B][e], m[t][B][e + 1], m[t + 1][B][e + 1], m[t + 1][B][e]);
    for (let t = 0; t < P; t++) for (let e = 0; e < B; e++) D(m[t][e][0], m[t][e + 1][0], m[t + 1][e + 1][0], m[t + 1][e][0]);
    for (let t = 0; t < P; t++) for (let e = 0; e < B; e++) D(m[t][e][w], m[t][e + 1][w], m[t + 1][e + 1][w], m[t + 1][e][w]);
    for (const [t, e] of Oe) {
      const a = E(t, e, v + h), o = Y(t, e), r = E(t, e, v - _);
      Gt(a, o, Qt, Pt, te), Gt(o, r, Qt, Pt, te);
    }
    const oe = /* @__PURE__ */ new Map();
    I.forEach((t, e) => {
      const a = Math.abs(t[2] - (v - _)) < 1e-6 && U.some(([r, c]) => Math.abs(t[0] - r) < 1e-6 && Math.abs(t[1] - c) < 1e-6), o = Math.abs(t[2] - -vt) < 1e-6;
      (a || o) && oe.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const St = [];
    I.forEach((t, e) => {
      Math.abs(t[2] - (v + x)) < 1e-6 && Math.abs(t[0]) <= d / 2 + 1e-6 && Math.abs(t[1]) <= i / 2 + 1e-6 && St.push(e);
    });
    const zt = Math.max(1, St.length), Ge = -tt / zt, Re = bt / zt, Ve = _t / zt, se = /* @__PURE__ */ new Map();
    for (const t of St) se.set(t, [
      0,
      0,
      Ge,
      Re,
      Ve,
      0
    ]);
    const le = {
      supports: oe,
      loads: se
    }, It = {
      elasticities: ot,
      shearModuli: ct,
      areas: it,
      momentsOfInertiaY: rt,
      momentsOfInertiaZ: dt,
      torsionalConstants: mt,
      densities: lt,
      poissonsRatios: st,
      thicknesses: at
    };
    let Nt = {}, ht = {};
    try {
      Nt = mn(I, N, le, It), ht = dn(I, N, It, Nt);
      for (const t of Object.values(ht)) if (t instanceof Map) for (const e of Dt) t.delete(e);
    } catch (t) {
      console.warn("placa-base-hueca:", (t == null ? void 0 : t.message) ?? t);
    }
    const ft = [], We = new sn({
      color: 16755200
    });
    function X(t, e) {
      const o = [];
      for (let C = 0; C <= 5 * 2; C++) {
        const G = C / 10, kt = v * (1 - G), jt = C % 2 === 0 ? 0 : 8e-3;
        o.push(new Et(t + jt, e, kt));
      }
      const r = new ln().setFromPoints(o), c = new cn(r, We);
      ft.push(c);
    }
    X(n / 2 - 0.04, l / 2 - 0.04), X(-n / 2 + 0.04, l / 2 - 0.04), X(n / 2 - 0.04, -l / 2 + 0.04), X(-n / 2 + 0.04, -l / 2 + 0.04), X(0, 0);
    const $e = new ve({
      color: 6710886,
      metalness: 0.5
    }), Je = new ve({
      color: 4473924,
      metalness: 0.7,
      roughness: 0.3
    }), ce = b * 0.8, ie = b * 0.85, Ue = v + h + ce / 2;
    for (const [t, e] of U) {
      const a = new Me(b / 2, b / 2, _ + h, 12), o = new be(a, $e);
      o.position.set(t, e, v + (-_ + h) / 2), o.rotation.x = Math.PI / 2, ft.push(o);
      const r = new Me(ie, ie, ce, 6), c = new be(r, Je);
      c.position.set(t, e, Ue), c.rotation.x = Math.PI / 2, ft.push(c);
    }
    let At = 0;
    const re = ht == null ? void 0 : ht.vonMises;
    re && re.forEach((t) => t.forEach((e) => {
      e > At && (At = e);
    }));
    const Xe = 0.65, Z = n * l, de = j * Q, Ze = Math.min(2, Math.sqrt(de / Z)), Ke = Math.min(0.85 * Mt * Z * Ze, 1.7 * Mt * Z), me = Xe * Ke, Qe = tt / Math.max(1, me), pe = Math.max(0, (n - 0.95 * Math.max(d, i)) / 2), tn = tt / Z, ue = pe * Math.sqrt(2 * Math.max(0, tn) / (0.9 * Mn)), en = ue / Math.max(1e-6, f), nn = Math.max(0.05, n - 2 * $), an = Math.sqrt(bt * bt + _t * _t), he = Math.max(0, an / nn - tt / 2) / Math.max(1, S), fe = 0.75 * (0.75 * Math.PI * b * b / 4) * bn, on = he / Math.max(1, fe);
    Ne.val = {
      vmMax: At,
      A1: Z,
      A2: de,
      phiPp: me,
      demandCapPp: Qe,
      m_cant: pe,
      t_req: ue,
      demandCapT: en,
      T_anchor: he,
      phiNn: fe,
      demandCapAnchor: on
    }, Ft.val = I, Be.val = N, Pe.val = le, Ce.val = It, Se.val = Nt, ze.val = ht, Ie.val = ft;
  });
  pn.val = "losas";
  const T = un({
    mesh: {
      nodes: Ft,
      elements: Be,
      nodeInputs: Pe,
      elementInputs: Ce,
      deformOutputs: Se,
      analyzeOutputs: ze
    },
    objects3D: Ie,
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
  }), R = document.createElement("div");
  R.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:48vh;overflow-y:auto;z-index:4;";
  const V = new rn({
    title: "\u{1F9EA} Placa base + col HSS hueca",
    container: R,
    expanded: true
  }), M = {
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
  }, Lt = (n) => n < 1 ? `${n.toFixed(2)} \u2713` : n < 1.2 ? `${n.toFixed(2)} \u26A0` : `${n.toFixed(2)} \u2717`, xt = V.addFolder({
    title: "AISC \xA7J8 bearing concreto"
  });
  xt.addBinding(M, "A1", {
    readonly: true,
    label: "A1 (m\xB2)",
    format: (n) => n.toFixed(4)
  });
  xt.addBinding(M, "A2", {
    readonly: true,
    label: "A2 (m\xB2)",
    format: (n) => n.toFixed(4)
  });
  xt.addBinding(M, "phiPp", {
    readonly: true,
    label: "\u03C6Pp (kN)",
    format: (n) => n.toFixed(0)
  });
  xt.addBinding(M, "demandCapPp", {
    readonly: true,
    label: "Pu/\u03C6Pp",
    format: Lt
  });
  const Ot = V.addFolder({
    title: "DG-1 espesor placa"
  });
  Ot.addBinding(M, "m_cant", {
    readonly: true,
    label: "m cant (m)",
    format: (n) => n.toFixed(4)
  });
  Ot.addBinding(M, "t_req", {
    readonly: true,
    label: "t_req (mm)",
    format: (n) => (n * 1e3).toFixed(1)
  });
  Ot.addBinding(M, "demandCapT", {
    readonly: true,
    label: "t_req/t_act",
    format: Lt
  });
  const qt = V.addFolder({
    title: "ACI \xA717 anclaje"
  });
  qt.addBinding(M, "T_anchor", {
    readonly: true,
    label: "T (kN/perno)",
    format: (n) => n.toFixed(1)
  });
  qt.addBinding(M, "phiNn", {
    readonly: true,
    label: "\u03C6Nn (kN)",
    format: (n) => n.toFixed(1)
  });
  qt.addBinding(M, "demandCapAnchor", {
    readonly: true,
    label: "T/\u03C6Nn",
    format: Lt
  });
  const _n = V.addFolder({
    title: "FEM"
  });
  _n.addBinding(M, "vmMax", {
    readonly: true,
    label: "\u03C3 vM max acero (kN/m\xB2)",
    format: (n) => n.toExponential(3)
  });
  const Ae = V.addFolder({
    title: "Unidades",
    expanded: false
  }), ke = {
    stress: we.val,
    disp: ge.val
  };
  Ae.addBinding(ke, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (n) => {
    we.val = n.value;
  });
  Ae.addBinding(ke, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (n) => {
    ge.val = n.value;
  });
  document.body.append(R);
  s.derive(() => {
    const n = Ne.val;
    Object.assign(M, n), V.refresh();
  });
  document.body.append(xn(p), T, hn({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-hueca/main.ts"
  }));
  setTimeout(() => fn(), 200);
  function Yt() {
    const n = document.getElementById("parameters");
    if (!n) return;
    const l = Math.round(R.getBoundingClientRect().bottom) + 8;
    n.style.top = `${l}px`, n.style.bottom = "8px", n.style.maxHeight = `${Math.max(120, innerHeight - l - 8)}px`, n.style.overflowY = "auto";
  }
  new ResizeObserver(Yt).observe(R);
  addEventListener("resize", Yt);
  function je(n) {
    const l = (x) => {
      var _a;
      const S = (_a = document.getElementById(x)) == null ? void 0 : _a.getBoundingClientRect();
      return S && S.width ? S : null;
    }, f = l("legend"), d = ((x) => x && x.height > 80 ? x : null)(l("settings")), i = d ? Math.min(n / 2, d.right + 8) : 0, u = f ? Math.max(i + 100, f.left - 8) : Math.max(i + 100, R.getBoundingClientRect().left - 8);
    return [
      i,
      u
    ];
  }
  function Ee() {
    var _a, _b, _c;
    const n = (_a = T.__ctx) == null ? void 0 : _a.camera;
    if (!(n == null ? void 0 : n.isPerspectiveCamera)) return;
    const l = T.clientWidth || innerWidth, f = T.clientHeight || innerHeight, [d, i] = je(l);
    n.setViewOffset(l, f, l / 2 - (d + i) / 2, 0, l, f), n.updateProjectionMatrix(), (_c = (_b = T.__ctx) == null ? void 0 : _b.render) == null ? void 0 : _c.call(_b);
  }
  function yn() {
    const n = T.__ctx, l = n == null ? void 0 : n.camera, f = n == null ? void 0 : n.controls, d = Ft.rawVal;
    if (!l || !f || !d.length) return;
    const i = [
      1 / 0,
      1 / 0,
      1 / 0
    ], u = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const _ of d) for (let h = 0; h < 3; h++) i[h] = Math.min(i[h], _[h]), u[h] = Math.max(u[h], _[h]);
    const x = new Et((i[0] + u[0]) / 2, (i[1] + u[1]) / 2, (i[2] + u[2]) / 2), W = 0.5 * Math.hypot(u[0] - i[0], u[1] - i[1], u[2] - i[2]), S = T.clientWidth || innerWidth, $ = T.clientHeight || innerHeight, [K, b] = je(S);
    if (l.up.set(0, 0, 1), l.isPerspectiveCamera) {
      const _ = l.fov * Math.PI / 180, h = 2 * Math.atan(Math.tan(_ / 2) * ((b - K) / $)), j = 1.1 * W / Math.sin(Math.min(_, h) / 2);
      l.position.copy(x.clone().addScaledVector(new Et(1.5, -1.5, 2).normalize(), j)), l.near = j / 100, l.far = j * 100;
    }
    f.target.copy(x), f.update(), Ee();
  }
  addEventListener("resize", () => setTimeout(Ee, 50));
  setTimeout(() => {
    var _a;
    if (Yt(), innerWidth < 1300) {
      const n = document.querySelector("#settings .tp-rotv_b"), l = (_a = document.querySelector("#settings .tp-rotv")) == null ? void 0 : _a.classList.contains("tp-rotv-expanded");
      n && l && n.click();
    }
  }, 700);
  setTimeout(() => {
    yn();
    const n = window.__hekatanClip, l = window.__hekatanClipApply;
    n && l && (n.enableY = true, n.posY = 0, n.invertY = false, l());
  }, 1100);
});
