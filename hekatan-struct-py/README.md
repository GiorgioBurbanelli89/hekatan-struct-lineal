# hekatan-struct (paquete de PyPI; antes «hekatan-struct-py»)

Motor Python de **Hekatan Struct**. Implementa el mismo solver que el motor
TypeScript/C++ (`hekatan-fem`): frames 3D, shells Q4, análisis modal, muelles
Winkler, diafragma rígido, offsets rígidos estilo CSI — sin un `Model` builder:
trabaja directo sobre `nodes`/`elements`/`NodeInputs`/`ElementInputs` (raw),
igual que el motor JS.

## Qué trae (0.1)

| Elemento | Función | Estado de validación |
|---|---|---|
| **DKE** placa delgada (Wilson) | `k_dke` | Kirchhoff −0.02 % (16×16); = SAP2000, ETABS y el libro |
| **DSE** placa gruesa (Wilson) | `k_dse` | Mindlin +0.33 % (16×16); = libro. **No** = SAP2000/ETABS (CSI usa otra placa gruesa) |
| Membrana | `k_membrana_csi`, `k_membrana_itw` | = ETABS (2e-15 rel.) y SAP2000 (1e-10 %) |
| Drilling DOF (giro en el plano) | `kwargs_drilling` | tipos 3, 4, 7, 8, 9, 13 portados |

⚠️ Del drilling **no** están portados el tipo 5 (burbuja de Taylor) ni el 6 (reloj de arena): lanzan error.
Los casos clásicos de membrana/drilling (voladizo, Cook) aún no tienen test propio en este paquete.

Validar contra SAP2000/ETABS sin abrirlos: `hekatan-csi validar` (código de salida 0/1).

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

## Punto de inserción, brazos rígidos y cubierta de membrana (como ETABS) — 0.2.0

Tres formulaciones de CSI, iguales al motor TS/C++ (≤ 1e-6; en la práctica 1e-14) y medidas contra SAP2000/ETABS.
Detalle, firmas y límites: [`docs/INSERCION_BRAZOS_CUBIERTA.md`](docs/INSERCION_BRAZOS_CUBIERTA.md).

```python
from hekatan_struct import (asignar_punto_insercion, aplicar_brazos_automaticos,
                            membrana_deck_etabs, cubierta_de_e2k)

# A) cardinal point 1-11 (D = canto, B = ancho). Una línea por variante:
asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30)                    # CON restricción rígida: K = RᵀKR, esfuerzos del centroide
asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30, transform=False)   # SIN ella: solo geométrico, K intacta (= centroide)

# B) brazos rígidos por defecto de ETABS (viga ½ columna, columna = canto de viga arriba; RZ = 0)
aplicar_brazos_automaticos(nodes, elements, ei, rz=0.0)              # o `rigidzone auto 0` / `comportamiento etabs` en el .heks

# C) cubierta: paños AREA FLOOR de membrana, conectados a todo nudo que tocan y cargados a las vigas por área tributaria
c = membrana_deck_etabs(nodos, barras, panos, espesor=0.004, rho=7.85, carga_gravedad=0.392, un_sentido=True)
c = membrana_deck_etabs(**cubierta_de_e2k("mercado.e2k", "N7 COL", seccion="Cubierta metalica"))   # la real del mercado
```

En el `.heks`: `frame … D B` (tokens 11-12), `e2klinea ID CARDINALPT n [TRANSFORMSTIFF "Yes"|"No"]`,
`insercion ID cp [0|1]`, `rigidzone auto [f]`, `comportamiento etabs|sap2000|safe`, `deck etabs [oneway]`.

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
pip install hekatan-struct                    # desde PyPI (numpy, scipy)
pip install -e hekatan-struct-py          # desde el repo
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

## Abrir y guardar ficheros de CSI: `.e2k`, `.s2k`, `.f2k`

`hekatan_struct.archivos_csi` lee y escribe los tres formatos sobre el mismo modelo (`ModeloHeks`, el que
resuelve el motor Python). Se elige por la extensión. Lo que no se puede traducir entre programas queda en
una lista `avisos`; nada se pierde en silencio.

```python
import hekatan_struct as hs
m = hs.abrir("modelo.e2k")                  # ETABS -> ModeloCSI (un ModeloHeks + patrones, combos, nombres)
r = hs.guardar(m, "modelo.s2k")             # SAP2000 (tablas v24) ; r.avisos = lo que no viajó
hs.convertir("modelo.e2k", "modelo.f2k")    # abrir + guardar (SAFE: losas, vigas, muelles; avisa el resto)
m = hs.abrir("modelo.s2k", comportamiento="sap2000")   # reglas por defecto de ese programa en el motor
```

```
python -m hekatan_struct convertir entrada.e2k salida.s2k
```

Viajan: nudos, barras (A, I22, I33, J, As2, As3, material, ángulo local, liberaciones, brazos, punto
de inserción), cáscaras (espesor, Thin/Thick/Membrane, 8 modificadores, ángulo), apoyos, diafragmas
(e2k, s2k), muelles de nudo y de área, patrones con peso propio, cargas por patrón y combinaciones lineales.
SAFE (`.f2k`) no tiene diafragmas, paredes ni sólidos, y sus formatos de liberaciones, ángulo y punto de
inserción no están medidos: se avisan. El `.f2k` escribe J×10 (SAFE analiza 0.1·J) y todas las barras como BEAM.
Los casos modal, espectro e historia, las cargas de barra no uniformes y los triángulos no se leen (se avisan).
