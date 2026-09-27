#pragma once

#include <vector>
#include <map>
#include <string>
#include <Eigen/Core>
#include <Eigen/Dense>
#include <Eigen/Sparse>

// Define basic types similar to data-model.ts
using Node = std::vector<double>;          // [x, y, z]
using Element = std::vector<unsigned int>; // Node indices

struct ElementInputs
{
    std::map<int, double> elasticities;
    std::map<int, double> elasticitiesOrthogonal;
    std::map<int, double> shearModuli;
    std::map<int, double> areas;
    std::map<int, double> momentsOfInertiaZ;
    std::map<int, double> momentsOfInertiaY;
    std::map<int, double> torsionalConstants;
    std::map<int, double> thicknesses;
    std::map<int, double> poissonsRatios;
    std::map<int, double> densities; // mass density per element (rho)
    std::map<int, double> polarMomentsOfInertia; // I0 (polar moment of inertia, for Paz formulation)
    std::map<int, double> shearAreasY; // As_y for Timoshenko beams
    std::map<int, double> shearAreasZ; // As_z for Timoshenko beams
    std::map<int, std::vector<double>> rigidOffsets; // [factorI, factorJ] rigid zone factors
    // END LENGTH OFFSETS de CSI: [offI, offJ, rz] por barra, en metros y factor 0..1.
    //   tramo rigido lr = rz*off ; longitud flexible Lf = L - rz*(offI + offJ)
    //   flexion y cortante con Lf ; axil y torsion con la L COMPLETA (manual de CSI)
    // Medido contra ETABS 22.6 (hekatan-struct-py/tests/ref_end_offsets_etabs.json).
    // Con rz = 0 -el defecto de ETABS- o sin entrada, la barra es la de siempre.
    std::map<int, std::vector<double>> endOffsets;
    // Angulo de eje local de barra, en GRADOS, alrededor del eje 1 — el "local
    // axis angle" de CSI (`FrameObj.SetLocalAxes` de ETABS). Ausente = 0.
    std::map<int, double> localAngles;
    // Releases via static condensation. Two formats:
    //  6 flags: [TI,M2I,M3I, TJ,M2J,M3J]  (rotational only, legacy)
    // 12 flags: [FxI,FyI,FzI,TI,M2I,M3I, FxJ,FyJ,FzJ,TJ,M2J,M3J] (all DOFs)
    std::map<int, std::vector<bool>> momentReleases;
    // Partial fixity springs (semi-rigid connections)
    // 12 values: [kFxI,kFyI,kFzI,kTI,kM2I,kM3I, kFxJ,kFyJ,kFzJ,kTJ,kM2J,kM3J]
    std::map<int, std::vector<double>> partialFixitySprings;
    // Property Modifiers (estilo ETABS Assign → Area → Property/Stiffness Modifiers).
    // Multiplican la rigidez de membrana y de flexión del shell. Default = 1.0.
    //   Membrane modifier = 0   → elemento se comporta como Plate puro
    //   Bending modifier  = 0   → elemento se comporta como Membrane puro (CSI Manual §10.7)
    // Esto permite simular fielmente los 4 tipos de área de ETABS (Shell/Membrane/Plate/Layered)
    // sin crear elementos distintos.
    std::map<int, double> membraneModifiers;
    std::map<int, double> bendingModifiers;
    // Property Modifiers DIRECCIONALES, como los de ETABS:
    //   [0..2] F11MOD F22MOD F12MOD   membrana (directo 11, directo 22, cortante)
    //   [3..5] M11MOD M22MOD M12MOD   flexion
    //   [6..7] V13MOD V23MOD          cortante transversal
    // Es lo que define un DECK: rigido en el sentido del nervio (M11 ~ 1) y
    // blando cruzado (M22 ~ 0). Con un escalar no se puede expresar — o se
    // multiplica todo o nada, y poniendo 0 la matriz sale singular.
    // Si un elemento no esta en este mapa se usan los escalares de arriba.
    std::map<int, std::vector<double>> shellModifiers;
    // Plate formulation switch (per shell element):
    //   0 = Mindlin-Reissner (Shell-Thick, DSE Wilson Ch10)        [default]
    //   1 = MZC Kirchhoff    (Shell-Thin,  DKE Wilson Ch10 / ETABS Shell-Thin)
    // Para Mesa Torsión (t/L=0.017, t=0.10m sobre slab 6m) el Mindlin
    // sufre shear locking severo; el MZC Kirchhoff matchea ETABS Shell-Thin <1.5%.
    std::map<int, int> plateFormulations;
    // Solidos H8 (elementos de 8 nudos): modos incompatibles de Wilson-Taylor,
    // como SAP2000 por defecto (`incompatible 0` en el .heks los quita).
    bool solidIncompatible = true;
    // Drilling DOF formulation (per shell element):
    //   0 = penalty 1e-6 (legacy, weak — drilling efectivamente desacoplado)
    //   1 = PyNite weak spring  (k_Rz = min(diag_rot)/1000)
    //   2 = Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990 [DEFAULT]
    //       penalty acoplado al residual θz - 0.5·(∂v/∂x - ∂u/∂y),
    //       γ = G·t · drillingPenaltyScales[idx] (default scale=1.0).
    //       Único modo que transmite torsión losa↔viga consistente con ETABS/SAP
    //       (referencia: CSI Analysis Reference Manual §10.1.1; Wilson Cap 9).
    std::map<int, int> drillingTypes;
    std::map<int, double> drillingPenaltyScales; // factor sobre γ=G·t (Hughes-Brezzi)
};

struct NodeInputs
{
    std::map<int, std::vector<bool>> supports; // Map<node_index, [tx, ty, tz, rx, ry, rz]>
    std::map<int, std::vector<double>> loads;  // Map<node_index, [fx, fy, fz, mx, my, mz]>
};

struct DeformOutputs
{
    std::map<int, std::vector<double>> deformations; // Map<node_index, [dx, dy, dz, rx, ry, rz]>
    std::map<int, std::vector<double>> reactions;    // Map<node_index, [fx, fy, fz, mx, my, mz]>
};

struct ModalOutputs
{
    std::vector<double> frequencies;                 // natural frequencies [Hz]
    std::vector<std::vector<double>> modeShapes;     // mode shapes [num_modes][total_dof]
    std::vector<std::vector<double>> massParticipation; // [num_modes][6] ratios (ux,uy,uz,rx,ry,rz)
};

// Shared FEA helpers (feHelpers.cpp)
std::map<int, double> parseMapFromFlat(int *keys, double *values, int count);
std::map<int, std::vector<double>> parseMapVecFromFlat(int *keys, double *values, int count, int vecSize);
std::map<int, std::vector<bool>> parseMapBoolVecFromFlat(int *keys, bool *values, int count, int vecSize);
std::map<int, int> parseMapIntFromFlat(int *keys, int *values, int count);
Eigen::VectorXd getForces(const NodeInputs &nodeInputs, int dof);
std::vector<int> getFreeIndices(const NodeInputs &nodeInputs, int dof);
std::vector<int> getZerosIndices(const Eigen::SparseMatrix<double> &matrix);
Eigen::SparseMatrix<double> getReducedMatrix(
    const Eigen::SparseMatrix<double> &matrix,
    const std::vector<int> &reducedIndices);
Eigen::VectorXd getReducedVector(
    const Eigen::VectorXd &vector,
    const std::vector<int> &reducedIndices);

// Utils
Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex);

Eigen::MatrixXd getTransformationMatrix(
    const std::vector<Node> &elementNodes,
    double frameAngleDeg = 0.0);

Eigen::SparseMatrix<double> getGlobalStiffnessMatrix(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices, // Flat list of indices
    const std::vector<unsigned int> &elementSizes,    // Size of each element
    const ElementInputs &elementInputs,
    int dof);

Eigen::MatrixXd getLocalMassMatrix(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex);

Eigen::SparseMatrix<double> getGlobalMassMatrix(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &elementSizes,
    const ElementInputs &elementInputs,
    int dof);

// Paz formulation (uses explicit I0 for torsional mass if provided)
Eigen::MatrixXd getLocalMassMatrixPaz(
    const std::vector<Node> &elementNodes,
    const ElementInputs &elementInputs,
    int elementIndex);

Eigen::SparseMatrix<double> getGlobalMassMatrixPaz(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &elementSizes,
    const ElementInputs &elementInputs,
    int dof);

// Drilling DOF helper (Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990).
// Devuelve K_drill (24×24) sobre los DOFs [u, v, w, θx, θy, θz] por nodo, con
// contribución sólo en u, v, θz (los otros 12 índices quedan 0). Para usar:
// sumar al K local del shell antes de la transformación a coords globales.
Eigen::MatrixXd getDrillingK_HughesBrezzi(
    const double x[4], const double y[4],
    double E, double nu, double t,
    double gamma_scale);