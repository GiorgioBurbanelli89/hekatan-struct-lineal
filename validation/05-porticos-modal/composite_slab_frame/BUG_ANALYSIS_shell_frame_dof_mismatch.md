# Bug Analysis — Shell Q4 ↔ Frame DOF convention mismatch

**Severity:** Critical — over-rigidiza ~3× cualquier modelo con shells acoplados a frames perimetrales.

**Symptom:** w_centro de un sistema slab+frame da ~3× la rigidez correcta de ETABS.

**Location:** `hekatan-fem/src/cpp/utils/shellQ4.cpp` líneas 144-184 (B-matrices de bending y shear del Mindlin Q4 MITC4).

---

## Evidencia experimental

| Caso | Hekatan Struct C++ | ETABS (ref) | Error |
|---|---:|---:|---:|
| **Pure shell** (shear_wall_q4: shell SIN frames) | 4.646e-05 m | 4.582e-05 m | **1.40%** ✓ |
| **Shell + frames** (composite_slab_thin_frame) | -1.001 mm | -3.055 mm | **3.05×** ✗ |

El error aparece **solo** cuando shells y frames comparten nodos. El elemento shell aislado es correcto. El elemento frame aislado es correcto. La interfaz entre ambos es la que está rota.

## Análisis del bug

### Convención DOF asumida en el código

**Frame** (`getLocalStiffnessMatrixFrame`, líneas 196-207):
```
DOFs por nodo: [u, v, w, θx, θy, θz]
  θx = rotación about x-axis (right-hand rule)  ← convención clásica AISC/CSI
  θy = rotación about y-axis
  θz = rotación about z-axis
```
Interpretación inequívoca: `bz` (= `6·EIz/L²`) aparece en posición `(v, θz)` — bending in xy plane controlled by Iz, moment vector along z.

**Shell** (`shellQ4.cpp` línea 145):
```
// DOFs: [w, θx, θy] per node (θx=βx, θy=βy in Mindlin convention)
```
y línea 151-154:
```cpp
Bb(0, 3*i + 1) = dNdx;   // κxx = ∂θx/∂x (= ∂βx/∂x)
Bb(1, 3*i + 2) = dNdy;   // κyy = ∂θy/∂y (= ∂βy/∂y)
```
y línea 179-182:
```cpp
Bsp(0, 3*i + 1) = -Np[i];   // γxz: -θx (= -βx)
Bsp(1, 3*i + 2) = -Np[i];   // γyz: -θy (= -βy)
```

Aquí `θx = βx` (Mindlin "normal rotation in x-direction"), **NO** rotation about x-axis.

### El conflicto

Para una placa horizontal en plano xy (+z up) en límite Kirchhoff, ambas convenciones se relacionan así:

| Convención global (Frame) | Convención Mindlin (Shell) | Relación Kirchhoff |
|---|---|---|
| `θx_global` = rotación about x-axis | `βy_Mindlin` = normal rotation in y direction | `θx_global = +∂w/∂y = +βy_Mindlin` |
| `θy_global` = rotación about y-axis | `βx_Mindlin` = normal rotation in x direction | `θy_global = -∂w/∂x = -βx_Mindlin` |

Es decir:

```
βx_Mindlin = -θy_global   (axis SWAP + sign FLIP)
βy_Mindlin = +θx_global   (axis SWAP)
```

### Consecuencia en el assembly global

Cuando shell y frame comparten un nodo:

- El **frame** transmite por DOF 3: `θx_global` (rotación about x)
- El **shell** consume por DOF 3: lo trata como `βx_Mindlin` (normal rotation in x)
- Pero `βx_Mindlin = -θy_global ≠ θx_global` → **MISMATCH**

El K global del nodo compartido contiene términos cruzados que **acoplan rotaciones x e y de forma artificialmente rígida**, sobre-restringiendo el sistema.

### Por qué pure-shell funciona correctamente

Cuando solo hay shells (sin frames), todo el modelo usa internamente la convención `θ=β`. Las derivadas `∂βx/∂x` se calculan con el mismo `βx` que entra en `γxz = ∂w/∂x - βx`. El K es **internamente consistente** y produce la misma deflexión w(x,y) que la formulación correcta — solo el "label" de las DOFs rotacionales está mal nombrado, pero los resultados de w son correctos. Por eso `shear_wall_q4` da 1.4% vs ETABS.

Cuando se mezclan con frames, los DOFs rotacionales del shell (etiquetados βx,βy pero entrando como θx,θy globales) se acoplan con los frames que sí usan θx,θy globales. La inconsistencia se manifiesta.

## Fix propuesto

Cambiar las B matrices del shell para usar la **convención global θ_global = rotation about axis** consistente con frame:

```cpp
// shellQ4.cpp líneas 144-155 — ACTUAL (incorrecto al acoplar con frames):
Bb(0, 3*i + 1) = dNdx;   // κxx = dθx/dx
Bb(1, 3*i + 2) = dNdy;   // κyy = dθy/dy
Bb(2, 3*i + 1) = dNdy;   // κxy = dθx/dy
Bb(2, 3*i + 2) = dNdx;   //     + dθy/dx
```

```cpp
// CORRECTO con convención θ_global (rotation about axis):
//   βx = -θy_global  →  ∂βx/∂x = -∂θy/∂x
//   βy = +θx_global  →  ∂βy/∂y = +∂θx/∂y
Bb(0, 3*i + 2) = -dNdx;  // κxx = -∂θy/∂x          (DOF 2 = θy_global)
Bb(1, 3*i + 1) = +dNdy;  // κyy = +∂θx/∂y          (DOF 1 = θx_global)
Bb(2, 3*i + 1) = +dNdx;  // κxy = +∂θx/∂x − ...
Bb(2, 3*i + 2) = -dNdy;  //       ... -∂θy/∂y
```

```cpp
// shellQ4.cpp líneas 179-182 — ACTUAL:
Bsp(0, 3*i + 0) =  dNdx_p;  // γxz: dw/dx
Bsp(0, 3*i + 1) = -Np[i];   // γxz: -θx (= -βx)
Bsp(1, 3*i + 0) =  dNdy_p;  // γyz: dw/dy
Bsp(1, 3*i + 2) = -Np[i];   // γyz: -θy (= -βy)
```

```cpp
// CORRECTO:
//   γxz = ∂w/∂x - βx = ∂w/∂x + θy_global
//   γyz = ∂w/∂y - βy = ∂w/∂y - θx_global
Bsp(0, 3*i + 0) = +dNdx_p;  // γxz: ∂w/∂x
Bsp(0, 3*i + 2) = +Np[i];   // γxz: +θy_global       ← signo POSITIVO, DOF 2
Bsp(1, 3*i + 0) = +dNdy_p;  // γyz: ∂w/∂y
Bsp(1, 3*i + 1) = -Np[i];   // γyz: -θx_global       ← DOF 1
```

### Cambio a aplicar

Es esencialmente un **swap de DOF 1 ↔ DOF 2 más un cambio de signo en uno de los dos** en TODAS las B matrices del shell (bending y shear). El resto del código (ensamblaje, transformación local-global, drilling, membrane) permanece idéntico.

## Validación esperada del fix

Después de aplicar el fix y recompilar a WASM:

| Caso | Antes | Después esperado |
|---|---:|---:|
| Pure shell (shear_wall_q4) | 1.40% vs ETABS ✓ | ~1.40% (sin cambio, ya era correcto) |
| Shell + frames (slab thin) | 3.05× off | <5% vs ETABS |
| Shell + frames (slab thick) | 3.02× off | <5% vs ETABS |

## Tests de regresión a correr post-fix

1. `shear_wall_q4` (pure shell membrane action): Ux ≈ 4.65e-05 m
2. `composite_slab_thin_frame` (shell+frames): w_centro ≈ -3.05 mm
3. `Paz 6.3 modal frame benchmark`: frecuencias deben mantenerse (frames sin shells)
4. `zapata-aislada` (shell + Winkler springs sin frames): debe mantenerse

## Notas adicionales

- El bug es histórico del fork original (upstream); existe desde la introducción del Q4 shell.
- Existe en plate_q4 también (ver `plate_q4/kirchhoff_q4.cpp` líneas con misma convención β).
- Para `plateQ4Solve()` (función pública de placa pura sin frames) el bug es invisible — los resultados de w son correctos.
- Para `deform()` con shells+frames mezclados, el bug es visible y crítico.
