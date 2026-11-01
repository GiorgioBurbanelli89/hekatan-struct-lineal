# -*- coding: utf-8 -*-
"""hekatan_struct.csi contra lo YA MEDIDO en SAP2000 24 / ETABS 22 (tests/datos_csi/medidas_csi.json.gz).

Umbrales: Shell-Thin 1e-9 %, Shell-Thick cuadrilátero 1e-10 % en 140/142 celdas, membrana ETABS 1e-12 (relativo),
membrana SAP2000 1e-8 % del desplazamiento máximo. Nada se compara contra una cuenta a mano.
"""
import os

import numpy as np
import pytest

from hekatan_struct import csi
from hekatan_struct.csi import comparar as C

if not os.path.exists(C.DATOS):
    pytest.skip("faltan los datos medidos: %s" % C.DATOS, allow_module_level=True)

DATOS = C.cargar()
PLACA = C.celdas_placa(DATOS)
THICK = [r for r in PLACA if r[3] == "thick"]
THIN = [r for r in PLACA if r[3] == "thin"]
SQ = [(0, 0), (1, 0), (1, 1), (0, 1)]


def test_conteo_de_celdas():
    assert len(THICK) == 142 and len(THIN) == 1
    assert sum(r[2] == "ETABS" for r in THICK) == 4


@pytest.mark.parametrize("conj,nm,juez,tipo,e", [r for r in THICK if r[1] not in C.ARTEFACTOS],
                         ids=["%s:%s" % (r[0], r[1]) for r in THICK if r[1] not in C.ARTEFACTOS])
def test_shell_thick_cuad(conj, nm, juez, tipo, e):
    assert e < 1e-10, (juez, e)          # %


def test_shell_thick_140_de_142():
    assert sum(r[4] < 1e-10 for r in THICK) == 140


@pytest.mark.parametrize("nm,lim", [("solo_m11", 0.02), ("solo_m22", 1.0)])
def test_shell_thick_artefacto_un_modificador(nm, lim):
    """Pendiente conocido (pivote de redondeo de CSI): se vigila que no cambie de tamaño."""
    e = next(r[4] for r in THICK if r[1] == nm)
    assert e < lim


def test_shell_thin_dkq_vs_etabs():
    for r in THIN:
        assert r[4] < 1e-9, r


@pytest.mark.parametrize("celda,e", C.celdas_membrana_etabs(DATOS))
def test_membrana_vs_etabs(celda, e):
    assert e < 1e-12


@pytest.mark.parametrize("malla,e", C.mallas_membrana_sap(DATOS))
def test_membrana_vs_sap2000_mallas_itw(malla, e):
    assert e < 1e-8                       # % de |u|max


@pytest.mark.parametrize("nu", [0.0, 0.2, 0.45])
def test_membrana_leyes_theta_theta(nu):
    K = csi.k_membrana_csi(SQ, 1.0, nu, 1.0)
    Ktt = K[2::3, 2::3] * 2 * (1 + nu)
    q = lambda v: np.asarray(v) / 2 @ Ktt @ np.asarray(v) / 2  # noqa: E731
    assert q([1, 1, 1, 1]) == pytest.approx(0.1, rel=1e-12)
    assert q([1, 1, -1, -1]) == pytest.approx(1 / (18 - 6 * nu), rel=1e-12)
    assert q([1, -1, 1, -1]) == pytest.approx(2e-4, rel=1e-9)


@pytest.mark.parametrize("f,P,n", [
    (csi.k_membrana_csi, [(0, 0), (1.0, 0), (0.8, 0.9), (0.15, 1.0)], 12),
    (csi.k_shell_thin_dkq, [(0, 0), (2, .2), (2.2, 1.8), (.1, 1.6)], 12),
    (csi.k_shell_thin_dkt, [(0, 0), (2, 0.5), (0.5, 1.5)], 9),
    (csi.k_shell_thick_cuad, [(0, 0), (2, .2), (2.2, 1.8), (.1, 1.6)], 12),
    (csi.k_shell_thick_tri, [(0, 0), (2, 0.5), (0.5, 1.5)], 9),
    (csi.k_dke, [(0, 0), (2, .2), (2.2, 1.8), (.1, 1.6)], 12),
    (csi.k_dse, [(0, 0), (2, .2), (2.2, 1.8), (.1, 1.6)], 12)])
def test_firma_homogenea_y_tres_modos_nulos(f, P, n):
    K = f(P, 2.5e7, 0.2, 0.1)
    assert K.shape == (n, n)
    w = np.abs(np.linalg.eigvalsh((K + K.T) / 2))
    assert int((w < 1e-9 * w.max()).sum()) == 3


def test_dke_es_shell_thin():
    P = [(0, 0), (4, 0), (3.2, 2.5), (.6, 2.2)]
    a, b = csi.k_dke(P, 2.5e7, 0.2, 0.1), csi.k_shell_thin_dkq(P, 2.5e7, 0.2, 0.1)
    assert np.abs(a - b).max() < 1e-12 * np.abs(b).max()


def test_dse_no_es_shell_thick():
    """El DSE del libro NO es el Thick de CSI (documentado): la diferencia es grande, no ruido."""
    P = [(0, 0), (1, 0), (1, 1), (0, 1)]
    a, b = csi.k_dse(P, 2.5e7, 0.2, 0.2), csi.k_shell_thick_cuad(P, 2.5e7, 0.2, 0.2)
    assert np.linalg.norm(a - b) / np.linalg.norm(b) > 1e-2


def test_alias_hekatan_struct_py():
    import hekatan_struct_py as H
    assert H.csi.k_shell_thick_cuad is csi.k_shell_thick_cuad
