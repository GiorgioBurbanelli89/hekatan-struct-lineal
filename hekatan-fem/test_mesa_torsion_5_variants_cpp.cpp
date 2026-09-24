// =============================================================================
// test_mesa_torsion_5_variants_cpp.cpp
// Mesa Torsión en solver Hekatan-FEM C++ nativo — 5 ShellTypes
//
// Replica el modelo del e2k "Mesa torsión" iterando sobre 5 variantes:
//   1) Shell-Thin     (Kirchhoff MZC, plateFormulations=1)
//   2) Shell-Thick    (Hughes-Brezzi Mindlin, plateFormulations=0)
//   3) Plate-Thin     (Shell-Thin con máscara DOF membrana = UX,UY,RZ)
//   4) Plate-Thick    (Shell-Thick con máscara DOF membrana = UX,UY,RZ)
//   5) Membrane       (Shell con máscara DOF bending = UZ,RX,RY)
//
// Hekatan-FEM no expone Plate-only ni Membrane-only como flag — el shell
// genérico siempre tiene flexión + membrana acopladas. La máscara DOF en
// la K local del elemento shell antes del ensamblaje replica fielmente
// lo que SAP2000 hace internamente con PropArea.SetShell_1(ShellType=3/4/5).
//
// Geometría (e2k):
//   - Planta 6×6 m, h=4 m
//   - 4 cols C40×40, 4 vigas V30×50, losa t=0.10 m
//   - Mesh losa 5×5 = 25 Q4, 36 nodos losa
//   - Concreto 4000Psi: E=24.85 GPa (≈2.534e6 tonf/m²), ν=0.20 (e2k "U 0.2")
//
// Carga DSL = 1.0·D + 1.0·SCP + 1.0·L (servicio — homologa a SAP2000 DSL,
// no UDCon2 LRFD; ver bitácora P8 + P10).
// BC: 4 bases empotradas.
//
// Referencias:
//   - Edward L. Wilson — "Three-Dimensional Static and Dynamic Analysis of
//     Structures" (4th ed.), Cap. 6 (Shell elements), Cap. 9 (Frame).
//   - CSI Analysis Reference Manual — §6 Shell properties; §10 Diaphragm.
//
// Compilar con build_5_variants.bat (MinGW g++ + Eigen)
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

Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getTransformationMatrix(const std::vector<Node> &nodes);

enum Variant {
    SHELL_THIN  = 0,
    SHELL_THICK = 1,
    PLATE_THIN  = 2,
    PLATE_THICK = 3,
    MEMBRANE    = 4,
};

struct VariantSpec {
    Variant id;
    const char* name;
    const char* slug;
    int plateFormulation;       // 0=ShellThick, 1=ShellThin
    bool maskMembrane;          // anular UX, UY, RZ en K shell
    bool maskBending;           // anular UZ, RX, RY en K shell
};

struct CaseResult {
    std::string name;
    std::string slug;
    double w_max_m;
    double M11_max_kNm_m;
    double M22_max_kNm_m;
    double M12_max_kNm_m;
    double F11_max_kN_m;
    double F22_max_kN_m;
    double T_col_max_kNm;
    double M3_col_max_kNm;
    double T_beam_max_kNm;
    double M3_beam_max_kNm;
};

// ── Aplicar máscara DOF a una K local 24×24 de shell Q4 ──────────────
// Anula filas/columnas de los DOFs especificados (por nodo).
// Para Plate (masking membrane), mask_dofs = {0, 1, 5} → UX, UY, RZ
// Para Membrane (masking bending), mask_dofs = {2, 3, 4} → UZ, RX, RY
void apply_dof_mask(Eigen::MatrixXd &kShell, const std::vector<int> &mask_dofs) {
    for (int n = 0; n < 4; n++) {
        for (int d : mask_dofs) {
            int li = n*6 + d;
            kShell.row(li).setZero();
            kShell.col(li).setZero();
        }
    }
}

CaseResult run_variant(const VariantSpec &spec) {
    using std::cout; using std::endl;
    cout << "\n================================================================\n";
    cout << "  VARIANTE: " << spec.name << "  (slug=" << spec.slug << ")\n";
    cout << "================================================================\n";

    // ── Parámetros (idénticos al test full original) ──
    double Lx = 6.0, Ly = 6.0, H = 4.0;
    double tLosa = 0.10;
    double bC = 0.40, hC = 0.40;
    double bV = 0.30, hV = 0.50;
    double E_GPa = 24.85;
    double nu = 0.20;
    double E = E_GPa * 1e6;       // kN/m²
    double G = E / (2*(1+nu));
    double q_SCP  = 9.80665;      // 1 tonf/m² = 9.80665 kN/m²
    double q_Live = 0.5 * 9.80665;
    double RHO = 24.0;            // kN/m³
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

    // ── Nodes
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

    // ── Elements
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

    // ── Element inputs
    ElementInputs ei;
    for (int e = 0; e < shellCount; e++) {
        ei.thicknesses[e]       = tLosa;
        ei.elasticities[e]      = E;
        ei.poissonsRatios[e]    = nu;
        ei.densities[e]         = rho_mass;
        ei.plateFormulations[e] = spec.plateFormulation;
        ei.drillingTypes[e]     = 0;
    }
    double Ac = bC * bC;
    double Iyc = std::pow(bC, 4) / 12;
    for (int e = colStart; e < colEnd; e++) {
        ei.elasticities[e]       = E; ei.poissonsRatios[e] = nu;
        ei.shearModuli[e]        = G; ei.densities[e]      = rho_mass;
        ei.areas[e]              = Ac;
        ei.momentsOfInertiaY[e]  = Iyc;
        ei.momentsOfInertiaZ[e]  = Iyc;
        ei.torsionalConstants[e] = Jc;
    }
    double Av = bV * hV;
    double Izv = bV * std::pow(hV, 3) / 12;
    double Iyv = hV * std::pow(bV, 3) / 12;
    for (int e = beamStart; e < beamEnd; e++) {
        ei.elasticities[e]       = E; ei.poissonsRatios[e] = nu;
        ei.shearModuli[e]        = G; ei.densities[e]      = rho_mass;
        ei.areas[e]              = Av;
        ei.momentsOfInertiaY[e]  = Iyv;
        ei.momentsOfInertiaZ[e]  = Izv;
        ei.torsionalConstants[e] = Jv;
    }

    // ── Ensemble K con máscara DOF según variante ─────────────
    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips;
    trips.reserve(nElems * 576);

    std::vector<int> mask_dofs;
    if (spec.maskMembrane) mask_dofs = {0, 1, 5};   // UX, UY, RZ
    if (spec.maskBending)  mask_dofs = {2, 3, 4};   // UZ, RX, RY

    for (size_t e = 0; e < elements.size(); e++) {
        std::vector<Node> elN;
        for (auto n : elements[e]) elN.push_back(nodes[n]);
        Eigen::MatrixXd kL = getLocalStiffnessMatrix(elN, ei, e);
        Eigen::MatrixXd T = getTransformationMatrix(elN);

        // Aplicar máscara solo a SHELL elements (no a cols/vigas)
        if ((int)e < shellCount && !mask_dofs.empty()) {
            apply_dof_mask(kL, mask_dofs);
        }

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

    // ── F: carga DSL = 1.0·D + 1.0·SCP + 1.0·L (servicio, homóloga SAP)
    // Para variante Membrane, la carga vertical en losa NO tiene rigidez UZ
    // → distribuir a vigas tributariamente (como ETABS ONEWAYLOADDIST)
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    double q_sw = RHO * tLosa;
    double q_total = q_sw + q_SCP + q_Live;
    double q_total_membr_beam = q_total * (Lx / 2.0);   // tributario

    if (spec.id == MEMBRANE) {
        // Distribuir a los 4*N segmentos de viga como carga lineal
        // Cada segmento de viga absorbe q_total*dx*Lx/2 / N (aprox)
        // Mejor: aplicar en cada NODO de viga la fracción correspondiente
        //  - nodos esquina viga: cargados por 2 segmentos
        //  - nodos intermedios viga: cargados por 2 segmentos completos
        // Para simplificar: distribuir q_total*Area_total a los 4*N+4 nodos
        // perimetrales (los nodos del borde de la losa)
        int n_perim = 4 * N;   // segmentos de viga = nodos perimetrales sin esquinas dup
        double load_per_perim_node = q_total * Lx * Ly / n_perim;
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            if (xE || yE) {
                int n = ix(i, j);
                double share = (xE && yE) ? 0.5 : 1.0;   // esquinas: media porción
                F(n*6 + 2) -= load_per_perim_node * share / 2.0;
            }
        }
    } else {
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            int n = ix(i, j);
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            double f = q_total * dx * dy;
            if (xE && yE) f *= 0.25;
            else if (xE || yE) f *= 0.5;
            F(n*6 + 2) -= f;
        }
    }

    // ── BCs: bases empotradas + (variante-dependiente) fijar DOFs anulados
    std::vector<bool> fixed(dof, false);
    for (int n : {0, 1, 2, 3})
        for (int d = 0; d < 6; d++) fixed[n*6 + d] = true;

    // Si la máscara anuló DOFs del shell, esos DOFs en nodos PUROS de losa
    // (no conectados a frame) quedan singulares → fijar.
    // Identifico nodos puros: aquellos que no son esquina superior y no
    // pertenecen al perímetro (que tienen vigas conectadas).
    // En realidad, todos los nodos del borde tienen viga; los interiores no.
    if (!mask_dofs.empty()) {
        for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
            bool xE = (i==0 || i==N), yE = (j==0 || j==N);
            bool interior = !(xE || yE);   // nodo solo en shell
            if (interior) {
                int n = ix(i, j);
                for (int d : mask_dofs) fixed[n*6 + d] = true;
            }
        }
    }

    std::vector<int> free_dofs;
    for (int i = 0; i < dof; i++) if (!fixed[i]) free_dofs.push_back(i);
    int nf = free_dofs.size();
    cout << "  nNodes=" << nNodes << "  dof=" << dof << "  free=" << nf << "\n";

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
        cout << "  ERROR: factorización falló (matriz singular)\n";
        return CaseResult{spec.name, spec.slug, 0,0,0,0,0,0,0,0,0,0};
    }
    Eigen::VectorXd ur = solver.solve(Fr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    for (int i = 0; i < nf; i++) u(free_dofs[i]) = ur(i);

    // ── w_max losa ──
    double wmax = 0;
    for (int n = N_BASE; n < nNodes; n++) {
        if (std::abs(u(n*6+2)) > std::abs(wmax)) wmax = u(n*6+2);
    }

    // ── M11/M22/M12 en centroide (solo si Plate o Shell con bending) ──
    double D = E * tLosa*tLosa*tLosa / (12.0 * (1.0 - nu*nu));
    double dNdxi[4]  = {-0.25,  0.25, 0.25, -0.25};
    double dNdeta[4] = {-0.25, -0.25, 0.25,  0.25};
    double a = dx/2.0, b = dy/2.0;
    double M11_max=0, M22_max=0, M12_max=0;
    if (!spec.maskBending) {
        for (int e = 0; e < shellCount; e++) {
            auto &el = elements[e];
            double uL[24];
            for (int n = 0; n < 4; n++)
                for (int d = 0; d < 6; d++) uL[n*6+d] = u(el[n]*6+d);
            double kxx=0, kyy=0, kxy=0;
            for (int n = 0; n < 4; n++) {
                double tx = uL[n*6+3];
                double ty = uL[n*6+4];
                double dx_ = dNdxi[n] / a;
                double dy_ = dNdeta[n] / b;
                kxx += -dx_ * ty;
                kyy += +dy_ * tx;
                kxy += +dx_ * tx - dy_ * ty;
            }
            double m11 = D * (kxx + nu*kyy);
            double m22 = D * (nu*kxx + kyy);
            double m12 = D * (1-nu)/2 * kxy;
            M11_max = std::max(M11_max, std::abs(m11));
            M22_max = std::max(M22_max, std::abs(m22));
            M12_max = std::max(M12_max, std::abs(m12));
        }
    }

    // ── F11/F22/F12 membrana (in-plane forces, solo si NO maskMembrane) ──
    double F11_max=0, F22_max=0;
    if (!spec.maskMembrane) {
        double Em_t = E * tLosa / (1.0 - nu*nu);
        for (int e = 0; e < shellCount; e++) {
            auto &el = elements[e];
            double uL[24];
            for (int n = 0; n < 4; n++)
                for (int d = 0; d < 6; d++) uL[n*6+d] = u(el[n]*6+d);
            double exx=0, eyy=0;
            for (int n = 0; n < 4; n++) {
                double ux = uL[n*6+0];
                double uy = uL[n*6+1];
                double dx_ = dNdxi[n] / a;
                double dy_ = dNdeta[n] / b;
                exx += dx_ * ux;
                eyy += dy_ * uy;
            }
            double f11 = Em_t * (exx + nu*eyy);
            double f22 = Em_t * (nu*exx + eyy);
            F11_max = std::max(F11_max, std::abs(f11));
            F22_max = std::max(F22_max, std::abs(f22));
        }
    }

    // ── Frame forces: T (axial), M3 (in-plane bending) en cols y vigas ──
    // Calculo el internal axial via deformación axial del frame
    double T_col=0, M3_col=0, T_beam=0, M3_beam=0;
    auto frame_forces = [&](int eStart, int eEnd, double &T_max, double &M3_max) {
        for (int e = eStart; e < eEnd; e++) {
            auto &el = elements[e];
            Eigen::Vector3d n0(nodes[el[0]][0], nodes[el[0]][1], nodes[el[0]][2]);
            Eigen::Vector3d n1(nodes[el[1]][0], nodes[el[1]][1], nodes[el[1]][2]);
            double L = (n1 - n0).norm();
            if (L < 1e-12) continue;
            // K local del frame en su propio sistema (12×12)
            std::vector<Node> elN = {nodes[el[0]], nodes[el[1]]};
            Eigen::MatrixXd kL = getLocalStiffnessMatrix(elN, ei, e);
            Eigen::MatrixXd Tt = getTransformationMatrix(elN);
            Eigen::VectorXd uG(12);
            for (int n = 0; n < 2; n++)
                for (int d = 0; d < 6; d++) uG(n*6+d) = u(el[n]*6+d);
            Eigen::VectorXd uL_vec = Tt * uG;
            Eigen::VectorXd fL = kL * uL_vec;
            // En convención frame: fL = [Fx,Fy,Fz,Mx,My,Mz, Fx',Fy',Fz',Mx',My',Mz']
            // Axial = fL(0) (compresión - / tracción +)
            // Torsion = fL(3)
            // M3 (in-plane minor axis bending around Z) = fL(5)
            double T_e  = std::abs(fL(3));      // torsion en el extremo 0
            double M3_e = std::max(std::abs(fL(5)), std::abs(fL(11)));
            T_max  = std::max(T_max, T_e);
            M3_max = std::max(M3_max, M3_e);
        }
    };
    frame_forces(colStart, colEnd, T_col,  M3_col);
    frame_forces(beamStart, beamEnd, T_beam, M3_beam);

    cout << "  w_max losa     = " << std::scientific << std::setprecision(4) << wmax << " m\n";
    cout << "  |M11|max ctroid= " << M11_max << " kN·m/m  ("
         << M11_max/9.80665 << " tonf·m/m)\n";
    cout << "  |F11|max memb  = " << F11_max << " kN/m\n";
    cout << "  T col max      = " << T_col   << " kN·m\n";
    cout << "  M3 col max     = " << M3_col  << " kN·m\n";
    cout << "  T beam max     = " << T_beam  << " kN·m\n";
    cout << "  M3 beam max    = " << M3_beam << " kN·m\n";

    CaseResult r;
    r.name = spec.name; r.slug = spec.slug;
    r.w_max_m = wmax;
    r.M11_max_kNm_m = M11_max; r.M22_max_kNm_m = M22_max; r.M12_max_kNm_m = M12_max;
    r.F11_max_kN_m  = F11_max; r.F22_max_kN_m  = F22_max;
    r.T_col_max_kNm = T_col;   r.M3_col_max_kNm  = M3_col;
    r.T_beam_max_kNm = T_beam; r.M3_beam_max_kNm = M3_beam;
    return r;
}

int main() {
    std::vector<VariantSpec> variants = {
        {SHELL_THIN,  "Shell-Thin",  "shell_thin",  1, false, false},
        {SHELL_THICK, "Shell-Thick", "shell_thick", 0, false, false},
        {PLATE_THIN,  "Plate-Thin",  "plate_thin",  1, true,  false},
        {PLATE_THICK, "Plate-Thick", "plate_thick", 0, true,  false},
        {MEMBRANE,    "Membrane",    "membrane",    1, false, true },
    };

    std::vector<CaseResult> results;
    for (auto &v : variants) {
        auto r = run_variant(v);
        results.push_back(r);
    }

    // ── Tabla resumen ──
    std::cout << "\n================================================================\n";
    std::cout << "  RESUMEN — Mesa Torsión 5 ShellTypes (Hekatan-FEM C++ nativo)\n";
    std::cout << "================================================================\n";
    std::cout << std::left << std::setw(14) << "Variant"
              << std::right << std::setw(13) << "w_max[m]"
              << std::setw(13) << "M11[tonf·m/m]"
              << std::setw(13) << "F11[kN/m]"
              << std::setw(11) << "T_col[kN·m]"
              << std::setw(12) << "T_beam[kN·m]" << "\n";
    for (auto &r : results) {
        std::cout << std::left << std::setw(14) << r.name
                  << std::right << std::scientific << std::setprecision(3)
                  << std::setw(13) << r.w_max_m
                  << std::setw(13) << r.M11_max_kNm_m/9.80665
                  << std::setw(13) << r.F11_max_kN_m
                  << std::setw(11) << r.T_col_max_kNm
                  << std::setw(12) << r.T_beam_max_kNm << "\n";
    }

    // CSV
    std::ofstream csv("mesa_torsion_5_variants_hekatan.csv");
    csv << "variant,slug,w_max_m,M11_max_kNm_m,M22_max_kNm_m,M12_max_kNm_m,"
        << "F11_max_kN_m,F22_max_kN_m,T_col_kNm,M3_col_kNm,T_beam_kNm,M3_beam_kNm\n";
    for (auto &r : results) {
        csv << r.name << "," << r.slug << ","
            << r.w_max_m << "," << r.M11_max_kNm_m << "," << r.M22_max_kNm_m << ","
            << r.M12_max_kNm_m << "," << r.F11_max_kN_m << "," << r.F22_max_kN_m << ","
            << r.T_col_max_kNm << "," << r.M3_col_max_kNm << ","
            << r.T_beam_max_kNm << "," << r.M3_beam_max_kNm << "\n";
    }
    csv.close();
    std::cout << "\nCSV: mesa_torsion_5_variants_hekatan.csv\n";
    return 0;
}
