# -*- coding: utf-8 -*-
"""DKE y DSE de Wilson (libro 2005, cap. 8) contra: la DKQ de Batoz-Tahar, las tablas impresas del libro, patch test,
modos rígidos y simetría. Las cifras del libro están leídas en las imágenes de registros/libros/wilson_cap8_2005/."""
import numpy as np
import pytest

from hekatan_struct import placas_wilson as W
from hekatan_struct.placas import rigidez as rigidez_batoz

GEOM = {"cuadrado": [(0, 0), (1, 0), (1, 1), (0, 1)], "rectangulo": [(0, 0), (1, 0), (1, .6), (0, .6)],
        "irregular": [(0, 0), (2, .2), (2.2, 1.8), (.1, 1.6)], "trapecio": [(0, 0), (4, 0), (3.2, 2.5), (.6, 2.2)]}
E = 2.5e7


@pytest.mark.parametrize("nombre", GEOM)
@pytest.mark.parametrize("nu", [0.0, 0.15, 0.3, 0.45])
def test_dke_es_la_dkq_de_batoz(nombre, nu):
    P = np.array(GEOM[nombre], float)
    Kb = rigidez_batoz("dkq", P, E, nu, 0.1); Kw = W.k_dke(P, E, nu, 0.1)
    assert np.abs(Kw - Kb).max() / np.abs(Kb).max() < 1e-12


@pytest.mark.parametrize("tipo", ["dke", "dse"])
@pytest.mark.parametrize("nombre", GEOM)
def test_simetria_y_tres_modos_rigidos(tipo, nombre):
    P = np.array(GEOM[nombre], float); K = W.rigidez(tipo, P, E, 0.2, 0.2)
    assert np.abs(K - K.T).max() < 1e-9 * np.abs(K).max()
    ev = np.linalg.eigvalsh(K)
    assert (np.abs(ev) < 1e-9 * ev.max()).sum() == 3 and ev.min() > -1e-9 * ev.max()
    for u in (np.tile([1, 0, 0], 4), np.concatenate([[x, 0, -1] for x, y in P]), np.concatenate([[y, 1, 0] for x, y in P])):
        assert np.abs(K @ u).max() < 1e-8 * np.abs(K).max()


@pytest.mark.parametrize("tipo", ["dke", "dse"])
def test_patch_curvatura_constante(tipo):
    """w = x²/2 (θx = 0, θy = -x): ψxx constante = 1 en todo el elemento irregular (8.17)."""
    P = np.array(GEOM["irregular"], float); u = np.concatenate([[x * x / 2, 0, -x] for x, y in P])
    M = W.momentos(tipo, P, E, 0.25, 0.01, u, "gauss"); Db, _ = W._D(E, 0.25, 0.01)
    assert np.allclose(M, np.tile(Db @ [-1, 0, 0], (4, 1)), rtol=1e-9, atol=1e-9 * Db[0, 0])


# Tabla 8.2 (p. 8-12, 4 × 4) y 8.3 (p. 8-13, 16 × 16): w·h³ en el centro, carga puntual, E = 10.92, ν = 0.3
LIBRO_W = [("dke", 1.0, 4, 1.195), ("dke", 0.01, 4, 1.195), ("dse", 1.0, 4, 1.383), ("dse", 0.1, 4, 1.219),
           ("dse", 0.01, 4, 1.218), ("dke", 1.0, 16, 1.163), ("dse", 1.0, 16, 1.393), ("dse", 0.01, 16, 1.164)]


@pytest.mark.parametrize("tipo,h,n,libro", LIBRO_W)
def test_tablas_8_2_y_8_3_flecha(tipo, h, n, libro):
    w, _ = W.cuadrante_placa_cuadrada(tipo, h, n, "puntual")
    assert abs(w / libro - 1) < 2e-3          # medido: ≤ 0.15 % (4 × 4) y ≤ 0.07 % (16 × 16)


def test_uniforme_contra_timoshenko():
    """La tabla 8.4 (p. 8-13) imprime 9.807 para w·h³, que NO es la placa 10 × 10 con q = 1 (exacto 0.00406·q·a⁴/D
    = 40.6): se comprueba contra la solución exacta, no contra esa cifra."""
    w, M = W.cuadrante_placa_cuadrada("dke", 0.01, 16, "uniforme")
    assert abs(w / 40.62 - 1) < 2e-3 and abs(M / 4.79 - 1) < 3e-3


# Tabla 8.1 (p. 8-11): voladizo de un elemento, G/E de la fig. 8.5 → ν = 0.3; las flechas impresas salen con E = 1e7
@pytest.mark.parametrize("tipo,libro", [("dke", 0.0000540), ("dse", 0.0000587)])
def test_tabla_8_1_viga_un_elemento(tipo, libro):
    w, M = W.viga_un_elemento(tipo)
    assert abs(w / libro - 1) < 1e-3 and abs(M - 6.00) < 1e-6


# Lo que NO se reproduce tal cual (documentado, no se exige): momentos máximos de las tablas 8.2/8.3 (0.1-6 %),
# tabla 8.4 (9.807 no es la placa de 10 × 10 con q = 1), tabla 8.5 (triángulos: no implementados) y tabla 8.6
# (torsión: el libro no define la condición «Y-rotation fixed»; con «free» DKE 9 × 9 da 0.0234 frente a 0.0233 y
# DSE 1 × 6 / 9 × 9 0.2449 / 0.1262 frente a 0.2368 / 0.1249).


def test_errata_89_trapecio_cortante_constante():
    """La (8.9) impresa es la traspuesta de la inversa de (8.8): con w lineal y giros nulos el cortante es
    (gx, gy) constante; solo la inversa correcta lo devuelve exacto en un trapecio (en rectángulos coinciden)."""
    import numpy as np
    from hekatan_struct import placas_wilson as W
    P = np.array([[0.0, 0.0], [4.0, 0.0], [3.0, 3.0], [0.5, 2.0]])
    lados = W._lados(P); gx, gy = 0.7, -0.4
    u = np.zeros(16)
    for k in range(4): u[3 * k] = gx * P[k, 0] + gy * P[k, 1]
    r, s = 0.2, -0.3
    N = 0.25 * np.array([(1 - r) * (1 - s), (1 + r) * (1 - s), (1 + r) * (1 + s), (1 - r) * (1 + s)])
    try:
        W.LITERAL_8_9 = False; g_ok = W._cortantes_16(N, lados) @ u
        W.LITERAL_8_9 = True; g_lit = W._cortantes_16(N, lados) @ u
    finally:
        W.LITERAL_8_9 = False
    assert np.allclose(g_ok, [gx, gy], atol=1e-12)
    assert np.abs(g_lit - [gx, gy]).max() > 1e-2


# ---------------------------------------------------------------- ERRATA de la Ec. (8.9) (p. 8-6)
def _gamma_patch_trapecio(literal):
    """Cortante en los 4 puntos de Gauss de un trapecio con w = 0.3x + 0.7y, θ = 0 (γ = ∇w constante)."""
    from hekatan_struct import placas_wilson as pw
    P = np.array([(0, 0), (2, 0), (1.5, 1), (0.25, 1)], float)
    lados = pw._lados(P)
    u = np.zeros(16)
    for i, (x, y) in enumerate(P):
        u[3 * i] = 0.3 * x + 0.7 * y
    viejo = pw.LITERAL_8_9
    pw.LITERAL_8_9 = literal
    try:
        return np.array([pw._cortantes_16(pw._curvaturas_16(r, s, P, lados)[1], lados) @ u for r, s in pw.GAUSS4])
    finally:
        pw.LITERAL_8_9 = viejo


def test_errata_8_9_inversa_correcta_cumple_patch_de_cortante_en_trapecio():
    g = _gamma_patch_trapecio(False)
    assert np.allclose(g, [0.3, 0.7], atol=1e-12)


def test_errata_8_9_impresa_NO_cumple_el_patch_en_trapecio():
    """Vigila que la ecuación literal siga siendo la traspuesta (si esto pasa a cumplir, el libro/ la errata cambió)."""
    g = _gamma_patch_trapecio(True)
    assert np.abs(g - [0.3, 0.7]).max() > 0.05
