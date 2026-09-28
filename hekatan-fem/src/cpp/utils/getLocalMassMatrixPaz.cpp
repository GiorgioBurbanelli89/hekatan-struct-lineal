/**
 * getLocalMassMatrixPaz.cpp — Consistent mass matrix using explicit I0
 * (Mario Paz formulation, Structural Dynamics 6th Ed, Eq 13.4)
 *
 * Difference from getLocalMassMatrix.cpp:
 *   - Default uses Ip = Iy + Iz for torsional inertia (always correct for real sections)
 *   - This file uses polarMomentsOfInertia (I0) when provided explicitly
 *   - If I0 is not provided, falls back to Ip = Iy + Iz (same as default)
 */

#include "../data-model.h"
#include <vector>
#include <cmath>
#include <Eigen/Dense>

template <typename K, typename V>
static V getMapValueOrDefaultPaz(const std::map<K, V> &map, const K &key, const V &defaultValue)
{
    auto it = map.find(key);
    if (it != map.end())
        return it->second;
    return defaultValue;
}

static Eigen::MatrixXd getLocalMassMatrixFramePaz(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    double A = getMapValueOrDefaultPaz(elementInputs.areas, index, 0.0);
    double Iz = getMapValueOrDefaultPaz(elementInputs.momentsOfInertiaZ, index, 0.0);
    double Iy = getMapValueOrDefaultPaz(elementInputs.momentsOfInertiaY, index, 0.0);
    double rho = getMapValueOrDefaultPaz(elementInputs.densities, index, 0.0);

    Eigen::Vector3d node0(nodes[0][0], nodes[0][1], nodes[0][2]);
    Eigen::Vector3d node1(nodes[1][0], nodes[1][1], nodes[1][2]);
    double L = (node1 - node0).norm();

    if (L < 1e-12 || std::abs(rho) < 1e-30 || std::abs(A) < 1e-30)
        return Eigen::MatrixXd::Zero(12, 12);

    // Key difference: use explicit I0 if provided, else fall back to Ip = Iy + Iz
    double I0 = getMapValueOrDefaultPaz(elementInputs.polarMomentsOfInertia, index, -1.0);
    double rI0_A;
    if (I0 > 0.0)
    {
        // Paz formulation: use explicit polar moment of inertia
        rI0_A = I0 / A;
    }
    else
    {
        // Default (Hekatan): Ip = Iy + Iz
        rI0_A = (Iy + Iz) / A;
    }

    double L2 = L * L;
    double m = rho * A; // mass per unit length
    double factor = m * L / 420.0;

    // Consistent mass matrix for 3D frame element (Paz Eq 13.4)
    // DOF order: ux1, uy1, uz1, rx1, ry1, rz1, ux2, uy2, uz2, rx2, ry2, rz2
    Eigen::MatrixXd mLocal = Eigen::MatrixXd::Zero(12, 12);

    // Row 0 (ux1): axial
    mLocal(0, 0) = 140;
    mLocal(0, 6) = 70;

    // Row 1 (uy1): transverse y
    mLocal(1, 1) = 156;
    mLocal(1, 5) = 22 * L;
    mLocal(1, 7) = 54;
    mLocal(1, 11) = -13 * L;

    // Row 2 (uz1): transverse z
    mLocal(2, 2) = 156;
    mLocal(2, 4) = -22 * L;
    mLocal(2, 8) = 54;
    mLocal(2, 10) = 13 * L;

    // Row 3 (rx1): torsion — uses I0/A (Paz) instead of Ip/A
    mLocal(3, 3) = 140 * rI0_A;
    mLocal(3, 9) = 70 * rI0_A;

    // Row 4 (ry1): bending about y
    mLocal(4, 2) = -22 * L;
    mLocal(4, 4) = 4 * L2;
    mLocal(4, 8) = -13 * L;
    mLocal(4, 10) = -3 * L2;

    // Row 5 (rz1): bending about z
    mLocal(5, 1) = 22 * L;
    mLocal(5, 5) = 4 * L2;
    mLocal(5, 7) = 13 * L;
    mLocal(5, 11) = -3 * L2;

    // Row 6 (ux2): axial
    mLocal(6, 0) = 70;
    mLocal(6, 6) = 140;

    // Row 7 (uy2): transverse y
    mLocal(7, 1) = 54;
    mLocal(7, 5) = 13 * L;
    mLocal(7, 7) = 156;
    mLocal(7, 11) = -22 * L;

    // Row 8 (uz2): transverse z
    mLocal(8, 2) = 54;
    mLocal(8, 4) = -13 * L;
    mLocal(8, 8) = 156;
    mLocal(8, 10) = 22 * L;

    // Row 9 (rx2): torsion — uses I0/A (Paz)
    mLocal(9, 3) = 70 * rI0_A;
    mLocal(9, 9) = 140 * rI0_A;

    // Row 10 (ry2): bending about y
    mLocal(10, 2) = 13 * L;
    mLocal(10, 4) = -3 * L2;
    mLocal(10, 8) = 22 * L;
    mLocal(10, 10) = 4 * L2;

    // Row 11 (rz2): bending about z
    mLocal(11, 1) = -13 * L;
    mLocal(11, 5) = -3 * L2;
    mLocal(11, 7) = -22 * L;
    mLocal(11, 11) = 4 * L2;

    mLocal *= factor;

    return mLocal;
}

// Forward: shell mass from getLocalMassMatrix.cpp (lumped, same for Paz)
Eigen::MatrixXd getLocalMassMatrix(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex);

Eigen::MatrixXd getLocalMassMatrixPaz(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex)
{
    if (elementNodes.size() == 2)
        return getLocalMassMatrixFramePaz(elementNodes, elementInputs, elementIndex);

    // For shells (3 or 4 nodes), use same lumped mass as standard formulation
    if (elementNodes.size() == 3 || elementNodes.size() == 4)
        return getLocalMassMatrix(elementNodes, elementInputs, elementIndex);

    return Eigen::MatrixXd::Zero(0, 0);
}
