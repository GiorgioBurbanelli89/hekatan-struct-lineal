# -*- coding: utf-8 -*-
u"""Las 8 PLANTILLAS de Hekatan Struct, abiertas y RESUELTAS en ETABS 22.

    python cli/plantillas_etabs.py [carpeta-e2k] [carpeta-json]

Por cada `.e2k`, en la MISMA pasada de ETABS (arrancarlo es lo caro, ~25 s):

  1. abrir  ->  File.Save(.EDB)     (sin guardar, RunAnalysis devuelve 1 y todo
                                     sale en cero: ver etabs-cli/README)
  2. leer LO QUE ETABS ENTENDIO: joints (coordenadas, apoyo, conectividad),
     barras (extremos, seccion), areas, cargas nodales y propiedades de seccion
  3. RunAnalysis  ->  reacciones en la base, desplazamientos maximos y modal

El paso 2 responde "el .e2k dice lo mismo que el modelo" y el 3 responde
"y ademas sale el mismo numero". Son dos preguntas distintas y se contestan por
separado a proposito: un modelo puede leerse bien y resolverse distinto.

Se compara contra ETABS y no releyendo el fichero: el `.e2k` no guarda cotas,
las deduce de la planta del objeto, asi que releerlo con el mismo criterio con
que se escribe mide una copia y da verde siempre.

Trampas ya pagadas (reference_e2k_etabs_roundtrip):
  - `PointObj.GetLoadForce` con el grupo "ALL" devuelve CERO cargas sin error.
    Hay que pedirlas nudo a nudo.
  - De los 13 parametros de `GetLoadForce`, DIEZ son de salida.
  - NO llamar a `o.Hide()` ni a `SetModelIsLocked(False)` antes de abrir.
  - Un `| head` sobre esto lo mata por SIGPIPE antes de escribir: redirigir.
"""
import json
import os
import sys
import time

import comtypes.client
import comtypes.gen.ETABSv1 as E

AQUI = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(AQUI, "..", "validation", "modelos", "plantillas")
NOEDGE = "--noedge" in sys.argv
# Brazos rigidos AUTOMATICOS de ETABS: desde el 8-sep-2026 se DEJAN (es lo que ETABS hace y lo que
# Hekatan reproduce con `offsets=1`, su defecto: la viga no pesa ni masa el tramo dentro de la
# columna). `--nooffsets` los anula (SAP2000, Hekatan `offsets=0`). `--offsets` se acepta por compatibilidad.
KEEP_OFFSETS = "--nooffsets" not in sys.argv
sys.argv = [a for a in sys.argv if a not in ("--noedge", "--offsets", "--nooffsets")]
ORIGEN = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(BASE, "csi"))
DESTINO = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(BASE, "etabs"))
os.makedirs(DESTINO, exist_ok=True)
EDB_DIR = os.path.join(DESTINO, "edb")
os.makedirs(EDB_DIR, exist_ok=True)

trabajos = sorted(f for f in os.listdir(ORIGEN) if f.lower().endswith(".e2k"))
if not trabajos:
    raise SystemExit("no hay .e2k en " + ORIGEN)
print("%d modelos" % len(trabajos))
sys.stdout.flush()

h = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(E.cHelper)
o = h.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
o.ApplicationStart()
sm = o.SapModel

log = open(os.path.join(DESTINO, "_plantillas.log"), "w", encoding="utf-8")
ok = fallo = 0
t0 = time.time()

for i, f in enumerate(trabajos, 1):
    src = os.path.join(ORIGEN, f)
    base = os.path.splitext(f)[0]
    edb = os.path.join(EDB_DIR, base + ".EDB")
    jsn = os.path.join(DESTINO, base + ".json")
    estado = "ok"
    t1 = time.time()
    D = {"e2k": f}
    try:
        sm.InitializeNewModel(6)                     # 6 = kN_m_C
        if sm.File.OpenFile(src) != 0:
            estado = "FALLA abrir"
        else:
            sm.SetPresentUnits(6)
            # Los brazos rigidos AUTOMATICOS de ETABS (RZ = 0, invisibles en el e2k)
            # no pesan el tramo de viga que cae dentro de la columna: en los porticos
            # sin losa eran 3.5 t por planta (5 % de la masa) y +2.5 % en los
            # periodos. Se anulan para medir la MISMA estructura (regla de la casa:
            # "offsets = 0", CLAUDE.md), medido el 3-sep-2026.
            if not KEEP_OFFSETS:
                for nm in sm.FrameObj.GetNameList(0, [])[1]:
                    sm.FrameObj.SetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)
            else:
                D_offsets = {nm: list(sm.FrameObj.GetEndLengthOffset(nm, False, 0.0, 0.0, 0.0)[:4]) for nm in sm.FrameObj.GetNameList(0, [])[1]}
            # --noedge: el EDGE CONSTRAINT es un default de ETABS (ata cada paño a
            # todo nudo que toca) que SAP2000 no tiene. Apagado, ETABS resuelve la
            # misma malla que SAP y Hekatan: es el paso 2 de la regla «SAP2000
            # primero» (como en csi_desde_dump.py --noedge). Medido el 8-sep-2026.
            if NOEDGE:
                nA = 0
                for nm in sm.AreaObj.GetNameList(0, [])[1]:
                    sm.AreaObj.SetEdgeConstraint(nm, False, 0); nA += 1
                D["noedge"] = nA
            if sm.File.Save(edb) != 0:
                estado = "aviso: no guardo el EDB"

            # ---- 1) lo que ETABS entendio del fichero ----------------------
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

            # PROPIEDADES DE CASCARA: el tipo (Thin/Thick/Membrane) y los DIEZ
            # modificadores. Firmas MEDIDAS con la propia OAPI, que no se
            # adivinan (`GetShell_1` ni existe en ETABS 22):
            #   GetSlab(nm,...) -> [SlabType, ShellType, Mat, t, color, notas, guid, ret]
            #   GetWall(nm,...) -> [WallPropType, ShellType, Mat, t, ...]
            #   GetModifiers(nm, []) -> [(f11,f22,f12,m11,m22,m12,v13,v23,masa,peso), ret]
            # ShellType: 1 = ShellThin, 2 = ShellThick, 3 = Membrane.
            props = {}
            try:
                for nm in sm.PropArea.GetNameList(0, [])[1]:
                    d = {"n": nm}
                    try:
                        r = sm.PropArea.GetSlab(nm, 0, 0, "", 0., 0)
                        if r[-1] == 0:
                            d.update({"clase": "Slab", "slabType": r[0],
                                      "shellType": r[1], "mat": r[2], "t": r[3]})
                    except Exception:
                        pass
                    if "clase" not in d:
                        try:
                            r = sm.PropArea.GetWall(nm, 0, 0, "", 0., 0)
                            if r[-1] == 0:
                                d.update({"clase": "Wall", "wallType": r[0],
                                          "shellType": r[1], "mat": r[2], "t": r[3]})
                        except Exception:
                            pass
                    try:
                        d["mods"] = list(sm.PropArea.GetModifiers(nm, [])[0])
                    except Exception as ex:
                        d["mods_error"] = str(ex)[:50]
                    props[nm] = d
            except Exception as ex:
                D["props_error"] = str(ex)[:80]

            # Y el modificador ASIGNADO a cada objeto area: en ETABS se puede
            # poner en la propiedad Y encima en el objeto, y el del objeto manda.
            modsObj = {}
            try:
                for a in areas:
                    try:
                        modsObj[a["n"]] = list(sm.AreaObj.GetModifiers(a["n"], [])[0])
                    except Exception:
                        break
            except Exception:
                pass

            D.update({"puntos": puntos, "cargas": cargas, "barras": barras,
                      "areas": areas, "secciones": secciones,
                      "propsArea": props, "modsObjeto": modsObj})

            # ---- 2) y ademas: resolverlo -----------------------------------
            ta = time.time()
            ra = sm.Analyze.RunAnalysis()
            D["run"] = ra
            D["t_analisis"] = round(time.time() - ta, 1)
            sm.Results.Setup.DeselectAllCasesAndCombosForOutput()
            for nm in sm.LoadCases.GetNameList()[1]:
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
                # JointDispl(name, itemType=2 grupo) -> r[6..11] = U1 U2 U3 R1 R2 R3
                # Se guardan TODOS los nudos del caso Dead, no solo el maximo:
                # el maximo dice si el orden de magnitud esta bien; el nudo a
                # nudo dice si el modelo esta bien. Son dos preguntas distintas
                # y la segunda es la que caza los errores locales.
                r = sm.Results.JointDispl("All", 2)
                n = r[0]
                por_caso, nudos = {}, {}
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

            # ---- fuerzas de BARRA, caso Dead, estacion a estacion -----------
            # Firma MEDIDA con `cli/_probe_firmas.py` (15 campos):
            #   [1]obj [2]objSta [3]elm [4]elmSta [5]loadCase [6]stepType
            #   [7]stepNum [8]P [9]V2 [10]V3 [11]T [12]M2 [13]M3
            # ⚠️ el AXIL es r[8], no r[4]: los siete primeros son etiquetas, y
            # la estacion del OBJETO es r[2] (r[4] es la del elemento mallado).
            try:
                r = sm.Results.FrameForce("All", 2)
                n = r[0]
                barras = {}
                for k in range(n):
                    if str(r[5][k]).lower() != "dead":
                        continue
                    barras.setdefault(str(r[1][k]), []).append(
                        [r[2][k], r[8][k], r[9][k], r[10][k], r[11][k], r[12][k], r[13][k]])
                D["frames"] = barras
            except Exception as ex:
                D["frames_error"] = str(ex)[:80]

            # ---- fuerzas de CASCARA, caso Dead ------------------------------
            # Firma MEDIDA (25 campos): [1]obj [2]elm [3]pointElm [4]loadCase
            #   [5]stepType [6]stepNum [7]F11 [8]F22 [9]F12 [10]FMax [11]FMin
            #   [12]FAngle [13]FVM [14]M11 [15]M22 [16]M12 [17]MMax [18]MMin
            #   [19]MAngle [20]V13 [21]V23 [22]VMax [23]VAngle
            # Se guardan los 4 puntos de cada area: promediarlos aqui perderia
            # justo el gradiente, que es lo que se quiere comparar.
            try:
                r = sm.Results.AreaForceShell("All", 2)
                n = r[0]
                sh = {}
                for k in range(n):
                    if str(r[4][k]).lower() != "dead":
                        continue
                    sh.setdefault(str(r[1][k]), []).append(
                        [str(r[3][k]), r[7][k], r[8][k], r[9][k],       # pto, F11 F22 F12
                         r[14][k], r[15][k], r[16][k],                  # M11 M22 M12
                         r[20][k], r[21][k]])                           # V13 V23
                D["shells"] = sh
            except Exception as ex:
                D["shells_error"] = str(ex)[:80]

            # ---- la BASCULA: masa ensamblada nudo a nudo --------------------
            # Antes que los modos. Si la masa no coincide, los periodos no
            # pueden coincidir y comparar T1 no informa de nada.
            # ⚠️ Firma MEDIDA (`cli/_probe_masa.py`): SOLO TRES argumentos.
            #   AssembledJointMass_1(nombre, "All", 2)
            #     -> [n, joint[], massSource[], U1[], U2[], U3[], R1[], R2[], R3[], ret]
            # Pasarle ademas los arrays de salida (los `0, 0, 0, 0, 0` que se
            # ven por ahi copiados) revienta con
            # «object of type 'int' has no len()», que no dice nada de la causa.
            # La variante sin `_1` tambien vale, pero sin la columna de fuente
            # de masa: [n, joint[], U1[], U2[], U3[], ...].
            try:
                r = sm.Results.AssembledJointMass_1("", "All", 2)
                n = r[0]
                D["masa"] = {str(r[1][k]): [r[3][k], r[4][k], r[5][k]] for k in range(n)}
                D["masa_total"] = [sum(r[3][:n]), sum(r[4][:n]), sum(r[5][:n])]
            except Exception as ex:
                D["masa_error"] = str(ex)[:80]

            try:
                r = sm.Results.ModalPeriod()
                D["modal"] = [{"mode": k + 1, "T": r[4][k], "f": r[5][k]}
                              for k in range(r[0])]
            except Exception as ex:
                D["modal_error"] = str(ex)[:80]

            try:
                r = sm.Results.ModalParticipatingMassRatios()
                n = r[0]
                col = dict(zip(["T", "UX", "UY", "UZ", "SumUX", "SumUY", "SumUZ",
                                "RX", "RY", "RZ", "SumRX", "SumRY", "SumRZ"], r[4:17]))
                D["modalmass"] = [dict([("mode", k + 1)] + [(kk, vv[k]) for kk, vv in col.items()])
                                  for k in range(n)]
            except Exception as ex:
                D["modalmass_error"] = str(ex)[:80]

            json.dump(D, open(jsn, "w", encoding="utf-8"))
    except Exception as ex:
        estado = "EXCEPCION " + str(ex)[:60]

    if estado == "ok":
        ok += 1
    else:
        fallo += 1
    T1 = ""
    if D.get("modal"):
        T1 = "  T1=%.4f" % D["modal"][0]["T"]
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
o.ApplicationExit(False)
