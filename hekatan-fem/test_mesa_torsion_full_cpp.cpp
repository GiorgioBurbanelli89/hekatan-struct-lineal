// =============================================================================
// Test C++ standalone — MESA TORSIÓN COMPLETA (cols + vigas + losa shell)
//
// Replica el modelo exacto de mesa-torsion (4 cols C40×40 + 4 vigas V30×50 +
// losa 6×6×0.10 con mesh 5×5). Carga UDCon2 = 1.2·D + 1.2·SCP + 1.6·L.
//
// Calcula M11 SHELL con CONVENCIÓN CORRECTA (hipótesis B = swap θx↔θy)
// y compara contra ETABS |M11|max = 2.97 tonf·m/m.
//
// Si C++ da ≈ 2.97 tonf·m/m → fix analyze.ts validado.
// Si C++ da otro → hay otro bug aparte de la convención.
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

Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getTransformationMatrix(const std::vector<Node> &nodes);

int main() {
    std::cout << std::scientific << std::setprecision(4);

    // ── Parámetros mesa-torsion ──
    double Lx = 6.0, Ly = 6.0, H = 4.0;
    double tLosa = 0.10;
    double bC = 0.40, hC = 0.40;          // Col 40×40
    double bV = 0.30, hV = 0.50;          // Viga 30×50
    double E_GPa = 24.85;                 // f'c = 4000 psi
    double nu = 0.15;
    double E = E_GPa * 1e6;               // kN/m²
    double G = E / (2*(1+nu));
    double q_SCP = 9.80665;               // 1 tonf/m² = 9.80665 kN/m²
    double q_Live = 0.5 * 9.80665;        // 0.5 tonf/m² Live
    double RHO = 24.0;                    // 24 kN/m³ concreto (peso esp.)
    double rho_mass = RHO / 9.80665;      // t/m³ (masa SI)

    // ── Geometría mesh ──
    int N = 5;                            // mesh 5×5 losa
    int nPerSide = N + 1;
    double dx = Lx / N, dy = Ly / N;

    // Saint-Venant J rectangular
    auto stVenantJ = [](double b, double h) {
        double a = std::max(b,h), s = std::min(b,h), r = s/a;
        double beta = (1.0/3.0) * (1 - 0.21*r*(1 - std::pow(r,4)/12));
        return beta * a * s*s*s;
    };
    double Jc = 0.141 * std::pow(bC, 4);
    double Jv = stVenantJ(bV, hV);

    // ── Nodes ──
    std::vector<Node> nodes;
    // Bases col (Z=0) en esquinas
    nodes.push_back({0,  0,  0});       // 0
    nodes.push_back({Lx, 0,  0});       // 1
    nodes.push_back({Lx, Ly, 0});       // 2
    nodes.push_back({0,  Ly, 0});       // 3
    int N_BASE = 4;
    // Grid losa en Z=H
    for (int j = 0; j < nPerSide; j++)
        for (int i = 0; i < nPerSide; i++)
            nodes.push_back({i*dx, j*dy, H});
    int nNodes = nodes.size();
    int dof = 6 * nNodes;
    auto ix = [&](int i, int j) { return N_BASE + j*nPerSide + i; };

    // ── Elements ──
    std::vector<std::vector<unsigned int>> elements;
    // Shells losa
    for (int j = 0; j < N; j++)
        for (int i = 0; i < N; i++)
            elements.push_back({(unsigned)ix(i,j), (unsigned)ix(i+1,j), (unsigned)ix(i+1,j+1), (unsigned)ix(i,j+1)});
    int shellCount = elements.size();
    // 4 cols (de base a esquina losa)
    elements.push_back({0, (unsigned)ix(0,0)});
    elements.push_back({1, (unsigned)ix(N,0)});
    elements.push_back({2, (unsigned)ix(N,N)});
    elements.push_back({3, (unsigned)ix(0,N)});
    int colStart = shellCount, colEnd = elements.size();
    // 4 vigas perimetrales subdivididas
    for (int i = 0; i < N; i++) elements.push_back({(unsigned)ix(i,0),   (unsigned)ix(i+1,0)});   // S
    for (int j = 0; j < N; j++) elements.push_back({(unsigned)ix(N,j),   (unsigned)ix(N,j+1)});   // E
    for (int i = 0; i < N; i++) elements.push_back({(unsigned)ix(i,N),   (unsigned)ix(i+1,N)});   // N
    for (int j = 0; j < N; j++) elements.push_back({(unsigned)ix(0,j),   (unsigned)ix(0,j+1)});   // W
    int beamStart = colEnd, beamEnd = elements.size();
    int nElems = elements.size();

    // ── Element inputs ──
    ElementInputs ei;
    // Shells
    for (int e = 0; e < shellCount; e++) {
        ei.thicknesses[e] = tLosa;
        ei.elasticities[e] = E;
        ei.poissonsRatios[e] = nu;
        ei.densities[e] = rho_mass;
        ei.plateFormulations[e] = 1;      // Shell-Thin
        ei.drillingTypes[e] = 0;          // legacy (no HB para este test)
    }
    // Cols (cuadradas)
    double Ac = bC * bC;
    double Iyc = std::pow(bC, 4) / 12;
    for (int e = colStart; e < colEnd; e++) {
        ei.elasticities[e] = E; ei.poissonsRatios[e] = nu;
        ei.shearModuli[e] = G; ei.densities[e] = rho_mass;
        ei.areas[e] = Ac;
        ei.momentsOfInertiaY[e] = Iyc;
        ei.momentsOfInertiaZ[e] = Iyc;
        ei.torsionalConstants[e] = Jc;
    }
    // Vigas
    double Av = bV * hV;
    double Izv = bV * std::pow(hV, 3) / 12;
    double Iyv = hV * std::pow(bV, 3) / 12;
    for (int e = beamStart; e < beamEnd; e++) {
        ei.elasticities[e] = E; ei.poissonsRatios[e] = nu;
        ei.shearModuli[e] = G; ei.densities[e] = rho_mass;
        ei.areas[e] = Av;
        ei.momentsOfInertiaY[e] = Iyv;
        ei.momentsOfInertiaZ[e] = Izv;
        ei.torsionalConstants[e] = Jv;
    }

    // ── Build K global usando getLocalStiffnessMatrix + getTransformationMatrix ──
    Eigen::SparseMatrix<double> K(dof, dof);
    std::vector<Eigen::Triplet<double>> trips;
    trips.reserve(nElems * 576);
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

    // ── F: UDCon2 = 1.2·D (selfweight) + 1.2·SCP + 1.6·Live ──
    // Selfweight shell tributario en nodos
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    double q_sw = RHO * tLosa;            // 24 × 0.10 = 2.4 kN/m² selfweight
    double q_total = 1.2 * q_sw + 1.2 * q_SCP + 1.6 * q_Live;
    for (int j = 0; j < nPerSide; j++) for (int i = 0; i < nPerSide; i++) {
        int n = ix(i, j);
        bool xE = (i==0 || i==N), yE = (j==0 || j==N);
        double f = q_total * dx * dy;
        if (xE && yE) f *= 0.25;
        else if (xE || yE) f *= 0.5;
        F(n*6 + 2) = -f;
    }

    // ── BCs: 4 bases col empotradas ──
    std::vector<bool> fixed(dof, false);
    for (int n : {0, 1, 2, 3})
        for (int d = 0; d < 6; d++) fixed[n*6 + d] = true;

    std::vector<int> free;
    for (int i = 0; i < dof; i++) if (!fixed[i]) free.push_back(i);
    int nf = free.size();
    Eigen::SparseMatrix<double> Kr(nf, nf);
    std::vector<Eigen::Triplet<double>> rT;
    std::map<int,int> gToR;
    for (int i = 0; i < nf; i++) gToR[free[i]] = i;
    for (int k = 0; k < K.outerSize(); k++)
        for (Eigen::SparseMatrix<double>::InnerIterator it(K,k); it; ++it) {
            auto ri = gToR.find(it.row()), ci = gToR.find(it.col());
            if (ri != gToR.end() && ci != gToR.end())
                rT.emplace_back(ri->second, ci->second, it.value());
        }
    Kr.setFromTriplets(rT.begin(), rT.end());
    Eigen::VectorXd Fr(nf);
    for (int i = 0; i < nf; i++) Fr(i) = F(free[i]);
    Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
    solver.compute(Kr);
    Eigen::VectorXd ur = solver.solve(Fr);
    Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
    for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

    // ── M11, M22, M12 SHELL con CONVENCIÓN CORRECTA (hipótesis B) ──
    double D = E * tLosa*tLosa*tLosa / (12.0 * (1.0 - nu*nu));

    double dNdxi[4]  = {-0.25,  0.25, 0.25, -0.25};
    double dNdeta[4] = {-0.25, -0.25, 0.25,  0.25};
    double a = dx/2.0, b = dy/2.0;

    // STEP 1: calcular M en CENTROIDE de cada elemento (correcto + buggy)
    std::vector<double> M11_centroid_c(shellCount, 0);
    std::vector<double> M22_centroid_c(shellCount, 0);
    std::vector<double> M12_centroid_c(shellCount, 0);
    std::vector<double> M11_centroid_b(shellCount, 0);

    for (int e = 0; e < shellCount; e++) {
        auto &el = elements[e];
        double uL[24];
        for (int n = 0; n < 4; n++) {
            int gN = el[n];
            for (int d = 0; d < 6; d++) uL[n*6+d] = u(gN*6+d);
        }
        double kxx_c = 0, kyy_c = 0, kxy_c = 0;
        double kxx_b = 0, kyy_b = 0;
        for (int n = 0; n < 4; n++) {
            double tx = uL[n*6+3];
            double ty = uL[n*6+4];
            double dx_ = dNdxi[n] / a;
            double dy_ = dNdeta[n] / b;
            kxx_c += -dx_ * ty;
            kyy_c += +dy_ * tx;
            kxy_c += +dx_ * tx - dy_ * ty;
            kxx_b += -dx_ * tx;
            kyy_b += -dy_ * ty;
        }
        M11_centroid_c[e] = D * (kxx_c + nu*kyy_c);
        M22_centroid_c[e] = D * (nu*kxx_c + kyy_c);
        M12_centroid_c[e] = D * (1-nu)/2 * kxy_c;
        M11_centroid_b[e] = D * (kxx_b + nu*kyy_b);
    }

    // STEP 2: MAX sobre elementos en CENTROIDE
    double M11_max_centroid = 0, M22_max_centroid = 0, M12_max_centroid = 0;
    double M11_max_buggy = 0;
    for (int e = 0; e < shellCount; e++) {
        if (std::abs(M11_centroid_c[e]) > M11_max_centroid) M11_max_centroid = std::abs(M11_centroid_c[e]);
        if (std::abs(M22_centroid_c[e]) > M22_max_centroid) M22_max_centroid = std::abs(M22_centroid_c[e]);
        if (std::abs(M12_centroid_c[e]) > M12_max_centroid) M12_max_centroid = std::abs(M12_centroid_c[e]);
        if (std::abs(M11_centroid_b[e]) > M11_max_buggy)    M11_max_buggy    = std::abs(M11_centroid_b[e]);
    }

    // STEP 3: METODO NODAL (analyze.ts) — promediar centroides de elementos que tocan cada nodo
    // Para nodos de la LOSA solamente (no bases col)
    int nLosaNodes = nPerSide * nPerSide;
    std::vector<std::vector<int>> nodeElements(nLosaNodes);  // shell indices que tocan cada nodo
    for (int e = 0; e < shellCount; e++) {
        for (int k = 0; k < 4; k++) {
            int globalN = elements[e][k];
            int losaIdx = globalN - N_BASE;
            if (losaIdx >= 0 && losaIdx < nLosaNodes) {
                nodeElements[losaIdx].push_back(e);
            }
        }
    }
    double M11_max_nodal = 0, M22_max_nodal = 0, M12_max_nodal = 0;
    int M11_max_nodal_idx = -1;
    for (int nL = 0; nL < nLosaNodes; nL++) {
        auto &elems_at_node = nodeElements[nL];
        if (elems_at_node.empty()) continue;
        double m11 = 0, m22 = 0, m12 = 0;
        for (int e : elems_at_node) {
            m11 += M11_centroid_c[e];
            m22 += M22_centroid_c[e];
            m12 += M12_centroid_c[e];
        }
        m11 /= elems_at_node.size();
        m22 /= elems_at_node.size();
        m12 /= elems_at_node.size();
        if (std::abs(m11) > M11_max_nodal) { M11_max_nodal = std::abs(m11); M11_max_nodal_idx = nL; }
        if (std::abs(m22) > M22_max_nodal) M22_max_nodal = std::abs(m22);
        if (std::abs(m12) > M12_max_nodal) M12_max_nodal = std::abs(m12);
    }

    // ─── STEP 4: GAUSS-TO-NODE EXTRAPOLATION (método ETABS) ──────────────
    // Calcula M11, M22, M12 en los 4 Gauss points 2×2 de cada elemento, luego
    // extrapola a los 4 nodos del elemento usando la matriz de extrapolación
    // standard Q4 (factor 1.866 al nodo más cercano, 0.134 al opuesto).
    //
    // Después promedia valores nodales entre elementos adjacentes (smoothing).
    // Esto es lo que SAP2000/ETABS hace internamente (CSI Reference Manual §10.10).

    double sqrt3 = std::sqrt(3.0);
    double GP_E = 1.0 + sqrt3/2.0;  // factor esquina cercana ≈ 1.866
    double GP_F = -0.5;              // factor lado adjacente
    double GP_G = 1.0 - sqrt3/2.0;  // factor esquina opuesta ≈ 0.134
    // Extrapolation matrix E[node][gauss]:
    // node 0 (-1,-1) cerca de gauss 0 (-gp,-gp), opuesto gauss 2
    // node 1 (+1,-1) cerca de gauss 1 (+gp,-gp), opuesto gauss 3
    // node 2 (+1,+1) cerca de gauss 2 (+gp,+gp), opuesto gauss 0
    // node 3 (-1,+1) cerca de gauss 3 (-gp,+gp), opuesto gauss 1
    double E_ext[4][4] = {
        {GP_E, GP_F, GP_G, GP_F},
        {GP_F, GP_E, GP_F, GP_G},
        {GP_G, GP_F, GP_E, GP_F},
        {GP_F, GP_G, GP_F, GP_E},
    };
    // Gauss points 2×2:
    double GP = 1.0 / sqrt3;
    double gpts[4][2] = {{-GP,-GP}, {+GP,-GP}, {+GP,+GP}, {-GP,+GP}};

    // Per element: store M11, M22, M12 en los 4 NODOS (extrapolated from Gauss)
    std::vector<std::array<double, 4>> M11_nodes_elem(shellCount);
    std::vector<std::array<double, 4>> M22_nodes_elem(shellCount);
    std::vector<std::array<double, 4>> M12_nodes_elem(shellCount);

    for (int e = 0; e < shellCount; e++) {
        auto &el = elements[e];
        double uL[24];
        for (int n = 0; n < 4; n++) {
            int gN = el[n];
            for (int d = 0; d < 6; d++) uL[n*6+d] = u(gN*6+d);
        }

        // Calcular M en los 4 Gauss points
        double M11_gp[4], M22_gp[4], M12_gp[4];
        for (int g = 0; g < 4; g++) {
            double xi = gpts[g][0], eta = gpts[g][1];
            // Shape function derivatives at this Gauss point
            double dNdxi_g[4]  = {-0.25*(1-eta), +0.25*(1-eta), +0.25*(1+eta), -0.25*(1+eta)};
            double dNdeta_g[4] = {-0.25*(1-xi),  -0.25*(1+xi),  +0.25*(1+xi),  +0.25*(1-xi)};
            // For uniform rect mesh: J = diag(a, b)
            double dNdx_g[4], dNdy_g[4];
            for (int n = 0; n < 4; n++) {
                dNdx_g[n] = dNdxi_g[n] / a;
                dNdy_g[n] = dNdeta_g[n] / b;
            }
            double kxx = 0, kyy = 0, kxy = 0;
            for (int n = 0; n < 4; n++) {
                double tx = uL[n*6+3];
                double ty = uL[n*6+4];
                kxx += -dNdx_g[n] * ty;
                kyy += +dNdy_g[n] * tx;
                kxy += +dNdx_g[n] * tx - dNdy_g[n] * ty;
            }
            M11_gp[g] = D * (kxx + nu*kyy);
            M22_gp[g] = D * (nu*kxx + kyy);
            M12_gp[g] = D * (1-nu)/2 * kxy;
        }

        // Extrapolar a los 4 nodos del elemento
        for (int i = 0; i < 4; i++) {
            double m11 = 0, m22 = 0, m12 = 0;
            for (int g = 0; g < 4; g++) {
                m11 += E_ext[i][g] * M11_gp[g];
                m22 += E_ext[i][g] * M22_gp[g];
                m12 += E_ext[i][g] * M12_gp[g];
            }
            M11_nodes_elem[e][i] = m11;
            M22_nodes_elem[e][i] = m22;
            M12_nodes_elem[e][i] = m12;
        }
    }

    // Smooth: promediar valores nodales entre elementos adjacentes
    double M11_max_gauss = 0, M22_max_gauss = 0, M12_max_gauss = 0;
    int M11_max_gauss_idx = -1;
    for (int nL = 0; nL < nLosaNodes; nL++) {
        auto &elems_at_node = nodeElements[nL];
        if (elems_at_node.empty()) continue;
        double m11 = 0, m22 = 0, m12 = 0;
        for (int e : elems_at_node) {
            // Encontrar qué posición tiene este nodo dentro del elem
            int pos = -1;
            for (int k = 0; k < 4; k++) {
                if ((int)elements[e][k] - N_BASE == nL) { pos = k; break; }
            }
            if (pos < 0) continue;
            m11 += M11_nodes_elem[e][pos];
            m22 += M22_nodes_elem[e][pos];
            m12 += M12_nodes_elem[e][pos];
        }
        m11 /= elems_at_node.size();
        m22 /= elems_at_node.size();
        m12 /= elems_at_node.size();
        if (std::abs(m11) > M11_max_gauss) { M11_max_gauss = std::abs(m11); M11_max_gauss_idx = nL; }
        if (std::abs(m22) > M22_max_gauss) M22_max_gauss = std::abs(m22);
        if (std::abs(m12) > M12_max_gauss) M12_max_gauss = std::abs(m12);
    }

    // También MAX sobre nodos SIN smooth (raw extrapolated, captura más picos)
    double M11_max_gauss_raw = 0;
    for (int e = 0; e < shellCount; e++) {
        for (int i = 0; i < 4; i++) {
            if (std::abs(M11_nodes_elem[e][i]) > M11_max_gauss_raw)
                M11_max_gauss_raw = std::abs(M11_nodes_elem[e][i]);
        }
    }

    std::cout << "================================================================\n";
    std::cout << "MESA TORSIÓN COMPLETA C++ standalone (cols + vigas + losa)\n";
    std::cout << "  4 cols C40×40, 4 vigas V30×50, losa 6×6×0.10 mesh 5×5\n";
    std::cout << "  UDCon2 = 1.2·D + 1.2·SCP + 1.6·Live, q_total = " << q_total << " kN/m²\n";
    std::cout << "================================================================\n\n";

    // w max
    double wmax = 0;
    for (int n = 0; n < nNodes; n++) {
        if (std::abs(u(n*6+2)) > std::abs(wmax)) wmax = u(n*6+2);
    }
    std::cout << "─── DEFLEXIÓN ──────────────────────────────────────────────\n";
    std::cout << "  w_max losa = " << wmax << " m\n\n";

    std::cout << "─── ESFUERZOS SHELL (UDCon2) — METODO CENTROIDE (max por elemento) ──\n";
    std::cout << "  |M11|max = " << M11_max_centroid << " kN·m/m = " << M11_max_centroid/9.80665 << " tonf·m/m  (correcto)\n";
    std::cout << "  |M22|max = " << M22_max_centroid << " kN·m/m = " << M22_max_centroid/9.80665 << " tonf·m/m\n";
    std::cout << "  |M12|max = " << M12_max_centroid << " kN·m/m = " << M12_max_centroid/9.80665 << " tonf·m/m\n\n";

    std::cout << "─── ESFUERZOS SHELL — METODO NODAL (promedio centroides ady, = analyze.ts) ──\n";
    std::cout << "  |M11|max nodal = " << M11_max_nodal << " kN·m/m = " << M11_max_nodal/9.80665 << " tonf·m/m\n";
    std::cout << "  |M22|max nodal = " << M22_max_nodal << " kN·m/m = " << M22_max_nodal/9.80665 << " tonf·m/m\n";
    std::cout << "  |M12|max nodal = " << M12_max_nodal << " kN·m/m = " << M12_max_nodal/9.80665 << " tonf·m/m\n";
    std::cout << "  Nodo del max M11: " << M11_max_nodal_idx
              << " (esquina del max ~= " << (M11_max_nodal_idx % nPerSide) << ","
              << (M11_max_nodal_idx / nPerSide) << ")\n\n";

    std::cout << "─── ESFUERZOS SHELL — convención BUGGY (analyze.ts actual) ─\n";
    std::cout << "  |M11|max centroide buggy = " << M11_max_buggy/9.80665 << " tonf·m/m\n\n";

    std::cout << "─── ESFUERZOS SHELL — METODO GAUSS-TO-NODE EXTRAPOLATION (= ETABS) ──\n";
    std::cout << "  |M11|max gauss+smooth = " << M11_max_gauss/9.80665 << " tonf·m/m  (nodo " << M11_max_gauss_idx
              << " en " << (M11_max_gauss_idx%nPerSide) << "," << (M11_max_gauss_idx/nPerSide) << ")\n";
    std::cout << "  |M22|max gauss+smooth = " << M22_max_gauss/9.80665 << " tonf·m/m\n";
    std::cout << "  |M12|max gauss+smooth = " << M12_max_gauss/9.80665 << " tonf·m/m\n";
    std::cout << "  |M11|max gauss RAW (sin smooth, captura picos) = " << M11_max_gauss_raw/9.80665 << " tonf·m/m\n\n";

    std::cout << "─── COMPARACIÓN vs ETABS UDCon2 (|M11|max = 2.970 tonf·m/m) ──\n";
    std::cout << "  C++ centroide correcto      = " << M11_max_centroid/9.80665 << "  Δ=" << (M11_max_centroid/9.80665/2.970-1)*100 << "%\n";
    std::cout << "  C++ nodal-avg correcto      = " << M11_max_nodal/9.80665    << "  Δ=" << (M11_max_nodal/9.80665/2.970-1)*100    << "%\n";
    std::cout << "  C++ Gauss-extrapol+smooth   = " << M11_max_gauss/9.80665    << "  Δ=" << (M11_max_gauss/9.80665/2.970-1)*100    << "%\n";
    std::cout << "  C++ Gauss-extrapol RAW      = " << M11_max_gauss_raw/9.80665<< "  Δ=" << (M11_max_gauss_raw/9.80665/2.970-1)*100<< "%\n";
    std::cout << "  C++ centroide buggy         = " << M11_max_buggy/9.80665    << "  Δ=" << (M11_max_buggy/9.80665/2.970-1)*100    << "%\n";
    std::cout << "================================================================\n";
    std::cout << "VEREDICTO:\n";
    std::cout << "  Si C++ correcto ≈ 2.97 → fix analyze.ts está OK, recompilar WASM\n";
    std::cout << "  Si C++ correcto ≠ 2.97 → hay otro bug, NO recompilar WASM aún\n";
    return 0;
}
