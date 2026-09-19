/**
 * ============================================================================
 *  Mindlin-Reissner Q4 Plate Bending Element — Implementation
 * ============================================================================
 *
 *  Selective Reduced Integration (SRI):
 *    Bending stiffness:  2×2 Gauss quadrature (full integration)
 *    Shear stiffness:    1×1 Gauss quadrature (reduced, avoids locking)
 *
 *  This element converges to Kirchhoff theory for thin plates (t/L < 1/20)
 *  and correctly handles thick plates (Mindlin-Reissner theory).
 *
 *  Mathematical Derivation:
 *  ─────────────────────
 *  Displacement field (3D continuum → plate kinematics):
 *    u(x,y,z) = -z · βx(x,y)
 *    v(x,y,z) = -z · βy(x,y)
 *    w(x,y,z) = w(x,y)
 *
 *  Bending strains (curvatures):
 *    κxx = ∂βx/∂x
 *    κyy = ∂βy/∂y
 *    κxy = ∂βx/∂y + ∂βy/∂x
 *
 *  Transverse shear strains:
 *    γxz = ∂w/∂x - βx
 *    γyz = ∂w/∂y - βy
 *
 *  Constitutive relations:
 *    {Mxx, Myy, Mxy}ᵀ = Db · {κxx, κyy, κxy}ᵀ
 *    {Qx, Qy}ᵀ         = Ds · {γxz, γyz}ᵀ
 *
 *  where:
 *    Db = Et³/[12(1-ν²)] · [1  ν  0 ]    (flexural rigidity)
 *                           [ν  1  0 ]
 *                           [0  0  ½(1-ν)]
 *
 *    Ds = κs·G·t · [1  0]                  (shear rigidity)
 *                   [0  1]
 *    κs = 5/6, G = E/[2(1+ν)]
 *
 *  Bilinear shape functions (isoparametric Q4):
 *    N_i(ξ,η) = ¼(1 + ξi·ξ)(1 + ηi·η)     i = 1..4
 *
 *    Node 1: (ξ,η) = (-1,-1)
 *    Node 2: (ξ,η) = (+1,-1)
 *    Node 3: (ξ,η) = (+1,+1)
 *    Node 4: (ξ,η) = (-1,+1)
 *
 *  FE discretization:
 *    w(ξ,η)  = Σ Ni · wi
 *    βx(ξ,η) = Σ Ni · βxi
 *    βy(ξ,η) = Σ Ni · βyi
 *
 *  Element stiffness:
 *    Ke = Kb + Ks
 *    Kb = ∫∫ Bb^T · Db · Bb · |J| dξ dη    (2×2 Gauss)
 *    Ks = ∫∫ Bs^T · Ds · Bs · |J| dξ dη    (1×1 Gauss)
 *
 * ============================================================================
 */

#include "kirchhoff_q4.h"
#include "../utils/plateDKQ.h"   // DKQ (Batoz & Tahar), la placa del Shell-Thin

// La placa del Shell-Thick de CSI (utils/shellQ4.cpp), extraida del binario el
// 2-sep-2026. Es la que usa `deform` para `shelltype thick`; aqui la usa
// plateQ4Solve para que las zapatas de Guerra y los ejemplos plate-thick den
// lo mismo que el producto. Medido el 3-sep-2026 en la ej4 de Guerra (zapata
// combinada 2.6 x 6.7 m): el Q4 de Bathe (integracion selectiva) daba
// sigma_max 23.46 t/m2 contra 28.40 de SAFE (-17 %); la misma zapata por
// `deform` con Shell-Thick 29.09 y con Shell-Thin 29.14.
Eigen::MatrixXd getBendingK_CSI_placa(const double x[4], const double y[4],
                                      double E, double nu, double t);

namespace plate_q4 {
/**
 * K 12x12 en los GDL de plate_q4 [w, bx, by] (Bathe: bx = dw/dx, by = dw/dy en el
 * limite fino) a partir de la K de CSI/DKQ en [w, thx, thy] (mano derecha):
 * thx = by, thy = -bx. K_plate = P^T K P con P por nudo = [[1,0,0],[0,0,1],[0,-1,0]].
 */
static Eigen::Matrix<double, 12, 12> plateKfromCSI(const std::array<Node2D, 4>& nodes,
                                                   const Material& mat, double t)
{
    double x[4], y[4];
    for (int i = 0; i < 4; i++) { x[i] = nodes[i].x; y[i] = nodes[i].y; }
    Eigen::MatrixXd Kc = (mat.theory == PlateTheory::KIRCHHOFF)
        ? getBendingK_DKQ(x, y, mat.E, mat.nu, t)
        : getBendingK_CSI_placa(x, y, mat.E, mat.nu, t);
    Eigen::Matrix<double, 12, 12> P = Eigen::Matrix<double, 12, 12>::Zero();
    for (int i = 0; i < 4; i++) {
        P(3 * i, 3 * i) = 1.0;           // w
        P(3 * i + 1, 3 * i + 2) = 1.0;   // thx = by
        P(3 * i + 2, 3 * i + 1) = -1.0;  // thy = -bx
    }
    return P.transpose() * Kc * P;
}
} // namespace plate_q4

namespace plate_q4 {

// ── Gauss Quadrature Points ────────────────────────────────────────

// 2×2 Gauss points for bending (full integration)
static const double GP2 = 1.0 / std::sqrt(3.0);  // ≈ 0.57735
static const double GP2_pts[4][2] = {
    {-GP2, -GP2}, {+GP2, -GP2}, {+GP2, +GP2}, {-GP2, +GP2}
};
static const double GP2_wts[4] = {1.0, 1.0, 1.0, 1.0};

// 1×1 Gauss point for shear (reduced integration)
static const double GP1_pts[1][2] = {{0.0, 0.0}};
static const double GP1_wts[1] = {4.0};  // weight = 2×2 = 4 for [-1,1]×[-1,1]

// ── Node coordinates in natural space ──────────────────────────────

static const double XI[4]  = {-1.0, +1.0, +1.0, -1.0};
static const double ETA[4] = {-1.0, -1.0, +1.0, +1.0};

// ── Shape Functions & Derivatives ──────────────────────────────────

/**
 * Evaluate bilinear shape functions at (ξ, η).
 * N_i = ¼(1 + ξi·ξ)(1 + ηi·η)
 */
static void shapeFunctions(double xi, double eta, double N[4]) {
    for (int i = 0; i < 4; i++) {
        N[i] = 0.25 * (1.0 + XI[i] * xi) * (1.0 + ETA[i] * eta);
    }
}

/**
 * Derivatives of shape functions w.r.t. natural coordinates.
 * dN[i][0] = ∂Ni/∂ξ,  dN[i][1] = ∂Ni/∂η
 */
static void shapeFunctionDerivs(double xi, double eta, double dN[4][2]) {
    for (int i = 0; i < 4; i++) {
        dN[i][0] = 0.25 * XI[i]  * (1.0 + ETA[i] * eta);  // ∂Ni/∂ξ
        dN[i][1] = 0.25 * ETA[i] * (1.0 + XI[i]  * xi);   // ∂Ni/∂η
    }
}

/**
 * Compute Jacobian matrix J and its inverse.
 *
 *   J = [∂x/∂ξ  ∂y/∂ξ]   =  Σ [dNi/dξ · xi   dNi/dξ · yi]
 *       [∂x/∂η  ∂y/∂η]       [dNi/dη · xi   dNi/dη · yi]
 *
 * @return  determinant |J|
 */
static double jacobian(
    const std::array<Node2D, 4>& nodes,
    const double dN[4][2],
    double Jinv[2][2])
{
    double J[2][2] = {{0, 0}, {0, 0}};
    for (int i = 0; i < 4; i++) {
        J[0][0] += dN[i][0] * nodes[i].x;
        J[0][1] += dN[i][0] * nodes[i].y;
        J[1][0] += dN[i][1] * nodes[i].x;
        J[1][1] += dN[i][1] * nodes[i].y;
    }
    double detJ = J[0][0] * J[1][1] - J[0][1] * J[1][0];
    assert(detJ > 0 && "Negative Jacobian — check node ordering (must be CCW)");

    double invDet = 1.0 / detJ;
    Jinv[0][0] =  J[1][1] * invDet;
    Jinv[0][1] = -J[0][1] * invDet;
    Jinv[1][0] = -J[1][0] * invDet;
    Jinv[1][1] =  J[0][0] * invDet;

    return detJ;
}

/**
 * Convert shape function derivatives from natural to physical coordinates.
 * dNdx[i][0] = ∂Ni/∂x,  dNdx[i][1] = ∂Ni/∂y
 */
static void physicalDerivs(
    const double dN[4][2],
    const double Jinv[2][2],
    double dNdx[4][2])
{
    for (int i = 0; i < 4; i++) {
        dNdx[i][0] = Jinv[0][0] * dN[i][0] + Jinv[0][1] * dN[i][1];
        dNdx[i][1] = Jinv[1][0] * dN[i][0] + Jinv[1][1] * dN[i][1];
    }
}

// ── Constitutive Matrices ──────────────────────────────────────────

/**
 * Bending constitutive matrix Db (3×3).
 *
 *   Db = D₀ · [1    ν    0        ]
 *              [ν    1    0        ]
 *              [0    0    (1-ν)/2  ]
 *
 *   D₀ = Et³ / [12(1 - ν²)]
 */
static Eigen::Matrix3d bendingConstitutive(const Material& mat) {
    double D0 = mat.E * std::pow(mat.t, 3) / (12.0 * (1.0 - mat.nu * mat.nu));
    Eigen::Matrix3d Db;
    Db << D0,           D0 * mat.nu,  0.0,
          D0 * mat.nu,  D0,           0.0,
          0.0,          0.0,          D0 * 0.5 * (1.0 - mat.nu);
    return Db;
}

// Overload: per-element thickness (layered zones)
static Eigen::Matrix3d bendingConstitutive(const Material& mat, double t_elem) {
    double D0 = mat.E * std::pow(t_elem, 3) / (12.0 * (1.0 - mat.nu * mat.nu));
    Eigen::Matrix3d Db;
    Db << D0,           D0 * mat.nu,  0.0,
          D0 * mat.nu,  D0,           0.0,
          0.0,          0.0,          D0 * 0.5 * (1.0 - mat.nu);
    return Db;
}

/**
 * Shear constitutive matrix Ds (2×2).
 *
 *   Ds = κs · G · t · I₂
 *   G = E / [2(1 + ν)]
 */
static Eigen::Matrix2d shearConstitutive(const Material& mat) {
    double G = mat.E / (2.0 * (1.0 + mat.nu));
    double kappa = (mat.theory == PlateTheory::KIRCHHOFF) ? 1.0e10 : SHEAR_CORRECTION;
    double Ds0 = kappa * G * mat.t;
    Eigen::Matrix2d Ds;
    Ds << Ds0, 0.0,
          0.0, Ds0;
    return Ds;
}

static Eigen::Matrix2d shearConstitutive(const Material& mat, double t_elem) {
    double G = mat.E / (2.0 * (1.0 + mat.nu));
    double kappa = (mat.theory == PlateTheory::KIRCHHOFF) ? 1.0e10 : SHEAR_CORRECTION;
    double Ds0 = kappa * G * t_elem;
    Eigen::Matrix2d Ds;
    Ds << Ds0, 0.0,
          0.0, Ds0;
    return Ds;
}

// ── Strain-Displacement Matrices ───────────────────────────────────

/**
 * Bending strain-displacement matrix Bb (3×12).
 *
 * DOF ordering per element: [w1, βx1, βy1, w2, βx2, βy2, ...]
 *
 * Curvature vector: κ = Bb · d_e
 *   κxx = Σ ∂Ni/∂x · βxi
 *   κyy = Σ ∂Ni/∂y · βyi
 *   κxy = Σ (∂Ni/∂y · βxi + ∂Ni/∂x · βyi)
 *
 * For node i, columns [3i, 3i+1, 3i+2] = [w_i, βx_i, βy_i]:
 *   Bb[0][3i+1] = ∂Ni/∂x    (κxx from βx)
 *   Bb[1][3i+2] = ∂Ni/∂y    (κyy from βy)
 *   Bb[2][3i+1] = ∂Ni/∂y    (κxy from βx)
 *   Bb[2][3i+2] = ∂Ni/∂x    (κxy from βy)
 *   All other entries = 0 (w does not contribute to bending)
 */
static Eigen::Matrix<double, 3, 12> bendingB(const double dNdx[4][2]) {
    Eigen::Matrix<double, 3, 12> Bb = Eigen::Matrix<double, 3, 12>::Zero();
    for (int i = 0; i < 4; i++) {
        int col_w  = 3 * i;
        int col_bx = 3 * i + 1;
        int col_by = 3 * i + 2;
        (void)col_w;  // w does not contribute to curvature

        Bb(0, col_bx) = dNdx[i][0];               // κxx = ∂βx/∂x
        Bb(1, col_by) = dNdx[i][1];               // κyy = ∂βy/∂y
        Bb(2, col_bx) = dNdx[i][1];               // κxy = ∂βx/∂y
        Bb(2, col_by) = dNdx[i][0];               //     + ∂βy/∂x
    }
    return Bb;
}

/**
 * Standard shear strain-displacement matrix Bs (2×12) at a specific point.
 *
 * Shear vector: γ = Bs · d_e
 *   γxz = ∂w/∂x - βx
 *   γyz = ∂w/∂y - βy
 */
static Eigen::Matrix<double, 2, 12> shearB(
    const double N[4],
    const double dNdx[4][2])
{
    Eigen::Matrix<double, 2, 12> Bs = Eigen::Matrix<double, 2, 12>::Zero();
    for (int i = 0; i < 4; i++) {
        Bs(0, 3 * i)     =  dNdx[i][0];   // γxz ← ∂w/∂x
        Bs(0, 3 * i + 1) = -N[i];          // γxz ← -βx
        Bs(1, 3 * i)     =  dNdx[i][1];   // γyz ← ∂w/∂y
        Bs(1, 3 * i + 2) = -N[i];          // γyz ← -βy
    }
    return Bs;
}

/**
 * Compute standard Bs at a given (ξ, η) point using element node coordinates.
 * Helper for MITC4 tying.
 */
static Eigen::Matrix<double, 2, 12> shearBatCov(
    const std::array<Node2D, 4>& nodes,
    double xi, double eta)
{
    double N[4];
    shapeFunctions(xi, eta, N);
    double dN[4][2];
    shapeFunctionDerivs(xi, eta, dN);
    double Jinv[2][2];
    jacobian(nodes, dN, Jinv);
    double dNdx[4][2];
    physicalDerivs(dN, Jinv, dNdx);
    // al COVARIANTE: gamma_cov = J · gamma_cart, con J el jacobiano DIRECTO
    double J[2][2] = {{0, 0}, {0, 0}};
    for (int i = 0; i < 4; i++) {
        J[0][0] += dN[i][0] * nodes[i].x;
        J[0][1] += dN[i][0] * nodes[i].y;
        J[1][0] += dN[i][1] * nodes[i].x;
        J[1][1] += dN[i][1] * nodes[i].y;
    }
    Eigen::Matrix2d Jm;
    Jm << J[0][0], J[0][1], J[1][0], J[1][1];
    return Jm * shearB(N, dNdx);
}

/**
 * MITC4 shear B-matrix (Assumed Natural Strain / Mixed Interpolation).
 *
 * Eliminates BOTH shear locking AND hourglass zero-energy modes.
 *
 * Tying points (edge midpoints):
 *   A = (0, -1), C = (0, +1)  → γ_xz sampled here, interpolated in η
 *   B = (-1, 0), D = (+1, 0)  → γ_yz sampled here, interpolated in ξ
 *
 * Interpolation:
 *   γ_ξ(ξ,η) = ½(1-η)·γ_ξ^A + ½(1+η)·γ_ξ^C
 *   γ_η(ξ,η) = ½(1-ξ)·γ_η^B + ½(1+ξ)·γ_η^D
 *
 * ⚠️ Lo que se interpola son las componentes COVARIANTES (sobre los ejes
 * naturales ξ, η), no las cartesianas. Solo al final se vuelve al cartesiano
 * con el J^-1 del punto de Gauss. En un RECTANGULO J es el mismo en los cuatro
 * puntos de atadura, entra y sale del promedio y da igual — por eso la version
 * cartesiana cerraba en rectangulo. Distorsionado NO: medido con un campo de
 * Kirchhoff EXACTO (donde γ tiene que ser 0) en los 5 elementos del patch test
 * 2-001 de SAP2000 salia γ_espurio/pendiente = 0.47 a 2.88.
 *
 * Reference: Dvorkin & Bathe, Eng. Comp. 1(1):77-88, 1984
 */
static Eigen::Matrix<double, 2, 12> shearBmitc4(
    const std::array<Node2D, 4>& nodes,
    double xi, double eta)
{
    auto Bs_A = shearBatCov(nodes, 0.0, -1.0);  // A = (0, -1)
    auto Bs_C = shearBatCov(nodes, 0.0, +1.0);  // C = (0, +1)
    auto Bs_B = shearBatCov(nodes, -1.0, 0.0);  // B = (-1, 0)
    auto Bs_D = shearBatCov(nodes, +1.0, 0.0);  // D = (+1, 0)

    Eigen::Matrix<double, 2, 12> Bcov = Eigen::Matrix<double, 2, 12>::Zero();
    // γ_ξ: se interpola A→C en η
    Bcov.row(0) = 0.5 * (1.0 - eta) * Bs_A.row(0) + 0.5 * (1.0 + eta) * Bs_C.row(0);
    // γ_η: se interpola B→D en ξ
    Bcov.row(1) = 0.5 * (1.0 - xi)  * Bs_B.row(1) + 0.5 * (1.0 + xi)  * Bs_D.row(1);

    // y de vuelta al cartesiano con el J^-1 de ESTE punto
    double dN[4][2];
    shapeFunctionDerivs(xi, eta, dN);
    double Jinv[2][2];
    jacobian(nodes, dN, Jinv);
    Eigen::Matrix2d JinvM;
    JinvM << Jinv[0][0], Jinv[0][1], Jinv[1][0], Jinv[1][1];
    return JinvM * Bcov;
}

// ── Element Stiffness Matrix ───────────────────────────────────────

Eigen::Matrix<double, 12, 12> elementStiffness(
    const std::array<Node2D, 4>& nodes,
    const Material& mat)
{
    Eigen::Matrix<double, 12, 12> Ke = Eigen::Matrix<double, 12, 12>::Zero();

    Eigen::Matrix3d Db = bendingConstitutive(mat);
    Eigen::Matrix2d Ds = shearConstitutive(mat);

    // ── Bending contribution: 2×2 Gauss quadrature ──
    for (int gp = 0; gp < 4; gp++) {
        double xi  = GP2_pts[gp][0];
        double eta = GP2_pts[gp][1];
        double wt  = GP2_wts[gp];

        double dN[4][2];
        shapeFunctionDerivs(xi, eta, dN);

        double Jinv[2][2];
        double detJ = jacobian(nodes, dN, Jinv);

        double dNdx[4][2];
        physicalDerivs(dN, Jinv, dNdx);

        auto Bb = bendingB(dNdx);

        // Kb += Bb^T · Db · Bb · |J| · weight
        Ke += wt * detJ * (Bb.transpose() * Db * Bb);
    }

    // ── Shear contribution: MITC4 (Assumed Natural Strain) + 2×2 Gauss ──
    // MITC4 ties shear strains at edge midpoints to prevent both
    // shear locking (thin plates) and hourglass zero-energy modes.
    for (int gp = 0; gp < 4; gp++) {
        double xi  = GP2_pts[gp][0];
        double eta = GP2_pts[gp][1];
        double wt  = GP2_wts[gp];

        double dN[4][2];
        shapeFunctionDerivs(xi, eta, dN);

        double Jinv[2][2];
        double detJ = jacobian(nodes, dN, Jinv);

        auto Bs = shearBmitc4(nodes, xi, eta);

        // Ks += Bs^T · Ds · Bs · |J| · weight
        Ke += wt * detJ * (Bs.transpose() * Ds * Bs);
    }

    return Ke;
}

// ── Element Load Vector ────────────────────────────────────────────

Eigen::Matrix<double, 12, 1> elementLoadUniform(
    const std::array<Node2D, 4>& nodes,
    double pressure)
{
    Eigen::Matrix<double, 12, 1> fe = Eigen::Matrix<double, 12, 1>::Zero();

    // 2×2 Gauss quadrature for consistent load vector
    for (int gp = 0; gp < 4; gp++) {
        double xi  = GP2_pts[gp][0];
        double eta = GP2_pts[gp][1];
        double wt  = GP2_wts[gp];

        double N[4];
        shapeFunctions(xi, eta, N);

        double dN[4][2];
        shapeFunctionDerivs(xi, eta, dN);

        double Jinv[2][2];
        double detJ = jacobian(nodes, dN, Jinv);

        // Pressure loads only on w DOFs
        for (int i = 0; i < 4; i++) {
            fe(3 * i) += N[i] * pressure * detJ * wt;
        }
    }
    return fe;
}

// ── Stress Resultant Recovery ──────────────────────────────────────

std::array<double, 5> elementStressResultants(
    const std::array<Node2D, 4>& nodes,
    const Material& mat,
    const Eigen::Matrix<double, 12, 1>& d_e)
{
    Eigen::Matrix3d Db = bendingConstitutive(mat);
    Eigen::Matrix2d Ds = shearConstitutive(mat);

    // Evaluate at element center (ξ=0, η=0)
    double N[4];
    shapeFunctions(0.0, 0.0, N);

    double dN[4][2];
    shapeFunctionDerivs(0.0, 0.0, dN);

    double Jinv[2][2];
    jacobian(nodes, dN, Jinv);

    double dNdx[4][2];
    physicalDerivs(dN, Jinv, dNdx);

    auto Bb = bendingB(dNdx);
    auto Bs = shearB(N, dNdx);

    Eigen::Vector3d kappa = Bb * d_e;     // curvatures
    Eigen::Vector2d gamma = Bs * d_e;     // shear strains

    Eigen::Vector3d M = Db * kappa;       // moments
    Eigen::Vector2d Q = Ds * gamma;       // shear forces

    return {M(0), M(1), M(2), Q(0), Q(1)};
}

// ── Global Assembly & Solve ────────────────────────────────────────

PlateResult solve(
    const std::vector<Node2D>& nodes,
    const std::vector<Element>& elements,
    const Material& mat,
    const std::vector<BC>& bcs,
    double pressure,
    const std::vector<PointLoad>& pointLoads,
    const std::vector<Spring>& springs,
    const std::vector<double>& thicknesses)
{
    bool perElemT = !thicknesses.empty() && static_cast<int>(thicknesses.size()) == static_cast<int>(elements.size());
    int nNodes = static_cast<int>(nodes.size());
    int nDofs  = nNodes * DOFS_PER_NODE;
    int nElems = static_cast<int>(elements.size());

    // ── Assemble global stiffness matrix (triplet format) ──
    using Triplet = Eigen::Triplet<double>;
    std::vector<Triplet> triplets;
    triplets.reserve(nElems * DOFS_PER_ELEM * DOFS_PER_ELEM);

    Eigen::VectorXd F = Eigen::VectorXd::Zero(nDofs);

    for (int e = 0; e < nElems; e++) {
        const auto& elem = elements[e];

        // Extract element nodes
        std::array<Node2D, 4> enodes;
        for (int i = 0; i < 4; i++) {
            enodes[i] = nodes[elem[i]];
        }

        // Element stiffness — use per-element thickness if provided (layered)
        Eigen::Matrix<double, 12, 12> Ke;
        if (mat.theory == PlateTheory::MINDLIN || mat.theory == PlateTheory::KIRCHHOFF) {
            // La placa de CSI (Thick) o la DKQ (Thin): las mismas de `deform`.
            Ke = plateKfromCSI(enodes, mat, perElemT ? thicknesses[e] : mat.t);
        } else if (perElemT) {
            // Manually compute Ke with per-element thickness
            Ke = Eigen::Matrix<double, 12, 12>::Zero();
            double t_e = thicknesses[e];
            Eigen::Matrix3d Db_e = bendingConstitutive(mat, t_e);
            Eigen::Matrix2d Ds_e = shearConstitutive(mat, t_e);
            // Bending part
            for (int gp = 0; gp < 4; gp++) {
                double xi = GP2_pts[gp][0], eta = GP2_pts[gp][1], wt = GP2_wts[gp];
                double dN[4][2]; shapeFunctionDerivs(xi, eta, dN);
                double Jinv[2][2]; double detJ = jacobian(enodes, dN, Jinv);
                double dNdx[4][2]; physicalDerivs(dN, Jinv, dNdx);
                auto Bb = bendingB(dNdx);
                Ke += wt * detJ * (Bb.transpose() * Db_e * Bb);
            }
            // Shear part (MITC4)
            for (int gp = 0; gp < 4; gp++) {
                double xi = GP2_pts[gp][0], eta = GP2_pts[gp][1], wt = GP2_wts[gp];
                double dN[4][2]; shapeFunctionDerivs(xi, eta, dN);
                double Jinv[2][2]; double detJ = jacobian(enodes, dN, Jinv);
                auto Bs = shearBmitc4(enodes, xi, eta);
                Ke += wt * detJ * (Bs.transpose() * Ds_e * Bs);
            }
        } else {
            Ke = elementStiffness(enodes, mat);
        }

        // Element load
        auto fe = elementLoadUniform(enodes, pressure);

        // DOF mapping: local DOF j → global DOF
        int dofMap[12];
        for (int i = 0; i < 4; i++) {
            for (int d = 0; d < 3; d++) {
                dofMap[3 * i + d] = 3 * elem[i] + d;
            }
        }

        // Scatter to global
        for (int ii = 0; ii < 12; ii++) {
            F(dofMap[ii]) += fe(ii);
            for (int jj = 0; jj < 12; jj++) {
                triplets.emplace_back(dofMap[ii], dofMap[jj], Ke(ii, jj));
            }
        }
    }

    // Add point loads
    for (const auto& pl : pointLoads) {
        F(3 * pl.node + pl.dof) += pl.value;
    }

    // Add spring supports: K(gdof, gdof) += k
    // This models elastic foundations (Winkler springs), partial restraints, etc.
    for (const auto& sp : springs) {
        int gdof = 3 * sp.node + sp.dof;
        triplets.emplace_back(gdof, gdof, sp.k);
    }

    // ── Assemble sparse K ──
    Eigen::SparseMatrix<double> K(nDofs, nDofs);
    K.setFromTriplets(triplets.begin(), triplets.end());

    // ── Apply boundary conditions (penalty method) ──
    // Using large number penalty for simplicity and sparsity preservation
    double penalty = 1.0e20;
    for (const auto& bc : bcs) {
        int gdof = 3 * bc.node + bc.dof;
        K.coeffRef(gdof, gdof) += penalty;
        F(gdof) += penalty * bc.value;
    }

    // ── Solve K·u = F ──
    Eigen::SimplicialLDLT<Eigen::SparseMatrix<double>> solver;
    solver.compute(K);
    assert(solver.info() == Eigen::Success && "Matrix factorization failed");

    Eigen::VectorXd u = solver.solve(F);
    assert(solver.info() == Eigen::Success && "Linear solve failed");

    // ── Recover stress resultants ──
    PlateResult result;
    result.displacements = u;
    result.Mxx.resize(nElems);
    result.Myy.resize(nElems);
    result.Mxy.resize(nElems);
    result.Qx.resize(nElems);
    result.Qy.resize(nElems);

    for (int e = 0; e < nElems; e++) {
        const auto& elem = elements[e];

        std::array<Node2D, 4> enodes;
        Eigen::Matrix<double, 12, 1> d_e;
        for (int i = 0; i < 4; i++) {
            enodes[i] = nodes[elem[i]];
            d_e(3 * i)     = u(3 * elem[i]);
            d_e(3 * i + 1) = u(3 * elem[i] + 1);
            d_e(3 * i + 2) = u(3 * elem[i] + 2);
        }

        // Use per-element material for stress recovery if provided (layered)
        std::array<double, 5> sr;
        if (perElemT) {
            Material mat_e = mat;
            mat_e.t = thicknesses[e];
            sr = elementStressResultants(enodes, mat_e, d_e);
        } else {
            sr = elementStressResultants(enodes, mat, d_e);
        }
        result.Mxx[e] = sr[0];
        result.Myy[e] = sr[1];
        result.Mxy[e] = sr[2];
        result.Qx[e]  = sr[3];
        result.Qy[e]  = sr[4];
    }

    return result;
}

// ── Mesh Generation ────────────────────────────────────────────────

void generateRectMesh(
    double Lx, double Ly, int nx, int ny,
    std::vector<Node2D>& nodes,
    std::vector<Element>& elements)
{
    nodes.clear();
    elements.clear();

    double dx = Lx / nx;
    double dy = Ly / ny;

    // Nodes: (nx+1) × (ny+1) grid
    for (int j = 0; j <= ny; j++) {
        for (int i = 0; i <= nx; i++) {
            nodes.push_back({i * dx, j * dy});
        }
    }

    // Elements: nx × ny quads (CCW node ordering)
    for (int j = 0; j < ny; j++) {
        for (int i = 0; i < nx; i++) {
            int n1 = j * (nx + 1) + i;
            int n2 = n1 + 1;
            int n3 = n2 + (nx + 1);
            int n4 = n1 + (nx + 1);
            elements.push_back({n1, n2, n3, n4});
        }
    }
}

// ── Boundary Conditions ────────────────────────────────────────────

std::vector<BC> bcSimplySupported(
    const std::vector<Node2D>& nodes,
    double Lx, double Ly, double tol)
{
    std::vector<BC> bcs;
    for (int i = 0; i < static_cast<int>(nodes.size()); i++) {
        double x = nodes[i].x, y = nodes[i].y;
        bool onBoundary = (x < tol || x > Lx - tol ||
                           y < tol || y > Ly - tol);
        if (onBoundary) {
            bcs.push_back({i, 0, 0.0});  // w = 0
        }
    }
    return bcs;
}

std::vector<BC> bcClamped(
    const std::vector<Node2D>& nodes,
    double Lx, double Ly, double tol)
{
    std::vector<BC> bcs;
    for (int i = 0; i < static_cast<int>(nodes.size()); i++) {
        double x = nodes[i].x, y = nodes[i].y;
        bool onBoundary = (x < tol || x > Lx - tol ||
                           y < tol || y > Ly - tol);
        if (onBoundary) {
            bcs.push_back({i, 0, 0.0});  // w = 0
            bcs.push_back({i, 1, 0.0});  // βx = 0
            bcs.push_back({i, 2, 0.0});  // βy = 0
        }
    }
    return bcs;
}

} // namespace plate_q4
