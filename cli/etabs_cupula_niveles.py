# -*- coding: utf-8 -*-
"""ETABS abre la cúpula de 8 niveles que escribió Hekatan: ¿la corta? Cuenta objetos y modelo de análisis."""
import sys, os, json, math
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", "cupula_niveles")
_, S, _ = c.start_engine("etabs", 6, True)
c.load_model_from_file(S, os.path.join(D, sys.argv[1] if len(sys.argv) > 1 else "cupula.e2k"), 6)
S.SetPresentUnits(6)
out = {}
out["pisos"] = list(S.Story.GetNameList()[1])
n, areas, _r = S.AreaObj.GetNameList(); out["areas_obj"] = n
n, pts, _r = S.PointObj.GetNameList(); out["puntos_obj"] = n
radios = []
for p in pts:
    x, y, z = S.PointObj.GetCoordCartesian(p)[:3]; radios.append(math.sqrt(x*x + y*y + z*z))
out["radio_obj_min_max"] = [round(min(radios), 4), round(max(radios), 4)]
S.File.Save(os.path.join(D, "cupula_etabs.EDB"))
print("Run", S.Analyze.RunAnalysis(), flush=True)
S.Results.Setup.DeselectAllCasesAndCombosForOutput(); S.Results.Setup.SetCaseSelectedForOutput("Dead")
r = S.DatabaseTables.GetTableForDisplayArray("Objects and Elements - Joints", [], "", 0, [], 0, [])
try:
    campos, nfilas, datos = list(r[2]), r[3], list(r[4])
    ix, iy, iz = campos.index("GlobalX"), campos.index("GlobalY"), campos.index("GlobalZ")
    rr = [math.sqrt(sum(float(datos[k*len(campos)+i])**2 for i in (ix, iy, iz))) for k in range(nfilas)]
    out["nudos_analisis"] = nfilas; out["radio_analisis_min_max"] = [round(min(rr), 4), round(max(rr), 4)]
except Exception as e:
    out["tabla_err"] = str(e)[:150]; out["tabla_raw"] = str(r)[:300]
r2 = S.DatabaseTables.GetTableForDisplayArray("Objects and Elements - Shells", [], "", 0, [], 0, [])
try: out["shells_analisis"] = r2[3]
except Exception as e: out["shells_err"] = str(e)[:100]
print(json.dumps(out, indent=1), flush=True)
json.dump(out, open(os.path.join(D, "cupula_etabs.json"), "w"), indent=1)
