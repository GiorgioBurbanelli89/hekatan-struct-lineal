# -*- coding: utf-8 -*-
r"""LA LEY COMPLETA del Shell-Thick de CSI en celda cuadrada — verificacion final.

    K_ETABS  =  K_DSE  +  SUM_k  lambda_k  v_k v_k^T

con xi,eta las coordenadas naturales, h = xi*eta, L el lado y s = t/L:

    v_phi    w = 0        theta = (x-xc, y-yc)
    v_hg     w = h/L      theta_x = -xi/4     theta_y = +eta/4
    v_htx    w = 0        theta_x = h
    v_hty    w = 0        theta_y = h

    lambda_phi/D = 181.817 (2.5 - nu/2)
    lambda_htx/D = lambda_hty/D = 0.5 (1 - nu)
    lambda_hg /D = A / [(1 + B s^2)(1 + phi s^2)] * (4/L^2 + 0.5)/4.5
                   A   = 4500.90 - 900.90 nu
                   B   = (1202.64 - 237.84 nu)/(1 - nu)
                   phi = 2(1+nu)/(kappa(1-nu)),  kappa = 5/6

⚠️ Ese `phi` NO es el phi_k de Katili, aunque a nu = 0 valga lo mismo (2.4). Lleva
un `(1+nu)` de mas: `2(1+nu)/(kappa(1-nu))` contra `2/(kappa(1-nu))`. Con el
barrido solo a nu = 0 los dos encajaban y se dio por identificado; el barrido en nu
lo desmiente. Se deja escrito para no repetir la conclusion.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from escala_rot import corrige

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])
KAPPA = 5.0/6.0


def es_cuadrado(P, tol=1e-9):
    """cuadrado de verdad: cuatro lados iguales y diagonales iguales.

    Comprobar solo el bounding box deja pasar trapecios y romboides — asi se
    colaron las celdas `z_*` (0.9/0.1, 0.8/0.2, 0.7/0.3), que son trapecios y
    miden 1x1 de ancho y alto igual que el cuadrado.
    """
    lad = np.array([np.linalg.norm(P[(i+1) % 4]-P[i]) for i in range(4)])
    dia = np.array([np.linalg.norm(P[2]-P[0]), np.linalg.norm(P[3]-P[1])])
    return (lad.max()-lad.min() < tol*max(lad.max(), 1)
            and dia.max()-dia.min() < tol*max(dia.max(), 1))


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    L = 0.5*((P[:, 0].max()-P[:, 0].min())+(P[:, 1].max()-P[:, 1].min()))
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    return [_v(Z, P[:, 0]-xc, P[:, 1]-yc), _v(h/L, -xi/4.0, eta/4.0),
            _v(Z, h, Z), _v(Z, Z, h)], L


def lambdas(nu, t, L):
    """los cuatro lambda/D en forma cerrada."""
    s = (t/L)**2
    A = 4500.90 - 900.90*nu
    B = (1202.64 - 237.84*nu)/(1-nu)
    ph = 2.0*(1+nu)/(KAPPA*(1-nu))
    hg = A/((1+B*s)*(1+ph*s)) * (4.0/L**2 + 0.5)/4.5
    return np.array([181.817*(2.5-nu/2), hg, 0.5*(1-nu), 0.5*(1-nu)])


def K_shellthick(pts, E, nu, t):
    """la K de placa del Shell-Thick de CSI, reconstruida."""
    D = E*t**3/(12*(1-nu*nu))
    V, L = modos(pts)
    lam = lambdas(nu, t, L)*D
    return K_DSE(pts, E, nu, t) + sum(lam[k]*np.outer(V[k], V[k]) for k in range(4))


if __name__ == "__main__":
    casos = []
    for f in ("celda_sap_t_nu.json", "celda_sap_espesor.json", "celda_sap2000.json"):
        d = json.load(open(os.path.join(GAL, f), encoding="utf-8"))
        for k, v in d.items():
            if "K" not in v or "pts" not in v:
                continue
            P = np.array(v["pts"], float)
            if not es_cuadrado(P):     # el bounding box NO basta: un trapecio
                continue               # 0.9/0.1 tambien mide 1x1 y se colaba
            K, _, _ = corrige(np.array(v["K"], float), v["pts"])
            casos.append((f.split(".")[0], k, (K+K.T)/2, v["pts"], v["E"], v["nu"], v["t"]))

    print("="*96)
    print("  LA LEY CONTRA TODAS LAS CELDAS CUADRADAS MEDIDAS DE ETABS")
    print("  |K_ley - K_ETABS| / |K_ETABS|, entrada a entrada")
    print("="*96)
    print("  %-22s %6s %6s %7s %14s %14s" % ("caso", "nu", "L", "t", "|dif|/|K|", "peor entrada"))
    peor = 0.0; peor_caso = None
    for f, k, K, pts, E, nu, t in sorted(casos, key=lambda z: (z[5], z[6])):
        Km = K_shellthick(pts, E, nu, t)
        L = 0.5*((np.array(pts)[:, 0].max()-np.array(pts)[:, 0].min()) +
                 (np.array(pts)[:, 1].max()-np.array(pts)[:, 1].min()))
        rel = np.linalg.norm(Km-K)/np.linalg.norm(K)*100
        ent = np.abs(Km-K).max()/np.abs(K).max()*100
        if rel > peor:
            peor, peor_caso = rel, (f, k)
        print("  %-22s %6.2f %6.2f %7.3f %13.5f%% %13.5f%%" % (k[:22], nu, L, t, rel, ent))
    print("\n  PEOR de las %d celdas: %.5f %%   (%s)" % (len(casos), peor, peor_caso[1]))
