import { M as ne, m as H } from "./modeScale-DSJIAfp5.js";
import { v as i } from "./Text-Br8EG2up.js";
const ae = 4.4;
function fe(t) {
  const { mesh: e, viewerElm: _, onStatusChange: X } = t, L = t.scalePercent ?? ne, [Y, Z] = t.visFrequencyRange ?? [0.5, 3];
  let n = null, l = 0, c = 0, p = [], M = [], w = null;
  function C() {
    var _a;
    return _.__settings ?? ((_a = _.__ctx) == null ? void 0 : _a.settings);
  }
  function q() {
    X == null ? void 0 : X();
  }
  function ee() {
    var _a;
    if (!n || !n.frequencies || n.frequencies.length === 0) return { mode: "Sin resultados", frequency: "\u2014", period: "\u2014", dominant: "\u2014", state: "\u23F8 Detenido" };
    const a = n.frequencies[l] ?? 0, o = a > 0 ? 1 / a : 0, r = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], d = (_a = n.massParticipation) == null ? void 0 : _a[l];
    let g = "\u2014";
    if (d) {
      let f = 0, S = 0;
      for (let h = 0; h < 6; h++) Math.abs(d[h]) > f && (f = Math.abs(d[h]), S = h);
      g = `${r[S]} (${(f * 100).toFixed(0)}%)`;
    }
    return { mode: `Modo ${l + 1} / ${n.frequencies.length}`, frequency: `${a.toFixed(4)} Hz`, period: `${o.toFixed(4)} s`, dominant: g, state: c !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado" };
  }
  function E() {
    return _.__ctx;
  }
  function N(a) {
    return a.length > 0 && a.length === e.nodes.rawVal.length;
  }
  function y(a) {
    var _a;
    if (c && (cancelAnimationFrame(c), c = 0), a) {
      const o = C();
      (o == null ? void 0 : o.deformedShape) && w !== null && (o.deformedShape.val = w, w = null);
      const r = N(p) ? p : N(M) ? M : [];
      r.length > 0 ? (e.nodes.val = r.map((d) => [...d]), (_a = E()) == null ? void 0 : _a.render()) : (p = [], M = []);
    }
  }
  function B() {
    var _a, _b;
    if (!n || !n.modeShapes || n.modeShapes.length === 0 || !n.modeShapes[l]) return;
    y(false);
    const a = C();
    (a == null ? void 0 : a.deformedShape) && (w === null && (w = a.deformedShape.val), a.deformedShape.val = false);
    const o = n.modeShapes[l], r = ((_a = n.frequencies) == null ? void 0 : _a[l]) || 1, d = ((_b = n.frequencies) == null ? void 0 : _b[0]) || 1, g = t.velocidadPorFrecuencia ? Math.max(Y, Math.min(Z, r / d)) : 1 / (t.periodoVisible ?? ae);
    N(p) || (p = e.nodes.rawVal.map((m) => [...m])), M = p.map((m) => [...m]);
    const f = M.length, S = Math.floor(o.length / 6);
    if (S !== f) {
      console.warn(`[animateMode] el modo es de otra malla: ${S} nudos contra ${f} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
      return;
    }
    const h = H(M);
    let I = 0;
    for (let m = 0; m < f; m++) {
      const A = o[m * 6] || 0, F = o[m * 6 + 1] || 0, P = o[m * 6 + 2] || 0, v = Math.sqrt(A * A + F * F + P * P);
      v > I && (I = v);
    }
    const s = I > 1e-12 ? h * L / 100 / I : 1, U = performance.now(), T = f > 4e3 ? 100 : f > 1500 ? 66 : 0;
    let b = -1 / 0;
    const x = () => {
      var _a2;
      const m = performance.now();
      if (m - b < T) {
        c = requestAnimationFrame(x);
        return;
      }
      b = m;
      const A = (m - U) / 1e3, F = Math.sin(2 * Math.PI * g * A) * s, P = new Array(f);
      for (let v = 0; v < f; v++) {
        const R = M[v];
        P[v] = [R[0] + (o[v * 6] || 0) * F, R[1] + (o[v * 6 + 1] || 0) * F, R[2] + (o[v * 6 + 2] || 0) * F];
      }
      e.nodes.val = P, (_a2 = E()) == null ? void 0 : _a2.render(), c = requestAnimationFrame(x);
    };
    c = requestAnimationFrame(x), q();
  }
  function te(a) {
    var _a, _b;
    if (!n || !n.modeShapes || !n.modeShapes[a]) return;
    y(false);
    const o = C();
    (o == null ? void 0 : o.deformedShape) && (w === null && (w = o.deformedShape.val), o.deformedShape.val = false), l = Math.max(0, Math.min((((_a = n.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, a));
    const r = n.modeShapes[l];
    N(p) || (p = e.nodes.rawVal.map((s) => [...s]));
    const d = p.map((s) => [...s]), g = d.length;
    if (Math.floor(r.length / 6) !== g) {
      console.warn(`[animateMode] el modo estatico es de otra malla: ${Math.floor(r.length / 6)} nudos contra ${g} en pantalla. No lo dibujo.`);
      return;
    }
    const f = H(d);
    let S = 0;
    for (let s = 0; s < g; s++) {
      const U = r[s * 6] || 0, T = r[s * 6 + 1] || 0, b = r[s * 6 + 2] || 0, x = Math.sqrt(U * U + T * T + b * b);
      x > S && (S = x);
    }
    const h = S > 1e-12 ? f * L / 100 / S : 1, I = new Array(g);
    for (let s = 0; s < g; s++) {
      const U = d[s];
      I[s] = [U[0] + (r[s * 6] || 0) * h, U[1] + (r[s * 6 + 1] || 0) * h, U[2] + (r[s * 6 + 2] || 0) * h];
    }
    e.nodes.val = I, (_b = E()) == null ? void 0 : _b.render(), q();
  }
  return { setResults(a) {
    var _a;
    n = a, l >= (((_a = a == null ? void 0 : a.frequencies) == null ? void 0 : _a.length) ?? 0) && (l = 0), p = e.nodes.rawVal.map((o) => [...o]), q();
  }, setMode(a) {
    var _a;
    if (!n) return;
    const o = ((_a = n.frequencies) == null ? void 0 : _a.length) ?? 0;
    l = Math.max(0, Math.min(o - 1, a)), c !== 0 ? B() : q();
  }, showStatic(a) {
    te(a);
  }, play() {
    n && c === 0 && B();
  }, stop() {
    y(true), q();
  }, isPlaying() {
    return c !== 0;
  }, pause() {
    c && (cancelAnimationFrame(c), c = 0), q();
  }, modeCount() {
    var _a;
    return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a.length) ?? 0;
  }, currentMode() {
    return l;
  }, currentFreq() {
    var _a;
    return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a[l]) ?? 0;
  }, getStatus() {
    return ee();
  }, dispose() {
    y(true), n = null;
  } };
}
const u = i.state(localStorage.getItem("hk_forceUnit") || "tonf"), k = i.state(localStorage.getItem("hk_dispUnit") || "mm");
i.derive(() => {
  localStorage.setItem("hk_forceUnit", u.val), window.__hekatanForceUnit = u.val;
});
i.derive(() => {
  localStorage.setItem("hk_dispUnit", k.val), window.__hekatanDispUnit = k.val;
});
const V = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
function me(t, e) {
  return t * V[u.val];
}
function oe(t, e) {
  return t / V[e ?? u.val];
}
function se(t) {
  return 1 / Q[D.val];
}
function J(t, e) {
  return V[u.val] * se();
}
function ue(t, e) {
  return t * J();
}
function re(t, e) {
  return t / J();
}
const Q = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };
function ie(t, e) {
  return t * Q[e ?? k.val];
}
function de(t, e = 2) {
  const _ = k.val;
  return `${ie(t, _).toFixed(e)} ${_}`;
}
function he(t, e = 2) {
  const _ = u.val;
  return `${oe(t, _).toFixed(e)} ${_}`;
}
function pe(t, e = 2) {
  return `${re(t).toFixed(e)} ${W()}`;
}
function W() {
  return `${u.val}\xB7${D.val}`;
}
function ge() {
  return `(${u.val})`;
}
function Se() {
  return `(${W()})`;
}
function ve() {
  return `(${k.val})`;
}
function _e(t) {
  return t.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
}
const $ = i.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
i.derive(() => {
  localStorage.setItem("hk_stressUnit", $.val), window.__hekatanStressUnit = $.val;
});
const K = i.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
i.derive(() => {
  localStorage.setItem("hk_subgradeUnit", K.val);
});
const z = i.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
i.derive(() => {
  localStorage.setItem("hk_stiffTransUnit", z.val);
});
const O = i.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
i.derive(() => {
  localStorage.setItem("hk_lengthSectionUnit", O.val);
});
const D = i.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
i.derive(() => {
  localStorage.setItem("hk_lengthStructureUnit", D.val);
});
const j = { "Metric MKS": { force: "tonf", disp: "mm", stress: "kgf/cm\xB2", subgrade: "tonf/m\xB3", stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m" }, "Metric SI": { force: "kN", disp: "mm", stress: "MPa", subgrade: "kN/m\xB3", stiffTrans: "kN/m", lengthSection: "mm", lengthStructure: "m" }, "U.S. Imperial": { force: "kip", disp: "in", stress: "ksi", subgrade: "kip/ft\xB3", stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft" } };
function G(t) {
  const e = j[t];
  u.val = e.force, k.val = e.disp, $.val = e.stress, K.val = e.subgrade, z.val = e.stiffTrans, O.val = e.lengthSection, D.val = e.lengthStructure, localStorage.setItem("hk_unitsPreset", t), window.__hekatanForceUnit = u.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = $.val;
}
(() => {
  const t = localStorage.getItem("hk_unitsPreset");
  t ? t !== "Custom" && t in j ? G(t) : (window.__hekatanForceUnit = u.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = $.val) : G("Metric MKS");
})();
function ke() {
  for (const [t, e] of Object.entries(j)) if (e.force === u.val && e.disp === k.val && e.stress === $.val && e.subgrade === K.val && e.stiffTrans === z.val && e.lengthSection === O.val && e.lengthStructure === D.val) return t;
  return "Custom";
}
export {
  de as a,
  he as b,
  pe as c,
  k as d,
  oe as e,
  u as f,
  re as g,
  fe as h,
  ke as i,
  G as j,
  K as k,
  z as l,
  O as m,
  _e as n,
  ge as o,
  Se as p,
  ve as q,
  ue as r,
  $ as s,
  me as t,
  ie as u
};
