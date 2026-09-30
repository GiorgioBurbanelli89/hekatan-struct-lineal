# Prompt de Continuación — Benchmark FEM Hekatan vs SAP2000/ETABS/SAFE

Sesión anterior completó **6 de 7 benchmarks de placas/membrana** validados <5% vs SAP2000.
Este prompt continúa el trabajo desde otra computadora (o re-arranque).

---

## 🎯 Resumen del estado actual

### ✅ Lo VALIDADO contra SAP2000 (commiteado en GitHub)

| Caso | Diff vs SAP | Estado |
|---|---|---|
| Plate-Thin (Kirchhoff) | δ -0.32%, M -2.18% | ✅ |
| Plate-Thick (Mindlin) | δ +0.30%, M -3.57% | ✅ |
| Shell-Thin | δ +4.31%, **M +0.47%** ⭐ | ✅ |
| Shell-Thick | δ +0.30%, M -3.57% | ✅ |
| Membrane cantilever wall | δ -0.23% | ✅ |
| **Layered (CLT con ABBD)** | **EXACTO 0.000000%** ⭐ | ✅ |
| Losa shellQ4 SIN vigas (4 esquinas) | δ -0.44%, **modal <1.04%** ⭐ | ✅ |

### 🔧 Bugs arreglados en sesión anterior

1. **`hekatan-fem/src/analyze.ts`** — convención rotaciones MITC4 (Bathe):
   ```diff
   - kappaXX += dNdx[n] * thetaY;
   - kappaYY += -dNdy[n] * thetaX;
   + kappaXX += -dNdx[n] * thetaX;   // d²w/dx² = -d(theta_x)/dx
   + kappaYY += -dNdy[n] * thetaY;
   ```
   Resultado: Shell M11 -33.6% → +0.47% diff vs SAP

### ⚠ Bug PENDIENTE de investigar

**`membrana-csi` con vigas + 4 esquinas**: Hekatan 3.3× más rígido que SAP
- Aislado al **frame-shell coupling** (no al solver shellQ4 puro)
- Hipótesis: rigid offsets implícitos / drilling-torsion coupling
- NO afecta los benchmarks principales

### 🆕 Implementación nueva: Layered Shell

```
hekatan-fem/src/
├── layeredShell.ts   — Classical Laminate Theory (matriz ABBD)
└── layeredQ4.ts      — Q4 Mindlin con coupling, 5 DOFs/nodo
```

API pública en `hekatan-fem/src/index.ts`:
```ts
import { layeredQ4Solve, computeABBD, type LayerDef } from "hekatan-fem";
```

---

## 📋 Acciones pendientes — qué continuar

### 🥇 Prioridad ALTA

**1. Crear ejemplo `layered-shell` en workspace**
- Carpeta nueva: `examples/src/layered-shell/`
- Archivos: `layeredShell.ts` (ExampleDef), `main.ts`, `index.html`
- Usar `layeredQ4Solve` con UI Tweakpane configurable (espesor por capa, ángulos)
- Registrar en `examples/src/workspace/exampleRegistry.ts`
- Estimado: ~2 horas

**2. Crear ejemplo `losa-vigas-bordes` en workspace** (validado)
- Variante de `membrana-csi` pero con simply supported en TODOS los bordes (no 4 esquinas)
- Configuración que SÍ coincide con SAP2000 dentro del 5%
- Mantener `membrana-csi` original como referencia "auto-distribución approximation"
- Estimado: ~1 hora

**3. Adaptar benchmarks a ETABS**
- Copiar `Sap2000 Powershell/sap2000_extract.ps1` → `Etabs Powershell/etabs_extract.ps1` (existe parcial)
- Cambiar ProgID: `ETABSv1.Helper` → `CSI.ETABS.API.ETABSObject`
- Probar `benchmark_placa_etabs.ps1` para los 5 tipos (Shell-Thin/Thick/Plate-Thin/Thick/Membrane)
- Comparar contra hekatan-fem (mismo benchmark que SAP)
- Estimado: ~30 min

**4. Adaptar benchmarks a SAFE**
- ProgID: `SAFEv1.Helper` → `CSI.SAFE.API.ETABSObject` (sí, dice "ETABS" — legacy CSI)
- SAFE es mejor para cimentaciones (Winkler nativo) + losas postensadas
- Probar `benchmark_layered_safe.ps1` con CLT
- Estimado: ~30 min

### 🥈 Prioridad MEDIA

**5. Investigar bug `membrana-csi` frame-shell coupling** (1-2 días)
- Test con 1 sola viga (no 36) para ver si bug escala con N_frames
- Verificar matriz K elemento-por-elemento (Hekatan vs SAP exportado)
- Posibles culpables:
  - Rigid offsets default en SAP (ETABS Insertion Point al top de losa)
  - Drilling Rz acoplándose con torsión Rz del frame
  - Mass matrix consistent vs lumped en modal

**6. Edificio 1-piso modal acoplado** (frames + losa shell)
- 4 columnas + 4 vigas perimetrales + 1 losa
- 3 variantes losa: Shell-Thin / Shell-Thick / Layered
- Comparar f1, f2, f3 (modos lateral X, Y, torsional)
- Estimado: ~3 horas

### 🥉 Prioridad BAJA

**7. Modal en plateQ4Solve** (no expuesto API)
- Agregar matriz de masa al solver C++ existente
- Recompilar WASM
- Estimado: ~4 horas

**8. Migrar layeredQ4 a C++/WASM**
- Solo si performance importa para mallas >50×50
- Mantener TS puro como fallback

---

## 💻 Setup en otra computadora (clonar desde GitHub)

### Pre-requisitos en cualquier PC

```powershell
# 1. Git for Windows
# Descargar: https://git-scm.com/download/win

# 2. Node.js 20+ (LTS)
# Descargar: https://nodejs.org/

# 3. Visual Studio Code (opcional pero recomendado)
# Descargar: https://code.visualstudio.com/

# 4. ETABS / SAP2000 / SAFE (CSI products) — para benchmarks vs OAPI
# (no se necesitan para correr hekatan-fem solo)

# 5. Calcpad-Symbolic CLI compilado (.NET 10)
# Si quieres rebuild: https://dotnet.microsoft.com/download
```

### Clonar AMBOS repos en otra computadora

```powershell
# Crear estructura igual a la original:
mkdir "C:\Hekatan"
cd "C:\Hekatan"

# Clonar hekatan-struct-lineal (rama main)
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal
git checkout main
git pull origin main
cd ..

# Clonar Calcpad-Symbolic (rama main)
git clone https://github.com/GiorgioBurbanelli89/Calcpad-Symbolic.git
cd Calcpad-Symbolic
git pull origin main
cd ..

# Setup hekatan-struct-lineal dependencies (Node.js)
cd hekatan-struct-lineal
npm install
cd hekatan-fem && npm install && cd ..
cd examples && npm install && cd ..
```

### Actualizar (sync) en computadora YA clonada

```powershell
# hekatan-struct-lineal
cd C:\Hekatan\hekatan-struct-lineal  # o donde lo tengas
git fetch
git pull origin main

# Calcpad-Symbolic
cd C:\Hekatan\Calcpad-Symbolic
git fetch
git pull origin main

# Re-instalar deps si cambiaron
cd hekatan-struct-lineal
npm install
cd hekatan-fem && npm install && cd ..
cd examples && npm install && cd ..
```

### Configurar Git para tu usuario en la nueva PC

```powershell
# Solo PRIMERA vez — cambiar el email/nombre por los tuyos
git config --global user.name "TU NOMBRE"
git config --global user.email "TU_EMAIL@gmail.com"

# Si usas el mismo usuario GitHub en ambas PCs:
git config --global user.name "GiorgioBurbanelli89"
git config --global user.email "TU_EMAIL@github.com"
```

### Workflow recomendado entre 2 computadoras

```
PC-A (donde trabajaste):
  git add <archivos>
  git commit -m "mensaje"
  git push

PC-B (otra computadora, cuando volvés a ella):
  git pull              # trae los cambios de PC-A
  # ... trabajas ...
  git add ...
  git commit ...
  git push              # cambios disponibles para PC-A

PC-A (cuando regresas):
  git pull              # trae los cambios de PC-B
```

**REGLA CRÍTICA**: SIEMPRE `git pull` ANTES de empezar a trabajar en cada PC. Si te olvidas y haces commits divergentes, hay que hacer merge manual.

---

## 🚀 Verificación rápida de instalación (cualquier PC)

```powershell
cd C:\Hekatan\hekatan-struct-lineal

# Test que hekatan-fem funcione
cd Benchmark_Placa
npx tsx benchmark_placa_hekatan.mjs

# Esperar output:
# Plate-Thin   w 0.6931 mm
# Plate-Thick  w 0.7142 mm
# Shell-Thin   w 0.7142 mm
# Shell-Thick  w 0.7142 mm

# Test layered
npx tsx test_layered_abbd.mjs
# Debe mostrar todas las matrices ABBD calculadas correctamente

# Test workspace dev (requiere Vite)
cd ..\examples
npm run dev
# Abrir http://localhost:4600
```

---

## 📂 Archivos clave del proyecto (ubicación en repo)

```
hekatan-struct-lineal/
├── BENCHMARK_GUIDE.md                              # Guía 3 productos CSI
├── PROMPT_CONTINUACION.md                          # Este archivo
│
├── Benchmark_Placa/                                # Validación FEM ⭐
│   ├── REPORTE_FINAL.md                            # Tabla resultados
│   ├── benchmark_placa_sap2000.ps1                 # SAP placas (5 tipos)
│   ├── benchmark_placa_hekatan.mjs                 # Hekatan placas
│   ├── benchmark_completo_modal.mjs                # Modal acoplado
│   ├── benchmark_muro_cantilever_*.{ps1,mjs}       # Muro cantilever
│   ├── benchmark_layered_sap2000.ps1               # SAP layered
│   ├── benchmark_membrana_csi_*.{ps1,mjs}          # Loza+vigas
│   ├── benchmark_losa_4esquinas_*.{ps1,mjs}        # Sin vigas test
│   ├── test_layered_abbd.mjs                       # ABBD validation
│   ├── test_layered_q4.mjs                         # Q4 layered solver
│   ├── debug_shell_M11.mjs                         # Bug M11 fix
│   └── final_validation.mjs                        # 8x8 vs 16x16
│
├── Etabs Powershell/                               # ETABS OAPI tools
├── Sap2000 Powershell/                             # SAP OAPI tools
├── Safe Powershell/                                # SAFE OAPI tools
│
├── hekatan-fem/src/
│   ├── analyze.ts                                  # FIX MITC4 ⭐
│   ├── layeredShell.ts                             # CLT ABBD ⭐ NUEVO
│   ├── layeredQ4.ts                                # Q4 layered ⭐ NUEVO
│   ├── deformCpp.ts                                # Solver wrapper
│   └── index.ts                                    # API pública
│
└── examples/src/
    ├── plate-thin/, plate-thick/                   # Placa validados
    ├── shell-thin/, shell-thick/                   # Shell validados
    ├── membrana-csi/                               # ⚠ bug coupling
    ├── plate-thick-validacion/                     # Validación analítica
    └── workspace/                                  # Tweakpane hub
```

---

## 🛠 Comandos rápidos para acciones pendientes

### Para crear ejemplo `layered-shell` (Acción #1)

```powershell
cd C:\Hekatan\hekatan-struct-lineal\examples\src
mkdir layered-shell
# Copiar plate-thick como template:
xcopy /E plate-thick layered-shell
cd layered-shell
# Editar archivos para usar layeredQ4Solve en lugar de plateQ4Solve
# Registrar en ../workspace/exampleRegistry.ts
```

### Para correr benchmark SAP completo (después de actualizar)

```powershell
# 1. Abrir SAP2000 manualmente (queda esperando)
# 2. En PowerShell:
cd C:\Hekatan\hekatan-struct-lineal\Benchmark_Placa
& powershell -ExecutionPolicy Bypass -File correr_todos_tipos.ps1
# Genera sap2000_consolidado.json con 5 tipos

# 3. Comparar con hekatan:
npx tsx benchmark_placa_hekatan.mjs
# Output: tabla comparativa los 5 tipos
```

### Para extraer resultados de un .EDB existente

```powershell
cd C:\Hekatan\hekatan-struct-lineal\Etabs Powershell\
& .\extraer_etabs.bat
# Drag-and-drop el .EDB → genera *_results.json
```

---

## 📝 Si te toca continuar el bug `membrana-csi`

### Hipótesis principales y cómo testearlas

**1. Rigid offset implícito**
```ts
// Probar agregando rigidOffsets explícitos a las vigas
elementInputs.rigidOffsets = new Map([
  [shellCount, [0.5, 0.5]],  // 50% offset en ambos extremos
  // ... etc
]);
```

**2. Drilling-torsion Rz coupling**
- Verificar `getGlobalStiffnessMatrix.cpp` ensamblaje
- Imprimir matriz K en un nodo compartido (frame+shell) y comparar contra
  hand-calculation

**3. Test con 1 viga sola (escalado)**
```ts
// En benchmark_losa_4esquinas_hekatan.mjs:
// Agregar SOLO 1 viga al sur, dejar resto sin vigas
// Si δ baja drásticamente → bug es por viga, no acumulativo
// Si δ se reduce poco → bug es acumulativo (algo escala)
```

---

## 📊 GitHub Repos (URLs)

| Repo | URL | Branch | Acceso |
|---|---|---|---|
| hekatan-struct-lineal | https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal | `main` | Privado |
| Calcpad-Symbolic | https://github.com/GiorgioBurbanelli89/Calcpad-Symbolic | `main` | Privado |

**Comandos git remotes** (ya configurados al clonar, solo de referencia):
```
hekatan-struct-lineal  https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
origin (Calcpad)  https://github.com/GiorgioBurbanelli89/Calcpad-Symbolic.git
```

---

## ✅ Cómo arrancar la próxima sesión (prompt para Claude/agente)

Copia y pega lo siguiente al inicio de la próxima sesión:

> Estoy continuando el trabajo de validación FEM de hekatan-struct-lineal vs SAP2000/ETABS/SAFE.
> El estado anterior está documentado en `PROMPT_CONTINUACION.md` (en la raíz del repo).
>
> Acciones pendientes prioritarias:
> 1. Crear ejemplo `layered-shell` en `examples/src/` usando `layeredQ4Solve`
> 2. Crear `losa-vigas-bordes` (variante validada de `membrana-csi`)
> 3. Adaptar benchmarks a ETABS (`benchmark_placa_etabs.ps1`)
> 4. Adaptar benchmarks a SAFE
> 5. Investigar bug `membrana-csi` (frame-shell coupling, 3.3× rigidez extra)
>
> Los archivos clave están en `Benchmark_Placa/` y `hekatan-fem/src/layered*.ts`.
> El reporte completo: `Benchmark_Placa/REPORTE_FINAL.md`.
>
> Empezamos por la acción #1 — crear el ejemplo workspace de Layered Shell.
