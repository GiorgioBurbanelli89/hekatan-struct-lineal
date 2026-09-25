import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as i, b as qo, e as Kt, M as Qt, C as te, V as ee, B as Go, d as Yo } from "./Text-C1TX4d8g.js";
import { P as $o } from "./tweakpane-BXg6ZhiP.js";
import { a as Do, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { d as Ro, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { n as Vo, g as Wo, l as Je, m as Ue, c as Jo, __tla as __tla_2 } from "./aiAgent-CDkRN2K5.js";
import { e as Uo } from "./makeDraggable-zx2br6Yh.js";
import { g as Xo, __tla as __tla_3 } from "./getParameters-C2E0DZJg.js";
import { e as Re } from "./materials-VwssM8Vw.js";
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
  const oe = 2e8, ne = 0.3, Ve = oe / (2 * (1 + ne)), We = 78, Zo = 25e4, Ko = 6e5, u = {
    B: {
      value: i.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "B placa (m)"
    },
    H: {
      value: i.state(0.5),
      min: 0.3,
      max: 1.2,
      step: 0.02,
      label: "H placa (m)"
    },
    t_plate: {
      value: i.state(0.025),
      min: 0.012,
      max: 0.06,
      step: 2e-3,
      label: "t placa (m)"
    },
    bc: {
      value: i.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "bc col (m)"
    },
    hc: {
      value: i.state(0.3),
      min: 0.2,
      max: 0.5,
      step: 0.02,
      label: "hc col (m)"
    },
    t_col: {
      value: i.state(0.012),
      min: 6e-3,
      max: 0.03,
      step: 2e-3,
      label: "t pared HSS (m)"
    },
    L_col: {
      value: i.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "L stub col (m)"
    },
    nBoltsX: {
      value: i.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en X"
    },
    nBoltsY: {
      value: i.state(2),
      min: 2,
      max: 4,
      step: 1,
      label: "Pernos en Y"
    },
    sx: {
      value: i.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sx borde (m)"
    },
    sy: {
      value: i.state(0.07),
      min: 0.03,
      max: 0.2,
      step: 0.01,
      label: "sy borde (m)"
    },
    d_bolt: {
      value: i.state(0.024),
      min: 0.012,
      max: 0.04,
      step: 2e-3,
      label: "\xD8 perno (m)"
    },
    L_bolt: {
      value: i.state(0.3),
      min: 0.15,
      max: 0.6,
      step: 0.02,
      label: "L embebido (m)"
    },
    L_proj: {
      value: i.state(0.05),
      min: 0.02,
      max: 0.1,
      step: 5e-3,
      label: "L proyec (m)"
    },
    d_hole: {
      value: i.state(0.2),
      min: 0.1,
      max: 0.4,
      step: 0.02,
      label: "\xD8 orificio placa (m)"
    },
    B_ped: {
      value: i.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "B pedestal (m)"
    },
    H_ped: {
      value: i.state(0.8),
      min: 0.4,
      max: 1.8,
      step: 0.05,
      label: "H pedestal (m)"
    },
    h_ped: {
      value: i.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "h pedestal (m)"
    },
    fc: {
      value: i.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c (kN/m\xB2)"
    },
    Pu: {
      value: i.state(300),
      min: 0,
      max: 5e3,
      step: 25,
      label: "Pu axial (kN)"
    },
    Mx: {
      value: i.state(20),
      min: 0,
      max: 500,
      step: 5,
      label: "Mx (kN\xB7m)"
    },
    My: {
      value: i.state(30),
      min: 0,
      max: 500,
      step: 5,
      label: "My (kN\xB7m)"
    },
    nx: {
      value: i.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh nx"
    },
    ny: {
      value: i.state(10),
      min: 6,
      max: 20,
      step: 2,
      label: "Mesh ny"
    },
    nz_col: {
      value: i.state(6),
      min: 4,
      max: 12,
      step: 2,
      label: "nz col"
    }
  }, ae = i.state([]), Xe = i.state([]), Ze = i.state({}), Ke = i.state({}), Qe = i.state({}), to = i.state({}), eo = i.state([]), oo = i.state({
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
  i.derive(() => {
    const n = u.B.value.val, r = u.H.value.val, M = u.t_plate.value.val, d = u.bc.value.val, c = u.hc.value.val, f = u.t_col.value.val, v = u.L_col.value.val, K = Math.round(u.nBoltsX.value.val), E = Math.round(u.nBoltsY.value.val), Q = u.sx.value.val, bt = u.sy.value.val, P = u.d_bolt.value.val, z = u.L_bolt.value.val, b = u.L_proj.value.val, ie = u.d_hole.value.val / 2, _t = u.B_ped.value.val, yt = u.H_ped.value.val, zt = u.h_ped.value.val, tt = u.fc.value.val, et = u.Pu.value.val, Nt = u.Mx.value.val, kt = u.My.value.val, ot = Math.round(u.nx.value.val), nt = Math.round(u.ny.value.val), N = Math.round(u.nz_col.value.val), _ = 0.04, y = [], w = [], at = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), lt = /* @__PURE__ */ new Map(), ct = /* @__PURE__ */ new Map(), it = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map(), dt = /* @__PURE__ */ new Map(), pt = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map(), St = /* @__PURE__ */ new Set();
    function H(t, e, o) {
      return y.push([
        t,
        e,
        o
      ]), y.length - 1;
    }
    function J(t, e, o, a, s) {
      w.push([
        t,
        e,
        o,
        a
      ]);
      const l = w.length - 1;
      at.set(l, s), st.set(l, oe), lt.set(l, ne), ct.set(l, We), it.set(l, Ve), rt.set(l, 0), pt.set(l, 0), dt.set(l, 0), mt.set(l, 0);
    }
    function re(t, e, o, a, s) {
      w.push([
        t,
        e
      ]);
      const l = w.length - 1;
      st.set(l, oe), lt.set(l, ne), ct.set(l, We), it.set(l, Ve), rt.set(l, o), pt.set(l, a), dt.set(l, a), mt.set(l, s), at.set(l, 0);
    }
    const jt = n / ot, Ft = r / nt, $ = [];
    for (let t = 0; t <= nt; t++) {
      const e = [];
      for (let o = 0; o <= ot; o++) e.push(H(-n / 2 + o * jt, -r / 2 + t * Ft, _));
      $.push(e);
    }
    for (let t = 0; t < nt; t++) for (let e = 0; e < ot; e++) {
      const o = -n / 2 + (e + 0.5) * jt, a = -r / 2 + (t + 0.5) * Ft;
      Math.hypot(o, a) < ie || J($[t][e], $[t][e + 1], $[t + 1][e + 1], $[t + 1][e], M);
    }
    function D(t, e) {
      let o = -1, a = 1 / 0;
      for (let s = 0; s <= nt; s++) for (let l = 0; l <= ot; l++) {
        const h = $[s][l], I = Math.hypot(y[h][0] - t, y[h][1] - e);
        I < a && (a = I, o = h);
      }
      return o;
    }
    const k = Math.max(2, Math.round(d / jt)), S = Math.max(2, Math.round(c / Ft)), gt = d / k, Bt = c / S, ut = v / N, L = [];
    for (let t = 0; t <= N; t++) {
      const e = [];
      for (let o = 0; o <= k; o++) {
        const a = -d / 2 + o * gt;
        t === 0 ? e.push(D(a, -c / 2)) : e.push(H(a, -c / 2, _ + t * ut));
      }
      L.push(e);
    }
    for (let t = 0; t < N; t++) for (let e = 0; e < k; e++) J(L[t][e], L[t][e + 1], L[t + 1][e + 1], L[t + 1][e], f);
    const O = [];
    for (let t = 0; t <= N; t++) {
      const e = [];
      for (let o = 0; o <= k; o++) {
        const a = -d / 2 + o * gt;
        t === 0 ? e.push(D(a, c / 2)) : e.push(H(a, c / 2, _ + t * ut));
      }
      O.push(e);
    }
    for (let t = 0; t < N; t++) for (let e = 0; e < k; e++) J(O[t][e], O[t][e + 1], O[t + 1][e + 1], O[t + 1][e], f);
    const R = [];
    for (let t = 0; t <= N; t++) {
      const e = [];
      for (let o = 0; o <= S; o++) {
        const a = -c / 2 + o * Bt;
        t === 0 ? e.push(D(-d / 2, a)) : o === 0 ? e.push(L[t][0]) : o === S ? e.push(O[t][0]) : e.push(H(-d / 2, a, _ + t * ut));
      }
      R.push(e);
    }
    for (let t = 0; t < N; t++) for (let e = 0; e < S; e++) J(R[t][e], R[t][e + 1], R[t + 1][e + 1], R[t + 1][e], f);
    const V = [];
    for (let t = 0; t <= N; t++) {
      const e = [];
      for (let o = 0; o <= S; o++) {
        const a = -c / 2 + o * Bt;
        t === 0 ? e.push(D(d / 2, a)) : o === 0 ? e.push(L[t][k]) : o === S ? e.push(O[t][k]) : e.push(H(d / 2, a, _ + t * ut));
      }
      V.push(e);
    }
    for (let t = 0; t < N; t++) for (let e = 0; e < S; e++) J(V[t][e], V[t][e + 1], V[t + 1][e + 1], V[t + 1][e], f);
    const de = Re(tt / 1e3), pe = 0.2, co = de / (2 * (1 + pe)), me = 2 * f, Et = d - 2 * f - me, Ht = c - 2 * f - me, j = 4, F = 4, q = N, Lt = Et / j, ue = Ht / F, io = v / q, fe = (t, e) => Math.hypot(t, e) < ie + Lt * 0.5, p = [];
    for (let t = 0; t <= q; t++) {
      const e = [];
      for (let o = 0; o <= F; o++) {
        const a = [];
        for (let s = 0; s <= j; s++) {
          const l = -Et / 2 + s * Lt, h = -Ht / 2 + o * ue, I = _ + M + t * io;
          t === 0 && !fe(l, h) ? a.push(D(l, h)) : a.push(H(l, h, I));
        }
        e.push(a);
      }
      p.push(e);
    }
    function g(t, e, o, a) {
      w.push([
        t,
        e,
        o,
        a
      ]);
      const s = w.length - 1;
      St.add(s), at.set(s, 1e-3), st.set(s, de), lt.set(s, pe), ct.set(s, 24 / 9.80665), it.set(s, co), rt.set(s, 0), pt.set(s, 0), dt.set(s, 0), mt.set(s, 0);
    }
    for (let t = 0; t < F; t++) for (let e = 0; e < j; e++) g(p[0][t][e], p[0][t][e + 1], p[0][t + 1][e + 1], p[0][t + 1][e]), g(p[q][t][e], p[q][t][e + 1], p[q][t + 1][e + 1], p[q][t + 1][e]);
    for (let t = 0; t < q; t++) for (let e = 0; e < j; e++) g(p[t][0][e], p[t][0][e + 1], p[t + 1][0][e + 1], p[t + 1][0][e]), g(p[t][F][e], p[t][F][e + 1], p[t + 1][F][e + 1], p[t + 1][F][e]);
    for (let t = 0; t < q; t++) for (let e = 0; e < F; e++) g(p[t][e][0], p[t][e + 1][0], p[t + 1][e + 1][0], p[t + 1][e][0]), g(p[t][e][j], p[t][e + 1][j], p[t + 1][e + 1][j], p[t + 1][e][j]);
    const ro = Math.min(0.2, v * 0.4), he = Math.min(0.1, (n - d) / 2 * 0.7), po = Math.max(1, Math.round(ro / ut));
    function G(t, e, o, a) {
      const [s, l] = t, [h, I] = e, X = o[0][a], Zt = D(s + h * he, l + I * he), De = o[Math.min(po, o.length - 1)][a];
      J(X, Zt, De, De, f);
    }
    const xe = Math.max(1, Math.round(k * 0.25)), ve = Math.max(1, Math.round(S * 0.25)), Ot = Math.round(k / 2) - xe, qt = Math.round(k / 2) + xe, Gt = Math.round(S / 2) - ve, Yt = Math.round(S / 2) + ve, be = -d / 2 + Ot * gt, Me = -d / 2 + qt * gt;
    G([
      be,
      c / 2
    ], [
      0,
      1
    ], O, Ot), G([
      Me,
      c / 2
    ], [
      0,
      1
    ], O, qt), G([
      be,
      -c / 2
    ], [
      0,
      -1
    ], L, Ot), G([
      Me,
      -c / 2
    ], [
      0,
      -1
    ], L, qt);
    const _e = -c / 2 + Gt * Bt, ye = -c / 2 + Yt * Bt;
    G([
      d / 2,
      _e
    ], [
      1,
      0
    ], V, Gt), G([
      d / 2,
      ye
    ], [
      1,
      0
    ], V, Yt), G([
      -d / 2,
      _e
    ], [
      -1,
      0
    ], R, Gt), G([
      -d / 2,
      ye
    ], [
      -1,
      0
    ], R, Yt);
    const ge = Math.PI * P * P / 4, $t = Math.PI * P ** 4 / 64, Be = 2 * $t, ft = [], mo = (n - 2 * Q) / Math.max(1, K - 1), uo = (r - 2 * bt) / Math.max(1, E - 1);
    for (let t = 0; t < K; t++) for (let e = 0; e < E; e++) {
      const o = -n / 2 + Q + t * mo, a = -r / 2 + bt + e * uo;
      Math.abs(o) < d / 2 + 5e-3 && Math.abs(a) < c / 2 + 5e-3 || ft.push([
        o,
        a
      ]);
    }
    const fo = [
      ...ft
    ], Pe = Re(tt / 1e3), we = 0.2, ho = Pe / (2 * (1 + we)), A = 10, C = 10, T = 6, Dt = _t / A, Ae = yt / C, xo = zt / T, vo = [];
    for (let t = 0; t <= nt; t++) for (let e = 0; e <= ot; e++) {
      const o = $[t][e];
      vo.push({
        id: o,
        x: y[o][0],
        y: y[o][1]
      });
    }
    const m = [];
    for (let t = 0; t <= T; t++) {
      const e = [];
      for (let o = 0; o <= C; o++) {
        const a = [];
        for (let s = 0; s <= A; s++) a.push(H(-_t / 2 + s * Dt, -yt / 2 + o * Ae, -zt + t * xo));
        e.push(a);
      }
      m.push(e);
    }
    function U(t, e, o, a) {
      w.push([
        t,
        e,
        o,
        a
      ]);
      const s = w.length - 1;
      St.add(s), at.set(s, 1e-3), st.set(s, Pe), lt.set(s, we), ct.set(s, 24 / 9.80665), it.set(s, ho), rt.set(s, 0), pt.set(s, 0), dt.set(s, 0), mt.set(s, 0);
    }
    for (let t = 0; t < C; t++) for (let e = 0; e < A; e++) U(m[0][t][e], m[0][t][e + 1], m[0][t + 1][e + 1], m[0][t + 1][e]);
    function bo(t, e) {
      for (const [o, a] of ft) if (Math.hypot(t - o, e - a) < Dt * 0.6) return true;
      return false;
    }
    for (let t = 0; t < C; t++) for (let e = 0; e < A; e++) {
      const o = -_t / 2 + (e + 0.5) * Dt, a = -yt / 2 + (t + 0.5) * Ae;
      bo(o, a) || U(m[T][t][e], m[T][t][e + 1], m[T][t + 1][e + 1], m[T][t + 1][e]);
    }
    for (let t = 0; t < T; t++) for (let e = 0; e < A; e++) U(m[t][0][e], m[t][0][e + 1], m[t + 1][0][e + 1], m[t + 1][0][e]);
    for (let t = 0; t < T; t++) for (let e = 0; e < A; e++) U(m[t][C][e], m[t][C][e + 1], m[t + 1][C][e + 1], m[t + 1][C][e]);
    for (let t = 0; t < T; t++) for (let e = 0; e < C; e++) U(m[t][e][0], m[t][e + 1][0], m[t + 1][e + 1][0], m[t + 1][e][0]);
    for (let t = 0; t < T; t++) for (let e = 0; e < C; e++) U(m[t][e][A], m[t][e + 1][A], m[t + 1][e + 1][A], m[t + 1][e][A]);
    function Mo(t, e) {
      let o = -1, a = 1 / 0;
      for (let s = 0; s <= C; s++) for (let l = 0; l <= A; l++) {
        const h = m[T][s][l], I = y[h], X = Math.hypot(I[0] - t, I[1] - e);
        X < a && (a = X, o = h);
      }
      return o;
    }
    const Ce = /* @__PURE__ */ new Map();
    for (let t = 0; t <= F; t++) for (let e = 0; e <= j; e++) {
      const o = -Et / 2 + e * Lt, a = -Ht / 2 + t * ue;
      fe(o, a) && Ce.set(`${e},${t}`, {
        idTop: p[0][t][e],
        idBot: Mo(o, a),
        x: o,
        y: a
      });
    }
    const B = (t, e) => Ce.get(`${t},${e}`) ?? null;
    for (let t = 0; t < F; t++) for (let e = 0; e < j; e++) {
      const o = B(e, t), a = B(e + 1, t), s = B(e, t + 1), l = B(e + 1, t + 1);
      !o || !a || !s || !l || (g(o.idTop, a.idTop, l.idTop, s.idTop), g(o.idBot, a.idBot, l.idBot, s.idBot), (!B(e - 1, t) || !B(e - 1, t + 1)) && g(o.idBot, o.idTop, s.idTop, s.idBot), (!B(e + 2, t) || !B(e + 2, t + 1)) && g(a.idBot, l.idBot, l.idTop, a.idTop), (!B(e, t - 1) || !B(e + 1, t - 1)) && g(o.idBot, a.idBot, a.idTop, o.idTop), (!B(e, t + 2) || !B(e + 1, t + 2)) && g(s.idBot, s.idTop, l.idTop, l.idBot));
    }
    for (const [t, e] of fo) {
      const o = H(t, e, _ + b), a = D(t, e), s = H(t, e, _ - z);
      re(o, a, ge, $t, Be), re(a, s, ge, $t, Be);
    }
    const Te = /* @__PURE__ */ new Map();
    y.forEach((t, e) => {
      const o = Math.abs(t[2] - (_ - z)) < 1e-6 && ft.some(([s, l]) => Math.abs(t[0] - s) < 1e-6 && Math.abs(t[1] - l) < 1e-6), a = Math.abs(t[2] - -zt) < 1e-6;
      (o || a) && Te.set(e, [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
    });
    const Rt = [];
    y.forEach((t, e) => {
      Math.abs(t[2] - (_ + v)) < 1e-6 && Math.abs(t[0]) <= d / 2 + 1e-6 && Math.abs(t[1]) <= c / 2 + 1e-6 && Rt.push(e);
    });
    const Vt = Math.max(1, Rt.length), _o = -et / Vt, yo = Nt / Vt, go = kt / Vt, Ie = /* @__PURE__ */ new Map();
    for (const t of Rt) Ie.set(t, [
      0,
      0,
      _o,
      yo,
      go,
      0
    ]);
    const ze = {
      supports: Te,
      loads: Ie
    }, Wt = {
      elasticities: st,
      shearModuli: it,
      areas: rt,
      momentsOfInertiaY: dt,
      momentsOfInertiaZ: pt,
      torsionalConstants: mt,
      densities: ct,
      poissonsRatios: lt,
      thicknesses: at
    };
    let Jt = {}, Pt = {};
    try {
      Jt = Ro(y, w, ze, Wt), Pt = Do(y, w, Wt, Jt);
      for (const t of Object.values(Pt)) if (t instanceof Map) for (const e of St) t.delete(e);
    } catch (t) {
      console.warn("placa-base-hueca:", (t == null ? void 0 : t.message) ?? t);
    }
    const ht = [], Bo = new qo({
      color: 16755200
    });
    function xt(t, e) {
      const a = [];
      for (let h = 0; h <= 5 * 2; h++) {
        const I = h / 10, X = _ * (1 - I), Zt = h % 2 === 0 ? 0 : 8e-3;
        a.push(new ee(t + Zt, e, X));
      }
      const s = new Go().setFromPoints(a), l = new Yo(s, Bo);
      ht.push(l);
    }
    xt(n / 2 - 0.04, r / 2 - 0.04), xt(-n / 2 + 0.04, r / 2 - 0.04), xt(n / 2 - 0.04, -r / 2 + 0.04), xt(-n / 2 + 0.04, -r / 2 + 0.04), xt(0, 0);
    const Po = new Kt({
      color: 8930338,
      roughness: 0.6
    }), Ne = 0.012, ke = 0.025, wt = d / 2 - f - ke, At = c / 2 - f - ke;
    for (const [t, e] of [
      [
        wt,
        At
      ],
      [
        -wt,
        At
      ],
      [
        wt,
        -At
      ],
      [
        -wt,
        -At
      ]
    ]) {
      const o = new Qt(new te(Ne / 2, Ne / 2, v, 8), Po);
      o.position.set(t, e, _ + v / 2 + M), o.rotation.x = Math.PI / 2, ht.push(o);
    }
    const wo = new Kt({
      color: 6710886,
      metalness: 0.5
    }), Ao = new Kt({
      color: 4473924,
      metalness: 0.7,
      roughness: 0.3
    }), Se = P * 0.8, je = P * 0.85, Co = _ + b + Se / 2;
    for (const [t, e] of ft) {
      const o = new te(P / 2, P / 2, z + b, 12), a = new Qt(o, wo);
      a.position.set(t, e, _ + (-z + b) / 2), a.rotation.x = Math.PI / 2, ht.push(a);
      const s = new te(je, je, Se, 6), l = new Qt(s, Ao);
      l.position.set(t, e, Co), l.rotation.x = Math.PI / 2, ht.push(l);
    }
    let Ut = 0;
    const Fe = Pt == null ? void 0 : Pt.vonMises;
    Fe && Fe.forEach((t) => t.forEach((e) => {
      e > Ut && (Ut = e);
    }));
    const To = 0.65, vt = n * r, Ee = _t * yt, Io = Math.min(2, Math.sqrt(Ee / vt)), zo = Math.min(0.85 * tt * vt * Io, 1.7 * tt * vt), He = To * zo, No = et / Math.max(1, He), Le = Math.max(0, (n - 0.95 * Math.max(d, c)) / 2), ko = et / vt, Oe = Le * Math.sqrt(2 * Math.max(0, ko) / (0.9 * Zo)), So = Oe / Math.max(1e-6, M), jo = Math.max(0.05, n - 2 * Q), Fo = Math.sqrt(Nt * Nt + kt * kt), qe = Math.max(0, Fo / jo - et / 2) / Math.max(1, E), Ge = 0.75 * (0.75 * Math.PI * P * P / 4) * Ko, Eo = qe / Math.max(1, Ge), Ho = d * c, Xt = (d - 2 * f) * (c - 2 * f), Ye = Ho - Xt, $e = 35e4 * Ye + 0.85 * tt * Xt, Lo = 0.75 * $e, Oo = et / Math.max(1, Lo);
    oo.val = {
      vmMax: Ut,
      A1: vt,
      A2: Ee,
      phiPp: He,
      demandCapPp: No,
      m_cant: Le,
      t_req: Oe,
      demandCapT: So,
      T_anchor: qe,
      phiNn: Ge,
      demandCapAnchor: Eo,
      As: Ye,
      Ac: Xt,
      Pno_composite: $e,
      demandCapPno: Oo
    }, ae.val = y, Xe.val = w, Ze.val = ze, Ke.val = Wt, Qe.val = Jt, to.val = Pt, eo.val = ht;
  });
  Vo.val = "losas";
  const Y = Wo({
    mesh: {
      nodes: ae,
      elements: Xe,
      nodeInputs: Ze,
      elementInputs: Ke,
      deformOutputs: Qe,
      analyzeOutputs: to
    },
    objects3D: eo,
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
  }), Z = document.createElement("div");
  Z.style.cssText = "position:fixed;top:8px;right:8px;width:300px;max-height:48vh;overflow-y:auto;z-index:4;";
  const W = new $o({
    title: "\u{1F9EA} Placa base + col CFT",
    container: Z,
    expanded: true
  }), x = {
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
  }, Ct = (n) => n < 1 ? `${n.toFixed(2)} \u2713` : n < 1.2 ? `${n.toFixed(2)} \u26A0` : `${n.toFixed(2)} \u2717`, Tt = W.addFolder({
    title: "AISC \xA7I2.1b composite CFT"
  });
  Tt.addBinding(x, "As", {
    readonly: true,
    label: "As acero (m\xB2)",
    format: (n) => n.toExponential(3)
  });
  Tt.addBinding(x, "Ac", {
    readonly: true,
    label: "Ac concreto (m\xB2)",
    format: (n) => n.toExponential(3)
  });
  Tt.addBinding(x, "Pno_composite", {
    readonly: true,
    label: "Pno (kN)",
    format: (n) => n.toFixed(0)
  });
  Tt.addBinding(x, "demandCapPno", {
    readonly: true,
    label: "Pu/\u03C6Pno",
    format: Ct
  });
  const It = W.addFolder({
    title: "AISC \xA7J8 bearing concreto"
  });
  It.addBinding(x, "A1", {
    readonly: true,
    label: "A1 (m\xB2)",
    format: (n) => n.toFixed(4)
  });
  It.addBinding(x, "A2", {
    readonly: true,
    label: "A2 (m\xB2)",
    format: (n) => n.toFixed(4)
  });
  It.addBinding(x, "phiPp", {
    readonly: true,
    label: "\u03C6Pp (kN)",
    format: (n) => n.toFixed(0)
  });
  It.addBinding(x, "demandCapPp", {
    readonly: true,
    label: "Pu/\u03C6Pp",
    format: Ct
  });
  const se = W.addFolder({
    title: "DG-1 espesor placa"
  });
  se.addBinding(x, "m_cant", {
    readonly: true,
    label: "m cant (m)",
    format: (n) => n.toFixed(4)
  });
  se.addBinding(x, "t_req", {
    readonly: true,
    label: "t_req (mm)",
    format: (n) => (n * 1e3).toFixed(1)
  });
  se.addBinding(x, "demandCapT", {
    readonly: true,
    label: "t_req/t_act",
    format: Ct
  });
  const le = W.addFolder({
    title: "ACI \xA717 anclaje"
  });
  le.addBinding(x, "T_anchor", {
    readonly: true,
    label: "T (kN/perno)",
    format: (n) => n.toFixed(1)
  });
  le.addBinding(x, "phiNn", {
    readonly: true,
    label: "\u03C6Nn (kN)",
    format: (n) => n.toFixed(1)
  });
  le.addBinding(x, "demandCapAnchor", {
    readonly: true,
    label: "T/\u03C6Nn",
    format: Ct
  });
  const Qo = W.addFolder({
    title: "FEM"
  });
  Qo.addBinding(x, "vmMax", {
    readonly: true,
    label: "\u03C3 vM max acero (kN/m\xB2)",
    format: (n) => n.toExponential(3)
  });
  const no = W.addFolder({
    title: "Unidades",
    expanded: false
  }), ao = {
    stress: Ue.val,
    disp: Je.val
  };
  no.addBinding(ao, "stress", {
    options: {
      "kN/m\xB2": "kN/m\xB2",
      MPa: "MPa",
      "kgf/cm\xB2": "kgf/cm\xB2",
      ksi: "ksi"
    },
    label: "\u03C3"
  }).on("change", (n) => {
    Ue.val = n.value;
  });
  no.addBinding(ao, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm"
    },
    label: "u"
  }).on("change", (n) => {
    Je.val = n.value;
  });
  document.body.append(Z);
  i.derive(() => {
    const n = oo.val;
    Object.assign(x, n), W.refresh();
  });
  document.body.append(Xo(u), Y, Jo({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-cft/main.ts"
  }));
  setTimeout(() => Uo(), 200);
  function ce() {
    const n = document.getElementById("parameters");
    if (!n) return;
    const r = Math.round(Z.getBoundingClientRect().bottom) + 8;
    n.style.top = `${r}px`, n.style.bottom = "8px", n.style.maxHeight = `${Math.max(120, innerHeight - r - 8)}px`, n.style.overflowY = "auto";
  }
  new ResizeObserver(ce).observe(Z);
  addEventListener("resize", ce);
  function so(n) {
    const r = (v) => {
      var _a;
      const E = (_a = document.getElementById(v)) == null ? void 0 : _a.getBoundingClientRect();
      return E && E.width ? E : null;
    }, M = r("legend"), d = ((v) => v && v.height > 80 ? v : null)(r("settings")), c = d ? Math.min(n / 2, d.right + 8) : 0, f = M ? Math.max(c + 100, M.left - 8) : Math.max(c + 100, Z.getBoundingClientRect().left - 8);
    return [
      c,
      f
    ];
  }
  function lo() {
    var _a, _b, _c;
    const n = (_a = Y.__ctx) == null ? void 0 : _a.camera;
    if (!(n == null ? void 0 : n.isPerspectiveCamera)) return;
    const r = Y.clientWidth || innerWidth, M = Y.clientHeight || innerHeight, [d, c] = so(r);
    n.setViewOffset(r, M, r / 2 - (d + c) / 2, 0, r, M), n.updateProjectionMatrix(), (_c = (_b = Y.__ctx) == null ? void 0 : _b.render) == null ? void 0 : _c.call(_b);
  }
  function tn() {
    const n = Y.__ctx, r = n == null ? void 0 : n.camera, M = n == null ? void 0 : n.controls, d = ae.rawVal;
    if (!r || !M || !d.length) return;
    const c = [
      1 / 0,
      1 / 0,
      1 / 0
    ], f = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const z of d) for (let b = 0; b < 3; b++) c[b] = Math.min(c[b], z[b]), f[b] = Math.max(f[b], z[b]);
    const v = new ee((c[0] + f[0]) / 2, (c[1] + f[1]) / 2, (c[2] + f[2]) / 2), K = 0.5 * Math.hypot(f[0] - c[0], f[1] - c[1], f[2] - c[2]), E = Y.clientWidth || innerWidth, Q = Y.clientHeight || innerHeight, [bt, P] = so(E);
    if (r.up.set(0, 0, 1), r.isPerspectiveCamera) {
      const z = r.fov * Math.PI / 180, b = 2 * Math.atan(Math.tan(z / 2) * ((P - bt) / Q)), Mt = 1.1 * K / Math.sin(Math.min(z, b) / 2);
      r.position.copy(v.clone().addScaledVector(new ee(1.5, -1.5, 2).normalize(), Mt)), r.near = Mt / 100, r.far = Mt * 100;
    }
    M.target.copy(v), M.update(), lo();
  }
  addEventListener("resize", () => setTimeout(lo, 50));
  setTimeout(() => {
    var _a;
    if (ce(), innerWidth < 1300) {
      const n = document.querySelector("#settings .tp-rotv_b"), r = (_a = document.querySelector("#settings .tp-rotv")) == null ? void 0 : _a.classList.contains("tp-rotv-expanded");
      n && r && n.click();
    }
  }, 700);
  setTimeout(() => {
    tn();
    const n = window.__hekatanClip, r = window.__hekatanClipApply;
    n && r && (n.enableY = true, n.posY = 0, n.invertY = false, r());
  }, 1100);
});
