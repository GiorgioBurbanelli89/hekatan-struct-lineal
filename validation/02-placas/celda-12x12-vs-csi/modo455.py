# -*- coding: utf-8 -*-
r"""El modo 455.454364 de ETABS: que es y como escala.

El modo, en el cuadrado unidad, es
    w = 0            theta_x = a(1-2x)      theta_y = a(1-2y)
Sus curvaturas son CERO:
    kxx = -dty/dx = 0    kyy = +dtx/dy = 0    kxy = dtx/dx - dty/dy = -2a+2a = 0
asi que en Mindlin la unica energia posible es de CORTANTE:
    gxz = dw/dx + ty = a(1-2y)      gyz = dw/dy - tx = -a(1-2x)
    E = kappa*G*t * int(gxz^2+gyz^2) = kappa*G*t * (2a^2/3)
Con ||v||=1 -> a^2=1/8  ->  E = kappa*G*t/12 = 125/12 * D = 10.416667 D.
Ese es EXACTAMENTE nuestro numero. ETABS da 43.72 veces mas.

Como distinguir que es lo suyo: por el ESPESOR.
   cortante  ->  la energia va como  kappa*G*t   (o sea como t, y /D como 1/t^2)
   flexion   ->  va como D (o sea como t^3, y /D constante)
   penalizacion dura -> no sigue ninguna de las dos
"""
import json, os
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
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

pts=[(0,0),(1,0),(1,1),(0,1)]
# el modo, montado a mano
v=np.zeros(12)
for n,(x,y) in enumerate(pts):
    v[3*n+0]=0.0; v[3*n+1]=(1-2*x); v[3*n+2]=(1-2*y)
v/=np.linalg.norm(v)

d=json.load(open(os.path.join(GAL,"flex12_t.json"),encoding="utf-8"))
E=2.2e7; nu=0.0; G=E/(2*(1+nu))
print("modo montado a mano (w=0, tx=1-2x, ty=1-2y), normalizado")
print("teoria de Mindlin para este modo:  E = kappa*G*t/12\n")
print(" %5s %14s %14s %14s %14s %10s" %
      ("t","E_ETABS","E/D","E/(kGt)","kGt/12 /D","t^-2"))
filas=[]
for k,vv in sorted([(k,x) for k,x in d.items() if k.startswith("cuad_t")
                    and not k.endswith("_thin")], key=lambda z:-z[1]["t"]):
    t=vv["t"]; K=reconstruir(vv)
    D=E*t**3/(12*(1-nu*nu)); kGt=5/6*G*t
    e=float(v@K@v)
    filas.append((t,e,e/D,e/kGt))
    print(" %5.2f %14.6g %14.6f %14.8f %14.6f %10.1f"
          % (t, e, e/D, e/kGt, (kGt/12)/D, 1/t**2))
print("\ncomo escala: si fuese CORTANTE, E/(kGt) seria CONSTANTE")
b=filas[0]
for t,e,eD,ek in filas:
    print("   t=%.2f   E/(kGt) = %.8f   (respecto a t=0.20: x%.4f)" % (t,ek,ek/b[3]))
print("\n   y si fuese FLEXION, E/D seria constante:")
for t,e,eD,ek in filas:
    print("   t=%.2f   E/D = %.6f   (respecto a t=0.20: x%.4f)" % (t,eD,eD/b[2]))
print("\n   nuestro valor teorico (Mindlin exacto) es E/(kGt) = 1/12 = %.8f" % (1/12))
