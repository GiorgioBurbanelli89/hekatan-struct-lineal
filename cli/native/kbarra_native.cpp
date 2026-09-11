// ─── kbarra_native — la K de UNA barra, sacada del C++ del solver ────────────
//
// Para los videos de Hekatan School que explican el codigo: el numero que se
// ensena en pantalla tiene que ser el que DEVUELVE el solver, no una cuenta a
// mano. Llama a getLocalStiffnessMatrix (la misma que ensambla deform) y, con
// `global`, tambien a getTransformationMatrix para dar Tt·k·T.
//
// Uso:
//     bash cli/native/build_kbarra_native.sh
//     cli/native/kbarra_native.exe x0 y0 z0 x1 y1 z1 E G A Iz Iy J [AsY AsZ] [global]
//
//     AsY/AsZ : 0 = 5/6·A (defecto de ETABS) · -1 = Bernoulli (sin cortante)
//
// Escribe la 12x12 por stdout, una fila por linea, en %.12e.
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>
#include "data-model.h"

Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &elementNodes, const ElementInputs &elementInputs, int elementIndex);

int main(int argc, char **argv)
{
    if (argc < 13) {
        std::fprintf(stderr,
            "uso: kbarra_native x0 y0 z0 x1 y1 z1 E G A Iz Iy J [AsY AsZ] [global]\n");
        return 2;
    }
    std::vector<Node> nodes;
    nodes.push_back({std::atof(argv[1]), std::atof(argv[2]), std::atof(argv[3])});
    nodes.push_back({std::atof(argv[4]), std::atof(argv[5]), std::atof(argv[6])});

    ElementInputs ei;
    ei.elasticities[0]       = std::atof(argv[7]);
    ei.shearModuli[0]        = std::atof(argv[8]);
    ei.areas[0]              = std::atof(argv[9]);
    ei.momentsOfInertiaZ[0]  = std::atof(argv[10]);
    ei.momentsOfInertiaY[0]  = std::atof(argv[11]);
    ei.torsionalConstants[0] = std::atof(argv[12]);
    bool global = false;
    int k = 13;
    if (argc > 14 && std::strcmp(argv[13], "global") != 0) {
        ei.shearAreasY[0] = std::atof(argv[13]);
        ei.shearAreasZ[0] = std::atof(argv[14]);
        k = 15;
    }
    if (argc > k && std::strcmp(argv[k], "global") == 0) global = true;

    Eigen::MatrixXd K = getLocalStiffnessMatrix(nodes, ei, 0);
    if (global) {
        Eigen::MatrixXd T = getTransformationMatrix(nodes, 0.0);
        K = T.transpose() * K * T;
    }
    for (int i = 0; i < K.rows(); i++) {
        for (int j = 0; j < K.cols(); j++)
            std::printf("%.12e%s", K(i, j), (j + 1 == K.cols()) ? "" : " ");
        std::printf("\n");
    }
    return 0;
}
