"""Mesa de Torsion -- motor FEM NATIVO de hekatan-struct (hekatan-fem-py), SIN OpenSees.

Reemplaza a (mesa_torsion_openseespy + mesa_openseespy_plotly): expone la misma
interfaz que usa la app tkinter (configure, props_summary, solve_case, shell_fields,
frame_segments, nzd, modal_shapes) pero resolviendo con el solver propio de Hekatan
(deform/modal en numpy/scipy, elemento ShellThin MZC Kirchhoff + frames 3D).
"""
from __future__ import annotations
import sys
from pathlib import Path
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

# motor nativo de hekatan-struct (busca hekatan_fem en dev y en distribucion)
_here = Path(__file__).resolve().parent
sys.path.insert(0, str(_here))          # hekatan_fem en la misma carpeta (exe / zip)
sys.path.insert(0, str(_here.parent))   # hekatan_fem en hekatan-fem-py/ (dev)
from hekatan_fem.data_model import ElementInputs, NodeInputs
from hekatan_fem.utils.local_stiffness import get_local_stiffness
from hekatan_fem.utils.transformation import get_transformation_matrix
from hekatan_fem.solver.modal import modal as _modal
import hekatan_fem.utils.shell_thin as _st
import python_dkq as _dkq

GRAV = 9.80665

# ============================================================
#  Elemento de losa = DKQ-Batoz (= ShellThin de ETABS) + recovery con su B propia.
#  Reemplaza el MZC+centroide que subestimaba Mxy ~-40%. Ver MESA_TORSION_FUENTE_UNICA.md.
# ============================================================
# ENVOLVENTE=True: en cada nudo el valor de mayor |M| entre los elementos que llegan (como la
# tabla element-joint de ETABS / Hekatan Struct: Mxy=0.189). False = promedio nodal (0.170).
ENVOLVENTE = True
USE_DKQ = True                                  # True = DKQ-Batoz (ETABS); False = MZC original
_BEND_MZC = _st._bending_k_mzc                  # MZC original (fallback)
_Pdkq = np.diag([1., -1, -1, 1, -1, -1, 1, -1, -1, 1, -1, -1])
def _dkq_bending(x, y, E_, nu_, t_):
    dxe = float(max(x) - min(x)); dye = float(max(y) - min(y))
    Db = _dkq.dkq_bending_matrix(E_, nu_, t_)
    return _Pdkq.T @ _dkq.dkq_stiffness(dxe, dye, Db) @ _Pdkq
def _apply_plate_element():
    _st._bending_k_mzc = _dkq_bending if USE_DKQ else _BEND_MZC
# constantes de recovery DKQ (2x2 Gauss + extrapolacion sqrt3 a nodos)
_GA = 1.0 / np.sqrt(3.0); _s3 = np.sqrt(3.0)
_AEXT = np.array([
    [1 + _s3/2, -0.5,       1 - _s3/2, -0.5],
    [-0.5,       1 + _s3/2, -0.5,       1 - _s3/2],
    [1 - _s3/2, -0.5,       1 + _s3/2, -0.5],
    [-0.5,       1 - _s3/2, -0.5,       1 + _s3/2]])
_GP = [(-_GA, -_GA), (_GA, -_GA), (_GA, _GA), (-_GA, _GA)]

# ---- geometria y material (del e2k) ----
Lx = Ly = 6.0; H = 4.0; t = 0.10; N = 5; dx = Lx / N
E = 24.85e6; nu = 0.20; G = E / (2 * (1 + nu)); rho = 2.40277
bC = 0.40; hC = 0.40; bV = 0.30; hV = 0.50
q_live = 4.9033
SUPPORT = "pin"; DIAPHRAGM = "none"
IOFF = hV

def stv(b, h):
    a, s = max(b, h), min(b, h); r = s / a
    return (1/3 - 0.21*r*(1 - r**4/12)) * a * s**3

Ac = bC*hC; Iyc = hC*bC**3/12; Izc = bC*hC**3/12; Jc = stv(bC, hC)
Av = bV*hV; Iyv = bV*hV**3/12; Izv = hV*bV**3/12; Jv = stv(bV, hV)

PLATEF = 1   # formulacion de placa del shell: 1=MZC/ShellThin (Kirchhoff), 0=Mindlin Q4
JV_FACTOR = 1.0   # multiplicador de la rigidez torsional de las VIGAS (analisis no lineal: GJ fisurada)

def configure(E_GPa=None, nu_=None, t_=None, q_tonf=None, off=None,
              bC_=None, hC_=None, bV_=None, hV_=None, Lx_=None, H_=None, support=None,
              plateF=None, dkq=None):
    global E, nu, G, t, q_live, IOFF, bC, hC, bV, hV, Lx, Ly, H, dx, SUPPORT, PLATEF, USE_DKQ
    global Ac, Iyc, Izc, Jc, Av, Iyv, Izv, Jv
    if plateF is not None: PLATEF = plateF
    if dkq is not None: USE_DKQ = dkq
    if E_GPa is not None: E = E_GPa * 1e6
    if nu_   is not None: nu = nu_
    if t_    is not None: t = t_
    if q_tonf is not None: q_live = q_tonf * GRAV
    if off   is not None: IOFF = off
    if bC_   is not None: bC = bC_
    if hC_   is not None: hC = hC_
    if bV_   is not None: bV = bV_
    if hV_   is not None: hV = hV_
    if Lx_   is not None: Lx = Ly = Lx_; dx = Lx / N
    if H_    is not None: H = H_
    if support is not None: SUPPORT = support
    G = E / (2 * (1 + nu))
    Ac = bC*hC; Iyc = hC*bC**3/12; Izc = bC*hC**3/12; Jc = stv(bC, hC)
    Av = bV*hV; Iyv = bV*hV**3/12; Izv = hV*bV**3/12; Jv = stv(bV, hV)

def props_summary():
    return {"E_GPa": E/1e6, "nu": nu, "G_GPa": G/1e6, "rho": rho,
            "t": t, "q_tonf": q_live/GRAV, "q_kN": q_live, "off": IOFF,
            "bC": bC, "hC": hC, "Ac": Ac, "Iyc": Iyc, "Izc": Izc, "Jc": Jc,
            "bV": bV, "hV": hV, "Av": Av, "Iyv": Iyv, "Izv": Izv, "Jv": Jv,
            "Lx": Lx, "H": H, "N": N, "support": SUPPORT, "diaphragm": DIAPHRAGM}

# ---- topologia ----
def _ix(i, j): return 4 + j*(N+1) + i

def _build_model():
    nodes = [[0,0,0], [Lx,0,0], [Lx,Ly,0], [0,Ly,0]]
    for j in range(N+1):
        for i in range(N+1):
            nodes.append([i*dx, j*dx, H])
    nodes = np.array(nodes, dtype=float)
    elems = []
    for j in range(N):
        for i in range(N):
            elems.append([_ix(i,j), _ix(i+1,j), _ix(i+1,j+1), _ix(i,j+1)])
    sc = len(elems)
    elems += [[0,_ix(0,0)], [1,_ix(N,0)], [2,_ix(N,N)], [3,_ix(0,N)]]
    cs, ce = sc, len(elems)
    for i in range(N): elems.append([_ix(i,0), _ix(i+1,0)])
    for j in range(N): elems.append([_ix(N,j), _ix(N,j+1)])
    for i in range(N): elems.append([_ix(i,N), _ix(i+1,N)])
    for j in range(N): elems.append([_ix(0,j), _ix(0,j+1)])
    bs, be = ce, len(elems)
    return nodes, elems, sc, cs, ce, bs, be

def _make_ei(sc, cs, ce, bs, be):
    ei = ElementInputs()
    for e in range(sc):
        ei.thicknesses[e] = t; ei.elasticities[e] = E
        ei.poissonsRatios[e] = nu; ei.plateFormulations[e] = PLATEF   # 1=MZC/Kirchhoff, 0=Mindlin
        ei.drillingTypes[e] = 0
    for e in range(cs, ce):
        ei.elasticities[e] = E; ei.poissonsRatios[e] = nu; ei.shearModuli[e] = G
        ei.areas[e] = Ac; ei.momentsOfInertiaY[e] = Iyc; ei.momentsOfInertiaZ[e] = Izc
        ei.torsionalConstants[e] = Jc
    for e in range(bs, be):
        ei.elasticities[e] = E; ei.poissonsRatios[e] = nu; ei.shearModuli[e] = G
        ei.areas[e] = Av; ei.momentsOfInertiaY[e] = Iyv; ei.momentsOfInertiaZ[e] = Izv
        ei.torsionalConstants[e] = Jv * JV_FACTOR     # GJ de viga reducido al fisurar (no lineal)
    return ei

def _assemble_K(nodes, elems, ei):
    dof = 6 * len(nodes)
    rows, cols, data = [], [], []
    for e, elm in enumerate(elems):
        enodes = [nodes[i] for i in elm]
        kL = get_local_stiffness(enodes, ei, e)
        T = get_transformation_matrix(enodes)
        kG = T.T @ kL @ T
        n_el = len(elm)
        for li in range(6*n_el):
            gi = elm[li//6]*6 + li % 6
            for lj in range(6*n_el):
                gj = elm[lj//6]*6 + lj % 6
                v = kG[li, lj]
                if abs(v) > 1e-18:
                    rows.append(gi); cols.append(gj); data.append(v)
    K = sp.csr_matrix((data, (rows, cols)), shape=(dof, dof)); K.sum_duplicates()
    return K

# ---- estado global del ultimo solve ----
_S = {}

def solve_case(p_uniform_kN=0.0, sw_factor=0.0):
    """Estatico: presion uniforme (kN/m2) + peso propio escalado (sw_factor)."""
    _apply_plate_element()                       # DKQ-Batoz (= ETABS) o MZC segun USE_DKQ
    nodes, elems, sc, cs, ce, bs, be = _build_model()
    dof = 6 * len(nodes)
    ei = _make_ei(sc, cs, ce, bs, be)
    K = _assemble_K(nodes, elems, ei)
    # apoyos
    fixrot = SUPPORT == "fix"
    fixed = []
    for n in range(4):
        fixed += [n*6+0, n*6+1, n*6+2]
        if fixrot: fixed += [n*6+3, n*6+4, n*6+5]
    free = sorted(set(range(dof)) - set(fixed))
    # cargas
    F = np.zeros(dof)
    gk = rho * GRAV
    pslab = p_uniform_kN + sw_factor * gk * t
    for j in range(N+1):
        for i in range(N+1):
            c = (i in (0,N)) and (j in (0,N)); ed = (i in (0,N)) or (j in (0,N))
            fac = 0.25 if c else (0.5 if ed else 1.0)
            F[_ix(i,j)*6+2] -= pslab*dx*dx*fac
    if sw_factor:
        wb = sw_factor*gk*Av*dx
        for e in range(bs, be):
            for n in elems[e]: F[n*6+2] -= wb/2
        wc = sw_factor*gk*Ac*H
        for nb, nt in [(0,_ix(0,0)),(1,_ix(N,0)),(2,_ix(N,N)),(3,_ix(0,N))]:
            F[nt*6+2] -= wc
    u = np.zeros(dof)
    u[free] = spla.spsolve(K[free,:][:,free].tocsc(), F[free])
    _S.update(nodes=nodes, elems=elems, ei=ei, u=u, sc=sc, cs=cs, ce=ce, bs=bs, be=be)

def shell_fields():
    """Grids (N+1)x(N+1): w[mm], Mxx, Myy, Mxy, Mmax, Mmin  (tonf.m/m).
       USE_DKQ=True (default): recovery con la B PROPIA del DKQ (2x2 Gauss + extrapol
       sqrt3) = ETABS exacto. False: centroide MZC (legacy, subestima Mxy ~-40%)."""
    nodes, elems, u, sc = _S["nodes"], _S["elems"], _S["u"], _S["sc"]
    w = np.zeros((N+1,N+1))
    for j in range(N+1):
        for i in range(N+1):
            w[j,i] = u[_ix(i,j)*6+2]*1000.0
    acc = {k: np.zeros((N+1,N+1)) for k in ("Mxx","Myy","Mxy")}; cnt = np.zeros((N+1,N+1))
    env = {k: np.zeros((N+1,N+1)) for k in ("Mxx","Myy","Mxy")}   # max |M| element-nodal
    _nodes_grid = [(0,0),(1,0),(1,1),(0,1)]      # (di,dj) de los 4 nodos del Q4, orden DKE
    if USE_DKQ:
        Db = _dkq.dkq_bending_matrix(E, nu, t)
        for e in range(sc):
            elm = elems[e]
            ue = np.zeros(12)
            for ni, gn in enumerate(elm):
                ue[3*ni:3*ni+3] = [u[gn*6+2], u[gn*6+3], u[gn*6+4]]
            ue_dkq = _Pdkq @ ue
            g11 = np.zeros(4); g22 = np.zeros(4); g12 = np.zeros(4)
            for gi, (xi, eta) in enumerate(_GP):
                M = Db @ (_dkq._dkq_Bmatrix(xi, eta, dx, dx) @ ue_dkq)
                g11[gi] = M[0]; g22[gi] = M[1]; g12[gi] = M[2]
            n11 = _AEXT @ g11; n22 = _AEXT @ g22; n12 = _AEXT @ g12
            j0, i0 = divmod(e, N)
            for k, (di, dj) in enumerate(_nodes_grid):
                ii, jj = i0 + di, j0 + dj
                acc["Mxx"][jj,ii] += n11[k]/GRAV; acc["Myy"][jj,ii] += n22[k]/GRAV
                acc["Mxy"][jj,ii] += n12[k]/GRAV; cnt[jj,ii] += 1
                for key, val in (("Mxx", n11[k]), ("Myy", n22[k]), ("Mxy", n12[k])):
                    v = val/GRAV
                    if abs(v) > abs(env[key][jj,ii]): env[key][jj,ii] = v
    else:
        a = dx/2.0; b = dx/2.0
        D0 = E*t**3/(12*(1-nu**2))
        dNdxi  = np.array([-0.25, 0.25, 0.25, -0.25])
        dNdeta = np.array([-0.25, -0.25, 0.25, 0.25])
        for e in range(sc):
            elm = elems[e]
            kxx = kyy = kxy = 0.0
            for n in range(4):
                tx = u[elm[n]*6+3]; ty = u[elm[n]*6+4]
                ddx = dNdxi[n]/a; ddy = dNdeta[n]/b
                kxx += -ddx*ty; kyy += ddy*tx; kxy += ddx*tx - ddy*ty
            m11 = D0*(kxx + nu*kyy)/GRAV
            m22 = D0*(nu*kxx + kyy)/GRAV
            m12 = D0*(1-nu)/2.0*kxy/GRAV
            j0, i0 = divmod(e, N)
            for (ii,jj) in [(i0,j0),(i0+1,j0),(i0+1,j0+1),(i0,j0+1)]:
                acc["Mxx"][jj,ii] += m11; acc["Myy"][jj,ii] += m22; acc["Mxy"][jj,ii] += m12
                cnt[jj,ii] += 1
    for k in acc: acc[k] /= np.maximum(cnt, 1)
    if USE_DKQ and ENVOLVENTE: acc = env
    Mxx, Myy, Mxy = acc["Mxx"], acc["Myy"], acc["Mxy"]
    Mmax = 0.5*(Mxx+Myy) + np.sqrt(0.25*(Mxx-Myy)**2 + Mxy**2)
    Mmin = 0.5*(Mxx+Myy) - np.sqrt(0.25*(Mxx-Myy)**2 + Mxy**2)
    return w, Mxx, Myy, Mxy, Mmax, Mmin

def nzd(node_idx, sc_amp):
    cr = _S["nodes"][node_idx]
    return np.array([cr[0], cr[1], cr[2] + _S["u"][node_idx*6+2]*sc_amp])

# mapa de componentes frame igual que la app: (idx_i, idx_j, signo_i, signo_j)
_COMP = {"M": (5, 11, -1, 1), "V": (1, 7, 1, -1), "T": (3, 9, 1, -1), "P": (0, 6, 1, -1)}

def frame_elems():
    """indices de elementos frame (columnas + vigas)."""
    return list(range(_S["cs"], _S["be"]))

def frame_segments(key, sc_amp):
    """[(p0, p1, vi, vj), ...] por barra, con posiciones deformadas y offset en cara
       para el momento de columnas (M_cara = M_nudo - V*offset)."""
    nodes, elems, ei, u = _S["nodes"], _S["elems"], _S["ei"], _S["u"]
    cs, ce = _S["cs"], _S["ce"]
    ci, cj, si, sj = _COMP[key]
    out = []
    for e in range(cs, _S["be"]):
        elm = elems[e]; enodes = [nodes[i] for i in elm]
        kL = get_local_stiffness(enodes, ei, e)
        Tm = get_transformation_matrix(enodes)
        uG = np.zeros(12)
        for k2, gn in enumerate(elm): uG[k2*6:k2*6+6] = u[gn*6:gn*6+6]
        fL = kL @ (Tm @ uG)
        vi = si*fL[ci]/GRAV; vj = sj*fL[cj]/GRAV
        if key == "M" and cs <= e < ce and IOFF > 0:    # columna: momento en cara
            Vsh = abs(fL[7])/GRAV
            vj = np.sign(vj)*max(abs(vj) - Vsh*IOFF, 0.0)
        out.append((nzd(elm[0], sc_amp), nzd(elm[1], sc_amp), vi, vj))
    return out

def modal_shapes(nmodes=3):
    """[(T, ux_grid, uy_grid, px%, py%, prz%), ...].

    Masa LUMPED estilo ETABS (e2k): lateral (UX,UY), masa de viga concentrada en
    las ESQUINAS por luz libre (MESHATINTERSECTIONS), columna al tope, losa a sus
    nodos.  Condensacion de Guyan a los GDL laterales de la losa -> evita la masa
    nula en rotaciones/vertical.  Esto reproduce ETABS (no la masa distribuida)."""
    from scipy.linalg import eigh
    nodes, elems, sc, cs, ce, bs, be = _build_model()
    ei = _make_ei(sc, cs, ce, bs, be)
    K = _assemble_K(nodes, elems, ei)
    dof = 6 * len(nodes)
    fixrot = SUPPORT == "fix"
    fixed = []
    for n in range(4):
        fixed += [n*6, n*6+1, n*6+2]
        if fixrot: fixed += [n*6+3, n*6+4, n*6+5]
    free = sorted(set(range(dof)) - set(fixed))

    # --- masa lumped estilo ETABS ---
    mnode = {}
    def add(n, m): mnode[n] = mnode.get(n, 0.0) + m
    for e in range(sc):                                  # losa -> 4 nodos
        mel = rho * t * dx * dx
        for n in elems[e]: add(n, mel/4)
    corners = [_ix(0,0), _ix(N,0), _ix(N,N), _ix(0,N)]
    for nt in corners: add(nt, rho*Ac*H/2)               # columna al tope
    side = rho * Av * (Lx - bC)                           # viga: masa por luz libre
    for c1, c2 in [(_ix(0,0),_ix(N,0)), (_ix(N,0),_ix(N,N)),
                   (_ix(0,N),_ix(N,N)), (_ix(0,0),_ix(0,N))]:
        add(c1, side/2); add(c2, side/2)                 # a las 2 esquinas del lado

    # masters = UX,UY de los nodos de losa (lateral)
    slab = [_ix(i,j) for j in range(N+1) for i in range(N+1)]
    masters = []; mvec = []; xy = []
    for n in slab:
        m = mnode.get(n, 0.0)
        masters += [n*6+0, n*6+1]; mvec += [m, m]
        xy.append((nodes[n][0], nodes[n][1], m))
    fpos = {g: k for k, g in enumerate(free)}
    mset = set(masters)
    mi = np.array([fpos[g] for g in masters])
    si = np.array([k for g, k in fpos.items() if g not in mset])
    Kf = K[free, :][:, free].tocsc()
    Kmm = Kf[mi, :][:, mi].toarray()
    Kms = Kf[mi, :][:, si].toarray()
    Kss = Kf[si, :][:, si].tocsc()
    Ksm = Kf[si, :][:, mi].toarray()
    Kcond = Kmm - Kms @ spla.splu(Kss).solve(Ksm)        # condensacion de Guyan

    Md = np.array(mvec); ms = np.where(Md > 1e-12, Md, 1e-12)
    inv2 = 1.0 / np.sqrt(ms)
    A = inv2[:, None] * Kcond * inv2[None, :]
    w2, Vec = eigh(0.5*(A+A.T))
    order = np.argsort(np.abs(w2))

    # participacion (masas en masters: cada nodo aporta a UX y UY)
    Mtot = sum(mnode.values())
    sx = sum(m*x for (x, y, m) in xy); sy = sum(m*y for (x, y, m) in xy)
    xc = sx/Mtot if Mtot else 0.0; yc = sy/Mtot if Mtot else 0.0
    Jcm = sum(m*((x-xc)**2 + (y-yc)**2) for (x, y, m) in xy)

    res = []
    for k in order:
        if w2[k] <= 1e-9: continue
        T = 2*np.pi/np.sqrt(w2[k])
        phi = inv2 * Vec[:, k]
        Mgen = float(phi @ (Md*phi))
        ux = np.zeros((N+1,N+1)); uy = np.zeros((N+1,N+1))
        Lx_, Ly_, Lrz = 0.0, 0.0, 0.0
        for s, n in enumerate(slab):
            pux = phi[2*s]; puy = phi[2*s+1]; m = xy[s][2]
            j, i = divmod(s, N+1); ux[j, i] = pux; uy[j, i] = puy
            Lx_ += m*pux; Ly_ += m*puy
            Lrz += m*(pux*(-(xy[s][1]-yc)) + puy*(xy[s][0]-xc))
        px = (Lx_**2/Mgen)/Mtot*100 if Mtot else 0.0
        py = (Ly_**2/Mgen)/Mtot*100 if Mtot else 0.0
        prz = (Lrz**2/Mgen)/Jcm*100 if Jcm else 0.0
        amax = max(np.abs(ux).max(), np.abs(uy).max(), 1e-12)
        res.append((T, ux/amax, uy/amax, px, py, prz))
        if len(res) >= nmodes: break
    return res
