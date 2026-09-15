# -*- coding: utf-8 -*-
"""La regla de OCHO puntos del ITW 1991 — ec. (30).

La regla de ocho puntos, evaluada con `W_alpha` cerca de 1, se parece a Gauss
2x2 porque

    alpha(W_alpha = 1) = 1/(9*1)^(1/4) = 9^(-1/4) = 1/sqrt(3)

Estos tests fijan la diferencia:

  * la regla es una CUADRATURA de verdad (integra exacto 1, r^2 y r^2 s^2);
  * con ella el elemento tiene TRES modos nulos, y con 2x2 de verdad tiene
    CUATRO — que es justo lo que el paper promete: *«has a similar effect […] as
    the 2x2 Gaussian quadrature but does not produce a rank-deficient matrix»*;
  * el patch test de orden superior sigue saliendo EXACTO.

Extraccion del paper: `registros/itw_1991/ITW_1991.md`.
"""
import numpy as np
import pytest

from hekatan_struct.benchmarks_itw import test_i_patch
from hekatan_struct.elements.membrane_itw import modos_nulos, puntos_itw8

# El punto de Gauss 2x2.
GAUSS_2X2 = 0.5773502691896258

GEOMETRIAS = [
    ("cuadrado", [(0, 0), (1, 0), (1, 1), (0, 1)]),
    ("rectangulo", [(0, 0), (2, 0), (2, 0.5), (0, 0.5)]),
    ("trapecio", [(0, 0), (2, 0), (1.5, 1), (0.25, 1)]),
    ("paralelogramo", [(0, 0), (1, 0), (1.4, 0.9), (0.4, 0.9)]),
]

ITW8 = dict(regla="itw8", con_burbuja=False)


@pytest.mark.parametrize("w_alpha", [1.0, 0.999, 0.99, 0.95, 0.9])
def test_la_regla_integra_lo_que_dice_integrar(w_alpha):
    """Suma de pesos = area, y exacta en `r^2` y `r^2 s^2`.

    Las dos formulas de la ec. (30) salen precisamente de imponer estas dos
    ultimas condiciones, asi que si fallan es que la formula esta mal escrita.
    """
    P = puntos_itw8(w_alpha)
    assert len(P) == (4 if w_alpha == 1.0 else 8)
    assert sum(w for _, _, w in P) == pytest.approx(4.0, abs=1e-12)
    assert sum(w * r * r for r, _, w in P) == pytest.approx(4.0 / 3.0, abs=1e-12)
    assert sum(w * r * r * s * s for r, s, w in P) == pytest.approx(4.0 / 9.0, abs=1e-12)
    # simetrica: los impares se van
    assert sum(w * r for r, _, w in P) == pytest.approx(0.0, abs=1e-12)
    assert sum(w * r ** 3 * s for r, s, w in P) == pytest.approx(0.0, abs=1e-12)


def test_con_w_alpha_1_la_alpha_es_el_punto_de_gauss_2x2():
    """`alpha(W_alpha = 1)` es, al ultimo bit, 1/sqrt(3)."""
    alpha = puntos_itw8(1.0)[0][0]
    assert abs(alpha) == GAUSS_2X2
    # y `beta` desaparece: con W_beta = 0 los cuatro puntos extra no existen
    assert len(puntos_itw8(1.0)) == 4


@pytest.mark.parametrize("nombre,pts", GEOMETRIAS)
def test_ocho_puntos_da_tres_modos_nulos_y_dos_por_dos_da_cuatro(nombre, pts):
    """La promesa del paper, medida: mismo efecto que 2x2 pero sin perder rango."""
    # 2x2 SIN el reloj de arena es un mecanismo; con el reloj del tipo 6
    # (khg=2e-4, medido por flexibilidad) vuelve a 3 modos nulos.
    assert modos_nulos(pts, n_gauss=2, khg=0.0) == 4, f"{nombre}: 2x2 sin reloj deberia ser mecanismo"
    assert modos_nulos(pts, n_gauss=2, khg=2.0e-4) == 3, f"{nombre}: 2x2 con reloj tiene 3 nulos"
    for wa in (0.999, 0.99, 0.95):
        n = modos_nulos(pts, w_alpha=wa, **ITW8)
        assert n == 3, f"{nombre}: con W_alpha={wa} salen {n} modos nulos, no 3"


@pytest.mark.parametrize("w_alpha", [0.999, 0.99, 0.95])
def test_el_patch_test_sigue_exacto_con_la_regla_de_ocho_puntos(w_alpha):
    """*«Both the triangular and the quadrilateral shell elements pass the patch test»*.

    Flexion pura: la respuesta no es aproximada, es 1.5 y 0.6 exactos. Un
    elemento que no los da esta mal formulado, y refinar la malla no lo arregla.
    """
    flecha, giro = test_i_patch(6, w_alpha=w_alpha, **ITW8)
    assert flecha == pytest.approx(1.5, rel=1e-9)
    assert giro == pytest.approx(0.6, rel=1e-9)


def test_el_resultado_no_depende_de_w_alpha():
    """El paper dice «close to 1» y no fija el valor. Aqui se ve por que: da igual.

    Importa porque `W_alpha` fue el candidato inmediato a explicar el 16 % que
    separa nuestra matriz de la 12x12 medida de ETABS. No puede serlo: mover
    `W_alpha` de 0.95 a 0.999 no cambia el resultado ni en la sexta cifra, asi
    que la diferencia esta en otro sitio.
    """
    vals = [test_i_patch(6, w_alpha=wa, **ITW8) for wa in (0.95, 0.99, 0.999)]
    for f, g in vals[1:]:
        assert f == pytest.approx(vals[0][0], rel=1e-10)
        assert g == pytest.approx(vals[0][1], rel=1e-10)


def test_la_regla_de_gauss_no_cambio():
    """El defecto sigue siendo el ITW 1990; esto no es una migracion silenciosa."""
    for nombre, pts in GEOMETRIAS:
        assert modos_nulos(pts) == 3, nombre
    flecha, giro = test_i_patch(6)
    assert flecha == pytest.approx(1.5, rel=1e-9)
    assert giro == pytest.approx(0.6, rel=1e-9)


def test_w_alpha_fuera_de_rango_falla_en_vez_de_dar_numeros_raros():
    for malo in (0.0, -0.1, 1.5):
        with pytest.raises(ValueError):
            puntos_itw8(malo)


# Un cuadrilatero GENERAL: ningun par de lados paralelo. Ninguna de las cuatro
# geometrias del banco de paridad lo es (cuadrado, rectangulo, paralelogramo y
# un trapecio con los lados de arriba y abajo paralelos), y esa laguna hizo que
# una comparacion en ejes distintos pasara meses sin cantar.
QUAD_GENERAL = [(0, 0), (1.0, 0), (0.8, 0.9), (0.15, 1.0)]


def _triada_como_el_cpp(pts):
    """La triada de `getLocalStiffnessMatrixShellQ4`: el eje X es la MEDIA de
    dos lados, `(p1-p0) + (p2-p3)`, no un lado suelto."""
    P = np.array([(x, y, 0.0) for x, y in pts])
    lx = (P[1] - P[0]) + (P[2] - P[3]); lx /= np.linalg.norm(lx)
    lz = np.cross(P[2] - P[0], P[3] - P[1]); lz /= np.linalg.norm(lz)
    ly = np.cross(lz, lx); ly /= np.linalg.norm(ly)
    lx = np.cross(ly, lz); lx /= np.linalg.norm(lx)
    return P, lx, ly


@pytest.mark.parametrize("tipo", [3, 7, 8, 9])
def test_el_elemento_es_invariante_a_los_ejes_locales(tipo):
    """La misma K, calculada en ejes locales y girada, tiene que dar la de globales.

    No es un detalle: si NO fuera invariante, elegir los ejes locales de una
    forma u otra cambiaria el resultado fisico, y como el C++ los elige distinto
    que las coordenadas globales (media de dos lados contra un lado), dos mallas
    identicas numeradas al reves darian estructuras distintas.

    Ademas es el test que le faltaba al banco de paridad: con cuadrado,
    rectangulo, paralelogramo o trapecio de lados paralelos los dos sistemas
    COINCIDEN, asi que la propiedad no se estaba comprobando en ninguna parte.
    """
    from hekatan_struct.elements.membrane_itw import k_membrana_itw, kwargs_drilling
    E, nu, t = 2.2e7, 0.2, 0.20
    pts = QUAD_GENERAL
    P, lx, ly = _triada_como_el_cpp(pts)
    # NumPy 2 ELIMINO `np.cross` para vectores de 2 componentes (deprecado desde
    # 1.25, ValueError desde 2.0). El producto cruzado 2D es un escalar y se
    # escribe a mano; si no, este assert revienta ANTES de probar nada y el test
    # sale rojo por la version de numpy y no por el elemento, que esta bien.
    _u, _v = (P[1] - P[0])[:2], (P[2] - P[3])[:2]
    assert abs(_u[0]*_v[1] - _u[1]*_v[0]) > 1e-6, \
        "esta geometria tiene lados paralelos: no prueba lo que dice"

    c = P.mean(axis=0)
    locales = [((p - c) @ lx, (p - c) @ ly) for p in P]
    K_loc = k_membrana_itw([tuple(q) for q in locales], E, nu, t, **kwargs_drilling(tipo))
    K_glo = k_membrana_itw(pts, E, nu, t, **kwargs_drilling(tipo))

    T = np.zeros((12, 12))                       # local -> global
    for i in range(4):
        T[3 * i:3 * i + 2, 3 * i:3 * i + 2] = [[lx[0], -lx[1]], [lx[1], lx[0]]]
        T[3 * i + 2, 3 * i + 2] = 1.0
    rel = np.linalg.norm(T @ K_loc @ T.T - K_glo) / np.linalg.norm(K_glo)
    assert rel < 1e-12, f"tipo {tipo}: no es invariante a los ejes, {rel*100:.2e} %"
