"""Prototipo (Python, motor hekatan_struct) del pandeo de cáscaras: [K + λ·Kg(σ)]Ψ = 0.
CSiRefer p.444: tensiones del estático → integradas con las DERIVADAS de las funciones de forma isoparamétricas
→ geométrica estándar, solo fuerzas (traslaciones). Opciones para decidir contra SAP2000:
  gdl   = "w" | "uvw"        traslaciones que reciben Kg
  ng    = 1 | 2 | 3          Gauss n×n para integrar Kg
  sigma = "gauss" | "centro" tensión en cada punto o la del centro
    python proto.py [gdl] [ng] [sigma]"""
import json, os, sys
import numpy as np
from scipy.linalg import eigh
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "hekatan-struct-py", "src"))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hekatan_struct.data_model import NodeInputs, ElementInputs
from hekatan_struct.solver import _assemble_K
from hekatan_struct.elements.shell import shell_q4_local_axes, shell_q4_T
from modelos import MODELOS, E, NU

GP = {1: ([0.0], [2.0]), 2: ([-1 / 3 ** .5, 1 / 3 ** .5], [1.0, 1.0]),
      3: ([-(0.6 ** .5), 0, 0.6 ** .5], [5 / 9, 8 / 9, 5 / 9])}


def dN(r, s):
    return 0.25 * np.array([[-(1 - s), (1 - s), (1 + s), -(1 + s)], [-(1 - r), -(1 + r), (1 + r), (1 - r)]])


def armar(M):
    nodos = [list(map(float, p)) for p in M["nodos"]]; els = [list(c) for c in M["panos"]]
    ei = ElementInputs()
    for e in range(len(els)):
        ei.elasticities[e] = E; ei.poissons_ratios[e] = NU; ei.thicknesses[e] = M["t"]; ei.plate_formulations[e] = 1
        ei.shear_moduli[e] = E / (2 * (1 + NU))
    ei.etabs_wall_joint = False
    K = _assemble_K(nodos, els, ei)
    n = len(nodos); F = np.zeros(6 * n)
    for q, c in M["cargas"].items(): F[6 * int(q):6 * int(q) + 6] += c
    fijo = np.zeros(6 * n, bool)
    for q, s in M["apoyos"].items():
        for k in range(6):
            if s[k]: fijo[6 * int(q) + k] = True
    d = np.abs(np.diag(K)); libre = np.where(~fijo & (d > 1e-12 * d.max()))[0]
    return nodos, els, K, F, libre


from hekatan_struct.elements import membrane_itw as MI


def b_itw(X4, Y4, r, s, proyectar=True):
    """B 3×12 [u v θz]×4 de la membrana ITW (Allman por los lados), SIN burbuja; proyección del giro = tipo 8."""
    cx, cy = MI._lados(X4, Y4)
    def partes(rr, ss):
        dr, ds, Ji, dJ = MI._jacobiano(rr, ss, X4, Y4)
        nsr, nss = MI._serendipity(rr, ss)
        NSx = Ji[0, 0] * nsr + Ji[0, 1] * nss; NSy = Ji[1, 0] * nsr + Ji[1, 1] * nss
        A = MI._ANT
        g = np.array([NSx[A] * cx[A] - NSx * cx, NSy[A] * cy[A] - NSy * cy,
                      (NSy[A] * cx[A] - NSy * cx) + (NSx[A] * cy[A] - NSx * cy)])
        return Ji[0, 0] * dr + Ji[0, 1] * ds, Ji[1, 0] * dr + Ji[1, 1] * ds, g, abs(dJ)
    med = 0
    if proyectar:
        cuad, _ = MI._puntos("gauss", 3, 0.99); acc = 0; ar = 0
        for rr, ss, ww in cuad:
            _, _, g, dJ = partes(rr, ss); acc = acc + g * ww * dJ; ar += ww * dJ
        med = acc / ar
    dNx, dNy, g, _ = partes(r, s); g = g - med
    B = np.zeros((3, 12))
    for i in range(4):
        B[0, 3 * i] = dNx[i]; B[1, 3 * i + 1] = dNy[i]; B[2, 3 * i] = dNy[i]; B[2, 3 * i + 1] = dNx[i]
        B[:, 3 * i + 2] = g[:, i]
    return B


def kg(nodos, els, u, t, gdl="w", ng=2, sigma="gauss"):
    n = len(nodos); G = np.zeros((6 * n, 6 * n))
    C = E / (1 - NU ** 2) * np.array([[1, NU, 0], [NU, 1, 0], [0, 0, (1 - NU) / 2]])
    comp = {"w": [2], "uvw": [0, 1, 2]}[gdl]
    for c in els:
        p3 = np.array([nodos[k] for k in c]); R, xy = shell_q4_local_axes(p3); T = shell_q4_T(R)
        dofs = np.concatenate([np.arange(6 * k, 6 * k + 6) for k in c])
        ul = (T @ u[dofs]).reshape(4, 6)
        def B_en(r, s):
            J = dN(r, s) @ xy; dxy = np.linalg.solve(J, dN(r, s)); return dxy, np.linalg.det(J)
        def sig(r, s):
            if sigma in ("allman", "allman_np"):
                d12 = ul[:, [0, 1, 5]].reshape(-1)
                return C @ b_itw(xy[:, 0], xy[:, 1], r, s, sigma == "allman") @ d12
            dxy, _ = B_en(r, s)
            ex = dxy[0] @ ul[:, 0]; ey = dxy[1] @ ul[:, 1]; gxy = dxy[1] @ ul[:, 0] + dxy[0] @ ul[:, 1]
            return C @ np.array([ex, ey, gxy])
        s0 = sig(0, 0)
        xg, wg = GP[ng]; g4 = np.zeros((4, 4))
        for a, wa in zip(xg, wg):
            for b, wb in zip(xg, wg):
                dxy, dj = B_en(a, b)
                sx, sy, sxy = s0 if sigma == "centro" else sig(a, b)
                S = np.array([[sx, sxy], [sxy, sy]])
                g4 += wa * wb * dj * t * dxy.T @ S @ dxy
        gl = np.zeros((24, 24))
        for i in range(4):
            for j in range(4):
                for k in comp: gl[6 * i + k, 6 * j + k] = g4[i, j]
        G[np.ix_(dofs, dofs)] += T.T @ gl @ T
    return G


def pandeo(M, gdl="w", ng=2, sigma="gauss", nmodos=8):
    nodos, els, K, F, libre = armar(M)
    u = np.zeros(len(F)); Kf = K[np.ix_(libre, libre)]; u[libre] = np.linalg.solve(Kf, F[libre])
    G = kg(nodos, els, u, M["t"], gdl, ng, sigma)[np.ix_(libre, libre)]
    mu, V = eigh(-G, Kf)
    o = np.argsort(-np.abs(mu))[:nmodos]
    modos = []
    for k in o:
        m = np.zeros(len(F)); m[libre] = V[:, k]; modos.append(m)
    return np.array([1 / mu[k] for k in o]), modos, u


if __name__ == "__main__":
    a = sys.argv[1:] + [None] * 3
    gdl, ng, sg = a[0] or "w", int(a[1] or 2), a[2] or "gauss"
    sap = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "sap_pandeo_cascara.json")))
    for M in MODELOS:
        if M["nombre"] not in sap: continue
        lam, _, _ = pandeo(M, gdl, ng, sg)
        fs = sap[M["nombre"]]["factores"]
        print(M["nombre"], "analítico %.4f" % (M["analitico"] or 0))
        for k in range(min(len(fs), len(lam))):
            print("   %2d  SAP %14.6f  proto %14.6f  dif %+.5f %%" % (k + 1, fs[k], lam[k], 100 * (lam[k] / fs[k] - 1)))
