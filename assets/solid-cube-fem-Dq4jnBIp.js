import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as s } from "./theme-U-6D_qyI.js";
import { P as De } from "./tweakpane-BXg6ZhiP.js";
import { h as Ue, __tla as __tla_0 } from "./h8-CxkkFRzA.js";
import { g as We, c as ye, d as Le, e as Fe } from "./getViewer-DiSKQ9Tr.js";
import { e as Ge } from "./makeDraggable-zx2br6Yh.js";
import { g as Ve } from "./getParameters-CcvO4YbC.js";
import { g as Ke } from "./styles-SbI03m7S.js";
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
  const u = {
    Lx_col: {
      value: s.state(0.4),
      min: 0.2,
      max: 0.8,
      step: 0.1,
      label: "Lx col (m)"
    },
    Ly_col: {
      value: s.state(0.4),
      min: 0.2,
      max: 0.8,
      step: 0.1,
      label: "Ly col (m)"
    },
    Lz: {
      value: s.state(3),
      min: 1.5,
      max: 6,
      step: 0.5,
      label: "Altura col Lz (m)"
    },
    W_beam: {
      value: s.state(0.2),
      min: 0.1,
      max: 0.4,
      step: 0.1,
      label: "W viga (m, ancho)"
    },
    H_beam: {
      value: s.state(0.5),
      min: 0.25,
      max: 1,
      step: 0.25,
      label: "H viga (m, peralte)"
    },
    L_beam: {
      value: s.state(1.5),
      min: 0.5,
      max: 3,
      step: 0.25,
      label: "L viga (m, voladizo)"
    },
    nx_col: {
      value: s.state(4),
      min: 2,
      max: 6,
      step: 2,
      label: "nx col"
    },
    ny_col: {
      value: s.state(4),
      min: 2,
      max: 6,
      step: 2,
      label: "ny col"
    },
    nz: {
      value: s.state(12),
      min: 6,
      max: 18,
      step: 2,
      label: "nz col"
    },
    ny_b: {
      value: s.state(6),
      min: 2,
      max: 12,
      step: 1,
      label: "ny viga"
    },
    E: {
      value: s.state(25e6),
      min: 15e6,
      max: 4e7,
      step: 1e6,
      label: "E concreto (kN/m\xB2)"
    },
    nu: {
      value: s.state(0.2),
      min: 0,
      max: 0.3,
      step: 0.01,
      label: "\u03BD concreto"
    },
    P_tip: {
      value: s.state(-30),
      min: -200,
      max: 200,
      step: 10,
      label: "P tip viga (kN, vertical)"
    }
  }, Se = s.state([]), Te = s.state([]), He = s.state({}), Ce = s.state({}), Oe = s.state({}), se = s.state({}), qe = s.state([]), W = s.state("vonMises"), Ae = s.state({}), Ie = s.state([]), ze = s.state({
    P: 0,
    L_beam: 0,
    I_beam: 0,
    delta_EB: 0,
    delta_shear: 0,
    delta_col: 0,
    delta_total_an: 0,
    delta_he: 0,
    errEBpct: 0,
    errTotalPct: 0,
    elapsed: 0
  });
  s.derive(() => {
    const a = u.Lx_col.value.val, M = u.Ly_col.value.val, w = u.Lz.value.val, P = u.W_beam.value.val, N = u.H_beam.value.val, p = u.L_beam.value.val, C = Math.round(u.nx_col.value.val), J = Math.round(u.ny_col.value.val), O = Math.round(u.nz.value.val), Q = Math.round(u.ny_b.value.val), B = u.E.value.val, Z = u.nu.value.val, A = u.P_tip.value.val, y = [], re = /* @__PURE__ */ new Map(), I = [], ee = 4;
    function k(e, t, o) {
      const l = `${e.toFixed(ee)},${t.toFixed(ee)},${o.toFixed(ee)}`;
      let c = re.get(l);
      return c === void 0 && (y.push([
        e,
        t,
        o
      ]), c = y.length - 1, re.set(l, c)), c;
    }
    function de(e, t, o, l, c, b, i, g, d) {
      const r = (l - e) / i, v = (c - t) / g, x = (b - o) / d;
      for (let m = 0; m < d; m++) for (let _ = 0; _ < g; _++) for (let f = 0; f < i; f++) I.push([
        k(e + f * r, t + _ * v, o + m * x),
        k(e + (f + 1) * r, t + _ * v, o + m * x),
        k(e + (f + 1) * r, t + (_ + 1) * v, o + m * x),
        k(e + f * r, t + (_ + 1) * v, o + m * x),
        k(e + f * r, t + _ * v, o + (m + 1) * x),
        k(e + (f + 1) * r, t + _ * v, o + (m + 1) * x),
        k(e + (f + 1) * r, t + (_ + 1) * v, o + (m + 1) * x),
        k(e + f * r, t + (_ + 1) * v, o + (m + 1) * x)
      ]);
    }
    const me = a / C, te = w / O;
    let z = Math.max(2, Math.round(P / me));
    C - z & 1 && (z = Math.max(2, z - 1));
    let R = Math.max(2, Math.round(N / te));
    R & 1 && (R = Math.max(2, R - 1));
    const j = z * me, F = R * te, ue = Math.round(O / 2) * te, pe = ue - F / 2, ve = ue + F / 2, _e = -a / 2, fe = a / 2, he = -M / 2, X = M / 2;
    de(_e, he, 0, fe, X, w, C, J, O);
    const be = -j / 2, ge = j / 2, Ne = X, Me = X + p;
    de(be, Ne, pe, ge, Me, ve, z, Q, R);
    const ae = /* @__PURE__ */ new Map();
    y.forEach((e, t) => {
      e[0] >= _e - 1e-6 && e[0] <= fe + 1e-6 && e[1] >= he - 1e-6 && e[1] <= X + 1e-6 && (Math.abs(e[2]) < 1e-6 || Math.abs(e[2] - w) < 1e-6) && ae.set(t, [
        true,
        true,
        true
      ]);
    });
    const L = [];
    y.forEach((e, t) => {
      Math.abs(e[1] - Me) < 1e-6 && e[0] >= be - 1e-6 && e[0] <= ge + 1e-6 && e[2] >= pe - 1e-6 && e[2] <= ve + 1e-6 && L.push(t);
    });
    const xe = /* @__PURE__ */ new Map(), Ee = L.length > 0 ? A / L.length : 0;
    for (const e of L) xe.set(e, [
      0,
      0,
      Ee
    ]);
    const we = y.length;
    console.log(`Col+Viga H8: ${we} nodos \xD7 3 DOF = ${3 * we} DOFs, ${I.length} elementos`);
    let h, $ = null;
    try {
      h = Ue({
        nodes: y,
        elements: I,
        E: B,
        nu: Z,
        supports: ae,
        loads: xe
      }), console.log(`H8 resuelto en ${h.elapsedMs.toFixed(0)} ms`);
    } catch (e) {
      $ = (e == null ? void 0 : e.message) ?? String(e), console.warn("H8 solver:", $), h = null;
    }
    const Ze = y.map((e) => [
      e[0],
      e[1],
      e[2]
    ]), D = [], E = {
      elasticities: /* @__PURE__ */ new Map(),
      poissonsRatios: /* @__PURE__ */ new Map(),
      thicknesses: /* @__PURE__ */ new Map(),
      shearModuli: /* @__PURE__ */ new Map(),
      densities: /* @__PURE__ */ new Map(),
      areas: /* @__PURE__ */ new Map(),
      momentsOfInertiaZ: /* @__PURE__ */ new Map(),
      momentsOfInertiaY: /* @__PURE__ */ new Map(),
      torsionalConstants: /* @__PURE__ */ new Map()
    }, oe = /* @__PURE__ */ new Map();
    function je(e) {
      return [
        ...e
      ].sort((t, o) => t - o).join(",");
    }
    function S(e, t, o, l) {
      const c = je([
        e,
        t,
        o,
        l
      ]), b = oe.get(c);
      b ? b.count += 1 : oe.set(c, {
        face: [
          e,
          t,
          o,
          l
        ],
        count: 1
      });
    }
    for (const e of I) {
      const [t, o, l, c, b, i, g, d] = e;
      S(t, o, l, c), S(b, i, g, d), S(t, o, i, b), S(c, l, g, d), S(t, c, d, b), S(o, l, g, i);
    }
    function Xe(e) {
      D.push(e);
      const t = D.length - 1;
      E.elasticities.set(t, B), E.poissonsRatios.set(t, Z), E.thicknesses.set(t, 1e-3), E.shearModuli.set(t, B / (2 * (1 + Z))), E.densities.set(t, 24 / 9.80665), E.areas.set(t, 0), E.momentsOfInertiaZ.set(t, 0), E.momentsOfInertiaY.set(t, 0), E.torsionalConstants.set(t, 0);
    }
    for (const { face: e, count: t } of oe.values()) t === 1 && Xe(e);
    const Pe = {
      deformations: /* @__PURE__ */ new Map()
    };
    h && h.displacements.forEach(([e, t, o], l) => {
      Pe.deformations.set(l, [
        e,
        t,
        o,
        0,
        0,
        0
      ]);
    });
    const Y = {
      vonMises: /* @__PURE__ */ new Map(),
      sigmaXX: /* @__PURE__ */ new Map(),
      sigmaYY: /* @__PURE__ */ new Map(),
      sigmaZZ: /* @__PURE__ */ new Map(),
      tauXY: /* @__PURE__ */ new Map(),
      tauYZ: /* @__PURE__ */ new Map(),
      tauXZ: /* @__PURE__ */ new Map(),
      ux: /* @__PURE__ */ new Map(),
      uy: /* @__PURE__ */ new Map(),
      uz: /* @__PURE__ */ new Map()
    };
    if (h) {
      const e = {
        vonMises: /* @__PURE__ */ new Map(),
        sigmaXX: /* @__PURE__ */ new Map(),
        sigmaYY: /* @__PURE__ */ new Map(),
        sigmaZZ: /* @__PURE__ */ new Map(),
        tauXY: /* @__PURE__ */ new Map(),
        tauYZ: /* @__PURE__ */ new Map(),
        tauXZ: /* @__PURE__ */ new Map()
      };
      I.forEach((t, o) => {
        const l = h.vonMisesPerElement.get(o) || [], c = h.stressPerElement.get(o) || [], b = l.reduce((d, r) => d + r, 0) / Math.max(1, l.length), i = [
          0,
          0,
          0,
          0,
          0,
          0
        ];
        for (const d of c) for (let r = 0; r < 6; r++) i[r] += d[r];
        for (let d = 0; d < 6; d++) i[d] /= Math.max(1, c.length);
        const g = {
          vonMises: b,
          sigmaXX: i[0],
          sigmaYY: i[1],
          sigmaZZ: i[2],
          tauXY: i[3],
          tauYZ: i[4],
          tauXZ: i[5]
        };
        for (const d of t) for (const r of Object.keys(e)) {
          const v = e[r].get(d) || {
            sum: 0,
            count: 0
          };
          v.sum += g[r], v.count += 1, e[r].set(d, v);
        }
      });
      for (const t of Object.keys(e)) e[t].forEach((o, l) => {
        Y[t].set(l, o.sum / Math.max(1, o.count));
      });
      h.displacements.forEach(([t, o, l], c) => {
        Y.ux.set(c, t), Y.uy.set(c, o), Y.uz.set(c, l);
      });
    }
    Ae.val = Y, Ie.val = D;
    const Be = /* @__PURE__ */ new Map();
    ae.forEach((e, t) => Be.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]));
    const ke = /* @__PURE__ */ new Map();
    for (const e of L) ke.set(e, [
      0,
      0,
      Ee,
      0,
      0,
      0
    ]);
    if (h) {
      let e = 0, t = 0;
      for (const $e of L) {
        const U = h.displacements.get($e);
        U && (t += U[2], Math.abs(U[2]) > Math.abs(e) && (e = U[2]));
      }
      t /= Math.max(1, L.length);
      const o = j * F * F * F / 12, l = j * F, c = B / (2 * (1 + Z)), b = 5 / 6, i = A * p * p * p / (3 * B * o), g = A * p / (b * c * l), d = a * M * M * M / 12, x = A * p * w / (16 * B * d) * p, m = i + g + x, _ = Math.abs(t - i) / Math.abs(i || 1) * 100, f = Math.abs(t - m) / Math.abs(m || 1) * 100;
      console.log("  \u2500\u2500\u2500 BENCHMARK col+viga H8 \u2500\u2500\u2500"), console.log(`  \u03B4 E-B puro (rigid wall) = ${i.toExponential(4)} m`), console.log(`  \u03B4 + Timoshenko shear   = ${(i + g).toExponential(4)} m`), console.log(`  \u03B4 + col flex (joint)   = ${m.toExponential(4)} m`), console.log(`  \u03B4 Hekatan H8 (medido)  = ${t.toExponential(4)} m`), console.log(`  \u0394 vs E-B puro = ${_.toFixed(2)}% (esperado 20-40% extra)`), console.log(`  \u0394 vs total anal\xEDtico = ${f.toFixed(2)}% (esperado <15%)`), ze.val = {
        P: A,
        L_beam: p,
        I_beam: o,
        delta_EB: i,
        delta_shear: g,
        delta_col: x,
        delta_total_an: m,
        delta_he: t,
        errEBpct: _,
        errTotalPct: f,
        elapsed: h.elapsedMs
      };
    }
    $ && console.error("Solver H8 fall\xF3:", $), Se.val = Ze, Te.val = D, He.val = {
      supports: Be,
      loads: ke
    }, Ce.val = E, Oe.val = Pe;
  });
  s.derive(() => {
    const a = Ae.val, M = Ie.val, w = W.val, P = a[w];
    if (!P || P.size === 0 || M.length === 0) {
      se.val = {};
      return;
    }
    const N = /* @__PURE__ */ new Map();
    M.forEach((p, C) => {
      const J = P.get(p[0]) ?? 0, O = P.get(p[1]) ?? 0, Q = P.get(p[2]) ?? 0, B = P.get(p[3]) ?? 0;
      N.set(C, [
        J,
        O,
        Q,
        B
      ]);
    }), se.val = {
      vonMises: N
    };
  });
  const ne = We({
    mesh: {
      nodes: Se,
      elements: Te,
      nodeInputs: He,
      elementInputs: Ce,
      deformOutputs: Oe,
      analyzeOutputs: se
    },
    objects3D: qe,
    settingsObj: {
      deformedShape: true,
      shellResults: "none",
      solidResults: "vonMises",
      gridSize: 4,
      deformScale: 100,
      loads: true,
      supports: true,
      displayScale: 0.4
    }
  });
  setTimeout(() => {
    const a = ne.__settings;
    (a == null ? void 0 : a.solidResults) && (W.val = a.solidResults.val !== "none" ? a.solidResults.val : "vonMises", a.solidResults.val === "none" ? a.shellResults.val = "none" : a.shellResults.val = "vonMises", s.derive(() => {
      const M = a.solidResults.val;
      if (M === "none") a.shellResults.val = "none";
      else {
        a.shellResults.val = "vonMises";
        const w = M;
        w !== W.val && (W.val = w);
      }
    }));
  }, 100);
  const le = document.createElement("div");
  le.style.cssText = `
  position: fixed; top: 8px; right: 8px;
  width: 280px; max-height: 85vh; overflow-y: auto;
  z-index: 9999;
`;
  const T = new De({
    title: "\u{1F9EA} Benchmark \u2014 col+viga H8",
    container: le,
    expanded: true
  }), n = {
    delta_EB: 0,
    delta_shear: 0,
    delta_col: 0,
    delta_total_an: 0,
    delta_he: 0,
    errTotalPct: 0,
    errEBpct: 0,
    status: "\u2014",
    I_beam: 0,
    L_beam: 0,
    P: 0,
    elapsed: 0
  }, H = (a) => a.toExponential(3), Re = (a) => a.toFixed(2), Ye = (a) => a.toFixed(2), G = T.addFolder({
    title: "Anal\xEDtico (E-B + Timoshenko + col flex)"
  });
  G.addBinding(n, "delta_EB", {
    readonly: true,
    label: "\u03B4 E-B (m)",
    format: H
  });
  G.addBinding(n, "delta_shear", {
    readonly: true,
    label: "\u03B4 Timoshenko (m)",
    format: H
  });
  G.addBinding(n, "delta_col", {
    readonly: true,
    label: "\u03B4 col joint (m)",
    format: H
  });
  G.addBinding(n, "delta_total_an", {
    readonly: true,
    label: "\u03B4 TOTAL (m)",
    format: H
  });
  const V = T.addFolder({
    title: "Hekatan H8 (medido)"
  });
  V.addBinding(n, "delta_he", {
    readonly: true,
    label: "\u03B4 tip (m)",
    format: H
  });
  V.addBinding(n, "errTotalPct", {
    readonly: true,
    label: "\u0394 vs total (%)",
    format: Re
  });
  V.addBinding(n, "errEBpct", {
    readonly: true,
    label: "\u0394 vs E-B (%)",
    format: Re
  });
  V.addBinding(n, "status", {
    readonly: true,
    label: "Status"
  });
  const K = T.addFolder({
    title: "Par\xE1metros / runtime",
    expanded: false
  });
  K.addBinding(n, "I_beam", {
    readonly: true,
    label: "I_beam (m\u2074)",
    format: H
  });
  K.addBinding(n, "L_beam", {
    readonly: true,
    label: "L_beam (m)",
    format: Ye
  });
  K.addBinding(n, "P", {
    readonly: true,
    label: "P tip (kN)",
    format: Ye
  });
  K.addBinding(n, "elapsed", {
    readonly: true,
    label: "Solve (ms)",
    format: (a) => a.toFixed(0)
  });
  const ce = T.addFolder({
    title: "Unidades color map",
    expanded: true
  }), ie = {
    stress: Fe.val,
    disp: Le.val,
    force: ye.val
  };
  ce.addBinding(ie, "stress", {
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
    label: "Tensi\xF3n \u03C3/\u03C4"
  }).on("change", (a) => {
    Fe.val = a.value;
  });
  ce.addBinding(ie, "disp", {
    options: {
      m: "m",
      cm: "cm",
      mm: "mm",
      \u00B5m: "\xB5m"
    },
    label: "Desplazamiento u"
  }).on("change", (a) => {
    Le.val = a.value;
  });
  ce.addBinding(ie, "force", {
    options: {
      kN: "kN",
      tonf: "tonf",
      kip: "kip"
    },
    label: "Fuerza (shells)"
  }).on("change", (a) => {
    ye.val = a.value;
  });
  const Je = T.addFolder({
    title: "Pendientes",
    expanded: false
  }), q = document.createElement("div");
  q.style.cssText = "font:10.5px ui-monospace,monospace;color:#aaa;padding:6px 8px;line-height:1.5;";
  q.textContent = `\xB7 Patch test (constant strain)
\xB7 MacNeal-Harder warped beam
\xB7 Cook's membrane / Pinched cylinder
\xB7 vs CalculiX, Code Aster, FEniCS, SAP2000`;
  q.style.whiteSpace = "pre-line";
  Je.element.appendChild(q);
  document.body.append(le);
  s.derive(() => {
    const a = ze.val;
    n.delta_EB = a.delta_EB, n.delta_shear = a.delta_shear, n.delta_col = a.delta_col, n.delta_total_an = a.delta_total_an, n.delta_he = a.delta_he, n.errTotalPct = a.errTotalPct, n.errEBpct = a.errEBpct, n.status = a.errTotalPct < 5 ? "\u2713 PASA (<5%)" : a.errTotalPct < 15 ? "\u26A0 ACEPTABLE (5-15%)" : "\u2717 revisar (>15%)", n.I_beam = a.I_beam, n.L_beam = a.L_beam, n.P = a.P, n.elapsed = a.elapsed, T.refresh();
  });
  document.body.append(Ve(u), ne, Ke({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/solid-cube-fem/main.ts"
  }));
  setTimeout(() => Ge(), 200);
  setTimeout(() => {
    var _a;
    const a = ne.__ctx;
    (a == null ? void 0 : a.camera) && (a == null ? void 0 : a.controls) && (a.camera.up.set(0, 0, 1), a.camera.position.set(3.5, 3.5, 2.5), a.controls.target.set(0, 1, 1.5), a.controls.update(), (_a = a.render) == null ? void 0 : _a.call(a));
  }, 800);
});
