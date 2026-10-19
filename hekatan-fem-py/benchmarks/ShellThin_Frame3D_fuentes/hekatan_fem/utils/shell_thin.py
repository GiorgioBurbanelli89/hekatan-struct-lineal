"""Shell-Thin (ETABS Shell-Thin = DKE Kirchhoff MZC).

Mirror exacto de shellThin.cpp.

Combinacion: Membrane (plane stress Q4 2x2 Gauss) + MZC Kirchhoff (12x12)
+ drilling (legacy / weak / Hughes-Brezzi).
"""

import numpy as np
from .drilling_hb import get_drilling_k_hb


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


def _membrane_k_thin(x, y, E, nu, t) -> np.ndarray:
    """K_membrane 8x8 (plane stress Q4 estandar 2x2 Gauss)."""
    c = E / (1.0 - nu * nu)
    Em = np.array([[c,      c * nu, 0],
                   [c * nu, c,      0],
                   [0,      0,      c * (1 - nu) / 2.0]], dtype=float)
    gp = np.array([-1.0 / np.sqrt(3.0), 1.0 / np.sqrt(3.0)])
    gw = np.array([1.0, 1.0])

    K = np.zeros((8, 8))
    for ix in range(2):
        for iy in range(2):
            xi, eta = gp[ix], gp[iy]
            N, dNdxi, dNdeta = _shape_q4(xi, eta)
            J11 = float(np.dot(dNdxi,  x)); J12 = float(np.dot(dNdxi,  y))
            J21 = float(np.dot(dNdeta, x)); J22 = float(np.dot(dNdeta, y))
            detJ = J11 * J22 - J12 * J21
            Jinv11 =  J22 / detJ; Jinv12 = -J12 / detJ
            Jinv21 = -J21 / detJ; Jinv22 =  J11 / detJ
            B = np.zeros((3, 8))
            for i in range(4):
                dNdx = Jinv11 * dNdxi[i] + Jinv12 * dNdeta[i]
                dNdy = Jinv21 * dNdxi[i] + Jinv22 * dNdeta[i]
                B[0, 2*i]     = dNdx
                B[1, 2*i + 1] = dNdy
                B[2, 2*i]     = dNdy
                B[2, 2*i + 1] = dNdx
            K += gw[ix] * gw[iy] * (B.T @ Em @ B) * t * detJ
    return K


def _membrane_k_q6(x, y, E, nu, t) -> np.ndarray:
    """K_membrane 8x8 con MODOS INCOMPATIBLES de Wilson (Q6/QM6, Taylor 1976).

    Es la formulacion que usa ETABS ShellThin ("in-plane displacements are
    quadratic", CSI Manual Ch10): u = sum Ni*ui + (1-xi^2)*a1 + (1-eta^2)*a2
    (idem v), con los 4 modos incompatibles a_i condensados estaticamente.
    Elimina el shear locking de la membrana Q4 bilineal -> menos rigida en el
    plano, igual que ETABS. Para Q4 rectangular J es constante => Q6 = QM6.
    """
    c = E / (1.0 - nu * nu)
    Em = np.array([[c,      c * nu, 0],
                   [c * nu, c,      0],
                   [0,      0,      c * (1 - nu) / 2.0]], dtype=float)
    gp = np.array([-1.0 / np.sqrt(3.0), 1.0 / np.sqrt(3.0)])
    gw = np.array([1.0, 1.0])

    # Jacobiano en el centro (QM6: gradientes de los modos incompat. en xi=eta=0)
    _, dN0xi, dN0eta = _shape_q4(0.0, 0.0)
    J0_11 = float(np.dot(dN0xi, x)); J0_12 = float(np.dot(dN0xi, y))
    J0_21 = float(np.dot(dN0eta, x)); J0_22 = float(np.dot(dN0eta, y))
    detJ0 = J0_11 * J0_22 - J0_12 * J0_21
    Ji0_11 =  J0_22 / detJ0; Ji0_12 = -J0_12 / detJ0
    Ji0_21 = -J0_21 / detJ0; Ji0_22 =  J0_11 / detJ0

    Kuu = np.zeros((8, 8)); Kua = np.zeros((8, 4)); Kaa = np.zeros((4, 4))
    for ix in range(2):
        for iy in range(2):
            xi, eta = gp[ix], gp[iy]
            N, dNdxi, dNdeta = _shape_q4(xi, eta)
            J11 = float(np.dot(dNdxi,  x)); J12 = float(np.dot(dNdxi,  y))
            J21 = float(np.dot(dNdeta, x)); J22 = float(np.dot(dNdeta, y))
            detJ = J11 * J22 - J12 * J21
            Ji11 =  J22 / detJ; Ji12 = -J12 / detJ
            Ji21 = -J21 / detJ; Ji22 =  J11 / detJ
            B = np.zeros((3, 8))
            for i in range(4):
                dNdx = Ji11 * dNdxi[i] + Ji12 * dNdeta[i]
                dNdy = Ji21 * dNdxi[i] + Ji22 * dNdeta[i]
                B[0, 2*i]     = dNdx
                B[1, 2*i + 1] = dNdy
                B[2, 2*i]     = dNdy
                B[2, 2*i + 1] = dNdx
            # modos incompatibles P1=(1-xi^2), P2=(1-eta^2); dP1/dxi=-2xi, dP2/deta=-2eta
            dP1dx = Ji0_11 * (-2*xi);          dP1dy = Ji0_21 * (-2*xi)
            dP2dx = Ji0_12 * (-2*eta);         dP2dy = Ji0_22 * (-2*eta)
            G = np.zeros((3, 4))
            G[0, 0] = dP1dx; G[2, 0] = dP1dy       # a1 -> u (1-xi^2)
            G[0, 1] = dP2dx; G[2, 1] = dP2dy       # a2 -> u (1-eta^2)
            G[1, 2] = dP1dy; G[2, 2] = dP1dx       # a3 -> v (1-xi^2)
            G[1, 3] = dP2dy; G[2, 3] = dP2dx       # a4 -> v (1-eta^2)
            wdet = gw[ix] * gw[iy] * t * detJ
            Kuu += wdet * (B.T @ Em @ B)
            Kua += wdet * (B.T @ Em @ G)
            Kaa += wdet * (G.T @ Em @ G)
    # condensacion estatica de los modos incompatibles
    return Kuu - Kua @ np.linalg.solve(Kaa, Kua.T)


def _bending_k_mzc(x, y, E, nu, t) -> np.ndarray:
    """MZC Kirchhoff plate bending 12x12 (DOFs por nodo [w, θx, θy]).

    Asume Q4 RECTANGULAR alineado con ejes locales.
    """
    xmin, xmax = float(np.min(x)), float(np.max(x))
    ymin, ymax = float(np.min(y)), float(np.max(y))
    a = (xmax - xmin) / 2.0
    b = (ymax - ymin) / 2.0

    D0 = E * t * t * t / (12.0 * (1.0 - nu * nu))
    D = np.array([[D0,      D0 * nu, 0],
                  [D0 * nu, D0,      0],
                  [0,       0,       D0 * (1 - nu) / 2.0]], dtype=float)

    xi_n  = np.array([-1.0, 1.0, 1.0, -1.0])
    eta_n = np.array([-1.0, -1.0, 1.0, 1.0])
    gp = np.array([-np.sqrt(3.0 / 5.0), 0.0, np.sqrt(3.0 / 5.0)])
    gw = np.array([5.0 / 9.0, 8.0 / 9.0, 5.0 / 9.0])

    K = np.zeros((12, 12))
    for ix in range(3):
        for iy in range(3):
            xi  = gp[ix]
            eta = gp[iy]
            w_int = gw[ix] * gw[iy]

            B = np.zeros((3, 12))
            for i in range(4):
                xi_i, eta_i = xi_n[i], eta_n[i]
                xi_ii   = xi_i * xi
                eta_ii  = eta_i * eta

                term1 = (1 + xi_ii) * (1 + eta_ii)
                t2_ = 2 + xi_ii + eta_ii - xi * xi - eta * eta
                dt1_dxi  = xi_i  * (1 + eta_ii)
                dt2_dxi  = xi_i  - 2 * xi
                dt1_deta = eta_i * (1 + xi_ii)
                dt2_deta = eta_i - 2 * eta

                d2H1_dxi2    = (1.0 / 8.0) * (term1 * (-2) + 2 * dt1_dxi * dt2_dxi)
                d2H1_deta2   = (1.0 / 8.0) * (term1 * (-2) + 2 * dt1_deta * dt2_deta)
                d2t1_dxideta = xi_i * eta_i
                d2H1_dxideta = (1.0 / 8.0) * (d2t1_dxideta * t2_
                                              + dt1_dxi * dt2_deta
                                              + dt1_deta * dt2_dxi)

                d2H2_dxi2    = 0.0
                d2H2_deta2   = (b / 8.0) * eta_i * (1 + xi_ii) * 2.0 * (3 * eta_ii + 1) * eta_i * eta_i
                d2H2_dxideta = (b / 8.0) * xi_i * eta_i * eta_i * (1 + eta_ii) * (3 * eta_ii - 1)

                d2H3_dxi2    = -(a / 8.0) * xi_i * (1 + eta_ii) * 2.0 * (3 * xi_ii + 1) * xi_i * xi_i
                d2H3_deta2   = 0.0
                d2H3_dxideta = -(a / 8.0) * eta_i * xi_i * xi_i * (1 + xi_ii) * (3 * xi_ii - 1)

                col_w  = 3 * i + 0
                col_tx = 3 * i + 1
                col_ty = 3 * i + 2

                B[0, col_w]  = -d2H1_dxi2  / (a * a)
                B[1, col_w]  = -d2H1_deta2 / (b * b)
                B[2, col_w]  = -2 * d2H1_dxideta / (a * b)

                B[0, col_tx] = -d2H2_dxi2  / (a * a)
                B[1, col_tx] = -d2H2_deta2 / (b * b)
                B[2, col_tx] = -2 * d2H2_dxideta / (a * b)

                B[0, col_ty] = -d2H3_dxi2  / (a * a)
                B[1, col_ty] = -d2H3_deta2 / (b * b)
                B[2, col_ty] = -2 * d2H3_dxideta / (a * b)

            detJ = a * b
            K += w_int * (B.T @ D @ B) * detJ
    return K


def _project_to_local(nodes):
    """Proyecta los 4 nodos 3D al sistema local del shell (mismo que shellThin.cpp)."""
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


def get_local_stiffness_shell_thin(nodes, ei, index) -> np.ndarray:
    """K local 24x24 para Shell-Thin (mismo que shellThin.cpp:183)."""
    E  = ei.elasticities.get(index, 0.0)
    nu = ei.poissonsRatios.get(index, 0.2)
    t  = ei.thicknesses.get(index, 0.0)
    if E <= 0 or t <= 0:
        return np.zeros((24, 24))

    coords = _project_to_local(nodes)
    if coords is None:
        return np.zeros((24, 24))
    x, y = coords

    mFactor = ei.membraneModifiers.get(index, 1.0)
    bFactor = ei.bendingModifiers.get(index, 1.0)

    Km = _membrane_k_q6(x, y, E, nu, t)   # Wilson incompatible modes (= ETABS ShellThin)
    Kb = _bending_k_mzc(x, y, E, nu, t)
    Km *= mFactor
    Kb *= bFactor

    K = np.zeros((24, 24))
    for ni in range(4):
        for nj in range(4):
            # Membrane: u=6i+0, v=6i+1
            for di in range(2):
                for dj in range(2):
                    K[ni*6 + di, nj*6 + dj] = Km[ni*2 + di, nj*2 + dj]
            # Bending: w=6i+2, θx=6i+3, θy=6i+4
            for di in range(3):
                for dj in range(3):
                    K[ni*6 + 2 + di, nj*6 + 2 + dj] = Kb[ni*3 + di, nj*3 + dj]

    # Drilling
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
        drill = 0.0
        for i in range(8):
            drill += abs(Km[i, i])
        drill *= 1e-6 / 8.0
        if drill < 1e-15:
            drill = E * t * 1e-6 * max(mFactor, 1e-6)
        for i in range(4):
            K[i*6 + 5, i*6 + 5] = drill

    return K
