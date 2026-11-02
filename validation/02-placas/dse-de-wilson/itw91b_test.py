import json, os, sys, itertools
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from itw91b import K_itw91b
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print(" %-26s %s" % ("ETABS"," ".join("%9.4f"%z for z in we)))
for bb,es,ws in itertools.product((True,False),(1.0,-1.0),(-1.0,1.0)):
    K=K_itw91b(pts,E,nu,t,bb,es,ws); K=(K+K.T)/2
    w=np.sort(np.linalg.eigvalsh(K))
    nul=int(np.sum(np.abs(w)<abs(w).max()*1e-10))
    d=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    wh=w[3:]/D; us=set(); ok=0
    for a in we:
        c=[(abs(b/a-1),j) for j,b in enumerate(wh) if j not in us]
        if c:
            dd,j=min(c); us.add(j); ok+= dd*100<=1
    print(" bb=%d e=%+.0f w=%+.0f nulos=%d  %s ||dK||=%6.2f%% ok=%d/9"
          % (bb,es,ws,nul," ".join("%8.3f"%z for z in wh),d,ok))
