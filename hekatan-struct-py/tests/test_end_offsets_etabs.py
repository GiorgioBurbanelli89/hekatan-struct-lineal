"""END LENGTH OFFSETS de CSI — el motor contra ETABS, medido nudo a nudo.

Referencia: `ref_end_offsets_etabs.json`, sacada de ETABS 22.6.0 con
`galpon-bodega-electoral/ref_end_offsets_etabs.py`. Dos voladizos de 6.00 m
(0.30 × 0.50, E = 2e7 kN/m², ν = 0.2) con un offset de 1.00 m puesto una vez en
cada extremo, barriendo RZ = 0 … 1:

  caso "I" — offset en el EMPOTRADO: mide la longitud flexible `Lf = L − RZ·off`
  caso "J" — offset en el LIBRE:     mide el BRAZO (y su signo)

La ley (manual de CSI, y medida): axil y torsión NUNCA se ven afectados (`ux`, `rx` iguales
en los diez casos), y con RZ = 0 el offset es flexible → nada cambia.
"""
import json
import os

import numpy as np
import pytest

from hekatan_struct import deform, NodeInputs, ElementInputs

REF = json.load(open(os.path.join(os.path.dirname(__file__),
                                  "ref_end_offsets_etabs.json"), encoding="utf-8"))
L, OFF, P, N, T = REF["L"], REF["off"], REF["P"], REF["N"], REF["T"]
B, H, E, NU = REF["b"], REF["h"], REF["E"], REF["nu"]
G = E / (2 * (1 + NU))
A = B * H
I33 = B * H ** 3 / 12.0        # flexión vertical (plano 1-2 de la barra horizontal)
I22 = H * B ** 3 / 12.0
# J no se deduce: se toma el que hace que la torsión de ETABS cuadre en RZ = 0.
# Aquí no se mide J, se mide que la torsión NO cambia con RZ.
J_TOR = T * L / (G * REF["casos"][0]["rx"])
TOL = 5e-4                     # 0.05 % — la referencia trae 7 decimales


def _uz(off_i, off_j, rz, carga):
    nodes = [(0.0, 0.0, 0.0), (L, 0.0, 0.0)]
    elements = [[0, 1]]
    node_inputs = NodeInputs(
        supports={0: (True,) * 6},
        loads={1: carga},
    )
    element_inputs = ElementInputs(
        elasticities={0: E}, shear_moduli={0: G}, poissons_ratios={0: NU},
        areas={0: A},
        moments_of_inertia_z={0: I33},   # alrededor del local 3 → flexión vertical
        moments_of_inertia_y={0: I22},
        torsional_constants={0: J_TOR},
        end_offsets={0: (off_i, off_j, rz)},
    )
    out = deform(nodes, elements, node_inputs, element_inputs)
    return out.deformations[1]


@pytest.mark.parametrize("fila", REF["casos"],
                         ids=[f'{c["caso"]}_rz{c["rz"]}' for c in REF["casos"]])
def test_flecha_contra_etabs(fila):
    d = _uz(fila["offI"], fila["offJ"], fila["rz"], (0.0, 0.0, -P, 0.0, 0.0, 0.0))
    assert d[2] == pytest.approx(fila["uz"], rel=TOL), (
        f'caso {fila["caso"]} RZ={fila["rz"]}: Hekatan {d[2]:.7f} vs ETABS {fila["uz"]:.7f}')


@pytest.mark.parametrize("fila", REF["casos"],
                         ids=[f'{c["caso"]}_rz{c["rz"]}' for c in REF["casos"]])
def test_axil_y_torsion_no_los_toca(fila):
    """Literal del manual de CSI: 'The rigid zones never affect axial and torsional
    deformations. The full element length is always assumed to be flexible.'"""
    dx = _uz(fila["offI"], fila["offJ"], fila["rz"], (N, 0.0, 0.0, 0.0, 0.0, 0.0))
    rx = _uz(fila["offI"], fila["offJ"], fila["rz"], (0.0, 0.0, 0.0, T, 0.0, 0.0))
    assert dx[0] == pytest.approx(fila["ux"], rel=TOL)
    assert rx[3] == pytest.approx(fila["rx"], rel=TOL)


def test_rz_cero_es_la_barra_de_siempre():
    """El defecto de ETABS: 723 de 723 barras del galpón con RigidFact = 0."""
    sin = _uz(0.0, 0.0, 0.0, (0.0, 0.0, -P, 0.0, 0.0, 0.0))
    con = _uz(OFF, OFF, 0.0, (0.0, 0.0, -P, 0.0, 0.0, 0.0))
    assert con[2] == pytest.approx(sin[2], rel=1e-12)


def test_estacion_de_reporte_es_la_cara_del_offset():
    """ETABS no reporta en el nudo: reporta en la cara interior del offset.

    Del JSON de referencia, caso "I" (offset de 1.00 m en el empotrado):
    `sta0 = 1.000` y `M = −50` en los cinco RZ, cuando en el nudo vale
    `P·L = 60`. Con RZ = 0 el offset ni siquiera rigidiza y aun así el momento
    reportado es el de la cara.
    """
    from hekatan_struct.elements.frame import frame_moment_at_offset_face
    for fila in REF["casos"]:
        if fila["caso"] != "I":
            continue
        assert fila["sta0"] == pytest.approx(OFF)          # la cara, no el nudo
        m_nudo = -P * L                                    # momento en el empotramiento
        v = -P
        assert frame_moment_at_offset_face(m_nudo, v, OFF) == pytest.approx(
            fila["M_sta0"], rel=1e-9), fila
    # en el caso "J" el offset está en el extremo libre: la primera estación
    # sigue siendo el nudo I (sta0 = 0) y el momento es el entero
    for fila in REF["casos"]:
        if fila["caso"] == "J":
            assert fila["sta0"] == pytest.approx(0.0)
            assert fila["M_sta0"] == pytest.approx(-P * L, rel=1e-9)
            assert fila["staN"] == pytest.approx(L - OFF)
