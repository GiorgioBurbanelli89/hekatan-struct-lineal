"""Hekatan (Python) vs SAP2000 PSD: √PSD(f) y RMS del nudo de control. Prueba interpolación de S y regla del RMS."""
import json, os, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(AQUI, "..", "pandeo"))
from modelos import portico, E, NU
from hekatan_struct.data_model import NodeInputs, ElementInputs
from hekatan_struct.estacionario import estacionario
S = json.load(open(os.path.join(AQUI, "sap_psd.json"))); top = S["top"]; G = 9.80665
M = portico(4)
ni = NodeInputs(); ni.supports = {int(q): [bool(x) for x in v] for q, v in M["apoyos"].items()}; ni.loads = {top: [20.0, 2.0, 0, 0, 0, 0]}
ei = ElementInputs(); els = []
for e, f in enumerate(M["frames"]):
    p = S["props"]["R%gx%g" % (f[2], f[3])]; els.append([f[0], f[1]])
    ei.elasticities[e] = E; ei.poissons_ratios[e] = NU; ei.shear_moduli[e] = E / (2 * (1 + NU)); ei.areas[e] = p["A"]
    ei.moments_of_inertia_z[e] = p["I33"]; ei.moments_of_inertia_y[e] = p["I22"]; ei.torsional_constants[e] = p["J"]
    ei.shear_areas_z[e] = p["As2"]; ei.shear_areas_y[e] = p["As3"]; ei.densities[e] = S["gamma"] / G
    if f[4]: ei.local_angles[e] = f[4]
xf, yf = S["psd"]; o2 = S["opciones"]["2"]; fr = o2["stepnum"]; U = np.array(o2["u"])
Sf = lambda f: np.interp(f, xf, yf)
_, A = estacionario(M["nodes"], els, ni, ei, fr, dK=0.04, cargas=None)
H = np.array([np.abs(A[k][6 * top:6 * top + 6]) * np.sqrt(Sf(f)) for k, f in enumerate(fr)])
print("√PSD peor dif (% del máx):", np.max(np.abs(H - U)) / np.abs(U).max() * 100)
rms_sap = np.array(S["opciones"]["1"]["u"][0])
P = H ** 2; f = np.array(fr)
reglas = {"trapecio": np.sqrt(np.trapezoid(P, f, axis=0)), "rectángulo (Δf)": np.sqrt((P * 0.5).sum(axis=0))}
for k, v in reglas.items(): print("%-16s uy %.8f  SAP %.8f  dif %.4f %%" % (k, v[1], rms_sap[1], (v[1] / rms_sap[1] - 1) * 100))
