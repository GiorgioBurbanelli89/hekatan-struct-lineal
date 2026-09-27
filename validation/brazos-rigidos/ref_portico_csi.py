# -*- coding: utf-8 -*-
"""REFERENCIA de CSI para los brazos rigidos (end length offsets) en un PORTICO.

    python ref_portico_csi.py etabs      -> tests/datos/brazos_portico_etabs.json
    python ref_portico_csi.py sap        -> tests/datos/brazos_portico_sap2000.json

El voladizo de `ref_end_offsets_etabs.py` mide la ley en UNA barra. Aqui se mide en una
estructura: portico de un vano (6 m) y un piso (3 m), en el espacio, con los brazos donde los
pone un programa de CSI (la viga, medio canto de columna en cada extremo; la columna, medio
canto de viga arriba) y el factor de zona rigida RZ = 0, 0.5 y 1.

    LAT   50 kN horizontal en el nudo 3                       (nodal)
    VERT  -100 kN en los nudos 3 y 4 y un momento de 20 kN.m  (nodal)
    FUERA 30 kN fuera del plano en el nudo 4                  (nodal: flexion debil y torsion)
    W     10 kN/m de gravedad sobre la viga                   (carga de VANO)
    modal masas nodales de 10 t en los nudos 3 y 4, material sin masa

Material sin peso ni masa: asi el modal depende SOLO de la rigidez, que es lo que se mide.
Unidades kN, m. Nudos: 1 (0,0,0)  2 (6,0,0)  3 (0,0,3)  4 (6,0,3).
"""
import os, sys, json, functools, atexit, subprocess
print = functools.partial(print, flush=True)
AQUI = os.path.dirname(os.path.abspath(__file__))
for cand in (os.path.join(AQUI, "..", "..", "..", "galpon-bodega-electoral"),
             r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"):
    if os.path.isdir(cand):
        sys.path.insert(0, os.path.abspath(cand)); break
import comtypes.client
from etabs_api import llamar

PROG = (sys.argv[1] if len(sys.argv) > 1 else "etabs").lower()
EXE = "ETABS.exe" if PROG == "etabs" else "SAP2000.exe"
SALIDA = os.path.abspath(os.path.join(AQUI, "..", "..", "tests", "datos",
                                      "brazos_portico_%s.json" % ("etabs" if PROG == "etabs" else "sap2000")))

LX, H = 6.0, 3.0
EMOD, NU = 2.0e7, 0.2
COL = (0.40, 0.40)        # t3 (canto), t2 (ancho)
VIG = (0.50, 0.30)
OFF_VIGA = COL[0] / 2     # 0.20 m en cada extremo de la viga
OFF_COL = VIG[0] / 2      # 0.25 m arriba de cada columna
RZS = (0.0, 0.5, 1.0)
MASA = 10.0
NUDOS = {1: (0., 0., 0.), 2: (LX, 0., 0.), 3: (0., 0., H), 4: (LX, 0., H)}
CARGAS = {"LAT": {3: [50., 0., 0., 0., 0., 0.]},
          "VERT": {3: [0., 0., -100., 0., 20., 0.], 4: [0., 0., -100., 0., 0., 0.]},
          "FUERA": {4: [0., 30., 0., 0., 0., 0.]}}
W = 10.0


def pids():
    try:
        s = subprocess.run(["tasklist", "/FI", "IMAGENAME eq " + EXE, "/FO", "CSV", "/NH"],
                           capture_output=True, text=True, timeout=30).stdout
    except Exception:
        return set()
    out = set()
    for ln in s.splitlines():
        p = [x.strip('"') for x in ln.split('","')]
        if len(p) > 1 and p[1].isdigit(): out.add(int(p[1]))
    return out


antes = pids()          # ANTES de arrancar: solo se cierra lo que abra este script
atexit.register(lambda: [os.system("taskkill /PID %d /F >nul 2>&1" % p) for p in pids() - antes])

if PROG == "etabs":
    import comtypes.gen.ETABSv1 as E
    h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
    o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
else:
    import comtypes.gen.SAP2000v1 as E
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(E.cHelper)
    o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject")
o.ApplicationStart()
sm = o.SapModel
sm.InitializeNewModel(6)                       # kN, m, C
if PROG == "etabs":
    sm.File.NewGridOnly(1, H, H, 2, 2, LX, LX)
else:
    sm.File.NewBlank()

sm.PropMaterial.SetMaterial("MAT", 2)
sm.PropMaterial.SetMPIsotropic("MAT", EMOD, NU, 1e-5)
sm.PropMaterial.SetWeightAndMass("MAT", 1, 0.0)
sm.PropMaterial.SetWeightAndMass("MAT", 2, 0.0)
sm.PropFrame.SetRectangle("COL", "MAT", COL[0], COL[1])
sm.PropFrame.SetRectangle("VIG", "MAT", VIG[0], VIG[1])
UNO = [1.0] * 8
sm.PropFrame.SetModifiers("COL", UNO)
sm.PropFrame.SetModifiers("VIG", UNO)


def barra(a, b, sec, nom):
    A, B = NUDOS[a], NUDOS[b]
    r = sm.FrameObj.AddByCoord(A[0], A[1], A[2], B[0], B[1], B[2], "", sec, nom, "Global")
    return r[0] if isinstance(r, (list, tuple)) else nom


c1 = barra(1, 3, "COL", "C1")
c2 = barra(2, 4, "COL", "C2")
v1 = barra(3, 4, "VIG", "V1")

# los nudos, por coordenadas (cada programa los nombra a su manera)
pts = sm.PointObj.GetNameList()[1]
punto = {}
for p in pts:
    c = sm.PointObj.GetCoordCartesian(p, 0., 0., 0.)
    for k, (x, y, z) in NUDOS.items():
        if abs(c[0] - x) < 1e-6 and abs(c[1] - y) < 1e-6 and abs(c[2] - z) < 1e-6:
            punto[k] = p
assert len(punto) == 4, punto
for k in (1, 2):
    sm.PointObj.SetRestraint(punto[k], [True] * 6)
for k in (3, 4):
    sm.PointObj.SetMass(punto[k], [MASA, MASA, MASA, 0., 0., 0.])
if PROG == "etabs":
    for k in (3, 4):
        try: sm.PointObj.SetDiaphragm(punto[k], 1, "")       # 1 = desconectado de todo diafragma
        except Exception: pass

for lp in list(CARGAS) + ["W"]:
    sm.LoadPatterns.Add(lp, 8, 0.0, True)
for lp, d in CARGAS.items():
    for k, v in d.items():
        sm.PointObj.SetLoadForce(punto[k], lp, v)
# 10 = direccion de la gravedad (positivo hacia abajo); distancias relativas 0..1
sm.FrameObj.SetLoadDistributed(v1, "W", 1, 10, 0.0, 1.0, W, W, "Global", True, True)

EDB = os.path.join(AQUI, "_portico." + ("EDB" if PROG == "etabs" else "sdb"))
sm.File.Save(EDB)

ref = dict(programa=PROG, version=str(sm.GetVersion()[0]) if hasattr(sm, "GetVersion") else "",
           LX=LX, H=H, E=EMOD, nu=NU, col=COL, vig=VIG, off_viga=OFF_VIGA, off_col=OFF_COL,
           masa=MASA, W=W, nudos=NUDOS, cargas=CARGAS, casos=[])
# Las propiedades de seccion QUE USA el programa (A, As2, As3, J, I22, I33): se leen, no se suponen
ref["secciones"] = {}
for sec in ("COL", "VIG"):
    sp = llamar(E.cPropFrame, sm.PropFrame, "GetSectProps", sec)
    ref["secciones"][sec] = {k: sp[k] for k in ("Area", "As2", "As3", "Torsion", "I22", "I33")}
    print(sec, ref["secciones"][sec])
PATS = list(CARGAS) + ["W"]
for rz in RZS:
    sm.SetModelIsLocked(False)
    sm.FrameObj.SetEndLengthOffset(v1, False, OFF_VIGA, OFF_VIGA, rz)
    sm.FrameObj.SetEndLengthOffset(c1, False, 0.0, OFF_COL, rz)
    sm.FrameObj.SetEndLengthOffset(c2, False, 0.0, OFF_COL, rz)
    sm.File.Save(EDB)
    sm.Analyze.SetRunCaseFlag("", True, True)
    sm.Analyze.RunAnalysis()
    fila = dict(rz=rz, despl={}, periodos=[], barras={})
    for lp in PATS:
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetCaseSelectedForOutput(lp)
        fila["despl"][lp] = {}
        for k in (3, 4):
            d = llamar(E.cAnalysisResults, sm.Results, "JointDispl", punto[k], 0)
            assert d["NumberResults"] >= 1, (lp, k, d)
            fila["despl"][lp][str(k)] = [d[c][0] for c in ("U1", "U2", "U3", "R1", "R2", "R3")]
        fila["barras"][lp] = {}
        for nom in (c1, c2, v1):
            fr = llamar(E.cAnalysisResults, sm.Results, "FrameForce", nom, 0)
            n = fr["NumberResults"]
            i0 = min(range(n), key=lambda i: fr["ObjSta"][i])
            i1 = max(range(n), key=lambda i: fr["ObjSta"][i])
            fila["barras"][lp][nom] = {
                "sta": [fr["ObjSta"][i0], fr["ObjSta"][i1]],
                **{c: [fr[c][i0], fr[c][i1]] for c in ("P", "V2", "V3", "T", "M2", "M3")}}
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    sm.Results.Setup.SetCaseSelectedForOutput("Modal" if PROG == "etabs" else "MODAL")
    mp = llamar(E.cAnalysisResults, sm.Results, "ModalPeriod")
    fila["periodos"] = [mp["Period"][i] for i in range(mp["NumberResults"])]
    ref["casos"].append(fila)
    print("RZ=%.2f  LAT ux3=%.7f  W uz3=%.7f  T=%s" % (
        rz, fila["despl"]["LAT"]["3"][0], fila["despl"]["W"]["3"][2],
        ", ".join("%.6f" % t for t in fila["periodos"][:4])))

os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
json.dump(ref, open(SALIDA, "w", encoding="utf-8"), indent=1)
print("escrito", SALIDA)
try: o.ApplicationExit(False)
except Exception: pass
