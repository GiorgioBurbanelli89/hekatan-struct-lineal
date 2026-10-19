"""Viewer PyVista 3D para resultados Hekatan-FEM-py.

Render interactivo:
  - mesh original (gris) + deformada (amplificada)
  - shells coloreados por field (w, Mxx, F11, vonMises)
  - frames coloreados por field (axial, torsion, M3)
  - supports/loads como markers
  - barra de colores y axes triad

Uso típico:
    from hekatan_fem.viz.pyvista_view import View
    v = View(nodes, elements)
    v.add_undeformed()
    v.add_deformed(u, scale='auto')
    v.add_shell_scalar(shell_indices, values=Mxx, name='Mxx [kN·m/m]')
    v.show()
"""

from __future__ import annotations
from typing import Optional, Sequence
import numpy as np

try:
    import pyvista as pv
    _HAS_PV = True
except ImportError:
    _HAS_PV = False
    pv = None  # type: ignore


class View:
    def __init__(self, nodes: np.ndarray, elements: Sequence[Sequence[int]],
                 background: str = "white"):
        if not _HAS_PV:
            raise ImportError("pyvista no instalado. pip install pyvista")
        self.nodes = np.asarray(nodes, dtype=float)
        self.elements = elements
        self.plotter = pv.Plotter(window_size=(1200, 800))
        self.plotter.set_background(background)
        self.plotter.add_axes(line_width=2)
        self.plotter.add_camera_orientation_widget()

    # ── meshes auxiliares ────────────────────────────────────
    def _shell_polydata(self, displaced_nodes: Optional[np.ndarray] = None) -> "pv.PolyData":
        coords = displaced_nodes if displaced_nodes is not None else self.nodes
        faces = []; cells = []
        for elm in self.elements:
            if len(elm) == 4:
                # heurística rápida: con thickness/coplanar -> shell
                faces.append(elm)
                cells.append(4)
        if not faces:
            return None
        face_arr = []
        for f in faces:
            face_arr.extend([4] + list(f))
        return pv.PolyData(coords, faces=np.array(face_arr, dtype=np.int64))

    def _frame_lines(self, displaced_nodes: Optional[np.ndarray] = None) -> "pv.PolyData":
        coords = displaced_nodes if displaced_nodes is not None else self.nodes
        lines = []; n_lines = 0
        for elm in self.elements:
            if len(elm) == 2:
                lines.extend([2, elm[0], elm[1]])
                n_lines += 1
        if n_lines == 0:
            return None
        return pv.PolyData(coords, lines=np.array(lines, dtype=np.int64))

    # ── overlays ───────────────────────────────────────────────
    def add_undeformed(self, color_shell="lightgray", color_frame="black",
                       opacity_shell=0.3, line_width=4):
        sh = self._shell_polydata()
        if sh is not None:
            self.plotter.add_mesh(sh, color=color_shell, opacity=opacity_shell,
                                  show_edges=True, edge_color="gray")
        fr = self._frame_lines()
        if fr is not None:
            self.plotter.add_mesh(fr, color=color_frame, line_width=line_width,
                                  render_lines_as_tubes=False)

    def deformed_nodes(self, u: np.ndarray, scale: float) -> np.ndarray:
        """Devuelve nodes + scale*[ux,uy,uz] por nodo (asume DOF order [u,v,w,...])."""
        n_nodes = self.nodes.shape[0]
        defl = self.nodes.copy()
        for i in range(n_nodes):
            defl[i, 0] += scale * u[i*6 + 0]
            defl[i, 1] += scale * u[i*6 + 1]
            defl[i, 2] += scale * u[i*6 + 2]
        return defl

    def auto_scale(self, u: np.ndarray, target_frac: float = 0.05) -> float:
        """Calcula scale tal que el max u·scale ≈ target_frac * diagonal del modelo."""
        bbox = np.ptp(self.nodes, axis=0)
        diag = float(np.linalg.norm(bbox))
        max_u = 0.0
        for i in range(self.nodes.shape[0]):
            v = np.linalg.norm(u[i*6:i*6 + 3])
            if v > max_u: max_u = v
        if max_u < 1e-15: return 1.0
        return target_frac * diag / max_u

    def add_deformed(self, u: np.ndarray, scale="auto",
                     color_shell="lightcoral", color_frame="red", opacity_shell=0.6):
        if scale == "auto":
            scale = self.auto_scale(u)
        defl = self.deformed_nodes(u, scale)
        sh = self._shell_polydata(defl)
        if sh is not None:
            self.plotter.add_mesh(sh, color=color_shell, opacity=opacity_shell,
                                  show_edges=True, edge_color="darkred")
        fr = self._frame_lines(defl)
        if fr is not None:
            self.plotter.add_mesh(fr, color=color_frame, line_width=5)
        return scale

    def add_shell_scalar(self, shell_indices: Sequence[int], values_per_elm: np.ndarray,
                         name: str = "scalar", cmap: str = "jet_r",
                         deformed: Optional[np.ndarray] = None, scale: float = 1.0):
        """Colorea shells por scalar (1 valor por elemento, e.g. Mxx centroide)."""
        coords = self.deformed_nodes(deformed, scale) if deformed is not None else self.nodes
        faces = []
        scalars = []
        for k, ei in enumerate(shell_indices):
            elm = self.elements[ei]
            if len(elm) != 4: continue
            faces.extend([4] + list(elm))
            scalars.append(values_per_elm[k])
        if not faces: return
        pd = pv.PolyData(coords, faces=np.array(faces, dtype=np.int64))
        pd.cell_data[name] = np.array(scalars)
        self.plotter.add_mesh(pd, scalars=name, cmap=cmap,
                              show_edges=True, edge_color="black",
                              scalar_bar_args={"title": name})

    def add_supports(self, node_indices: Sequence[int], color="green", size=12):
        if not node_indices: return
        pts = self.nodes[list(node_indices)]
        self.plotter.add_points(pts, color=color, point_size=size,
                                render_points_as_spheres=True)

    def add_load_arrows(self, node_indices: Sequence[int],
                        load_vectors: np.ndarray, color="orange", scale=0.5):
        """Dibuja flechas de cargas en los nodos cargados."""
        if not node_indices: return
        pts = self.nodes[list(node_indices)]
        vecs = np.asarray(load_vectors, dtype=float)
        self.plotter.add_arrows(pts, vecs, mag=scale, color=color)

    def show(self, screenshot: Optional[str] = None):
        if screenshot:
            self.plotter.show(screenshot=screenshot)
        else:
            self.plotter.show()

    def close(self):
        self.plotter.close()
