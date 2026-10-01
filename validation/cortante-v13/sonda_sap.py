# -*- coding: utf-8 -*-
"""SAP2000 (juez): losa Shell-Thin con malla IRREGULAR, apoyada en el borde; vuelca desplazamientos y
AreaForceShell (M11 M22 M12 V13 V23 por joint) para sacar cómo calcula CSI el cortante. python sonda_sap.py [thin|thick]"""
import json, os, sys, random
import comtypes.client
import comtypes.gen.SAP2000v1 as S
TIPO = sys.argv[1] if len(sys.argv) > 1 else "thin"
AQUI = os.path.dirname(os.path.abspath(__file__))
random.seed(7)
nx, ny, Lx, Ly = 5, 4, 5.0, 4.0
xs = [Lx * i / nx for i in range(nx + 1)]; ys = [Ly * j / ny for j in range(ny + 1)]
nodes = []
for j in range(ny + 1):
    for i in range(nx + 1):
        x, y = xs[i], ys[j]
        if 0 < i < nx and 0 < j < ny: x += random.uniform(-0.25, 0.25); y += random.uniform(-0.2, 0.2)
        nodes.append([round(x, 4), round(y, 4), 0.0])
els = [[j * (nx + 1) + i, j * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i + 1, (j + 1) * (nx + 1) + i] for j in range(ny) for i in range(nx)]
E, nu, t, q = 2.5e7, 0.2, 0.20, -10.0
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
try: o = h.GetObject("CSI.SAP2000.API.SapObject")
except Exception: o = None
if o is None: o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
sm = o.SapModel; sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, nu, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
sm.PropArea.SetShell_1("LOSA", 1 if TIPO == "thin" else 2, True, "C", 0.0, t, t)
for k, (x, y, z) in enumerate(nodes): sm.PointObj.AddCartesian(x, y, z, "", "N%d" % k)
for k, e in enumerate(els): sm.AreaObj.AddByPoint(4, ["N%d" % n for n in e], "", "LOSA", "A%d" % k)
for k, (x, y, z) in enumerate(nodes):
    borde = x < 1e-6 or y < 1e-6 or abs(x - Lx) < 1e-6 or abs(y - Ly) < 1e-6
    sm.PointObj.SetRestraint("N%d" % k, [True, True, borde, False, False, True])
sm.LoadPatterns.Add("Q", 8, 0.0, True)
for k in range(len(els)): sm.AreaObj.SetLoadUniform("A%d" % k, "Q", q, 6, True, "Global", 0)
sm.PointObj.SetLoadForce("N%d" % (2 * (nx + 1) + 2), "Q", [0, 0, -30.0, 0, 0, 0])
sm.File.Save(os.path.join(AQUI, "sonda_%s.sdb" % TIPO))
print("run", sm.Analyze.RunAnalysis(), flush=True)
sm.Results.Setup.DeselectAllCasesAndCombosForOutput(); sm.Results.Setup.SetCaseSelectedForOutput("Q")
U = {}
for k in range(len(nodes)):
    r = sm.Results.JointDispl("N%d" % k, 0, 0, [], [], [], [], [], [], [], [], [], [], [])
    U[k] = [float(r[q_][0]) for q_ in (6, 7, 8, 9, 10, 11)]
fil = []
for k in range(len(els)):
    r = sm.Results.AreaForceShell("A%d" % k, 0, 0, [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [])
    n = r[0]
    for a in range(n):
        fil.append({"area": k, "pt": int(str(r[3][a]).lstrip("N~")) if str(r[3][a]).lstrip("N").isdigit() else str(r[3][a]),
                    "F11": r[7][a], "M11": r[14][a], "M22": r[15][a], "M12": r[16][a], "V13": r[20][a], "V23": r[21][a], "VMax": r[22][a]})
json.dump({"nodes": nodes, "els": els, "E": E, "nu": nu, "t": t, "q": q, "U": U, "shell": fil}, open(os.path.join(AQUI, "sonda_%s.json" % TIPO), "w"), indent=0)
print("filas", len(fil), fil[:2], flush=True)
