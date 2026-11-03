// =============================================================================
// test_wilson_csi — DKE / DSE de Wilson (cap. 8) y Shell-Thick de CSI en C++
// (utils/plateWilsonCSI.h) contra sus referencias de Python y contra los libros/programas.
//
//   1. python test_wilson_csi_ref.py              -> test_wilson_csi_ref.txt
//   2. bash build_test_wilson_csi.sh              -> test_wilson_csi.exe
//   3. test_wilson_csi.exe                        -> tabla; escribe test_wilson_csi_k22.txt
//   4. python test_wilson_csi_ref.py --check      -> K 22x22 del C++ vs volcado del kernel de ETABS 19
//
// Que mide (todo con el C++ de plateWilsonCSI.h):
//   A. K 12x12 C++ vs Python (placas_wilson.k_dke / k_dse, k_grueso_cuad) en cuadrado, rectangulo,
//      trapecio y la viga de la Tabla 8.1, 3 materiales, con y sin modificadores. Limite 1e-10.
//   B. K 22x22 de CSI antes de condensar vs Python (geometrias del kernel).
//   C. Las 142 celdas MEDIDAS de SAP2000/ETABS (verificar.py): % del error como verificar.err.
//   D. Tablas 8.1, 8.2, 8.3, 8.4, 8.6 del libro, resueltas en C++, vs el Python y vs el libro.
//   E. Enrutado en getLocalStiffnessMatrixShellQ4: plateFormulations 6/7/8 meten ESTA flexion y
//      nada mas cambia. Y dos identidades MEDIDAS que se vigilan: Thin (DKQ, pf 1) = DKE de Wilson, y
//      pf 4 (getBendingK_DSE_FULL) = DSE de Wilson con la inversa CORRECTA de (8.8) (la (8.9) impresa
//      en el libro es la traspuesta; ver plateWilsonCSI.h).
// Sale con codigo 1 si algo de A, B, C, D (C++ = Python) o E (enrutado) se pasa.
// =============================================================================
#include <cstdio>
#include <cmath>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <map>
#include <set>
#include <functional>
#include <array>
#include "data-model.h"
#include "utils/plateWilsonCSI.h"
#include "utils/plateDKQ.h"

Eigen::MatrixXd getLocalStiffnessMatrixShellQ4(const std::vector<Node> &nodes, const ElementInputs &ei, int index);
Eigen::MatrixXd getLocalStiffnessMatrixShellThin(const std::vector<Node> &nodes, const ElementInputs &ei, int index);

using Eigen::MatrixXd;
using Eigen::VectorXd;
using namespace hkplaca;

static int fallos = 0;
static void ok(bool c, const char *que) { if (!c) { fallos++; std::printf("   ** FALLA: %s\n", que); } }

static double relF(const MatrixXd &A, const MatrixXd &B) { return (A - B).norm() / B.norm(); }

static MatrixXd leeMat(std::istringstream &ss, int n)
{
    MatrixXd M(n, n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) ss >> M(i, j);
    return M;
}

// ── momentos [Mxx Myy Mxy] en los 4 nudos (Gauss 2x2 extrapolado), port de placas_wilson.momentos ──
static MatrixXd momentosNudos(const std::string &tipo, const double x[4], const double y[4],
                              double E, double nu, double h, const VectorXd &u12)
{
    Eigen::Matrix3d Db; Eigen::Matrix2d Ds; matricesD(E, nu, h, nullptr, Db, Ds);
    wilson::Lado ld[4]; wilson::lados(x, y, ld);
    std::function<Eigen::Matrix<double, 3, 16>(double, double)> Bfun;
    VectorXd u(16); u.setZero(); u.head(12) = u12;
    Eigen::Matrix<double, 3, 4> b12m = Eigen::Matrix<double, 3, 4>::Zero();
    if (tipo == "dke") {
        const Eigen::Matrix<double, 4, 12> T = wilson::restriccionDKE(ld);
        u.tail(4) = T * u12;
        Bfun = [=](double r, double s) { double N[4], dj; return wilson::curvaturas16(r, s, x, y, ld, N, dj); };
    } else {
        const MatrixXd K = wilson::kDSE16_D(x, y, Db, Ds);
        u.tail(4) = -K.block(12, 12, 4, 4).partialPivLu().solve(K.block(12, 0, 4, 12) * u12);
        double A = 0.0;
        for (int g = 0; g < 4; g++) {
            double N[4], dj;
            auto b = wilson::curvaturas16(wilson::GAUSS4[g][0], wilson::GAUSS4[g][1], x, y, ld, N, dj);
            b12m += b.rightCols<4>() * dj; A += dj;
        }
        b12m /= A;
        Bfun = [=](double r, double s) {
            double N[4], dj; auto b = wilson::curvaturas16(r, s, x, y, ld, N, dj);
            b.rightCols<4>() -= b12m; return b;
        };
    }
    Eigen::Vector3d Mg[4];
    for (int g = 0; g < 4; g++) Mg[g] = Db * Bfun(wilson::GAUSS4[g][0], wilson::GAUSS4[g][1]) * u;
    MatrixXd out(4, 3);
    const double s3 = std::sqrt(3.0);
    const double esq[4][2] = {{-1, -1}, {1, -1}, {1, 1}, {-1, 1}};
    for (int c = 0; c < 4; c++) {
        Eigen::Vector3d m = Eigen::Vector3d::Zero();
        for (int g = 0; g < 4; g++) {
            const double sr = (wilson::GAUSS4[g][0] > 0) ? 1 : -1, sg = (wilson::GAUSS4[g][1] > 0) ? 1 : -1;
            m += 0.25 * (1 + s3 * esq[c][0] * sr) * (1 + s3 * esq[c][1] * sg) * Mg[g];
        }
        out.row(c) = m.transpose();
    }
    return out;
}

static MatrixXd rigidez(const std::string &tipo, const double x[4], const double y[4], double E, double nu, double h)
{
    return tipo == "dke" ? kWilsonDKE(x, y, E, nu, h) : kWilsonDSE(x, y, E, nu, h);
}

static bool g_lu = false;   // true: resuelve con LU parcial en vez de LDLT (mide el redondeo del sistema)
static VectorXd resolverLibres(const MatrixXd &K, const VectorXd &F, const std::set<int> &fij)
{
    std::vector<int> lib;
    for (int i = 0; i < (int)K.rows(); i++) if (!fij.count(i)) lib.push_back(i);
    MatrixXd Kl((int)lib.size(), (int)lib.size()); VectorXd Fl((int)lib.size());
    for (size_t a = 0; a < lib.size(); a++) { Fl(a) = F(lib[a]); for (size_t b = 0; b < lib.size(); b++) Kl(a, b) = K(lib[a], lib[b]); }
    const VectorXd ul = g_lu ? VectorXd(Kl.partialPivLu().solve(Fl)) : VectorXd(Kl.ldlt().solve(Fl));
    VectorXd u = VectorXd::Zero(K.rows());
    for (size_t a = 0; a < lib.size(); a++) u(lib[a]) = ul(a);
    return u;
}

// §8.9.2-8.9.3: cuarto de placa 10x10 apoyada (borde duro), E 10.92, nu 0.3  (cuadrante_placa_cuadrada)
static void cuadrante(const std::string &tipo, double h, int n, bool puntual, double &wh3, double &Mc)
{
    const double a = 5.0, E = 10.92, nu = 0.3;
    const int nn = n + 1;
    std::vector<double> X(nn * nn), Y(nn * nn);
    for (int j = 0; j < nn; j++) for (int i = 0; i < nn; i++) { X[j * nn + i] = a * i / n; Y[j * nn + i] = a * j / n; }
    std::vector<std::array<int, 4>> els;
    for (int j = 0; j < n; j++) for (int i = 0; i < n; i++)
        els.push_back({j * nn + i, j * nn + i + 1, (j + 1) * nn + i + 1, (j + 1) * nn + i});
    const int N = 3 * nn * nn;
    MatrixXd K = MatrixXd::Zero(N, N); VectorXd F = VectorXd::Zero(N);
    for (auto &e : els) {
        double x[4], y[4];
        for (int k = 0; k < 4; k++) { x[k] = X[e[k]]; y[k] = Y[e[k]]; }
        const MatrixXd Ke = rigidez(tipo, x, y, E, nu, h);
        for (int p = 0; p < 4; p++) for (int q = 0; q < 4; q++)
            for (int c = 0; c < 3; c++) for (int d = 0; d < 3; d++) K(3 * e[p] + c, 3 * e[q] + d) += Ke(3 * p + c, 3 * q + d);
        if (!puntual) { const double A = (a / n) * (a / n); for (int k = 0; k < 4; k++) F(3 * e[k]) += A / 4; }
    }
    const int c = n * nn + n;
    if (puntual) F(3 * c) = 0.25;
    std::set<int> fij;
    for (int k = 0; k < nn * nn; k++) {
        if (X[k] < 1e-9) { fij.insert(3 * k); fij.insert(3 * k + 1); }
        if (Y[k] < 1e-9) { fij.insert(3 * k); fij.insert(3 * k + 2); }
        if (std::abs(X[k] - a) < 1e-9) fij.insert(3 * k + 2);
        if (std::abs(Y[k] - a) < 1e-9) fij.insert(3 * k + 1);
    }
    const VectorXd u = resolverLibres(K, F, fij);
    for (auto &e : els) {
        int pos = -1; for (int k = 0; k < 4; k++) if (e[k] == c) pos = k;
        if (pos < 0) continue;
        double x[4], y[4]; VectorXd ue(12);
        for (int k = 0; k < 4; k++) { x[k] = X[e[k]]; y[k] = Y[e[k]]; for (int cc = 0; cc < 3; cc++) ue(3 * k + cc) = u(3 * e[k] + cc); }
        Mc = momentosNudos(tipo, x, y, E, nu, h, ue)(pos, 0);
        break;
    }
    wh3 = u(3 * c) * h * h * h;
}

// Tabla 8.1 (Fig. 8.5): UN elemento 6 x 0.2, h 2, E 1e7, G 3.846e6, flexion con nu = 0  (07_viga_un_elemento_wilson)
static void tabla81(const std::string &tipo, double &w, double &M)
{
    const double L = 6.0, B = 0.2, H = 2.0, E = 1e7, G = 3.846e6;
    const double x[4] = {0, L, L, 0}, y[4] = {0, 0, B, B};
    Eigen::Matrix3d Db; Db << 1, 0, 0, 0, 1, 0, 0, 0, 0.5; Db *= E * H * H * H / 12.0;
    Eigen::Matrix2d Ds = Eigen::Matrix2d::Identity() * (5.0 / 6.0) * G * H;
    const MatrixXd K = (tipo == "dke") ? wilson::kDKE_D(x, y, Db) : wilson::kDSE_D(x, y, Db, Ds);
    VectorXd F = VectorXd::Zero(12); F(3) = F(6) = 0.5;
    std::set<int> fij = {0, 1, 2, 9, 10, 11};
    const VectorXd u = resolverLibres(K, F, fij);
    const VectorXd R = K * u;
    w = u(3); M = R(2) + R(11);
}

// Tabla 8.6 (Fig. 8.7): torsion, 6 x 0.2 x 0.1, E 1e7, nu 0.3, T = 1   (07_viga_un_elemento_wilson.torsion)
static double torsion(const std::string &tipo, int nx, int ny, bool giroYFijo)
{
    const double L = 6.0, b = 0.2, h = 0.1, E = 1e7, nu = 0.3;
    const int nX = nx + 1, nY = ny + 1, N = 3 * nX * nY;
    auto idx = [&](int i, int j) { return j * nX + i; };
    MatrixXd K = MatrixXd::Zero(N, N); VectorXd F = VectorXd::Zero(N);
    for (int j = 0; j < ny; j++) for (int i = 0; i < nx; i++) {
        const int e[4] = {idx(i, j), idx(i + 1, j), idx(i + 1, j + 1), idx(i, j + 1)};
        double x[4], y[4];
        for (int k = 0; k < 4; k++) { x[k] = L * ((e[k] % nX)) / nx; y[k] = b * (e[k] / nX) / ny; }
        const MatrixXd Ke = rigidez(tipo, x, y, E, nu, h);
        for (int p = 0; p < 4; p++) for (int q = 0; q < 4; q++)
            for (int c = 0; c < 3; c++) for (int d = 0; d < 3; d++) K(3 * e[p] + c, 3 * e[q] + d) += Ke(3 * p + c, 3 * q + d);
    }
    for (int j = 0; j < nY; j++) F(3 * idx(nx, j) + 1) += 1.0 / nY;
    std::set<int> fij;
    for (int j = 0; j < nY; j++) for (int i = 0; i < nX; i++) {
        const int k = idx(i, j);
        if (i == 0) { fij.insert(3 * k); fij.insert(3 * k + 1); fij.insert(3 * k + 2); }
        if (giroYFijo) fij.insert(3 * k + 2);
    }
    const VectorXd u = resolverLibres(K, F, fij);
    double s = 0; for (int j = 0; j < nY; j++) s += u(3 * idx(nx, j) + 1);
    return s / nY;
}

// coordenadas locales que usa getLocalStiffnessMatrixShellQ4 (centro + localX = v01 + v32)
static void localQ4(const std::vector<Node> &nd, double x[4], double y[4])
{
    Eigen::Vector3d p[4];
    for (int i = 0; i < 4; i++) p[i] = Eigen::Vector3d(nd[i][0], nd[i][1], nd[i][2]);
    Eigen::Vector3d lx = (p[1] - p[0]) + (p[2] - p[3]); lx.normalize();
    Eigen::Vector3d lz = (p[2] - p[0]).cross(p[3] - p[1]); lz.normalize();
    Eigen::Vector3d ly = lz.cross(lx); ly.normalize(); lx = ly.cross(lz); lx.normalize();
    const Eigen::Vector3d c = 0.25 * (p[0] + p[1] + p[2] + p[3]);
    for (int i = 0; i < 4; i++) { x[i] = (p[i] - c).dot(lx); y[i] = (p[i] - c).dot(ly); }
}

static MatrixXd bloqueFlexion(const MatrixXd &K24)
{
    MatrixXd Kb(12, 12);
    for (int a = 0; a < 4; a++) for (int b = 0; b < 4; b++)
        for (int c = 0; c < 3; c++) for (int d = 0; d < 3; d++) Kb(3 * a + c, 3 * b + d) = K24(6 * a + 2 + c, 6 * b + 2 + d);
    return Kb;
}

static double relEig(const MatrixXd &A, const MatrixXd &B)
{
    Eigen::SelfAdjointEigenSolver<MatrixXd> ea(0.5 * (A + A.transpose())), eb(0.5 * (B + B.transpose()));
    return (ea.eigenvalues() - eb.eigenvalues()).cwiseAbs().maxCoeff() / eb.eigenvalues().cwiseAbs().maxCoeff();
}

int main(int argc, char **argv)
{
    const std::string dir = (argc > 1) ? argv[1] : ".";
    std::ifstream f(dir + "/test_wilson_csi_ref.txt");
    if (!f) { std::printf("no encuentro %s/test_wilson_csi_ref.txt (python test_wilson_csi_ref.py)\n", dir.c_str()); return 2; }
    std::map<std::string, double> T;
    std::map<std::string, double> peorK;
    double peorQ = 0, peorMpy = 0, peorMmed = 0, peorArt = 0; std::string celdaPeor;
    int nK = 0, nM = 0;
    std::ofstream k22out(dir + "/test_wilson_csi_k22.txt");
    k22out.precision(17);
    std::string ln;
    while (std::getline(f, ln)) {
        std::istringstream ss(ln); std::string tag; ss >> tag;
        if (tag == "T") { std::string k; double v; ss >> k >> v; T[k] = v; continue; }
        if (tag == "K") {
            std::string tipo, g; double E, nu, t; int hm; ss >> tipo >> g >> E >> nu >> t >> hm;
            double mod[8]; for (int i = 0; i < 8 && hm; i++) ss >> mod[i];
            double x[4], y[4]; for (int i = 0; i < 4; i++) ss >> x[i] >> y[i];
            const MatrixXd Kp = leeMat(ss, 12);
            const double *m = hm ? mod : nullptr;
            const MatrixXd Kc = (tipo == "dke") ? kWilsonDKE(x, y, E, nu, t, m)
                              : (tipo == "dse") ? kWilsonDSE(x, y, E, nu, t, m) : kShellThickCSI(x, y, E, nu, t, m);
            const std::string key = tipo + " " + g;
            peorK[key] = std::max(peorK[key], relF(Kc, Kp)); nK++;
            continue;
        }
        if (tag == "Q") {
            std::string g; double E, nu, t; ss >> g >> E >> nu >> t;
            double x[4], y[4]; for (int i = 0; i < 4; i++) ss >> x[i] >> y[i];
            const MatrixXd Kp = leeMat(ss, 22);
            const MatrixXd Kc = csi::k22(x, y, E, nu, t);
            peorQ = std::max(peorQ, relF(Kc, Kp));
            k22out << g; for (int i = 0; i < 22; i++) for (int j = 0; j < 22; j++) k22out << " " << Kc(i, j); k22out << "\n";
            continue;
        }
        if (tag == "M") {
            std::string nm; int art; double E, nu, t; int hm; ss >> nm >> art >> E >> nu >> t >> hm;
            double mod[8]; for (int i = 0; i < 8 && hm; i++) ss >> mod[i];
            double x[4], y[4]; for (int i = 0; i < 4; i++) ss >> x[i] >> y[i];
            double nref; ss >> nref;
            const MatrixXd Km = leeMat(ss, 12), Kp = leeMat(ss, 12);
            const MatrixXd Kc = kShellThickCSI(x, y, E, nu, t, hm ? mod : nullptr);
            const double eMed = 100.0 * (Kc - Km).norm() / nref, ePy = (Kc - Kp).norm() / nref;
            if (art) peorArt = std::max(peorArt, eMed);
            else if (eMed > peorMmed) { peorMmed = eMed; celdaPeor = nm; }
            peorMpy = std::max(peorMpy, ePy);
            nM++;
        }
    }
    std::printf("A. K 12x12 C++ vs Python (%d matrices, ||dK||/||K||)\n", nK);
    for (auto &kv : peorK) { std::printf("   %-22s %.2e\n", kv.first.c_str(), kv.second); ok(kv.second < 1e-10, kv.first.c_str()); }
    std::printf("B. K 22x22 CSI antes de condensar, C++ vs Python: %.2e\n", peorQ); ok(peorQ < 1e-12, "k22");
    std::printf("C. %d celdas medidas de SAP2000/ETABS: C++ vs medida peor %.2e %% (%s); C++ vs Python %.2e;"
                " artefacto solo_m11/m22 %.3f %%\n", nM, peorMmed, celdaPeor.c_str(), peorMpy, peorArt);
    ok(peorMmed < 1e-9, "celdas CSI"); ok(peorMpy < 1e-10, "celdas CSI vs Python");

    // ── D. tablas del libro ──
    std::printf("D. Tablas del libro (C++ | Python | libro)\n");
    // disp = |LDLT - LU| / |valor| del MISMO C++: el redondeo que mete resolver el sistema. Con la DSE muy
    // delgada (h <= 0.001) la K global esta muy mal condicionada (cortante/flexion ~ (L/h)^2) y C++ y Python
    // solo pueden coincidir hasta ese redondeo: se exige |C++ - Py| <= max(1e-9, 100 disp).
    auto cmp = [&](const char *k, double c, double libro, double disp = 0.0) {
        const double p = T[k], e = std::abs(c - p) / std::abs(p);
        std::printf("   %-24s %.10g | %.10g | %s  (C++/Py %.1e, redondeo LDLT/LU %.1e)\n", k, c, p,
                    libro > 0 ? std::to_string(libro).c_str() : "-", e, disp);
        ok(e < std::max(1e-9, 100.0 * disp), k);
    };
    double w, M;
    tabla81("dke", w, M); cmp("t81_w_dke", w, 0.0000540); cmp("t81_M_dke", M, 6.0);
    tabla81("dse", w, M); cmp("t81_w_dse", w, 0.0000587); cmp("t81_M_dse", M, 6.0);
    struct Tb { const char *tab; int n; bool punt; std::vector<double> hs; };
    const std::map<std::string, std::pair<double, double>> libro = {
        {"t82_h1", {1.195, 1.383}}, {"t82_h0.1", {1.195, 1.219}}, {"t82_h0.01", {1.195, 1.218}}, {"t82_h0.001", {1.195, 1.218}},
        {"t82_h0.0001", {1.195, 1.218}}, {"t83_h1", {1.163, 1.393}}, {"t83_h0.01", {1.163, 1.164}}, {"t83_h0.0001", {1.163, 1.164}}};
    for (const Tb &tb : {Tb{"t82", 4, true, {1, .1, .01, .001, .0001}}, Tb{"t83", 16, true, {1, .01, .0001}},
                         Tb{"t84", 16, false, {1, .01, .0001}}}) {
        for (double h : tb.hs) {
            char hk[32]; std::snprintf(hk, sizeof hk, "%s_h%g", tb.tab, h);
            auto it = libro.find(hk);
            for (const char *tipo : {"dke", "dse"}) {
                double w2, M2;
                g_lu = true; cuadrante(tipo, h, tb.n, tb.punt, w2, M2); g_lu = false;
                cuadrante(tipo, h, tb.n, tb.punt, w, M);
                const double dw = std::abs(w2 - w) / std::abs(w), dm = std::abs(M2 - M) / std::abs(M);
                char kw[64], km[64]; std::snprintf(kw, sizeof kw, "%s_%s_h%g_w", tb.tab, tipo, h); std::snprintf(km, sizeof km, "%s_%s_h%g_M", tb.tab, tipo, h);
                cmp(kw, w, it == libro.end() ? -1 : (std::string(tipo) == "dke" ? it->second.first : it->second.second), dw);
                cmp(km, M, -1, dm);
            }
        }
    }
    const std::map<std::string, double> lib86 = {{"t86_libre_1x6_dke", 0.0284}, {"t86_libre_1x6_dse", 0.2368}, {"t86_libre_9x9_dke", 0.0233},
        {"t86_libre_9x9_dse", 0.1249}, {"t86_fijo_1x6_dke", 0.0227}, {"t86_fijo_1x6_dse", 0.0849}, {"t86_fijo_9x9_dke", 0.0218}, {"t86_fijo_9x9_dse", 0.0756}};
    for (const char *giro : {"libre", "fijo"})
        for (int mal = 0; mal < 2; mal++)
            for (const char *tipo : {"dke", "dse"}) {
                char k[64]; std::snprintf(k, sizeof k, "t86_%s_%s_%s", giro, mal ? "9x9" : "1x6", tipo);
                cmp(k, torsion(tipo, mal ? 9 : 6, mal ? 9 : 1, std::string(giro) == "fijo"), lib86.at(k));
            }

    // ── E. enrutado en la cascara Q4 ──
    std::printf("E. getLocalStiffnessMatrixShellQ4 con plateFormulations 6/7/8 (trapecio alabeado y plano)\n");
    for (int alabeo = 0; alabeo < 2; alabeo++) {
        std::vector<Node> nd = {{0, 0, 0}, {1.2, 0, 0}, {0.9, 0.8, alabeo ? 0.05 : 0.0}, {0.1, 1.0, 0}};
        ElementInputs ei;
        ei.elasticities[0] = 2.2e7; ei.poissonsRatios[0] = 0.2; ei.thicknesses[0] = 0.2; ei.densities[0] = 0;
        ei.plateFormulations[0] = 0;
        const MatrixXd K0 = getLocalStiffnessMatrixShellQ4(nd, ei, 0);
        double x[4], y[4]; localQ4(nd, x, y);
        const MatrixXd ref[3] = {kWilsonDKE(x, y, 2.2e7, 0.2, 0.2), kWilsonDSE(x, y, 2.2e7, 0.2, 0.2), kShellThickCSI(x, y, 2.2e7, 0.2, 0.2)};
        for (int pf = 6; pf <= 8; pf++) {
            ei.plateFormulations[0] = pf;
            const MatrixXd K = getLocalStiffnessMatrixShellQ4(nd, ei, 0);
            const double eb = relF(bloqueFlexion(K), ref[pf - 6]);
            MatrixXd D = K - K0;
            for (int a = 0; a < 4; a++) for (int b = 0; b < 4; b++) for (int c = 0; c < 3; c++) for (int d = 0; d < 3; d++) D(6 * a + 2 + c, 6 * b + 2 + d) = 0;
            const double resto = D.cwiseAbs().maxCoeff();
            std::printf("   alabeo %d  pf %d  flexion vs header %.1e   resto de la 24x24 vs pf 0 %.1e\n", alabeo, pf, eb, resto);
            ok(eb < 1e-14 && resto == 0.0, "enrutado pf 6/7/8");
        }
        // con modificadores direccionales: llegan a la flexion nueva
        ei.shellModifiers[0] = {1, 1, 1, 0.5, 0.7, 0.3, 0.6, 0.9};
        const double mod[8] = {1, 1, 1, 0.5, 0.7, 0.3, 0.6, 0.9};
        ei.plateFormulations[0] = 7;
        const double em = relF(bloqueFlexion(getLocalStiffnessMatrixShellQ4(nd, ei, 0)), kWilsonDSE(x, y, 2.2e7, 0.2, 0.2, mod));
        ei.plateFormulations[0] = 8;
        const double em8 = relF(bloqueFlexion(getLocalStiffnessMatrixShellQ4(nd, ei, 0)), kShellThickCSI(x, y, 2.2e7, 0.2, 0.2, mod));
        std::printf("   alabeo %d  modificadores: pf 7 %.1e  pf 8 %.1e\n", alabeo, em, em8);
        ok(em < 1e-14 && em8 < 1e-14, "modificadores pf 7/8");
        ei.shellModifiers.clear();
        // informativo: lo que YA habia
        ei.plateFormulations[0] = 4;
        const MatrixXd K4 = bloqueFlexion(getLocalStiffnessMatrixShellQ4(nd, ei, 0));
        ei.plateFormulations[0] = 1;
        const MatrixXd Kt = bloqueFlexion(getLocalStiffnessMatrixShellThin(nd, ei, 0));
        std::printf("   alabeo %d  [info] pf 4 (getBendingK_DSE_FULL) vs DSE Wilson: ||dK|| %.2e  autovalores %.2e\n", alabeo, relF(K4, ref[1]), relEig(K4, ref[1]));
        {
            const MatrixXd K88 = kWilsonDSE(x, y, 2.2e7, 0.2, 0.2, nullptr, true);
            std::printf("   alabeo %d  [info] pf 4 vs DSE Wilson con la INVERSA de (8.8): ||dK|| %.2e   DSE impresa vs inversa: %.2e\n",
                        alabeo, relF(K4, K88), relF(ref[1], K88));
            ok(relF(K4, K88) < 1e-12, "pf 4 = DSE con la inversa de (8.8)");
            // cortante constante (w = 0.3 x + 0.7 y, giros 0): energia = 1/2 Ds (0.3^2 + 0.7^2) A con la inversa buena
            VectorXd u = VectorXd::Zero(12);
            for (int k = 0; k < 4; k++) u(3 * k) = 0.3 * x[k] + 0.7 * y[k];
            const double A = 0.5 * std::abs((x[0] - x[2]) * (y[1] - y[3]) - (x[1] - x[3]) * (y[0] - y[2]));
            Eigen::Matrix3d Db; Eigen::Matrix2d Ds; matricesD(2.2e7, 0.2, 0.2, nullptr, Db, Ds);
            const MatrixXd K16i = wilson::kDSE16_D(x, y, Db, Eigen::Matrix2d(Ds), false), K16c = wilson::kDSE16_D(x, y, Db, Ds, true);
            VectorXd u16 = VectorXd::Zero(16); u16.head(12) = u;
            const double Ex = 0.5 * Ds(0, 0) * (0.09 + 0.49) * A;
            std::printf("   alabeo %d  [info] patch de cortante constante (16 GDL, dtheta=0): impresa %.4f  inversa %.4f  (exacto 1)\n",
                        alabeo, 0.5 * u16.dot(K16i * u16) / Ex, 0.5 * u16.dot(K16c * u16) / Ex);
        }
        ok(relF(Kt, ref[0]) < 1e-12, "Thin DKQ = DKE de Wilson");
        std::printf("   alabeo %d  [info] pf 1 Thin (DKQ) vs DKE Wilson:             ||dK|| %.2e  autovalores %.2e\n", alabeo, relF(Kt, ref[0]), relEig(Kt, ref[0]));
        std::printf("   alabeo %d  [info] pf 0 MITC4 vs CSI Thick: autovalores %.2e   DKQ (getBendingK_DKQ) vs DKE: %.2e\n", alabeo,
                    relEig(bloqueFlexion(K0), ref[2]), relF(getBendingK_DKQ(x, y, 2.2e7, 0.2, 0.2), ref[0]));
    }
    std::printf("\n%s  (%d fallos)\n", fallos ? "HAY FALLOS" : "TODO OK", fallos);
    return fallos ? 1 : 0;
}
