// =============================================================================
// test_mesa_mesh_convergence.cpp
// Prueba de convergencia con mesh refinement — ¿MZC converge a SAP?
//
// Si MZC (plateFormulations=1) es Kirchhoff non-conforming, debería converger
// a la solución Kirchhoff verdadera al refinar la malla. Test: correr el caso
// SCP (carga pura sobre losa) con mallas 5×5, 10×10, 20×20, 30×30 y ver si
// w_max se acerca al valor SAP de -13.34 mm.
//
// Si converge → MZC es correcto, solo necesita malla más fina.
// Si NO converge → MZC tiene un bug de implementación.
// =============================================================================
#include <iostream>
#include <iomanip>
#include <vector>
#include <map>
#include <cmath>
#include <array>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include "src/cpp/data-model.h"

Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getTransformationMatrix(const std::vector<Node> &nodes);

double run_mesh(int plateFormulation, int N) {
    double Lx = 6.0, Ly = 6.0, H = 4.0;
    double tLosa = 0.10;
    double bC = 0.40, bV = 0.30, hV = 0.50;
    double E = 24.85e6, nu = 0.20;
    double G = E / (2*(1+nu));
    double RHO = 24.0, rho_mass = RHO / 9.80665;
    int nPerSide = N + 1;
    double dx = Lx / N, dy = Ly / N;

    auto stVenantJ = [](double b, double h) {
        double a = std::max(b,h), s = std::min(b,h), r = s/a;
        double beta = (1.0/3.0) * (1 - 0.21*r*(1 - std::pow(r,4)/12));
        return beta * a * s*s*s;
    };
    double Jc = 0.141 * std::pow(bC, 4);
    double Jv = stVenantJ(bV, hV);

    std::vector<Node> nodes;
    nodes.push_back({0,  0,  0});
    nodes.push_back({Lx, 0,  0});
    nodes.push_back({Lx, Ly, 0});
    nodes.push_back({0,  Ly, 0});
    int N_BASE = 4;
    for (int j = 0; j < nPerSide; j++)
        for (int i = 0; i < nPerSide; i++)
            nodes.push_back({i*dx, j*dy, H});
    int nNodes = nodes.size();
    int dof = 6 * nNodes;
    auto ix = [&](int i, int j) { return N_BASE + j*nPerSide + i; };

    std::vector<std::vector<unsigned int>> elements;
    for (int j = 0; j < N; j++)
        for (int i = 0; i < N; i++)
            elements.push_back({(unsigned)ix(i,j), (unsigned)ix(i+1,j),
                                (unsigned)ix(i+1,j+1), (unsigned)ix(i,j+1)});
    int shellCount = elements.size();
    elements.push_back({0, (unsigned)ix(0,0)});
    elements.push_back({1, (unsigned)ix(N,0)});
    elements.push_back({2, (unsigned)ix(N,N)});
    elements.push_back({3, (unsigned)ix(0,N)});
    int colStart = shellCount, colEnd = elements.size();
    for (int i = 0; i < N; i++) elements.push_back({(unsigned)ix(i,0), (unsigned)ix(i+1,0)});
    for (int j = 0; j < N; j++) elements.push_back({(unsigned)ix(N,j), (unsigned)ix(N,j+1)});
    for (int i = 0; i < N; i++) elements.push_back({(unsigned)ix(i,N), (unsigned)ix(i+1,N)});
    for (int j = 0; j < N; j++) elements.push_back({(unsigned)ix(0,j), (unsigned)ix(0,j+1)});
    int beamEnd = elements.size();

    ElementInputs ei;
    for (int e = 0; e < shellCount; e++) {
        ei.thicknesses[e] = tLosa; ei.elasticities[e] = E;
        ei.poissonsRatios[e] = nu; ei.densities[e] = rho_mass;
        ei.plateFormulations[e] = plateFormulation;
        ei.drillingTypes[e] = 0;
    }
    double Ac = bC*bC, Iyc = std::pow(bC,4)/12;
    for (int e = colStart; e < colEnd; e++) {
        ei.elasticities[e]=E; ei.poissonsRatios[e]=nu;
        ei.shearModuli[e]=G; ei.densities[e]=rho_mass;
        ei.areas[e]=Ac; ei.momentsOfInertiaY[e]=Iyc;
        ei.momentsOfInertiaZ[e]=Iyc; ei.torsionalConstants[e]=Jc;
    }
    double Av = bV*hV;
    double Izv = bV*std::pow(hV,3)/12, Iyv = hV*std::pow(bV,3)/12;
    for (int e = colEnd; e < beamEnd; e++) {
        ei.elasticities[e]=E; ei.poissonsRatios[e]=nu;
        ei.shearModuli[e]=G; ei.densities[e]=rho_mass;
        ei.areas[e]=Av; ei.momentsOfInertiaY[e]=Iyv;
        ei.momentsOfInertiaZ[e]=Izv; ei.torsionalConstants[e]=Jv;
    }

    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips;
    trips.reserve(elements.size() * 576);
    for (size_t e = 0; e < elements.size(); e++) {
        std::vector<Node> elN;
        for (auto n : elements[e]) elN.push_back(nodes[n]);
        Eigen::MatrixXd kL = getLocalStiffnessMatrix(elN, ei, e);
        Eigen::MatrixXd T = getTransformationMatrix(elN);
        Eigen::MatrixXd kG = T.transpose() * kL * T;
        int n = elements[e].size();
        for (int li = 0; li < 6*n; li++) {
            int gi = elements[e][li/6]*6 + li%6;
            for (int lj = 0; lj < 6*n; lj++) {
                int gj = elements[e][lj/6]*6 + lj%6;
                if (std::abs(kG(li,lj)) > 1e-18) trips.emplace_back(gi, gj, kG(li,lj));
            }
        }
    }
    K.setFromTriplets(trips.begin(), trips.end());

    // Carga: SCP = 1 tonf/m² = 9.80665 kN/m²
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    double q = 9.80665;
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        int n = ix(i, j);
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        double f = q * dx * dy;
        if (xE && yE) f *= 0.25;
        else if (xE || yE) f *= 0.5;
        F(n*6 + 2) -= f;
    }

    // BC rotulado
    std::vector<bool> fixed(dof, false);
    for (int n : {0, 1, 2, 3}) {
        fixed[n*6 + 0] = true; fixed[n*6 + 1] = true; fixed[n*6 + 2] = true;
    }

    std::vector<int> free_dofs;
    for (int i = 0; i < dof; i++) if (!fixed[i]) free_dofs.push_back(i);
    int nf = free_dofs.size();
    Eigen::SparseMatrix<double> Kr(nf, nf);
    std::vector<Eigen::Triplet<double>> rT;
    std::map<int,int> gToR;
    for (int i = 0; i < nf; i++) gToR[free_dofs[i]] = i;
    for (int k = 0; k < K.outerSize(); k++)
        for (Eigen::SparseMatrix<double>::InnerIterator it(K,k); it; ++it) {
            auto ri = gToR.find(it.row()), ci = gToR.find(it.col());
            if (ri != gToR.end() && ci != gToR.end())
                rT.emplace_back(ri->second, ci->second, it.value());
        }
    Kr.setFromTriplets(rT.begin(), rT.end());
    Eigen::VectorXd Fr(nf);
    for (int i = 0; i < nf; i++) Fr(i) = F(free_dofs[i]);
    Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
    solver.compute(Kr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    if (solver.info() == Eigen::Success) {
        Eigen::VectorXd ur = solver.solve(Fr);
        for (int i = 0; i < nf; i++) u(free_dofs[i]) = ur(i);
    }

    double wmax = 0;
    for (int n = N_BASE; n < nNodes; n++)
        if (std::abs(u(n*6+2)) > std::abs(wmax)) wmax = u(n*6+2);
    return wmax * 1000;  // mm
}

int main() {
    std::vector<int> meshes = {5, 8, 10, 15, 20, 30};
    double w_sap_thin = -13.338;

    std::cout << "\n========================================================================\n";
    std::cout << "  Mesh convergence — Carga SCP=1 tonf/m², BC rotulado\n";
    std::cout << "  Comparativa contra SAP-Shell-Thin = " << w_sap_thin << " mm\n";
    std::cout << "========================================================================\n";
    std::cout << std::left << std::setw(8) << "Mesh"
              << std::right << std::setw(13) << "MZC[mm]"
              << std::setw(9) << "Δ vs SAP"
              << std::setw(13) << "HB-Mind[mm]"
              << std::setw(9) << "Δ vs SAP"
              << std::setw(13) << "DKMQ[mm]"
              << std::setw(9) << "Δ vs SAP" << "\n";
    std::cout << "  " << std::string(70, '-') << "\n";

    for (int N : meshes) {
        double w_mzc = run_mesh(1, N);
        double w_hb  = run_mesh(0, N);
        double w_dkm = run_mesh(2, N);
        double d_mzc = (w_mzc - w_sap_thin) / w_sap_thin * 100;
        double d_hb  = (w_hb  - w_sap_thin) / w_sap_thin * 100;
        double d_dkm = (w_dkm - w_sap_thin) / w_sap_thin * 100;
        std::cout << std::left << std::setw(8) << (std::to_string(N) + "x" + std::to_string(N))
                  << std::right << std::fixed << std::setprecision(3)
                  << std::setw(13) << w_mzc << std::setw(8) << std::setprecision(1) << d_mzc << "%"
                  << std::setw(13) << std::setprecision(3) << w_hb  << std::setw(8) << std::setprecision(1) << d_hb  << "%"
                  << std::setw(13) << std::setprecision(3) << w_dkm << std::setw(8) << std::setprecision(1) << d_dkm << "%" << "\n";
    }
    std::cout << "========================================================================\n";
    return 0;
}
