# -*- coding: utf-8 -*-
r"""LA LEY DE LOS CUATRO TERMINOS contra el ESPESOR — 18 celdas ya medidas.

Ahora que la base es la buena (el reloj de arena con sus giros de w/4, que dejo el
cuadrado en 0.0046 %), se puede leer de que depende cada lambda. Y no hace falta
volver a abrir ETABS: `celda_sap_espesor.json` ya trae 18 espesores de la MISMA
celda cuadrada 1x1, de t=0.001 a t=5.0 — cinco decadas.

Que se busca, y por que importa la potencia de `t`:

    lambda/D constante          -> el termino va con D = E t^3/12: es FLEXION
    lambda/D ~ 1/t^2            -> lambda ~ E*t: es CORTANTE (G*kappa*t)
    lambda/D ~ 1/t^3            -> lambda ~ E: no depende del espesor

`y = m x + b`: en log-log la pendiente ES el exponente, asi que se ajusta una recta
a log(lambda/D) contra log(t) y se lee la pendiente. Se hace por TRAMOS ademas del
global, porque si el elemento cambia de regimen (placa fina -> gruesa) la pendiente
tiene que cambiar y una sola recta lo taparia.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from reconstruir import modos

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NOM = ["phi", "hg", "hg_tx", "hg_ty"]


def lams(K, pts, E, nu, t):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    M = modos(pts)
    V = [M[n] for n in NOM]
    A = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(A[i]*A[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(A[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*A[k] for k in range(4))
    return lam/D, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100, D


if __name__ == "__main__":
    d = json.load(open(os.path.join(GAL, "celda_sap_espesor.json"), encoding="utf-8"))
    filas = []
    print("="*92)
    print("  Celda cuadrada 1x1, E=2.2e7, nu=0.  lambda/D de cada termino vs espesor")
    print("="*92)
    print("  %8s %8s %12s %12s %10s %10s" % ("t", "fuera%", "phi", "hg", "hg_tx", "hg_ty"))
    for k in sorted(d, key=lambda z: d[z]["t"]):
        v = d[k]
        K = np.array(v["K"], float); K = (K+K.T)/2
        lam, r, D = lams(K, v["pts"], v["E"], v["nu"], v["t"])
        filas.append((v["t"], lam, D))
        print("  %8.4f %7.3f%% %12.4f %12.4f %10.4f %10.4f"
              % (v["t"], r, lam[0], lam[1], lam[2], lam[3]))

    T = np.array([f[0] for f in filas])
    print("\n" + "="*92)
    print("  PENDIENTE en log-log:  lambda/D ~ t^p   ->   lambda ~ E * t^(p+3)")
    print("="*92)
    print("  %-8s %10s %10s   %s" % ("termino", "p global", "p (t<0.1)", "lectura"))
    for j, n in enumerate(NOM):
        Y = np.array([f[1][j] for f in filas])
        m = Y > 0
        if m.sum() < 3:
            print("  %-8s   (cambia de signo, no se puede log)" % n); continue
        p = np.polyfit(np.log(T[m]), np.log(Y[m]), 1)[0]
        mf = m & (T < 0.1)
        pf = np.polyfit(np.log(T[mf]), np.log(Y[mf]), 1)[0] if mf.sum() >= 3 else float('nan')
        lect = {0: "FLEXION (va con D)"}.get(round(p), "")
        if abs(p+2) < 0.15:
            lect = "CORTANTE:  lambda ~ E*t"
        elif abs(p) < 0.15:
            lect = "FLEXION:   lambda ~ D"
        elif abs(p+3) < 0.15:
            lect = "lambda ~ E, sin espesor"
        print("  %-8s %10.4f %10.4f   %s" % (n, p, pf, lect))

    print("\n  Comprobacion directa: lambda/D * t^2, que debe ser CONSTANTE si es cortante")
    print("  %8s %14s %14s" % ("t", "hg * t^2", "phi * t^2"))
    for t, lam, D in filas:
        print("  %8.4f %14.6f %14.6f" % (t, lam[1]*t*t, lam[0]*t*t))
