# CAD: por qué no se podía dibujar una cercha curva (17-sep-2026)

Todo medido en el **deploy público**, con el cursor auxiliar (`?cursor=1`) a la
vista y guardando fotogramas de cada paso.

## ✅ Funcionó

- **La cercha curva sí se dibujó**, tecleando coordenadas: 22 nudos, 29 barras,
  luz 20.000 m, flecha 2.500 m, los 9 montantes a 90.00° y los tramos de cordón
  de −24.23° a +24.23°, simétricos. Fotogramas en
  `C:\Users\j-b-j\AppData\Local\Temp\claude-chrome-screenshots-rCa5RH\` y los 47
  PNG del primer intento en `C:\Users\j-b-j\Downloads\cercha_curva_frames\`.
- **El cursor auxiliar**: existe por `?cursor=1`, `__hkCursor` / `__hkClic` son
  función, el halo del clic se anima (r 3 → 8.93 → 17) y sigue al ratón de verdad.
- **ARCO por medidas** (nuevo): `ARCO 0,0,6.5 20,0,6.5 F 2.5 N 10` →
  «cuerda 20.000 m · flecha 2.500 m · radio 21.250 m · ángulo 56.14° · 10 tramos».
  11 nudos, 10 barras, clave exacta en (10, 0, 9.0000).
- **Borrar de verdad**: `E` → TODO → Supr deja 0 nudos y 0 barras.

## ❌ No funcionó (y por qué) — las cuatro incongruencias, encadenadas

1. **El punto tecleado no llegaba a la herramienta.** `commitAbsolutePoint` lo
   empujaba directo a `drawingObj.polylines`, el camino de la Línea y la
   Polilínea y de nadie más. Con el Arco: 1 nudo suelto, 0 barras y el pie
   repitiendo «ARCO Precise punto inicial». Igual: Círculo, Parábola, Cúbica,
   Rectángulo, Muro y Columna. → va por `procesarClic`, y sin blur entre puntos.

2. **Borrar una polilínea dejaba todos sus puntos.** La cercha entera borrada
   daba 0 barras y **22 nudos** huérfanos. → se van con ella los que no use
   ninguna otra; un nudo puesto a mano con la herramienta Nodo no se toca.

3. **Un clic rasante en isométrica ponía puntos a 100 m, sin avisar.** El rayo
   llega al plano de trabajo casi de canto: un clic en mitad de la pantalla caía
   en X=−67.91 Y=101.45 Z=4.04. → se rechaza con el motivo y la salida; el
   límite es relativo al modelo (un puente sí mide 100 m).

4. **El alzado se anclaba en el último punto, fuera cual fuera.** Con los
   fantasmas de (3): `hk_drawingPoints` con 24 puntos, los dos últimos en
   Y = 101.45, y el rótulo anunciando «ALZADO X-Z Y = 101.45» con el modelo
   entero en Y = 0. **Esto es lo que impedía dibujar la cercha con el ratón.**
   → si el punto se sale de lo dibujado (o del modelo), se ancla en el origen.

**Lo que NO era**: ni la extensión del navegador ni la automatización. El canvas
recibe `pointermove`, `pointerdown`, `pointerup` y `click`, y el clic crea nudo
— lo creaba en el sitio equivocado. (Medido con un espía de eventos.)

## Geometría, comprobada aparte (no de memoria)

    R = (c²/4 + f²)/(2f)     f = R − √(R² − c²/4)     R = (c/2)/sen(θ/2)

Cuerda 20 m, flecha 2.5 m → R = 21.2500 m, θ = 56.1450°, clave (10, 0, 9.000),
centro equidistante **21.250000 m** de los tres puntos.

Cercha luz 20 / flecha 2.5 / canto 0.6 / 10 paños: desarrollo del cordón
20.8232 m arriba y 20.2352 m abajo, tramos iguales de 2.0815 m, y canto
perpendicular **0.600000 m exacto** en todo el arco (cordones concéntricos).

## ⏳ Falta

- `DIVIDE` / `MEASURE` — partir un arco en n (hoy en `ACAD_FALTA` como «todavía no»).
- `OFFSET` de curva — el Desfase no desfasa arcos.
- `ARRAYPOLAR` — montantes radiales por matriz polar.
- Acotar en el propio dibujo (cotas y ángulos dibujados, no solo cantados en la
  barra de comandos).
