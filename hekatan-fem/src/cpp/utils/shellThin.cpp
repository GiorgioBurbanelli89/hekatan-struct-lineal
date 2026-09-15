// =============================================================================
// Shell THIN — 4-node shell element with Kirchhoff plate bending
// ETABS-equivalent: "Shell-Thin" = DKE (Discrete Kirchhoff Element, Wilson Ch10)
//
// Combines: Membrane (plane stress Q4) + Plate bending (MZC Kirchhoff)
// 6 DOFs per node: u, v, w, θx, θy, θz → 24 DOFs total
//
// Differences vs shellQ4.cpp (Mindlin/Shell-Thick):
//   - NO shear DOFs in bending formulation (Kirchhoff hypothesis)
//   - Free of shear locking for thin slabs (t/L → 0)
//   - Uses MZC (Melosh-Zienkiewicz-Cheung / ACM) plate bending element
//
// Validated: Mesa Torsión (Gabriela/Seproinca, ETABS 19.1) matchea < 1.5%
// en V/M/T para Dead, Live, SCP, UDCon1, UDCon2 (hekatan-struct-py v0.1).
//
// Limitación MZC: válido para Q4 RECTANGULAR alineado con XY locales.
// Para Q4 distorsionados o no-rectangulares, usar shellQ4.cpp (Mindlin).
//
// Ref: Reddy "Theory and Analysis of Elastic Plates and Shells" §5.4
//      Wilson "Análisis Estático y Dinámico de Estructuras" Ch.10 (DKE)
// =============================================================================

#include "../data-model.h"
#include <vector>
#include <cmath>
#include <Eigen/Dense>

template <typename K, typename V>
static V getMapValST(const std::map<K, V> &map, const K &key, const V &defaultValue)
{
    auto it = map.find(key);
    return (it != map.end()) ? it->second : defaultValue;
}

// (Aqui vivia `shapeFunctionsQ4_ST`, las funciones de forma bilineales que solo
//  usaba la membrana propia de este archivo. Al pasar la membrana a la de
//  shellQ4.cpp se quedo sin usar y se borra: dejarla es codigo muerto que
//  aparenta que este archivo sigue teniendo su propio Q4.)

// ─── Membrana: la MISMA que Shell-Thick (shellQ4.cpp) ───────────────────────
//
// Aqui habia un Q4 bilineal propio, sin modos incompatibles. Medido contra
// ETABS en una celda de 1x1 m (t=0.20, E=22e6, nu=0.20), con el bloque EN SU
// PLANO aislado (U1, U2 y el drilling R3 libres; lo de fuera del plano sujeto):
//
//            flexibilidad U1        U2
//   ETABS      1.353869e-06   9.019470e-07
//   thin       1.059679e-06   6.693545e-07   -21.7 %  -25.8 %   <- este Q4
//   thick      1.245317e-06   8.600742e-07    -8.0 %   -4.6 %   <- con Wilson
//
// Empujar el nudo libre con la arista de abajo empotrada es FLEXION EN EL PLANO
// de un panel: justo donde un Q4 bilineal se atasca (shear locking) y sale
// demasiado rigido. Los modos incompatibles de Wilson 1971 (+ la correccion de
// Taylor 1976 para que pase el patch test) lo curan, y `shellQ4.cpp` ya los
// tenia — solo que Shell-Thin no los usaba.
//
// En ETABS thin/thick cambia la FLEXION (cortante transversal), no la membrana:
// las dos formulaciones tienen que compartirla. Por eso se llama a la de
// shellQ4.cpp en vez de duplicarla — una sola copia, un solo sitio que tocar.
Eigen::MatrixXd getMembraneK(const double x[4], const double y[4],
                             double E, double nu, double t,
                             const double *mod);

// La membrana ITW 1990 (12x12: u, v y el drilling JUNTOS). Misma razon: una
// sola copia, en shellQ4.cpp.
Eigen::MatrixXd getMembraneITW(const double x[4], const double y[4],
                               double E, double nu, double t,
                               const double *mod, double gammaFac, int nGauss,
                               bool taylorBurbuja, double khg, double wAlpha,
                               bool proyDrill, int sriVol, bool k0Wilson);

#include "plateDKQ.h"

// ─── MZC Kirchhoff Plate Bending (12×12) — el corazón Shell-Thin ────────────
// DOFs por nodo: [w, θx, θy] donde θx = ∂w/∂y, θy = -∂w/∂x
// Asume Q4 rectangular alineado con XY locales.
// Validado vs ETABS Shell-Thin via hekatan-struct-py Mesa Torsión.
static Eigen::MatrixXd getBendingK_MZC(const double x[4], const double y[4],
                                        double E, double nu, double t)
{
    double xmin = x[0], xmax = x[0], ymin = y[0], ymax = y[0];
    for (int i = 1; i < 4; i++) {
        if (x[i] < xmin) xmin = x[i]; if (x[i] > xmax) xmax = x[i];
        if (y[i] < ymin) ymin = y[i]; if (y[i] > ymax) ymax = y[i];
    }
    double a = (xmax - xmin) / 2.0;
    double b = (ymax - ymin) / 2.0;

    double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Eigen::Matrix3d D;
    D << D0,      D0 * nu, 0,
         D0 * nu, D0,      0,
         0,       0,       D0 * (1 - nu) / 2.0;

    double xi_n[4]  = {-1,  1, 1, -1};
    double eta_n[4] = {-1, -1, 1,  1};

    // 3×3 Gauss (integra cubico × cubico = 6º orden exacto)
    double gp[3] = {-std::sqrt(3.0/5.0), 0.0, std::sqrt(3.0/5.0)};
    double gw[3] = {5.0/9.0, 8.0/9.0, 5.0/9.0};

    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(12, 12);

    for (int ix = 0; ix < 3; ix++) for (int iy = 0; iy < 3; iy++) {
        double xi = gp[ix], eta = gp[iy];
        double w_int = gw[ix] * gw[iy];

        Eigen::MatrixXd B = Eigen::MatrixXd::Zero(3, 12);
        for (int i = 0; i < 4; i++) {
            double xi_i = xi_n[i], eta_i = eta_n[i];
            double xi_ii = xi_i * xi, eta_ii = eta_i * eta;

            // ── H_i^1 (coeficiente para w_i) ──
            // H1 = (1/8)(1+ξ_iξ)(1+η_iη)(2 + ξ_iξ + η_iη - ξ² - η²)
            double term1 = (1 + xi_ii) * (1 + eta_ii);
            double t2_ = 2 + xi_ii + eta_ii - xi*xi - eta*eta;
            double dt1_dxi  = xi_i * (1 + eta_ii);
            double dt2_dxi  = xi_i - 2 * xi;
            double dt1_deta = eta_i * (1 + xi_ii);
            double dt2_deta = eta_i - 2 * eta;
            double d2H1_dxi2    = (1.0/8.0) * (term1 * (-2) + 2 * dt1_dxi * dt2_dxi);
            double d2H1_deta2   = (1.0/8.0) * (term1 * (-2) + 2 * dt1_deta * dt2_deta);
            double d2t1_dxideta = xi_i * eta_i;
            double d2H1_dxideta = (1.0/8.0) * (d2t1_dxideta * t2_ + dt1_dxi * dt2_deta
                                                + dt1_deta * dt2_dxi);

            // ── H_i^2 (coeficiente para θx_i) ──
            // H2 = (b/8) η_i (1+ξ_iξ)(1+η_iη)²(η_iη - 1)
            double d2H2_dxi2    = 0; // lineal en ξ
            double d2H2_deta2   = (b/8.0) * eta_i * (1 + xi_ii) * 2.0 * (3 * eta_ii + 1) * eta_i * eta_i;
            double d2H2_dxideta = (b/8.0) * xi_i * eta_i * eta_i * (1 + eta_ii) * (3 * eta_ii - 1);

            // ── H_i^3 (coeficiente para θy_i) ──
            // H3 = -(a/8) ξ_i (1+ξ_iξ)²(ξ_iξ - 1)(1+η_iη)  (simétrico a H2)
            double d2H3_dxi2    = -(a/8.0) * xi_i * (1 + eta_ii) * 2.0 * (3 * xi_ii + 1) * xi_i * xi_i;
            double d2H3_deta2   = 0;
            double d2H3_dxideta = -(a/8.0) * eta_i * xi_i * xi_i * (1 + xi_ii) * (3 * xi_ii - 1);

            int col_w  = 3*i + 0;
            int col_tx = 3*i + 1;
            int col_ty = 3*i + 2;

            // Curvaturas: κ_x = -∂²w/∂x², κ_y = -∂²w/∂y², 2κ_xy = -2∂²w/∂x∂y
            // Conversión natural → física: ∂²/∂x² = (1/a²)∂²/∂ξ², ∂²/∂y² = (1/b²)∂²/∂η², ∂²/∂x∂y = (1/ab)∂²/∂ξ∂η
            B(0, col_w)  = -d2H1_dxi2 / (a*a);
            B(1, col_w)  = -d2H1_deta2 / (b*b);
            B(2, col_w)  = -2 * d2H1_dxideta / (a*b);

            B(0, col_tx) = -d2H2_dxi2 / (a*a);
            B(1, col_tx) = -d2H2_deta2 / (b*b);
            B(2, col_tx) = -2 * d2H2_dxideta / (a*b);

            B(0, col_ty) = -d2H3_dxi2 / (a*a);
            B(1, col_ty) = -d2H3_deta2 / (b*b);
            B(2, col_ty) = -2 * d2H3_dxideta / (a*b);
        }
        double detJ = a * b;
        K += w_int * B.transpose() * D * B * detJ;
    }
    return K;
}

// ─── DKE Plate Bending (12×12) — el elemento EXACTO de ETABS/SAFE ShellThin ──
// Discrete Kirchhoff Element (Batoz & Tahar 1982 = Wilson Ch8). Funciones de forma
// Q8 Serendipity. DOFs naturales [w, bx=∂w/∂x, by=∂w/∂y], luego transformados al
// shell [w, rx, ry] vía T_bend. Portado de mesa_dke.py — VALIDADO vs ETABS (Live
// M2 −3.4%, V3 +0.2%, T +4%) Y vs el C++ aislado al 5to decimal (K[0,0]=15070.40895).
// EL T_bend ES CLAVE: sin él, los DOF quedan swapeados → −41% (bug del intento previo).
static void dNq_dxi_DKE(double x, double y, double dN[8]) {
    dN[0]=(1-y)*(2*x+y)/4; dN[1]=(1-y)*(2*x-y)/4; dN[2]=(1+y)*(2*x+y)/4; dN[3]=(1+y)*(2*x-y)/4;
    dN[4]=-x*(1-y); dN[5]=(1-y*y)/2; dN[6]=-x*(1+y); dN[7]=-(1-y*y)/2;
}
static void dNq_deta_DKE(double x, double y, double dN[8]) {
    dN[0]=(1-x)*(x+2*y)/4; dN[1]=(1+x)*(-x+2*y)/4; dN[2]=(1+x)*(x+2*y)/4; dN[3]=(1-x)*(-x+2*y)/4;
    dN[4]=-(1-x*x)/2; dN[5]=-y*(1+x); dN[6]=(1-x*x)/2; dN[7]=-y*(1-x);
}
static double Hx_sw_DKE(int j, const double dN[8], double c_a) { switch(j){
    case 1:return -c_a*dN[4]; case 2:return dN[0]-0.25*dN[4]+0.5*dN[7]; case 3:return 0; case 4:return c_a*dN[4];
    case 5:return dN[1]-0.25*dN[4]+0.5*dN[5]; case 6:return 0; case 7:return c_a*dN[6]; case 8:return dN[2]+0.5*dN[5]-0.25*dN[6];
    case 9:return 0; case 10:return -c_a*dN[6]; case 11:return dN[3]-0.25*dN[6]+0.5*dN[7]; case 12:return 0;} return 0;
}
static double Hy_sw_DKE(int j, const double dN[8], double c_b) { switch(j){
    case 1:return -c_b*dN[7]; case 2:return 0; case 3:return dN[0]+0.5*dN[4]-0.25*dN[7]; case 4:return -c_b*dN[5];
    case 5:return 0; case 6:return dN[1]+0.5*dN[4]-0.25*dN[5]; case 7:return c_b*dN[5]; case 8:return 0;
    case 9:return dN[2]-0.25*dN[5]+0.5*dN[6]; case 10:return c_b*dN[7]; case 11:return 0; case 12:return dN[3]+0.5*dN[6]-0.25*dN[7];} return 0;
}
static Eigen::MatrixXd getBendingK_DKE(const double x[4], const double y[4],
                                        double E, double nu, double t,
                                        const double *mod = nullptr)
{
    double xmin=x[0],xmax=x[0],ymin=y[0],ymax=y[0];
    for (int i=1;i<4;i++){ if(x[i]<xmin)xmin=x[i]; if(x[i]>xmax)xmax=x[i];
                           if(y[i]<ymin)ymin=y[i]; if(y[i]>ymax)ymax=y[i]; }
    double dx=xmax-xmin, dy=ymax-ymin;
    double a_h=dx/2.0, b_h=dy/2.0, c_a=1.5/dx, c_b=1.5/dy;
    double Df=E*t*t*t/(12.0*(1.0-nu*nu));
    Eigen::Matrix3d D; D<<Df,Df*nu,0, Df*nu,Df,0, 0,0,Df*(1.0-nu)/2.0;
    // Modificadores DIRECCIONALES de flexion (M11MOD M22MOD M12MOD), sobre la
    // matriz constitutiva y no sobre la K ya ensamblada — el mismo sitio y la
    // misma forma que `getBendingK` de shellQ4.cpp, para que thin y thick
    // respondan igual al mismo dato. Un deck lleva M22 chico: no rigidiza
    // cruzado al nervio, y multiplicar la K entera por un escalar no sabe
    // hacer eso. El acoplamiento va con la media geometrica para que D siga
    // simetrica y semidefinida positiva.
    //
    // V13MOD/V23MOD (mod[6], mod[7]) NO se aplican aqui a proposito: son los
    // modificadores del CORTANTE TRANSVERSAL, y el DKE es Kirchhoff — no tiene
    // deformacion por cortante que modificar. En ETABS pasa lo mismo: a un
    // Shell-Thin esos dos no le hacen nada.
    if (mod) {
        double m11 = mod[3], m22 = mod[4], m12 = mod[5];
        D(0, 0) *= m11;
        D(1, 1) *= m22;
        D(2, 2) *= m12;
        double c = std::sqrt(std::max(0.0, m11 * m22));
        D(0, 1) *= c;  D(1, 0) *= c;
    }
    double g=1.0/std::sqrt(3.0); double gp[2]={-g,g};
    Eigen::MatrixXd K=Eigen::MatrixXd::Zero(12,12);
    for (int ig=0;ig<2;ig++) for (int jg=0;jg<2;jg++) {
        double xi=gp[ig], eta=gp[jg]; double dNx[8],dNe[8];
        dNq_dxi_DKE(xi,eta,dNx); dNq_deta_DKE(xi,eta,dNe);
        Eigen::MatrixXd B=Eigen::MatrixXd::Zero(3,12);
        for (int k=1;k<=12;k++){
            B(0,k-1)=Hx_sw_DKE(k,dNx,c_a)/a_h;
            B(1,k-1)=Hy_sw_DKE(k,dNe,c_b)/b_h;
            B(2,k-1)=Hx_sw_DKE(k,dNe,c_a)/b_h + Hy_sw_DKE(k,dNx,c_b)/a_h;
        }
        K += (B.transpose()*D*B)*a_h*b_h;   // pesos Gauss = 1
    }
    // T_bend: mapear DKE natural [w,bx,by] → shell [w,rx,ry].
    // SIGNO INVERTIDO vs el .m: Hekatan define la convención de rotación con el MZC
    // (θx=∂w/∂y, θy=-∂w/∂x); el T_bend del .m da el signo OPUESTO → acople w-rot invertido
    // → −41% en mesa-torsión. Verificado numéricamente: este T_bend matchea los signos del MZC.
    Eigen::MatrixXd Tf=Eigen::MatrixXd::Zero(12,12);
    Eigen::Matrix3d Tb; Tb<<1,0,0, 0,0,-1, 0,1,0;
    for (int n=0;n<4;n++) Tf.block<3,3>(3*n,3*n)=Tb;
    return Tf.transpose()*K*Tf;
}

// ─── Public API: 24×24 K matrix para Shell-Thin element ────────────────────
// Ensamble: Membrane (Ux, Uy) + MZC Bending (Uz, Rx, Ry) + drilling penalty (Rz)
Eigen::MatrixXd getLocalStiffnessMatrixShellThin(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    // Material y geometría
    double E = getMapValST(elementInputs.elasticities, index, 0.0);
    double nu = getMapValST(elementInputs.poissonsRatios, index, 0.2);
    double t = getMapValST(elementInputs.thicknesses, index, 0.0);
    if (E <= 0 || t <= 0) return Eigen::MatrixXd::Zero(24, 24);

    // Proyectar coords 3D al sistema local del shell
    Eigen::Vector3d p0(nodes[0][0], nodes[0][1], nodes[0][2]);
    Eigen::Vector3d p1(nodes[1][0], nodes[1][1], nodes[1][2]);
    Eigen::Vector3d p2(nodes[2][0], nodes[2][1], nodes[2][2]);
    Eigen::Vector3d p3(nodes[3][0], nodes[3][1], nodes[3][2]);
    Eigen::Vector3d v01 = p1 - p0, v32 = p2 - p3;
    Eigen::Vector3d localX = (v01 + v32);
    double lenX = localX.norm();
    if (lenX < 1e-12) return Eigen::MatrixXd::Zero(24, 24);
    localX /= lenX;
    Eigen::Vector3d d02 = p2 - p0, d13 = p3 - p1;
    Eigen::Vector3d localZ = d02.cross(d13);
    double lenZ = localZ.norm();
    if (lenZ < 1e-12) return Eigen::MatrixXd::Zero(24, 24);
    localZ /= lenZ;
    Eigen::Vector3d localY = localZ.cross(localX);
    localY.normalize();
    localX = localY.cross(localZ); localX.normalize();
    Eigen::Vector3d center = 0.25 * (p0 + p1 + p2 + p3);

    double x[4], y[4];
    Eigen::Vector3d pts[4] = {p0, p1, p2, p3};
    for (int i = 0; i < 4; i++) {
        Eigen::Vector3d d = pts[i] - center;
        x[i] = d.dot(localX);
        y[i] = d.dot(localY);
    }

    // ETABS Property Modifiers
    double mFactor = getMapValST(elementInputs.membraneModifiers, index, 1.0);
    double bFactor = getMapValST(elementInputs.bendingModifiers, index, 1.0);
    // Modificadores DIRECCIONALES (los 8 de ETABS). Shell-Thick ya los aplicaba
    // y Shell-Thin los ignoraba por completo, asi que un deck definido por
    // direccion se comportaba como una losa isotropa.
    //
    // Se aplican dentro de la matriz constitutiva, como ETABS: a la membrana en
    // `getMembraneK` y a la flexion en `getBendingK_DKE`. Los dos escalares
    // pasan a 1.0 para no multiplicar dos veces.
    const double *dmod = nullptr;
    {
        auto itMod = elementInputs.shellModifiers.find(index);
        if (itMod != elementInputs.shellModifiers.end() && itMod->second.size() >= 8) {
            dmod = itMod->second.data();
            mFactor = 1.0;
            bFactor = 1.0;
        }
    }

    // .Flexion practicamente nula (un deck: ShellType Membrane) → NO se
    // ensambla, en vez de armarla y multiplicarla por cero. Lo mismo que hace
    // shellQ4.cpp; aqui el DKE con D=0 ya daria la matriz nula, pero el criterio
    // se escribe una sola vez y se lee igual en los dos archivos.
    bool sinFlexion = dmod
        ? (std::fabs(dmod[3]) < 1e-9 && std::fabs(dmod[4]) < 1e-9 &&
           std::fabs(dmod[5]) < 1e-9)
        : (std::fabs(bFactor) < 1e-9);

    // Mismo dispatcher que shellQ4.cpp: con ITW (3 o 4) la membrana y el
    // drilling salen de la MISMA 12x12 y no hay penalizacion que pegar aparte.
    // ── El DEFECTO: tipo 8, la proyeccion del drilling ───────────────────
    // Cambiado de 3 a 8 el 19-ago-2026, y no por gusto: el 8 gana o EMPATA al 3
    // en todas las columnas medidas. Es la primera opcion que no obliga a
    // elegir.
    //
    //   medida                        tipo 3      tipo 8
    //   matriz 12x12 de ETABS         15.97 %      1.42 %
    //   drilling-dof contra ETABS     +5.45 %     +3.09 %
    //   mezanine, axil (medio/max)   0.62/3.47   0.30/1.15
    //   hemisferio 8x8               -34.07 %    -33.26 %
    //   patch test                    EXACTO      EXACTO
    //   modos de energia nula            3           3
    //
    // Y sobre todo: el termino que anade ETABS se AISLO de su matriz medida
    // (restarle la nuestra sin penalizacion y mirar el autovector dominante).
    // Sale `theta_nodal - theta_solido_rigido` —el rango uno de Wilson, ecs.
    // (9.11)-(9.13)— con `k0 = 0.4*G` EXACTO en 9 de 10 geometrias y alineacion
    // 1.0000 contra nuestro residuo: no es parecido, es el MISMO vector.
    //
    // Para cascara doblemente curva sigue siendo mejor el 9 (hemisferio 8x8 a
    // -0.50 %); se pide por `elementInputs.drillingTypes`.
    int drillingType = getMapValST(elementInputs.drillingTypes, index, 8);
    double drillScale = getMapValST(elementInputs.drillingPenaltyScales, index,
                                    (drillingType >= 3 && drillingType <= 10) ? 0.4 : 0.05);
    const bool usaITW = (drillingType >= 3 && drillingType <= 10);
    const int  ngITW  = (drillingType == 4 || drillingType == 6) ? 2 : 3;
    const double khgITW = (drillingType == 6) ? 2.0e-4 : 0.0;
    const bool taylorITW = (drillingType == 5);
    //  7 = ITW **1991**: la regla de OCHO puntos de su ec. (30). Es el paper
    //      que cita el manual de CSI (el 1990 no). `wAlpha > 0` la activa y
    //      manda sobre `ngITW`. Medido en Python contra el hemisferio de
    //      MacNeal & Harder (0.094), que es EL test de bloqueo de membrana:
    //
    //          malla     ITW 1990 (3x3)    ITW 1991 (8 puntos)
    //           8x8        -34.07 %             -4.07 %
    //          12x12       -10.10 %             -0.85 %
    //
    //      y sin perder nada: 3 modos de energia nula y patch test EXACTO en
    //      las dos. Es lo que el 2x2 prometia sin poder cumplir — el 2x2 baja
    //      el hemisferio pero deja el elemento con CUATRO modos nulos.
    //
    //      EL CUADRO ENTERO, medido el 19-ago-2026 con el WASM recompilado:
    //
    //        tipo  patch   hemi 8x8   drilling vs ETABS   mezanine P (med/max)
    //          2   -6.34%    -3.6%         +11.46%             0.30/1.15
    //          3   EXACTO   -34.07%         +5.45%             0.62/3.47   <- DEFECTO
    //          6   EXACTO    -5.2%          +7.14%             1.07/12.46
    //          7   EXACTO    -4.07%         +6.46%             0.86/8.27
    //
    //      El 7 DOMINA al 6 en las tres columnas, asi que sustituye al 6 como
    //      la opcion para cascara curva. Pero NO domina al 3: gana mucho en el
    //      hemisferio (-34 % a -4 %) y pierde en el axil de las barras del
    //      mezanine (3.47 % a 8.27 %) y un punto en el drilling. Los otros
    //      cinco campos del mezanine (V2, V3, T, M2, M3) no se mueven.
    //
    //      Por eso el defecto sigue siendo el 3: el compromiso no ha
    //      desaparecido, solo ha mejorado el otro lado de la balanza. Cascara
    //      curva -> 7. Losa con vigas -> 3.
    const double waITW = (drillingType == 7 || drillingType == 9) ? 0.99 : 0.0;
    //  8 = FEAP/Taylor: Gauss 3x3 + proyeccion del drilling (ver shellQ4.cpp).
    const bool proyITW = (drillingType == 8 || drillingType == 9 || drillingType == 10);
    // 10 = proyeccion + INTEGRACION SELECTIVA del volumetrico a 2x2.
    //      Baja la matriz de ETABS de 1.42 % a 0.878 % sin tocar el patch
    //      test (1.500000/0.600000) ni los 3 modos nulos.
    const int sriITW = (drillingType == 10) ? 2 : 0;

    Eigen::MatrixXd Km   = usaITW ? Eigen::MatrixXd::Zero(8, 8)
                                  : getMembraneK(x, y, E, nu, t, dmod);   // 8×8
    Eigen::MatrixXd Kitw = usaITW ? getMembraneITW(x, y, E, nu, t, dmod, drillScale, ngITW, taylorITW, khgITW, waITW, proyITW, sriITW, false)
                                  : Eigen::MatrixXd::Zero(12, 12);        // 12×12
    Kitw *= mFactor;
    Eigen::MatrixXd Kb = sinFlexion
        ? Eigen::MatrixXd::Zero(12, 12)
        : getBendingK_DKQ_mod(x, y, E, nu, t, dmod);  // 12×12 DKQ con jacobiano real
    Km *= mFactor;
    Kb *= bFactor;

    // Ensamblar en 24×24 (orden DOFs: [u, v, w, θx, θy, θz] por nodo)
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(24, 24);
    const int gdlM[3] = {0, 1, 5};      // u, v, theta_z dentro del nudo
    for (int ni = 0; ni < 4; ni++) for (int nj = 0; nj < 4; nj++) {
        // Membrane: u=6i+0, v=6i+1  (con ITW van tambien los theta_z)
        if (usaITW) {
            for (int di = 0; di < 3; di++) for (int dj = 0; dj < 3; dj++)
                K(ni*6 + gdlM[di], nj*6 + gdlM[dj]) = Kitw(ni*3 + di, nj*3 + dj);
        } else {
        for (int di = 0; di < 2; di++) for (int dj = 0; dj < 2; dj++) {
            K(ni*6 + di, nj*6 + dj) = Km(ni*2 + di, nj*2 + dj);
        }
        }
        // Bending: w=6i+2, θx=6i+3, θy=6i+4
        for (int di = 0; di < 3; di++) for (int dj = 0; dj < 3; dj++) {
            K(ni*6 + 2 + di, nj*6 + 2 + dj) = Kb(ni*3 + di, nj*3 + dj);
        }
    }

    // ── Drilling DOF (θz=6i+5) — dispatcher según drillingTypes ────────────
    //   0 = penalty 1e-6 legacy
    //   1 = PyNite weak (min(diagRot)/1000)
    //   2 = Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990  [DEFAULT]
    // (drillingType y drillScale ya se leyeron arriba)
    // 0.05, el MISMO defecto que shellQ4.cpp (ver el comentario largo de alli).
    // Cuando solo se bajo en shellQ4, el caso `membrana-thin-thick` lo canto en
    // el acto: Shell-Thin daba 5.3728 mm y Shell-Thick 5.9139 en el MISMO muro
    // cargado en su plano, cuando en ETABS thin/thick solo cambia la FLEXION y
    // la membrana es identica. Dos ficheros con la misma constante escrita a
    // mano en cada uno: si se toca, se tocan los dos.
    if (usaITW) {
        // ya esta dentro de Kitw
    } else if (drillingType == 2) {
        K += mFactor * getDrillingK_HughesBrezzi(x, y, E, nu, t, drillScale);
    } else if (drillingType == 1) {
        double minRot = 1e18;
        for (int ni = 0; ni < 4; ni++) {
            double dx = std::abs(K(ni*6 + 3, ni*6 + 3));
            double dy = std::abs(K(ni*6 + 4, ni*6 + 4));
            if (dx > 1e-15 && dx < minRot) minRot = dx;
            if (dy > 1e-15 && dy < minRot) minRot = dy;
        }
        double drill = (minRot < 1e17) ? minRot * 1e-3 : E * t * 1e-6 * std::max(mFactor, 1e-6);
        for (int i = 0; i < 4; i++) K(i*6 + 5, i*6 + 5) = drill;
    } else {
        double drill = 0;
        for (int i = 0; i < 8; i++) drill += std::abs(Km(i, i));
        drill *= 1e-6 / 8.0;
        if (drill < 1e-15) drill = E * t * 1e-6 * std::max(mFactor, 1e-6);
        for (int i = 0; i < 4; i++) K(i*6 + 5, i*6 + 5) = drill;
    }

    return K;
}
