# -*- coding: utf-8 -*-
"""¿Que pieza del DSE genera los dos modos altos que faltan (91.95 y 455.45)?
Se prueban variantes de una en una."""
import json, os, sys, importlib
import numpy as np
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import dse_wilson as W
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),"dse_wilson.py"),
         encoding="utf-8").read()
VAR={
 "tal cual (con 8.17)": src,
 "SIN la correccion 8.17": src.replace("B[:,12:]-=b12m","pass  # sin 8.17"),
 "sin 8.17 y sin el 2/3": src.replace("B[:,12:]-=b12m","pass").replace(
                          "Bl[k,12+k] -= 2.0/3.0","Bl[k,12+k] -= 0.0"),
 "con 8.17, sin el 2/3": src.replace("Bl[k,12+k] -= 2.0/3.0","Bl[k,12+k] -= 0.0"),
}
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
v=kd["k_thick_nu00"]; E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
D=E*t**3/(12*(1-nu*nu))
Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
print("cuadrado 1x1, nu=0, t=0.20 — autovalores/D del Shell-THICK\n")
print(" %-24s %s" % ("variante"," ".join("%10.4f"%z for z in we)))
print(" %-24s %s" % ("(ETABS arriba)",""))
for nom,code in VAR.items():
    g={}
    exec(compile(code,"v","exec"),g)
    K=g["K_DSE"](pts,E,nu,t,False); K=(K+K.T)/2
    w=np.sort(np.linalg.eigvalsh(K))[3:]/D
    print(" %-24s %s" % (nom," ".join("%10.4f"%z for z in w)))
print("\n los dos que ETABS tiene y buscamos: 91.9530 y 455.4544")
