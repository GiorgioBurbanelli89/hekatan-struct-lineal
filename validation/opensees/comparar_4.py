# -*- coding: utf-8 -*-
"""Tabla de los cuatro: Hekatan Struct, SAP2000, ETABS y OpenSees sobre el MISMO modelo.

    python validation/opensees/comparar_4.py <carpeta>

Espera en la carpeta: dump.json, hekatan_modal12.json, hek_fuerzas_orig.json,
sap2000.json, etabs.json, opensees.json. Todo lo que no encuentre lo salta.
"""
import json, os, sys
C = sys.argv[1]
L = lambda f: json.load(open(os.path.join(C, f))) if os.path.exists(os.path.join(C, f)) else None
D, H, HF = L("dump.json"), L("hekatan_modal12.json"), L("hek_fuerzas_orig.json")
SP, ET, OS_ = L("sap2000.json"), L("etabs.json"), L("opensees.json")

def periodos(x, prog):
    if not x: return None
    if prog == "os": return x.get("periodos")
    return (x.get("modal") or {}).get("periodos")

print("=" * 78); print("PERIODOS (s)"); print("=" * 78)
hp = H["periods"]
cab = "modo |  Hekatan "
for nm, x, p in (("SAP2000", SP, "csi"), ("ETABS", ET, "csi"), ("OpenSees", OS_, "os")):
    if periodos(x, p): cab += "| %-9s dif%% " % nm
print(cab)
for i, h in enumerate(hp):
    fila = "%4d | %8.6f " % (i + 1, h)
    for nm, x, p in (("SAP2000", SP, "csi"), ("ETABS", ET, "csi"), ("OpenSees", OS_, "os")):
        v = periodos(x, p)
        if v and i < len(v): fila += "| %8.6f %+6.2f " % (v[i], 100 * (v[i] / h - 1))
    print(fila)

print("\n" + "=" * 78); print("DESPLAZAMIENTOS · peor nudo, % del maximo"); print("=" * 78)
hd = D["deformations"]; umax = max(abs(c) for v in hd.values() for c in v[:3])
for nm, x in (("SAP2000", SP), ("ETABS", ET)):
    if not x: continue
    caso = list(x["casos"])[0]; peor = 0
    for n in x["casos"][caso]["nudos"]:
        hu = hd.get(str(n["i"]))
        if not hu: continue
        for c in range(3): peor = max(peor, abs(n["u"][c] - hu[c]) / umax * 100)
    print("  %-9s %8.4f %%" % (nm, peor))
if OS_:
    od = OS_["desp"]; peor = 0
    for k, v in hd.items():
        o = od.get(k)
        if not o: continue
        for c in range(3): peor = max(peor, abs(v[c] - o[c]) / umax * 100)
    print("  %-9s %8.4f %%" % ("OpenSees", peor))
print("  (u_max = %.4e m)" % umax)

if HF:
    print("\n" + "=" * 78); print("FUERZAS DE BARRA · peor, % del maximo de cada campo"); print("=" * 78)
    pares = [("N", "P"), ("V2", "V2"), ("V3", "V3"), ("T", "T"), ("M2", "M2"), ("M3", "M3")]
    fuentes = []
    for nm, x in (("SAP2000", SP), ("ETABS", ET)):
        if x:
            caso = list(x["casos"])[0]
            fuentes.append((nm, x["casos"][caso].get("fuerzas_barra") or {}, "csi"))
    if OS_ and OS_.get("fuerzas_barra"): fuentes.append(("OpenSees", OS_["fuerzas_barra"], "os"))
    print("campo |  maximo  | " + " | ".join("%-9s" % n for n, _, _ in fuentes))
    IDX = {"N": (0, 6), "V2": (1, 7), "V3": (2, 8), "T": (3, 9), "M2": (4, 10), "M3": (5, 11)}
    for hc, sc in pares:
        mx = max(max(abs(v[hc][0]), abs(v[hc][1])) for v in HF["barras"].values() if hc in v) or 1
        fila = "%-5s | %8.4f | " % (hc, mx)
        for nm, fb, tipo in fuentes:
            peor = 0
            for k, v in HF["barras"].items():
                f = fb.get(k)
                if not f or hc not in v: continue
                for idx in (0, 1):
                    o = f[sc][idx] if tipo == "csi" else f[IDX[hc][idx]]
                    peor = max(peor, abs(abs(v[hc][idx]) - abs(o)) / mx * 100)
            fila += "%8.3f %% | " % peor
        print(fila)
