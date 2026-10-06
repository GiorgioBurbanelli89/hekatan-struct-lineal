// PANDEO LINEAL (Linear Buckling) como SAP2000 — 1-oct-2026.
//
// CSI Analysis Reference Manual, cap. XVIII:  [K − λ·G(r)]·Ψ = 0
// Cap. XXII (P-Delta Forces in the Frame Element): deformada CÚBICA por flexión + LINEAL por cortante,
// fuerza axial constante en la barra = promedio de los extremos, del estático de las cargas r.
//
// La geométrica de cada plano se obtiene de ese campo (Timoshenko homogéneo: v cúbica, γ = v' − θ
// constante) integrando G = P·∫ v'ᵀ v' dx con la pendiente TOTAL v'. Medido contra SAP2000 24 por OAPI
// (validation/pandeo: columna 1 y 4 trozos, pórtico 3D 1 y 4 trozos, 16 modos): 0.00000 %. Con la
// pendiente de solo flexión θ se iba hasta 22 %. Espejo exacto: hekatan-struct-py/.../buckling.py.
//
// Se resuelve (−G)·Ψ = μ·K·Ψ con K definida positiva (Spectra, modo Cholesky) y λ = 1/μ:
// los |μ| mayores son los |λ| menores, de los dos signos (λ < 0 = pandea con las cargas invertidas).
#pragma once
#include "../data-model.h"
#include "../spectra/SymGEigsSolver.h"
#include "../spectra/MatOp/SparseSymMatProd.h"
#include "../spectra/MatOp/SparseCholesky.h"
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <vector>
#include <map>
#include <cmath>
#include <array>
#include <cstdlib>
#include <algorithm>
#include <iostream>

// getLocalStiffnessMatrix.cpp: ejes del triángulo y constitutiva de membrana con modificadores (las mismas de la K)
Eigen::Matrix3d ejesTriangulo(const Node &n0, const Node &n1, const Node &n2);
Eigen::Matrix3d membranaConModificadores(const ElementInputs &ei, int index, double E, double nu);

namespace pandeo {

// 4×4 de un plano, GDL [v1, θ1, v2, θ2], P > 0 tracción. c = EI/(G·As) (0 = Bernoulli).
inline Eigen::Matrix4d gPlano(double L, double c, double P) {
    Eigen::Matrix4d A;
    A << 1, 0, 0, 0,
         0, 1, 0, 6 * c,
         1, L, L * L, L * L * L,
         0, 1, 2 * L, 3 * L * L + 6 * c;
    const Eigen::Matrix4d C = A.inverse();
    static const double xg[4] = {-0.8611363115940526, -0.3399810435848563, 0.3399810435848563, 0.8611363115940526};
    static const double wg[4] = {0.3478548451374538, 0.6521451548625461, 0.6521451548625461, 0.3478548451374538};
    Eigen::Matrix4d G = Eigen::Matrix4d::Zero();
    for (int k = 0; k < 4; ++k) {
        const double x = L * (xg[k] + 1) / 2;
        Eigen::RowVector4d d(0, 1, 2 * x, 3 * x * x);
        Eigen::RowVector4d dv = d * C;
        G += wg[k] * L / 2 * dv.transpose() * dv;
    }
    return P * G;
}

inline double valor(const std::map<int, double> &m, int k, double def) {
    auto it = m.find(k); return it == m.end() ? def : it->second;
}

// 12×12 local de CSI [u1 u2 u3 r1 r2 r3]_I [..]_J
inline Eigen::MatrixXd gBarraLocal(const ElementInputs &ei, int e, double L, double P) {
    const double E = valor(ei.elasticities, e, 0.0), G = valor(ei.shearModuli, e, 0.0), A = valor(ei.areas, e, 0.0);
    const double Iz = valor(ei.momentsOfInertiaZ, e, 0.0), Iy = valor(ei.momentsOfInertiaY, e, 0.0);
    double AsZ = valor(ei.shearAreasZ, e, 0.0), AsY = valor(ei.shearAreasY, e, 0.0);
    // misma convención que getLocalStiffnessMatrix: 0 → 5/6·A, negativo → Bernoulli
    auto cDe = [&](double As, double I) {
        if (As < -1e-15 || G <= 1e-15) return 0.0;
        if (As < 1e-15) As = 5.0 / 6.0 * A;
        return As > 0 ? E * I / (G * As) : 0.0;
    };
    Eigen::MatrixXd g = Eigen::MatrixXd::Zero(12, 12);
    Eigen::Matrix4d gz = gPlano(L, cDe(AsZ, Iz), P);          // plano 1-2: v = u2, θ = +r3
    const int iz[4] = {1, 5, 7, 11};
    for (int a = 0; a < 4; ++a) for (int b = 0; b < 4; ++b) g(iz[a], iz[b]) += gz(a, b);
    Eigen::Matrix4d gy = gPlano(L, cDe(AsY, Iy), P);          // plano 1-3: w = u3, θ = dw/dx = −r2
    const int iy[4] = {2, 4, 8, 10}; const double s[4] = {1, -1, 1, -1};
    for (int a = 0; a < 4; ++a) for (int b = 0; b < 4; ++b) g(iy[a], iy[b]) += s[a] * s[b] * gy(a, b);
    return g;
}

// G global (dof completo) de todas las barras; P[e] = axial P-delta de la barra e (tracción +).
inline Eigen::SparseMatrix<double> gGlobal(const std::vector<Node> &nodes, const std::vector<unsigned int> &idx,
                                           const std::vector<unsigned int> &sizes, const ElementInputs &ei,
                                           const double *P, int dof) {
    std::vector<Eigen::Triplet<double>> tt;
    size_t off = 0;
    for (size_t e = 0; e < sizes.size(); off += sizes[e], ++e) {
        if (sizes[e] != 2 || P[e] == 0.0) continue;
        const int i = idx[off], j = idx[off + 1];
        std::vector<Node> en = {nodes[i], nodes[j]};
        const double L = std::sqrt(std::pow(nodes[j][0] - nodes[i][0], 2) + std::pow(nodes[j][1] - nodes[i][1], 2) +
                                   std::pow(nodes[j][2] - nodes[i][2], 2));
        if (L <= 0) continue;
        const double ang = valor(ei.localAngles, (int)e, 0.0);
        const Eigen::MatrixXd T = getTransformationMatrix(en, ang);
        const Eigen::MatrixXd g = T.transpose() * gBarraLocal(ei, (int)e, L, P[e]) * T;
        const int d[12] = {6 * i, 6 * i + 1, 6 * i + 2, 6 * i + 3, 6 * i + 4, 6 * i + 5,
                           6 * j, 6 * j + 1, 6 * j + 2, 6 * j + 3, 6 * j + 4, 6 * j + 5};
        for (int a = 0; a < 12; ++a) for (int b = 0; b < 12; ++b) if (g(a, b) != 0.0) tt.emplace_back(d[a], d[b], g(a, b));
    }
    Eigen::SparseMatrix<double> G(dof, dof); G.setFromTriplets(tt.begin(), tt.end());
    return G;
}

// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
// CÁSCARAS (5-oct-2026): muros y losas. CSiRefer p.444 «Other Elements»: las tensiones de cada elemento salen de los
// desplazamientos del estático y se INTEGRAN con las derivadas de las funciones de forma isoparamétricas → geométrica
// «estándar», solo FUERZAS en los nudos (sin momentos). Medido contra SAP2000 24 (validation/pandeo_cascara):
//   Kg_e = ∫ [N,x N,y]ᵀ · [Nxx Nxy; Nxy Nyy] · [N,x N,y] dA   sobre u, v y w LOCALES de cada nudo
//   N bilineales, Gauss 2×2; N = t·σ en cada punto de Gauss con la B de la MEMBRANA con giro normal (Allman por los
//   lados con la proyección de FEAP = drillingTypes 8, SIN la burbuja).
// Con el estático de SAP: 0.00000 % en λ (4 modos, muro 2×3 y 8×12). Bilineal solo de u,v: +0.004 %; Allman sin
// proyectar: −0.24 %; Gauss 1 punto: +33 %.
namespace cascara {
static const double RN[4] = {-1, 1, 1, -1}, SN[4] = {-1, -1, 1, 1};
static const int ANT[4] = {3, 0, 1, 2}, SIG[4] = {1, 2, 3, 0};
struct Partes { double dNx[4], dNy[4], g[3][4], dJ; };
inline Partes partes(const double X[4], const double Y[4], const double cx[4], const double cy[4], double r, double s) {
    Partes p; double dr[4], ds[4];
    for (int i = 0; i < 4; ++i) { dr[i] = 0.25 * RN[i] * (1 + SN[i] * s); ds[i] = 0.25 * SN[i] * (1 + RN[i] * r); }
    double J11 = 0, J12 = 0, J21 = 0, J22 = 0;
    for (int i = 0; i < 4; ++i) { J11 += dr[i] * X[i]; J12 += dr[i] * Y[i]; J21 += ds[i] * X[i]; J22 += ds[i] * Y[i]; }
    const double dJ = J11 * J22 - J12 * J21;
    const double i11 = J22 / dJ, i12 = -J12 / dJ, i21 = -J21 / dJ, i22 = J11 / dJ;
    // serendipity de los lados (ITW ec. 22-23, con el 1/2 dentro)
    const double nsr[4] = {0.5 * (-2 * r * (1 - s)), 0.5 * (1 - s * s), 0.5 * (-2 * r * (1 + s)), 0.5 * (-(1 - s * s))};
    const double nss[4] = {0.5 * (-(1 - r * r)), 0.5 * (-2 * s * (1 + r)), 0.5 * (1 - r * r), 0.5 * (-2 * s * (1 - r))};
    double NSx[4], NSy[4];
    for (int i = 0; i < 4; ++i) {
        p.dNx[i] = i11 * dr[i] + i12 * ds[i]; p.dNy[i] = i21 * dr[i] + i22 * ds[i];
        NSx[i] = i11 * nsr[i] + i12 * nss[i]; NSy[i] = i21 * nsr[i] + i22 * nss[i];
    }
    for (int i = 0; i < 4; ++i) {
        const int a = ANT[i];
        p.g[0][i] = NSx[a] * cx[a] - NSx[i] * cx[i];
        p.g[1][i] = NSy[a] * cy[a] - NSy[i] * cy[i];
        p.g[2][i] = (NSy[a] * cx[a] - NSy[i] * cx[i]) + (NSx[a] * cy[a] - NSx[i] * cy[i]);
    }
    p.dJ = std::abs(dJ);
    return p;
}

// Kg 24×24 LOCAL [u v w θx θy θz]×4 de un Q4 plano. X,Y = coordenadas locales; d12 = [u v θz]×4 locales del estático.
inline Eigen::MatrixXd gQ4Local(const double X[4], const double Y[4], const Eigen::Matrix3d &Dt, const double d12[12]) {
    double cx[4], cy[4];
    for (int i = 0; i < 4; ++i) { cx[i] = (Y[SIG[i]] - Y[i]) / 8.0; cy[i] = -(X[SIG[i]] - X[i]) / 8.0; }
    // proyección del giro (FEAP): se resta la media de las columnas θz sobre el elemento (Gauss 3×3)
    double med[3][4] = {{0}}, area = 0;
    const double g3[3] = {-std::sqrt(0.6), 0.0, std::sqrt(0.6)}, w3[3] = {5.0 / 9, 8.0 / 9, 5.0 / 9};
    for (int a = 0; a < 3; ++a) for (int b = 0; b < 3; ++b) {
        const Partes p = partes(X, Y, cx, cy, g3[a], g3[b]); const double w = w3[a] * w3[b] * p.dJ;
        for (int k = 0; k < 3; ++k) for (int i = 0; i < 4; ++i) med[k][i] += p.g[k][i] * w;
        area += w;
    }
    for (int k = 0; k < 3; ++k) for (int i = 0; i < 4; ++i) med[k][i] /= area;
    Eigen::Matrix4d g4 = Eigen::Matrix4d::Zero();
    const double g2 = 1.0 / std::sqrt(3.0);
    for (int a = 0; a < 2; ++a) for (int b = 0; b < 2; ++b) {
        const double r = a ? g2 : -g2, s = b ? g2 : -g2;
        const Partes p = partes(X, Y, cx, cy, r, s);
        Eigen::Vector3d eps = Eigen::Vector3d::Zero();
        for (int i = 0; i < 4; ++i) {
            const double u = d12[3 * i], v = d12[3 * i + 1], th = d12[3 * i + 2];
            eps(0) += p.dNx[i] * u + (p.g[0][i] - med[0][i]) * th;
            eps(1) += p.dNy[i] * v + (p.g[1][i] - med[1][i]) * th;
            eps(2) += p.dNy[i] * u + p.dNx[i] * v + (p.g[2][i] - med[2][i]) * th;
        }
        const Eigen::Vector3d N = Dt * eps;                 // Nxx Nyy Nxy (fuerza por metro)
        for (int i = 0; i < 4; ++i) for (int j = 0; j < 4; ++j)
            g4(i, j) += p.dJ * (p.dNx[i] * (N(0) * p.dNx[j] + N(2) * p.dNy[j]) + p.dNy[i] * (N(2) * p.dNx[j] + N(1) * p.dNy[j]));
    }
    Eigen::MatrixXd gl = Eigen::MatrixXd::Zero(24, 24);
    for (int i = 0; i < 4; ++i) for (int j = 0; j < 4; ++j) for (int k = 0; k < 3; ++k) gl(6 * i + k, 6 * j + k) = g4(i, j);
    return gl;
}
}  // namespace cascara

// Kg global de todos los Q4 de cáscara (espesor > 0) con el estático u (dof completo, global).
inline Eigen::SparseMatrix<double> gCascaras(const std::vector<Node> &nodes, const std::vector<unsigned int> &idx,
                                             const std::vector<unsigned int> &sizes, const ElementInputs &ei,
                                             const double *u, int dof, int *nTri = nullptr) {
    std::vector<Eigen::Triplet<double>> tt;
    size_t off = 0; int tri = 0;
    for (size_t e = 0; e < sizes.size(); off += sizes[e], ++e) {
        if (sizes[e] == 3 && valor(ei.thicknesses, (int)e, 0.0) > 0) {
            // TRIÁNGULO (6-oct-2026, medido contra SAP2000: validation/pandeo_cascara, placa/muro/losa partidas en
            // triángulos): N lineales, ∇N constante → Kg = A·∇Nᵀ·[Nxx Nxy; Nxy Nyy]·∇N en u, v, w, con N = t·D·ε.
            const double t = valor(ei.thicknesses, (int)e, 0.0), E = valor(ei.elasticities, (int)e, 0.0);
            const double nu = valor(ei.poissonsRatios, (int)e, 0.2);
            if (E <= 0) continue;
            int n3[3]; for (int k = 0; k < 3; ++k) n3[k] = idx[off + k];
            const Eigen::Matrix3d R = ejesTriangulo(nodes[n3[0]], nodes[n3[1]], nodes[n3[2]]);
            if (R.norm() == 0) continue;
            double x[3], y[3], ul[3], vl[3], th[3];
            for (int k = 0; k < 3; ++k) {
                const Eigen::Vector3d d(nodes[n3[k]][0] - nodes[n3[0]][0], nodes[n3[k]][1] - nodes[n3[0]][1], nodes[n3[k]][2] - nodes[n3[0]][2]);
                const Eigen::Vector3d l = R * d; x[k] = l(0); y[k] = l(1);
                const Eigen::Vector3d uu = R * Eigen::Vector3d(u[6 * n3[k]], u[6 * n3[k] + 1], u[6 * n3[k] + 2]);
                const Eigen::Vector3d tg = R * Eigen::Vector3d(u[6 * n3[k] + 3], u[6 * n3[k] + 4], u[6 * n3[k] + 5]);
                ul[k] = uu(0); vl[k] = uu(1); th[k] = tg(2);
            }
            const double A2 = (x[1] - x[0]) * (y[2] - y[0]) - (x[2] - x[0]) * (y[1] - y[0]);
            const double b[3] = {(y[1] - y[2]) / A2, (y[2] - y[0]) / A2, (y[0] - y[1]) / A2};
            const double cc[3] = {(x[2] - x[1]) / A2, (x[0] - x[2]) / A2, (x[1] - x[0]) / A2};
            Eigen::Vector3d eps(0, 0, 0);
            for (int k = 0; k < 3; ++k) { eps(0) += b[k] * ul[k]; eps(1) += cc[k] * vl[k]; eps(2) += cc[k] * ul[k] + b[k] * vl[k]; }
            // La tensión es la de la membrana de Allman (proyectada) evaluada en UN punto: L = (1/4, 1/4, 1/2), el centro
            // (r = s = 0) del Q4 DEGENERADO [n1 n2 n3 n3] del ITW 1991. Medido (muro de triángulos, vertical y tumbado, con
            // el estático de SAP): 0.00000 % en 6 modos; con la media (el centroide) −0.12 %, en los vértices ±0.4…6 %.
            // Las columnas θ proyectadas valen (∂ en L) − (∂ en el centroide).
            {
                static const int LI[3] = {0, 1, 2}, LJ[3] = {1, 2, 0};
                const double Lp[3] = {0.25, 0.25, 0.5}, Lc[3] = {1.0 / 3, 1.0 / 3, 1.0 / 3};
                for (int s = 0; s < 3; ++s) {
                    const int i = LI[s], j = LJ[s];
                    const double cx = (y[j] - y[i]) / 8.0, cy = -(x[j] - x[i]) / 8.0;
                    const double dx = 4.0 * (b[i] * (Lp[j] - Lc[j]) + b[j] * (Lp[i] - Lc[i]));
                    const double dy = 4.0 * (cc[i] * (Lp[j] - Lc[j]) + cc[j] * (Lp[i] - Lc[i]));
                    const double dth = th[j] - th[i];
                    eps(0) += dx * cx * dth; eps(1) += dy * cy * dth; eps(2) += (dy * cx + dx * cy) * dth;
                }
            }
            const Eigen::Vector3d N = t * membranaConModificadores(ei, (int)e, E, nu) * eps;
            const double A = std::abs(A2) / 2;
            for (int i = 0; i < 3; ++i) for (int j = 0; j < 3; ++j) {
                const double g = A * (b[i] * (N(0) * b[j] + N(2) * cc[j]) + cc[i] * (N(2) * b[j] + N(1) * cc[j]));
                if (g != 0.0) for (int k = 0; k < 3; ++k) tt.emplace_back(6 * n3[i] + k, 6 * n3[j] + k, g);
            }
            continue;
        }
        if (sizes[e] != 4) continue;
        const double t = valor(ei.thicknesses, (int)e, 0.0), E = valor(ei.elasticities, (int)e, 0.0);
        const double nu = valor(ei.poissonsRatios, (int)e, 0.2);
        if (t <= 0 || E <= 0) continue;
        int n4[4]; Eigen::Vector3d P[4];
        for (int k = 0; k < 4; ++k) { n4[k] = idx[off + k]; P[k] = Eigen::Vector3d(nodes[n4[k]][0], nodes[n4[k]][1], nodes[n4[k]][2]); }
        // ejes locales: los MISMOS que getLocalStiffnessMatrixShellThin / getTransformationMatrixShellQ4
        Eigen::Vector3d lx = (P[1] - P[0]) + (P[2] - P[3]); if (lx.norm() < 1e-12) continue; lx.normalize();
        Eigen::Vector3d lz = (P[2] - P[0]).cross(P[3] - P[1]); if (lz.norm() < 1e-12) continue; lz.normalize();
        Eigen::Vector3d ly = lz.cross(lx); ly.normalize(); lx = ly.cross(lz); lx.normalize();
        Eigen::Matrix3d R; R.row(0) = lx.transpose(); R.row(1) = ly.transpose(); R.row(2) = lz.transpose();
        const Eigen::Vector3d c = 0.25 * (P[0] + P[1] + P[2] + P[3]);
        double X[4], Y[4], d12[12];
        for (int k = 0; k < 4; ++k) {
            X[k] = (P[k] - c).dot(lx); Y[k] = (P[k] - c).dot(ly);
            const Eigen::Vector3d ug(u[6 * n4[k]], u[6 * n4[k] + 1], u[6 * n4[k] + 2]);
            const Eigen::Vector3d tg(u[6 * n4[k] + 3], u[6 * n4[k] + 4], u[6 * n4[k] + 5]);
            const Eigen::Vector3d ul = R * ug, tl = R * tg;
            d12[3 * k] = ul(0); d12[3 * k + 1] = ul(1); d12[3 * k + 2] = tl(2);
        }
        // constitutiva de membrana con los modificadores, como getMembraneITW (escalar o F11 F22 F12)
        const double f = E / (1 - nu * nu);
        Eigen::Matrix3d D; D << f, f * nu, 0, f * nu, f, 0, 0, 0, f * (1 - nu) / 2;
        auto itM = ei.shellModifiers.find((int)e);
        if (itM != ei.shellModifiers.end() && itM->second.size() >= 3) {
            const double f11 = itM->second[0], f22 = itM->second[1], f12 = itM->second[2];
            D(0, 0) *= f11; D(1, 1) *= f22; D(2, 2) *= f12; const double cc = std::sqrt(std::max(0.0, f11 * f22));
            D(0, 1) *= cc; D(1, 0) *= cc;
        } else D *= valor(ei.membraneModifiers, (int)e, 1.0);
        const Eigen::MatrixXd gl = cascara::gQ4Local(X, Y, D * t, d12);
        Eigen::MatrixXd T = Eigen::MatrixXd::Zero(24, 24);
        for (int b = 0; b < 8; ++b) T.block<3, 3>(3 * b, 3 * b) = R;
        const Eigen::MatrixXd g = T.transpose() * gl * T;
        for (int a = 0; a < 24; ++a) for (int b = 0; b < 24; ++b)
            if (g(a, b) != 0.0) tt.emplace_back(6 * n4[a / 6] + a % 6, 6 * n4[b / 6] + b % 6, g(a, b));
    }
    if (nTri) *nTri = tri;
    Eigen::SparseMatrix<double> G(dof, dof); G.setFromTriplets(tt.begin(), tt.end());
    return G;
}

// Resuelve. Kc ya trae muelles y unión muro-viga. diaf: nudo → grupo (0 = ninguno; negativo = solo ux, uy).
// Salida plana: [nModos, λ×nModos, Ψ(nModos × dof completo, máx |Ψ| = 1)].
inline std::vector<double> resolver(const Eigen::SparseMatrix<double> &Kc, const Eigen::SparseMatrix<double> &Gc,
                                    const std::vector<Node> &nodes, const NodeInputs &ni,
                                    const std::map<int, double> &diaf, int nModos) {
    const int nn = (int)nodes.size(), dofC = 6 * nn;
    // diafragma: maestro en el centro geométrico (λ no depende de dónde se ponga)
    std::map<int, std::vector<int>> grupos; std::vector<int> g(nn, 0); std::vector<char> solo(nn, 0);
    for (auto &kv : diaf) { const int gs = (int)std::llround(kv.second); if (gs == 0 || kv.first < 0 || kv.first >= nn) continue;
        grupos[std::abs(gs)].push_back(kv.first); g[kv.first] = std::abs(gs); solo[kv.first] = gs < 0; }
    for (auto it = grupos.begin(); it != grupos.end();) { if (it->second.size() < 2) { for (int i : it->second) g[i] = 0; it = grupos.erase(it); } else ++it; }
    std::vector<int> col(dofC, -1); int nred = 0;
    for (int i = 0; i < nn; ++i) for (int k = 0; k < 6; ++k) {
        const bool atado = g[i] > 0 && (k == 0 || k == 1 || (k == 5 && !solo[i]));
        if (!atado) col[6 * i + k] = nred++;
    }
    std::map<int, int> cm; std::map<int, std::array<double, 2>> cen;
    for (auto &gr : grupos) { cm[gr.first] = nred; nred += 3; double sx = 0, sy = 0;
        for (int i : gr.second) { sx += nodes[i][0]; sy += nodes[i][1]; } cen[gr.first] = {sx / gr.second.size(), sy / gr.second.size()}; }
    std::vector<Eigen::Triplet<double>> tt;
    for (int i = 0; i < nn; ++i) for (int k = 0; k < 6; ++k) {
        const int f = 6 * i + k;
        if (col[f] >= 0) { tt.emplace_back(f, col[f], 1.0); continue; }
        const int c = cm[g[i]]; const double dx = nodes[i][0] - cen[g[i]][0], dy = nodes[i][1] - cen[g[i]][1];
        if (k == 0) { tt.emplace_back(f, c, 1.0); tt.emplace_back(f, c + 2, -dy); }
        else if (k == 1) { tt.emplace_back(f, c + 1, 1.0); tt.emplace_back(f, c + 2, dx); }
        else tt.emplace_back(f, c + 2, 1.0);
    }
    Eigen::SparseMatrix<double> T(dofC, nred); T.setFromTriplets(tt.begin(), tt.end());
    Eigen::SparseMatrix<double> K = (T.transpose() * Kc * T).pruned(), G = (T.transpose() * Gc * T).pruned();
    // libres: sin apoyo y con rigidez
    std::vector<char> fijo(nred, 0);
    for (auto &kv : ni.supports) { const int i = kv.first; if (i < 0 || i >= nn) continue;
        for (int k = 0; k < 6 && k < (int)kv.second.size(); ++k) if (kv.second[k] && col[6 * i + k] >= 0) fijo[col[6 * i + k]] = 1; }
    double media = 0; int cu = 0;
    for (int c = 0; c < nred; ++c) if (!fijo[c] && K.coeff(c, c) > 0) { media += K.coeff(c, c); cu++; }
    media = cu ? media / cu : 1.0;
    std::vector<int> keep; for (int c = 0; c < nred; ++c) if (!fijo[c] && K.coeff(c, c) > 1e-12 * media) keep.push_back(c);
    const int n = (int)keep.size(); std::vector<double> out = {0.0};
    if (n == 0) return out;
    std::vector<int> pos(nred, -1); for (int a = 0; a < n; ++a) pos[keep[a]] = a;
    auto bloque = [&](const Eigen::SparseMatrix<double> &M, double s) {
        std::vector<Eigen::Triplet<double>> t;
        for (int k = 0; k < M.outerSize(); ++k) for (Eigen::SparseMatrix<double>::InnerIterator it(M, k); it; ++it) {
            const int a = pos[it.row()], b = pos[it.col()]; if (a >= 0 && b >= 0 && it.value() != 0.0) t.emplace_back(a, b, s * it.value()); }
        Eigen::SparseMatrix<double> R(n, n); R.setFromTriplets(t.begin(), t.end()); return R; };
    Eigen::SparseMatrix<double> Kf = bloque(K, 1.0), Bf = bloque(G, -1.0);
    const int nev = std::max(1, std::min(nModos, n - 1));
    std::vector<double> lam; Eigen::MatrixXd V;
    if (n <= 400) {   // pequeño: denso, exacto
        const Eigen::MatrixXd Bd = Bf, Kd = Kf;
        Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> ges(Bd, Kd);
        if (ges.info() != Eigen::Success) { std::cout << "pandeo: K no es definida positiva (mecanismo)" << std::endl; return out; }
        std::vector<int> o(n); for (int a = 0; a < n; ++a) o[a] = a;
        const Eigen::VectorXd mu = ges.eigenvalues();
        std::sort(o.begin(), o.end(), [&](int a, int b) { return std::abs(mu(a)) > std::abs(mu(b)); });
        V.resize(n, nev);
        for (int k = 0; k < nev; ++k) { lam.push_back(1.0 / mu(o[k])); V.col(k) = ges.eigenvectors().col(o[k]); }
    } else {
        Spectra::SparseSymMatProd<double> op(Bf);
        Spectra::SparseCholesky<double> Bop(Kf);
        if (Bop.info() != Spectra::CompInfo::Successful) { std::cout << "pandeo: K no es definida positiva (mecanismo)" << std::endl; return out; }
        const int ncv = std::min(n, std::max(2 * nev + 1, 20));
        Spectra::SymGEigsSolver<Spectra::SparseSymMatProd<double>, Spectra::SparseCholesky<double>, Spectra::GEigsMode::Cholesky>
            es(op, Bop, nev, ncv);
        es.init(); es.compute(Spectra::SortRule::LargestMagn, 2000, 1e-12);
        if (es.info() != Spectra::CompInfo::Successful) { std::cout << "pandeo: Spectra no convergió" << std::endl; return out; }
        const Eigen::VectorXd mu = es.eigenvalues(); V = es.eigenvectors();
        for (int k = 0; k < mu.size(); ++k) lam.push_back(1.0 / mu(k));
    }
    const int m = (int)lam.size(); out.assign(1 + m + m * dofC, 0.0); out[0] = m;
    for (int k = 0; k < m; ++k) {
        out[1 + k] = lam[k];
        Eigen::VectorXd r = Eigen::VectorXd::Zero(nred); for (int a = 0; a < n; ++a) r(keep[a]) = V(a, k);
        Eigen::VectorXd u = T * r; const double mx = u.cwiseAbs().maxCoeff();
        int imx = 0; u.cwiseAbs().maxCoeff(&imx); const double sg = (u(imx) < 0 ? -1.0 : 1.0);
        for (int a = 0; a < dofC; ++a) out[1 + m + k * dofC + a] = mx > 0 ? sg * u(a) / mx : 0.0;
    }
    return out;
}

}  // namespace pandeo
