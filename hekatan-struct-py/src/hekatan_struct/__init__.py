"""hekatan-struct-lineal — Motor Python de Hekatan Struct para análisis estructural avanzado.

Re-exporta el API base (embebida) + agrega:
  - apply_selfweight()       — selfweight automático lumped a nodos (CSI mass source pattern)
  - apply_rigid_diaphragm()  — constraint Ux/Uy/Rz al master node via penalty
  - apply_cardinal_point_8() — beam offset h/2 abajo (CSI insertion points)
  - apply_stiffness_modifiers() — cracked section factors (ACI 318 §6.6.3.1)
  - compute_picks()          — extrae |P|, |V2|, |V3|, |T|, |M2|, |M3| picos
  - compare_picks()          — tabla H vs E con diff%

Más: ejemplos Mesa Torsión, edificios paramétricos, iteración hacia ETABS reference.
"""
# Re-export core (embebido)
from .data_model import (
    Node, Element,
    SectionShape, SupportFlags, NodeLoad,
    NodeInputs, ElementInputs,
    DeformOutputs, AnalyzeOutputs, ModalOutputs,
)
from .solver import deform, analyze, modal_analysis

# Extensiones hekatan
from .extensions import (
    apply_selfweight,
    apply_rigid_diaphragm,
    apply_cardinal_point_8,
    apply_stiffness_modifiers,
    compute_picks,
    compare_picks,
)

from .placa_modelo import Placa
from . import placas_wilson               # DKE y DSE de Wilson (libro 2005, cap. 8)
from .placas_wilson import k_dke, k_dse
from . import insercion, brazos, cubierta     # punto de inserción (cardinal points), brazos automáticos de ETABS, cubierta de membrana
from .insercion import asignar_punto_insercion, offsets_punto_cardinal
from .brazos import aplicar_brazos_automaticos
from .cubierta import membrana_deck_etabs, cubierta_de_e2k
from . import csi                         # elementos de área de SAP2000/ETABS con firmas k_<elem>(xy, E, nu, t)

__version__ = "0.2.0"
__all__ = [
    # core re-exported
    "Node", "Element",
    "SectionShape", "SupportFlags", "NodeLoad",
    "NodeInputs", "ElementInputs",
    "DeformOutputs", "AnalyzeOutputs", "ModalOutputs",
    "deform", "analyze", "modal_analysis",
    # hekatan extensions
    "apply_selfweight", "apply_rigid_diaphragm",
    "apply_cardinal_point_8", "apply_stiffness_modifiers",
    "compute_picks", "compare_picks",
    "asignar_punto_insercion", "offsets_punto_cardinal", "aplicar_brazos_automaticos",
    "membrana_deck_etabs", "cubierta_de_e2k",
    "Placa", "placas_wilson", "k_dke", "k_dse", "csi",
]

# Abrir/guardar .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE)
from .archivos_csi import abrir, guardar, convertir
__all__ += ["abrir", "guardar", "convertir"]
