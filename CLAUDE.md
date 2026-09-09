# Hekatan Struct Lineal

Fork de [awatif v2.0.0](https://github.com/madil4/awatif) extendido con análisis modal, Winkler springs nativos en C++, ejemplos parametrizados (zapatas, placas, cáscaras, pórticos, edificios) y un **workspace unificado** con Tweakpane para cargar cualquier ejemplo por selector o URL `?t=<id>`.

**Deploy público:** https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/

## Arquitectura del workspace

Cada ejemplo vive en su propia carpeta (`examples/src/<id>/`) con `index.html` + `main.ts` + `<name>.ts` y **exporta un `ExampleDef`** que el workspace registra en `exampleRegistry.ts`.

```
examples/src/
├── workspace/                  ← hub principal
│   ├── main.ts                 (Tweakpane unificado: selector + params + modal)
│   ├── exampleRegistry.ts      (ExampleDef interface + lista)
│   ├── runExampleStandalone.ts (runner para páginas standalone /zapata-aislada/)
│   └── units.ts                (forceUnit/dispUnit persistidos en localStorage)
├── zapata-aislada/             ← Ecuador NEC-SE-GC con selector tipo suelo
├── zapata-viga-amarre/         ← medianera + viga + centrada, Winkler 3D
├── plate-thin/, plate-thick/   ← Kirchhoff / Mindlin vía plateQ4Solve
├── membrana-pstress/           ← plane stress Q4 como muro de corte
├── shell-thin/, shell-thick/   ← Kirchhoff-Love / MITC4 vía deform+analyze
├── barra-axial/, truss-gen/    ← frames 1D
├── portico-2d/, tower-3d/, galpon/
├── edificio-aporticado/, edif-acero/, mezanine/
└── beams/                      ← Paz 6.3 (validación modal, ver abajo)
```

Todos los ejemplos son cargables desde el workspace:
- URL directa: `/workspace/?t=zapata-aislada`
- Página standalone compilada: `/zapata-aislada/`, `/edificio-aporticado/`, etc.

### Interfaz `ExampleDef` (examples/src/workspace/exampleRegistry.ts)

```ts
interface ExampleDef {
  id: string;
  name: string;
  category: string;
  params: Record<string, ParamDef>;
  build: (params, states, modalPanel?) => void;

  hasModal?: boolean;
  runModal?: (params, states, modalPanel) => void;

  onParamChange?: (changedKey, params) => void;   // soilType→q_adm, ks_factor, etc.
  computedLabels?: (params, states) => Record<string, string>;   // folder "📊 Calculados"
  inlineComputed?: Array<{ after, label, compute }>;             // ks debajo de ks_factor, etc.

  defaultShellResult?: string;        // "pressure" | "bendingXX" | ...
  availableShellResults?: string[];   // filtra dropdown Shell results
}

interface ParamDef {
  default: number;
  min?, max?, step?: number;
  label?: string;
  options?: Record<string, number>;   // dropdown numeric enum
  boolean?: boolean;                  // checkbox on/off (0/1)
  folder?: string;                    // agrupa en folder Tweakpane
}
```

### Flujo del workspace (examples/src/workspace/main.ts)

1. Usuario selecciona ejemplo → `loadExample(ex)`
2. `resetStates()` limpia objects3D, nodes, elements, inputs, outputs
3. `activeExampleVersion.v++` invalida van.derive de ejemplos previos (zapatas con springs reactivos)
4. `ex.build(params, states, modalPanel)` construye el modelo
5. Aplica `ex.defaultShellResult` al viewer y enciende loads/supports
6. `filterShellResultOptions(ex.availableShellResults)` filtra el dropdown
7. `autoScaleDeformedShape()` ajusta `deformScale` para max ≈ 25% del diagonal
8. `autoFitCamera()` reencuadra isométrica sobre el modelo
9. `buildParamsPane()` reconstruye Tweakpane con Vista / Unidades / Parámetros / Modal

## Solver FEM (hekatan-fem)

**API pública** (`hekatan-fem/src/index.ts`):
```ts
import { deform, analyze, modalAnalysis, modalAnalysisPaz,
         plateQ4Solve, didacticSolveCpp, slopeSRM } from "hekatan-fem";
```

| Función | Entrada | Salida |
|---|---|---|
| `deform` | nodes, elements, nodeInputs, elementInputs, springsList? | `DeformOutputs { deformations, reactions }` |
| `analyze` | nodes, elements, elementInputs, deformOutputs | `AnalyzeOutputs { bendingXX/YY/XY, membrane*, vonMises, pressure?, colorMapRanges? }` |
| `modalAnalysis` | nodes, elements, nodeInputs, elementInputs, nModes | `ModalOutputs { frequencies, modeShapes, massParticipation }` |
| `plateQ4Solve` | {E, nu, t, theoryType, mesh*, bcType, pressure} | `{ nodeResults[{w,bx,by}], elementResults[{Mxx,Myy,Mxy,Qx,Qy}] }` |

### Winkler springs nativos (extensión al `deform.cpp` original)

`deform()` acepta un 5º argumento opcional `springsList: Array<{node, dof, k}>`. En C++ ensambla:
```cpp
K_global.coeffRef(gdof, gdof) += k;   // gdof = 6*node + dof
```
Usado en zapata-aislada y zapata-viga-amarre para Winkler nodal (`k = ks × A_tributaria`).

### Placa Q4 con `theoryType`

```ts
plateQ4Solve({ theoryType: 0 })   // Mindlin-Reissner (FSDT, thick)
plateQ4Solve({ theoryType: 1 })   // Kirchhoff (CPT, thin)
plateQ4Solve({ theoryType: 2 })   // Plane stress (membrana)
```

**GDL de nudo, mano derecha** (3-sep-2026): `pointLoads`/`bcs`/`springs` con `dof` 0 = w,
1 = sobre X (Mx / θx), 2 = sobre Y (My / θy). Por dentro el C++ usa las pendientes de Bathe
[w, βx, βy] (βx = ∂w/∂x): θx = βy, θy = −βx, y la fuerza conjugada de βx es **−My**. Hasta
esa fecha el `dof` 1 iba directo a βx: un «Mx» del usuario era −My — la ej4 de Guerra daba
23.47 t/m² contra 28.405 de SAFE por eso, y con el signo bueno da 28.405 exacto. El elemento
es el mismo de `deform`: Shell-Thick de CSI (theoryType 0) y DKQ (1); plateQ4Solve y deform
dan la misma flecha a todos los dígitos (`zapata-winkler-sap2000`).

Retorna `elementResults[i].Mxx/Myy/Mxy/Qx/Qy` por elemento. El ejemplo debe poblar `analyzeOutputs.bendingXX/YY/XY` (Maps con array per-nodo del Q4) para que el viewer renderice el colormap.

## Viewer (hekatan-ui)

**`getViewer({ mesh, objects3D?, settingsObj? })`** retorna `HTMLDivElement` con Tweakpane "Settings" interno. Expone `(viewerElm as any).__ctx = { scene, camera, controls, render, setActiveCamera, settings }` y `.__settings` para mutación desde fuera.

### Settings disponibles

```ts
{
  gridSize: number,          // default 20
  displayScale: number,      // markers/flechas (no afecta deformada)
  deformScale: number,       // amplificación visible de la deformada
  nodes, elements, elemColumns, elemBeams,
  nodesIndexes, elementsIndexes,
  orientations, sections, secColumns, secBeams, secFloor,
  supports, loads,
  custom3D: boolean,         // toggle objects3D (zigzag springs Winkler)
  showCotas: boolean,        // dimensiones anotadas
  deformedShape: boolean,
  nodeResults, frameResults, shellResults: string,
  solids, flipAxes
}
```

### Shell results (`settings.shellResults`)

Opciones: `none`, `bendingXX/YY/XY`, `membraneXX/YY/XY`, `shearX/Y`, `vonMises`, **`pressure`**, `displacementX/Y/Z`.

Override de rango: un ejemplo puede setear `analyzeOutputs.colorMapRanges = { pressure: [0, -q_adm] }` para fijar el rango de la barra de color sólo para ciertos campos (otros siguen auto-escala).

El viewer filtra NaN en min/max (nodos fuera del plato reciben NaN). `getColorMap` soporta rangos invertidos (vMin > vMax) para convenciones de signo negativo.

## Ejes locales de barra — convención CSI (SAP2000 / ETABS)

```
eje 1 (x) = del nudo i al nudo j
eje 2 (y) = en el plano vertical que contiene la barra, hacia ARRIBA
            (barra vertical: no hay tal plano → se toma el +X global)
eje 3 (z) = eje1 × eje2
```

Para columnas verticales (elemento a lo largo de +Z):
```
local_x = [0, 0, 1]   → global Z (eje del elemento)
local_y = [1, 0, 0]   → global X
local_z = [0, 1, 0]   → global Y
```

Esto significa:
- `momentsOfInertiaZ` = **I33** = flexión en el plano 1-2 (V2, M3). En una viga
  horizontal es la flexión VERTICAL, o sea el eje FUERTE (Iz AISC).
- `momentsOfInertiaY` = **I22** = flexión en el plano 1-3 (V3, M2), el débil.

En `beams/main.ts`:
```typescript
momentsOfInertiaY: eMap(COL_Iy, GIR_Iy),  // weak axis → I22
momentsOfInertiaZ: eMap(COL_Iz, GIR_Iz),  // strong axis → I33
```

**Antes** la tríada era otra (`y` horizontal, `z` hacia arriba) y las dos
inercias iban en el casillero contrario. Las dos convenciones son dextrógiras y
resuelven igual, pero respecto a CSI la vieja giraba 90° **en un sentido en las
vigas y en el contrario en las columnas**, así que no había un mapeo único para
leer las fuerzas de barra contra ETABS. Con la actual: `Vy`≡V2, `Vz`≡V3,
`My`≡M2, `Mz`≡M3, sin cruzar y sin cambio de signo por tipo de barra.

Queda una diferencia que **no** es de ejes y no se corrige: CSI dibuja `M2` y
`M3` los dos "positivo = sagging" en su plano, y en el plano 1-3 eso sale al
revés del momento vectorial sobre el eje 2. Al comparar contra ETABS hay que
emitir `M2` con signo cambiado. Y `analyze()` devuelve **fuerzas de extremo**
(`f = k·u`), no el diagrama: en el extremo i el diagrama es el negativo.

Las tres copias de la tríada tienen que decir lo mismo:
`hekatan-fem/src/utils/getTransformationMatrix.ts`,
`hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp` (necesita recompilar
WASM) y `hekatan-fem/src/didacticSolver.ts`.

### Ángulo de eje local (`ang`) y áreas de cortante (`as`)

Dos cosas que el motor **no tenía** y que hacían imposible reproducir un modelo
de ETABS nudo a nudo, por mucho que las secciones coincidieran:

```
ang <frameID> <grados>          # local axis angle de CSI, giro sobre el eje 1
as  <frameID> <As2> <As3>       # áreas de cortante en m2 (As2→V2, As3→V3)
```

`localAngles` y `shearAreasY/Z` viajan en `elementInputs` hasta el C++
(`getTransformationMatrixFrame` gira el par eje2/eje3; `getLocalStiffnessMatrix`
ya usaba las As). Las **tres** copias de la tríada tienen que girar igual:
`getTransformationMatrix.ts`, `getTransformationMatrix.cpp` (recompilar WASM) y
`didacticSolver.ts`.

Por qué importa, medido en el galpón (1120 barras, misma malla de ETABS):

| | dentro del 1 % nodal | p95 | flecha máx |
|---|---|---|---|
| sin `ang` ni `as` | 16.4 % | 22.5 % | 13.6 % |
| con `ang` | 27.2 % | 7.9 % | 0.42 % |
| con `ang` + `as` | **49.9 %** | 4.6 % | 0.89 % |

- Una C 200×50 girada 90° pasa de I = 6.20e6 a 0.53e6 mm⁴: **once veces más
  floja**. El galpón lleva 471 barras a 90° (cordones en C y diagonales 2L).
- Sin `as`, Hekatan supone `5/6·A`. En una VA-250 el alma son 1170 mm² y
  `5/6·A` son 2442: el doble. Por eso salía **sistemáticamente más rígido**,
  siempre en el mismo sentido — la firma de un término de cortante que falta.

⚠️ `ang` **ya no es alias de `shellang`**. Lo fue; al añadirse para barras, el
`case` de shell quedó inalcanzable. El ángulo de cáscara es `shellang`.

## La membrana: elemento ITW 1990 (drilling)

Desde el **19-ago-2026** la membrana de la cáscara es el elemento de
Ibrahimbegović, Taylor & Wilson (1990), IJNME 30:445-457 — el giro normal entra
en el **campo de desplazamientos** (interpolación de Allman por los lados +
burbuja `(1-r²)(1-s²)` condensada), no como una penalización pegada aparte.

```
(33) K = ∫ [B G]ᵀ C [B G] dΩ    con Gauss 3×3
(38) P = γ ∫ {b;g}⟨b;g⟩ dΩ      con UN SOLO PUNTO (el centro)
(39) [K + P] a = f
```

Vive en `getMembraneITW` (`shellQ4.cpp`, usada también por `shellThin.cpp`) y en
`hekatan_struct/elements/membrane_itw.py`. Se elige con
`elementInputs.drillingTypes`: **3 = ITW (defecto)**, 2 = Q4 con modos
incompatibles + Hughes-Brezzi (lo de antes), 1/0 = legacy.
`drillingPenaltyScales` pasa a ser **γ/μ** (defecto **0.4**).

**Por qué γ = 0.4·μ y no 1.0 como el paper**: reconstruida la matriz 12×12 de
membrana de ETABS entera por flexibilidad (`celda_membrana12.py`, sin tocar el
binario) y ajustada γ por mínimos cuadrados sale **0.400 exacto**, en las 10
geometrías y con 0, 2 o 4 modos incompatibles. Da igual: el paper avisa —y se
comprueba— de que la formulación es **insensible a γ**.

### Lo que ganó y lo que costó

| | antes (HB 0.05) | ahora (ITW) | ETABS/SAP | exacto |
|---|---|---|---|---|
| patch test flecha | −1.70 % | **0.000 %** | 0.000 % | 1.5 |
| patch test **giro** | −6.34 % | **0.000 %** | 0.000 % | 0.6 |
| cantilever corto | 0.181 % | 0.126 % | −0.31 % | 0.3553 |
| `drilling-dof` vs ETABS | +11.46 % | **+5.45 %** | — | — |
| Cook en C | 0.459 % | 0.962 % | −1.29 % | 23.91 |
| mezanine, axil P | 0.30/1.15 | 0.62/3.47 | — | — |
| hemisferio 8×8 | −3.6 % | **−37.4 %** | −0.26 % (SAP) | 0.094 |

### Tres cosas que NO hay que volver a probar

1. **Gauss 2×2 en el ITW.** Desbloquea el hemisferio (−37 % → −5 %) pero el
   elemento se queda con **4 modos de energía nula**: es un mecanismo, no una
   mejora. `modos_nulos()` en `membrane_itw.py` lo mide.
2. **Los 4 modos incompatibles de Wilson** en lugar de (o además de) la burbuja:
   el patch test da un giro de −0.98 en vez de 0.6 y salen 5 modos nulos.
3. **La modificación de Taylor sobre la burbuja** (J₀ del centro): no desbloquea
   nada (−37.38 % contra −37.40 %).

### El hemisferio: CERRADO el 2-sep-2026 con la membrana de CSI (tipo 12)

| malla | paper (M-type) | SAP2000 | tipo 8 (3×3) | **tipo 12 (2×2 + reloj)** |
|---|---|---|---|---|
| 4×4 | 0.087548 | — | 0.010114 (−88 %) | **0.084490 (−3.5 %)** |
| 8×8 | 0.093714 | 0.093751 | 0.059249 (−37 %) | **0.092718 (−1.1 %)** |
| 12×12 | 0.093587 | — | 0.083555 (−11 %) | **0.093174 (−0.4 %)** |
| 16×16 | 0.093488 | — | 0.089954 (−3.8 %) | **0.093325 (−0.2 %)** |

Lo que sigue es la historia de cómo se buscó, y por qué el «Gauss 2×2 = mecanismo»
de abajo era verdad a medias: con el reloj de arena del θz (`khg = 2e-4`, el 5e-5
del kernel de CSI) el 2×2 tiene 3 modos nulos y no bloquea. `itw_seis_casos.mjs`
vigila ahora la banda nueva.

#### (histórico) El hemisferio: DÉFICIT ABIERTO (⚠️ antes decía "bloqueo, no bug" — era falso)

En cáscara **curva** el elemento se queda muy corto en malla gruesa. Converge,
pero **mucho más lento que el del paper**. Leída la **Tabla IV** del paper
(pág. 455, columna M-type) el 2026-08-20:

| malla | paper (M-type) | SAP2000 | este motor |
|---|---|---|---|
| 4×4 | 0.087548 | — | 0.010114 (**−88.4 %**) |
| 8×8 | 0.093714 | 0.093751 | 0.059249 (**−36.8 %**) |
| 12×12 | 0.093587 | — | 0.083555 (−10.7 %) |
| 16×16 | 0.093488 | — | 0.089954 (−3.8 %) |

**El elemento del paper ya está convergido a 4×4.** Y SAP2000 reproduce la tabla.

⚠️ Aquí decía que era *«el membrane locking del que avisa el propio paper (§4)»*.
**Es falso y hay que no repetirlo**: el paper dice literalmente lo contrario —
*«It is important to establish that the proposed formulation causes **no membrane
locking** when applied to shell analysis»* (§4.5)— y su tabla lo respalda. El
déficit es NUESTRO y está abierto.

Lo que ya se probó y **no** lo explica:

* **La formulación de placa.** El paper combina la membrana con una **DKQ**
  (§4.5); nuestro defecto es MITC4. Medidas las tres a 4×4: MITC4 −88.4 %,
  Kirchhoff DKE −82.6 %, DKMQ −82.5 %. Ninguna se acerca.
* **La cuadratura.** El `.cpd` didáctico (`calcpad-ceinci-lab/`) integra **2×2**
  y saca 0.0894 a 8×8 —más cerca del paper que nosotros— pero deja 4 modos de
  energía nula, y por eso tiene que parchear a mano las diagonales casi nulas de
  la K. Tres implementaciones de acuerdo (Calcpad = MATLAB = Python) **no** hacen
  bueno un número si las tres integran igual y esa integración deja un mecanismo.

Vigilado en `tests/casos/itw_seis_casos.mjs`, que compara contra la Tabla IV
malla a malla y **falla también si mejora**, para que el arreglo no pase
desapercibido. Para una cúpula en malla gruesa, hoy conviene `drillingTypes = 2`.


## La membrana: también es la de CSI desde el 2-sep-2026 (`drillingTypes = 12`)

Con la K de membrana 12×12 MEDIDA en ETABS (`galpon-bodega-electoral/memb12.json`,
9 geometrías: cuadrados con ν, rectángulos, paralelogramo, trapecio) y lo leído
del kernel (`registros/2026-09-02_binario_drilling_shellthick.md`), la membrana
de ETABS resulta ser el ITW **con** estas cuatro cosas juntas:

```
Allman + burbuja (14 gdl)  ·  Gauss 2×2  ·  proyección FEAP del drilling (B-bar del giro)
penalización P en el centro con γ = 0.4·μ (el 0.1 del binario × (2·b0)²)
+ reloj de arena del θz:  (khg·μ·t·A/4)·h hᵀ,  h = [+1,−1,+1,−1],  khg = 2e-4  (el 5e-5 del kernel)
```

Tipo **12** en `shellQ4.cpp` (`getMembraneITW` con `ngITW=2, proyITW, khg=2e-4`) y en
`membrane_itw.py` (`_DRILLING[12]`, parámetro `khg`). **Es el defecto** en los dos
(`getMapVal(drillingTypes, index, 12)`, `TIPO_DRILLING_DEFECTO = 12`). Contra la
12×12 medida: **1e-13 % (Python) / 1e-11 % (C++)** en las 9 geometrías, 3 modos nulos.
El tipo 8 (3×3 + proyección, 0.88 %) y el 10 se quedan como estaban.

## La placa gruesa: Shell-Thick de CSI, extraído del binario (2-sep-2026)

Desde el **2026-09-02** la flexión del `shelltype thick` es la formulación del
Shell-Thick de ETABS/SAP2000 tal como la calcula `CsiGo2.dll` — medida en vivo
(monta_B y la K de 22 gdl antes de condensar) y reproducida a **1e-12 %** contra
la K medida de ~140 celdas (cuadrado, rectángulo, 27 trapecios, cuadriláteros
irregulares, barridos de t/ν/L y modificadores). Bitácora:
`registros/2026-09-02_binario_drilling_shellthick.md`.

```
giros con 9 funciones (4 bilineales + 4 jerárquicas de lado + burbuja), 2 componentes cada una
curvaturas  kx = θy,x   ky = −θx,y   kxy = θy,y − θx,x
cortante    4 cortantes de LADO de Wilson (8.7) (jerárquicas con 2/3) → covariante
            tipo MITC con la parte lineal SIMETRIZADA, m = (b+d)/2 → físico J⁻¹
penalización 1000·(D11+D22+D33)·∫(θx,x + θy,y)² dA        ← la divergencia del giro
cuadratura  ITW 1991 de 8 puntos · B-barra en las 10 internas · condensación saltando pivotes nulos
```

| dónde | qué |
|---|---|
| `hekatan-fem/src/cpp/utils/shellQ4.cpp` → `getBendingK_CSI` | el C++/WASM (defecto). `-DHK_BENDING_FORMULATION=3` devuelve el MITC4 de antes |
| `hekatan-struct-py/.../elements/plate_csi_thick.py` | el espejo en Python. `shell_q4_motor.PLACA_THICK = "csi"` (defecto) / `"mitc4"` |
| `hekatan-struct-py/tests/test_csi_thick_cells.py` | contra la K medida de ETABS, celda a celda |
| `validation/02-placas/dse-de-wilson/etabs_thick_full.py` | la fórmula suelta, con la validación masiva |

Lo que NO es: ni MITC4, ni el DSE de Wilson a secas, ni «DSE + un coeficiente».
El cortante simetrizado deja un mecanismo (φ: θ = (x−xc, y−yc)) y la
penalización de la divergencia es lo que lo estabiliza — ese es el origen del
`λ_φ = 455·D` que se persiguió durante semanas. El Shell-Thin sigue siendo el DKQ.

⚠️ El harness `cli/native/kelem_native.exe` imprime la K en ejes LOCALES del
elemento (`localX = v01 + v32`): en un trapecio no coincide entrada a entrada
con la K global de ETABS aunque sea la misma (autovalores idénticos).

## Fuerzas de cáscara: joints como CSI, signo de CSI (8-sep-2026)

`analyze()` daba el momento en el **centroide** con la B bilineal y lo repartía a nudos
promediando los centroides vecinos: el pico sobre una columna desaparecía (4.2 donde ETABS
lista 57.8) y el signo era el de la curvatura del solver, **al revés que CSI**. Ahora:

- **Shell-Thin (DKQ, `plateFormulations = 1`)**: `utils/dkqJoints.ts` (espejo de `plateDKQ.h`)
  evalúa la B en **Gauss 2×2 y extrapola bilinealmente** a las esquinas. Medido: = ETABS 22
  **0.0000 % joint a joint** en las 4 plantillas con losa (3600 joints c/u); evaluando en las
  esquinas directamente el M12 de las celdas de esquina se iba 26 %. Contra SAP2000, 0.5–0.9 %
  (lo que SAP y ETABS difieren entre sí).
- **Shell-Thick (`plateFormulations = 0`)**: `utils/csiThickJoints.ts` recupera los 10 gdl
  internos (`u_i = −K_ii⁻¹ K_ib u_b`, misma K que `getBendingK_CSI`) y evalúa en las esquinas.
  Placa 4×4 vs SAP2000 0.026 % joint a joint; losa gruesa de edificio vs SAP y ETABS 0.075 %.
  ⚠️ Aplicar la recuperación gruesa a una solución DKQ da 41 vs 58 sobre columna: cada
  formulación con su B.
- **Signo**: `SIGNO_CSI = −1` en `computeQ4ShellStresses`: M11 > 0 = tracción abajo (vano de
  losa positivo, columna negativa). El test `placa-momentos-navier` lleva ese signo y SAP2000 de
  árbitro (`tests/datos/placa_navier_sap2000.json`).
- Salidas nuevas en `AnalyzeOutputs`: `bendingXXcentro` (número por elemento) y
  `bendingXXjoint` (4 valores, sin promediar), ídem YY/XY. `bendingXX` (el colormap) es la media
  en el nudo de los joints de los elementos que lo tocan. `plantillas_hekatan.mjs` los vuelca
  (`bXXc`, `bXXj`, `pts`) y `plantillas_vs_csi.mjs` compara en tres capas (centroide, joint, nudo).
- **Giros del solver = mano derecha**: `θx = +∂w/∂y`, `θy = −∂w/∂x` (medido con el patch test;
  las otras siete combinaciones dan cientos de %). En un apoyo duro de placa, «pendiente
  tangencial nula» en y = 0 es `ry = 0`; fijar `rx` ahí es empotrar.
- Validez sin ETABS (`validation/02-placas/shell_thick_validez.mjs`, `_convergencia.mjs`): rango
  3, patch test 6.9e-11 % (Thick) / 6.6e-13 % (DKQ), convergencia a Reissner–Mindlin 0.12 % / 0.29 %
  (t/L 0.1, 32×32) y 0.065 % / 0.24 % (t/L 0.01), sin bloqueo. Fuentes pieza a pieza en
  `validation/02-placas/SHELL_THICK_FUENTES_Y_VALIDEZ.md`: la simetrización del cortante y la
  penalización de la divergencia **no están publicadas** (son del kernel); el resto sí.
- **Membrana (F11/F22/F12)**: `utils/itwJoints.ts` (ITW tipo 12: Allman proyectada, Gauss 2×2
  extrapolado, **sin la burbuja** al recuperar; con ella 5.7 % en muros). = ETABS y SAP2000
  **0.0000 %** en la dual (3760 joints). Salidas `membraneXXcentro/joint`.
- ⚠️ Los `.s2k` de `validation/modelos/plantillas/csi/` eran del 3-sep, sin diafragma: SAP daba
  0.5–0.9 % en fuerzas y 0.5 % en uy, y se atribuyó a «lo que SAP y ETABS difieren». Re-exportados
  el 8-sep: SAP2000 = ETABS = Hekatan a 0.0000 % (flexión y membrana) en las 4 plantillas con losa.
- Test `node tests/run.mjs fuerzas-cascara` (dual M y F, losa plana M; joints y nudo, 0.001 %).
- **`automesh <tam>`** en el `.heks` (8-sep-2026, apagado por defecto): parte los paños Q4 en celdas
  ≤ tam por interpolación bilineal, como el `AUTOMESHOPTIONS … FLOORMESHMAXSIZE 1250` de ETABS.
  Medido contra el modelo de análisis de ETABS (losa 5×5 como un paño): misma malla (25 nudos,
  16 cáscaras) y **1.1e-10 %**. Hace falta al IMPORTAR un `.e2k` con la losa sin mallar: ETABS la
  parte y Hekatan no, y no son el mismo modelo. Test `node tests/run.mjs automesh`.
- ⚠️ El exportador escribía `ADDRESTRAINT "Yes"` en las áreas: con eso, al automallar, ETABS
  **empotra todos los nudos NUEVOS del borde** que tocan uno restringido (losa 5×5 apoyada en 4
  esquinas: 7 veces más rígida). Va **`"No"`**, que es lo que escribe ETABS en su propio `.$et`.
  No se veía en las plantillas porque allí la malla ya va en el fichero.
- `areaspring <shellID> <ks> [nodal]` y `edge etabs` en el `.heks` (8-sep-2026): viajan al WASM por la
  lista de muelles con **nudo negativo** = −(elemento+1) (`utils/springsExtra.h`; gdl −1 consistente
  ks·∫NᵀN, −3 nodal ∫N_i dA, −2 nudo colgado atado por Hermite con penalización 1e6). Medido: el muelle de
  área de **SAFE es el nodal** (placa flexible ≤ 1.1 %; el consistente 23 % en esquinas) y **ETABS malla el
  paño por el nudo colgado también con `OBJMESHTYPE "NONE"`** (14 nudos / 8 áreas de análisis): su réplica
  es `deck etabs`, no `edge etabs`. Test `node tests/run.mjs muelle-area`.

## Masa torsional: Ip vs J

La masa consistente usa `Ip = Iy + Iz` (momento polar de inercia) para DOFs torsionales, NO `J` (constante de Saint-Venant). OpenSees tiene un bug conocido donde usa J en vez de Ip — causa ~3% de error en modos torsionales.

⚠️ Pero el modal **no pasa por ahí**: `getGlobalMassMatrix.cpp` es masa LUMPED
(la de CSI), con la masa rotacional a `1e-9·m`. `getLocalMassMatrix.cpp` (la
consistente, la del `Ip`) hoy no la usa el modal. O sea que `Ip` vs `J` no puede
explicar ninguna diferencia de masa contra ETABS.

## Pesar el modelo: `assembled_joint_mass`

La M se arma en `ensamblarMasa()` (`modal.cpp`), fuera de `modal()`, con los tres
pasos de ETABS en su orden: **2a** fuente de masa (`INCLUDEELEMENTS` + masa
nodal) · **2b** solo lateral (`INCLUDEVERTICALMASS "No"`) · **2c**
`LUMPATSTORIES`. El diafragma no entra ahí: eso es una restricción, no masa.

La misma función se expone como `assembled_joint_mass()`, que es la tabla
`AssembledJointMass` de ETABS y **no resuelve nada, solo pesa**:

```bash
# C++ nativo — el TERCER argumento activa el modo báscula
node cli/native/dump_modal_input.mjs modelo.heks e.bin 12 "1,1,1"  # lateral,lump,inclElem
cli/native/modal_native.exe e.bin nada.json masa.csv               # nudo,x,y,z,mUx..mRz
```

Desde JS: `masaEnsamblada()` en `tests/lib/wasm.mjs`. Test de regresión:
`node tests/run.mjs masa` (caso `masa_lump_etabs`, árbitro ETABS 22 sobre el
galpón). **No** rehacer la cuenta en JavaScript para "comprobar": eso mide una
copia, y así se estuvo mirando meses una masa que no era la del solver.

## El motor de Python (`hekatan-struct-py`) — el árbitro rápido

Mismo solver de barras que el TS/C++, en Python puro. **No es una maqueta: el
2026-08-17 reproduce el galpón (378 nudos, 723 barras) al `0.000 %` en los 378
nudos.** Sirve para iterar sin recompilar WASM: se cambia una línea y se vuelve
a medir en menos de un segundo.

```python
from hekatan_struct.heks import leer_heks, resolver_heks
m = leer_heks("galpon_bodega.heks")     # el MISMO texto que come cliModeler.ts
res = resolver_heks(m)
```

Lee el `.heks` a propósito, en vez de rearmar el modelo en Python: si no, lo
que se compara son dos modelos parecidos, no dos motores.

Lo que tiene, y que hasta el 17-ago **no** tenía (era Euler-Bernoulli pelado):

| | dónde |
|---|---|
| cortante de Timoshenko con `as` (5/6·A por defecto, como ETABS) | `elements/frame.py` |
| `ang` — local axis angle de CSI | `frame_local_axes_csi(..., angle_deg)` |
| `frameload` → fuerzas **y momentos** de empotramiento | `frame_fixed_end_loads` |
| end releases por condensación estática | `frame_releases_condense` |
| apoyos por **eliminación**, no penalty | `deform()` |
| camino disperso (CSR) a partir de 3000 GDL | `deform(..., sparse=True)` |

Guiado por **SAP IV** (`SAP-IV-estudio/`, el último eslabón con fuente abierta
del linaje que acaba en SAPFire): `beam.for` para el término de cortante
(`φ = 12EI/(G·As·L²)`, que con As→∞ degenera exacto en Euler-Bernoulli),
`bound.for`+`sesol.for` para numerar con 0 los GDL restringidos, `addstf.for`
para el ensamble.

⚠️ **Trampa del `.heks`**: el 6º token de `frame` es **I22** (plano 1-3) y el 7º
es **I33** (plano 1-2, el del canto), aunque el comentario los llame `Iz Iy`. Y
en `as ID As2 As3`, **As2 va con I33**. Cambiarlo cruza las inercias.

**Cáscaras y muelles (19-ago):** `heks.py` monta ya `shell`, `areaload` (vector
nodal consistente `∫N_i·q·dA`, Gauss 2x2 con jacobiano real), `shellmod` escalar
y direccional, `shellang`, **`shelltype thin`** (Kirchhoff **DKE** de Batoz &
Tahar — `elements/plate_dke.py`, NO el MZC) y **`spring`** (Winkler nodal, en
`NodeInputs.springs` para que el modal pueda verlos). Medido contra el **WASM**
por `cliModeler`: **10 modelos al 0.0000 %**, y el **RIOCHICO entero** (1303
nudos, 2066 elementos, 612 muelles, 322 releases) al 100 % dentro del 1 % en
1.2 s (`hekatan-struct-py/tests/test_heks_shells.py`). Fuera y avisando aparte:
`mass` y `diaph` — `deform.cpp` tampoco los mira, solo `modalCpp`, así que el
estático sin ellos está BIEN.

⚠️ Un **triángulo escrito como Q4 colapsado** (4º nudo repetido) no es un
elemento definido: el jacobiano del borde colapsado es cero, `jacobian2D` lo
topa a 1e-15 y cada motor cae en un ruido distinto. En riochico esas 8 cáscaras
valían el peor nudo 2.57 %; sin ellas, 0.016 %.

⚠️ **`shellQ4.ts` y `shellQ4.cpp` NO coinciden en la flexión de placa**: los
modos incompatibles de Wilson están solo en la membrana del `.ts` y también en
la flexión del `.cpp`. Manda el `.cpp`, que es el que se compila a WASM y da los
números del producto (`index.ts` exporta `deformCpp`). Vale 1.8 % en una losa
4x4. Arbitrado con Navier, que no es ninguno de los dos: en malla gruesa el que
lleva los modos está 3 veces más cerca, y al refinar convergen. En Python es
`BENDING_MODOS_INCOMPATIBLES` (True = el C++), con un test de paridad contra
CADA motor — el del C++ por `tests/oraculo_wasm.mjs`.

⚠️ Un GDL **sin rigidez ninguna** (diagonal y columna a cero) hay que sacarlo
del sistema y dejarlo en 0: es el `getZerosIndices` de `deform.cpp`. Con él
dentro no falla ese GDL, falla el modelo entero — `galpon_lc.heks` daba NaN en
los 609 nudos por 9 GDL huérfanos de 3 nudos que solo tocan zinc sin flexión.

⚠️ `awatif-py/` es OTRO paquete (el fork original). Los tests que hacen
`from awatif import ...` **no** prueban este motor; los de éste importan
`hekatan_struct`. `pytest tests` → **69 pasan**, 1 skip, 2 xfail.

## Suite de regresión: `npm test`

```
npm test                 # todos los casos
node tests/run.mjs paz   # solo los que lleven "paz" en el nombre
```

Sale con **código 1** si algo se pasa de su límite. Hoy: **335/335** (261 s).

```
tests/
  run.mjs              runner: descubre tests/casos/*.mjs, tabla, exit code
  lib/bundle.mjs       empaqueta TS del repo con esbuild y lo importa (cachea)
  lib/wasm.mjs         llama a _modal del WASM directo (modelo definido a mano)
  lib/heks.mjs         resuelve un .heks por cliModeler
  lib/comparar.mjs     fuerzas de barra vs ETABS (extremo→diagrama, signo de M2)
  casos/paz_6_3.mjs            6 modos × 2 caminos vs ETABS 22
  casos/mezanine_fuerzas.mjs   133 barras × 6 campos vs ETABS 22
  casos/safe_ex01_placa.mjs        flecha vs Navier analítico y vs SAFE
  casos/safe_ex04_placa_vigas.mjs  placa sobre vigas: shells y barras JUNTOS
  casos/mesa_torsion_fuerzas.mjs   24 barras vs ETABS 19.1 (SCP, mismas cargas)
  casos/masa_lump_etabs.mjs        la BASCULA: masa nudo a nudo vs AssembledJointMass
  datos/               el .heks y el JSON de referencia
  datos/gen_mesa_solver_ref.py     genera la referencia ETABS de mesa-torsión
```

Un caso exporta `{ nombre, descripcion, correr() }` y `correr()` devuelve filas
`{ que, medido, limite, ok, detalle }`. **La referencia de un caso tiene que ser
otro PROGRAMA** (ETABS, SAP2000, SAFE) con el mismo modelo, la misma malla nodo
a nodo y los brazos rígidos anulados — nunca una cuenta a mano ni un número
heredado sin fuente reproducible: así fue como se coló la referencia falsa del
Paz 6.3 y estuvo meses dando por buena una regresión que no existía.

`lib/heks.mjs` va **por `cliModeler`** a propósito, no llamando al solver a
pelo: así el test cubre también el lector del `.heks` y el armado del modelo,
que es donde vive el cruce I22/I33 de la convención CSI.

Un caso puede tener **dos árbitros** y conviene: `safe_ex01_placa` compara contra
la serie de Navier (analítica) **y** contra SAFE. Ojo con la malla: los puntos
x = 60″ de la tabla del PDF **no caen en nodo** con malla uniforme 8×8 (360/8 =
45″), porque la del PDF es no uniforme con los bordes finos. Por eso contra
Navier va 12×12 y contra SAFE solo el centro.

mesa-torsión ya está arbitrada barra a barra (2026-08-09): el caso SCP (misma
carga nodal, sin diafragma, offsets=0) cierra < 1 % salvo torsión (~4 %, J
Saint-Venant vs ETABS). Por el camino cazó un cruce I22/I33 vivo en
`mesaTorsion.ts`: las vigas tenían la inercia FUERTE en I22, flexionaban en
gravedad 2.78× más flojas, y su M3 salía 0.70× / las columnas 1.33× el de ETABS.

Las zapatas Guerra contra SAFE (réplica nudo a nudo, `validacion/safe-api/safe_node_driver.py`)
viven en el caso `guerra-vs-safe`: ej1/2/3/4/8 < 0.25 %, ej7 0.000 %, ej5 0.86 %. El «ej4 −17 %,
formulación de placa» que estuvo abierto un mes era el SIGNO del momento (ver `plateQ4Solve`).

## Validación del solver modal contra ETABS 22

Ejemplo de referencia: **Paz & Leigh 6.3 Space Frame** (`examples/src/beams/main.ts`).

| Solver | Archivo | Descripción |
|--------|---------|-------------|
| WASM browser | `examples/src/beams/main.ts` | Eigen C++ → emscripten → browser |
| WASM CLI | `cli_modal.mjs` | Eigen C++ → emscripten → Node.js |
| C++ nativo | `cli_modal_native.cpp` | Eigen C++ → g++ → exe standalone |
| Python/SciPy | `test_modal_comparison.py` | Reimplementación + K de OpenSees |

Modos del Example 6.3 (W24x146 columnas, W14x84 vigas, kip/in/sec):

| Modo | ETABS 22 (offsets=0) | Hekatan denso | Hekatan subespacio | dif |
|---|---|---|---|---|
| 1 | 8.8305 | 8.8358 | 8.8305 | 0.06 % / **0.00 %** |
| 2 | 14.5459 | 14.5551 | 14.5459 | 0.06 % / **0.00 %** |
| 3 | 24.2336 | 24.2228 | 24.2336 | −0.04 % / **0.00 %** |
| 4 | 25.1132 | 25.1038 | 25.1132 | −0.04 % / **0.00 %** |
| 5 | 159.6525 | 159.6530 | 159.6525 | 0.00 % |
| 6 | 159.8513 | 159.8523 | 159.8513 | 0.00 % |

El camino de **subespacio** de Hekatan sale idéntico a ETABS en los **cuatro
decimales de los seis modos**. Arbitrado con `cli/paz_etabs.py` (mismas secciones
por `SetGeneral`, misma densidad) y `cli/paz_masa_etabs.py`. Test de regresión:
`node cli/paz_check.mjs` (tolerancia 0.1 %, sale con código ≠ 0 si falla).

### ⚠️ Por qué "offsets = 0": ETABS no pesa el brazo rígido

Tal cual, ETABS da `9.0903 … 164.5541`, un **+2.94 % uniforme**. **No es el
solver**: ETABS pone brazos rígidos automáticos (`auto = SI`, RZ = 0) también
aquí — 14.20 in en el tope de cada columna, 12.35 y 6.45 en los extremos de las
vigas — y **descuenta del peso propio el tramo que cae dentro del brazo**.
Medido con `AssembledJointMass`:

| | ETABS auto | ETABS offsets=0 | Hekatan |
|---|---|---|---|
| masa nudo libre | 5.707652e−3 | — | 6.048429e−3 (−5.63 %) |
| masa nudo base | 2.840051e−3 | — | 2.840090e−3 |
| masa total | 3.419081e−2 | 3.555392e−2 | 3.555400e−2 |

Lo que descuenta son **1857.4 in³ exactos** = `2·24.7·24.7 + 2·24.7·12.9`, o sea
los offsets **de las vigas** (los de columna no los descuenta). Y √(6.048429 /
5.707652) = 1.02942, que es exactamente el +2.94 % observado (9.0903/8.8305 = 1.02942):
la masa y la frecuencia cierran por las dos vías. (Aquí decía +2.88 %: mal escrito.) Hekatan lumpea `ρ·A·L/2` con L
de nudo a nudo (`getGlobalMassMatrix.cpp`, HRZ, igual que CSI): con offsets = 0
la masa total coincide al **0.002 %**.

Corolario (hasta el 8-sep-2026): Hekatan no tenía end length offsets y ETABS los pone por
defecto, así que se anulaban. **Desde el 8-sep-2026** `plantillas` y `edificio-aporticado` llevan
`offsets` (1 = ETABS, defecto: cada tramo de viga que toca columna pesa y masa con L − ½b_col por
extremo; 0 = SAP2000), `plantillas_etabs.py` deja los brazos (`--nooffsets` los anula) y las 8
plantillas cierran contra ETABS con sus brazos puestos (masa 0.000 %, modos 0.00 %). Lo de abajo
queda como historia. Cualquier comparación contra ETABS los tenía que anular
(`FrameObj.SetEndLengthOffset(nm, False, 0,0,0)`) o mide otra estructura.

⚠️ **La tabla que estaba aquí antes era falsa** (`9.6780 / 16.9874 / 26.6149 /
29.9497 / 33.9929 / 44.9332`, atribuida a "4 solvers de acuerdo"). Solo la
reproduce `cli/native/cli_modal_native.exe`, un binario del 17-may compilado de
código que **nunca se subió**: el árbol de ese mismo commit, recompilado, da
8.8412. Y sus modos 5-6 (33.99 / 44.93) no existen — ETABS también los pone a
~164 Hz. `cli/paz_check.mjs` venía fallando contra esa referencia falsa.

## Zapata Aislada (Ecuador NEC-SE-GC)

`examples/src/zapata-aislada/zapataAislada.ts` — referencia de cómo integrar:
- Tabla `SOIL_TYPES[]` con 11 suelos (Custom + arcilla blanda/firme/dura + limo + arena suelta/media/densa + grava + roca alterada/sana) con q_adm, ks_factor (Bowles), su, φ, γ, N_SPT, E_soil
- Selector `Tipo de suelo` como `options` dropdown → `onParamChange` autopobla todas las propiedades
- Patrones de carga **D/L/S** con checkboxes `boolean` + selector de modo (Simple / Solo-D / Solo-L / Solo-S / Combinación)
- `inlineComputed`: ks calculado aparece como readonly debajo de `ks_factor`
- `computedLabels`: folder "📊 Calculados" con D flexural, k_r Biot, q_max, ratio q_max/q_adm
- `availableShellResults: ["pressure", "bendingXX", "bendingYY", "displacementZ", "vonMises"]`
- `defaultShellResult: "pressure"` con override `colorMapRanges.pressure = [0, -q_adm]`
- Resortes 3D zigzag (rojo) + base verde (anchor suelo) en `states.objects3D.val`
- `hasModal: true` + `runModal` vía `modalAnalysis(nodes, elements, ni, ei, 12)`

## Build & Deploy

```bash
# Dev local (hot reload en localhost:4600)
npm run dev:examples

# Build de producción (output en website/src/examples/)
MSYS_NO_PATHCONV=1 DEPLOY_BASE=/hekatan-struct-lineal/ npm run build -w examples

# Deploy a GitHub Pages (branch gh-pages)
GIT_AUTHOR_NAME="..." GIT_AUTHOR_EMAIL="..." \
  npx gh-pages --dist website/src/examples \
    --repo https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git \
    --branch gh-pages --dotfiles \
    --message "..."
```

### Verificar el deploy PÚBLICO plantilla a plantilla (6-sep-2026)

El equivalente al `--ctl` del WPF, pero contra la URL de GitHub Pages con puppeteer. Lo que ve
Jorge en el navegador se reproduce aquí, no en local:

```bash
node cli/check_deploy_bugs.mjs edificio-dual test-m-dual   # pageerror + console.error + PNG por id
node cli/check_deploy_bugs.mjs $(cat cli/shots/deploy/_ids.txt)   # barrido entero (140 ids, ~35 min)
node cli/check_deploy_modal_hang.mjs edificio-dual 1        # corre el modal, sube pisos/vanos, mide si responde
node cli/check_deploy_longtasks.mjs edificio-dual           # cuánto BLOQUEA el hilo cada paso (longtask API)
node cli/check_deploy_colormap_scope.mjs                    # rango por familia, leyenda sin recortes, leyenda oculta
node cli/check_deploy_csi.mjs edificio-dual guerra-ej1-zapata-cuadrada   # pulsa Exportar E2K/S2K/F2K, captura el blob, cuenta tablas
node cli/f2k_desde_ejemplo.mjs guerra-ej1-zapata-cuadrada  # el mismo F2K sin navegador (nudos, losas, muelles, cargas, ΣFz)
```

Los PNG van a `cli/shots/deploy/`; `_hoja_NN.png` son hojas de contacto 4×4 (PIL) para MIRARLAS: un
JSON con `pageerror: 0` no dice nada de un muro sin colormap ni de una cámara fuera de cuadro.
Sondeos finos (`cli/_deploy_*.mjs`): `_deploy_muro_scalar` (histograma del atributo `scalar` por cara),
`_deploy_pixel` (píxel renderizado contra el color que toca por paleta), `_deploy_ray` (qué triángulo
pinta un píxel), `_deploy_nan`. ⚠️ Tras cambiar `shellResults.val` hay que esperar un tick antes de
leer `geometry.attributes.scalar`: van.derive corre después y se lee el campo ANTERIOR.

Lo que salió de ahí (todo medido): el modal se recalculaba en cada tick de arrastre y dos veces al
soltar (→ `__liveDrag` + `pause()` del animador); la animación reescribe `mesh.nodes` a 50-80 ms por
frame en 6600 nudos (→ 10-15 fps si > 1500/4000 nudos); el rango del colormap es global y un muro a
10 kN/m² junto a otro a 110 sale entero magenta (→ Settings «Rango colormap»: todas / muros / muros X /
muros Y / losas, y F22 por defecto en plantillas con muros); leyenda recortada (`white-space: nowrap`)
y con nueve «0» sin valores (oculta); el panel de IA sondeaba `localhost:11434` en cada regeneración
(cacheado, solo en localhost); `legacy("diagrid")`/`("pergola")` pisaban el id del ejemplo paramétrico
(→ `<id>-awatif`). Abierto: `estructura-mixta` deja 35 nudos sueltos y `deform` vacío (NaN en el visor).

### Cómo COMPROBAR que el deploy lleva el arreglo

Que `gh-pages` diga «Published» no prueba nada. Tres pasos, y el 2 es el que
vale:

```bash
# 1. la página carga y no revienta (mira el PNG, no solo el JSON)
node cli/check_deploy.mjs          # → cli/shots/deploy_publico.png, pageerror: 0

# 2. el chunk de PRODUCCION es el mismo binario que el build local
curl -s https://giorgioburbanelli89.github.io/hekatan-struct-lineal/assets/e2kExporter-<hash>.js -o /tmp/e2k.js
cmp /tmp/e2k.js website/src/examples/assets/e2kExporter-<hash>.js   # tiene que ser IDENTICO

# 3. y subir tambien main, que es OTRA cosa que el deploy
git push hekatan-struct main
```

⚠️ **`gh-pages` NO sube `main`.** El 2026-08-18 `main` llevaba **35 commits sin
subir** mientras el deploy iba al día: el sitio público estaba nuevo y el código
de GitHub viejo.

⚠️ **`raw.githubusercontent.com` cachea ~5 min**, así que después de un push
devuelve el README viejo y parece que no subió. Para comprobar de verdad:
`curl -s https://api.github.com/repos/GiorgioBurbanelli89/hekatan-struct-lineal/commits/main`
y comparar el SHA con `git log -1`.

`vite.config.ts` tiene un workaround para `DEPLOY_BASE` en Git-Bash de Windows:
```ts
base: (() => {
  let b = process.env.DEPLOY_BASE || "./";
  b = b.replace(/^[A-Z]:\/Program Files\/Git/i, "");  // fix MSYS path mangling
  b = b.replace(/^\/\//, "/");
  return b || "./";
})()
```

## Compilar C++ nativo / WASM

```bash
# Nativo (validación)
g++ -O2 -std=c++17 -static-libgcc -static-libstdc++ \
  -I hekatan-fem/src/cpp/eigen -I hekatan-fem/src/cpp \
  cli_modal_native.cpp hekatan-fem/src/cpp/utils/*.cpp \
  -o cli_modal_native.exe

# WASM (requiere emsdk)
source /c/Users/j-b-j/emsdk/emsdk_env.sh
# Script de build en hekatan-fem/ — deform.cpp + utils/* → built/deform.{wasm,js}
```

## Cómo agregar un ejemplo nuevo

1. Crear `examples/src/<id>/<name>.ts` exportando `ExampleDef`
2. Crear `examples/src/<id>/main.ts`:
   ```ts
   import { <name> } from "./<name>";
   import { runExampleStandalone } from "../workspace/runExampleStandalone";
   runExampleStandalone(<name>);
   ```
3. Crear `examples/src/<id>/index.html` (wrapper mínimo)
4. Registrar en `examples/src/workspace/exampleRegistry.ts`:
   ```ts
   import { <name> } from "../<id>/<name>";
   export const examplesRegistry: ExampleDef[] = [..., <name>];
   ```
5. Agregar entry en `examples/vite.config.ts`:
   ```ts
   "<id>": "src/<id>/index.html",
   ```

## Git remotes

```
hekatan-struct-lineal  https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git  (MAIN)
  main       ← source
  gh-pages   ← bundle compilado (deploy)
```

Otra compu:
```bash
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal && npm install && npm run dev:examples
```

## Las 8 plantillas contra ETABS, capa por capa

`examples/src/plantillas/plantillas.ts` no es un ejemplo: es un ExampleDef con
un parámetro `tipo` que monta OCHO tipologías. Por eso `comparar_e2k_etabs.mjs`
no le servía — saca el id del NOMBRE del fichero y reconstruye con los
parámetros por defecto, así que las ocho le salían la misma.

```bash
# 1. exportar las 8 (.e2k + .s2k del mismo modelo, en la misma llamada)
for t in 0 1 2 3 4 5 6 7; do node cli/exportar_csi.mjs plantillas out/P$t tipo=$t; done
# 2. el lado de Hekatan
node cli/plantillas_hekatan.mjs
# 3. el lado de ETABS 22 (una sola pasada: abrir ETABS es lo caro). Anula los brazos
#    rigidos automaticos (RZ=0, invisibles en el e2k): sin eso ETABS pesa 5 % menos
#    las vigas y los porticos sin losa salen +2.5 % en periodo
python cli/plantillas_etabs.py
# 4. el careo -> validation/modelos/plantillas/COMPARACION.md
node cli/plantillas_vs_csi.mjs
```

**Las capas, y el orden importa** — cada una solo tiene sentido si la anterior
cuadra: modelo → propiedad de cáscara → **masa** → estático → modos → fuerzas.
La masa va ANTES que los modos: el periodo va con la raíz de la masa, así que
con masas distintas los periodos TIENEN que salir distintos y compararlos no
informa de nada.

⚠️ **Nunca comparar T1 con T1.** Un pórtico plano tiene su primer modo FUERA del
plano (ETABS: modo 1 = 77 % UY). Se emparejan por **participación de masa**
(coseno del vector `[UX UY UZ RX RY RZ]` > 0.7) y, entre los candidatos, por el
PERIODO más cercano (a más del doble no es el mismo modo): dos modos altos con
20 % en RZ y nada más tienen coseno 1.000 y estaban a 300 % de periodo.

⚠️ **Las columnas van PISO A PISO en el `.e2k`** (desde el 3-sep-2026):
`LINE "C1" COLUMN "1" "1" 1` una vez y un `LINEASSIGN` por planta, como lo
escribe ETABS. Antes salía UN objeto de 4 plantas (salto 4) y ETABS con
`LUMPATSTORIES` reparte la masa del OBJETO a sus dos extremos: los pisos
intermedios se quedaban sin masa (rejilla: 3 modos, T1 1.134 contra 0.812; con
el arreglo 0.8116 = 0.8116). El estático no lo notaba porque ETABS sí parte el
objeto en los niveles para la rigidez. Ojo al leer estaciones: ETABS **repite**
la estación donde acaba un elemento y empieza el siguiente (`…3.5, 3.5…`).

⚠️ **El diafragma D1 va en TODAS las plantas de cada columna**, no solo en la
de arriba: con D1 solo en la azotea el dual con muros daba −16 % en los modos
7-8. Y ETABS pone D1 solo en los POINT (ejes de columna), no en los nudos de la
malla de la losa: `diafragma=1` de las plantillas hace lo mismo.

## El colormap de cáscara: 17 campos y una barra

`node cli/shot_plantillas_colormap.mjs [campo ...]` captura los 17 campos ×
las 4 plantillas con área, y anota el rango de la barra. **Hay que MIRAR los
PNG**: un colormap roto no se ve en ningún JSON — los números salen bien igual.

Tres trampas, las tres pagadas el 2026-08-27:

- **`s.shellResults = "bendingXX"` no hace nada.** Cada ajuste del viewer es un
  `State` de van.js: va `.val`. Asignando el string se REEMPLAZA el State, la
  reactividad se rompe y la vista se queda como estaba, sin error. Salieron
  tres capturas «de tres campos» que eran la misma imagen. Hay gancho:
  `window.__hekatanSettings()`.
- **Contar colores del canvas no mide nada.** Un canvas WebGL sin
  `preserveDrawingBuffer` sale NEGRO al copiarlo con `drawImage`: el conteo daba
  `1` pasara lo que pasara.
- **`elementFromPoint` no dice si la barra está tapada.** `#legend` lleva
  `pointer-events: none`, así que devuelve SIEMPRE lo de debajo. Se cruzan los
  **rectángulos** contra `#parameters`/`#settings` y sus z-index.

`FMax/FMin`, `MMax/MMin` y `VMax` son **derivados** (círculo de Mohr) de los
tres campos de su familia, calculados en `getViewer.ts` sobre los valores ya
repartidos a nudos — no en `analyze()`: son función puntual de los otros tres y
meterlos en el WASM sería mantener tres mapas más sin añadir un dato nuevo.

## Gotchas

- **NO usar `tasklist` sin `| head`** — output enorme, crashea
- El WASM compilado está **versionado en git** (`hekatan-fem/src/cpp/built/deform.*`). No necesitas emsdk para desarrollo, sólo para modificar C++
- `activeExampleVersion` invalida van.derive stale al cambiar de ejemplo — NO remover
- `colorMapRanges` es por-campo (`{ pressure: [min,max] }`), no global — otros shell results mantienen auto-escala
- `deformScale` se auto-computa en cada `loadExample`/`rebuild` — el usuario puede sobreescribir desde el slider pero se pierde al siguiente rebuild
- Git-Bash de Windows convierte `/hekatan-struct-lineal/` a ruta absoluta Windows — usar `MSYS_NO_PATHCONV=1` al build
- El servidor dev corre en **localhost:4600** (no 4640 como el awatif original)

## Edificio aporticado: losa COSIDA a las vigas y muros de CÁSCARA (2-sep-2026)

Dos cosas que `edificioAporticado.build()` no hacía y que heredan `edificio-dual`,
`edificio-con-muros`, `edif-acero`, `edificio-ladera`…:

- **La losa no tocaba la viga más que en las esquinas.** Los nudos del borde del
  paño se creaban sin partir la viga que pasa por ahí (`Div. vigas = 1`). Ahora
  cada nudo de borde llama a `partirBarrasEn` — lo que ETABS hace al mallar la
  línea con el área — y el trozo nuevo hereda el piso (`elementFloor`).
- **"Muros" eran diagonales** (`bracesMode = 1`): 0 elementos de muro, nada que
  pintar en el colormap. Ahora `murosMode` (ninguno / X / Y / X e Y) + `tMuro`
  monta muros Q4 de hormigón en el primer vano de las dos fachadas, de la base a
  la cubierta, malla = `slabDisc`, nV múltiplo de `Div. columnas`, base apoyada.

Medirlo sin navegador: `node cli/_medir_muros.mjs edificio-dual` (muros/losas,
rangos por campo, nudos SIN coser, NaN). Verlo: `node cli/shot_muros.mjs
edificio-dual` → `cli/shots/muros/` (iso + dos alzados × 6 campos). Con F11/M11
un muro sale casi uniforme: para verlo, F22 / FMin / von Mises.

## Columna CFT: Section Designer en SAP2000, Filled Steel Tube en ETABS (2-sep-2026)

SAP2000 24 **no tiene** sección paramétrica de tubo relleno (leído del binario: el
enum `FilledTube` de la OAPI es compartido con ETABS y no prueba nada). Se hace en
Section Designer, y SAP **recalcula** A, I, As y J de las formas: ignora los que
lleve la fila `SD Section` del s2k. ETABS sí la tiene ("Filled Steel Tube") y usa
los mismos números (0.004 % entre los dos). Medido por OAPI, columna 300×300×10:

```
A, I  = transformadas al acero (exactas)
As    = Timoshenko sobre la sección transformada: I²/∫Q²/w   (SAP 0.015443, ETABS 0.015399, Hekatan 0.015365)
J     = Saint-Venant del compuesto (Prandtl con G a trozos)   (SAP 3.802e-4, ETABS 3.795e-4, Hekatan 3.794e-4)
```
Ni 5/6·A, ni 2th + n·5/6·Ac, ni Bredt del tubo solo: con esos la columna daba 2.034 mm
contra 2.009 de CSI. Con `cft` da 2.0094 (0.006 % SAP, 0.003 % ETABS).

- `.heks`: `cft ID b h t Ec [nuC]` — `cadSections.cftSectionEc` (TS) y `cft.py` (Python),
  mismos dígitos. `torsionCompuestaRect` es Cholesky en banda (el SOR no converge con
  el contraste de 7×) y malla la pared en celdas ENTERAS (si no, J cae un 20 %).
- `.s2k`: `Shape="SD Section"` + `SECTION DESIGNER PROPERTIES 01/09/12/30`; el relleno
  lleva rho = n·rho_acero para que la masa por metro coincida. SAP2000 lee ese s2k y
  da exactamente su SD (`galpon-bodega-electoral/sap_cft_hekatan_s2k.py`).
- `.e2k`: `SHAPE "Filled Steel Tube" D B TF TW FILLMATERIAL`. El importador la tenía
  como rectángulo MACIZO de acero (A = D·B) y no escalaba `h` de mm a m: arreglados.
- Test `node tests/run.mjs cft` (19 filas) y `pytest tests/test_cft.py`.

### CFT circular y el defecto de `etabsjoint` (3-sep-2026)

- **`etabsjoint` va ENCENDIDO por defecto** (decisión de Jorge): Hekatan reproduce a ETABS
  tal cual; `etabsjoint 0` es el modo SAP2000. Vale para TS, WASM (deform y modal) y Python.
- **`cftc ID D t Ec [nuC]`**: tubo redondo relleno. A e I exactas, As Timoshenko, J = Js +
  (Gc/Gs)·Jc. Al s2k va como SD (`SHAPE PIPE` + `SHAPE SOLID CIRCLE`), al e2k como
  `Filled Steel Pipe D T FILLMATERIAL`. ⚠️ SAP2000 y ETABS **poligonizan el círculo**
  (~48 y ~32 lados): su A queda 0.3 / 0.6 % por debajo y sus flechas 0.4 / 1.3 % por
  encima de Hekatan. Los dos leen los ficheros de Hekatan y dan exactamente lo suyo.
- Test `node tests/run.mjs cftc` (11 filas) y `pytest tests/test_cft.py`.

### `deck etabs`: el deck como lo entiende ETABS (4-sep-2026)

Con la MISMA malla, ETABS y SAP2000 daban distinto en el galpón (4.5 %) y en un mezanine
(Dead 75 %). No era el elemento membrana ni la malla: ETABS **conecta el paño de piso a todo
nudo que toca** (edge constraint en los inclinados, cookie-cut en la viga que cruza un piso
horizontal) y **lleva el peso de la membrana a las vigas de borde por área tributaria**.
SAP2000 y Hekatan solo conectan los 4 nudos y pesan en las 4 esquinas.

- `deck etabs` en el `.heks` (TS `aplicarDeckEtabs` en cliModeler.ts y Python
  `deck_etabs.py`, iguales a 1e-11): parte los paños MEMBRANA (`shellmod … 0 0 0 …`) en las
  posiciones comunes a dos bordes opuestos (sin inventar nudos) y manda su peso propio y su
  `areaload` a las barras de borde como vector consistente de Hermite (tributario por
  bisectrices, muestreo 200×200). Sin la directiva = SAP2000.
- Medido (test `deck-edge-constraint-vs-csi`, 31 filas, `validation/modelos/deck-edge`):
  galpón partido ETABS 2e-5 %; mezanines 1×1 → 3×2 de 3 pisos, Dead/SCM/Viva/Ex a 1e-9 %;
  SAP2000 = Hekatan sin directiva (1e-13). En el driver OAPI `--noedge` apaga el edge
  constraint de ETABS y da lo mismo que SAP.
- El peso propio de barra ya es CONSISTENTE (fuerzas + momentos wL²/12): SAP Dead = Hekatan
  0.0000 %. Y ETABS no pesa sus end offsets automáticos: el driver los anula.
- `deck etabs oneway`: reparto en UN sentido (el `ONEWAYLOADDIST` de ETABS). Vano = eje local 1
  del paño (borde 0→1 girado `shellang`); la carga va solo a los dos bordes de apoyo. Rectángulo:
  q·a·b/2 a cada apoyo (`pytest tests/test_deck_etabs.py`). TS = Python a 3e-12. **Arbitrado
  con ETABS por e2k** (5-sep-2026, `validation/modelos/deck-edge/oneway`): losa membrana 65 mm
  con `ANG 90` y `ONEWAYLOADDIST "Yes"` = `deck etabs oneway` a **0.0010 %**; con `"No"` =
  `deck etabs` a 0.0010 %; cruzados 0.22 %. El `PROPTYPE "Deck"` de ETABS es one-way de fábrica
  (0.11 %, su membrana sale de la geometría del deck).
- `tests/datos/galpon_lc.heks` lleva `deck etabs` desde el 5-sep: su referencia SAP2000 es la
  de la malla partida (3e-4 %) y también se compara con ETABS `--noedge` (2e-5 %).
- Plantillas (`edificioAporticado` y herederas, `plantillas`): parámetro **Comparar con**
  (ETABS / SAP2000) → `etabsWallJoint`. Sus losas son placas, no deck: el `deck etabs` no aplica.
- `csi_desde_dump.py sap … --sapdeck [oneway|twoway]` (6-sep-2026): SAP2000 con SUS herramientas hace lo
  que ETABS hace de fábrica: auto-mesh cookie-cut (MeshType 4) en las líneas que cruzan el paño +
  `SetLoadUniformToFrame` (tributaria). Medido en `validation/modelos/deck-edge/mez_undeck` (5 viguetas
  por el lado corto, un paño de 4 nudos, 60 kN): two-way = ETABS = Hekatan `deck etabs` (1.8/0.9/0.5
  kN/m, flechas 1.2e-3 %); one-way (2.0/1.0/0) = `deck etabs oneway`. Sin `--sapdeck`, SAP manda los
  60 kN a las 4 esquinas = Hekatan sin directiva. Sintaxis `.heks`: `shell id n1..n4 t E nu rho` (t primero).
- `csi_desde_dump.py … --watchdog N`: relanza el driver si SAP2000 se cuelga (15 min, mata el
  proceso y reintenta N veces). `--arealoads Live=sinDir.json:conDir.json`: CSI recibe la carga
  de ÁREA (SetLoadUniform) y hace su transferencia; se compara con Hekatan `deck etabs`.
- `npm run build` necesita heap: `.npmrc` lleva `node-options=--max-old-space-size=8192` (sin
  eso vite casca con 0xC0000005 al renderizar chunks y deja `website/` vacío).

### Sólidos en el `.heks` (3-sep-2026)

`hex ID n1..n8 [E nu rho]` + `incompatible 0/1`. Un modelo de SOLO sólidos va por `hex8Solve`
(da tensiones y von Mises por elemento); Python con `elements/hex8.py` (espejo exacto del WASM).
El s2k sale con `CONNECTIVITY - SOLID`. Test `node tests/run.mjs solidos-heks` (5 filas) y
`pytest tests/test_solidos.py`.

**Mezclados con barras y cáscaras** (3-sep-2026): el H8 vive en `utils/hex8Stiffness.h`
(header-only; misma formulación que hex8_wasm.cpp) y lo ensambla `getGlobalStiffnessMatrix`,
el ensamblador común de `deform` y del modal: 3 gdl por nudo dentro de la K de 6, y los giros
de un nudo que solo toca sólidos los saca `getZerosIndices`. `solidIncompatible` viaja en
ElementInputs (parámetro nuevo de `deform()`). La masa del H8 en el modal es ρ·V a partes
iguales en los 8 nudos (C++ y Python). Medido: pedestal en 8 H8 + muro Q4 Thin + columna y
viga de acero (`tests/datos/mixto_solido_muro_columna.heks`) contra SAP2000 24 con los
mismos nudos: WASM = Python a 8e-12 %, **peor nudo 1e-12 % del máximo**; modal (6 modos,
masa ρ·V/8 por nudo) WASM = Python a 3e-7 % y vs SAP2000 a 2e-10 %. (El 0.0065 % que se midió
primero era un bug del script de SAP: propiedad de sólido inexistente → hormigón por defecto.)
Placa Q4 tumbada sobre un bloque de sólidos (25 nudos compartidos): 8e-14 %. Las tensiones de
los H8 mezclados las da `hex8Stress` (h8.ts → `_hex8_stress`, la misma recuperación de
hex8Solve) y cliModeler las deja en `analyzeOutputs.solidStress/solidVonMises`. Test
`node tests/run.mjs solidos-mixtos` (8 filas). ⚠️ Un muro o una columna apoyados SOLO en
nudos de sólido son un mecanismo (esos nudos no tienen giro): en SAP2000 también, y se cuelga.

### Diafragma rígido / flexible (3-sep-2026)

`diaph ID grupo` en el `.heks` (`nodeInputs.diaphragms`). Rígido = ux, uy, rz atados a un
maestro VIRTUAL en el centro (`utils/rigidDiaphragm.h`; en el modal, en el centro de MASA);
flexible = sin `diaph`. ⚠️ Con un nudo real de esquina como maestro el modal perdía el
acoplamiento ux–rz (solo mira la diagonal de M) y T_x salía ×1.84. `deform.cpp` no lo tenía.
Plantillas: `diafragma` (0 flexible · **1** solo nudos en eje de columna, como ETABS [defecto] ·
2 rígido total · 3 total sin muros). Test `node tests/run.mjs diafragma`. Con D1 por planta,
columnas piso a piso y los brazos rígidos automáticos de ETABS ANULADOS en el batch
(`plantillas_etabs.py`: ETABS no pesa el tramo de viga dentro de la columna, 3.5 t por planta
en el pórtico 3D), las 8 plantillas vs ETABS 22: **masa total 0.000 % y modos 1-3 a
0.00–0.01 % en las ocho** (3-sep-2026).

### Modelos grandes (3-sep-2026)

`deform.cpp` pasa a gradiente conjugado con Cholesky incompleta (tol 1e-12) a partir de
150 000 GDL (medido: 164k GDL en 7.4 s y 561 MB); por debajo, LDLT como siempre.

## Los TRES ficheros de CSI desde el mismo `.heks` (5-sep-2026)

`node cli/heks_a_csi.mjs modelo.heks salida` escribe `salida.e2k` (ETABS), `salida.s2k`
(SAP2000) y `salida.f2k` (SAFE) del MISMO modelo, muelles nodales incluidos. Arbitrado con
la cimentación real (`tests/datos/cimentacion_9zapatas.heks`: 9 zapatas Thick 4×4, 9
pedestales, 12 vigas de amarre, 225 muelles): SAP2000 1.2e-8 %, ETABS 1.4e-8 %, SAFE 1.5e-3 %
(su resolución de impresión). Test `node tests/run.mjs cimentacion-vs-csi` (14 filas).

- e2k: `$ POINT SPRING PROPERTIES` + `SPRINGPROP` en el `POINTASSIGN` (N/mm: kN/m es el
  mismo número). s2k: `JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED` (columnas leídas de SAP2000
  por OAPI). Los parsers los devuelven a `nodeInputs.springs`; `deform` los recibe APARTE
  (5º argumento), no dentro de `nodeInputs`.
- `STORY "Base" ELEV` va en mm como HEIGHT: en metros ETABS subía las cotas 0.4995 m.
- f2k (`examples/src/shared/f2kExporter.ts`): SAFE no abre un `.f2k` (`OpenFile` deja el
  modelo vacío); se importa por tablas con `csi-cli/safe-cli/cli/csi_cli.py --engine safe
  --open modelo.f2k`. Cuatro leyes MEDIDAS (20 importaciones): ① una tabla `COLUMN OBJECT
  CONNECTIVITY` borra losas y vigas sin una línea de log → las verticales van como BEAM;
  ② los campos van por NOMBRE (`"Stiffness UZ"`, `"Rigid Factor"`), con la clave SAFE calla
  y deja su defecto (200 kN/m en los 9 muelles); ③ una sección de hormigón sin
  `"Longitudinal Rebar Material"` válido se rechaza entera; ④ SAFE analiza las vigas con
  **0.1·J** (Hekatan con J×0.1 reproduce sus giros a 4 cifras) → `jFactor` = 10 por defecto.
  Nombres de campo: `DatabaseTables.GetAllFieldsInTable` (clave, nombre, unidades).
- **`torsion safe`** en el `.heks` (TS y Python): la J de todas las barras ×0.1, o sea la
  semántica de SAFE con nombre (como `deck etabs`). `torsion <f>` acepta otro factor. Test
  `node tests/run.mjs torsion-safe`: Hekatan con la directiva = SAFE leyendo el f2k con J
  tal cual (Uz 3e-3 %, giros 0.1 %); sin ella, el giro de la viga es UN TERCIO del de SAFE.
- **Vigas secundarias por el LADO CORTO de cada vano** (`vSecDir = Auto`, defecto desde el
  5-sep-2026): es la regla de la losa en una dirección. Antes la dirección era una para
  todo el edificio (X): con vanos 6×5 las secundarias salían de 6 m. Cada vano decide solo
  (svX ≤ svY → corren en X). `node tests/run.mjs vigas-secundarias` (vanos desiguales incluidos).

## Galpón real y mezanine CFT contra SAP2000 y ETABS por OAPI (3-sep-2026)

`galpon-bodega-electoral/csi_desde_dump.py sap|etabs dump.json out.json [--membrana|--wall|--nomesh]`
arma CUALQUIER modelo de Hekatan en SAP2000 o ETABS con la misma malla y las mismas cargas
nodales (barras General con I33/I22/As2/As3, `ang`, releases; cáscaras con los 8 modificadores;
diafragmas; muelles). El volcado sale de `tests/lib/dump_heks.mjs` (un .heks) o de
`cli/dump_ejemplo.mjs <id> out.json [k=v]` (un ejemplo del registry). `cli/ejemplo_vs_csi.mjs`
compara un ejemplo con el JSON de `plantillas_etabs.py` / `plantillas_sap2000.py` (que ahora
también escribe `disp_nudos`).

- **Galpón (609 nudos, 1140 barras con `ang`, 116 shells de deck): SAP2000 = Hekatan a 0.001 %**
  (test `galpon-vs-sap2000-oapi`). Solo barras en ETABS: 0.000 %. Con el deck, ETABS se va
  4.5–5.6 % y NO es la malla: con `OBJMESHTYPE "NONE"` (`cli/heks_a_csi.mjs … meshtype=NONE`)
  deja los 609 joints exactos y sigue en 4.4 %. Caso mínimo (1 paño membrana sobre 4 vigas):
  ETABS Membrane = Hekatan 0.000 %, thick + modificadores 0.24 %, paño inclinado 0.027 %.
  **CERRADO el 4-sep-2026**: era el edge constraint de ETABS (+ cookie-cut en pisos
  horizontales), no la malla ni el elemento — ver `deck etabs` más arriba. `--noedge` en el
  driver lo apaga y ETABS = SAP = Hekatan; `--pat Nombre=dump.json` arma patrones separados
  (Dead = peso propio de CSI, SCM, Live, Ex); los end offsets automáticos de ETABS se anulan.
- **Mezanine con columna CFT** (`matCol = 2`, `tCft`): e2k → ETABS `Filled Steel Tube`; s2k →
  Section Designer (defecto) o `cftAs: "general"` (panel SAP «CFT en SAP», CLI `cftas=general`).
  **SAP2000 General = Hekatan 0.0000 %** (2415/2415 componentes), Section Designer 0.0095 %
  (SAP recalcula las propiedades de las formas), **ETABS 0.0008 %**. Test `mezanine-cft-vs-csi`.
  El 0.38 % que salía antes era de Hekatan: la losa no se cosía a las vigas SECUNDARIAS
  (solo al borde del paño); ahora `partirBarrasEn` actúa en todos los nudos de losa.
- El **.s2k lleva el diafragma** (`CONSTRAINT DEFINITIONS - DIAPHRAGM`): sin él el mezanine
  salía 1 % más rígido en Hekatan. Y el e2k pone D1 SOLO si el modelo trae diafragmas.
- `edificioAporticado`: diafragma rígido por planta en los ejes de columna cuando hay losa
  (como ETABS) y `slabForm` Thin por defecto (Thick opcional).

⚠️ OAPI: `AddByPoint` devuelve tupla (usar el UserName); ETABS ata con `Diaphragm.SetDiaphragm`
+ `PointObj.SetDiaphragm(n, 3, "D1")`, SAP con `ConstraintDef.SetDiaphragm` + `PointObj.SetConstraint`;
600–800 nudos tardan 5–6 min por programa; los prints de Python se pierden con la salida
redirigida (el resultado va al JSON). Si SAP2000 «no vuelve», es un diálogo: `taskkill //F //IM SAP2000.exe`.
