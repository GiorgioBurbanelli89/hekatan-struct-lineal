"""Compara un JSON de cli/sap2000_e2k.py con el _ref.json de ETABS: desplazamientos (rms rel % del max por eje) y reacciones.
Uso: python cli/sap2000_vs_etabs.py sap.json ref.json"""
import json, sys, math
s = json.load(open(sys.argv[1])); e = json.load(open(sys.argv[2]))
for c in ("Dead", "Live", "LATX", "LATY"):
    if c not in s["JointDispl"] or c not in e.get("JointDispl", {}): continue
    out = []
    for k, nm in enumerate("xyz"):
        pairs = [(s["JointDispl"][c][p][k], e["JointDispl"][c][p][k]) for p in e["JointDispl"][c] if p in s["JointDispl"][c]]
        mx = max(abs(b) for a, b in pairs) or 1e-30
        rms = math.sqrt(sum((a - b) ** 2 for a, b in pairs) / len(pairs))
        out.append(f"U{nm} rms {100*rms/mx:6.3f}% (max ETABS {mx*1000:.4f} mm)")
    rs = [sum(v[i] for v in s["JointReact"][c].values()) for i in range(3)]
    re_ = [sum(v[i] for v in e["JointReact"][c].values()) for i in range(3)] if c in e.get("JointReact", {}) else [0]*3
    print(c, " | ".join(out), "| SumR SAP", [round(x, 3) for x in rs], "ETABS", [round(x, 3) for x in re_])
