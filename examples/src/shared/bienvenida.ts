/**
 * bienvenida.ts — «el mesero recibe a la gente y SIEMPRE le pregunta qué quiere».
 *
 * Jorge (19-sep-2026, captura del inicio a 1920×1080): al abrir salían A LA VEZ la guía
 * «Cómo usar · cuatro pasos» (tapando el panel izquierdo), el aviso «Hay un dibujo
 * guardado», el 🤖, la cinta y la barra de comandos — «la ventana está colapsando todo».
 *
 * Ahora al entrar sale UNA pantalla, centrada, que pregunta qué se quiere hacer:
 *   🤖 Con IA · 🧭 Guiado paso a paso · 🔎 ¿Qué buscas? · 👋 Ya te llamo, lo hago yo
 * y, si hay un dibujo guardado, «📂 Recuperar mi dibujo» DENTRO de ella. Tras elegir no
 * queda nada tapando los paneles; queda solo el botón pequeño «🙋» en la esquina (ocupa
 * el sitio del 🤖, con su mismo id, así la piel de 0e lo coloca sin solapes).
 *
 * Sale SIEMPRE (también con ?t= / ?m= / ?heks=: «Abriste: <ejemplo>. ¿Qué quieres hacer?»).
 * Se salta con `&sinBienvenida=1`, y en navegadores automatizados (sondas, grabaciones)
 * salvo que se pida con `&bienvenida=1`.
 */
import { buscar, idioma, abrirCinta, plegarPaneles, Destino } from "./destinos";

const W = () => window as any;
const P = new URLSearchParams(location.search);
const FORZAR = P.get("bienvenida") === "1";
const SALTAR = P.get("sinBienvenida") === "1" || (!FORZAR && !!(navigator as any).webdriver);
// «Abriste: …» solo cuando se llega a un modelo concreto (el lienzo en blanco es la entrada normal)
const POR_ENLACE = (P.has("t") && P.get("t") !== "new-blank") || P.has("m") || P.has("heks") || /#h=/.test(location.hash);

// Mientras exista este módulo, la guía «Cómo usar» y el aviso de recuperar NO salen solos.
if (!SALTAR) W().__hekatanConBienvenida = true;
// la ayuda suelta de móvil la reemplaza esta pantalla (también cuando se salta: sondas y grabaciones)
document.documentElement.classList.add("hk-con-bienvenida");

type T2 = [string, string];
const TX: Record<string, T2> = {
  hola: ["Bienvenido a Hekatan Struct", "Welcome to Hekatan Struct"],
  que: ["¿Qué quieres hacer?", "What would you like to do?"],
  abriste: ["Abriste", "You opened"],
  ia: ["🤖 Con IA", "🤖 With AI"],
  iaD: ["Pídele una estructura o una duda: la modela y explica.", "Ask for a structure or a question: it models and explains."],
  gui: ["🧭 Guiado paso a paso", "🧭 Step-by-step guide"],
  guiD: ["Te señala cada botón de la cinta, en orden.", "Points at each ribbon button, in order."],
  guiE: ["🧭 Guíame por este modelo", "🧭 Guide me through this model"],
  bus: ["🔎 ¿Qué buscas?", "🔎 What are you looking for?"],
  busD: ["Escribe adónde quieres ir y te llevo (Ctrl+K).", "Type where you want to go and I take you (Ctrl+K)."],
  man: ["👋 Ya te llamo, lo hago yo", "👋 I'll call you, I'll do it myself"],
  manD: ["Pantalla limpia, solo la cinta.", "Clean screen, just the ribbon."],
  manE: ["👋 Explorar solo", "👋 Explore on my own"],
  rec: ["📂 Recuperar mi dibujo", "📂 Recover my drawing"],
  nudos: ["nudos", "nodes"],
  blanco: ["Empezar en blanco", "Start blank"],
  adios: ["Listo, aquí estoy si me necesitas → 🙋", "Done, I'm here if you need me → 🙋"],
  ayudo: ["¿Te ayudo?", "Can I help?"],
  cerrar: ["Cerrar (Esc) = Ya te llamo", "Close (Esc) = I'll call you"],
  buscaPh: ["herramienta, ejemplo, panel… (p. ej. «apoyo», «cercha», «momento»)", "tool, example, panel… (e.g. «support», «truss», «moment»)"],
  nada: ["Nada con eso. Prueba otra palabra.", "Nothing found. Try another word."],
  guia: ["Guía: cuatro pasos. Pasa el ratón por un botón de la cinta y te dice cómo se usa.", "Guide: four steps. Hover a ribbon button and it tells you how to use it."],
};
const t = (k: string) => TX[k]?.[idioma() === "en" ? 1 : 0] ?? k;

const CSS = `
#hk-bienv-fondo{position:fixed;inset:0;z-index:2147480000;background:rgba(3,7,18,.62);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,sans-serif}
#hk-bienv{width:min(720px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#0b1220;border:1px solid #1e3a4a;border-radius:14px;box-shadow:0 18px 60px rgba(0,0,0,.6);color:#dbe7f3;padding:20px 22px 16px;box-sizing:border-box;position:relative}
#hk-bienv h1{margin:0 0 2px;font:700 22px system-ui,-apple-system,Segoe UI,sans-serif;color:#e8f1fb}
#hk-bienv .sub{color:#8fb0c6;font-size:14px;margin-bottom:14px}
#hk-bienv .tarjetas{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#hk-bienv .tj{display:flex;flex-direction:column;gap:4px;text-align:left;cursor:pointer;background:#0f1a2a;border:1px solid #23405a;border-radius:10px;padding:13px 14px;color:#dbe7f3;font:inherit}
#hk-bienv .tj:hover,#hk-bienv .tj:focus{border-color:#7f96b3;background:#132238;outline:none}
#hk-bienv .tj b{font-size:15px;color:#e8f1fb}
#hk-bienv .tj span{font-size:12px;color:#8fb0c6;line-height:1.35}
#hk-bienv .rec{display:flex;align-items:center;gap:10px;margin-top:12px;padding:9px 12px;border:1px solid #23405a;border-radius:9px;background:#0f1a2a;font-size:13px;flex-wrap:wrap}
#hk-bienv .rec button,#hk-bienv .pie button{cursor:pointer;border-radius:6px;font:600 12px inherit;padding:5px 11px}
#hk-bienv .rec .si{background:#1f3b5a;color:#e8f1fb;border:1px solid #7f96b3}
#hk-bienv .rec .no{background:transparent;color:#8fb0c6;border:1px solid #23405a}
#hk-bienv .pie{display:flex;justify-content:flex-end;gap:6px;margin-top:12px;font-size:12px;color:#8fb0c6;align-items:center}
#hk-bienv .pie button{background:transparent;color:#8fb0c6;border:1px solid #23405a}
#hk-bienv .pie button.on{color:#e8f1fb;border-color:#7f96b3}
#hk-bienv .x{position:absolute;top:10px;right:10px;width:28px;height:28px;border-radius:50%;border:1px solid #23405a;background:transparent;color:#8fb0c6;cursor:pointer;font:600 14px inherit}
@media (max-width:560px){#hk-bienv .tarjetas{grid-template-columns:1fr}#hk-bienv{padding:16px}#hk-bienv h1{font-size:19px}}
#hk-busca{position:fixed;left:50%;top:22vh;transform:translateX(-50%);width:min(560px,calc(100vw - 24px));z-index:2147480001;background:#0b1220;border:1px solid #7f96b3;border-radius:12px;box-shadow:0 16px 50px rgba(0,0,0,.6);font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#dbe7f3;overflow:hidden}
#hk-busca input{width:100%;box-sizing:border-box;padding:12px 14px;border:0;border-bottom:1px solid #23405a;background:#0f1a2a;color:#e8f1fb;font:15px inherit;outline:none}
#hk-busca .lista{max-height:min(360px,60vh);overflow:auto}
#hk-busca .it{display:flex;gap:10px;align-items:baseline;padding:8px 14px;cursor:pointer;font-size:13px}
#hk-busca .it.on,#hk-busca .it:hover{background:#132238}
#hk-busca .it small{color:#7f96b3;min-width:78px;font-size:11px}
#hk-busca .pie{display:flex;justify-content:space-between;padding:6px 12px;font-size:11px;color:#7f96b3;border-top:1px solid #23405a}
#hk-busca .pie button{cursor:pointer;background:transparent;border:1px solid #23405a;color:#8fb0c6;border-radius:6px;font:600 11px inherit;padding:3px 9px}
#hk-bienv-toast{position:fixed;right:70px;bottom:104px;z-index:2147480000;background:#0b1220;border:1px solid #7f96b3;color:#dbe7f3;border-radius:9px;padding:7px 12px;font:13px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.5);transition:opacity .4s}
@media (max-width:560px){#hk-bienv-toast{right:12px;left:12px;bottom:150px}}
/* la ayuda de móvil «Bienvenido a Hekatan» era OTRA bienvenida encima de esta: la reemplaza */
html.hk-con-bienvenida #hk-mobile-help{display:none !important}
`;

let recuperar: { n: number; si: () => void; no: () => void } | null = null;

const estilo = () => {
  if (document.getElementById("hk-bienv-css")) return;
  const s = document.createElement("style"); s.id = "hk-bienv-css"; s.textContent = CSS; document.head.appendChild(s);
};
const cerrarModal = () => document.getElementById("hk-bienv-fondo")?.remove();
const toast = (txt: string, ms = 3500) => {
  document.getElementById("hk-bienv-toast")?.remove();
  const d = document.createElement("div"); d.id = "hk-bienv-toast"; d.textContent = txt;
  document.body.appendChild(d);
  setTimeout(() => { d.style.opacity = "0"; setTimeout(() => d.remove(), 450); }, ms);
};
const nombreEjemplo = (): string => {
  const id = W().__hekatanExample?.() ?? P.get("t");
  const e = ((W().__hekatanExamples ?? []) as Array<{ id: string; name: string }>).find((x) => x.id === id);
  if (e) return e.name;
  if (P.has("heks")) { try { return decodeURIComponent((P.get("heks") || "").split("/").pop() || "modelo"); } catch { return "modelo"; } }
  return id || "modelo";
};

// ── las cuatro opciones ─────────────────────────────────────────────────────
export function yaTeLlamo(conAdios = true) {
  cerrarModal(); cerrarBuscador(); try { W().__hekatanRibbon?.guia?.(false); } catch {}
  plegarPaneles(); abrirCinta();
  if (conAdios) toast(t("adios"));
}
export function conIA() {
  cerrarModal(); plegarPaneles();
  try { W().__hekatanAgenteIA?.(idioma() === "en" ? "" : ""); } catch {}
}
export function guiado() {
  cerrarModal(); plegarPaneles(); abrirCinta();
  try { W().__hekatanRibbon?.pestana?.("dibujo"); W().__hekatanRibbon?.guia?.(true); } catch {}
  toast(t("guia"), 5000);
}

// ── 🔎 el buscador (semimanual): Ctrl+K o / en cualquier momento ─────────────
function cerrarBuscador() { document.getElementById("hk-busca")?.remove(); }
export function buscador() {
  estilo(); cerrarModal(); cerrarBuscador(); plegarPaneles();
  const caja = document.createElement("div"); caja.id = "hk-busca";
  const inp = document.createElement("input"); inp.type = "text"; inp.placeholder = t("buscaPh");
  const lista = document.createElement("div"); lista.className = "lista";
  const pie = document.createElement("div"); pie.className = "pie";
  const llamo = document.createElement("button"); llamo.textContent = t("man"); llamo.onclick = () => yaTeLlamo();
  pie.innerHTML = `<span>↑ ↓ · Enter · Esc</span>`; pie.appendChild(llamo);
  caja.append(inp, lista, pie);
  document.body.appendChild(caja);
  let res: Destino[] = []; let sel = 0;
  const TIPO: Record<string, T2> = { "pestaña": ["pestaña", "tab"], herramienta: ["herramienta", "tool"], panel: ["panel", "panel"], ejemplo: ["ejemplo", "example"], ayuda: ["ayuda", "help"] };
  const pintar = () => {
    res = buscar(inp.value, 14); sel = Math.min(sel, Math.max(0, res.length - 1));
    lista.innerHTML = "";
    if (!res.length) { const v = document.createElement("div"); v.className = "it"; v.textContent = t("nada"); lista.appendChild(v); return; }
    res.forEach((d, i) => {
      const it = document.createElement("div"); it.className = "it" + (i === sel ? " on" : "");
      it.innerHTML = `<small>${TIPO[d.tipo]?.[idioma() === "en" ? 1 : 0] ?? d.tipo}</small><span></span>`;
      (it.lastChild as HTMLElement).textContent = idioma() === "en" ? d.en : d.es;
      it.onclick = () => ir(d);
      lista.appendChild(it);
    });
  };
  const ir = (d: Destino) => {
    cerrarBuscador();
    let m: string | void = "";
    try { m = d.ir(); } catch (e) { m = String(e); }
    if (m) toast(String(m).slice(0, 140), 4000);
  };
  inp.addEventListener("input", () => { sel = 0; pintar(); });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(res.length - 1, sel + 1); pintar(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(0, sel - 1); pintar(); e.preventDefault(); }
    else if (e.key === "Enter") { if (res[sel]) ir(res[sel]); e.preventDefault(); }
    else if (e.key === "Escape") { cerrarBuscador(); e.preventDefault(); }
    e.stopPropagation();
  });
  pintar();
  setTimeout(() => inp.focus(), 0);
}

// ── la pantalla ─────────────────────────────────────────────────────────────
export function mostrarBienvenida() {
  estilo(); cerrarBuscador(); cerrarModal();
  try { W().__hekatanRibbon?.guia?.(false); } catch {}
  const fondo = document.createElement("div"); fondo.id = "hk-bienv-fondo";
  const m = document.createElement("div"); m.id = "hk-bienv"; m.setAttribute("role", "dialog");
  fondo.appendChild(m);
  const pintar = () => {
    const tit = POR_ENLACE ? `${t("abriste")}: ${nombreEjemplo()}` : t("hola");
    m.innerHTML = "";
    const x = document.createElement("button"); x.className = "x"; x.textContent = "✕"; x.title = t("cerrar"); x.onclick = () => yaTeLlamo();
    const h = document.createElement("h1"); h.textContent = tit;
    const sub = document.createElement("div"); sub.className = "sub"; sub.textContent = t("que");
    const tj = document.createElement("div"); tj.className = "tarjetas";
    const tarjeta = (k: string, d: string, fn: () => void, id: string) => {
      const b = document.createElement("button"); b.className = "tj"; b.id = id;
      b.innerHTML = `<b></b><span></span>`;
      (b.firstChild as HTMLElement).textContent = t(k); (b.lastChild as HTMLElement).textContent = t(d);
      b.onclick = fn; tj.appendChild(b); return b;
    };
    tarjeta(POR_ENLACE ? "guiE" : "gui", "guiD", guiado, "hk-bienv-guiado");
    tarjeta("bus", "busD", buscador, "hk-bienv-buscar");
    tarjeta("ia", "iaD", conIA, "hk-bienv-ia");
    tarjeta(POR_ENLACE ? "manE" : "man", "manD", () => yaTeLlamo(), "hk-bienv-manual");
    m.append(x, h, sub, tj);
    if (recuperar) {
      const r = document.createElement("div"); r.className = "rec";
      const s = document.createElement("span"); s.textContent = `${t("rec")} (${recuperar.n} ${t("nudos")})`;
      const si = document.createElement("button"); si.className = "si"; si.textContent = t("rec"); si.id = "hk-bienv-recuperar";
      const no = document.createElement("button"); no.className = "no"; no.textContent = t("blanco");
      const R = recuperar;
      si.onclick = () => { R.si(); recuperar = null; yaTeLlamo(false); setTimeout(() => { try { W().__hekatanEncuadrar?.(); } catch {} }, 400); };
      no.onclick = () => { R.no(); recuperar = null; pintar(); };
      r.append(s, si, no); m.appendChild(r);
    }
    const pie = document.createElement("div"); pie.className = "pie";
    for (const [l, lab] of [["es", "ES"], ["en", "EN"]] as const) {
      const b = document.createElement("button"); b.textContent = lab; if (idioma() === l) b.className = "on";
      b.onclick = () => { try { localStorage.setItem("hk_lang", l); } catch {} pintar(); };
      pie.appendChild(b);
    }
    m.appendChild(pie);
  };
  pintar();
  (m as any).__pintar = pintar;
  fondo.addEventListener("pointerdown", (e) => { if (e.target === fondo) yaTeLlamo(); });
  document.body.appendChild(fondo);
  setTimeout(() => (m.querySelector(".tj") as HTMLElement | null)?.focus(), 0);
}

// ── 🙋 «¿Te ayudo?»: ocupa el sitio del 🤖 (mismo id) y reabre la bienvenida ──
function montarAyudo() {
  if (document.getElementById("hk-agente-lanzador")) return;
  const b = document.createElement("button");
  b.id = "hk-agente-lanzador";             // el MISMO id: aiAgent ya no pone su 🤖 y la piel lo coloca
  b.textContent = "🙋";
  b.title = t("ayudo") + " (Ctrl+K: 🔎)";
  b.setAttribute("aria-label", t("ayudo"));
  b.style.cssText = ["position:fixed", "right:16px", "bottom:100px", "z-index:8999", "width:44px", "height:44px",
    "border-radius:50%", "border:1px solid #7f96b3", "background:#0b1220", "font-size:22px", "cursor:pointer",
    "box-shadow:0 4px 14px rgba(0,0,0,.4)"].join(";");
  b.onclick = () => mostrarBienvenida();
  document.body.appendChild(b);
}

/**
 * Gancho para `ofrecerRecuperar` (workspace/main.ts): si la bienvenida está, el dibujo
 * guardado se ofrece DENTRO de ella y no como aviso suelto. Devuelve true si lo tomó.
 */
function tomarRecuperar(n: number, si: () => void, no: () => void): boolean {
  if (SALTAR) return false;
  recuperar = { n, si, no };
  const m = document.getElementById("hk-bienv") as any;
  if (m?.__pintar) m.__pintar();
  return true;
}

if (typeof window !== "undefined") {
  { const st = document.createElement("style"); st.textContent = "html.hk-con-bienvenida #hk-mobile-help{display:none !important}"; document.head.appendChild(st); }
  W().__hekatanBienvenida = { mostrar: mostrarBienvenida, buscador, yaTeLlamo, guiado, conIA };
  W().__hekatanBienvenidaRecuperar = tomarRecuperar;
  // Ctrl+K o «/» abren el buscador en cualquier momento (no mientras se escribe en un campo)
  window.addEventListener("keydown", (e) => {
    const tg = e.target as HTMLElement | null;
    const enCampo = !!tg && (tg.tagName === "INPUT" || tg.tagName === "TEXTAREA" || tg.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); e.stopPropagation(); buscador(); return; }
    if (e.key === "/" && !enCampo) { e.preventDefault(); e.stopPropagation(); buscador(); return; }
    if (e.key === "Escape" && document.getElementById("hk-bienv-fondo")) { e.preventDefault(); yaTeLlamo(); }
  }, true);
  // PANTALLA ESTRECHA (< 900 px, móvil o tableta en vertical): los dos paneles abiertos se
  // montaban uno encima del otro y encima de la cinta (sonda de solapes a 390×844: 28
  // problemas). Arrancan PLEGADOS; se abren con su puerta cuando hacen falta.
  if (innerWidth < 900) {
    let k = 0;
    const plegarAlCargar = () => {
      if (document.getElementById("hk-settings-toggle") && document.getElementById("hk-pane-toggle")) setTimeout(plegarPaneles, 600);
      else if (k++ < 60) setTimeout(plegarAlCargar, 250);
    };
    plegarAlCargar();
  }
  if (!SALTAR) {
    const arrancar = () => {
      estilo(); montarAyudo();
      // se espera al visor (la bienvenida va encima de la app ya cargada, no de una página en blanco)
      let n = 0;
      const esperar = () => {
        if ((document.querySelector("#viewer") as any)?.__ctx || n++ > 40) mostrarBienvenida();
        else setTimeout(esperar, 250);
      };
      esperar();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
    else arrancar();
  }
}
