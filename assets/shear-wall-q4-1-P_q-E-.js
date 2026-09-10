import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-Dxpmbnyd.js";
import { a as U } from "./analyze-DgLgRmKg.js";
import { d as j, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as Q } from "./getViewer-Druzr40L.js";
import { g as q } from "./getParameters-BHL5hAP0.js";
import { g as V } from "./styles-Ce_UnsFA.js";
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
  const s = {
    W: {
      value: a.state(5),
      min: 1,
      max: 15,
      step: 0.5,
      label: "Ancho W (m)"
    },
    H: {
      value: a.state(3),
      min: 1,
      max: 12,
      step: 0.5,
      label: "Altura H (m)"
    },
    t: {
      value: a.state(0.2),
      min: 0.05,
      max: 0.6,
      step: 0.05,
      label: "Espesor t (m)"
    },
    nx: {
      value: a.state(8),
      min: 2,
      max: 24,
      step: 1,
      label: "Mesh nx"
    },
    ny: {
      value: a.state(6),
      min: 2,
      max: 24,
      step: 1,
      label: "Mesh ny"
    },
    E: {
      value: a.state(25e6),
      min: 1e7,
      max: 5e7,
      step: 1e6,
      label: "E (kN/m\xB2)"
    },
    nu: {
      value: a.state(0.2),
      min: 0,
      max: 0.49,
      step: 0.05,
      label: "\u03BD (Poisson)"
    },
    P: {
      value: a.state(100),
      min: 0,
      max: 1e3,
      step: 10,
      label: "Carga lateral total (kN)"
    }
  }, $ = a.state([]), T = a.state([]), _ = a.state({}), B = a.state({}), R = a.state({}), z = a.state({}), c = 4602e-8, u = 4629e-8, g = 4582e-8, N = a.state({
    ux_he: 0,
    errOS: 0,
    errSAP: 0,
    errETABS: 0
  });
  a.derive(() => {
    const o = s.W.value.val, i = s.H.value.val, f = s.t.value.val, l = Math.round(s.nx.value.val), p = Math.round(s.ny.value.val), E = s.E.value.val, S = s.nu.value.val, k = s.P.value.val, H = E / (2 * (1 + S)), C = o / l, F = i / p, d = [], n = [];
    for (let t = 0; t <= p; t++) for (let e = 0; e <= l; e++) d.push([
      e * C,
      0,
      t * F
    ]);
    const r = l + 1;
    for (let t = 0; t < p; t++) for (let e = 0; e < l; e++) n.push([
      t * r + e,
      t * r + e + 1,
      (t + 1) * r + e + 1,
      (t + 1) * r + e
    ]);
    const A = /* @__PURE__ */ new Map();
    for (let t = 0; t <= l; t++) A.set(t, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const v = [];
    for (let t = 0; t <= l; t++) v.push(p * r + t);
    const I = k / v.length, M = /* @__PURE__ */ new Map();
    for (const t of v) M.set(t, [
      I,
      0,
      0,
      0,
      0,
      0
    ]);
    const O = {
      supports: A,
      loads: M
    }, h = {
      elasticities: new Map(n.map((t, e) => [
        e,
        E
      ])),
      poissonsRatios: new Map(n.map((t, e) => [
        e,
        S
      ])),
      thicknesses: new Map(n.map((t, e) => [
        e,
        f
      ])),
      shearModuli: new Map(n.map((t, e) => [
        e,
        H
      ])),
      densities: new Map(n.map((t, e) => [
        e,
        24 / 9.80665
      ]))
    };
    let x = {}, P = {};
    try {
      x = j(d, n, O, h), P = U(d, n, h, x);
      const t = p * r + Math.floor(l / 2), e = x.deformations.get(t), w = e ? e[0] : 0, m = Math.abs(w), L = Math.abs(m - c) / c * 100, W = Math.abs(m - u) / u * 100, G = Math.abs(m - g) / g * 100;
      console.log(`Muro Q4: Ux=${w.toExponential(4)} m | OS:${c.toExponential(3)} | SAP:${u.toExponential(3)} | ETABS:${g.toExponential(3)}`), N.val = {
        ux_he: m,
        errOS: L,
        errSAP: W,
        errETABS: G
      };
    } catch (t) {
      console.warn("Muro Q4 deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    $.val = d, T.val = n, _.val = O, B.val = h, R.val = x, z.val = P;
  });
  const y = document.createElement("div");
  y.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:340px;max-width:420px;";
  const b = (o) => o < 0.5 ? `<span style="color:#7eff7e">\u2713 ${o.toFixed(2)}%</span>` : o < 5 ? `<span style="color:#ffcc00">\u26A0 ${o.toFixed(2)}%</span>` : `<span style="color:#ff5555">\u2717 ${o.toFixed(2)}%</span>`;
  a.derive(() => {
    const o = N.val, i = Math.max(o.errOS, o.errSAP, o.errETABS), f = i < 0.5 ? '<span style="color:#7eff7e">\u2713 TODOS PASAN</span>' : i < 5 ? '<span style="color:#ffcc00">\u26A0 ERROR ACEPTABLE (0.5-5%)</span>' : '<span style="color:#ff5555">\u2717 ALGUNO FALLA</span>';
    y.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">\u{1F9EA} BENCHMARK \u2014 shear-wall-q4</div>
    <div style="font-size:10px;color:#aaa;margin-bottom:4px;">Hekatan Q4 |Ux| top center = <b>${o.ux_he.toExponential(4)} m</b></div>
    <table style="border-collapse:collapse;width:100%;">
      <tr style="color:#999;border-bottom:1px solid #444;">
        <td style="padding:2px 6px 2px 0;">Ref. solver</td>
        <td style="padding:2px 6px;text-align:right;">Ux ref (m)</td>
        <td style="padding:2px 0;text-align:right;">\u0394%</td>
      </tr>
      <tr><td style="padding:1px 6px 1px 0;">OpenSees TCL</td>
          <td style="text-align:right;padding:1px 6px;">${c.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${b(o.errOS)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">SAP2000</td>
          <td style="text-align:right;padding:1px 6px;">${u.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${b(o.errSAP)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">ETABS</td>
          <td style="text-align:right;padding:1px 6px;">${g.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${b(o.errETABS)}</td></tr>
    </table>
    <div style="margin-top:6px;padding-top:4px;border-top:1px solid #444;">
      ${f}
      <div style="color:#888;font-size:10px;">Refs: H=3m, W=5m, t=20cm, E=25GPa, \u03BD=0.2, P=100kN</div>
    </div>
  `;
  });
  document.body.append(y);
  document.body.append(q(s), Q({
    mesh: {
      nodes: $,
      elements: T,
      nodeInputs: _,
      elementInputs: B,
      deformOutputs: R,
      analyzeOutputs: z
    },
    settingsObj: {
      deformedShape: true
    }
  }), V({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/shear-wall-q4/main.ts"
  }));
});
