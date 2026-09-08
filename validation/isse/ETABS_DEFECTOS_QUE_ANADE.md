# Lo que ETABS 22 añade por defecto, dicho por el propio ETABS (8-sep-2026)

Pregunta de Jorge: «revisa bien el binario si solo son los brazos rígidos o es el mallado y el
edge constraint». Se mira primero lo que ETABS **escribe** (su `.$et` y su modelo de análisis
por OAPI) y después dónde vive cada cosa en los binarios. Sonda: `etabs_defaults_probe.py`
(1 planta, 4 columnas 0.5×0.5, 4 vigas 0.5×0.3 de 5 m, 1 losa de 0.20, sin tocar nada).

## 1 · Lo que escribe en el `.$et` y lo que hace al analizar

| defecto | dónde se ve | efecto medido | en Hekatan |
|---|---|---|---|
| **Brazos rígidos automáticos** en cada barra: columnas `offJ` = canto de la viga (0.50), vigas `offI = offJ` = medio ancho de columna (0.25), **RZ = 0** | `GetEndLengthOffset` → `auto=True`; en el `.$et` solo se escriben cuando se fijan a mano (`LENGTHOFFI 0 LENGTHOFFJ 600`, en mm, como en `mez_thin_auto_etabs.$et`); con `auto` no se escriben | RZ = 0 → **la rigidez no cambia**; pero ETABS **no pesa** el tramo de viga dentro del brazo: −5 % de masa de viga, **+2.88 % en períodos** (Paz 6.3, medido con `AssembledJointMass`) | ✅ **`offsets=1`** (defecto) en `plantillas` y `edificio-aporticado`: cada tramo de viga que toca columna pesa y masa con `L − ½b_col` por extremo (b en X, h en Y). Las 8 plantillas contra ETABS **con sus brazos puestos**: masa 0.000 %, estático 0.000 %, modos 1–3 0.00 %, fuerzas 0.000 %. `offsets=0` = SAP2000. El driver deja los brazos por defecto (`--nooffsets` los anula) |
| **Automallado** de losas y muros a **1.25 m** (`AUTOMESHOPTIONS MESHTYPE "GENERAL" FLOORMESHMAXSIZE 1250 WALLMESHMAXSIZE 1250`) y de barras en sus intersecciones (`AUTOMESH "YES" MESHATINTERSECTIONS "YES"`) | `.$et` §ANALYSIS OPTIONS y §LINE ASSIGNS; modelo de análisis: 1 losa → 16 áreas, 4 vigas → 16 líneas, 8 puntos → 29 | cambia la **malla**, no el elemento. Con malla ≤ 1.25 m dada explícitamente (las plantillas, 1.2 m) ETABS la respeta y da 0.0000 %. `OBJMESHTYPE "NONE"` del e2k lo **reescribe como "DEFAULT"** en losas (por eso malló igual el nudo colgado) | ✅ **`automesh <tam>`** (8-sep-2026): parte los paños Q4 en celdas ≤ tam, como ETABS. Medido: losa 5×5 → **25 nudos y 16 cáscaras, las mismas que ETABS**, y los 25 nudos a **1.1e-10 %**. Apagado por defecto (Hekatan resuelve la malla que se le da); `automesh 1.25` = ETABS. Y `meshcross` parte las X |
| **Edge constraint** de las áreas: **encendido** (`GetEdgeConstraint → True`), no se escribe en el `.$et` | OAPI | solo actúa donde el automallado deja nudos colgados; con malla conforme ON = OFF (medido dos veces) | ✅ equivale a partir el paño (`deck etabs`) |
| `ADDRESTRAINT "No"` en la losa | `.$et` §AREA ASSIGNS | **no es** el edge constraint (que va encendido con `ADDRESTRAINT "No"`). Y **no da igual**: con `"Yes"`, cuando ETABS automalla el paño **empotra todos los nudos NUEVOS del borde** que tocan un nudo restringido. Losa 5×5 apoyada solo en sus 4 esquinas: con `"Yes"` los 16 nudos de borde a cero y **7 veces más rígida** (w 4.99e-4 contra 3.58e-3); con `"No"`, solo las 4 esquinas y w = 3.5841e-3 = Hekatan a 0.00000 % | ✅ el exportador escribía `"Yes"`: **corregido a `"No"`** el 8-sep-2026. No se veía en las plantillas porque allí la malla va hecha en el fichero y ETABS no crea ni un nudo |
| **Merge tolerance** 1 mm (`MERGETOL 1`) | `.$et` §CONTROLS | funde puntos a menos de 1 mm; nuestro e2k pone 0.001 mm | — |
| **Fuente de masa**: elementos + masa añadida, **solo lateral**, **agrupada por planta** (`INCLUDEVERTICALMASS "No"`, `LUMPATSTORIES "Yes"`) | `.$et` §MASS SOURCE | los períodos van con esa masa | ✅ `modal(…, lateral=1)`, columnas piso a piso |
| Diafragma `D1` definido pero **no asignado** | `.$et` §DIAPHRAGM NAMES, ningún `DIAPH` en los puntos | nada, hasta que se asigna | ✅ `diaph` |
| Estaciones de salida: `MINNUMSTA 3` (columnas), `MAXSTASPC 500` mm (vigas) | `.$et` | solo dónde reporta fuerzas | — |
| P-Delta `NONE` | `.$et` | — | — |
| Unión viga–muro (no está en el `.$et`: es del ensamble) | medido en modelo mínimo | 0.55 % | ✅ `etabsjoint 1` |

## 2 · Dónde vive cada cosa en los binarios (cadenas ASCII/UTF-16)

| mecanismo | binario | veces |
|---|---|---|
| Auto Mesh / AutoMesh / Floor Mesh / Wall Mesh | **ETABS.dll** | 66 / 86 / 27 / 10 |
| Edge Constraint · Line Constraint | **ETABS.dll** | 21 · 5 |
| Rigid Zone · End Length Offset | **ETABS.dll** | 6 · 11 |
| Mesh at Intersections · Merge Tolerance | **ETABS.dll** | 2 · 7 |
| (solver) CsiGo2.dll / CSI.SAPFire.CsiGo.dll | ninguna de las anteriores | 0 |

Conclusión: **ninguno de los tres vive en el solver**. Automallado, edge constraint y brazos son
del **preprocesador** (`ETABS.dll`): transforman los objetos en el modelo de análisis antes de que
`CsiGo2.dll` reciba nada. Por eso SAP2000 (mismo solver, otro preprocesador) da lo mismo que
Hekatan sobre la misma malla sin más, y ETABS solo cuando la malla ya viene hecha.

## 3 · Respuesta corta

No es solo los brazos: son **tres** cosas por defecto, y las tres son de preprocesado:
1. brazos rígidos automáticos → **solo peso y masa** (RZ = 0) → `offsets=1` (hecho, 8 plantillas 0.000 %);
2. automallado a 1.25 m + partir barras en intersecciones → **malla** → `automesh 1.25` (o se da la malla hecha);
3. edge constraint encendido → **solo con nudos colgados** → partir el paño.
Más la fuente de masa lateral por plantas (ya está) y el `MERGETOL` de 1 mm (sin efecto medido).
