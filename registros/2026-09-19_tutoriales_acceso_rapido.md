# Tutoriales: solo acceso rápido, líneas visibles, sin solapes (19-sep-2026)

Queja de Jorge: los tutoriales usan el Tweakpane de la derecha en vez de la cinta de
acceso rápido; casi no se ven las líneas; hay botones solapados.

Worktree: `hekatan-struct-tutcinta` (rama `tutoriales-cinta`, sale de `integracion-deploy1`,
lo último desplegado). Sparse: sin `validation/`, `ScreenShoot/`, `cli/shots/` (salvo .heks).
node_modules = junctions a `_integ/node_modules`. Dev server propio en :4610.
Reparto con la sesión 0e: la piel (`hekatanCadSkin.ts`, solapes de paneles, DNE/Franjas)
es de 0e; `getCadRibbon.ts` y `elements.ts`, míos.

## 1. Diagnóstico por fotogramas (53 clips publicados, 1 fotograma cada 2 s)

Método: `ffmpeg fps=1/2` de cada `tutoriales/*.mp4` + hoja de contacto por clip, mirada una a una.
(a) = acciones por Tweakpane en vez de la cinta · (b) = líneas que no se ven y POR QUÉ · (c) = solapes.

| clip | (a) Tweakpane | (b) líneas | (c) solapes |
|---|---|---|---|
| warren_00-04 | ✅ cinta | ❌ barras de 1 px blancas; cercha 12 m = 590 px de 1280 (rejilla 30 m, zoom ×3 a mano) | ❌ cota «L = 1.118 m» encima de la entrada dinámica «1.12 m»; marca de agua HEKATAN justo bajo la cercha |
| warren_05 apoyos | ❌ Restraints en el panel de selección (clic en el nudo → panel flotante) | ❌ 1 px | — |
| warren_06-07 cargas | ✅ cinta | ❌ 1 px | — |
| warren_08 resultados | ❌ pliega la cinta y va a Settings › Analyze (Deformada, Frame results, Node results: 5 desplegables) | ❌ 1 px; «Axial Force (diagram)» es colormap, no diagrama | ❌ desplegable de Tweakpane abierto sobre el modelo |
| warren_09-10 | ✅ cinta | ❌ 1 px | — |
| warren_11 guardar | ⚠️ «▾ Añadir a la cinta» (es de la cinta, pero añade un botón que no estaba) | — | ❌ el botón añadido «Guard…» sale recortado en el borde (x 1230-1270), «Mis accesos» desborda la cinta |
| cupula_00-09 | ❌ TODO por el panel derecho: Plano XZ, Precisión › Grid snap, Segmentos arc, Curvas guía, Arco, Medir, Seleccionar, Sectores, Revolución, Empotrar (panel de selección), Limpiar, Chaflán, Losa chaflanes, Parábola, Barrido | ❌ el meridiano R = 5 m mide ~70 px (rejilla 30 m sin zoom); arco cian discontinuo de 1 px | ❌ panel derecho abierto tapa 25 % del lienzo |
| capilla_00-06 | ❌ Plano de trabajo, Precisión, snaps por el panel derecho (capilla_01) | ❌ 1 px blanco sobre la rejilla gris; vista iso lejana | ❌ los dos paneles abiertos en capilla_01 |
| ifc_00-07 | ❌ Importar IFC (panel dcho), Cortes X (Settings izq), Plano YZ, Precisión › Segmentos arc, Arco (panel dcho) | ❌ arco de 1 px sobre el IFC gris; el IFC ocupa 1/3 del ancho | ❌ los dos paneles abiertos a la vez (ifc_02) |
| visor_00-06 | ❌ Cortes X/Y/Z por el Settings izq (slider pos Z + casilla) | ⚠️ el modelo IFC se ve (es sólido), pequeño | ❌ dos paneles abiertos: el modelo queda en 250 px de ancho |
| novedades_00-08 | ❌ Rellenar área, Llenar TODAS por el panel dcho | ❌ celdas de 1 px en iso lejana | ❌ los TRES a la vez: Settings izq + cinta aplastada en el medio (dos filas cortadas) + panel dcho |

Medido con `cli/_cinta_anchos.mjs` en la app publicada (antes):
- La cinta pedía **1238 px** (fila 1) y **1678 px** (fila 2): no cabía ni a 1920. Con `overflow-x:auto`
  los botones de la derecha quedaban ESCONDIDOS (fila con scroll) — a 1280, 21 mandos fuera.
- Panel derecho encima de la cinta: Apoyo, Carga, Planta, Frente… tapados (elementFromPoint).
- «Sobrecarga DNE» y «Franjas» (fixed, top 60) sobre la cabecera del panel derecho → es de 0e.

## 2. App

- ✅ `2d2ed13af` «Articul.» junto a «Empotr.» (los dos apoyos rápidos de ETABS); Empotr./Articul./Carga
  se aplican a TODA la selección ya hecha (ventana sobre la base de la cúpula), como Assign de ETABS.
- ✅ `305e4bdb3` Cinta con **pestañas** (fichas de AutoCAD): ✏ Dibujo · 🏗 Rejilla y planos · ▦ Áreas ·
  📊 Resultados · 🏛 IFC y cortes. Vistas + SNAP/ORTO/OSNAP fijos a la derecha en todas. Filas 1059/973 px
  (hueco 1220 a 1280 con paneles plegados): **0 fuera, 0 tapados, 0 solapes, 0 filas con scroll** a
  1280, 1366 y 1920.
- ✅ `c3dc06133` Resultados: Deformada, ÷2 ×2, Axil, Cortante, Momento, Desplaz., Reacción, Diagrama 2D,
  Barra. Mueven los MISMOS States del panel (sonda `_cinta_resultados_check.mjs`).
- ✅ `c32e53b5c` Áreas: Rellenar, Llenar todas, Chaflanes, Revoluc., Barrido, Guía aux., casillas Tramos /
  Sectores / Chaflán r → escriben en el MISMO mando del panel (su `change`).
- ✅ `4ae0ab87d` IFC y cortes: Importar (pulsa el del panel), Objetos, Copiar lín., Área cara, Corte X/Y/Z
  + posición (las casillas de Settings › Cortes).
- ✅ `0e800aa52` **⛶ Encuadrar** (ZE, Zoom Extensión de AutoCAD): todo lo dibujado al hueco libre (bajo
  la cinta, entre paneles y leyenda). Warren en Frente: de 590 px a 1022 px de ancho.
- ✅ `849b0007a` Barras con **línea gruesa 2.2 px** (LineSegments2) encima de la de 1 px. Solo barras: con
  los bordes de cáscara gruesos el Allianz quedaba blanco (❌ probado y descartado). Coste: dual 6605
  nudos 2.54 vs 2.42 ms/render.
- ❌ Probé bajar los paneles por debajo de la cinta desde getCadRibbon: choca con la piel de 0e
  (ella coloca la cinta entre paneles). Quitado.

- ✅ `b0e990bab` La rueda acerca HACIA EL CURSOR (zoomToCursor, como AutoCAD/ETABS). ❌ Antes: acercaba al
  centro de pantalla y la cercha acababa debajo de la cinta (medido: centro en y = 287, objetivo 436).
  ❌ Probé encuadrar arrastrando con el botón derecho: no mueve la cámara en el alzado.
- ✅ `c192653b5` Casilla «Escala de la deformada» (×1000: 0.3 mm se ven). ❌ Antes «Deformada» APAGABA la
  deformada si ya venía encendida (el guion ahora la señala en vez de pulsarla).
- ✅ Chip «Ver K local · barra N» colgado tras Carga q: la cinta avisa `hk:model-selection` vacío.
- ✅ `06b912362` Guías auxiliares a 2 px (el meridiano de la cúpula era cian de 1 px).
- ✅ `a824d98ff` Borrar puntos renumera apoyos/cargas/masa/muelles/diafragma. ❌ Bug real: borrada la
  cúpula con 16 apoyos, el Allianz nacía con 16 apoyos en nudos cualquiera. ⏳ Lo asignado a BARRAS
  (clave «polilínea:tramo»: carga q, sección…) tampoco se renumera al partir/borrar polilíneas.
- ✅ Enter en una casilla de la cinta suelta el foco (si no, Supr no borraba lo designado).
- ✅ `c0689191e` Cinta en ES/EN (`hk_lang`) y marca de agua «Hekatan Struct» en los clips (cortador).
- ✅ 0e: `a99e78229` + `f9d0f11c4` (piel sin solapes; DNE y Franjas a la barra de arriba).
  `_sonda_solapes.mjs` con mi cinta: **TOTAL 0** a 1280×720 y 1600×900.
- ⚠️ `animacion_modal_es_el_modo`: 3/3 «no-anima» TAMBIÉN en el bundle de `_integ` (sin mis cambios):
  el animador de esta rama no publica `settings.__modoAnim` (la versión nueva del test está en el WIP
  de sin-binario). No es de las líneas gruesas: la gruesa sigue a la fina (`_lineas_anim_check.mjs`).

## 3. Guiones solo con la cinta (sonda rápida `cli/_sonda_capitulo.mjs`, 0 clics en panel)
| tema | capítulo | pasos | sonda |
|---|---|---|---|
| warren | cap19 (`_cercha_comun`) | 15 | ✅ 13 nudos, 23 barras, 0.298 mm = ETABS |
| cúpula + Allianz | cap18 | 12 | ✅ 129 nudos/120 Q4/16 apoyos; 520 nudos/480 Q4 |
| novedades | cap14 | 9 | ✅ 3 celdas → 3 Q4 |
| visor | cap15 | 7 | ✅ (el diálogo de archivos no se graba: se señala Importar y se carga el mismo IFC) |
| capilla | cap16 | — | ⏳ sin rehacer |
| ifc | cap17 | — | ⏳ sin rehacer |

## ⏳ Falta
- Build + `_sonda_solapes.mjs` (0e) y `animacion_modal_es_el_modo` con el bundle.
- Guion warren solo cinta, grabar, revisar, cortar. Luego cúpula.

## 4. Bienvenida (19-sep, tarde) — `bc9a3bbcd`
- ✅ `examples/src/shared/bienvenida.ts`: una sola pantalla al entrar (siempre) con 🧭 Guiado · 🔎 ¿Qué buscas? ·
  🤖 Con IA · 👋 Ya te llamo, lo hago yo; «Abriste: …» con enlace; Recuperar dentro; ✕/Esc; ES/EN; 🙋 en el sitio del 🤖.
- ✅ `destinos.ts` (catálogo único) + buscador Ctrl+K / «/» con tolerancia a faltas.
- ✅ Sonda `cli/_bienvenida_check.mjs` 1920/1366/390: 0 pageerror; tras elegir nada tapa paneles ni cinta.
  Hoja: `cli/shots/bienvenida/hoja_bienvenida.png`.
- ✅ `_sonda_solapes` 1920×1080 y 1366×768: TOTAL 0.
- ❌ 390×844: 28 problemas, PREVIOS: el CSS de móvil de main.ts pone `transform:none !important` al panel
  derecho y apila los dos paneles; no se pliegan con su puerta. ⏳ rediseño móvil (main.ts / piel).
- ⏳ Guiado paso a paso real (recorrido «pórtico» con cursor que espera el clic): hoy 🧭 abre la guía «cuatro pasos».
- ⏳ aiAgent: `abrir_ejemplo`, `guiar`, rechazo del no lineal tras `licenciaNoLineal()` (texto de Jorge).
- ⏳ Warren: toma grabada sin montar (`frames_tut_cap19_cercha_warren/`, 1864 fotogramas). Cúpula/novedades/visor: guion probado, sin grabar.
