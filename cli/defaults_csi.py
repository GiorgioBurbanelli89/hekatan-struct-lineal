# -*- coding: utf-8 -*-
"""QUE TRAE DE FABRICA CADA PROGRAMA DE CSI (ETABS / SAP2000 / SAFE).

Jorge: «todo lo que por defecto tiene ETABS debe tenerlo Hekatan Struct —
releases, etc. Revisa que tiene por defecto y lo traes asi por defecto».

Se le pregunta AL PROGRAMA, no al manual: se crea un
modelo en blanco con una columna, una viga y un pano, y se leen los valores que
el programa pone SOLO. Es lo unico que no envejece con la version.

    python defaults_csi.py            # los tres
    python defaults_csi.py etabs      # uno

Sale `defaults_<programa>.json` y un resumen por consola.
"""
import json
import os
import sys

import comtypes.client

PROGS = {
    "etabs":    ("ETABSv1",    "CSI.ETABS.API.ETABSObject"),
    "sap2000":  ("SAP2000v1",  "CSI.SAP2000.API.SapObject"),
    # ⚠️ SAFE se pide con «...API.ETABSObject», no con «SAFEObject»: es el
    # ProgID que tiene registrado (leido de HKLM\SOFTWARE\Classes).
    "safe":     ("SAFEv1",     "CSI.SAFE.API.ETABSObject"),
}


def arrancar(prog):
    mod, progid = PROGS[prog]
    ultimo = None
    for m in (mod, "CSiAPIv1", "ETABSv1"):
        try:
            gen = __import__("comtypes.gen." + m, fromlist=["*"])
            h = comtypes.client.CreateObject(m + ".Helper")
            h = h.QueryInterface(getattr(gen, "cHelper"))
            break
        except Exception as ex:
            ultimo = ex
    else:
        raise ultimo
    obj = h.CreateObjectProgID(progid)
    try:
        obj.ApplicationStart()
    except TypeError:
        obj.ApplicationStart(6, True, "")
    return obj, obj.SapModel


def modelo_minimo(sm):
    """Una columna, una viga y un pano: lo minimo para que haya defaults que leer."""
    sm.InitializeNewModel(6)                     # kN, m, C
    try:
        sm.File.NewGridOnly(2, 3.0, 3.0, 2, 2, 4.0, 4.0)
    except Exception:
        sm.File.NewBlank()
    return sm


def leer(sm, get, *args, **kw):
    """Llama a un getter y devuelve su resultado, o el error como texto."""
    try:
        f = sm
        for parte in get.split("."):
            f = getattr(f, parte)
        return f(*args)
    except Exception as ex:
        return "ERROR: " + str(ex)[:110]


def barrer(prog):
    obj, sm = arrancar(prog)
    out = {"programa": prog}
    try:
        out["version"] = str(sm.GetVersion("", 0.0)[0])
    except Exception:
        pass
    modelo_minimo(sm)
    # ── MATERIALES que el programa mete por su cuenta ────────────────────────
    try:
        mats = [str(x) for x in sm.PropMaterial.GetNameList()[1]]
    except Exception:
        mats = []
    out["materiales_de_serie"] = {}
    for m in mats:
        r = leer(sm, "PropMaterial.GetWeightAndMass", m, 0.0, 0.0)
        if not isinstance(r, str):
            out["materiales_de_serie"][m] = {"peso_kN_m3": round(r[0], 6),
                                             "masa": round(r[1], 6)}
    # ── SECCIONES y AREAS de serie ───────────────────────────────────────────
    for k, g in (("secciones_de_serie", "PropFrame.GetNameList"),
                 ("areas_de_serie", "PropArea.GetNameList"),
                 ("patrones_de_carga", "LoadPatterns.GetNameList"),
                 ("casos_de_carga", "LoadCases.GetNameList"),
                 ("combos", "RespCombo.GetNameList"),
                 ("diafragmas", "Diaphragm.GetNameList")):
        r = leer(sm, g)
        out[k] = [str(x) for x in r[1]] if not isinstance(r, str) and len(r) > 1 else r
    # ── LO QUE LE PONE A UNA BARRA RECIEN DIBUJADA ───────────────────────────
    # Esto es el corazon del barrido: releases, brazos rigidos, modificadores,
    # punto de insercion, estaciones de salida. Son los que Hekatan tiene que
    # traer de fabrica.
    out["barra"] = {}
    try:
        col = sm.FrameObj.AddByCoord(0., 0., 0., 0., 0., 3., "", "", "COL", "Global")
        viga = sm.FrameObj.AddByCoord(0., 0., 3., 4., 0., 3., "", "", "VIGA", "Global")
        for nm, quien in (("COL", "columna"), ("VIGA", "viga")):
            d = {}
            r = leer(sm, "FrameObj.GetReleases", nm, [], [], [], [])
            d["releases"] = ([list(map(bool, r[0])), list(map(bool, r[1]))]
                             if not isinstance(r, str) else r)
            r = leer(sm, "FrameObj.GetEndLengthOffset", nm, True, 0., 0., 0.)
            d["end_length_offset"] = (["auto" if r[0] else "manual",
                                       round(r[1], 6), round(r[2], 6), round(r[3], 6)]
                                      if not isinstance(r, str) else r)
            r = leer(sm, "FrameObj.GetModifiers", nm, [])
            d["modificadores"] = ([round(float(x), 4) for x in r[0]]
                                  if not isinstance(r, str) and r[0] is not None else r)
            r = leer(sm, "FrameObj.GetInsertionPoint", nm, 0, False, False, [], "")
            d["insertion_point"] = str(r)[:120]
            r = leer(sm, "FrameObj.GetLocalAxes", nm, 0., False)
            d["angulo_eje_local"] = str(r)[:60]
            r = leer(sm, "FrameObj.GetOutputStations", nm, 0, 0., 0, False, False)
            d["output_stations"] = str(r)[:90]
            out["barra"][quien] = d
    except Exception as ex:
        out["barra"] = "ERROR: " + str(ex)[:120]

    # ── Y A UN PANO ──────────────────────────────────────────────────────────
    out["area"] = {}
    try:
        sm.AreaObj.AddByCoord(4, [0., 4., 4., 0.], [0., 0., 4., 4.],
                              [3., 3., 3., 3.], "", "", "PANO", "Global")
        r = leer(sm, "AreaObj.GetModifiers", "PANO", [])
        out["area"]["modificadores"] = ([round(float(x), 4) for x in r[0]]
                                        if not isinstance(r, str) and r[0] is not None else r)
        for k, g, args in (("propiedad", "AreaObj.GetProperty", ("PANO", "")),
                           ("auto_mesh", "AreaObj.GetAutoMesh", ("PANO", 0, 0, 0, 0., 0., False, False, False, 0., 0., "", "")),
                           ("edge_constraint", "AreaObj.GetEdgeConstraint", ("PANO", False)),
                           ("angulo_eje_local", "AreaObj.GetLocalAxes", ("PANO", 0., False))):
            out["area"][k] = str(leer(sm, g, *args))[:120]
    except Exception as ex:
        out["area"] = "ERROR: " + str(ex)[:120]

    # ── FUENTE DE MASA ───────────────────────────────────────────────────────
    for g, args in (("PropMaterial.GetMassSource", ()),
                    ("SourceMass.GetMassSource_1", ("", False, False, False, False, 0, [], [])),
                    ("Func.FuncRS.GetNameList", ())):
        r = leer(sm, g, *args)
        if not isinstance(r, str):
            out["mass_source"] = str(r)[:140]
            break
    else:
        out["mass_source"] = "no legible por OAPI"
    obj.ApplicationExit(False)
    return out


def main():
    quiere = [a.lower() for a in sys.argv[1:] if a.lower() in PROGS] or list(PROGS)
    for p in quiere:
        print("\n" + "=" * 62)
        print("  %s" % p.upper())
        print("=" * 62)
        try:
            d = barrer(p)
        except Exception as ex:
            print("   no se pudo arrancar: %s" % str(ex)[:140])
            continue
        f = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                         "defaults_%s.json" % p)
        json.dump(d, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        for k, v in d.items():
            if isinstance(v, list):
                print("   %-22s %s" % (k, v[:6] if len(v) > 6 else v))
            elif isinstance(v, dict):
                print("   %-22s %d" % (k, len(v)))
                for kk, vv in list(v.items())[:8]:
                    print("        %-14s %s" % (kk, vv))
            else:
                print("   %-22s %s" % (k, str(v)[:90]))
        print("   -> %s" % os.path.basename(f))


if __name__ == "__main__":
    main()
