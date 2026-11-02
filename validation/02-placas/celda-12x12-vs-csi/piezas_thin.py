# -*- coding: utf-8 -*-
r"""El Shell-THIN, pieza a pieza. Que K coincida NO prueba que B y D coincidan.

Se separa asi:

  K(nu) = int B^T Db B detJ,   Db = D0(nu) * [[1,nu,0],[nu,1,0],[0,0,(1-nu)/2]]
  D0(nu) = E t^3 / (12 (1-nu^2))

  ==>  K(nu) * (1-nu^2) * 12/(E t^3)  =  P  +  nu * Q          <-- LINEAL en nu
        P = int B^T [[1,0,0],[0,1,0],[0,0,1/2]] B detJ
        Q = int B^T [[0,1,0],[1,0,0],[0,0,-1/2]] B detJ

P y Q ya NO llevan constitutiva: son B y el jacobiano puros. Asi que:

  1. si la medida de ETABS es LINEAL en nu tras quitar D0(nu) -> su CONSTITUTIVA
     es la clasica, con el mismo D0(nu) y la misma estructura.  (2 nu para
     resolver, los otros 3 para VERIFICAR: no se ajusta nada, se predice)
  2. si ademas P y Q coinciden con los nuestros -> coinciden B^T ... B y el
     jacobiano, no solo su producto con D.
  3. la ley en t (t^3) se comprueba aparte con el barrido de espesor.
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
def K12(form,E,nu,t,pts):
    a=[EXE,str(form),repr(E),repr(nu),repr(t)]+["1.0"]*5
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def rel(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)

dt=json.load(open(os.path.join(GAL,"flex12_thin.json"),encoding="utf-8"))
CU=["thin_nu00","thin_nu10","thin_nu20","thin_nu30","thin_nu45"]
E=dt[CU[0]]["E"]; t=dt[CU[0]]["t"]; pts=dt[CU[0]]["pts"]
nus=[dt[k]["nu"] for k in CU]
Ke={k:reconstruir(dt[k]) for k in CU}
Kh={k:K12(1,E,dt[k]["nu"],t,pts) for k in CU}

print("Shell-THIN, cuadrado 1x1, E=%.4g, t=%.2f, nu = %s" % (E,t,nus))

print("\n=== 0 · a cuantas cifras coincide K (no el '0.000 %' redondeado) ===")
for k in CU:
    print("   nu=%.2f   ||K_ETABS - K_Hekatan|| / ||K_ETABS|| = %.3e"
          % (dt[k]["nu"], rel(Ke[k],Kh[k])))

def PQ(Ks, nus):
    """Quita D0(nu) y resuelve P,Q con los DOS primeros nu; con el resto PREDICE."""
    esc=lambda nu: (1-nu*nu)*12.0/(E*t**3)
    A=np.array([[1.0,nus[0]],[1.0,nus[1]]])
    Ai=np.linalg.inv(A)
    M0=Ks[0]*esc(nus[0]); M1=Ks[1]*esc(nus[1])
    P=Ai[0,0]*M0+Ai[0,1]*M1
    Q=Ai[1,0]*M0+Ai[1,1]*M1
    err=[(nus[i], rel(Ks[i]*esc(nus[i]), P+nus[i]*Q)) for i in range(len(nus))]
    return P,Q,err

Pe,Qe,ee = PQ([Ke[k] for k in CU], nus)
Ph,Qh,eh = PQ([Kh[k] for k in CU], nus)

print("\n=== 1 · la CONSTITUTIVA: K*(1-nu^2)*12/(E t^3) = P + nu*Q ? ===")
print("   (P y Q se resuelven con nu=0.00 y 0.10; el resto se PREDICE)")
print("   %6s %14s %14s" % ("nu","ETABS","Hekatan"))
for (nu,a),(_,b) in zip(ee,eh):
    marca = "  <- resuelto" if nu in nus[:2] else "  <- PREDICHO"
    print("   %6.2f %14.3e %14.3e%s" % (nu,a,b,marca))

print("\n=== 2 · P y Q: B^T(...)B y el jacobiano, ya SIN constitutiva ===")
print("   ||P_ETABS - P_Hek|| / ||P_ETABS|| = %.3e" % rel(Pe,Ph))
print("   ||Q_ETABS - Q_Hek|| / ||Q_ETABS|| = %.3e" % rel(Qe,Qh))
print("   ||P|| = %.6g (ETABS)  %.6g (Hek)" % (np.linalg.norm(Pe),np.linalg.norm(Ph)))
print("   ||Q|| = %.6g (ETABS)  %.6g (Hek)" % (np.linalg.norm(Qe),np.linalg.norm(Qh)))

print("\n=== 3 · la ley en t: K/t^3 constante? (Kirchhoff puro, sin cortante) ===")
dtt=json.load(open(os.path.join(GAL,"flex12_t.json"),encoding="utf-8"))
thins=[(k,v) for k,v in dtt.items() if v["tipo"]==1]
for k,v in thins:
    Kv=reconstruir(v); Kn=K12(1,v["E"],v["nu"],v["t"],v["pts"])
    print("   %-16s t=%.2f  ||K_E-K_H||/||K_E|| = %.3e   ||K/t^3||=%.6g"
          % (k, v["t"], rel(Kv,Kn), np.linalg.norm(Kv)/v["t"]**3))
kref=dt["thin_nu00"]
print("   %-16s t=%.2f                                  ||K/t^3||=%.6g"
      % ("thin_nu00", kref["t"], np.linalg.norm(Ke["thin_nu00"])/kref["t"]**3))

print("\n=== 4 · los MODOS (autovectores), no solo los autovalores ===")
for k in ["thin_nu00","thin_nu20","thin_nu45"]:
    we,Ve=np.linalg.eigh(Ke[k]); wh,Vh=np.linalg.eigh(Kh[k])
    # alineacion modo a modo: |v_e . v_h| debe ser 1
    al=[abs(float(Ve[:,i]@Vh[:,i])) for i in range(3,12)]
    print("   nu=%.2f  alineacion de los 9 modos: min=%.12f  media=%.12f"
          % (dt[k]["nu"], min(al), float(np.mean(al))))

print("\n=== 5 · el JACOBIANO: las geometrias DISTORSIONADAS ===")
print("   un jacobiano mal calculado NO puede dar cero aqui (es el bug del")
print("   bounding box del DKE, que daba 23-44 %)")
dd=json.load(open(os.path.join(GAL,"flex12_dist.json"),encoding="utf-8"))
for k,v in dd.items():
    Kv=reconstruir(v); Kn=K12(1,v["E"],v["nu"],v["t"],v["pts"])
    print("   %-16s %-28s ||dK||/||K|| = %.3e" % (k, str(v["pts"]), rel(Kv,Kn)))
