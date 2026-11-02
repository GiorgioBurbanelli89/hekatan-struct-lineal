# -*- coding: utf-8 -*-
r"""LOS AUTOVECTORES DEL TRAPECIO EN CRUDO — la misma via que resolvio el cuadrado.

En el cuadrado bastó con imprimir el autovector nodo a nodo para ver que el reloj
de arena venia con giros de valor w/4: el ajuste paso de 8.29 % a 0.0046 %. En el
trapecio la base buena del cuadrado NO vale (12-96 % fuera), y el espectro dice que
el resto sigue teniendo rango 1-2. Conclusion forzosa: los autovectores existen,
son pocos, y no estan en el span que se le esta ofreciendo.

Asi que se hace lo mismo: imprimirlos. Sin candidatos, sin proyecciones. Y al lado
se ponen xi, eta y las coordenadas del nudo, para poder LEER la formula.
"""
import json, os, sys
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = [(-1, -1), (1, -1), (1, 1), (-1, 1)]

tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
QUIERO = [(0.10, 0.10), (0.20, 0.10), (0.30, 0.10)]

for k in sorted(tr):
    v = tr[k]
    if (round(v["d"], 2), round(v["t"], 2)) not in QUIERO:
        continue
    K = np.array(v["K"], float); K = (K+K.T)/2
    pts, E, nu, t = v["pts"], v["E"], v["nu"], v["t"]
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    w, V = np.linalg.eigh(R); o = np.argsort(-np.abs(w))
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    print("\n" + "="*84)
    print("  d=%.2f  t=%.2f   nudos: %s" % (v["d"], v["t"],
          " ".join("(%.3f,%.3f)" % tuple(p) for p in P)))
    print("  centroide (%.4f, %.4f)" % (xc, yc))
    print("="*84)
    for j in (0, 1, 2):
        u = V[:, o[j]]; u = u*np.sign(u[np.argmax(np.abs(u))])
        ew = u[0::3]@u[0::3]; ex = u[1::3]@u[1::3]; ey = u[2::3]@u[2::3]
        print("\n  modo %d  lambda/D = %12.4f    energia  w %.1f%%  tx %.1f%%  ty %.1f%%"
              % (j+1, w[o[j]]/D, ew*100, ex*100, ey*100))
        print("    nudo   xi eta    x-xc     y-yc  |      w        theta_x     theta_y   | tx/w   ty/w")
        for i in range(4):
            a, b = u[3*i], u[3*i+1]
            c = u[3*i+2]
            r1 = b/a if abs(a) > 1e-9 else float('nan')
            r2 = c/a if abs(a) > 1e-9 else float('nan')
            print("     %d    %2d %3d  %7.4f  %7.4f  | %9.5f  %9.5f  %9.5f  | %6.3f %6.3f"
                  % (i+1, NAT[i][0], NAT[i][1], P[i, 0]-xc, P[i, 1]-yc, a, b, c, r1, r2))
