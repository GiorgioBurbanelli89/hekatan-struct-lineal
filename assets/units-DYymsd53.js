import { v as c } from "./theme-Dxpmbnyd.js";
function mt(e) {
  const { mesh: t, viewerElm: v, onStatusChange: nt } = e, W = e.scalePercent ?? 5, [at, st] = e.visFrequencyRange ?? [0.5, 3];
  let s = null, f = 0, u = 0, g = [], x = [], I = null;
  function E() {
    var _a;
    return v.__settings ?? ((_a = v.__ctx) == null ? void 0 : _a.settings);
  }
  function F() {
    nt == null ? void 0 : nt();
  }
  function ot() {
    var _a;
    if (!s || !s.frequencies || s.frequencies.length === 0) return { mode: "Sin resultados", frequency: "\u2014", period: "\u2014", dominant: "\u2014", state: "\u23F8 Detenido" };
    const o = s.frequencies[f] ?? 0, i = o > 0 ? 1 / o : 0, r = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], h = (_a = s.massParticipation) == null ? void 0 : _a[f];
    let p = "\u2014";
    if (h) {
      let l = 0, M = 0;
      for (let m = 0; m < 6; m++) Math.abs(h[m]) > l && (l = Math.abs(h[m]), M = m);
      p = `${r[M]} (${(l * 100).toFixed(0)}%)`;
    }
    return { mode: `Modo ${f + 1} / ${s.frequencies.length}`, frequency: `${o.toFixed(4)} Hz`, period: `${i.toFixed(4)} s`, dominant: p, state: u !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado" };
  }
  function O() {
    return v.__ctx;
  }
  function R(o) {
    return o.length > 0 && o.length === t.nodes.rawVal.length;
  }
  function K(o) {
    var _a;
    if (u && (cancelAnimationFrame(u), u = 0), o) {
      const i = E();
      (i == null ? void 0 : i.deformedShape) && I !== null && (i.deformedShape.val = I, I = null);
      const r = R(g) ? g : R(x) ? x : [];
      r.length > 0 ? (t.nodes.val = r.map((h) => [...h]), (_a = O()) == null ? void 0 : _a.render()) : (g = [], x = []);
    }
  }
  function X() {
    var _a, _b;
    if (!s || !s.modeShapes || s.modeShapes.length === 0 || !s.modeShapes[f]) return;
    K(false);
    const o = E();
    (o == null ? void 0 : o.deformedShape) && (I === null && (I = o.deformedShape.val), o.deformedShape.val = false);
    const i = s.modeShapes[f], r = ((_a = s.frequencies) == null ? void 0 : _a[f]) || 1, h = ((_b = s.frequencies) == null ? void 0 : _b[0]) || 1, p = Math.max(at, Math.min(st, r / h));
    R(g) || (g = t.nodes.rawVal.map((a) => [...a])), x = g.map((a) => [...a]);
    const l = x.length, M = Math.floor(i.length / 6);
    if (M !== l) {
      console.warn(`[animateMode] el modo es de otra malla: ${M} nudos contra ${l} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
      return;
    }
    let m = 1 / 0, w = 1 / 0, q = 1 / 0, y = -1 / 0, P = -1 / 0, _ = -1 / 0;
    for (const a of x) a[0] < m && (m = a[0]), a[0] > y && (y = a[0]), a[1] < w && (w = a[1]), a[1] > P && (P = a[1]), a[2] < q && (q = a[2]), a[2] > _ && (_ = a[2]);
    const T = Math.sqrt((y - m) ** 2 + (P - w) ** 2 + (_ - q) ** 2) || 1;
    let $ = 0;
    for (let a = 0; a < l; a++) {
      const j = i[a * 6] || 0, N = i[a * 6 + 1] || 0, A = i[a * 6 + 2] || 0, S = Math.sqrt(j * j + N * N + A * A);
      S > $ && ($ = S);
    }
    const n = $ > 1e-12 ? T * W / 100 / $ : 1, U = performance.now(), V = l > 4e3 ? 100 : l > 1500 ? 66 : 0;
    let z = -1 / 0;
    const b = () => {
      var _a2;
      const a = performance.now();
      if (a - z < V) {
        u = requestAnimationFrame(b);
        return;
      }
      z = a;
      const j = (a - U) / 1e3, N = Math.sin(2 * Math.PI * p * j) * n, A = new Array(l);
      for (let S = 0; S < l; S++) {
        const H = x[S];
        A[S] = [H[0] + (i[S * 6] || 0) * N, H[1] + (i[S * 6 + 1] || 0) * N, H[2] + (i[S * 6 + 2] || 0) * N];
      }
      t.nodes.val = A, (_a2 = O()) == null ? void 0 : _a2.render(), u = requestAnimationFrame(b);
    };
    u = requestAnimationFrame(b), F();
  }
  function it(o) {
    var _a, _b;
    if (!s || !s.modeShapes || !s.modeShapes[o]) return;
    K(false);
    const i = E();
    (i == null ? void 0 : i.deformedShape) && (I === null && (I = i.deformedShape.val), i.deformedShape.val = false), f = Math.max(0, Math.min((((_a = s.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, o));
    const r = s.modeShapes[f];
    R(g) || (g = t.nodes.rawVal.map((n) => [...n]));
    const h = g.map((n) => [...n]), p = h.length;
    if (Math.floor(r.length / 6) !== p) {
      console.warn(`[animateMode] el modo estatico es de otra malla: ${Math.floor(r.length / 6)} nudos contra ${p} en pantalla. No lo dibujo.`);
      return;
    }
    let l = 1 / 0, M = 1 / 0, m = 1 / 0, w = -1 / 0, q = -1 / 0, y = -1 / 0;
    for (const n of h) n[0] < l && (l = n[0]), n[0] > w && (w = n[0]), n[1] < M && (M = n[1]), n[1] > q && (q = n[1]), n[2] < m && (m = n[2]), n[2] > y && (y = n[2]);
    const P = Math.sqrt((w - l) ** 2 + (q - M) ** 2 + (y - m) ** 2) || 1;
    let _ = 0;
    for (let n = 0; n < p; n++) {
      const U = r[n * 6] || 0, V = r[n * 6 + 1] || 0, z = r[n * 6 + 2] || 0, b = Math.sqrt(U * U + V * V + z * z);
      b > _ && (_ = b);
    }
    const T = _ > 1e-12 ? P * W / 100 / _ : 1, $ = new Array(p);
    for (let n = 0; n < p; n++) {
      const U = h[n];
      $[n] = [U[0] + (r[n * 6] || 0) * T, U[1] + (r[n * 6 + 1] || 0) * T, U[2] + (r[n * 6 + 2] || 0) * T];
    }
    t.nodes.val = $, (_b = O()) == null ? void 0 : _b.render(), F();
  }
  return { setResults(o) {
    var _a;
    s = o, f >= (((_a = o == null ? void 0 : o.frequencies) == null ? void 0 : _a.length) ?? 0) && (f = 0), g = t.nodes.rawVal.map((i) => [...i]), F();
  }, setMode(o) {
    var _a;
    if (!s) return;
    const i = ((_a = s.frequencies) == null ? void 0 : _a.length) ?? 0;
    f = Math.max(0, Math.min(i - 1, o)), u !== 0 ? X() : F();
  }, showStatic(o) {
    it(o);
  }, play() {
    s && u === 0 && X();
  }, stop() {
    K(true), F();
  }, isPlaying() {
    return u !== 0;
  }, pause() {
    u && (cancelAnimationFrame(u), u = 0), F();
  }, modeCount() {
    var _a;
    return ((_a = s == null ? void 0 : s.frequencies) == null ? void 0 : _a.length) ?? 0;
  }, currentMode() {
    return f;
  }, currentFreq() {
    var _a;
    return ((_a = s == null ? void 0 : s.frequencies) == null ? void 0 : _a[f]) ?? 0;
  }, getStatus() {
    return ot();
  }, dispose() {
    K(true), s = null;
  } };
}
const d = c.state(localStorage.getItem("hk_forceUnit") || "tonf"), k = c.state(localStorage.getItem("hk_dispUnit") || "mm");
c.derive(() => {
  localStorage.setItem("hk_forceUnit", d.val), window.__hekatanForceUnit = d.val;
});
c.derive(() => {
  localStorage.setItem("hk_dispUnit", k.val), window.__hekatanDispUnit = k.val;
});
const L = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
function dt(e, t) {
  return e * L[d.val];
}
function rt(e, t) {
  return e / L[t ?? d.val];
}
function lt(e) {
  return 1 / tt[C.val];
}
function Z(e, t) {
  return L[d.val] * lt();
}
function ht(e, t) {
  return e * Z();
}
function ct(e, t) {
  return e / Z();
}
const tt = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };
function ft(e, t) {
  return e * tt[t ?? k.val];
}
function gt(e, t = 2) {
  const v = k.val;
  return `${ft(e, v).toFixed(t)} ${v}`;
}
function pt(e, t = 2) {
  const v = d.val;
  return `${rt(e, v).toFixed(t)} ${v}`;
}
function St(e, t = 2) {
  return `${ct(e).toFixed(t)} ${et()}`;
}
function et() {
  return `${d.val}\xB7${C.val}`;
}
function vt() {
  return `(${d.val})`;
}
function Mt() {
  return `(${et()})`;
}
function kt() {
  return `(${k.val})`;
}
function _t(e) {
  return e.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
}
const D = c.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
c.derive(() => {
  localStorage.setItem("hk_stressUnit", D.val), window.__hekatanStressUnit = D.val;
});
const B = c.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
c.derive(() => {
  localStorage.setItem("hk_subgradeUnit", B.val);
});
const G = c.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
c.derive(() => {
  localStorage.setItem("hk_stiffTransUnit", G.val);
});
const J = c.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
c.derive(() => {
  localStorage.setItem("hk_lengthSectionUnit", J.val);
});
const C = c.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
c.derive(() => {
  localStorage.setItem("hk_lengthStructureUnit", C.val);
});
const Q = { "Metric MKS": { force: "tonf", disp: "mm", stress: "kgf/cm\xB2", subgrade: "tonf/m\xB3", stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m" }, "Metric SI": { force: "kN", disp: "mm", stress: "MPa", subgrade: "kN/m\xB3", stiffTrans: "kN/m", lengthSection: "mm", lengthStructure: "m" }, "U.S. Imperial": { force: "kip", disp: "in", stress: "ksi", subgrade: "kip/ft\xB3", stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft" } };
function Y(e) {
  const t = Q[e];
  d.val = t.force, k.val = t.disp, D.val = t.stress, B.val = t.subgrade, G.val = t.stiffTrans, J.val = t.lengthSection, C.val = t.lengthStructure, localStorage.setItem("hk_unitsPreset", e), window.__hekatanForceUnit = d.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = D.val;
}
(() => {
  const e = localStorage.getItem("hk_unitsPreset");
  e ? e !== "Custom" && e in Q ? Y(e) : (window.__hekatanForceUnit = d.val, window.__hekatanDispUnit = k.val, window.__hekatanStressUnit = D.val) : Y("Metric MKS");
})();
function Ut() {
  for (const [e, t] of Object.entries(Q)) if (t.force === d.val && t.disp === k.val && t.stress === D.val && t.subgrade === B.val && t.stiffTrans === G.val && t.lengthSection === J.val && t.lengthStructure === C.val) return e;
  return "Custom";
}
export {
  gt as a,
  pt as b,
  St as c,
  k as d,
  rt as e,
  d as f,
  ct as g,
  mt as h,
  Ut as i,
  Y as j,
  B as k,
  G as l,
  J as m,
  _t as n,
  vt as o,
  Mt as p,
  kt as q,
  ht as r,
  D as s,
  dt as t,
  ft as u
};
