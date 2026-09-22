# Compara el campo sigma de ej4 (Hekatan) contra SAP2000 con la MISMA malla, nudo a nudo.
import json, os, sys
HEK = "hekatan-struct/cli/shots/guerra/guerra-ej4-zapata-combinada-rectangular.json"
SAP = os.path.expandvars(r"%LOCALAPPDATA%/Temp/ej4_sap.json")
DUMP = os.path.expandvars(r"%LOCALAPPDATA%/Temp/ej4_dump.json")
h = json.load(open(HEK, encoding="utf-8"))
dump = json.load(open(DUMP))
# ks del ejemplo: spring uz / A_trib. Sacamos ks nodal = k_uz(nudo interior)/A. Mejor: sigma_sap = ks * Uz_sap.
# ks_tm3 lo tenemos del ref; pero mejor sigma = k_spring_node * Uz / A_trib. Usamos: sigma = ks * |Uz|, ks de Hekatan.
ref = h["ref"]; 
# ks en kN/m3: del dump, spring uz de un nudo interior / A_trib de ese nudo. Interior A=dx*dy.
import math
nodes = h["nodes"]; sigH = h["sigma"]
if not os.path.exists(SAP):
    print("SAP aun no termino:", SAP); sys.exit(0)
s = json.load(open(SAP, encoding="utf-8"))
# csi_desde_dump deja disp_nudos o casos[..].disp? buscamos Uz por nudo
disp = s.get("disp_nudos") or (s.get("casos",{}).get(next(iter(s.get("casos",{})), ""), {}) or {}).get("disp_nudos")
print("claves SAP:", list(s.keys())[:15])
print("¿hay disp por nudo?:", "sí" if disp else "no —", None if disp else list((s.get("casos",{}) or {}).values())[:1])
