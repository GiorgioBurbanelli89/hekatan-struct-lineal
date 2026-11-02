# -*- coding: utf-8 -*-
"""El 455.454364: es constante en t (=> FLEXION). Ahora, es constante en la
GEOMETRIA y en nu? Eso dice si es una constante del elemento o depende de la
forma, que es lo que hay que reproducir."""
import json, os
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
def reconstruir(v):
    pts=v["pts"]; lib=[tuple(x) for x in v["libres"]]; suj=[tuple(x) for x in v["sujetos"]]
    Kff=np.linalg.inv(np.array(v["F"])); R=np.zeros((12,3))
    for n,(x,y) in enumerate(pts):
        R[3*n,0]=1.0; R[3*n,1]=x; R[3*n+2,1]=-1.0; R[3*n,2]=y; R[3*n+1,2]=1.0
    fi=[3*n+k for (n,k) in lib]; ri=[3*n+k for (n,k) in suj]
    Ri=np.linalg.inv(R[ri]); Kfr=-Kff@R[fi]@Ri; Krr=-Kfr.T@R[fi]@Ri
    K=np.zeros((12,12)); K[np.ix_(fi,fi)]=Kff; K[np.ix_(fi,ri)]=Kfr
    K[np.ix_(ri,fi)]=Kfr.T; K[np.ix_(ri,ri)]=Krr
    return (K+K.T)/2
E=2.2e7
print(" %-16s %5s %5s %14s %14s %14s" %
      ("caso","t","nu","lambda_max","lambda_max/D","/D/(1-nu^2)"))
for arch in ["flex12.json","flex12_thin.json"]:
    d=json.load(open(os.path.join(GAL,arch),encoding="utf-8"))
    print("--- %s" % arch)
    for k,v in d.items():
        t=v["t"]; nu=v["nu"]; D=v["E"]*t**3/(12*(1-nu*nu))
        w=np.linalg.eigvalsh(reconstruir(v))
        print(" %-16s %5.2f %5.2f %14.6g %14.6f %14.6f  %s"
              % (k,t,nu,w[-1],w[-1]/D,w[-1]/D*(1-nu*nu),
                 "thin" if v["tipo"]==1 else "thick"))
