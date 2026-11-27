# 26-nov-2026 · Struct: cota editable del segundo punto (como Math Studio móvil / Croquis)

Pedido de Jorge: «al dibujar la línea ya referencia el segundo punto con un valor editable» (2D y 3D iso, PC y celular).

## Lo que hace Math Studio (estudiado)
- `hekatan-mathstudio-web/LispCad.js:721-736`: ENTRADA DINÁMICA dibujada en el lienzo. Sin punto base: coordenada junto al cursor.
  Con base: LONGITUD 3D en el medio de la goma (caja resaltada = la que se escribe) y ÁNGULO (plano XY del SCP) bajo el cursor.
- `LispCad.js:1645-1651`: un número solo = distancia directa en la dirección del cursor EN 3D (con ORTO, la ortogonal);
  `@dx,dy,dz`, `@d<ang`, `x,y,z`. Teclear va a la línea de órdenes (no hay que pinchar la caja). Encadena (L sigue).
- `hekatan-croquis/index.html` (lo del APK): un dedo arrastra la mira (va ARRIBA del dedo, imán a nudos/cuadrícula),
  al soltar pone el punto y encadena; ✔ Fin corta. La goma lleva su longitud. Las COTAS se TOCAN: se abre una hoja
  abajo con calculadora (7 8 9 ÷ … = , Aceptar/Cancelar) y se escribe el valor (Sketcher de Abaqus / cota temporal de Revit).

## Lo que ya tenía Struct
- `#hk-rubber-label` (input, DDE): escribir un número + Enter = punto a esa distancia. PERO: ángulo solo lectura (y de pantalla),
  sin Tab, el encadenado por teclado partía del punto VIEJO, y en el celular no se podía escribir (pointer-events:none, sin hover).

## Bitácora
- ✅ Ángulo EDITABLE: `#hk-rubber-angle` pasa de div a input (drawing.ts:684). Ángulo del PLANO de trabajo (XY desde +X, XZ desde +X hacia +Z, YZ desde +Y), no el de pantalla (en planta/alzado coinciden; en iso es el tecleable).
- ✅ Tab longitud ⇄ ángulo (drawing.ts:1119, 1191-1230); el ángulo tecleado se FIJA (🔒, borde amarillo) y la goma/clic se proyectan en esa recta (drawing.ts:4500). Enter = punto; Esc suelta el ángulo.
- ✅ Encadenado por teclado arreglado (drawing.ts:962): antes «3.5 Enter 2 Enter» sin mover el ratón medía los dos tramos desde el MISMO origen (rubberStart viejo).
- ✅ Celular: caja tocable `#hk-cota-tactil` (drawing.ts:1270-1395): L (m) / ∠ (°) con inputmode=decimal, ✓ y ✕ (40 px), «3,5» con coma = 3.5, «@0,0,3» = columna. Se coloca junto al nudo en curso probando sitios sin botón debajo (elementsFromPoint). Con el dedo la cota del ratón ya no se enfoca (abría el teclado a cada movimiento).
- ✅ Prueba `tests/entrada_dinamica_ui.mjs`: 20/20 (Planta 3.50 m exacto, encadena 2 m, 4 m a 30° = (4.9641, 2); iso 4.25 m exacto Δz=0; celular 3.50 m, 2 m a 90°, @0,0,3, ✕, toque-toque; sin choques; 0 errores).
- ✅ Otros UI: copiar_cota, paralelas, colisiones, cerchas (52), alinear, niveles, cargas_deformada, unir_porticos, galpon_parametrico, cubierta_zapatas: todos OK.
- ❌ 1.er intento del test de choques: medía rects de botones RECORTADOS por overflow (Tweakpane) → falsos choques; ahora hit-test real.
- ❌ clic-clic del test fallaba: los puntos caían fuera de pantalla tras el reencuadre (no era el código).
- ⚠️ `npm test` completo: 1561/1712 — las 151 FALLAS son del entorno (RAM: «fatal error: out of memory», esbuild «service is no longer running»; otro agente renderiza manim). Repetidos sueltos: paz-6-3, k-local-barra, itw-seis, mesa-torsion-fuerzas, placa-auricchio → todos OK.
- ✅ Build (con `newBlank.ts` de OTRA sesión —modal del lienzo, sin commit— cambiado a HEAD solo durante el build y restaurado, md5 igual) → gh-pages 0ceafd632, main 0551f2e34. Chunk público = local (cmp IDÉNTICO). El SEO del workspace ya no estaba en gh-pages (el script avisa; el index publicado es el del build, solo cambian los hashes).
- ✅ Test contra el DEPLOY PÚBLICO: 20/20, 0 errores.
- ⏳ APK de Math Studio móvil: copia Struct de /c/hkpub_struct (gh-pages) en copia_web.sh → hay que reconstruirlo para que lleve la caja tocable.
- ⏳ Disco C: estuvo en 0.14 GB (libere caché de Edge y perfiles viejos de puppeteer).

## 27-nov · Jorge: tras la columna «6 m» el cursor quedaba suelto (solo coordenadas «-5.00,-3.»)
- ❌ Causa: el atajo global que lleva la 1.ª cifra a la cota (foco FUERA de la cota) no marcaba «tecleado»: «6» + Enter
  se leía como «Enter sin teclear» = TERMINAR (y herramienta → select). Con dos cifras sí iba (la 2.ª pasaba por la cota).
  Clic y teclado con el foco en la cota ya encadenaban (comprobado en local y en el público).
- ✅ Arreglo (drawing.ts, keydown global): `rubberUserEditing = true` al recoger la cifra.
- ✅ LÍNEA ≠ POLILÍNEA (Jorge: «es diferente a polilínea», como AutoCAD): cada tramo de LÍNEA es una entidad suelta
  ([a,b],[b,c]… nudos compartidos) y la cadena sigue con [c] abierto (`partirTramoLinea`, `cadenaLinea`). Cerrar une con
  el 1.er nudo de la cadena; desHacer quita el último tramo; prompt [Cerrar/desHacer] también tras un tramo tecleado.
  La cota de paralelas no mueve el nudo de una cadena ya hecha. POLILÍNEA sigue siendo una sola entidad.
- ✅ Test: columna por clic → 3 posiciones del cursor sin clic (goma desde el tope, cota cambia) → «6» + Enter con el foco
  fuera → viga de 6 m → 2 barras sueltas con el tope compartido → sigue la goma → Esc termina. U y C. 31/31.
- ⚠️ Observación: en iso el cursor cae en el plano de trabajo (z = 0); desde el tope de una columna la goma baja en diagonal
  hasta ahí (como el SCP de AutoCAD). Para la viga horizontal: ORTO/eje X-Y, o subir el plano al nivel (N+…).

## 27-nov (2) · Captura de Jorge en 3D con ⊥ ORTO Z: cuatro rótulos («13.00 m» editable, «93°», «14 m», «5.00»)
- Qué era cada uno: «13.00 m» = cota de la goma; «93°» = ángulo de PANTALLA (el tramo vertical no tiene ángulo en el plano XY);
  «14 m» = cota automática de la columna ya dibujada (pasiva); «5.00» = cota de PARALELAS (distancia a la columna paralela), sin nombre.
- ✅ UN grupo pegado a la goma, apartado en perpendicular (no la pisa, ni al rótulo ⊥ ORTO): [ L 13.00 m | ∠ 90 ° ], cajas claras con
  borde azul, la del foco en ámbar; Tab alterna. Unidad fuera de la caja (el valor es solo el número).
- ✅ ORTO / rastreo polar / bloqueo: ∠ con 🔒 (caja ámbar) y valor exacto; tramo fuera del plano = ELEVACIÓN (90 / −90), no el de pantalla.
- ✅ Cotas automáticas pasivas: sin caja ni borde, 9 px, tenues; mientras se dibuja, al 30 %.
- ✅ Paralelas: [ d∥ 5.00 m ] con nombre y estilo editable, y SOLO cuando se puede escribir (arranque de una línea nueva).
- ✅ PRIMER punto junto a una barra (pregunta de Jorge, líneas sueltas): antes del 1.er clic sale [ d … m | a … m ∥ barra i–j ] con la cota
  perpendicular dibujada; Tab → d → a; Enter pone el primer punto a esa d (lado del cursor) y a (desde el nudo i). Luego L/∠.
- ✅ Primer punto relativo: @dx,dy[,dz] desde el ÚLTIMO nudo (LASTPOINT). DESDE (D/desde/FROM): base por clic o coordenada → @dx,dy.
- ✅ Test 51/51 en Planta y 3D iso (local): paralela a d = 5.00 exacta, @0,2, DESDE (1,1,0), con y sin ORTO, grupo sin solapes. Otros UI OK.
- ❌ MCP struct-local / hekatan-struct: NO conectados en esta sesión (fallo de conexión al arrancar) → puppeteer en isométrico como respaldo.
- ⏳ Celular: la caja tocable tiene el estilo nuevo, pero la «d a la barra» del PRIMER punto aún no tiene caja tocable (en el celular: @dx,dy en L).

## 27-nov (otra sesión, en paralelo) · Plano que sigue al último punto, deploy y APK
- ❌ Visto en iso con el MCP struct-local (sí conecta en esta sesión): tras la columna la goma bajaba en diagonal a z = 0.
- ✅ Arreglo (commit 219a89ca4): con LÍNEA/POLILÍNEA en curso el cursor corta un plano PARALELO al de trabajo por el
  último punto (`intersectWorkPlane`; normal de los vértices de la malla-plano, su geometría viene pre-girada).
  MCP: columna @0,0,3 y clics de RATÓN en (5,0,3) y (5,4,3) → desvío 0. `__hekatanPlanoSigueCota = false` = antes.
- ❌ 1.er check del test apuntaba a puntos de z = 0 → ORTO elegía Z (correcto). Ahora apunta a la altura del tope.
- ✅ Test 52/52 local y 52/52 contra el PÚBLICO (gh-pages 055df20). newBlank.ts ajeno apartado en el build y restaurado (md5 igual).
- ✅ APK hekatan-struct-android reconstruido (copia_web.sh desde /c/hkpub_struct 055df20) e instalado en el A15: Success.
- ⏳ Edge abierto: ExtensionActivityEdge (527 MB) sin borrar. C: ~0,4 GB libres.

## 27-nov (3) · POLILÍNEA sigue del último nudo + cota editable desde un nudo (Jorge)
- ❌ Público (MCP): tras LÍNEA 0,0→4,0→4,3, «pl @2,0 @0,3» empezaba SUELTA en (6,3) → [3,4], despegada.
- ✅ POLILÍNEA arranca en el último nudo (`sembrarPolilinea` en el cambio de herramienta): [2,3,4]. «N» / opción
  [Nuevo inicio] la suelta (la «n» va antes del alias n = nudo en main.ts).
- ✅ Cota provisional editable desde un nudo (Revit): [ d … m desde nudo k ] antes del primer punto, Tab → d, Enter
  pone el punto a d exacta en la dirección del cursor (ORTO: eje del plano).
- ❌ No salía en el test: (1) radio 160 px; (2) la rejilla llevaba el cursor a la altura del EXTREMO de la barra
  y mandaba la cota «a la barra». Ahora la de barra solo en el tramo interior; en el extremo manda la del nudo.
- ✅ tests/polilinea_y_cota_nudo_ui.mjs 18/18 (planta e iso) local y PÚBLICO; entrada_dinamica 52/52. Commit 40ff9466a.
- ✅ APK reconstruido e instalado en el A15 (Success).
- ✅ YouTube: fem_estructura_vs_suelo_EN (G2ZR3zSxv4o) con título, descripción, capítulos, lista «Geotecnia · Elementos
  finitos» y PÚBLICO. Calidad revisada en el canal: 42 videos y 11 Shorts todos servidos a 1080p.

## 27-nov (4) · APK de Struct ajustado a la pantalla del celular (Jorge: «no me has arreglado Struct móvil»)
- ❌ Emulado A15 (412×891 y 891×412, dpr 2.625): la medición «¿algo se sale?» daba 0 (las barras deslizan), pero las
  CAPTURAS mostraban: (1) en vertical NO había barra de dibujo — main.ts solo montaba `#hk-barra` si innerWidth > 600;
  (2) en horizontal la caja de la cruceta (#hk-nav-camara, left+right en línea) medía 551×100 px EN MEDIO del modelo y se
  comía los toques (no dibujaba); (3) «Acceso rápido» pisaba la cruceta; (4) leyenda columna/viga en medio del modelo.
- ✅ main.ts: barra de dibujo montada también ≤ 600 px (a353ff5de). struct_movil.css: tira deslizable de 44 px bajo la
  barra de arriba, botones de 36 px, modelo desde 84 px, leyenda oculta. struct_movil.js: cruceta con ancho automático y
  sin captar toques (sus botones sí), «Acceso rápido» encima de ella, encuadre al abrir y al girar.
- ✅ Copia real del APK (127.0.0.1:4711): LÍNEA por toques con la barra en vertical y horizontal → [[0,1],[1,2]]. APK instalado (Success).
- ✅ Disco 9,1 GB libres (bin Debug de Hekatan Lab 615 MB, temporales), RAM 4,4 GB; gradle parado.
