# -*- coding: utf-8 -*-
"""Genera pl_<t>_hard.heks a partir de pl_<t>.heks: borde DURO de Wilson (8.9.2).
BLANDO (lo que hay): support n  1 1 1 0 0 1   -> ux,uy,uz,rz atados; rx,ry libres.
DURO  (lo que falta): ademas se ata la rotacion cuyo VECTOR es NORMAL al borde:
  borde y=0 / y=L (corre en x, normal = y)  -> ry = 1
  borde x=0 / x=L (corre en y, normal = x)  -> rx = 1
  esquinas -> las dos.
Razon fisica: a lo largo del borde w=0 para todo x, luego dw/dx=0, y esa pendiente
es justo ry. En Kirchhoff sale sola; en Mindlin theta es independiente y hay que
atarla a mano. La otra (la normal al plano del borde, rx en y=0) queda LIBRE,
que es lo que hace que el apoyo sea SIMPLE (M_nn = 0) y no empotrado.
"""
import sys, os, re
SRC = os.path.dirname(os.path.abspath(__file__))
D = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validation\opensees"
TOL = 1e-9
for t in ["0.001", "0.01", "0.05", "0.1", "0.2"]:
    f = os.path.join(D, "pl_%s.heks" % t)
    txt = open(f).read().splitlines()
    # coordenadas
    xs, ys = {}, {}
    for ln in txt:
        m = re.match(r"^node\s+(\d+)\s+(\S+)\s+(\S+)\s+(\S+)", ln)
        if m:
            xs[int(m.group(1))] = float(m.group(2)); ys[int(m.group(1))] = float(m.group(3))
    Lx, Ly = max(xs.values()), max(ys.values())
    out, n_ry, n_rx = [], 0, 0
    for ln in txt:
        m = re.match(r"^support\s+(\d+)\s+(.*)$", ln)
        if m:
            i = int(m.group(1)); b = m.group(2).split()
            assert b == ["1", "1", "1", "0", "0", "1"], (i, b)
            rx, ry = 0, 0
            if abs(ys[i]) < TOL or abs(ys[i] - Ly) < TOL: ry = 1; n_ry += 1
            if abs(xs[i]) < TOL or abs(xs[i] - Lx) < TOL: rx = 1; n_rx += 1
            assert rx or ry, i
            out.append("support %d 1 1 1 %d %d 1" % (i, rx, ry))
        elif ln.startswith("# placa apoyada"):
            out.append(ln + "  [BORDE DURO: +rx en x=0/L, +ry en y=0/L]")
        else:
            out.append(ln)
    g = os.path.join(D, "pl_%s_hard.heks" % t)
    open(g, "w").write("\n".join(out) + "\n")
    print("%s  L=%g  nudos borde ry=%d rx=%d" % (os.path.basename(g), Lx, n_ry, n_rx))
