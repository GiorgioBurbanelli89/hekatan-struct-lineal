# -*- coding: utf-8 -*-
"""Los CUATRO modos del residuo contra DSE_FULL, leidos como movimiento.
El manual de CSI (§10.1.1) dice de su shell: «Out-of-plane displacements are
CUBIC». Un w cubico por lado = 4 GDL internos, uno por lado — que es justo el
rango del residuo. Si los 4 modos son los de lado, ya sabemos que falta."""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
SP  = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]
def rec(v):
    pts=v["pts"]; lib=[tuple(x) for x in v["libres"]]; suj=[tuple(x) for x in v["sujetos"]]
    Kff=np.linalg.inv(np.array(v["F"])); R=np.zeros((12,3))
    for n,(x,y) in enumerate(pts):
        R[3*n,0]=1.0; R[3*n,1]=x; R[3*n+2,1]=-1.0; R[3*n,2]=y; R[3*n+1,2]=1.0
    fi=[3*n+k for (n,k) in lib]; ri=[3*n+k for (n,k) in suj]
    Ri=np.linalg.inv(R[ri]); Kfr=-Kff@R[fi]@Ri; Krr=-Kfr.T@R[fi]@Ri
    K=np.zeros((12,12)); K[np.ix_(fi,fi)]=Kff; K[np.ix_(fi,ri)]=Kfr
    K[np.ix_(ri,fi)]=Kfr.T; K[np.ix_(ri,ri)]=Krr
    return (K+K.T)/2
def K12(exe,form,E,nu,t,pts):
    a=[os.path.join(SP,exe),str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True)
    return None if o.returncode else np.array(
        [[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
v=d["cuad_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu)); G=E/(2*(1+nu))
Ke=rec(v)
for nom,exe,form in [("DSE_FULL","kb12_dsefull.exe",0),("DKMQ","kb12b.exe",3)]:
    Kh=K12(exe,form,E,nu,t,pts); R=(Ke-Kh); R=(R+R.T)/2
    w,V=np.linalg.eigh(R); o=np.argsort(w)
    print("="*70); print(" ETABS - %s   (los modos con rigidez, de menor a mayor)" % nom)
    print("="*70)
    for i in o:
        if w[i] <= abs(w).max()*1e-3: continue
        vec=V[:,i]
        print("\n  lambda = %10.4f D   = %8.5f G*t" % (w[i]/D, w[i]/(G*t)))
        for n in range(4):
            print("     nudo %d (%.0f,%.0f):  w=%+8.4f  tx=%+8.4f  ty=%+8.4f"
                  % (n+1,pts[n][0],pts[n][1],vec[3*n],vec[3*n+1],vec[3*n+2]))
        # curvaturas del modo con B bilineal, en el centro
        tx=np.array([vec[3*n+1] for n in range(4)]); ty=np.array([vec[3*n+2] for n in range(4)])
        wn=np.array([vec[3*n] for n in range(4)])
        dNx=np.array([-.25,.25,.25,-.25]); dNy=np.array([-.25,-.25,.25,.25])
        kxx=-(dNx@ty); kyy=+(dNy@tx); kxy=(dNx@tx)-(dNy@ty)
        gx=(dNx@wn)+0.0; gy=(dNy@wn)-0.0
        print("     curvaturas en el centro (B bilineal): kxx=%+.4f kyy=%+.4f kxy=%+.4f"
              % (kxx,kyy,kxy))
        print("     w medio %+.4f · gradiente de w (%.4f, %.4f)" % (wn.mean(), dNx@wn, dNy@wn))
