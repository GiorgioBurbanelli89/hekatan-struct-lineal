# -*- coding: utf-8 -*-
r"""⚠️ ANTES de leer las piezas: el metodo PRESUPONE que K es LINEAL en los
modificadores. Si no lo es, `K(m11=2) - K(base)` NO es `int B1^T B1` y todo lo
que se deduzca de ahi es humo.

La prueba: si K(m11,m22,m12) = m11*A11 + m22*A22 + m12*A12 + cruzado(nu),
entonces subiendo DOS a la vez tiene que cumplirse

    K(2,2,1) - K(1,1,1)  ==  [K(2,1,1)-K(1,1,1)] + [K(1,2,1)-K(1,1,1)]

salvo por el termino CRUZADO D0*nu, que no lo cubre ningun modificador solo.
Con nu = 0.20 ese termino existe; su tamano se mide aparte.
"""
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
def K12(form,E,nu,t,pts,mod=(1,1,1,1,1)):
    a=[os.path.join(SP,"kb12b.exe"),str(form),repr(E),repr(nu),repr(t)]+[repr(float(z)) for z in mod]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

d=json.load(open(os.path.join(GAL,"flex12_piezas_thick.json"),encoding="utf-8"))
dt=json.load(open(os.path.join(GAL,"flex12_piezas.json"),encoding="utf-8"))
v=d["thickTOD"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]

print("=== ETABS: es LINEAL en los modificadores? ===")
for et,base,m11,m22,m1122,form in (
      ("THICK", d["thickTOD"], d["thickM11"], d["thickM22"], d["thickM1122"], 0),
      ("THIN",  dt["piezaTOD"], dt["piezaM11"], dt["piezaM22"], d["thinM1122"], 1)):
    Kb=rec(base); A1=rec(m11)-Kb; A2=rec(m22)-Kb; D22=rec(m1122)-Kb
    print("  %-6s ||K(2,2,1)-K(1,1,1) - (A11+A22)|| / ||...|| = %8.4f %%"
          % (et, rel(D22, A1+A2)))
    print("         (A11 y A22 iguales entre si? %.4f %%)" % rel(A1,A2))

print("\n=== Hekatan: lo mismo ===")
for et,form in (("THICK",0),("THIN",1)):
    Kb=K12(form,E,nu,t,pts)
    A1=K12(form,E,nu,t,pts,(2,1,1,1,1))-Kb
    A2=K12(form,E,nu,t,pts,(1,2,1,1,1))-Kb
    D22=K12(form,E,nu,t,pts,(2,2,1,1,1))-Kb
    print("  %-6s ||K(2,2,1)-K(1,1,1) - (A11+A22)|| / ||...|| = %8.4f %%"
          % (et, rel(D22, A1+A2)))
    print("         (A11 y A22 iguales entre si? %.4f %%)" % rel(A1,A2))

print("\n=== y cuanto pesa cada pieza dentro de su propia K ===")
Kb_e=rec(d["thickTOD"]); Kb_h=K12(0,E,nu,t,pts)
print("  ETABS   ||K||=%.5g   ||A11||/||K|| = %.4f   ||Av13||/||K|| = %.4f"
      % (np.linalg.norm(Kb_e), np.linalg.norm(rec(d["thickM11"])-Kb_e)/np.linalg.norm(Kb_e),
         np.linalg.norm(rec(d["thickV13"])-Kb_e)/np.linalg.norm(Kb_e)))
print("  Hekatan ||K||=%.5g   ||A11||/||K|| = %.4f   ||Av13||/||K|| = %.4f"
      % (np.linalg.norm(Kb_h),
         np.linalg.norm(K12(0,E,nu,t,pts,(2,1,1,1,1))-Kb_h)/np.linalg.norm(Kb_h),
         np.linalg.norm(K12(0,E,nu,t,pts,(1,1,1,2,2))-Kb_h)/np.linalg.norm(Kb_h)))
print("\n  -> dice QUE PARTE de la matriz es flexion y que parte es cortante")
