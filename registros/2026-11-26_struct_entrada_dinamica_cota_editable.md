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
