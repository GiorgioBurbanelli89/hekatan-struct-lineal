# AreaForceShell de SAP2000 (caso DEAD = todas las cargas nodales) del muro con contrafuertes ya calculado (sap_cf.sdb).
import json, os, comtypes.client
import comtypes.gen.SAP2000v1 as S
AQUI = os.path.dirname(os.path.abspath(__file__)); D = json.load(open(os.path.join(AQUI, "cf.json")))
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
try: o = h.GetObject("CSI.SAP2000.API.SapObject")
except Exception: o = None
if o is None: o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
sm = o.SapModel; print("abrir", sm.File.OpenFile(os.path.join(AQUI, "sap_cf.sdb")), flush=True); sm.SetPresentUnits(6)
if not sm.GetModelIsLocked(): print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("DEAD")
out = []
for k, e in enumerate(D["elements"]):
    if len(e) != 4: continue
    r = sm.Results.AreaForceShell("A%d" % k, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    for a in range(r[0]):
        out.append({"area": k, "pt": int(str(r[3][a]).lstrip("N")), "F11": r[7][a], "F22": r[8][a], "F12": r[9][a], "M11": r[14][a], "M22": r[15][a], "M12": r[16][a], "V13": r[20][a], "V23": r[21][a]})
json.dump(out, open(os.path.join(AQUI, "sap_cf_fuerzas.json"), "w"))
print("filas", len(out), flush=True)
