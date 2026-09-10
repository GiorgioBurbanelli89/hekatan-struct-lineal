import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as c, a as jo, e as Ut, M as Vt, C as Xt, V as Io, B as So, d as Eo } from "./theme-Dxpmbnyd.js";
import { P as Lo } from "./tweakpane-BXg6ZhiP.js";
import { a as qo } from "./analyze-DgLgRmKg.js";
import { d as Oo, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Ho, d as Ge, e as Ye } from "./getViewer-B0x6YucZ.js";
import { e as Go } from "./makeDraggable-zx2br6Yh.js";
import { g as Yo } from "./getParameters-Bf35D0lJ.js";
import { g as Do } from "./styles-DjzQZscE.js";
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
  const Rt = 2e8, Zt = 0.3, Oe = Rt / (2 * (1 + Zt)), He = 78, $o = 25e4, Jo = 6e5, d = {
    B: {
      value: c.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "B placa (m)"
    },
    H: {
      value: c.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "H placa (m)"
    },
    t_plate: {
      value: c.state(0.025),
      min: 0.012,
      max: 0.06,
      step: 2e-3,
      label: "t placa (m)"
    },
    bc: {
      value: c.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "bc col (m)"
    },
    hc: {
      value: c.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "hc col (m)"
    },
    t_col: {
      value: c.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared HSS (m)"
    },
    L_col: {
      value: c.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "L stub col (m)"
    },
    nBoltsX: {
      value: c.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en X"
    },
    nBoltsY: {
      value: c.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en Y"
    },
    sx: {
      value: c.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sx borde (m)"
    },
    sy: {
      value: c.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sy borde (m)"
    },
    d_bolt: {
      value: c.state(0.024),
      min: 0.012,
      max: 0.04,
      step: 2e-3,
      label: "\xD8 perno (m)"
    },
    L_bolt: {
      value: c.state(0.3),
      min: 0.15,
      max: 0.6,
      step: 0.02,
      label: "L embebido (m)"
    },
    L_proj: {
      value: c.state(0.05),
      min: 0.02,
      max: 0.1,
      step: 5e-3,
      label: "L proyec (m)"
    },
    d_hole: {
      value: c.state(0.2),
      min: 0.1,
      max: 0.4,
      step: 0.02,
      label: "\xD8 orificio placa (m)"
    },
    B_ped: {
      value: c.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "B pedestal (m)"
    },
    H_ped: {
      value: c.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "H pedestal (m)"
    },
    h_ped: {
      value: c.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "h pedestal (m)"
    },
    fc: {
      value: c.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c (kN/m\xB2)"
    },
    Pu: {
      value: c.state(300),
      min: 0,
      max: 5e3,
      step: 25,
      label: "Pu axial (kN)"
    },
    Mx: {
      value: c.state(20),
      min: 0,
      max: 500,
      step: 5,
      label: "Mx (kN\xB7m)"
    },
    My: {
      value: c.state(30),
      min: 0,
      max: 500,
      step: 5,
      label: "My (kN\xB7m)"
    },
    nx: {
      value: c.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh nx"
    },
    ny: {
      value: c.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh ny"
    },
    nz_col: {
      value: c.state(6),
      min: 4,
      max: 12,
      step: 2,
      label: "nz col"
    }
  }, De = c.state([]), $e = c.state([]), Je = c.state({}), Ue = c.state({}), Ve = c.state({}), Xe = c.state({}), Re = c.state([]), Ze = c.state({
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
    demandCapAnchor: 0,
    As: 0,
    Ac: 0,
    Pno_composite: 0,
    demandCapPno: 0
  });
  c.derive(() => {
    const s = d.B.value.val, h = d.H.value.val, L = d.t_plate.value.val, p = d.bc.value.val, m = d.hc.value.val, b = d.t_col.value.val, D = d.L_col.value.val, te = Math.round(d.nBoltsX.value.val), gt = Math.round(d.nBoltsY.value.val), Bt = d.sx.value.val, ee = d.sy.value.val, z = d.d_bolt.value.val, pt = d.L_bolt.value.val, mt = d.L_proj.value.val, oe = d.d_hole.value.val / 2, ut = d.B_ped.value.val, ft = d.H_ped.value.val, Pt = d.h_ped.value.val, V = d.fc.value.val, X = d.Pu.value.val, wt = d.Mx.value.val, At = d.My.value.val, R = Math.round(d.nx.value.val), Z = Math.round(d.ny.value.val), A = Math.round(d.nz_col.value.val), x = 0.04, _ = [], y = [], K = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), nt = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map();
    function F(t, e, o) {
      return _.push([
        t,
        e,
        o
      ]), _.length - 1;
    }
    function $(t, e, o, n, a) {
      y.push([
        t,
        e,
        o,
        n
      ]);
      const l = y.length - 1;
      K.set(l, a), Q.set(l, Rt), W.set(l, Zt), tt.set(l, He), et.set(l, Oe), ot.set(l, 0), at.set(l, 0), nt.set(l, 0), st.set(l, 0);
    }
    function ne(t, e, o, n, a) {
      y.push([
        t,
        e
      ]);
      const l = y.length - 1;
      Q.set(l, Rt), W.set(l, Zt), tt.set(l, He), et.set(l, Oe), ot.set(l, o), at.set(l, n), nt.set(l, n), st.set(l, a), K.set(l, 0);
    }
    const Tt = s / R, Ct = h / Z, q = [];
    for (let t = 0; t <= Z; t++) {
      const e = [];
      for (let o = 0; o <= R; o++) e.push(F(-s / 2 + o * Tt, -h / 2 + t * Ct, x));
      q.push(e);
    }
    for (let t = 0; t < Z; t++) for (let e = 0; e < R; e++) {
      const o = -s / 2 + (e + 0.5) * Tt, n = -h / 2 + (t + 0.5) * Ct;
      Math.hypot(o, n) < oe || $(q[t][e], q[t][e + 1], q[t + 1][e + 1], q[t + 1][e], L);
    }
    function O(t, e) {
      let o = -1, n = 1 / 0;
      for (let a = 0; a <= Z; a++) for (let l = 0; l <= R; l++) {
        const u = q[a][l], w = Math.hypot(_[u][0] - t, _[u][1] - e);
        w < n && (n = w, o = u);
      }
      return o;
    }
    const T = Math.max(2, Math.round(p / Tt)), C = Math.max(2, Math.round(m / Ct)), ht = p / T, xt = m / C, lt = D / A, j = [];
    for (let t = 0; t <= A; t++) {
      const e = [];
      for (let o = 0; o <= T; o++) {
        const n = -p / 2 + o * ht;
        t === 0 ? e.push(O(n, -m / 2)) : e.push(F(n, -m / 2, x + t * lt));
      }
      j.push(e);
    }
    for (let t = 0; t < A; t++) for (let e = 0; e < T; e++) $(j[t][e], j[t][e + 1], j[t + 1][e + 1], j[t + 1][e], b);
    const I = [];
    for (let t = 0; t <= A; t++) {
      const e = [];
      for (let o = 0; o <= T; o++) {
        const n = -p / 2 + o * ht;
        t === 0 ? e.push(O(n, m / 2)) : e.push(F(n, m / 2, x + t * lt));
      }
      I.push(e);
    }
    for (let t = 0; t < A; t++) for (let e = 0; e < T; e++) $(I[t][e], I[t][e + 1], I[t + 1][e + 1], I[t + 1][e], b);
    const H = [];
    for (let t = 0; t <= A; t++) {
      const e = [];
      for (let o = 0; o <= C; o++) {
        const n = -m / 2 + o * xt;
        t === 0 ? e.push(O(-p / 2, n)) : o === 0 ? e.push(j[t][0]) : o === C ? e.push(I[t][0]) : e.push(F(-p / 2, n, x + t * lt));
      }
      H.push(e);
    }
    for (let t = 0; t < A; t++) for (let e = 0; e < C; e++) $(H[t][e], H[t][e + 1], H[t + 1][e + 1], H[t + 1][e], b);
    const G = [];
    for (let t = 0; t <= A; t++) {
      const e = [];
      for (let o = 0; o <= C; o++) {
        const n = -m / 2 + o * xt;
        t === 0 ? e.push(O(p / 2, n)) : o === 0 ? e.push(j[t][T]) : o === C ? e.push(I[t][T]) : e.push(F(p / 2, n, x + t * lt));
      }
      G.push(e);
    }
    for (let t = 0; t < A; t++) for (let e = 0; e < C; e++) $(G[t][e], G[t][e + 1], G[t + 1][e + 1], G[t + 1][e], b);
    const ae = 4700 * Math.sqrt(V / 1e3) * 1e3, se = 0.2, to = ae / (2 * (1 + se)), le = 2 * b, Nt = p - 2 * b - le, kt = m - 2 * b - le, N = 4, k = 4, S = A, zt = Nt / N, ce = kt / k, eo = D / S, ie = (t, e) => Math.hypot(t, e) < oe + zt * 0.5, i = [];
    for (let t = 0; t <= S; t++) {
      const e = [];
      for (let o = 0; o <= k; o++) {
        const n = [];
        for (let a = 0; a <= N; a++) {
          const l = -Nt / 2 + a * zt, u = -kt / 2 + o * ce, w = x + L + t * eo;
          t === 0 && !ie(l, u) ? n.push(O(l, u)) : n.push(F(l, u, w));
        }
        e.push(n);
      }
      i.push(e);
    }
    function v(t, e, o, n) {
      y.push([
        t,
        e,
        o,
        n
      ]);
      const a = y.length - 1;
      K.set(a, 1e-3), Q.set(a, ae), W.set(a, se), tt.set(a, 24 / 9.80665), et.set(a, to), ot.set(a, 0), at.set(a, 0), nt.set(a, 0), st.set(a, 0);
    }
    for (let t = 0; t < k; t++) for (let e = 0; e < N; e++) v(i[0][t][e], i[0][t][e + 1], i[0][t + 1][e + 1], i[0][t + 1][e]), v(i[S][t][e], i[S][t][e + 1], i[S][t + 1][e + 1], i[S][t + 1][e]);
    for (let t = 0; t < S; t++) for (let e = 0; e < N; e++) v(i[t][0][e], i[t][0][e + 1], i[t + 1][0][e + 1], i[t + 1][0][e]), v(i[t][k][e], i[t][k][e + 1], i[t + 1][k][e + 1], i[t + 1][k][e]);
    for (let t = 0; t < S; t++) for (let e = 0; e < k; e++) v(i[t][e][0], i[t][e + 1][0], i[t + 1][e + 1][0], i[t + 1][e][0]), v(i[t][e][N], i[t][e + 1][N], i[t + 1][e + 1][N], i[t + 1][e][N]);
    const oo = Math.min(0.2, D * 0.4), re = Math.min(0.1, (s - p) / 2 * 0.7), no = Math.max(1, Math.round(oo / lt));
    function E(t, e, o, n) {
      const [a, l] = t, [u, w] = e, U = o[0][n], Jt = O(a + u * re, l + w * re), qe = o[Math.min(no, o.length - 1)][n];
      $(U, Jt, qe, qe, b);
    }
    const de = Math.max(1, Math.round(T * 0.25)), pe = Math.max(1, Math.round(C * 0.25)), Ft = Math.round(T / 2) - de, jt = Math.round(T / 2) + de, It = Math.round(C / 2) - pe, St = Math.round(C / 2) + pe, me = -p / 2 + Ft * ht, ue = -p / 2 + jt * ht;
    E([
      me,
      m / 2
    ], [
      0,
      1
    ], I, Ft), E([
      ue,
      m / 2
    ], [
      0,
      1
    ], I, jt), E([
      me,
      -m / 2
    ], [
      0,
      -1
    ], j, Ft), E([
      ue,
      -m / 2
    ], [
      0,
      -1
    ], j, jt);
    const fe = -m / 2 + It * xt, he = -m / 2 + St * xt;
    E([
      p / 2,
      fe
    ], [
      1,
      0
    ], G, It), E([
      p / 2,
      he
    ], [
      1,
      0
    ], G, St), E([
      -p / 2,
      fe
    ], [
      -1,
      0
    ], H, It), E([
      -p / 2,
      he
    ], [
      -1,
      0
    ], H, St);
    const xe = Math.PI * z * z / 4, Et = Math.PI * z ** 4 / 64, be = 2 * Et, ct = [], ao = (s - 2 * Bt) / Math.max(1, te - 1), so = (h - 2 * ee) / Math.max(1, gt - 1);
    for (let t = 0; t < te; t++) for (let e = 0; e < gt; e++) {
      const o = -s / 2 + Bt + t * ao, n = -h / 2 + ee + e * so;
      Math.abs(o) < p / 2 + 5e-3 && Math.abs(n) < m / 2 + 5e-3 || ct.push([
        o,
        n
      ]);
    }
    const lo = [
      ...ct
    ], _e = 4700 * Math.sqrt(V / 1e3) * 1e3, ve = 0.2, co = _e / (2 * (1 + ve)), g = 10, B = 10, P = 6, Lt = ut / g, Me = ft / B, io = Pt / P, ro = [];
    for (let t = 0; t <= Z; t++) for (let e = 0; e <= R; e++) {
      const o = q[t][e];
      ro.push({
        id: o,
        x: _[o][0],
        y: _[o][1]
      });
    }
    const r = [];
    for (let t = 0; t <= P; t++) {
      const e = [];
      for (let o = 0; o <= B; o++) {
        const n = [];
        for (let a = 0; a <= g; a++) n.push(F(-ut / 2 + a * Lt, -ft / 2 + o * Me, -Pt + t * io));
        e.push(n);
      }
      r.push(e);
    }
    function J(t, e, o, n) {
      y.push([
        t,
        e,
        o,
        n
      ]);
      const a = y.length - 1;
      K.set(a, 1e-3), Q.set(a, _e), W.set(a, ve), tt.set(a, 24 / 9.80665), et.set(a, co), ot.set(a, 0), at.set(a, 0), nt.set(a, 0), st.set(a, 0);
    }
    for (let t = 0; t < B; t++) for (let e = 0; e < g; e++) J(r[0][t][e], r[0][t][e + 1], r[0][t + 1][e + 1], r[0][t + 1][e]);
    function po(t, e) {
      for (const [o, n] of ct) if (Math.hypot(t - o, e - n) < Lt * 0.6) return true;
      return false;
    }
    for (let t = 0; t < B; t++) for (let e = 0; e < g; e++) {
      const o = -ut / 2 + (e + 0.5) * Lt, n = -ft / 2 + (t + 0.5) * Me;
      po(o, n) || J(r[P][t][e], r[P][t][e + 1], r[P][t + 1][e + 1], r[P][t + 1][e]);
    }
    for (let t = 0; t < P; t++) for (let e = 0; e < g; e++) J(r[t][0][e], r[t][0][e + 1], r[t + 1][0][e + 1], r[t + 1][0][e]);
    for (let t = 0; t < P; t++) for (let e = 0; e < g; e++) J(r[t][B][e], r[t][B][e + 1], r[t + 1][B][e + 1], r[t + 1][B][e]);
    for (let t = 0; t < P; t++) for (let e = 0; e < B; e++) J(r[t][e][0], r[t][e + 1][0], r[t + 1][e + 1][0], r[t + 1][e][0]);
    for (let t = 0; t < P; t++) for (let e = 0; e < B; e++) J(r[t][e][g], r[t][e + 1][g], r[t + 1][e + 1][g], r[t + 1][e][g]);
    function mo(t, e) {
      let o = -1, n = 1 / 0;
      for (let a = 0; a <= B; a++) for (let l = 0; l <= g; l++) {
        const u = r[P][a][l], w = _[u], U = Math.hypot(w[0] - t, w[1] - e);
        U < n && (n = U, o = u);
      }
      return o;
    }
    const ye = /* @__PURE__ */ new Map();
    for (let t = 0; t <= k; t++) for (let e = 0; e <= N; e++) {
      const o = -Nt / 2 + e * zt, n = -kt / 2 + t * ce;
      ie(o, n) && ye.set(`${e},${t}`, {
        idTop: i[0][t][e],
        idBot: mo(o, n),
        x: o,
        y: n
      });
    }
    const M = (t, e) => ye.get(`${t},${e}`) ?? null;
    for (let t = 0; t < k; t++) for (let e = 0; e < N; e++) {
      const o = M(e, t), n = M(e + 1, t), a = M(e, t + 1), l = M(e + 1, t + 1);
      !o || !n || !a || !l || (v(o.idTop, n.idTop, l.idTop, a.idTop), v(o.idBot, n.idBot, l.idBot, a.idBot), (!M(e - 1, t) || !M(e - 1, t + 1)) && v(o.idBot, o.idTop, a.idTop, a.idBot), (!M(e + 2, t) || !M(e + 2, t + 1)) && v(n.idBot, l.idBot, l.idTop, n.idTop), (!M(e, t - 1) || !M(e + 1, t - 1)) && v(o.idBot, n.idBot, n.idTop, o.idTop), (!M(e, t + 2) || !M(e + 1, t + 2)) && v(a.idBot, a.idTop, l.idTop, l.idBot));
    }
    for (const [t, e] of lo) {
      const o = F(t, e, x + mt), n = O(t, e), a = F(t, e, x - pt);
      ne(o, n, xe, Et, be), ne(n, a, xe, Et, be);
    }
    const ge = /* @__PURE__ */ new Map();
    _.forEach((t, e) => {
      const o = Math.abs(t[2] - (x - pt)) < 1e-6 && ct.some(([a, l]) => Math.abs(t[0] - a) < 1e-6 && Math.abs(t[1] - l) < 1e-6), n = Math.abs(t[2] - -Pt) < 1e-6;
      (o || n) && ge.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const qt = [];
    _.forEach((t, e) => {
      Math.abs(t[2] - (x + D)) < 1e-6 && Math.abs(t[0]) <= p / 2 + 1e-6 && Math.abs(t[1]) <= m / 2 + 1e-6 && qt.push(e);
    });
    const Ot = Math.max(1, qt.length), uo = -X / Ot, fo = wt / Ot, ho = At / Ot, Be = /* @__PURE__ */ new Map();
    for (const t of qt) Be.set(t, [
      0,
      0,
      uo,
      fo,
      ho,
      0
    ]);
    const Pe = {
      supports: ge,
      loads: Be
    }, Ht = {
      elasticities: Q,
      shearModuli: et,
      areas: ot,
      momentsOfInertiaY: nt,
      momentsOfInertiaZ: at,
      torsionalConstants: st,
      densities: tt,
      poissonsRatios: W,
      thicknesses: K
    };
    let Gt = {}, Yt = {};
    try {
      Gt = Oo(_, y, Pe, Ht), Yt = qo(_, y, Ht, Gt);
    } catch (t) {
      console.warn("placa-base-hueca:", (t == null ? void 0 : t.message) ?? t);
    }
    const it = [], xo = new jo({
      color: 16755200
    });
    function rt(t, e) {
      const n = [];
      for (let u = 0; u <= 5 * 2; u++) {
        const w = u / 10, U = x * (1 - w), Jt = u % 2 === 0 ? 0 : 8e-3;
        n.push(new Io(t + Jt, e, U));
      }
      const a = new So().setFromPoints(n), l = new Eo(a, xo);
      it.push(l);
    }
    rt(s / 2 - 0.04, h / 2 - 0.04), rt(-s / 2 + 0.04, h / 2 - 0.04), rt(s / 2 - 0.04, -h / 2 + 0.04), rt(-s / 2 + 0.04, -h / 2 + 0.04), rt(0, 0);
    const bo = new Ut({
      color: 8930338,
      roughness: 0.6
    }), we = 0.012, Ae = 0.025, bt = p / 2 - b - Ae, _t = m / 2 - b - Ae;
    for (const [t, e] of [
      [
        bt,
        _t
      ],
      [
        -bt,
        _t
      ],
      [
        bt,
        -_t
      ],
      [
        -bt,
        -_t
      ]
    ]) {
      const o = new Vt(new Xt(we / 2, we / 2, D, 8), bo);
      o.position.set(t, e, x + D / 2 + L), o.rotation.x = Math.PI / 2, it.push(o);
    }
    const _o = new Ut({
      color: 6710886,
      metalness: 0.5
    }), vo = new Ut({
      color: 4473924,
      metalness: 0.7,
      roughness: 0.3
    }), Te = z * 0.8, Ce = z * 0.85, Mo = x + mt + Te / 2;
    for (const [t, e] of ct) {
      const o = new Xt(z / 2, z / 2, pt + mt, 12), n = new Vt(o, _o);
      n.position.set(t, e, x + (-pt + mt) / 2), n.rotation.x = Math.PI / 2, it.push(n);
      const a = new Xt(Ce, Ce, Te, 6), l = new Vt(a, vo);
      l.position.set(t, e, Mo), l.rotation.x = Math.PI / 2, it.push(l);
    }
    let Dt = 0;
    const Ne = Yt == null ? void 0 : Yt.vonMises;
    Ne && Ne.forEach((t) => t.forEach((e) => {
      e > Dt && (Dt = e);
    }));
    const yo = 0.65, dt = s * h, ke = ut * ft, go = Math.min(2, Math.sqrt(ke / dt)), Bo = Math.min(0.85 * V * dt * go, 1.7 * V * dt), ze = yo * Bo, Po = X / Math.max(1, ze), Fe = Math.max(0, (s - 0.95 * Math.max(p, m)) / 2), wo = X / dt, je = Fe * Math.sqrt(2 * Math.max(0, wo) / (0.9 * $o)), Ao = je / Math.max(1e-6, L), To = Math.max(0.05, s - 2 * Bt), Co = Math.sqrt(wt * wt + At * At), Ie = Math.max(0, Co / To - X / 2) / Math.max(1, gt), Se = 0.75 * (0.75 * Math.PI * z * z / 4) * Jo, No = Ie / Math.max(1, Se), ko = p * m, $t = (p - 2 * b) * (m - 2 * b), Ee = ko - $t, Le = 35e4 * Ee + 0.85 * V * $t, zo = 0.75 * Le, Fo = X / Math.max(1, zo);
    Ze.val = {
      vmMax: Dt,
      A1: dt,
      A2: ke,
      phiPp: ze,
      demandCapPp: Po,
      m_cant: Fe,
      t_req: je,
      demandCapT: Ao,
      T_anchor: Ie,
      phiNn: Se,
      demandCapAnchor: No,
      As: Ee,
      Ac: $t,
      Pno_composite: Le,
      demandCapPno: Fo
    }, De.val = _, $e.val = y, Je.val = Pe, Ue.val = Ht, Ve.val = Gt, Xe.val = Yt, Re.val = it;
  });
  const Ke = Ho({
    mesh: {
      nodes: De,
      elements: $e,
      nodeInputs: Je,
      elementInputs: Ue,
      deformOutputs: Ve,
      analyzeOutputs: Xe
    },
    objects3D: Re,
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
  }), Kt = document.createElement("div");
  Kt.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:85vh;overflow-y:auto;z-index:9999;";
  const Y = new Lo({
    title: "\u{1F9EA} Placa base + col CFT",
    container: Kt,
    expanded: true
  }), f = {
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
    demandCapAnchor: 0,
    As: 0,
    Ac: 0,
    Pno_composite: 0,
    demandCapPno: 0
  }, vt = (s) => s < 1 ? `${s.toFixed(2)} \u2713` : s < 1.2 ? `${s.toFixed(2)} \u26A0` : `${s.toFixed(2)} \u2717`, Mt = Y.addFolder({
    title: "AISC \xA7I2.1b composite CFT"
  });
  Mt.addBinding(f, "As", {
    readonly: true,
    label: "As acero (m\xB2)",
    format: (s) => s.toExponential(3)
  });
  Mt.addBinding(f, "Ac", {
    readonly: true,
    label: "Ac concreto (m\xB2)",
    format: (s) => s.toExponential(3)
  });
  Mt.addBinding(f, "Pno_composite", {
    readonly: true,
    label: "Pno (kN)",
    format: (s) => s.toFixed(0)
  });
  Mt.addBinding(f, "demandCapPno", {
    readonly: true,
    label: "Pu/\u03C6Pno",
    format: vt
  });
  const yt = Y.addFolder({
    title: "AISC \xA7J8 bearing concreto"
  });
  yt.addBinding(f, "A1", {
    readonly: true,
    label: "A1 (m\xB2)",
    format: (s) => s.toFixed(4)
  });
  yt.addBinding(f, "A2", {
    readonly: true,
    label: "A2 (m\xB2)",
    format: (s) => s.toFixed(4)
  });
  yt.addBinding(f, "phiPp", {
    readonly: true,
    label: "\u03C6Pp (kN)",
    format: (s) => s.toFixed(0)
  });
  yt.addBinding(f, "demandCapPp", {
    readonly: true,
    label: "Pu/\u03C6Pp",
    format: vt
  });
  const Qt = Y.addFolder({
    title: "DG-1 espesor placa"
  });
  Qt.addBinding(f, "m_cant", {
    readonly: true,
    label: "m cant (m)",
    format: (s) => s.toFixed(4)
  });
  Qt.addBinding(f, "t_req", {
    readonly: true,
    label: "t_req (mm)",
    format: (s) => (s * 1e3).toFixed(1)
  });
  Qt.addBinding(f, "demandCapT", {
    readonly: true,
    label: "t_req/t_act",
    format: vt
  });
  const Wt = Y.addFolder({
    title: "ACI \xA717 anclaje"
  });
  Wt.addBinding(f, "T_anchor", {
    readonly: true,
    label: "T (kN/perno)",
    format: (s) => s.toFixed(1)
  });
  Wt.addBinding(f, "phiNn", {
    readonly: true,
    label: "\u03C6Nn (kN)",
    format: (s) => s.toFixed(1)
  });
  Wt.addBinding(f, "demandCapAnchor", {
    readonly: true,
    label: "T/\u03C6Nn",
    format: vt
  });
  const Uo = Y.addFolder({
    title: "FEM"
  });
  Uo.addBinding(f, "vmMax", {
    readonly: true,
    label: "\u03C3 vM max (kN/m\xB2)",
    format: (s) => s.toExponential(3)
  });
  const Qe = Y.addFolder({
    title: "Unidades",
    expanded: false
  }), We = {
    stress: Ye.val,
    disp: Ge.val
  };
  Qe.addBinding(We, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (s) => {
    Ye.val = s.value;
  });
  Qe.addBinding(We, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (s) => {
    Ge.val = s.value;
  });
  document.body.append(Kt);
  c.derive(() => {
    const s = Ze.val;
    Object.assign(f, s), Y.refresh();
  });
  document.body.append(Yo(d), Ke, Do({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-cft/main.ts"
  }));
  setTimeout(() => Go(), 200);
  setTimeout(() => {
    var _a;
    const s = Ke.__ctx;
    (s == null ? void 0 : s.camera) && (s == null ? void 0 : s.controls) && (s.camera.up.set(0, 0, 1), s.camera.position.set(1.5, -1.5, 2), s.controls.target.set(0, 0, 0.4), s.controls.update(), (_a = s.render) == null ? void 0 : _a.call(s));
    const h = window.__hekatanClip, L = window.__hekatanClipApply;
    h && L && (h.enableY = true, h.posY = 0, h.invertY = false, L());
  }, 800);
});
