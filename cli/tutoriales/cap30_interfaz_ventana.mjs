/**
 * Capítulo 30 — LA INTERFAZ (1): la ventana, los menús de arriba y la cinta. Lo que se nombra SE ENMARCA.
 *
 * SE GRABA CONTRA EL DEPLOY PÚBLICO (HK_ORIGEN=https://giorgioburbanelli89.github.io), no contra el
 * bundle local: el 19-sep-2026 la rama local iba por detrás y la v1 salió SIN los menús «▶ Análisis»
 * y «📐 Diseño» (Jorge: «el vídeo no tiene los nuevos menús… indicar que están en desarrollo, esta
 * ventana sufrirá actualizaciones constantes»). También faltaban el «?» de ayuda, Tutorial, plegar
 * la cinta y el acceso rápido («nunca hablaste del menú ayuda… ni los otros botones»).
 *
 * Los grupos de la cinta se buscan POR EL TEXTO del primer y del último botón, no por índice: la
 * cinta cambia (otra sesión la está pasando a pestañas) y un índice fijo enmarcaría otra cosa.
 * Guiones: cli/guiones/cap30_es.txt y cap30_en.txt, UNA línea por paso, en este orden.
 * El motor graba 640 de 720 px: la ventana de comandos y la barra de estado quedan fuera.
 */
export const titulo = "Hekatan Struct · la interfaz (1) · la ventana, los menús y la cinta";
// ⚠️ La ventana PRINCIPAL es `workspace/` SIN `?t=`: lienzo vacío y, a la derecha, «¿Con qué vas a trabajar?».
// La 2.ª toma arrancaba con `ejemplo = "plantillas"` (una plantilla ya montada) y Jorge lo corrigió: «esa no
// es la ventana principal». (La misma corrección ya estaba apuntada en cap1_principal.mjs: no la leí.)
// ⏸ NO REGRABAR TODAVÍA (Jorge, 19-sep): hay que esperar a su menú nuevo; él avisa.
export const ruta = "workspace/";

const rectId = (a, id) => a.pag.evaluate((id) => { const b = document.getElementById(id); if (!b) return null; const q = b.getBoundingClientRect(); return q.width ? { x: q.left, y: q.top, w: q.width, h: q.height } : null; }, id);
/** rectángulo de la cinta desde el botón cuyo texto empieza por `de` hasta el que empieza por `hasta` */
const grupo = (a, de, hasta) => a.pag.evaluate((de, hasta) => {
  const limpio = (b) => (b.textContent || "").replace(/[^\p{L}\p{N}?▴▾↕▦+×−◎⌖ ]/gu, "").trim();
  const bs = [...document.querySelectorAll("#hk-ribbon button")].filter((b) => b.getBoundingClientRect().width > 0);
  bs.forEach((b, i) => { b.dataset.vd = String(i); });
  const i0 = bs.findIndex((b) => limpio(b).startsWith(de) || (b.id && b.id === de));
  const i1 = bs.findIndex((b) => limpio(b).startsWith(hasta) || (b.id && b.id === hasta));
  if (i0 < 0 || i1 < 0) return { falta: (i0 < 0 ? de : "") + " " + (i1 < 0 ? hasta : "") };
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const b of bs.slice(Math.min(i0, i1), Math.max(i0, i1) + 1)) {
    const q = b.getBoundingClientRect();
    x0 = Math.min(x0, q.left); y0 = Math.min(y0, q.top); x1 = Math.max(x1, q.right); y1 = Math.max(y1, q.bottom);
  }
  x1 = Math.min(x1, window.innerWidth - 4);        // lo que se sale de la ventana no se enmarca
  return { x: x0 - 3, y: y0 - 3, w: x1 - x0 + 6, h: y1 - y0 + 6, medio: Math.round((i0 + i1) / 2), fuera: x0 > window.innerWidth };
}, de, hasta);
const pasoCinta = (rotulo, de, hasta, nota) => ({
  rotulo,
  hacer: async (a) => {
    const r = await grupo(a, de, hasta);
    if (!r || r.falta || r.fuera) { console.log("  x cinta: no se ve «" + de + " … " + hasta + "» " + JSON.stringify(r)); await a.general(); await a.quieto(8, 280); return; }
    await a.cercaSel("#hk-ribbon button[data-vd=\"" + r.medio + "\"]");   // primer plano: se leen los nombres
    await a.marcarR(r, nota);
    await a.quieto(10, 280);
    await a.sinCuadro();
  },
});
/** abre un menú de la barra de arriba, enmarca lo que despliega y lo cierra.
 *  ⚠️ 1.ª toma (19-sep): para cerrar el menú hice clic en el visor y eso ARRANCÓ una selección por
 *  ventana (clic-clic): quedó un rectángulo verde siguiendo al cursor y el cuadro del menú siguiente
 *  se fue a ese rectángulo. Ahora el desplegable se busca POR SU TEXTO («Análisis —», «Diseño —») y
 *  se cierra con Escape o volviendo a pulsar su botón; en el visor no se toca nada. */
const pasoMenu = (rotulo, id, cabecera, nota) => ({
  rotulo,
  hacer: async (a) => {
    await a.general();
    const b = await rectId(a, id);
    if (!b) { console.log("  x no hay menú #" + id); await a.quieto(8, 280); return; }
    await a.marcarR(b, ""); await a.quieto(3, 260); await a.sinCuadro();
    await a.pulsarR(b, 900);
    const desplegado = () => a.pag.evaluate((cab) => {
      let mejor = null;
      for (const e of document.querySelectorAll("body div")) {
        const t = (e.innerText || "").trim(); if (!t.startsWith(cab)) continue;
        const q = e.getBoundingClientRect(); if (q.width < 120 || q.height < 30) continue;
        if (!mejor || q.width * q.height < mejor.w * mejor.h) mejor = { x: q.left, y: q.top, w: q.width, h: q.height };   // el MÁS PEQUEÑO que empieza por la cabecera
      }
      return mejor;
    }, cabecera);
    const d = await desplegado();
    if (d) { await a.cercaSel("#" + id); await a.marcarR(d, nota); } else { console.log("  x no vi el desplegable «" + cabecera + "»"); await a.marcarR(b, nota); }
    await a.quieto(13, 280);
    await a.sinCuadro();
    await a.pag.keyboard.press("Escape"); await a.quieto(1, 300);
    if (await desplegado()) { const b2 = await rectId(a, id); if (b2) await a.pag.mouse.click(b2.x + b2.w / 2, b2.y + b2.h / 2); await a.quieto(1, 300); }
    if (await desplegado()) console.log("  x el menú «" + cabecera + "» sigue abierto");
    await a.general(); await a.quieto(2, 260);
  },
});
const R = (x, y, w, h) => ({ x, y, w, h });

export const pasos = [
  { rotulo: "0 · Portada", hacer: async (a) => { await a.portada("Hekatan Struct", "La interfaz · 1 · La ventana, los menús y la cinta", 12); } },
  { rotulo: "1 · La ventana principal (en desarrollo)", hacer: async (a) => {
      await a.general();
      await a.marcarR(R(312, 560, 190, 60), "VERSIÓN DEL 19-SEP-2026 · Esta ventana está EN DESARROLLO y se actualiza constantemente: los menús pueden cambiar de sitio.");
      await a.quieto(14, 280); await a.sinCuadro(); } },
  { rotulo: "2 · ¿Con qué vas a trabajar?", hacer: async (a) => {
      await a.marcar("carpeta", "Con qué vas a trabajar", "Todo empieza aquí: se elige con qué se trabaja.");
      await a.quieto(9, 280); await a.sinCuadro(); } },
  { rotulo: "3 · Las cuatro entradas", hacer: async (a) => {
      for (const [t, nota] of [["Agente IA", "AGENTE IA: se le pide una estructura y la modela."],
                               ["Archivo existente", "ARCHIVO EXISTENTE: un .heks guardado, o un modelo de ETABS, SAP2000 o SAFE."],
                               ["IFC", "DIBUJAR SOBRE UN IFC: el modelo BIM de fondo, y se calca encima."],
                               ["Ejemplos", "EJEMPLOS: el catálogo por categorías, ya resueltos."]]) {
        if (await a.marcar("boton", t, nota)) { await a.quieto(6, 280); await a.sinCuadro(); }
      } } },
  { rotulo: "4 · Nuevo modelo: las plantillas", hacer: async (a) => {
      await a.marcar("carpeta", "Nuevo modelo", "NUEVO MODELO: se parte de una plantilla y se ajusta.");
      await a.quieto(6, 280); await a.sinCuadro();
      if (await a.marcar("boton", "Lienzo en blanco", "O el LIENZO EN BLANCO, para dibujar a mano.")) { await a.quieto(6, 280); await a.sinCuadro(); } } },
  { rotulo: "5 · Barra de arriba: archivo", hacer: async (a) => {
      await a.general();
      await a.marcarR(R(6, 1, 166, 28), "Archivo: nuevo, abrir .heks, guardar, guardar como, deshacer y rehacer.");
      await a.quieto(9, 280); await a.sinCuadro(); } },
  { rotulo: "6 · Menú principal", hacer: async (a) => {
      const b = await rectId(a, "hk-home-btn");
      await a.marcarR(b || R(247, 3, 72, 25), "MENÚ: vuelve al menú principal.");
      await a.quieto(8, 280); await a.sinCuadro(); } },
  pasoMenu("7 · Menú Análisis (nuevo, en desarrollo)", "hk-analisis-btn", "Análisis —", "ANÁLISIS (nuevo · en desarrollo): analizar en estático, modal + animar, y parar la animación."),
  pasoMenu("8 · Menú Diseño (nuevo, en desarrollo)", "hk-diseno-btn", "Diseño —", "DISEÑO (nuevo · en desarrollo): diseño de losa como SAFE, por franjas o por elementos finitos, ACI 318-19."),
  { rotulo: "9 · Tutorial y tema", hacer: async (a) => {
      await a.general();
      const t = await rectId(a, "hk-cad-tutorial");
      await a.marcarR(t ? R(t.x - 4, t.y - 3, 160, t.h + 6) : R(994, 1, 158, 28), "TUTORIAL: vídeos cortos de cómo se usa, uno por paso. Al lado, el tema claro u oscuro.");
      await a.quieto(9, 280); await a.sinCuadro(); } },
  { rotulo: "10 · Abajo: la ventana de comandos y la barra de estado", hacer: async (a) => {
      // la vista general se recorta a 640 px y estas dos zonas no salían nunca: primer plano de ABAJO
      const c = await a.pag.evaluate(() => {
        const cajas = ["hk3-cmd-hist", "hk3-cmd-wrap", "hk3-cmd-prompt", "hk3-cmd-input"].map((id) => document.getElementById(id)).filter(Boolean).map((e) => e.getBoundingClientRect()).filter((q) => q.width > 0);
        if (!cajas.length) return null;
        const x0 = Math.min(...cajas.map((q) => q.left)), y0 = Math.min(...cajas.map((q) => q.top)), x1 = Math.max(...cajas.map((q) => q.right)), y1 = Math.max(...cajas.map((q) => q.bottom));
        return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      });
      await a.cercaAbajo(c ? c.x + c.w / 2 : 640);
      if (c) { await a.marcarR(c, "VENTANA DE COMANDOS: se dibuja escribiendo, como en AutoCAD. L línea, PL polilínea, REC rectángulo, COL columna… y las coordenadas."); await a.quieto(10, 280); await a.sinCuadro(); }
      else console.log("  x no vi la ventana de comandos");
      const e = await rectId(a, "hk-statusbar");
      if (e) { await a.cercaAbajo(900); await a.marcarR(R(Math.max(e.x, 420), e.y, Math.min(e.w, 860), e.h), "BARRA DE ESTADO: coordenadas del cursor, plano activo, y SNAP, ORTO, POLAR y OSNAP."); await a.quieto(8, 280); await a.sinCuadro(); }
      await a.general(); } },
  { rotulo: "11 · Se elige una plantilla, y el modelo aparece", hacer: async (a) => {
      await a.general();
      await a.pulsar("Pórtico 3D", 12000);
      await a.general(); await a.quieto(10, 280); } },
  { rotulo: "12 · Izquierda: Settings", hacer: async (a) => {
      await a.marcarR(R(1, 30, 298, 604), "SETTINGS: qué se dibuja (Rejilla, Ver, Datos de entrada) y qué resultado se ve (Resultados, Tablas, Modal, Cortes).");
      await a.quieto(11, 280); await a.sinCuadro(); } },
  { rotulo: "13 · Derecha: el modelo", hacer: async (a) => {
      await a.marcarR(R(961, 31, 318, 603), "EL MODELO: la plantilla y sus parámetros, herramientas, cargas, exportar a ETABS y SAP2000, y unidades.");
      await a.quieto(11, 280); await a.sinCuadro(); } },
  { rotulo: "14 · Centro: el visor y el agente", hacer: async (a) => {
      await a.marcarR(R(336, 78, 590, 540), "EL VISOR: la estructura en 3D, el plano de trabajo y la escala de colores del resultado.");
      await a.quieto(8, 280); await a.sinCuadro();
      const g = await rectId(a, "hk-agente-lanzador");
      if (g) { await a.marcarR(g, "AGENTE IA: se le pide una estructura y la modela."); await a.quieto(7, 280); await a.sinCuadro(); } } },
  { rotulo: "15 · Dibujar abre la cinta; los tiradores pliegan los paneles", hacer: async (a) => {
      const abierta = await a.pag.evaluate(() => { const c = document.getElementById("hk-ribbon"); return !!c && getComputedStyle(c).display !== "none" && c.getBoundingClientRect().height > 20; });
      if (!abierta) {
        await a.marcarSel("#hk-ribbon-abrir", "Dibujar: abre la cinta de herramientas (acceso rápido).");
        await a.quieto(5, 280); await a.sinCuadro();
        await a.pulsarR(await rectId(a, "hk-ribbon-abrir"), 1200);
      }
      await a.general(); await a.quieto(4, 280);
      for (const [id, nota] of [["hk-pane-toggle", "Este tirador pliega el panel: la cinta queda entera a la vista."], ["hk-settings-toggle", "Y este, el de la izquierda."]]) {
        const t = await rectId(a, id);
        if (!t) { console.log("  x no hay tirador " + id); continue; }
        await a.marcarR(t, nota); await a.quieto(4, 280); await a.sinCuadro();
        await a.pulsarR(t, 1100);
      }
      await a.general(); await a.quieto(8, 280); } },
  pasoCinta("16 · Cinta: ayuda", "?", "?", "AYUDA «?»: toca un botón y te enseña un ejemplo animado de cómo se usa. Con F1, los cuatro pasos."),
  pasoCinta("17 · Cinta: dibujo", "Línea", "Cúbica", "DIBUJO: línea, polilínea, rectángulo, círculo, arco, parábola y cúbica. Debajo de cada botón, su atajo."),
  pasoCinta("18 · Cinta: estructura", "Columna", "Barrido", "ESTRUCTURA: columna, muro, losa, revolución y barrido."),
  pasoCinta("19 · Cinta: apoyo y cargas", "Apoyo", "Carga q", "APOYO Y CARGAS: apoyo, carga puntual y carga repartida."),
  pasoCinta("20 · Cinta: vistas y precisión", "Planta", "OSNAP", "VISTAS: planta, frente, lado y 3D (teclas 1 a 4). PRECISIÓN: SNAP, ORTO y OSNAP."),
  pasoCinta("21 · Cinta: plegar y acceso rápido", "hk-ribbon-plegar", "hk-ribbon-mas", "▴ pliega la cinta. ▾ ACCESO RÁPIDO: añade a la cinta cualquier botón o mando de los paneles."),
  pasoCinta("22 · Cinta: modificar", "Anterior", "Auxiliar", "MODIFICAR: anterior y rehacer; seleccionar, mover, copiar, replicar, desfase, recortar, alargar, remodelar, borrar, medir y auxiliar."),
  pasoCinta("23 · Cinta: rejilla, grillas auxiliares y subir", "Rejilla", "Subir", "REJILLA: ejes, niveles y columnas de una vez. Al lado, las grillas auxiliares, y SUBIR: copia lo dibujado a los pisos de arriba."),
  { rotulo: "24 · Cierre: en desarrollo", hacer: async (a) => {
      await a.general();
      await a.marcarR(R(312, 560, 190, 60), "EN DESARROLLO: la cinta pasa a pestañas y llegan más herramientas. Este vídeo se regraba con cada cambio.");
      await a.quieto(12, 280); await a.sinCuadro(); } },
];
