# -*- coding: utf-8 -*-
"""Tablas 1 y 2 de Ibrahimbegovic (1993) con nuestro PQ2 (placa_ibrahimbegovic1993.py).
Placa cuadrada a=10, E=10.92, nu=0.3, q=1, apoyo SS duro (w=0, giro tangente=0), cuadrante con simetría.
Tabla 1: t=0.1 (w exacta 40623 delgada); Tabla 2: t=1 (w 42.728)."""
import sys, numpy as np
sys.path.insert(0, __file__.rsplit("\\", 1)[0].rsplit("/", 1)[0])
from placa_ibrahimbegovic1993 import k_pq2, _N, _NL, _lados, G2

def resolver(n, t, consistente, a=10.0, E=10.92, nu=0.3, q=1.0):
    h = a / 2 / n; nn = n + 1
    idx = lambda i, j: j * nn + i
    K = np.zeros((3 * nn * nn,) * 2); F = np.zeros(3 * nn * nn)
    for j in range(n):
        for i in range(n):
            nod = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]
            pts = [(i * h, j * h), ((i + 1) * h, j * h), ((i + 1) * h, (j + 1) * h), (i * h, (j + 1) * h)]
            ke = k_pq2(pts, E, nu, t)
            fe = np.zeros(12)
            if not consistente:
                fe[0::3] = q * h * h / 4
            else:
                x = np.array([p[0] for p in pts]); y = np.array([p[1] for p in pts])
                l, nv = _lados(x, y)
                for gr in (-G2, G2):
                    for gs in (-G2, G2):
                        N = _N(gr, gs); NL = _NL(gr, gs); dJ = h * h / 4
                        for I in range(4):
                            Kk = (I - 1) % 4
                            fe[3 * I] += q * N[I] * dJ
                            Nh = NL[I] * l[I] / 8 * nv[I] - NL[Kk] * l[Kk] / 8 * nv[Kk]
                            fe[3 * I + 1:3 * I + 3] += q * Nh * dJ
            g = np.array([[3 * k, 3 * k + 1, 3 * k + 2] for k in nod]).ravel()
            K[np.ix_(g, g)] += ke; F[g] += fe
    fijo = set()
    for j in range(nn):
        for i in range(nn):
            k = idx(i, j)
            if i == 0: fijo.add(3 * k + 2)          # simetría x=0: θ2=0
            if j == 0: fijo.add(3 * k + 1)          # simetría y=0: θ1=0
            if i == n: fijo |= {3 * k, 3 * k + 1}   # SS duro x=a/2: w=0, θ1=0
            if j == n: fijo |= {3 * k, 3 * k + 2}   # SS duro y=a/2: w=0, θ2=0
    lib = [d for d in range(3 * nn * nn) if d not in fijo]
    u = np.zeros_like(F); u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    return u[0], 4 * 0.5 * F @ u   # w centro, energía placa entera (4 cuadrantes)

REF = {0.1: {"L": [31915, 39712, 40436, 40593, 40631], "C": [53172, 43835, 41411, 40834, 40692]},
       1.0: {"L": [34.566, 41.902, 42.545, 42.684, 42.717], "C": [55.825, 46.025, 43.521, 42.924, 42.777]}}
EREF = {1.0: {"L": [108.020, 193.429, 217.166, 223.302, 224.849], "C": [285.174, 239.023, 228.601, 226.161, 225.564]}}
for t in (0.1, 1.0):
    for c, nom in ((False, "L"), (True, "C")):
        for k, n in enumerate((1, 2, 4, 8, 16)):
            w, en = resolver(n, t, c)
            r = REF[t][nom][k]
            s = f"t={t} {nom} {n:2d}x{n:<2d} w={w:12.4f} paper={r:10.3f} dif={100*(w-r)/r:+.3f}%"
            if t in EREF: s += f"  E={en:9.3f} paper={EREF[t][nom][k]:9.3f}"
            print(s)
