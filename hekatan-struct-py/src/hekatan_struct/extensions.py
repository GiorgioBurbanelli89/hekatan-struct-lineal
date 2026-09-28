"""Extensiones hekatan-struct-lineal — helpers auxiliares (fuera del core) para construir modelos."""
from __future__ import annotations
from typing import Sequence
import numpy as np

from .elements.frame import frame_self_weight_length
from .data_model import (
    Node, Element, NodeInputs, ElementInputs, SectionShape,
    AnalyzeOutputs,
)


G_GRAV = 9.80665  # m/s²


# ═══════════════════════════════════════════════════════════════════════════
# Selfweight automation (CSI mass source pattern Dead SW=1)
# ═══════════════════════════════════════════════════════════════════════════
def _area_q4(P) -> float:
    """Área REAL de un cuadrilátero en 3D: los dos triángulos (0,1,2) y (0,2,3)."""
    Q = [np.asarray(p, dtype=float) for p in P]
    a = np.linalg.norm(np.cross(Q[1] - Q[0], Q[2] - Q[0])) / 2.0
    b = np.linalg.norm(np.cross(Q[2] - Q[0], Q[3] - Q[0])) / 2.0
    return float(a + b)


def apply_selfweight(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    element_inputs: ElementInputs,
    node_inputs: NodeInputs,
    sw_multiplier: float = 1.0,
    *,
    gamma_per_element: dict[int, float] | None = None,
    skip_elements: set[int] | None = None,
) -> None:
    """Aplica selfweight lumped a nodos vía in-place mutation de node_inputs.loads.

    Para frames: ρ × A × L × sw_mult, ½ a cada extremo.
    Para shells: ρ × t × area × sw_mult, ¼ a cada esquina.

    Args:
        gamma_per_element: opcional, peso específico kN/m³ por elemento.
                           Si None, usa element_inputs.densities × g (interpretado como ton/m³).
    """
    def add_load(n: int, fz: float):
        prev = node_inputs.loads.get(n, (0, 0, 0, 0, 0, 0))
        node_inputs.loads[n] = (prev[0], prev[1], prev[2] + fz, prev[3], prev[4], prev[5])

    for idx, conn in enumerate(elements):
        # Calcular γ del elemento
        if gamma_per_element and idx in gamma_per_element:
            gamma = gamma_per_element[idx]
        else:
            rho = element_inputs.densities.get(idx, 0)
            gamma = rho * G_GRAV
        if gamma == 0:
            continue
        if skip_elements and idx in skip_elements:   # `deck etabs`: ya fue a las barras de borde
            continue
        if len(conn) == 2:
            i, j = conn
            p_i = np.asarray(nodes[i], dtype=float)
            p_j = np.asarray(nodes[j], dtype=float)
            # Luz libre para las VIGAS con end length offset (regla de ETABS).
            eo = element_inputs.end_offsets.get(idx)
            L = (frame_self_weight_length(p_i, p_j, eo[0], eo[1]) if eo
                 else float(np.linalg.norm(p_j - p_i)))
            A = element_inputs.areas.get(idx, 0)
            # CONSISTENTE (fuerzas + momentos de empotramiento), como frame_fixed_end_loads y
            # como CSI. Solo fuerzas daba 0.66 % contra SAP2000/ETABS con el mismo peso total.
            d = p_j - p_i
            L_full = float(np.linalg.norm(d))
            if L_full < 1e-9:
                continue
            t = d / L_full
            w = np.array([0.0, 0.0, -A * gamma * sw_multiplier])
            c = L * L / 12.0
            txw = np.cross(t, w)
            fi = np.concatenate([w * L / 2.0, c * txw])
            fj = np.concatenate([w * L / 2.0, -c * txw])
            prev = node_inputs.loads.get(i, (0, 0, 0, 0, 0, 0))
            node_inputs.loads[i] = tuple(float(prev[k] + fi[k]) for k in range(6))
            prev = node_inputs.loads.get(j, (0, 0, 0, 0, 0, 0))
            node_inputs.loads[j] = tuple(float(prev[k] + fj[k]) for k in range(6))
        elif len(conn) == 4:
            # ⚠️ el área es la REAL, no la proyectada en planta: una cubierta
            # inclinada pesa por la chapa que tiene, no por su sombra. Con la
            # proyección, el techo del galpón (9.8°) pesaba un 1.5 % de menos.
            area = _area_q4([nodes[k] for k in conn])
            t = element_inputs.thicknesses.get(idx, 0)
            W = area * t * gamma * sw_multiplier
            for n_idx in conn:
                add_load(n_idx, -W / 4)


def apply_area_load(
    nodes: Sequence[Node],
    elements: Sequence[Element],
    node_inputs: NodeInputs,
    q_kNm2: float,
    *,
    direction: tuple[float, float, float] = (0, 0, -1),
    only_shells: bool = True,
) -> None:
    """Aplica carga area q (kN/m²) a shells via apportionment by area.

    CSI Manual Ch10: el load se reparte a los 4 nodos por área tributaria.
    Para Q4 regular, cada nodo recibe ¼ × q × area_element.
    """
    if q_kNm2 == 0:
        return
    dx, dy, dz = direction
    for conn in elements:
        if only_shells and len(conn) != 4:
            continue
        if len(conn) != 4:
            continue
        coords = np.array([nodes[k][:2] for k in conn])
        x, y = coords[:, 0], coords[:, 1]
        area = 0.5 * abs((x[0]-x[2]) * (y[1]-y[3]) - (x[1]-x[3]) * (y[0]-y[2]))
        F = q_kNm2 * area / 4  # ¼ por nodo
        for n_idx in conn:
            prev = node_inputs.loads.get(n_idx, (0, 0, 0, 0, 0, 0))
            node_inputs.loads[n_idx] = (
                prev[0] + F * dx, prev[1] + F * dy, prev[2] + F * dz,
                prev[3], prev[4], prev[5],
            )


# ═══════════════════════════════════════════════════════════════════════════
# Rigid Diaphragm helper — wrapper para construcción del constraint
# ═══════════════════════════════════════════════════════════════════════════
def apply_rigid_diaphragm(
    nodes: Sequence[Node],
    floor_z: float,
    *,
    tolerance: float = 1e-6,
) -> tuple[int, list[int]]:
    """Identifica nodos de un piso (z ≈ floor_z) y selecciona master = centroide.

    Returns:
        (master_idx, slave_indices_excluding_master)
    """
    floor_idx = [i for i in range(len(nodes)) if abs(nodes[i][2] - floor_z) < tolerance]
    if not floor_idx:
        return -1, []
    # Master = nodo más cercano al centroide
    coords = np.array([nodes[i] for i in floor_idx])
    centroid = coords.mean(axis=0)
    dists = np.linalg.norm(coords - centroid, axis=1)
    master = floor_idx[int(np.argmin(dists))]
    slaves = [i for i in floor_idx if i != master]
    return master, slaves


# ═══════════════════════════════════════════════════════════════════════════
# Cardinal Point 8 (beam offset h/2 abajo del joint)
# ═══════════════════════════════════════════════════════════════════════════
def apply_cardinal_point_8(
    element_inputs: ElementInputs,
    element_idx: int,
    h_beam: float,
) -> None:
    """Sets insertion_points[idx] = (0, -h_beam/2) → CardinalPoint 8 (Top Center).

    El frame solver applies r_local = (0, -h/2, 0) como rigid arm en cada extremo.
    """
    element_inputs.insertion_points[element_idx] = (0.0, -h_beam / 2)


# ═══════════════════════════════════════════════════════════════════════════
# Stiffness modifiers (ACI 318-14 §6.6.3.1 cracked sections para sismo)
# ═══════════════════════════════════════════════════════════════════════════
ACI_318_FACTORS = {
    "col":       {"I": 0.70, "A": 1.00},
    "beam":      {"I": 0.35, "A": 1.00},
    "slab":      {"I": 0.25, "A": 1.00},
    "wall_uncracked": {"I": 0.70, "A": 1.00},
    "wall_cracked":   {"I": 0.35, "A": 1.00},
}


def apply_stiffness_modifiers(
    element_inputs: ElementInputs,
    element_idx: int,
    factor_I: float = 1.0,
    factor_A: float = 1.0,
    factor_J: float = 1.0,
) -> None:
    """Multiplica Iy, Iz, A, J por factores (cracked section ACI etc.)."""
    if element_idx in element_inputs.moments_of_inertia_y:
        element_inputs.moments_of_inertia_y[element_idx] *= factor_I
    if element_idx in element_inputs.moments_of_inertia_z:
        element_inputs.moments_of_inertia_z[element_idx] *= factor_I
    if element_idx in element_inputs.areas:
        element_inputs.areas[element_idx] *= factor_A
    if element_idx in element_inputs.torsional_constants:
        element_inputs.torsional_constants[element_idx] *= factor_J


# ═══════════════════════════════════════════════════════════════════════════
# Frame picks utilities — para validación cruzada vs ETABS
# ═══════════════════════════════════════════════════════════════════════════
def compute_picks(
    analyze_out: AnalyzeOutputs,
    frame_indices: Sequence[int] | None = None,
    *,
    unit_force_div: float = G_GRAV,  # kN → tonf (default convención ETABS)
) -> dict[str, float]:
    """Calcula |P|, |V2|, |V3|, |T|, |M2|, |M3| picos sobre los frames listados.

    Args:
        frame_indices: si None, toma todos los frames presentes en analyze_out
        unit_force_div: divide por este factor (G_GRAV → kN→tonf). Pass 1.0 para mantener kN.

    Returns:
        {"P": ..., "V2": ..., "V3": ..., "T": ..., "M2": ..., "M3": ...}
    """
    keys_maps = [
        ("P",  analyze_out.normals),
        ("V2", analyze_out.shears_y),
        ("V3", analyze_out.shears_z),
        ("T",  analyze_out.torsions),
        ("M2", analyze_out.bendings_y),
        ("M3", analyze_out.bendings_z),
    ]
    picks = {}
    for key, mp in keys_maps:
        mx = 0.0
        for idx, (vI, vJ) in mp.items():
            if frame_indices is not None and idx not in frame_indices:
                continue
            mx = max(mx, abs(vI), abs(vJ))
        picks[key] = mx / unit_force_div
    return picks


def compare_picks(
    hekatan_picks: dict[str, dict[str, float]],
    reference_picks: dict[str, dict[str, float]],
    *,
    threshold_good: float = 5.0,    # %
    threshold_ok: float = 20.0,
) -> str:
    """Genera tabla comparativa Hekatan vs Reference, devuelve string.

    Args:
        hekatan_picks: {case_name: {"P": v, "V2": v, ...}}
        reference_picks: misma estructura, los valores de referencia (e.g. ETABS)
    """
    lines = []
    lines.append(f"  {'Case':<10} {'Comp':<5} {'Hekatan':<12} {'Reference':<12} {'Δ%':<10}")
    lines.append(f"  {'-'*10} {'-'*5} {'-'*12} {'-'*12} {'-'*10}")
    for case_name, ref in reference_picks.items():
        if case_name not in hekatan_picks:
            continue
        hk = hekatan_picks[case_name]
        for comp in ["P", "V2", "V3", "T", "M2", "M3"]:
            h, e = hk.get(comp, 0), ref.get(comp, 0)
            diff = (h - e) / e * 100 if e != 0 else 0
            flag = "✓" if abs(diff) < threshold_good else ("~" if abs(diff) < threshold_ok else "✗")
            lines.append(f"  {case_name:<10} {comp:<5} {h:<12.3f} {e:<12.3f} {diff:+9.2f}% {flag}")
        lines.append("")
    return "\n".join(lines)


def score_picks(
    hekatan_picks: dict[str, dict[str, float]],
    reference_picks: dict[str, dict[str, float]],
) -> float:
    """Score sumatorio de errores relativos: menor = mejor match."""
    total = 0.0
    n = 0
    for case_name, ref in reference_picks.items():
        if case_name not in hekatan_picks:
            continue
        hk = hekatan_picks[case_name]
        for comp in ["P", "V2", "V3", "T", "M2", "M3"]:
            h, e = hk.get(comp, 0), ref.get(comp, 0)
            if e == 0:
                continue
            total += abs((h - e) / e)
            n += 1
    return total / n if n else float("inf")
