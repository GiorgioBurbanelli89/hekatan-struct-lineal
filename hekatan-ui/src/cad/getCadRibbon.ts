/**
 * Ribbon CAD — el panel de dibujo empezado de cero, para comparar con el
 * Tweakpane. Se enciende con `?ribbon=1`; sin eso no aparece y todo sigue igual.
 *
 * POR QUE OTRO PANEL, y no seguir arreglando el que hay:
 *
 * El Tweakpane es una COLUMNA de botones de una línea cada uno. Con 19
 * herramientas + snaps + planos + ejes mide más que la pantalla, hay que
 * hacer scroll para llegar a "Borrar", y el ratón viaja de un lado al otro
 * de la pantalla entre el lienzo y el panel. Agrupar en carpetas lo acortó
 * pero añadió un clic para abrir el cajón: mejor, pero no cómodo.
 *
 * AutoCAD no se usa así. Se usa con la mano izquierda en el teclado y la
 * derecha en el ratón: se teclea `l` y ya estás dibujando. Los botones son
 * el respaldo, no el camino. Así que aquí:
 *
 *   1. Una FILA horizontal arriba, no una columna. Botones anchos con el
 *      icono y la LETRA del atajo a la vista, para aprenderse los atajos
 *      usándolos. La fila está pegada al lienzo, no al borde de la pantalla.
 *   2. La LETRA es la herramienta, como en AutoCAD: L línea · P polilínea ·
 *      R rectángulo · C círculo · A arco · Q área · K columna · M muro ·
 *      E borrar · S seleccionar · G rejilla. Sin Ctrl, sin Alt.
 *   3. Lo que NO se usa cada minuto (snaps finos, planos de referencia,
 *      niveles sueltos) no está: vive en el Tweakpane. Un panel de dibujo
 *      con TODO dentro es justo lo que hace que no quepa.
 *   4. La barra de estado dice qué se espera AHORA ("Línea — clic 1er
 *      punto"), que es el Dynamic Prompt de AutoCAD. Sin eso no se sabe si
 *      falta un clic o dos.
 *
 * La caja de comandos de abajo (`#hk3-cmdline`) ya existe y no se toca: es
 * la misma para los dos paneles.
 */
import { DEMOS, DEMO_GENERICA, reproducir } from "./helpAnim";


export interface RibbonHooks {
  /** Activa una herramienta ("line", "rect", "col", …). */
  setTool: (t: string) => void;
  /** Herramienta activa ahora, para pintar el botón encendido. */
  getTool: () => string | null;
  setView: (v: "plan" | "elevX" | "elevY" | "iso") => void;
  /** Plano de trabajo. */
  setPlane: (k: "xy" | "xz" | "yz") => void;
  /** Genera la rejilla completa (vanos X, vanos Y, alturas, columnas). */
  grid?: (vx: string, vy: string, vz: string, col: boolean) => void;
  /** Cierra el dibujo en curso (Esc). */
  finish?: () => void;
  undo?: () => void;
  clear?: () => void;
  /**
   * Si la barra arranca PLEGADA (solo el botón «✏ Dibujar»).
   *
   * El workspace lo pone a `true` cuando lo cargado es un ejemplo ya resuelto:
   * ahí se viene a MIRAR, y la barra —que ocupa dos filas— se come el tercio de
   * arriba del lienzo. En el lienzo en blanco va a `false`, porque ahí es lo
   * único de la pantalla que dice qué hacer.
   *
   * ⚠️ Es solo el DEFECTO. Si el usuario ya plegó o desplegó alguna vez, manda
   * su elección (guardada en `localStorage`).
   */
  plegadoPorDefecto?: boolean;
}

import { montarExtras } from "./ribbonExtras";

interface Herr {
  id: string; icono: string; nombre: string; tecla: string; ayuda: string;
  /** Si está, el botón no es una herramienta del motor sino una ACCIÓN (devuelve el aviso). */
  accion?: () => string | void;
  /** Encendido del botón para las acciones que son interruptores (deformada, axil…). */
  activo?: () => boolean;
}

// ── Acciones de la cinta que no son herramientas de dibujo ───────────────────
// Llaman a lo MISMO que el control del panel (los States del visor o los ganchos
// globales que usa el Tweakpane): el mismo mando con otra entrada, sin copiar lógica.
const W_ = () => window as any;
const ajustes = () => W_().__hekatanSettings?.();
/** Resultados de BARRA: el mismo State `frameResults` del desplegable «Resultados de barra». */
const verBarra = (val: string, nom: string) => () => {
  const st = ajustes(); if (!st?.frameResults) return "El visor todavía no tiene resultados.";
  const ya = st.frameResults.rawVal === val;
  st.frameResults.val = ya ? "none" : val;
  return ya ? "Diagrama apagado." : `Diagrama de ${nom} sobre cada barra, con su valor.`;
};
/** Resultados de NUDO: el mismo State `nodeResults` del desplegable «Resultados de nudo». */
const verNudo = (val: string, nom: string) => () => {
  const st = ajustes(); if (!st?.nodeResults) return "El visor todavía no tiene resultados.";
  const ya = st.nodeResults.rawVal === val;
  st.nodeResults.val = ya ? "none" : val;
  return ya ? `${nom}: apagado.` : `${nom} en cada nudo.`;
};
/** Escala de la deformada: el mismo State `deformScale` del slider «Escala XY». */
const escala = (f: number) => () => {
  const st = ajustes(); if (!st?.deformScale) return "";
  const v = Math.max(0.1, Math.min(5000, +(st.deformScale.rawVal * f).toPrecision(3)));
  st.deformScale.val = v;
  if (st.deformedShape && !st.deformedShape.rawVal) st.deformedShape.val = true;
  return `Escala de la deformada: ×${v}.`;
};

/** Botones que no son herramientas del motor: se APLICAN al nudo o barra que se clica. */
const APLICA = new Set(["apoyo", "apoyoart", "carga", "cargaq"]);

/** Lo que se usa todo el rato. Lo demás NO entra aquí a propósito. */
// `fila`: 1 = arriba (dibujar / estructura / analizar / vista), 2 = abajo (modificar /
// rejilla / cota / carga). Dos filas y no más, como las barras de ETABS (Jorge, 13-sep-2026).
// `pest`: la PESTAÑA de la cinta donde vive el grupo (como las fichas de AutoCAD: Inicio,
// Insertar, Anotar…). Dos filas por pestaña y nada más; lo que no cabía en dos filas a
// 1280 px (medido: fila 1 = 1238 px, fila 2 = 1678 px) se reparte en pestañas.
type Pest = "dibujo" | "rejilla" | "areas" | "resultados" | "ifc";
const GRUPOS: Array<{ titulo: string; fila: 1 | 2; pest: Pest; items: Herr[] }> = [
  {
    titulo: "Dibujar", fila: 1, pest: "dibujo",
    items: [
      { id: "line",     icono: "／", nombre: "Línea",     tecla: "L",   ayuda: "clic tras clic, encadena. C cierra, U quita el último, Esc termina." },
      { id: "polyline", icono: "⌒", nombre: "Polilínea", tecla: "PL",  ayuda: "clics seguidos; Enter o clic derecho para terminar." },
      { id: "rect",     icono: "▭", nombre: "Rectáng.",  tecla: "REC", ayuda: "clic en dos esquinas opuestas." },
      { id: "circle",   icono: "○", nombre: "Círculo",   tecla: "C",   ayuda: "clic en el centro, clic en el radio (o teclea el radio)." },
      { id: "arc",      icono: "⌒", nombre: "Arco",      tecla: "A",   ayuda: "clic inicio, medio y fin." },
      { id: "parabola", icono: "∪", nombre: "Parábola",  tecla: "PAR", ayuda: "3 clics en el plano de la vista: la parábola que pasa por los tres." },
      { id: "cubica",   icono: "∿", nombre: "Cúbica",    tecla: "CUB", ayuda: "4 clics: el polinomio de 3er grado que pasa por los cuatro." },
    ],
  },
  {
    titulo: "Estructura", fila: 1, pest: "dibujo",
    items: [
      { id: "col",  icono: "▌", nombre: "Columna", tecla: "COL", ayuda: "teclea la altura + Enter, luego clic en la base." },
      { id: "wall", icono: "▥", nombre: "Muro",    tecla: "MU",  ayuda: "teclea la altura + Enter, luego 2 clics en la base." },
      { id: "area", icono: "▦", nombre: "Losa",    tecla: "LO",  ayuda: "4 clics en orden, antihorario." },
      { id: "revolve", icono: "⟳", nombre: "Revoluc.", tecla: "REV", ayuda: "designá el meridiano (guía) y hacé 1 clic en el eje: cúpula en paños Q4." },
      { id: "loft",    icono: "⟲", nombre: "Barrido",  tecla: "BAR", ayuda: "designá contorno de planta + perfil de alzado y 1 clic en el centro: la piel en paños Q4." },
    ],
  },
  {
    // ── Lo que convierte un DIBUJO en un MODELO ──────────────────────────────
    // Se podian dibujar las nueve herramientas y el modelo no se resolvia
    // nunca, porque no habia forma de poner un apoyo ni una carga sin salir
    // del ribbon: 145 nudos, 121 tramos y cero resultados
    // (`node cli/ctl_solo_botones.mjs`). Una estructura sin apoyos no tiene
    // solucion — la matriz es singular — y sin cargas no se mueve.
    titulo: "Apoyos y cargas", fila: 1, pest: "dibujo",
    items: [
      // Los dos apoyos de la barra de ETABS (Assign ▸ Joint ▸ Restraints, botones rápidos):
      // empotrado y articulado. Antes solo había «Apoyo» (empotra) y para articular había que
      // seleccionar el nudo e ir a las casillas del panel de propiedades.
      { id: "apoyo", icono: "▲", nombre: "Empotr.", tecla: "AP",
        ayuda: "clic sobre un nudo: lo EMPOTRA (6 GDL). Con nudos ya seleccionados, los empotra a todos." },
      { id: "apoyoart", icono: "△", nombre: "Articul.", tecla: "APA",
        ayuda: "clic sobre un nudo: lo ARTICULA (Ux Uy Uz; giros libres). Con nudos ya seleccionados, los articula a todos." },
      { id: "carga", icono: "↓", nombre: "Carga", tecla: "CG",
        ayuda: "clic sobre un nudo: le pone la carga vertical de la casilla." },
      { id: "cargaq", icono: "⇊", nombre: "Carga q", tecla: "CQ",
        ayuda: "clic sobre una barra: carga distribuida vertical (kN/m) de la casilla, como Frame Distributed Load de ETABS." },
    ],
  },
  {
    titulo: "Modificar", fila: 2, pest: "dibujo",
    items: [
      // Deshacer / Rehacer a la vista, como la barra de acceso rápido de AutoCAD (Ctrl+Z / Ctrl+Y)
      { id: "deshacer", icono: "↶", nombre: "Anterior", tecla: "Ctrl+Z", ayuda: "deshace la última acción (también U + Enter)." },
      { id: "rehacer",  icono: "↷", nombre: "Rehacer",  tecla: "Ctrl+Y", ayuda: "rehace lo último deshecho." },
      { id: "select", icono: "🖱", nombre: "Selec.", tecla: "S",  ayuda: "clic sobre un elemento. Ventana: clic en una esquina, mueve, clic en la otra (izq→der ventana, der→izq captura). Arrastrar orbita." },
      { id: "move",   icono: "✥", nombre: "Mover",  tecla: "M",  ayuda: "con algo seleccionado: punto base y segundo punto (o @dx,dy,dz)." },
      { id: "copy",   icono: "⧉", nombre: "Copiar", tecla: "CO", ayuda: "con algo seleccionado: punto base y segundo punto (o @dx,dy,dz)." },
      { id: "replicar", icono: "⛁", nombre: "Replicar", tecla: "REP",
        ayuda: "con algo designado: desplazamiento y cuántas copias, como el Replicate de ETABS. Para pisos, «⇈ Subir»." },
      { id: "offset", icono: "⇉", nombre: "Desfase",  tecla: "O",  ayuda: "teclea la distancia + Enter; clic en la línea y clic en el lado." },
      { id: "trim",   icono: "✂", nombre: "Recortar", tecla: "TR", ayuda: "clic en el contorno de corte, luego en el trozo que sobra." },
      { id: "extend", icono: "↦", nombre: "Alargar",  tecla: "EX", ayuda: "clic en el contorno, luego en la línea a alargar, cerca del extremo." },
      // El «Reshape Object» de ETABS (Draw ▸ Reshape Object): designar y arrastrar
      // el extremo. No es «Alargar» de AutoCAD, que necesita un contorno de destino.
      { id: "reshape", icono: "⇲", nombre: "Remodelar", tecla: "RE",
        ayuda: "clic en la barra o el paño: salen sus extremos. Arrastra uno y la alarga o acorta. X/Y/Z fijan un eje, L la longitud." },
      { id: "delete", icono: "🗑", nombre: "Borrar",   tecla: "E",  ayuda: "pasa por encima (se pone rojo) y haz clic; o Supr con algo seleccionado." },
      { id: "medir",  icono: "📏", nombre: "Medir",    tecla: "DI", ayuda: "2 clics: distancia y Δx Δy Δz (acotar)." },
      { id: "aux",    icono: "┊", nombre: "Auxiliar",  tecla: "AUX", ayuda: "línea de construcción (cian, sin FEM): 2 clics." },
    ],
  },
  // ── Pestaña RESULTADOS: antes había que plegar la cinta e ir al panel Settings ──
  {
    titulo: "Deformada", fila: 1, pest: "resultados",
    items: [
      { id: "r-def", icono: "〰", nombre: "Deformada", tecla: "F", ayuda: "enciende o apaga la deformada, amplificada.",
        accion: () => { const st = ajustes(); if (!st?.deformedShape) return ""; st.deformedShape.val = !st.deformedShape.rawVal;
          return st.deformedShape.rawVal ? "Deformada encendida." : "Deformada apagada."; },
        activo: () => !!ajustes()?.deformedShape?.rawVal },
      { id: "r-esc-", icono: "÷2", nombre: "Menos", tecla: "", ayuda: "divide por 2 la escala de la deformada.", accion: escala(0.5) },
      { id: "r-esc+", icono: "×2", nombre: "Más", tecla: "", ayuda: "multiplica por 2 la escala de la deformada.", accion: escala(2) },
    ],
  },
  {
    titulo: "Diagramas de barra", fila: 1, pest: "resultados",
    items: [
      { id: "r-axil", icono: "N", nombre: "Axil", tecla: "A", ayuda: "diagrama de axiles (P) con su valor, como ETABS.", accion: verBarra("normals", "axiles"), activo: () => ajustes()?.frameResults?.rawVal === "normals" },
      { id: "r-cort", icono: "V", nombre: "Cortante", tecla: "S", ayuda: "diagrama de cortante V2.", accion: verBarra("shearsY", "cortante V2"), activo: () => ajustes()?.frameResults?.rawVal === "shearsY" },
      { id: "r-mom", icono: "M", nombre: "Momento", tecla: "D", ayuda: "diagrama de momento M3.", accion: verBarra("bendingsZ", "momento M3"), activo: () => ajustes()?.frameResults?.rawVal === "bendingsZ" },
    ],
  },
  {
    titulo: "Nudos", fila: 1, pest: "resultados",
    items: [
      { id: "r-desp", icono: "↧", nombre: "Desplaz.", tecla: "", ayuda: "desplazamientos de cada nudo (U1 U2 U3).", accion: verNudo("deformations", "Desplazamientos"), activo: () => ajustes()?.nodeResults?.rawVal === "deformations" },
      { id: "r-reac", icono: "⤒", nombre: "Reacción", tecla: "", ayuda: "reacciones en los apoyos (F y M).", accion: verNudo("reactions", "Reacciones"), activo: () => ajustes()?.nodeResults?.rawVal === "reactions" },
    ],
  },
  {
    titulo: "Ver en 2D", fila: 2, pest: "resultados",
    items: [
      { id: "r-2d", icono: "📐", nombre: "Diagrama 2D", tecla: "", ayuda: "el alzado con SOLO el diagrama elegido y sus valores, sin perspectiva (el botón «Ver diagrama en 2D» del panel).",
        accion: () => { W_().__hekatanDiagrama2D?.(); return "Diagrama en 2D: se cierra con la ✕ de su ventana."; } },
      { id: "r-barra", icono: "📈", nombre: "Barra", tecla: "", ayuda: "axil, cortante y momento a lo largo de la barra designada (el «Gráfico de la barra designada» del panel).",
        accion: () => { W_().__hekatanDiagramaBarra?.(); return ""; } },
    ],
  },
];

/** Monta el ribbon dentro de `host` (normalmente el contenedor del viewer). */
export function addCadRibbon(host: HTMLElement, hooks: RibbonHooks): HTMLElement {
  const barra = document.createElement("div");
  barra.id = "hk-ribbon";
  barra.style.cssText = [
    "position:absolute", "top:8px", "left:8px", "right:8px",
    "z-index:60", "display:flex", "flex-direction:column", "align-items:stretch", "gap:2px",
    "background:rgba(15,23,42,.94)", "border:1px solid #1e3a4a",
    "border-radius:10px", "padding:4px 5px", "backdrop-filter:blur(6px)",
    "box-shadow:0 6px 20px rgba(0,0,0,.45)",
    "font-family:system-ui,-apple-system,Segoe UI,sans-serif",
  ].join(";") + ";";
  // Dos filas fijas (no `flex-wrap`, que partía donde le cabía y salían tres). La de
  // abajo lleva un filete arriba para leerse como segunda barra, no como desborde.
  // `overflow-x:auto`: si el hueco entre paneles no da para toda la fila, la fila se
  // DESPLAZA dentro de la cinta. Sin esto, limitar el ancho no sirve de nada —los
  // botones tienen ancho fijo y se desbordan por debajo del panel, que es como el
  // «?» acababa en x = 1470 con la ventana de 1400 (medido).
  const mkFila = () => { const f = document.createElement("div");
    f.style.cssText = "display:flex;align-items:stretch;gap:0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;"; return f; };
  const filaA = mkFila(), filaB = mkFila();
  filaB.style.borderTop = "1px solid #1e3a4a"; filaB.style.paddingTop = "2px";
  // Fila de PESTAÑAS (las fichas de AutoCAD): cada pestaña enseña sus dos filas.
  const filaT = document.createElement("div");
  filaT.id = "hk-ribbon-pestanas";
  filaT.style.cssText = "display:flex;align-items:center;gap:2px;border-bottom:1px solid #1e3a4a;padding:0 2px 2px;";
  barra.append(filaT, filaA, filaB);
  const enFila = (n: 1 | 2) => (n === 1 ? filaA : filaB);

  const botones = new Map<string, HTMLButtonElement>();
  const HERR = new Map<string, Herr>(GRUPOS.flatMap((g) => g.items.map((h) => [h.id, h] as [string, Herr])));

  const pintarActivo = () => {
    const t = hooks.getTool();
    for (const [id, b] of botones) {
      // Apoyo y carga no son un tool del motor (van por seleccion), asi que su
      // boton se enciende con el modo, no con `getTool()`.
      const h = HERR.get(id);
      const on = h?.activo ? h.activo()
               : h?.accion ? false
               : APLICA.has(id) ? modoAplicar === id
               : (modoAplicar === null && id === t);
      b.style.background = on ? "#0e7490" : "transparent";
      b.style.borderColor = on ? "#22d3ee" : "transparent";
      b.style.color = on ? "#ecfeff" : "#cbd5e1";
    }
  };

  // ── La REFERENCIA, siempre visible ────────────────────────────────────────
  //
  // «Uso la línea y dónde me referencio, no sé.» Al dibujar en una pantalla 3D
  // un clic es un rayo, no un punto: hasta que no se sabe CONTRA QUÉ PLANO
  // choca y a QUÉ COTA, no se sabe dónde cae. El programa lo sabía —lo tenía en
  // `workPlane` y `workZ`— y no lo decía en ninguna parte.
  //
  // Así que la barra dice siempre las tres cosas, en este orden: en qué plano
  // se está dibujando, a qué cota, y qué se espera ahora. Es lo que hace la
  // línea de estado de AutoCAD.
  let prompt = "Elige una herramienta arriba, o teclea su comando y Enter (L, PL, REC, COL, M, CO).";
  let pistaActiva = false;   // mientras el ratón está sobre un botón, manda su pista
  // ── QUE LA CINTA NO QUEDE DEBAJO DE LOS PANELES ──────────────────────────
  //
  // La barra iba centrada en TODO el ancho, así que con el panel de la derecha
  // abierto sus últimos botones quedaban debajo: el «?» estaba pintado pero el
  // clic se lo comía el panel (medido con elementFromPoint: devolvía el panel,
  // «Categoría»). Se veía el botón y no respondía, que es la peor versión.
  //
  // Ahora la cinta se centra en el HUECO LIBRE entre los dos paneles y se limita
  // a su ancho. Es lo que hace la cinta de AutoCAD cuando se acopla un panel.
  const encajarEntrePaneles = () => {
    // Desde el 19-sep-2026 dónde va la cinta (entre los paneles, + 30 px) y la línea de
    // estado debajo los decide la piel del CAD (hekatanCadSkin.ts, vigilarSolapes): aquí
    // ya no se toca nada. Con las pestañas cada una cabe en ~1220 px (paneles plegados
    // a 1280); con los paneles abiertos la piel envuelve las filas.
    return;
    const hostR = host.getBoundingClientRect();
    if (!hostR.width) return;
    let izq = hostR.left, der = hostR.right;
    for (const sel of ["#settings", "#parameters", ".tp-dfwv"]) {
      for (const e of [...document.querySelectorAll(sel)] as HTMLElement[]) {
        const r = e.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) continue;            // no está desplegado
        if (r.top > hostR.top + 220) continue;                  // no estorba a la cinta
        if (r.right < hostR.left || r.left > hostR.right) continue;
        if (r.left <= hostR.left + hostR.width / 2) izq = Math.max(izq, r.right);
        else der = Math.min(der, r.left);
      }
    }
    const libre = Math.max(320, der - izq - 12);   // (código viejo, ya no se alcanza)
    barra.style.left = `${izq - hostR.left + (der - izq) / 2}px`;
    barra.style.maxWidth = `${libre}px`;
  };

  const refrescar = () => {
    encajarEntrePaneles();
    // la casilla de distancia dice a qué se refiere AHORA
    try {
      const i = document.getElementById("hk-dist-plano") as HTMLInputElement | null;
      const r = document.getElementById("hk-dist-rotulo");
      if (i && r) {
        const pl = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
        const L = pl === "xz" ? "Y" : pl === "yz" ? "X" : "Z";
        const v = (window as any).__hekatanCadState?.get?.()?.[pl === "xz" ? "workY" : pl === "yz" ? "workX" : "workZ"];
        const oo = ((window as any).__hekatanSCU ?? [0, 0, 0]) as number[];
        const conSCU = oo.some((v) => Math.abs(v) > 1e-9);
        r.textContent = conSCU
          ? `${L} del plano · ⌖ origen en (${oo.map((v) => v.toFixed(2)).join(", ")})`
          : `${L} del plano: escribe · arrastra · ↕ cursor · ▦+ deja · ▦× replica · ⌖ origen`;
        i.title = `Distancia del plano de trabajo: ${L} = ... (m). Enter lo aplica; ▦+ deja la grilla puesta ahí.`;
        if (document.activeElement !== i && typeof v === "number" && parseFloat(i.value) !== v) i.value = String(v);
        const sl = document.getElementById("hk-dist-slider") as HTMLInputElement | null;
        if (sl && document.activeElement !== sl && typeof v === "number" && parseFloat(sl.value) !== v) sl.value = String(v);
      }
    } catch {}
    const e = document.getElementById("hk-ribbon-estado");
    if (!e || pistaActiva) return;
    const st = (window as any).__hekatanCadState?.get?.();
    const plano = st?.workPlane ?? "xy";
    const nombre = plano === "xy" ? "PLANTA (X-Y)"
                 : plano === "xz" ? "ALZADO FRONTAL (X-Z)" : "ALZADO LATERAL (Y-Z)";
    const z = Number(st?.workZ ?? 0);
    // La cota solo manda en planta; en un alzado el plano es vertical y pasa
    // por el origen, así que anunciar "Z=0" allí despistaría.
    const cota = plano === "xy" ? ` · cota Z = ${z.toFixed(2)} m` : "";
    // El plano vertical se ancla al ultimo punto dibujado, asi que hay que
    // decir POR DONDE corta: "alzado frontal" a secas no dice nada si no se
    // sabe a que Y esta. Es la pregunta de «no se por donde dibujar».
    const r = (window as any).__hekatanPuntoRef as number[] | undefined;
    const corte = plano === "xz" && r ? ` · pasa por Y = ${r[1].toFixed(2)} m`
                : plano === "yz" && r ? ` · pasa por X = ${r[0].toFixed(2)} m` : "";
    e.innerHTML =
      `<b style="color:#22d3ee">Dibujando en ${nombre}</b>` +
      `<span style="color:#64748b">${cota}${corte}</span>` +
      `<span style="color:#334155"> │ </span><span>${prompt}</span>`;
  };
  const decir = (txt: string) => { prompt = txt; refrescar(); };
  // El plano y la cota cambian desde el Tweakpane y desde las teclas 1/2/3,
  // que no pasan por aquí: se relee en vez de intentar enterarse de cada sitio.
  setInterval(() => {
    refrescar();
    // Y se repinta el boton encendido: la herramienta tambien la sueltan Esc y
    // la caja de comandos, que no pasan por aqui. Sin esto el boton "Linea"
    // seguia iluminado despues de pulsar Esc, o sea que la barra decia que
    // estabas dibujando cuando ya podias seleccionar.
    pintarActivo();
  }, 600);

  // ── Apoyo y carga: se aplican al nudo que se clique ───────────────────────
  //
  // No son herramientas de dibujo, asi que no crean un tool nuevo en el motor:
  // encienden la SELECCION —que ya sabe encontrar el nudo bajo el cursor— y en
  // cuanto hay algo seleccionado le aplican la propiedad por el mismo evento
  // `hk:property-applied` que usa el panel de propiedades. Reusar ese camino
  // evita una segunda forma de poner apoyos que despues no coincida con la
  // primera.
  let modoAplicar: "apoyo" | "apoyoart" | "carga" | "cargaq" | null = null;
  const cargaVert = { kN: -10, kNm: -5 };
  const aplicarASeleccion = () => {
    if (!modoAplicar) return;
    const sel = (window as any).__hekatanSelection as Set<string> | undefined;
    if (!sel || sel.size === 0) return;
    if (modoAplicar === "cargaq") {
      // carga distribuida: va a los SEGMENTOS clicados (seg:P:S → clave "P:S")
      const segs = [...sel].filter((s) => s.startsWith("seg:"));   // el handler de main.ts quita él mismo el prefijo «seg:»
      if (!segs.length) return;
      window.dispatchEvent(new CustomEvent("hk:property-applied", { detail: { kind: "segs", ids: segs, prop: "distLoad", value: [0, 0, cargaVert.kNm] } }));
      decir(`Carga distribuida de ${cargaVert.kNm} kN/m en ${segs.length} barra${segs.length === 1 ? "" : "s"}. Segui clicando.`);
      sel.clear();
      try { (window as any).__hekatanRefreshSelection?.(); } catch {}
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    const pts = [...sel].filter((s) => s.startsWith("pt:"));
    if (!pts.length) return;
    const esApoyo = modoAplicar === "apoyo" || modoAplicar === "apoyoart";
    const detail = esApoyo
      ? { kind: "nodes", ids: pts, prop: "supports",
          value: modoAplicar === "apoyo" ? [true, true, true, true, true, true] : [true, true, true, false, false, false] }
      : { kind: "nodes", ids: pts, prop: "loads",
          value: [0, 0, cargaVert.kN, 0, 0, 0] };
    window.dispatchEvent(new CustomEvent("hk:property-applied", { detail }));
    decir(esApoyo
      ? `${modoAplicar === "apoyo" ? "Empotrado" : "Articulado"} en ${pts.length} nudo${pts.length === 1 ? "" : "s"}. Segui clicando.`
      : `Carga de ${cargaVert.kN} kN en ${pts.length} nudo${pts.length === 1 ? "" : "s"}.`);
    sel.clear();
    try { (window as any).__hekatanRefreshSelection?.(); } catch {}
    try { (window as any).__hekatanRebuild?.(); } catch {}
  };

  const usar = (h: Herr) => {
    // Deshacer / Rehacer: acciones, no herramientas (no cambian el tool activo)
    if (h.id === "deshacer" || h.id === "rehacer") {
      const W = window as any;
      if (h.id === "deshacer") { if (!W.__hekatanCadOption?.("u")) W.__hekatanUndo?.(); }
      else W.__hekatanRedo?.();
      decir(h.id === "deshacer" ? "Deshecho (Ctrl+Z)." : "Rehecho (Ctrl+Y).");
      return;
    }
    if (h.accion) {
      let m: string | void = "";
      try { m = h.accion(); } catch (e) { m = String(e); }
      decir(m || `${h.nombre} — ${h.ayuda}`);
      pintarActivo();
      return;
    }
    // Pulsar OTRA VEZ el botón activo lo apaga (vuelve a Selec.), como un interruptor
    const yaActivo = APLICA.has(h.id)
      ? modoAplicar === h.id
      : (modoAplicar === null && hooks.getTool() === h.id);
    if (yaActivo && h.id !== "select") {
      modoAplicar = null;
      (window as any).__hekatanBloquearVentana = false;
      hooks.setTool("select");
      pintarActivo();
      decir(`${h.nombre} desactivado — Selec.`);
      return;
    }
    // REPLICAR no es una herramienta de dibujo: es la orden REP, la misma que se
    // teclea. Estaba solo en el cuadro de comandos y en una carpeta del panel de
    // propiedades — o sea, escondida. Es la que convierte un pórtico en un
    // edificio, así que va en el ribbon con las demás de Modificar.
    if (h.id === "replicar") {
      const n = (window as any).__hekatanSelectionSize?.() ?? 0;
      if (!n) {
        hooks.setTool("select");
        decir("REPLICAR — primero designá lo que querés copiar (S, o ventana clic-clic).");
        pintarActivo();
        return;
      }
      (window as any).__hekatanCadRun?.("rep");
      decir("REPLICAR — contestá el desplazamiento y cuántas copias en el cuadro de comandos.");
      return;
    }
    if (APLICA.has(h.id)) {
      modoAplicar = h.id as "apoyo" | "apoyoart" | "carga" | "cargaq";
      // Como en ETABS: si ya hay nudos (o barras) SELECCIONADOS —una ventana sobre la
      // base de una cúpula—, el botón se aplica a todos de una vez; después sigue
      // esperando clics sueltos.
      const selPrev = (window as any).__hekatanSelection as Set<string> | undefined;
      const hayPrev = !!selPrev && [...selPrev].some((k) => k.startsWith(h.id === "cargaq" ? "seg:" : "pt:"));
      if (hayPrev) { aplicarASeleccion(); pintarActivo(); hooks.setTool("select"); (window as any).__hekatanBloquearVentana = true; return; }
      hooks.setTool("select");
      // En apoyo/carga el arrastre NO debe abrir una ventana de seleccion: se
      // va nudo a nudo. Es el unico caso que la bloquea, y se marca con su
      // nombre para no confundirlo con el estado normal.
      (window as any).__hekatanBloquearVentana = true;
      pintarActivo();
      decir(`${h.nombre} — ${h.ayuda}`);
      return;
    }
    modoAplicar = null;
    (window as any).__hekatanBloquearVentana = false;
    hooks.setTool(h.id);
    pintarActivo();
    decir(`${h.nombre} — ${h.ayuda}`);
  };

  // La PISTA de un botón al pasar el ratón: la guía es corta a propósito (los
  // cuatro pasos) y el detalle de cada herramienta se enseña donde se mira.
  let pistaTimer = 0;
  const pista = (txt: string) => {
    const e = document.getElementById("hk-ribbon-estado");
    const g = document.getElementById("hk-guia-pista");
    clearTimeout(pistaTimer);
    if (txt) {
      pistaActiva = true;
      if (e) e.innerHTML = `<span style="color:#22d3ee">${txt}</span>`;
      if (g) g.textContent = txt;
    } else {
      pistaTimer = window.setTimeout(() => { pistaActiva = false; refrescar(); if (g) g.textContent = ""; }, 150);
    }
  };
  for (const g of GRUPOS) {
    const caja = document.createElement("div");
    caja.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;";
    const fila = document.createElement("div");
    fila.style.cssText = "display:flex;gap:3px;";
    for (const h of g.items) {
      const b = document.createElement("button");
      b.type = "button";
      b.title = `${h.nombre}${h.tecla ? ` (${h.tecla})` : ""} — ${h.ayuda}`;
      b.style.cssText = [
        "display:flex", "flex-direction:column", "align-items:center",
        "justify-content:center", "gap:1px",
        "width:48px", "height:44px", "cursor:pointer",
        "background:transparent", "border:1px solid transparent",
        "border-radius:7px", "color:#cbd5e1", "font-family:inherit",
        "transition:background .12s",
      ].join(";") + ";";
      b.innerHTML =
        `<span style="font-size:16px;line-height:1">${h.icono}</span>` +
        `<span style="font-size:10px;line-height:1.1">${h.nombre}</span>` +
        `<span style="font-size:8px;opacity:.55;line-height:1">${h.tecla}</span>`;
      b.addEventListener("click", () => usar(h));
      b.addEventListener("mouseenter", () => {
        if (hooks.getTool() !== h.id) b.style.background = "rgba(34,211,238,.13)";
        pista(`${h.icono} ${h.nombre}${h.tecla ? ` (${h.tecla})` : ""} — ${h.ayuda}`);
      });
      b.addEventListener("mouseleave", () => { pintarActivo(); pista(""); });
      botones.set(h.id, b);
      fila.appendChild(b);
    }
    const rot = document.createElement("div");
    rot.textContent = g.titulo;
    rot.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
    caja.appendChild(fila); caja.appendChild(rot);
    caja.dataset.pest = g.pest;
    enFila(g.fila).appendChild(caja);

    const sep = document.createElement("div");
    sep.style.cssText = "width:1px;background:#1e3a4a;margin:4px 0;";
    sep.dataset.pest = g.pest; sep.dataset.disp = "block";
    enFila(g.fila).appendChild(sep);
  }

  // ── Rejilla: los tres campos y el botón, a la vista ────────────────────────
  // Es la forma rápida de arrancar una estructura desde cero, así que va en la
  // barra y no dentro de un cajón: escondida detrás de dos clics, no se usa.
  const cajaG = document.createElement("div");
  cajaG.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;";
  const filaG = document.createElement("div");
  filaG.style.cssText = "display:flex;gap:3px;align-items:center;";
  const campo = (ph: string, val: string, ancho: string) => {
    const i = document.createElement("input");
    i.type = "text"; i.value = val; i.placeholder = ph; i.title = ph;
    i.style.cssText = `width:${ancho};height:26px;background:#0a1622;border:1px solid #1e3a4a;` +
      "border-radius:5px;color:#cdeefb;font:12px Consolas,monospace;text-align:center;outline:none;";
    return i;
  };
  const inX = campo("Vanos en X, p.ej. 6,6,5 o 4x6", "4x6", "62px");
  const inY = campo("Vanos en Y", "3x5", "62px");
  const inZ = campo("Alturas de piso", "4x3", "56px");
  const bG = document.createElement("button");
  bG.type = "button";
  bG.textContent = "🏗 Rejilla";
  bG.title = "Genera ejes A,B,C… y 1,2,3…, los niveles y las columnas en los cruces (G)";
  bG.style.cssText = "height:26px;padding:0 10px;cursor:pointer;background:#0e7490;border:1px solid #22d3ee;" +
    "border-radius:6px;color:#ecfeff;font:600 11px inherit;";
  const lanzarGrid = () => {
    // ⚠️ La foto para Ctrl+Z la hace `__hekatanGenerarRejilla` ANTES de generar. Aquí
    // había otro pushUndo DESPUÉS, o sea una foto con la rejilla ya puesta: deshacer
    // devolvía exactamente lo que se quería quitar (medido: 100 nudos antes y después).
    hooks.grid?.(inX.value, inY.value, inZ.value, true);
    decir(`Rejilla generada: X=${inX.value} · Y=${inY.value} · pisos=${inZ.value}`);
  };
  bG.addEventListener("click", lanzarGrid);
  for (const i of [inX, inY, inZ])
    i.addEventListener("keydown", (e) => { if (e.key === "Enter") lanzarGrid(); });
  filaG.append(inX, document.createTextNode("×"), inY, document.createTextNode("×"), inZ, bG);
  const rotG = document.createElement("div");
  rotG.textContent = "Rejilla  X × Y × pisos";
  rotG.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  cajaG.append(filaG, rotG);
  cajaG.dataset.pest = "rejilla";
  filaA.appendChild(cajaG);

  // ── EN ALTURA: lo que permite trabajar en 3D sin cambiar de vista ─────────
  //
  // El plano de trabajo decide donde cae el clic, asi que sin esto hay que ir
  // saltando de planta a alzado para cada cosa. Las dos piezas existian —la
  // cota Z en el Tweakpane y `__hekatanReplicateSelection` sin boton— pero lo
  // que no se ve, no se usa.
  //
  //   Cota Z    : sigue dibujando en planta, pero a otra altura.
  //   Subir     : copia lo dibujado a los pisos de arriba, como el
  //               "Replicate Linear" de ETABS. Es lo que convierte una planta
  //               en un edificio sin volver a dibujarla.
  const cajaZ = document.createElement("div");
  cajaZ.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;";
  const filaZ = document.createElement("div");
  filaZ.style.cssText = "display:flex;gap:3px;align-items:center;";
  const campoZ = (val: string, ancho: string, ayuda: string) => {
    const i = document.createElement("input");
    i.type = "text"; i.value = val; i.title = ayuda;
    i.style.cssText = `width:${ancho};height:26px;background:#0a1622;border:1px solid #1e3a4a;` +
      "border-radius:5px;color:#cdeefb;font:12px Consolas,monospace;text-align:center;outline:none;";
    return i;
  };
  const inCotaZ = campoZ("0", "48px", "Cota Z del plano de planta, en metros");
  inCotaZ.id = "hk-dist-plano";
  // El rótulo y el significado de la casilla CAMBIAN con el plano de trabajo: en
  // planta es la cota Z, en alzado frontal es la Y por donde corta y en el lateral
  // la X. Antes solo valía para planta, así que en alzado la rejilla se quedaba en
  // Y = 0 y no había forma de llevarla al pórtico que tocaba.
  const planoActual = (): "xy" | "xz" | "yz" =>
    ((window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy") as "xy" | "xz" | "yz";
  const claveDist = () => ({ xy: "workZ", xz: "workY", yz: "workX" }[planoActual()]);
  const letraDist = () => ({ xy: "Z", xz: "Y", yz: "X" }[planoActual()]);
  const inAltPiso = campoZ("3", "44px", "Altura de piso para subir la planta, en metros");
  const inNumPisos = campoZ("3", "36px", "Cuantos pisos subir");
  const ponerZ = () => {
    const z = parseFloat(inCotaZ.value);
    if (!isFinite(z)) { inCotaZ.value = "0"; return; }
    const st = (window as any).__hekatanCadState?.get?.();
    const plano = planoActual();
    if (st) (st as any)[claveDist()] = z;
    hooks.setPlane(plano);
    const sl = document.getElementById("hk-dist-slider") as HTMLInputElement | null;
    if (sl) sl.value = String(z);
    if (plano !== "xy") {
      decir(`Plano ${plano.toUpperCase()} a ${letraDist()} = ${z.toFixed(2)} m. Lo que dibujes cae ahi.`);
      refrescar();
      return;
    }
    // ⚠️ NO se toca la vista. Cambiar de cota es cambiar de NIVEL, no de punto de
    // mira: ni ETABS ni AutoCAD te reencuadran al subir de planta. Con el
    // `setView("plan")` que habia aqui, poner la cota en una vista 3D te saltaba a
    // cenital (medido: cámara 30,-30,30 -> 0,0,1000) y los clics siguientes caian
    // en otro sitio — por eso no se podia dibujar un piso alto seguido.
    decir(`Plano de planta a la cota Z = ${z.toFixed(2)} m. Lo que dibujes cae ahi.`);
    refrescar();
  };
  inCotaZ.addEventListener("change", ponerZ);
  inCotaZ.addEventListener("keydown", (e) => { if (e.key === "Enter") ponerZ(); });
  const bSubir = document.createElement("button");
  bSubir.type = "button";
  bSubir.textContent = "⇈ Subir";
  bSubir.title = "Copia lo dibujado a los pisos de arriba (Replicate Linear de ETABS)";
  bSubir.style.cssText = "height:26px;padding:0 9px;cursor:pointer;background:#0e7490;" +
    "border:1px solid #22d3ee;border-radius:6px;color:#ecfeff;font:600 11px inherit;";
  bSubir.addEventListener("click", () => {
    const h = parseFloat(inAltPiso.value), n = Math.max(1, Math.round(parseFloat(inNumPisos.value) || 1));
    if (!isFinite(h) || h === 0) { decir("La altura de piso tiene que ser un numero distinto de 0."); return; }
    const w = window as any;
    const sel: Set<string> | undefined = w.__hekatanSelection;
    if (!sel) { decir("No se puede replicar: no hay seleccion disponible."); return; }
    // Sin nada seleccionado se sube TODO, que es lo que se quiere el 90 % de
    // las veces: "esta planta, a los pisos de arriba".
    if (sel.size === 0) {
      (w.__hekatanDrawingPoints?.val ?? []).forEach((_: any, i: number) => sel.add("pt:" + i));
      (w.__hekatanDrawingPolylines?.val ?? []).forEach((_: any, i: number) => sel.add("poly:" + i));
    }
    const hechas = w.__hekatanReplicateSelection?.(0, 0, h, n) ?? 0;
    sel.clear();
    try { w.__hekatanRefreshSelection?.(); } catch {}
    try { w.__hekatanRebuild?.(); } catch {}
    decir(`${hechas} copia${hechas === 1 ? "" : "s"} cada ${h} m. Ya hay ${n + 1} plantas.`);
  });
  // ── GRILLA AUXILIAR: dejar puesto dónde referenciarse a esa altura ────────
  //
  // «Ubico una altura y allí no hay con qué referenciarse.» La rejilla del plano
  // de trabajo sube contigo, pero es UNA: en cuanto te mueves, esa cota se queda
  // sin nada. Este botón DEJA una grilla auxiliar a la cota escrita, como los
  // niveles de ETABS o los planos de referencia de Revit: se quedan puestos, se
  // ven tenues, y el OSNAP engancha a sus cruces aunque estés dibujando en otra.
  const bGrillaAux = document.createElement("button");
  bGrillaAux.type = "button";
  bGrillaAux.textContent = "▦+";
  bGrillaAux.title = "Deja una grilla auxiliar a la cota Z escrita (nivel de referencia). " +
    "Vuelve a pulsarlo con la misma cota para quitarla.";
  bGrillaAux.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 12px inherit;";
  bGrillaAux.addEventListener("click", () => {
    const d = parseFloat(inCotaZ.value);
    const plano = planoActual(), L = letraDist();
    if (!isFinite(d)) { decir(`Escribe primero la distancia ${L}.`); return; }
    const w = window as any;
    const lista = w.__hekatanGrillaAux?.(d, plano);
    if (!lista) { decir("El visor todavia no expone las grillas auxiliares."); return; }
    const quitada = !lista.some((g: any) => g.plano === plano && Math.abs(g.d - d) < 1e-6);
    decir(quitada
      ? `Quitada la grilla auxiliar ${plano.toUpperCase()} de ${L} = ${d.toFixed(2)} m. Quedan ${lista.length}.`
      : `Grilla auxiliar ${plano.toUpperCase()} en ${L} = ${d.toFixed(2)} m. Ya puedes engancharte ahi desde cualquier vista.`);
  });
  // ── El SLIDER: colocar la grilla arrastrando, no escribiendo ──────────────
  //
  // Jorge (16-sep-2026): «lo que me interesa es cómo posiciono la grilla auxiliar,
  // o con un slider puede ser». Escribir 3.20 exige saber ya la cota; arrastrando se
  // BUSCA: la rejilla se mueve con el dedo y se ve dónde cae respecto de lo dibujado,
  // que es como se coloca un plano de referencia en Revit.
  //
  // Rango −10 … 50 m con paso 0.1, el mismo del mando «Cota Z» del panel, para que los
  // dos digan lo mismo. La casilla y el slider van atados: mueves uno y el otro sigue.
  const slider = document.createElement("input");
  // Rango −5 … 25 m y paso 0.25: con −10 … 50 en 104 px cada píxel valía 0.58 m
  // (medido: 6 px de arrastre = 4 m), o sea imposible de colocar. Con esto un píxel
  // son 29 cm, las flechas del teclado dan el paso fino y la casilla, el valor exacto.
  slider.type = "range"; slider.min = "-5"; slider.max = "25"; slider.step = "0.25"; slider.value = "0";
  slider.id = "hk-dist-slider";
  slider.title = "Arrastra para colocar el plano (y su grilla) a ojo; la casilla de al lado dice la distancia exacta";
  slider.style.cssText = "width:104px;height:26px;cursor:ew-resize;accent-color:#22d3ee;";
  const aplicarDist = (d: number, avisar = true) => {
    if (!isFinite(d)) return;
    const st = (window as any).__hekatanCadState?.get?.();
    const plano = planoActual();
    if (st) (st as any)[claveDist()] = d;
    hooks.setPlane(plano);
    inCotaZ.value = String(+d.toFixed(2));
    slider.value = String(d);
    if (avisar) decir(`Plano ${plano.toUpperCase()} en ${letraDist()} = ${d.toFixed(2)} m` +
      ` — ▦+ deja la grilla puesta ahi.`);
  };
  // `input` = mientras se arrastra: la rejilla se mueve en vivo, que es el punto.
  slider.addEventListener("input", () => aplicarDist(parseFloat(slider.value), false));
  slider.addEventListener("change", () => aplicarDist(parseFloat(slider.value)));
  (window as any).__hekatanPonerDistanciaPlano = (d: number) => aplicarDist(d);
  // Y el tercer camino, el de AutoCAD: COGER la grilla con el cursor y moverla
  // paralela a sí misma, con el recuadro de distancia junto al cursor. La casilla es
  // para el valor exacto, el slider para buscar a ojo, y esto para colocarla mirando
  // el modelo. Los tres escriben la misma distancia.
  const bMover = document.createElement("button");
  bMover.type = "button";
  bMover.textContent = "↕";
  bMover.title = "Mover la grilla con el cursor: se desplaza paralela a si misma; " +
    "teclea la distancia y Enter para dejarla exacta, Esc cancela";
  bMover.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 13px inherit;";
  bMover.addEventListener("click", () => {
    const w = window as any;
    if (!w.__hekatanMoverGrilla) { decir("El visor todavia no permite mover la grilla."); return; }
    w.__hekatanMoverGrilla(true);
    decir(`Mueve el raton: la grilla ${planoActual().toUpperCase()} se desplaza paralela. ` +
      "Teclea la distancia + Enter para dejarla exacta · clic la fija · Esc cancela.");
  });
  // REPLICAR la grilla auxiliar, como se replica una planta: n grillas separadas la
  // altura de las casillas de al lado. Jorge: «si está en XY debe replicarse en las
  // posiciones Z; si tengo XZ se desplaza en Y, y YZ en X». Es la misma regla del
  // plano de trabajo: la grilla solo se mueve en su normal.
  const bRepGrid = document.createElement("button");
  bRepGrid.type = "button";
  bRepGrid.textContent = "▦×";
  bRepGrid.title = "Replicar la grilla auxiliar: deja n grillas NUEVAS aparte, separadas la " +
    "altura de las casillas de la derecha (alt x n), SIN mover la tuya. En planta van en Z, " +
    "en alzado frontal en Y y en el lateral en X.";
  bRepGrid.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 12px inherit;";
  bRepGrid.addEventListener("click", () => {
    const d0 = parseFloat(inCotaZ.value);
    const paso = parseFloat(inAltPiso.value);
    const n = Math.max(1, Math.round(parseFloat(inNumPisos.value) || 1));
    const plano = planoActual(), L = letraDist();
    if (!isFinite(d0) || !isFinite(paso) || paso === 0) {
      decir("Para replicar la grilla hacen falta la distancia y una separacion distinta de 0."); return;
    }
    const w = window as any;
    if (!w.__hekatanGrillaAux) { decir("El visor todavia no expone las grillas auxiliares."); return; }
    // ⚠️ DESPLAZAR y REPLICAR no son lo mismo (Jorge, 16-sep): desplazar mueve la
    // grilla de trabajo y no crea nada; replicar deja grillas auxiliares APARTE y no
    // toca la tuya. Por eso se empieza en k = 1: la distancia donde estás ya la
    // ocupa el plano de trabajo, y si la duplicásemos «replicar» acabaría pareciendo
    // un desplazamiento.
    let ultima: any[] = [];
    const puestas: string[] = [];
    for (let k = 1; k <= n; k++) {
      const d = +(d0 + paso * k).toFixed(4);
      const yaEsta = ((w.__hekatanPlanosAux ?? []) as Array<{ plano: string; d: number }>)
        .some((g) => g.plano === plano && Math.abs(g.d - d) < 1e-6);
      if (yaEsta) continue;                       // no duplicar la que ya estuviera
      ultima = w.__hekatanGrillaAux(d, plano);
      puestas.push(d.toFixed(2));
    }
    decir(puestas.length
      ? `${puestas.length} grillas ${plano.toUpperCase()} en ${L} = ${puestas.join(" · ")} m. ` +
        `Hay ${ultima.length} grillas auxiliares puestas.`
      : "Esas grillas ya estaban puestas.");
  });
  // ── ORIGEN LOCAL (SCU), lo del dibujo de los dos trípodes ─────────────────
  // «Cuando hacía un vector había una posición donde dentro había otra coordenada;
  // es lo que quiero para dibujar en 3D». Pones el origen en un punto del modelo y
  // a partir de ahí «0,0,0» es ESE punto: se acabó sumar a mano en cada coordenada.
  const bSCU = document.createElement("button");
  bSCU.type = "button";
  bSCU.textContent = "⌖";
  bSCU.title = "Origen local (SCU): toca un punto y las coordenadas que teclees seran " +
    "relativas a EL. Vuelve a pulsarlo para regresar al origen global (0,0,0).";
  bSCU.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 13px inherit;";
  const pintarSCU = () => {
    const o = ((window as any).__hekatanSCU ?? [0, 0, 0]) as number[];
    const puesto = o.some((v) => Math.abs(v) > 1e-9);
    bSCU.style.background = puesto ? "#0e7490" : "transparent";
    bSCU.style.borderColor = puesto ? "#22d3ee" : "#1e3a4a";
    bSCU.style.color = puesto ? "#ecfeff" : "#cdeefb";
  };
  bSCU.addEventListener("click", () => {
    const w = window as any;
    if (!w.__hekatanElegirSCU) { decir("El visor todavia no expone el origen local."); return; }
    const o = (w.__hekatanSCU ?? [0, 0, 0]) as number[];
    if (o.some((v: number) => Math.abs(v) > 1e-9)) {
      w.__hekatanQuitarSCU(); pintarSCU();
      decir("Origen local quitado: vuelves al origen global (0,0,0).");
      return;
    }
    w.__hekatanElegirSCU(true);
    decir("Toca el punto donde quieres el origen local (el OSNAP engancha a un nudo o a un cruce). " +
      "Desde ahi, 0,0,0 sera ese punto.");
  });
  setInterval(pintarSCU, 700);
  // Quitar TODAS las grillas auxiliares: ponerlas era fácil y recogerlas no, había que
  // acertar la cota exacta de cada una.
  const bLimpiar = document.createElement("button");
  bLimpiar.type = "button";
  bLimpiar.textContent = "▦−";
  bLimpiar.title = "Quitar TODAS las grillas auxiliares puestas (Ctrl+Z las devuelve)";
  bLimpiar.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 12px inherit;";
  bLimpiar.addEventListener("click", () => {
    const n = (window as any).__hekatanLimpiarGrillasAux?.() ?? 0;
    decir(n ? `Quitadas ${n} grillas auxiliares. Ctrl+Z las devuelve.` : "No hay grillas auxiliares puestas.");
  });
  // ── IR A LA VISTA DE ESA GRILLA ───────────────────────────────────────────
  //
  // Jorge (16-sep-2026): «debe haber algo para ir a la vista en esa posición de esa
  // grilla, en el plano tanto XY, XZ o YZ». Es el doble clic sobre una planta en
  // ETABS: te pone mirando ESE plano, de frente y centrado en él.
  //
  // Los botones de vista (Planta/Frente/Lado) miran desde el origen; este mira desde
  // la DISTANCIA del plano de trabajo, que es donde está lo que acabas de dibujar.
  const bVerPlano = document.createElement("button");
  bVerPlano.type = "button";
  bVerPlano.textContent = "◎";
  bVerPlano.title = "Ir a la vista de ESTE plano: te pone mirándolo de frente y centrado " +
    "en su distancia (planta si es XY, alzado si es XZ, lateral si es YZ)";
  bVerPlano.style.cssText = "height:26px;padding:0 8px;cursor:pointer;background:transparent;" +
    "border:1px solid #1e3a4a;border-radius:6px;color:#cdeefb;font:600 13px inherit;";
  bVerPlano.addEventListener("click", () => {
    const plano = planoActual(), L = letraDist();
    const st = (window as any).__hekatanCadState?.get?.();
    const d = Number(st?.[claveDist()] ?? 0);
    const v: any = document.querySelector("#viewer");
    const ctx = v?.__ctx;
    if (!ctx) { decir("El visor no responde."); return; }
    const O = ((window as any).__hekatanSCU ?? [0, 0, 0]) as number[];
    // centro del plano: su distancia en la normal, y el origen local en las otras dos
    const centro = plano === "xy" ? [O[0], O[1], d]
                 : plano === "xz" ? [O[0], d, O[2]]
                 : [d, O[1], O[2]];
    // a qué distancia se pone la cámara: el tamaño de la rejilla, para que se vea entera
    const tam = Number((window as any).__hekatanGridConfig?.gridSize ?? 20);
    const L0 = Math.max(12, tam * 1.35);
    const cam = ctx.camera;
    const pos = plano === "xy" ? [centro[0], centro[1] - 0.001, centro[2] + L0]
              : plano === "xz" ? [centro[0], centro[1] - L0, centro[2]]
              : [centro[0] + L0, centro[1], centro[2]];
    cam.position.set(pos[0], pos[1], pos[2]);
    cam.up.set(0, 0, 1);                       // Z arriba, como todo el programa
    ctx.controls?.target?.set(centro[0], centro[1], centro[2]);
    cam.lookAt(centro[0], centro[1], centro[2]);
    if ((cam as any).isOrthographicCamera) { (cam as any).zoom = 1; cam.updateProjectionMatrix(); }
    ctx.controls?.update?.(); ctx.render?.();
    const nombre = plano === "xy" ? "PLANTA" : plano === "xz" ? "ALZADO FRONTAL" : "ALZADO LATERAL";
    decir(`Vista de ${nombre} en ${L} = ${d.toFixed(2)} m — mirando el plano de frente.`);
  });
  filaZ.append(inCotaZ, slider, bMover, bGrillaAux, bRepGrid, bLimpiar, bVerPlano, bSCU, bSubir, inAltPiso, document.createTextNode("×"), inNumPisos);
  const rotZ = document.createElement("div");
  rotZ.id = "hk-dist-rotulo";
  rotZ.textContent = "Cota Z · ▦+ grilla · subir alt × nº";
  rotZ.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  cajaZ.append(filaZ, rotZ);
  cajaZ.dataset.pest = "rejilla";
  filaB.appendChild(cajaZ);
  const sepZ = document.createElement("div");
  sepZ.style.cssText = "width:1px;background:#1e3a4a;margin:4px 0;";
  sepZ.dataset.pest = "rejilla"; sepZ.dataset.disp = "block";
  filaB.appendChild(sepZ);

  // Cuanta carga pone el boton Carga. Sin la casilla habria que adivinar el
  // valor o irse al panel: la carga es un NUMERO, no un gesto.
  const cajaC = document.createElement("div");
  cajaC.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;";
  const inC = document.createElement("input");
  inC.type = "text"; inC.value = "-10";
  inC.title = "Carga vertical por nudo, en kN. Negativa = hacia abajo.";
  inC.style.cssText = "width:58px;height:26px;background:#0a1622;border:1px solid #1e3a4a;" +
    "border-radius:5px;color:#cdeefb;font:12px Consolas,monospace;text-align:center;outline:none;";
  inC.addEventListener("change", () => {
    const v = parseFloat(inC.value);
    if (isFinite(v)) cargaVert.kN = v; else inC.value = String(cargaVert.kN);
  });
  const rotC = document.createElement("div");
  rotC.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  const inQ = document.createElement("input");
  inQ.type = "text"; inQ.value = "-5";
  inQ.title = "Carga distribuida vertical por barra, en kN/m (botón «Carga q»). Negativa = hacia abajo.";
  inQ.style.cssText = inC.style.cssText;
  inQ.addEventListener("change", () => { const v = parseFloat(inQ.value); if (isFinite(v)) cargaVert.kNm = v; else inQ.value = String(cargaVert.kNm); });
  const filaC = document.createElement("div"); filaC.style.cssText = "display:flex;gap:4px;align-items:center;";
  filaC.append(inC, inQ);
  rotC.textContent = "Carga  kN · kN/m";
  cajaC.append(filaC, rotC);
  cajaC.dataset.pest = "dibujo";
  filaB.appendChild(cajaC);

  // ── Vistas ────────────────────────────────────────────────────────────────
  const cajaV = document.createElement("div");
  cajaV.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;";
  const filaV = document.createElement("div");
  filaV.style.cssText = "display:flex;gap:3px;";
  // ⚠️ Cada vista DICE su plano. La vista no es solo mirar desde otro lado: cambia
  // el PLANO DE TRABAJO, o sea dónde cae el clic. Con los botones diciendo solo
  // «Planta / Frente / Lado» hay que acordarse de cuál es cuál, y la barra de estado
  // («Plano XZ») queda lejos del botón que lo acaba de cambiar.
  const VISTAS: Array<[string, string, string, string, () => void]> = [
    ["⬇", "Planta", "XY", "1", () => { hooks.setPlane("xy"); hooks.setView("plan"); }],
    ["➡", "Frente", "XZ", "2", () => { hooks.setPlane("xz"); hooks.setView("elevX"); }],
    ["⬅", "Lado",   "YZ", "3", () => { hooks.setPlane("yz"); hooks.setView("elevY"); }],
    // ⚠️ El 3D tambien devuelve el plano de trabajo a la PLANTA. Sin esto, quien
    // pasaba por «Frente» o «Lado» se quedaba con la rejilla de pie y los clics
    // cayendo en un plano vertical para siempre: no habia forma de volver desde
    // el ribbon, y lo que se veia era una rejilla vertical flotando.
    ["🧊", "3D",     "XY", "4", () => { hooks.setPlane("xy"); hooks.setView("iso"); try { (window as any).__hekatanOcultarRef?.(); } catch {} }],
  ];
  const DONDE_CAE: Record<string, string> = {
    XY: "el clic cae en la planta, a la cota Z de la casilla",
    XZ: "el clic cae en el alzado frontal, en Y = 0",
    YZ: "el clic cae en el alzado lateral, en X = 0",
  };
  for (const [ic, nom, plano, tecla, fn] of VISTAS) {
    const b = document.createElement("button");
    b.type = "button";
    b.title = `${nom} — plano ${plano}: ${DONDE_CAE[plano]} (${tecla})`;
    b.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;" +
      "gap:0;width:46px;height:48px;cursor:pointer;background:transparent;border:1px solid transparent;" +
      "border-radius:7px;color:#cbd5e1;font-family:inherit;";
    b.innerHTML = `<span style="font-size:14px;line-height:1">${ic}</span>` +
      `<span style="font-size:10px;line-height:1.15">${nom}</span>` +
      `<span style="font-size:9px;line-height:1.1;color:#22d3ee;letter-spacing:.5px">${plano}</span>` +
      `<span style="font-size:8px;opacity:.5;line-height:1">${tecla}</span>`;
    b.addEventListener("click", () => { fn(); decir(`Vista ${nom} — plano ${plano}: ${DONDE_CAE[plano]}.`); });
    b.addEventListener("mouseenter", () => { b.style.background = "rgba(34,211,238,.13)"; });
    b.addEventListener("mouseleave", () => { b.style.background = "transparent"; });
    filaV.appendChild(b);
  }
  // ── SNAP · ORTO · OSNAP también aquí (13-sep-2026): viven en la barra de abajo, que
  // en el vídeo queda fuera del cuadro y a la vista se le escapa; en la cinta se ven y
  // se pulsan. Llaman a los MISMOS conmutadores (F9 / F8 / F3) y se repintan solos.
  const W2: any = window as any;
  const filaP = document.createElement("div");
  filaP.style.cssText = "display:flex;gap:3px;";
  const conmutadores: Array<{ el: HTMLButtonElement; on: () => boolean }> = [];
  const mkConm = (txt: string, tecla: string, tip: string, on: () => boolean, toggle: () => void) => {
    const b = document.createElement("button"); b.type = "button"; b.title = tip;
    b.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;width:44px;height:44px;cursor:pointer;" +
      "background:transparent;border:1px solid transparent;border-radius:7px;color:#cbd5e1;font-family:inherit;";
    b.innerHTML = `<span style="font-size:10px;line-height:1.1;font-weight:700;letter-spacing:.3px">${txt}</span><span style="font-size:8px;opacity:.55;line-height:1">${tecla}</span>`;
    b.addEventListener("click", () => { try { toggle(); } catch {} pintarConm(); decir(`${txt} ${on() ? "ON" : "OFF"} — ${tip}`); });
    conmutadores.push({ el: b, on }); filaP.appendChild(b);
  };
  const pintarConm = () => { for (const c of conmutadores) { const v = c.on(); c.el.style.background = v ? "rgba(34,211,238,.22)" : "transparent"; c.el.style.borderColor = v ? "#22d3ee" : "transparent"; c.el.style.color = v ? "#e0fbff" : "#64748b"; } };
  mkConm("SNAP", "F9", "Engancha a los cruces de la rejilla", () => W2.__hekatanSnapEnabled === true, () => W2.__hekatanToggleSnap?.());
  mkConm("ORTO", "F8", "Solo horizontales y verticales", () => !!W2.__hekatanOrthoMode, () => W2.__hekatanToggleOrtho?.());
  mkConm("OSNAP", "F3", "Referencias a objetos: extremo, medio, nudo, intersección…", () => W2.__hekatanOsnapOn !== false, () => W2.__hekatanToggleOsnap?.());
  setInterval(pintarConm, 600); setTimeout(pintarConm, 300);
  const rotV = document.createElement("div");
  rotV.textContent = "Vista · plano de trabajo";
  rotV.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  cajaV.append(filaV, rotV);
  // En TODAS las pestañas y pegado a la derecha, como la barra de estado de AutoCAD.
  cajaV.dataset.pest = "*"; cajaV.style.marginLeft = "auto";
  const cajaP = document.createElement("div");
  cajaP.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:0 7px;margin-left:auto;";
  const rotP = document.createElement("div");
  rotP.textContent = "Precisión";
  rotP.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  cajaP.append(filaP, rotP);
  cajaP.dataset.pest = "*";
  (window as any).__hekatanCintaFijos = () => { filaA.appendChild(cajaV); filaB.appendChild(cajaP); };

  // ── GUÍA dentro del programa (botón ? y F1) ───────────────────────────────
  //
  // Sin esto hay que adivinar: no se sabe por dónde empezar, ni que existen
  // los atajos, ni —lo más importante— que el clic cae SIEMPRE sobre el plano
  // de trabajo. Es la primera pregunta que hace cualquiera y no estaba escrita
  // en ningún sitio de la pantalla.
  const bAyuda = document.createElement("button");
  const guia = document.createElement("div");
  guia.id = "hk-ribbon-guia";
  guia.style.cssText = [
    "position:absolute", "top:120px", "left:50%", "transform:translateX(-50%)",
    "z-index:70", "display:none", "max-width:640px", "max-height:calc(100% - 200px)", "overflow:auto", "padding:16px 22px",
    "background:rgba(10,18,32,.97)", "border:1px solid #22d3ee",
    "border-radius:12px", "box-shadow:0 10px 40px rgba(0,0,0,.6)",
    "color:#cbd5e1", "font:13px/1.65 system-ui,-apple-system,Segoe UI,sans-serif",
  ].join(";") + ";";
  guia.innerHTML = `
    <div id="hk-guia-barra" title="Arrastrame para moverme · doble clic para volver al centro" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2px;cursor:move;user-select:none;touch-action:none">
      <div style="font:600 16px inherit;color:#22d3ee">⠿ Cómo usar · cuatro pasos</div>
      <button type="button" id="hk-guia-cerrar" title="Cerrar (Esc)" style="width:24px;height:24px;border-radius:50%;border:1px solid #1e3a4a;background:transparent;color:#94a3b8;cursor:pointer;font:600 13px inherit">✕</button>
    </div>
    <div style="color:#64748b;font-size:11px;margin-bottom:10px">Pasa el ratón por un botón de arriba y te dice cómo se usa · ? o F1 abren y cierran esto</div>
    <ol style="margin:0 0 10px 18px;padding:0;line-height:1.7">
      <li><b>Rejilla</b>: vanos en X, en Y y pisos en las casillas de arriba → <b>🏗 Rejilla</b> (o <b>REJ</b>). Ejes, niveles y columnas.</li>
      <li><b>Dibuja</b>: teclea <b>L</b>, <b>COL</b>, <b>MU</b> o <b>LO</b> y Enter; luego clic, o coordenadas
        <code style="color:#22d3ee">6,0,3</code> · <code style="color:#22d3ee">@6,0,0</code>. <b>C</b> cierra, <b>Esc</b> termina.</li>
      <li><b>Apoyos y cargas</b>: <b>AP</b> y <b>CG</b>, clic en los nudos. Sin apoyos no hay solución.</li>
      <li><b>Calcula</b>: en el panel izquierdo, <b>Analyze</b> enseña deformada, momentos y cortantes.</li>
    </ol>
    <div id="hk-guia-pista" style="min-height:18px;margin:0 0 6px;padding:4px 8px;border-left:2px solid #22d3ee;background:rgba(34,211,238,.06);color:#cbd5e1;font-size:12px"></div>
    <details id="hk-guia-detalle" style="margin-top:6px">
      <summary style="cursor:pointer;color:#22d3ee;font-size:12px">Ver todo: teclas, coordenadas, selección</summary>
      <div style="margin-top:8px">
        <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">La ventana de comandos</div>
        <p style="margin:0 0 8px">Dice qué espera: <i style="color:#22d3ee">Precise primer punto</i>, luego
          <i style="color:#22d3ee">punto siguiente o [Cerrar/desHacer]</i>. <b>U</b> quita el último punto.
          Enter con la caja vacía termina el comando o repite el último. Espacio vale por Enter. <b>F2</b> despliega el historial.</p>
        <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">Coordenadas</div>
        <p style="margin:0 0 8px"><code style="color:#22d3ee">6,0,3</code> punto exacto ·
          <code style="color:#22d3ee">@6,0,0</code> desde el último · <code style="color:#22d3ee">@6&lt;45</code> distancia y ángulo ·
          una cifra sola = distancia, altura (columna, muro) o radio.</p>
        <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">Dónde cae el clic</div>
        <p style="margin:0 0 8px">Sobre el plano de trabajo de la barra de abajo. <b>1</b> planta (a la cota Z), <b>2</b> frente,
          <b>3</b> lado, <b>4</b> 3D para mirar. Los números cambian la vista solo sin comando en curso.</p>
        <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">Seleccionar y modificar</div>
        <p style="margin:0 0 8px">Sin comando, clic en una esquina, mueve el ratón y clic en la otra: <b>izquierda→derecha</b> ventana (entero dentro), <b>derecha→izquierda</b> captura (basta tocar). Arrastrar con el botón apretado gira la cámara.
          Con selección: <b>M</b> mueve, <b>CO</b> copia (punto base y segundo punto), <b>Supr</b> borra, <b>Ctrl+Z</b> / <b>Ctrl+Y</b>.</p>
        <table style="border-collapse:collapse;font-size:12px">
          <tr><td style="padding:1px 14px 1px 0"><b>L</b> línea · <b>PL</b> polilínea · <b>REC</b> rectángulo · <b>C</b> círculo · <b>A</b> arco</td>
              <td><b>COL</b> columna · <b>MU</b> muro · <b>LO</b> losa</td></tr>
          <tr><td style="padding:1px 14px 1px 0"><b>S</b> seleccionar · <b>M</b> mover · <b>CO</b> copiar · <b>E</b> borrar</td>
              <td><b>O</b> desfase · <b>TR</b> recortar · <b>EX</b> alargar</td></tr>
          <tr><td style="padding:1px 14px 1px 0"><b>AP</b> apoyo · <b>CG</b> carga · <b>REJ</b> rejilla</td>
              <td>OSNAP: extremo · medio · nudo · <b>centro</b> · intersección</td></tr>
          <tr><td style="padding:1px 14px 1px 0"><b>F3</b> OSNAP · <b>F8</b> ORTO · <b>F9</b> SNAP · <b>F10</b> POLAR</td>
              <td><b>F2</b> historial · <b>Esc</b> cancelar · <b>?</b> esta ayuda</td></tr>
        </table>
      </div>
    </details>
    <label style="display:flex;align-items:center;gap:6px;margin-top:12px;color:#64748b;font-size:11px;cursor:pointer">
      <input type="checkbox" id="hk-guia-nomas" style="margin:0"> No volver a mostrar al abrir un archivo nuevo
    </label>`;

  // ── La guía se ARRASTRA por su barra de título ────────────────────────────
  //
  // Tapaba justo el centro del lienzo y lo único que se podía hacer era cerrarla:
  // o la leías o dibujabas, pero no las dos cosas. Ahora se coge del título y se
  // deja donde estorbe menos; doble clic en la barra la devuelve al centro. Dónde
  // la dejaste se recuerda, que si no hay que recolocarla en cada arranque.
  const LS_POS = "hk_guia_pos";
  const colocar = (x: number, y: number) => {
    // ⚠️ El tope se mide contra la VENTANA, no contra el padre. El padre de la guía
    // mide 332 px de alto (es la caja del ribbon, no el lienzo): midiendo con él,
    // la guía no bajaba de ahí — se arrastraba en horizontal y en vertical se
    // quedaba clavada. `x` e `y` llegan en coordenadas del padre; se pasan a
    // pantalla, se topan, y se vuelven.
    const hr = (guia.offsetParent as HTMLElement | null)?.getBoundingClientRect();
    const ox = hr?.left ?? 0, oy = hr?.top ?? 0;
    const w = guia.offsetWidth || 640;
    const vx = Math.max(8, Math.min(window.innerWidth - w - 8, x + ox));
    // abajo se deja llegar hasta el borde menos la barra de título: siempre queda
    // de dónde cogerla para traerla de vuelta
    const vy = Math.max(8, Math.min(window.innerHeight - 40, y + oy));
    guia.style.left = `${Math.round(vx - ox)}px`;
    guia.style.top = `${Math.round(vy - oy)}px`;
    guia.style.transform = "none";
    // marca para que la piel del CAD deje de imponerle su `top` (lo clava con
    // !important, que gana al estilo en línea)
    guia.setAttribute("data-movida", "1");
  };
  const centrar = () => {
    guia.style.left = "50%";
    guia.style.top = "120px";
    guia.style.transform = "translateX(-50%)";
    guia.removeAttribute("data-movida");   // vuelve a mandar la piel del CAD
    try { localStorage.removeItem(LS_POS); } catch {}
  };
  const recordarPos = () => {
    try { localStorage.setItem(LS_POS, JSON.stringify(
      { x: parseFloat(guia.style.left) || 0, y: parseFloat(guia.style.top) || 0 })); } catch {}
  };
  const restaurarPos = () => {
    try {
      const g = localStorage.getItem(LS_POS);
      if (!g) return;
      const { x, y } = JSON.parse(g);
      if (isFinite(x) && isFinite(y)) colocar(x, y);
    } catch {}
  };
  {
    const barraG = guia.querySelector("#hk-guia-barra") as HTMLElement | null;
    let cogida: { dx: number; dy: number } | null = null;
    barraG?.addEventListener("pointerdown", (e: PointerEvent) => {
      if ((e.target as HTMLElement)?.closest("button")) return;   // la ✕ es la ✕
      const r = guia.getBoundingClientRect();
      cogida = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      try { barraG.setPointerCapture(e.pointerId); } catch {}
      e.preventDefault();
    });
    barraG?.addEventListener("pointermove", (e: PointerEvent) => {
      if (!cogida) return;
      const hr = (guia.offsetParent as HTMLElement | null)?.getBoundingClientRect();
      colocar(e.clientX - cogida.dx - (hr?.left ?? 0), e.clientY - cogida.dy - (hr?.top ?? 0));
    });
    const soltar = (e: PointerEvent) => {
      if (!cogida) return;
      cogida = null;
      try { barraG?.releasePointerCapture(e.pointerId); } catch {}
      recordarPos();
    };
    barraG?.addEventListener("pointerup", soltar);
    barraG?.addEventListener("pointercancel", soltar);
    barraG?.addEventListener("dblclick", centrar);
    (window as any).__hekatanGuiaMover = (x: number, y: number) => { colocar(x, y); recordarPos(); };
    (window as any).__hekatanGuiaCentrar = centrar;
  }

  const verGuia = (v?: boolean) => {
    const on = v ?? (guia.style.display === "none");
    guia.style.display = on ? "block" : "none";
    if (on) restaurarPos();
  };
  guia.querySelector("#hk-guia-cerrar")?.addEventListener("click", () => verGuia(false));
  const chkNoMas = guia.querySelector("#hk-guia-nomas") as HTMLInputElement | null;
  try { if (chkNoMas) chkNoMas.checked = localStorage.getItem("hk_guia_nuevo") === "0"; } catch {}
  chkNoMas?.addEventListener("change", () => {
    try { localStorage.setItem("hk_guia_nuevo", chkNoMas.checked ? "0" : "1"); } catch {}
  });
  // Un clic en cualquier otro sitio la cierra. Sin esto la guia se abre sola
  // encima del lienzo y SE COME LOS CLICS: se intenta dibujar, no pasa nada, y
  // no hay forma evidente de quitarla. Lo cazó el test del panel viejo, que se
  // quedaba en 0 nudos.
  window.addEventListener("pointerdown", (e) => {
    if (guia.style.display === "none") return;
    if (guia.contains(e.target as Node) || bAyuda.contains(e.target as Node)) return;
    verGuia(false);
  }, true);

  bAyuda.type = "button";
  bAyuda.textContent = "?";
  bAyuda.title = "Cómo dibujar aquí (F1)";
  bAyuda.style.cssText = "width:26px;height:26px;margin-left:6px;cursor:pointer;" +
    "background:transparent;border:1px solid #22d3ee;border-radius:50%;color:#22d3ee;" +
    "font:600 13px inherit;align-self:center;";
  // ── AYUDA SEÑALANDO: «toca el botón del que quieres ayuda» ────────────────
  //
  // Jorge (16-sep-2026): «un botón help, pero este help preguntará "toca el botón
  // o ventana de la que quieres asistencia", y debe tener un cuadro animado de un
  // ejemplo de cómo usar, así para cada botón».
  //
  // Es el «¿Qué es esto?» de toda la vida (Shift+F1 de Office, el ? de AutoCAD),
  // con la diferencia que importa: además del texto, se VE el ejemplo. La frase
  // «clic en dos esquinas opuestas» ya estaba en el tooltip y aun así no dice
  // cuántos clics ni en qué orden; el ejemplo animado sí.
  //
  // El clic en modo ayuda NO ejecuta el botón (se captura antes): si no, pedir
  // ayuda de «Borrar» borraría algo.
  let modoAyuda = false;
  let pararAnim: (() => void) | null = null;
  const porBoton = () => {                       // botón del DOM -> ficha de la cinta
    const m = new Map<HTMLElement, typeof GRUPOS[number]["items"][number]>();
    for (const g of GRUPOS) for (const h of g.items) { const b = botones.get(h.id); if (b) m.set(b, h); }
    return m;
  };
  const cuadro = document.createElement("div");
  cuadro.id = "hk-ayuda-anim";
  // Debajo de la cinta (dos filas + barra de estado ≈ 185 px): el cuadro explica un
  // botón, así que tapárselo al usuario mientras lo mira es justo lo que no debe pasar.
  cuadro.style.cssText = [
    "position:absolute", "top:196px", "left:50%", "transform:translateX(-50%)",
    "z-index:80", "display:none", "width:390px", "padding:14px 16px 12px",
    "background:rgba(10,18,32,.98)", "border:1px solid #22d3ee", "border-radius:12px",
    "box-shadow:0 10px 40px rgba(0,0,0,.6)", "color:#cbd5e1",
    "font:13px/1.55 system-ui,-apple-system,Segoe UI,sans-serif",
  ].join(";") + ";";
  host.appendChild(cuadro);
  const cerrarAyuda = () => {
    pararAnim?.(); pararAnim = null;
    cuadro.style.display = "none";
  };
  const salirModoAyuda = () => {
    modoAyuda = false;
    (window as any).__hekatanAyudaModo = false;
    bAyuda.style.background = "transparent"; bAyuda.style.color = "#22d3ee";
    document.body.style.cursor = "";
    refrescar();
  };
  const abrirAyuda = (clave: string, titulo: string, texto: string, idTool?: string) => {
    pararAnim?.();
    cuadro.innerHTML = "";
    const cab = document.createElement("div");
    cab.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:8px";
    cab.innerHTML = `<div style="font:600 15px inherit;color:#22d3ee">${titulo}</div>`;
    const x = document.createElement("button");
    x.type = "button"; x.textContent = "✕"; x.title = "Cerrar (Esc)";
    x.style.cssText = "width:24px;height:24px;border-radius:50%;border:1px solid #1e3a4a;" +
      "background:transparent;color:#94a3b8;cursor:pointer;font:600 13px inherit";
    x.addEventListener("click", cerrarAyuda);
    cab.appendChild(x);
    const lienzo = document.createElement("div");
    const pieN = document.createElement("div");
    pieN.style.cssText = "margin-top:8px;color:#64748b;font-size:11px";
    pieN.textContent = "El ejemplo se repite solo · Esc cierra";
    cuadro.append(cab, lienzo, pieN);
    if (idTool) {
      const probar = document.createElement("button");
      probar.type = "button"; probar.textContent = "▶ Probar ahora";
      probar.style.cssText = "margin-top:9px;width:100%;height:28px;cursor:pointer;background:#0e7490;" +
        "border:1px solid #22d3ee;border-radius:6px;color:#ecfeff;font:600 12px inherit";
      probar.addEventListener("click", () => {
        cerrarAyuda(); salirModoAyuda();
        const h = GRUPOS.flatMap((g) => g.items).find((q) => q.id === idTool);
        if (h) usar(h);
      });
      cuadro.appendChild(probar);
    }
    cuadro.style.display = "block";
    pararAnim = reproducir(lienzo, DEMOS[clave] ?? DEMO_GENERICA(texto));
  };
  // Se captura ANTES que nadie (fase de captura) para que el botón no se ejecute.
  window.addEventListener("pointerdown", (e) => {
    if (!modoAyuda) return;
    const t = e.target as HTMLElement | null;
    if (!t || cuadro.contains(t)) return;
    e.preventDefault(); e.stopPropagation();
    // tocar el propio «?» en modo ayuda explica la ayuda (y no la apaga a medias)
    if (bAyuda.contains(t)) { abrirAyuda("ayuda", "? Ayuda — toca un botón", bAyuda.title); return; }
    const btn = t.closest("button") as HTMLElement | null;
    const ficha = btn ? porBoton().get(btn) : undefined;
    if (ficha) { abrirAyuda(ficha.id, `${ficha.icono} ${ficha.nombre} (${ficha.tecla})`, ficha.ayuda, ficha.id); return; }
    // los mandos de la cinta que no son herramientas: se reconocen por su title
    const cerca = (t.closest("input,button") as HTMLElement | null) ?? t;
    const tit = (cerca.getAttribute("title") || "").toLowerCase();
    if (tit.includes("grilla auxiliar") && tit.includes("replicar"))
      return void abrirAyuda("repGrid", "▦×  Replicar la grilla auxiliar", cerca.title);
    if (tit.includes("grilla auxiliar")) return void abrirAyuda("grillaAux", "▦+  Grilla auxiliar", cerca.title);
    if (tit.includes("paralela a si misma")) return void abrirAyuda("moverGrilla", "↕  Mover la grilla con el cursor", cerca.title);
    if (tit.includes("origen local")) return void abrirAyuda("scu", "⌖  Origen local (SCU)", cerca.title);
    if (tit.includes("distancia del plano")) return void abrirAyuda("cotaZ", "Distancia del plano de trabajo", cerca.title);
    if (tit.includes("cota z")) return void abrirAyuda("cotaZ", "Cota Z — a qué altura dibujas", cerca.title);
    if (tit.includes("pisos de arriba")) return void abrirAyuda("subir", "⇈ Subir — replicar plantas", cerca.title);
    // los conmutadores y las vistas, que tampoco son herramientas
    const rot0 = (cerca.textContent || "").replace(/\s+/g, " ").trim();
    if (/^SNAP/.test(rot0)) return void abrirAyuda("snap", "SNAP (F9) — caer en los cruces", cerca.title || "");
    if (rot0 === "▴" || tit.includes("plegar")) return void abrirAyuda("plegar", "▴ Plegar la cinta", cerca.title || "");
    if (rot0 === "▾" || tit.includes("añadir a la cinta")) return void abrirAyuda("extras", "▾ Añadir a la cinta", cerca.title || "");
    if (/^ORTO/.test(rot0)) return void abrirAyuda("orto", "ORTO (F8) — recto en X o en Y", cerca.title || "");
    if (/^OSNAP/.test(rot0)) return void abrirAyuda("osnap", "OSNAP (F3) — referencias a objetos", cerca.title || "");
    if (/(Planta|Frente|Lado|3D)/.test(rot0) && /(XY|XZ|YZ)/.test(rot0))
      return void abrirAyuda("vista", `${rot0} — vista y plano de trabajo`, cerca.title || "");
    if (tit.includes("rejilla") || (cerca.textContent || "").includes("Rejilla"))
      return void abrirAyuda("rejilla", "🏗 Rejilla — ejes, niveles y columnas", cerca.title || "");
    const rotulo = (cerca.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48);
    abrirAyuda("_nada", rotulo || "Esta parte de la pantalla",
      cerca.title || "Todavía no hay un ejemplo animado de esto. Dime cuál falta y lo añado.");
  }, true);
  // ⚠️ Parar el `pointerdown` NO basta: `click` es otro evento y llega igual, así
  // que el botón se ejecutaba de todos modos (medido: pedir ayuda de ▦+ creaba el
  // nivel). Hay que tapar también el click —y el mouseup/mousedown que usan algunos
  // mandos— mientras dure el modo.
  for (const tipo of ["click", "mousedown", "mouseup"] as const)
    window.addEventListener(tipo, (e) => {
      if (!modoAyuda) return;
      const t = e.target as HTMLElement | null;
      if (!t || cuadro.contains(t) || bAyuda.contains(t)) return;
      e.preventDefault(); e.stopPropagation();
    }, true);
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (cuadro.style.display !== "none") cerrarAyuda();
    if (modoAyuda) salirModoAyuda();
  });

  bAyuda.addEventListener("click", () => {
    // Si el cuadro está abierto es porque acaban de PEDIR ayuda del propio «?»
    // (su ficha se abre en el pointerdown): apagarlo aquí la cerraría de inmediato
    // y parecería que el botón no responde.
    if (modoAyuda && cuadro.style.display === "block") return;
    if (modoAyuda) { cerrarAyuda(); salirModoAyuda(); return; }
    modoAyuda = true;
    (window as any).__hekatanAyudaModo = true;
    bAyuda.style.background = "#0e7490"; bAyuda.style.color = "#ecfeff";
    document.body.style.cursor = "help";
    pistaActiva = true;
    const e2 = document.getElementById("hk-ribbon-estado");
    if (e2) e2.innerHTML = '<b style="color:#22d3ee">AYUDA</b> ' +
      '<span>— toca el botón o la ventana de la que quieres asistencia (Esc para salir)</span>';
  });
  bAyuda.title = "Ayuda: toca un botón y te enseño un ejemplo animado de cómo se usa (F1: los cuatro pasos)";
  // Al PRINCIPIO, no al final: el extremo derecho de la cinta es justo lo que tapa el
  // panel de propiedades, y la ayuda es lo último que puede permitirse no responder.
  bAyuda.style.marginLeft = "2px"; bAyuda.style.marginRight = "6px";
  bAyuda.style.flex = "0 0 auto";
  filaT.appendChild(bAyuda);

  // ── Barra de estado: qué se espera AHORA (el Dynamic Prompt) ──────────────
  const estado = document.createElement("div");
  estado.id = "hk-ribbon-estado";
  estado.style.cssText = [
    "position:absolute", "top:74px", "left:50%", "transform:translateX(-50%)",
    "z-index:59", "padding:3px 12px", "border-radius:6px",
    "background:rgba(15,23,42,.9)", "border:1px solid #1e3a4a",
    "color:#94a3b8", "font:11px Consolas,monospace", "pointer-events:none",
    "white-space:nowrap",
  ].join(";") + ";";
  estado.textContent = "Teclea un comando y Enter — L línea · PL polilínea · REC rectángulo · COL columna · REJ rejilla · ? ayuda";

  // ── PLEGAR el ribbon ──────────────────────────────────────────────────────
  //
  // Jorge: *"ese menu que esta arriba debe tener algo para minimizarlo y solo
  // quede un boton ya que me ocupa la pantalla, y en ejemplos preferible que
  // quede minimizado"*.
  //
  // La barra ocupa dos filas y se come el tercio de arriba del lienzo. Eso está
  // bien cuando se viene a DIBUJAR —es lo único de la pantalla que dice qué
  // hacer— y estorba cuando se viene a MIRAR un ejemplo ya resuelto, que es el
  // caso de casi todo el catálogo.
  //
  // Así que: se pliega a un solo botón, y el estado se recuerda. El defecto lo
  // decide `plegadoPorDefecto`, que el workspace pone a `true` cuando lo que se
  // ha cargado es un ejemplo (ver `addCadRibbon(..., { plegadoPorDefecto })`).
  const LS = "hekatan.ribbon.plegado";
  const bPlegar = document.createElement("button");
  bPlegar.type = "button";
  bPlegar.id = "hk-ribbon-plegar";
  bPlegar.title = "Plegar la barra (Ctrl+`)";
  bPlegar.textContent = "▴";
  bPlegar.style.cssText = "width:26px;height:26px;margin-left:4px;cursor:pointer;" +
    "background:transparent;border:1px solid #475569;border-radius:6px;color:#94a3b8;" +
    "font:600 13px inherit;align-self:center;";
  filaT.appendChild(bPlegar);
  // «▾ Añadir a la cinta»: todos los botones y mandos de los paneles, a elegir (Jorge,
  // 13-sep-2026: «todo ese menú son acceso rápido»). Ver ribbonExtras.ts.
  montarExtras({
    filaBoton: filaT, filaGrupo: filaB, barra,
    paneles: () => [["Panel", document.getElementById("hk-pane-host")], ["Settings", document.getElementById("settings")]],
    decir,
  });

  // ── PESTAÑAS ──────────────────────────────────────────────────────────────
  // Como las fichas de la cinta de AutoCAD: un clic y la cinta enseña otras dos filas,
  // sin desplegables que abrir y cerrar. Vistas y precisión quedan fijas a la derecha.
  (window as any).__hekatanCintaFijos?.();
  const PESTANAS: Array<[Pest, string, string]> = [
    ["dibujo", "✏ Dibujo", "dibujar, estructura, apoyos, cargas y modificar"],
    ["rejilla", "🏗 Rejilla y planos", "rejilla de ejes, cota del plano, grillas auxiliares y subir pisos"],
    ["areas", "▦ Áreas", "rellenar celdas, cúpula (revolución), piel (barrido), chaflanes"],
    ["resultados", "📊 Resultados", "deformada, axil, cortante, momento, desplazamientos, reacciones, 2D"],
    ["ifc", "🏛 IFC y cortes", "importar un IFC, copiar sus líneas y caras, cortes X/Y/Z"],
  ];
  const tabs = new Map<Pest, HTMLButtonElement>();
  let pestActual: Pest = "dibujo";
  const verPestana = (p: Pest) => {
    pestActual = p;
    for (const el of barra.querySelectorAll<HTMLElement>("[data-pest]")) {
      const v = el.dataset.pest;
      el.style.display = v === "*" || v === p ? (el.dataset.disp || "flex") : "none";
    }
    for (const [q, b] of tabs) {
      const on = q === p;
      b.style.background = on ? "#0e7490" : "transparent";
      b.style.color = on ? "#ecfeff" : "#94a3b8";
      b.style.borderColor = on ? "#22d3ee" : "transparent";
    }
    refrescar();
  };
  for (const [p, nom, ayuda] of PESTANAS) {
    const b = document.createElement("button");
    b.type = "button"; b.id = `hk-ribbon-tab-${p}`; b.textContent = nom;
    b.title = `${nom.replace(/^\S+\s/, "")}: ${ayuda}`;
    b.style.cssText = "height:22px;padding:0 10px;cursor:pointer;background:transparent;border:1px solid transparent;" +
      "border-radius:6px;color:#94a3b8;font:600 11px system-ui,-apple-system,Segoe UI,sans-serif;white-space:nowrap;";
    b.addEventListener("click", () => { verPestana(p); decir(`Pestaña ${nom.replace(/^\S+\s/, "")}: ${ayuda}.`); });
    b.addEventListener("mouseenter", () => { if (pestActual !== p) b.style.background = "rgba(34,211,238,.13)"; });
    b.addEventListener("mouseleave", () => { if (pestActual !== p) b.style.background = "transparent"; });
    tabs.set(p, b);
    filaT.insertBefore(b, bAyuda);
  }
  const hueco = document.createElement("div"); hueco.style.flex = "1";
  filaT.insertBefore(hueco, bAyuda);
  verPestana("dibujo");

  // El botón que queda cuando está plegada. Va en el MISMO sitio que la barra,
  // para que abrir y cerrar no mueva nada de lo que hay debajo.
  const bAbrir = document.createElement("button");
  bAbrir.type = "button";
  bAbrir.id = "hk-ribbon-abrir";
  bAbrir.title = "Abrir la barra de dibujo (Ctrl+`)";
  bAbrir.textContent = "✏ Dibujar";
  bAbrir.style.cssText = [
    "position:absolute", "top:8px", "left:50%", "transform:translateX(-50%)",
    "z-index:60", "display:none", "cursor:pointer",
    "padding:5px 12px", "border-radius:10px",
    "background:rgba(15,23,42,.94)", "border:1px solid #1e3a4a",
    "color:#cbd5e1", "font:600 12px system-ui,-apple-system,Segoe UI,sans-serif",
    "box-shadow:0 6px 20px rgba(0,0,0,.45)", "backdrop-filter:blur(6px)",
  ].join(";") + ";";

  let plegado = false;
  function plegar(v: boolean, recordar = true) {
    plegado = v;
    barra.style.display = v ? "none" : "flex";
    bAbrir.style.display = v ? "block" : "none";
    // La barra de estado y la guía sólo tienen sentido con la barra abierta:
    // plegado no hay herramienta a la vista a la que se refieran.
    estado.style.display = v ? "none" : "block";
    if (v) verGuia(false);
    if (recordar) { try { localStorage.setItem(LS, v ? "1" : "0"); } catch {} }
  }
  bPlegar.addEventListener("click", () => plegar(true));
  bAbrir.addEventListener("click", () => plegar(false));

  // El workspace cambia de ejemplo por el DESPLEGABLE, sin tocar la URL. Asi
  // que el defecto no puede decidirse una sola vez al montar mirando
  // `?t=`: hay que poder re-decidirlo en cada carga. Esto es lo que llama.
  //   window.__hekatanRibbonDefecto(true)   -> plegada, salvo que el usuario ya
  //                                            haya elegido lo contrario
  (window as any).__hekatanRibbonDefecto = (v: boolean) => {
    try { if (localStorage.getItem(LS) !== null) return; } catch {}
    plegar(!!v, false);
  };
  (window as any).__hekatanRibbonPlegar = (v: boolean) => plegar(!!v);
  // Ctrl+` — el mismo atajo en los dos sentidos, que es como se espera de un
  // panel que se pliega.
  window.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || e.key !== "`") return;
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA)$/.test(t.tagName)) return;
    e.preventDefault();
    plegar(!plegado);
  });


  // El motor selecciona DESPUES de procesar el clic, asi que se mira un
  // instante mas tarde. 120 ms basta y no se nota.
  host.addEventListener("click", (e) => {
    if (!modoAplicar) return;
    const t = e.target as HTMLElement | null;
    if (t && (t.closest("#hk-ribbon") || t.closest("#hk-ribbon-guia"))) return;
    setTimeout(aplicarASeleccion, 120);
  }, true);

  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  host.appendChild(barra);
  host.appendChild(bAbrir);
  host.appendChild(estado);
  host.appendChild(guia);

  // El defecto lo manda quien monta (el workspace: plegada en ejemplos, abierta
  // en el lienzo en blanco). Si el usuario ya eligió alguna vez, MANDA ÉL.
  let inicial = hooks.plegadoPorDefecto ?? false;
  try {
    const g = localStorage.getItem(LS);
    if (g !== null) inicial = g === "1";
  } catch {}
  plegar(inicial, false);
  // Se abre sola la PRIMERA vez y nunca mas: quien entra por primera vez no
  // sabe ni que existe la tecla ?, y quien ya la leyo no quiere volver a
  // cerrarla en cada carga.
  //
  // ⚠️ Pero NO si la barra arranca plegada. La guia es una tarjeta grande que
  // tapa el lienzo entero, y con la barra plegada ni siquiera se ve a que se
  // refiere: se entra a mirar un ejemplo ya resuelto y lo primero que aparece
  // es un panel de como dibujar, encima del modelo. Eso ya hizo dar por roto un
  // ejemplo que estaba perfecto (`guerra-ej1`: el PNG salia vacio y era la guia
  // tapando el visor).
  try {
    // Un modelo que llega por ENLACE (?heks= / ?m=) es para MIRARLO, no para
    // dibujar: la guía de «cuatro pasos» tapaba la bóveda en el enlace compartido.
    const porEnlace = /[?&](heks|m)=/.test(window.location.search);
    if (!plegado && !porEnlace && !localStorage.getItem("hk_guia_vista")) {
      verGuia(true);
      localStorage.setItem("hk_guia_vista", "1");
    }
  } catch { /* sin localStorage: no se abre sola */ }
  refrescar();

  // ── Teclas globales del ribbon ─────────────────────────────────────────────
  // Las LETRAS ya no actúan solas: se acumulan en la ventana de comandos y
  // manda el Enter (L, PL, REC, COL…), como en AutoCAD. Lo de «una letra sola
  // es el comando» se comía las coordenadas: al teclear «4,0,6» el 4 cambiaba
  // la vista, y el foco de la caja hacía que las teclas de vista no entraran
  // nunca (medido el 8-sep-2026 grabando el vídeo 2 de School: «411», «4l»).
  // Los dígitos 1-4 cambian la vista SOLO sin herramienta y con la caja vacía;
  // con una herramienta activa, un dígito es el principio de una coordenada.
  const CMD = "hk3-cmd-input";
  const enCampo = (e: EventTarget | null): boolean => {
    const n = e as HTMLElement | null;
    if (!n) return false;
    if (n.id === CMD || n.id === "hk-dyn-input") return (n as HTMLInputElement).value.trim().length > 0;
    return n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT"
        || n.isContentEditable;
  };
  const limpiarCmd = () => {
    for (const id of [CMD, "hk-dyn-input"]) {
      const i = document.getElementById(id) as HTMLInputElement | null;
      if (i) i.value = "";
    }
    const g = document.getElementById("hk3-cmd-ghost");
    if (g) g.innerHTML = "";
  };
  window.addEventListener("keydown", (e) => {
    if (e.key === "F1") { e.preventDefault(); verGuia(); return; }
    if (e.key === "Escape" && guia.style.display !== "none") {
      e.preventDefault(); verGuia(false); return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey || enCampo(e.target)) return;
    const k = e.key;
    const v = ["1", "2", "3", "4"].indexOf(k);
    if (v >= 0) {
      const t = hooks.getTool();
      const dibujando = t && t !== "select" && t !== "none";
      if (dibujando) return;                       // un dígito es una coordenada
      // …y también cuando un COMANDO está preguntando algo (REPLICAR pide el Δ, los
      // puntos y las copias con la herramienta en «select»). Sin esto, el primer
      // carácter de «2,0,20» cambiaba de vista y BORRABA el cuadro: llegaba «,0,20».
      // El guardia `enCampo` no basta porque en el keydown del primer carácter el
      // cuadro todavía está vacío.
      if ((window as any).__hekatanCadEsperaRespuesta?.()) return;
      // ⚠️ Y tampoco mientras se está COLOCANDO la grilla con el cursor: ahí los
      // números son la distancia que se teclea, no vistas. Medido: al teclear «3»
      // para poner la grilla a 3 m, la cinta lo leía como «vista Lado YZ» y las
      // grillas acababan en el plano lateral.
      if ((window as any).__hekatanMoviendoGrilla) return;
      e.preventDefault(); VISTAS[v][4](); decir(`Vista ${VISTAS[v][1]} — plano ${VISTAS[v][2]}`);
      setTimeout(limpiarCmd, 0); return;
    }
    // ── A S D F: axial, cortante, momento y deformada ─────────────────────
    // Idea del cuaderno Napkin (picobloc): las cuatro salidas que se miran al
    // revisar un modelo, a una tecla, sin ir al desplegable. Van con los MISMOS
    // guardias que las vistas 1-4: si el foco está en un campo, o un comando está
    // preguntando, la letra es texto y no un atajo — en esta app la «a» tecleada
    // en el cuadro de órdenes es el ARCO de AutoCAD.
    const DIAGRAMAS: Record<string, [string, string]> = {
      a: ["normals", "Axil"],
      s: ["shearsY", "Cortante 2-2"],
      d: ["bendingsZ", "Momento 3-3"],
    };
    const kk = e.key.toLowerCase();
    if (kk in DIAGRAMAS || kk === "f") {
      const st = (window as any).__hekatanSettings?.();
      if (!st) return;
      e.preventDefault();
      if (kk === "f") {
        // la deformada no es un diagrama de barra: es el modelo desplazado
        if (st.deformedShape) st.deformedShape.val = !st.deformedShape.rawVal;
        if (st.frameResults) st.frameResults.val = "none";
        decir(`Deformada ${st.deformedShape?.rawVal ? "ON" : "OFF"}`);
      } else {
        const [val, nom] = DIAGRAMAS[kk];
        if (st.frameResults) {
          const yaEsta = st.frameResults.rawVal === val;
          st.frameResults.val = yaEsta ? "none" : val;
          decir(yaEsta ? "Diagrama apagado" : `Diagrama: ${nom}`);
        }
      }
      setTimeout(limpiarCmd, 0);
      return;
    }
    if (e.key === "Escape") { hooks.finish?.(); decir("Dibujo cerrado."); }
  }, true);

  (window as any).__hekatanRibbon = {
    guia: verGuia,
    modo: () => modoAplicar,
    aplicar: aplicarASeleccion,
    cargaKN: (v?: number) => { if (v !== undefined) { cargaVert.kN = v; inC.value = String(v); }
                               return cargaVert.kN; },
    guiaVisible: () => guia.style.display !== "none",
    usar: (id: string) => {
      for (const g of GRUPOS) for (const h of g.items) if (h.id === id) usar(h);
    },
    grid: lanzarGrid,
    vista: (i: number) => { const v = VISTAS[i]; if (v) { v[4](); decir(`Vista ${v[1]} — plano ${v[2]}`); } },
    marcar: (tool: string) => { if (tool !== "select" || modoAplicar) { modoAplicar = null; (window as any).__hekatanBloquearVentana = false; } pintarActivo(); },
    estado: () => estado.textContent,
    herramientas: () => [...botones.keys()],
    pestana: (p?: Pest) => { if (p) verPestana(p); return pestActual; },
  };
  pintarActivo();
  return barra;
}
