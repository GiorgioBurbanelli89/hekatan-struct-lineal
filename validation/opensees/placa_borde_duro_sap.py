# -*- coding: utf-8 -*-
"""Abre SAP2000 UNA SOLA VEZ y corre csi_modal_fuerzas.py sobre los 5 dumps.
No reescribe la logica: ejecuta el MISMO script, con CreateObject parcheado para
devolver el SapObject ya arrancado y ApplicationStart/ApplicationExit a no-op.
Ademas, despues de cada modelo, LEE de vuelta el Restraint de SAP en los nudos de
borde para comprobar que el borde DURO llego de verdad.
"""
import sys, os, json, time, runpy
import comtypes.client

VAL = r"C:\Users\j-b-j\Documents\Hekatan Calc 1.0.0\hekatan-struct\validation\opensees"
SCRIPT = os.path.join(VAL, "csi_modal_fuerzas.py")
TS = ["0.001", "0.01", "0.05", "0.1", "0.2"]

import comtypes.gen.SAP2000v1 as S
t0 = time.time()
print("arrancando SAP2000 (el splash tarda ~95 s, no es cuelgue)...", flush=True)
helper = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
O = helper.CreateObjectProgID("CSI.SAP2000.API.SapObject")
O.ApplicationStart()
print("SAP2000 arrancado en %.0f s" % (time.time() - t0), flush=True)

class Proxy:
    def __init__(self, o): self._o = o
    def __getattr__(self, n):
        if n == "ApplicationStart": return lambda *a, **k: 0
        if n == "ApplicationExit": return lambda *a, **k: 0
        return getattr(self._o, n)

class FakeHelper:
    def QueryInterface(self, *a): return self
    def CreateObjectProgID(self, *a): return Proxy(O)

_real = comtypes.client.CreateObject
comtypes.client.CreateObject = lambda *a, **k: FakeHelper()

resumen = {}
for t in TS:
    dump = os.path.join(VAL, "pl_%s_hard_dump.json" % t)
    out = os.path.join(VAL, "pl_%s_hard_sap.json" % t)
    sys.argv = [SCRIPT, "sap", dump, out, "--placa"]
    print("\n===== t/L = %s =====" % t, flush=True)
    try:
        runpy.run_path(SCRIPT, run_name="__main__")
    except SystemExit as e:
        print("SystemExit:", e, flush=True)
    except Exception as e:
        print("ERROR en %s: %r" % (t, e), flush=True)
        resumen[t] = {"error": repr(e)}
        continue
    # ── comprobacion: que ve SAP en los nudos de borde ──
    sm = O.SapModel
    chk = {}
    for nm in ("N0", "N4", "N36", "N40", "N80"):
        try:
            r = sm.PointObj.GetRestraint(nm, [])
            chk[nm] = [bool(v) for v in r[0]]
        except Exception as ex:
            chk[nm] = "err " + str(ex)[:60]
    print("restraints leidos DE SAP:", chk, flush=True)
    resumen[t] = {"restraints_sap": chk}

json.dump(resumen, open(os.path.join(VAL, "pl_hard_sap_chk.json"), "w"), indent=1)
comtypes.client.CreateObject = _real
print("\ncerrando SAP2000...", flush=True)
O.ApplicationExit(False)
print("hecho en %.0f s" % (time.time() - t0), flush=True)
