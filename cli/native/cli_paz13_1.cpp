/**
 * cli_paz13_1.cpp — Mario Paz, Structural Dynamics 6th Ed, Example 13.1
 * Space Frame: 5 nodes, 4 elements, 6 free DOFs (node 1 only)
 *
 * TWO implementations side by side:
 *   (A) Exact Paz MATLAB translation (with I0, reference point)
 *   (B) Hekatan FEM functions (with Ip = Iy+Iz, automatic orientation)
 *
 * Build:
 *   g++ -O2 -std=c++17 -static-libgcc -static-libstdc++ \
 *       -I hekatan-fem/src/cpp/eigen \
 *       cli_paz13_1.cpp \
 *       hekatan-fem/src/cpp/utils/feHelpers.cpp \
 *       hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getLocalMassMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getLocalMassMatrixPaz.cpp \
 *       hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getGlobalStiffnessMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp \
 *       hekatan-fem/src/cpp/utils/getGlobalMassMatrixPaz.cpp \
 *       -o cli_paz13_1.exe
 *
 * Run:
 *   ./cli_paz13_1.exe
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

// ============================================================================
// (A) EXACT PAZ MATLAB IMPLEMENTATION
// ============================================================================

// SpaceFrameElement — exact translation of Paz's MATLAB function
// coord: 3 rows (node_i, node_j, ref_point), 3 cols (x,y,z)
Eigen::MatrixXd PazSpaceFrameElement(
    double E, double G, double Iz, double Iy, double J, double A,
    const Eigen::Matrix3d& coord)
{
    Eigen::Vector3d n1 = coord.row(0);  // node i
    Eigen::Vector3d n2 = coord.row(1);  // node j
    Eigen::Vector3d n3 = coord.row(2);  // reference point

    double L = (n2 - n1).norm();

    double EIz = E * Iz, EIy = E * Iy, GJ = G * J, EA = E * A;

    // Local axes via cross products (Paz method)
    Eigen::Vector3d ex = (n2 - n1) / L;
    Eigen::Vector3d eyy = (n3 - n1).cross(n2 - n1);  // Paz: cross(n3-n1, n2-n1)
    Eigen::Vector3d ey = eyy / eyy.norm();
    Eigen::Vector3d ez = ex.cross(ey);

    Eigen::Matrix3d H;
    H.row(0) = ex;
    H.row(1) = ey;
    H.row(2) = ez;

    // 12x12 transformation
    Eigen::MatrixXd T = Eigen::MatrixXd::Zero(12, 12);
    T.block<3,3>(0,0) = H;
    T.block<3,3>(3,3) = H;
    T.block<3,3>(6,6) = H;
    T.block<3,3>(9,9) = H;

    // Local stiffness matrix (Paz Eq 13.1)
    double L2 = L * L, L3 = L * L * L;
    Eigen::MatrixXd ke = Eigen::MatrixXd::Zero(12, 12);

    ke(0,0) = EA/L;   ke(0,6) = -EA/L;
    ke(1,1) = 12*EIz/L3;  ke(1,5) = 6*EIz/L2;  ke(1,7) = -12*EIz/L3;  ke(1,11) = 6*EIz/L2;
    ke(2,2) = 12*EIy/L3;  ke(2,4) = -6*EIy/L2;  ke(2,8) = -12*EIy/L3;  ke(2,10) = -6*EIy/L2;
    ke(3,3) = GJ/L;   ke(3,9) = -GJ/L;
    ke(4,2) = -6*EIy/L2;  ke(4,4) = 4*EIy/L;  ke(4,8) = 6*EIy/L2;  ke(4,10) = 2*EIy/L;
    ke(5,1) = 6*EIz/L2;   ke(5,5) = 4*EIz/L;  ke(5,7) = -6*EIz/L2;  ke(5,11) = 2*EIz/L;
    ke(6,0) = -EA/L;  ke(6,6) = EA/L;
    ke(7,1) = -12*EIz/L3; ke(7,5) = -6*EIz/L2; ke(7,7) = 12*EIz/L3; ke(7,11) = -6*EIz/L2;
    ke(8,2) = -12*EIy/L3; ke(8,4) = 6*EIy/L2;  ke(8,8) = 12*EIy/L3; ke(8,10) = 6*EIy/L2;
    ke(9,3) = -GJ/L;  ke(9,9) = GJ/L;
    ke(10,2) = -6*EIy/L2; ke(10,4) = 2*EIy/L;  ke(10,8) = 6*EIy/L2; ke(10,10) = 4*EIy/L;
    ke(11,1) = 6*EIz/L2;  ke(11,5) = 2*EIz/L;  ke(11,7) = -6*EIz/L2; ke(11,11) = 4*EIz/L;

    // Transform to global: T^T * ke * T
    return T.transpose() * ke * T;
}

// SpaceFrameConsMass — exact translation of Paz's MATLAB function
Eigen::MatrixXd PazSpaceConsMass(
    double m_bar, double I0, double A,
    const Eigen::Matrix3d& coord)
{
    Eigen::Vector3d n1 = coord.row(0);
    Eigen::Vector3d n2 = coord.row(1);
    Eigen::Vector3d n3 = coord.row(2);

    double L = (n2 - n1).norm();
    double L2 = L * L;
    double rI0_A = I0 / A;

    Eigen::Vector3d ex = (n2 - n1) / L;
    Eigen::Vector3d eyy = (n3 - n1).cross(n2 - n1);
    Eigen::Vector3d ey = eyy / eyy.norm();
    Eigen::Vector3d ez = ex.cross(ey);

    Eigen::Matrix3d H;
    H.row(0) = ex;
    H.row(1) = ey;
    H.row(2) = ez;

    Eigen::MatrixXd T = Eigen::MatrixXd::Zero(12, 12);
    T.block<3,3>(0,0) = H;
    T.block<3,3>(3,3) = H;
    T.block<3,3>(6,6) = H;
    T.block<3,3>(9,9) = H;

    // Consistent mass matrix (Paz Eq 13.4)
    double factor = m_bar * L / 420.0;

    Eigen::MatrixXd me = Eigen::MatrixXd::Zero(12, 12);
    me(0,0) = 140;         me(0,6) = 70;
    me(1,1) = 156;         me(1,5) = 22*L;    me(1,7) = 54;      me(1,11) = -13*L;
    me(2,2) = 156;         me(2,4) = 22*L;    me(2,8) = 54;      me(2,10) = -13*L;
    me(3,3) = 140*rI0_A;   me(3,9) = 70*rI0_A;
    me(4,2) = 22*L;        me(4,4) = 4*L2;    me(4,8) = 13*L;    me(4,10) = -3*L2;
    me(5,1) = 22*L;        me(5,5) = 4*L2;    me(5,7) = 13*L;    me(5,11) = -3*L2;
    me(6,0) = 70;           me(6,6) = 140;
    me(7,1) = 54;           me(7,5) = 13*L;    me(7,7) = 156;     me(7,11) = -22*L;
    me(8,2) = 54;           me(8,4) = 13*L;    me(8,8) = 156;     me(8,10) = -22*L;
    me(9,3) = 70*rI0_A;    me(9,9) = 140*rI0_A;
    me(10,2) = -13*L;      me(10,4) = -3*L2;  me(10,8) = -22*L;  me(10,10) = 4*L2;
    me(11,1) = -13*L;      me(11,5) = -3*L2;  me(11,7) = -22*L;  me(11,11) = 4*L2;

    me *= factor;

    // Transform to global: T^T * me * T
    return T.transpose() * me * T;
}

// System — extract free DOFs (remove constrained DOFs)
void PazSystem(const Eigen::MatrixXd& K, const Eigen::MatrixXd& M,
               const Eigen::VectorXd& F,
               const std::vector<int>& constrainedDofs,
               Eigen::MatrixXd& Kf, Eigen::MatrixXd& Mf, Eigen::VectorXd& Rf)
{
    int n = K.rows();
    std::vector<bool> isConstrained(n, false);
    for (int d : constrainedDofs) isConstrained[d] = true;

    std::vector<int> freeDofs;
    for (int i = 0; i < n; ++i)
        if (!isConstrained[i]) freeDofs.push_back(i);

    int nf = freeDofs.size();
    Kf.resize(nf, nf);
    Mf.resize(nf, nf);
    Rf.resize(nf);

    for (int i = 0; i < nf; ++i) {
        Rf(i) = F(freeDofs[i]);
        for (int j = 0; j < nf; ++j) {
            Kf(i, j) = K(freeDofs[i], freeDofs[j]);
            Mf(i, j) = M(freeDofs[i], freeDofs[j]);
        }
    }
}

void printMatrix(const std::string& name, const Eigen::MatrixXd& M, int precision = 4)
{
    std::cout << "\n  " << name << " (" << M.rows() << "x" << M.cols() << "):" << std::endl;
    std::cout << std::scientific << std::setprecision(precision);
    for (int i = 0; i < M.rows(); ++i) {
        std::cout << "    ";
        for (int j = 0; j < M.cols(); ++j)
            std::cout << std::setw(precision + 8) << M(i, j);
        std::cout << std::endl;
    }
}

int main()
{
    // ========================================================================
    // INPUT DATA — Mario Paz, Example 13.1
    // ========================================================================

    const double E = 30e6;       // psi
    const double G = 12e6;       // psi

    // Members 1 & 3
    const double A1 = 50.0, Iz1 = 200.0, Iy1 = 200.0, J1 = 40.0;
    const double m_bar1 = 0.2;   // lb·sec²/in²  (distributed mass)
    const double I0_1 = 205.0;   // polar moment of inertia (in⁴)

    // Members 2 & 4
    const double A2 = 28.0, Iz2 = 64.0, Iy2 = 64.0, J2 = 12.8;
    const double m_bar2 = 0.1;
    const double I0_2 = 68.0;

    // Nodes (0-based, Paz uses 1-based)
    // Paz: nodes = [0,0,0; 0,0,-200; 0,200,0; -200,0,0; 0,-200,0]
    Eigen::MatrixXd nodes(5, 3);
    nodes << 0,    0,    0,      // node 0 (Paz: 1) — FREE
             0,    0, -200,      // node 1 (Paz: 2) — fixed
             0,  200,    0,      // node 2 (Paz: 3) — fixed
            -200,  0,    0,      // node 3 (Paz: 4) — fixed
             0, -200,    0;      // node 4 (Paz: 5) — fixed

    // Connectivity: [node_i, node_j, ref_point] (0-based)
    // Paz: conn=[1,2,3; 1,3,2; 1,4,2; 1,5,2]
    int conn[4][3] = {{0,1,2}, {0,2,1}, {0,3,1}, {0,4,1}};

    // DOF mapping (0-based): element → global DOF indices
    // Paz: lmm=[1:12; [1:6 13:18]; [1:6 19:24]; [1:6 25:30]]
    // 0-based: elem0→[0..11], elem1→[0..5,12..17], elem2→[0..5,18..23], elem3→[0..5,24..29]
    int lmm[4][12] = {
        { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11},
        { 0, 1, 2, 3, 4, 5,12,13,14,15,16,17},
        { 0, 1, 2, 3, 4, 5,18,19,20,21,22,23},
        { 0, 1, 2, 3, 4, 5,24,25,26,27,28,29}
    };

    int dof = 5 * 6;  // 30 total DOFs

    // Constrained DOFs: 6..29 (nodes 1,2,3,4 all fixed)
    std::vector<int> constrainedDofs;
    for (int i = 6; i < 30; ++i) constrainedDofs.push_back(i);

    // ========================================================================
    // (A) PAZ EXACT — Assemble K and M
    // ========================================================================

    Eigen::MatrixXd K_paz = Eigen::MatrixXd::Zero(dof, dof);
    Eigen::MatrixXd M_paz = Eigen::MatrixXd::Zero(dof, dof);

    for (int el = 0; el < 4; ++el) {
        // Build coord matrix for this element
        Eigen::Matrix3d coord;
        coord.row(0) = nodes.row(conn[el][0]);
        coord.row(1) = nodes.row(conn[el][1]);
        coord.row(2) = nodes.row(conn[el][2]);

        // Select properties
        bool type13 = (el == 0 || el == 2);  // members 1,3
        double A  = type13 ? A1  : A2;
        double Iz = type13 ? Iz1 : Iz2;
        double Iy = type13 ? Iy1 : Iy2;
        double J  = type13 ? J1  : J2;
        double mb = type13 ? m_bar1 : m_bar2;
        double I0 = type13 ? I0_1   : I0_2;

        Eigen::MatrixXd ke = PazSpaceFrameElement(E, G, Iz, Iy, J, A, coord);
        Eigen::MatrixXd me = PazSpaceConsMass(mb, I0, A, coord);

        // Assemble
        for (int i = 0; i < 12; ++i)
            for (int j = 0; j < 12; ++j) {
                K_paz(lmm[el][i], lmm[el][j]) += ke(i, j);
                M_paz(lmm[el][i], lmm[el][j]) += me(i, j);
            }
    }

    // Extract free DOFs (system reduction)
    Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
    F(2) = 5000.0;  // Paz: F(3) = 5000 (1-based) → F(2) in 0-based → node 0, z-direction

    Eigen::MatrixXd Kf_paz, Mf_paz;
    Eigen::VectorXd Rf_paz;
    PazSystem(K_paz, M_paz, F, constrainedDofs, Kf_paz, Mf_paz, Rf_paz);

    // Solve eigenvalue problem: K*phi = omega^2 * M*phi
    Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> solver_paz(Kf_paz, Mf_paz);
    Eigen::VectorXd eigenvalues_paz = solver_paz.eigenvalues();
    Eigen::MatrixXd eigenvectors_paz = solver_paz.eigenvectors();

    // ========================================================================
    // (B) HEKATAN — Assemble K and M using Hekatan functions
    // ========================================================================

    // Convert to Hekatan data structures
    std::vector<Node> awNodes = {
        {0, 0, 0}, {0, 0, -200}, {0, 200, 0}, {-200, 0, 0}, {0, -200, 0}
    };

    std::vector<unsigned int> element_indices = {
        0,1, 0,2, 0,3, 0,4   // 4 elements (2-node each)
    };
    std::vector<unsigned int> element_sizes = {2, 2, 2, 2};

    NodeInputs nodeInputs;
    nodeInputs.supports[1] = {true,true,true,true,true,true};
    nodeInputs.supports[2] = {true,true,true,true,true,true};
    nodeInputs.supports[3] = {true,true,true,true,true,true};
    nodeInputs.supports[4] = {true,true,true,true,true,true};

    ElementInputs elementInputs;
    for (int i = 0; i < 4; ++i) {
        bool type13 = (i == 0 || i == 2);
        elementInputs.elasticities[i] = E;
        elementInputs.shearModuli[i]  = G;
        elementInputs.areas[i]        = type13 ? A1 : A2;
        // Hekatan convention: momentsOfInertiaZ/Y
        // Since Iy=Iz for all elements, orientation doesn't matter
        elementInputs.momentsOfInertiaY[i] = type13 ? Iz1 : Iz2;
        elementInputs.momentsOfInertiaZ[i] = type13 ? Iy1 : Iy2;
        elementInputs.torsionalConstants[i] = type13 ? J1 : J2;
        // density = m_bar / A
        elementInputs.densities[i] = type13 ? (m_bar1 / A1) : (m_bar2 / A2);
    }

    int awDof = awNodes.size() * 6;  // 30

    Eigen::SparseMatrix<double> K_aw = getGlobalStiffnessMatrix(
        awNodes, element_indices, element_sizes, elementInputs, awDof);
    Eigen::SparseMatrix<double> M_aw = getGlobalMassMatrix(
        awNodes, element_indices, element_sizes, elementInputs, awDof);

    // Apply BCs same way
    std::vector<int> freeIndices = getFreeIndices(nodeInputs, awDof);
    std::vector<int> zeroK = getZerosIndices(K_aw);
    std::vector<int> zeroM = getZerosIndices(M_aw);
    std::vector<int> allZero;
    allZero.insert(allZero.end(), zeroK.begin(), zeroK.end());
    allZero.insert(allZero.end(), zeroM.begin(), zeroM.end());
    std::sort(allZero.begin(), allZero.end());
    allZero.erase(std::unique(allZero.begin(), allZero.end()), allZero.end());

    std::vector<int> reducedIndices;
    for (int idx : freeIndices) {
        if (!std::binary_search(allZero.begin(), allZero.end(), idx))
            reducedIndices.push_back(idx);
    }

    Eigen::SparseMatrix<double> K_red = getReducedMatrix(K_aw, reducedIndices);
    Eigen::SparseMatrix<double> M_red = getReducedMatrix(M_aw, reducedIndices);

    Eigen::MatrixXd Kf_aw = Eigen::MatrixXd(K_red);
    Eigen::MatrixXd Mf_aw = Eigen::MatrixXd(M_red);

    Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> solver_aw(Kf_aw, Mf_aw);
    Eigen::VectorXd eigenvalues_aw = solver_aw.eigenvalues();
    Eigen::MatrixXd eigenvectors_aw = solver_aw.eigenvectors();

    // ========================================================================
    // OUTPUT
    // ========================================================================

    std::cout << std::string(78, '=') << std::endl;
    std::cout << "  Mario Paz — Structural Dynamics 6th Ed — Example 13.1" << std::endl;
    std::cout << "  Space Frame: 5 nodes, 4 elements, 6 free DOFs" << std::endl;
    std::cout << std::string(78, '=') << std::endl;

    std::cout << "\n  Nodes:" << std::endl;
    for (int i = 0; i < 5; ++i) {
        std::cout << "    " << i << ": (" << nodes(i,0) << ", " << nodes(i,1) << ", " << nodes(i,2) << ")";
        std::cout << (i == 0 ? " [FREE]" : " [FIXED]") << std::endl;
    }

    std::cout << "\n  Elements:" << std::endl;
    const char* memType[] = {"1,3","2,4","1,3","2,4"};
    for (int i = 0; i < 4; ++i) {
        std::cout << "    " << i << ": " << conn[i][0] << " -> " << conn[i][1]
                  << " (ref=" << conn[i][2] << ", type=" << memType[i] << ")" << std::endl;
    }

    std::cout << "\n  Properties:" << std::endl;
    std::cout << "    Members 1,3: E=30e6, G=12e6, A=50, Iy=200, Iz=200, J=40, m=0.2, I0=205" << std::endl;
    std::cout << "    Members 2,4: E=30e6, G=12e6, A=28, Iy=64, Iz=64, J=12.8, m=0.1, I0=68" << std::endl;

    // Print system matrices
    printMatrix("Kf (Paz)", Kf_paz, 4);
    printMatrix("Mf (Paz)", Mf_paz, 4);

    std::cout << "\n  Rf (Paz): [";
    for (int i = 0; i < Rf_paz.size(); ++i)
        std::cout << (i > 0 ? ", " : "") << Rf_paz(i);
    std::cout << "]" << std::endl;

    // --- (A) Paz frequencies ---
    std::cout << "\n" << std::string(78, '=') << std::endl;
    std::cout << "  (A) PAZ EXACT (I0 for torsional mass)" << std::endl;
    std::cout << std::string(78, '-') << std::endl;
    std::cout << std::endl;
    std::cout << "  " << std::setw(4) << "Mode"
              << "  " << std::setw(14) << "omega^2"
              << "  " << std::setw(14) << "omega (rad/s)"
              << "  " << std::setw(14) << "Freq (Hz)"
              << "  " << std::setw(14) << "Period (s)" << std::endl;
    std::cout << "  " << std::string(64, '-') << std::endl;

    for (int i = 0; i < 6; ++i) {
        double w2 = eigenvalues_paz(i);
        double w = std::sqrt(std::max(0.0, w2));
        double f = w / (2.0 * M_PI);
        double T = f > 0 ? 1.0 / f : 0;
        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(4) << (i+1);
        std::cout << std::scientific << std::setprecision(6);
        std::cout << "  " << std::setw(14) << w2;
        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(14) << w;
        std::cout << "  " << std::setw(14) << f;
        std::cout << "  " << std::setw(14) << T << std::endl;
    }

    // Mode shapes
    std::cout << std::endl << "  Mode Shapes (Paz):" << std::endl;
    std::cout << "  " << std::setw(4) << "DOF";
    for (int m = 0; m < 6; ++m)
        std::cout << std::setw(12) << ("Mode " + std::to_string(m+1));
    std::cout << std::endl << "  " << std::string(76, '-') << std::endl;
    const char* dofLabels[] = {"Ux","Uy","Uz","Rx","Ry","Rz"};
    for (int d = 0; d < 6; ++d) {
        std::cout << "  " << std::setw(4) << dofLabels[d];
        for (int m = 0; m < 6; ++m)
            std::cout << std::fixed << std::setprecision(6) << std::setw(12) << eigenvectors_paz(d, m);
        std::cout << std::endl;
    }

    // --- (B) Hekatan frequencies ---
    std::cout << "\n" << std::string(78, '=') << std::endl;
    std::cout << "  (B) HEKATAN (Ip=Iy+Iz for torsional mass)" << std::endl;
    std::cout << "  Ip/A vs I0/A: Mem 1,3 → " << (Iy1+Iz1)/A1 << " vs " << I0_1/A1
              << "  |  Mem 2,4 → " << (Iy2+Iz2)/A2 << " vs " << I0_2/A2 << std::endl;
    std::cout << std::string(78, '-') << std::endl;

    // Print Hekatan system matrices for comparison
    printMatrix("Kf (Hekatan)", Kf_aw, 4);
    printMatrix("Mf (Hekatan)", Mf_aw, 4);

    std::cout << std::endl;
    std::cout << "  " << std::setw(4) << "Mode"
              << "  " << std::setw(14) << "omega^2"
              << "  " << std::setw(14) << "omega (rad/s)"
              << "  " << std::setw(14) << "Freq (Hz)"
              << "  " << std::setw(14) << "Period (s)" << std::endl;
    std::cout << "  " << std::string(64, '-') << std::endl;

    int numAw = reducedIndices.size();
    for (int i = 0; i < numAw; ++i) {
        double w2 = eigenvalues_aw(i);
        if (w2 < 1e-10) continue;
        double w = std::sqrt(w2);
        double f = w / (2.0 * M_PI);
        double T = f > 0 ? 1.0 / f : 0;
        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(4) << (i+1);
        std::cout << std::scientific << std::setprecision(6);
        std::cout << "  " << std::setw(14) << w2;
        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(14) << w;
        std::cout << "  " << std::setw(14) << f;
        std::cout << "  " << std::setw(14) << T << std::endl;
    }

    // Hekatan mode shapes
    std::cout << std::endl << "  Mode Shapes (Hekatan):" << std::endl;
    std::cout << "  " << std::setw(4) << "DOF";
    for (int m = 0; m < numAw; ++m)
        std::cout << std::setw(12) << ("Mode " + std::to_string(m+1));
    std::cout << std::endl << "  " << std::string(76, '-') << std::endl;
    for (int d = 0; d < numAw; ++d) {
        std::cout << "  " << std::setw(4) << (d < 6 ? std::string(dofLabels[d]) : std::to_string(reducedIndices[d]));
        for (int m = 0; m < numAw; ++m)
            std::cout << std::fixed << std::setprecision(6) << std::setw(12) << eigenvectors_aw(d, m);
        std::cout << std::endl;
    }

    // --- Comparison ---
    std::cout << "\n" << std::string(78, '=') << std::endl;
    std::cout << "  COMPARISON" << std::endl;
    std::cout << std::string(78, '-') << std::endl;
    std::cout << std::endl;
    std::cout << "  " << std::setw(4) << "Mode"
              << "  " << std::setw(14) << "Paz (Hz)"
              << "  " << std::setw(14) << "Hekatan (Hz)"
              << "  " << std::setw(14) << "Diff (%)" << std::endl;
    std::cout << "  " << std::string(50, '-') << std::endl;

    int modeAw = 0;
    for (int i = 0; i < 6; ++i) {
        double w2_paz = eigenvalues_paz(i);
        double f_paz = std::sqrt(std::max(0.0, w2_paz)) / (2.0 * M_PI);

        // Find corresponding Hekatan mode
        while (modeAw < numAw && eigenvalues_aw(modeAw) < 1e-10) modeAw++;
        double f_aw = 0;
        if (modeAw < numAw) {
            f_aw = std::sqrt(eigenvalues_aw(modeAw)) / (2.0 * M_PI);
            modeAw++;
        }

        double diff = f_paz > 0 ? 100.0 * (f_aw - f_paz) / f_paz : 0;
        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(4) << (i+1)
                  << "  " << std::setw(14) << f_paz
                  << "  " << std::setw(14) << f_aw
                  << "  " << std::setw(13) << std::setprecision(2) << diff << "%" << std::endl;
    }

    // K matrix difference (norm)
    double Kdiff = (Kf_paz - Kf_aw).norm() / Kf_paz.norm() * 100.0;
    double Mdiff = (Mf_paz - Mf_aw).norm() / Mf_paz.norm() * 100.0;
    std::cout << std::endl;
    std::cout << std::fixed << std::setprecision(4);
    std::cout << "  ||Kf_paz - Kf_aw|| / ||Kf_paz|| = " << Kdiff << "%" << std::endl;
    std::cout << "  ||Mf_paz - Mf_aw|| / ||Mf_paz|| = " << Mdiff << "%" << std::endl;

    // ========================================================================
    // (C) HEKATAN + PAZ MASS (I0 explicit via polarMomentsOfInertia)
    // ========================================================================

    // Add I0 to elementInputs
    for (int i = 0; i < 4; ++i) {
        bool type13 = (i == 0 || i == 2);
        elementInputs.polarMomentsOfInertia[i] = type13 ? I0_1 : I0_2;
    }

    Eigen::SparseMatrix<double> M_awpaz = getGlobalMassMatrixPaz(
        awNodes, element_indices, element_sizes, elementInputs, awDof);

    // Reuse same BCs
    Eigen::SparseMatrix<double> M_red_paz = getReducedMatrix(M_awpaz, reducedIndices);
    Eigen::MatrixXd Mf_awpaz = Eigen::MatrixXd(M_red_paz);

    Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> solver_awpaz(Kf_aw, Mf_awpaz);
    Eigen::VectorXd eigenvalues_awpaz = solver_awpaz.eigenvalues();

    std::cout << "\n" << std::string(78, '=') << std::endl;
    std::cout << "  (C) HEKATAN + PAZ MASS (polarMomentsOfInertia = I0)" << std::endl;
    std::cout << std::string(78, '-') << std::endl;

    std::cout << std::endl;
    std::cout << "  " << std::setw(4) << "Mode"
              << "  " << std::setw(14) << "Freq (Hz)"
              << "  " << std::setw(14) << "vs Paz (%)"
              << "  " << std::setw(14) << "vs Hekatan (%)" << std::endl;
    std::cout << "  " << std::string(50, '-') << std::endl;

    int mc = 0;
    for (int i = 0; i < numAw; ++i) {
        double w2 = eigenvalues_awpaz(i);
        if (w2 < 1e-10) continue;
        double f = std::sqrt(w2) / (2.0 * M_PI);

        double f_paz = std::sqrt(std::max(0.0, eigenvalues_paz(mc))) / (2.0 * M_PI);

        // Find corresponding Hekatan default mode
        double f_aw = 0;
        if (mc < 6) {
            int maw = 0;
            for (int k = 0; k < numAw && maw <= mc; ++k) {
                if (eigenvalues_aw(k) > 1e-10) {
                    if (maw == mc) { f_aw = std::sqrt(eigenvalues_aw(k)) / (2.0 * M_PI); break; }
                    maw++;
                }
            }
        }

        double diff_paz = f_paz > 0 ? 100.0 * (f - f_paz) / f_paz : 0;
        double diff_aw = f_aw > 0 ? 100.0 * (f - f_aw) / f_aw : 0;

        std::cout << std::fixed << std::setprecision(4);
        std::cout << "  " << std::setw(4) << (mc+1)
                  << "  " << std::setw(14) << f
                  << "  " << std::setw(13) << std::setprecision(4) << diff_paz << "%"
                  << "  " << std::setw(13) << diff_aw << "%" << std::endl;
        mc++;
        if (mc >= 6) break;
    }

    double Mdiff_paz_awpaz = (Mf_paz - Mf_awpaz).norm() / Mf_paz.norm() * 100.0;
    std::cout << std::endl;
    std::cout << std::fixed << std::setprecision(4);
    std::cout << "  ||Mf_paz - Mf_awpaz|| / ||Mf_paz|| = " << Mdiff_paz_awpaz << "%" << std::endl;

    // Book expected response
    std::cout << "\n" << std::string(78, '=') << std::endl;
    std::cout << "  BOOK EXPECTED RESPONSE (Paz p.346):" << std::endl;
    std::cout << "    u1max = 8.814e-5 in" << std::endl;
    std::cout << "    u2max = 2.6552e-7 in" << std::endl;
    std::cout << "    u3max = 0.9827 radian" << std::endl;
    std::cout << std::string(78, '=') << std::endl;

    return 0;
}
