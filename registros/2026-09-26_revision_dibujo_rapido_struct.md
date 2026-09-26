# Revisión: dibujo rápido en Hekatan Struct (26-sep-2026)
✅ `l ␣ 0,0 ␣ 6,0 ␣ 6,4 ␣ 0,4 ␣ Enter` dibuja (4 nudos, 3 tramos). `rec ␣ 10,0 ␣ 15,3` dibuja. 0 errores JS.
✅ Panel visto en PNG (cli/shots/ctl_ribbon, frames 08 y 14).
❌ `cli/ctl_ribbon.mjs` 8/14: prueba vieja (teclea `l`,`p`,`k` sin espacio; la letra ahora va al cuadro de órdenes y solo el ESPACIO activa).
❌ Marcador de punto de referencia no aparece en la prueba.
❌ UI: cinta flotante (~290 px) tapa el lienzo; 3 sitios para la misma herramienta (cinta, lista «Dibujar» derecha, línea de órdenes); panel izquierdo lleno de FEM (Resultados/Tablas) en modo dibujo; `l␣` no cierra polilínea (falta `c`).
⏳ Falta: una caja de SCRIPT multilínea (como Hekatan LISP) que dibuje en vivo; bucles; recuadro de órdenes junto al cursor.

## Prueba fuerte (cli/_bench_dibujo.mjs, clics reales, mismo pórtico de 3 tramos)
| | GPU real (Intel UHD) | Sin GPU (SwiftShader) |
|---|---|---|
| Struct mover ratón | 164 fps · 10 ms | **9.5 fps · 230 ms** |
| LISP (LispCad.js) mover | 159 fps · 10 ms | 32 fps · 64 ms |
✅ Con GPU real Struct = LISP en velocidad (lienzo VACÍO).
❌ PRECISIÓN: mismos 4 clics → LISP [2,3][2,10][18,10][18,3] (limpio, pilares verticales); Struct [-9.673,-11.201][-6.84,0.72][-5.169,-4.946][-4.21,-8.604] (sin forzar a rejilla, pilar torcido). Causa: SNAP/ORTO apagados por defecto en Struct; LISP tiene Forzc+Refent encendidos.
⏳ Falta: probar con un modelo grande cargado (plantilla) y con la aceleración por hardware apagada en el navegador de Jorge.

## Paso 1 hecho (SNAP + ORTO encendidos por defecto) — getCadPanel.ts
✅ Puntos ahora enteros: (-10,-11)(-7,1)(-7,-4.703)(-7,-8.265), 0 errores, 165 fps.
❌ Con ORTO, la coordenada bloqueada NO pasa por el imán (-4.703, -8.265) y el 1er tramo no salió recto: hay que ajustar en drawing.ts (proyección del ORTO después del snap). La vista de la prueba puede no ser Planta: verificar.
✅ Settings › Rejilla: etiquetas aclaradas (Separación = paso del imán; Radio de captura). Los controles de rejilla están repartidos en 4 sitios (Settings/Rejilla, panel derecho Precisión, botones SNAP de cinta y barra, 🏗 Rejilla del CAD).
⏳ Falta: arreglar ORTO+imán; unificar rejilla en un solo sitio.

## ORTO + imán (drawing.ts, rama ORTO): la coordenada a lo largo del eje se redondea al paso
✅ Clics con ruido de ±5 px sobre puntos proyectados (0,0) y (0,4) → salen EXACTOS (0,0,0) y (0,4,0). Antes: -4.703, -8.265.
❌ Clics 3 y 4 del pórtico no registraron: la cámara «plan» de la prueba queda casi de canto (el propio programa avisa) y la cinta flotante tapa la zona de dibujo. Prueba a rehacer con cámara cenital real.
⏳ Sin commit todavía (cambios en getCadPanel.ts, getSettings.ts, drawing.ts).

## Causa real del «pesado»: el encuadre automático mientras se dibuja (main.ts, rebuild)
✅ Cada segmento reconstruía el modelo y `autoFitCamera()` movía la cámara (z 1000 → 250 tras el 2º punto): el punto siguiente caía bajo el panel derecho. Ahora no reencuadra mientras hay herramienta activa y ≥1 punto.
✅ PRUEBA FINAL (cli/_bench_dibujo.mjs, clics con ±5 px de ruido, GPU): pórtico (0,0)(0,4)(6,4)(6,0) EXACTO, 3 tramos, 4 clics, 56-95 ms/clic, ~160 fps, 0 errores.
❌ cli/ctl_dibujar_libre.mjs: 1 fallo («4 de 5 puntos caen bajo un panel»): sus píxeles fijos caen bajo la cinta (290 px). No es de estos cambios; sin verificar contra el commit anterior.
⏳ Sin resolver: la cinta flotante sigue tapando el lienzo (se pliega con ▴ / Ctrl+`); rejilla repartida en 4 sitios; ctl_ribbon.mjs desfasado; sin commit.

## Commit + push + deploy (26-sep-2026)
✅ main: f8e734370 (dibujo rápido) + c6bcb8522 (concreteBeamDesign[Panel].ts que main.ts ya importaba pero NO estaban en git: main no compilaba de una copia limpia). Push a hekatan-struct/main.
✅ Deploy con build LIMPIO (worktree de HEAD, sin el WIP ITW de otra sesión) + copia sobre gh-pages sin borrar m/ → 87bb81337. Chunk publicado idéntico al build (cmp). Público: snap=true, orto=true, menú Diseño, título SEO, pórtico exacto (0,0)(0,4)(6,4)(6,0), 0 pageerror (cli/_verif_publico.mjs).
✅ SEO del workspace/index.html RESTAURADO: los 7 deploys del 25-sep lo habían perdido (twitter:card=0); se tomó de a32dfc0b7.
⏳ Sin commitear (de otras sesiones): menuDiseno.ts (guarda de tests), itwBenchmarks/exampleRegistry/runExampleStandalone (ITW 4.1), tests/lib/bundle.mjs, e2k 9-itw.
