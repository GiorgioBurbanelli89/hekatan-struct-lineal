# TS de cálculo muerto (el C++/WASM hace el cálculo) — inventario 2026-11-01/02

Regla de Jorge: borrar solo el TS de cálculo MUERTO cuyo equivalente C++ corre,
y NUNCA el TS que sirve sin WASM (oráculo, Node/CLI, workers, pruebas).

Clases: **A** vivo (lo corre UI/CLI/test) · **B** fallback/oráculo sin WASM ·
**C** muerto con equivalente C++ que corre · **D** muerto pero SIN equivalente C++ (no se borra).

## hekatan-fem/src

| archivo | clase | evidencia | acción |
|---|---|---|---|
| deform.ts | B | oráculo TS: `hekatan-struct-py/tests/oraculo_ts.mjs` lo empaqueta; `deform.test.ts`, `analyze.test.ts`, `cli/cmp_ts_deform.mts` | se queda |
| utils/getGlobalStiffnessMatrix.ts | B | lo importa `deform.ts` | se queda |
| utils/shellQ4.ts | B | lo importan `getLocalStiffnessMatrix.ts`/`getTransformationMatrix.ts`; `test_shells_orientacion.py` (motor="ts" = shellQ4.ts) | se queda |
| utils/getLocalStiffnessMatrix.ts, getTransformationMatrix.ts | A | `analyze.ts`, `index.ts`, tests/casos (brazos, releases), `hekatan-ui/viewer/klocalMatlab.ts` | se queda |
| analyze.ts | A | `index.ts`, `cliModeler.ts`, oráculo, tests/casos | se queda |
| planeQ4.ts, layeredQ4.ts, layeredShell.ts, mitc3.ts, fiberSectionCft.ts, menegottoPinto.ts | A | TS puro sin C++; usados en examples (triangularPlate, conexionRbs, exampleRegistry), cli_fem_benchmark, validation | se queda |
| cargaMovil.ts, hiperestatico.ts | A | `index.ts`, cli, validation | se queda |
| utils/shellElementK.ts, placaAT.ts, triRecoveryCpp.ts, dkqJoints.ts, cargaUniformeBarra.ts, insertionPoint.ts, atarAristas.ts, diafragmaConApoyo.ts, releasesA12.ts | A | `index.ts`/`deformCpp.ts`/`modalCpp.ts`/`analyze.ts`, tests/casos | se queda |
| *Cpp.ts, wasmModule.ts, data-model.ts | A | envoltorios del WASM (no duplican cálculo) | se queda |
| nonlinearCpp.ts | — | sin importadores, pero es la puerta al C++ no lineal, no cálculo TS | se queda (fuera de alcance) |
| batheTimeIntegration.ts (234 l) | D | 0 importadores; el C++ NO tiene el esquema compuesto de Bathe (modal.cpp solo subespacio, TH = Newmark) | se queda |
| **didacticSolver.ts** (587 l, 21.3 KB) | **C** | 0 importadores (grep imports/dynamic/strings en todo el repo); el C++ `didactic.cpp` corre vía `didacticCpp.ts` → `didacticSolveCpp` (usado por `calc-editor/calcEngine.ts`, `shellElementK.ts`) | **git rm** |
| **utils/shellQ4_DKMQ.ts** (361 l, 16.4 KB) | **C** | 0 importadores; `shelltype dkmq` corre en `shellQ4_DKMQ.cpp` (WASM y builds nativos) | **git rm** |

## Fuera de hekatan-fem (solo mirado)

| zona | resultado |
|---|---|
| hekatan-ui/src, examples/src | el cálculo de K/solver va por `hekatan-fem`; no hay copias TS muertas del C++. Sin importador pero NO cálculo duplicado: `examples/src/shared/modal.worker.ts` (envoltorio del modal C++), `panelEspectral.ts`, `materials.ts`, `hekatan-ui/src/cad/kLocalLisp.ts`, ejemplos sin registrar (`benchmarkSteelBeam.ts`, `plateThickValidacion.ts`) → no se tocan |
| hekatan-fem/validate_cmcr.ts | importa `examples/src/shared/centroMasaRigidez.ts`, que ya no existe en disco (otra sesión) → roto, no se toca |
| website, tools, banco-elemento, hekatan-fem-py, hekatan-geotechnic | sin TS de cálculo duplicado (banco = Python; geotechnic/solver.ts = oráculo, prohibido) |

## Prueba de muerte (renombrar a .bak en el mismo árbol, luego restaurar)

| prueba | antes | con .bak |
|---|---|---|
| `tsc --noEmit` hekatan-fem / examples / hekatan-ui (errores previos) | 30 / 199 / 46 | 30 / 199 / 46, diff = 0 |
| `node tests/run.mjs placa` | 132 ok, 0 falla | 132 ok, 0 falla |
| `node tests/run.mjs k_local` | 45 ok, 0 falla | 45 ok, 0 falla |
| pytest test_oraculo_ts + test_shells_orientacion | 6 passed, 42 skipped | 6 passed, 42 skipped |

`npm test` completo: ya en la línea base muere por **OOM de Node** (893 filas,
1 FALLA previa «bundle del visor: falta»); no sirve de comparación entera, por eso los filtros.
Vite build no se corrió (RAM); tsc cubre los mismos imports estáticos.

## Bitácora
- ✅ Inventario y prueba de muerte: 2 C, 1 D.
- ✅ git rm de los 2 C (commit local, sin push).
- ⏳ Quedan referencias en texto (no código): `CLAUDE.md` l.190/206 («tres copias de la tríada… didacticSolver.ts»), `hekatan-fem/DKMQ_USAGE.md`, `examples/src/shared/fundamentos.ts:141`. No se editaron (CLAUDE.md lo leen otras sesiones; decidir Jorge).
- ⏳ `batheTimeIntegration.ts` (D) y `validate_cmcr.ts` roto: decisión de Jorge.
