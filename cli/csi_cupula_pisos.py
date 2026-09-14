# -*- coding: utf-8 -*-
"""Cúpula con NIVELES INTERIORES (losas curvas que cruzan varios pisos) abierta en ETABS (.e2k) o SAP2000 (.s2k).
¿La rompe? Cuenta objetos y elementos de ANÁLISIS (automesh), radio de los nudos de la cúpula, piso de cada
área y desplazamiento Dead nudo a nudo contra Hekatan (cupula_pisos_hekatan_dead.json).
    python cli/csi_cupula_pisos.py etabs|sap [carpeta_en_shots] [nombre]
    (por defecto: cupula_niveles cupula_pisos; p. ej. galpon_curvo galpon_curvo)
"""
import sys, os, json, math
sys.path.insert(0, r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\csi-cli\hekatan-csi-cli")
import csi_cli as c

motor = sys.argv[1] if len(sys.argv) > 1 else "etabs"
CARP = sys.argv[2] if len(sys.argv) > 2 else "cupula_niveles"
NOM = sys.argv[3] if len(sys.argv) > 3 else "cupula_pisos"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots", CARP)
fich = os.path.join(D, NOM + "." + ("e2k" if motor == "etabs" else "s2k"))
_, S, _ = c.start_engine("etabs" if motor == "etabs" else "sap", 6, True)
def paso(n, v): print("%-22s %s" % (n, str(v)[:220]), flush=True); return v
c.load_model_from_file(S, fich, 6)
S.SetPresentUnits(6)
out = {"motor": motor}
n, areas, _r = S.AreaObj.GetNameList(); out["areas_obj"] = n
n, pts, _r = S.PointObj.GetNameList(); out["puntos_obj"] = n
n, frames, _r = S.FrameObj.GetNameList(); out["barras_obj"] = n
# nudos de la cúpula (fuera del entrepiso interior): radio desde el origen
rad = []
for p in pts:
    x, y, z = S.PointObj.GetCoordCartesian(p)[:3]
    r = math.sqrt(x * x + y * y + z * z)
    if NOM == "cupula_pisos" and (abs(x) > 2.5 or abs(y) > 2.5 or z > 5.01): rad.append(r)
out["radio_cupula_min_max"] = [round(min(rad), 4), round(max(rad), 4)] if rad else None
if motor == "etabs":
    pisos = {}
    for a in areas:
        try:
            st = S.AreaObj.GetLabelFromName(a)[2]
        except Exception:
            st = "?"
        pisos[st] = pisos.get(st, 0) + 1
    out["areas_por_piso"] = pisos
S.File.Save(os.path.join(D, NOM + "_%s.%s" % (motor, "EDB" if motor == "etabs" else "sdb")))
paso("Run", S.Analyze.RunAnalysis())
S.Results.Setup.DeselectAllCasesAndCombosForOutput()
caso = "Dead" if motor == "etabs" else "DEAD"
S.Results.Setup.SetCaseSelectedForOutput(caso)
# la carga que el programa DE VERDAD resiste: suma de reacciones en la base (kN, unidades 6)
try:
    br = S.Results.BaseReact()
    out["sum_Fz_base_kN"] = round(sum(br[6]), 3) if br[0] else None
except Exception as e:
    out["sum_Fz_base_kN"] = "err " + str(e)[:60]
# elementos de ANÁLISIS
for tabla, clave in (("Objects and Elements - Joints", "nudos_analisis"), ("Objects and Elements - Shells", "shells_analisis"),
                     ("Objects and Elements - Frames", "barras_analisis")):
    try:
        r = S.DatabaseTables.GetTableForDisplayArray(tabla, [], "", 0, [], 0, [])
        out[clave] = r[3]
    except Exception as e:
        out[clave] = "err " + str(e)[:60]
# desplazamiento Dead nudo a nudo contra Hekatan (por coordenadas)
ref = json.load(open(os.path.join(D, NOM + "_hekatan_dead.json")))
peor, casados, umax = 0.0, 0, 0.0
coords = {}
for p in pts:
    x, y, z = S.PointObj.GetCoordCartesian(p)[:3]
    coords[p] = (x, y, z)
for q in ref["puntos"]:
    mejor, dmin = None, 1e9
    for p, (x, y, z) in coords.items():
        d = math.sqrt((x - q["x"]) ** 2 + (y - q["y"]) ** 2 + (z - q["z"]) ** 2)
        if d < dmin: dmin, mejor = d, p
    if dmin > 5e-3: continue
    rr = S.Results.JointDispl(mejor, 0)
    if not rr[0]: continue
    u = (rr[6][0], rr[7][0], rr[8][0]); umax = max(umax, math.sqrt(sum(v * v for v in u)))
    casados += 1
    peor = max(peor, max(abs(u[k] - q["u"][k]) for k in range(3)) / ref["umax"] * 100)
out.update({"casados": casados, "de": len(ref["puntos"]), "umax_mm": round(umax * 1000, 4), "hekatan_umax_mm": round(ref["umax"] * 1000, 4),
            "peor_nudo_pct": round(peor, 5)})
print(json.dumps(out, indent=1, ensure_ascii=False), flush=True)
json.dump(out, open(os.path.join(D, NOM + "_%s.json" % motor), "w"), indent=1, ensure_ascii=False)
