# -*- coding: utf-8 -*-
"""
Lo que ETABS 22 ANADE por defecto, dicho por el propio ETABS: se arma por OAPI un modelo minimo
SIN tocar ninguna opcion (1 planta, 2 columnas, 1 viga, 1 losa) y se lee el .$et que ETABS
escribe al guardar: ahi van todos los defectos explicitos (brazos rigidos automaticos, automallado,
edge constraint / ADDRESTRAINT, merge tolerance, fuente de masa...). Y se lee el modelo de ANALISIS
(PointElm/AreaElm/LineElm) para ver cuanto mallo.
    python validation/isse/etabs_defaults_probe.py
"""
import sys, os, json, comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
import comtypes.gen.ETABSv1 as S
hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper); o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart(); sm = o.SapModel
OUT = os.path.abspath("validation/isse/etabs_defaults")
os.makedirs(OUT, exist_ok=True)
try:
    sm.InitializeNewModel(6)                       # kN, m, C
    sm.File.NewGridOnly(1, 3.0, 3.0, 2, 2, 5.0, 5.0)   # 1 planta de 3 m, 2x2 ejes a 5 m
    sm.PropMaterial.SetMaterial("HORM", 2); sm.PropMaterial.SetMPIsotropic("HORM", 25e6, 0.2, 1e-5)
    sm.PropFrame.SetRectangle("COL", "HORM", 0.5, 0.5); sm.PropFrame.SetRectangle("VIG", "HORM", 0.5, 0.3)
    sm.PropArea.SetSlab("LOSA", 0, 1, "HORM", 0.2)
    pts = {}
    def pt(x, y, z):
        k = (x, y, z)
        if k not in pts:
            r = sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "P%g_%g_%g" % (x, y, z)); pts[k] = r[0] if isinstance(r, tuple) else "P%g_%g_%g" % (x, y, z)
        return pts[k]
    # 4 columnas, 4 vigas, 1 losa, sin tocar NADA mas
    for (x, y) in ((0, 0), (5, 0), (5, 5), (0, 5)):
        sm.FrameObj.AddByCoord(x, y, 0.0, x, y, 3.0, "", "COL", "C%g%g" % (x, y))
        sm.PointObj.SetRestraint(pt(x, y, 0), [True] * 6)
    for (a, b, nm) in (((0, 0), (5, 0), "V1"), ((5, 0), (5, 5), "V2"), ((5, 5), (0, 5), "V3"), ((0, 5), (0, 0), "V4")):
        sm.FrameObj.AddByCoord(a[0], a[1], 3.0, b[0], b[1], 3.0, "", "VIG", nm)
    sm.AreaObj.AddByCoord(4, [0.0, 5.0, 5.0, 0.0], [0.0, 0.0, 5.0, 5.0], [3.0, 3.0, 3.0, 3.0], "", "LOSA", "L1")
    sm.LoadPatterns.Add("Dead", 1, 1.0, True)
    sm.AreaObj.SetLoadUniform("L1", "Dead", -5.0, 10, True, "Global")
    edb = os.path.join(OUT, "defaults.EDB"); print("save", sm.File.Save(edb))
    print("run", sm.Analyze.RunAnalysis())
    print("PointObj", sm.PointObj.Count(), "FrameObj", sm.FrameObj.Count(), "AreaObj", sm.AreaObj.Count())
    print("PointElm", sm.PointElm.Count(), "LineElm", sm.LineElm.Count(), "AreaElm", sm.AreaElm.Count())
    # brazos rigidos automaticos: lo que ETABS asigno a cada viga y columna
    for f in sm.FrameObj.GetNameList(0, [])[1]:
        r = sm.FrameObj.GetEndLengthOffset(f, False, 0.0, 0.0, 0.0)
        print("  offset", f, "auto=%s offI=%.4f offJ=%.4f RZ=%.2f" % (r[0], r[1], r[2], r[3]))
    # edge constraint / automesh de la losa, tal como quedaron
    try: print("  edge constraint L1:", sm.AreaObj.GetEdgeConstraint("L1", False))
    except Exception as ex: print("  GetEdgeConstraint:", ex)
    sm.File.Save(edb)
    et = os.path.join(OUT, "defaults.$et")
    if os.path.exists(et):
        txt = open(et, encoding="utf-8", errors="ignore").read()
        import re
        for sec in ("CONTROLS", "POINT ASSIGNS", "LINE ASSIGNS", "AREA ASSIGNS", "ANALYSIS OPTIONS", "MASS SOURCE", "DIAPHRAGM NAMES"):
            m = re.search(r"\$ " + re.escape(sec) + r"\n(.*?)\n\n", txt, re.S)
            print("$", sec); print(m.group(1)[:1200] if m else "  (no)")
finally:
    try: o.ApplicationExit(False)
    except Exception: pass
