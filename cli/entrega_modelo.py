# -*- coding: utf-8 -*-
"""
ENTREGA DE UN MODELO: Hekatan Struct contra SAP2000 (juez) y ETABS, todo en una carpeta.

    python cli/entrega_modelo.py modelo.heks CARPETA [nModos=12]

Hace, por este orden:
  1. Hekatan: estático (dump_heks) y modal por el camino de la APP (cliModeler.runModal, WASM, masa 3D).
  2. heks_a_csi: .e2k y .s2k del MISMO modelo; copia del .e2k con masa 3D sin agrupar por pisos.
  3. SAP2000 (juez): abre el .s2k, caso MODAL con nModos, guarda .sdb, analiza, vuelca estático y modal.
  4. ETABS: abre el .e2k masa 3D, nModos, guarda .EDB, analiza, vuelca estático y modal.
  5. Comparación nudo a nudo (u de los 3 GDL de traslación) y modal, con SAP2000 de juez -> COMPARACION.txt y resumen.json.
ETABS y SAP2000 quedan ABIERTOS con el modelo (no ApplicationExit).
"""
import os, sys, json, math, shutil, subprocess

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, os.path.join(os.path.dirname(RAIZ), "csi-cli", "hekatan-csi-cli"))
import csi_cli as c  # noqa: E402

heks = os.path.abspath(sys.argv[1]); D = os.path.abspath(sys.argv[2]); NM = int(sys.argv[3]) if len(sys.argv) > 3 else 12
os.makedirs(D, exist_ok=True)
base = os.path.splitext(os.path.basename(heks))[0]
out = []
def p(s=""):
    print(s); out.append(s)

def node(*a):
    r = subprocess.run(["node", *a], cwd=RAIZ, capture_output=True, text=True, encoding="utf-8")
    if r.returncode: print(r.stdout[-800:], r.stderr[-800:])
    return r.stdout

# ── 1. Hekatan ──
shutil.copy2(heks, os.path.join(D, base + ".heks"))
node("tests/lib/dump_heks.mjs", heks, os.path.join(D, "hekatan_estatico.json"))
node("cli/_modal_wasm_entrega.mjs", heks, os.path.join(D, "hekatan_modal.json"), str(NM))

# ── 2. e2k / s2k ──
node("cli/heks_a_csi.mjs", heks, os.path.join(D, base))
e2k = os.path.join(D, base + ".e2k"); s2k = os.path.join(D, base + ".s2k")
txt = open(e2k, encoding="utf-8").read()
txt3 = txt.replace('INCLUDEVERTICALMASS "No"', 'INCLUDEVERTICALMASS "Yes"').replace('LUMPATSTORIES "Yes"', 'LUMPATSTORIES "No"')
e2k3 = os.path.join(D, base + "_masa3d.e2k"); open(e2k3, "w", encoding="utf-8").write(txt3)

def modal(S, caso):
    S.Results.Setup.DeselectAllCasesAndCombosForOutput(); S.Results.Setup.SetCaseSelectedForOutput(caso)
    m = S.Results.ModalParticipatingMassRatios()
    return [dict(modo=i + 1, T=m[4][i], UX=m[5][i], UY=m[6][i], UZ=m[7][i]) for i in range(m[0])]

# ── 3. SAP2000 ──
_, P, _ = c.start_engine("sap", 6, True)
c.load_model_from_file(P, s2k, 6)
P.LoadCases.ModalEigen.SetCase("MODAL"); P.LoadCases.ModalEigen.SetNumberModes("MODAL", NM, 1)
P.File.Save(os.path.join(D, base + "_SAP2000.sdb"))
rs = P.Analyze.RunAnalysis(); P.SetPresentUnits(6)
p("SAP2000: RunAnalysis %s · estado %s" % (rs, P.Analyze.GetCaseStatus()))
json.dump(modal(P, "MODAL"), open(os.path.join(D, "sap_modal.json"), "w"), indent=1)
open(os.path.join(D, "sap_estatico.txt"), "w", encoding="utf-8").write(c.dump_results(P, c.select_output_cases(P, ["DEAD"])))
try: P.View.RefreshView(0, False)
except Exception: pass

# ── 4. ETABS ──
_, S, _ = c.start_engine("etabs", 6, True)
c.load_model_from_file(S, e2k3, 6)
S.LoadCases.ModalEigen.SetNumberModes("Modal", NM, 1)
# ETABS pone BRAZOS RÍGIDOS automáticos al importar (invisibles en el e2k) y no pesa el
# tramo de viga dentro de la columna: SAP2000 (juez) y Hekatan no los tienen. Se anulan,
# como en plantillas_etabs.py. HK_ETABS_OFFSETS=1 los deja (el ETABS de fábrica).
if os.environ.get("HK_ETABS_OFFSETS", "0") != "1":
    nf, nombres, _r = S.FrameObj.GetNameList()
    for nm in nombres:
        S.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
    p("ETABS: brazos rígidos automáticos anulados en %d barras" % nf)
if os.environ.get("HK_ETABS_MESH", "") == "NONE":
    na, areas, _r = S.AreaObj.GetNameList()
    for nm in areas:
        try: S.AreaObj.SetAutoMesh(nm, 0, 1, 1, False, False, False, 0.0, 0.0, False, False, False, 0.0, True, "ALL")
        except Exception: pass
    p("ETABS: sin automallado en %d áreas" % na)
S.File.Save(os.path.join(D, base + "_ETABS.EDB"))
re_ = S.Analyze.RunAnalysis(); S.SetPresentUnits(6)
p("ETABS: RunAnalysis %s · estado %s" % (re_, S.Analyze.GetCaseStatus()))
json.dump(modal(S, "Modal"), open(os.path.join(D, "etabs_modal.json"), "w"), indent=1)
open(os.path.join(D, "etabs_estatico.txt"), "w", encoding="utf-8").write(c.dump_results(S, c.select_output_cases(S, ["Dead"])))
try: S.View.RefreshView(0, False)
except Exception: pass

# ── 5. Comparación ──
def leer_txt(f, caso):
    xyz, disp, reac, sec = {}, {}, {}, None
    for l in open(f, encoding="utf-8", errors="replace"):
        if l.startswith("=== JOINT COORDINATES"): sec = "c"; continue
        if l.startswith("=== JOINT DISPLACEMENTS"): sec = "d"; continue
        if l.startswith("=== JOINT REACTIONS"): sec = "r"; continue
        if l.startswith("==="): sec = None; continue
        t = l.split()
        if sec == "c" and len(t) == 4 and t[0].isdigit(): xyz[t[0]] = tuple(float(v) for v in t[1:4])
        elif sec in ("d", "r") and len(t) >= 8 and t[1].lower() == caso:
            (disp if sec == "d" else reac)[t[0]] = [float(v) for v in t[2:8]]
    return {xyz[j]: v for j, v in disp.items() if j in xyz}, {xyz[j]: v for j, v in reac.items() if j in xyz}

def casar(ref, otro):
    idx = {}
    for k in otro: idx.setdefault(tuple(round(v, 2) for v in k), []).append(k)
    res = {}
    for p0, v in ref.items():
        cand = [k for kk in [tuple(round(x, 2) for x in p0)] for k in idx.get(kk, [])]
        cand = cand or list(otro.keys())
        q = next((k for k in cand if all(abs(a - b) < 2e-3 for a, b in zip(p0, k))), None)
        if q is not None: res[p0] = (v, otro[q])
    return res

d = json.load(open(os.path.join(D, "hekatan_estatico.json")))
Hs = {tuple(d["nodes"][int(k)]): v for k, v in d["deformations"].items()}
HR = sum(v[2] for v in d["reactions"].values()); HRx = sum(v[0] for v in d["reactions"].values())
Ss, SR = leer_txt(os.path.join(D, "sap_estatico.txt"), "dead")
Es, ER = leer_txt(os.path.join(D, "etabs_estatico.txt"), "dead")
mag = lambda v: math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
umax = max(mag(v) for v in Ss.values())
res = {"modelo": base, "nudos": len(Hs), "modos": NM}
p("ESTÁTICO — %s · |u| nudo a nudo en %% del máximo de SAP2000 (%.4f mm)" % (base, umax * 1000))
for nom, L, R in (("ETABS", Es, ER), ("Hekatan", Hs, None)):
    par = casar(Ss, L)
    dif = sorted(max(abs(a[k] - b[k]) for k in range(3)) / umax * 100 for a, b in par.values())
    sz = sum(v[2] for v in R.values()) if R is not None else HR
    sx = sum(v[0] for v in R.values()) if R is not None else HRx
    p("  %-8s casados %d/%d · |u|máx %.4f mm · peor %.4f %% · media %.4f %% · ΣRz %.2f kN · ΣRx %.2f kN" % (
        nom, len(par), len(Ss), max(mag(b) for a, b in par.values()) * 1000, dif[-1], sum(dif) / len(dif), sz, sx))
    res["estatico_" + nom] = {"casados": len(par), "peor_pct": dif[-1], "media_pct": sum(dif) / len(dif), "umax_mm": max(mag(b) for a, b in par.values()) * 1000, "SRz": sz, "SRx": sx}
p("  SAP2000  |u|máx %.4f mm · ΣRz %.2f kN · ΣRx %.2f kN" % (umax * 1000, sum(v[2] for v in SR.values()), sum(v[0] for v in SR.values())))
res["estatico_SAP2000"] = {"umax_mm": umax * 1000, "SRz": sum(v[2] for v in SR.values()), "SRx": sum(v[0] for v in SR.values())}

Sm = json.load(open(os.path.join(D, "sap_modal.json"))); Em = json.load(open(os.path.join(D, "etabs_modal.json")))
Hj = json.load(open(os.path.join(D, "hekatan_modal.json")))
Hm = [dict(modo=i + 1, T=Hj["periods"][i], UX=m[0], UY=m[1], UZ=m[2]) for i, m in enumerate(Hj["massParticipation"])]
n = min(len(Sm), len(Em), len(Hm))
p("MODAL — %d modos, masa 3D (SAP2000 = juez)" % n)
p(" modo |  T SAP2000  |   T ETABS   |  T Hekatan  | ETABS    | Hekatan")
for i in range(n):
    ts, te, th = Sm[i]["T"], Em[i]["T"], Hm[i]["T"]
    p("  %3d | %.6f s | %.6f s | %.6f s | %+.3f %% | %+.3f %%" % (i + 1, ts, te, th, (te - ts) / ts * 100, (th - ts) / ts * 100))
# Modos REPETIDOS (mismo periodo, p. ej. edificio simétrico en X e Y): el reparto UX/UY entre
# ellos es arbitrario en cada programa, así que la participación se compara SUMADA por grupo.
grupos, g = [], [0]
for i in range(1, n):
    if abs(Sm[i]["T"] - Sm[g[-1]]["T"]) / Sm[g[-1]]["T"] < 5e-4: g.append(i)
    else: grupos.append(g); g = [i]
grupos.append(g)
rep = [[i + 1 for i in gg] for gg in grupos if len(gg) > 1]
if rep: p("  modos repetidos (mismo periodo en SAP2000): %s — participación comparada por grupo" % rep)
for nom, L in (("ETABS", Em), ("Hekatan", Hm)):
    pt = max(abs(L[i]["T"] - Sm[i]["T"]) / Sm[i]["T"] * 100 for i in range(n))
    pm = max(abs(sum(L[i][k] for i in gg) - sum(Sm[i][k] for i in gg)) for gg in grupos for k in ("UX", "UY", "UZ")) * 100
    p("  %-8s peor periodo %.4f %% · peor participación %.3f puntos" % (nom, pt, pm))
    res["modal_" + nom] = {"peor_T_pct": pt, "peor_part_pts": pm, "T1": L[0]["T"]}
for k in ("UX", "UY", "UZ"):
    p("  Σ%s  SAP %.4f · ETABS %.4f · Hekatan %.4f" % (k, sum(r[k] for r in Sm[:n]), sum(r[k] for r in Em[:n]), sum(r[k] for r in Hm[:n])))
res["modal_SAP2000"] = {"T1": Sm[0]["T"], "sumas": {k: sum(r[k] for r in Sm[:n]) for k in ("UX", "UY", "UZ")}}
open(os.path.join(D, "COMPARACION.txt"), "w", encoding="utf-8").write("\n".join(out) + "\n")
json.dump(res, open(os.path.join(D, "resumen.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("-> " + os.path.join(D, "COMPARACION.txt"))
