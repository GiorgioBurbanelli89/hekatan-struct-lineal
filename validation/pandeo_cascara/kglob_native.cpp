// kglob_native — la K GLOBAL ensamblada por getGlobalStiffnessMatrix (la MISMA del WASM: deform y modal) de un
// modelo de cáscaras, para el prototipo de Kg en Python (proto_tri.py). Entrada (texto):
//   nn \n x y z ×nn \n ne \n  size n1..nsize t E nu pf nmods [mods...]  ×ne
// Salida: binario float64 de la K densa 6nn×6nn (fila mayor).
//   bash validation/pandeo_cascara/build_kglob.sh ; kglob_native.exe modelo.txt K.bin
#include <cstdio>
#include <vector>
#include "data-model.h"

int main(int argc, char **argv) {
    if (argc < 3) { std::fprintf(stderr, "uso: kglob_native modelo.txt K.bin\n"); return 1; }
    FILE *f = std::fopen(argv[1], "r"); if (!f) return 2;
    int nn; std::fscanf(f, "%d", &nn);
    std::vector<Node> nodes(nn, Node(3));
    for (int i = 0; i < nn; ++i) std::fscanf(f, "%lf %lf %lf", &nodes[i][0], &nodes[i][1], &nodes[i][2]);
    int ne; std::fscanf(f, "%d", &ne);
    std::vector<unsigned int> idx, sizes; ElementInputs ei;
    for (int e = 0; e < ne; ++e) {
        int sz; std::fscanf(f, "%d", &sz); sizes.push_back(sz);
        for (int k = 0; k < sz; ++k) { unsigned int q; std::fscanf(f, "%u", &q); idx.push_back(q); }
        double t, E, nu; int pf, nm; std::fscanf(f, "%lf %lf %lf %d %d", &t, &E, &nu, &pf, &nm);
        ei.thicknesses[e] = t; ei.elasticities[e] = E; ei.poissonsRatios[e] = nu; ei.shearModuli[e] = E / (2 * (1 + nu));
        ei.plateFormulations[e] = pf;
        if (nm > 0) { std::vector<double> m(nm); for (int k = 0; k < nm; ++k) std::fscanf(f, "%lf", &m[k]); ei.shellModifiers[e] = m; }
    }
    std::fclose(f);
    const int dof = 6 * nn;
    Eigen::SparseMatrix<double> K = getGlobalStiffnessMatrix(nodes, idx, sizes, ei, dof);
    Eigen::MatrixXd Kd = Eigen::MatrixXd(K);
    FILE *o = std::fopen(argv[2], "wb");
    for (int i = 0; i < dof; ++i) for (int j = 0; j < dof; ++j) { double v = Kd(i, j); std::fwrite(&v, 8, 1, o); }
    std::fclose(o);
    return 0;
}
