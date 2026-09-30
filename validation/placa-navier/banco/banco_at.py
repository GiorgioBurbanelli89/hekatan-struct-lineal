# -*- coding: utf-8 -*-
"""Placa 4x4 apoyada (Uz), t=0.2: Auricchio-Taylor 1994 (FEAPpv) vs SAP2000 8x8 y vs la solución convergida."""
import json, os, sys, numpy as np
from scipy.sparse import lil_matrix
from scipy.sparse.linalg import spsolve
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, AQUI)
from placa_auricchio_taylor import placa_at
A, E, NU, Q = 4.0, 2.2e7, 0.2, -10.0
T = float(os.environ.get("T", "0.2"))

def resolver(N, solo_w=False):
    h = A / N; nid = lambda i, j: i * (N + 1) + j
    X = np.array([[i * h, j * h] for i in range(N + 1) for j in range(N + 1)])
    els = [[nid(i, j), nid(i + 1, j), nid(i + 1, j + 1), nid(i, j + 1)] for i in range(N) for j in range(N)]
    nn = len(X); K = lil_matrix((3 * nn, 3 * nn)); F = np.zeros(3 * nn); mom = []
    for e in els:
        Ke, Fe, m = placa_at(X[e], E, NU, T, Q); mom.append(m)
        if solo_w: Fe = Fe.copy(); Fe[1::3] = 0; Fe[2::3] = 0
        dof = [3 * n + c for n in e for c in range(3)]
        for a, da in enumerate(dof):
            F[da] += Fe[a]
            for b, db in enumerate(dof): K[da, db] += Ke[a, b]
    fij = set(3 * n for n in range(nn) if X[n, 0] in (0, A) or X[n, 1] in (0, A))
    lib = [d for d in range(3 * nn) if d not in fij]
    K = K.tocsr()[lib][:, lib]; U = np.zeros(3 * nn); U[lib] = spsolve(K, F[lib])
    acc = {}
    for k, e in enumerate(els):
        u = np.array([U[3 * n + c] for n in e for c in range(3)])
        for n, (r, s) in zip(e, [(-1, -1), (1, -1), (1, 1), (-1, 1)]):
            acc.setdefault((round(X[n, 0], 3), round(X[n, 1], 3)), []).append(mom[k](u, r, s))
    return X, U, {k: np.mean(v, 0) for k, v in acc.items()}

if __name__ != "__main__": raise SystemExit
PTS = [(0, 2), (0.5, 2), (1, 2), (1.5, 2), (2, 2), (0.5, 0.5), (1, 1)]
for N in (8, 16, 32):
    X, U, M = resolver(N)
    print(f"AT N={N:2d}  w_max {1000 * U[0::3].min():.5f} mm  " + "  ".join(f"({x},{y}) {-M[(x, y)][0]:.3f}" for x, y in PTS))
for sw in (False, True):
    X, U, M = resolver(8, sw)
    print(f"carga {'solo w' if sw else 'consistente (w ligado)'}: w_max {1000 * U[0::3].min():.5f} mm  centro {-M[(2.0, 2.0)][0]:.4f}  (0.5,2) {-M[(0.5, 2.0)][0]:.4f}")
# SAP 8x8 (juez) -----------------------------------------------------------------------------------------
S = json.load(open(os.path.join(AQUI, "..", "sap_thick", "placa_thick.json")))
X, U, M = resolver(8); pk = lambda x, y: (round(x, 3), round(y, 3)); idx = {pk(*X[n]): n for n in range(len(X))}
pw = mw = 0
for p in S["puntos"]:
    d = S["disp_nudos"][p["n"]]; n = idx[pk(p["x"], p["y"])]; mw = max(mw, abs(d[2])); pw = max(pw, abs(U[3 * n] - d[2]))
porN = {p["n"]: p for p in S["puntos"]}; accS = {}
for ar in S["areas"]:
    for v in S["shells"][ar["n"]]:
        p = porN[v[0]]; accS.setdefault(pk(p["x"], p["y"]), []).append(v[4:7])
mS = {k: np.mean(v, 0) for k, v in accS.items()}; mx = max(np.abs(v).max() for v in mS.values())
borde = lambda k: k[0] in (0, 4) or k[1] in (0, 4)
for sg in (1, -1):
    pn = max(np.abs(sg * M[k] - mS[k]).max() for k in mS) / mx * 100
    pi = max(np.abs(sg * M[k] - mS[k]).max() for k in mS if not borde(k)) / mx * 100
    print(f"AT 8x8 vs SAP2000 (signo {sg:+d}): w {100 * pw / mw:.3f} %   NUDO todos {pn:.2f} %  interior {pi:.2f} %")
