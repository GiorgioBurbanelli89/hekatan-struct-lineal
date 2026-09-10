import { v as l } from "./theme-Dxpmbnyd.js";
function ut(e) {
  const { mesh: t, viewerElm: S, onStatusChange: et } = e, Q = e.scalePercent ?? 5, [nt, at] = e.visFrequencyRange ?? [0.5, 3];
  let a = null, c = 0, f = 0, U = [], D = [], x = null;
  function E() {
    var _a;
    return S.__settings ?? ((_a = S.__ctx) == null ? void 0 : _a.settings);
  }
  function F() {
    et == null ? void 0 : et();
  }
  function st() {
    var _a;
    if (!a || !a.frequencies || a.frequencies.length === 0) return { mode: "Sin resultados", frequency: "\u2014", period: "\u2014", dominant: "\u2014", state: "\u23F8 Detenido" };
    const o = a.frequencies[c] ?? 0, i = o > 0 ? 1 / o : 0, u = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], h = (_a = a.massParticipation) == null ? void 0 : _a[c];
    let M = "\u2014";
    if (h) {
      let r = 0, p = 0;
      for (let m = 0; m < 6; m++) Math.abs(h[m]) > r && (r = Math.abs(h[m]), p = m);
      M = `${u[p]} (${(r * 100).toFixed(0)}%)`;
    }
    return { mode: `Modo ${c + 1} / ${a.frequencies.length}`, frequency: `${o.toFixed(4)} Hz`, period: `${i.toFixed(4)} s`, dominant: M, state: f !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado" };
  }
  function j() {
    return S.__ctx;
  }
  function R(o) {
    var _a;
    if (f && (cancelAnimationFrame(f), f = 0), o) {
      const i = E();
      (i == null ? void 0 : i.deformedShape) && x !== null && (i.deformedShape.val = x, x = null);
      const u = U.length > 0 ? U : D;
      u.length > 0 && (t.nodes.val = u.map((h) => [...h]), (_a = j()) == null ? void 0 : _a.render());
    }
  }
  function W() {
    var _a, _b;
    if (!a || !a.modeShapes || a.modeShapes.length === 0 || !a.modeShapes[c]) return;
    R(false);
    const o = E();
    (o == null ? void 0 : o.deformedShape) && (x === null && (x = o.deformedShape.val), o.deformedShape.val = false);
    const i = a.modeShapes[c], u = ((_a = a.frequencies) == null ? void 0 : _a[c]) || 1, h = ((_b = a.frequencies) == null ? void 0 : _b[0]) || 1, M = Math.max(nt, Math.min(at, u / h));
    D = (U.length > 0 ? U : t.nodes.rawVal).map((s) => [...s]);
    const r = D.length, p = Math.floor(i.length / 6);
    if (p !== r) {
      console.warn(`[animateMode] el modo es de otra malla: ${p} nudos contra ${r} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
      return;
    }
    let m = 1 / 0, I = 1 / 0, w = 1 / 0, q = -1 / 0, P = -1 / 0, k = -1 / 0;
    for (const s of D) s[0] < m && (m = s[0]), s[0] > q && (q = s[0]), s[1] < I && (I = s[1]), s[1] > P && (P = s[1]), s[2] < w && (w = s[2]), s[2] > k && (k = s[2]);
    const T = Math.sqrt((q - m) ** 2 + (P - I) ** 2 + (k - w) ** 2) || 1;
    let y = 0;
    for (let s = 0; s < r; s++) {
      const V = i[s * 6] || 0, b = i[s * 6 + 1] || 0, A = i[s * 6 + 2] || 0, g = Math.sqrt(V * V + b * b + A * A);
      g > y && (y = g);
    }
    const n = y > 1e-12 ? T * Q / 100 / y : 1, _ = performance.now(), K = r > 4e3 ? 100 : r > 1500 ? 66 : 0;
    let z = -1 / 0;
    const $ = () => {
      var _a2;
      const s = performance.now();
      if (s - z < K) {
        f = requestAnimationFrame($);
        return;
      }
      z = s;
      const V = (s - _) / 1e3, b = Math.sin(2 * Math.PI * M * V) * n, A = new Array(r);
      for (let g = 0; g < r; g++) {
        const O = D[g];
        A[g] = [O[0] + (i[g * 6] || 0) * b, O[1] + (i[g * 6 + 1] || 0) * b, O[2] + (i[g * 6 + 2] || 0) * b];
      }
      t.nodes.val = A, (_a2 = j()) == null ? void 0 : _a2.render(), f = requestAnimationFrame($);
    };
    f = requestAnimationFrame($), F();
  }
  function it(o) {
    var _a, _b;
    if (!a || !a.modeShapes || !a.modeShapes[o]) return;
    R(false);
    const i = E();
    (i == null ? void 0 : i.deformedShape) && (x === null && (x = i.deformedShape.val), i.deformedShape.val = false), c = Math.max(0, Math.min((((_a = a.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, o));
    const u = a.modeShapes[c], h = (U.length > 0 ? U : t.nodes.rawVal).map((n) => [...n]), M = h.length;
    let r = 1 / 0, p = 1 / 0, m = 1 / 0, I = -1 / 0, w = -1 / 0, q = -1 / 0;
    for (const n of h) n[0] < r && (r = n[0]), n[0] > I && (I = n[0]), n[1] < p && (p = n[1]), n[1] > w && (w = n[1]), n[2] < m && (m = n[2]), n[2] > q && (q = n[2]);
    const P = Math.sqrt((I - r) ** 2 + (w - p) ** 2 + (q - m) ** 2) || 1;
    let k = 0;
    for (let n = 0; n < M; n++) {
      const _ = u[n * 6] || 0, K = u[n * 6 + 1] || 0, z = u[n * 6 + 2] || 0, $ = Math.sqrt(_ * _ + K * K + z * z);
      $ > k && (k = $);
    }
    const T = k > 1e-12 ? P * Q / 100 / k : 1, y = new Array(M);
    for (let n = 0; n < M; n++) {
      const _ = h[n];
      y[n] = [_[0] + (u[n * 6] || 0) * T, _[1] + (u[n * 6 + 1] || 0) * T, _[2] + (u[n * 6 + 2] || 0) * T];
    }
    t.nodes.val = y, (_b = j()) == null ? void 0 : _b.render(), F();
  }
  return { setResults(o) {
    var _a;
    a = o, c >= (((_a = o == null ? void 0 : o.frequencies) == null ? void 0 : _a.length) ?? 0) && (c = 0), U = t.nodes.rawVal.map((i) => [...i]), F();
  }, setMode(o) {
    var _a;
    if (!a) return;
    const i = ((_a = a.frequencies) == null ? void 0 : _a.length) ?? 0;
    c = Math.max(0, Math.min(i - 1, o)), f !== 0 ? W() : F();
  }, showStatic(o) {
    it(o);
  }, play() {
    a && f === 0 && W();
  }, stop() {
    R(true), F();
  }, isPlaying() {
    return f !== 0;
  }, pause() {
    f && (cancelAnimationFrame(f), f = 0), F();
  }, modeCount() {
    var _a;
    return ((_a = a == null ? void 0 : a.frequencies) == null ? void 0 : _a.length) ?? 0;
  }, currentMode() {
    return c;
  }, currentFreq() {
    var _a;
    return ((_a = a == null ? void 0 : a.frequencies) == null ? void 0 : _a[c]) ?? 0;
  }, getStatus() {
    return st();
  }, dispose() {
    R(true), a = null;
  } };
}
const d = l.state(localStorage.getItem("hk_forceUnit") || "tonf"), v = l.state(localStorage.getItem("hk_dispUnit") || "mm");
l.derive(() => {
  localStorage.setItem("hk_forceUnit", d.val), window.__hekatanForceUnit = d.val;
});
l.derive(() => {
  localStorage.setItem("hk_dispUnit", v.val), window.__hekatanDispUnit = v.val;
});
const H = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
function mt(e, t) {
  return e * H[d.val];
}
function ot(e, t) {
  return e / H[t ?? d.val];
}
function rt(e) {
  return 1 / Z[C.val];
}
function Y(e, t) {
  return H[d.val] * rt();
}
function dt(e, t) {
  return e * Y();
}
function lt(e, t) {
  return e / Y();
}
const Z = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };
function ct(e, t) {
  return e * Z[t ?? v.val];
}
function ht(e, t = 2) {
  const S = v.val;
  return `${ct(e, S).toFixed(t)} ${S}`;
}
function gt(e, t = 2) {
  const S = d.val;
  return `${ot(e, S).toFixed(t)} ${S}`;
}
function St(e, t = 2) {
  return `${lt(e).toFixed(t)} ${tt()}`;
}
function tt() {
  return `${d.val}\xB7${C.val}`;
}
function pt() {
  return `(${d.val})`;
}
function vt() {
  return `(${tt()})`;
}
function Mt() {
  return `(${v.val})`;
}
function kt(e) {
  return e.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
}
const N = l.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
l.derive(() => {
  localStorage.setItem("hk_stressUnit", N.val), window.__hekatanStressUnit = N.val;
});
const L = l.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
l.derive(() => {
  localStorage.setItem("hk_subgradeUnit", L.val);
});
const B = l.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
l.derive(() => {
  localStorage.setItem("hk_stiffTransUnit", B.val);
});
const G = l.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
l.derive(() => {
  localStorage.setItem("hk_lengthSectionUnit", G.val);
});
const C = l.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
l.derive(() => {
  localStorage.setItem("hk_lengthStructureUnit", C.val);
});
const J = { "Metric MKS": { force: "tonf", disp: "mm", stress: "kgf/cm\xB2", subgrade: "tonf/m\xB3", stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m" }, "Metric SI": { force: "kN", disp: "mm", stress: "MPa", subgrade: "kN/m\xB3", stiffTrans: "kN/m", lengthSection: "mm", lengthStructure: "m" }, "U.S. Imperial": { force: "kip", disp: "in", stress: "ksi", subgrade: "kip/ft\xB3", stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft" } };
function X(e) {
  const t = J[e];
  d.val = t.force, v.val = t.disp, N.val = t.stress, L.val = t.subgrade, B.val = t.stiffTrans, G.val = t.lengthSection, C.val = t.lengthStructure, localStorage.setItem("hk_unitsPreset", e), window.__hekatanForceUnit = d.val, window.__hekatanDispUnit = v.val, window.__hekatanStressUnit = N.val;
}
(() => {
  const e = localStorage.getItem("hk_unitsPreset");
  e ? e !== "Custom" && e in J ? X(e) : (window.__hekatanForceUnit = d.val, window.__hekatanDispUnit = v.val, window.__hekatanStressUnit = N.val) : X("Metric MKS");
})();
function _t() {
  for (const [e, t] of Object.entries(J)) if (t.force === d.val && t.disp === v.val && t.stress === N.val && t.subgrade === L.val && t.stiffTrans === B.val && t.lengthSection === G.val && t.lengthStructure === C.val) return e;
  return "Custom";
}
export {
  ht as a,
  gt as b,
  St as c,
  v as d,
  ot as e,
  d as f,
  lt as g,
  ut as h,
  _t as i,
  X as j,
  L as k,
  B as l,
  G as m,
  kt as n,
  pt as o,
  vt as p,
  Mt as q,
  dt as r,
  N as s,
  mt as t,
  ct as u
};
