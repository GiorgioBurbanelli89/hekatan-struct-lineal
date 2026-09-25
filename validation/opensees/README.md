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

## 22-sep-2026: el −11 % de los modos locales era la FLEXIÓN de la chapa
Con `--flexion=hekatan` (la chapa como membrana, igual que Hekatan) OpenSees queda a ≤0.37 % en los 12 periodos
(ShellMITC4 0.27 % / ASDShellQ4 0.12 % en el estático). Ver `registros/2026-09-22_galpon_opensees_placa.md`.

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

---

# VÍDEOS y edificios de geometría compleja (16-sep-2026)

## 1. El galpón en los cuatro programas

`video_4_programas.py` — la estructura vibrando a la izquierda y la tabla de periodos de los
cuatro a la derecha, con el modo en curso en oro. 90 fotogramas, `video_4_programas.mp4/.gif`.

```
python validation/opensees/video_4_programas.py <carpeta> [frames_por_modo]
```
Variables de entorno: `HK_TITULO`, `HK_PIE1`, `HK_PIE2`, `HK_SHELL` (ShellMITC4 o ASDShellQ4).

## 2. La torre retorcida (Turning Torso)

`gen_torre_retorcida.py` genera la geometría más difícil que hay: la planta **gira 90° de la
base a la cima**, así que **ninguna columna es vertical** y cada viga va torcida respecto a la
de abajo. Los datos del edificio real de Malmö son públicos (54 plantas, 190 m, giro de 90° en
nueve cubos de cinco plantas); aquí se reproduce el esquema, no el edificio.

```
python validation/opensees/gen_torre_retorcida.py torre.heks 27 90 2 2
```
27 plantas · 94 m · pentágono de R = 10 m con núcleo de r = 3.5 m · 820 nudos · 1080 barras ·
540 cáscaras. Losa mallada 2×2 por sector y **vigas trazadas sobre los bordes de la malla**.

| modo | Hekatan | SAP2000 | OpenSees (ASDShellQ4) |
|---|---|---|---|
| 1 y 2 (flexión) | 5.220776 | −7.25 % | **−0.77 %** |
| 3 (torsión) | 2.487900 | +5.03 % | **−0.48 %** |
| 4 y 5 | 1.324365 | −7.03 % | **−0.75 %** |
| 10 | 0.540492 | +5.36 % | **+0.03 %** |

### Lo que enseñó, que es más que los números

1. **El ShellMITC4 clásico BLOQUEA en torsión.** Con él los modos torsionales de la torre se
   iban **−9.4 %** y los de flexión solo −0.2 %; con el ASDShellQ4 de Petracca y Camata, +0.06 %.
   Es el mismo bloqueo que la tira en voladizo daba a −36.8 %: en los modos de torsión la losa
   trabaja a **cortante en su plano**, que es donde el Q4 bilineal se agarrota.
2. **Un Q4 muy distorsionado miente.** Con la losa sin mallar (un trapecio por sector, lado
   interior 4 m y exterior 12 m) la torre salía a T1 = 2.87 s; con la malla 2×2, 5.22 s. El
   elemento gordo estaba bloqueado y **fingía rigidez que no existe**. Ahí cada programa daba
   lo suyo y SAP2000 se iba un 254 %.
3. **Los nudos duplicados no se ven y lo rompen todo.** El generador dejaba 27 nudos repetidos
   (uno por planta, al cerrar el pentágono). **SAP2000 los fusiona por su MERGETOL y Hekatan
   no**: dos modelos distintos sin un solo aviso. Se cazó porque SAP decía 820 nudos y el dump
   tenía 847.

### ⏳ Lo que queda abierto

SAP2000 se queda en **±7 %**, alternando signo: más rígido en flexión (−7 %) y más flexible en
torsión (+5 %). Ya no son los duplicados ni la malla. Apunta a la losa: su Shell-Thick no es el
MITC4 + modos de Wilson de Hekatan. Sin losas, **Hekatan = SAP2000 a 0.000 % en los 6 modos**,
así que las barras torcidas no tienen nada que ver.

## Los VÍDEOS (formato Hekatan School)

Lo primero que salió fue una animación muda con una tabla al lado, y eso **no es un vídeo**.
El formato de la casa es otro: voz en español, **subtítulo solo en inglés** en la franja de
abajo, marca de agua y logo, y una frase por paso con su dibujo. El motor ya existe:

```bash
# 1. el máster 1280x720, con la franja de abajo LIBRE para el subtítulo
python validation/opensees/video_4_programas.py <carpeta> 110
# 2. los fotogramas al formato que pide el montador: f000.png... + pasos.json
# 3. voz + subtítulo + marca
HS_FRANJA_SUB=1 python hekatan-school/montar_tutorial.py FRAMES es.txt SALIDA.mp4 en.txt
```

`montar_tutorial.py` sintetiza cada frase (edge-tts, es-MX-JorgeNeural), **mide cuánto dura** y
estira o aprieta los fotogramas de ese paso para que encajen: manda la voz, no el reloj.

| vídeo | duración | qué cuenta |
|---|---|---|
| `VIDEO_galpon_v2.mp4` | 46.8 s | el galpón en los cuatro programas, y la masa vertical de ETABS |
| `VIDEO_torre_v2.mp4` | 43.7 s | la torre retorcida, el bloqueo del ShellMITC4 en torsión y lo que queda abierto con SAP2000 |

Guiones en `hs_galpon_es.txt` / `_en.txt` y `hs_torre_es.txt` / `_en.txt`, una frase por paso.
⚠️ Con 110 fotogramas por modo la animación va a ~8 fps dentro del vídeo; con 30 salía a 1.9 fps
y se veía a saltos. Y el máster va a 1280x720 dejando ~90 px libres abajo: sin esa franja, la
segunda línea del subtítulo se sale del cuadro.

### CERRADO: el ±7 % de la torre es el Shell-THICK, y se mide aquí

Con SAP2000 de juez, quitando una cosa cada vez:

| modelo | Hekatan vs SAP2000 | Hekatan vs ETABS |
|---|---|---|
| **sin losas** (solo barras torcidas) | **0.000 %** en los 6 modos | **0.000 %** |
| losas **Shell-Thin** (DKQ) | **0.000 %** en los 6 modos | — |
| losas **Shell-Thick** | **−7.25 %** | +8.66 % |
| losas Thick **sin masa** | −7.257 % (idéntico) | — |

Lo que descarta cada fila: las barras torcidas no son (0.000 % sin losas); la masa de la losa
tampoco (quitándola, el −7.257 % no se mueve ni una milésima); el drilling tampoco (tipos 0, 2,
3, 8 y 13 dan entre 5.218 y 5.259 s, y SAP pide 4.842); y la malla tampoco (SAP arma 820 nudos,
540 áreas y 1080 barras, ninguna partida, exactamente lo que se le manda).

**Queda el elemento de placa gruesa.** El Shell-Thin de Hekatan es la DKQ de Batoz y Ben Tahar
y clava con el de SAP2000 hasta el último dígito; el Shell-Thick es MITC4 + modos incompatibles
de Wilson, que **no es el de CSI** — es el que se retiró al quitar lo del binario. En una placa
apoyada eso valía 0.4–1.9 %; en esta torre, donde la losa trabaja de verdad, vale **7 %**.

⚠️ Y SAP2000 y ETABS **discrepan un 16 % entre ellos** en el mismo modelo con Thick (−7.25 % y
+8.66 % respecto a Hekatan), mientras Hekatan y OpenSees, que son dos motores sin semántica de
edificio, se quedan a 0.8 %. Sin losas, los tres coinciden a 0.000 %.

⏳ La prueba que falta: recompilar con el Shell-Thick de CSI (el parche de `hekatan-struct-csi`)
y ver si la torre vuelve a 0.000 % contra SAP2000. Eso cerraría la cadena entera.

## La PLACA PURA: aquí es donde está el problema (17-sep-2026)

Antes de mirar la cáscara hay que mirar la placa sola, sin membrana. CSI la tiene aparte
(SAP2000: 3 PlateThin, 4 PlateThick; ETABS: 4 y 5, que su propia API marca `DO_NOT_USE`), y el
driver la pide con `--placa`. Placa cuadrada de 10 m simplemente apoyada, malla 8×8, con **SAP2000
de juez**:

| | Hekatan vs SAP2000 |
|---|---|
| **PlateThin** (DKQ) | **1.3e−11 %** — es el MISMO elemento |
| **PlateThick** | **1.072 %** |

Y barriendo el espesor (w del centro, carga uniforme):

| t/L | SAP2000 | Hekatan (MITC4 + Wilson) | dif |
|---|---|---|---|
| 0.001 | −2.109511e+2 | −2.121628e+2 | **+0.574 %** |
| 0.01 | −2.124893e−1 | −2.124366e−1 | −0.025 % |
| 0.05 | −1.768248e−3 | −1.749494e−3 | **−1.061 %** |
| 0.1 | −2.342748e−4 | −2.351350e−4 | +0.367 % |
| 0.2 | −3.484188e−5 | −3.551236e−5 | **+1.924 %** |

Son **los mismos números** que da el banco `placa-thick-thin-sano` contra ETABS 19: o sea que
SAP2000 y ETABS tienen la MISMA placa gruesa, y Hekatan difiere de los dos igual. El Thin, en
cambio, es idéntico a los dos hasta el último dígito.

⚠️ **ETABS no sirve para este banco**: una losa suelta apoyada en su perímetro, sin columnas,
no le devuelve ni un desplazamiento (0 nudos), ni en la cota 0 ni elevada, ni como Plate ni como
Shell. Es su semántica de edificios. Para medirlo en ETABS habría que colgarla de columnas, y
entonces ya no es la placa pura.

⚠️ Y una trampa del propio driver, ya tapada: con 0 nudos leídos escribía «peor 0.000 %», que
parece que clava cuando lo que pasa es que el programa **no devolvió nada**. Ahora dice
`el programa devolvio CERO nudos, no hay comparacion`.

## Thin contra Thick en los cuatro, y qué elementos tiene OpenSees de verdad

`OpenSees no tiene solo el MITC4`. En el árbol de `hekatan-opensees/OpenSees/SRC/element/shell`:

| elemento | qué es |
|---|---|
| `ShellDKGQ` / `ShellDKGT` | Kirchhoff discreto: la placa **DELGADA**, la familia de la DKQ |
| `ShellMITC4` / `ShellMITC9` | Dvorkin-Bathe: la **GRUESA** (Mindlin) |
| `ASDShellQ4` / `ASDShellT3` | Petracca y Camata, con el drilling de Allman |
| `ShellNLDKGQ`, `…Thermal` | no lineal y térmicos |

El traductor usaba SIEMPRE `ShellMITC4` porque era el equivalente directo del Shell-Thick, sin
justificarlo — y era mala elección: bloquea en membrana (−36.8 % en la tira en voladizo, −9.4 %
en los modos de torsión de la torre). Ahora se elige con `--elem=<nombre>`.

**Placa cuadrada apoyada 8×8, flecha del centro, juez SAP2000:**

| t/L | Hekatan Thick | OpenSees MITC4 | OpenSees DKGQ | ASDShellQ4 |
|---|---|---|---|---|
| 0.001 | +0.574 % | +0.288 % | +0.748 % | +0.288 % |
| 0.01 | −0.025 % | −0.309 % | +0.019 % | −0.309 % |
| 0.05 | −1.061 % | −1.320 % | **−3.846 %** | −1.320 % |
| 0.1 | +0.367 % | +0.144 % | **−9.282 %** | +0.144 % |
| 0.2 | +1.924 % | +1.760 % | **−23.752 %** | +1.760 % |

Y la delgada (juez SAP2000 **PlateThin**): Hekatan **1.3e−11 %** · OpenSees `ShellDKGQ` **0.000 %**.

Tres lecturas:
1. **La delgada es el MISMO elemento en los tres**: la DKQ, y coinciden hasta el último dígito.
2. **El DKGQ se hunde al engrosar** (−23.8 % a t/L = 0.2) porque es Kirchhoff y no tiene
   deformación por cortante: no es un fallo, es que no es su problema.
3. **`ASDShellQ4` da EXACTAMENTE lo mismo que `ShellMITC4` en flexión**: su diferencia está en
   la membrana, no en la placa.
4. Hekatan y OpenSees se desvían de CSI **igual, con el mismo signo y casi la misma magnitud**
   (+0.57/+0.29, −1.06/−1.32, +1.92/+1.76). O sea: **la placa gruesa de CSI no es un MITC4**, y
   la desviación de Hekatan no es un error suyo — es la misma que tiene un motor independiente.

Vídeo: `VIDEO_placa_thin_thick.mp4` (50.8 s), con `video_placa.py` + `placa_es.txt` / `placa_en.txt`.
