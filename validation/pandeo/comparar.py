"""Hekatan (Python) vs SAP2000: factores de pandeo. python validation/pandeo/comparar.py [total|flexion]"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from modelos import MODELOS, E, NU
from hekatan_struct.data_model import NodeInputs, ElementInputs
from hekatan_struct.buckling import pandeo
AQUI = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(AQUI, "sap_pandeo.json")))
pend = sys.argv[1] if len(sys.argv) > 1 else "total"
peor = 0
for M in MODELOS:
    s = S[M["nombre"]]; ni = NodeInputs(); ei = ElementInputs()
    ni.supports = {int(q): [bool(x) for x in v] for q, v in M["apoyos"].items()}; ni.loads = {q: list(c) for q, c in M["cargas"].items()}
    els = []
    for e, f in enumerate(M["frames"]):
        p = s["props"]["R%gx%g" % (f[2], f[3])]; els.append([f[0], f[1]])
        ei.elasticities[e] = E; ei.poissons_ratios[e] = NU; ei.shear_moduli[e] = E / (2 * (1 + NU)); ei.areas[e] = p["A"]
        ei.moments_of_inertia_z[e] = p["I33"]; ei.moments_of_inertia_y[e] = p["I22"]; ei.torsional_constants[e] = p["J"]
        ei.shear_areas_z[e] = p["As2"]; ei.shear_areas_y[e] = p["As3"]
        if f[4]: ei.local_angles[e] = f[4]
    lam, _ = pandeo(M["nodes"], els, ni, ei, len(s["factores"]), pendiente=pend)
    print(M["nombre"])
    for k, (a, b) in enumerate(zip(lam, s["factores"])):
        d = 100 * (a / b - 1); peor = max(peor, abs(d)); print("  modo %d  Hekatan %.6f  SAP2000 %.6f  dif %+.5f %%" % (k + 1, a, b, d))
print("PEOR %.6f %%" % peor)
