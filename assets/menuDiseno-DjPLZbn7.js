const m = { analisis: [{ id: "estatico", orden: 1, icono: "\u25B6", titulo: "Analizar (est\xE1tico)", detalle: "Resuelve el modelo con el caso o la combinaci\xF3n elegida en \xABResultados\xBB.", abrir: () => {
  var _a;
  return (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
} }, { id: "modal", orden: 2, icono: "\u3030", titulo: "Modal + animar", detalle: "Periodos, modos y participaci\xF3n de masa; anima el modo elegido.", abrir: () => {
  var _a;
  return (_a = window.__hekatanRunModalAnimate) == null ? void 0 : _a.call(window);
} }, { id: "parar", orden: 3, icono: "\u25A0", titulo: "Parar animaci\xF3n", detalle: "Detiene la animaci\xF3n del modo.", abrir: () => {
  var _a;
  return (_a = window.__hekatanModalStop) == null ? void 0 : _a.call(window);
} }], diseno: [] }, h = { analisis: "\u25B6 An\xE1lisis", diseno: "\u{1F4D0} Dise\xF1o" }, f = { analisis: "An\xE1lisis \u2014 elige qu\xE9 calcular:", diseno: "Dise\xF1o \u2014 elige qu\xE9 hacer:" };
function y(e) {
  const s = m.diseno;
  s.some((d) => d.id === e.id) || (s.push(e), s.sort((d, n) => d.orden - n.orden)), b();
}
let u = null;
function b() {
  if (document.getElementById("hk-menus")) return;
  const e = document.getElementById("hk-cad-tit"), s = e == null ? void 0 : e.querySelector(".doc");
  if (!e || !s) {
    setTimeout(b, 400);
    return;
  }
  const d = document.createElement("style");
  d.textContent = "#hk-cad-tit button{white-space:nowrap}@media (max-width:1100px){#hk-cad-tit .marca{display:none}}@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}", document.head.appendChild(d);
  const n = document.createElement("span");
  n.id = "hk-menus", n.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px", s.after(n);
  const l = (o) => {
    const i = document.getElementById(o);
    if (!i) return false;
    const p = i.style.display !== "none";
    return i.removeAttribute("style"), i.className = "piel", p || (i.style.display = "none"), n.appendChild(i), true;
  }, a = () => {
    const o = l("hk-home-btn"), i = l("hk-back-btn");
    !o || !i ? setTimeout(a, 400) : c();
  }, c = () => {
    for (const o of ["analisis", "diseno"]) {
      const i = document.createElement("button");
      i.id = `hk-${o}-btn`, i.className = "piel", i.textContent = h[o] + " \u25BE", i.onclick = (p) => {
        p.stopPropagation(), g(o, i);
      }, n.appendChild(i);
    }
  };
  a();
  const t = window, r = t.__hekatanActualizarBotonVolver;
  t.__hekatanActualizarBotonVolver = (o) => {
    r == null ? void 0 : r(o);
    const i = document.getElementById("hk-back-btn");
    i && (i.style.display = o ? "" : "none");
  }, document.addEventListener("click", (o) => {
    u && !u.contains(o.target) && x();
  });
}
function x() {
  u == null ? void 0 : u.remove(), u = null;
}
function g(e, s) {
  const d = (u == null ? void 0 : u.dataset.menu) === e;
  if (x(), d) return;
  const n = document.createElement("div");
  n.dataset.menu = e, n.id = `hk-${e}-menu`, n.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)", n.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${f[e]}</div>` + m[e].map((a) => `<div data-id="${a.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${a.icono} ${a.titulo}</b><div style="opacity:.75;margin-top:2px">${a.detalle}</div></div>`).join(""), n.querySelectorAll("[data-id]").forEach((a) => {
    a.onmouseenter = () => a.style.background = "#1f3b5a", a.onmouseleave = () => a.style.background = "", a.onclick = () => {
      var _a;
      x(), (_a = m[e].find((c) => c.id === a.dataset.id)) == null ? void 0 : _a.abrir();
    };
  }), document.body.appendChild(n);
  const l = s.getBoundingClientRect();
  n.style.top = l.bottom + 4 + "px", n.style.left = Math.max(8, Math.min(l.left, innerWidth - 370)) + "px", u = n;
}
function v(e) {
  let s = false, d = 0, n = 0;
  const l = (t) => {
    const r = e.firstElementChild;
    return !!r && r.contains(t);
  }, a = () => {
    const t = e.dataset.plegado !== "1";
    e.dataset.plegado = t ? "1" : "0", [...e.children].slice(1).forEach((r) => r.style.display = t ? "none" : ""), e.style.overflow = t ? "hidden" : "auto";
  };
  e.addEventListener("pointerdown", (t) => {
    if (!l(t.target)) return;
    const r = t.target;
    if (r.closest("[data-plegar]")) {
      a();
      return;
    }
    if (r.closest("button,select,input,[id$='-x']")) return;
    const o = e.getBoundingClientRect();
    s = true, d = t.clientX - o.left, n = t.clientY - o.top, e.setPointerCapture(t.pointerId), t.preventDefault();
  }), e.addEventListener("pointermove", (t) => {
    s && (e.style.left = Math.min(Math.max(0, t.clientX - d), innerWidth - 80) + "px", e.style.top = Math.min(Math.max(30, t.clientY - n), innerHeight - 30) + "px", e.style.right = "auto");
  }), e.addEventListener("pointerup", () => {
    s = false;
  }), e.addEventListener("dblclick", (t) => {
    l(t.target) && !t.target.closest("[data-plegar]") && a();
  });
  const c = () => {
    const t = e.firstElementChild;
    if (!t || t.dataset.barra === "1") return;
    t.dataset.barra = "1", t.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", t.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
    const r = t.querySelector("b");
    r && !r.textContent.startsWith("\u283F") && (r.textContent = "\u283F " + r.textContent);
  };
  c(), new MutationObserver(c).observe(e, { childList: true });
}
export {
  y as r,
  v
};
