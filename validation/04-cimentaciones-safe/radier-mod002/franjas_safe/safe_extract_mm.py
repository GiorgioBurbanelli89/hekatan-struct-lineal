import os, sys, json, time
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\safe-cli\cli")
import csi_cli
src_dir, fdb, out = sys.argv[1], sys.argv[2], sys.argv[3]
obj, SM, started = csi_cli.start_engine("safe", 9, False)
assert started
try:
    print("OpenFile", SM.File.OpenFile(os.path.join(src_dir, fdb)))
    print("DB units", SM.GetDatabaseUnits() if hasattr(SM, "GetDatabaseUnits") else "?")
    SM.SetPresentUnits(9)  # N, mm
    P = {}
    for p in SM.PointElm.GetNameList()[1]:
        x, y, z = SM.PointElm.GetCoordCartesian(p)[:3]; P[p] = [x, y, z]
    O = {}
    for p in SM.PointObj.GetNameList()[1]:
        x, y, z = SM.PointObj.GetCoordCartesian(p)[:3]; O[p] = [x, y, z]
    json.dump(dict(points_mm=P, pointobj_mm=O), open(os.path.join(out, "coords_mm.json"), "w"), indent=0)
    print(len(P), len(O))
finally:
    obj.ApplicationExit(False)
