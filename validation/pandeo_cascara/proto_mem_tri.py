"""Membrana del TRIÁNGULO de SAP2000 (caja negra, sap_tri_flex.json): K 9×9 [u v θz]×3 reconstruida por flexibilidad,
contra candidatas publicadas (ITW 1991: el triángulo = Q4 de Allman DEGENERADO; elástica a 1 punto, penalización entera).
    python proto_mem_tri.py"""
import json, os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from modelos import E, NU
D = E / (1 - NU ** 2) * np.array([[1, NU, 0], [NU, 1, 0], [0, 0, (1 - NU) / 2]]); MU = E / (2 * (1 + NU))


def k_sap(G):
    P = np.array(G["P"], float); F = np.array(G["F"]).T      # F[i, k] = desplazamiento i por la carga k
    f = [3 * q + (2 if g == 5 else g) for q, g in G["libres"]]; s = [k for k in range(9) if k not in f]
    R = np.zeros((9, 3))
    for q in range(3):
        R[3 * q, 0] = 1; R[3 * q + 1, 1] = 1; R[3 * q, 2] = -P[q, 1]; R[3 * q + 1, 2] = P[q, 0]; R[3 * q + 2, 2] = 1
    Q = np.zeros((6, 9)); Q[:, f] = np.eye(6); Q[:, s] = -R[f] @ np.linalg.inv(R[s])
    return Q.T @ np.linalg.inv(F) @ Q, R


RN, SN = np.array([-1, 1, 1, -1.]), np.array([-1, -1, 1, 1.])
ANT, SIG = [3, 0, 1, 2], [1, 2, 3, 0]


def campo(X, Y, r, s):
    """Q4 de Allman (ITW): B 3×12 y fila de ω (giro del campo) y N; nudos X, Y (4, el último puede repetir)."""
    dr = 0.25 * RN * (1 + SN * s); ds = 0.25 * SN * (1 + RN * r); N = 0.25 * (1 + RN * r) * (1 + SN * s)
    J = np.array([[dr @ X, dr @ Y], [ds @ X, ds @ Y]]); dJ = np.linalg.det(J); Ji = np.linalg.inv(J)
    dNx = Ji[0, 0] * dr + Ji[0, 1] * ds; dNy = Ji[1, 0] * dr + Ji[1, 1] * ds
    nsr = 0.5 * np.array([-2 * r * (1 - s), 1 - s * s, -2 * r * (1 + s), -(1 - s * s)])
    nss = 0.5 * np.array([-(1 - r * r), -2 * s * (1 + r), 1 - r * r, -2 * s * (1 - r)])
    NSx = Ji[0, 0] * nsr + Ji[0, 1] * nss; NSy = Ji[1, 0] * nsr + Ji[1, 1] * nss
    cx = np.array([(Y[SIG[i]] - Y[i]) / 8 for i in range(4)]); cy = np.array([-(X[SIG[i]] - X[i]) / 8 for i in range(4)])
    A = ANT
    g = np.array([NSx[A] * cx[A] - NSx * cx, NSy[A] * cy[A] - NSy * cy, (NSy[A] * cx[A] - NSy * cx) + (NSx[A] * cy[A] - NSx * cy)])
    B = np.zeros((3, 12)); W = np.zeros(12)
    for i in range(4):
        B[0, 3 * i] = dNx[i]; B[1, 3 * i + 1] = dNy[i]; B[2, 3 * i] = dNy[i]; B[2, 3 * i + 1] = dNx[i]; B[:, 3 * i + 2] = g[:, i]
        # ω = ½(v,x − u,y): u-parte de Allman = Σ NS·c·Δθ  → ½(g_vx − g_uy)
    gvx = NSx[A] * cy[A] - NSx * cy; guy = NSy[A] * cx[A] - NSy * cx
    for i in range(4):
        W[3 * i] = -0.5 * dNy[i]; W[3 * i + 1] = 0.5 * dNx[i]; W[3 * i + 2] = 0.5 * (gvx[i] - guy[i]) - N[i]
    return B, W, abs(dJ), N


def colapsar(K12, rep=3, en=2):
    """12×12 del Q4 con el nudo `rep` = nudo `en` → 9×9."""
    T = np.zeros((12, 9)); m = [0, 1, 2, 3]; m[rep] = en
    for i in range(4):
        for k in range(3): T[3 * i + k, 3 * m[i] + k] = 1
    return T.T @ K12 @ T


def gauss(n):
    x, w = np.polynomial.legendre.leggauss(n); return [(a, b, wa * wb) for a, wa in zip(x, w) for b, wb in zip(x, w)]


def degenerado(P, t, ne=1, npen=2, rep=3, orden=(0, 1, 2), proy=False):
    """Kel (ne puntos) y Kpen (npen×npen) del Q4 degenerado; Kpen sin γ."""
    Q = [P[orden[0]], P[orden[1]], P[orden[2]], P[orden[2]]] if rep == 3 else None
    X = np.array([p[0] for p in Q]); Y = np.array([p[1] for p in Q])
    Ke = np.zeros((12, 12)); Kp = np.zeros((12, 12))
    med = 0
    if proy:
        acc = 0; ar = 0
        for r, s, w in gauss(3):
            B, _, dJ, _ = campo(X, Y, r, s); acc = acc + B[:, [2, 5, 8, 11]] * w * dJ; ar += w * dJ
        med = acc / ar
    for r, s, w in gauss(ne):
        B, _, dJ, _ = campo(X, Y, r, s); B = B.copy(); B[:, [2, 5, 8, 11]] -= med; Ke += w * dJ * t * B.T @ D @ B
    for r, s, w in gauss(npen):
        _, W, dJ, _ = campo(X, Y, r, s); Kp += w * dJ * t * np.outer(W, W)
    inv = np.argsort(orden); Tp = np.zeros((9, 9))
    for i in range(3):
        for k in range(3): Tp[3 * orden[i] + k, 3 * i + k] = 1
    return Tp @ colapsar(Ke) @ Tp.T, Tp @ colapsar(Kp) @ Tp.T


LADOS = [(0, 1), (1, 2), (2, 0)]
PT_TRI = {1: [((1 / 3, 1 / 3, 1 / 3), 1.0)],
          3: [((2 / 3, 1 / 6, 1 / 6), 1 / 3), ((1 / 6, 2 / 3, 1 / 6), 1 / 3), ((1 / 6, 1 / 6, 2 / 3), 1 / 3)],
          "m": [((.5, .5, 0), 1 / 3), ((0, .5, .5), 1 / 3), ((.5, 0, .5), 1 / 3)]}


def allman_tri(P, Lc, signo=1.0):
    """Triángulo de Allman jerárquico: u = Σ L_i u_i + Σ_lados 4 L_i L_j (l/8)(θ_j − θ_i) n_ext. Devuelve B 3×9, W (ω − θ) 1×9."""
    x, y = P[:, 0], P[:, 1]; A2 = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0])
    b = np.array([y[1] - y[2], y[2] - y[0], y[0] - y[1]]) / A2; c = np.array([x[2] - x[1], x[0] - x[2], x[1] - x[0]]) / A2
    L = np.array(Lc); B = np.zeros((3, 9)); W = np.zeros(9)
    for i in range(3):
        B[0, 3 * i] = b[i]; B[1, 3 * i + 1] = c[i]; B[2, 3 * i] = c[i]; B[2, 3 * i + 1] = b[i]
        W[3 * i] = -0.5 * c[i]; W[3 * i + 1] = 0.5 * b[i]; W[3 * i + 2] = -L[i]
    for i, j in LADOS:
        cx, cy = signo * (y[j] - y[i]) / 8, -signo * (x[j] - x[i]) / 8
        dx = 4 * (b[i] * L[j] + b[j] * L[i]); dy = 4 * (c[i] * L[j] + c[j] * L[i])   # ∂(4 L_i L_j)
        for k, s in ((j, 1.0), (i, -1.0)):
            B[0, 3 * k + 2] += s * dx * cx; B[1, 3 * k + 2] += s * dy * cy; B[2, 3 * k + 2] += s * (dy * cx + dx * cy)
            W[3 * k + 2] += s * 0.5 * (dx * cy - dy * cx)
    return B, W, abs(A2) / 2


def k_allman_tri(P, t, ne, npen, signo=1.0, proy=False):
    Ke = np.zeros((9, 9)); Kp = np.zeros((9, 9)); med = 0
    if proy:
        med = sum(w * allman_tri(P, Lc, signo)[0][:, [2, 5, 8]] for Lc, w in PT_TRI[3])
    for Lc, w in PT_TRI[ne]:
        B, _, A = allman_tri(P, Lc, signo); B = B.copy(); B[:, [2, 5, 8]] -= med; Ke += w * A * t * B.T @ D @ B
    for Lc, w in PT_TRI[npen]:
        _, W, A = allman_tri(P, Lc, signo); Kp += w * A * t * np.outer(W, W)
    return Ke, Kp


def ajustar(Ks, Ke, Kp):
    a = Kp.ravel(); b = (Ks - Ke).ravel(); g = a @ b / (a @ a)
    return g, np.linalg.norm(Ks - Ke - g * Kp) / np.linalg.norm(Ks)


if __name__ == "__main__":
    S = json.load(open(os.path.join(AQUI, "sap_tri_flex.json")))
    for nom, G in S.items():
        Ks, R = k_sap(G); P = np.array(G["P"], float); t = G["t"]
        print("==", nom, " |K·R| / |K| =", "%.1e" % (np.linalg.norm(Ks @ R) / np.linalg.norm(Ks)), " autovalores SAP:",
              np.round(np.linalg.eigvalsh(Ks)[3:] / 1e6, 4))
        for ne in (1, 3, "m"):
            for npen in (1, 3, "m"):
                for sg in (1.0, -1.0):
                    for proy in (False, True):
                        Ke, Kp = k_allman_tri(P, t, ne, npen, sg, proy); g, err = ajustar(Ks, Ke, Kp)
                        if err < 0.02: print("  ALLMAN ne %s npen %s signo %+d proy %d: γ/μ = %.6f  resto %.2e" % (ne, npen, sg, proy, g / MU, err))
        for ne in ():
            for npen in (1, 2, 3):
                for o in [(0, 1, 2), (1, 2, 0), (2, 0, 1)]:
                    for proy in (False, True):
                        Ke, Kp = degenerado(P, t, ne, npen, 3, o, proy)
                        g, err = ajustar(Ks, Ke, Kp)
                        if err < 0.02: print("  ne %d npen %d orden %s proy %d: γ/μ = %.6f  resto %.2e" % (ne, npen, o, proy, g / MU, err))
