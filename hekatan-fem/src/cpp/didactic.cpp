/**
 * Didactic FEM Solver — C++/WASM
 *
 * Unlike deform() which is a black box, this solver returns ALL intermediate steps:
 * - Per element: K_local, T, K_global, properties (E, A, Iz, Iy, G, J, t, nu, L, phi)
 * - Global: K_assembled (sparse triplets), F_applied, U_full, R_full
 * - DOF info: free/fixed DOF indices
 *
 * Output layout (flat double arrays):
 *   elem_data:    [nElems, elem0_offset, elem1_offset, ..., elemN_offset, DATA...]
 *   Per element:  [elemIdx, type(0=frame,1=Q4), nDOF,
 *                  K_local[nDOF*nDOF], T[nDOF*nDOF], K_global[nDOF*nDOF],
 *                  lambda[9],
 *                  L, E, A, Iz, Iy, G, J, t, nu, phiZ, phiY]
 *   type: 0=frame(12DOF), 1=shellQ4(24DOF)
 *
 *   K_triplets:   [nnz, row0, col0, val0, row1, col1, val1, ...]
 *   solution:     [nDOF, F[nDOF], U[nDOF], R[nDOF], nFree, freeDOFs..., nFixed, fixedDOFs...]
 */

#include "data-model.h"
#include <vector>
#include <map>
#include <algorithm>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <iostream>

// Forward declarations for existing utils
Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex);

// getTransformationMatrix ya viene declarada en data-model.h, con el angulo de
// eje local como 2o argumento por defecto. Repetirla aqui SIN ese argumento
// creaba dos sobrecargas y la llamada salia ambigua.

Eigen::SparseMatrix<double> getGlobalStiffnessMatrix(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &elementSizes,
    const ElementInputs &elementInputs,
    int dof);

Eigen::VectorXd getForces(const NodeInputs &nodeInputs, int dof);
std::vector<int> getFreeIndices(const NodeInputs &nodeInputs, int dof);
std::vector<int> getZerosIndices(const Eigen::SparseMatrix<double> &matrix);
Eigen::SparseMatrix<double> getReducedMatrix(
    const Eigen::SparseMatrix<double> &matrix,
    const std::vector<int> &reducedIndices);
Eigen::VectorXd getReducedVector(
    const Eigen::VectorXd &vector,
    const std::vector<int> &reducedIndices);

// Map helper
template <typename K, typename V>
V getMapValueOrDefault(const std::map<K, V> &map, const K &key, const V &defaultValue)
{
    auto it = map.find(key);
    return it != map.end() ? it->second : defaultValue;
}

// Helper: flatten Eigen matrix row-major into a vector
static void flattenMatrix(const Eigen::MatrixXd &M, std::vector<double> &out)
{
    int rows = M.rows(), cols = M.cols();
    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            out.push_back(M(i, j));
}

extern "C"
{
    void didactic_solve(
        // --- Inputs (same as deform) ---
        double *nodes_flat_ptr, int num_nodes,
        unsigned int *element_indices_ptr, int num_element_indices,
        unsigned int *element_sizes_ptr, int num_elements,

        // Node Inputs
        int *support_keys_ptr, bool *support_values_ptr, int num_supports,
        int *load_keys_ptr, double *load_values_ptr, int num_loads,

        // Element Inputs
        int *elasticity_keys_ptr, double *elasticity_values_ptr, int num_elasticities,
        int *area_keys_ptr, double *area_values_ptr, int num_areas,
        int *moi_z_keys_ptr, double *moi_z_values_ptr, int num_moi_z,
        int *moi_y_keys_ptr, double *moi_y_values_ptr, int num_moi_y,
        int *shear_mod_keys_ptr, double *shear_mod_values_ptr, int num_shear_mod,
        int *torsion_keys_ptr, double *torsion_values_ptr, int num_torsion,
        int *thickness_keys_ptr, double *thickness_values_ptr, int num_thickness,
        int *poisson_keys_ptr, double *poisson_values_ptr, int num_poisson,
        int *shear_area_y_keys_ptr, double *shear_area_y_values_ptr, int num_shear_area_y,
        int *shear_area_z_keys_ptr, double *shear_area_z_values_ptr, int num_shear_area_z,

        // --- Outputs ---
        double **elem_data_ptr_out, int *elem_data_size_out,
        double **k_triplets_ptr_out, int *k_triplets_size_out,
        double **solution_ptr_out, int *solution_size_out,

        // --- Formulacion de la cascara (29-sep-2026) ---
        // AL FINAL, detras de las salidas, como los brazos rigidos de `deform`: un llamador
        // viejo pasa menos argumentos, el wasm los rellena con 0 y todo queda como antes
        // (MITC4 + ITW tipo 13). Sin esto la K de un pano DKMQ, DSE o DKT no se podia leer
        // del motor: `getLocalStiffnessMatrix` elige la placa por `plateFormulations`.
        int *plateForm_keys_ptr = nullptr, int *plateForm_values_ptr = nullptr, int num_plateForm = 0,
        int *drillType_keys_ptr = nullptr, int *drillType_values_ptr = nullptr, int num_drillType = 0,
        int *drillScale_keys_ptr = nullptr, double *drillScale_values_ptr = nullptr, int num_drillScale = 0)
    {
        // Initialize outputs
        *elem_data_ptr_out = nullptr;
        *elem_data_size_out = 0;
        *k_triplets_ptr_out = nullptr;
        *k_triplets_size_out = 0;
        *solution_ptr_out = nullptr;
        *solution_size_out = 0;

        // --- 1. Parse Inputs ---
        std::vector<Node> nodes(num_nodes, Node(3));
        for (int i = 0; i < num_nodes; ++i)
        {
            nodes[i][0] = nodes_flat_ptr[i * 3 + 0];
            nodes[i][1] = nodes_flat_ptr[i * 3 + 1];
            nodes[i][2] = nodes_flat_ptr[i * 3 + 2];
        }

        std::vector<unsigned int> element_indices(element_indices_ptr, element_indices_ptr + num_element_indices);
        std::vector<unsigned int> element_sizes(element_sizes_ptr, element_sizes_ptr + num_elements);

        NodeInputs nodeInputs;
        nodeInputs.supports = parseMapBoolVecFromFlat(support_keys_ptr, support_values_ptr, num_supports, 6);
        nodeInputs.loads = parseMapVecFromFlat(load_keys_ptr, load_values_ptr, num_loads, 6);

        ElementInputs elementInputs;
        elementInputs.elasticities = parseMapFromFlat(elasticity_keys_ptr, elasticity_values_ptr, num_elasticities);
        elementInputs.areas = parseMapFromFlat(area_keys_ptr, area_values_ptr, num_areas);
        elementInputs.momentsOfInertiaZ = parseMapFromFlat(moi_z_keys_ptr, moi_z_values_ptr, num_moi_z);
        elementInputs.momentsOfInertiaY = parseMapFromFlat(moi_y_keys_ptr, moi_y_values_ptr, num_moi_y);
        elementInputs.shearModuli = parseMapFromFlat(shear_mod_keys_ptr, shear_mod_values_ptr, num_shear_mod);
        elementInputs.torsionalConstants = parseMapFromFlat(torsion_keys_ptr, torsion_values_ptr, num_torsion);
        elementInputs.thicknesses = parseMapFromFlat(thickness_keys_ptr, thickness_values_ptr, num_thickness);
        elementInputs.poissonsRatios = parseMapFromFlat(poisson_keys_ptr, poisson_values_ptr, num_poisson);
        elementInputs.shearAreasY = parseMapFromFlat(shear_area_y_keys_ptr, shear_area_y_values_ptr, num_shear_area_y);
        elementInputs.shearAreasZ = parseMapFromFlat(shear_area_z_keys_ptr, shear_area_z_values_ptr, num_shear_area_z);
        if (num_plateForm > 0 && plateForm_keys_ptr)
            elementInputs.plateFormulations = parseMapIntFromFlat(plateForm_keys_ptr, plateForm_values_ptr, num_plateForm);
        if (num_drillType > 0 && drillType_keys_ptr)
            elementInputs.drillingTypes = parseMapIntFromFlat(drillType_keys_ptr, drillType_values_ptr, num_drillType);
        if (num_drillScale > 0 && drillScale_keys_ptr)
            elementInputs.drillingPenaltyScales = parseMapFromFlat(drillScale_keys_ptr, drillScale_values_ptr, num_drillScale);

        int dof = num_nodes * 6;

        // --- 2. Per-element computation: K_local, T, K_global ---
        // Build elem_data: [nElems, offset0, offset1, ..., offsetN, DATA...]
        std::vector<double> elem_data;
        elem_data.push_back(static_cast<double>(num_elements)); // nElems

        // Reserve space for offsets (will be filled after computing)
        size_t offsets_start = elem_data.size();
        for (int e = 0; e < num_elements; e++)
            elem_data.push_back(0.0); // placeholder

        int idx_offset = 0;
        for (int e = 0; e < num_elements; e++)
        {
            // Record offset
            elem_data[offsets_start + e] = static_cast<double>(elem_data.size());

            int sz = element_sizes[e];
            int nLocalDOF = sz * 6; // 2 nodes → 12, 4 nodes → 24

            // Extract element nodes
            std::vector<Node> elNodes(sz);
            for (int j = 0; j < sz; j++)
                elNodes[j] = nodes[element_indices[idx_offset + j]];

            // Element type: 0=frame(2-node), 1=Q4(4-node)
            double elemType = (sz == 2) ? 0.0 : 1.0;

            // Get properties
            double E = getMapValueOrDefault(elementInputs.elasticities, e, 0.0);
            double A = getMapValueOrDefault(elementInputs.areas, e, 0.0);
            double Iz = getMapValueOrDefault(elementInputs.momentsOfInertiaZ, e, 0.0);
            double Iy = getMapValueOrDefault(elementInputs.momentsOfInertiaY, e, 0.0);
            double G = getMapValueOrDefault(elementInputs.shearModuli, e, 0.0);
            double Jt = getMapValueOrDefault(elementInputs.torsionalConstants, e, 0.0);
            double t = getMapValueOrDefault(elementInputs.thicknesses, e, 0.0);
            double nu = getMapValueOrDefault(elementInputs.poissonsRatios, e, 0.0);
            double AsY = getMapValueOrDefault(elementInputs.shearAreasY, e, 0.0);
            double AsZ = getMapValueOrDefault(elementInputs.shearAreasZ, e, 0.0);

            // Compute element length (for frames)
            double L = 0.0;
            if (sz == 2)
            {
                double dx = elNodes[1][0] - elNodes[0][0];
                double dy = elNodes[1][1] - elNodes[0][1];
                double dz = elNodes[1][2] - elNodes[0][2];
                L = std::sqrt(dx * dx + dy * dy + dz * dz);
            }

            // Timoshenko parameters
            double phiZ = 0.0, phiY = 0.0;
            if (sz == 2 && L > 0)
            {
                if (AsZ > 0 && G > 0)
                    phiZ = (12.0 * E * Iz) / (G * AsZ * L * L);
                if (AsY > 0 && G > 0)
                    phiY = (12.0 * E * Iy) / (G * AsY * L * L);
            }

            // Get K_local using existing utility
            Eigen::MatrixXd K_local = getLocalStiffnessMatrix(elNodes, elementInputs, e);

            // Get T using existing utility
            Eigen::MatrixXd T = getTransformationMatrix(elNodes);

            // Compute K_global = T^T * K_local * T
            Eigen::MatrixXd K_global = T.transpose() * K_local * T;

            // Extract lambda (direction cosines, 3x3 from T)
            Eigen::Matrix3d lambda = T.block<3, 3>(0, 0);

            // Write element data
            elem_data.push_back(static_cast<double>(e));      // elemIdx
            elem_data.push_back(elemType);                      // type
            elem_data.push_back(static_cast<double>(nLocalDOF)); // nDOF

            // K_local (nDOF x nDOF, row-major)
            flattenMatrix(K_local, elem_data);

            // T (nDOF x nDOF, row-major)
            flattenMatrix(T, elem_data);

            // K_global (nDOF x nDOF, row-major)
            flattenMatrix(K_global, elem_data);

            // lambda (3x3)
            flattenMatrix(lambda, elem_data);

            // Properties: L, E, A, Iz, Iy, G, J, t, nu, phiZ, phiY (11 values)
            elem_data.push_back(L);
            elem_data.push_back(E);
            elem_data.push_back(A);
            elem_data.push_back(Iz);
            elem_data.push_back(Iy);
            elem_data.push_back(G);
            elem_data.push_back(Jt);
            elem_data.push_back(t);
            elem_data.push_back(nu);
            elem_data.push_back(phiZ);
            elem_data.push_back(phiY);

            idx_offset += sz;
        }

        // --- 3. Assemble global K (using existing utility) ---
        Eigen::SparseMatrix<double> K_global_assembled =
            getGlobalStiffnessMatrix(nodes, element_indices, element_sizes, elementInputs, dof);

        // Extract non-zero triplets
        std::vector<double> k_triplets;
        int nnz = K_global_assembled.nonZeros();
        k_triplets.push_back(static_cast<double>(nnz));
        for (int k = 0; k < K_global_assembled.outerSize(); ++k)
        {
            for (Eigen::SparseMatrix<double>::InnerIterator it(K_global_assembled, k); it; ++it)
            {
                k_triplets.push_back(static_cast<double>(it.row()));
                k_triplets.push_back(static_cast<double>(it.col()));
                k_triplets.push_back(it.value());
            }
        }

        // --- 4. Build force vector ---
        Eigen::VectorXd F_global = getForces(nodeInputs, dof);

        // --- 5. Solve ---
        std::vector<int> freeIndices = getFreeIndices(nodeInputs, dof);
        std::vector<int> zeroIndices = getZerosIndices(K_global_assembled);

        std::vector<int> reducedIndices;
        std::sort(zeroIndices.begin(), zeroIndices.end());
        for (int idx : freeIndices)
        {
            if (!std::binary_search(zeroIndices.begin(), zeroIndices.end(), idx))
                reducedIndices.push_back(idx);
        }

        Eigen::SparseMatrix<double> K_reduced = getReducedMatrix(K_global_assembled, reducedIndices);
        Eigen::VectorXd F_reduced = getReducedVector(F_global, reducedIndices);

        Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
        solver.compute(K_reduced);

        Eigen::VectorXd U_global = Eigen::VectorXd::Zero(dof);
        Eigen::VectorXd R_global = Eigen::VectorXd::Zero(dof);

        if (solver.info() == Eigen::Success)
        {
            Eigen::VectorXd U_reduced = solver.solve(F_reduced);
            if (solver.info() == Eigen::Success)
            {
                for (size_t i = 0; i < reducedIndices.size(); ++i)
                    U_global(reducedIndices[i]) = U_reduced(i);
                R_global = K_global_assembled * U_global;
            }
        }

        // --- 6. Build fixed DOFs list ---
        std::vector<int> fixedDOFs;
        for (const auto &pair : nodeInputs.supports)
        {
            int ni = pair.first;
            for (int d = 0; d < 6; d++)
            {
                if (pair.second[d])
                    fixedDOFs.push_back(ni * 6 + d);
            }
        }

        // --- 7. Pack solution output ---
        // [nDOF, F[nDOF], U[nDOF], R[nDOF], nFree, freeDOFs..., nFixed, fixedDOFs...]
        std::vector<double> solution;
        solution.push_back(static_cast<double>(dof));

        // F
        for (int i = 0; i < dof; i++)
            solution.push_back(F_global(i));
        // U
        for (int i = 0; i < dof; i++)
            solution.push_back(U_global(i));
        // R
        for (int i = 0; i < dof; i++)
            solution.push_back(R_global(i));

        // Free DOFs
        solution.push_back(static_cast<double>(freeIndices.size()));
        for (int idx : freeIndices)
            solution.push_back(static_cast<double>(idx));

        // Fixed DOFs
        solution.push_back(static_cast<double>(fixedDOFs.size()));
        for (int idx : fixedDOFs)
            solution.push_back(static_cast<double>(idx));

        // --- 8. Allocate WASM output memory ---
        *elem_data_size_out = elem_data.size();
        *elem_data_ptr_out = (double *)malloc(elem_data.size() * sizeof(double));
        if (*elem_data_ptr_out)
            std::copy(elem_data.begin(), elem_data.end(), *elem_data_ptr_out);

        *k_triplets_size_out = k_triplets.size();
        *k_triplets_ptr_out = (double *)malloc(k_triplets.size() * sizeof(double));
        if (*k_triplets_ptr_out)
            std::copy(k_triplets.begin(), k_triplets.end(), *k_triplets_ptr_out);

        *solution_size_out = solution.size();
        *solution_ptr_out = (double *)malloc(solution.size() * sizeof(double));
        if (*solution_ptr_out)
            std::copy(solution.begin(), solution.end(), *solution_ptr_out);
    }
}
