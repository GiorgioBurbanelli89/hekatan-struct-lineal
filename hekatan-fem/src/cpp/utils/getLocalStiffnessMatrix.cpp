#include "../data-model.h"
#include <vector>
#include <cmath>
#include <Eigen/Dense>
#include <iostream>
#include <iomanip>
#include <stdexcept>

template <typename K, typename V>
V getMapValueOrDefault(const std::map<K, V> &map, const K &key, const V &defaultValue);
Eigen::MatrixXd getLocalStiffnessMatrixFrame(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index);
Eigen::MatrixXd getLocalStiffnessMatrixShell(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index);

Eigen::MatrixXd getLocalStiffnessMatrixInterface(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index);

// Shell Q4 (4-node) Mindlin-Reissner = ETABS Shell-Thick (DSE Wilson Ch10) — shellQ4.cpp
Eigen::MatrixXd getLocalStiffnessMatrixShellQ4(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index);

// Shell Thin (4-node) MZC Kirchhoff = ETABS Shell-Thin (DKE Wilson Ch10) — shellThin.cpp
Eigen::MatrixXd getLocalStiffnessMatrixShellQ4_DKMQ(
    const std::vector<Node> &nodes, const ElementInputs &elementInputs, int index);
Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index);

// Static condensation for releases (any DOF at node I or J)
// Supports two formats:
//   6 flags: [TI, M2I, M3I, TJ, M2J, M3J]  (legacy, rotational only)
//  12 flags: [FxI, FyI, FzI, TI, M2I, M3I, FxJ, FyJ, FzJ, TJ, M2J, M3J]  (all DOFs)
Eigen::MatrixXd applyReleases(const Eigen::MatrixXd &K, const std::vector<bool> &releases)
{
    std::vector<int> freed, retained;
    if (releases.size() >= 12) {
        // Full 12-flag format: maps directly to local DOFs 0-11
        for (int i = 0; i < 12; i++) {
            if (releases[i]) freed.push_back(i);
        }
    } else {
        // Legacy 6-flag format: [TI, M2I, M3I, TJ, M2J, M3J]
        // Maps to local DOFs: TI→3, M2I→4, M3I→5, TJ→9, M2J→10, M3J→11
        const int relDofs[] = {3, 4, 5, 9, 10, 11};
        for (int i = 0; i < 6 && i < (int)releases.size(); i++) {
            if (releases[i]) freed.push_back(relDofs[i]);
        }
    }
    if (freed.empty()) return K;

    for (int i = 0; i < 12; i++)
    {
        bool isFree = false;
        for (int f : freed) if (f == i) { isFree = true; break; }
        if (!isFree) retained.push_back(i);
    }

    int nr = retained.size(), nf = freed.size();
    Eigen::MatrixXd Kff(nf, nf), Krf(nr, nf), Kfr(nf, nr);
    for (int i = 0; i < nf; i++)
        for (int j = 0; j < nf; j++)
            Kff(i, j) = K(freed[i], freed[j]);
    for (int i = 0; i < nr; i++)
        for (int j = 0; j < nf; j++)
            Krf(i, j) = K(retained[i], freed[j]);
    for (int i = 0; i < nf; i++)
        for (int j = 0; j < nr; j++)
            Kfr(i, j) = K(freed[i], retained[j]);

    // Krr_condensed = Krr - Krf * inv(Kff) * Kfr
    Eigen::MatrixXd KffInv = Kff.inverse();
    Eigen::MatrixXd correction = Krf * KffInv * Kfr;

    Eigen::MatrixXd Kc = Eigen::MatrixXd::Zero(12, 12);
    for (int i = 0; i < nr; i++)
        for (int j = 0; j < nr; j++)
            Kc(retained[i], retained[j]) = K(retained[i], retained[j]) - correction(i, j);

    return Kc;
}

// Apply partial fixity springs: add spring stiffness to diagonal of K
// springs = [kFxI,kFyI,kFzI,kTI,kM2I,kM3I, kFxJ,kFyJ,kFzJ,kTJ,kM2J,kM3J]
// A spring value > 0 adds that stiffness to the diagonal entry for that DOF
Eigen::MatrixXd applyPartialFixitySprings(const Eigen::MatrixXd &K, const std::vector<double> &springs)
{
    Eigen::MatrixXd Ks = K;
    int n = std::min((int)springs.size(), 12);
    for (int i = 0; i < n; i++) {
        if (springs[i] > 1e-12) {
            Ks(i, i) += springs[i];
        }
    }
    return Ks;
}

Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex)
{
    if (elementNodes.size() == 2)
    {
        Eigen::MatrixXd K = getLocalStiffnessMatrixFrame(elementNodes, elementInputs, elementIndex);
        // Apply partial fixity springs (before releases)
        auto itSp = elementInputs.partialFixitySprings.find(elementIndex);
        if (itSp != elementInputs.partialFixitySprings.end()) {
            K = applyPartialFixitySprings(K, itSp->second);
        }
        // Apply releases (static condensation)
        auto it = elementInputs.momentReleases.find(elementIndex);
        if (it != elementInputs.momentReleases.end()) {
            K = applyReleases(K, it->second);
        }
        return K;
    }
    if (elementNodes.size() == 3)
    {
        return getLocalStiffnessMatrixShell(elementNodes, elementInputs, elementIndex);
    }
    if (elementNodes.size() == 4)
    {
        // Dispatch: if element has thickness → Shell Q4, otherwise → Interface
        auto itT = elementInputs.thicknesses.find(elementIndex);
        if (itT != elementInputs.thicknesses.end() && itT->second > 1e-12)
        {
            // Dispatch de la formulacion de placa, segun plateFormulations[idx]:
            //   0 = Mindlin con MITC4   (Shell-Thick)
            //   1 = Kirchhoff MZC       (Shell-Thin)
            //   3 = DKMQ de Katili      (Discrete Kirchhoff-Mindlin)
            //
            // El 3 estaba COMPILADO pero desenchufado desde que se porto: el
            // dispatcher solo miraba el 1. Se conecta el 19-ago-2026 para poder
            // medirlo contra el Shell-Thick de ETABS, que no es un MITC4 —lo
            // dicen cuatro programas sobre la misma celda— y al que le faltan
            // MODOS, no puntos de integracion. El DKMQ tiene justo eso: cuatro
            // GDL de lado que se condensan.
            auto itPF = elementInputs.plateFormulations.find(elementIndex);
            if (itPF != elementInputs.plateFormulations.end() && itPF->second == 1)
            {
                return getLocalStiffnessMatrixShellThin(elementNodes, elementInputs, elementIndex);
            }
            if (itPF != elementInputs.plateFormulations.end() && itPF->second == 3)
            {
                return getLocalStiffnessMatrixShellQ4_DKMQ(elementNodes, elementInputs, elementIndex);
            }
            return getLocalStiffnessMatrixShellQ4(elementNodes, elementInputs, elementIndex);
        }
        return getLocalStiffnessMatrixInterface(elementNodes, elementInputs, elementIndex);
    }

    throw std::runtime_error("Unsupported element type in getLocalStiffnessMatrix (must have 2, 3, or 4 nodes).");
}

template <typename K, typename V>
V getMapValueOrDefault(const std::map<K, V> &map, const K &key, const V &defaultValue)
{
    auto it = map.find(key);
    if (it != map.end())
    {
        return it->second;
    }
    return defaultValue;
}

Eigen::MatrixXd getLocalStiffnessMatrixFrame(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    double Iz = getMapValueOrDefault(elementInputs.momentsOfInertiaZ, index, 0.0);
    double Iy = getMapValueOrDefault(elementInputs.momentsOfInertiaY, index, 0.0);
    double E = getMapValueOrDefault(elementInputs.elasticities, index, 0.0);
    double A = getMapValueOrDefault(elementInputs.areas, index, 0.0);
    double G = getMapValueOrDefault(elementInputs.shearModuli, index, 0.0);
    double J = getMapValueOrDefault(elementInputs.torsionalConstants, index, 0.0);

    Eigen::Vector3d node0(nodes[0][0], nodes[0][1], nodes[0][2]);
    Eigen::Vector3d node1(nodes[1][0], nodes[1][1], nodes[1][2]);
    double L = (node1 - node0).norm();

    if (L < 1e-12)
    {
        std::cerr << "Warning: Zero length element detected in getLocalStiffnessMatrixFrame. Returning zero matrix." << std::endl;
        return Eigen::MatrixXd::Zero(12, 12);
    }

    // Timoshenko shear deformation: phi = 12EI/(G*As*L^2)
    // Convention (ETABS-style section property modifiers):
    //   As not provided / As = 0  → default Timoshenko 5/6·A (matches ETABS default)
    //   As > 0                    → Timoshenko with that explicit shear area
    //   As < 0 (sentinel)         → Bernoulli puro (phi = 0, no shear deformation)
    // The negative-sentinel convention allows the FEM Studio modAs2/modAs3 = 0
    // (Euler-Bernoulli) to be passed as As = -1 explicitly.
    double AsY = getMapValueOrDefault(elementInputs.shearAreasY, index, 0.0);
    double AsZ = getMapValueOrDefault(elementInputs.shearAreasZ, index, 0.0);
    bool bernoulliY = (AsY < -1e-15);
    bool bernoulliZ = (AsZ < -1e-15);
    if (!bernoulliY && AsY < 1e-15 && A > 1e-15 && G > 1e-15) AsY = (5.0 / 6.0) * A;
    if (!bernoulliZ && AsZ < 1e-15 && A > 1e-15 && G > 1e-15) AsZ = (5.0 / 6.0) * A;
    double phiZ = (!bernoulliZ && AsZ > 0 && G > 0) ? (12.0 * E * Iz) / (G * AsZ * L * L) : 0.0;
    double phiY = (!bernoulliY && AsY > 0 && G > 0) ? (12.0 * E * Iy) / (G * AsY * L * L) : 0.0;

    const double EA_L = E * A / L;
    const double GJ_L = G * J / L;

    // Timoshenko coefficients (Euler-Bernoulli when phi=0)
    const double tz = (12.0 * E * Iz / (L * L * L)) / (1.0 + phiZ);
    const double bz = (6.0 * E * Iz / (L * L)) / (1.0 + phiZ);
    const double kz = (4.0 * E * Iz / L) * (1.0 + phiZ / 4.0) / (1.0 + phiZ);
    const double az = (2.0 * E * Iz / L) * (1.0 - phiZ / 2.0) / (1.0 + phiZ);

    const double ty = (12.0 * E * Iy / (L * L * L)) / (1.0 + phiY);
    const double by = (6.0 * E * Iy / (L * L)) / (1.0 + phiY);
    const double ky = (4.0 * E * Iy / L) * (1.0 + phiY / 4.0) / (1.0 + phiY);
    const double ay = (2.0 * E * Iy / L) * (1.0 - phiY / 2.0) / (1.0 + phiY);

    Eigen::MatrixXd kLocal(12, 12);
    kLocal << EA_L, 0, 0, 0, 0, 0, -EA_L, 0, 0, 0, 0, 0,
        0, tz, 0, 0, 0, bz, 0, -tz, 0, 0, 0, bz,
        0, 0, ty, 0, -by, 0, 0, 0, -ty, 0, -by, 0,
        0, 0, 0, GJ_L, 0, 0, 0, 0, 0, -GJ_L, 0, 0,
        0, 0, -by, 0, ky, 0, 0, 0, by, 0, ay, 0,
        0, bz, 0, 0, 0, kz, 0, -bz, 0, 0, 0, az,
        -EA_L, 0, 0, 0, 0, 0, EA_L, 0, 0, 0, 0, 0,
        0, -tz, 0, 0, 0, -bz, 0, tz, 0, 0, 0, -bz,
        0, 0, -ty, 0, by, 0, 0, 0, ty, 0, by, 0,
        0, 0, 0, -GJ_L, 0, 0, 0, 0, 0, GJ_L, 0, 0,
        0, 0, -by, 0, ay, 0, 0, 0, by, 0, ky, 0,
        0, bz, 0, 0, 0, az, 0, -bz, 0, 0, 0, kz;

    return kLocal;
}

Eigen::Matrix3d buildIsoDb(double E, double nu, double t)
{
    if (std::abs(1 - nu * nu) < 1e-12)
    {
        std::cerr << "Warning: Poisson's ratio causing division by zero (nu=1 or nu=-1) in buildIsoDb. Returning zero matrix." << std::endl;
        return Eigen::Matrix3d::Zero();
    }
    double factor = (E * t * t * t) / (12 * (1 - nu * nu));
    Eigen::Matrix3d Db;
    Db << 1, nu, 0,
        nu, 1, 0,
        0, 0, (1 - nu) / 2;
    return Db * factor;
}

Eigen::Matrix2d buildIsoDs(double E, double nu, double t)
{
    const double k_s = 5.0 / 6.0;
    const double q_s = E / (2.0 * (1.0 + nu));
    Eigen::Matrix2d Ds;
    Ds << k_s * q_s * t, 0,
        0, k_s * q_s * t;
    return Ds;
}

Eigen::Matrix3d buildOrthotropicDb(double Ex, double Ey, double Gxy, double nu_xy, double t)
{
    if (std::abs(Ex) < 1e-12)
    {
        std::cerr << "Warning: Ex (E) is near zero in buildOrthotropicDb. Returning zero matrix." << std::endl;
        return Eigen::Matrix3d::Zero();
    }

    double nu_yx = (Ey * nu_xy) / Ex;
    double denom = 1.0 - nu_xy * nu_yx;
    if (std::abs(denom) < 1e-12)
    {
        std::cerr << "Warning: Denominator (1 - nu_xy * nu_yx) is near zero in buildOrthotropicDb. Returning zero matrix." << std::endl;
        return Eigen::Matrix3d::Zero();
    }

    double Q11 = Ex / denom;
    double Q22 = Ey / denom;
    double Q12 = (nu_xy * Ey) / denom;
    double Q66 = Gxy;

    Eigen::Matrix3d Q;
    Q << Q11, Q12, 0,
        Q12, Q22, 0,
        0, 0, Q66;

    double factor = (t * t * t) / 12.0;
    return Q * factor;
}

Eigen::Matrix2d buildOrthotropicDs(double Gxy, double t)
{
    const double k_s = 5.0 / 6.0;
    Eigen::Matrix2d Ds;
    Ds << k_s * Gxy * t, 0,
        0, k_s * Gxy * t;
    return Ds;
}

struct CsOutput
{
    Eigen::MatrixXd bs1;
    Eigen::MatrixXd bs2;
    Eigen::MatrixXd bs3;
    double Ae;
};

CsOutput getCellSmoothingTerms(
    const std::vector<double> &X,
    const std::vector<double> &Y)
{
    Eigen::MatrixXd bs1 = Eigen::MatrixXd::Zero(2, 6);
    Eigen::MatrixXd bs2 = Eigen::MatrixXd::Zero(2, 6);
    Eigen::MatrixXd bs3 = Eigen::MatrixXd::Zero(2, 6);

    double x21 = X[1] - X[0];
    double x13 = X[0] - X[2];
    double y31 = Y[2] - Y[0];
    double y12 = Y[0] - Y[1];
    double x32 = X[2] - X[1];
    double y23 = Y[1] - Y[2];

    double Ae = 0.5 * (x21 * y31 - x13 * y12);
    if (std::abs(Ae) < 1e-12)
    {
        return {bs1, bs2, bs3, 0.0};
    }

    double a1 = 0.5 * y12 * x13;
    double a2 = 0.5 * y31 * x21;
    double a3 = 0.5 * x21 * x13;
    double a4 = 0.5 * y12 * y31;

    bs1(0, 2) = (0.5 * x32) / Ae;
    bs1(0, 3) = -0.5;
    bs1(1, 2) = (0.5 * y23) / Ae;
    bs1(1, 4) = 0.5;

    bs2(0, 2) = (0.5 * x13) / Ae;
    bs2(0, 3) = (0.5 * a1) / Ae;
    bs2(0, 4) = (0.5 * a3) / Ae;
    bs2(1, 2) = (0.5 * y31) / Ae;
    bs2(1, 3) = (0.5 * a4) / Ae;
    bs2(1, 4) = (0.5 * a2) / Ae;

    bs3(0, 2) = (0.5 * x21) / Ae;
    bs3(0, 3) = (-0.5 * a2) / Ae;
    bs3(0, 4) = (-0.5 * a3) / Ae;
    bs3(1, 2) = (0.5 * y12) / Ae;
    bs3(1, 3) = (-0.5 * a4) / Ae;
    bs3(1, 4) = (-0.5 * a1) / Ae;

    return {bs1, bs2, bs3, Ae};
}

Eigen::MatrixXd getShearStrainDisplacementMatrix(const std::vector<Node> &nodes)
{
    Eigen::MatrixXd Bs = Eigen::MatrixXd::Zero(2, 18);
    double x1 = nodes[0][0], y1 = nodes[0][1];
    double x2 = nodes[1][0], y2 = nodes[1][1];
    double x3 = nodes[2][0], y3 = nodes[2][1];

    double Ae = 0.5 * ((x2 - x1) * (y3 - y1) - (x3 - x1) * -(y1 - y2));
    if (std::abs(Ae) < 1e-12)
    {
        return Bs;
    }

    double centroidX = (x1 + x2 + x3) / 3.0;
    double centroidY = (y1 + y2 + y3) / 3.0;

    std::vector<double> triangle1CoordsX = {centroidX, x1, x2};
    std::vector<double> triangle1CoordsY = {centroidY, y1, y2};
    std::vector<double> triangle2CoordsX = {centroidX, x2, x3};
    std::vector<double> triangle2CoordsY = {centroidY, y2, y3};
    std::vector<double> triangle3CoordsX = {centroidX, x3, x1};
    std::vector<double> triangle3CoordsY = {centroidY, y3, y1};

    const double oneThird = 1.0 / 3.0;

    CsOutput cs1 = getCellSmoothingTerms(triangle1CoordsX, triangle1CoordsY);
    CsOutput cs2 = getCellSmoothingTerms(triangle2CoordsX, triangle2CoordsY);
    CsOutput cs3 = getCellSmoothingTerms(triangle3CoordsX, triangle3CoordsY);

    Eigen::MatrixXd B1 = Eigen::MatrixXd::Zero(2, 18);
    Eigen::MatrixXd B2 = Eigen::MatrixXd::Zero(2, 18);
    Eigen::MatrixXd B3 = Eigen::MatrixXd::Zero(2, 18);

    for (int i = 0; i < 2; i++)
    {
        for (int j = 0; j < 6; j++)
        {
            B1(i, j) = oneThird * cs1.bs1(i, j) + cs1.bs2(i, j);
            B1(i, j + 6) = oneThird * cs1.bs1(i, j) + cs1.bs3(i, j);
            B1(i, j + 12) = oneThird * cs1.bs1(i, j);

            B2(i, j) = oneThird * cs2.bs1(i, j);
            B2(i, j + 6) = oneThird * cs2.bs1(i, j) + cs2.bs2(i, j);
            B2(i, j + 12) = oneThird * cs2.bs1(i, j) + cs2.bs3(i, j);

            B3(i, j) = oneThird * cs3.bs1(i, j) + cs3.bs3(i, j);
            B3(i, j + 6) = oneThird * cs3.bs1(i, j);
            B3(i, j + 12) = oneThird * cs3.bs1(i, j) + cs3.bs2(i, j);
        }
    }

    for (int i = 0; i < 2; i++)
    {
        for (int j = 0; j < 18; j++)
        {
            B1(i, j) *= cs1.Ae;
            B2(i, j) *= cs2.Ae;
            B3(i, j) *= cs3.Ae;
            Bs(i, j) = (B1(i, j) + B2(i, j) + B3(i, j)) / Ae;
        }
    }

    return Bs;
}

Eigen::MatrixXd getBendingStrainDisplacementMatrix(const std::vector<Node> &nodes)
{
    Eigen::MatrixXd bendingMatrix = Eigen::MatrixXd::Zero(3, 18);
    double x1 = nodes[0][0], y1 = nodes[0][1];
    double x2 = nodes[1][0], y2 = nodes[1][1];
    double x3 = nodes[2][0], y3 = nodes[2][1];

    double x21 = x2 - x1;
    double x31 = x3 - x1;
    double x32 = x3 - x2;
    double y23 = y2 - y3;
    double y31 = y3 - y1;
    double y12 = y1 - y2;

    double Ae = 0.5 * (x21 * y31 - x31 * -y12);
    if (std::abs(Ae) < 1e-12)
    {
        return bendingMatrix;
    }

    double dNdx1 = y23 / (2 * Ae);
    double dNdy1 = x32 / (2 * Ae);
    double dNdx2 = y31 / (2 * Ae);
    double dNdy2 = -x31 / (2 * Ae);
    double dNdx3 = y12 / (2 * Ae);
    double dNdy3 = x21 / (2 * Ae);

    bendingMatrix(0, 4) = dNdx1;
    bendingMatrix(0, 10) = dNdx2;
    bendingMatrix(0, 16) = dNdx3;

    bendingMatrix(1, 3) = -dNdy1;
    bendingMatrix(1, 9) = -dNdy2;
    bendingMatrix(1, 15) = -dNdy3;

    bendingMatrix(2, 3) = -dNdx1;
    bendingMatrix(2, 4) = dNdy1;
    bendingMatrix(2, 9) = -dNdx2;
    bendingMatrix(2, 10) = dNdy2;
    bendingMatrix(2, 15) = -dNdx3;
    bendingMatrix(2, 16) = dNdy3;

    return bendingMatrix;
}

Eigen::Matrix3d getIsotropicInPlaneConstitutiveMatrix(double E, double nu)
{
    double q1 = E / (1 - nu * nu);
    Eigen::Matrix3d Q;
    Q << q1, q1 * nu, 0,
        q1 * nu, q1, 0,
        0, 0, (q1 * (1 - nu)) / 2;
    return Q;
}

Eigen::Matrix3d getOrthotropicInPlaneConstitutiveMatrix(double Ex, double Ey, double Gxy, double nu_xy)
{
    double nu_yx = (Ey * nu_xy) / Ex;
    double denominator = 1 - nu_xy * nu_yx;
    if (std::abs(denominator) < 1e-12)
    {
        std::cerr << "Warning: Denominator (1 - nu_xy * nu_yx) is near zero in getOrthotropicInPlaneConstitutiveMatrix. Returning zero matrix." << std::endl;
        return Eigen::Matrix3d::Zero();
    }
    double Q11 = Ex / denominator;
    double Q22 = Ey / denominator;
    double Q12 = (nu_xy * Ey) / denominator;
    double Q66 = Gxy;
    Eigen::Matrix3d Q;
    Q << Q11, Q12, 0,
        Q12, Q22, 0,
        0, 0, Q66;
    return Q;
}

Eigen::MatrixXd getMembraneStiffnessMatrix(
    const std::vector<Node> &nodes,
    const Eigen::Matrix3d &inPlaneConstitutiveMatrix,
    double thickness)
{
    Eigen::MatrixXd Km = Eigen::MatrixXd::Zero(9, 9);
    Eigen::MatrixXd Kh = Eigen::MatrixXd::Zero(9, 9);
    Eigen::MatrixXd Kb = Eigen::MatrixXd::Zero(9, 9);
    Eigen::MatrixXd L_mat = Eigen::MatrixXd::Zero(9, 3);
    Eigen::MatrixXd T0_mat = Eigen::MatrixXd::Zero(3, 9);
    Eigen::MatrixXd Te_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q1_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q2_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q3_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q4_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q5_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd Q6_mat = Eigen::MatrixXd::Zero(3, 3);
    Eigen::MatrixXd KO = Eigen::MatrixXd::Zero(3, 3);

    const double alpha = 1.0 / 8.0;
    const double ab = alpha / 6.0;
    const double b0 = alpha * alpha / 4.0;
    const double b1 = 1.0;
    const double b2 = 2.0;
    const double b3 = 1.0;
    const double b4 = 0.0;
    const double b5 = 1.0;
    const double b6 = -1.0;
    const double b7 = -1.0;
    const double b8 = -1.0;
    const double b9 = -2.0;

    const double x1 = nodes[0][0];
    const double y1 = nodes[0][1];
    const double x2 = nodes[1][0];
    const double y2 = nodes[1][1];
    const double x3 = nodes[2][0];
    const double y3 = nodes[2][1];

    const double x12 = x1 - x2;
    const double x23 = x2 - x3;
    const double x31 = x3 - x1;
    const double y12 = y1 - y2;
    const double y23 = y2 - y3;
    const double y31 = y3 - y1;
    const double x21 = -x12;
    const double x32 = -x23;
    const double x13 = -x31;
    const double y21 = -y12;
    const double y32 = -y23;
    const double y13 = -y31;

    double elementArea = 0.5 * (x21 * y31 - x31 * -y12);
    if (std::abs(elementArea) < 1e-12)
    {
        std::cerr << "Warning: Degenerate triangle (zero area) in getMembraneStiffnessMatrix. Returning zero matrix." << std::endl;
        return Eigen::MatrixXd::Zero(9, 9);
    }

    const double A2 = 2 * elementArea;
    const double A4 = 4 * elementArea;
    const double h2 = 0.5 * thickness;
    const double volume = elementArea * thickness;

    const double LL21 = x21 * x21 + y21 * y21;
    const double LL32 = x32 * x32 + y32 * y32;
    const double LL13 = x13 * x13 + y13 * y13;

    L_mat(0, 0) = h2 * y23;
    L_mat(0, 2) = h2 * x32;
    L_mat(1, 1) = h2 * x32;
    L_mat(1, 2) = h2 * y23;
    L_mat(2, 0) = h2 * y23 * (y13 - y21) * ab;
    L_mat(2, 1) = h2 * x32 * (x31 - x12) * ab;
    L_mat(2, 2) = h2 * (x31 * y13 - x12 * y21) * 2 * ab;

    L_mat(3, 0) = h2 * y31;
    L_mat(3, 2) = h2 * x13;
    L_mat(4, 1) = h2 * x13;
    L_mat(4, 2) = h2 * y31;
    L_mat(5, 0) = h2 * y31 * (y21 - y32) * ab;
    L_mat(5, 1) = h2 * x13 * (x12 - x23) * ab;
    L_mat(5, 2) = h2 * (x12 * y21 - x23 * y32) * 2 * ab;

    L_mat(6, 0) = h2 * y12;
    L_mat(6, 2) = h2 * x21;
    L_mat(7, 1) = h2 * x21;
    L_mat(7, 2) = h2 * y12;
    L_mat(8, 0) = h2 * y12 * (y32 - y13) * ab;
    L_mat(8, 1) = h2 * x21 * (x23 - x31) * ab;
    L_mat(8, 2) = h2 * (x23 * y32 - x31 * y13) * 2 * ab;

    Kb = L_mat * inPlaneConstitutiveMatrix * L_mat.transpose();
    if (std::abs(volume) > 1e-12)
    {
        Kb = Kb / volume;
    }
    else
    {
        std::cerr << "Warning: Zero volume in getMembraneStiffnessMatrix for Kb calculation. Kb set to zero." << std::endl;
        Kb.setZero();
    }

    T0_mat(0, 0) = x32 / A4;
    T0_mat(0, 1) = y32 / A4;
    T0_mat(0, 2) = 1;
    T0_mat(0, 3) = x13 / A4;
    T0_mat(0, 4) = y13 / A4;
    T0_mat(0, 6) = x21 / A4;
    T0_mat(0, 7) = y21 / A4;

    T0_mat(1, 0) = x32 / A4;
    T0_mat(1, 1) = y32 / A4;
    T0_mat(1, 3) = x13 / A4;
    T0_mat(1, 4) = y13 / A4;
    T0_mat(1, 5) = 1;
    T0_mat(1, 6) = x21 / A4;
    T0_mat(1, 7) = y21 / A4;

    T0_mat(2, 0) = x32 / A4;
    T0_mat(2, 1) = y32 / A4;
    T0_mat(2, 3) = x13 / A4;
    T0_mat(2, 4) = y13 / A4;
    T0_mat(2, 6) = x21 / A4;
    T0_mat(2, 7) = y21 / A4;
    T0_mat(2, 8) = 1;

    const double A14 = 1.0 / (elementArea * A4);
    Te_mat(0, 0) = A14 * y23 * y13 * LL21;
    Te_mat(0, 1) = A14 * y31 * y21 * LL32;
    Te_mat(0, 2) = A14 * y12 * y32 * LL13;
    Te_mat(1, 0) = A14 * x23 * x13 * LL21;
    Te_mat(1, 1) = A14 * x31 * x21 * LL32;
    Te_mat(1, 2) = A14 * x12 * x32 * LL13;
    Te_mat(2, 0) = A14 * (y23 * x31 + x32 * y13) * LL21;
    Te_mat(2, 1) = A14 * (y31 * x12 + x13 * y21) * LL32;
    Te_mat(2, 2) = A14 * (y12 * x23 + x21 * y32) * LL13;

    const double A14b = A2 / 3.0;

    if (std::abs(LL21) < 1e-12 || std::abs(LL32) < 1e-12 || std::abs(LL13) < 1e-12)
    {
        std::cerr << "Warning: Zero length squared in getMembraneStiffnessMatrix for Q_mat calculation. Q_mats set to zero." << std::endl;
        Q1_mat.setZero();
        Q2_mat.setZero();
        Q3_mat.setZero();
    }
    else
    {
        Q1_mat(0, 0) = (A14b * b1) / LL21;
        Q1_mat(0, 1) = (A14b * b2) / LL21;
        Q1_mat(0, 2) = (A14b * b3) / LL21;
        Q1_mat(1, 0) = (A14b * b4) / LL32;
        Q1_mat(1, 1) = (A14b * b5) / LL32;
        Q1_mat(1, 2) = (A14b * b6) / LL32;
        Q1_mat(2, 0) = (A14b * b7) / LL13;
        Q1_mat(2, 1) = (A14b * b8) / LL13;
        Q1_mat(2, 2) = (A14b * b9) / LL13;

        Q2_mat(0, 0) = (A14b * b9) / LL21;
        Q2_mat(0, 1) = (A14b * b7) / LL21;
        Q2_mat(0, 2) = (A14b * b8) / LL21;
        Q2_mat(1, 0) = (A14b * b3) / LL32;
        Q2_mat(1, 1) = (A14b * b1) / LL32;
        Q2_mat(1, 2) = (A14b * b2) / LL32;
        Q2_mat(2, 0) = (A14b * b6) / LL13;
        Q2_mat(2, 1) = (A14b * b4) / LL13;
        Q2_mat(2, 2) = (A14b * b5) / LL13;

        Q3_mat(0, 0) = (A14b * b5) / LL21;
        Q3_mat(0, 1) = (A14b * b6) / LL21;
        Q3_mat(0, 2) = (A14b * b4) / LL21;
        Q3_mat(1, 0) = (A14b * b8) / LL32;
        Q3_mat(1, 1) = (A14b * b9) / LL32;
        Q3_mat(1, 2) = (A14b * b7) / LL32;
        Q3_mat(2, 0) = (A14b * b2) / LL13;
        Q3_mat(2, 1) = (A14b * b3) / LL13;
        Q3_mat(2, 2) = (A14b * b1) / LL13;
    }

    Q4_mat = (Q1_mat + Q2_mat) * 0.5;
    Q5_mat = (Q2_mat + Q3_mat) * 0.5;
    Q6_mat = (Q3_mat + Q1_mat) * 0.5;

    Eigen::MatrixXd naturalStiffnessMatrix = Te_mat.transpose() * inPlaneConstitutiveMatrix * Te_mat;

    KO = (Q4_mat.transpose() * naturalStiffnessMatrix * Q4_mat +
          Q5_mat.transpose() * naturalStiffnessMatrix * Q5_mat +
          Q6_mat.transpose() * naturalStiffnessMatrix * Q6_mat);

    if (std::abs(volume) > 1e-12)
    {
        KO = KO * ((3.0 / 4.0) * b0 * volume);
    }
    else
    {
        std::cerr << "Warning: Zero volume in getMembraneStiffnessMatrix for KO calculation. KO set to zero." << std::endl;
        KO.setZero();
    }

    Kh = T0_mat.transpose() * KO * T0_mat;

    Km = Kb + Kh;

    return Km;
}

Eigen::MatrixXd getLocalStiffnessMatrixShell(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    if (nodes.size() != 3)
    {
        throw std::runtime_error("Shell element must have 3 nodes.");
    }

    double E = getMapValueOrDefault(elementInputs.elasticities, index, 0.0);
    double Eo = getMapValueOrDefault(elementInputs.elasticitiesOrthogonal, index, 0.0);
    double nu = getMapValueOrDefault(elementInputs.poissonsRatios, index, 0.0);
    double Gxy = getMapValueOrDefault(elementInputs.shearModuli, index, 0.0);
    double t = getMapValueOrDefault(elementInputs.thicknesses, index, 0.0);

    Eigen::Matrix3d bendingStiffnessMatrix;
    if (Eo != 0.0)
    {
        bendingStiffnessMatrix = buildOrthotropicDb(E, Eo, Gxy, nu, t);
    }
    else
    {
        bendingStiffnessMatrix = buildIsoDb(E, nu, t);
    }

    Eigen::Matrix2d shearStiffnessMatrix;
    if (Eo != 0.0)
    {
        shearStiffnessMatrix = buildOrthotropicDs(Gxy, t);
    }
    else
    {
        shearStiffnessMatrix = buildIsoDs(E, nu, t);
    }

    Eigen::Matrix3d inPlaneConstitutiveMatrix;
    if (Eo != 0.0)
    {
        inPlaneConstitutiveMatrix = getOrthotropicInPlaneConstitutiveMatrix(E, Eo, Gxy, nu);
    }
    else
    {
        inPlaneConstitutiveMatrix = getIsotropicInPlaneConstitutiveMatrix(E, nu);
    }

    double x1 = nodes[0][0], y1 = nodes[0][1];
    double x2 = nodes[1][0], y2 = nodes[1][1];
    double x3 = nodes[2][0], y3 = nodes[2][1];

    double x21 = x2 - x1;
    double x31 = x3 - x1;
    double y12 = y1 - y2;
    double y31 = y3 - y1;
    double Ae = 0.5 * (x21 * y31 - x31 * -y12);

    if (std::abs(Ae) < 1e-12)
    {
        std::cerr << "Warning: Degenerate triangle (zero area) detected in getLocalStiffnessMatrixShell. Returning zero matrix." << std::endl;
        return Eigen::MatrixXd::Zero(18, 18);
    }

    Eigen::MatrixXd shearStrainDisplacementMatrix = getShearStrainDisplacementMatrix(nodes);
    Eigen::MatrixXd bendingStrainDisplacementMatrix = getBendingStrainDisplacementMatrix(nodes);
    Eigen::MatrixXd membraneStiffnessMatrix9x9 = getMembraneStiffnessMatrix(nodes, inPlaneConstitutiveMatrix, t);

    Eigen::MatrixXd shearTerm = shearStrainDisplacementMatrix.transpose() * shearStiffnessMatrix * shearStrainDisplacementMatrix;
    Eigen::MatrixXd bendingTerm = bendingStrainDisplacementMatrix.transpose() * bendingStiffnessMatrix * bendingStrainDisplacementMatrix;

    Eigen::MatrixXd Kp = (shearTerm + bendingTerm) * Ae;

    Eigen::MatrixXd localStiffnessMatrix = Eigen::MatrixXd::Zero(18, 18);

    localStiffnessMatrix = Kp;

    std::vector<int> mem_global_indices = {0, 1, 5, 6, 7, 11, 12, 13, 17};

    for (int r_mem = 0; r_mem < 9; ++r_mem)
    {
        for (int c_mem = 0; c_mem < 9; ++c_mem)
        {
            localStiffnessMatrix(mem_global_indices[r_mem], mem_global_indices[c_mem]) += membraneStiffnessMatrix9x9(r_mem, c_mem);
        }
    }

    return localStiffnessMatrix;
}

// ──────────────────────────────────────────────────────────────────────
// 4-node zero-thickness interface element (Goodman, 1968)
//
// Nodes: 0,1 = bottom side (wall), 2,3 = top side (soil)
// Pairs: (0,3) coincident, (1,2) coincident
// Interface direction: from pair(0,3) to pair(1,2)
//
// Properties via existing maps:
//   elasticities[i]  → kn (normal stiffness, force/length³)
//   shearModuli[i]   → ks (tangential stiffness, force/length³)
//
// Returns 24×24 matrix (4 nodes × 6 DOFs) in GLOBAL coordinates.
// Transformation matrix should be Identity for this element type.
// ──────────────────────────────────────────────────────────────────────
Eigen::MatrixXd getLocalStiffnessMatrixInterface(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    double kn = getMapValueOrDefault(elementInputs.elasticities, index, 0.0);
    double ks = getMapValueOrDefault(elementInputs.shearModuli, index, 0.0);

    // Interface direction: from node 0 to node 1 (bottom edge)
    double dx = nodes[1][0] - nodes[0][0];
    double dy = nodes[1][1] - nodes[0][1];
    double L = std::sqrt(dx * dx + dy * dy);

    if (L < 1e-12)
    {
        std::cerr << "Warning: Zero-length interface element. Returning zero matrix." << std::endl;
        return Eigen::MatrixXd::Zero(24, 24);
    }

    // Unit tangent (s) and normal (n) vectors
    double sx = dx / L;
    double sy = dy / L;
    double nx = -sy; // normal pointing from bottom to top (CCW 90°)
    double ny = sx;

    // 8 active DOFs: [u0x, u0y, u1x, u1y, u2x, u2y, u3x, u3y]
    // Sign: -1 for bottom nodes (0,1), +1 for top nodes (2,3)
    // Shape function index: 0=N1 for pairs at (0,3), 1=N2 for pairs at (1,2)
    // Direction components for s and n per DOF
    double signs[8] = {-1, -1, -1, -1, 1, 1, 1, 1};
    int    shapes[8] = {0, 0, 1, 1, 1, 1, 0, 0};
    double s_dirs[8] = {sx, sy, sx, sy, sx, sy, sx, sy};
    double n_dirs[8] = {nx, ny, nx, ny, nx, ny, nx, ny};

    // Analytical integration: ∫₀ᴸ N_a(s)*N_b(s) ds
    // N1 = 1-s/L, N2 = s/L
    // ∫ N1² = L/3, ∫ N2² = L/3, ∫ N1·N2 = L/6
    double integ[2][2] = {{L / 3.0, L / 6.0}, {L / 6.0, L / 3.0}};

    // Build 8×8 stiffness in global coordinates
    // K(i,j) = (ks · si_s · sj_s + kn · si_n · sj_n) · sign_i · sign_j · integral(shape_i, shape_j)
    Eigen::MatrixXd K8 = Eigen::MatrixXd::Zero(8, 8);
    for (int i = 0; i < 8; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            double val = 0;
            val += ks * s_dirs[i] * s_dirs[j];
            val += kn * n_dirs[i] * n_dirs[j];
            val *= signs[i] * signs[j] * integ[shapes[i]][shapes[j]];
            K8(i, j) = val;
        }
    }

    // Embed 8×8 into 24×24 (4 nodes × 6 DOFs each)
    // DOF mapping: 8×8 index → 24×24 index
    //   u0x=0→0, u0y=1→1, u1x=2→6, u1y=3→7,
    //   u2x=4→12, u2y=5→13, u3x=6→18, u3y=7→19
    int map8to24[8] = {0, 1, 6, 7, 12, 13, 18, 19};

    Eigen::MatrixXd K24 = Eigen::MatrixXd::Zero(24, 24);
    for (int i = 0; i < 8; i++)
    {
        for (int j = 0; j < 8; j++)
        {
            K24(map8to24[i], map8to24[j]) = K8(i, j);
        }
    }

    return K24;
}