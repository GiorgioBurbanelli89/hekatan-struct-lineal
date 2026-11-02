# -*- coding: utf-8 -*-
"""QUE deformacion es la que ETABS rigidiza y nosotros no.

Los autovalores dicen CUANTO; los autovectores dicen QUE. Se miran los modos
del Shell-Thick de ETABS que no tienen pareja en nuestra columna —el 455.454364
y los 13.671172— y se leen como campo de desplazamientos en los 4 nudos.
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
def K12(exe,form,E,nu,t,pts):
    a=[os.path.join(SP,exe),str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])

d=json.load(open(os.path.join(GAL,"flex12.json"),encoding="utf-8"))
v=d["cuad_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D0=E*t**3/(12*(1-nu*nu)); G=E/(2*(1+nu))
Ke=reconstruir(v)
Kh=K12("kb12b.exe",0,E,nu,t,pts)
Kt=K12("kb12b.exe",1,E,nu,t,pts)      # nuestro thin = su thin

we,Ve=np.linalg.eigh(Ke)
print("cuadrado 1x1 (nudos %s), nu=0, t=0.20" % pts)
print("D = %.6g    G*t = %.6g    5/6*G*t = %.6g\n" % (D0, G*t, 5/6*G*t))
print("Los modos ALTOS del Shell-Thick de ETABS, leidos como movimiento:")
print("(cada nudo: w, theta_x, theta_y; el modo esta normalizado a 1)\n")
for i in [9,10,11]:
    lam=we[i]; vec=Ve[:,i]
    print("  modo %2d   lambda = %.6g   = %.6f * D   = %.6f * G*t"
          % (i+1, lam, lam/D0, lam/(G*t)))
    for n in range(4):
        print("      nudo %d (%.2f,%.2f):  w=%+9.5f  tx=%+9.5f  ty=%+9.5f"
              % (n+1, pts[n][0], pts[n][1], vec[3*n], vec[3*n+1], vec[3*n+2]))
    # cuanta energia tiene ese mismo movimiento en NUESTRO thick y en el thin
    print("      ese MISMO movimiento cuesta:  ETABS-thick %.6g | Hekatan-thick %.6g | thin %.6g"
          % (vec@Ke@vec, vec@Kh@vec, vec@Kt@vec))
    print("      razon ETABS/Hekatan = %.4f\n" % ((vec@Ke@vec)/(vec@Kh@vec)))

print("=== al reves: NUESTROS modos altos, cuanto cuestan en ETABS ===")
wh,Vh=np.linalg.eigh(Kh)
for i in [9,10,11]:
    vec=Vh[:,i]
    print("  nuestro modo %2d  lambda=%.6g (=%.4f D)   en ETABS cuesta %.6g   razon %.4f"
          % (i+1, wh[i], wh[i]/D0, vec@Ke@vec, (vec@Ke@vec)/(vec@Kh@vec)))
