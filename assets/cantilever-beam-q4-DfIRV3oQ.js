import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as a } from "./Text-C1TX4d8g.js";
import { a as j, __tla as __tla_0 } from "./analyze-B3N25dJu.js";
import { d as B, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as F, c as H, __tla as __tla_2 } from "./aiAgent-DNMetN0d.js";
import { g as V, __tla as __tla_3 } from "./getParameters-d-Bgmcvz.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  const r = {
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
  }, M = a.state([]), A = a.state([]), L = a.state({}), k = a.state({}), $ = a.state({}), S = a.state({}), O = a.state({
    uz_an: 0,
    uz_he: 0,
    ratio: 0,
    errPct: 0,
    I_beam: 0,
    sigma_max: 0
  });
  a.derive(() => {
    const n = r.L.value.val, s = r.h.value.val, m = r.t.value.val, o = Math.round(r.nx.value.val), l = Math.round(r.ny.value.val), c = r.E.value.val, u = r.nu.value.val, i = r.P.value.val, d = c / (2 * (1 + u)), C = n / o, N = s / l, g = [], p = [];
    for (let t = 0; t <= l; t++) for (let e = 0; e <= o; e++) g.push([
      e * C,
      0,
      t * N
    ]);
    const x = o + 1;
    for (let t = 0; t < l; t++) for (let e = 0; e < o; e++) p.push([
      t * x + e,
      t * x + e + 1,
      (t + 1) * x + e + 1,
      (t + 1) * x + e
    ]);
    const z = /* @__PURE__ */ new Map();
    for (let t = 0; t <= l; t++) z.set(t * x, [
      true,
      true,
      true,
      true,
      true,
      true
    ]);
    const E = Math.floor(l / 2) * x + o, w = /* @__PURE__ */ new Map();
    w.set(E, [
      0,
      0,
      -i,
      0,
      0,
      0
    ]);
    const P = {
      supports: z,
      loads: w
    }, h = {
      elasticities: new Map(p.map((t, e) => [
        e,
        c
      ])),
      poissonsRatios: new Map(p.map((t, e) => [
        e,
        u
      ])),
      thicknesses: new Map(p.map((t, e) => [
        e,
        m
      ])),
      shearModuli: new Map(p.map((t, e) => [
        e,
        d
      ])),
      densities: new Map(p.map((t, e) => [
        e,
        24 / 9.80665
      ]))
    };
    let v = {}, I = {};
    try {
      v = B(g, p, P, h), I = j(g, p, h, v);
      const t = v.deformations.get(E), e = t ? t[2] : 0, b = m * s * s * s / 12, y = i * n * n * n / (3 * c * b), f = Math.abs(e) / y, R = Math.abs(f - 1) * 100, T = i * n * (s / 2) / b;
      console.log(`Viga Q4: Uz_tip=${e.toExponential(4)} | Anal\xEDtico=${y.toExponential(4)} | ratio=${f.toFixed(4)}`), O.val = {
        uz_an: -y,
        uz_he: e,
        ratio: f,
        errPct: R,
        I_beam: b,
        sigma_max: T
      };
    } catch (t) {
      console.warn("Viga Q4 deform/analyze:", (t == null ? void 0 : t.message) ?? t);
    }
    M.val = g, A.val = p, L.val = P, k.val = h, $.val = v, S.val = I;
  });
  const _ = document.createElement("div");
  _.style.cssText = "position:fixed;top:8px;right:8px;background:rgba(20,20,20,0.94);color:#ddd;font:11px/1.4 ui-monospace,Menlo,monospace;padding:10px 14px;border-radius:6px;border:1px solid #444;z-index:9999;min-width:320px;max-width:400px;";
  a.derive(() => {
    const n = O.val, s = n.errPct < 1 ? '<span style="color:#7eff7e">\u2713 PASA (\u0394&lt;1%)</span>' : n.errPct < 5 ? '<span style="color:#ffcc00">\u26A0 ERROR ACEPTABLE (1-5%, shear locking)</span>' : '<span style="color:#ff5555">\u2717 FALLA (\u0394&gt;5%)</span>';
    _.innerHTML = `
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
      <div>\u0394 error = <b>${n.errPct.toFixed(2)}%</b> ${s}</div>
      <div style="color:#888;font-size:10px;">\u03B4 = P\xB7L\xB3/(3\xB7E\xB7I) (flexi\xF3n pura)</div>
    </div>
  `;
  });
  document.body.append(_);
  document.body.append(V(r), F({
    mesh: {
      nodes: M,
      elements: A,
      nodeInputs: L,
      elementInputs: k,
      deformOutputs: $,
      analyzeOutputs: S
    },
    settingsObj: {
      deformedShape: true
    }
  }), H({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/cantilever-beam-q4/main.ts"
  }));
  setTimeout(() => {
    var _a, _b, _c, _d, _e, _f, _g;
    const s = (_a = [
      ...document.body.querySelectorAll("*")
    ].find((d) => d.__ctx)) == null ? void 0 : _a.__ctx, m = M.val;
    if (!(s == null ? void 0 : s.camera) || !(m == null ? void 0 : m.length)) return;
    const o = m.map((d) => d[0]), l = m.map((d) => d[2]), c = (Math.min(...o) + Math.max(...o)) / 2, u = (Math.min(...l) + Math.max(...l)) / 2, i = Math.max(Math.max(...o) - Math.min(...o), Math.max(...l) - Math.min(...l), 1);
    (_b = s.camera.up) == null ? void 0 : _b.set(0, 0, 1), s.camera.position.set(c + 0.35 * i, -1.4 * i, u + 0.45 * i), (_d = (_c = s.controls) == null ? void 0 : _c.target) == null ? void 0 : _d.set(c, 0, u), (_f = (_e = s.controls) == null ? void 0 : _e.update) == null ? void 0 : _f.call(_e), (_g = s.render) == null ? void 0 : _g.call(s);
  }, 400);
});
