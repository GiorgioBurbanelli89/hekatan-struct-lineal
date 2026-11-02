# -*- coding: utf-8 -*-
r"""B COMPONENTE A COMPONENTE, con los modificadores direccionales.

La rigidez es LINEAL en los modificadores:
    K(m11,m22,m12) = m11*A11 + m22*A22 + m12*A12   (+ el cruzado, ver abajo)
asi que subiendo uno de 1 a 2 y restando sale la pieza sola:
    A11 = K(m11=2) - K(base)      <-- int B1^T B1 detJ, SIN constitutiva
    A22 = K(m22=2) - K(base)      <-- int B2^T B2 detJ
    A12 = K(m12=2) - K(base)      <-- int B3^T B3 detJ  (el de cortante)

Esas tres integrales son B y el jacobiano PUROS: si coinciden con las nuestras,
coinciden las funciones de forma, B, B^T y el jacobiano — no solo su producto
con D.

⚠️ El termino CRUZADO D(1,2)=D0*nu no lo cubre ningun modificador solo: en
`plateDKQ.h` se puso `D0*nu*sqrt(m11*m22)` POR SUPOSICION. Este ensayo lo mide:
si la suposicion no es la de ETABS, A11+A22+A12 no reconstruira K.
"""
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
def K12(form,E,nu,t,pts,mod=(1,1,1,1,1)):
    a=[EXE,str(form),repr(E),repr(nu),repr(t)]+[repr(float(x)) for x in mod]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)

d=json.load(open(os.path.join(GAL,"flex12_piezas.json"),encoding="utf-8"))
v=d["piezaTOD"]; E,nu,t,pts = v["E"],v["nu"],v["t"],v["pts"]
print("Shell-THIN, cuadrado 1x1, E=%.4g, nu=%.2f, t=%.2f" % (E,nu,t))
print("modificadores: base (1,1,1) y cada uno subido a 2\n")

# --- ETABS
Kb_e  = reconstruir(v)
A11_e = reconstruir(d["piezaM11"]) - Kb_e
A22_e = reconstruir(d["piezaM22"]) - Kb_e
A12_e = reconstruir(d["piezaM12"]) - Kb_e
# --- Hekatan, por el mismo camino
Kb_h  = K12(1,E,nu,t,pts,(1,1,1,1,1))
A11_h = K12(1,E,nu,t,pts,(2,1,1,1,1)) - Kb_h
A22_h = K12(1,E,nu,t,pts,(1,2,1,1,1)) - Kb_h
A12_h = K12(1,E,nu,t,pts,(1,1,2,1,1)) - Kb_h

print("=== la base (sin modificadores) ===")
print("   ||dK||/||K|| = %.3e" % rel(Kb_e,Kb_h))
print("\n=== las tres piezas de B, SIN constitutiva ===")
for nom,a,b in (("A11 (kxx)",A11_e,A11_h),("A22 (kyy)",A22_e,A22_h),
                ("A12 (kxy)",A12_e,A12_h)):
    print("   %-10s ||dA||/||A|| = %.3e     ||A_ETABS||=%.6g  ||A_Hek||=%.6g"
          % (nom, rel(a,b), np.linalg.norm(a), np.linalg.norm(b)))

print("\n=== el termino CRUZADO D(1,2)=D0*nu: lo que NO cubre ningun modificador ===")
res_e = Kb_e - (A11_e+A22_e+A12_e)
res_h = Kb_h - (A11_h+A22_h+A12_h)
print("   resto ETABS   ||K-(A11+A22+A12)||/||K|| = %.4f %%" % (rel(Kb_e,A11_e+A22_e+A12_e)*100))
print("   resto Hekatan                            = %.4f %%" % (rel(Kb_h,A11_h+A22_h+A12_h)*100))
print("   y los dos restos entre si: ||dR||/||R|| = %.3e" % rel(res_e,res_h))

print("\n=== como se reparte el cruzado: K(m11=2,m22=2) contra las hipotesis ===")
print("   candidatas para el factor del termino D0*nu con m11=m22=2:")
K22_h = {c: None for c in ("sqrt","media","m11","uno")}
# medida de ETABS para m11=m22=2 no existe en el json; se comprueba la LEY con
# lo que si hay: si K(2,1,1)+K(1,2,1)-K(1,1,1) reconstruye, el cruzado es lineal
lhs_e = reconstruir(d["piezaM11"]) + reconstruir(d["piezaM22"]) - Kb_e
lhs_h = K12(1,E,nu,t,pts,(2,1,1,1,1)) + K12(1,E,nu,t,pts,(1,2,1,1,1)) - Kb_h
K21_h = K12(1,E,nu,t,pts,(2,2,1,1,1))
print("   Hekatan: ||K(2,2,1) - [K(2,1,1)+K(1,2,1)-K(1,1,1)]|| / ||K(2,2,1)|| = %.4f %%"
      % (rel(K21_h, lhs_h)*100))
print("   (si fuese 0, el cruzado seria LINEAL; con sqrt(m11*m22) no lo es)")

print("\n=== proyectores espectrales: los MODOS, agrupados por autovalor ===")
print("   (comparar autovectores uno a uno no vale: hay autovalores REPETIDOS")
print("    y dentro de un subespacio propio cualquier base sirve)")
dt=json.load(open(os.path.join(GAL,"flex12_thin.json"),encoding="utf-8"))
for k in ["thin_nu00","thin_nu20","thin_nu45"]:
    vv=dt[k]; Ke=reconstruir(vv); Kh=K12(1,vv["E"],vv["nu"],vv["t"],vv["pts"])
    we,Ve=np.linalg.eigh(Ke); wh,Vh=np.linalg.eigh(Kh)
    peor=0.0; grupos=0; i=0
    while i < 12:
        j=i
        while j+1 < 12 and abs(we[j+1]-we[i]) <= max(1e-8, abs(we[i])*1e-8): j+=1
        Pe=Ve[:,i:j+1]@Ve[:,i:j+1].T; Ph=Vh[:,i:j+1]@Vh[:,i:j+1].T
        peor=max(peor, np.linalg.norm(Pe-Ph)); grupos+=1; i=j+1
    print("   nu=%.2f  %d subespacios propios   ||P_ETABS - P_Hek||_max = %.3e"
          % (vv["nu"], grupos, peor))
