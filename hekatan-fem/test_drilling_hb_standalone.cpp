// =============================================================================
// Test standalone — Drilling Hughes-Brezzi vs penalty legacy
//
// Aísla el helper getDrillingK_HughesBrezzi del solver completo. Construye
// un shell Q4 1m×1m, calcula K_drill para los 3 modos (0=legacy, 1=PyNite,
// 2=HB) y reporta:
//   - Norma Frobenius de K_drill 24×24
//   - Rigidez diagonal en θz0 (K[5,5])
//   - Off-diagonals típicos K[5,11], K[0,5] (drilling↔drilling, u↔drilling)
//
// Para una losa de concreto E=24.85e6 kN/m², ν=0.15, t=0.10m, G=10.8e6 kN/m²:
//   γ_HB = G·t = 1.08e6 kN/m
//   K_drill_HB[θz,θz] ~ γ · ∫N² dA ~ γ·A/9 ~ 1.08e6·1/9 = 1.2e5 kN·m/rad
//   K_drill_legacy ~ 1e-6 × diag(membrana) ~ 1e-6 × E·t ~ 2.5 kN·m/rad
//
// Si HB se ejecuta correctamente → diagonal θz × 50000 más grande.
//
// Compilar:
//   g++ -O2 -std=c++17 -I src/cpp/eigen \
//       test_drilling_hb_standalone.cpp src/cpp/utils/drillingHughesBrezzi.cpp \
//       -o test_drilling_hb.exe
// =============================================================================

#include <iostream>
#include <iomanip>
#include <vector>
#include <Eigen/Dense>

// Forward declaration (definido en drillingHughesBrezzi.cpp)
Eigen::MatrixXd getDrillingK_HughesBrezzi(
    const double x[4], const double y[4],
    double E, double nu, double t,
    double gamma_scale);

int main() {
    // Shell Q4 1m × 1m, concreto 4000 psi (E=24.85 GPa, ν=0.15), t=0.10m
    double x[4] = {0.0, 1.0, 1.0, 0.0};
    double y[4] = {0.0, 0.0, 1.0, 1.0};
    double E = 24.85e6;     // kN/m²
    double nu = 0.15;
    double t = 0.10;        // m
    double G = E / (2.0 * (1.0 + nu));

    std::cout << std::scientific << std::setprecision(6);
    std::cout << "================================================================\n";
    std::cout << "Test standalone — drilling Hughes-Brezzi (shell 1×1×0.10m)\n";
    std::cout << "----------------------------------------------------------------\n";
    std::cout << "E    = " << E << " kN/m²\n";
    std::cout << "nu   = " << nu << "\n";
    std::cout << "t    = " << t << " m\n";
    std::cout << "G    = " << G << " kN/m²\n";
    std::cout << "γ=G·t = " << G * t << " kN/m  (penalty HB original, scale=1)\n";
    std::cout << "================================================================\n\n";

    // ── Test 1: HB con scale=1.0 (default) ──
    Eigen::MatrixXd Khb1 = getDrillingK_HughesBrezzi(x, y, E, nu, t, 1.0);
    std::cout << "[HB scale=1.0]\n";
    std::cout << "  Frobenius |K_drill|     = " << Khb1.norm()        << "\n";
    std::cout << "  K[5,5]    (θz0 diag)    = " << Khb1(5, 5)         << "\n";
    std::cout << "  K[11,11]  (θz1 diag)    = " << Khb1(11, 11)       << "\n";
    std::cout << "  K[5,11]   (θz0 ↔ θz1)   = " << Khb1(5, 11)        << "\n";
    std::cout << "  K[0,5]    (u0 ↔ θz0)    = " << Khb1(0, 5)         << "\n";
    std::cout << "  K[1,5]    (v0 ↔ θz0)    = " << Khb1(1, 5)         << "\n";
    std::cout << "  K[2,2]    (w0)  → debe ser 0 = " << Khb1(2, 2)    << "\n";
    std::cout << "  K[3,3]    (θx0) → debe ser 0 = " << Khb1(3, 3)    << "\n\n";

    // ── Test 2: HB con scale=10 (10× más rígido) ──
    Eigen::MatrixXd Khb10 = getDrillingK_HughesBrezzi(x, y, E, nu, t, 10.0);
    std::cout << "[HB scale=10.0]\n";
    std::cout << "  K[5,5] = " << Khb10(5,5) << "  (ratio scale10/scale1 = "
              << Khb10(5,5)/Khb1(5,5) << ")\n\n";

    // ── Test 3: HB con scale=0 (debe dar matriz 0) ──
    Eigen::MatrixXd Khb0 = getDrillingK_HughesBrezzi(x, y, E, nu, t, 0.0);
    std::cout << "[HB scale=0.0]\n";
    std::cout << "  Frobenius = " << Khb0.norm() << "  (debe ser 0)\n\n";

    // ── Comparación: legacy penalty 1e-6 × (E·t) ──
    double K_legacy = 1e-6 * E * t;
    std::cout << "[Legacy penalty 1e-6]\n";
    std::cout << "  K[5,5] ≈ " << K_legacy << " kN·m/rad\n\n";

    // ── Ratio HB / Legacy ──
    std::cout << "================================================================\n";
    std::cout << "RATIO HB / Legacy en K[5,5]: " << Khb1(5,5) / K_legacy << "\n";
    std::cout << "  → si > 1000, HB transmite drilling REAL\n";
    std::cout << "  → si ≈ 1, no hay diferencia significativa\n";
    std::cout << "================================================================\n";

    // ── Patch test rigidez: rotación rígida θz=1 en los 4 nodos debe dar 0 ──
    Eigen::VectorXd u_rigid(24);
    u_rigid.setZero();
    u_rigid(5) = u_rigid(11) = u_rigid(17) = u_rigid(23) = 1.0;  // θz=1 en 4 nodos
    // Para rigid body rotation θz=ω, debe ser u_i = -ω·y_i, v_i = +ω·x_i
    Eigen::Vector3d center(0.5, 0.5, 0.0);
    for (int i = 0; i < 4; i++) {
        u_rigid(6*i + 0) = -(y[i] - center(1)) * 1.0;  // u = -ω·(y-yc)
        u_rigid(6*i + 1) = +(x[i] - center(0)) * 1.0;  // v = +ω·(x-xc)
    }
    double energy_rigid = 0.5 * u_rigid.transpose() * Khb1 * u_rigid;
    std::cout << "\n[Patch test rotación rígida (θz=1 en 4 nodos)]\n";
    std::cout << "  Energía = (1/2) u^T K_HB u = " << energy_rigid
              << "  (debe ser ≈ 0 si pasa el test)\n";

    return 0;
}
