# -*- coding: utf-8 -*-
r"""DETECTAR la escala de los GDL de rotacion desde la PROPIA matriz.

El barrido `t x nu` salio con los grados de ROTACION escalados x1000 respecto a
las celdas guardadas: el ratio entrada a entrada es exactamente 1 (bloque w-w),
1000 (w-theta) y 1000000 (theta-theta). Son las unidades del momento en el `.K_0`
(kN*mm en vez de kN*m); el script de captura no las fija y ETABS uso otras.

Corregirlo con el factor 1000 a mano seria fiarse de una comparacion externa. Se
detecta de la propia K, que es autosuficiente:

Un elemento libre tiene TRES modos de energia nula, y dos de ellos son las
rotaciones de solido rigido. En una de ellas, `w = x*phi` y `theta = phi`, asi que

    |w| / |theta|   ~   la escala de las COORDENADAS

Si en vez de eso sale mil veces mas grande, los giros vienen multiplicados por
1000. El factor se lee del espacio nulo y se redondea a la potencia de 1000 mas
cercana (no hay medias tintas: son unidades, no un ajuste).
"""
import numpy as np


def factor_rot(K, pts):
    """potencia de 1000 por la que vienen escalados los GDL de rotacion."""
    K = (K+K.T)/2
    w, V = np.linalg.eigh(K)
    nul = V[:, np.abs(w) < 1e-8*np.abs(w).max()]
    if nul.shape[1] < 3:
        return 1.0, np.nan
    P = np.asarray(pts, float); xc, yc = P.mean(axis=0)
    r = np.sqrt(((P-[xc, yc])**2).sum(axis=1)).mean()      # radio medio de la celda
    # dentro del espacio nulo, el modo con MAS energia en giros
    mej, best = None, -1
    for j in range(nul.shape[1]):
        u = nul[:, j]
        et = u[1::3]@u[1::3] + u[2::3]@u[2::3]
        if et > best:
            best, mej = et, u
    ew = np.sqrt(mej[0::3]@mej[0::3]); et = np.sqrt(best)
    if et < 1e-12:
        return 1.0, np.nan
    razon = (ew/et)/r      # queda de orden 1 si las unidades son coherentes
    # el factor es la potencia de 1000 mas cercana: son unidades, no un ajuste,
    # asi que o es 1, o 1000, o 1e6 -- nunca algo intermedio.
    p = round(np.log10(max(razon, 1e-300))/3.0)
    return 1000.0**p, razon


def corrige(K, pts):
    """devuelve K con los grados de rotacion en unidades fisicas."""
    f, razon = factor_rot(K, pts)
    s = np.tile([1.0, 1.0/f, 1.0/f], 4)
    return np.outer(s, s)*np.asarray(K, float), f, razon


if __name__ == "__main__":
    import json, os
    GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"
    print("  %-28s %12s %12s" % ("caso", "razon w/(t*r)", "factor"))
    for f, ks in (("celda_sap_mods.json", ["entera"]),
                  ("celda_sap2000.json", None),
                  ("celda_sap_t_nu.json", None)):
        d = json.load(open(os.path.join(GAL, f), encoding="utf-8"))
        for k in (ks if ks else sorted(d))[:4]:
            v = d[k]
            if "K" not in v:
                continue
            _, fa, ra = corrige(np.array(v["K"], float), v["pts"])
            print("  %-28s %12.4f %12.0f" % ((f.split('.')[0]+":"+k)[:28], ra, fa))
