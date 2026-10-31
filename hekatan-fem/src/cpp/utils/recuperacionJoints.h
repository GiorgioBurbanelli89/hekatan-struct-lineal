// Recuperacion de esfuerzos en los JOINTS de los Q4 de cascara: membrana ITW y placa de Auricchio-Taylor (30-oct-2026).
// Antes vivian en TypeScript (utils/itwJoints.ts y utils/placaAT.ts, atJointMoments); ahora una sola copia aqui,
// a la que llama analyze.ts por el WASM (`itw_recovery`, `itw_k12`, `at_recovery`, definidas en getLocalStiffnessMatrix.cpp).
#pragma once
#include <cmath>
#include <algorithm>
#include <Eigen/Dense>

// ───────────────────────── Membrana ITW (Ibrahimbegovic, Taylor & Wilson 1990) ─────────────────────────
// K de 14 gdl (12 de nudo [u,v,thz] + 2 de burbuja) tal como la arma getMembraneITW (shellQ4.cpp): Allman por los lados +
// burbuja (1-r^2)(1-s^2), proyeccion FEAP del drilling, penalizacion P en el centro (gamma = gammaFac*mu) y reloj de arena.
// tipo 13 (defecto): ng 2, proyeccion, khg 2e-4 · 8: ng 3, proyeccion · 3: ng 3 sin proyeccion · 6: ng 2, khg 2e-4. Otros: no soportado.
struct ItwDeriv
{
    double N[4], dNx[4], dNy[4], dNBx, dNBy, gt1[4], gt2[4], gt3[4], gt4[4], dJ;
};

struct Itw14
{
    bool ok = false;
    double x[4], y[4], cx[4], cy[4];
    double mg1[4] = {0, 0, 0, 0}, mg4[4] = {0, 0, 0, 0}, mg23[4] = {0, 0, 0, 0};
    Eigen::Matrix3d Dm;
    Eigen::Matrix<double, 14, 14> K;

    ItwDeriv deriv(double r, double s) const
    {
        ItwDeriv d;
        const double dNxi[4] = {-0.25 * (1 - s), 0.25 * (1 - s), 0.25 * (1 + s), -0.25 * (1 + s)};
        const double dNeta[4] = {-0.25 * (1 - r), -0.25 * (1 + r), 0.25 * (1 + r), 0.25 * (1 - r)};
        d.N[0] = 0.25 * (1 - r) * (1 - s); d.N[1] = 0.25 * (1 + r) * (1 - s); d.N[2] = 0.25 * (1 + r) * (1 + s); d.N[3] = 0.25 * (1 - r) * (1 + s);
        double J00 = 0, J01 = 0, J10 = 0, J11 = 0;
        for (int i = 0; i < 4; ++i) { J00 += dNxi[i] * x[i]; J01 += dNxi[i] * y[i]; J10 += dNeta[i] * x[i]; J11 += dNeta[i] * y[i]; }
        double det = J00 * J11 - J01 * J10;
        if (std::abs(det) < 1e-15) det = 1e-15;
        const double inv = 1.0 / det;
        const double Ji[2][2] = {{J11 * inv, -J01 * inv}, {-J10 * inv, J00 * inv}};
        for (int i = 0; i < 4; ++i) { d.dNx[i] = Ji[0][0] * dNxi[i] + Ji[0][1] * dNeta[i]; d.dNy[i] = Ji[1][0] * dNxi[i] + Ji[1][1] * dNeta[i]; }
        const double nsr[4] = {-r * (1 - s), 0.5 * (1 - s * s), -r * (1 + s), -0.5 * (1 - s * s)};
        const double nss[4] = {-0.5 * (1 - r * r), -s * (1 + r), 0.5 * (1 - r * r), -s * (1 - r)};
        double NSx[4], NSy[4];
        for (int i = 0; i < 4; ++i) { NSx[i] = Ji[0][0] * nsr[i] + Ji[0][1] * nss[i]; NSy[i] = Ji[1][0] * nsr[i] + Ji[1][1] * nss[i]; }
        const double nbr = -2 * r * (1 - s * s), nbs = -2 * s * (1 - r * r);
        d.dNBx = Ji[0][0] * nbr + Ji[0][1] * nbs; d.dNBy = Ji[1][0] * nbr + Ji[1][1] * nbs;
        const int ant[4] = {3, 0, 1, 2};
        for (int i = 0; i < 4; ++i)
        {
            const int p = ant[i];
            d.gt1[i] = NSx[p] * cx[p] - NSx[i] * cx[i]; d.gt2[i] = NSy[p] * cx[p] - NSy[i] * cx[i];
            d.gt3[i] = NSx[p] * cy[p] - NSx[i] * cy[i]; d.gt4[i] = NSy[p] * cy[p] - NSy[i] * cy[i];
        }
        d.dJ = std::abs(det);
        return d;
    }

    // B (3x14) en (r,s) con la proyeccion del drilling
    Eigen::Matrix<double, 3, 14> Ben(double r, double s, ItwDeriv &d) const
    {
        d = deriv(r, s);
        Eigen::Matrix<double, 3, 14> B = Eigen::Matrix<double, 3, 14>::Zero();
        for (int i = 0; i < 4; ++i)
        {
            B(0, 3 * i) = d.dNx[i]; B(1, 3 * i + 1) = d.dNy[i]; B(2, 3 * i) = d.dNy[i]; B(2, 3 * i + 1) = d.dNx[i];
            B(0, 3 * i + 2) = d.gt1[i] - mg1[i]; B(1, 3 * i + 2) = d.gt4[i] - mg4[i]; B(2, 3 * i + 2) = d.gt2[i] + d.gt3[i] - mg23[i];
        }
        B(0, 12) = d.dNBx; B(2, 12) = d.dNBy; B(1, 13) = d.dNBy; B(2, 13) = d.dNBx;
        return B;
    }
};

static Itw14 ensamblarItw14(const double xl[4], const double yl[4], double E, double nu, double t, int tipo, double gammaFac,
                            const double *mod)
{
    Itw14 a;
    int ng; bool proy; double khg;
    if (tipo == 8) { ng = 3; proy = true; khg = 0; }
    else if (tipo == 3) { ng = 3; proy = false; khg = 0; }
    else if (tipo == 6) { ng = 2; proy = false; khg = 2e-4; }
    else if (tipo == 13) { ng = 2; proy = true; khg = 2e-4; }
    else return a;
    for (int i = 0; i < 4; ++i) { a.x[i] = xl[i]; a.y[i] = yl[i]; }
    const double f = E / (1 - nu * nu);
    a.Dm << f, f * nu, 0, f * nu, f, 0, 0, 0, f * (1 - nu) / 2;
    if (mod)
    {
        a.Dm(0, 0) *= mod[0]; a.Dm(1, 1) *= mod[1]; a.Dm(2, 2) *= mod[2];
        const double c = std::sqrt(std::max(0.0, mod[0] * mod[1])); a.Dm(0, 1) *= c; a.Dm(1, 0) *= c;
    }
    a.Dm *= t;
    const int sig[4] = {1, 2, 3, 0};
    for (int i = 0; i < 4; ++i) { a.cx[i] = (yl[sig[i]] - yl[i]) / 8; a.cy[i] = -(xl[sig[i]] - xl[i]) / 8; }
    const double GP2 = 0.5773502691896258;
    const double g3[3] = {-0.7745966692414834, 0, 0.7745966692414834}, w3[3] = {5.0 / 9, 8.0 / 9, 5.0 / 9};
    const double g2[2] = {-GP2, GP2}, w2[2] = {1, 1};
    const double *gg = ng == 2 ? g2 : g3, *wg = ng == 2 ? w2 : w3;
    if (proy)
    {
        double area = 0;
        for (int p = 0; p < ng; ++p) for (int q = 0; q < ng; ++q)
        {
            const ItwDeriv d = a.deriv(gg[p], gg[q]); const double w = wg[p] * wg[q] * d.dJ;
            for (int i = 0; i < 4; ++i) { a.mg1[i] += d.gt1[i] * w; a.mg4[i] += d.gt4[i] * w; a.mg23[i] += (d.gt2[i] + d.gt3[i]) * w; }
            area += w;
        }
        for (int i = 0; i < 4; ++i) { a.mg1[i] /= area; a.mg4[i] /= area; a.mg23[i] /= area; }
    }
    a.K.setZero();
    for (int p = 0; p < ng; ++p) for (int q = 0; q < ng; ++q)
    {
        ItwDeriv d; const Eigen::Matrix<double, 3, 14> B = a.Ben(gg[p], gg[q], d);
        a.K += B.transpose() * a.Dm * B * (wg[p] * wg[q] * d.dJ);
    }
    {
        const ItwDeriv d0 = a.deriv(0, 0);
        const double mu = E / (2 * (1 + nu)), gamma = gammaFac * mu;
        Eigen::Matrix<double, 14, 1> res = Eigen::Matrix<double, 14, 1>::Zero();
        for (int i = 0; i < 4; ++i) { res(3 * i) = -0.5 * d0.dNy[i]; res(3 * i + 1) = 0.5 * d0.dNx[i]; res(3 * i + 2) = 0.5 * (d0.gt3[i] - d0.gt2[i]) - d0.N[i]; }
        a.K += (gamma * t * 4 * d0.dJ) * res * res.transpose();
        if (khg > 0)
        {
            double A = 0;
            for (int i = 0; i < 4; ++i) { const int j = (i + 1) % 4; A += xl[i] * yl[j] - xl[j] * yl[i]; }
            A = std::abs(A) / 2;
            Eigen::Matrix<double, 14, 1> hg = Eigen::Matrix<double, 14, 1>::Zero();
            for (int i = 0; i < 4; ++i) hg(3 * i + 2) = i % 2 == 0 ? 1 : -1;
            a.K += (khg * mu * t * A / 4) * hg * hg.transpose();
        }
    }
    a.ok = true;
    return a;
}

// Fuerzas de membrana en los 4 joints [F11,F22,F12]: deformacion en Gauss 2x2 con la B proyectada y SIN burbuja, extrapolada
// bilinealmente a las esquinas (= AreaForceShell de ETABS 22 / SAP2000 24, 0.0000 % en 3760 joints). false si el tipo no existe.
static bool itwJointForces(const double xl[4], const double yl[4], const double *u12, double E, double nu, double t, int tipo,
                           double gammaFac, const double *mod, double out[12])
{
    const Itw14 a = ensamblarItw14(xl, yl, E, nu, t, tipo, gammaFac, mod);
    if (!a.ok) return false;
    Eigen::Matrix<double, 14, 1> uRec = Eigen::Matrix<double, 14, 1>::Zero();   // la burbuja NO entra al recuperar
    for (int i = 0; i < 12; ++i) uRec(i) = u12[i];
    const double GP2 = 0.5773502691896258;
    const double esq[4][2] = {{-1, -1}, {1, -1}, {1, 1}, {-1, 1}};
    Eigen::Vector3d Ng[4];
    for (int k = 0; k < 4; ++k)
    {
        ItwDeriv d; const Eigen::Matrix<double, 3, 14> B = a.Ben(esq[k][0] * GP2, esq[k][1] * GP2, d);
        Ng[k] = a.Dm * (B * uRec);
    }
    for (int j = 0; j < 4; ++j)
    {
        const double R = esq[j][0] / GP2, S = esq[j][1] / GP2;
        Eigen::Vector3d v = Eigen::Vector3d::Zero();
        for (int k = 0; k < 4; ++k) v += (((1 + esq[k][0] * R) * (1 + esq[k][1] * S)) / 4.0) * Ng[k];
        for (int c = 0; c < 3; ++c) out[3 * j + c] = v(c);
    }
    return true;
}

// K de membrana 12x12 condensada (burbuja eliminada): la misma con la que resuelve el motor (ejes locales, [u,v,thz]x4).
static bool itwK12(const double xl[4], const double yl[4], double E, double nu, double t, int tipo, double gammaFac, const double *mod,
                   double out[144])
{
    const Itw14 a = ensamblarItw14(xl, yl, E, nu, t, tipo, gammaFac, mod);
    if (!a.ok) return false;
    Eigen::Matrix<double, 12, 12> Kc = a.K.block<12, 12>(0, 0);
    const Eigen::Matrix2d Kbb = a.K.block<2, 2>(12, 12);
    const double det = Kbb.determinant();
    if (std::abs(det) > 1e-30) Kc -= a.K.block<12, 2>(0, 12) * Kbb.inverse() * a.K.block<2, 12>(12, 0);
    for (int i = 0; i < 12; ++i) for (int j = 0; j < 12; ++j) out[12 * i + j] = Kc(i, j);
    return true;
}

// ───────────────── Placa de Auricchio & Taylor (1994), transcrita de FEAPpv plate2d.f (plate2q, strepq) ─────────────────
struct ATB
{
    double N[4], M[4], xsj, Bw[2][12], Bt[3][12], Bwt[2][12], Bb[3][4], Ns[2][4];
};

static ATB atBmat(double xi, double eta, const double x[4], const double y[4], const double co[4], const double si[4], const double j0[2][2])
{
    ATB r;
    const double xp = 1 + xi, xm = 1 - xi, ep = 1 + eta, em = 1 - eta, xi2 = xp * xm, eta2 = ep * em;
    const double N[4] = {0.25 * xm * em, 0.25 * xp * em, 0.25 * xp * ep, 0.25 * xm * ep};
    const double dxi[4] = {-0.25 * em, 0.25 * em, 0.25 * ep, -0.25 * ep}, deta[4] = {-0.25 * xm, -0.25 * xp, 0.25 * xp, 0.25 * xm};
    double J[2][2] = {{0, 0}, {0, 0}};
    for (int k = 0; k < 4; ++k) { J[0][0] += dxi[k] * x[k]; J[0][1] += dxi[k] * y[k]; J[1][0] += deta[k] * x[k]; J[1][1] += deta[k] * y[k]; }
    double xsj = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    const double Ji[2][2] = {{J[1][1] / xsj, -J[0][1] / xsj}, {-J[1][0] / xsj, J[0][0] / xsj}};
    xsj = std::abs(xsj);
    const double shpn[3] = {-2 * xi * eta2, -2 * eta * xi2, xi2 * eta2};
    const double M[4] = {xi2 * em * 0.0625, xp * eta2 * 0.0625, xi2 * ep * 0.0625, xm * eta2 * 0.0625};
    const double Mxi[4] = {-xi * em * 0.125, eta2 * 0.0625, -xi * ep * 0.125, -eta2 * 0.0625};
    const double Meta[4] = {-xi2 * 0.0625, -eta * xp * 0.125, xi2 * 0.0625, -eta * xm * 0.125};
    double b1[4], b2[4], f1[4], f2[4];
    for (int i = 0; i < 4; ++i)
    {
        b1[i] = Ji[0][0] * dxi[i] + Ji[0][1] * deta[i]; b2[i] = Ji[1][0] * dxi[i] + Ji[1][1] * deta[i];
        f1[i] = Ji[0][0] * Mxi[i] + Ji[0][1] * Meta[i]; f2[i] = Ji[1][0] * Mxi[i] + Ji[1][1] * Meta[i];
    }
    const double dj1 = (x[0] - x[1] + x[2] - x[3]) * 0.25, dj2 = (y[0] - y[1] + y[2] - y[3]) * 0.25;
    const double aa = j0[0][0] * dj2 - j0[0][1] * dj1, bb = j0[1][1] * dj1 - j0[1][0] * dj2;
    const double Nj = shpn[2] / xsj;
    const double Nj_xi = (shpn[0] * xsj - shpn[2] * aa) / (xsj * xsj), Nj_eta = (shpn[1] * xsj - shpn[2] * bb) / (xsj * xsj);
    const double Nj_x = Ji[0][0] * Nj_xi + Ji[0][1] * Nj_eta, Nj_y = Ji[1][0] * Nj_xi + Ji[1][1] * Nj_eta;
    const double xiNj_xi = Nj + xi * Nj_xi, xiNj_eta = xi * Nj_eta, etaNj_xi = eta * Nj_xi, etaNj_eta = Nj + eta * Nj_eta;
    const double xiNj_x = Ji[0][0] * xiNj_xi + Ji[0][1] * xiNj_eta, xiNj_y = Ji[1][0] * xiNj_xi + Ji[1][1] * xiNj_eta;
    const double etaNj_x = Ji[0][0] * etaNj_xi + Ji[0][1] * etaNj_eta, etaNj_y = Ji[1][0] * etaNj_xi + Ji[1][1] * etaNj_eta;
    const double ax = etaNj_x * j0[1][0], ay = etaNj_y * j0[1][0], bx = -xiNj_x * j0[0][0], by = -xiNj_y * j0[0][0];
    const double cx = etaNj_x * j0[1][1], cy = etaNj_y * j0[1][1], dx = -xiNj_x * j0[0][1], dy = -xiNj_y * j0[0][1];
    for (int a = 0; a < 2; ++a) for (int j = 0; j < 12; ++j) { r.Bw[a][j] = 0; r.Bwt[a][j] = 0; }
    for (int a = 0; a < 3; ++a) for (int j = 0; j < 12; ++j) r.Bt[a][j] = 0;
    for (int i = 0; i < 4; ++i)
    {
        r.Bw[0][3 * i] = b1[i]; r.Bw[1][3 * i] = b2[i];
        r.Bt[0][3 * i + 2] = b1[i]; r.Bt[1][3 * i + 1] = -b2[i]; r.Bt[2][3 * i + 1] = -b1[i]; r.Bt[2][3 * i + 2] = b2[i];
        const int c = (i + 3) % 4;
        r.Bwt[0][3 * i + 1] = f1[i] * co[i] - f1[c] * co[c];
        r.Bwt[0][3 * i + 2] = N[i] + f1[i] * si[i] - f1[c] * si[c];
        r.Bwt[1][3 * i + 1] = -N[i] + f2[i] * co[i] - f2[c] * co[c];
        r.Bwt[1][3 * i + 2] = f2[i] * si[i] - f2[c] * si[c];
    }
    const double Bb[3][4] = {{j0[1][1] * Nj_x, -j0[0][1] * Nj_x, cx, dx},
                             {-j0[1][0] * Nj_y, j0[0][0] * Nj_y, -ay, -by},
                             {-j0[1][0] * Nj_x + j0[1][1] * Nj_y, j0[0][0] * Nj_x - j0[0][1] * Nj_y, -ax + cy, -bx + dy}};
    const double Ns[2][4] = {{j0[0][0], j0[1][0], j0[0][0] * eta, j0[1][0] * xi}, {j0[0][1], j0[1][1], j0[0][1] * eta, j0[1][1] * xi}};
    for (int a = 0; a < 3; ++a) for (int b = 0; b < 4; ++b) r.Bb[a][b] = Bb[a][b];
    for (int a = 0; a < 2; ++a) for (int b = 0; b < 4; ++b) r.Ns[a][b] = Ns[a][b];
    for (int i = 0; i < 4; ++i) { r.N[i] = N[i]; r.M[i] = M[i]; }
    r.xsj = xsj;
    return r;
}

// Momentos [Mx,My,Mxy] en las 4 esquinas (evaluados en la esquina, como strepq), con burbujas y cortante mixto recuperados.
// mod = [m11,m22,m12,v13,v23] o nullptr. Signo de la curvatura del solver (el que llama pone el de CSI).
static void atJointMoments(const double x[4], const double y[4], const double *u12, double E, double nu, double t, const double *mod,
                           double out[12])
{
    double co[4], si[4];
    for (int i = 0; i < 4; ++i) { const int j = (i + 1) % 4; co[i] = -y[i] + y[j]; si[i] = x[i] - x[j]; }
    const double j0[2][2] = {{0.25 * (-x[0] + x[1] + x[2] - x[3]), 0.25 * (-y[0] + y[1] + y[2] - y[3])},
                             {0.25 * (-x[0] - x[1] + x[2] + x[3]), 0.25 * (-y[0] - y[1] + y[2] + y[3])}};
    const double D0 = E * t * t * t / (12 * (1 - nu * nu));
    Eigen::Matrix3d Db;
    Db << D0, D0 * nu, 0, D0 * nu, D0, 0, 0, 0, D0 * (1 - nu) / 2;
    const double G = (5.0 / 6.0) * E / (2 * (1 + nu)) * t;
    double Gs[2] = {G, G};
    if (mod)
    {
        Db(0, 0) *= mod[0]; Db(1, 1) *= mod[1]; Db(2, 2) *= mod[2];
        const double c = std::sqrt(std::max(0.0, mod[0] * mod[1])); Db(0, 1) *= c; Db(1, 0) *= c;
        Gs[0] *= mod[3]; Gs[1] *= mod[4];
    }
    const double g3 = std::sqrt(0.6);
    const double P[3][2] = {{-g3, 5.0 / 9}, {0, 8.0 / 9}, {g3, 5.0 / 9}};
    Eigen::Matrix<double, 4, 12> Kbt = Eigen::Matrix<double, 4, 12>::Zero(), Ks = Eigen::Matrix<double, 4, 12>::Zero();
    Eigen::Matrix4d Kbb = Eigen::Matrix4d::Zero(), Kss = Eigen::Matrix4d::Zero();
    for (int ix = 0; ix < 3; ++ix) for (int iy = 0; iy < 3; ++iy)
    {
        const ATB b = atBmat(P[ix][0], P[iy][0], x, y, co, si, j0);
        const double dA = b.xsj * P[ix][1] * P[iy][1];
        Eigen::Matrix<double, 3, 12> Bt; Eigen::Matrix<double, 3, 4> Bb; Eigen::Matrix<double, 2, 12> BwBwt; Eigen::Matrix<double, 2, 4> Ns;
        for (int r = 0; r < 3; ++r) { for (int j = 0; j < 12; ++j) Bt(r, j) = b.Bt[r][j]; for (int j = 0; j < 4; ++j) Bb(r, j) = b.Bb[r][j]; }
        for (int r = 0; r < 2; ++r) { for (int j = 0; j < 12; ++j) BwBwt(r, j) = b.Bw[r][j] + b.Bwt[r][j]; for (int j = 0; j < 4; ++j) Ns(r, j) = b.Ns[r][j]; }
        const Eigen::Matrix<double, 3, 12> DBt = Db * Bt;
        const Eigen::Matrix<double, 3, 4> DBb = Db * Bb;
        Kbt += Bb.transpose() * DBt * dA;
        Ks += Ns.transpose() * BwBwt * dA;
        Kbb += Bb.transpose() * DBb * dA;
        for (int a = 0; a < 4; ++a) for (int c = 0; c < 4; ++c)
            Kss(a, c) -= (Ns(0, a) * Ns(0, c) / Gs[0] + Ns(1, a) * Ns(1, c) / Gs[1]) * dA;
    }
    const double dJ0 = j0[0][0] * j0[1][1] - j0[0][1] * j0[1][0];
    const double kbs[4] = {16.0 / 9 * dJ0, 16.0 / 9 * dJ0, 16.0 / 9 * dJ0 * 0.2, 16.0 / 9 * dJ0 * 0.2};
    const Eigen::Matrix4d Kbbi = Kbb.inverse();
    const Eigen::Matrix<double, 4, 12> app1 = Kbbi * Kbt;
    Eigen::Matrix4d Kss2 = Kss;
    Eigen::Matrix<double, 4, 12> Ks2 = Ks;
    for (int a = 0; a < 4; ++a)
    {
        for (int c = 0; c < 4; ++c) Kss2(a, c) -= kbs[a] * Kbbi(a, c) * kbs[c];
        for (int j = 0; j < 12; ++j) Ks2(a, j) -= kbs[a] * app1(a, j);
    }
    const Eigen::Matrix4d Kssi = Kss2.inverse();
    Eigen::Matrix<double, 12, 1> u;
    for (int i = 0; i < 12; ++i) u(i) = u12[i];
    const Eigen::Vector4d s = -(Kssi * (Ks2 * u));
    Eigen::Vector4d rhs = Kbt * u;
    for (int a = 0; a < 4; ++a) rhs(a) += kbs[a] * s(a);
    const Eigen::Vector4d bub = -(Kbbi * rhs);
    const double esq[4][2] = {{-1, -1}, {1, -1}, {1, 1}, {-1, 1}};
    for (int j = 0; j < 4; ++j)
    {
        const ATB b = atBmat(esq[j][0], esq[j][1], x, y, co, si, j0);
        Eigen::Vector3d k = Eigen::Vector3d::Zero();
        for (int r = 0; r < 3; ++r)
        {
            for (int c = 0; c < 12; ++c) k(r) += b.Bt[r][c] * u(c);
            for (int c = 0; c < 4; ++c) k(r) += b.Bb[r][c] * bub(c);
        }
        const Eigen::Vector3d M = Db * k;
        for (int c = 0; c < 3; ++c) out[3 * j + c] = M(c);
    }
}
