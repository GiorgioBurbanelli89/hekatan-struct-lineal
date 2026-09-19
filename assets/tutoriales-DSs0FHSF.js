const E = "https://giorgioburbanelli89.github.io/hekatan-lisp/", v = "hk_tutorial_ultimo", c = () => "/hekatan-struct-lineal/tutoriales/", a = (o) => o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"), A = `
#hk-tut{ position:fixed; inset:0; z-index:2147483000; display:flex; align-items:center; justify-content:center;
  background:rgba(8,10,14,.62); font:13px/1.45 "Segoe UI",system-ui,sans-serif; }
#hk-tut .caja{ width:min(1180px,96vw); height:min(720px,92vh); display:flex; flex-direction:column;
  background:var(--hk-panel,#232936); color:var(--hk-texto,#C8D4E4); border:1px solid var(--hk-borde,#39445A);
  border-radius:8px; box-shadow:0 18px 60px rgba(0,0,0,.6); overflow:hidden; }
#hk-tut header{ display:flex; align-items:center; gap:10px; padding:9px 14px; background:var(--hk-chrome,#1B1F26);
  border-bottom:1px solid var(--hk-borde,#39445A); }
#hk-tut header b{ font-size:14px; }
#hk-tut header span{ color:var(--hk-suave,#8C9AAE); }
#hk-tut header button{ margin-left:auto; border:0; background:transparent; color:inherit; font-size:18px; cursor:pointer;
  width:28px; height:28px; border-radius:4px; }
#hk-tut header button:hover{ background:var(--hk-hover,#2E3646); }
#hk-tut .cuerpo{ flex:1; min-height:0; display:flex; }
#hk-tut .lista{ width:310px; flex:none; overflow-y:auto; border-right:1px solid var(--hk-borde,#39445A); padding:8px; }
#hk-tut .grupo{ margin:4px 4px 8px; }
#hk-tut .grupo h4{ margin:6px 0 1px; font-size:13px; color:var(--hk-marca,#D3A53C); }
#hk-tut .grupo small{ color:var(--hk-suave,#8C9AAE); }
#hk-tut .it{ display:flex; gap:9px; align-items:center; width:100%; text-align:left; margin:5px 0; padding:5px;
  border:1px solid transparent; border-radius:6px; background:transparent; color:inherit; cursor:pointer; font:inherit; }
#hk-tut .it:hover{ background:var(--hk-hover,#2E3646); }
#hk-tut .it.on{ border-color:var(--hk-foco,#7F96B3); background:var(--hk-panel2,#2E3646); }
#hk-tut .it img{ width:88px; height:50px; object-fit:cover; border-radius:4px; flex:none; background:#000; }
#hk-tut .it .n{ color:var(--hk-suave,#8C9AAE); font-size:11px; }
#hk-tut .hojas{ margin:8px 4px 2px; padding-top:7px; border-top:1px dashed var(--hk-borde,#39445A); }
#hk-tut .hojas a{ display:block; color:var(--hk-foco,#7F96B3); text-decoration:none; margin:3px 0; }
#hk-tut .hojas a:hover{ text-decoration:underline; }
#hk-tut .visor{ flex:1; min-width:0; display:flex; flex-direction:column; padding:12px; gap:9px; }
#hk-tut video{ width:100%; flex:1; min-height:0; background:#000; border-radius:6px; }
#hk-tut .pie{ display:flex; gap:10px; align-items:flex-start; }
#hk-tut .pie p{ margin:0; flex:1; color:var(--hk-suave,#8C9AAE); }
#hk-tut .pie button{ flex:none; border:1px solid var(--hk-borde,#39445A); background:var(--hk-panel2,#2E3646);
  color:inherit; border-radius:4px; padding:5px 12px; cursor:pointer; font:inherit; }
#hk-tut .pie button:hover{ border-color:var(--hk-foco,#7F96B3); }
#hk-tut .pie button:disabled{ opacity:.4; cursor:default; }
@media (max-width:760px){ #hk-tut .cuerpo{ flex-direction:column-reverse; } #hk-tut .lista{ width:auto; max-height:40%;
  border-right:0; border-top:1px solid var(--hk-borde,#39445A); } }
`;
let h = false;
async function j() {
  if (h) return;
  if (h = true, !document.getElementById("hk-tut-hoja")) {
    const t = document.createElement("style");
    t.id = "hk-tut-hoja", t.textContent = A, document.head.appendChild(t);
  }
  const o = document.createElement("div");
  o.id = "hk-tut", o.innerHTML = '<div class="caja" role="dialog" aria-label="Tutoriales"><header><b>\u{1F3AC} Tutoriales</b><span>clips cortos: c\xF3mo se hace, con el mouse</span><button title="Cerrar (Esc)" id="hk-tut-x">\u2715</button></header><div class="cuerpo"><div class="lista">Cargando\u2026</div><div class="visor"><video controls playsinline preload="none"></video><div class="pie"><p></p><button id="hk-tut-ant">\u25C0 Anterior</button><button id="hk-tut-sig">Siguiente \u25B6</button></div></div></div></div>', document.body.appendChild(o);
  const u = () => {
    h = false, window.removeEventListener("keydown", x, true), o.remove();
  }, x = (t) => {
    t.key === "Escape" && (t.stopPropagation(), t.preventDefault(), u());
  };
  window.addEventListener("keydown", x, true), o.addEventListener("pointerdown", (t) => {
    t.target === o && u();
  }), o.querySelector("#hk-tut-x").onclick = u;
  const i = o.querySelector(".lista"), d = o.querySelector("video"), f = o.querySelector(".pie p"), k = o.querySelector("#hk-tut-ant"), g = o.querySelector("#hk-tut-sig");
  let p = [];
  try {
    const t = await fetch(c() + "index.json");
    if (!t.ok) throw new Error(String(t.status));
    p = (await t.json()).grupos ?? [];
  } catch (t) {
    i.textContent = "No se pudo cargar la lista de tutoriales (" + ((t == null ? void 0 : t.message) ?? t) + ").";
    return;
  }
  const n = p.flatMap((t) => t.items);
  let s = -1;
  const l = (t, e) => {
    var _a;
    if (t < 0 || t >= n.length) return;
    s = t;
    const r = n[t];
    d.poster = r.poster ? c() + r.poster : "", d.src = c() + r.video, f.textContent = r.texto ?? "", k.disabled = t === 0, g.disabled = t === n.length - 1, i.querySelectorAll(".it").forEach((y, w) => y.classList.toggle("on", w === t)), (_a = i.querySelectorAll(".it")[t]) == null ? void 0 : _a.scrollIntoView({ block: "nearest" });
    try {
      localStorage.setItem(v, r.video);
    } catch {
    }
    e && d.play().catch(() => {
    });
  };
  let m = 0;
  i.innerHTML = p.map((t) => {
    var _a;
    return '<div class="grupo"><h4>' + a(t.titulo) + "</h4>" + (t.sub ? "<small>" + a(t.sub) + "</small>" : "") + t.items.map((e) => '<button class="it" data-k="' + m++ + '">' + (e.poster ? '<img loading="lazy" alt="" src="' + a(c() + e.poster) + '">' : "") + "<span>" + a(e.titulo) + (e.seg ? '<br><span class="n">' + e.seg + " s</span>" : "") + "</span></button>").join("") + (((_a = t.hojas) == null ? void 0 : _a.length) ? '<div class="hojas"><small>\u{1F4D0} El porqu\xE9, en Hekatan LISP web:</small>' + t.hojas.map((e) => {
      const r = new URLSearchParams();
      return e.ej ? r.set("ej", e.ej) : e.h && r.set("h", e.h), r.set("solo", "1"), '<a target="_blank" rel="noopener" href="' + a(E + "#" + r.toString()) + '">' + a(e.titulo) + " \u2197</a>";
    }).join("") + "</div>" : "") + "</div>";
  }).join(""), i.querySelectorAll(".it").forEach((t) => {
    t.onclick = () => l(+t.dataset.k, true);
  }), k.onclick = () => l(s - 1, true), g.onclick = () => l(s + 1, true), d.addEventListener("ended", () => {
    s + 1 < n.length && l(s + 1, true);
  });
  let b = 0;
  try {
    const t = localStorage.getItem(v), e = n.findIndex((r) => r.video === t);
    e >= 0 && (b = e);
  } catch {
  }
  l(b, false);
}
window.__hekatanTutoriales = j;
export {
  j as abrirTutoriales
};
