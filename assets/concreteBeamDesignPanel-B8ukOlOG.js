import { M as Ft, m as gt } from "./modeScale-sgWZ-KrB.js";
import { v as R } from "./Text-C1TX4d8g.js";
import { r as qt, __tla as __tla_0 } from "./aiAgent-D29HUSaa.js";
let re, ie, ce, B, Nt, N, Vt, oe, pe, vt, rt, it, be, ct, me, le, de, ue, G, ae, se, fe, Lt, Ut, he;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const Rt = 4.4, Pt = 1.1, It = Rt / Pt;
  oe = function(t) {
    const { mesh: e, viewerElm: a, onStatusChange: o } = t, c = t.scalePercent ?? Ft, [r, d] = t.visFrequencyRange ?? [
      0.5,
      3
    ];
    let n = null, l = 0, h = 0, u = [], s = [], i = null;
    function m() {
      var _a;
      return a.__settings ?? ((_a = a.__ctx) == null ? void 0 : _a.settings);
    }
    function M() {
      o == null ? void 0 : o();
    }
    function S() {
      var _a;
      if (!n || !n.frequencies || n.frequencies.length === 0) return {
        mode: "Sin resultados",
        frequency: "\u2014",
        period: "\u2014",
        dominant: "\u2014",
        state: "\u23F8 Detenido"
      };
      const f = n.frequencies[l] ?? 0, x = f > 0 ? 1 / f : 0, y = [
        "Ux",
        "Uy",
        "Uz",
        "Rx",
        "Ry",
        "Rz"
      ], k = (_a = n.massParticipation) == null ? void 0 : _a[l];
      let T = "\u2014";
      if (k) {
        let A = 0, $ = 0;
        for (let w = 0; w < 6; w++) Math.abs(k[w]) > A && (A = Math.abs(k[w]), $ = w);
        T = `${y[$]} (${(A * 100).toFixed(0)}%)`;
      }
      return {
        mode: `Modo ${l + 1} / ${n.frequencies.length}`,
        frequency: `${f.toFixed(4)} Hz`,
        period: `${x.toFixed(4)} s`,
        dominant: T,
        state: h !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado"
      };
    }
    function _() {
      return a.__ctx;
    }
    function g(f) {
      return f.length > 0 && f.length === e.nodes.rawVal.length;
    }
    function E(f) {
      var _a;
      if (h && (cancelAnimationFrame(h), h = 0), f) {
        const x = m();
        (x == null ? void 0 : x.deformedShape) && i !== null && (x.deformedShape.val = i, i = null);
        const y = g(u) ? u : g(s) ? s : [];
        y.length > 0 ? (e.nodes.val = y.map((k) => [
          ...k
        ]), (_a = _()) == null ? void 0 : _a.render()) : (u = [], s = []);
      }
    }
    function v() {
      var _a, _b;
      if (!n || !n.modeShapes || n.modeShapes.length === 0 || !n.modeShapes[l]) return;
      E(false);
      const f = m();
      (f == null ? void 0 : f.deformedShape) && (i === null && (i = f.deformedShape.val), f.deformedShape.val = false);
      const x = n.modeShapes[l], y = ((_a = n.frequencies) == null ? void 0 : _a[l]) || 1, k = ((_b = n.frequencies) == null ? void 0 : _b[0]) || 1, T = t.velocidadPorFrecuencia ? Math.max(r, Math.min(d, y / k)) : 1 / (t.periodoVisible ?? It);
      g(u) || (u = e.nodes.rawVal.map((q) => [
        ...q
      ])), s = u.map((q) => [
        ...q
      ]);
      const A = s.length, $ = Math.floor(x.length / 6);
      if ($ !== A) {
        console.warn(`[animateMode] el modo es de otra malla: ${$} nudos contra ${A} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
        return;
      }
      const w = gt(s);
      let C = 0;
      for (let q = 0; q < A; q++) {
        const U = x[q * 6] || 0, O = x[q * 6 + 1] || 0, j = x[q * 6 + 2] || 0, P = Math.sqrt(U * U + O * O + j * j);
        P > C && (C = P);
      }
      const b = C > 1e-12 ? w * c / 100 / C : 1, F = performance.now(), z = A > 4e3 ? 100 : A > 1500 ? 66 : 0;
      let D = -1 / 0;
      const L = () => {
        var _a2;
        const q = performance.now();
        if (q - D < z) {
          h = requestAnimationFrame(L);
          return;
        }
        D = q;
        const U = (q - F) / 1e3, O = Math.sin(2 * Math.PI * T * U) * b, j = new Array(A);
        for (let P = 0; P < A; P++) {
          const W = s[P];
          j[P] = [
            W[0] + (x[P * 6] || 0) * O,
            W[1] + (x[P * 6 + 1] || 0) * O,
            W[2] + (x[P * 6 + 2] || 0) * O
          ];
        }
        e.nodes.val = j, (_a2 = _()) == null ? void 0 : _a2.render(), h = requestAnimationFrame(L);
      };
      h = requestAnimationFrame(L), M();
    }
    function V(f) {
      var _a, _b;
      if (!n || !n.modeShapes || !n.modeShapes[f]) return;
      E(false);
      const x = m();
      (x == null ? void 0 : x.deformedShape) && (i === null && (i = x.deformedShape.val), x.deformedShape.val = false), l = Math.max(0, Math.min((((_a = n.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, f));
      const y = n.modeShapes[l];
      g(u) || (u = e.nodes.rawVal.map((b) => [
        ...b
      ]));
      const k = u.map((b) => [
        ...b
      ]), T = k.length;
      if (Math.floor(y.length / 6) !== T) {
        console.warn(`[animateMode] el modo estatico es de otra malla: ${Math.floor(y.length / 6)} nudos contra ${T} en pantalla. No lo dibujo.`);
        return;
      }
      const A = gt(k);
      let $ = 0;
      for (let b = 0; b < T; b++) {
        const F = y[b * 6] || 0, z = y[b * 6 + 1] || 0, D = y[b * 6 + 2] || 0, L = Math.sqrt(F * F + z * z + D * D);
        L > $ && ($ = L);
      }
      const w = $ > 1e-12 ? A * c / 100 / $ : 1, C = new Array(T);
      for (let b = 0; b < T; b++) {
        const F = k[b];
        C[b] = [
          F[0] + (y[b * 6] || 0) * w,
          F[1] + (y[b * 6 + 1] || 0) * w,
          F[2] + (y[b * 6 + 2] || 0) * w
        ];
      }
      e.nodes.val = C, (_b = _()) == null ? void 0 : _b.render(), M();
    }
    return {
      setResults(f) {
        var _a;
        n = f, l >= (((_a = f == null ? void 0 : f.frequencies) == null ? void 0 : _a.length) ?? 0) && (l = 0), u = e.nodes.rawVal.map((x) => [
          ...x
        ]), M();
      },
      setMode(f) {
        var _a;
        if (!n) return;
        const x = ((_a = n.frequencies) == null ? void 0 : _a.length) ?? 0;
        l = Math.max(0, Math.min(x - 1, f)), h !== 0 ? v() : M();
      },
      showStatic(f) {
        V(f);
      },
      play() {
        n && h === 0 && v();
      },
      stop() {
        E(true), M();
      },
      isPlaying() {
        return h !== 0;
      },
      pause() {
        h && (cancelAnimationFrame(h), h = 0), M();
      },
      modeCount() {
        var _a;
        return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a.length) ?? 0;
      },
      currentMode() {
        return l;
      },
      currentFreq() {
        var _a;
        return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a[l]) ?? 0;
      },
      getStatus() {
        return S();
      },
      dispose() {
        E(true), n = null;
      }
    };
  };
  N = R.state(localStorage.getItem("hk_forceUnit") || "tonf");
  B = R.state(localStorage.getItem("hk_dispUnit") || "mm");
  R.derive(() => {
    localStorage.setItem("hk_forceUnit", N.val), window.__hekatanForceUnit = N.val;
  });
  R.derive(() => {
    localStorage.setItem("hk_dispUnit", B.val), window.__hekatanDispUnit = B.val;
  });
  const st = {
    kN: 1,
    tonf: 9.80665,
    kip: 4.4482216
  };
  ae = function(t, e) {
    return t * st[N.val];
  };
  Nt = function(t, e) {
    return t / st[e ?? N.val];
  };
  function Dt(t) {
    return 1 / $t[Y.val];
  }
  function At(t, e) {
    return st[N.val] * Dt();
  }
  se = function(t, e) {
    return t * At();
  };
  Vt = function(t, e) {
    return t / At();
  };
  const $t = {
    mm: 1e3,
    cm: 100,
    m: 1,
    in: 39.3700787402,
    ft: 3.280839895
  };
  Ut = function(t, e) {
    return t * $t[e ?? B.val];
  };
  re = function(t, e = 2) {
    const a = B.val;
    return `${Ut(t, a).toFixed(e)} ${a}`;
  };
  ie = function(t, e = 2) {
    const a = N.val;
    return `${Nt(t, a).toFixed(e)} ${a}`;
  };
  ce = function(t, e = 2) {
    return `${Vt(t).toFixed(e)} ${Tt()}`;
  };
  function Tt() {
    return `${N.val}\xB7${Y.val}`;
  }
  le = function() {
    return `(${N.val})`;
  };
  de = function() {
    return `(${Tt()})`;
  };
  ue = function() {
    return `(${B.val})`;
  };
  me = function(t) {
    return t.replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "").replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "").trim();
  };
  G = R.state(localStorage.getItem("hk_stressUnit") || "tonf/m\xB2");
  R.derive(() => {
    localStorage.setItem("hk_stressUnit", G.val), window.__hekatanStressUnit = G.val;
  });
  rt = R.state(localStorage.getItem("hk_subgradeUnit") || "tonf/m\xB3");
  R.derive(() => {
    localStorage.setItem("hk_subgradeUnit", rt.val);
  });
  it = R.state(localStorage.getItem("hk_stiffTransUnit") || "tonf/m");
  R.derive(() => {
    localStorage.setItem("hk_stiffTransUnit", it.val);
  });
  ct = R.state(localStorage.getItem("hk_lengthSectionUnit") || "mm");
  R.derive(() => {
    localStorage.setItem("hk_lengthSectionUnit", ct.val);
  });
  const Y = R.state(localStorage.getItem("hk_lengthStructureUnit") || "m");
  R.derive(() => {
    localStorage.setItem("hk_lengthStructureUnit", Y.val);
  });
  const lt = {
    "Metric MKS": {
      force: "tonf",
      disp: "mm",
      stress: "kgf/cm\xB2",
      subgrade: "tonf/m\xB3",
      stiffTrans: "tonf/m",
      lengthSection: "cm",
      lengthStructure: "m"
    },
    "Metric SI": {
      force: "kN",
      disp: "mm",
      stress: "MPa",
      subgrade: "kN/m\xB3",
      stiffTrans: "kN/m",
      lengthSection: "mm",
      lengthStructure: "m"
    },
    "U.S. Imperial": {
      force: "kip",
      disp: "in",
      stress: "ksi",
      subgrade: "kip/ft\xB3",
      stiffTrans: "kip/in",
      lengthSection: "in",
      lengthStructure: "ft"
    }
  };
  vt = function(t) {
    const e = lt[t];
    N.val = e.force, B.val = e.disp, G.val = e.stress, rt.val = e.subgrade, it.val = e.stiffTrans, ct.val = e.lengthSection, Y.val = e.lengthStructure, localStorage.setItem("hk_unitsPreset", t), window.__hekatanForceUnit = N.val, window.__hekatanDispUnit = B.val, window.__hekatanStressUnit = G.val;
  };
  (() => {
    const t = localStorage.getItem("hk_unitsPreset");
    t ? t !== "Custom" && t in lt ? vt(t) : (window.__hekatanForceUnit = N.val, window.__hekatanDispUnit = B.val, window.__hekatanStressUnit = G.val) : vt("Metric MKS");
  })();
  pe = function() {
    for (const [t, e] of Object.entries(lt)) if (e.force === N.val && e.disp === B.val && e.stress === G.val && e.subgrade === rt.val && e.stiffTrans === it.val && e.lengthSection === ct.val && e.lengthStructure === Y.val) return t;
    return "Custom";
  };
  const nt = {
    analisis: [
      {
        id: "estatico",
        orden: 1,
        icono: "\u25B6",
        titulo: "Analizar (est\xE1tico)",
        detalle: "Resuelve el modelo con el caso o la combinaci\xF3n elegida en \xABResultados\xBB.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
        }
      },
      {
        id: "modal",
        orden: 2,
        icono: "\u3030",
        titulo: "Modal + animar",
        detalle: "Periodos, modos y participaci\xF3n de masa; anima el modo elegido.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanRunModalAnimate) == null ? void 0 : _a.call(window);
        }
      },
      {
        id: "parar",
        orden: 3,
        icono: "\u25A0",
        titulo: "Parar animaci\xF3n",
        detalle: "Detiene la animaci\xF3n del modo.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanModalStop) == null ? void 0 : _a.call(window);
        }
      }
    ],
    diseno: [],
    exportar: [
      {
        id: "e2k",
        orden: 1,
        icono: "\u{1F3D7}",
        titulo: "ETABS (.e2k)",
        detalle: "El modelo entero, para abrirlo en ETABS.",
        abrir: () => Q("E2K", "ETABS")
      },
      {
        id: "s2k",
        orden: 2,
        icono: "\u{1F4D0}",
        titulo: "SAP2000 (.s2k)",
        detalle: "El modelo entero, para abrirlo en SAP2000.",
        abrir: () => Q("S2K", "SAP2000")
      },
      {
        id: "f2k",
        orden: 3,
        icono: "\u{1FAA8}",
        titulo: "SAFE (.f2k) \u2014 cimentaci\xF3n",
        detalle: "La cimentaci\xF3n con sus muelles, para SAFE.",
        abrir: () => Q("F2K", "SAFE")
      },
      {
        id: "tcl",
        orden: 4,
        icono: "\u{1F9EE}",
        titulo: "OpenSees (.tcl)",
        detalle: "El guion de OpenSees, para comprobarlo aparte.",
        abrir: () => Q(".tcl", "OpenSees")
      },
      {
        id: "dwg",
        orden: 5,
        icono: "\u{1F4D0}",
        titulo: "AutoCAD (.dwg) \u2014 geometr\xEDa",
        detalle: "Barras y \xE1reas en capas COLUMNAS, VIGAS, DIAGONALES, LOSAS, MUROS.",
        abrir: () => tt("Exportar DWG", "DWG")
      },
      {
        id: "dxf",
        orden: 6,
        icono: "\u{1F4C4}",
        titulo: "DXF \u2014 geometr\xEDa",
        detalle: "Lo mismo en DXF de texto: lo abre cualquier CAD.",
        abrir: () => tt("Exportar DXF", "DXF")
      },
      {
        id: "idwg",
        orden: 7,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF (3D o planta)",
        detalle: "L\xEDneas \u2192 barras con sus nudos; 3DFACE \u2192 \xE1reas. Salta ejes, cotas y textos.",
        abrir: () => tt("Importar DWG/DXF (3D", "DWG")
      },
      {
        id: "idwgxz",
        orden: 8,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF como alzado (XZ)",
        detalle: "Un p\xF3rtico dibujado en 2D: la Y del plano pasa a ser la altura Z.",
        abrir: () => tt("como alzado (XZ)", "DWG")
      }
    ]
  };
  function Q(t, e) {
    const o = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((c) => {
      const r = (c.textContent || "").replace(/\s+/g, " ").trim();
      return r.includes("Exportar") && r.includes(t) && r.length < 60;
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
  const Ot = {
    analisis: "\u25B6 An\xE1lisis",
    diseno: "\u{1F4D0} Dise\xF1o",
    exportar: "\u{1F4E4} Exportar"
  }, Bt = {
    analisis: "An\xE1lisis \u2014 elige qu\xE9 calcular:",
    diseno: "Dise\xF1o \u2014 elige qu\xE9 hacer:",
    exportar: "Exportar el modelo a otro programa:"
  };
  he = function() {
    dt();
  };
  Lt = function(t) {
    const e = nt.diseno;
    e.some((a) => a.id === t.id) || (e.push(t), e.sort((a, o) => a.orden - o.orden)), dt();
  };
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
    const c = (s) => {
      const i = document.getElementById(s);
      if (!i) return false;
      const m = i.style.display !== "none";
      return i.removeAttribute("style"), i.className = "piel", m || (i.style.display = "none"), o.appendChild(i), true;
    };
    let r = 0;
    const d = () => {
      const s = c("hk-home-btn"), i = c("hk-back-btn");
      (!s || !i) && ++r < 20 && setTimeout(d, 400);
    };
    (() => {
      for (const s of [
        "analisis",
        "diseno",
        "exportar"
      ]) {
        const i = document.createElement("button");
        i.id = `hk-${s}-btn`, i.className = "piel", i.textContent = Ot[s] + " \u25BE", i.onclick = (m) => {
          m.stopPropagation(), jt(s, i);
        }, o.appendChild(i);
      }
    })(), d();
    const l = () => {
      const s = o.querySelector("#hk-analisis-btn");
      for (const i of [
        "hk-back-btn",
        "hk-home-btn"
      ]) {
        const m = document.getElementById(i);
        m && s && m.parentElement === o && o.insertBefore(m, s);
      }
    };
    for (const s of [
      500,
      1200,
      2500,
      5e3
    ]) setTimeout(l, s);
    const h = window, u = h.__hekatanActualizarBotonVolver;
    h.__hekatanActualizarBotonVolver = (s) => {
      u == null ? void 0 : u(s);
      const i = document.getElementById("hk-back-btn");
      i && (i.style.display = s ? "" : "none");
    }, document.addEventListener("click", (s) => {
      X && !X.contains(s.target) && at();
    });
  }
  function at() {
    X == null ? void 0 : X.remove(), X = null;
  }
  function jt(t, e) {
    const a = (X == null ? void 0 : X.dataset.menu) === t;
    if (at(), a) return;
    const o = document.createElement("div");
    o.dataset.menu = t, o.id = `hk-${t}-menu`, o.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
    const c = nt[t].length === 0 ? '<div style="padding:8px;opacity:.8;line-height:1.5">Todav\xEDa no hay nada aqu\xED.<br>Las opciones de dise\xF1o las trae el modelo: abre una plantilla o un ejemplo con cimentaci\xF3n o zapata y volver\xE1n a aparecer en este men\xFA.</div>' : "";
    o.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${Bt[t]}</div>` + c + nt[t].map((d) => `<div data-id="${d.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${d.icono} ${d.titulo}</b><div style="opacity:.75;margin-top:2px">${d.detalle}</div></div>`).join(""), o.querySelectorAll("[data-id]").forEach((d) => {
      d.onmouseenter = () => d.style.background = "#1f3b5a", d.onmouseleave = () => d.style.background = "", d.onclick = () => {
        var _a;
        at(), (_a = nt[t].find((n) => n.id === d.dataset.id)) == null ? void 0 : _a.abrir();
      };
    }), document.body.appendChild(o);
    const r = e.getBoundingClientRect();
    o.style.top = r.bottom + 4 + "px", o.style.left = Math.max(8, Math.min(r.left, innerWidth - 370)) + "px", X = o;
  }
  fe = function(t) {
    let e = false, a = 0, o = 0;
    const c = (n) => {
      const l = t.firstElementChild;
      return !!l && l.contains(n);
    }, r = () => {
      const n = t.dataset.plegado !== "1";
      t.dataset.plegado = n ? "1" : "0", [
        ...t.children
      ].slice(1).forEach((l) => l.style.display = n ? "none" : ""), t.style.overflow = n ? "hidden" : "auto";
    };
    t.addEventListener("pointerdown", (n) => {
      if (!c(n.target)) return;
      const l = n.target;
      if (l.closest("[data-plegar]")) {
        r();
        return;
      }
      if (l.closest("button,select,input,[id$='-x']")) return;
      const h = t.getBoundingClientRect();
      e = true, a = n.clientX - h.left, o = n.clientY - h.top, t.setPointerCapture(n.pointerId), n.preventDefault();
    }), t.addEventListener("pointermove", (n) => {
      e && (t.style.left = Math.min(Math.max(0, n.clientX - a), innerWidth - 80) + "px", t.style.top = Math.min(Math.max(30, n.clientY - o), innerHeight - 30) + "px", t.style.right = "auto");
    }), t.addEventListener("pointerup", () => {
      e = false;
    }), t.addEventListener("dblclick", (n) => {
      c(n.target) && !n.target.closest("[data-plegar]") && r();
    });
    const d = () => {
      const n = t.firstElementChild;
      if (!n || n.dataset.barra === "1") return;
      n.dataset.barra = "1", n.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", n.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
      const l = n.querySelector("b");
      l && !l.textContent.startsWith("\u283F") && (l.textContent = "\u283F " + l.textContent);
    };
    d(), new MutationObserver(d).observe(t, {
      childList: true
    });
  };
  const Mt = "Shear stress due to shear force and torsion together exceeds maximum allowed.", ot = 98.0665, _t = 1.75 * 0.0254, I = (t) => Math.max(0, t), K = (t, e = 0) => Number.isFinite(t) ? t : e;
  function zt(t) {
    const e = Math.max(0, K(t.coverToBarCenter, _t)), a = Math.max(0, K(t.compressionCoverToBarCenter, e)), o = t.h - e, c = t.b, r = Math.max(1e-9, c - 2 * e), d = Math.max(1e-9, t.h - 2 * e), n = r * d;
    return {
      b: c,
      h: t.h,
      d: o,
      dp: a,
      bw: c,
      Acp: c * t.h,
      pcp: 2 * (c + t.h),
      Aoh: n,
      A0: 0.85 * n,
      ph: 2 * r + 2 * d,
      coverToBarCenter: e
    };
  }
  function Kt(t) {
    return Math.min(0.85, Math.max(0.65, 0.85 - 0.05 * (t - 281) / 69.5));
  }
  function Gt(t, e, a, o, c, r, d, n) {
    const l = t / ot, h = t / 1e3, u = e / 1e3, s = Kt(l), i = 3e-3 / (3e-3 + 5e-3) * c, m = s * i, M = c * c - 2 * d / (0.85 * t * n * o), S = M <= 0 ? c : c - Math.sqrt(M), _ = Math.max(3 * Math.sqrt(h) / u * o * c, 200 / u * o * c), g = 0.04 * o * c;
    let E = 0, v = 0, V = false;
    if (d > 0) if (S <= m) E = d / Math.max(1e-12, n * e * Math.max(1e-9, c - S / 2));
    else {
      V = true;
      const A = 0.85 * t * o * m * (c - m / 2) * n, $ = Math.max(0, d - A), C = (Math.min(e, a * 3e-3 * Math.max(0, i - r) / Math.max(1e-12, i)) - 0.85 * t) * (c - r) * n;
      v = C > 1e-9 ? $ / C : 0;
      const b = A / Math.max(1e-12, e * (c - m / 2) * n), F = $ / Math.max(1e-12, e * (c - r) * n);
      E = b + F;
    }
    const f = Math.min(g, Math.max(_, E)), x = Math.min(g, Math.max(_, v)), y = n * f * e * Math.max(0, c - S / 2), k = d <= 1e-12 ? 0 : d / Math.max(1e-12, y);
    return {
      Mu: d,
      beta1: s,
      cMax: i,
      aMax: m,
      a: S,
      AsRequired: E,
      AsMin: _,
      AsMax: g,
      AsTension: f,
      AsCompression: x,
      AsTop: 0,
      AsBottom: 0,
      tensionSide: d <= 1e-12 ? "none" : "bottom",
      compressionSteelRequired: V,
      flexureRatio: k
    };
  }
  function Xt(t, e, a, o, c, r) {
    const d = t / 6.894757293, n = e / (0.0254 * 0.0254), l = a / 0.0254, s = 1 + I(c) * 224.808943 / Math.max(1e-12, 4 * n * Math.sqrt(d)), i = r * Math.sqrt(d) * n * n / Math.max(1e-12, l) * 112984829e-12;
    return {
      Tth: 2 * i * s,
      Tcr: 4 * i * s
    };
  }
  function Wt(t) {
    const e = zt(t.section), a = t.material, o = t.demand, c = t.code ?? "ACI 318-19", r = I(a.fc), d = I(a.fy), n = I(a.fys ?? d), l = I(a.lambda ?? 1), h = I(a.Es ?? 2e8), u = I(a.phiFlexure ?? 0.9), s = I(a.phiShearTorsion ?? 0.75), i = I(a.phiCriticalTorsion ?? s), m = K(o.Mu), M = Math.abs(K(o.Vu)), S = Math.abs(K(o.Tu)), _ = K(o.Pu ?? 0), g = r / ot, E = r / 1e3, v = Gt(r, d, h, e.b, e.d, e.dp, Math.abs(m), u);
    m > 1e-12 ? (v.AsBottom = v.AsTension, v.AsTop = v.AsCompression, v.tensionSide = "bottom") : m < -1e-12 ? (v.AsTop = v.AsTension, v.AsBottom = v.AsCompression, v.tensionSide = "top") : (v.AsTop = v.AsMin, v.AsBottom = v.AsMin);
    const V = a.concreteShearCapacity ?? 0.53 * l * Math.sqrt(g) * ot * e.bw * e.d, f = I(V), x = f + 0.66 * Math.sqrt(E) * 1e3 * e.bw * e.d, y = s * f, k = s * x, T = I((M - y) / Math.max(1e-12, s * n * e.d)), A = I(t.stirrupSpacing ?? 0.3), $ = Math.max(0.075 * Math.sqrt(E) * 1e3 * e.bw / Math.max(1, d), 0.35 * e.bw / Math.max(1, d * A)), w = Math.max(T, $), C = M <= 1e-12 ? 0 : M / Math.max(1e-12, k), b = M <= k + 1e-9, F = Xt(r, e.Acp, e.pcp, e.b * e.h, _, l), z = i * F.Tth, D = i * F.Tcr, L = S <= 1e-12 ? 0 : D / S, q = S <= D + 1e-9, U = S > z + 1e-9, O = U ? S / Math.max(1e-12, 2 * s * e.A0 * n) : 0, j = U ? S * e.ph / Math.max(1e-12, 2 * s * e.A0 * d) : 0, P = I(0.5 * Math.sqrt(E) * 1e3 * e.Acp / Math.max(1, d) - O * e.ph), W = U ? Math.max(j, P) : 0, pt = S <= D + 1e-9, ht = Math.sqrt(Math.pow(M / Math.max(1e-12, e.bw * e.d), 2) + Math.pow(S * e.ph / Math.max(1e-12, 1.7 * e.Aoh * e.Aoh), 2)), Ct = a.combinedAdditiveCoefficient ?? 2, ft = s * (f / Math.max(1e-12, e.bw * e.d) + Ct * Math.sqrt(g) * ot), bt = ht / Math.max(1e-12, ft), Z = bt <= 1 + 1e-9;
    let J = "OK", xt;
    return Z ? b ? pt || (J = "O/S T") : J = "O/S V" : (J = "O/S #45", xt = Mt), {
      code: c,
      station: K(o.station),
      section: e,
      flexure: v,
      shear: {
        Vu: M,
        Vc: f,
        Vmax: x,
        phiVc: y,
        phiVmax: k,
        AvsRequired: T,
        AvsMinimum: $,
        Avs: w,
        shearRatio: C,
        shearPass: b
      },
      torsion: {
        Tu: S,
        Tth: F.Tth,
        Tcr: F.Tcr,
        phiTth: z,
        phiTcr: D,
        criticalRatio: L,
        criticalPass: q,
        torsionRequired: U,
        AlRequired: j,
        AlMinimum: P,
        Al: W,
        AtOverS: O,
        torsionPass: pt
      },
      interaction: {
        demandStress: ht,
        capacityStress: ft,
        ratio: bt,
        pass: Z,
        errorCode: Z ? void 0 : 45,
        error: Z ? void 0 : Mt
      },
      status: J,
      error: xt
    };
  }
  const et = (t) => (t == null ? void 0 : t.val) ?? (t == null ? void 0 : t.rawVal) ?? t, H = (t, e) => {
    var _a;
    const a = (_a = t == null ? void 0 : t.get) == null ? void 0 : _a.call(t, e);
    return Array.isArray(a) ? a : [
      0,
      0
    ];
  }, St = (t, e, a) => t + (e - t) * a, yt = (t, e) => Math.max(Math.abs(t), Math.abs(e)), kt = (t) => typeof t == "number" && Number.isFinite(t);
  function wt(t, e) {
    if (e.length !== 2) return false;
    const a = t[e[0]], o = t[e[1]];
    if (!a || !o) return false;
    const c = Math.hypot(o[0] - a[0], o[1] - a[1], o[2] - a[2]);
    return c > 1e-9 && Math.abs(o[2] - a[2]) <= Math.max(0.03, c * 0.02);
  }
  function Et(t) {
    return !t || t.type !== "rect" || !kt(t.b) || !kt(t.h) || t.b <= 0 || t.h <= 0 ? null : {
      b: t.b,
      h: t.h
    };
  }
  function Ht(t, e, a) {
    var _a, _b;
    const o = e.map((u, s) => ({
      element: u,
      index: s
    })).filter(({ element: u, index: s }) => {
      var _a2;
      return wt(t, u) && Et((_a2 = a == null ? void 0 : a.get) == null ? void 0 : _a2.call(a, s));
    }), c = new Map(o.map(({ index: u }) => [
      u,
      u
    ])), r = (u) => {
      const s = c.get(u);
      if (s === void 0 || s === u) return u;
      const i = r(s);
      return c.set(u, i), i;
    }, d = (u, s) => {
      const i = r(u), m = r(s);
      i !== m && c.set(m, i);
    }, n = (u) => {
      const s = t[u[0]], i = t[u[1]];
      if (!s || !i) return null;
      const m = Math.hypot(i[0] - s[0], i[1] - s[1], i[2] - s[2]);
      return m <= 1e-9 ? null : [
        (i[0] - s[0]) / m,
        (i[1] - s[1]) / m,
        (i[2] - s[2]) / m
      ];
    };
    for (let u = 0; u < o.length; u++) for (let s = u + 1; s < o.length; s++) {
      const i = o[u], m = o[s];
      if (i.element[0] !== m.element[0] && i.element[0] !== m.element[1] && i.element[1] !== m.element[0] && i.element[1] !== m.element[1]) continue;
      const M = n(i.element), S = n(m.element), _ = (_a = a == null ? void 0 : a.get) == null ? void 0 : _a.call(a, i.index), g = (_b = a == null ? void 0 : a.get) == null ? void 0 : _b.call(a, m.index);
      !M || !S || !_ || !g || _.b !== g.b || _.h !== g.h || Math.abs(M[0] * S[0] + M[1] * S[1] + M[2] * S[2]) > 0.999 && d(i.index, m.index);
    }
    const l = /* @__PURE__ */ new Map();
    let h = 1;
    for (const { index: u } of o) {
      const s = r(u);
      l.has(s) || l.set(s, h++);
    }
    return new Map(o.map(({ index: u }) => [
      u,
      `B${l.get(r(u))}`
    ]));
  }
  function Yt(t, e) {
    const a = t.states, o = et(a.nodes), c = et(a.elements), r = et(a.elementInputs) ?? {}, d = et(a.analyzeOutputs) ?? {}, n = r.sectionShapes, l = d.shearsY, h = d.torsions, u = d.bendingsZ, s = d.bendingsY, i = d.normals, m = [], M = [
      0,
      0.25,
      0.5,
      0.75,
      1
    ], S = Ht(o, c, n);
    return c.forEach((_, g) => {
      var _a;
      if (!wt(o, _)) return;
      const E = Et((_a = n == null ? void 0 : n.get) == null ? void 0 : _a.call(n, g));
      if (!E) return;
      const v = H(l, g), V = H(h, g), f = H(u, g), x = H(s, g), y = H(i, g), k = o[_[0]], T = o[_[1]], A = Math.hypot(T[0] - k[0], T[1] - k[1], T[2] - k[2]);
      for (const $ of M) {
        const w = St(f[0] ?? 0, f[1] ?? 0, $), C = St(x[0] ?? 0, x[1] ?? 0, $), b = Wt({
          code: e.code,
          section: {
            ...E,
            coverToBarCenter: e.coverM || _t
          },
          material: {
            fc: e.fcMPa * 1e3,
            fy: e.fyMPa * 1e3,
            fys: e.fyMPa * 1e3
          },
          demand: {
            Mu: Math.abs(w) >= Math.abs(C) ? w : C,
            Vu: yt(v[0] ?? 0, v[1] ?? 0),
            Tu: yt(V[0] ?? 0, V[1] ?? 0),
            Pu: Math.max(0, -(y[0] ?? 0), -(y[1] ?? 0)),
            station: A * $
          },
          stirrupSpacing: e.spacingM
        });
        m.push({
          beam: S.get(g) ?? `F${g + 1}`,
          element: g,
          station: A * $,
          Mu: b.flexure.Mu,
          Vu: b.shear.Vu,
          Tu: b.torsion.Tu,
          result: b
        });
      }
    }), m;
  }
  function p(t, e = 2) {
    return Number.isFinite(t) ? t.toFixed(e) : "\u2014";
  }
  function ut(t) {
    return !t.interaction.pass || !t.shear.shearPass ? "O/S V" : t.torsion.criticalPass ? t.flexure.flexureRatio > 1 ? "O/S F" : "OK" : "O/S T";
  }
  function mt(t) {
    const e = /* @__PURE__ */ new Map();
    for (const a of t) {
      const o = e.get(a.beam);
      (!o || a.result.interaction.ratio > o.result.interaction.ratio) && e.set(a.beam, a);
    }
    return e;
  }
  function Zt(t, e, a) {
    const o = e.filter((u) => u.beam === t), c = mt(e).get(t) ?? o[0];
    if (!c) return `# Reporte RC \xB7 ${t}

No hay datos para esta viga.`;
    const r = c.result, d = r.interaction.pass ? ut(r) : "O/S #45", l = [
      .../* @__PURE__ */ new Set([
        0,
        Math.floor((o.length - 1) / 2),
        o.length - 1,
        o.indexOf(c)
      ])
    ].sort((u, s) => u - s).map((u) => {
      const s = o[u], i = s.result;
      return `#| ${p(s.station, 3)} m | ${p(i.flexure.Mu)} kN*m | ${p(i.shear.Vu)} kN | ${p(i.torsion.Tu)} kN*m | ${p(i.interaction.ratio, 4)} | ${i.interaction.pass ? "OK" : "O/S #45"} |`;
    }).join(`
`);
    return [
      "```lisp",
      [
        `# Reporte de dise\xF1o RC \xB7 ${t}`,
        `#: Estaci\xF3n control: ${p(c.station, 3)} m \xB7 Norma: ${a.code} \xB7 Estado: ${d}`,
        "",
        "#: 1 \xB7 Datos y resultados de la estaci\xF3n control",
        "#| Dato | Valor | Dato | Valor |",
        "#|---|---:|---|---:|",
        `#| b | ${p(r.section.b, 4)} m | h | ${p(r.section.h, 4)} m |`,
        `#| d | ${p(r.section.d, 4)} m | c | ${p(a.coverM, 5)} m |`,
        `#| f'c | ${p(a.fcMPa, 2)} MPa | fy | ${p(a.fyMPa, 0)} MPa |`,
        `#| Mu | ${p(r.flexure.Mu)} kN*m | Vu | ${p(r.shear.Vu)} kN |`,
        `#| Tu | ${p(r.torsion.Tu)} kN*m | \u03C6Vc | ${p(r.shear.phiVc)} kN |`,
        `#| Aoh | ${p(r.section.Aoh, 6)} m^2 | ph | ${p(r.section.ph, 4)} m |`,
        `#| Vc | ${p(r.shear.Vc)} kN | Vmax | ${p(r.shear.Vmax)} kN |`,
        `#| Tth | ${p(r.torsion.Tth)} kN*m | Tcr | ${p(r.torsion.Tcr)} kN*m |`,
        `#| AsTop | ${p(r.flexure.AsTop * 1e4, 4)} cm^2 | AsBot | ${p(r.flexure.AsBottom * 1e4, 4)} cm^2 |`,
        `#| Av/s | ${p(r.shear.Avs * 1e4, 4)} cm^2/m | Al | ${p(r.torsion.Al * 1e4, 4)} cm^2 |`,
        `#| Int. | ${p(r.interaction.ratio, 4)} | \u03C6Tcr/Tu | ${p(r.torsion.criticalRatio, 4)} |`,
        `#| Error | ${r.error ?? "\u2014"} |  |  |`,
        "",
        `#: 2 \xB7 Estaciones de la viga (inicio, mitad, final y control; total ${o.length})`,
        "#| x | Mu | Vu | Tu | Int. | Estado |",
        "#|---:|---:|---:|---:|---:|---|",
        l,
        "",
        "#: 3 \xB7 F\xF3rmulas de control",
        "#: A_{oh} = (b - 2*c)*(h - 2*c)",
        "#: p_h = 2*((b - 2*c) + (h - 2*c))",
        "#: A_s = Mu/(phi*fy*(d - a/2))",
        "#: Av/s = (Vu - phi*Vc)/(phi*fys*d*s)",
        "#: A_l = Tu*p_h/(2*phi*A_0*fy)",
        "#: f_int = sqrt((Vu/(b*d))^2 + (Tu*p_h/(1.7*A_{oh}^2))^2)",
        "#: f_cap = phi*(Vc/(b*d) + 2*sqrt(f'c))",
        "#: O/S #45 cuando f_int > f_cap"
      ].join(`
`),
      "```"
    ].join(`
`);
  }
  function Jt(t) {
    if (!t.length) return "<div style='padding:10px;color:#aaa'>No hay barras horizontales rectangulares con resultados.</div>";
    const e = mt(t), a = t.map((o, c) => {
      const r = o.result, d = e.get(o.beam) === o ? ut(r) : "", n = r.interaction.pass ? d : "See ErrMsg", l = r.interaction.error ?? "";
      return `<tr data-beam="${o.beam}" data-row="${c}" style="cursor:pointer" title="Abrir reporte de ${o.beam}">
      <td>${o.beam}</td>
      <td>${p(o.station)}</td>
      <td>${p(o.Mu)}</td>
      <td>${p(o.Vu)}</td>
      <td>${p(o.Tu)}</td>
      <td>${p(r.flexure.AsTop * 1e4)}</td>
      <td>${p(r.flexure.AsBottom * 1e4)}</td>
      <td>${p(r.shear.Avs * 1e4)}</td>
      <td>${p(r.torsion.Al * 1e4)}</td>
      <td>${p(r.torsion.criticalRatio, 4)}</td>
      <td>${p(r.interaction.ratio, 4)}</td>
      <td>${d}</td>
      <td>${n}</td>
      <td>${l}</td>
    </tr>`;
    }).join("");
    return `<table style="border-collapse:collapse;width:100%;font-size:11px">
    <thead><tr>${[
      "Barra",
      "x(m)",
      "Mu",
      "Vu",
      "Tu",
      "AsTop",
      "AsBot",
      "Av/s",
      "Al",
      "\u03C6Tcr/Tu",
      "Int.",
      "Envelope",
      "Resumen",
      "Error"
    ].map((o) => `<th style="padding:3px;border-bottom:1px solid #587;white-space:nowrap;color:#9cc">${o}</th>`).join("")}</tr></thead>
    <tbody>${a}</tbody>
  </table>`;
  }
  function Qt(t) {
    const e = "Barra,Estacion_m,Mu_kNm,Vu_kN,Tu_kNm,AsTop_cm2,AsBot_cm2,Avs_cm2_m,Al_cm2,phiTcr_Tu,Interaction,Envelope,Resumen,Error", a = mt(t), o = t.map((n) => {
      const l = n.result;
      return [
        n.beam,
        n.station.toFixed(4),
        n.Mu.toFixed(4),
        n.Vu.toFixed(4),
        n.Tu.toFixed(4),
        (l.flexure.AsTop * 1e4).toFixed(4),
        (l.flexure.AsBottom * 1e4).toFixed(4),
        (l.shear.Avs * 1e4).toFixed(4),
        (l.torsion.Al * 1e4).toFixed(4),
        l.torsion.criticalRatio.toFixed(4),
        l.interaction.ratio.toFixed(4),
        a.get(n.beam) === n ? ut(l) : "",
        l.interaction.pass ? "" : "See ErrMsg",
        l.interaction.error ?? ""
      ].map((h) => `"${String(h).replace(/"/g, '""')}"`).join(",");
    }), c = new Blob([
      [
        e,
        ...o
      ].join(`
`)
    ], {
      type: "text/csv;charset=utf-8"
    }), r = URL.createObjectURL(c), d = document.createElement("a");
    d.href = r, d.download = "diseno-vigas-hormigon.csv", d.click(), URL.revokeObjectURL(r);
  }
  be = function(t) {
    if (document.getElementById("hk-diseno-vigas")) return;
    const e = document.createElement("div");
    e.id = "hk-diseno-vigas", e.style.cssText = "position:fixed;top:90px;right:12px;z-index:950;width:min(1100px,calc(100vw - 24px));max-height:78vh;overflow:auto;background:rgba(24,28,34,.97);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px;display:none", e.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>Dise\xF1o de vigas RC \xB7 ACI 318-14/19</b><span id="hkdv-x" style="cursor:pointer">\u2715</span></div>
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
    <div id="hkdv-res"></div>`, document.body.append(e);
    const a = (n) => e.querySelector("#" + n), o = () => ({
      code: a("hkdv-code").value,
      fcMPa: Number(a("hkdv-fc").value),
      fyMPa: Number(a("hkdv-fy").value),
      coverM: Number(a("hkdv-cover").value) / 100,
      spacingM: Number(a("hkdv-space").value) / 100
    });
    a("hkdv-res").onclick = (n) => {
      var _a;
      const h = (_a = n.target.closest("tr[data-beam]")) == null ? void 0 : _a.dataset.beam;
      h && qt(`Reporte RC \xB7 ${h}`, Zt(h, c, o()));
    };
    let c = [];
    const r = () => {
      const n = t ?? {
        states: window.__hekatanStates
      };
      if (!(n == null ? void 0 : n.states)) {
        a("hkdv-info").textContent = "No hay estados del modelo.";
        return;
      }
      try {
        c = Yt(n, o());
        const l = c.filter((s) => !s.result.interaction.pass).length, h = c.filter((s) => !s.result.torsion.criticalPass).length, u = new Set(c.map((s) => s.beam)).size;
        a("hkdv-info").textContent = `${u} barras \xB7 ${l} estaciones O/S #45 \xB7 ${h} estaciones fuera de \u03C6Tcr`, a("hkdv-res").innerHTML = Jt(c);
      } catch (l) {
        a("hkdv-info").textContent = `Error: ${(l == null ? void 0 : l.message) ?? l}`;
      }
    };
    Lt({
      id: "diseno-vigas-rc",
      orden: 4,
      icono: "\u25A3",
      titulo: "Vigas de hormig\xF3n RC",
      detalle: "Flexi\xF3n, cortante, torsi\xF3n y chequeo O/S #45.",
      abrir: () => {
        e.style.display = "block", r();
      }
    }), a("hkdv-x").onclick = () => {
      e.style.display = "none";
    }, a("hkdv-run").onclick = r, a("hkdv-csv").onclick = () => Qt(c);
  };
});
export {
  __tla,
  re as a,
  ie as b,
  ce as c,
  B as d,
  Nt as e,
  N as f,
  Vt as g,
  oe as h,
  pe as i,
  vt as j,
  rt as k,
  it as l,
  be as m,
  ct as n,
  me as o,
  le as p,
  de as q,
  ue as r,
  G as s,
  ae as t,
  se as u,
  fe as v,
  Lt as w,
  Ut as x,
  he as y
};
