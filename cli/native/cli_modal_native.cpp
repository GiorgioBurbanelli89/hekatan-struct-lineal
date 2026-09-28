/**
 * cli_modal_native.cpp — Standalone C++ Modal Analysis (Eigen native)
 * Same code as the Hekatan FEM WASM but compiled natively with g++.
 * Example 6.3 Space Frame (Paz & Leigh) — No diagonals
 *
 * Build:
 *   g++ -O2 -std=c++17 -I hekatan-fem/src/cpp/eigen \
 *       cli_modal_native.cpp \
 *       hekatan-fem/src/cpp/utils/feHelpers.cpp \
 *       hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getLocalMassMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getGlobalStiffnessMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp \
 *       -o cli_modal_native.exe
 *
 * Run:
 *   ./cli_modal_native.exe
 */

#include "hekatan-fem/src/cpp/data-model.h"
#include <vector>
#include <map>
#include <cmath>
#include <iostream>
#include <iomanip>
#include <algorithm>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <Eigen/Eigenvalues>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

int main()
{
    // ========================================================================
    // MODEL — Example 6.3 Space Frame (Paz & Leigh) — NO diagonals
    // ========================================================================

    const double E = 29500.0;        // ksi
    const double nu = 0.3;
    const double G = E / (2*(1+nu)); // 11346.15 ksi

    const double H  = 180.0;   // in
    const double BX = 114.0;   // in
    const double BY = 240.0;   // in

    // Steel density: 490 lb/ft³ → kip·sec²/in⁴
    const double RHO = 490.0 / 1000.0 / (12.0*12.0*12.0) / 386.4;

    // W24x146 (columns) AISC
    const double COL_A = 43.0, COL_Iz = 5630.0, COL_Iy = 391.0, COL_J = 34.8;
    // W14x84 (girders) AISC
    const double GIR_A = 24.7, GIR_Iz = 928.0, GIR_Iy = 225.0, GIR_J = 5.90;

    const int NUM_MODES = 6;

    // 8 nodes
    std::vector<Node> nodes = {
        {0,   0,   0},    // 0 base
        {0,   0,   H},    // 1 top
        {0,   BY,  0},    // 2 base
        {0,   BY,  H},    // 3 top
        {BX,  0,   0},    // 4 base
        {BX,  0,   H},    // 5 top
        {BX,  BY,  0},    // 6 base
        {BX,  BY,  H},    // 7 top
    };

    // 8 elements: 4 columns + 4 top girders
    std::vector<unsigned int> element_indices = {
        0,1, 2,3, 4,5, 6,7,   // 4 columns
        1,5, 3,7, 1,3, 5,7,   // 4 top girders
    };
    std::vector<unsigned int> element_sizes = {2,2,2,2, 2,2,2,2};
    int num_elements = 8;

    // Supports: base nodes fixed
    NodeInputs nodeInputs;
    nodeInputs.supports[0] = {true,true,true,true,true,true};
    nodeInputs.supports[2] = {true,true,true,true,true,true};
    nodeInputs.supports[4] = {true,true,true,true,true,true};
    nodeInputs.supports[6] = {true,true,true,true,true,true};

    // Element properties (match the original example beams/pazEjemplo63.ts exactly)
    ElementInputs elementInputs;
    for (int i = 0; i < num_elements; ++i) {
        bool isCol = (i < 4);
        elementInputs.elasticities[i] = E;
        elementInputs.shearModuli[i]  = G;
        elementInputs.areas[i]        = isCol ? COL_A : GIR_A;
        // convencion CSI: momentsOfInertiaY = I22 (debil), momentsOfInertiaZ = I33 (fuerte)
        elementInputs.momentsOfInertiaY[i] = isCol ? COL_Iy : GIR_Iy;
        elementInputs.momentsOfInertiaZ[i] = isCol ? COL_Iz : GIR_Iz;
        elementInputs.torsionalConstants[i] = isCol ? COL_J : GIR_J;
        elementInputs.densities[i] = RHO;
    }

    // ========================================================================
    // ASSEMBLE K and M (using Hekatan's exact C++ functions)
    // ========================================================================

    int dof = nodes.size() * 6;

    Eigen::SparseMatrix<double> K_global = getGlobalStiffnessMatrix(
        nodes, element_indices, element_sizes, elementInputs, dof);

    Eigen::SparseMatrix<double> M_global = getGlobalMassMatrix(
        nodes, element_indices, element_sizes, elementInputs, dof);

    // ========================================================================
    // BOUNDARY CONDITIONS
    // ========================================================================

    std::vector<int> freeIndices = getFreeIndices(nodeInputs, dof);
    std::vector<int> zeroIndicesK = getZerosIndices(K_global);
    std::vector<int> zeroIndicesM = getZerosIndices(M_global);

    std::vector<int> allZeroIndices;
    allZeroIndices.insert(allZeroIndices.end(), zeroIndicesK.begin(), zeroIndicesK.end());
    allZeroIndices.insert(allZeroIndices.end(), zeroIndicesM.begin(), zeroIndicesM.end());
    std::sort(allZeroIndices.begin(), allZeroIndices.end());
    allZeroIndices.erase(std::unique(allZeroIndices.begin(), allZeroIndices.end()), allZeroIndices.end());

    std::vector<int> reducedIndices;
    for (int idx : freeIndices) {
        if (!std::binary_search(allZeroIndices.begin(), allZeroIndices.end(), idx))
            reducedIndices.push_back(idx);
    }

    int reducedSize = reducedIndices.size();
    if (reducedSize == 0) {
        std::cerr << "Error: no free DOFs" << std::endl;
        return 1;
    }

    Eigen::SparseMatrix<double> K_reduced = getReducedMatrix(K_global, reducedIndices);
    Eigen::SparseMatrix<double> M_reduced = getReducedMatrix(M_global, reducedIndices);

    Eigen::MatrixXd K_dense = Eigen::MatrixXd(K_reduced);
    Eigen::MatrixXd M_dense = Eigen::MatrixXd(M_reduced);

    // ========================================================================
    // SOLVE: K*phi = omega^2 * M*phi
    // ========================================================================

    Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> solver(K_dense, M_dense);

    if (solver.info() != Eigen::Success) {
        std::cerr << "Error: eigenvalue solver failed." << std::endl;
        return 1;
    }

    Eigen::VectorXd eigenvalues = solver.eigenvalues();
    Eigen::MatrixXd eigenvectors = solver.eigenvectors();

    // ========================================================================
    // EXTRACT VALID MODES
    // ========================================================================

    std::vector<double> freqVec;
    std::vector<int> validModeIndices;
    for (int i = 0; i < reducedSize && (int)freqVec.size() < NUM_MODES; ++i) {
        double omega2 = eigenvalues(i);
        if (omega2 > 1e-10) {
            freqVec.push_back(std::sqrt(omega2) / (2.0 * M_PI));
            validModeIndices.push_back(i);
        }
    }

    int numValid = freqVec.size();

    // ========================================================================
    // MASS PARTICIPATION FACTORS
    // ========================================================================

    std::vector<Eigen::VectorXd> r_reduced(6, Eigen::VectorXd::Zero(reducedSize));
    for (int k = 0; k < reducedSize; ++k) {
        int dir = reducedIndices[k] % 6;
        r_reduced[dir](k) = 1.0;
    }

    std::vector<double> M_total(6, 0.0);
    for (int j = 0; j < 6; ++j) {
        Eigen::VectorXd Mr = M_dense * r_reduced[j];
        M_total[j] = r_reduced[j].dot(Mr);
    }

    std::vector<std::vector<double>> participation(numValid, std::vector<double>(6, 0.0));
    for (int m = 0; m < numValid; ++m) {
        Eigen::VectorXd phi = eigenvectors.col(validModeIndices[m]);
        double M_gen = phi.dot(M_dense * phi);
        for (int j = 0; j < 6; ++j) {
            if (M_total[j] < 1e-30 || M_gen < 1e-30) continue;
            double Gamma = phi.dot(M_dense * r_reduced[j]);
            participation[m][j] = (Gamma * Gamma) / M_gen / M_total[j];
        }
    }

    // ========================================================================
    // OUTPUT
    // ========================================================================

    std::cout << std::string(72, '=') << std::endl;
    std::cout << "  NATIVE C++ (Eigen) Modal Analysis — cli_modal_native" << std::endl;
    std::cout << "  Example 6.3 Space Frame (Paz & Leigh) — No diagonals" << std::endl;
    std::cout << std::string(72, '=') << std::endl;
    std::cout << std::fixed << std::setprecision(2);
    std::cout << "  E=" << E << " ksi, G=" << G << " ksi, rho="
              << std::scientific << std::setprecision(4) << RHO << std::endl;
    std::cout << std::fixed << std::setprecision(1);
    std::cout << "  Cols: W24x146 (A=" << COL_A << ", Iz=" << COL_Iz
              << ", Iy=" << COL_Iy << ", J=" << COL_J << ")" << std::endl;
    std::cout << "  Girs: W14x84  (A=" << GIR_A << ", Iz=" << GIR_Iz
              << ", Iy=" << GIR_Iy << ", J=" << GIR_J << ")" << std::endl;
    std::cout << "  Reduced DOFs: " << reducedSize << " (from " << dof << " total)" << std::endl;
    std::cout << std::string(72, '-') << std::endl;

    std::cout << std::endl;
    std::cout << "  " << std::setw(4) << "Mode"
              << "  " << std::setw(12) << "Freq (Hz)"
              << "  " << std::setw(12) << "Period (s)"
              << "  " << std::setw(14) << "omega (rad/s)" << std::endl;
    std::cout << "  " << std::string(46, '-') << std::endl;

    std::cout << std::fixed << std::setprecision(4);
    for (int i = 0; i < numValid; ++i) {
        double f = freqVec[i];
        double omega = f * 2 * M_PI;
        double T = f > 0 ? 1.0/f : 0;
        std::cout << "  " << std::setw(4) << (i+1)
                  << "  " << std::setw(12) << f
                  << "  " << std::setw(12) << T
                  << "  " << std::setw(14) << omega << std::endl;
    }

    // Mass participation
    const char* dirs[] = {"Ux","Uy","Uz","Rx","Ry","Rz"};
    std::cout << std::endl << "  Mass Participation Factors:" << std::endl;
    std::cout << "  " << std::setw(4) << "Mode";
    for (int d = 0; d < 6; ++d) std::cout << "  " << std::setw(8) << dirs[d];
    std::cout << std::endl << "  " << std::string(56, '-') << std::endl;

    std::cout << std::fixed << std::setprecision(1);
    for (int i = 0; i < numValid; ++i) {
        std::cout << "  " << std::setw(4) << (i+1);
        for (int d = 0; d < 6; ++d) {
            std::cout << "  " << std::setw(7) << (participation[i][d]*100) << "%";
        }
        std::cout << std::endl;
    }

    // Output for comparison
    std::cout << std::endl << std::string(72, '-') << std::endl;
    std::cout << "  For comparison:" << std::endl;
    std::cout << "  python test_modal_comparison.py --awatif";
    std::cout << std::fixed << std::setprecision(4);
    for (int i = 0; i < numValid; ++i)
        std::cout << " " << freqVec[i];
    std::cout << std::endl;

    return 0;
}
