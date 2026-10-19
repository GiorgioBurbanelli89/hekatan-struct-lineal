"""Shell Q4 Mindlin-Reissner (ETABS Shell-Thick = DSE Wilson Ch10).

Mirror exacto de shellQ4.cpp (Variant A: MITC4 + Wilson alpha-modes).

Membrane: plane stress Q4 con Wilson 1971 incompatible modes + Taylor 1976 J0.
Bending:  Mindlin con incompatible modes en rotaciones + MITC4 shear (Dvorkin-Bathe).
Drilling: dispatch 0=legacy, 1=PyNite weak, 2=Hughes-Brezzi.
"""

import numpy as np
from .drilling_hb import get_drilling_k_hb


_GP2 = 0.5773502691896258
_GP2x2 = np.array([[-_GP2, -_GP2], [_GP2, -_GP2], [_GP2, _GP2], [-_GP2, _GP2]])


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
        detJ = 1e-15
    inv = 1.0 / detJ
    Jinv = np.array([[ J11 * inv, -J01 * inv],
                     [-J10 * inv,  J00 * inv]])
    return detJ, Jinv


def _membrane_k_q4_incomp(x, y, E, nu, t) -> np.ndarray:
    """Wilson 1971 incompatible modes + Taylor 1976 J0 correction. 8x8."""
    factor = E / (1.0 - nu * nu)
    Dm = np.array([[factor,       factor * nu, 0],
                   [factor * nu,  factor,      0],
                   [0,            0,           factor * (1 - nu) / 2.0]], dtype=float)

    # J0 en el centro (xi=eta=0)
    _, dN0dxi, dN0deta = _shape_q4(0.0, 0.0)
    _, Jinv0 = _jacobian2d(x, y, dN0dxi, dN0deta)

    Kuu = np.zeros((8, 8))
    Kua = np.zeros((8, 4))
    Kaa = np.zeros((4, 4))

    for gp in range(4):
        xi, eta = _GP2x2[gp]
        N, dNdxi, dNdeta = _shape_q4(xi, eta)
        detJ, Jinv = _jacobian2d(x, y, dNdxi, dNdeta)

        Bc = np.zeros((3, 8))
        for i in range(4):
            dNdx = Jinv[0, 0] * dNdxi[i] + Jinv[0, 1] * dNdeta[i]
            dNdy = Jinv[1, 0] * dNdxi[i] + Jinv[1, 1] * dNdeta[i]
            Bc[0, 2*i]     = dNdx
            Bc[1, 2*i + 1] = dNdy
            Bc[2, 2*i]     = dNdy
            Bc[2, 2*i + 1] = dNdx

        # B incompatible (Taylor J0)
        dN5dxi, dN5deta = -2.0 * xi, 0.0
        dN6dxi, dN6deta =  0.0,     -2.0 * eta
        dN5dx = Jinv0[0, 0] * dN5dxi + Jinv0[0, 1] * dN5deta
        dN5dy = Jinv0[1, 0] * dN5dxi + Jinv0[1, 1] * dN5deta
        dN6dx = Jinv0[0, 0] * dN6dxi + Jinv0[0, 1] * dN6deta
        dN6dy = Jinv0[1, 0] * dN6dxi + Jinv0[1, 1] * dN6deta
        Bi = np.zeros((3, 4))
        Bi[0, 0] = dN5dx; Bi[0, 1] = dN6dx
        Bi[1, 2] = dN5dy; Bi[1, 3] = dN6dy
        Bi[2, 0] = dN5dy; Bi[2, 1] = dN6dy
        Bi[2, 2] = dN5dx; Bi[2, 3] = dN6dx

        w = t * abs(detJ)
        Kuu += Bc.T @ Dm @ Bc * w
        Kua += Bc.T @ Dm @ Bi * w
        Kaa += Bi.T @ Dm @ Bi * w

    if abs(np.linalg.det(Kaa)) > 1e-20:
        Km = Kuu - Kua @ np.linalg.inv(Kaa) @ Kua.T
    else:
        Km = Kuu
    return Km


def _bending_k_q4_mitc4(x, y, E, nu, t) -> np.ndarray:
    """Mindlin Q4: 2x2 Gauss bending con incompatible modes + MITC4 shear.

    DOFs por nodo: [w, θx_global, θy_global]. Mapeo Mindlin:
      βx = -θy_global, βy = +θx_global.
      κxx = -∂θy/∂x, κyy = +∂θx/∂y, κxy = +∂θx/∂x - ∂θy/∂y.
      γxz = +∂w/∂x + θy_global, γyz = +∂w/∂y - θx_global.
    """
    D0 = E * t * t * t / (12.0 * (1.0 - nu * nu))
    Db = np.array([[D0,      D0 * nu, 0],
                   [D0 * nu, D0,      0],
                   [0,       0,       D0 * (1 - nu) / 2.0]], dtype=float)
    ks = 5.0 / 6.0
    G  = E / (2.0 * (1.0 + nu))
    Ds = np.array([[ks * G * t, 0],
                   [0,          ks * G * t]], dtype=float)

    _, dN0dxi, dN0deta = _shape_q4(0.0, 0.0)
    _, Jinv0 = _jacobian2d(x, y, dN0dxi, dN0deta)

    Kuu = np.zeros((12, 12))
    Kua = np.zeros((12, 4))
    Kaa = np.zeros((4, 4))

    # Bending: 2x2 Gauss
    for gp in range(4):
        xi, eta = _GP2x2[gp]
        N, dNdxi, dNdeta = _shape_q4(xi, eta)
        detJ, Jinv = _jacobian2d(x, y, dNdxi, dNdeta)
        Bb = np.zeros((3, 12))
        for i in range(4):
            dNdx = Jinv[0, 0] * dNdxi[i] + Jinv[0, 1] * dNdeta[i]
            dNdy = Jinv[1, 0] * dNdxi[i] + Jinv[1, 1] * dNdeta[i]
            Bb[0, 3*i + 2] = -dNdx
            Bb[1, 3*i + 1] = +dNdy
            Bb[2, 3*i + 1] = +dNdx
            Bb[2, 3*i + 2] = -dNdy

        # Incompatible alpha-modes en rotaciones, Taylor J0
        dN5dxi, dN5deta = -2.0 * xi, 0.0
        dN6dxi, dN6deta =  0.0,     -2.0 * eta
        dN5dx0 = Jinv0[0, 0] * dN5dxi + Jinv0[0, 1] * dN5deta
        dN5dy0 = Jinv0[1, 0] * dN5dxi + Jinv0[1, 1] * dN5deta
        dN6dx0 = Jinv0[0, 0] * dN6dxi + Jinv0[0, 1] * dN6deta
        dN6dy0 = Jinv0[1, 0] * dN6dxi + Jinv0[1, 1] * dN6deta
        Ba = np.zeros((3, 4))
        Ba[0, 2] = -dN5dx0
        Ba[0, 3] = -dN6dx0
        Ba[1, 0] = +dN5dy0
        Ba[1, 1] = +dN6dy0
        Ba[2, 0] = +dN5dx0
        Ba[2, 1] = +dN6dx0
        Ba[2, 2] = -dN5dy0
        Ba[2, 3] = -dN6dy0

        w = abs(detJ)
        Kuu += Bb.T @ Db @ Bb * w
        Kua += Bb.T @ Db @ Ba * w
        Kaa += Ba.T @ Db @ Ba * w

    # MITC4 shear: tying en A(0,-1), C(0,+1), B(-1,0), D(+1,0)
    def shear_b(xi_pt, eta_pt):
        Np, dNp_dxi, dNp_deta = _shape_q4(xi_pt, eta_pt)
        _, Jp_inv = _jacobian2d(x, y, dNp_dxi, dNp_deta)
        Bsp = np.zeros((2, 12))
        for i in range(4):
            dNdx_p = Jp_inv[0, 0] * dNp_dxi[i] + Jp_inv[0, 1] * dNp_deta[i]
            dNdy_p = Jp_inv[1, 0] * dNp_dxi[i] + Jp_inv[1, 1] * dNp_deta[i]
            Bsp[0, 3*i]     = +dNdx_p   # γxz: +∂w/∂x
            Bsp[0, 3*i + 2] = +Np[i]    # γxz: +θy_global (DOF 2)
            Bsp[1, 3*i]     = +dNdy_p   # γyz: +∂w/∂y
            Bsp[1, 3*i + 1] = -Np[i]    # γyz: -θx_global (DOF 1)
        return Bsp

    Bs_A = shear_b(0.0, -1.0)
    Bs_C = shear_b(0.0, +1.0)
    Bs_B = shear_b(-1.0, 0.0)
    Bs_D = shear_b(+1.0, 0.0)

    for gp in range(4):
        xi, eta = _GP2x2[gp]
        _, dN_gp_dxi, dN_gp_deta = _shape_q4(xi, eta)
        detJ_gp, _ = _jacobian2d(x, y, dN_gp_dxi, dN_gp_deta)
        Bs_mitc = np.zeros((2, 12))
        Bs_mitc[0, :] = 0.5 * (1.0 - eta) * Bs_A[0, :] + 0.5 * (1.0 + eta) * Bs_C[0, :]
        Bs_mitc[1, :] = 0.5 * (1.0 - xi)  * Bs_B[1, :] + 0.5 * (1.0 + xi)  * Bs_D[1, :]
        Kuu += Bs_mitc.T @ Ds @ Bs_mitc * abs(detJ_gp)

    if abs(np.linalg.det(Kaa)) > 1e-20:
        Kb = Kuu - Kua @ np.linalg.inv(Kaa) @ Kua.T
    else:
        Kb = Kuu
    return Kb


def _project_to_local(nodes):
    p = [np.asarray(n, dtype=float) for n in nodes]
    p0, p1, p2, p3 = p
    v01 = p1 - p0; v32 = p2 - p3
    localX = v01 + v32
    lenX = np.linalg.norm(localX)
    if lenX < 1e-12:
        return None
    localX /= lenX
    d02 = p2 - p0; d13 = p3 - p1
    localZ = np.cross(d02, d13)
    lenZ = np.linalg.norm(localZ)
    if lenZ < 1e-12:
        return None
    localZ /= lenZ
    localY = np.cross(localZ, localX); localY /= np.linalg.norm(localY)
    localX = np.cross(localY, localZ); localX /= np.linalg.norm(localX)
    center = 0.25 * (p0 + p1 + p2 + p3)
    x = np.zeros(4); y = np.zeros(4)
    for i in range(4):
        d = p[i] - center
        x[i] = float(np.dot(d, localX))
        y[i] = float(np.dot(d, localY))
    return x, y


def get_local_stiffness_shell_q4(nodes, ei, index) -> np.ndarray:
    E  = ei.elasticities.get(index, 0.0)
    nu = ei.poissonsRatios.get(index, 0.0)
    t  = ei.thicknesses.get(index, 0.0)
    if E < 1e-12 or t < 1e-12:
        return np.zeros((24, 24))

    coords = _project_to_local(nodes)
    if coords is None:
        return np.zeros((24, 24))
    x, y = coords

    mFactor = ei.membraneModifiers.get(index, 1.0)
    bFactor = ei.bendingModifiers.get(index, 1.0)

    Km = _membrane_k_q4_incomp(x, y, E, nu, t)
    Kb = _bending_k_q4_mitc4(x, y, E, nu, t)
    Km *= mFactor
    Kb *= bFactor

    K = np.zeros((24, 24))
    for ni in range(4):
        for nj in range(4):
            for di in range(2):
                for dj in range(2):
                    K[ni*6 + di, nj*6 + dj] = Km[ni*2 + di, nj*2 + dj]
            for di in range(3):
                for dj in range(3):
                    K[ni*6 + 2 + di, nj*6 + 2 + dj] = Kb[ni*3 + di, nj*3 + dj]

    dtype = ei.drillingTypes.get(index, 2)
    dscale = ei.drillingPenaltyScales.get(index, 1.0)
    if dtype == 2:
        K += mFactor * get_drilling_k_hb(x, y, E, nu, t, dscale)
    elif dtype == 1:
        minRot = 1e18
        for ni in range(4):
            dxv = abs(K[ni*6 + 3, ni*6 + 3])
            dyv = abs(K[ni*6 + 4, ni*6 + 4])
            if 1e-15 < dxv < minRot: minRot = dxv
            if 1e-15 < dyv < minRot: minRot = dyv
        drill = minRot * 1e-3 if minRot < 1e17 else E * t * 1e-6 * max(mFactor, 1e-6)
        for i in range(4):
            K[i*6 + 5, i*6 + 5] = drill
    else:
        drill = sum(abs(Km[i, i]) for i in range(8)) * 1e-6 / 8.0
        if drill < 1e-15:
            drill = E * t * 1e-6 * max(mFactor, 1e-6)
        for i in range(4):
            K[i*6 + 5, i*6 + 5] = drill
    return K
