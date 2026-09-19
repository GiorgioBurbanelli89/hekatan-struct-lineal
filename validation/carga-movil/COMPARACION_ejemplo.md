# Alcantarilla + HL-93 (ejemplo): Hekatan contra SAP2000 y OpenSeesPy

Alcantarilla (ejemplo) 2x3x2.5 m, HL-93 HL-93 (35/145/145 kN · 4.3/4.30 m). kN, m. · 86 nudos, 87 barras, 13 muelles, 147 posiciones (casos estáticos, mismas cargas nodales).
Error = |dif| / máximo del campo en todas las posiciones.

## Posición a posición (peor caso de todos los nudos/barras y posiciones)

| campo | pico Hekatan | OpenSeesPy |
|---|---|---|
| Ux (mm) | 3.4588 | 0.0000 % |
| Uz (mm) | 5.8512 | 0.0000 % |
| Ry (rad) | 0.0021306 | 0.0000 % |
| P (kN) | 128.93 | 0.0000 % |
| V2 (kN) | 129.40 | 0.0000 % |
| M3 (kN·m) | 77.760 | 0.0000 % |

## Envolvente del camión (147 posiciones, separación trasera fija)

| valor | Hekatan | OpenSeesPy |
|---|---|---|
| M3 máx (kN·m) | 71.5127 | 71.5127 (0.0000 %) |
| M3 mín (kN·m) | -77.7595 | -77.7595 (0.0000 %) |
| |V2| máx (kN) | 129.3978 | 129.3978 (0.0000 %) |
| |P| máx (kN) | 128.9331 | 128.9331 (0.0000 %) |
| Uz mín (mm) | -5.8512 | -5.8512 (0.0000 %) |
| asiento máx losa inf. (mm) | -5.8075 | -5.8075 (0.0000 %) |
