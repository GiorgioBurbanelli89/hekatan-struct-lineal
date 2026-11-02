# -*- coding: utf-8 -*-
"""Antes de creerse NADA de la 12x12 medida: validarla.
  1. K por un SOLIDO RIGIDO tiene que dar cero   -> ||K R||/(||K|| ||R||) ~ 1e-15
  2. tiene que haber EXACTAMENTE 3 autovalores nulos
  3. simetrica y semidefinida positiva (el resto de autovalores > 0)
Si esto no cumple, la medida esta mal y comparar contra ella no significa nada.
"""
import json, os, sys
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"

def reconstruir(v):
    pts = v["pts"]
    libres  = [tuple(x) for x in v["libres"]]
    sujetos = [tuple(x) for x in v["sujetos"]]
    Kff = np.linalg.inv(np.array(v["F"]))
    R = np.zeros((12, 3))
    for n, (x, y) in enumerate(pts):
        R[3*n+0, 0] = 1.0
        R[3*n+0, 1] = x;  R[3*n+2, 1] = -1.0
        R[3*n+0, 2] = y;  R[3*n+1, 2] = +1.0
    fi = [3*n+k for (n, k) in libres]; ri = [3*n+k for (n, k) in sujetos]
    Ri = np.linalg.inv(R[ri])
    Kfr = -Kff @ R[fi] @ Ri; Krr = -Kfr.T @ R[fi] @ Ri
    K = np.zeros((12, 12))
    K[np.ix_(fi, fi)] = Kff; K[np.ix_(fi, ri)] = Kfr
    K[np.ix_(ri, fi)] = Kfr.T; K[np.ix_(ri, ri)] = Krr
    return (K + K.T)/2, R

print(" %-16s %-6s %11s %6s %12s %12s" %
      ("caso","tipo","||KR||/||K||","nulos","lambda_min+","lambda_max"))
for arch in ["flex12.json","flex12_sap.json","flex12_thin.json","flex12_dist.json"]:
    p = os.path.join(GAL, arch)
    if not os.path.exists(p): continue
    print("--- %s" % arch)
    for k, v in json.load(open(p, encoding="utf-8")).items():
        K, R = reconstruir(v)
        rr = np.linalg.norm(K @ R)/(np.linalg.norm(K)*np.linalg.norm(R))
        w = np.sort(np.linalg.eigvalsh(K))
        tol = abs(w[-1])*1e-10
        nulos = int(np.sum(np.abs(w) < tol))
        pos = w[np.abs(w) >= tol]
        print(" %-16s %-6s %11.2e %6d %12.4g %12.4g" %
              (k, "thin" if v["tipo"]==1 else "thick", rr, nulos,
               pos.min() if len(pos) else float('nan'), w[-1]))
