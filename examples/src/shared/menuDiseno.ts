/**
 * Barra de MENÚS dentro de la barra de título, al lado del nombre del modelo:
 *   🏠 Menú · ← Volver · ▶ Análisis ▾ · 📐 Diseño ▾
 * (Jorge, 19-sep-2026: «aquí deben estar los botones de diseño, análisis…» y «un botón de diseño
 * que no se solape con ningún botón»). Antes Menú/Volver flotaban en el centro y Franjas/DNE
 * encima del panel derecho. Cada panel registra su entrada con `registrarDiseno`; su botón
 * propio queda oculto.
 */
type Entrada = { id: string; icono: string; titulo: string; detalle: string; abrir: () => void; orden: number };
const menus: Record<string, Entrada[]> = {
  analisis: [
    { id: "estatico", orden: 1, icono: "▶", titulo: "Analizar (estático)", detalle: "Resuelve el modelo con el caso o la combinación elegida en «Resultados».",
      abrir: () => (window as any).__hekatanRebuild?.() },
    { id: "modal", orden: 2, icono: "〰", titulo: "Modal + animar", detalle: "Periodos, modos y participación de masa; anima el modo elegido.",
      abrir: () => (window as any).__hekatanRunModalAnimate?.() },
    { id: "parar", orden: 3, icono: "■", titulo: "Parar animación", detalle: "Detiene la animación del modo.",
      abrir: () => (window as any).__hekatanModalStop?.() },
  ],
  diseno: [],
};
const NOMBRE: Record<string, string> = { analisis: "▶ Análisis", diseno: "📐 Diseño" };
const AYUDA: Record<string, string> = {
  analisis: "Análisis — elige qué calcular:",
  diseno: "Diseño — elige qué hacer:",
};

export function registrarDiseno(e: Entrada): void {
  const l = menus.diseno;
  if (!l.some((x) => x.id === e.id)) { l.push(e); l.sort((a, b) => a.orden - b.orden); }
  montar();
}

let menuAbierto: HTMLDivElement | null = null;
function montar(): void {
  if (document.getElementById("hk-menus")) return;
  const tit = document.getElementById("hk-cad-tit"), doc = tit?.querySelector(".doc");
  if (!tit || !doc) { setTimeout(montar, 400); return; }   // la barra de título aún no está
  // en pantallas angostas: nada se parte en dos líneas; primero se quita la marca, luego el nombre
  const st = document.createElement("style");
  st.textContent = "#hk-cad-tit button{white-space:nowrap}" +
    "@media (max-width:1100px){#hk-cad-tit .marca{display:none}}" +
    "@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}";
  document.head.appendChild(st);
  const barra = document.createElement("span");
  barra.id = "hk-menus"; barra.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px";
  doc.after(barra);

  // Menú y Volver: de flotar en el centro a la barra (mismo botón, mismo evento)
  const mover = (id: string) => {
    const b = document.getElementById(id) as HTMLButtonElement | null; if (!b) return false;
    const visible = b.style.display !== "none";
    b.removeAttribute("style"); b.className = "piel"; if (!visible) b.style.display = "none";
    barra.appendChild(b); return true;
  };
  const traer = () => { const a = mover("hk-home-btn"), v = mover("hk-back-btn"); if (!a || !v) setTimeout(traer, 400); else ponerMenus(); };
  const ponerMenus = () => {
    for (const k of ["analisis", "diseno"]) {
      const b = document.createElement("button");
      b.id = `hk-${k}-btn`; b.className = "piel"; b.textContent = NOMBRE[k] + " ▾";
      b.onclick = (ev) => { ev.stopPropagation(); abrirMenu(k, b); };
      barra.appendChild(b);
    }
  };
  traer();
  // «← Volver» se enciende/apaga desde main.ts: que lo haga con display inline, no block
  const w = window as any, orig = w.__hekatanActualizarBotonVolver;
  w.__hekatanActualizarBotonVolver = (hay: boolean) => {
    orig?.(hay); const b = document.getElementById("hk-back-btn"); if (b) b.style.display = hay ? "" : "none";
  };
  document.addEventListener("click", (ev) => { if (menuAbierto && !menuAbierto.contains(ev.target as Node)) cerrar(); });
}

function cerrar() { menuAbierto?.remove(); menuAbierto = null; }
function abrirMenu(k: string, btn: HTMLButtonElement) {
  const eraEste = menuAbierto?.dataset.menu === k; cerrar(); if (eraEste) return;
  const m = document.createElement("div");
  m.dataset.menu = k; m.id = `hk-${k}-menu`;
  m.style.cssText = "position:fixed;z-index:1000;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
  m.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${AYUDA[k]}</div>` + menus[k].map((e) =>
    `<div data-id="${e.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${e.icono} ${e.titulo}</b><div style="opacity:.75;margin-top:2px">${e.detalle}</div></div>`).join("");
  m.querySelectorAll<HTMLDivElement>("[data-id]").forEach((d) => {
    d.onmouseenter = () => (d.style.background = "#1f3b5a"); d.onmouseleave = () => (d.style.background = "");
    d.onclick = () => { cerrar(); menus[k].find((x) => x.id === d.dataset.id)?.abrir(); };
  });
  document.body.appendChild(m);
  const r = btn.getBoundingClientRect();
  m.style.top = r.bottom + 4 + "px"; m.style.left = Math.max(8, Math.min(r.left, innerWidth - 370)) + "px";
  menuAbierto = m;
}
