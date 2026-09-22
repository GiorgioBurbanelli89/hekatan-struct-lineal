# ¿Cómo malla ETABS 22 una losa según su TIPO? Paños de 4.3 × 4.3 m aislados (4 esquinas apoyadas),
# FLOORMESHMAXSIZE de fábrica. Se cuenta cuántos elementos de análisis sale de cada objeto.
import os, comtypes.client as cc
cc.CreateObject('ETABSv1.Helper'); from comtypes.gen import ETABSv1 as E
h = cc.CreateObject('ETABSv1.Helper').QueryInterface(E.cHelper)
et = h.CreateObject(r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe").QueryInterface(E.cOAPI); et.ApplicationStart()
sm = et.SapModel; sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 3.0, 3.0, 2, 2, 5.0, 5.0); sm.SetPresentUnits(6)
sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", 2.5e7, 0.2, 1e-5)
casos = {
  "MACIZA":  ("slab", None),
  "NERV05":  ("rib", (0.25, 0.05, 0.1, 0.1, 0.5, 1)),
  "NERV08":  ("rib", (0.25, 0.05, 0.1, 0.1, 0.8, 1)),
  "NERV05y": ("rib", (0.25, 0.05, 0.1, 0.1, 0.5, 2)),
  "RET05":   ("waf", (0.25, 0.05, 0.1, 0.1, 0.5, 0.5)),
  "RET0508": ("waf", (0.25, 0.05, 0.1, 0.1, 0.5, 0.8)),
}
L = 4.3; x0 = 0.0
for nom, (tipo, g) in casos.items():
    if tipo == "slab": print(nom, "prop", sm.PropArea.SetSlab(nom, 0, 1, "C", 0.2))
    elif tipo == "rib": print(nom, "prop", sm.PropArea.SetSlab(nom, 3, 1, "C", 0.05), sm.PropArea.SetSlabRibbed(nom, *g))
    else: print(nom, "prop", sm.PropArea.SetSlab(nom, 4, 1, "C", 0.05), sm.PropArea.SetSlabWaffle(nom, *g))
    a = sm.AreaObj.AddByCoord(4, [x0, x0 + L, x0 + L, x0], [0, 0, L, L], [3.0] * 4, "", nom)
    nm = a[-2] if isinstance(a[-2], str) else a[3]
    for x, y in ((x0, 0), (x0 + L, 0), (x0 + L, L), (x0, L)):
        p = sm.PointObj.AddCartesian(x, y, 3.0, "", "", "Global", True)
    x0 += 6.0
for p in sm.PointObj.GetNameList()[1]: sm.PointObj.SetRestraint(p, [True, True, True, False, False, False])
aqui = os.path.dirname(os.path.abspath(__file__)); sm.File.Save(os.path.join(aqui, "_nervios.EDB")); print("run", sm.Analyze.RunAnalysis())
cuenta = {}
for e in sm.AreaElm.GetNameList()[1]:
    o = sm.AreaElm.GetObj(e)[0]; cuenta[o] = cuenta.get(o, 0) + 1
for a in sm.AreaObj.GetNameList()[1]: print("obj", a, sm.AreaObj.GetProperty(a)[0], "elementos", cuenta.get(a, 0))
et.ApplicationExit(False)
