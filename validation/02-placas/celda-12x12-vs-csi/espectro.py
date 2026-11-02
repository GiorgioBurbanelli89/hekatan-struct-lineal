# -*- coding: utf-8 -*-
"""El ESPECTRO de la 12x12: los autovalores no dependen de convenciones de
signo, ni del orden de los nudos, ni de los ejes. Son LA firma del elemento:
cuantos modos tiene y con que rigidez cada uno. Si dos elementos tienen el
mismo espectro son el mismo elemento salvo giro."""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
SP  = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]

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
def K12(exe,form,E,nu,t,pts):
    a=[os.path.join(SP,exe),str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def esp(K):
    w=np.sort(np.linalg.eigvalsh((K+K.T)/2)); return w

d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
dt=json.load(open(os.path.join(GAL,"flex12_thin.json"),encoding="utf-8"))
v=d["cuad_nu00"]; vt=dt["thin_nu00"]
E,nu,t,pts = v["E"],v["nu"],v["t"],v["pts"]
D0 = E*t**3/(12*(1-nu*nu)); G=E/(2*(1+nu))
print("cuadrado 1x1  E=%.4g  nu=%.2f  t=%.2f" % (E,nu,t))
print("  D = E t^3/(12(1-nu^2)) = %.6g      5/6 G t = %.6g\n" % (D0, 5/6*G*t))

col = [("ETABS thick", esp(reconstruir(v))),
       ("ETABS thin",  esp(reconstruir(vt))),
       ("MITC4+alfa",  esp(K12("kb12b.exe",0,E,nu,t,pts))),
       ("MITC4 s/alfa",esp(K12("kb12_noalpha.exe",0,E,nu,t,pts))),
       ("DKQ (thin)",  esp(K12("kb12b.exe",1,E,nu,t,pts))),
       ("DKMQ",        esp(K12("kb12b.exe",3,E,nu,t,pts)))]
print(" %-4s %s" % ("modo", " ".join("%13s"%n for n,_ in col)))
for i in range(12):
    print(" %-4d %s" % (i+1, " ".join("%13.5g"%w[i] for _,w in col)))
print("\n  y cada autovalor DIVIDIDO por D (asi se ve el numero puro del elemento):")
print(" %-4s %s" % ("modo", " ".join("%13s"%n for n,_ in col)))
for i in range(3,12):
    print(" %-4d %s" % (i+1, " ".join("%13.6f"%(w[i]/D0) for _,w in col)))
