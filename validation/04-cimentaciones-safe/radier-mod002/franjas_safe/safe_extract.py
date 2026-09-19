# -*- coding: utf-8 -*-
"""Extrae de SAFE 20.3 (OAPI) todo lo necesario para RE del diseno por franjas:
malla (nudos, elementos, propiedad, ejes locales), fuerzas de cascara por nudo de
elemento, tablas de franjas y diseno por estacion. Trabaja sobre una COPIA del FDB.
Uso: set CSI_NUEVA=1 && python safe_extract.py <carpeta_copia> <nombre.FDB> <outdir>
"""
import os, sys, json, time, csv
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\safe-cli\cli")
import csi_cli

src_dir, fdb, out = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out, exist_ok=True)
t0 = time.time()
obj, SM, started = csi_cli.start_engine("safe", 8, False)
assert started, "no es instancia nueva"
try:
    ret = SM.File.OpenFile(os.path.join(src_dir, fdb))
    print("OpenFile", ret)
    SM.SetPresentUnits(8)  # kgf, m, C
    print("units", SM.GetPresentUnits())
    locked = SM.GetModelIsLocked()
    print("locked(=results?)", locked)
    if not locked:
        print("RunAnalysis", SM.Analyze.RunAnalysis())
    print("StartSlabDesign", SM.DesignConcreteSlab.StartSlabDesign())
    try:
        print("code", SM.DesignConcreteSlab.GetCode() if hasattr(SM.DesignConcreteSlab, 'GetCode') else '?')
    except Exception as e:
        print("code?", e)

    # --- tablas ---
    DT = SM.DatabaseTables
    r = DT.GetAvailableTables()
    names = list(r[2]); keys = list(r[1])
    with open(os.path.join(out, "tablas_disponibles.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(keys))
    want = [k for k in keys if any(s in k for s in ("Strip", "Slab Design", "Shell", "Element", "Objects and Elements", "Design Preferences", "Joint"))]
    for k in want:
        fn = os.path.join(out, "T_" + "".join(c if c.isalnum() else "_" for c in k)[:90] + ".csv")
        try:
            rr = DT.GetTableForDisplayCSVFile(k, [], "All", 0, fn, ";")
            print("tabla", k, rr[-1] if isinstance(rr, (list, tuple)) else rr)
        except Exception as e:
            print("tabla FALLO", k, e)

    # --- malla ---
    ne, elms = SM.AreaElm.GetNameList()[:2]
    E = {}
    for e in elms:
        n, pts = SM.AreaElm.GetPoints(e)[:2]
        ob = SM.AreaElm.GetObj(e)[0]
        pr = SM.AreaElm.GetProperty(e)[0]
        ang = SM.AreaElm.GetLocalAxes(e)[0]
        E[e] = dict(pts=list(pts), obj=ob, prop=pr, ang=ang)
    npn, pnames = SM.PointElm.GetNameList()[:2]
    P = {}
    for p in pnames:
        x, y, z = SM.PointElm.GetCoordCartesian(p)[:3]
        P[p] = [x, y, z]
    json.dump(dict(elements=E, points=P), open(os.path.join(out, "malla.json"), "w"))
    print("malla", len(E), "elem", len(P), "nudos")

    # --- fuerzas de cascara ---
    R = SM.Results
    R.Setup.DeselectAllCasesAndCombosForOutput()
    for c in ["Dead", "Live", "DNE"]:
        R.Setup.SetCaseSelectedForOutput(c)
    R.Setup.SetComboSelectedForOutput("DISE\u00d1O")
    rr = R.AreaForceShell("All", 2)
    N = rr[0]
    cols = ["Obj", "Elm", "PointElm", "LoadCase", "StepType", "StepNum", "F11", "F22", "F12", "FMax", "FMin", "FAngle", "FVM",
            "M11", "M22", "M12", "MMax", "MMin", "MAngle", "V13", "V23", "VMax", "VAngle"]
    with open(os.path.join(out, "shell_forces.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(cols)
        for i in range(N):
            w.writerow([rr[1 + j][i] if j < 6 else repr(float(rr[1 + j][i])) for j in range(len(cols))])
    print("shell forces", N)

    # --- diseno por estacion ---
    rr = SM.DesignConcreteSlab.GetFlexureAndShear()
    cols = ["StoryName", "Strip", "Station", "ConcWidth", "FTopCombo", "FTopMoment", "FTopArea", "FTopAMin", "FBotCombo",
            "FBotMoment", "FBotArea", "FBotAMin", "AxialForce", "VCombo", "VForce", "VArea", "Status", "GlobalX", "GlobalY", "Layer"]
    n = len(rr[0])
    with open(os.path.join(out, "design_stations.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(cols)
        for i in range(n):
            w.writerow([(repr(float(rr[j][i])) if isinstance(rr[j][i], float) else rr[j][i]) for j in range(len(cols))])
    print("design stations", n, "ret", rr[-1])
finally:
    try:
        obj.ApplicationExit(False)
    except Exception as e:
        print("exit", e)
print("t", time.time() - t0)
