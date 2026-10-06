"""ETABS 22: Steady State y PSD del pórtico 3D de validation/estacionario (el mismo de SAP2000), por TABLAS (la OAPI de
ETABS no tiene LoadCases.SteadyState/PSD ni Func.FuncSS/FuncPSD). -> etabs_estacionario.json
Fuente de masa: la de los ELEMENTOS, también vertical y SIN agrupar en pisos (como SAP2000).
    python validation/casos-csi/etabs_estacionario.py"""
import json, os, sys, subprocess, atexit
import comtypes.client
import comtypes.gen.ETABSv1 as EV
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
sys.path.insert(0, os.path.join(RAIZ, "validation", "pandeo"))
from modelos import portico, E, NU
M = portico(4); TOP = M["nodes"].index([0, 0, 3]); M["cargas"] = {TOP: [20.0, 2.0, 0.0, 0, 0, 0]}
GAMMA = 23.5


def pids():
    s = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ETABS.exe", "/FO", "CSV", "/NH"], capture_output=True, text=True).stdout
    return {int(p.split('","')[1]) for p in s.splitlines() if '","' in p}


antes = pids(); atexit.register(lambda: [os.system("taskkill /PID %d /F >nul 2>&1" % p) for p in pids() - antes])
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(EV.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart(); sm = o.SapModel
sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 3.0, 3.0, 2, 2, 10.0, 10.0)
out = {"top": TOP}


def campos(t):
    r = sm.DatabaseTables.GetAllFieldsInTable(t, 0, 0, [], [], [], [], []); return list(r[2])


def tabla(clave, cs, filas):
    datos = [str(x) for f in filas for x in f]
    r = sm.DatabaseTables.SetTableForEditingArray(clave, 0, cs, len(filas), datos)
    a = sm.DatabaseTables.ApplyEditedTables(True, 0, 0, 0, 0, "")
    log = " ".join(x for x in a if isinstance(x, str))
    ok = a[-1] == 0 and "Number of errors:  0" in log
    if not ok: print("TABLA", clave, r[-1], log[log.find("Error Message"):][:900] if "Error Message" in log else log[-900:], flush=True)
    return ok


def leer(clave):
    r = sm.DatabaseTables.GetTableForDisplayArray(clave, [], "", 0, [], 0, [])
    cs = list(r[2]); n = r[3]; d = list(r[4]); w = len(cs)
    return cs, [d[i * w:(i + 1) * w] for i in range(n)]


sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, GAMMA)
props = {}
for f in M["frames"]:
    k = "R%gx%g" % (f[2], f[3])
    if k not in props:
        sm.PropFrame.SetRectangle(k, "C", f[3], f[2]); r = sm.PropFrame.GetSectProps(k); props[k] = dict(A=r[0], As2=r[1], As3=r[2], J=r[3], I22=r[4], I33=r[5])
pn = [sm.PointObj.AddCartesian(float(p[0]), float(p[1]), float(p[2]), "", "")[0] for p in M["nodes"]]
for e, f in enumerate(M["frames"]):
    nm = sm.FrameObj.AddByPoint(pn[f[0]], pn[f[1]], "", "R%gx%g" % (f[2], f[3]), "")[0]
    sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
    if f[4]: sm.FrameObj.SetLocalAxes(nm, f[4])
for q, s in M["apoyos"].items(): sm.PointObj.SetRestraint(pn[int(q)], [bool(x) for x in s])
sm.LoadPatterns.Add("P", 8, 0, True)
for q, c in M["cargas"].items(): sm.PointObj.SetLoadForce(pn[int(q)], "P", [float(x) for x in c], True)
out["props"] = props
# fuente de masa: elementos, vertical incluida, sin agrupar en pisos
cm = campos("Mass Source Definition"); out["campos_masa"] = cm; print("masa", cm, flush=True)
fila = {"Name": "MsSrc1", "IsDefault": "Yes", "IncLateral": "Yes", "IncVertical": "Yes", "LumpMass": "No", "SourceSelf": "Yes",
        "SourceAdded": "Yes", "SourceLoads": "No", "MoveMass": "No"}
tabla("Mass Source Definition", [c for c in cm if c in fila], [[fila[c] for c in cm if c in fila]])
# función constante 1 y caso
tabla("Functions - Steady State - User Defined", ["Name", "Frequency", "Value"], [["UNO", 0, 1], ["UNO", 100, 1]])
cd = campos("Load Case Definitions - Damping - Hysteretic"); out["campos_amort"] = cd
cs = campos("Load Case Definitions - Steady State"); out["campos_ss"] = cs
base = {"MassSource": "MsSrc1", "Function": "UNO", "LoadSF": 1, "PhaseAngle": 0, "GridSys": "Global", "Angle": 0,
        "FirstFreq": 0.5, "LastFreq": 20, "NumFreqInc": 39, "AddMFreq": "No", "AddMDev": "No", "AddSpFreq": "No"}
filas = []
for nom, lt, ln in [("SS", "Load Pattern", "P"), ("SSA", "Acceleration", "U1")]:
    d = dict(base, Name=nom, LoadType=lt, LoadName=ln); filas.append([d.get(c, "") for c in cs if c in d or c == "Name"])
ok = tabla("Load Case Definitions - Steady State", [c for c in cs if c in base or c in ("Name", "LoadType", "LoadName")], filas)
print("ss", ok, flush=True)
# PSD: la función de validation/psd/sap_psd.py
tabla("Functions - Power Spectral Density - User Defined", ["Name", "Frequency", "Value"], [["PSD1", 0, 1], ["PSD1", 5, 2], ["PSD1", 10, 0.5], ["PSD1", 100, 0.5]])
cp = campos("Load Case Definitions - Power Spectral Density")
d = dict(base, Name="PSD", LoadType="Load Pattern", LoadName="P", Function="PSD1")
print("psd", tabla("Load Case Definitions - Power Spectral Density", [c for c in cp if c in d], [[d[c] for c in cp if c in d]]), flush=True)
# amortiguamiento histerético: lo que ETABS tenga por defecto se lee y se reescribe con dK = 0.04
try:
    r = sm.DatabaseTables.GetTableForDisplayArray("Load Case Definitions - Damping - Hysteretic", [], "", 0, [], 0, [])
    print("amort por defecto", list(r[2]), list(r[4]), flush=True); out["amort_defecto"] = dict(campos=list(r[2]), datos=list(r[4]))
except Exception as ex: print("amort no", ex, flush=True)
for nom in ("SS", "SSA", "PSD"):
    for cols, fil in [(["Name", "DampType", "MassCoeff", "StiffCoeff"], [nom, "Constant", 0, 0.04]),
                      (["Name", "DampType", "FreqUnit", "Frequency", "MassCoeff", "StiffCoeff"], [nom, "Constant", "Hz", 0, 0, 0.04])]:
        if tabla("Load Case Definitions - Damping - Hysteretic", cols, [fil]): break
sm.File.Save(os.path.join(AQUI, "etabs", "estacionario.EDB"))
for c in sm.LoadCases.GetNameList()[1]: sm.Analyze.SetRunCaseFlag(c, c in ("SS", "SSA", "PSD", "P"))
print("run", sm.Analyze.RunAnalysis(), flush=True)
# salida: lo que dé ETABS (OAPI sin SetOptionSteadyState) y la tabla de desplazamientos
R = sm.Results
for nom in ("SS", "SSA"):
    R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetCaseSelectedForOutput(nom)
    d = R.JointDispl(pn[TOP], 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    out[nom] = dict(n=d[0], steptype=list(d[4]), stepnum=list(d[5]), u=[[d[k][i] for k in range(6, 12)] for i in range(d[0])])
    print(nom, d[0], list(d[4])[:6], flush=True)
for caso in ("SS", "SSA", "PSD"):
    try:
        sm.DatabaseTables.SetLoadCasesSelectedForDisplay([caso])
        c, f = leer("Joint Displacements"); out["tabla_" + caso] = dict(campos=c, filas=[x for x in f if x[c.index("UniqueName")] == pn[TOP]][:200])
        print("tabla", caso, out["tabla_" + caso]["filas"], flush=True)
    except Exception as ex:
        print("tabla no", caso, ex, flush=True)
json.dump(out, open(os.path.join(AQUI, "etabs_estacionario.json"), "w"), indent=1)
o.ApplicationExit(False)
