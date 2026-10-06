"""Estático EN EL PLANO del muro de triángulos (muro_t2x3, muro_t8x12) con la membrana candidata de proto_mem_tri
(Allman, elástica 3 puntos con proyección del giro, penalización 1 punto γ = 0.4 μ) contra el estático de SAP2000."""
import json, os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from modelos import MODELOS
from proto_mem_tri import k_allman_tri, MU
S = json.load(open(os.path.join(AQUI, "sap_pandeo_cascara.json")))
for nom in sys.argv[1:] or ["muro_t2x3", "muro_t8x12", "muro_tm2x3"]:
    M = next(m for m in MODELOS if m["nombre"] == nom); n = len(M["nodos"])
    xy = np.array([[p[0], p[2]] for p in M["nodos"]]); K = np.zeros((3 * n, 3 * n))
    for c in M["panos"]:
        Ke, Kp = k_allman_tri(xy[c], M["t"], 3, 1, 1.0, True); Kt = Ke + 0.4 * MU * Kp
        d = [3 * q + k for q in c for k in range(3)]; K[np.ix_(d, d)] += Kt
    F = np.zeros(3 * n)
    for q, v in M["cargas"].items(): F[3 * int(q)] += v[0]; F[3 * int(q) + 1] += v[2]
    lib = [k for k in range(3 * n) if k // 3 not in [int(q) for q in M["apoyos"]]]
    u = np.zeros(3 * n); u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    us = np.zeros(3 * n)
    for q, v in S[nom]["estatico"].items(): us[3 * int(q):3 * int(q) + 3] = [v[0], v[2], -v[4]]   # θ en el plano XZ = −ry
    for k, nm in enumerate("u w θ".split()):
        print(nom, nm, "máx %.6e  SAP %.6e  dif/máx %.2e" % (np.abs(u[k::3]).max(), np.abs(us[k::3]).max(),
              np.abs(u[k::3] - us[k::3]).max() / np.abs(us[k::3]).max()))
