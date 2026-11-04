"""Galpon SENCILLO: python simple.py NOMBRE [--ang 0|90] [--card8] [--shell]
Parte de galpon1.EDB (secciones/materiales del mercado), borra todo y crea: 3 columnas por lado (x=0,6,12; y=0 y 6),
VP continua en y=0 y y=6 (tramos de 1 m), 13 correas 1G articuladas a lo largo de Y cada 1 m, cubierta membrana (12 panos de 1x6 m)
con pendiente 3 % en y. Patrones Dead, Live, LATX, LATY. Escribe simple_NOMBRE.EDB/.e2k y ref_simple_NOMBRE.json"""
import sys, os, json, time, argparse
import comtypes, comtypes.client as cc
AQUI = r"C:\ETABS\mercado\galpon"
ap = argparse.ArgumentParser(); ap.add_argument("NOM"); ap.add_argument("--ang", type=float, default=0.0)
ap.add_argument("--card8", action="store_true"); ap.add_argument("--slope", type=float, default=0.03); ap.add_argument("--m0", action="store_true"); ap.add_argument("--corte", action="store_true"); ap.add_argument("--shell", action="store_true")
a = ap.parse_args(); N = a.NOM
h = cc.CreateObject("ETABSv1.Helper").QueryInterface(comtypes.gen.ETABSv1.cHelper)
sm = h.GetObject("CSI.ETABS.API.ETABSObject").SapModel
t0 = time.time()
def log(*x): print(f"[{time.time()-t0:6.1f}s]", *x, flush=True)
sm.File.OpenFile(os.path.join(AQUI, "galpon1.EDB")); sm.SetModelIsLocked(False); sm.SetPresentUnits(6)
out = os.path.join(AQUI, f"simple_{N}.EDB"); sm.File.Save(out)
sm.SelectObj.ClearSelection(); sm.SelectObj.All(False)
log("FrameObj.Delete", sm.FrameObj.Delete("", 2), "AreaObj.Delete", sm.AreaObj.Delete("", 2))
for p in list(sm.PointObj.GetNameList()[1]):
    try: sm.PointObj.DeleteSpecialPoint(p, 0)
    except Exception: pass
log("restan", sm.PointObj.Count(), sm.FrameObj.Count(), sm.AreaObj.Count())
SL = a.slope; Z0 = 6.0
zf = lambda y: Z0 + SL * y
SEC_C, SEC_V, SEC_P, PROP = "CC 1 200x6", "VP I530X15+I150X6", "1G 160x60x15x3IZQ", "Cubierta metalica"
frames = {}
def add(x1, y1, z1, x2, y2, z2, sec, nm):
    r = sm.FrameObj.AddByCoord(x1, y1, z1, x2, y2, z2, "", sec, nm); frames[r[0]] = sec; return r[0]
cols = []
for x in (0, 6, 12):
    for y in (0, 6):
        if a.corte and y == 6: continue
        k = add(x, y, 0, x, y, zf(y), SEC_C, f"C{x}_{y}"); cols.append(k)
for y in (0, 6):
    for x in range(12): add(x, y, zf(y), x + 1, y, zf(y), SEC_V, f"V{x}_{y}")
pur = []
for x in range(13):
    k = add(x, 0, zf(0), x, 6, zf(6), SEC_P, f"P{x}"); pur.append(k)
    sm.FrameObj.SetReleases(k, [False, False, False, True, True, True], [False, False, False, False, True, True], [0.0]*6, [0.0]*6)
if a.card8:
    for k in frames:
        if frames[k] != SEC_C:
            try: sm.FrameObj.SetInsertionPoint_1(k, 8, False, False, True, [0.0]*3, [0.0]*3)
            except Exception as e:
                log("SetInsertionPoint_1 fallo", repr(e)[:80]); sm.FrameObj.SetInsertionPoint(k, 8, False, False, [0.0]*3, [0.0]*3)
areas = []
for x in range(12):
    r = sm.AreaObj.AddByCoord(4, [x, x + 1, x + 1, x], [0, 0, 6, 6], [zf(0), zf(0), zf(6), zf(6)], "", PROP, f"A{x}")
    nm = r[3] if isinstance(r[3], str) else f"A{x}"; areas.append(nm)
    if a.ang: sm.AreaObj.SetLocalAxes(nm, a.ang)
    if a.m0: sm.AreaObj.SetModifiers(nm, [1e-4,1e-4,1e-4,1,1,1,1,1,1,1])
log("creados", len(frames), "barras", len(areas), "areas")
# cargas
for nm in areas:
    sm.AreaObj.SetLoadUniform(nm, "Dead", 0.392266, 10, True, "Global")
    sm.AreaObj.SetLoadUniform(nm, "Live", 0.68646553, 10, True, "Global")
for lp in ("LATX", "LATY"):
    try: sm.LoadPatterns.Add(lp, 8, 0, True)
    except Exception as e: log("patron", lp, e)
# apoyos y cargas puntuales laterales (13 nudos de la linea y = 6)
for k in cols:
    p1, p2 = sm.FrameObj.GetPoints(k)[0:2]
    c1 = sm.PointObj.GetCoordCartesian(p1)
    if c1[2] < 1e-6: sm.PointObj.SetRestraint(p1, [True]*6)
    else: sm.PointObj.SetRestraint(p2, [True]*6)
for k in pur:
    p1, p2 = sm.FrameObj.GetPoints(k)[0:2]
    for p in (p1, p2):
        c = sm.PointObj.GetCoordCartesian(p)
        if abs(c[1] - (0 if a.corte else 6)) < 1e-6:
            sm.PointObj.SetLoadForce(p, "LATX", [1.0, 0, 0, 0, 0, 0], True)
            sm.PointObj.SetLoadForce(p, "LATY", [0, 1.0, 0, 0, 0, 0], True)
if a.corte:
    for k in pur:
        p1, p2 = sm.FrameObj.GetPoints(k)[0:2]
        for p in (p1, p2):
            if abs(sm.PointObj.GetCoordCartesian(p)[1] - 6) < 1e-6: sm.PointObj.SetRestraint(p, [True]*6)
sm.View.RefreshView(0, False); sm.File.Save(out)
sm.Analyze.SetRunCaseFlag("", False, True)
CAS = ("Dead", "Live", "LATX", "LATY")
for c in CAS: sm.Analyze.SetRunCaseFlag(c, True, False)
log("RunAnalysis", sm.Analyze.RunAnalysis())
ref = {"nombre": N, "ang": a.ang, "unidades": "kN-m", "pts": {}, "JointDispl": {}, "JointReact": {}, "BaseReact": {}, "barras": {}}
for p in sm.PointObj.GetNameList()[1]:
    c = sm.PointObj.GetCoordCartesian(p); ref["pts"][p] = [c[0], c[1], c[2]]
for c in CAS:
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(c)
    j = sm.Results.JointDispl("ALL", 2); n = j[0]
    ref["JointDispl"][c] = {j[1][i]: [j[6][i], j[7][i], j[8][i], j[9][i], j[10][i], j[11][i]] for i in range(n)}
    b = sm.Results.BaseReact(); ref["BaseReact"][c] = dict(zip(("Fx", "Fy", "Fz", "Mx", "My", "Mz"), [b[4][0], b[5][0], b[6][0], b[7][0], b[8][0], b[9][0]]))
    jr = sm.Results.JointReact("ALL", 2); m = jr[0]
    ref["JointReact"][c] = {jr[1][i]: [jr[6][i], jr[7][i], jr[8][i], jr[9][i], jr[10][i], jr[11][i]] for i in range(m)}
    log(c, n, "nudos", m, "reacciones", ref["BaseReact"][c])
for k, sec in frames.items():
    p1, p2 = sm.FrameObj.GetPoints(k)[0:2]
    d = {"sec": sec, "p1": ref["pts"][p1], "p2": ref["pts"][p2]}
    for c in CAS:
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(c)
        q = sm.Results.FrameForce(k, 0); m = q[0]
        if m: d[c] = {"loc": list(q[4]), "P": list(q[8]), "V2": list(q[9]), "V3": list(q[10]), "T": list(q[11]), "M2": list(q[12]), "M3": list(q[13])}
    ref["barras"][k] = d
sm.File.ExportFile(os.path.join(AQUI, f"simple_{N}.e2k"), 1); log("e2k exportado")
json.dump(ref, open(os.path.join(AQUI, f"ref_simple_{N}.json"), "w"))
sm.File.Save(out); log("listo")
