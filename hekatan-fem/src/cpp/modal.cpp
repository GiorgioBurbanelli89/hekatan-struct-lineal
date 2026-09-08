#include "data-model.h"
#include "utils/etabsWallJoint.h"
#include "utils/springsExtra.h"
#include <vector>
#include <map>
#include <array>
#include <unordered_map>
#include <algorithm>
#include <cmath>
#include <Eigen/Dense>
#include <Eigen/Sparse>
#include <Eigen/Eigenvalues>
#include <iostream>
#include <limits>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

// Extrae el sub-bloque A(rows, cols) de una matriz dispersa (índices globales → locales).
static Eigen::SparseMatrix<double> extractBlock(
    const Eigen::SparseMatrix<double> &A,
    const std::vector<int> &rows, const std::vector<int> &cols)
{
    std::unordered_map<int, int> rmap, cmap;
    for (int i = 0; i < (int)rows.size(); ++i) rmap[rows[i]] = i;
    for (int j = 0; j < (int)cols.size(); ++j) cmap[cols[j]] = j;
    std::vector<Eigen::Triplet<double>> trips;
    for (int k = 0; k < A.outerSize(); ++k)
        for (Eigen::SparseMatrix<double>::InnerIterator it(A, k); it; ++it)
        {
            auto ri = rmap.find(it.row()); if (ri == rmap.end()) continue;
            auto ci = cmap.find(it.col()); if (ci == cmap.end()) continue;
            trips.emplace_back(ri->second, ci->second, it.value());
        }
    Eigen::SparseMatrix<double> B((int)rows.size(), (int)cols.size());
    B.setFromTriplets(trips.begin(), trips.end());
    return B;
}

// ── LA MASA, EN UN SOLO SITIO ────────────────────────────────────────────
// El ensamblaje de M vivia dentro de modal() y no habia forma de mirarlo sin
// resolver los modos. Es la mitad del problema (K u = w2 M u) y la que no
// cierra contra ETABS, asi que ahora se arma aparte y se puede PESAR nudo a
// nudo con `assembled_joint_mass` — que es la tabla que ETABS publica con ese
// mismo nombre. Los pasos son los de ETABS y en su orden:
//   2a. fuente de masa   (INCLUDEELEMENTS + masa nodal)
//   2b. solo lateral     (INCLUDEVERTICALMASS "No")
//   2c. LUMPATSTORIES    (concentrar por pisos)
// El diafragma (2d) NO entra aca: eso ya no es masa, es una restriccion.
static Eigen::SparseMatrix<double> ensamblarMasa(
    const std::vector<Node> &nodes,
    const std::vector<unsigned int> &element_indices,
    const std::vector<unsigned int> &element_sizes,
    const ElementInputs &elementInputs,
    const std::map<int, double> &masaNodal,
    int num_nodes, int dof,
    int include_elements, int lateral_mass, int lump_stories)
{
    Eigen::SparseMatrix<double> M_global = getGlobalMassMatrix(
        nodes, element_indices, element_sizes, elementInputs, dof);

    // --- 2a. Fuente de masa estilo ETABS: elementos y/o masa nodal ---
    // `include_elements = 0` tira la masa de rho*A*L, que es lo que hace
    // ETABS con INCLUDEELEMENTS "No"; la masa nodal se anade siempre.
    {
        if (!include_elements)
            M_global.setZero();
        if (!masaNodal.empty())
        {
            std::vector<Eigen::Triplet<double>> tri;
            tri.reserve(masaNodal.size() * 3);
            for (const auto &kv : masaNodal)
            {
                const int i = kv.first;
                if (i < 0 || i >= num_nodes || kv.second <= 0.0) continue;
                tri.emplace_back(i * 6 + 0, i * 6 + 0, kv.second);
                tri.emplace_back(i * 6 + 1, i * 6 + 1, kv.second);
                tri.emplace_back(i * 6 + 2, i * 6 + 2, kv.second);
            }
            Eigen::SparseMatrix<double> M_nod(dof, dof);
            M_nod.setFromTriplets(tri.begin(), tri.end());
            M_global += M_nod;
        }
    }

    // --- 2b. Masa solo lateral (ETABS INCLUDEVERTICALMASS "No") ---
    // Conserva SOLO la masa de los GDL Ux,Uy (lumpeo por suma de filas = ETABS LUMPATSTORIES).
    // Uz y rotaciones → masa 0. Con la iteración de subespacio (abajo) esos GDL siguen en la
    // malla (rigidez completa) pero no cargan masa → los modos salen laterales/torsionales.
    if (lateral_mass)
    {
        Eigen::VectorXd rowsum = Eigen::VectorXd::Zero(dof);
        for (int k = 0; k < M_global.outerSize(); ++k)
            for (Eigen::SparseMatrix<double>::InnerIterator it(M_global, k); it; ++it)
                rowsum(it.row()) += it.value();
        std::vector<Eigen::Triplet<double>> trips;
        for (int i = 0; i < num_nodes; ++i) {
            trips.emplace_back(i*6+0, i*6+0, std::max(rowsum(i*6+0), 0.0));  // Ux lumpeada
            trips.emplace_back(i*6+1, i*6+1, std::max(rowsum(i*6+1), 0.0));  // Uy lumpeada
        }
        Eigen::SparseMatrix<double> M_lat(dof, dof);
        M_lat.setFromTriplets(trips.begin(), trips.end());
        M_global = M_lat;
    }

    // --- 2c. LUMPATSTORIES: agrupar la masa por PISOS ---
    //
    // El MASSSOURCE del galpon en ETABS dice, literal:
    //    INCLUDEELEMENTS "Yes"  INCLUDELOADS "No"
    //    INCLUDELATERALMASS "Yes"  INCLUDEVERTICALMASS "No"
    //    LUMPATSTORIES "Yes"
    //
    // Las dos primeras ya las hacia Hekatan; esta no. ETABS coge la masa de
    // cada nivel y la CONCENTRA en los nudos de ese nivel, en vez de dejarla
    // donde cae por elemento (rho*A*L/2 en cada extremo). Con la misma masa
    // total repartida distinto, los modos salen distintos — y ese era el
    // desacuerdo que quedaba: modo 3 ETABS 3.70 Hz contra 4.86 de Hekatan.
    //
    // Los niveles no se declaran en el .heks, hay que detectarlos. Y un piso
    // NO es "una cota Z cualquiera": es una cota donde coincide MUCHA gente.
    // Medido en el galpon: z = 4.00 tiene 218 nudos y z = 8.00 tiene 90,
    // mientras las demas cotas tienen 1, 2 o 6.
    //
    // Antes agrupaba con 30 cm de tolerancia y encadenando, y eso rompia
    // justo aqui: los nudos de la cercha inclinada estan a 8.00, 8.09,
    // 8.18 ... 9.11, o sea a 9 cm unos de otros, asi que se fundian TODOS en
    // un solo nivel cuyo centro iba derivando hacia arriba. Con eso movia
    // masa de mas y la frecuencia empeoraba (3.2994 -> 2.7575 Hz contra
    // 3.2648 de ETABS) aunque la participacion de masa mejorara.
    //
    // Ahora: se cuentan los nudos por cota (juntando solo lo que esta a
    // menos de 5 cm, que es ruido de modelado, no una rampa) y se queda con
    // las cotas POBLADAS — las que llegan al 10 % de la mas poblada. Una
    // cercha inclinada no pasa ese filtro; un piso, si. Un nudo que no cae
    // en un piso manda su masa al nivel MAS CERCANO.
    if (lump_stories)
    {
        std::vector<double> zs;
        zs.reserve(num_nodes);
        for (int i = 0; i < num_nodes; ++i) zs.push_back(nodes[i][2]);
        std::sort(zs.begin(), zs.end());

        // 1) agrupar cotas practicamente iguales (ruido de modelado)
        const double TOL_Z = 0.05;               // m
        std::vector<double> cota;                // centro de cada grupo
        std::vector<int>    cuantos;             // nudos en el grupo
        for (double z : zs) {
            if (cota.empty() || z - cota.back() > TOL_Z) {
                cota.push_back(z);
                cuantos.push_back(1);
            } else {
                // media corrida: el centro no deriva con el tamano del grupo
                cuantos.back()++;
                cota.back() += (z - cota.back()) / cuantos.back();
            }
        }
        // 2) quedarse con las POBLADAS
        int masPoblada = 0;
        for (int c : cuantos) masPoblada = std::max(masPoblada, c);
        const int MINIMO = std::max(2, masPoblada / 10);
        std::vector<double> niveles;
        for (size_t k = 0; k < cota.size(); ++k)
            if (cuantos[k] >= MINIMO) niveles.push_back(cota[k]);

        if (niveles.size() >= 2)
        {
            // A que nivel va cada nudo: al PISO DE ARRIBA, no al mas
            // cercano. Preguntado a ETABS (`PointObj.GetLabelFromName`
            // devuelve el piso de cada nudo), en el galpon sale que cada
            // piso posee desde justo encima del piso de abajo hasta su
            // propia cota:
            //
            //    Base           28 nudos    z de 0.000 a 0.000
            //    CordonInf 3.00 131 nudos   z de 0.147 a 3.000
            //    Entrepiso 4.00 202 nudos   z de 3.055 a 4.000
            //
            // "Al mas cercano" partia el tramo 0-3 por la mitad y mandaba
            // media columna a la base, que esta empotrada: esa masa
            // desaparecia y las frecuencias SUBIAN. En ETABS agrupar las
            // BAJA (modo 3: 4.4312 -> 3.7036), porque concentra la masa
            // arriba, que es donde los modos se mueven.
            //
            // Por encima del ultimo nivel no hay piso de arriba: esa masa se
            // queda en el ultimo, que es tambien lo que hace ETABS (el
            // Cumbrero a 9.11 no recibe nada; todo lo de encima de 8.00
            // acaba en 8.00).
            // nudos que ESTAN en cada piso (los que reciben la masa)
            std::vector<std::vector<int>> enNivel(niveles.size());
            for (int i = 0; i < num_nodes; ++i)
                for (size_t k = 0; k < niveles.size(); ++k)
                    if (std::abs(nodes[i][2] - niveles[k]) <= TOL_Z)
                        { enNivel[k].push_back(i); break; }

            // masa nodal actual (M es diagonal: lumped HRZ)
            std::vector<double> mNodo(num_nodes, 0.0);
            for (int i = 0; i < num_nodes; ++i)
                mNodo[i] = std::max(M_global.coeff(i * 6 + 0, i * 6 + 0), 0.0);

            // Radio para decidir que es "la misma vertical". Fijo en metros
            // no vale para cualquier modelo, asi que se escala con el
            // tamano en planta.
            double xmin = nodes[0][0], xmax = nodes[0][0];
            double ymin = nodes[0][1], ymax = nodes[0][1];
            for (int i = 1; i < num_nodes; ++i) {
                xmin = std::min(xmin, nodes[i][0]); xmax = std::max(xmax, nodes[i][0]);
                ymin = std::min(ymin, nodes[i][1]); ymax = std::max(ymax, nodes[i][1]);
            }
            const double diag = std::sqrt((xmax-xmin)*(xmax-xmin) + (ymax-ymin)*(ymax-ymin));
            const double RADIO = std::max(0.10, 0.01 * diag);

            // el nudo del piso k que cae mas cerca EN PLANTA, o -1
            auto enLaVertical = [&](size_t k, double x, double y) -> int {
                int mejor = -1; double dmin = RADIO * RADIO;
                for (int j : enNivel[k]) {
                    double dx = nodes[j][0] - x, dy = nodes[j][1] - y;
                    double d = dx*dx + dy*dy;
                    if (d <= dmin) { dmin = d; mejor = j; }
                }
                return mejor;
            };

            // Y si en su vertical no hay nadie: el nudo mas cercano de ese
            // piso, sin limite de distancia. Ninguna masa se queda a media
            // altura — medido con AssembledJointMass, ETABS tiene CERO masa
            // fuera de las cotas de piso, y la de Hekatan se quedaba
            // desparramada en 40 cotas intermedias.
            auto masCercanoDelPiso = [&](size_t k, double x, double y) -> int {
                int mejor = -1; double dmin = std::numeric_limits<double>::max();
                for (int j : enNivel[k]) {
                    double dx = nodes[j][0] - x, dy = nodes[j][1] - y;
                    double d = dx*dx + dy*dy;
                    if (d < dmin) { dmin = d; mejor = j; }
                }
                return mejor;
            };

            // La masa de cada nudo sube y baja POR SU PROPIA VERTICAL, y se
            // parte entre los dos pisos que lo encierran por BRAZO DE
            // PALANCA, como una carga puntual entre dos apoyos. Medido en el
            // galpon: la columna en (2.00, 12.43) acumula 4.4520 t en sus
            // tres nudos entre 0 y 3, y ETABS pone 3.8843 t en el nudo de esa
            // MISMA columna a z = 3. El nudo gordo esta a 2.65, o sea
            // 2.65/3 = 88.3 % arriba: 4.2877 * 0.883 = 3.786, mas lo suyo.
            //
            // Antes repartia la masa del nivel entre TODOS los nudos de ese
            // nivel, en proporcion a la que ya tenian. Eso desparrama por la
            // planta lo que en realidad se queda en su columna, y cambia los
            // modos torsionales y laterales: el modo 3 salia a 4.43 Hz
            // contra 3.70 de ETABS. Comprobado nudo a nudo, esta regla
            // acierta el 74 % de los nudos dentro del 5 %.
            std::vector<double> nueva(num_nodes, 0.0);
            for (int i = 0; i < num_nodes; ++i) {
                const double m = mNodo[i];
                if (m <= 1e-12) continue;
                const double z = nodes[i][2];
                // .entre que dos pisos cae?
                size_t ka = niveles.size() - 1;
                for (size_t k = 0; k < niveles.size(); ++k)
                    if (z <= niveles[k] + TOL_Z) { ka = k; break; }

                // reparto: (nivel, fraccion)
                double fa = 1.0;
                bool hayAbajo = (ka > 0) && (std::abs(z - niveles[ka]) > TOL_Z);
                if (hayAbajo) {
                    const double za = niveles[ka], zb = niveles[ka - 1];
                    fa = (za > zb) ? (z - zb) / (za - zb) : 1.0;
                    if (fa < 0.0) fa = 0.0;
                    if (fa > 1.0) fa = 1.0;
                }
                // Cada mitad va al nudo de su vertical; si esa vertical no
                // llega al piso (un nudo de arriostre, la punta de una
                // diagonal), al nudo mas cercano de ese piso. Antes se
                // quedaba a media altura, y eso son 2.4249 t del galpon
                // — el 1.7 % del modelo — repartidas en 40 cotas donde
                // ETABS no pone absolutamente nada.
                double repartida = 0.0;
                int da = enLaVertical(ka, nodes[i][0], nodes[i][1]);
                if (da < 0) da = masCercanoDelPiso(ka, nodes[i][0], nodes[i][1]);
                if (da >= 0) { nueva[da] += m * fa; repartida += m * fa; }
                if (hayAbajo) {
                    int db = enLaVertical(ka - 1, nodes[i][0], nodes[i][1]);
                    if (db < 0) db = masCercanoDelPiso(ka - 1, nodes[i][0], nodes[i][1]);
                    if (db >= 0) { nueva[db] += m * (1.0 - fa); repartida += m * (1.0 - fa); }
                }
                // si ni asi hay a donde mandarla (un piso vacio), se queda
                // donde esta: perderla cambiaria la masa total del modelo
                if (repartida < m - 1e-12) nueva[i] += m - repartida;
            }

            std::vector<Eigen::Triplet<double>> tri;
            for (int i = 0; i < num_nodes; ++i) {
                if (nueva[i] <= 0.0) continue;
                tri.emplace_back(i*6+0, i*6+0, nueva[i]);
                tri.emplace_back(i*6+1, i*6+1, nueva[i]);
                if (!lateral_mass) tri.emplace_back(i*6+2, i*6+2, nueva[i]);
            }
            Eigen::SparseMatrix<double> M_lump(dof, dof);
            M_lump.setFromTriplets(tri.begin(), tri.end());
            M_global = M_lump;
        }
    }

    return M_global;
}

extern "C"
{
    // La masa ensamblada nudo a nudo, que es la tabla `AssembledJointMass` de
    // ETABS. Sale por `mass_out`, 6 huecos por nudo (Ux Uy Uz Rx Ry Rz) en el
    // orden de los nudos de entrada. No resuelve nada: solo pesa.
    void assembled_joint_mass(
        double *nodes_flat_ptr, int num_nodes,
        unsigned int *element_indices_ptr, int num_element_indices,
        unsigned int *element_sizes_ptr, int num_elements,
        int *area_keys_ptr, double *area_values_ptr, int num_areas,
        int *density_keys_ptr, double *density_values_ptr, int num_densities,
        int *thickness_keys_ptr, double *thickness_values_ptr, int num_thicknesses,
        int *nodemass_keys_ptr, double *nodemass_values_ptr, int num_nodemass,
        int include_elements, int lateral_mass, int lump_stories,
        double *mass_out)
    {
        std::vector<Node> nodes(num_nodes, Node(3));
        for (int i = 0; i < num_nodes; ++i) {
            nodes[i][0] = nodes_flat_ptr[i * 3 + 0];
            nodes[i][1] = nodes_flat_ptr[i * 3 + 1];
            nodes[i][2] = nodes_flat_ptr[i * 3 + 2];
        }
        std::vector<unsigned int> element_indices(element_indices_ptr, element_indices_ptr + num_element_indices);
        std::vector<unsigned int> element_sizes(element_sizes_ptr, element_sizes_ptr + num_elements);

        ElementInputs elementInputs;
        elementInputs.areas = parseMapFromFlat(area_keys_ptr, area_values_ptr, num_areas);
        elementInputs.densities = parseMapFromFlat(density_keys_ptr, density_values_ptr, num_densities);
        elementInputs.thicknesses = parseMapFromFlat(thickness_keys_ptr, thickness_values_ptr, num_thicknesses);

        const int dof = num_nodes * 6;
        std::map<int, double> masaNodal =
            parseMapFromFlat(nodemass_keys_ptr, nodemass_values_ptr, num_nodemass);

        Eigen::SparseMatrix<double> M = ensamblarMasa(
            nodes, element_indices, element_sizes, elementInputs, masaNodal,
            num_nodes, dof, include_elements, lateral_mass, lump_stories);

        for (int i = 0; i < num_nodes * 6; ++i) mass_out[i] = 0.0;
        for (int k = 0; k < M.outerSize(); ++k)
            for (Eigen::SparseMatrix<double>::InnerIterator it(M, k); it; ++it)
                if (it.row() == it.col()) mass_out[it.row()] = it.value();
    }

    void modal(
        // Geometry
        double *nodes_flat_ptr, int num_nodes,
        unsigned int *element_indices_ptr, int num_element_indices,
        unsigned int *element_sizes_ptr, int num_elements,

        // Node Inputs (supports only — no loads needed for modal)
        int *support_keys_ptr, bool *support_values_ptr, int num_supports,

        // Element Inputs (material & section properties)
        int *elasticity_keys_ptr, double *elasticity_values_ptr, int num_elasticities,
        int *area_keys_ptr, double *area_values_ptr, int num_areas,
        int *moi_z_keys_ptr, double *moi_z_values_ptr, int num_moi_z,
        int *moi_y_keys_ptr, double *moi_y_values_ptr, int num_moi_y,
        int *shear_mod_keys_ptr, double *shear_mod_values_ptr, int num_shear_mod,
        int *torsion_keys_ptr, double *torsion_values_ptr, int num_torsion,
        int *density_keys_ptr, double *density_values_ptr, int num_densities,
        int *thickness_keys_ptr, double *thickness_values_ptr, int num_thicknesses,
        int *poisson_keys_ptr, double *poisson_values_ptr, int num_poissons,
        int *memmod_keys_ptr, double *memmod_values_ptr, int num_memmods,
        int *bendmod_keys_ptr, double *bendmod_values_ptr, int num_bendmods,
        // Plate formulation per shell: 0=Mindlin (Shell-Thick DSE), 1=Kirchhoff MZC (Shell-Thin DKE)
        int *plateForm_keys_ptr, int *plateForm_values_ptr, int num_plateForm,
        // DRILLING DOF (el giro normal al plano del shell, theta_z).
        //   tipo:   0 = penalty 1e-6 legacy, 1 = muelle debil PyNite,
        //           2 = Hughes-Brezzi  [DEFECTO si el mapa viene vacio]
        //   escala: factor sobre gamma = G*t del penalty Hughes-Brezzi.
        //
        // El SEPTIMO dato del mismo molde: el estatico lo recibia (deformCpp.ts
        // lo empaqueta) y el modal NO, asi que armaban una K distinta del mismo
        // modelo. Se caza con la prueba mas barata que hay — cambiar el dato y
        // ver si el resultado se mueve: `--drill 100` y `--nodrill` daban las
        // MISMAS frecuencias hasta la ultima cifra.
        //
        // Con el defecto (tipo 2, escala 1.0) no cambia ningun resultado ya
        // validado; lo que cambia es que ahora se PUEDE tocar, y que un modelo
        // con drillingTypes (una membrana pura pide tipo 0) deja de resolver
        // dos matrices distintas segun quien pregunte.
        int *drillType_keys_ptr, int *drillType_values_ptr, int num_drillType,
        int *drillScale_keys_ptr, double *drillScale_values_ptr, int num_drillScale,
        // Areas de cortante y angulo de eje local. El estatico ya las recibia y
        // el modal NO, asi que los dos armaban una K DISTINTA del mismo modelo:
        // sin `as` se supone 5/6*A (el doble del alma real en estos perfiles) y
        // sin `ang` los perfiles quedan mal orientados — una C 200x50 girada 90
        // grados es ONCE veces mas floja. Medido en el galpon: el modal salia
        // rigido de mas del modo 2 en adelante (modo 3: 5.01 Hz contra 3.70 de
        // ETABS) mientras el estatico cerraba al 0.9 %.
        int *shearY_keys_ptr, double *shearY_values_ptr, int num_shearY,
        int *shearZ_keys_ptr, double *shearZ_values_ptr, int num_shearZ,
        int *locang_keys_ptr, double *locang_values_ptr, int num_locang,
        // END RELEASES, 12 banderas por barra en el orden de ETABS:
        //   [U1 U2 U3 R1 R2 R3] en I + los mismos seis en J.
        // El SEXTO dato que el estatico recibia y el modal no. Aqui es peor que
        // en los otros cinco: hasta ahora NINGUNO de los dos los aplicaba, asi
        // que una barra biarticulada entraba empotrada en todo el programa.
        int *release_keys_ptr, bool *release_values_ptr, int num_releases,
        // MASA NODAL en toneladas, la que NO sale del peso propio.
        //
        // Es la fuente de masa de ETABS. Su MASSSOURCE tiene dos interruptores
        // independientes y hasta ahora Hekatan solo sabia hacer el primero:
        //
        //    INCLUDEELEMENTS  la masa de los elementos, rho*A*L
        //    INCLUDELOADS     patrones de carga convertidos en masa (carga/g)
        //
        // El CIMENTAC del GAD RIOCHICO tiene INCLUDEELEMENTS "No" e
        // INCLUDELOADS "Yes" con PP y SCP: ahi la masa NO es el peso propio de
        // los elementos, son las cargas. Sin esto no hay forma de que cuadre por
        // muy bien que este el solver.
        int *nodemass_keys_ptr, double *nodemass_values_ptr, int num_nodemass,
        int include_elements,   // 0 = ignorar rho*A*L (ETABS INCLUDEELEMENTS No)
        // DIAFRAGMA RIGIDO por nudo: 0 = ninguno, 1..n = a que diafragma
        // pertenece. Ata Ux, Uy y Rz de todos los nudos del grupo.
        int *diaph_keys_ptr, double *diaph_values_ptr, int num_diaph,
        // RESORTES NODALES (Winkler). Plano: [nudo0, gdl0, k0, nudo1, ...].
        //
        // El estatico ya los recibia y el modal NO — el tercer caso del mismo
        // molde, despues de las areas de cortante y los angulos de eje local.
        // La cimentacion del CIMENTAC del GAD RIOCHICO se apoya en 612 resortes
        // verticales de balasto: sin ellos el modelo FLOTA y salian periodos de
        // 71.675 s. Y no avisa nada, porque un modelo sin sujecion sigue
        // teniendo solucion, solo que sin sentido.
        double *springs_flat_ptr, int num_springs,

        // La union viga-muro de ETABS (ver utils/etabsWallJoint.h). 0 = apagado.
        int etabs_wall_joint,

        // Control
        int num_modes,   // number of modes to return (0 = all)
        int lateral_mass, // 1 = masa solo lateral Ux,Uy (ETABS INCLUDEVERTICALMASS No)
        int lump_stories, // 1 = agrupar la masa por PISOS (ETABS LUMPATSTORIES Yes)

        // Outputs
        double **frequencies_ptr_out, int *num_frequencies_out,
        double **mode_shapes_ptr_out, int *mode_shapes_rows_out, int *mode_shapes_cols_out,
        double **mass_participation_ptr_out, int *mass_participation_rows_out, int *mass_participation_cols_out)
    {
        // Initialize outputs to null
        *frequencies_ptr_out = nullptr;
        *num_frequencies_out = 0;
        *mode_shapes_ptr_out = nullptr;
        *mode_shapes_rows_out = 0;
        *mode_shapes_cols_out = 0;
        *mass_participation_ptr_out = nullptr;
        *mass_participation_rows_out = 0;
        *mass_participation_cols_out = 0;

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

        ElementInputs elementInputs;
        elementInputs.elasticities = parseMapFromFlat(elasticity_keys_ptr, elasticity_values_ptr, num_elasticities);
        elementInputs.areas = parseMapFromFlat(area_keys_ptr, area_values_ptr, num_areas);
        elementInputs.momentsOfInertiaZ = parseMapFromFlat(moi_z_keys_ptr, moi_z_values_ptr, num_moi_z);
        elementInputs.momentsOfInertiaY = parseMapFromFlat(moi_y_keys_ptr, moi_y_values_ptr, num_moi_y);
        elementInputs.shearModuli = parseMapFromFlat(shear_mod_keys_ptr, shear_mod_values_ptr, num_shear_mod);
        elementInputs.torsionalConstants = parseMapFromFlat(torsion_keys_ptr, torsion_values_ptr, num_torsion);
        elementInputs.densities = parseMapFromFlat(density_keys_ptr, density_values_ptr, num_densities);
        elementInputs.thicknesses = parseMapFromFlat(thickness_keys_ptr, thickness_values_ptr, num_thicknesses);
        elementInputs.poissonsRatios = parseMapFromFlat(poisson_keys_ptr, poisson_values_ptr, num_poissons);
        elementInputs.membraneModifiers = parseMapFromFlat(memmod_keys_ptr, memmod_values_ptr, num_memmods);
        elementInputs.bendingModifiers = parseMapFromFlat(bendmod_keys_ptr, bendmod_values_ptr, num_bendmods);
        elementInputs.plateFormulations = parseMapIntFromFlat(plateForm_keys_ptr, plateForm_values_ptr, num_plateForm);
        elementInputs.drillingTypes = parseMapIntFromFlat(drillType_keys_ptr, drillType_values_ptr, num_drillType);
        elementInputs.drillingPenaltyScales = parseMapFromFlat(drillScale_keys_ptr, drillScale_values_ptr, num_drillScale);
        elementInputs.shearAreasY = parseMapFromFlat(shearY_keys_ptr, shearY_values_ptr, num_shearY);
        elementInputs.shearAreasZ = parseMapFromFlat(shearZ_keys_ptr, shearZ_values_ptr, num_shearZ);
        elementInputs.localAngles = parseMapFromFlat(locang_keys_ptr, locang_values_ptr, num_locang);
        elementInputs.momentReleases = parseMapBoolVecFromFlat(release_keys_ptr, release_values_ptr, num_releases, 12);

        // --- 2. Assemble K and M ---
        int dof = num_nodes * 6;

        Eigen::SparseMatrix<double> K_global = getGlobalStiffnessMatrix(
            nodes, element_indices, element_sizes, elementInputs, dof);

        // Resortes a la diagonal de K, ANTES de reducir por diafragma.
        for (int i = 0; i < num_springs; ++i) {
            const int nodo = (int)springs_flat_ptr[3 * i];
            const int d    = (int)springs_flat_ptr[3 * i + 1];
            const double k = springs_flat_ptr[3 * i + 2];
            if (springsExtra::despacharMuelleExtra(K_global, nodes, element_indices, element_sizes, nodo, d, k)) continue;
            if (nodo < 0 || nodo >= num_nodes || d < 0 || d > 5 || k == 0.0) continue;
            K_global.coeffRef(nodo * 6 + d, nodo * 6 + d) += k;
        }
        if (etabs_wall_joint) addEtabsWallJoint(K_global, nodes, element_indices, element_sizes, elementInputs);

        // La masa se arma en ensamblarMasa() (arriba): los mismos pasos 2a,
        // 2b y 2c de ETABS, ahora en una funcion que tambien puede llamarse
        // sola desde fuera (assembled_joint_mass) para PESAR el modelo nudo a
        // nudo sin resolver los modos.
        Eigen::SparseMatrix<double> M_global;
        {
            std::map<int, double> masaNodal =
                parseMapFromFlat(nodemass_keys_ptr, nodemass_values_ptr, num_nodemass);
            M_global = ensamblarMasa(
                nodes, element_indices, element_sizes, elementInputs, masaNodal,
                num_nodes, dof, include_elements, lateral_mass, lump_stories);
        }

        // --- 2d. DIAFRAGMAS RIGIDOS ---
        //
        // Un diafragma rigido ata todos los nudos de una planta a moverse como
        // un solido en su plano: se mueven juntos en Ux y Uy y giran juntos en
        // Rz. ETABS lo pone como restriccion, no como rigidez, y sin el un
        // modelo con losas de diafragma sale MUCHO mas flexible. El CIMENTAC del
        // GAD RIOCHICO tiene dos (D1 y D2).
        //
        // Se hace con una matriz de transformacion T: los GDL de los nudos
        // esclavos dejan de ser incognita y quedan escritos en funcion de los
        // tres del maestro,
        //
        //     ux_i = ux_m - (y_i - y_m) * rz_m
        //     uy_i = uy_m + (x_i - x_m) * rz_m
        //     rz_i = rz_m
        //
        // y el problema se resuelve en las coordenadas reducidas:
        // K_r = T^T K T,  M_r = T^T M T. Se elige de maestro el PRIMER nudo del
        // diafragma; da igual cual sea, el movimiento del conjunto es el mismo.
        Eigen::SparseMatrix<double> T_dia;      // dof_completo x dof_reducido
        Eigen::SparseMatrix<double> M_completa; // M antes de reducir
        bool hayDiafragma = false;
        const int dofCompleto = dof;
        std::vector<int> colDe;                 // GDL completo -> GDL reducido
        std::map<int, std::array<double, 2>> centro;   // grupo -> centro de masa del diafragma
        std::map<int, int> colMaestro;                 // grupo -> columna de ux del maestro virtual
        std::vector<int> diaDe(num_nodes, -1);
        std::vector<char> soloTras(num_nodes, 0);   // grupo NEGATIVO: ata ux, uy y deja rz libre
        {
            std::map<int, double> diafr =
                parseMapFromFlat(diaph_keys_ptr, diaph_values_ptr, num_diaph);
            std::map<int, std::vector<int>> grupos;
            for (const auto &kv : diafr) {
                if (kv.first < 0 || kv.first >= num_nodes) continue;
                const int gs = (int)std::llround(kv.second);
                const int g = gs < 0 ? -gs : gs;
                if (g == 0) continue;            // 0 = sin diafragma
                grupos[g].push_back(kv.first);
                diaDe[kv.first] = g;
                soloTras[kv.first] = gs < 0 ? 1 : 0;
            }
            // un diafragma de un solo nudo no ata nada
            for (auto it = grupos.begin(); it != grupos.end(); ) {
                if (it->second.size() < 2) {
                    for (int i : it->second) diaDe[i] = -1;
                    it = grupos.erase(it);
                } else ++it;
            }
            if (!grupos.empty())
            {
                hayDiafragma = true;
                // MAESTRO VIRTUAL en el CENTRO DE MASA de cada diafragma, como ETABS.
                // Antes el maestro era un nudo real (el primero del grupo, una
                // esquina): la M reducida lleva entonces el acoplamiento
                // ux_m-rz_m = -sum(m*dy), que no es cero, y el solver solo mira la
                // DIAGONAL de M (Md en el subespacio). Medido el 3-sep-2026 en un
                // portico de 1 planta: T_x 0.348 s con diafragma contra 0.189 s sin
                // el (y 0.189 con el maestro en el centro). En el centro de masa el
                // acoplamiento es cero y la diagonal es exacta.
                for (const auto &g : grupos) {
                    double sm = 0.0, sx = 0.0, sy = 0.0;
                    for (int i : g.second) {
                        const double mi = std::max(M_global.coeff(i * 6, i * 6), 0.0);
                        sm += mi; sx += mi * nodes[i][0]; sy += mi * nodes[i][1];
                    }
                    if (sm <= 0.0) {
                        sm = 0.0; sx = 0.0; sy = 0.0;
                        for (int i : g.second) { sm += 1.0; sx += nodes[i][0]; sy += nodes[i][1]; }
                    }
                    centro[g.first] = { sx / sm, sy / sm };
                }

                colDe.assign(dof, -1);
                int nred = 0;
                for (int i = 0; i < num_nodes; ++i)
                    for (int k = 0; k < 6; ++k) {
                        const bool atado = (diaDe[i] > 0) && (k == 0 || k == 1 || (k == 5 && !soloTras[i]));
                        if (!atado) colDe[i * 6 + k] = nred++;
                    }
                for (const auto &g : grupos) { colMaestro[g.first] = nred; nred += 3; }   // uy = +1, rz = +2
                std::vector<Eigen::Triplet<double>> tt;
                tt.reserve(dof * 2);
                for (int i = 0; i < num_nodes; ++i) {
                    const int g = diaDe[i];
                    for (int k = 0; k < 6; ++k) {
                        const int fila = i * 6 + k;
                        if (colDe[fila] >= 0) { tt.emplace_back(fila, colDe[fila], 1.0); continue; }
                        const int cm = colMaestro[g];
                        const double dx = nodes[i][0] - centro[g][0];
                        const double dy = nodes[i][1] - centro[g][1];
                        if (k == 0) {                      // ux = ux_c - dy*rz_c
                            tt.emplace_back(fila, cm + 0, 1.0);
                            tt.emplace_back(fila, cm + 2, -dy);
                        } else if (k == 1) {               // uy = uy_c + dx*rz_c
                            tt.emplace_back(fila, cm + 1, 1.0);
                            tt.emplace_back(fila, cm + 2, dx);
                        } else {                           // rz = rz_c
                            tt.emplace_back(fila, cm + 2, 1.0);
                        }
                    }
                }
                T_dia.resize(dof, nred);
                T_dia.setFromTriplets(tt.begin(), tt.end());
                M_completa = M_global;      // hace falta para el centro de masa
                K_global = (T_dia.transpose() * K_global * T_dia).pruned();
                M_global = (T_dia.transpose() * M_global * T_dia).pruned();
                dof = nred;
            }
        }

        // --- 3. Apply boundary conditions + reducción ---
        //
        // Con diafragma los GDL ya NO son i*6+k, asi que los apoyos hay que
        // traducirlos con `colDe`. Un GDL apoyado que ademas sea esclavo del
        // diafragma se ignora: apoyar en Ux un nudo atado al diafragma ataria
        // toda la planta, y eso no es lo que quiere decir el modelo.
        std::vector<int> freeIndices;
        if (hayDiafragma) {
            std::vector<bool> fijo(dof, false);
            for (const auto &kv : nodeInputs.supports) {
                const int i = kv.first;
                if (i < 0 || i * 6 + 5 >= dofCompleto) continue;
                for (int k = 0; k < 6 && k < (int)kv.second.size(); ++k) {
                    if (!kv.second[k]) continue;
                    const int c = colDe[i * 6 + k];
                    if (c >= 0) fijo[c] = true;
                }
            }
            for (int c = 0; c < dof; ++c) if (!fijo[c]) freeIndices.push_back(c);
        } else {
            freeIndices = getFreeIndices(nodeInputs, dof);
        }
        std::vector<int> zeroIndicesK = getZerosIndices(K_global);
        std::sort(zeroIndicesK.begin(), zeroIndicesK.end());

        // --- 3b. Grados SIN RIGIDEZ: fuera del modal ---
        //
        // Un grado con rigidez cero no puede vibrar: si ademas tiene masa, sale
        // omega = 0, o sea periodo infinito. Y no es un fallo del solver, es que
        // esa incognita no pertenece a la estructura.
        //
        // Pasa de verdad: el CIMENTAC del GAD RIOCHICO trae DOS NUDOS SUELTOS,
        // sin ninguna barra ni cascara, y uno de ellos con 1.48 t de masa. Con
        // ellos dentro, el modal daba periodos de 241.000 s y las
        // participaciones salian identicas en todos los modos —los autovectores
        // no valian nada—. ETABS los quita solo; aqui tambien.
        //
        // Se mira la DIAGONAL de K: si es practicamente cero comparada con la
        // media, ese grado no esta sujeto a nada.
        {
            double media = 0.0;
            int cuantos = 0;
            for (int c : freeIndices) {
                const double k = K_global.coeff(c, c);
                if (k > 0) { media += k; cuantos++; }
            }
            if (cuantos > 0) {
                media /= cuantos;
                const double MINIMO = 1e-12 * media;

                // GRADOS DESCONECTADOS: sin masa y con TODA la fila despreciable.
                //
                // El de arriba mira solo la diagonal y no basta. Los END RELEASES
                // de ETABS crean juntas donde TODAS las barras que llegan sueltan
                // M2 y M3 en ese extremo: al condensar, esas barras dejan la fila
                // a cero y lo unico que queda es la torsion de algun perfil
                // abierto — 0.005 a 0.023 kN.m/rad contra una media de 1e6. No es
                // cero, asi que la regla de la diagonal no lo caza, pero deja K
                // sin poder factorizar (ETABS avisa de lo mismo en su .LOG:
                // "THE STRUCTURE IS UNSTABLE OR ILL-CONDITIONED").
                //
                // Quitarlos NO cambia nada: un grado sin masa y sin rigidez ni
                // transmite fuerza ni vibra. Su omega^2 = k/m con m = 0 se va al
                // infinito, o sea que ningun modo finito depende de el.
                //
                // Se exige SIN MASA a proposito. Un grado flojo PERO CON MASA si
                // es un modo de verdad —el poste de 4 t sobre la correa del
                // CIMENTAC, a 0.1 Hz— y ese tiene que salir, no taparse.
                const double DESCONECTADO = 1e-6 * media;
                std::vector<int> conRigidez;
                conRigidez.reserve(freeIndices.size());
                int fuera = 0, sueltos = 0;
                for (int c : freeIndices) {
                    if (K_global.coeff(c, c) <= MINIMO) { fuera++; continue; }
                    if (M_global.coeff(c, c) <= 0.0) {
                        double fila = 0.0;
                        for (Eigen::SparseMatrix<double>::InnerIterator it(K_global, c); it; ++it)
                            fila = std::max(fila, std::abs(it.value()));
                        if (fila < DESCONECTADO) { sueltos++; continue; }
                    }
                    conRigidez.push_back(c);
                }
                if (sueltos > 0)
                    std::cout << "modal: " << sueltos
                              << " grados desconectados (sin masa y sin rigidez) quedan fuera"
                              << std::endl;
                fuera += sueltos;
                if (fuera > 0) {
                    std::cout << "modal: " << fuera
                              << " grados sin rigidez quedan fuera (no pueden vibrar)"
                              << std::endl;
                    freeIndices.swap(conRigidez);
                }
            }
        }

        std::vector<int> reducedIndices;   // GDL sobre los que vive el eigen (columnas de eigenvectors)
        Eigen::VectorXd eigenvalues;       // ω² (ascendente)
        Eigen::MatrixXd eigenvectors;      // reducedSize × nComputed (M-ortonormal)

        // ── QUE CAMINO: subespacio o denso ──
        //
        // Lo decide el TAMAÑO del modelo, no el tipo de masa. Antes lo decidia
        // `lateral_mass`, que es otra cosa —si la masa va solo en Ux,Uy o
        // tambien en Uz—, y como llega en 0 por defecto TODO modelo caia en el
        // camino denso. Medido en el galpon (609 nudos, 3486 GDL libres):
        //
        //    denso:      matriz 3486 x 3486 = 97 MB, eigen completo,
        //                ~4.2e10 operaciones  ->  3 min 38 s en Node
        //    subespacio: K sparse factorizada UNA vez + 32 vectores,
        //                ~2.0e8 operaciones   ->  211 veces menos
        //
        // O sea se estaban calculando los 3486 modos para quedarse con 12.
        // ETABS nunca hace eso. El subespacio vale igual con masa 3D porque la
        // masa es lumped (HRZ): M ya es DIAGONAL, que es lo que este codigo
        // necesita.
        //
        // El denso se queda para modelos chicos: ahi da lo mismo en tiempo y
        // sirve de contraste — es el que valida el Paz 6.3 contra ETABS al
        // cuarto decimal, y conviene no tocarlo.
        const int GDL_DENSO = 400;         // por encima de esto, subespacio
        int nLibres = (int)freeIndices.size();

        // El camino denso (abajo) descarta los GDL libres con masa CERO
        // (típico de la masa nodal lumped: solo Ux,Uy,Uz tienen masa). Pero
        // descartarlos los FIJA, y un GDL sin masa que tiene rigidez NO está
        // fijo: se condensa estáticamente (Guyan), su rigidez acoplada debe
        // seguir actuando sobre los GDL con masa. El Paz 6.3 nunca lo mostró
        // porque usa masa consistente (densidades), donde ningún GDL libre
        // tiene masa nula. Con masa lumped un voladizo (columna con punta
        // libre, masa en el nudo superior) daba 9.78 Hz = biempotrada en vez de
        // 5.01 Hz = voladizo: la rotación de punta, sin masa, se estaba
        // anulando. La iteración de subespacio SÍ los conserva en la malla
        // (resuelve K·φ=ω²M·φ sobre todo el DOF con rigidez, la masa cero se
        // condensa implícitamente vía K⁻¹M, igual que ETABS). Por eso, si hay
        // algún GDL libre con rigidez y masa nula, hay que ir por subespacio.
        bool hayGDLsinMasa = false;
        for (int idx : freeIndices)
            if (!std::binary_search(zeroIndicesK.begin(), zeroIndicesK.end(), idx))
                if (std::abs(M_global.coeff(idx, idx)) < 1e-12)
                {
                    hayGDLsinMasa = true;
                    break;
                }
        bool usarSubespacio = lateral_mass || nLibres > GDL_DENSO || hayGDLsinMasa;

        if (usarSubespacio)
        {
            // ================= ITERACIÓN DE SUBESPACIO (Bathe) — como ETABS/SAPFire =================
            // Se resuelve K·φ = ω²·M·φ sobre la MALLA FINA COMPLETA (todos los GDL libres con rigidez),
            // sin condensar ni densificar. K se factoriza UNA sola vez (SimplicialLDLT sparse) y se
            // reusa en las ~pocas iteraciones. La masa vive solo en Ux,Uy → los GDL sin masa (Uz,
            // rotaciones) se "condensan" implícitamente vía K⁻¹M (igual que ETABS con INCLUDEVERTICALMASS
            // No). Coste ≈ O(nnz(K)·nModes) por iteración → rápido aun con miles de nodos.
            std::vector<int> keep;   // GDL libres con rigidez (toda la malla)
            keep.reserve(freeIndices.size());
            for (int idx : freeIndices)
                if (!std::binary_search(zeroIndicesK.begin(), zeroIndicesK.end(), idx))
                    keep.push_back(idx);
            int n = (int)keep.size();
            if (n == 0) return;

            Eigen::SparseMatrix<double> Kf = extractBlock(K_global, keep, keep);
            Eigen::VectorXd Md(n);                       // masa diagonal en el espacio 'keep'
            for (int i = 0; i < n; ++i) Md(i) = std::max(M_global.coeff(keep[i], keep[i]), 0.0);

            Eigen::SimplicialLDLT<Eigen::SparseMatrix<double>> chol(Kf);
            Eigen::SparseLU<Eigen::SparseMatrix<double>> lu;
            bool usarLU = false;
            if (chol.info() != Eigen::Success)
            {
                // NO devolver en silencio. Un `return` mudo aqui es una hora
                // perdida: arriba se ve "MODAL puro: 0.09 s" y ni una
                // frecuencia, y no hay forma de saber si el modelo esta mal, si
                // el dato no llego o si el solver reviento.
                //
                // Si la factorizacion falla es que K no es definida positiva:
                // la estructura tiene un MECANISMO. Se busca donde mirando la
                // diagonal, que en un grado suelto se queda muy por debajo de
                // la media, y se dicen los peores por NUDO y DIRECCION.
                double media = 0.0;
                for (int i = 0; i < n; ++i) media += Kf.coeff(i, i);
                media = (n > 0) ? media / n : 0.0;
                std::vector<std::pair<double, int>> flojos;
                for (int i = 0; i < n; ++i) {
                    const double d = Kf.coeff(i, i);
                    if (d < 1e-8 * media) flojos.push_back({d, keep[i]});
                }
                std::sort(flojos.begin(), flojos.end());
                std::cout << "modal: la rigidez no se pudo factorizar — la "
                             "estructura tiene un mecanismo (K no definida "
                             "positiva). " << flojos.size()
                          << " grados con rigidez casi nula." << std::endl;
                // Con diafragma los indices YA NO son i*6+k, asi que hay que
                // deshacer `colDe` antes de nombrar el nudo. Sin esto el aviso
                // senala nudos que no tienen nada que ver y manda a buscar al
                // sitio equivocado.
                std::vector<int> deCol;
                if (hayDiafragma) {
                    deCol.assign(dof, -1);
                    for (int g = 0; g < dofCompleto; ++g)
                        if (colDe[g] >= 0) deCol[colDe[g]] = g;
                }
                const char *DIR[6] = {"Ux", "Uy", "Uz", "Rx", "Ry", "Rz"};
                for (size_t k = 0; k < flojos.size() && k < 10; ++k) {
                    const int c = flojos[k].second;
                    const int g = hayDiafragma ? deCol[c] : c;
                    if (g < 0) { std::cout << "   (grado maestro de diafragma)" << std::endl; continue; }
                    std::cout << "   nudo " << (g / 6) + 1 << " " << DIR[g % 6]
                              << "   k = " << flojos[k].first << std::endl;
                }
                // Se SIGUE con SparseLU, que es lo que ya hacia el estatico en
                // este mismo caso. LDLT exige definida positiva; LU no, y una
                // junta muy floja —que es lo que sale con los end releases de
                // ETABS puestos— la resuelve igual. Es mas lento, pero lo otro
                // es no dar resultado.
                lu.compute(Kf);
                if (lu.info() != Eigen::Success) {
                    std::cout << "modal: tampoco se pudo con SparseLU — la "
                                 "rigidez es singular de verdad." << std::endl;
                    return;
                }
                usarLU = true;
                std::cout << "modal: se sigue con SparseLU." << std::endl;
            }

            // ── vectores iniciales (Bathe): col 0 = diagonal de masa; resto = e_j en los GDL CON
            //    MASA de mayor razón masa/rigidez. Solo GDL con masa → el subespacio nunca degenera
            //    (ninguna columna sin masa → Mbar no se vuelve singular en modelos chicos). ──
            Eigen::VectorXd Kdiag = Kf.diagonal();
            std::vector<std::pair<double,int>> ratio;   // (Md/Kdiag, idx) solo GDL con masa
            for (int i = 0; i < n; ++i) {
                if (Md(i) > 0.0) {
                    double kd = (Kdiag(i) > 1e-30) ? Kdiag(i) : 1e-30;
                    ratio.emplace_back(Md(i) / kd, i);
                }
            }
            int nMass = (int)ratio.size();
            if (nMass == 0) { std::cout << "modal: no hay ni un grado libre CON MASA" << std::endl; return; }
            std::sort(ratio.begin(), ratio.end(), [](auto &a, auto &b){ return a.first > b.first; });

            int nmodes = (num_modes > 0) ? num_modes : 10;
            // q acotado por el nº de GDL con masa: no hay más modos laterales que GDL de masa.
            int q = std::min(n, std::min(2 * nmodes + 8, nMass));
            if (q < 1) { std::cout << "modal: el subespacio se quedo sin vectores (q < 1)" << std::endl; return; }

            Eigen::MatrixXd X = Eigen::MatrixXd::Zero(n, q);
            for (int i = 0; i < n; ++i) X(i, 0) = Md(i);                  // col 0 = diagonal de masa
            for (int c = 1; c < q; ++c) X(ratio[c - 1].second, c) = 1.0;  // e_j en GDL con masa

            // ── iteración de subespacio ──
            Eigen::VectorXd lamPrev = Eigen::VectorXd::Zero(std::min(nmodes, q));
            Eigen::MatrixXd Xbar, Q;
            Eigen::VectorXd lam;
            for (int iter = 0; iter < 30; ++iter)
            {
                Eigen::MatrixXd MX = Md.asDiagonal() * X;      // M·X
                // X̄ = K⁻¹·M·X (barra de inversa). Con if/else y no con `?:`:
                // Eigen devuelve un tipo de EXPRESION distinto por cada solver y el
                // ternario no los puede unificar.
                if (usarLU) Xbar = lu.solve(MX);
                else        Xbar = chol.solve(MX);
                Eigen::MatrixXd MXbar = Md.asDiagonal() * Xbar;
                Eigen::MatrixXd Kbar = Xbar.transpose() * MX;  // X̄ᵀ·M·X = X̄ᵀ·K·X̄
                Eigen::MatrixXd Mbar = Xbar.transpose() * MXbar; // X̄ᵀ·M·X̄
                Kbar = 0.5 * (Kbar + Kbar.transpose());
                Mbar = 0.5 * (Mbar + Mbar.transpose());
                Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> ges(Kbar, Mbar);
                if (ges.info() != Eigen::Success) {
                    std::cout << "modal: el problema reducido del subespacio no se "
                                 "pudo resolver en la iteracion " << iter << std::endl;
                    break;
                }
                lam = ges.eigenvalues();                       // ω² ascendente
                Q = ges.eigenvectors();                        // Mbar-ortonormal
                X = Xbar * Q;                                  // nuevo subespacio (= autovectores aprox)
                // convergencia de los nmodes más bajos
                int nc = std::min(nmodes, (int)lam.size());
                double err = 0.0;
                for (int i = 0; i < nc; ++i) {
                    double d = std::abs(lam(i) - lamPrev(i));
                    err = std::max(err, d / (std::abs(lam(i)) + 1e-12));
                    lamPrev(i) = lam(i);
                }
                if (iter > 0 && err < 1e-7) break;
            }
            if (lam.size() == 0) { std::cout << "modal: la iteracion de subespacio no dio ni un autovalor" << std::endl; return; }

            // autovectores M-ortonormales: φ = X̄·Q  (φᵀMφ = QᵀMbarQ = I)
            eigenvectors = Xbar * Q;
            eigenvalues = lam;
            reducedIndices = keep;
        }
        else
        {
            // ================= camino denso (modelos chicos, ej. frame Paz 6.3) =================
            std::vector<int> zeroIndicesM = getZerosIndices(M_global);
            std::vector<int> allZeroIndices;
            allZeroIndices.insert(allZeroIndices.end(), zeroIndicesK.begin(), zeroIndicesK.end());
            allZeroIndices.insert(allZeroIndices.end(), zeroIndicesM.begin(), zeroIndicesM.end());
            std::sort(allZeroIndices.begin(), allZeroIndices.end());
            allZeroIndices.erase(std::unique(allZeroIndices.begin(), allZeroIndices.end()), allZeroIndices.end());
            for (int idx : freeIndices)
                if (!std::binary_search(allZeroIndices.begin(), allZeroIndices.end(), idx))
                    reducedIndices.push_back(idx);
            if (reducedIndices.empty()) return;
            Eigen::MatrixXd K_dense = Eigen::MatrixXd(getReducedMatrix(K_global, reducedIndices));
            Eigen::MatrixXd M_dense = Eigen::MatrixXd(getReducedMatrix(M_global, reducedIndices));
            Eigen::GeneralizedSelfAdjointEigenSolver<Eigen::MatrixXd> solver(K_dense, M_dense);
            if (solver.info() != Eigen::Success)
            {
                std::cerr << "Error: Generalized eigenvalue solver failed." << std::endl;
                return;
            }
            eigenvalues = solver.eigenvalues();
            eigenvectors = solver.eigenvectors();
        }

        int reducedSize = (int)reducedIndices.size();
        int nComputed = (int)eigenvalues.size();
        if (reducedSize == 0 || nComputed == 0)
            return;

        // --- 6. Extraer modos válidos (ω² > 0), ascendente ---
        int totalModes = nComputed;
        if (num_modes > 0 && num_modes < nComputed)
            totalModes = num_modes;

        std::vector<double> freqVec;
        std::vector<int> validModeIndices;
        for (int i = 0; i < nComputed && (int)freqVec.size() < totalModes; ++i)
        {
            double omega2 = eigenvalues(i);
            if (omega2 > 1e-10)
            {
                double freq = std::sqrt(omega2) / (2.0 * M_PI);
                freqVec.push_back(freq);
                validModeIndices.push_back(i);
            }
        }

        int numValidModes = (int)freqVec.size();
        if (numValidModes == 0)
            return;

        // --- 7. Participación de masa (con M_global sparse, en GDL completos) ---
        // Centro de masa desde la diagonal de M (GDL Ux).
        // La masa nodal se lee de M SIN REDUCIR: con diafragma, M_global ya no
        // tiene seis GDL por nudo y `coeff(i*6, i*6)` se sale de la matriz
        // (assertion en Eigen).
        const Eigen::SparseMatrix<double> &M_nod = hayDiafragma ? M_completa : M_global;
        double sum_m = 0.0, sum_mx = 0.0, sum_my = 0.0;
        for (int i = 0; i < num_nodes; ++i)
        {
            double mi = M_nod.coeff(i * 6, i * 6);
            sum_m  += mi;
            sum_mx += mi * nodes[i][0];
            sum_my += mi * nodes[i][1];
        }
        double x_cm = (sum_m > 1e-30) ? sum_mx / sum_m : 0.0;
        double y_cm = (sum_m > 1e-30) ? sum_my / sum_m : 0.0;

        // 6 vectores de influencia. Se arman SIEMPRE en GDL completos y, si hay
        // diafragma, se traducen a los reducidos quedandose con el valor de cada
        // GDL que sobrevivio: los esclavos no hacen falta porque su movimiento
        // ya lo genera T a partir del maestro.
        std::vector<Eigen::VectorXd> r_full(6, Eigen::VectorXd::Zero(dofCompleto));
        for (int i = 0; i < num_nodes; ++i)
        {
            r_full[0](i * 6 + 0) = 1.0;  // Ux
            r_full[1](i * 6 + 1) = 1.0;  // Uy
            r_full[2](i * 6 + 2) = 1.0;  // Uz
            r_full[3](i * 6 + 3) = 1.0;  // Rx
            r_full[4](i * 6 + 4) = 1.0;  // Ry
            r_full[5](i * 6 + 0) = -(nodes[i][1] - y_cm);  // Rz (torsión CM): Ux = -(y-y_cm)
            r_full[5](i * 6 + 1) = +(nodes[i][0] - x_cm);  //                  Uy = +(x-x_cm)
            r_full[5](i * 6 + 5) = 1.0;
        }
        if (hayDiafragma)
        {
            std::vector<Eigen::VectorXd> r_red(6, Eigen::VectorXd::Zero(dof));
            for (int d = 0; d < dofCompleto; ++d) {
                const int c = colDe[d];
                if (c < 0) continue;
                for (int j = 0; j < 6; ++j) r_red[j](c) = r_full[j](d);
            }
            // Los MAESTROS VIRTUALES llevan la masa de los nudos atados: su vector de
            // influencia es el del solido rigido evaluado en el centro del diafragma.
            // Sin esto la participacion salia 0/0/0 con diafragma (medido 3-sep-2026).
            for (const auto &g : colMaestro) {
                const int cm = g.second;
                const double xc = centro[g.first][0], yc = centro[g.first][1];
                r_red[0](cm + 0) = 1.0;                       // Ux
                r_red[1](cm + 1) = 1.0;                       // Uy
                r_red[5](cm + 0) = -(yc - y_cm);              // Rz: ux = -(y - y_cm)
                r_red[5](cm + 1) = +(xc - x_cm);              //     uy = +(x - x_cm)
                r_red[5](cm + 2) = 1.0;
            }
            r_full.swap(r_red);
        }

        // Masa total por dirección: M_total_j = r_jᵀ · M · r_j   (M sparse)
        //
        // El divisor tiene que ser la masa que PUEDE participar, o sea la de
        // los grados LIBRES. Con M_global entera entraba tambien la masa
        // agrupada en los apoyos, que no se mueve nunca: todas las
        // participaciones salian bajas por el mismo factor (masa libre / masa
        // total). Medido en el mezanine: 0.9663 = 26.790 / 27.724 t, o sea
        // -3.4 % en UX y UY y -6.1 % en RZ, donde el factor es mayor porque la
        // masa anclada esta en las bases de las columnas, lejos del centro.
        // El numerador (Gamma) ya estaba bien: el autovector vale 0 en los
        // apoyos, asi que solo suma grados libres.
        Eigen::VectorXd libre = Eigen::VectorXd::Zero(dof);
        for (int j = 0; j < reducedSize; ++j) libre(reducedIndices[j]) = 1.0;

        std::vector<double> M_total(6, 0.0);
        std::vector<Eigen::VectorXd> Mr(6);
        for (int j = 0; j < 6; ++j)
        {
            Eigen::VectorXd r_libre = r_full[j].cwiseProduct(libre);
            Mr[j] = M_global * r_libre;
            M_total[j] = r_libre.dot(Mr[j]);
        }

        // Por modo: mapear autovector a GDL completos, participación con M sparse
        std::vector<std::vector<double>> participation(numValidModes, std::vector<double>(6, 0.0));
        std::vector<Eigen::VectorXd> fullModes(numValidModes, Eigen::VectorXd::Zero(dof));
        for (int m = 0; m < numValidModes; ++m)
        {
            int modeIdx = validModeIndices[m];
            Eigen::VectorXd fullRaw = Eigen::VectorXd::Zero(dof);
            for (int j = 0; j < reducedSize; ++j)
                fullRaw(reducedIndices[j]) = eigenvectors(j, modeIdx);

            double M_gen = fullRaw.dot(M_global * fullRaw);   // masa generalizada (=1 si M-ortonormal)
            for (int j = 0; j < 6; ++j)
            {
                if (M_total[j] < 1e-30 || M_gen < 1e-30) continue;
                double Gamma = fullRaw.dot(Mr[j]);            // φᵀ·M·r_j
                double M_eff = (Gamma * Gamma) / M_gen;
                participation[m][j] = M_eff / M_total[j];
            }
            fullModes[m] = fullRaw;
        }

        // --- 8. Salidas ---
        *num_frequencies_out = numValidModes;
        *frequencies_ptr_out = (double *)malloc(numValidModes * sizeof(double));
        for (int i = 0; i < numValidModes; ++i)
            (*frequencies_ptr_out)[i] = freqVec[i];

        // Con diafragma, el eigen vive en las coordenadas REDUCIDAS. Las formas
        // hay que devolverlas en las completas —seis por nudo— o el visor no
        // sabe dibujarlas y el nodo a nodo contra ETABS no se puede cruzar.
        // Deshacerlo es multiplicar por la misma T que las redujo.
        const int dofSalida = hayDiafragma ? dofCompleto : dof;
        *mode_shapes_rows_out = numValidModes;
        *mode_shapes_cols_out = dofSalida;
        *mode_shapes_ptr_out = (double *)malloc(numValidModes * dofSalida * sizeof(double));
        for (int m = 0; m < numValidModes; ++m)
        {
            Eigen::VectorXd fullMode = hayDiafragma ? (T_dia * fullModes[m]).eval()
                                                    : fullModes[m];
            double maxVal = fullMode.cwiseAbs().maxCoeff();  // normalizar a máx = 1 (para el visor)
            if (maxVal > 1e-15) fullMode /= maxVal;
            for (int d = 0; d < dofSalida; ++d)
                (*mode_shapes_ptr_out)[m * dofSalida + d] = fullMode(d);
        }

        *mass_participation_rows_out = numValidModes;
        *mass_participation_cols_out = 6;
        *mass_participation_ptr_out = (double *)malloc(numValidModes * 6 * sizeof(double));
        for (int m = 0; m < numValidModes; ++m)
            for (int j = 0; j < 6; ++j)
                (*mass_participation_ptr_out)[m * 6 + j] = participation[m][j];
    }
}
