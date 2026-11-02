# -*- coding: utf-8 -*-
r"""COMO DEPENDEN los cuatro terminos de nu y de L.  28 celdas ya medidas.

El barrido de espesor (18 celdas, nu=0, L=1) dejo la ley del reloj de arena cerrada
al 0.0000 %:

    lambda_hg/D = A / [ (1 + B (t/L)^2) (1 + phi_k) ]    phi_k = 2/(kappa(1-nu)) (t/L)^2
    A = 4500.90    B = 1202.64                            (con nu=0, L=1)

Falta saber si `A` y `B` son constantes de verdad o funcion de nu y de L, y si la
`(t/L)^2` es la escala correcta. `celda_sap2000.json` ya trae 28 celdas con
nu = 0, 0.1, 0.2, 0.3, 0.45 y L = 0.5 ... 5.0, asi que tampoco hay que abrir ETABS.

⚠️ Los lambda dependen de COMO se normaliza el vector. `phi` va con (x-xc, y-yc),
que escala con L, mientras que los relojes van con xi,eta, que no. Para comparar
entre tamaños hay que normalizar los vectores IGUAL en todos, y aqui se hace
dividiendo phi por L antes de normalizar: asi `phi` es adimensional como los otros
y los lambda se pueden poner en la misma tabla sin que L se cuele por la puerta de
atras.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos_L(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    L = P[:, 0].max()-P[:, 0].min()
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    return [_v(Z, (P[:, 0]-xc)/L, (P[:, 1]-yc)/L),
            _v(h, -xi/4.0, eta/4.0), _v(Z, h, Z), _v(Z, Z, h)], L


def lam4(K, pts, E, nu, t):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V, L = modos_L(pts)
    A = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(A[i]*A[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(A[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*A[k] for k in range(4))
    return lam/D, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100, L


d = json.load(open(os.path.join(GAL, "celda_sap2000.json"), encoding="utf-8"))
filas = []
for k in sorted(d):
    v = d[k]
    if "K" not in v or "pts" not in v:
        continue
    P = np.array(v["pts"], float)
    if abs((P[:, 0].max()-P[:, 0].min())-(P[:, 1].max()-P[:, 1].min())) > 1e-9:
        continue                       # solo cuadradas: L unico
    K = np.array(v["K"], float); K = (K+K.T)/2
    lam, r, L = lam4(K, v["pts"], v["E"], v["nu"], v["t"])
    filas.append((v["nu"], L, v["t"], lam, r))

print("="*104)
print("  Los cuatro lambda/D con phi normalizado por L (adimensional como los relojes)")
print("="*104)
print("  %5s %6s %7s %8s %12s %12s %9s %9s"
      % ("nu", "L", "t", "fuera%", "phi", "hg", "hg_tx", "hg_ty"))
for nu, L, t, lam, r in sorted(filas, key=lambda z: (z[0], z[1], z[2])):
    print("  %5.2f %6.2f %7.3f %7.3f%% %12.4f %12.4f %9.4f %9.4f"
          % (nu, L, t, r, lam[0], lam[1], lam[2], lam[3]))

print("\n" + "="*104)
print("  Contra el modelo:  lambda_hg/D = A / [(1 + B (t/L)^2)(1 + phi_k)]")
print("  con A = 4500.90, B = 1202.64 y phi_k = 2/(kappa(1-nu)) (t/L)^2, kappa=5/6")
print("="*104)
A0, B0 = 4500.90, 1202.64
print("  %5s %6s %7s %13s %13s %9s   %13s %13s"
      % ("nu", "L", "t", "hg medido", "hg modelo", "error", "phi medido", "phi/(2.5-nu/2)"))
for nu, L, t, lam, r in sorted(filas, key=lambda z: (z[0], z[1], z[2])):
    x = (t/L)**2
    phik = 2.0/((5.0/6.0)*(1-nu))*x
    mod = A0/((1+B0*x)*(1+phik))
    e = (lam[1]/mod-1)*100
    print("  %5.2f %6.2f %7.3f %13.5f %13.5f %8.3f%%   %13.4f %13.4f"
          % (nu, L, t, lam[1], mod, e, lam[0], lam[0]/(2.5-nu/2)))
