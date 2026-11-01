# -*- coding: utf-8 -*-
r"""Membrana 12x12 con giro normal (drilling) de las áreas Shell/Membrane de SAP2000 y ETABS.

GDL por nudo: [u_i, v_i, theta_i] (theta = giro alrededor de la normal), nudos antihorarios.

    K = Schur_burbuja( sum_{Gauss 2x2} w |J| B^T D B )
      + 0.1  * G t A * (2 b0)(2 b0)^T                       (rango 1, centro del elemento)
      + 5e-5 * G t A * h h^T,   h = [+1,-1,+1,-1] en theta   (modo de reloj de arena)

Fuentes:
  * Desplazamiento de lado de Allman, u_lado = N_k (l/8)(theta_{k+1} - theta_k) n_k:
    Ibrahimbegovic, Taylor y Wilson (ITW), IJNME 30 (1990), §2-3.
  * Proyección del giro (media nula de las columnas theta): Wilson, *Three-Dimensional Static and
    Dynamic Analysis of Structures* (2005), ec. (9.8).  Gauss 2x2: Wilson ec. (9.10) y el manual
    de CSI (CSI Analysis Reference Manual, cap. «The Shell Element», «four-point» integration).
  * Burbuja (1-r^2)(1-s^2) en u y v, condensada.  Penalización de rango 1 = la ec. (38) de ITW 1990
    a un punto, con gamma = 0.4 G (=> 0.1 G t A (2 b0)(2 b0)^T).
  * Las constantes 0.1 y 5e-5 no están publicadas: son las que reproducen la 12x12 medida de ETABS 22
    (2e-15) y los desplazamientos de SAP2000 24 en las mallas del ITW 1990 (1.2e-10 %).

Leyes del bloque theta-theta (cuadrado, /(G t A)): giro uniforme 1/10, modo cruzado 1/(18-6 nu),
reloj de arena 2e-4.
"""
from __future__ import annotations

import numpy as np

R_N = np.array([-1.0, 1.0, 1.0, -1.0])
S_N = np.array([-1.0, -1.0, 1.0, 1.0])
SIG = np.array([1, 2, 3, 0])     # nudo siguiente
ANT = np.array([3, 0, 1, 2])     # nudo anterior
G2 = 1.0 / np.sqrt(3.0)
GAUSS2 = [(r * G2, s * G2, 1.0) for s in (-1, 1) for r in (-1, 1)]
C_RANGO1 = 0.1
C_RELOJ = 5.0e-5


def _punto(r, s, X, Y, cx, cy):
    """N, dN/dx, dN/dy, columnas Allman (3x4: exx, eyy, gxy), giro de Allman, dNB, |J|."""
    dr = 0.25 * R_N * (1 + S_N * s)
    ds = 0.25 * S_N * (1 + R_N * r)
    J = np.array([[dr @ X, dr @ Y], [ds @ X, ds @ Y]])
    dJ = np.linalg.det(J)
    Ji = np.linalg.inv(J)
    N = 0.25 * (1 + R_N * r) * (1 + S_N * s)
    dNx = Ji[0, 0] * dr + Ji[0, 1] * ds
    dNy = Ji[1, 0] * dr + Ji[1, 1] * ds
    # funciones de lado (serendípitas de medio lado) NS_k, lado k: nudo k -> k+1
    nsr = 0.5 * np.array([-2 * r * (1 - s), 1 - s * s, -2 * r * (1 + s), -(1 - s * s)])
    nss = 0.5 * np.array([-(1 - r * r), -2 * s * (1 + r), 1 - r * r, -2 * s * (1 - r)])
    NSx = Ji[0, 0] * nsr + Ji[0, 1] * nss
    NSy = Ji[1, 0] * nsr + Ji[1, 1] * nss
    # columna del nudo i = lado anterior (i es el 2.º nudo, +) - lado propio (i es el 1.º, -)
    Bt = np.vstack([NSx[ANT] * cx[ANT] - NSx * cx,
                    NSy[ANT] * cy[ANT] - NSy * cy,
                    (NSy[ANT] * cx[ANT] - NSy * cx) + (NSx[ANT] * cy[ANT] - NSx * cy)])
    rot_t = 0.5 * ((NSx[ANT] * cy[ANT] - NSx * cy) - (NSy[ANT] * cx[ANT] - NSy * cx))
    nbr, nbs = -2 * r * (1 - s * s), -2 * s * (1 - r * r)
    dNBx = Ji[0, 0] * nbr + Ji[0, 1] * nbs
    dNBy = Ji[1, 0] * nbr + Ji[1, 1] * nbs
    return N, dNx, dNy, Bt, rot_t, dNBx, dNBy, abs(dJ)


def k_membrana_csi(xy, E, nu, t, partes=False):
    """K 12x12 de membrana con drilling [u0, v0, th0, u1, ...]. partes=True devuelve también las piezas."""
    xy = np.asarray(xy, float)
    X, Y = xy[:, 0], xy[:, 1]
    cx = (Y[SIG] - Y) / 8.0
    cy = -(X[SIG] - X) / 8.0
    D = E * t / (1 - nu * nu) * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])
    G = E / (2 * (1 + nu))
    pts = [(r, s, w) + _punto(r, s, X, Y, cx, cy) for r, s, w in GAUSS2]
    A = sum(p[10] * p[2] for p in pts)
    media = sum(p[6] * p[2] * p[10] for p in pts) / A            # proyección: media w|J| de las columnas theta
    K = np.zeros((14, 14))
    for r, s, w, N, dNx, dNy, Bt, rot_t, dNBx, dNBy, dJ in pts:
        B = np.zeros((3, 14))
        B[0, 0:12:3] = dNx
        B[1, 1:12:3] = dNy
        B[2, 0:12:3] = dNy
        B[2, 1:12:3] = dNx
        B[:, 2:12:3] = Bt - media
        B[0, 12], B[2, 12] = dNBx, dNBy
        B[1, 13], B[2, 13] = dNBy, dNBx
        K += w * dJ * B.T @ D @ B
    Kb = K.copy()
    # rango 1 en el centro (sin proyectar; la burbuja tiene gradiente 0 allí)
    N0, dNx0, dNy0, _, rot0, _, _, dJ0 = _punto(0.0, 0.0, X, Y, cx, cy)
    b0 = np.zeros(14)
    b0[0:12:3] = -0.5 * dNy0
    b0[1:12:3] = 0.5 * dNx0
    b0[2:12:3] = rot0 - N0            # N0 = 1/4
    A0 = 4.0 * dJ0                     # área exacta del cuadrilátero
    P = C_RANGO1 * G * t * A0 * np.outer(2 * b0, 2 * b0)
    h = np.zeros(14)
    h[2:12:3] = [1.0, -1.0, 1.0, -1.0]
    H = C_RELOJ * G * t * A0 * np.outer(h, h)

    def schur(M):
        return M[:12, :12] - M[:12, 12:] @ np.linalg.solve(M[12:, 12:], M[12:, :12])
    Kt = schur(K + P + H)
    if partes:
        return Kt, dict(Kbase=schur(Kb), P=P[:12, :12], H=H[:12, :12], b0=b0[:12], A=A0, G=G)
    return Kt


def resolver_membrana(nodos, elems, apoyos, cargas, E, nu, t):
    """Membrana plana ensamblada. apoyos {nudo: [gdl]}, cargas {(nudo, gdl): valor}; gdl 0=u 1=v 2=theta."""
    n = len(nodos)
    K = np.zeros((3 * n, 3 * n))
    for e in elems:
        ke = k_membrana_csi([nodos[i] for i in e], E, nu, t)
        ix = [3 * i + k for i in e for k in range(3)]
        K[np.ix_(ix, ix)] += ke
    f = np.zeros(3 * n)
    for (i, g), v in cargas.items():
        f[3 * i + g] += v
    fijos = {3 * i + g for i, gs in apoyos.items() for g in gs}
    lib = [k for k in range(3 * n) if k not in fijos]
    u = np.zeros(3 * n)
    u[lib] = np.linalg.solve(K[np.ix_(lib, lib)], f[lib])
    return u.reshape(n, 3)
