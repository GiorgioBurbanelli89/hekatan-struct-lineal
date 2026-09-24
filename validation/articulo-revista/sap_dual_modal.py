# -*- coding: utf-8 -*-
"""Dual 2x2x4 del articulo en SAP2000 24, MISMA malla nudo a nudo que Hekatan (dual_2x2x4.json).
Modal Eigen 12 modos, masa de los elementos (completa), Shell-Thin y luego Shell-Thick.
    python sap_dual_modal.py dual_2x2x4.json sap_dual.json
Unidades kN-m (E y peso x 9.80665: la razon E/masa es la misma que en Hekatan en tonf)."""
import json, os, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
DUMP, OUT = sys.argv[1], sys.argv[2]
D = json.load(open(DUMP)); G = 9.80665
SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObject(SAP_EXE)
o.ApplicationStart(); log("SAP2000 arrancado")
sm = o.SapModel; sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)

E, nu = D["E"] * G, D["nu"]
sm.PropMaterial.SetMaterial("CONC", 2); sm.PropMaterial.SetMPIsotropic("CONC", E, nu, 1e-5)
sm.PropMaterial.SetWeightAndMass("CONC", 1, D["rho"] * G)

bc, bb, hb = D["bCol"], D["bBeam"], D["hBeam"]
Ac = bc * bc; Ic = bc ** 4 / 12; Jc = 0.141 * bc ** 4
Av = bb * hb; I33v = bb * hb ** 3 / 12; I22v = hb * bb ** 3 / 12; Jv = I33v + I22v   # como testM.ts
# SetGeneral(Name, Mat, T3, T2, Area, As2, As3, Torsion, I22, I33, S22, S33, Z22, Z33, R22, R33)
log("COL %s" % sm.PropFrame.SetGeneral("COL", "CONC", bc, bc, Ac, 5 / 6 * Ac, 5 / 6 * Ac, Jc, Ic, Ic, 1, 1, 1, 1, 1, 1))
log("VIGA %s" % sm.PropFrame.SetGeneral("VIGA", "CONC", hb, bb, Av, 5 / 6 * Av, 5 / 6 * Av, Jv, I22v, I33v, 1, 1, 1, 1, 1, 1))
# SetShell_1(Name, ShellType, IncludeDrillingDOF, Mat, MatAng, Thickness, Bending)  1 = ShellThin, 2 = ShellThick
for tipo, nomT in ((1, "THIN"), (2, "THICK")):
    sm.PropArea.SetShell_1("LOSA_" + nomT, tipo, True, "CONC", 0.0, D["tSlab"], D["tSlab"])
    sm.PropArea.SetShell_1("MURO_" + nomT, tipo, True, "CONC", 0.0, D["tWall"], D["tWall"])

nom = []
for i, (x, y, z) in enumerate(D["nodes"]):
    sm.PointObj.AddCartesian(float(x), float(y), float(z), "", "N%d" % i); nom.append("N%d" % i)
areas = []
for k, (el, kind) in enumerate(zip(D["elements"], D["kinds"])):
    if kind in ("col", "beam"):
        sm.FrameObj.AddByPoint(nom[el[0]], nom[el[1]], "", "COL" if kind == "col" else "VIGA", "F%d" % k)
    else:
        nm = "A%d" % k; sm.AreaObj.AddByPoint(4, [nom[j] for j in el], "", ("LOSA_" if kind == "slab" else "MURO_") + "THIN", nm)
        areas.append((nm, kind))
for i in D["supports"]: sm.PointObj.SetRestraint(nom[int(i)], [True] * 6)
log("modelo: %d nudos, %d elementos, %d areas, %d apoyos" % (len(nom), len(D["elements"]), len(areas), len(D["supports"])))

sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)
out = {"nudos": len(nom), "casos": {}}
for nomT in ("THIN", "THICK"):
    sm.SetModelIsLocked(False)
    if nomT == "THICK":
        for nm, kind in areas: sm.AreaObj.SetProperty(nm, ("LOSA_" if kind == "slab" else "MURO_") + nomT)
    sm.File.Save(os.path.join(os.path.dirname(os.path.abspath(OUT)), "sap_dual_%s.sdb" % nomT.lower()))
    sm.Analyze.SetRunCaseFlag("", False, True); sm.Analyze.SetRunCaseFlag("MODAL", True)
    log("%s run -> %s" % (nomT, sm.Analyze.RunAnalysis()))
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("MODAL")
    rp = sm.Results.ModalPeriod(0, [], [], [], [], [], [], [])
    rm = sm.Results.ModalParticipatingMassRatios(0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    T = [float(v) for v in rp[4]]
    c = {"T": T, "Ux": [float(v) for v in rm[5]], "Uy": [float(v) for v in rm[6]], "Uz": [float(v) for v in rm[7]],
         "Rz": [float(v) for v in rm[13]], "ret": [rp[-1], rm[-1]]}
    c["sumUx"] = 100 * sum(c["Ux"]); c["sumUy"] = 100 * sum(c["Uy"])
    out["casos"][nomT] = c
    log("%s  T1-5 %s  SUx %.1f SUy %.1f" % (nomT, " ".join("%.4f" % t for t in T[:5]), c["sumUx"], c["sumUy"]))
    json.dump(out, open(OUT, "w"), indent=1)
o.ApplicationExit(False)
log("fin")
