# T_u de las vigas vs mallado de la losa — Mesa de Torsión (2026-09-23)

Modelo: Mesa torsiónT.e2k (ETABS 19.1, Seproinca 2020): losa 6x6 t=0.10 Shell-Thin, vigas V30x50, columnas C40x40 articuladas, 4000Psi E=2534564 tonf/m2.
Caso: UDCon2 = 1.2 Dead(peso propio) + 1.6 Live(0.5 tonf/m2) + 1.2 SCP(1.0 tonf/m2), del .e2k. Unidades: tonf, m; T_u y m en tonf·m y tonf·m/m; flecha en mm; periodos en s.

- Viga analizada: la sur (y=0). T_u = max |T| en las vigas (sale en el extremo, cara de columna).
- m_borde = M_yy de la losa en el nudo central del borde sur (joints sin suavizar promediados; n=1: interpolado entre esquinas).
- integral_m = ∫_0^{L/2} m(x) dx por trapecios sobre los nudos del borde. Equilibrio de la media viga: T_u(apoyo) = -∫ m dx.
- flecha: w en el centro de la losa (n impar: media de las 4 esquinas del elemento central).
- Brazos rígidos OFF en Hekatan y ETABS. Masa modal como ETABS (K_M): viga en las esquinas, lateral, por piso.
- ETABS: 22 por OAPI, FLOORMESHMAXSIZE = 6/n, mismo combo, viga partida en los nudos de la losa.

## 1. Convergencia de malla (Hekatan vs ETABS 22)

| n | T_u Hekatan | T_u ETABS | dif | m_borde | ∫₀^{L/2} m dx | flecha centro | T3 Hekatan | T3 ETABS | dif |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.000 | 0.000 | — | 0.000 | 0.000 | -0.24* | 0.3416 | 0.3438 | -0.6 % |
| 2 | 2.615 | 2.528 | 3.4 % | -2.525 | -4.098 | -32.45 | 0.3031 | 0.3051 | -0.7 % |
| 4 | 5.040 | 4.860 | 3.7 % | -3.225 | -5.654 | -33.72 | 0.2927 | 0.2946 | -0.6 % |
| 5 | 5.421 | 5.226 | 3.7 % | -3.085 | -5.845 | -30.26* | 0.2914 | 0.2933 | -0.6 % |
| 8 | 5.849 | 5.639 | 3.7 % | -3.330 | -6.052 | -32.91 | 0.2900 | 0.2919 | -0.7 % |
| 16 | 6.059 | 5.844 | 3.7 % | -3.354 | -6.151 | -32.67 | 0.2893 | 0.2912 | -0.7 % |
| 32 | 6.118 | 5.903 | 3.7 % | -3.361 | -6.180 | -32.60 | 0.2891 | 0.2910 | -0.7 % |

* sin nudo en el centro: media de las esquinas del elemento central (n = 1 es la cabeza de columna).

## 2. Equilibrio de la media viga: T_u(apoyo) vs −∫₀^{L/2} m(x) dx

| n | T_u | −∫ m dx | razón |
|---|---|---|---|
| 1 | 0.000 | 0.000 | — |
| 2 | 2.615 | 4.098 | 0.638 |
| 4 | 5.040 | 5.654 | 0.891 |
| 5 | 5.421 | 5.845 | 0.927 |
| 8 | 5.849 | 6.052 | 0.967 |
| 16 | 6.059 | 6.151 | 0.985 |
| 32 | 6.118 | 6.180 | 0.990 |

## 3. Viga unida a la losa SOLO en sus extremos (losa 16×16, viga de una pieza)

T_u = 0.0000 · m_borde = 0.0002 · flecha centro = -210.3 mm (compatible 16×16: -32.7 mm) · T3 = 0.2898 s. ETABS con n = 1 (mismo caso: la viga no comparte nudos intermedios): T_u = 7.8e-17.

## 4. Iteración ACI 318-19 §22.7.3.2 (malla 16×16)

f'c = 4000 psi · Acp = 232.5 in² · pcp = 62.99 in · T_cr = 2.501 · **φT_cr = 1.876 tonf·m** (φ = 0.75, λ = 1, sección sin alas).

| paso | factor J | T_u | φT_cr/T_u | m_borde | m_centro | flecha |
|---|---|---|---|---|---|---|
| 0 | 1.0000 | 6.059 | 0.310 | -3.354 | 2.257 | -32.67 |
| 1 | 0.3096 | 5.026 | 0.373 | -2.679 | 2.537 | -38.10 |
| 2 | 0.1156 | 3.574 | 0.525 | -1.781 | 2.922 | -45.61 |
| 3 | 0.0607 | 2.538 | 0.739 | -1.190 | 3.189 | -50.83 |
| 4 | 0.0448 | 2.094 | 0.896 | -0.951 | 3.301 | -53.02 |
| 5 | 0.0402 | 1.943 | 0.965 | -0.873 | 3.339 | -53.75 |

## 5. Viga no agrietada vs agrietada (malla 16×16, UDCon2)

| caso | factor J | T_u | m_borde (−) | m_centro (+) | −m_borde + m_centro | flecha | T3 |
|---|---|---|---|---|---|---|---|
| no agrietada (J bruta) | 1.0000 | 6.059 | -3.354 | 2.257 | 5.612 | -32.67 | 0.2893 |
| fisurada típica J·0.15 | 0.1500 | 3.993 | -2.033 | 2.812 | 4.845 | -43.46 | 0.2955 |
| SAFE J·0.10 | 0.1000 | 3.337 | -1.642 | 2.984 | 4.626 | -46.81 | 0.2959 |
| iteración ACI φT_cr/T_u | 0.0402 | 1.944 | -0.874 | 3.339 | 4.212 | -53.75 | 0.2964 |

Estática del corte x = L/2 a ancho completo (tonf·m): M_losa = ∫ m_xx dy, M_vigas = M3 de las vigas S y N, M_pórtico = H·h (empuje horizontal de las bases articuladas × 4 m). Su suma es el momento estático del medio modelo (reacciones y cargas), que NO depende de la rigidez:

| caso | M_losa | M_vigas | M_pórtico | suma | estático |
|---|---|---|---|---|---|
| no agrietada (J bruta) | 8.115 | 32.791 | 24.775 | 65.681 | 65.681 |
| fisurada típica J·0.15 | 10.947 | 31.775 | 22.959 | 65.681 | 65.681 |
| SAFE J·0.10 | 11.811 | 31.479 | 22.390 | 65.681 | 65.681 |
| iteración ACI φT_cr/T_u | 13.568 | 30.911 | 21.202 | 65.681 | 65.681 |

- El positivo al centro de la losa sube 48 % (2.257 → 3.339 tonf·m/m) y el negativo de borde baja 74 %. La losa toma 5.45 tonf·m más en el corte central (8.11 → 13.57).
- −m_borde + m_centro en UN punto NO se conserva (5.61 → 4.21): no es una franja sobre apoyos rígidos, las vigas flechan y el reparto es bidireccional. Lo que se conserva exacto es el momento del corte completo (tabla de arriba).
- Consecuencia para el armado: el acero inferior al centro de la losa se diseña con el m_centro DESPUÉS de fisurar la viga; el negativo de borde baja en la misma proporción (las dos cosas salen del MISMO análisis con J reducida). La viga lleva estribos cerrados y longitudinal para φT_cr.
