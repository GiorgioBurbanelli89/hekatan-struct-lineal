# -*- coding: utf-8 -*-
"""El elemento de placa de Ibrahimbegovic (1993), tal como está en el paper.

    Ibrahimbegovic, A. (1993). "Quadrilateral finite elements for analysis of
    thick and thin plates". Computer Methods in Applied Mechanics and
    Engineering 110, 195-209.

Es la referencia [1] del capítulo 8 del libro de Edward Wilson («Análisis
estático y dinámico de estructuras»), o sea el linaje del elemento de placa de
SAP2000/ETABS. El manual de CSI dice de su cáscara: «Out-of-plane displacements
are cubic», y este paper presenta justo dos elementos: PQ2 (interpolación
cuadrática del desplazamiento) y PQ3 (cúbica).

Aquí está el PQ2, ecuaciones (3.10) a (3.24):

  (3.10)  N_I = ¼(1+r_I r)(1+s_I s)                       bilineales
  (3.11)  θ  = Σ N_I θ_I                                  giros bilineales
  (3.17)  w  = Σ N_I w_I + Σ N̂_I θ_I                      desplazamiento jerárquico
  (3.18)  N̂_I = N_M (l_IJ/8) n_IJ^t − N_L (l_IK/8) n_IK^t
  (3.19)  J = mod(I,4)+1,  K = I−1+4·int(1/I),  L = K+4,  M = I+4
  (3.15)  N_L = ½(1−r²)(1+s_L s)      L = 5,7
  (3.16)  N_L = ½(1−s²)(1+r_L r)      L = 6,8
  (3.21)  B_I de la curvatura
  (3.22)  γ = Σ N_I γ_I               cortante supuesto BILINEAL (T1 de Hughes-Tezduyar)
  (3.23)  γ_I en función de w y θ de los nudos del rincón
  (3.8)   C_B = Et³/12(1−ν²)·[...]    C_S = Etc/2(1+ν),  c = 5/6

GDL por nudo: [w, θ1, θ2] — los giros del paper (θ1 sobre x1, θ2 sobre x2),
con la curvatura de (3.6): κ = (−∂θ2/∂x1 ; ∂θ1/∂x2 ; ∂θ1/∂x1 − ∂θ2/∂x2).
"""
import numpy as np

R = [-1.0, 1.0, 1.0, -1.0]
S = [-1.0, -1.0, 1.0, 1.0]
G2 = 1.0 / np.sqrt(3.0)


def _N(r, s):
    return np.array([0.25 * (1 + R[i] * r) * (1 + S[i] * s) for i in range(4)])


def _dN(r, s):
    dr = np.array([0.25 * R[i] * (1 + S[i] * s) for i in range(4)])
    ds = np.array([0.25 * S[i] * (1 + R[i] * r) for i in range(4)])
    return dr, ds


def _NL(r, s):
    """Serendipity de los lados, (3.15) y (3.16). Índices 5..8 -> 0..3."""
    return np.array([0.5 * (1 - r * r) * (1 - s),     # L=5 (lado 1-2, s=-1)
                     0.5 * (1 - s * s) * (1 + r),     # L=6 (lado 2-3, r=+1)
                     0.5 * (1 - r * r) * (1 + s),     # L=7 (lado 3-4, s=+1)
                     0.5 * (1 - s * s) * (1 - r)])    # L=8 (lado 4-1, r=-1)


def _lados(x, y):
    """l_JK y n_JK de (3.13) para los cuatro lados: lado m va del nudo m al m+1."""
    l = np.zeros(4); n = np.zeros((4, 2))
    for m in range(4):
        j = (m + 1) % 4
        dx, dy = x[j] - x[m], y[j] - y[m]
        L = np.hypot(dx, dy)
        l[m] = L
        n[m] = (dy / L, -dx / L)          # normal exterior al lado
    return l, n


def k_pq2(pts, E, nu, t, kappa=5.0 / 6.0):
    """K 12x12 del PQ2, gdl [w, th1, th2] x 4."""
    x = np.array([p[0] for p in pts], float)
    y = np.array([p[1] for p in pts], float)
    D0 = E * t ** 3 / (12.0 * (1 - nu * nu))
    CB = D0 * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])
    CS = np.eye(2) * (kappa * E * t / (2 * (1 + nu)))
    l, n = _lados(x, y)

    # ── cortante supuesto (3.23), LITERAL del paper ──────────────────────────
    #  gamma_I = 1/(t_IJ^t n_IK) [ (1/l_IK) n_IJ w_K + (1/l_IJ) n_IK w_J
    #                              - (1/l_IK n_IJ + 1/l_IJ n_IK) w_I
    #                              + ½ n_IJ (n_IK^t θ_K) - ½ n_IK (n_IJ^t θ_J)
    #                              + ½ (n_IJ n_IK^t - n_IK n_IJ^t) θ_I ]
    # Es una expresion VECTORIAL explicita (n_IJ y n_IK son columnas 2x1), no un
    # sistema 2x2: leerla como sistema deja el elemento con UN modo nulo en vez
    # de tres y la flexion pura penalizada por el cortante.
    Bg = np.zeros((4, 2, 12))
    tg = np.zeros((4, 2))
    for m in range(4):
        j = (m + 1) % 4
        d = np.array([x[j] - x[m], y[j] - y[m]]); tg[m] = d / np.linalg.norm(d)
    for I in range(4):
        J = (I + 1) % 4
        K = (I - 1) % 4
        lIJ, lIK = l[I], l[K]
        nIJ, nIK = n[I], n[K]
        den = float(tg[I] @ nIK)
        if abs(den) < 1e-14: den = 1e-14
        B = np.zeros((2, 12))
        B[:, 3 * K] += nIJ / lIK
        B[:, 3 * J] += nIK / lIJ
        B[:, 3 * I] -= nIJ / lIK + nIK / lIJ
        for c in (0, 1):
            B[:, 3 * K + 1 + c] += 0.5 * nIJ * nIK[c]
            B[:, 3 * J + 1 + c] -= 0.5 * nIK * nIJ[c]
            B[:, 3 * I + 1 + c] += 0.5 * (nIJ * nIK[c] - nIK * nIJ[c])
        Bg[I] = B / den

    K = np.zeros((12, 12))
    for gr in (-G2, G2):
        for gs in (-G2, G2):
            N = _N(gr, gs); dr, ds = _dN(gr, gs)
            J = np.array([[dr @ x, dr @ y], [ds @ x, ds @ y]])
            dJ = np.linalg.det(J); Ji = np.linalg.inv(J)
            dNx = Ji[0, 0] * dr + Ji[0, 1] * ds
            dNy = Ji[1, 0] * dr + Ji[1, 1] * ds
            # curvatura (3.21)
            B = np.zeros((3, 12))
            for i in range(4):
                B[0, 3 * i + 2] = -dNx[i]
                B[1, 3 * i + 1] = dNy[i]
                B[2, 3 * i + 1] = dNx[i]
                B[2, 3 * i + 2] = -dNy[i]
            # cortante (3.22): bilineal con los gamma_I nodales
            Bs = np.zeros((2, 12))
            for i in range(4):
                Bs += N[i] * Bg[i]
            K += (B.T @ CB @ B + Bs.T @ CS @ Bs) * abs(dJ)
    return K
