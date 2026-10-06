"""ETABS: campos de las tablas de casos (Buckling, Steady State, PSD, funciones, amortiguamiento) y métodos de Results.Setup.
    python validation/casos-csi/etabs_campos.py  -> etabs_campos.json"""
import json, os, subprocess, atexit
import comtypes.client
import comtypes.gen.ETABSv1 as EV
AQUI = os.path.dirname(os.path.abspath(__file__))


def pids():
    s = subprocess.run(["tasklist", "/FI", "IMAGENAME eq ETABS.exe", "/FO", "CSV", "/NH"], capture_output=True, text=True).stdout
    return {int(p.split('","')[1]) for p in s.splitlines() if '","' in p}


antes = pids(); atexit.register(lambda: [os.system("taskkill /PID %d /F >nul 2>&1" % p) for p in pids() - antes])
h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(EV.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject"); o.ApplicationStart(); sm = o.SapModel
sm.InitializeNewModel(6); sm.File.NewGridOnly(1, 3.0, 3.0, 2, 2, 10.0, 10.0)
out = {}
for t in ["Load Case Definitions - Buckling", "Load Case Definitions - Steady State", "Load Case Definitions - Power Spectral Density",
          "Load Case Definitions - Damping - Hysteretic", "Functions - Steady State - User Defined", "Functions - Power Spectral Density - User Defined",
          "Load Case Definitions - Hyperstatic", "Load Case Definitions - Summary", "Buckling Factors"]:
    r = sm.DatabaseTables.GetAllFieldsInTable(t, 0, 0, [], [], [], [], [])
    out[t] = dict(claves=list(r[2]), nombres=list(r[3]), unidades=list(r[5]) if len(r) > 5 else [])
    print(t, out[t]["claves"], flush=True)
out["Results.Setup"] = [m for m in dir(sm.Results.Setup) if not m.startswith("_")]
out["Results"] = [m for m in dir(sm.Results) if not m.startswith("_")]
print(out["Results.Setup"], flush=True)
json.dump(out, open(os.path.join(AQUI, "etabs_campos.json"), "w"), indent=1, ensure_ascii=False)
o.ApplicationExit(False)
