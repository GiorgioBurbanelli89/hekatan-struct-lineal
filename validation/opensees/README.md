# Hekatan Struct contra OpenSees, mismo modelo nodo a nodo

Modelo: galpón curvo de 20 m (enlace `?m=95IbfMcEkc2xvBS`), 214 nudos, 443 barras,
100 chapas de zinc de 0.8 mm. Medido el 16-sep-2026.

```bash
node tests/lib/dump_heks.mjs modelo.heks dump.json
python validation/opensees/heks_a_opensees.py dump.json opensees.json 12
node cli/_modal_wasm_entrega.mjs modelo.heks hek_modal.json 12
node validation/opensees/hek_fuerzas.mjs modelo.heks hek_fuerzas.json
```

Las cargas son las que Hekatan ya repartió a los nudos (peso propio incluido): así se
comparan SOLVERES, no repartos de carga. Suma de reacciones idéntica (342.8725 kN).

## Lo que sale

| qué | solo barras | con la chapa (misma física en los dos) |
|---|---|---|
| desplazamientos, peor nudo | **0.055 %** | **0.180 %** |
| T1 | **+0.009 %** | −4.12 % |
| T1..T5 | ≤0.01 % | −0.5 a −6 % |

- **Las barras son el mismo elemento**: Timoshenko 3D contra `ElasticTimoshenkoBeam` de
  OpenSees, 0.009 % en el periodo y 0.055 % en la flecha.
- **La diferencia está en la MEMBRANA de la chapa.** No es la masa (quitándole la masa a
  la chapa la diferencia sigue en −5 %) ni la rigidez a flexión (con flexión en las dos,
  el estático baja a 0.18 %). Es la rigidez EN EL PLANO: Hekatan usa ITW 1990 con burbuja
  y proyección del drilling (tipo 13) y OpenSees `ShellMITC4` una membrana bilineal; la de
  Hekatan es más flexible, por eso sus periodos salen mayores.
- Bajo gravedad la chapa apenas trabaja a membrana: por eso el estático casi clava y el
  modal no.

Fuerzas de extremo de barra (con chapa, % del máximo de cada campo):
N 1.16 % · V2 2.18 % · V3 0.19 % · M2 0.12 % · M3 1.29 % · T 83.8 % **del máximo 0.0646
kN·m** (o sea 0.054 kN·m: la torsión de este modelo es ruido).

## ⚠️ Dos trampas que costaron una vuelta

1. **Ejes locales.** `geomTransf` de OpenSees quiere el vector del plano local x-z, que es
   el eje **3** de CSI (Z × x, horizontal), no el eje 2. Con el eje cambiado salía −54 % en T1
   y 48 % en la flecha; con el eje bien, 0.009 %.
2. **Áreas de cortante.** AS2 (cortante en el eje 2) = `shearAreasZ` de Hekatan, y AS3 =
   `shearAreasY`. Entran cruzadas si se leen por el nombre.

## Falta
- SAP2000 y ETABS sobre este mismo modelo (juez primero SAP, luego ETABS).
- Esfuerzos de la chapa joint a joint y participación de masa modal en los tres.

---

# Los TRES jueces, 16-sep-2026 (galpón curvo, 214 nudos, 443 barras, 100 chapas)

Hekatan = rama `sin-binario` (drilling tipo 13, flexión MITC4 + modos de Wilson).
**Nada de CSI en el motor.**

| modo | Hekatan | SAP2000 | ETABS | OpenSees |
|---|---|---|---|---|
| 1 | 0.331144 | **−0.00 %** | **−0.02 %** | −4.30 % |
| 2 | 0.323795 | **−0.00 %** | **−0.01 %** | −4.07 % |
| 3 | 0.279379 | **−0.00 %** | −0.13 % | −6.13 % |
| 4 | 0.172513 | **−0.00 %** | **−0.01 %** | −0.81 % |
| 5 | 0.159825 | **−0.00 %** | −0.02 % | −1.31 % |

Desplazamientos, peor nudo: SAP2000 **0.023 %** · ETABS **0.000 %** · OpenSees 4.45 %.
Fuerzas de barra: SAP N 0.003 % V3 0.004 % M2 0.002 % M3 0.035 % · ETABS ≤0.72 %.
(La torsión da porcentajes altos sobre un máximo de 0.03 kN·m: es ruido, no torsión.)

## MASA VERTICAL: lo que separaba a ETABS

SAP2000 trae la masa en las **tres** direcciones. ETABS trae **solo la lateral**, así que
sus modos verticales no existen: SumUZ = 0 y los modos se corren de sitio (el modo 4 salía
−29.7 %, pero es que su "modo 4" era el 6). Al encenderla, ETABS pasa a −0.01 %.

- En el binario: `IncludeLateralMass` / `IncludeVerticalMass` (y `LateralMassOnly`,
  `VerticalMassOnly`) en `ETABS.dll` y `CSI.SAPModel.dll`.
- Por OAPI **no hay** `SourceMass`: se toca la tabla `Mass Source Definition` de
  `DatabaseTables`, campos `Name, IsDefault, IncLateral, IncVertical, LumpMass, …`.
- En el `.e2k`: `MASSSOURCE … INCLUDELATERALMASS "Yes" INCLUDEVERTICALMASS "No"
  LUMPATSTORIES "Yes"`. **`e2kExporter.ts:2028` escribe hoy `VERTICALMASS "No"`**, o sea
  el defecto de ETABS: quien exporte a e2k y corra el modal NO verá los modos verticales.
- Hekatan ya tiene los dos modos en `modal.cpp` (`lateral_mass`, `lump_stories`).

→ **Regla: la masa del modal tiene que ir emparejada con el destino.** s2k/SAP2000 = masa
3D. e2k/ETABS = lo que diga el MASSSOURCE del propio fichero.

## Tres trampas de ETABS por OAPI (todas costaron una vuelta)

1. Masa del material: `SetWeightAndMass` hay que llamarlo **dos veces** (opción 1 = peso,
   opción 2 = masa). Con solo la 1, `ModalPeriod` devuelve código 1 y ya.
2. Pisos: sin `Story` que cubran el modelo, la masa no se reparte y el `.LOG` dice
   `THE STRUCTURE HAS NO (UNRESTRAINED) MASS`. Y **`SetStories_2` NO lleva elevaciones**:
   es `(BaseElevation, NumberStories, StoryNames, StoryHeights, IsMasterStory, …)`.
3. ETABS puede guardar la barra con los **extremos al revés**. Comparar el extremo i con
   el j daba un M3 del 73 % que no existía (3.2289 contra 3.2254).

## OpenSees: cuál elemento de chapa

Voladizo de chapa, 4 elementos (`tira_membrana_voladizo.heks`), flecha en punta:

| | flecha | vs viga de Timoshenko |
|---|---|---|
| Viga de Timoshenko | −1.6780e−3 | — |
| **ASDShellQ4** (Petracca y Camata) | −1.6346e−3 | −2.6 % |
| **Hekatan** | −1.6133e−3 | −3.9 % |
| `ShellMITC4` clásico | −1.0609e−3 | **−36.8 %** (bloquea) |

En el galpón, ASDShellQ4 (0.317142) y ShellMITC4 (0.316904) dan lo MISMO: el −4.3 % de
OpenSees NO era la membrana. **Era la matriz de MASA, y el error era del traductor.**

## El −4.3 % de OpenSees: era la masa, no el solver

Cómo se encontró, descartando:

| prueba | resultado | qué descarta |
|---|---|---|
| solo barras, sin chapa | 0.009 % | las barras |
| chapa sin masa (densidad 0) | sigue −4.8 % | la masa de la chapa |
| chapa con flexión en los dos | estático 0.18 %, modal −4.12 % | la flexión |
| drilling tipos 2, 3, 8, 13 y γ ×100 | T1 entre 0.3307 y 0.3313 | la membrana |
| **carga lateral, estático** | **0.500 %** | **la rigidez: coincide** |
| masa CONCENTRADA en vez de `-cMass` | **−0.25 %** | ✅ era esto |

El estático coincidía y el modal no: eso solo puede ser la masa. `heks_a_opensees.py`
pedía `-cMass` (masa consistente) y **Hekatan y SAP2000 usan masa CONCENTRADA** en los
nudos. Con la masa concentrada, los 12 modos con la misma física caen dentro del **0.43 %**:

| modo | 1 | 2 | 3 | 4 | 5 | 6 | 12 |
|---|---|---|---|---|---|---|---|
| Hek vs OpenSees | −0.06 % | −0.04 % | −0.27 % | −0.24 % | −0.37 % | −0.43 % | −0.19 % |

Y en el modelo tal cual (chapa como membrana pura, que OpenSees no puede reproducir porque
`ElasticMembranePlateSection` siempre lleva flexión), los modos 1-5 quedan en −0.25 a
−0.63 % y los 6-9 se van hasta −11 %: esos son modos LOCALES de la chapa, y ahí manda la
flexión que Hekatan anula. No es el solver: es que el modelo no es el mismo.

## Correrlo dentro de Hekatan Py (16-sep-2026)

`heks_a_opensees.py` se abre en Hekatan Py y se le da a correr. Tres cosas que hubo que
resolver, todas verificadas con `--shot` (ver `hekatan_py_gif_embebido.png`):

1. **`IndexError: list index out of range`.** Hekatan Py copia el código a `%TEMP%` y lo
   ejecuta SIN argumentos, así que `sys.argv[1]` no existe. Ahora el script busca el dump
   solo (junto al script, en la carpeta de trabajo, y en un ancla en `%APPDATA%` con la
   última ruta usada desde la terminal).
2. **El GIF se ve DENTRO del Output**, no en un visor aparte: Hekatan Py tiene marcadores de
   stdout (`PythonPipeline.RenderStdoutLine`) — `__CPSPY_GIF__:<base64>` pinta una animación
   y `__CPSPY_HTML__:` mete HTML en crudo. Un `print` normal pasa por `HtmlEncode` y sacaría
   el base64 como texto.
3. Corre con **Python real** (openseespy no existe en el motor nativo), que es lo que hace el
   pipeline al ver el import.

```
HekatanPython3.exe heks_a_opensees.py --shot salida.png
```
