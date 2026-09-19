# -*- coding: utf-8 -*-
"""Lee del FDB ya analizado (safe_mismo_modelo.py) los desplazamientos de nudo para DISEÑO.  CSI_NUEVA=1.
  python safe_uz.py <prefSAFE>   -> <prefSAFE>.uz.json {punto: [x, y, Ux, Uy, Uz, Rx, Ry, Rz]}"""
import sys, os, json, time
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\safe-cli\cli")
import csi_cli
pref = os.path.abspath(sys.argv[1]); assert os.environ.get("CSI_NUEVA") == "1"
obj, sm, started = csi_cli.start_engine("safe", 6, False); assert started
try:
    print("open", sm.File.OpenFile(pref + ".fdb")); sm.SetPresentUnits(6)
    if not sm.GetModelIsLocked(): print("run", sm.Analyze.RunAnalysis())
    R = sm.Results; R.Setup.DeselectAllCasesAndCombosForOutput(); R.Setup.SetComboSelectedForOutput("DISE\u00d1O")
    rr = R.JointDispl("All", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
    n = rr[0]; U = {}
    for i in range(n):
        p = rr[1][i]; x, y, z = sm.PointElm.GetCoordCartesian(p)[:3]
        U[p] = [x, y] + [float(rr[6 + k][i]) for k in range(6)]
    json.dump(U, open(pref + ".uz.json", "w")); print("nudos", len(U))
finally:
    obj.ApplicationExit(False)
