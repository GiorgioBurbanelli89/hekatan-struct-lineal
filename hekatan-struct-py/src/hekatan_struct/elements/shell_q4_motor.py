"""Shell Q4 del MOTOR — port fiel de `hekatan-fem/src/utils/shellQ4.ts`.

Tres piezas, y las tres importan. El Q4 "de libro" que habia en `shell.py` se
queda corto en las tres, y por eso salia demasiado rigido:

1. **Membrana con modos incompatibles de Wilson (Q6)** + condensacion estatica.
   Un Q4 bilineal puro sufre *shear locking en membrana*: cuando el paño
   flecta en su propio plano —que es lo que hace un MURO— sale rigidisimo,
   porque los cuatro nudos no pueden describir una curvatura. Los dos modos
   burbuja lo curan. Es la diferencia mas grande de las tres.

2. **Cortante MITC4** (Dvorkin-Bathe) en vez de integracion reducida. El
   cortante se interpola desde cuatro puntos de atadura en los bordes:
       γxz  desde A(0,−1) y C(0,+1),  interpolando con η
       γyz  desde B(−1,0) y D(+1,0),  interpolando con ξ
   La reducida tambien evita el locking, pero no da el mismo numero ni tiene
   el mismo rango de validez.

3. **Drilling de Hughes-Brezzi** (α = 0.5), que ACOPLA θz con u y v en vez de
   ser un muelle suelto en la diagonal.

Orden de GDL: [u, v, w, θx, θy, θz] × 4 nudos = 24.
"""
import math

import numpy as np

from .membrane_itw import (
    TIPO_DRILLING_DEFECTO,
    TIPOS_ITW,
    k_membrana_itw,
    kwargs_drilling,
)


# Parametros de la formulacion. Se dejan como variables de modulo para poder
# BARRERLOS contra ETABS: CSI no publica que valores usa, asi que se
# identifican midiendo (ver edificios-slab/calibrar_shell.py).
KAPPA = 5.0 / 6.0      # factor de correccion de cortante de Mindlin

# ⚠️ 0.05, NO 0.5 — el mismo que `shellQ4.cpp` (drillingPenaltyScales, 0.05).
# Los dos motores estaban en DESACUERDO por un factor 10 exacto: la celda de
# 1 m daba Rz = 1.309091e-05 en Python y 1.309091e-04 en el C++/WASM, mismos
# digitos y el exponente corrido.
#
# Manda el C++ porque su valor esta MEDIDO, no elegido: en el muro en voladizo
# de 4 cascaras, escala 1.00 daba -11.63 % contra la viga de Timoshenko, 0.49
# (~el de ETABS) -7.07 % y 0.05 se queda a menos de 0.2 % del elemento sin
# drilling. Contra ETABS por OAPI, la membrana cierra al +0.81 % con 0.05.
#
# Y la literatura lo respalda: Ibrahimbegovic-Taylor-Wilson (1990, IJNME 30:445)
# toman gamma = G y dicen que la formulacion es INSENSIBLE a gamma; trabajo
# posterior encuentra que gamma/G entre 1/10000 y 1 da soluciones MAS precisas.
#
# ⚠️ Y ojo: ETABS NO usa un escalar de Hughes-Brezzi. Medida su matriz theta_z
# 4x4 (edificios-slab / galpon-bodega-electoral/celda_drill4.py), sus
# autovalores son 1/10 (giro uniforme), 5/84 doble, y 1/5000 (modo alternado).
# Razones 1 : 0.595 : 0.002 contra las de Hughes-Brezzi 1 : 0.333 : 0.028. Es
# otra FORMA, no otro numero: ningun alpha reproduce los tres a la vez.
ALPHA_DRILL = 0.05     # Hughes-Brezzi (1989), escala calibrada

# gamma/mu del elemento ITW 1990 (el defecto del motor desde el 19-ago-2026).
# 0.4 no es del paper (que usa 1.0): es lo MEDIDO de ETABS reconstruyendo su
# matriz 12x12 de membrana por flexibilidad. Ver `membrane_itw.py`.
GAMMA_ITW = 0.4

# ⚠️ AQUI LOS DOS MOTORES DE HEKATAN NO DICEN LO MISMO.
#   `shellQ4.ts`  — modos incompatibles de Wilson SOLO en la membrana.
#   `shellQ4.cpp` — tambien en la FLEXION (Kuu/Kua/Kaa y condensacion).
# El .ts es el oraculo de los tests de paridad; el .cpp es el que se compila a
# WASM y da los numeros del producto. Sobre las losas de 1175 cascaras la
# diferencia es 0.06 % de mediana y 0.61 % de cola; en una losa 4x4 con carga
# puntual, 1.8 %. Se deja conmutable para poder medir contra los dos.
BENDING_MODOS_INCOMPATIBLES = True   # True = como el C++/WASM (el producto)

GP = 1.0 / np.sqrt(3.0)
GAUSS = [(-GP, -GP), (GP, -GP), (GP, GP), (-GP, GP)]

# Reparto de los tres bloques dentro de los 24 GDL
DOF_MEM = [0, 1, 6, 7, 12, 13, 18, 19]                       # u, v
DOF_BEN = [2, 3, 4, 8, 9, 10, 14, 15, 16, 20, 21, 22]        # w, θx, θy
DOF_DRI = [0, 1, 5, 6, 7, 11, 12, 13, 17, 18, 19, 23]        # u, v, θz


def _formas(xi, eta):
    N = 0.25 * np.array([(1 - xi) * (1 - eta), (1 + xi) * (1 - eta),
                         (1 + xi) * (1 + eta), (1 - xi) * (1 + eta)])
    dxi = 0.25 * np.array([-(1 - eta), (1 - eta), (1 + eta), -(1 + eta)])
    det = 0.25 * np.array([-(1 - xi), -(1 + xi), (1 + xi), (1 - xi)])
    return N, dxi, det


def _jac(dxi, det, x, y):
    """Jacobiano 2x2 y derivadas de las N respecto a x, y.

    ⚠️ El `dJ` se limita por abajo a 1e-15, igual que `jacobian2D` de
    `shellQ4.cpp`. No es cosmética: un TRIÁNGULO se escribe como Q4 colapsado
    (el 4º nudo repetido) y en el punto de atadura del borde colapsado el
    jacobiano es EXACTAMENTE cero. `riochico.heks` trae 8 así, y sin el tope
    Python lanzaba `ZeroDivisionError` mientras el motor resolvía los 1303
    nudos. El tope hay que copiarlo, no elegirlo: cambia el número.
    """
    J11 = float(dxi @ x); J12 = float(dxi @ y)
    J21 = float(det @ x); J22 = float(det @ y)
    dJ = J11 * J22 - J12 * J21
    if abs(dJ) < 1e-15:
        dJ = 1e-15
    inv = 1.0 / dJ
    dNdx = inv * (J22 * dxi - J12 * det)
    dNdy = inv * (-J21 * dxi + J11 * det)
    return dNdx, dNdy, dJ, (J11, J12, J21, J22)


def _k_membrana(x, y, E, nu, t, mod=None):
    """Q6: 8 GDL externos + 4 modos incompatibles, condensados.

    `mod` = los 8 modificadores direccionales del `shellmod` de CSI. De ellos
    la membrana usa F11, F22, F12 (los tres primeros). Se aplican sobre la
    matriz CONSTITUTIVA, que es donde los aplica ETABS, no sobre la K ya
    ensamblada: multiplicar la K entera es todo-o-nada y no deja dejar un paño
    rígido en 11 y blando en 22, que es justo lo que hace a un deck ser deck.
    El término cruzado va con la media geométrica para que D siga siendo
    simétrica y semidefinida positiva. Port de `getMembraneK` (shellQ4.cpp).
    """
    f = E * t / (1 - nu * nu)
    K = np.zeros((12, 12))
    _, d0xi, d0et = _formas(0.0, 0.0)
    _, _, dJ0, (J011, J012, J021, J022) = _jac(d0xi, d0et, x, y)
    inv0 = 1.0 / dJ0

    for xi, eta in GAUSS:
        _, dxi, det = _formas(xi, eta)
        dNdx, dNdy, dJ, _ = _jac(dxi, det, x, y)
        # Los modos burbuja se derivan con el jacobiano del CENTRO — la
        # correccion de Wilson. Con el jacobiano del punto de Gauss el
        # elemento deja de pasar el patch test en mallas distorsionadas.
        dM1dx = inv0 * J022 * (-2 * xi)
        dM1dy = inv0 * (-J021) * (-2 * xi)
        dM2dx = inv0 * (-J012) * (-2 * eta)
        dM2dy = inv0 * J011 * (-2 * eta)

        B = np.zeros((3, 12))
        for i in range(4):
            B[0, 2 * i] = dNdx[i]
            B[1, 2 * i + 1] = dNdy[i]
            B[2, 2 * i] = dNdy[i]
            B[2, 2 * i + 1] = dNdx[i]
        B[0, 8:12] = [dM1dx, 0.0, dM2dx, 0.0]
        B[1, 8:12] = [0.0, dM1dy, 0.0, dM2dy]
        B[2, 8:12] = [dM1dy, dM1dx, dM2dy, dM2dx]

        D = f * np.array([[1.0, nu, 0.0], [nu, 1.0, 0.0],
                          [0.0, 0.0, (1 - nu) / 2]])
        if mod is not None:
            f11, f22, f12 = mod[0], mod[1], mod[2]
            c = math.sqrt(max(0.0, f11 * f22))
            D[0, 0] *= f11
            D[1, 1] *= f22
            D[2, 2] *= f12
            D[0, 1] *= c
            D[1, 0] *= c
        K += B.T @ D @ B * abs(dJ)

    Kee, Kei = K[:8, :8], K[:8, 8:]
    Kie, Kii = K[8:, :8], K[8:, 8:]
    try:
        return Kee - Kei @ np.linalg.inv(Kii) @ Kie
    except np.linalg.LinAlgError:
        return Kee


def _k_flexion(x, y, E, nu, t, kappa=None, mod=None):
    """Mindlin + MITC4. GDL por nudo: [w, θx, θy].

    `mod`: M11, M22, M12 (índices 3,4,5) van sobre la flexión y V13, V23
    (6,7) sobre el cortante transversal. Un deck lleva M22 chico: no rigidiza
    cruzado al nervio. Port de `getBendingK` (shellQ4.cpp).
    """
    D0 = E * t ** 3 / (12 * (1 - nu * nu))
    Db = D0 * np.array([[1.0, nu, 0.0], [nu, 1.0, 0.0],
                        [0.0, 0.0, (1 - nu) / 2]])
    k_ = KAPPA if kappa is None else kappa
    Gs = k_ * E / (2 * (1 + nu)) * t
    Gs_x = Gs_y = Gs
    if mod is not None:
        m11, m22, m12 = mod[3], mod[4], mod[5]
        c = math.sqrt(max(0.0, m11 * m22))
        Db[0, 0] *= m11
        Db[1, 1] *= m22
        Db[2, 2] *= m12
        Db[0, 1] *= c
        Db[1, 0] *= c
        Gs_x = Gs * mod[6]
        Gs_y = Gs * mod[7]
    Kuu = np.zeros((12, 12))
    Kua = np.zeros((12, 4))
    Kaa = np.zeros((4, 4))

    # Jacobiano del CENTRO para los modos incompatibles (Taylor 1976)
    _, d0xi, d0et = _formas(0.0, 0.0)
    _, _, dJ0, (J011, J012, J021, J022) = _jac(d0xi, d0et, x, y)
    inv0 = 1.0 / dJ0

    # B del cortante en los 4 puntos de atadura: A(0,-1) C(0,1) B(-1,0) D(1,0)
    #
    # ⚠️ COVARIANTE, no cartesiano. El MITC4 de Dvorkin & Bathe (1984) interpola
    # las componentes gamma_xi / gamma_eta —las de los ejes NATURALES— y solo al
    # final vuelve al cartesiano con el J^-1 del punto de Gauss:
    #     gamma_cov  = J · gamma_cart      (J directo, en el punto de atadura)
    #     gamma_cart = J^-1 · gamma_cov    (en el punto de Gauss)
    # En un RECTANGULO J es el mismo en los cuatro puntos de atadura, entra y
    # sale del promedio y da igual — por eso cerraba en rectangulo. Distorsionado
    # NO: medido con un campo de Kirchhoff EXACTO (donde gamma tiene que ser 0)
    # en los 5 elementos del patch test 2-001 de SAP2000 salia
    #     gamma_espurio / pendiente = 0.47 a 2.88
    # o sea cortante inventado del orden de la propia solucion.
    Bs_ty = []
    for xi_t, eta_t in ((0.0, -1.0), (0.0, 1.0), (-1.0, 0.0), (1.0, 0.0)):
        N, dxi, det = _formas(xi_t, eta_t)
        dNdx, dNdy, _, (t11, t12, t21, t22) = _jac(dxi, det, x, y)
        Bs = np.zeros((2, 12))
        for i in range(4):
            Bs[0, 3 * i] = dNdx[i]
            Bs[0, 3 * i + 1] = -N[i]
            Bs[1, 3 * i] = dNdy[i]
            Bs[1, 3 * i + 2] = -N[i]
        Bs_ty.append(np.array([[t11, t12], [t21, t22]]) @ Bs)   # → covariante

    for xi, eta in GAUSS:
        N, dxi, det = _formas(xi, eta)
        dNdx, dNdy, dJ, (g11, g12, g21, g22) = _jac(dxi, det, x, y)
        Bb = np.zeros((3, 12))
        for i in range(4):
            Bb[0, 3 * i + 1] = dNdx[i]
            Bb[1, 3 * i + 2] = dNdy[i]
            Bb[2, 3 * i + 1] = dNdy[i]
            Bb[2, 3 * i + 2] = dNdx[i]

        # Modos incompatibles de Wilson TAMBIEN en flexion: los giros llevan
        # α·N5 y α·N6 (N5 = 1−ξ², N6 = 1−η²), derivados con el jacobiano del
        # CENTRO. Sin ellos el Q4 de placa sale mas rigido que el del C++ —
        # medido sobre las losas de 1175 cascaras: mediana 0.06 %, cola 0.61 %.
        # α1,α2 sobre βx · α3,α4 sobre βy (aqui los GDL son PENDIENTES; el C++
        # los escribe sobre θx/θy, que es la misma cosa con otro nombre y otro
        # signo — el signo de α da igual, se condensa).
        dN5dx = inv0 * J022 * (-2 * xi)
        dN5dy = inv0 * (-J021) * (-2 * xi)
        dN6dx = inv0 * (-J012) * (-2 * eta)
        dN6dy = inv0 * J011 * (-2 * eta)
        Ba = np.zeros((3, 4))
        Ba[0, 0], Ba[0, 1] = dN5dx, dN6dx          # κxx = ∂βx/∂x
        Ba[1, 2], Ba[1, 3] = dN5dy, dN6dy          # κyy = ∂βy/∂y
        Ba[2, 0], Ba[2, 1] = dN5dy, dN6dy          # κxy = ∂βx/∂y + ∂βy/∂x
        Ba[2, 2], Ba[2, 3] = dN5dx, dN6dx
        # La OTRA mitad de Taylor 1976. Son DOS cosas, no una: derivar con J0
        # **y** escalar por dJ0/dJ. Faltaba la segunda, y sin ella
        #     ∫ Ba dA ≠ 0
        # que es la condicion del patch test de curvatura constante. En un
        # rectangulo dJ = dJ0 y el factor vale 1 — invisible. Medido en el
        # patch test 2-001 de SAP2000: ||∫Ba dA||/A pasa de 9.3-23.6 a 2e-16.
        Ba *= dJ0 / dJ

        w = abs(dJ)
        Kuu += Bb.T @ Db @ Bb * w
        Kua += Bb.T @ Db @ Ba * w
        Kaa += Ba.T @ Db @ Ba * w

        wA, wC = 0.5 * (1 - eta), 0.5 * (1 + eta)
        wB, wD = 0.5 * (1 - xi), 0.5 * (1 + xi)
        Bcov = np.zeros((2, 12))
        Bcov[0] = wA * Bs_ty[0][0] + wC * Bs_ty[1][0]    # γ_ξ desde A y C
        Bcov[1] = wB * Bs_ty[2][1] + wD * Bs_ty[3][1]    # γ_η desde B y D
        # y de vuelta al cartesiano con el J^-1 de ESTE punto de Gauss
        Jinv = np.array([[g22, -g12], [-g21, g11]]) / dJ
        Bm = Jinv @ Bcov
        Kuu += (Gs_x * np.outer(Bm[0], Bm[0])
                + Gs_y * np.outer(Bm[1], Bm[1])) * w

    # Condensacion estatica. Kaa solo lleva flexion: los modos α actuan sobre
    # los giros, no sobre w, asi que no aportan al cortante.
    if not BENDING_MODOS_INCOMPATIBLES:
        return Kuu                   # el camino de `shellQ4.ts`
    if abs(np.linalg.det(Kaa)) > 1e-20:
        return Kuu - Kua @ np.linalg.inv(Kaa) @ Kua.T
    return Kuu                       # Kaa singular: Q4 estandar, como el C++


def _k_drilling(x, y, G, t, alpha=0.5):
    """Hughes-Brezzi: θz contra el giro de cuerpo rigido del campo u,v."""
    K = np.zeros((12, 12))
    for xi, eta in GAUSS:
        N, dxi, det = _formas(xi, eta)
        dNdx, dNdy, dJ, _ = _jac(dxi, det, x, y)
        Bd = np.zeros(12)
        for i in range(4):
            Bd[3 * i] = 0.5 * dNdy[i]
            Bd[3 * i + 1] = -0.5 * dNdx[i]
            Bd[3 * i + 2] = N[i]
        K += (alpha * G * t * abs(dJ)) * np.outer(Bd, Bd)
    return K


# De los giros de PLACA a los giros del NUDO. `_k_flexion` está escrita con las
# PENDIENTES, que es como viene de shellQ4.ts:
#     βx = ∂w/∂x      βy = ∂w/∂y
# pero los GDL 4 y 5 de un nudo son GIROS ALREDEDOR de los ejes:
#     Rx = ∂w/∂y = βy          Ry = −∂w/∂x = −βx
# o sea (w, βx, βy) = T · (w, Rx, Ry) con T = [[1,0,0],[0,0,−1],[0,1,0]].
#
# ⚠️ El motor TS NO hace este cambio: mete βx en la casilla de Rx y βy en la de
# Ry. Dentro de una placa aislada no se nota —todos sus elementos comparten el
# mismo convenio y es un simple cambio de base— pero en cuanto una VIGA
# comparte nudo con la losa, los giros dejan de significar lo mismo y la union
# sale rigida. Medido: con vigas, la placa Thick salia mas rigida que la Thin
# (razon 0.53) cuando fisicamente el cortante solo puede ABLANDAR, y no
# convergia al refinar. Ver `test_placa_con_vigas.py`.
_T_GIROS = np.array([[1.0, 0.0, 0.0],
                     [0.0, 0.0, -1.0],
                     [0.0, 1.0, 0.0]])
_T_BEN = np.zeros((12, 12))
for _n in range(4):
    _T_BEN[3 * _n:3 * _n + 3, 3 * _n:3 * _n + 3] = _T_GIROS


def shell_q4_motor(coords_xy, E, nu, t, *, alpha_drilling=None,
                   giros_del_ts=False, solo_membrana=False,
                   mod_membrana=1.0, mod_flexion=1.0, mod_dir=None,
                   tipo_drilling=TIPO_DRILLING_DEFECTO):
    """K local 24×24 del Q4 del motor. `coords_xy` = (4,2) EN EL PLANO del paño.

    `giros_del_ts=True` reproduce el convenio de giros de `shellQ4.ts` tal cual
    (sin el cambio de base). Solo sirve para comprobar la paridad con el TS en
    modelos SIN barras; para calcular de verdad va en False.

    `solo_membrana=True` es el ShellType **Membrane** de ETABS: el paño trabaja
    SOLO en su plano y no tiene NADA de rigidez a flexion. Sin esto, una losa
    declarada membrana le sujeta el giro a la cabeza de las columnas y el
    portico sale mas rigido de lo que es. Medido en el escalon C: con flexion
    daba 7.09 % contra ETABS en TODOS los nudos por igual — la firma de una
    rigidez de mas repartida por toda la planta, no de un elemento mal
    integrado.

    Modificadores de propiedad de CSI (Manual §10.7):
      `mod_membrana` / `mod_flexion` — el par ESCALAR (`shellmod ID mem bend`).
      `mod_dir` — los OCHO direccionales (F11 F22 F12 M11 M22 M12 V13 V23).
    Si hay direccionales MANDAN ELLOS y los escalares quedan en 1.0; si no, se
    multiplicaria dos veces. Igual que `shellQ4.cpp`.

    ⚠️ Flexión nula NO se arma y se multiplica por cero: se OMITE. Con Db = 0
    la matriz de modos incompatibles sale singular y el elemento se cae a un Q4
    estándar, que es justo lo contrario de la membrana que se pedía. ETABS
    hace esto mismo: un deck es ShellType Membrane y la flexión no existe.
    """
    K = np.zeros((24, 24))
    if E == 0 or t == 0:
        return K
    p = np.asarray(coords_xy, float)
    x, y = p[:, 0].copy(), p[:, 1].copy()
    G = E / (2 * (1 + nu))

    al = ALPHA_DRILL if alpha_drilling is None else alpha_drilling

    fm, fb = float(mod_membrana), float(mod_flexion)
    if mod_dir is not None:
        mod_dir = [float(v) for v in mod_dir]
        fm = fb = 1.0
        sin_flexion = all(abs(mod_dir[k]) < 1e-9 for k in (3, 4, 5))
    else:
        sin_flexion = abs(fb) < 1e-9

    # Los tipos 3..9 van por el elemento ITW, que trae membrana y drilling en la
    # MISMA 12x12 (`[u, v, theta_z]` por nudo) y no lleva penalizacion pegada
    # aparte. El defecto es el **8**: Gauss 3x3 + la PROYECCION de FEAP, el
    # mismo numero que `getMapVal(elementInputs.drillingTypes, index, 8)` de
    # `shellQ4.cpp`.
    #
    # ⚠️ Hasta el 19-ago aqui ponia `if tipo_drilling == 3` y el comentario
    # decia «es el defecto, igual que en shellQ4.cpp». Dejo de ser verdad en
    # cuanto el C++ movio el suyo, y los dos motores estuvieron dando numeros
    # distintos sin un solo aviso. Por eso el tipo ya no se interpreta aqui:
    # se pregunta a `kwargs_drilling`, que es la unica tabla.
    #
    # El 2 (y el 0 y el 1) son el camino anterior: Q4 con modos incompatibles
    # de Wilson + penalizacion Hughes-Brezzi. Se conserva porque en cascara
    # CURVA el ITW bloquea en malla gruesa (ver membrane_itw.py).
    if tipo_drilling in TIPOS_ITW:
        K[np.ix_(DOF_DRI, DOF_DRI)] += fm * k_membrana_itw(
            [(x[i], y[i]) for i in range(4)], E, nu, t, gamma_fac=GAMMA_ITW,
            mod_dir=mod_dir, **kwargs_drilling(tipo_drilling))
    else:
        K[np.ix_(DOF_MEM, DOF_MEM)] += fm * _k_membrana(x, y, E, nu, t, mod_dir)
    if not solo_membrana and not sin_flexion:
        k_ben = _k_flexion(x, y, E, nu, t, mod=mod_dir)
        if not giros_del_ts:
            k_ben = _T_BEN.T @ k_ben @ _T_BEN
        K[np.ix_(DOF_BEN, DOF_BEN)] += fb * k_ben
    # El drilling va escalado por el modificador de MEMBRANA, como en
    # `shellQ4.cpp` (`K += mFactor * getDrillingK_HughesBrezzi(...)`): si la
    # membrana no existe, su θz tampoco tiene que aportar rigidez. Solo se nota
    # con el `shellmod` ESCALAR — con los direccionales mFactor vale 1.
    if tipo_drilling not in TIPOS_ITW:
        K[np.ix_(DOF_DRI, DOF_DRI)] += fm * _k_drilling(x, y, G, t, al)
    return K
