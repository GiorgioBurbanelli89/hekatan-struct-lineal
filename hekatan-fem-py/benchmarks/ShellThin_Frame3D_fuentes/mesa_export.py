"""Fachada de exportacion de la Mesa de Torsion general (mesa_modelo.build).

    export(M, fmt, path, combo="L")   fmt: e2k | s2k | tcl | py | f90

Cada formato vive en su modulo (mesa_export_csi / mesa_export_opensees /
mesa_export_fortran); se importan al usarse para que la app arranque aunque falte uno.
"""


def export(M, fmt, path, combo="L"):
    fmt = fmt.lower().lstrip(".")
    if fmt == "e2k":
        from mesa_export_csi import to_e2k; return to_e2k(M, path)
    if fmt == "s2k":
        from mesa_export_csi import to_s2k; return to_s2k(M, path)
    if fmt == "tcl":
        from mesa_export_opensees import to_tcl; return to_tcl(M, path)
    if fmt == "py":
        from mesa_export_opensees import to_openseespy; return to_openseespy(M, path)
    if fmt == "f90":
        from mesa_export_fortran import to_fortran; return to_fortran(M, path, combo=combo)
    raise ValueError(f"formato desconocido: {fmt}")
