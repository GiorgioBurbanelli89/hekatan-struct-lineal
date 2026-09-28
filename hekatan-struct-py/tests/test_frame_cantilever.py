"""Cantilever vertical bajo carga lateral — PL³/3EI clásico.

API espejo del fork original v2 (misma firma): raw nodes/elements/nodeInputs/elementInputs sin Model builder.
"""
import numpy as np
import pytest
from hekatan_struct import deform, analyze, NodeInputs, ElementInputs


L = 4.0
B = 0.3
H = 0.5
E = 200e6
NU = 0.3
G = E / (2 * (1 + NU))
P = 10.0


@pytest.fixture
def cantilever_inputs():
    """Construye nodes/elements/inputs igual que ejemplo del fork original v2 JS."""
    nodes = [(0.0, 0.0, 0.0), (0.0, 0.0, L)]
    elements = [[0, 1]]
    A_sec = B * H
    # Col vertical CSI: section "b" along Local 2 (= +X global), "h" along Local 3 (= +Y).
    # I about Local 3 = h × b³ / 12 (bending in X-Z plane around Y axis)
    # I about Local 2 = b × h³ / 12
    Iz_around_3 = H * B**3 / 12   # 0.001125 m⁴
    Iy_around_2 = B * H**3 / 12   # 0.003125 m⁴
    # Saint-Venant J (Roark)
    a_, b_ = max(B, H)/2, min(B, H)/2
    J = a_ * b_**3 * (16/3 - 3.36 * (b_/a_) * (1 - (b_/a_)**4 / 12))
    node_inputs = NodeInputs(
        supports={0: (True, True, True, True, True, True)},
        loads={1: (P, 0, 0, 0, 0, 0)},  # 10 kN +X en top
    )
    element_inputs = ElementInputs(
        elasticities={0: E},
        shear_moduli={0: G},
        poissons_ratios={0: NU},
        areas={0: A_sec},
        moments_of_inertia_z={0: Iz_around_3},
        moments_of_inertia_y={0: Iy_around_2},
        torsional_constants={0: J},
    )
    return nodes, elements, node_inputs, element_inputs


def test_tip_displacement(cantilever_inputs):
    """δ_tip_X = P L³ / (3 E I)  con I = h × b³ / 12 (around Y axis)."""
    nodes, elements, ni, ei = cantilever_inputs
    res = deform(nodes, elements, ni, ei)
    I = H * B**3 / 12
    delta_expected = P * L**3 / (3 * E * I)
    Ux_top = res.deformations[1][0]
    rel_err = abs(Ux_top - delta_expected) / delta_expected
    assert rel_err < 0.02, f"δ_tip: numeric={Ux_top*1000:.3f} mm, expected={delta_expected*1000:.3f} mm, err={rel_err*100:.2f}%"


def test_base_moment_and_shear(cantilever_inputs):
    """M_base = P L,  V = P."""
    nodes, elements, ni, ei = cantilever_inputs
    res = deform(nodes, elements, ni, ei)
    ana = analyze(nodes, elements, ei, res)
    M_base = abs(ana.bendings_z[0][0])  # M3 around Local 3 (=Y) en end I (base)
    V = abs(ana.shears_y[0][0])         # V2 (= Local 2 = X)
    M_expected = P * L
    V_expected = P
    assert abs(M_base - M_expected) / M_expected < 0.02
    assert abs(V - V_expected) / V_expected < 0.02


def test_reactions(cantilever_inputs):
    nodes, elements, ni, ei = cantilever_inputs
    res = deform(nodes, elements, ni, ei)
    r = res.reactions[0]
    assert abs(r[0] - (-P)) < 1e-3, f"R_x: {r[0]}, expected {-P}"
    assert abs(r[2]) < 1e-3, f"R_z: {r[2]}, expected 0"
    # |M_y| = P × L (reacciona el momento del par lateral)
    assert abs(abs(r[4]) - P * L) < 1e-2, f"|R_My|: {abs(r[4])}, expected {P*L}"
