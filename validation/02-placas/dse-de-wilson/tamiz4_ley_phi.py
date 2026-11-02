# -*- coding: utf-8 -*-
r"""TAMIZ 4 · la LEY del termino que falta, en TODOS los barridos medidos.

Lo atomico: el resto  R = K_medida - K_DSE  es, en formas regulares, una
rigidez de RANGO 1 sobre phi. Su magnitud es

    lambda_phi / D  =  (phi^T R phi) / (D * phi^T phi)

con phi = giros que se abren desde el centro (tx = x-xc, ty = y-yc, w = 0),
CENTRADO — sin centrar el MAC sale 0.5 exacto y el numero no significa nada.

Se barre todo lo que hay medido:
    celda_sap2000.json            L = 0.05 .. 10   y  relacion de aspecto r
    celda_sap_espesor.json        18 espesores
    celda_sap_forma_x_espesor.json  formas x espesor

Si lambda_phi/D sale constante -> es adimensional y hay ley. Donde deje de
serlo, ahi esta la dependencia que falta.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def vec_phi(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    v = np.zeros(12)
    for i, (x, y) in enumerate(pts):
        v[3*i+1] = x-xc; v[3*i+2] = y-yc
    return v


def ley(v):
    K = np.array(v["K"], float); K = (K+K.T)/2
    E, nu, t, pts = v["E"], v["nu"], v["t"], v["pts"]
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    p = vec_phi(pts)
    lam = (p@R@p)/(p@p)/D
    # y cuanto de R es ese modo: si es rango 1, el Rayleigh ES el autovalor
    w = np.sort(np.linalg.eigvalsh(R))[::-1]
    mac = None
    _, V = np.linalg.eigh(R)
    v1 = V[:, -1]
    mac = (p@v1)**2/((p@p)*(v1@v1))
    return lam, w[0]/D, mac


for arch, etq in (("celda_sap2000.json", "L y relacion de aspecto"),
                  ("celda_sap_espesor.json", "espesor"),
                  ("celda_sap_forma_x_espesor.json", "forma x espesor")):
    d = json.load(open(os.path.join(GAL, arch), encoding="utf-8"))
    print("\n" + "="*88)
    print("  %s   (%s, %d casos)" % (arch, etq, len(d)))
    print("="*88)
    print("  %-14s %7s %6s %5s   %12s %12s %7s"
          % ("caso", "L o r", "t", "nu", "lambda_phi/D", "lambda_1/D", "MAC"))
    for k in sorted(d):
        v = d[k]
        if "tipo" in v and v["tipo"] == 1:
            continue
        try:
            lam, l1, mac = ley(v)
        except Exception as e:
            print("  %-14s ERROR %s" % (k, str(e)[:40])); continue
        P = np.asarray(v["pts"], float)
        Lx = P[:, 0].max()-P[:, 0].min(); Ly = P[:, 1].max()-P[:, 1].min()
        print("  %-14s %7.3f %6.3f %5.2f   %12.4f %12.4f %7.4f"
              % (k, Lx, v["t"], v["nu"], lam, l1, mac))
