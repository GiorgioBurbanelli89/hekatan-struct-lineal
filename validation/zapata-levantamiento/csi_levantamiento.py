# -*- coding: utf-8 -*-
u"""Zapata excéntrica con levantamiento en SAP2000 / ETABS / SAFE (suelo SOLO compresión).

    python csi_levantamiento.py sap    csi/zapata6.s2k      csi/sap2000.json
    python csi_levantamiento.py etabs  zapata_6casos_n60.heks csi/etabs.json
    python csi_levantamiento.py safe   csi/zapata6_SAFE20.f2k csi/safe.json

Un modelo, seis patrones de carga (E0, E1_12, E1_6, E1_4, E1_3, BI). Por cada patrón:
  - el caso LINEAL que trae el fichero (el muelle actúa también en tracción: «Linear Effective
    Stiffness», CSI Analysis Reference p. 277), y
  - un caso NO LINEAL «NL_<patrón>» con ese patrón: ahí el muelle «Compression Only» es un Gap
    (p. 286) y la zapata se levanta. En SAFE es el tipo «Nonlinear (Allow Uplift)».
Se guardan los U3 de TODOS los nudos (malla idéntica a la del .heks, nudo = número del .heks).

SAP2000: abre el .s2k que escribe `cli/heks_a_csi.mjs … patrones=1` (muelle de área Compression Only).
ETABS: el .e2k de Hekatan aún no lleva patrones ni el muelle de área no lineal, así que se monta por
OAPI desde el MISMO .heks (nudos, áreas, muelle de área con NonlinearOption «compression only»,
cargas por patrón con SetLoadUniform sobre las mismas áreas).
SAFE: importa el .f2k por tablas (csi-cli/safe-cli) y añade los casos de levantamiento.

Una instancia a la vez; siempre se cierra al final (finally).
"""
import json
import os
import re
import sys
import time

import comtypes.client
sys.stdout.reconfigure(encoding="utf-8")

PROG, SRC, OUT = sys.argv[1], os.path.abspath(sys.argv[2]), os.path.abspath(sys.argv[3])
AQUI = os.path.dirname(os.path.abspath(__file__))
PATS = sys.argv[4].split(",") if len(sys.argv) > 4 else ["E0", "E1_12", "E1_6", "E1_4", "E1_3", "BI"]
# TOL=1e-6 (entorno): la misma corrida con la tolerancia de convergencia más fina (defecto CSI 1e-4)
TOL = float(os.environ.get("TOL", "0"))
t0 = time.time()


def log(m):
    print("[%6.1fs] %s" % (time.time() - t0, m), flush=True)


def leer_heks(ruta):
    nodos, shells, springs, loads = {}, {}, {}, {}
    for ln in open(ruta, encoding="utf-8"):
        t = ln.split()
        if not t or t[0].startswith("#"):
            continue
        if t[0] == "node":
            nodos[int(t[1])] = (float(t[2]), float(t[3]), float(t[4]))
        elif t[0] == "shell":
            shells[int(t[1])] = ([int(v) for v in t[2:6]], float(t[6]), float(t[7]))
        elif t[0] == "areaspring":
            springs[int(t[1])] = float(t[2])
        elif t[0] == "areaload":
            loads.setdefault(t[3] if len(t) > 3 else "Dead", {})[int(t[1])] = float(t[2])
    return nodos, shells, springs, loads


res = {"prog": PROG, "src": os.path.basename(SRC), "casos": {}}

# ─────────────────────────────────────────────────────────────────────────────
if PROG == "sap":
    import comtypes.gen.SAP2000v1 as S  # noqa
    hp = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
    o = hp.CreateObjectProgID("CSI.SAP2000.API.SapObject")
elif PROG == "etabs":
    import comtypes.gen.ETABSv1 as S  # noqa
    hp = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(S.cHelper)
    o = hp.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
else:
    raise SystemExit("safe: ver csi_levantamiento_safe.py")

log("arrancando %s ..." % PROG)
o.ApplicationStart()
sm = o.SapModel
log("arrancado")
try:
    SOLO_LEER = SRC.lower().endswith((".sdb", ".edb"))
    if SOLO_LEER:
        if sm.File.OpenFile(SRC) != 0:
            raise SystemExit("OpenFile falló")
        sm.SetPresentUnits(6)
        log("modelo ya analizado abierto: solo se leen resultados")
    elif PROG == "sap":
        if sm.File.OpenFile(SRC) != 0:
            raise SystemExit("OpenFile falló")
        sm.SetPresentUnits(6)                      # kN, m, C
        log("s2k abierto; unidades %s" % sm.GetPresentUnits())
        # lo que SAP entendió del muelle de área (el primero basta para ver el tipo)
        try:
            r = sm.AreaObj.GetSpring("1", 0, [], [], [], [], [], [], [], [], [], [], [], [])
            res["muelle_area_1"] = str(r)[:300]
        except Exception as e:
            res["muelle_area_1"] = "GetSpring: %s" % e
        z0 = 0.0
    else:
        nodos, shells, springs, loads = leer_heks(SRC)
        sm.InitializeNewModel(6)
        sm.File.NewGridOnly(1, 4.0, 4.0, 2, 2, 1.0, 1.0)
        sm.SetPresentUnits(6)
        E = next(iter(shells.values()))[2]
        t = next(iter(shells.values()))[1]
        sm.PropMaterial.SetMaterial("HORM", 2)
        sm.PropMaterial.SetMPIsotropic("HORM", E, 0.2, 9.9e-6)
        sm.PropMaterial.SetWeightAndMass("HORM", 1, 0.0)
        # ShellType de ETABS: eSlabType Slab=0; SetSlab(Name, SlabType, ShellType, Mat, t) ShellType 2 = ShellThick
        sm.PropArea.SetSlab("ZAP", 0, 2, "HORM", t)
        ks = next(iter(springs.values()))
        # SetAreaSpringProp(Name, U1, U2, U3, NonlinOpt3, ...): 1 = compression only (0 lineal, 2 tracción)
        r = sm.PropAreaSpring.SetAreaSpringProp("KS", 0.0, 0.0, ks, 1)
        res["SetAreaSpringProp"] = str(r)
        z0 = 2.0          # a z=0 (nivel Base) ETABS deja todo a cero
        for nid, (x, y, _) in nodos.items():
            sm.PointObj.AddCartesian(x, y, z0, "", str(nid))
            sm.PointObj.SetRestraint(str(nid), [True, True, False, False, False, True])
        for sid, (pts, _, _) in shells.items():
            sm.AreaObj.AddByPoint(4, [str(p) for p in pts], "", "ZAP", str(sid))
            sm.AreaObj.SetSpringAssignment(str(sid), "KS")
        log("ETABS: %d nudos, %d áreas" % (len(nodos), len(shells)))
        for p in PATS:
            sm.LoadPatterns.Add(p, 8, 0.0, True)       # 8 = Other
            for sid, q in loads[p].items():
                sm.AreaObj.SetLoadUniform(str(sid), p, q, 6, True, "Global", 0)   # dir 6 = Z global
        # los linear static de cada patrón
        for p in PATS:
            sm.LoadCases.StaticLinear.SetCase(p)
            sm.LoadCases.StaticLinear.SetLoads(p, 1, ["Load"], [p], [1.0])

    # ── casos NO lineales, uno por patrón ──
    for p in ([] if SOLO_LEER else PATS):
        nl = "NL_" + p
        sm.LoadCases.StaticNonlinear.SetCase(nl)
        sm.LoadCases.StaticNonlinear.SetLoads(nl, 1, ["Load"], [p], [1.0])
        if TOL:
            # el MISMO caso otra vez (NLT_) con la tolerancia de fuerza más fina; NL_ queda con la de CSI
            nt = "NLT_" + p
            sm.LoadCases.StaticNonlinear.SetCase(nt)
            sm.LoadCases.StaticNonlinear.SetLoads(nt, 1, ["Load"], [p], [1.0])
            q = list(sm.LoadCases.StaticNonlinear.GetSolControlParameters(nt))
            # (MaxTotalSteps, MaxFailedSubSteps, MaxIterCS, MaxIterNR, TolConvD, UseEventStepping, TolEventD, ...)
            sm.LoadCases.StaticNonlinear.SetSolControlParameters(nt, int(q[0]), int(q[1]), int(q[2]), int(q[3]), TOL,
                                                                 bool(q[5]), float(q[6]), int(q[7]), float(q[8]), float(q[9]))
    try:
        res["solcontrol_defecto"] = [float(v) if isinstance(v, (int, float)) else str(v)
                                     for v in sm.LoadCases.StaticNonlinear.GetSolControlParameters("NL_E0")]
    except Exception as e:
        res["solcontrol_defecto"] = "no leído: %s" % e
    carpeta = os.path.join(os.path.dirname(OUT), "_%s" % PROG)
    os.makedirs(carpeta, exist_ok=True)
    if not SOLO_LEER:
        sm.File.Save(os.path.join(carpeta, "%s.%s" % (os.path.splitext(os.path.basename(SRC))[0], "sdb" if PROG == "sap" else "EDB")))
        log("casos NL definidos; corriendo ...")
        rr = sm.Analyze.RunAnalysis()
        log("RunAnalysis -> %s" % rr)

    # nudo del .heks por nombre de objeto (s2k: Joint = índice+1 = id del .heks; ETABS: el nombre dado)
    for caso in PATS + ["NL_" + p for p in PATS] + (["NLT_" + p for p in PATS] if TOL else []):
        sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
        sm.Results.Setup.SetCaseSelectedForOutput(caso)
        try:
            sm.Results.Setup.SetOptionNLStatic(3)     # último paso
        except Exception:
            pass
        r = sm.Results.JointDispl("ALL", 2, 0, [], [], [], [], [], [], [], [], [], [], [])
        n = r[0]
        w = {}
        for k in range(n):
            w[str(r[1][k])] = float(r[8][k])
        b = sm.Results.BaseReact(0, [], [], [], [], [], [], [], [], [], 0.0, 0.0, 0.0)
        fz = float(b[6][-1]) if b[0] else None
        res["casos"][caso] = {"n": n, "U3": w, "sumFz": fz, "steps": list(r[4][:3]) if n else []}
        log("%-9s %4d nudos  U3 min %.6e  ΣFz %s" % (caso, n, min(w.values()) if w else float("nan"), fz))
    res["seg"] = time.time() - t0
    json.dump(res, open(OUT, "w", encoding="utf-8"))
    log("-> %s" % OUT)
    if os.environ.get("CSI_ESPERAR") == "1":
        log("abierto para capturas; crea %s.cerrar para cerrar" % OUT)
        while not os.path.exists(OUT + ".cerrar"):
            time.sleep(2)
finally:
    try:
        o.ApplicationExit(False)
        log("%s cerrado" % PROG)
    except Exception:
        pass
