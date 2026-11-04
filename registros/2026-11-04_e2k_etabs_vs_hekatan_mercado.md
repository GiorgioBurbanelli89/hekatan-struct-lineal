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

## Camino 2 conserva datos + camino 1 respeta ediciones (4-nov-2026)
Codigo: `examples/src/shared/e2kParche.ts` (nuevo), `e2kParser.ts` (foto `model.base` + `elementInputs.e2kPreservado`), `e2kExporter.ts`.
Test: `tests/casos/e2k_roundtrip_edicion.mjs` (20 filas, galpon_simple_plana). Demo: `cli/e2k_edicion_demo.mjs`.

- Camino 1 (importado): se compara el modelo actual con la foto tomada al importar. Sin cambios = crudo identico (0 lineas de diferencia). Con cambios, la diferencia se APLICA SOBRE EL TEXTO CRUDO seccion a seccion; lo no tocado sale igual.
- Camino 2 (sin `e2kModel`): `e2kPreservado` (casos, combos, funciones, materiales, secciones, props de area, DIAPHRAGM, MASS SOURCE, AUTOMESHOPTIONS) se inyecta al texto reconstruido.

| Capa (galpon simple, camino 2) | antes | despues |
|---|---|---|
| COMBOS | 0/23 | 23/23 |
| LOADCASE | 8/10 | 10/10 (espectros y modal) |
| MATERIAL | 1/6 | 6/6 (+1 generico sobrante) |
| FUNCTION | 0/4 | 4/4 |
| DIAPHRAGM SEMIRIGID | RIGID | SEMIRIGID |
| AUTOMESHOPTIONS | no | si |

- ✅ Ediciones parcheadas: barra/area borrada, barra nueva (nudos viejos o nuevos), nudo movido, nudo nuevo/borrado, seccion de barra cambiada (FRAMESECTION General nueva), delta de carga nodal (patron Dead o el primero), apoyos. Ida y vuelta: solo cambian ~12 lineas, re-importar da el modelo editado y re-exportar eso da el mismo texto.
- ✅ `node tests/run.mjs e2k` 208/208, `e2k_prop` 10/10, `punto_insercion` 6/6.
- ❌ Limites (salen en `input.avisos`, no se aplican): areas nuevas, espesor de area, tramos partidos (`C1-2`), nudos de malla/`np@`, mover un punto compartido por varias plantas, cargas en nudos tocados por otra edicion (peso propio/AREALOAD los recalcula ETABS), barras nuevas sin liberaciones/modificadores/offsets, cambio de material. La deteccion de nudo movido asume que el array no se compacto (sin nudos borrados). La carga editada va al patron Dead.
- ❌ Camino 2 sigue sin MAXSTASPC/FLOORMESH por barra, RELEASE/MINNUMSTA ni clasificacion BRACE/COLUMN/BEAM identica (eso es reconstruccion geometrica). Si el fichero no estaba en N/mm solo se inyectan DIAPHRAGM y MASS SOURCE (el resto va en otras unidades).
- ⏳ El mercado completo con la edicion no se corrio (RAM). `e2kPreservado` y `base` no viajan en un .heks guardado: tras recargar solo queda el camino 2 sin datos.
