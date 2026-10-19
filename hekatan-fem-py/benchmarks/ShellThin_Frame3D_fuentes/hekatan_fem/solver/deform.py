"""deform() — solver lineal estatico K·u = F.

Mirror del workflow de deform.cpp + test_mesa_torsion_5x3_separated_cpp.cpp.
Soporta Winkler nodal vía argumento `springs` (lista de (node, dof, k)).
"""

from typing import Iterable, List, Optional, Sequence, Tuple
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

from ..data_model import NodeInputs, ElementInputs, DeformOutputs
from ..utils.fe_helpers import get_forces, get_free_indices, reduce_matrix
from ..utils.local_stiffness import get_local_stiffness
from ..utils.transformation import get_transformation_matrix


# ─────────────────────────────────────────────────────────────────────────────
# Ensamble global de K (sparse)
# ─────────────────────────────────────────────────────────────────────────────

def assemble_global_K(nodes: np.ndarray, elements: Sequence[Sequence[int]],
                      ei: ElementInputs, dof: int) -> sp.csr_matrix:
    rows = []; cols = []; data = []
    for e_idx, elm in enumerate(elements):
        elm_nodes = [nodes[i] for i in elm]
        kL = get_local_stiffness(elm_nodes, ei, e_idx)
        T  = get_transformation_matrix(elm_nodes)
        kG = T.T @ kL @ T
        n_el = len(elm)
        for li in range(6 * n_el):
            gi = elm[li // 6] * 6 + li % 6
            for lj in range(6 * n_el):
                gj = elm[lj // 6] * 6 + lj % 6
                v = kG[li, lj]
                if abs(v) > 1e-18:
                    rows.append(gi); cols.append(gj); data.append(v)
    K = sp.csr_matrix((data, (rows, cols)), shape=(dof, dof))
    K.sum_duplicates()
    return K


def _apply_edge_constraints(K, F, edge_constraints, dof):
    """Apply MPC edge constraints (ETABS-style linear interpolation).

    edge_constraints: list of (slave_node, master_A, master_B, xi)
        where xi is the fraction along edge A→B (0=at A, 1=at B).
        All 6 DOFs of slave are constrained: u_slave = (1-xi)*u_A + xi*u_B.

    Uses penalty method: for each slave DOF g, add large stiffness
    coupling slave to masters:
        K[g,g] += alpha
        K[g,gA] -= alpha*(1-xi)
        K[gA,g] -= alpha*(1-xi)
        K[gA,gA] += alpha*(1-xi)^2
        K[g,gB] -= alpha*xi
        K[gB,g] -= alpha*xi
        K[gB,gB] += alpha*xi^2
        K[gA,gB] += alpha*(1-xi)*xi
        K[gB,gA] += alpha*(1-xi)*xi

    alpha = penalty factor (large, ~1e10 * max(diag(K)))
    """
    K = K.tolil()
    diag_max = abs(K.diagonal()).max()
    alpha = 1e10 * max(diag_max, 1.0)

    for (slave, masterA, masterB, xi) in edge_constraints:
        w_a = 1.0 - xi
        w_b = xi
        for d in range(6):
            gs = slave * 6 + d
            ga = masterA * 6 + d
            gb = masterB * 6 + d
            if gs >= dof or ga >= dof or gb >= dof:
                continue
            K[gs, gs] += alpha
            K[gs, ga] -= alpha * w_a
            K[ga, gs] -= alpha * w_a
            K[ga, ga] += alpha * w_a * w_a
            K[gs, gb] -= alpha * w_b
            K[gb, gs] -= alpha * w_b
            K[gb, gb] += alpha * w_b * w_b
            K[ga, gb] += alpha * w_a * w_b
            K[gb, ga] += alpha * w_a * w_b
            # RHS: slave DOF force redistributed to masters
            fs = F[gs]
            F[gs] = 0.0
            F[ga] += fs * w_a
            F[gb] += fs * w_b

    return K.tocsr(), F


def detect_edge_constraints(nodes, elements):
    """Auto-detect edge constraints: find intermediate nodes on shell edges.

    For each 4-node shell element, check if any other node lies on an edge
    (within tolerance). If so, create an MPC: slave=intermediate, masters=edge corners.

    Returns: list of (slave_node, master_A, master_B, xi)
    """
    nodes = np.asarray(nodes, dtype=float)
    tol = 1e-6
    constraints = []
    seen_slaves = set()

    # Collect all shell element edges
    shell_edges = []
    for e_idx, elm in enumerate(elements):
        if len(elm) != 4:
            continue
        for i in range(4):
            nA = elm[i]
            nB = elm[(i + 1) % 4]
            shell_edges.append((nA, nB, e_idx))

    # For each edge, check if any node lies on it (not a corner)
    all_nodes_set = set(range(len(nodes)))
    for (nA, nB, e_idx) in shell_edges:
        pA = nodes[nA]
        pB = nodes[nB]
        edge_vec = pB - pA
        edge_len = np.linalg.norm(edge_vec)
        if edge_len < tol:
            continue
        edge_dir = edge_vec / edge_len

        for n in all_nodes_set:
            if n == nA or n == nB or n in seen_slaves:
                continue
            pN = nodes[n]
            v = pN - pA
            proj = np.dot(v, edge_dir)
            if proj < tol or proj > edge_len - tol:
                continue
            # Distance from point to edge line
            perp = v - proj * edge_dir
            dist = np.linalg.norm(perp)
            if dist < tol * edge_len + 1e-8:
                xi = proj / edge_len
                constraints.append((n, nA, nB, xi))
                seen_slaves.add(n)

    return constraints


def deform(
    nodes,
    elements: Sequence[Sequence[int]],
    ni: NodeInputs,
    ei: ElementInputs,
    springs: Optional[Iterable[Tuple[int, int, float]]] = None,
    edge_constraints: Optional[bool] = False,
) -> DeformOutputs:
    """Solve K·u = F con supports, springs Winkler, y edge constraints.

    springs: lista de (node_idx, dof_local_0..5, k) -> K[gdof, gdof] += k.
    edge_constraints: if True, auto-detect and apply ETABS-style edge MPC.
    """
    nodes = np.asarray(nodes, dtype=float)
    n_nodes = nodes.shape[0]
    dof = n_nodes * 6

    K = assemble_global_K(nodes, elements, ei, dof).tolil()
    if springs:
        for (node, d, k) in springs:
            g = node * 6 + d
            K[g, g] = K[g, g] + k
    K = K.tocsr()

    F = get_forces(ni, dof)

    # Apply edge constraints (ETABS-style MPC)
    if edge_constraints:
        ec_list = detect_edge_constraints(nodes, elements)
        if ec_list:
            K, F = _apply_edge_constraints(K, F, ec_list, dof)

    free = get_free_indices(ni, dof)
    if not free:
        out = DeformOutputs(u_full=np.zeros(dof))
        for i in range(n_nodes):
            out.deformations[i] = np.zeros(6)
        return out

    Kr = reduce_matrix(K, free)
    Fr = F[free]

    # Solve sparse (LU). Para matrices muy grandes podes cambiar a spsolve_lu o iterativo.
    ur = spla.spsolve(Kr.tocsc(), Fr)

    u = np.zeros(dof)
    u[free] = ur

    # Reacciones en DOFs fijos: F_react = K·u (sin restar F_aplicada porque en
    # nodos fijos no aplicamos cargas; si las hubiera, sería K·u - F_aplicada).
    f_react = K @ u
    reactions = {}
    deformations = {}
    fixed = set(range(dof)) - set(free)
    for i in range(n_nodes):
        deformations[i] = u[i*6:i*6 + 6]
        rxn = np.zeros(6)
        for d in range(6):
            g = i*6 + d
            if g in fixed:
                rxn[d] = f_react[g]
        reactions[i] = rxn

    out = DeformOutputs(deformations=deformations, reactions=reactions, u_full=u)
    return out


# ─────────────────────────────────────────────────────────────────────────────
# Analyze: post-procesado de M11/M22/M12, F11/F22 sobre shells +
# axial/shear/moment/torsion sobre frames (a partir del vector U)
# ─────────────────────────────────────────────────────────────────────────────

def analyze_shell_results(nodes, elements, ei: ElementInputs,
                          u: np.ndarray, shell_indices: Sequence[int]):
    """Devuelve diccionario por elemento shell con:
       Mxx, Myy, Mxy (kN·m/m), Fxx, Fyy (kN/m), evaluados en el centroide.

    Asume el elemento Q4 rectangular en plano local (Mesa Torsion). Para
    elementos genéricos, los M y F resultantes son una aproximación lineal.
    """
    from .deform import _eval_shell_resultants
    nodes = np.asarray(nodes, dtype=float)
    results = {}
    for e in shell_indices:
        results[e] = _eval_shell_resultants(nodes, elements[e], ei, e, u)
    return results


def _eval_shell_resultants(nodes, elm, ei, e_idx, u):
    """Mxx/Myy/Mxy/Fxx/Fyy en centroide del shell asumiendo Q4 rectangular plano."""
    p = [np.asarray(nodes[i], dtype=float) for i in elm]
    # Asumimos plano XY (z constante o losa horizontal); para vertical el cálculo
    # debería usar coords locales. Mesa Torsion: losa horizontal, OK.
    xs = [pp[0] for pp in p]
    ys = [pp[1] for pp in p]
    dx = max(xs) - min(xs)
    dy = max(ys) - min(ys)
    a = dx / 2.0
    b = dy / 2.0
    E  = ei.elasticities.get(e_idx, 0.0)
    nu = ei.poissonsRatios.get(e_idx, 0.0)
    t  = ei.thicknesses.get(e_idx, 0.0)
    if E <= 0 or t <= 0 or a <= 0 or b <= 0:
        return {"Mxx": 0.0, "Myy": 0.0, "Mxy": 0.0, "Fxx": 0.0, "Fyy": 0.0}

    D = E * t**3 / (12.0 * (1.0 - nu * nu))
    # Centroide xi=eta=0; dNdxi y dNdeta clásicos
    dNdxi  = np.array([-0.25,  0.25, 0.25, -0.25])
    dNdeta = np.array([-0.25, -0.25, 0.25,  0.25])

    uL = np.zeros((4, 6))
    for i, n in enumerate(elm):
        uL[i, :] = u[n*6:n*6+6]

    kxx = 0.0; kyy = 0.0; kxy = 0.0
    exx = 0.0; eyy = 0.0
    for i in range(4):
        tx = uL[i, 3]    # θx_global
        ty = uL[i, 4]    # θy_global
        ux = uL[i, 0]
        uy = uL[i, 1]
        dx_ = dNdxi[i]  / a
        dy_ = dNdeta[i] / b
        kxx += -dx_ * ty
        kyy += +dy_ * tx
        kxy += +dx_ * tx - dy_ * ty
        exx += dx_ * ux
        eyy += dy_ * uy

    m11 = D * (kxx + nu * kyy)
    m22 = D * (nu * kxx + kyy)
    m12 = D * (1 - nu) / 2.0 * kxy
    Em_t = E * t / (1.0 - nu * nu)
    f11  = Em_t * (exx + nu * eyy)
    f22  = Em_t * (nu * exx + eyy)
    return {"Mxx": m11, "Myy": m22, "Mxy": m12, "Fxx": f11, "Fyy": f22}


def frame_internal_forces(nodes, elm, ei, e_idx, u):
    """Devuelve fL (12,) = K_local @ u_local del frame: [F0..M0, F1..M1].

    Convención: fL = [Fx,Fy,Fz,Mx,My,Mz, Fx',Fy',Fz',Mx',My',Mz'] en local.
      axial   = fL[0]    (compresión negativa convención awatif)
      torsion = fL[3]
      Mz      = fL[5]    (bending local minor axis)
    """
    elm_nodes = [nodes[i] for i in elm]
    kL = get_local_stiffness(elm_nodes, ei, e_idx)
    T  = get_transformation_matrix(elm_nodes)
    n_el = len(elm)
    uG = np.zeros(6 * n_el)
    for i, n in enumerate(elm):
        uG[i*6:i*6 + 6] = u[n*6:n*6 + 6]
    uL = T @ uG
    fL = kL @ uL
    return fL


# ─────────────────────────────────────────────────────────────────────────────
# Recuperacion de fuerzas shell en EJES LOCALES (vale para losa horizontal Y
# muro vertical). Reproduce el procedimiento CsiGo2/SAPFire: proyecta los 4 nudos
# al plano local, lleva los desplazamientos a locales con la MISMA T que la
# rigidez, y evalua F (membrana) y M (flexion) en ejes locales. Gauss 2x2 -> avg.
#   F11/F22/F12 = (E t/(1-nu^2))*(exx,eyy) , G t*gxy        [fuerza/long]
#   M11/M22/M12 = D*(kxx,kyy) , D(1-nu)/2*kxy , D=E t^3/12(1-nu^2)
# Generaliza _eval_shell_resultants (que asumia plano horizontal y daba 0 en muros).
# ─────────────────────────────────────────────────────────────────────────────
_SHELL_G = 0.5773502691896258  # 1/sqrt(3)

def eval_shell_resultants_local(nodes, elm, ei, e_idx, u, at="gauss"):
    """Devuelve {F11,F22,F12,M11,M22,M12} en ejes locales del shell Q4.
    at='gauss' (2x2 promediado, estilo CSI) o 'center' (centroide)."""
    import numpy as _np
    from ..utils.transformation import shell_q4
    from ..utils.shell_thin import _project_to_local
    p = [_np.asarray(nodes[i], float) for i in elm]
    xy = _project_to_local(p)
    if xy is None:
        return {"F11":0.,"F22":0.,"F12":0.,"M11":0.,"M22":0.,"M12":0.}
    x, y = xy
    a = (float(max(x)) - float(min(x))) / 2.0
    b = (float(max(y)) - float(min(y))) / 2.0
    E = ei.elasticities.get(e_idx, 0.0); nu = ei.poissonsRatios.get(e_idx, 0.0)
    t = ei.thicknesses.get(e_idx, 0.0)
    if E <= 0 or t <= 0 or a <= 0 or b <= 0:
        return {"F11":0.,"F22":0.,"F12":0.,"M11":0.,"M22":0.,"M12":0.}
    T = shell_q4(*p)
    uG = _np.concatenate([_np.asarray(u[n*6:n*6+6], float) for n in elm])
    uloc = (T @ uG).reshape(4, 6)
    u_, v_, w_, thx, thy = uloc[:,0], uloc[:,1], uloc[:,2], uloc[:,3], uloc[:,4]
    Et = E*t/(1.0-nu*nu); G = E/(2.0*(1.0+nu)); D = E*t**3/(12.0*(1.0-nu*nu))
    g = _SHELL_G
    pts = [(-g,-g),(g,-g),(g,g),(-g,g)] if at == "gauss" else [(0.0,0.0)]
    acc = dict(F11=0.,F22=0.,F12=0.,M11=0.,M22=0.,M12=0.)
    for xi, eta in pts:
        dNdxi  = _np.array([-(1-eta),(1-eta),(1+eta),-(1+eta)])*0.25/a
        dNdeta = _np.array([-(1-xi),-(1+xi),(1+xi),(1-xi)])*0.25/b
        exx=float(dNdxi@u_); eyy=float(dNdeta@v_); gxy=float(dNdeta@u_+dNdxi@v_)
        kxx=float(-dNdxi@thy); kyy=float(dNdeta@thx); kxy=float(dNdxi@thx-dNdeta@thy)
        acc["F11"]+=Et*(exx+nu*eyy); acc["F22"]+=Et*(nu*exx+eyy); acc["F12"]+=G*t*gxy
        acc["M11"]+=D*(kxx+nu*kyy);  acc["M22"]+=D*(nu*kxx+kyy);  acc["M12"]+=D*(1-nu)/2*kxy
    n=len(pts)
    return {k:v/n for k,v in acc.items()}
