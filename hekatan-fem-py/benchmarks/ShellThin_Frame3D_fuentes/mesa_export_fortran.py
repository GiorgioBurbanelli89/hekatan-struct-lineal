"""Exportador Mesa de Torsion general -> Fortran (.f90) autonomo.

El .f90 hace TODO el calculo numerico: arma K (barra Timoshenko 3D + losa ShellThin
= membrana Q6 + flexion DKQ-Batoz + drilling tipo 0; losa waffle con los 10 modificadores CSI
sobre Db/Em como mesa_modelo.mod_matrices), cargas nodales equivalentes
(Hermite de las cargas de barra nativas del modelo, presion de area por area tributaria,
peso propio de columnas), fija GDL (apoyos + GDL sin rigidez, igual que
mesa_modelo.fixed_dofs), resuelve con Cholesky skyline y recupera fuerzas de barra,
reaccion total y momentos DKQ de losa.  Imprime los mismos numeros que
mesa_modelo.resumen().

Escrito dentro del subconjunto que soporta el interprete Hekatan Fortran
(sin subrutinas, sin arreglos 2D, sin allocatable, sin exit/cycle, sin DATA):
 - matrices aplanadas a 1D (fila mayor), tamanos fijos como PARAMETER generados aqui
 - productos punto con  sum([ (a(i)*b(i), i = i0, i1) ])  (no cuenta pasos en el interprete)
 - reales impresos como enteros (hi, lo, exp10) porque el print del interprete da 6 decimales
El mismo .f90 compila en gfortran (-ffree-line-length-none).

Salida (una linea por dato):   R <clave> <hi> <lo> <e10>     valor = (hi + lo*1e-7)*1e-7*10**e10
                               INFO ndof nsky    T <segundos>
"""
from __future__ import annotations
import numpy as np

import mesa_modelo as MM
from hekatan_fem.utils.transformation import shell_q4

KEYS = ["uz_min_mm", "Rz_total_kN", "col_N_max_kN", "col_M_max_kNm", "viga_M_max_kNm",
        "viga_T_max_kNm", "viga_V_max_kN", "losa_Mxx_max_tonfm", "losa_Mxy_max_tonfm"]


def _f(v):
    """real(8) literal exacto (repr de Python = round-trip)."""
    s = repr(float(v))
    if "inf" in s or "nan" in s:
        raise ValueError(v)
    return s.replace("e", "d") if "e" in s else s + "d0"


def _pack(stmts, width=120):
    """Varias asignaciones por linea separadas por ';' (linea < 132 para gfortran)."""
    out, cur = [], ""
    for s in stmts:
        if cur and len(cur) + 2 + len(s) > width:
            out.append("  " + cur); cur = s
        else:
            cur = s if not cur else cur + "; " + s
    if cur:
        out.append("  " + cur)
    return out


def _skyline_size(M):
    nn = len(M["nodes"]); ndof = 6*nn
    top = np.arange(ndof)
    els = [s["n"] for s in M["shells"]] + [[f["i"], f["j"]] for f in M["frames"]]
    for el in els:
        mn = 6*min(el)
        for n in el:
            top[6*n:6*n+6] = np.minimum(top[6*n:6*n+6], mn)
    return int(np.sum(np.arange(ndof) - top + 1))


def _check_shells(M):
    """Todas las losas: rectangulo horizontal, mismo tamano, ejes locales = globales
    (T = I).  Entonces la K 24x24 es la misma para todas y se calcula una vez."""
    nodes = M["nodes"]; ref = None
    for s in M["shells"]:
        p = [nodes[i] for i in s["n"]]
        T = shell_q4(*p)
        assert np.allclose(T, np.eye(24), atol=1e-12), "losa no alineada con ejes globales"
        c = 0.25*sum(p)
        xy = np.array([[q[0]-c[0], q[1]-c[1]] for q in p])
        if ref is None:
            ref = xy
        assert np.allclose(xy, ref, atol=1e-12), "losas de distinto tamano"


# ------------------------------------------------------------------ bloques Fortran
_DKQ_B = """\
    ! --- B de DKQ (3x12) en (xi,eta) para lados dxx, dyy  (python_dkq._dkq_Bmatrix) ---
    rxw1 =  3.0d0*xi*(1.0d0-eta)/dxx**2;  rxt1 = (1.0d0-eta)*(3.0d0*xi-1.0d0)/(2.0d0*dxx)
    rxw2 = -3.0d0*xi*(1.0d0-eta)/dxx**2;  rxt2 = (1.0d0-eta)*(1.0d0+3.0d0*xi)/(2.0d0*dxx)
    rxw3 = -3.0d0*xi*(1.0d0+eta)/dxx**2;  rxt3 = (1.0d0+eta)*(1.0d0+3.0d0*xi)/(2.0d0*dxx)
    rxw4 =  3.0d0*xi*(1.0d0+eta)/dxx**2;  rxt4 = (1.0d0+eta)*(3.0d0*xi-1.0d0)/(2.0d0*dxx)
    ryw1 =  3.0d0*(1.0d0-xi)*eta/dyy**2;  ryt1 = (1.0d0-xi)*(3.0d0*eta-1.0d0)/(2.0d0*dyy)
    ryw2 =  3.0d0*(1.0d0+xi)*eta/dyy**2;  ryt2 = (1.0d0+xi)*(3.0d0*eta-1.0d0)/(2.0d0*dyy)
    ryw3 = -3.0d0*(1.0d0+xi)*eta/dyy**2;  ryt3 = (1.0d0+xi)*(1.0d0+3.0d0*eta)/(2.0d0*dyy)
    ryw4 = -3.0d0*(1.0d0-xi)*eta/dyy**2;  ryt4 = (1.0d0-xi)*(1.0d0+3.0d0*eta)/(2.0d0*dyy)
    tt = 3.0d0*(2.0d0 - xi**2 - eta**2)/(2.0d0*dxx*dyy)
    rbx1 =  (1.0d0-xi)*(1.0d0+3.0d0*xi)/(4.0d0*dyy);   rby1 =  (1.0d0-eta)*(1.0d0+3.0d0*eta)/(4.0d0*dxx)
    rbx2 =  (1.0d0+xi)*(1.0d0-3.0d0*xi)/(4.0d0*dyy);   rby2 = -(1.0d0-eta)*(1.0d0+3.0d0*eta)/(4.0d0*dxx)
    rbx3 =  (1.0d0+xi)*(3.0d0*xi-1.0d0)/(4.0d0*dyy);   rby3 =  (1.0d0+eta)*(3.0d0*eta-1.0d0)/(4.0d0*dxx)
    rbx4 = -(1.0d0-xi)*(1.0d0+3.0d0*xi)/(4.0d0*dyy);   rby4 =  (1.0d0+eta)*(1.0d0-3.0d0*eta)/(4.0d0*dxx)
    bq(1) = rxw1; bq(2) = 0.0d0; bq(3) = rxt1; bq(4) = rxw2; bq(5) = 0.0d0; bq(6) = rxt2
    bq(7) = rxw3; bq(8) = 0.0d0; bq(9) = rxt3; bq(10) = rxw4; bq(11) = 0.0d0; bq(12) = rxt4
    bq(13) = ryw1; bq(14) = -ryt1; bq(15) = 0.0d0; bq(16) = ryw2; bq(17) = -ryt2; bq(18) = 0.0d0
    bq(19) = ryw3; bq(20) = -ryt3; bq(21) = 0.0d0; bq(22) = ryw4; bq(23) = -ryt4; bq(24) = 0.0d0
    bq(25) = tt; bq(26) = -rby1; bq(27) = rbx1; bq(28) = -tt; bq(29) = -rby2; bq(30) = rbx2
    bq(31) = tt; bq(32) = -rby3; bq(33) = rbx3; bq(34) = -tt; bq(35) = -rby4; bq(36) = rbx4
"""

# (fila, col, expresion) no nulos de _frame_k (0-based, mismo orden que local_stiffness.py)
_FRAME_NZ = [
    (0, 0, "eal"), (0, 6, "-eal"),
    (1, 1, "tz"), (1, 5, "bz"), (1, 7, "-tz"), (1, 11, "bz"),
    (2, 2, "ty"), (2, 4, "-by"), (2, 8, "-ty"), (2, 10, "-by"),
    (3, 3, "gjl"), (3, 9, "-gjl"),
    (4, 2, "-by"), (4, 4, "ky"), (4, 8, "by"), (4, 10, "ay"),
    (5, 1, "bz"), (5, 5, "kz"), (5, 7, "-bz"), (5, 11, "az"),
    (6, 0, "-eal"), (6, 6, "eal"),
    (7, 1, "-tz"), (7, 5, "-bz"), (7, 7, "tz"), (7, 11, "-bz"),
    (8, 2, "-ty"), (8, 4, "by"), (8, 8, "ty"), (8, 10, "by"),
    (9, 3, "-gjl"), (9, 9, "gjl"),
    (10, 2, "-by"), (10, 4, "ay"), (10, 8, "by"), (10, 10, "ky"),
    (11, 1, "bz"), (11, 5, "az"), (11, 7, "-bz"), (11, 11, "kz"),
]


def _enc(var, key):
    """Imprime var como  R key hi lo e10  (15 cifras) — el print del interprete da 6 decimales."""
    return f"""\
  vv = {var}
  if (vv == 0.0d0) then
    print *, 'R {key}', 0, 0, 0
  else
    ie = floor(log10(abs(vv)))
    mm = vv/10.0d0**ie
    if (abs(mm) >= 10.0d0) then
      ie = ie + 1; mm = vv/10.0d0**ie
    end if
    ihi = int(mm*1.0d7)
    ilo = nint((mm*1.0d7 - ihi)*1.0d7)
    print *, 'R {key}', ihi, ilo, ie
  end if
"""


def to_fortran(M, path, combo="L"):
    nodes = M["nodes"]; shells = M["shells"]; frames = M["frames"]
    mat, sl, P = M["mat"], M["slabprop"], M["P"]
    nn, nsh, nfr = len(nodes), len(shells), len(frames)
    if nsh:
        _check_shells(M)
    bend = sl["tipo"] in ("shellthin", "waffle")
    fac = MM.COMBOS[combo]
    facd, facs, facl = fac.get("D", 0.0), fac.get("SCP", 0.0), fac.get("L", 0.0)

    # cargas de barra nativas del modelo (tramos lineales), con el factor del combo
    segs = []
    for pn, fc in fac.items():
        for (e, sg) in M["loads"][pn]["frame"]:
            if isinstance(sg, str):          # "col_sw": lo calcula el Fortran (gamma*A*L)
                continue
            for (s0, s1, q0, q1) in sg:
                if s1 - s0 < 1e-12:
                    continue
                segs.append((e+1, s0, s1, q0, q1, fc))
    nseg = len(segs)
    restr = sorted(M["restr"].items())
    nrs = len(restr)
    nsky = _skyline_size(M)
    gl, gw = np.polynomial.legendre.leggauss(6)
    secs = [M["secs"]["COL"], M["secs"]["VIGA"]]

    L = []
    w = L.append
    w(f"! Mesa de Torsion general -- exportado por mesa_export_fortran.py")
    w(f"! nx={P['nx']} ny={P['ny']} pisos={P['pisos']} N={P['N']} losa={sl['tipo']} apoyo={P['support']} combo={combo}")
    w("! Calculo completo: K (Timoshenko 3D + ShellThin Q6/DKQ), cargas, Cholesky skyline, fuerzas.")
    w("program mesa_torsion")
    w("  implicit none")
    w(f"  integer, parameter :: nn = {nn}, nsh = {nsh}, nfr = {nfr}, nseg = {nseg}, nrs = {nrs}")
    w(f"  integer, parameter :: ndof = 6*nn, nsky = {nsky}")
    w("  integer, parameter :: msh = max(nsh, 1), mseg = max(nseg, 1)")
    w("  ! ---------------- datos del modelo ----------------")
    w("  real(8) :: xyz(3*nn)")
    w("  integer :: shn(4*msh), fri(nfr), frj(nfr), frtip(nfr), frsec(nfr)")
    w("  real(8) :: seca(2), seciy(2), seciz(2), secj(2)")
    w("  integer :: sge(mseg), rsn(nrs), rsf(6*nrs)")
    w("  real(8) :: sgs0(mseg), sgs1(mseg), sgq0(mseg), sgq1(mseg), sgf(mseg), glx(6), glw(6)")
    w("  real(8) :: emod, pois, gmod, gam, tsl, bendf, membf, dsh, facd, facs, facl, pd, ps, pl, grav")
    w("  real(8) :: fm11, fm22, fm12, mm11, mm22, mm12")
    w("  integer :: ibend, imod")
    w("  ! ---------------- trabajo ----------------")
    w("  real(8) :: xl(4), yl(4), kuu(64), kua(32), kaa(16), xs(32), km(64), kd(144), kb(144), ksh(576)")
    w("  real(8) :: bm(24), gm(12), eb(24), eg(12), dnx(4), dne(4), gp2(2), em(9), dbm(9), bq(36), db(36)")
    w("  real(8) :: sgn(12), gxs(4), ges(4), bgr(144), aext(16), ud(12), kap(3), mg(12), nod(12)")
    w("  real(8) :: frl(nfr), frlam(9*nfr), frk(144*nfr), frg(144*nfr), kl(144), tmp(144), lam(9)")
    w("  integer :: top(ndof), md(ndof), fx(ndof), gd(24)")
    w("  real(8) :: sk(nsky), f(ndof), fo(ndof), u(ndof), r(ndof), feq(4*nfr), ug(12), ul(12), fe(12), hq(4)")
    w("  real(8) :: c0, j011, j012, j021, j022, dj0, ji011, ji012, ji021, ji022, xi, eta, j11, j12, j21, j22")
    w("  real(8) :: detj, ji11, ji12, ji21, ji22, dndx, dndy, dp1x, dp1y, dp2x, dp2y, wdet, fct, dxe, dye, dxx, dyy")
    w("  real(8) :: coef, jdet, drill, g3, s3, vx, vy, vz, ll, cl, cm, cn, dd, aa, ai, iy, iz, as, phiy, phiz")
    w("  real(8) :: eal, gjl, tz, bz, kz, az, ty, by, ky, ay, qs, wsw, s0, s1, q0, q1, ss, qq, xx, hn1, hn2, hn3, hn4")
    w("  real(8) :: rxw1, rxw2, rxw3, rxw4, rxt1, rxt2, rxt3, rxt4, ryw1, ryw2, ryw3, ryw4, ryt1, ryt2, ryt3, ryt4")
    w("  real(8) :: tt, rbx1, rbx2, rbx3, rbx4, rby1, rby2, rby3, rby4, dmax, t0, t1, vv, mm")
    w("  real(8) :: uzmin, rztot, cnmax, cmmax, vmmax, vtmax, vvmax, mxxmax, mxymax")
    w("  integer :: i, j, k, a, b, e, n, ni, nj, di, dj, ix, iy2, ig, ic, p, q, kk, tj, mn, blk, ie, ihi, ilo, ks")
    w("  call cpu_time(t0)")

    # --- datos ---
    st = []
    for n in range(nn):
        for c in range(3):
            st.append(f"xyz({3*n+c+1}) = {_f(nodes[n][c])}")
    for e, s in enumerate(shells):
        for c in range(4):
            st.append(f"shn({4*e+c+1}) = {s['n'][c]+1}")
    for e, fr in enumerate(frames):
        st += [f"fri({e+1}) = {fr['i']+1}", f"frj({e+1}) = {fr['j']+1}",
               f"frtip({e+1}) = {1 if fr['tipo'] == 'col' else 2}",
               f"frsec({e+1}) = {1 if fr['sec'] == 'COL' else 2}"]
    for k, sc in enumerate(secs):
        st += [f"seca({k+1}) = {_f(sc['A'])}", f"seciy({k+1}) = {_f(sc['Iy'])}",
               f"seciz({k+1}) = {_f(sc['Iz'])}", f"secj({k+1}) = {_f(sc['J'])}"]
    for k, (e, s0, s1, q0, q1, fc) in enumerate(segs):
        st += [f"sge({k+1}) = {e}", f"sgs0({k+1}) = {_f(s0)}", f"sgs1({k+1}) = {_f(s1)}",
               f"sgq0({k+1}) = {_f(q0)}", f"sgq1({k+1}) = {_f(q1)}", f"sgf({k+1}) = {_f(fc)}"]
    for k, (n, rf) in enumerate(restr):
        st.append(f"rsn({k+1}) = {n+1}")
        for c in range(6):
            st.append(f"rsf({6*k+c+1}) = {1 if rf[c] else 0}")
    for k in range(6):
        st += [f"glx({k+1}) = {_f(gl[k])}", f"glw({k+1}) = {_f(gw[k])}"]
    st += [f"emod = {_f(mat['E'])}", f"pois = {_f(mat['nu'])}", f"gmod = {_f(mat['G'])}",
           f"gam = {_f(mat['gamma'])}", f"tsl = {_f(sl['t'])}", f"bendf = {_f(sl['bend'])}",
           f"membf = {_f(sl['memb'])}", f"dsh = {_f(M['d'])}", f"grav = {_f(MM.GRAV)}",
           f"facd = {_f(facd)}", f"facs = {_f(facs)}", f"facl = {_f(facl)}",
           f"pd = {_f(M['loads']['D']['slab_q'])}", f"ps = {_f(P['qSCP'])}", f"pl = {_f(P['qL'])}",
           f"ibend = {1 if bend else 0}"]
    mods = sl.get("mods")
    md6 = list(mods[:6]) if mods else [1.0]*6
    st += [f"imod = {1 if mods else 0}"] + [f"{nm} = {_f(v)}" for nm, v in
           zip(["fm11", "fm22", "fm12", "mm11", "mm22", "mm12"], md6)]
    w("  ! ---------------- datos ----------------")
    L += _pack(st)
    L.append(_BODY.replace("@DKQB@", _DKQ_B))
    for var, key in [("uzmin", "uz_min_mm"), ("rztot", "Rz_total_kN"), ("cnmax", "col_N_max_kN"),
                     ("cmmax", "col_M_max_kNm"), ("vmmax", "viga_M_max_kNm"),
                     ("vtmax", "viga_T_max_kNm"), ("vvmax", "viga_V_max_kN")]:
        L.append(_enc(var, key))
    L.append("  if (ibend == 1 .and. nsh > 0) then")
    L.append(_enc("mxxmax", "losa_Mxx_max_tonfm"))
    L.append(_enc("mxymax", "losa_Mxy_max_tonfm"))
    L.append("  end if")
    L.append("  call cpu_time(t1)")
    L.append("  print *, 'T', t1 - t0")
    L.append("end program mesa_torsion")
    txt = "\n".join(L) + "\n"
    with open(path, "w", encoding="ascii") as fh:
        fh.write(txt)
    return dict(nn=nn, ndof=6*nn, nsh=nsh, nfr=nfr, nseg=nseg, nsky=nsky, lines=txt.count("\n"))


_FRAME_K_LINES = "\n".join(
    f"      kl({r*12+c+1}) = {ex}" for (r, c, ex) in _FRAME_NZ)

_BODY = r"""
  ! =================================================================
  ! 1) K de la losa (una sola: todas las losas son iguales, T = I)
  ! =================================================================
  do i = 1, 576
    ksh(i) = 0.0d0
  end do
  if (nsh > 0) then
    do i = 1, 4
      xl(i) = xyz(3*(shn(i)-1)+1) - 0.25d0*(xyz(3*(shn(1)-1)+1) + xyz(3*(shn(2)-1)+1) &
              + xyz(3*(shn(3)-1)+1) + xyz(3*(shn(4)-1)+1))
      yl(i) = xyz(3*(shn(i)-1)+2) - 0.25d0*(xyz(3*(shn(1)-1)+2) + xyz(3*(shn(2)-1)+2) &
              + xyz(3*(shn(3)-1)+2) + xyz(3*(shn(4)-1)+2))
    end do
    ! ---- membrana Q6 (modos incompatibles de Wilson, shell_thin._membrane_k_q6) ----
    c0 = emod/(1.0d0 - pois*pois)
    em(1) = c0; em(2) = c0*pois; em(3) = 0.0d0
    em(4) = c0*pois; em(5) = c0; em(6) = 0.0d0
    em(7) = 0.0d0; em(8) = 0.0d0; em(9) = c0*(1.0d0 - pois)/2.0d0
    if (imod == 1) then
      ! modificadores CSI (mesa_modelo.mod_matrices): F11, F22, F12 -> Em
      em(1) = c0*fm11; em(2) = c0*(pois*sqrt(fm11*fm22)); em(4) = em(2)
      em(5) = c0*fm22; em(9) = c0*((1.0d0 - pois)/2.0d0*fm12)
    end if
    gp2(1) = -1.0d0/sqrt(3.0d0); gp2(2) = 1.0d0/sqrt(3.0d0)
    dnx(1) = -0.25d0; dnx(2) = 0.25d0; dnx(3) = 0.25d0; dnx(4) = -0.25d0
    dne(1) = -0.25d0; dne(2) = -0.25d0; dne(3) = 0.25d0; dne(4) = 0.25d0
    j011 = sum([ (dnx(i)*xl(i), i = 1, 4) ]); j012 = sum([ (dnx(i)*yl(i), i = 1, 4) ])
    j021 = sum([ (dne(i)*xl(i), i = 1, 4) ]); j022 = sum([ (dne(i)*yl(i), i = 1, 4) ])
    dj0 = j011*j022 - j012*j021
    ji011 = j022/dj0; ji012 = -j012/dj0; ji021 = -j021/dj0; ji022 = j011/dj0
    do i = 1, 64
      kuu(i) = 0.0d0
    end do
    do i = 1, 32
      kua(i) = 0.0d0
    end do
    do i = 1, 16
      kaa(i) = 0.0d0
    end do
    do ix = 1, 2
      do iy2 = 1, 2
        xi = gp2(ix); eta = gp2(iy2)
        dnx(1) = -0.25d0*(1.0d0 - eta); dnx(2) = 0.25d0*(1.0d0 - eta)
        dnx(3) = 0.25d0*(1.0d0 + eta); dnx(4) = -0.25d0*(1.0d0 + eta)
        dne(1) = -0.25d0*(1.0d0 - xi); dne(2) = -0.25d0*(1.0d0 + xi)
        dne(3) = 0.25d0*(1.0d0 + xi); dne(4) = 0.25d0*(1.0d0 - xi)
        j11 = sum([ (dnx(i)*xl(i), i = 1, 4) ]); j12 = sum([ (dnx(i)*yl(i), i = 1, 4) ])
        j21 = sum([ (dne(i)*xl(i), i = 1, 4) ]); j22 = sum([ (dne(i)*yl(i), i = 1, 4) ])
        detj = j11*j22 - j12*j21
        ji11 = j22/detj; ji12 = -j12/detj; ji21 = -j21/detj; ji22 = j11/detj
        do i = 1, 24
          bm(i) = 0.0d0
        end do
        do i = 1, 4
          dndx = ji11*dnx(i) + ji12*dne(i)
          dndy = ji21*dnx(i) + ji22*dne(i)
          bm(2*i-1) = dndx; bm(8+2*i) = dndy; bm(16+2*i-1) = dndy; bm(16+2*i) = dndx
        end do
        dp1x = ji011*(-2.0d0*xi); dp1y = ji021*(-2.0d0*xi)
        dp2x = ji012*(-2.0d0*eta); dp2y = ji022*(-2.0d0*eta)
        do i = 1, 12
          gm(i) = 0.0d0
        end do
        gm(1) = dp1x; gm(9) = dp1y; gm(2) = dp2x; gm(10) = dp2y
        gm(7) = dp1y; gm(11) = dp1x; gm(8) = dp2y; gm(12) = dp2x
        wdet = tsl*detj
        do i = 1, 3
          do j = 1, 8
            eb((i-1)*8+j) = sum([ (em((i-1)*3+k)*bm((k-1)*8+j), k = 1, 3) ])
          end do
          do j = 1, 4
            eg((i-1)*4+j) = sum([ (em((i-1)*3+k)*gm((k-1)*4+j), k = 1, 3) ])
          end do
        end do
        do a = 1, 8
          do b = 1, 8
            kuu((a-1)*8+b) = kuu((a-1)*8+b) + wdet*sum([ (bm((k-1)*8+a)*eb((k-1)*8+b), k = 1, 3) ])
          end do
          do b = 1, 4
            kua((a-1)*4+b) = kua((a-1)*4+b) + wdet*sum([ (bm((k-1)*8+a)*eg((k-1)*4+b), k = 1, 3) ])
          end do
        end do
        do a = 1, 4
          do b = 1, 4
            kaa((a-1)*4+b) = kaa((a-1)*4+b) + wdet*sum([ (gm((k-1)*4+a)*eg((k-1)*4+b), k = 1, 3) ])
          end do
        end do
      end do
    end do
    ! condensacion: xs = kaa^-1 * kua^T  (Gauss, kaa SPD)
    do a = 1, 4
      do b = 1, 8
        xs((a-1)*8+b) = kua((b-1)*4+a)
      end do
    end do
    do k = 1, 3
      do i = k+1, 4
        fct = kaa((i-1)*4+k)/kaa((k-1)*4+k)
        do j = k, 4
          kaa((i-1)*4+j) = kaa((i-1)*4+j) - fct*kaa((k-1)*4+j)
        end do
        do j = 1, 8
          xs((i-1)*8+j) = xs((i-1)*8+j) - fct*xs((k-1)*8+j)
        end do
      end do
    end do
    do i = 4, 1, -1
      do j = 1, 8
        xs((i-1)*8+j) = (xs((i-1)*8+j) - sum([ (kaa((i-1)*4+k)*xs((k-1)*8+j), k = i+1, 4) ])) &
                        / kaa((i-1)*4+i)
      end do
    end do
    do a = 1, 8
      do b = 1, 8
        km((a-1)*8+b) = (kuu((a-1)*8+b) - sum([ (kua((a-1)*4+k)*xs((k-1)*8+b), k = 1, 4) ]))*membf
      end do
    end do
    ! ---- flexion DKQ-Batoz (python_dkq + permutacion _Pdkq de mesa_hekatan) ----
    coef = emod*tsl**3/(12.0d0*(1.0d0 - pois**2))
    dbm(1) = coef; dbm(2) = coef*pois; dbm(3) = 0.0d0
    dbm(4) = coef*pois; dbm(5) = coef; dbm(6) = 0.0d0
    dbm(7) = 0.0d0; dbm(8) = 0.0d0; dbm(9) = coef*(1.0d0 - pois)/2.0d0
    if (imod == 1) then
      ! modificadores CSI: D11*m11, D22*m22, D12*sqrt(m11 m22), D66*m12 (rigidez y recuperacion)
      coef = emod*tsl**3/(12.0d0*(1.0d0 - pois*pois))
      dbm(1) = coef*mm11; dbm(2) = coef*(pois*sqrt(mm11*mm22)); dbm(4) = dbm(2)
      dbm(5) = coef*mm22; dbm(9) = coef*((1.0d0 - pois)/2.0d0*mm12)
    end if
    g3 = 1.0d0/sqrt(3.0d0)
    gxs(1) = -g3; gxs(2) = g3; gxs(3) = g3; gxs(4) = -g3
    ges(1) = -g3; ges(2) = -g3; ges(3) = g3; ges(4) = g3
    do i = 1, 12
      sgn(i) = -1.0d0
    end do
    sgn(1) = 1.0d0; sgn(4) = 1.0d0; sgn(7) = 1.0d0; sgn(10) = 1.0d0
    dxe = maxval(xl) - minval(xl); dye = maxval(yl) - minval(yl)
    dxx = dxe; dyy = dye
    jdet = (dxe/2.0d0)*(dye/2.0d0)
    do i = 1, 144
      kd(i) = 0.0d0
    end do
    do ig = 1, 4
      xi = gxs(ig); eta = ges(ig)
@DKQB@
      do i = 1, 3
        do j = 1, 12
          db((i-1)*12+j) = sum([ (dbm((i-1)*3+k)*bq((k-1)*12+j), k = 1, 3) ])
        end do
      end do
      do a = 1, 12
        do b = 1, 12
          kd((a-1)*12+b) = kd((a-1)*12+b) + sum([ (bq((k-1)*12+a)*db((k-1)*12+b), k = 1, 3) ])*jdet
        end do
      end do
    end do
    do a = 1, 12
      do b = 1, 12
        kb((a-1)*12+b) = sgn(a)*sgn(b)*kd((a-1)*12+b)*bendf
      end do
    end do
    ! ---- ensamble 24x24: u,v <- Km ; w,rx,ry <- Kb ; rz <- drilling tipo 0 ----
    do ni = 0, 3
      do nj = 0, 3
        do di = 0, 1
          do dj = 0, 1
            ksh((6*ni+di)*24 + 6*nj+dj + 1) = km((2*ni+di)*8 + 2*nj+dj + 1)
          end do
        end do
        do di = 0, 2
          do dj = 0, 2
            ksh((6*ni+2+di)*24 + 6*nj+2+dj + 1) = kb((3*ni+di)*12 + 3*nj+dj + 1)
          end do
        end do
      end do
    end do
    drill = 0.0d0
    do i = 1, 8
      drill = drill + abs(km((i-1)*8+i))
    end do
    drill = drill*1.0d-6/8.0d0
    if (drill < 1.0d-15) drill = emod*tsl*1.0d-6*max(membf, 1.0d-6)
    do i = 0, 3
      ksh((6*i+5)*24 + 6*i+5 + 1) = drill
    end do
    ! ---- B de recuperacion (lados = d, como shell_fields) y extrapolacion a nudos ----
    dxx = dsh; dyy = dsh
    do ig = 1, 4
      xi = gxs(ig); eta = ges(ig)
@DKQB@
      do i = 1, 36
        bgr((ig-1)*36+i) = bq(i)
      end do
    end do
    s3 = sqrt(3.0d0)
    aext(1) = 1.0d0 + s3/2.0d0; aext(2) = -0.5d0; aext(3) = 1.0d0 - s3/2.0d0; aext(4) = -0.5d0
    aext(5) = -0.5d0; aext(6) = 1.0d0 + s3/2.0d0; aext(7) = -0.5d0; aext(8) = 1.0d0 - s3/2.0d0
    aext(9) = 1.0d0 - s3/2.0d0; aext(10) = -0.5d0; aext(11) = 1.0d0 + s3/2.0d0; aext(12) = -0.5d0
    aext(13) = -0.5d0; aext(14) = 1.0d0 - s3/2.0d0; aext(15) = -0.5d0; aext(16) = 1.0d0 + s3/2.0d0
  end if

  ! =================================================================
  ! 2) Barras: Timoshenko 3D (local_stiffness._frame_k) y T (transformation.frame)
  ! =================================================================
  do e = 1, nfr
    ni = fri(e); nj = frj(e)
    vx = xyz(3*(nj-1)+1) - xyz(3*(ni-1)+1)
    vy = xyz(3*(nj-1)+2) - xyz(3*(ni-1)+2)
    vz = xyz(3*(nj-1)+3) - xyz(3*(ni-1)+3)
    ll = sqrt(vx*vx + vy*vy + vz*vz)
    frl(e) = ll
    cl = vx/ll; cm = vy/ll; cn = vz/ll
    dd = sqrt(cl*cl + cm*cm)
    if (abs(cn - 1.0d0) < 1.0d-9) then
      lam(1) = 0.0d0; lam(2) = 0.0d0; lam(3) = 1.0d0
      lam(4) = 0.0d0; lam(5) = 1.0d0; lam(6) = 0.0d0
      lam(7) = -1.0d0; lam(8) = 0.0d0; lam(9) = 0.0d0
    else if (abs(cn + 1.0d0) < 1.0d-9) then
      lam(1) = 0.0d0; lam(2) = 0.0d0; lam(3) = -1.0d0
      lam(4) = 0.0d0; lam(5) = 1.0d0; lam(6) = 0.0d0
      lam(7) = 1.0d0; lam(8) = 0.0d0; lam(9) = 0.0d0
    else
      lam(1) = cl; lam(2) = cm; lam(3) = cn
      lam(4) = -cm/dd; lam(5) = cl/dd; lam(6) = 0.0d0
      lam(7) = (-cl*cn)/dd; lam(8) = (-cm*cn)/dd; lam(9) = dd
    end if
    do i = 1, 9
      frlam((e-1)*9+i) = lam(i)
    end do
    ks = frsec(e)
    aa = seca(ks); iy = seciy(ks); iz = seciz(ks); ai = secj(ks)
    as = (5.0d0/6.0d0)*aa
    phiz = (12.0d0*emod*iz)/(gmod*as*ll*ll)
    phiy = (12.0d0*emod*iy)/(gmod*as*ll*ll)
    eal = emod*aa/ll
    gjl = gmod*ai/ll
    tz = (12.0d0*emod*iz/(ll**3))/(1.0d0 + phiz)
    bz = (6.0d0*emod*iz/(ll**2))/(1.0d0 + phiz)
    kz = (4.0d0*emod*iz/ll)*(1.0d0 + phiz/4.0d0)/(1.0d0 + phiz)
    az = (2.0d0*emod*iz/ll)*(1.0d0 - phiz/2.0d0)/(1.0d0 + phiz)
    ty = (12.0d0*emod*iy/(ll**3))/(1.0d0 + phiy)
    by = (6.0d0*emod*iy/(ll**2))/(1.0d0 + phiy)
    ky = (4.0d0*emod*iy/ll)*(1.0d0 + phiy/4.0d0)/(1.0d0 + phiy)
    ay = (2.0d0*emod*iy/ll)*(1.0d0 - phiy/2.0d0)/(1.0d0 + phiy)
    do i = 1, 144
      kl(i) = 0.0d0
    end do
@FRAMEK@
    ! kg = T^T kl T  (T diagonal por bloques de lam)
    do a = 1, 12
      do b = 1, 12
        blk = 3*((b-1)/3)
        tmp((a-1)*12+b) = sum([ (kl((a-1)*12+blk+k)*lam((k-1)*3+b-blk), k = 1, 3) ])
      end do
    end do
    do a = 1, 12
      blk = 3*((a-1)/3)
      do b = 1, 12
        frg((e-1)*144+(a-1)*12+b) = sum([ (lam((k-1)*3+a-blk)*tmp((blk+k-1)*12+b), k = 1, 3) ])
      end do
    end do
    do i = 1, 144
      frk((e-1)*144+i) = kl(i)
    end do
  end do

  ! =================================================================
  ! 3) Perfil skyline (todos los GDL) y ensamble
  ! =================================================================
  do j = 1, ndof
    top(j) = j
  end do
  do e = 1, nsh
    mn = 6*(min(shn(4*e-3), shn(4*e-2), shn(4*e-1), shn(4*e)) - 1) + 1
    do i = 1, 4
      n = shn(4*(e-1)+i)
      do k = 1, 6
        top(6*(n-1)+k) = min(top(6*(n-1)+k), mn)
      end do
    end do
  end do
  do e = 1, nfr
    mn = 6*(min(fri(e), frj(e)) - 1) + 1
    do k = 1, 6
      top(6*(fri(e)-1)+k) = min(top(6*(fri(e)-1)+k), mn)
      top(6*(frj(e)-1)+k) = min(top(6*(frj(e)-1)+k), mn)
    end do
  end do
  md(1) = 1
  do j = 2, ndof
    md(j) = md(j-1) + j - top(j) + 1
  end do
  print *, 'INFO', ndof, md(ndof)
  if (md(ndof) /= nsky) then
    print *, 'ERROR perfil skyline distinto al del exportador'
    stop
  end if
  do i = 1, nsky
    sk(i) = 0.0d0
  end do
  do e = 1, nsh
    do i = 1, 4
      do k = 1, 6
        gd(6*(i-1)+k) = 6*(shn(4*(e-1)+i)-1) + k
      end do
    end do
    do a = 1, 24
      do b = 1, 24
        if (gd(a) <= gd(b)) sk(md(gd(b)) - gd(b) + gd(a)) = sk(md(gd(b)) - gd(b) + gd(a)) + ksh((a-1)*24+b)
      end do
    end do
  end do
  do e = 1, nfr
    do k = 1, 6
      gd(k) = 6*(fri(e)-1) + k
      gd(6+k) = 6*(frj(e)-1) + k
    end do
    do a = 1, 12
      do b = 1, 12
        if (gd(a) <= gd(b)) sk(md(gd(b)) - gd(b) + gd(a)) = sk(md(gd(b)) - gd(b) + gd(a)) &
                                                            + frg((e-1)*144+(a-1)*12+b)
      end do
    end do
  end do

  ! =================================================================
  ! 4) Cargas nodales equivalentes
  ! =================================================================
  do j = 1, ndof
    f(j) = 0.0d0
  end do
  do i = 1, 4*nfr
    feq(i) = 0.0d0
  end do
  ! presion de losa por area tributaria (losa con flexion)
  if (ibend == 1) then
    qs = facd*pd + facs*ps + facl*pl
    do e = 1, nsh
      do i = 1, 4
        n = shn(4*(e-1)+i)
        f(6*(n-1)+3) = f(6*(n-1)+3) - qs*dsh*dsh/4.0d0
      end do
    end do
  end if
  ! peso propio de columnas: mitad a cada nudo
  do e = 1, nfr
    if (frtip(e) == 1) then
      wsw = gam*seca(frsec(e))*frl(e)
      f(6*(fri(e)-1)+3) = f(6*(fri(e)-1)+3) - facd*wsw/2.0d0
      f(6*(frj(e)-1)+3) = f(6*(frj(e)-1)+3) - facd*wsw/2.0d0
    end if
  end do
  ! cargas de barra lineales a trozos -> Hermite consistente (Gauss-Legendre 6)
  do k = 1, nseg
    e = sge(k); s0 = sgs0(k); s1 = sgs1(k); q0 = sgq0(k); q1 = sgq1(k); aa = frl(e)
    do i = 1, 4
      hq(i) = 0.0d0
    end do
    do ig = 1, 6
      ss = 0.5d0*(s1 - s0)*glx(ig) + 0.5d0*(s1 + s0)
      qq = q0 + (q1 - q0)*(ss - s0)/(s1 - s0)
      xx = ss/aa
      hn1 = 1.0d0 - 3.0d0*xx*xx + 2.0d0*xx**3; hn2 = aa*xx*(1.0d0 - xx)**2
      hn3 = 3.0d0*xx*xx - 2.0d0*xx**3; hn4 = aa*xx*xx*(xx - 1.0d0)
      hq(1) = hq(1) + 0.5d0*(s1 - s0)*glw(ig)*qq*hn1
      hq(2) = hq(2) + 0.5d0*(s1 - s0)*glw(ig)*qq*hn2
      hq(3) = hq(3) + 0.5d0*(s1 - s0)*glw(ig)*qq*hn3
      hq(4) = hq(4) + 0.5d0*(s1 - s0)*glw(ig)*qq*hn4
    end do
    ni = fri(e); nj = frj(e)
    f(6*(ni-1)+3) = f(6*(ni-1)+3) - sgf(k)*hq(1)
    f(6*(nj-1)+3) = f(6*(nj-1)+3) - sgf(k)*hq(3)
    do i = 1, 3
      f(6*(ni-1)+3+i) = f(6*(ni-1)+3+i) + sgf(k)*hq(2)*frlam((e-1)*9+3+i)
      f(6*(nj-1)+3+i) = f(6*(nj-1)+3+i) + sgf(k)*hq(4)*frlam((e-1)*9+3+i)
    end do
    do i = 1, 4
      feq(4*(e-1)+i) = feq(4*(e-1)+i) + sgf(k)*hq(i)
    end do
  end do
  do j = 1, ndof
    fo(j) = f(j)
  end do

  ! =================================================================
  ! 5) GDL fijos: apoyos + GDL sin rigidez (diag < 1e-9 max diag)
  ! =================================================================
  do j = 1, ndof
    fx(j) = 0
  end do
  do k = 1, nrs
    do i = 1, 6
      if (rsf(6*(k-1)+i) == 1) fx(6*(rsn(k)-1)+i) = 1
    end do
  end do
  dmax = 0.0d0
  do j = 1, ndof
    dmax = max(dmax, abs(sk(md(j))))
  end do
  do j = 1, ndof
    if (abs(sk(md(j))) < 1.0d-9*dmax) fx(j) = 1
  end do
  do j = 1, ndof
    if (fx(j) == 1) then
      do i = top(j), j-1
        sk(md(j)-j+i) = 0.0d0
      end do
      sk(md(j)) = 1.0d0
      f(j) = 0.0d0
    else
      do i = top(j), j-1
        if (fx(i) == 1) sk(md(j)-j+i) = 0.0d0
      end do
    end if
  end do

  ! =================================================================
  ! 6) Cholesky skyline  K = U^T U  y sustitucion
  ! =================================================================
  do j = 1, ndof
    tj = top(j); p = md(j) - j
    do i = tj, j-1
      q = md(i) - i; kk = max(top(i), tj)
      sk(p+i) = (sk(p+i) - sum([ (sk(q+k)*sk(p+k), k = kk, i-1) ]))/sk(md(i))
    end do
    sk(md(j)) = sqrt(sk(md(j)) - sum([ (sk(p+k)**2, k = tj, j-1) ]))
  end do
  do j = 1, ndof
    p = md(j) - j
    u(j) = (f(j) - sum([ (sk(p+k)*u(k), k = top(j), j-1) ]))/sk(md(j))
  end do
  do j = ndof, 1, -1
    p = md(j) - j
    u(j) = u(j)/sk(md(j))
    do k = top(j), j-1
      u(k) = u(k) - sk(p+k)*u(j)
    end do
  end do

  ! =================================================================
  ! 7) Reacciones  R = K u - F  (elemento a elemento, K sin restringir)
  ! =================================================================
  do j = 1, ndof
    r(j) = -fo(j)
  end do
  do e = 1, nsh
    do i = 1, 4
      do k = 1, 6
        gd(6*(i-1)+k) = 6*(shn(4*(e-1)+i)-1) + k
      end do
    end do
    do a = 1, 24
      r(gd(a)) = r(gd(a)) + sum([ (ksh((a-1)*24+b)*u(gd(b)), b = 1, 24) ])
    end do
  end do
  do e = 1, nfr
    do k = 1, 6
      gd(k) = 6*(fri(e)-1) + k
      gd(6+k) = 6*(frj(e)-1) + k
    end do
    do a = 1, 12
      r(gd(a)) = r(gd(a)) + sum([ (frg((e-1)*144+(a-1)*12+b)*u(gd(b)), b = 1, 12) ])
    end do
  end do
  rztot = 0.0d0
  do k = 1, nrs
    rztot = rztot + r(6*(rsn(k)-1)+3)
  end do
  uzmin = u(3)
  do n = 1, nn
    uzmin = min(uzmin, u(6*(n-1)+3))
  end do
  uzmin = uzmin*1000.0d0

  ! =================================================================
  ! 8) Fuerzas de barra (ejes locales): kl*(T*ug) - f_empotramiento
  ! =================================================================
  cnmax = 0.0d0; cmmax = 0.0d0; vmmax = 0.0d0; vtmax = 0.0d0; vvmax = 0.0d0
  do e = 1, nfr
    do k = 1, 6
      ug(k) = u(6*(fri(e)-1)+k)
      ug(6+k) = u(6*(frj(e)-1)+k)
    end do
    do a = 1, 12
      blk = 3*((a-1)/3)
      ul(a) = sum([ (frlam((e-1)*9+(a-blk-1)*3+k)*ug(blk+k), k = 1, 3) ])
    end do
    do a = 1, 12
      fe(a) = sum([ (frk((e-1)*144+(a-1)*12+b)*ul(b), b = 1, 12) ])
    end do
    fe(3) = fe(3) + feq(4*(e-1)+1)
    fe(5) = fe(5) - feq(4*(e-1)+2)
    fe(9) = fe(9) + feq(4*(e-1)+3)
    fe(11) = fe(11) - feq(4*(e-1)+4)
    if (frtip(e) == 1) then
      ! peso propio de columna aplicado w/2 en cada nudo -> se descuenta (axil de extremo, criterio CSI)
      wsw = gam*seca(frsec(e))*frl(e)
      fe(1) = fe(1) + facd*(wsw/2.0d0*frlam((e-1)*9+3))
      fe(7) = fe(7) + facd*(wsw/2.0d0*frlam((e-1)*9+3))
    end if
    if (frtip(e) == 1) then
      cnmax = max(cnmax, abs(fe(1)), abs(fe(7)))
      cmmax = max(cmmax, abs(fe(5)), abs(fe(6)), abs(fe(11)), abs(fe(12)))
    else
      vmmax = max(vmmax, abs(fe(5)), abs(fe(11)))
      vtmax = max(vtmax, abs(fe(4)), abs(fe(10)))
      vvmax = max(vvmax, abs(fe(3)), abs(fe(9)))
    end if
  end do

  ! =================================================================
  ! 9) Momentos de losa DKQ: Gauss 2x2 -> extrapolacion a nudos (envolvente |M|)
  ! =================================================================
  mxxmax = 0.0d0; mxymax = 0.0d0
  if (ibend == 1 .and. nsh > 0) then
    do e = 1, nsh
      do i = 1, 4
        n = shn(4*(e-1)+i)
        ud(3*(i-1)+1) = sgn(3*(i-1)+1)*u(6*(n-1)+3)
        ud(3*(i-1)+2) = sgn(3*(i-1)+2)*u(6*(n-1)+4)
        ud(3*(i-1)+3) = sgn(3*(i-1)+3)*u(6*(n-1)+5)
      end do
      do ig = 1, 4
        do ic = 1, 3
          kap(ic) = sum([ (bgr((ig-1)*36+(ic-1)*12+k)*ud(k), k = 1, 12) ])
        end do
        do ic = 1, 3
          mg((ig-1)*3+ic) = sum([ (dbm((ic-1)*3+k)*kap(k), k = 1, 3) ])
        end do
      end do
      do i = 1, 4
        do ic = 1, 3
          nod((i-1)*3+ic) = sum([ (aext((i-1)*4+k)*mg((k-1)*3+ic), k = 1, 4) ])
        end do
        mxxmax = max(mxxmax, abs(nod((i-1)*3+1)/grav))
        mxymax = max(mxymax, abs(nod((i-1)*3+3)/grav))
      end do
    end do
  end if

  ! =================================================================
  ! 10) Salida  (R clave hi lo e10  ->  valor = (hi + lo*1e-7)*1e-7*10**e10)
  ! =================================================================
""".replace("@FRAMEK@", _FRAME_K_LINES)


def parse_output(text):
    out, info = {}, {}
    for ln in text.splitlines():
        p = ln.split()
        if not p:
            continue
        if p[0] == "R" and len(p) == 5:
            hi, lo, e10 = int(p[2]), int(p[3]), int(p[4])
            out[p[1]] = (hi + lo*1e-7)*1e-7*10.0**e10
        elif p[0] == "INFO":
            info["ndof"], info["nsky"] = int(p[1]), int(p[2])
        elif p[0] == "T":
            info["t_interno_s"] = float(p[1])
        elif p[0] == "ERROR":
            info["error"] = ln
    return out, info


if __name__ == "__main__":
    import sys
    M = MM.build(dict(slab=sys.argv[1] if len(sys.argv) > 1 else "shellthin"))
    print(to_fortran(M, "mesa.f90"))
