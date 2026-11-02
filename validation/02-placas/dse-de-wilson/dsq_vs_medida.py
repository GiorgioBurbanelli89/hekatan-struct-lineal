# -*- coding: utf-8 -*-
r"""EL DSQ CONTRA LA CELDA MEDIDA de SAP2000/ETABS.

La pregunta: en TRAPECIOS el DSE (=PQ3 de Wilson/Ibrahimbegovic) se va, y el
paper confiesa que el PQ3 nunca se probo distorsionado. El DSQ de Batoz-Lardeur
es su hermano (mismo 2/3, mismos Delta_beta condensados) pero cierra el hueco
del cortante por EQUILIBRIO en vez de por colocacion, y SI tiene resultados
publicados en malla distorsionada. Se prueba si es ese.

Se compara, contra la K medida por desplazamiento unitario:
  * ||dK||/||K||           (la matriz entera, 144 numeros)
  * autovalores / D        (los 9 modos con energia)
  * MAC                    (emparejando por FORMA, que el orden enganna)
"""
import json, os
import numpy as np
from dsq_batoz import K_DSQ
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def rel(A, B):
    return np.linalg.norm(A-B)/np.linalg.norm(A)*100


def modos(K, D):
    w, V = np.linalg.eigh((K+K.T)/2)
    o = np.argsort(w)
    return w[o][3:]/D, V[:, o][:, 3:]


def emparejar(wa, Va, wb, Vb):
    """Para cada modo de A busca el de B con mayor MAC."""
    out = []
    for i in range(len(wa)):
        mac = [(Va[:, i] @ Vb[:, j])**2 /
               ((Va[:, i] @ Va[:, i])*(Vb[:, j] @ Vb[:, j]))
               for j in range(len(wb))]
        j = int(np.argmax(mac))
        out.append((wa[i], wb[j], mac[j]))
    return out


kd = json.load(open(os.path.join(GAL, "k_directa.json"), encoding="utf-8"))

print("=" * 78)
print("  LA CELDA MEDIDA  vs  DSE (Wilson/PQ3)  vs  DSQ (Batoz-Lardeur)")
print("=" * 78)
for nombre, v in kd.items():
    K = np.array(v["K"]); K = (K+K.T)/2
    pts, E, nu, t = v["pts"], v["E"], v["nu"], v["t"]
    thin = (v["tipo"] == 1)
    D = E*t**3/(12*(1-nu*nu))
    Kdse = K_DSE(pts, E, nu, t, thin=thin)
    Kdsq = K_DSQ(pts, E, nu, t, "DKQ" if thin else "DSQ")

    print("\n%-14s  %s   ||dK||/||K||:  DSE %7.3f %%   DSQ %7.3f %%"
          % (nombre, "thin " if thin else "thick", rel(K, Kdse), rel(K, Kdsq)))
    we, Ve = modos(K, D)
    for etq, Kx in (("DSE", Kdse), ("DSQ", Kdsq)):
        wx, Vx = modos(Kx, D)
        par = emparejar(we, Ve, wx, Vx)
        print("   %s  medida -> %s :" % (etq, etq))
        print("      medida: " + " ".join("%9.4f" % a for a, _, _ in par))
        print("      %s   : " % etq + " ".join("%9.4f" % b for _, b, _ in par))
        print("      MAC   : " + " ".join("%9.4f" % m for _, _, m in par))
        err = [abs(b-a)/a*100 for a, b, m in par if m > 0.9]
        print("      con MAC>0.9 (%d modos): error medio %6.2f %%  max %6.2f %%"
              % (len(err), np.mean(err) if err else 0, max(err) if err else 0))
