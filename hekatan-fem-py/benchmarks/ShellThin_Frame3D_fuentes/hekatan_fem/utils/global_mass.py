"""Global mass matrix HRZ lumped (SAP2000/ETABS style).

Mirror exacto de getGlobalMassMatrix.cpp (no consistent mass — solo lumped por
nodo, traslacional, rotacional con epsilon para evitar singularidad eigen).
"""

import numpy as np
import scipy.sparse as sp


_ROT_MASS_EPSILON = 1e-9


def _frame_length(nodes):
    n0 = np.asarray(nodes[0], dtype=float)
    n1 = np.asarray(nodes[1], dtype=float)
    return float(np.linalg.norm(n1 - n0))


def _quad_area(nodes):
    """A = 0.5 * |d1 x d2| con d1 = p2-p0, d2 = p3-p1."""
    p = [np.asarray(n, dtype=float) for n in nodes]
    d1 = p[2] - p[0]
    d2 = p[3] - p[1]
    return 0.5 * float(np.linalg.norm(np.cross(d1, d2)))


def _tri_area(nodes):
    p = [np.asarray(n, dtype=float) for n in nodes]
    return 0.5 * float(np.linalg.norm(np.cross(p[1] - p[0], p[2] - p[0])))


def get_global_mass_matrix(nodes, elements, ei, dof: int,
                           include_vertical: bool = True) -> sp.csr_matrix:
    """M lumped HRZ. elements = list of [node_idx,...]. nodes = (n,3) array.

    include_vertical=False reproduce el MassSource de ETABS con
    INCLUDEVERTICALMASS=No (masa solo lateral UX/UY) — usar en el modal de
    losas/edificios (mesa de torsion). Default True = masa en los 3 ejes.
    """
    rows = []; cols = []; data = []
    mz_fac = 1.0 if include_vertical else 0.0

    for e_idx, elm in enumerate(elements):
        rho = ei.densities.get(e_idx, 0.0)
        if rho <= 0.0:
            continue
        elm_nodes = [nodes[i] for i in elm]
        n_el = len(elm)

        if n_el == 2:
            A = ei.areas.get(e_idx, 0.0)
            L = _frame_length(elm_nodes)
            m_total = rho * A * L
        elif n_el == 4:
            t = ei.thicknesses.get(e_idx, 0.0)
            A_sh = _quad_area(elm_nodes)
            m_total = rho * A_sh * t
        elif n_el == 3:
            t = ei.thicknesses.get(e_idx, 0.0)
            A_tri = _tri_area(elm_nodes)
            m_total = rho * A_tri * t
        else:
            continue

        if m_total <= 0.0:
            continue

        m_per_node = m_total / n_el
        m_rot = m_per_node * _ROT_MASS_EPSILON
        for node_idx in elm:
            g = node_idx * 6
            rows += [g + 0, g + 1, g + 2, g + 3, g + 4, g + 5]
            cols += [g + 0, g + 1, g + 2, g + 3, g + 4, g + 5]
            data += [m_per_node, m_per_node, mz_fac*m_per_node, m_rot, m_rot, m_rot]

    M = sp.csr_matrix((data, (rows, cols)), shape=(dof, dof))
    M.sum_duplicates()
    return M
