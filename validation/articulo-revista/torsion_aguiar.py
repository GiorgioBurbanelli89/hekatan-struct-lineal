# -*- coding: utf-8 -*-
"""Aguiar en coordenadas de piso a partir de la flexibilidad condensada de torsion_aguiar.mjs (1-oct-2026).

  K_E = F⁻¹ (3n × 3n, GDL por piso u_x, u_y, θ en el CM)        M = diag(m, m, J) por piso
  modos de K_E·φ = ω²·M·φ  → se comparan con los del modelo de cáscaras (si cuadran, la condensación vale)
  acoplamiento lateral-torsión por piso:   e_y = K_yθ / K_yy,  e_x = −K_xθ / K_xx   (bloques diagonales del piso)
  índice de acoplamiento  ρ = |K_yθ| / √(K_yy·K_θθ)    0 = sin torsión por excentricidad

    python validation/articulo-revista/torsion_aguiar.py   → torsion_aguiar_resultado.json
"""
import json, os
import numpy as np
from scipy.linalg import eigh

AQUI = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(AQUI, "torsion_aguiar.json"), encoding="utf-8"))
OUT = {}
for nom, r in D.items():
    F = np.array(r["aguiar"]["F"]); n = len(r["aguiar"]["masa"])
    F = 0.5 * (F + F.T)                    # Maxwell-Betti: simétrica salvo redondeo
    KE = np.linalg.inv(F)
    M = np.diag(sum(([m, m, J] for m, J in zip(r["aguiar"]["masa"], r["aguiar"]["J"])), []))
    w2, phi = eigh(KE, M)
    T = 2 * np.pi / np.sqrt(w2)
    # participación por tipo de GDL (energía cinética de cada componente)
    part = []
    for j in range(3 * n):
        v = phi[:, j]; e = [sum(M[3 * k + c, 3 * k + c] * v[3 * k + c] ** 2 for k in range(n)) for c in range(3)]
        s = sum(e); part.append([x / s for x in e])
    pisos = []
    for k in range(n):
        B = KE[3 * k:3 * k + 3, 3 * k:3 * k + 3]
        pisos.append(dict(Kxx=B[0, 0], Kyy=B[1, 1], Ktt=B[2, 2], Kxt=B[0, 2], Kyt=B[1, 2],
                          ey=B[1, 2] / B[1, 1], ex=-B[0, 2] / B[0, 0],
                          rho_y=abs(B[1, 2]) / np.sqrt(B[1, 1] * B[2, 2]), rho_x=abs(B[0, 2]) / np.sqrt(B[0, 0] * B[2, 2])))
    Tfem = [m["T"] for m in r["modos"]]
    OUT[nom] = dict(T_aguiar=T[:6].tolist(), T_cascaras=Tfem[:6], part=part[:6], pisos=pisos,
                    KE_piso1=KE[:3, :3].tolist())
    print(f"\n== {nom}")
    print("T Aguiar 3n GDL :", " ".join(f"{t:.4f}" for t in T[:4]))
    print("T cáscaras FEM  :", " ".join(f"{t:.4f}" for t in Tfem[:4]))
    print("modo: ux uy θ   :", " | ".join("%.0f %.0f %.0f" % tuple(100 * x for x in p) for p in part[:4]))
    for k, p in enumerate(pisos):
        print(f"piso {k+1}: e_x {p['ex']:+.3f} m  e_y {p['ey']:+.3f} m   ρx {p['rho_x']:.3f}  ρy {p['rho_y']:.3f}")
    np.set_printoptions(precision=1, suppress=False)
    print("K_E piso 1 (tonf/m, tonf, tonf·m):\n", KE[:3, :3])
json.dump(OUT, open(os.path.join(AQUI, "torsion_aguiar_resultado.json"), "w", encoding="utf-8"), indent=1)
