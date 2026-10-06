"""SAP2000 24 por OAPI: Load Case «Buckling» de cada modelo de modelos.py (Shell-Thin, misma malla) ->
sap_pandeo_cascara.json: factores λ, forma de cada modo en todos los nudos y F11/F22/F12 del estático (joints).
    python validation/pandeo_cascara/sap_pandeo_cascara.py [nombre ...]"""
import json, os, sys
import comtypes.client
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from modelos import MODELOS, E, NU
import comtypes.gen.SAP2000v1 as S

AQUI = os.path.dirname(os.path.abspath(__file__))
RUTA = os.path.join(AQUI, "sap_pandeo_cascara.json")
SOLO = sys.argv[1:]
NMODOS = 8
out = json.load(open(RUTA)) if os.path.exists(RUTA) else {}
json.dump(dict(E=E, nu=NU, modelos=MODELOS), open(os.path.join(os.path.dirname(RUTA), "modelos.json"), "w"))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
import time
for intento in range(6):      # SAP 24 a veces se cae al arrancar («xxx» a Integer, IPC cerrado): se reintenta
    try:
        o = h.CreateObject(r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe")
        o.ApplicationStart(6, False, ""); sm = o.SapModel; sm.GetVersion(); break
    except Exception as ex:
        print("arranque fallido", intento, ex, flush=True); time.sleep(20)   # sin ruta: SAP se cae al arrancar («xxx» a Integer)
for M in MODELOS:
    if SOLO and M["nombre"] not in SOLO: continue
    sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("AC", 1); sm.PropMaterial.SetMPIsotropic("AC", E, NU, 1.2e-5)
    sm.PropMaterial.SetWeightAndMass("AC", 1, 0.0)
    sm.PropArea.SetShell_1("SH", M.get("tipo", 1), True, "AC", 0, M["t"], M["t"])   # 1 = Shell-Thin, 2 = Shell-Thick
    for q, p in enumerate(M["nodos"]): sm.PointObj.AddCartesian(p[0], p[1], p[2], "", "N%d" % q)
    for e, c in enumerate(M["panos"]):
        sm.AreaObj.AddByPoint(len(c), ["N%d" % k for k in c], "", "SH", "A%d" % e)
        if M.get("mods"): sm.AreaObj.SetModifiers("A%d" % e, [float(x) for x in M["mods"]])
    for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint("N%d" % q, [bool(x) for x in s])
    sm.LoadPatterns.Add("P", 8, 0, True)
    for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce("N%d" % q, "P", [float(x) for x in c], True)
    sm.LoadCases.Buckling.SetCase("BUCK"); sm.LoadCases.Buckling.SetLoads("BUCK", 1, ["Load"], ["P"], [1.0])
    sm.LoadCases.Buckling.SetParameters("BUCK", NMODOS, 1e-12)
    ruta = os.path.join(AQUI, "sap", M["nombre"] + ".sdb"); os.makedirs(os.path.dirname(ruta), exist_ok=True)
    sm.File.Save(ruta); sm.Analyze.RunAnalysis()
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("BUCK")
    r = R.BucklingFactor(0, [], [], [], [])
    fac = list(r[4])
    modos = [[None] * len(M["nodos"]) for _ in fac]
    for q in range(len(M["nodos"])):
        d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        st = list(d[5]); vals = [list(d[k]) for k in range(6, 12)]
        for s in range(len(st)):
            k = int(round(st[s])) - 1
            if 0 <= k < len(fac): modos[k][q] = [v[s] for v in vals]
    # estático de las mismas cargas: F11 F22 F12 por joint de cada área + desplazamientos
    R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput("P")
    f = R.AreaForceShell("All", 2, 0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    fuerzas = {}
    for k in range(f[0]):
        fuerzas.setdefault(f[1][k], []).append([f[3][k], f[7][k], f[8][k], f[9][k]])   # obj, elm, pt, ..., F11 F22 F12
    est = {}
    for q in range(len(M["nodos"])):
        d = R.JointDispl("N%d" % q, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if d[0]: est[q] = [d[k][0] for k in range(6, 12)]
    out[M["nombre"]] = dict(factores=fac, modos=modos, fuerzas=fuerzas, estatico=est)
    print(M["nombre"], ["%.6f" % x for x in fac], "analítico %.4f" % (M["analitico"] or 0), flush=True)
    json.dump(out, open(RUTA, "w"), indent=1)
o.ApplicationExit(False)
