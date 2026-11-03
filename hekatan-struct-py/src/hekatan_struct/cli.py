# -*- coding: utf-8 -*-
"""CLI de Hekatan Struct en Python — SOLO NÚMEROS.

Sin ventanas, sin gráficos, sin PNG: escribe números por stdout y ya. La idea es
poder poner los tres motores uno al lado del otro con un `diff`:

    cli/native/kelem_native.exe 0 0 0 1 0 0 1 1 0 0 1 0 2.2e7 0.2 0.20   > k_cpp.txt
    python -m hekatan_struct.cli kelem 0 0 1 0 1 1 0 1 --E 2.2e7 --nu 0.2 --t 0.20 > k_py.txt
    node cli/cli.mjs ...                                                  (el del WASM)

Por qué hace falta el de Python: es donde se itera. Cambiar una formulación en
C++ cuesta compilar; en Python se cambia y se mide en un segundo. Pero una
iteración en Python solo vale si el C++ dice lo mismo, y eso solo se sabe
comparando **la matriz**, no un desplazamiento — un desplazamiento es la matriz
ya mezclada con apoyos y cargas: si sale mal, no dice dónde.

Subcomandos
-----------
    kelem    la matriz de rigidez de UN elemento (12x12 de membrana+drilling)
    placa    la K 12x12 de flexión (DKQ)
    banco    los tests del paper ITW 1990, en una tabla
    modos    los modos de energía nula de un elemento
    convertir  entre .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE)

Ejemplos
--------
    python -m hekatan_struct.cli kelem 0 0  1 0  1 1  0 1
    python -m hekatan_struct.cli kelem 0 0  2 0  1.5 1  0.25 1 --gamma 0.4
    python -m hekatan_struct.cli banco
    python -m hekatan_struct.cli modos 0 0  1 0  1 1  0 1 --gauss 2
"""
from __future__ import annotations

import argparse
import sys

import numpy as np


def _pts(vals):
    """8 números sueltos -> 4 puntos (x, y)."""
    if len(vals) != 8:
        raise SystemExit("hacen falta 8 números: x0 y0 x1 y1 x2 y2 x3 y3")
    return [(vals[0], vals[1]), (vals[2], vals[3]),
            (vals[4], vals[5]), (vals[6], vals[7])]


def _imprime(K, fmt="%.12e"):
    """Una fila por línea, como el kelem_native.exe — para poder hacer diff."""
    for fila in K:
        print(" ".join(fmt % v for v in fila))


# El nombre bonito de cada formulacion y el `drillingTypes` que le corresponde
# en los DOS motores. Hablar por numero es lo que evita que el CLI y el C++ se
# separen: el numero es el que viaja en `elementInputs`.
FORMULACIONES = {"itw1990": 3, "itw1991": 7, "proyeccion": 8, "proy1991": 9}


def _kw(a):
    """Los argumentos comunes -> los del elemento.

    `--formulacion` es lo que elige QUE PAPER se esta ejecutando, y es el unico
    argumento que de verdad cambia el resultado contra ETABS.

    ⚠️ Los parametros NO se arman aqui: se piden a `kwargs_drilling`, la unica
    tabla. Cuando se armaban aqui a mano, al cambiar el defecto del elemento a
    la proyeccion, `--formulacion itw1990` habria pasado a ejecutar la
    proyeccion por lo bajo — el CLI diciendo 1990 y calculando otra cosa.
    """
    from .elements.membrane_itw import kwargs_drilling
    f = getattr(a, "formulacion", "proyeccion")
    kw = kwargs_drilling(FORMULACIONES[f])
    kw.update(gamma_fac=a.gamma)
    if a.gauss != 3:                 # solo si se pide a mano; el defecto es 3
        kw["n_gauss"] = a.gauss
    if kw.get("regla") == "itw8":
        kw["w_alpha"] = a.wa
    return kw


def cmd_kelem(a):
    from .elements.membrane_itw import k_membrana_itw
    _imprime(k_membrana_itw(_pts(a.puntos), a.E, a.nu, a.t, **_kw(a)))


def cmd_placa(a):
    from .elements.plate_dkq import k_placa_dkq
    _imprime(k_placa_dkq(_pts(a.puntos), a.E, a.nu, a.t))


def cmd_modos(a):
    from .elements.membrane_itw import modos_nulos
    n = modos_nulos(_pts(a.puntos), a.E, a.nu, a.t, **_kw(a))
    print(n)
    # 3 son los sólidos rígidos; más de 3 es un mecanismo y el elemento no vale
    return 0 if n == 3 else 1


def cmd_hemisferio(a):
    """El hemisferio pinzado, que es EL test de bloqueo de membrana.

    Se itera aqui y no en la ventana porque lo unico que hace falta es un
    numero: el desplazamiento del punto de carga contra 0.094.
    """
    from .benchmarks_shell3d import hemisferio_pinzado, REF_MACNEAL_HARDER, TABLA_II_1991
    kw = {}
    if a.regla == "itw8":
        kw = dict(regla="itw8", con_burbuja=False, w_alpha=a.wa)
    elif a.regla == "gauss2":
        kw = dict(n_gauss=2)
    if a.gamma is not None:
        kw["gamma_fac"] = a.gamma
    print("malla   Hekatan      vs 0.094    paper 1991")
    for n in a.mallas:
        v = hemisferio_pinzado(n, **kw)
        ref = TABLA_II_1991.get(n)
        print("%2dx%-2d  %10.6f  %+8.2f %%   %s"
              % (n, n, v, (v / REF_MACNEAL_HARDER - 1) * 100,
                 ("%.6f" % ref) if ref else "-"))


def cmd_banco(a):
    from .benchmarks_itw import REF, test_i_patch, test_ii_cantilever, test_iii_cook
    f, g = test_i_patch(6)
    print("test               medido        referencia    error")
    print("I  flecha       %12.6f  %12.6f  %+8.3f %%"
          % (f, REF["patch_flecha"], (f / REF["patch_flecha"] - 1) * 100))
    print("I  giro         %12.6f  %12.6f  %+8.3f %%"
          % (g, REF["patch_giro"], (g / REF["patch_giro"] - 1) * 100))
    v = test_ii_cantilever(16, 4)
    print("II cantilever   %12.6f  %12.6f  %+8.3f %%"
          % (v, REF["cantilever"], (v / REF["cantilever"] - 1) * 100))
    c = test_iii_cook(16)
    print("III Cook 16x16  %12.6f  %12.6f  %+8.3f %%"
          % (c, REF["cook"], (c / REF["cook"] - 1) * 100))


def cmd_convertir(a):
    from .archivos_csi import convertir
    r = convertir(a.entrada, a.salida, comportamiento=a.comportamiento)
    print("%s -> %s (%s)" % (a.entrada, a.salida, r.formato))
    for av in r.avisos:
        print("AVISO:", av)


def main(argv=None):
    p = argparse.ArgumentParser(
        prog="hekatan_struct.cli",
        description="CLI numérico de Hekatan Struct (sin gráficos)")
    sub = p.add_subparsers(dest="cmd", required=True)

    def comunes(q, con_gamma=True):
        q.add_argument("puntos", type=float, nargs=8,
                       help="x0 y0 x1 y1 x2 y2 x3 y3 (antihorarios)")
        q.add_argument("--E", type=float, default=2.2e7)
        q.add_argument("--nu", type=float, default=0.2)
        q.add_argument("--t", type=float, default=0.20)
        if con_gamma:
            q.add_argument("--gamma", type=float, default=0.4,
                           help="gamma/mu del ITW (0.4 = lo medido de ETABS)")
            q.add_argument("--gauss", type=int, default=3, choices=(2, 3),
                           help="puntos de Gauss por lado (el ITW 1990 usa 3)")
            q.add_argument("--formulacion", default="proyeccion",
                           choices=("itw1990", "itw1991", "proyeccion", "proy1991"),
                           help="proyeccion = drillingTypes 8, Gauss 3x3 + la "
                                "proyeccion de FEAP; el DEFECTO, y el que cierra "
                                "la matriz de ETABS al 1.42 % | "
                                "itw1990 = tipo 3, Allman + burbuja | "
                                "itw1991 = tipo 7, la regla de OCHO puntos, ec. (30) | "
                                "proy1991 = tipo 9, las dos (la mejor en cascara curva)")
            q.add_argument("--wa", type=float, default=0.99,
                           help="W_alpha de la ec. (30) del ITW 1991")

    q = sub.add_parser("kelem", help="K 12x12 de membrana + drilling (ITW 1990)")
    comunes(q); q.set_defaults(fn=cmd_kelem)

    q = sub.add_parser("placa", help="K 12x12 de flexión (DKQ, Batoz 1982)")
    comunes(q, con_gamma=False); q.set_defaults(fn=cmd_placa)

    q = sub.add_parser("modos", help="modos de energía nula (deben ser 3)")
    comunes(q); q.set_defaults(fn=cmd_modos)

    q = sub.add_parser("banco", help="los tests del paper ITW 1990")
    q.set_defaults(fn=cmd_banco)

    q = sub.add_parser("hemisferio", help="hemisferio pinzado (bloqueo de membrana)")
    q.add_argument("--regla", default="gauss", choices=("gauss", "gauss2", "itw8"),
                   help="gauss = ITW 1990 (defecto) · itw8 = la regla de 8 puntos del ITW 1991")
    q.add_argument("--wa", type=float, default=0.99, help="W_alpha de la ec. (30)")
    q.add_argument("--gamma", type=float, default=None, help="gamma/mu")
    q.add_argument("--mallas", type=int, nargs="+", default=[4, 8],
                   help="tamanos de malla n x n")
    q.set_defaults(fn=cmd_hemisferio)

    q = sub.add_parser("convertir", help="convierte entre .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE)")
    q.add_argument("entrada")
    q.add_argument("salida")
    q.add_argument("--comportamiento", choices=("etabs", "sap2000", "safe"), default=None)
    q.set_defaults(fn=cmd_convertir)

    a = p.parse_args(argv)
    return a.fn(a) or 0


if __name__ == "__main__":               # pragma: no cover
    sys.exit(main())
