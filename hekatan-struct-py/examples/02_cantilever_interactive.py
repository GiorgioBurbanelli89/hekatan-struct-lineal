"""Ejemplo 02 — Cantilever con SLIDERS interactivos (feel del fork original v2).

Al mover los sliders, el modelo se rebuildea + resuelve + actualiza viewer en
tiempo real.

Sliders:
  - L       : altura col [2 a 8 m]
  - P       : carga horizontal [1 a 100 kN]
  - B       : ancho sección [0.2 a 0.6 m]
  - H       : alto sección [0.3 a 0.9 m]

Run:
    python examples/02_cantilever_interactive.py
"""
from hekatan_struct import deform, NodeInputs, ElementInputs
from hekatan_struct.viewer import View


# Estado mutable (mutado por callbacks de sliders)
state = {
    "L": 4.0,
    "P": 10.0,
    "B": 0.30,
    "H": 0.50,
}
E = 200e6
NU = 0.3
G = E / (2 * (1 + NU))


def build_and_solve():
    L, P, B, H = state["L"], state["P"], state["B"], state["H"]
    nodes = [(0, 0, 0), (0, 0, L)]
    elements = [[0, 1]]
    ni = NodeInputs(
        supports={0: (True, True, True, True, True, True)},
        loads={1: (P, 0, 0, 0, 0, 0)},
    )
    ei = ElementInputs(
        elasticities={0: E}, shear_moduli={0: G}, poissons_ratios={0: NU},
        areas={0: B * H},
        moments_of_inertia_z={0: H * B**3 / 12},
        moments_of_inertia_y={0: B * H**3 / 12},
        torsional_constants={0: 0.196 * min(B, H)**3 * max(B, H)},
    )
    out = deform(nodes, elements, ni, ei)
    return nodes, elements, ni, out


# Build initial
nodes, elements, ni, out = build_and_solve()
view = View(nodes, elements)
view.set_supports(ni).set_loads(ni).set_deformation(out, scale="auto")


def update(_value):
    """Callback al mover cualquier slider: rebuild + redraw."""
    nodes_new, elements_new, ni_new, out_new = build_and_solve()
    view.nodes = list(nodes_new)
    view.elements = list(elements_new)
    view._node_inputs = ni_new
    view.set_deformation(out_new, scale="auto")


def on_L(v): state["L"] = float(v); update(v)
def on_P(v): state["P"] = float(v); update(v)
def on_B(v): state["B"] = float(v); update(v)
def on_H(v): state["H"] = float(v); update(v)


view.add_slider("L (m)",     2.0,  8.0,  state["L"], on_L)
view.add_slider("P (kN)",    1.0,  100.0, state["P"], on_P)
view.add_slider("B sec (m)", 0.20, 0.60, state["B"], on_B)
view.add_slider("H sec (m)", 0.30, 0.90, state["H"], on_H)

view.show()
