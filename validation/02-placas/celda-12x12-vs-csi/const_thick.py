# -*- coding: utf-8 -*-
"""La CONSTITUTIVA del Shell-THICK de ETABS, verificada como en el Thin.
Si K*(1-nu^2)*12/(E t^3) = P + nu*Q, su D0(nu) y su matriz son las clasicas.
Se resuelve con nu=0 y 0.10 y se PREDICEN 0.20, 0.30 y 0.45.
OJO: en Mindlin K lleva ademas el CORTANTE, que va con G=E/(2(1+nu)) y no
sigue esa ley — asi que el residuo que quede es la firma del cortante, no un
fallo. Por eso se mide tambien sobre NUESTRA matriz: si el residuo es el mismo,
los dos tienen la misma estructura constitutiva."""
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
def K12(form,E,nu,t,pts):
    a=[os.path.join(SP,"kb12b.exe"),str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(z)) for z in (0,0)][:0]+[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)

d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
CU=["cuad_nu00","cuad_nu10","cuad_nu20","cuad_nu30","cuad_nu45"]
E=d[CU[0]]["E"]; t=d[CU[0]]["t"]; pts=d[CU[0]]["pts"]
nus=[d[k]["nu"] for k in CU]
def prueba(Ks):
    esc=lambda nu:(1-nu*nu)*12.0/(E*t**3)
    A=np.array([[1.0,nus[0]],[1.0,nus[1]]]); Ai=np.linalg.inv(A)
    M0=Ks[0]*esc(nus[0]); M1=Ks[1]*esc(nus[1])
    P=Ai[0,0]*M0+Ai[0,1]*M1; Q=Ai[1,0]*M0+Ai[1,1]*M1
    return P,Q,[(nus[i], rel(Ks[i]*esc(nus[i]), P+nus[i]*Q)) for i in range(len(nus))]
Pe,Qe,ee=prueba([rec(d[k]) for k in CU])
Ph,Qh,eh=prueba([K12(0,E,nus[i],t,pts) for i in range(5)])
print("Shell-THICK: K*(1-nu^2)*12/(E t^3) = P + nu*Q ?")
print("(resuelto con nu=0.00 y 0.10; el resto PREDICHO)\n")
print("   %6s %14s %14s" % ("nu","ETABS","Hekatan"))
for (nu,a),(_,b) in zip(ee,eh):
    print("   %6.2f %14.3e %14.3e%s" % (nu,a,b,
        "   <- resuelto" if nu in nus[:2] else "   <- PREDICHO"))
print("\n   El residuo NO es cero porque en Mindlin K lleva tambien el CORTANTE,")
print("   que va con G = E/(2(1+nu)) y no sigue esa ley. Lo que importa es que")
print("   los DOS residuos sean del mismo tamano: eso dice que la estructura")
print("   constitutiva es la misma y que lo que difiere es B, no D.")
print("\n   ||P_ETABS||=%.6g  ||P_Hek||=%.6g   dif %.2f %%"
      % (np.linalg.norm(Pe),np.linalg.norm(Ph),rel(Pe,Ph)*100))
print("   ||Q_ETABS||=%.6g  ||Q_Hek||=%.6g   dif %.2f %%"
      % (np.linalg.norm(Qe),np.linalg.norm(Qh),rel(Qe,Qh)*100))
