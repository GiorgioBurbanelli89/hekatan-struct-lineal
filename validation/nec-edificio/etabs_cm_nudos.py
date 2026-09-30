# CM por nivel desde «Assembled Joint Masses» de ETABS (masa nudo a nudo). python etabs_cm_nudos.py EDIF_etabs.EDB
import comtypes.client, comtypes.gen.ETABSv1 as E, subprocess, collections, os, sys, json
AQUI = os.path.dirname(os.path.abspath(__file__))
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.GetObject("CSI.ETABS.API.ETABSObject")
if o is None:
    pid = int([l.split()[1] for l in subprocess.run(["tasklist"], capture_output=True, text=True).stdout.splitlines() if l.startswith("ETABS.exe")][0])
    o = h.GetObjectProcess("CSI.ETABS.API.ETABSObject", pid)
sm = o.SapModel
print("abrir", sm.File.OpenFile(os.path.join(AQUI, sys.argv[1])))
sm.SetPresentUnits(6)
if not sm.GetModelIsLocked(): print("run", sm.Analyze.RunAnalysis())
r = sm.Results.AssembledJointMass("All", 2, 0, [], [], [], [], [], [], [])
n, nom, m1 = r[0], list(r[1]), list(r[2])
acc = collections.defaultdict(lambda: [0.0, 0.0, 0.0])
for k in range(n):
    x, y, z, _ = sm.PointElm.GetCoordCartesian(nom[k], 0, 0, 0)
    a = acc[round(z, 2)]; a[0] += m1[k]; a[1] += m1[k] * x; a[2] += m1[k] * y
out = []
for z in sorted(acc):
    a = acc[z]
    if a[0] > 1: out.append({"z": z, "masa": a[0], "cm": [a[1] / a[0], a[2] / a[0]]}); print("z %.2f masa %.4f CM (%.4f, %.4f)" % (z, a[0], a[1] / a[0], a[2] / a[0]))
json.dump(out, open(os.path.join(AQUI, "etabs_cm_nudos.json"), "w"), indent=1)
