// ─── kensam_native — la K ENSAMBLADA de una L (columna + viga), del C++ del solver ──
//
// Para el video 5 de Hekatan School (el ensamblaje): el numero que se ensena
// tiene que ser el que DEVUELVE getGlobalStiffnessMatrix, la misma funcion que
// llama deform.cpp:160. Modelo fijo:
//     nudo 0 (0,0,0) ── columna 30x30 ── nudo 1 (0,0,3) ── viga 30x50 ── nudo 2 (4,0,3)
// E = 2.5e6 tonf/m², G = E/2.4, As por defecto (5/6·A).
//
// Uso:
//     bash cli/native/build_kensam_native.sh
//     cli/native/kensam_native.exe            → la 18x18 ensamblada (%.12e)
//     cli/native/kensam_native.exe barra 0    → Tt·k·T de la columna (12x12)
//     cli/native/kensam_native.exe barra 1    → Tt·k·T de la viga (12x12)
// Al final: "# triplets <n>" y "# casillas <no nulas>".
#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <vector>
#include "data-model.h"

Eigen::MatrixXd getLocalStiffnessMatrix(
    const std::vector<Node> &elementNodes, const ElementInputs &elementInputs, int elementIndex);

int main(int argc, char **argv)
{
    std::vector<Node> nodes = {{0, 0, 0}, {0, 0, 3}, {4, 0, 3}};
    std::vector<unsigned int> idx = {0, 1, 1, 2};
    std::vector<unsigned int> sizes = {2, 2};

    const double E = 2.5e6, G = E / 2.4;
    ElementInputs ei;
    for (int i = 0; i < 2; i++) { ei.elasticities[i] = E; ei.shearModuli[i] = G; }
    // columna 30x30
    ei.areas[0] = 0.09; ei.momentsOfInertiaZ[0] = 0.000675; ei.momentsOfInertiaY[0] = 0.000675;
    ei.torsionalConstants[0] = 0.1406 * std::pow(0.3, 4);
    // viga 30x50 (la del video 3)
    ei.areas[1] = 0.15; ei.momentsOfInertiaZ[1] = 0.003125; ei.momentsOfInertiaY[1] = 0.001125;
    ei.torsionalConstants[1] = 0.0028173708;

    Eigen::MatrixXd K;
    if (argc > 2 && std::strcmp(argv[1], "barra") == 0) {
        int b = std::atoi(argv[2]);
        std::vector<Node> en = {nodes[idx[2 * b]], nodes[idx[2 * b + 1]]};
        Eigen::MatrixXd T = getTransformationMatrix(en, 0.0);
        K = T.transpose() * getLocalStiffnessMatrix(en, ei, b) * T;
    } else {
        K = Eigen::MatrixXd(getGlobalStiffnessMatrix(nodes, idx, sizes, ei, 18));
    }
    int nz = 0;
    for (int i = 0; i < K.rows(); i++) {
        for (int j = 0; j < K.cols(); j++) {
            std::printf("%.12e%s", K(i, j), (j + 1 == K.cols()) ? "" : " ");
            if (std::abs(K(i, j)) > 1e-15) nz++;
        }
        std::printf("\n");
    }
    std::printf("# casillas %d\n", nz);
    return 0;
}
