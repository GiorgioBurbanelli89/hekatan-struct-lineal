"""Hekatan (Python) vs SAP2000 Steady State: u del nudo de control (Re, Im) en 40 frecuencias."""
import json, os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "pandeo"))
from modelos import portico, E, NU
from hekatan_struct.data_model import NodeInputs, ElementInputs
from hekatan_struct.estacionario import estacionario
S = json.load(open(os.path.join(AQUI, "sap_ss.json")))
M = portico(4); top = S["top"]; G = 9.80665
ni = NodeInputs(); ni.supports = {int(q): [bool(x) for x in v] for q, v in M["apoyos"].items()}; ni.loads = {top: [20.0, 2.0, 0, 0, 0, 0]}
ei = ElementInputs(); els = []
for e, f in enumerate(M["frames"]):
    p = S["props"]["R%gx%g" % (f[2], f[3])]; els.append([f[0], f[1]])
    ei.elasticities[e] = E; ei.poissons_ratios[e] = NU; ei.shear_moduli[e] = E / (2 * (1 + NU)); ei.areas[e] = p["A"]
    ei.moments_of_inertia_z[e] = p["I33"]; ei.moments_of_inertia_y[e] = p["I22"]; ei.torsional_constants[e] = p["J"]
    ei.shear_areas_z[e] = p["As2"]; ei.shear_areas_y[e] = p["As3"]; ei.densities[e] = S["gamma"] / G
    if f[4]: ei.local_angles[e] = f[4]
o = S["opciones"]["1"]; st, sn, U = o["steptype"], o["stepnum"], o["u"]
fr = sorted(set(sn)); _, A = estacionario(M["nodes"], els, ni, ei, fr, dK=0.04)
peor = 0; umax = max(abs(x) for u in U for x in u[:3])
for k, f in enumerate(fr):
    re = [U[i] for i in range(len(st)) if sn[i] == f and st[i].startswith("Real")][0]
    im = [U[i] for i in range(len(st)) if sn[i] == f and st[i].startswith("Imag")][0]
    a = A[k][6 * top:6 * top + 6]
    d = max(max(abs(a.real[c] - re[c]), abs(a.imag[c] - im[c])) for c in range(6)) / umax * 100; peor = max(peor, d)
    if k % 6 == 0 or d > 1e-3: print("f %5.1f Hz  uy Re %+.5e Im %+.5e  ·  SAP %+.5e %+.5e  dif %.5f %%" % (f, a.real[1], a.imag[1], re[1], im[1], d))
print("PEOR %.6f %% del máximo" % peor)
