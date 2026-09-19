"""Junta en res/verificacion_cruzada.json los valores clave del corregido medidos en cada programa."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from resultados_corregido import k_nodal
A = os.path.dirname(os.path.abspath(__file__)); RS = os.path.join(A, "res"); G = 9.80665; KS = 400000 * 0.00980665
out = {}
H = {c: json.load(open(os.path.join(RS, "conf_%s.json" % c))) for c in ("SERVICIO", "DISENO")}
k = k_nodal(H["SERVICIO"])
for prog, f in (("sap", "sap_import.json"), ("safe", "safe_import.json")):
    s = json.load(open(os.path.join(RS, f))); out[prog] = {}
    N = H["SERVICIO"]["nodes"]; idx = {(round(n[0], 3), round(n[1], 3)): i for i, n in enumerate(N)}
    for c in ("SERVICIO", "DISENO"):
        U = s["casos"][c]["U"]
        if prog == "sap": m = {int(j) - 1: v for j, v in U.items()}
        else: m = {idx[(round(v[6], 3), round(v[7], 3))]: v for v in U.values()}
        out[prog][c] = dict(qmax=max(-KS * m[n][2] for n in k) / G, uz=-min(v[2] for v in m.values()) * 1000, R=s["casos"][c]["FZ"] / G)
out["app"] = {}
for c in ("SERVICIO", "DISENO"):
    a = json.load(open(os.path.join(RS, "app_publicada_%s.json" % c)))["motor_pagina"]
    out["app"][c] = dict(qmax=-a["pmin_kN_m2"] / G, uz=-a["uz_min_m"] * 1000)
r = json.load(open(os.path.join(RS, "resultados_corregido.json")))
out["hek"] = {c: dict(qmax=r[c]["pmax_tm2"], uz=r[c]["uz_max_mm"], R=r[c]["reaccion_t"]) for c in ("SERVICIO", "DISENO")}
F = r"C:/Users/j-b-j/Desktop/ENTREGA RADIER MOD_002/verificacion_SAFE20/resultados.txt"
sec = None; q = {}; uz = {}; R = {}
for ln in open(F, encoding="utf-8", errors="replace"):
    ln = ln.strip()
    if ln.startswith("##"): sec = ln.split("|")[0]; continue
    p = ln.split("|"); c = p[3] if sec != "##Base Reactions" else p[0]; c = "DISENO" if c.startswith("DISE") else c
    if sec == "##Base Reactions": R[c] = float(p[4]) / 1000
    elif sec == "##Soil Pressures": q[c] = max(q.get(c, 0), -float(p[5]) / 1000)
    elif sec == "##Joint Displacements": uz[c] = max(uz.get(c, 0), -float(p[7]) * 1000)
out["safe_ing"] = {c: dict(qmax=q[c], uz=uz[c], R=R[c]) for c in ("SERVICIO", "DISENO")}
D = H["SERVICIO"]; sw = 0
for e, el in enumerate(D["elements"]):
    if len(el) != 4 or str(e) in D["shellModifiers"]: continue
    P = [D["nodes"][n] for n in el]; Ar = abs(sum(P[i][0] * P[(i + 1) % 4][1] - P[(i + 1) % 4][0] * P[i][1] for i in range(4)) / 2)
    sw += Ar * D["thicknesses"][str(e)] * 2.5493
out["pp_losa_t"] = sw; out["pp_vigas_t"] = 0.36 * 2.5493 * 32.7250014; out["pp_total_t"] = sw + out["pp_vigas_t"]
out["carga_vigas_t"] = 1.44 * 32.7250014
json.dump(out, open(os.path.join(RS, "verificacion_cruzada.json"), "w"), indent=1)
for kk, v in out.items(): print(kk, v)
