# -*- coding: utf-8 -*-
"""IDA Y VUELTA: abre en SAP2000 el .s2k y en ETABS el .e2k que EXPORTA Hekatan (modelos/<caso>/),
corre y compara nudo a nudo con lo que dio ETABS mallando solo (<caso>_etabs_malla_thin.json).
Si el exportador escribe bien triangulos, Shell-Thin, apoyos y cargas, sale 0 %.

    python abrir_csi_y_comparar.py sap   [caso ...]     # SAP2000 lee los .s2k
    python abrir_csi_y_comparar.py etabs [caso ...]     # ETABS lee los .e2k
    ... --ver  deja el programa ABIERTO con el ultimo caso

Sale modelos/<caso>/<caso>_idavuelta_<prog>.json
"""
import json, os, sys, time
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.normpath(os.path.join(AQUI, "..", "isse", "automesh", "etabs_poligono"))
TODOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"]
prog = sys.argv[1]; casos = [a for a in sys.argv[2:] if not a.startswith("--")] or TODOS
VER = "--ver" in sys.argv
t0 = time.time(); log = lambda s: print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

if prog == "sap":
    import comtypes.gen.SAP2000v1 as S
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
    o = h.CreateObject(r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"); ext, caso_carga = ".s2k", "DEAD"
else:
    import comtypes.gen.ETABSv1 as E
    h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
    o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); ext, caso_carga = ".e2k", "Dead"
o.ApplicationStart(); sm = o.SapModel; log(prog + " arrancado")

for caso in casos:
    ref = json.load(open(os.path.join(DATOS, caso + "_etabs_malla_thin.json"), encoding="utf-8"))["etabs"]
    f = os.path.join(AQUI, "modelos", caso, caso + ext)
    if prog == "sap":                       # SAP2000 abre el texto como .$2k (asi lo hace csi-cli)
        import shutil; g = os.path.splitext(f)[0] + ".$2k"; shutil.copyfile(f, g); f = g
    sm.InitializeNewModel(6)                # SIN esto OpenFile se queda colgado en un dialogo
    r = sm.File.OpenFile(f); sm.SetPresentUnits(6)
    sm.Analyze.SetRunCaseFlag("MODAL" if prog == "sap" else "Modal", False)
    sm.Analyze.RunAnalysis()
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput(caso_carga)
    wmax = max(abs(d[2]) for d in ref["desplaz"] if d)
    peor, n, falta = 0.0, 0, 0
    out = []
    for i, d in enumerate(ref["desplaz"]):
        dd = sm.Results.JointDispl(str(i + 1), 0) if prog == "sap" else \
             sm.Results.JointDispl(str(i + 1), 0, 0, [], [], [], [], [], [], [], [], [], [], [], [])
        if not dd or dd[-1] != 0 or not dd[0] or d is None: falta += 1; out.append(None); continue
        u = [float(dd[q][0]) for q in (6, 7, 8)]; out.append(u); n += 1
        peor = max(peor, max(abs(u[c] - d[c]) for c in range(3)) / wmax * 100)
    json.dump({"prog": prog, "caso": caso, "fichero": os.path.basename(f), "desplaz": out, "peor_pct": peor, "nudos": n, "sin_dato": falta},
              open(os.path.join(AQUI, "modelos", caso, f"{caso}_idavuelta_{prog}.json"), "w"), indent=1)
    log("%-22s abre %s -> %s · %d nudos (%d sin dato) · peor nudo vs ETABS original %.2e %% del max"
        % (caso, os.path.basename(f), r, n, falta, peor))

if not VER: o.ApplicationExit(False)
else: log(prog + " queda ABIERTO con " + casos[-1])
