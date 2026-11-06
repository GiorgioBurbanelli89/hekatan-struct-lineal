# Union panel-arista por interpolacion (`bordeinterpolado`), 5-nov-2026

Causa (ver 2026-11-05_sap2000_galpon.md): el edge constraint de ETABS/SAP2000 deja UN Q4 por paño y ata cada nudo colgado a la interpolacion lineal de las 2 esquinas de su arista. Hekatan partia el paño en tiras (`membranaEnNudos`) y la cubierta salia mas blanda.

## Implementado
- `.heks`: directiva `bordeinterpolado [off]` (cliModeler.ts, campo `bordeInterp`). Implica `deck sinpartir` y no parte el paño.
- Importacion e2k: opcion `bordeInterpolado` (e2kAHeks.ts). Defecto (undefined) = ON si TODOS los AREAASSIGN traen `ADDRESTRAINT "Yes"` o `LINECONSTRAINT "Yes"` (y no `colgadosSueltos`). `false` = tiras como antes. OJO: en los e2k el texto es `ADDRESTRAINT "Yes"` (la cercha y el mercado no traen LINECONSTRAINT).
- Solver: ya habia penalizacion multipunto (`springsExtra.h`, nudo colgado -2 Hermite / -4 lineal 6 GDL). Se anadieron (kernel, solo ese header): `-7` = ux,uy EN EL PLANO del paño (s a lo largo de la arista y m perpendicular en el plano), normal y giros LIBRES; `-8` = lo mismo mas la normal; `-9` = solo s. Mismo mecanismo de penalizacion (1e6 x max diag K).
- Reutiliza el edge muros para paños con flexion (Hermite); solo las membranas usan -7.
- WASM recompilado desde cero con el C++ de HEAD + este cambio (los 3 .cpp de shell sin commitear de otra tarea NO entraron: se compilo en copia temporal). `deform.wasm/js` en hekatan-fem/src/cpp/built.

## Bitacora (probar-error)
- ✅ Pieza A (`tests/casos/e2k_pieza_a_borde.mjs`, `cli/pieza_a_hek.mjs` con `EDGE=bordeinterpolado`): 0.054/0.054/0.054/0.054 (SAP2000 0.054/0.051/0.057/0.054), barra y=0 0.145 (SAP 0.145). Sin directiva 0.446/0.446/0.554/0.554 = SAP2000 sin edge constraint.
- ❌ `edge lineal` (-4, 6 GDL, ya existia) en el recorte de cercha: cordon sup. bien (-0.39) pero Uz 22 %, cordon inferior error 2.5 kN: atar la normal y los giros de la barra al paño (membrana, sin rigidez fuera del plano) rigidiza de mas. Con normal (-8): Uz 20 %. Con traslacion EN EL PLANO solamente (-7): bien. Confirmado: rotaciones y normal libres.
- ❌ Solo s (-9) para todos: cordon sup. bien pero Ux 73 % (falta la perpendicular m).
- ❌ Mercado con -7 en todos los paños: Uz 11/13 % (3 nudos del vuelo y = 102.7 con Uz -0.17 mm contra -6.55 de ETABS). Causa: nudo colgado en arista COMPARTIDA por 2 paños de pendiente apenas distinta (-0.04 y -0.05): las dos «perpendiculares» m son casi paralelas y juntas atan tambien Uz (x100). Arreglo: el 2.o paño que comparte el nudo ata solo s (-9).
- ✅ Recorte cercha (cli/cercha_borde.mjs interp|tiras, test e2k_cercha_recorte):
  cordon sup. 81.7-82.7 Dead -0.42 (ETABS -0.412, SAP2000 -0.415; tiras -1.59); todo el cordon error maximo <= 0.1 kN (tiras 1.2).
- ✅ Mercado completo (`C:\ETABS\mercado\exp\runv.sh interp2 '{"bordeInterpolado":true}'`, conv. 55 s, solve 13+24 s): ver tabla.
- ⚠️ Recorte galpon1 (paños 1x6 m, `e2k_galpon_recorte`): Uy rms 6.1/7.3 % (tiras) -> 12.3/15.0 % (interp); Ux 8.9 -> 9.8; cordon Tubo 50 x=30..31 -2.0 -> -3.4 %. Peor en Uy en este recorte (nudos de corte empotrados cerca del borde). El test lleva los dos modos con sus limites.
- ⚠️ Correa x = 82.7 del recorte de cercha: cortante ETABS 0.812 contra 1.500 de Hekatan. Con tiras esa barra se partia y no casaba por coordenada, asi que no se veia; sale ahora. NO lo causa esta tarea. Fuera del test de correas 1G (13 -> 12 barras), ⏳ explicar.
- ⏳ Uy del mercado sigue en 4.0 % (Dead) / 6.9 % (Live): la union no era su causa principal.
- ⏳ Exportar (s2k/e2k) no reproduce `-7`; `muellesParaExportar` lo ignora y `modeloAHeks` escribe la directiva.
- ⏳ No se corrio la suite del navegador ni el deploy (pedido: sin deploy).

## Tabla antes / despues
| caso | antes (tiras) | despues (interp) | ETABS |
|---|---|---|---|
| pieza A, axil barra y=1 (kN) | 0.060/0.042/0.149/0.047 | 0.054/0.054/0.054/0.054 | SAP2000 0.054/0.051/0.057/0.054 |
| cercha, cordon sup. 81.7-82.7 Dead (kN) | -1.59 | -0.42 | -0.412 |
| cercha, cordon inferior error max (kN) | 0.132 | 0.151 | - |
| cercha, diagonales error max (kN) | 0.024 | 0.043 | - |
| cercha, Dead Ux/Uy/Uz rms % | 11.4 / 8.6 / 1.27 | 7.7 / 9.0 / 0.47 | - |
| cercha, Live Ux/Uy/Uz rms % | 11.7 / 9.4 / 1.44 | 7.7 / 9.8 / 0.27 | - |
| mercado Dead Ux/Uy/Uz rms % | 1.09 / 4.07 / 1.72 | 0.71 / 3.98 / 1.55 | - |
| mercado Live Ux/Uy/Uz rms % | 2.28 / 7.11 / 1.99 | 1.19 / 6.92 / 1.79 | - |
| galpon1 recorte Uy Dead/Live % | 6.1 / 7.3 | 12.3 / 15.0 | - |

Defecto: ON cuando el e2k trae ADDRESTRAINT/LINECONSTRAINT "Yes" (gana en mercado y cercha; peor solo en el recorte galpon1 en Uy). Para volver: `e2kAHeks(txt, n, { bordeInterpolado: false })`.
