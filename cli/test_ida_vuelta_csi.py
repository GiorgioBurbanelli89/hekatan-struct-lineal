# -*- coding: utf-8 -*-
"""
TEST DE IDA Y VUELTA Hekatan <-> ETABS / SAP2000, DOS VUELTAS, sin cambiar un dato.

    python cli/test_ida_vuelta_csi.py cli/shots/boveda  cli/shots/ida_vuelta   [etabs|sap|ambos]

Con `base.e2k` y `base.s2k` escritos por Hekatan:

    E0 (Hekatan) -> ETABS abre y exporta -> E1 -> Hekatan lee y exporta -> H1 -> ETABS abre y exporta -> E2
    S0 (Hekatan) -> SAP2000 abre y exporta -> S1 -> Hekatan lee y exporta -> H1 -> SAP2000 abre y exporta -> S2

Cada par se compara con cli/comparar_csi_canonico.mjs (por COORDENADAS: CSI renumera).
SAP2000 24 no tiene un ExportFile que funcione por la OAPI: su .s2k se arma con SUS
tablas del modelo (DatabaseTables.GetTableForEditingArray) y la tabla de cargas nodales,
que esa vía devuelve vacía, con PointObj.GetLoadForce. Todo lo escribe SAP2000, no Hekatan.
ETABS y SAP2000 tienen que estar instalados; si ya están abiertos se reutiliza la instancia
y NO se cierran al terminar.
"""
import os, sys, subprocess, json

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
sys.path.insert(0, os.path.join(os.path.dirname(RAIZ), "csi-cli", "hekatan-csi-cli"))
import csi_cli as c  # noqa: E402

base = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "cli/shots/boveda")
out = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "cli/shots/ida_vuelta")
cual = sys.argv[3] if len(sys.argv) > 3 else "ambos"
os.makedirs(out, exist_ok=True)
nombre = os.path.basename(base)


def node(*args):
    r = subprocess.run(["node", *args], cwd=RAIZ, capture_output=True, text=True, encoding="utf-8")
    return r.returncode, (r.stdout or "") + (r.stderr or "")


def comparar(a, b):
    rc, txt = node("cli/comparar_csi_canonico.mjs", a, b)
    lineas = [l for l in txt.splitlines() if not l.startswith("[")]
    veredicto = next((l for l in reversed(lineas) if l.startswith("MISMO") or l.startswith("HAY")), "?")
    distintos = [l.strip() for l in lineas if "DISTINTO" in l or "solo en" in l and not l.strip().endswith("solo en B 0")]
    return rc == 0, veredicto, distintos


def abrir(S, engine, fichero):
    c.load_model_from_file(S, fichero, 6)
    S.SetPresentUnits(6)


def exportar_etabs(S, destino):
    c.export_model(S, "etabs", destino)


def exportar_sap(S, destino):
    S.SetPresentUnits(6)
    tablas = []
    # GetAvailableTables (las ~53 con datos), NO GetAllTables: leer las 1574 tablas de
    # GetAllTables deja a SAP2000 abriendo cualquier .s2k VACÍO después (medido 13-sep-2026:
    # 1 tabla leída → reabre con 135 nudos; las 1574 → reabre con 0).
    _, claves, *_ = S.DatabaseTables.GetAvailableTables()
    for k in claves:
        if k.lower() == "joint loads - force":
            continue
        try:
            ver, campos, nfilas, datos, ret = S.DatabaseTables.GetTableForEditingArray(k, "", 0, [], 0, [])
        except Exception:
            continue
        if ret != 0 or not nfilas:
            continue
        nc = len(campos)
        filas = []
        for i in range(nfilas):
            fila = datos[i * nc:(i + 1) * nc]
            filas.append("   " + "   ".join('%s=%s' % (cc, ('"%s"' % v) if " " in str(v) else v)
                                            for cc, v in zip(campos, fila) if v != ""))
        tablas.append(('TABLE:  "%s"' % k.upper(), filas))
    # GetTableForEditingArray abre una sesión de edición de tablas: se cancela por limpieza.
    # (13-sep-2026: tras la 1ª vuelta SAP2000 abría los .s2k VACÍOS; cancelar la edición NO lo
    # arregló — la causa sigue sin medir, ver la bitácora.)
    try:
        S.DatabaseTables.CancelTableEditing()
    except Exception:
        pass
    r = S.PointObj.GetLoadForce("ALL", 0, [], [], [], [], [], [], [], [], [], [], 1)
    n, pt, pat, _step, csys, F1, F2, F3, M1, M2, M3 = r[:11]
    filas = ["   Joint=%s   LoadPat=%s   CoordSys=%s   F1=%r   F2=%r   F3=%r   M1=%r   M2=%r   M3=%r"
             % (pt[i], pat[i], csys[i], F1[i], F2[i], F3[i], M1[i], M2[i], M3[i]) for i in range(n)]
    if n:
        tablas.append(('TABLE:  "JOINT LOADS - FORCE"', filas))
    txt = ["File %s  (escrito desde SAP2000 24: DatabaseTables + PointObj.GetLoadForce, unidades KN m C)" % destino, ""]
    for cab, filas in tablas:
        txt += [cab, *filas, " "]
    txt.append("END TABLE DATA")
    open(destino, "w", encoding="utf-8").write("\n".join(txt))
    print("  [SAP2000] exportado: %s (%d tablas, %d cargas nodales)" % (destino, len(tablas), n))


resumen = []


def ciclo(engine, ext, progid):
    import comtypes.client
    try:
        obj, S, _ = c.start_engine(engine, 6, True)
    except Exception as e:
        print("no arranca %s: %s" % (engine, e)); return
    exportar = exportar_etabs if engine == "etabs" else exportar_sap
    etiqueta = "ETABS" if engine == "etabs" else "SAP2000"
    x0 = base + "." + ext
    x1 = os.path.join(out, "%s_1_desde_%s.%s" % (nombre, engine, ext))
    h1 = os.path.join(out, "%s_2_hekatan.%s" % (nombre, ext))
    x2 = os.path.join(out, "%s_3_desde_%s.%s" % (nombre, engine, ext))
    print("\n=== %s: %s" % (etiqueta, x0))
    abrir(S, engine, x0); exportar(S, x1)
    rc, txt = node("cli/ida_vuelta_csi.mjs", x1, h1); print("  " + txt.strip().splitlines()[-1])
    abrir(S, engine, h1); exportar(S, x2)
    for a, b, que in ((x0, x1, "Hekatan -> %s" % etiqueta),
                      (x1, h1, "%s -> Hekatan" % etiqueta),
                      (h1, x2, "Hekatan -> %s (2a vuelta)" % etiqueta),
                      (x0, x2, "PRINCIPIO vs FINAL")):
        ok, ver, dist = comparar(a, b)
        print("  %-32s %s" % (que, ver))
        for d in dist[:6]:
            print("      " + d[:200])
        resumen.append({"programa": etiqueta, "paso": que, "igual": ok, "veredicto": ver, "diferencias": dist})


if cual in ("etabs", "ambos"):
    ciclo("etabs", "e2k", "CSI.ETABS.API.ETABSObject")
if cual in ("sap", "ambos"):
    ciclo("sap", "s2k", "CSI.SAP2000.API.SapObject")

json.dump(resumen, open(os.path.join(out, "resumen.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("\nRESUMEN")
for r in resumen:
    print("  %-8s %-32s %s" % (r["programa"], r["paso"], "OK" if r["igual"] else r["veredicto"]))
sys.exit(0 if resumen and all(r["igual"] for r in resumen) else 1)
