# -*- coding: utf-8 -*-
r"""EL SEGUNDO MODO EN CRUDO, en el cuadrado, nodo a nodo.

`los_dos_modos.py` acaba de reencuadrar el problema: el resto `K_ETABS - K_DSE`
son **exactamente dos modos**, ni cuatro ni cinco — phi y el reloj de arena de `w`.
Y en el CUADRADO, donde no hay ninguna ambiguedad geometrica, el reloj da
MAC = **0.889**, no 1.000. Le acompaña algo, y ese algo es justo el 8.29 % que se
quedaba fuera del ajuste.

Aqui se imprime el autovector tal cual, nodo por nodo, sin candidatos y sin
proyectar. 0.889 = cos^2 -> el vector real tiene 1 - 0.889 = 11 % de su energia
fuera de `w`. Con cuatro nudos y tres GDL se ve a simple vista donde esta.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"

kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
v = kd["entera"]
K = np.array(v["K"], float); K = (K+K.T)/2
pts = v["pts"]; E, nu, t = v["E"], v["nu"], v["t"]
D = E*t**3/(12*(1-nu*nu))
R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
w, V = np.linalg.eigh(R)
o = np.argsort(-np.abs(w))

print("  celda: %s   E=%g  nu=%g  t=%g   D=%.6g" % (pts, E, nu, t, D))
for j in (0, 1, 2, 3):
    u = V[:, o[j]]
    if abs(u[np.argmax(np.abs(u))]) > 0:
        u = u*np.sign(u[np.argmax(np.abs(u))])
    print("\n  modo %d   lambda/D = %.6f" % (j+1, w[o[j]]/D))
    print("     nudo        w         theta_x      theta_y")
    for i in range(4):
        print("      %d    %10.6f  %10.6f  %10.6f" % (i+1, u[3*i], u[3*i+1], u[3*i+2]))
    ew = u[0::3]@u[0::3]; ex = u[1::3]@u[1::3]; ey = u[2::3]@u[2::3]
    print("     energia:  w %.2f %%   tx %.2f %%   ty %.2f %%" % (ew*100, ex*100, ey*100))

print("\n  --- el reloj de arena PURO seria w=[1,-1,1,-1]/2, giros 0 ---")
print("  --- si el modo 2 lleva giros, la penalizacion de CSI no es solo en w ---")
