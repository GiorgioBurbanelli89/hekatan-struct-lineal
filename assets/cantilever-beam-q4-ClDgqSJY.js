import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./theme-U-6D_qyI.js";
import { a as B } from "./analyze-DgLgRmKg.js";
import { d as F, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as H } from "./getViewer-DbNzujUF.js";
import { g as T } from "./getParameters-CcvO4YbC.js";
import { g as V } from "./styles-SbI03m7S.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-CUW6lNkV.js";
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
  const o = {
    L: {
      value: a.state(6),
      min: 1,
      max: 20,
      step: 0.5,
      label: "Luz L (m)"
    },
    h: {
      value: a.state(0.5),
      min: 0.1,
      max: 2,
      step: 0.05,
      label: "Altura h (m)"
    },
    t: {
      value: a.state(0.2),
      min: 0.05,
      max: 0.6,
      step: 0.05,
      label: "Espesor t (m)"
    },
    nx: {
      value: a.state(12),
      min: 4,
      max: 30,
      step: 1,
      label: "Mesh nx"
    },
    ny: {
      value: a.state(4),
      min: 2,
      max: 12,
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
      label: "\u03BD"
    },
    P: {
      value: a.state(50),
      min: 0,
      max: 500,
      step: 10,
      label: "Carga punta (kN)"
    }
  }, P = a.state([]), I = a.state([]), k = a.state({}), A = a.state({}), L = a.state({}), $ = a.state({}), O = a.state({
    uz_an: 0,
    uz_he: 0,
    ratio: 0,
    errPct: 0,
    I_beam: 0,
    sigma_max: 0
  });
  a.derive(() => {
    const n = o.L.value.val, l = o.h.value.val, y = o.t.value.val, i = Math.round(o.nx.value.val), r = Math.round(o.ny.value.val), c = o.E.value.val, f = o.nu.value.val, x = o.P.value.val, S = c / (2 * (1 + f)), C = n / i, N = l / r, d = [], s = [];
    for (let t = 0; t <= r; t++) for (let e = 0; e <= i; e++) d.push([
      e * C,
      0,
      t * N
    ]);
    const p = i + 1;
    for (let t = 0; t < r; t++) for (let e = 0; e < i; e++) s.push([
      t * p + e,
      t * p + e + 1,
      (t + 1) * p + e + 1,
      (t + 1) * p + e
    ]);
    const M = /* @__PURE__ */ new Map();
    for (let t = 0; t <= r; t++) M.set(t * p, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const _ = Math.floor(r / 2) * p + i, E = /* @__PURE__ */ new Map();
    E.set(_, [
      0,
      0,
      -x,
      0,
      0,
      0
    ]);
    const z = {
      supports: M,
      loads: E
    }, u = {
      elasticities: new Map(s.map((t, e) => [
        e,
        c
      ])),
      poissonsRatios: new Map(s.map((t, e) => [
        e,
        f
      ])),
      thicknesses: new Map(s.map((t, e) => [
        e,
        y
      ])),
      shearModuli: new Map(s.map((t, e) => [
        e,
        S
      ])),
      densities: new Map(s.map((t, e) => [
        e,
        24 / 9.80665
      ]))
    };
    let m = {}, w = {};
    try {
      m = F(d, s, z, u), w = B(d, s, u, m);
      const t = m.deformations.get(_), e = t ? t[2] : 0, g = y * l * l * l / 12, v = x * n * n * n / (3 * c * g), h = Math.abs(e) / v, R = Math.abs(h - 1) * 100, j = x * n * (l / 2) / g;
      console.log(`Viga Q4: Uz_tip=${e.toExponential(4)} | Anal\xEDtico=${v.toExponential(4)} | ratio=${h.toFixed(4)}`), O.val = {
        uz_an: -v,
        uz_he: e,
        ratio: h,
        errPct: R,
        I_beam: g,
        sigma_max: j
      };
    } catch (t) {
      console.warn("Viga Q4 deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    P.val = d, I.val = s, k.val = z, A.val = u, L.val = m, $.val = w;
  });
  const b = document.createElement("div");
  b.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:320px;max-width:400px;";
  a.derive(() => {
    const n = O.val, l = n.errPct < 1 ? '<span style="color:#7eff7e">\u2713 PASA (\u0394&lt;1%)</span>' : n.errPct < 5 ? '<span style="color:#ffcc00">\u26A0 ERROR ACEPTABLE (1-5%, shear locking)</span>' : '<span style="color:#ff5555">\u2717 FALLA (\u0394&gt;5%)</span>';
    b.innerHTML = `
    <div style="font-weight:bold;color:#ffaa00;margin-bottom:6px;">\u{1F9EA} BENCHMARK \u2014 cantilever-beam-q4</div>
    <table style="border-collapse:collapse;width:100%;">
      <tr style="color:#999;border-bottom:1px solid #444;">
        <td style="padding:2px 6px 2px 0;">Magnitud</td>
        <td style="padding:2px 6px;text-align:right;">Euler-Bern.</td>
        <td style="padding:2px 0;text-align:right;">Hekatan Q4</td>
      </tr>
      <tr><td style="padding:1px 6px 1px 0;">u_z punta (m)</td>
          <td style="text-align:right;padding:1px 6px;">${n.uz_an.toExponential(3)}</td>
          <td style="text-align:right;padding:1px 0;">${n.uz_he.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">I = t\xB7h\xB3/12 (m\u2074)</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${n.I_beam.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">\u03C3_max = M\xB7c/I (kN/m\xB2)</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${n.sigma_max.toExponential(3)}</td></tr>
      <tr><td style="padding:1px 6px 1px 0;">ratio Hek/Anal</td>
          <td colspan="2" style="text-align:right;padding:1px 0;">${n.ratio.toFixed(4)}</td></tr>
    </table>
    <div style="margin-top:6px;padding-top:4px;border-top:1px solid #444;">
      <div>\u0394 error = <b>${n.errPct.toFixed(2)}%</b> ${l}</div>
      <div style="color:#888;font-size:10px;">\u03B4 = P\xB7L\xB3/(3\xB7E\xB7I) (flexi\xF3n pura)</div>
    </div>
  `;
  });
  document.body.append(b);
  document.body.append(T(o), H({
    mesh: {
      nodes: P,
      elements: I,
      nodeInputs: k,
      elementInputs: A,
      deformOutputs: L,
      analyzeOutputs: $
    },
    settingsObj: {
      deformedShape: true
    }
  }), V({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/cantilever-beam-q4/main.ts"
  }));
});
