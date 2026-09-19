# Revisión de la deformada modal de Hekatan Struct

Rama `sin-binario`. **Sin commit, sin deploy, sin publicar.** Nada del motor tocado.
Juez: **SAP2000 24**, mismo `.sdb`, misma malla nudo a nudo (**545 nudos**).

---

## VEREDICTO

**El cálculo está PERFECTO. El fallo es de DIBUJO.**

Y el fallo de dibujo **no es el escalado**: el visor está animando **la deformada
del caso DEAD (peso propio)** en vez de la forma modal φ. Por eso se ve
«deformándose verticalmente» y con las losas despegadas: eso es la flecha de
gravedad, no el modo.

---

## 1) ✅ El motor: MAC ≈ 1.0000 contra SAP2000

`sap_modos.py` (nuevo, en scratchpad) enganchó SAP2000 **una sola vez**, leyó
`JointDispl` de los 545 nudos (`N0..N544`) para el caso `MODAL` pasos 1-12 y
**cerró SAP2000**. Formas modales nodo a nudo, que antes NO existían guardadas
(los `*.json` de `validation/articulo-revista/` sólo tenían periodos,
participaciones y cortantes; de SAP2000 sólo había **capturas de pantalla** de la
animación, `_v4_sap_animar.py`).

| modo | T Hekatan | T SAP2000 | dif % | **MAC (3 gdl trasl.)** | MAC (6 gdl) |
|---|---|---|---|---|---|
| 1 | 0.4826 | 0.4841 | −0.302 | **0.999920** | 0.999909 |
| 2 | 0.4318 | 0.4299 | +0.437 | **0.999921** | 0.999917 |
| 3 | 0.1542 | 0.1546 | −0.272 | **0.999775** | 0.999689 |
| 4 | 0.1407 | 0.1402 | +0.323 | 0.999809 | 0.999753 |
| 5 | 0.1194 | 0.1180 | +1.202 | 0.999930 | 0.999907 |
| 6 | 0.0881 | 0.0883 | −0.275 | 0.998935 | 0.998767 |

Matriz MAC cruzada (Hekatan filas × SAP columnas): diagonal 0.9989–0.9999,
fuera de la diagonal ≤ 0.0013. **No hay modos cambiados de sitio ni mezclados.**

Participaciones, idénticas a la tercera cifra:

| modo | Ux SAP / HK | Uy SAP / HK | Uz SAP / HK | Rz SAP / HK |
|---|---|---|---|---|
| 1 | 0.8355 / 0.8360 | 0.0005 / 0.0008 | 0.0000 / 0.0000 | 0.0008 / 0.0012 |
| 2 | 0.0008 / 0.0014 | 0.4297 / 0.4297 | 0.0000 / 0.0000 | 0.4215 / 0.4227 |
| 3 | 0.1036 / 0.1033 | 0.0004 / 0.0005 | 0.0002 / 0.0002 | 0.0005 / 0.0007 |

Modo 1 = traslación X pura. Modo 2 = **Y + torsión acoplada** (Uy 0.43, Rz 0.42),
igual en los dos. **Uz = 0.0000 en todos**: el modo NO tiene componente vertical.

---

## 2) ❌ La hipótesis del `maxDisp` NO era la causa (medido)

Se propuso que `animateMode.ts:256-261` escalaba por el máximo módulo del vector y
que ese máximo era el `uz` de una losa, aplastando la traslación lateral. **Medido
sobre φ, es falso:**

| modo | `maxDisp` | nudo | posición | componente dominante | max\|ux\| | max\|uz\| | uz/ux |
|---|---|---|---|---|---|---|---|
| 1 | 1.00143 | 44 | (10, 10, 12) | **ux** | 1.0000 | 0.0635 | **0.064** |
| 2 | 1.11598 | 34 | (10, 0, 12) | **uy** | 0.4964 | 0.0366 | 0.074 |
| 3 | 1.00843 | 42 | (10, 10, 6) | **ux** | 1.0000 | 0.2005 | 0.201 |

El `maxDisp` del modo 1 ya es **lateral** (nudo de esquina de cubierta, ux). Escalar
por el máximo lateral en vez del módulo cambiaría `mScale` de 0.9260 a 0.9274:
**0.14 %**. Invisible. **Ese arreglo no habría arreglado nada.**

---

## 3) ✅ LA CAUSA REAL, medida: el visor anima el caso DEAD, no el modo

Medición en vivo sobre el deploy que se grabó
(`giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual`),
leyendo `window.__hekatanStates.nodes` (lo que se DIBUJA) durante la animación del
«modo 1», y comparando con `deformOutputs` (la deformada estática del caso Dead):

| nudo | Δ dibujado (x, y, z) | Dead (x, y, z) | **cociente x** | **y** | **z** |
|---|---|---|---|---|---|
| (0,0,0) base | 0, 0, 0 | 0, 0, 0 | — | — | — |
| (10,10,12) | +0.018317, +0.007166, −0.012561 | 0.000602, 0.000236, −0.000413 | **30.427** | **30.427** | **30.427** |
| (5,5,12) | +0.019018, +0.006763, −0.037854 | 0.000625, 0.000222, −0.001244 | **30.427** | **30.427** | **30.427** |
| (10,10,6) | +0.006162, +0.002427, −0.008924 | 0.000203, 0.0000798, −0.000293 | **30.427** | **30.427** | **30.427** |
| (0,0,12) | +0.019746, +0.006169, −0.001617 | 0.000649, 0.000203, −0.0000531 | **30.427** | **30.427** | **30.427** |

**12 comprobaciones independientes (4 nudos × 3 componentes), el MISMO factor
30.427 hasta la quinta cifra.** Lo dibujado es exactamente la deformada de
gravedad multiplicada por una constante. No es el modo.

Y el factor lo confirma:

```
mScale si se anima DEAD  = extent·5% / max|u_dead| = 0.9274 / 0.001736 = 534.2
mScale si se anima el MODO = 0.9274 / 1.00143                          =   0.926
amplitud medida / Dead sobre 5 s: 0.621/0.001244 = 499.2
                                  0.312/0.000625 = 499.2   → es 534, no 0.926
```

(30.427 es el valor instantáneo `mScale·sen(2πft)`; 499 es la amplitud muestreada
sobre 5 s, que no llega a tocar el pico 534.)

**El camino culpable** — `examples/src/workspace/main.ts:958-972`, `animarCaso()`:

```ts
const animarCaso = () => {
  if (esModal(__casoMostrado)) { mostrarModo(); return; }
  ...
  const U = deformOutputs.val?.deformations;          // ← la deformada ESTÁTICA
  const forma = new Array(n * 6).fill(0);
  U.forEach((d, i) => { for (let k = 0; k < 6; k++) forma[i*6+k] = d?.[k] ?? 0; });
  modalAnimator.setResults({ frequencies: [1], modeShapes: [forma], ... });
  modalAnimator.setMode(0);
  modalAnimator.play();                                // ← anima el caso, no el modo
};
```

y quien lo dispara pisando el modo — `examples/src/workspace/main.ts:1001`:

```ts
if (__animar.on) setTimeout(animarCaso, 300);   // después del rebuild del caso nuevo
```

`captureModalPanel.render` (`main.ts:6655-6657`) arranca el modo, pero 300 ms
después ese `setTimeout(animarCaso)` se ejecuta con `__casoMostrado` = «Dead»
(no modal) y **sustituye las formas modales por la deformada de gravedad**.

**Reproducido y medido**: modo 1 sale Dead; modos 2 y 3, al reseleccionarlos en el
desplegable, pasan por `mostrarModo()` y **sí** dibujan el modo de verdad
(modo 2 medido: nudo (10,10,12) X=0.404 Y=0.833, nudo centro (5,5,12) X=0.002
Y=0.427 → Y dominante y X nulo en el centro = **torsión pura**, exactamente lo que
dice φ, con razón X/Y = 0.485 contra 0.4964 de φ). O sea: **lo primero que ve el
usuario después de «Correr modal + animar» —el modo 1— es la gravedad.** Que es
justo el fotograma del vídeo.

---

## 4) ✅ Por qué se ven «las losas despegadas» y «deformándose verticalmente»

Porque es la flecha de peso propio:

- centro de losa (5,5,12): Δz dibujado = −0.0379 m
- esquina sobre columna (10,10,12): Δz = −0.0126 m
- columna a media altura (10,10,6): Δz = −0.0089 m

El centro de la losa baja **3 veces más** que la esquina apoyada en la columna →
cada losa se pandea hacia abajo y se separa visualmente de las columnas, que casi
no se acortan. φ del modo 1 dice lo contrario: uz/ux = 0.0041 en ese nudo; lo
dibujado da **1.99**, o sea **475 veces más vertical de lo que toca**.

---

## 5) ✅ El colorido: magnitud de otro caso

Panel del vídeo: `Shell results = Pressure (suelo) (sin datos)`, `Paleta = SAFE
(cimentación)`, barra `[tonf/m²] 0 → 6.84`. Eso es una magnitud de **cimentación
SAFE**, que no tiene ninguna relación con un modo.

Medido en sesión limpia: al elegir un caso modal **nadie toca `settings.shellResults`**
(`mountCaseResultsInSettings`/`aplicar`/`mostrarModo`, `main.ts:899-1020`), y el
colormap se calcula de `mesh.analyzeOutputs` (`getViewer.ts:1104-1123`), que el
animador modal **nunca escribe**. Resultado: geometría que se mueve con el modo
pintada con los colores del último caso estático.

**Qué debería salir por defecto en modal**: o nada (`none`, malla limpia como
ETABS y SAP2000), o el **desplazamiento modal** del modo dibujado. Nunca una
presión de suelo.

---

## 6) ✅ Fotograma a fotograma, Hekatan contra SAP2000

Hojas de contacto (Hekatan arriba, SAP2000 abajo, modos 1-3), 8 fotogramas:
`registros/img/2026-09-18_hoja_modo{1,2,3}.png`

- **SAP2000**: el edificio se **inclina** claramente de un lado a otro en el modo 1.
- **Hekatan**: el edificio se queda **de pie**; lo que cambia es la separación
  vertical de las losas.

Medido sobre los 8 fotogramas grabados (`capturas_v3/anim/struct_m1_*.png`), por
bandas horizontales del modelo: recorrido en X 13.2 / 5.9 / 5.9 / 17.0 px (la banda
de ABAJO se mueve tanto como la de arriba — imposible en un modo 1 lateral), y la
cima del modelo recorre **35 px en vertical** con la base quieta.

⚠️ Aviso sobre esos fotogramas: `_v3_struct_modos_anim.mjs:60-61` dispara
`page.screenshot()` en bucle **sin controlar la fase** del ciclo; a 3840×2160 cada
captura tarda ~1-2 s y la frecuencia visible del modo 1 es ~1 Hz, así que los 8
fotogramas están **aliaseados**. Para comparar ciclo contra ciclo hay que fijar la
fase, no disparar a ojo.

---

## 7) ✅/❌ Lo demás que se comprobó

- ✅ `animateMode.ts:276-283` indexa **bien**: `shape[i*6 + 0,1,2]` = ux, uy, uz.
  **No hay desfase de GDL** (se descarta la hipótesis del índice).
- ✅ `animateMode.ts:215` apaga `deformedShape` al animar. Medido en vivo:
  `deformedShape = false` durante la animación. **No suma la deformada estática por ahí.**
- ✅ Hay **un solo array de nudos** (`mesh.nodes` → `derivedNodes`,
  `getViewer.ts:889-927`); losas y barras leen el mismo. La separación losa/columna
  **no** viene de dos fuentes de nudos, viene de que lo animado es gravedad.
- ✅ Nudo de base (0,0,0): desplazamiento dibujado **0, 0, 0** en los tres modos. Correcto.
- ✅ Al cambiar de modo la deformada **sí** cambia de forma, y el periodo del rótulo
  corresponde (T = 0.4843 / 0.4301 / 0.1545 s en el deploy, contra 0.4841 / 0.4299 /
  0.1546 de SAP2000).
- ❌ `settings.__modoAnim` sale **null** medido en la página (`claves: []`): el
  `publicarModo()` de `animateMode.ts:176-179` escribe en un objeto de settings
  distinto del que devuelve `window.__hekatanSettings()`. Consecuencia: la rama
  Hermite de `elements.ts:281` **nunca se activa** y las barras se dibujan rectas
  entre nudos durante la animación modal (defecto menor, pero real).
- ✅ Escala real del dibujo modal: `scalePercent: 5` (`main.ts:6634` y `:8411`), o sea
  5 % de la diagonal del modelo (0.927 m), **independiente** de los «Scale XY / Scale Z»
  del panel (que son `deformScale`/`deformScaleZ`, para la deformada estática).
  Amplitud del ciclo **constante** (no crece ni decae): `amp = sen(2πf·t)·mScale`.

---

## ✅ ARREGLO APLICADO Y MEDIDO (18-sep-2026)

Solo visor. `modal.cpp` sin tocar, WASM sin recompilar.

| archivo:línea | qué |
|---|---|
| `examples/src/workspace/main.ts:958` (`animarCaso`) | guarda: si `__modalActivo` y hay formas modales, `mostrarModo()` y no se anima ningún caso |
| `examples/src/workspace/main.ts:~1017` | 2ª guarda: `setTimeout(animarCaso, 300)` solo si el caso NO es modal |
| `examples/src/workspace/main.ts` (`limpiarColormapModal`) | al entrar en modal, `shellResults`/`solidResults` → `none` |
| `examples/src/workspace/main.ts` (`animarCaso`) | marca `setResults(..., "caso")` |
| `examples/src/shared/animateMode.ts` | `fuente: "modo" \| "caso"`; el estado dice «Deformada de CASO (no es un modo)» |
| `examples/src/shared/animateMode.ts` (`publicarModo`) | publica `__modoAnim` en LOS DOS objetos de settings → vuelven las barras curvas (Hermite) |
| `examples/src/shared/animateMode.ts` (`showStaticPhase`) | dibuja el modo en una FASE concreta, para grabar sin aliasing |
| `validation/articulo-revista/_v3_struct_modos_anim.mjs` | graba un ciclo con fase fija en vez de disparar a ojo |

### La prueba: dibujado ÷ φ contra dibujado ÷ Dead

Medido en local (`localhost:4601`, mismo `?t=test-m-dual`, 545 nudos):

```
cociente dibujado/phi        cociente dibujado/Dead
(10,10,12)  0.434 0.434 0.434     716.2   −84.5    11.8
( 5, 5,12)  0.434 0.434 0.434     670.8   −48.4     1.3
(10,10, 6)  0.434 0.434 0.434    1253.5  −168.9    13.4
( 0, 0,12)  0.434 0.434 0.434     627.7    −5.7   −20.1
```

**Se han cambiado las tornas**: antes el cociente CONSTANTE era contra Dead (30.427) y ahora
lo es contra **φ** (0.434, doce veces seguidas). Se dibuja el modo.

### Antes y después, en números

| en el nudo | ANTES (÷ Dead) | DESPUÉS | lo que dice φ |
|---|---|---|---|
| ampX cubierta (10,10,12) | 0.300 m | **0.925 m** | mScale·1.0 = 0.926 |
| ampZ/ampX cubierta | 0.687 | **0.0113** | 0.0114 |
| ampZ/ampX centro cubierta | **1.99** | **0.0039** | 0.0042 |
| ampZ/ampX columna z=6 | 1.45 | **0.0153** | 0.0154 |
| forma en altura: amp(z=6)/amp(z=12) | — | **0.589** | 0.589 |
| nudo de base | 0 | **0** | 0 |
| `shellResults` | `Pressure (suelo)` / SAFE | **`none`** | — |
| `__modoAnim` | `null` (barras rectas) | **presente** (Hermite) | — |
| estado del panel | «Modo 1 / 24» (mentía) | «Modo 1 / 24 · Ux (84 %) · T 0.4873 s» | — |

El vertical pasa de **1.99 a 0.0039** en el centro de la losa: 475 veces menos. Y la forma en
altura (0.589) es la del modo, no la de la gravedad.

### Mirados los fotogramas (3840×2160, mismo encuadre que los que Jorge aprobó)

Grabados del **bundle estático** (`npm run build -w examples` + `http.createServer` en el 4700):
el servidor de desarrollo hace HMR a media captura y tira el contexto («Execution context was
destroyed»), y el sitio público tarda demasiado en headless. Y con **la fase controlada**
(`showStaticPhase(modo, sen(2πk/8))`), no disparando a ojo.

| imagen | qué enseña |
|---|---|
| `registros/img/2026-09-18_modo1_antes_despues.png` | arriba ANTES, abajo DESPUÉS, 8 cuadros |
| `registros/img/2026-09-18_modo1_picos.png` | los dos picos del ciclo, a resolución completa |
| `registros/img/2026-09-18_modo{1,2,3}_hekatan_vs_sap.png` | Hekatan arriba, SAP2000 abajo |

Lo que se ve, mirado:

- **ANTES**: losas con huecos verticales grandes que cambian de cuadro a cuadro, pintadas con la
  presión de suelo (arcoíris); el edificio **no se inclina**.
- **DESPUÉS**: malla limpia, losas **paralelas y equiespaciadas**, y el conjunto **se inclina a un
  lado y al otro** con la base quieta. Las columnas salen **curvas** (Hermite), que es lo que se
  había perdido con el `__modoAnim` nulo.
- **Contra SAP2000**: las dos filas enseñan ahora lo mismo — modo 1 vaivén lateral, modo 2 con
  giro de las losas (torsión acoplada).
- Honesto: el vaivén de Hekatan es **menos exagerado** que el de SAP2000, porque la amplitud está
  fijada en `scalePercent: 5` (5 % de la diagonal = 0.93 m) mientras SAP usa la suya. Es una
  elección de escala, no un fallo; si se quiere más espectacular en el vídeo, se sube ese 5.

### `tsc --noEmit`

**166 errores antes, 166 después.** Cero nuevos (los 166 son preexistentes: flags de módulo,
`import.meta`, tipos de ejemplos viejos). `animateMode.ts` no tiene ninguno.

### `npm test`

**613/622, 9 fallos = la base documentada.** Sin regresión, y sin tocar ningún límite.

⚠️ La primera pasada dio 612/622 con 10. El fallo de más era
`no hay copia del WASM dentro de cli/`: durante la sesión había aparecido
`cli/hekatan-fem/src/cpp/built/deform.wasm` (artefacto de empaquetado, ignorado por git, con
fecha de hoy). Borrado el directorio, el caso `cli_igual_que_wasm` vuelve a **5/5**. No tiene
nada que ver con el arreglo: **ningún test importa `workspace/main.ts` ni `shared/animateMode.ts`**
(la suite prueba el solver, no el visor).

---

## ⏳ (histórico) ARREGLO PROPUESTO — antes de aplicarlo

No se aplicó el arreglo autorizado (escalar por la componente dominante) **porque
está medido que no arregla nada**: cambia el modo 1 un 0.14 %. Aplicarlo habría
dejado el fallo de pie y con la sensación de estar resuelto.

Lo que hay que arreglar, por orden:

1. **`examples/src/workspace/main.ts:1001`** — `setTimeout(animarCaso, 300)` no debe
   ejecutarse si el caso mostrado es modal. Guarda:
   `if (__animar.on && !esModal(__casoMostrado)) setTimeout(animarCaso, 300);`
   o mejor, que `animarCaso()` (`main.ts:958`) compruebe `__modalActivo` antes de
   pisar `modalAnimator.setResults(...)`.
2. **`examples/src/shared/animateMode.ts`** — que `setResults()` deje constancia de
   si lo que recibe es un modo o una deformada de caso, y que el rótulo de estado lo
   diga. Así un fallo así se ve en pantalla en vez de tener que medirlo.
3. **`examples/src/workspace/main.ts` (`mountCaseResultsInSettings`, ~899-1020)** —
   al pasar a un caso modal, poner `settings.shellResults` en `none` (o en el
   desplazamiento modal) en vez de dejar la magnitud del caso anterior.
4. **`examples/src/shared/animateMode.ts:176-179`** — que `publicarModo()` escriba en
   el mismo objeto de settings que expone `__hekatanSettings()`, para recuperar las
   barras curvas (Hermite) durante la animación modal.

**Sin arreglar el punto 1, el vídeo de los cuatro programas no se puede publicar:**
el cuadrante de Hekatan no está enseñando el modo 1.

---

## Ficheros

- Formas modales SAP2000 (NUEVAS, nunca se habían guardado — antes de SAP2000 sólo
  había capturas de pantalla): `validation/articulo-revista/sap_dual_sismo_modeshapes.json`
  y el extractor `validation/articulo-revista/sap_dual_sismo_modeshapes.py`
- Formas modales Hekatan: `hk_modos.json` (scratchpad)
- Medidas en vivo del visor: `medida_visor{,2,3}.json`, `probe.json` (scratchpad)
- Hojas de contacto: `registros/img/2026-09-18_hoja_modo{1,2,3}.png`

## Coste

SAP2000 se abrió **una sola vez** (255 s en total, arranque incluido) y se cerró
por `ApplicationExit`. El arranque por `Helper.CreateObject(exe) + ApplicationStart()`
volvió a fallar con «No se pudo leer desde un puerto IPC»; se usó el camino ya
documentado (`subprocess.Popen(EXE, SDB)` + `GetObject`), que funcionó a la primera.

---

## ✅ Tanda (b): capítulos 1-3 regrabados — `VERIF4C_*` (18-sep-2026)

Los `VERIF4B_*` se habían grabado ANTES del arreglo: por eso Jorge seguía viendo
«forma vertical». Regrabado **solo el cuadrante de Hekatan**; SAP2000, ETABS y OpenSees
se reusan tal cual del montaje anterior (sus fotogramas fuente ya no existen en disco:
en `capturas_v3/anim/` solo quedan `struct_*` y `opensees4_*`).

- Bundle **reconstruido** (`npm run build -w examples`) y servido estático con
  `http.createServer` en el 4700. ⚠️ El servidor de desarrollo hace HMR a media captura y
  tira el contexto («Execution context was destroyed»).
- Fase controlada **desde fuera**, sin tocar `main.ts` ni `animateMode.ts` (que tienen un
  único escritor): parar → leer los nudos originales → animar y quedarse con el instante de
  mayor |d| (= φ·mScale) → parar → escribir `nudos = orig + d·sen(2πk/24)` y capturar.
- Montaje: superposición del panel 480×752 en `x=0, y=156` sobre el vídeo anterior, a
  24 fotogramas / 4.4 s. Audio, subtítulos quemados, rótulos y pies intactos; misma
  duración, así que los `.srt` valen sin tocar.
- Fondo del panel tomado **dentro del lienzo 3-D** (14,17,22). Con el de la interfaz
  (27,31,38) se veía el rectángulo pegado.

Ficheros (en `VIDEOS/verificacion_4programas_v2/`): `VERIF4C_cap{1,2,3}_modo{1,2,3}_cuatro_programas_{YOUTUBE,REDES_EN}.mp4`
+ sus `.en.srt` / `.es.srt`. Duraciones 22.93 / 18.76 / 17.53 s, audio AAC conservado.

### Mirado en el vídeo MONTADO

`registros/img/2026-09-18_video_panel_hekatan_antes_despues.png` y
`registros/img/2026-09-18_video_hekatan_vs_sap2000.png`.

- **Antes**: losas pandeadas con huecos, colormap de presión de suelo.
- **Ahora**: malla limpia, losas **paralelas y equiespaciadas**, el edificio se **inclina**.
  El modo 2 enseña el giro de las losas. **No hay movimiento vertical.**

### ⏳ Lo que NO cuadra todavía, medido en el vídeo final (cap. 1)

| | recorrido horizontal | periodo |
|---|---|---|
| Hekatan | **6.8 px** | **4.40 s** ✅ (la especificación) |
| SAP2000 (reusado) | **25.0 px** | **0.72 s** |

- **El ritmo no se parece**: el panel de SAP2000 del montaje viejo oscila 6 veces más
  rápido, con solo ~4 posiciones distintas (cada fotograma repetido 6 veces a 30 fps).
  Igualarlo exige **re-renderizar su panel desde los fotogramas fuente, que ya no existen**:
  habría que volver a grabar SAP2000 y ETABS.
- **La amplitud tampoco**: Hekatan se mueve 3.7× menos en pantalla. Puede ser que la
  grabación vieja de SAP usara una amplitud mayor que su «Automatic», o que el encuadre de
  cada panel escale distinto. **No está cerrado.**

Opciones, por coste: (1) publicar así — el fallo que Jorge reportó (la deformada vertical)
está arreglado y verificado, y el resto es ritmo/amplitud; (2) volver a grabar SAP2000 y
ETABS para rehacer los cuatro paneles con el mismo ciclo de 4.4 s.

---

## ✅ Encuadre arreglado — `VERIF4D_*` (18-sep-2026)

Diagnóstico previo: la caja de tinta del montaje incluía la **rejilla del suelo** y los
apoyos, más anchos que el edificio, así que mandaba el ancho y el factor de escala salía
0.346 — el edificio quedaba a 218 px en un hueco de 468.

Arreglo (solo captura, **`modeScale.ts` sin tocar**): antes de grabar se apagan
`gridXY`, `supports`, `loads`, `nodes` y `showCotas` desde `window.__hekatanSettings()`.

### Medido sobre el vídeo montado (cap. 1)

| | recorrido cima | ancho cubierta | alto edificio | recorrido/ancho |
|---|---|---|---|---|
| Hekatan **VERIF4C** (antes) | 9.96 px | 218 px | 408 px | 0.0457 |
| Hekatan **VERIF4D** (ahora) | **13.05 px** | **291 px** | **520 px** | 0.0448 |
| SAP2000 (reusado) | 23.11 px | 404 px | 433 px | 0.0572 |

- Ganancia de encuadre: **×1.31**. Hekatan pasa de **0.43 a 0.56** del vaivén de SAP en pantalla.
- **Amplitud física: SAP2000 / Hekatan = 1.28** (por `recorrido/ancho`, que no depende de la
  escala del panel). Coincide con el 1.25 medido antes del arreglo → es real, no de montaje.

### Lo que queda, y de dónde viene

El edificio de Hekatan ya es **más alto** en el panel que el de SAP (520 vs 433 px), pero su
**cubierta sale más estrecha** (291 vs 404 px): `ancho/alto` = **0.56 en Hekatan contra 0.93 en
SAP**. Es la **cámara**: la vista de Hekatan mira más de frente y comprime la horizontal;
la de SAP mira más desde arriba y abre el rombo del techo. Como el modo 1 es horizontal,
esa compresión (~1.66×) se come parte del vaivén.

Dos palancas independientes para lo que falta:

1. **Cámara** (mía, sin tocar constantes): igualar elevación/azimut a la vista de SAP.
   Recuperaría hasta ~1.66× más de vaivén aparente.
2. **Constante** (decisión de Jorge, `examples/src/shared/modeScale.ts`): subir de 3.7 % a
   **~4.7 %** igualaría la amplitud FÍSICA de la grabación de SAP (×1.28). Por encima de eso
   ya sería decisión de vídeo, no fidelidad — el 3.7 % es lo medido del «Automatic» de SAP.

Ficheros: `VERIF4D_cap{1,2,3}_modo{1,2,3}_cuatro_programas_{YOUTUBE,REDES_EN}.mp4` + `.srt`
(los `VERIF4C_*` se conservan). Imagen: `registros/img/2026-09-18_verif4d_modo1_picos.png`.

## ✅ Cámara igualada a SAP2000 — `VERIF4E_*` (18-sep-2026)

Sondeada la cámara viva de Hekatan: `PerspectiveCamera` fov 45, `up (0,0,1)`, target en el
centro del modelo, a 40.8 m → **elevación 35.26°, azimut 225°**. La ELEVACIÓN ya era la
isométrica verdadera de SAP («Set Default 3D View», 35.264°). Lo que NO coincidía era la
**proyección**: SAP trae **Aperture 0 = paralela**, y Hekatan dibujaba en perspectiva cerrada,
que acorta la parte lejana del techo.

Arreglo (solo captura): usar la `orthoCamera` que el visor ya expone en `__ctx`, colocada en
la misma dirección iso y con `setActiveCamera`. ⚠️ Antes se probó mover la perspectiva lejos
con fov 5: **no vale**, `OrbitControls` topa con `maxDistance` y el modelo llenó la pantalla.

| | recorrido | anc. cubierta | alto | **anc. máx** | rombo/alto |
|---|---|---|---|---|---|
| Hekatan 4C | 9.96 px | 218 px | 408 px | — | — |
| Hekatan 4D | 13.05 px | 291 px | 520 px | 432 px | **0.56** |
| Hekatan **4E** | **12.90 px** | 214 px | 529 px | **432 px** | **0.82** |
| SAP2000 | 22.71 px | 404 px | 433 px | 404 px | **0.93** |

**El rombo del techo pasa de 0.56 a 0.82 contra el 0.93 de SAP**: las dos vistas ya son casi la
misma vista. El recorrido en pantalla apenas cambia (0.57 de SAP) porque al enderezar la
proyección el edificio también se ensancha.

### ⚠️ El número de amplitud física NO está cerrado — no subir la constante con él

Las tres estimaciones que he hecho **no concuerdan**, y hay que decirlo:

| vía | SAP / Hekatan |
|---|---|
| px, normalizando por «ancho de cubierta» (banda superior 12 %) | 1.28 |
| px, normalizando por «ancho máximo» | 1.88 |
| **coordenadas del modelo** (la fiable) | **≈ 1.00** |

La de coordenadas: con `scalePercent = 5` se midió `ampX = 0.925 m` en la cubierta; a 3.7 % son
**0.685 m** de semiamplitud — y el 3.7 % se dedujo midiendo **0.682 m** en la grabación de SAP.
O sea que **en metros ya coinciden**, y las dos cifras en píxeles arrastran el sesgo del
heurístico de «banda superior» (que en una iso paralela no coge el rombo entero).

**Recomendación: no tocar `MODE_SCALE_PERCENT`.** Si se quiere zanjarlo, la medida buena es en
coordenadas del modelo (`mesh.nodes` contra los originales), no en píxeles del montaje.

Ficheros: `VERIF4E_cap{1,2,3}_modo{1,2,3}_cuatro_programas_{YOUTUBE,REDES_EN}.mp4` + `.srt`
(4C y 4D conservados). Imagen: `registros/img/2026-09-18_verif4e_modo1_picos.png`.
