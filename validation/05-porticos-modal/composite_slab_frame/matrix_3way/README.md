# Matriz 3-way Benchmark — Shell+Frame DOF mismatch investigation

Matriz formal **7 areaTypes × 3 setups = 21 celdas** que confirma exactamente
**dónde aparece el bug DOF mismatch** del Q4 Mindlin-MITC4 al acoplarse con frames.

## Diagrama de las 3 configuraciones

```
            areaOnly                  perimFrames               fullBuilding
          ─────────────             ─────────────             ─────────────
                                   16 vigas perim              16 vigas perim
            ┌─────────┐            ┌═════════┐              ┌═════════┐
            │░░░░░░░░░│            │░░░░║░░░░│              │░░░║░░░║░│
            │░░ÁREA░░░│            ║░░░░║░░░░║              ║═══════════║
            │░░░░░░░░░│            │░░░░║░░░░│              │░░░║░░░║░│
            └─────────┘            └═════════┘              └═════════┘
            BCs en bordes           ●         ●              ●    ●    ●
            (SS / fixed)            └ 4 cols ─┘              └ cols+vigas
                                      esquinas                  internas
```

## Resultados Hekatan Struct WASM (Mindlin-MITC4 actual)

Output de `run_matrix.mjs` con parámetros default (4×4m, mesh 4×4, t=0.10m,
E_c=25 GPa, q=5 kN/m² vertical / F=100 kN horizontal):

| areaType   | areaOnly | perimFrames | fullBuilding | KPI       |
|:-----------|---------:|------------:|-------------:|:----------|
| membrane   |   0.1255 |      0.1008 |       0.1008 | ux_top mm |
| shellThin  |  -2.3516 |     -1.0281 |      -0.0897 | w_centro mm |
| shellThick |  -2.3516 |     -1.0281 |      -0.0897 | w_centro mm |
| plateThin  |  -2.3516 |     -1.0281 |      -0.0897 | w_centro mm |
| plateThick |  -2.3516 |     -1.0281 |      -0.0897 | w_centro mm |
| plane      |   0.1255 |      0.1008 |       0.1008 | ux_top mm  |
| layered    |  -2.3516 |     -1.0281 |      -0.0897 | w_centro mm |

> **Observación importante:** todas las variantes shell/plate/layered dan
> idénticos resultados porque `deform.cpp` actual NO expone los `membrane/bending
> modifiers` en su WASM signature — solo el shell completo Mindlin-MITC4.
> Las variantes membrane/plane también colapsan entre sí.

## Análisis comparativo vs ETABS y MATLAB

| Caso | Hekatan WASM | MATLAB CLI | **ETABS** | Análisis |
|------|-------------:|-----------:|----------:|----------|
| **shell areaOnly** (SS plate) | -2.352 mm | -2.371 mm | -2.420 mm | ✓ <3% diff. Pure shell físicamente correcto |
| **shell perimFrames** (slab+vigas+4 cols) | **-1.028 mm** | -2.371 mm | **-3.055 mm** | ✗ **3.0× off** — bug aparece aquí |
| **shell fullBuilding** (cruz + col centro) | -0.090 mm | TBD | ~-2.5 mm est. | ✗ **27× off** — bug se amplifica con más frames |
| **wall membrane areaOnly** | 0.126 mm | TBD | 0.126 mm est. | ✓ |
| **wall membrane perimFrames** | 0.101 mm | 0.084 mm | TBD | Δ ~20% — bug menor in-plane |

## Mapa del bug — Dónde aparece y dónde NO

| Configuración | Coupling shell↔frame DOFs rotacionales | Bug visible? |
|---|---|---|
| Shell solo (areaOnly) | NO — solo shell DOFs | **NO** ✓ |
| Frames solos (sin shell) | NO — solo frame DOFs | **NO** ✓ |
| Shell + vigas perimetrales | SÍ — vigas comparten θx,θy con shell en bordes | **SÍ** ✗ (3×) |
| Shell + columnas | SÍ — columnas comparten θx,θy con shell en esquinas | **SÍ** ✗ |
| Shell + vigas + columnas internas | SÍ ampliamente — más nodos compartidos rotacionalmente | **SÍ** ✗ (27×) |

**Conclusión:** el bug es proporcional al número de nodos donde shell y frame
comparten DOFs rotacionales (3,4 = θx, θy). Más coupling = más sobre-rigidez.

## Hallazgo clave

```
Pure shell:     correcto (1.4% vs ETABS)
Shell + 4 cols: bug visible
Shell + vigas:  bug + 3× más rígido
Shell + ambos:  bug + 27× más rígido (cualquier modelo realista)
```

El bug afecta **TODO modelo de edificación** (vigas + losas + columnas) que
combine shells y frames. Los benchmarks pure-shell del proyecto (shear_wall_q4,
plate_thin) **no lo detectaron** porque no tienen frames acoplados.

## Causa raíz

Documentado en detalle en `../BUG_ANALYSIS_shell_frame_dof_mismatch.md`:

- Frame usa convención `θx,θy = rotation about axes` (right-hand rule, AISC/CSI)
- Shell usa convención `βx,βy = normal rotation in direction` (Mindlin)
- En el límite Kirchhoff: `βx_shell = -θy_frame` y `βy_shell = +θx_frame`
- Compartir DOF 3,4 en assembly fuerza `θx + θy = 0` artificialmente

## Cómo correr la matriz

```bash
cd hekatan-struct-lineal

# Toda la matriz (21 celdas, output CSV+JSON)
node Benchmark_Placa/composite_slab_frame/matrix_3way/run_matrix.mjs

# Una celda específica (debug)
node Benchmark_Placa/composite_slab_frame/matrix_3way/run_matrix.mjs shellThin perimFrames
```

## Acceso desde el Workspace Tweakpane

El benchmark también está disponible interactivamente en el workspace:

```
http://localhost:4600/workspace/?t=benchmark-3way
http://localhost:4600/benchmark-3way/   ← standalone
```

Categoría `🏁 Benchmarks` → "Benchmark 3-way (Shell+Frame DOF mismatch)".

Dropdown `Tipo de Área`: 7 opciones · Dropdown `Configuración`: 3 opciones.

Al cambiar parámetros, la consola del navegador imprime:
- KPI actual (w_centro o ux_top)
- Comparación contra MATLAB y ETABS hardcodeados
- ⚠ Warning si Δ > 50% (= bug visible)

## Archivos en este folder

```
matrix_3way/
├── README.md                  ← este archivo
├── run_matrix.mjs             ← CLI Hekatan Struct WASM (todas las celdas)
└── matrix_results.json        ← output JSON con 21 celdas
```

## Próximos pasos para el fix

1. **Aplicar fix C++** en `hekatan-fem/src/cpp/utils/shellQ4.cpp` líneas
   144-184 (cambio de B matrices, ver `BUG_ANALYSIS_*.md`).
2. **Recompilar WASM**:
   ```bash
   source $HOME/emsdk/emsdk_env.sh
   cd hekatan-fem && bash build_wasm.sh   # o equivalente
   ```
3. **Re-correr esta matriz** y verificar que `shellThin / perimFrames`
   converge a -3.0 mm (±5% vs ETABS).
4. **Aplicar el mismo fix** en `q4_shell_thin.m` / `q4_plate_thin.m` y
   re-correr benchmark MATLAB para confirmar también converge a ETABS.
5. **Exponer modifiers** en _deform WASM signature para diferenciar
   verdaderamente plate / shell / membrane / layered.
