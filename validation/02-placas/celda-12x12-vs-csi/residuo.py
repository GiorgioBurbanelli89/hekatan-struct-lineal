# -*- coding: utf-8 -*-
"""Aislar LO QUE LE FALTA a cada variante: R = K_ETABS - K_nuestra.
Si R sale de rango bajo y con autovectores reconocibles, esa es la pieza que
hay que anadir. Es la tecnica que ya aislo el termino de drilling de ETABS."""
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
print("cuadrado 1x1, nu=0, t=0.20.  D=%.6g  G*t=%.6g  5/6*G*t=%.6g\n"%(D,G*t,5/6*G*t))
for nom,exe,form in [("MITC4+alfa","kb12b.exe",0),("DKMQ","kb12b.exe",3),
                     ("DKQ thin","kb12b.exe",1),("DSE_FULL","kb12_dsefull.exe",0)]:
    Kh=K12(exe,form,E,nu,t,pts)
    if Kh is None: continue
    R=(Ke-Kh); R=(R+R.T)/2
    w=np.sort(np.linalg.eigvalsh(R)); tol=np.abs(w).max()*1e-9
    pos=int(np.sum(w>tol)); neg=int(np.sum(w<-tol))
    print("=== ETABS - %s ===" % nom)
    print("   ||R||/||K_ETABS|| = %.4f   autovalores: %d positivos, %d NEGATIVOS"
          % (np.linalg.norm(R)/np.linalg.norm(Ke), pos, neg))
    print("   autovalores/D:", np.array2string(w/D,precision=4,suppress_small=True))
    if neg==0 and pos>0:
        print("   *** R es SEMIDEFINIDA POSITIVA: se puede SUMAR (es rigidez que falta) ***")
    # el autovector dominante, leido como movimiento
    i=int(np.argmax(np.abs(w))); vec=np.linalg.eigh(R)[1][:,np.argsort(np.linalg.eigvalsh(R))[i]]
    print("   modo dominante (%.4f D), como movimiento:" % (w[i]/D))
    for n in range(4):
        print("      nudo %d (%.0f,%.0f): w=%+8.4f tx=%+8.4f ty=%+8.4f"
              % (n+1,pts[n][0],pts[n][1],vec[3*n],vec[3*n+1],vec[3*n+2]))
    print()
