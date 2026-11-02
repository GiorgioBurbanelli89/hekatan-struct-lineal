# -*- coding: utf-8 -*-
r"""EL QUINTO MODO: sacarlo de los datos en vez de adivinarlo.

`ajuste_2x2.py` dejo la cosa asi: el resto `R = K_ETABS - K_DSE` se explica al
100 % en el CUADRADO con cuatro vectores (phi + los tres relojes de arena), pero
en TRAPECIOS se queda fuera un 17-88 %. Como el ajuste por minimos cuadrados ya
es el optimo, lo que falla no es el metodo: **faltan vectores**.

Aqui no se propone ninguno. Se hace lo contrario, que es lo unico honesto:

  1. se le quita a R todo lo que vive en el span de los cuatro conocidos
     (proyector P = I - V V^+, con V ortonormalizada),
  2. se diagonaliza lo que queda,
  3. y se mira si el autovector dominante es EL MISMO en los 12 trapecios.

Si sale el mismo (MAC ~ 1 entre casos), es un modo de verdad y se puede leer su
forma. Si sale distinto en cada uno, no hay quinto modo: lo que falta es que la
formula de los cuatro cambia con la geometria.  `y = m x + b`.
"""
import json, os, sys
import numpy as np
from dse_wilson import K_DSE
from ajuste_2x2 import vectores

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def residuo(K, pts, E, nu, t):
    """R sin la parte que explican los cuatro vectores conocidos."""
    R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
    V = vectores(pts)
    Q, _ = np.linalg.qr(V)                 # base ortonormal del span
    P = np.eye(12) - Q@Q.T                 # proyector al complemento
    return R, P@R@P, np.linalg.norm(R)


def mac(a, b):
    return float((a@b)**2/((a@a)*(b@b)))


def describe(v, pts):
    """que ES el vector: cuanta energia en w, en tx, en ty; y su forma nodal."""
    w = v[0::3]; tx = v[1::3]; ty = v[2::3]
    e = np.array([w@w, tx@tx, ty@ty]); e = e/e.sum()*100
    return e, w, tx, ty


if __name__ == "__main__":
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    print("="*100)
    print("  Lo que queda del resto DESPUES de quitar phi y los tres relojes")
    print("="*100)
    print("  %-6s %5s %9s %9s   %s" % ("d", "t", "|resid|%", "|l1|/|l2|", "reparto de energia  w / tx / ty"))
    guard = []
    for k in sorted(tr):
        v = tr[k]
        K = np.array(v["K"], float); K = (K+K.T)/2
        R, Rr, nR = residuo(K, v["pts"], v["E"], v["nu"], v["t"])
        w, V = np.linalg.eigh(Rr)
        o = np.argsort(-np.abs(w))
        l1, l2 = w[o[0]], w[o[1]]
        u = V[:, o[0]]
        e, _, _, _ = describe(u, v["pts"])
        guard.append((v["d"], v["t"], u, l1, nR))
        print("  %-6.2f %5.2f %8.2f%% %9.2f   %5.1f / %5.1f / %5.1f"
              % (v["d"], v["t"], np.linalg.norm(Rr)/nR*100,
                 abs(l1)/max(abs(l2), 1e-30), e[0], e[1], e[2]))

    print("\n" + "="*100)
    print("  ¿ES EL MISMO VECTOR EN TODOS?   MAC entre el 1er autovector de cada caso")
    print("  (1.00 = mismo modo; disperso = no hay un quinto modo unico)")
    print("="*100)
    n = len(guard)
    print("       " + " ".join("%6s" % ("%.2f/%.2f" % (guard[j][0], guard[j][1]))[:6] for j in range(n)))
    for i in range(n):
        print("  %5s" % ("%.2f/%.2f" % (guard[i][0], guard[i][1]))[:6]
              + " " + " ".join("%6.2f" % mac(guard[i][2], guard[j][2]) for j in range(n)))
