// Shell Q4 DKMQ (Discrete Kirchhoff-Mindlin Quadrilateral) — port C++ Eigen de PyNite Quad3D.py
// Referencia primaria: Katili 1993 / Katili-Batoz-Maknun-Hamdouni 2015
// Activable via elementInputs.plateFormulations[idx] == 3 (el 2 es la membrana de los exportadores)

#include "../data-model.h"
#include <Eigen/Dense>
#include <vector>
#include <cmath>
#include <limits>

using Eigen::MatrixXd;
using Eigen::VectorXd;

namespace dkmq {

// ── Local coords (mismo patron que en TS) ──
struct LocalCoords { Eigen::Vector4d x, y; };

inline LocalCoords compute_local_coords(const std::vector<std::vector<double>>& nodes) {
    LocalCoords lc;
    Eigen::Vector3d n1(nodes[0][0], nodes[0][1], nodes[0][2]);
    Eigen::Vector3d n2(nodes[1][0], nodes[1][1], nodes[1][2]);
    Eigen::Vector3d n3(nodes[2][0], nodes[2][1], nodes[2][2]);
    Eigen::Vector3d n4(nodes[3][0], nodes[3][1], nodes[3][2]);
    Eigen::Vector3d v12 = n2 - n1, v13 = n3 - n1, v14 = n4 - n1;
    Eigen::Vector3d xAxis = v12.normalized();
    Eigen::Vector3d zAxis = xAxis.cross(v13).normalized();
    Eigen::Vector3d yAxis = zAxis.cross(xAxis);
    lc.x << 0.0, v12.dot(xAxis), v13.dot(xAxis), v14.dot(xAxis);
    lc.y << 0.0, v12.dot(yAxis), v13.dot(yAxis), v14.dot(yAxis);
    return lc;
}

inline double Lk(const Eigen::Vector4d& x, const Eigen::Vector4d& y, int k) {
    if (k==5) return std::hypot(x[1]-x[0], y[1]-y[0]);
    if (k==6) return std::hypot(x[2]-x[1], y[2]-y[1]);
    if (k==7) return std::hypot(x[3]-x[2], y[3]-y[2]);
    if (k==8) return std::hypot(x[0]-x[3], y[0]-y[3]);
    return 0;
}

inline void dirCos(const Eigen::Vector4d& x, const Eigen::Vector4d& y, int k, double& C, double& S) {
    double L = Lk(x, y, k);
    if (k==5) { C = (x[1]-x[0])/L; S = (y[1]-y[0])/L; return; }
    if (k==6) { C = (x[2]-x[1])/L; S = (y[2]-y[1])/L; return; }
    if (k==7) { C = (x[3]-x[2])/L; S = (y[3]-y[2])/L; return; }
    if (k==8) { C = (x[0]-x[3])/L; S = (y[0]-y[3])/L; return; }
}

inline double phiK(const Eigen::Vector4d& x, const Eigen::Vector4d& y, int k, double t, double nu) {
    const double kappa = 5.0/6.0;
    double L = Lk(x, y, k);
    return (2.0/(kappa*(1.0-nu))) * (t/L) * (t/L);
}

inline Eigen::Matrix2d J_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta) {
    Eigen::Matrix2d J;
    J(0,0) = 0.25*(x[0]*(eta-1) - x[1]*(eta-1) + x[2]*(eta+1) - x[3]*(eta+1));
    J(0,1) = 0.25*(y[0]*(eta-1) - y[1]*(eta-1) + y[2]*(eta+1) - y[3]*(eta+1));
    J(1,0) = 0.25*(x[0]*(xi-1) - x[1]*(xi+1) + x[2]*(xi+1) - x[3]*(xi-1));
    J(1,1) = 0.25*(y[0]*(xi-1) - y[1]*(xi+1) + y[2]*(xi+1) - y[3]*(xi-1));
    return J;
}

inline MatrixXd N_gamma_mat(double xi, double eta) {
    MatrixXd N(2,4);
    N << 0.5*(1-eta), 0,           0.5*(1+eta), 0,
         0,           0.5*(1+xi),  0,           0.5*(1-xi);
    return N;
}

inline MatrixXd A_gamma_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y) {
    double L5 = Lk(x,y,5), L6 = Lk(x,y,6), L7 = Lk(x,y,7), L8 = Lk(x,y,8);
    MatrixXd A(4,4);
    A << L5/2, 0, 0, 0,
         0, L6/2, 0, 0,
         0, 0, -L7/2, 0,
         0, 0, 0, -L8/2;
    return A;
}

inline MatrixXd A_u_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y) {
    double L5 = Lk(x,y,5), L6 = Lk(x,y,6), L7 = Lk(x,y,7), L8 = Lk(x,y,8);
    double C5,S5,C6,S6,C7,S7,C8,S8;
    dirCos(x,y,5,C5,S5); dirCos(x,y,6,C6,S6); dirCos(x,y,7,C7,S7); dirCos(x,y,8,C8,S8);
    MatrixXd A(4,12);
    A << -2.0/L5, C5, S5,  2.0/L5, C5, S5,    0,    0, 0,    0,    0, 0,
          0,     0,  0, -2.0/L6, C6, S6,  2.0/L6, C6, S6,    0,    0, 0,
          0,     0,  0,    0,    0, 0, -2.0/L7, C7, S7,  2.0/L7, C7, S7,
          2.0/L8, C8, S8,  0,    0, 0,    0,    0, 0, -2.0/L8, C8, S8;
    return 0.5 * A;
}

inline MatrixXd A_Delta_inv_DKMQ(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double t, double nu) {
    double p5 = phiK(x,y,5,t,nu), p6 = phiK(x,y,6,t,nu), p7 = phiK(x,y,7,t,nu), p8 = phiK(x,y,8,t,nu);
    MatrixXd A(4,4);
    A << 1.0/(1+p5), 0, 0, 0,
         0, 1.0/(1+p6), 0, 0,
         0, 0, 1.0/(1+p7), 0,
         0, 0, 0, 1.0/(1+p8);
    return -1.5 * A;
}

inline MatrixXd A_phi_Delta(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double t, double nu) {
    double p5 = phiK(x,y,5,t,nu), p6 = phiK(x,y,6,t,nu), p7 = phiK(x,y,7,t,nu), p8 = phiK(x,y,8,t,nu);
    MatrixXd A(4,4);
    A << p5/(1+p5), 0, 0, 0,
         0, p6/(1+p6), 0, 0,
         0, 0, p7/(1+p7), 0,
         0, 0, 0, p8/(1+p8);
    return A;
}

inline MatrixXd B_b_beta(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta) {
    Eigen::Matrix2d Jinv = J_mat(x, y, xi, eta).inverse();
    double j11=Jinv(0,0), j12=Jinv(0,1), j21=Jinv(1,0), j22=Jinv(1,1);
    double N_xi[4]  = {0.25*(eta-1), -0.25*(eta-1), 0.25*(eta+1), -0.25*(eta+1)};
    double N_eta[4] = {0.25*(xi-1),  -0.25*(xi+1),  0.25*(xi+1),  -0.25*(xi-1)};
    double Nx[4], Ny[4];
    for (int i = 0; i < 4; i++) {
        Nx[i] = j11*N_xi[i] + j12*N_eta[i];
        Ny[i] = j21*N_xi[i] + j22*N_eta[i];
    }
    MatrixXd B = MatrixXd::Zero(3, 12);
    for (int i = 0; i < 4; i++) {
        B(0, 3*i+1) = Nx[i];
        B(1, 3*i+2) = Ny[i];
        B(2, 3*i+1) = Ny[i];
        B(2, 3*i+2) = Nx[i];
    }
    return B;
}

inline MatrixXd B_b_Delta_beta(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta) {
    Eigen::Matrix2d Jinv = J_mat(x, y, xi, eta).inverse();
    double j11=Jinv(0,0), j12=Jinv(0,1), j21=Jinv(1,0), j22=Jinv(1,1);
    double P_xi[4]  = { xi*(eta-1), -0.5*(eta-1)*(eta+1), -xi*(eta+1), 0.5*(eta-1)*(eta+1) };
    double P_eta[4] = { 0.5*(xi-1)*(xi+1), -eta*(xi+1), -0.5*(xi-1)*(xi+1), eta*(xi-1) };
    double Px[4], Py[4];
    for (int i = 0; i < 4; i++) {
        Px[i] = j11*P_xi[i] + j12*P_eta[i];
        Py[i] = j21*P_xi[i] + j22*P_eta[i];
    }
    double C5,S5,C6,S6,C7,S7,C8,S8;
    dirCos(x,y,5,C5,S5); dirCos(x,y,6,C6,S6); dirCos(x,y,7,C7,S7); dirCos(x,y,8,C8,S8);
    double C[4] = {C5,C6,C7,C8}, S[4] = {S5,S6,S7,S8};
    MatrixXd B(3,4);
    for (int i = 0; i < 4; i++) {
        B(0,i) = Px[i]*C[i];
        B(1,i) = Py[i]*S[i];
        B(2,i) = Py[i]*C[i] + Px[i]*S[i];
    }
    return B;
}

inline MatrixXd B_b_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta, double t, double nu) {
    return B_b_beta(x,y,xi,eta) + B_b_Delta_beta(x,y,xi,eta) * A_Delta_inv_DKMQ(x,y,t,nu) * A_u_mat(x,y);
}

inline MatrixXd B_s_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta, double t, double nu) {
    return J_mat(x,y,xi,eta).inverse() * N_gamma_mat(xi,eta) * A_gamma_mat(x,y) * A_phi_Delta(x,y,t,nu) * A_u_mat(x,y);
}

inline MatrixXd B_m_mat(const Eigen::Vector4d& x, const Eigen::Vector4d& y, double xi, double eta) {
    Eigen::Matrix2d Jinv = J_mat(x,y,xi,eta).inverse();
    MatrixXd dHnat(2,4);
    dHnat << 0.25*(eta-1), 0.25*(-eta+1), 0.25*(eta+1), 0.25*(-eta-1),
             0.25*(xi-1),  0.25*(-xi-1),  0.25*(xi+1),  0.25*(-xi+1);
    MatrixXd dH = Jinv * dHnat;
    MatrixXd B = MatrixXd::Zero(3, 8);
    for (int i = 0; i < 4; i++) {
        B(0, 2*i)   = dH(0,i);
        B(1, 2*i+1) = dH(1,i);
        B(2, 2*i)   = dH(1,i);
        B(2, 2*i+1) = dH(0,i);
    }
    return B;
}

inline Eigen::Matrix3d Hb_mat(double E, double nu, double t) {
    double c = E * t*t*t / (12.0 * (1.0 - nu*nu));
    Eigen::Matrix3d H;
    H << c, c*nu, 0,
         c*nu, c, 0,
         0, 0, c*(1-nu)/2;
    return H;
}

inline Eigen::Matrix2d Hs_mat(double E, double nu, double t) {
    double kappa = 5.0/6.0;
    double c = E * t * kappa / (2.0*(1.0+nu));
    Eigen::Matrix2d H;
    H << c, 0,
         0, c;
    return H;
}

inline Eigen::Matrix3d Cm_mat(double E, double nu) {
    double G = E/(2*(1+nu));
    double c = 1.0/(1.0 - nu*nu);
    Eigen::Matrix3d C;
    C << c*E, c*nu*E, 0,
         c*nu*E, c*E, 0,
         0, 0, (1-nu*nu)*G;
    return C;
}

} // namespace dkmq

// ── EXPORT principal: getLocalStiffnessMatrixShellQ4_DKMQ ─────────────
// 24×24 matriz local con DOFs por nodo: u, v, w, θx, θy, θz
extern "C++" Eigen::MatrixXd getLocalStiffnessMatrixShellQ4_DKMQ(
    const std::vector<std::vector<double>>& elementNodes,
    const ElementInputs& elementInputs,
    int elementIndex)
{
    using namespace dkmq;
    double E = 0, nu = 0, t = 0;
    auto itE = elementInputs.elasticities.find(elementIndex);
    if (itE != elementInputs.elasticities.end()) E = itE->second;
    auto itNu = elementInputs.poissonsRatios.find(elementIndex);
    if (itNu != elementInputs.poissonsRatios.end()) nu = itNu->second;
    auto itT = elementInputs.thicknesses.find(elementIndex);
    if (itT != elementInputs.thicknesses.end()) t = itT->second;

    LocalCoords lc = compute_local_coords(elementNodes);
    Eigen::Matrix3d Hb = Hb_mat(E, nu, t);
    Eigen::Matrix2d Hs = Hs_mat(E, nu, t);
    Eigen::Matrix3d Cm = Cm_mat(E, nu);

    double gp = 1.0 / std::sqrt(3.0);
    double xis[4]  = {-gp,  gp, gp, -gp};
    double etas[4] = {-gp, -gp, gp,  gp};

    // k_b 12×12 (DOFs locales: w_i, θx_i, θy_i por nodo i=1..4)
    MatrixXd k12 = MatrixXd::Zero(12, 12);
    for (int g = 0; g < 4; g++) {
        double dJ = J_mat(lc.x, lc.y, xis[g], etas[g]).determinant();
        MatrixXd Bb = B_b_mat(lc.x, lc.y, xis[g], etas[g], t, nu);
        MatrixXd Bs = B_s_mat(lc.x, lc.y, xis[g], etas[g], t, nu);
        k12.noalias() += Bb.transpose() * Hb * Bb * dJ;
        k12.noalias() += Bs.transpose() * Hs * Bs * dJ;
    }
    // k_m 8×8 (DOFs locales: u_i, v_i por nodo)
    MatrixXd k8 = MatrixXd::Zero(8, 8);
    for (int g = 0; g < 4; g++) {
        double dJ = J_mat(lc.x, lc.y, xis[g], etas[g]).determinant();
        MatrixXd Bm = B_m_mat(lc.x, lc.y, xis[g], etas[g]);
        k8.noalias() += Bm.transpose() * Cm * Bm * (dJ * t);
    }

    // Ensamble 24×24 con mapping PyNite
    MatrixXd k24 = MatrixXd::Zero(24, 24);
    auto mapBend = [](int i) -> int {
        if (i==0||i==3||i==6||i==9)   return 2*i + 2; // w
        if (i==1||i==4||i==7||i==10)  return 2*i + 1; // θx
        return 2*i;                                   // θy (i=2,5,8,11)
    };
    for (int i = 0; i < 12; i++) for (int j = 0; j < 12; j++)
        k24(mapBend(i), mapBend(j)) = k12(i, j);

    // ── Drilling DOF dispatcher según drillingTypes (default 2 = HB) ──────
    //
    // ⚠️ ESTE FICHERO SE QUEDÓ ATRÁS. El 19-ago-2026 la membrana pasó al
    // elemento ITW 1990 en `shellQ4.cpp`, en `shellThin.cpp`, en `shellQ4.ts` y
    // en el motor de Python. Aquí NO: sigue con Hughes-Brezzi y además con
    // `drillScale = 1.0`, que es el peor valor medido (con 1.0 el drilling deja
    // de ser un truco para quitar la singularidad de θz y BLOQUEA la membrana:
    // −11.63 % contra Timoshenko en el muro en voladizo).
    //
    // No se ha tocado porque NADIE LLAMA a este elemento: `getLocalStiffnessMatrix`
    // no lo referencia y no hay ningún test que lo ejecute. O sea que hoy es
    // código muerto. Pero si alguien lo activa, dará OTROS NÚMEROS que el resto
    // del motor, y sin avisar. Antes de usarlo: pasarlo a `getMembraneITW` igual
    // que shellThin.cpp, y meterlo en la suite.
    //   0 = penalty 1e-6 legacy
    //   1 = PyNite weak spring  (k = min(diagRot bend)/1000)  [legacy DKMQ]
    //   2 = Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990 [DEFAULT]
    int drillingType = 2;
    {
        auto it = elementInputs.drillingTypes.find(elementIndex);
        if (it != elementInputs.drillingTypes.end()) drillingType = it->second;
    }
    double drillScale = 1.0;
    {
        auto it = elementInputs.drillingPenaltyScales.find(elementIndex);
        if (it != elementInputs.drillingPenaltyScales.end()) drillScale = it->second;
    }

    if (drillingType == 1) {
        // PyNite-style weak spring (comportamiento histórico DKMQ)
        double minRot = std::numeric_limits<double>::infinity();
        int rotIdx[8] = {1, 2, 4, 5, 7, 8, 10, 11};
        for (int i : rotIdx) {
            double v = std::abs(k12(i, i));
            if (v < minRot) minRot = v;
        }
        double kRz = minRot / 1000.0;
        k24(5,5) = kRz; k24(11,11) = kRz; k24(17,17) = kRz; k24(23,23) = kRz;
    } else if (drillingType == 0) {
        // Penalty 1e-6 sobre membrana
        double drill = 0;
        for (int i = 0; i < 8; i++) drill += std::abs(k8(i, i));
        drill *= 1e-6 / 8.0;
        if (drill < 1e-15) drill = E * t * 1e-6;
        k24(5,5) = drill; k24(11,11) = drill; k24(17,17) = drill; k24(23,23) = drill;
    }
    // drillingType == 2 → HB se suma DESPUÉS de los signo-flips para no
    // mezclarse con la convención PyNite. Lo aplicamos abajo tras el remap.

    // PyNite signo: invertir filas/cols 4, 10, 16, 22
    for (int i : {4, 10, 16, 22}) {
        k24.row(i) *= -1; k24.col(i) *= -1;
    }
    // Swap x/y en [3,4], [9,10], [15,16], [21,22]
    auto swapRC = [&](int i, int j) {
        k24.row(i).swap(k24.row(j));
        k24.col(i).swap(k24.col(j));
    };
    swapRC(3,4); swapRC(9,10); swapRC(15,16); swapRC(21,22);

    // Mapping membrana 8→24
    for (int i = 0; i < 8; i++) for (int j = 0; j < 8; j++) {
        int gi = (i/2)*6 + (i%2);
        int gj = (j/2)*6 + (j%2);
        k24(gi, gj) += k8(i, j);
    }

    // ── Drilling Hughes-Brezzi (default) — se suma al k24 ya con DOFs en
    //    convención [u, v, w, θx, θy, θz] global. Usa coords locales DKMQ.
    if (drillingType == 2) {
        k24 += getDrillingK_HughesBrezzi(lc.x.data(), lc.y.data(), E, nu, t, drillScale);
    }

    return k24;
}
