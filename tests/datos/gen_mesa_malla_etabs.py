# -*- coding: utf-8 -*-
"""Mesa torsion en ETABS con la losa mallada n x n: T de la viga sur (UDCon2) y periodos.

    python gen_mesa_malla_etabs.py [ruta.e2k] [n1 n2 ...]

Malla: FLOORMESHMAXSIZE = 6/n + 0.001 (ETABS parte en ceil(6/tam) = n). Brazos
rigidos a CERO (SetEndLengthOffset). ETABS parte la viga en los nudos de la losa
(nBeamElm = n). Ficheros de trabajo y salida cruda en $TEMP/mesa_malla_etabs/;
el resumen versionado es tests/datos/mesa_torsion_malla_etabs.json.
"""
import json, os, sys, re
import comtypes.client
import comtypes.gen.ETABSv1 as E
sys.stdout.reconfigure(encoding="utf-8")

SRC = next((a for a in sys.argv[1:] if a.lower().endswith(".e2k")),
           os.path.join(os.path.expanduser("~"), "Downloads", "Etabs Torsion", "Mesa torsiónT.e2k"))
AQUI = os.path.join(os.environ.get("TEMP", "."), "mesa_malla_etabs")
os.makedirs(AQUI, exist_ok=True)
ns = [int(a) for a in sys.argv[1:] if a.isdigit()] or [1, 2, 4, 5, 8, 16, 32]
txt = open(SRC, encoding="latin-1").read()

h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart()
try:
    o.Hide()
except Exception:
    pass
sm = o.SapModel
res = []
try:
    for n in ns:
        t = re.sub(r"FLOORMESHMAXSIZE\s+[\d.]+", "FLOORMESHMAXSIZE  %.4f" % (6.0 / n + 0.001), txt)
        f = os.path.join(AQUI, "mesa_n%d.e2k" % n)
        open(f, "w", encoding="latin-1").write(t)
        sm.InitializeNewModel(12)                      # tonf_m_C
        sm.File.OpenFile(f)
        sm.SetPresentUnits(12)
        _, fos, _ = sm.FrameObj.GetNameList()
        for nm in fos:                                 # brazos rigidos a cero
            sm.FrameObj.SetEndLengthOffset(nm, False, 0., 0., 0.)
        sm.File.Save(f.replace(".e2k", ".EDB"))        # ETABS no analiza un modelo sin guardar
        sm.Analyze.RunAnalysis()
        _, lelms, _ = sm.LineElm.GetNameList()
        _, aelms, _ = sm.AreaElm.GetNameList()
        # viga sur: los dos extremos en y = 0, z = 4 (el e2k importado renombra B1 -> "5")
        viga = None
        for nm in fos:
            g = sm.FrameObj.GetPoints(nm, "", "")
            c1 = sm.PointObj.GetCoordCartesian(g[0], 0., 0., 0.)
            c2 = sm.PointObj.GetCoordCartesian(g[1], 0., 0., 0.)
            if abs(c1[1]) < 1e-6 and abs(c2[1]) < 1e-6 and c1[2] > 1 and c2[2] > 1:
                viga = nm
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetComboSelectedForOutput("UDCon2")
        r = sm.Results.FrameForce(viga, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [])
        k = r[0]
        sta, T, elm = list(r[2][:k]), list(r[11][:k]), list(r[3][:k])
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetCaseSelectedForOutput("Modal")
        mp = sm.Results.ModalPeriod(0, [], [], [], [], [], [], [])
        d = dict(n=n, nLineElm=len(lelms), nAreaElm=len(aelms), nBeamElm=len(set(elm)),
                 Tu=max(abs(x) for x in T), perfil=sorted(zip(sta, T)), periodos=list(mp[4][:6]))
        print(json.dumps({a: b for a, b in d.items() if a != "perfil"}), flush=True)
        res.append(d)
finally:
    json.dump(res, open(os.path.join(AQUI, "etabs_malla_%s.json" % "_".join(map(str, ns))), "w"), indent=1)
    o.ApplicationExit(False)
