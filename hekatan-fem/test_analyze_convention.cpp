// =============================================================================
// Test C++ standalone — VALIDAR CONVENCIÓN θ EN ANALYZE
//
// Replica el cálculo de M11 de analyze.ts con LAS 4 hipótesis posibles
// de convención θ y compara cuál da el valor analítico correcto.
//
// Setup: placa SS L=6m, t=0.1m, q=10 kN/m², mesh 10×10 (= test anterior).
// Solver: shellThin (Kirchhoff MZC) con convención REAL θx=∂w/∂y, θy=-∂w/∂x.
//
// 4 hipótesis para κxx en analyze.ts:
//   A) analyze.ts actual:  κxx = -∂θx/∂x
//   B) Swap simple:        κxx = -∂θy/∂x  (Mindlin shellQ4)
//   C) Kirchhoff MZC:      κxx = +∂θy/∂x  (signo positivo)
//   D) Custom:             κxx = +∂θx/∂x
//
// La que dé M11 ≈ analítico 1.76 tonf·m/m es la correcta.
// =============================================================================

#include <iostream>
#include <iomanip>
#include <vector>
#include <map>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include "src/cpp/data-model.h"

Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);

int main() {
    std::cout << std::scientific << std::setprecision(4);

    double L = 6.0, t = 0.10, E = 24.85e6, nu = 0.15, q = 10.0;
    int N = 10, nPerSide = N+1, nNodes = nPerSide*nPerSide;
    int dof = 6*nNodes; double dx = L/N;
    double D = E*t*t*t/(12.0*(1.0-nu*nu));
    double M_anal = 0.0479 * q * L * L;  // ~17.24 kN·m/m

    std::cout << "================================================================\n";
    std::cout << "Test convención θ para analyze stress recovery (shellThin MZC)\n";
    std::cout << "  Placa SS, L=" << L << ", t=" << t << ", q=" << q << ", mesh 10×10\n";
    std::cout << "  M_analítico centro = " << M_anal << " kN·m/m = " << M_anal/9.80665 << " tonf·m/m\n";
    std::cout << "================================================================\n\n";

    // Build mesh
    std::vector<Node> nodes(nNodes, Node(3));
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        nodes[j*nPerSide+i] = {i*dx, j*dx, 0};
    }
    int nElems = N*N;
    std::vector<std::array<int,4>> elems(nElems);
    int idx = 0;
    for (int j = 0; j < N; j++) for (int i = 0; i < N; i++) {
        elems[idx++] = {j*nPerSide+i, j*nPerSide+i+1, (j+1)*nPerSide+i+1, (j+1)*nPerSide+i};
    }

    ElementInputs ei;
    for (int e = 0; e < nElems; e++) {
        ei.elasticities[e] = E; ei.poissonsRatios[e] = nu;
        ei.thicknesses[e] = t; ei.plateFormulations[e] = 1;
        ei.drillingTypes[e] = 0;
    }

    // Build K
    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips; trips.reserve(nElems*576);
    for (int e = 0; e < nElems; e++) {
        std::vector<Node> elN(4);
        for (int k = 0; k < 4; k++) elN[k] = nodes[elems[e][k]];
        Eigen::MatrixXd ke = getLocalStiffnessMatrixShellThin(elN, ei, e);
        for (int li = 0; li < 24; li++) {
            int gi = elems[e][li/6]*6 + li%6;
            for (int lj = 0; lj < 24; lj++) {
                int gj = elems[e][lj/6]*6 + lj%6;
                if (std::abs(ke(li,lj)) > 1e-18) trips.emplace_back(gi, gj, ke(li,lj));
            }
        }
    }
    K.setFromTriplets(trips.begin(), trips.end());

    // F
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        double f = q*dx*dx;
        if (xE && yE) f *= 0.25; else if (xE || yE) f *= 0.5;
        F((j*nPerSide+i)*6+2) = -f;
    }

    // BCs
    std::vector<bool> fixed(dof, false);
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        int n = j*nPerSide+i;
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        if (xE || yE) fixed[n*6+2] = true;
        fixed[n*6+0] = true; fixed[n*6+1] = true; fixed[n*6+5] = true;
    }
    std::vector<int> free;
    for (int i = 0; i < dof; i++) if (!fixed[i]) free.push_back(i);
    int nf = free.size();
    Eigen::SparseMatrix<double> Kr(nf,nf);
    std::vector<Eigen::Triplet<double>> rT;
    std::map<int,int> gToR;
    for (int i = 0; i < nf; i++) gToR[free[i]] = i;
    for (int k = 0; k < K.outerSize(); k++)
        for (Eigen::SparseMatrix<double>::InnerIterator it(K,k); it; ++it) {
            auto ri = gToR.find(it.row()), ci = gToR.find(it.col());
            if (ri != gToR.end() && ci != gToR.end()) rT.emplace_back(ri->second, ci->second, it.value());
        }
    Kr.setFromTriplets(rT.begin(), rT.end());
    Eigen::VectorXd Fr(nf);
    for (int i = 0; i < nf; i++) Fr(i) = F(free[i]);
    Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
    solver.compute(Kr);
    Eigen::VectorXd ur = solver.solve(Fr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

    // ─── Pick element CENTRAL para hacer stress recovery ─────────────────
    // Elemento central = elem index (N/2)*N + N/2 = elem(5,5) en mesh 10×10
    int eCen = (N/2)*N + (N/2);
    auto &el = elems[eCen];

    // ─── Calculate M11 con las 4 hipótesis al CENTROIDE del elemento (ξ=0, η=0) ──
    // Shape function derivatives at centroid Q4
    double dNdxi[4]  = {-0.25,  0.25, 0.25, -0.25};
    double dNdeta[4] = {-0.25, -0.25, 0.25,  0.25};

    // Jacobiano: para mesh rect uniforme, J = diag(dx/2, dx/2)
    double a = dx/2.0;  // a = semi-x
    double b = dx/2.0;  // b = semi-y
    double dNdx[4], dNdy[4];
    for (int n = 0; n < 4; n++) {
        dNdx[n] = dNdxi[n] / a;
        dNdy[n] = dNdeta[n] / b;
    }

    // Extract uLocal[12] for element central — DOFs por nodo (w, θx, θy)
    // Pero para shellThin convención: θx=∂w/∂y, θy=-∂w/∂x
    double uL[24];
    for (int n = 0; n < 4; n++) {
        int gN = el[n];
        for (int d = 0; d < 6; d++) uL[n*6+d] = u(gN*6+d);
    }

    // ── 4 hipótesis ──
    auto computeM = [&](int hypothesis, double &kxx, double &kyy, double &kxy) {
        kxx = 0; kyy = 0; kxy = 0;
        for (int n = 0; n < 4; n++) {
            double tx = uL[n*6+3];  // θx
            double ty = uL[n*6+4];  // θy
            switch (hypothesis) {
                case 0:  // analyze.ts ACTUAL: κxx = -∂θx/∂x, etc.
                    kxx += -dNdx[n] * tx;
                    kyy += -dNdy[n] * ty;
                    kxy += -dNdy[n] * tx - dNdx[n] * ty;
                    break;
                case 1:  // Mindlin shellQ4 convention
                    kxx += -dNdx[n] * ty;
                    kyy += +dNdy[n] * tx;
                    kxy += +dNdx[n] * tx - dNdy[n] * ty;
                    break;
                case 2:  // shellThin Kirchhoff MZC (mi propuesta)
                    // θx = ∂w/∂y → ∂²w/∂y² = ∂θx/∂y → κyy = -∂θx/∂y
                    // θy = -∂w/∂x → ∂²w/∂x² = -∂θy/∂x → κxx = +∂θy/∂x
                    // κxy = -2·∂²w/∂x∂y = -2·∂θx/∂x (o +2·∂θy/∂y)
                    kxx += +dNdx[n] * ty;
                    kyy += -dNdy[n] * tx;
                    kxy += -2.0 * dNdx[n] * tx;
                    break;
                case 3:  // signo opuesto al MZC
                    kxx += -dNdx[n] * ty;
                    kyy += +dNdy[n] * tx;
                    kxy += +2.0 * dNdx[n] * tx;
                    break;
            }
        }
    };

    const char* labels[4] = {
        "A) analyze.ts ACTUAL (sin swap, κ = -∂θsame/∂i)",
        "B) Mindlin shellQ4 (con swap, signo negativo)",
        "C) shellThin Kirchhoff (con swap, signo positivo)",
        "D) Custom signo opuesto",
    };

    std::cout << "─── Elem central (" << eCen << "), centroide (ξ=0, η=0) ─────────\n";
    std::cout << "  uL en nodos del elem central (θx, θy):\n";
    for (int n = 0; n < 4; n++)
        std::cout << "    nodo " << n << ": θx=" << uL[n*6+3] << "  θy=" << uL[n*6+4] << "\n";
    std::cout << "\n";

    for (int h = 0; h < 4; h++) {
        double kxx, kyy, kxy;
        computeM(h, kxx, kyy, kxy);
        double M11 = D * (kxx + nu*kyy);
        double M22 = D * (nu*kxx + kyy);
        double M12 = D * (1-nu)/2.0 * kxy;
        std::cout << "[" << labels[h] << "]\n";
        std::cout << "  κxx=" << kxx << "  κyy=" << kyy << "  κxy=" << kxy << "\n";
        std::cout << "  M11=" << M11 << " kN·m/m = " << M11/9.80665 << " tonf·m/m\n";
        std::cout << "  M22=" << M22 << " kN·m/m\n";
        std::cout << "  M12=" << M12 << " kN·m/m\n";
        std::cout << "  ratio |M11|/analítico = " << std::abs(M11)/M_anal << "\n\n";
    }

    std::cout << "─── VEREDICTO ──────────────────────────────────────────────────\n";
    std::cout << "  Analítico M_centro = " << M_anal << " kN·m/m\n";
    std::cout << "  La hipótesis con ratio ≈ 0.88 (factor MZC mesh 10×10) es la CORRECTA.\n";
    return 0;
}
