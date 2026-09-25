import { a as Dt } from "./analyze-CWJH9Nzr.js";
import { m as It, d as Bt, __tla as __tla_0 } from "./didacticCpp-iMwzdM-v.js";
import { V as Ft } from "./Text-Br8EG2up.js";
let eo, uo, fo, po, qt, mo;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const Ce = {
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
        abrir: () => ke("E2K", "ETABS")
      },
      {
        id: "s2k",
        orden: 2,
        icono: "\u{1F4D0}",
        titulo: "SAP2000 (.s2k)",
        detalle: "El modelo entero, para abrirlo en SAP2000.",
        abrir: () => ke("S2K", "SAP2000")
      },
      {
        id: "f2k",
        orden: 3,
        icono: "\u{1FAA8}",
        titulo: "SAFE (.f2k) \u2014 cimentaci\xF3n",
        detalle: "La cimentaci\xF3n con sus muelles, para SAFE.",
        abrir: () => ke("F2K", "SAFE")
      },
      {
        id: "tcl",
        orden: 4,
        icono: "\u{1F9EE}",
        titulo: "OpenSees (.tcl)",
        detalle: "El guion de OpenSees, para comprobarlo aparte.",
        abrir: () => ke(".tcl", "OpenSees")
      },
      {
        id: "dwg",
        orden: 5,
        icono: "\u{1F4D0}",
        titulo: "AutoCAD (.dwg) \u2014 geometr\xEDa",
        detalle: "Barras y \xE1reas en capas COLUMNAS, VIGAS, DIAGONALES, LOSAS, MUROS.",
        abrir: () => Ee("Exportar DWG", "DWG")
      },
      {
        id: "dxf",
        orden: 6,
        icono: "\u{1F4C4}",
        titulo: "DXF \u2014 geometr\xEDa",
        detalle: "Lo mismo en DXF de texto: lo abre cualquier CAD.",
        abrir: () => Ee("Exportar DXF", "DXF")
      },
      {
        id: "idwg",
        orden: 7,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF (3D o planta)",
        detalle: "L\xEDneas \u2192 barras con sus nudos; 3DFACE \u2192 \xE1reas. Salta ejes, cotas y textos.",
        abrir: () => Ee("Importar DWG/DXF (3D", "DWG")
      },
      {
        id: "idwgxz",
        orden: 8,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF como alzado (XZ)",
        detalle: "Un p\xF3rtico dibujado en 2D: la Y del plano pasa a ser la altura Z.",
        abrir: () => Ee("como alzado (XZ)", "DWG")
      }
    ]
  };
  function ke(e, o) {
    const a = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((n) => {
      const r = (n.textContent || "").replace(/\s+/g, " ").trim();
      return r.includes("Exportar") && r.includes(e) && r.length < 60;
    });
    if (a) {
      a.click();
      return;
    }
    alert("Este ejemplo todav\xEDa no exporta a " + o + `.

Los que s\xED: el galp\xF3n curvo (ETABS, SAP2000, SAFE y OpenSees) y
la zapata (SAFE y OpenSees).`);
  }
  function Ee(e, o) {
    const t = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((a) => (a.textContent || "").replace(/\s+/g, " ").includes(e));
    if (t) {
      t.click();
      return;
    }
    alert("Abr\xED un modelo o un archivo nuevo para usar " + o + ".");
  }
  const Vt = {
    analisis: "\u25B6 An\xE1lisis",
    diseno: "\u{1F4D0} Dise\xF1o",
    exportar: "\u{1F4E4} Exportar"
  }, Nt = {
    analisis: "An\xE1lisis \u2014 elige qu\xE9 calcular:",
    diseno: "Dise\xF1o \u2014 elige qu\xE9 hacer:",
    exportar: "Exportar el modelo a otro programa:"
  };
  uo = function() {
    tt();
  };
  qt = function(e) {
    const o = Ce.diseno;
    o.some((t) => t.id === e.id) || (o.push(e), o.sort((t, a) => t.orden - a.orden)), tt();
  };
  let de = null;
  function tt() {
    if (document.getElementById("hk-menus")) return;
    const e = document.getElementById("hk-cad-tit"), o = e == null ? void 0 : e.querySelector(".doc");
    if (!e || !o) {
      setTimeout(tt, 400);
      return;
    }
    const t = document.createElement("style");
    t.textContent = "#hk-cad-tit button{white-space:nowrap}@media (max-width:1100px){#hk-cad-tit .marca{display:none}}@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}", document.head.appendChild(t);
    const a = document.createElement("span");
    a.id = "hk-menus", a.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px", o.after(a);
    const n = (d) => {
      const u = document.getElementById(d);
      if (!u) return false;
      const h = u.style.display !== "none";
      return u.removeAttribute("style"), u.className = "piel", h || (u.style.display = "none"), a.appendChild(u), true;
    };
    let r = 0;
    const i = () => {
      const d = n("hk-home-btn"), u = n("hk-back-btn");
      (!d || !u) && ++r < 20 && setTimeout(i, 400);
    };
    (() => {
      for (const d of [
        "analisis",
        "diseno",
        "exportar"
      ]) {
        const u = document.createElement("button");
        u.id = `hk-${d}-btn`, u.className = "piel", u.textContent = Vt[d] + " \u25BE", u.onclick = (h) => {
          h.stopPropagation(), Ot(d, u);
        }, a.appendChild(u);
      }
    })(), i();
    const c = () => {
      const d = a.querySelector("#hk-analisis-btn");
      for (const u of [
        "hk-back-btn",
        "hk-home-btn"
      ]) {
        const h = document.getElementById(u);
        h && d && h.parentElement === a && a.insertBefore(h, d);
      }
    };
    for (const d of [
      500,
      1200,
      2500,
      5e3
    ]) setTimeout(c, d);
    const m = window, p = m.__hekatanActualizarBotonVolver;
    m.__hekatanActualizarBotonVolver = (d) => {
      p == null ? void 0 : p(d);
      const u = document.getElementById("hk-back-btn");
      u && (u.style.display = d ? "" : "none");
    }, document.addEventListener("click", (d) => {
      de && !de.contains(d.target) && Ze();
    });
  }
  function Ze() {
    de == null ? void 0 : de.remove(), de = null;
  }
  function Ot(e, o) {
    const t = (de == null ? void 0 : de.dataset.menu) === e;
    if (Ze(), t) return;
    const a = document.createElement("div");
    a.dataset.menu = e, a.id = `hk-${e}-menu`, a.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
    const n = Ce[e].length === 0 ? '<div style="padding:8px;opacity:.8;line-height:1.5">Todav\xEDa no hay nada aqu\xED.<br>Las opciones de dise\xF1o las trae el modelo: abre una plantilla o un ejemplo con cimentaci\xF3n o zapata y volver\xE1n a aparecer en este men\xFA.</div>' : "";
    a.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${Nt[e]}</div>` + n + Ce[e].map((i) => `<div data-id="${i.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${i.icono} ${i.titulo}</b><div style="opacity:.75;margin-top:2px">${i.detalle}</div></div>`).join(""), a.querySelectorAll("[data-id]").forEach((i) => {
      i.onmouseenter = () => i.style.background = "#1f3b5a", i.onmouseleave = () => i.style.background = "", i.onclick = () => {
        var _a;
        Ze(), (_a = Ce[e].find((s) => s.id === i.dataset.id)) == null ? void 0 : _a.abrir();
      };
    }), document.body.appendChild(a);
    const r = o.getBoundingClientRect();
    a.style.top = r.bottom + 4 + "px", a.style.left = Math.max(8, Math.min(r.left, innerWidth - 370)) + "px", de = a;
  }
  mo = function(e) {
    let o = false, t = 0, a = 0;
    const n = (s) => {
      const c = e.firstElementChild;
      return !!c && c.contains(s);
    }, r = () => {
      const s = e.dataset.plegado !== "1";
      e.dataset.plegado = s ? "1" : "0", [
        ...e.children
      ].slice(1).forEach((c) => c.style.display = s ? "none" : ""), e.style.overflow = s ? "hidden" : "auto";
    };
    e.addEventListener("pointerdown", (s) => {
      if (!n(s.target)) return;
      const c = s.target;
      if (c.closest("[data-plegar]")) {
        r();
        return;
      }
      if (c.closest("button,select,input,[id$='-x']")) return;
      const m = e.getBoundingClientRect();
      o = true, t = s.clientX - m.left, a = s.clientY - m.top, e.setPointerCapture(s.pointerId), s.preventDefault();
    }), e.addEventListener("pointermove", (s) => {
      o && (e.style.left = Math.min(Math.max(0, s.clientX - t), innerWidth - 80) + "px", e.style.top = Math.min(Math.max(30, s.clientY - a), innerHeight - 30) + "px", e.style.right = "auto");
    }), e.addEventListener("pointerup", () => {
      o = false;
    }), e.addEventListener("dblclick", (s) => {
      n(s.target) && !s.target.closest("[data-plegar]") && r();
    });
    const i = () => {
      const s = e.firstElementChild;
      if (!s || s.dataset.barra === "1") return;
      s.dataset.barra = "1", s.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", s.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
      const c = s.querySelector("b");
      c && !c.textContent.startsWith("\u283F") && (c.textContent = "\u283F " + c.textContent);
    };
    i(), new MutationObserver(i).observe(e, {
      childList: true
    });
  };
  const x = () => window, vt = "/hekatan-struct-lineal/", pe = (e) => typeof e == "function" ? e() : e, X = (e) => new Promise((o) => setTimeout(o, e));
  let g = null, _ = 0, J = [], Mt = "", ne = true, L = false, V = 0, ce = null;
  const fe = () => {
    var _a;
    (_a = window.speechSynthesis) == null ? void 0 : _a.cancel(), ce && (ce.pause(), ce = null);
  };
  async function Rt(e, o) {
    fe();
    const t = new Audio(vt + e);
    ce = t;
    const a = new Promise((n) => {
      t.onended = () => n(), t.onerror = () => n();
    });
    try {
      await t.play();
    } catch {
      return ce === t && (ce = null), null;
    }
    return o === V ? {
      fin: a
    } : null;
  }
  po = (e, o = 4) => (+e.toFixed(o)).toString().replace(".", ",");
  function jt(e, o) {
    const t = window.speechSynthesis, a = Math.max(1800, e.length * 62);
    return !t || !ne ? X(a) : new Promise((n) => {
      t.cancel();
      const r = new SpeechSynthesisUtterance(e);
      r.lang = "es-ES", r.rate = 1.02;
      const i = t.getVoices().find((m) => m.lang.startsWith("es"));
      i && (r.voice = i);
      let s = false;
      const c = () => {
        s || (s = true, n());
      };
      r.onend = c, r.onerror = c, setTimeout(c, a + 4e3), o === V ? t.speak(r) : c();
    });
  }
  let j = null, U = null, D = null, S = null, Ae = 300, Le = 300, wt = 0, F = null;
  const De = "http://www.w3.org/2000/svg";
  function Xt() {
    if (j) return;
    j = document.createElement("div"), j.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>', j.style.cssText = "position:fixed;z-index:9700;pointer-events:none;left:0;top:0;filter:drop-shadow(0 3px 4px #000c)", U = document.createElement("div"), U.style.cssText = "position:fixed;z-index:9690;pointer-events:none;border:3px solid #22d3ee;border-radius:12px;box-shadow:0 0 0 5px #22d3ee40;transition:all .7s ease;opacity:0", D = document.createElement("div"), D.style.cssText = "position:fixed;z-index:9710;pointer-events:none;background:#111827;color:#cffafe;border:1px solid #22d3ee;border-radius:8px;padding:5px 9px;font:600 14px system-ui;transition:left .7s ease,top .7s ease,opacity .3s;opacity:0;white-space:nowrap", S = document.createElementNS(De, "svg"), S.setAttribute("style", "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9680;pointer-events:none"), S.innerHTML = '<defs><marker id="hk-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#22d3ee"/></marker></defs>', document.body.append(S, U, j, D);
    const e = document.createElement("style");
    e.id = "hk-tutor-st", e.textContent = "@keyframes hkOnda{from{transform:translate(-50%,-50%) scale(.2);opacity:.9}to{transform:translate(-50%,-50%) scale(2.4);opacity:0}}", document.head.appendChild(e), Ke(Ae, Le), Tt();
  }
  function Jt() {
    var _a;
    cancelAnimationFrame(wt), j == null ? void 0 : j.remove(), U == null ? void 0 : U.remove(), D == null ? void 0 : D.remove(), S == null ? void 0 : S.remove(), (_a = document.getElementById("hk-tutor-st")) == null ? void 0 : _a.remove(), j = U = D = null, S = null, F = null;
  }
  function Ke(e, o) {
    e = Math.min(Math.max(e, 4), innerWidth - 30), o = Math.min(Math.max(o, 34), innerHeight - 30), Ae = e, Le = o, j && (j.style.transform = `translate(${e - 3}px,${o - 2}px)`);
  }
  let $e = null;
  function Ue(e, o) {
    const t = Math.hypot(e - Ae, o - Le), a = Math.min(1300, 450 + t * 0.9);
    return new Promise((n) => {
      $e = {
        x0: Ae,
        y0: Le,
        x1: e,
        y1: o,
        t0: performance.now(),
        ms: a,
        ok: n
      };
    });
  }
  function Ut(e, o) {
    const t = document.createElement("div");
    t.style.cssText = `position:fixed;left:${e}px;top:${o}px;width:46px;height:46px;border:3px solid #22d3ee;border-radius:50%;z-index:9695;pointer-events:none;animation:hkOnda .7s ease-out forwards`, document.body.appendChild(t), setTimeout(() => t.remove(), 750);
  }
  function Tt() {
    wt = requestAnimationFrame(Tt);
    const e = performance.now();
    if ($e) {
      const o = $e, t = Math.min(1, (e - o.t0) / o.ms), a = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, n = (o.x0 + o.x1) / 2, r = (o.y0 + o.y1) / 2;
      Math.hypot(o.x1 - o.x0, o.y1 - o.y0);
      const i = n - (o.y1 - o.y0) * 0.12, s = r + (o.x1 - o.x0) * 0.12, c = 1 - a;
      Ke(c * c * o.x0 + 2 * c * a * i + a * a * o.x1, c * c * o.y0 + 2 * c * a * s + a * a * o.y1), t >= 1 && ($e = null, Ut(o.x1, o.y1), o.ok());
      return;
    }
    if (F) {
      const o = e / 900, t = Math.max(8, F.width * 0.3), a = Math.max(6, F.height * 0.3);
      Ke(F.left + F.width / 2 + t * Math.cos(o), F.top + F.height / 2 + a * Math.sin(o));
    }
  }
  function he(e) {
    var _a, _b, _c, _d, _e2;
    const o = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), a = (_e2 = (_d = (_c = x().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val) == null ? void 0 : _e2[e];
    if (!o || !a) return null;
    const n = o.rendererElm.getBoundingClientRect(), r = new Ft(a[0], a[1], a[2]).project(o.camera);
    return [
      n.left + (r.x + 1) / 2 * n.width,
      n.top + (1 - r.y) / 2 * n.height
    ];
  }
  function St(e) {
    let o = 1e9, t = 1e9, a = -1e9, n = -1e9;
    for (const i of e) {
      const s = he(i);
      s && (o = Math.min(o, s[0]), a = Math.max(a, s[0]), t = Math.min(t, s[1]), n = Math.max(n, s[1]));
    }
    if (o > a) return null;
    const r = 4;
    return new DOMRect(o - r, t - r, a - o + 2 * r, n - t + 2 * r);
  }
  function Gt(e) {
    var _a, _b, _c, _d, _e2;
    if (e === "modelo") {
      const r = (_d = (_c = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect();
      return r ? new DOMRect(r.left + r.width * 0.4, r.top + r.height * 0.4, r.width * 0.2, r.height * 0.2) : null;
    }
    if (/^[#.[]/.test(e)) return ((_e2 = document.querySelector(e)) == null ? void 0 : _e2.getBoundingClientRect()) ?? null;
    const o = e.trim().toLowerCase();
    let t = null, a = 1e12;
    for (const r of document.querySelectorAll("body *")) {
      if ((g == null ? void 0 : g.contains(r)) || r.children.length > 2 || (r.textContent || "").trim().toLowerCase() !== o) continue;
      const i = r.getBoundingClientRect();
      !i.width || !i.height || i.width * i.height < a && (t = r, a = i.width * i.height);
    }
    if (!t) return null;
    const n = t.closest(".tp-lblv, .tp-rotv, tr, li") || t;
    return n.scrollIntoView({
      block: "center"
    }), n.getBoundingClientRect();
  }
  function Ht(e, o, t = "alineada") {
    var _a, _b;
    const a = (_b = (_a = x().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val, n = a == null ? void 0 : a[e], r = a == null ? void 0 : a[o];
    if (!n || !r) return null;
    const i = [
      r[0] - n[0],
      r[1] - n[1],
      r[2] - n[2]
    ];
    return t === "vertical" ? Math.abs(i[2]) : t === "horizontal" ? Math.hypot(i[0], i[1]) : Math.hypot(i[0], i[1], i[2]);
  }
  const mt = (e) => (+e.toFixed(kt.DIMDEC + (Math.abs(e) < 10 ? 1 : 0))).toString();
  function Yt(e, o, t, a = "alineada") {
    var _a;
    const n = Ht(e, o, a);
    if (n === null) return t ?? "";
    const r = t && t.includes("=") ? t.split("=")[0].trim() + " = " : "", i = t && !t.includes("=") ? t.trim() : (_a = t == null ? void 0 : t.split("=")[1]) == null ? void 0 : _a.trim(), s = i === void 0 ? NaN : parseFloat(i.replace(",", "."));
    return Number.isFinite(s) && Math.abs(s - n) > Math.max(5e-3, 5e-3 * Math.abs(n)) && console.warn(`[tutor] cota ${e}-${o}: el guion dec\xEDa ${i} y el modelo mide ${mt(n)}; se dibuja la del modelo`), r + mt(n);
  }
  const kt = {
    DIMEXO: 5,
    DIMEXE: 6,
    DIMTXT: 14,
    DIMGAP: 4,
    DIMDEC: 2
  };
  function Wt(e, o, t, a, n, r) {
    const i = kt, s = [
      e[0] + a * r,
      e[1] + n * r
    ], c = [
      o[0] + a * r,
      o[1] + n * r
    ], m = (h, N) => `<line x1="${h[0] + a * i.DIMEXO}" y1="${h[1] + n * i.DIMEXO}" x2="${N[0] + a * i.DIMEXE}" y2="${N[1] + n * i.DIMEXE}" stroke="#22d3ee" stroke-width="1"/>`;
    let p = Math.atan2(c[1] - s[1], c[0] - s[0]) * 180 / Math.PI;
    (p > 90 || p < -90) && (p += 180);
    const d = (s[0] + c[0]) / 2 + a * (i.DIMGAP + i.DIMTXT * 0.35), u = (s[1] + c[1]) / 2 + n * (i.DIMGAP + i.DIMTXT * 0.35);
    return m(e, s) + m(o, c) + `<line x1="${s[0]}" y1="${s[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#22d3ee" stroke-width="1.6" marker-start="url(#hk-fl)" marker-end="url(#hk-fl)"/><text x="${d}" y="${u}" transform="rotate(${p.toFixed(1)} ${d} ${u})" fill="#cffafe" font-family="system-ui" font-weight="700" font-size="${i.DIMTXT}" text-anchor="middle" paint-order="stroke" stroke="#0b1020" stroke-width="4">${t}</text>`;
  }
  function pt(e) {
    var _a, _b;
    if (!S) return;
    S.querySelectorAll("g").forEach((s) => s.remove());
    const o = ((_b = (_a = x().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
    let t = 0, a = 0, n = 0;
    for (let s = 0; s < o.length; s++) {
      const c = he(s);
      c && (t += c[0], a += c[1], n++);
    }
    const r = t / (n || 1), i = a / (n || 1);
    for (const [s, c, m, p = 36, d = "alineada"] of e ?? []) {
      const u = he(s), h = he(c);
      if (!u || !h) continue;
      const N = Yt(s, c, m, d), G = Math.abs(p), b = d === "horizontal" ? [
        u[0],
        Math.max(u[1], h[1])
      ] : d === "vertical" ? [
        Math.max(u[0], h[0]),
        u[1]
      ] : u, M = d === "horizontal" ? [
        h[0],
        Math.max(u[1], h[1])
      ] : d === "vertical" ? [
        Math.max(u[0], h[0]),
        h[1]
      ] : h, te = Math.hypot(M[0] - b[0], M[1] - b[1]) || 1;
      let H = -(M[1] - b[1]) / te, Y = (M[0] - b[0]) / te;
      H * ((b[0] + M[0]) / 2 - r) + Y * ((b[1] + M[1]) / 2 - i) < 0 && (H = -H, Y = -Y);
      const oe = document.createElementNS(De, "g");
      oe.innerHTML = Wt(b, M, N, H, Y, G), oe.style.opacity = "0", oe.style.transition = "opacity .5s", S.appendChild(oe), requestAnimationFrame(() => oe.style.opacity = "1");
    }
  }
  function Zt(e) {
    if (S) for (const [o, t] of e ?? []) {
      const a = St(o);
      if (!a) continue;
      const n = a.left + a.width / 2, r = a.top + a.height / 2, i = document.createElementNS(De, "g");
      i.innerHTML = `<circle cx="${n}" cy="${r}" r="13" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.5"/><text x="${n}" y="${r + 5}" fill="#fff" font-family="system-ui" font-weight="700" font-size="13" text-anchor="middle">${t}</text>`, i.style.opacity = "0", i.style.transition = "opacity .5s", S.appendChild(i), requestAnimationFrame(() => i.style.opacity = "1");
    }
  }
  async function Kt(e, o) {
    var _a, _b, _c, _d, _e2;
    if (Xt(), typeof e == "string" && e !== "modelo" && !/^[#.[]/.test(e) && document.body.classList.contains("hk-pane-oculto")) {
      const i = document.getElementById("hk-pane-toggle");
      if (i) {
        const s = i.getBoundingClientRect();
        U.style.opacity = "0", D.style.opacity = "0", await Ue(s.left + s.width / 2, s.top + s.height / 2), i.click(), Ge = true, gt(true), await X(700);
      }
    } else Ge && (e === void 0 || typeof e != "string" || e === "modelo" || e.startsWith("[data-cuerpo]")) && (Qe(), Ge = false, gt(false), await X(700));
    const t = e === void 0 ? null : typeof e == "string" ? Gt(e) : St(e.nudos);
    F = null;
    const a = typeof e == "string" && e !== "modelo" && !e.startsWith("[data-cuerpo]");
    if (S && (S.style.transition = "opacity .3s", S.style.opacity = a ? "0" : "1"), !t) {
      if (U.style.opacity = "0", D.style.opacity = "0", g) {
        const i = g.getBoundingClientRect();
        await Ue(i.right - 50, i.bottom - 70);
      }
      return;
    }
    const n = t.left + t.width / 2, r = t.top + t.height / 2;
    if (S.querySelectorAll("[data-punto]").forEach((i) => i.remove()), e !== void 0 && typeof e != "string") {
      U.style.opacity = "0";
      for (const i of e.nudos) {
        const s = he(i);
        if (!s) continue;
        const c = document.createElementNS(De, "circle");
        c.setAttribute("data-punto", "1"), c.setAttribute("cx", `${s[0]}`), c.setAttribute("cy", `${s[1]}`), c.setAttribute("r", "7"), c.setAttribute("fill", "#22d3ee"), c.setAttribute("stroke", "#000"), c.setAttribute("stroke-width", "1.5"), c.innerHTML = '<animate attributeName="r" values="5;10;5" dur="1.2s" repeatCount="indefinite"/>', S.appendChild(c);
      }
    } else Object.assign(U.style, {
      left: t.left + "px",
      top: t.top + "px",
      width: t.width + "px",
      height: t.height + "px",
      opacity: "1"
    });
    if (o) {
      D.textContent = o;
      const i = (((_e2 = (_d = (_c = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect()) == null ? void 0 : _e2.right) ?? innerWidth) - 10, s = D.offsetWidth || 260, c = n + 30 + s > i ? n - 30 - s : n + 30;
      Object.assign(D.style, {
        left: Math.max(c, 8) + "px",
        top: Math.max(t.top - 40, 40) + "px",
        opacity: "1"
      });
    } else D.style.opacity = "0";
    await Ue(n, r), F = typeof e == "string" ? t : new DOMRect(n - 20, r - 14, 40, 28);
  }
  async function ft(e) {
    !e || !x().__hekatanParams || !x().__hekatanRebuild || (Object.assign(x().__hekatanParams(), e), x().__hekatanRebuild(), await X(500), Pe(), await X(250));
  }
  function ht() {
    if (!g) return;
    const e = J[_], o = g.querySelector("[data-cuerpo]");
    o.innerHTML = `<div style="color:#94a3b8;font-size:12px;margin-bottom:2px">${Mt.replace(/^Tutor · /, "")}</div><div style="font-weight:700;color:#7dd3fc;margin-bottom:6px">${_ + 1}/${J.length} \xB7 ${e.titulo}</div>` + (e.fig ? `<img src="${vt}img/itw/${e.fig}" style="width:100%;max-height:44vh;object-fit:contain;background:#fff;border-radius:6px;margin:6px 0 12px">` : "") + `<div style="line-height:1.5">${e.texto()}</div>`, g.querySelector("[data-ant]").disabled = _ === 0, g.querySelector("[data-sig]").disabled = _ === J.length - 1, g.querySelector("[data-barra]").style.width = `${(_ + 1) / J.length * 100}%`;
  }
  async function ie() {
    var _a, _b;
    if (!g) return;
    const e = ++V;
    fe();
    const o = J[_];
    if (await ft(o.params), e !== V) return;
    ht(), await ((_a = g == null ? void 0 : g.querySelector("[data-cuerpo] img")) == null ? void 0 : _a.decode().catch(() => {
    })), pt([]);
    const t = o.tiempos ?? [
      {
        voz: o.voz ?? (() => g.querySelector("[data-cuerpo]").innerText),
        senalar: o.senalar
      }
    ], a = o.audio && ne ? await Rt(o.audio, e) : null;
    if (o.audio && ne && !a && g) {
      const n = document.createElement("div");
      if (n.style.cssText = "margin-top:10px;color:#fca5a5;font-size:13px", n.textContent = "Pulsa \u25B6 Reproducir o \u21BB para o\xEDr la voz (el navegador pide un clic).", (_b = g.querySelector("[data-cuerpo]")) == null ? void 0 : _b.appendChild(n), L) {
        L = false, be();
        return;
      }
    }
    for (const n of t) {
      if (e !== V || !g) return;
      n.params && await ft(n.params), n.accion && (await n.accion(), await X(300)), (n.params || n.accion) && ht(), (n.cotas || n.etiquetas) && (pt(n.cotas ? pe(n.cotas) : []), Zt(n.etiquetas ? pe(n.etiquetas) : []));
      const r = o.audio ? X(n.ms ?? 2500) : jt(pe(n.voz), e);
      await Kt(n.senalar === void 0 ? void 0 : pe(n.senalar), n.globo === void 0 ? void 0 : pe(n.globo)), await r, await X(250);
    }
    a && e === V && await a.fin, L && e === V && _ < J.length - 1 ? (await X(500), e === V && (_++, ie())) : L && _ === J.length - 1 && (L = false, be());
  }
  function be() {
    const e = g == null ? void 0 : g.querySelector("[data-auto]");
    e && (e.textContent = L ? "\u23F8 Pausa" : "\u25B6 Reproducir");
  }
  const ze = "min(44vw, 720px)";
  let re = null, Ge = false, bt = false;
  const He = () => document.body.classList.contains("hk-pane-oculto"), Qe = () => {
    var _a;
    return (_a = document.getElementById("hk-pane-toggle")) == null ? void 0 : _a.click();
  };
  function Qt() {
    var _a, _b, _c, _d, _e2, _f;
    const e = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), o = (_d = (_c = x().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val;
    if (!e || !(o == null ? void 0 : o.length)) return;
    const t = [
      1 / 0,
      1 / 0,
      1 / 0
    ], a = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const p of o) for (let d = 0; d < 3; d++) p[d] < t[d] && (t[d] = p[d]), p[d] > a[d] && (a[d] = p[d]);
    const n = [
      a[0] - t[0],
      a[1] - t[1],
      a[2] - t[2]
    ], r = Math.max(...n), i = n.indexOf(Math.min(...n));
    if (n[i] > 0.02 * r) return;
    const s = e.camera, c = e.controls.target;
    c.set((t[0] + a[0]) / 2, (t[1] + a[1]) / 2, (t[2] + a[2]) / 2);
    const m = Math.hypot(...n) * 1.6 + 1;
    s.position.set(c.x + (i === 0 ? m : 0), c.y + (i === 1 ? m : 0), c.z + (i === 2 ? m : 0)), s.up.set(0, i === 2 ? 1 : 0, i === 2 ? 0 : 1), s.lookAt(c), s.updateProjectionMatrix(), (_f = (_e2 = e.controls).update) == null ? void 0 : _f.call(_e2), e.render();
  }
  function Pe() {
    var _a, _b;
    (_b = (_a = x()).__hekatanAutoFit) == null ? void 0 : _b.call(_a), setTimeout(() => {
      var _a2, _b2, _c, _d;
      Qt();
      const e = (_b2 = (_a2 = x()).__hekatanViewerCtx) == null ? void 0 : _b2.call(_a2);
      if (!e) return;
      const o = e.controls.target, t = e.camera;
      t.isOrthographicCamera ? t.zoom /= 1.3 : t.position.sub(o).multiplyScalar(1.3).add(o), t.updateProjectionMatrix(), (_d = (_c = e.controls).update) == null ? void 0 : _d.call(_c), e.render();
    }, 120);
  }
  function gt(e) {
    var _a, _b, _c;
    const o = (_b = (_a = x()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    if (!o || re === null) return;
    (_c = document.getElementById("hk-pane-toggle")) == null ? void 0 : _c.previousElementSibling;
    const t = e ? 450 : 130;
    o.style.width = `calc(100% - ${ze} - ${t}px)`, setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Pe();
    }, 300);
  }
  function xt(e) {
    var _a, _b;
    const o = (_b = (_a = x()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    o && (e ? (re === null && (re = o.style.cssText, bt = He()), He() || Qe(), document.body.classList.add("hk-tutor"), o.style.marginLeft = ze, o.style.width = `calc(100% - ${ze} - 130px)`) : re !== null && (o.style.cssText = re, re = null, document.body.classList.remove("hk-tutor"), He() !== bt && Qe()), setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Pe();
    }, 400), setTimeout(Pe, 1100));
  }
  function Ye(e, o, t = false) {
    var _a, _b;
    J = o, Mt = e, _ = 0, L = t;
    try {
      const n = (_b = (_a = x()).__hekatanSettings) == null ? void 0 : _b.call(_a);
      (n == null ? void 0 : n.shellResults) && (n.shellResults.val = "displacementZ");
    } catch {
    }
    g == null ? void 0 : g.remove(), g = document.createElement("div"), g.style.cssText = `position:fixed;top:32px;left:0;width:${ze};bottom:92px;overflow-y:auto;overflow-x:hidden;z-index:9500;background:#0f172a;color:#e2e8f0;border-right:2px solid #334155;font:16px system-ui;box-shadow:6px 0 20px #0008`, g.innerHTML = '<div style="padding:8px 10px;background:#1e3a8a;border-radius:10px 10px 0 0;display:flex;gap:8px;align-items:center;cursor:move"><b style="flex:1">\u{1F393} Tutor</b><button data-voz title="Voz s\xED / no" style="background:none;border:0;color:#fff;cursor:pointer">\u{1F50A}</button><button data-x title="Cerrar" style="background:none;border:0;color:#fff;cursor:pointer">\u2715</button></div><div style="height:3px;background:#1e293b"><div data-barra style="height:3px;background:#22d3ee;width:0;transition:width .5s"></div></div><div data-cuerpo style="padding:12px 18px;line-height:1.55"></div><div style="display:flex;gap:8px;padding:10px 18px 16px;position:sticky;bottom:0;background:#0f172a;font-size:16px"><button data-ant style="padding:6px 10px">\u25C0</button><button data-auto style="flex:1;padding:6px;background:#16a34a;color:#fff;border:0;border-radius:4px;font-weight:600">\u25B6 Reproducir</button><button data-rep style="padding:6px 10px" title="Repetir este paso">\u21BB</button><button data-sig style="flex:1;padding:6px;background:#2563eb;color:#fff;border:0;border-radius:4px">Siguiente \u25B6</button></div>', document.body.appendChild(g), xt(true), be();
    const a = (n) => g.querySelector(n);
    a("[data-x]").addEventListener("click", () => {
      V++, L = false, fe(), g == null ? void 0 : g.remove(), g = null, Jt(), xt(false);
    }), a("[data-voz]").addEventListener("click", (n) => {
      ne = !ne, n.target.textContent = ne ? "\u{1F50A}" : "\u{1F507}", ne || fe();
    }), a("[data-ant]").addEventListener("click", () => {
      _ > 0 && (L = false, be(), _--, ie());
    }), a("[data-sig]").addEventListener("click", () => {
      _ < J.length - 1 && (_++, ie());
    }), a("[data-rep]").addEventListener("click", () => ie()), a("[data-auto]").addEventListener("click", () => {
      L = !L, be(), L ? ie() : (V++, fe());
    }), ie();
  }
  eo = function(e, o, t) {
    typeof window > "u" || !x().__hekatanRebuild || (x().__hekatanTutorTest = (a) => Ye(o, t(), !!a), !x().__hekatanTutorAuto && new URLSearchParams(location.search).get("tutor") === "1" && (x().__hekatanTutorAuto = true, setTimeout(() => Ye(o, t(), true), 2500)), qt({
      id: "tutor-" + e,
      orden: 5,
      icono: "\u{1F393}",
      titulo: "Tutor del test (paso a paso, con voz)",
      detalle: "Explica este banco: el problema del paper, la soluci\xF3n exacta y cada malla con los n\xFAmeros de Hekatan.",
      abrir: () => Ye(o, t())
    }));
  };
  const Et = 9.80665, E = () => window, ge = () => E().__hekatanStates, K = (e) => Number.isFinite(e) ? e.toFixed(2) : "\u2014", Q = (e) => Number.isFinite(e) ? e.toFixed(3) : "\u2014", ot = () => {
    var _a, _b;
    return ((_b = (_a = ge()) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
  }, to = () => {
    var _a;
    return (_a = ge()) == null ? void 0 : _a._mesaTorsionIdx;
  }, et = () => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = E()).__hekatanParams) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.Lx) ?? 6;
  }, y = () => ot().map((e, o) => [
    e,
    o
  ]).filter(([e]) => Math.abs(e[1]) < 1e-9 && e[2] > 1e-9).sort((e, o) => e[0][0] - o[0][0]).map(([, e]) => e), oo = () => {
    const e = ot();
    let o = -1, t = 1e9;
    return e.forEach((a, n) => {
      if (a[2] < 1e-9) return;
      const r = Math.hypot(a[0] - et() / 2, a[1] - et() / 2);
      r < t && (t = r, o = n);
    }), o;
  };
  function B() {
    var _a, _b, _c;
    const e = (_c = (_b = (_a = ge()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c.torsions, o = to();
    if (!e || !o) return NaN;
    let t = 0;
    for (let a = o.beamStart; a < o.beamEnd; a++) {
      const n = e.get(a);
      n && (t = Math.max(t, Math.abs(n[0]), Math.abs(n[1])));
    }
    return t / Et;
  }
  function We() {
    var _a, _b, _c, _d;
    const e = (_b = (_a = ge()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val, o = (_d = (_c = ge()) == null ? void 0 : _c.elements) == null ? void 0 : _d.val, t = ot(), a = (e == null ? void 0 : e.bendingYYjoint) ?? (e == null ? void 0 : e.bendingYY);
    if (!a || !o) return NaN;
    const n = /* @__PURE__ */ new Map();
    for (const [s, c] of a) {
      const m = o[s];
      !m || m.length !== 4 || m.forEach((p, d) => {
        if (Math.abs(t[p][1]) > 1e-9) return;
        const u = n.get(p) ?? [
          0,
          0
        ];
        n.set(p, [
          u[0] + c[d],
          u[1] + 1
        ]);
      });
    }
    const r = [
      ...n.entries()
    ].map(([s, [c, m]]) => ({
      x: t[s][0],
      m: c / m / Et
    })).sort((s, c) => s.x - c.x), i = et() / 2;
    for (let s = 0; s < r.length - 1; s++) if (i >= r[s].x - 1e-9 && i <= r[s + 1].x + 1e-9) return r[s].m + (r[s + 1].m - r[s].m) * (i - r[s].x) / (r[s + 1].x - r[s].x);
    return NaN;
  }
  function R() {
    var _a, _b;
    const e = ((_b = (_a = E()).__hekatanParams) == null ? void 0 : _b.call(_a)) ?? {}, o = 2812.279 / 0.70307, t = 1 / 0.0254, a = (e.bViga ?? 0.3) * t, n = (e.hViga ?? 0.5) * t;
    return 0.75 * (4 * Math.sqrt(o) * (a * n) ** 2 / (2 * (a + n))) * 4.4482216 * 0.0254 / 9806.65;
  }
  const _t = (e) => new Promise((o) => setTimeout(o, e));
  async function le(e) {
    Object.assign(E().__hekatanParams(), e), E().__hekatanRebuild(), await _t(450);
  }
  function ee(e, o) {
    var _a, _b;
    const t = (_b = (_a = E()).__hekatanSettings) == null ? void 0 : _b.call(_a);
    t && (e !== void 0 && t.frameResults && (t.frameResults.val = e), o !== void 0 && t.shellResults && (t.shellResults.val = o));
  }
  async function q(e) {
    var _a, _b, _c, _d, _e2, _f, _g;
    if ((_b = (_a = E()).__hekatanSetView) == null ? void 0 : _b.call(_a, e), e !== "iso") return;
    await _t(200);
    const o = (_d = (_c = E()).__hekatanViewerCtx) == null ? void 0 : _d.call(_c);
    if (!o) return;
    const t = o.controls.target, a = o.camera;
    a.isOrthographicCamera ? a.zoom /= 1.35 : a.position.sub(t).multiplyScalar(1.35).add(t), a.updateProjectionMatrix(), (_f = (_e2 = o.controls).update) == null ? void 0 : _f.call(_e2), (_g = o.render) == null ? void 0 : _g.call(o);
  }
  let v = [];
  async function ao(e = 6) {
    v = [];
    let o = 1;
    await le({
      factorJ: 1
    });
    for (let t = 0; t < e; t++) {
      const a = B();
      if (v.push({
        f: o,
        Tu: a
      }), R() / a >= 0.95) break;
      o *= R() / a, await le({
        factorJ: +o.toFixed(4)
      });
    }
    return v[v.length - 1];
  }
  const no = {
    nMesh: 5,
    factorJ: 1,
    vigaNudos: 1,
    activeCase: 4,
    rigidOffsets: 0
  }, se = (e) => `<p style="font-size:13px;color:#94a3b8;margin-top:8px">${e}</p>`, _e = (e) => `<div style="font:600 19px Cambria,serif;color:#fff;margin:8px 0 8px 12px">${e}</div>`;
  function so() {
    return [
      {
        titulo: "1. La mesa",
        audio: "tutoriales/mesa_torsion/p1.mp3",
        params: no,
        texto: () => {
          var _a, _b, _c, _d;
          return "<p>Losa de 10 cm sobre cuatro vigas de borde (30\xD750) y cuatro columnas (40\xD740, base articulada). La losa se modela con <b>c\xE1scaras</b> Shell-Thin y la viga con un <b>elemento frame</b>.</p>" + se(`Modelo: Mesa torsi\xF3nT.e2k (ETABS 19.1), combinaci\xF3n UDCon2 = 1.2D + 1.6L + 1.2SCP, losa ${(_b = (_a = E()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = E()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 3200,
            accion: async () => {
              await q("iso"), ee("none", "displacementZ");
            },
            senalar: () => ({
              nudos: [
                oo()
              ]
            }),
            globo: "Losa: c\xE1scara Shell-Thin, t = 0.10 m"
          },
          {
            voz: "",
            ms: 3200,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Viga 30\xD750: barra (frame)"
          },
          {
            voz: "",
            ms: 2800,
            senalar: () => ({
              nudos: [
                0,
                y()[0]
              ]
            }),
            globo: "Columna 40\xD740, base articulada"
          }
        ]
      },
      {
        titulo: "2. C\xF3mo se unen losa y viga (Wilson \xA77.7)",
        audio: "tutoriales/mesa_torsion/p2.mp3",
        texto: () => "<p>En Wilson el nodo <i>i</i> est\xE1 en el plano medio de la losa y el <i>j</i> en el eje neutro de la viga; se unen con una <b>restricci\xF3n r\xEDgida</b> (ec. 7.15):</p>" + _e("\u03B8<sub>x</sub><sup>losa</sup> = \u03B8<sub>x</sub><sup>viga</sup>") + '<p style="font-size:14px;color:#cbd5e1">Wilson, <i>An\xE1lisis Est\xE1tico y Din\xE1mico de Estructuras</i>, \xA77.7, Fig. 7.6, ec. (7.15), p\xE1gs. 119\u2013120.</p>' + se("En Struct (brazos r\xEDgidos = 0) viga y losa COMPARTEN el nudo: la restricci\xF3n queda en la igualdad de giros en cada nudo compartido."),
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: () => q("elevX"),
            senalar: () => ({
              nudos: y()
            }),
            globo: "\u03B8x losa = \u03B8x viga en cada nudo compartido"
          },
          {
            voz: "",
            ms: 6e3,
            senalar: () => ({
              nudos: [
                y()[Math.floor(y().length / 2)]
              ]
            }),
            globo: "Nudo compartido losa\u2013viga"
          }
        ]
      },
      {
        titulo: "3. Por eso la viga se tuerce",
        audio: "tutoriales/mesa_torsion/p3.mp3",
        texto: () => "<p>La losa cargada quiere girar en su borde; la viga lo impide con su rigidez torsional:</p>" + _e("T<sub>u</sub> = G\xB7J\xB7\u03B8\u2032") + `<p>Es <b>torsi\xF3n de compatibilidad</b>: aparece porque la viga acompa\xF1a el giro de la losa.</p><p>En este modelo: <b>T<sub>u</sub> = ${Q(B())} tonf\xB7m</b> (m\xE1ximo, junto a la columna).</p>`,
        tiempos: [
          {
            voz: "",
            ms: 6e3,
            accion: async () => {
              await q("plan"), ee("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                y()[0],
                y()[1]
              ]
            }),
            globo: () => `T_u = ${K(B())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 5200,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Diagrama de torsi\xF3n de la viga"
          }
        ]
      },
      {
        titulo: "4. \xBFEs confiable esa T<sub>u</sub>? El mallado",
        audio: "tutoriales/mesa_torsion/p4.mp3",
        texto: () => {
          var _a, _b, _c, _d;
          return `<p>La compatibilidad solo se cumple <b>en los nudos compartidos</b>. Wilson: <i>\u201Cpodr\xEDa ser necesario aplicar la restricci\xF3n a varias secciones a lo largo del eje de la viga\u201D</i>.</p><p>Losa ${(_b = (_a = E()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = E()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}: <b>${y().length}</b> nudos compartidos \xB7 <b>T<sub>u</sub> = ${Q(B())} tonf\xB7m</b>.</p>` + _e("dT/dx = m<sub>borde</sub>(x) \u21D2 T<sub>u</sub> = \u222B\u2080<sup>L/2</sup> m dx") + '<table style="font-size:13px;color:#cbd5e1;border-collapse:collapse"><tr><th style="padding:2px 8px">n</th><th style="padding:2px 8px">Struct</th><th style="padding:2px 8px">ETABS 22</th></tr>' + [
            [
              1,
              "0.000",
              "0.000"
            ],
            [
              2,
              "2.615",
              "2.528"
            ],
            [
              4,
              "5.040",
              "4.860"
            ],
            [
              8,
              "5.849",
              "5.639"
            ],
            [
              16,
              "6.059",
              "5.844"
            ]
          ].map(([e, o, t]) => `<tr><td style="padding:1px 8px">${e}</td><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">${t}</td></tr>`).join("") + "</table>" + se("Tabla: registros/2026-09-23_torsion_vs_malla.md (misma malla en los dos programas, brazos 0). A 32\xD732 T_u = \u2212\u222Bm dx al 1 %.");
        },
        tiempos: [
          1,
          2,
          4,
          8,
          16
        ].map((e) => ({
          voz: "",
          ms: 3300,
          params: {
            nMesh: e
          },
          accion: () => {
            q("plan"), ee("contour:torsions", "none");
          },
          senalar: () => ({
            nudos: y()
          }),
          globo: () => `${e}\xD7${e}: ${y().length} nudos compartidos \xB7 T_u = ${K(B())} tonf\xB7m`
        }))
      },
      {
        titulo: "5. Modelo lineal: la viga no cumple",
        audio: "tutoriales/mesa_torsion/p5.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => `<p>Con J bruta, malla 5\xD75 (la de ETABS): <b>T<sub>u</sub> = ${Q(B())} tonf\xB7m</b> en Struct; la voz cita el de ETABS, 5.22 (Struct queda +3.7 % en torsi\xF3n en todas las mallas).</p><p>\u03C6T<sub>cr</sub> = <b>${Q(R())} tonf\xB7m</b> (ACI 318-19 \xA722.7.5.1, viga 30\xD750 sin alas, f'c = 4000 psi) \u2192 T<sub>u</sub> / \u03C6T<sub>cr</sub> = ${K(B() / R())}.</p>` + se("La interacci\xF3n cortante\u2013torsi\xF3n 51.46 > 31.67 kgf/cm\xB2 y el O/S #45 son del dise\xF1o de ETABS: Struct no hace ese chequeo y no los verifica."),
        tiempos: [
          {
            voz: "",
            ms: 7e3,
            accion: async () => {
              await q("plan"), ee("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                y()[0],
                y()[1]
              ]
            }),
            globo: () => `T_u = ${K(B())} > \u03C6T_cr = ${K(R())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 6500,
            senalar: () => ({
              nudos: y()
            }),
            globo: "ETABS: O/S #45 (sobreesfuerzo cortante + torsi\xF3n)"
          }
        ]
      },
      {
        titulo: "6. La viga se fisura: J se reduce",
        audio: "tutoriales/mesa_torsion/p6.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => "<p>Si T<sub>u</sub> &gt; T<sub>cr</sub> la viga se fisura y su rigidez torsional cae. ACI 318 \xA722.7.3.2 permite dise\xF1arla para \u03C6T<sub>cr</sub>. Se itera:</p>" + _e("f<sub>k+1</sub> = f<sub>k</sub> \xB7 \u03C6T<sub>cr</sub> / T<sub>u,k</sub>") + (v.length ? '<table style="font-size:13px;color:#cbd5e1">' + v.map((e, o) => `<tr><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">f = ${e.f.toFixed(4)}</td><td style="padding:1px 8px">T_u = ${Q(e.Tu)}</td><td style="padding:1px 8px">\u03C6T_cr/T_u = ${Q(R() / e.Tu)}</td></tr>`).join("") + "</table>" : "") + se(`Struct, malla 5\xD75, \u03C6T_cr = ${Q(R())}. La voz cita el c\xE1lculo de ETABS (factor 0.0695, T_u = 2.00, \u03C6T_cr = 1.94); el \u03C6T_cr de ETABS no se reprodujo aqu\xED. Reducir J e iterar es una aproximaci\xF3n secante de la viga fisurada. Solo vale en torsi\xF3n de COMPATIBILIDAD; la de EQUILIBRIO no se reduce.`),
        tiempos: [
          0,
          1,
          2,
          3,
          4,
          5
        ].map((e) => ({
          voz: "",
          ms: 3e3,
          accion: async () => {
            if (e === 0) v = [], await le({
              factorJ: 1
            });
            else {
              const t = v[v.length - 1];
              R() / t.Tu < 0.95 && await le({
                factorJ: +(t.f * R() / t.Tu).toFixed(4)
              });
            }
            await q("plan"), ee("contour:torsions", "none");
            const o = E().__hekatanParams().factorJ;
            (!v.length || v[v.length - 1].f !== o) && v.push({
              f: o,
              Tu: B()
            });
          },
          senalar: () => ({
            nudos: [
              y()[0],
              y()[1]
            ]
          }),
          globo: () => `paso ${e}: factor J = ${E().__hekatanParams().factorJ.toFixed(4)} \xB7 T_u = ${K(B())} tonf\xB7m`
        }))
      },
      {
        titulo: "7. El momento pasa a la losa",
        audio: "tutoriales/mesa_torsion/p7.mp3",
        texto: () => {
          const e = v.length ? v[v.length - 1].f : NaN;
          return `<p>El torque que la viga ya no toma lo toma la <b>losa</b>. Mapa: momento M22 de la losa (m<sub>yy</sub>).</p><p>Borde sur, centro: <b>m = ${Q(We())} tonf\xB7m/m</b> con factor J = ${E().__hekatanParams().factorJ.toFixed(4)}.</p>` + se(`Lo que se conserva EXACTO es el momento del corte completo x = L/2: losa + vigas + empuje de p\xF3rtico H\xB7h = 65.681 tonf\xB7m con J bruta y con J reducida (malla 16\xD716); la losa pasa de 8.11 a 13.57. La suma borde + centro en UN punto no es constante (no es una franja sobre apoyos r\xEDgidos). La voz cita ETABS (\u22122.73 \u2192 \u22120.85); factor final de Struct: ${Number.isFinite(e) ? e.toFixed(4) : "\u2014"}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: async () => {
              await le({
                factorJ: 1
              }), await q("iso"), ee("none", "bendingYY");
            },
            senalar: () => ({
              nudos: y().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J bruta: m_borde = ${K(We())} tonf\xB7m/m`
          },
          {
            voz: "",
            ms: 6300,
            accion: async () => {
              v.length || await ao(), await le({
                factorJ: +v[v.length - 1].f.toFixed(4)
              }), await q("iso"), ee("none", "bendingYY");
            },
            senalar: () => ({
              nudos: y().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J fisurada: m_borde = ${K(We())} tonf\xB7m/m`
          }
        ]
      },
      {
        titulo: "8. Conclusi\xF3n para el dise\xF1o",
        audio: "tutoriales/mesa_torsion/p8.mp3",
        texto: () => "<p>\u2022 La T<sub>u</sub> lineal es un <b>m\xE1ximo el\xE1stico</b>, confiable solo si la malla converge (T<sub>u</sub> sube al refinar: 0 \u2192 2.62 \u2192 5.04 \u2192 5.85 \u2192 6.06).<br>\u2022 La <b>losa</b> se arma con los momentos <b>despu\xE9s</b> de fisurar la viga (positivo al centro +48 % a 16\xD716).<br>\u2022 La <b>viga</b> igual lleva estribos cerrados y acero longitudinal para \u03C6T<sub>cr</sub>.<br>\u2022 Solo aplica a torsi\xF3n de <b>compatibilidad</b>; la de <b>equilibrio</b> (un volado colgado de la viga) no se reduce.<br>\u2022 Reducir J e iterar es una aproximaci\xF3n secante del comportamiento no lineal.</p>",
        tiempos: [
          {
            voz: "",
            ms: 9500,
            accion: async () => {
              await q("iso"), ee("contour:torsions", "none");
            },
            senalar: "modelo"
          },
          {
            voz: "",
            ms: 9e3,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Estribos cerrados + longitudinal para \u03C6T_cr"
          }
        ]
      }
    ];
  }
  let ae, yt, O;
  ae = 9.80665;
  yt = {
    Dead: {
      P: 5.72,
      V2: 2.05,
      V3: 0.45,
      T: 0.53,
      M2: 1.57,
      M3: 2.43
    },
    Live: {
      P: 4.5,
      V2: 2.2,
      V3: 0.61,
      T: 1.15,
      M2: 2.13,
      M3: 3.14
    },
    SCP: {
      P: 9,
      V2: 4.41,
      V3: 1.22,
      T: 2.29,
      M2: 4.26,
      M3: 6.28
    },
    UDCon1: {
      P: 20.61,
      V2: 9.03,
      V3: 2.33,
      T: 3.96,
      M2: 8.16,
      M3: 12.2
    },
    UDCon2: {
      P: 24.86,
      V2: 11.27,
      V3: 2.97,
      T: 5.22,
      M2: 10.4,
      M3: 15.48
    }
  };
  O = [
    0.34337,
    0.34337,
    0.28756
  ];
  fo = {
    id: "mesa-torsion",
    name: "\u{1F300} Mesa de Torsi\xF3n (ETABS Gabriela/Seproinca)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    guide: [
      "Modelo 'Mesa de torsi\xF3n' ETABS 19.1 (Gabriela/Seproinca 2020).",
      "6\xD76m \xD7 4m alto \xB7 4 col C40\xD740 PINNED-base \xB7 4 vigas V30\xD750 perim \xB7 losa 10cm \xB7 diaph r\xEDgido.",
      "Selector 'Caso visualizado' cambia entre Dead/Live/SCP/UDCon1/UDCon2.",
      "Tabla \u{1F4CA} Comparaci\xF3n ETABS muestra picks ETABS vs Hekatan por componente y diferencia %.",
      "ETABS periodos modal: T1=T2=0.34337s lateral, T3=0.28756s torsi\xF3n Rz.",
      "Rigid offsets ETABS: col flexible=3.5m (auto -h_viga/2), viga flexible=5.6m (auto -b_col/2).",
      "T_u vs malla (Wilson \xA77.7): cambia 'Subdiv losa' 1\u219216 y 'Uni\xF3n viga\u2013losa'; T_u = 0 / 2.61 / 5.04 / 5.85 / 6.06 tonf\xB7m (UDCon2).",
      "\u{1F393} Tutor con voz: men\xFA \xAB\u{1F4D0} Dise\xF1o\xBB \u2192 \xABTutor del test\xBB, o abre ?t=mesa-torsion&tutor=1 (Wilson \xA77.7, malla, ACI \xA722.7.3.2)."
    ],
    params: {
      activeCase: {
        default: 0,
        label: "Caso visualizado",
        options: {
          "Dead (selfweight)": 0,
          "Live (q=0.5 tonf/m\xB2)": 1,
          "SCP (q=1.0 tonf/m\xB2)": 2,
          "UDCon1 (1.4D+1.4SCP)": 3,
          "UDCon2 (1.2D+1.6L+1.2SCP)": 4
        },
        folder: "Caso"
      },
      Lx: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Lx (m)",
        folder: "Geometr\xEDa"
      },
      Ly: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Ly (m)",
        folder: "Geometr\xEDa"
      },
      H: {
        default: 4,
        min: 2.5,
        max: 6,
        step: 0.25,
        label: "H piso (m)",
        folder: "Geometr\xEDa"
      },
      nMesh: {
        default: 5,
        min: 1,
        max: 32,
        step: 1,
        label: "Subdiv losa (n\xD7n)",
        folder: "Geometr\xEDa"
      },
      vigaNudos: {
        default: 1,
        label: "Uni\xF3n viga\u2013losa",
        options: {
          "Nudos compartidos (viga partida en la malla)": 1,
          "Solo en los extremos (viga de una pieza)": 0
        },
        folder: "Geometr\xEDa"
      },
      bCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "b col (m)",
        folder: "Secciones"
      },
      hCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "h col (m)",
        folder: "Secciones"
      },
      bViga: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "b viga (m)",
        folder: "Secciones"
      },
      hViga: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.05,
        label: "h viga (m)",
        folder: "Secciones"
      },
      tLosa: {
        default: 0.1,
        min: 0.08,
        max: 0.3,
        step: 0.01,
        label: "t losa (m)",
        folder: "Secciones"
      },
      factorJ: {
        default: 1,
        min: 1e-3,
        max: 1,
        step: 1e-4,
        label: "Factor J vigas",
        folder: "Secciones"
      },
      E_GPa: {
        default: 24.85,
        min: 15,
        max: 35,
        step: 0.5,
        label: "E (GPa)",
        folder: "Material"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.3,
        step: 0.01,
        label: "\u03BD",
        folder: "Material"
      },
      gamma_kNm3: {
        default: 23.57,
        min: 18,
        max: 28,
        step: 0.1,
        label: "\u03B3 (kN/m\xB3)",
        folder: "Material"
      },
      apoyo: {
        default: 0,
        label: "Apoyo base",
        options: {
          "Pinned (UX UY UZ)": 0,
          "Empotrado (6 DOF)": 1
        },
        folder: "Apoyo"
      },
      rigidOffsets: {
        default: 1,
        label: "Rigid offsets ETABS-like",
        options: {
          "ON (h_viga/2 + b_col/2)": 1,
          "OFF (full length)": 0
        },
        folder: "ETABS features"
      },
      q_SCP: {
        default: 1,
        min: 0,
        max: 5,
        step: 0.1,
        label: "SCP (tonf/m\xB2)",
        folder: "Cargas"
      },
      q_Live: {
        default: 0.5,
        min: 0,
        max: 5,
        step: 0.1,
        label: "Live (tonf/m\xB2)",
        folder: "Cargas"
      },
      nModos: {
        default: 12,
        min: 3,
        max: 24,
        step: 1,
        label: "N modos modal",
        folder: "Modal"
      },
      masaModal: {
        default: 0,
        label: "Masa modal",
        options: {
          "ETABS (K_M: viga en esquinas, lateral, por piso)": 0,
          "Por elemento (viga repartida)": 1
        },
        folder: "Modal"
      }
    },
    computedLabels(e, o) {
      const t = {}, a = o._mesaTorsionCases;
      if (!a) return t;
      t["\u2014\u2014 ETABS ref T\u2081 Ux \u2014\u2014"] = `${O[0].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2082 Uy \u2014\u2014"] = `${O[1].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2083 Rz \u2014\u2014"] = `${O[2].toFixed(4)} s`;
      for (const n of [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ]) {
        const r = a[n], i = yt[n];
        if (!r || !i) continue;
        const s = (c, m) => {
          const p = m !== 0 ? (c - m) / m * 100 : 0;
          return `H=${c.toFixed(2)}  E=${m.toFixed(2)}  \u0394=${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
        };
        t[`${n} |P|`] = s(r.P, i.P), t[`${n} |V\u2082|`] = s(r.V2, i.V2), t[`${n} |V\u2083|`] = s(r.V3, i.V3), t[`${n} |T|`] = s(r.T, i.T), t[`${n} |M\u2082|`] = s(r.M2, i.M2), t[`${n} |M\u2083|`] = s(r.M3, i.M3);
      }
      return t;
    },
    build(e, o) {
      const t = Math.round(e.nMesh), a = e.Lx, n = e.Ly, r = e.H, i = a / t, s = n / t, c = e.gamma_kNm3 / 9.81, m = [
        [
          0,
          0,
          0
        ],
        [
          a,
          0,
          0
        ],
        [
          a,
          n,
          0
        ],
        [
          0,
          n,
          0
        ]
      ], p = 4;
      for (let l = 0; l <= t; l++) for (let f = 0; f <= t; f++) m.push([
        f * i,
        l * s,
        r
      ]);
      const d = (l, f) => p + f * (t + 1) + l, u = [];
      for (let l = 0; l < t; l++) for (let f = 0; f < t; f++) u.push([
        d(f, l),
        d(f + 1, l),
        d(f + 1, l + 1),
        d(f, l + 1)
      ]);
      const h = u.length;
      u.push([
        0,
        d(0, 0)
      ]), u.push([
        1,
        d(t, 0)
      ]), u.push([
        2,
        d(t, t)
      ]), u.push([
        3,
        d(0, t)
      ]);
      const N = h, G = u.length, b = Math.round(e.vigaNudos ?? 1) === 0 ? 1 : t, M = t / b;
      for (let l = 0; l < b; l++) u.push([
        d(l * M, 0),
        d((l + 1) * M, 0)
      ]);
      for (let l = 0; l < b; l++) u.push([
        d(t, l * M),
        d(t, (l + 1) * M)
      ]);
      for (let l = 0; l < b; l++) u.push([
        d(l * M, t),
        d((l + 1) * M, t)
      ]);
      for (let l = 0; l < b; l++) u.push([
        d(0, l * M),
        d(0, (l + 1) * M)
      ]);
      const te = G, H = u.length, Y = /* @__PURE__ */ new Map(), oe = e.apoyo < 0.5;
      for (const l of [
        0,
        1,
        2,
        3
      ]) Y.set(l, oe ? [
        true,
        true,
        true,
        false,
        false,
        false
      ] : [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const xe = e.E_GPa * 1e6, at = xe / (2 * (1 + e.nu)), nt = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), Be = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), Ve = /* @__PURE__ */ new Map(), Ne = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map(), we = /* @__PURE__ */ new Map(), st = /* @__PURE__ */ new Map();
      for (let l = 0; l < h; l++) nt.set(l, e.tLosa), ye.set(l, xe), ve.set(l, e.nu), Me.set(l, c), st.set(l, 1);
      const it = e.bCol * e.hCol, Ct = e.bCol * Math.pow(e.hCol, 3) / 12, $t = e.hCol * Math.pow(e.bCol, 3) / 12, rt = (l, f) => {
        const k = Math.max(l, f), w = Math.min(l, f), $ = w / k;
        return 1 / 3 * (1 - 0.21 * $ * (1 - Math.pow($, 4) / 12)) * k * Math.pow(w, 3);
      }, At = rt(e.bCol, e.hCol), lt = e.rigidOffsets > 0.5 ? e.hViga / 2 / r : 0;
      for (let l = N; l < G; l++) ye.set(l, xe), ve.set(l, e.nu), Ne.set(l, at), Ie.set(l, it), Be.set(l, $t), Fe.set(l, Ct), Ve.set(l, At), Me.set(l, c), qe.set(l, {
        type: "rect",
        b: e.bCol,
        h: e.hCol
      }), lt > 0 && we.set(l, [
        0,
        lt
      ]);
      const ct = e.bViga * e.hViga, Lt = e.bViga * Math.pow(e.hViga, 3) / 12, zt = e.hViga * Math.pow(e.bViga, 3) / 12, Pt = rt(e.bViga, e.hViga) * (e.factorJ ?? 1), dt = a / b, Oe = e.rigidOffsets > 0.5 ? e.bCol / 2 / dt : 0;
      let z = te;
      for (let l = 0; l < 4; l++) for (let f = 0; f < b; f++) {
        if (ye.set(z, xe), ve.set(z, e.nu), Ne.set(z, at), Ie.set(z, ct), Be.set(z, zt), Fe.set(z, Lt), Ve.set(z, Pt), Me.set(z, c), qe.set(z, {
          type: "rect",
          b: e.bViga,
          h: e.hViga
        }), Oe > 0) {
          const k = f === 0 ? Oe : 0, w = f === b - 1 ? Oe : 0;
          k + w > 0 && we.set(z, [
            k,
            w
          ]);
        }
        z++;
      }
      o.nodes.val = m, o.elements.val = u, o.elementInputs.val = {
        elasticities: ye,
        poissonsRatios: ve,
        shearModuli: Ne,
        areas: Ie,
        momentsOfInertiaY: Be,
        momentsOfInertiaZ: Fe,
        torsionalConstants: Ve,
        thicknesses: nt,
        densities: Me,
        sectionShapes: qe,
        rigidOffsets: we.size > 0 ? we : void 0,
        plateFormulations: st
      }, o._mesaTorsionIdx = {
        beamStart: te,
        beamEnd: H,
        RHO: c,
        topCorners: [
          d(0, 0),
          d(t, 0),
          d(t, t),
          d(0, t)
        ]
      };
      function ut(l, f, k) {
        const w = /* @__PURE__ */ new Map(), $ = (T, P) => {
          const I = w.get(T) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          w.set(T, [
            I[0],
            I[1],
            I[2] + P,
            I[3],
            I[4],
            I[5]
          ]);
        };
        if (l !== 0) {
          for (let A = 0; A < t; A++) for (let C = 0; C < t; C++) {
            const Je = -(e.tLosa * i * s * e.gamma_kNm3 * l) / 4;
            for (const Se of [
              d(C, A),
              d(C + 1, A),
              d(C + 1, A + 1),
              d(C, A + 1)
            ]) $(Se, Je);
          }
          const T = it * r * e.gamma_kNm3 * l, P = [
            [
              0,
              d(0, 0)
            ],
            [
              1,
              d(t, 0)
            ],
            [
              2,
              d(t, t)
            ],
            [
              3,
              d(0, t)
            ]
          ];
          for (const [A, C] of P) $(A, -T / 2), $(C, -T / 2);
          let I = te;
          for (let A = 0; A < 4; A++) for (let C = 0; C < b; C++) {
            const [Te, Je] = u[I], Se = ct * dt * e.gamma_kNm3 * l;
            $(Te, -Se / 2), $(Je, -Se / 2), I++;
          }
        }
        const Z = (f + k) * ae;
        if (Z !== 0) for (let T = 0; T <= t; T++) for (let P = 0; P <= t; P++) {
          const C = (P === 0 || P === t) && (T === 0 || T === t) ? 0.25 : P === 0 || P === t || T === 0 || T === t ? 0.5 : 1, Te = -Z * i * s * C;
          $(d(P, T), Te);
        }
        return w;
      }
      const ue = [
        {
          name: "Dead",
          sw: 1,
          scp: 0,
          live: 0
        },
        {
          name: "Live",
          sw: 0,
          scp: 0,
          live: e.q_Live
        },
        {
          name: "SCP",
          sw: 0,
          scp: e.q_SCP,
          live: 0
        },
        {
          name: "UDCon1",
          sw: 1.4,
          scp: 1.4 * e.q_SCP,
          live: 0
        },
        {
          name: "UDCon2",
          sw: 1.2,
          scp: 1.2 * e.q_SCP,
          live: 1.6 * e.q_Live
        }
      ], Re = {}, je = {};
      for (const l of ue) {
        const f = ut(l.sw, l.scp, l.live);
        try {
          const k = Bt(m, u, {
            supports: Y,
            loads: f
          }, o.elementInputs.val), w = Dt(m, u, o.elementInputs.val, k);
          Re[l.name] = {
            deform: k,
            analyze: w
          }, je[l.name] = io(w, N, H);
        } catch (k) {
          console.warn(`[Mesa torsi\xF3n] caso ${l.name} fall\xF3:`, k.message);
        }
      }
      o._mesaTorsionCases = je, o._mesaTorsionAllResults = Re;
      const me = [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ][Math.round(e.activeCase)] || "UDCon2", Xe = Re[me];
      Xe && (o.deformOutputs.val = Xe.deform, o.analyzeOutputs.val = Xe.analyze), o.nodeInputs.val = {
        supports: Y,
        loads: ut(ue.find((l) => l.name === me).sw, ue.find((l) => l.name === me).scp, ue.find((l) => l.name === me).live)
      };
      const W = [];
      W.push(`[Mesa torsi\xF3n] Caso visualizado: ${me}`), W.push(`  Discretizaci\xF3n: ${h} shells losa, 4 cols, ${H - te} segs viga`), W.push(`  Rigid offsets: ${e.rigidOffsets > 0.5 ? `ON (col top -${(e.hViga / 2).toFixed(2)}m, viga ends -${(e.bCol / 2).toFixed(2)}m)` : "OFF"}`), W.push(""), W.push("  Picks por caso \u2014 Hekatan vs ETABS (\u0394% relativo, sin remapear componentes):"), W.push(`  ${"Case".padEnd(8)} ${"Comp".padEnd(4)} ${"Hekatan".padStart(10)} ${"ETABS".padStart(10)} ${"\u0394%".padStart(8)}`);
      for (const l of ue) {
        const f = je[l.name], k = yt[l.name];
        if (!(!f || !k)) for (const w of [
          "P",
          "V2",
          "V3",
          "T",
          "M2",
          "M3"
        ]) {
          const $ = f[w], Z = k[w], T = Z !== 0 ? ($ - Z) / Z * 100 : 0;
          W.push(`  ${l.name.padEnd(8)} ${w.padEnd(4)} ${$.toFixed(3).padStart(10)} ${Z.toFixed(3).padStart(10)} ${(T >= 0 ? "+" : "") + T.toFixed(1).padStart(7)}%`);
        }
      }
      console.log(W.join(`
`)), o.objects3D.val = [], eo("mesa-torsion", "Tutor \xB7 Mesa de torsi\xF3n: T_u, malla y fisuraci\xF3n", so);
    },
    runModal(e, o, t) {
      if (!o.nodes.val.length) return;
      const a = Math.round(e.nModos);
      try {
        let n = o.nodeInputs.val, r = o.elementInputs.val, i = 0, s = 0;
        const c = o._mesaTorsionIdx;
        if (Math.round(e.masaModal ?? 0) === 0 && c) {
          const d = new Map(r.densities);
          for (let b = c.beamStart; b < c.beamEnd; b++) d.set(b, 0);
          const u = e.rigidOffsets > 0.5 ? e.bCol : 0, h = (b) => c.RHO * e.bViga * e.hViga * (b - u) / 2, N = h(e.Lx) + h(e.Ly), G = new Map(n.masses ?? []);
          for (const b of c.topCorners) G.set(b, (G.get(b) ?? 0) + N);
          r = {
            ...r,
            densities: d
          }, n = {
            ...n,
            masses: G
          }, i = 1, s = 1;
        }
        const m = It(o.nodes.val, o.elements.val, n, r, a, i, s);
        o._mesaTorsionModal = {
          nodeInputs: n,
          elementInputs: r,
          lateral: i,
          lump: s,
          out: m
        };
        const p = [];
        p.push(`[Mesa torsi\xF3n Modal Hekatan FEM 3D] ${a} modos:`);
        for (let d = 0; d < Math.min(a, 6); d++) {
          const u = 1 / m.frequencies[d];
          p.push(`  Modo ${d + 1}: T = ${u.toFixed(4)} s   f = ${m.frequencies[d].toFixed(3)} Hz`);
        }
        p.push(""), p.push("ETABS 19.1 reference:"), p.push(`  Modo 1 T\u2081 Ux = ${O[0].toFixed(4)} s`), p.push(`  Modo 2 T\u2082 Uy = ${O[1].toFixed(4)} s`), p.push(`  Modo 3 T\u2083 Rz = ${O[2].toFixed(4)} s`), console.log(p.join(`
`)), (t == null ? void 0 : t.render) && t.render(m, {
          title: `Mesa de Torsi\xF3n \u2014 ${e.Lx}\xD7${e.Ly}m, ${e.H}m alto`,
          properties: [
            `${e.apoyo < 0.5 ? "Pinned base" : "Empotrado"}  E=${e.E_GPa} GPa  \u03BD=${e.nu}`,
            `ETABS ref: T\u2081=${O[0]}s  T\u2082=${O[1]}s  T\u2083=${O[2]}s`
          ]
        });
      } catch (n) {
        console.error("[Mesa torsi\xF3n Modal] error:", n.message);
      }
    }
  };
  function io(e, o, t) {
    const a = (n) => {
      if (!n) return 0;
      let r = 0;
      for (let i = o; i < t; i++) {
        const s = n.get(i);
        s && (r = Math.max(r, Math.abs(s[0]), Math.abs(s[1])));
      }
      return r;
    };
    return {
      P: a(e.normals) / ae,
      V2: a(e.shearsY) / ae,
      V3: a(e.shearsZ) / ae,
      T: a(e.torsions) / ae,
      M2: a(e.bendingsY) / ae,
      M3: a(e.bendingsZ) / ae
    };
  }
});
export {
  __tla,
  eo as a,
  uo as b,
  fo as m,
  po as n,
  qt as r,
  mo as v
};
