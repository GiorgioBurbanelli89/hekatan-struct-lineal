# -*- coding: utf-8 -*-
"""Brazos rigidos automaticos de ETABS: ¿descuentan el tramo de viga dentro de la columna del PESO PROPIO
(reaccion Dead) ademas de la MASA (AssembledJointMass)? Mismo modelo minimo, dos corridas: auto y 0.
    python validation/isse/etabs_offsets_peso_probe.py"""
import sys, os, json, comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
import comtypes.gen.ETABSv1 as S
hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart(); sm = o.SapModel
OUT = os.path.abspath("validation/isse/etabs_defaults"); os.makedirs(OUT, exist_ok=True)
res = {}
def modelo(anular):
    try: sm.SetModelIsLocked(False)
    except Exception: pass
    sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 3.0, 3.0, 2, 2, 5.0, 5.0)
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", 25e6, 0.2, 1e-5); sm.PropMaterial.SetWeightAndMass("HORM", 1, 24.0)
    sm.PropFrame.SetRectangle("COL", "HORM", 0.5, 0.5); sm.PropFrame.SetRectangle("VIG", "HORM", 0.5, 0.3)
    for (x, y) in ((0, 0), (5, 0), (5, 5), (0, 5)):
        sm.FrameObj.AddByCoord(x, y, 0.0, x, y, 3.0, "", "COL", "C%g%g" % (x, y))
        nm = sm.PointObj.AddCartesian(float(x), float(y), 0.0, "", "B%g%g" % (x, y)); sm.PointObj.SetRestraint("B%g%g" % (x, y), [True] * 6)
    for (a, b, nm) in (((0, 0), (5, 0), "V1"), ((5, 0), (5, 5), "V2"), ((5, 5), (0, 5), "V3"), ((0, 5), (0, 0), "V4")):
        sm.FrameObj.AddByCoord(a[0], a[1], 3.0, b[0], b[1], 3.0, "", "VIG", nm)
    if anular:
        for f in sm.FrameObj.GetNameList(0, [])[1]: sm.FrameObj.SetEndLengthOffset(f, False, 0.0, 0.0, 0.0)
    sm.LoadPatterns.Add("Dead", 1, 1.0, True)
    edb = os.path.join(OUT, "offsets_%s.EDB" % ("cero" if anular else "auto")); sm.File.Save(edb)
    rr = sm.Analyze.RunAnalysis()
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Dead")
    r = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
    fz = float(r[6][0]) if r[0] else None
    # masa total
    mt = 0.0
    try:
        t = sm.Results.AssembledJointMass_1("", 2, 0, [], [], [], [], [], [], [], [], [])
        for k in range(t[0]): mt += float(t[5][k])   # Ux
    except Exception as ex: mt = None
    offs = {f: sm.FrameObj.GetEndLengthOffset(f, False, 0.0, 0.0, 0.0)[1:3] for f in sm.FrameObj.GetNameList(0, [])[1]}
    return {"run": rr, "sumFz": fz, "masaUx": mt, "offsets": offs}
try:
    res["auto"] = modelo(False); res["cero"] = modelo(True)
    # teorico: 4 columnas 0.5x0.5x3 + 4 vigas 0.5x0.3x5 (o 4.5 si se descuenta 2x0.25) a 24 kN/m3
    Wc = 4 * 0.25 * 3 * 24; Wv5 = 4 * 0.15 * 5 * 24; Wv45 = 4 * 0.15 * 4.5 * 24
    print("Dead sumFz: auto %.4f  cero %.4f   (teorico L completa %.4f, vigas menos brazos %.4f, columnas menos canto %.4f)" % (
        res["auto"]["sumFz"], res["cero"]["sumFz"], Wc + Wv5, Wc + Wv45, 4 * 0.25 * 2.5 * 24 + Wv5))
    print("masa Ux total: auto %s  cero %s" % (res["auto"]["masaUx"], res["cero"]["masaUx"]))
    print("offsets auto:", res["auto"]["offsets"])
    json.dump(res, open(os.path.join(OUT, "offsets_peso.json"), "w"), indent=1)
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
