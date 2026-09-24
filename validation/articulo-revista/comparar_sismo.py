# -*- coding: utf-8 -*-
"""Cruza hekatan_cortante_derivas.json contra sap_dual_sismo.json y escupe las
Tablas 3 (cortante basal) y 4 (derivas de piso) del articulo, con SAP2000 de juez.

    python comparar_sismo.py
"""
import json, math, os, sys
sys.stdout.reconfigure(encoding="utf-8")
AQUI = os.path.dirname(os.path.abspath(__file__))
H = json.load(open(os.path.join(AQUI, "hekatan_cortante_derivas.json"), encoding="utf-8"))
S = json.load(open(os.path.join(AQUI, "sap_dual_sismo.json"), encoding="utf-8"))

def dif(h, s):
    return (h / s - 1) * 100 if s else float("nan")

print("Dual 2x2x4, malla 1.0 m, %d nudos en los DOS programas. Unidades tonf, m.\n" % H["nudos"])

print("== TABLA 3 — CORTANTE BASAL (tonf) ==")
print("%-34s %10s %10s %10s" % ("Concepto", "Hekatan", "SAP2000", "Dif (%)"))
fil = [
    ("Carga sismica reactiva W",      H["W"],           S["W_sap_tonf"]),
    ("Estatico (FLE NEC), V_est",     H["Vestatico"],   S["Vx_LX_tonf"]),
    ("Dinamico espectral X, V_din,X", H["VdinamicoX"],  S["V_SPECX_tonf"]),
    ("Dinamico espectral Y, V_din,Y", H["VdinamicoY"],  S["V_SPECY_tonf"]),
]
for nom, h, s in fil:
    print("%-34s %10.3f %10.3f %+10.2f" % (nom, h, s, dif(h, s)))
rh = H["VdinamicoX"] / H["Vestatico"] * 100
rs = S["V_SPECX_tonf"] / S["Vx_LX_tonf"] * 100
print("%-34s %9.1f%% %9.1f%%            (NEC-15 6.2.2.b: >= 80 %%)" % ("V_din,X / V_est", rh, rs))

print("\n== TABLA 4 — DERIVAS DE PISO, direccion X ==")
print("%-6s %9s %9s %9s %9s %9s" % ("Piso", "he(%)", "hs(%)", "HM(%)", "SM(%)", "Dif(%)"))
for h, s in zip(H["pisos"], S["pisos"]):
    assert abs(h["z"] - s["z"]) < 1e-6, "pisos descuadrados"
    print("%-6d %9.4f %9.4f %9.4f %9.4f %+9.2f"
          % (h["piso"], h["driftE"] * 100, s["driftE"] * 100,
             h["driftM"] * 100, s["driftM"] * 100, dif(h["driftM"], s["driftM"])))
mh = max(p["driftM"] for p in H["pisos"]); ms = max(p["driftM"] for p in S["pisos"])
print("max    %29.4f %9.4f %+9.2f   (limite NEC 2 %%)" % (mh * 100, ms * 100, dif(mh, ms)))
print("\n(he/hs = deriva ELASTICA Hekatan/SAP;  HM/SM = inelastica DM = 0.75*R*De, R=%g)"
      % H["nec"]["R"])
print("ux por nivel (mm):")
print("   Hekatan  %s" % "  ".join("%.4f" % (p["ux"] * 1000) for p in H["pisos"]))
print("   SAP2000  %s" % "  ".join("%.4f" % (p["ux"] * 1000) for p in S["pisos"]))
