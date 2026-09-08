"""Data model — 1:1 port de awatif v2 data-model.ts.

Convención DOFs por nodo: [Ux, Uy, Uz, Rx, Ry, Rz] (6).
Sin Model builder, sin Section/Material helpers — solo data raw.

Espejo del TypeScript:
    type Node = [number, number, number]
    type Element = number[]
    type NodeInputs = { supports?: Map<>, loads?: Map<> }
    type ElementInputs = { elasticities?: Map<>, areas?: Map<>, ... }
    type DeformOutputs = { deformations?: Map<>, reactions?: Map<> }
    type AnalyzeOutputs = { normals?: Map<>, shearsY?: Map<>, ... }
    type ModalOutputs = { frequencies?: number[], modeShapes?: number[][], ... }
"""
from __future__ import annotations
from dataclasses import dataclass, field
from typing import Optional, Literal


# ─── Geometry ───────────────────────────────────────────────────────────────
Node = tuple[float, float, float]   # [x, y, z]
Element = list[int]                  # indices a nodes


# ─── SectionShape (visualization metadata) ──────────────────────────────────
SectionType = Literal["rect", "circ", "I", "HSS", "CFT", "L", "2L", "C", "2C", "T", "pipe", "coldC"]


@dataclass
class SectionShape:
    """Sección visual (solo metadata para renderer 3D, no usado en K assembly)."""
    type: SectionType = "rect"
    b: Optional[float] = None
    h: Optional[float] = None
    d: Optional[float] = None
    tw: Optional[float] = None
    tf: Optional[float] = None
    t: Optional[float] = None
    r: Optional[float] = None
    lip: Optional[float] = None
    dis: Optional[float] = None
    name: Optional[str] = None


# ─── NodeInputs ─────────────────────────────────────────────────────────────
SupportFlags = tuple[bool, bool, bool, bool, bool, bool]    # [Ux, Uy, Uz, Rx, Ry, Rz]
NodeLoad     = tuple[float, float, float, float, float, float]  # [Fx, Fy, Fz, Mx, My, Mz]


@dataclass
class NodeInputs:
    supports: dict[int, SupportFlags] = field(default_factory=dict)
    loads:    dict[int, NodeLoad]     = field(default_factory=dict)
    # Muelles nodales (Winkler): (índice de nudo, GDL 0..5, k). Espejo del
    # `springsList` del JS, que en el C++ es `K.coeffRef(gdof, gdof) += k`.
    springs:  list[tuple[int, int, float]] = field(default_factory=list)
    # Muelle de AREA por cascara (SAFE `PropAreaSpring`): ks [kN/m3] -> ks*int N^T N dA sobre uz,
    # matriz CONSISTENTE que acopla los 4 nudos (no diagonal). Indice de ELEMENTO -> ks.
    area_springs: dict[int, float] = field(default_factory=dict)
    # cascaras cuyo muelle de area va CONCENTRADO por area tributaria (SAP2000/ETABS/SAFE)
    # en vez de consistente; `areaspring ID ks nodal`
    area_springs_nodal: set[int] = field(default_factory=set)
    # (elemento, nudo) de los nudos COLGADOS sobre una arista que hay que atar; `edge etabs`
    hanging_nodes: list[tuple[int, int]] = field(default_factory=list)
    # Diafragma RIGIDO: nudo -> grupo (0 = ninguno). ux, uy, rz atados a un maestro
    # virtual en el centro del grupo; uz, rx, ry libres (el "Rigid" de ETABS).
    diaphragms: dict[int, int] = field(default_factory=dict)


# ─── ElementInputs (mirrors awatif v2) ─────────────────────────────────────
@dataclass
class ElementInputs:
    elasticities:              dict[int, float] = field(default_factory=dict)
    elasticities_orthogonal:   dict[int, float] = field(default_factory=dict)
    shear_moduli:              dict[int, float] = field(default_factory=dict)
    areas:                     dict[int, float] = field(default_factory=dict)
    moments_of_inertia_z:      dict[int, float] = field(default_factory=dict)
    moments_of_inertia_y:      dict[int, float] = field(default_factory=dict)
    torsional_constants:       dict[int, float] = field(default_factory=dict)
    thicknesses:               dict[int, float] = field(default_factory=dict)
    poissons_ratios:           dict[int, float] = field(default_factory=dict)
    densities:                 dict[int, float] = field(default_factory=dict)
    polar_moments_of_inertia:  dict[int, float] = field(default_factory=dict)
    shear_areas_y:             dict[int, float] = field(default_factory=dict)
    shear_areas_z:             dict[int, float] = field(default_factory=dict)
    # "local axis angle" de CSI, en GRADOS: gira el par (eje2, eje3) sobre el eje 1
    local_angles:              dict[int, float] = field(default_factory=dict)
    # carga repartida sobre la barra en EJES GLOBALES, kN/m: (wx, wy, wz)
    frame_loads:               dict[int, tuple[float, float, float]] = field(default_factory=dict)
    rigid_offsets:             dict[int, tuple[float, float]] = field(default_factory=dict)
    # END LENGTH OFFSETS de CSI: (off_I, off_J, rigid_zone_factor) en metros y
    # factor 0-1. NO es `rigid_offsets` (el de awatif, que ALARGA la barra):
    # aquí el brazo va DENTRO de la luz y lo que se acorta es el tramo flexible.
    # Con rz = 0 —el defecto de ETABS— no cambia la rigidez: sólo el peso propio
    # de las vigas y la estación de reporte de esfuerzos.
    end_offsets:               dict[int, tuple[float, float, float]] = field(default_factory=dict)
    moment_releases:           dict[int, list[bool]] = field(default_factory=dict)
    partial_fixity_springs:    dict[int, list[float]] = field(default_factory=dict)
    insertion_points:          dict[int, tuple[float, float]] = field(default_factory=dict)
    section_shapes:            dict[int, SectionShape] = field(default_factory=dict)
    # Modificadores de propiedad del shell (CSI Manual §10.7). El par escalar
    # (`shellmod ID mem bend`) y los OCHO direccionales
    # (F11 F22 F12 M11 M22 M12 V13 V23). Si hay direccionales mandan ellos.
    membrane_modifiers:        dict[int, float] = field(default_factory=dict)
    bending_modifiers:         dict[int, float] = field(default_factory=dict)
    shell_modifiers:           dict[int, list[float]] = field(default_factory=dict)
    # Ángulo del eje local 1 del shell (`shellang`). Se guarda por trazabilidad
    # y para exportar: el solver —ni éste ni el TS/C++— lo usa hoy.
    shell_angles:              dict[int, float] = field(default_factory=dict)
    # ShellType de ETABS por elemento: 1 = Shell-Thin (Kirchhoff DKE),
    # 0 / ausente = Shell-Thick (Mindlin MITC4, el defecto de Hekatan).
    plate_formulations:        dict[int, int] = field(default_factory=dict)
    # La union viga-muro de ETABS (medida el 2-sep-2026, drilling_min*.py): en
    # cada nudo de un muro (cascara VERTICAL) donde entra una barra, ETABS ata el
    # giro drilling al giro de la arista horizontal con un muelle
    #   c*(w_vecino - w_nudo - theta*(x_vecino - x_nudo))^2,  c = E*t*(H/L)^3/32.
    # `etabsjoint 1` en el .heks. Apagado por defecto: SAP2000 no lo hace.
    etabs_wall_joint:          bool = True    # por defecto como ETABS; `etabsjoint 0` = modo SAP2000
    # H8: modos incompatibles de Wilson–Taylor (el defecto de SAP2000 y del WASM); `incompatible 0` los quita
    solid_incompatible:        bool = True


# ─── Outputs ────────────────────────────────────────────────────────────────
@dataclass
class DeformOutputs:
    deformations: dict[int, NodeLoad] = field(default_factory=dict)
    reactions:    dict[int, NodeLoad] = field(default_factory=dict)


@dataclass
class AnalyzeOutputs:
    # Frame element outputs (en local frame CSI): map element_idx → (val_I, val_J)
    normals:    dict[int, tuple[float, float]] = field(default_factory=dict)  # P
    shears_y:   dict[int, tuple[float, float]] = field(default_factory=dict)  # V2
    shears_z:   dict[int, tuple[float, float]] = field(default_factory=dict)  # V3
    torsions:   dict[int, tuple[float, float]] = field(default_factory=dict)  # T = M1
    bendings_y: dict[int, tuple[float, float]] = field(default_factory=dict)  # M2
    bendings_z: dict[int, tuple[float, float]] = field(default_factory=dict)  # M3
    # Shell element outputs: map element_idx → array (4,)
    bending_xx:  dict[int, list[float]] = field(default_factory=dict)
    bending_yy:  dict[int, list[float]] = field(default_factory=dict)
    bending_xy:  dict[int, list[float]] = field(default_factory=dict)
    membrane_xx: dict[int, list[float]] = field(default_factory=dict)
    membrane_yy: dict[int, list[float]] = field(default_factory=dict)
    membrane_xy: dict[int, list[float]] = field(default_factory=dict)
    transverse_shear_x: dict[int, list[float]] = field(default_factory=dict)
    transverse_shear_y: dict[int, list[float]] = field(default_factory=dict)
    von_mises:  dict[int, list[float]] = field(default_factory=dict)
    pressure:   dict[int, list[float]] = field(default_factory=dict)


@dataclass
class ModalOutputs:
    frequencies:        list[float] = field(default_factory=list)   # Hz
    periods:            list[float] = field(default_factory=list)   # s
    omega:              list[float] = field(default_factory=list)   # rad/s
    mode_shapes:        list[list[float]] = field(default_factory=list)  # [mode_idx][dof_idx]
    mass_participation: list[list[float]] = field(default_factory=list)  # [mode_idx][6]
