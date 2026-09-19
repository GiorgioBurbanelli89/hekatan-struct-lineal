// =============================================================================
// Shell Q4 — 4-node shell element for shear walls
// Combines: Membrane (plane stress Q4) + Plate bending (Mindlin-Reissner)
// 6 DOFs per node: u, v, w, θx, θy, θz → 24 DOFs total
//
// Membrane: Standard isoparametric Q4, 2×2 Gauss quadrature
// Bending:  Mindlin-Reissner with selective reduced integration
//           2×2 for bending, 1×1 for shear (avoids shear locking)
// Drilling: Small artificial stiffness for θz (stabilization)
// =============================================================================

#include "../data-model.h"
#include <vector>
#include <cmath>
#include <algorithm>
#include <Eigen/Dense>
#include <iostream>

// Local copy of template helper (templates can't link across TUs)
template <typename K, typename V>
static V getMapVal(const std::map<K, V> &map, const K &key, const V &defaultValue)
{
    auto it = map.find(key);
    return (it != map.end()) ? it->second : defaultValue;
}

// ─── Shape functions for bilinear Q4 ────────────────────────────────────────
// Node ordering: 0(-1,-1), 1(+1,-1), 2(+1,+1), 3(-1,+1) → CCW
static void shapeFunctionsQ4(double xi, double eta,
                              double N[4], double dNdxi[4], double dNdeta[4])
{
    N[0] = 0.25 * (1 - xi) * (1 - eta);
    N[1] = 0.25 * (1 + xi) * (1 - eta);
    N[2] = 0.25 * (1 + xi) * (1 + eta);
    N[3] = 0.25 * (1 - xi) * (1 + eta);

    dNdxi[0] = -0.25 * (1 - eta);
    dNdxi[1] =  0.25 * (1 - eta);
    dNdxi[2] =  0.25 * (1 + eta);
    dNdxi[3] = -0.25 * (1 + eta);

    dNdeta[0] = -0.25 * (1 - xi);
    dNdeta[1] = -0.25 * (1 + xi);
    dNdeta[2] =  0.25 * (1 + xi);
    dNdeta[3] =  0.25 * (1 - xi);
}

// ─── Jacobian at a Gauss point ──────────────────────────────────────────────
static double jacobian2D(const double x[4], const double y[4],
                          const double dNdxi[4], const double dNdeta[4],
                          double Jinv[2][2])
{
    double J00 = 0, J01 = 0, J10 = 0, J11 = 0;
    for (int i = 0; i < 4; i++) {
        J00 += dNdxi[i]  * x[i];
        J01 += dNdxi[i]  * y[i];
        J10 += dNdeta[i] * x[i];
        J11 += dNdeta[i] * y[i];
    }
    double detJ = J00 * J11 - J01 * J10;
    if (std::abs(detJ) < 1e-15) detJ = 1e-15;
    double inv = 1.0 / detJ;
    Jinv[0][0] =  J11 * inv;
    Jinv[0][1] = -J01 * inv;
    Jinv[1][0] = -J10 * inv;
    Jinv[1][1] =  J00 * inv;
    return detJ;
}

// Jacobiano DIRECTO J = [[dx/dxi, dy/dxi], [dx/deta, dy/deta]].
// Hace falta para el MITC4 de verdad: el cortante se interpola en las
// componentes COVARIANTES (gamma_xi, gamma_eta), y para pasar del cartesiano
// al covariante se multiplica por J, no por su inversa.
static double jacobianDirect2D(const double x[4], const double y[4],
                               const double dNdxi[4], const double dNdeta[4],
                               double J[2][2])
{
    J[0][0] = J[0][1] = J[1][0] = J[1][1] = 0.0;
    for (int i = 0; i < 4; i++) {
        J[0][0] += dNdxi[i]  * x[i];
        J[0][1] += dNdxi[i]  * y[i];
        J[1][0] += dNdeta[i] * x[i];
        J[1][1] += dNdeta[i] * y[i];
    }
    return J[0][0] * J[1][1] - J[0][1] * J[1][0];
}

// ─── 2×2 Gauss points ──────────────────────────────────────────────────────
static const double GP2  =  0.5773502691896258; // 1/sqrt(3)
static const double gp2x2[4][2] = {
    {-GP2, -GP2}, {GP2, -GP2}, {GP2, GP2}, {-GP2, GP2}
};

// ─── Membrane stiffness (plane stress Q4) — Wilson 1971 INCOMPATIBLE MODES
//     + Taylor 1976 patch-test correction (J0 evaluado en centro): 8×8
//
// Funciones de forma extendidas (Wilson 1971, Cook-Malkus-Plesha §6.5):
//   u_x(ξ,η) = Σ N_i(ξ,η)·u_xi + α₁·(1−ξ²) + α₂·(1−η²)
//   u_y(ξ,η) = Σ N_i(ξ,η)·u_yi + α₃·(1−ξ²) + α₄·(1−η²)
//
// Los 4 DOFs internos α_j cancelan el shear locking parásito del Q4 estándar
// (errores en flexión pura). Se condensan estáticamente ⇒ sale K 8×8.
//
// Taylor 1976 patch test: para que el elemento pase el patch test en mallas
// distorsionadas, las derivadas de N₅, N₆ se evalúan con el Jacobiano J0
// constante medido en el centro del elemento (ξ=η=0), no con J(ξ,η).
// Esto fuerza ∫B_I dV = 0 → patch test pasa.
//
// Refs:
//   - Wilson, Taylor, Doherty, Ghaboussi (1973), "Incompatible Displacement Models"
//   - Taylor, Beresford, Wilson (1976), "A non-conforming element for stress analysis"
//   - Cook, Malkus, Plesha, Witt (2002), §6.6
//   - CSI Analysis Reference Manual §10.1.1 (formulación del shell de ETABS)
// ───────────────────────────────────────────────────────────────────────────
// NO es `static` a proposito: shellThin.cpp la usa tambien. Tenia su propio Q4
// bilineal sin modos incompatibles, y contra ETABS salia 22-26 % mas rigido en
// su plano (medido en una celda de 1x1 m). Con esta, la MISMA membrana para
// Shell-Thin y Shell-Thick, que es lo que hace ETABS: thin/thick solo cambia la
// FLEXION (cortante transversal), la membrana es la misma.
Eigen::MatrixXd getMembraneK(const double x[4], const double y[4],
                             double E, double nu, double t,
                             const double *mod)
{
    double factor = E / (1.0 - nu * nu);
    Eigen::Matrix3d Dm;
    Dm << factor,       factor * nu, 0,
          factor * nu,  factor,      0,
          0,            0,           factor * (1 - nu) / 2.0;
    // Modificadores DIRECCIONALES sobre la matriz constitutiva, que es donde
    // los aplica ETABS — no sobre la K ya ensamblada. Multiplicar la K entera
    // es todo-o-nada; aqui se puede dejar rigido en 11 y blando en 22, que es
    // exactamente lo que hace a un deck comportarse como deck.
    // El termino de acoplamiento va con la media geometrica para que la
    // matriz siga siendo simetrica y semidefinida positiva.
    if (mod) {
        double f11 = mod[0], f22 = mod[1], f12 = mod[2];
        Dm(0, 0) *= f11;
        Dm(1, 1) *= f22;
        Dm(2, 2) *= f12;
        double c = std::sqrt(std::max(0.0, f11 * f22));
        Dm(0, 1) *= c;  Dm(1, 0) *= c;
    }

    // ── J0: Jacobiano en el centro (ξ=η=0) — Taylor 1976 correction ──
    double Jinv0[2][2];
    {
        double N0[4], dN0dxi[4], dN0deta[4];
        shapeFunctionsQ4(0.0, 0.0, N0, dN0dxi, dN0deta);
        jacobian2D(x, y, dN0dxi, dN0deta, Jinv0);
    }

    // K_uu (8×8): rigidez compatible
    // K_uα (8×4): acoplamiento compatible-incompatible
    // K_αα (4×4): rigidez incompatible
    Eigen::MatrixXd Kuu = Eigen::MatrixXd::Zero(8, 8);
    Eigen::MatrixXd Kua = Eigen::MatrixXd::Zero(8, 4);
    Eigen::MatrixXd Kaa = Eigen::MatrixXd::Zero(4, 4);

    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N[4], dNdxi[4], dNdeta[4];
        shapeFunctionsQ4(xi, eta, N, dNdxi, dNdeta);

        double Jinv[2][2];
        double detJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        // ── B_C (3×8): standard compatible part ──
        Eigen::MatrixXd Bc = Eigen::MatrixXd::Zero(3, 8);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            Bc(0, 2*i)     = dNdx;
            Bc(1, 2*i + 1) = dNdy;
            Bc(2, 2*i)     = dNdy;
            Bc(2, 2*i + 1) = dNdx;
        }

        // ── B_I (3×4): incompatible modes part ──
        // N₅ = 1−ξ², N₆ = 1−η² → derivadas naturales:
        //   ∂N₅/∂ξ = -2ξ,  ∂N₅/∂η =  0
        //   ∂N₆/∂ξ =  0,   ∂N₆/∂η = -2η
        // Taylor 1976: usar Jinv0 (centro) para mapear a ∂/∂x, ∂/∂y → patch test OK.
        double dN5dxi  = -2.0 * xi,  dN5deta = 0.0;
        double dN6dxi  =  0.0,       dN6deta = -2.0 * eta;
        double dN5dx = Jinv0[0][0] * dN5dxi + Jinv0[0][1] * dN5deta;
        double dN5dy = Jinv0[1][0] * dN5dxi + Jinv0[1][1] * dN5deta;
        double dN6dx = Jinv0[0][0] * dN6dxi + Jinv0[0][1] * dN6deta;
        double dN6dy = Jinv0[1][0] * dN6dxi + Jinv0[1][1] * dN6deta;

        // α-DOFs ordering: [α1 (u·N5), α2 (u·N6), α3 (v·N5), α4 (v·N6)]
        Eigen::MatrixXd Bi = Eigen::MatrixXd::Zero(3, 4);
        Bi(0, 0) = dN5dx;   // εxx contribuye α1 via ∂(α1·N5)/∂x
        Bi(0, 1) = dN6dx;   // εxx contribuye α2 via ∂(α2·N6)/∂x
        Bi(1, 2) = dN5dy;   // εyy contribuye α3 via ∂(α3·N5)/∂y
        Bi(1, 3) = dN6dy;   // εyy contribuye α4 via ∂(α4·N6)/∂y
        Bi(2, 0) = dN5dy;   // γxy = ∂u/∂y + ∂v/∂x  → α1·∂N5/∂y
        Bi(2, 1) = dN6dy;   //                       → α2·∂N6/∂y
        Bi(2, 2) = dN5dx;   //                       → α3·∂N5/∂x
        Bi(2, 3) = dN6dx;   //                       → α4·∂N6/∂x

        double w = t * std::abs(detJ);
        Kuu += Bc.transpose() * Dm * Bc * w;
        Kua += Bc.transpose() * Dm * Bi * w;
        Kaa += Bi.transpose() * Dm * Bi * w;
    }

    // ── Static condensation: K_cond = K_uu - K_uα · K_αα⁻¹ · K_αu ──
    // Como α-DOFs son internos, K_αα siempre debería ser invertible (rank 4).
    Eigen::MatrixXd KaaInv;
    if (std::abs(Kaa.determinant()) > 1e-20) {
        KaaInv = Kaa.inverse();
    } else {
        // Fallback: Q4 estándar sin modos incompatibles si Kaa es singular
        // (no debería pasar para Q4 razonablemente formado).
        std::cerr << "Warning: Kaa singular en getMembraneK, fallback a Q4 estandar." << std::endl;
        return Kuu;
    }
    Eigen::MatrixXd Km = Kuu - Kua * KaaInv * Kua.transpose();

    return Km;
}

// ─── Membrana ITW 1990: Ibrahimbegovic, Taylor & Wilson ────────────────────
//     "A robust quadrilateral membrane finite element with drilling degrees of
//      freedom", Int. J. Numer. Methods Eng. 30, 445-457 (1990).
//
// Devuelve 12x12 con los GDL [u0,v0,tz0, u1,v1,tz1, u2,v2,tz2, u3,v3,tz3]:
// membrana Y drilling JUNTOS, no la membrana por un lado y una penalizacion
// pegada por el otro. Esa es la diferencia de fondo con lo que habia.
//
// Por que se cambio: el paper trae un PATCH TEST DE ORDEN SUPERIOR (Tabla I)
// — viga a flexion pura, 6 elementos, malla regular — cuya respuesta es
// EXACTA, no aproximada: flecha 1.5 y giro 0.6. Medido el 19-ago-2026 con la
// misma malla nudo a nudo:
//
//     ETABS 22    -1.500000   -0.600000     exacto
//     SAP2000 24  -1.500000   -0.600000     exacto
//     Hekatan     -1.474538   -0.561967     -1.70 % y -6.34 %
//
// Que el error del GIRO fuera casi cuatro veces el de la flecha es la firma de
// que lo mal formulado era el drilling. Y refinando no se arreglaba (nx=12
// seguia en -1.4935 / -0.5830): no converge al exacto, o sea que no era malla.
//
// La formulacion (numeros de ecuacion del paper):
//   (19) u = SUM N_I u_I + SUM NS_I (l_JK/8)(psi_K - psi_J) n_JK + NB9 du9
//        interpolacion tipo Allman + UNA burbuja jerarquica por direccion,
//        NB9 = (1-r^2)(1-s^2), que se condensa estaticamente.
//   (28) G_I = la parte de B que multiplica al giro.
//   (31) b_I = <-1/2 N_I,y ; 1/2 N_I,x>     residuo skew(grad u) - psi
//   (32) g_I = (los terminos de lado)/16 - N_I
//   (33) K = INT [B G]^T C [B G] dOmega     con Gauss 3x3
//   (38) P = gamma INT {b;g}<b;g> dOmega    con UN SOLO PUNTO (el centro)
//   (39) [K + P] a = f                      <- la D-type, que es la que se usa
//
// Integrar K completo (3x3) y sumarle P de un punto quita los modos de energia
// nula sin necesitar ningun control de reloj de arena.
//
// gamma: el paper usa gamma = mu (modulo de cortante) y avisa de que la
// formulacion es INSENSIBLE a ese valor en varios ordenes de magnitud (su
// Tabla V: de gamma/mu = 0.001 a 1000 cambia la QUINTA cifra). Aqui el defecto
// es 0.4*mu porque eso es lo que se MIDIO de ETABS: reconstruida su matriz de
// membrana 12x12 entera por flexibilidad (galpon-bodega-electoral/
// celda_membrana12.py) y ajustando gamma por minimos cuadrados sale 0.400
// EXACTO, en las 10 geometrias y con 0, 2 o 4 modos incompatibles.
// NO es `static`: shellThin.cpp la usa tambien. La membrana TIENE que ser
// la misma en Shell-Thin y Shell-Thick — en ETABS thin/thick solo cambia la
// flexion. El caso `membrana-thin-thick` de la suite lo vigila.
Eigen::MatrixXd getMembraneITW(const double x[4], const double y[4],
                                      double E, double nu, double t,
                                      const double *mod, double gammaFac,
                                      int nGauss, bool taylorBurbuja,
                                      double khg, double wAlpha, bool proyDrill, int sriVol,
                                      bool k0Wilson)
{
    double factor = E / (1.0 - nu * nu);
    Eigen::Matrix3d Dm;
    Dm << factor,       factor * nu, 0,
          factor * nu,  factor,      0,
          0,            0,           factor * (1 - nu) / 2.0;
    if (mod) {
        double f11 = mod[0], f22 = mod[1], f12 = mod[2];
        Dm(0, 0) *= f11;
        Dm(1, 1) *= f22;
        Dm(2, 2) *= f12;
        double c = std::sqrt(std::max(0.0, f11 * f22));
        Dm(0, 1) *= c;  Dm(1, 0) *= c;
    }
    Dm *= t;                       // el espesor va DENTRO de D, como en el .cpd

    // ── INTEGRACION SELECTIVA del termino volumetrico (`sriVol` > 0) ──────
    // La constitutiva de tension plana se parte en dos trozos con significado
    // fisico distinto:
    //
    //     D = lambda* A  +  2 mu B        lambda* = E nu/(1-nu^2),  2mu = E/(1+nu)
    //         volumetrico   desviador
    //
    // El desviador resiste el cambio de FORMA; el volumetrico, el cambio de
    // AREA. El que ata el elemento es el volumetrico, y ata mas cuanto mayor es
    // nu: vale el 0 % del desviador con nu = 0, el 25 % con nu = 0.2 y el 82 %
    // con nu = 0.45. Integrandolo con MENOS puntos se relaja justo donde
    // sobra-rigidiza, y el desviador se queda exacto.
    //
    // Medido contra la matriz 12x12 de ETABS (10 geometrias):
    //
    //     completa   1.417 %      volumetrico a 2x2   0.878 %
    //     nu = 0.45  2.081 %                          0.639 %
    //     nu = 0     1.065 %                          1.065 %  <- NO cambia
    //
    // Que el caso nu = 0 no se mueva es la comprobacion de que la separacion
    // esta bien hecha: sin nu no hay termino volumetrico que reducir. Y el
    // patch test sigue EXACTO (1.500000 / 0.600000) con 3 modos nulos.
    //
    // Ojo: a UN punto es mucho peor (22.9 % contra ETABS, +23.7 % en el
    // cantilever). El optimo es 2x2, no menos.
    Eigen::Matrix3d Ddev = Eigen::Matrix3d::Zero(), Dvol = Eigen::Matrix3d::Zero();
    if (sriVol > 0) {
        double f2 = E / (1.0 + nu);
        Ddev << f2, 0, 0,
                0, f2, 0,
                0,  0, f2 / 2.0;
        if (mod) {                       // los modificadores van a las DOS partes
            Ddev(0, 0) *= mod[0];
            Ddev(1, 1) *= mod[1];
            Ddev(2, 2) *= mod[2];
        }
        Ddev *= t;
        Dvol = Dm - Ddev;                // el cortante queda ENTERO en el desviador
    }

    // Coeficientes de lado de Allman: (l_JK/8)*n_JK con n = (dy, -dx)/l
    //   => (l/8)*n1 = dy/8 ,  (l/8)*n2 = -dx/8
    const int sig[4] = {1, 2, 3, 0};      // lado I -> I+1
    const int ant[4] = {3, 0, 1, 2};      // lado anterior (I-1 -> I)
    double cx[4], cy[4];
    for (int i = 0; i < 4; i++) {
        cx[i] =  (y[sig[i]] - y[i]) / 8.0;
        cy[i] = -(x[sig[i]] - x[i]) / 8.0;
    }

    // El paper integra K con Gauss 3x3 (seccion 4). Pero para la CASCARA avisa
    // de que hay que evitar el bloqueo de membrana, y el .cpd del hemisferio lo
    // resuelve con la membrana ITW a 2x2 (integracion reducida). Medido: en el
    // hemisferio pinzado el 3x3 se queda en -37 % pase lo que pase con gamma
    // (o sea que NO es la penalizacion, es la parte constitutiva), y el 2x2 lo
    // suelta. Por eso el numero de puntos es un parametro y no una constante.
    static const double g3[3] = {-0.7745966692414834, 0.0, 0.7745966692414834};
    static const double w3[3] = { 5.0 / 9.0, 8.0 / 9.0, 5.0 / 9.0 };
    static const double g2[2] = {-GP2, GP2};
    static const double w2[2] = { 1.0, 1.0 };
    const double *gg = (nGauss == 2) ? g2 : g3;
    const double *wg = (nGauss == 2) ? w2 : w3;

    // ── La cuadratura, como una lista de (r, s, w) ────────────────────────
    // Con `wAlpha > 0` se usa la regla de OCHO PUNTOS, ec. (30).
    //
    // ⚠️ DE DONDE SALE ESTA REGLA: SIN IDENTIFICAR (revisado el 31-ago-2026).
    //
    // Aqui ponia «del ITW **1991**, ec. (30) — el paper que cita el manual de
    // CSI». Eso NO se sostiene: el paper que cita CSI es el CANM **7**:1-9, y
    // **llega solo a la ec. (28)** (comprobado sobre el texto extraido en
    // `registros/itw_1991/`; son nueve paginas, no da para una (30)).
    //
    // Lo que SI esta verificado:
    //   · el ITW **1990** (IJNME 30:445-457) menciona «the 8-point integration
    //     rule on K' is used», pero en su seccion 4 (NUMERICAL EVALUATION), como
    //     nota de COMO corrieron el hemisferio — no le da numero de ecuacion, y
    //     ahi mismo remite a una modificacion de Taylor [19].
    //   · asi que estas formulas
    //         W_a + W_b = 1;  alpha = 1/(9 W_a)^(1/4);
    //         beta = ((2/3 - 2 W_a alpha^2)/W_b)^(1/2)
    //     no estan localizadas en ninguno de los dos papeles que tenemos.
    //
    // RESUELTO el 31-ago-2026 con el IJNME **31**:1393-1414 ya en la mano
    // (`registros/papers_shell_csi/itw1991_thick_IJNME31`). Su §3.1 dice:
    //
    //   «The parts of the element stiffness matrix K^e and H^e in (50) and (55)
    //    are computed using a **14-point quadrature, given by Irons**. The
    //    matrix P^e in (55) is integrated by **2x2x2** Gaussian quadrature...
    //    six parameters for skew Q are used in the mixed-type formulation
    //    versus **8-point integration rule on the penalty term** in
    //    displacement-type formulation.»
    //
    // O sea: esa regla de 8 puntos es la de la PENALIZACION DE UN SOLIDO, no la
    // del shell; y la cuadratura de 14 puntos es de Irons, «Quadrature rules for
    // **BRICK** based finite elements», IJNME 3, 293-294 (1971) — hexaedros.
    //
    // Y encaja con lo que ya se vio en el binario en agosto: la funcion de
    // `CsiGo2.dll` donde viven esas constantes tiene TRES coordenadas naturales
    // y 24 huecos de funciones de forma — un hexaedro de 8 nudos, no el shell.
    // Las dos vias, la documental y la del binario, dicen lo mismo.
    //
    // Conclusion: **esta regla no viene de ningun paper del SHELL**. Se deja
    // porque esta MEDIDA (hemisferio 8x8: -34 % -> -4 %), pero como eleccion
    // numerica propia, no como «lo que hace CSI».
    //
    //     W_a + W_b = 1;  alpha = 1/(9 W_a)^(1/4);
    //     beta = ((2/3 - 2 W_a alpha^2) / W_b)^(1/2)
    //
    // cuatro puntos en (+-alpha, +-alpha) con peso W_a y cuatro en (+-beta, 0)
    // y (0, +-beta) con peso W_b. El paper: «For W_a close to 1, the eight-point
    // rule has a similar effect of sampling optimal stress points as the 2x2
    // Gaussian quadrature BUT DOES NOT PRODUCE A RANK-DEFICIENT MATRIX».
    //
    // Ahi esta la salida del callejon del 2x2: el 2x2 desbloquea la cascara
    // curva pero deja CUATRO modos de energia nula (un mecanismo). Medido en
    // Python (`benchmarks_shell3d.py`), hemisferio pinzado contra 0.094:
    //
    //     malla      ITW 1990 (3x3)      regla de 8 (W_a = 0.99)
    //      8x8         -34.07 %                -4.07 %
    //     12x12        -10.10 %                -0.85 %
    //
    // con 3 modos nulos y el patch test EXACTO en las dos.
    //
    // OJO: se llego a escribir aqui que alpha(W_a=1) = 9^(-1/4) = 1/raiz(3)
    // "demuestra" que CSI usa esta regla, porque CsiGo2.dll carga ese numero.
    // ES FALSO, y se deja escrito para que no vuelva: la funcion donde vive esa
    // constante tiene TRES coordenadas naturales y escribe 24 huecos de
    // funciones de forma — es un HEXAEDRO de 8 nudos, no el shell, y su 0.125
    // es el 1/8 de N = 1/8 (1+-r)(1+-s)(1+-t). Un numero compatible con dos
    // explicaciones no confirma ninguna. Lo que sostiene a esta regla es lo
    // MEDIDO: 3 modos nulos, patch test exacto y el hemisferio de -34 % a -4 %.
    double qr[9], qs[9], qw[9];
    int nq = 0;
    if (wAlpha > 0.0) {
        const double wb = 1.0 - wAlpha;
        const double al = 1.0 / std::pow(9.0 * wAlpha, 0.25);
        for (int i = 0; i < 4; i++) {
            qr[nq] = (i < 2 ? -al : al);
            qs[nq] = ((i % 2) ? al : -al);
            qw[nq] = wAlpha;
            nq++;
        }
        if (wb > 0.0) {
            const double be = std::sqrt((2.0 / 3.0 - 2.0 * wAlpha * al * al) / wb);
            const double br[4] = {-be, be, 0.0, 0.0};
            const double bs[4] = {0.0, 0.0, -be, be};
            for (int i = 0; i < 4; i++) { qr[nq] = br[i]; qs[nq] = bs[i]; qw[nq] = wb; nq++; }
        }
    } else {
        for (int ig = 0; ig < nGauss; ig++)
            for (int jg = 0; jg < nGauss; jg++) {
                qr[nq] = gg[ig]; qs[nq] = gg[jg]; qw[nq] = wg[ig] * wg[jg]; nq++;
            }
    }
    // El centro solo es punto de integracion con Gauss 3x3.
    const bool hayCentro = (wAlpha <= 0.0 && nGauss == 3);

    // ── Proyeccion de las funciones del drilling (la via de FEAP) ─────────
    // Lo que hace el shell de Robert Taylor en FEAP (`elements/shells/
    // shell3d.f`, subrutina `shl3di`) — la implementacion del PROPIO AUTOR de
    // Taylor & Simo (1985), la otra referencia que cita el manual de CSI
    // junto al ITW 1991. En su codigo:
    //
    //     gshp1(i,j) = SUM_l shp1(i,j,l)*dvl(l)      <- la integral
    //     shp1(i,j,l) = shp1(i,j,l) - gshp1(i,j)/dv  <- restarle la MEDIA
    //
    // y sus `shp1`/`shp2` son exactamente estas columnas de B (se ve en que
    // multiplican `vl(6,j)`, el GDL 6 = el drilling). Obliga a que
    // INT B_theta dOmega = 0: el giro deja de producir deformacion media.
    //
    // POR QUE IMPORTA, medido contra la matriz 12x12 de ETABS reconstruida por
    // flexibilidad (`galpon-bodega-electoral/memb12.json`, 10 geometrias):
    //
    //     formulacion            K_uu    K_utheta  K_thetatheta   12x12
    //     ITW 1990 (3x3)         1.16 %   328.12 %   212.45 %    15.97 %
    //     ITW 1991 (regla de 8)  6.77 %   333.53 %   177.98 %    17.84 %
    //     PROYECCION + 3x3       1.16 %     9.28 %    39.69 %     1.42 %
    //
    // Cambiar la CUADRATURA no podia arreglarlo porque no cambia la FORMA de
    // esos bloques; esto si. Y el minimo vuelve a caer en gamma/mu = 0.40
    // exacto, que ya habia salido por minimos cuadrados con otra formulacion:
    // el mismo numero por dos caminos independientes.
    double mg1[4] = {0,0,0,0}, mg4[4] = {0,0,0,0}, mg23[4] = {0,0,0,0};
    if (proyDrill) {
        double areaQ = 0.0;
        for (int iq = 0; iq < nq; iq++) {
            double rr = qr[iq], ss = qs[iq], ww = qw[iq];
            double Nq[4], dNr[4], dNe[4], Jv[2][2];
            shapeFunctionsQ4(rr, ss, Nq, dNr, dNe);
            double dJq = jacobian2D(x, y, dNr, dNe, Jv);
            double nsr[4] = { -rr * (1 - ss),  0.5 * (1 - ss * ss),
                              -rr * (1 + ss), -0.5 * (1 - ss * ss) };
            double nss[4] = { -0.5 * (1 - rr * rr), -ss * (1 + rr),
                               0.5 * (1 - rr * rr), -ss * (1 - rr) };
            double Sx[4], Sy[4];
            for (int i = 0; i < 4; i++) {
                Sx[i] = Jv[0][0] * nsr[i] + Jv[0][1] * nss[i];
                Sy[i] = Jv[1][0] * nsr[i] + Jv[1][1] * nss[i];
            }
            double w = ww * std::abs(dJq);
            for (int i = 0; i < 4; i++) {
                int pp = ant[i];
                mg1[i]  += (Sx[pp] * cx[pp] - Sx[i] * cx[i]) * w;
                mg4[i]  += (Sy[pp] * cy[pp] - Sy[i] * cy[i]) * w;
                mg23[i] += ((Sy[pp] * cx[pp] - Sy[i] * cx[i])
                          + (Sx[pp] * cy[pp] - Sx[i] * cy[i])) * w;
            }
            areaQ += w;
        }
        for (int i = 0; i < 4; i++) { mg1[i] /= areaQ; mg4[i] /= areaQ; mg23[i] /= areaQ; }
    }

    // Jacobiano del CENTRO, para la modificacion de Taylor 1976 sobre la
    // burbuja: evaluar sus derivadas con J0 constante fuerza INT(B_burbuja) = 0
    // y es lo que el paper llama "the modification suggested by Taylor",
    // necesaria -dice- para que la membrana no bloquee en la cascara.
    double Jinv0[2][2], dJ0c;
    {
        double N0[4], dN0dxi[4], dN0deta[4];
        shapeFunctionsQ4(0.0, 0.0, N0, dN0dxi, dN0deta);
        dJ0c = std::abs(jacobian2D(x, y, dN0dxi, dN0deta, Jinv0));
    }

    Eigen::MatrixXd K14 = Eigen::MatrixXd::Zero(14, 14);   // 12 nodales + 2 burbuja
    // lo que se guarda del punto central para armar P
    double c_dNx[4] = {0,0,0,0}, c_dNy[4] = {0,0,0,0};
    double c_gt2[4] = {0,0,0,0}, c_gt3[4] = {0,0,0,0}, c_N[4] = {0,0,0,0};
    double c_dNBx = 0, c_dNBy = 0, c_dJ = 0;

    for (int iq = 0; iq < nq; iq++) {
        {
            double rr = qr[iq], ss = qs[iq], ww = qw[iq];

            double N[4], dNdxi[4], dNdeta[4];
            shapeFunctionsQ4(rr, ss, N, dNdxi, dNdeta);
            double Jinv[2][2];
            double dJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

            double dNx[4], dNy[4];
            for (int i = 0; i < 4; i++) {
                dNx[i] = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
                dNy[i] = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            }

            // Derivadas naturales de las funciones serendipity de lado,
            // ecs. (22)-(23) del paper (ya con el 1/2 dentro).
            double nsr[4] = { -rr * (1 - ss),
                               0.5 * (1 - ss * ss),
                              -rr * (1 + ss),
                              -0.5 * (1 - ss * ss) };
            double nss[4] = { -0.5 * (1 - rr * rr),
                              -ss * (1 + rr),
                               0.5 * (1 - rr * rr),
                              -ss * (1 - rr) };
            double NSx[4], NSy[4];
            for (int i = 0; i < 4; i++) {
                NSx[i] = Jinv[0][0] * nsr[i] + Jinv[0][1] * nss[i];
                NSy[i] = Jinv[1][0] * nsr[i] + Jinv[1][1] * nss[i];
            }

            // Burbuja jerarquica NB9 = (1-r^2)(1-s^2), ec. (24)
            double nbr = -2.0 * rr * (1 - ss * ss);
            double nbs = -2.0 * ss * (1 - rr * rr);
            double dNBx, dNBy;
            if (taylorBurbuja) {
                double f = dJ0c / std::abs(dJ);
                dNBx = (Jinv0[0][0] * nbr + Jinv0[0][1] * nbs) * f;
                dNBy = (Jinv0[1][0] * nbr + Jinv0[1][1] * nbs) * f;
            } else {
                dNBx = Jinv[0][0] * nbr + Jinv[0][1] * nbs;
                dNBy = Jinv[1][0] * nbr + Jinv[1][1] * nbs;
            }

            // G_I, ec. (28): cada nudo participa en SUS DOS lados, con signo
            // contrario (en uno entra como psi_J y en el otro como psi_K).
            double gt1[4], gt2[4], gt3[4], gt4[4];
            for (int i = 0; i < 4; i++) {
                int p = ant[i];
                gt1[i] = NSx[p] * cx[p] - NSx[i] * cx[i];
                gt2[i] = NSy[p] * cx[p] - NSy[i] * cx[i];
                gt3[i] = NSx[p] * cy[p] - NSx[i] * cy[i];
                gt4[i] = NSy[p] * cy[p] - NSy[i] * cy[i];
            }

            Eigen::MatrixXd B = Eigen::MatrixXd::Zero(3, 14);
            for (int i = 0; i < 4; i++) {
                B(0, 3*i)     = dNx[i];
                B(1, 3*i + 1) = dNy[i];
                B(2, 3*i)     = dNy[i];
                B(2, 3*i + 1) = dNx[i];
                B(0, 3*i + 2) = gt1[i] - mg1[i];
                B(1, 3*i + 2) = gt4[i] - mg4[i];
                B(2, 3*i + 2) = gt2[i] + gt3[i] - mg23[i];
            }
            // El ITW **1991** NO lleva burbuja: su ec. (6) es Allman a secas.
            // La burbuja `(1-r^2)(1-s^2)` es del paper de 1990 (su ec. 24), y
            // ahi hace falta porque se integra a 3x3; con la regla de ocho
            // puntos sobra. Dejandola puesta el C++ se separaba un 2-16 % del
            // Python en la matriz — medido con `kelem_native.exe`.
            // Con estas dos columnas a cero, `Kbb` es singular y la
            // condensacion de mas abajo devuelve `Kuu` tal cual: la 12x12 sin
            // burbuja, que es lo que toca.
            if (wAlpha <= 0.0) {
                B(0, 12) = dNBx;  B(2, 12) = dNBy;
                B(1, 13) = dNBy;  B(2, 13) = dNBx;
            }

            K14 += (ww * std::abs(dJ)) * (B.transpose() * (sriVol > 0 ? Ddev : Dm) * B);

            if (hayCentro && rr == 0.0 && ss == 0.0) {   // el centro ya es punto de Gauss
                for (int i = 0; i < 4; i++) {
                    c_dNx[i] = dNx[i]; c_dNy[i] = dNy[i];
                    c_gt2[i] = gt2[i]; c_gt3[i] = gt3[i]; c_N[i] = N[i];
                }
                c_dNBx = dNBx; c_dNBy = dNBy; c_dJ = std::abs(dJ);
            }
        }
    }

    // ── Segundo barrido: el VOLUMETRICO, con la cuadratura reducida ──────
    // Va aparte porque necesita OTRA cuadratura que el desviador, y en el mismo
    // bucle no caben las dos. Solo entran las columnas de B — la burbuja, la
    // penalizacion y el reloj de arena se hacen una sola vez, mas abajo.
    if (sriVol > 0) {
        static const double gr2[2] = {-GP2, GP2};
        for (int ir = 0; ir < sriVol; ir++) {
            for (int is = 0; is < sriVol; is++) {
                double rr = (sriVol == 2) ? gr2[ir] : 0.0;
                double ss = (sriVol == 2) ? gr2[is] : 0.0;
                double ww = (sriVol == 2) ? 1.0 : 4.0;

                double N[4], dNdxi[4], dNdeta[4], Jinv[2][2];
                shapeFunctionsQ4(rr, ss, N, dNdxi, dNdeta);
                double dJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);
                double dNx[4], dNy[4];
                for (int i = 0; i < 4; i++) {
                    dNx[i] = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
                    dNy[i] = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
                }
                double nsr[4] = { -rr * (1 - ss),  0.5 * (1 - ss * ss),
                                  -rr * (1 + ss), -0.5 * (1 - ss * ss) };
                double nss[4] = { -0.5 * (1 - rr * rr), -ss * (1 + rr),
                                   0.5 * (1 - rr * rr), -ss * (1 - rr) };
                double NSx[4], NSy[4];
                for (int i = 0; i < 4; i++) {
                    NSx[i] = Jinv[0][0] * nsr[i] + Jinv[0][1] * nss[i];
                    NSy[i] = Jinv[1][0] * nsr[i] + Jinv[1][1] * nss[i];
                }
                double nbr = -2.0 * rr * (1 - ss * ss);
                double nbs = -2.0 * ss * (1 - rr * rr);
                double dNBx = Jinv[0][0] * nbr + Jinv[0][1] * nbs;
                double dNBy = Jinv[1][0] * nbr + Jinv[1][1] * nbs;

                Eigen::MatrixXd B = Eigen::MatrixXd::Zero(3, 14);
                for (int i = 0; i < 4; i++) {
                    int p = ant[i];
                    double g1 = NSx[p] * cx[p] - NSx[i] * cx[i];
                    double g2 = NSy[p] * cx[p] - NSy[i] * cx[i];
                    double g3 = NSx[p] * cy[p] - NSx[i] * cy[i];
                    double g4 = NSy[p] * cy[p] - NSy[i] * cy[i];
                    B(0, 3*i)     = dNx[i];
                    B(1, 3*i + 1) = dNy[i];
                    B(2, 3*i)     = dNy[i];
                    B(2, 3*i + 1) = dNx[i];
                    B(0, 3*i + 2) = g1 - mg1[i];
                    B(1, 3*i + 2) = g4 - mg4[i];
                    B(2, 3*i + 2) = g2 + g3 - mg23[i];
                }
                if (wAlpha <= 0.0) {
                    B(0, 12) = dNBx;  B(2, 12) = dNBy;
                    B(1, 13) = dNBy;  B(2, 13) = dNBx;
                }
                K14 += (ww * std::abs(dJ)) * (B.transpose() * Dvol * B);
            }
        }
    }

    if (!hayCentro) {
        // Si el centro NO es punto de la cuadratura, P se evalua aparte:
        // la penalizacion del paper es de UN punto y ese punto es (0,0).
        double N0[4], dN0dxi[4], dN0deta[4], Ji0[2][2];
        shapeFunctionsQ4(0.0, 0.0, N0, dN0dxi, dN0deta);
        c_dJ = std::abs(jacobian2D(x, y, dN0dxi, dN0deta, Ji0));
        double nsr0[4] = { 0.0, 0.5, 0.0, -0.5 };
        double nss0[4] = { -0.5, 0.0, 0.5, 0.0 };
        double NSx0[4], NSy0[4];
        for (int i = 0; i < 4; i++) {
            c_dNx[i] = Ji0[0][0] * dN0dxi[i] + Ji0[0][1] * dN0deta[i];
            c_dNy[i] = Ji0[1][0] * dN0dxi[i] + Ji0[1][1] * dN0deta[i];
            c_N[i]   = N0[i];
            NSx0[i]  = Ji0[0][0] * nsr0[i] + Ji0[0][1] * nss0[i];
            NSy0[i]  = Ji0[1][0] * nsr0[i] + Ji0[1][1] * nss0[i];
        }
        for (int i = 0; i < 4; i++) {
            int p = ant[i];
            c_gt2[i] = NSy0[p] * cx[p] - NSy0[i] * cx[i];
            c_gt3[i] = NSx0[p] * cy[p] - NSx0[i] * cy[i];
        }
        c_dNBx = 0.0; c_dNBy = 0.0;      // dNB/dr = dNB/ds = 0 en el centro
    }

    // P, ec. (38), integrada con UN SOLO PUNTO: gamma * Omega * res*res^T,
    // con Omega = 4*dJ0 (el area) y res = <b ; g> de las ecs. (31)-(32).
    double mu = E / (2.0 * (1.0 + nu));
    double gamma = gammaFac * mu;
    Eigen::VectorXd res = Eigen::VectorXd::Zero(14);
    for (int i = 0; i < 4; i++) {
        res(3*i)     = -0.5 * c_dNy[i];
        res(3*i + 1) =  0.5 * c_dNx[i];
        res(3*i + 2) =  0.5 * (c_gt3[i] - c_gt2[i]) - c_N[i];
    }
    res(12) = -0.5 * c_dNBy;
    res(13) =  0.5 * c_dNBx;
    if (wAlpha > 0.0) { res(12) = 0.0; res(13) = 0.0; }   // sin burbuja: sin sus GDL
    // ⚠️ Wilson usa su K0 EN LUGAR de esta penalizacion, no ademas. Sumando las
    // dos, el drilling queda coartado dos veces y la cascara sale rigidisima:
    // 99 % de error en el hemisferio, medido. Con `k0Wilson` se salta P.
    if (!k0Wilson)
        K14 += (gamma * t * 4.0 * c_dJ) * (res * res.transpose());

    // ── Estabilizacion del reloj de arena ──────────────────────────────────
    // Con Gauss 2x2 la interpolacion de Allman deja un mecanismo: el elemento
    // sale con CUATRO modos de energia nula en vez de tres, y el que sobra es
    // el modo [+,-,+,-] de los theta (el reloj de arena).
    //
    // ETABS lo tiene medido: reconstruida su matriz 12x12, ese modo vale
    // 1/5000 * G*t*A — pequenisimo, justo lo justo para quitar el mecanismo sin
    // rigidizar nada. O sea que NO es rigidez: es estabilizacion.
    //
    // Con esto, el elemento cumple a la vez las tres cosas que cumple ETABS:
    // 3 modos nulos, patch test EXACTO (1.500000 / 0.600000) y Gauss 2x2 — que
    // es el unico orden que aparece en el binario (1/sqrt(3) se carga 8 veces;
    // sqrt(3/5), 5/9 y 8/9 NO se cargan nunca).
    if (khg > 0.0) {
        double A = 0.0;                       // area del cuadrilatero
        for (int i = 0; i < 4; i++) {
            int j = (i + 1) % 4;
            A += x[i] * y[j] - x[j] * y[i];
        }
        A = std::abs(A) / 2.0;
        Eigen::VectorXd hg = Eigen::VectorXd::Zero(14);
        for (int i = 0; i < 4; i++) hg(3*i + 2) = (i % 2 == 0) ? 1.0 : -1.0;
        K14 += (khg * mu * t * A / 4.0) * (hg * hg.transpose());
    }

    // ─── K0 de WILSON (cap. 9, ecs. 9.11-9.14) ────────────────────────────
    //
    // Con integracion de CUATRO PUNTOS (2x2) la matriz se queda con UN modo de
    // energia cero ademas de los tres de solido rigido: «rotaciones iguales en
    // todos los nodos y cero desplazamientos en nodos intermedios». Wilson lo
    // elimina anadiendo una matriz de RANGO UNO, no subiendo la cuadratura:
    //
    //   (9.11)  theta_0 = 1/2 (du_x/dy - du_y/dx) = b0 . u      en el CENTRO
    //   (9.12)  theta_barra = theta_0 - SUM Ni(0,0) theta_i = b0_barra . u
    //   (9.13)  K0 = INT b0_barra^T k0 b0_barra dV
    //              = k0 * Vol * b0_barra^T b0_barra    (UN punto)
    //   (9.14)  k0 = 0.025 * D33          (D33 = modulo de cortante G)
    //
    // Ni(0,0) = 1/4 en el Q4, asi que el termino de rotacion es -1/4 en los
    // cuatro nudos. `Vol = A * t`.
    if (k0Wilson) {
        double N0[4], dN0dxi[4], dN0deta[4], Jinv0k[2][2];
        shapeFunctionsQ4(0.0, 0.0, N0, dN0dxi, dN0deta);
        double dJ0k = std::abs(jacobian2D(x, y, dN0dxi, dN0deta, Jinv0k));
        // area del cuadrilatero por la formula del poligono
        double Ak = 0.0;
        for (int i = 0; i < 4; i++) {
            int j = (i + 1) % 4;
            Ak += x[i] * y[j] - x[j] * y[i];
        }
        Ak = std::abs(Ak) / 2.0;
        Eigen::VectorXd b0 = Eigen::VectorXd::Zero(14);
        for (int i = 0; i < 4; i++) {
            double dNx = Jinv0k[0][0] * dN0dxi[i] + Jinv0k[0][1] * dN0deta[i];
            double dNy = Jinv0k[1][0] * dN0dxi[i] + Jinv0k[1][1] * dN0deta[i];
            b0(3 * i + 0) =  0.5 * dNy;      // + 1/2 du_x/dy
            b0(3 * i + 1) = -0.5 * dNx;      // - 1/2 du_y/dx
            b0(3 * i + 2) = -N0[i];          // - SUM Ni(0,0) theta_i
        }
        (void)dJ0k;
        double k0 = 0.025 * mu;              // (9.14) mu es G
        K14 += (k0 * Ak * t) * (b0 * b0.transpose());
    }

    // Condensacion estatica de la burbuja (los 2 GDL internos)
    Eigen::MatrixXd Kuu = K14.topLeftCorner(12, 12);
    Eigen::MatrixXd Kab = K14.topRightCorner(12, 2);
    Eigen::Matrix2d  Kbb = K14.bottomRightCorner(2, 2);
    if (std::abs(Kbb.determinant()) < 1e-30) return Kuu;
    return Kuu - Kab * Kbb.inverse() * Kab.transpose();
}

// ─── Plate bending stiffness (Mindlin-Reissner Q4): 12×12 ──────────────────
// DOFs per node: w, θx, θy
// Bending: 2×2 Gauss + INCOMPATIBLE MODES Wilson 1971 (4 DOFs internos sobre
//          rotaciones θx, θy → curvatura cuadrática efectiva en lugar de lineal)
// Shear:   MITC4 tying (Dvorkin & Bathe 1984) — sin modificar
//
// Convención DOFs internos: [α1·θx·N₅, α2·θx·N₆, α3·θy·N₅, α4·θy·N₆]
// donde N₅ = 1−ξ², N₆ = 1−η².
//
// Las rotaciones extendidas son:
//   θx(ξ,η) = Σ N_i·θx_i + α1·(1−ξ²) + α2·(1−η²)
//   θy(ξ,η) = Σ N_i·θy_i + α3·(1−ξ²) + α4·(1−η²)
// Curvaturas (Mindlin) heredan los términos cuadráticos:
//   κxx = -∂θy/∂x  → contribución de α3, α4
//   κyy = +∂θx/∂y  → contribución de α1, α2
//   κxy = +∂θx/∂x − ∂θy/∂y  → contribución de α1..α4
// Los modos α se condensan estáticamente al final → K 12×12.
//
// NOTA: el shear MITC4 NO se modifica (los modos α en θ no contribuyen
// a γxz, γyz en los tying points porque allí ξ=0 o η=0 → ∂N₅/∂ξ o ∂N₆/∂η
// son evaluados después con J₀ Taylor 1976, dando contribución residual
// que mantenemos en el bending, no en el shear MITC4).
static Eigen::MatrixXd getBendingK(const double x[4], const double y[4],
                                    double E, double nu, double t,
                                    const double *mod = nullptr)
{
    double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Eigen::Matrix3d Db;
    Db << D0,      D0 * nu, 0,
          D0 * nu, D0,      0,
          0,       0,       D0 * (1 - nu) / 2.0;

    double ks = 5.0 / 6.0;
    double G  = E / (2.0 * (1.0 + nu));
    Eigen::Matrix2d Ds;
    Ds << ks * G * t, 0,
          0,          ks * G * t;
    // M11MOD M22MOD M12MOD sobre la flexion, V13MOD V23MOD sobre el cortante
    // transversal. Un deck lleva M22 chico: no rigidiza cruzado al nervio.
    if (mod) {
        double m11 = mod[3], m22 = mod[4], m12 = mod[5];
        Db(0, 0) *= m11;
        Db(1, 1) *= m22;
        Db(2, 2) *= m12;
        double c = std::sqrt(std::max(0.0, m11 * m22));
        Db(0, 1) *= c;  Db(1, 0) *= c;
        Ds(0, 0) *= mod[6];
        Ds(1, 1) *= mod[7];
    }

    // Taylor 1976: J₀ del centro para mapear derivadas de N₅, N₆
    double Jinv0[2][2];
    double detJ0 = 1.0;
    {
        double N0[4], dN0dxi[4], dN0deta[4];
        shapeFunctionsQ4(0.0, 0.0, N0, dN0dxi, dN0deta);
        detJ0 = jacobian2D(x, y, dN0dxi, dN0deta, Jinv0);
    }

    // Acumuladores K extendido: K_uu (12×12), K_uα (12×4), K_αα (4×4)
    Eigen::MatrixXd Kuu = Eigen::MatrixXd::Zero(12, 12);
    Eigen::MatrixXd Kua = Eigen::MatrixXd::Zero(12, 4);
    Eigen::MatrixXd Kaa = Eigen::MatrixXd::Zero(4, 4);

    // ─── Bending: 2×2 Gauss ──────────────────────
    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N[4], dNdxi[4], dNdeta[4];
        shapeFunctionsQ4(xi, eta, N, dNdxi, dNdeta);

        double Jinv[2][2];
        double detJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        // Bb (3×12): convencion DOFs GLOBAL = rotation about axis (right-hand rule)
        // DOFs por nodo: [w, θx_global, θy_global] (índices 3*i+0, +1, +2)
        // Mapeo Mindlin βx,βy ↔ θ_global (límite Kirchhoff):
        //   βx_Mindlin = -θy_global   (axis swap + sign flip)
        //   βy_Mindlin = +θx_global   (axis swap)
        // Curvaturas:
        //   κxx = ∂βx/∂x = -∂θy/∂x = -∂(DOF 2)/∂x
        //   κyy = ∂βy/∂y = +∂θx/∂y = +∂(DOF 1)/∂y
        //   κxy = ∂βx/∂y + ∂βy/∂x = -∂θy/∂y + ∂θx/∂x
        // Este fix soluciona el bug de coupling shell-frame donde el shell
        // interpretaba erroneamente DOF 3,4 globales (θx, θy = rotation about axes)
        // como si fueran βx, βy (Mindlin normal rotations) — al asamblar con frames
        // que usan θ_global se sobre-rigidizaba el sistema ~3-30× (ver
        // BUG_ANALYSIS_shell_frame_dof_mismatch.md).
        Eigen::MatrixXd Bb = Eigen::MatrixXd::Zero(3, 12);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            Bb(0, 3*i + 2) = -dNdx;  // κxx = -∂θy/∂x  (DOF 2 = θy_global)
            Bb(1, 3*i + 1) = +dNdy;  // κyy = +∂θx/∂y  (DOF 1 = θx_global)
            Bb(2, 3*i + 1) = +dNdx;  // κxy: +∂θx/∂x
            Bb(2, 3*i + 2) = -dNdy;  //      -∂θy/∂y
        }

        // Bb_alpha (3×4): incompatible modes contribution to curvatures
        // α1=θx·N₅ (col 0), α2=θx·N₆ (col 1), α3=θy·N₅ (col 2), α4=θy·N₆ (col 3)
        // Derivadas con J₀ Taylor 1976 (centro)
        double dN5dxi  = -2.0 * xi,  dN5deta = 0.0;
        double dN6dxi  =  0.0,       dN6deta = -2.0 * eta;
        double dN5dx0 = Jinv0[0][0] * dN5dxi + Jinv0[0][1] * dN5deta;
        double dN5dy0 = Jinv0[1][0] * dN5dxi + Jinv0[1][1] * dN5deta;
        double dN6dx0 = Jinv0[0][0] * dN6dxi + Jinv0[0][1] * dN6deta;
        double dN6dy0 = Jinv0[1][0] * dN6dxi + Jinv0[1][1] * dN6deta;

        // ── La OTRA mitad de Taylor 1976: el factor detJ0/detJ ──────────────
        // Taylor, Beresford & Wilson (1976) son DOS cosas, no una: evaluar las
        // derivadas de los modos incompatibles con J0 **y** escalarlas por
        // detJ0/detJ(xi,eta). Faltaba la segunda, y sin ella
        //     ∫ Ba dA  ≠  0
        // que es justo la condicion del patch test de curvatura constante.
        // En un RECTANGULO detJ es constante e igual a detJ0, el factor vale 1
        // y no se nota — por eso llevaba aqui sin verse. Medido en el patch
        // test 2-001 de SAP2000 (MacNeal & Harder 1985, elementos irregulares):
        //     sin el factor:  ||∫Ba dA||/A = 9.3 a 23.6
        //     con el factor:  ||∫Ba dA||/A = 2e-16
        const double taylor = detJ0 / detJ;
        Eigen::MatrixXd Ba = Eigen::MatrixXd::Zero(3, 4);
        // κxx = -∂θy/∂x → α3·(-∂N5/∂x) + α4·(-∂N6/∂x)
        Ba(0, 2) = -dN5dx0;
        Ba(0, 3) = -dN6dx0;
        // κyy = +∂θx/∂y → α1·(+∂N5/∂y) + α2·(+∂N6/∂y)
        Ba(1, 0) = +dN5dy0;
        Ba(1, 1) = +dN6dy0;
        // κxy = +∂θx/∂x - ∂θy/∂y
        //   → α1·(+∂N5/∂x) + α2·(+∂N6/∂x) + α3·(-∂N5/∂y) + α4·(-∂N6/∂y)
        Ba(2, 0) = +dN5dx0;
        Ba(2, 1) = +dN6dx0;
        Ba(2, 2) = -dN5dy0;
        Ba(2, 3) = -dN6dy0;
        Ba *= taylor;

        double w = std::abs(detJ);
        Kuu += Bb.transpose() * Db * Bb * w;
        Kua += Bb.transpose() * Db * Ba * w;
        Kaa += Ba.transpose() * Db * Ba * w;
    }

    // ─── Shear: MITC4 tying (Dvorkin & Bathe 1984) ─────────
    // Same algorithm as OpenSees ShellMITC4 and our kirchhoff_q4.cpp
    // Tying points: A(0,-1), C(0,+1), B(-1,0), D(+1,0)
    // γxz: sampled at A,C → interpolated in η
    // γyz: sampled at B,D → interpolated in ξ

    // Helper: compute shear B at a point (same as shearBat in kirchhoff_q4)
    // ⚠️ COVARIANTE, no cartesiano. El MITC4 de Dvorkin & Bathe (1984) interpola
    // las componentes gamma_xi / gamma_eta —las que van sobre los ejes
    // NATURALES— y solo al final las devuelve al cartesiano con el jacobiano
    // del punto de Gauss:
    //     gamma_cov = J · gamma_cart          (J directo, en el punto de atadura)
    //     gamma_cov(xi,eta) = interpolacion lineal entre A-C y entre B-D
    //     gamma_cart        = J^-1 · gamma_cov   (en el punto de Gauss)
    // Antes se interpolaban directamente las filas CARTESIANAS. En un
    // rectangulo J es constante, entra y sale del promedio y da lo mismo — por
    // eso cerraba en rectangulo. En cuanto el elemento se distorsiona, J
    // cambia de un punto de atadura a otro y el promedio deja de valer:
    // medido con un campo de Kirchhoff EXACTO (donde gamma tiene que ser 0)
    // en los 5 elementos del patch test 2-001 de SAP2000, salia
    //     gamma_espurio / pendiente = 0.47 a 2.88
    // o sea cortante inventado del orden de la propia solucion. Es el mismo
    // patron que el bounding box del DKE: invisible en rectangulo, del 100 % en
    // cuanto hay malla real.
    auto shearBatCov = [&](double xi_pt, double eta_pt) -> Eigen::MatrixXd {
        double Np[4], dNp_dxi[4], dNp_deta[4];
        shapeFunctionsQ4(xi_pt, eta_pt, Np, dNp_dxi, dNp_deta);
        double Jp[2][2];
        jacobian2D(x, y, dNp_dxi, dNp_deta, Jp);
        double Jd[2][2];
        jacobianDirect2D(x, y, dNp_dxi, dNp_deta, Jd);
        // Convencion DOFs GLOBAL (consistente con bending B arriba):
        //   βx_Mindlin = -θy_global → γxz = ∂w/∂x - βx = ∂w/∂x + θy = ∂w/∂x + DOF 2
        //   βy_Mindlin = +θx_global → γyz = ∂w/∂y - βy = ∂w/∂y - θx = ∂w/∂y - DOF 1
        Eigen::MatrixXd Bsp = Eigen::MatrixXd::Zero(2, 12);
        for (int i = 0; i < 4; i++) {
            double dNdx_p = Jp[0][0]*dNp_dxi[i] + Jp[0][1]*dNp_deta[i];
            double dNdy_p = Jp[1][0]*dNp_dxi[i] + Jp[1][1]*dNp_deta[i];
            Bsp(0, 3*i)     = +dNdx_p;  // γxz: +∂w/∂x
            Bsp(0, 3*i + 2) = +Np[i];   // γxz: +θy_global  (DOF 2)
            Bsp(1, 3*i)     = +dNdy_p;  // γyz: +∂w/∂y
            Bsp(1, 3*i + 1) = -Np[i];   // γyz: -θx_global  (DOF 1)
        }
        // al covariante: gamma_cov = J · gamma_cart
        Eigen::MatrixXd Jm(2, 2);
        Jm << Jd[0][0], Jd[0][1], Jd[1][0], Jd[1][1];
        return Jm * Bsp;
    };

    // Pre-compute Bs COVARIANTE at the 4 tying points
    auto Bs_A = shearBatCov(0.0, -1.0);  // A = (0, -1)
    auto Bs_C = shearBatCov(0.0, +1.0);  // C = (0, +1)
    auto Bs_B = shearBatCov(-1.0, 0.0);  // B = (-1, 0)
    auto Bs_D = shearBatCov(+1.0, 0.0);  // D = (+1, 0)

    // Integrate shear with 2×2 Gauss using MITC4 interpolated Bs
    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N_gp[4], dN_gp_dxi[4], dN_gp_deta[4];
        shapeFunctionsQ4(xi, eta, N_gp, dN_gp_dxi, dN_gp_deta);

        double Jinv_gp[2][2];
        double detJ_gp = jacobian2D(x, y, dN_gp_dxi, dN_gp_deta, Jinv_gp);

        // MITC4 interpolation (Dvorkin & Bathe):
        Eigen::MatrixXd Bs_cov = Eigen::MatrixXd::Zero(2, 12);
        // γ_ξ (fila 0): se interpola A→C en η
        Bs_cov.row(0) = 0.5*(1.0 - eta)*Bs_A.row(0) + 0.5*(1.0 + eta)*Bs_C.row(0);
        // γ_η (fila 1): se interpola B→D en ξ
        Bs_cov.row(1) = 0.5*(1.0 - xi)*Bs_B.row(1) + 0.5*(1.0 + xi)*Bs_D.row(1);
        // y de vuelta al cartesiano con el J^-1 de ESTE punto de Gauss
        Eigen::MatrixXd JinvM(2, 2);
        JinvM << Jinv_gp[0][0], Jinv_gp[0][1], Jinv_gp[1][0], Jinv_gp[1][1];
        Eigen::MatrixXd Bs_mitc = JinvM * Bs_cov;

        Kuu += Bs_mitc.transpose() * Ds * Bs_mitc * std::abs(detJ_gp);
    }

    // ── Static condensation: K_b = K_uu - K_uα · K_αα⁻¹ · K_αu ──────────
    // K_αα incluye sólo aporte de bending (modos α actúan sobre rotaciones,
    // no sobre w → no hay contribución directa al shear; el acoplamiento
    // shear↔α es residual y se desprecia consistente con la nota anterior).
    Eigen::MatrixXd KaaInv;
    if (std::abs(Kaa.determinant()) > 1e-20) {
        KaaInv = Kaa.inverse();
    } else {
        std::cerr << "Warning: Kaa singular en getBendingK, fallback a Q4 estandar." << std::endl;
        return Kuu;
    }
    Eigen::MatrixXd Kb = Kuu - Kua * KaaInv * Kua.transpose();

    return Kb;
}

// ============================================================================
// ALTERNATIVA: getBendingK_DSE — Discrete Shear Element (Bathe-Wilson)
//
// Formulación inspirada en SAP2000/ETABS shell, Wilson §8.4-§8.6.
//
// 4 DOFs incompatibles Δθ_ij = uno por cada borde mid-side:
//   Δθ_5 (edge 1, η=-1): aporta a θy via N₅ = (1−ξ²)(1−η)/2
//   Δθ_6 (edge 2, ξ=+1): aporta a θx via N₆ = (1+ξ)(1−η²)/2
//   Δθ_7 (edge 3, η=+1): aporta a θy via N₇ = (1−ξ²)(1+η)/2
//   Δθ_8 (edge 4, ξ=-1): aporta a θx via N₈ = (1−ξ)(1−η²)/2
//
// Las rotaciones extendidas son (axis-aligned rect Q4 — caso típico):
//   θx(ξ,η) = Σ N_i·θx_i + N₆·Δθ_6 + N₈·Δθ_8
//   θy(ξ,η) = Σ N_i·θy_i + N₅·Δθ_5 + N₇·Δθ_7
//
// Enriquición cuadrática del campo de rotaciones POR LADO. Wilson §8.5 propone
// la patch-test correction (Eq. 8.17):
//   Ba_correc = Ba(ξ,η) − (1/A)·∫ Ba dA
// Esto fuerza que ∫Ba_correc dA = 0 → constant-curvature patch test pasa.
//
// IMPLEMENTACIÓN HEKATAN (híbrido pragmático):
// - BENDING: Bb estándar + Ba_b (mid-side bubbles) con patch-test correction
// - SHEAR:   MITC4 (Dvorkin & Bathe 1984) — los Δθ NO contribuyen al shear
//   directamente porque MITC4 muestrea exactamente en los edge midpoints
//   donde N5..N8 valen 1 — esto sería redundante con la condensación.
//   Usar MITC4 puro evita el shear locking cuando Δθ no es suficiente.
//
// Esto es DSE-bending + MITC4-shear (no es exactamente Wilson DSE, pero está
// más cerca de cómo trabaja realmente ETABS internamente — combina ambos
// mecanismos anti-locking en lugar de depender solo de los Δθ).
//
// Refs:
//   - Wilson §8.4-§8.6 (Edward L. Wilson, "Análisis Estructural", 4ª Ed.)
//   - Bathe & Bolourchi (1980), "A geometric and material nonlinear plate..."
//   - Dvorkin & Bathe (1984), MITC4 shear interpolation
//   - CSI Analysis Reference Manual §10.1 (DSE/DKE en SAP2000/ETABS)
// ============================================================================
static Eigen::MatrixXd getBendingK_DSE(const double x[4], const double y[4],
                                        double E, double nu, double t)
{
    // Material matrices (idénticas a getBendingK)
    double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Eigen::Matrix3d Db;
    Db << D0,      D0 * nu, 0,
          D0 * nu, D0,      0,
          0,       0,       D0 * (1 - nu) / 2.0;

    double ks = 5.0 / 6.0;
    double G  = E / (2.0 * (1.0 + nu));
    Eigen::Matrix2d Ds;
    Ds << ks * G * t, 0,
          0,          ks * G * t;

    // Mid-side bubble shape functions and natural derivatives
    auto bubbleShapes = [](double xi, double eta,
                            double Nb[4], double dNbdxi[4], double dNbdeta[4]) {
        // N5 = (1-ξ²)(1-η)/2 — edge 1, bottom (η=-1) — afecta θy
        Nb[0]      = 0.5 * (1.0 - xi*xi) * (1.0 - eta);
        dNbdxi[0]  = -xi * (1.0 - eta);
        dNbdeta[0] = -0.5 * (1.0 - xi*xi);
        // N6 = (1+ξ)(1-η²)/2 — edge 2, right (ξ=+1) — afecta θx
        Nb[1]      = 0.5 * (1.0 + xi) * (1.0 - eta*eta);
        dNbdxi[1]  = 0.5 * (1.0 - eta*eta);
        dNbdeta[1] = -(1.0 + xi) * eta;
        // N7 = (1-ξ²)(1+η)/2 — edge 3, top (η=+1) — afecta θy
        Nb[2]      = 0.5 * (1.0 - xi*xi) * (1.0 + eta);
        dNbdxi[2]  = -xi * (1.0 + eta);
        dNbdeta[2] = 0.5 * (1.0 - xi*xi);
        // N8 = (1-ξ)(1-η²)/2 — edge 4, left (ξ=-1) — afecta θx
        Nb[3]      = 0.5 * (1.0 - xi) * (1.0 - eta*eta);
        dNbdxi[3]  = -0.5 * (1.0 - eta*eta);
        dNbdeta[3] = -(1.0 - xi) * eta;
    };

    // Lambda: compute Ba_b (3×4 bending) at a Gauss point
    // DOF mapping in α-vector: [Δθ5 (θy@e1), Δθ6 (θx@e2), Δθ7 (θy@e3), Δθ8 (θx@e4)]
    auto computeBa_b = [&](double xi, double eta) -> Eigen::MatrixXd {
        double Nb[4], dNbdxi_arr[4], dNbdeta_arr[4];
        bubbleShapes(xi, eta, Nb, dNbdxi_arr, dNbdeta_arr);

        double N_d[4], dN_d_xi[4], dN_d_eta[4];
        shapeFunctionsQ4(xi, eta, N_d, dN_d_xi, dN_d_eta);
        double Jinv[2][2];
        jacobian2D(x, y, dN_d_xi, dN_d_eta, Jinv);

        double dNbdx[4], dNbdy[4];
        for (int b = 0; b < 4; b++) {
            dNbdx[b] = Jinv[0][0] * dNbdxi_arr[b] + Jinv[0][1] * dNbdeta_arr[b];
            dNbdy[b] = Jinv[1][0] * dNbdxi_arr[b] + Jinv[1][1] * dNbdeta_arr[b];
        }

        Eigen::MatrixXd Ba_b = Eigen::MatrixXd::Zero(3, 4);
        // κxx = -∂θy/∂x  → Δθ5 (col 0) y Δθ7 (col 2)
        Ba_b(0, 0) = -dNbdx[0];
        Ba_b(0, 2) = -dNbdx[2];
        // κyy = +∂θx/∂y  → Δθ6 (col 1) y Δθ8 (col 3)
        Ba_b(1, 1) = +dNbdy[1];
        Ba_b(1, 3) = +dNbdy[3];
        // κxy = +∂θx/∂x − ∂θy/∂y
        Ba_b(2, 1) = +dNbdx[1];   // de θx
        Ba_b(2, 3) = +dNbdx[3];
        Ba_b(2, 0) = -dNbdy[0];   // de θy
        Ba_b(2, 2) = -dNbdy[2];
        return Ba_b;
    };

    // ── Pass 1: compute area-averaged Ba_b for patch test correction (Eq. 8.17) ──
    Eigen::MatrixXd Ba_b_avg = Eigen::MatrixXd::Zero(3, 4);
    double area = 0.0;

    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N_d[4], dN_d_xi[4], dN_d_eta[4];
        shapeFunctionsQ4(xi, eta, N_d, dN_d_xi, dN_d_eta);
        double Jinv_d[2][2];
        double detJ = jacobian2D(x, y, dN_d_xi, dN_d_eta, Jinv_d);

        Eigen::MatrixXd Ba_b_gp = computeBa_b(xi, eta);
        double w = std::abs(detJ);
        Ba_b_avg += Ba_b_gp * w;
        area += w;
    }
    Ba_b_avg /= area;

    // ── Pass 2: assemble K_bending con Ba_b corregido ──
    Eigen::MatrixXd Kuu = Eigen::MatrixXd::Zero(12, 12);
    Eigen::MatrixXd Kua = Eigen::MatrixXd::Zero(12, 4);
    Eigen::MatrixXd Kaa = Eigen::MatrixXd::Zero(4, 4);

    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N_gp[4], dNdxi[4], dNdeta[4];
        shapeFunctionsQ4(xi, eta, N_gp, dNdxi, dNdeta);
        double Jinv[2][2];
        double detJ = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        // Bb (3×12): standard bending B
        Eigen::MatrixXd Bb = Eigen::MatrixXd::Zero(3, 12);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            Bb(0, 3*i + 2) = -dNdx;
            Bb(1, 3*i + 1) = +dNdy;
            Bb(2, 3*i + 1) = +dNdx;
            Bb(2, 3*i + 2) = -dNdy;
        }

        // Augmented Ba_b con patch-test correction (Wilson Eq. 8.17)
        Eigen::MatrixXd Ba_b = computeBa_b(xi, eta) - Ba_b_avg;

        double w = std::abs(detJ);
        // Bending contribution
        Kuu += Bb.transpose() * Db * Bb * w;
        Kua += Bb.transpose() * Db * Ba_b * w;
        Kaa += Ba_b.transpose() * Db * Ba_b * w;
    }

    // ── Pass 3: shear con MITC4 (Dvorkin & Bathe 1984) — sin contribución de Δθ ──
    // Los Δθ no contribuyen al shear porque MITC4 muestrea exactamente en
    // edge midpoints donde N5..N8 = 1 — sería redundante con la condensación.
    auto shearBat_dse = [&](double xi_pt, double eta_pt) -> Eigen::MatrixXd {
        double Np[4], dNp_dxi[4], dNp_deta[4];
        shapeFunctionsQ4(xi_pt, eta_pt, Np, dNp_dxi, dNp_deta);
        double Jp[2][2];
        jacobian2D(x, y, dNp_dxi, dNp_deta, Jp);
        Eigen::MatrixXd Bsp = Eigen::MatrixXd::Zero(2, 12);
        for (int i = 0; i < 4; i++) {
            double dNdx_p = Jp[0][0]*dNp_dxi[i] + Jp[0][1]*dNp_deta[i];
            double dNdy_p = Jp[1][0]*dNp_dxi[i] + Jp[1][1]*dNp_deta[i];
            Bsp(0, 3*i)     = +dNdx_p;
            Bsp(0, 3*i + 2) = +Np[i];
            Bsp(1, 3*i)     = +dNdy_p;
            Bsp(1, 3*i + 1) = -Np[i];
        }
        return Bsp;
    };
    auto Bs_A_dse = shearBat_dse(0.0, -1.0);
    auto Bs_C_dse = shearBat_dse(0.0, +1.0);
    auto Bs_B_dse = shearBat_dse(-1.0, 0.0);
    auto Bs_D_dse = shearBat_dse(+1.0, 0.0);

    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];

        double N_gp[4], dNdxi_gp[4], dNdeta_gp[4];
        shapeFunctionsQ4(xi, eta, N_gp, dNdxi_gp, dNdeta_gp);
        double Jinv_gp[2][2];
        double detJ_gp = jacobian2D(x, y, dNdxi_gp, dNdeta_gp, Jinv_gp);

        Eigen::MatrixXd Bs_mitc = Eigen::MatrixXd::Zero(2, 12);
        Bs_mitc.row(0) = 0.5*(1.0 - eta)*Bs_A_dse.row(0) + 0.5*(1.0 + eta)*Bs_C_dse.row(0);
        Bs_mitc.row(1) = 0.5*(1.0 - xi)*Bs_B_dse.row(1) + 0.5*(1.0 + xi)*Bs_D_dse.row(1);

        Kuu += Bs_mitc.transpose() * Ds * Bs_mitc * std::abs(detJ_gp);
    }

    // Static condensation 16×16 → 12×12 (DSE de Wilson §8.6)
    Eigen::MatrixXd KaaInv;
    if (std::abs(Kaa.determinant()) > 1e-20) {
        KaaInv = Kaa.inverse();
    } else {
        std::cerr << "Warning: Kaa singular en getBendingK_DSE, fallback." << std::endl;
        return Kuu;
    }
    Eigen::MatrixXd Kb = Kuu - Kua * KaaInv * Kua.transpose();
    return Kb;
}

// ============================================================================
// VARIANTE C: getBendingK_DSE_FULL — Complete Wilson DSE per Cap. 8 (textbook)
//
// Implementación completa del Discrete Shear Element de Wilson considerando
// TODOS los problemas que enfrenta ETABS internamente (Cap. 6 + Cap. 8 del libro
// "Análisis Estructural" de Edward L. Wilson, 4ª Ed.):
//
// 1) ENRIQUECIMIENTO DEL CAMPO DE ROTACIONES (16 DOFs internos):
//    Δθ_e = "rotación perpendicular a borde e" (en plano de placa) en el
//    punto medio del lado, una por cada uno de los 4 bordes.
//    Funciones de forma de burbuja N5..N8 cuadráticas en lados:
//      N5 = (1−ξ²)(1−η)/2 (lado η=−1)
//      N6 = (1+ξ)(1−η²)/2 (lado ξ=+1)
//      N7 = (1−ξ²)(1+η)/2 (lado η=+1)
//      N8 = (1−ξ)(1−η²)/2 (lado ξ=−1)
//    Las rotaciones extendidas son:
//      θx_enriched += −sin α_e · N_{e+5} · Δθ_e
//      θy_enriched += +cos α_e · N_{e+5} · Δθ_e
//    (donde α_e es el ángulo del tangente del lado e con +x, y la dirección
//    perpendicular en plano de placa es n̂_e = (−sin α_e, cos α_e); Δθ_e
//    es la componente escalar de la rotación a lo largo de n̂_e.)
//
// 2) PATCH TEST DE CURVATURA CONSTANTE (Wilson Eq. 8.17 / Eq. 6.4):
//      Bb_aa_correc = Bb_aa(ξ,η) − (1/A)·∫ Bb_aa dA
//    Esto fuerza ∫ Bb_aa_correc dA = 0 → patch test pasa para cuadriláteros
//    distorsionados. Es la generalización de la corrección Taylor 1976 J0.
//
// 3) CORTANTE DISCRETO POR LADO (Wilson Eq. 8.6 → 8.9):
//    En lugar de usar MITC4 (sampling en (ξ=0,η=±1) y (ξ=±1,η=0) en coords
//    naturales), DSE muestrea el cortante TANGENCIAL γ_e en el punto medio
//    de cada lado en COORDS FÍSICAS:
//      γ_e = (1/L_e)(w_j − w_i) + (1/2)(θ_n_i + θ_n_j) + (2/3)·Δθ_e
//    donde θ_n = −sin α · θx + cos α · θy. La derivación viene de asumir
//    interpolación cúbica de Hermite para w a lo largo de cada lado.
//    El término +(2/3)·Δθ_e es CRUCIAL: acopla las rotaciones internas Δθ
//    con el cortante. SIN este término, los Δθ serían "modos puros de
//    flexión" y el elemento sufriría shear locking severo.
//
// 4) RECONSTRUCCIÓN DEL CORTANTE EN ESQUINAS (Wilson Eq. 8.9):
//    En cada esquina i, dos lados se encuentran (uno saliente, uno entrante).
//    Los cortantes tangenciales γ_out, γ_in en los respectivos puntos medios
//    se transforman a (γxz, γyz) cartesianos en la esquina via:
//      [γ_out]   [cx_out  cy_out] [γxz_i]
//      [γ_in ] = [-cx_in  -cy_in] [γyz_i]    (signo flip para dirección saliente)
//    Invertir 2×2 → (γxz_i, γyz_i) en cada esquina.
//
// 5) INTERPOLACIÓN BILINEAL N1..N4 PARA EVALUAR EN PUNTOS DE GAUSS:
//    γxz(ξ,η) = Σ N_i(ξ,η)·γxz_i
//    γyz(ξ,η) = Σ N_i(ξ,η)·γyz_i
//    Wilson §8.4: "el paso final es usar las funciones bilineales estándares
//    de cuatro nodos para evaluar los cortantes en el punto de integración."
//
// 6) CONDENSACIÓN ESTÁTICA (Wilson Eq. 6.11 / Eq. 8.18-8.19):
//    [Kuu Kua] [u]   [F]              Kb = Kuu − Kua · Kaa⁻¹ · Kua^T
//    [Kau Kaa] [α] = [0]      →       (12×12 final, los Δθ no aparecen en
//    Como F_α = 0 (no hay carga directa)  el ensamble global, pero su efecto
//    se puede eliminar α via condensación. estabilizante queda incorporado
//                                          en Kb.)
//
// PROPIEDADES MATEMÁTICAS GARANTIZADAS:
// - Pasa patch test de curvatura constante (gracias a Eq. 8.17).
// - Pasa patch test de cortante constante (gracias a interp. bilineal de
//   esquinas reconstruidas correctamente, en cuadriláteros convexos).
// - Sin shear locking en flexión pura (el (2/3)·Δθ_ij + condensación absorbe
//   el cortante parásito Q4, equivalente al ANS / MITC4 en rectángulos).
// - Equivalente exacto a MITC4 para rectángulos perfectos en plano X-Y.
// - Para mallas distorsionadas, ligeramente diferente de MITC4 (DSE muestrea
//   en coords físicas, MITC4 en coords naturales).
//
// Refs:
//   - Wilson, E.L., "Análisis Estructural", 4ª Ed., Cap. 6 §6.3-§6.5, Cap. 8 §8.2-§8.6
//   - CSI Analysis Reference Manual §10.1 (DSE/DKE en SAP2000/ETABS)
//   - Ibrahimbegovic & Wilson (1991), "A unified formulation for triangular
//     and quadrilateral flat shell finite elements"
//   - Bathe & Bolourchi (1980); Dvorkin & Bathe (1984), MITC4 (caso particular)
// ============================================================================
static Eigen::MatrixXd getBendingK_DSE_FULL(const double x[4], const double y[4],
                                              double E, double nu, double t)
{
    // ── Material matrices ───────────────────────────────
    double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Eigen::Matrix3d Db;
    Db << D0,      D0 * nu, 0,
          D0 * nu, D0,      0,
          0,       0,       D0 * (1 - nu) / 2.0;

    double ks = 5.0 / 6.0;
    double G  = E / (2.0 * (1.0 + nu));
    Eigen::Matrix2d Ds;
    Ds << ks * G * t, 0,
          0,          ks * G * t;

    // ── Edge geometry: tangente (cx,cy) y longitud para los 4 bordes ──
    // Bordes (CCW): e0=0→1, e1=1→2, e2=2→3, e3=3→0
    int edge_node_i[4] = {0, 1, 2, 3};
    int edge_node_j[4] = {1, 2, 3, 0};
    double cx_e[4], cy_e[4], L_e[4];
    for (int e = 0; e < 4; e++) {
        int i = edge_node_i[e], j = edge_node_j[e];
        double dx = x[j] - x[i];
        double dy = y[j] - y[i];
        L_e[e] = std::sqrt(dx*dx + dy*dy);
        if (L_e[e] < 1e-15) L_e[e] = 1e-15;
        cx_e[e] = dx / L_e[e];   // = cos α_e
        cy_e[e] = dy / L_e[e];   // = sin α_e
    }

    // ── Funciones de forma burbuja N5..N8 (interior cuadrático en lados) ──
    auto bubbleShapes = [](double xi, double eta,
                            double Nb[4], double dNbdxi[4], double dNbdeta[4]) {
        Nb[0]      = 0.5 * (1.0 - xi*xi) * (1.0 - eta);
        dNbdxi[0]  = -xi * (1.0 - eta);
        dNbdeta[0] = -0.5 * (1.0 - xi*xi);
        Nb[1]      = 0.5 * (1.0 + xi) * (1.0 - eta*eta);
        dNbdxi[1]  = 0.5 * (1.0 - eta*eta);
        dNbdeta[1] = -(1.0 + xi) * eta;
        Nb[2]      = 0.5 * (1.0 - xi*xi) * (1.0 + eta);
        dNbdxi[2]  = -xi * (1.0 + eta);
        dNbdeta[2] = 0.5 * (1.0 - xi*xi);
        Nb[3]      = 0.5 * (1.0 - xi) * (1.0 - eta*eta);
        dNbdxi[3]  = -0.5 * (1.0 - eta*eta);
        dNbdeta[3] = -(1.0 - xi) * eta;
    };

    // ── Lambda: B_b en punto Gauss ──────────────────────
    // Devuelve Bb_uu (3×12) [estándar nodal] y Bb_aa (3×4) [contribución burbujas]
    auto computeBb = [&](double xi, double eta,
                          Eigen::MatrixXd &Bb_uu, Eigen::MatrixXd &Bb_aa,
                          double &detJ_out) {
        double N[4], dNdxi[4], dNdeta[4];
        shapeFunctionsQ4(xi, eta, N, dNdxi, dNdeta);
        double Jinv[2][2];
        detJ_out = jacobian2D(x, y, dNdxi, dNdeta, Jinv);

        // Bb_uu (3×12): nodal estándar (mismo que getBendingK base)
        Bb_uu = Eigen::MatrixXd::Zero(3, 12);
        for (int i = 0; i < 4; i++) {
            double dNdx = Jinv[0][0] * dNdxi[i] + Jinv[0][1] * dNdeta[i];
            double dNdy = Jinv[1][0] * dNdxi[i] + Jinv[1][1] * dNdeta[i];
            Bb_uu(0, 3*i + 2) = -dNdx;  // κxx = -∂θy/∂x
            Bb_uu(1, 3*i + 1) = +dNdy;  // κyy = +∂θx/∂y
            Bb_uu(2, 3*i + 1) = +dNdx;  // κxy: +∂θx/∂x
            Bb_uu(2, 3*i + 2) = -dNdy;  //      -∂θy/∂y
        }

        // Bb_aa (3×4): contribución de Δθ_e a curvaturas
        // Δθ_e enriquece el campo θ:
        //   Δθx = -sin α_e · N_{e+5} · Δθ_e
        //   Δθy = +cos α_e · N_{e+5} · Δθ_e
        // Curvaturas inducidas:
        //   κxx = -∂θy/∂x = -cos α_e · ∂N_{e+5}/∂x · Δθ_e
        //   κyy = +∂θx/∂y = -sin α_e · ∂N_{e+5}/∂y · Δθ_e
        //   κxy = +∂θx/∂x − ∂θy/∂y
        //        = -sin α_e · ∂N_{e+5}/∂x · Δθ_e − cos α_e · ∂N_{e+5}/∂y · Δθ_e
        double Nb[4], dNbdxi_a[4], dNbdeta_a[4];
        bubbleShapes(xi, eta, Nb, dNbdxi_a, dNbdeta_a);

        Bb_aa = Eigen::MatrixXd::Zero(3, 4);
        for (int e = 0; e < 4; e++) {
            double dNbdx_e = Jinv[0][0] * dNbdxi_a[e] + Jinv[0][1] * dNbdeta_a[e];
            double dNbdy_e = Jinv[1][0] * dNbdxi_a[e] + Jinv[1][1] * dNbdeta_a[e];
            double sa = cy_e[e];   // sin α_e
            double ca = cx_e[e];   // cos α_e
            Bb_aa(0, e) = -ca * dNbdx_e;                    // κxx
            Bb_aa(1, e) = -sa * dNbdy_e;                    // κyy
            Bb_aa(2, e) = -sa * dNbdx_e - ca * dNbdy_e;     // κxy
        }
    };

    // ── Pass 1: media de área de Bb_aa para corrección patch test (Eq. 8.17) ──
    Eigen::MatrixXd Bb_aa_avg = Eigen::MatrixXd::Zero(3, 4);
    double area = 0.0;
    {
        for (int gp = 0; gp < 4; gp++) {
            double xi  = gp2x2[gp][0];
            double eta = gp2x2[gp][1];
            Eigen::MatrixXd Bb_uu_gp, Bb_aa_gp;
            double detJ;
            computeBb(xi, eta, Bb_uu_gp, Bb_aa_gp, detJ);
            double w = std::abs(detJ);
            Bb_aa_avg += Bb_aa_gp * w;
            area += w;
        }
        if (area > 1e-15) Bb_aa_avg /= area;
    }

    // ── B_γedge (4×16): cortantes tangenciales en los 4 puntos medios de lado
    // Wilson Eq. 8.6:
    //   γ_e = (1/L_e)(w_j − w_i) + (1/2)(θ_n_i + θ_n_j) + (2/3)·Δθ_e
    //   donde θ_n = −sin α_e · θx + cos α_e · θy (perpendicular en plano)
    // DOF layout: cols 0..11 = [w0,θx0,θy0, w1,θx1,θy1, w2,θx2,θy2, w3,θx3,θy3]
    //             cols 12..15 = [Δθ_0, Δθ_1, Δθ_2, Δθ_3]
    Eigen::MatrixXd B_gamma_edge = Eigen::MatrixXd::Zero(4, 16);
    for (int e = 0; e < 4; e++) {
        int i = edge_node_i[e], j = edge_node_j[e];
        double sa = cy_e[e];   // sin α_e
        double ca = cx_e[e];   // cos α_e
        // (w_j − w_i) / L_e
        B_gamma_edge(e, 3*j + 0) += +1.0 / L_e[e];
        B_gamma_edge(e, 3*i + 0) += -1.0 / L_e[e];
        // (1/2)(θ_n_i + θ_n_j) donde θ_n = -sa·θx + ca·θy
        B_gamma_edge(e, 3*i + 1) += -0.5 * sa;  // θx_i
        B_gamma_edge(e, 3*i + 2) += +0.5 * ca;  // θy_i
        B_gamma_edge(e, 3*j + 1) += -0.5 * sa;  // θx_j
        B_gamma_edge(e, 3*j + 2) += +0.5 * ca;  // θy_j
        // (2/3)·Δθ_e
        B_gamma_edge(e, 12 + e) += 2.0 / 3.0;
    }

    // ── B_γcorner (8×16): (γxz, γyz) en cada esquina via Wilson Eq. 8.9 ──
    // En esquina i:
    //   - Lado saliente: edge_out = i, tangente (cx_i, cy_i)
    //   - Lado entrante: edge_in = (i+3)%4, tangente "saliendo de i" = (-cx_{i-1}, -cy_{i-1})
    //   Sistema 2×2:
    //     [cx_out  cy_out ] [γxz]   [γ_out_at_mid          ]
    //     [-cx_in  -cy_in ] [γyz] = [-γ_in_at_mid (sign flip)]
    //   det = cx_out·(-cy_in) − cy_out·(-cx_in) = cx_in·cy_out − cx_out·cy_in
    Eigen::MatrixXd B_gamma_corner = Eigen::MatrixXd::Zero(8, 16);
    for (int i = 0; i < 4; i++) {
        int edge_out = i;
        int edge_in  = (i + 3) % 4;
        double co_x = cx_e[edge_out],   co_y = cy_e[edge_out];
        double ci_x = -cx_e[edge_in],   ci_y = -cy_e[edge_in];
        double det = co_x * ci_y - co_y * ci_x;
        if (std::abs(det) < 1e-15) det = (det >= 0 ? 1e-15 : -1e-15);
        double inv_det = 1.0 / det;
        // Inversa 2×2: [ci_y -co_y; -ci_x co_x] / det
        // Sistema RHS: [γ_out; -γ_in] (sign flip en γ_in)
        // → γxz = (ci_y · γ_out + (-co_y)·(-γ_in)) / det = (ci_y·γ_out + co_y·γ_in) / det
        //   γyz = (-ci_x·γ_out + co_x·(-γ_in)) / det     = (-ci_x·γ_out - co_x·γ_in) / det
        B_gamma_corner.row(2*i)     = ( ci_y * B_gamma_edge.row(edge_out) + co_y * B_gamma_edge.row(edge_in)) * inv_det;
        B_gamma_corner.row(2*i + 1) = (-ci_x * B_gamma_edge.row(edge_out) - co_x * B_gamma_edge.row(edge_in)) * inv_det;
    }

    // ── Pass 2: ensamblar K_full = [K_uu (12×12) | K_uα (12×4); K_αu | K_αα (4×4)] ──
    Eigen::MatrixXd K_full = Eigen::MatrixXd::Zero(16, 16);

    // Bending: B_b_full (3×16) = [Bb_uu (3×12) | Bb_aa−avg (3×4)]
    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];
        Eigen::MatrixXd Bb_uu, Bb_aa;
        double detJ;
        computeBb(xi, eta, Bb_uu, Bb_aa, detJ);
        Bb_aa = Bb_aa - Bb_aa_avg;  // patch test correction Eq. 8.17

        Eigen::MatrixXd B_b_full(3, 16);
        B_b_full.block(0,  0, 3, 12) = Bb_uu;
        B_b_full.block(0, 12, 3,  4) = Bb_aa;

        K_full += B_b_full.transpose() * Db * B_b_full * std::abs(detJ);
    }

    // Shear: B_s (2×16) = bilinear interpolation N_i · B_γcorner.row(2*i, 2*i+1)
    for (int gp = 0; gp < 4; gp++) {
        double xi  = gp2x2[gp][0];
        double eta = gp2x2[gp][1];
        double N_gp[4], dN_gp_dxi[4], dN_gp_deta[4];
        shapeFunctionsQ4(xi, eta, N_gp, dN_gp_dxi, dN_gp_deta);
        double Jinv_gp[2][2];
        double detJ_gp = jacobian2D(x, y, dN_gp_dxi, dN_gp_deta, Jinv_gp);

        Eigen::MatrixXd B_s = Eigen::MatrixXd::Zero(2, 16);
        for (int i = 0; i < 4; i++) {
            B_s.row(0) += N_gp[i] * B_gamma_corner.row(2*i);
            B_s.row(1) += N_gp[i] * B_gamma_corner.row(2*i + 1);
        }
        K_full += B_s.transpose() * Ds * B_s * std::abs(detJ_gp);
    }

    // ── Condensación estática 16×16 → 12×12 (Wilson Eq. 6.11 / §8.6) ──
    Eigen::MatrixXd Kuu = K_full.block( 0,  0, 12, 12);
    Eigen::MatrixXd Kua = K_full.block( 0, 12, 12,  4);
    Eigen::MatrixXd Kaa = K_full.block(12, 12,  4,  4);
    Eigen::MatrixXd KaaInv;
    if (std::abs(Kaa.determinant()) > 1e-20) {
        KaaInv = Kaa.inverse();
    } else {
        std::cerr << "Warning: Kaa singular en getBendingK_DSE_FULL, fallback a Kuu." << std::endl;
        return Kuu;
    }
    Eigen::MatrixXd Kb = Kuu - Kua * KaaInv * Kua.transpose();
    return Kb;
}

// ─── FORMULATION SWITCH ─────────────────────────────────────────────────
// 0 = MITC4 + Wilson α-modes (default, current Hekatan, Variant A)
// 1 = DSE Bathe-Wilson híbrido (DSE-bending + MITC4-shear, Variant B)
// 2 = DSE Wilson COMPLETO (Cap 8 textbook, edge-discrete shear, Variant C)
// Cambiar y recompilar para evaluar la formulación deseada.

// ============================================================================
// SHELL-THICK DE CSI (ETABS / SAP2000) — extraido del binario (2026-09-02)
// ----------------------------------------------------------------------------
// Verificado a ~1e-12 % contra la K MEDIDA de ETABS/SAP en ~140 celdas (cuadrado,
// rectangulo, 27 trapecios, cuadrilateros irregulares, barridos de t/nu/L y
// modificadores). Bitacora: registros/2026-09-02_binario_drilling_shellthick.md
// Espejo en Python: hekatan-struct-py/.../elements/plate_csi_thick.py
//
//   Giros con 9 funciones (4 bilineales + 4 jerarquicas de lado + burbuja), DOS
//   componentes cada una; w bilineal. 22 gdl: 12 nodales [w, thx, thy] + 10
//   internos (8 de lado + 2 de burbuja) que se condensan.
//   Curvaturas  : kx = thy,x   ky = -thx,y   kxy = thy,y - thx,x
//   Cortante    : los 4 cortantes de LADO de Wilson (cap.8, ec.8.7), con las
//                 jerarquicas entrando con 2/3; interpolados en COVARIANTES tipo
//                 MITC con la parte lineal SIMETRIZADA (m = (b+d)/2); fisico = J^-1 g
//   Penalizacion: 1000*(D11+D22+D33) * INT (thx,x + thy,y)^2 dA  (divergencia)
//   Cuadratura  : ITW 1991 de 8 puntos (9/49 y 40/49). B-barra en las 10 internas.
//   Condensacion: Gauss saltando pivotes nulos (asi trata los modificadores a 0).
// Convencion de giros: [w, thx_global, thy_global] por nudo, mano derecha (la
// misma que getBendingK; alli las curvaturas llevan el signo opuesto, K identica).
// ============================================================================
static Eigen::MatrixXd getBendingK_CSI(const double x[4], const double y[4],
                                        double E, double nu, double t,
                                        const double *mod = nullptr)
{
    const double D0 = E * t * t * t / (12.0 * (1.0 - nu * nu));
    Eigen::Matrix3d Db;
    Db << D0, D0 * nu, 0,
          D0 * nu, D0, 0,
          0, 0, D0 * (1.0 - nu) / 2.0;
    Eigen::Matrix2d Ds = Eigen::Matrix2d::Identity() * ((5.0 / 6.0) * E * t / (2.0 * (1.0 + nu)));
    if (mod) {
        const double sb[3] = { std::sqrt(std::max(0.0, mod[3])), std::sqrt(std::max(0.0, mod[4])), std::sqrt(std::max(0.0, mod[5])) };
        const double ss[2] = { std::sqrt(std::max(0.0, mod[6])), std::sqrt(std::max(0.0, mod[7])) };
        for (int i = 0; i < 3; i++) for (int j = 0; j < 3; j++) Db(i, j) *= sb[i] * sb[j];
        for (int i = 0; i < 2; i++) for (int j = 0; j < 2; j++) Ds(i, j) *= ss[i] * ss[j];
    }
    Eigen::Matrix<double, 5, 5> D = Eigen::Matrix<double, 5, 5>::Zero();
    D.block<3, 3>(0, 0) = Db;
    D.block<2, 2>(3, 3) = Ds;
    const double Dsum = Db.trace();
    const double PENAL = 1000.0;

    // geometria de los lados: k va del nudo k al k+1
    double ca[4], sa[4], LL[4];
    double Lmax = 0.0, Lmin = 1e300;
    for (int k = 0; k < 4; k++) {
        const int j = (k + 1) % 4;
        const double dx = x[j] - x[k], dy = y[j] - y[k], L = std::hypot(dx, dy);
        LL[k] = L; Lmax = std::max(Lmax, L); Lmin = std::min(Lmin, L);
        ca[k] = (L > 0) ? dx / L : 1.0; sa[k] = (L > 0) ? dy / L : 0.0;
    }
    // Un Q4 COLAPSADO (lado nulo) no es un elemento: la formulacion divide por
    // L del lado. Se cae al camino viejo, que topa el jacobiano y no revienta.
    if (Lmin <= 1e-12 * Lmax)
        return getBendingK(x, y, E, nu, t, mod);
    // cortante de cada lado (8.7) como fila sobre los 22 gdl
    Eigen::Matrix<double, 4, 22> Bl = Eigen::Matrix<double, 4, 22>::Zero();
    for (int k = 0; k < 4; k++) {
        const int j = (k + 1) % 4;
        Bl(k, 3 * j) += 1.0 / LL[k];       Bl(k, 3 * k) -= 1.0 / LL[k];
        Bl(k, 3 * k + 1) -= sa[k] / 2.0;   Bl(k, 3 * j + 1) -= sa[k] / 2.0;
        Bl(k, 3 * k + 2) += ca[k] / 2.0;   Bl(k, 3 * j + 2) += ca[k] / 2.0;
        Bl(k, 12 + 2 * k) -= 2.0 / 3.0 * sa[k];
        Bl(k, 13 + 2 * k) += 2.0 / 3.0 * ca[k];
    }
    const Eigen::Matrix<double, 1, 22> gb =  Bl.row(0) * (LL[0] / 2.0);
    const Eigen::Matrix<double, 1, 22> gt = -Bl.row(2) * (LL[2] / 2.0);
    const Eigen::Matrix<double, 1, 22> gR =  Bl.row(1) * (LL[1] / 2.0);
    const Eigen::Matrix<double, 1, 22> gL = -Bl.row(3) * (LL[3] / 2.0);
    const Eigen::Matrix<double, 1, 22> A0 = (gb + gt) / 2.0, bb = (gt - gb) / 2.0;
    const Eigen::Matrix<double, 1, 22> C0 = (gL + gR) / 2.0, dd = (gR - gL) / 2.0;
    const Eigen::Matrix<double, 1, 22> mm = (bb + dd) / 2.0;

    const double qA = std::sqrt(7.0 / 9.0), qB = std::sqrt(7.0 / 15.0);
    const double qp[8][2] = { {-qA, -qA}, {qA, -qA}, {qA, qA}, {-qA, qA}, {0, -qB}, {qB, 0}, {0, qB}, {-qB, 0} };
    const double qw[8] = { 9.0 / 49, 9.0 / 49, 9.0 / 49, 9.0 / 49, 40.0 / 49, 40.0 / 49, 40.0 / 49, 40.0 / 49 };

    Eigen::Matrix<double, 5, 22> B[8];
    Eigen::Matrix<double, 1, 22> v[8];
    double w[8];
    double wsum = 0.0;
    for (int p = 0; p < 8; p++) {
        const double r = qp[p][0], s = qp[p][1];
        const double dN4r[4] = { -(1 - s) / 4, (1 - s) / 4, (1 + s) / 4, -(1 + s) / 4 };
        const double dN4s[4] = { -(1 - r) / 4, -(1 + r) / 4, (1 + r) / 4, (1 - r) / 4 };
        const double dNhr[4] = { -r * (1 - s), (1 - s * s) / 2, -r * (1 + s), -(1 - s * s) / 2 };
        const double dNhs[4] = { -(1 - r * r) / 2, -s * (1 + r), (1 - r * r) / 2, -s * (1 - r) };
        Eigen::Matrix2d J;
        J << dN4r[0]*x[0]+dN4r[1]*x[1]+dN4r[2]*x[2]+dN4r[3]*x[3], dN4r[0]*y[0]+dN4r[1]*y[1]+dN4r[2]*y[2]+dN4r[3]*y[3],
             dN4s[0]*x[0]+dN4s[1]*x[1]+dN4s[2]*x[2]+dN4s[3]*x[3], dN4s[0]*y[0]+dN4s[1]*y[1]+dN4s[2]*y[2]+dN4s[3]*y[3];
        const Eigen::Matrix2d Ji = J.inverse();
        const double dJ = std::abs(J.determinant());
        B[p].setZero(); v[p].setZero();
        auto giro = [&](int col, double a, double b, double fx, double fy) {
            B[p](0, col) += b * fx;
            B[p](1, col) -= a * fy;
            B[p](2, col) += b * fy - a * fx;
            v[p](col)    += a * fx + b * fy;      // divergencia del campo de giros
        };
        for (int i = 0; i < 4; i++) {
            const double gx = Ji(0, 0) * dN4r[i] + Ji(0, 1) * dN4s[i];
            const double gy = Ji(1, 0) * dN4r[i] + Ji(1, 1) * dN4s[i];
            giro(3 * i + 1, 1, 0, gx, gy);
            giro(3 * i + 2, 0, 1, gx, gy);
        }
        for (int k = 0; k < 4; k++) {
            const double hx = Ji(0, 0) * dNhr[k] + Ji(0, 1) * dNhs[k];
            const double hy = Ji(1, 0) * dNhr[k] + Ji(1, 1) * dNhs[k];
            giro(12 + 2 * k, 1, 0, hx, hy);
            giro(13 + 2 * k, 0, 1, hx, hy);
        }
        {
            const double d9r = -2 * r * (1 - s * s), d9s = -2 * s * (1 - r * r);
            const double g9x = Ji(0, 0) * d9r + Ji(0, 1) * d9s, g9y = Ji(1, 0) * d9r + Ji(1, 1) * d9s;
            giro(20, 1, 0, g9x, g9y);
            giro(21, 0, 1, g9x, g9y);
        }
        // cortante covariante simetrizado -> fisico
        Eigen::Matrix<double, 2, 22> gcov;
        gcov.row(0) = A0 + mm * s;
        gcov.row(1) = C0 + mm * r;
        B[p].block<2, 22>(3, 0) = Ji * gcov;
        w[p] = qw[p] * dJ; wsum += w[p];
    }
    // B-barra: media pesada de las curvaturas de las 10 columnas internas
    Eigen::Matrix<double, 3, 10> media = Eigen::Matrix<double, 3, 10>::Zero();
    for (int p = 0; p < 8; p++) media += B[p].block<3, 10>(0, 12) * w[p];
    media /= wsum;
    Eigen::Matrix<double, 22, 22> K22 = Eigen::Matrix<double, 22, 22>::Zero();
    for (int p = 0; p < 8; p++) {
        B[p].block<3, 10>(0, 12) -= media;
        K22 += (B[p].transpose() * D * B[p] + PENAL * Dsum * v[p].transpose() * v[p]) * w[p];
    }
    // condensacion de los 10 internos: Gauss, saltando pivotes nulos
    const double esc = K22.cwiseAbs().maxCoeff();
    for (int i = 12; i < 22; i++) {
        const double piv = K22(i, i);
        if (std::abs(piv) <= 1e-14 * esc) continue;
        const Eigen::Matrix<double, 1, 22> fila = K22.row(i);
        const Eigen::Matrix<double, 22, 1> col = K22.col(i);
        K22 -= (col * fila) / piv;
        K22.row(i).setZero(); K22.col(i).setZero();
    }
    return K22.block<12, 12>(0, 0);
}

#ifndef HK_BENDING_FORMULATION
#define HK_BENDING_FORMULATION 0
#endif

// ─── Public: Combined Shell Q4 stiffness 24×24 ─────────────────────────────
Eigen::MatrixXd getLocalStiffnessMatrixShellQ4(
    const std::vector<Node> &nodes,
    const ElementInputs &elementInputs,
    int index)
{
    double E  = getMapVal(elementInputs.elasticities, index, 0.0);
    double nu = getMapVal(elementInputs.poissonsRatios, index, 0.0);
    double t  = getMapVal(elementInputs.thicknesses, index, 0.0);

    if (E < 1e-12 || t < 1e-12) {
        std::cerr << "Warning: ShellQ4 element " << index
                  << " has E=" << E << " t=" << t
                  << ". Returning zero 24x24." << std::endl;
        return Eigen::MatrixXd::Zero(24, 24);
    }

    // Project global 3D node coordinates to local 2D shell frame
    // This is critical for non-horizontal shells (e.g., vertical walls in XZ plane)
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
    localX = localY.cross(localZ);
    localX.normalize();

    Eigen::Vector3d center = 0.25 * (p0 + p1 + p2 + p3);
    double x[4], y[4];
    Eigen::Vector3d pts[4] = {p0, p1, p2, p3};
    for (int i = 0; i < 4; i++) {
        Eigen::Vector3d d = pts[i] - center;
        x[i] = d.dot(localX);
        y[i] = d.dot(localY);
    }

    // ── ETABS-style Property Modifiers (CSI Manual §10.7) ──
    //   Membrane modifier = 0 → Plate puro (sin rigidez in-plane)
    //   Bending modifier  = 0 → Membrane puro (sin rigidez out-of-plane)
    //   Por defecto ambos = 1.0 → Shell completo
    double mFactor = getMapVal(elementInputs.membraneModifiers, index, 1.0);
    double bFactor = getMapVal(elementInputs.bendingModifiers, index, 1.0);
    // Si hay modificadores DIRECCIONALES para este elemento, mandan ellos y
    // los escalares quedan en 1.0 (si no, se multiplicaria dos veces).
    const double *dmod = nullptr;
    auto itMod = elementInputs.shellModifiers.find(index);
    if (itMod != elementInputs.shellModifiers.end() && itMod->second.size() >= 8) {
        dmod = itMod->second.data();
        mFactor = 1.0;
        bFactor = 1.0;
    }

    // .Flexion practicamente nula? Entonces NO se ensambla, en vez de armarla
    // y multiplicarla por cero. Multiplicando por cero la matriz Db queda nula,
    // la de modos incompatibles (Kaa) sale singular y el elemento se cae a un
    // Q4 estandar con un aviso — o sea que NO se comporta como membrana, que
    // era justo lo que se le pedia. ETABS hace esto: un deck es ShellType
    // Membrane y la flexion no existe, no vale cero.
    bool sinFlexion = false;
    if (dmod) {
        sinFlexion = (std::fabs(dmod[3]) < 1e-9 && std::fabs(dmod[4]) < 1e-9 &&
                      std::fabs(dmod[5]) < 1e-9);
    } else {
        sinFlexion = (std::fabs(bFactor) < 1e-9);
    }

    // ── que membrana se arma ─────────────────────────────────────────────
    //   3 = ITW 1990 (membrana + drilling JUNTOS, 12x12)   [DEFECTO]
    //   2 = Q4 con modos incompatibles + penalizacion Hughes-Brezzi aparte
    //   1 / 0 = legacy (muelle debil / penalizacion 1e-6)
    // Se lee aqui arriba porque el 3 NO usa getMembraneK: sustituye la
    // membrana entera, no le pega un termino encima.
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
    int drillingType = getMapVal(elementInputs.drillingTypes, index, 12);   // 12 = la membrana de CSI (2-sep-2026)
    // Con drillingType 3 este numero es gamma/mu del paper (defecto 0.4, que es
    // lo medido de ETABS). Con el 2 es el alpha de Hughes-Brezzi (defecto 0.05).
    double drillScale = getMapVal(elementInputs.drillingPenaltyScales, index,
                                  (drillingType >= 3 && drillingType <= 12) ? 0.4 : 0.05);
    // ⚠️ el 11 (receta de Wilson) TAMBIEN es ITW: si el rango se queda en 10 se
    // cae a la membrana vieja y el tipo no hace nada — daba el mismo numero que
    // el 3 y parecia que K0 no servia.
    const bool usaITW = (drillingType >= 3 && drillingType <= 12);
    // 3 = ITW con Gauss 3x3, que es lo que pide el paper   [DEFECTO]
    // 4 = ITW con Gauss 2x2 (integracion reducida)  -- NO USAR, ver abajo
    // 5 = ITW 3x3 con la burbuja a la Taylor (J0 del centro)
    //
    // El 2x2 parecia la solucion: en el hemisferio pinzado de MacNeal-Harder
    // pasaba de -37.4 % a -4.9 % y el patch test seguia exacto. Pero CONTANDO
    // LOS MODOS NULOS del elemento aislado salen CUATRO en vez de tres: hay un
    // mecanismo. O sea que no desbloqueaba, se rompia. El paper ya lo dice: hay
    // que integrar K completo y sumarle P de un punto, y asi "the spurious zero
    // energy modes are prevented; and no additional devices are needed".
    //
    //     gauss 2x2  ->  modos nulos = 4   (deberian ser 3)
    //     gauss 3x3  ->  modos nulos = 3   OK
    //
    // Tampoco valen los 4 modos incompatibles de Wilson en lugar de la burbuja
    // (o ademas de ella): con ellos el patch test de orden superior da un giro
    // de -0.98 en vez de 0.6 y el elemento se queda con 5 modos nulos.
    // 6 = COMO EL DE CSI, deducido del binario: Allman + Gauss 2x2 + rango uno
    //     de Wilson + estabilizacion del reloj de arena. Es el unico que cumple
    //     a la vez las tres cosas que cumple ETABS:
    //         3 modos nulos · patch test EXACTO (1.500000/0.600000) · Gauss 2x2
    //
    //     ⚠️ AQUI DECIA que el binario lo respalda, porque CsiGo2.dll carga
    //     1/sqrt(3) ocho veces y nunca sqrt(3/5). RETIRADO el 19-ago-2026: la
    //     funcion donde viven esas cargas tiene TRES coordenadas naturales y
    //     escribe 24 huecos de funciones de forma — es un HEXAEDRO de 8 nudos,
    //     no el shell. Su 1/sqrt(3) es Gauss 2x2x2 del solido y su 0.125 es el
    //     1/8 de N = 1/8 (1+-r)(1+-s)(1+-t), no el l/8 de Allman. La zona del
    //     shell en el binario esta todavia SIN localizar.
    //     Lo que sigue en pie es lo medido contra los bancos.
    //
    //     Medido contra los bancos:
    //                        patch    cantilever  Cook   drilling-dof  hemisferio
    //       HB (el viejo)   -1.7/-6.3%   0.18%    0.46%     11.46%       -3.6%
    //       ITW 3x3 (hoy)    EXACTO      0.13%    0.96%      5.45%      -37.4%
    //       CSI-like 2x2     EXACTO      0.05%    0.83%      7.14%       -5.2%
    //
    //     ⚖️ NO es defecto todavia porque hay un COMPROMISO sin decidir: el 2x2
    //     arregla el hemisferio (de -37 % a -5 %, y en 16x16 de -4.2 % a -0.85 %)
    //     pero empeora el AXIL de las barras del mezanine (de 3.5 % a 12.5 % en
    //     el peor, aunque los momentos siguen al 0.01 %). Cambiar el defecto es
    //     una decision de producto: cascara curva contra losa con vigas.
    // 11 = LA RECETA DE WILSON (cap. 9 de su libro, que dice explicitamente que
    //      es «el elemento que se utiliza en la actualidad en SAP2000»):
    //      integracion de CUATRO PUNTOS (2x2) + una matriz de RANGO UNO K0 que
    //      elimina el unico modo de energia cero que deja el 2x2.
    //          (9.11) theta_0 = 1/2 (du_x/dy - du_y/dx) = b0 . u
    //          (9.12) theta_barra = theta_0 - SUM Ni(0,0) theta_i
    //          (9.13) K0 = k0 * Vol * b0_barra^T b0_barra   (UN punto)
    //          (9.14) k0 = 0.025 * G
    //      Ya se habia medido que el 2x2 solo desbloquea el hemisferio
    //      (-37 % -> -5 %) pero deja modos nulos, y se descarto por mecanismo:
    //      faltaba K0.
    // 12 = LA MEMBRANA DE CSI, extraida del binario (2-sep-2026): ITW con burbuja,
    //      Gauss 2x2, proyeccion FEAP del drilling, penalizacion gamma=0.4*mu en el
    //      centro y el reloj de arena del theta_z con 5e-5*G*t*A (= khg 2e-4/4).
    //      Contra la 12x12 MEDIDA de ETABS: 1e-13 % en las 9 geometrias
    //      (cuadrados con nu, rectangulos, paralelogramo, trapecio). Es el defecto.
    const int  ngITW  = (drillingType == 4 || drillingType == 6
                         || drillingType == 11 || drillingType == 12) ? 2 : 3;
    const bool k0Wilson = (drillingType == 11);
    const double khgITW = (drillingType == 6 || drillingType == 12) ? 2.0e-4 : 0.0;
    const bool taylorITW = (drillingType == 5);
    //  7 = la regla de OCHO puntos.
    //      ⚠️ Ponia «ITW 1991, ec. (30), el paper que cita el manual de CSI» y
    //      eso NO se sostiene: el CANM 7:1-9 llega solo a la ec. (28). La regla
    //      de 8 puntos del IJNME 31 es de la penalizacion de un SOLIDO (y la de
    //      14 puntos, de Irons, para BRICKS) — no del shell. Ver la nota larga
    //      en `getMembraneITW`. Se usa porque esta MEDIDA, no por atribucion. `wAlpha > 0` la activa y
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
    //  8 = la via de FEAP/Taylor: Gauss 3x3 + PROYECCION del drilling. Es la
    //      que reproduce la matriz 12x12 medida de ETABS al 1.42 % (contra el
    //      15.97 % del tipo 3). Ver el comentario de `proyDrill` mas abajo.
    const bool proyITW = (drillingType == 8 || drillingType == 9 || drillingType == 10 || drillingType == 12);
    // 10 = proyeccion + INTEGRACION SELECTIVA del volumetrico a 2x2.
    //      Baja la matriz de ETABS de 1.42 % a 0.878 % sin tocar el patch
    //      test (1.500000/0.600000) ni los 3 modos nulos.
    const int sriITW = (drillingType == 10) ? 2 : 0;

    Eigen::MatrixXd Km   = usaITW ? Eigen::MatrixXd::Zero(8, 8)
                                  : getMembraneK(x, y, E, nu, t, dmod);   // 8×8
    Eigen::MatrixXd Kitw = usaITW ? getMembraneITW(x, y, E, nu, t, dmod, drillScale, ngITW, taylorITW, khgITW, waITW, proyITW, sriITW, k0Wilson)
                                  : Eigen::MatrixXd::Zero(12, 12);        // 12×12
    #if HK_BENDING_FORMULATION == 2
        Eigen::MatrixXd Kb = getBendingK_DSE_FULL(x, y, E, nu, t);  // 12×12 (Wilson DSE Cap 8 completo, Variant C)
    #elif HK_BENDING_FORMULATION == 1
        Eigen::MatrixXd Kb = getBendingK_DSE(x, y, E, nu, t);       // 12×12 (DSE-bending + MITC4-shear, Variant B)
    #elif HK_BENDING_FORMULATION == 3
        Eigen::MatrixXd Kb = sinFlexion
        ? Eigen::MatrixXd::Zero(12, 12)
        : getBendingK(x, y, E, nu, t, dmod);     // 12×12 (MITC4 + Wilson α, Variant A: lo de antes)
    #else
        // 0 (defecto): el Shell-Thick de CSI extraido del binario (2026-09-02)
        Eigen::MatrixXd Kb = sinFlexion
        ? Eigen::MatrixXd::Zero(12, 12)
        : getBendingK_CSI(x, y, E, nu, t, dmod);
    #endif
    Km   *= mFactor;
    Kitw *= mFactor;
    Kb   *= bFactor;

    // Assemble into 24×24
    // DOFs per node: [u, v, w, θx, θy, θz] = indices [0,1,2,3,4,5]
    Eigen::MatrixXd K = Eigen::MatrixXd::Zero(24, 24);

    // Membrane: u=6i+0, v=6i+1 ← Km indices 2i, 2i+1
    // Con ITW no hay "membrana" y "drilling" por separado: la 12×12 trae
    // [u, v, theta_z] por nudo y se coloca de una vez.
    if (usaITW) {
        const int gdl[3] = {0, 1, 5};          // u, v, theta_z dentro del nudo
        for (int ni = 0; ni < 4; ni++)
            for (int nj = 0; nj < 4; nj++)
                for (int di = 0; di < 3; di++)
                    for (int dj = 0; dj < 3; dj++)
                        K(ni*6 + gdl[di], nj*6 + gdl[dj]) = Kitw(ni*3 + di, nj*3 + dj);
    } else {
    for (int ni = 0; ni < 4; ni++) {
        for (int nj = 0; nj < 4; nj++) {
            for (int di = 0; di < 2; di++) {
                for (int dj = 0; dj < 2; dj++) {
                    K(ni*6 + di, nj*6 + dj) = Km(ni*2 + di, nj*2 + dj);
                }
            }
        }
    }
    }

    // Bending: w=6i+2, θx=6i+3, θy=6i+4 ← Kb indices 3i, 3i+1, 3i+2
    for (int ni = 0; ni < 4; ni++) {
        for (int nj = 0; nj < 4; nj++) {
            for (int di = 0; di < 3; di++) {
                for (int dj = 0; dj < 3; dj++) {
                    K(ni*6 + 2 + di, nj*6 + 2 + dj) = Kb(ni*3 + di, nj*3 + dj);
                }
            }
        }
    }

    // ── Drilling DOF (θz=6i+5) — dispatcher según drillingTypes ────────────
    //   0 = penalty 1e-6 legacy (drilling efectivamente desacoplado)
    //   1 = PyNite weak spring (k = min(diagRot)/1000)
    //   2 = Hughes-Brezzi 1989 / Ibrahimbegovic-Taylor-Wilson 1990  [DEFAULT]
    // (drillingType y drillScale ya se leyeron arriba)
    // Por defecto 0.05, NO 1.0.
    //
    // El penalty vale gamma = G*t*scale. Con scale = 1.0 el drilling deja de
    // ser un truco para quitar la singularidad de theta_z y se convierte en
    // rigidez de verdad, que BLOQUEA la membrana. Medido en el muro en
    // voladizo de 4 cascaras contra la viga de Timoshenko:
    //
    //     scale 1.00 (lo de antes) -> 5.3728 mm  -11.63 %
    //     scale 0.49 (~el de ETABS)-> 5.6503 mm   -7.07 %
    //     scale 0.10               -> 5.8827 mm   -3.24 %
    //     scale 0.05               -> ver test membrana-convergencia
    //     sin drilling             -> 5.9455 mm   -2.21 %
    //
    // MYSTRAN (CQUAD4, misma malla) da 5.7164 mm, -5.98 %. O sea que con
    // scale 1.0 eramos el DOBLE de rigidos que un solver de referencia, y el
    // culpable no era el elemento -que lleva modos incompatibles de Wilson-
    // sino esta penalizacion.
    //
    // 0.05 deja el theta_z sujeto (que es para lo que esta) sin contaminar el
    // resultado: queda a menos de 0.2 % del elemento sin drilling.
    if (usaITW) {
        // ya esta dentro de Kitw: no hay nada que pegar encima.
    } else if (drillingType == 2) {
        // Hughes-Brezzi: penalty acoplado al residual θz - 0.5(∂v/∂x - ∂u/∂y)
        // Escalar por mFactor para consistencia con membrana (si membrane=0 → drill=0)
        K += mFactor * getDrillingK_HughesBrezzi(x, y, E, nu, t, drillScale);
    } else if (drillingType == 1) {
        // PyNite-style weak spring sobre el menor θ diagonal del bending K
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
        // 0 = legacy penalty 1e-6 (compatibilidad hacia atrás)
        double drill = 0;
        for (int i = 0; i < 8; i++) drill += std::abs(Km(i, i));
        drill *= 1e-6 / 8.0;
        if (drill < 1e-15) drill = E * t * 1e-6 * std::max(mFactor, 1e-6);
        for (int i = 0; i < 4; i++) K(i*6 + 5, i*6 + 5) = drill;
    }

    return K;
}

// ─── Transformation matrix for Q4 shell: 24×24 ─────────────────────────────
Eigen::MatrixXd getTransformationMatrixShellQ4(
    const Node &n0, const Node &n1, const Node &n2, const Node &n3)
{
    // Local X: from node 0 toward node 1 direction (bottom edge average)
    Eigen::Vector3d v01(n1[0]-n0[0], n1[1]-n0[1], n1[2]-n0[2]);
    Eigen::Vector3d v32(n2[0]-n3[0], n2[1]-n3[1], n2[2]-n3[2]);
    Eigen::Vector3d localX = (v01 + v32);
    double lenX = localX.norm();
    if (lenX < 1e-12) {
        return Eigen::MatrixXd::Identity(24, 24);
    }
    localX /= lenX;

    // Normal from diagonals cross product
    Eigen::Vector3d d02(n2[0]-n0[0], n2[1]-n0[1], n2[2]-n0[2]);
    Eigen::Vector3d d13(n3[0]-n1[0], n3[1]-n1[1], n3[2]-n1[2]);
    Eigen::Vector3d localZ = d02.cross(d13);
    double lenZ = localZ.norm();
    if (lenZ < 1e-12) {
        return Eigen::MatrixXd::Identity(24, 24);
    }
    localZ /= lenZ;

    // Local Y = Z × X, then re-orthogonalize
    Eigen::Vector3d localY = localZ.cross(localX);
    localY.normalize();
    localX = localY.cross(localZ);
    localX.normalize();

    Eigen::Matrix3d R;
    R.row(0) = localX.transpose();
    R.row(1) = localY.transpose();
    R.row(2) = localZ.transpose();

    // 24×24 block-diagonal (4 nodes × 2 blocks of 3)
    Eigen::MatrixXd T = Eigen::MatrixXd::Zero(24, 24);
    for (int i = 0; i < 8; i++) {
        T.block<3,3>(i*3, i*3) = R;
    }

    return T;
}

// Para plate_q4 (plateQ4Solve): la placa de CSI a secas, sin modificadores.
Eigen::MatrixXd getBendingK_CSI_placa(const double x[4], const double y[4],
                                      double E, double nu, double t)
{
    return getBendingK_CSI(x, y, E, nu, t, nullptr);
}
