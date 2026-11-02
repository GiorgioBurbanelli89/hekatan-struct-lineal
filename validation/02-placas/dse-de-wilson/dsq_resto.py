# -*- coding: utf-8 -*-
r"""EL RESTO  K_medida - K_elemento,  para DSE y para DSQ.

Por que esto y no el error: una matriz solo se corrige SUMANDO si el resto es
semidefinido positivo. Con el MITC4 el resto tenia autovalores negativos (no hay
nada que sumar); con el DSE salio SDP de rango 4. La pregunta es si el DSQ da un
resto MEJOR (menos rango = menos que explicar), sobre todo en el trapecio.
"""
import json, os
import numpy as np
from dsq_batoz import K_DSQ
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd = json.load(open(os.path.join(GAL, "k_directa.json"), encoding="utf-8"))

print("  caso            elem   ||dK||/||K||     rango  negativo/max      autovalores del resto / D")
print("  " + "-"*104)
for nombre, v in kd.items():
    K = np.array(v["K"]); K = (K+K.T)/2
    pts, E, nu, t = v["pts"], v["E"], v["nu"], v["t"]
    thin = (v["tipo"] == 1)
    D = E*t**3/(12*(1-nu*nu))
    for etq, Kx in (("DSE", K_DSE(pts, E, nu, t, thin=thin)),
                    ("DSQ", K_DSQ(pts, E, nu, t, "DKQ" if thin else "DSQ"))):
        R = (K - Kx); R = (R+R.T)/2
        w = np.sort(np.linalg.eigvalsh(R))
        tol = 1e-8*max(abs(w[-1]), 1e-30)
        rango = int((np.abs(w) > tol).sum())
        neg = w[0]/w[-1] if w[-1] > 0 else float("nan")
        err = np.linalg.norm(K-Kx)/np.linalg.norm(K)*100
        print("  %-14s  %s  %11.6f %%   %3d    %10.2e   %s"
              % (nombre, etq, err, rango, neg,
                 " ".join("%8.3f" % z for z in w[-5:]/D)))
