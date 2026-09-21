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
  // EXPORTAR — Jorge, 21-sep-2026: «no veo un boton para exportar modelos ya hechos a
  // s2k e2k f2k». Los botones existian, pero repartidos en carpetas plegadas del panel
  // derecho (ETABS, SAP, SAFE, CLI) y distintas segun el ejemplo: estaban, pero no se
  // encontraban. Aqui quedan los cuatro juntos, al lado de Analisis y Diseno.
  //
  // Cada entrada pulsa el MISMO boton de su carpeta: no se duplica el exportador, se le
  // da un camino corto. Si el ejemplo no trae ese exportador, se dice, en vez de no
  // hacer nada.
  exportar: [
    { id: "e2k", orden: 1, icono: "🏗", titulo: "ETABS (.e2k)",
      detalle: "El modelo entero, para abrirlo en ETABS.", abrir: () => pulsarExport("E2K", "ETABS") },
    { id: "s2k", orden: 2, icono: "📐", titulo: "SAP2000 (.s2k)",
      detalle: "El modelo entero, para abrirlo en SAP2000.", abrir: () => pulsarExport("S2K", "SAP2000") },
    { id: "f2k", orden: 3, icono: "🪨", titulo: "SAFE (.f2k) — cimentación",
      detalle: "La cimentación con sus muelles, para SAFE.", abrir: () => pulsarExport("F2K", "SAFE") },
    { id: "tcl", orden: 4, icono: "🧮", titulo: "OpenSees (.tcl)",
      detalle: "El guion de OpenSees, para comprobarlo aparte.", abrir: () => pulsarExport(".tcl", "OpenSees") },
  ],
};

/**
 * Pulsa el boton de exportar que vive en el panel derecho.
 *
 * Se busca por su TEXTO porque cada ejemplo monta los suyos: la zapata trae SAFE y
 * OpenSees; el galpon trae ademas ETABS y SAP. Lo que no existe se dice claro, que
 * es mejor que un boton que no hace nada.
 */
function pulsarExport(clave: string, nombre: string): void {
  const cands = Array.from(document.querySelectorAll<HTMLElement>("button,.tp-btnv_b"));
  const b = cands.find((e) => {
    const t = (e.textContent || "").replace(/\s+/g, " ").trim();
    return t.includes("Exportar") && t.includes(clave) && t.length < 60;
  });
  if (b) { b.click(); return; }
  alert("Este ejemplo todavía no exporta a " + nombre + ".\n\n" +
        "Los que sí: el galpón curvo (ETABS, SAP2000, SAFE y OpenSees) y\n" +
        "la zapata (SAFE y OpenSees).");
}

const NOMBRE: Record<string, string> = { analisis: "▶ Análisis", diseno: "📐 Diseño", exportar: "📤 Exportar" };
const AYUDA: Record<string, string> = {
  analisis: "Análisis — elige qué calcular:",
  diseno: "Diseño — elige qué hacer:",
  exportar: "Exportar el modelo a otro programa:",
};

/**
 * Monta la barra de menus SIN esperar a que nadie registre nada.
 *
 * Jorge, 21-sep-2026: «no veo el menú análisis y diseño» y «exportar tampoco está».
 * Medido con su URL: abriendo un modelo por enlace (?m=…&t=new-blank) no aparecia
 * ninguno. La razon: `montar()` solo corria desde `registrarDiseno`, o sea, solo si
 * algun panel registraba una entrada de Diseño. En esa ruta nadie la registra, asi
 * que la barra entera no llegaba a existir — y con ella se iban tambien Analisis y
 * Exportar, que no tienen nada que ver con el diseño.
 */
export function montarMenusBarra(): void { montar(); }

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
  // Los MENUS no dependen de «Menú» ni de «Volver».
  //
  // Jorge, 21-sep-2026: «no veo el menú análisis y diseño, ¿qué pasó?». Medido: con
  // un modelo abierto por enlace (?m=…&t=new-blank) esos dos botones no existen, y
  // como el montaje esperaba a los DOS para seguir, se quedaba reintentando para
  // siempre y no aparecia ningun menu. En la zapata si existian, y por eso alli si
  // salian: el fallo estaba, pero solo se veia en unas rutas.
  //
  // Ahora se montan los menus de entrada, y lo de mover Menú/Volver se reintenta
  // aparte y con final: si a los 20 intentos no estan, es que esa vista no los tiene.
  let intentos = 0;
  const traer = () => {
    const a = mover("hk-home-btn"), v = mover("hk-back-btn");
    if ((!a || !v) && ++intentos < 20) setTimeout(traer, 400);
  };
  const ponerMenus = () => {
    for (const k of ["analisis", "diseno", "exportar"]) {
      const b = document.createElement("button");
      b.id = `hk-${k}-btn`; b.className = "piel"; b.textContent = NOMBRE[k] + " ▾";
      b.onclick = (ev) => { ev.stopPropagation(); abrirMenu(k, b); };
      barra.appendChild(b);
    }
  };
  ponerMenus();   // los menus, siempre; no dependen de Menu/Volver
  traer();
  // Orden de la barra: Menu · Volver · Analisis · Diseno · Exportar.
  // Como los menus se montan primero (ya no esperan a nadie), Menu y Volver
  // llegan despues y hay que adelantarlos. Jorge, 21-sep-2026: quedaban al final.
  const ordenar = () => {
    const primero = barra.querySelector("#hk-analisis-btn");
    // al reves: el ultimo insertado queda el primero
    for (const id of ["hk-back-btn", "hk-home-btn"]) {
      const e = document.getElementById(id);
      if (e && primero && e.parentElement === barra) barra.insertBefore(e, primero);
    }
  };
  for (const ms of [500, 1200, 2500, 5000]) setTimeout(ordenar, ms);
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

/**
 * Ventana flotante: se ARRASTRA por su cabecera (primer hijo) y se PLIEGA con el botón ▁
 * (`data-plegar`) o doble clic en la cabecera — Jorge, 19-sep-2026: «debe ser desplazable, ahora
 * colisiona con la gráfica del modelo y no se aprecia la barra color map». Por delegación en la
 * ventana: sirve aunque el contenido se vuelva a pintar con innerHTML.
 */
export function ventanaFlotante(pan: HTMLElement): void {
  let arr = false, dx = 0, dy = 0;
  const enCabecera = (t: EventTarget | null) => { const c = pan.firstElementChild; return !!c && c.contains(t as Node); };
  const plegar = () => {
    const pl = pan.dataset.plegado !== "1"; pan.dataset.plegado = pl ? "1" : "0";
    [...pan.children].slice(1).forEach((c) => ((c as HTMLElement).style.display = pl ? "none" : ""));
    pan.style.overflow = pl ? "hidden" : "auto";
  };
  pan.addEventListener("pointerdown", (e) => {
    if (!enCabecera(e.target)) return;
    const t = e.target as HTMLElement;
    if (t.closest("[data-plegar]")) { plegar(); return; }
    if (t.closest("button,select,input,[id$='-x']")) return;
    const r = pan.getBoundingClientRect(); arr = true; dx = e.clientX - r.left; dy = e.clientY - r.top;
    pan.setPointerCapture(e.pointerId); e.preventDefault();
  });
  pan.addEventListener("pointermove", (e) => {
    if (!arr) return;
    pan.style.left = Math.min(Math.max(0, e.clientX - dx), innerWidth - 80) + "px";
    pan.style.top = Math.min(Math.max(30, e.clientY - dy), innerHeight - 30) + "px";
    pan.style.right = "auto";
  });
  pan.addEventListener("pointerup", () => { arr = false; });
  pan.addEventListener("dblclick", (e) => { if (enCabecera(e.target) && !(e.target as HTMLElement).closest("[data-plegar]")) plegar(); });
  // La cabecera tiene que PARECER una barra de título (Jorge: «no veo que desplaza la ventana»):
  // franja azul, ⠿ de agarre y cursor de mover. Se vuelve a poner si el panel se repinta.
  const vestir = () => {
    const c = pan.firstElementChild as HTMLElement | null; if (!c || c.dataset.barra === "1") return;
    c.dataset.barra = "1";
    c.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none";
    c.title = "Arrastra esta barra para mover la ventana · doble clic o ▁ para plegarla";
    const b = c.querySelector("b"); if (b && !b.textContent!.startsWith("⠿")) b.textContent = "⠿ " + b.textContent;
  };
  vestir();
  new MutationObserver(vestir).observe(pan, { childList: true });
}
