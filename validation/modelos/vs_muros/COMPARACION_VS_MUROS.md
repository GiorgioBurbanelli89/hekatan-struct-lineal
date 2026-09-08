# Edificio con muros, A contra B: Hekatan Struct lineal, ETABS 22 y SAP2000 24

![A · muros en X   VS   B · muros en X e Y](VS_muros_hekatan.png)

**El edificio**: `edificio-aporticado` de Hekatan Struct, 6 pisos de 3 m, 3×3 vanos de 5 m,
losa de 12 cm (placa, Thin), columnas y vigas de hormigón, sin diagonales. Cargas: 7 kN en
cada nudo de eje de columna por planta (Σ = 378 kN) y un empuje lateral de 50 kN.

| variante | muros de corte (t = 25 cm) | nudos | barras | cáscaras |
|---|---|---|---|---|
| **A** | en X (primer vano de las dos fachadas Y) | 3333 | 894 | 3120 |
| **B** | en X e Y (primer vano de las cuatro fachadas) | 3981 | 984 | 3840 |

Los tres programas resuelven **la misma malla nudo a nudo** (el `.e2k` y el `.s2k` salen del
mismo modelo con `cli/exportar_csi.mjs`; ETABS y SAP2000 los abren, guardan, corren y se leen
por la OAPI con `cli/plantillas_etabs.py` y `cli/plantillas_sap2000.py`). La comparación es de
`cli/ejemplo_vs_csi.mjs`: cada nudo casado por coordenadas (0,1 mm), error medido contra el
desplazamiento máximo del modelo.

## Lo que sale

### Estático (caso Dead + empuje)

| | A · Hekatan vs SAP2000 | A · Hekatan vs ETABS | B · Hekatan vs SAP2000 | B · Hekatan vs ETABS |
|---|---|---|---|---|
| ΣFz en la base | 378.000 = 378.000 kN | 378.000 = 378.000 kN | 378.000 = 378.000 kN | 378.000 = 378.000 kN |
| nudos de barra (columnas y vigas) | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| peor nudo del modelo (cáscaras) | **0.000 %** (9999/9999 dentro del 0.01 %) | 1.27 % del máximo | **0.000 %** (11943/11943) | 3.27 % del máximo |
| dónde está el peor nudo | — | coronación del muro, u_y | — | coronación del muro en Y (x = 10), u_x |
| u_max Hekatan | 7.98·10⁻⁴ m | | 4.07·10⁻⁴ m | |

Con `comparar = 0` (unión viga-muro como SAP2000) Hekatan y SAP2000 dan **el mismo número en
todos los nudos**. Con `comparar = 1` (la unión de ETABS) la diferencia contra SAP sube al 0.10 %
(A) y 0.26 % (B), y contra ETABS apenas baja (1.31 → 1.27 % en A, 3.50 → 3.27 % en B).

### Modos (Hekatan contra ETABS; SAP2000 no lleva caso modal en el `.s2k`)

| modo | A · Hekatan | A · ETABS | dif | B · Hekatan | B · ETABS | dif |
|---|---|---|---|---|---|---|
| 1 | 0.7667 s | 0.7659 s | 0.10 % | 0.2525 s | 0.2493 s | 1.3 % |
| 2 | 0.2438 | 0.2433 | 0.2 % | 0.2185 | 0.2156 | 1.3 % |
| 3 | 0.2340 | 0.2315 | 1.1 % | 0.1358 | 0.1323 | 2.6 % |
| 4 | 0.2158 | 0.2130 | 1.3 % | 0.0710 | 0.0553 | no es el mismo modo |
| 5 | 0.1355 | 0.1347 | 0.6 % | 0.0577 | 0.0492 | no es el mismo modo |
| 6 | 0.0896 | 0.0886 | 1.1 % | 0.0564 | 0.0339 | no es el mismo modo |

Masa total en ETABS: 525.8 t (A). Los modos 4–6 de B en ETABS son modos locales de los muros,
que en Hekatan salen en otro orden: hay que emparejarlos por participación de masa, no por número.

### Qué cambia de A a B (lo que la figura quiere enseñar)

| | A · muros en X | B · muros en X e Y | cambio |
|---|---|---|---|
| desplazamiento máximo (Dead + empuje) | 7.98·10⁻⁴ m | 4.07·10⁻⁴ m | **−49 %** |
| T1 (ETABS) | 0.766 s | 0.249 s | **÷3.1** |
| tiempo de análisis ETABS | 137 s | 91 s | |
| tiempo de análisis SAP2000 | 10 s | 6 s | |

Dos muros más en la dirección débil bajan el desplazamiento a la mitad y el período a un tercio:
el primer modo de A era de traslación en Y (sin muros en esa dirección) y en B ya no existe.

## Lectura

- **Hekatan = SAP2000** con la misma malla: coincidencia exacta en desplazamientos y reacciones,
  en las dos variantes. Es el mismo elemento (Shell-Thick de CSI extraído del binario, membrana
  tipo 12) y la misma unión.
- **Hekatan vs ETABS**: barras y reacciones exactas; en las cáscaras de muro 1.3 % (A) y 3.3 % (B)
  en la coronación, y los tres primeros períodos dentro del 0.1–2.6 %. La diferencia vive en cómo
  ETABS trata la unión del muro con la viga y la losa (edge constraints y su unión viga-muro), no en
  el elemento. El interruptor `comparar` de Hekatan la imita solo en parte en este ejemplo: queda
  abierto medirla en un modelo mínimo (un muro, una viga, una losa).
- ETABS rechazó el `.e2k` de B en la primera pasada («falla abrir», 3 s) por estar ocupado tras A;
  solo, abrió y resolvió en 91 s. No es un problema del fichero.

## Reproducir

```bash
cd hekatan-struct
node cli/exportar_csi.mjs edificio-aporticado validation/modelos/vs_muros/A_murosX  murosMode=1 nPisos=6 bracesMode=0 slabOn=1
node cli/exportar_csi.mjs edificio-aporticado validation/modelos/vs_muros/B_murosXY murosMode=3 nPisos=6 bracesMode=0 slabOn=1
python cli/plantillas_etabs.py   validation/modelos/vs_muros validation/modelos/vs_muros/etabs
python cli/plantillas_sap2000.py validation/modelos/vs_muros validation/modelos/vs_muros/sap
node cli/ejemplo_vs_csi.mjs edificio-aporticado validation/modelos/vs_muros/sap/A_murosX.json murosMode=1 nPisos=6 bracesMode=0 slabOn=1 comparar=0
node cli/shot_vs_muros.mjs        # la figura, desde la web construida
```

8-sep-2026. Bitácora: `registros/2026-09-08_cad_interfaz_autocad.md`.
