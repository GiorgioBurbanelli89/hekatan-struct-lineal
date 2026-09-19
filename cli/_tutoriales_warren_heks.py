# -*- coding: utf-8 -*-
"""El .heks de la cercha Warren del Tutorial 9, tal como queda dibujada en el vídeo:
luz 12 m centrada en el origen, 6 paneles de 2 m, canto 2 m, alzado XZ.
13 nudos · 23 barras · 2 apoyos empotrados · 6 cargas de −10 kN · −5 kN/m en el cordón superior.
    python cli/_tutoriales_warren_heks.py  →  examples/public/tutoriales/warren.heks
"""
import os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "examples", "public", "tutoriales", "warren.heks")
inf = [(-6 + 2 * i, 0, 0) for i in range(7)]
sup = [(-5 + 2 * i, 0, 2) for i in range(6)]
nodos = inf + sup                                   # 1..7 abajo, 8..13 arriba
CORDON = "25000000 0.15 0.001125 0.003125 0.001134 0.2 2.45"       # 0.30 x 0.50 m  (E A I22 I33 J nu rho[t/m3])
DIAG = "25000000 0.16 0.00213333 0.00213333 0.003584 0.2 2.45"      # 0.40 x 0.40 m
L = ["# Hekatan Struct · cercha Warren del Tutorial 9 (dibujada con el mouse)", "# unidades: m, kN, kN/m · alzado XZ · luz 12 m, canto 2 m"]
L += [f"node {i + 1} {x} {y} {z}" for i, (x, y, z) in enumerate(nodos)]
barras = [(i + 1, i + 2, CORDON) for i in range(6)]                 # cordón inferior
barras += [(8 + i, 9 + i, CORDON) for i in range(5)]                # cordón superior
for i in range(6):                                                  # zigzag
    barras += [(i + 1, 8 + i, DIAG), (8 + i, i + 2, DIAG)]
L += [f"frame {k + 1} {a} {b} {sec}" for k, (a, b, sec) in enumerate(barras)]
L += ["support 1 1 1 1 1 1 1", "support 7 1 1 1 1 1 1"]
L += [f"load {8 + i} 0 0 -10 0 0 0" for i in range(6)]
L += [f"frameload {7 + i} 0 0 -5" for i in range(5)]                # barras 7..11 = cordón superior
L += ["solve"]
open(OUT, "w", encoding="utf-8").write("\n".join(L) + "\n")
print(len(nodos), "nudos", len(barras), "barras ->", OUT)
