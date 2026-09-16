# -*- coding: utf-8 -*-
"""Genera una TORRE RETORCIDA en .heks, al modo del Turning Torso de Malmö.

Los datos del edificio real son públicos: 54 plantas, 190 m, la planta gira 90
grados de la base a la cima en nueve cubos de cinco plantas. Aquí cada planta
gira `giro/plantas` respecto a la de abajo, así que NINGUNA columna es vertical
y cada viga va torcida respecto a la de la planta anterior. Es la geometría que
rompe a cualquier programa que suponga pisos alineados.

    python gen_torre_retorcida.py salida.heks [plantas] [giro_total]

Lo que monta, por planta:
  · pentágono exterior de R = 10 m (5 columnas de 0.60 x 0.60)
  · pentágono interior de r = 3.5 m (5 columnas de núcleo, más gruesas)
  · vigas perimetrales, vigas del núcleo y cinco radiales
  · losa de 0.20 m como anillo de CINCO cáscaras Q4 de cuatro nudos distintos
    (un Q4 colapsado —el 4º nudo repetido— no es un elemento definido: el
     jacobiano del borde es cero y cada motor cae en un ruido distinto)
"""
import math, sys

SAL = sys.argv[1] if len(sys.argv) > 1 else "torre_retorcida.heks"
NP = int(sys.argv[2]) if len(sys.argv) > 2 else 27        # plantas
GIRO = float(sys.argv[3]) if len(sys.argv) > 3 else 90.0  # grados de la base a la cima
H = 3.5           # altura de planta (m)
RE, RI = 10.0, 3.5
NL = 5            # lados del pentágono
E_C = 2.4e7       # kN/m2 (hormigón de 24 MPa)
NU = 0.2
RHO = 2.4         # t/m3  (MASA, no peso)
COL_B, COL_H = 0.60, 0.60
NUC_B, NUC_H = 0.90, 0.90
VIG_B, VIG_H = 0.30, 0.50
T_LOSA = 0.20
NR = int(sys.argv[4]) if len(sys.argv) > 4 else 1   # divisiones radiales de la losa
NC = int(sys.argv[5]) if len(sys.argv) > 5 else 1   # divisiones por lado

def props(b, h):
    """A, I22, I33, J de un rectángulo; J por la fórmula de Saint-Venant."""
    A = b * h
    I33 = b * h ** 3 / 12.0        # plano 1-2 (el del canto)
    I22 = h * b ** 3 / 12.0
    a, c = max(b, h) / 2.0, min(b, h) / 2.0
    J = a * c ** 3 * (16 / 3.0 - 3.36 * c / a * (1 - c ** 4 / (12 * a ** 4)))
    return A, I22, I33, J

L = ["# Torre retorcida (Turning Torso): %d plantas, %.0f m, giro total %.0f grados"
     % (NP, NP * H, GIRO),
     "# %.3f grados por planta: ninguna columna es vertical" % (GIRO / NP),
     "selfweight 1", "meshcross 0"]

nid = {}; n = 0
for p in range(NP + 1):
    ang = math.radians(GIRO * p / NP); z = p * H
    for i in range(NL):
        th = ang + 2 * math.pi * i / NL
        n += 1; nid[(p, "e", i)] = n
        L.append("node %d %.6f %.6f %.6f" % (n, RE * math.cos(th), RE * math.sin(th), z))
    for i in range(NL):
        th = ang + 2 * math.pi * i / NL
        n += 1; nid[(p, "i", i)] = n
        L.append("node %d %.6f %.6f %.6f" % (n, RI * math.cos(th), RI * math.sin(th), z))

for i in range(NL):
    L.append("support %d 1 1 1 1 1 1" % nid[(0, "e", i)])
    L.append("support %d 1 1 1 1 1 1" % nid[(0, "i", i)])

e = 0
def barra(n1, n2, b, h, etq):
    global e
    A, I22, I33, J = props(b, h)
    e += 1
    L.append("frame %d %d %d %.6g %.8g %.10g %.10g %.10g %.2f %.4f %.3f %.3f # %s"
             % (e, n1, n2, E_C, A, I22, I33, J, NU, RHO, b, h, etq))

for p in range(NP):
    for i in range(NL):
        barra(nid[(p, "e", i)], nid[(p + 1, "e", i)], COL_B, COL_H, "COL 60x60")
        barra(nid[(p, "i", i)], nid[(p + 1, "i", i)], NUC_B, NUC_H, "NUCLEO 90x90")

# La losa: anillo entre el pentagono exterior y el interior. Con NR = NC = 1 cada
# sector es UN trapecio muy distorsionado (lado interior 4 m, exterior 12 m) y
# ahi cada formulacion da lo suyo; NR/NC > 1 lo parten en una malla decente.
s = 0
malla = {}
for p in range(1, NP + 1):
    ang = math.radians(GIRO * p / NP); z = p * H
    esq = lambda i, r: (r * math.cos(ang + 2*math.pi*i/NL), r * math.sin(ang + 2*math.pi*i/NL))
    # 1) los bordes RADIALES primero: son de dos sectores a la vez. Creandolos
    #    dentro del bucle de sectores quedaban 27 nudos duplicados (uno por
    #    planta, al cerrar el pentagono) que SAP2000 fusiona por MERGETOL y
    #    Hekatan no: dos modelos distintos, 254 % de diferencia.
    radial = {}
    for i in range(NL):
        P0, P1 = esq(i, RI), esq(i, RE)
        for a_ in range(NR + 1):
            if a_ == 0: radial[(i, a_)] = nid[(p, "i", i)]; continue
            if a_ == NR: radial[(i, a_)] = nid[(p, "e", i)]; continue
            fu = a_ / NR
            n += 1; radial[(i, a_)] = n
            L.append("node %d %.6f %.6f %.6f"
                     % (n, P0[0] + fu*(P1[0]-P0[0]), P0[1] + fu*(P1[1]-P0[1]), z))
    # 2) los de dentro de cada sector
    for i in range(NL):
        j = (i + 1) % NL
        P00, P10, P01, P11 = esq(i, RI), esq(i, RE), esq(j, RI), esq(j, RE)
        for a_ in range(NR + 1):
            malla[(p, i, a_, 0)] = radial[(i, a_)]
            malla[(p, i, a_, NC)] = radial[(j, a_)]
            for b_ in range(1, NC):
                fu, fv = a_ / NR, b_ / NC
                x = (1-fu)*(1-fv)*P00[0] + fu*(1-fv)*P10[0] + (1-fu)*fv*P01[0] + fu*fv*P11[0]
                y = (1-fu)*(1-fv)*P00[1] + fu*(1-fv)*P10[1] + (1-fu)*fv*P01[1] + fu*fv*P11[1]
                n += 1; malla[(p, i, a_, b_)] = n
                L.append("node %d %.6f %.6f %.6f" % (n, x, y, z))
    for i in range(NL):
        for a_ in range(NR):
            for b_ in range(NC):
                s += 1
                L.append("shell %d %d %d %d %d %.3f %.6g 0 %.3f"
                         % (e + s, malla[(p, i, a_, b_)], malla[(p, i, a_+1, b_)],
                            malla[(p, i, a_+1, b_+1)], malla[(p, i, a_, b_+1)], T_LOSA, E_C, RHO))

# Vigas de planta SOBRE los bordes de la malla de losa: si se trazaran de esquina
# a esquina, los nudos intermedios de la losa no tocarian viga ninguna, la losa
# quedaria colgada y la torre saldria el doble de flexible (medido: T1 2.87 -> 5.76 s).
for p in range(1, NP + 1):
    for i in range(NL):
        for b_ in range(NC):
            barra(malla[(p, i, NR, b_)], malla[(p, i, NR, b_ + 1)], VIG_B, VIG_H, "VIGA 30x50")
            barra(malla[(p, i, 0, b_)], malla[(p, i, 0, b_ + 1)], VIG_B, VIG_H, "VIGA NUCLEO")
        for a_ in range(NR):
            barra(malla[(p, i, a_, 0)], malla[(p, i, a_ + 1, 0)], VIG_B, VIG_H, "RADIAL 30x50")

L.append("solve")
open(SAL, "w", encoding="utf-8").write("\n".join(L) + "\n")
print("%s: %d nudos, %d barras, %d losas  (%d plantas, %.0f m, giro %.0f grados)"
      % (SAL, n, e, s, NP, NP * H, GIRO))
