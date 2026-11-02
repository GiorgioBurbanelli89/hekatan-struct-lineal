# -*- coding: utf-8 -*-
r"""EL TAMIZ, segunda pasada: con las piezas AISLADAS de verdad, y en TRAPECIOS.

`celda_sap_mods.json` es mejor dato que `flex12_piezas_thick.json`: ahi los
modificadores APAGAN todo menos uno (`solo_m11`...), asi que la pieza es la K
medida tal cual, sin restar nada. Y son K DIRECTAS (desplazamiento unitario ->
reacciones), no reconstruidas por flexibilidad. nu = 0.

Dos preguntas:
  1. ¿se confirma que lo que sobra es RANGO 1 sobre phi, con el mismo
     coeficiente k en kxx, kyy y kxy?
  2. en TRAPECIOS (`celda_sap_trapecios.json`, 27 casos d x t), ¿sigue siendo
     rango 1?, ¿sigue el mismo k?
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def sim(K):
    K = np.array(K, float)
    return (K+K.T)/2


def esp(K, D):
    return np.sort(np.linalg.eigvalsh(sim(K)))[::-1]/D


def mac(a, b):
    return (a@b)**2/((a@a)*(b@b))


d = json.load(open(os.path.join(GAL, "celda_sap_mods.json"), encoding="utf-8"))
v0 = d["entera"]
E, nu, t, pts = v0["E"], v0["nu"], v0["t"], v0["pts"]
D = E*t**3/(12*(1-nu*nu))
print("celda %s   E=%g  nu=%g  t=%g   D=%g" % (pts, E, nu, t, D))

print("\n" + "="*104)
print("  A · LAS PIEZAS AISLADAS DE VERDAD (solo_m11 = todo apagado menos m11)")
print("="*104)
print("  %-14s %-24s %5s  %s" % ("caso", "mods", "rango", "autovalores/D"))
for k in ("entera", "solo_m11", "solo_m22", "solo_m12", "solo_v13", "solo_v23",
          "flexion", "cortante"):
    if k not in d:
        continue
    w = esp(d[k]["K"], D)
    r = int((np.abs(w) > 1e-7*max(abs(w[0]), 1e-30)).sum())
    print("  %-14s %-24s %5d  %s" % (k, str(d[k]["mods"][:8]), r,
          " ".join("%9.4f" % z for z in w[:6])))

print("\n  ¿el modo grande de cada pieza es el MISMO vector?")
V = {}
for k in ("solo_m11", "solo_m22", "solo_m12", "solo_v13", "entera"):
    if k not in d:
        continue
    w, v = np.linalg.eigh(sim(d[k]["K"]))
    V[k] = (w[-1]/D, v[:, -1])
ks = list(V)
print("  %-10s %10s   %s" % ("", "lambda/D", "  ".join("%-10s" % z for z in ks)))
for a in ks:
    print("  %-10s %10.4f   %s" % (a, V[a][0],
          "  ".join("%-10.4f" % mac(V[a][1], V[b][1]) for b in ks)))

print("\n  el REPARTO:  con nu=0 -> D11=D22=D, D33=(1-nu)/2 D = 0.5 D")
if all(x in V for x in ("solo_m11", "solo_m22", "solo_m12")):
    a1, a2, a3 = V["solo_m11"][0], V["solo_m22"][0], V["solo_m12"][0]
    print("     k de m11 = %9.4f / 1.0 = %9.4f" % (a1, a1/1.0))
    print("     k de m22 = %9.4f / 1.0 = %9.4f" % (a2, a2/1.0))
    print("     k de m12 = %9.4f / 0.5 = %9.4f" % (a3, a3/0.5))
    print("     suma     = %9.4f      entera = %9.4f" % (a1+a2+a3, V["entera"][0]))

# ── B · los trapecios ───────────────────────────────────────────────────
tr = json.load(open(os.path.join(GAL, "celda_sap_trapecios.json"), encoding="utf-8"))
print("\n" + "="*104)
print("  B · TRAPECIOS: el resto  K_medida - K_DSE   (27 casos d x t)")
print("  ¿sigue siendo rango 1?  ¿sigue el mismo k?")
print("="*104)
print("  %-12s %5s %6s %6s %6s   %s" % ("caso", "d", "t", "rango", "l1/l2",
      "autovalores del resto / D"))
prev = None
for k in sorted(tr):
    v = tr[k]
    E2, nu2, t2, pts2 = v["E"], v["nu"], v["t"], v["pts"]
    D2 = E2*t2**3/(12*(1-nu2*nu2))
    K = sim(v["K"])
    R = K - K_DSE(pts2, E2, nu2, t2)
    R = (R+R.T)/2
    w, vv = np.linalg.eigh(R)
    w = w[::-1]; vv = vv[:, ::-1]
    r = int((np.abs(w) > 1e-6*max(abs(w[0]), 1e-30)).sum())
    ratio = w[0]/w[1] if abs(w[1]) > 1e-30 else np.inf
    print("  %-12s %5.2f %6.2f %6d %6.1f   %s"
          % (k, v["d"], t2, r, ratio, " ".join("%9.3f" % z for z in w[:5]/D2)))


# ══════════════════════════════════════════════════════════════════════════
#  C · SEPARAR los dos modos grandes POR FORMA (el orden enganna)
#      phi = el modo con todas las curvaturas cero y divergencia de giros != 0.
#      Con  kxx = ty,x   kyy = -tx,y   kxy = ty,y - tx,x  eso es
#          w = 0 ,  tx = a*x ,  ty = a*y      -> vector construible en cualquier
#      geometria, sin depender de que sea o no autovector.
# ══════════════════════════════════════════════════════════════════════════
def vec_phi(pts):
    """phi = giros que se ABREN desde el centro:  tx = x-xc,  ty = y-yc,  w = 0.

    ⚠️ Hay que CENTRAR. Con x,y sin centrar el MAC contra el modo real sale
    0.500000 exacto: la parte constante de los giros es OTRO modo. El centro es
    el del elemento en coordenadas naturales, que para el Q4 bilineal es la
    media de los 4 nudos."""
    P = np.asarray(pts, float)
    xc, yc = P.mean(axis=0)
    v = np.zeros(12)
    for i, (x, y) in enumerate(pts):
        v[3*i+1] = x-xc; v[3*i+2] = y-yc
    return v/np.linalg.norm(v)


print("\n" + "="*104)
print("  C · ¿cual de los dos modos grandes es phi?  (control en el cuadrado primero)")
print("="*104)
Kc = sim(d["entera"]["K"])
wc, vc = np.linalg.eigh(Kc)
p = vec_phi(pts)
print("  cuadrado: MAC(phi construido, modo de %.4f) = %.6f"
      % (wc[-1]/D, mac(p, vc[:, -1])))

print("\n  %-12s %5s %6s   %10s %6s   %10s %6s" %
      ("caso", "d", "t", "lambda_1/D", "MACphi", "lambda_2/D", "MACphi"))
for k in sorted(tr):
    v = tr[k]
    E2, nu2, t2, pts2 = v["E"], v["nu"], v["t"], v["pts"]
    D2 = E2*t2**3/(12*(1-nu2*nu2))
    R = sim(v["K"]) - K_DSE(pts2, E2, nu2, t2)
    R = (R+R.T)/2
    w, vv = np.linalg.eigh(R)
    w = w[::-1]; vv = vv[:, ::-1]
    p2 = vec_phi(pts2)
    print("  %-12s %5.2f %6.2f   %10.3f %6.3f   %10.3f %6.3f"
          % (k, v["d"], t2, w[0]/D2, mac(p2, vv[:, 0]),
             w[1]/D2, mac(p2, vv[:, 1])))

print("\n  y el cociente de Rayleigh de phi sobre el resto  (no depende del orden):")
print("  %-12s %5s %6s   %12s   %12s" % ("caso", "d", "t", "phi'Rphi/D", "k = /(2.5)"))
for k in sorted(tr):
    v = tr[k]
    E2, nu2, t2, pts2 = v["E"], v["nu"], v["t"], v["pts"]
    D2 = E2*t2**3/(12*(1-nu2*nu2))
    R = sim(v["K"]) - K_DSE(pts2, E2, nu2, t2)
    p2 = vec_phi(pts2)
    ray = (p2@R@p2)/(p2@p2)/D2
    print("  %-12s %5.2f %6.2f   %12.4f   %12.4f" % (k, v["d"], t2, ray, ray/2.5))
