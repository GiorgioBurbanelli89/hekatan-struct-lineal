"""Static + Modal solver — espejo de awatif v2 deform/analyze/modalAnalysis.

API espejo del JS:
    deform(nodes, elements, nodeInputs, elementInputs) → DeformOutputs
    analyze(nodes, elements, elementInputs, deformOutputs) → AnalyzeOutputs
    modalAnalysis(nodes, elements, nodeInputs, elementInputs, nModes) → ModalOutputs
"""
from __future__ import annotations
from typing import Sequence
import numpy as np
import scipy.linalg as la

from .data_model import (
    Node, Element, NodeInputs, ElementInputs,
    DeformOutputs, AnalyzeOutputs, ModalOutputs,
)
from .elements.frame import (
    frame_local_axes_csi, frame_stiffness_local, frame_T, rigid_arm_transform,
    frame_releases_condense, frame_fixed_end_loads,
    frame_partial_fixity, frame_rigid_offset_matrix,
    frame_stiffness_end_offsets, frame_end_offset_matrix,
    frame_self_weight_length,
)
from .elements.shell import shell_q4_stiffness, shell_q4_local_axes, shell_q4_T
from .elements.shell_q4_motor import shell_q4_motor
from .elements.shell_thin import shell_thin_motor
from .elements.plate_mzc import mzc_plate_stiffness, mzc_to_shell_q4_24

# Global flag — usar MZC Kirchhoff (= ETABS Shell-Thin) en vez de Mindlin Q4
USE_KIRCHHOFF_MZC = False

# Q4 del MOTOR (membrana Q6 con modos incompatibles + MITC4 + Hughes-Brezzi),
# port fiel de shellQ4.ts. El Q4 "de libro" de shell.py se queda rigido en
# MEMBRANA — que es como trabaja un muro — porque cuatro nudos bilineales no
# describen una curvatura en su plano. Medido en el edificio losa+muro: con el
# Q4 viejo, Python salia 1.83x mas rigido que ETABS.
USE_Q4_MOTOR = True

# ShellType Membrane de ETABS: solo trabajo EN EL PLANO, cero flexion.
USE_SOLO_MEMBRANA = False


# ═══════════════════════════════════════════════════════════════════════════
# Helpers internos
# ═══════════════════════════════════════════════════════════════════════════
def _is_frame(conn: Element) -> bool:
    return len(conn) == 2


def _is_shell(conn: Element) -> bool:
    return len(conn) == 4


def _is_solid(conn: Element) -> bool:
    return len(conn) == 8


def _solid_k_dofs(nodes, conn, element_inputs, idx):
    """K global (24×24) del H8 y sus GDL: solo las 3 traslaciones de cada nudo."""
    from .elements.hex8 import hex8_stiffness
    coords = [nodes[i] for i in conn]
    E = element_inputs.elasticities.get(idx, 0.0)
    nu = element_inputs.poissons_ratios.get(idx, 0.2)
    K, _ = hex8_stiffness(coords, E, nu, getattr(element_inputs, "solid_incompatible", True))
    d = np.concatenate([np.arange(6 * n_idx, 6 * n_idx + 3) for n_idx in conn])
    return K, d


def _frame_k_local_T(
    nodes: Sequence[Node],
    conn: Element,
    element_inputs: ElementInputs,
    idx: int,
) -> tuple[np.ndarray, np.ndarray]:
    """K local (12×12) y T (local→global) de UNA barra. Fuente única.

    Antes esto estaba duplicado en _assemble_K y en analyze(), y las dos copias
    se fueron separando. Los esfuerzos hay que recuperarlos con la MISMA matriz
    con la que se armó el sistema, o se leen fuerzas de otro modelo.
    """
    i, j = conn
    p_i = np.asarray(nodes[i], dtype=float)
    p_j = np.asarray(nodes[j], dtype=float)
    ang = element_inputs.local_angles.get(idx, 0.0)
    e1, e2, e3, L = frame_local_axes_csi(p_i, p_j, ang)
    E = element_inputs.elasticities[idx]
    nu = element_inputs.poissons_ratios.get(idx, 0.2)
    G = element_inputs.shear_moduli.get(idx, E / (2 * (1 + nu)))
    A = element_inputs.areas[idx]
    Iy = element_inputs.moments_of_inertia_y[idx]
    Iz = element_inputs.moments_of_inertia_z[idx]
    J = element_inputs.torsional_constants[idx]
    As_z = element_inputs.shear_areas_z.get(idx, 0.0)
    As_y = element_inputs.shear_areas_y.get(idx, 0.0)
    # END LENGTH OFFSETS de CSI (`endoffset` del .heks). Con rz = 0 —el defecto
    # de ETABS— `frame_stiffness_end_offsets` devuelve la barra de siempre.
    eo = element_inputs.end_offsets.get(idx)
    if eo and (eo[0] > 0 or eo[1] > 0) and eo[2] > 0:
        k_loc, lr_i, lr_j, _Lf = frame_stiffness_end_offsets(
            E, G, A, Iz, Iy, J, L, eo[0], eo[1], eo[2], As_z=As_z, As_y=As_y)
    else:
        k_loc = frame_stiffness_local(E, G, A, Iz, Iy, J, L, As_z=As_z, As_y=As_y)
        lr_i = lr_j = 0.0
    # Orden del motor TS: muelles -> releases. Al reves, la condensacion del
    # release se traga el muelle.
    spr = element_inputs.partial_fixity_springs.get(idx)
    if spr:
        k_loc = frame_partial_fixity(k_loc, spr)
    rel = element_inputs.moment_releases.get(idx)
    if rel:
        k_loc = frame_releases_condense(k_loc, rel)
    # El brazo rígido del end length offset: los extremos flexibles cuelgan de
    # los nudos. Va DESPUÉS de releases, como en ETABS: el release está en el
    # extremo del tramo flexible, no en el nudo.
    if lr_i > 0 or lr_j > 0:
        Reo = frame_end_offset_matrix(lr_i, lr_j)
        k_loc = Reo.T @ k_loc @ Reo
    # Brazos rigidos: factores (0-1) de la longitud, uno por extremo.
    off = element_inputs.rigid_offsets.get(idx)
    if off and (off[0] > 0 or off[1] > 0):
        R = frame_rigid_offset_matrix(off[0] * L, off[1] * L)
        k_loc = R.T @ k_loc @ R
    # Rigid arm vía insertion_points (cardinal points). Si está, aplica.
    ins = element_inputs.insertion_points.get(idx)
    if ins is not None:
        dy, dz = ins
        r_loc = np.array([0.0, dy, dz])
        T_arm = rigid_arm_transform(r_loc, r_loc)
        k_loc = T_arm.T @ k_loc @ T_arm
    return k_loc, frame_T(e1, e2, e3)


def _shell_k_global(
    nodes: Sequence[Node],
    conn: Element,
    element_inputs: ElementInputs,
    idx: int,
) -> np.ndarray:
    """K del shell Q4 EN GLOBALES: se arma en el plano del paño y se gira.

    Antes se usaban las X,Y globales directamente, lo que obligaba a que el
    paño fuese horizontal. Un muro (plano XZ) daba jacobiano nulo.
    """
    p3 = np.array([nodes[n_idx] for n_idx in conn], dtype=float)
    R, xy = shell_q4_local_axes(p3)
    E = element_inputs.elasticities[idx]
    nu = element_inputs.poissons_ratios.get(idx, 0.2)
    t = element_inputs.thicknesses[idx]
    if USE_KIRCHHOFF_MZC:
        k_loc = shell_q4_stiffness(xy, E, nu, t,
                                   include_membrane=True, include_bending=False)
        k_loc = k_loc + mzc_to_shell_q4_24(mzc_plate_stiffness(xy, E, nu, t))
    elif USE_Q4_MOTOR:
        # Dispatch Thin/Thick por elemento, igual que
        # `getLocalStiffnessMatrix.cpp`: plate_formulations == 1 -> Kirchhoff.
        motor = (shell_thin_motor
                 if element_inputs.plate_formulations.get(idx) == 1
                 else shell_q4_motor)
        extra = {} if motor is shell_thin_motor else {
            "solo_membrana": USE_SOLO_MEMBRANA}
        k_loc = motor(
            xy, E, nu, t,
            mod_membrana=element_inputs.membrane_modifiers.get(idx, 1.0),
            mod_flexion=element_inputs.bending_modifiers.get(idx, 1.0),
            mod_dir=element_inputs.shell_modifiers.get(idx),
            **extra,
        )
    else:
        k_loc = shell_q4_stiffness(xy, E, nu, t)
    T = shell_q4_T(R)              # global -> local
    return T.T @ k_loc @ T


def _element_k_dofs(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
):
    """Genera (k_global, gdl) de cada elemento. El ensamble es el `ADDSTF` de
    SAP IV: nada mas que sumar cada casilla del elemento en su sitio global."""
    for idx, conn in enumerate(elements):
        if _is_frame(conn):
            i, j = conn
            k_loc, T = _frame_k_local_T(nodes, conn, element_inputs, idx)
            yield T @ k_loc @ T.T, np.r_[6*i:6*i+6, 6*j:6*j+6]
        elif _is_shell(conn):
            k_glob = _shell_k_global(nodes, conn, element_inputs, idx)
            yield k_glob, np.concatenate([np.arange(6*n_idx, 6*n_idx+6)
                                          for n_idx in conn])
        elif _is_solid(conn):
            yield _solid_k_dofs(nodes, conn, element_inputs, idx)


def _assemble_K_sparse(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
):
    """K en formato disperso (CSR). Es el camino de `sesol.for`: la K de un
    portico es casi toda ceros — 723 barras sobre 2268 GDL llenan el 1.5 % —
    y guardarla entera cuesta el cuadrado de los nudos. Con 5000 nudos la
    densa son 7 GB y no hay modelo que correr."""
    from scipy.sparse import coo_matrix

    n6 = 6 * len(nodes)
    filas, cols, vals = [], [], []
    for k_glob, d in _element_k_dofs(nodes, elements, element_inputs):
        m = len(d)
        filas.append(np.repeat(d, m))
        cols.append(np.tile(d, m))
        vals.append(np.asarray(k_glob).ravel())
    if not vals:
        return coo_matrix((n6, n6)).tocsr()
    return coo_matrix((np.concatenate(vals),
                       (np.concatenate(filas), np.concatenate(cols))),
                      shape=(n6, n6)).tocsr()


def _assemble_K(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
) -> np.ndarray:
    n = len(nodes)
    K = np.zeros((6 * n, 6 * n))
    for idx, conn in enumerate(elements):
        if _is_frame(conn):
            i, j = conn
            k_loc, T = _frame_k_local_T(nodes, conn, element_inputs, idx)
            k_glob = T @ k_loc @ T.T
            d = np.r_[6*i:6*i+6, 6*j:6*j+6]
            K[np.ix_(d, d)] += k_glob
        elif _is_shell(conn):
            # MISMO camino que el disperso: en el plano del paño y luego girado
            k_glob = _shell_k_global(nodes, conn, element_inputs, idx)
            d = np.concatenate([np.arange(6*n_idx, 6*n_idx+6) for n_idx in conn])
            K[np.ix_(d, d)] += k_glob
        elif _is_solid(conn):
            k_glob, d = _solid_k_dofs(nodes, conn, element_inputs, idx)
            K[np.ix_(d, d)] += k_glob
    return K


def _assemble_F(nodes: Sequence[Node], node_inputs: NodeInputs,
                elements: Sequence[Element] | None = None,
                element_inputs: ElementInputs | None = None) -> np.ndarray:
    n = len(nodes)
    F = np.zeros(6 * n)
    for node_idx, load in node_inputs.loads.items():
        for d, v in enumerate(load):
            F[6 * node_idx + d] += v
    # Carga repartida de barra -> fuerzas de empotramiento nodales CONSISTENTES
    if elements is not None and element_inputs is not None and element_inputs.frame_loads:
        for idx, w in element_inputs.frame_loads.items():
            if idx >= len(elements):
                continue
            conn = elements[idx]
            if not _is_frame(conn):
                continue
            i, j = conn
            fi, fj = frame_fixed_end_loads(nodes[i], nodes[j], w)
            F[6*i:6*i+6] += fi
            F[6*j:6*j+6] += fj
    return F


def _assemble_M_lumped(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
) -> np.ndarray:
    """Lumped mass diagonal — CSI §4.12 (sin masa rotacional)."""
    n = len(nodes)
    M = np.zeros(6 * n)
    for idx, conn in enumerate(elements):
        rho = element_inputs.densities.get(idx, 0)
        if rho == 0:
            continue
        if _is_frame(conn):
            i, j = conn
            p_i = np.asarray(nodes[i], dtype=float)
            p_j = np.asarray(nodes[j], dtype=float)
            # ETABS pesa la VIGA por su luz libre (offset entero, sin RZ) y la
            # columna/diagonal por la longitud completa. Sin offsets, L.
            eo = element_inputs.end_offsets.get(idx)
            L = (frame_self_weight_length(p_i, p_j, eo[0], eo[1]) if eo
                 else float(np.linalg.norm(p_j - p_i)))
            A = element_inputs.areas[idx]
            m_total = A * L * rho
            for dof in [6*i, 6*i+1, 6*i+2, 6*j, 6*j+1, 6*j+2]:
                M[dof] += m_total / 2
        elif _is_shell(conn):
            # área REAL (no la proyección en planta): un techo inclinado tiene
            # la masa de su chapa, no la de su sombra.
            from .extensions import _area_q4
            area = _area_q4([nodes[n_idx] for n_idx in conn])
            t = element_inputs.thicknesses[idx]
            m_total = area * t * rho
            for n_idx in conn:
                for dof in [6*n_idx, 6*n_idx+1, 6*n_idx+2]:
                    M[dof] += m_total / 4
        elif _is_solid(conn):
            # H8: rho * V (V por Gauss 2x2x2), a partes iguales en los 8 nudos —
            # lo mismo que getGlobalMassMatrix.cpp desde el 3-sep-2026.
            from .elements.hex8 import _dN_nat
            coords = np.asarray([nodes[n_idx] for n_idx in conn], dtype=float)
            g = 0.5773502691896258
            V = 0.0
            for zeta in (-g, g):
                for eta in (-g, g):
                    for xi in (-g, g):
                        V += abs(np.linalg.det(_dN_nat(xi, eta, zeta) @ coords))
            m_total = V * rho
            for n_idx in conn:
                for dof in [6*n_idx, 6*n_idx+1, 6*n_idx+2]:
                    M[dof] += m_total / 8
    return M


def _apply_supports_penalty(
    K: np.ndarray, F: np.ndarray, node_inputs: NodeInputs,
    penalty_factor: float = 1e15,
) -> tuple[np.ndarray, np.ndarray]:
    K = K.copy()
    F = F.copy()
    k_max = np.max(np.abs(np.diag(K))) if K.size else 1.0
    penalty = penalty_factor * k_max
    for node_idx, restraints in node_inputs.supports.items():
        for dof_local, r in enumerate(restraints):
            if r:
                gdof = 6 * node_idx + dof_local
                K[gdof, gdof] += penalty
                F[gdof] = 0
    return K, F


def _con_rigidez(K, gdl: np.ndarray, tol: float = 1e-12) -> np.ndarray:
    """Máscara de los GDL que SÍ tienen rigidez. Port de `getZerosIndices`.

    Un GDL con la diagonal a cero **y la columna entera a cero** no está en
    ninguna matriz de elemento: su ecuación es `0 = F`. Dejarlo dentro hace
    singular al sistema entero — no falla ese GDL, fallan los 609 nudos. Se
    saca y se queda en 0, que es lo que hace `deform.cpp` antes de factorizar.

    ⚠️ Las dos condiciones, no solo la diagonal: un GDL con diagonal nula pero
    columna no nula SÍ participa (aparece acoplado) y sacarlo sería empotrarlo.
    """
    if gdl.size == 0:
        return np.zeros(0, dtype=bool)
    if hasattr(K, "tocsc"):
        Kc = K.tocsc()
        diag = np.abs(Kc.diagonal()[gdl])
        col = np.zeros(gdl.size, dtype=bool)
        sospechosos = np.where(diag < tol)[0]
        for i in sospechosos:
            c = Kc[:, gdl[i]]
            col[i] = c.nnz == 0 or np.abs(c.data).max() < tol
    else:
        diag = np.abs(np.asarray(K)[gdl, gdl])
        col = np.zeros(gdl.size, dtype=bool)
        sospechosos = np.where(diag < tol)[0]
        for i in sospechosos:
            col[i] = np.abs(np.asarray(K)[:, gdl[i]]).max() < tol
    return ~((diag < tol) & col)


# ═══════════════════════════════════════════════════════════════════════════
# Public API
# ═══════════════════════════════════════════════════════════════════════════
def etabs_wall_joint_penalties(nodes, elements, element_inputs):
    """Los vectores de la penalizacion viga-muro de ETABS: lista de (c, {gdl: coef}).

    Medido en ETABS 22 (galpon-bodega-electoral/drilling_min*.py, 2-sep-2026):
    en cada nudo de una cascara VERTICAL (muro) al que llega una barra, y por
    cada elemento de muro que contiene el nudo, ETABS suma c*v v^T con
        v = (w_h - w_n) - theta_n * ((p_h - p_n) . e1)
        c = E*t*(H/L)^3 / 32
    donde e1 es la arista HORIZONTAL del elemento que sale del nudo (L su
    longitud), h el nudo vecino por esa arista, H la altura del elemento, w el
    desplazamiento VERTICAL (en el plano del muro) y theta el giro alrededor de
    la normal del muro. Es "colgar" el vecino del nudo como solido rigido con un
    muelle c: ata el drilling al giro de la arista. Reproduce el drilling-dof
    (2 muros + viga de acople) a 2e-6 % en los 92 nudos. Las losas
    horizontales NO lo llevan (medido: Delta = 0 con Slab y con Wall).
    """
    P = np.asarray(nodes, float)
    con_barra = set()
    for e in elements:
        if len(e) == 2:
            con_barra.update(e)
    out = []
    for k, e in enumerate(elements):
        if len(e) != 4 or not (set(e) & con_barra):
            continue
        Q = P[list(e)]
        nrm = np.cross(Q[2] - Q[0], Q[3] - Q[1])
        if np.linalg.norm(nrm) < 1e-12:
            continue
        nrm /= np.linalg.norm(nrm)
        if abs(nrm[2]) > 1e-6:          # no es vertical: no es un muro
            continue
        E = element_inputs.elasticities.get(k, 0.0)
        t = element_inputs.thicknesses.get(k, 0.0)
        if not E or not t:
            continue
        for a, nd in enumerate(e):
            if nd not in con_barra:
                continue
            # vecinos por las dos aristas que salen del nudo
            prev_, next_ = e[(a - 1) % 4], e[(a + 1) % 4]
            cand = []
            for h in (prev_, next_):
                d = P[h] - P[nd]
                cand.append((abs(d[2]) / max(np.linalg.norm(d), 1e-12), h))
            cand.sort()                 # la mas horizontal primero
            h = cand[0][1]
            hv = cand[1][1]
            d = P[h] - P[nd]; L = np.linalg.norm(d)
            H = np.linalg.norm(P[hv] - P[nd])
            if L < 1e-12 or H < 1e-12:
                continue
            e1 = d / L
            # e2 = la transversal EN EL PLANO (nrm x e1): el signo del acople
            # w-theta va con la orientacion de la normal; con +z global a secas
            # el termino cruzado salia con el signo cambiado (5.578e-4 en vez
            # de 5.360e-4 en el drilling-dof).
            e2 = np.cross(nrm, e1)
            c = E * t * (H / L) ** 3 / 32.0
            v = {}
            de1 = float(d @ e1)
            for comp in range(3):
                if abs(e2[comp]) > 1e-14:
                    v[6 * h + comp] = v.get(6 * h + comp, 0.0) + e2[comp]
                    v[6 * nd + comp] = v.get(6 * nd + comp, 0.0) - e2[comp]
                if abs(nrm[comp]) > 1e-14:
                    v[6 * nd + 3 + comp] = v.get(6 * nd + 3 + comp, 0.0) - de1 * nrm[comp]
            out.append((c, v))
    return out


def _add_etabs_wall_joint(K, nodes, elements, element_inputs, disperso):
    pen = etabs_wall_joint_penalties(nodes, elements, element_inputs)
    if not pen:
        return K
    if disperso:
        from scipy.sparse import coo_matrix
        rows, cols, vals = [], [], []
        for c, v in pen:
            idx = list(v); coef = list(v.values())
            for i, ci in zip(idx, coef):
                for j, cj in zip(idx, coef):
                    rows.append(i); cols.append(j); vals.append(c * ci * cj)
        n = K.shape[0]
        return (K + coo_matrix((vals, (rows, cols)), shape=(n, n))).tocsr()
    for c, v in pen:
        idx = np.array(list(v)); coef = np.array(list(v.values()))
        K[np.ix_(idx, idx)] += c * np.outer(coef, coef)
    return K


def _armar_diafragma(nodes, node_inputs, n_total):
    """T (n_total x n_red) del diafragma rigido: u = T u_red. Maestro VIRTUAL en el
    centro (geometrico) de cada grupo, como utils/rigidDiaphragm.h del C++."""
    from scipy.sparse import coo_matrix
    grupos: dict[int, list[int]] = {}
    for nid, g in getattr(node_inputs, "diaphragms", {}).items():
        if g > 0 and 0 <= nid < len(nodes):
            grupos.setdefault(g, []).append(nid)
    grupos = {g: v for g, v in grupos.items() if len(v) >= 2}
    if not grupos:
        return None, None
    dia_de = {}
    for g, v in grupos.items():
        for nid in v:
            dia_de[nid] = g
    col_de = np.full(n_total, -1, dtype=int)
    nred = 0
    for i in range(len(nodes)):
        for k in range(6):
            if not (i in dia_de and k in (0, 1, 5)):
                col_de[6 * i + k] = nred; nred += 1
    col_m = {}
    for g in grupos:
        col_m[g] = nred; nred += 3
    centro = {g: (float(np.mean([nodes[i][0] for i in v])), float(np.mean([nodes[i][1] for i in v]))) for g, v in grupos.items()}
    rows, cols, vals = [], [], []
    for i in range(len(nodes)):
        g = dia_de.get(i)
        for k in range(6):
            fila = 6 * i + k
            if col_de[fila] >= 0:
                rows.append(fila); cols.append(col_de[fila]); vals.append(1.0); continue
            cm = col_m[g]
            dx = nodes[i][0] - centro[g][0]; dy = nodes[i][1] - centro[g][1]
            if k == 0:
                rows += [fila, fila]; cols += [cm, cm + 2]; vals += [1.0, -dy]
            elif k == 1:
                rows += [fila, fila]; cols += [cm + 1, cm + 2]; vals += [1.0, dx]
            else:
                rows.append(fila); cols.append(cm + 2); vals.append(1.0)
    T = coo_matrix((vals, (rows, cols)), shape=(n_total, nred)).tocsr()
    return T, col_de


def deform(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    node_inputs: NodeInputs,
    element_inputs: ElementInputs,
    *,
    sparse: bool | None = None,
) -> DeformOutputs:
    """Análisis lineal estático. Espejo de awatif v2 deform().

    `sparse`: None = decide por tamaño (disperso a partir de 3000 GDL),
    True/False = forzarlo. Los dos caminos dan el MISMO resultado; solo cambia
    la memoria (la densa crece con el cuadrado de los nudos).

    Los apoyos se imponen ELIMINANDO la ecuación, no con penalty: es lo que hace
    SAP IV (`bound.for` numera con 0 los GDL restringidos y `sesol.for` ni los
    ve). El penalty de 1e15·k_max mete un número enorme en la diagonal y se come
    los dígitos significativos de la fila; con eliminación el sistema resuelto es
    exactamente el de los GDL libres.

    Y además se sacan los GDL **sin rigidez ninguna** (diagonal y columna a
    cero), que se quedan en 0. Es el `getZerosIndices` de `deform.cpp`, y sin
    él el sistema es singular: en `galpon_lc.heks` hay 3 nudos que solo tocan
    cáscaras de zinc declaradas SIN flexión (`shellmod ... 0 0 0 ...`), así que
    sus w, θx y θy no aparecen en ninguna K y el solver devolvía NaN en los
    609 nudos por 9 GDL huérfanos.
    """
    n_total = 6 * len(nodes)
    disperso = sparse if sparse is not None else n_total > 3000
    K_orig = (_assemble_K_sparse(nodes, elements, element_inputs) if disperso
              else _assemble_K(nodes, elements, element_inputs))
    if getattr(element_inputs, "etabs_wall_joint", True):
        K_orig = _add_etabs_wall_joint(K_orig, nodes, elements, element_inputs, disperso)
    F_orig = _assemble_F(nodes, node_inputs, elements, element_inputs)

    # Muelles nodales, a la diagonal y ANTES de tocar apoyos — es lo que hace
    # `deform.cpp`. Van dentro de `node_inputs`, no como argumento suelto: si
    # no, el modal no puede verlos por mucho que el .heks los traiga (la
    # cimentación del RIOCHICO se apoya en 612 muelles de balasto).
    if node_inputs.springs:
        kd = np.zeros(n_total)
        for n_idx, dof_local, k in node_inputs.springs:
            g = 6 * n_idx + dof_local
            if 0 <= g < n_total:
                kd[g] += k
        if disperso:
            # De golpe y como diagonal: `K[g, g] += k` uno a uno sobre una CSR
            # cambia la estructura de dispersion 612 veces (los muelles de
            # balasto del RIOCHICO) y scipy avisa de que eso es carisimo.
            from scipy.sparse import diags
            K_orig = (K_orig + diags(kd)).tocsr()
        else:
            K_orig[np.arange(n_total), np.arange(n_total)] += kd

    # Muelles de AREA: `ks * int N^T N dA` sobre la NORMAL de la cascara (Gauss 2x2, jacobiano
    # real). Dos formas, las dos aqui, espejo de `utils/springsExtra.h` del C++:
    #   · CONSISTENTE (defecto): la matriz entera, que acopla los 4 nudos.
    #   · NODAL (`areaspring ID ks nodal`): solo `ks * int N_i dA` en la diagonal de cada nudo.
    # MEDIDO el 8-sep-2026: SAP2000, ETABS **y SAFE** usan el NODAL (placa flexible: SAFE = nodal
    # a 1.1 %, el consistente se va 23 % en las esquinas). El consistente se queda porque es la
    # forma «de libro» y porque con carga uniforme los dos dan w = q/ks exacto.
    # Antes esto iba solo sobre `uz` global: en una cascara inclinada eso no es el Winkler del
    # terreno. Ahora va sobre la normal, como el C++.
    if getattr(node_inputs, "area_springs", None):
        g2 = 1.0 / np.sqrt(3.0)
        nodal_set = getattr(node_inputs, "area_springs_nodal", set())
        for idx, ks in node_inputs.area_springs.items():
            conn = elements[idx]
            if len(conn) != 4 or ks == 0:
                continue
            P = np.array([nodes[n] for n in conn], float)
            nrm = np.cross(P[2] - P[0], P[3] - P[1])
            ln = np.linalg.norm(nrm)
            nrm = nrm / ln if ln > 1e-30 else np.array([0.0, 0.0, 1.0])
            Ke = np.zeros((4, 4))
            for xi in (-g2, g2):
                for eta in (-g2, g2):
                    N = 0.25 * np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta), (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)])
                    dN_dxi = 0.25 * np.array([-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)])
                    dN_deta = 0.25 * np.array([-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)])
                    detJ = np.linalg.norm(np.cross(dN_dxi @ P, dN_deta @ P))
                    Ke += ks * np.outer(N, N) * detJ
            if idx in nodal_set:                       # concentrado: la fila entera a la diagonal
                Ke = np.diag(Ke.sum(axis=1))
            # de los 4 uz a los 12 GDL de traslacion, proyectando en la normal
            Kt = np.zeros((12, 12))
            for a in range(4):
                for b in range(4):
                    Kt[3 * a:3 * a + 3, 3 * b:3 * b + 3] = Ke[a, b] * np.outer(nrm, nrm)
            gdt = [6 * n + d for n in conn for d in range(3)]
            if disperso:
                from scipy.sparse import lil_matrix
                K_orig = K_orig.tolil()
                for a in range(12):
                    for b in range(12):
                        if Kt[a, b]:
                            K_orig[gdt[a], gdt[b]] += Kt[a, b]
                K_orig = K_orig.tocsr()
            else:
                for a in range(12):
                    for b in range(12):
                        if Kt[a, b]:
                            K_orig[gdt[a], gdt[b]] += Kt[a, b]

    # ── Nudos COLGADOS sobre una arista (`edge etabs`) ──
    # Malla no conforme: el nudo que cae dentro de una arista sin ser vertice se ata a esa arista
    # por PENALIZACION: traslaciones en el plano y giros lineales en t, y la flecha normal por la
    # CUBICA DE HERMITE con los giros de los extremos. Espejo de `springsExtra.h` del C++.
    # ⚠️ NO es lo que hace ETABS: ETABS malla el pano por el nudo (medido 8-sep-2026, tambien con
    # OBJMESHTYPE "NONE"). Es una opcion de malla no conforme, no la replica de ETABS.
    colgados = getattr(node_inputs, "hanging_nodes", None)
    if colgados:
        filas: list[tuple[list[tuple[int, float]], bool]] = []   # (restriccion, es_giro)
        for e_idx, h in colgados:
            conn = list(elements[e_idx])
            P = np.array([nodes[n] for n in conn], float)
            X = np.array(nodes[h], float)
            nrm = np.cross(P[2] - P[0], P[3 % len(conn)] - P[1])
            ln = np.linalg.norm(nrm)
            nrm = nrm / ln if ln > 1e-30 else np.array([0.0, 0.0, 1.0])
            for k in range(len(conn)):
                ia, ib = conn[k], conn[(k + 1) % len(conn)]
                A, B = P[k], P[(k + 1) % len(conn)]
                d = B - A
                L = float(np.linalg.norm(d))
                if L < 1e-12:
                    continue
                t = float((X - A) @ d) / (L * L)
                if t <= 1e-6 or t >= 1 - 1e-6 or np.linalg.norm((X - A) - t * d) > 1e-6 * L:
                    continue
                s = d / L
                # m = s x n (NO n x s): con mano derecha, un giro theta alrededor de m da
                # dw/ds = +theta_m, porque (m x s)·n = +1. Con el signo cambiado la Hermite ata
                # la pendiente al reves: medido el 8-sep-2026 contra el TS/WASM (5.1 % de
                # diferencia) y contra ETABS (0.11 % con +rx, 3.9 % con -rx).
                mvec = np.cross(s, nrm)
                H1 = 1 - 3 * t * t + 2 * t ** 3
                H2 = (t - 2 * t * t + t ** 3) * L
                H3 = 3 * t * t - 2 * t ** 3
                H4 = (-t * t + t ** 3) * L
                for vec in (s, mvec):                       # traslacion en el plano: lineal
                    C = []
                    for p in range(3):
                        if vec[p]:
                            C += [(6 * h + p, vec[p]), (6 * ia + p, -(1 - t) * vec[p]), (6 * ib + p, -t * vec[p])]
                    filas.append((C, False))
                C = []                                       # flecha normal: Hermite
                for p in range(3):
                    if nrm[p]:
                        C += [(6 * h + p, nrm[p]), (6 * ia + p, -H1 * nrm[p]), (6 * ib + p, -H3 * nrm[p])]
                    if mvec[p]:
                        C += [(6 * ia + 3 + p, -H2 * mvec[p]), (6 * ib + 3 + p, -H4 * mvec[p])]
                filas.append((C, False))
                for p in range(3):                           # giros: lineales
                    filas.append(([(6 * h + 3 + p, 1.0), (6 * ia + 3 + p, -(1 - t)), (6 * ib + 3 + p, -t)], True))
                break
        if filas:
            diag = (K_orig.diagonal() if disperso else np.diag(K_orig))
            kT = max(1.0, float(np.max(np.abs(diag))))
            if disperso:
                from scipy.sparse import lil_matrix
                K_orig = K_orig.tolil()
            for C, _es_giro in filas:
                for gi, ci in C:
                    for gj, cj in C:
                        K_orig[gi, gj] += 1e6 * kT * ci * cj
            if disperso:
                K_orig = K_orig.tocsr()

    # ── Diafragma rigido: K y F al espacio reducido, u = T u_red ──
    T_dia, col_de = _armar_diafragma(nodes, node_inputs, n_total)
    K_full, F_full = K_orig, F_orig
    if T_dia is not None:
        from scipy.sparse import csr_matrix
        Ks = K_orig if disperso else csr_matrix(K_orig)
        K_orig = (T_dia.T @ Ks @ T_dia).tocsr()
        if not disperso:
            K_orig = K_orig.toarray()
        F_orig = T_dia.T @ F_orig
        n_red = T_dia.shape[1]
    else:
        n_red = n_total

    fixed = np.zeros(n_red, dtype=bool)
    for node_idx, restraints in node_inputs.supports.items():
        for dof_local, r in enumerate(restraints):
            if r:
                g = 6 * node_idx + dof_local
                c = col_de[g] if T_dia is not None else g
                if c >= 0:
                    fixed[c] = True
    free = np.where(~fixed)[0]
    con_k = _con_rigidez(K_orig, free)
    # Un GDL sin rigidez se queda en 0, como en `deform.cpp`. Pero si ADEMAS
    # lleva carga, esa carga no va a ninguna parte: quitarlo la borraria del
    # modelo sin decirlo, y el resto saldria con numeros de aspecto normal.
    huerfanos_cargados = free[~con_k][np.abs(F_orig[free[~con_k]]) > 1e-12]
    if huerfanos_cargados.size:
        n0 = huerfanos_cargados[0]
        raise np.linalg.LinAlgError(
            f"{huerfanos_cargados.size} GDL sin rigidez llevan carga "
            f"(p.ej. nudo {n0 // 6}, componente {n0 % 6}): la estructura es un "
            "mecanismo por ahi y esa carga no la equilibra nada"
        )
    free = free[con_k]

    U = np.zeros(n_red)
    if free.size:
        if disperso:
            from scipy.sparse.linalg import spsolve
            U[free] = spsolve(K_orig[free][:, free].tocsc(), F_orig[free])
        else:
            U[free] = np.linalg.solve(K_orig[np.ix_(free, free)], F_orig[free])
    if T_dia is not None:
        U = np.asarray(T_dia @ U).ravel()        # de vuelta a los 6 GDL por nudo

    R = K_full @ U - F_full
    out = DeformOutputs()
    for i in range(len(nodes)):
        out.deformations[i] = tuple(U[6*i:6*i+6])  # type: ignore
    for node_idx, restraints in node_inputs.supports.items():
        if any(restraints):
            r = R[6*node_idx:6*node_idx+6]
            out.reactions[node_idx] = (r[0], r[1], r[2], r[3], r[4], r[5])
    return out


def analyze(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
    deform_outputs: DeformOutputs,
) -> AnalyzeOutputs:
    """Recupera esfuerzos internos por elemento. Espejo de awatif v2 analyze()."""
    out = AnalyzeOutputs()
    # Reconstruir U global desde deformations
    n = len(nodes)
    U = np.zeros(6 * n)
    for i, d in deform_outputs.deformations.items():
        U[6*i:6*i+6] = d
    for idx, conn in enumerate(elements):
        if _is_frame(conn):
            i, j = conn
            k_loc, T = _frame_k_local_T(nodes, conn, element_inputs, idx)
            u_global_12 = np.concatenate([U[6*i:6*i+6], U[6*j:6*j+6]])
            u_local = T.T @ u_global_12
            f_local = k_loc @ u_local
            # Carga de vano: f = k·u da solo la parte NODAL. El diagrama real
            # lleva además las fuerzas de empotramiento de la propia barra.
            w = element_inputs.frame_loads.get(idx)
            if w is not None:
                fi, fj = frame_fixed_end_loads(nodes[i], nodes[j], w)
                f_local = f_local - T.T @ np.concatenate([fi, fj])
            # FUERZAS DE EXTREMO crudas (f = k·u + f_empotramiento), sin tocar
            # el signo — es lo que devuelve `analyze.ts` y por tanto lo que
            # espera todo lo que lee este motor. El DIAGRAMA no es esto: en el
            # extremo i el diagrama es el negativo, y contra ETABS hay que
            # emitir M2 con el signo cambiado. Eso se hace al comparar, no aqui.
            # Antes se invertia el extremo J "por convenio CSI": no estaba en el
            # motor, y hacia que los seis campos salieran con el signo cambiado
            # respecto al TS en TODOS los casos (medido con el oraculo).
            out.normals[idx]    = (f_local[0],  f_local[6])
            out.shears_y[idx]   = (f_local[1],  f_local[7])
            out.shears_z[idx]   = (f_local[2],  f_local[8])
            out.torsions[idx]   = (f_local[3],  f_local[9])
            out.bendings_y[idx] = (f_local[4],  f_local[10])
            out.bendings_z[idx] = (f_local[5],  f_local[11])
    return out


def modal_analysis(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    node_inputs: NodeInputs,
    element_inputs: ElementInputs,
    n_modes: int = 12,
    *,
    lumped: bool = True,
) -> ModalOutputs:
    """Modal eigen K - λM. Espejo de awatif v2 modalAnalysis()."""
    K = _assemble_K(nodes, elements, element_inputs)
    if not lumped:
        raise NotImplementedError("Consistent mass not implemented yet")
    M_diag = _assemble_M_lumped(nodes, elements, element_inputs)

    # CSI §4.12: ignora masa en restrained
    restrained = set()
    for node_idx, restraints in node_inputs.supports.items():
        for dof_local, r in enumerate(restraints):
            if r:
                restrained.add(6 * node_idx + dof_local)
    n_total = K.shape[0]
    # ⚠️ Los GDL SIN masa no se BORRAN: se CONDENSAN (Guyan).
    #
    # Antes se hacia `free = [... if M_diag[i] > 0]`, o sea se sacaban del
    # sistema los grados de libertad sin masa — que con masa lumped son TODAS
    # las rotaciones. Sacar un GDL del sistema es lo mismo que EMPOTRARLO, y
    # empotrar todas las rotaciones rigidiza la estructura entera. Medido
    # contra ETABS en un portico 3D con losa: periodos 13-16 % cortos, sin
    # modo TORSIONAL y participacion 0.901 en vez de 1.000, con la masa
    # cuadrando al 0.000 %.
    #
    # Lo correcto es la condensacion estatica: los GDL sin masa no tienen
    # inercia, asi que su ecuacion es K_ss·u_s + K_sm·u_m = 0 y se despejan.
    #     K_red = K_mm − K_ms · K_ss⁻¹ · K_sm
    libres = [i for i in range(n_total) if i not in restrained]
    # Un GDL SIN rigidez ninguna (fila y diagonal a cero: los giros de un nudo que
    # solo toca solidos H8) sale del sistema, como getZerosIndices en modal.cpp;
    # si no, la condensacion de Guyan se traga una Kss singular.
    con_rigidez = np.abs(K).sum(axis=1) > 0
    libres = [i for i in libres if con_rigidez[i]]
    con_masa = [i for i in libres if M_diag[i] > 0]
    sin_masa = [i for i in libres if M_diag[i] <= 0]

    K_ff = K[np.ix_(con_masa, con_masa)]
    if sin_masa:
        Kss = K[np.ix_(sin_masa, sin_masa)]
        Ksm = K[np.ix_(sin_masa, con_masa)]
        K_ff = K_ff - Ksm.T @ np.linalg.solve(Kss, Ksm)
    free = con_masa
    M_ff = np.diag(M_diag[free])
    eigvals, eigvecs = la.eigh(K_ff, M_ff)
    n_modes_actual = min(n_modes, len(eigvals))
    eigvals = np.maximum(eigvals[:n_modes_actual], 1e-12)
    omega = np.sqrt(eigvals)
    freqs = omega / (2 * np.pi)
    periods = 2 * np.pi / omega

    # Reconstruct full mode shapes
    mode_shapes = np.zeros((n_total, n_modes_actual))
    for m in range(n_modes_actual):
        mode_shapes[free, m] = eigvecs[:, m]

    # MPF
    mpf = np.zeros((n_modes_actual, 6))
    # Vectores de influencia. Los tres primeros son traslacion rigida. El de
    # Rz es un GIRO rigido alrededor del centro de masa: ux = −(y−ycm),
    # uy = +(x−xcm). Sin el no hay participacion torsional y el modo de
    # torsion, que en un edificio es el tercero, parece no existir.
    xy = np.array([[nodes[i][0], nodes[i][1]] for i in range(len(nodes))], float)
    mt = M_diag[0::6]
    m_sum = mt.sum()
    if m_sum > 1e-12:
        cm = (mt[:, None] * xy).sum(axis=0) / m_sum
    else:
        cm = xy.mean(axis=0)
    dx = xy[:, 0] - cm[0]
    dy = xy[:, 1] - cm[1]

    vectores = []
    for d in range(3):
        r = np.zeros(n_total)
        r[d::6] = 1.0
        vectores.append((d, r, np.sum(M_diag[d::6])))
    r_rz = np.zeros(n_total)
    r_rz[0::6] = -dy
    r_rz[1::6] = dx
    m_rz = float(np.sum(M_diag[0::6] * dy ** 2 + M_diag[1::6] * dx ** 2))
    vectores.append((5, r_rz, m_rz))

    for d, r, M_total in vectores:
        for m in range(n_modes_actual):
            phi = mode_shapes[:, m]
            num = np.sum(M_diag * r * phi) ** 2
            denom = np.sum(M_diag * phi * phi) * M_total
            mpf[m, d] = num / denom if denom > 1e-12 else 0

    return ModalOutputs(
        frequencies=freqs.tolist(),
        periods=periods.tolist(),
        omega=omega.tolist(),
        mode_shapes=mode_shapes.T.tolist(),  # [mode_idx][dof_idx]
        mass_participation=mpf.tolist(),
    )
