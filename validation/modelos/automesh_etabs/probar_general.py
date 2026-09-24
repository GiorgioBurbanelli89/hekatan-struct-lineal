# El MISMO modelo con MESHTYPE "GENERAL" (lo que trae MOD_001) en vez de "RECTANGULAR".
import os, re, sys, comtypes.client as cc
cc.CreateObject('ETABSv1.Helper'); from comtypes.gen import ETABSv1 as E
h = cc.CreateObject('ETABSv1.Helper').QueryInterface(E.cHelper)
et = h.CreateObject(r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe").QueryInterface(E.cOAPI); et.ApplicationStart()
sm = et.SapModel; aqui = os.path.dirname(os.path.abspath(__file__))
sm.File.OpenFile(os.path.join(aqui, "_nervios.EDB")); e2k = os.path.join(aqui, "_nervios.e2k"); sm.File.ExportFile(e2k, 1)
t = open(e2k, encoding="latin-1").read()
print("AUTOMESHOPTIONS original:", re.search(r"AUTOMESHOPTIONS.*", t).group(0).strip())
for tipo in ("GENERAL", "RECTANGULAR"):
    g = re.sub(r'MESHTYPE\s+"\w+"', f'MESHTYPE "{tipo}"', t, count=1)
    f = os.path.join(aqui, f"_nervios_{tipo}.e2k"); open(f, "w", encoding="latin-1").write(g)
    sm.File.OpenFile(f); sm.File.Save(os.path.join(aqui, f"_nervios_{tipo}.EDB")); sm.Analyze.RunAnalysis()
    c = {}
    for e in sm.AreaElm.GetNameList()[1]: o = sm.AreaElm.GetObj(e)[0]; c[o] = c.get(o, 0) + 1
    print(tipo, {a: c.get(a, 0) for a in sm.AreaObj.GetNameList()[1]})
et.ApplicationExit(False)
