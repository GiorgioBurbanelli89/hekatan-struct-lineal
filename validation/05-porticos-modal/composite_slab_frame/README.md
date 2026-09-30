# Benchmark: Composite Slab + Frame (3-way validation)

Benchmark formal de 3 vías (ETABS / Hekatan Struct WASM / MATLAB) para validar
la transferencia de fuerzas entre elementos area (shell thin/thick/membrane)
y elementos frame (vigas perimetrales) en sistemas estructurales mixtos.

## Modelo

Tres variantes, todas comparten geometría 4×4 m, mesh 4×4 = 16 Q4, vigas
perimetrales W360x60, malla nodal 5×5 = 25 puntos planos.

### Variante A — Shell THIN + Frame (carga vertical)

```
                4 m
        +---+---+---+---+
        |   |   |   |   |
        +---+---+---+---+        Slab z = 4 m, t = 0.10 m
   4 m  |   |   |   |   |        E_c = 25 GPa, ν = 0.20
        +---+---+---+---+        Vigas perim. W360x60 acero
        |   |   |   |   |        4 columnas pin (z = 0..4)
        +---+---+---+---+        Carga: q = 5 kN/m² ↓
        ●   |   |   |   ●
        +---+---+---+---+        ● = pin support en base
        ●               ●
```

### Variante B — Shell THICK + Frame
Mismo modelo que A pero MODELINGTYPE = "ShellThick" (Mindlin-Reissner).

### Variante C — Membrana + Frame (carga horizontal)

```
       4 m            top: F_x = 100 kN distribuido en 5 nodos
        ┄┄┄┄┄┄┄┄→
   4 m  ███████████   Muro vertical xz, t = 0.20 m, MODELINGTYPE Membrane
        ███████████   Vigas chord/collector perimetrales
        ███████████   Frames verticales en bordes laterales
        ▣▣▣▣▣▣▣▣▣▣▣   ▣ = empotrado UX UY UZ RX RY RZ en base
```

## Resultados validados

### Slab Thin/Thick + Frame (carga vertical q = 5 kN/m²)

| Magnitud | MATLAB CLI | Hekatan Struct WASM | **ETABS Thin** | **ETABS Thick** |
|---|---:|---:|---:|---:|
| **w_centro** [mm] | -2.371 | -1.001 | **-3.055** | **-3.032** |
| **Σ Rz** [kN] | 80.000 | 75.000 † | **80.000** | **80.000** |
| **R por esquina** [kN] | 20.000 | 18.750 † | **20.000** | **20.000** |
| **My max viga** [kN·m] | 4.49 | (pendiente) | (pendiente) | (pendiente) |
| **Vz max viga** [kN] | 6.91 | (pendiente) | (pendiente) | (pendiente) |

† Hekatan Struct excluye carga directa en nodos soporte (4 × 1.25 = 5 kN);
sumándola da exactamente 80 kN. Diferencia es **definicional**, no numérica.

### Membrana Wall + Frame (carga horizontal F = 100 kN)

| Magnitud | MATLAB CLI | Hekatan Struct WASM | ETABS Membrane |
|---|---:|---:|---:|
| **ux_top** [mm] | 0.084 | 0.101 | (pendiente — ver bug abajo) |
| **Σ Rx** [kN] | -100.000 | -100.000 | (pendiente) |

## Observaciones importantes

### ETABS = ground truth

Los 4 supports de esquina dan **20.000 kN exactos** cada uno en ETABS,
suma = 80.000 kN = q · A. Equilibrio perfecto, identico a MATLAB.

### Hekatan Struct WASM ~3× más rígido que ETABS para slab vertical

`w_centro` Hekatan Struct = -1.001 mm vs ETABS = -3.055 mm. Esta discrepancia
**no se resuelve invirtiendo Iy/Iz** (test produjo -1.65 mm — mejora pero no
suficiente). La causa más probable es **shear locking** en el Q4 MITC4 del
solver C++ para t/L = 0.025 (régimen thin). El elemento Q4 con integración
Mindlin completa sin selective integration over-rigidiza losas delgadas.

**Acción pendiente**: investigar `hekatan-fem/src/cpp/elements/Q4Shell.cpp`
para confirmar el método de integración (selective vs full) y comparar con
la convención Kirchhoff de ETABS Thin.

### MATLAB ~25% más rígido que ETABS

`w_centro` MATLAB = -2.371 mm vs ETABS = -3.055 mm. La diferencia se debe a
que `q4_plate_thin.m` usa Mindlin con integración selectiva (2×2 bending,
1×1 shear), distinta de la formulación de ETABS Shell Thin (Kirchhoff puro
DKQ). Ambas son correctas para t/L delgada; ETABS converge a la solución de
Navier exacta más cerca por su DKQ.

## Cómo correr

### MATLAB CLI (Hekatan Lab)
```bash
cd hekatanlab-web
node --import ./hkl-bootstrap.mjs hkl.mjs --load \
  ../hekatan-struct-lineal/Benchmark_Placa/matlab_lib/lib \
  ../hekatan-struct-lineal/Benchmark_Placa/matlab_lib/composite_slab_thin_frame.m
```

### Hekatan Struct CLI (WASM Eigen C++)
```bash
cd hekatan-struct-lineal
node Benchmark_Placa/composite_slab_frame/run_composite_slab_thin_frame.mjs
node Benchmark_Placa/composite_slab_frame/run_composite_slab_thick_frame.mjs
node Benchmark_Placa/composite_slab_frame/run_composite_wall_membrane_frame.mjs
```

### ETABS via OAPI PowerShell

Paso 1 — Generar `.e2k`:
```bash
cd hekatanlab-web
node --import tsx/esm \
  ../hekatan-struct-lineal/Benchmark_Placa/composite_slab_frame/export_e2k_thin_frame.mjs \
  ShellThin   # o ShellThick / Membrane
```

Paso 2 — Correr ETABS y extraer JSON:
```powershell
$e2k = "...\composite_slab_shellthin_frame.e2k"
$out = "...\composite_slab_shellthin_frame.json"
& powershell -ExecutionPolicy Bypass -File "...\Etabs Powershell\etabs_extract.ps1" `
    -ModelPath $e2k -OutPath $out
```

## Bugs del exporter `.e2k` corregidos

El `e2kExporter.ts` original genera archivos que ETABS abre pero rechaza
(0 nodos, RunAnalysis ret=1). Los 7 fixes aplicados por
`export_e2k_thin_frame.mjs` (post-procesamiento) son:

| # | Bug original | Fix |
|---|---|---|
| 1 | `PROGRAM "<el de antes>"` | → `PROGRAM "ETABS" VERSION "22.6.0"` (ETABS valida string) |
| 2 | Mat_2 (acero) escrito como `TYPE Concrete` | → `TYPE Steel` + FY/FU |
| 3 | Falta `POINTASSIGN ... DIAPH "D1"` por punto y story | → 25 pts × Level_1 (slab) o 5 pts × 4 Levels (wall) |
| 4 | `POINTLOAD` individuales en losa | → `AREALOAD UNIFF DIR GRAV` |
| 5 | `SELFWEIGHT 1` en LOAD PATTERNS | → `SELFWEIGHT 0` (comparación limpia) |
| 6 | `MODELINGTYPE "ShellThin"` hardcoded en SLAB / WALL PROPERTIES | → variable según `arg` |
| 7 | Faltan `GRIDS`, `ANALYSIS OPTIONS`, `MASS SOURCE`, `LOAD CASES` | → inyectados |

**Nota**: Bug #3 es el más crítico. ETABS NO importa puntos sin POINTASSIGN
explícito por cada Story; los trata como huérfanos y los descarta. Esto causa
el síntoma "0 points, 0 frames, 0 areas" en la API tras `OpenFile`.

## Archivos en este benchmark

```
composite_slab_frame/
├── README.md                              ← este archivo
├── export_e2k_thin_frame.mjs              ← generador .e2k (variante via flag)
├── run_composite_slab_thin_frame.mjs      ← Hekatan Struct CLI thin
├── run_composite_slab_thick_frame.mjs     ← Hekatan Struct CLI thick
├── run_composite_wall_membrane_frame.mjs  ← Hekatan Struct CLI membrane
├── composite_slab_shellthin_frame.e2k     ← ETABS modelo thin
├── composite_slab_shellthin_frame.json    ← ETABS resultados thin
├── composite_slab_shellthick_frame.e2k    ← ETABS modelo thick
├── composite_slab_shellthick_frame.json   ← ETABS resultados thick
├── composite_wall_membrane_frame.e2k      ← ETABS modelo membrana (parcial)
└── composite_wall_membrane_frame.json     ← ETABS resultados membrana

../matlab_lib/
├── composite_slab_thin_frame.m            ← MATLAB benchmark thin
├── composite_slab_thick_frame.m           ← MATLAB benchmark thick
├── composite_wall_membrane_frame.m        ← MATLAB benchmark membrana
└── lib/
    ├── frame3d_ke.m                       ← Frame 3D Ke 12x12
    ├── q4_membrane.m                      ← Q4 plane stress 8x8
    ├── q4_plate_thin.m                    ← Kirchhoff Q4 12x12 (alias thick)
    ├── q4_plate_thick.m                   ← Mindlin Q4 12x12 selective
    ├── q4_shell_thin.m                    ← Q4 shell 24x24 (membrane+thin)
    └── q4_shell_thick.m                   ← Q4 shell 24x24 (membrane+thick)
```
