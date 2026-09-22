# -*- coding: utf-8 -*-
"""Cruza hekatan_variantes.json (masa completa, lat=0) contra sap_dual.json.
Empareja modos por participacion [Ux, Uy, Uz, Rz] (coseno) y periodo mas cercano.
    python comparar.py > comparacion.txt"""
import json, math, sys
sys.stdout.reconfigure(encoding="utf-8")
H = json.load(open("hekatan_variantes.json")); S = json.load(open("sap_dual.json"))

def vec(ux, uy, uz, rz):
    v = [ux, uy, uz, rz]; n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]

def emparejar(Th, mph, Ts, cs):
    pares = []
    for i, t in enumerate(Th):
        vh = vec(mph[i][0], mph[i][1], mph[i][2], mph[i][5])
        mejor = None
        for j, ts in enumerate(Ts):
            vs = vec(cs["Ux"][j], cs["Uy"][j], cs["Uz"][j], cs["Rz"][j])
            cos = sum(a * b for a, b in zip(vh, vs))
            if cos < 0.7 or not (0.5 < t / ts < 2): continue
            clave = abs(t / ts - 1)
            if mejor is None or clave < mejor[0]: mejor = (clave, j, cos)
        pares.append((i, mejor))
    return pares

print("Dual 2x2x4, malla 1 m, %d nudos, masa completa. SAP2000 24 misma malla.\n" % H["nudos"])
for tipoSap, filtro in (("THIN", lambda v: v["pf"] in (1, 3)), ("THICK", lambda v: True)):
    cs = S["casos"].get(tipoSap)
    if not cs: continue
    print("=== SAP2000 Shell-%s: T1-5 %s  SUx %.1f SUy %.1f" % (tipoSap.title(), " ".join("%.4f" % t for t in cs["T"][:5]), cs["sumUx"], cs["sumUy"]))
    print("%-32s %-22s %s   %s" % ("Hekatan", "origen", "dif % modos 1..5 (par por forma)", "peor 1-5"))
    for v in H["variantes"]:
        if v["lateral"] != 0 or not filtro(v): continue
        pares = emparejar(v["T"][:5], v["mp"], cs["T"], cs)
        difs = []
        for i, m in pares:
            difs.append("%+6.2f" % ((v["T"][i] / cs["T"][m[1]] - 1) * 100) if m else "   s/p")
        num = [abs(float(d)) for d in difs if d.strip() != "s/p"]
        print("%-32s %-22s %s   %.2f" % (v["nom"], v["origen"], " ".join(difs), max(num) if num else float("nan")))
    print()
