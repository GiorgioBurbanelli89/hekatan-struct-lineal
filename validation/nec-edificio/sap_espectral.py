# -*- coding: utf-8 -*-
"""SAP2000: abre estatico/sap_estatico.sdb (misma malla que Hekatan), define la función NEC-15 (espectro elástico, g),
casos RSX/RSY con CQC 5 % y factor I·g/R, 12 modos; vuelca cortante basal y desplazamientos CQC de todos los nudos."""
import json, os, sys, comtypes.client
AQUI = os.path.dirname(os.path.abspath(__file__))
SP = json.load(open(os.path.join(AQUI, "espectro_nec15.json")))
h = comtypes.client.CreateObject("SAP2000v1.Helper")
import comtypes.gen.SAP2000v1 as S
h = h.QueryInterface(S.cHelper)
try: o = h.GetObject("CSI.SAP2000.API.SapObject")
except Exception: o = None
if o is None:
    o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
sm = o.SapModel
print("abrir", sm.File.OpenFile(os.path.join(AQUI, "estatico", "sap_estatico.sdb")), flush=True)
sm.SetModelIsLocked(False); sm.SetPresentUnits(6)
print("func", sm.Func.FuncRS.SetUser("NEC15", len(SP["T"]), SP["T"], SP["Sa"], 0.05), flush=True)
sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)
g = 9.80665; I, R = 1.0, 8.0
for nm, U in (("RSX", "U1"), ("RSY", "U2")):
    rs = sm.LoadCases.ResponseSpectrum
    rs.SetCase(nm); rs.SetModalCase(nm, "MODAL")
    rs.SetLoads(nm, 1, [U], ["NEC15"], [I * g / R], ["Global"], [0.0])
    rs.SetModalComb_1(nm, 1, 0.0, 0.0, 1)            # 1 = CQC
    rs.SetDirComb(nm, 1, 0.0)                        # 1 = SRSS (una sola dirección: da igual)
    rs.SetDampConstant(nm, 0.05)
sm.File.Save(os.path.join(AQUI, "estatico", "sap_espectral.sdb"))
sm.Analyze.SetRunCaseFlag("", False, True)
for c in ("MODAL", "RSX", "RSY"): sm.Analyze.SetRunCaseFlag(c, True)
print("run", sm.Analyze.RunAnalysis(), flush=True)
out = {}
r = sm.Results.ModalPeriod(0, [], [], [], [], [], [], [])
out["T"] = list(r[4])[:12]
for c in ("RSX", "RSY"):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(c)
    b = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    d = sm.Results.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
    out[c] = {"base": [float(b[q][0]) for q in (4, 5, 6)], "nudos": {d[1][k]: [float(d[6][k]), float(d[7][k]), float(d[8][k])] for k in range(d[0])}}
    print(c, "base", out[c]["base"], flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_espectral.json"), "w"))
