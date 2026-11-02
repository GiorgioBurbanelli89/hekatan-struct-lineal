import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from dse8 import K_DSE8
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-28s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for nint in (4,8):
    for f in (2/3, 0.0):
        for pt in (True,False):
            K=K_DSE8(pts,E,nu,t,nint,f,pt); K=(K+K.T)/2
            w=np.sort(np.linalg.eigvalsh(K))[3:]/D
            print(" %-28s %s" % ("int=%d f=%.3f pt=%s"%(nint,f,pt),
                  " ".join("%9.4f"%z for z in w)))
