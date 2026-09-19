// =============================================================================
// computeSelfWeightLoads.cpp — Equivalent SAP `selfweight=1` of LoadPattern Dead
//
// Aplica peso propio a TODOS los elementos del modelo:
//   - Frame (2 nodos): γ·A·L distribuido como L/2 a cada extremo
//   - Shell Q4 (4 nodos): γ·t·A distribuido 1/4 a cada nodo
//   - Shell T3 (3 nodos): γ·t·A distribuido 1/3 a cada nodo
//
// Convención density:
//   `elementInputs.densities[e]` = mass density [t/m³] (kg/m³ ÷ 1000)
//   Peso = mass · g = density · 9.80665 [kN/m³]
//   γ = density · 9.80665
//
// Convención dirección:
//   gravity_dir: 0=X global, 1=Y global, 2=Z global (default = 2)
//   gravity_sign: por defecto -1 (carga hacia abajo en Z-up)
// =============================================================================
#include "../data-model.h"
#include <Eigen/Dense>
#include <vector>
#include <map>
#include <cmath>

template <typename K, typename V>
static V getMapVal_SW(const std::map<K, V> &map, const K &key, const V &defaultValue) {
    auto it = map.find(key);
    return (it != map.end()) ? it->second : defaultValue;
}

Eigen::VectorXd computeSelfWeightLoads(
    const std::vector<Node>& nodes,
    const std::vector<std::vector<unsigned int>>& elements,
    const ElementInputs& elementInputs,
    int gravity_dir = 2,
    double gravity_sign = -1.0,
    double g = 9.80665)
{
    int nNodes = (int)nodes.size();
    Eigen::VectorXd F = Eigen::VectorXd::Zero(6 * nNodes);

    for (size_t e = 0; e < elements.size(); e++) {
        const auto& el = elements[e];
        double density = getMapVal_SW(elementInputs.densities, (int)e, 0.0);
        if (density <= 0) continue;

        // ── Frame element (2 nodos) ─────────────────────────────────────────
        if (el.size() == 2) {
            double A = getMapVal_SW(elementInputs.areas, (int)e, 0.0);
            if (A <= 0) continue;

            Eigen::Vector3d n0(nodes[el[0]][0], nodes[el[0]][1], nodes[el[0]][2]);
            Eigen::Vector3d n1(nodes[el[1]][0], nodes[el[1]][1], nodes[el[1]][2]);
            double L = (n1 - n0).norm();
            if (L < 1e-12) continue;

            // Peso total del frame = γ·A·L = (density·g)·A·L
            double weight = density * A * L * g;
            // Distribución L/2 a cada extremo (consistent con SetLoadDistributed)
            double f_per_node = weight / 2.0;

            F(el[0]*6 + gravity_dir) += gravity_sign * f_per_node;
            F(el[1]*6 + gravity_dir) += gravity_sign * f_per_node;
        }
        // ── Shell Q4 (4 nodos) ──────────────────────────────────────────────
        else if (el.size() == 4) {
            double t = getMapVal_SW(elementInputs.thicknesses, (int)e, 0.0);
            if (t <= 0) continue;

            // Área del Q4 con cross product de diagonales: A = 0.5·|d1 × d2|
            Eigen::Vector3d n0(nodes[el[0]][0], nodes[el[0]][1], nodes[el[0]][2]);
            Eigen::Vector3d n1(nodes[el[1]][0], nodes[el[1]][1], nodes[el[1]][2]);
            Eigen::Vector3d n2(nodes[el[2]][0], nodes[el[2]][1], nodes[el[2]][2]);
            Eigen::Vector3d n3(nodes[el[3]][0], nodes[el[3]][1], nodes[el[3]][2]);
            Eigen::Vector3d d1 = n2 - n0;
            Eigen::Vector3d d2 = n3 - n1;
            double Area = 0.5 * d1.cross(d2).norm();

            double weight = density * t * Area * g;
            double f_per_node = weight / 4.0;
            for (int k = 0; k < 4; k++) {
                F(el[k]*6 + gravity_dir) += gravity_sign * f_per_node;
            }
        }
        // ── Shell T3 (3 nodos) ──────────────────────────────────────────────
        else if (el.size() == 3) {
            double t = getMapVal_SW(elementInputs.thicknesses, (int)e, 0.0);
            if (t <= 0) continue;

            Eigen::Vector3d n0(nodes[el[0]][0], nodes[el[0]][1], nodes[el[0]][2]);
            Eigen::Vector3d n1(nodes[el[1]][0], nodes[el[1]][1], nodes[el[1]][2]);
            Eigen::Vector3d n2(nodes[el[2]][0], nodes[el[2]][1], nodes[el[2]][2]);
            double Area = 0.5 * (n1 - n0).cross(n2 - n0).norm();

            double weight = density * t * Area * g;
            double f_per_node = weight / 3.0;
            for (int k = 0; k < 3; k++) {
                F(el[k]*6 + gravity_dir) += gravity_sign * f_per_node;
            }
        }
    }

    return F;
}
