# -*- coding: utf-8 -*-
"""Modelo multi-elemento de placas contra Navier (placa cuadrada, q uniforme) y equilibrio. kN y m."""
import numpy as np
import pytest

from hekatan_struct.placa_modelo import Placa

E, NU, T, A, Q = 2.1e8, 0.3, 0.1, 4.0, -10.0
D = E * T ** 3 / (12 * (1 - NU ** 2))
# coeficientes de Timoshenko (nu = 0.3): w = a q L^4/D, M = b q L^2
REF = {"simple": (0.00406, 0.0479), "empotrado": (0.00126, 0.0231)}


def corre(tipo, bc, n):
    p = Placa.rectangular(A, A, n, n, tipo, E, NU, T)
    p.apoyar_borde(bc); p.carga_area(Q); r = p.solve()
    c = p.nodo_cercano(A / 2, A / 2)
    return p, r, r["w"][c] / (Q * A ** 4 / D), p.momentos_nodales()[c] / (Q * A ** 2)


@pytest.mark.parametrize("bc", ["simple", "empotrado"])
@pytest.mark.parametrize("tipo,tol", [("dkq", 0.03), ("dkt", 0.03), ("thick", 0.05)])
def test_navier_malla_fina(tipo, bc, tol):
    p, r, w, M = corre(tipo, bc, 16)
    wr, mr = REF[bc]
    assert abs(w - wr) / wr < tol
    assert abs(abs(M[0]) - mr) / mr < tol
    assert M[0] < 0 and abs(M[0] - M[1]) < 1e-9 * abs(M[0]) + 1e-12   # signo CSI: vano positivo con gravedad; Mxx = Myy


@pytest.mark.parametrize("tipo", ["dkq", "dkt"])
@pytest.mark.parametrize("bc", ["simple", "empotrado"])
def test_convergencia_al_refinar(tipo, bc):
    wr = REF[bc][0]
    err = [abs(corre(tipo, bc, n)[2] - wr) for n in (2, 4, 8, 16)]
    assert err[1] < err[0] and err[3] < err[0] / 10 and err[3] < 3e-5   # la ref. de tabla tiene 3 cifras


@pytest.mark.parametrize("tipo", ["dkq", "dkt", "thick"])
@pytest.mark.parametrize("bc", ["simple", "empotrado"])
def test_equilibrio_sumR(tipo, bc):
    p, r, _, _ = corre(tipo, bc, 6)
    assert abs(r["carga_total"] - Q * A * A) < 1e-9
    assert abs(r["sumRz"] + r["carga_total"]) < 1e-8 * abs(Q * A * A)


def test_equilibrio_momentos_alrededor_de_x():
    # carga puntual excentrica: sum Rz = P, y sum(Rz*y) + sum(Rmx) = P*yc (equilibrio de momentos)
    p = Placa.rectangular(A, A, 6, 6, "dkq", E, NU, T); p.apoyar_borde("simple")
    c = p.nodo_cercano(1.0, 2.0); p.carga_nodal(c, Fz=-7.0); r = p.solve()
    assert abs(r["sumRz"] - 7.0) < 1e-8
    assert abs(np.sum(r["R"][:, 0] * p.nodos[:, 1]) - 7.0 * p.nodos[c, 1]) < 1e-8


def test_png(tmp_path):
    p, *_ = corre("dkq", "simple", 4)
    for que in ("w", "M11"):
        f = p.png(str(tmp_path / (que + ".png")), que)
        assert (tmp_path / (que + ".png")).stat().st_size > 5000


def test_mallador_y_errores():
    nod, el = Placa.malla_rectangular(2, 1, 4, 2, triangulos=True)
    assert len(nod) == 15 and len(el) == 16
    with pytest.raises(ValueError): Placa(nod, el, "dkq", E, NU, T)
    with pytest.raises(ValueError): Placa.rectangular(1, 1, 2, 2, "dkq", E, NU, T).solve()
