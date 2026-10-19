"""K local dispatcher: frame 12x12 / shell 18x18 (tri) / shell Q4 24x24.

Mirror de getLocalStiffnessMatrix.cpp (frame + dispatch shell).
Releases (static condensation) y partial fixity springs incluidos.
"""

import numpy as np

from .shell_q4   import get_local_stiffness_shell_q4
from .shell_thin import get_local_stiffness_shell_thin


def _frame_k(nodes, ei, index) -> np.ndarray:
    """Timoshenko 3D frame 12x12 (mirror getLocalStiffnessMatrixFrame)."""
    Iz = ei.momentsOfInertiaZ.get(index, 0.0)
    Iy = ei.momentsOfInertiaY.get(index, 0.0)
    E  = ei.elasticities.get(index, 0.0)
    A  = ei.areas.get(index, 0.0)
    G  = ei.shearModuli.get(index, 0.0)
    J  = ei.torsionalConstants.get(index, 0.0)

    n0 = np.asarray(nodes[0], dtype=float)
    n1 = np.asarray(nodes[1], dtype=float)
    L = float(np.linalg.norm(n1 - n0))
    if L < 1e-12:
        return np.zeros((12, 12))

    AsY = ei.shearAreasY.get(index, 0.0)
    AsZ = ei.shearAreasZ.get(index, 0.0)
    bernoulliY = (AsY < -1e-15)
    bernoulliZ = (AsZ < -1e-15)
    if not bernoulliY and AsY < 1e-15 and A > 1e-15 and G > 1e-15:
        AsY = (5.0 / 6.0) * A
    if not bernoulliZ and AsZ < 1e-15 and A > 1e-15 and G > 1e-15:
        AsZ = (5.0 / 6.0) * A
    phiZ = (12.0 * E * Iz) / (G * AsZ * L * L) if (not bernoulliZ and AsZ > 0 and G > 0) else 0.0
    phiY = (12.0 * E * Iy) / (G * AsY * L * L) if (not bernoulliY and AsY > 0 and G > 0) else 0.0

    EA_L = E * A / L
    GJ_L = G * J / L

    tz = (12.0 * E * Iz / (L**3)) / (1.0 + phiZ)
    bz = (6.0  * E * Iz / (L**2)) / (1.0 + phiZ)
    kz = (4.0  * E * Iz / L) * (1.0 + phiZ / 4.0) / (1.0 + phiZ)
    az = (2.0  * E * Iz / L) * (1.0 - phiZ / 2.0) / (1.0 + phiZ)

    ty = (12.0 * E * Iy / (L**3)) / (1.0 + phiY)
    by = (6.0  * E * Iy / (L**2)) / (1.0 + phiY)
    ky = (4.0  * E * Iy / L) * (1.0 + phiY / 4.0) / (1.0 + phiY)
    ay = (2.0  * E * Iy / L) * (1.0 - phiY / 2.0) / (1.0 + phiY)

    K = np.array([
        [ EA_L,    0,    0,     0,    0,   0,   -EA_L,    0,    0,     0,    0,   0],
        [   0,    tz,    0,     0,    0,  bz,      0,   -tz,    0,     0,    0,  bz],
        [   0,     0,   ty,     0,  -by,   0,      0,     0,  -ty,     0,  -by,   0],
        [   0,     0,    0,  GJ_L,    0,   0,      0,     0,    0, -GJ_L,    0,   0],
        [   0,     0,  -by,     0,   ky,   0,      0,     0,   by,     0,   ay,   0],
        [   0,    bz,    0,     0,    0,  kz,      0,   -bz,    0,     0,    0,  az],
        [-EA_L,    0,    0,     0,    0,   0,    EA_L,    0,    0,     0,    0,   0],
        [   0,   -tz,    0,     0,    0, -bz,      0,    tz,    0,     0,    0, -bz],
        [   0,     0,  -ty,     0,   by,   0,      0,     0,   ty,     0,   by,   0],
        [   0,     0,    0, -GJ_L,    0,   0,      0,     0,    0,  GJ_L,    0,   0],
        [   0,     0,  -by,     0,   ay,   0,      0,     0,   by,     0,   ky,   0],
        [   0,    bz,    0,     0,    0,  az,      0,   -bz,    0,     0,    0,  kz],
    ], dtype=float)
    return K


def _apply_partial_fixity(K, springs):
    Ks = K.copy()
    n = min(len(springs), 12)
    for i in range(n):
        if springs[i] > 1e-12:
            Ks[i, i] += springs[i]
    return Ks


def _apply_releases(K, releases):
    """Static condensation por DOFs liberados (6-flag legacy o 12-flag full)."""
    if len(releases) >= 12:
        freed = [i for i in range(12) if releases[i]]
    else:
        rel_dofs = [3, 4, 5, 9, 10, 11]
        freed = [rel_dofs[i] for i in range(min(6, len(releases))) if releases[i]]
    if not freed:
        return K
    retained = [i for i in range(12) if i not in freed]
    nr, nf = len(retained), len(freed)
    Kff = K[np.ix_(freed, freed)]
    Krf = K[np.ix_(retained, freed)]
    Kfr = K[np.ix_(freed, retained)]
    KffInv = np.linalg.inv(Kff)
    correction = Krf @ KffInv @ Kfr
    Kc = np.zeros((12, 12))
    for i in range(nr):
        for j in range(nr):
            Kc[retained[i], retained[j]] = K[retained[i], retained[j]] - correction[i, j]
    return Kc


def get_local_stiffness(nodes, ei, index) -> np.ndarray:
    n = len(nodes)
    if n == 2:
        K = _frame_k(nodes, ei, index)
        sp = ei.partialFixitySprings.get(index)
        if sp is not None:
            K = _apply_partial_fixity(K, sp)
        rel = ei.momentReleases.get(index)
        if rel is not None:
            K = _apply_releases(K, rel)
        return K
    if n == 4:
        t = ei.thicknesses.get(index, 0.0)
        if t > 1e-12:
            pf = ei.plateFormulations.get(index)
            if pf == 1:
                return get_local_stiffness_shell_thin(nodes, ei, index)
            return get_local_stiffness_shell_q4(nodes, ei, index)
    raise NotImplementedError(f"Elemento {n} nodos (sin thickness?) no portado aun.")
