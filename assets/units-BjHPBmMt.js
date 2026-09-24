import { M as nt, m as B } from "./modeScale-sgWZ-KrB.js";
import { v as i } from "./Text-C1TX4d8g.js";
const at = 4.4, ot = 1.1, st = at / ot;
function ut(e) {
  const { mesh: t, viewerElm: _, onStatusChange: X } = e, j = e.scalePercent ?? nt, [Y, Z] = e.visFrequencyRange ?? [0.5, 3];
  let n = null, l = 0, c = 0, p = [], M = [], w = null;
  function C() {
    var _a;
    return _.__settings ?? ((_a = _.__ctx) == null ? void 0 : _a.settings);
  }
  function q() {
    X == null ? void 0 : X();
  }
  function tt() {
    var _a;
    if (!n || !n.frequencies || n.frequencies.length === 0) return { mode: "Sin resultados", frequency: "\u2014", period: "\u2014", dominant: "\u2014", state: "\u23F8 Detenido" };
    const a = n.frequencies[l] ?? 0, o = a > 0 ? 1 / a : 0, r = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], d = (_a = n.massParticipation) == null ? void 0 : _a[l];
    let S = "\u2014";
    if (d) {
      let f = 0, g = 0;
      for (let h = 0; h < 6; h++) Math.abs(d[h]) > f && (f = Math.abs(d[h]), g = h);
      S = `${r[g]} (${(f * 100).toFixed(0)}%)`;
    }
    return { mode: `Modo ${l + 1} / ${n.frequencies.length}`, frequency: `${a.toFixed(4)} Hz`, period: `${o.toFixed(4)} s`, dominant: S, state: c !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado" };
  }
  function E() {
    return _.__ctx;
  }
  function N(a) {
    return a.length > 0 && a.length === t.nodes.rawVal.length;
  }
  function y(a) {
    var _a;
    if (c && (cancelAnimationFrame(c), c = 0), a) {
      const o = C();
      (o == null ? void 0 : o.deformedShape) && w !== null && (o.deformedShape.val = w, w = null);
      const r = N(p) ? p : N(M) ? M : [];
      r.length > 0 ? (t.nodes.val = r.map((d) => [...d]), (_a = E()) == null ? void 0 : _a.render()) : (p = [], M = []);
    }
  }
  function H() {
    var _a, _b;
    if (!n || !n.modeShapes || n.modeShapes.length === 0 || !n.modeShapes[l]) return;
    y(false);
    const a = C();
    (a == null ? void 0 : a.deformedShape) && (w === null && (w = a.deformedShape.val), a.deformedShape.val = false);
    const o = n.modeShapes[l], r = ((_a = n.frequencies) == null ? void 0 : _a[l]) || 1, d = ((_b = n.frequencies) == null ? void 0 : _b[0]) || 1, S = e.velocidadPorFrecuencia ? Math.max(Y, Math.min(Z, r / d)) : 1 / (e.periodoVisible ?? st);
    N(p) || (p = t.nodes.rawVal.map((m) => [...m])), M = p.map((m) => [...m]);
    const f = M.length, g = Math.floor(o.length / 6);
    if (g !== f) {
      console.warn(`[animateMode] el modo es de otra malla: ${g} nudos contra ${f} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
      return;
    }
    const h = B(M);
    let I = 0;
    for (let m = 0; m < f; m++) {
      const A = o[m * 6] || 0, F = o[m * 6 + 1] || 0, D = o[m * 6 + 2] || 0, v = Math.sqrt(A * A + F * F + D * D);
      v > I && (I = v);
    }
    const s = I > 1e-12 ? h * j / 100 / I : 1, U = performance.now(), T = f > 4e3 ? 100 : f > 1500 ? 66 : 0;
    let b = -1 / 0;
    const x = () => {
      var _a2;
      const m = performance.now();
      if (m - b < T) {
        c = requestAnimationFrame(x);
        return;
      }
      b = m;
      const A = (m - U) / 1e3, F = Math.sin(2 * Math.PI * S * A) * s, D = new Array(f);
      for (let v = 0; v < f; v++) {
        const R = M[v];
        D[v] = [R[0] + (o[v * 6] || 0) * F, R[1] + (o[v * 6 + 1] || 0) * F, R[2] + (o[v * 6 + 2] || 0) * F];
      }
      t.nodes.val = D, (_a2 = E()) == null ? void 0 : _a2.render(), c = requestAnimationFrame(x);
    };
    c = requestAnimationFrame(x), q();
  }
  function et(a) {
    var _a, _b;
    if (!n || !n.modeShapes || !n.modeShapes[a]) return;
    y(false);
    const o = C();
    (o == null ? void 0 : o.deformedShape) && (w === null && (w = o.deformedShape.val), o.deformedShape.val = false), l = Math.max(0, Math.min((((_a = n.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, a));
    const r = n.modeShapes[l];
    N(p) || (p = t.nodes.rawVal.map((s) => [...s]));
    const d = p.map((s) => [...s]), S = d.length;
    if (Math.floor(r.length / 6) !== S) {
      console.warn(`[animateMode] el modo estatico es de otra malla: ${Math.floor(r.length / 6)} nudos contra ${S} en pantalla. No lo dibujo.`);
      return;
    }
    const f = B(d);
    let g = 0;
    for (let s = 0; s < S; s++) {
      const U = r[s * 6] || 0, T = r[s * 6 + 1] || 0, b = r[s * 6 + 2] || 0, x = Math.sqrt(U * U + T * T + b * b);
      x > g && (g = x);
    }
    const h = g > 1e-12 ? f * j / 100 / g : 1, I = new Array(S);
    for (let s = 0; s < S; s++) {
      const U = d[s];
      I[s] = [U[0] + (r[s * 6] || 0) * h, U[1] + (r[s * 6 + 1] || 0) * h, U[2] + (r[s * 6 + 2] || 0) * h];
    }
    t.nodes.val = I, (_b = E()) == null ? void 0 : _b.render(), q();
  }
  return { setResults(a) {
    var _a;
    n = a, l >= (((_a = a == null ? void 0 : a.frequencies) == null ? void 0 : _a.length) ?? 0) && (l = 0), p = t.nodes.rawVal.map((o) => [...o]), q();
  }, setMode(a) {
    var _a;
    if (!n) return;
    const o = ((_a = n.frequencies) == null ? void 0 : _a.length) ?? 0;
    l = Math.max(0, Math.min(o - 1, a)), c !== 0 ? H() : q();
  }, showStatic(a) {
    et(a);
  }, play() {
    n && c === 0 && H();
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
    return tt();
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
const O = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
function dt(e, t) {
  return e * O[u.val];
}
function rt(e, t) {
  return e / O[t ?? u.val];
}
function it(e) {
  return 1 / Q[P.val];
}
function J(e, t) {
  return O[u.val] * it();
}
function ht(e, t) {
  return e * J();
}
function lt(e, t) {
  return e / J();
}
const Q = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };
function ct(e, t) {
  return e * Q[t ?? k.val];
}
function pt(e, t = 2) {
  const _ = k.val;
  return `${ct(e, _).toFixed(t)} ${_}`;
}
function St(e, t = 2) {
  const _ = u.val;
  return `${rt(e, _).toFixed(t)} ${_}`;
}
function gt(e, t = 2) {
  return `${lt(e).toFixed(t)} ${W()}`;
}
function W() {
  return `${u.val}\xB7${P.val}`;
}
function vt() {
  return `(${u.val})`;
}
function _t() {
  return `(${W()})`;
}
function kt() {
  return `(${k.val})`;
}
function Ut(e) {
  return e.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
}
const $ = i.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
i.derive(() => {
  localStorage.setItem("hk_stressUnit", $.val), window.__hekatanStressUnit = $.val;
});
const V = i.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
i.derive(() => {
  localStorage.setItem("hk_subgradeUnit", V.val);
});
const K = i.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
i.derive(() => {
  localStorage.setItem("hk_stiffTransUnit", K.val);
});
const z = i.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
i.derive(() => {
  localStorage.setItem("hk_lengthSectionUnit", z.val);
});
const P = i.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
i.derive(() => {
  localStorage.setItem("hk_lengthStructureUnit", P.val);
});
const L = { "Metric MKS": { force: "tonf", disp: "mm", stress: "kgf/cm\xB2", subgrade: "tonf/m\xB3", stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m" }, "Metric SI": { force: "kN", disp: "mm", stress: "MPa", subgrade: "kN/m\xB3", stiffTrans: "kN/m", lengthSection: "mm", lengthStructure: "m" }, "U.S. Imperial": { force: "kip", disp: "in", stress: "ksi", subgrade: "kip/ft\xB3", stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft" } };
function G(e) {
  const t = L[e];
  u.val = t.force, k.val = t.disp, $.val = t.stress, V.val = t.subgrade, K.val = t.stiffTrans, z.val = t.lengthSection, P.val = t.lengthStructure, localStorage.setItem("hk_unitsPreset", e), window.__hekatanForceUnit = u.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = $.val;
}
(() => {
  const e = localStorage.getItem("hk_unitsPreset");
  e ? e !== "Custom" && e in L ? G(e) : (window.__hekatanForceUnit = u.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = $.val) : G("Metric MKS");
})();
function Mt() {
  for (const [e, t] of Object.entries(L)) if (t.force === u.val && t.disp === k.val && t.stress === $.val && t.subgrade === V.val && t.stiffTrans === K.val && t.lengthSection === z.val && t.lengthStructure === P.val) return e;
  return "Custom";
}
export {
  pt as a,
  St as b,
  gt as c,
  k as d,
  rt as e,
  u as f,
  lt as g,
  ut as h,
  Mt as i,
  G as j,
  V as k,
  K as l,
  z as m,
  Ut as n,
  vt as o,
  _t as p,
  kt as q,
  ht as r,
  $ as s,
  dt as t,
  ct as u
};
