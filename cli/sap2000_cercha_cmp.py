"""Recorte de cercha: SAP2000 (cli/sap2000_e2k.py) vs ETABS (_ref.json) por coordenadas. Uso: python cli/sap2000_cercha_cmp.py sap.json ref.json"""
import json, sys, math
s = json.load(open(sys.argv[1])); e = json.load(open(sys.argv[2]))
key = lambda c: tuple(round(v, 3) for v in c)
sp = {key(c): n for n, c in s["pts"].items()}
ep = {n: key(c) for n, c in e["pts"].items()}
for pat in ("Dead", "Live"):
    rows = []
    for en, k in ep.items():
        sn = sp.get(k)
        if sn and sn in s["JointDispl"][pat] and en in e[pat]:
            rows.append((s["JointDispl"][pat][sn][:3], e[pat][en][:3]))
    out = []
    for i, nm in enumerate("xyz"):
        mx = max(abs(b[i]) for a, b in rows) or 1e-30
        rms = math.sqrt(sum((a[i] - b[i]) ** 2 for a, b in rows) / len(rows))
        out.append(f"U{nm} {100*rms/mx:.2f}% (max {mx*1000:.3f} mm)")
    print(pat, f"{len(rows)} nudos:", " | ".join(out))
# barras
eb = {}
for k, b in e["barras"].items():
    eb[frozenset((key(b["p1"]), key(b["p2"])))] = b
sb = {}
for k, b in s["barras"].items():
    sb[frozenset((key(b["p1"]), key(b["p2"])))] = b
res = {}
for pat in ("Dead", "Live"):
    d = []
    for kk, b in eb.items():
        if kk in sb and pat in sb[kk] and pat in b:
            pe = sum(b[pat]["P"]) / len(b[pat]["P"]); P = sb[kk][pat]["P"]; ps = sum(P) / len(P)
            d.append((b, pe, ps))
    rms = math.sqrt(sum((ps - pe) ** 2 for _, pe, ps in d) / len(d)); pk = max(abs(pe) for _, pe, _ in d)
    print(pat, f"axil medio: {len(d)} barras, rms {rms:.4f} kN, pico ETABS {pk:.3f} kN ({100*rms/pk:.2f}%)")
    res[pat] = d
# cordon superior y=29
print("Cordon superior (y=29, z>=11.9, tubo 50), axil medio kN, + traccion: x0-x1  ETABS  SAP2000")
d = [(b, pe, ps) for b, pe, ps in res["Dead"] if abs(b["p1"][1] - 29) < 1e-6 and abs(b["p2"][1] - 29) < 1e-6 and b["p1"][0] != b["p2"][0] and "50" in b["sec"] and min(b["p1"][2], b["p2"][2]) > 11.5]
for b, pe, ps in sorted(d, key=lambda t: min(t[0]["p1"][0], t[0]["p2"][0])):
    print(f"  {min(b['p1'][0], b['p2'][0]):.1f}-{max(b['p1'][0], b['p2'][0]):.1f} z{b['p1'][2]:.2f}  {pe:7.3f}  {ps:7.3f}")
json.dump({"cordon_sup_Dead": [[min(b['p1'][0], b['p2'][0]), pe, ps] for b, pe, ps in d]}, open(sys.argv[1].replace(".json", "_cordon.json"), "w"))
