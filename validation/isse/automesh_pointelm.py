# Modelo de ANALISIS del EDB de edge_none (OBJMESHTYPE NONE): cuantos nudos y areas creo ETABS.
import sys, json, os, comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
import comtypes.gen.ETABSv1 as S
hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart(); sm = o.SapModel
try:
    edb = os.path.abspath("validation/isse/automesh/etabs/edb/pano_grande.EDB")
    print("open", sm.File.OpenFile(edb)); sm.SetPresentUnits(6)
    print("run", sm.Analyze.RunAnalysis())
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Dead")
    nel = sm.PointElm.GetNameList(0, []); print("PointElm:", nel[0], "AreaElm:", sm.AreaElm.Count(), "PointObj:", sm.PointObj.Count())
    out = {}
    for nm in nel[1]:
        c = sm.PointElm.GetCoordCartesian(nm, 0.0, 0.0, 0.0)
        r = sm.Results.JointDispl(nm, 1, 0, [], [], [], [], [], [], [], [], [], [], [])
        u = [float(r[q][0]) for q in (6, 7, 8, 9, 10, 11)] if r[0] else None
        out[nm] = {"x": round(c[0], 4), "y": round(c[1], 4), "z": round(c[2], 4), "u": u}
        print("  %-6s (%g, %g, %g)" % (nm, c[0], c[1], c[2]), ["%.4e" % v for v in u] if u else "-")
    for a in sm.AreaElm.GetNameList(0, [])[1]:
        p = sm.AreaElm.GetPoints(a, 0, [])
        print("  area", a, list(p[1]))
    json.dump(out, open("validation/isse/automesh/pointelm.json", "w"), indent=1)
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
