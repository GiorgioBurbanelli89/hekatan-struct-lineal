# -*- coding: utf-8 -*-
r"""LA FORMA CERRADA DE lambda_hg(t).  Los otros tres ya son constantes.

De las 18 celdas (t = 0.001 a 2.0, cinco decadas) salio:

    phi   = 454.4544   constante   -> va con D, es flexion pura
    hg_tx = hg_ty = 0.4999         -> constante, y el 0.5 es exacto
    hg    = 4495.48 (t->0) ... 0.088 (t=2)     <- el unico que depende de t

Que `hg` tenga LIMITE FINITO cuando t->0 descarta que sea cortante puro
(`lambda ~ E*t` daria `lambda/D ~ 1/t^2`, que se dispara). Un limite finito con
caida suave es la firma de **dos rigideces EN SERIE**: `1/lambda = 1/lam_b + 1/lam_s`.
Si el segundo es cortante (`lam_s ~ G*kappa*t`), entonces, con `D/(G t) = t^2/6`
para nu=0:

    D/lambda  =  1/a  +  t^2/(6b)          -> recta en t^2

`y = m x + b` literal: se grafica `D/lambda` contra `t^2` y si sale RECTA, la
hipotesis es esa y la ordenada y la pendiente dan `a` y `b`. Si se curva, se lee
cuanto y se añade el termino siguiente.
"""
import json, os
import numpy as np
from ley_espesor import lams

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"

d = json.load(open(os.path.join(GAL, "celda_sap_espesor.json"), encoding="utf-8"))
T, Y = [], []
for k in sorted(d, key=lambda z: d[z]["t"]):
    v = d[k]
    K = np.array(v["K"], float); K = (K+K.T)/2
    lam, r, D = lams(K, v["pts"], v["E"], v["nu"], v["t"])
    T.append(v["t"]); Y.append(lam[1])
T = np.array(T); Y = np.array(Y)
inv = 1.0/Y                      # = D/lambda_hg

print("="*88)
print("  D/lambda_hg  contra  t^2   —  si es RECTA, son dos rigideces en serie")
print("="*88)
print("  %8s %10s %14s %14s" % ("t", "t^2", "D/lambda", "residuo recta"))
m = T <= 0.5
A = np.column_stack([np.ones(m.sum()), T[m]**2])
c, *_ = np.linalg.lstsq(A, inv[m], rcond=None)
for i in range(len(T)):
    pred = c[0] + c[1]*T[i]**2
    print("  %8.4f %10.6f %14.8f %13.2f %%"
          % (T[i], T[i]**2, inv[i], (inv[i]/pred-1)*100))
print("\n  ajuste con t<=0.5:   D/lambda = %.8e + %.8e * t^2" % (c[0], c[1]))
print("     -> a = 1/%.8e = %.4f      (el limite t->0, medido 4495.48)" % (c[0], 1/c[0]))
print("     -> pendiente %.6f ;  si fuese G*kappa*t con nu=0 seria 1/(6b)" % c[1])
print("        => b = 1/(6*%.6f) = %.6f" % (c[1], 1/(6*c[1])))

print("\n" + "="*88)
print("  Se curva. Se añade el termino siguiente:  D/lambda = c0 + c1 t^2 + c2 t^4")
print("="*88)
A2 = np.column_stack([np.ones(len(T)), T**2, T**4])
c2, *_ = np.linalg.lstsq(A2, inv, rcond=None)
peor = 0.0
for i in range(len(T)):
    pred = c2[0] + c2[1]*T[i]**2 + c2[2]*T[i]**4
    e = (inv[i]/pred-1)*100; peor = max(peor, abs(e))
    print("  %8.4f  medido %12.8f   modelo %12.8f   %8.3f %%" % (T[i], inv[i], pred, e))
print("\n  c0=%.8e  c1=%.8e  c2=%.8e" % tuple(c2))
print("  1/c0 = %.4f     peor error: %.3f %%" % (1/c2[0], peor))
print("\n  ratios con las constantes ya conocidas:")
print("    1/c0 / 454.4544 = %.6f" % ((1/c2[0])/454.4544))
print("    1/c0 / 181.78   = %.6f" % ((1/c2[0])/181.78))
print("    c1/c0 = %.6f      c2/c1 = %.6f" % (c2[1]/c2[0], c2[2]/c2[1]))
