# -*- coding: utf-8 -*-
"""El espectro de TODAS las variantes contra el del Shell-Thick de ETABS.
Los autovalores/D son numeros puros: si dos elementos comparten espectro son
el mismo elemento salvo giro. Se busca cual reproduce 455.454364 y 13.671172."""
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
    if o.returncode: return None
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
v=d["cuad_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu))
VAR=[("ETABS thick",None,None),
     ("MITC4+alfa","kb12b.exe",0),
     ("MITC4 s/alfa","kb12_noalpha.exe",0),
     ("DSE","kb12_dse.exe",0),
     ("DSE_FULL","kb12_dsefull.exe",0),
     ("DKMQ","kb12b.exe",3),
     ("DKQ thin","kb12b.exe",1),
     ("shear full","kb12_shearfull.exe",0)]
cols=[]
for nom,exe,form in VAR:
    K = rec(v) if exe is None else K12(exe,form,E,nu,t,pts)
    if K is None: continue
    cols.append((nom, np.sort(np.linalg.eigvalsh((K+K.T)/2))/D))
print("cuadrado 1x1, nu=0, t=0.20 — autovalores / D")
print(" %-4s %s" % ("modo"," ".join("%13s"%n[:13] for n,_ in cols)))
for i in range(3,12):
    print(" %-4d %s" % (i+1," ".join("%13.6f"%w[i] for _,w in cols)))
ref=cols[0][1]
print("\n distancia del espectro al de ETABS (modos 4..12):")
for n,w in cols[1:]:
    print("   %-14s ||dw||/||w|| = %8.4f %%   modo mas alto %12.6f (ETABS %.6f)"
          % (n, np.linalg.norm(w[3:]-ref[3:])/np.linalg.norm(ref[3:])*100, w[11], ref[11]))
print("\n los DOS modos dobles 13.671172 de ETABS, quien los tiene:")
for n,w in cols:
    cerca=[x for x in w[3:] if abs(x/13.671172-1)<0.05]
    print("   %-14s %s" % (n, ["%.6f"%x for x in cerca] or "ninguno"))
