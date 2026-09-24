# -*- coding: utf-8 -*-
"""Genera tests/datos/radier_franjas_safe.json desde lo que SAFE 20.3 escribio por OAPI
(validation/04-cimentaciones-safe/radier-mod002/franjas_safe/, script safe_extract.py sobre una
COPIA de MOD_002_CORREGIDO_diseno.FDB, 18-sep-2026). Unidades del fichero: kgf y mm (geometria
exacta de SAFE en mm: con metros los empates en bordes caen distinto)."""
import csv, json, os, re
D = os.path.join(os.path.dirname(__file__), "..", "..", "validation", "04-cimentaciones-safe", "radier-mod002", "franjas_safe")
SF = r"C:\Users\j-b-j\Desktop\ENTREGA RADIER MOD_002\diseno_franjas\MOD_002_CORREGIDO_diseno.$sf"
m = json.load(open(os.path.join(D, "malla.json"))); C = json.load(open(os.path.join(D, "coords_mm.json")))
H = {"LCIM 40cm": 400.0, "LCIM 60cm": 600.0, "PEDESTAL": 200.0}
F = {}
for r in csv.DictReader(open(os.path.join(D, "shell_forces.csv"), encoding="utf-8"), delimiter=";"):
    d = F.setdefault(r["Elm"], {}).setdefault(r["LoadCase"], {})
    d[r["PointElm"]] = [float(r[c]) / 1000 if c in ("F11", "F22", "F12", "V13", "V23") else float(r[c])
                        for c in ("F11", "F22", "F12", "M11", "M22", "M12", "V13", "V23")]
elems = []
for e, d in m["elements"].items():
    elems.append(dict(id=e, prop=d["prop"], h=H[d["prop"]], design=d["prop"] != "PEDESTAL", footing=True,
                      xy=[C["points_mm"][p][:2] for p in d["pts"]],
                      forces={c: [F[e][c][p] for p in d["pts"]] for c in ("Dead", "Live", "DNE")}))
strips = []
for r in csv.DictReader(open(os.path.join(D, "T_Strip_Object_Connectivity.csv"), encoding="utf-8"), delimiter=";"):
    strips.append(dict(name=r["Name"], layer=r["Layer"], start=C["pointobj_mm"][r["Strip Start Point"]][:2], end=C["pointobj_mm"][r["Segment End Point"]][:2],
                       wStartLeft=float(r["Start Width Left"])*1000, wStartRight=float(r["Start Width Right"])*1000,
                       wEndLeft=float(r["End Width Left"])*1000, wEndRight=float(r["End Width Right"])*1000))
sf = [dict(strip=r["Strip"], station=float(r["Station"])*1000, loc=r["Location"], case=r["Output Case"],
           P=float(r["P"]), V2=float(r["V2"]), T=float(r["T"])*1000, M3=float(r["M3"])*1000)
      for r in csv.DictReader(open(os.path.join(D, "T_Strip_Forces.csv"), encoding="utf-8"), delimiter=";") if r["Output Case"] in ("Dead", "Live", "DNE")]
ds = [dict(strip=r["Strip"], station=float(r["Station"])*1000, width=float(r["ConcWidth"])*1000,
           MTop=float(r["FTopMoment"])*1000, AsTop=float(r["FTopArea"])*1e6, AminTop=float(r["FTopAMin"])*1e6,
           MBot=float(r["FBotMoment"])*1000, AsBot=float(r["FBotArea"])*1e6, AminBot=float(r["FBotAMin"])*1e6,
           V=float(r["VForce"]), Av_s=float(r["VArea"])*1e6)
      for r in csv.DictReader(open(os.path.join(D, "design_stations.csv"), encoding="utf-8"), delimiter=";")]
spans = [dict(strip=r["StripObject"], name=r["SpanID"], start=float(r["StartDist"])*1000, end=(float(r["StartDist"])+float(r["SpanLength"]))*1000)
         for r in csv.DictReader(open(os.path.join(D, "Concrete_Slab_Design_Summary_-_Span_Definition_Data.csv"), encoding="utf-8"), delimiter=";")]
ac = [dict(strip=r["Strip"], span=r["SpanID"], loc=r["Location"], MTop=float(r["FTopMoment"])*1000, AsTop=float(r["FTopArea"])*1e6,
           MBot=float(r["FBotMoment"])*1000, AsBot=float(r["FBotArea"])*1e6, V=float(r["VForce"]), Av_s=float(r["VArea"])*1e6)
      for r in csv.DictReader(open(os.path.join(D, "acero_por_franja_SAFE.csv"), encoding="utf-8"), delimiter=";")]
prefs = dict(code="ACI 318-19", fc=20.9999607374374/9.80665, fy=411.879308383474/9.80665, coverTop=15, coverBot=15, barSize=18,
             innerLayer="B", mergeTol=1.0, N=9.80665, M=0.001)
out = dict(fuente="SAFE 20.3, MOD_002_CORREGIDO_diseno.FDB (copia), combo DISENO = 1.2 Dead + 1.2 DNE + 1.6 Live; kgf-mm",
           combo={"Dead": 1.2, "DNE": 1.2, "Live": 1.6}, prefs=prefs, elems=elems, strips=strips,
           stripForces=sf, stations=ds, spans=spans, acero=ac)
json.dump(out, open(os.path.join(os.path.dirname(__file__), "radier_franjas_safe.json"), "w"))
print(len(elems), len(strips), len(sf), len(ds), len(spans), len(ac))
