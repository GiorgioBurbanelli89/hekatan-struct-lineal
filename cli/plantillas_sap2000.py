# -*- coding: utf-8 -*-
u"""Las 8 PLANTILLAS de Hekatan Struct, abiertas y RESUELTAS en SAP2000 24.

    python cli/plantillas_sap2000.py [carpeta-s2k] [carpeta-json]

El gemelo de `plantillas_etabs.py`, pero con el `.s2k` y SAP2000. Los dos
ficheros salen del MISMO modelo en la misma llamada (`cli/exportar_csi.mjs`),
asi que si uno cuadra y el otro no, el problema esta en el exportador de ese
formato, no en el modelo.

Por cada `.s2k`, en una sola pasada de SAP2000 (arrancarlo es lo caro):

  1. abrir  ->  guardar `.sdb`
  2. leer LO QUE SAP ENTENDIO: joints (coordenadas, apoyo), frames (extremos,
     seccion), areas, cargas nodales y propiedades de seccion
  3. RunAnalysis  ->  reacciones en la base, desplazamientos y modal

Diferencias del `.s2k` frente al `.e2k`, sabidas de antemano (no son fallos):
  - va en Tonf/m, el e2k en NEWTONS (ETABS ignora el header UNITS del e2k)
  - no define caso Modal ni MASS SOURCE: SAP2000 no es un programa de edificios
    y su masa por defecto ya sale de los ELEMENTOS, que es lo que hace Hekatan
"""
import json
import os
import sys
import time

import comtypes.client

SAP_EXE = r"C:\Program Files\Computers and Structures\SAP2000 24\SAP2000.exe"

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(AQUI, "..", "validation", "modelos", "plantillas")
ORIGEN = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, "csi"))
DESTINO = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE, "sap2000"))
os.makedirs(DESTINO, exist_ok=True)
SDB_DIR = os.path.join(DESTINO, "sdb")
os.makedirs(SDB_DIR, exist_ok=True)

trabajos = sorted(f for f in os.listdir(ORIGEN) if f.lower().endswith(".s2k"))
if not trabajos:
    raise SystemExit("no hay .s2k en " + ORIGEN)
print("%d modelos" % len(trabajos))
sys.stdout.flush()

comtypes.client.CreateObject("SAP2000v1.Helper")
import comtypes.gen.SAP2000v1 as S
helper = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
obj = helper.CreateObjectProgID("CSI.SAP2000.API.SapObject")
if obj.ApplicationStart(6, False) != 0:          # 6 = kN_m_C, headless
    raise SystemExit("ApplicationStart fallo")
sm = obj.SapModel

log = open(os.path.join(DESTINO, "_plantillas.log"), "w", encoding="utf-8")
ok = fallo = 0
t0 = time.time()

for i, f in enumerate(trabajos, 1):
    src = os.path.join(ORIGEN, f)
    base = os.path.splitext(f)[0]
    sdb = os.path.join(SDB_DIR, base + ".sdb")
    jsn = os.path.join(DESTINO, base + ".json")
    estado = "ok"
    t1 = time.time()
    D = {"s2k": f}
    try:
        if sm.File.OpenFile(src) != 0:
            estado = "FALLA abrir"
        else:
            # ⚠️ Fijar las unidades DESPUES de abrir Y COMPROBARLAS. Cada
            # `OpenFile` restaura las del fichero, y en un bucle la llamada se
            # colaba de forma alterna: los modelos pares se leian en las
            # unidades del fichero y los impares en kN. Salian dos columnas de
            # numeros que se diferenciaban en 9.80665 sin motivo aparente.
            sm.SetPresentUnits(6)
            u = sm.GetPresentUnits()
            if u != 6:
                sm.SetPresentUnits(6)
                u = sm.GetPresentUnits()
            D["unidades"] = u
            if u != 6:
                estado = "AVISO: unidades %s, no kN_m_C" % u
            if sm.File.Save(sdb) != 0:
                estado = "aviso: no guardo el sdb"

            # ---- 1) lo que SAP entendio del fichero -------------------------
            puntos = []
            for nm in sm.PointObj.GetNameList(0, [])[1]:
                x, y, z, ret = sm.PointObj.GetCoordCartesian(nm, 0., 0., 0.)
                if ret != 0:
                    continue
                d = {"n": nm, "x": x, "y": y, "z": z}
                try:
                    d["ap"] = [bool(v) for v in sm.PointObj.GetRestraint(nm, [False] * 6)[0]]
                except Exception:
                    d["ap"] = None
                try:
                    d["con"] = sm.PointObj.GetConnectivity(nm, 0, [], [])[0]
                except Exception:
                    d["con"] = -1
                puntos.append(d)

            cargas = []
            for p in puntos:
                try:
                    r = sm.PointObj.GetLoadForce(p["n"], 0)
                except Exception:
                    continue
                if not r[0]:
                    continue
                for k in range(r[0]):
                    cargas.append({"n": p["n"], "pat": r[2][k],
                                   "fx": r[5][k], "fy": r[6][k], "fz": r[7][k],
                                   "mx": r[8][k], "my": r[9][k], "mz": r[10][k]})

            barras, usadas = [], set()
            for nm in sm.FrameObj.GetNameList(0, [])[1]:
                pi, pj, ret = sm.FrameObj.GetPoints(nm, "", "")
                sec = ""
                try:
                    sec = sm.FrameObj.GetSection(nm, "", "")[0]
                except Exception:
                    pass
                if sec:
                    usadas.add(sec)
                barras.append({"n": nm, "i": pi, "j": pj, "s": sec})

            areas = []
            try:
                for nm in sm.AreaObj.GetNameList(0, [])[1]:
                    r = sm.AreaObj.GetPoints(nm, 0, [])
                    areas.append({"n": nm, "pts": list(r[1]) if r[0] else []})
            except Exception:
                pass

            secciones = {}
            for s in sorted(usadas):
                try:
                    r = sm.PropFrame.GetSectProps(s, 0., 0., 0., 0., 0., 0., 0.,
                                                  0., 0., 0., 0., 0.)
                    secciones[s] = {"A": r[0], "As2": r[1], "As3": r[2], "J": r[3],
                                    "I22": r[4], "I33": r[5]}
                except Exception as ex:
                    secciones[s] = {"error": str(ex)[:50]}

            D.update({"puntos": puntos, "cargas": cargas, "barras": barras,
                      "areas": areas, "secciones": secciones})

            # ---- 2) resolverlo ---------------------------------------------
            ta = time.time()
            try:
                sm.SetModelIsLocked(False)
            except Exception:
                pass
            # El .s2k no trae caso modal (SAP2000 no es un programa de edificios): se
            # anade aqui, 12 modos, con la masa de SAP por defecto (elementos, todas las
            # direcciones, sin agrupar por planta = la masa completa de Hekatan). 8-sep-2026.
            try:
                sm.LoadCases.ModalEigen.SetCase("MODAL")
                sm.LoadCases.ModalEigen.SetNumberModes("MODAL", 12, 1)
                D["modal_case"] = "MODAL"
            except Exception as ex:
                D["modal_case_error"] = str(ex)[:80]
            D["run"] = sm.Analyze.RunAnalysis()
            D["t_analisis"] = round(time.time() - ta, 1)
            sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
            casos = sm.LoadCases.GetNameList()[1]
            D["casos"] = list(casos)
            for nm in casos:
                try:
                    sm.Results.Setup.SetCaseSelectedForOutput(nm)
                except Exception:
                    pass

            try:
                r = sm.Results.BaseReact()
                D["react"] = [{"case": r[1][k], "Fx": r[4][k], "Fy": r[5][k],
                               "Fz": r[6][k], "Mx": r[7][k], "My": r[8][k],
                               "Mz": r[9][k]} for k in range(r[0])]
            except Exception as ex:
                D["react_error"] = str(ex)[:80]

            try:
                r = sm.Results.JointDispl("All", 2)
                n = r[0]
                por_caso = {}
                nudos = {}     # desplazamientos por joint del caso DEAD (como plantillas_etabs.py)
                for k in range(n):
                    c = str(r[3][k])
                    b = por_caso.setdefault(c, {"uzMin": 0.0, "uzNodo": None,
                                                "uxMax": 0.0, "uxNodo": None})
                    u1, u2, u3 = r[6][k], r[7][k], r[8][k]
                    if u3 < b["uzMin"]:
                        b["uzMin"] = u3
                        b["uzNodo"] = str(r[1][k])
                    if abs(u1) > abs(b["uxMax"]):
                        b["uxMax"] = u1
                        b["uxNodo"] = str(r[1][k])
                    if c.lower() == "dead":
                        nudos[str(r[1][k])] = [u1, u2, u3, r[9][k], r[10][k], r[11][k]]
                D["disp"] = por_caso
                D["disp_nudos"] = nudos
            except Exception as ex:
                D["disp_error"] = str(ex)[:80]

            # ---- fuerzas de CASCARA, caso DEAD (misma firma de 25 campos que ETABS) --
            #   [1]obj [2]elm [3]pointElm [4]loadCase [7]F11 [8]F22 [9]F12 [14]M11 [15]M22 [16]M12 [20]V13 [21]V23
            # Se guardan los 4 puntos de cada area, sin promediar (como en plantillas_etabs.py).
            try:
                r = sm.Results.AreaForceShell("All", 2)
                n = r[0]
                sh = {}
                for k in range(n):
                    if str(r[4][k]).lower() != "dead":
                        continue
                    sh.setdefault(str(r[1][k]), []).append(
                        [str(r[3][k]), r[7][k], r[8][k], r[9][k],
                         r[14][k], r[15][k], r[16][k],
                         r[20][k], r[21][k]])
                D["shells"] = sh
            except Exception as ex:
                D["shells_error"] = str(ex)[:80]

            try:
                r = sm.Results.ModalPeriod()
                D["modal"] = [{"mode": k + 1, "T": r[4][k], "f": r[5][k]}
                              for k in range(r[0])]
            except Exception as ex:
                D["modal_error"] = str(ex)[:80]

            json.dump(D, open(jsn, "w", encoding="utf-8"))
    except Exception as ex:
        estado = "EXCEPCION " + str(ex)[:60]

    if estado == "ok":
        ok += 1
    else:
        fallo += 1
    T1 = "  T1=%.4f" % D["modal"][0]["T"] if D.get("modal") else ""
    msg = u"%2d/%d  %-30s %-22s %5.1f s%s" % (i, len(trabajos), base, estado,
                                              time.time() - t1, T1)
    print(msg)
    sys.stdout.flush()
    log.write(msg + "\n")
    log.flush()

log.write(u"\n%d ok, %d con problema, %.1f s\n" % (ok, fallo, time.time() - t0))
log.close()
print("\n%d ok, %d con problema, %.1f s" % (ok, fallo, time.time() - t0))
print("-> " + DESTINO)
obj.ApplicationExit(False)
