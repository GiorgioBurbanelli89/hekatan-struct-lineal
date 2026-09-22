# -*- coding: utf-8 -*-
"""Tabla final: flecha del nudo central (indice 40 = 5,5) con BORDE DURO.
Juez = SAP2000 (PlateThick). % = (Hekatan - SAP)/|SAP| * 100. Positivo = mas flexible.
"""
import json, os
V = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validation\opensees"
TS = ["0.001", "0.01", "0.05", "0.1", "0.2"]
def hek(t, v): return json.load(open(os.path.join(V, "pl_%s%s_dump.json" % (t, v))))["deformations"]["40"][2]
def sap(t, suf):
    f = os.path.join(V, "pl_%s%s.json" % (t, suf))
    if not os.path.exists(f): return None
    d = json.load(open(f))
    for n in d["nudos"]:
        if n["i"] == 40: return n["u"][2]
    return None
def osee(t):
    f = os.path.join(V, "pl_%s_hard_os.json" % t)
    return json.load(open(f))["desp"]["40"][2] if os.path.exists(f) else None
pc = lambda a, b: "%+.3f %%" % ((abs(a) - abs(b)) / abs(b) * 100) if (a is not None and b) else "—"

print("=== BORDE DURO — juez SAP2000 ===")
print("%-7s %-15s %-15s %-11s %-15s %-11s %-15s %-11s %-11s" % (
    "t/L", "SAP2000 (m)", "MITC4 (m)", "MITC4 %", "Wilson (m)", "Wilson %", "OpenSees (m)", "OpSees %", "Thin/DKQ %"))
for t in TS:
    s = sap(t, "_hard_sap"); m = hek(t, "_hard"); w = hek(t, "_hard_w"); o = osee(t); th = hek(t, "_hard_thin")
    print("%-7s %-15.6e %-15.6e %-11s %-15.6e %-11s %-15.6e %-11s %-11s" % (
        t, s if s is not None else float("nan"), m, pc(m, s), w, pc(w, s), o, pc(o, s), pc(th, s)))

print()
print("=== control: BORDE BLANDO (lo ya medido el 17-sep) ===")
print("%-7s %-15s %-11s %-11s" % ("t/L", "SAP2000 (m)", "MITC4 %", "Wilson-soft %"))
for t in TS:
    s = sap(t, "_sap"); m = hek(t, "")
    f = os.path.join(V, "pl_%s_soft_w_dump.json" % t)
    w = json.load(open(f))["deformations"]["40"][2] if os.path.exists(f) else None
    print("%-7s %-15.6e %-11s %-11s" % (t, s, pc(m, s), pc(w, s) if w else "—"))

print()
print("=== Tabla 8.4 del libro: razon DSE/DKE (Kirchhoff) ===")
print("libro, malla 16x16, h=0.01 y h=0.0001: 9.815/9.807 = %.5f" % (9.815 / 9.807))
print("%-7s %-12s %-12s" % ("t/L", "Wilson/Thin", "MITC4/Thin"))
for t in TS:
    th = hek(t, "_hard_thin")
    print("%-7s %-12.5f %-12.5f" % (t, hek(t, "_hard_w") / th, hek(t, "_hard") / th))
