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

## Placas de Batoz y triángulo grueso de CSI (`hekatan_struct_py.placas`)

DKT (Batoz, Bathe y Ho 1980), DKQ (Batoz y Ben Tahar 1982) y el triángulo Shell-Thick de CSI (medido del binario), con K,
momentos nodales (signo CSI, kN·m/m) y cortante V13/V23, en kN y m. Mismo álgebra que las hojas de Hekatan LISP 152-154.

```bash
pip install -e hekatan-struct-py          # numpy, scipy; matplotlib para el PNG
python -m hekatan_struct_py placa --tipo dkt   --nodos 0 0 2 0.5 0.5 1.5 --png dkt.png
python -m hekatan_struct_py placa --tipo thick --nodos 0 0 2 0.5 0.5 1.5 --json
python -m hekatan_struct_py placa --tipo dkq   --nodos 0 0 2 0.2 2.2 1.8 0.1 1.6 --png dkq.png --comp 1
```
```python
from hekatan_struct_py.placas import k_dkt, momentos, campo_patch
P = [(0, 0), (2, 0.5), (0.5, 1.5)]
M = momentos("thick", P, 24850000, 0.2, 0.1, campo_patch(P))     # M (3×3) y V = (V13, V23)
```
`pytest tests/test_placas_batoz.py` — 17 pruebas contra SAP2000/ETABS (hojas) y contra el WASM de Struct.

### Modelo multi-elemento de placas (`Placa`)

Malla de triángulos (DKT, thick) o cuadriláteros (DKQ), apoyos simple/empotrado, cargas nodales y de área (consistente),
`solve()` → w, θ, reacciones, momentos nodales (signo CSI) y PNG. Usa los K validados de `placas.py`.

```python
from hekatan_struct_py import Placa
p = Placa.rectangular(4, 4, 16, 16, "dkq", E=2.1e8, nu=0.3, t=0.1)     # a, b, nx, ny, tipo
p.apoyar_borde("simple")                                               # o "empotrado"
p.carga_area(-10)                                                      # kN/m2 (+w)
r = p.solve()                                                          # r["w"], r["R"], r["sumRz"]
M = p.momentos_nodales()                                               # (n×3) M11 M22 M12
p.png("w.png", "w"); p.png("m11.png", "M11")
```
`pytest tests/test_placa_modelo.py` — Navier/Timoshenko (simple 0.00406 y 0.0479; empotrada 0.00126 y 0.0231), convergencia y ΣR.
Ejemplo: `examples/06_placa_navier.py`.
