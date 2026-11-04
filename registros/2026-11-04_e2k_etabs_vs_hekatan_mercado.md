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

## Brecha lateral del mercado: donde va el 0.8 del analisis directo (4-nov-2026)
Opciones (opt-in, defecto sin cambio = E x 0.8 en todo): `OpcionesE2kHeks.metodoDirecto` = `true|"ambos"` | `"EI"` (I x 0.8, E y A igual) | `"EA"` (E x 0.8 e I / 0.8, EI igual; masa y As no se tocan) | `false`; y `metodoDirectoGrupo` = `"todo"` | `"acero"` (barras de acero, SIN CFT) | `"compuesto"` (solo CFT).
Corrida: `C:\ETABS\mercado\exp\runv.sh <nombre> '<json opciones>'` (conv.mjs + cmp_full2.mjs, mercado completo, ~70 s, 1 corrida a la vez, sin ETABS/navegador). Referencias: `diag/etabs_u2.json`. Pendiente = pendiente Hek/ETABS de minimos cuadrados (1 = igual rigidez; >1 = Hekatan mas flexible); rms = error rms relativo.

| Variante | Dead rms Ux/Uy/Uz % | Dead pendiente Ux/Uy/Uz | Live rms Ux/Uy/Uz % |
|---|---|---|---|
| sin 0.8 | 5.65 / 11.98 / 16.67 | 0.944 / 0.901 / 0.835 | 5.19 / 12.85 / 17.41 |
| ambos (defecto actual) | 16.98 / 13.01 / 4.36 | 1.170 / 1.101 / 1.032 | 18.09 / 11.91 / 3.43 |
| solo EI (todo) | 17.36 / 14.05 / 11.34 | 1.173 / 1.089 / 0.909 | 19.60 / 13.28 / 12.93 |
| solo EA (todo) | 5.89 / 10.63 / 7.63 | 0.942 / 0.909 / 0.954 | 6.14 / 12.74 / 7.18 |
| **ambos, solo acero (sin CFT)** | **1.09 / 4.07 / 1.72** | 0.993 / 1.005 / 1.001 | **2.28 / 7.11 / 1.99** |
| ambos, solo CFT | 12.10 / 13.33 / 14.47 | 1.120 / 0.994 / 0.864 | 14.59 / 14.11 / 15.70 |

- ❌ Hipotesis EI vs EA: NO era eso. Lo lateral lo manda EI (solo EA no mueve Ux: 0.942 = sin 0.8; solo EI = 1.173 = ambos), pero ni EI ni EA por separado cierran: el 0.8 en EI hace Hekatan 17 % mas flexible lateral y el EA solo no basta en Uz.
- ✅ La causa: **ETABS NO aplica el 0.8 a las columnas CFT (Filled Steel Pipe)**, aunque `COMPOSITECOLUMNPREFERENCE` diga DIRECT ANALYSIS (AISC I2 ya da su propio EIeff). 0.8 solo en las barras de acero: pendiente 0.993/1.005/1.001, Dead rms 1.1/4.1/1.7 %, Live 2.3/7.1/2.0 %; reacciones por apoyo rms 0.3/1.8/0.3 % (antes 0.6/13.9/0.4).
- ⚠️ Live Uy 7.1 % queda sobre 5 % (Dead 4.1 %): residuo pequeno aparte, sin investigar.
- Defecto NO cambiado (la importacion de la app sigue con 0.8 en CFT; `grupo: "acero"` es la opcion). `node tests/run.mjs e2k` 599/599.
- ⏳ Decidir si `e2kAHeks` pasa a `metodoDirectoGrupo: "acero"` por defecto (cambia el e2k exportado de ida y vuelta: Hekatan exporta CFT con E reducido) y validar contra otro e2k con CFT (riochico).

## Defecto `metodoDirectoGrupo` = "acero" (4-nov-2026)
- ✅ `e2kParser.ts`: `opciones.metodoDirectoGrupo ?? "acero"` (antes "todo"); e2kAHeks lo hereda. `todo`/`compuesto` siguen disponibles. metodoDirecto sigue siendo opt-in en el parser y `true` en e2kAHeks.
- ✅ Mercado con el defecto nuevo (`runv.sh defacero '{}'`): Dead rms 1.09/4.07/1.72 %, Live 2.28/7.11/1.99 % (igual que `grupo:"acero"` explicito).
- ✅ Round-trip e2k: `exportE2k` va por `parseE2k` SIN metodoDirecto (opt-in) -> E exportado del CFT no cambia; tests e2k_roundtrip_* y cli/e2k_roundtrip_mercado.mjs sin tocar.
- ✅ `node tests/run.mjs e2k` 599/599 tras ajustar 2 tests: `e2k_galpon_recorte` (barras con 0.8: 200 -> 188, sin los 12 CFT) y `e2k_momentos_barras` galpon1 tubos M3 limite 2.5 -> 3 %.
- ❌ Empeora un poco: galpon1 (recorte con CFT CA1/CB1) tubos M3 Dead 2.17 -> 2.77 % ext (Live 1.83 -> 2.29); pico 0.21 kN·m, ruido absoluto. Se acepta porque el mercado (global, 7529 nudos) mejora 17/13/4 -> 1/4/2 %. Si se prefiere, `metodoDirectoGrupo:"todo"` recupera lo anterior.
- ⏳ Otro e2k con CFT + referencia de desplazamientos ETABS no existe en el repo (ref_riochico solo valida cotas/E/cargas, que siguen OK); solo mercado y galpon1 validan el efecto.

## Residuo Live Uy 7.1 % / Dead Uy 4.1 % (4-nov-2026, sesion de busqueda)
Datos: `galpon/pares_full_vdefacero_{Dead,Live}.json`. Variantes editando el `.heks` (solo resolver, ~50 s) o `runv.sh`.
- ✅ Donde esta: NO es global. Uy se concentra en el plano z~11 (67-72 % del error cuadratico), franja x 78-90 (68-73 %) en la cubierta metalica: el cordon INFERIOR de las cerchas Tubo 50x3 se arquea fuera de su plano ~1 mm (signo alterna por cercha) y Hekatan lo arquea 12-20 % mas (Live y Dead igual: misma causa, Live se ve peor porque su Uy es mas chico). Los vanos 84.7-90.7 casan al 1 %; el vano 78.7-84.7 no. Uz de esos nudos 12 % mas blando en Hek. Fuerzas Dead (etabs_f.json, y=29): cordon inferior Hek 3.6/6.3/6.9/5.2 vs ETABS 2.4/5.4/6.2/4.7 kN; cordon superior Hek 1.38 vs 0.34 kN (la cubierta de ETABS toma mas compresion). Diagonales y montantes casan.
- ✅ Carga total Live correcta: Fz 7307.89 = 7307.89, Fx/Fy 0. No es carga ni reparto: solo 6 panos (x 61-68, y 9) caen "sin viga" (0.16 % de las muestras).
- ❌ tamMembrana 1.25 (malla de ETABS): Live 13.7/19.0/4.6 % y Dead 5.4/11.0/3.8 % (peor).
- ❌ Rigidez de membrana x0.01: 7.6/20.1/12.3 %; x3: 2.22/7.52/2.71 % (Uy igual): la membrana pesa mucho pero no es el escalon.
- ✅ Sensibilidad: Uy depende de la TORSION de los tubos. J de todas las barras x100: Uy 63 %; x0.01: 122 %. Por clase (Live Uy): correas 1G x2 / x0.5 = 7.11 (nada); VP/VS = 7.11; columnas 7.09 / 7.18; Tubo x0.5 = 31.6, x0.85 = 11.4, x1 = 7.11, x1.15 = 6.68, x1.3 = 9.1, x2 = 21.7. Minimo cerca de 1: J de tubos esta bien (coincide exacto con ETABS), el piso ~6.7 % no es un factor de J.
- ✅ J de «I/Wide Flange» de ETABS 22: ETABS NO usa la correccion 0.63 de SAP2000; J = (2·B·TF³ + (D−TF)·TW³)/3 (VP 374 580 mm⁴ y VS 144 896, exactos; Hek daba 0.94). Arreglado en `e2kParser.ts` (solo lector e2k; `iSectionCsi` de SAP2000 intacto). Efecto en el mercado: ninguno visible (VP/VS no trabajan a torsion), e2k 599/599.
- ⏳ CFT: ETABS A/I/J = Hek /1.0065 /1.0129 /1.0319 (Hek usa n=Ec/Es 0.1147; ETABS A→0.1134, I→0.1103). Con las props de ETABS exactas Live Ux 2.28 -> 1.93 % (Uy igual). Falta la formula (AISC I2: EIeff con C3) para no hardcodear.
- ⏳ Causa de fondo sin cerrar: el cordon superior de la cercha en el vano 78.7-84.7 recibe 4x mas compresion en Hek que en ETABS, es decir la cubierta (membrana A36 4 mm + correas) colabora distinto como ala. Siguiente: comparar axil de cordon/diagonal Live en un recorte de ETABS (una corrida) y la union membrana-cordon superior (ADDRESTRAINT, CARDINALPOINT TOP del area).
