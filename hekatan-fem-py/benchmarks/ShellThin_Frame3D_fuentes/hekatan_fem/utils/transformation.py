"""Matrices de transformación local->global.

- Frame 2-nodos: 12x12 (Three.js Y-up no aplica; convención awatif Z-up).
- Shell Q4 4-nodos: 24x24 (block-diagonal 3x3 por bloque).
- Shell tri 3-nodos: 18x18.

Mirror exacto de getTransformationMatrix.cpp.
"""

import numpy as np


def frame(n0, n1) -> np.ndarray:
    n0 = np.asarray(n0, dtype=float)
    n1 = np.asarray(n1, dtype=float)
    v = n1 - n0
    L = np.linalg.norm(v)
    if L < 1e-12:
        return np.zeros((12, 12))
    l, m, n = v / L
    D = np.sqrt(l * l + m * m)
    if abs(n - 1.0) < 1e-9:
        lam = np.array([[0, 0, 1],
                        [0, 1, 0],
                        [-1, 0, 0]], dtype=float)
    elif abs(n + 1.0) < 1e-9:
        lam = np.array([[0, 0, -1],
                        [0, 1, 0],
                        [1, 0, 0]], dtype=float)
    else:
        lam = np.array([[l, m, n],
                        [-m / D, l / D, 0.0],
                        [(-l * n) / D, (-m * n) / D, D]], dtype=float)
    T = np.zeros((12, 12))
    for i in range(4):
        T[i*3:i*3+3, i*3:i*3+3] = lam
    return T


def shell_q4(p0, p1, p2, p3) -> np.ndarray:
    """24x24 block-diag con R 3x3 (mismo que getTransformationMatrixShellQ4)."""
    p0 = np.asarray(p0, dtype=float); p1 = np.asarray(p1, dtype=float)
    p2 = np.asarray(p2, dtype=float); p3 = np.asarray(p3, dtype=float)
    v01 = p1 - p0
    v32 = p2 - p3
    localX = v01 + v32
    lenX = np.linalg.norm(localX)
    if lenX < 1e-12:
        return np.eye(24)
    localX /= lenX
    d02 = p2 - p0
    d13 = p3 - p1
    localZ = np.cross(d02, d13)
    lenZ = np.linalg.norm(localZ)
    if lenZ < 1e-12:
        return np.eye(24)
    localZ /= lenZ
    localY = np.cross(localZ, localX); localY /= np.linalg.norm(localY)
    localX = np.cross(localY, localZ); localX /= np.linalg.norm(localX)
    R = np.vstack([localX, localY, localZ])  # rows = local axes en coords globales
    T = np.zeros((24, 24))
    for i in range(8):
        T[i*3:i*3+3, i*3:i*3+3] = R
    return T


def shell_tri(p0, p1, p2) -> np.ndarray:
    """18x18 block-diag para shell triangular."""
    p0 = np.asarray(p0, dtype=float); p1 = np.asarray(p1, dtype=float)
    p2 = np.asarray(p2, dtype=float)
    dxi  = np.array([-1.0, 1.0, 0.0])
    deta = np.array([-1.0, 0.0, 1.0])
    coords = np.column_stack([p0, p1, p2])  # 3x3
    dX_dxi  = coords @ dxi
    dX_det  = coords @ deta
    normal = np.cross(dX_dxi, dX_det)
    nn = np.linalg.norm(normal)
    if nn < 1e-12:
        return np.zeros((18, 18))
    normal /= nn
    localZ = normal
    if abs(normal[0]) > 1.0 - 1e-10:
        localX = np.array([0.0, 0.0, 1.0]) - normal[2] * normal
    else:
        localX = np.array([1.0, 0.0, 0.0]) - normal[0] * normal
    nx = np.linalg.norm(localX)
    if nx < 1e-12:
        return np.zeros((18, 18))
    localX /= nx
    localY = np.cross(localZ, localX); localY /= np.linalg.norm(localY)
    R = np.vstack([localX, localY, localZ])
    T = np.zeros((18, 18))
    for i in range(6):
        T[i*3:i*3+3, i*3:i*3+3] = R
    return T


def get_transformation_matrix(nodes) -> np.ndarray:
    """Dispatcher por número de nodos."""
    n = len(nodes)
    if n == 2:
        return frame(nodes[0], nodes[1])
    if n == 3:
        return shell_tri(nodes[0], nodes[1], nodes[2])
    if n == 4:
        # heurística: si 0≈3 y 1≈2 → interface (no shell)
        d03 = np.linalg.norm(np.asarray(nodes[0]) - np.asarray(nodes[3]))
        d12 = np.linalg.norm(np.asarray(nodes[1]) - np.asarray(nodes[2]))
        if d03 < 1e-6 and d12 < 1e-6:
            return np.eye(24)
        return shell_q4(nodes[0], nodes[1], nodes[2], nodes[3])
    raise ValueError(f"Elemento no soportado: {n} nodos")
