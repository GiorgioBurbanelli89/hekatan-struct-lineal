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
