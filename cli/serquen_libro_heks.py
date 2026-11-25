# -*- coding: utf-8 -*-
"""Serquen, «El SAP2000 aplicado al suelo» (C. Eng. William Rodriguez Serquen), COMO EL LIBRO:
bloque 20x20x10 m, cubos de 0.5 m (40x40x20), E 2000 tonf/m2, nu 0.42, base fija y las 4 caras
laterales articuladas (pags. 19-23), cargas PUNTUAL (100 t en 0,0,10), LINEAL (cuadrado de 10 m,
1 t/m, vigas FSEC1 de SAP2000 malladas cada 0.5 m) y RECTANGULAR (10 t/m2 en 5x3 m, nudal q*A/4).
Unidades tonf, m.   python cli/serquen_libro_heks.py salida.heks
"""
import sys
out = sys.argv[1]
nx, ny, nz, L, H = 40, 40, 20, 20.0, 10.0
d = L / nx
nid = lambda i, j, k: k * (ny + 1) * (nx + 1) + j * (nx + 1) + i + 1
X = lambda i: -L / 2 + d * i
Z = lambda k: H / nz * k
# acero A992Fy50 y seccion FSEC1 leidos de SAP2000 por OAPI (tonf, m)
Es, nus, A, I33, I22, J = 20389019.158038314, 0.3, 0.0042645076, 6.572417470223499e-05, 3.301257173010083e-06, 9.651176780539531e-08
w = []
w.append("# Serquen, «El SAP2000 aplicado al suelo» (C. Eng. William Rodriguez Serquen): bloque de suelo 20x20x10 m")
w.append("# cubos de 0.5 m, E 2000 tonf/m2, nu 0.42; base fija, caras laterales articuladas; tonf, m")
w.append("# Patrones: RECTANGULAR (10 t/m2 en 5x3), PUNTUAL (100 t), LINEAL (1 t/m en cuadrado de 10 m). SAP2000 GUI: Uz(0,0,10) R -14.0951 mm")
w.append("comportamiento sap2000")
w.append("incompatible 1")
for k in range(nz + 1):
    for j in range(ny + 1):
        for i in range(nx + 1):
            w.append("node %d %.6g %.6g %.6g" % (nid(i, j, k), X(i), X(j), Z(k)))
e = 0
for k in range(nz):
    for j in range(ny):
        for i in range(nx):
            e += 1
            p = [nid(i, j, k), nid(i + 1, j, k), nid(i + 1, j + 1, k), nid(i, j + 1, k),
                 nid(i, j, k + 1), nid(i + 1, j, k + 1), nid(i + 1, j + 1, k + 1), nid(i, j + 1, k + 1)]
            w.append("hex %d %s 2000 0.42 0" % (e, " ".join(map(str, p))))
ns = 0
for k in range(nz + 1):
    for j in range(ny + 1):
        for i in range(nx + 1):
            if k == 0 or i in (0, nx) or j in (0, ny):
                w.append("support %d fixed" % nid(i, j, k)); ns += 1
# vigas del cuadrado (-5..5) en z = 10, un tramo por cada 0.5 m (como Auto Mesh at Intermediate Joints)
f = 0
lado = [nx // 4 + t for t in range(nx // 2 + 1)]   # i de -5 a 5 m: 10..30
a, b = lado[0], lado[-1]
tramos = []
for t in range(len(lado) - 1):
    tramos.append(((lado[t], a), (lado[t + 1], a)))
    tramos.append(((b, lado[t]), (b, lado[t + 1])))
    tramos.append(((lado[t + 1], b), (lado[t], b)))
    tramos.append(((a, lado[t + 1]), (a, lado[t])))
for (i1, j1), (i2, j2) in tramos:
    f += 1
    # .heks: el token 6 es I22 y el 7 es I33 (convencion CSI, ver CLAUDE.md); as: As2 (con I33) As3
    w.append("frame %d %d %d %.10g %.10g %.10g %.10g %.10g %g 0 # FSEC1" % (f, nid(i1, j1, nz), nid(i2, j2, nz), Es, A, I22, I33, J, nus))
    w.append("as %d 0.00193548 0.0020430066666666663" % f)
    w.append("frameload %d 0 0 -1 LINEAL" % f)
# RECTANGULAR: caras de los cubos de arriba con centroide en |x|<2.5, |y|<1.5: q*A/4 a cada nudo
carga = {}
for j in range(ny):
    for i in range(nx):
        cx, cy = X(i) + d / 2, X(j) + d / 2
        if abs(cx) < 2.5 and abs(cy) < 1.5:
            for (ii, jj) in ((i, j), (i + 1, j), (i + 1, j + 1), (i, j + 1)):
                carga[nid(ii, jj, nz)] = carga.get(nid(ii, jj, nz), 0) - 10 * d * d / 4
for n, fz in sorted(carga.items()):
    w.append("load %d 0 0 %.10g 0 0 0 RECTANGULAR" % (n, fz))
w.append("load %d 0 0 -100 0 0 0 PUNTUAL" % nid(nx // 2, ny // 2, nz))
w.append("combo COMB1 PUNTUAL 1 LINEAL 1 RECTANGULAR 1")
w.append("combo RECT_x3 RECTANGULAR 3")
w.append("solve")
open(out, "w", encoding="utf-8").write("\n".join(w) + "\n")
print(out, "nudos", (nx + 1) * (ny + 1) * (nz + 1), "hex", e, "apoyos", ns, "vigas", f, "nudos cargados R", len(carga), "suma R %.3f" % sum(carga.values()))
