"""Helpers FE: índices libres, vector de fuerzas, matriz reducida."""

from typing import List, Sequence
import numpy as np
import scipy.sparse as sp

from ..data_model import NodeInputs


def get_forces(node_inputs: NodeInputs, dof: int) -> np.ndarray:
    F = np.zeros(dof)
    for node_index, load_vec in node_inputs.loads.items():
        if len(load_vec) == 6:
            for i in range(6):
                F[node_index * 6 + i] = load_vec[i]
    return F


def get_free_indices(node_inputs: NodeInputs, dof: int) -> List[int]:
    is_fixed = np.zeros(dof, dtype=bool)
    for node_index, flags in node_inputs.supports.items():
        if len(flags) == 6:
            for i in range(6):
                if flags[i]:
                    is_fixed[node_index * 6 + i] = True
    return [i for i in range(dof) if not is_fixed[i]]


def get_zero_indices(K: sp.spmatrix, tol: float = 1e-12) -> List[int]:
    """Filas/columnas que son cero (DOFs sin contribución, e.g. rotaciones libres
    de truss). Mirar primero diagonal (rápido), luego confirmar la columna."""
    A = K.tocsc()
    n = A.shape[0]
    zero_idx = []
    diag = A.diagonal()
    for i in range(n):
        if abs(diag[i]) < tol:
            col = A[:, i].toarray().ravel()
            if np.all(np.abs(col) < tol):
                zero_idx.append(i)
    return zero_idx


def reduce_matrix(K: sp.spmatrix, idx: Sequence[int]) -> sp.csr_matrix:
    idx = np.asarray(idx, dtype=np.int64)
    A = K.tocsr()
    return A[idx, :][:, idx]


def reduce_vector(v: np.ndarray, idx: Sequence[int]) -> np.ndarray:
    return v[np.asarray(idx, dtype=np.int64)]
