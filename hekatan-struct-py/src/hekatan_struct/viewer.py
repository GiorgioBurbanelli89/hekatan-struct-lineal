"""3D Viewer — espejo de getViewer() del fork original v2 (Three.js → PyVista).

Renderiza geometría (frames + shells), deformada, supports, loads en una ventana
PyVista standalone con sliders interactivos VTK.

Equivalencia conceptual:

    fork original v2 JS: getViewer({ mesh, settingsObj }).appendChild(document.body)
    hekatan_struct:       View(nodes, elements, ...).show()

API mínimo:

    from hekatan_struct import deform, NodeInputs, ElementInputs
    from hekatan_struct.viewer import View

    # ... define modelo ...
    out = deform(nodes, elements, ni, ei)
    v = View(nodes, elements)
    v.set_deformation(out, scale="auto")
    v.set_supports(ni)
    v.set_loads(ni)
    v.show()  # abre ventana 3D con controls

Para sliders paramétricos interactivos en tiempo real:

    v.add_slider("L", 2.0, 8.0, 4.0, callback=on_length_change)
    v.add_slider("P", 1.0, 100.0, 10.0, callback=on_load_change)
"""
from __future__ import annotations
from typing import Callable, Optional, Sequence
import numpy as np

try:
    import pyvista as pv
    HAS_PYVISTA = True
except ImportError:
    HAS_PYVISTA = False
    pv = None  # type: ignore

from .data_model import Node, Element, NodeInputs, ElementInputs, DeformOutputs, SectionShape
from .elements.frame import frame_local_axes_csi


# ═══════════════════════════════════════════════════════════════════════════
# Helpers — convertir geometría a PyVista PolyData/UnstructuredGrid
# ═══════════════════════════════════════════════════════════════════════════
def _frames_to_lines(nodes: Sequence[Node], elements: Sequence[Element]) -> Optional["pv.PolyData"]:
    """Frames (2-nodos) → líneas PyVista."""
    if not HAS_PYVISTA:
        return None
    points: list[Node] = []
    lines: list[int] = []
    idx_map: dict[int, int] = {}
    for conn in elements:
        if len(conn) != 2:
            continue
        for n_idx in conn:
            if n_idx not in idx_map:
                idx_map[n_idx] = len(points)
                points.append(nodes[n_idx])
        lines.extend([2, idx_map[conn[0]], idx_map[conn[1]]])
    if not points:
        return None
    pdata = pv.PolyData(np.array(points), lines=lines)
    return pdata


def _frame_box_corners(p_i: np.ndarray, p_j: np.ndarray, b: float, h: float
                       ) -> tuple[np.ndarray, list[int]]:
    """Genera 8 vértices de la caja extruida del frame y conectividad de las 6 caras.

    Sigue la convención CSI §7.4: b along Local 2, h along Local 3.
    Retorna (vertices (8,3), faces flat list para PolyData).
    """
    e1, e2, e3, L = frame_local_axes_csi(p_i, p_j)
    half_b = b / 2
    half_h = h / 2
    # 8 vértices: 4 en cada extremo
    # End I: 4 corners around p_i: ± half_b along e2, ± half_h along e3
    v = np.zeros((8, 3))
    for k, (sb, sh) in enumerate([(-1, -1), (1, -1), (1, 1), (-1, 1)]):
        v[k]   = p_i + sb * half_b * e2 + sh * half_h * e3
        v[k+4] = p_j + sb * half_b * e2 + sh * half_h * e3
    # Faces (4 corners, must specify N=4 first): bottom, top, +e2, -e2, +e3, -e3
    faces = []
    quads = [
        [0, 1, 2, 3],   # end I cap
        [4, 5, 6, 7],   # end J cap
        [0, 1, 5, 4],   # -e3 face
        [1, 2, 6, 5],   # +e2 face
        [2, 3, 7, 6],   # +e3 face
        [3, 0, 4, 7],   # -e2 face
    ]
    for q in quads:
        faces.extend([4, *q])
    return v, faces


def _deformed_polyline_hermite(
    p_i: np.ndarray, p_j: np.ndarray,
    u_i: tuple[float, ...], u_j: tuple[float, ...],
    scale: float, n_subdiv: int = 30,
) -> np.ndarray:
    """Interpola la curva deformada via Hermite cubic en el LOCAL frame del elemento.

    Para un beam Euler-Bernoulli, la forma deformada entre 2 nodos NO es lineal:
    es una CÚBICA función de las rotaciones nodales + traslaciones.

    Args:
        p_i, p_j: posiciones globales de los extremos
        u_i, u_j: (Ux, Uy, Uz, Rx, Ry, Rz) en frame GLOBAL en cada extremo
        scale: factor de amplificación de la deformada
        n_subdiv: # puntos intermedios

    Returns:
        ndarray (n_subdiv+1, 3): puntos del polyline deformado en GLOBAL.
    """
    e1, e2, e3, L = frame_local_axes_csi(p_i, p_j)
    R = np.column_stack([e1, e2, e3])  # global → local mapping
    # Convert global disp/rot to local
    u_i_glob_trans = np.array(u_i[:3])
    u_i_glob_rot   = np.array(u_i[3:6])
    u_j_glob_trans = np.array(u_j[:3])
    u_j_glob_rot   = np.array(u_j[3:6])
    u_i_loc_trans = R.T @ u_i_glob_trans
    u_i_loc_rot   = R.T @ u_i_glob_rot
    u_j_loc_trans = R.T @ u_j_glob_trans
    u_j_loc_rot   = R.T @ u_j_glob_rot

    pts = np.zeros((n_subdiv + 1, 3))
    for k in range(n_subdiv + 1):
        xi = k / n_subdiv
        # Hermite shape functions
        N1 = 1 - 3*xi**2 + 2*xi**3
        N2 = xi - 2*xi**2 + xi**3
        N3 = 3*xi**2 - 2*xi**3
        N4 = -xi**2 + xi**3
        # Linear interpolation for axial component (no curvature in axial)
        u_loc_1 = (1 - xi) * u_i_loc_trans[0] + xi * u_j_loc_trans[0]
        # Bending in Local 1-2 plane → depends on rotation θ_z (local) at each end
        # u_2(ξ) = N1·u2_I + N2·L·θz_I + N3·u2_J + N4·L·θz_J
        u_loc_2 = (
            N1 * u_i_loc_trans[1] + N2 * L * u_i_loc_rot[2]
            + N3 * u_j_loc_trans[1] + N4 * L * u_j_loc_rot[2]
        )
        # Bending in Local 1-3 plane → depends on rotation θ_y (local); signo negativo (right-hand rule)
        # u_3(ξ) = N1·u3_I - N2·L·θy_I + N3·u3_J - N4·L·θy_J
        u_loc_3 = (
            N1 * u_i_loc_trans[2] - N2 * L * u_i_loc_rot[1]
            + N3 * u_j_loc_trans[2] - N4 * L * u_j_loc_rot[1]
        )
        # Position in local frame along beam length axis
        x_axial = xi * L
        # Build local-coord point relative to p_i: (x_axial, 0, 0) + displacement
        local_pt = np.array([x_axial + scale * u_loc_1,
                             scale * u_loc_2,
                             scale * u_loc_3])
        # Transform to global
        pts[k] = p_i + R @ local_pt
    return pts


def _deformed_polylines_collection(
    nodes: Sequence[Node], elements: Sequence[Element],
    deform_out: "DeformOutputs", scale: float, n_subdiv: int = 30,
) -> Optional["pv.PolyData"]:
    """Ensambla todos los polylines deformados (Hermite cubic) en un solo PolyData."""
    if not HAS_PYVISTA:
        return None
    all_pts = []
    all_lines = []
    offset = 0
    has_any = False
    for conn in elements:
        if len(conn) != 2:
            continue
        i, j = conn
        u_i = deform_out.deformations.get(i, (0,)*6)
        u_j = deform_out.deformations.get(j, (0,)*6)
        p_i = np.asarray(nodes[i], dtype=float)
        p_j = np.asarray(nodes[j], dtype=float)
        pts = _deformed_polyline_hermite(p_i, p_j, u_i, u_j, scale, n_subdiv)
        # Build polyline: [n_subdiv+1, p0, p1, ..., pN]
        all_pts.append(pts)
        line_cells = [pts.shape[0]] + [offset + k for k in range(pts.shape[0])]
        all_lines.extend(line_cells)
        offset += pts.shape[0]
        has_any = True
    if not has_any:
        return None
    return pv.PolyData(np.vstack(all_pts), lines=all_lines)


def _frames_to_boxes(
    nodes: Sequence[Node], elements: Sequence[Element],
    element_inputs: Optional[ElementInputs] = None,
    default_b: float = 0.05, default_h: float = 0.05,
) -> Optional["pv.PolyData"]:
    """Frames con sección rect → cajas extruidas 3D.

    Usa element_inputs.section_shapes[idx] si está, sino (default_b, default_h).
    """
    if not HAS_PYVISTA:
        return None
    all_verts = []
    all_faces = []
    offset = 0
    has_any = False
    for idx, conn in enumerate(elements):
        if len(conn) != 2:
            continue
        p_i = np.asarray(nodes[conn[0]], dtype=float)
        p_j = np.asarray(nodes[conn[1]], dtype=float)
        # Buscar sección
        b, h = default_b, default_h
        if element_inputs and idx in element_inputs.section_shapes:
            sec = element_inputs.section_shapes[idx]
            if sec.b is not None and sec.h is not None:
                b, h = sec.b, sec.h
            elif sec.d is not None:
                b, h = sec.d, sec.d  # circ → cuadrado aprox visual
        verts, faces = _frame_box_corners(p_i, p_j, b, h)
        # Re-indexar faces con offset
        offset_faces = []
        i = 0
        while i < len(faces):
            n = faces[i]
            offset_faces.append(n)
            for k in range(n):
                offset_faces.append(faces[i + 1 + k] + offset)
            i += n + 1
        all_verts.append(verts)
        all_faces.extend(offset_faces)
        offset += len(verts)
        has_any = True
    if not has_any:
        return None
    return pv.PolyData(np.vstack(all_verts), faces=all_faces)


def _shells_to_quads(nodes: Sequence[Node], elements: Sequence[Element]) -> Optional["pv.PolyData"]:
    """Shells Q4 (4 nodos) → quads PyVista."""
    if not HAS_PYVISTA:
        return None
    points: list[Node] = []
    faces: list[int] = []
    idx_map: dict[int, int] = {}
    for conn in elements:
        if len(conn) != 4:
            continue
        for n_idx in conn:
            if n_idx not in idx_map:
                idx_map[n_idx] = len(points)
                points.append(nodes[n_idx])
        faces.extend([4, idx_map[conn[0]], idx_map[conn[1]], idx_map[conn[2]], idx_map[conn[3]]])
    if not points:
        return None
    return pv.PolyData(np.array(points), faces=faces)


def _support_glyphs(nodes: Sequence[Node], node_inputs: NodeInputs,
                    size: float = 0.15) -> Optional["pv.PolyData"]:
    """Triángulos (conos) para nodos restringidos."""
    if not HAS_PYVISTA:
        return None
    if not node_inputs.supports:
        return None
    pts = []
    for n_idx, restraints in node_inputs.supports.items():
        if any(restraints):
            pts.append(nodes[n_idx])
    if not pts:
        return None
    glyphs = pv.PolyData(np.array(pts))
    return glyphs.glyph(geom=pv.Cone(direction=(0, 0, -1), height=size, radius=size/2),
                        scale=False, factor=1.0)


def _load_arrows(nodes: Sequence[Node], node_inputs: NodeInputs,
                 scale: float = 0.5) -> Optional["pv.PolyData"]:
    """Flechas para cargas nodales (Fx, Fy, Fz solo)."""
    if not HAS_PYVISTA:
        return None
    if not node_inputs.loads:
        return None
    pts = []
    vecs = []
    for n_idx, load in node_inputs.loads.items():
        F = np.array(load[:3])
        if np.linalg.norm(F) < 1e-9:
            continue
        pts.append(nodes[n_idx])
        vecs.append(F)
    if not pts:
        return None
    glyphs = pv.PolyData(np.array(pts))
    glyphs["vectors"] = np.array(vecs)
    return glyphs.glyph(orient="vectors", scale="vectors", factor=scale)


# ═══════════════════════════════════════════════════════════════════════════
# View class
# ═══════════════════════════════════════════════════════════════════════════
class View:
    """Viewer 3D PyVista — espejo de getViewer() del fork original v2.

    Args:
        nodes, elements: geometría del modelo
        background: color de fondo del viewer
        show_axes: muestra orientación XYZ en esquina
    """
    def __init__(
        self,
        nodes: Sequence[Node],
        elements: Sequence[Element],
        *,
        element_inputs: Optional[ElementInputs] = None,
        background: str = "white",
        show_axes: bool = True,
        show_grid: bool = True,
        section_render: str = "auto",  # "auto" → boxes si section_shapes existen, sino lines
        off_screen: Optional[bool] = None,  # True = sin ventana (PNG desde terminal)
    ):
        if not HAS_PYVISTA:
            raise ImportError(
                "pyvista no instalado. pip install hekatan-struct-py[viewer]"
            )
        self.nodes = list(nodes)
        self.elements = list(elements)
        self.element_inputs = element_inputs
        self.section_render = section_render
        self._deform: Optional[DeformOutputs] = None
        self._deform_scale: float = 0
        self._node_inputs: Optional[NodeInputs] = None
        self._sliders: list[dict] = []

        # off_screen=None deja decidir a pyvista (ventana si hay pantalla). Con
        # True no se abre ventana y `screenshot()` puede capturar: sin esto
        # pyvista contesta "Nothing to screenshot - call .show first".
        self.plotter = pv.Plotter(window_size=(1280, 800), off_screen=off_screen)
        self.plotter.set_background(background)
        if show_axes:
            self.plotter.add_axes(line_width=3)
        if show_grid:
            self.plotter.show_grid(color="gray")
        self._mesh_actors: dict[str, "pv.Actor"] = {}
        self._rebuild_geometry()

    # ── Build / rebuild ──────────────────────────────────────────────
    def _rebuild_geometry(self):
        """Limpia y vuelve a renderizar la geometría base."""
        for name, actor in self._mesh_actors.items():
            self.plotter.remove_actor(actor)
        self._mesh_actors.clear()

        # Frames como cajas 3D si hay section_shapes, sino como líneas
        use_boxes = (
            self.section_render == "boxes"
            or (self.section_render == "auto"
                and self.element_inputs is not None
                and len(self.element_inputs.section_shapes) > 0)
        )
        if use_boxes:
            boxes = _frames_to_boxes(self.nodes, self.elements, self.element_inputs)
            if boxes is not None:
                actor = self.plotter.add_mesh(
                    boxes, color="#1f3a93", show_edges=True, edge_color="#0a1e57",
                    opacity=0.9, label="frames",
                )
                self._mesh_actors["frames"] = actor
        else:
            frames_mesh = _frames_to_lines(self.nodes, self.elements)
            if frames_mesh is not None:
                actor = self.plotter.add_mesh(
                    frames_mesh, color="#1f3a93", line_width=6, label="frames",
                )
                self._mesh_actors["frames"] = actor

        # Shells (quads gris claro)
        shells_mesh = _shells_to_quads(self.nodes, self.elements)
        if shells_mesh is not None:
            actor = self.plotter.add_mesh(
                shells_mesh, color="#bdc3c7", opacity=0.7, show_edges=True,
                edge_color="#34495e", label="shells",
            )
            self._mesh_actors["shells"] = actor

        # Nodos como puntos pequeños
        nodes_arr = np.array(self.nodes)
        nodes_pdata = pv.PolyData(nodes_arr)
        actor = self.plotter.add_mesh(
            nodes_pdata, color="black", point_size=8, render_points_as_spheres=True,
            label="nodes",
        )
        self._mesh_actors["nodes"] = actor

        # Soportes (conos rojos hacia abajo) — escalado a 6% del span del modelo
        if self._node_inputs:
            sup = _support_glyphs(self.nodes, self._node_inputs, size=self._char_size() * 0.06)
            if sup is not None:
                actor = self.plotter.add_mesh(sup, color="#c0392b", label="supports")
                self._mesh_actors["supports"] = actor

            # Cargas (flechas verdes) — escala adaptativa al max load
            max_load = max(
                (np.linalg.norm(L[:3]) for L in self._node_inputs.loads.values()),
                default=1.0,
            )
            arrow_scale = self._char_size() * 0.15 / max_load if max_load > 0 else 0.1
            lds = _load_arrows(self.nodes, self._node_inputs, scale=arrow_scale)
            if lds is not None:
                actor = self.plotter.add_mesh(lds, color="#27ae60", label="loads")
                self._mesh_actors["loads"] = actor

        # Deformada — curva CÚBICA Hermite (no solo conectar extremos)
        if self._deform is not None and self._deform_scale > 0:
            # Frames: usar interpolación Hermite cubica para ver la CURVA real
            def_polyline = _deformed_polylines_collection(
                self.nodes, self.elements, self._deform,
                scale=self._deform_scale, n_subdiv=30,
            )
            if def_polyline is not None:
                actor = self.plotter.add_mesh(
                    def_polyline, color="#c0392b", line_width=6, label="deformed",
                )
                self._mesh_actors["deformed"] = actor

            # Shells: solo desplazar nodos (sin curvatura interna de Q4)
            def_nodes = []
            for i, n in enumerate(self.nodes):
                d = self._deform.deformations.get(i, (0, 0, 0, 0, 0, 0))
                def_nodes.append((
                    n[0] + d[0] * self._deform_scale,
                    n[1] + d[1] * self._deform_scale,
                    n[2] + d[2] * self._deform_scale,
                ))
            def_shells = _shells_to_quads(def_nodes, self.elements)
            if def_shells is not None:
                actor = self.plotter.add_mesh(
                    def_shells, color="#e74c3c", opacity=0.5,
                    show_edges=True, edge_color="#c0392b", label="deformed_shells",
                )
                self._mesh_actors["deformed_shells"] = actor

    def _char_size(self) -> float:
        """Tamaño característico del modelo (para escalar glyphs)."""
        arr = np.array(self.nodes)
        if len(arr) < 2:
            return 1.0
        span = arr.max(axis=0) - arr.min(axis=0)
        return float(np.max(span)) or 1.0

    # ── Setters ──────────────────────────────────────────────────────
    def set_deformation(self, deform_out: DeformOutputs, scale: float | str = "auto") -> "View":
        """Setea la deformada y rebuilds. scale='auto' → 25% del diagonal."""
        self._deform = deform_out
        if scale == "auto":
            # Auto-scale: max deformation ~ 25% del span del modelo
            max_d = max(
                max(abs(v) for v in (d[0], d[1], d[2]))
                for d in deform_out.deformations.values()
            ) if deform_out.deformations else 1.0
            target = 0.25 * self._char_size()
            self._deform_scale = target / max_d if max_d > 1e-9 else 1.0
        else:
            self._deform_scale = float(scale)
        self._rebuild_geometry()
        return self

    def set_supports(self, node_inputs: NodeInputs) -> "View":
        self._node_inputs = node_inputs
        self._rebuild_geometry()
        return self

    def set_loads(self, node_inputs: NodeInputs) -> "View":
        self._node_inputs = node_inputs
        self._rebuild_geometry()
        return self

    # ── Sliders ──────────────────────────────────────────────────────
    def add_slider(
        self,
        name: str,
        min_val: float,
        max_val: float,
        default: float,
        callback: Callable[[float], None],
        *,
        pointa: tuple[float, float] = (0.025, 0.10),
        pointb: tuple[float, float] = (0.31, 0.10),
    ) -> "View":
        """Agrega un slider VTK al viewer. callback recibe el nuevo valor."""
        n_existing = len(self._sliders)
        # Stack sliders vertically
        y = 0.10 + 0.07 * n_existing
        self.plotter.add_slider_widget(
            callback=callback,
            rng=[min_val, max_val],
            value=default,
            title=name,
            pointa=(pointa[0], y),
            pointb=(pointb[0], y),
            style="modern",
            slider_width=0.02,
            tube_width=0.005,
        )
        self._sliders.append({"name": name, "min": min_val, "max": max_val, "default": default})
        return self

    # ── Display ──────────────────────────────────────────────────────
    def show(self, *, screenshot: Optional[str] = None, auto_close: bool = False):
        """Abre la ventana interactiva 3D."""
        self.plotter.view_isometric()
        self.plotter.add_legend()
        if screenshot:
            self.plotter.show(screenshot=screenshot, auto_close=auto_close)
        else:
            self.plotter.show(auto_close=auto_close)

    def screenshot(self, path: str, *, off_screen: bool = True) -> str:
        """Headless screenshot — útil para tests.

        El `off_screen` se IGNORABA: el plotter se creaba siempre en modo
        ventana y pyvista contestaba "Nothing to screenshot - call .show first
        or use the off_screen argument". Ahora, si el plotter no es off_screen,
        se renderiza una vez con `show(auto_close=False)` antes de capturar.
        """
        self.plotter.view_isometric()
        if off_screen and not self.plotter.off_screen:
            self.plotter.show(auto_close=False)
        self.plotter.screenshot(path)
        return path

    def close(self):
        self.plotter.close()
