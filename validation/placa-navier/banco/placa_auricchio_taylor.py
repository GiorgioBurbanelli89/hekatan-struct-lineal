# -*- coding: utf-8 -*-
r"""Placa cuadrilátera de Auricchio & Taylor (1994), transcrita de FEAPpv (código abierto de R. L. Taylor,
Regents of the University of California): `elements/shells/plate2d.f`, subrutinas plate2q, shpspq, geompq,
bmatpq y strepq.

    Auricchio, F. & Taylor, R. L. (1994). A shear deformable plate element with an exact thin limit.
    Computer Methods in Applied Mechanics and Engineering 118, 393-412. doi:10.1016/0045-7825(94)90009-4

- GDL por nudo [w, θx, θy]; curvaturas κx = θy,x, κy = −θx,y, κxy = θy,y − θx,x (bt_b de bmatpq).
- w LIGADO a los giros por las funciones de lado M_i (shpm): el cortante de los giros lleva
  N_i ± (f·co, f·si) de los dos lados que llegan al nudo (bwt_s).
- 4 burbujas en los giros (bb_b) y cortante MIXTO con 4 parámetros (N_s con J0); integración 3×3.
- Condensación: primero las burbujas, luego el cortante (como plate2q).
"""
import numpy as np

_g = np.sqrt(0.6)
GAUSS3 = [(a, b, wa * wb) for a, wa in ((-_g, 5 / 9), (0.0, 8 / 9), (_g, 5 / 9)) for b, wb in ((-_g, 5 / 9), (0.0, 8 / 9), (_g, 5 / 9))]


def _shp(xi, eta, xl):
    xi1p, xi1m, e1p, e1m = 1 + xi, 1 - xi, 1 + eta, 1 - eta
    xi2, eta2 = xi1p * xi1m, e1p * e1m
    N = 0.25 * np.array([xi1m * e1m, xi1p * e1m, xi1p * e1p, xi1m * e1p])
    dxi = 0.25 * np.array([-e1m, e1m, e1p, -e1p]); deta = 0.25 * np.array([-xi1m, -xi1p, xi1p, xi1m])
    jac = np.array([[dxi @ xl[:, 0], dxi @ xl[:, 1]], [deta @ xl[:, 0], deta @ xl[:, 1]]])   # jac(i,j) = Σ xl(j,k) shp(i,k)
    xsj = jac[0, 0] * jac[1, 1] - jac[0, 1] * jac[1, 0]
    jinv = np.array([[jac[1, 1], -jac[0, 1]], [-jac[1, 0], jac[0, 0]]]) / xsj
    shpn = np.array([-2 * xi * eta2, -2 * eta * xi2, xi2 * eta2])
    M = np.array([xi2 * e1m, xi1p * eta2, xi2 * e1p, xi1m * eta2]) * 0.0625
    Mxi = np.array([-xi * e1m * 0.125, eta2 * 0.0625, -xi * e1p * 0.125, -eta2 * 0.0625])
    Meta = np.array([-xi2 * 0.0625, -eta * xi1p * 0.125, xi2 * 0.0625, -eta * xi1m * 0.125])
    return N, dxi, deta, abs(xsj), jinv, shpn, M, Mxi, Meta


def _geom(xl):
    co = np.zeros(4); si = np.zeros(4)
    for i in range(4):
        j = (i + 1) % 4
        co[i] = -xl[i, 1] + xl[j, 1]; si[i] = xl[i, 0] - xl[j, 0]
    jac0 = 0.25 * np.array([[-xl[0, 0] + xl[1, 0] + xl[2, 0] - xl[3, 0], -xl[0, 1] + xl[1, 1] + xl[2, 1] - xl[3, 1]],
                            [-xl[0, 0] - xl[1, 0] + xl[2, 0] + xl[3, 0], -xl[0, 1] - xl[1, 1] + xl[2, 1] + xl[3, 1]]])
    return co, si, jac0


def _bmat(xi, eta, xl, co, si, jac0):
    N, dxi, deta, xsj, jinv, shpn, M, Mxi, Meta = _shp(xi, eta, xl)
    b1 = jinv[0, 0] * dxi + jinv[0, 1] * deta; b2 = jinv[1, 0] * dxi + jinv[1, 1] * deta
    f1 = jinv[0, 0] * Mxi + jinv[0, 1] * Meta; f2 = jinv[1, 0] * Mxi + jinv[1, 1] * Meta
    dj1 = (xl[0, 0] - xl[1, 0] + xl[2, 0] - xl[3, 0]) * 0.25
    dj2 = (xl[0, 1] - xl[1, 1] + xl[2, 1] - xl[3, 1]) * 0.25
    aa = jac0[0, 0] * dj2 - jac0[0, 1] * dj1; bb = jac0[1, 1] * dj1 - jac0[1, 0] * dj2
    Nj = shpn[2] / xsj
    Nj_xi = (shpn[0] * xsj - shpn[2] * aa) / xsj**2; Nj_eta = (shpn[1] * xsj - shpn[2] * bb) / xsj**2
    Nj_x = jinv[0, 0] * Nj_xi + jinv[0, 1] * Nj_eta; Nj_y = jinv[1, 0] * Nj_xi + jinv[1, 1] * Nj_eta
    xiNj_xi, xiNj_eta = Nj + xi * Nj_xi, xi * Nj_eta
    etaNj_xi, etaNj_eta = eta * Nj_xi, Nj + eta * Nj_eta
    xiNj_x = jinv[0, 0] * xiNj_xi + jinv[0, 1] * xiNj_eta; xiNj_y = jinv[1, 0] * xiNj_xi + jinv[1, 1] * xiNj_eta
    etaNj_x = jinv[0, 0] * etaNj_xi + jinv[0, 1] * etaNj_eta; etaNj_y = jinv[1, 0] * etaNj_xi + jinv[1, 1] * etaNj_eta
    ax, ay = etaNj_x * jac0[1, 0], etaNj_y * jac0[1, 0]
    bx, by = -xiNj_x * jac0[0, 0], -xiNj_y * jac0[0, 0]
    cx, cy = etaNj_x * jac0[1, 1], etaNj_y * jac0[1, 1]
    dx, dy = -xiNj_x * jac0[0, 1], -xiNj_y * jac0[0, 1]
    Bw = np.zeros((2, 12)); Bt = np.zeros((3, 12)); Bwt = np.zeros((2, 12))
    for i in range(4):
        Bw[0, 3 * i] = b1[i]; Bw[1, 3 * i] = b2[i]
        Bt[0, 3 * i + 2] = b1[i]; Bt[1, 3 * i + 1] = -b2[i]; Bt[2, 3 * i + 1] = -b1[i]; Bt[2, 3 * i + 2] = b2[i]
        c = (i + 3) % 4                                  # mod(i+2,4)+1 en base 1 = nudo anterior
        Bwt[0, 3 * i + 1] = f1[i] * co[i] - f1[c] * co[c]
        Bwt[0, 3 * i + 2] = N[i] + f1[i] * si[i] - f1[c] * si[c]
        Bwt[1, 3 * i + 1] = -N[i] + f2[i] * co[i] - f2[c] * co[c]
        Bwt[1, 3 * i + 2] = f2[i] * si[i] - f2[c] * si[c]
    Bb = np.array([[jac0[1, 1] * Nj_x, -jac0[0, 1] * Nj_x, cx, dx],
                   [-jac0[1, 0] * Nj_y, jac0[0, 0] * Nj_y, -ay, -by],
                   [-jac0[1, 0] * Nj_x + jac0[1, 1] * Nj_y, jac0[0, 0] * Nj_x - jac0[0, 1] * Nj_y, -ax + cy, -bx + dy]])
    Ns = np.array([[jac0[0, 0], jac0[1, 0], jac0[0, 0] * eta, jac0[1, 0] * xi],
                   [jac0[0, 1], jac0[1, 1], jac0[0, 1] * eta, jac0[1, 1] * xi]])
    return N, M, xsj, Bw, Bt, Bwt, Bb, Ns


def placa_at(xl, E, nu, t, q=0.0, kappa=5.0 / 6.0):
    """K (12x12), F (12) y una función `momentos(u, xi, eta)` -> [Mx, My, Mxy] (con burbujas recuperadas)."""
    xl = np.asarray(xl, float)
    co, si, jac0 = _geom(xl)
    D0 = E * t**3 / (12 * (1 - nu * nu)); Db = D0 * np.array([[1, nu, 0], [nu, 1, 0], [0, 0, (1 - nu) / 2]])
    Dsinv = np.eye(2) / (kappa * E / (2 * (1 + nu)) * t)
    Ktt = np.zeros((12, 12)); Kbt = np.zeros((4, 12)); Kbb = np.zeros((4, 4)); Kss = np.zeros((4, 4))
    Ksw = np.zeros((4, 12)); Kst = np.zeros((4, 12)); F = np.zeros(12)
    for xi, eta, w in GAUSS3:
        N, M, xsj, Bw, Bt, Bwt, Bb, Ns = _bmat(xi, eta, xl, co, si, jac0)
        dA = xsj * w
        Ktt += Bt.T @ Db @ Bt * dA; Kbt += Bb.T @ Db @ Bt * dA; Kbb += Bb.T @ Db @ Bb * dA
        Ksw += Ns.T @ Bw * dA; Kst += Ns.T @ Bwt * dA; Kss -= Ns.T @ Dsinv @ Ns * dA
        for i in range(4):                                   # carga consistente (w ligado)
            k = (i + 3) % 4
            F[3 * i] += q * N[i] * dA
            F[3 * i + 1] += q * (M[i] * co[i] - M[k] * co[k]) * dA
            F[3 * i + 2] += q * (M[i] * si[i] - M[k] * si[k]) * dA
    kbs = 16 / 9 * (jac0[0, 0] * jac0[1, 1] - jac0[0, 1] * jac0[1, 0]) * np.array([1, 1, 0.2, 0.2])
    Kbb_i = np.linalg.inv(Kbb)
    # 1) burbujas
    Kss2 = Kss - np.diag(kbs) @ Kbb_i @ np.diag(kbs)
    app1 = Kbb_i @ Kbt
    Kst2 = Kst - np.diag(kbs) @ app1
    Ktt2 = Ktt - Kbt.T @ app1
    # 2) cortante
    Ks = Ksw + Kst2
    Kss2_i = np.linalg.inv(Kss2)
    K = Ktt2 - Ks.T @ Kss2_i @ Ks

    def momentos(u, xi, eta):
        s = -Kss2_i @ (Ks @ u)                               # parámetros de cortante
        b = -Kbb_i @ (Kbt @ u + kbs * s)                      # burbujas
        _, _, _, _, Bt, _, Bb, _ = _bmat(xi, eta, xl, co, si, jac0)
        return Db @ (Bt @ u + Bb @ b)
    return K, F, momentos
