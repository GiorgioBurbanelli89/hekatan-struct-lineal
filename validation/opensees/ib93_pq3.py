# -*- coding: utf-8 -*-
"""PQ3 de Ibrahimbegovic (1993) con los Δθ de lado COMPARTIDOS entre elementos (como el paper), Tabla 1 y 2."""
import sys, numpy as np
sys.path.insert(0, __file__.rsplit("\\", 1)[0].rsplit("/", 1)[0])
from placa_ibrahimbegovic1993 import k_pq3, k_pq2, _N, _NL, _lados, G2

def M_L(r, s, variante):
    m = np.array([0.5 * (1 - s) * r * (1 - r * r), 0.5 * (1 + r) * s * (1 - s * s),
                  0.5 * (1 + s) * r * (1 - r * r), 0.5 * (1 - r) * s * (1 - s * s)])
    if variante == 1: m *= np.array([1, 1, -1, -1])   # r(1-r²) medido en el sentido del lado
    return m

def resolver(n, t, consistente, pq3=True, cond=False, var=0, a=10.0, E=10.92, nu=0.3, q=1.0):
    h = a / 2 / n; nn = n + 1
    idx = lambda i, j: j * nn + i
    nnod = 3 * nn * nn
    eh = lambda i, j: nnod + j * n + i                 # lado horizontal (i..i+1, j)
    ev = lambda i, j: nnod + n * nn + j * nn + i       # lado vertical (i, j..j+1)
    ndof = nnod + 2 * n * nn if (pq3 and not cond) else nnod
    K = np.zeros((ndof, ndof)); F = np.zeros(ndof)
    for j in range(n):
        for i in range(n):
            nod = [idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)]
            pts = [(i * h, j * h), ((i + 1) * h, j * h), ((i + 1) * h, (j + 1) * h), (i * h, (j + 1) * h)]
            x = np.array([p[0] for p in pts]); y = np.array([p[1] for p in pts])
            l, nv = _lados(x, y)
            ke = (k_pq3(pts, E, nu, t, condensar=cond) if pq3 else k_pq2(pts, E, nu, t))
            nd = ke.shape[0]; fe = np.zeros(nd)
            if not consistente:
                fe[0:12:3] = q * h * h / 4
            else:
                for gr in (-G2, G2):
                    for gs in (-G2, G2):
                        N = _N(gr, gs); NL = _NL(gr, gs); dJ = h * h / 4
                        for I in range(4):
                            Kk = (I - 1) % 4
                            fe[3 * I] += q * N[I] * dJ
                            fe[3 * I + 1:3 * I + 3] += q * (NL[I] * l[I] / 8 * nv[I] - NL[Kk] * l[Kk] / 8 * nv[Kk]) * dJ
                        if nd == 16:
                            fe[12:] += q * M_L(gr, gs, var) * l / 6 * dJ
            g = list(np.array([[3 * k, 3 * k + 1, 3 * k + 2] for k in nod]).ravel())
            T = np.ones(nd)
            if nd == 16:
                g += [eh(i, j), ev(i + 1, j), eh(i, j + 1), ev(i, j)]
                T[12:] = [1 if nv[m] @ [1, 1] > 0 else -1 for m in range(4)]   # normal global +x/+y
            ke = ke * np.outer(T, T); fe = fe * T
            K[np.ix_(g, g)] += ke; F[g] += fe
    fijo = set()
    for j in range(nn):
        for i in range(nn):
            k = idx(i, j)
            if i == 0: fijo.add(3 * k + 2)
            if j == 0: fijo.add(3 * k + 1)
            if i == n: fijo |= {3 * k, 3 * k + 1}
            if j == n: fijo |= {3 * k, 3 * k + 2}
    if ndof > nnod:
        for m in range(n):
            fijo |= {ev(n, m), eh(m, n)}                 # SS duro: θ_n = 0 también en el lado
    lib = [d for d in range(ndof) if d not in fijo]
    u = np.zeros(ndof); u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], F[lib])
    return u[0], 0.5 * F @ u

REF = {0.1: {"L": [37874, 40478, 40621, 40640, 40643], "C": [56393, 44481, 41590, 40880, 40703]},
       1.0: {"L": [42.526, 42.675, 42.731, 42.730, 42.729], "C": [59.044, 46.678, 43.701, 42.970, 42.789]}}
for t in (0.1, 1.0):
    for c, nom in ((False, "L"), (True, "C")):
        for var in ((0, 1) if c else (0,)):
            for cond in (False, True):
                fila = []
                for k, n in enumerate((1, 2, 4, 8, 16)):
                    w, _ = resolver(n, t, c, cond=cond, var=var)
                    fila.append(f"{100*(w-REF[t][nom][k])/REF[t][nom][k]:+7.3f}")
                print(f"t={t} {nom} var{var} {'condensado' if cond else 'compartido'}: dif% 1,2,4,8,16 =", " ".join(fila))
