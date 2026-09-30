# Descubre las tablas editables de ETABS para funciones de tiempo y casos de tiempo-historia (la OAPI de ETABS no
# tiene FuncTH.SetUser ni DirHistLinear.SetCase: van por DatabaseTables).
import comtypes.client, comtypes.gen.ETABSv1 as E, json, os
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart(); sm = o.SapModel
sm.InitializeNewModel(1); sm.File.NewBlank()
r = sm.DatabaseTables.GetAllTables(0, [], [], [])
print("GetAllTables ->", [type(x).__name__ for x in r])
tabs = [(k, n, imp) for k, n, imp in zip(r[1], r[2], r[3])]
out = {}
for k, n, imp in tabs:
    if any(w in k for w in ("Mass Source", "Mass Summary", "Story Definitions", "Stories")):
        f = sm.DatabaseTables.GetAllFieldsInTable(k, 0, 0, [], [], [], [], [])
        out[k] = {"importable": imp, "campos": list(zip(f[2], f[3], f[5], f[6]))}
json.dump(out, open(os.path.join(os.path.dirname(__file__), "etabs_tablas_masa.json"), "w"), indent=1)
print("tablas", len(tabs), "relevantes", len(out))
o.ApplicationExit(False)
