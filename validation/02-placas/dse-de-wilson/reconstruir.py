# -*- coding: utf-8 -*-
r"""RECONSTRUIR la K de ETABS: DSE + cuatro terminos en FORMA CERRADA.

Los cuatro modos salieron del propio dato (`modo2_crudo.py`), no de una hipotesis,
y los cuatro tienen expresion exacta en coordenadas naturales (xi,eta):

    phi     w=0            theta_x =  xi_i? NO: theta = (x-xc, y-yc)    lam/D = 454.542
    hg      w = xi*eta     theta_x = -xi/4    theta_y = +eta/4          lam/D =  83.629
    hg_tx   w=0            theta_x = xi*eta   theta_y = 0               lam/D =   0.4999
    hg_ty   w=0            theta_x = 0        theta_y = xi*eta          lam/D =   0.4999

El segundo es el hallazgo: NO es el reloj de arena de `w` a secas (por eso daba
MAC 0.889 y no 1.000). Lleva ademas los giros, y valen exactamente **w/4** con los
signos de xi y eta cruzados. Ese cuarto es lo que se escapaba del ajuste.

Se comprueba lo unico que vale: si K_DSE + SUM lam_k v_k v_k^T reproduce la matriz
que escribio ETABS, entrada a entrada.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    x, y = P[:, 0]-xc, P[:, 1]-yc
    xi, eta = NAT[:, 0], NAT[:, 1]
    h = xi*eta
    Z = np.zeros(4)
    return {"phi":   _v(Z, x, y),
            "hg":    _v(h, -xi/4.0, eta/4.0),
            "hg_tx": _v(Z, h, Z),
            "hg_ty": _v(Z, Z, h)}


if __name__ == "__main__":
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]
    K = np.array(v["K"], float); K = (K+K.T)/2
    pts, E, nu, t = v["pts"], v["E"], v["nu"], v["t"]
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    M = modos(pts)

    print("="*78)
    print("  Cociente de Rayleigh de cada modo sobre el resto  (lambda/D)")
    print("="*78)
    lam = {}
    for n, u in M.items():
        lam[n] = (u @ R @ u)/D
        print("  %-7s lambda/D = %12.6f     |v|=%.3f" % (n, lam[n], np.linalg.norm(u)))

    Rm = sum(lam[n]*D*np.outer(M[n], M[n]) for n in M)
    err = np.linalg.norm(R-Rm)/np.linalg.norm(R)*100
    print("\n  resto NO explicado: %.4f %%   (antes: 8.29 %%)" % err)

    Krec = K_DSE(pts, E, nu, t) + Rm
    dif = np.abs(Krec-K); esc = np.abs(K).max()
    print("\n" + "="*78)
    print("  K reconstruida vs la que escribio ETABS")
    print("="*78)
    print("  max |dif| / max|K| = %.6f %%" % (dif.max()/esc*100))
    print("  |K_rec - K| / |K|  = %.6f %%" % (np.linalg.norm(Krec-K)/np.linalg.norm(K)*100))
    a = np.sort(np.linalg.eigvalsh(K)); b = np.sort(np.linalg.eigvalsh(Krec))
    print("\n  autovalores (los 12), ETABS vs reconstruida:")
    for i in range(12):
        d = abs(b[i]-a[i])/max(abs(a[i]), 1e-9)*100
        print("   %2d  %16.6f  %16.6f   %8.4f %%" % (i+1, a[i], b[i], d))
