import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from ib1993_31 import K_ib31
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-22s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for nom,cub in (("3.1 cuadratico",False),("3.2 cubico",True)):
    K=K_ib31(pts,E,nu,t,cub); K=(K+K.T)/2
    w=np.sort(np.linalg.eigvalsh(K))[3:]/D
    d=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    print(" %-22s %s  ||dK||=%6.2f%%" % (nom," ".join("%9.4f"%z for z in w),d))
