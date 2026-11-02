"""DKE y DSE contra la solución EXACTA de la placa cuadrada simplemente apoyada con carga uniforme.

Árbitros analíticos (serie de Navier), no otro programa:
  - Kirchhoff (placa delgada)               -> lo que debe alcanzar el DKE
  - Mindlin, κ = 5/6 (con cortante)         -> lo que debe alcanzar el DSE
Apoyo «duro»: w = 0 en los cuatro bordes y la rotación tangencial = 0.
GDL por nudo [w, θx, θy] con θx = +∂w/∂y, θy = −∂w/∂x: en un borde a lo largo de x la
rotación tangencial es θy; a lo largo de y, θx.
"""
import numpy as np
import pytest
from hekatan_struct import k_dke, k_dse

E, NU = 25e6, 0.2
G = E / (2 * (1 + NU))
KAPPA = 5 / 6


def _flecha_centro(k_elem, N, t, L=1.0, q=1.0):
    nn = (N + 1) ** 2
    K = np.zeros((3 * nn, 3 * nn)); F = np.zeros(3 * nn)
    idx = lambda i, j: j * (N + 1) + i
    h = L / N
    for j in range(N):
        for i in range(N):
            P = np.array([[i * h, j * h], [(i + 1) * h, j * h], [(i + 1) * h, (j + 1) * h], [i * h, (j + 1) * h]])
            nod = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]
            g = np.concatenate([[3 * n, 3 * n + 1, 3 * n + 2] for n in nod])
            K[np.ix_(g, g)] += np.asarray(k_elem(P, E, NU, t))
            for n in nod:
                F[3 * n] += q * h * h / 4
    fijos = set()
    for j in range(N + 1):
        for i in range(N + 1):
            n = idx(i, j)
            if i in (0, N) or j in (0, N):
                fijos.add(3 * n)
            if j in (0, N):
                fijos.add(3 * n + 2)
            if i in (0, N):
                fijos.add(3 * n + 1)
    libres = [k for k in range(3 * nn) if k not in fijos]
    u = np.zeros(3 * nn)
    u[libres] = np.linalg.solve(K[np.ix_(libres, libres)], F[libres])
    return u[3 * idx(N // 2, N // 2)]


def _exacta(t, L=1.0, q=1.0, M=199, cortante=True):
    D = E * t ** 3 / (12 * (1 - NU ** 2))
    w = 0.0
    for m in range(1, M + 1, 2):
        for n in range(1, M + 1, 2):
            k2 = np.pi ** 2 * (m * m + n * n) / L ** 2
            w += (16 * q / (np.pi ** 2 * m * n)) * np.sin(m * np.pi / 2) * np.sin(n * np.pi / 2) * (
                1 / (D * k2 ** 2) + (1 / (KAPPA * G * t * k2) if cortante else 0))
    return w


@pytest.mark.parametrize("t", [0.01, 0.2])
def test_dke_converge_a_kirchhoff(t):
    w_exacta = _exacta(t, cortante=False)
    err = lambda N: abs(_flecha_centro(k_dke, N, t) - w_exacta) / w_exacta
    assert err(8) < 2e-3          # 8x8: < 0.2 %
    assert err(16) < err(8)       # y mejora al refinar


@pytest.mark.parametrize("t", [0.01, 0.2])
def test_dse_converge_a_mindlin(t):
    w_exacta = _exacta(t, cortante=True)
    err = lambda N: abs(_flecha_centro(k_dse, N, t) - w_exacta) / w_exacta
    assert err(16) < 6e-3         # 16x16: < 0.6 % (medido +0.33 %)
    assert err(16) < err(8) < err(4)


def test_dse_ve_el_cortante_y_dke_no():
    """En placa gruesa (t/L = 0.2) el cortante pesa ~18 %: el DSE lo lleva y el DKE no."""
    t = 0.2
    w_dke, w_dse = _flecha_centro(k_dke, 16, t), _flecha_centro(k_dse, 16, t)
    assert w_dse / w_dke == pytest.approx(1.18, abs=0.02)
