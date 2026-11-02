# -*- coding: utf-8 -*-
r"""AJUSTE v3: los cuatro de siempre MAS los dos de cortante transversal.

`cortante_quinto.py` dejo la firma: lo que sobraba daba MAC 0.87 contra el modo
`w = x` con los giros a CERO —cortante transversal puro— y **0.000 exacto** contra
el de la direccion `y`, en las 27 celdas. El trapecio se distorsiona en `x`: el
termino que falta vive en la direccion en que se distorsiona. Eso no es una
coincidencia que se pueda tener 27 veces.

Bases que se comparan (el residuo es lo unico que decide):

    4     phi + los tres relojes                       (lo de `ajuste_2x2`)
    5     + sx                                          el cortante en x
    6     + sx + sy                                     los dos, por simetria
    6b    6 pero SIN ortogonalizar los relojes

En el CUADRADO, `sx` y `sy` no deben aportar nada: por simetria el termino de
cortante que buscamos se anula, y el ajuste de 4 ya cerraba al 8 %. Si al meterlos
el cuadrado no cambia y los trapecios se desploman, es que el termino es ese.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from ajuste_v2 import _col, H, NAT

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def base(pts, modo):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    x, y = P[:, 0]-xc, P[:, 1]-yc; Z = np.zeros(4)
    A = np.column_stack([np.ones(4), x, y])
    ho = H - A@np.linalg.lstsq(A, H, rcond=None)[0]; ho = ho/np.linalg.norm(ho)
    hb = H/np.linalg.norm(H)
    h = hb if modo == "6b" else ho
    cols = [_col(Z, x, y), _col(h, Z, Z), _col(Z, h, Z), _col(Z, Z, h)]
    if modo in ("5", "6", "6b"):
        cols.append(_col(x, Z, Z))                 # sx
    if modo in ("6", "6b"):
        cols.append(_col(y, Z, Z))                 # sy
    return np.column_stack(cols)


def resid(K, pts, E, nu, t, modo):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V = base(pts, modo); n = V.shape[1]
    M = [np.outer(V[:, k], V[:, k]) for k in range(n)]
    G = np.array([[np.sum(M[i]*M[j]) for j in range(n)] for i in range(n)])
    b = np.array([np.sum(M[i]*R) for i in range(n)])
    lam = np.linalg.pinv(G, rcond=1e-12) @ b
    Rm = sum(lam[k]*M[k] for k in range(n))
    return lam/D, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100


if __name__ == "__main__":
    MOD = ["4", "5", "6", "6b"]
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]; K = np.array(v["K"], float); K = (K+K.T)/2
    print("="*92)
    print("  'fuera %' = cuanto del resto NO explica la base.  Menos es mejor.")
    print("="*92)
    print("  CUADRADO (control):  " + "   ".join(
        "%s -> %.2f%%" % (m, resid(K, v["pts"], v["E"], v["nu"], v["t"], m)[1]) for m in MOD))
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("\n  %-6s %5s %s %s" % ("d", "t", " ".join("%10s" % ("base "+m) for m in MOD),
                                  "   lam_sx/D (base 6)"))
    peor = {m: 0.0 for m in MOD}; lams = []
    for k in sorted(tr):
        vv = tr[k]; Kk = np.array(vv["K"], float); Kk = (Kk+Kk.T)/2
        fila = []
        for m in MOD:
            lam, r = resid(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"], m)
            peor[m] = max(peor[m], r); fila.append("%9.2f%%" % r)
            if m == "6":
                lsx, lsy = lam[4], lam[5]
        lams.append((vv["d"], vv["t"], lsx, lsy))
        print("  %-6.2f %5.2f %s      %11.3f  (sy %8.3f)"
              % (vv["d"], vv["t"], " ".join(fila), lsx, lsy))
    print("\n  %-12s %s" % ("PEOR CASO", " ".join("%9.2f%%" % peor[m] for m in MOD)))
    print("\n  lambda_sx/D por d y t — si el termino es geometrico NO debe depender de t:")
    ts = sorted({t for _, t, _, _ in lams})
    print("  %-6s %s" % ("d", "  ".join("%12s" % ("t=%.2f" % t) for t in ts)))
    for d in sorted({d for d, _, _, _ in lams}):
        print("  %-6.2f %s" % (d, "  ".join(
            "%12.4f" % next(l for dd, tt, l, _ in lams if dd == d and tt == t) for t in ts)))
