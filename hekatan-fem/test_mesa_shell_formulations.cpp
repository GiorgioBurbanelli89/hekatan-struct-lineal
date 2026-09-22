// =============================================================================
// test_mesa_shell_formulations.cpp
// Mesa Torsión completa (4 cols + 4 vigas + losa) — compara 3 formulaciones
// shell de Hekatan-FEM contra SAP-thin (DSL servicio, BC rotulado P17).
//
// Formulaciones probadas (plateFormulations[idx]):
//   0 → shellQ4   Hughes-Brezzi Mindlin-Reissner con SRI (default Shell-Thick)
//   1 → shellThin Kirchhoff MZC (Shell-Thin actual de Hekatan)
//   2 → shellQ4_DKMQ Katili 1993 (port PyNite Quad3D)
//
// Cargas separadas: Dead, SCP, Live (sin factores LRFD)
// BC: 4 bases rotuladas (UX/UY/UZ fijos; RX/RY/RZ libres) ← FIX P17
// Material: concreto 4000Psi (E=24.85 GPa, ν=0.20)
//
// Output: tabla 3 formulaciones × 3 cargas = 9 casos + ratio Hek/SAP
// =============================================================================
#include <iostream>
#include <iomanip>
#include <fstream>
#include <vector>
#include <map>
#include <cmath>
#include <array>
#include <string>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include "src/cpp/data-model.h"

Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getTransformationMatrix(const std::vector<Node> &nodes);

enum LoadCase { LC_DEAD=0, LC_SCP=1, LC_LIVE=2 };
const char* lc_name(LoadCase lc) {
    switch(lc) { case LC_DEAD: return "Dead"; case LC_SCP: return "SCP"; case LC_LIVE: return "Live"; }
    return "?";
}

struct FormulationSpec {
    int code;                 // plateFormulations value
    const char* name;
    const char* short_name;   // for table
};

struct Result {
    std::string formulation;
    std::string lc;
    double w_max_mm;
    double M11_max_tonfm_m;
    double T_beam_max_kNm;
    double M3_beam_max_kNm;
};

Result run_case(const FormulationSpec &spec, LoadCase lc) {
    double Lx = 6.0, Ly = 6.0, H = 4.0;
    double tLosa = 0.10;
    double bC = 0.40, hC = 0.40;
    double bV = 0.30, hV = 0.50;
    double E_GPa = 24.85;
    double nu = 0.20;
    double E = E_GPa * 1e6;
    double G = E / (2*(1+nu));
    double RHO = 24.0;
    double rho_mass = RHO / 9.80665;

    int N = 5;
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
    int beamStart = colEnd, beamEnd = elements.size();

    ElementInputs ei;
    for (int e = 0; e < shellCount; e++) {
        ei.thicknesses[e] = tLosa; ei.elasticities[e] = E;
        ei.poissonsRatios[e] = nu; ei.densities[e] = rho_mass;
        ei.plateFormulations[e] = spec.code;
        ei.drillingTypes[e] = 0;
    }
    double Ac = bC * bC, Iyc = std::pow(bC, 4) / 12;
    for (int e = colStart; e < colEnd; e++) {
        ei.elasticities[e]=E; ei.poissonsRatios[e]=nu;
        ei.shearModuli[e]=G; ei.densities[e]=rho_mass;
        ei.areas[e]=Ac; ei.momentsOfInertiaY[e]=Iyc;
        ei.momentsOfInertiaZ[e]=Iyc; ei.torsionalConstants[e]=Jc;
    }
    double Av = bV * hV;
    double Izv = bV*std::pow(hV,3)/12, Iyv = hV*std::pow(bV,3)/12;
    for (int e = beamStart; e < beamEnd; e++) {
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

    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    double q_load_slab = 0.0;
    if (lc == LC_DEAD) q_load_slab = RHO * tLosa;
    if (lc == LC_SCP)  q_load_slab = 9.80665;
    if (lc == LC_LIVE) q_load_slab = 0.5 * 9.80665;

    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        int n = ix(i, j);
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        double f = q_load_slab * dx * dy;
        if (xE && yE) f *= 0.25;
        else if (xE || yE) f *= 0.5;
        F(n*6 + 2) -= f;
    }

    // BC P17: rotulado en bases
    std::vector<bool> fixed(dof, false);
    for (int n : {0, 1, 2, 3}) {
        fixed[n*6 + 0] = true;
        fixed[n*6 + 1] = true;
        fixed[n*6 + 2] = true;
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

    double D = E * tLosa*tLosa*tLosa / (12.0 * (1.0 - nu*nu));
    double dNdxi[4]  = {-0.25,  0.25, 0.25, -0.25};
    double dNdeta[4] = {-0.25, -0.25, 0.25,  0.25};
    double a = dx/2.0, b = dy/2.0;
    double M11_max = 0;
    for (int e = 0; e < shellCount; e++) {
        auto &el = elements[e];
        double uL[24];
        for (int n = 0; n < 4; n++)
            for (int d = 0; d < 6; d++) uL[n*6+d] = u(el[n]*6+d);
        double kxx=0, kyy=0;
        for (int n = 0; n < 4; n++) {
            double tx = uL[n*6+3], ty = uL[n*6+4];
            kxx += -(dNdxi[n]/a) * ty;
            kyy += +(dNdeta[n]/b) * tx;
        }
        double m11 = D * (kxx + nu*kyy);
        M11_max = std::max(M11_max, std::abs(m11));
    }

    // Frame forces vigas
    double T_beam = 0, M3_beam = 0;
    for (int e = beamStart; e < beamEnd; e++) {
        auto &el = elements[e];
        std::vector<Node> elN = {nodes[el[0]], nodes[el[1]]};
        Eigen::MatrixXd kL = getLocalStiffnessMatrix(elN, ei, e);
        Eigen::MatrixXd T_t = getTransformationMatrix(elN);
        Eigen::VectorXd uG(12);
        for (int n = 0; n < 2; n++)
            for (int d = 0; d < 6; d++) uG(n*6+d) = u(el[n]*6+d);
        Eigen::VectorXd uLv = T_t * uG;
        Eigen::VectorXd fL = kL * uLv;
        T_beam = std::max(T_beam, std::abs(fL(3)));
        M3_beam = std::max(M3_beam, std::max(std::abs(fL(5)), std::abs(fL(11))));
    }

    Result r;
    r.formulation = spec.name;
    r.lc = lc_name(lc);
    r.w_max_mm = wmax * 1000;
    r.M11_max_tonfm_m = M11_max / 9.80665;
    r.T_beam_max_kNm = T_beam;
    r.M3_beam_max_kNm = M3_beam;
    return r;
}

int main() {
    std::vector<FormulationSpec> forms = {
        {0, "shellQ4 Mindlin-HB-SRI (Thick)",     "HB-Mindlin"},
        {1, "shellThin Kirchhoff MZC (Thin)",     "MZC-Thin"},
        {2, "shellQ4_DKMQ Katili 1993",           "DKMQ"},
    };
    std::vector<LoadCase> lcs = {LC_DEAD, LC_SCP, LC_LIVE};

    // SAP-thin reference (Shell-Thin) — from results_5x3_separated_sap.csv
    struct SapRef { LoadCase lc; double w_mm; double T_bm_tonfm; };
    std::vector<SapRef> sap_thin = {
        {LC_DEAD, -3.814, 0.5320},
        {LC_SCP,  -13.338, 2.2931},
        {LC_LIVE, -6.669,  1.1465},
    };
    auto sap_w = [&](LoadCase lc) {
        for (auto &r : sap_thin) if (r.lc == lc) return r.w_mm;
        return 0.0;
    };
    auto sap_T = [&](LoadCase lc) {
        for (auto &r : sap_thin) if (r.lc == lc) return r.T_bm_tonfm * 9.80665;  // kN·m
        return 0.0;
    };

    std::vector<Result> all;
    for (auto &f : forms)
        for (auto lc : lcs)
            all.push_back(run_case(f, lc));

    std::cout << "\n========================================================================\n";
    std::cout << "  HEKATAN-FEM C++ — 3 formulaciones shell × 3 cargas vs SAP-thin\n";
    std::cout << "  Mesa Torsion: 4 cols + 4 vigas + losa 6x6 mesh 5x5, BC rotulado\n";
    std::cout << "  Concreto: E=24.85 GPa, nu=0.20 ; DSL servicio (sin factores)\n";
    std::cout << "========================================================================\n";
    std::cout << std::left << std::setw(28) << "Formulación"
              << std::setw(7) << "LC"
              << std::right << std::setw(12) << "w_Hek[mm]"
              << std::setw(12) << "w_SAP[mm]"
              << std::setw(11) << "Diff %"
              << std::setw(14) << "T_bm_Hek[kN·m]"
              << std::setw(14) << "T_bm_SAP[kN·m]"
              << std::setw(11) << "Diff %" << "\n";
    std::cout << "  " << std::string(108, '-') << "\n";

    int idx = 0;
    for (auto &f : forms) {
        for (auto lc : lcs) {
            auto &r = all[idx++];
            double w_sap = sap_w(lc);
            double T_sap = sap_T(lc);
            double dw = (r.w_max_mm - w_sap) / w_sap * 100.0;
            double dT = (T_sap > 0) ? (r.T_beam_max_kNm - T_sap) / T_sap * 100.0 : 0.0;
            std::cout << std::left << std::setw(28) << f.name
                      << std::setw(7) << r.lc
                      << std::right << std::fixed << std::setprecision(3)
                      << std::setw(12) << r.w_max_mm
                      << std::setw(12) << w_sap
                      << std::setw(10) << std::setprecision(1) << dw << "%"
                      << std::setw(14) << std::setprecision(3) << r.T_beam_max_kNm
                      << std::setw(14) << T_sap
                      << std::setw(10) << std::setprecision(1) << dT << "%" << "\n";
        }
        std::cout << "  " << std::string(108, '-') << "\n";
    }

    std::ofstream csv("mesa_shell_formulations_hekatan.csv");
    csv << "formulation,plateFormulationCode,load_case,w_max_mm,M11_max_tonfm_m,"
        << "T_beam_kNm,M3_beam_kNm,w_SAP_thin_mm,T_beam_SAP_kNm,diff_w_pct,diff_T_pct\n";
    idx = 0;
    for (auto &f : forms) {
        for (auto lc : lcs) {
            auto &r = all[idx++];
            double w_sap = sap_w(lc);
            double T_sap = sap_T(lc);
            double dw = (r.w_max_mm - w_sap) / w_sap * 100.0;
            double dT = (T_sap > 0) ? (r.T_beam_max_kNm - T_sap) / T_sap * 100.0 : 0.0;
            csv << f.name << "," << f.code << "," << r.lc << ","
                << r.w_max_mm << "," << r.M11_max_tonfm_m << ","
                << r.T_beam_max_kNm << "," << r.M3_beam_max_kNm << ","
                << w_sap << "," << T_sap << "," << dw << "," << dT << "\n";
        }
    }
    csv.close();
    std::cout << "\n  CSV: mesa_shell_formulations_hekatan.csv\n";
    std::cout << "========================================================================\n";
    return 0;
}
