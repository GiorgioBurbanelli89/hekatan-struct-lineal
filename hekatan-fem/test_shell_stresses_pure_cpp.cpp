// =============================================================================
// Test C++ standalone — Calcula M11, M22, V13 del SHELL Hekatan
// directamente desde las deformaciones, SIN pasar por analyze() ni WASM.
//
// Setup: losa cuadrada SS, L=6m, t=0.10m, q=10 kN/m² uniforme, mesh 10×10.
//
// Solución analítica Timoshenko (placa cuadrada SS, q uniforme):
//   w_centro = 0.00406 · q · L⁴ / D
//   M11_centro = 0.0479 · q · L² (= M22 por simetría)
//   M12_max (esquina) = 0.0325 · q · L² (Timoshenko Tabla 8)
//
// Cálculo M desde u via diferencias finitas centradas + Kirchhoff:
//   ∂²w/∂x² ≈ (w[i+1,j] - 2·w[i,j] + w[i-1,j]) / dx²
//   M11 = -D · (∂²w/∂x² + ν · ∂²w/∂y²)
//   M22 = -D · (∂²w/∂y² + ν · ∂²w/∂x²)
//   M12 = -D · (1-ν) · ∂²w/∂x∂y
//   V13 = ∂M11/∂x + ∂M12/∂y (Kirchhoff shear effective)
//
// Conclusión:
//   Si M11 C++ ≈ analítico → solver shell OK, bug está en analyze.ts o reporting
//   Si M11 C++ ≈ 1/8 del analítico → bug físico en solver C++
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

    // ── Parámetros (igual mesa-torsion losa pura) ──
    double L = 6.0;
    double t = 0.10;
    double E = 24.85e6;    // kN/m²
    double nu = 0.15;
    double q = 10.0;       // kN/m² uniforme
    int N = 10;            // mesh fino para diff finitas
    int nPerSide = N + 1;
    int nNodes = nPerSide * nPerSide;
    int dof = 6 * nNodes;
    double dx = L / N;

    double D = E * t * t * t / (12.0 * (1.0 - nu * nu));
    double w_analytic = 0.00406 * q * std::pow(L, 4) / D;
    double M_analytic = 0.0479 * q * L * L;
    double Mxy_corner_analytic = 0.0325 * q * L * L;

    std::cout << "================================================================\n";
    std::cout << "Test C++ puro — esfuerzos shell Hekatan (sin analyze, sin WASM)\n";
    std::cout << "  Placa SS L=" << L << "×" << L << "×" << t << ", q=" << q << " kN/m², mesh " << N << "×" << N << "\n";
    std::cout << "  D = " << D << " kN·m\n";
    std::cout << "  Analitico:\n";
    std::cout << "    w_centro       = " << w_analytic << " m\n";
    std::cout << "    M11=M22 centro = " << M_analytic << " kN·m/m  (= " << M_analytic/9.80665 << " tonf·m/m)\n";
    std::cout << "    M12 max esquina= " << Mxy_corner_analytic << " kN·m/m  (= " << Mxy_corner_analytic/9.80665 << " tonf·m/m)\n";
    std::cout << "================================================================\n\n";

    // ── Build mesh ──
    std::vector<Node> nodes(nNodes, Node(3));
    for (int j = 0; j < nPerSide; j++) {
        for (int i = 0; i < nPerSide; i++) {
            nodes[j*nPerSide + i][0] = i*dx;
            nodes[j*nPerSide + i][1] = j*dx;
            nodes[j*nPerSide + i][2] = 0;
        }
    }
    int nElems = N * N;
    std::vector<std::array<int,4>> elems(nElems);
    int idx = 0;
    for (int j = 0; j < N; j++) for (int i = 0; i < N; i++) {
        elems[idx++] = {j*nPerSide+i, j*nPerSide+i+1, (j+1)*nPerSide+i+1, (j+1)*nPerSide+i};
    }

    // ── ElementInputs (drillingType=0 legacy para descartar HB) ──
    ElementInputs ei;
    for (int e = 0; e < nElems; e++) {
        ei.elasticities[e] = E;
        ei.poissonsRatios[e] = nu;
        ei.thicknesses[e] = t;
        ei.plateFormulations[e] = 1;   // Shell-Thin Kirchhoff MZC
        ei.drillingTypes[e] = 0;       // legacy (no HB) para test base
    }

    // ── Assemble K global ──
    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips;
    trips.reserve(nElems * 576);
    for (int e = 0; e < nElems; e++) {
        std::vector<Node> elNodes(4);
        for (int k = 0; k < 4; k++) elNodes[k] = nodes[elems[e][k]];
        Eigen::MatrixXd ke = getLocalStiffnessMatrixShellThin(elNodes, ei, e);
        for (int li = 0; li < 24; li++) {
            int gi = elems[e][li/6]*6 + li%6;
            for (int lj = 0; lj < 24; lj++) {
                int gj = elems[e][lj/6]*6 + lj%6;
                double v = ke(li, lj);
                if (std::abs(v) > 1e-18) trips.emplace_back(gi, gj, v);
            }
        }
    }
    K.setFromTriplets(trips.begin(), trips.end());

    // ── F: carga tributaria nodal ──
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        double f = q * dx * dx;
        if (xE && yE) f *= 0.25;
        else if (xE || yE) f *= 0.5;
        F((j*nPerSide+i)*6 + 2) = -f;
    }

    // ── BCs: SS = uz fixed en bordes + ux,uy,θz globalmente (rigid body) ──
    std::vector<bool> fixed(dof, false);
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        int n = j*nPerSide + i;
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        if (xE || yE) fixed[n*6 + 2] = true;
        fixed[n*6 + 0] = true;  // ux
        fixed[n*6 + 1] = true;  // uy
        fixed[n*6 + 5] = true;  // θz
    }

    std::vector<int> free;
    for (int i = 0; i < dof; i++) if (!fixed[i]) free.push_back(i);
    int nf = free.size();
    Eigen::SparseMatrix<double> Kr(nf, nf);
    std::vector<Eigen::Triplet<double>> rTrips;
    std::map<int,int> gToR;
    for (int i = 0; i < nf; i++) gToR[free[i]] = i;
    for (int k = 0; k < K.outerSize(); k++)
        for (Eigen::SparseMatrix<double>::InnerIterator it(K, k); it; ++it) {
            auto ri = gToR.find(it.row()), ci = gToR.find(it.col());
            if (ri != gToR.end() && ci != gToR.end())
                rTrips.emplace_back(ri->second, ci->second, it.value());
        }
    Kr.setFromTriplets(rTrips.begin(), rTrips.end());
    Eigen::VectorXd Fr(nf);
    for (int i = 0; i < nf; i++) Fr(i) = F(free[i]);

    Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
    solver.compute(Kr);
    Eigen::VectorXd ur = solver.solve(Fr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

    // ── Extract w grid (N+1 × N+1) ──
    auto W = [&](int i, int j) { return u((j*nPerSide + i)*6 + 2); };
    double w_c = W(N/2, N/2);

    std::cout << "─── DEFLEXIÓN ─────────────────────────────────────────────\n";
    std::cout << "  w_centro Hekatan-C++ = " << w_c << " m\n";
    std::cout << "  w_centro analítico   = " << w_analytic << " m\n";
    std::cout << "  ratio (C++/analitico) = " << w_c/w_analytic << " (negativo si signo opuesto)\n\n";

    // ── M11, M22, M12 via diferencias finitas centradas en el centro ──
    int ic = N/2, jc = N/2;
    double d2wdx2 = (W(ic+1, jc) - 2*W(ic, jc) + W(ic-1, jc)) / (dx*dx);
    double d2wdy2 = (W(ic, jc+1) - 2*W(ic, jc) + W(ic, jc-1)) / (dx*dx);
    double d2wdxdy = (W(ic+1, jc+1) - W(ic-1, jc+1) - W(ic+1, jc-1) + W(ic-1, jc-1)) / (4*dx*dx);

    double M11_centro = -D * (d2wdx2 + nu * d2wdy2);
    double M22_centro = -D * (d2wdy2 + nu * d2wdx2);
    double M12_centro = -D * (1 - nu) * d2wdxdy;

    std::cout << "─── MOMENTOS EN EL CENTRO (kN·m/m) ────────────────────────\n";
    std::cout << "  M11 C++  = " << M11_centro << " kN·m/m  = " << M11_centro/9.80665 << " tonf·m/m\n";
    std::cout << "  M22 C++  = " << M22_centro << " kN·m/m  = " << M22_centro/9.80665 << " tonf·m/m\n";
    std::cout << "  M12 C++  = " << M12_centro << " kN·m/m  = " << M12_centro/9.80665 << " tonf·m/m\n";
    std::cout << "\n  Analítico Timoshenko M11=M22 centro = " << M_analytic << " kN·m/m  = " << M_analytic/9.80665 << " tonf·m/m\n";
    std::cout << "  ratio M11_Cpp/analitico = " << std::abs(M11_centro)/M_analytic << "\n\n";

    // ── Buscar |M11|max y |M22|max en TODA la malla ──
    double M11_max = 0, M22_max = 0, M12_max = 0;
    for (int j = 1; j < N; j++) {
        for (int i = 1; i < N; i++) {
            double dx2 = (W(i+1, j) - 2*W(i, j) + W(i-1, j)) / (dx*dx);
            double dy2 = (W(i, j+1) - 2*W(i, j) + W(i, j-1)) / (dx*dx);
            double dxy = (W(i+1, j+1) - W(i-1, j+1) - W(i+1, j-1) + W(i-1, j-1)) / (4*dx*dx);
            double m11 = -D * (dx2 + nu*dy2);
            double m22 = -D * (dy2 + nu*dx2);
            double m12 = -D * (1-nu) * dxy;
            if (std::abs(m11) > M11_max) M11_max = std::abs(m11);
            if (std::abs(m22) > M22_max) M22_max = std::abs(m22);
            if (std::abs(m12) > M12_max) M12_max = std::abs(m12);
        }
    }

    std::cout << "─── MOMENTOS |MAX| sobre TODA la malla (kN·m/m) ──────────\n";
    std::cout << "  |M11|max C++ = " << M11_max << " kN·m/m  = " << M11_max/9.80665 << " tonf·m/m\n";
    std::cout << "  |M22|max C++ = " << M22_max << " kN·m/m  = " << M22_max/9.80665 << " tonf·m/m\n";
    std::cout << "  |M12|max C++ = " << M12_max << " kN·m/m  = " << M12_max/9.80665 << " tonf·m/m\n";

    std::cout << "\n================================================================\n";
    std::cout << "VEREDICTO:\n";
    std::cout << "  Si |M11|max C++ ≈ analitico (" << M_analytic/9.80665 << " tonf·m/m):\n";
    std::cout << "    → solver C++ del shell OK, bug en analyze.ts o reporting\n";
    std::cout << "  Si |M11|max C++ ≈ 0.36 tonf·m/m (factor 1/8):\n";
    std::cout << "    → bug físico en el solver C++ shellThin.cpp\n";
    return 0;
}
