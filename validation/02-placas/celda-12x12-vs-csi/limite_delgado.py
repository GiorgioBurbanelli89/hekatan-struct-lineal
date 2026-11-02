# -*- coding: utf-8 -*-
"""LA prueba que decide: en el limite DELGADO, Mindlin tiene que converger a
Kirchhoff. O sea que a t=0.02 el Shell-Thick y el Shell-Thin del MISMO programa
tienen que darse la mano.

Se hace en las cuatro combinaciones:
    ETABS thick  vs  ETABS thin
    Hekatan thick vs Hekatan thin
    ETABS thick  vs  Hekatan thick
    ETABS thin   vs  Hekatan thin
"""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
KB12 = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]

def nuestra(tipo,E,nu,t,pts):
    a=[KB12,str(tipo),repr(E),repr(nu),repr(t)]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True); assert not o.returncode, o.stderr
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])
def F_de(K,libres):
    fi=[3*n+k for (n,k) in libres]; return np.linalg.inv(K[np.ix_(fi,fi)])
def dif(A,B): return np.linalg.norm(A-B)/np.linalg.norm(A)*100

d = json.load(open(os.path.join(GAL,"flex12_t.json"), encoding="utf-8"))
vk, vn = d["cuad_t002"], d["cuad_t002_thin"]           # thick y thin, t=0.02
lib = [tuple(x) for x in vk["libres"]]
assert lib == [tuple(x) for x in vn["libres"]]

Fek = np.array(vk["F"]); Fen = np.array(vn["F"])       # ETABS
Fhk = F_de(nuestra(0, vk["E"], vk["nu"], vk["t"], vk["pts"]), lib)
Fhn = F_de(nuestra(1, vn["E"], vn["nu"], vn["t"], vn["pts"]), lib)

print("cuadrado 1x1, t=0.02, nu=%.2f, E=%.4g   (t/L = 0.02, placa MUY delgada)"
      % (vk["nu"], vk["E"]))
print()
print("  ETABS  thick  vs  ETABS  thin    -> %8.3f %%" % dif(Fen, Fek))
print("  Hekatan thick vs  Hekatan thin   -> %8.3f %%" % dif(Fhn, Fhk))
print("  ETABS  thick  vs  Hekatan thick  -> %8.3f %%" % dif(Fek, Fhk))
print("  ETABS  thin   vs  Hekatan thin   -> %8.3f %%" % dif(Fen, Fhn))
print()
GDL=["w","tx","ty"]
print("  diagonal de la flexibilidad (grado a grado):")
print("  %-8s %13s %13s %13s %13s" % ("grado","ETABS thin","ETABS thick","Hek thin","Hek thick"))
for i,(n,k) in enumerate(lib):
    print("  %-8s %13.5g %13.5g %13.5g %13.5g" %
          ("%d%s"%(n+1,GDL[k]), Fen[i,i], Fek[i,i], Fhn[i,i], Fhk[i,i]))

print()
print("  y el termino CRUZADO que mas se aleja, barriendo nu (t=0.20):")
dd = json.load(open(os.path.join(GAL,"flex12.json"), encoding="utf-8"))
print("  %5s %14s %14s %10s" % ("nu","ETABS F[2tx,1tx]","Hek F[2tx,1tx]","razon"))
for k,v in dd.items():
    if v["tipo"] != 2 or not k.startswith("cuad_nu"): continue
    L=[tuple(x) for x in v["libres"]]
    i=L.index((1,1)); j=L.index((0,1))
    Fe=np.array(v["F"]); Fh=F_de(nuestra(0,v["E"],v["nu"],v["t"],v["pts"]),L)
    print("  %5.2f %14.5g %14.5g %10.3f" % (v["nu"], Fe[i,j], Fh[i,j], Fe[i,j]/Fh[i,j]))
