# -*- coding: utf-8 -*-
"""Placas de Batoz y el triángulo grueso de CSI, en Python puro (numpy). Unidades kN y m.

Es el MISMO álgebra de las hojas de Hekatan LISP (`hekatan-school/PLACAS_BATOZ/*.lisp`, ejemplos 152-154) y del C++
de `hekatan-fem` (getLocalStiffnessMatrix.cpp, plateDKQ.h):

* `k_dkt`   — DKT, Batoz, Bathe y Ho (1980): triángulo de placa delgada, 9 GDL, 3 puntos de Gauss en los puntos
              medios de los lados.  = la placa «Shell-Thin» triangular de CSI.
* `k_dkq`   — DKQ, Batoz y Ben Tahar (1982): cuadrilátero de placa delgada, 12 GDL, Gauss 2×2.
* `k_grueso`— el triángulo Shell-Thick de SAP2000 24 / ETABS 22. NO está publicado: se obtuvo midiendo el binario
              de ETABS. Giros nodales + 3 de lado (4·La·Lb), cortante de Wilson por lado, cortante constante,
              flexión con los 3 puntos medios y B-barra, penalización 1000·tr(Db)·(div θ)², condensación 15 → 9.

GDL por nudo: [w, θx, θy] con θx = ∂w/∂y y θy = −∂w/∂x (la del resto del motor). Nudos en sentido antihorario.

Momentos: se devuelven con el SIGNO DE CSI (M11 = −Mxx de la hoja), nudo por nudo, en kN·m/m. El cortante
transversal del triángulo grueso (V13, V23) es constante y sale con el signo de CSI.

Uso rápido::

    from hekatan_struct.placas import k_dkt, momentos, campo_patch
    P = [(0, 0), (2, 0.5), (0.5, 1.5)]
    K = k_dkt(P, E=24850000, nu=0.2, t=0.1)
    M = momentos("dkt", P, 24850000, 0.2, 0.1, campo_patch(P))["M"]    # 3 nudos × (M11, M22, M12)

Fuente de las ecuaciones del DKQ: `registros/papers_shell_csi/batoz1982_DKQ_IJNME18.pdf` (Batoz y Ben Tahar 1982).

Línea de órdenes y PNG para Claude web (máquina virtual) — la librería es «Hekatan Struct Py»::

    python -m hekatan_struct_py placa --tipo dkt --nodos 0 0 2 0.5 0.5 1.5 --png dkt.png
"""
from __future__ import annotations

import argparse
import json
import sys

import numpy as np

TIPOS = ("dkt", "dkq", "thick")


# ─────────────────────────────────────────────────────────────── comunes
def _Db(E: float, nu: float, t: float) -> np.ndarray:
    """Matriz de comportamiento a flexión: Dpl·[1 ν 0; ν 1 0; 0 0 (1−ν)/2] con Dpl = E·t³/(12(1−ν²))."""
    Dpl = E * t ** 3 / (12.0 * (1.0 - nu ** 2))
    return Dpl * np.array([[1.0, nu, 0.0], [nu, 1.0, 0.0], [0.0, 0.0, (1.0 - nu) / 2.0]])


def _pts(P, n: int) -> np.ndarray:
    P = np.asarray(P, float).reshape(-1, 2) if np.asarray(P).ndim == 2 else np.asarray(P, float).reshape(-1, 2)
    if P.shape[0] != n:
        raise ValueError("hacen falta %d nudos y llegaron %d" % (n, P.shape[0]))
    return P


def campo_patch(P) -> np.ndarray:
    """El campo de las hojas (comparación con SAP2000/ETABS): w = x³/6 + x·y²/2, θx = x·y, θy = −(x²+y²)/2."""
    P = np.asarray(P, float).reshape(-1, 2)
    u = []
    for x, y in P:
        u += [x ** 3 / 6.0 + x * y ** 2 / 2.0, x * y, -(x ** 2 + y ** 2) / 2.0]
    return np.array(u)


# ─────────────────────────────────────────────────────────────── DKT (Batoz, Bathe y Ho 1980)
def _dkt_lados(P):
    """Coeficientes a, b, c, d, e de los lados 4 (nudos 2-3), 5 (3-1) y 6 (1-2): la sección 1 de la hoja."""
    a = np.zeros(3); b = np.zeros(3); c = np.zeros(3); d = np.zeros(3); e = np.zeros(3)
    for k, (i, j) in enumerate(((1, 2), (2, 0), (0, 1))):
        x = P[i, 0] - P[j, 0]; y = P[i, 1] - P[j, 1]; l = x * x + y * y
        a[k] = -x / l; b[k] = 0.75 * x * y / l; c[k] = (0.25 * x * x - 0.5 * y * y) / l
        d[k] = -y / l; e[k] = (0.25 * y * y - 0.5 * x * x) / l
    return a, b, c, d, e


def _dkt_Hxy(co, n):
    a, b, c, d, e = co
    a4, a5, a6 = a; b4, b5, b6 = b; c4, c5, c6 = c; d4, d5, d6 = d; e4, e5, e6 = e
    n1, n2, n3, n4, n5, n6 = n
    Hx = np.array([1.5 * (a6 * n6 - a5 * n5), b5 * n5 + b6 * n6, n1 - c5 * n5 - c6 * n6,
                   1.5 * (a4 * n4 - a6 * n6), b6 * n6 + b4 * n4, n2 - c6 * n6 - c4 * n4,
                   1.5 * (a5 * n5 - a4 * n4), b4 * n4 + b5 * n5, n3 - c4 * n4 - c5 * n5])
    Hy = np.array([1.5 * (d6 * n6 - d5 * n5), -n1 + e5 * n5 + e6 * n6, -b5 * n5 - b6 * n6,
                   1.5 * (d4 * n4 - d6 * n6), -n2 + e6 * n6 + e4 * n4, -b6 * n6 - b4 * n4,
                   1.5 * (d5 * n5 - d4 * n4), -n3 + e4 * n4 + e5 * n5, -b4 * n4 - b5 * n5])
    return Hx, Hy


def _dkt_B(P, xi: float, eta: float) -> np.ndarray:
    """B (3×9) de curvaturas κxx, κyy, κxy en el punto (ξ, η) del triángulo (coordenadas de área)."""
    co = _dkt_lados(P)
    Jt = np.array([[P[1, 0] - P[0, 0], P[1, 1] - P[0, 1]], [P[2, 0] - P[0, 0], P[2, 1] - P[0, 1]]])
    Ji = np.linalg.inv(Jt)
    dxi = (4 * (xi + eta) - 3, 4 * xi - 1, 0.0, 4 * eta, -4 * eta, 4 * (1 - 2 * xi - eta))
    det = (4 * (xi + eta) - 3, 0.0, 4 * eta - 1, 4 * xi, 4 * (1 - xi - 2 * eta), -4 * xi)
    Hxs, Hys = _dkt_Hxy(co, dxi); Hxh, Hyh = _dkt_Hxy(co, det)
    Hx_x = Ji[0, 0] * Hxs + Ji[0, 1] * Hxh; Hx_y = Ji[1, 0] * Hxs + Ji[1, 1] * Hxh
    Hy_x = Ji[0, 0] * Hys + Ji[0, 1] * Hyh; Hy_y = Ji[1, 0] * Hys + Ji[1, 1] * Hyh
    return np.array([Hx_x, Hy_y, Hx_y + Hy_x])


def _area_tri(P) -> float:
    A2 = (P[1, 0] - P[0, 0]) * (P[2, 1] - P[0, 1]) - (P[2, 0] - P[0, 0]) * (P[1, 1] - P[0, 1])
    if A2 <= 0:
        raise ValueError("los nudos del triángulo deben ir en sentido antihorario")
    return A2 / 2.0


def k_dkt(P, E: float, nu: float, t: float) -> np.ndarray:
    """K 9×9 del DKT: At/3·Σ BᵀDb·B en los puntos medios (½,0), (½,½), (0,½)."""
    P = _pts(P, 3); At = _area_tri(P); Db = _Db(E, nu, t)
    K = np.zeros((9, 9))
    for xi, eta in ((0.5, 0.0), (0.5, 0.5), (0.0, 0.5)):
        B = _dkt_B(P, xi, eta); K += B.T @ Db @ B
    return At / 3.0 * K


def _m_dkt(P, E, nu, t, u):
    P = _pts(P, 3); Db = _Db(E, nu, t); u = np.asarray(u, float)
    out = np.zeros((3, 3))
    for k, (xi, eta) in enumerate(((0.0, 0.0), (1.0, 0.0), (0.0, 1.0))):
        out[k] = -(Db @ (_dkt_B(P, xi, eta) @ u))      # signo CSI
    return out, None


def _campo_dkt(P, E, nu, t, u, n):
    P = _pts(P, 3); Db = _Db(E, nu, t); u = np.asarray(u, float)
    X, Y, M = [], [], []
    for i in range(n + 1):
        for j in range(n + 1 - i):
            xi, eta = i / n, j / n
            X.append(P[0, 0] + xi * (P[1, 0] - P[0, 0]) + eta * (P[2, 0] - P[0, 0]))
            Y.append(P[0, 1] + xi * (P[1, 1] - P[0, 1]) + eta * (P[2, 1] - P[0, 1]))
            M.append(-(Db @ (_dkt_B(P, xi, eta) @ u)))
    return np.array(X), np.array(Y), np.array(M)


# ─────────────────────────────────────────────────────────────── DKQ (Batoz y Ben Tahar 1982)
def _dkq_lados(P):
    """Coeficientes de los lados 5 (1-2), 6 (2-3), 7 (3-4), 8 (4-1)."""
    A = np.zeros(4); B = np.zeros(4); C = np.zeros(4); D = np.zeros(4); E = np.zeros(4)
    for k in range(4):
        i, j = k, (k + 1) % 4
        x = P[i, 0] - P[j, 0]; y = P[i, 1] - P[j, 1]; m = x * x + y * y
        A[k] = -x / m; B[k] = 0.75 * x * y / m; C[k] = (0.25 * x * x - 0.5 * y * y) / m
        D[k] = -y / m; E[k] = (0.25 * y * y - 0.5 * x * x) / m
    return A, B, C, D, E


def _dkq_dN(xi, eta):
    """Derivadas (respecto a ξ y a η) de las ocho N: filas ξ, η; columnas N1..N8."""
    N5x = -xi * (1 - eta); N5y = -0.5 * (1 - xi ** 2)
    N6x = 0.5 * (1 - eta ** 2); N6y = -(1 + xi) * eta
    N7x = -xi * (1 + eta); N7y = 0.5 * (1 - xi ** 2)
    N8x = -0.5 * (1 - eta ** 2); N8y = -(1 - xi) * eta
    N1x = -0.25 * (1 - eta) - 0.5 * (N8x + N5x); N1y = -0.25 * (1 - xi) - 0.5 * (N8y + N5y)
    N2x = 0.25 * (1 - eta) - 0.5 * (N5x + N6x); N2y = -0.25 * (1 + xi) - 0.5 * (N5y + N6y)
    N3x = 0.25 * (1 + eta) - 0.5 * (N6x + N7x); N3y = 0.25 * (1 + xi) - 0.5 * (N6y + N7y)
    N4x = -0.25 * (1 + eta) - 0.5 * (N7x + N8x); N4y = 0.25 * (1 - xi) - 0.5 * (N7y + N8y)
    return (N1x, N2x, N3x, N4x, N5x, N6x, N7x, N8x), (N1y, N2y, N3y, N4y, N5y, N6y, N7y, N8y)


def _dkq_Hq(co, n):
    A, B, C, D, E = co
    A5, A6, A7, A8 = A; B5, B6, B7, B8 = B; C5, C6, C7, C8 = C; D5, D6, D7, D8 = D; E5, E6, E7, E8 = E
    n1, n2, n3, n4, n5, n6, n7, n8 = n
    Hx = np.array([1.5 * (A5 * n5 - A8 * n8), B5 * n5 + B8 * n8, n1 - C5 * n5 - C8 * n8,
                   1.5 * (A6 * n6 - A5 * n5), B6 * n6 + B5 * n5, n2 - C6 * n6 - C5 * n5,
                   1.5 * (A7 * n7 - A6 * n6), B7 * n7 + B6 * n6, n3 - C7 * n7 - C6 * n6,
                   1.5 * (A8 * n8 - A7 * n7), B8 * n8 + B7 * n7, n4 - C8 * n8 - C7 * n7])
    Hy = np.array([1.5 * (D5 * n5 - D8 * n8), -n1 + E5 * n5 + E8 * n8, -B5 * n5 - B8 * n8,
                   1.5 * (D6 * n6 - D5 * n5), -n2 + E6 * n6 + E5 * n5, -B6 * n6 - B5 * n5,
                   1.5 * (D7 * n7 - D6 * n6), -n3 + E7 * n7 + E6 * n6, -B7 * n7 - B6 * n6,
                   1.5 * (D8 * n8 - D7 * n7), -n4 + E8 * n8 + E7 * n7, -B8 * n8 - B7 * n7])
    return Hx, Hy


def _dkq_B(P, co, xi: float, eta: float):
    """B (3×12) y el determinante del jacobiano en (ξ, η) del cuadrilátero."""
    X, Y = P[:, 0], P[:, 1]
    jp = 0.25 * (-(1 - eta) * X[0] + (1 - eta) * X[1] + (1 + eta) * X[2] - (1 + eta) * X[3])
    jq = 0.25 * (-(1 - eta) * Y[0] + (1 - eta) * Y[1] + (1 + eta) * Y[2] - (1 + eta) * Y[3])
    jr = 0.25 * (-(1 - xi) * X[0] - (1 + xi) * X[1] + (1 + xi) * X[2] + (1 - xi) * X[3])
    js = 0.25 * (-(1 - xi) * Y[0] - (1 + xi) * Y[1] + (1 + xi) * Y[2] + (1 - xi) * Y[3])
    dj = jp * js - jq * jr
    dNx, dNy = _dkq_dN(xi, eta)
    Hxs, Hys = _dkq_Hq(co, dNx); Hxh, Hyh = _dkq_Hq(co, dNy)
    Hx_x = (js * Hxs - jq * Hxh) / dj; Hx_y = (-jr * Hxs + jp * Hxh) / dj
    Hy_x = (js * Hys - jq * Hyh) / dj; Hy_y = (-jr * Hys + jp * Hyh) / dj
    return np.array([Hx_x, Hy_y, Hx_y + Hy_x]), dj


_G = 1.0 / np.sqrt(3.0)
_GAUSS2 = ((-_G, -_G), (_G, -_G), (_G, _G), (-_G, _G))


def k_dkq(P, E: float, nu: float, t: float) -> np.ndarray:
    """K 12×12 del DKQ con Gauss 2×2 (peso 1)."""
    P = _pts(P, 4); co = _dkq_lados(P); Db = _Db(E, nu, t)
    K = np.zeros((12, 12))
    for xi, eta in _GAUSS2:
        B, dj = _dkq_B(P, co, xi, eta); K += B.T @ Db @ B * dj
    return K


def _dkq_Mgauss(P, E, nu, t, u):
    co = _dkq_lados(P); Db = _Db(E, nu, t); u = np.asarray(u, float)
    return [Db @ (_dkq_B(P, co, xi, eta)[0] @ u) for xi, eta in _GAUSS2]


def _dkq_extrapola(Mg, si, ti):
    """Extrapolación bilineal desde los 4 puntos de Gauss a (si, ti): así los da SAP2000 en los nudos."""
    s3 = np.sqrt(3.0)
    return 0.25 * ((1 - s3 * si) * (1 - s3 * ti) * Mg[0] + (1 + s3 * si) * (1 - s3 * ti) * Mg[1]
                   + (1 + s3 * si) * (1 + s3 * ti) * Mg[2] + (1 - s3 * si) * (1 + s3 * ti) * Mg[3])


def _m_dkq(P, E, nu, t, u):
    P = _pts(P, 4); Mg = _dkq_Mgauss(P, E, nu, t, u)
    out = np.array([-_dkq_extrapola(Mg, s, q) for s, q in ((-1, -1), (1, -1), (1, 1), (-1, 1))])
    return out, None


def _campo_dkq(P, E, nu, t, u, n):
    P = _pts(P, 4); Mg = _dkq_Mgauss(P, E, nu, t, u)
    X, Y, M = [], [], []
    for i in range(n + 1):
        for j in range(n + 1):
            s, q = -1 + 2 * i / n, -1 + 2 * j / n
            N = 0.25 * np.array([(1 - s) * (1 - q), (1 + s) * (1 - q), (1 + s) * (1 + q), (1 - s) * (1 + q)])
            X.append(N @ P[:, 0]); Y.append(N @ P[:, 1]); M.append(-_dkq_extrapola(Mg, s, q))
    return np.array(X), np.array(Y), np.array(M)


# ─────────────────────────────────────────────────────────────── triángulo grueso de CSI
class _Grueso:
    """Todo lo geométrico del triángulo grueso (hoja `placa_thick_triangulo_csi.lisp`)."""

    def __init__(self, P, E, nu, t):
        P = _pts(P, 3); self.P = P; self.At = _area_tri(P)
        self.Db = _Db(E, nu, t); Gm = E / (2 * (1 + nu)); self.Ds = 5.0 / 6.0 * Gm * t
        self.pen = 1000.0 * float(np.trace(self.Db))
        (x1, y1), (x2, y2), (x3, y3) = P
        Jt = np.array([[x2 - x1, y2 - y1], [x3 - x1, y3 - y1]]); A2 = np.linalg.det(Jt); self.Ji = np.linalg.inv(Jt)
        self.g1x, self.g1y = (y2 - y3) / A2, (x3 - x2) / A2
        self.g2x, self.g2y = (y3 - y1) / A2, (x1 - x3) / A2
        self.g3x, self.g3y = (y1 - y2) / A2, (x2 - x1) / A2
        L1 = np.hypot(x2 - x1, y2 - y1); L2 = np.hypot(x3 - x2, y3 - y2); L3 = np.hypot(x1 - x3, y1 - y3)
        c1, s1 = (x2 - x1) / L1, (y2 - y1) / L1
        c2, s2 = (x3 - x2) / L2, (y3 - y2) / L2
        c3, s3 = (x1 - x3) / L3, (y1 - y3) / L3
        G1 = np.array([-1 / L1, -s1 / 2, c1 / 2, 1 / L1, -s1 / 2, c1 / 2, 0, 0, 0, -2 / 3 * s1, 2 / 3 * c1, 0, 0, 0, 0])
        G2 = np.array([0, 0, 0, -1 / L2, -s2 / 2, c2 / 2, 1 / L2, -s2 / 2, c2 / 2, 0, 0, -2 / 3 * s2, 2 / 3 * c2, 0, 0])
        G3 = np.array([1 / L3, -s3 / 2, c3 / 2, 0, 0, 0, -1 / L3, -s3 / 2, c3 / 2, 0, 0, 0, 0, -2 / 3 * s3, 2 / 3 * c3])
        gr = 2 / 3 * L1 * G1 - 1 / 3 * L2 * G2 - 1 / 3 * L3 * G3
        gs = 1 / 3 * L1 * G1 + 1 / 3 * L2 * G2 - 2 / 3 * L3 * G3
        self.Bsx = self.Ji[0, 0] * gr + self.Ji[0, 1] * gs
        self.Bsy = self.Ji[1, 0] * gr + self.Ji[1, 1] * gs

    def _s(self, a, b, c):
        g = self
        sx = (4 * (a * g.g2x + b * g.g1x) - 4 * (g.g2x + g.g1x) / 3,
              4 * (b * g.g3x + c * g.g2x) - 4 * (g.g3x + g.g2x) / 3,
              4 * (c * g.g1x + a * g.g3x) - 4 * (g.g1x + g.g3x) / 3)
        sy = (4 * (a * g.g2y + b * g.g1y) - 4 * (g.g2y + g.g1y) / 3,
              4 * (b * g.g3y + c * g.g2y) - 4 * (g.g3y + g.g2y) / 3,
              4 * (c * g.g1y + a * g.g3y) - 4 * (g.g1y + g.g3y) / 3)
        return sx, sy

    def filas(self, a, b, c):
        """kxx, kyy, kxy y div θ (todas de 15 columnas) en el punto de coordenadas de área (a, b, c)."""
        g = self; (sx1, sx2, sx3), (sy1, sy2, sy3) = self._s(a, b, c)
        kxx = np.array([0, 0, g.g1x, 0, 0, g.g2x, 0, 0, g.g3x, 0, sx1, 0, sx2, 0, sx3])
        kyy = np.array([0, -g.g1y, 0, 0, -g.g2y, 0, 0, -g.g3y, 0, -sy1, 0, -sy2, 0, -sy3, 0])
        kxy = np.array([0, -g.g1x, g.g1y, 0, -g.g2x, g.g2y, 0, -g.g3x, g.g3y, -sx1, sy1, -sx2, sy2, -sx3, sy3])
        dv = np.array([0, g.g1x, g.g1y, 0, g.g2x, g.g2y, 0, g.g3x, g.g3y,
                       sx1 + 4 * (g.g2x + g.g1x) / 3, sy1 + 4 * (g.g2y + g.g1y) / 3,
                       sx2 + 4 * (g.g3x + g.g2x) / 3, sy2 + 4 * (g.g3y + g.g2y) / 3,
                       sx3 + 4 * (g.g1x + g.g3x) / 3, sy3 + 4 * (g.g1y + g.g3y) / 3])
        return kxx, kyy, kxy, dv

    def K15(self):
        Db = self.Db; K = np.zeros((15, 15))
        for a, b, c in ((0.5, 0.5, 0.0), (0.0, 0.5, 0.5), (0.5, 0.0, 0.5)):
            kxx, kyy, kxy, dv = self.filas(a, b, c)
            K += (Db[0, 0] * np.outer(kxx, kxx) + Db[0, 1] * (np.outer(kxx, kyy) + np.outer(kyy, kxx))
                  + Db[1, 1] * np.outer(kyy, kyy) + Db[2, 2] * np.outer(kxy, kxy) + self.pen * np.outer(dv, dv))
        return self.At / 3.0 * K + self.At * self.Ds * (np.outer(self.Bsx, self.Bsx) + np.outer(self.Bsy, self.Bsy))

    def condensa(self):
        K = self.K15(); Knn = K[:9, :9]; KnI = K[:9, 9:]; KII = K[9:, 9:]
        return Knn - KnI @ np.linalg.solve(KII, KnI.T), KII, KnI

    def u15(self, u):
        _, KII, KnI = self.condensa(); u = np.asarray(u, float)
        return np.concatenate([u, -np.linalg.solve(KII, KnI.T @ u)])

    def M(self, u15, a, b, c):
        kxx, kyy, kxy, _ = self.filas(a, b, c); Db = self.Db
        return -np.array([Db[0, 0] * kxx @ u15 + Db[0, 1] * kyy @ u15,
                          Db[0, 1] * kxx @ u15 + Db[1, 1] * kyy @ u15, Db[2, 2] * kxy @ u15])


def k_grueso(P, E: float, nu: float, t: float) -> np.ndarray:
    """K 9×9 del triángulo grueso de CSI (K 15×15 condensada)."""
    return _Grueso(P, E, nu, t).condensa()[0]


def _m_grueso(P, E, nu, t, u):
    g = _Grueso(P, E, nu, t); u15 = g.u15(u)
    M = np.array([g.M(u15, 1, 0, 0), g.M(u15, 0, 1, 0), g.M(u15, 0, 0, 1)])
    V = np.array([g.Ds * g.Bsx @ u15, g.Ds * g.Bsy @ u15])          # constante en el triángulo; signo CSI
    return M, V


def _campo_grueso(P, E, nu, t, u, n):
    g = _Grueso(P, E, nu, t); u15 = g.u15(u); P = g.P
    X, Y, M = [], [], []
    for i in range(n + 1):
        for j in range(n + 1 - i):
            xi, eta = i / n, j / n
            X.append(P[0, 0] + xi * (P[1, 0] - P[0, 0]) + eta * (P[2, 0] - P[0, 0]))
            Y.append(P[0, 1] + xi * (P[1, 1] - P[0, 1]) + eta * (P[2, 1] - P[0, 1]))
            M.append(g.M(u15, 1 - xi - eta, xi, eta))
    return np.array(X), np.array(Y), np.array(M)


# ─────────────────────────────────────────────────────────────── interfaz
def angulo_ejes_locales(tipo: str, P) -> float:
    """Ángulo del eje local x del elemento respecto al global: el del solver de Struct (WASM/C++), `v01 + v32` en el
    cuadrilátero. En el triángulo el K de las hojas está en ejes globales y el ángulo es 0."""
    P = np.asarray(P, float).reshape(-1, 2)
    if tipo != "dkq": return 0.0
    v = (P[1] - P[0]) + (P[2] - P[3])
    return float(np.arctan2(v[1], v[0]))


def rigidez(tipo: str, P, E: float, nu: float, t: float, ejes_locales: bool = False) -> np.ndarray:
    """K del elemento (9×9 o 12×12). `tipo`: «dkt», «dkq» o «thick».

    Por defecto en ejes GLOBALES (los de las hojas de Hekatan LISP). Con `ejes_locales=True` los giros de cada nudo
    se llevan a los ejes locales del elemento (los del solver de Struct): en un cuadrilátero irregular la diagonal de
    los giros cambia aunque los autovalores sean los mismos (trapecio (0,0),(4,0),(3.2,2.5),(0.6,2.2): 4285.115 → 4178.284).
    """
    K = {"dkt": k_dkt, "dkq": k_dkq, "thick": k_grueso}[tipo](P, E, nu, t)
    a = angulo_ejes_locales(tipo, P) if ejes_locales else 0.0
    if a:
        c, s = np.cos(a), np.sin(a)
        R = np.array([[1, 0, 0], [0, c, s], [0, -s, c]]); T = np.kron(np.eye(K.shape[0] // 3), R)
        K = T @ K @ T.T
    return K


def momentos(tipo: str, P, E: float, nu: float, t: float, u) -> dict:
    """Momentos nodales M11, M22, M12 (kN·m/m, signo CSI) y, en el grueso, V13 y V23 (kN/m).

    Devuelve {"M": ndarray (nnudos × 3), "V": None | ndarray (2,), "unidades": {...}}."""
    f = {"dkt": _m_dkt, "dkq": _m_dkq, "thick": _m_grueso}[tipo]
    M, V = f(P, E, nu, t, u)
    return {"M": M, "V": V, "unidades": {"M": "kN·m/m", "V": "kN/m", "K": "kN, m"}}


def campo(tipo: str, P, E: float, nu: float, t: float, u, n: int = 24):
    """Muestras del campo de momentos dentro del elemento: (x, y, M[:, 3]) con M11, M22, M12 (signo CSI)."""
    return {"dkt": _campo_dkt, "dkq": _campo_dkq, "thick": _campo_grueso}[tipo](P, E, nu, t, u, n)


def png(ruta: str, tipo: str, P, E: float, nu: float, t: float, u, comp: int = 0, n: int = 28):
    """Mapa de color de un momento (comp 0 = M11, 1 = M22, 2 = M12) sobre el elemento, con nudos rotulados."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import matplotlib.tri as mtri
    P = np.asarray(P, float).reshape(-1, 2)
    x, y, M = campo(tipo, P, E, nu, t, u, n)
    z = M[:, comp]
    if tipo == "dkq":                                  # la malla de la muestra es cuadrada: se trocea en triángulos
        tri = mtri.Triangulation(x, y, triangles=_trozos_cuadriculados(n))
    else:
        tri = mtri.Triangulation(x, y)
    nom = ("M11", "M22", "M12")[comp]
    fig, ax = plt.subplots(figsize=(7.2, 5.6), dpi=140)
    cs = ax.tricontourf(tri, z, levels=24, cmap="jet")
    cb = fig.colorbar(cs, ax=ax); cb.set_label("%s (kN·m/m)" % nom)
    cerr = np.vstack([P, P[:1]]); ax.plot(cerr[:, 0], cerr[:, 1], "k-", lw=1.4)
    Mn, _ = (_m_dkt if tipo == "dkt" else _m_dkq if tipo == "dkq" else _m_grueso)(P, E, nu, t, u)
    for k, (px, py) in enumerate(P):
        ax.plot(px, py, "ko", ms=4); ax.annotate("%d: %.1f" % (k + 1, Mn[k, comp]), (px, py), textcoords="offset points",
                                                  xytext=(6, 6), fontsize=8, bbox=dict(fc="white", alpha=0.75, lw=0))
    ax.margins(0.14); ax.set_aspect("equal"); ax.set_xlabel("x (m)"); ax.set_ylabel("y (m)")
    etiqueta = {"dkt": "DKT (Batoz, Bathe y Ho 1980)", "dkq": "DKQ (Batoz y Tahar 1982)", "thick": "triángulo grueso de CSI"}[tipo]
    ax.set_title("%s · %s · E = %g kN/m² ν = %g t = %g m" % (nom, etiqueta, E, nu, t), fontsize=9)
    fig.tight_layout(); fig.savefig(ruta); plt.close(fig)
    return ruta


def _trozos_cuadriculados(n: int):
    tr = []
    for i in range(n):
        for j in range(n):
            a = i * (n + 1) + j; b = (i + 1) * (n + 1) + j
            tr += [[a, b, b + 1], [a, b + 1, a + 1]]
    return tr


def _fmt(A, dec=6):
    return "\n".join("  " + "  ".join("%*.*f" % (dec + 6, dec, v) for v in fila) for fila in np.atleast_2d(A))


def main(argv=None) -> int:
    try: sys.stdout.reconfigure(encoding="utf-8")        # consola de Windows (cp1252): θ, ·, ν
    except Exception: pass
    p = argparse.ArgumentParser(prog="python -m hekatan_struct.placas",
                                description="Placas de Batoz (DKT, DKQ) y triángulo grueso de CSI: K, momentos y mapa PNG (kN, m)")
    p.add_argument("--tipo", choices=TIPOS, required=True)
    p.add_argument("--nodos", type=float, nargs="+", required=True, help="x1 y1 x2 y2 x3 y3 [x4 y4], antihorarios")
    p.add_argument("--E", type=float, default=24850000.0, help="kN/m²")
    p.add_argument("--nu", type=float, default=0.2)
    p.add_argument("--t", type=float, default=0.1, help="espesor, m")
    p.add_argument("--u", type=float, nargs="*", default=None, help="w θx θy de cada nudo (9 o 12); defecto: el campo de las hojas")
    p.add_argument("--png", default=None, help="archivo PNG del mapa de momento")
    p.add_argument("--comp", type=int, choices=(0, 1, 2), default=0, help="0 = M11, 1 = M22, 2 = M12")
    p.add_argument("--json", action="store_true", help="salida en JSON")
    a = p.parse_args(argv)
    n = 4 if a.tipo == "dkq" else 3
    if len(a.nodos) != 2 * n:
        p.error("el tipo %s lleva %d nudos (%d números)" % (a.tipo, n, 2 * n))
    P = np.array(a.nodos).reshape(n, 2)
    u = campo_patch(P) if not a.u else np.array(a.u)
    if len(u) != 3 * n:
        p.error("--u necesita %d números" % (3 * n))
    K = rigidez(a.tipo, P, a.E, a.nu, a.t); R = momentos(a.tipo, P, a.E, a.nu, a.t, u)
    if a.png: png(a.png, a.tipo, P, a.E, a.nu, a.t, u, a.comp)
    if a.json:
        print(json.dumps({"K": K.tolist(), "M": R["M"].tolist(), "V": None if R["V"] is None else R["V"].tolist(),
                          "reacciones": (K @ u).tolist(), "unidades": R["unidades"], "png": a.png}, ensure_ascii=False))
        return 0
    print("K local (%s), kN y m:" % a.tipo); print(_fmt(K, 3))
    print("\nMomentos nodales M11 M22 M12 (kN·m/m, signo CSI):"); print(_fmt(R["M"], 3))
    if R["V"] is not None: print("\nCortante V13 V23 (kN/m, constante): %.3f  %.3f" % tuple(R["V"]))
    print("\nReacciones K·u (kN para w; kN·m para θx, θy):"); print(_fmt((K @ u).reshape(-1, 3), 3))
    if a.png: print("\nPNG:", a.png)
    return 0


if __name__ == "__main__":                # pragma: no cover
    sys.exit(main())
