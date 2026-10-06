"""SAP2000 (juez): la matriz de MEMBRANA 9×9 [u v θz]×3 de UN triángulo Shell-Thin, por FLEXIBILIDAD (caja negra).
Apoyos isostáticos en el plano (nudo 0: u, v; nudo 1: v) + w, θx, θy fijos en los tres; carga unitaria en cada uno de
los 6 gdl libres (un patrón por gdl) → F 6×6 → K_red = F⁻¹ → K 9×9 con los modos de sólido rígido (u, v, giro).
    python sap_tri_flex.py  -> sap_tri_flex.json"""
import json, os, sys, time
import comtypes.client
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from modelos import E, NU
GEOS = {"rect05": [[0, 0], [0.5, 0], [0.5, 0.5]], "rect05b": [[0, 0], [0.5, 0.5], [0, 0.5]],
        "general": [[0, 0], [2.0, 0], [0.7, 1.5]], "obtuso": [[0, 0], [1.0, 0], [1.6, 0.4]],
        "muro": [[0, 0], [1.0, 0], [1.0, 1.0]]}
T = 0.15
LIBRES = [(0, 5), (1, 0), (1, 5), (2, 0), (2, 1), (2, 5)]   # (nudo, gdl) libres en el plano; gdl 5 = θz
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
for intento in range(6):
    try:
        o = h.CreateObject(r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe")
        o.ApplicationStart(6, False, ""); sm = o.SapModel; sm.GetVersion(); break
    except Exception as ex:
        print("arranque fallido", intento, ex, flush=True); time.sleep(20)
out = {}
for nombre, P in GEOS.items():
    sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("AC", 1); sm.PropMaterial.SetMPIsotropic("AC", E, NU, 1.2e-5)
    sm.PropMaterial.SetWeightAndMass("AC", 1, 0.0)
    sm.PropArea.SetShell_1("SH", 1, True, "AC", 0, T, T)
    for q, p in enumerate(P): sm.PointObj.AddCartesian(p[0], p[1], 0.0, "", "N%d" % q)
    sm.AreaObj.AddByPoint(3, ["N0", "N1", "N2"], "", "SH", "A0")
    sm.PointObj.SetRestraint("N0", [True, True, True, True, True, False])
    sm.PointObj.SetRestraint("N1", [False, True, True, True, True, False])
    sm.PointObj.SetRestraint("N2", [False, False, True, True, True, False])
    for k, (q, g) in enumerate(LIBRES):
        pat = "L%d" % k; sm.LoadPatterns.Add(pat, 8, 0, True)
        f = [0.0] * 6; f[g] = 1.0; sm.PointObj.SetLoadForce("N%d" % q, pat, f, True)
    sm.File.Save(os.path.join(AQUI, "sap", "tri_flex_%s.sdb" % nombre)); sm.Analyze.RunAnalysis()
    R = sm.Results; Fm = []
    for k in range(len(LIBRES)):
        R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("L%d" % k)
        col = []
        for (q, g) in LIBRES:
            d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], []); col.append(d[6 + g][0])
        Fm.append(col)
    out[nombre] = dict(P=P, t=T, libres=LIBRES, F=Fm)
    print(nombre, "ok", flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_tri_flex.json"), "w"), indent=1)
o.ApplicationExit(False)
