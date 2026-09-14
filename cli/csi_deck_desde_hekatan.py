# -*- coding: utf-8 -*-
"""SAP2000 (juez) y ETABS abren los ficheros que ESCRIBIÓ Hekatan para el deck (tres_panos_deck.s2k / .e2k).
Mide: ux del borde cargado (2×5 kN en el plano por paño) y el PESO PROPIO que calcula el programa
(Dead con SelfWT = 1: peso CSI = ΣFz − 117.5527 kN de las cargas nodales que ya trae el fichero).
    python cli/csi_deck_desde_hekatan.py sap|etabs
"""
import sys, os, json
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c

motor = sys.argv[1] if len(sys.argv) > 1 else "sap"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", "deck_etabs")
fich = os.path.join(D, "tres_panos_deck." + ("s2k" if motor == "sap" else "e2k"))
eng = "sap" if motor == "sap" else "etabs"
_, S, _ = c.start_engine(eng, 6, True)
def paso(n, v): print("%-22s %s" % (n, str(v)[:200]), flush=True); return v
c.load_model_from_file(S, fich, 6)
S.SetPresentUnits(6)
pats = S.LoadPatterns.GetNameList(); paso("patrones", pats)
dead = [p for p in pats[1] if p.upper() == "DEAD"][0]
if motor == "etabs":
    paso("prop DECK", S.PropArea.GetDeck("DECK"))
    paso("DeckFilled", S.PropArea.GetDeckFilled("DECK"))
ANTES = 117.5527                               # 12 × 9.7960425 kN (el peso de Hekatan como cargas nodales)
res = {}
for mult in (0, 1):
    S.SetModelIsLocked(False)
    paso("SelfWT %d" % mult, S.LoadPatterns.SetSelfWTMultiplier(dead, mult))
    ruta = os.path.join(D, "deck_hek_%s_sw%d.%s" % (motor, mult, "sdb" if motor == "sap" else "EDB"))
    paso("Save", S.File.Save(ruta))
    paso("Run", S.Analyze.RunAnalysis())
    S.SetPresentUnits(6)
    S.Results.Setup.DeselectAllCasesAndCombosForOutput(); S.Results.Setup.SetCaseSelectedForOutput(dead)
    n, nombres, _r = S.PointObj.GetNameList()
    ux, fz = {}, 0.0
    for p in nombres:
        x, y, z = S.PointObj.GetCoordCartesian(p)[:3]
        d = S.Results.JointDispl(p, 0)
        if d[0] and abs(z - 3) < 1e-6 and abs(x % 10 - 4) < 1e-3:
            ux[p] = round(d[6][0] * 1000, 6)
        r = S.Results.JointReact(p, 0)
        if r[0]: fz += r[8][0]
    res["sw%d" % mult] = {"ux_mm": ux, "SumFz_kN": round(fz, 4), "peso_CSI_kN": round(fz - ANTES, 4)}
    paso("RESULTADO sw%d" % mult, res["sw%d" % mult])
json.dump(res, open(os.path.join(D, "deck_hek_%s.json" % motor), "w"), indent=1)
print("queda abierto:", ruta)
