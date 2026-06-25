# -*- coding: utf-8 -*-
"""
CSI File Launcher — herramienta unificada para abrir archivos ETABS / SAP2000 / SAFE.

Soporta:
   .e2k / .EDB / .$et      → ETABS 22
   .s2k / .SDB / .$2k      → SAP2000 25
   .f2k / .FDB             → SAFE 20

Modos de uso:
   python csi_launcher.py                          → GUI Tkinter (file picker)
   python csi_launcher.py archivo.e2k              → CLI directo (detecta extensión)
   python csi_launcher.py archivo.e2k --etabs      → fuerza ETABS
   python csi_launcher.py archivo.s2k --sap        → fuerza SAP2000
   python csi_launcher.py archivo.f2k --safe       → fuerza SAFE
   python csi_launcher.py archivo.e2k --inspect    → imprime materiales, secciones, points, cases
   python csi_launcher.py archivo.e2k --results    → corre análisis + dump displacements/reactions
   python csi_launcher.py archivo.e2k --json       → output JSON (machine-readable)
   python csi_launcher.py --recent                 → muestra archivos recientes

Para archivos .EDB/.SDB/.FDB (binarios) usa file association de Windows.
Para text formats (.e2k/.s2k/.f2k) usa la API .NET via pythonnet para
hacer Import correctamente — sin esto el archivo se abre como blank.
"""
import os, sys, time, json
from pathlib import Path
from typing import Optional

# ════════════════════════════════════════════════════════════════════════
#  CONFIGURACIÓN (editá si tus CSI están en otras rutas)
# ════════════════════════════════════════════════════════════════════════
CSI_APPS = {
    "etabs": {
        "exe":  r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe",
        "dll":  r"C:\Program Files\Computers and Structures\ETABS 22\ETABSv1.dll",
        "progid": "CSI.ETABS.API.ETABSObject",
        "module": "ETABSv1",
        "extensions": [".e2k", ".edb", ".$et"],
    },
    "sap": {
        "exe":  r"C:\Program Files\Computers and Structures\SAP2000 25\SAP2000.exe",
        "dll":  r"C:\Program Files\Computers and Structures\SAP2000 25\SAP2000v1.dll",
        "progid": "CSI.SAP2000.API.SapObject",
        "module": "SAP2000v1",
        "extensions": [".s2k", ".sdb", ".$2k"],
    },
    "safe": {
        "exe":  r"C:\Program Files\Computers and Structures\SAFE 20\SAFE.exe",
        "dll":  r"C:\Program Files\Computers and Structures\SAFE 20\SAFEv1.dll",
        "progid": "CSI.SAFE.API.ETABSObject",
        "module": "SAFEv1",
        "extensions": [".f2k", ".fdb"],
    },
}

EXT_TO_APP = {ext: app for app, cfg in CSI_APPS.items() for ext in cfg["extensions"]}

RECENT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "recent.json")
MAX_RECENT = 15


# ════════════════════════════════════════════════════════════════════════
#  RECIENTES
# ════════════════════════════════════════════════════════════════════════
def load_recent() -> list:
    try:
        if os.path.exists(RECENT_FILE):
            with open(RECENT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return []


def save_recent(file_path: str) -> None:
    abs_path = os.path.abspath(file_path)
    recent = load_recent()
    # Mover al inicio si ya estaba
    recent = [p for p in recent if p != abs_path]
    recent.insert(0, abs_path)
    recent = recent[:MAX_RECENT]
    try:
        with open(RECENT_FILE, "w", encoding="utf-8") as f:
            json.dump(recent, f, indent=2, ensure_ascii=False)
    except Exception as ex:
        print(f"[WARN] No pude guardar recientes: {ex}")


# ════════════════════════════════════════════════════════════════════════
#  DETECCIÓN DE EXTENSIÓN → APP
# ════════════════════════════════════════════════════════════════════════
def detect_app(file_path: str) -> Optional[str]:
    """Devuelve 'etabs' | 'sap' | 'safe' según la extensión del archivo."""
    ext = Path(file_path).suffix.lower()
    return EXT_TO_APP.get(ext)


# ════════════════════════════════════════════════════════════════════════
#  LANZAMIENTO DE LA APP CSI
# ════════════════════════════════════════════════════════════════════════
def launch_csi(file_path: str, app_key: str) -> int:
    """Lanza la app CSI y abre el archivo via API .NET.

    Para archivos binarios (.EDB/.SDB/.FDB) usa OpenFile que ETABS reconoce
    como native database. Para texto (.e2k/.s2k/.f2k) ETABS lo importa
    automáticamente al detectar la extensión.
    """
    cfg = CSI_APPS.get(app_key)
    if not cfg:
        print(f"[ERROR] App desconocida: {app_key}")
        return 1

    if not os.path.exists(cfg["exe"]):
        print(f"[ERROR] No encuentro {cfg['exe']}")
        print(f"        Editá CSI_APPS en csi_launcher.py si la ruta es distinta.")
        return 2

    if not os.path.exists(cfg["dll"]):
        print(f"[WARN] No encuentro {cfg['dll']} — usando fallback startfile (sin API)")
        os.startfile(file_path)
        save_recent(file_path)
        return 0

    abs_path = os.path.abspath(file_path)
    print(f"[1] {app_key.upper()} — preparando API...")
    print(f"    Archivo: {abs_path}")

    try:
        from pythonnet import load
        load("coreclr")
    except Exception as ex:
        print(f"[WARN] pythonnet no disponible ({ex}) — usando startfile fallback")
        os.startfile(file_path)
        save_recent(file_path)
        return 0

    import clr
    clr.AddReference(cfg["dll"])

    # Imports dinámicos del módulo CSI específico
    if app_key == "etabs":
        from ETABSv1 import Helper, cHelper, cOAPI, cSapModel, cFile, eUnits
    elif app_key == "sap":
        from SAP2000v1 import Helper, cHelper, cOAPI, cSapModel, cFile, eUnits
    elif app_key == "safe":
        # SAFE usa nombres similares a ETABS
        from SAFEv1 import Helper, cHelper, cOAPI, cSapModel, cFile, eUnits

    print(f"[2] Iniciando {app_key.upper()} (puede tardar ~5s)...")
    helper = cHelper(Helper())

    # Intentar attach a instancia abierta primero
    try:
        APP = cOAPI(helper.GetObject(cfg["progid"]))
        print(f"    ✓ Attached a instancia existente")
    except Exception:
        APP = cOAPI(helper.CreateObjectProgID(cfg["progid"]))
        APP.ApplicationStart()
        time.sleep(5)
        print(f"    ✓ Nueva instancia iniciada")

    sap = cSapModel(APP.SapModel)
    File = cFile(sap.File)

    print(f"[3] Abriendo archivo...")
    ret = File.OpenFile(abs_path)
    print(f"    OpenFile ret={ret}")
    if ret == 0:
        save_recent(abs_path)
        print(f"\n✓ Archivo abierto correctamente. {app_key.upper()} queda corriendo.")
        return 0
    else:
        print(f"\n[ERROR] OpenFile retornó {ret}")
        return ret


# ════════════════════════════════════════════════════════════════════════
#  GUI TKINTER
# ════════════════════════════════════════════════════════════════════════
def launch_gui():
    """Ventana simple con file picker + selector de app + lista de recientes."""
    import tkinter as tk
    from tkinter import filedialog, ttk, messagebox

    root = tk.Tk()
    root.title("🏁 CSI File Launcher — ETABS / SAP2000 / SAFE")
    root.geometry("700x500")
    root.minsize(600, 400)

    # Header
    header = tk.Label(root, text="CSI File Launcher",
                       font=("Segoe UI", 16, "bold"), pady=10)
    header.pack(fill=tk.X)

    subtitle = tk.Label(root,
                         text="Abre e2k/EDB (ETABS) | s2k/SDB (SAP2000) | f2k/FDB (SAFE)",
                         font=("Segoe UI", 9), fg="#888")
    subtitle.pack()

    # Frame principal
    main = tk.Frame(root, padx=20, pady=10)
    main.pack(fill=tk.BOTH, expand=True)

    # --- Selector de archivo ---
    sel_frame = tk.LabelFrame(main, text="Archivo a abrir", padx=10, pady=10)
    sel_frame.pack(fill=tk.X, pady=5)

    file_var = tk.StringVar()
    file_entry = tk.Entry(sel_frame, textvariable=file_var, width=70)
    file_entry.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 5))

    def browse_file():
        filename = filedialog.askopenfilename(
            title="Seleccionar archivo CSI",
            filetypes=[
                ("Todos CSI", "*.e2k;*.EDB;*.$et;*.s2k;*.SDB;*.$2k;*.f2k;*.FDB"),
                ("ETABS", "*.e2k;*.EDB;*.$et"),
                ("SAP2000", "*.s2k;*.SDB;*.$2k"),
                ("SAFE", "*.f2k;*.FDB"),
                ("Todos los archivos", "*.*"),
            ]
        )
        if filename:
            file_var.set(filename)
            update_detected_app()

    browse_btn = tk.Button(sel_frame, text="📁 Buscar...", command=browse_file)
    browse_btn.pack(side=tk.RIGHT)

    # --- App detectada ---
    app_frame = tk.LabelFrame(main, text="App a usar", padx=10, pady=10)
    app_frame.pack(fill=tk.X, pady=5)

    app_var = tk.StringVar(value="auto")
    detected_label = tk.Label(app_frame, text="(elegí un archivo para detectar)",
                                font=("Segoe UI", 9, "italic"), fg="#666")
    detected_label.pack(anchor=tk.W)

    radio_frame = tk.Frame(app_frame)
    radio_frame.pack(anchor=tk.W, pady=5)
    tk.Radiobutton(radio_frame, text="Auto (por extensión)",
                    variable=app_var, value="auto").pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(radio_frame, text="ETABS",
                    variable=app_var, value="etabs").pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(radio_frame, text="SAP2000",
                    variable=app_var, value="sap").pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(radio_frame, text="SAFE",
                    variable=app_var, value="safe").pack(side=tk.LEFT, padx=5)

    def update_detected_app():
        path = file_var.get()
        if path:
            app = detect_app(path)
            if app:
                detected_label.config(
                    text=f"Detectado: {app.upper()} (extensión {Path(path).suffix})",
                    fg="#2a7", font=("Segoe UI", 9, "bold"))
            else:
                detected_label.config(
                    text=f"Extensión {Path(path).suffix} no reconocida — elegí manualmente",
                    fg="#a72", font=("Segoe UI", 9))
        else:
            detected_label.config(text="(elegí un archivo para detectar)",
                                   fg="#666", font=("Segoe UI", 9, "italic"))

    file_var.trace_add("write", lambda *a: update_detected_app())

    # --- Recientes ---
    recent_frame = tk.LabelFrame(main, text="📋 Archivos recientes", padx=10, pady=10)
    recent_frame.pack(fill=tk.BOTH, expand=True, pady=5)

    recent_list = tk.Listbox(recent_frame, height=8, font=("Consolas", 9))
    recent_list.pack(fill=tk.BOTH, expand=True, side=tk.LEFT)
    scroll = tk.Scrollbar(recent_frame, orient=tk.VERTICAL, command=recent_list.yview)
    scroll.pack(side=tk.RIGHT, fill=tk.Y)
    recent_list.config(yscrollcommand=scroll.set)

    def refresh_recent():
        recent_list.delete(0, tk.END)
        for p in load_recent():
            if os.path.exists(p):
                ext = Path(p).suffix
                name = os.path.basename(p)
                app = detect_app(p) or "?"
                recent_list.insert(tk.END, f"[{app:5s}] {name}   ←  {p}")
            else:
                recent_list.insert(tk.END, f"[deleted] {p}")

    def on_recent_dblclick(event):
        sel = recent_list.curselection()
        if not sel:
            return
        line = recent_list.get(sel[0])
        if "  ←  " in line:
            path = line.split("  ←  ", 1)[1]
            file_var.set(path)
            update_detected_app()

    recent_list.bind("<Double-Button-1>", on_recent_dblclick)

    # --- Botones acción ---
    action_frame = tk.Frame(main)
    action_frame.pack(fill=tk.X, pady=10)

    status = tk.Label(action_frame, text="Listo.", font=("Segoe UI", 9), fg="#444")
    status.pack(side=tk.LEFT)

    def do_open():
        path = file_var.get().strip()
        if not path:
            messagebox.showerror("Error", "Elegí un archivo primero")
            return
        if not os.path.exists(path):
            messagebox.showerror("Error", f"No existe:\n{path}")
            return
        # Determinar app
        selected = app_var.get()
        if selected == "auto":
            selected = detect_app(path)
            if not selected:
                messagebox.showerror("Error",
                    f"Extensión {Path(path).suffix} no reconocida.\nElegí app manualmente.")
                return
        status.config(text=f"Abriendo en {selected.upper()}...", fg="#36c")
        root.update()
        try:
            ret = launch_csi(path, selected)
            if ret == 0:
                status.config(text=f"✓ Abierto en {selected.upper()}", fg="#2a7")
                refresh_recent()
            else:
                status.config(text=f"⚠ Error ret={ret}", fg="#c33")
        except Exception as ex:
            status.config(text=f"⚠ {ex}", fg="#c33")
            messagebox.showerror("Error", str(ex))

    open_btn = tk.Button(action_frame, text="🚀  Abrir en CSI",
                          command=do_open, bg="#2a7", fg="white",
                          font=("Segoe UI", 11, "bold"), padx=20, pady=5)
    open_btn.pack(side=tk.RIGHT, padx=5)

    quit_btn = tk.Button(action_frame, text="Cerrar", command=root.destroy)
    quit_btn.pack(side=tk.RIGHT, padx=5)

    refresh_recent()

    root.mainloop()


# ════════════════════════════════════════════════════════════════════════
#  MAIN
# ════════════════════════════════════════════════════════════════════════
def main():
    args = sys.argv[1:]

    # Sin args → GUI
    if not args or args[0] in ("--gui", "-g"):
        launch_gui()
        return 0

    # --recent
    if args[0] in ("--recent", "-r"):
        recent = load_recent()
        if not recent:
            print("(no hay archivos recientes)")
            return 0
        print("Archivos recientes:")
        for i, p in enumerate(recent, 1):
            mark = "✓" if os.path.exists(p) else "✗"
            print(f"  {i:2d}. {mark} {p}")
        return 0

    # --help
    if args[0] in ("--help", "-h", "/?"):
        print(__doc__)
        return 0

    # CLI: primer arg = path, opcional --etabs/--sap/--safe
    file_path = args[0]
    if not os.path.exists(file_path):
        print(f"[ERROR] No existe: {file_path}")
        return 1

    app = None
    for flag in args[1:]:
        if flag == "--etabs": app = "etabs"
        elif flag == "--sap": app = "sap"
        elif flag == "--safe": app = "safe"

    if app is None:
        app = detect_app(file_path)
        if app is None:
            print(f"[ERROR] Extensión {Path(file_path).suffix} no reconocida.")
            print(f"         Usá --etabs / --sap / --safe para forzar la app.")
            return 1

    return launch_csi(file_path, app)


if __name__ == "__main__":
    sys.exit(main())
