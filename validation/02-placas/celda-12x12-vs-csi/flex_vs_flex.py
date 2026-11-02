# -*- coding: utf-8 -*-
"""MEDIDA contra MEDIDA: la flexibilidad 9x9.

Comparar matrices de rigidez reconstruidas mete dos suposiciones (la inversion
y el cierre por solido rigido). La flexibilidad F es lo que ETABS/SAP DIERON,
sin tocar. Asi que se hace al reves: se coge NUESTRA 12x12, se le aplican las
MISMAS ataduras del ensayo, se invierte y se compara con la F medida.

Es exactamente el mismo experimento numerico que se le hizo a ETABS.
"""
import json, os, subprocess, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
KB12 = sys.argv[1]
os.environ["PATH"] = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin" + os.pathsep + os.environ["PATH"]

def nuestra(tipo, E, nu, t, pts):
    a=[KB12,str(tipo),repr(E),repr(nu),repr(t)]
    for (x,y) in pts: a+=[repr(float(x)),repr(float(y))]
    o=subprocess.run(a,capture_output=True,text=True)
    if o.returncode: raise RuntimeError(o.stderr)
    return np.array([[float(z) for z in l.split()] for l in o.stdout.strip().splitlines()])

def nuestraF(K, libres):
    fi=[3*n+k for (n,k) in libres]
    return np.linalg.inv(K[np.ix_(fi,fi)])

GDL=["w","tx","ty"]
for arch in ["flex12.json","flex12_sap.json","flex12_thin.json","flex12_dist.json","flex12_t.json"]:
    p=os.path.join(GAL,arch)
    if not os.path.exists(p): continue
    d=json.load(open(p,encoding="utf-8"))
    print("\n"+"="*76); print(" %s" % arch); print("="*76)
    print(" %-16s %-5s %5s %5s %9s %9s   %s" %
          ("caso","tipo","t","nu","||dF||%","peor%","el grado que mas se aleja"))
    for k,v in d.items():
        tipo = 1 if v["tipo"]==1 else 0
        libres=[tuple(x) for x in v["libres"]]
        Fm=np.array(v["F"])
        Fh=nuestraF(nuestra(tipo, v["E"], v["nu"], v["t"], v["pts"]), libres)
        dn=np.linalg.norm(Fm-Fh)/np.linalg.norm(Fm)*100
        mx=np.abs(Fm).max()
        i,j=np.unravel_index(np.abs(Fm-Fh).argmax(), Fm.shape)
        n1,k1=libres[i]; n2,k2=libres[j]
        print(" %-16s %-5s %5.2f %5.2f %8.3f%% %8.3f%%   F[%d%s,%d%s] %11.4g vs %11.4g" %
              (k,"thin" if tipo==1 else "thick", v["t"], v["nu"], dn,
               np.abs(Fm-Fh).max()/mx*100, n1+1,GDL[k1], n2+1,GDL[k2], Fm[i,j], Fh[i,j]))
