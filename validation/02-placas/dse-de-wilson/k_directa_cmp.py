# -*- coding: utf-8 -*-
"""K DIRECTA (desplazamiento unitario -> reacciones) contra:
   a) la reconstruida por flexibilidad  -> VALIDA todo lo deducido hoy
   b) la nuestra, por el CLI oficial `cli/native/kelem_native.exe`
"""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
RAIZ= os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct"
KEL = os.path.join(RAIZ,"cli","native","kelem_native.exe")
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
def nuestra(pts,E,nu,t,tipoPlaca):
    """El CLI OFICIAL del repo. Devuelve la 24x24; se extraen w,tx,ty."""
    a=[KEL]
    for (x,y) in pts: a+= [repr(float(x)),repr(float(y)),"0"]
    a += [repr(E),repr(nu),repr(t),"8","0.4",str(tipoPlaca)]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    K24=np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
    idx=[6*n+2+k for n in range(4) for k in range(3)]
    return K24[np.ix_(idx,idx)]
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
fx={}
for arch in ("flex12.json","flex12_thin.json"):
    fx.update(json.load(open(os.path.join(GAL,arch),encoding="utf-8")))
MAP={"k_thick_cuad":"cuad_nu20","k_thin_cuad":"cuad_nu20_thin",
     "k_thick_nu00":"cuad_nu00","k_thick_rect":"rect_1x05","k_thick_trape":"trapecio"}
print("=== 1 · la K DIRECTA valida la RECONSTRUIDA por flexibilidad? ===")
print("   (si esto no cierra, todo lo deducido hoy de la reconstruida cojea)")
for k,v in kd.items():
    Kd=np.array(v["K"]); Kd=(Kd+Kd.T)/2
    ref=MAP.get(k)
    if ref and ref in fx:
        print("   %-14s ||K_directa - K_reconstruida|| / ||K|| = %8.4f %%"
              % (k, rel(Kd, rec(fx[ref]))))
print("\n=== 2 · ETABS (K directa) contra NOSOTROS (cli/native/kelem_native) ===")
print("   %-14s %-6s %10s   %s" % ("caso","tipo","||dK||%","autovalores/D"))
for k,v in kd.items():
    Kd=np.array(v["K"]); Kd=(Kd+Kd.T)/2
    tipo = 1 if v["tipo"]==1 else 0
    Kh=nuestra(v["pts"],v["E"],v["nu"],v["t"],tipo)
    D=v["E"]*v["t"]**3/(12*(1-v["nu"]**2))
    we=np.sort(np.linalg.eigvalsh(Kd))/D
    print("   %-14s %-6s %9.4f%%" % (k,"thin" if tipo else "thick", rel(Kd,Kh)))
    print("        ETABS  : %s" % " ".join("%9.4f"%z for z in we[3:]))
    print("        Hekatan: %s" % " ".join("%9.4f"%z for z in
          (np.sort(np.linalg.eigvalsh((Kh+Kh.T)/2))/D)[3:]))
