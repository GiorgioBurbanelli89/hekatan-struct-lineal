import { M as Ft, m as gt } from "./modeScale-sgWZ-KrB.js";
import { v as R } from "./Text-C1TX4d8g.js";
import { r as qt, __tla as __tla_0 } from "./aiAgent-86HwhYYU.js";
let re, ie, ce, B, Nt, N, Vt, oe, pe, vt, rt, it, be, ct, me, le, de, ue, G, ae, se, he, Lt, Ut, fe;
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
    const { mesh: e, viewerElm: o, onStatusChange: a } = t, c = t.scalePercent ?? Ft, [s, d] = t.visFrequencyRange ?? [
      0.5,
      3
    ];
    let n = null, i = 0, m = 0, u = [], r = [], l = null;
    function p() {
      var _a;
      return o.__settings ?? ((_a = o.__ctx) == null ? void 0 : _a.settings);
    }
    function M() {
      a == null ? void 0 : a();
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
      const h = n.frequencies[i] ?? 0, x = h > 0 ? 1 / h : 0, y = [
        "Ux",
        "Uy",
        "Uz",
        "Rx",
        "Ry",
        "Rz"
      ], k = (_a = n.massParticipation) == null ? void 0 : _a[i];
      let T = "\u2014";
      if (k) {
        let A = 0, $ = 0;
        for (let E = 0; E < 6; E++) Math.abs(k[E]) > A && (A = Math.abs(k[E]), $ = E);
        T = `${y[$]} (${(A * 100).toFixed(0)}%)`;
      }
      return {
        mode: `Modo ${i + 1} / ${n.frequencies.length}`,
        frequency: `${h.toFixed(4)} Hz`,
        period: `${x.toFixed(4)} s`,
        dominant: T,
        state: m !== 0 ? "\u25B6 Reproduciendo" : "\u23F8 Pausado"
      };
    }
    function _() {
      return o.__ctx;
    }
    function g(h) {
      return h.length > 0 && h.length === e.nodes.rawVal.length;
    }
    function w(h) {
      var _a;
      if (m && (cancelAnimationFrame(m), m = 0), h) {
        const x = p();
        (x == null ? void 0 : x.deformedShape) && l !== null && (x.deformedShape.val = l, l = null);
        const y = g(u) ? u : g(r) ? r : [];
        y.length > 0 ? (e.nodes.val = y.map((k) => [
          ...k
        ]), (_a = _()) == null ? void 0 : _a.render()) : (u = [], r = []);
      }
    }
    function v() {
      var _a, _b;
      if (!n || !n.modeShapes || n.modeShapes.length === 0 || !n.modeShapes[i]) return;
      w(false);
      const h = p();
      (h == null ? void 0 : h.deformedShape) && (l === null && (l = h.deformedShape.val), h.deformedShape.val = false);
      const x = n.modeShapes[i], y = ((_a = n.frequencies) == null ? void 0 : _a[i]) || 1, k = ((_b = n.frequencies) == null ? void 0 : _b[0]) || 1, T = t.velocidadPorFrecuencia ? Math.max(s, Math.min(d, y / k)) : 1 / (t.periodoVisible ?? It);
      g(u) || (u = e.nodes.rawVal.map((q) => [
        ...q
      ])), r = u.map((q) => [
        ...q
      ]);
      const A = r.length, $ = Math.floor(x.length / 6);
      if ($ !== A) {
        console.warn(`[animateMode] el modo es de otra malla: ${$} nudos contra ${A} en pantalla. No animo (saldr\xEDan quietos los pisos de arriba). Corr\xE9 el modal sobre la misma malla que se muestra.`);
        return;
      }
      const E = gt(r);
      let C = 0;
      for (let q = 0; q < A; q++) {
        const U = x[q * 6] || 0, O = x[q * 6 + 1] || 0, j = x[q * 6 + 2] || 0, P = Math.sqrt(U * U + O * O + j * j);
        P > C && (C = P);
      }
      const b = C > 1e-12 ? E * c / 100 / C : 1, F = performance.now(), z = A > 4e3 ? 100 : A > 1500 ? 66 : 0;
      let D = -1 / 0;
      const L = () => {
        var _a2;
        const q = performance.now();
        if (q - D < z) {
          m = requestAnimationFrame(L);
          return;
        }
        D = q;
        const U = (q - F) / 1e3, O = Math.sin(2 * Math.PI * T * U) * b, j = new Array(A);
        for (let P = 0; P < A; P++) {
          const W = r[P];
          j[P] = [
            W[0] + (x[P * 6] || 0) * O,
            W[1] + (x[P * 6 + 1] || 0) * O,
            W[2] + (x[P * 6 + 2] || 0) * O
          ];
        }
        e.nodes.val = j, (_a2 = _()) == null ? void 0 : _a2.render(), m = requestAnimationFrame(L);
      };
      m = requestAnimationFrame(L), M();
    }
    function V(h) {
      var _a, _b;
      if (!n || !n.modeShapes || !n.modeShapes[h]) return;
      w(false);
      const x = p();
      (x == null ? void 0 : x.deformedShape) && (l === null && (l = x.deformedShape.val), x.deformedShape.val = false), i = Math.max(0, Math.min((((_a = n.frequencies) == null ? void 0 : _a.length) ?? 1) - 1, h));
      const y = n.modeShapes[i];
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
      const E = $ > 1e-12 ? A * c / 100 / $ : 1, C = new Array(T);
      for (let b = 0; b < T; b++) {
        const F = k[b];
        C[b] = [
          F[0] + (y[b * 6] || 0) * E,
          F[1] + (y[b * 6 + 1] || 0) * E,
          F[2] + (y[b * 6 + 2] || 0) * E
        ];
      }
      e.nodes.val = C, (_b = _()) == null ? void 0 : _b.render(), M();
    }
    return {
      setResults(h) {
        var _a;
        n = h, i >= (((_a = h == null ? void 0 : h.frequencies) == null ? void 0 : _a.length) ?? 0) && (i = 0), u = e.nodes.rawVal.map((x) => [
          ...x
        ]), M();
      },
      setMode(h) {
        var _a;
        if (!n) return;
        const x = ((_a = n.frequencies) == null ? void 0 : _a.length) ?? 0;
        i = Math.max(0, Math.min(x - 1, h)), m !== 0 ? v() : M();
      },
      showStatic(h) {
        V(h);
      },
      play() {
        n && m === 0 && v();
      },
      stop() {
        w(true), M();
      },
      isPlaying() {
        return m !== 0;
      },
      pause() {
        m && (cancelAnimationFrame(m), m = 0), M();
      },
      modeCount() {
        var _a;
        return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a.length) ?? 0;
      },
      currentMode() {
        return i;
      },
      currentFreq() {
        var _a;
        return ((_a = n == null ? void 0 : n.frequencies) == null ? void 0 : _a[i]) ?? 0;
      },
      getStatus() {
        return S();
      },
      dispose() {
        w(true), n = null;
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
    const o = B.val;
    return `${Ut(t, o).toFixed(e)} ${o}`;
  };
  ie = function(t, e = 2) {
    const o = N.val;
    return `${Nt(t, o).toFixed(e)} ${o}`;
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
    const a = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((c) => {
      const s = (c.textContent || "").replace(/\s+/g, " ").trim();
      return s.includes("Exportar") && s.includes(t) && s.length < 60;
    });
    if (a) {
      a.click();
      return;
    }
    alert("Este ejemplo todav\xEDa no exporta a " + e + `.

Los que s\xED: el galp\xF3n curvo (ETABS, SAP2000, SAFE y OpenSees) y
la zapata (SAFE y OpenSees).`);
  }
  function tt(t, e) {
    const o = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((a) => (a.textContent || "").replace(/\s+/g, " ").includes(t));
    if (o) {
      o.click();
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
  fe = function() {
    dt();
  };
  Lt = function(t) {
    const e = nt.diseno;
    e.some((o) => o.id === t.id) || (e.push(t), e.sort((o, a) => o.orden - a.orden)), dt();
  };
  let X = null;
  function dt() {
    if (document.getElementById("hk-menus")) return;
    const t = document.getElementById("hk-cad-tit"), e = t == null ? void 0 : t.querySelector(".doc");
    if (!t || !e) {
      setTimeout(dt, 400);
      return;
    }
    const o = document.createElement("style");
    o.textContent = "#hk-cad-tit button{white-space:nowrap}@media (max-width:1100px){#hk-cad-tit .marca{display:none}}@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}", document.head.appendChild(o);
    const a = document.createElement("span");
    a.id = "hk-menus", a.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px", e.after(a);
    const c = (r) => {
      const l = document.getElementById(r);
      if (!l) return false;
      const p = l.style.display !== "none";
      return l.removeAttribute("style"), l.className = "piel", p || (l.style.display = "none"), a.appendChild(l), true;
    };
    let s = 0;
    const d = () => {
      const r = c("hk-home-btn"), l = c("hk-back-btn");
      (!r || !l) && ++s < 20 && setTimeout(d, 400);
    };
    (() => {
      for (const r of [
        "analisis",
        "diseno",
        "exportar"
      ]) {
        const l = document.createElement("button");
        l.id = `hk-${r}-btn`, l.className = "piel", l.textContent = Ot[r] + " \u25BE", l.onclick = (p) => {
          p.stopPropagation(), jt(r, l);
        }, a.appendChild(l);
      }
    })(), d();
    const i = () => {
      const r = a.querySelector("#hk-analisis-btn");
      for (const l of [
        "hk-back-btn",
        "hk-home-btn"
      ]) {
        const p = document.getElementById(l);
        p && r && p.parentElement === a && a.insertBefore(p, r);
      }
    };
    for (const r of [
      500,
      1200,
      2500,
      5e3
    ]) setTimeout(i, r);
    const m = window, u = m.__hekatanActualizarBotonVolver;
    m.__hekatanActualizarBotonVolver = (r) => {
      u == null ? void 0 : u(r);
      const l = document.getElementById("hk-back-btn");
      l && (l.style.display = r ? "" : "none");
    }, document.addEventListener("click", (r) => {
      X && !X.contains(r.target) && at();
    });
  }
  function at() {
    X == null ? void 0 : X.remove(), X = null;
  }
  function jt(t, e) {
    const o = (X == null ? void 0 : X.dataset.menu) === t;
    if (at(), o) return;
    const a = document.createElement("div");
    a.dataset.menu = t, a.id = `hk-${t}-menu`, a.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
    const c = nt[t].length === 0 ? '<div style="padding:8px;opacity:.8;line-height:1.5">Todav\xEDa no hay nada aqu\xED.<br>Las opciones de dise\xF1o las trae el modelo: abre una plantilla o un ejemplo con cimentaci\xF3n o zapata y volver\xE1n a aparecer en este men\xFA.</div>' : "";
    a.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${Bt[t]}</div>` + c + nt[t].map((d) => `<div data-id="${d.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${d.icono} ${d.titulo}</b><div style="opacity:.75;margin-top:2px">${d.detalle}</div></div>`).join(""), a.querySelectorAll("[data-id]").forEach((d) => {
      d.onmouseenter = () => d.style.background = "#1f3b5a", d.onmouseleave = () => d.style.background = "", d.onclick = () => {
        var _a;
        at(), (_a = nt[t].find((n) => n.id === d.dataset.id)) == null ? void 0 : _a.abrir();
      };
    }), document.body.appendChild(a);
    const s = e.getBoundingClientRect();
    a.style.top = s.bottom + 4 + "px", a.style.left = Math.max(8, Math.min(s.left, innerWidth - 370)) + "px", X = a;
  }
  he = function(t) {
    let e = false, o = 0, a = 0;
    const c = (n) => {
      const i = t.firstElementChild;
      return !!i && i.contains(n);
    }, s = () => {
      const n = t.dataset.plegado !== "1";
      t.dataset.plegado = n ? "1" : "0", [
        ...t.children
      ].slice(1).forEach((i) => i.style.display = n ? "none" : ""), t.style.overflow = n ? "hidden" : "auto";
    };
    t.addEventListener("pointerdown", (n) => {
      if (!c(n.target)) return;
      const i = n.target;
      if (i.closest("[data-plegar]")) {
        s();
        return;
      }
      if (i.closest("button,select,input,[id$='-x']")) return;
      const m = t.getBoundingClientRect();
      e = true, o = n.clientX - m.left, a = n.clientY - m.top, t.setPointerCapture(n.pointerId), n.preventDefault();
    }), t.addEventListener("pointermove", (n) => {
      e && (t.style.left = Math.min(Math.max(0, n.clientX - o), innerWidth - 80) + "px", t.style.top = Math.min(Math.max(30, n.clientY - a), innerHeight - 30) + "px", t.style.right = "auto");
    }), t.addEventListener("pointerup", () => {
      e = false;
    }), t.addEventListener("dblclick", (n) => {
      c(n.target) && !n.target.closest("[data-plegar]") && s();
    });
    const d = () => {
      const n = t.firstElementChild;
      if (!n || n.dataset.barra === "1") return;
      n.dataset.barra = "1", n.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", n.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
      const i = n.querySelector("b");
      i && !i.textContent.startsWith("\u283F") && (i.textContent = "\u283F " + i.textContent);
    };
    d(), new MutationObserver(d).observe(t, {
      childList: true
    });
  };
  const Mt = "Shear stress due to shear force and torsion together exceeds maximum allowed.", ot = 98.0665, _t = 1.75 * 0.0254, I = (t) => Math.max(0, t), K = (t, e = 0) => Number.isFinite(t) ? t : e;
  function zt(t) {
    const e = Math.max(0, K(t.coverToBarCenter, _t)), o = Math.max(0, K(t.compressionCoverToBarCenter, e)), a = t.h - e, c = t.b, s = Math.max(1e-9, c - 2 * e), d = Math.max(1e-9, t.h - 2 * e), n = s * d;
    return {
      b: c,
      h: t.h,
      d: a,
      dp: o,
      bw: c,
      Acp: c * t.h,
      pcp: 2 * (c + t.h),
      Aoh: n,
      A0: 0.85 * n,
      ph: 2 * s + 2 * d,
      coverToBarCenter: e
    };
  }
  function Kt(t) {
    return Math.min(0.85, Math.max(0.65, 0.85 - 0.05 * (t - 281) / 69.5));
  }
  function Gt(t, e, o, a, c, s, d, n) {
    const i = t / ot, m = t / 1e3, u = e / 1e3, r = Kt(i), l = 3e-3 / (3e-3 + 5e-3) * c, p = r * l, M = c * c - 2 * d / (0.85 * t * n * a), S = M <= 0 ? c : c - Math.sqrt(M), _ = Math.max(3 * Math.sqrt(m) / u * a * c, 200 / u * a * c), g = 0.04 * a * c;
    let w = 0, v = 0, V = false;
    if (d > 0) if (S <= p) w = d / Math.max(1e-12, n * e * Math.max(1e-9, c - S / 2));
    else {
      V = true;
      const A = 0.85 * t * a * p * (c - p / 2) * n, $ = Math.max(0, d - A), C = (Math.min(e, o * 3e-3 * Math.max(0, l - s) / Math.max(1e-12, l)) - 0.85 * t) * (c - s) * n;
      v = C > 1e-9 ? $ / C : 0;
      const b = A / Math.max(1e-12, e * (c - p / 2) * n), F = $ / Math.max(1e-12, e * (c - s) * n);
      w = b + F;
    }
    const h = Math.min(g, Math.max(_, w)), x = Math.min(g, Math.max(_, v)), y = n * h * e * Math.max(0, c - S / 2), k = d <= 1e-12 ? 0 : d / Math.max(1e-12, y);
    return {
      Mu: d,
      beta1: r,
      cMax: l,
      aMax: p,
      a: S,
      AsRequired: w,
      AsMin: _,
      AsMax: g,
      AsTension: h,
      AsCompression: x,
      AsTop: 0,
      AsBottom: 0,
      tensionSide: d <= 1e-12 ? "none" : "bottom",
      compressionSteelRequired: V,
      flexureRatio: k
    };
  }
  function Xt(t, e, o, a, c, s) {
    const d = t / 6.894757293, n = e / (0.0254 * 0.0254), i = o / 0.0254, r = 1 + I(c) * 224.808943 / Math.max(1e-12, 4 * n * Math.sqrt(d)), l = s * Math.sqrt(d) * n * n / Math.max(1e-12, i) * 112984829e-12;
    return {
      Tth: 2 * l * r,
      Tcr: 4 * l * r
    };
  }
  function Wt(t) {
    const e = zt(t.section), o = t.material, a = t.demand, c = t.code ?? "ACI 318-19", s = I(o.fc), d = I(o.fy), n = I(o.fys ?? d), i = I(o.lambda ?? 1), m = I(o.Es ?? 2e8), u = I(o.phiFlexure ?? 0.9), r = I(o.phiShearTorsion ?? 0.75), l = I(o.phiCriticalTorsion ?? r), p = K(a.Mu), M = Math.abs(K(a.Vu)), S = Math.abs(K(a.Tu)), _ = K(a.Pu ?? 0), g = s / ot, w = s / 1e3, v = Gt(s, d, m, e.b, e.d, e.dp, Math.abs(p), u);
    p > 1e-12 ? (v.AsBottom = v.AsTension, v.AsTop = v.AsCompression, v.tensionSide = "bottom") : p < -1e-12 ? (v.AsTop = v.AsTension, v.AsBottom = v.AsCompression, v.tensionSide = "top") : (v.AsTop = v.AsMin, v.AsBottom = v.AsMin);
    const V = o.concreteShearCapacity ?? 0.53 * i * Math.sqrt(g) * ot * e.bw * e.d, h = I(V), x = h + 0.66 * Math.sqrt(w) * 1e3 * e.bw * e.d, y = r * h, k = r * x, T = I((M - y) / Math.max(1e-12, r * n * e.d)), A = I(t.stirrupSpacing ?? 0.3), $ = Math.max(0.075 * Math.sqrt(w) * 1e3 * e.bw / Math.max(1, d), 0.35 * e.bw / Math.max(1, d * A)), E = Math.max(T, $), C = M <= 1e-12 ? 0 : M / Math.max(1e-12, k), b = M <= k + 1e-9, F = Xt(s, e.Acp, e.pcp, e.b * e.h, _, i), z = l * F.Tth, D = l * F.Tcr, L = S <= 1e-12 ? 0 : D / S, q = S <= D + 1e-9, U = S > z + 1e-9, O = U ? S / Math.max(1e-12, 2 * r * e.A0 * n) : 0, j = U ? S * e.ph / Math.max(1e-12, 2 * r * e.A0 * d) : 0, P = I(0.5 * Math.sqrt(w) * 1e3 * e.Acp / Math.max(1, d) - O * e.ph), W = U ? Math.max(j, P) : 0, pt = S <= D + 1e-9, ft = Math.sqrt(Math.pow(M / Math.max(1e-12, e.bw * e.d), 2) + Math.pow(S * e.ph / Math.max(1e-12, 1.7 * e.Aoh * e.Aoh), 2)), Ct = o.combinedAdditiveCoefficient ?? 2, ht = r * (h / Math.max(1e-12, e.bw * e.d) + Ct * Math.sqrt(g) * ot), bt = ft / Math.max(1e-12, ht), Z = bt <= 1 + 1e-9;
    let J = "OK", xt;
    return Z ? b ? pt || (J = "O/S T") : J = "O/S V" : (J = "O/S #45", xt = Mt), {
      code: c,
      station: K(a.station),
      section: e,
      flexure: v,
      shear: {
        Vu: M,
        Vc: h,
        Vmax: x,
        phiVc: y,
        phiVmax: k,
        AvsRequired: T,
        AvsMinimum: $,
        Avs: E,
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
        demandStress: ft,
        capacityStress: ht,
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
    const o = (_a = t == null ? void 0 : t.get) == null ? void 0 : _a.call(t, e);
    return Array.isArray(o) ? o : [
      0,
      0
    ];
  }, St = (t, e, o) => t + (e - t) * o, yt = (t, e) => Math.max(Math.abs(t), Math.abs(e)), kt = (t) => typeof t == "number" && Number.isFinite(t);
  function Et(t, e) {
    if (e.length !== 2) return false;
    const o = t[e[0]], a = t[e[1]];
    if (!o || !a) return false;
    const c = Math.hypot(a[0] - o[0], a[1] - o[1], a[2] - o[2]);
    return c > 1e-9 && Math.abs(a[2] - o[2]) <= Math.max(0.03, c * 0.02);
  }
  function wt(t) {
    return !t || t.type !== "rect" || !kt(t.b) || !kt(t.h) || t.b <= 0 || t.h <= 0 ? null : {
      b: t.b,
      h: t.h
    };
  }
  function Ht(t, e, o) {
    var _a, _b;
    const a = e.map((u, r) => ({
      element: u,
      index: r
    })).filter(({ element: u, index: r }) => {
      var _a2;
      return Et(t, u) && wt((_a2 = o == null ? void 0 : o.get) == null ? void 0 : _a2.call(o, r));
    }), c = new Map(a.map(({ index: u }) => [
      u,
      u
    ])), s = (u) => {
      const r = c.get(u);
      if (r === void 0 || r === u) return u;
      const l = s(r);
      return c.set(u, l), l;
    }, d = (u, r) => {
      const l = s(u), p = s(r);
      l !== p && c.set(p, l);
    }, n = (u) => {
      const r = t[u[0]], l = t[u[1]];
      if (!r || !l) return null;
      const p = Math.hypot(l[0] - r[0], l[1] - r[1], l[2] - r[2]);
      return p <= 1e-9 ? null : [
        (l[0] - r[0]) / p,
        (l[1] - r[1]) / p,
        (l[2] - r[2]) / p
      ];
    };
    for (let u = 0; u < a.length; u++) for (let r = u + 1; r < a.length; r++) {
      const l = a[u], p = a[r];
      if (l.element[0] !== p.element[0] && l.element[0] !== p.element[1] && l.element[1] !== p.element[0] && l.element[1] !== p.element[1]) continue;
      const M = n(l.element), S = n(p.element), _ = (_a = o == null ? void 0 : o.get) == null ? void 0 : _a.call(o, l.index), g = (_b = o == null ? void 0 : o.get) == null ? void 0 : _b.call(o, p.index);
      !M || !S || !_ || !g || _.b !== g.b || _.h !== g.h || Math.abs(M[0] * S[0] + M[1] * S[1] + M[2] * S[2]) > 0.999 && d(l.index, p.index);
    }
    const i = /* @__PURE__ */ new Map();
    let m = 1;
    for (const { index: u } of a) {
      const r = s(u);
      i.has(r) || i.set(r, m++);
    }
    return new Map(a.map(({ index: u }) => [
      u,
      `B${i.get(s(u))}`
    ]));
  }
  function Yt(t, e) {
    const o = t.states, a = et(o.nodes), c = et(o.elements), s = et(o.elementInputs) ?? {}, d = et(o.analyzeOutputs) ?? {}, n = s.sectionShapes, i = d.shearsY, m = d.torsions, u = d.bendingsZ, r = d.bendingsY, l = d.normals, p = [], M = [
      0,
      0.25,
      0.5,
      0.75,
      1
    ], S = Ht(a, c, n);
    return c.forEach((_, g) => {
      var _a;
      if (!Et(a, _)) return;
      const w = wt((_a = n == null ? void 0 : n.get) == null ? void 0 : _a.call(n, g));
      if (!w) return;
      const v = H(i, g), V = H(m, g), h = H(u, g), x = H(r, g), y = H(l, g), k = a[_[0]], T = a[_[1]], A = Math.hypot(T[0] - k[0], T[1] - k[1], T[2] - k[2]);
      for (const $ of M) {
        const E = St(h[0] ?? 0, h[1] ?? 0, $), C = St(x[0] ?? 0, x[1] ?? 0, $), b = Wt({
          code: e.code,
          section: {
            ...w,
            coverToBarCenter: e.coverM || _t
          },
          material: {
            fc: e.fcMPa * 1e3,
            fy: e.fyMPa * 1e3,
            fys: e.fyMPa * 1e3
          },
          demand: {
            Mu: Math.abs(E) >= Math.abs(C) ? E : C,
            Vu: yt(v[0] ?? 0, v[1] ?? 0),
            Tu: yt(V[0] ?? 0, V[1] ?? 0),
            Pu: Math.max(0, -(y[0] ?? 0), -(y[1] ?? 0)),
            station: A * $
          },
          stirrupSpacing: e.spacingM
        });
        p.push({
          beam: S.get(g) ?? `F${g + 1}`,
          element: g,
          station: A * $,
          Mu: b.flexure.Mu,
          Vu: b.shear.Vu,
          Tu: b.torsion.Tu,
          result: b
        });
      }
    }), p;
  }
  function f(t, e = 2) {
    return Number.isFinite(t) ? t.toFixed(e) : "\u2014";
  }
  function ut(t) {
    return !t.interaction.pass || !t.shear.shearPass ? "O/S V" : t.torsion.criticalPass ? t.flexure.flexureRatio > 1 ? "O/S F" : "OK" : "O/S T";
  }
  function mt(t) {
    const e = /* @__PURE__ */ new Map();
    for (const o of t) {
      const a = e.get(o.beam);
      (!a || o.result.interaction.ratio > a.result.interaction.ratio) && e.set(o.beam, o);
    }
    return e;
  }
  function Zt(t, e, o) {
    const a = e.filter((i) => i.beam === t), c = mt(e).get(t) ?? a[0];
    if (!c) return `# Reporte RC \xB7 ${t}

No hay datos para esta viga.`;
    const s = c.result, d = s.interaction.pass ? ut(s) : "O/S #45", n = a.map((i) => {
      const m = i.result;
      return `#| ${f(i.station, 3)} m | ${f(m.flexure.Mu)} kN*m | ${f(m.shear.Vu)} kN | ${f(m.torsion.Tu)} kN*m | ${f(m.interaction.ratio, 4)} | ${m.interaction.pass ? "OK" : "O/S #45"} |`;
    }).join(`
`);
    return [
      `# Reporte de dise\xF1o RC \xB7 ${t}`,
      `#: Estaci\xF3n control: ${f(c.station, 3)} m \xB7 Norma: ${o.code} \xB7 Estado: ${d}`,
      "",
      "## 1 \xB7 Datos y resultados de la estaci\xF3n control",
      "#| Dato | Valor | Dato | Valor |",
      "#|---|---:|---|---:|",
      `#| b | ${f(s.section.b, 4)} m | h | ${f(s.section.h, 4)} m |`,
      `#| d | ${f(s.section.d, 4)} m | c | ${f(o.coverM, 5)} m |`,
      `#| f'c | ${f(o.fcMPa, 2)} MPa | fy | ${f(o.fyMPa, 0)} MPa |`,
      `#| Mu | ${f(s.flexure.Mu)} kN*m | Vu | ${f(s.shear.Vu)} kN |`,
      `#| Tu | ${f(s.torsion.Tu)} kN*m | \u03C6Vc | ${f(s.shear.phiVc)} kN |`,
      `#| Aoh | ${f(s.section.Aoh, 6)} m^2 | ph | ${f(s.section.ph, 4)} m |`,
      `#| Vc | ${f(s.shear.Vc)} kN | Vmax | ${f(s.shear.Vmax)} kN |`,
      `#| Tth | ${f(s.torsion.Tth)} kN*m | Tcr | ${f(s.torsion.Tcr)} kN*m |`,
      `#| AsTop | ${f(s.flexure.AsTop * 1e4, 4)} cm^2 | AsBot | ${f(s.flexure.AsBottom * 1e4, 4)} cm^2 |`,
      `#| Av/s | ${f(s.shear.Avs * 1e4, 4)} cm^2/m | Al | ${f(s.torsion.Al * 1e4, 4)} cm^2 |`,
      `#| Int. | ${f(s.interaction.ratio, 4)} | \u03C6Tcr/Tu | ${f(s.torsion.criticalRatio, 4)} |`,
      `#| Error | ${s.error ?? "\u2014"} |  |  |`,
      "",
      "## 2 \xB7 Estaciones de la viga",
      "#| x | Mu | Vu | Tu | Int. | Estado |",
      "#|---:|---:|---:|---:|---:|---|",
      n,
      "",
      "## 3 \xB7 F\xF3rmulas de control",
      "```lisp",
      "#: A_{oh} = (b - 2*c)*(h - 2*c)",
      "#: p_h = 2*((b - 2*c) + (h - 2*c))",
      "#: A_s = Mu/(phi*fy*(d - a/2))",
      "#: Av/s = (Vu - phi*Vc)/(phi*fys*d*s)",
      "#: A_l = Tu*p_h/(2*phi*A_0*fy)",
      "#: f_int = sqrt((Vu/(b*d))^2 + (Tu*p_h/(1.7*A_{oh}^2))^2)",
      "#: f_cap = phi*(Vc/(b*d) + 2*sqrt(f'c))",
      "#: O/S #45 cuando f_int > f_cap",
      "```"
    ].join(`
`);
  }
  function Jt(t) {
    if (!t.length) return "<div style='padding:10px;color:#aaa'>No hay barras horizontales rectangulares con resultados.</div>";
    const e = mt(t), o = t.map((a, c) => {
      const s = a.result, d = e.get(a.beam) === a ? ut(s) : "", n = s.interaction.pass ? d : "See ErrMsg", i = s.interaction.error ?? "";
      return `<tr data-beam="${a.beam}" data-row="${c}" style="cursor:pointer" title="Abrir reporte de ${a.beam}">
      <td>${a.beam}</td>
      <td>${f(a.station)}</td>
      <td>${f(a.Mu)}</td>
      <td>${f(a.Vu)}</td>
      <td>${f(a.Tu)}</td>
      <td>${f(s.flexure.AsTop * 1e4)}</td>
      <td>${f(s.flexure.AsBottom * 1e4)}</td>
      <td>${f(s.shear.Avs * 1e4)}</td>
      <td>${f(s.torsion.Al * 1e4)}</td>
      <td>${f(s.torsion.criticalRatio, 4)}</td>
      <td>${f(s.interaction.ratio, 4)}</td>
      <td>${d}</td>
      <td>${n}</td>
      <td>${i}</td>
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
    ].map((a) => `<th style="padding:3px;border-bottom:1px solid #587;white-space:nowrap;color:#9cc">${a}</th>`).join("")}</tr></thead>
    <tbody>${o}</tbody>
  </table>`;
  }
  function Qt(t) {
    const e = "Barra,Estacion_m,Mu_kNm,Vu_kN,Tu_kNm,AsTop_cm2,AsBot_cm2,Avs_cm2_m,Al_cm2,phiTcr_Tu,Interaction,Envelope,Resumen,Error", o = mt(t), a = t.map((n) => {
      const i = n.result;
      return [
        n.beam,
        n.station.toFixed(4),
        n.Mu.toFixed(4),
        n.Vu.toFixed(4),
        n.Tu.toFixed(4),
        (i.flexure.AsTop * 1e4).toFixed(4),
        (i.flexure.AsBottom * 1e4).toFixed(4),
        (i.shear.Avs * 1e4).toFixed(4),
        (i.torsion.Al * 1e4).toFixed(4),
        i.torsion.criticalRatio.toFixed(4),
        i.interaction.ratio.toFixed(4),
        o.get(n.beam) === n ? ut(i) : "",
        i.interaction.pass ? "" : "See ErrMsg",
        i.interaction.error ?? ""
      ].map((m) => `"${String(m).replace(/"/g, '""')}"`).join(",");
    }), c = new Blob([
      [
        e,
        ...a
      ].join(`
`)
    ], {
      type: "text/csv;charset=utf-8"
    }), s = URL.createObjectURL(c), d = document.createElement("a");
    d.href = s, d.download = "diseno-vigas-hormigon.csv", d.click(), URL.revokeObjectURL(s);
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
    const o = (n) => e.querySelector("#" + n), a = () => ({
      code: o("hkdv-code").value,
      fcMPa: Number(o("hkdv-fc").value),
      fyMPa: Number(o("hkdv-fy").value),
      coverM: Number(o("hkdv-cover").value) / 100,
      spacingM: Number(o("hkdv-space").value) / 100
    });
    o("hkdv-res").onclick = (n) => {
      var _a;
      const m = (_a = n.target.closest("tr[data-beam]")) == null ? void 0 : _a.dataset.beam;
      m && qt(`Reporte RC \xB7 ${m}`, Zt(m, c, a()));
    };
    let c = [];
    const s = () => {
      const n = t ?? {
        states: window.__hekatanStates
      };
      if (!(n == null ? void 0 : n.states)) {
        o("hkdv-info").textContent = "No hay estados del modelo.";
        return;
      }
      try {
        c = Yt(n, a());
        const i = c.filter((r) => !r.result.interaction.pass).length, m = c.filter((r) => !r.result.torsion.criticalPass).length, u = new Set(c.map((r) => r.beam)).size;
        o("hkdv-info").textContent = `${u} barras \xB7 ${i} estaciones O/S #45 \xB7 ${m} estaciones fuera de \u03C6Tcr`, o("hkdv-res").innerHTML = Jt(c);
      } catch (i) {
        o("hkdv-info").textContent = `Error: ${(i == null ? void 0 : i.message) ?? i}`;
      }
    };
    Lt({
      id: "diseno-vigas-rc",
      orden: 4,
      icono: "\u25A3",
      titulo: "Vigas de hormig\xF3n RC",
      detalle: "Flexi\xF3n, cortante, torsi\xF3n y chequeo O/S #45.",
      abrir: () => {
        e.style.display = "block", s();
      }
    }), o("hkdv-x").onclick = () => {
      e.style.display = "none";
    }, o("hkdv-run").onclick = s, o("hkdv-csv").onclick = () => Qt(c);
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
  he as v,
  Lt as w,
  Ut as x,
  fe as y
};
