# -*- coding: utf-8 -*-
"""EL MARCADOR: los 9 autovalores de la 12x12 de flexion contra los de ETABS.
Objetivo: menos del 1 % modo a modo. Se le pasa un .exe que saque la matriz."""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]
EXE = sys.argv[1]; FORM = sys.argv[2] if len(sys.argv)>2 else "0"
def K12(E,nu,t,pts,mod=(1,1,1,1,1)):
    a=[EXE,FORM,repr(E),repr(nu),repr(t)]+[repr(float(z)) for z in mod]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode,o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
tot=0; ok=0
for caso,tipo in (("k_thick_nu00",0),("k_thick_cuad",0),("k_thick_rect",0),
                  ("k_thick_trape",0),("k_thin_cuad",1)):
    v=kd[caso]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
    D=E*t**3/(12*(1-nu*nu))
    Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
    we=np.sort(np.linalg.eigvalsh(Ke))/D
    Kh=K12(E,nu,t,pts); wh=np.sort(np.linalg.eigvalsh((Kh+Kh.T)/2))/D
    print("\n== %-14s nu=%.2f  t=%.2f  %s" % (caso,nu,t,"THIN" if tipo else "THICK"))
    print("   %-5s %13s %13s %10s" % ("modo","ETABS","Hekatan","dif"))
    for i in range(3,12):
        d=abs(wh[i]/we[i]-1)*100 if abs(we[i])>1e-12 else float('nan')
        tot+=1; ok+= 1 if d<=1.0 else 0
        print("   %-5d %13.6f %13.6f %9.3f%% %s" % (i+1,we[i],wh[i],d,"OK" if d<=1 else ""))
    print("   ||dK||/||K|| = %.3f %%" % (np.linalg.norm(Ke-Kh)/np.linalg.norm(Ke)*100))
print("\n=======  MARCADOR: %d de %d modos por debajo del 1 %%  =======" % (ok,tot))
