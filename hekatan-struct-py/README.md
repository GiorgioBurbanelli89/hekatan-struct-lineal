# hekatan-struct-py

Motor Python de **Hekatan Struct**. Implementa el mismo solver que el motor
TypeScript/C++ (`hekatan-fem`): frames 3D, shells Q4, análisis modal, muelles
Winkler, diafragma rígido, offsets rígidos estilo CSI — sin un `Model` builder:
trabaja directo sobre `nodes`/`elements`/`NodeInputs`/`ElementInputs` (raw),
igual que el motor JS.

## Instalación

```bash
pip install -e .                 # core (numpy + scipy)
pip install -e ".[viewer]"       # + PyVista 3D
pip install -e ".[sliders]"      # + ipywidgets / trame web app
pip install -e ".[dev]"          # + pytest
```

## Uso mínimo

Leer un modelo `.heks` (el mismo formato que usa el resto de Hekatan Struct)
y resolverlo:

```python
from hekatan_struct.heks import leer_heks, resolver_heks

m = leer_heks("mi_modelo.heks")
res = resolver_heks(m)            # DeformOutputs: .deformations, .reactions

# Desplazamiento del nudo 1 (Ux, Uy, Uz, Rx, Ry, Rz)
print(res.deformations[1])
```

También se puede armar el modelo a mano, sin `.heks`, con la misma firma
que el motor JS:

```python
from hekatan_struct import deform, analyze, NodeInputs, ElementInputs

nodes = [(0.0, 0.0, 0.0), (0.0, 0.0, 4.0)]
elements = [[0, 1]]
ni = NodeInputs(supports={0: (True,) * 6})
ei = ElementInputs(
    elasticities={0: 2.486e7}, shear_moduli={0: 1.0e7},
    areas={0: 0.16}, moments_of_inertia_y={0: 2.13e-3},
    moments_of_inertia_z={0: 2.13e-3}, torsional_constants={0: 3.6e-3},
)
res = deform(nodes, elements, ni, ei)
out = analyze(nodes, elements, ei, res)
```

## Extensiones (no están en el motor JS)

`apply_selfweight`, `apply_rigid_diaphragm`, `apply_cardinal_point_8`,
`apply_stiffness_modifiers`, `compute_picks`, `compare_picks` — ver
`src/hekatan_struct/extensions.py`.

## Tests

Los tests importan `hekatan_struct` desde `src/`, así que hay que exponer
esa ruta (o instalar el paquete en modo editable):

```bash
PYTHONPATH=src python -m pytest tests -q
PYTHONPATH=src python -m pytest tests -m "not slow" -q      # sin los lentos
PYTHONPATH=src python -m pytest tests -m validation -q      # solo cruce vs ETABS/SAP/OpenSees
```

En Windows PowerShell:

```powershell
$env:PYTHONPATH = "src"; python -m pytest tests -q
```

## Estado

**v0.1.0 — Alpha.** El oráculo de referencia es el motor TypeScript/C++
(`hekatan-fem`), no un motor externo: `tests/test_oraculo_ts.py` compara
ambos nudo a nudo.

## Licencia

MIT
