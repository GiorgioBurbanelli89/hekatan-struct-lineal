# -*- coding: utf-8 -*-
r"""Cuadrilátero Shell-Thick de SAP2000 / ETABS: K de placa 12x12.

GDL de salida por nudo: [w, rx, ry], mano derecha (rx = dw/dy, ry = -dw/dx), nudos antihorarios.

  22 GDL antes de condensar: 12 nodales + 4 lados x (tx_k, ty_k) + burbuja (tx_9, ty_9)
  giros  : theta = sum_{a=1..9} N_a (tx_a, ty_a); N1..4 bilineales,
           N5..8 = (1-r^2)(1-s)/2 ... (jerárquicas de lado, Wilson 2005 ec. 8.1-8.2), N9 = (1-r^2)(1-s^2)
  w      : bilineal (solo entra por los cortantes de lado)
  flexión: kx = ty,x   ky = -tx,y   kxy = ty,y - tx,x                      (Wilson ec. 8.10)
  cortante de lado k (Wilson ec. 8.7 con el giro de lado de 2 componentes):
     g_k = (w_j-w_i)/L - (s_k/2)(tx_i+tx_j) + (c_k/2)(ty_i+ty_j) - (2/3) s_k tx_k + (2/3) c_k ty_k
  campo  : covariante (tipo MITC4) con la parte lineal simetrizada
     g_xi = A + m eta, g_eta = C + m xi, m = (b+d)/2;  (gx, gy) = J^-1 (g_xi, g_eta)
  D      : Db = t^3/12 E/(1-nu^2)[...],  Ds = (5/6) G t I                  (Wilson ec. 8.15)
  penal. : 1000 (D11+D22+D33) INT (tx,x + ty,y)^2 dA
  cuadr. : 8 puntos (Ibrahimbegovic y Wilson, CANM 7 (1991) 1-9, ec. 30): a = sqrt(7/9) peso 9/49,
           b = sqrt(7/15) peso 40/49
  B-barra: a las 10 columnas internas se les resta la media w|J| de sus filas de curvatura
           (patch test de Wilson ec. 8.17)
  condensación: Gauss sobre los 10 internos; un pivote nulo se salta.

Ni la penalización 1000·tr(Db), ni la simetrización m = (b+d)/2, ni el peso 9/49 están publicados por CSI:
son los que reproducen la K 12x12 medida de SAP2000 24 y ETABS 22 (140 de 142 celdas a <= 6e-11 %).
"""
from __future__ import annotations

import numpy as np

A8 = np.sqrt(7.0 / 9.0)
B8 = np.sqrt(7.0 / 15.0)
PUNTOS8 = ((-A8, -A8), (A8, -A8), (A8, A8), (-A8, A8), (0.0, -B8), (B8, 0.0), (0.0, B8), (-B8, 0.0))
PESOS8 = (9 / 49,) * 4 + (40 / 49,) * 4
PENAL = 1000.0
KAPPA = 5.0 / 6.0
DOS_TERCIOS = 2.0 / 3.0


def _n4_derivadas(r, s):
    return (np.array([-(1 - s), (1 - s), (1 + s), -(1 + s)]) / 4.0,
            np.array([-(1 - r), -(1 + r), (1 + r), (1 - r)]) / 4.0)


def _lado_derivadas(r, s):
    """dN/dr, dN/ds de N5..N8; el lado k va del nudo k al k+1."""
    return (np.array([-r * (1 - s), (1 - s * s) / 2.0, -r * (1 + s), -(1 - s * s) / 2.0]),
            np.array([-(1 - r * r) / 2.0, -s * (1 + r), (1 - r * r) / 2.0, -s * (1 - r)]))


def _cortantes_de_lado(x, y):
    """Fila k = g_k (Wilson 8.7) sobre los 22 GDL; y L_k."""
    G = np.zeros((4, 22)); L = np.zeros(4)
    for k in range(4):
        j = (k + 1) % 4
        dx, dy = x[j] - x[k], y[j] - y[k]
        L[k] = np.hypot(dx, dy); c, s = dx / L[k], dy / L[k]
        G[k, 3 * j] += 1 / L[k]; G[k, 3 * k] -= 1 / L[k]
        G[k, 3 * k + 1] -= s / 2; G[k, 3 * j + 1] -= s / 2
        G[k, 3 * k + 2] += c / 2; G[k, 3 * j + 2] += c / 2
        G[k, 12 + 2 * k] -= DOS_TERCIOS * s
        G[k, 13 + 2 * k] += DOS_TERCIOS * c
    return G, L


def B_y_div(x, y, r, s, G=None, L=None):
    """B (5x22: kx, ky, kxy, gxz, gyz), fila de divergencia v (22) y |J| en (r, s)."""
    if G is None:
        G, L = _cortantes_de_lado(x, y)
    dr4, ds4 = _n4_derivadas(r, s); drh, dsh = _lado_derivadas(r, s)
    J = np.array([[dr4 @ x, dr4 @ y], [ds4 @ x, ds4 @ y]])
    Ji = np.linalg.inv(J)
    gx = Ji[0, 0] * dr4 + Ji[0, 1] * ds4; gy = Ji[1, 0] * dr4 + Ji[1, 1] * ds4
    hx = Ji[0, 0] * drh + Ji[0, 1] * dsh; hy = Ji[1, 0] * drh + Ji[1, 1] * dsh
    g9 = Ji @ np.array([-2 * r * (1 - s * s), -2 * s * (1 - r * r)])
    B = np.zeros((5, 22)); v = np.zeros(22)

    def giro(col, a, b, fx, fy):            # theta = (a f, b f), grad f = (fx, fy)
        B[0, col] += b * fx
        B[1, col] -= a * fy
        B[2, col] += b * fy - a * fx
        v[col] += a * fx + b * fy
    for i in range(4):
        giro(3 * i + 1, 1, 0, gx[i], gy[i]); giro(3 * i + 2, 0, 1, gx[i], gy[i])
    for k in range(4):
        giro(12 + 2 * k, 1, 0, hx[k], hy[k]); giro(13 + 2 * k, 0, 1, hx[k], hy[k])
    giro(20, 1, 0, g9[0], g9[1]); giro(21, 0, 1, g9[0], g9[1])
    # cortante covariante: g_xi en los lados abajo (k=0) / arriba (k=2), g_eta en dcha (1) / izq (3)
    gb = G[0] * L[0] / 2; gt = -G[2] * L[2] / 2
    gR = G[1] * L[1] / 2; gL = -G[3] * L[3] / 2
    A0 = (gb + gt) / 2; b = (gt - gb) / 2
    C0 = (gL + gR) / 2; d = (gR - gL) / 2
    m = (b + d) / 2                          # simetrización (MITC4 usaría b y d por separado)
    B[3:5] = np.linalg.solve(J, np.vstack([A0 + m * s, C0 + m * r]))
    return B, v, abs(np.linalg.det(J))


def matrices_D(E, nu, t, mod=None):
    """Db (3x3) y Ds (2x2). mod = modificadores de CSI [f11 f22 f12 m11 m22 m12 v13 v23 ...] (usa 3..7)."""
    D0 = E * t ** 3 / (12.0 * (1.0 - nu * nu))
    Db = D0 * np.array([[1.0, nu, 0.0], [nu, 1.0, 0.0], [0.0, 0.0, (1.0 - nu) / 2.0]])
    Ds = np.eye(2) * (KAPPA * E * t / (2.0 * (1.0 + nu)))
    if mod is not None:
        sb = np.sqrt(np.maximum(0.0, np.asarray(mod[3:6], float)))
        ss = np.sqrt(np.maximum(0.0, np.asarray(mod[6:8], float)))
        Db = np.diag(sb) @ Db @ np.diag(sb)
        Ds = np.diag(ss) @ Ds @ np.diag(ss)
    return Db, Ds


def k22_grueso_cuad(xy, E, nu, t, mod=None, penal=PENAL):
    """K de 22 GDL ANTES de condensar (orden: 12 nodales [w,rx,ry]x4, 8 de lado, 2 burbuja)."""
    xy = np.asarray(xy, float); x, y = xy[:, 0], xy[:, 1]
    Db, Ds = matrices_D(E, nu, t, mod)
    D = np.zeros((5, 5)); D[:3, :3] = Db; D[3:, 3:] = Ds
    G, L = _cortantes_de_lado(x, y)
    Bs, vs, ws = [], [], []
    for (r, s), w in zip(PUNTOS8, PESOS8):
        B, v, dJ = B_y_div(x, y, r, s, G, L)
        Bs.append(B); vs.append(v); ws.append(w * dJ)
    media = sum(B[:3, 12:] * w for B, w in zip(Bs, ws)) / sum(ws)
    for B in Bs:
        B[:3, 12:] -= media
    cpen = penal * np.trace(Db)
    return sum((B.T @ D @ B + cpen * np.outer(v, v)) * w for B, v, w in zip(Bs, vs, ws))


def condensar_saltando(K, n_ret=12, tol=1e-14):
    """Gauss sobre los GDL internos; un pivote nulo se salta."""
    K = np.array(K, float); n = K.shape[0]; esc = np.abs(K).max()
    if esc == 0:
        return K[:n_ret, :n_ret]
    for i in range(n_ret, n):
        p = K[i, i]
        if abs(p) <= tol * esc:
            continue
        K -= np.outer(K[:, i], K[i, :]) / p
        K[i, :] = 0.0; K[:, i] = 0.0
    return K[:n_ret, :n_ret]


def k_shell_thick_cuad(xy, E, nu, t, mod=None, penal=PENAL):
    """K 12x12 de placa del Shell-Thick cuadrilátero de SAP2000/ETABS. GDL por nudo [w, rx, ry].

    xy : 4x2 nudos en el plano del paño (cuadrilátero convexo, antihorario).
    mod: modificadores de CSI [f11 f22 f12 m11 m22 m12 v13 v23 ...] (usa 3..7).
    """
    if E <= 0 or t <= 0:
        return np.zeros((12, 12))
    return condensar_saltando(k22_grueso_cuad(xy, E, nu, t, mod, penal), 12)
