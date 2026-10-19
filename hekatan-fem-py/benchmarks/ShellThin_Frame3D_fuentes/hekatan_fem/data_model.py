"""Espejo Python de hekatan-fem/src/cpp/data-model.h."""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
import numpy as np


@dataclass
class ElementInputs:
    elasticities:        Dict[int, float] = field(default_factory=dict)
    elasticitiesOrthogonal: Dict[int, float] = field(default_factory=dict)
    shearModuli:         Dict[int, float] = field(default_factory=dict)
    areas:               Dict[int, float] = field(default_factory=dict)
    momentsOfInertiaZ:   Dict[int, float] = field(default_factory=dict)
    momentsOfInertiaY:   Dict[int, float] = field(default_factory=dict)
    torsionalConstants:  Dict[int, float] = field(default_factory=dict)
    thicknesses:         Dict[int, float] = field(default_factory=dict)
    poissonsRatios:      Dict[int, float] = field(default_factory=dict)
    densities:           Dict[int, float] = field(default_factory=dict)
    polarMomentsOfInertia: Dict[int, float] = field(default_factory=dict)
    shearAreasY:         Dict[int, float] = field(default_factory=dict)
    shearAreasZ:         Dict[int, float] = field(default_factory=dict)
    rigidOffsets:        Dict[int, List[float]] = field(default_factory=dict)
    # 6 flags [TI,M2I,M3I,TJ,M2J,M3J] o 12 flags [FxI,..M3J]
    momentReleases:      Dict[int, List[bool]] = field(default_factory=dict)
    # 12 valores spring [kFxI,..kM3J]
    partialFixitySprings: Dict[int, List[float]] = field(default_factory=dict)
    # ETABS modifiers
    membraneModifiers:   Dict[int, float] = field(default_factory=dict)
    bendingModifiers:    Dict[int, float] = field(default_factory=dict)
    # Shell plate formulation: 0=Mindlin (default), 1=MZC Kirchhoff, 2=DKMQ Katili
    plateFormulations:   Dict[int, int]   = field(default_factory=dict)
    # Drilling DOF: 0=legacy 1e-6 penalty, 1=PyNite weak, 2=Hughes-Brezzi (default)
    drillingTypes:       Dict[int, int]   = field(default_factory=dict)
    drillingPenaltyScales: Dict[int, float] = field(default_factory=dict)


@dataclass
class NodeInputs:
    # node_index -> [tx, ty, tz, rx, ry, rz] (bool)
    supports: Dict[int, List[bool]]  = field(default_factory=dict)
    # node_index -> [fx, fy, fz, mx, my, mz] (float)
    loads:    Dict[int, List[float]] = field(default_factory=dict)


@dataclass
class DeformOutputs:
    # node_index -> [dx, dy, dz, rx, ry, rz]
    deformations: Dict[int, np.ndarray] = field(default_factory=dict)
    # node_index -> [fx, fy, fz, mx, my, mz]
    reactions:    Dict[int, np.ndarray] = field(default_factory=dict)
    # opcional: vector U completo (dof,)
    u_full: Optional[np.ndarray] = None


@dataclass
class ModalOutputs:
    frequencies: np.ndarray = field(default_factory=lambda: np.zeros(0))      # (n_modes,)  Hz
    modeShapes:  np.ndarray = field(default_factory=lambda: np.zeros((0, 0))) # (n_modes, dof)
    massParticipation: np.ndarray = field(default_factory=lambda: np.zeros((0, 6)))
