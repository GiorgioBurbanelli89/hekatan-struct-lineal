# Shell-Thick con la formulación de placa gruesa de Wilson (cap. 8, DSE)

Rama `sin-binario`. Sin commit, sin deploy.
Orden: Shell-Thick debe usar el DSE de Wilson, no el MITC4 de Bathe-Dvorkin.

---

## 1) La duda del signo: RESUELTA — NO es un error

### La cita del libro

Wilson, *Análisis Estático y Dinámico de Estructuras*, cap. 8, pág. PDF 131,
**Ec. (8.6)** (extracto en `registros/asistente_extractos/wilson_placa_gruesa/wilson_cap8_ecuaciones.tex`):

$$\gamma_{ij}=\frac{1}{L}\,(u_{zj}-u_{zi})-\frac{1}{2}(\theta_i+\theta_j)-\frac{2}{3}\,\Delta\theta_{ij}$$

y la **Ec. (8.3)**, que dice cómo se reparte esa rotación jerárquica en x,y:

$$\Delta\theta_x=+\operatorname{sen}\alpha_{ij}\,\Delta\theta_{ij},\qquad
  \Delta\theta_y=-\cos\alpha_{ij}\,\Delta\theta_{ij}$$

### Lo que hace el código (`shellQ4.cpp:1250-1261` y `1379-1391`)

```
γ_e  = (1/L_e)(w_j − w_i) + (1/2)(θ_n_i + θ_n_j) + (2/3)·Δθ_e
Δθx  = −sen α_e · N_{e+5} · Δθ_e
Δθy  = +cos α_e · N_{e+5} · Δθ_e
```

### El porqué (y = m·x + b)

El código mide la rotación de lado a lo largo de **n̂ = (−sen α, +cos α)**.
Wilson la mide a lo largo de **(+sen α, −cos α)**, el vector opuesto.
O sea: **Δθ_e(código) = −Δθ_ij(Wilson)**. Es la MISMA rotación física, contada al revés.

- El término de Wilson `−(2/3)·Δθ_ij` se vuelve `+(2/3)·Δθ_e`. ✅ el `+` del código.
- El bloque de curvaturas `Bb_aa` lleva el mismo voltereta (los tres `−ca`, `−sa`).
- Los términos de θ nodal y de w **no** cambian: `+(1/2)(θ_n_i+θ_n_j)` con
  `θ_n = −sen α·θx + cos α·θy` es, letra por letra, la Ec. (8.7) de Wilson.

Y lo decisivo: **Δθ es un GDL interno que se condensa estáticamente** (Ec. 8.18-8.19).
En `Kb = Kuu − Kua·Kaa⁻¹·Kau`, si Δθ cambia de signo entonces `Kua` cambia de signo
**dos veces** (una en `Kua`, otra en `Kau`) y `Kaa` no cambia → **Kb es idéntica**.

### Prueba numérica (no de memoria)

`scratchpad/signo/`: tres copias de `shellQ4.cpp` compiladas en paralelo con g++,
cuadrilátero **distorsionado** (0,0)(2.3,0.2)(2.9,1.8)(0.4,2.1), E=2.1e11, ν=0.3:

| variante | qué cambia | ‖K−K0‖/‖K0‖ t=0.05 | t=0.20 | t=1.00 |
|---|---|---|---|---|
| V0 | código de hoy (`+2/3`) | — | — | — |
| V1 | convención LITERAL de Wilson (`−2/3` **y** `Bb_aa` volteado) | **0.000e+00** | **0.000e+00** | **0.000e+00** |
| V2 | voltear SOLO el `2/3` (el "arreglo" ingenuo) | 1.710e-01 | 1.723e-01 | 1.865e-01 |

✅ **V1 == V0 bit a bit** → el código YA es la Ec. (8.6) de Wilson, sólo con el
signo de un GDL interno al revés.
❌ **V2 rompe el elemento un 17-19 %** → "corregir" el `+2/3` a solas sería un BUG.

**Decisión: no se toca el `+2/3`.** Se deja el comentario ampliado explicando la convención.

---

## 2) ✅ Wilson expuesto como `plateFormulations = 2`

Se elige **en ejecución**, no con un `#define`, para poder medir A/B sin recompilar:

| archivo | qué se tocó |
|---|---|
| `hekatan-fem/src/cpp/utils/shellQ4.cpp` | comentario largo del signo (arriba) + `plateForm == 2` elige `getBendingK_DSE_FULL`; el `Kb` se arma con un `if/else` en vez de `#if` suelto (y ahora `sinFlexion` vale también para las variantes 1 y 2) |
| `hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp` | el dispatcher documenta el `2 = DSE de Wilson`; el 2 cae en `getLocalStiffnessMatrixShellQ4`, que ya lo atiende |
| `examples/src/cli-modeler/cliModeler.ts` | `shelltype <id> wilson\|dse\|2` (y de paso `dkmq\|3`, que no se podía pedir desde el `.heks`); comentario obsoleto del deck corregido |
| `registros/2026-09-17_shellthick_wilson.md` | esta bitácora |

**NO se cambió el defecto.** `HK_BENDING_FORMULATION` sigue en 3 (MITC4).

## 3) ✅ WASM recompilado

`npm run build:fem` (emcc 4.0.23 vía `emsdk_env.bat`), exit 0.

| | sha1 de `hekatan-fem/src/cpp/built/deform.wasm` |
|---|---|
| ANTES | `50f995ed67f36cb6b2e1d87d9a6119d7b893f493` |
| DESPUÉS | `8bbca81a43edae61c0a765f9ea0b5fe992702565` |

⚠️ Nota para no repetir el error: leyendo el sha1 en bucle salió antes un
`a4f69fa2…` que **no vale**: era el fichero a medio escribir por emcc. El sha1
del WASM sólo se toma cuando el `npm run build:fem` ha salido con código 0.
`deform.js` no cambió (mismo contenido).

⚠️ Después de compilar se tocaron **sólo COMENTARIOS** en `shellQ4.cpp` (lo del
borde duro y lo del «equivalente a MITC4»), así que el binario de arriba sigue
siendo el de este código. Comprobado con `g++ -fsyntax-only`: SINTAXIS OK. Si se
recompila, el sha1 tiene que salir el mismo.

✅ **Control de que el defecto NO se movió**: con el WASM nuevo, MITC4 reproduce los
cinco números guardados el 17-sep **dígito a dígito** (+0.574 / −0.025 / −1.061 /
+0.367 / +1.924 %) y la torre vuelve a dar T1 = 5.220776 s, el mismo de
`torre_hekatan_modal.json`.

---

## 4) Medido: MITC4 contra Wilson, con SAP2000 de juez

### Placa 8×8 apoyada, 5 espesores (`validation/opensees/pl_<t>.heks` + `pl_<t>_sap.json`)

Flecha del nudo central. Positivo = Hekatan más flexible que SAP2000.

| t/L | SAP2000 (m) | **MITC4 (hoy)** | **Wilson DSE** |
|---|---|---|---|
| 0.001 | −2.109511e+2 | **+0.574 %** | +5.869 % |
| 0.01  | −2.124893e-1 | **−0.025 %** | +5.209 % |
| 0.05  | −1.768248e-3 | **−1.061 %** | +3.533 % |
| 0.1   | −2.342748e-4 | **+0.367 %** | +3.937 % |
| 0.2   | −3.484188e-5 | **+1.924 %** | +4.103 % |

❌ Wilson es PEOR en los cinco espesores, y siempre del mismo lado: más blando.

### El mismo banco con Thin de control (`placa-thick-thin-sano`, árbitro ETABS 19)

| t/L | Navier | Thin (DKQ) | MITC4 | Wilson | **Thick/Thin MITC4** | **Thick/Thin Wilson** |
|---|---|---|---|---|---|---|
| 0.001 | 2.1260e+2 | 2.1253e+2 | 2.1216e+2 | 2.2333e+2 | 0.99827 | **1.05082** |
| 0.01  | 2.1260e-1 | 2.1253e-1 | 2.1244e-1 | 2.2356e-1 | 0.99956 | **1.05189** |
| 0.05  | 1.7008e-3 | 1.7002e-3 | 1.7495e-3 | 1.8307e-3 | 1.02897 | 1.07674 |
| 0.1   | 2.1260e-4 | 2.1253e-4 | 2.3514e-4 | 2.4350e-4 | 1.10636 | 1.14571 |
| 0.2   | 2.6575e-5 | 2.6566e-5 | 3.5512e-5 | 3.6271e-5 | 1.33675 | 1.36532 |

❌ **La prueba que lo condena**: cuando `t/L → 0` el cortante deja de contar y Mindlin
TIENE que converger a Kirchhoff, o sea Thick/Thin → 1. MITC4 da 0.99827 ✅.
Wilson se queda en **1.0508**: un 5 % blando en el límite fino, y ese 5 % **no
depende del espesor**, así que no es cortante — es rigidez de FLEXIÓN que se
pierde. El Thin clava a Navier (≤0.04 %), así que el juez no está en duda.

### `placa-momentos-navier` (misma malla, `areaload`, M11 en el centro)

| formulación | w centro (m) | M11 centro | vs Navier (44.20) |
|---|---|---|---|
| MITC4 (defecto) | −2.665722e-2 | 44.4485 | +0.56 % |
| Wilson DSE | −2.803005e-2 | 45.4209 | +2.76 % |
| Thin (DKQ) | −2.656618e-2 | 44.6506 | +1.02 % |

⚠️ El M11 de la fila Wilson hay que leerlo con pinzas: la recuperación de momentos
en joints de `plateFormulations ≠ 1` es la de **MITC4** (`mitc4Joints.ts`), o sea
que a la solución de Wilson se le aplica la B de otra formulación. La FLECHA sí
es limpia: +5.15 % más blanda que MITC4, igual que en los otros bancos.

### La torre retorcida (27 plantas, 820 nudos, 540 losas Shell-Thick)

`validation/opensees/torre.heks` contra `torre_sap2000.json`, periodos:

| modo | SAP2000 (s) | **MITC4** | dif | **Wilson** | dif |
|---|---|---|---|---|---|
| 1 | 4.8425 | 5.2208 | **−7.25 %** | 5.6571 | −14.40 % |
| 2 | 4.8425 | 5.2208 | **−7.25 %** | 5.6571 | −14.40 % |
| 3 (torsión) | 2.6129 | 2.4879 | +5.03 % | 2.7253 | −4.12 % |
| 4 | 1.2313 | 1.3244 | **−7.03 %** | 1.4307 | −13.93 % |
| 5 | 1.2313 | 1.3244 | **−7.03 %** | 1.4307 | −13.93 % |
| 6 (torsión) | 1.2103 | 1.1322 | +6.89 % | 1.2652 | −4.34 % |

❌ El −7.25 % **empeora a −14.40 %**. Los modos de TORSIÓN sí mejoran
(+5.03 → −4.12 y +6.89 → −4.34), que es coherente con que el DSE muestrea el
cortante en coordenadas físicas; pero los laterales, que es donde estaba el
problema, se van al doble.

### Capa por capa: el elemento solo (C++ nativo, celda 1.25×1.25 cuadrada)

```
t/L=0.008   |K_Wilson − K_MITC4| / |K_MITC4| = 9.998e-01
   Wilson: 3 modos nulos    MITC4: 3 modos nulos      (ninguno tiene mecanismo)
flexión pura (κ_yy = 1):  exacta 2.914005e+00
   Wilson +0.000 %        MITC4 −0.000 %              (los dos exactos)
```

- ✅ Ni uno ni otro tiene modos de energía nula de más (3 en los dos).
- ✅ Los dos dan la energía de flexión pura EXACTA.
- ❌ Pero **no son el mismo elemento ni en un cuadrado perfecto**, y el comentario
  de `getBendingK_DSE_FULL` afirma que «es equivalente exacto a MITC4 para
  rectángulos perfectos». **Eso es falso tal como está escrito hoy.**

---

## 4-bis) ⚠️ EL BANCO NO PUEDE JUZGAR A WILSON: le falta el borde DURO

Wilson lo dice él mismo, §8.9.2 (pág. PDF 2245 del extracto, sobre esta MISMA
placa apoyada): *«Note que la rotación normal a lo largo del extremo con soporte
simple está fijado en cero. **Para el DSE se requiere la condición de "hard"
boundary.** El DKE rinde los mismos resultados para condiciones de bordes tanto
duras como blandas»*.

Los `pl_<t>.heks` y todos los bancos de placa de hoy usan el borde **BLANDO**
(solo `w` atado). Repetido el barrido atando además la rotación normal al borde:

| malla | t/L | borde | **DSE/DKE (Wilson)** | MITC4/DKE |
|---|---|---|---|---|
| 8×8 | 0.0001 | blando | 1.05081 | 0.99826 |
| 8×8 | 0.0001 | **duro** | **1.01441** | 0.99826 |
| 16×16 | 0.01 | blando | 1.02392 | 1.00169 |
| 16×16 | 0.01 | **duro** | **1.00402** | 1.00001 |
| 16×16 | 0.0001 | blando | 1.02222 | 0.99956 |
| 16×16 | 0.0001 | **duro** | **1.00357** | 0.99956 |

Y la **Tabla 8.4 del libro** (16×16, carga uniforme, borde duro) da
`DSE/DKE = 9.815/9.807 = ` **1.00082** con h = 0.01 y h = 0.0001.

✅ Con la malla y el borde que pide el libro, el DSE de aquí pasa de 5 % a
**0.36 %** de su Kirchhoff: el 5 % NO era la formulación, era la condición de
borde. Queda un **0.3 % residual** contra el 0.08 % del libro (⏳ abierto; no se
puede cerrar del todo porque el extracto no da E, ν ni el lado de su placa).

❌ **Consecuencia honesta: la tabla de arriba contra SAP2000 NO sirve para
condenar a Wilson.** Los `pl_<t>_sap.json` se midieron con el borde blando, que
es justo el que su elemento no admite. Para juzgarlo de verdad hay que volver a
correr SAP2000 con la rotación normal atada en el borde — y hoy **no se puede**
(orden de Jorge: no abrir SAP2000 con el LIVE corriendo). Se deja anotado como
la medida que falta, no se tapa con un número que no aplica.

⚠️ La torre y `placa-momentos-navier` sí son comparables (allí los bordes de losa
no son apoyos simples de placa), y en los dos Wilson sale peor.

---

## 5) npm test completo

| | marcador | fallos |
|---|---|---|
| ANTES (dato de Jorge) | 579/586 | 7 |
| DESPUÉS (medido, 359.4 s) | **594/601** | **7** |

⚠️ El TOTAL sube de 586 a 601 porque hay casos que emiten un número variable de
filas (p.ej. `placa-opensees-vs-sap2000` según haya o no openseespy). Lo que se
compara es el número y el NOMBRE de los fallos, no el total.

✅ **Comprobado uno a uno que los 7 son PREVIOS**, no de este cambio: se puso el
WASM de `git show HEAD` (`50f995ed…`) y se corrieron los casos que fallan:

```
automesh-vs-etabs         viejo 2/3 · FALLA 11.936 %  |  nuevo 2/3 · FALLA 11.936 %
muelle-area-y-nudo-colgado viejo 5/6 · FALLA  3.210 % |  nuevo 5/6 · FALLA  3.210 %
placa-momentos-navier     viejo 4/6 · FALLA 43.109 % y −2.936 %
                          nuevo 4/6 · FALLA 43.109 % y −2.936 %   (dígito a dígito)
```

Los 7, para dejarlos por escrito:

1. `automesh`: los 25 nudos contra ETABS — 11.936 % (límite 0.00 %)
2. `muelle-area`: placa flexible NODAL vs SAFE — 3.210 % (límite 1.50 %)
3. `muelle-area`: consistente, Python vs TS/WASM — 5.940 % (límite 0.00 %)
4. `muelle-area`: nodal, Python vs TS/WASM — 6.165 % (límite 0.00 %)
5. `muelle-area`: colgado, Python vs TS/WASM — 6.888 % (límite 0.00 %)
6. `placa-momentos-navier`: joints M11/M22/M12 vs SAP2000 — 43.109 % (límite 0.10 %)
7. `placa-momentos-navier`: M11 nudo central vs SAP2000 — −2.936 % (límite 0.10 %)

**No se subió ningún límite** para tapar nada.

---

## 6) Recomendación: **NO pasar el defecto a Wilson todavía**

| | |
|---|---|
| ✅ | El signo del `+⅔` está resuelto y probado: no era un error. Documentado en el código con la cita. |
| ✅ | La formulación de Wilson ya se puede pedir sin recompilar: `shelltype <id> wilson` / `plateFormulations = 2`. |
| ✅ | El defecto no se ha movido y la suite no ha empeorado (7 fallos previos, los mismos). |
| ❌ | Con los bancos tal como están, Wilson sale PEOR: placa +3.5…+5.9 % contra SAP2000 (MITC4 ±0.03…1.9 %) y la torre −14.40 % (MITC4 −7.25 %). |
| ⚠️ | Pero esos bancos **usan el borde blando**, que es justo el que Wilson dice que su DSE no admite. Con el borde duro el desvío baja de 5 % a 0.36 %. |
| ⏳ | La medida que falta: volver a correr SAP2000 (PlateThick) con la rotación normal atada en el borde y repetir el barrido. Hoy no se puede (no abrir SAP2000). |

**Lo único que sí es concluyente hoy** es la torre: ahí no hay apoyos simples de
placa que confundan el borde, y Wilson dobla el error (−7.25 → −14.40 %) en los
modos laterales, aunque mejore los de torsión (+5.03 → −4.12 %). Ese es un
argumento de peso para NO cambiar el defecto.

### Lo siguiente que hay que hacer, por orden
1. Repetir el barrido de placa con SAP2000 y **borde duro**, que es la única forma
   de que el juez y el elemento hablen del mismo problema.
2. Cerrar el 0.3 % residual contra la Tabla 8.4 del libro (falta E, ν y el lado de
   su placa: hay que sacarlos del capítulo 8.9.2, no inventarlos).
3. Si aun con el borde duro Wilson no gana, el −7 % de la torre NO es la placa de
   Wilson: habrá que buscarlo en otro sitio (el elemento de CSI no es ninguno de
   los dos).
