# -*- coding: utf-8 -*-
r"""EL ESPECTRO DEL RESTO: ¿falta un termino, o falla la formula entera?

Las dos hipotesis dan firmas DISTINTAS y separables, y hasta ahora se estaba
probando solo la primera:

  (a) al DSE le falta un TERMINO sumado (una penalizacion, como en el cuadrado).
      Entonces `R = K_ETABS - K_DSE` tiene RANGO BAJO: unos pocos autovalores
      grandes y el resto ruido numerico.

  (b) el DSE base ya es OTRA COSA en trapecios (otras coordenadas, otro jacobiano,
      otra cuadratura). Entonces R tiene rango ALTO y sus autovalores se reparten:
      no hay nada que sumar, hay que cambiar la formula.

Se mide el espectro de R normalizado por |K|, y se cuenta cuantos autovalores
hacen falta para explicar el 95 % de la norma. En el CUADRADO se sabe que salen 4
—ahi la hipotesis (a) es cierta y medida—. Lo que diga el trapecio decide.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def esp(K, pts, E, nu, t):
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    w = np.linalg.eigvalsh(R)
    o = np.argsort(-np.abs(w)); w = w[o]
    e = w**2; acum = np.cumsum(e)/e.sum()
    n95 = int(np.searchsorted(acum, 0.95)+1)
    return w, n95, np.linalg.norm(R)/np.linalg.norm(K)*100


if __name__ == "__main__":
    print("="*100)
    print("  Autovalores del resto R = K_ETABS - K_DSE, ordenados por magnitud,")
    print("  divididos por el mayor.  'n95' = cuantos hacen falta para el 95 % de |R|.")
    print("="*100)
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]; K = np.array(v["K"], float); K = (K+K.T)/2
    w, n95, rel = esp(K, v["pts"], v["E"], v["nu"], v["t"])
    print("\n  CUADRADO   n95=%d   |R|/|K|=%.1f%%" % (n95, rel))
    print("    " + " ".join("%8.1e" % (x/abs(w[0])) for x in w[:9]))

    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("\n  %-6s %5s %5s %9s   %s" % ("d", "t", "n95", "|R|/|K|", "lambda_i / lambda_1"))
    for k in sorted(tr):
        vv = tr[k]; Kk = np.array(vv["K"], float); Kk = (Kk+Kk.T)/2
        w, n95, rel = esp(Kk, vv["pts"], vv["E"], vv["nu"], vv["t"])
        print("  %-6.2f %5.2f %5d %8.1f%%   %s"
              % (vv["d"], vv["t"], n95, rel,
                 " ".join("%7.4f" % (x/abs(w[0])) for x in w[:7])))
