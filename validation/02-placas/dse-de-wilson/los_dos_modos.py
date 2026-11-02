# -*- coding: utf-8 -*-
r"""LOS DOS MODOS: mirar los autovectores dominantes de R sin proyectar nada.

`espectro_resto.py` corrigio el planteamiento entero. El resto NO tiene rango 4:
tiene **rango 1 o 2** en las 27 celdas (n95 = 1-2). Ajustarlo con cuatro vectores
era sobreparametrizar, y aun asi fallaba — señal clara de que los vectores no eran
los buenos, no de que faltaran vectores.

La pregunta correcta, entonces, es directa: los DOS autovectores que llevan toda
la norma de R, ¿que son? Se miden contra los candidatos SIN proyectar fuera de
ningun span (proyectar fue lo que enturbio la lectura anterior: dejaba solo la
parte lineal de cada candidato y por eso todo daba MAC ~0.87 contra `w` lineal).
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from quien_es_el_quinto import candidatos, _pack
from quinto_modo import mac

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
H = np.array([1., -1., 1., -1.])


def cands(pts):
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    x, y = P[:, 0]-xc, P[:, 1]-yc; Z = np.zeros(4)
    C = candidatos(pts)
    C["phi"] = _pack(Z, x, y)
    C["w_hg"] = _pack(H, Z, Z)
    C["sx"] = _pack(x, Z, Z)
    C["sy"] = _pack(y, Z, Z)
    return C


ORD = ["phi", "phi_nat", "w_hg", "w_twist", "sx", "sy", "h_solo_tx", "h_solo_ty"]

if __name__ == "__main__":
    def linea(tag, K, pts, E, nu, t):
        D = E*t**3/(12*(1-nu*nu))
        R = K - K_DSE(pts, E, nu, t); R = (R+R.T)/2
        w, V = np.linalg.eigh(R)
        o = np.argsort(-np.abs(w))
        C = cands(pts)
        for j in (0, 1):
            u = V[:, o[j]]
            m = {n: mac(u, C[n]) for n in ORD}
            best = max(m, key=lambda n: m[n])
            print("  %-11s v%d  lam/D=%11.2f  %s   -> %s (%.3f)"
                  % (tag if j == 0 else "", j+1, w[o[j]]/D,
                     " ".join("%5.2f" % m[n] for n in ORD), best, m[best]))

    print("="*118)
    print("  %-11s     %13s  %s" % ("caso", "autovalor", " ".join("%5s" % n[:5] for n in ORD)))
    print("="*118)
    kd = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
    v = kd["entera"]; K = np.array(v["K"], float); K = (K+K.T)/2
    linea("CUADRADO", K, v["pts"], v["E"], v["nu"], v["t"])
    print("-"*118)
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    for k in sorted(tr):
        vv = tr[k]; Kk = np.array(vv["K"], float); Kk = (Kk+Kk.T)/2
        linea("d=%.2f t=%.2f" % (vv["d"], vv["t"]), Kk, vv["pts"], vv["E"], vv["nu"], vv["t"])
