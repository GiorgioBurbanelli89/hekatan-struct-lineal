# Algoritmos de shell/placa en Hekatan Struct — dónde está cada uno

Índice para leer el código (y para que un asistente, p. ej. Claude móvil, ubique rápido cada
formulación). Rutas relativas a la raíz del repo. Solo se citan formulaciones **publicadas**.

## Referencias

| Sigla | Referencia |
|---|---|
| **Batoz 1982** | Batoz, J.L. & Tahar, M.B. (1982). *Evaluation of a new quadrilateral thin plate bending element*. IJNME 18, 1655–1677. Origen de la **DKQ**. |
| **ITW 1990** | Ibrahimbegovic, A., Taylor, R.L. & Wilson, E.L. (1990). *A robust quadrilateral membrane finite element with drilling degrees of freedom*. IJNME 30, 445–457. Membrana con rotación «drilling» (θz). |
| **MITC4** | Bathe, K.J. & Dvorkin, E.N. (1985). *A four-node plate bending element based on Mindlin/Reissner plate theory and a mixed interpolation*. IJNME 21, 367–383. |
| **Wilson (libro)** | Wilson, E.L. *Análisis Estático y Dinámico de Estructuras* (Static and Dynamic Analysis of Structures). Cap. 8 (DSE), cap. 9 (membrana/drilling), cap. 10 (DKE, shells). |
| **Modos incompatibles** | Wilson, Taylor, Doherty & Ghaboussi (1973); Taylor, Beresford & Wilson (1976). |
| **DKMQ** | Katili (1993). |
| **CSI** | CSI Analysis Reference Manual §10.1 (qué llama CSI «Shell-Thin / Shell-Thick»). |

> **Regla de uso: las losas siempre van con Shell-Thin (DKE).** En `.heks`: `shelltype thin`. Shell-Thick (MITC4) queda para casos donde el cortante importa (placa gruesa) y se compara contra Thin como juez.

## Qué es cada sigla en el código

| Nombre | Qué es | Archivo | Función |
|---|---|---|---|
| **DKE** (= Shell-Thin de ETABS) | Placa de Kirchhoff discreta, de Batoz & Tahar (DKQ), con la Tn de Batoz `[w,bx,by]→[w,rx,ry]`. Membrana Q6 incompatible. | `cli/hekatan-fem/src/cpp/utils/shellThin.cpp` | `getBendingK_DKE`, `getMembraneK_Q6`, ensamblado en `getLocalStiffnessMatrixShellThin` |
| MZC (histórico) | Placa Kirchhoff MZC; **solo Q4 rectangular**. Queda en el archivo pero ya no lo llama el ensamblado de Thin. | `shellThin.cpp` | `getBendingK_MZC` |
| **MITC4 + modos de Wilson** (Shell-Thick) | Flexión Mindlin con cortante interpolado (Bathe-Dvorkin) más modos incompatibles de Wilson condensados. | `cli/hekatan-fem/src/cpp/utils/shellQ4.cpp` | `getBendingK` (variante A) |
| **DSE** híbrido (variante B) | Flexión DSE + cortante MITC4. | `shellQ4.cpp` | `getBendingK_DSE` |
| **DSE** completo de Wilson cap. 8 (variante C) | Cortante discreto por arista, tal como el libro. | `shellQ4.cpp` | `getBendingK_DSE_FULL` |
| Selector | `HK_BENDING_FORMULATION` = 0/1/2 (compilación). Ver nota abajo. | `shellQ4.cpp` ~l. 948 y ~l. 1023 | |
| **DKMQ** (Katili) | Q4 de placa gruesa/fina unificada. | `cli/hekatan-fem/src/cpp/utils/shellQ4_DKMQ.cpp`, `src/utils/shellQ4_DKMQ.ts`, `cli/hekatan-fem/DKMQ_USAGE.md` | |
| **ITW 1990** (membrana con drilling) | Interpolación de Allman + burbuja condensada, Gauss 3×3, penalización γ a 1 punto. Se elige con `elementInputs.drillingTypes`: **8 = ITW + proyección de FEAP/Taylor (defecto)**, 3 = ITW puro, 2 = Q4 modos incompatibles + Hughes-Brezzi, 1/0 = legacy. `drillingPenaltyScales` = γ/μ (defecto 0.4). | `cli/hekatan-fem/src/cpp/utils/shellQ4.cpp` (`getMembraneITW`, también usada por `shellThin.cpp`); Python `hekatan-struct-py/src/hekatan_struct/elements/membrane_itw.py` | |
| Hughes-Brezzi 1989 (drilling previo) | Variante `drillingTypes = 2`. | `cli/hekatan-fem/src/cpp/utils/drillingHughesBrezzi.cpp` | |
| Esfuerzos en joints (como CSI) | DKQ: B en Gauss 2×2 extrapolada a esquinas; MITC4 y ITW con su propia recuperación. No mezclar la recuperación de una formulación con la solución de otra. | `cli/hekatan-fem/src/utils/dkqJoints.ts`, `mitc4Joints.ts`, `itwJoints.ts` | |
| Selector por elemento | `plateFormulations[idx]`: 0 = Mindlin/Thick, 1 = Kirchhoff (Thin), 2 = DKMQ. | `cli/hekatan-fem/src/cpp/data-model.h` (~l. 46–58), `.../utils/getLocalStiffnessMatrix.cpp` (~l. 142) | |
| Recuperación de curvaturas DKQ-Batoz | Para esfuerzos de Shell-Thin. | `cli/hekatan-fem/src/analyze.ts` (~l. 327 y 489) | |
| Q4 de placa (Kirchhoff-Mindlin, integración reducida) | Elemento didáctico independiente. | `cli/hekatan-fem/src/cpp/plate_q4/kirchhoff_q4.h` | |

### Versión Python

- `hekatan-struct-py/src/hekatan_struct/elements/shell_thin.py` — Shell-Thin (DKE).
- `cli/hekatan-fem/compare_wilson_py_cpp.py`, `test_wilson_membrane.py` — comparación Wilson Python vs C++.
- `elements/plate_dke.py` — DKE de Batoz & Tahar usada por `heks.py` (`shelltype thin`); ver `CLAUDE.md`.

## Pruebas y validación

- **ITW 1990** (seis casos con drilling): `examples/src/itw/itwTests.ts`; script `tests/run.mjs itw` y `itw_seis_casos.mjs`.
  Antes de citar un número, **córrelo** (`node tests/run.mjs itw`); las cifras en prosa pueden estar desactualizadas.
- Mesa de torsión (Shell-Thin = DKE, < 1.5 % vs ETABS): `examples/src/mesa-torsion/mesaTorsion.ts`.
- Placa apoyada Thin/Thick vs ETABS, misma malla: ejemplo `placa-thick-thin-sano`.
- Validación general: `docs/VALIDATION.md`, `docs/VALIDATION_BENCHMARKS.md`, `ESTADO_VS_ETABS.md`.
- Artículo borrador del shell: `docs/articulo/ARTICULO_1_shell_csi_borrador.md`.

## Avisos (inconsistencias conocidas, para no repetirlas)

1. **Valor por defecto de la flexión Thick.** `CLAUDE.md` dice que el defecto es `HK_BENDING_FORMULATION = 3`,
   pero `shellQ4.cpp` define `0` por defecto y solo ramifica 0/1/2 (el `else` es MITC4 + α de Wilson). Verifica
   en el código antes de afirmar cuál se compila.
2. **Comentarios «MZC» desactualizados.** `data-model.h` y el encabezado de `shellThin.cpp` aún hablan de MZC;
   el ensamblado actual usa `getBendingK_DKE` (Batoz).
3. El déficit de membrana de ITW 1990 frente al paper sigue **abierto** (ver sección ITW en `CLAUDE.md`): no es
   bloqueo de membrana ni la placa (MITC4/DKE/DKMQ dan lo mismo ahí).

## Cómo leer esto desde Claude móvil

Proyecto de claude.ai → «Add content → GitHub» → este repo (`hekatan-struct-lineal`). Pídele que lea
primero este archivo y luego los de la tabla.
