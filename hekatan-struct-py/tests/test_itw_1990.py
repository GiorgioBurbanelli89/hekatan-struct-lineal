# -*- coding: utf-8 -*-
"""Los cuatro tests del paper ITW 1990 sobre la membrana con drilling.

Referencias: Ibrahimbegovic, Taylor & Wilson, IJNME 30:445-457 (1990), y los
`.cpd` de Jorge, de donde sale la traduccion (Test_II / Test_III / Test_IV
didacticos y Muro_Acople_ITW).

Los numeros de aqui son los MISMOS que da el motor C++/WASM del repo, elemento
a elemento — 0.354853 en el cantilever 16x4 y 23.6800 en Cook 8x8. Si alguno de
los dos se mueve sin el otro, es que se han separado.
"""
import numpy as np
import pytest

from hekatan_struct.benchmarks_itw import (
    REF, test_i_patch, test_ii_cantilever, test_iii_cook,
)
from hekatan_struct.elements.membrane_itw import k_membrana_itw, modos_nulos

CUADRADO = [(0, 0), (1, 0), (1, 1), (0, 1)]
TRAPECIO = [(0, 0), (2, 0), (1.5, 1), (0.25, 1)]


@pytest.mark.parametrize("nx", [2, 4, 6, 12])
def test_patch_orden_superior_es_EXACTO(nx):
    """No 'aproximado': exacto. Es lo que separa al ITW de un Q4 con penalizacion.

    ETABS 22 y SAP2000 24 dan 1.500000 y 0.600000 clavados sobre esta misma
    malla (medido con `galpon-bodega-electoral/itw_etabs_oapi.py`). El drilling
    anterior de Hekatan daba -1.70 % en la flecha y -6.34 % en el giro, y no
    convergia al exacto por mucho que se refinara.
    """
    flecha, giro = test_i_patch(nx)
    assert flecha == pytest.approx(REF["patch_flecha"], abs=1e-9)
    assert giro == pytest.approx(REF["patch_giro"], abs=1e-9)


def test_patch_no_depende_de_gamma():
    """El paper dice que la formulacion es insensible a gamma. Se comprueba.

    Tabla V del paper: de gamma/mu = 0.001 a 1000 el resultado cambia en la
    quinta cifra. Aqui el patch test no se mueve NADA en tres ordenes de
    magnitud — que es justo lo contrario de la penalizacion Hughes-Brezzi, donde
    el hemisferio pasaba de -3.6 % a -32.9 % al mover el mismo factor.
    """
    vals = [test_i_patch(6, gamma_fac=g) for g in (0.001, 0.05, 0.4, 1.0, 100.0)]
    for flecha, giro in vals:
        assert flecha == pytest.approx(1.5, abs=1e-9)
        assert giro == pytest.approx(0.6, abs=1e-9)


def test_cantilever_converge_al_exacto():
    """Tabla II. El paper da 0.3445 / 0.3504 / 0.3543; el exacto es 0.3553."""
    v = [test_ii_cantilever(a, b) for a, b in ((4, 1), (8, 2), (16, 4))]
    assert v[0] < v[1] < v[2]                       # monotono hacia el exacto
    assert v[2] == pytest.approx(REF["cantilever"], rel=0.005)


def test_cook_converge_a_23_91():
    """Tabla III, leido en C = (48,52) — el CENTRO del borde, no la esquina."""
    v = [test_iii_cook(k) for k in (2, 4, 8, 16)]
    assert v[0] < v[1] < v[2] < v[3]
    assert v[3] == pytest.approx(REF["cook"], rel=0.005)


@pytest.mark.parametrize("pts", [CUADRADO, TRAPECIO])
def test_tres_modos_nulos_y_ni_uno_mas(pts):
    """El elemento tiene que tener EXACTAMENTE los 3 solidos rigidos.

    Con Gauss 2x2 salen 4 — un mecanismo. Parecia buena idea porque desbloqueaba
    el hemisferio pinzado (de -37 % a -5 %), pero no desbloqueaba: se rompia.
    El paper es explicito: integrando K completo y sumando P de un punto *the
    spurious zero energy modes are prevented*.
    """
    assert modos_nulos(pts, n_gauss=3) == 3
    assert modos_nulos(pts, n_gauss=2, khg=0.0) == 4  # el mecanismo, documentado (sin reloj de arena)


@pytest.mark.parametrize("pts", [CUADRADO, TRAPECIO])
def test_simetrica_y_sin_energia_en_solido_rigido(pts):
    """K simetrica y K por cualquier solido rigido = 0 (incluido el giro)."""
    K = k_membrana_itw(pts, E=2.1e8, nu=0.3, t=0.2)
    assert np.allclose(K, K.T, rtol=0, atol=1e-6 * np.abs(K).max())
    R = np.zeros((12, 3))
    for i, (x, y) in enumerate(pts):
        R[3 * i + 0, 0] = 1.0                        # traslacion x
        R[3 * i + 1, 1] = 1.0                        # traslacion y
        R[3 * i + 0, 2] = -y                         # giro: el drilling vale 1
        R[3 * i + 1, 2] = x
        R[3 * i + 2, 2] = 1.0
    assert np.linalg.norm(K @ R) < 1e-6 * np.linalg.norm(K)


def test_gamma_medido_de_etabs_es_el_defecto():
    """El defecto es 0.4*mu, que es lo MEDIDO de ETABS, no lo del paper (mu).

    Sale de reconstruir la matriz 12x12 de membrana de ETABS entera por
    flexibilidad (galpon-bodega-electoral/celda_membrana12.py) y ajustar gamma
    por minimos cuadrados: 0.400 exacto en las 10 geometrias medidas.
    """
    K04 = k_membrana_itw(CUADRADO, 1.0, 0.2, 1.0)
    K04b = k_membrana_itw(CUADRADO, 1.0, 0.2, 1.0, gamma_fac=0.4)
    assert np.allclose(K04, K04b)
