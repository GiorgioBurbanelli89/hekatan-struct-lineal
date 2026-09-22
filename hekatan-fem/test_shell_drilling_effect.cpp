// =============================================================================
// Test C++ standalone — Efecto del drilling DOF sobre la respuesta del shell
//
// Setup: losa cuadrada simplemente apoyada (SS) en los 4 bordes,
//        L×L = 6×6m, t = 0.10m, q = 10 kN/m² uniforme.
//        Mesh 5×5 (25 elementos shell-thin).
//
// Solución analítica (Timoshenko, Theory of Plates, Cap 5):
//   w_centro = α · q · L⁴ / D    con α = 0.00406 para placa cuadrada SS
//   D = E · t³ / [12 · (1 - ν²)]
//
// Compara 3 casos drillingType:
//   0 = penalty 1e-6 (legacy, drilling efectivamente nulo)
//   1 = PyNite weak (k = min(diagRot)/1000)
//   2 = Hughes-Brezzi (default actual con scale=1)
//
// Si los 3 dan el mismo w_max → HB no contamina bending (correcto).
// Si HB rigidiza el shell o genera spurious shear → bug en formulación.
//
// Compilar:
//   g++ -O2 -std=c++17 -I src/cpp/eigen -I src/cpp \
//       test_shell_drilling_effect.cpp \
//       src/cpp/utils/drillingHughesBrezzi.cpp \
//       src/cpp/utils/shellThin.cpp \
//       src/cpp/utils/feHelpers.cpp \
//       -o test_shell_drilling.exe
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

    // ── Parámetros placa ──
    double L = 6.0;            // m
    double t = 0.10;           // m
    double E = 24.85e6;        // kN/m² (concreto 4000 psi)
    double nu = 0.15;
    double q = 10.0;           // kN/m² uniforme hacia abajo
    int N = 5;                 // mesh N×N elementos
    int nPerSide = N + 1;
    int nNodes = nPerSide * nPerSide;
    int dof = 6 * nNodes;
    double dx = L / N;

    // ── Solución analítica Timoshenko ──
    double D = E * t * t * t / (12.0 * (1.0 - nu * nu));
    double alpha = 0.00406;    // tabulado SS plate uniform load
    double w_analytic = alpha * q * std::pow(L, 4) / D;

    std::cout << "===============================================================\n";
    std::cout << "Test placa SS — efecto drilling DOF sobre w_centro\n";
    std::cout << "  L=" << L << " m, t=" << t << " m, E=" << E << " kN/m², ν=" << nu << "\n";
    std::cout << "  q=" << q << " kN/m², mesh=" << N << "×" << N << " elementos\n";
    std::cout << "  D = E·t³/[12(1-ν²)] = " << D << " kN·m\n";
    std::cout << "  Analytical w_max (Timoshenko α=0.00406) = " << w_analytic << " m\n";
    std::cout << "===============================================================\n\n";

    // ── Construir nodos del grid ──
    std::vector<Node> nodes(nNodes, Node(3));
    for (int j = 0; j < nPerSide; j++) {
        for (int i = 0; i < nPerSide; i++) {
            int idx = j * nPerSide + i;
            nodes[idx][0] = i * dx;
            nodes[idx][1] = j * dx;
            nodes[idx][2] = 0.0;
        }
    }

    // ── Elementos ──
    int nElems = N * N;
    std::vector<std::array<int, 4>> elems(nElems);
    int idx = 0;
    for (int j = 0; j < N; j++) {
        for (int i = 0; i < N; i++) {
            elems[idx] = {
                j * nPerSide + i,
                j * nPerSide + i + 1,
                (j + 1) * nPerSide + i + 1,
                (j + 1) * nPerSide + i,
            };
            idx++;
        }
    }

    auto solve = [&](int drillingType, const char *label) {
        ElementInputs ei;
        for (int e = 0; e < nElems; e++) {
            ei.elasticities[e]    = E;
            ei.poissonsRatios[e]  = nu;
            ei.thicknesses[e]     = t;
            ei.drillingTypes[e]   = drillingType;
            ei.plateFormulations[e] = 1;  // Shell-Thin Kirchhoff MZC
        }

        // K global 30·30 (nNodes×6)
        Eigen::SparseMatrix<double> K(dof, dof);
        std::vector<Eigen::Triplet<double>> trips;
        trips.reserve(nElems * 24 * 24);

        for (int e = 0; e < nElems; e++) {
            std::vector<Node> elNodes(4);
            for (int k = 0; k < 4; k++) elNodes[k] = nodes[elems[e][k]];
            Eigen::MatrixXd ke = getLocalStiffnessMatrixShellThin(elNodes, ei, e);

            for (int li = 0; li < 24; li++) {
                int ni = li / 6, di = li % 6;
                int gi = elems[e][ni] * 6 + di;
                for (int lj = 0; lj < 24; lj++) {
                    int nj = lj / 6, dj = lj % 6;
                    int gj = elems[e][nj] * 6 + dj;
                    double v = ke(li, lj);
                    if (std::abs(v) > 1e-18) trips.emplace_back(gi, gj, v);
                }
            }
        }
        K.setFromTriplets(trips.begin(), trips.end());

        // ── Cargas: q distribuida tributaria por nodo (Fz) ──
        // Ftrib = q · dx · dx (interior nodes), bordes /2, esquinas /4
        Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
        for (int j = 0; j < nPerSide; j++) {
            for (int i = 0; i < nPerSide; i++) {
                int idx = j * nPerSide + i;
                bool xEdge = (i == 0 || i == N);
                bool yEdge = (j == 0 || j == N);
                double f = q * dx * dx;
                if (xEdge && yEdge) f *= 0.25;
                else if (xEdge || yEdge) f *= 0.5;
                F(idx * 6 + 2) = -f;  // Fz down
            }
        }

        // ── BCs: SS = u_z restringido en los 4 bordes, libre en u, v, θx, θy, θz ──
        // Para Kirchhoff SS basta restringir w en bordes.
        // Pero como tenemos drilling DOF y otros, restringir todos los bordes en {Uz, θ_tangencial}
        // Simpler: empotrar uz, ux, uy en 4 esquinas + uz en bordes
        std::vector<bool> fixed(dof, false);
        for (int j = 0; j < nPerSide; j++) {
            for (int i = 0; i < nPerSide; i++) {
                int idx = j * nPerSide + i;
                bool xEdge = (i == 0 || i == N);
                bool yEdge = (j == 0 || j == N);
                if (xEdge || yEdge) {
                    fixed[idx * 6 + 2] = true;  // uz = 0 en todos los bordes (SS)
                }
                // Restringir ux, uy, θz globalmente para evitar rigid body
                fixed[idx * 6 + 0] = true;
                fixed[idx * 6 + 1] = true;
                fixed[idx * 6 + 5] = true;
            }
        }

        std::vector<int> free;
        for (int i = 0; i < dof; i++) if (!fixed[i]) free.push_back(i);
        int nf = free.size();

        // Reducir K y F
        Eigen::SparseMatrix<double> Kr(nf, nf);
        std::vector<Eigen::Triplet<double>> rTrips;
        std::map<int, int> gToR;
        for (int i = 0; i < nf; i++) gToR[free[i]] = i;
        for (int k = 0; k < K.outerSize(); k++) {
            for (Eigen::SparseMatrix<double>::InnerIterator it(K, k); it; ++it) {
                auto ri = gToR.find(it.row()), ci = gToR.find(it.col());
                if (ri != gToR.end() && ci != gToR.end())
                    rTrips.emplace_back(ri->second, ci->second, it.value());
            }
        }
        Kr.setFromTriplets(rTrips.begin(), rTrips.end());
        Eigen::VectorXd Fr(nf);
        for (int i = 0; i < nf; i++) Fr(i) = F(free[i]);

        Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
        solver.compute(Kr);
        Eigen::VectorXd ur = solver.solve(Fr);
        Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
        for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

        // w_centro = nodo (N/2, N/2)
        int icenter = (N/2) * nPerSide + (N/2);
        double w_c = u(icenter * 6 + 2);

        // Max abs w en cualquier nodo
        double w_max = 0;
        for (int i = 0; i < nNodes; i++) {
            if (std::abs(u(i*6 + 2)) > std::abs(w_max)) w_max = u(i*6 + 2);
        }

        // Max abs rotación θx, θy, θz para detectar spurious modes
        double rxmax = 0, rymax = 0, rzmax = 0;
        for (int i = 0; i < nNodes; i++) {
            rxmax = std::max(rxmax, std::abs(u(i*6 + 3)));
            rymax = std::max(rymax, std::abs(u(i*6 + 4)));
            rzmax = std::max(rzmax, std::abs(u(i*6 + 5)));
        }

        std::cout << "  [" << label << " drillingType=" << drillingType << "]\n";
        std::cout << "    w_centro              = " << w_c    << " m   (vs analítico " << w_analytic << ")\n";
        std::cout << "    w_max                 = " << w_max  << " m   ratio_to_analytic = " << w_max/w_analytic << "\n";
        std::cout << "    max |θx|              = " << rxmax  << " rad\n";
        std::cout << "    max |θy|              = " << rymax  << " rad\n";
        std::cout << "    max |θz| (drilling)   = " << rzmax  << " rad\n";
        std::cout << "    K norm                = " << K.norm() << "\n";
        std::cout << "\n";
        return w_c;
    };

    double w_legacy  = solve(0, "Legacy 1e-6 ");
    double w_pynite  = solve(1, "PyNite /1000");
    double w_hb      = solve(2, "Hughes-Brezzi");

    std::cout << "===============================================================\n";
    std::cout << "COMPARATIVA w_centro (m):\n";
    std::cout << "  Legacy:    " << w_legacy << "   error vs analítico: " << ((w_legacy/w_analytic)-1)*100 << "%\n";
    std::cout << "  PyNite:    " << w_pynite << "   error vs analítico: " << ((w_pynite/w_analytic)-1)*100 << "%\n";
    std::cout << "  HB:        " << w_hb     << "   error vs analítico: " << ((w_hb/w_analytic)-1)*100 << "%\n";
    std::cout << "  Analítico: " << w_analytic << "\n";
    std::cout << "===============================================================\n";
    std::cout << "INTERPRETACION:\n";
    std::cout << "  - Si los 3 dan ~ mismo w_centro -> drilling no contamina bending (CORRECTO)\n";
    std::cout << "  - Si HB da w mucho menor -> HB esta rigidizando el shell (BUG)\n";
    std::cout << "  - Si max|θz| es enorme en HB -> drilling acumula energia espuria (BUG)\n";

    return 0;
}
