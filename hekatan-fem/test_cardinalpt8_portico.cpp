// Test pórtico 2-cols + 1-viga (indeterminado) con/sin CARDINALPT 8
// Carga vertical Fz centrada en viga -> M_col vs M_viga dependen de rigidez relativa.

#include <iostream>
#include <iomanip>
#include <Eigen/Dense>
#include <cmath>

static Eigen::MatrixXd frameK_3D(double L, double E, double G, double A,
                                   double Iy, double Iz, double J) {
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);
    double k_a = E*A/L;
    K(0,0) = K(6,6) = k_a; K(0,6) = K(6,0) = -k_a;
    double k_t = G*J/L;
    K(3,3) = K(9,9) = k_t; K(3,9) = K(9,3) = -k_t;
    double L2 = L*L, L3 = L*L*L;
    K(1,1)=K(7,7)=12*E*Iz/L3; K(1,5)=K(1,11)=K(5,1)=K(11,1)=6*E*Iz/L2;
    K(7,5)=K(5,7)=-6*E*Iz/L2; K(7,11)=K(11,7)=-6*E*Iz/L2;
    K(1,7)=K(7,1)=-12*E*Iz/L3; K(5,5)=K(11,11)=4*E*Iz/L; K(5,11)=K(11,5)=2*E*Iz/L;
    K(2,2)=K(8,8)=12*E*Iy/L3; K(2,4)=K(4,2)=-6*E*Iy/L2; K(2,10)=K(10,2)=-6*E*Iy/L2;
    K(8,4)=K(4,8)=6*E*Iy/L2; K(8,10)=K(10,8)=6*E*Iy/L2;
    K(2,8)=K(8,2)=-12*E*Iy/L3; K(4,4)=K(10,10)=4*E*Iy/L; K(4,10)=K(10,4)=2*E*Iy/L;
    return K;
}

static Eigen::MatrixXd T_col_vert() {
    Eigen::Matrix3d R; R << 0,0,1, 0,1,0, -1,0,0;
    Eigen::MatrixXd T = Eigen::MatrixXd::Zero(12,12);
    for (int i=0; i<4; i++) T.block<3,3>(i*3, i*3) = R;
    return T;
}

static Eigen::MatrixXd T_beam_X() { return Eigen::MatrixXd::Identity(12,12); }

// Rigid link 6×12: 6 constraints entre los 12 DOFs (2 nodos)
// Top node (nodo "A") está dz ARRIBA del centroid node (nodo "B")
// Constraints: u_B = u_A + r_A × (0,0,-dz), etc.
// Para offset vertical negativo (B abajo de A):
//   u_B = u_A - dz·ry_A     (movimiento horizontal X)
//   v_B = v_A + dz·rx_A
//   w_B = w_A
//   rx_B = rx_A, ry_B = ry_A, rz_B = rz_A
// K_link = penalty × B^T B donde B es 6×12.
static Eigen::MatrixXd rigidLinkVertical(double dz, double penalty = 1e15) {
    Eigen::MatrixXd B = Eigen::MatrixXd::Zero(6, 12);
    // Cols: 0..5 = DOFs A (top), 6..11 = DOFs B (bot, dz abajo)
    B(0, 0) = -1; B(0, 4) = -dz; B(0, 6) = +1;   // u_B = u_A - dz·ry_A
    B(1, 1) = -1; B(1, 3) = +dz; B(1, 7) = +1;   // v_B = v_A + dz·rx_A
    B(2, 2) = -1; B(2, 8) = +1;
    B(3, 3) = -1; B(3, 9)  = +1;
    B(4, 4) = -1; B(4, 10) = +1;
    B(5, 5) = -1; B(5, 11) = +1;
    return penalty * B.transpose() * B;
}

int main() {
    std::cout << std::scientific << std::setprecision(4);
    double E = 24.85e6, nu = 0.15, G = E/(2*(1+nu));
    // Col C40x40
    double Ac = 0.16, Iyc = 0.4*0.4*0.4*0.4/12, Izc = Iyc, Jc = 0.141*0.4*0.4*0.4*0.4;
    double Lcol = 4.0;
    // Viga V30x50
    double Av = 0.15, Iyv = 0.50*0.30*0.30*0.30/12, Izv = 0.30*0.50*0.50*0.50/12;
    double bV = 0.30, hV = 0.50;
    double a = std::max(bV,hV), s = std::min(bV,hV), r = s/a;
    double beta = (1.0/3.0)*(1 - 0.21*r*(1 - std::pow(r,4)/12));
    double Jv = beta * a * s*s*s;
    double Lbeam = 6.0;

    auto solve = [&](bool useOffset, const char* label) {
        // Sin offset: 4 nodos (0,1,2,3) = 24 DOFs
        // Con offset: 6 nodos (0,1,2,3,4,5) = 36 DOFs, nodos 4,5 son centroides viga
        //   0=(0,0,0) base col izq, 1=(0,0,4) top izq, 2=(6,0,4) top der, 3=(6,0,0) base col der
        //   4=(0,0,3.75) centroide viga izq, 5=(6,0,3.75) centroide viga der
        //   Rigid link 1↔4 y 2↔5

        int nNodes = useOffset ? 6 : 4;
        int dof = 6 * nNodes;
        Eigen::MatrixXd K = Eigen::MatrixXd::Zero(dof, dof);

        auto assembleK = [&](const Eigen::MatrixXd &Kglobal, const int map[12]) {
            for (int i=0; i<12; i++) for (int j=0; j<12; j++)
                K(map[i], map[j]) += Kglobal(i, j);
        };

        // Col izq (0→1)
        Eigen::MatrixXd Kc_local = frameK_3D(Lcol, E, G, Ac, Iyc, Izc, Jc);
        Eigen::MatrixXd Tc = T_col_vert();
        Eigen::MatrixXd Kc_global = Tc.transpose() * Kc_local * Tc;
        int cMap1[12]; for (int d=0; d<6; d++) { cMap1[d]=0*6+d; cMap1[6+d]=1*6+d; }
        assembleK(Kc_global, cMap1);
        // Col der (3→2)
        int cMap2[12]; for (int d=0; d<6; d++) { cMap2[d]=3*6+d; cMap2[6+d]=2*6+d; }
        assembleK(Kc_global, cMap2);

        // Viga
        Eigen::MatrixXd Kb_local = frameK_3D(Lbeam, E, G, Av, Iyv, Izv, Jv);
        Eigen::MatrixXd Tb = T_beam_X();
        Eigen::MatrixXd Kb_global = Tb.transpose() * Kb_local * Tb;

        int beamMap[12];
        if (useOffset) {
            // Viga 4→5 (centroides)
            for (int d=0; d<6; d++) { beamMap[d]=4*6+d; beamMap[6+d]=5*6+d; }
        } else {
            // Viga 1→2 (mismo nivel que cols)
            for (int d=0; d<6; d++) { beamMap[d]=1*6+d; beamMap[6+d]=2*6+d; }
        }
        assembleK(Kb_global, beamMap);

        // Rigid links (solo si useOffset)
        if (useOffset) {
            double dz = hV / 2;  // 0.25m offset (viga abajo)
            Eigen::MatrixXd Klink = rigidLinkVertical(dz);
            // Link nodo 1 (top col izq) ↔ nodo 4 (centroide viga izq)
            int lMap1[12]; for (int d=0; d<6; d++) { lMap1[d]=1*6+d; lMap1[6+d]=4*6+d; }
            assembleK(Klink, lMap1);
            // Link nodo 2 (top col der) ↔ nodo 5 (centroide viga der)
            int lMap2[12]; for (int d=0; d<6; d++) { lMap2[d]=2*6+d; lMap2[6+d]=5*6+d; }
            assembleK(Klink, lMap2);
        }

        // BCs: empotrar nodos 0 y 3 (bases de col)
        std::vector<int> fixed;
        for (int n : {0, 3}) for (int d=0; d<6; d++) fixed.push_back(n*6+d);

        // ★ Aplicar Mx en juntas top (Mz local viga) para forzar BENDING redistribuido
        // entre col y viga. Sin carga vertical, solo momento → la rigidez relativa
        // distribuye el momento entre los elementos en la junta.
        Eigen::VectorXd F = Eigen::VectorXd::Zero(dof);
        F(1*6 + 4) = +10.0;  // My=+10 kN·m en top col izq (alrededor de eje Y global)

        std::vector<int> free;
        for (int i=0; i<dof; i++) {
            bool fx=false;
            for (int f:fixed) if (f==i) { fx=true; break; }
            if (!fx) free.push_back(i);
        }
        int nf = free.size();
        Eigen::MatrixXd Kr(nf,nf);
        Eigen::VectorXd Fr(nf);
        for (int i=0; i<nf; i++) {
            Fr(i) = F(free[i]);
            for (int j=0; j<nf; j++) Kr(i,j) = K(free[i], free[j]);
        }
        Eigen::VectorXd ur = Kr.fullPivLu().solve(Fr);
        Eigen::VectorXd u = Eigen::VectorXd::Zero(dof);
        for (int i=0; i<nf; i++) u(free[i]) = ur(i);

        // Extract M_col base (col izq, nodo 0) y M_viga en junta izq
        Eigen::VectorXd u_col1(12);
        for (int i=0; i<12; i++) u_col1(i) = u(cMap1[i]);
        Eigen::VectorXd u_col1_local = Tc * u_col1;
        Eigen::VectorXd f_col1_local = Kc_local * u_col1_local;

        Eigen::VectorXd u_beam(12);
        for (int i=0; i<12; i++) u_beam(i) = u(beamMap[i]);
        Eigen::VectorXd u_beam_local = Tb * u_beam;
        Eigen::VectorXd f_beam_local = Kb_local * u_beam_local;

        double M_col_base   = std::abs(f_col1_local(4));   // M2 local col base
        double M_viga_junta = std::abs(f_beam_local(4));   // M2 local viga junta I
        double w_top_der    = u(2*6 + 2);                  // uz top col der

        std::cout << "  [" << label << "]\n";
        std::cout << "    w_top_der               = " << w_top_der << " m\n";
        std::cout << "    M_col base (My)         = " << M_col_base << " kN·m\n";
        std::cout << "    M_viga junta izq (My)   = " << M_viga_junta << " kN·m\n";
        std::cout << "    M_viga junta der (My)   = " << std::abs(f_beam_local(10)) << " kN·m\n";
        if (useOffset) {
            // Axial en viga (composite action genera axial)
            std::cout << "    Axial N viga (composite) = " << std::abs(f_beam_local(0)) << " kN  (signo composite)\n";
        }
        return std::make_pair(M_col_base, M_viga_junta);
    };

    std::cout << "===============================================================\n";
    std::cout << "Test portico 2-cols + 1-viga (indeterminado) — CARDINALPT 8\n";
    std::cout << "  Col C40x40 4m vertical, viga V30x50 6m horizontal\n";
    std::cout << "  Carga Fz=-10 kN en TOP der (asimétrica)\n";
    std::cout << "===============================================================\n\n";

    auto [McA, MvA] = solve(false, "CASO A: SIN insertion point (Hekatan actual)");
    std::cout << "\n";
    auto [McB, MvB] = solve(true,  "CASO B: CON insertion point CARDINALPT 8 (viga -0.25m)");

    std::cout << "\n===============================================================\n";
    std::cout << "DISTRIBUCION:\n";
    std::cout << "  Caso A:  M_col=" << McA << "  M_viga=" << MvA << "  ratio col/viga=" << McA/MvA << "\n";
    std::cout << "  Caso B:  M_col=" << McB << "  M_viga=" << MvB << "  ratio col/viga=" << McB/MvB << "\n";
    std::cout << "\n  M_col cambia: " << (McB/McA-1)*100 << "%  (negativo = baja la carga en col)\n";
    std::cout << "  M_viga cambia: " << (MvB/MvA-1)*100 << "%  (positivo = aumenta carga viga)\n";
    std::cout << "===============================================================\n";
    return 0;
}
