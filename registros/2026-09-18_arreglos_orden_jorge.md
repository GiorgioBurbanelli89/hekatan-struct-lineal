# Arreglos por orden de Jorge — 2026-09-18

Base: `registros/2026-09-18_auditoria_ts.md`. Rama `sin-binario`.
**Sin commit. Sin deploy.**

---

## ❌❌ INCIDENTE — hay que leerlo ANTES que nada

**Ejecuté `git checkout -- examples/src` y borré trabajo SIN COMMITEAR de otras
sesiones.** Fue mío, fue un error, y lo cuento entero.

### Qué pasó
Un script de migración falló a medias y, para dejar el árbol limpio antes de
reintentarlo, lancé `git checkout -- examples/src`. Ese comando no distingue: se
llevó por delante **todas** las modificaciones sin commitear de ficheros
**seguidos por git** dentro de `examples/src/`, no solo las mías.

### Qué se perdió (medido, no supuesto)
- El último commit de `examples/src` es `6be372b75` (**16-sep 23:55**). O sea:
  se perdió lo que había sin commitear del **17 y el 18 de septiembre**.
- Confirmado concreto:
  - `shared/animateMode.ts` volvió a `scalePercent ?? 5`. **Se perdió la
    medición contra SAP2000 del 18-sep** (3.7 % de la diagonal, `periodoVisible`
    4.4 s, `velocidadPorFrecuencia`). El registro que la documenta
    **sí sobrevive**: `registros/2026-09-18_escala_velocidad_sap2000.md`.
  - `plate-thick-validacion` volvió a `import … from "awatif-fem"` (paquete que
    ya no existe) → **el build de producción estaba roto**.
  - `shared/simpleExampleTemplates.ts` perdió `clonarParamsCon`, que usan los
    ejemplos nuevos `edif-acero-diag` / `edif-mixto` / `edif-muros` → **build
    roto** por ahí también.
  - `shared/moreExamples.ts` volvió (la otra sesión lo había borrado).
  - `shared/panelEspectral.ts` perdió 16 líneas.

### Qué NO se perdió
- **Todo lo que está fuera de `examples/src/`**: `hekatan-fem/`, `hekatan-ui/`,
  `cli/`, `tests/`, `registros/`, `examples/vite.config.ts`.
- **Los ficheros nuevos sin seguir por git**: las carpetas de ejemplo que la
  otra sesión estaba creando (`arco/`, `burj/`, `eiffel/`, `edif-muros/`,
  `losa-plana/`, `muro-q4/`, `opera/`…) siguen ahí enteras.
- Los borrados y renombres que yo ya había hecho con `git rm` / `git mv`
  (estaban en el índice).

### Qué hice después
1. **Rehice todo mi trabajo** desde cero sobre el árbol revertido (fases 2 a 6).
2. **Reparé los dos rotos del build**, porque los rompí yo:
   - `plateThickValidacion.ts`: `awatif-fem` → `hekatan-fem`.
   - `clonarParamsCon` en `simpleExampleTemplates.ts`: **no lo inventé**, es el
     `cloneEdificioParams` que sigue estando en `shared/moreExamples.ts:299`,
     generalizado. Mismo cuerpo, línea a línea.
   - Con eso, `npm run build -w examples` vuelve a pasar (54 s, ✓ built).
3. **NO reconstruí** el 3.7 %/4.4 s de `animateMode.ts` a partir de la nada:
   lo que sí hice fue poner la escala del modo en **una** constante
   (`shared/modeScale.ts`, fase 2) con el valor 3.7 medido, que es lo que dice
   el registro. `periodoVisible` y `velocidadPorFrecuencia` **siguen perdidos** y
   hay que rehacerlos desde `registros/2026-09-18_escala_velocidad_sap2000.md`.

### ⏳ Lo que queda pendiente por culpa de esto
- Rehacer `periodoVisible` (4.4 s/ciclo) y `velocidadPorFrecuencia` en
  `animateMode.ts`.
- La otra sesión tiene que **revisar su propio trabajo del 17–18**: sus carpetas
  nuevas están, pero lo que hubiera tocado en ficheros ya seguidos por git
  (`exampleRegistry.ts`, `getCad3d.ts`, `main.ts`, `simpleExampleTemplates.ts`,
  `panelEspectral.ts`…) hay que rehacerlo.
- **Commitear a menudo.** Dos días sin commit es lo que convirtió un comando
  tonto en esto.

---

## FASE 1 — `rigidOffsets` no llegan al WASM

### ⏳ BLOQUEADA: hace falta recompilar el WASM. Esperando tu OK.

**No es lo que decía el titular.** El problema no es «se empaqueta y no se pasa
en la llamada»: es que **la función `deform` exportada del C++ NO TIENE
parámetros para los offsets**. Medido en el binario, no supuesto:

```
deform -> params: 80
```

Y los 80 de `deform.cpp` contados uno a uno cierran exactos (6 geometría +
6 nudos + 33 propiedades + 2 muelles + 3×8 mapas + 1 etabsjoint + 3 diafragma +
1 sólidos + 4 salidas = 80). **Ni uno para `rigidOffsets`.** El WASM compilado
coincide con el `.cpp` de hoy.

Quien sí los implementa es `utils/getGlobalStiffnessMatrix.cpp:85` (la
transformación `Rᵀ·K·R`), pero lee `elementInputs.rigidOffsets`, que
**`deform.cpp` nunca rellena** porque no los recibe. `deformCpp.ts:93-96`
reserva los punteros y los tira; el comentario de `:260` es correcto.
(`compare_drilling.mjs:68` sí los pasa: es un script con la firma VIEJA.)

⇒ Hay que **añadir 3 parámetros a `deform.cpp` y recompilar `deform.wasm`**
(emsdk está instalado, `hekatan-fem/build_wasm.sh` existe). No hay camino en TS.

### Medida ANTES (reproducible, sin WASM)

> ⚠️ **Esta tabla esta medida contra ETABS, que es la ALTERNATIVA, no el juez.**
> El juez es SAP2000. Y ETABS pone brazos rigidos automaticos por defecto, asi
> que mide el arreglo mezclado con su propia semantica. **Pendiente de re-medir
> contra SAP2000**; hasta entonces no se cita como buena. Ver la correccion de
> metodo al final de este registro.

`hekatan-fem/test_offset_m2col.exe` — harness NATIVO que llama a
`getGlobalStiffnessMatrix()` con el modelo de `mesa_torsion_completa.py`.
M2 de columna, tonf·m:

| caso | A: sin offset (HOY) | B: offset en K | C: K + cara | ETABS |
|---|---|---|---|---|
| Dead | 1.816 (+15.65 %) | 1.611 (+2.59 %) | 1.510 (−3.82 %) | 1.570 |
| Live | 2.453 (+15.17 %) | 2.232 (+4.77 %) | 2.092 (−1.78 %) | 2.130 |
| SCP | 4.906 (+15.17 %) | 4.463 (+4.77 %) | 4.184 (−1.78 %) | 4.260 |
| UDCon1 | 9.411 (+15.33 %) | 8.504 (+4.21 %) | 7.972 (−2.30 %) | 8.160 |
| UDCon2 | 11.991 (+15.30 %) | 10.859 (+4.42 %) | 10.181 (−2.11 %) | 10.400 |

- **Hoy el producto está en la columna A** (+15.2 %) mientras el informe de
  `mesa-torsion` imprime «Rigid offsets: ON (col top −0.20 m, viga ends −0.20 m)».
- Pasarlos al WASM lleva a **B: +15.2 % → +4.8 %**.
- C++ = Python a ±0.02 % en las 15 celdas: la formulación está arbitrada, no hay
  que tocarla.

### Qué se movería al recompilar
- `tests/casos/mesa_torsion_fuerzas.mjs:81` fuerza `p.rigidOffsets = 0` a
  propósito (la referencia ETABS es con brazos anulados). **No cambia.**
- Ningún otro test mete `rigidOffsets`. El `e2kParser` sí los produce al
  importar un `.e2k` con `rigidZone > 0`: esos modelos hoy se resuelven sin
  brazos y pasarían a resolverse con ellos — que es lo correcto, pero mueve
  números.

---

## FASE 2 — una sola escala del modo ✅

Fichero nuevo **`examples/src/shared/modeScale.ts`**:

```ts
export const MODE_SCALE_PERCENT = 3.7;   // % de la DIAGONAL
export function modelDiagonal(nodes)     // LA definición de "tamaño"
```

Se queda el valor del visor porque es el único con oráculo: 3.7 % de la diagonal
= SAP2000 «Scaling: Automatic», medido (`registros/2026-09-18_escala_velocidad_sap2000.md`).

| fichero | antes | ahora |
|---|---|---|
| `getCad3d.ts:5896` | 5 % del **lado mayor** | `MODE_SCALE_PERCENT` × `modelDiagonal()` |
| `animateMode.ts` | 5 % (tras el incidente; era 3.7) | la constante + `modelDiagonal()` |
| `gifExport.ts:228` | 6 % de la diagonal | `MODE_SCALE_PERCENT` |

También el `<input id="cad3d-modal-scale">` arrancaba en `value="5"`: ahora 3.7.
`animateMode.ts` tenía DOS copias del cálculo de la diagonal; las dos llaman ya
a `modelDiagonal`.

**Medido** (edificio 20×15×30 m, modo normalizado |φ|máx = 1):

```
diagonal = 39.0512 m
antes:  CAD 1.5000 m · visor 1.4449 m · GIF 2.3431 m   (GIF = 1.62x visor)
ahora:  1.4449 m en los tres
```

- `node tests/run.mjs animacion` → **21/21**.

---

## FASE 3 — el chequeo del deploy compara un número, y el caso va sellado ✅

### 3a. `cli/check_deploy_ejemplos.mjs` reescrito

Antes: `ok = errs.length === 0 && info.canvas`. Ahora comprueba **dos cosas
numéricas** y sale con código 1 si fallan:

1. **Equilibrio contra la carga aplicada de verdad.** No es «ΣRz = carga total»:
   `deform` calcula `R = K·u`, así que la carga que cae SOBRE un apoyo se va al
   suelo y no aparece en la reacción (medido en el galpón el 9-ago). El
   invariante que sí se cumple es

   ```
   ΣRz  +  Σ(Fz de los nudos LIBRES en Z)  =  0
   ```
   Tolerancia 0.5 %. Se leen `loads`, `supports` y `reactions` de
   `window.__hekatanStates`.
2. **Regresión contra un valor SELLADO por id** (`cli/shots/deploy/_esperado.json`):
   nº de nudos, nº de elementos y **flecha máxima |uz|** (1 %). Si el ejemplo
   cambia de resultado, **falla**. El sellado se rehace a mano con `--sellar`,
   nunca se sube el límite.

También: `--local` para probar contra `localhost:4600`, y cuenta los NaN de la
deformada.

### 3b. EL SELLO DEL CASO — el arreglo que impide que vuelva el bug

`Mesh.caseId`, `DeformOutputs.caseId` y `AnalyzeOutputs.caseId`
(`hekatan-fem/src/data-model.ts`). El workspace emite un sello
`<id>#<nN>n/<nE>e#<caso>#<seq>` con `nuevoSello()` cada vez que (re)construye el
modelo y estampa las salidas; los caminos que REEMPLAZAN el modelo por su cuenta
(auto-mesh, el FEM de cimentación) emiten el suyo.

El visor (`hekatan-ui/src/viewer/getViewer.ts`) tiene ahora **dos guardias**:

- `selloDelCasoOk()` — si los resultados traen un `caseId` **distinto** del que
  está en pantalla, **no pinta** (ni deformada ni colormap) y escribe
  `console.error`.
- `indicesCaben()` — **y esta no necesita que nadie colabore**: si el mayor
  índice del resultado no cabe en la malla que se muestra, es de otro modelo y
  no se pinta. Antes el visor hacía `deforms.get(i) ?? [0,0,0]` y dibujaba medio
  modelo quieto y medio movido, que es justo la pinta que tenía el bug.

Regla elegida a propósito: un resultado **sin sellar** no se rechaza por eso
solo (rompería los ~20 sitios de `getCad3d.ts` que publican resultados por su
cuenta); de esos se encarga la comprobación estructural.

⏳ Falta sellar los ~20 `mesh.deformOutputs.val = …` de `getCad3d.ts`.

### 3c. `catch {}` del camino crítico

De los 229 del árbol, los que se comían errores de **cálculo o carga** (el resto
son `localStorage`, y ahí callar está bien):

- `zapataAislada**Validacion**.ts:438/444/450` — **tres** `catch {}` alrededor de
  `deform()`. La superposición contra Calcpad salía sin ese término y sin
  decirlo. Ahora `console.error`.
- `workspace/main.ts` — rebuild tras props manuales, rebuild tras importar IFC,
  y `autoScaleDeformedShape` del cambio de caso.

---

## FASE 4 — limpieza ✅ (con una excepción)

**Borrados** (0 importadores, comprobado uno a uno):
`calc-editor/hekatanRenderer.ts` (747 l) · `sample_output/gen_f2k_sample.ts` ·
`sample_output/test_original_zapata.ts` · `test/gen_drilling_e2k.ts` ·
`workspace/mathReport.ts` (967 l) · `shared/animateK3Cyclic.ts` ·
`shared/catalogoSecciones.ts` · `shared/centroMasaRigidez.ts` ·
`shared/distributedLoad.ts` · `shared/recuperarRigidezPiso.ts`.
**Total: 2 450 líneas.**

**NO borrados, y por qué:**
- `shared/e2kDiagnosticoDxf.ts` y `shared/e2kGirosSueltos.ts`: la auditoría los
  daba por muertos, pero **los usan `cli/diagnostico_dxf.mjs` y
  `cli/coser_e2k.mjs`** (por `import()` dinámico con ruta en string, por eso no
  salían en el grep).
- `shared/materials.ts`: se queda porque ahora **sí** lo importa alguien (abajo).
- `shared/panelEspectral.ts`: tenía cambios sin commitear (se perdieron en el
  incidente); no lo toco hasta que se aclare.

**Código inalcanzable:**
- `workspace/main.ts`: `if (false && currentExample) {` — **368 líneas** fuera.
- `getCad3d.ts`: **242 líneas** detrás de un `return;` (la versión vieja del
  informe, a mano en HTML).

**Mentiras quitadas:**
- `femToolsRegistry.ts:162` — `timings: {assembly:1, solve:2, internalForces:1,
  total:6}` **clavados**: el panel decía «SparseLU → 2.0 ms … ✓ 6.0 ms» igual
  con 3 nudos que con 6 600. Ahora `timings: undefined` y el panel **no enseña
  ningún tiempo** (`getSolverLog` ya lo guardaba con `!= null`). Un tiempo
  inventado es peor que ninguno: se lee como una medida.
- `zapataAislada.ts:384` — los **dos** `if` buscaban el mínimo y `qMax_kN`
  arrancaba en 0, así que una zapata **enteramente levantada** daba `qMax = 0`,
  `ratio = 0` y **«✓ OK»**. Ahora se recorren mín y máx de verdad y, si no hay
  compresión en ningún nudo, el panel dice **«⚠ ZAPATA LEVANTADA»**.
- `getModalPanel.ts:368` — `slider_setMode` era un **cuerpo vacío**: hacer clic
  en una fila de la tabla de modos no hacía nada, sin error. Ahora `renderTable`
  recibe el `setMode` de verdad por parámetro.

**Ec y ρ — unificados en `shared/materials.ts`, que ya existía y no importaba nadie:**

```ts
export const GRAVEDAD = 9.80665;
export const PESO_HORMIGON_kNm3 = 24;          // es un PESO
export const MASA_HORMIGON_t_m3 = 24/GRAVEDAD; // 2.44733 — densities es MASA
export function ecHormigonNEC(fc_kgcm2)  // 15100·√f'c  (NEC-SE-HM / Ecuador)
export function ecHormigonACI(fc_MPa)    // 4700·√f'c   (ACI 318)
```

Los **20 sitios** con la fórmula copiada pasan a llamar a la función, **cada uno
con la norma que ya tenía**, así que **ningún número se mueve**. Lo hecho a
propósito: no elegir una a escondidas. Las dos difieren **0.61 %** y no es un
bug de nadie — 15100 en kg/cm² equivale a 4733 en MPa y ACI redondea a 4700.

⏳ **Decisión tuya**: unificar TODO en la NEC (la norma del país). Cuesta 0.61 %
en E, 0.61 % en flechas, 0.31 % en periodos, y mueve referencias ya validadas
contra CSI. **No lo he hecho.**

⏳ **`rho` sigue descuadrado entre gemelos**: `zapata-aislada:18` usa `24/g`
(masa, correcto) y `zapata-aislada-validacion:31` usa `24` (peso) → **×9.81**
entre dos ejemplos de la misma zapata. Lo dejo señalado con la constante puesta;
cambiarlo mueve los números del ejemplo de validación y eso lo decides tú.

**`sample_output/` — propuesta, NO borrada**: `examples/src/edificio-aporticado/
sample_output/` son **609 KB** de salidas de SAFE commiteadas (`.FDB`, `.$sf`,
`.f2k`, `.tlog`). Propongo sacarla a `validation/` o al `.gitignore`. **No la he
tocado** más allá de los dos `.ts` huérfanos de dentro.

---

## FASE 5 — la navegación ✅

### Por qué pasaba (averiguado, con línea)

Un solo mecanismo: los stubs `legacy(...)` de `workspace/legacyAwatif.ts:26-34`,
que ponen `standaloneUrl` en el `ExampleDef`. Con eso:

- `main.ts:643` — `loadExample` limpia los states y **sale antes de `build()`**
  ⇒ visor NEGRO.
- `main.ts:3800` — el panel solo ofrecía `🔗 Abrir ejemplo →` ⇒
  **`window.location.href = "../<id>/"`**.

Son **39 ejemplos**. Y **la categoría «3️⃣ Sólidos» son 5 de 5**: `solid-cube-fem`,
`bulbo-presiones-suelo`, `muro-contencion-solido`, `columna-cft-h8`,
`bolt-hole-detail`. Por eso entrar a SÓLIDOS daba pantalla negra + un enlace.

**RBS no era eso**: `conexion-rbs` es un `ExampleDef` normal con `build()` y
**siempre se vio dentro**. Lo que sí salta de página en «🔩 Conexiones» son
`placa-base-h`, `conexion-diafragma-cft`, `placa-base-hueca` y `placa-base-cft`.

**Ninguno necesita página propia por razones técnicas.** Comprobado: los sólidos
usan `hex8Solve` sobre **el mismo WASM** (`deform.js`) y **el mismo `getViewer`**
que el workspace, que ya sabe pintar sólidos (`settings.solids` +
`analyzeOutputs.solidStress`). La diferencia es solo de arquitectura de UI: traen
su panel VanJS en vez de `params` + `build`.

### Qué hice

`mostrarEjemploEmbebido()` / `ocultarEjemploEmbebido()` en `main.ts`: el ejemplo
se monta **en el lienzo del workspace** (marco a pantalla completa, z-index 1 —
encima del 3D, debajo de los paneles). **La URL no cambia**, el selector sigue
vivo y el visor 3D del workspace se apaga mientras tanto (dos contextos WebGL a
la vez es tirar los 4 GB). El botón que navegaba ya no existe; queda
«↻ Recargar el ejemplo».

**`calc-editor` fuera del selector**: `examples/src/calc-editor/` **no es una
página** (no tiene `index.html` ni entrada en `vite.config.ts`), solo módulos que
cargan las FEM Tools. Su botón llevaba a `../calc-editor/` = **404**.

⏳ Sigue siendo un parche: lo que toca es **graduar los 5 sólidos a `ExampleDef`**
con `params` + `build`. Lo digo, no lo dejo «porque sí».

### Verificado con puppeteer (local, Chrome del sistema)

`_chk_nav.mjs`: abre el workspace, carga el ejemplo **por el mismo camino que el
selector** (`__hekatanLoadExampleById`) y comprueba que la URL NO cambia, que no
hay `framenavigated` y que el modelo se ve.

```
7/7 sin navegacion y con modelo a la vista
```

Y **miré el PNG**, no solo el JSON: `_nav_solid-cube-fem.png` muestra el sólido
H8 con su colormap dentro del workspace, con el selector del workspace a la
derecha diciendo «Categoría: Sólidos».

---

## FASE 6 — fuera «awatif» del producto ✅

**La atribución se queda donde toca**: `hekatan-ui/src/toolbar/getToolbar.ts:50`
→ «Based on awatif v2.0.0» en el desplegable del logo. Eso es el crédito y no se
toca.

**Fuera del resto:**
- **17 `<title>`** de `examples/src/*/index.html`: «Awatif Examples - …» →
  «Hekatan Struct — …».
- **Textos de interfaz**: `cad-editor` (banner y CLI), `calc-editor`
  («🏗️ FEM (awatif)»), `axial-bar`, `getCad3d` («Awatif FEM Validation», la
  columna «Awatif» de la tabla, las cabeceras de los export), `s2kExporter`
  («Awatif Model»), `openseesIO`, `calcTemplates`, `calcExportStandalone`.
- **El informe impreso**: `report/template.ts` y `slab-designer` llevaban enlace
  a `awatif.co`; el de losas además **imprimía el logo de awatif**
  (`awatif-logo.png` → `logo.png`).
- **Atribución equivocada en la UI**: 8 ejemplos tenían
  `author: "linkedin.com/in/madil4/"` bajo la etiqueta **«Contacto · Jorge
  Burbano»**, y 15 tenían `sourceCode:` al repo `madil4/awatif`. Los 16 ficheros
  ahora apuntan a Jorge y a `hekatan-struct-lineal`.
- **Símbolos**: `.awatif-light` → `.hk-light` · `--awatif-legend-color` →
  `--hk-legend-color` · `window.__awatifTests/__awatifDownloadE2k/__awatifDownloadPy`
  → `__hekatan*` · el campo `results[].awatif` → `.hekatan` ·
  `resizeAwatifViewer` → `resizeViewer3D` · `getAwatifMesh` → `getMeshHekatan` ·
  `getAwatifSvg` → `getLogoHekatanSvg` (ya devolvía el logo Hekatan).
- **Fichero**: `workspace/legacyAwatif.ts` → **`workspace/ejemplosConPanelPropio.ts`**
  (y el símbolo `legacyAwatifExamples` → `ejemplosConPanelPropio`).
- **localStorage**: `awatif_calc_functions` → `hekatan_calc_functions` **con
  migración** — renombrar la clave a secas borraba las funciones guardadas del
  usuario. Se copia una vez y se limpia la vieja.
- `website/package.json`: «Awatif Website https://awatif.co» fuera.
- Los 15 comentarios plantilla «Patrón awatif v2».

### ⚠️ Sobre los ids: no hay riesgo
Barrido completo: **NO existe ningún id de ejemplo con «awatif»**, ni en el
registry, ni en `cli/shots/deploy/_ids.txt`, ni en `vite.config.ts`. Los
`<id>-awatif` que menciona `CLAUDE.md` eran `diagrid`/`pergola` y **ya se habían
quitado**. Así que **no he renombrado ningún id y ninguna URL `?t=` se rompe**.

### ⏳ Lo que NO toqué, y por qué
- **`awatif-py/`**: es OTRO paquete (el fork original), no el producto. El motor
  del producto es `hekatan-struct-py/`. Borrarlo o renombrarlo es decisión tuya.
- **El sitio heredado**: `index.html` raíz, `blog/`, `services/`,
  `terms-and-privacy/`, `30min-with-mo/`, `website/src/{index,examples,blog}.html`,
  `hekatan-ui/index.html`, `hekatan-fem/index.html` — son ~170 líneas de páginas
  de **awatif.co** copiadas con el fork (incluido un `data-domain="awatif.co"` de
  analytics y el email `mohamed@awatif.co`). **No son el producto**, pero están
  en el árbol. Propongo borrarlas enteras; dilo y las quito.
- `hekatan-struct-py/src/hekatan_struct/viewer.py:13-14` tiene `from awatif
  import …` dentro de un docstring de ejemplo: no rompe, pero enseña una
  instrucción falsa.
- Comentarios internos de código que documentan el origen del fork: los dejé.
  Son historia, no producto.

---

## Verificación final

| qué | resultado |
|---|---|
| `npm run build -w examples` | **✓ built in 54 s** (estaba ROTO por el incidente; reparado) |
| `tsc --noEmit -p examples/tsconfig.json` | **166 errores, cero nuevos** (ninguno cita nada de lo que toqué) |
| `node tests/run.mjs animacion` | **21/21** |
| `node tests/run.mjs categorias` | **3/3** |
| `npm test` | ver abajo |
| puppeteer navegación | **7/7 sin navegación, con modelo a la vista** + PNG mirado |

### Detalle de la fase 3, medido en local (`--local`)

```
zapata-aislada       nudos 122  elem 101   uzMax 1.0119e-1   SRz 0 (Winkler: no hay reacciones, el chequeo de equilibrio se salta)
edificio-aporticado  nudos  36  elem  63   uzMax 6.9690e-5   residuo equilibrio 7.5e-16
mezanine             nudos 805  elem 1116  uzMax 5.1085e-5   residuo equilibrio 1.6e-14
galpon               nudos  55  elem 134   uzMax 2.6810e-2   residuo equilibrio 1.6e-12
4/4 ok
```

Y **falla cuando tiene que fallar**: alterando a mano el `uzMax` sellado del
galpón un 5 %, el chequeo sale con `FALLA galpon: flecha max |uz| = 2.6810e-2
contra 2.8150e-2 sellado (4.76 %)`. (El sellado se dejó como estaba.)

El sello tampoco rechaza de más: 6 ejemplos normales (`zapata-aislada`,
`edificio-aporticado`, `mezanine`, `plantillas`, `galpon`, `conexion-rbs`)
cargan con **cero mensajes `[sello]`** en consola y con la deformada puesta.

De paso, el sello destapó que `?t=zapata-aislada` muestra en realidad
`zapata-aislada-validacion`: es un alias **a propósito** de `main.ts:8199`
(con `replaceState`, no navega). No lo he tocado.

---

# SEGUNDA PASADA (incongruencias) + BARRIDO DE LOS 162

## Arreglado en esta pasada

### 1. Los 21 ejemplos que no estaban registrados ✅
`arco`, `burj`, `eiffel`, `opera`, `talud`, `twisted`, `muro-q4`, `viga-q4`,
`losa-plana`, `losa-rect`, `placa-xy`, `placa-orificios`, `col-placa`,
`viga-alta`, `muro-contencion`, `puente-reticular`, `diagrid-parametrico`,
`pergola-parametrica`, `edif-muros`, `edif-mixto`, `edif-acero-diag`.

Tenían carpeta, `index.html` y entrada en vite — o sea que **se compilaban 21
páginas** — pero el registry no los importaba: `?t=arco` no cargaba nada. Y sus
ids estaban DUPLICADOS, porque `shared/moreExamples.ts` (786 líneas, **0
importadores**) seguía teniendo una copia. Comparadas las dos copias parámetro a
parámetro: **cero defaults divergentes**; solo cambiaba `category`.

- Registrados los 21. **Borrado `moreExamples.ts`** (786 líneas).
- Quitados los stubs `legacy("diagrid")` y `legacy("pergola")`, que
  **secuestraban el id** de los paramétricos del mismo nombre. El comentario del
  propio fichero decía «hasta que se registre moreExamples»: ya está.
- `node tests/run.mjs categorias` → **3/3**, y ahora son **161 ids** (antes 142)
  y **115 ejemplos construidos y medidos** (antes 94).

### 2. Un test que cruza las CUATRO listas ✅ — `tests/casos/listas_de_ids.mjs`
Registry ↔ `vite.config.ts` ↔ carpetas con `index.html` ↔ `_ids.txt`. Es el que
habría cazado lo de arriba y no existía: `categorias-arbol` y `salud-ejemplos`
solo miran lo que YA está registrado, así que lo que falta es invisible por
construcción. Lee el registry **de verdad** (arranque en seco con
`window`/`document`/`localStorage` de mentira, como `categorias-arbol`), no con
una regex: un fichero puede exportar varios `ExampleDef`.

**Queda en rojo a propósito**, porque son descuadres reales que siguen:

| comprobación | nº | cuáles |
|---|---|---|
| carpeta con `index.html` y sin `ExampleDef` | 5 | `benchmark-steel-beam`, `cortante-basal`, `espectro-nec`, `plate-thick-validacion`, `releases-demo` |
| carpeta sin entrada en vite (`/<id>/` = 404) | 3 | `benchmark-steel-beam`, `estructura-mixta`, `releases-demo` |
| `_ids.txt` con ids que no existen | 1 | `plate-thick-validacion` |

Corregidos por el camino: `calc-editor` fuera de `_ids.txt` (su página no
existe) y `col-placa` dentro (faltaba). `benchmark-steel-beam` es una carpeta
COMPLETA invisible por los dos lados.

### 3. `edificio-muros` no tenía ni un muro ✅
Ponía `bracesMode = 1` (diagonales) y **nunca tocaba `murosMode`**, cuyo defecto
es 0 = ninguno: el ejemplo llamado «Edificio con Muros de Corte» salía con **cero
cáscaras de muro**. Es el mismo bug que `CLAUDE.md` da por cerrado el 2-sep para
`edificioAporticado`. Ahora `bracesMode = 0`, `murosMode = 3`, `tMuro = 0.25`,
como su gemelo bueno `edificio-con-muros`. Además su
`defaultShellResult: "membraneYY"` **no estaba en su propia
`availableShellResults`** y `filterShellResultOptions` lo borraba del desplegable.

### 4. La J del rectángulo, con los lados cambiados ✅
`shared/beamFixedFixedE2k.ts` hacía `β · lado_corto · lado_largo³` cuando Roark
es `β · lado_LARGO · lado_corto³`, y la tabla de β iba corrida una fila (cuadrado
→ 0.196 en vez de 0.141). Ahora usa **la misma fórmula continua que el resto del
árbol** (Timoshenko, la de `materials.ts` y `cadSections.ts`), con lo que además
desaparece otra copia:

```
0.40x0.40  β=0.1408  J=3.60533e-3      (Roark 1:1   0.1408)
0.30x0.60  β=0.2289  J=3.70786e-3      (Roark 2:1   0.2289)
0.25x0.80  β=0.2678  J=3.34701e-3      (Roark 3.2:1 0.2655)
0.20x1.00  β=0.2913  J=2.33071e-3      (Roark 5:1   0.2909)
```
Antes la viga 0.30×0.60 salía **×4.67**. Hoy no lo nota nadie (su único
consumidor no está registrado ni compilado): era una trampa cargada.

### 5. La unidad de tensión: leyenda y tooltip decían cosas distintas ✅
`units.ts` tiene 9 unidades y arranca en `tonf/m²`; `getViewer.ts` tenía **8**
(faltaba `kip/ft²`) y arrancaba en `kN/m²`. Y `main.ts` sincronizaba fuerza y
desplazamiento **pero no la tensión**. En los sólidos la barra de color rotulaba
kN/m² y el tooltip tonf/m² para el mismo número: **×9.80665**.

### 6. Google Analytics del proyecto original ✅
**15 `index.html`** cargaban `gtag.js` con una cuenta que no es nuestra. Salió al
mirar por qué el barrido daba `console.error` en todas las páginas.

## Lo que NO toqué, y por qué (lo decides tú)

- **NEC-SE-DS escrita dos veces con números distintos**: `espectro-nec/espectroNec.ts`
  (6 columnas de Z, 5 regiones η) y `shared/espectroNEC.ts` (**5 columnas, falta
  la zona IV**; 3 regiones). Con Z = 0.40 y suelo D: Fa +1.67 %, **Fd +7.56 %,
  Fs −7.03 %** — y Fd/Fs están **intercambiados** (la tabla de 5 es la de 6 leída
  una casilla corrida). Peor: `periodoAproximado` usa α = 0.9 con un comentario
  que dice «pórtico CON muros», cuando la tabla da **α = 0.75** con muros: para
  hn = 18 m, Ta 0.7439 s contra 0.4806 s, **+54.8 %**, y eso va directo al
  cortante basal. Afecta a los tres modelos de `test-m`. **Mueve los números de
  la tesis: no lo cambio yo.**
- **Rótulas plásticas: un cero constante.** `shared/plasticHinges.ts:155` lee
  `analyzeOutputs.frameBendingMoments`, que **no lo escribe nadie en el repo**.
  ⇒ Mi = Mj = 0, ratio = 0, «Elástico» siempre, y el panel dice «Total rótulas
  formadas: 0» **con cualquier carga** — súbele el sismo ×100 y sigue en 0. Y
  `buildHingeObjects3D` descarta las elásticas, así que no se dibuja ni una
  esfera. Es el hermano del `timings` que ya quité: o se puebla el campo o el
  panel se quita. 239 líneas y un panel ASCE 41-17 que no mide nada.
- **El visor dibuja los ejes locales 90° girados**:
  `viewer/objects/utils/getTransformationMatrixBeam.ts` sigue con la tríada vieja
  y **no recibe `ang`**. Las 471 barras a 90° del galpón se extruyen en el plano
  equivocado (una C 200×50 pasa de I = 6.20e6 a 0.53e6 mm⁴). Es dibujo, no
  cálculo, pero engaña al mirar.
- **Gravedad y ρ**: `materials.ts` ya expone `GRAVEDAD` y `MASA_HORMIGON_t_m3` y
  **no los importa nadie**. Siguen 9.81 y 9.80665 conviviendo (el mismo modelo
  pesa 0.034 % distinto en el `.s2k` y en el `.f2k`), `csi-importer` con ρ = 2.4
  (−1.93 % de masa) y la zapata gemela con el **×9.81**.
- **~2 400 líneas más que no compila nadie** (`tablero-puente/s2kImporter.ts` y
  `e2kImporter.ts`, `cli-modeler/pavimentador.ts`, `zapata-aislada/tclExporter.ts`,
  `tutorials/tutorialPanel.ts`, `cad-draw/cadDrawMouse.ts`, `cadDrawRender.ts`).
- **78 `catch {}` de `hekatan-ui`** (60 en `viewer/drawing/drawing.ts`): la fase
  3c solo miró `examples/src`.

## `npm test` — los 13 fallos, con nombre y número

**No los introduje yo** (no toqué el solver, ni el C++, ni el WASM, ni `tests/`),
pero **la mezcla actual sí es culpa mía**: mi revert dejó `examples/src` en el
commit del 16-sep mientras `hekatan-fem/` conserva cambios sin commitear. Esa
combinación nunca existió como tal.

| caso | comprobación | medido | límite |
|---|---|---|---|
| `placa-momentos-navier` | joints M vs SAP2000 | **43.109 %** | 0.10 % |
| `automesh-transfinito` | (e) SAP2000 (juez) | **99.266 %** | 0.50 % |
| `paridad-py-areaspring-edge` | Python vs WASM (3 filas) | **5.9 / 6.2 / 6.9 %** | 0.00 % |
| `automesh-vs-etabs` | los 25 nudos contra ETABS | **11.936 %** | 0.00 % |
| `muelle-area-y-nudo-colgado` | nodal vs SAFE | 3.210 % | 1.50 % |
| `animacion-modal-es-el-modo` | 3 filas | «no devolvió modos en 240 s» | — |
| `automesh-pavimentador` | — | `ERROR: U is not iterable` | 0/1 |

Dos que contradicen la documentación:
- **`placa-momentos-navier` a 43 %** contra SAP2000. `CLAUDE.md` lo vende como
  «= ETABS 22 **0.0000 % joint a joint**». Es el test que arbitra la recuperación
  de momentos en los joints y el `SIGNO_CSI = −1`.
- **El oráculo Python ya no coincide con el WASM** en los muelles de área (5.9 /
  6.2 / 6.9 % con límite 0.00 %), cuando `CLAUDE.md` dice «10 modelos al 0.0000 %».

`automesh-transfinito` y `automesh-pavimentador` fallan porque el comando `arco`
y las directivas `area`/`hueco` **no existen en el `cliModeler.ts` del commit**:
son la obra en curso de la otra sesión, la que mi revert destruyó.
`animacion-modal` NO falla por número: **aislado da 21/21**; en la suite completa
el modal se pasa de los 240 s.

Y `CLAUDE.md` sigue diciendo «Hoy: **335/335** (261 s)». Son 616.

## Barrido puppeteer de los 162

`cli/barrido_162.mjs` — por cada id: `?t=<id>` (0 pageerror, 0 console.error,
canvas, nudos y elementos > 0, sin NaN), **equilibrio en las TRES componentes**
(ΣR_i + ΣF_i de los nudos libres = 0; solo Z da falsos negativos con viento),
modal en los modelos chicos, **que NO navegue** al abrirlo desde el selector, y
la página standalone `/<id>/`. Escribe una línea JSON por id según termina
(`cli/shots/barrido162/resultados.jsonl`) y se reanuda solo.

**En curso: 47/162, 16 en rojo.** Lo que ya se ve:

- **8 vigas en voladizo `W2_viga_flexion_*_cantilever`** no cierran equilibrio en
  Z: `W2_viga_flexion_concrete_cantilever`, 11 nudos y 1 apoyo, da
  ΣRz = 12.722 contra ΣFz(libres) = −12.086 → **5.26 %**. Una reacción que no
  cuadra con la carga aplicada; hay que mirarlo.
- 4 `benchmark-paz-*` tumban el navegador (`ConnectionClosedError`): son modales,
  y con 2 GB libres no entran. Hay que medirlos aparte.
- `arco` sale con 0 nudos porque el barrido pasó por él **antes** de que lo
  registrara: hay que rehacerlo.

⚠️ **Lección de método**: el `ReferenceError: colorMapStressUnit is not defined`
de `cantilever-beam-q4` **no se reproduce**. Fue un artefacto de estar EDITANDO
el código mientras el barrido corría (vite recompilando en caliente). No se puede
tocar el árbol durante el barrido; los que fallen hay que re-medirlos con el
árbol quieto.

**Máquina:** RAM libre 2.04 GB · disco C libre 6.29 GB (el tope de parada son
3 GB de disco: lejos).

---

# ⚠️ CORRECCIÓN DE MÉTODO — la cifra de `rigidOffsets` está medida contra el juez equivocado

Jorge, 18-sep-2026: **«primero no es contra ETABS, es contra SAP2000; luego es
contra ETABS»**.

## Lo que hice mal

Toda la FASE 1 de arriba mide el efecto de `rigidOffsets` **contra ETABS**:

```
M2 de columna, tonf·m — harness hekatan-fem/test_offset_m2col.exe
   A (hoy, sin offsets)  +15.2 %        ← contra ETABS
   B (offsets en K)       +4.8 %        ← contra ETABS
```

El harness **solo tiene una referencia**, y es de ETABS
(`test_offset_m2col.cpp:43`, `static double ETABS[5] = {1.57, 2.13, 4.26, 8.16,
10.40}`). El caso `tests/casos/mesa_torsion_fuerzas.mjs` tampoco tiene árbitro
SAP2000: su JSON es `tests/datos/mesa_torsion_scp_etabs.json`, de ETABS 19.1.

**La regla es que el juez es SIEMPRE SAP2000.** ETABS sirve para comprobar su
propia semántica, y lo que no cierre con él se escribe como inconcluso, no como
medida.

## Y aquí además hay un motivo técnico, no solo de método

**ETABS pone brazos rígidos automáticos por defecto.** Está medido y escrito en
este mismo repo (`CLAUDE.md`, «Por qué offsets = 0»): con `AssembledJointMass` se
ve que ETABS **no pesa el tramo de viga que cae dentro de la columna** — 1857.4
in³ exactos en el Paz 6.3, un +2.94 % uniforme en las frecuencias.

O sea que medir el efecto de **poner brazos rígidos** usando como juez a un
programa **que ya los pone solo** mezcla dos cosas: el arreglo que se quiere
medir y la semántica del juez. En SAP2000 no aparecen solos, así que ahí el
efecto se ve limpio.

Dicho de otra forma: el +4.8 % de la columna B puede ser el resto del arreglo, o
puede ser la diferencia entre MIS offsets y los que ETABS se pone por su cuenta.
Con esta medida **no se puede distinguir**, y por eso no vale.

## Estado real del pendiente

| | |
|---|---|
| `rigidOffsets` llega al solver | **NO**. El `deform` del WASM recompilado a las 20:54 sigue con **80 parámetros**, ninguno para los offsets. Hay que añadir 3 y recompilar. |
| efecto medido contra **SAP2000** (el juez) | **SIN MEDIR** |
| efecto medido contra **ETABS** (la alternativa) | +15.2 % → +4.8 %, **pendiente de re-medir**: no vale como prueba por lo de arriba |
| C++ = Python | 0.02 % en las 15 celdas — esto sí se sostiene, es paridad entre dos motores nuestros, no un juicio |

## Cómo medirlo bien, cuando haya RAM

1. Mismo modelo y **misma malla nudo a nudo** en Hekatan y en SAP2000
   (mesa-torsión, que es el que tiene el interruptor).
2. **`offsets` puestos explícitamente en los dos programas**, con el mismo valor
   (col top = h_viga/2, extremos de viga = b_col/2). Nada de dejar que cada uno
   ponga los suyos.
3. Generar la referencia con el driver que ya existe
   (`galpon-bodega-electoral/csi_desde_dump.py sap …`), como se hizo para el
   galpón, y guardarla junto a la de ETABS.
4. Recién entonces, la de ETABS **detrás** y etiquetada como alternativa: si
   cierra, se dice; si no, queda **inconcluso** por escrito.

⚠️ Hasta que eso esté, **que nadie cite el +15.2 % → +4.8 % como bueno**.
