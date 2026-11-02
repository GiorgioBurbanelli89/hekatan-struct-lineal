# -*- coding: utf-8 -*-
r"""¿DONDE VIVE el resto del trapecio?  El test que separa las dos hipotesis.

Los cruzados no arreglaron nada (89 % fuera, contra 96 % antes), aunque en el
cuadrado salieron **exactamente 0**, que era la prediccion por simetria. O sea que
la forma `V C V^T` no es el problema: el problema son los VECTORES.

Se mide directamente la fraccion de energia del autovector dominante REAL que cae
dentro del span de los cuatro. Si es alta, la base sirve y falla el modelo; si es
baja, el resto del trapecio simplemente NO esta ahi, y entonces ya no es una
penalizacion que se le suma al DSE: es que el DSE base es otro.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from trapecios_v4 import modos

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def frac(u, V):
    Q, _ = np.linalg.qr(np.column_stack(V))
    return float(np.linalg.norm(Q.T@u)**2/(u@u))


tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
print("="*84)
print("  fraccion del autovector dominante que CAE en el span de los 4 modos")
print("  1.00 = la base sirve   ·   bajo = el resto no esta ahi")
print("="*84)


def fila(tag, K, pts, E, nu, t):
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    w, V = np.linalg.eigh(R); o = np.argsort(-np.abs(w))
    M = modos(pts, "cart")
    f = [frac(V[:, o[j]], M) for j in (0, 1, 2)]
    print("  %-16s  v1 %.3f   v2 %.3f   v3 %.3f" % (tag, *f))


v = kd["entera"]; K = np.array(v["K"], float)
fila("CUADRADO", (K+K.T)/2, v["pts"], v["E"], v["nu"], v["t"])
print("-"*84)
for k in sorted(tr):
    vv = tr[k]; Kk = np.array(vv["K"], float)
    fila("d=%.2f t=%.2f" % (vv["d"], vv["t"]), (Kk+Kk.T)/2,
         vv["pts"], vv["E"], vv["nu"], vv["t"])
