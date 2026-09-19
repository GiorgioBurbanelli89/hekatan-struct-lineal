/**
 * hekatanCadSkin.ts — la piel de Hekatan Struct con forma de ventana CAD.
 *
 * DE DONDE SALEN LOS COLORES. No son inventados. La estructura de la paleta —
 * que haya un color de marco, uno de panel, uno de menu, uno hundido, un azul
 * de foco y un amarillo de seleccion— y sus relaciones de luminosidad estan
 * copiadas de
 *
 *     C:/Program Files/Autodesk/AutoCAD 2027/Themes/DarkTheme.xbel
 *     C:/Program Files/Autodesk/Revit  2027/Themes/DarkTheme.xbel
 *
 * que son XML plano con 233 colores con nombre — y que son el MISMO fichero en
 * los dos programas, byte a byte: Autodesk unifico la interfaz, asi que
 * «estilo AutoCAD» y «estilo Revit» no son dos estilos sino uno. Lo que los
 * diferencia es la DISPOSICION (Revit pone el navegador de proyecto y la
 * paleta de propiedades; AutoCAD, la linea de comando), y aqui estan las dos.
 *
 * El area de dibujo no va en ese fichero sino en el registro
 * (HKCU\..\Profiles\..\Drawing Window), y ahi los colores son enteros COLORREF
 * de Windows, o sea BGR: el fondo del modelo, 3156001, es #212830 y no #302721.
 *
 * Sobre esa estructura van los colores de Hekatan: el acero de Struct #7F96B3
 * y el oro de marca #D3A53C. Dos modos, oscuro y claro, y el claro NO es el
 * oscuro invertido: se rehizo mirando el LightTheme.xbel, porque invertir una
 * paleta oscura da grises sucios y pierde el contraste del texto pequeño.
 */

export type ModoPiel = "oscuro" | "claro";

const LLAVE = "hk-piel-cad";

// ── las dos paletas ───────────────────────────────────────────────────────
// El papel de cada color es el mismo en las dos; solo cambia el valor. Asi el
// resto del CSS se escribe UNA vez.
const OSCURO = {
  chrome: "#1B1F26",   // el marco de la ventana        (AppearanceEditorBackground)
  panel: "#232936",    // cintas y paletas               (ActiveContainer1)
  panel2: "#2E3646",   // menus y pestaña activa         (DropDownMenuBackground)
  hueco: "#12161C",    // lo hundido                     (ActiveContainer3)
  texto: "#C8D4E4",    // texto                          (ActiveContainer2)
  suave: "#8C9AAE",    // texto secundario
  borde: "#39445A",    // separadores                    (Border3)
  foco: "#7F96B3",     // acero de Struct                (DropDownButtonFocusOutline)
  marca: "#D3A53C",    // oro de marca                   (Highlight1)
  hover: "#2E3646",    // realce al pasar                (HoverBackground)
  lienzo: "#0E1116",   // el area de dibujo              (registro: Background)
  rejMayor: "#2C3647", // rejilla, linea mayor
  rejMenor: "#1C2230", // rejilla, linea menor
  cruz: "#E8EDF5",     // la cruz del cursor
  polar: "#7F96B3",    // el rastro polar
};
const CLARO = {
  chrome: "#D6DAE0",
  panel: "#EDEFF3",
  panel2: "#E1E5EC",
  hueco: "#C9D6E6",
  texto: "#1B2129",
  suave: "#5A6472",
  borde: "#A8B0BC",
  foco: "#3E6187",
  marca: "#9A6F12",
  hover: "#D6E4F2",
  lienzo: "#F4F6F9",
  rejMayor: "#B9C0D0",
  rejMenor: "#DCE0E8",
  cruz: "#1B2129",
  polar: "#3E6187",
};
const PALETAS: Record<ModoPiel, Record<string, string>> = {
  oscuro: OSCURO,
  claro: CLARO,
};

function vars(p: Record<string, string>): string {
  return Object.entries(p)
    .map(([k, v]) => `--hk-${k}:${v};`)
    .join("");
}

// ── el CSS. Una sola hoja, escrita contra las variables ──────────────────
const HOJA = `
:root{ ${vars(OSCURO)} }
:root[data-hk-piel="claro"]{ ${vars(CLARO)} }

/* Tweakpane 4 se tiñe entero por sus propias variables: no hace falta pelear
   con sus clases, que cambian de nombre en cada version. */
:root{
  --tp-base-background-color: var(--hk-panel);
  --tp-base-shadow-color: rgba(0,0,0,.35);
  --tp-button-background-color: var(--hk-panel2);
  --tp-button-background-color-hover: var(--hk-hover);
  --tp-button-background-color-focus: var(--hk-hover);
  --tp-button-background-color-active: var(--hk-foco);
  --tp-button-foreground-color: var(--hk-texto);
  --tp-container-background-color: var(--hk-panel2);
  --tp-container-background-color-hover: var(--hk-hover);
  --tp-container-background-color-focus: var(--hk-hover);
  --tp-container-background-color-active: var(--hk-foco);
  --tp-container-foreground-color: var(--hk-texto);
  --tp-groove-foreground-color: var(--hk-borde);
  --tp-input-background-color: var(--hk-hueco);
  --tp-input-background-color-hover: var(--hk-panel2);
  --tp-input-background-color-focus: var(--hk-panel2);
  --tp-input-background-color-active: var(--hk-panel2);
  --tp-input-foreground-color: var(--hk-texto);
  --tp-label-foreground-color: var(--hk-suave);
  --tp-monitor-background-color: var(--hk-hueco);
  --tp-monitor-foreground-color: var(--hk-texto);
  --tp-base-border-radius: 3px;
  --tp-blade-border-radius: 3px;
  --tp-base-font-family: "Segoe UI", system-ui, sans-serif;
}

body{ background: var(--hk-chrome); }

/* ── la BARRA DE TITULO, arriba: acceso rapido + nombre + modo ───────── */
#hk-cad-tit{
  position:fixed; left:0; top:0; right:0; height:30px; z-index:400;
  display:flex; align-items:center; gap:10px; padding:0 10px;
  background:var(--hk-chrome); color:var(--hk-texto);
  border-bottom:1px solid var(--hk-borde);
  font:12px/1 "Segoe UI",system-ui,sans-serif; user-select:none;
}
#hk-cad-tit .qa{ display:flex; gap:5px; }
#hk-cad-tit .qa button{
  width:22px; height:22px; border:0; border-radius:3px; cursor:pointer;
  background:var(--hk-panel2); color:var(--hk-texto); font-size:12px; line-height:1;
}
#hk-cad-tit .qa button:hover{ background:var(--hk-hover); outline:1px solid var(--hk-foco); }
#hk-cad-tit .doc{ opacity:.85; }
#hk-cad-tit .der{ margin-left:auto; display:flex; align-items:center; gap:9px; }
#hk-cad-tit .marca{ opacity:.6; letter-spacing:.2px; }
#hk-cad-tit .piel{
  border:1px solid var(--hk-borde); background:var(--hk-panel2); color:var(--hk-texto);
  border-radius:3px; padding:3px 10px; cursor:pointer; font-size:11.5px;
}
#hk-cad-tit .piel:hover{ border-color:var(--hk-foco); color:var(--hk-foco); }

/* ── la BARRA DE ESTADO, abajo: coordenadas + conmutadores ───────────── */
#hk-cad-est{
  position:fixed; left:0; right:0; bottom:0; height:26px; z-index:400;
  display:flex; align-items:center; gap:4px; padding:0 10px;
  background:var(--hk-chrome); color:var(--hk-texto);
  border-top:1px solid var(--hk-borde);
  font:11px/1 "Segoe UI",system-ui,sans-serif; user-select:none;
}
#hk-cad-est .xy{
  font-variant-numeric:tabular-nums; opacity:.85; min-width:196px;
  font-family:Consolas,monospace;
}
#hk-cad-est button{
  border:1px solid transparent; background:transparent; color:var(--hk-texto);
  border-radius:3px; padding:3px 9px; cursor:pointer; opacity:.5;
  font:11px/1 "Segoe UI",system-ui,sans-serif; letter-spacing:.2px;
}
#hk-cad-est button.on{
  opacity:1; background:var(--hk-hueco); color:var(--hk-foco);
  border-color:var(--hk-foco);
}
#hk-cad-est .uni{ margin-left:auto; opacity:.65; font-family:Consolas,monospace; }

/* ── las paletas dejan de FLOTAR y se acoplan, como en Revit ─────────── */
/* Las paletas acaban ENCIMA de la linea de comando, no debajo: acabando en la
   barra de estado, la linea de comando les tapaba la ultima fila —«Detener y
   restaurar» salia cortado por la mitad y parecia que el panel no llegaba. */
body.hk-cad #settings,
body.hk-cad #hk-pane-host{
  top:30px !important; bottom:var(--hk-cmd-hueco, 66px) !important; max-height:none !important;
  border-radius:0 !important; box-shadow:none !important;
}
body.hk-cad #settings{
  left:0 !important; right:auto !important;
  border-right:1px solid var(--hk-borde) !important; border-left:0 !important;
}
body.hk-cad #hk-pane-host{
  right:0 !important; left:auto !important;
  border-left:1px solid var(--hk-borde) !important; border-right:0 !important;
}
/* La botonera de la camara (flechas, zoom, casa) iba a 8 px del fondo del visor, y el
   visor llega hasta abajo: la ventana de comandos la tapaba casi entera y quedaba
   bajo el panel derecho, sin poder pulsarse. Va encima de la ventana de comandos y a la
   izquierda del panel. */
body.hk-cad #hk-nav-camara{
  bottom:calc(var(--hk-cmd-hueco, 66px) + 10px) !important; right:332px !important;
}
/* ── lo que ya flotaba y ahora choca con la barra de titulo ─────────── */
/* El lector de coordenadas se DUPLICABA con el de la barra de estado, y ahi
   arriba tapaba el nombre del programa. En un CAD las coordenadas viven en la
   barra de estado, asi que se esconde el de arriba y su texto se refleja abajo. */
body.hk-cad #hk-coord-fixed{ display:none !important; }
/* Tampoco junto al cursor: AutoCAD no pone la caja X= Y= Z= al lado de la cruz
   (se veia amontonada con la entrada dinamica). Quedan en la barra de estado. */
body.hk-cad #hk-coord-readout{ display:none !important; }
/* NADA PISA A NADA (Jorge, 19-sep-2026: «mira que no solape ningun boton, no solo esos»).
   Medido con cli/_sonda_solapes.mjs: 137 solapes en 7 estados de la ventana. Causas y arreglo:
   · #toolbar (el logo con los creditos + un 2.o boton de tema, DUPLICADO del «Claro» de arriba)
     flotaba a top:38px: debajo del panel derecho, o debajo de la cinta. Pasa a la barra de
     arriba (lo mueve vigilarSolapes) y su boton de tema se esconde.
   · los TIRADORES de los paneles iban pegados al borde de la ventana, ENCIMA del panel abierto
     (tapaban 24 px de cada fila): van por FUERA del panel, en su borde (--hk-izq / --hk-der).
   · el lanzador del AGENTE flotaba sobre las filas del panel derecho: se aparta lo que mida.
   · la CINTA se abria centrada y a todo lo ancho, por encima de los dos paneles: se encaja
     ENTRE ellos (left/right los pone vigilarSolapes) y sus filas envuelven si no caben. */
body.hk-cad #toolbar{ position:static !important; top:auto !important; right:auto !important; }
body.hk-cad #toolbar .btn-theme{ display:none !important; }
body.hk-cad #toolbar .btn{ padding:2px 8px !important; }
body.hk-cad #hk-settings-toggle{ left:var(--hk-izq,0px) !important; }
body.hk-cad #hk-pane-toggle{ right:var(--hk-der,0px) !important; }
body.hk-cad #hk-agente-lanzador{ right:calc(var(--hk-der,0px) + 34px) !important; }
body.hk-cad #hk-ribbon-abrir{ top:40px !important; }
/* La barra de titulo mide 30 px y el ribbon iba a top:8px: la primera fila de
   iconos (Linea, Polilinea...) quedaba DEBAJO de la barra. Se baja el ribbon,
   su linea de estado y la guia lo mismo que la barra de herramientas. */
body.hk-cad #hk-ribbon{ top:40px !important; }
body.hk-cad #hk-ribbon-estado{ top:106px !important; }
/* La guia se PUEDE ARRASTRAR: en cuanto se mueve se le pone el atributo data-movida
   y esta regla deja de aplicarle. Con el !important sin condicion no habia forma de
   cambiarle el top desde el arrastre —se movia en horizontal y en vertical se
   quedaba clavada en 292 px— porque !important gana al estilo en linea.
   (Ojo: esto es CSS dentro de una plantilla de texto; un acento invertido aqui la
   cierra y el build casca con «Expected ; but found data».) */
body.hk-cad #hk-ribbon-guia:not([data-movida]){ top:292px !important; max-height:calc(100% - 360px) !important; }
body.hk-cad #hk-ribbon-guia[data-movida]{ max-height:calc(100% - 120px); }

/* ── la LINEA DE COMANDO, acoplada abajo y a todo lo ancho ───────────── */
/* Estaba flotando en el centro con un cian que no es de ninguna de las dos
   paletas. En AutoCAD va pegada al borde inferior, sobre la barra de estado. */
/* Desde el 8-sep-2026 la ventana tiene HISTORIAL encima del prompt (F2 lo
   despliega), asi que la altura ya no es fija: la fijaba en 40 px y el
   historial salia aplastado a una linea de scroll. */
body.hk-cad #hk3-cmdline{
  left:0 !important; right:0 !important; bottom:26px !important;
  transform:none !important; width:auto !important;
  border-radius:0 !important; border:0 !important;
  border-top:1px solid var(--hk-borde) !important;
  background:var(--hk-hueco) !important; box-shadow:none !important;
  padding:0 !important; box-sizing:border-box !important;
}
body.hk-cad #hk3-cmd-hist{ color:var(--hk-suave) !important; border-bottom:1px solid var(--hk-borde) !important; }
body.hk-cad #hk3-cmd-prompt{ color:var(--hk-foco) !important; }
body.hk-cad #hk3-cmd-wrap{
  background:var(--hk-panel2) !important; border:1px solid var(--hk-borde) !important;
  border-radius:3px !important;
}
body.hk-cad #hk3-cmd-input{ color:var(--hk-texto) !important; }

/* ── la LEYENDA del mapa de color ────────────────────────────────────── */
/* Sus numeros venian con color:#fff fijo. En oscuro no se notaba; en claro son
   BLANCOS SOBRE BLANCO y la barra de color se queda sin escala. No se ve
   mirando: se caza leyendo el color calculado. */
body.hk-cad #legend p{ color:var(--hk-texto) !important; }
body.hk-cad #legend > div:first-child{ color:var(--hk-suave) !important; }

/* la consola del CLI y cualquier monitor de Tweakpane siguen la paleta */
body.hk-cad .tp-mllv_i, body.hk-cad .tp-txtv_i, body.hk-cad textarea{
  background:var(--hk-hueco) !important; color:var(--hk-texto) !important;
  border-color:var(--hk-borde) !important;
}
`;

// ── el trocito de estado que la barra de abajo enseña ────────────────────
const CONMUTADORES = [
  ["forzc", "FORZC", true],
  ["rejilla", "REJILLA", true],
  ["orto", "ORTO", true],
  ["polar", "POLAR", true],
  ["refent", "REFENT", true],
  ["rastreo", "RASTREO", false],
  ["din", "DIN", true],
] as const;

let modoActual: ModoPiel = "oscuro";

function leerModo(): ModoPiel {
  try {
    const v = localStorage.getItem(LLAVE);
    if (v === "claro" || v === "oscuro") return v;
  } catch {}
  return "oscuro";
}

/** Cambia entre oscuro y claro, y avisa al visor 3D (que pinta con WebGL, no
 *  con CSS: su fondo no se entera de una variable). */
export function ponerModo(m: ModoPiel): void {
  modoActual = m;
  document.documentElement.setAttribute("data-hk-piel", m);
  try {
    localStorage.setItem(LLAVE, m);
  } catch {}
  const b = document.querySelector<HTMLButtonElement>("#hk-cad-tit .piel:not(.tut)");
  if (b) b.textContent = m === "oscuro" ? "\u25D1 Claro" : "\u25D0 Oscuro";
  // el visor tiene su propio tema, y es el que manda sobre el clear color
  try {
    // import diferido: hekatan-ui no siempre esta cargado cuando corre esto
    (window as any).__hkSetViewerTheme?.(m === "oscuro" ? "dark" : "light");
  } catch {}
  window.dispatchEvent(new CustomEvent("hk-piel", { detail: m }));
}

export function alternarModo(): ModoPiel {
  const m: ModoPiel = modoActual === "oscuro" ? "claro" : "oscuro";
  ponerModo(m);
  return m;
}

export function modoPiel(): ModoPiel {
  return modoActual;
}

/** Escribe las coordenadas del cursor en la barra de estado. */
export function ponerCoordenadas(x: number, y: number, z: number): void {
  const el = document.getElementById("hk-cad-xy");
  if (el) el.textContent = `${x.toFixed(4)}, ${y.toFixed(4)}, ${z.toFixed(4)}`;
}

/**
 * Monta la piel. Es idempotente: llamarla dos veces no duplica nada.
 *
 * @param doc  nombre del modelo abierto, para la barra de titulo
 */
/**
 * Mete un botón en la BARRA DE ARRIBA (a la derecha, después de «Claro»), en vez de dejarlo flotando.
 *
 * Por qué (Jorge, 19-sep-2026, viendo el vídeo de la interfaz): «▦ Franjas» y «🧱 Sobrecarga DNE»
 * iban con `position:fixed; top:60px`, que es justo la franja donde se abre la CINTA (y de 40 a 170):
 * con la cinta abierta se montaban encima de «?», «▴», «▾» y de Carga / Carga q, y con el panel
 * derecho abierto tapaban la fila «Categoría». La barra de arriba (y de 0 a 30) es el único sitio al
 * que no llegan ni la cinta ni los paneles.
 *
 * Va DESPUÉS del botón de tema a propósito: el tema se busca con `.piel:not(.tut)` y `querySelector`
 * devuelve el primero, así que un `.piel` puesto antes le robaría el clic.
 * La barra puede no existir todavía cuando el panel se monta: se reintenta 40 veces (20 s) y, si no
 * llega a haber barra (otra app sin piel CAD), el botón se queda donde estaba.
 */
export function botonABarraDeArriba(btn: HTMLButtonElement, intentos = 40): void {
  const der = document.querySelector<HTMLElement>("#hk-cad-tit .der");
  if (!der) { if (intentos > 0) setTimeout(() => botonABarraDeArriba(btn, intentos - 1), 500); return; }
  btn.style.cssText = "";               // fuera el position:fixed y los colores a mano: manda la piel
  btn.classList.add("piel", "ext");
  der.insertBefore(btn, der.querySelector(".marca"));
}

/**
 * NADA PISA A NADA. Encaja la cinta ENTRE los paneles abiertos, saca los tiradores al borde
 * exterior de su panel, aparta el lanzador del agente y sube a la barra de arriba la barrita
 * heredada (#toolbar). Ver la nota larga en el CSS. Se comprueba con `node cli/_sonda_solapes.mjs`.
 *
 * No toca main.ts ni la cinta: mira el estado real del DOM. Un panel esta PLEGADO cuando lleva
 * un translateX en su style (asi lo pliegan setPaneHidden / setLeftHidden) o no se ve.
 */
function vigilarSolapes(): void {
  const q = (sel: string) => document.querySelector<HTMLElement>(sel);
  const abierto = (el: HTMLElement | null) =>
    !!el && getComputedStyle(el).display !== "none" && !/translateX/.test(el.style.transform || "") && el.offsetWidth > 0;
  let ultimo = "";
  const ajustar = () => {
    const izq = q("#settings"), der = q("#hk-pane-host"), cinta = q("#hk-ribbon");
    const L = abierto(izq) ? izq!.offsetLeft + izq!.offsetWidth : 0;
    const R = abierto(der) ? der!.offsetWidth : 0;
    // la barrita heredada, a la barra de arriba (una vez, en cuanto existan las dos)
    const tb = q("#toolbar"), barra = q("#hk-cad-tit .der");
    if (tb && barra && tb.parentElement !== barra) barra.insertBefore(tb, barra.querySelector(".marca"));
    const alto = cinta && getComputedStyle(cinta).display !== "none" ? Math.round(cinta.getBoundingClientRect().bottom) : 0;
    const firma = L + "|" + R + "|" + alto + "|" + window.innerWidth;
    if (firma === ultimo) return;
    ultimo = firma;
    document.body.style.setProperty("--hk-izq", L + "px");
    document.body.style.setProperty("--hk-der", R + "px");
    if (cinta) {
      // 30 = los 24 px del tirador + 6 de aire: la cinta tampoco pisa el tirador
      cinta.style.left = (L + 30) + "px"; cinta.style.right = (R + 30) + "px";
      cinta.style.transform = "none"; cinta.style.maxWidth = "none";
      // Las filas envuelven si no caben. Quien rehaga la cinta por dentro (pestañas, etc.) y quiera
      // mandar en sus filas pone data-hk-filas="propias" en #hk-ribbon y esto no se las toca; lo unico
      // que la piel exige es que la cinta quepa en el ANCHO que se le deja entre los paneles.
      if (cinta.dataset.hkFilas !== "propias")
        for (const fila of Array.from(cinta.children) as HTMLElement[]) { fila.style.flexWrap = "wrap"; fila.style.rowGap = "2px"; }
      // la linea de estado de la cinta va DEBAJO de ella, mida lo que mida (antes: top fijo de 106 px)
      const est = q("#hk-ribbon-estado");
      const b = Math.round(cinta.getBoundingClientRect().bottom);
      if (est && b > 0) est.style.setProperty("top", (b + 4) + "px", "important");
      ultimo = L + "|" + R + "|" + b + "|" + window.innerWidth;
    }
  };
  const obs = new MutationObserver(() => ajustar());
  obs.observe(document.body, { attributes: true, attributeFilter: ["style", "class"], subtree: true, childList: true });
  window.addEventListener("resize", ajustar);
  setInterval(ajustar, 800);      // red de seguridad: paneles y cinta nacen tarde y sin avisar
  ajustar();
}

export function aplicarPielCad(doc = "sin titulo"): void {
  if (document.getElementById("hk-cad-hoja")) return;

  const st = document.createElement("style");
  st.id = "hk-cad-hoja";
  st.textContent = HOJA;
  document.head.appendChild(st);
  document.body.classList.add("hk-cad");

  const tit = document.createElement("div");
  tit.id = "hk-cad-tit";
  tit.innerHTML =
    '<span class="qa">' +
    '<button title="Nuevo">\u2795</button>' +
    '<button title="Abrir">\u{1F5C1}</button>' +
    '<button title="Guardar">\u{1F4BE}</button>' +
    '<button title="Guardar como">\u{1F4BE}…</button>' +
    '<button title="Deshacer">\u21A9</button>' +
    '<button title="Rehacer">\u21AA</button>' +
    "</span>" +
    `<span class="doc">${doc}</span>` +
    '<span class="der">' +
    '<button class="piel tut" id="hk-cad-tutorial" title="Videos cortos: cómo se usa Hekatan Struct">🎬 Tutorial</button>' +
    '<button class="piel">\u25D1 Claro</button>' +
    '<span class="marca">Hekatan Struct lineal</span>' +
    "</span>";
  document.body.appendChild(tit);
  vigilarSolapes();
  // «🎬 Tutorial»: el panel de clips se trae SOLO al pulsar (import dinámico): cero peso al arrancar
  tit.querySelector<HTMLButtonElement>("#hk-cad-tutorial")?.addEventListener("click", () => {
    import("./tutoriales").then((m) => m.abrirTutoriales()).catch((e) => console.error("[tutoriales]", e));
  });

  // La franja de conmutadores de la piel (FORZC · REJILLA · ORTO · POLAR ·
  // REFENT · RASTREO · DIN) era DECORATIVA: sus botones lanzaban un evento
  // `hk-conmutador` que nadie escuchaba. Desde el 8-sep-2026 la barra de
  // estado es `getCadStatusBar.ts` (hekatan-ui), con conmutadores que hacen lo
  // que dicen (F9 · F8 · F10 · F3) y las coordenadas de verdad. Esta se deja
  // escondida para no tener dos barras abajo.
  const est = document.createElement("div");
  est.id = "hk-cad-est";
  est.style.display = "none";
  est.innerHTML =
    '<span class="xy" id="hk-cad-xy">0.0000, 0.0000, 0.0000</span>' +
    CONMUTADORES.map(
      ([k, r, on]) =>
        `<button data-k="${k}" class="${on ? "on" : ""}">${r}</button>`
    ).join("") +
    '<span class="uni" id="hk-cad-uni">tonf \u00B7 m</span>';
  document.body.appendChild(est);

  est.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    b.classList.toggle("on");
    window.dispatchEvent(
      new CustomEvent("hk-conmutador", {
        detail: { k: b.dataset.k, on: b.classList.contains("on") },
      })
    );
  });

  tit.querySelector<HTMLButtonElement>(".piel:not(.tut)")!.onclick = () => alternarModo();

  // El visor ya escribe las coordenadas en #hk-coord-fixed. En vez de duplicar
  // ese calculo —que es de donde salen los numeros que NO cuadran—, se copia su
  // texto a la barra de estado. Una sola fuente.
  const espejo = () => {
    const src = document.getElementById("hk-coord-fixed");
    const dst = document.getElementById("hk-cad-xy");
    if (src && dst && src.textContent) dst.textContent = src.textContent.trim();
  };
  const obs = new MutationObserver(espejo);
  const engancha = () => {
    const src = document.getElementById("hk-coord-fixed");
    if (src) { obs.observe(src, { childList: true, subtree: true, characterData: true }); espejo(); }
    else setTimeout(engancha, 400);
  };
  engancha();

  ponerModo(leerModo());
}
