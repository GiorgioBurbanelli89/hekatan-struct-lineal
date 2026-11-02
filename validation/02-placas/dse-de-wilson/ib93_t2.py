import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from ib93 import K_ib93
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-22s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for nom,cub in (("PQ2",False),("PQ3",True)):
    K=K_ib93(pts,E,nu,t,cub,ntang=True)
    if K is None: print(" %-22s K22 SINGULAR"%nom); continue
    K=(K+K.T)/2; w=np.sort(np.linalg.eigvalsh(K))
    nul=int(np.sum(np.abs(w)<abs(w).max()*1e-10))
    d=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    print(" %-22s %s  nulos=%d ||dK||=%6.2f%%"
          % (nom," ".join("%9.4f"%z for z in w[3:]/D), nul, d))
    # emparejar por VALOR
    wh=w[3:]/D; us=set(); ok=0
    for a in we:
        c=[(abs(b/a-1),j) for j,b in enumerate(wh) if j not in us]
        if c:
            dif,j=min(c); us.add(j); ok+= dif*100<=1
    print("    modos que emparejan bajo el 1 %%: %d de 9" % ok)
