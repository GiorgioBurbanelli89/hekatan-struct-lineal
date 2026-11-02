# -*- coding: utf-8 -*-
r"""AUTOSEMEJANZA: ¿depende del TAMAÑO ETABS, o mi K_DSE?

Los cuatro modos cierran al 0.001-0.005 % con L=1 y a cualquier espesor, pero con
L = 0.5, 2, 5, 10 se van al 3-59 %. Y NO es que ETABS mallara la celda: las 16
tienen **3 autovalores nulos exactos**, o sea que son elementos aislados de verdad.

Un elemento finito legitimo no puede depender del tamaño ABSOLUTO: solo de la
forma, de `t/L` y de `nu`. Asi que o ETABS hace algo con el tamaño, o el que tiene
mal la escala es mi `K_DSE` — y eso importa el doble, porque los trapecios tambien
son un cambio de escala (local, no global) y podria ser el mismo fallo.

La prueba, `y = m x + b`: se ADIMENSIONALIZA la matriz. Para una placa, `w` tiene
unidades de longitud y los giros no, asi que con `S = diag(L,1,1)` por nudo,

    K_gorro  =  S K S / D          debe depender SOLO de (t/L, nu)

Se comparan entonces celdas con el MISMO `t/L` y distinto tamaño: L=1,t=0.02 contra
L=10,t=0.2 (las dos t/L = 0.02). Si las `K_gorro` de ETABS coinciden, ETABS es
autosemejante y el fallo es mio. Si no coinciden, es de ETABS.
"""
import json, os
import numpy as np
from dse_wilson import K_DSE

GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"


def gorro(K, pts, E, nu, t):
    P = np.asarray(pts, float); L = P[:, 0].max()-P[:, 0].min()
    D = E*t**3/(12*(1-nu*nu))
    s = np.tile([L, 1.0, 1.0], 4)
    return (np.outer(s, s)*K)/D, L


def carga(fich, filtro=None):
    d = json.load(open(os.path.join(GAL, fich), encoding="utf-8"))
    out = {}
    for k, v in d.items():
        if "K" not in v or "pts" not in v:
            continue
        P = np.array(v["pts"], float)
        Lx, Ly = P[:, 0].max()-P[:, 0].min(), P[:, 1].max()-P[:, 1].min()
        if abs(Lx-Ly) > 1e-9 or v["nu"] != 0.0:
            continue
        K = np.array(v["K"], float); K = (K+K.T)/2
        G, L = gorro(K, v["pts"], v["E"], v["nu"], v["t"])
        out[(round(L, 4), round(v["t"], 6))] = (G, v["pts"], v["E"], v["nu"], v["t"], K)
    return out


A = carga("celda_sap2000.json")
B = carga("celda_sap_espesor.json")
TODO = {**B, **A}

print("="*94)
print("  K adimensional de ETABS:  parejas con el MISMO t/L y distinto tamaño")
print("="*94)
print("  %-18s %-18s %8s %12s" % ("caso 1", "caso 2", "t/L", "|dif|/|K| "))
claves = sorted(TODO)
hecho = set()
for (L1, t1) in claves:
    for (L2, t2) in claves:
        if (L1, t1) >= (L2, t2) or abs(L1-L2) < 1e-9:
            continue
        if abs(t1/L1 - t2/L2) > 1e-9:
            continue
        G1, G2 = TODO[(L1, t1)][0], TODO[(L2, t2)][0]
        e = np.linalg.norm(G1-G2)/np.linalg.norm(G1)*100
        print("  L=%-6.2f t=%-8.4f L=%-6.2f t=%-8.4f %8.4f %11.5f %%"
              % (L1, t1, L2, t2, t1/L1, e))
        hecho.add((L1, t1))

print("\n" + "="*94)
print("  Y LO MISMO para mi K_DSE — si ETABS es autosemejante y el mio no, el bug es mio")
print("="*94)
for (L1, t1) in claves:
    for (L2, t2) in claves:
        if (L1, t1) >= (L2, t2) or abs(L1-L2) < 1e-9 or abs(t1/L1-t2/L2) > 1e-9:
            continue
        r1 = TODO[(L1, t1)]; r2 = TODO[(L2, t2)]
        D1 = r1[2]*r1[4]**3/(12*(1-r1[3]**2)); D2 = r2[2]*r2[4]**3/(12*(1-r2[3]**2))
        s1 = np.tile([L1, 1.0, 1.0], 4); s2 = np.tile([L2, 1.0, 1.0], 4)
        M1 = np.outer(s1, s1)*K_DSE(r1[1], r1[2], r1[3], r1[4])/D1
        M2 = np.outer(s2, s2)*K_DSE(r2[1], r2[2], r2[3], r2[4])/D2
        print("  L=%-6.2f t=%-8.4f L=%-6.2f t=%-8.4f %8.4f %11.5f %%"
              % (L1, t1, L2, t2, t1/L1, np.linalg.norm(M1-M2)/np.linalg.norm(M1)*100))
