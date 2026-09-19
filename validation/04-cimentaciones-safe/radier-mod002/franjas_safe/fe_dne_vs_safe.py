import json, csv, collections, math
B = r"C:/Users/j-b-j/Documents/Hekatan Calc 1.0.0/_integ/"
S = B + "validation/04-cimentaciones-safe/radier-mod002/franjas_safe/"
co = json.load(open(S + "coords_mm.json"))["points_mm"]
m = json.load(open(S + "malla.json"))
fe = json.load(open(B + "tests/datos/radier_fe_safe.json"))["elems"]
app = json.load(open(B + "cli/shots/franjas_dne/armado_franjas_app.json", encoding="utf-8"))
els = m["elements"]
print("malla elem ej:", str(list(els.items())[:1] if isinstance(els, dict) else els[:1])[:300])
xy = lambda p: (co[p][0] / 1000, co[p][1] / 1000)
# 1) máximos de SAFE (DISEÑO, sin mínimo) por dir/cara, mm²/mm -> cm²/m (×10)
for k, nom in [("top1", "X sup"), ("bot1", "X inf"), ("top2", "Y sup"), ("bot2", "Y inf")]:
    best = max(((v, e, j) for e, d in fe.items() for j, v in enumerate(d[k])), key=lambda t: t[0])
    v, e, j = best; p = els[e]["pts"][j]
    h = [r for r in app["filasFE"] if r[0].startswith(nom[0]) and r[1] == ("superior" if "sup" in nom else "inferior")][0]
    print(f"{nom}: SAFE {v*10:.2f} cm²/m en ({xy(p)[0]:.2f}; {xy(p)[1]:.3f}) elem {e} | Hekatan {h[2]} en {h[3]}  dif {float(h[2])/(v*10)-1:+.1%}")
# 2) fuerzas en los nudos: SAFE DISEÑO = 1.2D+1.2DNE+1.6L (kgf·mm/mm -> kN·m/m ; kgf/mm -> kN/m)
fac = {"Dead": 1.2, "DNE": 1.2, "Live": 1.6}
acc = collections.defaultdict(lambda: [0.0] * 6)
for r in csv.DictReader(open(S + "shell_forces.csv"), delimiter=";"):
    if r["LoadCase"] in fac:
        a = acc[(r["Elm"], r["PointElm"])]
        for i, c in enumerate(["M11", "M22", "M12", "F11", "F22", "F12"]):
            a[i] += fac[r["LoadCase"]] * float(r[c]) * 0.00980665   # shell_forces.csv en kgf, m
for P in app["fuerzas"]:
    print(f"\nNudo ({P['x']}; {P['y']})   M11 M22 M12 [kN·m/m]  F11 F22 F12 [kN/m]")
    for (e, p), a in sorted(acc.items()):
        if p in co and math.hypot(xy(p)[0] - P["x"], xy(p)[1] - P["y"]) < 0.01:
            print(f"  SAFE    elm {e:7s}", " ".join(f"{v:9.2f}" for v in a))
    for o in P["out"]:
        print(f"  Hekatan el  {o['el']:5d}", " ".join(f"{v:9.2f}" for v in o["v"]))
