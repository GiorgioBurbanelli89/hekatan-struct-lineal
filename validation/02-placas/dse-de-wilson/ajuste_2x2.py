# -*- coding: utf-8 -*-
r"""AJUSTE del resto por MINIMOS CUADRADOS sobre las ENTRADAS de la matriz.

El problema con los trapecios, ya diagnosticado: `phi` y el modo de `w` **se
funden** (el MAC cae a 0.5). Ni proyectar sobre un vector fijo (cociente de
Rayleigh) ni emparejar por MAC sirven cuando dos modos se mezclan — el primero
suma las dos energias, el segundo elige uno y descarta el otro.

LO CORRECTO: no preguntar «cuanto vale phi» sino ajustar el resto ENTERO:

    R  ~  SUM_k  lambda_k  v_k v_k^T

con los `v_k` conocidos. Es LINEAL en los `lambda_k`, asi que se resuelve por
minimos cuadrados sobre las 144 entradas de la matriz — y el RESIDUO dice si el
modelo explica R o falta un termino. Los modos que se funden dejan de importar:
no hay que separarlos, se ajustan a la vez.

Los cuatro vectores (el resto tiene rango 4, medido):

    phi     giros que se abren del centroide:  tx = x-xc, ty = y-yc, w = 0
    w_hg    reloj de arena del desplazamiento w
    tx_hg   reloj de arena de theta_x
    ty_hg   reloj de arena de theta_y

Los relojes van ORTOGONALIZADOS contra {1, x, y} (Flanagan-Belytschko): si
llevan parte lineal, contaminan — es el mismo error que daba MAC 0.5 con phi
sin centrar.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
H = np.array([1.0, -1.0, 1.0, -1.0])


def vectores(pts):
    P = np.asarray(pts, float)
    xc, yc = P.mean(axis=0)
    x = P[:, 0]-xc; y = P[:, 1]-yc
    A = np.column_stack([np.ones(4), x, y])
    h = H - A@np.linalg.lstsq(A, H, rcond=None)[0]
    n = np.linalg.norm(h)
    h = h/n if n > 1e-12 else h
    V = np.zeros((12, 4))
    for i in range(4):
        V[3*i+1, 0] = x[i]; V[3*i+2, 0] = y[i]      # phi
        V[3*i+0, 1] = h[i]                          # w_hg
        V[3*i+1, 2] = h[i]                          # tx_hg
        V[3*i+2, 3] = h[i]                          # ty_hg
    return V/np.linalg.norm(V, axis=0)


def ajusta(R, V):
    """min_lambda || R - SUM lambda_k v_k v_k^T ||  -> lineal en lambda."""
    n = V.shape[1]
    G = np.zeros((n, n)); b = np.zeros(n)
    M = [np.outer(V[:, k], V[:, k]) for k in range(n)]
    for i in range(n):
        b[i] = np.sum(M[i]*R)
        for j in range(n):
            G[i, j] = np.sum(M[i]*M[j])
    lam = np.linalg.solve(G, b)
    Rm = sum(lam[k]*M[k] for k in range(n))
    res = np.linalg.norm(R-Rm)/max(np.linalg.norm(R), 1e-30)*100
    return lam, res


def caso(K, pts, E, nu, t):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V = vectores(pts)
    lam, res = ajusta(R, V)
    return lam/D, res


if __name__ == "__main__":
    print("=" * 96)
    print("  AJUSTE por minimos cuadrados:  R ~ SUM lambda_k v_k v_k^T")
    print("  'fuera %' = cuanto del resto NO explica el modelo de 4 terminos")
    print("=" * 96)

    # ── control: el cuadrado, donde los modos NO se funden ──
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]
    K = np.array(v["K"], float); K = (K+K.T)/2
    lam, res = caso(K, v["pts"], v["E"], v["nu"], v["t"])
    print("\n  CUADRADO (nu=0):  fuera = %.3f %%" % res)
    print("     phi=%9.4f   w_hg=%9.4f   tx_hg=%7.4f   ty_hg=%7.4f" % tuple(lam))
    print("     (medido aparte: phi=455.45, w=91.95, relojes=0.50)")

    # ── los trapecios ──
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("\n" + "=" * 96)
    print("  TRAPECIOS")
    print("=" * 96)
    print("  %-6s %5s %8s %10s %10s %8s %8s"
          % ("d", "t", "fuera%", "phi", "w_hg", "tx_hg", "ty_hg"))
    tabla = {}
    for k in sorted(tr):
        vv = tr[k]
        K = np.array(vv["K"], float); K = (K+K.T)/2
        lam, res = caso(K, vv["pts"], vv["E"], vv["nu"], vv["t"])
        tabla.setdefault(vv["d"], {})[vv["t"]] = lam
        print("  %-6.2f %5.2f %7.3f%% %10.3f %10.3f %8.4f %8.4f"
              % (vv["d"], vv["t"], res, lam[0], lam[1], lam[2], lam[3]))

    print("\n  phi ajustado, por d y t  (si el termino es geometrico, NO debe")
    print("  depender de t — como pasa en el cuadrado y en los paralelogramos)")
    ts = sorted({t for d in tabla for t in tabla[d]})
    print("  %-6s %s" % ("d", "  ".join("%10s" % ("t=%.2f" % t) for t in ts)))
    for d in sorted(tabla):
        print("  %-6.2f %s" % (d, "  ".join("%10.3f" % tabla[d][t][0] for t in ts)))
