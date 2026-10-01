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
