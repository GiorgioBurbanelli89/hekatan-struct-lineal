# -*- coding: utf-8 -*-
"""Comprobacion de CORDURA, sobre la medida CRUDA (la flexibilidad F, sin
reconstruir nada).

Mindlin (Thick) anade deformacion por cortante: tiene que ser MAS FLEXIBLE que
Kirchhoff (Thin), nunca mas rigido. Si la F medida del Thick sale mas PEQUENA
que la del Thin, la medida esta mal y todo lo que se deduzca de ella tambien.
"""
import json, os
import numpy as np
GAL = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\galpon-bodega-electoral"

for arch in ["flex12.json", "flex12_sap.json", "flex12_thin.json", "flex12_t.json"]:
    p = os.path.join(GAL, arch)
    if not os.path.exists(p): continue
    d = json.load(open(p, encoding="utf-8"))
    print("\n=== %s ===" % arch)
    print(" %-16s %-5s %5s %5s %14s %14s" %
          ("caso","tipo","t","nu","diag(F) media","traza(F)"))
    for k,v in d.items():
        F = np.array(v["F"])
        print(" %-16s %-5s %5.2f %5.2f %14.6g %14.6g" %
              (k, "thin" if v["tipo"]==1 else "thick", v["t"], v["nu"],
               np.mean(np.diag(F)), np.trace(F)))

print("\n=== la pareja que decide: MISMO t, MISMO nu, thin contra thick ===")
d = json.load(open(os.path.join(GAL,"flex12.json"), encoding="utf-8"))
a, b = d["cuad_nu20"], d["cuad_nu20_thin"]
Fa, Fb = np.array(a["F"]), np.array(b["F"])
print("  thick  t=%.2f nu=%.2f   diag = %s" % (a["t"],a["nu"], np.array2string(np.diag(Fa), precision=4)))
print("  thin   t=%.2f nu=%.2f   diag = %s" % (b["t"],b["nu"], np.array2string(np.diag(Fb), precision=4)))
print("\n  razon thick/thin por grado libre (tiene que ser >= 1):")
print("   ", np.array2string(np.diag(Fa)/np.diag(Fb), precision=4))
print("  libres:", a["libres"])
