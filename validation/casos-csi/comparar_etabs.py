"""Tabla ETABS (2º juez) contra SAP2000 (juez) — y por tanto contra Struct, que ya es = SAP2000 en esos casos.
    python validation/casos-csi/comparar_etabs.py"""
import json, os
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(AQUI, "..", ".."))
E = json.load(open(os.path.join(AQUI, "etabs_juez.json")))


def par(fs, ref):
    return min(fs, key=lambda f: abs(f / ref - 1)) if fs else float("nan")


print("tipos de caso en ETABS:", E.get("tipos", {}).get("tablas"))
S = json.load(open(os.path.join(RAIZ, "validation", "pandeo", "sap_pandeo.json")))
for k, v in E.get("pandeo", {}).items():
    s = S[k]["factores"]; peor = max(abs(par(v["factores"], f) / f - 1) * 100 for f in s)
    print("pandeo barras %-12s ETABS λ1 %.6f  SAP %.6f  peor %.5f %%  (%d modos)" % (k, v["factores"][0], s[0], peor, len(s)))
S = json.load(open(os.path.join(RAIZ, "validation", "pandeo_cascara", "sap_pandeo_cascara.json")))
for k, v in E.get("pandeo_cascara", {}).items():
    s = [f for f in S[k]["factores"] if abs(f) > 0.5]
    fuera = [abs(par(v["factores"], f) / f - 1) * 100 for f in s if abs(f) < 1000]
    plano = [abs(par(v["factores"], f) / f - 1) * 100 for f in s if abs(f) >= 1000]
    print("pandeo cáscara %-12s ETABS λ1 %.6f  SAP %.6f  fuera del plano %.5f %%  en el plano %s" % (
        k, v["factores"][0], S[k]["factores"][0], max(fuera) if fuera else 0, ("%.5f %%" % max(plano)) if plano else "—"))
if "hiperestatico" in E:
    S = json.load(open(os.path.join(AQUI, "sap_hiperestatico.json")))["casos"]
    for c in ["PT", "HYP"]:
        e, s = E["hiperestatico"][c], S[c]
        rmax = max(abs(x) for v in s["reac"].values() for x in v) or 1
        dr = max(abs(a - b) for q in s["reac"] for a, b in zip(e["reac"][q], s["reac"][q])) / rmax * 100
        mmax = max(abs(x) for f in s["frame"].values() for x in f["M3"]) or 1
        dm = max(abs(a - b) for f in s["frame"] for a, b in zip(e["frame"][f]["M3"], s["frame"][f]["M3"])) / mmax * 100
        umax = max(abs(v[2]) for v in s["disp"].values()) or 1
        du = max(abs(e["disp"][q][2] - s["disp"][q][2]) for q in s["disp"]) / umax * 100
        print("hyperstatic %-3s reacciones %.5f %%  M3 %.5f %%  Uz %.5f %% (del máximo)" % (c, dr, dm, du))
