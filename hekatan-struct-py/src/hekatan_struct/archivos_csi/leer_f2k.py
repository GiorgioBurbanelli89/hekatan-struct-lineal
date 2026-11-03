# -*- coding: utf-8 -*-
"""Lector de `.f2k` (SAFE) -> `ModeloCSI`.

Fuente: `f2kExporter.ts` / `f2kCimentacionImporter.ts` y los `.f2k` que escribe SAFE. Los campos van
por NOMBRE (`"Total Thickness"`, `"Stiffness UZ"`), no por clave.

⚠️ SAFE analiza las barras con 0.1·J: el modelo que sale lleva `torsion safe` (J x 0.1), de modo que el
motor Python reproduce a SAFE; el escritor `.f2k` multiplica por 10 para que SAFE analice la J del modelo.
SAFE es un programa de LOSAS Y CIMENTACION: no hay diafragmas, ni paredes, ni solidos.
"""
from __future__ import annotations

import re

from ._comun import (Constructor, ModeloCSI, flt, si, tablas, unidades, sec_circular, sec_rectangular)

_PROC = {"X": 0, "Y": 1, "Z": 2}


def leer_f2k(ruta: str, *, comportamiento: str | None = None) -> ModeloCSI:
    with open(ruta, "rb") as fh:
        raw = fh.read()
    try:
        texto = raw.decode("utf-8")
    except UnicodeDecodeError:
        texto = raw.decode("latin-1")
    return desde_texto_f2k(texto, origen=ruta, comportamiento=comportamiento)


def _nom(d: dict, *claves):
    for k in claves:
        if k in d:
            return d[k]
    return None


def desde_texto_f2k(texto: str, *, origen: str = "", comportamiento: str | None = None) -> ModeloCSI:
    b = Constructor("safe", origen)
    av = b.aviso
    Ff = Lf = 1.0
    mats, secs, slabs, pts = {}, {}, {}, {}
    fconn, aconn = [], []
    f_sec, a_sec = {}, {}
    restr, spr_def, spr_asg, aspr_def, aspr_asg = {}, {}, {}, {}, {}
    cj, cf = [], []
    patrones: dict[str, tuple] = {}
    combos: dict[str, dict] = {}
    offs, ins = {}, {}
    ncol = 0
    otras = 0
    otros_obj = 0
    for tabla, d in tablas(texto):
        if tabla == "PROGRAM CONTROL":
            cu = d.get("CurrUnits")
            if cu:
                p = [x.strip() for x in cu.split(",")]
                Ff, Lf = unidades(p[0], p[1] if len(p) > 1 else "m")
        elif tabla == "MATERIAL PROPERTIES - BASIC MECHANICAL PROPERTIES":
            mats[d["Material"]] = d
        elif tabla == "FRAME SECTION PROPERTY DEFINITIONS - SUMMARY":
            secs[d["Name"]] = d
        elif tabla == "FRAME SECTION PROPERTY DEFINITIONS - GENERAL":
            secs.setdefault(d["Name"], d).update({"_depth": d.get("Depth"), "_width": d.get("Width")})
        elif tabla == "FRAME SECTION PROPERTY DEFINITIONS - CONCRETE RECTANGULAR":
            secs.setdefault(d["Name"], {"Name": d["Name"], "Material": d.get("Material", "")}).update(
                {"_rect": (flt(d, "Depth"), flt(d, "Width"))})
        elif tabla == "SLAB PROPERTY DEFINITIONS":
            slabs[d["Name"]] = d
        elif tabla == "AREA SECTION PROPERTY DEFINITIONS - SUMMARY":
            slabs.setdefault(d["Name"], {"Name": d["Name"], "Material": d.get("Material", ""),
                                         "Slab Thickness": d.get("Total Thickness", "0"),
                                         "Modeling Type": d.get("Element Type", "Shell-Thick")})
        elif tabla == "POINT OBJECT CONNECTIVITY":
            pts[d["UniqueName"]] = (flt(d, "X"), flt(d, "Y"), flt(d, "Z"))
        elif tabla in ("BEAM OBJECT CONNECTIVITY", "COLUMN OBJECT CONNECTIVITY", "BRACE OBJECT CONNECTIVITY"):
            nm = _nom(d, "Unique Name", "UniqueName")
            fconn.append((nm, d.get("UniquePtI"), d.get("UniquePtJ")))
            if tabla.startswith("COLUMN"):
                ncol += 1
        elif tabla == "FLOOR OBJECT CONNECTIVITY":
            nm = _nom(d, "Unique Name", "UniqueName")
            ps = [d.get("UniquePt%d" % k) for k in range(1, 5) if d.get("UniquePt%d" % k)]
            aconn.append((nm, ps))
        elif tabla in ("WALL OBJECT CONNECTIVITY", "RAMP OBJECT CONNECTIVITY"):
            otros_obj += 1
        elif tabla == "FRAME ASSIGNMENTS - SECTION PROPERTIES":
            f_sec[d["UniqueName"]] = d.get("Section Property", "")
        elif tabla == "AREA ASSIGNMENTS - SECTION PROPERTIES":
            a_sec[d["UniqueName"]] = d.get("Section Property", "")
        elif tabla == "JOINT ASSIGNMENTS - RESTRAINTS":
            restr[d["UniqueName"]] = [si(d.get(k, "No")) for k in ("UX", "UY", "UZ", "RX", "RY", "RZ")]
        elif tabla == "SPRING PROPERTY DEFINITIONS - POINT SPRINGS":
            spr_def[d["Name"]] = [flt(d, "Stiffness " + k) for k in ("UX", "UY", "UZ", "RX", "RY", "RZ")]
        elif tabla == "JOINT ASSIGNMENTS - SPRINGS":
            spr_asg[d["UniqueName"]] = d.get("SpringProp", "")
        elif tabla == "SPRING PROPERTY DEFINITIONS - AREA SPRINGS":
            ks = flt(d, "Subgrade Modulus") or flt(d, "Stiffnes U3") or flt(d, "Stiffness U3")
            aspr_def[d["Name"]] = ks
        elif tabla == "AREA ASSIGNMENTS - AREA SPRINGS":
            aspr_asg[d["UniqueName"]] = d.get("Spring Property", "")
        elif tabla == "LOAD PATTERN DEFINITIONS":
            patrones[d["Name"]] = (d.get("Type", "Other"), flt(d, "Self Weight Multiplier"))
        elif tabla == "LOAD CASE DEFINITIONS - SUMMARY":
            if d.get("Type", "Linear Static") != "Linear Static":
                otras += 1
        elif tabla in ("COMBINATION DEFINITIONS", "LOAD COMBINATION DEFINITIONS"):
            nm = d.get("Name") or d.get("ComboName")
            c = combos.setdefault(nm, {"nombre": nm, "tipo": "Linear Add", "items": []})
            if "Type" in d:
                c["tipo"] = d["Type"]
            ln = d.get("Load Name")
            if ln is not None:
                c["items"].append((ln, flt(d, "Scale Factor", flt(d, "SF", 1.0))))
        elif tabla == "JOINT LOADS ASSIGNMENTS - FORCE":
            cj.append(d)
        elif tabla == "FRAME LOADS ASSIGNMENTS - DISTRIBUTED":
            cf.append(d)
        elif tabla == "FRAME ASSIGNMENTS - END LENGTH OFFSETS":
            offs[d["UniqueName"]] = d
        elif tabla == "FRAME ASSIGNMENTS - INSERTION POINT":
            ins[d["UniqueName"]] = d

    tens, peso = Ff / Lf ** 2, Ff / Lf ** 3
    kT, kR = Ff / Lf, Ff * Lf
    b.flags.append("etabsjoint 0")
    b.torsion_safe = True

    def mat(nombre):
        m = mats.get(nombre, {})
        w = flt(m, "UnitWeight") * peso
        return dict(E=flt(m, "E1") * tens, nu=flt(m, "U12", 0.2), rho=w / 9.80665, nombre=nombre)

    nid = {}
    for k, (name, p) in enumerate(pts.items()):
        nid[name] = b.nodo(p[0] * Lf, p[1] * Lf, p[2] * Lf, (k,), nombre=name, fundir=False)

    fid_de = {}
    n_nulo = 0
    for name, ja, jb in fconn:
        s = secs.get(f_sec.get(name, ""))
        if s is None or ja not in nid or jb not in nid:
            n_nulo += 1
            continue
        A = flt(s, "Area") * Lf ** 2
        if A > 0:
            p = dict(A=A, I33=flt(s, "I33") * Lf ** 4, I22=flt(s, "I22") * Lf ** 4, J=flt(s, "J") * Lf ** 4,
                     As2=flt(s, "As2") * Lf ** 2 or 5 / 6 * A, As3=flt(s, "As3") * Lf ** 2 or 5 / 6 * A,
                     D=flt(s, "Depth") * Lf, B=flt(s, "Width") * Lf)
            if "_rect" in s and not p["D"]:
                p["D"], p["B"] = s["_rect"][0] * Lf, s["_rect"][1] * Lf
        elif "_rect" in s:
            p = sec_rectangular(s["_rect"][0] * Lf, s["_rect"][1] * Lf)
        else:
            n_nulo += 1
            continue
        m = mat(s.get("Material", ""))
        f = [flt(s, k, 1.0) for k in ("Area Modifier", "As2 Modifier", "As3 Modifier", "J Modifier",
                                      "I22 Modifier", "I33 Modifier", "Mass Modifier", "Weight Modifier")]
        eo = None
        o = offs.get(name)
        if o and (flt(o, "Offset I") or flt(o, "Offset J")):
            eo = (flt(o, "Offset I") * Lf, flt(o, "Offset J") * Lf, flt(o, "Rigid Factor"))
        cp, tr = None, True
        i_ = ins.get(name)
        if i_:
            mm = re.match(r"\s*(\d+)", i_.get("Cardinal Point", "10"))
            c = int(mm.group(1)) if mm else 10
            cp = c if c != 10 else None
            tr = not si(i_.get("No Transform Stiffness", "No"))
            if cp:
                av("punto de inserción ≠ 10 en .f2k: el signo de los laterales no está medido contra SAFE", una_vez=True)
        fid_de[name] = b.barra(name, nid[ja], nid[jb], E=m["E"], nu=m["nu"], rho=m["rho"] * f[7],
                               A=p["A"] * f[0], I22=p["I22"] * f[4], I33=p["I33"] * f[5], J=p["J"] * f[3],
                               As2=p["As2"] * f[1], As3=p["As3"] * f[2], D=p.get("D", 0.0), B=p.get("B", 0.0),
                               sec=f_sec.get(name, ""), mat=m["nombre"], eo=eo, cp=cp, tr=tr)
    if n_nulo:
        av("%d barras sin sección/nudos: omitidas" % n_nulo)
    if ncol:
        av("%d columnas (COLUMN OBJECT CONNECTIVITY) leídas como barras" % ncol)

    sid_de = {}
    n_tri = n_sec = 0
    for name, ps in aconn:
        if len(ps) != 4:
            n_tri += 1
            continue
        s = slabs.get(a_sec.get(name, ""))
        if s is None or any(p not in nid for p in ps):
            n_sec += 1
            continue
        m = mat(s.get("Material", ""))
        mods = [flt(s, k + " Modifier", 1.0) for k in ("f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23")]
        wm = flt(s, "Weight Modifier", 1.0)
        tipo = s.get("Modeling Type", "Shell-Thick")
        if tipo == "Membrane":
            mods[3:6] = [0.0, 0.0, 0.0]
        ks = aspr_def.get(aspr_asg.get(name, ""), 0.0) * Ff / Lf ** 3
        sid_de[name] = b.cascara(name, [nid[p] for p in ps], t=flt(s, "Slab Thickness") * Lf, E=m["E"],
                                 nu=m["nu"], rho=m["rho"] * wm, mods=mods, thin=(tipo == "Shell-Thin"),
                                 prop=a_sec.get(name, ""), mat=m["nombre"], ks=ks)
    if n_tri:
        av("%d losas no cuadriláteras omitidas" % n_tri)
    if n_sec:
        av("%d losas sin propiedad omitidas" % n_sec)
    if otros_obj:
        av("objetos de pared/rampa no se leen")
    if any(s.get("Property Type") in ("Mat", "Footing") for s in slabs.values()):
        av("losas Mat/Footing: se montan como losa; el muelle de área se lee de las asignaciones", una_vez=True)

    for j, fl in restr.items():
        if j in nid:
            b.apoyo(nid[j], fl)
    for j, sp in spr_asg.items():
        if j in nid and sp in spr_def:
            for g, v in enumerate(spr_def[sp]):
                b.muelle(nid[j], g, v * (kT if g < 3 else kR))

    for pat, (tp, sw) in patrones.items():
        b.patron(pat, tp, sw)
    for d in cj:
        j = d.get("UniqueName")
        if j in nid:
            v = [flt(d, k) for k in ("FX", "FY", "FZ")]
            mm = [flt(d, k) for k in ("MX", "MY", "MZ")]
            b.carga_nodo(d["Load Pattern"], nid[j], [x * Ff for x in v] + [x * kR for x in mm])
    n_x = 0
    for d in cf:
        fid = fid_de.get(d.get("UniqueName"))
        fa, fb = flt(d, "Force A") * kT, flt(d, "Force B") * kT
        tot = (d.get("Distance Type", "Relative") == "Relative" and flt(d, "Relative Distance A") == 0
               and flt(d, "Relative Distance B", 1.0) == 1.0 and abs(fa - fb) < 1e-12)
        dr = d.get("Direction", "Gravity")
        if fid is None or not tot or d.get("Load Type", "Force") != "Force":
            n_x += 1
        elif dr.lower().startswith("grav"):
            b.carga_barra(d["Load Pattern"], fid, (0.0, 0.0, -fa))
        elif dr in _PROC:
            w = [0.0] * 3
            w[_PROC[dr]] = fa
            b.carga_barra(d["Load Pattern"], fid, w)
        else:
            n_x += 1
    if n_x:
        av("%d cargas de barra no uniformes/globales: no viajan" % n_x)
    if otras:
        av("%d casos no estáticos no viajan" % otras)
    b.combos = list(combos.values())
    return b.construir(comportamiento)
