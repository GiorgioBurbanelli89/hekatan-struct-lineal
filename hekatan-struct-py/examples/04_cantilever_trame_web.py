"""Ejemplo 04 — Cantilever en web app (trame + vuetify).

Web app que corre en localhost:8080 con UI vuetify (look del fork original v2 web):
  - 3D viewer izquierda
  - Panel de sliders derecha
  - Update en tiempo real

Run:
    pip install -e ".[sliders]"
    python examples/04_cantilever_trame_web.py
    # Abrir http://localhost:8080
"""
import numpy as np
from trame.app import get_server
from trame.ui.vuetify3 import SinglePageWithDrawerLayout
from trame.widgets import vuetify3 as v3, vtk as vtk_widgets

from hekatan_struct import deform, NodeInputs, ElementInputs
from hekatan_struct.viewer import _frames_to_lines, _support_glyphs, _load_arrows
import pyvista as pv


server = get_server(client_type="vue3")
state, ctrl = server.state, server.controller

state.update({
    "L": 4.0,
    "P": 10.0,
    "B": 0.30,
    "H": 0.50,
    "result_text": "Loading...",
})

E_MAT = 200e6
NU = 0.3
G_MAT = E_MAT / (2 * (1 + NU))

plotter = pv.Plotter(off_screen=True)
plotter.set_background("white")
plotter.add_axes(line_width=3)
actors = {}


def build_and_solve():
    L, P, B, H = state.L, state.P, state.B, state.H
    nodes = [(0, 0, 0), (0, 0, L)]
    elements = [[0, 1]]
    ni = NodeInputs(supports={0: (True,)*6}, loads={1: (P, 0, 0, 0, 0, 0)})
    ei = ElementInputs(
        elasticities={0: E_MAT}, shear_moduli={0: G_MAT}, poissons_ratios={0: NU},
        areas={0: B * H},
        moments_of_inertia_z={0: H * B**3 / 12},
        moments_of_inertia_y={0: B * H**3 / 12},
        torsional_constants={0: 0.196 * min(B, H)**3 * max(B, H)},
    )
    out = deform(nodes, elements, ni, ei)
    return nodes, elements, ni, out


def render():
    global actors
    nodes, elements, ni, out = build_and_solve()
    for a in actors.values():
        plotter.remove_actor(a)
    actors.clear()
    und = _frames_to_lines(nodes, elements)
    if und:
        actors["und"] = plotter.add_mesh(und, color="#1f3a93", line_width=5)
    sup = _support_glyphs(nodes, ni, size=state.L * 0.1)
    if sup:
        actors["sup"] = plotter.add_mesh(sup, color="#c0392b")
    max_load = max(np.linalg.norm(L[:3]) for L in ni.loads.values())
    lds = _load_arrows(nodes, ni, scale=state.L * 0.3 / max_load)
    if lds:
        actors["lds"] = plotter.add_mesh(lds, color="#27ae60")
    max_d = max(max(abs(d[0]), abs(d[1]), abs(d[2])) for d in out.deformations.values())
    scale = (state.L * 0.25) / max_d if max_d > 1e-9 else 1.0
    def_nodes = [
        (n[0] + out.deformations[i][0]*scale,
         n[1] + out.deformations[i][1]*scale,
         n[2] + out.deformations[i][2]*scale)
        for i, n in enumerate(nodes)
    ]
    defm = _frames_to_lines(def_nodes, elements)
    if defm:
        actors["def"] = plotter.add_mesh(defm, color="#c0392b", line_width=4)
    plotter.view_isometric()
    Ux = out.deformations[1][0] * 1000
    state.result_text = (
        f"Ux_top = {Ux:.2f} mm    R_x = {out.reactions[0][0]:.2f} kN\n"
        f"|M_y|  = {abs(out.reactions[0][4]):.2f} kN·m   Scale = {scale:.1f}×"
    )
    ctrl.view_update()


@state.change("L", "P", "B", "H")
def _on_change(**kwargs):
    render()


with SinglePageWithDrawerLayout(server) as layout:
    layout.title.set_text("Hekatan Struct Python — Cantilever")
    with layout.drawer as drawer:
        drawer.width = 360
        with v3.VContainer():
            v3.VSubheader("Parámetros")
            v3.VSlider(v_model=("L", state.L), min=2.0, max=8.0, step=0.1,
                       label="L (m)", thumb_label="always")
            v3.VSlider(v_model=("P", state.P), min=1.0, max=100.0, step=0.5,
                       label="P (kN)", thumb_label="always")
            v3.VSlider(v_model=("B", state.B), min=0.20, max=0.60, step=0.01,
                       label="B sec (m)", thumb_label="always")
            v3.VSlider(v_model=("H", state.H), min=0.30, max=0.90, step=0.01,
                       label="H sec (m)", thumb_label="always")
            v3.VDivider(classes="my-4")
            v3.VSubheader("Resultados")
            v3.VTextarea(v_model=("result_text",), readonly=True, rows=4,
                         classes="font-mono")
    with layout.content:
        with v3.VContainer(fluid=True, classes="pa-0", style="height: 100vh;"):
            view = vtk_widgets.VtkRemoteView(plotter.ren_win, ref="view")
            ctrl.view_update = view.update


render()


if __name__ == "__main__":
    server.start(port=8080)
