# Lo que ETABS, SAP2000 y SAFE traen de fábrica

Medido el 29-ago-2026 con `cli/defaults_csi.py`, que **le pregunta al programa**:
crea un modelo en blanco con una columna, una viga y un paño, y lee lo que el
programa pone solo. No es el manual — es lo único que
no envejece con la versión.

    python cli/defaults_csi.py            # los tres
    python cli/defaults_csi.py etabs      # uno

| ajuste | ETABS 22.6.0 | SAP2000 24.1.0 | SAFE 20 |
|---|---|---|---|
| **end length offset** | **auto** | manual (0,0,0) | **auto** |
| **edge constraint** (área) | **True** | False | — |
| releases | ninguno | ninguno | ninguno |
| modificadores de barra | 8 × 1.0 | (vacío) | 8 × 1.0 |
| modificadores de área | 10 × 1.0 | 10 × 1.0 | — |
| insertion point | 10 (centroide) | 10 | 10 |
| output stations viga | cada **0.5 m** | cada 0.5 m | cada 0.5 m |
| output stations columna | 3 estaciones | 3 | 3 |
| ángulo de eje local | 0.0 | 0.0 | 0.0 |
| materiales de serie | 4 | 2 | 4 |
| secciones de serie | — | — | catálogo W14 |
| áreas de serie | Slab1 · Deck1 · Wall1 · Plank1 | — | las mismas |
| patrones de carga | Dead, Live | DEAD | Dead, Live |
| casos | + Modal | + MODAL | — |
| diafragmas | D1 | no tiene | D1 |

Los materiales de serie, en los tres, con el peso IMPERIAL:

    4000Psi     23.563122 kN/m3      (150 lb/ft3)
    A992Fy50    76.972864
    A615Gr60    76.972864
    A416Gr270   76.972864

## Lo que esto explicó

- **ETABS pone brazos rígidos y SAP2000 no.** Por eso el `.s2k` cerraba el peso
  y el `.e2k` no: no era el exportador, era que los dos programas no modelan lo
  mismo de fábrica. Y ETABS **no pesa** el tramo de viga dentro del brazo.
- **`4000Psi` es de serie en los tres**, y es el material que se lleva el DECK
  aunque le asignes otro en `SetDeck`: `SetDeckFilled` lo reemplaza.

## Qué tiene ya Hekatan Struct y qué le falta

| | estado |
|---|---|
| end length offsets automáticos | ✅ `a_heks.py` los escribe (viga→columna medio ancho, columna→viga el canto, rz = 0) |
| no pesar el brazo en las vigas | ✅ el motor lo hace (`cliModeler`: viga < 20° con la horizontal) |
| releases: ninguno por defecto | ✅ igual |
| modificadores a 1.0 | ✅ igual |
| eje local 0.0 | ✅ igual |
| **edge constraint** | ⏳ Hekatan cose la malla (cookie cut) y los nudos coinciden, que es equivalente **en este modelo**; falta comprobarlo donde NO coincidan |
| **output stations** (viga cada 0.5 m) | ⏳ Hekatan reporta en los extremos: al comparar fuerzas hay que mirar la ESTACIÓN, no solo el valor |
| insertion point / cardinal point | ⏳ Hekatan trabaja con el eje; el descentrado real no se modela |

---

## LA REGLA: cada exportador, los defaults de SU programa

Esto es lo que estaba detrás del problema de exportación. **El mismo modelo
exportado a los tres programas no era la misma estructura**, porque cada uno
rellena por su cuenta lo que el fichero no dice:

| | ETABS | SAP2000 | SAFE |
|---|---|---|---|
| brazos rígidos | los pone **auto** | **no pone** | los pone **auto** |
| y ¿pesa el tramo del brazo? | **no** (en vigas) | — | por comprobar |

O sea que un `.e2k` sin offsets llega a ETABS **con** offsets, y el mismo modelo
en `.s2k` llega a SAP2000 **sin** ellos. De ahí que el `.s2k` cerrara el peso y
el `.e2k` no: no era el exportador, era el programa rellenando.

### Lo que hace ahora cada exportador

| | qué escribe | estado |
|---|---|---|
| **`.e2k`** (ETABS) | `LENGTHOFFI/J` + `RIGIDZONE` con el **rz del modelo** | ✅ arreglado — iba `RIGIDZONE 0.5` FIJO, y el defecto de ETABS es **0** (medido en sus 247 barras). Con 0.5 el brazo rigidiza; con 0 solo quita peso |
| **`.s2k`** (SAP2000) | tabla `FRAME OFFSET ALONG LENGTH ASSIGNMENTS` | ✅ **nueva** — no se escribía, y SAP2000 no los pone solo. Formato leído de su propia tabla `Frame Offset Along Length Assignments`: `Frame,Type,LengthI,LengthJ,RigidFactor`, con `Type = User` |
| **`.f2k`** (SAFE, cimentaciones) | — | ⏳ SAFE los pone **auto** (medido). Falta comprobarlo con vigas de cimentación: en un modelo vacío no expone la tabla (38 tablas, ninguna de offsets de frame) |

### `edge constraint` — medido: en este modelo NO cambia nada

Es **True en ETABS y False en SAP2000**, así que parecía un frente abierto. Se
midió con `cli/edge_constraint_efecto.py`: mismo `.EDB`, se apaga en las 3 áreas,
se reanaliza y se compara.

```
CON edge constraint     SumaRz  3474.392 kN   Uz  -31.431 mm
SIN edge constraint     SumaRz  3474.392 kN   Uz  -31.431 mm
diferencia:  carga 0.0000 %   flecha 0.0000 %
```

**Cero.** Y el motivo importa más que el número: el edge constraint solo actúa
cuando los nudos del borde de un área **no coinciden** con lo que tiene al lado.
Aquí la malla está cosida (cookie cut) y todos coinciden, así que no hay nada que
atar.

O sea: **Hekatan puede no tenerlo mientras cosa la malla** — por construcción
hace su trabajo. Donde haría falta es en un modelo con mallas que no casen, y ahí
Hekatan tampoco lo resolvería: los nudos sueltos se verían con
`cli/chequeo_conexion.py`, que es el camino que ya se usa.
