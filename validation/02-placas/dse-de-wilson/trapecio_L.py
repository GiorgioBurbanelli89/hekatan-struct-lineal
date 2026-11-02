# -*- coding: utf-8 -*-
r"""¿QUE LONGITUD usa CSI en un TRAPECIO?

El barrido de tamaños dejo el modo bien puesto: el factor optimo es `c = 1/L`
EXACTO (2.0, 1.0, 0.5, 0.2, 0.1 para L = 0.5, 1, 2, 5, 10), y con el, el resto sin
explicar cae a 0.001-0.010 % en las 23 celdas cuadradas. O sea

    theta = w / (4 L)

que ya es dimensionalmente sano: giro = desplazamiento / longitud.

En un trapecio la pregunta se vuelve interesante, porque **`L` deja de ser un
numero**: el lado de abajo mide 1, el de arriba mide menos, y la altura otra cosa.
Se barre el `c` optimo celda a celda y se compara contra los candidatos naturales:

    1/L_abajo · 1/L_media · 1/L_altura · 1/sqrt(A) · 1/L_diagonal · 2/J0 (jacobiano)

El que salga clavado en las 27 celdas es la longitud que usa CSI. Y si el `fuera`
se desploma con el, los trapecios dejan de estar abiertos.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from factor_hg import fuera

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def escalas(pts):
    P = np.asarray(pts, float)
    lados = [np.linalg.norm(P[(i+1) % 4]-P[i]) for i in range(4)]
    d1 = np.linalg.norm(P[2]-P[0]); d2 = np.linalg.norm(P[3]-P[1])
    A = 0.5*abs((P[2, 0]-P[0, 0])*(P[3, 1]-P[1, 1]) - (P[2, 1]-P[0, 1])*(P[3, 0]-P[1, 0]))
    # jacobiano en el centro del Q4 bilineal
    dN = np.array([[-1., 1., 1., -1.], [-1., -1., 1., 1.]])/4.0
    J0 = dN @ P
    return {"L_abajo": lados[0], "L_arriba": lados[2],
            "L_media": np.mean(lados), "L_altura": 0.5*(lados[1]+lados[3]),
            "sqrt_A": np.sqrt(A), "L_diag": 0.5*(d1+d2),
            "2*detJ0**.5": 2*np.sqrt(abs(np.linalg.det(J0)))}


tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
NOM = list(escalas([(0, 0), (1, 0), (1, 1), (0, 1)]).keys())
print("="*112)
print("  `c` optimo del modo de reloj, contra 1/escala para cada candidato de longitud")
print("  (la columna buena es la que da 1.000 en todas las filas)")
print("="*112)
print("  %-6s %5s %9s %9s   %s" % ("d", "t", "c optimo", "fuera", "  ".join("%10s" % n for n in NOM)))
acum = {n: [] for n in NOM}
for k in sorted(tr):
    v = tr[k]
    K = np.array(v["K"], float); K = (K+K.T)/2
    R = K - K_DSE(v["pts"], v["E"], v["nu"], v["t"]); R = (R+R.T)/2
    cs = np.linspace(0.3, 3.0, 700)
    vals = [fuera(R, v["pts"], c)[0] for c in cs]
    i = int(np.argmin(vals))
    cf = np.linspace(cs[max(i-1, 0)], cs[min(i+1, len(cs)-1)], 400)
    vf = [fuera(R, v["pts"], c)[0] for c in cf]
    j = int(np.argmin(vf)); c = cf[j]
    E = escalas(v["pts"])
    rat = {n: c*E[n] for n in NOM}
    for n in NOM:
        acum[n].append(rat[n])
    print("  %-6.2f %5.2f %9.4f %8.3f%%   %s"
          % (v["d"], v["t"], c, vf[j], "  ".join("%10.4f" % rat[n] for n in NOM)))
print("\n  %-23s %s" % ("MEDIA", "  ".join("%10.4f" % np.mean(acum[n]) for n in NOM)))
print("  %-23s %s" % ("DESVIACION", "  ".join("%10.4f" % np.std(acum[n]) for n in NOM)))
