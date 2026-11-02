# -*- coding: utf-8 -*-
r"""LOS MODOS BIEN DIMENSIONADOS.  El '4' llevaba una longitud dentro.

`autosemejanza.py` cerro la duda: ETABS y mi K_DSE son los DOS autosemejantes al
0.00000 % (celdas con el mismo t/L y distinto tamaño dan la misma matriz
adimensional). Asi que el 3-59 % que aparecia con L != 1 no es de ETABS ni del DSE:
es de **como estaba escrito el vector**.

El modo de reloj de arena mezcla `w`, que tiene unidades de LONGITUD, con giros,
que son adimensionales. Escrito `w = h, theta_x = -xi/4` el famoso «los giros valen
w/4» solo puede ser cierto en una celda de L = 1: en cuanto cambia el tamaño, ese 4
deja de ser un numero y pasa a ser `4/L`. La forma correcta es

    w = A h        theta_x = -A xi/(4L)        theta_y = +A eta/(4L)

y lo mismo para phi, que va con (x-xc, y-yc) y por tanto escala con L. Se prueban
los cuatro modos redimensionados sobre TODAS las celdas cuadradas medidas.

Y hay una consecuencia que importa mas que el arreglo: si el modo lleva una
LONGITUD dentro, en un TRAPECIO esa longitud **no es unica** —el lado de arriba
mide distinto que el de abajo—, y usar una sola daria exactamente el tipo de fallo
que se ve al distorsionar.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos_dim(pts, L=None):
    """los cuatro modos con las unidades puestas: w en longitud, giros sin."""
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    if L is None:
        L = 0.5*((P[:, 0].max()-P[:, 0].min())+(P[:, 1].max()-P[:, 1].min()))
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    return [_v(Z, P[:, 0]-xc, P[:, 1]-yc),          # phi: giros ~ longitud/L, ok
            _v(L*h, -xi/4.0, eta/4.0),               # hg: w lleva la L
            _v(Z, h, Z), _v(Z, Z, h)]


def lam4(K, pts, E, nu, t, dim=True):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V = modos_dim(pts) if dim else None
    if not dim:
        from reconstruir import modos as m0
        M = m0(pts); V = [M[n] for n in ["phi", "hg", "hg_tx", "hg_ty"]]
    A = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(A[i]*A[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(A[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*A[k] for k in range(4))
    return lam/D, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100


filas = []
for f in ("celda_sap2000.json", "celda_sap_espesor.json"):
    d = json.load(open(os.path.join(GAL, f), encoding="utf-8"))
    for k, v in d.items():
        if "K" not in v or "pts" not in v:
            continue
        P = np.array(v["pts"], float)
        Lx, Ly = P[:, 0].max()-P[:, 0].min(), P[:, 1].max()-P[:, 1].min()
        if abs(Lx-Ly) > 1e-9:
            continue
        K = np.array(v["K"], float); K = (K+K.T)/2
        filas.append((v["nu"], Lx, v["t"], K, v["pts"], v["E"]))

print("="*100)
print("  Las celdas CUADRADAS con L distinto de 1  —  antes vs con las unidades puestas")
print("="*100)
print("  %5s %7s %8s %11s %11s   %s" % ("nu", "L", "t", "fuera ANTES", "fuera AHORA",
                                         "lambdas: phi      hg      htx     hty"))
for nu, L, t, K, pts, E in sorted(filas, key=lambda z: (z[1], z[0], z[2])):
    _, r0 = lam4(K, pts, E, nu, t, dim=False)
    lam, r1 = lam4(K, pts, E, nu, t, dim=True)
    mark = "  <<<" if abs(L-1) > 1e-9 else ""
    print("  %5.2f %7.2f %8.4f %10.3f%% %10.4f%%   %9.3f %8.3f %7.4f %7.4f%s"
          % (nu, L, t, r0, r1, lam[0], lam[1], lam[2], lam[3], mark))
