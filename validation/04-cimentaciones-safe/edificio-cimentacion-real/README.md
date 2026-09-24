# Cimentación Edificio Real — Hekatan vs SAFE

## ✅ RESUELTO 2026-08-18: no era un bug de Hekatan, era el ÁRBITRO

Este caso estuvo marcado como **pendiente** desde mayo, con esta causa raíz
escrita abajo: *«shell Q4 estándar sin drilling DOF → los frames horizontales
no transfieren carga»*. Se pedía implementar MITC4 + drilling en el C++.

**Las dos cosas eran falsas.**

El motor ya lleva MITC4 + drilling de Hughes-Brezzi (α = 0.5) + modos
incompatibles de Wilson. Y, sobre todo, el gap no venía del solver: **venía de
que los dos modelos no tienen la misma carga**.

### La comprobación que lo cierra, y no depende de ningún programa

En un suelo de Winkler la reacción total tiene que ser igual a la carga
aplicada. Se suma `q_i · A_i` de las nueve zapatas, con el `q` que reporta cada
programa:

| | reacción del suelo | carga aplicada | |
|---|---|---|---|
| **Hekatan** | **19.31 tonf** | 19.27 tonf | **1.00 ×** ✔ |
| **SAFE** | **55.01 tonf** | 19.27 tonf | **2.85 ×** ✘ |

**Hekatan cierra el equilibrio al 0.2 %. El modelo de SAFE mete casi tres veces
la carga aplicada**, así que no es que Hekatan sub-prediga: es que estaba
comparándose contra un modelo cargado de otra manera.

### De dónde salen esas 55 toneladas

Peso propio, sumado a mano:

```
cargas aplicadas             19.27 tonf
peso propio de las zapatas   20.65      28.68 m² × 0.30 m × 2.4
peso propio de las vigas     14.40      12 × 5 m × 0.25 × 0.40 × 2.4
peso propio de pedestales     1.73
                             ─────
                             56.05 tonf   →  w medio 18.61 mm
```

SAFE mide **18.65 mm** de media y su reacción sumada da **55.01 tonf**: 1.9 %
de la cuenta de arriba. **SAFE está aplicando el peso propio**, aunque
`safe_api_edificio.py` pida `lpat.Add("Dead", ..., 0.0, True)` — SelfWeight = 0.

Hekatan, con solo las cargas, da **6.97 mm** de media contra los **6.40 mm**
que exige el equilibrio (`P/A/ks`). Coherente: el reparto no es uniforme porque
las vigas de amarre redistribuyen, pero la suma cierra.

### Comprobado: al igualar la carga, el gap se cae solo

Se añadió el peso propio a Hekatan (`cli_edificio.mjs --sw`, repartido igual
que los muelles Winkler: `rho·t·A_trib` en cada nudo del paño, y la mitad del
peso de cada viga y pedestal a cada extremo):

```bash
npx tsx ./cli_edificio.mjs --sw --json=hek_sw.json
```

| col | rol | SAFE | sin peso propio | | con peso propio | |
|---|---|---|---|---|---|---|
| 1 | esquina | −11.574 | −0.684 | −94.1 % | −13.851 | **+19.7 %** |
| 2 | medio-borde | −17.705 | −5.777 | −67.4 % | −17.899 | **+1.1 %** |
| 3 | esquina | −27.119 | −16.326 | −39.8 % | −29.493 | **+8.8 %** |
| 4 | medio-borde | −13.433 | −1.580 | −88.2 % | −13.702 | **+2.0 %** |
| 5 | centro | −19.583 | −5.614 | −71.3 % | −18.795 | **−4.0 %** |
| 6 | medio-borde | −22.015 | −10.012 | −54.5 % | −22.135 | **+0.5 %** |
| 7 | esquina | −14.548 | −3.294 | −77.4 % | −16.460 | **+13.1 %** |
| 8 | medio-borde | −17.718 | −5.789 | −67.3 % | −17.912 | **+1.1 %** |
| 9 | esquina | −24.118 | −13.680 | −43.3 % | −26.846 | **+11.3 %** |

**error medio 67.0 % → 6.8 %** · máximo 94.1 % → 19.7 %

Y la reacción del suelo, que era 2.85× la carga, ahora coincide: SAFE
**55.01 tonf** contra Hekatan **56.84**, un 3.3 %.

### El .f2k dice lo que pasa: `comparar_f2k.py`

La pregunta no es si Hekatan se parece a SAFE, sino si **el archivo que Hekatan
manda a SAFE describe la misma estructura que Hekatan resuelve por dentro**. Si
no, el error mide dos modelos, no el solver. Es el mismo metodo que
`cli/comparar_e2k_etabs.mjs` usa con el `.e2k` de ETABS.

```bash
python comparar_f2k.py
```

Lo que sale del `.f2k` que exporta Hekatan:

| | en el f2k | en `cli_edificio.mjs` |
|---|---|---|
| **peso propio** | `Self Weight Multiplier=1` — **lo pide** | solo con `--sw` |
| **pedestales** | **ninguno**: las vigas arrancan de los puntos cargados | 9, de 0.50 m (1.73 t) |
| **zapatas** | 18 objetos de área, que SAFE **auto-malla** | malla explícita 4×4 → 144 Q4 |
| ks del suelo | `Subgrade Modulus = 105.03` | 105.0 ✔ |
| cargas | 9 nudos, ΣFZ = −19.269 t | idénticas ✔ |

**Ahí está el origen de todo.** El f2k pide el peso propio, así que SAFE lo
aplica al abrirlo; el solver de Hekatan no lo aplicaba. No era que Hekatan
sub-predijera: es que el propio archivo de Hekatan le pedía a SAFE una carga
que Hekatan no se aplicaba a sí mismo.

Y quedan dos diferencias más de modelo, no de solver: los **pedestales**, que
el f2k no lleva, y el **mallado**, explícito aquí y automático allí.

### El LOG de SAFE remata la cuestión: NO es la misma estructura

SAFE 20 no deja exportar un `.f2k` por la API (`cFile` no tiene
`ExportToSAFEFile`, y `Save` con extensión `.f2k` devuelve 0 y no escribe), y
`GetAvailableTables` cuelga el proceso. Pero no hacía falta: **SAFE deja
escrito el modelo que resolvió** en `Edificio_Cimentacion_via_API.LOG`.

| | SAFE (su LOG) | Hekatan | |
|---|---|---|---|
| nudos | 171 | 234 | |
| **con apoyo (restraints)** | **82** | **0** | Hekatan no pone apoyos: solo muelles |
| **shells Q4 de zapata** | **36** | **144** | **4 por zapata frente a 16** |
| frames | **21** | **21** | ✔ igual: 12 vigas + 9 pedestales |
| links / muelles Winkler | 144 | 225 | reparto distinto del suelo |
| patrones de carga | 3 | 1 | |

**SAFE malló las zapatas 2 × 2 y Hekatan 4 × 4.** Y, sobre todo, **SAFE tiene
82 nudos con apoyo** donde Hekatan no tiene ninguno: el suelo entra de dos
maneras distintas —muelles en Hekatan, y en SAFE muelles *más* restricciones—,
que es exactamente lo que cambia cuánto baja cada zapata.

Lo único que coincide de verdad es el número de barras (21 = 12 vigas + 9
pedestales), así que los pedestales sí llegaron: la diferencia que se veía en
el `.f2k` es del archivo, no del modelo que se resolvió por API.

**Conclusión: los dos modelos no son el mismo, y ninguna de las diferencias
está en el solver.** Malla, apoyos y reparto del suelo. Comparar sus
asentamientos mide eso, no el elemento Q4.

### Igualada la estructura: qué se movió y qué no

Se probó a igualar cada diferencia, una por una, midiendo cada vez:

| se iguala | error medio | conclusión |
|---|---|---|
| nada (como estaba) | **67.0 %** | |
| **+ peso propio** (`--sw`) | **6.8 %** | era esto |
| + malla 2×2 como SAFE (`--nLocal=2`) | 6.8 % | **no era la malla** |
| + malla 8×8 (`--nLocal=8`) | 6.8 % | ya había convergido |
| solo peso de zapatas (`--sw=zap`) | 26.9 % | **SAFE sí incluye vigas y pedestales** |

Malla probada en 2×2, 4×4 y 8×8: el resultado no se mueve ni una décima. Y
quitar el peso de vigas y pedestales empeora, así que en SAFE están.

### Lo que queda: no es magnitud, es REPARTO

El 6.8 % que sobra **no es ruido: depende del papel de cada zapata**.

| rol | n | error medio |
|---|---|---|
| **esquina** | 4 | **+13.2 %** (+19.7 +8.8 +13.1 +11.3) |
| medio-borde | 4 | **+1.2 %** (+1.1 +2.0 +0.5 +1.1) |
| centro | 1 | **−4.0 %** |

**Hekatan baja más que SAFE en las esquinas y menos en el centro.** Los
medio-bordes cierran al 1 %. Eso no es un error de magnitud —si lo fuera, sería
parejo— sino de **reparto**: en SAFE las vigas de amarre se llevan más carga de
las esquinas hacia el centro que aquí.

Y encaja con la única diferencia de modelo que sigue viva: **SAFE tiene 82
nudos con apoyo y Hekatan ninguno**. El suelo entra de dos maneras distintas, y
donde más se nota es donde menos vigas llegan — la esquina, con dos, frente al
centro con cuatro.

**Lo siguiente**, y en este orden: averiguar qué restringe SAFE en esos 82
nudos. Si son los anclajes de sus 144 elementos LINK (la forma en que SAFE
implementa un muelle de área) no cambian nada y habría que mirar la rigidez de
la viga de amarre; si son otra cosa, ahí está el reparto.

### Lo que dice la API de SAFE

La interfaz pública de la OAPI (`SAFEv1.dll`, la que se referencia para
automatizar SAFE) se puede listar por reflexión .NET: son las firmas
documentadas de la API.

```bash
python reflexion_safe.py
```

Y ahí aparece la firma que importa:

```
cPropAreaSpring.GetAreaSpringProp(Name, U1, U2, U3,
                                  NonlinearOption3,
                                  SpringOption,        <-- no está en el f2k
                                  SoilProfile,         <-- no está en el f2k
                                  EndLengthRatio)      <-- no está en el f2k
```

**Un muelle de área de SAFE tiene tres parámetros más de los que el `.f2k` de
Hekatan escribe.** El f2k solo pone `Subgrade Modulus` y `Nonlinear Option`:

```
Name=ASpr1  Subgrade Modulus=105.03  Nonlinear Option=Compression Only
```

Así que SAFE rellena `SpringOption`, `SoilProfile` y **`EndLengthRatio`** con
sus valores por defecto, que Hekatan no conoce ni reproduce. Y
`EndLengthRatio` es precisamente un parámetro de **reparto en los bordes** —
que es donde está la discrepancia: las esquinas, las zapatas con más borde en
proporción a su área.

Es la hipótesis que queda viva, y ahora tiene nombre.

⚠️ **Tres callejones sin salida, para no repetirlos:**
- `cFile` **no tiene `ExportToSAFEFile`**, y `Save` con extensión `.f2k`
  devuelve 0 y no escribe nada: SAFE 20 no deja sacar su `.f2k` por API.
- `DatabaseTables.GetAvailableTables()` **cuelga el proceso** de SAFE.
- `cAreaObj.GetElm()` **también lo cuelga**. Las dos veces hubo que matarlo con
  `Stop-Process`.
- Lo que sí responde rápido: `PointObj.GetNameList`, `GetRestraint`,
  `GetCoordCartesian` y `PropAreaSpring.GetNameList`.

### Lo que queda, que es de otro orden

Los **medio-bordes cierran al 0.5–2 %**; lo que se desvía son las **esquinas**
(19.7 / 13.1 / 11.3 %), que son las zapatas pequeñas — 1.3 × 1.3 m.

**No es la malla**, y está medido: refinando de 4 × 4 a 8 × 8 por zapata
(`--nLocal=8`) el resultado no se mueve —13.851 → 13.835 mm en la col 1,
26.846 → 26.866 en la col 9, o sea milésimas— así que la solución ya había
convergido. Queda como sospechosa la única hipótesis que sigue sin estar
igualada: **cómo reparte SAFE el peso propio de la zapata** frente al reparto
por área tributaria que se usa aquí. En una zapata de 1.3 m con carga
excéntrica (M = 2.29 tonf·m sobre 0.67 tonf de axil) el borde manda, y ahí un
reparto distinto se nota; en una de 2.2 m se diluye — que es justo lo que
enseña la tabla.

⚠️ Y la lección, que es la de siempre: **antes de tocar el solver, comprobar el
equilibrio**. Tres meses de «bug de drilling» que se resolvían con una suma.

---

# (Documentación anterior — el diagnóstico de mayo, que resultó equivocado)

# Cimentación Edificio Real — Hekatan vs SAFE (V2 en investigación)

## Update 2026-05-19: intento V2 con modelación estructural correcta

Tras feedback del usuario (cadenas a nivel piso terminado + pedestales
verticales + zapatas abajo), reintenté el caso con la geometría real:
- Zapatas en z=0 (Floor level, SAFE-friendly)
- Pedestales verticales (frame 0.40×0.40m) de z=0 a z=+0.50m
- Cadenas horizontales en z=+0.50m (frame 0.25×0.40m VAmarre)
- Cargas P+Mx+My aplicadas en TOPs (z=+0.50m)

**Resultado:** los 3 tipos de elementos se visualizan correctamente en
SAFE GUI (zapatas+pedestales+cadenas conectados visualmente), pero todos
los uz vuelven 0. Tras 6 iteraciones del fix (AddByPoint, SetSpecialPoint,
SetRestraint, FLOOR MESHING OPTION via DatabaseTables), el merge entre
joints aislados (joint_base/joint_top) y los nodos del mesh auto-generado
de las áreas SIGUE sin funcionar.

**Hipótesis actual**: SAFE auto-mesh ignora `SetSpecialPoint=True` cuando
el modelo se construye 100% via API (vs GUI). El fix requiere un approach
distinto: crear las zapatas como **mesh explícito Q4** (cada zapata =
nx×ny áreas Q4 individuales compartiendo joints), no como áreas grandes
auto-mesheadas.

**Estado**: V2 commiteado pero NO validado. Volver con approach
mesh-explícito en próxima iteración.

---

# (Documentación V1 — modelo simplificado plate-only con bug Q4 drilling)

Reconstrucción 100% desde cero via API del modelo extraído de
`examples/src/edificio-aporticado/sample_output/cimentacion_edificio_9zapatas_12vigas.f2k`
(generado por Hekatan workspace).

## Caso de prueba (modelo REAL del edificio del usuario)

- Grilla **3 × 3 columnas** en (X, Y) ∈ {0, 5, 10} m × {0, 5, 10} m (luz 5 m × 5 m)
- 9 zapatas con **3 dimensiones distintas**:
  - 4 esquinas: **1.3 × 1.3 m** (1.69 m²)
  - 4 medios-bordes: **2.2 × 2.2 m** (4.84 m²)
  - 1 centro: **1.6 × 1.6 m** (2.56 m²)
- Espesor uniforme **t = 0.30 m**, concreto 4000 psi (E = 24 855 MPa)
- **12 vigas amarre** `VAmarre_0.250 × 0.400 m` (frames concrete rectangular)
  - 6 horizontales (eje X) + 6 verticales (eje Y) en grilla 3×3
- **9 cargas reales** P + Mx + My en los centros de columnas (unidades tonf, m)
- **Suelo Winkler** ks = **105 tonf/m³ = 1030 kN/m³** (suelo blando)

## Reproducir

```bash
cd hekatan-struct-lineal/benchmarks/safe/edificio-cimentacion-real
npx tsx ./cli_edificio.mjs --json=hekatan_edificio_result.json
PYTHONIOENCODING=utf-8 python -X utf8 safe_api_edificio.py --json=safe_edificio_result.json
```

## Resultados (corrida 2026-05-18)

### ⚠️ Paridad NO alcanzada — gap 34-90%

| Col | Rol | Pos | FZ tonf | MY tonf·m | **Hekatan uz [mm]** | **SAFE uz [mm]** | **Δ** |
|---|---|---|---|---|---|---|---|
| 1 | esquina | (0, 0) | −0.67 | 2.29 | **−1.19** | −11.57 | **−89.7%** |
| 2 | medio-borde | (5, 0) | −2.12 | 2.58 | **−5.44** | −17.71 | **−69.3%** |
| 3 | esquina | (10, 0) | −3.63 | 2.29 | **−17.82** | −27.12 | **−34.3%** |
| 4 | medio-borde | (0, 5) | −1.12 | 1.30 | **−1.63** | −13.43 | **−87.9%** |
| 5 | centro | (5, 5) | −2.14 | 1.47 | **−5.56** | −19.58 | **−71.6%** |
| 6 | medio-borde | (10, 5) | −3.16 | 1.30 | **−9.29** | −22.02 | **−57.8%** |
| 7 | esquina | (0, 10) | −1.29 | 0.35 | **−3.91** | −14.55 | **−73.1%** |
| 8 | medio-borde | (5, 10) | −2.14 | 0.41 | **−5.45** | −17.72 | **−69.2%** |
| 9 | esquina | (10, 10) | −2.99 | 0.35 | **−15.05** | −24.12 | **−37.6%** |

**Hekatan sub-predice el asentamiento en TODAS las columnas.** El gap no es por
sesgo constante (varía 34-90%) ni por mesh refinement (un test con 8×8 daría
quizás 5% mejor, no cerrar 90%). Es un problema de **modelado estructural**.

## Análisis de la discrepancia

### Test diagnóstico #1: zapata aislada via deform() (CASO BASE) ✅

Antes de investigar el modelo completo, validar que `deform()` Q4 funciona
solo (sin frames):

| Solver/Modelo | uz centro | uz esquina |
|---|---|---|
| caso 1 con `plateQ4Solve` | -4.5356 mm | -4.3849 mm |
| caso 1 con `deform()` (test diag) | **-4.5377 mm** | **-4.3846 mm** |
| Δ vs plateQ4Solve | **+0.05%** | **-0.01%** |
| SAFE referencia | -4.5370 mm | -4.3840 mm |

**Conclusión:** `deform()` Q4 reproduce `plateQ4Solve` con paridad <0.05%.
La formulación shell, las springs nodales (dof=2 para uz en convención 6-DOF
de `deform()`), y la transferencia de carga puntual funcionan perfecto.

### Causa raíz identificada: acoplamiento shell-frame en nodo compartido

El problema NO es el solver Q4. Es el **acoplamiento Q4 + frame** cuando un
nodo es compartido entre un shell (3 DOFs efectivos: w, βx, βy) y un frame
(6 DOFs: ux, uy, uz, rx, ry, rz).

Comportamiento observado en caso 6: cada zapata responde casi independiente
de las vecinas (ratio uz_max/uz_min = 15× en Hekatan vs 2.5× en SAFE). Las
vigas amarre no están transfiriendo carga lateralmente.

**Hipótesis específicas a investigar:**

1. **Frame axial DOF en z=0** — un frame horizontal en z=0 tiene axial DOF
   en dirección horizontal (eje local x del frame). El nodo shell aporta
   ux/uy en z=0. Si la transformación entre frame local y nodal global
   no acopla bien, la carga axial del frame no se transmite.
2. **Drilling DOF en shell Q4** — Q4 estándar tiene 3 DOFs efectivos por
   nodo (w, βx, βy). Para conectar con frame, el shell necesita "drilling
   DOF" (rz). Si está como rigid (sin rigidez real), el momento del frame
   en z se "pierde".
3. **Frames horizontales sin rigidez transversal vertical** — Las vigas
   amarre en z=0 conectan nodos también en z=0. La rigidez del frame en su
   eje Z local (perpendicular al frame, vertical) es la que evita giro
   vertical de las zapatas, pero si los DOFs ux/uy del shell están "free",
   los frames no aportan restricción vertical entre zapatas.

## Tests diagnósticos ejecutados (bug confirmado)

### Test #1: 1 zapata aislada via deform() (control) ✅
- `deform()` Q4 da paridad <0.05% con `plateQ4Solve` Y SAFE.
- Conclusión: el solver Q4 dentro de `deform()` funciona perfecto.

### Test #2: 2 zapatas + 1 viga, cargas IGUALES ✅
- Ambas zapatas dan uz = −7.97 mm (idéntico, simetría OK).
- Esperado teórico Winkler aislado = 7.96 mm → paridad <0.13%.
- No diagnóstico (cargas iguales → no diferencia con/sin viga).

### Test #3: 2 zapatas + 1 viga, cargas DESIGUALES (1 vs 3 tonf) ❌
- zap1 (P=−1 tonf): uz = −3.86 mm (vs esperado aislada −3.72)
- zap2 (P=−3 tonf): uz = −11.04 mm (vs esperado aislada −11.16)
- **Ratio uz1/uz2 = 0.349 ≈ ratio cargas (1/3 = 0.333)** → cada zapata
  responde como aislada, la viga amarre NO transfiere carga.

## Causa raíz: shell Q4 estándar sin drilling DOF

El frame horizontal en z=0 tiene su DOF axial en dirección horizontal
(ux/uy del nodo). El shell Q4 estándar en `deform()` no implementa
**drilling DOFs** (rigidez en ux, uy, rz del plano del shell) — éste es
el comportamiento clásico del Q4 Mindlin estándar.

Resultado: el frame "trabaja contra DOFs liberados" del shell → la matriz
de rigidez del frame no se conecta al sistema global → la viga se
comporta como un elemento aislado que no transfiere carga.

## Fix requerido

Implementar **drilling DOF** en el shell Q4 del solver C++:
- Allman triangle approach (1984)
- MITC4 + drilling enhancement (Bathe)
- Cook-Malkus flat shell formulation

Esto requiere modificar `hekatan-fem/src/cpp/deform.cpp` y recompilar
WASM. Estimado: 6+ horas de trabajo, fuera del scope de este benchmark
framework.

## Workaround para casos prácticos con vigas amarre

En lugar de modelar las vigas amarre como frames separados, modelar la
cimentación completa como **una losa continua con thickness variable**
(igual que caso 4 conectada). Las "vigas amarre" se representan como
bandas delgadas (e.g., t=0.10m) entre zapatas (t=0.30m). Este enfoque:
- Funciona con `plateQ4Solve` (paridad <0.33% probada)
- No requiere fix del solver
- Modela físicamente la transferencia de carga
- Requiere mesh continuo (no 9 áreas disjuntas)

## Estado final (cerrado como "validation pendiente")

✅ Script SAFE (`safe_api_edificio.py`) funciona end-to-end, reconstruye
modelo desde cero, aplica SubModulus override, corre análisis en ~12s.
Resultados consistentes y físicamente razonables. **Reusable para validar
cualquier .fdb del usuario** (cambiar el dict de COLUMNS y LOADS).

✅ Script Hekatan (`cli_edificio.mjs`) funciona end-to-end via `deform()`,
construye 144 Q4 + 12 frames + 225 springs en ~28 ms. Ejecuta sin errores.
Los resultados son consistentes para el sub-modelo plate-only (zapata
aislada via deform da paridad <0.05% con plateQ4Solve, ver test #1).

❌ **Paridad shell-frame NO alcanzada** — limitación del solver Q4 sin
drilling DOF. Bug identificado, causa raíz documentada, workaround
propuesto. Fix requiere modificación del C++ solver (out of scope).

✅ **Tests diagnósticos preservados** (`test_diag_*.mjs`) — útiles para
re-verificar después del fix C++.

## Archivos

```
benchmarks/safe/edificio-cimentacion-real/
├── README.md                        # este archivo (estado: investigación)
├── cli_edificio.mjs                 # Hekatan deform() (shells + frames)
├── safe_api_edificio.py             # SAFE API (9 zap + 12 vigas + cargas reales)
├── hekatan_edificio_result.json
├── safe_edificio_result.json
├── safe_edificio_run.log
└── Edificio_Cimentacion_via_API.fdb # modelo SAFE generado
```
