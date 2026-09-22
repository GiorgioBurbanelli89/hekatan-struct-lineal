// =============================================================================
// Test standalone C++ — Wilson 4 incompatible modes Q4 membrane
//                       + Taylor 1976 J0 patch test correction.
//
// Equivalente exacto del test Python test_wilson_membrane.py.
// Genera test_wilson_cpp_result.json para comparar con test_wilson_python_result.json.
//
// Compilar:
//   g++ -O2 -std=c++17 -I src/cpp/eigen test_wilson_membrane.cpp -o test_wilson_membrane.exe
// Correr:
//   PATH="/c/Program Files/GNU Octave/Octave-10.1.0/mingw64/bin:$PATH" ./test_wilson_membrane.exe
// =============================================================================

#include <iostream>
#include <iomanip>
#include <fstream>
#include <cmath>
#include <vector>
#include <Eigen/Dense>

static const double GP = 0.5773502691896258;  // 1/sqrt(3)
static const double GP2x2[4][2] = {
    {-GP, -GP}, {GP, -GP}, {GP, GP}, {-GP, GP}
};

static void shape_q4(double xi, double eta,
                      double N[4], double dNdxi[4], double dNdeta[4]) {
    N[0] = 0.25 * (1 - xi) * (1 - eta);
    N[1] = 0.25 * (1 + xi) * (1 - eta);
    N[2] = 0.25 * (1 + xi) * (1 + eta);
    N[3] = 0.25 * (1 - xi) * (1 + eta);
    dNdxi[0]  = -0.25 * (1 - eta); dNdxi[1]  =  0.25 * (1 - eta);
    dNdxi[2]  =  0.25 * (1 + eta); dNdxi[3]  = -0.25 * (1 + eta);
    dNdeta[0] = -0.25 * (1 - xi);  dNdeta[1] = -0.25 * (1 + xi);
    dNdeta[2] =  0.25 * (1 + xi);  dNdeta[3] =  0.25 * (1 - xi);
}

static double jacobian2D(const double x[4], const double y[4],
                          const double dNdxi[4], const double dNdeta[4],
                          double Jinv[2][2]) {
    double J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (int i = 0; i < 4; i++) {
        J00 += dNdxi[i]  * x[i];
        J01 += dNdxi[i]  * y[i];
        J10 += dNdeta[i] * x[i];
        J11 += dNdeta[i] * y[i];
    }
    double detJ = J00 * J11 - J01 * J10;
    if (std::abs(detJ) < 1e-15) detJ = 1e-15;
    double inv = 1.0 / detJ;
    Jinv[0][0] =  J11 * inv;
    Jinv[0][1] = -J01 * inv;
    Jinv[1][0] = -J10 * inv;
    Jinv[1][1] =  J00 * inv;
    return detJ;
}

// Q4 plane stress estándar (sin Wilson) — equivalente a shellThin.cpp::getMembraneK_Thin
Eigen::MatrixXd membrane_K_plain(const double x[4], const double y[4],
                                   double E, double nu, double t) {
    double factor = E / (1.0 - nu * nu);
    Eigen::Matrix3d Dm;
    Dm << factor,       factor * nu, 0,
          factor * nu,  factor,      0,
          0,            0,           factor * (1 - nu) / 2.0;

    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(8, 8);
    for (int gp = 0; gp < 4; gp++) {
        double xi = GP2x2[gp][0], eta = GP2x2[gp][1];
        double N[4], dNdxi[4], dNdeta[4];
        shape_q4(xi, eta, N, dNdxi, dNdeta);
        double Jinv[2][2];
        double detJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        Eigen::MatrixXd B = Eigen::MatrixXd::Zero(3, 8);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            B(0, 2*i)     = dNdx;
            B(1, 2*i + 1) = dNdy;
            B(2, 2*i)     = dNdy;
            B(2, 2*i + 1) = dNdx;
        }
        K += (t * std::abs(detJ)) * B.transpose() * Dm * B;
    }
    return K;
}

// Wilson 1971 + Taylor 1976 — equivalente a shellQ4.cpp::getMembraneK
Eigen::MatrixXd membrane_K_wilson(const double x[4], const double y[4],
                                    double E, double nu, double t) {
    double factor = E / (1.0 - nu * nu);
    Eigen::Matrix3d Dm;
    Dm << factor,       factor * nu, 0,
          factor * nu,  factor,      0,
          0,            0,           factor * (1 - nu) / 2.0;

    // J0 evaluado en centro (ξ=η=0)
    double Jinv0[2][2];
    {
        double N0[4], dN0dxi[4], dN0deta[4];
        shape_q4(0.0, 0.0, N0, dN0dxi, dN0deta);
        jacobian2D(x, y, dN0dxi, dN0deta, Jinv0);
    }

    Eigen::MatrixXd Kuu = Eigen::MatrixXd::Zero(8, 8);
    Eigen::MatrixXd Kua = Eigen::MatrixXd::Zero(8, 4);
    Eigen::MatrixXd Kaa = Eigen::MatrixXd::Zero(4, 4);

    for (int gp = 0; gp < 4; gp++) {
        double xi = GP2x2[gp][0], eta = GP2x2[gp][1];
        double N[4], dNdxi[4], dNdeta[4];
        shape_q4(xi, eta, N, dNdxi, dNdeta);
        double Jinv[2][2];
        double detJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        // Bc 3×8 compatible
        Eigen::MatrixXd Bc = Eigen::MatrixXd::Zero(3, 8);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            Bc(0, 2*i)     = dNdx;
            Bc(1, 2*i + 1) = dNdy;
            Bc(2, 2*i)     = dNdy;
            Bc(2, 2*i + 1) = dNdx;
        }

        // Bi 3×4 incompatible (N5=1-ξ², N6=1-η², derivadas con J0)
        double dN5dxi  = -2.0 * xi,  dN5deta = 0.0;
        double dN6dxi  =  0.0,       dN6deta = -2.0 * eta;
        double dN5dx = Jinv0[0][0] * dN5dxi + Jinv0[0][1] * dN5deta;
        double dN5dy = Jinv0[1][0] * dN5dxi + Jinv0[1][1] * dN5deta;
        double dN6dx = Jinv0[0][0] * dN6dxi + Jinv0[0][1] * dN6deta;
        double dN6dy = Jinv0[1][0] * dN6dxi + Jinv0[1][1] * dN6deta;

        Eigen::MatrixXd Bi = Eigen::MatrixXd::Zero(3, 4);
        Bi(0, 0) = dN5dx;
        Bi(0, 1) = dN6dx;
        Bi(1, 2) = dN5dy;
        Bi(1, 3) = dN6dy;
        Bi(2, 0) = dN5dy;
        Bi(2, 1) = dN6dy;
        Bi(2, 2) = dN5dx;
        Bi(2, 3) = dN6dx;

        double w = t * std::abs(detJ);
        Kuu += w * Bc.transpose() * Dm * Bc;
        Kua += w * Bc.transpose() * Dm * Bi;
        Kaa += w * Bi.transpose() * Dm * Bi;
    }

    Eigen::MatrixXd KaaInv;
    if (std::abs(Kaa.determinant()) > 1e-20) {
        KaaInv = Kaa.inverse();
    } else {
        std::cerr << "Warning: Kaa singular, fallback Kuu" << std::endl;
        return Kuu;
    }
    return Kuu - Kua * KaaInv * Kua.transpose();
}

int main() {
    // Mismo Q4 unit del Python: 1m × 1m
    double x[4] = {0.0, 1.0, 1.0, 0.0};
    double y[4] = {0.0, 0.0, 1.0, 1.0};
    double E = 24.85e6;
    double nu = 0.15;
    double t = 0.10;

    std::cout << std::scientific << std::setprecision(6);
    std::cout << "======================================================================\n";
    std::cout << "Test Wilson Q4 Membrane - C++ standalone (Eigen)\n";
    std::cout << "  Q4 unit 1m x 1m, E=" << E << ", nu=" << nu << ", t=" << t << "\n";
    std::cout << "======================================================================\n\n";

    Eigen::MatrixXd K_plain  = membrane_K_plain(x, y, E, nu, t);
    Eigen::MatrixXd K_wilson = membrane_K_wilson(x, y, E, nu, t);

    std::cout << "[K_plain]   norma Frobenius = " << K_plain.norm()  << "\n";
    std::cout << "[K_wilson]  norma Frobenius = " << K_wilson.norm() << "\n";
    std::cout << "\nK_plain[0,0]   = " << K_plain(0, 0)  << "\n";
    std::cout << "K_wilson[0,0]  = " << K_wilson(0, 0) << "\n";
    std::cout << "Ratio (Wilson/Plain) [0,0] = " << K_wilson(0, 0) / K_plain(0, 0) << "\n";

    // Cantilever test (mismo del Python)
    std::cout << "\n======================================================================\n";
    std::cout << "Test cantilever (bending in-plane): empotrar nodos 0,1; F=1 horizontal en 2,3\n";
    std::cout << "======================================================================\n";

    auto solve_cantilever = [](const Eigen::MatrixXd &K, const char *label) {
        // Free DOFs: u2=4, v2=5, u3=6, v3=7
        Eigen::MatrixXd Kr(4, 4);
        int idx[4] = {4, 5, 6, 7};
        for (int i = 0; i < 4; i++)
            for (int j = 0; j < 4; j++)
                Kr(i, j) = K(idx[i], idx[j]);
        Eigen::VectorXd F(4);
        F << 0.5, 0.0, 0.5, 0.0;
        Eigen::VectorXd ur = Kr.fullPivLu().solve(F);
        double u2 = ur(0);
        std::cout << "  [" << label << "]  u_top (u2 ~= u3) = " << u2 << " m\n";
        return u2;
    };

    double u_plain  = solve_cantilever(K_plain,  "Plain Q4 ");
    double u_wilson = solve_cantilever(K_wilson, "Wilson Q4");
    std::cout << "\n  Ratio Wilson/Plain = " << u_wilson / u_plain << "\n";

    // Save to JSON
    std::ofstream out("test_wilson_cpp_result.json");
    out << std::scientific << std::setprecision(15);
    out << "{\n";
    out << "  \"input\": {\"x\": [" << x[0] << "," << x[1] << "," << x[2] << "," << x[3]
        << "], \"y\": [" << y[0] << "," << y[1] << "," << y[2] << "," << y[3]
        << "], \"E\": " << E << ", \"nu\": " << nu << ", \"t\": " << t << "},\n";
    auto dumpMat = [&](const Eigen::MatrixXd &M, const char *name, bool last) {
        out << "  \"" << name << "\": [";
        for (int i = 0; i < M.rows(); i++) {
            out << "[";
            for (int j = 0; j < M.cols(); j++) {
                out << M(i, j);
                if (j < M.cols() - 1) out << ",";
            }
            out << "]";
            if (i < M.rows() - 1) out << ",";
        }
        out << "]";
        if (!last) out << ",";
        out << "\n";
    };
    dumpMat(K_plain,  "K_plain",  false);
    dumpMat(K_wilson, "K_wilson", false);
    out << "  \"u_plain_top\":  " << u_plain  << ",\n";
    out << "  \"u_wilson_top\": " << u_wilson << "\n";
    out << "}\n";
    out.close();
    std::cout << "\nResultados guardados en test_wilson_cpp_result.json\n";
    return 0;
}
