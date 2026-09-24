// =============================================================================
// Test end-to-end C++ standalone — Shell-Thin Q4 + Frame Beam
//
// MWE para verificar si el drilling Hughes-Brezzi afecta la respuesta global
// shell+frame. Compara los 3 modos (0=legacy, 1=PyNite, 2=HB):
//
//   Geometría:
//     - 4 nodos del shell en (0,0,0),(1,0,0),(1,1,0),(0,1,0) — losa horizontal
//     - 1 nodo extra en (2,0.5,0) — extremo de viga horizontal
//     - Shell Q4 conecta nodos [0,1,2,3]
//     - Frame conecta nodos [1, 4] (viga horizontal sobre el borde derecho del shell)
//
//   BCs:
//     - Nodos 0, 2, 3 del shell: empotrados (los lados que NO tocan la viga)
//     - Nodo 4 (extremo viga): libre
//
//   Carga:
//     - Momento Mz = 1.0 aplicado en nodo 4 (gira en torno al eje Z global)
//       Para una viga horizontal en X, ese Mz = momento Mz local viga = M3 viga (bending in-plane)
//       Acopla con drilling del shell Rz en el nodo 1.
//
//   Esperamos:
//     - Drilling type=0 (penalty 1e-6): nodo 4 rota MUCHO bajo el momento (shell no constrain)
//     - Drilling type=2 (Hughes-Brezzi): nodo 4 rota MENOS (shell constrain via drilling real)
//     - Si Rz(node4) cambia → el HB sí está acoplando
//
// Compilar:
//   g++ -O2 -std=c++17 -I src/cpp/eigen -I src/cpp \
//       test_shell_frame_drilling.cpp \
//       src/cpp/utils/drillingHughesBrezzi.cpp \
//       src/cpp/utils/shellThin.cpp \
//       src/cpp/utils/feHelpers.cpp \
//       -o test_shell_frame_drilling.exe
// =============================================================================

#include <iostream>
#include <iomanip>
#include <vector>
#include <map>
#include <Eigen/Dense>
#include <Eigen/Sparse>

#include "src/cpp/data-model.h"

// Forward decls
Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);

// Mini frame K local 12×12 — Euler-Bernoulli 3D beam con A, Iy, Iz, J
// (suficiente para el test, no Timoshenko)
static Eigen::MatrixXd getFrameK(double L, double E, double G, double A,
                                  double Iy, double Iz, double J) {
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);
    // Axial
    double k_a = E*A/L;
    K(0,0) = k_a;  K(0,6) = -k_a; K(6,0) = -k_a; K(6,6) = k_a;
    // Torsion
    double k_t = G*J/L;
    K(3,3) = k_t;  K(3,9) = -k_t; K(9,3) = -k_t; K(9,9) = k_t;
    // Bending in y (curvature about z)
    double L2=L*L, L3=L*L*L;
    K(1,1) = 12*E*Iz/L3;  K(1,5) = 6*E*Iz/L2;  K(1,7) = -12*E*Iz/L3;  K(1,11) = 6*E*Iz/L2;
    K(5,1) = K(1,5);      K(5,5) = 4*E*Iz/L;   K(5,7) = -6*E*Iz/L2;   K(5,11) = 2*E*Iz/L;
    K(7,1) = K(1,7);      K(7,5) = K(5,7);     K(7,7) = 12*E*Iz/L3;   K(7,11) = -6*E*Iz/L2;
    K(11,1) = K(1,11);    K(11,5) = K(5,11);   K(11,7) = K(7,11);     K(11,11) = 4*E*Iz/L;
    // Bending in z (curvature about y)
    K(2,2) = 12*E*Iy/L3;  K(2,4) = -6*E*Iy/L2; K(2,8) = -12*E*Iy/L3;  K(2,10) = -6*E*Iy/L2;
    K(4,2) = K(2,4);      K(4,4) = 4*E*Iy/L;   K(4,8) = 6*E*Iy/L2;    K(4,10) = 2*E*Iy/L;
    K(8,2) = K(2,8);      K(8,4) = K(4,8);     K(8,8) = 12*E*Iy/L3;   K(8,10) = 6*E*Iy/L2;
    K(10,2) = K(2,10);    K(10,4) = K(4,10);   K(10,8) = K(8,10);     K(10,10) = 4*E*Iy/L;
    return K;
}

int main() {
    std::cout << std::scientific << std::setprecision(4);

    // Material concreto 4000 psi
    double E = 24.85e6, nu = 0.15, t_shell = 0.10;
    double G = E / (2.0 * (1.0 + nu));

    // Viga V30×50
    double bV = 0.30, hV = 0.50;
    double Av = bV * hV;
    double Izv = bV * std::pow(hV, 3) / 12.0;
    double Iyv = hV * std::pow(bV, 3) / 12.0;
    double Jv  = (1.0/3.0)*(1 - 0.21*(bV/hV)*(1 - std::pow(bV/hV,4)/12)) * hV * std::pow(bV, 3);

    // Geometría: 4 nodos shell + 1 nodo viga = 5 nodos
    std::vector<Node> nodes = {
        {0.0, 0.0, 0.0},   // 0: shell corner
        {1.0, 0.0, 0.0},   // 1: shell corner (también start viga)
        {1.0, 1.0, 0.0},   // 2: shell corner
        {0.0, 1.0, 0.0},   // 3: shell corner
        {2.0, 0.0, 0.0},   // 4: viga end (cantilever desde nodo 1)
    };
    int nNodes = 5;
    int totalDof = 6 * nNodes;

    auto runWithDrillingType = [&](int drillType, const char* label) {
        ElementInputs ei;
        ei.elasticities[0]    = E;       // shell
        ei.poissonsRatios[0]  = nu;
        ei.thicknesses[0]     = t_shell;
        ei.drillingTypes[0]   = drillType;
        // Frame K computado directamente abajo

        // ── Shell K (24×24 local) ──
        std::vector<Node> shellNodes = {nodes[0], nodes[1], nodes[2], nodes[3]};
        Eigen::MatrixXd Ks_local = getLocalStiffnessMatrixShellThin(shellNodes, ei, 0);

        // Para losa horizontal en plano Z=0, el sistema local del shell ya coincide
        // con el global (X=local x, Y=local y, Z=local z normal). Asumimos T=I.
        // Map shell DOFs (24) → global DOFs:
        //   shell node 0 (local 0..5) → global 0..5  (node 0)
        //   shell node 1 (local 6..11) → global 6..11 (node 1)
        //   shell node 2 (local 12..17) → global 12..17 (node 2)
        //   shell node 3 (local 18..23) → global 18..23 (node 3)
        int shellMap[24];
        for (int i = 0; i < 4; i++)
            for (int d = 0; d < 6; d++)
                shellMap[i*6 + d] = i*6 + d;

        // ── Frame K (12×12 local viga horizontal en X de nodo 1 a 4) ──
        double L = 1.0;
        Eigen::MatrixXd Kf_local = getFrameK(L, E, G, Av, Iyv, Izv, Jv);
        // Frame nodos local 0 = global node 1, frame nodo local 1 = global node 4
        int frameMap[12];
        for (int d = 0; d < 6; d++) frameMap[d]     = 1*6 + d;
        for (int d = 0; d < 6; d++) frameMap[6 + d] = 4*6 + d;

        // ── Ensamble K global (30×30) ──
        Eigen::MatrixXd K = Eigen::MatrixXd::Zero(totalDof, totalDof);
        for (int i = 0; i < 24; i++)
            for (int j = 0; j < 24; j++)
                K(shellMap[i], shellMap[j]) += Ks_local(i, j);
        for (int i = 0; i < 12; i++)
            for (int j = 0; j < 12; j++)
                K(frameMap[i], frameMap[j]) += Kf_local(i, j);

        // ── BCs: nodos 0, 2, 3 totalmente empotrados ──
        std::vector<int> fixedDofs;
        for (int n : {0, 2, 3})
            for (int d = 0; d < 6; d++)
                fixedDofs.push_back(n*6 + d);

        // ── Carga: momento Mz=1.0 en nodo 4 (DOF 4*6+5 = 29) ──
        Eigen::VectorXd F = Eigen::VectorXd::Zero(totalDof);
        F(4*6 + 5) = 1.0;

        // Reducir y resolver
        std::vector<int> freeDofs;
        for (int i = 0; i < totalDof; i++) {
            bool fixed = false;
            for (int fd : fixedDofs) if (fd == i) { fixed = true; break; }
            if (!fixed) freeDofs.push_back(i);
        }
        int nFree = freeDofs.size();
        Eigen::MatrixXd Kr(nFree, nFree);
        Eigen::VectorXd Fr(nFree);
        for (int i = 0; i < nFree; i++) {
            Fr(i) = F(freeDofs[i]);
            for (int j = 0; j < nFree; j++)
                Kr(i, j) = K(freeDofs[i], freeDofs[j]);
        }
        Eigen::VectorXd ur = Kr.fullPivLu().solve(Fr);
        Eigen::VectorXd u = Eigen::VectorXd::Zero(totalDof);
        for (int i = 0; i < nFree; i++) u(freeDofs[i]) = ur(i);

        std::cout << "[" << label << " drillingType=" << drillType << "]\n";
        std::cout << "  Nodo 1 (en shell+viga): Rz = " << u(1*6 + 5)
                  << " rad, Rx = " << u(1*6 + 3) << "\n";
        std::cout << "  Nodo 4 (extremo viga):  Rz = " << u(4*6 + 5)
                  << " rad, uX = " << u(4*6 + 0) << " m\n";
        std::cout << "  K[node1_Rz, node1_Rz]   = " << K(1*6 + 5, 1*6 + 5)
                  << "  (rigidez total en Rz nodo 1)\n";
        std::cout << "  K_norm                  = " << K.norm() << "\n\n";

        return u(4*6 + 5);  // retorna Rz del extremo viga
    };

    std::cout << "================================================================\n";
    std::cout << "Test end-to-end shell+frame con drilling DOF Hughes-Brezzi\n";
    std::cout << "  Shell Q4 1m×1m horizontal + viga 30×50 horizontal 1m cantilever\n";
    std::cout << "  Carga: Mz=1.0 N·m en extremo viga, BCs empotrar 3 nodos shell\n";
    std::cout << "================================================================\n\n";

    double rz_legacy = runWithDrillingType(0, "Legacy penalty 1e-6");
    double rz_pynite = runWithDrillingType(1, "PyNite weak 1/1000");
    double rz_hb     = runWithDrillingType(2, "Hughes-Brezzi (default)");

    std::cout << "================================================================\n";
    std::cout << "COMPARACIÓN Rz(extremo viga) bajo Mz=1 N·m:\n";
    std::cout << "  Legacy:  " << rz_legacy  << " rad\n";
    std::cout << "  PyNite:  " << rz_pynite  << " rad  (ratio vs legacy: "
              << rz_pynite/rz_legacy << ")\n";
    std::cout << "  HB:      " << rz_hb      << " rad  (ratio vs legacy: "
              << rz_hb/rz_legacy << ")\n";
    std::cout << "================================================================\n";
    std::cout << "INTERPRETACIÓN:\n";
    std::cout << "  - Si HB Rz < Legacy Rz → HB transmite drilling shell→frame REAL\n";
    std::cout << "  - Si HB Rz ≈ Legacy Rz → drilling no se acopla en este modelo\n";
    return 0;
}
