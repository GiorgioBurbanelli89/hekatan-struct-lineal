# -*- coding: utf-8 -*-
"""Barrido de J (y resto) del ÁNGULO y DOBLE ÁNGULO paramétricos de SAP2000: se cambia UNA cota cada vez
para ver qué entra en la torsión.  python cli/_csi_2l_barrido.py CARPETA"""
import sys, os, json
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
sys.stdout.reconfigure(encoding="utf-8")
carp = os.path.abspath(sys.argv[1]); os.makedirs(carp, exist_ok=True)
_, S, _ = c.start_engine("sap", 6, True)
S.InitializeNewModel(6); S.File.NewBlank()
S.PropMaterial.SetMaterial("ACERO", 1); S.PropMaterial.SetMPIsotropic("ACERO", 200e6, 0.3, 1.2e-5)
k = ["Area", "As2", "As3", "Torsion", "I22", "I33"]
base = dict(t3=0.075, t2=0.050, tf=0.008, tw=0.006, dis=0.012)
casos = {"base": {}}
for key, vals in (("t3", (0.050, 0.100)), ("t2", (0.040, 0.070)), ("tf", (0.005, 0.010)), ("tw", (0.004, 0.008)), ("dis", (0.0, 0.030))):
    for v in vals: casos[f"{key}={v}"] = {key: v}
out = {"2L": {}, "L": {}}
for i, (nom, cambio) in enumerate(casos.items()):
    g = {**base, **cambio}
    n2 = f"D{i}"; S.PropFrame.SetDblAngle(n2, "ACERO", g["t3"], g["t2"], g["tf"], g["tw"], g["dis"])
    out["2L"][nom] = {"dims": g, **dict(zip(k, [float(v) for v in S.PropFrame.GetSectProps(n2)[:6]]))}
    # ángulo simple con el ancho de UNO de los dos: (t2 - dis)/2
    w = (g["t2"] - g["dis"]) / 2
    n1 = f"A{i}"; S.PropFrame.SetAngle(n1, "ACERO", g["t3"], w, g["tf"], g["tw"])
    out["L"][nom] = {"dims": {"t3": g["t3"], "t2": w, "tf": g["tf"], "tw": g["tw"]}, **dict(zip(k, [float(v) for v in S.PropFrame.GetSectProps(n1)[:6]]))}
json.dump(out, open(os.path.join(carp, "barrido_2l_sap.json"), "w"), indent=1)
print("ok", len(casos), flush=True)
os._exit(0)
