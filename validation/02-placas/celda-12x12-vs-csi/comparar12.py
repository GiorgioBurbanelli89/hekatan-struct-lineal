# -*- coding: utf-8 -*-
"""La 12x12 de FLEXION de Hekatan contra la MEDIDA de ETABS / SAP2000, termino
a termino. Las medidas vienen de flex12*.json (flexibilidad 9x9 medida por la
OAPI); aqui se reconstruye la 12x12 exacta con la misma cuenta que
flex12_analiza.py y se compara con la que saca kb12.exe del motor.
"""
import json, subprocess, sys, os
import numpy as np

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
KB12 = sys.argv[1] if len(sys.argv) > 1 else "kb12.exe"
OCT = r"C:\Program Files\GNU Octave\Octave-10.1.0\mingw64\bin"
os.environ["PATH"] = OCT + os.pathsep + os.environ["PATH"]

def reconstruir(v):
    """La 12x12 exacta desde la flexibilidad 9x9 medida (flex12_analiza.py)."""
    pts = v["pts"]
    libres  = [tuple(x) for x in v["libres"]]
    sujetos = [tuple(x) for x in v["sujetos"]]
    Kff = np.linalg.inv(np.array(v["F"]))
    R = np.zeros((12, 3))
    for n, (x, y) in enumerate(pts):
        R[3*n+0, 0] = 1.0
        R[3*n+0, 1] = x;  R[3*n+2, 1] = -1.0     # theta_y = -dw/dx
        R[3*n+0, 2] = y;  R[3*n+1, 2] = +1.0     # theta_x = +dw/dy
    fi = [3*n+k for (n, k) in libres]
    ri = [3*n+k for (n, k) in sujetos]
    Rr_inv = np.linalg.inv(R[ri])
    Kfr = -Kff @ R[fi] @ Rr_inv
    Krr = -Kfr.T @ R[fi] @ Rr_inv
    K = np.zeros((12, 12))
    K[np.ix_(fi, fi)] = Kff; K[np.ix_(fi, ri)] = Kfr
    K[np.ix_(ri, fi)] = Kfr.T; K[np.ix_(ri, ri)] = Krr
    return (K + K.T) / 2

def nuestra(tipo, E, nu, t, pts):
    a = [KB12, str(tipo), repr(E), repr(nu), repr(t)]
    for (x, y) in pts: a += [repr(float(x)), repr(float(y))]
    out = subprocess.run(a, capture_output=True, text=True)
    if out.returncode: raise RuntimeError(out.stderr)
    return np.array([[float(z) for z in ln.split()]
                     for ln in out.stdout.strip().splitlines()])

def comparar(K, H):
    """Diferencia relativa: norma del residuo contra la norma de la MEDIDA, y
    el termino que mas se aleja (medido contra el mayor de la matriz, no contra
    si mismo: un termino casi nulo daria un porcentaje enorme sin decir nada)."""
    dn = np.linalg.norm(K - H) / np.linalg.norm(K) * 100
    mx = np.abs(K).max()
    i, j = np.unravel_index(np.abs(K - H).argmax(), K.shape)
    return dn, np.abs(K - H).max() / mx * 100, (i, j, K[i, j], H[i, j])

FUENTES = [("ETABS 22", "flex12.json"), ("SAP2000 24", "flex12_sap.json"),
           ("ETABS thin", "flex12_thin.json"), ("ETABS dist", "flex12_dist.json")]
GDL = ["w", "tx", "ty"]

for prog, arch in FUENTES:
    p = os.path.join(GAL, arch)
    if not os.path.exists(p): continue
    d = json.load(open(p, encoding="utf-8"))
    print("\n" + "=" * 78)
    print(" %s   (%s)" % (prog, arch))
    print("=" * 78)
    print(" %-16s %-6s %8s %9s   %s" %
          ("caso", "tipo", "||dK||%", "peor%", "termino que mas se aleja"))
    for k, v in d.items():
        tipo = 1 if v["tipo"] == 1 else 0            # 1 = thin, 2 = thick
        K = reconstruir(v)
        H = nuestra(tipo, v["E"], v["nu"], v["t"], v["pts"])
        dn, pe, (i, j, kv, hv) = comparar(K, H)
        et = "thin" if tipo == 1 else "thick"
        print(" %-16s %-6s %7.3f%% %8.3f%%   K[%d%s,%d%s] %+12.4g vs %+12.4g" %
              (k, et, dn, pe, i//3+1, GDL[i%3], j//3+1, GDL[j%3], kv, hv))
