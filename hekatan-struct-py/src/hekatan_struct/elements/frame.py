"""Frame 3D Timoshenko element — 12 DOF, CSI §7.4 default orientation.

Convención CSI:
  Local 1 = longitudinal (I → J)
  Vertical elements (axis ≈ ±Z): Local 2 = global +X
  Non-vertical: Local 1-2 plane is vertical; Local 2 has +Z component
  Local 3 = Local 1 × Local 2 (right-handed)

Local DOFs order: [u1, u2, u3, r1, r2, r3] @ I, [...] @ J → 12 totales.

Formulación: la misma que SAP IV (`beam.for`, Bathe·Wilson·Peterson 1973) y que
el motor TS/C++ de Hekatan (`getLocalStiffnessMatrix.ts`): viga con deformación
por cortante, gobernada por φ = 12·E·I/(G·As·L²). Con As → ∞ (φ = 0) degenera
exactamente en Euler-Bernoulli, así que es la misma matriz de siempre más un
término. Sin ese término la barra sale SIEMPRE más rígida, nunca al revés.
"""
import numpy as np


def frame_local_axes_csi(p_i: np.ndarray, p_j: np.ndarray,
                         angle_deg: float = 0.0
                         ) -> tuple[np.ndarray, np.ndarray, np.ndarray, float]:
    """CSI Manual §7.4 — Default orientation + local axis angle. → (e1, e2, e3, L).

    `angle_deg` es el "local axis angle" de CSI: gira el par (eje2, eje3)
    alrededor del eje 1, dejando el eje 1 quieto. Sin él, una C 200×50 puesta a
    90° se calcula con I = 6.20e6 mm⁴ cuando en realidad trabaja con 0.53e6:
    once veces más rígida de lo que es.
    """
    e1 = np.asarray(p_j, dtype=float) - np.asarray(p_i, dtype=float)
    L = float(np.linalg.norm(e1))
    if L < 1e-12:
        raise ValueError(f"Zero-length frame: p_i={p_i}, p_j={p_j}")
    e1 = e1 / L
    # Vertical = la proyección horizontal se anula. Se mide D, no |n|, para
    # decidir igual que el motor TS/C++ (getTransformationMatrix.ts usa D<1e-9).
    D = float(np.hypot(e1[0], e1[1]))

    if D < 1e-9:
        # Vertical: Local 2 = +X global (CSI convention)
        s = 1.0 if e1[2] > 0 else -1.0
        e1 = np.array([0.0, 0.0, s])
        e2 = np.array([1.0, 0.0, 0.0])
        e3 = np.array([0.0, s, 0.0])
    else:
        # Non-vertical: plano 1-2 vertical, eje 2 con componente +Z
        l, m, n = e1
        e2 = np.array([-l * n / D, -m * n / D, D])
        e3 = np.array([m / D, -l / D, 0.0])

    if abs(angle_deg) > 1e-12:
        a = np.deg2rad(angle_deg)
        ca, sa = np.cos(a), np.sin(a)
        e2, e3 = ca * e2 + sa * e3, -sa * e2 + ca * e3

    return e1, e2, e3, L


def frame_stiffness_local(E: float, G: float, A: float, Iz_loc: float, Iy_loc: float,
                          J: float, L: float,
                          As_z: float = 0.0, As_y: float = 0.0,
                          shear_deformation: bool = True) -> np.ndarray:
    """Frame 3D Timoshenko local K matrix (12×12).

    DOFs orden: [u1, u2, u3, r1, r2, r3]_I + [u1, u2, u3, r1, r2, r3]_J
    Iz_loc = momento de inercia alrededor de Local 3 (flexión en plano 1-2 → V2, M3)
    Iy_loc = momento de inercia alrededor de Local 2 (flexión en plano 1-3 → V3, M2)
    As_z   = área de cortante que resiste V2 (va con Iz_loc) — el `As2` de CSI
    As_y   = área de cortante que resiste V3 (va con Iy_loc) — el `As3` de CSI

    Si no se dan las As y `shear_deformation`, se usa 5/6·A (rectángulo), que es
    lo que supone ETABS por defecto y lo que hace el motor TS. Para un perfil I
    eso es el DOBLE del alma real: hay que pasar las As de verdad.
    """
    if shear_deformation and As_z <= 0 and As_y <= 0 and A > 0 and G > 0:
        As_z = As_y = (5.0 / 6.0) * A
    if not shear_deformation:
        As_z = As_y = 0.0

    phiZ = (12 * E * Iz_loc) / (G * As_z * L * L) if (As_z > 0 and G > 0) else 0.0
    phiY = (12 * E * Iy_loc) / (G * As_y * L * L) if (As_y > 0 and G > 0) else 0.0

    k = np.zeros((12, 12))
    # Axial (u1_i, u1_j)
    EA_L = E * A / L
    k[0, 0] = k[6, 6] = EA_L
    k[0, 6] = k[6, 0] = -EA_L
    # Torsion (r1_i, r1_j)
    GJ_L = G * J / L
    k[3, 3] = k[9, 9] = GJ_L
    k[3, 9] = k[9, 3] = -GJ_L
    # Bending plano 1-2 (V2, M3): usa Iz_loc, afecta u2, r3
    EIz = E * Iz_loc
    L2 = L * L; L3 = L2 * L
    tz = (12 * EIz / L3) / (1 + phiZ)
    bz = (6 * EIz / L2) / (1 + phiZ)
    kz = (4 * EIz / L) * (1 + phiZ / 4) / (1 + phiZ)
    az = (2 * EIz / L) * (1 - phiZ / 2) / (1 + phiZ)
    k[1, 1] = k[7, 7] = tz
    k[1, 7] = k[7, 1] = -tz
    k[1, 5] = k[5, 1] = k[1, 11] = k[11, 1] = bz
    k[7, 5] = k[5, 7] = k[7, 11] = k[11, 7] = -bz
    k[5, 5] = k[11, 11] = kz
    k[5, 11] = k[11, 5] = az
    # Bending plano 1-3 (V3, M2): usa Iy_loc, afecta u3, r2
    EIy = E * Iy_loc
    ty = (12 * EIy / L3) / (1 + phiY)
    by = (6 * EIy / L2) / (1 + phiY)
    ky = (4 * EIy / L) * (1 + phiY / 4) / (1 + phiY)
    ay = (2 * EIy / L) * (1 - phiY / 2) / (1 + phiY)
    k[2, 2] = k[8, 8] = ty
    k[2, 8] = k[8, 2] = -ty
    k[2, 4] = k[4, 2] = k[2, 10] = k[10, 2] = -by
    k[8, 4] = k[4, 8] = k[8, 10] = k[10, 8] = by
    k[4, 4] = k[10, 10] = ky
    k[4, 10] = k[10, 4] = ay
    return k


def frame_releases_condense(k: np.ndarray, releases) -> np.ndarray:
    """End releases por condensación estática (el `applyReleases` del motor TS).

    `releases` = 12 flags (todos los GDL locales) o 6 (orden legacy
    [TI, M2I, M3I, TJ, M2J, M3J] → GDL 3,4,5,9,10,11).
    """
    rel = list(releases)
    if len(rel) >= 12:
        freed = [i for i in range(12) if rel[i]]
    else:
        dofs = [3, 4, 5, 9, 10, 11]
        freed = [dofs[i] for i in range(min(6, len(rel))) if rel[i]]
    if not freed:
        return k
    kept = [i for i in range(12) if i not in freed]
    Kff = k[np.ix_(freed, freed)]
    try:
        Kff_inv = np.linalg.inv(Kff)
    except np.linalg.LinAlgError:
        return k
    corr = k[np.ix_(kept, freed)] @ Kff_inv @ k[np.ix_(freed, kept)]
    kc = np.zeros((12, 12))
    kc[np.ix_(kept, kept)] = k[np.ix_(kept, kept)] - corr
    return kc


def frame_partial_fixity(k: np.ndarray, springs) -> np.ndarray:
    """Muelles de fijación parcial: se suman a la diagonal de la K LOCAL.

    Es el escalón entre empotrado (k → ∞) y articulado (k = 0). Se aplica ANTES
    de los releases, como en el motor TS: si se hace al revés, la condensación
    del release se come el muelle.
    """
    ks = k.copy()
    for i, v in enumerate(springs[:12]):
        if v > 1e-12:
            ks[i, i] += v
    return ks


def frame_rigid_offset_matrix(o_i: float, o_j: float) -> np.ndarray:
    """Brazo rígido en los extremos: R con u_extremo = R · u_nudo (12×12, LOCAL).

    El brazo va a lo largo del eje 1 (el de la barra), así que solo acopla las
    traslaciones transversales con los giros:
        u2_extremo = u2_nudo − o·r3        u3_extremo = u3_nudo + o·r2
    y en el nudo J con el signo cambiado, porque el brazo apunta al revés.

    ⚠️ Está en EJES LOCALES, así que se aplica sobre la K local: Rᵀ·k_local·R, y
    solo después se gira a globales. El motor TS
    (`getGlobalStiffnessMatrix.ts`) lo aplica sobre la K GLOBAL con esta misma
    R: para una barra alineada con los ejes globales da igual, para una barra
    oblicua no. Ver `test_oraculo_ts.py::test_offsets_barra_oblicua_discrepa`,
    que lo mide.
    """
    R = np.eye(12)
    if abs(o_i) > 1e-12:
        R[1, 5] = -o_i
        R[2, 4] = o_i
    if abs(o_j) > 1e-12:
        R[7, 11] = o_j
        R[8, 10] = -o_j
    return R


def frame_moment_at_offset_face(m_nudo: float, v: float, off: float) -> float:
    """Traslada un momento del NUDO a la cara interior del offset, como ETABS.

    Del manual de CSI: *"ETABS outputs forces at the inside face of end offsets along
    the length of the member"* y *"No output forces are produced within the end
    offset"*. Y medido (`ref_end_offsets_etabs.json`): con off = 1.00 m en el
    empotrado de un voladizo de 6 m con P = 10 kN, la primera estación es
    `ObjSta = 1.000` y el momento ahí es **−50**, no `P·L = 60` — **también con
    RZ = 0**, que es cuando el offset ni siquiera rigidiza.

        M_cara = M_nudo − V · off

    Comparar el momento de Hekatan en el nudo contra el de ETABS sin esto es
    comparar dos puntos distintos de la misma barra. En el galpón hay 586
    extremos con offset y el mayor es de 0.60 m.
    """
    return m_nudo - v * off


def frame_design_orientation_csi(p_i, p_j, umbral_grados: float = 20.0) -> str:
    """La *design orientation* de CSI: "Beam" | "Brace" | "Column".

    Medido en ETABS 22.6.0 (`galpon-bodega-electoral/_umbral_angulo_exacto.py`,
    barrido de 10° a 25° en pasos de 0.25°): hasta **19.75° → Beam**, desde
    **20.00° → Brace**. El corte está en los **20° exactos**, el mismo número
    que el de losa→muro. Vertical (90°) → Column.

    Hace falta para el peso propio: sólo las **vigas** pesan por su luz libre.
    """
    d = np.asarray(p_j, dtype=float) - np.asarray(p_i, dtype=float)
    dh = float(np.hypot(d[0], d[1]))
    if dh < 1e-9:
        return "Column"
    ang = np.degrees(np.arctan2(abs(d[2]), dh))
    return "Beam" if ang < umbral_grados else "Brace"


def frame_self_weight_length(p_i, p_j, off_i: float = 0.0, off_j: float = 0.0,
                             self_wt_opt: str = "auto") -> float:
    """Longitud con la que ETABS pesa la barra (opcion `SelfWtOpt` de ETABS).

    `Auto` (el defecto de las 723 barras del galpón) = **el programa decide**:
    la **viga** pesa por su **luz libre** `L − (off_i + off_j)` —con el offset
    ENTERO, no `RZ·off`— y **columna y diagonal por la longitud completa**.

    Medido en `galpon_bodega.EDB` sobre la sección `2L-40-CAJON`, que sale en
    las tres familias (tabla `Material List by Section Property`, kN/m):

        Beam   w = 0.04531      Column w = 0.04741      Brace w = 0.04741

    y `W_beam / w_column = 28.762 m` = la luz libre exacta (28.7629). En el
    pórtico mínimo la razón es `5.60/6.00 = 0.933333` para la viga y
    `1.000000` para la columna (`test_offsets_masa.py`).
    """
    L = float(np.linalg.norm(np.asarray(p_j, float) - np.asarray(p_i, float)))
    opt = (self_wt_opt or "auto").lower()
    if opt in ("full", "full length", "fulllength"):
        return L
    if opt in ("clear", "clear length", "clearlength"):
        return max(L - off_i - off_j, 0.0)
    if frame_design_orientation_csi(p_i, p_j) == "Beam":
        return max(L - off_i - off_j, 0.0)
    return L


def frame_end_offset_matrix(lr_i: float, lr_j: float) -> np.ndarray:
    """Brazo rígido de un *end length offset* de CSI: u_flexible = R · u_nudo.

    ⚠️ NO es `frame_rigid_offset_matrix`. Aquella es la de awatif: el brazo sale
    hacia AFUERA y ALARGA la barra. El de CSI va hacia ADENTRO — el brazo está
    contenido en la luz `L`, y lo que se acorta es el tramo flexible:

        extremo I (a +lr_i del nudo I):  u2 = u2_I + lr_i·r3     u3 = u3_I − lr_i·r2
        extremo J (a −lr_j del nudo J):  u2 = u2_J − lr_j·r3     u3 = u3_J + lr_j·r2

    Medido contra ETABS (`ref_end_offsets_etabs.json`, caso "J"): con el offset
    en el extremo libre de un voladizo, RZ = 1 da 0.0115147 m y esta R lo
    reproduce; con el signo al revés saldría 0.0117 y pico.
    """
    R = np.eye(12)
    if abs(lr_i) > 1e-12:
        R[1, 5] = lr_i
        R[2, 4] = -lr_i
    if abs(lr_j) > 1e-12:
        R[7, 11] = -lr_j
        R[8, 10] = lr_j
    return R


def frame_stiffness_end_offsets(E: float, G: float, A: float, Iz_loc: float,
                                Iy_loc: float, J: float, L: float,
                                off_i: float, off_j: float, rz: float,
                                As_z: float = 0.0, As_y: float = 0.0,
                                shear_deformation: bool = True
                                ) -> tuple[np.ndarray, float, float, float]:
    """K local (12×12) de una barra con *end length offsets* de CSI. → (k, lr_i, lr_j, Lf)

    La ley, medida contra ETABS al 0.005 % (registro
    `2026-08-25_ley_end_length_offset.md`):

        lr = RZ · off              tramo REALMENTE rígido, el de fuera
        Lf = L − RZ·(off_i+off_j)  longitud flexible
        flexión y cortante  → con Lf
        axil EA/L y torsión GJ/L → con la L COMPLETA

    La última línea es literal del manual de CSI: *"The rigid zones of the end offsets
    never affect axial and torsional deformations. The full element length is
    always assumed to be flexible for those deformations."* Con RZ = 0 —el
    defecto de ETABS— esto devuelve exactamente la barra de siempre.
    """
    lr_i = rz * off_i
    lr_j = rz * off_j
    Lf = L - lr_i - lr_j
    if Lf <= 1e-9:
        raise ValueError(
            f"end offsets se comen la barra: L={L}, off=({off_i},{off_j}), rz={rz}")
    k = frame_stiffness_local(E, G, A, Iz_loc, Iy_loc, J, Lf,
                              As_z=As_z, As_y=As_y,
                              shear_deformation=shear_deformation)
    # axil y torsión: la L completa, no Lf
    EA_L = E * A / L
    k[0, 0] = k[6, 6] = EA_L
    k[0, 6] = k[6, 0] = -EA_L
    GJ_L = G * J / L
    k[3, 3] = k[9, 9] = GJ_L
    k[3, 9] = k[9, 3] = -GJ_L
    return k, lr_i, lr_j, Lf


def frame_fixed_end_loads(p_i, p_j, w_global) -> tuple[np.ndarray, np.ndarray]:
    """Carga repartida global w (kN/m) → fuerzas de empotramiento nodales.

        F_i = F_j = w·L/2
        M_i = +(L²/12)·(t × w)      M_j = −(L²/12)·(t × w)

    con t = versor de la barra. Es EXACTO para desplazamientos y reacciones, y
    es lo que separa una viga CONTINUA de un reparto por ancho tributario: sin
    los momentos, el apoyo interior de un vano ancho recibe de menos.
    """
    a = np.asarray(p_i, float)
    b = np.asarray(p_j, float)
    d = b - a
    L = float(np.linalg.norm(d))
    if L < 1e-9:
        return np.zeros(6), np.zeros(6)
    t = d / L
    w = np.asarray(w_global, float)
    c = L * L / 12.0
    txw = np.cross(t, w)
    fi = np.concatenate([w * L / 2.0, c * txw])
    fj = np.concatenate([w * L / 2.0, -c * txw])
    return fi, fj


def frame_T(e1: np.ndarray, e2: np.ndarray, e3: np.ndarray) -> np.ndarray:
    """Matriz de transformación 12×12 local → global. R en bloques 3×3."""
    R = np.column_stack([e1, e2, e3])
    T = np.zeros((12, 12))
    for i in range(4):
        T[3*i:3*i+3, 3*i:3*i+3] = R
    return T


def rigid_arm_transform(r_local_I: np.ndarray, r_local_J: np.ndarray) -> np.ndarray:
    """CSI Cardinal Point offsets (rigid arms en local frame).

    Mapea [u_joint, ω_joint] → [u_centroid, ω_centroid] vía:
      u_centroid = u_joint + r × ω_joint
      ω_centroid = ω_joint

    Útil para Cardinal Point 8 (beams): r = (0, -h_beam/2, 0) en local.
    """
    def Rx(r):
        rx, ry, rz = r
        return np.array([
            [ 0,   -rz,   ry],
            [ rz,   0,  -rx],
            [-ry,  rx,    0],
        ])
    T_arm = np.eye(12)
    T_arm[0:3, 3:6] = Rx(np.asarray(r_local_I, dtype=float))
    T_arm[6:9, 9:12] = Rx(np.asarray(r_local_J, dtype=float))
    return T_arm


def frame_recover_local_forces(k_local: np.ndarray, T_global_to_local: np.ndarray,
                               u_global_12: np.ndarray) -> np.ndarray:
    """Recovers local 12-vec [P_i, V2_i, V3_i, T_i, M2_i, M3_i, P_j, ...].

    Convention CSI: f[0..5] son fuerzas internas en END I.
                    f[6..11] en END J.
    """
    u_local = T_global_to_local @ u_global_12
    f_local = k_local @ u_local
    return f_local
