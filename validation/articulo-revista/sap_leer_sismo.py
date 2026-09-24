# -*- coding: utf-8 -*-
"""Se ENGANCHA a la instancia de SAP2000 ya abierta con sap_dual_sismo.sdb (modelo
corrido) y extrae W, cortantes basales y derivas. Separado de sap_dual_sismo.py
para no volver a arrancar SAP2000 si la extraccion falla.

    python sap_leer_sismo.py dual_2x2x4_sismo.json sap_dual_sismo.json
"""
import json, sys, traceback
import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")
DUMP, OUT = sys.argv[1], sys.argv[2]
D = json.load(open(DUMP, encoding="utf-8"))
G = 9.80665

import comtypes.gen.SAP2000v1 as S
h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
o = h.GetObject("CSI.SAP2000.API.SapObject")
sm = o.SapModel
print("enganchado; unidades", sm.GetPresentUnits(), flush=True)
print("casos:", list(sm.LoadCases.GetNameList()[1]), flush=True)

# ── lectura ──────────────────────────────────────────────────────────────────
# (de aqui abajo lo reutiliza sap_dual_sismo.py con un exec, para no duplicarlo)
def sel(*casos):
    sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
    for c in casos:
        r = sm.Results.Setup.SetCaseSelectedForOutput(c)
        if r: print("  OJO SetCaseSelectedForOutput(%s) -> %s" % (c, r), flush=True)

def base(caso):
    sel(caso)
    br = sm.Results.BaseReact()
    n = br[0]
    print("  BaseReact(%s): n=%s casos=%s FX=%s FY=%s FZ=%s"
          % (caso, n, list(br[1]), list(br[4]), list(br[5]), list(br[6])), flush=True)
    return br

out = {"nudos": len(D["nodes"]), "unidades": "tonf, m"}
br = base("DEAD"); out["W_sap_tonf"] = abs(float(br[6][0])) / G
br = base("LX");   out["Vx_LX_tonf"] = abs(float(br[4][0])) / G
br = base("SPECX"); out["V_SPECX_tonf"] = abs(float(br[4][0])) / G
br = base("SPECY"); out["V_SPECY_tonf"] = abs(float(br[5][0])) / G
print("W=%.4f  Vest=%.4f  VdinX=%.4f  VdinY=%.4f tonf"
      % (out["W_sap_tonf"], out["Vx_LX_tonf"], out["V_SPECX_tonf"], out["V_SPECY_tonf"]), flush=True)

# periodos, para dejar constancia de que es el mismo modelo del contraste modal
sel("MODAL")
rp = sm.Results.ModalPeriod()
out["T"] = [float(v) for v in rp[4]]
print("T1-5 %s" % " ".join("%.4f" % t for t in out["T"][:5]), flush=True)

# derivas con LX
zl = D["pisosZ"]
niveles = {}
for i, (x, y, z) in enumerate(D["nodes"]):
    for zz in zl:
        if abs(float(z) - zz) < 0.02: niveles.setdefault(zz, []).append(i)
sel("LX")
ux = {}
for zz in zl:
    s = 0.0
    for i in niveles[zz]:
        d = sm.Results.JointDispl("N%d" % i, 0)
        s += float(d[6][0])       # (NumberResults, Obj, Elm, LoadCase, StepType, StepNum, U1, ...)
    ux[zz] = s / len(niveles[zz])
    print("  z=%.2f  %d nudos  ux=%.6f m" % (zz, len(niveles[zz]), ux[zz]), flush=True)

AMP = 0.75 * D["nec"]["R"]
pisos = []
for k, z in enumerate(zl):
    zPrev = zl[k - 1] if k else 0.0
    dPrev = ux[zl[k - 1]] if k else 0.0
    de = ux[z] - dPrev; hh = z - zPrev
    pisos.append({"piso": k + 1, "z": z, "h": hh, "ux": ux[z],
                  "driftE": de / hh, "driftM": AMP * de / hh})
out["pisos"] = pisos
out["nudosPorNivel"] = {str(z): len(niveles[z]) for z in zl}
print("piso   z    ux(mm)   derivaE%  derivaM%")
for r in reversed(pisos):
    print("%3d %6.2f %9.4f %9.4f %9.4f" % (r["piso"], r["z"], r["ux"]*1000,
                                           r["driftE"]*100, r["driftM"]*100), flush=True)
json.dump(out, open(OUT, "w", encoding="utf-8"), indent=1)
print("ok ->", OUT, flush=True)
