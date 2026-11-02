# -*- coding: utf-8 -*-
r"""lambda_hg EN FORMA CERRADA Y FACTORIZADA.

El ajuste `D/lambda = c0 + c1 t^2 + c2 t^4` clava las 18 celdas al **0.000 %** en
cinco decadas de espesor. Y el polinomio FACTORIZA:

    1 + 1205.04 t^2 + 2886.34 t^4  =  (1 + 1202.64 t^2)(1 + 2.400 t^2)

El segundo factor no es un numero cualquiera. Con nu=0 y kappa=5/6:

    phi_k = 2/(kappa (1-nu)) * (t/L)^2 = 2.4 t^2        <- Katili (74), el del DKMQ

es decir, **el factor de cortante de la teoria de placas gruesas, tal cual**. El
termino de reloj de arena de CSI lleva dentro el mismo `1/(1+phi)` que llevan el
DKMQ y el MIN4; lo que cambia es el otro factor, con su propia constante.

Aqui se ajusta ya en forma factorizada —`A/((1+B t^2)(1+phi_k))`, con `phi_k`
FIJADO al 2.4 teorico, no ajustado— para que el residuo diga si el 2.4 es de
verdad exacto o solo se le parece. Si con el 2.4 clavado sigue dando 0.000 %, lo es.
"""
import json, os
import numpy as np
from ley_espesor import lams

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
d = json.load(open(os.path.join(GAL, "celda_sap_espesor.json"), encoding="utf-8"))
T, Y, NU = [], [], []
for k in sorted(d, key=lambda z: d[z]["t"]):
    v = d[k]; K = np.array(v["K"], float); K = (K+K.T)/2
    lam, r, D = lams(K, v["pts"], v["E"], v["nu"], v["t"])
    T.append(v["t"]); Y.append(lam[1]); NU.append(v["nu"])
T = np.array(T); Y = np.array(Y); nu = NU[0]
inv = 1.0/Y

PHI = 2.0/((5.0/6.0)*(1-nu))        # = 2.4 con nu=0 -> phi_k = PHI * t^2
print("  phi_k teorico (Katili 74, kappa=5/6, L=1, nu=%g):  phi = %.6f * t^2" % (nu, PHI))

# --- con el 2.4 CLAVADO: D/lam = (1/A)(1 + B t^2)(1 + PHI t^2) -> lineal en (1/A, B/A)
g = 1.0 + PHI*T**2
A_ = np.column_stack([g, g*T**2])
c, *_ = np.linalg.lstsq(A_, inv, rcond=None)
A = 1.0/c[0]; B = c[1]/c[0]
print("\n" + "="*84)
print("  MODELO:   lambda_hg / D  =  A / [ (1 + B t^2)(1 + phi_k) ]")
print("            A = %.4f     B = %.4f     phi_k = %.4f t^2  (FIJADO, no ajustado)"
      % (A, B, PHI))
print("="*84)
print("  %8s %14s %14s %10s" % ("t", "medido", "modelo", "error"))
peor = 0.0
for i in range(len(T)):
    mod = A/((1+B*T[i]**2)*(1+PHI*T[i]**2))
    e = (Y[i]/mod-1)*100; peor = max(peor, abs(e))
    print("  %8.4f %14.6f %14.6f %9.4f %%" % (T[i], Y[i], mod, e))
print("\n  PEOR ERROR con phi_k clavado en el 2.4 teorico:  %.4f %%" % peor)

# --- y ahora dejandolo libre, para ver a que converge ---
from itertools import product
best = None
for p in np.linspace(2.0, 2.8, 801):
    gg = 1.0+p*T**2
    AA = np.column_stack([gg, gg*T**2])
    cc, *_ = np.linalg.lstsq(AA, inv, rcond=None)
    mod = 1.0/(cc[0]*gg + cc[1]*gg*T**2)
    e = np.abs(mod/Y-1).max()
    if best is None or e < best[0]:
        best = (e, p, 1/cc[0], cc[1]/cc[0])
print("\n  dejando phi_k LIBRE, el optimo es phi = %.5f t^2 (teorico %.5f)  -> %.4f %% de error"
      % (best[1], PHI, best[0]*100))
print("  con ese phi:  A = %.4f    B = %.4f" % (best[2], best[3]))
print("\n  ratios de A y B con lo ya conocido (phi_mode = 454.4544, k = 181.78):")
print("    A/phi_mode = %.6f    A/k = %.6f    B/phi_mode = %.6f    A/B = %.6f"
      % (A/454.4544, A/181.78, B/454.4544, A/B))
