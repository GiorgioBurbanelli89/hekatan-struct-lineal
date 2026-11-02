# -*- coding: utf-8 -*-
"""Los numeros EN CRUDO, cifra a cifra. Sin porcentajes ni normas."""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
EXE = sys.argv[1]
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
def K12(form,E,nu,t,pts):
    a=[EXE,str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])

dt=json.load(open(os.path.join(GAL,"flex12_thin.json"),encoding="utf-8"))
v=dt["thin_nu20"]
Ke=reconstruir(v); Kh=K12(1,v["E"],v["nu"],v["t"],v["pts"])
GDL=["w","tx","ty"]
print("Shell-THIN, cuadrado 1x1, nu=0.20, t=0.20, E=2.2e7  (kN, m)")
print("epsilon de maquina del double = %.4e\n" % np.finfo(float).eps)
print(" %-11s %25s %25s  cifras iguales" % ("termino","ETABS 22","Hekatan Struct"))
sel=[(0,0),(0,1),(0,2),(1,1),(1,2),(3,3),(3,6),(6,9),(4,7),(2,5),(8,11),(5,10)]
tot=[]
for i,j in sel:
    a,b = Ke[i,j], Kh[i,j]
    sa,sb = "%.17g"%a, "%.17g"%b
    n=0
    for ca,cb in zip(sa,sb):
        if ca!=cb: break
        if ca.isdigit(): n+=1
    tot.append(n)
    print(" K[%d%-2s,%d%-2s] %25.17g %25.17g   %2d" %
          (i//3+1,GDL[i%3], j//3+1,GDL[j%3], a, b, n))
print("\n media de cifras decimales iguales: %.1f de las 17 que tiene un double" % np.mean(tot))
d=np.abs(Ke-Kh); mx=np.abs(Ke).max()
print("\n peor termino en valor absoluto: %.4g kN/m   (el mayor de la matriz vale %.6g)" % (d.max(), mx))
print(" o sea el error mas grande es %.3e %% del termino mayor" % (d.max()/mx*100))
print("\n Para hacerse una idea de esa escala:")
print("   la distancia de la Tierra al Sol son 1.496e11 m.")
print("   Con ese error relativo (%.2e), fallarias en %.3f mm."
      % (d.max()/mx, d.max()/mx*1.496e11*1000))
