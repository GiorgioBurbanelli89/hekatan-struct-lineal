"""Placa cuadrada simplemente apoyada con carga uniforme: DKE (delgada) y DSE (con cortante).

    python 08_placa_apoyada_dke_dse.py

Compara la flecha al centro con la solución exacta (serie de Navier): DKE -> Kirchhoff,
DSE -> Mindlin. Mismo código que el test tests/test_placa_apoyada_exacta.py.
"""
import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "tests"))
from test_placa_apoyada_exacta import _flecha_centro, _exacta
from hekatan_struct import k_dke, k_dse

for t in (0.01, 0.2):                                   # t/L = 0.01 delgada, 0.2 gruesa
    wk, wm = _exacta(t, cortante=False), _exacta(t)
    print(f"\nt/L = {t}:  Kirchhoff exacta = {wk:.4e}   Mindlin exacta = {wm:.4e}")
    for nombre, f, ref, etq in (("DKE", k_dke, wk, "Kirchhoff"), ("DSE", k_dse, wm, "Mindlin")):
        for N in (4, 8, 16):
            w = _flecha_centro(f, N, t)
            print(f"  {nombre} {N:2d}x{N:<2d} = {w:.4e}   vs {etq}: {100 * (w - ref) / ref:+.2f} %")
