# `plateFormulations = 2`: dos significados que chocaban (19-sep-2026)

Rama `sin-binario`. Sin deploy, sin push. Juez = **SAP2000**.

## El fallo
- `data-model.ts` + exportadores: **2 = Membrane** (`MODELINGTYPE "Membrane"`, `Type=Membrane`).
- 17-sep (`f2f8bba5d`): la placa DSE de Wilson se enchufó TAMBIÉN en el 2 (`shellQ4.cpp`).
- → Test M / dual, galpón, importador CSI e ITW (todos ponen 2) pasaron a flexar con OTRA placa.

## 1) ✅ Qué hacía el 2 ANTES (medido, no supuesto)
Placa 4×4 m, malla 4×4, t = 0.1, borde con w = 0, P = −10 en el centro. Mismo TS, cambiando
solo el WASM (`scratchpad/pf2/medir.mjs`):

| WASM | pf=0 | pf=2 | pf=4 | flexión 0 |
|---|---|---|---|---|
| `6be372b75` (16-sep, antes) | −1.032929e−3 | **−1.032929e−3** | = pf 0 | 0 |
| `main` | −1.042949e−3 | = pf 0 | = pf 0 | 0 |
| árbol de ayer (`f61a629c`) | −1.032929e−3 | **−1.265599e−3** (DSE) | = pf 0 | 0 |
| **nuevo (`abce15ce`)** | −1.032929e−3 | **−1.032929e−3** | **−1.265599e−3** | 0 |

**Porqué:** en `6be372b75` el despachador solo miraba 1 (Thin) y 3 (DKMQ); el 2 caía en
`getLocalStiffnessMatrixShellQ4` = MITC4, **igual que el 0**. En el solver el 2 NUNCA fue membrana.
La membrana del solver es **flexión 0** (`bendingModifiers = 0` → `sinFlexion`); el galpón pone las dos.

❌ **OTRO bug (previo, sigue):** el 2 es Membrane en el exportador pero MITC4 con flexión en el
solver. Test M / dual (`testM.ts:140`, `sweep_case.mjs:230`) y el importador CSI (`csiImporter.ts:318`)
calculan con flexión y exportan «Membrane» → SAP recibe otro elemento.
También `slabBeamsColumns.ts:129` y `plateWithBeams.ts:89` ponen 2 creyendo que es DKMQ (hoy 3).
⏳ Propuesta para alinearlos (NO aplicada): (a) quien quiere cáscara gruesa pone **0**
(testM, sweep_case, slabBeamsColumns→3 si querían DKMQ, plateWithBeams→3); (b) quien quiere
membrana pone 2 **y** flexión 0 (como el galpón; falta en `csiImporter.ts:318`); (c) luego el
solver puede hacer `2 ⇒ sinFlexion` sin romper a nadie. Hacer (c) hoy dejaría las losas del dual
sin flexión.

⚠️ El comentario viejo decía «MISMOS números que la OAPI de CSI»: falso. ETABS `SetSlab`
1 Thin / 2 Thick / 3 Membrane; SAP `SetShell_1` 1 Thin / 2 Thick / 5 Membrane
(`galpon-bodega-electoral/itw_sap_oapi.py:50`). Y el 1.491651 era el Poisson (`export_fidelidad.mjs`).

## 2) ✅ El arreglo
| archivo:línea | cambio |
|---|---|
| `hekatan-fem/src/cpp/utils/shellQ4.cpp:1777-1794` | DSE de Wilson en `plateForm == 4`; el 2 vuelve a caer al MITC4 |
| `hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp:137-160` | tabla 0/1/2/3/4 con lo medido |
| `hekatan-fem/src/cpp/utils/shellQ4_DKMQ.cpp:3` | «== 2» → «== 3» (comentario viejo) |
| `hekatan-fem/src/data-model.ts:138-160` | un solo comentario: 0..4, el 2 = Membrane solo exportador |
| `examples/src/cli-modeler/cliModeler.ts:730-735, 1475` | `shelltype id wilson\|dse\|4` → 4, `dkmq\|3` → 3 |
| `examples/src/workspace/modeloAHeks.ts:153-170` | escribe thin/thick/dkmq/wilson; el 2 → thick con aviso |
| `tests/casos/heks_ida_y_vuelta.mjs:100-131` | comentario + regex del aviso (límite igual) |

⚠️ El `shelltype id wilson` del 17-sep no estaba en el árbol de hoy (ni en ningún commit): los
`.heks *_w` daban «se esperaba thin o thick». Ahora sí lo lee (y dan pf = 4).

## 3) ✅ WASM (script real `hekatan-fem/build_wasm.sh`, con `-fexceptions`)
- antes `f61a629c61888e880f45baf13c5fd9dfce203e96` → después **`abce15ce64cf0642bb210af1f9ea5102202e1b21`**
- `deform.js` igual byte a byte (`2e6152254c…`).
- ⚠️ Lleva cambios AJENOS sin commit y sin validar (`deform.cpp`, `modal.cpp`, `utils/springsExtra.h`).
  Por eso el `.wasm` NO va en mi commit.

## 4) ✅ SAP2000 de juez (referencias guardadas, SAP NO se abrió)
**Membrana** — ITW (pf = 2), SAP2000 24 `ShellType 5 = Membrane` por OAPI (`itw_sap_oapi.json`):

| | Hekatan nuevo | SAP2000 Membrane | dif |
|---|---|---|---|
| I flecha centro | −1.500000 | −1.500000 | 0.000 % |
| I giro extremo | −0.600000 | −0.600000 | 0.000 % |
| II flecha punta | 0.354201 | 0.354201 | 0.000 % |
| III Cook 8×8 | 23.6021 | 23.602130 | 0.000 % |

(Carga en el plano: aquí la flexión no entra, por eso daba lo mismo con el 2 = DSE.)

**Wilson ahora en el 4** — mismos números que el 17-sep, dígito a dígito (borde duro, nudo 40):
t/L 0.001 −2.155929e+2 · 0.01 −2.156896e−1 · 0.05 −1.744266e−3 · 0.1 −2.253571e−4 · 0.2 −3.183158e−5
(SAP2000: +2.406 / +1.470 / +0.816 / +0.756 / +0.661 %). Tabla 8.4 16×16 también idéntica (1.04905 / 1.00357).

**Dual del artículo, variante A (pf = 2 + HB)** vs SAP2000 Shell-Thick (`sap_dual.json`):

| modo | SAP | antes (DSE) | después (MITC4) |
|---|---|---|---|
| 1 | 0.4841 | 0.4875 (+0.70 %) | 0.4826 (**−0.30 %**) |
| 2 | 0.4299 | 0.4353 (+1.24 %) | 0.4318 (**+0.44 %**) |
| 3 | 0.1546 | 0.1556 (+0.65 %) | 0.1542 (**−0.27 %**) |
| 5 | 0.1180 | 0.1199 (+1.65 %) | 0.1197 (+1.48 %) |

## 5) Suite `npm test`
- Antes (WASM `f61a629c`): **627/649**. Después: **627/647**.
- Cambia por mi arreglo: `heks-ida-y-vuelta` dual 4.405 % → **0.274 %** (se relee igual);
  `modal-participacion-etabs` (Test M, pf 2) modo 1 0.846 % → 0.347 % vs ETABS (todos ok).
- ❌ Ningún FALLA desaparece: los 17 que quedan no tocan el 2 (automesh-transfinito ×4,
  automesh-vs-etabs, listas-de-ids ×3, modal-todos, muelle-area, paridad-py ×3, placa-momentos-navier ×2,
  salud-ejemplos ×3) + ERROR `automesh-pavimentador` («U is not iterable»).
- ⚠️ `animacion-modal-es-el-modo` pasó de 3 FALLA a ERROR «bundle desactualizado»: otra sesión
  tocó `tutoriales.ts` (commit `fa87b2efe`) durante la corrida. No es de este cambio.

## 6) ⏳ Pendiente
- ✅ Commit local (sin push) sobre `fa87b2efe` con luz verde: solo estos 8 ficheros; de
  `cliModeler.ts` solo los 2 trozos de `shelltype`/comentario del deck (blob armado desde HEAD).
- ⏳ Alinear exportador ↔ solver (apartado 1, propuesta a/b/c).
- ⏳ `deform.wasm` a commitear junto con los fuentes ajenos cuando se validen.

---

## 7) Rama `membrana-2` (worktree `../hekatan-struct-membrana2`, desde `733eb3b4a`): el 2 = MEMBRANA en todo
Worktree aparte para no tocar los cambios ajenos sin commit de `deform.cpp`/`modal.cpp`/`springsExtra.h`.
`node_modules` = uniones al del principal (mismo `package.json`), pero `hekatan-fem`/`examples`/`hekatan-ui`/
`hekatan-mesh`/`website` apuntan al worktree (si no, el bundle cogería el WASM de la otra rama).

### ✅ Paso a — quien quería cáscara con flexión deja el 2
| sitio | antes → ahora | por qué |
|---|---|---|
| `testM.ts:140` | 2 → **0** | la referencia es SAP2000 **Shell-Thick** (`sap_dual.json`); el 2 ya calculaba el MITC4 = 0 |
| `cli/sweep_case.mjs:230` (+ `time_modal_testm`, `browser_limit/harness.js`, `.cmp_lib`, `.val_nuevo`, `.val_viejo`: copias de testM) | 2 → **0** | idem; mismos números |
| `slabBeamsColumns.ts:129`, `plateWithBeams.ts:89` | 2 («DKMQ») → **0**, no 3 | nunca fueron DKMQ (en jun-2026 el 2 ya caía en el MITC4) y su `.e2k` de `validation/modelos/roundtrip/*_B.e2k` salía `Membrane`. El 3 tampoco: el `.s2k` escribe el 3 como **Plate-Thin** (sin membrana) |
### ✅ Paso b — quien quiere membrana pone 2 + flexión 0 (como el galpón)
- `csiImporter.ts:318`: cubierta «Membrana (solo su plano)» = 2 → ahora también `membraneModifiers 1` + `bendingModifiers 0`.
- `modeloAHeks.ts`: el 2 se guarda como `shellmod id 1 0` (antes `thick` = flexaba) y avisa.
- `galpon.ts`: ya lo hacía; solo el comentario.
- `plantillas.ts` («Membrana (sin flexión)» = 2): no pone flexión 0; con el paso c ya es membrana de verdad.
### ✅ Paso c — solver
- `hekatan-fem/src/cpp/utils/shellQ4.cpp:1632-1640`: `plateForm` se lee junto a `sinFlexion` y `if (plateForm == 2) sinFlexion = true;`
  = lo MISMO que flexión 0 (Kb = 0; los θx/θy huérfanos los quita `getZerosIndices`, deform y modal). No se inventa nada.
- Comentarios coherentes: `getLocalStiffnessMatrix.cpp:137-147`, `data-model.ts:136-160`.
- Falso «MISMOS números que la OAPI» corregido en `plantillas.ts:210`, `itwBenchmarks.ts:66`, `banco_shell_escalon_b.mjs:49`
  (ETABS SetSlab 3 = Membrane; SAP SetShell_1 5 = Membrane).
### ✅ WASM (`hekatan-fem/build_wasm.sh`, solo fuentes del commit)
- base limpia `733eb3b4a` → `a9301d0fbba841d88a5571288634902a040231f7` · **nuevo `7dd30a50978bd4052ef37677e2befeda45ac3106`** · `deform.js` igual (`0f28e1da…`).

### ✅ SAP2000 de juez (referencias guardadas; SAP NO se abrió)
**Membrana ITW** (pf 2, SAP2000 ShellType 5): 1.500000 / 0.600000 / 0.354201 / 23.6021 — iguales antes y después (0.000 %).
**Placa 4×4, P fuera y dentro de su plano** (`scratchpad/m2/placa.mjs`):

| | w (Pz) base | w (Pz) nuevo | u (Px) base = nuevo |
|---|---|---|---|
| pf 0 | −1.032929e−3 | −1.032929e−3 | 3.462703e−6 |
| **pf 2** | −1.032929e−3 (flexaba) | **0** | 3.462703e−6 |
| pf 2 + flex 0 | 0 | 0 | 3.462703e−6 |
| pf 4 | −1.265599e−3 | −1.265599e−3 | 3.462703e−6 |

**Dual del artículo** (ms 1.0, 12 modos) vs SAP2000 24 Shell-Thick (`_v4_sap_modal.json`):

| | T1 | T2 | T3 | ΣUx | ΣUy | ΣUz | ΣRx | ΣRy | ΣRz |
|---|---|---|---|---|---|---|---|---|---|
| SAP2000 | 0.4841 | 0.4299 | 0.1546 | 99.14 | 85.38 | 58.57 | 53.24 | 59.66 | 85.68 |
| Test M nuevo (pf 0) | 0.4826 −0.30 % | 0.4318 +0.44 % | 0.1542 −0.27 % | 99.27 | 85.87 | 58.72 | 53.82 | 60.54 | 86.19 |

= exactamente lo de `733eb3b4a` con pf 2 (no empeora). Con pf 2 y el WASM nuevo el dual es OTRO elemento (losas y muros
membrana: T1 0.5422, +12 %): no hay referencia SAP Membrane del dual → ⏳ inconcluso, y no se usa.
**Wilson en el 4**: 14 placas (`pl_*_hard_w`, `pl16_*`) dígito a dígito iguales (−2.253571e−4 en t/L 0.1).
**Galpón deck** (`galpon-vs-sap2000-oapi`): 0.000 % vs SAP2000, igual que antes.

### ✅ Suite (caso a caso en procesos separados: el runner único revienta con «Fatal process out of memory: Zone»)
- base `733eb3b4a` + WASM `a9301d0f`: **570/591** (+ `ciclo-csi-ficheros` muerto por OOM Zone).
- rama: **622/643** = las mismas 570 + 52 de `ciclo-csi-ficheros` (esta vez no reventó; OOM intermitente, no del cambio).
- Única fila que cambia: `heks-ida-y-vuelta` dual «aviso SÍ» → «aviso NO» (ya no hay pf 2 en el dual), 0.274 % igual.
- Los 21 FALLA/ERROR son los mismos antes y después (automesh ×6, salud-ejemplos ×3, paridad-py ×3, placa-navier ×2, …).
- ⚠️ El worktree necesitó copiar del principal 381 ficheros sin seguimiento + 3068 ignorados de `tests/`/`validation/` y 74
  de `examples/src` (el registro del commit importa `burj`, `eiffel`, `opera`, `talud`, que NO están en ningún commit).

### ⏳ Queda
- `.s2k`: el 3 sale Plate-Thin y el 4 Plate-Thick, pero en el solver son DKMQ y DSE de Wilson (cáscara completa). Mismo tipo de choque.
- `f2k`: el 3 sale Shell-Thin. `analyze.ts` da momentos en membranas (flexión 0 o pf 2) a partir de los giros: no los anula.
- Triángulos (`getLocalStiffnessMatrixShell`) no miran ni flexión 0 ni pf 2.
- Referencia SAP2000 Membrane del dual (si Jorge la quiere).
