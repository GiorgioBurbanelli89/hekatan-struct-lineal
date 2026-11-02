# -*- coding: utf-8 -*-
"""Barrido de PIEZAS contra la flexibilidad medida del Shell-Thick de ETABS.

Se toca una pieza por vez y se mira si acerca:
  · la FORMULACION entera (MITC4 / DKQ / DKMQ)
  · la constitutiva de CORTANTE (v13=v23=s multiplica Ds -> equivale a barrer kappa)
  · la constitutiva de FLEXION (m11=m22=m, y m12 aparte)
Si ninguna cierra, el problema no esta en la constitutiva ni en el kappa: esta
en B (funciones de forma / interpolacion), que es la pieza que queda.
"""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
EXE = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]

def K12(form,E,nu,t,pts,mod=(1,1,1,1,1)):
    a=[EXE,str(form),repr(E),repr(nu),repr(t)]+[repr(float(x)) for x in mod]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def F_de(K,lib):
    fi=[3*n+k for (n,k) in lib]; return np.linalg.inv(K[np.ix_(fi,fi)])
def dif(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

d = json.load(open(os.path.join(GAL,"flex12.json"), encoding="utf-8"))
CASOS = ["cuad_nu00","cuad_nu20","cuad_nu45","rect_1x05","parale","trapecio"]

print("=== 1 · la FORMULACION entera, tal cual ===")
print(" %-12s %10s %10s %10s" % ("caso","MITC4","DKQ(thin)","DKMQ"))
for k in CASOS:
    v=d[k]; lib=[tuple(x) for x in v["libres"]]; Fe=np.array(v["F"])
    r=[]
    for form in (0,1,3):
        try: r.append("%9.3f%%" % dif(Fe, F_de(K12(form,v["E"],v["nu"],v["t"],v["pts"]),lib)))
        except Exception as e: r.append("   ERROR ")
    print(" %-12s %s %s %s" % (k, *r))

print("\n=== 2 · barrer el CORTANTE (v13=v23=s, o sea kappa*s) ===")
print("   si el problema fuese el kappa, algun s tendria que cerrar")
ss=[0.25,0.5,0.75,1.0,1.5,2.0,3.0,5.0,10.0,100.0]
print(" %-12s %s" % ("caso", " ".join("s=%-6g"%s for s in ss)))
for k in CASOS:
    v=d[k]; lib=[tuple(x) for x in v["libres"]]; Fe=np.array(v["F"])
    fila=[]
    for s in ss:
        F=F_de(K12(0,v["E"],v["nu"],v["t"],v["pts"],(1,1,1,s,s)),lib)
        fila.append("%6.1f%%" % dif(Fe,F))
    print(" %-12s %s" % (k, " ".join(fila)))

print("\n=== 3 · barrer la FLEXION (m11=m22=m) ===")
ms=[0.25,0.5,0.75,1.0,1.5,2.0,3.0,5.0]
print(" %-12s %s" % ("caso", " ".join("m=%-6g"%m for m in ms)))
for k in CASOS:
    v=d[k]; lib=[tuple(x) for x in v["libres"]]; Fe=np.array(v["F"])
    fila=[]
    for m in ms:
        F=F_de(K12(0,v["E"],v["nu"],v["t"],v["pts"],(m,m,1,1,1)),lib)
        fila.append("%6.1f%%" % dif(Fe,F))
    print(" %-12s %s" % (k, " ".join(fila)))

print("\n=== 4 · el mejor s de cortante, afinado (cuad_nu00) ===")
v=d["cuad_nu00"]; lib=[tuple(x) for x in v["libres"]]; Fe=np.array(v["F"])
mejor=(1e9,None)
for s in np.linspace(0.05,60,240):
    F=F_de(K12(0,v["E"],v["nu"],v["t"],v["pts"],(1,1,1,s,s)),lib)
    e=dif(Fe,F)
    if e<mejor[0]: mejor=(e,s)
print("   mejor: s=%.3f  ->  %.3f %%   (con s=1 daba %.3f %%)"
      % (mejor[1], mejor[0], dif(Fe,F_de(K12(0,v["E"],v["nu"],v["t"],v["pts"]),lib))))
