# e2k ETABS vs Hekatan Struct, modelo mercado (2026-11-04)

Herramientas: `cli/e2k_roundtrip_mercado.mjs` (parseE2k -> exportE2k, esbuild, sin navegador, heap 1.5 GB) y
`cli/comparar_e2k_capas.py` (compara por capas leyendo el texto). Origen: `C:\ETABS\mercado\mercado.e2k`.

## Hay 3 caminos de exportar
1. TS `exportE2k` CON `e2kModel` (lo que hace la app al importar un e2k): re-emite el texto crudo por seccion.
2. TS `exportE2k` SIN `e2kModel` (modelo hecho/editado en Struct): reconstruye.
3. Python `hs.abrir` -> `hs.guardar` (`escribir_e2k`): lee, malla (AUTOMESH) y reescribe.

## Resultado por capa (orig vs camino 1 / camino 2 / camino 3)
| Capa | 1 crudo | 2 reconstruido | 3 Python |
|---|---|---|---|
| STORIES (9, alturas) | igual | igual | distinto (replanta por cota Z) |
| POINT COORDINATES | 5963=5963 igual | 5963 (renumerados) | 7417 (mallado) |
| LINE COLUMN/BEAM/BRACE | 3695/7828/3222 igual | 3813/8939/2128 (parte/une, clasifica distinto) | 3673/11072/0 (BRACE->BEAM) |
| LINE ASSIGNS 14745 | igual | pierde MAXSTASPC/FLOORMESH; RELEASE y MINNUMSTA distintos | pierde MAXSTASPC/FLOORMESH |
| FRAME SECTIONS (18) | igual | 12 (faltan 6) | 12 |
| MATERIALS (6) | igual | 3 genericos | 3 |
| AREA ASSIGNS/CONNECT 1844 | igual | 1844, SECTION "DECK" generica, Deck1 -> Slab membrana | 1844, CARDINALPOINT ignorado |
| LOAD PATTERNS (5) | igual | igual | igual |
| LOAD CASES (8) | igual | 7 (sin EspectroX/Y) | 5 (sin Modal ni espectros) |
| COMBOS (23) | igual | 0 | 20 (faltan 3 con espectro/envolvente) |
| SHELL LOADS (3688) sum FVAL Dead 0.723339 / Live 1.265842 | igual | igual | igual |
| POINT/FRAME LOADS | vacio=vacio | igual | igual |
| RESTRAINTS 366 | igual | igual | igual |
| DIAPHRAGM | igual | SEMIRIGID -> RIGID | igual |
| ANALYSIS OPTIONS / MASS SOURCE | igual | pierde AUTOMESHOPTIONS | pierde ambos |

Camino 1: multiconjunto de lineas identico salvo 5 comentarios (`$ File...`, 3 cabeceras vacias) y un `END`; solo cambia el orden de secciones.

## Perdidas reales
- ✅ Camino 1 (importar mercado y re-exportar): SIN perdidas. Pero ojo: es texto crudo, ignora cualquier edicion hecha en Struct tras importar.
- ❌ Camino 2: sin combinaciones (23 -> 0; en la app solo vuelven si `elementInputs.e2kPaso` existe, y ese solo lo llena cli-modeler), materiales (6 -> 3 genericos), 6 secciones, casos de espectro, SEMIRIGID, DECK real, AUTOMESHOPTIONS, MAXSTASPC/FLOORMESH.
- ❌ Camino 3: sin casos Modal/espectro (avisa), 3 combos, BRACE, CARDINALPOINT, MASS SOURCE, ANALYSIS OPTIONS; el lector malla (7417 nudos, 16589 barras).
- Cargas de area: totales iguales en los 3 caminos.

## Corregido
- ✅ `hekatan-struct-py/src/hekatan_struct/e2k.py` linea 231: `exportar_e2k` escribia `J` (ETABS lo ignora, queda J=0); ahora `TORSION`. Test `test_exportar_e2k_basico_escribe_TORSION_y_no_duplica_area`; `pytest tests/test_archivos_csi.py` 44 pasan.
- ✅ "Duplica la carga de area": NO reproducible en `e2k.py` actual (solo `AREALOAD`, sin `POINTLOAD` repartido).

## Falta
- ⏳ Camino 2: llevar combos, materiales con nombre, casos espectro y DIAPHRAGM TYPE desde `E2kModel` al reconstruir (cambio grande, no hecho).
- ⏳ Camino 1: mezclar ediciones del modelo con el texto crudo.
- ⏳ `node tests/run.mjs e2k` no corrido (no se toco TS).
