# -*- coding: utf-8 -*-
"""Mesa Torsion - GUI Qt + PyVista para Hekatan-Struct

Ventana interactiva con:
  - Dock izquierdo: switches (rigid diaphragm, cardinal point 8, cracking, mesh, formulacion)
  - Vista 3D central (pyvistaqt): columnas como cajas, vigas como cajas, losa como shells,
    soportes como conos rojos abajo, cargas como flechas, deformada en rojo (Hermite cubica
    para frames + nodos desplazados para shells).
  - Dock derecho: panel resultados con picks por caso vs ETABS, periodos modales.

Run:
    pip install pyvistaqt PyQt5
    python examples/mesa_torsion_gui.py

O desde el CLI:
    python examples/mesa_torsion_cli.py --gui
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent.absolute()
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "src"))
sys.path.insert(0, str(HERE))

import mesa_torsion_iterate as MT
from hekatan_struct import (
    NodeInputs, DeformOutputs,
    modal_analysis,
    compute_picks,
)
from hekatan_struct.extensions import apply_selfweight, apply_area_load, G_GRAV
from hekatan_struct.viewer import (
    _frames_to_boxes, _shells_to_quads, _support_glyphs,
    _load_arrows, _deformed_polylines_collection,
)
import hekatan_struct.solver as solver
from hekatan_struct.solver import _assemble_K, _apply_supports_penalty, _assemble_F

try:
    from PyQt5 import QtWidgets, QtCore
    from pyvistaqt import QtInteractor
    import pyvista as pv
except ImportError as e:
    print(f"GUI dependencies missing: {e}")
    print("Run: pip install pyvistaqt PyQt5 pyvista")
    sys.exit(1)


ETABS_REF_DEFAULT = (
    ROOT.parent / "validacion" / "Api CSI Computers" / "etabs-api" /
    "python-verificado" / "mesa_torsion_user_etabs_results.json"
)


# ============================================================================
# Helpers solver (analogos al CLI)
# ============================================================================
CASES = [
    {"name": "Dead",   "sw": 1.0, "q_scp": 0,   "q_live": 0},
    {"name": "Live",   "sw": 0,   "q_scp": 0,   "q_live": 0.5},
    {"name": "SCP",    "sw": 0,   "q_scp": 1.0, "q_live": 0},
    {"name": "UDCon1", "sw": 1.4, "q_scp": 1.4, "q_live": 0},
    {"name": "UDCon2", "sw": 1.2, "q_scp": 1.2, "q_live": 0.8},
]


def solve_case_deform(nodes, elements, base_ni, ei, master_idx, slaves,
                      sw_mult: float, q_scp_tm2: float, q_live_tm2: float,
                      rigid_diaphragm: bool) -> DeformOutputs:
    """Resuelve un caso y devuelve DeformOutputs (para deformada en pantalla)."""
    ni = NodeInputs(supports=dict(base_ni.supports), loads={})
    if sw_mult != 0:
        apply_selfweight(nodes, elements, ei, ni, sw_multiplier=sw_mult)
    q_total = (q_scp_tm2 + q_live_tm2) * G_GRAV
    apply_area_load(nodes, elements, ni, q_total)

    K = _assemble_K(nodes, elements, ei)
    if rigid_diaphragm and master_idx >= 0:
        penalty = 1e10 * np.max(np.abs(np.diag(K)))
        n_total = K.shape[0]
        pm = np.asarray(nodes[master_idx])
        for slave in slaves:
            ps = np.asarray(nodes[slave])
            dx, dy = ps[0] - pm[0], ps[1] - pm[1]
            for dof_local, coef in [(0, dy), (1, -dx), (5, 0)]:
                c = np.zeros(n_total)
                c[6 * slave + dof_local] = 1
                c[6 * master_idx + dof_local] = -1
                if dof_local in (0, 1):
                    c[6 * master_idx + 5] = coef
                K += penalty * np.outer(c, c)
    F = _assemble_F(nodes, ni)
    K_bc, F_bc = _apply_supports_penalty(K, F, ni)
    U = np.linalg.solve(K_bc, F_bc)
    out = DeformOutputs()
    for i in range(len(nodes)):
        out.deformations[i] = tuple(U[6 * i:6 * i + 6])
    return out, ni


# ============================================================================
# Ventana principal
# ============================================================================
class MesaTorsionWindow(QtWidgets.QMainWindow):
    def __init__(self, initial: dict | None = None):
        super().__init__()
        self.setWindowTitle("Mesa Torsion - Hekatan Struct (Python)")
        self.resize(1600, 950)

        initial = initial or {}
        self.state = {
            "nmesh":            initial.get("nmesh", 5),
            "rigid_diaphragm":  initial.get("rigid_diaphragm", False),
            "cardinal_point_8": initial.get("cardinal_point_8", False),
            "crack_col":        initial.get("crack_col_factor", 1.0),
            "crack_beam":       initial.get("crack_beam_factor", 1.0),
            "crack_slab":       initial.get("crack_slab_factor", 1.0),
            "shell_form":       "mzc",
            "active_case":      "UDCon2",
            "deform_scale_pct": 25.0,   # % del span
        }
        self._etabs_ref = self._load_etabs_ref()

        # ----- Vista central (PyVista) -----
        self.plotter = QtInteractor(self)
        self.setCentralWidget(self.plotter.interactor)
        self.plotter.set_background("white")
        self.plotter.show_grid(color="gray")
        self.plotter.add_axes(line_width=3)

        # ----- Dock parametros (izquierda) -----
        self._build_param_dock()
        # ----- Dock resultados (derecha) -----
        self._build_results_dock()
        # ----- Barra de estado -----
        self.status = self.statusBar()
        self.status.showMessage("Listo. Pulsa 'Recalcular' para correr el modelo.")

        # Actores activos para limpieza incremental
        self._actors: dict[str, object] = {}
        # Render inicial (solo geometria, sin deformada)
        self._rebuild_model()
        self._render_model()

    # ------------------------------------------------------------------
    # Construccion docks
    # ------------------------------------------------------------------
    def _build_param_dock(self):
        dock = QtWidgets.QDockWidget("Parametros", self)
        dock.setMinimumWidth(330)
        widget = QtWidgets.QWidget()
        form = QtWidgets.QFormLayout(widget)

        # Mesh
        self.spn_mesh = QtWidgets.QSpinBox()
        self.spn_mesh.setRange(2, 12)
        self.spn_mesh.setValue(self.state["nmesh"])
        form.addRow("nmesh (subdivisiones losa):", self.spn_mesh)

        # Switches booleanos
        self.chk_diaph = QtWidgets.QCheckBox("Diafragma rigido (Ux/Uy/Rz)")
        self.chk_diaph.setChecked(self.state["rigid_diaphragm"])
        form.addRow(self.chk_diaph)

        self.chk_cp8 = QtWidgets.QCheckBox("Cardinal Point 8 (vigas Top Center)")
        self.chk_cp8.setChecked(self.state["cardinal_point_8"])
        form.addRow(self.chk_cp8)

        # Cracking
        self.dsb_crack_col = QtWidgets.QDoubleSpinBox()
        self.dsb_crack_col.setRange(0.05, 1.0); self.dsb_crack_col.setSingleStep(0.05)
        self.dsb_crack_col.setValue(self.state["crack_col"])
        form.addRow("Cracking columnas (I_eff/I):", self.dsb_crack_col)

        self.dsb_crack_beam = QtWidgets.QDoubleSpinBox()
        self.dsb_crack_beam.setRange(0.05, 1.0); self.dsb_crack_beam.setSingleStep(0.05)
        self.dsb_crack_beam.setValue(self.state["crack_beam"])
        form.addRow("Cracking vigas (I_eff/I):", self.dsb_crack_beam)

        self.dsb_crack_slab = QtWidgets.QDoubleSpinBox()
        self.dsb_crack_slab.setRange(0.05, 1.0); self.dsb_crack_slab.setSingleStep(0.05)
        self.dsb_crack_slab.setValue(self.state["crack_slab"])
        form.addRow("Cracking losa (E_eff/E):", self.dsb_crack_slab)

        # Formulacion
        self.cmb_shell = QtWidgets.QComboBox()
        self.cmb_shell.addItems(["mzc (Kirchhoff = ETABS Shell-Thin)", "wilson (Q4 + drilling)"])
        form.addRow("Formulacion shell:", self.cmb_shell)

        # Caso a visualizar
        self.cmb_case = QtWidgets.QComboBox()
        self.cmb_case.addItems([c["name"] for c in CASES])
        self.cmb_case.setCurrentText(self.state["active_case"])
        form.addRow("Caso (deformada):", self.cmb_case)

        # Escala deformada
        self.dsb_scale = QtWidgets.QDoubleSpinBox()
        self.dsb_scale.setRange(0.0, 200.0); self.dsb_scale.setSingleStep(5.0)
        self.dsb_scale.setSuffix(" %")
        self.dsb_scale.setValue(self.state["deform_scale_pct"])
        form.addRow("Escala deformada (% span):", self.dsb_scale)

        # Boton
        self.btn_run = QtWidgets.QPushButton("Recalcular (static + modal)")
        self.btn_run.setStyleSheet(
            "QPushButton{background:#1f3a93;color:white;padding:8px;font-weight:bold;}"
            "QPushButton:hover{background:#2c4ea8;}"
        )
        self.btn_run.clicked.connect(self._on_run_clicked)
        form.addRow(self.btn_run)

        # Acciones secundarias
        row = QtWidgets.QHBoxLayout()
        self.btn_compare = QtWidgets.QPushButton("Comparar ETABS")
        self.btn_compare.clicked.connect(self._on_compare_clicked)
        self.btn_screenshot = QtWidgets.QPushButton("Screenshot")
        self.btn_screenshot.clicked.connect(self._on_screenshot_clicked)
        row.addWidget(self.btn_compare); row.addWidget(self.btn_screenshot)
        wrow = QtWidgets.QWidget(); wrow.setLayout(row)
        form.addRow(wrow)

        # Conexion live de algunos controles que solo afectan render
        self.cmb_case.currentTextChanged.connect(self._on_case_changed)
        self.dsb_scale.valueChanged.connect(lambda _: self._render_model())

        dock.setWidget(widget)
        self.addDockWidget(QtCore.Qt.LeftDockWidgetArea, dock)

    def _build_results_dock(self):
        dock = QtWidgets.QDockWidget("Resultados", self)
        dock.setMinimumWidth(420)
        widget = QtWidgets.QWidget()
        lay = QtWidgets.QVBoxLayout(widget)

        # Tabla picks
        lay.addWidget(QtWidgets.QLabel("Picks Frames vs ETABS [tonf, tonf-m]:"))
        self.tbl_picks = QtWidgets.QTableWidget(5, 7)
        self.tbl_picks.setHorizontalHeaderLabels(["Caso", "|P|", "|V2|", "|V3|", "|T|", "|M2|", "|M3|"])
        self.tbl_picks.verticalHeader().setVisible(False)
        self.tbl_picks.horizontalHeader().setStretchLastSection(True)
        for i, c in enumerate(CASES):
            it = QtWidgets.QTableWidgetItem(c["name"]); it.setFlags(QtCore.Qt.ItemIsEnabled)
            self.tbl_picks.setItem(i, 0, it)
        lay.addWidget(self.tbl_picks)

        # Tabla modal
        lay.addWidget(QtWidgets.QLabel("Periodos modales:"))
        self.tbl_modal = QtWidgets.QTableWidget(12, 4)
        self.tbl_modal.setHorizontalHeaderLabels(["Modo", "T [s]", "T_ETABS [s]", "diff %"])
        self.tbl_modal.verticalHeader().setVisible(False)
        for i in range(12):
            it = QtWidgets.QTableWidgetItem(str(i + 1)); it.setFlags(QtCore.Qt.ItemIsEnabled)
            self.tbl_modal.setItem(i, 0, it)
        lay.addWidget(self.tbl_modal)

        # Resumen
        self.lbl_summary = QtWidgets.QLabel("(sin correr)")
        self.lbl_summary.setStyleSheet(
            "background:#ecf0f1;padding:8px;font-family:monospace;font-size:11px;"
        )
        self.lbl_summary.setWordWrap(True)
        lay.addWidget(self.lbl_summary)

        dock.setWidget(widget)
        self.addDockWidget(QtCore.Qt.RightDockWidgetArea, dock)

    # ------------------------------------------------------------------
    # Solver / model
    # ------------------------------------------------------------------
    def _load_etabs_ref(self) -> dict:
        try:
            if ETABS_REF_DEFAULT.exists():
                with open(ETABS_REF_DEFAULT, encoding="utf-8") as fh:
                    return json.load(fh)
        except Exception as e:
            print(f"  ! ETABS ref no cargada: {e}")
        return {}

    def _sync_state_from_ui(self):
        self.state["nmesh"]            = self.spn_mesh.value()
        self.state["rigid_diaphragm"]  = self.chk_diaph.isChecked()
        self.state["cardinal_point_8"] = self.chk_cp8.isChecked()
        self.state["crack_col"]        = self.dsb_crack_col.value()
        self.state["crack_beam"]       = self.dsb_crack_beam.value()
        self.state["crack_slab"]       = self.dsb_crack_slab.value()
        self.state["shell_form"]       = "mzc" if self.cmb_shell.currentIndex() == 0 else "wilson"
        self.state["active_case"]      = self.cmb_case.currentText()
        self.state["deform_scale_pct"] = self.dsb_scale.value()

    def _rebuild_model(self):
        """Construye geometria + element_inputs segun switches actuales."""
        self._sync_state_from_ui()
        solver.USE_KIRCHHOFF_MZC = (self.state["shell_form"] == "mzc")
        s = self.state
        (nodes, elements, base_ni, ei,
         master_idx, slaves, col_end, beam_end) = MT.build_mesa_torsion(
            nmesh=s["nmesh"],
            rigid_diaphragm=s["rigid_diaphragm"],
            cardinal_point_8=s["cardinal_point_8"],
            slab_membrane=True,
            crack_col_factor=s["crack_col"],
            crack_beam_factor=s["crack_beam"],
            crack_slab_factor=s["crack_slab"],
        )
        # Para visualizacion no queremos mostrar el nodo virtual master
        if master_idx >= 0:
            self._n_real = master_idx
        else:
            self._n_real = len(nodes)
        self._model = (nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end)
        self._deform_by_case: dict[str, DeformOutputs] = {}

    # ------------------------------------------------------------------
    # Render
    # ------------------------------------------------------------------
    def _render_model(self):
        if not hasattr(self, "_model"):
            return
        nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = self._model
        n_real = self._n_real
        nodes_show = list(nodes[:n_real])
        # Limpia actores
        for k, a in list(self._actors.items()):
            try:
                self.plotter.remove_actor(a)
            except Exception:
                pass
        self._actors.clear()

        # Cajas frame (cols + vigas) — coloreadas distinto
        col_elems = elements[:col_end]
        beam_elems = elements[col_end:beam_end]
        shell_elems = elements[beam_end:]

        from hekatan_struct.data_model import ElementInputs
        ei_cols = ElementInputs(section_shapes={i: ei.section_shapes.get(i) for i in range(col_end) if i in ei.section_shapes})
        boxes_cols = _frames_to_boxes(nodes_show, col_elems, ei_cols)
        if boxes_cols is not None:
            self._actors["cols"] = self.plotter.add_mesh(
                boxes_cols, color="#1f3a93", show_edges=True, edge_color="#0a1e57",
                opacity=0.92,
            )
        ei_beams = ElementInputs(section_shapes={
            i: ei.section_shapes.get(col_end + i)
            for i in range(len(beam_elems)) if (col_end + i) in ei.section_shapes
        })
        boxes_beams = _frames_to_boxes(nodes_show, beam_elems, ei_beams)
        if boxes_beams is not None:
            self._actors["beams"] = self.plotter.add_mesh(
                boxes_beams, color="#16a085", show_edges=True, edge_color="#0c5a48",
                opacity=0.92,
            )

        # Losa shells (gris)
        shells_pd = _shells_to_quads(nodes_show, shell_elems)
        if shells_pd is not None:
            self._actors["slab"] = self.plotter.add_mesh(
                shells_pd, color="#bdc3c7", opacity=0.55, show_edges=True,
                edge_color="#34495e",
            )

        # Soportes (conos rojos)
        char = self._char_size(nodes_show)
        sup = _support_glyphs(nodes_show, base_ni, size=char * 0.05)
        if sup is not None:
            self._actors["sup"] = self.plotter.add_mesh(sup, color="#c0392b")

        # Deformada del caso activo (si ya corrio static)
        active = self.state["active_case"]
        if active in self._deform_by_case:
            scale = self._auto_scale(self._deform_by_case[active], char)
            # Frames
            def_poly = _deformed_polylines_collection(
                nodes_show, col_elems + beam_elems,
                self._deform_by_case[active], scale=scale, n_subdiv=30,
            )
            if def_poly is not None:
                self._actors["def_frames"] = self.plotter.add_mesh(
                    def_poly, color="#c0392b", line_width=5,
                )
            # Shells: nodos desplazados
            def_nodes = []
            for i, n in enumerate(nodes_show):
                d = self._deform_by_case[active].deformations.get(i, (0,)*6)
                def_nodes.append((n[0] + d[0]*scale, n[1] + d[1]*scale, n[2] + d[2]*scale))
            def_shells = _shells_to_quads(def_nodes, shell_elems)
            if def_shells is not None:
                self._actors["def_slab"] = self.plotter.add_mesh(
                    def_shells, color="#e74c3c", opacity=0.5, show_edges=True,
                    edge_color="#c0392b",
                )

        # Reset camara primera vez
        if not hasattr(self, "_first_done"):
            self.plotter.view_isometric()
            self._first_done = True

    def _char_size(self, pts) -> float:
        arr = np.asarray(pts)
        if len(arr) < 2:
            return 1.0
        span = arr.max(axis=0) - arr.min(axis=0)
        return float(np.max(span)) or 1.0

    def _auto_scale(self, dout: DeformOutputs, char: float) -> float:
        max_d = max(
            (max(abs(v) for v in (d[0], d[1], d[2])) for d in dout.deformations.values()),
            default=0.0,
        )
        if max_d < 1e-12:
            return 0.0
        target = (self.state["deform_scale_pct"] / 100.0) * char
        return target / max_d

    # ------------------------------------------------------------------
    # Slots UI
    # ------------------------------------------------------------------
    def _on_run_clicked(self):
        self.status.showMessage("Corriendo...")
        QtWidgets.QApplication.processEvents()
        try:
            self._rebuild_model()
            self._run_static_all()
            self._run_modal()
            self._render_model()
            self._update_summary()
            self.status.showMessage("Listo.")
        except Exception as e:
            self.status.showMessage(f"ERROR: {e}")
            raise

    def _on_case_changed(self, name: str):
        self.state["active_case"] = name
        self._render_model()

    def _on_compare_clicked(self):
        self._update_summary(force_compare=True)

    def _on_screenshot_clicked(self):
        path, _ = QtWidgets.QFileDialog.getSaveFileName(
            self, "Guardar screenshot", "mesa_torsion_gui.png", "PNG (*.png)"
        )
        if path:
            self.plotter.screenshot(path)
            self.status.showMessage(f"PNG -> {path}")

    # ------------------------------------------------------------------
    # Resultados
    # ------------------------------------------------------------------
    def _run_static_all(self):
        nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = self._model
        frame_indices = list(range(beam_end))
        ref_picks = MT.ETABS_PICKS
        for i, c in enumerate(CASES):
            dout, ni = solve_case_deform(
                nodes, elements, base_ni, ei, master_idx, slaves,
                sw_mult=c["sw"], q_scp_tm2=c["q_scp"], q_live_tm2=c["q_live"],
                rigid_diaphragm=self.state["rigid_diaphragm"],
            )
            self._deform_by_case[c["name"]] = dout
            # Para picks usamos el wrapper que ya lo hace
            ana = MT.run_static_case(
                nodes, elements, base_ni, ei, master_idx, slaves,
                sw_mult=c["sw"], q_scp_tm2=c["q_scp"], q_live_tm2=c["q_live"],
                rigid_diaphragm=self.state["rigid_diaphragm"],
            )
            picks = compute_picks(ana, frame_indices=frame_indices)
            self._fill_picks_row(i, c["name"], picks, ref_picks.get(c["name"], {}))
        self._last_picks = {
            c["name"]: compute_picks(
                MT.run_static_case(
                    nodes, elements, base_ni, ei, master_idx, slaves,
                    sw_mult=c["sw"], q_scp_tm2=c["q_scp"], q_live_tm2=c["q_live"],
                    rigid_diaphragm=self.state["rigid_diaphragm"],
                ),
                frame_indices=frame_indices,
            )
            for c in CASES
        }

    def _fill_picks_row(self, row: int, case: str, picks: dict, ref: dict):
        cols = ["P", "V2", "V3", "T", "M2", "M3"]
        for j, k in enumerate(cols):
            v = picks.get(k, 0.0)
            r = ref.get(k)
            txt = f"{v:.3f}"
            if r:
                d = (v - r) / r * 100
                txt = f"{v:.3f}  ({d:+.1f}%)"
            it = QtWidgets.QTableWidgetItem(txt)
            it.setFlags(QtCore.Qt.ItemIsEnabled)
            if r:
                ad = abs((v - r) / r * 100)
                if ad < 5:    it.setBackground(QtCore.Qt.green)
                elif ad < 20: it.setBackground(QtCore.Qt.yellow)
                else:         it.setBackground(QtCore.Qt.red)
            self.tbl_picks.setItem(row, j + 1, it)

    def _run_modal(self):
        nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = self._model
        ni = NodeInputs(supports=dict(base_ni.supports), loads={})
        apply_selfweight(nodes, elements, ei, ni, sw_multiplier=1.0)
        modal = modal_analysis(nodes, elements, ni, ei, n_modes=12)
        ref_T = self._etabs_ref.get("periods_s", [])
        for i in range(12):
            T = modal.periods[i] if i < len(modal.periods) else 0.0
            r = ref_T[i] if i < len(ref_T) else None
            it_T = QtWidgets.QTableWidgetItem(f"{T:.5f}"); it_T.setFlags(QtCore.Qt.ItemIsEnabled)
            self.tbl_modal.setItem(i, 1, it_T)
            if r is not None:
                it_R = QtWidgets.QTableWidgetItem(f"{r:.5f}"); it_R.setFlags(QtCore.Qt.ItemIsEnabled)
                self.tbl_modal.setItem(i, 2, it_R)
                d = (T - r) / r * 100 if r else 0
                it_D = QtWidgets.QTableWidgetItem(f"{d:+.2f}%")
                it_D.setFlags(QtCore.Qt.ItemIsEnabled)
                if abs(d) < 2:    it_D.setBackground(QtCore.Qt.green)
                elif abs(d) < 10: it_D.setBackground(QtCore.Qt.yellow)
                else:             it_D.setBackground(QtCore.Qt.red)
                self.tbl_modal.setItem(i, 3, it_D)
        self._last_modal = modal

    def _update_summary(self, force_compare: bool = False):
        msgs = []
        msgs.append(f"Modelo: nmesh={self.state['nmesh']}  "
                    f"diaph={'ON' if self.state['rigid_diaphragm'] else 'off'}  "
                    f"CP8={'ON' if self.state['cardinal_point_8'] else 'off'}  "
                    f"shell={self.state['shell_form']}")
        msgs.append(f"Cracking: col={self.state['crack_col']}  "
                    f"beam={self.state['crack_beam']}  slab={self.state['crack_slab']}")
        if hasattr(self, "_last_modal") and self._last_modal.periods:
            T1, T2, T3 = self._last_modal.periods[:3]
            msgs.append(f"T1={T1:.4f}s  T2={T2:.4f}s  T3={T3:.4f}s")
            ref = self._etabs_ref.get("periods_s")
            if ref and len(ref) >= 3:
                d1 = (T1 - ref[0]) / ref[0] * 100
                d3 = (T3 - ref[2]) / ref[2] * 100
                msgs.append(f"vs ETABS T1: {d1:+.2f}%  T3: {d3:+.2f}%")
        if hasattr(self, "_last_picks"):
            # Score promedio
            from hekatan_struct.extensions import compare_picks as _cmp  # noqa
            from mesa_torsion_iterate import ETABS_PICKS  # type: ignore
            total = 0.0; n = 0
            for case, ref in ETABS_PICKS.items():
                hk = self._last_picks.get(case, {})
                for k in ["P", "V2", "V3", "T", "M2", "M3"]:
                    v, r = hk.get(k, 0), ref.get(k, 0)
                    if r:
                        total += abs((v - r) / r); n += 1
            score = (total / n) if n else float("inf")
            msgs.append(f"Score promedio picks vs ETABS: {score*100:.2f}%")
        self.lbl_summary.setText("\n".join(msgs))


# ============================================================================
# Entrypoint
# ============================================================================
def launch(initial: dict | None = None) -> int:
    app = QtWidgets.QApplication.instance() or QtWidgets.QApplication(sys.argv)
    app.setStyle("Fusion")
    win = MesaTorsionWindow(initial=initial)
    win.show()
    return app.exec_()


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass
    sys.exit(launch())


if __name__ == "__main__":
    main()
