#pragma once
// Dos cosas que viajan por la lista de muelles [nudo, gdl, k] con NUDO NEGATIVO
// (= -(indice de elemento + 1)), para no cambiar la firma de deform()/modal():
//
//   gdl = -1 : MUELLE DE AREA CONSISTENTE (el Winkler de SAFE): k = ks (kN/m3).
//              K += ks * INT N^T N dA sobre la normal de la cascara, Gauss 2x2 con
//              jacobiano real (T3: A/12 [2 1 1; 1 2 1; 1 1 2]). SAP2000 y ETABS
//              reparten el muelle de area a los nudos por area tributaria (medido
//              8-sep-2026, 0.0000 % contra muelles nodales); SAFE lo mete asi,
//              consistente, y con carga puntual difiere ~2 % (medido 20-ago-2026).
//   gdl = -2 : NUDO COLGADO en la arista de una cascara (el edge constraint de
//              ETABS con OBJMESHTYPE "NONE"): k = indice del nudo colgado. Medido
//              en ETABS 22 (validation/isse/edge_none): w del nudo = cubica de
//              HERMITE con w y el giro sobre la arista de los dos extremos (0.11 %),
//              in-plano y giros lineales. Se impone por PENALIZACION: K += a C^T C
//              con a = 1e6 * max diagonal de los GDL implicados (por tipo).
//   gdl = -4 : NUDO COLGADO con interpolacion LINEAL en los 6 GDL (`edge lineal`): el AUTO EDGE
//              CONSTRAINT de SAFE / SAP2000 (sus `@LC`, Line Constraint). Medido en el f2k del radier
//              MOD_002 (SAFE 22.6): la carga de un punto a t = 0.189 de su arista llega 0.8108/0.1892
//              a los extremos (lineal; Hermite daria 0.906). Tolerancia de "esta en la arista" 1e-4*L:
//              SAFE escribe los nudos de su malla con ~1e-6 m de ruido fuera de la recta.
#include <Eigen/Sparse>
#include <array>
#include <cmath>
#include <vector>

namespace springsExtra {

using Node = std::vector<double>;

inline void nodosDeElemento(const std::vector<unsigned int> &idx, const std::vector<unsigned int> &sizes,
                            int e, std::vector<int> &out) {
    out.clear();
    if (e < 0 || e >= (int)sizes.size()) return;
    size_t off = 0;
    for (int i = 0; i < e; ++i) off += sizes[i];
    for (unsigned int k = 0; k < sizes[e]; ++k) out.push_back((int)idx[off + k]);
}

inline std::array<double, 3> normalDe(const std::vector<Node> &nodes, const std::vector<int> &en) {
    const Node &a = nodes[en[0]], &b = nodes[en[1]], &c = nodes[en[2]];
    const Node &d = en.size() == 4 ? nodes[en[3]] : nodes[en[0]];
    // diagonales (Q4) o lados (T3)
    const double u[3] = { c[0] - a[0], c[1] - a[1], c[2] - a[2] };
    const double v[3] = { en.size() == 4 ? d[0] - b[0] : b[0] - a[0],
                          en.size() == 4 ? d[1] - b[1] : b[1] - a[1],
                          en.size() == 4 ? d[2] - b[2] : b[2] - a[2] };
    std::array<double, 3> n = { u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0] };
    const double m = std::sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]);
    if (m > 1e-30) for (auto &q : n) q /= m;
    return n;
}

/** ks * INT N^T N dA sobre la direccion normal. */
inline void addAreaSpringConsistent(Eigen::SparseMatrix<double> &K, const std::vector<Node> &nodes,
                                    const std::vector<int> &en, double ks) {
    const int nn = (int)en.size();
    if ((nn != 3 && nn != 4) || ks == 0.0) return;
    const std::array<double, 3> n = normalDe(nodes, en);
    // matriz de masa "unitaria" INT N_i N_j dA
    double S[4][4] = { { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 }, { 0, 0, 0, 0 } };
    if (nn == 3) {
        const Node &a = nodes[en[0]], &b = nodes[en[1]], &c = nodes[en[2]];
        const double u[3] = { b[0] - a[0], b[1] - a[1], b[2] - a[2] }, v[3] = { c[0] - a[0], c[1] - a[1], c[2] - a[2] };
        const double cr[3] = { u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0] };
        const double A = 0.5 * std::sqrt(cr[0] * cr[0] + cr[1] * cr[1] + cr[2] * cr[2]);
        for (int i = 0; i < 3; ++i) for (int j = 0; j < 3; ++j) S[i][j] = (A / 12.0) * (i == j ? 2.0 : 1.0);
    } else {
        static const double g = 0.5773502691896258;
        const double gp[2] = { -g, g };
        for (int a = 0; a < 2; ++a) for (int b = 0; b < 2; ++b) {
            const double r = gp[a], s = gp[b];
            const double N[4] = { 0.25 * (1 - r) * (1 - s), 0.25 * (1 + r) * (1 - s), 0.25 * (1 + r) * (1 + s), 0.25 * (1 - r) * (1 + s) };
            const double dNr[4] = { -0.25 * (1 - s), 0.25 * (1 - s), 0.25 * (1 + s), -0.25 * (1 + s) };
            const double dNs[4] = { -0.25 * (1 - r), -0.25 * (1 + r), 0.25 * (1 + r), 0.25 * (1 - r) };
            double xr[3] = { 0, 0, 0 }, xs[3] = { 0, 0, 0 };
            for (int i = 0; i < 4; ++i) for (int d = 0; d < 3; ++d) { xr[d] += dNr[i] * nodes[en[i]][d]; xs[d] += dNs[i] * nodes[en[i]][d]; }
            const double cr[3] = { xr[1] * xs[2] - xr[2] * xs[1], xr[2] * xs[0] - xr[0] * xs[2], xr[0] * xs[1] - xr[1] * xs[0] };
            const double dJ = std::sqrt(cr[0] * cr[0] + cr[1] * cr[1] + cr[2] * cr[2]);   // |dx/dr x dx/ds|, valido en 3D
            for (int i = 0; i < 4; ++i) for (int j = 0; j < 4; ++j) S[i][j] += N[i] * N[j] * dJ;
        }
    }
    for (int i = 0; i < nn; ++i) for (int j = 0; j < nn; ++j) {
        const double kij = ks * S[i][j];
        for (int p = 0; p < 3; ++p) for (int q = 0; q < 3; ++q) {
            const double v = kij * n[p] * n[q];
            if (v != 0.0) K.coeffRef(6 * en[i] + p, 6 * en[j] + q) += v;
        }
    }
}

/** Muelle de area repartido a los nudos por INT N_i dA (lo de SAP2000/ETABS), por si se pide "nodal". */
inline void addAreaSpringLumped(Eigen::SparseMatrix<double> &K, const std::vector<Node> &nodes,
                                const std::vector<int> &en, double ks) {
    const int nn = (int)en.size();
    if ((nn != 3 && nn != 4) || ks == 0.0) return;
    const std::array<double, 3> n = normalDe(nodes, en);
    double w[4] = { 0, 0, 0, 0 };
    if (nn == 3) {
        const Node &a = nodes[en[0]], &b = nodes[en[1]], &c = nodes[en[2]];
        const double u[3] = { b[0] - a[0], b[1] - a[1], b[2] - a[2] }, v[3] = { c[0] - a[0], c[1] - a[1], c[2] - a[2] };
        const double cr[3] = { u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0] };
        const double A = 0.5 * std::sqrt(cr[0] * cr[0] + cr[1] * cr[1] + cr[2] * cr[2]);
        w[0] = w[1] = w[2] = A / 3.0;
    } else {
        static const double g = 0.5773502691896258;
        const double gp[2] = { -g, g };
        for (int a = 0; a < 2; ++a) for (int b = 0; b < 2; ++b) {
            const double r = gp[a], s = gp[b];
            const double N[4] = { 0.25 * (1 - r) * (1 - s), 0.25 * (1 + r) * (1 - s), 0.25 * (1 + r) * (1 + s), 0.25 * (1 - r) * (1 + s) };
            const double dNr[4] = { -0.25 * (1 - s), 0.25 * (1 - s), 0.25 * (1 + s), -0.25 * (1 + s) };
            const double dNs[4] = { -0.25 * (1 - r), -0.25 * (1 + r), 0.25 * (1 + r), 0.25 * (1 - r) };
            double xr[3] = { 0, 0, 0 }, xs[3] = { 0, 0, 0 };
            for (int i = 0; i < 4; ++i) for (int d = 0; d < 3; ++d) { xr[d] += dNr[i] * nodes[en[i]][d]; xs[d] += dNs[i] * nodes[en[i]][d]; }
            const double cr[3] = { xr[1] * xs[2] - xr[2] * xs[1], xr[2] * xs[0] - xr[0] * xs[2], xr[0] * xs[1] - xr[1] * xs[0] };
            const double dJ = std::sqrt(cr[0] * cr[0] + cr[1] * cr[1] + cr[2] * cr[2]);
            for (int i = 0; i < 4; ++i) w[i] += N[i] * dJ;
        }
    }
    for (int i = 0; i < nn; ++i) for (int p = 0; p < 3; ++p) for (int q = 0; q < 3; ++q) {
        const double v = ks * w[i] * n[p] * n[q];
        if (v != 0.0) K.coeffRef(6 * en[i] + p, 6 * en[i] + q) += v;
    }
}

/**
 * Nudo colgado h sobre una arista (i,j) de la cascara en: 6 restricciones
 *   traslacion en el plano (s, m) y giros: lineales en t = |h-i|/L
 *   w (normal): Hermite  w_h = H1 w_i + H2 L (th_i . m) + H3 w_j + H4 L (th_j . m),  m = s x n
 * Devuelve false si h no esta sobre ninguna arista de en (con tolerancia).
 */
inline bool addHangingNodeConstraint(Eigen::SparseMatrix<double> &K, const std::vector<Node> &nodes,
                                     const std::vector<int> &en, int h, int numNodes, bool lineal = false,
                                     double escala = 0.0) {
    const int nn = (int)en.size();
    if ((nn != 3 && nn != 4) || h < 0 || h >= numNodes) return false;
    const std::array<double, 3> n = normalDe(nodes, en);
    const Node &P = nodes[h];
    int ia = -1, ib = -1; double t = 0.0, L = 0.0; std::array<double, 3> s = { 0, 0, 0 };
    for (int k = 0; k < nn; ++k) {
        const int i = en[k], j = en[(k + 1) % nn];
        const Node &A = nodes[i], &B = nodes[j];
        const double d[3] = { B[0] - A[0], B[1] - A[1], B[2] - A[2] };
        const double Lk = std::sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
        if (Lk < 1e-12) continue;
        const double p[3] = { P[0] - A[0], P[1] - A[1], P[2] - A[2] };
        const double tk = (p[0] * d[0] + p[1] * d[1] + p[2] * d[2]) / (Lk * Lk);
        if (tk <= 1e-6 || tk >= 1 - 1e-6) continue;
        const double q[3] = { p[0] - tk * d[0], p[1] - tk * d[1], p[2] - tk * d[2] };
        if (std::sqrt(q[0] * q[0] + q[1] * q[1] + q[2] * q[2]) > (lineal ? 1e-4 : 1e-6) * Lk) continue;
        ia = i; ib = j; t = tk; L = Lk; s = { d[0] / Lk, d[1] / Lk, d[2] / Lk };
        break;
    }
    if (ia < 0) return false;
    const std::array<double, 3> m = { s[1] * n[2] - s[2] * n[1], s[2] * n[0] - s[0] * n[2], s[0] * n[1] - s[1] * n[0] };
    // `edge lineal` (gdl -4): la flecha tambien lineal, sin los giros de los extremos
    const double H1 = lineal ? 1 - t : 1 - 3 * t * t + 2 * t * t * t, H2 = lineal ? 0.0 : (t - 2 * t * t + t * t * t) * L;
    const double H3 = lineal ? t : 3 * t * t - 2 * t * t * t,        H4 = lineal ? 0.0 : (-t * t + t * t * t) * L;
    // penalizacion por tipo de GDL: traslacion y giro, con la diagonal de K
    double kT = 0.0, kR = 0.0;
    for (int nd : { h, ia, ib }) for (int p = 0; p < 3; ++p) {
        kT = std::max(kT, std::abs(K.coeff(6 * nd + p, 6 * nd + p)));
        kR = std::max(kR, std::abs(K.coeff(6 * nd + 3 + p, 6 * nd + 3 + p)));
    }
    if (kT <= 0.0) kT = 1.0;
    if (kR <= 0.0) kR = kT * L * L;
    // `escala` > 0: penalizacion FIJA = 1e6 * max|diag K| antes de atar ningun nudo (como el Python).
    // Con la diagonal LOCAL, un nudo colgado de otro colgado (624 -> ~202 -> arista, en el radier
    // MOD_002) leia la diagonal ya penalizada y la penalizacion crecia 1e6 por eslabon: la LDLT
    // fallaba y la LU devolvia basura (reaccion -77 %).
    const double aT = 1e6 * (escala > 0 ? escala : kT), aR = 1e6 * (escala > 0 ? escala : kR);
    // cada restriccion: fila C (indice gdl -> coeficiente); K += a * C^T C
    std::vector<std::pair<int, double>> C;
    auto aplicar = [&](double a) {
        for (const auto &p : C) for (const auto &q : C) K.coeffRef(p.first, q.first) += a * p.second * q.second;
        C.clear();
    };
    // traslacion a lo largo de s y de m: lineal
    for (const std::array<double, 3> &dir : { s, m }) {
        for (int p = 0; p < 3; ++p) if (dir[p] != 0.0) {
            C.push_back({ 6 * h + p, dir[p] });
            C.push_back({ 6 * ia + p, -(1 - t) * dir[p] });
            C.push_back({ 6 * ib + p, -t * dir[p] });
        }
        aplicar(aT);
    }
    // w normal: Hermite con el giro sobre m
    for (int p = 0; p < 3; ++p) if (n[p] != 0.0) {
        C.push_back({ 6 * h + p, n[p] });
        C.push_back({ 6 * ia + p, -H1 * n[p] });
        C.push_back({ 6 * ib + p, -H3 * n[p] });
    }
    for (int p = 0; p < 3; ++p) if (m[p] != 0.0) {
        C.push_back({ 6 * ia + 3 + p, -H2 * m[p] });
        C.push_back({ 6 * ib + 3 + p, -H4 * m[p] });
    }
    aplicar(aT);
    // giros: lineales (los tres)
    for (int p = 0; p < 3; ++p) {
        C.push_back({ 6 * h + 3 + p, 1.0 });
        C.push_back({ 6 * ia + 3 + p, -(1 - t) });
        C.push_back({ 6 * ib + 3 + p, -t });
        aplicar(aR);
    }
    return true;
}

/** Registros de nudo colgado (-2/-4) que se aplican AL FINAL, con una sola escala de penalizacion. */
struct Colgado { int elem; int h; bool lineal; };

/** Despacha un registro de la lista de muelles. Devuelve true si lo consumio (nudo negativo).
 *  Con `pendientes`, los nudos colgados no se aplican aqui: se guardan para aplicarColgados(). */
inline bool despacharMuelleExtra(Eigen::SparseMatrix<double> &K, const std::vector<Node> &nodes,
                                 const std::vector<unsigned int> &idx, const std::vector<unsigned int> &sizes,
                                 int nodo, int d, double k, std::vector<Colgado> *pendientes = nullptr) {
    if (nodo >= 0) return false;
    if (pendientes && (d == -2 || d == -4)) { pendientes->push_back({ -nodo - 1, (int)std::llround(k), d == -4 }); return true; }
    std::vector<int> en;
    nodosDeElemento(idx, sizes, -nodo - 1, en);
    if (en.empty()) return true;
    if (d == -1) addAreaSpringConsistent(K, nodes, en, k);
    else if (d == -3) addAreaSpringLumped(K, nodes, en, k);
    else if (d == -2) addHangingNodeConstraint(K, nodes, en, (int)std::llround(k), (int)nodes.size());
    else if (d == -4) addHangingNodeConstraint(K, nodes, en, (int)std::llround(k), (int)nodes.size(), true);
    return true;
}

/** Aplica los nudos colgados guardados con penalizacion 1e6 * max|diag K| (K SIN penalizar), igual que
 *  `solver.py` del motor de Python. */
inline void aplicarColgados(Eigen::SparseMatrix<double> &K, const std::vector<Node> &nodes,
                            const std::vector<unsigned int> &idx, const std::vector<unsigned int> &sizes,
                            const std::vector<Colgado> &pendientes) {
    if (pendientes.empty()) return;
    double escala = 0.0;
    for (int i = 0; i < K.rows(); ++i) escala = std::max(escala, std::abs(K.coeff(i, i)));
    if (escala <= 0.0) escala = 1.0;
    std::vector<int> en;
    for (const Colgado &c : pendientes) {
        nodosDeElemento(idx, sizes, c.elem, en);
        if (!en.empty()) addHangingNodeConstraint(K, nodes, en, c.h, (int)nodes.size(), c.lineal, escala);
    }
}

} // namespace springsExtra
