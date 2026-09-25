import { M as qt, m as bt } from "./modeScale-sgWZ-KrB.js";
import { v as $ } from "./Text-C1TX4d8g.js";
const $t = 4.4, It = 1.1, Pt = $t / It;
function te(t) {
  const { mesh: e, viewerElm: a, onStatusChange: o } = t, i = t.scalePercent ?? qt, [u, c] = t.visFrequencyRange ?? [0.5, 3];
  let n = null, l = 0, f = 0, d = [], s = [], r = null;
  function m() {
    var _a;
    return a.__settings ?? ((_a = a.__ctx) == null ? void 0 : _a.settings);
  }
  function v() {
    o == null ? void 0 : o();
  }
  function M() {
    var _a;
    if (!n || !n.frequencies || n.frequencies.length === 0) return { mode: "Sin resultados", frequency: "\u2014", period: "\u2014", dominant: "\u2014", state: "\u23F8 Detenido" };
    const p = n.frequencies[l] ?? 0, b = p > 0 ? 1 / p : 0, S = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], y = (_a = n.massParticipation) == null ? void 0 : _a[l];
    let T = "\u2014";
    if (y) {
      let k = 0, A = 0;
      for (let w = 0; w < 6; w++) Math.abs(y[w]) > k && (k = Math.abs(y[w]), A = w);
      T = `${S[A]} (${(k * 100).toFixed(0)}%)`;
    }
    return { mode: `Modo ${l + 1} / ${n.frequencies.length}`, frequency: `${p.toFixed(4)} Hz`, period: `${b.toFixed(4)} s`, dominant: T, state: f !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado" };
  }
  function _() {
    return a.__ctx;
  }
  function x(p) {
    return p.length > 0 && p.length === e.nodes.rawVal.length;
  }
  function C(p) {
    var _a;
    if (f && (cancelAnimationFrame(f), f = 0), p) {
      const b = m();
      (b == null ? void 0 : b.deformedShape) && r !== null && (b.deformedShape.val = r, r = null);
      const S = x(d) ? d : x(s) ? s : [];
      S.length > 0 ? (e.nodes.val = S.map((y) => [...y]), (_a = _()) == null ? void 0 : _a.render()) : (d = [], s = []);
    }
  }
  function g() {
    var _a, _b;
    if (!n || !n.modeShapes || n.modeShapes.length === 0 || !n.modeShapes[l]) return;
    C(false);
    const p = m();
    (p == null ? void 0 : p.deformedShape) && (r === null && (r = p.deformedShape.val), p.deformedShape.val = false);
    const b = n.modeShapes[l], S = ((_a = n.frequencies) == null ? void 0 : _a[l]) || 1, y = ((_b = n.frequencies) == null ? void 0 : _b[0]) || 1, T = t.velocidadPorFrecuencia ? Math.max(u, Math.min(c, S / y)) : 1 / (t.periodoVisible ?? Pt);
    x(d) || (d = e.nodes.rawVal.map((q) => [...q])), s = d.map((q) => [...q]);
    const k = s.length, A = Math.floor(b.length / 6);
    if (A !== k) {
      console.warn(`[animateMode] el modo es de otra malla: ${A} nudos contra ${k} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
      return;
    }
    const w = bt(s);
    let E = 0;
    for (let q = 0; q < k; q++) {
      const B = b[q * 6] || 0, N = b[q * 6 + 1] || 0, z = b[q * 6 + 2] || 0, I = Math.sqrt(B * B + N * N + z * z);
      I > E && (E = I);
    }
    const h = E > 1e-12 ? w * i / 100 / E : 1, F = performance.now(), j = k > 4e3 ? 100 : k > 1500 ? 66 : 0;
    let D = -1 / 0;
    const L = () => {
      var _a2;
      const q = performance.now();
      if (q - D < j) {
        f = requestAnimationFrame(L);
        return;
      }
      D = q;
      const B = (q - F) / 1e3, N = Math.sin(2 * Math.PI * T * B) * h, z = new Array(k);
      for (let I = 0; I < k; I++) {
        const W = s[I];
        z[I] = [W[0] + (b[I * 6] || 0) * N, W[1] + (b[I * 6 + 1] || 0) * N, W[2] + (b[I * 6 + 2] || 0) * N];
      }
      e.nodes.val = z, (_a2 = _()) == null ? void 0 : _a2.render(), f = requestAnimationFrame(L);
    };
    f = requestAnimationFrame(L), v();
  }
  function O(p) {
    var _a, _b;
    if (!n || !n.modeShapes || !n.modeShapes[p]) return;
    C(false);
    const b = m();
    (b == null ? void 0 : b.deformedShape) && (r === null && (r = b.deformedShape.val), b.deformedShape.val = false), l = Math.max(0, Math.min((((_a = n.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, p));
    const S = n.modeShapes[l];
    x(d) || (d = e.nodes.rawVal.map((h) => [...h]));
    const y = d.map((h) => [...h]), T = y.length;
    if (Math.floor(S.length / 6) !== T) {
      console.warn(`[animateMode] el modo estatico es de otra malla: ${Math.floor(S.length / 6)} nudos contra ${T} en pantalla. No lo dibujo.`);
      return;
    }
    const k = bt(y);
    let A = 0;
    for (let h = 0; h < T; h++) {
      const F = S[h * 6] || 0, j = S[h * 6 + 1] || 0, D = S[h * 6 + 2] || 0, L = Math.sqrt(F * F + j * j + D * D);
      L > A && (A = L);
    }
    const w = A > 1e-12 ? k * i / 100 / A : 1, E = new Array(T);
    for (let h = 0; h < T; h++) {
      const F = y[h];
      E[h] = [F[0] + (S[h * 6] || 0) * w, F[1] + (S[h * 6 + 1] || 0) * w, F[2] + (S[h * 6 + 2] || 0) * w];
    }
    e.nodes.val = E, (_b = _()) == null ? void 0 : _b.render(), v();
  }
  return { setResults(p) {
    var _a;
    n = p, l >= (((_a = p == null ? void 0 : p.frequencies) == null ? void 0 : _a.length) ?? 0) && (l = 0), d = e.nodes.rawVal.map((b) => [...b]), v();
  }, setMode(p) {
    var _a;
    if (!n) return;
    const b = ((_a = n.frequencies) == null ? void 0 : _a.length) ?? 0;
    l = Math.max(0, Math.min(b - 1, p)), f !== 0 ? g() : v();
  }, showStatic(p) {
    O(p);
  }, play() {
    n && f === 0 && g();
  }, stop() {
    C(true), v();
  }, isPlaying() {
    return f !== 0;
  }, pause() {
    f && (cancelAnimationFrame(f), f = 0), v();
  }, modeCount() {
    var _a;
    return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a.length) ?? 0;
  }, currentMode() {
    return l;
  }, currentFreq() {
    var _a;
    return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a[l]) ?? 0;
  }, getStatus() {
    return M();
  }, dispose() {
    C(true), n = null;
  } };
}
const R = $.state(localStorage.getItem("hk_forceUnit") || "tonf"), V = $.state(localStorage.getItem("hk_dispUnit") || "mm");
$.derive(() => {
  localStorage.setItem("hk_forceUnit", R.val), window.__hekatanForceUnit = R.val;
});
$.derive(() => {
  localStorage.setItem("hk_dispUnit", V.val), window.__hekatanDispUnit = V.val;
});
const st = { kN: 1, tonf: 9.80665, kip: 4.4482216 };
function ee(t, e) {
  return t * st[R.val];
}
function Rt(t, e) {
  return t / st[e ?? R.val];
}
function Dt(t) {
  return 1 / kt[Y.val];
}
function yt(t, e) {
  return st[R.val] * Dt();
}
function ne(t, e) {
  return t * yt();
}
function Ut(t, e) {
  return t / yt();
}
const kt = { mm: 1e3, cm: 100, m: 1, in: 39.3700787402, ft: 3.280839895 };
function Ot(t, e) {
  return t * kt[e ?? V.val];
}
function oe(t, e = 2) {
  const a = V.val;
  return `${Ot(t, a).toFixed(e)} ${a}`;
}
function ae(t, e = 2) {
  const a = R.val;
  return `${Rt(t, a).toFixed(e)} ${a}`;
}
function se(t, e = 2) {
  return `${Ut(t).toFixed(e)} ${At()}`;
}
function At() {
  return `${R.val}\xB7${Y.val}`;
}
function re() {
  return `(${R.val})`;
}
function ie() {
  return `(${At()})`;
}
function ce() {
  return `(${V.val})`;
}
function le(t) {
  return t.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
}
const G = $.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
$.derive(() => {
  localStorage.setItem("hk_stressUnit", G.val), window.__hekatanStressUnit = G.val;
});
const rt = $.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
$.derive(() => {
  localStorage.setItem("hk_subgradeUnit", rt.val);
});
const it = $.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
$.derive(() => {
  localStorage.setItem("hk_stiffTransUnit", it.val);
});
const ct = $.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
$.derive(() => {
  localStorage.setItem("hk_lengthSectionUnit", ct.val);
});
const Y = $.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
$.derive(() => {
  localStorage.setItem("hk_lengthStructureUnit", Y.val);
});
const lt = { "Metric MKS": { force: "tonf", disp: "mm", stress: "kgf/cm\xB2", subgrade: "tonf/m\xB3", stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m" }, "Metric SI": { force: "kN", disp: "mm", stress: "MPa", subgrade: "kN/m\xB3", stiffTrans: "kN/m", lengthSection: "mm", lengthStructure: "m" }, "U.S. Imperial": { force: "kip", disp: "in", stress: "ksi", subgrade: "kip/ft\xB3", stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft" } };
function xt(t) {
  const e = lt[t];
  R.val = e.force, V.val = e.disp, G.val = e.stress, rt.val = e.subgrade, it.val = e.stiffTrans, ct.val = e.lengthSection, Y.val = e.lengthStructure, localStorage.setItem("hk_unitsPreset", t), window.__hekatanForceUnit = R.val, window.__hekatanDispUnit = V.val, window.__hekatanStressUnit = G.val;
}
(() => {
  const t = localStorage.getItem("hk_unitsPreset");
  t ? t !== "Custom" && t in lt ? xt(t) : (window.__hekatanForceUnit = R.val, window.__hekatanDispUnit = V.val, window.__hekatanStressUnit = G.val) : xt("Metric MKS");
})();
function de() {
  for (const [t, e] of Object.entries(lt)) if (e.force === R.val && e.disp === V.val && e.stress === G.val && e.subgrade === rt.val && e.stiffTrans === it.val && e.lengthSection === ct.val && e.lengthStructure === Y.val) return t;
  return "Custom";
}
const nt = { analisis: [{ id: "estatico", orden: 1, icono: "\u25B6", titulo: "Analizar (est\xE1tico)", detalle: "Resuelve el modelo con el caso o la combinaci\xF3n elegida en \xABResultados\xBB.", abrir: () => {
  var _a;
  return (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
} }, { id: "modal", orden: 2, icono: "\u3030", titulo: "Modal + animar", detalle: "Periodos, modos y participaci\xF3n de masa; anima el modo elegido.", abrir: () => {
  var _a;
  return (_a = window.__hekatanRunModalAnimate) == null ? void 0 : _a.call(window);
} }, { id: "parar", orden: 3, icono: "\u25A0", titulo: "Parar animaci\xF3n", detalle: "Detiene la animaci\xF3n del modo.", abrir: () => {
  var _a;
  return (_a = window.__hekatanModalStop) == null ? void 0 : _a.call(window);
} }], diseno: [], exportar: [{ id: "e2k", orden: 1, icono: "\u{1F3D7}", titulo: "ETABS (.e2k)", detalle: "El modelo entero, para abrirlo en ETABS.", abrir: () => Q("E2K", "ETABS") }, { id: "s2k", orden: 2, icono: "\u{1F4D0}", titulo: "SAP2000 (.s2k)", detalle: "El modelo entero, para abrirlo en SAP2000.", abrir: () => Q("S2K", "SAP2000") }, { id: "f2k", orden: 3, icono: "\u{1FAA8}", titulo: "SAFE (.f2k) \u2014 cimentaci\xF3n", detalle: "La cimentaci\xF3n con sus muelles, para SAFE.", abrir: () => Q("F2K", "SAFE") }, { id: "tcl", orden: 4, icono: "\u{1F9EE}", titulo: "OpenSees (.tcl)", detalle: "El guion de OpenSees, para comprobarlo aparte.", abrir: () => Q(".tcl", "OpenSees") }, { id: "dwg", orden: 5, icono: "\u{1F4D0}", titulo: "AutoCAD (.dwg) \u2014 geometr\xEDa", detalle: "Barras y \xE1reas en capas COLUMNAS, VIGAS, DIAGONALES, LOSAS, MUROS.", abrir: () => tt("Exportar DWG", "DWG") }, { id: "dxf", orden: 6, icono: "\u{1F4C4}", titulo: "DXF \u2014 geometr\xEDa", detalle: "Lo mismo en DXF de texto: lo abre cualquier CAD.", abrir: () => tt("Exportar DXF", "DXF") }, { id: "idwg", orden: 7, icono: "\u{1F4E5}", titulo: "Importar DWG / DXF (3D o planta)", detalle: "L\xEDneas \u2192 barras con sus nudos; 3DFACE \u2192 \xE1reas. Salta ejes, cotas y textos.", abrir: () => tt("Importar DWG/DXF (3D", "DWG") }, { id: "idwgxz", orden: 8, icono: "\u{1F4E5}", titulo: "Importar DWG / DXF como alzado (XZ)", detalle: "Un p\xF3rtico dibujado en 2D: la Y del plano pasa a ser la altura Z.", abrir: () => tt("como alzado (XZ)", "DWG") }] };
function Q(t, e) {
  const o = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((i) => {
    const u = (i.textContent || "").replace(/\s+/g, " ").trim();
    return u.includes("Exportar") && u.includes(t) && u.length < 60;
  });
  if (o) {
    o.click();
    return;
  }
  alert("Este ejemplo todav\xEDa no exporta a " + e + `.

Los que s\xED: el galp\xF3n curvo (ETABS, SAP2000, SAFE y OpenSees) y
la zapata (SAFE y OpenSees).`);
}
function tt(t, e) {
  const a = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((o) => (o.textContent || "").replace(/\s+/g, " ").includes(t));
  if (a) {
    a.click();
    return;
  }
  alert("Abr\xED un modelo o un archivo nuevo para usar " + e + ".");
}
const Bt = { analisis: "\u25B6 An\xE1lisis", diseno: "\u{1F4D0} Dise\xF1o", exportar: "\u{1F4E4} Exportar" }, Nt = { analisis: "An\xE1lisis \u2014 elige qu\xE9 calcular:", diseno: "Dise\xF1o \u2014 elige qu\xE9 hacer:", exportar: "Exportar el modelo a otro programa:" };
function ue() {
  dt();
}
function Vt(t) {
  const e = nt.diseno;
  e.some((a) => a.id === t.id) || (e.push(t), e.sort((a, o) => a.orden - o.orden)), dt();
}
let X = null;
function dt() {
  if (document.getElementById("hk-menus")) return;
  const t = document.getElementById("hk-cad-tit"), e = t == null ? void 0 : t.querySelector(".doc");
  if (!t || !e) {
    setTimeout(dt, 400);
    return;
  }
  const a = document.createElement("style");
  a.textContent = "#hk-cad-tit button{white-space:nowrap}@media (max-width:1100px){#hk-cad-tit .marca{display:none}}@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}", document.head.appendChild(a);
  const o = document.createElement("span");
  o.id = "hk-menus", o.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px", e.after(o);
  const i = (s) => {
    const r = document.getElementById(s);
    if (!r) return false;
    const m = r.style.display !== "none";
    return r.removeAttribute("style"), r.className = "piel", m || (r.style.display = "none"), o.appendChild(r), true;
  };
  let u = 0;
  const c = () => {
    const s = i("hk-home-btn"), r = i("hk-back-btn");
    (!s || !r) && ++u < 20 && setTimeout(c, 400);
  };
  (() => {
    for (const s of ["analisis", "diseno", "exportar"]) {
      const r = document.createElement("button");
      r.id = `hk-${s}-btn`, r.className = "piel", r.textContent = Bt[s] + " \u25BE", r.onclick = (m) => {
        m.stopPropagation(), Lt(s, r);
      }, o.appendChild(r);
    }
  })(), c();
  const l = () => {
    const s = o.querySelector("#hk-analisis-btn");
    for (const r of ["hk-back-btn", "hk-home-btn"]) {
      const m = document.getElementById(r);
      m && s && m.parentElement === o && o.insertBefore(m, s);
    }
  };
  for (const s of [500, 1200, 2500, 5e3]) setTimeout(l, s);
  const f = window, d = f.__hekatanActualizarBotonVolver;
  f.__hekatanActualizarBotonVolver = (s) => {
    d == null ? void 0 : d(s);
    const r = document.getElementById("hk-back-btn");
    r && (r.style.display = s ? "" : "none");
  }, document.addEventListener("click", (s) => {
    X && !X.contains(s.target) && at();
  });
}
function at() {
  X == null ? void 0 : X.remove(), X = null;
}
function Lt(t, e) {
  const a = (X == null ? void 0 : X.dataset.menu) === t;
  if (at(), a) return;
  const o = document.createElement("div");
  o.dataset.menu = t, o.id = `hk-${t}-menu`, o.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
  const i = nt[t].length === 0 ? '<div style="padding:8px;opacity:.8;line-height:1.5">Todav\xEDa no hay nada aqu\xED.<br>Las opciones de dise\xF1o las trae el modelo: abre una plantilla o un ejemplo con cimentaci\xF3n o zapata y volver\xE1n a aparecer en este men\xFA.</div>' : "";
  o.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${Nt[t]}</div>` + i + nt[t].map((c) => `<div data-id="${c.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${c.icono} ${c.titulo}</b><div style="opacity:.75;margin-top:2px">${c.detalle}</div></div>`).join(""), o.querySelectorAll("[data-id]").forEach((c) => {
    c.onmouseenter = () => c.style.background = "#1f3b5a", c.onmouseleave = () => c.style.background = "", c.onclick = () => {
      var _a;
      at(), (_a = nt[t].find((n) => n.id === c.dataset.id)) == null ? void 0 : _a.abrir();
    };
  }), document.body.appendChild(o);
  const u = e.getBoundingClientRect();
  o.style.top = u.bottom + 4 + "px", o.style.left = Math.max(8, Math.min(u.left, innerWidth - 370)) + "px", X = o;
}
function me(t) {
  let e = false, a = 0, o = 0;
  const i = (n) => {
    const l = t.firstElementChild;
    return !!l && l.contains(n);
  }, u = () => {
    const n = t.dataset.plegado !== "1";
    t.dataset.plegado = n ? "1" : "0", [...t.children].slice(1).forEach((l) => l.style.display = n ? "none" : ""), t.style.overflow = n ? "hidden" : "auto";
  };
  t.addEventListener("pointerdown", (n) => {
    if (!i(n.target)) return;
    const l = n.target;
    if (l.closest("[data-plegar]")) {
      u();
      return;
    }
    if (l.closest("button,select,input,[id$='-x']")) return;
    const f = t.getBoundingClientRect();
    e = true, a = n.clientX - f.left, o = n.clientY - f.top, t.setPointerCapture(n.pointerId), n.preventDefault();
  }), t.addEventListener("pointermove", (n) => {
    e && (t.style.left = Math.min(Math.max(0, n.clientX - a), innerWidth - 80) + "px", t.style.top = Math.min(Math.max(30, n.clientY - o), innerHeight - 30) + "px", t.style.right = "auto");
  }), t.addEventListener("pointerup", () => {
    e = false;
  }), t.addEventListener("dblclick", (n) => {
    i(n.target) && !n.target.closest("[data-plegar]") && u();
  });
  const c = () => {
    const n = t.firstElementChild;
    if (!n || n.dataset.barra === "1") return;
    n.dataset.barra = "1", n.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", n.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
    const l = n.querySelector("b");
    l && !l.textContent.startsWith("\u283F") && (l.textContent = "\u283F " + l.textContent);
  };
  c(), new MutationObserver(c).observe(t, { childList: true });
}
const gt = "Shear stress due to shear force and torsion together exceeds maximum allowed.", ot = 98.0665, Tt = 1.75 * 0.0254, P = (t) => Math.max(0, t), K = (t, e = 0) => Number.isFinite(t) ? t : e;
function zt(t) {
  const e = Math.max(0, K(t.coverToBarCenter, Tt)), a = Math.max(0, K(t.compressionCoverToBarCenter, e)), o = t.h - e, i = t.b, u = Math.max(1e-9, i - 2 * e), c = Math.max(1e-9, t.h - 2 * e), n = u * c;
  return { b: i, h: t.h, d: o, dp: a, bw: i, Acp: i * t.h, pcp: 2 * (i + t.h), Aoh: n, A0: 0.85 * n, ph: 2 * u + 2 * c, coverToBarCenter: e };
}
function jt(t) {
  return Math.min(0.85, Math.max(0.65, 0.85 - 0.05 * (t - 281) / 69.5));
}
function Kt(t, e, a, o, i, u, c, n) {
  const l = t / ot, f = t / 1e3, d = e / 1e3, s = jt(l), r = 3e-3 / (3e-3 + 5e-3) * i, m = s * r, v = i * i - 2 * c / (0.85 * t * n * o), M = v <= 0 ? i : i - Math.sqrt(v), _ = Math.max(3 * Math.sqrt(f) / d * o * i, 200 / d * o * i), x = 0.04 * o * i;
  let C = 0, g = 0, O = false;
  if (c > 0) if (M <= m) C = c / Math.max(1e-12, n * e * Math.max(1e-9, i - M / 2));
  else {
    O = true;
    const k = 0.85 * t * o * m * (i - m / 2) * n, A = Math.max(0, c - k), E = (Math.min(e, a * 3e-3 * Math.max(0, r - u) / Math.max(1e-12, r)) - 0.85 * t) * (i - u) * n;
    g = E > 1e-9 ? A / E : 0;
    const h = k / Math.max(1e-12, e * (i - m / 2) * n), F = A / Math.max(1e-12, e * (i - u) * n);
    C = h + F;
  }
  const p = Math.min(x, Math.max(_, C)), b = Math.min(x, Math.max(_, g)), S = n * p * e * Math.max(0, i - M / 2), y = c <= 1e-12 ? 0 : c / Math.max(1e-12, S);
  return { Mu: c, beta1: s, cMax: r, aMax: m, a: M, AsRequired: C, AsMin: _, AsMax: x, AsTension: p, AsCompression: b, AsTop: 0, AsBottom: 0, tensionSide: c <= 1e-12 ? "none" : "bottom", compressionSteelRequired: O, flexureRatio: y };
}
function Gt(t, e, a, o, i, u) {
  const c = t / 6.894757293, n = e / (0.0254 * 0.0254), l = a / 0.0254, s = 1 + P(i) * 224.808943 / Math.max(1e-12, 4 * n * Math.sqrt(c)), r = u * Math.sqrt(c) * n * n / Math.max(1e-12, l) * 112984829e-12;
  return { Tth: 2 * r * s, Tcr: 4 * r * s };
}
function Xt(t) {
  const e = zt(t.section), a = t.material, o = t.demand, i = t.code ?? "ACI 318-19", u = P(a.fc), c = P(a.fy), n = P(a.fys ?? c), l = P(a.lambda ?? 1), f = P(a.Es ?? 2e8), d = P(a.phiFlexure ?? 0.9), s = P(a.phiShearTorsion ?? 0.75), r = P(a.phiCriticalTorsion ?? s), m = K(o.Mu), v = Math.abs(K(o.Vu)), M = Math.abs(K(o.Tu)), _ = K(o.Pu ?? 0), x = u / ot, C = u / 1e3, g = Kt(u, c, f, e.b, e.d, e.dp, Math.abs(m), d);
  m > 1e-12 ? (g.AsBottom = g.AsTension, g.AsTop = g.AsCompression, g.tensionSide = "bottom") : m < -1e-12 ? (g.AsTop = g.AsTension, g.AsBottom = g.AsCompression, g.tensionSide = "top") : (g.AsTop = g.AsMin, g.AsBottom = g.AsMin);
  const O = a.concreteShearCapacity ?? 0.53 * l * Math.sqrt(x) * ot * e.bw * e.d, p = P(O), b = p + 0.66 * Math.sqrt(C) * 1e3 * e.bw * e.d, S = s * p, y = s * b, T = P((v - S) / Math.max(1e-12, s * n * e.d)), k = P(t.stirrupSpacing ?? 0.3), A = Math.max(0.075 * Math.sqrt(C) * 1e3 * e.bw / Math.max(1, c), 0.35 * e.bw / Math.max(1, c * k)), w = Math.max(T, A), E = v <= 1e-12 ? 0 : v / Math.max(1e-12, y), h = v <= y + 1e-9, F = Gt(u, e.Acp, e.pcp, e.b * e.h, _, l), j = r * F.Tth, D = r * F.Tcr, L = M <= 1e-12 ? 0 : D / M, q = M <= D + 1e-9, B = M > j + 1e-9, N = B ? M / Math.max(1e-12, 2 * s * e.A0 * n) : 0, z = B ? M * e.ph / Math.max(1e-12, 2 * s * e.A0 * c) : 0, I = P(0.5 * Math.sqrt(C) * 1e3 * e.Acp / Math.max(1, c) - N * e.ph), W = B ? Math.max(z, I) : 0, ut = M <= D + 1e-9, mt = Math.sqrt(Math.pow(v / Math.max(1e-12, e.bw * e.d), 2) + Math.pow(M * e.ph / Math.max(1e-12, 1.7 * e.Aoh * e.Aoh), 2)), Ft = a.combinedAdditiveCoefficient ?? 2, pt = s * (p / Math.max(1e-12, e.bw * e.d) + Ft * Math.sqrt(x) * ot), ft = mt / Math.max(1e-12, pt), Z = ft <= 1 + 1e-9;
  let J = "OK", ht;
  return Z ? h ? ut || (J = "O/S T") : J = "O/S V" : (J = "O/S #45", ht = gt), { code: i, station: K(o.station), section: e, flexure: g, shear: { Vu: v, Vc: p, Vmax: b, phiVc: S, phiVmax: y, AvsRequired: T, AvsMinimum: A, Avs: w, shearRatio: E, shearPass: h }, torsion: { Tu: M, Tth: F.Tth, Tcr: F.Tcr, phiTth: j, phiTcr: D, criticalRatio: L, criticalPass: q, torsionRequired: B, AlRequired: z, AlMinimum: I, Al: W, AtOverS: N, torsionPass: ut }, interaction: { demandStress: mt, capacityStress: pt, ratio: ft, pass: Z, errorCode: Z ? void 0 : 45, error: Z ? void 0 : gt }, status: J, error: ht };
}
const et = (t) => (t == null ? void 0 : t.val) ?? (t == null ? void 0 : t.rawVal) ?? t, H = (t, e) => {
  var _a;
  const a = (_a = t == null ? void 0 : t.get) == null ? void 0 : _a.call(t, e);
  return Array.isArray(a) ? a : [0, 0];
}, vt = (t, e, a) => t + (e - t) * a, Mt = (t, e) => Math.max(Math.abs(t), Math.abs(e)), St = (t) => typeof t == "number" && Number.isFinite(t);
function _t(t, e) {
  if (e.length !== 2) return false;
  const a = t[e[0]], o = t[e[1]];
  if (!a || !o) return false;
  const i = Math.hypot(o[0] - a[0], o[1] - a[1], o[2] - a[2]);
  return i > 1e-9 && Math.abs(o[2] - a[2]) <= Math.max(0.03, i * 0.02);
}
function wt(t) {
  return !t || t.type !== "rect" || !St(t.b) || !St(t.h) || t.b <= 0 || t.h <= 0 ? null : { b: t.b, h: t.h };
}
function Wt(t, e, a) {
  var _a, _b;
  const o = e.map((d, s) => ({ element: d, index: s })).filter(({ element: d, index: s }) => {
    var _a2;
    return _t(t, d) && wt((_a2 = a == null ? void 0 : a.get) == null ? void 0 : _a2.call(a, s));
  }), i = new Map(o.map(({ index: d }) => [d, d])), u = (d) => {
    const s = i.get(d);
    if (s === void 0 || s === d) return d;
    const r = u(s);
    return i.set(d, r), r;
  }, c = (d, s) => {
    const r = u(d), m = u(s);
    r !== m && i.set(m, r);
  }, n = (d) => {
    const s = t[d[0]], r = t[d[1]];
    if (!s || !r) return null;
    const m = Math.hypot(r[0] - s[0], r[1] - s[1], r[2] - s[2]);
    return m <= 1e-9 ? null : [(r[0] - s[0]) / m, (r[1] - s[1]) / m, (r[2] - s[2]) / m];
  };
  for (let d = 0; d < o.length; d++) for (let s = d + 1; s < o.length; s++) {
    const r = o[d], m = o[s];
    if (r.element[0] !== m.element[0] && r.element[0] !== m.element[1] && r.element[1] !== m.element[0] && r.element[1] !== m.element[1]) continue;
    const v = n(r.element), M = n(m.element), _ = (_a = a == null ? void 0 : a.get) == null ? void 0 : _a.call(a, r.index), x = (_b = a == null ? void 0 : a.get) == null ? void 0 : _b.call(a, m.index);
    !v || !M || !_ || !x || _.b !== x.b || _.h !== x.h || Math.abs(v[0] * M[0] + v[1] * M[1] + v[2] * M[2]) > 0.999 && c(r.index, m.index);
  }
  const l = /* @__PURE__ */ new Map();
  let f = 1;
  for (const { index: d } of o) {
    const s = u(d);
    l.has(s) || l.set(s, f++);
  }
  return new Map(o.map(({ index: d }) => [d, `B${l.get(u(d))}`]));
}
function Ht(t, e) {
  const a = t.states, o = et(a.nodes), i = et(a.elements), u = et(a.elementInputs) ?? {}, c = et(a.analyzeOutputs) ?? {}, n = u.sectionShapes, l = c.shearsY, f = c.torsions, d = c.bendingsZ, s = c.bendingsY, r = c.normals, m = [], v = [0, 0.25, 0.5, 0.75, 1], M = Wt(o, i, n);
  return i.forEach((_, x) => {
    var _a;
    if (!_t(o, _)) return;
    const C = wt((_a = n == null ? void 0 : n.get) == null ? void 0 : _a.call(n, x));
    if (!C) return;
    const g = H(l, x), O = H(f, x), p = H(d, x), b = H(s, x), S = H(r, x), y = o[_[0]], T = o[_[1]], k = Math.hypot(T[0] - y[0], T[1] - y[1], T[2] - y[2]);
    for (const A of v) {
      const w = vt(p[0] ?? 0, p[1] ?? 0, A), E = vt(b[0] ?? 0, b[1] ?? 0, A), h = Xt({ code: e.code, section: { ...C, coverToBarCenter: e.coverM || Tt }, material: { fc: e.fcMPa * 1e3, fy: e.fyMPa * 1e3, fys: e.fyMPa * 1e3 }, demand: { Mu: Math.abs(w) >= Math.abs(E) ? w : E, Vu: Mt(g[0] ?? 0, g[1] ?? 0), Tu: Mt(O[0] ?? 0, O[1] ?? 0), Pu: Math.max(0, -(S[0] ?? 0), -(S[1] ?? 0)), station: k * A }, stirrupSpacing: e.spacingM });
      m.push({ beam: M.get(x) ?? `F${x + 1}`, element: x, station: k * A, Mu: h.flexure.Mu, Vu: h.shear.Vu, Tu: h.torsion.Tu, result: h });
    }
  }), m;
}
function U(t, e = 2) {
  return Number.isFinite(t) ? t.toFixed(e) : "\u2014";
}
function Ct(t) {
  return !t.interaction.pass || !t.shear.shearPass ? "O/S V" : t.torsion.criticalPass ? t.flexure.flexureRatio > 1 ? "O/S F" : "OK" : "O/S T";
}
function Et(t) {
  const e = /* @__PURE__ */ new Map();
  for (const a of t) {
    const o = e.get(a.beam);
    (!o || a.result.interaction.ratio > o.result.interaction.ratio) && e.set(a.beam, a);
  }
  return e;
}
function Yt(t) {
  if (!t.length) return "<div style='padding:10px;color:#aaa'>No hay barras horizontales rectangulares con resultados.</div>";
  const e = Et(t), a = t.map((o) => {
    const i = o.result, u = e.get(o.beam) === o ? Ct(i) : "", c = i.interaction.pass ? u : "See ErrMsg", n = i.interaction.error ?? "";
    return `<tr>
      <td>${o.beam}</td>
      <td>${U(o.station)}</td>
      <td>${U(o.Mu)}</td>
      <td>${U(o.Vu)}</td>
      <td>${U(o.Tu)}</td>
      <td>${U(i.flexure.AsTop * 1e4)}</td>
      <td>${U(i.flexure.AsBottom * 1e4)}</td>
      <td>${U(i.shear.Avs * 1e4)}</td>
      <td>${U(i.torsion.Al * 1e4)}</td>
      <td>${U(i.torsion.criticalRatio, 4)}</td>
      <td>${U(i.interaction.ratio, 4)}</td>
      <td>${u}</td>
      <td>${c}</td>
      <td>${n}</td>
    </tr>`;
  }).join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:11px">
    <thead><tr>${["Barra", "x(m)", "Mu", "Vu", "Tu", "AsTop", "AsBot", "Av/s", "Al", "\u03C6Tcr/Tu", "Int.", "Envelope", "Resumen", "Error"].map((o) => `<th style="padding:3px;border-bottom:1px solid #587;white-space:nowrap;color:#9cc">${o}</th>`).join("")}</tr></thead>
    <tbody>${a}</tbody>
  </table>`;
}
function Zt(t) {
  const e = "Barra,Estacion_m,Mu_kNm,Vu_kN,Tu_kNm,AsTop_cm2,AsBot_cm2,Avs_cm2_m,Al_cm2,phiTcr_Tu,Interaction,Envelope,Resumen,Error", a = Et(t), o = t.map((n) => {
    const l = n.result;
    return [n.beam, n.station.toFixed(4), n.Mu.toFixed(4), n.Vu.toFixed(4), n.Tu.toFixed(4), (l.flexure.AsTop * 1e4).toFixed(4), (l.flexure.AsBottom * 1e4).toFixed(4), (l.shear.Avs * 1e4).toFixed(4), (l.torsion.Al * 1e4).toFixed(4), l.torsion.criticalRatio.toFixed(4), l.interaction.ratio.toFixed(4), a.get(n.beam) === n ? Ct(l) : "", l.interaction.pass ? "" : "See ErrMsg", l.interaction.error ?? ""].map((f) => `"${String(f).replace(/"/g, '""')}"`).join(",");
  }), i = new Blob([[e, ...o].join(`
`)], { type: "text/csv;charset=utf-8" }), u = URL.createObjectURL(i), c = document.createElement("a");
  c.href = u, c.download = "diseno-vigas-hormigon.csv", c.click(), URL.revokeObjectURL(u);
}
function pe(t) {
  if (document.getElementById("hk-diseno-vigas-btn")) return;
  const e = document.createElement("button");
  e.id = "hk-diseno-vigas-btn", e.textContent = "\u25A3 Vigas RC", e.title = "Dise\xF1o ETABS-style de vigas de hormig\xF3n: flexi\xF3n, cortante y torsi\xF3n", e.style.cssText = "position:fixed;top:60px;right:12px;z-index:950;padding:4px 10px;background:#1f3b5a;color:#fff;border:1px solid #4a7fb0;border-radius:4px;font:12px sans-serif;cursor:pointer", Vt({ id: "diseno-vigas-rc", orden: 4, icono: "\u25A3", titulo: "Vigas de hormig\xF3n RC", detalle: "Flexi\xF3n, cortante, torsi\xF3n y chequeo O/S #45.", abrir: () => e.click() });
  const a = document.createElement("div");
  a.id = "hk-diseno-vigas", a.style.cssText = "position:fixed;top:90px;right:12px;z-index:950;width:min(1100px,calc(100vw - 24px));max-height:78vh;overflow:auto;background:rgba(24,28,34,.97);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px;display:none", a.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>Dise\xF1o de vigas RC \xB7 ACI 318-14/19</b><span id="hkdv-x" style="cursor:pointer">\u2715</span></div>
    <div style="margin:6px 0;color:#9cc">Los resultados usan el caso/combinaci\xF3n visible. Las unidades de entrada son MPa, cm y m.</div>
    <fieldset style="border:1px solid #445;padding:5px"><legend>Material y Norma</legend>
      <label>Norma <select id="hkdv-code"><option>ACI 318-19</option><option>ACI 318-14</option></select></label>
      <label>f'c <input id="hkdv-fc" type="number" value="27.58" step="0.01" style="width:58px"> MPa</label>
      <label>fy <input id="hkdv-fy" type="number" value="420" step="1" style="width:58px"> MPa</label>
      <label>c <input id="hkdv-cover" type="number" value="4.445" step="0.05" style="width:58px"> cm</label>
      <label>s <input id="hkdv-space" type="number" value="30" step="1" style="width:58px"> cm</label>
      <button id="hkdv-run" style="background:#2d6a2d;color:#fff">Calcular</button>
      <button id="hkdv-csv">CSV</button>
    </fieldset>
    <div id="hkdv-info" style="margin:5px 0;color:#ffb"></div>
    <div id="hkdv-res"></div>`, document.body.append(e, a);
  const o = (n) => a.querySelector("#" + n), i = () => ({ code: o("hkdv-code").value, fcMPa: Number(o("hkdv-fc").value), fyMPa: Number(o("hkdv-fy").value), coverM: Number(o("hkdv-cover").value) / 100, spacingM: Number(o("hkdv-space").value) / 100 });
  let u = [];
  const c = () => {
    const n = t ?? { states: window.__hekatanStates };
    if (!(n == null ? void 0 : n.states)) {
      o("hkdv-info").textContent = "No hay estados del modelo.";
      return;
    }
    try {
      u = Ht(n, i());
      const l = u.filter((s) => !s.result.interaction.pass).length, f = u.filter((s) => !s.result.torsion.criticalPass).length, d = new Set(u.map((s) => s.beam)).size;
      o("hkdv-info").textContent = `${d} barras \xB7 ${l} estaciones O/S #45 \xB7 ${f} estaciones fuera de \u03C6Tcr`, o("hkdv-res").innerHTML = Yt(u);
    } catch (l) {
      o("hkdv-info").textContent = `Error: ${(l == null ? void 0 : l.message) ?? l}`;
    }
  };
  e.onclick = () => {
    a.style.display = a.style.display === "none" ? "block" : "none", a.style.display === "block" && c();
  }, o("hkdv-x").onclick = () => {
    a.style.display = "none";
  }, o("hkdv-run").onclick = c, o("hkdv-csv").onclick = () => Zt(u);
}
export {
  oe as a,
  ae as b,
  se as c,
  V as d,
  Rt as e,
  R as f,
  Ut as g,
  te as h,
  de as i,
  xt as j,
  rt as k,
  it as l,
  pe as m,
  ct as n,
  le as o,
  re as p,
  ie as q,
  ce as r,
  G as s,
  ee as t,
  ne as u,
  me as v,
  Vt as w,
  Ot as x,
  ue as y
};
