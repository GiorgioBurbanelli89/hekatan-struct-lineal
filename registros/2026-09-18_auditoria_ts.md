# Auditoría .ts — 2026-09-18

Encargo: «el CAD .ts solo debe ser CAD» + la regla que añadió Jorge:
**«No debe haber NADA que no tenga que ver con el nombre del archivo.»**
Modo: AUDITORÍA. **Nada aplicado. Sin commit. Sin deploy.**

> AVISO: mientras se auditaba, **otra sesión estaba editando el repo**
> (17:10 `workspace/main.ts`; 17:36–17:38 se extrajo `shared/moreExamples.ts`
> a carpetas propias `arco/`, `burj/`, `eiffel/`…). `getCad3d.ts` NO se tocó
> (última escritura 02:32), así que sus líneas son válidas; las de
> `workspace/main.ts` pueden ir algo desfasadas.
> Lo único que ha creado esta auditoría es **este fichero**.

Método: 5 frentes en paralelo (shared/, hekatan-ui/src, hekatan-fem/src,
examples/src sin shared/, y getCad3d.ts a mano). Con 4 GB de RAM no se lee el
repo a ciegas: grep de firmas + lectura dirigida.

---

## ✅ Funcionó — lo confirmado con evidencia

### La causa raíz, y no es ningún bug concreto

`cli/check_deploy_ejemplos.mjs:27` → `ok = errs.length === 0 && info.canvas`.

El test aprueba si **no hubo excepción y existe un `<canvas>`**. No lee ni un
número. Y en el árbol TS hay **229 `catch {}` vacíos** (122 en `examples/src`
sin `shared/`, 88 solo en `workspace/main.ts`), que convierten cualquier fallo
en `pageerror: 0`. De los 196 PNG de `cli/shots/deploy/` no los mira ningún
assert; **1 de 8** `check_deploy*.mjs` comprueba algo numérico.

Mientras el criterio sea ese, ningún hermano del bug del modal se detecta solo.

### CAD que no es CAD — `getCad3d.ts`

12 197 líneas. CAD de verdad (rejilla, ejes, cotas, snaps, dibujo, selección,
deshacer) ≈ **1 160 líneas → ~10 %**. El resto, por bloques medidos:

| líneas | qué es | dónde debería vivir |
|---|---|---|
| 1926-4210 (~2285) | generadores + FEM + `bishopFOS()` (equilibrio límite de taludes) | `geotecnia/`, `generadores/` |
| 4292-5540 (~1250) | paneles Tweakpane y secciones | `hekatan-ui/` |
| 9846-10875 (~1030) | 11 generadores «icónicos» (Eiffel, Burj, Gateway, Diagrid, Pérgola…) | ya existen como ejemplos: **están duplicados** |
| 9100-9845 (~745) | matrices simbólicas + panel de inspección | `report/` |
| 6567-7210 (~643) | suite de validación + generador de .e2k y .py para ETABS | `tests/` |
| 7217-7610 (~394) | import/export IFC, E2K, S2K, OpenSees | `io/` |
| 10876-11240 (~365) | log, pushover, histéresis, no lineal, Steel02 | `analisis/` |
| 11241-11540 (~300) | informe FEM — con **247 líneas inalcanzables** dentro | `report/` |
| 6014-6250 (~236) | `runAnalysis` (deform + analyze) | `analisis/` |
| 5820-6010 (~190) | análisis modal y su animación | `animateMode.ts`, que ya existe |
| 5546-5800 (~255) | `buildExportText` / `showExportPanel` | `io/` |
| 4251-4300 (~50) | conversión de unidades | `units.ts`, que ya existe |

Además cuelga **9 globales de `window`**, incluidos **dos mandos CAD
distintos** (`__cad` en 4933 y `cad` en 12102), y exporta `cadActive`, un
estado global de aplicación que consume **un solo** fichero (`curves/main.ts`).

Los 7 ejemplos «Portado desde FEM Studio … getCad3d.ts (líneas X-Y)» citan
líneas **desfasadas ~39**: los comentarios ya mienten.

### Los números que no cuadran

- **Amplitud del modo: tres valores y dos definiciones de «extensión»**
  `getCad3d.ts:5896` = 5 % del **lado mayor** · `animateMode.ts:151` = 3.7 %
  de la **diagonal** · `gifExport.ts:228` = 6 % de la **diagonal**.
  Edificio 20×15×30 m → 1.500 / 1.445 / 2.343 m. El GIF sale **1.62×** el
  visor. Nadie pasa `scalePercent`: mandan los defectos.
- **Módulo del hormigón, f'c = 210, tres valores**: 21 458 891 (CLI,
  15100√f'c), 21 328 888 (paneles e IFC, 4700√f'c), 21 460 000 (csiImporter).
  Dispersión **0.61 %**. La fórmula está copiada en **20 sitios**;
  `shared/materials.ts`, que ya la tiene, **no la importa nadie**.
- **Densidad del hormigón**: `24/9.80665 = 2.4473` (14 sitios) vs `2.4`
  (4 sitios) → masa **+1.97 %**, periodos **+0.98 %**. Y peor:
  `zapata-aislada:18` usa `24/G` (masa) mientras su gemelo
  `zapata-aislada-validacion:31` usa `24` (peso) → **×9.81** entre dos
  ejemplos de la misma zapata.
- **Gravedad**: `e2kExporter:140` usa 9.81 y `:345` usa 9.80665;
  `s2kExporter:751` escribe 9.81 y `f2kExporter:111` escribe 9.80665 para el
  mismo campo → el mismo modelo pesa distinto en .s2k y en .f2k.
- **Tríada de ejes en 6 implementaciones divergentes**:
  `hekatan-fem/utils/getTransformationMatrix.ts` (CSI, la buena) ·
  `utils/shellQ4.ts:585` · `didacticSolver.ts:274` («copia exacta de…») ·
  `hekatan-mesh/getMesh.ts:117` (mismo nombre, gira la normal a +Z) ·
  la gemela en C++ · y **`hekatan-ui/viewer/objects/utils/
  getTransformationMatrixBeam.ts:11`, que es la tríada VIEJA y abandonada**
  (`eje2 = [-m/D, l/D, 0]`) y además **ignora el ángulo `ang`**.
  O sea: el visor dibuja las flechas de ejes locales y las secciones
  extruidas en un marco girado 90° respecto al que calcula V2/V3/M2/M3.
- **`rigidOffsets` se empaqueta a WASM y no se pasa a la llamada**
  (`deformCpp.ts:93-96` vs `:260`). El C++ lo implementa
  (`cpp/utils/getGlobalStiffnessMatrix.cpp:85`). `mesa-torsion` tiene un
  interruptor «Rigid offsets ETABS-like» y su informe (`:372`) imprime
  **«ON (col top -0.20m, viga ends -0.20m)»** mientras el solver los ignora.
- **`femToolsRegistry.ts:158`**: `timings: {assembly:1, solve:2,
  internalForces:1, total:6}` **clavados**. El panel «Solver Log» imprime
  «SparseLU → 2.0 ms … ✓ Completado: 6.0 ms» igual con 3 nudos que con 6 600.
- **`zapataAislada.ts:384-385`**: los **dos** `if` buscan el mínimo y
  `qMax_kN` arranca en 0 → zapata enteramente levantada da `qMax = 0`,
  `ratio = 0` y se muestra **«✓ OK»**.
- **`modalScale`** se calcula en 4 sitios de `getCad3d.ts` (5850, 7772, 7788,
  12095) y **nunca se lee**.
- **`getModalPanel.ts:368`**: `slider_setMode` es un **cuerpo vacío**
  («Override desde getModalPanel via cierre» — nunca se hizo). Hacer clic en
  una fila de modos no hace nada, sin error.

### Código muerto medido

- `workspace/mathReport.ts` — **48 KB, 0 importadores**, y con defaults que
  **no coinciden** con los del modelo (`Mx_simple ?? 0.5` contra `default: 1`;
  `q_adm ?? 10` contra `?? 20`). Hoy no miente porque no corre.
- `workspace/main.ts:4166` — `if (false && currentExample) {`: **368 líneas**.
- `getCad3d.ts:11268` — **247 líneas** tras un `return;`.
- `shared/`: 9 ficheros sin un solo importador (~1 143 líneas):
  `animateK3Cyclic`, `catalogoSecciones`, `centroMasaRigidez`,
  `distributedLoad`, `e2kDiagnosticoDxf`, `e2kGirosSueltos`, `materials`,
  `panelEspectral`, `recuperarRigidezPiso`.
- `hekatan-fem/src`: sin importadores `batheTimeIntegration`,
  `didacticSolver`, `nonlinearCpp`, `wasmModule`, `shellQ4_DKMQ`.
  En `cpp/built/`: **6,09 MB** de `.bak`/`.dse`/`.antes` que no carga nada.
- `gifExport.ts:226` — `exportModeAnimationGif`, **la función que da nombre
  al fichero, no la llama nadie**.
- `cli/shots/deploy/_ids.txt`: último commit **2026-09-09** (9 días). En disco
  está sin commitear con **+40 / −36**. El CI lee la vieja.

### `shared/` que no es compartido

Módulos con **un solo consumidor**, casi todos `getCad3d.ts`:
`elementReport` (637), `reportExplained` (541), `ifcAnalyticalParser` (506),
`helpTour` (386), `openseesIO` (367), `Draw3DIfc` (364) → **~2 800 líneas**
que deberían vivir en un `getCad3d/` propio.
Y al revés, lo que sí debería estar en `shared/` y está copiado:
`downloadTextFile` **×4**, `solveDense` **×5**, el drag de paneles **×6**
(mientras `makeDraggable.ts` existe y nadie lo usa).

### El oráculo caducado

`index.ts:4` tiene `deform` TS **comentado**: producción usa el C++. Pero
`utils/shellQ4.ts` (que ignora `membraneModifiers`, `plateFormulations`,
`drillingTypes` y el reloj de arena `khg=2e-4` que sí tiene el C++) **sigue
siendo el oráculo** de `cli/cmp_ts_deform.mts`,
`hekatan-struct-py/tests/oraculo_ts.mjs` y
`validation/06-etabs-api/…/test_wall_q4.ts`.
Esas validaciones no prueban lo que dicen probar.

---

## ❌ No funcionó / descartado

- Leer los ficheros gordos enteros (585 KB, 464 KB, 391 KB): no cabe en 4 GB
  y no hace falta.
- `tsc --noEmit` como oráculo: los 166 errores son preexistentes y **los bugs
  que buscamos compilan bien**. Ninguno de los hallazgos de arriba sale de ahí.
- El `case "shell"` inalcanzable **no está en `getCad3d.ts`**: es
  `cli-modeler/cliModeler.ts:908`, y **ya está arreglado** (se quitó el alias
  `ang`). Queda un resto menor: `case "ang"` (:793) no comprueba que el ID sea
  de una barra, así que `ang <shellID>` se traga sin error y no hace nada.
- **Corrección a un agente**: el `Math.tan(45 * 0.5)` de `getViewer.ts:362`
  (radianes en vez de grados) es real, pero el efecto **no es ~6×**: la
  distancia sale 1.40·gs en vez de 1.71·gs, o sea **22 % corta**. Comprobado.
- No encontré ningún estado de van.js reemplazado en vez de asignar `.val`.
  Ese patrón está limpio hoy.

---

## ⏳ Falta

- Que Jorge decida qué se toca. **Nada aplicado.**
- Las 10 primeras de la lista de 10 minutos (abajo) son ~2 h en total y cada
  una borra una mentira.
- Lo que más rinde y no es de 10 minutos: **que
  `check_deploy_ejemplos.mjs` compare un número contra un valor esperado**.
  Con 229 `catch {}` en el árbol, el criterio actual no puede fallar aunque
  todo esté mal — que es exactamente lo que pasó durante meses.
- Segundo por rendimiento: **sellar los resultados con el caso**
  (`analyzeOutputs.caseId`) y que el visor se niegue a pintar si no coincide.
  Es el único cambio que impide que el bug vuelva por otra puerta.
