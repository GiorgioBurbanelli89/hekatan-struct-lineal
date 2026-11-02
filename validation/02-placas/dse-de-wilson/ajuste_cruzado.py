# -*- coding: utf-8 -*-
r"""AJUSTE CON TERMINOS CRUZADOS:  R ~ V C V^T  con C SIMETRICA, no diagonal.

Todo lo anterior ajustaba `R ~ SUM lambda_k v_k v_k^T`, que es `V C V^T` con C
DIAGONAL. En el cuadrado eso basta y cierra al 0.0046 %. En el trapecio no cierra
ni de lejos, y `trapecio_crudo.py` enseña por que: los dos autovalores dominantes
se acercan (640 y 369 en d=0.20) y los autovectores salen MEZCLADOS — `w` y giros
revueltos en los dos, cuando en el cuadrado uno era phi puro y el otro el reloj.

Dos autovalores parecidos no rompen un ajuste por minimos cuadrados sobre las 144
entradas; lo que lo rompe es exigirle a C que sea diagonal. Y la penalizacion de
Wilson (9.13) es `k0 * Vol * b^T b` para UN vector: con varios, la forma general es
`B^T C B` con C matriz. En el cuadrado los cruzados se anulan por simetria —por eso
la version diagonal bastaba y engañaba—; al distorsionar, la simetria se rompe.

Sigue siendo LINEAL en las incognitas: 4 vectores -> 10 coeficientes (4 diagonales
+ 6 cruzados), y se resuelve igual. Si el termino cruzado es lo que falta, el
residuo se desploma y ademas los cruzados tienen que salir ~0 en el cuadrado.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from trapecios_v4 import modos

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def ajusta_C(R, V):
    """R ~ sum_{i<=j} c_ij (v_i v_j^T + v_j v_i^T)/(1+(i==j))  ->  lineal en c."""
    n = len(V)
    idx = [(i, j) for i in range(n) for j in range(i, n)]
    M = []
    for (i, j) in idx:
        A = np.outer(V[i], V[j])
        M.append(A if i == j else (A+A.T))
    m = len(M)
    G = np.array([[np.sum(M[a]*M[b]) for b in range(m)] for a in range(m)])
    y = np.array([np.sum(M[a]*R) for a in range(m)])
    c = np.linalg.pinv(G, rcond=1e-12) @ y
    Rm = sum(c[a]*M[a] for a in range(m))
    return c, idx, np.linalg.norm(R-Rm)/np.linalg.norm(R)*100


def caso(K, pts, E, nu, t, phi="cart"):
    D = E*t**3/(12*(1-nu*nu))
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V = modos(pts, phi)
    c, idx, r = ajusta_C(R, V)
    return c/D, idx, r


NOM = ["phi", "hg", "htx", "hty"]

if __name__ == "__main__":
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]; K = np.array(v["K"], float); K = (K+K.T)/2
    c, idx, r = caso(K, v["pts"], v["E"], v["nu"], v["t"])
    print("="*100)
    print("  CUADRADO (control):  fuera %.4f %%" % r)
    print("   " + "  ".join("%s-%s=%.3f" % (NOM[i], NOM[j], c[a])
                            for a, (i, j) in enumerate(idx)))
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("="*100)
    print("  TRAPECIOS — diagonal (antes)  vs  con cruzados")
    print("="*100)
    print("  %-6s %5s %11s %11s   %s" % ("d", "t", "diagonal", "con cruzados",
                                          "phi-phi   hg-hg   phi-hg   hg-htx"))
    from trapecios_v4 import caso as caso_diag
    peor = [0.0, 0.0]
    for k in sorted(tr):
        vv = tr[k]; Kk = np.array(vv["K"], float); Kk = (Kk+Kk.T)/2
        _, rd = caso_diag(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"], "cart")
        c, idx, rc = caso(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"])
        g = dict(zip([(i, j) for i, j in idx], c))
        peor[0] = max(peor[0], rd); peor[1] = max(peor[1], rc)
        print("  %-6.2f %5.2f %10.3f%% %10.4f%%   %8.2f %7.2f %8.2f %8.3f"
              % (vv["d"], vv["t"], rd, rc, g[(0, 0)], g[(1, 1)], g[(0, 1)], g[(1, 2)]))
    print("\n  PEOR CASO:  diagonal %.3f %%   con cruzados %.4f %%" % tuple(peor))
