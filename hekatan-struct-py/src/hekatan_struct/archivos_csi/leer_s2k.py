# -*- coding: utf-8 -*-
"""Lector de `.s2k` / `.$2k` (SAP2000, formato de TABLAS v15+) -> `ModeloCSI`.

Fuente: `examples/src/shared/s2kParser.ts`. El formato antiguo (bloques SYSTEM/JOINT/SHELL, v6-v14)
NO se lee: se avisa con un error claro.
"""
from __future__ import annotations

import re

from ._comun import (Constructor, ModeloCSI, flt, si, tablas, unidades, sec_angulo, sec_canal,
                     sec_circular, sec_perfil_i, sec_rectangular, sec_tubo)

_GDL = ("PI", "V2I", "V3I", "TI", "M2I", "M3I", "PJ", "V2J", "V3J", "TJ", "M2J", "M3J")


def leer_s2k(ruta: str, *, comportamiento: str | None = None) -> ModeloCSI:
    with open(ruta, "rb") as fh:
        raw = fh.read()
    try:
        texto = raw.decode("utf-8")
    except UnicodeDecodeError:
        texto = raw.decode("latin-1")
    return desde_texto_s2k(texto, origen=ruta, comportamiento=comportamiento)


def _forma(d: dict, Lf: float):
    """Propiedades de una fila FRAME SECTION PROPERTIES 01 (m, kN)."""
    shape = d.get("Shape", "")
    t3, t2 = flt(d, "t3") * Lf, flt(d, "t2") * Lf
    A = flt(d, "Area") * Lf ** 2
    if A > 0:
        return dict(A=A, I33=flt(d, "I33") * Lf ** 4, I22=flt(d, "I22") * Lf ** 4,
                    J=flt(d, "TorsConst") * Lf ** 4, As2=flt(d, "AS2") * Lf ** 2 or 5 / 6 * A,
                    As3=flt(d, "AS3") * Lf ** 2 or 5 / 6 * A, D=t3, B=t2)
    tf, tw = flt(d, "tf") * Lf, flt(d, "tw") * Lf
    if shape == "Rectangular":
        return sec_rectangular(t3, t2)
    if shape == "Circle":
        return sec_circular(t3)
    if shape == "I/Wide Flange":
        return sec_perfil_i(t3, t2, tf, tw, flt(d, "t2b") * Lf or None, flt(d, "tfb") * Lf or None)
    if shape == "Box/Tube":
        return sec_tubo(t2, t3, tf, tw)
    if shape == "Channel":
        return sec_canal(t3, t2, tf, tw)
    if shape == "Angle":
        return sec_angulo(t3, t2, tf, tw)
    return None


def desde_texto_s2k(texto: str, *, origen: str = "", comportamiento: str | None = None) -> ModeloCSI:
    b = Constructor("sap2000", origen)
    av = b.aviso
    if "TABLE:" not in texto:
        raise ValueError("formato .s2k antiguo (bloques SYSTEM/JOINT, v6-v14) no soportado: "
                         "guarda el modelo con SAP2000 v15+ (formato de tablas)")
    Ff = Lf = 1.0
    mats, secs, shell_secs = {}, {}, {}
    joints: dict[str, tuple] = {}
    fconn: list[tuple] = []
    aconn: list[tuple] = []
    f_sec, a_sec = {}, {}
    restr, springs, areaspr = {}, {}, {}
    rels, offs, angs, ins, mods_a = {}, {}, {}, {}, {}
    cargas_j, cargas_f, cargas_a = [], [], []
    patrones: dict[str, tuple] = {}
    constr: dict[str, str] = {}
    combos: dict[str, dict] = {}
    n_solid = 0
    otras = 0
    for tabla, d in tablas(texto):
        if tabla == "PROGRAM CONTROL":
            cu = d.get("CurrUnits")
            if cu:
                p = [x.strip() for x in cu.split(",")]
                Ff, Lf = unidades(p[0], p[1] if len(p) > 1 else "m")
        elif tabla == "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES":
            mats[d["Material"]] = d
        elif tabla == "FRAME SECTION PROPERTIES 01 - GENERAL":
            secs[d["SectionName"]] = d
        elif tabla == "AREA SECTION PROPERTIES":
            shell_secs[d["Section"]] = d
        elif tabla == "JOINT COORDINATES":
            if d.get("CoordType", "Cartesian").lower() != "cartesian" or d.get("CoordSys", "GLOBAL").upper() != "GLOBAL":
                av("coordenadas no cartesianas / sistema local: no soportado", una_vez=True)
            joints[d["Joint"]] = (flt(d, "XorR"), flt(d, "Y"), flt(d, "Z"))
        elif tabla == "CONNECTIVITY - FRAME":
            fconn.append((d["Frame"], d["JointI"], d["JointJ"]))
        elif tabla == "CONNECTIVITY - AREA":
            n = int(float(d.get("NumJoints", 4)))
            aconn.append((d["Area"], [d.get("Joint%d" % j) for j in range(1, n + 1)]))
        elif tabla == "CONNECTIVITY - SOLID":
            n_solid += 1
        elif tabla == "FRAME SECTION ASSIGNMENTS":
            f_sec[d["Frame"]] = d.get("AnalSect", "")
        elif tabla == "AREA SECTION ASSIGNMENTS":
            a_sec[d["Area"]] = d.get("Section", "")
        elif tabla == "JOINT RESTRAINT ASSIGNMENTS":
            restr[d["Joint"]] = [si(d.get(k, "No")) for k in ("U1", "U2", "U3", "R1", "R2", "R3")]
        elif tabla == "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED":
            springs[d["Joint"]] = [flt(d, k) for k in ("U1", "U2", "U3", "R1", "R2", "R3")]
        elif tabla == "AREA SPRING ASSIGNMENTS":
            ks = flt(d, "Stiffness")
            vz = abs(flt(d, "VecZ", 1.0))
            if "Dir" in d and d["Dir"] not in ("3", "Z"):
                av("muelle de área en dirección %s: solo se toma U3 (normal)" % d["Dir"], una_vez=True)
            elif vz < 0.5 and ("VecX" in d or "VecY" in d):
                av("muelle de área en dirección local no normal: no viaja", una_vez=True)
            else:
                areaspr[d["Area"]] = areaspr.get(d["Area"], 0.0) + ks
        elif tabla == "FRAME RELEASE ASSIGNMENTS 1 - GENERAL":
            v = [si(d.get(k, "No")) for k in _GDL]
            if any(v):
                rels[d["Frame"]] = v
        elif tabla == "FRAME OFFSET ALONG LENGTH ASSIGNMENTS":
            offs[d["Frame"]] = d
        elif tabla == "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL":
            angs[d["Frame"]] = flt(d, "Angle")
        elif tabla == "FRAME INSERTION POINT ASSIGNMENTS":
            m = re.match(r"\s*(\d+)", d.get("CardinalPt", "10"))
            ins[d["Frame"]] = (int(m.group(1)) if m else 10, si(d.get("Transform", "Yes")))
        elif tabla == "AREA STIFFNESS MODIFIERS":
            mods_a[d["Area"]] = [flt(d, k, 1.0) for k in ("f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23")]
            if "WeightMod" in d and flt(d, "WeightMod", 1.0) != 1.0:
                mods_a[d["Area"]].append(flt(d, "WeightMod", 1.0))
        elif tabla == "LOAD PATTERN DEFINITIONS":
            patrones[d["LoadPat"]] = (d.get("DesignType", "Other"), flt(d, "SelfWtMult"))
        elif tabla == "LOAD CASE DEFINITIONS":
            if d.get("Type", "LinStatic") != "LinStatic" and d.get("Case") != "MODAL":
                otras += 1
        elif tabla == "JOINT LOADS - FORCE":
            cargas_j.append(d)
        elif tabla == "FRAME LOADS - DISTRIBUTED":
            cargas_f.append(d)
        elif tabla == "AREA LOADS - UNIFORM":
            cargas_a.append(d)
        elif tabla == "CONSTRAINT DEFINITIONS - DIAPHRAGM":
            constr[d["Name"]] = d.get("Axis", "Z")
        elif tabla == "JOINT CONSTRAINT ASSIGNMENTS":
            constr.setdefault("_asig", {})[d["Joint"]] = d["Constraint"]   # type: ignore[index]
        elif tabla == "COMBINATION DEFINITIONS":
            c = combos.setdefault(d["ComboName"], {"nombre": d["ComboName"], "tipo": "Linear Add", "items": []})
            if "ComboType" in d:
                c["tipo"] = d["ComboType"]
            if "CaseName" in d:
                c["items"].append((d["CaseName"], flt(d, "ScaleFactor", 1.0)))

    tens, peso = Ff / Lf ** 2, Ff / Lf ** 3
    kT, kR = Ff / Lf, Ff * Lf
    b.flags.append("etabsjoint 0")          # SAP2000 no tiene la union viga-muro de ETABS

    def mat(nombre: str):
        m = mats.get(nombre, {})
        w = flt(m, "UnitWeight") * peso
        rho = w / 9.80665 if w else flt(m, "UnitMass") * Ff / Lf ** 4 * Lf  # UnitMass en kN·s²/m4 -> t/m3
        return dict(E=flt(m, "E1") * tens, nu=flt(m, "U12", 0.2), rho=rho, nombre=nombre)

    nid = {}
    for k, (name, p) in enumerate(joints.items()):
        nid[name] = b.nodo(p[0] * Lf, p[1] * Lf, p[2] * Lf, (k,), nombre=name, fundir=False)

    fid_de = {}
    n_nulo = 0
    for name, ja, jb in fconn:
        sname = f_sec.get(name)
        s = secs.get(sname or "")
        if s is None or ja not in nid or jb not in nid:
            n_nulo += 1
            continue
        p = _forma(s, Lf)
        if p is None:
            av("sección «%s» (%s) sin propiedades: omitida" % (sname, s.get("Shape")), una_vez=True)
            n_nulo += 1
            continue
        m = mat(s.get("Material", ""))
        f = [flt(s, k, 1.0) for k in ("AMod", "A2Mod", "A3Mod", "JMod", "I2Mod", "I3Mod", "MMod", "WMod")]
        r = rels.get(name)
        eo = None
        o = offs.get(name)
        if o:
            if o.get("Type", "User").lower() not in ("user",):
                av("offsets «%s» (no User): no viajan" % o.get("Type"), una_vez=True)
            else:
                eo = (flt(o, "LengthI") * Lf, flt(o, "LengthJ") * Lf, flt(o, "RigidFactor"))
        cp, tr = ins.get(name, (None, True))
        fid_de[name] = b.barra(name, nid[ja], nid[jb], E=m["E"], nu=m["nu"], rho=m["rho"] * f[7],
                               A=p["A"] * f[0], I22=p["I22"] * f[4], I33=p["I33"] * f[5], J=p["J"] * f[3],
                               As2=p["As2"] * f[1], As3=p["As3"] * f[2], D=p.get("D", 0.0), B=p.get("B", 0.0),
                               sec=sname, mat=m["nombre"], ang=angs.get(name, 0.0), rel=r, eo=eo,
                               cp=cp if cp and cp != 10 else None, tr=tr)
    if n_nulo:
        av("%d barras sin sección o sin nudos: omitidas" % n_nulo)

    sid_de = {}
    n_tri = n_sec = 0
    for name, js in aconn:
        if len(js) != 4:
            n_tri += 1
            continue
        s = shell_secs.get(a_sec.get(name, ""))
        if s is None or any(j not in nid for j in js):
            n_sec += 1
            continue
        tipo = s.get("Type", "Shell-Thick")
        m = mat(s.get("Material", ""))
        mods = list(mods_a.get(name, [1.0] * 8))
        wm = 1.0
        if len(mods) == 9:
            wm = mods.pop()
        if tipo == "Membrane":
            mods[3:6] = [0.0, 0.0, 0.0]
        elif tipo.startswith("Plate"):
            av("tipo de cáscara «%s»: el motor la monta como Shell" % tipo, una_vez=True)
        elif tipo not in ("Shell-Thin", "Shell-Thick"):
            av("tipo de área «%s» no soportado: se monta como Shell-Thick" % tipo, una_vez=True)
        sid_de[name] = b.cascara(name, [nid[j] for j in js], t=flt(s, "Thickness") * Lf, E=m["E"], nu=m["nu"],
                                 rho=m["rho"] * wm, mods=mods, thin=(tipo in ("Shell-Thin", "Plate-Thin")),
                                 prop=a_sec.get(name, ""), mat=m["nombre"], ks=areaspr.get(name, 0.0) * Ff / Lf ** 3,
                                 oneway=False)
    if n_tri:
        av("%d áreas no cuadriláteras omitidas (el motor Python solo monta Q4)" % n_tri)
    if n_sec:
        av("%d áreas sin propiedad o con nudos inexistentes omitidas" % n_sec)
    if n_solid:
        av("%d sólidos (CONNECTIVITY - SOLID) no se leen" % n_solid)
    if any(a in areaspr and a not in sid_de for a in areaspr):
        av("muelles de área sobre áreas omitidas")

    for j, fl in restr.items():
        if j in nid:
            b.apoyo(nid[j], fl)
    for j, k in springs.items():
        if j in nid:
            for g, v in enumerate(k):
                b.muelle(nid[j], g, v * (kT if g < 3 else kR))
    asig = constr.get("_asig", {})
    grp = {}
    for j, c in asig.items():
        if j in nid and c in constr:
            b.diaf[nid[j]] = grp.setdefault(c, len(grp) + 1)
        elif c not in constr:
            av("restricción «%s» que no es diafragma: no viaja" % c, una_vez=True)

    for pat, (tp, sw) in patrones.items():
        b.patron(pat, tp, sw)
    for d in cargas_j:
        j = d.get("Joint")
        if j in nid:
            b.carga_nodo(d["LoadPat"], nid[j], [flt(d, "F1") * Ff, flt(d, "F2") * Ff, flt(d, "F3") * Ff,
                                                flt(d, "M1") * kR, flt(d, "M2") * kR, flt(d, "M3") * kR])
    n_x = 0
    for d in cargas_f:
        fid = fid_de.get(d.get("Frame"))
        dr, cs = d.get("Dir", ""), d.get("CoordSys", "GLOBAL").upper()
        fa = flt(d, "FOverLA") * kT
        fb = flt(d, "FOverLB", flt(d, "FOverLA")) * kT
        ra = flt(d, "RelDistA") if d.get("DistType", "RelDist") == "RelDist" else None
        rb = flt(d, "RelDistB", 1.0) if d.get("DistType", "RelDist") == "RelDist" else None
        total = ra == 0 and rb == 1 and abs(fa - fb) < 1e-12
        if fid is None or d.get("Type", "Force") != "Force" or cs != "GLOBAL" or not total:
            n_x += 1
            continue
        if dr in ("X", "Y", "Z"):
            w = [0.0] * 3
            w["XYZ".index(dr)] = fa
            b.carga_barra(d["LoadPat"], fid, w)
        elif dr.lower().startswith("grav"):
            b.carga_barra(d["LoadPat"], fid, (0.0, 0.0, -fa))
        else:
            n_x += 1
    if n_x:
        av("%d cargas de barra que no son uniformes globales de extremo a extremo (parciales, trapecio, locales, momentos): no viajan" % n_x)
    n_xa = 0
    for d in cargas_a:
        sid = sid_de.get(d.get("Area"))
        dr, q = d.get("Dir", ""), flt(d, "UnifLoad") * Ff / Lf ** 2
        if sid is None or not q:
            n_xa += 1 if sid is None else 0
            continue
        if d.get("CoordSys", "GLOBAL").upper() != "GLOBAL":
            n_xa += 1
        elif dr == "Z":
            b.carga_area(d["LoadPat"], sid, q)
        elif dr.lower().startswith("grav"):
            b.carga_area(d["LoadPat"], sid, -q)
        else:
            n_xa += 1
    if n_xa:
        av("%d cargas de área no uniformes en Z/Gravity globales: no viajan" % n_xa)
    if otras:
        av("%d casos no estáticos (modal, espectro, historia…) no viajan" % otras)
    b.combos = list(combos.values())
    return b.construir(comportamiento)
