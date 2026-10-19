"""Modal analysis: K·phi = omega^2·M·phi.

Mirror de modal.cpp. Usa scipy.linalg.eigh para el problema generalizado denso
sobre los DOFs reducidos (free + no zero-diagonal). Para mallas grandes podes
cambiar a scipy.sparse.linalg.eigsh (Lanczos shift-invert).
"""

import numpy as np
import scipy.sparse as sp
import scipy.linalg as la

from ..data_model import ModalOutputs, NodeInputs, ElementInputs
from ..utils.fe_helpers import get_free_indices, get_zero_indices, reduce_matrix
from ..utils.global_mass import get_global_mass_matrix
from .deform import assemble_global_K


def modal(nodes, elements, ni: NodeInputs, ei: ElementInputs,
          n_modes: int = 0) -> ModalOutputs:
    nodes = np.asarray(nodes, dtype=float)
    n_nodes = nodes.shape[0]
    dof = n_nodes * 6

    K = assemble_global_K(nodes, elements, ei, dof)
    M = get_global_mass_matrix(nodes, elements, ei, dof)

    free = set(get_free_indices(ni, dof))
    zeros = set(get_zero_indices(K)) | set(get_zero_indices(M))
    red_idx = sorted(free - zeros)
    if not red_idx:
        return ModalOutputs()

    Kr = reduce_matrix(K, red_idx).toarray()
    Mr = reduce_matrix(M, red_idx).toarray()

    # K simétrica positiva semidefinida; M es lumped diagonal positiva.
    # Eigen generalizado: scipy.linalg.eigh con (Kr, Mr).
    eigvals, eigvecs = la.eigh(Kr, Mr)
    # Filtrar modos válidos (omega^2 > tol)
    freqs = []
    valid_idx = []
    for i, w2 in enumerate(eigvals):
        if w2 > 1e-10:
            freqs.append(np.sqrt(w2) / (2.0 * np.pi))
            valid_idx.append(i)
            if n_modes > 0 and len(freqs) >= n_modes:
                break
    if not freqs:
        return ModalOutputs()

    n_val = len(freqs)
    # Reconstruir mode shapes en DOF completo (n_val, dof)
    modes_full = np.zeros((n_val, dof))
    for m, idx in enumerate(valid_idx):
        phi_full = np.zeros(dof)
        for k, gd in enumerate(red_idx):
            phi_full[gd] = eigvecs[k, idx]
        maxv = np.max(np.abs(phi_full))
        if maxv > 1e-15:
            phi_full /= maxv
        modes_full[m, :] = phi_full

    # Mass participation factors (ux, uy, uz, rx, ry, rz)
    # Centro de masa a partir de M_global diagonal (DOF Ux por nodo)
    M_diag = M.diagonal()
    sum_m = 0.0; sum_mx = 0.0; sum_my = 0.0
    for i in range(n_nodes):
        mi = M_diag[i * 6]
        sum_m  += mi
        sum_mx += mi * nodes[i, 0]
        sum_my += mi * nodes[i, 1]
    x_cm = sum_mx / sum_m if sum_m > 1e-30 else 0.0
    y_cm = sum_my / sum_m if sum_m > 1e-30 else 0.0

    r_full = [np.zeros(dof) for _ in range(6)]
    for i in range(n_nodes):
        r_full[0][i*6 + 0] = 1.0
        r_full[1][i*6 + 1] = 1.0
        r_full[2][i*6 + 2] = 1.0
        r_full[3][i*6 + 3] = 1.0
        r_full[4][i*6 + 4] = 1.0
        # Rz: rotación rígida sobre CM
        r_full[5][i*6 + 0] = -(nodes[i, 1] - y_cm)
        r_full[5][i*6 + 1] = +(nodes[i, 0] - x_cm)
        r_full[5][i*6 + 5] = 1.0

    r_red = [r_full[j][red_idx] for j in range(6)]
    M_total = [float(r.T @ (Mr @ r)) for r in r_red]

    participation = np.zeros((n_val, 6))
    for m, idx in enumerate(valid_idx):
        phi_r = eigvecs[:, idx]
        M_gen = float(phi_r.T @ (Mr @ phi_r))
        if M_gen < 1e-30:
            continue
        for j in range(6):
            if M_total[j] < 1e-30:
                continue
            Gamma = float(phi_r.T @ (Mr @ r_red[j]))
            M_eff = (Gamma * Gamma) / M_gen
            participation[m, j] = M_eff / M_total[j]

    out = ModalOutputs()
    out.frequencies = np.array(freqs)
    out.modeShapes = modes_full
    out.massParticipation = participation
    return out
