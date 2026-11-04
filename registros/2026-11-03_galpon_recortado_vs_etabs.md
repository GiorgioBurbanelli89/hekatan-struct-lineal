# Galpón recortado del mercado vs ETABS (3-nov-2026)

Scripts y datos temporales: `C:\ETABS\mercado\galpon\` (hacer_galpon.py, cmp_galpon.mjs, variante.py, topo.json).
Test: `tests/casos/e2k_galpon_recorte.mjs` (datos `tests/datos/e2k_galpon1.e2k` + `e2k_galpon1_ref.json`).

## Funcionó
- Ventana x 24..36, y 85.4..91.4 (comp. 4): 212 barras, 12 paños, 120 nudos, 28 nudos de corte empotrados. ETABS por OAPI en 50 s.
- `python hacer_galpon.py N --v xmin xmax ymin ymax [--v ...]` escribe galponN.EDB/.e2k y ref_galponN.json.
- Capas con variantes de ETABS (variante.py): sin áreas, sin releases, sin punto de inserción, membrana ≈ 0.
- Uz Dead 17 % → 3 %; Live 17 % → 3.7 %. Reacción Live exacta, Dead +0.53 % (peso).

## Causas halladas (importador)
1. Reducción 0.8 de rigidez (E × 0.8, G igual) en acero y CFT: ETABS lo hace; causa NO aislada (ver abajo).
2. Peso de correas/tubos articulados horneado como empotrado (momentos ±wL²/12 en nudos): `condensarCargaPorLiberaciones`.
3. CARDINALPT sin `TRANSFORMSTIFF "Yes"` no transforma rigidez (NoTransform = Yes en las 2714 barras del mercado).

## No funcionó / abierto
- ❌ DA → «Effective Length» por OAPI: ETABS no cambia ni un desplazamiento. ❌ Tipo de rigidez del caso (inicial None): igual.
- ❌ Vaciar `Steel Frame Design Overwrites` (188 filas): todo × 1.23 (no se entiende aún). Regla empírica: reducir solo con `DIRECT ANALYSIS` + `STEELDATA`.
- ⏳ Ux/Uy: peor nudo 11-17 % del máximo (0.1-0.17 mm) en x = 30 m; depende de la membrana de cubierta (ETABS con membrana ×1e-4 cambia Ux hasta 0.24 mm).
- ⏳ Peso Dead +0.5 %: brazos automáticos (ETABS descuenta más en VP/VS) y área poligonal de los CFT (-0.65 %).
- ⏳ `e2k_propmodifiers` «riochico ida y vuelta» falla (16 %, shearAreasZ); no toca nada de esto.
- ⏳ Fuerzas de barra: el extremo de `analyze` es k·u sin carga de vano; hay que usar lib/comparar.mjs para comparar con ETABS.

## Galpón 2 (ventanas x 24..48, y 85.4..91.4; 246 nudos, 456 barras, 24 áreas, 38 nudos de corte)
- ✅ Corrió completo (ETABS 367 s, sin muerte por memoria). Peso Dead 527.04 (ETABS) vs 529.78 (Hekatan); Live 74.138 = 74.138 exacto.
- ✅ Uz: Dead rms 3.32 % (peor 0.091 mm, nudo 3887); Live rms 3.26 % (peor 0.090 mm).
- ❌ Ux: rms rel 73 % (Dead 0.102 mm rms, peor 0.424 mm = 61 % del máx 0.693); Live 73 % (peor 0.344 mm de 0.564).
- ❌ Uy: rms rel 26-28 % (Dead peor 0.177 mm = 34 % del máx 0.522; Live peor 0.143 mm de 0.400).
- ⏳ Fuerzas de barra: Col P 13.7 % / Tubo P 4 % ok; VP M3/V2 Dead 80-93 % y 1G V2 100 % (extremo k·u sin carga de vano, ver nota arriba).
- ⏳ Ux/Uy peor que Galpón 1: misma causa abierta (membrana de cubierta / reducción 0.8).

## Ux/Uy: aislamiento por experimentos (sin relanzar ETABS; referencias ya guardadas)
- ✅ ETABS sin áreas (variante `sinareas`, con cardinal+releases): Hekatan da Ux 2.2 % / Uy 3.4 % / Uz 2.4 %. Barras, releases, cardinal y brazos están bien; el problema entra con las ÁREAS.
- ✅ **Causa 4 (arreglada)**: `repartirLosasUnaDireccion` buscaba las vigas del paño a la cota del primer nudo (`z0`). En la cubierta INCLINADA (3 cm/m) se descartaban las vigas del lado alto y toda la carga caía en la del lado bajo. Ahora se usa el PLANO del paño (normal de Newell). Reacción Fz de las esquinas x=24: 8.06→7.02 y 2.46→1.43 kN (ETABS 7.02 y 1.42). Uz m0 2.87→1.36 %. Test: filas `reaccion Fz del apoyo de cubierta` en `e2k_galpon_recorte`.
- ❌ No son la causa de Ux/Uy (probado, cambia <1 punto): brazos (rz 0/1, sin brazos), J de barras ×10, Poisson de la cáscara 0.3, E de la membrana ×3, quitar la membrana (Hek m0), ángulo de la losa (+90° empeora Uz 2.9→8 %), E de barras ×1.25/×0.8 (empeora Uz a 19-26 %: la regla 0.8 es correcta).
- ❌ Membrana: ETABS con membrana ≈ 0 (m0) ya da Ux 26 % / Uy 38 % contra Hekatan m0; el error está en la LÍNEA x = 30 m (viga VS + poste Tubo 100, nudos z 12.28/12.53/13.28): Hekatan ~0.1 mm más a -x (traslación, no giro: la diferencia top-bottom coincide). Es ~0.1 mm de 12 m de altura.
- Resultado final: galpón 1 Dead Ux rms 71.9→69.2 %, Uy 48.1→49.8 % (peor nudo Ux 15.4 % / Uy 12.0 % del máx.), Uz 3.08→3.05 %; galpón 2 Ux 73.4→74.0 %, Uy 25.8→26.7 %, Uz 3.32→2.89 % (Live 3.26→2.20 %). Ux/Uy casi igual: el arreglo corrige la carga, no la causa de fondo.
- ✅ Fuerzas de barra (sospecha 4): el «80-93 % fuera» de VP M3/V2 y 1G V2 = 100 % es del COMPARADOR (extremo k·u sin carga de vano; 1G V2 ETABS 2.286 = wL/2 y Hek da 0), no del motor. Falta compararlas con `lib/comparar.mjs`.
- ⏳ Ux/Uy en x = 30 m: queda la diferencia de empuje horizontal en los cortes (Fx de 8.14 vs 8.74 kN en (36,90.4,13.46)). Siguiente paso: pedir a ETABS (una sola vez) fuerzas de las barras del poste/VS y cargas distribuidas que asigna a cada correa, y comparar con las de Hekatan.

## Reparto de carga de cubierta: ETABS vs Hekatan (galpon1, 1 sola corrida; Live corrida de nuevo 27 s, sin colgarse)
Datos en `C:\ETABS\mercado\galpon`: `etabs_cargas_barras_g1.json` (FrameForce por estaciones, 212 barras, Dead/Live), `etabs_ejes_g1.json`, `hek_barras_{Dead,Live}.json`, scripts `cargas_barras.py`, `ejes.py`, `cmp_reparto.py`, `cmp_fuerzas.py`, `cmp_dump.mjs`.
- ✅ `GetLoadDistributed/GetLoadPoint` devuelven VACIO: ETABS no asigna carga a las barras, la reparte al analizar. Se dedujo de la pendiente del cortante (w = -dV/dx).
- ✅ **El reparto es el mismo**: correas 1G (6 m) cortante de extremo ETABS 2.042 vs Hek 2.059 (+0.8 %, es la carga sobre la zona rigida del brazo que el diagrama no muestra); sobrecubierta (4 m) 1.356 vs 1.373 (1.2 %). Nudos intermedios de y = 85.4 y 90.4 casan al 1 %. Carga total conservada: Live 41.188 = 41.188 kN; Dead 306.80 vs 308.43 (peso).
- ✅ Reacciones Live (carga vertical pura): Fz casan a 1-3 %; Fx en (36,90.4,13.46) ETABS 5.66 vs Hek 6.65 (Dead 7.43 vs 8.60; el 8.14 vs 8.74 de la nota anterior es otra combinacion/medicion). Fx de las esquinas x=24: 6.35 vs 6.83.
- ✅ Fuerzas de barra Live (comparador correcto, extremo j y -i): cordones Tubo 50 de x=30..36 (y=90.4): P ETABS 2.24/4.31/4.53/2.92 vs Hek 3.15/5.01/5.02/3.21 kN. Hek tiene ~10-30 % MAS empuje horizontal en los cordones; ETABS lo reparte distinto en la linea x=30.
- ❌ Por tanto la causa de Ux/Uy NO es el reparto de la carga de area a las barras: es la rigidez de la ruta de fuerza (empuje por cordones/membrana). No se cambio e2kParser/e2kAHeks (nada que corregir en el reparto), no hay commit de codigo.
- ⏳ Sospechas siguientes: (a) membrana de 12 cuadrilateros de 1x6 m (relacion 6:1): ETABS la malla internamente, Hek usa 1 Q4 por panel; probar subdividir el panel en Hek y ver si el empuje baja; (b) Fy de reacciones en y=91.4 con signo contrario (-0.76 vs +0.20 en (29,91.4,12.22)): axial de las correas 1G, acoplado a (a).

## Membrana subdividida en sub-paños (sin relanzar ETABS)
Opción nueva `e2kAHeks(texto, nombre, { tamMembrana })` (opt-in, por defecto 0 = 1 elemento por paño). Los nudos nuevos se crean ANTES del cosido y parten las correas/tubos que pasan por el borde. Script: `C:\ETABS\mercado\galpon\cmp_galpon.mjs` (env TAM), `cmp_empuje.mjs`, `cmp_reac.mjs`.
- ✅ Galpón 1, Dead Ux/Uy/Uz rms rel por lado máximo del sub-paño: 1 elem 69/50/3.05 · 4 m 40/20/2.4 · 2.5 m 21/6.6/2.4 · 1.5 m 14.5/13.7/2.1 · **1.25 m 12.9/11.3/1.97** · 1 m 14/6/2.9 (LDLT cae a LU) · 0.75 m 16/9/3.3. No es monótono: no converge a ETABS, "cae" cerca de 1.25.
- ✅ **Empuje**: con 1.25 m los cordones inferiores Tubo 50 (Live) dan 2.21/4.29/4.52/2.93 kN vs ETABS 2.24/4.31/4.53/2.92 (antes 3.15/5.01/5.02/3.21) y Fx (36,90.4,13.46) 5.74 vs 5.66 (antes 6.64). Galpón 2: Ux 74→6.7 %, Uy 27→8 %, Uz 2.89→2.86 % (Live Uz 2.20→2.28).
- ✅ n×n (subdividir también el ancho de 1 m) es peor que subdividir solo el lado largo: 6×6 da Ux 224 % (nudos interiores sin rigidez fuera del plano).
- ❌ Hipótesis "ETABS la malla internamente": el .OUT de ETABS dice 120 nudos y 12 elementos shell, o sea NO añade nudos. Casa con 1.25 m (= FLOORMESHMAXSIZE por defecto) pero no se sabe por qué: quizá su membrana ITW es menos rígida en el plano que nuestro Q4 6:1.
- ❌ **Regresión que impide dejarlo por defecto**: reacciones de los nudos de corte del borde libre y = 91.4 y Fy: rms Fx 11.7→26.8 %, Fy 59→111 % (galpón 2: 10→37 %, 41→80 %). Fz mejora (2.3→1.8 %). Reacción Dead Fz (24,91.4) 1.43→1.459 (+3.08 %).
- Test: filas nuevas en `e2k_galpon_recorte` (Ux/Uy rms ≤ 20 %, 4 cordones ±3 %, Fx ±3 %) con la opción; sin ella nada cambia. `node tests/run.mjs e2k`: 160/160.
- ⏳ Probar `drillingTypes`/γ de la membrana ITW (el .heks no tiene palabra para ello) y entender por qué los apoyos de y = 91.4 se comportan al revés; solo entonces dejar 1.25 m por defecto. Fy de (36,90.4) sigue con signo contrario (-0.74 vs +0.44).

## Galpon SENCILLO (12x6 m, 6 columnas tubo 200x6, VP continuas, 13 correas 1G articuladas, membrana 12 panos 1x6) vs ETABS
Datos: `tests/datos/e2k_galpon_simple_{plana,rot90,corte}.e2k` (+ `_ref.json`), generador `e2k_galpon_simple_genera_etabs.py`; test `tests/casos/e2k_galpon_simple.mjs` (18 filas). Scripts: `C:\ETABS\mercado\galpon\simple.py`, `cmp_simple.mjs`. ETABS corrio 7 veces (60-125 s c/u), sin colgarse.
- ✅ Direccion de reparto: ONEWAYLOADDIST con ANG 0 = vano en X, la carga va a las correas (Y). Hek: correas 49.43 kN, VP 0; ETABS idem. Con ANG 90 (e2k lleva `ANG 90`) Hek lee el angulo y manda 49.43 kN a las VP; Uz 0.014 %, Uy 0.1 %. Sin girar contra la referencia girada: Uz 0.7-0.95 %, Uy 130-210 % -> el sentido SI importa.
- ✅ Causa 5 (corregida): empate en el reparto (muestra central sobre la bisectriz) -> columnas simetricas 4.893/4.862 vs ETABS 4.8752. Ahora 4.8752/4.8752.
- ✅ Causa 6 (corregida): brazo automatico de columna REDONDA (B=0 en tubo) -> vigas en Y no recibian brazo.
- ✅ Causa 7 (corregida): correa articulada con brazo: ETABS pone la rotula en la CARA del brazo (luz libre 5.8, reaccion a 0.1 m del eje) -> momento R*0.1 al pilar. Fy de bases: Hek 0.000 vs ETABS +-0.025 (100 % error) -> 1.7 %. Uy techo plano 103 % -> 8 % (valores de 0.0007 mm); pendiente 3 %: Uy 65 % -> 3 %.
- ✅ Membrana m0 en ETABS no cambia Fy -> el Fy no era de la membrana. Techo plano tambien lo tiene -> no era la pendiente.
- ✅ Membrana en el plano: con nudos de corte (y=6 empotrada), 1 Q4 por pano = ETABS (Fy 2.4 %, Fx 3.3 %); subdividir a 1.25 m lo empeora (Fy 50 %, signo invertido en (6,6): ETABS +0.0185, 1Q4 +0.0181, 1.25 m -0.0134). Cortante lateral LATX: ETABS casi uniforme en el borde; mallas finas lo concentran. => ETABS NO subdivide ni es mas flexible: su membrana ITW 6:1 se comporta como un solo elemento.
- ❌ Galpon complejo (mercado): las 3 correcciones NO cambian Ux/Uy (68/48 % con 1 elem; 13/13 % con 1.25 m). `tamMembrana` sigue siendo opt-in; su ventaja alli NO se explica por la membrana (en el sencillo es peor).
- (resuelto abajo) **Reproductor limpio del Ux/Uy**: `simple.py card8 --card8` (VP y correas con CARDINALPT 8 + TRANSFORMSTIFF, como el mercado): ETABS desplaza TODO el techo +0.11 mm en Y (Hek +0.01), Uy rms 90 %, peor 0.12 de 0.14 mm; fuerzas de barra y reacciones casan. Con tamMembrana 1.25 se desestabiliza (Uz 12 %). Sospecha: punto de insercion + rotula + correa inclinada (desplazamiento del nudo por giro x excentricidad). Sin resolver.
- ⏳ Sin palabra `drilling` en el .heks (el solver tiene drillingTypes 0-14, defecto 13): se anadio `shelldrill <id|a-b|todos> <tipo> [escala]` en cliModeler.ts; no se barrio aun (en el sencillo no hace falta: 1 Q4 ya casa).

## card8 (punto de insercion 8) en el galpon sencillo: RESUELTO
- ✅ **Causa 8**: la carga (peso propio y reparto de la losa) de una barra con CARDINALPT+TRANSFORMSTIFF actua en su CENTROIDE, no en el nudo. En la correa inclinada 3 % el eje local 2 se inclina 1.7 grados: el brazo horizontal 0.08*sen(1.7) = 2.4 mm x 49.4 kN = 0.12 kN·m (centro de la carga de ETABS en y = 3.0024 m; Hek 2.9988). Hek solo trasladaba la RIGIDEZ (muelles de insercion), no la carga: faltaba el momento r x F en los nudos.
- ✅ Diagnostico sin relanzar ETABS: Mx total de reacciones / Fz total (ETABS Live 148.462/49.448 = 3.0024) y las reacciones de momento de las bases (ETABS -0.012/+0.064 vs Hek -0.041/+0.044, suma +0.05 de mas por columna); las fuerzas de corte de las bases ya casaban, por eso Fy cuadraba y Uy no.
- ✅ Correccion: `trasladarCargaAlNudo` + `desfaseDeInsercionE2k` (hekatan-fem/src/utils/insertionPoint.ts); `conInsercion` en e2kAHeks (peso de barras y cargas de losa, DESPUES de condensar liberaciones y del brazo). Uy rms Dead 90.06 -> 0.98 %, Live 90.77 -> 0.85 %; Uz 0.07/0.09 %; Fz 0.17/0.23 %. Test: filas `card8 ...` en `e2k_galpon_simple` (datos `e2k_galpon_simple_card8*`). `node tests/run.mjs e2k` 184/184, e2k_prop 10/10 (el riochico ya no falla), punto_insercion 6/6.
- ✅ Descartado midiendo (no era): inserccion solo en VP o solo en correas (Uy igual 0.12 mm de error), sin cardinal en Hek (igual), release de la correa, brazos. La rigidez de insercion ya estaba bien (Uz 0.07 %).
- ⏳ Falta: `frameload` uniforme del cliModeler (LINELOAD del e2k) sobre barra con insercion no lleva aun el r x F; Ux card8 8 % rms (0.0007 de 0.0138 mm, residuo); Fy de bases 5.6 %; re-medir el mercado (Ux/Uy) con la correccion; pendiente 0 vs 3 % en ETABS no corrido.

## 4-nov: re-medida con la correccion r x F + LINELOAD (sin relanzar ETABS)
- ✅ Galpon 1 y 2 (referencias guardadas, `cmp_galpon.mjs`): IDENTICOS a antes (Dead Ux 68/Uy 48/Uz 3.0 %; galpon 2: 73/25/2.5 %). Es lo esperado: los e2k del mercado/galpon NO traen `TRANSFORMSTIFF "Yes"` en barras (solo en el card8 sintetico), asi que `desfaseDeInsercionE2k` devuelve undefined y la correccion no se activa.
- ✅ tamMembrana 1.25 sigue haciendo falta: galpon 1 Dead Ux 68 -> 13 %, Uy 48 -> 13 %; galpon 2 Ux 73 -> 6 %, Uy 25 -> 5 %; empuje Fx 8.60 -> 7.52 (ETABS 7.43), cordones P casan a 1-2 %. NO se puede quitar; sigue opt-in.
- ✅ LINELOAD uniforme (parser e2k, `FRAME OBJECT LOADS`) lleva r x F al nudo con CARDINALPT+TRANSFORMSTIFF "Yes": `e2kParser.ts` (cargas por patron y `loads`; `frameFixedEnd` queda en el centroide). Test `e2k-lineload-insercion` (mecanica: delta Mx = (D/2)·sen·F, correa inclinada 3 %, exacto a 0.1 %). Sin oraculo ETABS: ni el mercado ni los galpones tienen LINELOAD.
- ❌ Mercado completo NO re-medido: e2k -> .heks con node se queda sin memoria (heap 3 GB, RAM libre 1.7 GB), tambien el calculo. Por construccion no cambia (0 barras con TRANSFORMSTIFF Yes, 0 LINELOAD en mercado.e2k). Referencias ETABS completas guardadas: `C:\ETABS\mercado\diag\etabs_u.json` (+ `etabs_r.json`).
- ⏳ Para medir el mercado entero: otro PC o por zonas (galpon recortado ya es una zona); el sesgo de Ux/Uy NO es la insercion.

## 4-nov (2): diferencias finitas de modelo, CULPABLE ENCONTRADO: nudos que cuelgan del borde de la membrana
Geometria real (topo del heks): sobrecubierta x 30..36 = paños de 1x4 m (y 86.4..90.4) a z 13.28..13.46, sobre la cubierta x 24..30 = paños de 1x6 m (y 85.4..91.4) a z 12.28; en la linea x = 30 los nudos (30,86.4/90.4,12.28) y la correa con nudos cada 1 m CUELGAN del borde de paños de otra longitud. Con 1 Q4 por paño esos nudos no estaban en ningun elemento de membrana.
- Escalera (galpon 1, Dead, rms rel Ux/Uy/Uz): base 68.4/47.6/2.96 · `edge lineal` (6 GDL atados, solver) 31.5/102.8/39.0 · `edge etabs` (Hermite) 23.4/57.6/28.8 (rotaciones atadas rompen Uz: no sirve para membrana) · tamMembrana 1.25 13/13/2.0 · **partir cada paño en los nudos que ya tocan su borde: 9.2/6.0/1.34**; + tam 3 o 1.25: 10/10 (peor).
- Empuje: cordones Tubo 50 Live 2.20/4.28/4.51/2.92 vs ETABS 2.24/4.31/4.53/2.92 (antes 3.15/5.01/5.02/3.21); Fx (36,90.4,13.46) 5.68 vs 5.66 (Dead 7.42 vs 7.43). Galpon 2: Ux/Uy/Uz 6.5/4.1/2.3 (antes 74/27/2.9). Peor nudo Ux 15.4 -> 2.1 %, Uy 12 -> 1.1 %.
- Implementado: `e2kAHeks(..., { membranaEnNudos })`, DEFECTO true (false = antes). Test: filas de `e2k_galpon_recorte` (rms <= 12 %, peor nudo <= 5 %, cordones/Fx +-3 %). Suites: e2k 208/208, e2k_prop 10/10, punto_insercion 6/6, membrana 36/36, galpon_simple 18/18 (sin nudos colgados: igual).
- ❌ Quedan: Ux/Uy 6-9 % rms concentrado en x = 30 (capas superpuestas: el edge constraint real ata solo traslaciones, aqui se parte la malla); Fy de reacciones en (36,86.4/90.4,13.46): ETABS 0.42/0.44 vs Hek 1.59/-0.76 (Fy rms 85 %, valores ~1 kN). Haria falta un `edge` de solo traslaciones en el C++ (WASM, no recompilado aqui).
- Corridas ETABS nuevas: 0.

## 4-nov (3): modelo de UN VANO (6x6 m) vs ETABS, 5 corridas (sin colgarse)
Modelo: 4 columnas CC 1 200x6 empotradas, VP I530 en y=0/6 (CARDINALPT 8), correas 1G articuladas (TI M2I M2J M3I M3J), membrana A36 4 mm ONEWAYLOADDIST, pendiente 3 %, Dead 0.392/Live 0.686, LAT 1 kN en y=6. Datos `tests/datos/e2k_vano_simple_{A,A1m,B,Baddr}.e2k` (+`_ref.json`), generador `..._genera_etabs.py`, test `tests/casos/e2k_vano_simple.mjs` (75 filas), lib `tests/lib/vano_cmp.mjs`. Scripts ETABS: `C:\ETABS\mercado\galpon\vano.py`, `ext.py`.
- A = correas enteras (sin colgados) · A1m = correas cada 1 m (colgados en los lados de los panos 1x6) · B = x 3..6 panos 1x4 + Tubo 50 en y=1,5 (colgados en x=3, el caso x=30) · Baddr = B con ADDRESTRAINT Yes.
- ✅ Hek = ETABS en las 4 variantes: Uz peor nudo 0.044-0.049 mm de 17-20 mm (0.25 %); Fz total 41.598 vs 41.610; LATX 17.01 mm, peor 0.019 mm; Fx total -7.000.
- ✅ ETABS: ADDRESTRAINT Yes/No da el MISMO resultado (dU max 2e-10 m) en este vano. Hek: 1 Q4 / membranaEnNudos / tamMembrana 1.25 dan el mismo Uz (0.0440 mm) -> el vano NO solicita la membrana (el techo se traslada rigido, sin cortante).
- ❌ Limitacion: este vano no discrimina la membrana ni el edge constraint (la causa de x=30 se ve solo con cortante en el plano: cubierta unida a apoyos de corte). Sin cambios en el motor.
- Residuos chicos: axil de los 6 cordones Tubo 50 con LATX Hek 0.10-0.13 vs ETABS 0.03-0.10 kN (<=0.07 kN, 1 % de la carga de 7 kN); Fy de columnas ~1.3-1.8 % rms (valores 0.03 kN); axil de columna Hek = ETABS - mitad de su peso (el peso va a los nudos).
- ⏳ Variante con cortante en el plano (quitar columna de una esquina o apoyar solo y=0 como "corte") para ver ADDRESTRAINT; no se hizo: tope de 5 corridas ETABS. RAM libre ~0 MB, ETABS aguanto (50-70 s cada corrida).

## 4-nov (4): vano con cortante en el plano (columnas de y=6 solo Uz): NO sirve de juez
- ✅ ETABS corrio E (edge No), F (E + sobrecubierta), G (F + ADDRESTRAINT Yes), H (F + CARDINALPOINT TOP). Datos `tests/datos/e2k_vano_cortante_{E,F,G,H}.e2k` + `_ref.json`, generador `..._genera_etabs.py` (vano.py con --var E|F). `vano_cmp.mjs` ahora acepta prefijo y `extraHeks`.
- ❌ El modelo esta mal condicionado: ETABS da Uy de Dead/Live del orden de 1e9 m (mecanismo: y=6 sin Ux/Uy, la cubierta puede girar/trasladar casi libre). Hek E: peor nudo Dead Ux 0.25 mm, pero Uy/Uz comparan ruido contra ruido; LATX peor Ux 1.3 mm de 167 (0.8 %) con 1Q4, tam1.25 sube Uz a 8 mm. Reacciones totales coinciden (Fz 41.61, Fx -7.00).
- ⏳ F/G/H no se midieron en Hek (misma estructura inestable). Para discriminar ADDRESTRAINT hay que restringir Ux/Uy en un solo apoyo por lado (no rodillo total) para quitar el mecanismo.

## 4-nov (5): vano con cortante en el plano REHECHO (base y=6 "UZ RX RY"): ya sirve de juez, 4 corridas ETABS
- ✅ CAUSA del mecanismo (no era falta de Ux/Uy en el techo): columna de y=6 con base solo UZ = barra que gira RIGIDA con la base deslizando (Ux/Uy y Rx/Ry de la base sin rigidez) -> Uy 3e8 m en los nudos de la base. Regla: en cada plano la base necesita traslacion O giro impedido. Fix: base y=6 `UZ RX RY` (desliza, giro impedido); y=0 sigue empotrada. ETABS: max 171 mm (LATX), 20 mm (Dead). Sin mecanismo.
- ✅ 4 corridas (ext.py sobre el e2k editado): E (6 panos 1x6), F (x 3..6 sobrecubierta 1x4 + Tubo 50, colgados), G (F + ADDRESTRAINT Yes), H (F + CARDINALPOINT TOP). Datos `tests/datos/e2k_vano_cortante_{E,F,G,H}` (sustituyen a los malos), test `tests/casos/e2k_vano_cortante.mjs` (82 filas OK).
- ✅ ETABS: F = G = H a 1e-9 m. ADDRESTRAINT y CARDINALPOINT TOP no cambian nada (tampoco en un modelo donde SI trabaja el cortante).
- ✅ Hek (1 Q4 / membranaEnNudos / tamMembrana 1.25, shelldrill por defecto 13): Dead Uz peor 0.049 mm de 19.5 (0.25 %); Fz 37.602 vs 37.611 (E 41.598 vs 41.610); LATX Fx -7.000; LATX Ux/Uy rms E 0.8/0.9 %, F 1.9/1.5 % (peor nudo F 3.5 mm de 171; tam 1.25: 3.4). Mejor malla: E tam 1.25 (1.12 mm); F igual con las tres. G y H = F en Hek.
- Notas: (1) `membranaEnNudos:false` y true dan IDENTICO en Hek: el cargador (.heks) ya parte/ata la membrana en los nudos de sus bordes ("origen etabs"), no depende de la opcion. (2) shelldrill: tipo 2 casa mejor LATX (Ux peor 2.4 mm, Uz 0.1 % rms) que el 13 por defecto (3.5 mm); 1 y 11 son malos (5-150 mm); 0 y 12 peores. No se cambio el defecto (2 % es poco para decidir con un solo modelo).
- ❌ ABIERTO: axil de las correas de borde en LATX. ETABS = constante en todo el largo (E 4.53, F 4.65 kN; intermedios 3.5): la membrana NO reparte carga a los nudos intermedios de la correa. Hek: 5.2 -> 0.1 kN decreciente (membrana atada a los nudos intermedios); VP y=0: ETABS 1.4-2.0 vs Hek 5.7-6.1; tubos F 0.03-0.4 vs 0.1-1.2 kN. Los desplazamientos casan a 1-2 % (el techo es casi rigido) pero el reparto de fuerzas entre membrana y barras NO. Hipotesis: ETABS no ata los nudos colgados de la correa al borde del pano (aqui, panos 1x6 con 5 nudos de correa por borde), contra el "edge" del galpon que si mejoraba. Falta un modelo con las correas SIN nudos intermedios (corr enteras) + cortante para separar.
- ⏳ Una corrida ETABS mas disponible (4 de 5 usadas). Siguiente: variante con correas enteras (A) + base y=6 UZ RX RY; si ahi casan los axiles, la causa es el atado de nudos colgados y habria que poder DESATAR (opcion en el cargador).

## 4-nov (6): axil de correas del vano RESUELTO: el edge constraint (LINECONSTRAINT) manda; 1 corrida ETABS (la 5.ª)
- ✅ Corrida ETABS `Eent` = E con las correas ENTERAS (7 barras de 6 m, sin nudos intermedios; base y=6 UZ RX RY). Datos `tests/datos/e2k_vano_cortante_Eent{.e2k,_ref.json}`. ETABS: axil correa x=0 **4.53 kN = igual que E segmentada** (E 4.53) y VP y=0 2.05..0.04: ETABS no ata los nudos intermedios de la correa al borde del paño. Hek `Eent`: 4.59 (+1 %), Ux/Uy rms 0.96/1.09 %.
- ✅ CAUSA: el e2k de estos vanos trae `LINECONSTRAINT "No"` (edge constraint apagado); `galpon1.e2k` NO lo trae (defecto de ETABS = SI, ata). El importador lo ignoraba y siempre partía el paño en los nudos colgados (`membranaEnNudos`) + `deck etabs` lo volvía a partir (por eso `membranaEnNudos:false` daba IDÉNTICO): cortante de membrana a todos los nudos de la correa en vez de a las esquinas del paño.
- ✅ Arreglo (sin recompilar WASM; es del cargador): `e2kAHeks({colgadosSueltos})`, por defecto leído del e2k (suelto solo si TODOS los AREAASSIGN traen LINECONSTRAINT "No") + directiva `.heks` `deck sinpartir` (cliModeler `deckSinPartir`: `aplicarDeckEtabs` no parte). Es lo mismo que (a) "membrana de 4 nudos, correa libre, carga tributaria a las barras de borde". (c) edge de solo traslaciones: no hecho (hace falta C++/WASM); no hace falta aquí.
- Axil LATX (kN) ETABS vs Hek, correa x=0 / VP y=0 (extremo y pico) / Tubo 50 (peor |dP|):
  | modelo | ETABS correa | Hek atado (antes) | Hek suelto (ahora) | VP y=0 ETABS | atado | suelto | Tubo dP atado -> suelto |
  | E | 4.53 cte | 5.19 -> 0.07 | 4.59 cte | 2.05..0.04 | 5.67..0.15 | 1.57..0.12 | - |
  | F | 4.65 cte | 5.26 -> 0.15 | 4.71 cte | 1.37..2.72 | 6.07..3.42 | 1.09..2.72 | 1.07 -> 0.06 |
  | Eent | 4.53 | (no hay colgados) | 4.59 | 2.05 | - | 1.57 | - |
  Desplazamientos LATX rms Ux/Uy: E 0.77/0.92 -> 0.93/1.09 %, F 1.91/1.46 -> 0.90/1.04 % (peor nudo F 3.54 -> 1.60 mm). Reacciones iguales.
- ❌ Probado y descartado: forzar suelto en el galpón recortado (`E2KOPC='{"colgadosSueltos":true}'` en `e2k_galpon_recorte`): Dead Ux/Uy peor 15.4/11.5 % (con atado 2.1/1.1 %), 22/26 filas. Ahí ETABS SI ata (sin LINECONSTRAINT = Yes), por eso el defecto sale del e2k y no de un interruptor global.
- ✅ Test: `e2k_vano_cortante.mjs` ampliado (Eent, malla "atado" informativa, axiles correa/VP/tubo vs ETABS), 115/115. Suites: e2k 398/398, e2k-prop 10/10, punto-insercion 6/6, membrana 36/36, e2k-galpon 50/50 (recorte sin cambios: su e2k no trae LINECONSTRAINT).
- ⏳ Queda: VP de y=0 en E 1.57 vs 2.05 (0.5 kN, 25 % de un valor chico); el edge SI ('Yes') con sub-paños sigue sin comparar axiles contra ETABS (no hay vano con LINECONSTRAINT Yes + cortante; haria falta otra corrida).

## 4-nov (6): cubierta PLANA vs PENDIENTE 3 % (y y x) contra ETABS: la pendiente NO es la causa
Datos `tests/datos/e2k_cubierta_pendiente_*` (galpon_plana/p3, vano_Epl/Fpl/Epx + Ep3/Fp3 copiados de vano_cortante), test `tests/casos/e2k_cubierta_pendiente.mjs` (60 filas), lib `tests/lib/pendiente_cmp.mjs`. ETABS por OAPI: 3 corridas nuevas (Epl, Fpl, Epx; 35 s c/u, sin colgarse; ETABS estaba libre). Galpon: 0 corridas (reusa simple_base = 3 % y simple_plana).
- ✅ Galpon 12x6, plana vs 3 % (sin card8): Uz rms 0.012/0.054 % (Dead), Fz apoyos 0.001/0.042 %, empuje Fy 1.50/1.64 % (valores 0.03 kN), LATX peor Ux 0.018/0.021 mm. Igual con y sin pendiente.
- ✅ Vano E/F, plana vs 3 % en y: peor nudo Dead 0.000/0.018/0.041 vs 0.000/0.021/0.049 mm; LATX 1.614/0.807/0.017 vs 1.613/0.807/0.014 mm; reacciones Fx/Fy/Fz identicas; error de axil de correa en LATX 0.058 kN en ambas.
- ✅ Pendiente en X (Epx): Dead/Live Ux 0.0006 mm de 1.05, LATX 1.69 mm de 172 (0.98 %): igual que plana, CON el cambio de colgados sueltos (`colgadosSueltos`, cambio sin commit del otro agente).
- ❌→✅ Lo que SI aparecio con pendiente en X: Ux rms 154 % en Dead/Live (nudos de la correa se movian NORMAL al plano, Ux/Uz = 0.03, 0.57 mm de 1.05). Prueba: sin membrana en Hek el nudo (3,3) da Ux 0.029 (ETABS 0.031); con la membrana partida/atada 0.597. Causa: la membrana partida en los nudos colgados ata la fila de la correa al plano; ETABS (LINECONSTRAINT "No") no. No es la pendiente: en plano o 3 % en y el atado existe igual pero no se ve (desplazamiento tangente nulo). Con colgadosSueltos: 0.17 %, y el axil de la correa en LATX pasa de 4.5 kN de error a 0.06 kN (VP 107 % -> 32 %).
- ❌ Unica huella real de la pendiente: axil de las correas en Dead/Live (galpon: ETABS ±0.069 kN = Q/2·sen θ, Hek 0.0002; plana 0). Causa: las cargas de losa entran como puntuales en los nudos y `analyze()` no resta el empotramiento (shearsZ de la correa 0 vs 2.305 kN de ETABS). Desplazamientos y reacciones casan; es recuperacion de esfuerzos de barra. No corregido: hace falta `frameFixedEnd` para `cargasLosa` en e2kAHeks.ts (archivo en edicion por el otro agente) y su soporte en el .heks.
- Descartados con medida (no son la pendiente): CARDINALPT 8 + eje local inclinado (card8 ya resuelto), ejes locales de correa, reparto tributario (Fz total 41.598 vs 41.610 = area inclinada), empuje de apoyos (Fx/Fy totales 0.000 en ETABS y Hek), cortante en el plano (LATX igual plana/3 %).
- ⏳ Falta: card8 plana en ETABS (para separar insercion de pendiente en el galpon); `corte` del galpon en plana; frameFixedEnd de losa; re-medir E/F LATX axiles cuando el otro agente haga commit (pasa de 107 % a 32 % en VP).
