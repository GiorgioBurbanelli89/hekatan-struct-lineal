# -*- coding: utf-8 -*-
"""La matriz del elemento de ABAQUS (S4 y S4R) contra la de ETABS y la nuestra.

Abaqus da la matriz del elemento DIRECTAMENTE con `*MATRIX GENERATE, ELEMENT BY
ELEMENT` — sin desplazamientos unitarios, sin flexibilidad, sin reconstruir. Y
su formulacion esta PUBLICADA en el Theory Manual. Es el tercer motor sobre la
misma celda: el que coincida con ETABS da la formulacion.

Formato del .mtx:  elem, nodo_i, gdl_i, nodo_j, gdl_j, valor   (triangular)
GDL de Abaqus: 1=u 2=v 3=w 4=theta_x 5=theta_y 6=theta_z  (igual que ETABS)
"""
import json, os, subprocess, sys
import numpy as np
SP=os.path.join(os.path.dirname(os.path.abspath(__file__)),"abq")
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
RAIZ= os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct"
KEL = os.path.join(RAIZ,"cli","native","kelem_native.exe")
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]
def leer_mtx(p):
    K=np.zeros((24,24))
    for ln in open(p):
        c=[z.strip() for z in ln.split(",")]
        if len(c)<6: continue
        ni,gi,nj,gj,val=int(c[1]),int(c[2]),int(c[3]),int(c[4]),float(c[5])
        a=(ni-1)*6+(gi-1); b=(nj-1)*6+(gj-1)
        K[a,b]=val; K[b,a]=val
    return K
def flex12(K24):
    idx=[6*n+2+k for n in range(4) for k in range(3)]   # w, theta_x, theta_y
    return K24[np.ix_(idx,idx)]
def nuestra(pts,E,nu,t,tipoPlaca):
    a=[KEL]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y)),"0"]
    a+=[repr(E),repr(nu),repr(t),"8","0.4",str(tipoPlaca)]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return flex12(np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()]))
E,nu,t=2.2e7,0.0,0.20
D=E*t**3/(12*(1-nu*nu))
pts=[(0,0),(1,0),(1,1),(0,1)]
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
Ke=np.array(kd["k_thick_nu00"]["K"]); Ke=(Ke+Ke.T)/2
cols=[("ETABS thick", Ke)]
for tag in ("S4","S4R"):
    p=os.path.join(SP,"celda_%s_STIF1.mtx"%tag)
    if os.path.exists(p): cols.append(("Abaqus "+tag, flex12(leer_mtx(p))))
cols.append(("Hek thick", nuestra(pts,E,nu,t,0)))
cols.append(("Hek thin",  nuestra(pts,E,nu,t,1)))
print("cuadrado 1x1, t=0.20, E=2.2e7, nu=0   —   autovalores / D  (D=%.6g)\n" % D)
print(" %-4s %s" % ("modo"," ".join("%13s"%n for n,_ in cols)))
esp=[(n,np.sort(np.linalg.eigvalsh((K+K.T)/2))/D) for n,K in cols]
for i in range(3,12):
    print(" %-4d %s" % (i+1," ".join("%13.6f"%w[i] for _,w in esp)))
print("\n distancia a ETABS (matriz entera y espectro):")
for n,K in cols[1:]:
    dk=np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100
    we=[w for nm,w in esp if nm==n][0]; wr=esp[0][1]
    print("   %-13s ||dK||/||K|| = %8.3f %%    ||dw||/||w|| = %8.3f %%"
          % (n, dk, np.linalg.norm(we[3:]-wr[3:])/np.linalg.norm(wr[3:])*100))
