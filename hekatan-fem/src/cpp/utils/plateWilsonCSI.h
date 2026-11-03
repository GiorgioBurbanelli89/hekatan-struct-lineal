#pragma once
// =============================================================================
// Placas de flexion Q4, K 12x12, GDL por nudo [w, theta_x, theta_y] (mano
// derecha: theta_x = +dw/dy, theta_y = -dw/dx), en los ejes x, y del pano.
//
//   plateFormulations 6 = DKE de Wilson (libro, cap. 8, Ec. 8.21)
//   plateFormulations 7 = DSE de Wilson (libro, cap. 8, Ec. 8.1-8.19)
//   plateFormulations 8 = Shell-Thick cuadrilatero de CSI (SAP2000 / ETABS)
//
// Son PORTES LINEA A LINEA de dos referencias en Python ya arbitradas:
//   6, 7 <- hekatan-struct-py/src/hekatan_struct/placas_wilson.py (k_dke, k_dse)
//           Fuente: E. L. Wilson, «Three-Dimensional Static and Dynamic Analysis
//           of Structures» (2005), cap. 8 (registros/asistente_extractos/
//           wilson_placa_gruesa/). Reproduce las Tablas 8.1-8.4 y 8.6.
//   8    <- ingenieria-inversa/csi_shellthick/k_grueso_cuad.py (k_grueso_cuad)
//           140 celdas de SAP2000/ETABS <= 6e-11 % y la K de 22 GDL del kernel
//           de ETABS 19 antes de condensar (registros/2026-11-01_shellthick_cuad_csi.md).
//
// Verificacion (C++ = Python a <= 1e-10, tablas del libro, 140 celdas de CSI):
//   hekatan-fem/src/cpp/plate_q4/test_wilson_csi.cpp + test_wilson_csi_ref.py
//   (registros/2026-11-02_dke_dse_wilson_cpp.md).
//
// Diferencia con lo que YA habia en shellQ4.cpp:
//   - getBendingK (plateForm 0, defecto Thick) = MITC4 + modos incompatibles.
//   - getBendingK_DSE (HK_BENDING_FORMULATION 1) = flexion DSE + cortante MITC4:
//     NO es el DSE de Wilson.
//   - getBendingK_DSE_FULL (plateForm 4) = el DSE del cap. 8 con la inversa CORRECTA
//     de la Ec. (8.8): = kWilsonDSE(..., inversa88 = true) a 3e-15. El 7 hoy es igual.
//     `inversa88 = false` reproduce la (8.9) IMPRESA (traspuesta, errata): en un trapecio 6.8 %.
//   - plateDKQ.h (plateForm 1, Shell-Thin) = DKQ de Batoz-Tahar 1982 = kWilsonDKE a 3e-16.
//
// Modificadores direccionales `mod` = [f11 f22 f12 m11 m22 m12 v13 v23 ...]
// (los de data-model.h): Db <- diag(sqrt m) Db diag(sqrt m), Ds <- idem con v,
// lo mismo que k_grueso_cuad.matrices_D (y equivalente al getBendingK).
// =============================================================================
#include <cmath>
#include <algorithm>
#include <Eigen/Dense>

namespace hkplaca {

// ── D de flexion y de cortante (Wilson Ec. 8.15; CSI: Db, Ds = 5/6 G t) ──────
inline void matricesD(double E, double nu, double t, const double *mod,
                      Eigen::Matrix3d &Db, Eigen::Matrix2d &Ds)
{
    const double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Db << D0, nu * D0, 0.0,
          nu * D0, D0, 0.0,
          0.0, 0.0, D0 * (1.0 - nu) / 2.0;
    const double Gs = (5.0 / 6.0) * E * t / (2.0 * (1.0 + nu));   // = 5Eh/12(1+nu)
    Ds << Gs, 0.0, 0.0, Gs;
    if (mod) {
        Eigen::Vector3d sb(std::sqrt(std::max(0.0, mod[3])),
                           std::sqrt(std::max(0.0, mod[4])),
                           std::sqrt(std::max(0.0, mod[5])));
        Eigen::Vector2d ss(std::sqrt(std::max(0.0, mod[6])),
                           std::sqrt(std::max(0.0, mod[7])));
        Db = sb.asDiagonal() * Db * sb.asDiagonal();
        Ds = ss.asDiagonal() * Ds * ss.asDiagonal();
    }
}

// =============================================================================
// WILSON DKE / DSE  (port de placas_wilson.py)
// =============================================================================
namespace wilson {

static const double G2 = 0.57735026918962576451;   // 1/sqrt(3)
static const double GAUSS4[4][2] = {{-G2, -G2}, {G2, -G2}, {G2, G2}, {-G2, G2}};

struct Lado { double L, sa, ca; };   // lado m = (i -> i+1): longitud, sin a, cos a

inline void lados(const double x[4], const double y[4], Lado out[4])
{
    for (int i = 0; i < 4; i++) {
        const int j = (i + 1) % 4;
        const double dx = x[j] - x[i], dy = y[j] - y[i];
        const double L = std::hypot(dx, dy);
        out[i] = {L, dy / L, dx / L};
    }
}

// N1..N4, derivadas en x, y de N1..N4 (2x4) y de N5..N8 (2x4), det J   (_formas)
inline void formas(double r, double s, const double x[4], const double y[4],
                   double N[4], Eigen::Matrix<double, 2, 4> &dNxy,
                   Eigen::Matrix<double, 2, 4> &dMxy, double &dj)
{
    N[0] = 0.25 * (1 - r) * (1 - s); N[1] = 0.25 * (1 + r) * (1 - s);
    N[2] = 0.25 * (1 + r) * (1 + s); N[3] = 0.25 * (1 - r) * (1 + s);
    Eigen::Matrix<double, 2, 4> dN, dM;
    dN << -(1 - s), (1 - s), (1 + s), -(1 + s),
          -(1 - r), -(1 + r), (1 + r), (1 - r);
    dN *= 0.25;
    dM << -r * (1 - s), 0.5 * (1 - s * s), -r * (1 + s), -0.5 * (1 - s * s),
          -0.5 * (1 - r * r), -(1 + r) * s, 0.5 * (1 - r * r), -(1 - r) * s;
    Eigen::Matrix<double, 4, 2> P;
    for (int k = 0; k < 4; k++) { P(k, 0) = x[k]; P(k, 1) = y[k]; }
    const Eigen::Matrix2d J = dN * P;
    dj = J.determinant();
    const Eigen::Matrix2d Ji = J.inverse();
    dNxy = Ji * dN;
    dMxy = Ji * dM;
}

// b de curvaturas (3x16): [w, tx, ty]x4 y Delta-theta 5..8   (_curvaturas_16, Ec. 8.4 + 8.10)
//   psi_xx = ty,x   psi_yy = -tx,y   psi_xy = ty,y - tx,x
//   Delta-theta del lado m: Delta tx = sin a * N_m, Delta ty = -cos a * N_m   (Ec. 8.3)
inline Eigen::Matrix<double, 3, 16> curvaturas16(double r, double s, const double x[4],
                                                 const double y[4], const Lado ld[4],
                                                 double N[4], double &dj)
{
    Eigen::Matrix<double, 2, 4> dN, dM;
    formas(r, s, x, y, N, dN, dM, dj);
    Eigen::Matrix<double, 2, 16> gx = Eigen::Matrix<double, 2, 16>::Zero();
    Eigen::Matrix<double, 2, 16> gy = Eigen::Matrix<double, 2, 16>::Zero();
    for (int k = 0; k < 4; k++) { gx.col(3 * k + 1) = dN.col(k); gy.col(3 * k + 2) = dN.col(k); }
    for (int m = 0; m < 4; m++) {
        gx.col(12 + m) = dM.col(m) * ld[m].sa;
        gy.col(12 + m) = -dM.col(m) * ld[m].ca;
    }
    Eigen::Matrix<double, 3, 16> b;
    b.row(0) = gy.row(0);
    b.row(1) = -gx.row(1);
    b.row(2) = gy.row(1) - gx.row(0);
    return b;
}

// b de cortantes (2x16) en el punto   (_cortantes_16)
//   Ec. 8.6-8.7: gamma_ij = (w_j - w_i)/L - 1/2 (th_i + th_j) - 2/3 Delta-theta_ij,
//                th = sin a * tx - cos a * ty
//   Ec. 8.8-8.9: (gxz, gyz) del nudo i desde los lados ij (sale) y ki (llega);
//                luego las bilineales N1..N4 al punto.
//
// ⚠️ La Ec. (8.9) IMPRESA en el libro (p. 8-6, registros/libros/wilson_cap8_2005/p-06.png) es la
//   TRASPUESTA de la inversa de (8.8): (1/det)[sin a_ki, -cos a_ki; -sin a_ij, cos a_ij]. La inversa de
//   verdad de (8.8) es (1/det)[sin a_ki, -sin a_ij; -cos a_ki, cos a_ij]. En rectangulos coinciden (los
//   terminos cruzados son 0: por eso las Tablas 8.1-8.6, todas de rectangulos, no lo ven); en un
//   cuadrilatero distorsionado la impresa NO reproduce un cortante constante (w = a x + b y en un
//   trapecio da 0.06-0.33 en vez de 0.3). Por defecto se usa la IMPRESA (= placas_wilson.py, port fiel);
//   `inversa88 = true` usa la inversa correcta de (8.8).
inline Eigen::Matrix<double, 2, 16> cortantes16(const double N[4], const Lado ld[4], bool inversa88 = true)
{
    Eigen::Matrix<double, 4, 16> G = Eigen::Matrix<double, 4, 16>::Zero();
    for (int m = 0; m < 4; m++) {
        const int i = m, j = (m + 1) % 4;
        G(m, 3 * j) += 1.0 / ld[m].L; G(m, 3 * i) -= 1.0 / ld[m].L;
        const int nn[2] = {i, j};
        for (int n : nn) { G(m, 3 * n + 1) -= ld[m].sa / 2.0; G(m, 3 * n + 2) += ld[m].ca / 2.0; }
        G(m, 12 + m) -= 2.0 / 3.0;
    }
    Eigen::Matrix<double, 2, 16> b = Eigen::Matrix<double, 2, 16>::Zero();
    for (int i = 0; i < 4; i++) {
        const int ij = i, ki = (i + 3) % 4;
        const double sij = ld[ij].sa, cij = ld[ij].ca, ski = ld[ki].sa, cki = ld[ki].ca;
        const double det = cij * ski - cki * sij;
        Eigen::Matrix2d Tinv;
        if (inversa88) Tinv << ski, -sij, -cki, cij;   // inversa de (8.8)
        else           Tinv << ski, -cki, -sij, cij;   // (8.9) tal cual esta impresa
        Tinv /= det;
        Eigen::Matrix<double, 2, 16> g2;
        g2.row(0) = G.row(ij); g2.row(1) = G.row(ki);
        b += N[i] * (Tinv * g2);
    }
    return b;
}

// Ec. 8.21: Delta-theta_m = T[m] . u (12 GDL), cortante de lado nulo   (_restriccion_dke)
inline Eigen::Matrix<double, 4, 12> restriccionDKE(const Lado ld[4])
{
    Eigen::Matrix<double, 4, 12> T = Eigen::Matrix<double, 4, 12>::Zero();
    for (int m = 0; m < 4; m++) {
        const int i = m, j = (m + 1) % 4;
        T(m, 3 * j) += 1.5 / ld[m].L; T(m, 3 * i) -= 1.5 / ld[m].L;
        const int nn[2] = {i, j};
        for (int n : nn) { T(m, 3 * n + 1) -= 0.75 * ld[m].sa; T(m, 3 * n + 2) += 0.75 * ld[m].ca; }
    }
    return T;
}

// K 12x12 del DKE, Gauss 2x2, Db cualquiera   (k_dke)
inline Eigen::MatrixXd kDKE_D(const double x[4], const double y[4], const Eigen::Matrix3d &Db)
{
    Lado ld[4]; lados(x, y, ld);
    const Eigen::Matrix<double, 4, 12> T = restriccionDKE(ld);
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);
    for (int g = 0; g < 4; g++) {
        double N[4], dj;
        const Eigen::Matrix<double, 3, 16> b = curvaturas16(GAUSS4[g][0], GAUSS4[g][1], x, y, ld, N, dj);
        const Eigen::Matrix<double, 3, 12> B = b.leftCols<12>() + b.rightCols<4>() * T;
        K += B.transpose() * Db * B * std::abs(dj);
    }
    return K;
}

// K 16x16 del DSE con la correccion (8.17), Db y Ds cualesquiera   (_dse_partes)
inline Eigen::MatrixXd kDSE16_D(const double x[4], const double y[4],
                                const Eigen::Matrix3d &Db, const Eigen::Matrix2d &Ds, bool inversa88 = true)
{
    Lado ld[4]; lados(x, y, ld);
    Eigen::Matrix<double, 3, 16> b[4]; double Ng[4][4], dj[4];
    double A = 0.0;
    for (int g = 0; g < 4; g++) {
        b[g] = curvaturas16(GAUSS4[g][0], GAUSS4[g][1], x, y, ld, Ng[g], dj[g]);
        dj[g] = std::abs(dj[g]);
        A += dj[g];
    }
    Eigen::Matrix<double, 3, 4> b12m = Eigen::Matrix<double, 3, 4>::Zero();   // (1/A) INT b12 dA
    for (int g = 0; g < 4; g++) b12m += b[g].rightCols<4>() * dj[g];
    b12m /= A;
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(16, 16);
    for (int g = 0; g < 4; g++) {
        Eigen::Matrix<double, 3, 16> bk = b[g];
        bk.rightCols<4>() -= b12m;                                           // (8.17)
        const Eigen::Matrix<double, 2, 16> bg = cortantes16(Ng[g], ld, inversa88);
        K += (bk.transpose() * Db * bk + bg.transpose() * Ds * bg) * dj[g];
    }
    return K;
}

// K 12x12 del DSE: condensacion estatica de los 4 Delta-theta (8.18-8.19)   (k_dse)
inline Eigen::MatrixXd kDSE_D(const double x[4], const double y[4],
                              const Eigen::Matrix3d &Db, const Eigen::Matrix2d &Ds, bool inversa88 = true)
{
    const Eigen::MatrixXd K = kDSE16_D(x, y, Db, Ds, inversa88);
    const Eigen::MatrixXd Kaa = K.block(12, 12, 4, 4);
    return K.block(0, 0, 12, 12) - K.block(0, 12, 12, 4) * Kaa.partialPivLu().solve(K.block(12, 0, 4, 12));
}

} // namespace wilson

inline Eigen::MatrixXd kWilsonDKE(const double x[4], const double y[4], double E, double nu,
                                  double t, const double *mod = nullptr)
{
    Eigen::Matrix3d Db; Eigen::Matrix2d Ds; matricesD(E, nu, t, mod, Db, Ds);
    return wilson::kDKE_D(x, y, Db);
}

inline Eigen::MatrixXd kWilsonDSE(const double x[4], const double y[4], double E, double nu,
                                  double t, const double *mod = nullptr, bool inversa88 = true)
{
    Eigen::Matrix3d Db; Eigen::Matrix2d Ds; matricesD(E, nu, t, mod, Db, Ds);
    return wilson::kDSE_D(x, y, Db, Ds, inversa88);
}

// =============================================================================
// SHELL-THICK CUADRILATERO DE CSI  (port de k_grueso_cuad.py)
//   22 GDL antes de condensar: 12 nodales + 4 lados x (tx_k, ty_k) + burbuja (tx_9, ty_9)
//   flexion: kx = ty,x   ky = -tx,y   kxy = ty,y - tx,x
//   cortante de lado k (Wilson 8.7 con giro de lado de 2 componentes):
//     g_k = (w_j-w_i)/L - (s_k/2)(tx_i+tx_j) + (c_k/2)(ty_i+ty_j) - 2/3 s_k tx_k + 2/3 c_k ty_k
//   campo: covariante tipo MITC con la parte lineal SIMETRIZADA, m = (b+d)/2
//   penalizacion: 1000 (D11+D22+D33) INT (tx,x + ty,y)^2 dA
//   cuadratura: 8 puntos ITW (CANM 7 ec. 30), W = 9/49 y 40/49
//   B-barra: a las 10 columnas internas se les resta su media w|J| (3 filas de curvatura)
//   condensacion: Gauss sobre los 10 internos, pivote nulo => se salta
// =============================================================================
namespace csi {

static const double PENAL = 1000.0;

// a = sqrt(7/9), b = sqrt(7/15) (en el binario a queda 1 ULP por debajo: se usa sqrt, como el Python)

inline void puntos8(double P[8][2], double W[8])
{
    const double a = std::sqrt(7.0 / 9.0), b = std::sqrt(7.0 / 15.0);
    const double pp[8][2] = {{-a, -a}, {a, -a}, {a, a}, {-a, a}, {0.0, -b}, {b, 0.0}, {0.0, b}, {-b, 0.0}};
    for (int i = 0; i < 8; i++) { P[i][0] = pp[i][0]; P[i][1] = pp[i][1]; W[i] = (i < 4) ? 9.0 / 49.0 : 40.0 / 49.0; }
}

// fila k = g_k sobre los 22 GDL y L_k   (_cortantes_de_lado)
inline void cortantesDeLado(const double x[4], const double y[4],
                            Eigen::Matrix<double, 4, 22> &G, double L[4])
{
    G.setZero();
    for (int k = 0; k < 4; k++) {
        const int j = (k + 1) % 4;
        const double dx = x[j] - x[k], dy = y[j] - y[k];
        L[k] = std::hypot(dx, dy);
        const double c = dx / L[k], s = dy / L[k];
        G(k, 3 * j) += 1.0 / L[k]; G(k, 3 * k) -= 1.0 / L[k];
        G(k, 3 * k + 1) -= s / 2.0; G(k, 3 * j + 1) -= s / 2.0;
        G(k, 3 * k + 2) += c / 2.0; G(k, 3 * j + 2) += c / 2.0;
        G(k, 12 + 2 * k) -= (2.0 / 3.0) * s;
        G(k, 13 + 2 * k) += (2.0 / 3.0) * c;
    }
}

// B (5x22: kx, ky, kxy, gxz, gyz), fila de divergencia v (22) y |J| en (r, s)   (B_y_div)
inline void BYDiv(const double x[4], const double y[4], double r, double s,
                  const Eigen::Matrix<double, 4, 22> &G, const double L[4],
                  Eigen::Matrix<double, 5, 22> &B, Eigen::Matrix<double, 22, 1> &v, double &adj)
{
    const double dr4[4] = {-(1 - s) / 4.0, (1 - s) / 4.0, (1 + s) / 4.0, -(1 + s) / 4.0};
    const double ds4[4] = {-(1 - r) / 4.0, -(1 + r) / 4.0, (1 + r) / 4.0, (1 - r) / 4.0};
    const double drh[4] = {-r * (1 - s), (1 - s * s) / 2.0, -r * (1 + s), -(1 - s * s) / 2.0};
    const double dsh[4] = {-(1 - r * r) / 2.0, -s * (1 + r), (1 - r * r) / 2.0, -s * (1 - r)};
    Eigen::Matrix2d J = Eigen::Matrix2d::Zero();
    for (int k = 0; k < 4; k++) {
        J(0, 0) += dr4[k] * x[k]; J(0, 1) += dr4[k] * y[k];
        J(1, 0) += ds4[k] * x[k]; J(1, 1) += ds4[k] * y[k];
    }
    const Eigen::Matrix2d Ji = J.inverse();
    double gx[4], gy[4], hx[4], hy[4];
    for (int k = 0; k < 4; k++) {
        gx[k] = Ji(0, 0) * dr4[k] + Ji(0, 1) * ds4[k]; gy[k] = Ji(1, 0) * dr4[k] + Ji(1, 1) * ds4[k];
        hx[k] = Ji(0, 0) * drh[k] + Ji(0, 1) * dsh[k]; hy[k] = Ji(1, 0) * drh[k] + Ji(1, 1) * dsh[k];
    }
    const Eigen::Vector2d g9 = Ji * Eigen::Vector2d(-2 * r * (1 - s * s), -2 * s * (1 - r * r));
    B.setZero(); v.setZero();
    auto giro = [&](int col, double a, double b, double fx, double fy) {   // theta = (a f, b f)
        B(0, col) += b * fx;
        B(1, col) -= a * fy;
        B(2, col) += b * fy - a * fx;
        v(col) += a * fx + b * fy;
    };
    for (int i = 0; i < 4; i++) { giro(3 * i + 1, 1, 0, gx[i], gy[i]); giro(3 * i + 2, 0, 1, gx[i], gy[i]); }
    for (int k = 0; k < 4; k++) { giro(12 + 2 * k, 1, 0, hx[k], hy[k]); giro(13 + 2 * k, 0, 1, hx[k], hy[k]); }
    giro(20, 1, 0, g9(0), g9(1)); giro(21, 0, 1, g9(0), g9(1));
    // cortante covariante: g_xi en los lados abajo (0) / arriba (2), g_eta en dcha (1) / izq (3)
    const Eigen::Matrix<double, 1, 22> gb = G.row(0) * L[0] / 2.0, gt = -G.row(2) * L[2] / 2.0;
    const Eigen::Matrix<double, 1, 22> gR = G.row(1) * L[1] / 2.0, gL = -G.row(3) * L[3] / 2.0;
    const Eigen::Matrix<double, 1, 22> A0 = (gb + gt) / 2.0, bb = (gt - gb) / 2.0;
    const Eigen::Matrix<double, 1, 22> C0 = (gL + gR) / 2.0, dd = (gR - gL) / 2.0;
    const Eigen::Matrix<double, 1, 22> m = (bb + dd) / 2.0;   // la simetrizacion de CSI
    Eigen::Matrix<double, 2, 22> rhs;
    rhs.row(0) = A0 + m * s;
    rhs.row(1) = C0 + m * r;
    B.bottomRows<2>() = J.partialPivLu().solve(rhs);
    adj = std::abs(J.determinant());
}

// K de 22 GDL ANTES de condensar   (k22_grueso_cuad)
inline Eigen::MatrixXd k22(const double x[4], const double y[4], double E, double nu, double t,
                           const double *mod = nullptr, double penal = PENAL)
{
    Eigen::Matrix3d Db; Eigen::Matrix2d Ds; matricesD(E, nu, t, mod, Db, Ds);
    Eigen::Matrix<double, 5, 5> D = Eigen::Matrix<double, 5, 5>::Zero();
    D.topLeftCorner<3, 3>() = Db; D.bottomRightCorner<2, 2>() = Ds;
    Eigen::Matrix<double, 4, 22> G; double L[4];
    cortantesDeLado(x, y, G, L);
    double P[8][2], W[8]; puntos8(P, W);
    Eigen::Matrix<double, 5, 22> B[8]; Eigen::Matrix<double, 22, 1> v[8]; double w[8];
    double sw = 0.0;
    Eigen::Matrix<double, 3, 10> media = Eigen::Matrix<double, 3, 10>::Zero();
    for (int p = 0; p < 8; p++) {
        double adj;
        BYDiv(x, y, P[p][0], P[p][1], G, L, B[p], v[p], adj);
        w[p] = W[p] * adj; sw += w[p];
        media += B[p].block<3, 10>(0, 12) * w[p];
    }
    media /= sw;
    const double cpen = penal * Db.trace();
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(22, 22);
    for (int p = 0; p < 8; p++) {
        B[p].block<3, 10>(0, 12) -= media;
        K += (B[p].transpose() * D * B[p] + cpen * v[p] * v[p].transpose()) * w[p];
    }
    return K;
}

// Gauss sobre los GDL internos; un pivote nulo se salta (como el kernel)   (condensar_saltando)
inline Eigen::MatrixXd condensarSaltando(Eigen::MatrixXd K, int nRet = 12, double tol = 1e-14)
{
    const int n = (int)K.rows();
    const double esc = K.cwiseAbs().maxCoeff();
    if (esc == 0.0) return K.topLeftCorner(nRet, nRet);
    for (int i = nRet; i < n; i++) {
        const double p = K(i, i);
        if (std::abs(p) <= tol * esc) continue;
        const Eigen::VectorXd c = K.col(i);
        const Eigen::RowVectorXd f = K.row(i);
        K -= c * f / p;
        K.row(i).setZero(); K.col(i).setZero();
    }
    return K.topLeftCorner(nRet, nRet);
}

} // namespace csi

// K 12x12 de placa del Shell-Thick cuadrilatero de CSI   (k_grueso_cuad)
inline Eigen::MatrixXd kShellThickCSI(const double x[4], const double y[4], double E, double nu,
                                      double t, const double *mod = nullptr)
{
    if (E <= 0.0 || t <= 0.0) return Eigen::MatrixXd::Zero(12, 12);
    return csi::condensarSaltando(csi::k22(x, y, E, nu, t, mod), 12);
}

} // namespace hkplaca
