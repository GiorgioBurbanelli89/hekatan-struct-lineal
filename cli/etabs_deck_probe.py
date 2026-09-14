# -*- coding: utf-8 -*-
"""Cómo trabaja un DECK de ETABS. Abre tres_panos.e2k (3 paños 4x4 m iguales, misma carga en el plano)
y asigna: P1 Deck Filled (tc 65, hr 55, wrt 150, wrb 100, sr 200, chapa 0.76 mm) · P2 Membrana 0.065 · P3 Membrana 0.099375.
Lee ux del borde cargado y la masa ensamblada de cada paño."""
import sys, os, json
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", "deck_etabs")
_, S, _ = c.start_engine("etabs", 6, True)
def paso(n, v): print("%-26s %s" % (n, str(v)[:170]), flush=True); return v
c.load_model_from_file(S, os.path.join(D, "tres_panos.e2k"), 6)
S.SetPresentUnits(6)
mats = S.PropMaterial.GetNameList(); paso("materiales", mats)
mat = [m for m in mats[1] if "conc" in m.lower() or m.lower().startswith("c")][0]
A = S.PropArea
paso("SetDeck DK", A.SetDeck("DK", 1, 3, mat, 0.12))
paso("SetDeckFilled DK", A.SetDeckFilled("DK", 0.065, 0.055, 0.15, 0.10, 0.20, 0.00076, 0.1101246, 0.019, 0.10, 400000.0))
paso("SetSlab M65", A.SetSlab("M65", 0, 3, mat, 0.065))
paso("SetSlab M99", A.SetSlab("M99", 0, 3, mat, 0.099375))
for q in ("GetDeck", "GetDeckFilled"):
    try: paso(q, getattr(A, q)("DK"))
    except Exception as e: paso(q + " exc", e)
n, areas, _r = S.AreaObj.GetNameList()
paso("areas", areas)
props = ["DK", "M65", "M99"]
pan = []
for nm in areas:
    pts = list(S.AreaObj.GetPoints(nm)[1]); x = min(S.PointObj.GetCoordCartesian(p)[0] for p in pts)
    pan.append((x, nm, pts))
pan.sort()
for (x, nm, pts), pr in zip(pan, props):
    paso("SetProperty %s" % nm, (pr, S.AreaObj.SetProperty(nm, pr)))
paso("Save", S.File.Save(os.path.join(D, "deck_probe.EDB")))
paso("Run", S.Analyze.RunAnalysis())
paso("estado", S.Analyze.GetCaseStatus())
S.SetPresentUnits(6)
S.Results.Setup.DeselectAllCasesAndCombosForOutput(); S.Results.Setup.SetCaseSelectedForOutput("Dead")
mm = S.Results.AssembledJointMass("", 2, 0, [], [], [], [], [], [], [])
masa = dict(zip(mm[1], mm[2]))
res = {}
for (x, nm, pts), pr in zip(pan, props):
    ux = []
    for p in pts:
        d = S.Results.JointDispl(p, 0)
        if d[0] and abs(S.PointObj.GetCoordCartesian(p)[0] - x - 4) < 1e-3: ux.append(round(d[6][0] * 1000, 6))
    tot = sum(masa.get(p, 0.0) for p in pts)
    res[pr] = {"ux_borde_cargado_mm": ux, "masa_t_16m2": tot, "masa_t_m2": tot / 16}
    paso("RESULTADO %s" % pr, res[pr])
paso("masa total", sum(mm[2]))
json.dump(res, open(os.path.join(D, "deck_probe.json"), "w"), indent=1)
print("ETABS queda abierto con deck_probe.EDB")
