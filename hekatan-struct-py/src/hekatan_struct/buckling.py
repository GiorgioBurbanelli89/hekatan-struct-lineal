"""Pandeo lineal (Linear Buckling Analysis) como SAP2000.

CSI Analysis Reference Manual, cap. XVIII «Linear Buckling Analysis»:
    [K − λ·G(r)]·Ψ = 0
K = rigidez, G(r) = rigidez geométrica (P-delta) debida al vector de cargas r, λ = factor de pandeo.

Cap. XXII «P-Delta Forces in the Frame Element»: la deformada transversal se supone CÚBICA por flexión
y LINEAL por cortante; la fuerza axial P-delta es CONSTANTE en la barra (el PROMEDIO de los dos extremos)
y sale de los desplazamientos del estático de r.

La matriz geométrica de cada plano se OBTIENE de esa deformada (no se copia de una tabla): con los
4 GDL de un plano se arma el campo de Timoshenko homogéneo (v cúbica, γ constante) y se integra
    G = P · ∫ N'ᵀ N' dx
con la pendiente TOTAL v' (`pendiente="total"`) o solo la de flexión θ (`pendiente="flexion"`), para
decidir contra SAP2000 cuál usa.
"""
from __future__ import annotations
import numpy as np
from scipy.linalg import eigh

from .solver import _assemble_K, _frame_k_local_T, _is_frame, deform, analyze


def _campo_plano(L: float, EI: float, GAs: float):
    """Coeficientes de v(x) = a0 + a1 x + a2 x² + a3 x³ para cada uno de los 4 GDL [v1, θ1, v2, θ2].
    Timoshenko homogéneo: θ = v' + (EI/GAs)·v''' (γ = v' − θ constante)."""
    c = EI / GAs if GAs > 0 else 0.0
    # filas: v(0), θ(0), v(L), θ(L) en función de a0..a3
    A = np.array([[1, 0, 0, 0],
                  [0, 1, 0, 6 * c],
                  [1, L, L * L, L ** 3],
                  [0, 1, 2 * L, 3 * L * L + 6 * c]], dtype=float)
    return np.linalg.inv(A), c   # columna k = coeficientes para el GDL k unitario


def g_plano(L: float, EI: float, GAs: float, P: float, pendiente: str = "total") -> np.ndarray:
    """4×4 geométrica de un plano, GDL [v1, θ1, v2, θ2] (θ = giro de la sección, sentido de dv/dx)."""
    C, c = _campo_plano(L, EI, GAs)
    xg, wg = np.polynomial.legendre.leggauss(4)
    G = np.zeros((4, 4))
    for xi, wi in zip(xg, wg):
        x = L * (xi + 1) / 2
        dv = np.array([0, 1, 2 * x, 3 * x * x]) @ C           # v'(x) por GDL
        if pendiente == "flexion":
            dv = dv + np.array([0, 0, 0, 6 * c]) @ C          # θ = v' + c·v'''
        G += wi * L / 2 * np.outer(dv, dv)
    return P * G


def g_barra_local(L, E, G_, Iz, Iy, As_z, As_y, P, pendiente="total") -> np.ndarray:
    """12×12 en ejes locales de CSI [u1 u2 u3 r1 r2 r3]_I [..]_J. P > 0 tracción."""
    Gm = np.zeros((12, 12))
    # plano 1-2: v = u2, θ = +r3
    g = g_plano(L, E * Iz, G_ * As_z, P, pendiente)
    idx = [1, 5, 7, 11]
    for a in range(4):
        for b in range(4): Gm[idx[a], idx[b]] += g[a, b]
    # plano 1-3: w = u3, θ = dw/dx = −r2
    g = g_plano(L, E * Iy, G_ * As_y, P, pendiente)
    idx, s = [2, 4, 8, 10], [1, -1, 1, -1]
    for a in range(4):
        for b in range(4): Gm[idx[a], idx[b]] += s[a] * s[b] * g[a, b]
    return Gm


def pandeo(nodes, elements, node_inputs, element_inputs, n_modos: int = 6, pendiente: str = "total",
           cortante: bool = True):
    """Factores de pandeo λ (ordenados por |λ|) y modos, para las cargas de node_inputs (el vector r)."""
    d = deform(nodes, elements, node_inputs, element_inputs, sparse=False)
    a = analyze(nodes, elements, element_inputs, d)
    n = len(nodes); K = _assemble_K(nodes, elements, element_inputs)
    K = K.toarray() if hasattr(K, "toarray") else np.asarray(K)
    Gg = np.zeros((6 * n, 6 * n))
    for e, conn in enumerate(elements):
        if not _is_frame(conn): continue
        i, j = conn
        Pi, Pj = a.normals[e]
        P = (-Pi + Pj) / 2      # fuerzas de extremo f = k·u: tracción = −f_I = +f_J
        _k, T = _frame_k_local_T(nodes, conn, element_inputs, e)
        E = element_inputs.elasticities[e]; nu = element_inputs.poissons_ratios.get(e, 0.2)
        G_ = element_inputs.shear_moduli.get(e, E / (2 * (1 + nu)))
        A = element_inputs.areas[e]
        As_z = element_inputs.shear_areas_z.get(e, 0.0) or 5 / 6 * A
        As_y = element_inputs.shear_areas_y.get(e, 0.0) or 5 / 6 * A
        if not cortante: As_z = As_y = 0.0
        L = float(np.linalg.norm(np.asarray(nodes[j], float) - np.asarray(nodes[i], float)))
        gl = g_barra_local(L, E, G_, element_inputs.moments_of_inertia_z[e], element_inputs.moments_of_inertia_y[e],
                           As_z, As_y, P, pendiente)
        gg = T @ gl @ T.T
        dofs = list(range(6 * i, 6 * i + 6)) + list(range(6 * j, 6 * j + 6))
        Gg[np.ix_(dofs, dofs)] += gg
    # GDL libres = no apoyados y con rigidez
    fijo = np.zeros(6 * n, bool)
    for k, s in node_inputs.supports.items():
        for c in range(6):
            if s[c]: fijo[6 * k + c] = True
    libre = np.where(~fijo & (np.abs(np.diag(K)) > 1e-12 * np.abs(np.diag(K)).max()))[0]
    Kf, Gf = K[np.ix_(libre, libre)], Gg[np.ix_(libre, libre)]
    # K·Ψ = λ·(−G)·Ψ  (con G de compresión negativa)  →  (−G)Ψ = μ K Ψ, μ = 1/λ
    mu, V = eigh(-Gf, Kf)
    orden = np.argsort(-np.abs(mu))
    lam = [1 / mu[k] for k in orden[:n_modos] if abs(mu[k]) > 1e-14]
    modos = []
    for k in orden[:n_modos]:
        m = np.zeros(6 * n); m[libre] = V[:, k]; modos.append(m)
    return np.array(lam), modos
