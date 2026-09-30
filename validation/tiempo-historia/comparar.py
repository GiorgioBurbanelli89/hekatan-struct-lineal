import json, sys
met = sys.argv[1]
S = json.load(open(f"sap_{met}.json"))["th"]; H = json.load(open(f"struct_{met}.json"))
print("periodos SAP", [round(x, 4) for x in S["periodos"][:5]], "| Struct", [round(x, 4) for x in H["periodos"][:5]])
for n, ser in S["nudos"].items():
    h = H["nudos"][n]
    for c, nom in ((0, "ux"), (1, "uy"), (5, "rz")):
        s = [x[c] for x in ser]; hh = [x[c] for x in h]
        mx = max(abs(x) for x in s) or 1
        d = max(abs(a - b) for a, b in zip(hh, s)) / mx * 100
        print(f"  nudo {n} {nom}: max SAP {mx:.4e}, Struct {max(abs(x) for x in hh):.4e}, peor paso {d:.2e} % ({len(s)} pasos)")
for c, nom in ((0, "FX"), (4, "MY")):
    s = [b[c] for b in S["base"]]; hh = [b[c] for b in H["base"]]
    mx = max(abs(x) for x in s); d = max(abs(a - b) for a, b in zip(hh, s)) / mx * 100
    print(f"  base {nom}: max SAP {mx:.2f}, Struct {max(abs(x) for x in hh):.2f}, peor paso {d:.2e} %")
