/**
 * Lumped Mass Matrix (HRZ method) — formulación SAP2000/ETABS según
 * CSI Analysis Reference Manual §6.10 (Frame) y §10.10 (Shell):
 *
 *   "The mass contributed by the Frame element is lumped at the joints i and j.
 *    No inertial effects are considered within the element itself. The total mass
 *    is applied to each of the three translational degrees of freedom: UX, UY, UZ.
 *    No mass moments of inertia are computed for the rotational degrees of freedom."
 *
 *   "For computational efficiency and solution accuracy, SAP2000 ALWAYS uses
 *    lumped masses. This means there is no mass coupling between degrees of
 *    freedom at a joint or between different joints."
 *
 * Para Frame (2 nodos):
 *     m_total = ρ · A · L
 *     m_per_node = m_total / 2  (distribuida igual a ambos joints)
 *     M[node·6 + {0,1,2}] += m_per_node       (Ux, Uy, Uz)
 *     M[node·6 + {3,4,5}] += m_per_node·ε      (Rx, Ry, Rz: ε=1e-9 para evitar
 *                                                singularidad numérica del solver
 *                                                de eigenvalores generalizado)
 *
 * Para Shell Q4 (4 nodos):
 *     m_total = ρ · A_shell · t
 *     m_per_node = m_total / 4   (HRZ uncoupled lumping, Hinton-Rock-Zienkiewicz 1976)
 *     M[node·6 + {0,1,2}] += m_per_node
 *     M[node·6 + {3,4,5}] += m_per_node·ε
 *
 * Resultado: matriz de masa diagonal (no hay coupling entre DOFs ni nodos),
 * masa rotacional ≈ 0 → los modos rotacionales locales NO aparecen en frecuencias
 * bajas. Los modos visibles son SOLO traslacionales (Ux, Uy, Uz), exactamente
 * como SAP2000/ETABS.
 *
 * Esto reemplaza la versión anterior que usaba consistent mass M = ∫ N^T·ρ·N dV
 * (causaba modos verticales Uz dominantes en edificios con losas, problema
 * reportado por usuarios al comparar con ETABS).
 */
#include "../data-model.h"
#include "hex8Stiffness.h"
#include <vector>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <iostream>

namespace {

/** Factor pequeño para masa rotacional (evita singularidad del solver eigen). */
constexpr double ROT_MASS_EPSILON = 1e-9;

/** Longitud de un elemento frame (2 nodos). */
double frameLength(const std::vector<Node> &elmNodes) {
    double dx = elmNodes[1][0] - elmNodes[0][0];
    double dy = elmNodes[1][1] - elmNodes[0][1];
    double dz = elmNodes[1][2] - elmNodes[0][2];
    return std::sqrt(dx*dx + dy*dy + dz*dz);
}

/** Área de un cuadrilátero por la fórmula del shoelace en 3D
 *  (válida para cuadriláteros casi planos). */
double quadArea(const std::vector<Node> &elmNodes) {
    // Diagonales para el área = 0.5 · |d1 × d2|
    double d1x = elmNodes[2][0] - elmNodes[0][0];
    double d1y = elmNodes[2][1] - elmNodes[0][1];
    double d1z = elmNodes[2][2] - elmNodes[0][2];
    double d2x = elmNodes[3][0] - elmNodes[1][0];
    double d2y = elmNodes[3][1] - elmNodes[1][1];
    double d2z = elmNodes[3][2] - elmNodes[1][2];
    double cx = d1y*d2z - d1z*d2y;
    double cy = d1z*d2x - d1x*d2z;
    double cz = d1x*d2y - d1y*d2x;
    return 0.5 * std::sqrt(cx*cx + cy*cy + cz*cz);
}

/** Área triangular (3 nodos). */
double triangleArea(const std::vector<Node> &elmNodes) {
    double ax = elmNodes[1][0] - elmNodes[0][0];
    double ay = elmNodes[1][1] - elmNodes[0][1];
    double az = elmNodes[1][2] - elmNodes[0][2];
    double bx = elmNodes[2][0] - elmNodes[0][0];
    double by = elmNodes[2][1] - elmNodes[0][1];
    double bz = elmNodes[2][2] - elmNodes[0][2];
    double cx = ay*bz - az*by;
    double cy = az*bx - ax*bz;
    double cz = ax*by - ay*bx;
    return 0.5 * std::sqrt(cx*cx + cy*cy + cz*cz);
}

} // namespace

Eigen::SparseMatrix<double> getGlobalMassMatrix(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &elementSizes,
    const ElementInputs &elementInputs,
    int dof)
{
    std::vector<Eigen::Triplet<double>> tripletList;
    tripletList.reserve(elementSizes.size() * 12); // 6 DOFs × 2 nodos típico

    int current_element_node_idx = 0;
    for (size_t i = 0; i < elementSizes.size(); ++i)
    {
        unsigned int numElementNodes = elementSizes[i];
        std::vector<Node> elmNodes;
        std::vector<unsigned int> currentElementIndices;
        elmNodes.reserve(numElementNodes);
        currentElementIndices.reserve(numElementNodes);

        for (unsigned int j = 0; j < numElementNodes; ++j)
        {
            unsigned int nodeIndex = element_indices[current_element_node_idx + j];
            elmNodes.push_back(nodes[nodeIndex]);
            currentElementIndices.push_back(nodeIndex);
        }

        // ── Calcular masa total del elemento (m_total = ρ · V) ──
        double rho = 0.0;
        auto itRho = elementInputs.densities.find((unsigned int)i);
        if (itRho != elementInputs.densities.end()) rho = itRho->second;
        if (rho <= 0.0) {
            current_element_node_idx += numElementNodes;
            continue; // sin densidad → sin masa
        }

        double m_total = 0.0;
        // Shell Q4: masa TRIBUTARIA por nudo, m_i = ρ·t·∫N_i dA (Gauss 2×2, jacobiano real 3D).
        // MEDIDO en SAP2000 24 (cli/_sap_masa_trapecio.py, 14-sep-2026): un trapecio (0,0)(4,0)(3,2)(1,2)
        // t 0.2 ρ 2.4 da «Assembled Joint Masses» 0.80/0.80/0.64/0.64 t = ∫N dA exacto; el reparto
        // área/4 de antes daba 0.72 en los cuatro. En rectángulos y paralelogramos coinciden (jacobiano
        // constante) y por eso los modelos rectangulares daban 0.0000 %; en la cúpula metálica (coronas y
        // parches trapeciales) los periodos salían hasta +1.4 % contra SAP2000.
        if (numElementNodes == 4) {
            double t = 0.0;
            auto itT = elementInputs.thicknesses.find((unsigned int)i);
            if (itT != elementInputs.thicknesses.end()) t = itT->second;
            const double g = 1.0 / std::sqrt(3.0);
            const double GP[4][2] = {{-g, -g}, {g, -g}, {g, g}, {-g, g}};
            double mi[4] = {0, 0, 0, 0};
            for (const auto &q : GP) {
                const double xi = q[0], eta = q[1];
                const double N[4] = {0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta),
                                     0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta)};
                const double dNx[4] = {-0.25 * (1 - eta), 0.25 * (1 - eta), 0.25 * (1 + eta), -0.25 * (1 + eta)};
                const double dNe[4] = {-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi)};
                double a[3] = {0, 0, 0}, b[3] = {0, 0, 0};
                for (int k = 0; k < 4; k++)
                    for (int d = 0; d < 3; d++) { a[d] += dNx[k] * elmNodes[k][d]; b[d] += dNe[k] * elmNodes[k][d]; }
                const double cx = a[1] * b[2] - a[2] * b[1], cy = a[2] * b[0] - a[0] * b[2], cz = a[0] * b[1] - a[1] * b[0];
                const double dA = std::sqrt(cx * cx + cy * cy + cz * cz);
                for (int k = 0; k < 4; k++) mi[k] += N[k] * dA * rho * t;
            }
            for (int n = 0; n < 4; ++n) {
                int gdof_base = (int)currentElementIndices[n] * 6;
                tripletList.emplace_back(gdof_base + 0, gdof_base + 0, mi[n]);
                tripletList.emplace_back(gdof_base + 1, gdof_base + 1, mi[n]);
                tripletList.emplace_back(gdof_base + 2, gdof_base + 2, mi[n]);
                tripletList.emplace_back(gdof_base + 3, gdof_base + 3, mi[n] * ROT_MASS_EPSILON);
                tripletList.emplace_back(gdof_base + 4, gdof_base + 4, mi[n] * ROT_MASS_EPSILON);
                tripletList.emplace_back(gdof_base + 5, gdof_base + 5, mi[n] * ROT_MASS_EPSILON);
            }
            current_element_node_idx += numElementNodes;
            continue;
        }
        if (numElementNodes == 2) {
            // Frame: V = A · L
            double A = 0.0;
            auto itA = elementInputs.areas.find((unsigned int)i);
            if (itA != elementInputs.areas.end()) A = itA->second;
            double L = frameLength(elmNodes);
            m_total = rho * A * L;
        } else if (numElementNodes == 4) {
            // Shell Q4: V = A_shell · t
            double t = 0.0;
            auto itT = elementInputs.thicknesses.find((unsigned int)i);
            if (itT != elementInputs.thicknesses.end()) t = itT->second;
            double A_shell = quadArea(elmNodes);
            m_total = rho * A_shell * t;
        } else if (numElementNodes == 3) {
            // Triangle: V = A_tri · t
            double t = 0.0;
            auto itT = elementInputs.thicknesses.find((unsigned int)i);
            if (itT != elementInputs.thicknesses.end()) t = itT->second;
            double A_tri = triangleArea(elmNodes);
            m_total = rho * A_tri * t;
        } else if (numElementNodes == 8) {
            // Solido H8: V por Gauss; masa a partes iguales en los 8 nudos
            double X[8][3];
            for (int j = 0; j < 8; j++) for (int d = 0; d < 3; d++) X[j][d] = elmNodes[j][d];
            m_total = rho * hk8::volume(X);
        }

        if (m_total <= 0.0) {
            current_element_node_idx += numElementNodes;
            continue;
        }

        // ── Distribuir igual a cada nodo (lumped HRZ uncoupled) ──
        double m_per_node = m_total / static_cast<double>(numElementNodes);

        // ── Asignar SOLO a DOFs traslacionales (Ux, Uy, Uz) ──
        // Masa rotacional ≈ 0 (con epsilon para evitar singularidad numérica).
        // Esto es la formulación SAP/ETABS según CSI Manual §6.10 / §10.10.
        for (unsigned int n = 0; n < numElementNodes; ++n) {
            unsigned int nodeIdx = currentElementIndices[n];
            int gdof_base = nodeIdx * 6;
            tripletList.emplace_back(gdof_base + 0, gdof_base + 0, m_per_node); // Ux
            tripletList.emplace_back(gdof_base + 1, gdof_base + 1, m_per_node); // Uy
            tripletList.emplace_back(gdof_base + 2, gdof_base + 2, m_per_node); // Uz
            // Rx, Ry, Rz: epsilon × m_per_node para evitar singularidad
            tripletList.emplace_back(gdof_base + 3, gdof_base + 3, m_per_node * ROT_MASS_EPSILON);
            tripletList.emplace_back(gdof_base + 4, gdof_base + 4, m_per_node * ROT_MASS_EPSILON);
            tripletList.emplace_back(gdof_base + 5, gdof_base + 5, m_per_node * ROT_MASS_EPSILON);
        }

        current_element_node_idx += numElementNodes;
    }

    Eigen::SparseMatrix<double> M(dof, dof);
    M.setFromTriplets(tripletList.begin(), tripletList.end(), [](double a, double b){ return a + b; });

    return M;
}
