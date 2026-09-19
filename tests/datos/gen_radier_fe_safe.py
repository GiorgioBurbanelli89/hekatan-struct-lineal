# -*- coding: utf-8 -*-
"""Genera tests/datos/radier_fe_safe.json: acero del diseño FE de SAFE 20.3 por nudo de elemento, leído del FDB
(registro «Slab Design Data», clase ᯞ.ᜆ de SAFE.exe) con fdb_fe.py. Unidades mm²/mm (BD de SAFE N-mm).
Uso: python gen_radier_fe_safe.py <FDB diseñado> <malla.json de safe_extract.py>"""
import json, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "validation", "04-cimentaciones-safe", "radier-mod002", "franjas_safe"))
from fdb_fe import leer
R = leer(sys.argv[1]); names = list(json.load(open(sys.argv[2]))["elements"].keys())
out = {"fuente": "SAFE 20.3 MOD_002_CORREGIDO_diseno.FDB tras StartSlabDesign; combo DISEÑO; mm²/mm", "elems": {}}
for r in R:
    out["elems"][names[r["elm"] - 1]] = {k: r[f] for k, f in (("top1", "AsEnvTop1"), ("bot1", "AsEnvBot1"), ("top2", "AsEnvTop2"), ("bot2", "AsEnvBot2"),
        ("top1min", "AsEnvWithMinTop1"), ("bot1min", "AsEnvWithMinBot1"), ("top2min", "AsEnvWithMinTop2"), ("bot2min", "AsEnvWithMinBot2"))}
json.dump(out, open(os.path.join(os.path.dirname(__file__), "radier_fe_safe.json"), "w"))
print(len(out["elems"]))
