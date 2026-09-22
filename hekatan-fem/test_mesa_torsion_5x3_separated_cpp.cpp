// =============================================================================
// test_mesa_torsion_5x3_separated_cpp.cpp
// Mesa Torsión — 5 ShellTypes × 3 cargas SEPARADAS (Dead, SCP, Live)
//
// Estrategia debugging: si Dead da igual en Hekatan y SAP, y SCP da igual,
// y Live da igual → la combinación tiene que dar igual. Si algún caso solo
// difiere, ahí está el bug.
//
// Geometría idéntica a test_mesa_torsion_5_variants_cpp.cpp:
//   6×6×4 m, 4 col C40×40, 4 vigas V30×50, losa t=0.10, mesh 5×5
//   Concreto: E=24.85 GPa, ν=0.20 (homologado con e2k SAP)
//
// Cargas (SIN factores LRFD):
//   Dead = peso propio losa = γ_conc·t = 24·0.10 = 2.4 kN/m² (no col/viga)
//   SCP  = 1.0 tonf/m² = 9.80665 kN/m²
//   Live = 0.5 tonf/m² = 4.90333 kN/m²
//
// Salida: tabla 5×3 + mesa_torsion_5x3_separated_hekatan.csv
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

// FIX P21: peso propio automático (= SAP selfweight=1)
Eigen::VectorXd computeSelfWeightLoads(
    const std::vector<Node>& nodes,
    const std::vector<std::vector<unsigned int>>& elements,
    const ElementInputs& elementInputs,
    int gravity_dir, double gravity_sign, double g);

enum LoadCase { LC_DEAD = 0, LC_SCP = 1, LC_LIVE = 2 };
const char* lc_name(LoadCase lc) {
    switch(lc) { case LC_DEAD: return "Dead"; case LC_SCP: return "SCP"; case LC_LIVE: return "Live"; }
    return "?";
}

struct VariantSpec {
    const char* name;
    const char* slug;
    int plateFormulation;
    bool maskMembrane;
    bool maskBending;
};

void apply_dof_mask(Eigen::MatrixXd &kShell, const std::vector<int> &mask_dofs) {
    for (int n = 0; n < 4; n++)
        for (int d : mask_dofs) {
            int li = n*6 + d;
            kShell.row(li).setZero();
            kShell.col(li).setZero();
        }
}

struct Result {
    std::string variant, lc;
    double w_max_m;
    double M11_max_kNm_m;
    double F11_max_kN_m;
    double T_beam_max_kNm;
    double M3_beam_max_kNm;
    // SAP2000-style principales (Mohr 2D) + magnitud shear:
    double Mmax_max_kNm_m;   // max( principal max ) sobre todas las shells
    double Mmin_min_kNm_m;   // min( principal min )
    double Vmax_max_kN_m;    // max sqrt(V13^2 + V23^2)
};

Result run_case(const VariantSpec &spec, LoadCase lc, bool verbose=false) {
    double Lx = 6.0, Ly = 6.0, H = 4.0;
    double tLosa = 0.10;
    double bC = 0.40, hC = 0.40;
    double bV = 0.30, hV = 0.50;
    double E_GPa = 24.85;
    double nu = 0.20;                     // ← homologado con e2k SAP
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
    int nElems = elements.size();

    ElementInputs ei;
    for (int e = 0; e < shellCount; e++) {
        ei.thicknesses[e] = tLosa; ei.elasticities[e] = E;
        ei.poissonsRatios[e] = nu; ei.densities[e] = rho_mass;
        ei.plateFormulations[e] = spec.plateFormulation;
        ei.drillingTypes[e] = 0;
    }
    double Ac = bC * bC, Iyc = std::pow(bC, 4) / 12;
    for (int e = colStart; e < colEnd; e++) {
        ei.elasticities[e]=E; ei.poissonsRatios[e]=nu;
        ei.shearModuli[e]=G; ei.densities[e]=rho_mass;
        ei.areas[e]=Ac; ei.momentsOfInertiaY[e]=Iyc;
        ei.momentsOfInertiaZ[e]=Iyc; ei.torsionalConstants[e]=Jc;
    }
    // FIX P20: convención de ejes locales Hekatan para vigas horizontales.
    // V30x50: D=0.5 vertical, B=0.3 horizontal.
    // Para flexión gravitacional (eje neutro horizontal, eje y local):
    //   Iy_local = b*h^3/12 = 0.3*0.5^3/12 = 0.003125 m^4 ← eje FUERTE
    // Para flexión lateral (eje neutro vertical, eje z local):
    //   Iz_local = h*b^3/12 = 0.5*0.3^3/12 = 0.001125 m^4 ← eje débil
    // Pre-fix tenía intercambiados → vigas modeladas con eje débil en vertical
    // → +24% gap espurio en w_max.
    double Av = bV * hV;
    double Iy_fuerte = bV*std::pow(hV,3)/12;   // 0.003125 — gravitacional
    double Iz_debil  = hV*std::pow(bV,3)/12;   // 0.001125 — lateral
    for (int e = beamStart; e < beamEnd; e++) {
        ei.elasticities[e]=E; ei.poissonsRatios[e]=nu;
        ei.shearModuli[e]=G; ei.densities[e]=rho_mass;
        ei.areas[e]=Av;
        ei.momentsOfInertiaY[e]=Iy_fuerte;   // ← fuerte (gravitacional)
        ei.momentsOfInertiaZ[e]=Iz_debil;    // ← débil (lateral)
        ei.torsionalConstants[e]=Jv;
    }

    // ── Ensemble K
    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips;
    trips.reserve(nElems * 576);
    std::vector<int> mask_dofs;
    if (spec.maskMembrane) mask_dofs = {0, 1, 5};
    if (spec.maskBending)  mask_dofs = {2, 3, 4};

    // CARDINALPT 8 del e2k tiene TRANSFORMSTIFFNESSFOROFFSETS implícito "No"
    // → SAP NO transforma stiffness (es solo display). Hekatan tampoco.

    for (size_t e = 0; e < elements.size(); e++) {
        std::vector<Node> elN;
        for (auto n : elements[e]) elN.push_back(nodes[n]);
        Eigen::MatrixXd kL = getLocalStiffnessMatrix(elN, ei, e);
        Eigen::MatrixXd T = getTransformationMatrix(elN);
        if ((int)e < shellCount && !mask_dofs.empty()) apply_dof_mask(kL, mask_dofs);
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

    // ── F: una sola carga (Dead, SCP o Live) sin factores
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);

    // P21: Dead = peso propio automático de TODOS los elementos (frame+area)
    //  via computeSelfWeightLoads (= SAP selfweight=1 de LoadPattern Dead).
    // Para SCP/Live: carga superficial sobre la losa.
    double q_load_slab = 0.0;
    if (lc == LC_DEAD) {
        F += computeSelfWeightLoads(nodes, elements, ei, 2, -1.0, 9.80665);
        // Continuar con el resto del loop sin carga superficial extra
    }
    if (lc == LC_SCP)  q_load_slab = 9.80665;          // 1 tonf/m²
    if (lc == LC_LIVE) q_load_slab = 0.5 * 9.80665;    // 0.5 tonf/m²

    bool is_membrane = spec.maskBending;
    if (q_load_slab > 0.0 && is_membrane) {
        // Bug fix P13: total_share = 4*0.5 (esquinas) + 4*(N-1)*1.0 (laterales)
        double total_share = 4*0.5 + 4*(N-1)*1.0;
        double total_load_kN = q_load_slab * Lx * Ly;
        double load_per_unit_share = total_load_kN / total_share;
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            if (xE || yE) {
                int n = ix(i, j);
                double share = (xE && yE) ? 0.5 : 1.0;
                F(n*6 + 2) -= load_per_unit_share * share;
            }
        }
    } else if (q_load_slab > 0.0) {
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            int n = ix(i, j);
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            double f = q_load_slab * dx * dy;
            if (xE && yE) f *= 0.25;
            else if (xE || yE) f *= 0.5;
            F(n*6 + 2) -= f;
        }
    }

    // Bloque de peso de vigas manual eliminado — ahora lo cubre P21 automáticamente.
    double q_load_beam_lin = 0.0;
    if (q_load_beam_lin > 0.0) {
        double L_seg_x = dx;  // segmentos de viga X
        double L_seg_y = dy;
        // Side S y N: viga en X, segmentos de longitud dx
        // Side E y W: viga en Y, segmentos de longitud dy
        for (int i = 0; i < N; i++) {
            double f_x = q_load_beam_lin * L_seg_x / 2.0;
            F(ix(i,   0)*6 + 2) -= f_x;
            F(ix(i+1, 0)*6 + 2) -= f_x;
            F(ix(i,   N)*6 + 2) -= f_x;
            F(ix(i+1, N)*6 + 2) -= f_x;
        }
        for (int j = 0; j < N; j++) {
            double f_y = q_load_beam_lin * L_seg_y / 2.0;
            F(ix(N, j  )*6 + 2) -= f_y;
            F(ix(N, j+1)*6 + 2) -= f_y;
            F(ix(0, j  )*6 + 2) -= f_y;
            F(ix(0, j+1)*6 + 2) -= f_y;
        }
    }

    // ── BCs (FIX P16): bases ROTULADAS (e2k "RESTRAINT UX UY UZ"),
    // NO empotradas. ETABS .OUT confirma JOINTS 1-4 con DOFs - - - A A A
    // (UX,UY,UZ restringidos; RX,RY,RZ libres). El empotramiento total
    // sobre-rigidizaba el modelo Hekatan (causa parcial del gap residual).
    std::vector<bool> fixed(dof, false);
    for (int n : {0, 1, 2, 3}) {
        fixed[n*6 + 0] = true;   // UX
        fixed[n*6 + 1] = true;   // UY
        fixed[n*6 + 2] = true;   // UZ
        // RX, RY, RZ libres (rótula)
    }
    if (!mask_dofs.empty()) {
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            bool interior = !(xE || yE);
            if (interior) {
                int n = ix(i, j);
                for (int d : mask_dofs) fixed[n*6 + d] = true;
            }
        }
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
    if (solver.info() != Eigen::Success) {
        return Result{spec.name, lc_name(lc), 0,0,0,0,0};
    }
    Eigen::VectorXd ur = solver.solve(Fr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    for (int i = 0; i < nf; i++) u(free_dofs[i]) = ur(i);

    double wmax = 0;
    for (int n = N_BASE; n < nNodes; n++)
        if (std::abs(u(n*6+2)) > std::abs(wmax)) wmax = u(n*6+2);

    double D = E * tLosa*tLosa*tLosa / (12.0 * (1.0 - nu*nu));
    double dNdxi[4]  = {-0.25,  0.25, 0.25, -0.25};
    double dNdeta[4] = {-0.25, -0.25, 0.25,  0.25};
    double a = dx/2.0, b = dy/2.0;
    double M11_max = 0;
    if (!spec.maskBending) {
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
    }
    double F11_max = 0;
    if (!spec.maskMembrane) {
        double Em_t = E * tLosa / (1.0 - nu*nu);
        for (int e = 0; e < shellCount; e++) {
            auto &el = elements[e];
            double uL[24];
            for (int n = 0; n < 4; n++)
                for (int d = 0; d < 6; d++) uL[n*6+d] = u(el[n]*6+d);
            double exx=0, eyy=0;
            for (int n = 0; n < 4; n++) {
                double ux = uL[n*6+0], uy = uL[n*6+1];
                exx += (dNdxi[n]/a) * ux;
                eyy += (dNdeta[n]/b) * uy;
            }
            double f11 = Em_t * (exx + nu*eyy);
            F11_max = std::max(F11_max, std::abs(f11));
        }
    }

    // ── SAP2000-style principales: Mmax / Mmin (Mohr 2D) + Vmax magnitude ──
    // Iterar sobre todas las shells; M11/M22/M12 ya derivados arriba, ahora
    // computar también V13/V23 (shear Mindlin via gxz, gyz) y los invariantes.
    double Mmax_global = -1e30, Mmin_global = +1e30, Vmax_global = 0.0;
    if (!spec.maskBending) {
        double G_ = E / (2.0 * (1.0 + nu));
        double ks_ = 5.0 / 6.0;
        double N_c[4] = {0.25, 0.25, 0.25, 0.25};
        for (int e = 0; e < shellCount; e++) {
            auto &el = elements[e];
            double uL[24];
            for (int n = 0; n < 4; n++)
                for (int d = 0; d < 6; d++) uL[n*6+d] = u(el[n]*6+d);
            double kxx=0, kyy=0, kxy=0;
            double dwdx=0, dwdy=0;
            double tx_c=0, ty_c=0;
            for (int n = 0; n < 4; n++) {
                double tx = uL[n*6+3], ty = uL[n*6+4], w_n = uL[n*6+2];
                double dx_ = dNdxi[n] / a;
                double dy_ = dNdeta[n] / b;
                kxx += -dx_ * ty;
                kyy += +dy_ * tx;
                kxy += +dx_ * tx - dy_ * ty;
                dwdx += dx_ * w_n;
                dwdy += dy_ * w_n;
                tx_c += N_c[n] * tx;
                ty_c += N_c[n] * ty;
            }
            double m11 = D * (kxx + nu * kyy);
            double m22 = D * (nu * kxx + kyy);
            double m12 = D * (1.0 - nu) / 2.0 * kxy;
            double avg = 0.5 * (m11 + m22);
            double R   = std::sqrt(0.25 * (m11 - m22) * (m11 - m22) + m12 * m12);
            double mmax = avg + R;
            double mmin = avg - R;
            if (mmax > Mmax_global) Mmax_global = mmax;
            if (mmin < Mmin_global) Mmin_global = mmin;
            // Shear Mindlin (Hekatan): gxz = dw/dx + ty_global, gyz = dw/dy - tx_global
            double gxz = dwdx + ty_c;
            double gyz = dwdy - tx_c;
            double v13 = ks_ * G_ * tLosa * gxz;
            double v23 = ks_ * G_ * tLosa * gyz;
            double vmag = std::sqrt(v13 * v13 + v23 * v23);
            if (vmag > Vmax_global) Vmax_global = vmag;
        }
    }
    if (Mmax_global == -1e30) Mmax_global = 0.0;
    if (Mmin_global == +1e30) Mmin_global = 0.0;

    // Frame: torsión y M3 vigas
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
        T_beam  = std::max(T_beam,  std::abs(fL(3)));
        M3_beam = std::max(M3_beam, std::max(std::abs(fL(5)), std::abs(fL(11))));
    }

    Result r;
    r.variant = spec.name; r.lc = lc_name(lc);
    r.w_max_m = wmax;
    r.M11_max_kNm_m = M11_max;
    r.F11_max_kN_m = F11_max;
    r.T_beam_max_kNm = T_beam;
    r.M3_beam_max_kNm = M3_beam;
    r.Mmax_max_kNm_m = Mmax_global;
    r.Mmin_min_kNm_m = Mmin_global;
    r.Vmax_max_kN_m  = Vmax_global;
    return r;
}

int main() {
    std::vector<VariantSpec> variants = {
        {"Shell-Thin",  "shell_thin",  1, false, false},
        {"Shell-Thick", "shell_thick", 0, false, false},
        {"Plate-Thin",  "plate_thin",  1, true,  false},
        {"Plate-Thick", "plate_thick", 0, true,  false},
        {"Membrane",    "membrane",    1, false, true },
    };
    std::vector<LoadCase> lcs = {LC_DEAD, LC_SCP, LC_LIVE};

    std::vector<Result> all;
    for (auto &v : variants)
        for (auto lc : lcs)
            all.push_back(run_case(v, lc));

    std::cout << "\n========================================================================\n";
    std::cout << "  HEKATAN-FEM C++  — Mesa Torsión 5×3 (variant × load case separado)\n";
    std::cout << "  ν=0.20 (homologado con SAP)  ·  Sin factores LRFD\n";
    std::cout << "========================================================================\n";
    std::cout << std::left << std::setw(13) << "Variant" << std::setw(7) << "Case"
              << std::right << std::setw(12) << "w_max[m]"
              << std::setw(12) << "M11[t/m]"
              << std::setw(11) << "F11[kN/m]"
              << std::setw(12) << "T_bm[kN·m]"
              << std::setw(12) << "Mmax[t/m]"
              << std::setw(12) << "Mmin[t/m]"
              << std::setw(12) << "Vmax[kN/m]" << "\n";
    std::cout << "  " << std::string(90, '-') << "\n";
    for (auto &r : all) {
        std::cout << std::left << std::setw(13) << r.variant << std::setw(7) << r.lc
                  << std::right << std::scientific << std::setprecision(3)
                  << std::setw(12) << r.w_max_m
                  << std::setw(12) << r.M11_max_kNm_m/9.80665
                  << std::setw(11) << r.F11_max_kN_m
                  << std::setw(12) << r.T_beam_max_kNm
                  << std::setw(12) << r.Mmax_max_kNm_m/9.80665
                  << std::setw(12) << r.Mmin_min_kNm_m/9.80665
                  << std::setw(12) << r.Vmax_max_kN_m << "\n";
    }

    std::ofstream csv("mesa_torsion_5x3_separated_hekatan.csv");
    csv << "variant,slug,load_case,w_max_m,M11_max_tonfm_m,F11_max_kNm,T_beam_kNm,"
        << "M3_beam_kNm,Mmax_max_tonfm_m,Mmin_min_tonfm_m,Vmax_max_kNm\n";
    int i = 0;
    for (auto &v : variants) for (auto lc : lcs) {
        auto &r = all[i++];
        csv << r.variant << "," << v.slug << "," << r.lc << ","
            << r.w_max_m << "," << r.M11_max_kNm_m/9.80665 << ","
            << r.F11_max_kN_m << "," << r.T_beam_max_kNm << ","
            << r.M3_beam_max_kNm << ","
            << r.Mmax_max_kNm_m/9.80665 << ","
            << r.Mmin_min_kNm_m/9.80665 << ","
            << r.Vmax_max_kN_m << "\n";
    }
    csv.close();
    std::cout << "\n  CSV: mesa_torsion_5x3_separated_hekatan.csv\n";
    return 0;
}
