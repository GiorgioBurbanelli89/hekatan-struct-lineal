# Hekatan Struct Lineal vs ETABS — qué concuerda y qué no

Este archivo es **el hilo**: se actualiza cada vez que se mide algo contra ETABS
(o contra SAFE / analítico), y dice de un vistazo por dónde va cada capa. Cada
número de aquí es **medido y reproducible**, no un límite del test ni una cuenta
a mano. La columna «cómo repetirlo» tiene el comando exacto.

**Última medida: 2026-09-05** (revisión del §2 el 2026-09-05: 4 filas caducas marcadas) · suite `npm test` → **499/499** · `pytest` 208 · WASM y C++
nativo idénticos a 13 decimales.

**Regla de oro** para que la comparación signifique algo: mismo modelo, misma
malla nudo a nudo, **brazos rígidos anulados** (`SetEndLengthOffset(nm, False,
0,0,0)`) y **la misma hipótesis de masa** (`INCLUDEELEMENTS` /
`INCLUDEVERTICALMASS` / `LUMPATSTORIES`). Sin eso se miden dos estructuras
distintas.

⚠️ Y **`grep RIGIDZONE` sobre el `.e2k` NO sirve para saber si hay brazos
rígidos**: el automático es el defecto de ETABS y no se escribe en el fichero.
Hay que preguntárselo al modelo con `FrameObj.GetEndLengthOffset`. Creerle al
`grep` costó dar por bueno un +0.545 % de masa como si fuera un defecto de
Hekatan, cuando eran los 78.6876 m de viga que ETABS no pesa.

---


## 0a. Lo cerrado el 2026-09-04/05: el deck y los ficheros con muelles (lo más reciente arriba)

| capa | qué se midió | árbitro | medido | cómo repetirlo |
|---|---|---|---|---|
| **Cimentación por FICHERO** (9 zapatas + 9 pedestales + 12 vigas, 234 nudos, 225 muelles nodales) | Uz nudo a nudo del `.s2k`, del `.e2k` y del `.f2k` que escribe Hekatan, abiertos por cada programa | SAP2000 24 · ETABS 22 · **SAFE 20** | **1.2e-8 %** · **1.4e-8 %** · **1.5e-3 %** (SAFE imprime U con 0.0005 mm de resolución; Uz min −32.479 mm los cuatro). Hasta el 5-sep el e2k y el s2k TIRABAN los muelles y no había f2k genérico | `node tests/run.mjs cimentacion-vs-csi` (14 filas) · `node cli/heks_a_csi.mjs tests/datos/cimentacion_9zapatas.heks salida` → `csi_ida_vuelta.py sap|etabs` · `csi-cli/safe-cli/cli/csi_cli.py --engine safe --open salida.f2k` |
| **`torsion safe` en el .heks** (la semántica de SAFE con nombre) | Uz y giros del mini-modelo m3 (2 zapatas + pedestales + viga de amarre a torsión) | SAFE 20 leyendo el f2k con J tal cual | Hekatan con la directiva = SAFE: Uz **3e-3 %**, giros **< 0.1 %**; sin ella el giro de la viga es un tercio del de SAFE (= SAP2000/ETABS) | `node tests/run.mjs torsion-safe` |
| **Las 4 leyes de SAFE al leer un f2k** (20 importaciones, mini-modelos m1–m4) | qué hace SAFE con cada tabla | SAFE 20.3 | ① con una tabla `COLUMN OBJECT CONNECTIVITY` se queda SOLO con las columnas (0 losas, 0 vigas, log vacío): las verticales van como BEAM · ② quiere NOMBRES de campo (`"Stiffness UZ"`), con la clave (`StiffUZ`) calla y pone 200 kN/m · ③ una sección de hormigón sin material de armadura se rechaza entera y las barras se quedan con SU sección · ④ analiza las vigas con **0.1·J** (Hekatan con J×0.1 = SAFE a 4 cifras) → el f2k escribe 10·J | `examples/src/shared/f2kExporter.ts` (cabecera) |
| **Muelles en la ida y vuelta** | Σk y flecha tras heks → e2k/s2k → Hekatan | el propio .heks | **0.000 %** (225/225 muelles) | `node tests/run.mjs ciclo-csi-ficheros` (52/52) |
| **Cota de la base en el e2k** | `STORY "Base" ELEV` | ETABS 22 | iba en metros dentro de un fichero en mm (−0.5 en vez de −500): ETABS devolvía las cotas 0.4995 m más arriba. Arreglado | idem |
| **Galpón, misma malla de 4 nudos por paño** | Uz/Ux/Uy de 609 nudos, cargas nodales por OAPI | SAP2000 24 · ETABS 22 con `--noedge` | **0.001 %** los dos. ETABS con su defecto: **4.5 %** lateral = su *edge constraint* (nudos que caen en un borde sin ser del paño) | `python csi_desde_dump.py etabs galpon_lc_dump.json out.json --membrana --noedge` |
| **Galpón partido en los nudos de borde** | idem, 231 sub-paños, 609 nudos | SAP2000 · ETABS `--noedge` | **3e-4 %** · **2e-5 %** | `node tests/run.mjs galpon-vs-sap2000` |
| **Mezanine 1×1 → 3×2 de 3 pisos, 4 patrones** (Dead lo pesa CSI, SCM, Viva, Ex) | nudo a nudo por OAPI | SAP2000 · ETABS | SAP **1e-13 %** los 4; ETABS **1e-9 %** SCM/Viva/Ex y Dead 0.0000 % con `deck etabs` | `node tests/run.mjs deck-edge` (43 filas) |
| **Paño continuo que cruza una viga** | idem | ETABS | ETABS lo **cookie-cut** en la viga: 0.47 % en SCM y 75 % en Dead contra el paño de 4 nudos; `deck etabs` lo reproduce a 0.0000 % | idem |
| **Peso propio de barra** | Dead | SAP2000 (su propio peso) | **0.0000 %** con el vector consistente (fuerzas + momentos); solo fuerzas daba 0.66–1 % | idem |
| **Carga de área en membrana** | Live por `SetLoadUniform`, transferencia propia de cada programa | ETABS · SAP2000 | ETABS = `deck etabs` **2.5e-5 %**; SAP = sin directiva **9e-13 %** | `--arealoads Live=sin.json:con.json` |
| **One-way** | e2k con `ONEWAYLOADDIST "Yes"/"No"`, `ANG 90` | ETABS 22 | Yes = `deck etabs oneway` **0.0010 %**; No = `deck etabs` 0.0010 %; cruzados 0.22 % | `validation/modelos/deck-edge/oneway` |
| **Brazos rígidos automáticos de ETABS** | Dead del mezanine | ETABS | ETABS **no pesa** los 0.15 m por extremo (4.33 kN de 210): el driver los anula | `SetEndLengthOffset(nm, False, 0,0,0)` |

Dos trampas de la OAPI que costaron una mañana: `eShellType` **3 = Membrane en ETABS, Plate Thin en SAP2000** (Membrane = 5); y si se olvidan los `SetRestraint`, **SAP se cae y ETABS se auto-apoya** en la base y da números sanos pero falsos.

## 0. Lo cerrado el 2026-09-02

| capa | qué se midió | árbitro | medido | cómo repetirlo |
|---|---|---|---|---|
| **Membrana** (drilling) | K 12×12 de la celda, 10 geometrías (reconstruida por flexibilidad) | ETABS 22 | **1.42 %** media con `drillingTypes = 8` (ITW + proyección, γ = 0.4μ) | `PYTHONIOENCODING=utf-8 python banco-elemento/probar.py --proyeccion --cpp` |
| **Placa 8×8 thin y thick** | flecha, 5 espesores | ETABS 19 misma malla | thin **0.000 %**; thick (MITC4) 0.37–1.9 % | `node tests/run.mjs placa` |
| **Mezanine, losa maciza** (thin/thick) | Uz de 1284 nudos, misma malla y carga por OAPI | SAP2000 24 y ETABS 22 | **< 1e-6 %** los tres | `python galpon-bodega-electoral/sap_mezanine.py thin` / `etabs_mezanine.py` |
| **Los 6 tipos de losa** | Uz nudo a nudo, misma malla por OAPI | ETABS 22 | **< 3e-7 %** los seis | `node tests/run.mjs losas-tipos` (filas «misma malla por OAPI») |
| **Galpón** (609 nudos, 156 `ang`, 214 `frameload`, deck) | Uz nudo a nudo | SAP2000 por OAPI y leyendo el s2k | **0.000 %** (−29.0533 mm) salvo 3 nudos de membrana pura | `python sap_modelo.py galpon_lc_dump.json …` |
| **Ida y vuelta por fichero** | heks → e2k/s2k → Hekatan → fichero → Hekatan, 2 modelos, 3 modos | el propio .heks | **32/32**, 11 fugas cerradas (unidades, POINTLOAD, General, ANG, modificadores, carga doble, peso propio…) | `node tests/run.mjs ciclo-csi` |
| **ETABS leyendo el e2k** | mezanine / galpón | ETABS 22 | mezanine **−31.8676 = Hekatan**; galpón −0.2 % y 6 % local: ETABS parte barras en los cruces (`MESHATINTERSECTIONS`) | `python csi_ida_vuelta.py etabs fichero.e2k salida.json` |
| **Drilling-dof** (2 muros + viga de acople) | Ux, 92 nudos | SAP2000 misma malla | **2.5e-12 %** | `node tests/run.mjs drilling-dof` |
| **La unión viga-muro de ETABS** | la 3×3 del nudo, con y sin barra | ETABS 22 | ETABS suma **c·(w − w_vecino + L·θ)²**, c = E·t·H³/(32·L³): ata el drilling al giro de la arista. Con esa ley Hekatan = ETABS a **2e-6 %** en los 92 nudos. SAP2000 no lo hace | `python galpon-bodega-electoral/ley_etabs.py` |

Regla nueva, medida: **ETABS automalla y trae asignaciones por defecto** (offsets
auto, malla en cruces, edge constraint). Para comparar SOLVERS: SAP2000 por OAPI
con la malla de Hekatan (`sap_modelo.py`), o ETABS por OAPI quitando el
automallado objeto a objeto (`etabs_modelo.py`).

## 1. Lo que YA concuerda

| capa | qué se midió | modelo · árbitro | medido | cómo repetirlo |
|---|---|---|---|---|
| **Modal — frecuencias** | 6 modos, camino de subespacio | Paz & Leigh 6.3 · ETABS 22 (offsets = 0) | **0.0000 %** a 4 decimales en los 6 | `node tests/run.mjs paz` |
| **Modal — frecuencias** | 6 modos, camino denso | Paz 6.3 · ETABS 22 | −0.045 a +0.063 % | ídem |
| **Modal — formas** | MAC de los 12 modos | `pm` (mezanine) · ETABS 22, masa 3D | **MAC ≥ 0.9987**, sin cruces | `python mac_modal.py pm_wasm_3d_12.json pm_etabs_3d_formas.json` |
| **Modal — periodos** | 12 modos, masa 3D | `pm` · ETABS 22 | −0.22 a **+1.66 %** | `node modal_headless.mjs pm_nomasa.heks 12 …` |
| **Masa — dónde está** | masa fuera de cota de piso | galpón · `AssembledJointMass` | **0.0000 t** (ETABS: 0.0000) | `node tests/run.mjs masa` |
| **Masa — total** | Σ masa Ux | galpón · `AssembledJointMass`, offsets = 0 | **+0.00004 %** (140.755089 vs 140.755038 t) | `node tests/run.mjs masa` |
| **Masa — por planta** | 4 cotas de piso | galpón · ETABS 22, offsets = 0 | −0.12 / +0.30 / −0.04 / **+0.00 %** | ídem |
| **Masa — nudo a nudo** | reparto de LUMPATSTORIES | galpón · ETABS 22, offsets = 0 | **76.0 %** de los nudos dentro del **0.1 %**, 84.1 % dentro del 5 % | ídem |
| **Fuerzas de barra** | P V2 V3 T M2 M3, 133 barras | mezanine · ETABS 22 | error medio 0.01–1.71 %, **máx 2.54 %** | `node tests/run.mjs mezanine` |
| **Fuerzas de barra** | P V2 V3 M2 M3, 24 barras | mesa-torsión · ETABS 19.1 | medio 0.04–0.39 %, **máx 0.79 %** | `node tests/run.mjs mesa` |
| **Losas — tipo de área** | flecha máxima, 6 tipos | mezanine · ETABS 22 | deck 0.25 · maciza-mem 0.24 · thin 0.81 · thick 0.12 · nervada 0.61 % | `node tests/run.mjs losas` |
| **Carga total** | ΣRz de cada tipo de losa | mezanine · ETABS 22 | **0.000 %** en los 6 | ídem |
| **Cáscara — flexión** | matriz término a término | 1 celda 1×1×0.20 · ETABS 22 | **idéntica** hasta la última cifra | `python shell_una_celda2.py` |
| **Placa** | flecha y momentos | Navier analítico + SAFE 8×8 | −0.04 a +2.34 % | `node tests/run.mjs safe` |
| **Ejes locales, `ang`, `as`** | frecuencia contra fórmula | voladizo · analítico | −0.48 / −0.33 % | `node tests/run.mjs modal-as-ang` |
| **End releases** | flecha y frecuencia | viga · analítico | 0.03 / 0.01 % | `node tests/run.mjs end-releases` |
| **Placa — convergencia contra Navier** | `w` del centro refinando 4×4 → 32×32 | placa SS 4×4 m, t = 0.20 · **serie de Navier + MYSTRAN** | thin **−2.00 %** · thick +3.28 % · **MYSTRAN CQUAD4 +5.72 %** | `python fem-libre/casos/gen_placa_bdf.py 32` |
| **Cáscara — membrana en su plano** | `ux` de la punta, malla de 4 cáscaras | muro en voladizo · **ETABS 19.1 corrido por OAPI** | Hekatan **5.9139** vs ETABS **5.8664** mm → **+0.81 %** (antes: 5.3728, −8.0/−4.6 %) | `python galpon-bodega-electoral/muro_membrana_etabs.py 4 1` |
| **Cáscara — membrana, CONVERGENCIA** | `ux` de la punta refinando la malla | viga-muro en voladizo · viga de Timoshenko (flexión + cortante) | 4 elem −11.63 % → 16: −3.97 → 64: −1.30 → 256: **−0.51 %** · 576: −0.35 % | `node tests/run.mjs membrana-conv` |
| **Unidades de la masa** | `c = √(E/ρ)` de cada ejemplo con modal | 39 ejemplos · velocidad de onda del material + voladizo Euler-Bernoulli | los 39 dentro de **1500–8000 m/s**; el voladizo de acero cierra al **1.5 %** | `node tests/run.mjs unidades` |
| **UI — botón «Correr modal + animar»** | ¿el modelo se mueve de verdad? | bundle de deploy · Test M — Dual | **sí**: 8/8 frames distintos, panel con Modo 1/24, 2.0726 Hz, T = 0.4825 s, Ux 84 % | `node cli/shot_modal_anim.mjs local` |

### Cáscara: los TRES tipos, en los TRES escalones (2026-08-18)

`edificios-slab/banco_shell.py A B C` — se sube un escalón cada vez y solo se
pasa al siguiente cuando el anterior cierra:

```
A  solo AREA          placa sola, sin una barra
B  AREA + FRAMES      la misma placa con vigas de borde
C  3D                 pórtico con losa
```

| tipo | A (solo área) | B (+ vigas) | C (3D) | peor | |
|---|---|---|---|---|---|
| **Thin** (Kirchhoff) | 0.72 % | 0.93 % | 0.54 % | **0.93 %** | ✅ **cerrado** |
| **Membrane** | 0.06 % | 0.85 % | 0.00 % | **0.85 %** | ✅ **cerrado** |
| **Thick** (Mindlin) | 1.42 % | **11.28 %** | 6.97 % | **11.28 %** | ⚠️ el MITC4 + Wilson vuelve a ser el defecto (15-sep-2026); placa 8×8 vs ETABS 19: 0.37–1.9 % |

**Thin y Membrane cierran por debajo del 1 % en los tres escalones.** Con malla
fina (445 elementos) bajan a 0.037 % y 0.00016 %.

⚠️ El −2.00 % de `thin` contra **Navier** que aparece más arriba no contradice
esto: Navier es la solución de **Kirchhoff sin cortante**, y ningún
cuadrilátero de 4 nodos converge a ella. Contra **ETABS**, que es el mismo tipo
de elemento, `thin` cierra.

**Y `Thick` SÍ es la malla.** Barriendo la malla en el
escalón B (`banco_shell.py B --malla=N`):

| malla | Thin | **Thick** | Membrane |
|---|---|---|---|
| 2×2 | 1.17 % | **57.73 %** | 2.46 % |
| 4×4 | 0.93 % | **11.28 %** | 0.85 % |
| 8×8 | 0.15 % | **2.68 %** | 0.08 % |

⚠️ **El 8×8 hay que sacarlo del BANCO, no del calibrador.** `calibrar_shell.py`
pone `NX = NY = 8` pero compara contra el ETABS guardado en `banco_shell.json`,
que se generó con **4×4**: mide Hekatan de 8×8 contra ETABS de 4×4 y daba un
0.02 % que no significa nada. El dato bueno es el del banco, que corre ETABS
con la misma malla en la misma pasada.

Lo que lo delata no es el porcentaje, es el **signo del error**:

```
malla 2x2   Hekatan -4.96e-4   ETABS -1.173e-3   -> Hekatan 2.4x MAS RIGIDO
malla 4x4   Hekatan -1.134e-3  ETABS -1.278e-3   -> 1.13x
malla 8x8   Hekatan -1.279e-3  ETABS -1.314e-3   -> 1.03x
```

**Hekatan sale rígido de más y el exceso se va al refinar.** Solo lo sufre
`Thick`, el único con deformación por cortante transversal.

**No es κ**, y está medido: barriendo κ de 5/6 a 5.0 (`calibrar_shell.py`)
ningún valor cierra los tres escalones a la vez — A empeora cuando B mejora, y
el mejor deja un 2.10 % de peor caso. La regla del propio calibrador: *un
número que solo arregla un caso es un parche.*

### El árbitro que no necesita ETABS: `Thick/Thin` ≥ 1

El árbitro
no necesita otro programa, basta la termodinámica del elemento: **una placa de
Mindlin tiene que salir siempre igual o más flexible que una de Kirchhoff — el
cortante solo puede ablandar.** Así que la razón `Thick/Thin` tiene que ser
≥ 1, y si baja hay error sin nada que discutir.
`python edificios-slab/thick_por_que_rigido.py`:

| t/a | n=2 | n=4 | n=8 | n=12 |
|---|---|---|---|---|
| 0.1000 | 0.5668 | 0.9498 | 1.0939 | 1.1216 |
| 0.0333 | 0.6481 | 0.8677 | 0.9741 | 0.9976 |
| 0.0100 | **0.1485** | 0.7862 | 0.9349 | 0.9698 |
| 0.0033 | **0.0071** | 0.7427 | 0.9200 | 0.9603 |
| 0.0010 | **0.0002** | **0.7401** | **0.9189** | **0.9595** |

Y el barrido que lo cierra, en el límite delgado con vigas:

| variante | n=4 | n=8 |
|---|---|---|
| tal cual | 0.7401 | 0.9189 |
| `alpha_drill` de 0.01 a 20 | **0.7401** | **0.9189** |
| **κ ×10, ×100, ×1000** | **0.7401** | **0.9188** |

⚠️ **Y aquí hubo un razonamiento INVÁLIDO que hay que tirar**: *«κ ×1000 no
mueve el número, luego no es el cortante»*. **Subir κ no puede decir nada
cuando la atadura ya está saturada.** Al bloqueo hay que quitarle rigidez, no
ponerle más. Bajando κ el número **sí** se mueve, y muchísimo:

| κ | n=4 | n=8 |
|---|---|---|
| ×1e-6 | 34.20 | 44.34 |
| **×1e-4** | **1.0997** | 1.3776 |
| ×1e-2 | 0.7438 | 0.9237 |
| ×1 | 0.7401 | 0.9189 |
| ×1000 | 0.7401 | 0.9188 |

(Bajar κ tampoco arregla nada: ablanda **quitando** la atadura.)

### La depuración dinámica, que sí lo resuelve

`python edificios-slab/thick_depuracion_dinamica.py` instrumenta el elemento por
dentro en vez de mirarlo desde fuera. Cuatro medidas:

**1 · El MITC4 está BIEN.** Patch test con los campos de placa exactos:

| campo | E_cortante/D | E_flexión/D |
|---|---|---|
| flexión x² | **0.00** | 0.8767 |
| flexión y² | **0.00** | 0.8767 |
| **torsión xy** | **0.00** | 0.6244 |
| girar sin flechar | 62500 | 0 |

Los tres campos de placa dan **cero exacto** — no hay bug en los puntos de
atadura. El cuarto tiene cortante y **debe** tenerlo: es físico.

**2 · El bloque de cortante tiene rango EXACTAMENTE 4** y escala como **1/t²**
(156 → 15625 → 173611 para t = 0.20 / 0.02 / 0.006).

**3 · Espectro del elemento en el límite delgado:**

| | rígidos | **útiles** | bloqueados |
|---|---|---|---|
| Mindlin + MITC4 | 3 | **5** | 4 |
| MZC Kirchhoff | 3 | **9** | 0 |

Un Mindlin Q4 con integración **completa** ataría 2 componentes × 4 puntos de
Gauss = 8 → 12−3−8 = **1** modo útil: el locking bruto. El MITC4 baja las
ataduras a 4 → **5**. Funciona, pero le quedan **cuatro modos menos que al MZC**.

**4 · Reparto de energía en la solución REAL** (placa + vigas):

| malla | t/a = 0.0333 | t/a = 0.001 |
|---|---|---|
| **2×2** | 4.4 % cortante | **99.95 % cortante** |
| 4×4 | 3.7 % | **0.005 %** |
| 8×8 | 3.2 % | **0.005 %** |

### Son DOS cosas distintas, y antes las junté en una

- **2×2: locking real.** El cortante se lleva el **99.95 %** de la energía: la
  solución **pelea** contra la atadura y no puede. Por eso la razón se hunde a
  0.0002.
- **4×4 y más fino: ya no pelea** (0.005 %). La solución **vive dentro** del
  espacio atado, y lo que sobra **no es energía de cortante: son los 4 modos que
  faltan** — 5 útiles contra 9.

Y las mallas que se usan de verdad son 4×4 y 8×8, o sea el segundo caso: el
**11.28 %** y el **2.68 %** contra ETABS son **el precio de las 4 ataduras del
MITC4**, no un error de implementación. O sea: **el `Thick` de ETABS no es un Q4
de Mindlin con MITC4 a secas** — converge casi como su `Thin`, y el nuestro no.

**Probado ya, y no vale tal cual:** añadir modos incompatibles de Wilson a los
**giros** (4 internos, condensados) sube de **5 a 7** modos útiles, pero se pasa
de blando — los dos más suaves caen a 0.319 contra 0.465 del MZC. Hace falta la
versión que pase el patch test, no la ingenua.

⚠️ **Descartado midiendo**: κ (arriba **y** abajo), α del drilling, el espesor,
y la conexión genérica con vigas. Y **no** es el MITC4: está bien implementado.

### 🏛️ CUATRO PROGRAMAS sobre la MISMA celda (2026-08-18)

Un solo árbitro puede estar equivocado — el caso 6 lo demostró. Así que se le
preguntó a cuatro. Celda 1×1×0.20, nudos 1 y 2 empotrados, 3 y 4 con las
**traslaciones sujetas** y los giros libres: con `w` sujeto, **girar es cortante
puro** (γ = ∂w/∂x − βx = −βx), que es justo lo que separa un Mindlin de un
Kirchhoff.

**Flexibilidad del nudo 3, 1 kN·m en cada giro** (`celda_cuatro_programas.py`):

| programa · elemento | RX | RY | RZ drilling |
|---|---|---|---|
| ETABS 22 · Shell-Thin | 6.2702e-05 | 6.2702e-05 | 1.2552e-05 |
| OpenSees · `ShellDKGQ` | **6.2702e-05** | **6.2702e-05** | 9.3506e-06 |
| Hekatan · Thin (MZC) | **6.2702e-05** | **6.2702e-05** | 1.3091e-04 |
| | | | |
| ETABS 22 · Shell-Thick | 2.1267e-05 | 3.8896e-05 | 1.2552e-05 |
| Abaqus 2017 · `S4` | 2.6460e-05 | 4.7251e-05 | 4.5818e-05 |
| Abaqus 2017 · `S4R` | 3.0936e-05 | 6.5887e-05 | 4.5818e-05 |
| OpenSees · `ShellMITC4` | **9.6384e-06** | 4.6616e-05 | 6.5455e-06 |
| Hekatan · Thick (MITC4) | **9.7541e-06** | 5.1586e-05 | 1.3091e-04 |

**1 · El banco es correcto.** Hekatan (MZC) y OpenSees (`ShellDKGQ`) dan
**6.270178e-05 los dos, a SIETE cifras**, y ETABS Shell-Thin lo mismo. Cuando
dos elementos son el mismo, esto lo enseña.

**2 · Mi MITC4 NO tiene un bug.** Casa con `ShellMITC4` de OpenSees —que ES la
implementación de referencia de Dvorkin-Bathe— al **1.20 %** en RX.

**3 · Y sin embargo ETABS, Abaqus `S4` y Abaqus `S4R` dan RX entre 2.1e-5 y
3.1e-5: de 2.2 a 3.2 veces MÁS FLEXIBLE que cualquier MITC4.** Los tres van
juntos y **el MITC4 es el que se sale**.

> **El Shell-Thick de ETABS no es un MITC4. Y el `S4` de Abaqus tampoco.**
> Eso explica el 11.28 % sin necesidad de ningún bug: se están comparando dos
> elementos distintos.

**4 · El drilling es el número más desviado de toda la tabla.** Cada programa se
inventa el suyo (Abaqus 4.58e-5 · ETABS 1.26e-5 · OpenSees 6.5e-6) y el de
Hekatan es **1.31e-04: entre 2.9× y 20× más flexible que todos**. Y es el mismo
en Thin y en Thick, así que no depende del tipo de cáscara.

Reproducir: `python shell_una_celda.py 1|2` · `python celda_flex_opensees.py` ·
`abaqus job=celda_S4` en `_abq_celda/` · `node celda_flex_hk.mjs thick x.json
giros` · `python celda_cuatro_programas.py`.

## 2. Lo que TODAVÍA no

| capa | qué se midió | modelo · árbitro | medido | por qué / qué falta |
|---|---|---|---|---|
| **Cáscara — drilling** | penalty del giro normal | 1 celda · ETABS | ~~2.03×~~ → **1.42 %** | tipo 8 (ITW + proyección). |
| **Modal — galpón entero** | 4 primeros modos con masa | galpón · ETABS 22 (lateral + lump), **offsets = 0** | −1.60 / −0.58 / +0.78 / **−2.99 %** · MAC 0.970 / 0.902 / 0.929 / **0.723** | Con la masa cerrada al 0.00004 %, lo que queda es rigidez. Y el MAC dice que el −2.99 % del modo 4 **no es una frecuencia mal calculada**: Hekatan PARTE en dos el modo 4 de ETABS — sus modos 4 (4.2821) y 5 (4.6424) apuntan los dos al mismo, con MAC **0.723 + 0.271 = 0.994**. Arreglar eso es arreglar la malla (nudos colgados de un solo paño), no el solver. |
| **Modal — galpón, modos altos** | emparejados por forma | galpón · ETABS 22, offsets = 0 | modo 11 Hek ↔ modo 7 ETABS: **MAC 0.9997**, −0.06 % | Cuando la forma es la misma, la frecuencia coincide. Lo de abajo es reordenamiento por modos locales, no error del solver. |
| **Modal — galpón, modos bajos** | uno a uno en 4–6 Hz | galpón · ETABS 22, masa 3D | **Hekatan parte en dos** lo que ETABS da como un modo | Nudos del entrepiso colgados de un solo paño (giros casi sin rigidez). Es un defecto de la MALLA del modelo, y lo delatan los dos programas. Lo limpio es arreglar la malla. |
| **Masa por material en los edificios** | `c = √(E/ρ)` | `edif-acero`, `edificio-acero-v2`, `edificio-mixto`, `edificio-dual`, `mezanine` | ~~9042 m/s~~ | ✅ corregido: `edificioAporticado.ts` ya elige `rho` por `matCol`/`matViga` (`matColRho`, línea ~847). Falta solo re-medir `c` en los cinco. |
| **Modal de los `benchmark-paz-*`** | f₁ contra el libro | Paz & Leigh 11.1 | libro **4.02 Hz** · ejemplo **0.0858 Hz** | Dos cosas a la vez: pasan `rho_kgm3` con E en kN/m² (**1000×**) y, aun corrigiendo eso (2.71 Hz), el libro usa masa **consistente** (156 / 22L / 4L²) y el motor **lumped**; encima el ejemplo se inventa `Iz = 0.3·I` y `J = 0.05·I`. |
| **Torsión de barra** | T, 24 barras | mesa-torsión · ETABS 19.1 | medio 2.09 %, **máx 3.72 %** | `J` de Saint-Venant contra el que usa ETABS. |
| **Losa waffle 2D** | flecha máxima | mezanine · ETABS 22 | **3.99 %** con la automalla de ETABS · **< 3e-7 %** misma malla por OAPI (§0) | Lo que queda es la malla de ETABS, no el elemento. |
| **Masa — el resto de recetas** | — | — | sin medir | Falta decidir **qué receta usar en producción** según el `MASSSOURCE` de cada modelo, en vez de elegirla a mano por corrida. |

## 3. Cosas que ya NO hay que perseguir (medidas y descartadas)

| sospecha | veredicto |
|---|---|
| «los ejemplos del workspace dan periodos raros porque hay un mecanismo» | **Falso en el `galpon`.** El modo 1 a 0.0855 Hz (T = 11.7 s) movía **45 de 55 nudos en bloque**, con el 98.3 % de la forma en X: eso es el modo lateral global, no un nudo suelto. Eran dos cosas y ninguna del solver: `densities = 78` (peso, no masa → 9.81× → f/3.13) e `I = A²/12`, la inercia de un cuadrado macizo de 4.47 cm de lado (un IPE 160 de la misma área tiene **26×** más). Con las dos arregladas: **T₁ = 0.73 s**, visto en el PNG de la app. |
| «el −2 % de la placa contra Navier es un fallo nuestro» | **No.** Ningún cuadrilátero de 4 nodos converge a Navier, porque **Navier no es el árbitro correcto**: es la solución de Kirchhoff, sin deformación por cortante, y estos elementos sí la llevan. Con t/a = 0.05 la placa real es ≈ 1 % más flexible que Kirchhoff. Medido refinando hasta 32×32: Hekatan thin se planta en −2.00 %, Hekatan thick en +3.28 % y **MYSTRAN en +5.72 %** — o sea que de los tres, el nuestro es el que menos se aleja. Lo que sí queda pendiente es que `thin`, siendo Kirchhoff puro, debería ir a 0 % y no a −2 %. |
| «`Ip = Iy+Iz` vs `J` en la masa torsional» | **No aplica.** El modal usa masa LUMPED (`getGlobalMassMatrix.cpp`), con masa rotacional `1e-9·m`. La masa consistente —la del `Ip`— hoy no la toca el modal. |
| «los shellmods de ETABS cambian la masa» | **No en estos modelos.** `galpon_bodega.e2k` no trae ni un `MASSMODIFIER` ni `WEIGHTMODIFIER`; los `shellmod` del `.heks` son de rigidez. |
| «los shells no aportan masa» | **Sí aportan.** `getGlobalMassMatrix.cpp` pesa Q4 y triángulos (`ρ·t·A`, repartido entre sus nudos). |
| «el solver está mal» | **No.** Paz 6.3 cierra al 0.0000 % por subespacio, y en el galpón (1256 elementos) los modos altos van del 0.01 al 1.3 %. |
| «se acumula memoria / es el WASM» | **No.** El heap sigue el pico del modelo actual; y el C++ nativo da lo mismo que el WASM a 13 decimales. |
| «la ref del Paz 6.3 (9.6780 / 16.9874 …)» | **Falsa.** Solo la reproduce un `.exe` del 17-may compilado de código que nunca se subió; sus modos 5–6 no existen. |
| «ETABS no pesa el tramo de VIGA dentro del brazo rígido» | **CIERTO, probado con un caso mínimo** (`test_offsets_masa.py`): pórtico de un vano hecho desde cero, columnas 0.40×0.40 y viga 0.30×0.50, acero de 78 kN/m³. La viga recibe brazo `0.20 m` en cada extremo y pesa `78·0.15·5.60 = 65.520 kN` en vez de `·6.00 = 70.200` → razón **0.933333 = 5.60/6.00** exacta. La columna **también tiene brazo** (0.50 m) y su peso **no se mueve**: razón **1.000000** (si se descontara daría 0.916667). Ojo: el brazo de la columna es el **canto entero** de la viga, no la mitad — la regla de la longitud no es simétrica, aunque para la masa da igual. |
| «los brazos rígidos explican el +0.545 % del galpón» | **SÍ, y era eso.** El primer veredicto (`grep RIGIDZONE` = 0) estaba MAL: el brazo automático es el **defecto** de ETABS y no se escribe en el `.e2k`. Preguntado al modelo, los **1028** objetos lo traen, con 78.6876 m de barra dentro del brazo, y ETABS no pesa el tramo de **viga** que cae ahí (los de columna sí). Anulados, la masa cierra al **0.00004 %**. |
| «ETABS usa una masa de material distinta de `w/g`» | **No.** Preguntado con `PropMaterial.GetWeightAndMass` (`masa_material_etabs.py`): en los 7 materiales `m = w/g` **exacto**, y los valores son los mismos del `.heks` hasta la última cifra (ACERO 7.951071 · ZINC 7.953786 · hormigón 2.402770). Parecía prometedor —explicaba 0.549 de las 0.763 t— y es falso. |
| «Hekatan cubre más metros cuadrados de cáscara» | **No.** Sumando los `AreaElm` de la malla de análisis (`area_cascaras_etabs.py`): **785.6131 m² los dos**, hasta la última cifra. |

## 4. Dónde está el detalle de cada cosa

| tema | archivo |
|---|---|
| Modal: las dos hipótesis de masa, MAC, cáscara término a término, **la báscula (§10)** | `../galpon-bodega-electoral/VALIDACION_SOLVER_MODAL.md` |
| Convención de ejes CSI, `ang`, `as`, suite de regresión | `CLAUDE.md` |
| Por qué «offsets = 0» y el Paz 6.3 | `CLAUDE.md` § *ETABS no pesa el brazo rígido* |
| Comparar masa nudo a nudo | `../galpon-bodega-electoral/comparar_masa_nativa.py` |
| Probar reglas de reparto sin recompilar | `../galpon-bodega-electoral/probar_reglas_lump.py` |
