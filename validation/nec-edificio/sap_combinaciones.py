# -*- coding: utf-8 -*-
"""SAP2000 (juez) de las COMBINACIONES del espectral (1-oct-2026): mismo modelo y espectro que sap_espectral.py.
  modal (SetModalComb_1): 1 CQC · 2 SRSS · 3 ABS — casos RSX_<m>, RSY_<m> (una dirección)
  direccional (SetDirComb): 1 SRSS · 2 ABS · 3 CQC3 — casos RSXY_<d> con U1 Y U2 a la vez, modal CQC
Vuelca cortante basal y desplazamientos de todos los nudos → sap_combinaciones.json
    python validation/nec-edificio/sap_combinaciones.py
"""
import json, os, sys, comtypes.client
AQUI = os.path.dirname(os.path.abspath(__file__))
SP = json.load(open(os.path.join(AQUI, "espectro_nec15.json")))
h = comtypes.client.CreateObject("SAP2000v1.Helper")
import comtypes.gen.SAP2000v1 as S
h = h.QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
sm = o.SapModel
print("abrir", sm.File.OpenFile(os.path.join(AQUI, "estatico", "sap_estatico.sdb")), flush=True)
sm.SetModelIsLocked(False); sm.SetPresentUnits(6)
print("func", sm.Func.FuncRS.SetUser("NEC15", len(SP["T"]), SP["T"], SP["Sa"], 0.05), flush=True)
sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)
g = 9.80665; I, R = 1.0, 8.0; f = I * g / R
rs = sm.LoadCases.ResponseSpectrum
casos = []
for mod, nm in ((1, "CQC"), (2, "SRSS"), (3, "ABS")):
    for d, U in (("X", "U1"), ("Y", "U2")):
        c = "RS%s_%s" % (d, nm); casos.append(c)
        rs.SetCase(c); rs.SetModalCase(c, "MODAL"); rs.SetLoads(c, 1, [U], ["NEC15"], [f], ["Global"], [0.0])
        print(c, "modalcomb", rs.SetModalComb_1(c, mod, 1.0, 0.0, 1), rs.GetModalComb_1(c), flush=True); rs.SetDirComb(c, 1, 0.0); rs.SetDampConstant(c, 0.05)
for dc, nm, sf in ((1, "SRSS", 0.0), (2, "ABS", 1.0), (2, "ABS30", 0.3), (3, "CQC3", 0.0)):
    c = "RSXY_%s" % nm; casos.append(c)
    rs.SetCase(c); rs.SetModalCase(c, "MODAL"); rs.SetLoads(c, 2, ["U1", "U2"], ["NEC15", "NEC15"], [f, f], ["Global", "Global"], [0.0, 0.0])
    rs.SetModalComb_1(c, 1, 0.0, 0.0, 1); print(c, "dircomb", rs.SetDirComb(c, dc, sf), rs.GetDirComb(c), flush=True); rs.SetDampConstant(c, 0.05)
# COMPONENTE VERTICAL (1-oct-2026): U3 con el espectro × 2/3 (NEC-11 §2.7.7.3, NEC-15 §3.4.2, borrador ec. 3.8)
c = "RSZ"; casos.append(c)
rs.SetCase(c); rs.SetModalCase(c, "MODAL"); rs.SetLoads(c, 1, ["U3"], ["NEC15"], [f * 2 / 3], ["Global"], [0.0])
rs.SetModalComb_1(c, 1, 1.0, 0.0, 1); rs.SetDirComb(c, 1, 0.0); rs.SetDampConstant(c, 0.05)
for dc, nm, sf in ((1, "SRSS", 0.0), (2, "ABS", 1.0), (2, "ABS30", 0.3)):
    c = "RSXYZ_%s" % nm; casos.append(c)
    rs.SetCase(c); rs.SetModalCase(c, "MODAL"); rs.SetLoads(c, 3, ["U1", "U2", "U3"], ["NEC15"] * 3, [f, f, f * 2 / 3], ["Global"] * 3, [0.0] * 3)
    rs.SetModalComb_1(c, 1, 1.0, 0.0, 1); print(c, "dircomb", rs.SetDirComb(c, dc, sf), flush=True); rs.SetDampConstant(c, 0.05)
sm.File.Save(os.path.join(AQUI, "estatico", "sap_combinaciones.sdb"))
sm.Analyze.SetRunCaseFlag("", False, True)
for c in ["MODAL"] + casos: sm.Analyze.SetRunCaseFlag(c, True)
print("run", sm.Analyze.RunAnalysis(), flush=True)
out = {}
for c in casos:
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(c)
    b = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    d = sm.Results.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
    out[c] = {"base": [float(b[q][0]) for q in (4, 5, 6)], "nudos": {d[1][k]: [float(d[6][k]), float(d[7][k]), float(d[8][k])] for k in range(d[0])}}
    print(c, "base", out[c]["base"], flush=True)
json.dump(out, open(os.path.join(AQUI, "sap_combinaciones.json"), "w"))
o.ApplicationExit(False)
