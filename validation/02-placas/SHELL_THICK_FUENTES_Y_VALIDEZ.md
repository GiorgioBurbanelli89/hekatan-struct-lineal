# El Shell-Thick de Hekatan: de dónde sale cada pieza y qué lo valida sin ETABS

**8-sep-2026.** Pregunta de Jorge: la formulación de la placa gruesa se extrajo del binario de
ETABS; ETABS la usa, pero ¿quién garantiza que está bien? Puede llevar un error de años. Un
número que sale del binario es una **medida**, no un **fundamento**. Este documento separa las
dos cosas: qué pieza está publicada y dónde, qué pieza solo está medida, y qué pruebas
independientes de CSI pasa el elemento entero.

Lo mismo para la delgada: el Shell-Thin es el **DKQ de Batoz & Tahar (1982)**, publicado entero,
y también pasa las pruebas de abajo.

## 1 · Las piezas del Shell-Thick (`getBendingK_CSI`, `shellQ4.cpp`) y su fuente

| pieza | qué es | fuente publicada | cómo se comprobó |
|---|---|---|---|
| giros con 9 funciones: 4 bilineales + 4 jerárquicas de lado + burbuja, 2 componentes cada una; `w` bilineal | interpolación enriquecida del giro (22 gdl, 10 internos condensados) | **Wilson, cap. 8** (DSE: giros jerárquicos de lado `Δψ`, condensados); **Ibrahimbegović 1993**, CMAME 110, §3.2 (PQ3 = DSE, comprobado numéricamente: mismo espectro) | `registros/libros/wilson_cap8_DSE/`, `registros/ibrahimbegovic_1993/`, `dse-de-wilson/README.md` |
| curvaturas `κx = θy,x  κy = −θx,y  κxy = θy,y − θx,x` | Reissner–Mindlin estándar | cualquier texto (Hughes 1987; Wilson cap. 8 ec. 8.3) | — |
| 4 cortantes **de lado** `(w_j−w_i)/L − (sa/2)(θx_i+θx_j) + (ca/2)(θy_i+θy_j) ∓ (2/3)·Δψ_k` | cortante discreto a lo largo de cada lado, con el 2/3 del modo jerárquico | **Wilson cap. 8, ec. (8.7)** | binario: `monta_B` medido, 0.0000 % en cuadrado y trapecio |
| campo de cortante covariante desde los 4 lados, **parte lineal simetrizada** `m = (b+d)/2` | tipo MITC (Bathe–Dvorkin 1985) pero con `b` y `d` promediados | MITC: **Bathe & Dvorkin 1985**, IJNME 21. La **simetrización NO está publicada**: es lo que hace el kernel | binario: 16/16 columnas de B al 0.0000 % (`etabs_thick_B.py`) |
| penalización `1000·(D11+D22+D33)·∫(div θ)² dA` | estabiliza el mecanismo `φ` (θ = (x−xc, y−yc)) que crea la simetrización | **NO publicada**. Es del kernel (`0x18097c735`, `c = 1000·(…)`, verificado a 2e-14 %) | binario + rango (abajo): sin ella hay 4 modos nulos, con ella 3 |
| cuadratura de 8 puntos (9/49, 40/49; `±√(7/9)`, `±√(7/15)`) | regla que muestrea cerca de los puntos óptimos de tensión | **Ibrahimbegović, Taylor & Wilson 1991**, Comm. Appl. Num. Meth. 7 («A special eight-point quadrature…», §4); también en Ibrahimbegović 1990, FEAD 7 | — |
| B-barra: a las 10 columnas internas se les resta su media pesada de curvatura | modos incompatibles que pasan el patch test (Taylor–Beresford–Wilson / Simo–Rifai) | **ITW 1991**, apéndice, ec. (96); **Ibrahimbegović & Wilson 1991** (modified incompatible modes) | patch test (abajo) |
| condensación estática de los 10 internos, saltando pivotes nulos | Guyan / eliminación de Gauss | Wilson cap. 8 (los `Δψ` se condensan) | binario: `Schur(K22)` = K medida a 2e-15 |
| `κ = 5/6` en `Ds` | factor de corrección de cortante | Reissner 1945 | — |

**Lo que está medido y no publicado son dos cosas**: la simetrización del cortante y la
penalización de la divergencia. Las dos van juntas: la simetrización deja un mecanismo y la
penalización lo estabiliza. No se pueden defender citando a nadie; se defienden con las
pruebas del apartado 3, que no dependen de ETABS.

## 2 · Lo que ETABS/SAP2000 dan (medida, no fundamento)

| | resultado |
|---|---|
| K de la celda, ~140 geometrías (cuadrado, rectángulo, 27 trapecios, irregulares, barridos de t/ν/L y modificadores) | 1e-12 % contra la K medida en vivo |
| placa 4×4, 8×8, t = 0.20, q = −10, contra SAP2000 24 (`.s2k`, misma malla) | flecha 0.000 %; **fuerzas M11/M22/M12 joint a joint 0.026 %** (256 joints), centro 7.4170 vs 7.4169 |
| losa plana de edificio (`plantillas` tipo 4, `formLosa=41` gruesa) contra SAP2000 y ETABS | joints 0.075 %, centroides 0.048 %, nudos 0.038 % (3600 joints) — SAP y ETABS dan lo mismo entre sí |
| edge constraint, muelles, uniones | ver `validation/modelos/vs_muros/COMPARACION_VS_MUROS.md` |

Y la delgada (DKQ), `plantillas` 2/4/5/6 contra ETABS 22: **0.0000 %** joint a joint en las
cuatro (3600–3760 joints cada una); contra SAP2000, 0.5–0.9 %, que es lo que SAP y ETABS
difieren entre sí (`cli/_sap_vs_etabs_shells.mjs`).

## 3 · Lo que vale sin ETABS: las pruebas clásicas de un elemento de placa

`node --experimental-strip-types validation/02-placas/shell_thick_validez.mjs` y
`node validation/02-placas/shell_thick_convergencia.mjs` (8-sep-2026):

**a) Rango.** La K 12×12 condensada tiene exactamente **3 autovalores nulos** (los tres sólidos
rígidos w, θx, θy) en cuadrado, rectángulo, paralelogramo, trapecio e irregular. Sin la
penalización serían 4: el cuarto es el mecanismo `φ`. Es la prueba de que la penalización hace
lo que tiene que hacer y nada más (no toca los otros modos: la K con ella clava la de CSI).

**b) Patch test de curvatura constante** (MacNeal–Harder: parche de 4 cuadriláteros
distorsionados alrededor de un nudo interior desplazado, `w = ½κx x² + ½κy y² + κxy xy`
impuesto en los nudos, las tres curvaturas a la vez). Cada elemento devuelve **M = D·κ exacto
en sus 4 esquinas**: peor error **6.9e-11 %** (Shell-Thick) y **6.6e-13 %** (DKQ). Los modos
incompatibles con B-barra y la condensación no rompen el estado constante.

**c) Convergencia a la solución exacta de Reissner–Mindlin** (placa cuadrada 4 m, apoyo
duro, carga uniforme, serie de Navier con el término de cortante `1 + Dπ²k/(κGt)`; M igual
que Kirchhoff en apoyo duro). Flecha en el centro y M11 en el nudo central (media de los
joints de las 4 cáscaras, como lo lista CSI):

| malla | gruesa t/L = 0.1: w | M11 | delgada t/L = 0.01: w | M11 |
|---|---|---|---|---|
| 4×4 | 2.70 % | 12.8 % | −4.49 % | −1.79 % |
| 8×8 | 1.41 % | 4.18 % | −0.12 % | 2.17 % |
| 16×16 | 0.44 % | 1.11 % | 0.18 % | 0.90 % |
| 32×32 | **0.12 %** | **0.29 %** | **0.065 %** | **0.24 %** |

Converge monótonamente en los dos espesores y **no bloquea** en la delgada (t/L = 0.01: el
MITC4/T1 sin corrección tampoco bloquea, pero un Q4 con cortante pleno estaría en −90 %). Con
apoyo blando (solo w = 0) la gruesa queda un 4 % por encima de la serie a 32×32: es la capa
límite de Reissner–Mindlin (la serie es de apoyo duro), no el elemento — se midió primero así
y por eso se dice aquí.

**d) Comparación con códigos independientes de CSI** (ya hecha antes de hoy, en
`dse-de-wilson/cuatro_motores.py`): OpenSees `ShellMITC4` / `ShellDKGQ` / `ShellNLDKGQ`
(`K_Shell*.txt`) y Abaqus (`abq_cmp.py`). El Shell-Thick de CSI no coincide con MITC4 (por
eso se buscó); coincide con Abaqus S4/S4R al nivel de convergencia de malla, no celda a celda,
porque son formulaciones distintas de la misma teoría.

## 4 · Lo que se puede decir con esto, y lo que no

- Se puede decir: el elemento **pasa el patch test, tiene el rango correcto y converge a la
  solución exacta de Reissner–Mindlin sin bloqueo**. Eso es lo que la literatura exige a un
  elemento de placa (Zienkiewicz–Taylor, cap. de placas; MacNeal–Harder 1985) y no depende de
  que ETABS esté bien o mal. Si ETABS tuviera un error de años en esta rutina, (b) o (c)
  habrían fallado.
- **No** se puede decir que la simetrización y la penalización sean "de Ibrahimbegović": no lo
  son. Son de CSI y están sin publicar; aquí quedan **medidas y justificadas por (a)–(c)**.
- Para un artículo: el aporte sería exactamente ese — «identificación de la formulación del
  Shell-Thick de SAP2000/ETABS por reconstrucción de la matriz de rigidez y verificación
  independiente». La parte publicada (DSE + 8 puntos + B-barra) se cita; la parte no publicada
  se presenta como resultado de la identificación con sus pruebas. El DKQ (Shell-Thin) no
  necesita artículo: es Batoz & Tahar 1982 tal cual, y cierra a 0.0000 %.

## 5 · Convención de giros (medida, porque costó)

Los giros del solver son de **mano derecha**: `θx = +∂w/∂y`, `θy = −∂w/∂x`. Con cualquiera de
las otras siete combinaciones (signos o ejes cambiados) el patch test se va a cientos de por
ciento; con esta, a 1e-11 %. Los momentos se reportan con el **signo de CSI** (M11 positivo =
tracción abajo), que es el opuesto al de la curvatura del solver: `analyze.ts` lo aplica
(`SIGNO_CSI`). En el apoyo duro de una placa, «pendiente tangencial nula» en el borde y = 0 es
`w,x = 0`, o sea **`ry = 0`** — fijar `rx` ahí es empotrar (w −65 %, medido).

## Ficheros

- `hekatan-fem/src/cpp/utils/shellQ4.cpp` → `getBendingK_CSI` (la K, WASM).
- `hekatan-fem/src/utils/csiThickJoints.ts` (momentos en los joints, internos recuperados) y
  `dkqJoints.ts` (DKQ en Gauss 2×2 extrapolado). `analyze.ts` los usa; salidas
  `bendingXXcentro/joint`.
- `validation/02-placas/shell_thick_validez.mjs`, `shell_thick_convergencia.mjs`.
- `cli/_joints_vs_csi.mjs`, `cli/_sap_vs_etabs_shells.mjs`, `cli/_placa_navier_vs_sap.mjs`.
- Papers: `registros/papers_shell_csi/` (Batoz 1982, ITW 1991, Ibrahimbegović 1990, Hughes 1981),
  `registros/ibrahimbegovic_1993/`, `registros/libros/wilson_cap8_DSE/`.
