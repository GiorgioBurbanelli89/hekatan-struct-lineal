"""Viewer Tkinter + Matplotlib 3D de la mesa -- MOTOR NATIVO HEKATAN (sin OpenSees).
   Bilingue ES/EN. Sliders en vivo (recalcula al soltar). Casos de carga del e2k.
   Editable: geometria (Lx, H), secciones (b_c,h_c,b_v,h_v), material, espesor,
   brazo rigido, tipo de apoyo (apoyado/empotrado).  NO hay diafragma rigido.
"""
import sys
import os
import numpy as np
import tkinter as tk
from tkinter import ttk
import matplotlib
matplotlib.use("TkAgg")
from matplotlib import cm
from matplotlib.figure import Figure
from matplotlib.colors import Normalize
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from mpl_toolkits.mplot3d import proj3d
from mpl_toolkits.mplot3d.art3d import Line3DCollection, Poly3DCollection
from scipy.interpolate import RectBivariateSpline
import mesa_hekatan as M          # motor FEM nativo de hekatan-struct (sin OpenSees)
import mesa_modelo as MM          # motor GENERAL: vanos, pisos, tipo de losa (mismo resultado en 1x1x1)
from tkinter import filedialog, messagebox

N = M.N
GRAV = 9.80665

LOSA_KEYS = ["w", "Mxx", "Myy", "Mxy", "Mmax", "Mmin"]
FRAME_KEYS = ["M", "V", "T", "P"]
CASE_KEYS = ["L", "SCP", "D", "SERV", "ULT"]
SUPPORT_KEYS = ["pin", "fix"]
SLAB_KEYS = ["shellthin", "membrane", "waffle", "none"]
EXPORT_FMTS = [("e2k", "ETABS (.e2k)"), ("s2k", "SAP2000 (.s2k)"), ("tcl", "OpenSees Tcl (.tcl)"),
               ("py", "OpenSeesPy (.py)"), ("f90", "Hekatan Fortran (.f90)")]
_COMP = {"M": (5, 11, -1, 1), "V": (1, 7, 1, -1), "T": (3, 9, 1, -1), "P": (0, 6, 1, -1)}

LANG = {
 "ES": {
  "title": "ShellThin+Frame3D 1.0.0  -  Mesa de Torsion (motor Hekatan)",
  "lbl_losa": "Resultado LOSA:", "lbl_frame": "Resultado FRAME:",
  "chk_values": "Valores fijos", "chk_avg": "Promediar en nudos (ETABS)", "lang_lbl": "Idioma:",
  "losa_opts": ["Deflexion w [mm]", "Mxx [tonf.m/m]", "Myy [tonf.m/m]", "Mxy [tonf.m/m]",
                "Mmax [tonf.m/m]", "Mmin [tonf.m/m]"],
  "frame_opts": ["Momento [tonf.m]", "Cortante [tonf]", "Torsion [tonf.m]", "Axial [tonf]"],
  "case_lbl": "Caso de carga:",
  "case_opts": ["Viva (L)", "Permanente (SCP)", "Peso propio (D)",
                "Servicio (D+SCP+L)", "Ultima (1.2D+1.6L+1.2SCP)"],
  "sup_lbl": "Tipo de apoyo:", "sup_opts": ["Apoyado (pin)", "Empotrado (fix)"],
  "slab_lbl": "Tipo de losa:", "slab_opts": ["ShellThin (DKQ)", "Membrana (carga a vigas)",
               "Reticular / waffle (altura equiv.)", "Solo barras (sin losa)"],
  "btn_export": "Exportar...", "exp_title": "Exportar modelo", "exp_ok": "Guardado:",
  "piso_lbl": "Piso en LOSA:", "piso_all": "Todos",
  "no_bend": "Losa sin flexion: la carga baja a las vigas\n(area tributaria a 45 grados).\nVer diagramas de FRAMES.",
  "sld": ["Longitud Lx [m]", "Altura H [m]", "Columna b_c [m]", "Columna h_c [m]",
          "Viga b_v [m]", "Viga h_v [m]", "Carga Viva L [tonf/m2]", "Perm. SCP [tonf/m2]",
          "Material E [GPa]", "Espesor losa t [m]", "Brazo rigido (offset) [m]",
          "Vanos en X", "Vanos en Y", "Pisos",
          "Reticular: canto h [m]", "Reticular: losa sup. [m]", "Reticular: nervio bw [m]",
          "Reticular: separacion s [m]"],
  "btn_default": "Por defecto",
  "props_title": "PROPIEDADES (editables)", "detail_title": "DETALLE DEL MODELO",
  "panel_losa": "LOSA", "panel_frames": "FRAMES",
  "pr": {"materials": "MATERIALES", "concrete": "Hormigon 'Concreto'",
         "sections": "SECCIONES", "column": "Columna", "beam": "Viga",
         "elements": "ELEMENTOS", "slab": "Losa", "columns": "Columnas", "beams": "Vigas",
         "mesh": "malla", "rigid_arm": "brazo rigido", "loads": "CARGAS (e2k)",
         "case": "Caso", "live": "Viva L", "scp": "Perm SCP", "selfw": "Peso propio D",
         "supports": "APOYOS", "sup_pin": "Apoyado (UX UY UZ)", "sup_fix": "Empotrado (6 GDL)",
         "no_diaph": ">> SIN diafragma rigido (e2k: D1 no asignado)",
         "modal": "MODAL (Hekatan)", "mode": "Modo", "partic": "Particip. modo3",
         "tor": "Torsion", "tx": "Trasl X", "ty": "Trasl Y"},
 },
 "EN": {
  "title": "ShellThin+Frame3D 1.0.0  -  Torsion Table (Hekatan engine)",
  "lbl_losa": "SLAB result:", "lbl_frame": "FRAME result:",
  "chk_values": "Show values", "chk_avg": "Average at joints (ETABS)", "lang_lbl": "Language:",
  "losa_opts": ["Deflection w [mm]", "Mxx [tonf.m/m]", "Myy [tonf.m/m]", "Mxy [tonf.m/m]",
                "Mmax [tonf.m/m]", "Mmin [tonf.m/m]"],
  "frame_opts": ["Moment [tonf.m]", "Shear [tonf]", "Torsion [tonf.m]", "Axial [tonf]"],
  "case_lbl": "Load case:",
  "case_opts": ["Live (L)", "Superimposed (SCP)", "Self weight (D)",
                "Service (D+SCP+L)", "Ultimate (1.2D+1.6L+1.2SCP)"],
  "sup_lbl": "Support type:", "sup_opts": ["Pinned", "Fixed"],
  "slab_lbl": "Slab type:", "slab_opts": ["ShellThin (DKQ)", "Membrane (load to beams)",
               "Waffle (equivalent depth)", "Frames only (no slab)"],
  "btn_export": "Export...", "exp_title": "Export model", "exp_ok": "Saved:",
  "piso_lbl": "Floor in SLAB:", "piso_all": "All",
  "no_bend": "Slab without bending: load goes to beams\n(45-degree tributary area).\nSee FRAME diagrams.",
  "sld": ["Length Lx [m]", "Height H [m]", "Column b_c [m]", "Column h_c [m]",
          "Beam b_v [m]", "Beam h_v [m]", "Live load L [tonf/m2]", "Super. SCP [tonf/m2]",
          "Material E [GPa]", "Slab thickness t [m]", "Rigid arm (offset) [m]",
          "Bays in X", "Bays in Y", "Stories",
          "Waffle: depth h [m]", "Waffle: top slab [m]", "Waffle: rib bw [m]",
          "Waffle: spacing s [m]"],
  "btn_default": "Default",
  "props_title": "PROPERTIES (editable)", "detail_title": "MODEL DETAIL",
  "panel_losa": "SLAB", "panel_frames": "FRAMES",
  "pr": {"materials": "MATERIALS", "concrete": "Concrete",
         "sections": "SECTIONS", "column": "Column", "beam": "Beam",
         "elements": "ELEMENTS", "slab": "Slab", "columns": "Columns", "beams": "Beams",
         "mesh": "mesh", "rigid_arm": "rigid arm", "loads": "LOADS (e2k)",
         "case": "Case", "live": "Live L", "scp": "Super SCP", "selfw": "Self weight D",
         "supports": "SUPPORTS", "sup_pin": "Pinned (UX UY UZ)", "sup_fix": "Fixed (6 DOF)",
         "no_diaph": ">> NO rigid diaphragm (e2k: D1 not assigned)",
         "modal": "MODAL (Hekatan)", "mode": "Mode", "partic": "Particip. mode3",
         "tor": "Torsion", "tx": "Transl X", "ty": "Transl Y"},
 },
}

# (var-spec, default) en el MISMO orden que LANG["sld"]
SLIDER_SPECS = [(3.0, 12.0, 0.5, 6.0), (2.5, 6.0, 0.25, 4.0),
                (0.20, 0.80, 0.05, 0.40), (0.20, 0.80, 0.05, 0.40),
                (0.20, 0.60, 0.05, 0.30), (0.30, 0.90, 0.05, 0.50),
                (0.0, 2.0, 0.05, 0.50), (0.0, 3.0, 0.05, 1.00),
                (10.0, 40.0, 0.25, 24.85), (0.05, 0.40, 0.01, 0.10),
                (0.0, 0.60, 0.05, 0.50),
                (1, 2, 1, 1), (1, 2, 1, 1), (1, 3, 1, 1),
                (0.20, 0.60, 0.05, 0.30), (0.04, 0.10, 0.01, 0.05),
                (0.08, 0.20, 0.01, 0.10), (0.40, 1.00, 0.05, 0.60)]


class MesaTk:
    def __init__(self, root):
        self.root = root; self.lang = "ES"
        T = LANG[self.lang]
        root.title(T["title"])

        # ===== barra superior =====
        bar = ttk.Frame(root); bar.pack(side=tk.TOP, fill=tk.X, padx=6, pady=4)
        self.lbl_losa = ttk.Label(bar, text=T["lbl_losa"]); self.lbl_losa.pack(side=tk.LEFT)
        self.cboL = ttk.Combobox(bar, state="readonly", width=16, values=T["losa_opts"])
        self.cboL.current(0); self.cboL.pack(side=tk.LEFT, padx=4)
        self.cboL.bind("<<ComboboxSelected>>", lambda e: self.draw_losa())
        self.lbl_frame = ttk.Label(bar, text="   " + T["lbl_frame"]); self.lbl_frame.pack(side=tk.LEFT)
        self.cboF = ttk.Combobox(bar, state="readonly", width=16, values=T["frame_opts"])
        self.cboF.current(0); self.cboF.pack(side=tk.LEFT, padx=4)
        self.cboF.bind("<<ComboboxSelected>>", lambda e: self.draw_frame())
        self.varLbl = tk.BooleanVar(value=True)
        self.chk = ttk.Checkbutton(bar, text=T["chk_values"], variable=self.varLbl, command=self.redraw)
        self.chk.pack(side=tk.LEFT, padx=12)
        self.varAvg = tk.BooleanVar(value=True)           # ETABS: contorno suave = promedio de los elementos que comparten el nudo; apagado = valor de cada elemento (con saltos)
        self.chkAvg = ttk.Checkbutton(bar, text=T["chk_avg"], variable=self.varAvg, command=self.redraw)
        self.chkAvg.pack(side=tk.LEFT, padx=6)
        self.vlang = tk.StringVar(value="ES")
        cbl = ttk.Combobox(bar, textvariable=self.vlang, values=["ES", "EN"], state="readonly", width=4)
        cbl.pack(side=tk.RIGHT); cbl.bind("<<ComboboxSelected>>", self.apply_lang)
        self.lbl_lang = ttk.Label(bar, text=T["lang_lbl"]); self.lbl_lang.pack(side=tk.RIGHT, padx=4)

        # ===== barra de estado =====
        self.status = ttk.Label(root, text="", relief="sunken", anchor="w",
                                font=("Consolas", 8), foreground="#063")
        self.status.pack(side=tk.BOTTOM, fill=tk.X)

        # ===== cuerpo: panel de control scrollable (izq) + canvas (der) =====
        body = ttk.Frame(root); body.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
        outer = ttk.Frame(body, width=310); outer.pack(side=tk.LEFT, fill=tk.Y); outer.pack_propagate(False)
        cv = tk.Canvas(outer, highlightthickness=0, width=310)
        sb = ttk.Scrollbar(outer, orient="vertical", command=cv.yview); cv.configure(yscrollcommand=sb.set)
        sb.pack(side=tk.RIGHT, fill=tk.Y); cv.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        ctrl = ttk.Frame(cv); cv.create_window((0, 0), window=ctrl, anchor="nw", width=292)
        ctrl.bind("<Configure>", lambda e: cv.configure(scrollregion=cv.bbox("all")))
        cv.bind("<Enter>", lambda e: cv.bind_all("<MouseWheel>",
                lambda ev: cv.yview_scroll(int(-ev.delta/120), "units")))
        cv.bind("<Leave>", lambda e: cv.unbind_all("<MouseWheel>"))

        self.lbl_props = ttk.Label(ctrl, text=T["props_title"], font=("Segoe UI", 10, "bold"))
        self.lbl_props.pack(anchor="w")
        self._sliders = []; self._slider_desc = []; self.vars = []
        for (lo, hi, step, dflt), label in zip(SLIDER_SPECS, T["sld"]):
            var = tk.DoubleVar(value=dflt); self.vars.append(var)
            self._slider(ctrl, label, var, lo, hi, step)
        (self.vLx, self.vH, self.vbC, self.vhC, self.vbV, self.vhV,
         self.vq, self.vscp, self.vE, self.vt, self.voff,
         self.vnx, self.vny, self.vpis, self.vwh, self.vwtf, self.vwbw, self.vws) = self.vars

        cf = ttk.Frame(ctrl); cf.pack(fill=tk.X, pady=(6, 1))
        self.lbl_case = ttk.Label(cf, text=T["case_lbl"]); self.lbl_case.pack(side=tk.LEFT)
        self.cboCase = ttk.Combobox(ctrl, values=T["case_opts"], state="readonly")
        self.cboCase.current(0); self.cboCase.pack(fill=tk.X)
        self.cboCase.bind("<<ComboboxSelected>>", lambda e: self.on_recalc())
        sf = ttk.Frame(ctrl); sf.pack(fill=tk.X, pady=(6, 1))
        self.lbl_sup = ttk.Label(sf, text=T["sup_lbl"]); self.lbl_sup.pack(side=tk.LEFT)
        self.cboSup = ttk.Combobox(ctrl, values=T["sup_opts"], state="readonly")
        self.cboSup.current(0); self.cboSup.pack(fill=tk.X)
        self.cboSup.bind("<<ComboboxSelected>>", lambda e: self.on_recalc())
        lf = ttk.Frame(ctrl); lf.pack(fill=tk.X, pady=(6, 1))
        self.lbl_slab = ttk.Label(lf, text=T["slab_lbl"]); self.lbl_slab.pack(side=tk.LEFT)
        self.cboSlab = ttk.Combobox(ctrl, values=T["slab_opts"], state="readonly")
        self.cboSlab.current(0); self.cboSlab.pack(fill=tk.X)
        self.cboSlab.bind("<<ComboboxSelected>>", lambda e: self.on_recalc())
        pf = ttk.Frame(ctrl); pf.pack(fill=tk.X, pady=(6, 1))
        self.lbl_piso = ttk.Label(pf, text=T["piso_lbl"]); self.lbl_piso.pack(side=tk.LEFT)
        self.cboPiso = ttk.Combobox(pf, values=[T["piso_all"]], state="readonly", width=8)
        self.cboPiso.current(0); self.cboPiso.pack(side=tk.RIGHT)
        self.cboPiso.bind("<<ComboboxSelected>>", lambda e: self.draw_losa())
        self.btn_export = ttk.Button(ctrl, text=T["btn_export"], command=self.on_export)
        self.btn_export.pack(fill=tk.X, pady=(8, 0))
        self.btn_default = ttk.Button(ctrl, text=T["btn_default"], command=self.on_default)
        self.btn_default.pack(fill=tk.X, pady=6)

        ttk.Separator(ctrl).pack(fill=tk.X, pady=4)
        self.lbl_detail = ttk.Label(ctrl, text=T["detail_title"], font=("Segoe UI", 9, "bold"))
        self.lbl_detail.pack(anchor="w")
        self.txt = tk.Text(ctrl, height=30, width=40, font=("Consolas", 8), wrap="none",
                           bg="#f7f7f7", relief="flat")
        self.txt.pack(fill=tk.BOTH, expand=True)

        # ===== figura =====
        self.fig = Figure(figsize=(11.0, 7.0), facecolor="white")
        self.axL = self.fig.add_subplot(1, 2, 1, projection="3d")
        self.axF = self.fig.add_subplot(1, 2, 2, projection="3d")
        self.fig.subplots_adjust(left=0.0, right=0.92, top=1.0, bottom=0.0, wspace=0.12)
        self.caxL = self.fig.add_axes([0.44, 0.22, 0.011, 0.56])
        self.caxF = self.fig.add_axes([0.95, 0.22, 0.011, 0.56])
        self.canvas = FigureCanvasTkAgg(self.fig, master=body)
        self.canvas.get_tk_widget().pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        self.tip = self.fig.text(0.5, 0.5, "", fontsize=10, zorder=100, visible=False,
                                 bbox=dict(boxstyle="round,pad=0.3", fc="#ffffcc", ec="#555", lw=1))
        self.canvas.mpl_connect("motion_notify_event", self.on_move)

        self.recompute()
        self.draw_losa(); self.draw_frame()

    def _slider(self, parent, label, var, lo, hi, step):
        f = ttk.Frame(parent); f.pack(fill=tk.X, pady=0)
        desc = ttk.Label(f, text=label, width=22); desc.pack(side=tk.LEFT)
        fmt = "{:.0f}" if float(step).is_integer() else "{:.2f}"
        val = ttk.Label(f, text=fmt.format(var.get()), width=6); val.pack(side=tk.RIGHT)
        s = tk.Scale(parent, from_=lo, to=hi, resolution=step, orient=tk.HORIZONTAL,
                     variable=var, showvalue=False,
                     command=lambda v, l=val, fm=fmt: l.config(text=fm.format(float(v))))
        s.pack(fill=tk.X)
        s.bind("<ButtonRelease-1>", lambda e: self.on_recalc())   # EN VIVO al soltar
        self._sliders.append((var, val, var.get(), fmt)); self._slider_desc.append(desc)

    # ===== idioma =====
    def apply_lang(self, *_):
        self.lang = self.vlang.get(); T = LANG[self.lang]
        self.root.title(T["title"])
        self.lbl_losa.config(text=T["lbl_losa"]); self.lbl_frame.config(text="   " + T["lbl_frame"])
        self.chk.config(text=T["chk_values"]); self.chkAvg.config(text=T["chk_avg"]); self.lbl_lang.config(text=T["lang_lbl"])
        self.lbl_case.config(text=T["case_lbl"]); self.lbl_sup.config(text=T["sup_lbl"])
        self.lbl_props.config(text=T["props_title"]); self.lbl_detail.config(text=T["detail_title"])
        self.btn_default.config(text=T["btn_default"]); self.btn_export.config(text=T["btn_export"])
        self.lbl_slab.config(text=T["slab_lbl"]); self.lbl_piso.config(text=T["piso_lbl"])
        self._fill_piso()
        for cbo, key in [(self.cboL, "losa_opts"), (self.cboF, "frame_opts"),
                         (self.cboCase, "case_opts"), (self.cboSup, "sup_opts"),
                         (self.cboSlab, "slab_opts")]:
            idx = max(cbo.current(), 0); cbo.config(values=T[key]); cbo.current(idx)
        for desc, txt in zip(self._slider_desc, T["sld"]): desc.config(text=txt)
        self._update_props(); self._update_status(); self.draw_losa(); self.draw_frame()

    # ===== modelo =====
    def _case_loads(self):
        qL = self.vq.get() * GRAV; qS = self.vscp.get() * GRAV
        c = CASE_KEYS[self.cboCase.current()]
        return {"L": (qL, 0.0), "SCP": (qS, 0.0), "D": (0.0, 1.0),
                "SERV": (qL + qS, 1.0), "ULT": (1.6*qL + 1.2*qS, 1.2)}[c]

    def params(self):
        g = lambda v: float(v.get())
        return dict(Lx=g(self.vLx), H=g(self.vH), nx=int(g(self.vnx)), ny=int(g(self.vny)),
                    pisos=int(g(self.vpis)), bC=g(self.vbC), hC=g(self.vhC), bV=g(self.vbV), hV=g(self.vhV),
                    E=g(self.vE)*1e6, t=g(self.vt), slab=SLAB_KEYS[self.cboSlab.current()],
                    w_h=g(self.vwh), w_tf=g(self.vwtf), w_bw=g(self.vwbw), w_s=g(self.vws),
                    support=SUPPORT_KEYS[self.cboSup.current()],
                    qL=g(self.vq)*GRAV, qSCP=g(self.vscp)*GRAV)

    def recompute(self):
        P = self.params()
        self.model = MM.build(P)
        self.S = MM.solve(self.model, CASE_KEYS[self.cboCase.current()])
        self.fields = MM.shell_fields(self.model, self.S)        # {piso: {w,Mxx,Myy,Mxy}}
        for f in self.fields.values():
            a, b, c = f["Mxx"], f["Myy"], f["Mxy"]
            f["Mmax"] = 0.5*(a+b) + np.sqrt(0.25*(a-b)**2 + c**2)
            f["Mmin"] = 0.5*(a+b) - np.sqrt(0.25*(a-b)**2 + c**2)
            ea, eb, ec = f["el"]["Mxx"], f["el"]["Myy"], f["el"]["Mxy"]
            f["el"]["Mmax"] = 0.5*(ea+eb) + np.sqrt(0.25*(ea-eb)**2 + ec**2)
            f["el"]["Mmin"] = 0.5*(ea+eb) - np.sqrt(0.25*(ea-eb)**2 + ec**2)
            ga, gb, gc = f["gp"]["Mxx"], f["gp"]["Myy"], f["gp"]["Mxy"]
            f["gp"]["Mmax"] = 0.5*(ga+gb) + np.sqrt(0.25*(ga-gb)**2 + gc**2)
            f["gp"]["Mmin"] = 0.5*(ga+gb) - np.sqrt(0.25*(ga-gb)**2 + gc**2)
        self.ff = MM.frame_forces(self.model, self.S)
        # modal: 1x1x1 ShellThin = modal validado vs ETABS (mesa_hekatan); si no, el general
        try:
            if P["nx"] == P["ny"] == P["pisos"] == 1 and P["slab"] == "shellthin":
                M.configure(Lx_=P["Lx"], H_=P["H"], bC_=P["bC"], hC_=P["hC"], bV_=P["bV"], hV_=P["hV"],
                            E_GPa=P["E"]/1e6, t_=P["t"], off=self.voff.get(), support=P["support"])
                self.modes = [(m[0], m[3], m[4], m[5]) for m in M.modal_shapes(3)]
            else:
                self.modes = [(m[0], m[1], m[2], m[3]) for m in MM.modal(self.model, 3)]
        except Exception:
            self.modes = []
        self.Lx = P["Lx"]; self.H = P["H"]; self.P = P
        uz = self.S["u"][2::6]
        self.wmin = float(uz.min()*1000)
        self.sc = 0.25*self.Lx/max(abs(self.wmin)/1000.0, 1e-9)
        self._fill_piso()
        self._update_props(); self._update_status()

    def _fill_piso(self):
        T = LANG[self.lang]; n = int(self.vpis.get())
        vals = [T["piso_all"]] + [str(k) for k in range(1, n+1)]
        cur = self.cboPiso.current() if self.cboPiso.current() >= 0 else 0
        self.cboPiso.config(values=vals); self.cboPiso.current(min(cur, n))

    def nzd(self, n):
        x = self.model["nodes"][n]
        return np.array([x[0], x[1], x[2] + self.S["u"][n*6+2]*self.sc])

    def _update_status(self):
        T1 = self.modes[0][0] if self.modes else 0.0
        pre = "Resultados" if self.lang == "ES" else "Results"
        cfg = (f"Caso={LANG[self.lang]['case_opts'][self.cboCase.current()]} | "
               f"Lx={self.vLx.get():.1f} H={self.vH.get():.1f} | "
               f"L={self.vq.get():.2f} SCP={self.vscp.get():.2f} E={self.vE.get():.1f} "
               f"t={self.vt.get():.2f} off={self.voff.get():.2f} | "
               f"{LANG[self.lang]['sup_opts'][self.cboSup.current()]}")
        mx = max((np.abs(f["Mxx"]).max() for f in self.fields.values()), default=0.0)
        mxy = max((np.abs(f["Mxy"]).max() for f in self.fields.values()), default=0.0)
        P = self.P
        res = (f"{P['nx']}x{P['ny']} vanos, {P['pisos']} piso(s), {P['slab']} | "
               f"{pre}: w_max={self.wmin:.2f}mm | |Mxx|={mx:.2f} |Mxy|={mxy:.2f} | T1={T1:.3f}s")
        self.status.config(text=f"  {cfg}    ->    {res}")

    def on_recalc(self):
        self.recompute(); self.draw_losa(); self.draw_frame()

    def on_default(self):
        for var, val, dflt, fmt in self._sliders:
            var.set(dflt); val.config(text=fmt.format(dflt))
        self.cboCase.current(0); self.cboSup.current(0); self.cboSlab.current(0)
        self.on_recalc()

    # (idx_i, idx_j, signo_i, signo_j) en ejes locales de Hekatan
    _CMAP = {"viga": {"M": (4, 10, 1, -1), "V": (2, 8, 1, -1), "T": (3, 9, 1, -1), "P": (0, 6, 1, -1)},
             "col":  {"M": (5, 11, -1, 1), "V": (1, 7, 1, -1), "T": (3, 9, 1, -1), "P": (0, 6, 1, -1)}}

    def frame_segments(self, key):
        """[(p0, p1, vi, vj)] en tonf / tonf.m.  Viga: M = eje fuerte (My), V = vertical.
           Columna: igual que antes (Mz, momento en cara con el brazo rigido)."""
        out = []; off = self.voff.get()
        for e, f in enumerate(self.model["frames"]):
            ci, cj, si, sj = self._CMAP[f["tipo"]][key]; fL = self.ff[e]
            vi = si*fL[ci]/GRAV; vj = sj*fL[cj]/GRAV
            if key == "M" and f["tipo"] == "col" and off > 0:
                Vsh = abs(fL[7])/GRAV
                vj = np.sign(vj)*max(abs(vj) - Vsh*off, 0.0)
            out.append((self.nzd(f["i"]), self.nzd(f["j"]), vi, vj))
        return out

    def _update_props(self):
        pr = LANG[self.lang]["pr"]; Pm = self.P; sl = self.model["slabprop"]
        mat = self.model["mat"]; sc = self.model["secs"]
        p = {"E_GPa": mat["E"]/1e6, "nu": mat["nu"], "G_GPa": mat["G"]/1e6, "rho": mat["rho"],
             "bC": sc["COL"]["b"], "hC": sc["COL"]["h"], "Ac": sc["COL"]["A"], "Iyc": sc["COL"]["Iy"],
             "Izc": sc["COL"]["Iz"], "Jc": sc["COL"]["J"], "bV": sc["VIGA"]["b"], "hV": sc["VIGA"]["h"],
             "Av": sc["VIGA"]["A"], "Iyv": sc["VIGA"]["Iy"], "Izv": sc["VIGA"]["Iz"], "Jv": sc["VIGA"]["J"]}
        ncol = sum(1 for f in self.model["frames"] if f["tipo"] == "col"); nvig = len(self.model["frames"]) - ncol
        sup = pr["sup_fix"] if Pm["support"] == "fix" else pr["sup_pin"]
        L = [
            pr["materials"], f"  {pr['concrete']}",
            f"    E={p['E_GPa']:.2f} GPa  nu={p['nu']:.2f}",
            f"    G={p['G_GPa']:.2f} GPa  rho={p['rho']:.3f} tonf/m3", "",
            pr["sections"],
            f"  {pr['column']}  {p['bC']:.2f}x{p['hC']:.2f} m",
            f"    A={p['Ac']:.4f}  Iy={p['Iyc']:.2e}  Iz={p['Izc']:.2e}  J={p['Jc']:.2e}",
            f"  {pr['beam']}  {p['bV']:.2f}x{p['hV']:.2f} m",
            f"    A={p['Av']:.4f}  Iy={p['Iyv']:.2e}  Iz={p['Izv']:.2e}  J={p['Jv']:.2e}", "",
            pr["elements"],
            f"  {pr['slab']}: {LANG[self.lang]['slab_opts'][self.cboSlab.current()]}",
            f"     t={sl['t']:.3f} m" + (f" (peso {sl['t_peso']:.3f} m)" if sl['tipo'] == 'waffle' else "")
            + f"  {pr['mesh']} {self.model['N']}x{self.model['N']}/vano",
            f"  {Pm['nx']}x{Pm['ny']} vanos, {Pm['pisos']} piso(s): {len(self.model['nodes'])} nudos",
            f"  {pr['columns']} ({ncol}): h={Pm['H']:.2f} m",
            f"  {pr['beams']} ({nvig} tramos): L={Pm['Lx']:.2f} m  {pr['rigid_arm']}={self.voff.get():.2f} m", "",
            pr["supports"],
            f"  {len(self.model['restr'])} -> {sup}",
            f"  {pr['no_diaph']}", "",
            pr["loads"],
            f"  {pr['case']}={LANG[self.lang]['case_opts'][self.cboCase.current()]}",
            f"  {pr['live']}={self.vq.get():.2f}  {pr['scp']}={self.vscp.get():.2f} tonf/m2",
            f"  {pr['selfw']} (g={p['rho']*GRAV:.2f} kN/m3)",
        ]
        if self.modes:
            L += ["", pr["modal"] + "  (T + particip. de masa)"]
            for k, m in enumerate(self.modes):
                tip = pr["tor"] if m[3] > 50 else (pr["tx"] if m[1] > m[2] else pr["ty"])
                L.append(f"  {pr['mode']} {k+1}: {tip:<10} T={m[0]:.4f} s")
                L.append(f"     Ux={m[1]:5.1f}%  Uy={m[2]:5.1f}%  Rz={m[3]:5.1f}%")
        self.txt.config(state="normal"); self.txt.delete("1.0", tk.END)
        self.txt.insert("1.0", "\n".join(L)); self.txt.config(state="disabled")

    # ===== LOSA 3D =====
    def _pisos_sel(self):
        k = self.cboPiso.current()
        return list(self.fields.keys()) if k <= 0 else [k]

    def _columns(self, ax, color, lw):
        for f in self.model["frames"]:
            if f["tipo"] == "col":
                p0, p1 = self.nzd(f["i"]), self.nzd(f["j"])
                ax.plot([p0[0], p1[0]], [p0[1], p1[1]], [p0[2], p1[2]], color=color, lw=lw, zorder=0)

    @staticmethod
    def _campo_por_elemento(E4, xf, yf, d):
        """E4[(gy-1),(gx-1),4] = valores en las esquinas (0,0),(1,0),(1,1),(0,1) de cada elemento.
        Bilineal dentro de cada elemento; en la arista comun hay salto (ETABS sin promediar)."""
        ny, nx = E4.shape[:2]; out = np.zeros((len(yf), len(xf)))
        for a, y in enumerate(yf):
            j = min(int(y/d + 1e-9), ny-1); t = y/d - j
            for b, x in enumerate(xf):
                i = min(int(x/d + 1e-9), nx-1); s = x/d - i
                v = E4[j, i]
                out[a, b] = v[0]*(1-s)*(1-t) + v[1]*s*(1-t) + v[2]*s*t + v[3]*(1-s)*t
        return out

    def draw_losa(self):
        key = LOSA_KEYS[self.cboL.current()]
        disp = LANG[self.lang]["losa_opts"][self.cboL.current()]
        self.axL.clear(); M_ = self.model
        self.axL.computed_zorder = False        # manda el zorder: los valores de Gauss se ven SOBRE la superficie
        self._columns(self.axL, "#222", 3)
        xyz, val = [], []
        if not self.fields:
            for f in M_["frames"]:
                if f["tipo"] == "viga":
                    p0, p1 = self.nzd(f["i"]), self.nzd(f["j"])
                    self.axL.plot([p0[0], p1[0]], [p0[1], p1[1]], [p0[2], p1[2]], color="#1f3a93", lw=2)
            self.axL.text2D(0.5, 0.55, LANG[self.lang]["no_bend"], transform=self.axL.transAxes,
                            ha="center", fontsize=10, color="#933")
            self.caxL.cla(); self.caxL.set_visible(False)
        else:
            self.caxL.set_visible(True)
            ks = self._pisos_sel()
            porel = (not self.varAvg.get()) and key != "w"
            allF = np.concatenate([(self.fields[k]["el"][key] if porel else self.fields[k][key]).ravel() for k in ks])
            norm = Normalize(allF.min(), allF.max())
            gx, gy, d = M_["gx"], M_["gy"], M_["d"]
            xc = np.arange(gx)*d; yc = np.arange(gy)*d
            lbl = self.varLbl.get() and len(ks) == 1 and (gx-1)*(gy-1) <= 100
            for k in ks:
                Fk = self.fields[k][key]; Wk = self.fields[k]["w"]
                nf = 12*(gx-1)//M_["N"]*M_["N"]//M_["N"] + 1
                xf = np.linspace(0, xc[-1], max(nf, 30)); yf = np.linspace(0, yc[-1], max(nf, 30))
                Xf, Yf = np.meshgrid(xf, yf)
                Wf = RectBivariateSpline(yc, xc, Wk)(yf, xf)
                dg = 3 if key == "w" else 1
                if self.varAvg.get() or key == "w":
                    Ff = RectBivariateSpline(yc, xc, Fk, kx=1, ky=1)(yf, xf)      # contorno de ETABS: lineal entre los valores de los nudos (no cubico)
                else:
                    Ff = self._campo_por_elemento(self.fields[k]["el"][key], xf, yf, d)   # valor propio de cada elemento, bilineal en su interior
                Zf = k*self.H + (Wf/1000.0)*self.sc
                self.axL.plot_surface(Xf, Yf, Zf, facecolors=cm.turbo(norm(Ff)), rstride=1, cstride=1,
                                      linewidth=0, antialiased=True, shade=False, zorder=1)
                Xg, Yg = np.meshgrid(xc, yc); Zg = k*self.H + (Wk/1000.0)*self.sc
                xyz.append(np.column_stack([Xg.ravel(), Yg.ravel(), Zg.ravel()])); val.append(Fk.ravel())
                if lbl:
                    # valor en CADA punto de Gauss 2x2, dentro del area de cada elemento (los 4 de cada celda);
                    # w no se recupera por Gauss: se interpola con las funciones de forma del Q4 en esos mismos puntos
                    for j in range(gy-1):
                        for i in range(gx-1):
                            for q, (xi, eta) in enumerate(M._GP):
                                s_, t_ = (xi+1)/2, (eta+1)/2
                                xg, yg = xc[i] + s_*d, yc[j] + t_*d
                                wg = (Wk[j, i]*(1-s_)*(1-t_) + Wk[j, i+1]*s_*(1-t_)
                                      + Wk[j+1, i+1]*s_*t_ + Wk[j+1, i]*(1-s_)*t_)
                                vg = wg if key == "w" else self.fields[k]["gp"][key][j, i, q]
                                zg = k*self.H + (wg/1000.0)*self.sc + 0.05      # un poco por encima de la superficie: si no, el dibujo 3D la tapa
                                self.axL.text(xg, yg, zg, f"{vg:.2f}", fontsize=5,
                                              color="black", ha="center", zorder=10)
                                self.axL.scatter([xg], [yg], [zg], s=2, c="k", depthshade=False)
            smp = cm.ScalarMappable(cmap="turbo", norm=norm); smp.set_array([])
            self.caxL.cla(); self.fig.colorbar(smp, cax=self.caxL)
        self._fit(self.axL, f"{LANG[self.lang]['panel_losa']}  -  {disp}")
        self._L_xyz = np.vstack(xyz) if xyz else np.zeros((0, 3))
        self._L_val = np.concatenate(val) if val else np.zeros(0)
        self.canvas.draw()

    # ===== FRAMES 3D =====
    def draw_frame(self):
        key = FRAME_KEYS[self.cboF.current()]; segs = self.frame_segments(key)
        disp = LANG[self.lang]["frame_opts"][self.cboF.current()]
        self.axF.clear()
        skel = [[tuple(p0), tuple(p1)] for (p0, p1, vi, vj) in segs]
        self.axF.add_collection3d(Line3DCollection(skel, colors="#888888", linewidths=1.0))
        vmax = max((max(abs(vi), abs(vj)) for (_, _, vi, vj) in segs), default=1e-9)
        vmax = max(vmax, 1e-9); dscale = 0.9/vmax
        quads = []; qval = []
        for (p0, p1, vi, vj) in segs:
            ax = p1 - p0; ax = ax/(np.linalg.norm(ax) + 1e-12)
            perp = np.array([1, 0, 0.]) if abs(ax[2]) > 0.9 else np.array([0, 0, 1.])
            quads.append([tuple(p0), tuple(p1), tuple(p1 + perp*vj*dscale), tuple(p0 + perp*vi*dscale)])
            qval.append((vi + vj)/2)
        pc = Poly3DCollection(quads, cmap="turbo", alpha=0.5, edgecolor="#444", linewidths=0.5)
        pc.set_array(np.array(qval)); pc.set_clim(-vmax, vmax)
        self.axF.add_collection3d(pc)
        for n in self.model["restr"]:
            x = self.model["nodes"][n]
            self.axF.scatter([x[0]], [x[1]], [0], color="#1f3a93", marker="^", s=70)
        self._F_mid = []
        many = len(segs) > 80
        for (p0, p1, vi, vj) in segs:
            if abs(vi) >= abs(vj): pe, ve = p0, vi
            else:                  pe, ve = p1, vj
            perp = (np.array([1, 0, 0.]) if abs((p1 - p0)[2]) > 0.9*np.linalg.norm(p1 - p0)
                    else np.array([0, 0, 1.]))
            ptip = pe + perp*ve*dscale
            self._F_mid.append((ptip, ve))
            thr = 0.5 if many else 0.02
            if self.varLbl.get() and abs(ve) > thr*vmax:
                self.axF.text(ptip[0], ptip[1], ptip[2], f"{ve:.2f}", fontsize=7,
                              color="black", ha="center", zorder=12)
        smp = cm.ScalarMappable(cmap="turbo", norm=Normalize(-vmax, vmax)); smp.set_array([])
        self.caxF.cla(); self.fig.colorbar(smp, cax=self.caxF)
        self._fit(self.axF, f"{LANG[self.lang]['panel_frames']}  -  {disp}")
        self._F_xyz = np.array([m for (m, v) in self._F_mid])
        self._F_val = np.array([v for (m, v) in self._F_mid])
        self.canvas.draw()

    # ===== EXPORTAR =====
    def on_export(self):
        T = LANG[self.lang]
        win = tk.Toplevel(self.root); win.title(T["exp_title"]); win.transient(self.root)
        var = tk.StringVar(value="e2k")
        for k, lab in EXPORT_FMTS:
            ttk.Radiobutton(win, text=lab, value=k, variable=var).pack(anchor="w", padx=14, pady=2)
        cvar = tk.StringVar(value=CASE_KEYS[self.cboCase.current()])
        fr = ttk.Frame(win); fr.pack(fill=tk.X, padx=14, pady=4)
        ttk.Label(fr, text="Combo (OpenSeesPy / Fortran):").pack(side=tk.LEFT)
        ttk.Combobox(fr, textvariable=cvar, values=CASE_KEYS, state="readonly", width=6).pack(side=tk.LEFT)

        def go():
            fmt = var.get(); combo = cvar.get(); win.destroy()
            P = self.P
            name = f"mesa_{P['nx']}x{P['ny']}x{P['pisos']}_{P['slab']}"
            path = filedialog.asksaveasfilename(defaultextension="." + fmt, initialfile=name + "." + fmt,
                                                filetypes=[(fmt.upper(), "*." + fmt)])
            if not path: return
            try:
                import mesa_export
                mesa_export.export(self.model, fmt, path, combo=combo)
                messagebox.showinfo(T["exp_title"], f"{T['exp_ok']}\n{path}")
            except Exception as ex:
                messagebox.showerror(T["exp_title"], f"{type(ex).__name__}: {ex}")
        ttk.Button(win, text="OK", command=go).pack(pady=8)

    def _fit(self, ax, title):
        P = self.P; X = P["nx"]*self.Lx; Y = P["ny"]*self.Lx; Z = P["pisos"]*self.H
        ax.set_xlim(-1.0, X + 1.0); ax.set_ylim(-1.0, Y + 1.0); ax.set_zlim(0, Z + 0.8)
        mx = max(X, Y) + 2
        ax.set_box_aspect(((X + 2)/mx, (Y + 2)/mx, max(0.6, (Z + 0.8)/mx)), zoom=0.95)
        ax.view_init(elev=24, azim=-58); ax.set_zticks([])
        ax.set_xlabel("x [m]"); ax.set_ylabel("y [m]"); ax.set_title(title, y=0.96)

    def redraw(self):
        self.draw_losa(); self.draw_frame()

    # ===== HOVER =====
    def _nearest(self, ax, xyz, ev):
        x2, y2, _ = proj3d.proj_transform(xyz[:, 0], xyz[:, 1], xyz[:, 2], ax.get_proj())
        disp = ax.transData.transform(np.column_stack([x2, y2]))
        d2 = (disp[:, 0] - ev.x) ** 2 + (disp[:, 1] - ev.y) ** 2
        k = int(np.argmin(d2))
        return k if d2[k] < 45 ** 2 else None

    def on_move(self, ev):
        if ev.x is None: return self._hide()
        if ev.inaxes is self.axL and hasattr(self, "_L_xyz"):
            k = self._nearest(self.axL, self._L_xyz, ev)
            if k is not None: return self._show(ev, f"{self._L_val[k]:.3f}")
        elif ev.inaxes is self.axF and hasattr(self, "_F_xyz") and len(self._F_xyz):
            k = self._nearest(self.axF, self._F_xyz, ev)
            if k is not None: return self._show(ev, f"{self._F_val[k]:.3f}")
        self._hide()

    def _show(self, ev, txt):
        w, h = self.fig.bbox.width, self.fig.bbox.height
        self.tip.set_position(((ev.x + 14) / w, (ev.y + 14) / h))
        self.tip.set_text(txt); self.tip.set_visible(True); self.canvas.draw_idle()

    def _hide(self):
        if self.tip.get_visible():
            self.tip.set_visible(False); self.canvas.draw_idle()


def main():
    root = tk.Tk(); root.geometry("1560x830")
    for ico in (r"C:\Program Files\Python312\DLLs\py.ico",
                os.path.join(os.path.dirname(sys.executable), "DLLs", "py.ico")):
        if os.path.exists(ico):
            try: root.iconbitmap(ico)
            except Exception: pass
            break
    MesaTk(root); root.mainloop()


if __name__ == "__main__":
    main()
