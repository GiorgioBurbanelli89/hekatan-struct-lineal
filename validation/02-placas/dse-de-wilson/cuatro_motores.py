# -*- coding: utf-8 -*-
"""LOS CUATRO MOTORES sobre la MISMA celda de cascara.
Cuadrado 1x1, t=0.20, E=2.2e7, nu=0. Autovalores de la 12x12 de FLEXION,
divididos por D: numeros puros, sin convenciones de signo ni de ejes.
  ETABS 22      medido por desplazamiento unitario -> reacciones (K directa)
  Abaqus 2017   *MATRIX GENERATE, ELEMENT BY ELEMENT
  OpenSees      integrator GimmeMCK 0 0 1 + printA   (y es ABIERTO)
  Hekatan       cli/native/kelem_native.exe
"""
import json, os, subprocess
import numpy as np
SP=os.path.dirname(os.path.abspath(__file__))
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
KEL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\cli\native\kelem_native.exe"
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]
E,nu,t=2.2e7,0.0,0.20; D=E*t**3/(12*(1-nu*nu))
IDX=[6*n+2+k for n in range(4) for k in range(3)]
def f12(K): return K[np.ix_(IDX,IDX)]
def mtx(p):
    K=np.zeros((24,24))
    for ln in open(p):
        c=[z.strip() for z in ln.split(",")]
        if len(c)<6: continue
        a=(int(c[1])-1)*6+int(c[2])-1; b=(int(c[3])-1)*6+int(c[4])-1
        K[a,b]=float(c[5]); K[b,a]=float(c[5])
    return K
def hek(tp):
    a=[KEL]
    for (x,y) in [(0,0),(1,0),(1,1),(0,1)]: a+=[repr(float(x)),repr(float(y)),"0"]
    a+=[repr(E),repr(nu),repr(t),"8","0.4",str(tp)]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return f12(np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()]))
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
Ke=np.array(kd["k_thick_nu00"]["K"])
cols=[("ETABS Thick",(Ke+Ke.T)/2)]
for tag in ("S4","S4R"):
    p=os.path.join(SP,"abq","celda_%s_STIF1.mtx"%tag)
    if os.path.exists(p): cols.append(("Abaqus "+tag, f12(mtx(p))))
for el in ("ShellMITC4","ShellDKGQ"):
    p=os.path.join(SP,"Kops_%s.npy"%el)
    if os.path.exists(p): cols.append(("OS "+el.replace("Shell",""), f12(np.load(p))))
cols += [("Hek Thick",hek(0)),("Hek Thin",hek(1))]
esp=[(n,np.sort(np.linalg.eigvalsh((K+K.T)/2))/D) for n,K in cols]
print("cuadrado 1x1, t=0.20, E=2.2e7, nu=0   —   autovalores / D\n")
print(" %-4s %s" % ("modo"," ".join("%12s"%n[:12] for n,_ in esp)))
for i in range(3,12):
    print(" %-4d %s" % (i+1," ".join("%12.6f"%w[i] for _,w in esp)))
print("\n a que distancia esta cada uno de ETABS:")
ref=esp[0][1]; Kr=cols[0][1]
for (n,w),(nm,K) in list(zip(esp,cols))[1:]:
    print("   %-14s espectro %7.3f %%   matriz %7.3f %%"
          % (n, np.linalg.norm(w[3:]-ref[3:])/np.linalg.norm(ref[3:])*100,
             np.linalg.norm(Kr-K)/np.linalg.norm(Kr)*100))
print("\n y a que distancia esta cada uno de NOSOTROS (Hek Thick):")
iH=[i for i,(n,_) in enumerate(esp) if n=="Hek Thick"][0]
wH=esp[iH][1]; KH=cols[iH][1]
for (n,w),(nm,K) in zip(esp,cols):
    if n=="Hek Thick": continue
    print("   %-14s espectro %7.3f %%   matriz %7.3f %%"
          % (n, np.linalg.norm(w[3:]-wH[3:])/np.linalg.norm(wH[3:])*100,
             np.linalg.norm(KH-K)/np.linalg.norm(KH)*100))
