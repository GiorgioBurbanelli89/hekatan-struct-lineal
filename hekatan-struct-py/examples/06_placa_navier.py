# -*- coding: utf-8 -*-
"""Placa cuadrada 4x4 m, t = 0.1 m, q = 10 kN/m2: DKQ, DKT y thick contra Navier (simple) y Timoshenko (empotrada)."""
from hekatan_struct_py import Placa

E, NU, T, A, Q = 2.1e8, 0.3, 0.1, 4.0, -10.0
D = E * T ** 3 / (12 * (1 - NU ** 2))
for bc, (wr, mr) in {"simple": (0.00406, 0.0479), "empotrado": (0.00126, 0.0231)}.items():
    for tipo in ("dkq", "dkt", "thick"):
        p = Placa.rectangular(A, A, 16, 16, tipo, E, NU, T)
        p.apoyar_borde(bc); p.carga_area(Q); r = p.solve()
        c = p.nodo_cercano(A / 2, A / 2)
        print("%-9s %-5s w/(qa4/D) = %.5f (ref %.5f)  M11/(qa2) = %.4f (ref %.4f)  sumRz = %.3f"
              % (bc, tipo, r["w"][c] / (Q * A ** 4 / D), wr, abs(p.momentos_nodales()[c, 0]) / abs(Q * A * A), mr, r["sumRz"]))
        if tipo == "dkq":
            p.png("placa_%s_w.png" % bc, "w"); p.png("placa_%s_M11.png" % bc, "M11")
