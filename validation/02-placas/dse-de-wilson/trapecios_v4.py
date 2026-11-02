# -*- coding: utf-8 -*-
r"""LOS TRAPECIOS con los cuatro modos buenos.

En el cuadrado la base correcta bajo el resto sin explicar de 8.29 % a **0.0046 %**.
Lo que faltaba era que el reloj de arena de `w` viene ACOMPAÑADO de giros que valen
w/4 (theta_x = -xi/4, theta_y = +eta/4). Aqui se lleva esa misma base al trapecio.

Detalle que importa: xi,eta son las coordenadas NATURALES, y valen lo mismo en el
trapecio que en el cuadrado — (-1,-1),(1,-1),(1,1),(-1,1). Los tres modos de reloj
no cambian de forma al distorsionar. El unico que puede cambiar es `phi`, que se
abre del centroide en coordenadas CARTESIANAS. Se prueban las dos lecturas:

    cart   theta = (x-xc, y-yc)     lo cartesiano
    nat    theta = (xi, eta)        lo natural

Y se ajustan los cuatro lambda a la vez por minimos cuadrados sobre las 144
entradas — no por Rayleigh uno a uno, porque en el trapecio los modos dejan de ser
ortogonales entre si y proyectar por separado cuenta dos veces la parte comun.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos(pts, phi="cart"):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    xi, eta = NAT[:, 0], NAT[:, 1]
    h = xi*eta; Z = np.zeros(4)
    a, b = (P[:, 0]-xc, P[:, 1]-yc) if phi == "cart" else (xi, eta)
    return [_v(Z, a, b), _v(h, -xi/4.0, eta/4.0), _v(Z, h, Z), _v(Z, Z, h)]


def ajusta(R, V):
    n = len(V)
    M = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(M[i]*M[j]) for j in range(n)] for i in range(n)])
    b = np.array([np.sum(M[i]*R) for i in range(n)])
    lam = np.linalg.pinv(G, rcond=1e-12) @ b
    Rm = sum(lam[k]*M[k] for k in range(n))
    return lam, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100


def caso(K, pts, E, nu, t, phi):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    lam, r = ajusta(R, modos(pts, phi))
    return lam/D, r


if __name__ == "__main__":
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]; K = np.array(v["K"], float); K = (K+K.T)/2
    print("="*104)
    lc, rc = caso(K, v["pts"], v["E"], v["nu"], v["t"], "cart")
    print("  CUADRADO (control):  fuera %.4f %%   phi=%.4f  hg=%.4f  hg_tx=%.4f  hg_ty=%.4f"
          % (rc, *lc))
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("="*104)
    print("  %-6s %5s %10s %10s   %s" % ("d", "t", "fuera cart", "fuera nat",
                                          "lambdas con la mejor:  phi      hg     hg_tx    hg_ty"))
    print("="*104)
    peor = [0.0, 0.0]
    for k in sorted(tr):
        vv = tr[k]; Kk = np.array(vv["K"], float); Kk = (Kk+Kk.T)/2
        la, ra = caso(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"], "cart")
        lb, rb = caso(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"], "nat")
        peor[0] = max(peor[0], ra); peor[1] = max(peor[1], rb)
        L, _ = (la, ra) if ra <= rb else (lb, rb)
        print("  %-6.2f %5.2f %9.3f%% %9.3f%%    %9.3f %8.3f %8.4f %8.4f"
              % (vv["d"], vv["t"], ra, rb, L[0], L[1], L[2], L[3]))
    print("\n  PEOR CASO:  cart %.3f %%    nat %.3f %%   (antes: 88.06 %%)" % tuple(peor))
