// =============================================================================
// Test C++ standalone — Efecto de ETABS CARDINALPT 8 (Top Center) en pórtico
//
// Geometría: pórtico simple
//   - Columna vertical 4m, base empotrada
//   - Viga horizontal 6m, extremo izq sobre top col, extremo der libre
//   - Carga vertical F = -10 kN en extremo der viga (simula peso losa)
//
// 3 casos:
//   A) Viga con centroide en plano losa (Hekatan actual, CARDINALPT 10 Centroid)
//   B) Viga con centroide 0.25m DEBAJO + rigid link vertical (= CARDINALPT 8)
//   C) Viga con I × 2.0 (cracking modifier reverso — para comparar)
//
// Reporta M3 col base, M3 viga centro → ver cuál matchea ETABS distribución.
//
// Compilar:
//   g++ -O2 -std=c++17 -I src/cpp/eigen test_cardinalpt8_effect.cpp -o test_cardinalpt8.exe
// =============================================================================

#include <iostream>
#include <iomanip>
#include <Eigen/Dense>
#include <cmath>

static Eigen::MatrixXd frameK_3D(double L, double E, double G, double A,
                                   double Iy, double Iz, double J) {
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);
    double k_a = E*A/L;
    K(0,0) = K(6,6) = k_a;  K(0,6) = K(6,0) = -k_a;
    double k_t = G*J/L;
    K(3,3) = K(9,9) = k_t;  K(3,9) = K(9,3) = -k_t;
    double L2 = L*L, L3 = L*L*L;
    // bending in y (around z)
    K(1,1)=K(7,7)=12*E*Iz/L3; K(1,5)=K(1,11)=K(5,1)=K(11,1)=6*E*Iz/L2;
    K(7,5)=K(5,7)=-6*E*Iz/L2; K(7,11)=K(11,7)=-6*E*Iz/L2;
    K(1,7)=K(7,1)=-12*E*Iz/L3; K(5,5)=K(11,11)=4*E*Iz/L; K(5,11)=K(11,5)=2*E*Iz/L;
    // bending in z (around y)
    K(2,2)=K(8,8)=12*E*Iy/L3; K(2,4)=K(4,2)=-6*E*Iy/L2; K(2,10)=K(10,2)=-6*E*Iy/L2;
    K(8,4)=K(4,8)=6*E*Iy/L2;  K(8,10)=K(10,8)=6*E*Iy/L2;
    K(2,8)=K(8,2)=-12*E*Iy/L3; K(4,4)=K(10,10)=4*E*Iy/L; K(4,10)=K(10,4)=2*E*Iy/L;
    return K;
}

// Transformation 12×12 para columna vertical (eje +Z)
static Eigen::MatrixXd T_col_vertical() {
    Eigen::Matrix3d R;
    R << 0, 0, 1,
         0, 1, 0,
        -1, 0, 0;
    Eigen::MatrixXd T = Eigen::MatrixXd::Zero(12, 12);
    for (int i = 0; i < 4; i++) T.block<3,3>(i*3, i*3) = R;
    return T;
}

// Transformation 12×12 para viga horizontal en X (identity)
static Eigen::MatrixXd T_beam_X() {
    return Eigen::MatrixXd::Identity(12, 12);
}

// Rigid link 12×12: 2 nodos en la misma posición horizontal pero offset vertical dz
// Conecta nodo_top (slab level) con nodo_bot (centroid level dz abajo).
// Constraint: u_bot = u_top + r_top × dz (rigid body)
// Implementación como elemento rígido con K muy grande en los DOFs apropiados.
// Para test simple: usar penalty muy alto (1e12) en los acoplamientos
static Eigen::MatrixXd rigidLinkVertical(double dz) {
    // 12 DOFs: [u, v, w, rx, ry, rz] en cada nodo
    // Constraints rigid body:
    //   u_bot = u_top - dz · ry_top     (movimiento horizontal X por rot Y arriba)
    //   v_bot = v_top + dz · rx_top
    //   w_bot = w_top
    //   rx_bot = rx_top, ry_bot = ry_top, rz_bot = rz_top
    // En forma de matriz R 12×12 con DOFs [u_top, v_top, w_top, rx_top, ry_top, rz_top,
    //                                       u_bot, v_bot, w_bot, rx_bot, ry_bot, rz_bot]
    // K_link = penalty × (B^T B) donde B es 6×12 con las constraints
    double pen = 1e15;
    Eigen::MatrixXd B = Eigen::MatrixXd::Zero(6, 12);
    // u_bot - u_top + dz·ry_top = 0
    B(0, 0) = -1.0; B(0, 4) = +dz; B(0, 6) = +1.0;
    // v_bot - v_top - dz·rx_top = 0
    B(1, 1) = -1.0; B(1, 3) = -dz; B(1, 7) = +1.0;
    // w_bot - w_top = 0
    B(2, 2) = -1.0; B(2, 8) = +1.0;
    // rx_bot = rx_top, ry_bot = ry_top, rz_bot = rz_top
    B(3, 3) = -1.0; B(3, 9)  = +1.0;
    B(4, 4) = -1.0; B(4, 10) = +1.0;
    B(5, 5) = -1.0; B(5, 11) = +1.0;
    return pen * B.transpose() * B;
}

int main() {
    std::cout << std::scientific << std::setprecision(4);

    // Material concreto 4000 psi
    double E = 24.85e6, nu = 0.15;
    double G = E / (2*(1+nu));

    // Col C40×40
    double bC = 0.40, hC = 0.40;
    double Ac = bC*hC;
    double Iyc = hC * bC*bC*bC / 12;
    double Izc = bC * hC*hC*hC / 12;
    double Jc = 0.141 * bC*bC*bC*bC;
    double L_col = 4.0;

    // Viga V30×50
    double bV = 0.30, hV = 0.50;
    double Av = bV*hV;
    double Iyv = hV * bV*bV*bV / 12;
    double Izv = bV * hV*hV*hV / 12;
    // Saint-Venant J Roark
    auto stVenantJ = [](double b, double h) {
        double a = std::max(b,h), s = std::min(b,h);
        double r = s/a;
        double beta = (1.0/3.0) * (1 - 0.21*r*(1 - std::pow(r,4)/12));
        return beta * a * s*s*s;
    };
    double Jv = stVenantJ(bV, hV);
    double L_beam = 6.0;

    // ─── CASO A: pórtico SIN insertion point (Hekatan actual) ───
    // Nodes: 0 = (0,0,0) base col empotrada
    //        1 = (0,0,4) top col = nodo de viga (slab level)
    //        2 = (6,0,4) extremo viga libre
    // 3 nodos, 18 DOFs
    auto solve_no_offset = [&]() {
        int nNodes = 3;
        int dof = 6 * nNodes;
        Eigen::MatrixXd K = Eigen::MatrixXd::Zero(dof, dof);

        // Column (node 0 → node 1)
        Eigen::MatrixXd Kc_local = frameK_3D(L_col, E, G, Ac, Iyc, Izc, Jc);
        Eigen::MatrixXd Tc = T_col_vertical();
        Eigen::MatrixXd Kc = Tc.transpose() * Kc_local * Tc;
        int colMap[12];
        for (int d = 0; d < 6; d++) { colMap[d] = 0*6 + d; colMap[6 + d] = 1*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(colMap[i], colMap[j]) += Kc(i, j);

        // Beam (node 1 → node 2)
        Eigen::MatrixXd Kb_local = frameK_3D(L_beam, E, G, Av, Iyv, Izv, Jv);
        Eigen::MatrixXd Tb = T_beam_X();
        Eigen::MatrixXd Kb = Tb.transpose() * Kb_local * Tb;
        int beamMap[12];
        for (int d = 0; d < 6; d++) { beamMap[d] = 1*6 + d; beamMap[6 + d] = 2*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(beamMap[i], beamMap[j]) += Kb(i, j);

        // BCs: empotrar nodo 0
        std::vector<int> fixed = {0,1,2,3,4,5};
        Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
        F(2*6 + 2) = -10.0;  // Fz = -10 kN en extremo viga (carga vertical)

        std::vector<int> free;
        for (int i = 0; i < dof; i++) {
            bool isFx = false;
            for (int f : fixed) if (f == i) { isFx = true; break; }
            if (!isFx) free.push_back(i);
        }
        int nf = free.size();
        Eigen::MatrixXd Kr(nf, nf);
        Eigen::VectorXd Fr(nf);
        for (int i = 0; i < nf; i++) {
            Fr(i) = F(free[i]);
            for (int j = 0; j < nf; j++) Kr(i,j) = K(free[i], free[j]);
        }
        Eigen::VectorXd ur = Kr.fullPivLu().solve(Fr);
        Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
        for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

        // Extract member forces
        Eigen::VectorXd u_col_global(12);
        for (int i = 0; i < 12; i++) u_col_global(i) = u(colMap[i]);
        Eigen::VectorXd u_col_local = Tc * u_col_global;
        Eigen::VectorXd f_col_local = Kc_local * u_col_local;

        Eigen::VectorXd u_beam_global(12);
        for (int i = 0; i < 12; i++) u_beam_global(i) = u(beamMap[i]);
        Eigen::VectorXd u_beam_local = Tb * u_beam_global;
        Eigen::VectorXd f_beam_local = Kb_local * u_beam_local;

        std::cout << "  [CASO A] SIN insertion point (Hekatan actual)\n";
        std::cout << "    w_extremo viga (uz nodo 2)  = " << u(2*6 + 2) << " m\n";
        std::cout << "    M_col base   (M2 local, bending vert)  = " << std::abs(f_col_local(4))  << " kN·m\n";
        std::cout << "    M_viga junta (M2 local I, bending vert) = " << std::abs(f_beam_local(4)) << " kN·m\n";
        std::cout << "    M_viga junta (M2 local J)               = " << std::abs(f_beam_local(10)) << " kN·m\n";
        std::cout << "    Axial N_viga junta I (N local)          = " << std::abs(f_beam_local(0))  << " kN  (signo composite action)\n";
        std::cout << "    M_viga centro (estim)       = " << std::abs((f_beam_local(5) - f_beam_local(11))/2) << " kN·m\n";
        return std::make_pair(std::abs(f_col_local(4)), std::abs(f_beam_local(4)));
    };

    // ─── CASO B: pórtico CON insertion point (CARDINALPT 8, viga 0.25m abajo) ───
    // Nodes: 0 = (0,0,0) base col empotrada
    //        1 = (0,0,4) top col = slab level
    //        2 = (0,0, 4 - hV/2) = (0,0,3.75) = centroide viga lado col (CARDINALPT 8)
    //        3 = (6,0,3.75) = centroide viga extremo libre
    //        4 = (6,0,4) = nodo en slab level extremo viga (libre)
    // Rigid link vertical entre (1,2) y (4,3) — el viga real va de 2 → 3
    // Carga en nodo 4 (que está rigid-conectado al 3 via link)
    auto solve_with_offset = [&]() {
        int nNodes = 5;
        int dof = 6 * nNodes;
        Eigen::MatrixXd K = Eigen::MatrixXd::Zero(dof, dof);
        double dz = hV / 2;  // 0.25m

        // Column (node 0 → node 1, vertical)
        Eigen::MatrixXd Kc_local = frameK_3D(L_col, E, G, Ac, Iyc, Izc, Jc);
        Eigen::MatrixXd Tc = T_col_vertical();
        Eigen::MatrixXd Kc = Tc.transpose() * Kc_local * Tc;
        int colMap[12];
        for (int d = 0; d < 6; d++) { colMap[d] = 0*6 + d; colMap[6 + d] = 1*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(colMap[i], colMap[j]) += Kc(i, j);

        // Beam (node 2 → node 3, horizontal en X a Z=3.75)
        Eigen::MatrixXd Kb_local = frameK_3D(L_beam, E, G, Av, Iyv, Izv, Jv);
        Eigen::MatrixXd Tb = T_beam_X();
        Eigen::MatrixXd Kb = Tb.transpose() * Kb_local * Tb;
        int beamMap[12];
        for (int d = 0; d < 6; d++) { beamMap[d] = 2*6 + d; beamMap[6 + d] = 3*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(beamMap[i], beamMap[j]) += Kb(i, j);

        // Rigid link 1: node 1 (slab top col) ↔ node 2 (beam centroid lado col)
        // node 2 is dz=0.25 ABAJO de node 1
        Eigen::MatrixXd Klink = rigidLinkVertical(-dz);  // dz negativo: nodo "bot" está abajo
        int linkMap1[12];
        for (int d = 0; d < 6; d++) { linkMap1[d] = 1*6 + d; linkMap1[6 + d] = 2*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(linkMap1[i], linkMap1[j]) += Klink(i, j);

        // Rigid link 2: node 4 (slab extremo viga) ↔ node 3 (beam centroid extremo)
        int linkMap2[12];
        for (int d = 0; d < 6; d++) { linkMap2[d] = 4*6 + d; linkMap2[6 + d] = 3*6 + d; }
        for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
            K(linkMap2[i], linkMap2[j]) += Klink(i, j);

        // BCs: empotrar nodo 0
        std::vector<int> fixed = {0,1,2,3,4,5};
        Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
        F(4*6 + 2) = -10.0;  // Carga aplicada en NODO 4 (slab level extremo)

        std::vector<int> free;
        for (int i = 0; i < dof; i++) {
            bool isFx = false;
            for (int f : fixed) if (f == i) { isFx = true; break; }
            if (!isFx) free.push_back(i);
        }
        int nf = free.size();
        Eigen::MatrixXd Kr(nf, nf);
        Eigen::VectorXd Fr(nf);
        for (int i = 0; i < nf; i++) {
            Fr(i) = F(free[i]);
            for (int j = 0; j < nf; j++) Kr(i,j) = K(free[i], free[j]);
        }
        Eigen::VectorXd ur = Kr.fullPivLu().solve(Fr);
        Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
        for (int i = 0; i < nf; i++) u(free[i]) = ur(i);

        // Member forces
        Eigen::VectorXd u_col_global(12);
        for (int i = 0; i < 12; i++) u_col_global(i) = u(colMap[i]);
        Eigen::VectorXd u_col_local = Tc * u_col_global;
        Eigen::VectorXd f_col_local = Kc_local * u_col_local;

        Eigen::VectorXd u_beam_global(12);
        for (int i = 0; i < 12; i++) u_beam_global(i) = u(beamMap[i]);
        Eigen::VectorXd u_beam_local = Tb * u_beam_global;
        Eigen::VectorXd f_beam_local = Kb_local * u_beam_local;

        std::cout << "  [CASO B] CON insertion point CARDINALPT 8 (viga 0.25m abajo, rigid link)\n";
        std::cout << "    w_extremo viga (uz nodo 4)  = " << u(4*6 + 2) << " m\n";
        std::cout << "    M_col base   (M2 local, bending vert)  = " << std::abs(f_col_local(4))  << " kN·m\n";
        std::cout << "    M_viga junta (M2 local I, bending vert) = " << std::abs(f_beam_local(4)) << " kN·m\n";
        std::cout << "    M_viga junta (M2 local J)               = " << std::abs(f_beam_local(10)) << " kN·m\n";
        std::cout << "    Axial N_viga junta I (N local)          = " << std::abs(f_beam_local(0))  << " kN  (signo composite action)\n";
        return std::make_pair(std::abs(f_col_local(4)), std::abs(f_beam_local(4)));
    };

    std::cout << "===============================================================\n";
    std::cout << "Test pórtico — Efecto CARDINALPT 8 (Top Center insertion point)\n";
    std::cout << "  Col vertical C40x40 4m, viga horizontal V30x50 6m\n";
    std::cout << "  Carga Fz = -10 kN en extremo libre viga\n";
    std::cout << "===============================================================\n\n";

    // Fix return type: ahora extraemos M2 local (index 4) en lugar de M3
    auto solve_no_offset_v2 = [&]() {
        solve_no_offset();
        return std::make_pair(0.0, 0.0);  // placeholder
    };
    auto [Mcol_A, Mbeam_A] = solve_no_offset();
    std::cout << "\n";
    auto [Mcol_B, Mbeam_B] = solve_with_offset();

    std::cout << "\n===============================================================\n";
    std::cout << "COMPARATIVA distribución M_col / M_viga:\n";
    std::cout << "  CASO A (sin offset): ratio M_col/M_viga = " << Mcol_A/Mbeam_A << "\n";
    std::cout << "  CASO B (con offset): ratio M_col/M_viga = " << Mcol_B/Mbeam_B << "\n";
    std::cout << "\n  Cambio en M_col:  " << Mcol_A  << " -> " << Mcol_B  << "  (" << (Mcol_B/Mcol_A - 1)*100 << "% diff)\n";
    std::cout << "  Cambio en M_viga: " << Mbeam_A << " -> " << Mbeam_B << "  (" << (Mbeam_B/Mbeam_A - 1)*100 << "% diff)\n";
    std::cout << "===============================================================\n";
    std::cout << "INTERPRETACION:\n";
    std::cout << "  - Si CASO B reduce M_col y aumenta M_viga -> insertion point es la causa\n";
    std::cout << "    del +52% M_col Hekatan vs ETABS en mesa-torsion.\n";
    return 0;
}
