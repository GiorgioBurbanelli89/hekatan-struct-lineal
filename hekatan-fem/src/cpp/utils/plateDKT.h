// ──────────────────────────────────────────────────────────────────────
// DKT — Discrete Kirchhoff Triangle (Batoz, Bathe & Ho 1980, IJNME 15:1771;
// forma explicita de Batoz 1982, IJNME 18:1077). Pareja triangular de la DKQ
// (Batoz & Ben Tahar 1982): el Shell-Thin de los TRIANGULOS.
//
// GDL por nudo [w, thx, thy], mano derecha como el resto del solver:
//   thx = +dw/dy, thy = -dw/dx   ->   betax = thy, betay = -thx
//   kappa = [betax,x ; betay,y ; betax,y + betay,x]
// K = ∫ Bᵀ D B dA con los 3 puntos medios de lado (exacto: B es lineal).
//
// Validado (prototipo Python, 22-sep-2026): 3 modos nulos, patch test de
// curvatura constante exacto en triangulo distorsionado, placa cuadrada
// apoyada contra Navier −4.33 / −1.31 / −0.345 / −0.087 % (n = 4..32).
// ──────────────────────────────────────────────────────────────────────
#pragma once
#include <cmath>
#include <Eigen/Dense>

inline Eigen::Matrix<double, 3, 9> dktB(const double x[3], const double y[3], double xi, double eta, double &area)
{
    const double x12 = x[0] - x[1], x23 = x[1] - x[2], x31 = x[2] - x[0];
    const double y12 = y[0] - y[1], y23 = y[1] - y[2], y31 = y[2] - y[0];
    // lados 4 = 2-3, 5 = 3-1, 6 = 1-2 (indices 0,1,2 abajo)
    const double xs[3] = {x23, x31, x12}, ys[3] = {y23, y31, y12};
    double P[3], t[3], q[3], r[3];
    for (int k = 0; k < 3; ++k)
    {
        const double l2 = xs[k] * xs[k] + ys[k] * ys[k];
        P[k] = -6.0 * xs[k] / l2; t[k] = -6.0 * ys[k] / l2;
        q[k] = 3.0 * xs[k] * ys[k] / l2; r[k] = 3.0 * ys[k] * ys[k] / l2;
    }
    const double P4 = P[0], P5 = P[1], P6 = P[2], t4 = t[0], t5 = t[1], t6 = t[2];
    const double q4 = q[0], q5 = q[1], q6 = q[2], r4 = r[0], r5 = r[1], r6 = r[2];
    const double a = 1.0 - 2.0 * xi, b = 1.0 - 2.0 * eta;

    const double Hx_x[9] = {P6 * a + (P5 - P6) * eta, q6 * a - (q5 + q6) * eta, -4 + 6 * (xi + eta) + r6 * a - eta * (r5 + r6),
                            -P6 * a + eta * (P4 + P6), q6 * a - eta * (q6 - q4), -2 + 6 * xi + r6 * a + eta * (r4 - r6),
                            -eta * (P5 + P4), eta * (q4 - q5), -eta * (r5 - r4)};
    const double Hy_x[9] = {t6 * a + eta * (t5 - t6), 1 + r6 * a - eta * (r5 + r6), -q6 * a + eta * (q5 + q6),
                            -t6 * a + eta * (t4 + t6), -1 + r6 * a + eta * (r4 - r6), -q6 * a - eta * (q4 - q6),
                            -eta * (t4 + t5), eta * (r4 - r5), -eta * (q4 - q5)};
    const double Hx_e[9] = {-P5 * b - xi * (P6 - P5), q5 * b - xi * (q5 + q6), -4 + 6 * (xi + eta) + r5 * b - xi * (r5 + r6),
                            xi * (P4 + P6), xi * (q4 - q6), -xi * (r6 - r4),
                            P5 * b - xi * (P4 + P5), q5 * b + xi * (q4 - q5), -2 + 6 * eta + r5 * b + xi * (r4 - r5)};
    const double Hy_e[9] = {-t5 * b - xi * (t6 - t5), 1 + r5 * b - xi * (r5 + r6), -q5 * b + xi * (q5 + q6),
                            xi * (t4 + t6), xi * (r4 - r6), -xi * (q4 - q6),
                            t5 * b - xi * (t4 + t5), -1 + r5 * b + xi * (r4 - r5), -q5 * b - xi * (q4 - q5)};

    const double A2 = x31 * y12 - x12 * y31;
    area = 0.5 * A2;
    Eigen::Matrix<double, 3, 9> B;
    for (int j = 0; j < 9; ++j)
    {
        B(0, j) = (y31 * Hx_x[j] + y12 * Hx_e[j]) / A2;
        B(1, j) = (-x31 * Hy_x[j] - x12 * Hy_e[j]) / A2;
        B(2, j) = (-x31 * Hx_x[j] - x12 * Hx_e[j] + y31 * Hy_x[j] + y12 * Hy_e[j]) / A2;
    }
    return B;
}

// 9x9 de flexion, GDL [w1 thx1 thy1  w2 thx2 thy2  w3 thx3 thy3]
inline Eigen::Matrix<double, 9, 9> dktK(const double x[3], const double y[3], const Eigen::Matrix3d &Db)
{
    Eigen::Matrix<double, 9, 9> K = Eigen::Matrix<double, 9, 9>::Zero();
    const double pts[3][2] = {{0.5, 0.0}, {0.5, 0.5}, {0.0, 0.5}};
    for (const auto &p : pts)
    {
        double A = 0.0;
        const Eigen::Matrix<double, 3, 9> B = dktB(x, y, p[0], p[1], A);
        K += B.transpose() * Db * B * (std::abs(A) / 3.0);
    }
    return K;
}
