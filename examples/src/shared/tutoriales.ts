/**
 * tutoriales.ts — el panel «🎬 Tutorial» de la barra de arriba.
 *
 * Jorge (19-sep-2026): «dentro de Hekatan Struct, videos tutoriales cortos explicando
 * cómo usarlo… un botón en los menús de arriba que diga Tutorial».
 *
 * Clips de 10–30 s, uno por tarea (dibujar, apoyar, cargar, ver resultados, guardar), no
 * un video largo. Salen del MISMO material que los tutoriales grandes: el grabador deja
 * los tiempos de cada paso y el montaje se corta por ahí (`public/tutoriales/*.mp4`).
 *
 *   public/tutoriales/index.json   { grupos: [{ titulo, sub, hojas?, items: [{ titulo, video, poster, seg, texto }] }] }
 *
 * Nada se descarga hasta que se abre el panel (import dinámico + fetch del índice), y cada
 * video solo cuando se elige: la app no pesa un byte más al arrancar.
 *
 * `hojas` son enlaces a Hekatan LISP WEB (la pública, no la local): la cuenta a mano que
 * explica el porqué de lo que el clip enseña con el mouse. Esa web abre una hoja por
 * enlace: `#ej=<archivo de ejemplos/>` o `#h=<hoja comprimida>`.
 */
const LISP_WEB = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
const LS = "hk_tutorial_ultimo";

interface Item { titulo: string; video: string; poster?: string; seg?: number; texto?: string }
interface Hoja { titulo: string; ej?: string; h?: string }
interface Grupo { titulo: string; sub?: string; hojas?: Hoja[]; items: Item[] }

const base = () => ((import.meta as any).env?.BASE_URL ?? "./") + "tutoriales/";
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const HOJA = `
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

let abierto = false;

export async function abrirTutoriales(): Promise<void> {
  if (abierto) return;
  abierto = true;
  if (!document.getElementById("hk-tut-hoja")) {
    const st = document.createElement("style"); st.id = "hk-tut-hoja"; st.textContent = HOJA;
    document.head.appendChild(st);
  }
  const w = document.createElement("div");
  w.id = "hk-tut";
  w.innerHTML =
    '<div class="caja" role="dialog" aria-label="Tutoriales">' +
    "<header><b>🎬 Tutoriales</b><span>clips cortos: cómo se hace, con el mouse</span>" +
    '<button title="Cerrar (Esc)" id="hk-tut-x">✕</button></header>' +
    '<div class="cuerpo"><div class="lista">Cargando…</div>' +
    '<div class="visor"><video controls playsinline preload="none"></video>' +
    '<div class="pie"><p></p><button id="hk-tut-ant">◀ Anterior</button><button id="hk-tut-sig">Siguiente ▶</button></div></div></div>' +
    "</div>";
  document.body.appendChild(w);

  const cerrar = () => { abierto = false; window.removeEventListener("keydown", tecla, true); w.remove(); };
  // Esc cierra ESTO y no llega al CAD (que con Esc suelta la herramienta en curso)
  const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); e.preventDefault(); cerrar(); } };
  window.addEventListener("keydown", tecla, true);
  w.addEventListener("pointerdown", (e) => { if (e.target === w) cerrar(); });
  w.querySelector<HTMLButtonElement>("#hk-tut-x")!.onclick = cerrar;

  const lista = w.querySelector<HTMLDivElement>(".lista")!;
  const video = w.querySelector<HTMLVideoElement>("video")!;
  const texto = w.querySelector<HTMLParagraphElement>(".pie p")!;
  const bAnt = w.querySelector<HTMLButtonElement>("#hk-tut-ant")!;
  const bSig = w.querySelector<HTMLButtonElement>("#hk-tut-sig")!;

  let grupos: Grupo[] = [];
  try {
    const r = await fetch(base() + "index.json");
    if (!r.ok) throw new Error(String(r.status));
    grupos = (await r.json()).grupos ?? [];
  } catch (e: any) {
    lista.textContent = "No se pudo cargar la lista de tutoriales (" + (e?.message ?? e) + ").";
    return;
  }
  const plano: Item[] = grupos.flatMap((g) => g.items);
  let actual = -1;

  const poner = (k: number, reproducir: boolean) => {
    if (k < 0 || k >= plano.length) return;
    actual = k;
    const it = plano[k];
    video.poster = it.poster ? base() + it.poster : "";
    video.src = base() + it.video;
    texto.textContent = it.texto ?? "";
    bAnt.disabled = k === 0; bSig.disabled = k === plano.length - 1;
    lista.querySelectorAll(".it").forEach((b, i) => b.classList.toggle("on", i === k));
    lista.querySelectorAll(".it")[k]?.scrollIntoView({ block: "nearest" });
    try { localStorage.setItem(LS, it.video); } catch {}
    if (reproducir) video.play().catch(() => {});
  };

  let n = 0;
  lista.innerHTML = grupos.map((g) =>
    '<div class="grupo"><h4>' + esc(g.titulo) + "</h4>" + (g.sub ? "<small>" + esc(g.sub) + "</small>" : "") +
    g.items.map((it) => {
      const k = n++;
      return '<button class="it" data-k="' + k + '">' +
        (it.poster ? '<img loading="lazy" alt="" src="' + esc(base() + it.poster) + '">' : "") +
        "<span>" + esc(it.titulo) + (it.seg ? '<br><span class="n">' + it.seg + " s</span>" : "") + "</span></button>";
    }).join("") +
    (g.hojas?.length
      ? '<div class="hojas"><small>📐 El porqué, en Hekatan LISP web:</small>' + g.hojas.map((h) => {
          const p = new URLSearchParams(); if (h.ej) p.set("ej", h.ej); else if (h.h) p.set("h", h.h);
          p.set("solo", "1");   // quien llega desde Struct ve la hoja resuelta, no el editor
          return '<a target="_blank" rel="noopener" href="' + esc(LISP_WEB + "#" + p.toString()) + '">' + esc(h.titulo) + " ↗</a>";
        }).join("") + "</div>"
      : "") +
    "</div>").join("");
  lista.querySelectorAll<HTMLButtonElement>(".it").forEach((b) => { b.onclick = () => poner(+b.dataset.k!, true); });
  bAnt.onclick = () => poner(actual - 1, true);
  bSig.onclick = () => poner(actual + 1, true);
  // al acabar un clip pasa al siguiente: la serie entera se ve de corrido
  video.addEventListener("ended", () => { if (actual + 1 < plano.length) poner(actual + 1, true); });

  let ini = 0;
  try { const u = localStorage.getItem(LS); const k = plano.findIndex((it) => it.video === u); if (k >= 0) ini = k; } catch {}
  poner(ini, false);
}

(window as any).__hekatanTutoriales = abrirTutoriales;
