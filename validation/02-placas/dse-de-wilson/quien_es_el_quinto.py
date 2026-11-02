# -*- coding: utf-8 -*-
r"""¿QUE ES el quinto modo?  Bateria de candidatos contra el vector medido.

`quinto_modo.py` probo que existe y que **depende de la geometria** (el MAC entre
trapecios vecinos es 0.95-1.00 y cae al separarse en `d`, pero casi no cambia con
el espesor). O sea: es un modo GEOMETRICO, no una constante suelta.

Aqui no se adivina: se construyen los candidatos que la teoria de placas ofrece y
se mide el MAC de cada uno contra el vector extraido. El que salga ~1 en TODOS
los trapecios es el que es; si ninguno pasa, se dice que ninguno pasa.

Candidatos, y de donde sale cada uno:

  h_bruto    reloj de arena de `w` SIN ortogonalizar (en un cuadrado coincide con
             el ortogonalizado; en un trapecio NO — ahi esta la sospecha)
  phi_nat    el modo phi en coordenadas NATURALES: los giros se abren de xi,eta en
             vez de x,y. En el cuadrado es el mismo vector; en el trapecio, otro.
  w_twist    reloj COMPATIBLE de Kirchhoff: w = xi*eta y los giros son su gradiente
             (beta = grad w). Es el modo que un DKQ penaliza y un Mindlin no.
  w_xy       la torsion cartesiana w = (x-xc)(y-yc), giros = gradiente
  h_solo_ty  reloj de arena solo en theta_y (el reparto medido dice w~80/ty~15)
"""
import json, os
import numpy as np
from dse_wilson import K_DSE
from ajuste_2x2 import vectores
from quinto_modo import residuo, mac

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
H = np.array([1.0, -1.0, 1.0, -1.0])
NAT = [(-1, -1), (1, -1), (1, 1), (-1, 1)]


def _pack(w, tx, ty):
    v = np.zeros(12)
    v[0::3], v[1::3], v[2::3] = w, tx, ty
    n = np.linalg.norm(v)
    return v/n if n > 1e-14 else v


def _jac_nodal(P, xi, eta):
    """J en (xi,eta) para el Q4 bilineal: filas = d/dxi, d/deta."""
    dN = np.array([[-(1-eta), (1-eta), (1+eta), -(1+eta)],
                   [-(1-xi), -(1+xi),  (1+xi),   (1-xi)]])/4.0
    return dN @ P, dN


def candidatos(pts):
    P = np.asarray(pts, float)
    xc, yc = P.mean(axis=0)
    x, y = P[:, 0]-xc, P[:, 1]-yc
    C = {}
    C["h_bruto"] = _pack(H, np.zeros(4), np.zeros(4))
    # phi natural: giros que se abren de xi,eta
    xi = np.array([a for a, _ in NAT], float); eta = np.array([b for _, b in NAT], float)
    C["phi_nat"] = _pack(np.zeros(4), xi, eta)
    # torsion compatible: w = xi*eta, giros = gradiente cartesiano de esa w
    wt = xi*eta
    tx = np.zeros(4); ty = np.zeros(4)
    for i, (a, b) in enumerate(NAT):
        J, _ = _jac_nodal(P, a, b)
        g_nat = np.array([b, a], float)            # d(xi*eta)/dxi, /deta
        gx, gy = np.linalg.solve(J, g_nat)         # -> d/dx, d/dy
        tx[i], ty[i] = gy, -gx                     # beta_x=+ty, beta_y=-tx
    C["w_twist"] = _pack(wt, tx, ty)
    # torsion cartesiana w = x*y, gradiente exacto
    C["w_xy"] = _pack(x*y, x, -y)
    C["h_solo_ty"] = _pack(np.zeros(4), np.zeros(4), H)
    C["h_solo_tx"] = _pack(np.zeros(4), H, np.zeros(4))
    return C


if __name__ == "__main__":
    tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
    nombres = list(candidatos([(0, 0), (1, 0), (1, 1), (0, 1)]).keys())
    print("="*104)
    print("  MAC del vector MEDIDO (lo que sobra tras quitar los 4 conocidos)")
    print("  contra cada candidato. 1.00 = es ese modo.")
    print("="*104)
    print("  %-6s %5s  %s" % ("d", "t", " ".join("%11s" % n for n in nombres)))
    acum = {n: [] for n in nombres}
    for k in sorted(tr):
        v = tr[k]
        K = np.array(v["K"], float); K = (K+K.T)/2
        R, Rr, nR = residuo(K, v["pts"], v["E"], v["nu"], v["t"])
        w, V = np.linalg.eigh(Rr)
        u = V[:, int(np.argmax(np.abs(w)))]
        C = candidatos(v["pts"])
        # el candidato tambien hay que PROYECTARLO fuera del span conocido:
        Vk = vectores(v["pts"]); Q, _ = np.linalg.qr(Vk); Pr = np.eye(12)-Q@Q.T
        fila = []
        for n in nombres:
            c = Pr@C[n]
            m = mac(u, c) if np.linalg.norm(c) > 1e-10 else 0.0
            acum[n].append(m); fila.append("%11.3f" % m)
        print("  %-6.2f %5.2f  %s" % (v["d"], v["t"], " ".join(fila)))
    print("\n  %-13s %s" % ("MEDIA", " ".join("%11.3f" % np.mean(acum[n]) for n in nombres)))
    print("  %-13s %s" % ("MINIMO", " ".join("%11.3f" % np.min(acum[n]) for n in nombres)))
