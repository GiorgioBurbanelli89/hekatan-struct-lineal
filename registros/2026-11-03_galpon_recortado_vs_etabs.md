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
- ⏳ **Reproductor limpio del Ux/Uy**: `simple.py card8 --card8` (VP y correas con CARDINALPT 8 + TRANSFORMSTIFF, como el mercado): ETABS desplaza TODO el techo +0.11 mm en Y (Hek +0.01), Uy rms 90 %, peor 0.12 de 0.14 mm; fuerzas de barra y reacciones casan. Con tamMembrana 1.25 se desestabiliza (Uz 12 %). Sospecha: punto de insercion + rotula + correa inclinada (desplazamiento del nudo por giro x excentricidad). Sin resolver.
- ⏳ Sin palabra `drilling` en el .heks (el solver tiene drillingTypes 0-14, defecto 13): se anadio `shelldrill <id|a-b|todos> <tipo> [escala]` en cliModeler.ts; no se barrio aun (en el sencillo no hace falta: 1 Q4 ya casa).
