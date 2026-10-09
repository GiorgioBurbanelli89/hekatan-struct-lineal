#include "../data-model.h"
#include "hex8Stiffness.h"
#include <vector>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <iostream> // Keep for potential warnings
#include <iomanip>
#include <stdexcept>

// Function to assemble the global stiffness matrix from individual element stiffness matrices.
Eigen::SparseMatrix<double> getGlobalStiffnessMatrix(
    const std::vector<Node> &nodes,                    // All nodes in the model
    const std::vector<unsigned int> &element_indices, // Flat list of node indices for all elements
    const std::vector<unsigned int> &elementSizes,     // List of node counts for each element
    const ElementInputs &elementInputs,                // Material and geometric properties for elements
    int dof)                                           // Total degrees of freedom for the model (num_nodes * 6)
{
    // Use a triplet list for efficient sparse matrix construction
    std::vector<Eigen::Triplet<double>> tripletList;
    // Reserve space to potentially avoid reallocations (rough estimate)
    tripletList.reserve(elementSizes.size() * 18 * 18); // Max size for plate elements

    int current_element_node_idx = 0; // Tracks the starting index in element_indices for the current element
    for (int i = 0; i < elementSizes.size(); ++i) // Loop through each element
    {
        unsigned int numElementNodes = elementSizes[i]; // Number of nodes in the current element (2 or 3)
        std::vector<Node> elmNodes;                     // Nodes belonging to the current element
        Element currentElementIndices;                  // Global indices of the nodes in the current element
        elmNodes.reserve(numElementNodes);
        currentElementIndices.reserve(numElementNodes);

        // Extract nodes and their global indices for the current element
        for (unsigned int j = 0; j < numElementNodes; ++j)
        {
            unsigned int nodeIndex = element_indices[current_element_node_idx + j];
            elmNodes.push_back(nodes[nodeIndex]);
            currentElementIndices.push_back(nodeIndex);
        }

        // SOLIDO H8: 3 gdl por nudo (ux, uy, uz) en la K de 6 por nudo; los giros
        // de un nudo que solo toca solidos quedan sin rigidez y los saca
        // getZerosIndices. Asi barras, cascaras y solidos van en la misma K.
        if (numElementNodes == 8)
        {
            double X[8][3];
            for (int j = 0; j < 8; j++) for (int d = 0; d < 3; d++) X[j][d] = elmNodes[j][d];
            const auto itE = elementInputs.elasticities.find(i);
            const auto itN = elementInputs.poissonsRatios.find(i);
            const double E8 = itE != elementInputs.elasticities.end() ? itE->second : 0.0;
            const double nu8 = itN != elementInputs.poissonsRatios.end() ? itN->second : 0.0;
            const Eigen::Matrix<double, 24, 24> K8 = hk8::stiffness(X, E8, nu8, elementInputs.solidIncompatible);
            for (int a = 0; a < 8; a++)
                for (int da = 0; da < 3; da++)
                    for (int b = 0; b < 8; b++)
                        for (int db = 0; db < 3; db++)
                        {
                            const double v = K8(3 * a + da, 3 * b + db);
                            if (std::abs(v) > 1e-15)
                                tripletList.emplace_back(currentElementIndices[a] * 6 + da, currentElementIndices[b] * 6 + db, v);
                        }
            current_element_node_idx += numElementNodes;
            continue;
        }

        // Calculate the local stiffness matrix (kLocal) for the element
        Eigen::MatrixXd kLocal = getLocalStiffnessMatrix(elmNodes, elementInputs, i);

        // PUNTO DE INSERCION: la barra (centroide) esta desplazada del nudo por r = (0, d2, d3) en ejes
        // locales. u_centroide = u_nudo + theta x r  ->  K = R^T K R, igual en los dos extremos.
        if (numElementNodes == 2)
        {
            const auto itIns = elementInputs.insertion.find(i);
            if (itIns != elementInputs.insertion.end() && (std::abs(itIns->second[0]) > 1e-12 || std::abs(itIns->second[1]) > 1e-12))
            {
                const double d2 = itIns->second[0], d3 = itIns->second[1];
                Eigen::MatrixXd Ri = Eigen::MatrixXd::Identity(12, 12);
                for (int o = 0; o <= 6; o += 6)
                {
                    Ri(o + 0, o + 4) = d3;  Ri(o + 0, o + 5) = -d2;
                    Ri(o + 1, o + 3) = -d3;
                    Ri(o + 2, o + 3) = d2;
                }
                kLocal = Ri.transpose() * kLocal * Ri;
            }
        }

        // Calculate the transformation matrix (T) for the element
        // El angulo de eje local de la barra entra AQUI: gira el marco local
        // antes de llevar kLocal a globales.
        double angEl = 0.0;
        {
            auto itA = elementInputs.localAngles.find(i);
            if (itA != elementInputs.localAngles.end()) angEl = itA->second;
        }
        Eigen::MatrixXd T = getTransformationMatrix(elmNodes, angEl);

        // Transform the local stiffness matrix to global coordinates: K_global_element = T^T * kLocal * T
        Eigen::MatrixXd kGlobalElement = T.transpose() * kLocal * T;

        // Apply rigid end offsets: K_offset = R^T * K * R
        if (numElementNodes == 2)
        {
            auto itOff = elementInputs.rigidOffsets.find(i);
            if (itOff != elementInputs.rigidOffsets.end() && itOff->second.size() >= 2)
            {
                double factI = itOff->second[0];
                double factJ = itOff->second[1];
                if (factI > 1e-12 || factJ > 1e-12)
                {
                    Eigen::Vector3d n0(elmNodes[0][0], elmNodes[0][1], elmNodes[0][2]);
                    Eigen::Vector3d n1(elmNodes[1][0], elmNodes[1][1], elmNodes[1][2]);
                    double L = (n1 - n0).norm();
                    double oI = factI * L;
                    double oJ = factJ * L;

                    // Build 12x12 rigid offset matrix R
                    Eigen::MatrixXd R = Eigen::MatrixXd::Identity(12, 12);
                    if (std::abs(oI) > 1e-12) {
                        R(1, 5) = -oI;  // uy couples with -oI * rz
                        R(2, 4) =  oI;  // uz couples with +oI * ry
                    }
                    if (std::abs(oJ) > 1e-12) {
                        R(7, 11) =  oJ; // uy_J couples with +oJ * rz_J
                        R(8, 10) = -oJ; // uz_J couples with -oJ * ry_J
                    }

                    kGlobalElement = R.transpose() * kGlobalElement * R;
                }
            }
        }

        // Assemble the element's global stiffness matrix into the overall global stiffness matrix (triplet list)
        for (unsigned int rowNodeIdx = 0; rowNodeIdx < numElementNodes; ++rowNodeIdx) // Iterate over element's nodes (rows)
        {
            for (int rowDof = 0; rowDof < 6; ++rowDof) // Iterate over DOFs for the row node
            {
                int globalRow = currentElementIndices[rowNodeIdx] * 6 + rowDof; // Map element DOF to global DOF index

                for (unsigned int colNodeIdx = 0; colNodeIdx < numElementNodes; ++colNodeIdx) // Iterate over element's nodes (columns)
                {
                    for (int colDof = 0; colDof < 6; ++colDof) // Iterate over DOFs for the column node
                    {
                        int globalCol = currentElementIndices[colNodeIdx] * 6 + colDof; // Map element DOF to global DOF index

                        // Get the value from the transformed element stiffness matrix
                        double value = kGlobalElement(rowNodeIdx * 6 + rowDof, colNodeIdx * 6 + colDof);

                        // Add the value to the triplet list if it's non-negligible
                        if (std::abs(value) > 1e-15) // Tolerance to avoid adding tiny floating point errors
                        {
                            tripletList.emplace_back(globalRow, globalCol, value);
                        }
                    }
                }
            }
        }

        // Move to the next element's starting index in element_indices
        current_element_node_idx += numElementNodes;
    }

    // Create the final sparse global stiffness matrix from the triplets
    Eigen::SparseMatrix<double> K(dof, dof);
    K.setFromTriplets(tripletList.begin(), tripletList.end());
    // Eigen automatically sums up duplicate entries in setFromTriplets

    return K;
}

