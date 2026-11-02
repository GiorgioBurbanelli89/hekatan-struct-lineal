# Librería MATLAB modular — Elementos shell/membrana Q4

Funciones reutilizables para construir matrices de rigidez de elementos finitos
Q4 (4 nodos cuadrilátero) en MATLAB R2017a y Hekatan Lab modo MATLAB.

Todas son **portables sin toolboxes** (solo `zeros`, `eye`, `inv`, ops básicos).

## Archivos

| Archivo | Descripción | DOFs/nodo | Tamaño ke | Equivalente ETABS |
|---|---|:---:|:---:|---|
| `q4_membrane.m` | Plane stress 2D (sin flexión) | u, v | 8×8 | Slab/Wall **Membrane** |
| `q4_plate_thin.m` | Placa Kirchhoff CPT (solo flexión out-of-plane) | w, θx, θy | 12×12 | — (interno) |
| `q4_plate_thick.m` | Placa Mindlin-Reissner FSDT (flexión + corte) | w, θx, θy | 12×12 | — (interno) |
| `q4_shell_thin.m` | Shell Kirchhoff (membrana + flexión thin) | u, v, w, θx, θy, θz | 24×24 | **ShellThin** |
| `q4_shell_thick.m` | Shell Mindlin (membrana + flexión + corte) | u, v, w, θx, θy, θz | 24×24 | **ShellThick** |

## Uso

```matlab
addpath('C:\Users\USUARIO\Documents\Hekatan Calc 1.0.0\Matlab\lib');

% Datos del elemento
E   = 2549290.5;   % concrete kN/m^2 (escala tonf-m)
nu  = 0.2;
t   = 0.20;        % espesor en m
ce  = [0,0; 5,0; 5,3; 0,3];   % 4x2 coords en CCW

% Para un muro shear (membrana 2D):
ke_membrane   = q4_membrane(E, nu, t, ce);    % 8x8

% Para un piso Deck Filled (membrana, según ETABS):
ke_deck       = q4_membrane(E, nu, 0.0875, ce);   % deckSlabDepth

% Para una losa thin shell ETABS:
ke_slab_thin  = q4_shell_thin(E, nu, t, ce);  % 24x24

% Para una losa thick shell ETABS:
ke_slab_thick = q4_shell_thick(E, nu, t, ce); % 24x24

% Para un muro shell thin:
ke_wall       = q4_shell_thin(E, nu, t, ce);  % 24x24

% Para un muro shell thick:
ke_wall_thick = q4_shell_thick(E, nu, t, ce); % 24x24
```

## Convenciones DOF

- **Membrana (2 DOFs/nodo)**: `[u, v]` — desplazamiento en plano del elemento.
- **Placa (3 DOFs/nodo)**: `[w, θx, θy]` — flecha + 2 rotaciones en plano.
- **Shell (6 DOFs/nodo)**: `[u, v, w, θx, θy, θz]` — superposición + drilling.

El **drilling DOF** (θz) recibe rigidez pequeña (`alphaDrill = 1e-3 × kmax_membrana`) para evitar singularidad. No afecta resultados físicos.

## Cuándo usar cada uno

```
                  ┌─ Slab Membrane / Deck Filled  → q4_membrane
ETABS SHELLPROP ──┼─ Slab/Wall ShellThin           → q4_shell_thin
                  └─ Slab/Wall ShellThick          → q4_shell_thick

Regla rápida:  t/L < 1/20  → thin (Kirchhoff)
               t/L ≥ 1/20  → thick (Mindlin)
```

## Validación

Estas funciones reproducen los benchmarks del repo `hekatan-struct-lineal`:

- `shear-wall-q4` (W=5×3, t=0.2, P=100kN) → `q4_membrane` → Ux = 4.646e-05 m
  - vs ETABS  4.582e-05 m (1.40%)
  - vs SAP2000 4.629e-05 m (0.37%)
  - vs OpenSees 4.602e-05 m (0.96%)

## Compatibilidad

- MATLAB R2017a y posteriores
- Hekatan Lab Web modo MATLAB (cargar el .m en el editor o vía `addpath`)
- Hekatan Lab CLI: `node --import ./hkl-bootstrap.mjs hkl.mjs script.m`
- Sin dependencia de toolboxes (PDE, Symbolic, etc.)
