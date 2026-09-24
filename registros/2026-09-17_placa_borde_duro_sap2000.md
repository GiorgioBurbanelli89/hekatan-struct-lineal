# Placa con borde DURO, juez SAP2000 — MITC4 vs Wilson (DSE)

Rama `sin-binario`. Sin commit, sin deploy. Juez = **SAP2000** (regla de Jorge:
«SIEMPRE es juez SAP2000, no ETABS»). ETABS NO se abrió.
Cierra el apartado 4-bis de `registros/2026-09-17_shellthick_wilson.md`.

---

## 1) ✅ Qué es el borde DURO y qué GDL se ata

`validation/opensees/pl_<t>.heks` (blando) → `validation/opensees/pl_<t>_hard.heks` (duro).
Misma malla 8×8, mismo L = 10 m, mismos 5 espesores, misma carga (ΣFz = −1000 kN,
o sea q = 10 kN/m² sobre 100 m²). **Lo único que cambia son los apoyos.**

| | apoyo del borde (`support n ux uy uz rx ry rz`) |
|---|---|
| BLANDO (lo que había) | `1 1 1 0 0 1` en los 32 nudos de borde |
| **DURO** (lo nuevo) | borde y=0 y y=L → `1 1 1 0 1 1` (18 nudos con **ry**) · borde x=0 y x=L → `1 1 1 1 0 1` (18 nudos con **rx**) · las 4 esquinas → `1 1 1 1 1 1` |

**El porqué (y = m·x + b).** Se ata la rotación cuyo **vector** es NORMAL al borde:

- Borde y=0: corre en x, su normal en el plano es ŷ → se ata **ry**.
  A lo largo de ese borde w = 0 para todo x, luego ∂w/∂x = 0, y ∂w/∂x **es** ry.
  En Kirchhoff sale sola (θ = ∇w, un solo campo). En Mindlin θ es un campo
  INDEPENDIENTE de w: si no se ata a mano, queda suelta. Eso es el borde «blando».
- La otra rotación del borde (rx en y=0, o sea ∂w/∂y) se deja **LIBRE**: es la que
  hace que el apoyo sea SIMPLE (M_nn = 0) y no un empotramiento. Si se ataran las
  dos, la placa quedaría empotrada y el ensayo no sería el del libro.

Cita (no de memoria), Wilson §8.9.2, extracto
`registros/asistente_extractos/wilson_placa_gruesa/wilson_cap8_9_10_texto.txt` línea 2249:

> «Note que la rotación normal a lo largo del extremo con soporte simple está
> fijado en cero. **Para el DSE se requiere la condición de "hard" boundary.** El
> DKE rinde los mismos resultados para condiciones de bordes tanto duras como
> blandas en el extremo con soporte simple.»

Nudo central = índice 0-based **40** = (5, 5). Generador: `validation/opensees/placa_borde_duro_gen.py`.

---

## 2) ✅ SAP2000 recibió el borde duro — comprobado leyéndolo DE VUELTA

SAP2000 abierto **una sola vez** (permiso de Jorge) con
`validation/opensees/placa_borde_duro_sap.py`: arranca SAP2000, y luego corre el MISMO puente de
siempre, `validation/opensees/csi_modal_fuerzas.py sap <dump> <out> --placa`
(elemento **PlateThick**, sin membrana), sobre los 5 dumps, con `CreateObject`
parcheado para reusar la instancia ya arrancada. No se reescribió su lógica.

- Arranque: **190 s** (el splash; no era cuelgue). Barrido entero: **271 s**.
- El puente pasa los apoyos tal cual: `sm.PointObj.SetRestraint(nudo, supports)`
  (`csi_modal_fuerzas.py:185`), y el orden del `.heks` es [ux, uy, uz, rx, ry, rz],
  el mismo de SAP2000 (U1 U2 U3 R1 R2 R3).

**Comprobación: lo que devuelve `PointObj.GetRestraint` DE SAP2000**, idéntico en
los 5 modelos:

| nudo | dónde está | SAP dice [U1 U2 U3 R1 R2 R3] | ¿es el borde duro? |
|---|---|---|---|
| N0 | (0,0) esquina | T T T **T T** T | ✅ las dos rotaciones |
| N4 | (5,0) borde y=0 | T T T **F T** T | ✅ ry atado, rx libre |
| N36 | (0,5) borde x=0 | T T T **T F** T | ✅ rx atado, ry libre |
| N40 | (5,5) centro | F F F F F F | ✅ libre |
| N80 | (10,10) esquina | T T T **T T** T | ✅ |

Además `sumRz = 1000.000` en los 5 (la carga entera llega al apoyo) y
`run -> 0` (análisis sin error). El modal da `modal ERROR: 'modal'` porque la
placa no tiene masa (densidad 0, `selfweight 0`); no se usa aquí.

---

## 3) ✅ LA TABLA: flecha del nudo central, borde DURO, juez SAP2000

`%` = (|Hekatan| − |SAP2000|) / |SAP2000| · 100. **Positivo = más flexible que SAP2000.**

| t/L | **SAP2000 (m)** | MITC4 (m) | **MITC4 %** | Wilson (m) | **Wilson %** | OpenSees % | Thin/DKQ % |
|---|---|---|---|---|---|---|---|
| 0.001 | −2.105273e+02 | −2.121610e+02 | **+0.776 %** | −2.155929e+02 | **+2.406 %** | +0.489 % | +0.951 % |
| 0.01 | −2.125657e−01 | −2.122576e−01 | **−0.145 %** | −2.156896e−01 | **+1.470 %** | −0.430 % | −0.017 % |
| 0.05 | −1.730149e−03 | −1.716806e−03 | **−0.771 %** | −1.744266e−03 | **+0.816 %** | −1.051 % | −1.729 % |
| 0.1 | −2.236655e−04 | −2.219237e−04 | **−0.779 %** | −2.253571e−04 | **+0.756 %** | −1.049 % | −4.979 % |
| 0.2 | −3.162260e−05 | −3.140220e−05 | **−0.697 %** | −3.183158e−05 | **+0.661 %** | −0.936 % | −15.990 % |

- **peor MITC4 = 0.78 %** · **peor Wilson = 2.41 %** · peor OpenSees = 1.05 %.
- OpenSees (`heks_a_opensees.py`, ShellMITC4) sale **barato y acompaña a MITC4**:
  los dos rondan el ±1 % y del mismo lado. Eso confirma que el juez no está raro.
- El Thin (DKQ) se hunde cuando la placa engorda (−15.99 % en t/L = 0.2): es lo
  que tiene que pasar (Kirchhoff no tiene cortante). Sirve de control de que el
  banco mide lo que dice medir.

### Control: el mismo banco con BORDE BLANDO (lo medido el 17-sep)

Se vuelve a correr entero y **se reproduce dígito a dígito** lo que ya estaba
escrito (validación del montaje de hoy):

| t/L | SAP2000 (m) | MITC4 % | Wilson % |
|---|---|---|---|
| 0.001 | −2.109511e+02 | +0.574 % | +5.869 % |
| 0.01 | −2.124893e−01 | −0.025 % | +5.209 % |
| 0.05 | −1.768248e−03 | −1.061 % | +3.533 % |
| 0.1 | −2.342748e−04 | +0.367 % | +3.937 % |
| 0.2 | −3.484188e−05 | +1.924 % | +4.103 % |

### Lo que se aprende comparando las dos tablas

| | peor desvío vs SAP2000, blando | peor desvío vs SAP2000, **duro** |
|---|---|---|
| MITC4 | 1.92 % | **0.78 %** |
| Wilson (DSE) | 5.87 % | **2.41 %** |

✅ El borde duro **mejora a los dos**, y a Wilson mucho más (5.87 → 2.41 %): era
verdad que el banco lo castigaba. La condición de borde valía ~3.5 puntos.
❌ Pero **Wilson sigue peor que MITC4 en los cinco espesores**, y siempre por el
mismo lado (más flexible). Ya no es un abismo, pero es un factor ~3.

⚠️ Detalle que importa: **el propio SAP2000 casi no nota el cambio de borde**
(−210.951 blando → −210.527 duro en t/L = 0.001, un 0.20 %). O sea que el
elemento de CSI se comporta como el DKE del libro: «rinde los mismos resultados
para bordes duros y blandos». El que se movía era el DSE.

---

## 4) ✅ Contra la Tabla 8.4 del libro (16×16, carga uniforme, borde duro)

El libro (extracto, líneas 2557-2582; §8.9.3 «Carga Uniforme en Placa Cuadrada de
Soporte Simple»):

| Espesor h | DKE | DSE | **DSE/DKE** |
|---|---|---|---|
| 1 | 9.807 | 10.32 | 1.05231 |
| 0.01 | 9.807 | 9.815 | **1.00082** |
| 0.0001 | 9.807 | 9.815 | **1.00082** |

Se reproduce **su** ensayo con **su** malla: placa 16×16, carga uniforme q = 1.0
por unidad de área, borde duro (`validation/opensees/placa_borde_duro_gen16.py` → `validation/opensees/pl16_*.heks`;
L = 10, E = 2.2e7, ν = 0.2 — el libro NO da E ni ν ni su lado, así que se usan los
del banco; la RAZÓN es casi insensible a eso, la flecha no).

| h | Thin/DKQ (=DKE) | Wilson (=DSE) | MITC4 | **DSE/DKE** | MITC4/DKE |
|---|---|---|---|---|---|
| 1 | −1.701416e−05 | −1.784875e−05 | −1.778053e−05 | **1.04905** | 1.04504 |
| 0.01 | −1.701416e+01 | −1.707490e+01 | −1.700669e+01 | **1.00357** | 0.99956 |
| 0.0001 | −1.701416e+07 | −1.707484e+07 | −1.699455e+07 | **1.00357** | 0.99885 |

✅ La fila **gruesa** (h = 1) clava: libro 1.05231, aquí **1.04905** (0.31 % de
diferencia). O sea que la parte de CORTANTE del DSE de aquí es la del libro.
✅ La estructura cualitativa es la del libro: la razón se congela en el mismo
valor para h = 0.01 y h = 0.0001 (no depende del espesor).
❌ ⏳ Pero el residual fino es **1.00357 contra 1.00082 del libro**: 0.357 % frente
a 0.082 %, un factor **4.3**. Ese sobrante NO es cortante (no cambia con h): es
rigidez de FLEXIÓN que el elemento de aquí pierde y el del libro no.
Queda ABIERTO. No se puede cerrar del todo sin E, ν y el lado de su placa, pero
un factor 4.3 es demasiado para achacarlo a eso: **apunta a que la implementación
del DSE de `getBendingK_DSE_FULL` no es todavía la del libro**.

(8×8, el banco de SAP: DSE/DKE = 1.01442 en t/L = 0.001. Con malla más gruesa el
residual es mayor, como cabe esperar.)

---

## 5) Conclusión

**Con borde duro y SAP2000 de juez, Wilson cierra MEJOR que antes pero PEOR que MITC4.**

| | |
|---|---|
| ✅ | La sospecha del 17-sep era CORRECTA: el banco blando castigaba a Wilson. Con borde duro pasa de 5.87 % a 2.41 % de desvío máximo. |
| ✅ | SAP2000 recibió de verdad el borde duro (leído de vuelta con `GetRestraint`, los 5 modelos). |
| ✅ | OpenSees, gratis, acompaña a MITC4 (±1 %): el juez no está en duda. |
| ❌ | Aun así MITC4 gana en los **5 de 5** espesores: 0.78 % máximo contra 2.41 % de Wilson. Factor ~3. |
| ❌ | Contra la Tabla 8.4 del libro con SU malla 16×16 y SU carga, el DSE de aquí deja 0.357 % de residual donde el libro deja 0.082 %. La parte gruesa (h=1) sí clava (1.04905 vs 1.05231). |
| ⚠️ | Sigue en pie el argumento más fuerte del 17-sep, que NO depende del borde: la torre retorcida (sin apoyos simples de placa) empeora de −7.25 % a −14.40 % con Wilson. |

### ¿Pasar el defecto de Shell-Thick a Wilson? **NO.**

Los números SÍ alcanzan para decidir esto: peor con borde duro (2.41 % vs 0.78 %),
peor en la torre (−14.40 % vs −7.25 %), y encima no reproduce su propia Tabla 8.4
en la zona fina. **El defecto se queda en MITC4** (`HK_BENDING_FORMULATION = 3`).
Wilson se queda disponible a petición (`shelltype <id> wilson`), que es lo correcto.

Lo que NO alcanza para decidir: **si el DSE de este repo está bien implementado**.
El 0.357 % contra el 0.082 % del libro es un factor 4.3 que no explica ni la malla
ni los materiales desconocidos. Antes de volver a proponer Wilson hay que cerrar
eso, y el camino es el de siempre: sacar la formulación del capítulo 8 (Ec. 8.6 a
8.19) término a término, no de memoria.

### Lo siguiente, por orden
1. Cerrar el residual 1.00357 vs 1.00082: comparar `getBendingK_DSE_FULL` con las
   Ec. 8.10-8.19 del extracto, bloque por bloque (la de cortante ya se valida sola
   con la fila h = 1).
2. El −7 % de la torre NO es la placa de Wilson (Wilson lo empeora). Buscarlo en
   otro sitio: el elemento de CSI no es ninguno de los dos.

---

## 6) ✅ Cierre: SAP2000 apagado, RAM y disco

| | |
|---|---|
| SAP2000 | ✅ cerrado (`ApplicationExit(False)`); `Get-Process SAP2000` no devuelve nada |
| ETABS | ✅ nunca se abrió |
| RAM libre | 5.42 GB antes → **6.08 GB** al terminar |
| Disco C: | 5.6 GB antes → **4.99 GB**. Los 2.5 MB de temporales de SAP2000 (`.sdb .K_* .Y* .LOG .OUT .$2k .msh .ico`) se BORRARON; solo quedan los `pl_<t>_hard_sap.json`. La bajada de ~0.6 GB no es de este trabajo (todo lo generado aquí suma 2.1 MB) |

### Ficheros nuevos (2.1 MB en total)
```
validation/opensees/pl_<t>_hard.heks          borde duro, MITC4
validation/opensees/pl_<t>_hard_w.heks        borde duro, Wilson
validation/opensees/pl_<t>_hard_thin.heks     borde duro, Thin/DKQ (control Kirchhoff)
validation/opensees/pl_<t>_soft_w.heks        borde blando, Wilson (control del 17-sep)
validation/opensees/pl_<t>_hard_dump.json     + _hard_w_, _hard_thin_, _soft_w_
validation/opensees/pl_<t>_hard_sap.json      SAP2000, PlateThick, borde duro
validation/opensees/pl_<t>_hard_os.json       OpenSees ShellMITC4, borde duro
validation/opensees/pl16_{thin,wil,mitc}_{1,0p01,0p0001}.heks (+ dumps)  ensayo Tabla 8.4
validation/opensees/pl_hard_sap_chk.json      los restraints leídos DE SAP2000
```
