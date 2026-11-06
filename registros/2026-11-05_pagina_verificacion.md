# Página de verificación (5-nov-2026)
Archivo: `docs/verificacion.html` (autocontenido, SVG/JS inline, claro y oscuro) + `docs/verificacion.png` (render).
- ✅ Tabla Hekatan / ETABS / SAP IV / SAP2000, semáforo (<1 %, <5 %, abierto), gráfica de barras en escala log, sección «abierto» y comandos para repetir.
- ✅ Tests confirmados al escribirla: e2k 615/615, e2k_portico1vano 93/93, membrana_q4_etabs 17/17, e2k_galpon_simple 24/24.
- ✅ Render con render_html.py: 0 errores de consola; la gráfica dibuja.
- ❌ 1.er render: etiquetas de las 2 últimas barras ilegibles (caían dentro de la barra) -> columna fija de valores a la derecha. Además «Mercado Dead Ux 1.09 %» estaba como «coincide»: es «aceptable» (>1 %).
- ⏳ Columna SAP2000: «en curso» (no existe registros/2026-11-05_sap2000_galpon.md ni tests/datos/sap2000_*.json). Rellenar al terminar ese trabajo.
- ⏳ No publicada: solo local; el usuario decide.

## Actualización: columna SAP2000 llena
- ✅ Tabla: SAP2000 vs ETABS (galpón plano 0.16 %, LATX 0.09 %, pendiente 0.22 %; fila nueva con corte/rot90, Live y LATX); recorte 7/21/9 %; mercado y pórtico/membrana/viga = «no corrido / sin probar».
- ✅ Gráfica: SAP2000 como cuadrado naranja (6 filas), columna de valores más ancha. Semáforo: texto explica SAP2000; recorte SAP2000 queda «abierto».
- ✅ Sección 3: cordón superior ETABS −0.41 / SAP2000 −0.51 / Hekatan −1.59 / SAP IV −1.37 + conclusión (el punto abierto está en la unión panel–arista de Hekatan, no en el elemento).
- ✅ Honesto: recorte 7/21/9 %, Dead +0.6 % (brazos), tubo relleno sin relleno, SAP2000 19 y reacciones sin probar. Sin binarios ni código de CSI.
- ✅ Render: PNG dibuja, 0 errores, sin texto solapado.
