# -*- coding: utf-8 -*-
r"""Las piezas de B del Shell-THICK, con los modificadores direccionales.
La misma tecnica que CERRO el Thin. La rigidez es lineal en los modificadores:
    A11 = K(m11=2) - K(base)   <- int B1^T B1 detJ, SIN constitutiva
"""
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
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)

p=os.path.join(GAL,"flex12_piezas_thick.json")
d=json.load(open(p,encoding="utf-8"))
falta=[k for k in ("thickTOD","thickM11","thickM22","thickM12") if k not in d]
if falta: raise SystemExit("faltan casos: %s" % falta)
v=d["thickTOD"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D0=E*t**3/(12*(1-nu*nu))
print("Shell-THICK, cuadrado 1x1, E=%.4g nu=%.2f t=%.2f   D=%.6g" % (E,nu,t,D0))

Kb_e=reconstruir(v)
A_e={n: reconstruir(d["thick"+n])-Kb_e for n in ("M11","M22","M12")}
Kb_h=K12("kb12b.exe",0,E,nu,t,pts)
A_h={"M11":K12("kb12b.exe",0,E,nu,t,pts,(2,1,1,1,1))-Kb_h,
     "M22":K12("kb12b.exe",0,E,nu,t,pts,(1,2,1,1,1))-Kb_h,
     "M12":K12("kb12b.exe",0,E,nu,t,pts,(1,1,2,1,1))-Kb_h}

print("\n=== las TRES piezas de B, sin constitutiva ===")
print(" %-6s %12s %12s %10s   %s" % ("pieza","||A|| ETABS","||A|| Hek","||dA||/||A||","rango"))
for n in ("M11","M22","M12"):
    a,b=A_e[n],A_h[n]
    ra=np.linalg.matrix_rank(a,tol=np.abs(a).max()*1e-10)
    rb=np.linalg.matrix_rank(b,tol=np.abs(b).max()*1e-10)
    print(" %-6s %12.6g %12.6g %9.4f %%   ETABS %d · Hek %d"
          % (n,np.linalg.norm(a),np.linalg.norm(b),rel(a,b)*100,ra,rb))

print("\n=== el resto: el termino cruzado D0*nu (ningun modificador lo cubre) ===")
se=Kb_e-sum(A_e.values()); sh=Kb_h-sum(A_h.values())
print("   ETABS   ||K-(A11+A22+A12)||/||K|| = %.4f %%" % (rel(Kb_e,sum(A_e.values()))*100))
print("   Hekatan                            = %.4f %%" % (rel(Kb_h,sum(A_h.values()))*100))
print("   los dos restos entre si            = %.4f %%" % (rel(se,sh)*100))

print("\n=== la base entera ===")
print("   ||dK||/||K|| = %.4f %%" % (rel(Kb_e,Kb_h)*100))

if "thickV13" in d:
    print("\n=== el CORTANTE aislado (V13=V23=2) ===")
    Av_e=reconstruir(d["thickV13"])-Kb_e
    Av_h=K12("kb12b.exe",0,E,nu,t,pts,(1,1,1,2,2))-Kb_h
    ra=np.linalg.matrix_rank(Av_e,tol=np.abs(Av_e).max()*1e-10)
    rb=np.linalg.matrix_rank(Av_h,tol=np.abs(Av_h).max()*1e-10)
    print("   ||Av|| ETABS %.6g   Hek %.6g   dif %.4f %%   rango ETABS %d · Hek %d"
          % (np.linalg.norm(Av_e),np.linalg.norm(Av_h),rel(Av_e,Av_h)*100,ra,rb))
    print("   autovalores/D ETABS:", np.array2string(
        np.sort(np.linalg.eigvalsh((Av_e+Av_e.T)/2))/D0, precision=4, suppress_small=True))
    print("   autovalores/D Hek  :", np.array2string(
        np.sort(np.linalg.eigvalsh((Av_h+Av_h.T)/2))/D0, precision=4, suppress_small=True))

for tag,ref in (("thickM1122","thick"),("thinM1122","thin")):
    if tag not in d: continue
    print("\n=== %s · el CRUZADO con m11 y m22 subidos A LA VEZ ===" % ref.upper())
    base = d["thickTOD"] if ref=="thick" else d.get("thinTOD2")
    if base is None: continue
    Kb=reconstruir(base); K22=reconstruir(d[tag])
    form = 0 if ref=="thick" else 1
    Kb_n=K12("kb12b.exe",form,E,nu,t,pts)
    K22_n=K12("kb12b.exe",form,E,nu,t,pts,(2,2,1,1,1))
    print("   ETABS   ||K(2,2,1)-K(1,1,1)|| = %.6g" % np.linalg.norm(K22-Kb))
    print("   Hekatan                       = %.6g" % np.linalg.norm(K22_n-Kb_n))
    print("   dif = %.4f %%" % (rel(K22-Kb, K22_n-Kb_n)*100))
    # que factor usa para el termino cruzado D0*nu
    A11=reconstruir(d["thickM11"])-Kb if ref=="thick" else None
    print("   (nuestro factor es sqrt(m11*m22)=%.6f; candidatas: 1.5, 2, 1)" % np.sqrt(4))
