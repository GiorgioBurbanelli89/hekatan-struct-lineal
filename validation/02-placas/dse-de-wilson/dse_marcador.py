# -*- coding: utf-8 -*-
import json, os, sys
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from dse_wilson import K_DSE
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
ok=0; tot=0
for k,v in kd.items():
    E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]; thin = v["tipo"]==1
    D=E*t**3/(12*(1-nu*nu))
    Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
    Kh=K_DSE(pts,E,nu,t,thin); Kh=(Kh+Kh.T)/2
    we=np.sort(np.linalg.eigvalsh(Ke))/D; wh=np.sort(np.linalg.eigvalsh(Kh))/D
    print("\n== %-15s %s  nu=%.2f" % (k,"THIN" if thin else "THICK",nu))
    print("   %-4s %13s %13s %9s" % ("modo","ETABS","DSE Wilson","dif"))
    for i in range(3,12):
        d=abs(wh[i]/we[i]-1)*100 if abs(we[i])>1e-12 else 0
        tot+=1; ok+= d<=1.0
        print("   %-4d %13.6f %13.6f %8.3f%% %s" % (i+1,we[i],wh[i],d,"OK" if d<=1 else ""))
    print("   ||dK||/||K|| = %.3f %%" % (np.linalg.norm(Ke-Kh)/np.linalg.norm(Ke)*100))
print("\n=====  %d de %d modos por debajo del 1 %%  =====" % (ok,tot))
