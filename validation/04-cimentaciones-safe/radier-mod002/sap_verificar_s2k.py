"""Abre en SAP2000 24 el .s2k que EXPORTA Hekatan (radier corregido) y comprueba que entra todo y que da lo
mismo que Hekatan: patrones, combinaciones, muelles de area de solo compresion, modificadores, y los numeros
clave (q max, Uz max, reaccion) en SERVICIO y DISENO.

  python sap_verificar_s2k.py informe/radier_mod002_corregido.s2k res/sap_corregido.json

Arranca SU PROPIA instancia (ApplicationStart); no se engancha a una abierta. SAP2000 tarda ~95 s en el
splash (4.6 GB): no es un cuelgue.
"""
import json, os, sys, time
import comtypes.client
S2K, OUT = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2])
import comtypes.gen.SAP2000v1 as S
t0 = time.time()
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject")
o.ApplicationStart()
sm = o.SapModel
print("SAP arrancado %.0f s" % (time.time() - t0), flush=True)
ret = sm.File.OpenFile(S2K)
print("OpenFile ->", ret, flush=True)
sm.SetPresentUnits(6)          # kN, m
res = {"archivo": S2K, "open": ret}
nm = lambda r: [str(x) for x in r[1]] if r and r[0] else []
res["puntos"] = sm.PointObj.Count(); res["areas"] = sm.AreaObj.Count(); res["barras"] = sm.FrameObj.Count()
res["patrones"] = nm(sm.LoadPatterns.GetNameList(0, []))
res["combos"] = nm(sm.RespCombo.GetNameList(0, []))
res["combo_casos"] = {}
for c in res["combos"]:
    r = sm.RespCombo.GetCaseList(c, 0, [], [], [])
    res["combo_casos"][c] = list(zip([str(x) for x in r[2]], [float(x) for x in r[3]])) if r[0] else []
res["selfwt"] = {p: float(sm.LoadPatterns.GetSelfWTMultiplier(p, 0)[0]) for p in res["patrones"]}
areas = nm(sm.AreaObj.GetNameList(0, []))
nspr = 0; tipos = {}; kvals = set()
for a in areas:
    r = sm.AreaObj.GetSpring(a, 0, [], [], [], [], [], [], [], [], [], [], [])
    if r[0]:
        nspr += 1; tipos[int(r[3][0])] = tipos.get(int(r[3][0]), 0) + 1; kvals.add(round(float(r[2][0]), 6))
res["areas_con_muelle"] = nspr; res["simpleSpringType"] = tipos; res["ks"] = sorted(kvals)
nmod = 0
for a in areas:
    r = sm.AreaObj.GetModifiers(a, [])
    if r and any(abs(float(v) - 1) > 1e-9 for v in r[0][:8]): nmod += 1
res["areas_con_modificadores"] = nmod
sm.File.Save(os.path.splitext(OUT)[0] + ".sdb")
print("run ->", sm.Analyze.RunAnalysis(), "%.0f s" % (time.time() - t0), flush=True)
pts = nm(sm.PointObj.GetNameList(0, []))
res["casos"] = {}
for c in ("Dead", "DNE", "Live", "SERVICIO", "DISENO"):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    if c in res["combos"]: sm.Results.Setup.SetComboSelectedForOutput(c)
    else: sm.Results.Setup.SetCaseSelectedForOutput(c)
    U = {}
    for p in pts:
        r = sm.Results.JointDispl(p, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
        if r[0]: U[p] = [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)]
    r = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    res["casos"][c] = {"U": U, "FZ": float(r[6][0]) if r[0] else None}
    print(c, "nudos", len(U), "FZ", res["casos"][c]["FZ"], flush=True)
json.dump(res, open(OUT, "w"))
o.ApplicationExit(False)
print("listo %.0f s" % (time.time() - t0))
