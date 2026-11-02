# -*- coding: utf-8 -*-
r"""¿Es CORTANTE lo que falta?  El candidato que la fisica sugiere.

Pista que lo dispara: el vector que sobra dio MAC 0.87-0.89 contra el reloj de
arena BRUTO — pero el reloj bruto, una vez proyectado fuera del span conocido, ya
NO es un reloj: es su **parte LINEAL**. O sea que lo que sobra tiene `w` lineal
con los giros a cero.

Y eso tiene nombre. En Mindlin la deformacion de cortante es

    gamma_x = beta_x + dw/dx        gamma_y = beta_y + dw/dy

asi que `w = x` con los giros a CERO no es un movimiento de cuerpo rigido (ese
lleva tambien el giro): es **cortante transversal constante**. Los tres modos
nulos del elemento son w=1 y las dos rotaciones rigidas, y este no es ninguno.

Candidatos que se prueban, en el complemento del span conocido:

    sx     w = x-xc,  giros 0          cortante puro en x
    sy     w = y-yc,  giros 0          cortante puro en y
    SPAN   el plano {sx, sy}: se mide cuanto del vector medido CAE en el,
           que es lo que vale si la mezcla de los dos cambia con la geometria
"""
import json, os
import numpy as np
from ajuste_2x2 import vectores
from quinto_modo import residuo, mac
from ajuste_v2 import resid, base, _col, H, NAT
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def cort(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    Z = np.zeros(4)
    return _col(P[:, 0]-xc, Z, Z), _col(P[:, 1]-yc, Z, Z)


def frac_en_span(u, cols):
    """que fraccion de energia de u cae en el span de `cols` (ya ortonormalizado)."""
    A = np.column_stack(cols)
    Q, _ = np.linalg.qr(A)
    return float(np.linalg.norm(Q.T@u)**2/(u@u))


if __name__ == "__main__":
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("="*88)
    print("  ¿el modo que sobra es CORTANTE?   (1.00 = si)")
    print("="*88)
    print("  %-6s %5s %9s %9s %11s" % ("d", "t", "MAC sx", "MAC sy", "en span{sx,sy}"))
    for k in sorted(tr):
        v = tr[k]
        K = np.array(v["K"], float); K = (K+K.T)/2
        R, Rr, nR = residuo(K, v["pts"], v["E"], v["nu"], v["t"])
        w, V = np.linalg.eigh(Rr)
        u = V[:, int(np.argmax(np.abs(w)))]
        Vk = vectores(v["pts"]); Q, _ = np.linalg.qr(Vk); Pr = np.eye(12)-Q@Q.T
        sx, sy = cort(v["pts"])
        sx, sy = Pr@sx, Pr@sy
        print("  %-6.2f %5.2f %9.3f %9.3f %11.3f"
              % (v["d"], v["t"], mac(u, sx), mac(u, sy), frac_en_span(u, [sx, sy])))
