# Alcantarilla + HL-93 (ejemplo): Hekatan contra SAP2000 y OpenSeesPy

Alcantarilla (ejemplo) 2x9.5x6 m, HL-93 HL-93 (35/145/145 kN · 4.3/4.30 m). kN, m. · 263 nudos, 264 barras, 39 muelles, 277 posiciones (casos estáticos, mismas cargas nodales).
Error = |dif| / máximo del campo en todas las posiciones.

## Posición a posición (peor caso de todos los nudos/barras y posiciones)

| campo | pico Hekatan | OpenSeesPy |
|---|---|---|
| Ux (mm) | 3.5855 | 0.0000 % |
| Uz (mm) | 9.6944 | 0.0000 % |
| Ry (rad) | 0.0022452 | 0.0000 % |
| P (kN) | 267.63 | 0.0000 % |
| V2 (kN) | 229.39 | 0.0000 % |
| M3 (kN·m) | 254.45 | 0.0000 % |

## Envolvente del camión (277 posiciones, separación trasera fija)

| valor | Hekatan | OpenSeesPy |
|---|---|---|
| M3 máx (kN·m) | 241.8447 | 241.8447 (0.0000 %) |
| M3 mín (kN·m) | -254.4526 | -254.4526 (0.0000 %) |
| |V2| máx (kN) | 229.3880 | 229.3880 (0.0000 %) |
| |P| máx (kN) | 267.6266 | 267.6266 (-0.0000 %) |
| Uz mín (mm) | -9.6944 | -9.6944 (0.0000 %) |
| asiento máx losa inf. (mm) | -6.3824 | -6.3824 (0.0000 %) |
