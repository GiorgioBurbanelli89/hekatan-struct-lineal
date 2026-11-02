# -*- coding: utf-8 -*-
"""Barrido del factor del termino Delta_psi en el cortante de lado (Wilson: 2/3)
y del factor de la correccion del patch test."""
import json, os, sys
import numpy as np
SP=os.path.dirname(os.path.abspath(__file__))
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
src=open(os.path.join(SP,"dse_wilson.py"),encoding="utf-8").read()
kd=json.load(open(os.path.join(GAL,"k_directa.json"),encoding="utf-8"))
def espectro(f23, fpt):
    code=src.replace("Bl[k,12+k] -= 2.0/3.0","Bl[k,12+k] -= %r"%f23)\
            .replace("B[:,12:]-=b12m","B[:,12:]-=%r*b12m"%fpt)
    g={}; exec(compile(code,"v","exec"),g)
    out=[]
    for k,v in kd.items():
        if v["tipo"]!=2: continue
        E,nu,t,pts=v["E"],v["nu"],v["t"],v["pts"]
        D=E*t**3/(12*(1-nu*nu))
        Ke=np.array(v["K"]); Ke=(Ke+Ke.T)/2
        K=g["K_DSE"](pts,E,nu,t,False); K=(K+K.T)/2
        we=np.sort(np.linalg.eigvalsh(Ke))[3:]/D
        wh=np.sort(np.linalg.eigvalsh(K))[3:]/D
        out.append((we,wh,np.linalg.norm(Ke-K)/np.linalg.norm(Ke)*100))
    return out
print("cuadrado nu=0: ETABS = 0.8878 0.9999 0.9999 1.0 1.0 13.6712 13.6712 91.9530 455.4544\n")
print(" %7s %6s  %s" % ("f(2/3)","f(8.17)","los 9 autovalores/D del cuadrado nu=0"))
for f23 in (2/3, 0.5, 1/3, 0.2, 0.0, -0.3):
    for fpt in (1.0, 0.0):
        r=espectro(f23,fpt)
        wh=r[1][1] if len(r)>1 else r[0][1]
        # el caso nu00 es el segundo de la lista (k_thick_nu00)
        for k,v in kd.items():
            pass
        print(" %7.4f %6.1f  %s" % (f23,fpt," ".join("%8.3f"%z for z in wh)))
print("\n ||dK|| medio por combinacion:")
for f23 in (2/3, 0.5, 1/3, 0.0):
    for fpt in (1.0, 0.0):
        r=espectro(f23,fpt)
        print("   f23=%.4f fpt=%.1f -> %.2f %%" % (f23,fpt,np.mean([z[2] for z in r])))
