# Plate-Thin: 4 formulaciones C++ → WASM interactivo

Solver C++ compilado a WebAssembly que implementa **4 elementos finitos
de placa Kirchhoff** sobre la misma malla, y los visualiza lado a lado
en el navegador con Plotly.

## Las 4 formulaciones

| ID | Nombre | DOF/nodo | Continuidad | Software comercial que lo usa |
|---|---|---|---|---|
| 0 | **Bogner-Fox-Schmit Q4** (BFS) | 4: w, ∂w/∂x, ∂w/∂y, ∂²w/∂x∂y | C¹ conforming | Calcpad / Hekatan Lab |
| 1 | **Batoz DKQ** | 3: w, β_x, β_y | C⁰ + Kirchhoff discreto | **SAP 2000 Plate-Thin** (Wilson DKE) |
| 2 | **Melosh ACM** (Adini-Clough-Melosh) | 3: w, ∂w/∂x, ∂w/∂y | C⁰ non-conforming | Histórico (1963) |
| 3 | **Mindlin Q4 SRI** (selective reduced int.) | 3: w, β_x, β_y | C⁰ con shear | SAP 2000 Plate-Thick |

## Resultados validados contra SAP 2000 v24 (API real)

Caso oficial: placa 6 × 4 × 0.1 m, E = 35 GPa, ν = 0.15, q = 10 kN/m², malla 6×4.

| Métrica | BFS (Calcpad) | **DKQ = SAP 2000** | Melosh | Mindlin SRI |
|---|---|---|---|---|
| w_centro [mm] | 6.6290 | **6.5286** | 6.8576 | 6.3844 |
| Mx centro [kNm/m] | 6.2751 | **6.2249** | 6.4244 | 6.0893 |
| My centro [kNm/m] | 12.7444 | **12.7592** | 13.1917 | 11.7300 |
| Mxy esquina [kNm/m] | -8.3776 | **-7.2541** | -9.0669 | -7.0117 |
| Tiempo solve (browser) | 2 ms | 0.5 ms | 0.4 ms | 0.4 ms |
| % vs SAP medido | Mxy +15.49% | **0.00%** | Mxy +25% | Mxy -3.3% |

**DKQ reproduce SAP 2000 a 4 decimales** (0.00% diff en TODAS las métricas).

## Archivos

```
wasm_plate_formulations/
├── src/
│   └── plate_formulations.cpp     ← 800+ líneas C++17 con las 4 formulaciones
├── built/
│   └── plate_formulations.js      ← WASM compilado embebido (56 KB SINGLE_FILE)
├── viewer.html                    ← interfaz Plotly · 16 contornos interactivos
├── build.sh                       ← script de compilación emscripten
├── test_native.exe                ← binario nativo para depuración
└── README.md                      ← este archivo
```

## Cómo correr

### Opción 1: Ver en navegador (recomendado)
Abrir directamente `viewer.html` en cualquier navegador moderno (Chrome/Edge/Firefox).
Carga ~57 KB de WASM y muestra los 16 contornos en < 3 segundos.

```bash
# Si tenés un servidor local:
cd validacion/wasm_plate_formulations
python -m http.server 8080
# luego abrir http://localhost:8080/viewer.html
```

### Opción 2: Compilar desde el código fuente
```bash
cd validacion/wasm_plate_formulations
bash build.sh           # requiere emscripten en $HOME/emsdk/
```

### Opción 3: Test nativo (sin browser, sin WASM)
```bash
g++ -O2 -std=c++17 src/plate_formulations.cpp -o test_native.exe
./test_native.exe       # imprime los 4 resultados en consola
```

## Diseño técnico

- **Solver:** LU con pivoteo parcial, dense matrix (sin BLAS) — suficiente
  para n < 500 DOFs. Para mallas grandes, sustituir por `Eigen::SparseLU`.
- **Cuadratura:** 4×4 Gauss para BFS, 2×2 Gauss para los otros 3 (igual SAP).
- **Recovery de momentos:**
  - BFS/Melosh: evaluar B en las 4 esquinas y promediar entre elementos.
  - DKQ: 2×2 Gauss + extrapolación bilineal × √3 a corners (igual SAP).
  - Mindlin: derivar β_x, β_y bilineal en corners.
- **Penalty BCs:** k_s = 1e20 sobre la diagonal — equivalente a Lagrange
  multipliers con tolerancia de ~1e-15.
- **WASM:** SINGLE_FILE=1 embebe el .wasm en el .js (sin fetch extra,
  funciona sobre file://).

## Ver también

- `validacion/Calcpad Lab/benchmark_platethin/` — los 3 scripts MATLAB
  con las mismas formulaciones (versión interpretada).
- `validacion/Api CSI Computers/sap2000-api/python/benchmark_platethin/` —
  scripts Python que ejecutan SAP 2000 v24 vía COM.
- `hekatan-struct/presentacion/diapositiva/22_platethin_explicado_cero.html` —
  diapositiva docente que explica la tabla anterior desde cero.
