# -*- coding: utf-8 -*-
"""Emparejar los modos POR VALOR, no por orden. Si nuestro DSE tiene los
autovalores de ETABS pero desplazados, es que le falta rigidez en unos modos
concretos — no que la formulacion sea otra."""
import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from dse_wilson import K_DSE
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
for k,v in kd.items():
    E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]; thin=v["tipo"]==1
    D=E*t**3/(12*(1-nu*nu))
    Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
    Kh=K_DSE(pts,E,nu,t,thin); Kh=(Kh+Kh.T)/2
    we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
    wh=np.sort(np.linalg.eigvalsh(Kh))[3:]/D
    print("\n== %-15s %s" % (k,"THIN" if thin else "THICK"))
    usados=set(); print("   %13s -> %13s   dif" % ("ETABS","el mas cercano"))
    for a in we:
        d=[(abs(b/a-1),j) for j,b in enumerate(wh) if j not in usados]
        if not d: continue
        dif,j=min(d); usados.add(j)
        print("   %13.6f    %13.6f  %8.3f %% %s" % (a,wh[j],dif*100,
              "OK" if dif*100<=1 else ""))
    libres=[wh[j] for j in range(len(wh)) if j not in usados]
    if libres: print("   nuestros SIN pareja:", ["%.4f"%z for z in libres])
