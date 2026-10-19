# Mesa torsión (ShellThin+Frame3D): valores de Gauss dentro del área (18-oct)
Pedido: «la interpolación de Gauss no está en cada punto y dentro del área» + revisar trabajo anterior.
Anterior (24-sep, registros/2026-09-24_mesatorsion_viewer_exe.md): recovery DKQ = Gauss 2×2 + extrapolación √3 a los NUDOS; las etiquetas solo salían en los nudos.
- ✅ mesa_modelo.shell_fields guarda `gp`: valor en los 4 puntos de Gauss de CADA elemento (orden MH._GP).
- ✅ mesa_hekatan_tk.draw_losa: etiqueta + punto en cada Gauss, dentro del elemento (w: funciones de forma Q4 en esos puntos; Mmax/Mmin derivados de los Gauss).
- ❌ Primer intento: etiquetas tapadas por la superficie (matplotlib ordena por profundidad) → `computed_zorder=False` + zorder (columnas 0, superficie 1, texto 10).
- ✅ Probado headless (PNG w y Mxy): se ven los 4 valores por celda.
- ⏳ Exe: compilado en scratchpad (pyi_dist); falta abrirlo y mirar la captura.
- ✅ Exe compilado (70 MB; sin pyvista/cv2/pandas), abierto y capturado: se ven los Gauss. Carpeta entregada: C:\Users\j-b-j\OneDrive\Escritorio\ShellThin_Frame3D (exe + .py + hekatan_fem + EJECUTAR.bat + COMPILAR_EXE.bat).
