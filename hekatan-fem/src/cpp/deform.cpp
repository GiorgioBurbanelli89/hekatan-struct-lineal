#include "data-model.h"
#include "utils/etabsWallJoint.h"
#include "utils/rigidDiaphragm.h"
#include "utils/springsExtra.h"
#include <vector>
#include <map>
#include <algorithm>
#include <cmath>
#include <array>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <Eigen/IterativeLinearSolvers>
#include <iostream>
#include <stdexcept>

extern "C"
{
    void deform(
        // --- Inputs from TypeScript (WASM Memory Pointers) ---
        // Geometry
        double *nodes_flat_ptr, int num_nodes,                      // nodes.flat() -> [x1, y1, z1, x2, y2, z2, ...]
        unsigned int *element_indices_ptr, int num_element_indices, // elements.flat() -> [n1_e1, n2_e1, n1_e2, n2_e2, n3_e2, ...]
        unsigned int *element_sizes_ptr, int num_elements,          // [size_e1, size_e2, ...] -> e.g., [2, 3]

        // Node Inputs (Boundary Conditions & Loads)
        int *support_keys_ptr, bool *support_values_ptr, int num_supports, // Map<nodeIdx, [bool, bool, bool, bool, bool, bool]>
        int *load_keys_ptr, double *load_values_ptr, int num_loads,        // Map<nodeIdx, [fx, fy, fz, mx, my, mz]>

        // Element Inputs (Material & Section Properties)
        // Note: Pass pointers/sizes for all potential properties used by getLocalStiffnessMatrix
        int *elasticity_keys_ptr, double *elasticity_values_ptr, int num_elasticities,                                   // Map<elemIdx, E>
        int *area_keys_ptr, double *area_values_ptr, int num_areas,                                                      // Map<elemIdx, A>
        int *moi_z_keys_ptr, double *moi_z_values_ptr, int num_moi_z,                                                    // Map<elemIdx, Iz>
        int *moi_y_keys_ptr, double *moi_y_values_ptr, int num_moi_y,                                                    // Map<elemIdx, Iy>
        int *shear_mod_keys_ptr, double *shear_mod_values_ptr, int num_shear_mod,                                        // Map<elemIdx, G>
        int *torsion_keys_ptr, double *torsion_values_ptr, int num_torsion,                                              // Map<elemIdx, J>
        int *thickness_keys_ptr, double *thickness_values_ptr, int num_thickness,                                        // Map<elemIdx, t>
        int *poisson_keys_ptr, double *poisson_values_ptr, int num_poisson,                                              // Map<elemIdx, nu>
        int *elasticitiesOrthogonal_keys_ptr, double *elasticitiesOrthogonal_values_ptr, int num_elasticitiesOrthogonal, // Map<elemIdx, E_ortho>
        int *shear_area_y_keys_ptr, double *shear_area_y_values_ptr, int num_shear_area_y,                              // Map<elemIdx, AsY> (0 = Bernoulli)
        int *shear_area_z_keys_ptr, double *shear_area_z_values_ptr, int num_shear_area_z,                              // Map<elemIdx, AsZ> (0 = Bernoulli)

        // Nodal springs (Winkler foundation, partial restraints)
        // Flat layout: [node0, dof0, k0, node1, dof1, k1, ...]  length = 3 * num_springs
        double *springs_flat_ptr, int num_springs,

        // Plate formulation per shell element: 0=Mindlin (Shell-Thick DSE), 1=Kirchhoff MZC (Shell-Thin DKE)
        // Map<elemIdx, int>
        int *plateForm_keys_ptr, int *plateForm_values_ptr, int num_plateForm,

        // Drilling DOF formulation per shell element:
        //   0=penalty1e-6 (legacy), 1=PyNite weak (min(diagRot)/1000),
        //   2=Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990 [DEFAULT]
        // Mapa puede estar vacío (num=0) → todos los shells usan 2 (HB).
        int *drillType_keys_ptr, int *drillType_values_ptr, int num_drillType,

        // Drilling penalty scale per shell element (gamma scale on G·t for type=2)
        // Default 1.0 si no está. Map<elemIdx, double>.
        int *drillScale_keys_ptr, double *drillScale_values_ptr, int num_drillScale,

        // Property Modifiers estilo ETABS (Assign -> Area -> Stiffness Modifiers).
        // Multiplican la rigidez de MEMBRANA y de FLEXION del shell; por defecto
        // 1.0. Ya existian en el modelo de datos y los usaba shellQ4.cpp, pero
        // SOLO llegaban por el camino modal: el estatico nunca los recibia, asi
        // que aqui valian siempre 1.0. Sin esto un deck no se puede representar
        // (aporta poca flexion) y el entrepiso sale rigido de mas.
        int *memmod_keys_ptr, double *memmod_values_ptr, int num_memmods,
        int *bendmod_keys_ptr, double *bendmod_values_ptr, int num_bendmods,

        // Modificadores DIRECCIONALES: 8 valores por elemento
        //   F11 F22 F12  M11 M22 M12  V13 V23   (el orden del e2k de ETABS)
        int *shellmod_keys_ptr, double *shellmod_values_ptr, int num_shellmods,

        // ANGULO DE EJE LOCAL de cada barra, en GRADOS (Map<elemIdx, deg>).
        // Es el "local axis angle" de CSI: gira la seccion alrededor del eje de
        // la barra. Hekatan no lo tenia, y un modelo importado de ETABS con
        // perfiles en C o angulos 2L girados 90 grados NO era la misma
        // estructura por mucho que las secciones coincidieran.
        int *localang_keys_ptr, double *localang_values_ptr, int num_localang,

        // END RELEASES por barra: 12 banderas, el orden de ETABS
        //   [U1 U2 U3 R1 R2 R3] en el nudo I  +  los mismos seis en el nudo J
        // Una bandera en true libera ese grado LOCAL por condensacion estatica
        // (`applyReleases` en getLocalStiffnessMatrix.cpp).
        //
        // La condensacion llevaba anos escrita y NADIE la llamaba por el camino
        // WASM: `deformCpp.ts` preparaba los punteros y a continuacion decia
        // "rigidOffsets, releases are handled by the TS solver" — pero todo va
        // por WASM. O sea que una barra biarticulada entraba EMPOTRADA, tanto en
        // el estatico como en el modal.
        int *release_keys_ptr, bool *release_values_ptr, int num_releases,

        // La union viga-muro de ETABS (ver addEtabsWallJoint). 0 = apagado.
        int etabs_wall_joint,

        // DIAFRAGMA RIGIDO por nudo (0 = ninguno, 1..n = grupo), ver utils/rigidDiaphragm.h
        int *diaph_keys_ptr, double *diaph_values_ptr, int num_diaph,
        // Solidos H8: 1 = modos incompatibles (SAP2000), 0 = H8 puro
        int solid_incompatible,

        // --- Output Pointers (to be allocated by C++ and filled) ---
        // These are pointers *to* pointers. C++ allocates memory using malloc
        // and writes the address of the allocated block into these pointers.
        double **deformations_data_ptr_out, // -> pointer to flat deformation data [nodeIdx, d1..d6, ...]
        int *deformations_size_out,         // -> pointer to total number of doubles in deformations_data_ptr_out
        double **reactions_data_ptr_out,    // -> pointer to flat reaction data [nodeIdx, r1..r6, ...]
        int *reactions_size_out             // -> pointer to total number of doubles in reactions_data_ptr_out
    )
    {
        // --- 1. Parse Inputs from WASM Memory ---
        // Convert flat arrays from WASM memory into C++ data structures.

        std::vector<Node> nodes(num_nodes, Node(3)); // Initialize vector of Nodes (each Node is std::vector<double>)
        for (int i = 0; i < num_nodes; ++i)
        {
            nodes[i][0] = nodes_flat_ptr[i * 3 + 0];
            nodes[i][1] = nodes_flat_ptr[i * 3 + 1];
            nodes[i][2] = nodes_flat_ptr[i * 3 + 2];
        }

        // Copy element indices and sizes directly
        std::vector<unsigned int> element_indices(element_indices_ptr, element_indices_ptr + num_element_indices);
        std::vector<unsigned int> element_sizes(element_sizes_ptr, element_sizes_ptr + num_elements);

        // Parse NodeInputs (supports and loads)
        NodeInputs nodeInputs;
        nodeInputs.supports = parseMapBoolVecFromFlat(support_keys_ptr, support_values_ptr, num_supports, 6);
        nodeInputs.loads = parseMapVecFromFlat(load_keys_ptr, load_values_ptr, num_loads, 6);

        // Parse ElementInputs (material/section properties)
        ElementInputs elementInputs;
        elementInputs.elasticities = parseMapFromFlat(elasticity_keys_ptr, elasticity_values_ptr, num_elasticities);
        elementInputs.areas = parseMapFromFlat(area_keys_ptr, area_values_ptr, num_areas);
        elementInputs.momentsOfInertiaZ = parseMapFromFlat(moi_z_keys_ptr, moi_z_values_ptr, num_moi_z);
        elementInputs.momentsOfInertiaY = parseMapFromFlat(moi_y_keys_ptr, moi_y_values_ptr, num_moi_y);
        elementInputs.shearModuli = parseMapFromFlat(shear_mod_keys_ptr, shear_mod_values_ptr, num_shear_mod);
        elementInputs.torsionalConstants = parseMapFromFlat(torsion_keys_ptr, torsion_values_ptr, num_torsion);
        elementInputs.thicknesses = parseMapFromFlat(thickness_keys_ptr, thickness_values_ptr, num_thickness);
        elementInputs.poissonsRatios = parseMapFromFlat(poisson_keys_ptr, poisson_values_ptr, num_poisson);
        elementInputs.elasticitiesOrthogonal = parseMapFromFlat(elasticitiesOrthogonal_keys_ptr, elasticitiesOrthogonal_values_ptr, num_elasticitiesOrthogonal);
        // Shear areas for Timoshenko frame (used by getLocalStiffnessMatrixFrame)
        // Convention: As=0 (or not provided) → default 5/6·A (Timoshenko). As<0 sentinel
        // means Bernoulli (phi=0). As>0 explícito → usar ese valor.
        elementInputs.shearAreasY = parseMapFromFlat(shear_area_y_keys_ptr, shear_area_y_values_ptr, num_shear_area_y);
        elementInputs.shearAreasZ = parseMapFromFlat(shear_area_z_keys_ptr, shear_area_z_values_ptr, num_shear_area_z);
        elementInputs.plateFormulations = parseMapIntFromFlat(plateForm_keys_ptr, plateForm_values_ptr, num_plateForm);
        elementInputs.membraneModifiers = parseMapFromFlat(memmod_keys_ptr, memmod_values_ptr, num_memmods);
        elementInputs.bendingModifiers = parseMapFromFlat(bendmod_keys_ptr, bendmod_values_ptr, num_bendmods);
        elementInputs.shellModifiers = parseMapVecFromFlat(shellmod_keys_ptr, shellmod_values_ptr, num_shellmods, 8);
        elementInputs.localAngles = parseMapFromFlat(localang_keys_ptr, localang_values_ptr, num_localang);
        elementInputs.momentReleases = parseMapBoolVecFromFlat(release_keys_ptr, release_values_ptr, num_releases, 12);
        elementInputs.drillingTypes = parseMapIntFromFlat(drillType_keys_ptr, drillType_values_ptr, num_drillType);
        elementInputs.drillingPenaltyScales = parseMapFromFlat(drillScale_keys_ptr, drillScale_values_ptr, num_drillScale);
        elementInputs.solidIncompatible = solid_incompatible != 0;

        // --- 2. Core FEA Calculation using Eigen ---
        int dof = num_nodes * 6; // Total degrees of freedom

        Eigen::VectorXd F_global = getForces(nodeInputs, dof);
        Eigen::SparseMatrix<double> K_global = getGlobalStiffnessMatrix(nodes, element_indices, element_sizes, elementInputs, dof);

        // --- Add nodal springs (Winkler foundation) to diagonal of K_global ---
        // Each spring adds +k to K_global(gdof, gdof) where gdof = 6*node + dof
        for (int i = 0; i < num_springs; ++i) {
            int node = static_cast<int>(springs_flat_ptr[3 * i]);
            int d    = static_cast<int>(springs_flat_ptr[3 * i + 1]);
            double k = springs_flat_ptr[3 * i + 2];
            // nudo NEGATIVO = registro de elemento: muelle de area consistente (SAFE) o nudo
            // colgado (edge constraint de ETABS), ver utils/springsExtra.h
            if (springsExtra::despacharMuelleExtra(K_global, nodes, element_indices, element_sizes, node, d, k)) continue;
            int gdof = 6 * node + d;
            if (gdof >= 0 && gdof < dof) {
                K_global.coeffRef(gdof, gdof) += k;
            }
        }

        if (etabs_wall_joint) addEtabsWallJoint(K_global, nodes, element_indices, element_sizes, elementInputs);

        // ── Diafragma rigido: u = T u_red; K y F pasan al espacio reducido ──
        DiafragmaT dia;
        {
            std::map<int, double> diafr = parseMapFromFlat(diaph_keys_ptr, diaph_values_ptr, num_diaph);
            std::vector<std::array<double, 3>> nodosArr(num_nodes);
            for (int i = 0; i < num_nodes; ++i) nodosArr[i] = { nodes[i][0], nodes[i][1], nodes[i][2] };
            dia = armarDiafragma(nodosArr, num_nodes, diafr, std::vector<double>());
        }
        const Eigen::SparseMatrix<double> K_completa = K_global;   // para las reacciones
        const Eigen::VectorXd F_completa = F_global;
        if (dia.hay) {
            K_global = (dia.T.transpose() * K_global * dia.T).pruned();
            F_global = dia.T.transpose() * F_global;
            dof = dia.dofReducido;
        }

        std::vector<int> freeIndices;
        if (dia.hay) {
            // apoyos: solo los GDL que sobreviven (uno atado a un diafragma no se apoya)
            std::vector<bool> fijo(dof, false);
            for (const auto &kv : nodeInputs.supports) {
                const int i = kv.first;
                if (i < 0 || i >= num_nodes) continue;
                for (int k = 0; k < 6 && k < (int)kv.second.size(); ++k) {
                    if (!kv.second[k]) continue;
                    const int c = dia.colDe[i * 6 + k];
                    if (c >= 0) fijo[c] = true;
                }
            }
            for (int c = 0; c < dof; ++c) if (!fijo[c]) freeIndices.push_back(c);
        } else {
            freeIndices = getFreeIndices(nodeInputs, dof);
        }
        std::vector<int> zeroIndices = getZerosIndices(K_global);

        std::vector<int> reducedIndices;
        std::sort(zeroIndices.begin(), zeroIndices.end()); // Ensure zeroIndices is sorted for binary_search
        for (int idx : freeIndices)
        {
            if (!std::binary_search(zeroIndices.begin(), zeroIndices.end(), idx)) // Check if idx is NOT in zeroIndices
            {
                reducedIndices.push_back(idx);
            }
        }

        Eigen::SparseMatrix<double> K_reduced = getReducedMatrix(K_global, reducedIndices);
        Eigen::VectorXd F_reduced = getReducedVector(F_global, reducedIndices);

        // SimplicialLDLT (Cholesky) instead of SparseLU: K is SYMMETRIC POSITIVE DEFINITE
        // after removing supported/zero DOFs, so LU is the wrong tool — it stores L and U
        // separately and orders with COLAMD (meant for unsymmetric matrices). Measured on
        // the same 90,234-DOF matrix: LDLT 317 MB vs LU 1,230 MB (~4x), and Cholesky is
        // about half the flops. This is what raises the ceiling before WASM32 hits its 2 GB
        // limit (see cli/DIAGNOSTICO_MODAL.md). modal.cpp already used LDLT.
        //
        // FALLBACK: if K is not positive definite (a mechanism, an element with no
        // stiffness), LDLT fails where LU might still produce something. In that case we
        // fall back to SparseLU so nothing that works today stops working.
        Eigen::VectorXd U_reduced;
        bool solved = false;
        // Modelos GRANDES (barras + cascaras): la LDLT rellena y se come la memoria del
        // WASM (2 GB); a partir de 150 000 GDL se resuelve por gradiente conjugado con
        // Cholesky incompleta, como el H8 (hex8_wasm.cpp, 40 000 GDL). tol 1e-12.
        if ((int)K_reduced.rows() > 150000)
        {
            Eigen::ConjugateGradient<Eigen::SparseMatrix<double>, Eigen::Lower | Eigen::Upper,
                                     Eigen::IncompleteCholesky<double>> cg;
            cg.setTolerance(1e-12);
            cg.setMaxIterations(20000);
            cg.compute(K_reduced);
            if (cg.info() == Eigen::Success)
            {
                U_reduced = cg.solve(F_reduced);
                if (cg.info() == Eigen::Success && U_reduced.allFinite())
                {
                    solved = true;
                    std::cout << "deform: CG " << cg.iterations() << " iteraciones, error " << cg.error() << std::endl;
                }
            }
            if (!solved) std::cerr << "Warning: CG no convergio; se intenta LDLT" << std::endl;
        }
        if (!solved)
        {
            Eigen::SimplicialLDLT<Eigen::SparseMatrix<double>> chol;
            chol.compute(K_reduced);
            if (chol.info() == Eigen::Success)
            {
                U_reduced = chol.solve(F_reduced);
                if (chol.info() == Eigen::Success && U_reduced.allFinite())
                    solved = true;
            }
            if (!solved)
                std::cerr << "Warning: LDLT failed (K may not be positive definite); "
                             "falling back to SparseLU." << std::endl;
        }

        if (!solved)
        {
            Eigen::SparseLU<Eigen::SparseMatrix<double>> solver;
            solver.compute(K_reduced);

            if (solver.info() != Eigen::Success)
            {
                std::cerr << "Error: Matrix decomposition failed during solve." << std::endl;
                *deformations_data_ptr_out = nullptr;
                *deformations_size_out = 0;
                *reactions_data_ptr_out = nullptr;
                *reactions_size_out = 0;
                return;
            }
            U_reduced = solver.solve(F_reduced);
            if (solver.info() != Eigen::Success)
            {
                std::cerr << "Error: Matrix solving failed." << std::endl;
                // Handle error
                *deformations_data_ptr_out = nullptr;
                *deformations_size_out = 0;
                *reactions_data_ptr_out = nullptr;
                *reactions_size_out = 0;
                return;
            }
        }

        // Map reduced deformations (U_reduced) back to the full deformation vector (U_global)
        Eigen::VectorXd U_global = Eigen::VectorXd::Zero(dof);
        for (size_t i = 0; i < reducedIndices.size(); ++i)
        {
            U_global(reducedIndices[i]) = U_reduced(i);
        }
        if (dia.hay) U_global = (dia.T * U_global).eval();   // de vuelta a los 6 GDL por nudo

        Eigen::VectorXd R_global = K_completa * U_global;
        F_global = F_completa;

        // --- 3. Prepare Output Data Structures ---
        // Collate results into the DeformOutputs structure.
        DeformOutputs outputs;
        for (int i = 0; i < num_nodes; ++i)
        {
            // Extract deformations for the current node
            std::vector<double> node_def(6);
            for (int j = 0; j < 6; ++j)
            {
                node_def[j] = U_global(i * 6 + j);
            }
            outputs.deformations[i] = node_def;

            // Check if the node has any fixed support DOFs
            bool hasSupport = false;
            auto support_it = nodeInputs.supports.find(i);
            if (support_it != nodeInputs.supports.end())
            {
                for (bool fixed : support_it->second)
                {
                    if (fixed)
                    {
                        hasSupport = true;
                        break;
                    }
                }
            }

            // If the node has support, extract reactions
            if (hasSupport)
            {
                std::vector<double> node_react(6);
                for (int j = 0; j < 6; ++j)
                {
                    // R = K·U − F_ext.  K·U solo trae lo que el RESTO de la
                    // estructura empuja contra el apoyo; la carga aplicada
                    // ENCIMA del propio nudo apoyado la absorbe el apoyo
                    // tambien y hay que sumarla, o desaparece del equilibrio.
                    //
                    // Medido (2026-08-12): 4 shells, 9 nudos, 8 apoyados y uno
                    // libre en el centro, 160 kN de carga de superficie ->
                    // sumRz daba 40.00 kN, EXACTAMENTE el cuarto que pasa por
                    // el unico nudo libre. En el galpon eran 206 kN perdidos
                    // (5.1 %) porque la rampa arranca en z=0, sobre apoyos.
                    node_react[j] = R_global(i * 6 + j) - F_global(i * 6 + j);
                }
                outputs.reactions[i] = node_react;
            }
        }

        // --- 4. Allocate Memory for Output Arrays in WASM Heap ---
        // Allocate memory using malloc for the flat arrays to be sent back to TypeScript.
        // The size includes space for the node index + 6 DOF values per node.
        *deformations_size_out = outputs.deformations.size() * 7;
        *deformations_data_ptr_out = (double *)malloc(*deformations_size_out * sizeof(double));

        *reactions_size_out = outputs.reactions.size() * 7;
        *reactions_data_ptr_out = (double *)malloc(*reactions_size_out * sizeof(double));

        // Check if allocation was successful
        if (!(*deformations_data_ptr_out) || (outputs.reactions.size() > 0 && !(*reactions_data_ptr_out)))
        {
            std::cerr << "Error: Memory allocation failed for output arrays in deform()." << std::endl;
            // Free any partially allocated memory before returning null pointers
            free(*deformations_data_ptr_out); // free(nullptr) is safe
            free(*reactions_data_ptr_out);
            *deformations_data_ptr_out = nullptr;
            *deformations_size_out = 0;
            *reactions_data_ptr_out = nullptr;
            *reactions_size_out = 0;
            return; // Exit the function
        }

        // --- 5. Copy Output Data to Allocated WASM Memory ---
        // Flatten the output maps into the allocated arrays.

        int def_idx = 0;
        for (const auto &pair : outputs.deformations)
        {
            (*deformations_data_ptr_out)[def_idx++] = static_cast<double>(pair.first); // Node index
            for (double val : pair.second)
            {
                (*deformations_data_ptr_out)[def_idx++] = val; // 6 deformation values
            }
        }

        int react_idx = 0;
        for (const auto &pair : outputs.reactions)
        {
            (*reactions_data_ptr_out)[react_idx++] = static_cast<double>(pair.first); // Node index
            for (double val : pair.second)
            {
                (*reactions_data_ptr_out)[react_idx++] = val; // 6 reaction values
            }
        }
    }
}
