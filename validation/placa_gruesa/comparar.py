# Tabla Struct vs SAP2000 (misma malla) Thick y Thin, por malla.
import json, os, glob
AQ = os.path.dirname(os.path.abspath(__file__))
def struct(base, form):
    caso, n = base.rsplit("_", 1)
    caso = caso.replace("safeN", "safe")
    f = os.path.join(AQ, "_%s_%s_%s.json" % (caso, n, form))
    if not os.path.exists(f): return None
    return json.load(open(f))["w"]
filas = []
for f in sorted(glob.glob(os.path.join(AQ, "res_sap", "*_thick.json"))):
    if os.path.basename(f).startswith(("safe_", "pandeo")): continue
    S = json.load(open(f)); base = S["dump"]
    D = json.load(open(os.path.join(AQ, "dumps", base + ".json")))
    Hk = [D["deformations"].get(str(i), [0] * 6)[2] for i in range(len(D["nodes"]))]
    out = [base, len(D["nodes"])]
    for form, H in (("thick", Hk), ("thin", struct(base, "thin"))):
        g = os.path.join(AQ, "res_sap", "%s_%s.json" % (base, form))
        if not os.path.exists(g) or H is None: out += ["-", "-", "-"]; continue
        Sw = [u[2] if u else 0 for u in json.load(open(g))["u"]]
        sm = max(abs(v) for v in Sw)
        if sm == 0: out += ["vacio", "-", "-"]; continue
        peor = max(abs(a - b) for a, b in zip(H, Sw)) / sm * 100
        imx = max(range(len(Sw)), key=lambda i: abs(Sw[i]))
        out += ["%.4e" % Sw[imx], "%.4e" % H[imx], "%.3f" % peor]
    filas.append(out)
print("%-16s %5s | %-11s %-11s %7s | %-11s %-11s %7s" % ("modelo", "nud", "SAP thick", "Str thick", "peor%", "SAP thin", "Str thin", "peor%"))
for r in filas: print("%-16s %5d | %-11s %-11s %7s | %-11s %-11s %7s" % tuple(r))
