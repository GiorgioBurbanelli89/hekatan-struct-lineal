# -*- coding: utf-8 -*-
"""Careo de la carpeta de entrega (bóveda): SAP2000 = juez, luego ETABS, luego Hekatan.

    python cli/comparar_modal_entrega.py cli/shots/boveda_entrega

Lee sap_modal80.json, etabs_modal80.json, hekatan_modal80.json (modal) y
sap_estatico.txt, etabs_estatico.txt, hekatan_estatico.json (desplazamientos),
y escribe COMPARACION.txt en la misma carpeta.
"""
import json, os, sys

D = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "cli/shots/boveda_entrega")
out = []
p = lambda s="": (print(s), out.append(s))

S = json.load(open(os.path.join(D, "sap_modal80.json")))
E = json.load(open(os.path.join(D, "etabs_modal80.json")))
Hj = json.load(open(os.path.join(D, "hekatan_modal80.json")))
H = [dict(modo=i + 1, T=Hj["periods"][i], UX=m[0], UY=m[1], UZ=m[2]) for i, m in enumerate(Hj["massParticipation"])]
n = min(len(S), len(E), len(H))


def al90(L, k):
    a = 0
    for r in L[:n]:
        a += r[k]
        if a >= 0.9:
            return r["modo"]
    return None


p("MODAL — bóveda de la capilla, masa 3D sin agrupar, %d modos (SAP2000 = juez)" % n)
p("modo |  T SAP2000 |  T ETABS  | T Hekatan | ETABS vs SAP | Hekatan vs SAP")
peorE = peorH = 0.0
for i in range(n):
    ts, te, th = S[i]["T"], E[i]["T"], H[i]["T"]
    de, dh = (te - ts) / ts * 100, (th - ts) / ts * 100
    peorE, peorH = max(peorE, abs(de)), max(peorH, abs(dh))
    if i < 12 or i % 10 == 9 or i == n - 1:
        p(" %3d | %.6f | %.6f | %.6f |  %+8.3f %%  |  %+8.3f %%" % (i + 1, ts, te, th, de, dh))
p("peor periodo: ETABS %.3f %% · Hekatan %.3f %%" % (peorE, peorH))
for k in ("UX", "UY", "UZ"):
    p("Σ%s  SAP %.4f · ETABS %.4f · Hekatan %.4f | 90 %% en modo: SAP %s · ETABS %s · Hekatan %s" % (
        k, sum(r[k] for r in S[:n]), sum(r[k] for r in E[:n]), sum(r[k] for r in H[:n]),
        al90(S, k), al90(E, k), al90(H, k)))


def leer_txt(f, caso):
    xyz, disp, sec = {}, {}, None
    for l in open(f, encoding="utf-8", errors="replace"):
        if l.startswith("=== JOINT COORDINATES"): sec = "c"; continue
        if l.startswith("=== JOINT DISPLACEMENTS"): sec = "d"; continue
        if l.startswith("==="): sec = None; continue
        t = l.split()
        if sec == "c" and len(t) == 4 and t[0].isdigit(): xyz[t[0]] = tuple(float(v) for v in t[1:4])
        elif sec == "d" and len(t) >= 8 and t[1].lower() == caso: disp[t[0]] = [float(v) for v in t[2:8]]
    return {xyz[j]: disp[j] for j in disp if j in xyz}


def casar(ref, otro):
    res = {}
    for p0, v in ref.items():
        q = next((k for k in otro if all(abs(a - b) < 2e-3 for a, b in zip(p0, k))), None)
        if q is not None: res[p0] = (v, otro[q])
    return res


d = json.load(open(os.path.join(D, "hekatan_estatico.json")))
Hs = {tuple(d["nodes"][int(k)]): v for k, v in d["deformations"].items()}
Ss = leer_txt(os.path.join(D, "sap_estatico.txt"), "dead")
Es = leer_txt(os.path.join(D, "etabs_estatico.txt"), "dead")
p()
p("ESTÁTICO (Dead) — uz nudo a nudo, %% del máximo de SAP2000")
mx = max(abs(v[2]) for v in Ss.values())
for nom, L in (("ETABS", Es), ("Hekatan", Hs)):
    par = casar(Ss, L)
    dif = sorted(abs(a[2] - b[2]) / mx * 100 for a, b in par.values())
    p("  %-8s nudos casados %d/%d · uz máx %.3f mm (SAP %.3f) · peor %.4f %% · media %.4f %%" % (
        nom, len(par), len(Ss), max(abs(b[2]) for a, b in par.values()) * 1000, mx * 1000, dif[-1], sum(dif) / len(dif)))

open(os.path.join(D, "COMPARACION.txt"), "w", encoding="utf-8").write("\n".join(out) + "\n")
print("\n-> " + os.path.join(D, "COMPARACION.txt"))
