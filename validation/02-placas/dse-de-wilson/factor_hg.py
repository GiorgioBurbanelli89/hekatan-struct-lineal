# -*- coding: utf-8 -*-
r"""EL FACTOR del modo de reloj de arena: barrerlo en vez de suponerlo.

Con L=1 el modo salio `w = h, theta_x = -xi/4, theta_y = +eta/4` — los giros valen
w/4. Pero `w` es una longitud y los giros no, asi que ese 4 tiene que llevar dentro
una escala. Poner `w = L h` lo empeoro (3.1 % -> 7.7 %), asi que la escala no es esa.

En vez de seguir proponiendo: se barre. El modo es

    w = c h        theta_x = -xi/4        theta_y = +eta/4

y para cada celda se busca el `c` que minimiza el resto sin explicar. Luego se mira
si el `c` optimo va con L, con t, o con ninguno de los dos. `y = m x + b`: si sale
`c = k L`, se ve en la tabla sin tener que adivinarla.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
NAT = np.array([(-1., -1.), (1., -1.), (1., 1.), (-1., 1.)])


def _v(w, tx, ty):
    v = np.zeros(12); v[0::3], v[1::3], v[2::3] = w, tx, ty
    return v/np.linalg.norm(v)


def fuera(R, pts, c):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    xi, eta = NAT[:, 0], NAT[:, 1]; h = xi*eta; Z = np.zeros(4)
    V = [_v(Z, P[:, 0]-xc, P[:, 1]-yc), _v(c*h, -xi/4.0, eta/4.0),
         _v(Z, h, Z), _v(Z, Z, h)]
    A = [np.outer(v, v) for v in V]
    G = np.array([[np.sum(A[i]*A[j]) for j in range(4)] for i in range(4)])
    b = np.array([np.sum(A[i]*R) for i in range(4)])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*A[k] for k in range(4))
    return np.linalg.norm(R-Rm)/np.linalg.norm(R)*100, lam


filas = []
for f in ("celda_sap2000.json", "celda_sap_espesor.json"):
    d = json.load(open(os.path.join(GAL, f), encoding="utf-8"))
    for k, v in d.items():
        if "K" not in v or "pts" not in v:
            continue
        P = np.array(v["pts"], float)
        Lx, Ly = P[:, 0].max()-P[:, 0].min(), P[:, 1].max()-P[:, 1].min()
        if abs(Lx-Ly) > 1e-9 or v["nu"] != 0.0:
            continue
        K = np.array(v["K"], float); K = (K+K.T)/2
        filas.append((Lx, v["t"], K, v["pts"], v["E"], v["nu"]))

print("="*92)
print("  El factor `c` optimo del modo  (w = c h,  giros = -xi/4, +eta/4)")
print("  Si c=1 fuese universal, la columna c saldria 1 en todas.")
print("="*92)
print("  %7s %8s %8s %10s %10s %10s" % ("L", "t", "t/L", "c optimo", "c/L", "fuera con c"))
vistos = set()
for L, t, K, pts, E, nu in sorted(filas, key=lambda z: (z[0], z[1])):
    if (round(L, 5), round(t, 6)) in vistos:
        continue
    vistos.add((round(L, 5), round(t, 6)))
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    cs = np.concatenate([np.linspace(0.02, 4, 400), np.linspace(4, 60, 400)])
    vals = [fuera(R, pts, c)[0] for c in cs]
    i = int(np.argmin(vals))
    # refinado local
    lo, hi = cs[max(i-1, 0)], cs[min(i+1, len(cs)-1)]
    cf = np.linspace(lo, hi, 400)
    vf = [fuera(R, pts, c)[0] for c in cf]
    j = int(np.argmin(vf))
    print("  %7.2f %8.4f %8.4f %10.4f %10.4f %9.4f%%"
          % (L, t, t/L, cf[j], cf[j]/L, vf[j]))
