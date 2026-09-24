# -*- coding: utf-8 -*-
"""SAP2000 resuelve LA MALLA QUE HIZO ETABS (mismos nudos, mismos Q4 y triangulos, mismos apoyos,
misma carga) con Shell-Thin. Asi SAP2000 es un SEGUNDO juez de lo mismo que se compara con ETABS.

    python sap_sobre_malla_etabs.py                 # los 7 casos
    python sap_sobre_malla_etabs.py losa_T          # uno
    python sap_sobre_malla_etabs.py losa_T --ver    # deja SAP2000 ABIERTO con el modelo al terminar

Entra:  ../isse/automesh/etabs_poligono/<caso>_etabs_malla_thin.json   (malla_etabs_poligono.py --tipo thin)
Sale:   ../isse/automesh/etabs_poligono/<caso>_sap_thin.json  y  <caso>_sap_thin.sdb (para abrirlo en SAP2000)
Unidades kN, m. E = 25e6 kN/m2, nu = 0.2, t = 0.20 m, q = -10 kN/m2 en Z global, sin peso propio.
"""
import json, os, sys, time
import comtypes.client
import comtypes.gen.SAP2000v1 as S
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]
casos = [a for a in sys.argv[1:] if not a.startswith("--")] or TODOS
VER = "--ver" in sys.argv
SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"
t0 = time.time()
log = lambda s: print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.CreateObject(SAP_EXE)
o.ApplicationStart(); log("SAP2000 arrancado")
sm = o.SapModel

for caso in casos:
    J = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
    sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)          # kN, m, C
    sm.PropMaterial.SetMaterial("MAT0", 2)
    sm.PropMaterial.SetMPIsotropic("MAT0", 25e6, 0.2, 1e-5)
    sm.PropMaterial.SetWeightAndMass("MAT0", 1, 0.0)
    sm.PropArea.SetShell_1("LOSA", 1, True, "MAT0", 0.0, 0.20, 0.20)              # 1 = Shell-Thin
    nom = []
    for i, (x, y, z) in enumerate(J["nudos"]):
        r = sm.PointObj.AddCartesian(x, y, z, "", "N%d" % (i + 1)); nom.append(r[0])
    k = 0
    for e in J["elementos"]:
        if len(e) not in (3, 4): continue
        k += 1
        r = sm.AreaObj.AddByPoint(len(e), [nom[i] for i in e], "", "LOSA", "A%d" % k)
        sm.AreaObj.SetLoadUniform(r[1] if isinstance(r, (list, tuple)) else "A%d" % k, "DEAD", -10.0, 6, True, "Global", 0)
    for i, rr in enumerate(J["restricciones"]):
        if rr and any(rr): sm.PointObj.SetRestraint(nom[i], [bool(v) for v in rr])
    sdb = os.path.join(DATOS, caso + "_sap_thin.sdb")
    sm.File.Save(sdb)
    sm.Analyze.SetRunCaseFlag("MODAL", False)
    sm.Analyze.RunAnalysis()
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("DEAD")
    desplaz = []
    for n in nom:
        d = sm.Results.JointDispl(n, 0)
        desplaz.append([float(d[q][0]) for q in (6, 7, 8, 9, 10, 11)] if d[-1] == 0 and d[0] else None)
    rb = sm.Results.BaseReact()
    sumRz = float(rb[6][0]) if rb[0] else None
    json.dump({"prog": "sap2000", "caso": caso, "desplaz": desplaz, "sumRz": sumRz, "n_cascaras": k},
              open(os.path.join(DATOS, caso + "_sap_thin.json"), "w"), indent=1)
    wE = max(abs(d[2]) for d in J["desplaz"] if d); wS = max(abs(d[2]) for d in desplaz if d)
    log("%-22s %d nudos, %d cascaras · sumRz %.3f · w max SAP %.6e ETABS %.6e (%.4f %%)"
        % (caso, len(nom), k, sumRz, wS, wE, (wS / wE - 1) * 100))

if not VER: o.ApplicationExit(False)
else: log("SAP2000 queda ABIERTO con " + casos[-1])
