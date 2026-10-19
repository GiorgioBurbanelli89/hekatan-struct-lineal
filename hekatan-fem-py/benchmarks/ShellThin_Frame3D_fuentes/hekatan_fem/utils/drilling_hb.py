"""Drilling DOF — Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990.

Mirror exacto de drillingHughesBrezzi.cpp.

Penaliza el residual R = θz - 0.5*(∂v/∂x - ∂u/∂y) con γ = G*t*scale.
Devuelve K_drill 24x24 sobre los 6 DOFs por nodo del shell [u,v,w,θx,θy,θz],
con contribución no nula solo en u, v, θz.
"""

import numpy as np


_GP = 0.5773502691896258  # 1/sqrt(3)
_GP2x2 = np.array([[-_GP, -_GP], [_GP, -_GP], [_GP, _GP], [-_GP, _GP]])


def _shape_q4(xi, eta):
    N = np.array([
        0.25 * (1 - xi) * (1 - eta),
        0.25 * (1 + xi) * (1 - eta),
        0.25 * (1 + xi) * (1 + eta),
        0.25 * (1 - xi) * (1 + eta),
    ])
    dNdxi  = np.array([-0.25 * (1 - eta),  0.25 * (1 - eta),
                        0.25 * (1 + eta), -0.25 * (1 + eta)])
    dNdeta = np.array([-0.25 * (1 - xi), -0.25 * (1 + xi),
                        0.25 * (1 + xi),  0.25 * (1 - xi)])
    return N, dNdxi, dNdeta


def _jacobian2d(x, y, dNdxi, dNdeta):
    J00 = float(np.dot(dNdxi,  x)); J01 = float(np.dot(dNdxi,  y))
    J10 = float(np.dot(dNdeta, x)); J11 = float(np.dot(dNdeta, y))
    detJ = J00 * J11 - J01 * J10
    if abs(detJ) < 1e-15:
        detJ = 1e-15 if detJ >= 0 else -1e-15
    inv = 1.0 / detJ
    Jinv = np.array([[ J11 * inv, -J01 * inv],
                     [-J10 * inv,  J00 * inv]])
    return detJ, Jinv


def get_drilling_k_hb(x, y, E, nu, t, gamma_scale=1.0) -> np.ndarray:
    """K_drill 24x24 (DOFs por nodo [u,v,w,θx,θy,θz])."""
    G = E / (2.0 * (1.0 + nu))
    gamma = gamma_scale * G * t
    if gamma < 1e-18:
        return np.zeros((24, 24))

    x = np.asarray(x, dtype=float); y = np.asarray(y, dtype=float)
    Kd = np.zeros((12, 12))  # DOFs [u0,v0,θz0, u1,v1,θz1, u2,v2,θz2, u3,v3,θz3]

    for gp in range(4):
        xi, eta = _GP2x2[gp]
        N, dNdxi, dNdeta = _shape_q4(xi, eta)
        detJ, Jinv = _jacobian2d(x, y, dNdxi, dNdeta)
        Bd = np.zeros(12)
        for i in range(4):
            dNdx = Jinv[0, 0] * dNdxi[i] + Jinv[0, 1] * dNdeta[i]
            dNdy = Jinv[1, 0] * dNdxi[i] + Jinv[1, 1] * dNdeta[i]
            Bd[3*i + 0] = +0.5 * dNdy   # u_i  -> +1/2 ∂N/∂y
            Bd[3*i + 1] = -0.5 * dNdx   # v_i  -> -1/2 ∂N/∂x
            Bd[3*i + 2] = N[i]          # θz_i -> N
        Kd += np.outer(Bd, Bd) * (gamma * abs(detJ))

    # Expandir 12x12 -> 24x24 (mapeo [u,v,θz] por nodo)
    gmap = np.array([0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23])
    K24 = np.zeros((24, 24))
    for i in range(12):
        for j in range(12):
            K24[gmap[i], gmap[j]] = Kd[i, j]
    return K24
