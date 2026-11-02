import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from ib93 import K_ib93
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-24s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for nom,cub,nt in (("PQ2 (n=tangente)",False,False),("PQ2 (n=normal)",False,True),
                   ("PQ3 (n=tangente)",True,False),("PQ3 (n=normal)",True,True)):
    K=K_ib93(pts,E,nu,t,cub,nt)
    if K is None: print(" %-24s K22 SINGULAR" % nom); continue
    K=(K+K.T)/2; w=np.sort(np.linalg.eigvalsh(K))
    nul=int(np.sum(np.abs(w)<abs(w).max()*1e-10))
    d=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    print(" %-24s %s  nulos=%d ||dK||=%6.2f%%"
          % (nom," ".join("%9.4f"%z for z in w[3:]/D), nul, d))
