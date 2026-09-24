# -*- coding: utf-8 -*-
"""Placa 16x16 con BORDE DURO y carga uniforme q=1.0 por unidad de area,
que es el ensayo de la Tabla 8.4 de Wilson (8.9.3). L=10, E=2.2e7, nu=0.2
(los del banco; el libro no da E ni nu). Espesores h = 1, 0.01, 0.0001 (los suyos).
Carga nodal consolidada: q*A/4 repartido por elemento (esquina q*a^2/4, borde /2, interior entero).
"""
import os
D = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validation\opensees"
N, L, E, NU, Q = 16, 10.0, 2.2e7, 0.2, 1.0
a = L / N
for h, tag, form in [(x, t, f) for x in (1.0, 0.01, 0.0001) for t, f in (("thin", "thin"), ("wil", "wilson"), ("mitc", "thick"))]:
    ln = ["# placa 16x16 borde DURO, carga uniforme q=1.0, h=%g, %s" % (h, form), "selfweight 0"]
    nid = {}
    k = 0
    for j in range(N + 1):
        for i in range(N + 1):
            k += 1; nid[(i, j)] = k
            ln.append("node %d %.6f %.6f 0" % (k, i * a, j * a))
    for j in range(N + 1):
        for i in range(N + 1):
            borde_x = (i == 0 or i == N); borde_y = (j == 0 or j == N)
            if borde_x or borde_y:
                ln.append("support %d 1 1 1 %d %d 1" % (nid[(i, j)], 1 if borde_x else 0, 1 if borde_y else 0))
    e = 0
    for j in range(N):
        for i in range(N):
            e += 1
            ln.append("shell %d %d %d %d %d %.6f %.6g %g 0" % (e, nid[(i, j)], nid[(i + 1, j)], nid[(i + 1, j + 1)], nid[(i, j + 1)], h, E, NU))
            ln.append("shelltype %d %s" % (e, form))
    for j in range(N + 1):
        for i in range(N + 1):
            fx = (0.5 if i in (0, N) else 1.0) * (0.5 if j in (0, N) else 1.0)
            ln.append("load %d 0 0 %.8f" % (nid[(i, j)], -Q * a * a * fx))
    ln.append("solve")
    f = os.path.join(D, "pl16_%s_%s.heks" % (tag, ("%g" % h).replace(".", "p")))
    open(f, "w").write("\n".join(ln) + "\n")
    print(os.path.basename(f))
print("centro = indice 0-based", (N + 1) * (N // 2) + N // 2)
