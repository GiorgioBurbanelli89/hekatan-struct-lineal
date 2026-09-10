import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as n, f as ht, a as xt, C as Wt, M as ft, E as Zt, L as Qt, V as Ut, d as te, B as ee, b as ke, D as Ee } from "./theme-Dxpmbnyd.js";
import { a as Te } from "./analyze-DgLgRmKg.js";
import { d as je, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Ge } from "./getViewer-pkkJffyc.js";
import { g as He } from "./getParameters-B8Grp1QS.js";
import { g as Se } from "./styles-C05ElwtU.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-DxjkL_3A.js";
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
  const vt = 2e8, bt = 0.3, oe = vt / (2 * (1 + bt)), se = 78, r = {
    B: {
      value: n.state(0.5),
      min: 0.25,
      max: 1.2,
      step: 0.02,
      label: "B placa (m, eje X)"
    },
    H: {
      value: n.state(0.5),
      min: 0.25,
      max: 1.2,
      step: 0.02,
      label: "H placa (m, eje Y)"
    },
    t_plate: {
      value: n.state(0.025),
      min: 0.012,
      max: 0.06,
      step: 2e-3,
      label: "Espesor placa (m)"
    },
    d_col: {
      value: n.state(0.3),
      min: 0.18,
      max: 0.5,
      step: 0.02,
      label: "d columna (m)"
    },
    bf_col: {
      value: n.state(0.25),
      min: 0.15,
      max: 0.4,
      step: 0.01,
      label: "bf columna (m)"
    },
    tf_col: {
      value: n.state(0.022),
      min: 0.012,
      max: 0.04,
      step: 2e-3,
      label: "tf pat\xEDn (m)"
    },
    tw_col: {
      value: n.state(0.014),
      min: 8e-3,
      max: 0.025,
      step: 1e-3,
      label: "tw alma (m)"
    },
    L_col: {
      value: n.state(0.5),
      min: 0.3,
      max: 1.5,
      step: 0.05,
      label: "L stub columna (m)"
    },
    nBoltsX: {
      value: n.state(2),
      min: 2,
      max: 6,
      step: 1,
      label: "Pernos en X (filas)"
    },
    nBoltsY: {
      value: n.state(2),
      min: 2,
      max: 6,
      step: 1,
      label: "Pernos en Y (columnas)"
    },
    sx: {
      value: n.state(0.07),
      min: 0.03,
      max: 0.25,
      step: 0.01,
      label: "sx \u2014 dist borde X (m)"
    },
    sy: {
      value: n.state(0.07),
      min: 0.03,
      max: 0.25,
      step: 0.01,
      label: "sy \u2014 dist borde Y (m)"
    },
    d_bolt: {
      value: n.state(0.024),
      min: 0.012,
      max: 0.05,
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
      max: 0.15,
      step: 5e-3,
      label: "L proyecci\xF3n sobre placa (m, tuerca)"
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
      label: "h pedestal (m, profundidad)"
    },
    fc: {
      value: n.state(28e3),
      min: 17e3,
      max: 5e4,
      step: 1e3,
      label: "f'c concreto (kN/m\xB2)"
    },
    Pu: {
      value: n.state(300),
      min: 0,
      max: 5e3,
      step: 25,
      label: "Pu compresi\xF3n (kN)"
    },
    Mu: {
      value: n.state(30),
      min: 0,
      max: 800,
      step: 5,
      label: "Mu momento (kN\xB7m)"
    },
    nx: {
      value: n.state(12),
      min: 6,
      max: 24,
      step: 2,
      label: "Mesh nx (placa)"
    },
    ny: {
      value: n.state(12),
      min: 6,
      max: 24,
      step: 2,
      label: "Mesh ny (placa)"
    }
  }, ae = n.state([]), ne = n.state([]), le = n.state({}), ce = n.state({}), re = n.state({}), ie = n.state({}), de = n.state([]), qe = 25e4, Oe = 6e5, pe = n.state({
    vmMax: 0,
    A1: 0,
    A2: 0,
    sqrtA2A1: 0,
    phiPp: 0,
    demandCapPp: 0,
    m_cantilever: 0,
    fp: 0,
    t_req: 0,
    t_actual: 0,
    demandCapT: 0,
    T_anchor: 0,
    phiNn: 0,
    demandCapAnchor: 0
  });
  n.derive(() => {
    const s = r.B.value.val, v = r.H.value.val, m = r.t_plate.value.val, P = r.d_col.value.val, B = r.bf_col.value.val, E = r.tf_col.value.val, ue = r.tw_col.value.val, D = r.L_col.value.val, p = r.d_bolt.value.val, X = r.L_bolt.value.val, A = r.L_proj.value.val, _t = r.B_ped.value.val, yt = r.H_ped.value.val, V = r.h_ped.value.val, gt = r.fc.value.val, J = r.sx.value.val, wt = r.sy.value.val, Pt = Math.max(2, Math.round(r.nBoltsX.value.val)), R = Math.max(2, Math.round(r.nBoltsY.value.val)), F = r.Pu.value.val, K = r.Mu.value.val, T = Math.round(r.nx.value.val), j = Math.round(r.ny.value.val), b = [], u = [], W = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), Q = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map(), tt = /* @__PURE__ */ new Map(), et = /* @__PURE__ */ new Map(), ot = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map(), at = /* @__PURE__ */ new Map();
    function _(t, e, a) {
      return b.push([
        t,
        e,
        a
      ]), b.length - 1;
    }
    function G(t, e, a, o, l) {
      u.push([
        t,
        e,
        a,
        o
      ]);
      const c = u.length - 1;
      W.set(c, l), Z.set(c, vt), Q.set(c, bt), U.set(c, se), tt.set(c, 0), ot.set(c, 0), et.set(c, 0), st.set(c, 0), at.set(c, oe);
    }
    function Bt(t, e, a, o, l) {
      u.push([
        t,
        e
      ]);
      const c = u.length - 1;
      Z.set(c, vt), at.set(c, oe), Q.set(c, bt), U.set(c, se), tt.set(c, a), ot.set(c, o), et.set(c, o), st.set(c, l), W.set(c, 0);
    }
    const he = s / T, xe = v / j, y = [];
    for (let t = 0; t <= j; t++) {
      const e = [], a = -v / 2 + t * xe;
      for (let o = 0; o <= T; o++) {
        const l = -s / 2 + o * he;
        e.push(_(l, a, 0));
      }
      y.push(e);
    }
    for (let t = 0; t < j; t++) for (let e = 0; e < T; e++) G(y[t][e], y[t][e + 1], y[t + 1][e + 1], y[t + 1][e], m);
    function H(t, e) {
      let a = -1, o = 1 / 0;
      for (let l = 0; l <= j; l++) for (let c = 0; c <= T; c++) {
        const z = y[l][c], [C, ut, O] = b[z], L = Math.hypot(C - t, ut - e);
        L < o && (o = L, a = z);
      }
      return a;
    }
    const i = 6, d = 4, I = 3, At = d / 2, nt = +P / 2 - E / 2, S = -P / 2 + E / 2, h = [];
    for (let t = 0; t <= i; t++) {
      const e = t / i * D + 0, a = [];
      for (let o = 0; o <= d; o++) {
        const l = -B / 2 + o * B / d;
        t === 0 ? a.push(H(nt, l)) : a.push(_(nt, l, e));
      }
      h.push(a);
    }
    for (let t = 0; t < i; t++) for (let e = 0; e < d; e++) G(h[t][e], h[t][e + 1], h[t + 1][e + 1], h[t + 1][e], E);
    const x = [];
    for (let t = 0; t <= i; t++) {
      const e = t / i * D, a = [];
      for (let o = 0; o <= d; o++) {
        const l = -B / 2 + o * B / d;
        t === 0 ? a.push(H(S, l)) : a.push(_(S, l, e));
      }
      x.push(a);
    }
    for (let t = 0; t < i; t++) for (let e = 0; e < d; e++) G(x[t][e], x[t][e + 1], x[t + 1][e + 1], x[t + 1][e], E);
    const g = [];
    for (let t = 0; t <= i; t++) {
      const e = t / i * D, a = [];
      for (let o = 0; o <= I; o++) {
        const l = S + o * (nt - S) / I;
        o === 0 ? a.push(x[t][At]) : o === I ? a.push(h[t][At]) : t === 0 ? a.push(H(l, 0)) : a.push(_(l, 0, e));
      }
      g.push(a);
    }
    for (let t = 0; t < i; t++) for (let e = 0; e < I; e++) G(g[t][e], g[t][e + 1], g[t + 1][e + 1], g[t + 1][e], ue);
    const Ft = Math.PI * p * p / 4, lt = Math.PI * Math.pow(p, 4) / 64, It = 2 * lt, Nt = -s / 2 + J, fe = +s / 2 - J, $t = -v / 2 + wt, ve = +v / 2 - wt, be = (fe - Nt) / (Pt - 1), Me = (ve - $t) / (R - 1), ct = [];
    for (let t = 0; t < Pt; t++) {
      const e = Nt + t * be;
      for (let a = 0; a < R; a++) {
        const o = $t + a * Me, l = Math.abs(e) < P / 2 + 5e-3, c = Math.abs(o) < B / 2 + 5e-3;
        l && c || ct.push([
          e,
          o
        ]);
      }
    }
    const zt = [];
    for (const [t, e] of ct) {
      const a = H(t, e), o = _(t, e, -X), l = _(t, e, A);
      zt.push(o), Bt(o, a, Ft, lt, It), Bt(a, l, Ft, lt, It);
    }
    const f = [], q = p * 1.5 / 2, Ct = p * 1.8 / 2, rt = 0.02, _e = new ht({
      color: 16746496
    }), ye = new ht({
      color: 16755200
    }), Lt = new xt({
      color: 16729088,
      linewidth: 3
    }), ge = new xt({
      color: 6706432,
      linewidth: 1
    });
    for (const [t, e] of ct) {
      const a = X + A, o = (-X + A) / 2, l = new Wt(p / 2, p / 2, a, 12), c = new ft(l, _e);
      c.position.set(t, e, o), c.rotation.x = Math.PI / 2, f.push(c);
      const z = new Wt(Ct, Ct, rt, 6), C = new ft(z, ye);
      C.position.set(t, e, A - rt / 2), C.rotation.x = Math.PI / 2, f.push(C);
      const ut = new Zt(z), O = new Qt(ut, ge);
      O.position.set(t, e, A - rt / 2), O.rotation.x = Math.PI / 2, f.push(O);
      const L = [];
      for (let M = 0; M <= 32; M++) {
        const k = M / 32 * 2 * Math.PI;
        L.push(new Ut(t + q * Math.cos(k), e + q * Math.sin(k), m / 2 + 5e-4));
      }
      f.push(new te(new ee().setFromPoints(L), Lt));
      const Kt = [];
      for (let M = 0; M <= 32; M++) {
        const k = M / 32 * 2 * Math.PI;
        Kt.push(new Ut(t + q * Math.cos(k), e + q * Math.sin(k), -m / 2 - 5e-4));
      }
      f.push(new te(new ee().setFromPoints(Kt), Lt));
    }
    const kt = new ke(_t, yt, V), we = new ht({
      color: 9079434,
      transparent: true,
      opacity: 0.35,
      side: Ee
    }), Et = new ft(kt, we);
    Et.position.set(0, 0, -V / 2), f.push(Et);
    const Pe = new Zt(kt), Tt = new Qt(Pe, new xt({
      color: 4473924,
      linewidth: 1
    }));
    Tt.position.set(0, 0, -V / 2), f.push(Tt), de.val = f;
    const jt = /* @__PURE__ */ new Map(), Be = [
      true,
      true,
      true,
      true,
      true,
      true
    ];
    for (const t of zt) jt.set(t, Be);
    const N = [];
    for (let t = 0; t <= d; t++) N.push(h[i][t]);
    for (let t = 0; t <= d; t++) N.push(x[i][t]);
    for (let t = 1; t < I; t++) N.push(g[i][t]);
    const w = /* @__PURE__ */ new Map(), Ae = -F / N.length;
    for (const t of N) w.set(t, [
      0,
      0,
      Ae,
      0,
      0,
      0
    ]);
    const Gt = K / P / (d + 1);
    for (let t = 0; t <= d; t++) {
      const e = h[i][t], a = x[i][t], o = w.get(e) || [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      w.set(e, [
        o[0],
        o[1],
        o[2] + Gt,
        o[3],
        o[4],
        o[5]
      ]);
      const l = w.get(a) || [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      w.set(a, [
        l[0],
        l[1],
        l[2] - Gt,
        l[3],
        l[4],
        l[5]
      ]);
    }
    const Ht = {
      supports: jt,
      loads: w
    }, it = {
      elasticities: Z,
      shearModuli: at,
      areas: tt,
      momentsOfInertiaY: et,
      momentsOfInertiaZ: ot,
      torsionalConstants: st,
      densities: U,
      poissonsRatios: Q,
      thicknesses: W
    };
    let dt = {}, pt = {};
    try {
      dt = je(b, u, Ht, it), pt = Te(b, u, it, dt), console.log(`Placa base H: ${b.length} nodos, ${u.length} elementos | Pu=${F}kN, Mu=${K}kN\xB7m | t_plate=${(m * 1e3).toFixed(0)}mm`);
    } catch (t) {
      console.warn("Placa base deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    let mt = 0;
    const St = pt == null ? void 0 : pt.vonMises;
    St && St.forEach((t) => t.forEach((e) => {
      e > mt && (mt = e);
    }));
    const Fe = 0.65, $ = s * v, qt = _t * yt, Ot = Math.min(2, Math.sqrt(qt / $)), Ie = 0.85 * gt * $ * Ot, Ne = Math.min(Ie, 1.7 * gt * $), Yt = Fe * Ne, $e = F / Math.max(1, Yt), Dt = Math.max(0, (s - 0.95 * P) / 2), Xt = F / $, Vt = Dt * Math.sqrt(2 * Math.max(0, Xt) / (0.9 * qe)), ze = Vt / Math.max(1e-6, m), Ce = Math.max(0.05, s - 2 * J), Jt = Math.max(0, K / Ce - F / 2) / Math.max(1, R), Rt = 0.75 * (0.75 * Math.PI / 4 * p * p) * Oe, Le = Jt / Math.max(1, Rt);
    pe.val = {
      vmMax: mt,
      A1: $,
      A2: qt,
      sqrtA2A1: Ot,
      phiPp: Yt,
      demandCapPp: $e,
      m_cantilever: Dt,
      fp: Xt,
      t_req: Vt,
      t_actual: m,
      demandCapT: ze,
      T_anchor: Jt,
      phiNn: Rt,
      demandCapAnchor: Le
    }, ae.val = b, ne.val = u, le.val = Ht, ce.val = it, re.val = dt, ie.val = pt;
  });
  const me = Ge({
    mesh: {
      nodes: ae,
      elements: ne,
      nodeInputs: le,
      elementInputs: ce,
      deformOutputs: re,
      analyzeOutputs: ie
    },
    objects3D: de,
    settingsObj: {
      deformedShape: true,
      shellResults: "vonMises",
      gridSize: 1,
      deformScale: 20,
      custom3D: true
    }
  }), Mt = document.createElement("div");
  Mt.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:340px;max-width:420px;";
  const Y = (s) => s < 1 ? `<span style="color:#7eff7e">${s.toFixed(2)} \u2713</span>` : s < 1.2 ? `<span style="color:#ffcc00">${s.toFixed(2)} \u26A0</span>` : `<span style="color:#ff5555">${s.toFixed(2)} \u2717</span>`;
  n.derive(() => {
    const s = pe.val, v = r.Pu.value.val, m = r.Mu.value.val;
    Mt.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">
      \u{1F9EA} BENCHMARK \u2014 placa-base-h (CBFEM)
    </div>
    <div style="font-size:10px;color:#aaa;margin-bottom:4px;">
      Demanda: Pu=${v}kN \xB7 Mu=${m}kN\xB7m
    </div>
    <table style="border-collapse:collapse;width:100%;font-size:10.5px;">
      <tr style="color:#aaa;border-bottom:1px solid #444;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">AISC 360-22 \xA7J8 (bearing concreto)</td>
      </tr>
      <tr><td>A\u2081 = B\xB7H (m\xB2)</td><td colspan="2" style="text-align:right;">${s.A1.toFixed(4)}</td></tr>
      <tr><td>A\u2082 = B_ped\xB7H_ped (m\xB2)</td><td colspan="2" style="text-align:right;">${s.A2.toFixed(4)}</td></tr>
      <tr><td>\u221A(A\u2082/A\u2081) (\u22642)</td><td colspan="2" style="text-align:right;">${s.sqrtA2A1.toFixed(3)}</td></tr>
      <tr><td>\u03C6Pp (kN)</td><td colspan="2" style="text-align:right;">${s.phiPp.toFixed(0)}</td></tr>
      <tr><td>Pu/\u03C6Pp</td><td colspan="2" style="text-align:right;">${Y(s.demandCapPp)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">DG-1 espesor placa</td>
      </tr>
      <tr><td>m cantilever (m)</td><td colspan="2" style="text-align:right;">${s.m_cantilever.toFixed(4)}</td></tr>
      <tr><td>fp = Pu/A\u2081 (kN/m\xB2)</td><td colspan="2" style="text-align:right;">${s.fp.toFixed(0)}</td></tr>
      <tr><td>t_req (mm)</td><td colspan="2" style="text-align:right;">${(s.t_req * 1e3).toFixed(1)}</td></tr>
      <tr><td>t actual (mm)</td><td colspan="2" style="text-align:right;">${(s.t_actual * 1e3).toFixed(1)}</td></tr>
      <tr><td>t_req/t_actual</td><td colspan="2" style="text-align:right;">${Y(s.demandCapT)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">ACI 318-22 \xA717 (anclaje F1554)</td>
      </tr>
      <tr><td>T anclaje (kN/perno)</td><td colspan="2" style="text-align:right;">${s.T_anchor.toFixed(1)}</td></tr>
      <tr><td>\u03C6Nn (kN/perno)</td><td colspan="2" style="text-align:right;">${s.phiNn.toFixed(1)}</td></tr>
      <tr><td>T/\u03C6Nn</td><td colspan="2" style="text-align:right;">${Y(s.demandCapAnchor)}</td></tr>
      <tr style="color:#aaa;border-top:1px solid #333;">
        <td colspan="3" style="padding:3px 0;font-weight:bold;color:#ffcc77;">FEM</td>
      </tr>
      <tr><td>\u03C3 vonMises max (kN/m\xB2)</td><td colspan="2" style="text-align:right;">${s.vmMax.toFixed(0)}</td></tr>
      <tr><td>vs Fy=250000</td><td colspan="2" style="text-align:right;">${Y(s.vmMax / 25e4)}</td></tr>
    </table>
  `;
  });
  document.body.append(Mt);
  document.body.append(He(r), me, Se({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/placa-base-h/main.ts"
  }));
  setTimeout(() => {
    var _a;
    const s = me.__ctx;
    (s == null ? void 0 : s.camera) && (s == null ? void 0 : s.controls) && (s.camera.up.set(0, 0, 1), s.camera.position.set(2, -2, 1.2), s.controls.target.set(0, 0, 0.25), s.controls.update(), (_a = s.render) == null ? void 0 : _a.call(s));
  }, 800);
});
