# -*- coding: utf-8 -*-
"""Separar la 12x12 del Shell-Thick de ETABS en FLEXION (t^3) y CORTANTE (t).

Bien hecho: el ajuste de la vez anterior lo dominaba el espesor gordo (el de
mayor norma). Aqui se resuelve EXACTO con dos espesores y se PREDICEN los otros
dos. Si la ley de Reissner-Mindlin es la suya, predice; si no, no.
"""
import json, os, itertools
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"

def reconstruir(v):
    pts=v["pts"]; libres=[tuple(x) for x in v["libres"]]; suj=[tuple(x) for x in v["sujetos"]]
    Kff=np.linalg.inv(np.array(v["F"])); R=np.zeros((12,3))
    for n,(x,y) in enumerate(pts):
        R[3*n+0,0]=1.0; R[3*n+0,1]=x; R[3*n+2,1]=-1.0; R[3*n+0,2]=y; R[3*n+1,2]=1.0
    fi=[3*n+k for (n,k) in libres]; ri=[3*n+k for (n,k) in suj]
    Ri=np.linalg.inv(R[ri]); Kfr=-Kff@R[fi]@Ri; Krr=-Kfr.T@R[fi]@Ri
    K=np.zeros((12,12)); K[np.ix_(fi,fi)]=Kff; K[np.ix_(fi,ri)]=Kfr
    K[np.ix_(ri,fi)]=Kfr.T; K[np.ix_(ri,ri)]=Krr
    return (K+K.T)/2

d = json.load(open(os.path.join(GAL,"flex12_t.json"), encoding="utf-8"))
cs = sorted([(v["t"], reconstruir(v)) for k,v in d.items()
             if k.startswith("cuad_t") and not k.endswith("_thin")],
            key=lambda z: -z[0])
ts = [t for t,_ in cs]; Ks = {t:K for t,K in cs}
E = 2.2e7; nu = 0.0
print("espesores: %s     E=%g  nu=%g" % (ts, E, nu))

print("\n=== 1 · como escala la matriz entera ===")
print("   si fuese Kirchhoff PURO, K/t^3 seria constante")
print("   si fuese Mindlin, K/t^3 CRECERIA al engordar (el cortante pesa mas)")
base = Ks[ts[-1]]/ts[-1]**3
for t in ts:
    r = Ks[t]/t**3
    print("   t=%.3f   ||K/t^3|| = %12.6g    vs el mas fino: %+8.3f %%"
          % (t, np.linalg.norm(r), (np.linalg.norm(r)/np.linalg.norm(base)-1)*100))

print("\n=== 2 · resolver A,B con DOS espesores y PREDECIR los otros ===")
for t1, t2 in itertools.combinations(ts, 2):
    # K(t1) = A t1^3 + B t1 ;  K(t2) = A t2^3 + B t2
    M = np.array([[t1**3, t1],[t2**3, t2]])
    inv = np.linalg.inv(M)
    A = inv[0,0]*Ks[t1] + inv[0,1]*Ks[t2]
    B = inv[1,0]*Ks[t1] + inv[1,1]*Ks[t2]
    otros = [t for t in ts if t not in (t1,t2)]
    pred = ["t=%.3f -> %7.3f %%" %
            (t, np.linalg.norm(A*t**3 + B*t - Ks[t])/np.linalg.norm(Ks[t])*100)
            for t in otros]
    wB = np.sort(np.linalg.eigvalsh((B+B.T)/2)); tolB = abs(wB).max()*1e-10
    print("   ajuste con t=%.3f y %.3f:  %s   | rango(B_cortante)=%d"
          % (t1, t2, "  ".join(pred), int(np.sum(np.abs(wB)>tolB))))

print("\n=== 3 · el Thin de ETABS como referencia de la parte de FLEXION ===")
dt = json.load(open(os.path.join(GAL,"flex12_thin.json"), encoding="utf-8"))
thin = {k:reconstruir(v) for k,v in dt.items() if v["tipo"]==1}
if "thin_nu00" in thin:
    Kthin = thin["thin_nu00"]; tthin = dt["thin_nu00"]["t"]
    A_thin = Kthin/tthin**3
    print("   Thin nu=0, t=%.2f -> A_thin = K/t^3, ||A_thin|| = %.6g"
          % (tthin, np.linalg.norm(A_thin)))
    for t in ts:
        # cuanto del Thick se explica con la flexion del Thin
        resid = Ks[t] - A_thin*t**3
        print("   t=%.3f   ||K_thick - A_thin t^3|| / ||K_thick|| = %7.3f %%"
              % (t, np.linalg.norm(resid)/np.linalg.norm(Ks[t])*100))
        w = np.sort(np.linalg.eigvalsh((resid+resid.T)/2))
        tol = abs(w).max()*1e-10
        neg = int(np.sum(w < -tol))
        print("        el resto: %d autovalores no nulos, %d NEGATIVOS"
              % (int(np.sum(np.abs(w)>tol)), neg))
