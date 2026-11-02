# -*- coding: utf-8 -*-
"""Que atadura de cortante usa el Shell-Thick de CSI.
El modo que no cuadra (455.454364*D) tiene w=0 y curvatura CERO: es cortante
PURO. Asi que se prueban las ataduras posibles y se mira cual da ese numero."""
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
def K12(exe,form,E,nu,t,pts,mod=(1,1,1,1,1)):
    a=[os.path.join(SP,exe),str(form),repr(E),repr(nu),repr(t)]+[repr(float(z)) for z in mod]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def F_de(K,lib):
    fi=[3*n+k for (n,k) in lib]; return np.linalg.inv(K[np.ix_(fi,fi)])
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
v=d["cuad_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D0=E*t**3/(12*(1-nu*nu)); G=E/(2*(1+nu))
Ke=reconstruir(v); lib=[tuple(x) for x in v["libres"]]
we,Ve=np.linalg.eigh(Ke)
# el modo de cortante puro de ETABS
vec_cort = Ve[:,11]

VAR=[("MITC4 covariante (hoy)","kb12b.exe"),
     ("cortante COMPLETO 2x2","kb12_shearfull.exe"),
     ("cortante REDUCIDO 1 punto","kb12_shearred.exe")]
print("cuadrado 1x1, nu=0, t=0.20.   D=%.6g   G*t=%.6g" % (D0,G*t))
print("\n=== el espectro (autovalor / D) ===")
cols=[("ETABS thick", np.sort(np.linalg.eigvalsh(Ke)))]
for nom,exe in VAR:
    cols.append((nom[:13], np.sort(np.linalg.eigvalsh(K12(exe,0,E,nu,t,pts)))))
print(" %-4s %s" % ("modo"," ".join("%14s"%n for n,_ in cols)))
for i in range(3,12):
    print(" %-4d %s" % (i+1," ".join("%14.6f"%(w[i]/D0) for _,w in cols)))

print("\n=== el MODO DE CORTANTE PURO de ETABS (455.454364 D), cuanto cuesta ===")
print("   ETABS                        %14.6f D" % (vec_cort@Ke@vec_cort/D0))
for nom,exe in VAR:
    K=K12(exe,0,E,nu,t,pts)
    print("   %-28s %14.6f D   razon ETABS/nuestro = %6.3f"
          % (nom, vec_cort@K@vec_cort/D0, (vec_cort@Ke@vec_cort)/(vec_cort@K@vec_cort)))

print("\n=== la flexibilidad entera contra ETABS ===")
for nom,exe in VAR:
    print("   %-28s %8.3f %%" % (nom, rel(np.array(v["F"]), F_de(K12(exe,0,E,nu,t,pts),lib))))

print("\n=== y con el cortante COMPLETO, barriendo su escala (v13=v23=s) ===")
mejor=(1e9,None)
for s in np.linspace(0.1,4.0,40):
    e=rel(np.array(v["F"]), F_de(K12("kb12_shearfull.exe",0,E,nu,t,pts,(1,1,1,s,s)),lib))
    if e<mejor[0]: mejor=(e,s)
print("   mejor s = %.3f  ->  %.3f %%   (kappa efectivo = %.4f)" % (mejor[1],mejor[0],mejor[1]*5/6))
