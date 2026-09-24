# -*- coding: utf-8 -*-
"""La matriz del elemento en C++ NATIVO contra la de Python, término a término.

Por qué esta comparación y no otra: un desplazamiento es la matriz ya resuelta y
mezclada con apoyos y cargas. Si sale mal, no dice DÓNDE. La matriz sí.

Y por qué el binario NATIVO (g++) y no el WASM: porque compila en dos segundos,
se depura con gdb, y de paso comprueba que emscripten no mete nada de su
cosecha. Es el ciclo de trabajo que se usa aquí:

    Python (iterar rápido)  →  .cpp  →  g++  →  esta comparación  →  emcc  →  suite

Si este test falla, el C++ y el Python han dejado de ser el mismo elemento, y
cualquier conclusión sacada en Python deja de valer para el producto.

Se salta solo si el .exe no está compilado:

    bash cli/native/build_kelem_native.sh
"""
import os
import subprocess

import numpy as np
import pytest

from hekatan_struct.elements.membrane_itw import (
    TIPO_DRILLING_DEFECTO,
    k_membrana_itw,
    kwargs_drilling,
)

AQUI = os.path.dirname(os.path.abspath(__file__))
EXE = os.path.abspath(os.path.join(AQUI, "..", "..", "cli", "native", "kelem_native.exe"))

# GDL u, v, theta_z de cada nudo dentro de la K 24x24 del shell
GDL_MEMBRANA = [6 * i + k for i in range(4) for k in (0, 1, 5)]

GEOMETRIAS = [
    ("cuadrado", [(0, 0), (1, 0), (1, 1), (0, 1)]),
    ("rectangulo", [(0, 0), (2, 0), (2, 0.5), (0, 0.5)]),
    ("paralelogramo", [(0, 0), (1, 0), (1.4, 0.9), (0.4, 0.9)]),
    ("trapecio", [(0, 0), (2, 0), (1.5, 1), (0.25, 1)]),
]


ITW8 = dict(regla="itw8", con_burbuja=False, w_alpha=0.99)


def _k_nativa(pts, E, nu, t, tipo_drill=3, gamma=0.4):
    args = [EXE]
    for (x, y) in pts:
        args += [str(x), str(y), "0"]
    args += [str(E), str(nu), str(t), str(tipo_drill), str(gamma)]
    salida = subprocess.run(args, capture_output=True, text=True, timeout=120)
    if salida.returncode != 0:
        raise RuntimeError(salida.stderr[:200])
    return np.array([[float(v) for v in ln.split()]
                     for ln in salida.stdout.strip().splitlines()])


@pytest.mark.skipif(not os.path.exists(EXE),
                    reason="falta cli/native/kelem_native.exe (bash cli/native/build_kelem_native.sh)")
@pytest.mark.parametrize("nombre,pts", GEOMETRIAS)
def test_membrana_cpp_nativo_igual_que_python(nombre, pts):
    """El tipo 3 (ITW 1990). Se PIDE explicitamente, ya no es el defecto.

    Hasta el 19-ago los dos lados llamaban sin argumentos y coincidian porque
    los dos tenian el 3 de fabrica. Cuando el C++ movio su defecto al 8, este
    test seguia comparando 3 contra 3 sin enterarse de que el producto ya no
    calculaba eso. El tipo se escribe en los dos lados, siempre.
    """
    E, nu, t = 2.2e7, 0.2, 0.20
    Kc = _k_nativa(pts, E, nu, t, tipo_drill=3)[np.ix_(GDL_MEMBRANA, GDL_MEMBRANA)]
    Kp = k_membrana_itw(pts, E, nu, t, gamma_fac=0.4, **kwargs_drilling(3))
    rel = np.linalg.norm(Kc - Kp) / np.linalg.norm(Kp)
    assert rel < 1e-10, f"{nombre}: C++ y Python difieren {rel*100:.3e} %"


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
@pytest.mark.parametrize("tipo", [3, 7, 8, 9])
@pytest.mark.parametrize("nombre,pts", GEOMETRIAS)
def test_los_cuatro_tipos_de_drilling_coinciden_termino_a_termino(tipo, nombre, pts):
    """Los 4 tipos portados, cada uno contra el binario. 16 comparaciones.

    Uno solo no basta: el 19-ago el Python reproducia el 3 al 1e-14 y aun asi
    daba numeros distintos del producto, porque el producto ya iba por el 8.
    Fijar los CUATRO es lo que hace imposible volver a desincronizarse por un
    lado sin que salte.
    """
    E, nu, t = 2.2e7, 0.2, 0.20
    Kc = _k_nativa(pts, E, nu, t, tipo_drill=tipo)[np.ix_(GDL_MEMBRANA, GDL_MEMBRANA)]
    Kp = k_membrana_itw(pts, E, nu, t, gamma_fac=0.4, **kwargs_drilling(tipo))
    rel = np.linalg.norm(Kc - Kp) / np.linalg.norm(Kp)
    assert rel < 1e-10, f"tipo {tipo} / {nombre}: difieren {rel*100:.3e} %"


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
def test_el_defecto_de_python_es_el_defecto_del_cpp():
    """El defecto SIN argumentos de los dos lados tiene que dar lo mismo.

    Es el test que faltaba. Los tests por tipo pasaban todos y aun asi los dos
    motores daban numeros distintos: nadie comparaba lo que sale cuando NO se
    pide nada, que es como los llama el 99 % del codigo.
    """
    assert TIPO_DRILLING_DEFECTO == 8, "el defecto del C++ es 8 (shellQ4.cpp)"
    E, nu, t = 2.2e7, 0.2, 0.20
    pts = [(0, 0), (2, 0), (1.5, 1), (0.25, 1)]
    Kc = _k_nativa(pts, E, nu, t, tipo_drill=TIPO_DRILLING_DEFECTO)
    Kc = Kc[np.ix_(GDL_MEMBRANA, GDL_MEMBRANA)]
    Kp = k_membrana_itw(pts, E, nu, t, gamma_fac=0.4)      # SIN argumentos
    rel = np.linalg.norm(Kc - Kp) / np.linalg.norm(Kp)
    assert rel < 1e-10, f"el defecto de Python no es el del C++: {rel*100:.3e} %"


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
def test_la_matriz_nativa_es_simetrica_y_sin_energia_en_solido_rigido():
    """Comprobaciones que no dependen de Python: valen por sí solas."""
    pts = [(0, 0), (2, 0), (1.5, 1), (0.25, 1)]
    K = _k_nativa(pts, 2.2e7, 0.2, 0.20)
    assert K.shape == (24, 24)
    assert np.allclose(K, K.T, rtol=0, atol=1e-6 * np.abs(K).max())
    # traslación en x y en y del bloque de membrana: energía nula
    R = np.zeros((24, 2))
    for i in range(4):
        R[6 * i + 0, 0] = 1.0
        R[6 * i + 1, 1] = 1.0
    assert np.linalg.norm(K @ R) < 1e-6 * np.linalg.norm(K)


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
def test_el_tipo_de_drilling_del_cli_manda():
    """Cambiar `tipoDrilling` tiene que cambiar la matriz.

    Si no cambiara, el CLI estaría ignorando el argumento y las iteraciones que
    se hicieran con él no medirían nada — que es justo la clase de fallo
    silencioso que hay que impedir.
    """
    pts = [(0, 0), (1, 0), (1, 1), (0, 1)]
    itw = _k_nativa(pts, 2.2e7, 0.2, 0.20, tipo_drill=3)
    hb = _k_nativa(pts, 2.2e7, 0.2, 0.20, tipo_drill=2)
    assert np.linalg.norm(itw - hb) > 1e-6 * np.linalg.norm(itw)


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
@pytest.mark.parametrize("nombre,pts", GEOMETRIAS)
def test_la_regla_de_ocho_puntos_del_1991_es_la_misma_en_cpp_y_en_python(nombre, pts):
    """`drillingTypes = 7` — el ITW 1991, con su regla de ocho puntos.

    Es el que baja el hemisferio pinzado de -34 % a -4 % en malla 8x8. Este
    test existe porque al portarlo al C++ la matriz se separaba del Python
    entre un 2 % y un 16 %: el C++ seguia metiendo la BURBUJA, que es del paper
    de 1990 y en el de 1991 no existe. Un desplazamiento no lo habria dicho;
    la matriz si.
    """
    E, nu, t = 2.2e7, 0.2, 0.20
    Kc = _k_nativa(pts, E, nu, t, tipo_drill=7)[np.ix_(GDL_MEMBRANA, GDL_MEMBRANA)]
    Kp = k_membrana_itw(pts, E, nu, t, gamma_fac=0.4, **kwargs_drilling(7))
    rel = np.linalg.norm(Kc - Kp) / np.linalg.norm(Kp)
    assert rel < 1e-10, f"{nombre}: C++ y Python difieren {rel*100:.3e} %"


@pytest.mark.skipif(not os.path.exists(EXE), reason="falta kelem_native.exe")
@pytest.mark.parametrize("nombre,pts", GEOMETRIAS)
def test_el_tipo_7_sale_del_cpp_con_tres_modos_nulos(nombre, pts):
    """Medido sobre la matriz que escupe el BINARIO, no sobre la de Python.

    Que Python tenga 3 modos no prueba que el C++ tambien: son dos
    implementaciones. Y con 4 el elemento seria un mecanismo.
    """
    K = _k_nativa(pts, 2.2e7, 0.2, 0.20, tipo_drill=7)[np.ix_(GDL_MEMBRANA, GDL_MEMBRANA)]
    w = np.sort(np.abs(np.linalg.eigvalsh(K)))
    n = int((w < 1e-9 * w.max()).sum())
    assert n == 3, f"{nombre}: {n} modos de energia nula, deberian ser 3"
