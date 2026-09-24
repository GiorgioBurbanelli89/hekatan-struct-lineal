# Test de verdad para la animación modal (puppeteer bien hecho)

Rama `sin-binario`. **Sin commit, sin deploy.** Motor FEM sin tocar.

Encargo: «haz un puppeteer bien hecho para que no vuelva a pasar un error así»
+ «de TODOS los ejemplos, plantillas, de todo lo que existe: revísalo».

El error a cazar está en `registros/2026-09-18_revision_deformada_modal.md`: el
visor animaba la deformada del caso **DEAD** en vez de la forma modal φ — lo
dibujado era exactamente **30.427 veces** la deformada de gravedad (12
comprobaciones: 4 nudos × 3 componentes, mismo factor a cinco cifras). No lo vio
nadie porque los arneses miraban «pageerror: 0» y capturas bonitas, y porque los
NÚMEROS del modal estaban bien (MAC 0.9999 contra SAP2000). **Lo que estaba mal
era el DIBUJO.**

---

## ✅ Qué se hizo

### 1. `tests/lib/visor_modal.mjs` — el medidor

Levanta el **bundle LOCAL** (`website/src/examples`) con `http.createServer`, el
mismo montaje de `cli/tutorial_struct.mjs`, y abre el **Chrome del sistema**
(`PUPPETEER_EXECUTABLE_PATH`, no descarga ninguno). Contra el sitio público NO:
en headless el modal no termina (medido 25 y 40 min).

Lo que mide, que es lo que se PINTA:

| dato | de dónde sale |
|---|---|
| nudos dibujados | `window.__hekatanStates.nodes.val` |
| nudos SIN deformar | `settings.__modoAnim.orig` (lo publica `animateMode.ts`) |
| amplitud del instante | `settings.__modoAnim.amp` |
| φ del modo, frecuencias, participación | `window.__hekatanModalResultados()` ← **gancho nuevo** |
| deformada estática del caso | `states.deformOutputs.val.deformations` |
| colormap | `window.__hekatanSettings().shellResults / .solidResults` |

Vector dibujado = `nodes − orig` en varios instantes del ciclo. Contra eso:
coseno con φ (traslación, como un MAC) y coseno con la deformada de Dead.

**Único cambio de código fuente**: `examples/src/workspace/main.ts` expone
`window.__hekatanModalResultados()` (solo lectura, devuelve el mismo objeto que
ya usa el panel de modos). Sin él, desde el DOM no hay contra qué comparar lo
dibujado — solo se ven los nudos movidos.

### 2. `tests/casos/animacion_modal_es_el_modo.mjs` — el caso de la suite

`node tests/run.mjs animacion` y dentro de `npm test`. Tres modelos (rápido):
`test-m-dual` (el del artículo, losa + muros, 545 nudos), `plantillas` tipo 0
(pórtico 2D de barras) y `plantillas` tipo 6 (dual con muros). **21 filas.**

Por modelo:

| fila | qué mide | límite | medido |
|---|---|---|---|
| `cos(dibujo, φ)` | lo dibujado ES la forma modal, en los modos 1, 2 y 3 | ≥ 0.999 | 1.000000 |
| `exceso vs Dead` | no se parece a Dead más de lo que φ ya se le parece | ≤ 0.02 | 4e-16 |
| `dirección modo 1` | la componente dibujada dominante = la de la participación | Ux/Uy | Ux (83.7 %) |
| `modos distintos` | cambiar de modo por el desplegable CAMBIA el dibujo | ≤ 0.2 | 0.027 |
| `oscila` | pasa por cero y cambia de signo (no congelada) | sí | amp min/max 0.004 |
| `amplitud estable` | el pico no se apaga; `\|d\|/\|amp\|` constante | ≥ 0.8 | 0.9916 |
| `colormap limpio` | al entrar en modal no queda el resultado de otro caso | none/none | none/none |

### ⚠️ Por qué NO hay un «coseno con Dead ≤ 0.2»

Ese límite **reprobaría a un programa correcto**: en `test-m-dual` el propio φ₁
tiene coseno **0.379** con la deformada de gravedad (medido). Son dos vectores
del mismo edificio, no tienen por qué ser perpendiculares. Lo que delata el
fallo es que lo dibujado se parezca a Dead **más que φ**: con el fallo puesto
daba 1.000 contra 0.379 → **exceso 0.62**. Se mide ese exceso, límite 0.02.

### 3. `cli/check_animacion_modal.mjs` — el barrido de TODO

`node cli/check_animacion_modal.mjs` recorre los ~140 ids de
`cli/shots/deploy/_ids.txt` **más las 8 plantillas una por una** (`tipo` 0..7:
son un solo id con un parámetro, y si no se recorren los ocho se da por bueno el
que salga por defecto — ese error ya pasó con `comparar_e2k_etabs.mjs`). Saca
una tabla `id · estado · nudos · modos · cos(dib,φ) · cos(dib,Dead) · veredicto`
y deja el detalle en `registros/_check_animacion_modal.json`. Por tandas:
`--desde N --hasta M`. Por id: `node cli/check_animacion_modal.mjs test-m-dual`.

Lo que no tiene modal o no carga sale como **`sin-modal` / `no-carga` /
`sin-modos` / `revienta`**, NO como aprobado.

---

## ✅ La prueba de que el test FALLA con el bug puesto

Sin esto el test no vale nada. Se quitó la guarda de `animarCaso()`
(`examples/src/workspace/main.ts`), dejando la línea como estaba antes del
arreglo, se reconstruyó el bundle y se corrió el mismo caso:

```
FALLA dual art.: cos(dibujo, φ)   0.379425  (limite >= 0.999)
FALLA dual art.: exceso vs Dead    6.21e-1  (limite <= 0.02)   cos(dibujo,Dead)=1.0000 contra cos(φ,Dead)=0.3794
FALLA dual art.: dirección modo 1        Uz  (limite Ux)       participación Ux 83.7 % · Uy 0.1 % · Uz 0.0 %
FALLA dual art.: colormap limpio  vonMises/vonMises  (limite none/none)
FALLA plant.2D:  cos(dibujo, φ)   0.000000  ·  exceso vs Dead 1.00e+0  ·  dirección Uz (limite Uy)
FALLA plant.dual:cos(dibujo, φ)   0.000000  ·  exceso vs Dead 1.00e+0  ·  dirección Uz (limite Uy)

FALLA: 9/21 comprobaciones
```

**`cos(dibujo, Dead) = 1.0000` exacto en los tres modelos**: lo dibujado ERA la
deformada de gravedad. Es el mismo fallo del 18-sep, reproducido y cazado.
Guarda repuesta y bundle reconstruido después.

---

## ✅ Marcadores

- `node tests/run.mjs animacion` → **21/21 en 61 s**, tres corridas seguidas sin flaquear.
- `npm test` completo → **634/643 en 347 s**. Base 613/622 con 9 fallos
  conocidos: **+21 comprobaciones, +0 fallos nuevos**.
- Barrido de las 8 plantillas → **8/8 ✅**.

---

## ❌ Lo que no funcionó por el camino

- **Una sola pestaña para todo el barrido**: se moría al 6.º-7.º modelo con
  «Attempted to use detached Frame». Cada modelo deja su escena de Three.js, su
  WASM y su malla; con losas de 1040 nudos Chrome tira la pestaña. Arreglo:
  **una pestaña por modelo** (`nuevaPagina`) y reciclar el navegador cada 12.
- **Coseno con Dead ≤ 0.2 como límite fijo**: falso positivo asegurado (φ₁ y
  Dead tienen coseno 0.379 en el dual). Ver arriba.
- **Medir con el bundle que había en disco**: estaba del 13:09, ANTERIOR al
  arreglo. Todo test contra el bundle exige `npm run build:deploy` antes (1m45s).
- **Esperar «un ratito» (900 ms) al cambiar de modo**: el test fallaba una de cada
  tres veces con `cos(dibujo, φ) = 0.8299`. No era el visor: se muestreaba un
  fotograma del modo ANTERIOR y se comparaba contra φ del modo NUEVO. Arreglo: se
  espera a que `__hekatanModalAnimator.currentMode()` DIGA que ya está en ese modo.
  Tres corridas seguidas 21/21, y de paso baja de 112 s a 61 s.

---

## Barrido: lo que se alcanzó a medir

**27 modelos medidos, 0 fallos.** Ninguno dibuja otra cosa que φ.

| modelo | nudos | modos | cos(dib, φ) | cos(dib, Dead) | cos(φ, Dead) | veredicto |
|---|---|---|---|---|---|---|
| `test-m-dual` (artículo) | 545 | 24 | 1.000000 | 0.3794 | 0.3794 | ✅ |
| `plantillas` #0 pórtico 2D | 68 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #1 pórtico 3D | 464 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #2 pórtico+losa | 1040 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #3 solo rejilla | 80 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #4 losa plana | 1040 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #5 losa+vigas borde | 1040 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #6 DUAL (muros) | 1048 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `plantillas` #7 arriostrado | 464 | 12 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W1_barra_axial` | 4 | 8 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_axial_cantilever` | 2 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_axial_composite_cantilever` | 2 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_axial_composite_encased_cantilever` | 2 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_axial_concrete_cantilever` | 2 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_flexion_composite_encased_cantilever` | 11 | 6 | 1.000000 | **0.9997** | **0.9997** | ✅ |
| `W2_viga_flexion_composite_slab_cantilever` | 11 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_flexion_concrete_cantilever` | 11 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `W2_viga_flexion_steel_cantilever` | 11 | 6 | 1.000000 | 0.0000 | 0.0000 | ✅ |
| `benchmark-safe-ex04-plate-beams` | 81 | 12 | 1.000000 | **0.9992** | **0.9992** | ✅ |
| `cerramiento` | 8 | 8 | 1.000000 | 0.0000 | 0.0000 | ✅ |

(y los tres del caso de la suite con sus 7 filas finas cada uno.)

**Las dos filas en negrita son la prueba de por qué el límite «coseno con Dead ≤
0.2» estaba MAL pensado**: en un voladizo y en la losa sobre vigas de SAFE, el
modo 1 y la deformada de gravedad son casi el MISMO vector (0.9997 y 0.9992).
Con aquel límite, los dos habrían salido rojos estando perfectos. El **exceso**
sobre φ, en cambio, da 5.6e-16.

### Hallazgo: 37 ids de `cli/shots/deploy/_ids.txt` NO están en el registro

`1st-floor, 2nd-floor, arco, assembly, beam_3d, benchmark-steel-beam,
boundary_conditions, burj, col-placa, edif-acero-diag, edif-mixto, edif-muros,
eiffel, intro_fem, losa-plana, losa-rect, modal_analysis, muro-contencion,
muro-q4, nuevo, opera, placa-orificios, placa-xy, plate-thick-validacion,
property_modifiers, puente, releases, shape_functions, shell_q4,
static_analysis, stiffness_bar, stiffness_beam, talud, twisted, viga-alta,
viga-q4, workspace_existent`

Son páginas sueltas del deploy, no ejemplos del workspace: `?t=<id>` no los
carga. Salen listados como **`sin-registro`**, no como aprobados. Vale mirarlo
aparte: o el fichero de ids está viejo, o esos ejemplos se perdieron del registro.

---

## ⏳ Falta

- **Terminar el barrido de los 100 ejemplos con modal.** Va por tandas:
  ```
  node cli/check_animacion_modal.mjs --desde 0  --hasta 25
  node cli/check_animacion_modal.mjs --desde 25 --hasta 50   …
  ```
  ❌ **Por qué no se terminó hoy**: con la máquina cargada (el Chrome de Jorge con
  39 procesos), swiftshader —WebGL por software— se arrastra. Medido: **un modelo
  suelto tarda 26 s**, pero encadenados se van a **5-12 minutos cada uno**. Cerrar
  la pestaña del registro y reciclar el navegador cada 6 modelos ayuda pero no lo
  arregla: hay que correrlo con la máquina descargada.
- Mirar los ids que salgan `❌`, `⚠ colormap sucio`, `no-carga` o `revienta`.
- Los 37 ids fuera del registro: decidir si el fichero está viejo o faltan ejemplos.
