import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as o } from "./theme-DQ--CgsI.js";
import { a as P } from "./analyze-DgLgRmKg.js";
import { d as T, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import { g as G } from "./getViewer-DmenpMnv.js";
import { g as V } from "./getParameters-DTL1yrut.js";
import { g as j } from "./styles-0iLl92Fx.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./Text-ERv22veQ.js";
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
  const i = {
    E_gpa: {
      value: o.state(200),
      min: 10,
      max: 400,
      step: 10,
      label: "E (GPa)"
    },
    A_cm2: {
      value: o.state(100),
      min: 10,
      max: 500,
      step: 10,
      label: "A (cm\xB2)"
    },
    L_m: {
      value: o.state(6),
      min: 1,
      max: 20,
      step: 0.5,
      label: "L total (m)"
    },
    F_kN: {
      value: o.state(100),
      min: 10,
      max: 1e3,
      step: 10,
      label: "F (kN)"
    },
    nElem: {
      value: o.state(3),
      min: 1,
      max: 10,
      step: 1,
      label: "Num elementos"
    }
  }, w = o.state([]), F = o.state([]), M = o.state({}), z = o.state({}), k = o.state({}), L = o.state({}), _ = document.createElement("div");
  _.style.cssText = "position:fixed;bottom:10px;left:10px;background:#1a1a2e;color:#eee;padding:16px 24px;border-radius:8px;font-family:monospace;font-size:14px;z-index:999;max-width:600px;line-height:1.6;box-shadow:0 4px 20px rgba(0,0,0,0.5);";
  o.derive(() => {
    const l = i.E_gpa.value.val * 1e6, n = i.A_cm2.value.val * 1e-4, m = i.L_m.value.val, r = i.F_kN.value.val, s = i.nElem.value.val, d = [], a = [], v = m / s;
    for (let t = 0; t <= s; t++) d.push([
      v * t,
      0,
      0
    ]);
    for (let t = 0; t < s; t++) a.push([
      t,
      t + 1
    ]);
    const E = {
      supports: /* @__PURE__ */ new Map([
        [
          0,
          [
            true,
            true,
            true,
            true,
            true,
            true
          ]
        ]
      ]),
      loads: /* @__PURE__ */ new Map([
        [
          s,
          [
            r,
            0,
            0,
            0,
            0,
            0
          ]
        ]
      ])
    }, g = n * n * 1e-3, $ = n * n * 1e-3, N = l / 2.6, O = g + $, u = {
      elasticities: new Map(a.map((t, e) => [
        e,
        l
      ])),
      areas: new Map(a.map((t, e) => [
        e,
        n
      ])),
      momentsOfInertiaY: new Map(a.map((t, e) => [
        e,
        g
      ])),
      momentsOfInertiaZ: new Map(a.map((t, e) => [
        e,
        $
      ])),
      shearModuli: new Map(a.map((t, e) => [
        e,
        N
      ])),
      torsionalConstants: new Map(a.map((t, e) => [
        e,
        O
      ]))
    }, p = T(d, a, E, u), R = P(d, a, u, p);
    w.val = d, F.val = a, M.val = E, z.val = u, k.val = p, L.val = R;
    const c = r * m / (l * n), S = l * n / (m / s), x = p.deformations;
    let f = 0;
    if (x) {
      const t = x.get(s);
      t && (f = t[0]);
    }
    const y = Math.abs(f - c), b = c !== 0 ? y / c * 100 : 0, A = p.reactions;
    let I = 0;
    if (A) {
      const t = A.get(0);
      t && (I = t[0]);
    }
    _.innerHTML = `
    <div style="color:#64b5f6;font-size:16px;font-weight:bold;margin-bottom:8px;">
      \u2550\u2550\u2550 VERIFICACION BARRA AXIAL \u2550\u2550\u2550
    </div>
    <div style="color:#aaa;">Datos:</div>
    <div>  E = ${l.toExponential(2)} kN/m\xB2  (${i.E_gpa.value.val} GPa)</div>
    <div>  A = ${n.toFixed(6)} m\xB2  (${i.A_cm2.value.val} cm\xB2)</div>
    <div>  L = ${m} m  (${s} elem \xD7 ${v.toFixed(2)} m)</div>
    <div>  F = ${r} kN</div>
    <br/>
    <div style="color:#aaa;">Rigidez por elemento:</div>
    <div>  k = EA/L = ${S.toFixed(2)} kN/m</div>
    <br/>
    <div style="color:#81c784;">Resultado analitico:</div>
    <div>  u = FL/(EA) = <b>${c.toExponential(6)}</b> m</div>
    <br/>
    <div style="color:#ffb74d;">Resultado FEM (awatif):</div>
    <div>  u = <b>${f.toExponential(6)}</b> m</div>
    <br/>
    <div style="color:${b < 0.01 ? "#4caf50" : "#f44336"};">
      Error: ${y.toExponential(3)} m  (${b.toFixed(6)}%)
      ${b < 0.01 ? " \u2713 EXACTO" : ""}
    </div>
    <div style="color:#aaa;margin-top:4px;">
      Reaccion nodo 0: R_x = ${I.toFixed(4)} kN  (debe ser -${r} kN)
    </div>
    <br/>
    <div style="color:#aaa;font-size:11px;">
      Desplazamientos todos los nodos:
    </div>
    ${Array.from({
      length: s + 1
    }, (t, e) => {
      const h = x == null ? void 0 : x.get(e), C = h ? h[0] : 0, D = r * v * e / (l * n);
      return `<div style="font-size:11px;">  nodo ${e}: u_x = ${C.toExponential(4)} m  (exacto: ${D.toExponential(4)})</div>`;
    }).join("")}
  `;
  });
  document.body.append(_);
  document.body.append(V(i), G({
    mesh: {
      nodes: w,
      elements: F,
      nodeInputs: M,
      elementInputs: z,
      deformOutputs: k,
      analyzeOutputs: L
    },
    settingsObj: {
      deformedShape: true,
      nodesIndexes: true
    }
  }), j({
    sourceCode: "#",
    author: "Verificacion K = EA/L [1,-1;-1,1]"
  }));
});
