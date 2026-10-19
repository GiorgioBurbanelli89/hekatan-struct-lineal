"""Mesa de Torsion GENERAL -- modelo neutro + solver Hekatan (kN, m).

Generaliza mesa_hekatan.py (1 vano, 1 piso) a:
  - nx, ny vanos (1..2) de luz Lx en X e Y, y 1..3 pisos de altura H
  - losa: "shellthin" (DKQ-Batoz + membrana Q6 = ETABS ShellThin)
          "membrane"  (solo rigidez en su plano; la carga baja a las vigas por area tributaria)
          "waffle"    (reticular COMO ETABS: cascara de canto h + 10 modificadores calculados de la
                       T de cada nervio; extraido de ETABS.dll 22.6, ver tests_convergencia/WAFFLE_ETABS_RE.md)
          "none"      (solo barras; la carga de losa baja a las vigas por area tributaria)
  - apoyos "pin" / "fix"

El MISMO diccionario de modelo lo usan el solver de aqui y los exportadores
(mesa_export.py: E2K, S2K, OpenSees Tcl, OpenSeesPy, Fortran), asi todos resuelven
la MISMA malla nodo a nodo, sin brazos rigidos (offsets = 0).

Regla de cargas (la misma que escriben los exportadores):
  D   = peso propio: losa rho*g*t_peso por area, vigas rho*g*A por metro (longitud completa),
        columnas rho*g*A*H (mitad a cada nudo).
  SCP, L = presion uniforme sobre la losa.
  Losa con rigidez a flexion (shellthin / waffle): la presion va a los nudos de la malla
  por area tributaria (igual que mesa_hekatan.py).
  Losa sin flexion (membrane / none): la presion baja a las vigas del borde de cada pano por
  lineas a 45 grados (triangulo / trapecio), cargas CONSISTENTES (Hermite) en cada tramo.
"""
from __future__ import annotations
import numpy as np
import scipy.sparse as sp
import scipy.sparse.linalg as spla

import mesa_hekatan as MH                     # reutiliza DKQ, K de elementos y recovery
from hekatan_fem.data_model import ElementInputs
from hekatan_fem.utils.local_stiffness import get_local_stiffness
from hekatan_fem.utils.transformation import get_transformation_matrix
import python_dkq as _dkq
import hekatan_fem.utils.shell_thin as _st

GRAV = 9.80665
SLAB_TYPES = ["shellthin", "membrane", "waffle", "none"]


def default_params():
    return dict(Lx=6.0, H=4.0, nx=1, ny=1, pisos=1, N=5,
                bC=0.40, hC=0.40, bV=0.30, hV=0.50,
                E=24.85e6, nu=0.20, rho=2.40277, t=0.10,
                slab="shellthin",
                # reticular (waffle): canto total, losa superior, ancho de nervio, separacion
                w_h=0.30, w_tf=0.05, w_bw=0.10, w_s=0.60, w_bb=None, w_s2=None,   # bb: nervio abajo (None = recto)
                support="pin",
                qL=0.5*GRAV, qSCP=1.0*GRAV)          # kN/m2


def stv(b, h):
    a, s = max(b, h), min(b, h); r = s / a
    return (1/3 - 0.21*r*(1 - r**4/12)) * a * s**3


def _T_props(h, tf, bt, bb, s):
    """Seccion T de un nervio: ala s x tf arriba, alma trapecial bt (arriba) -> bb (abajo).
    Devuelve (A, I33 respecto a su centroide)."""
    hw = h - tf
    # alma trapecial: area y centroide medidos desde abajo
    Aw = 0.5*(bt + bb)*hw
    yw = hw*(2*bt + bb)/(3*(bt + bb)) if Aw > 0 else 0.0
    Iw = hw**3*(bt*bt + 4*bt*bb + bb*bb)/(36*(bt + bb)) if Aw > 0 else 0.0
    Af = s*tf; yf = hw + tf/2
    A = Aw + Af; yc = (Aw*yw + Af*yf)/A
    I = Iw + Aw*(yw - yc)**2 + s*tf**3/12 + Af*(yf - yc)**2
    return A, I


def torsion_J_T(h, tf, bt, bb, s, n=None):
    """J de Saint-Venant de la T por Prandtl (lap(phi) = -2, phi = 0 en el borde, J = 2 int phi),
    diferencias finitas en dos mallas + extrapolacion de Richardson (error O(h^2))."""
    def J_grid(dd):
        nx = int(round(s/dd)); ny = int(round(h/dd)); dx_ = s/nx; dy_ = h/ny
        xs = (np.arange(nx) + 0.5)*dx_ - s/2; ys = (np.arange(ny) + 0.5)*dy_   # centros de celda, y desde abajo
        X, Y = np.meshgrid(xs, ys)
        wy = bb + (bt - bb)*np.clip(Y/(h - tf), 0, 1)                         # ancho del alma a la altura y
        inside = (Y >= h - tf) | (np.abs(X) <= wy/2)
        idx = -np.ones(inside.shape, int); idx[inside] = np.arange(inside.sum())
        rows, cols, vals = [], [], []
        for (j, i), k in np.ndenumerate(idx):
            if k < 0: continue
            diag = 0.0
            for dj, di, hh in ((1, 0, dy_), (-1, 0, dy_), (0, 1, dx_), (0, -1, dx_)):
                jj, ii = j + dj, i + di
                c = 1.0/hh**2
                if 0 <= jj < ny and 0 <= ii < nx and idx[jj, ii] >= 0:
                    rows.append(k); cols.append(idx[jj, ii]); vals.append(-c); diag += c
                else:
                    diag += 2*c                      # phi = 0 en la cara (a media celda): fantasma antisimetrico
            rows.append(k); cols.append(k); vals.append(diag)
        A_ = sp.csr_matrix((vals, (rows, cols)))
        phi = spla.spsolve(A_.tocsc(), 2.0*np.ones(A_.shape[0]))
        return 2*phi.sum()*dx_*dy_
    d1 = n or min(tf, bb, bt)/10
    J1, J2 = J_grid(d1), J_grid(d1/2)
    return J2 + (J2 - J1)/3


def waffle_equiv(h, tf, bt, s1, bb=None, s2=None, E=None, nu=None):
    """Reticular -> lo que ETABS entrega al solver (ETABS.dll 22.6, RE estatico):
    cascara de espesor h (membrana = flexion) con modificadores
      [f11, f22, f12, m11, m22, m12, v13, v23, masa, peso]
      = [tv/h, tv/h, tf/h, (tb1/h)^3, (tb2/h)^3, (tt/h)^3, 1, 1, tv/h, tv/h]
    tb_k = (12 I_k/s_k)^(1/3) (T con ala = s_k completa), tt = min_k (3 J_k/s_k)^(1/3),
    tv = h - (h-tf)/3 (At + Ab + sqrt(At Ab))/(s1 s2)  (hueco = tronco de piramide).
    Pendiente fase 2: el valor exacto de J que calcula ETABS (aqui Prandtl numerico)."""
    bb = bt if bb is None else bb; s2 = s1 if s2 is None else s2
    tb, tt = [], []
    for sk in (s1, s2):
        _, I = _T_props(h, tf, bt, bb, sk)
        tb.append((12*I/sk)**(1/3))
        tt.append((3*torsion_J_T(h, tf, bt, bb, sk)/sk)**(1/3))
    At = (s1 - bt)*(s2 - bt); Ab = (s1 - bb)*(s2 - bb)
    tv = h - (h - tf)/3*(At + Ab + np.sqrt(At*Ab))/(s1*s2)
    t_t = min(tt)
    mods = [tv/h, tv/h, tf/h, (tb[0]/h)**3, (tb[1]/h)**3, (t_t/h)**3, 1.0, 1.0, tv/h, tv/h]
    return dict(t=h, t_peso=tv, mods=mods, tb=tb, tt=t_t, t_vol=tv)


def membrane_q6_Em(x, y, Em, t):
    """Membrana Q6 (modos incompatibles de Wilson) = shell_thin._membrane_k_q6 pero con la matriz
    constitutiva Em dada (para los modificadores F11/F22/F12)."""
    shp = _st._shape_q4
    gp = np.array([-1.0/np.sqrt(3.0), 1.0/np.sqrt(3.0)])
    _, dN0xi, dN0eta = shp(0.0, 0.0)
    J0 = np.array([[dN0xi @ x, dN0xi @ y], [dN0eta @ x, dN0eta @ y]]); Ji0 = np.linalg.inv(J0)
    Kuu = np.zeros((8, 8)); Kua = np.zeros((8, 4)); Kaa = np.zeros((4, 4))
    for xi in gp:
        for eta in gp:
            _, dNdxi, dNdeta = shp(xi, eta)
            J = np.array([[dNdxi @ x, dNdxi @ y], [dNdeta @ x, dNdeta @ y]]); Ji = np.linalg.inv(J)
            B = np.zeros((3, 8))
            for i in range(4):
                dNdx = Ji[0, 0]*dNdxi[i] + Ji[0, 1]*dNdeta[i]; dNdy = Ji[1, 0]*dNdxi[i] + Ji[1, 1]*dNdeta[i]
                B[0, 2*i] = dNdx; B[1, 2*i+1] = dNdy; B[2, 2*i] = dNdy; B[2, 2*i+1] = dNdx
            dP1dx = Ji0[0, 0]*(-2*xi); dP1dy = Ji0[1, 0]*(-2*xi)
            dP2dx = Ji0[0, 1]*(-2*eta); dP2dy = Ji0[1, 1]*(-2*eta)
            G = np.zeros((3, 4))
            G[0, 0] = dP1dx; G[2, 0] = dP1dy; G[0, 1] = dP2dx; G[2, 1] = dP2dy
            G[1, 2] = dP1dy; G[2, 2] = dP1dx; G[1, 3] = dP2dy; G[2, 3] = dP2dx
            w = t*np.linalg.det(J)
            Kuu += w*(B.T @ Em @ B); Kua += w*(B.T @ Em @ G); Kaa += w*(G.T @ Em @ G)
    return Kuu - Kua @ np.linalg.solve(Kaa, Kua.T)


def mod_matrices(E, nu, t, mods):
    """Db (flexion) y Em (membrana) con los modificadores CSI:
    D11*m11, D22*m22, D12*sqrt(m11 m22), D66*m12 ; idem membrana con f11, f22, f12."""
    f11, f22, f12, m11, m22, m12 = mods[:6]
    D0 = E*t**3/(12*(1 - nu*nu)); c = E/(1 - nu*nu)
    Db = D0*np.array([[m11, nu*np.sqrt(m11*m22), 0], [nu*np.sqrt(m11*m22), m22, 0], [0, 0, (1 - nu)/2*m12]])
    Em = c*np.array([[f11, nu*np.sqrt(f11*f22), 0], [nu*np.sqrt(f11*f22), f22, 0], [0, 0, (1 - nu)/2*f12]])
    return Db, Em


# ============================================================
#  MODELO NEUTRO
# ============================================================
def build(p=None):
    P = default_params()
    if p: P.update(p)
    nx, ny, npis, N = int(P["nx"]), int(P["ny"]), int(P["pisos"]), int(P["N"])
    L, H = P["Lx"], P["H"]; d = L / N
    slab = P["slab"]; assert slab in SLAB_TYPES, slab
    gx, gy = nx*N + 1, ny*N + 1                     # nudos de malla por piso en X e Y
    on_beam = lambda i, j: (i % N == 0) or (j % N == 0)
    need_all = slab in ("shellthin", "membrane", "waffle")

    nodes = []; nid = {}
    def add(key, xyz):
        nid[key] = len(nodes); nodes.append(xyz)
    for j in range(ny+1):                           # base (bajo cada columna)
        for i in range(nx+1):
            add(("b", i, j), (i*L, j*L, 0.0))
    for k in range(1, npis+1):
        for j in range(gy):
            for i in range(gx):
                if need_all or on_beam(i, j):
                    add(("f", k, i, j), (i*d, j*d, k*H))
    nodes = np.array(nodes, float)
    def fn(k, i, j): return nid[("b", i//N, j//N)] if k == 0 else nid[("f", k, i, j)]

    shells = []
    if need_all:
        for k in range(1, npis+1):
            for j in range(gy-1):
                for i in range(gx-1):
                    shells.append(dict(n=[fn(k, i, j), fn(k, i+1, j), fn(k, i+1, j+1), fn(k, i, j+1)],
                                       piso=k, gi=i, gj=j))
    frames = []
    for k in range(1, npis+1):                      # columnas: una por piso y eje
        for j in range(ny+1):
            for i in range(nx+1):
                frames.append(dict(i=fn(k-1, i*N, j*N), j=fn(k, i*N, j*N), tipo="col", sec="COL", piso=k))
    for k in range(1, npis+1):                      # vigas: tramos de d en todas las lineas de eje
        for j in range(0, gy, N):
            for i in range(gx-1):
                frames.append(dict(i=fn(k, i, j), j=fn(k, i+1, j), tipo="viga", sec="VIGA", piso=k, dir="x"))
        for i in range(0, gx, N):
            for j in range(gy-1):
                frames.append(dict(i=fn(k, i, j), j=fn(k, i, j+1), tipo="viga", sec="VIGA", piso=k, dir="y"))

    E, nu, rho = P["E"], P["nu"], P["rho"]
    mat = dict(E=E, nu=nu, G=E/(2*(1+nu)), rho=rho, gamma=rho*GRAV)
    bC, hC, bV, hV = P["bC"], P["hC"], P["bV"], P["hV"]
    secs = {  # ejes = los de Hekatan: columna bC a lo largo de X, hC de Y; viga peralte vertical
        "COL": dict(b=bC, h=hC, A=bC*hC, Iy=hC*bC**3/12, Iz=bC*hC**3/12, J=stv(bC, hC)),
        "VIGA": dict(b=bV, h=hV, A=bV*hV, Iy=bV*hV**3/12, Iz=hV*bV**3/12, J=stv(bV, hV))}

    if slab == "waffle":
        w = waffle_equiv(P["w_h"], P["w_tf"], P["w_bw"], P["w_s"], P.get("w_bb"), P.get("w_s2"))
        slabprop = dict(w, tipo=slab, bend=1.0, memb=1.0)
    elif slab == "membrane":
        slabprop = dict(tipo=slab, t=P["t"], t_peso=P["t"], bend=0.0, memb=1.0)
    elif slab == "none":
        slabprop = dict(tipo=slab, t=0.0, t_peso=P["t"], bend=0.0, memb=0.0)
    else:
        slabprop = dict(tipo=slab, t=P["t"], t_peso=P["t"], bend=1.0, memb=1.0)

    restr = {}
    fix = P["support"] == "fix"
    for j in range(ny+1):
        for i in range(nx+1):
            restr[nid[("b", i, j)]] = [True]*3 + [fix]*3

    M = dict(P=P, nodes=nodes, nid=nid, shells=shells, frames=frames, secs=secs, mat=mat,
             slabprop=slabprop, restr=restr, N=N, d=d, gx=gx, gy=gy, fn=fn)
    M["loads"] = _loads(M)
    return M


# ------------------------------------------------------------
#  cargas: equivalentes nodales (Hekatan / OpenSees / Fortran) +
#  descripcion "nativa" (CSI: peso propio, carga de area, carga de barra)
# ------------------------------------------------------------
def _hermite_loads(a, segs):
    """Carga vertical q(s) (positiva hacia abajo) lineal a trozos en [0,a]:
    segs = [(s0, s1, q0, q1)].  Devuelve (Fi, Mi, Fj, Mj) consistentes (Hermite),
    F positiva = hacia abajo, M sobre el eje local y (convencion derivada en el doc)."""
    g, wg = np.polynomial.legendre.leggauss(6)
    out = np.zeros(4)
    for (s0, s1, q0, q1) in segs:
        if s1 - s0 < 1e-12: continue
        for gp, ww in zip(g, wg):
            s = 0.5*(s1 - s0)*gp + 0.5*(s1 + s0); q = q0 + (q1 - q0)*(s - s0)/(s1 - s0)
            x = s / a
            N1 = 1 - 3*x*x + 2*x**3; N2 = a*x*(1 - x)**2
            N3 = 3*x*x - 2*x**3;     N4 = a*x*x*(x - 1)
            out += 0.5*(s1 - s0)*ww*q*np.array([N1, N2, N3, N4])
    return out


def _tributary_beam_loads(M, q):
    """Presion q (kN/m2, abajo) de cada pano -> vigas de su borde por lineas a 45 grados.
    Devuelve {frame_idx: [(s0, s1, q0, q1), ...]} (carga lineal a trozos, kN/m)."""
    P = M["P"]; L = P["Lx"]; N, d = M["N"], M["d"]
    out = {}
    # indice de vigas por (piso, dir, i, j) del nudo inicial en malla
    idx = {}
    for e, f in enumerate(M["frames"]):
        if f["tipo"] != "viga": continue
        xi = M["nodes"][f["i"]]
        idx[(f["piso"], f["dir"], int(round(xi[0]/d)), int(round(xi[1]/d)))] = e
    def tri(s):             # ordenada del triangulo de un lado de pano cuadrado LxL
        return q * min(s, L - s)
    for k in range(1, int(P["pisos"])+1):
        for bj in range(int(P["ny"])):
            for bi in range(int(P["nx"])):
                # 4 lados del pano (bi,bj): tramos de viga a lo largo del lado
                sides = [("x", bi*N, bj*N), ("x", bi*N, (bj+1)*N), ("y", bi*N, bj*N), ("y", (bi+1)*N, bj*N)]
                for (dr, i0, j0) in sides:
                    for m in range(N):
                        key = (k, dr, i0 + m, j0) if dr == "x" else (k, dr, i0, j0 + m)
                        e = idx[key]
                        sa, sb = m*d, (m+1)*d
                        pts = sorted({sa, sb} | ({L/2} if sa < L/2 < sb else set()))
                        for s0, s1 in zip(pts[:-1], pts[1:]):
                            out.setdefault(e, []).append((s0 - sa, s1 - sa, tri(s0), tri(s1)))
    return out


def _loads(M):
    nodes, frames, shells = M["nodes"], M["frames"], M["shells"]
    P, mat, sl = M["P"], M["mat"], M["slabprop"]
    nn = len(nodes); g = mat["gamma"]
    bend = sl["tipo"] in ("shellthin", "waffle")
    pat = {}
    for name in ("D", "SCP", "L"):
        pat[name] = dict(F=np.zeros(6*nn), frame=[], area=0.0, selfweight=(name == "D"))

    def add_frame_load(pname, e, segs):
        f = frames[e]; ni, nj = f["i"], f["j"]
        a = np.linalg.norm(nodes[nj] - nodes[ni])
        Fi, Mi, Fj, Mj = _hermite_loads(a, segs)
        ey = get_transformation_matrix([nodes[ni], nodes[nj]])[1, 0:3]     # eje local y (global)
        F = pat[pname]["F"]
        F[ni*6+2] -= Fi; F[nj*6+2] -= Fj
        F[ni*6+3:ni*6+6] += Mi*ey; F[nj*6+3:nj*6+6] += Mj*ey
        pat[pname]["frame"].append((e, segs))

    # --- peso propio de barras ---
    for e, f in enumerate(frames):
        A = M["secs"][f["sec"]]["A"]
        a = np.linalg.norm(nodes[f["j"]] - nodes[f["i"]])
        if f["tipo"] == "viga":
            add_frame_load("D", e, [(0.0, a, g*A, g*A)])
        else:
            w = g*A*a
            pat["D"]["F"][f["i"]*6+2] -= w/2; pat["D"]["F"][f["j"]*6+2] -= w/2
            pat["D"]["frame"].append((e, "col_sw"))
    # --- presiones de losa ---
    press = {"D": g*sl["t_peso"], "SCP": P["qSCP"], "L": P["qL"]}
    for pname, q in press.items():
        if q == 0: continue
        if bend:
            d = M["d"]
            if pname != "D": pat[pname]["area"] = q          # nativo: carga uniforme de area
            for s in shells:
                for n in s["n"]:
                    pat[pname]["F"][n*6+2] -= q*d*d/4
        else:
            for e, segs in _tributary_beam_loads(M, q).items():
                add_frame_load(pname, e, segs)
    pat["D"]["slab_q"] = press["D"]
    return pat


COMBOS = {"L": {"L": 1}, "SCP": {"SCP": 1}, "D": {"D": 1},
          "SERV": {"D": 1, "SCP": 1, "L": 1}, "ULT": {"D": 1.2, "SCP": 1.2, "L": 1.6}}


# ============================================================
#  SOLVER HEKATAN
# ============================================================
def _elem_inputs(M):
    ei = ElementInputs(); mat, sl = M["mat"], M["slabprop"]
    for e, s in enumerate(M["shells"]):
        ei.thicknesses[e] = sl["t"]; ei.elasticities[e] = mat["E"]
        ei.poissonsRatios[e] = mat["nu"]; ei.plateFormulations[e] = 1
        ei.drillingTypes[e] = 0
        ei.bendingModifiers[e] = sl["bend"]; ei.membraneModifiers[e] = sl["memb"]
    ns = len(M["shells"])
    for k, f in enumerate(M["frames"]):
        e = ns + k; s = M["secs"][f["sec"]]
        ei.elasticities[e] = mat["E"]; ei.poissonsRatios[e] = mat["nu"]; ei.shearModuli[e] = mat["G"]
        ei.areas[e] = s["A"]; ei.momentsOfInertiaY[e] = s["Iy"]; ei.momentsOfInertiaZ[e] = s["Iz"]
        ei.torsionalConstants[e] = s["J"]
    return ei


def elements(M):
    return [s["n"] for s in M["shells"]] + [[f["i"], f["j"]] for f in M["frames"]]


def _shell_mod_patch(M):
    """Con modificadores (waffle): parchea la flexion DKQ y la membrana Q6 de shell_thin para que usen
    Db / Em modificados.  Devuelve la funcion que deshace el parche."""
    mods = M["slabprop"].get("mods")
    if not mods: return lambda: None
    Db, Em = mod_matrices(M["mat"]["E"], M["mat"]["nu"], M["slabprop"]["t"], mods)
    old_b, old_m = _st._bending_k_mzc, _st._membrane_k_q6
    def kb(x, y, E_, nu_, t_):
        return MH._Pdkq.T @ _dkq.dkq_stiffness(float(max(x) - min(x)), float(max(y) - min(y)), Db) @ MH._Pdkq
    def km(x, y, E_, nu_, t_):
        return membrane_q6_Em(np.asarray(x, float), np.asarray(y, float), Em, t_)
    _st._bending_k_mzc = kb; _st._membrane_k_q6 = km
    def undo():
        _st._bending_k_mzc = old_b; _st._membrane_k_q6 = old_m
    return undo


def assemble_K(M):
    MH.USE_DKQ = True; MH._apply_plate_element()
    undo = _shell_mod_patch(M)
    try:
        return _assemble_K_raw(M)
    finally:
        undo()


def _assemble_K_raw(M):
    ei = _elem_inputs(M); nodes = M["nodes"]; els = elements(M)
    dof = 6*len(nodes)
    rows, cols, data = [], [], []
    for e, elm in enumerate(els):
        en = [nodes[i] for i in elm]
        kG = get_transformation_matrix(en).T @ get_local_stiffness(en, ei, e) @ get_transformation_matrix(en)
        g = np.array([n*6 + c for n in elm for c in range(6)])
        rows.append(np.repeat(g, len(g))); cols.append(np.tile(g, len(g))); data.append(kG.ravel())
    K = sp.csr_matrix((np.concatenate(data), (np.concatenate(rows), np.concatenate(cols))), shape=(dof, dof))
    return K, ei


def fixed_dofs(M, K=None):
    fx = set()
    for n, r in M["restr"].items():
        fx |= {n*6 + c for c in range(6) if r[c]}
    # GDL sin rigidez (losa membrana: w, rx, ry de nudos interiores) -> se fijan
    if K is not None:
        diag = np.abs(K.diagonal())
        fx |= set(np.where(diag < 1e-9*diag.max())[0].tolist())
    return sorted(fx)


def solve(M, combo="L"):
    K, ei = assemble_K(M)
    dof = K.shape[0]
    F = np.zeros(dof)
    for pn, fac in COMBOS[combo].items():
        F += fac*M["loads"][pn]["F"]
    fixed = fixed_dofs(M, K)
    free = np.setdiff1d(np.arange(dof), fixed)
    u = np.zeros(dof)
    u[free] = spla.spsolve(K[free][:, free].tocsc(), F[free])
    R = K @ u - F
    return dict(u=u, K=K, ei=ei, F=F, R=R, combo=combo)


def frame_forces(M, S):
    """fuerzas en extremos, ejes locales Hekatan: [N,Vy,Vz,T,My,Mz]_i, [...]_j  (kN, kN.m)"""
    nodes, u, ei = M["nodes"], S["u"], S["ei"]; ns = len(M["shells"]); out = []
    for k, f in enumerate(M["frames"]):
        en = [nodes[f["i"]], nodes[f["j"]]]
        ug = np.concatenate([u[f["i"]*6:f["i"]*6+6], u[f["j"]*6:f["j"]*6+6]])
        fL = get_local_stiffness(en, ei, ns+k) @ (get_transformation_matrix(en) @ ug)
        # quitar la carga de tramo (empotramiento perfecto) para dar fuerzas de extremo reales
        out.append(fL)
    out = np.array(out)
    # correccion por cargas distribuidas en barras: f_real = K u - f_eq
    for pn, fac in COMBOS[S["combo"]].items():
        for (e, segs) in M["loads"][pn]["frame"]:
            f = M["frames"][e]; a = np.linalg.norm(nodes[f["j"]] - nodes[f["i"]])
            if segs == "col_sw":        # peso de columna aplicado w/2 en cada nudo -> quitarlo (axil de extremo, criterio CSI)
                w = M["mat"]["gamma"]*M["secs"][f["sec"]]["A"]*a
                ex = get_transformation_matrix([nodes[f["i"]], nodes[f["j"]]])[0, 0:3]   # eje local x
                feq = np.zeros(12); feq[0] = -w/2*ex[2]; feq[6] = -w/2*ex[2]
                out[e] -= fac*feq
                continue
            Fi, Mi, Fj, Mj = _hermite_loads(a, segs)
            # en ejes locales de viga horizontal: z local = global Z  -> fuerza eq. -F en z, +M en y
            feq = np.zeros(12); feq[2] = -Fi; feq[8] = -Fj; feq[4] = Mi; feq[10] = Mj
            out[e] -= fac*feq
    return out


def shell_fields(M, S, envolvente=False):
    """Por piso: grids (gy, gx) de w[mm], Mxx, Myy, Mxy [tonf.m/m] (recovery DKQ nodal)."""
    if not M["shells"] or M["slabprop"]["bend"] == 0:
        return {}
    u = S["u"]; N, d, gx, gy = M["N"], M["d"], M["gx"], M["gy"]
    sl, mat = M["slabprop"], M["mat"]
    Db = (mod_matrices(mat["E"], mat["nu"], sl["t"], sl["mods"])[0] if sl.get("mods")
          else _dkq.dkq_bending_matrix(mat["E"], mat["nu"], sl["t"]))
    res = {}
    for k in range(1, int(M["P"]["pisos"])+1):
        w = np.zeros((gy, gx))
        for j in range(gy):
            for i in range(gx):
                w[j, i] = u[M["fn"](k, i, j)*6+2]*1000
        el = {c: np.zeros((gy-1, gx-1, 4)) for c in ("Mxx", "Myy", "Mxy")}      # valor de CADA elemento en sus 4 esquinas (como la tabla «Element Forces - Area Shells» de ETABS)
        gp = {c: np.zeros((gy-1, gx-1, 4)) for c in ("Mxx", "Myy", "Mxy")}      # valor en cada punto de Gauss 2x2 DENTRO del elemento (orden MH._GP)
        env = {c: np.zeros((gy, gx)) for c in ("Mxx", "Myy", "Mxy")}
        acc = {c: np.zeros((gy, gx)) for c in ("Mxx", "Myy", "Mxy")}; cnt = np.zeros((gy, gx))
        for s in M["shells"]:
            if s["piso"] != k: continue
            ue = np.zeros(12)
            for ni, gn in enumerate(s["n"]):
                ue[3*ni:3*ni+3] = [u[gn*6+2], u[gn*6+3], u[gn*6+4]]
            ud = MH._Pdkq @ ue
            G = np.array([Db @ (_dkq._dkq_Bmatrix(xi, eta, d, d) @ ud) for (xi, eta) in MH._GP])
            nod = MH._AEXT @ G                                   # 4 nudos x (M11, M22, M12)
            for ci, c in enumerate(("Mxx", "Myy", "Mxy")):
                gp[c][s["gj"], s["gi"], :] = G[:, ci]/GRAV
            for c4, (di, dj) in enumerate([(0, 0), (1, 0), (1, 1), (0, 1)]):
                ii, jj = s["gi"] + di, s["gj"] + dj; cnt[jj, ii] += 1
                for ci, c in enumerate(("Mxx", "Myy", "Mxy")):
                    v = nod[c4, ci]/GRAV; acc[c][jj, ii] += v; el[c][s["gj"], s["gi"], c4] = v
                    if abs(v) > abs(env[c][jj, ii]): env[c][jj, ii] = v
        F = env if envolvente else {c: acc[c]/np.maximum(cnt, 1) for c in acc}
        res[k] = dict(w=w, el=el, gp=gp, **F)
    return res


def resumen(M, S):
    """Numeros de control para comparar entre programas (kN, m, tonf)."""
    ff = frame_forces(M, S); u = S["u"]
    col = [e for e, f in enumerate(M["frames"]) if f["tipo"] == "col"]
    vig = [e for e, f in enumerate(M["frames"]) if f["tipo"] == "viga"]
    base = list(M["restr"].keys())
    uz = u[2::6]
    out = dict(
        uz_min_mm=float(uz.min()*1000),
        Rz_total_kN=float(sum(S["R"][n*6+2] for n in base)),
        col_N_max_kN=float(np.abs(ff[col][:, [0, 6]]).max()),
        col_M_max_kNm=float(np.abs(ff[col][:, [4, 5, 10, 11]]).max()),
        viga_M_max_kNm=float(np.abs(ff[vig][:, [4, 10]]).max()),
        viga_T_max_kNm=float(np.abs(ff[vig][:, [3, 9]]).max()),
        viga_V_max_kN=float(np.abs(ff[vig][:, [2, 8]]).max()),
    )
    sf = shell_fields(M, S, envolvente=True)          # numeros de control: maximo de la tabla de elementos (como ETABS)
    if sf:
        out["losa_Mxx_max_tonfm"] = float(max(np.abs(v["Mxx"]).max() for v in sf.values()))
        out["losa_Mxy_max_tonfm"] = float(max(np.abs(v["Mxy"]).max() for v in sf.values()))
    return out


if __name__ == "__main__":
    import json, sys
    M = build(); S = solve(M, "L")
    print(json.dumps(resumen(M, S), indent=1))


# ============================================================
#  MODAL (masa lumped lateral + Guyan), generaliza mesa_hekatan.modal_shapes
# ============================================================
def modal(M, nmodes=6):
    """[(T, px%, py%, prz%, phi_por_nudo {n:(ux,uy)}), ...].
    Masa lateral (UX,UY) estilo ETABS con offsets=0: losa rho*t_peso por area tributaria a
    sus nudos (sin losa: el pano reparte a sus 4 esquinas), vigas rho*A*d mitad a cada nudo,
    columnas rho*A*H mitad arriba / mitad abajo.  Condensacion de Guyan a los GDL con masa."""
    from scipy.linalg import eigh
    K, _ = assemble_K(M)
    nodes, P, sl, rho = M["nodes"], M["P"], M["slabprop"], M["mat"]["rho"]
    dof = K.shape[0]
    fixed = fixed_dofs(M, K)
    mnode = {}
    def add(n, m): mnode[n] = mnode.get(n, 0.0) + m
    d, N, L = M["d"], M["N"], P["Lx"]
    if M["shells"]:
        for s in M["shells"]:
            for n in s["n"]: add(n, rho*sl["t_peso"]*d*d/4)
    else:
        for k in range(1, int(P["pisos"])+1):
            for bj in range(int(P["ny"])):
                for bi in range(int(P["nx"])):
                    for (di, dj) in [(0, 0), (1, 0), (1, 1), (0, 1)]:
                        add(M["fn"](k, (bi+di)*N, (bj+dj)*N), rho*sl["t_peso"]*L*L/4)
    for f in M["frames"]:
        a = np.linalg.norm(nodes[f["j"]] - nodes[f["i"]]); m = rho*M["secs"][f["sec"]]["A"]*a
        add(f["i"], m/2); add(f["j"], m/2)
    base = set(M["restr"])
    mast = [n for n, m in mnode.items() if n not in base and m > 0]
    masters = [g for n in mast for g in (n*6, n*6+1)]
    free = np.setdiff1d(np.arange(dof), fixed)
    fpos = {g: k for k, g in enumerate(free)}
    mset = set(masters)
    mi = np.array([fpos[g] for g in masters]); si = np.array([k for g, k in fpos.items() if g not in mset])
    Kf = K[free][:, free].tocsc()
    Kmm = Kf[mi][:, mi].toarray(); Kms = Kf[mi][:, si].toarray(); Ksm = Kf[si][:, mi].toarray()
    Kc = Kmm - Kms @ spla.splu(Kf[si][:, si].tocsc()).solve(Ksm)
    Md = np.array([mnode[n] for n in mast for _ in (0, 1)])
    inv2 = 1/np.sqrt(Md)
    w2, V = eigh(0.5*((inv2[:, None]*Kc*inv2[None, :]) + (inv2[:, None]*Kc*inv2[None, :]).T))
    Mtot = Md.sum()/2
    xy = np.array([nodes[n][:2] for n in mast]); mm = np.array([mnode[n] for n in mast])
    xc, yc = (mm[:, None]*xy).sum(0)/mm.sum()
    Jcm = (mm*((xy[:, 0]-xc)**2 + (xy[:, 1]-yc)**2)).sum()
    out = []
    for k in np.argsort(w2):
        if w2[k] <= 1e-9: continue
        phi = inv2*V[:, k]; ux, uy = phi[0::2], phi[1::2]
        Mg = float(phi @ (Md*phi))
        Lx_, Ly_ = (mm*ux).sum(), (mm*uy).sum()
        Lr = (mm*(-(xy[:, 1]-yc)*ux + (xy[:, 0]-xc)*uy)).sum()
        amax = max(np.abs(phi).max(), 1e-12)
        out.append((2*np.pi/np.sqrt(w2[k]), Lx_**2/Mg/Mtot*100, Ly_**2/Mg/Mtot*100, Lr**2/Mg/Jcm*100,
                    {n: (ux[s]/amax, uy[s]/amax) for s, n in enumerate(mast)}))
        if len(out) >= nmodes: break
    return out
