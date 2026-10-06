# -*- coding: utf-8 -*-
"""Saca los resultados de los TRES jueces de la placa base tubular a un JSON para el test de Struct.

    python extraer_jueces.py   ->  tests/datos/placa_base_tubular_jueces.json

Jueces (mismo modelo nudo a nudo, hekatan-lisp/tests/placa_base/):
  abaqus  abq_<caso>/pb.dat     U (161 nudos x 6), S de la placa (centro, 5 puntos de la seccion), NFORC de la soldadura
  hoja    volcado HK_NUM_DEBUG de las hojas 144/145 (%TEMP%/pb_144.txt, pb_145.txt): U_f, sig_el_f, Fw_f
  idea    solver k2fem64 standalone (idea/<caso>/pb.nas -> VTK con vtkExporter64, sin red ni licencia): uz
"""
import json, os, re, subprocess, sys
import numpy as np
import xml.etree.ElementTree as ET

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.normpath(os.path.join(AQUI, "..", "..", ".."))
PB = os.path.join(RAIZ, "hekatan-lisp", "tests", "placa_base")
SD = os.path.join(RAIZ, "hekatan-idea-bridge", "k2solver-standalone")
TMP = os.environ.get("TEMP", "")
# «-7619.» (Abaqus escribe sin decimales los números redondos): con \d*\.?\d+ esas filas no casaban y se perdían
# 40 de los 64 elementos de la placa (comparar.py de la hoja tiene la misma regex).
num = r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[Ee][-+]?\d+)?"


def abaqus(caso):
    A = np.zeros((161, 6)); NF = {}; SV = {}; modo = None
    txt = open(os.path.join(PB, "abq_%s" % caso, "pb.dat"), encoding="utf8", errors="replace").read().splitlines()
    for l in txt:
        if "NODE" in l and "U1" in l and "RF" not in l and "F1" not in l: modo = "U"; continue
        if "ELEMENT" in l and "NODE" in l and "NFORC1" in l: modo = "NF"; NF = {}; continue
        if "ELEMENT" in l and "SEC" in l and "S11" in l: modo = "S"; SV = {}; continue
        if "THE ANALYSIS" in l: modo = None
        if modo == "U":
            m = re.match(r"\s*(\d+)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s*$" % ((num,) * 6), l)
            if m: A[int(m.group(1)) - 1] = [float(m.group(k)) for k in range(2, 8)]
        elif modo == "NF":
            m = re.match(r"\s*(\d+)\s+(\d+)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s+(%s)\s*$" % ((num,) * 6), l)
            if m:
                q = int(m.group(2)); NF[q] = list(np.array(NF.get(q, [0, 0, 0])) + np.array([float(m.group(k)) for k in range(3, 6)]))
        elif modo == "S":
            m = re.match(r"\s*(\d+)\s+(\d+)\s+(%s)\s+(%s)\s+(%s)\s*$" % ((num,) * 3), l)
            if m:
                e = int(m.group(1)); s11, s22, s12 = [float(m.group(k)) for k in range(3, 6)]
                SV[e] = max(SV.get(e, 0), (s11 * s11 - s11 * s22 + s22 * s22 + 3 * s12 * s12) ** 0.5 / 1000)
    return {"U": A.tolist(), "vm": [SV.get(e, None) for e in range(1, 65)], "soldadura": {str(k): v for k, v in NF.items()}}


def hoja(caso):
    f = os.path.join(TMP, "pb_%d.txt" % (144 if caso == "shs" else 145))
    out = {}
    for l in open(f, encoding="utf8", errors="replace"):
        for nom, k in (("U_f", "U"), ("sig_el_f", "vm"), ("Fw_f", "soldadura")):
            if re.match(r";; \d+ \[%s\] " % nom, l):
                out[k] = [float(v) for v in re.findall(r"[-+]?\d+\.?\d*(?:[eE][-+]?\d+)?", l.split("=>", 1)[1])]
    out["U"] = np.array(out["U"]).reshape(-1, 6).tolist()
    out["vm"] = out["vm"][:64]
    return out


def idea(caso):
    d = os.path.join(PB, "idea", caso); vd = os.path.join(d, "pb_vtk")
    if not any(x.startswith("result06") for x in os.listdir(vd)):
        env = dict(os.environ); env["PATH"] = SD + os.pathsep + env["PATH"]
        subprocess.run([os.path.join(SD, "vtkExporter64.exe"), "pb.nas"], cwd=d, env=env, capture_output=True, timeout=120)
    f = sorted(x for x in os.listdir(vd) if x.startswith("result06") and x.endswith(".vtu"))[0]
    r = ET.parse(os.path.join(vd, f)).getroot()
    U = pts = None
    for a in r.iter("DataArray"):
        if a.get("Name") == "displacement": U = np.array(a.text.split(), float).reshape(-1, int(a.get("NumberOfComponents", 1)))
    pts = np.array(r.find(".//Points/DataArray").text.split(), float).reshape(-1, 3)
    G = {}
    for l in open(os.path.join(d, "pb.nas")):
        if l.startswith("GRID"): G[int(l[8:16])] = (float(l[24:32]), float(l[32:40]), float(l[40:48]))
    from scipy.spatial import cKDTree
    dd, ix = cKDTree(pts).query([G[k] for k in range(1, 162)])
    return {"uz_mm": U[ix, 2].tolist(), "emparejado_mm": float(dd.max())}


salida = {}
for caso in ("shs", "rhs"):
    P = json.load(open(os.path.join(PB, "params_%s.json" % caso)))
    D = json.load(open(os.path.join(PB, "abq_%s" % caso, "datos.json")))
    salida[caso] = {"params": {k: P[k] for k in ("N", "M", "t_p", "t_c", "k_c", "A_b", "L_b", "k_b")},
                    "kc": D["kc"], "nb": D["nb"], "abaqus": abaqus(caso), "hoja": hoja(caso), "idea": idea(caso)}
dst = os.path.join(AQUI, "..", "..", "tests", "datos", "placa_base_tubular_jueces.json")
json.dump(salida, open(dst, "w"), separators=(",", ":"))
print("escrito", os.path.normpath(dst), os.path.getsize(dst), "bytes")
