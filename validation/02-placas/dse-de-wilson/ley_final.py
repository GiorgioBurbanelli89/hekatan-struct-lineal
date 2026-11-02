# -*- coding: utf-8 -*-
r"""LA LEY COMPLETA de los cuatro terminos, con el modo bien dimensionado.

Todo lo aprendido en una sola comprobacion. Los modos, con xi,eta naturales,
h = xi*eta, y `L` el lado de la celda:

    phi     w = 0        theta = (x-xc, y-yc)
    hg      w = h/L      theta_x = -xi/4      theta_y = +eta/4      <- el 1/L es la clave
    hg_tx   w = 0        theta_x = h
    hg_ty   w = 0        theta_y = h

y las tres leyes, cada una medida en su barrido:

    lambda_phi / D  =  181.817 * (2.5 - nu/2)              18 espesores x 5 valores de nu
    lambda_htx/ D  =  lambda_hty/D  =  0.5 * (1 - nu)      exacto en los 5 nu
    lambda_hg / D  =  A / [(1 + B (t/L)^2)(1 + phi_k)]     phi_k = 2/(kappa(1-nu)) (t/L)^2
                      A = 4500.90   B = 1202.64  (nu = 0)

⚠️ `A` y `B` estan medidos SOLO con nu = 0: para separar su dependencia de nu hace
falta un barrido t x nu que todavia no existe (las celdas con nu != 0 son todas de
t = 0.2, y con un solo espesor A y B no se pueden separar). Se marca como tal.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])
A0, B0, KAPPA = 4500.90, 1202.64, 5.0/6.0


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def modos(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    L = 0.5*((P[:, 0].max()-P[:, 0].min())+(P[:, 1].max()-P[:, 1].min()))
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    return [_v(Z, P[:, 0]-xc, P[:, 1]-yc), _v(h/L, -xi/4.0, eta/4.0),
            _v(Z, h, Z), _v(Z, Z, h)], L


def predice(nu, t, L):
    x = (t/L)**2
    phik = 2.0/(KAPPA*(1-nu))*x
    return np.array([181.817*(2.5-nu/2), A0/((1+B0*x)*(1+phik)),
                     0.5*(1-nu), 0.5*(1-nu)])


filas = []
for f in ("celda_sap2000.json", "celda_sap_espesor.json"):
    d = json.load(open(os.path.join(GAL, f), encoding="utf-8"))
    for k, v in d.items():
        if "K" not in v or "pts" not in v:
            continue
        P = np.array(v["pts"], float)
        if abs((P[:, 0].max()-P[:, 0].min())-(P[:, 1].max()-P[:, 1].min())) > 1e-9:
            continue
        filas.append((v["nu"], v["t"], np.array(v["K"], float), v["pts"], v["E"]))

print("="*110)
print("  LA LEY, contra las 34 celdas cuadradas medidas de ETABS")
print("="*110)
print("  %5s %6s %7s %9s | %19s | %19s | %13s"
      % ("nu", "L", "t", "fuera", "phi  med / ley", "hg   med / ley", "htx med/ley"))
peor = {"phi": 0.0, "hg": 0.0, "htx": 0.0}
vistos = set()
for nu, t, K, pts, E in sorted(filas, key=lambda z: (z[0], z[1])):
    K = (K+K.T)/2
    V, L = modos(pts)
    if (round(nu, 4), round(L, 4), round(t, 6)) in vistos:
        continue
    vistos.add((round(nu, 4), round(L, 4), round(t, 6)))
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    Ai = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(Ai[i]*Ai[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(Ai[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)/D
    Rm = sum(lam[k]*D*Ai[k] for k in range(4))
    r = np.linalg.norm(R-Rm)/np.linalg.norm(R)*100
    p = predice(nu, t, L)
    e = [(lam[i]/p[i]-1)*100 for i in (0, 1, 2)]
    if nu == 0.0:
        for n, val in zip(("phi", "hg", "htx"), e):
            peor[n] = max(peor[n], abs(val))
    print("  %5.2f %6.2f %7.4f %8.4f%% | %8.2f %8.2f %6.2f%% | %8.2f %8.2f %6.2f%% | %5.4f %5.4f"
          % (nu, L, t, r, lam[0], p[0], e[0], lam[1], p[1], e[1], lam[2], p[2]))
print("\n  PEOR error de la ley (solo nu=0, donde A y B estan medidos):")
print("     phi %.4f %%   ·   hg %.4f %%   ·   htx %.4f %%" % (peor["phi"], peor["hg"], peor["htx"]))
print("\n  ⚠️ con nu != 0 el error de `hg` es esperado: A y B solo estan medidos a nu=0.")

# ======================================================================
#  EL FACTOR DE L: no es fisica, es la NORMALIZACION del vector.
#  El modo es v = (h/L, -xi/4, +eta/4), asi que su NORMA depende de L:
#      |v|^2 = 4/L^2 + 1/4 + 1/4 = 4/L^2 + 0.5      (4.5 cuando L = 1)
#  y el lambda de un vector normalizado es un cociente de Rayleigh: cambia con
#  la DIRECCION, y la direccion se mueve con L. Quitando ese factor queda la
#  magnitud invariante, que si obedece la ley con s = t/L en cualquier tamaño:
#      lambda(L) = lambda(t/L, L=1) * (4/L^2 + 0.5) / 4.5
# ======================================================================
def ley_hg(nu, t, L):
    s = (t/L)**2
    phik = 2.0/(KAPPA*(1-nu))*s
    return A0/((1+B0*s)*(1+phik)) * (4.0/L**2 + 0.5)/4.5
