# -*- coding: utf-8 -*-
r"""A(nu) y B(nu): separarlas con el barrido t x nu.

Las tres leyes de la celda cuadrada del Shell-Thick estan cerradas menos esto:

    lambda_hg/D = A/[(1 + B s^2)(1 + phi_k)] * (4/L^2+0.5)/4.5      s = t/L
    A = 4500.90   B = 1202.64          <- medidas SOLO a nu = 0

Con un solo espesor por nu, A y B no se pueden separar (infinitas parejas dan el
mismo valor en un punto). Con varios espesores por nu si, y el ajuste es LINEAL si
se invierte:

    D/lambda_hg * (4/L^2+0.5)/4.5  =  (1 + phi_k)/A  +  (B/A) (1 + phi_k) s^2

o sea `y = m x + b` de verdad: recta en `x = (1+phi_k) s^2` contra
`y = D/lambda * factor`, con ordenada `1/A` sobre `(1+phi_k)` y pendiente `B/A`.

El caso nu = 0 es el CONTROL: tiene que devolver 4500.90 y 1202.64. Si no, el
barrido esta mal montado y lo demas no vale.
"""
import json, os, sys
import numpy as np
from dse_wilson import K_DSE
from escala_rot import corrige   # el .K_0 puede venir con los giros x1000

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])
KAPPA = 5.0/6.0


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    L = 0.5*((P[:, 0].max()-P[:, 0].min())+(P[:, 1].max()-P[:, 1].min()))
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    return [_v(Z, P[:, 0]-xc, P[:, 1]-yc), _v(h/L, -xi/4.0, eta/4.0),
            _v(Z, h, Z), _v(Z, Z, h)], L


def lam4(K, pts, E, nu, t):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V, L = modos(pts)
    A = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(A[i]*A[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(A[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*A[k] for k in range(4))
    return lam/D, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100, L


def main(fich="celda_sap_t_nu.json"):
    p = os.path.join(GAL, fich)
    if not os.path.exists(p):
        print("  todavia no existe %s" % p); return
    d = json.load(open(p, encoding="utf-8"))
    por_nu = {}
    print("="*94)
    print("  %-16s %6s %7s %9s %12s %10s %10s"
          % ("caso", "nu", "t", "fuera", "hg", "phi", "htx"))
    print("="*94)
    for k in sorted(d, key=lambda z: (d[z]["nu"], d[z]["t"])):
        v = d[k]
        K, fa, _ = corrige(np.array(v["K"], float), v["pts"])   # unidades del momento
        K = (K+K.T)/2
        lam, r, L = lam4(K, v["pts"], v["E"], v["nu"], v["t"])
        por_nu.setdefault(v["nu"], []).append((v["t"], lam[1], L, lam[0], lam[2]))
        print("  %-16s %6.2f %7.3f %8.4f%% %12.4f %10.3f %10.4f"
              % (k, v["nu"], v["t"], r, lam[1], lam[0], lam[2]))

    print("\n" + "="*94)
    print("  A(nu) y B(nu) por REGRESION LINEAL sobre cada nu")
    print("="*94)
    print("  %6s %4s %12s %12s %10s   %s" % ("nu", "n", "A", "B", "R2", "control"))
    for nu in sorted(por_nu):
        g = por_nu[nu]
        if len(g) < 3:
            print("  %6.2f %4d   (hacen falta 3 espesores minimo)" % (nu, len(g))); continue
        t = np.array([x[0] for x in g]); y0 = np.array([x[1] for x in g])
        L = g[0][2]; s2 = (t/L)**2
        phik = 2.0/(KAPPA*(1-nu))*s2
        fac = (4.0/L**2 + 0.5)/4.5
        y = fac/y0                                  # = (1+phik)/A + (B/A)(1+phik) s^2
        X = np.column_stack([1+phik, (1+phik)*s2])
        c, res, *_ = np.linalg.lstsq(X, y, rcond=None)
        A, B = 1.0/c[0], c[1]/c[0]
        pred = X@c
        R2 = 1 - np.sum((y-pred)**2)/np.sum((y-y.mean())**2)
        ctl = ""
        if abs(nu) < 1e-9:
            ctl = "A=4500.90 B=1202.64 -> %s" % (
                "OK" if abs(A-4500.90) < 5 and abs(B-1202.64) < 5 else "<<< NO CUADRA")
        print("  %6.2f %4d %12.4f %12.4f %10.7f   %s" % (nu, len(g), A, B, R2, ctl))

    print("\n  Formas candidatas para A(nu) y B(nu):")
    nus = sorted(n for n in por_nu if len(por_nu[n]) >= 3)
    if len(nus) >= 2:
        print("  %6s %12s %12s %10s %10s %10s %10s"
              % ("nu", "A", "B", "A/(1-nu)", "A(1-nu)", "B/(1-nu)", "B(1-nu)"))
        for nu in nus:
            g = por_nu[nu]
            t = np.array([x[0] for x in g]); y0 = np.array([x[1] for x in g]); L = g[0][2]
            s2 = (t/L)**2; phik = 2.0/(KAPPA*(1-nu))*s2; fac = (4.0/L**2+0.5)/4.5
            X = np.column_stack([1+phik, (1+phik)*s2])
            c, *_ = np.linalg.lstsq(X, fac/y0, rcond=None)
            A, B = 1.0/c[0], c[1]/c[0]
            print("  %6.2f %12.4f %12.4f %10.2f %10.2f %10.2f %10.2f"
                  % (nu, A, B, A/(1-nu), A*(1-nu), B/(1-nu), B*(1-nu)))


if __name__ == "__main__":
    main(*(sys.argv[1:] or []))
