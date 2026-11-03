# -*- coding: utf-8 -*-
"""Escritor de `.s2k` (SAP2000 v24, formato de TABLAS) desde un `ModeloHeks`/`ModeloCSI`.

Espejo de `examples/src/shared/s2kExporter.ts` (medido contra SAP2000 24), con patrones, combinaciones,
liberaciones, brazos, angulo, punto de insercion, muelles (nudo y area), diafragmas y modificadores.

⚠️ El fichero va en kN y m y `CurrUnits="KN, m, C"` lo dice (etiquetar otras unidades sin convertir hace
que SAP2000 lea las fuerzas escaladas). ⚠️ Secciones `Shape=General`: con una forma nominal SAP2000
recalcula I22 y J desde t3/t2 y tira los valores escritos.
"""
from __future__ import annotations

import math

from ._escribir import NOMBRE_CARDINAL, Vista, limpio


def _f(v: float) -> str:
    if v == 0 or abs(v) < 1e-15:
        return "0"
    if abs(v) >= 1e6 or abs(v) < 1e-3:
        return "%.12e" % v
    return "%.13g" % v


def _yn(b) -> str:
    return "Yes" if b else "No"


def _q(s: str) -> str:
    """Valor de tabla: entre comillas si lleva espacios."""
    return '"%s"' % s if (" " in s or "," in s or "=" in s) else s


def escribir_s2k(modelo, ruta: str | None = None, *, titulo: str | None = None):
    """→ (texto, avisos)."""
    V = Vista(modelo)
    m, ei, ni = V.m, V.ei, V.ni
    avisos = [a for a in V.avisos if not a.startswith("unión viga-muro")]
    if m.programa != "sap2000" and V.frames and ei.etabs_wall_joint and any(V.vertical(k) for k in V.shells):
        avisos.append("unión viga-muro de ETABS: SAP2000 no la tiene; el resultado puede diferir (en el TS se añaden "
                      "barras fantasma articuladas)")
    L: list[str] = []
    push = L.append
    blank = lambda: L.append(" ")
    push("File %s.$2k was saved on m/d/yy at h:mm:ss" % limpio(titulo or m.titulo or "Hekatan"))
    blank()
    push('TABLE:  "ACTIVE DEGREES OF FREEDOM"')
    push("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes")
    blank()
    # conectividad
    ids = V.ids
    if V.frames:
        push('TABLE:  "CONNECTIVITY - FRAME"')
        for k in V.frames:
            a, b = m.elements[k]
            push("   Frame=%d   JointI=%d   JointJ=%d   IsCurved=No" % (k + 1, ids[a], ids[b]))
        blank()
    if V.shells:
        push('TABLE:  "CONNECTIVITY - AREA"')
        for k in V.shells:
            c = m.elements[k]
            push("   Area=%d   NumJoints=4   %s" % (k + 1, "   ".join("Joint%d=%d" % (j + 1, ids[n]) for j, n in enumerate(c))))
        blank()
    if V.solidos:
        push('TABLE:  "CONNECTIVITY - SOLID"')
        for k in V.solidos:
            e = m.elements[k]
            o = [e[0], e[1], e[3], e[2], e[4], e[5], e[7], e[6]]       # orden tensorial de CSI
            push("   Solid=%d   %s" % (k + 1, "   ".join("Joint%d=%d" % (j + 1, ids[n]) for j, n in enumerate(o))))
        blank()
    push('TABLE:  "COORDINATE SYSTEMS"')
    push("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0")
    blank()
    push('TABLE:  "DATABASE FORMAT TYPES"')
    push("   UnitsCurr=Yes   OverrideE=No")
    blank()

    # barras
    if V.frames:
        push('TABLE:  "FRAME SECTION ASSIGNMENTS"')
        for k in V.frames:
            push("   Frame=%d   AutoSelect=N.A.   AnalSect=%s   MatProp=Default" % (k + 1, _q(V.sec_de[k])))
        blank()
        push('TABLE:  "FRAME SECTION PROPERTIES 01 - GENERAL"')
        for nom, s in V.secciones.items():
            push("   SectionName=%s   Material=%s   Shape=General   t3=%s   t2=%s   Area=%s   TorsConst=%s   I33=%s   I22=%s"
                 "   I23=0   AS2=%s   AS3=%s _" % (_q(nom), _q(s["mat"]), _f(s["D"]), _f(s["B"]), _f(s["A"]), _f(s["J"]),
                                                 _f(s["I33"]), _f(s["I22"]), _f(s["As2"]), _f(s["As3"])))
            push("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1")
        blank()
        conAng = [k for k in V.frames if abs(ei.local_angles.get(k, 0.0)) > 1e-9]
        if conAng:
            push('TABLE:  "FRAME LOCAL AXES ASSIGNMENTS 1 - TYPICAL"')
            for k in conAng:
                push("   Frame=%d   Angle=%s   AdvanceAxes=No" % (k + 1, _f(ei.local_angles[k])))
            blank()
        filas = []
        for k in V.frames:
            c = V.cardinal(k)
            if c:
                filas.append('   Frame=%d   CardinalPt="%d (%s)"   Mirror2=No   Mirror3=No   Transform=%s'
                             % (k + 1, c[0], NOMBRE_CARDINAL[c[0]], _yn(c[1])))
        if filas:
            push('TABLE:  "FRAME INSERTION POINT ASSIGNMENTS"')
            L.extend(filas)
            blank()
        filas = []
        for k in V.frames:
            r = V.liberaciones(k)
            if r:
                filas.append("   Frame=%d   " % (k + 1) + "   ".join("%s=%s" % (n, _yn(b)) for n, b in zip(
                    ("PI", "V2I", "V3I", "TI", "M2I", "M3I", "PJ", "V2J", "V3J", "TJ", "M2J", "M3J"), r)))
        if filas:
            push('TABLE:  "FRAME RELEASE ASSIGNMENTS 1 - GENERAL"')
            L.extend(filas)
            blank()
        filas = []
        for k in V.frames:
            o = V.offsets(k)
            if o:
                filas.append("   Frame=%d   Type=User   LengthI=%s   LengthJ=%s   RigidFactor=%s" % (k + 1, _f(o[0]), _f(o[1]), _f(o[2])))
        if filas:
            push('TABLE:  "FRAME OFFSET ALONG LENGTH ASSIGNMENTS"')
            L.extend(filas)
            blank()

    # areas
    if V.shells:
        push('TABLE:  "AREA SECTION ASSIGNMENTS"')
        for k in V.shells:
            push("   Area=%d   Section=%s   MatProp=Default" % (k + 1, _q(V.prop_de[k])))
        blank()
        filas = []
        for k in V.shells:
            p = V.props[V.prop_de[k]]
            md = list(p["mods"])
            if p["tipo"] == "Membrane":
                md[3:6] = [1.0, 1.0, 1.0]      # en una Membrane la flexion no existe: va 1
            if any(abs(v - 1) > 1e-12 for v in md):
                filas.append("   Area=%d   f11=%s   f22=%s   f12=%s   m11=%s   m22=%s   m12=%s   v13=%s   v23=%s   MassMod=1   WeightMod=1"
                             % ((k + 1,) + tuple(_f(v) for v in md)))
        if filas:
            push('TABLE:  "AREA STIFFNESS MODIFIERS"')
            L.extend(filas)
            blank()
        push('TABLE:  "AREA SECTION PROPERTIES"')
        for nom, p in V.props.items():
            tipo = {"Membrane": "Membrane", "ShellThin": "Shell-Thin", "ShellThick": "Shell-Thick"}[p["tipo"]]
            push("   Section=%s   Material=%s   MatAngle=0   AreaType=Shell   Type=%s   DrillDOF=Yes   Thickness=%s   BendThick=%s   Color=Cyan"
                 % (_q(nom), _q(p["mat"]), tipo, _f(p["t"]), _f(p["t"])))
        blank()
        if any(ei.shell_angles.get(k) for k in V.shells):
            avisos.append("ángulo de cáscara (shellang): SAP2000 lo guarda en AREA LOCAL AXES; no medido, no se escribe")

    # nudos, apoyos, muelles, diafragmas
    push('TABLE:  "JOINT COORDINATES"')
    for i, p in enumerate(m.nodes):
        push("   Joint=%d   CoordSys=GLOBAL   CoordType=Cartesian   XorR=%s   Y=%s   Z=%s   SpecialJt=No" % (ids[i], _f(p[0]), _f(p[1]), _f(p[2])))
    blank()
    sup = [(i, fl) for i, fl in sorted(ni.supports.items()) if any(fl)]
    if sup:
        push('TABLE:  "JOINT RESTRAINT ASSIGNMENTS"')
        for i, fl in sup:
            push("   Joint=%d   U1=%s   U2=%s   U3=%s   R1=%s   R2=%s   R3=%s" % ((ids[i],) + tuple(_yn(b) for b in fl)))
        blank()
    if ni.area_springs:
        push('TABLE:  "AREA SPRING ASSIGNMENTS"')
        for k, ks in sorted(ni.area_springs.items()):
            push('   Area=%d   Type=Simple   Stiffness=%s   SimpleType="Tension and Compression"   Face=Bottom   Dir1Type="Object Axes"   Dir=3' % (k + 1, _f(ks)))
        blank()
    if V.muelle_nudo:
        push('TABLE:  "JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED"')
        for i, v in sorted(V.muelle_nudo.items()):
            push("   Joint=%d   CoordSys=Global   U1=%s   U2=%s   U3=%s   R1=%s   R2=%s   R3=%s" % ((ids[i],) + tuple(_f(x) for x in v)))
        blank()
    grp: dict[int, list] = {}
    for i, g in ni.diaphragms.items():
        if g > 0:
            grp.setdefault(g, []).append(i)
    grp = {g: v for g, v in grp.items() if len(v) >= 2}
    if grp:
        push('TABLE:  "CONSTRAINT DEFINITIONS - DIAPHRAGM"')
        for g in grp:
            push("   Name=DIAPH%d   CoordSys=GLOBAL   Axis=Z" % g)
        blank()
        push('TABLE:  "JOINT CONSTRAINT ASSIGNMENTS"')
        for g, v in grp.items():
            for i in sorted(v):
                push("   Joint=%d   Constraint=DIAPH%d" % (ids[i], g))
        blank()

    # cargas
    push('TABLE:  "LOAD PATTERN DEFINITIONS"')
    for p in V.patrones:
        push("   LoadPat=%s   DesignType=%s   SelfWtMult=%s" % (_q(p["nombre"]), _q(p["tipo"]), _f(p["sw"])))
    blank()
    push('TABLE:  "LOAD CASE DEFINITIONS"')
    for p in V.patrones:
        push('   Case=%s   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=%s   DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes'
             % (_q(p["nombre"]), _q(p["tipo"])))
    push('   Case=MODAL   Type=LinModal   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType=Other   DesActOpt="Prog Det"   DesignAct=Other   AutoType=None   RunCase=Yes')
    blank()
    push('TABLE:  "CASE - STATIC 1 - LOAD ASSIGNMENTS"')
    for p in V.patrones:
        push('   Case=%s   LoadType="Load pattern"   LoadName=%s   LoadSF=1' % (_q(p["nombre"]), _q(p["nombre"])))
    blank()
    filas = []
    for p in V.patrones:
        for i, v in sorted(V.cn[p["orig"]].items()):
            if any(abs(x) > 1e-12 for x in v):
                filas.append("   Joint=%d   LoadPat=%s   CoordSys=GLOBAL   F1=%s   F2=%s   F3=%s   M1=%s   M2=%s   M3=%s"
                             % ((ids[i], _q(p["nombre"])) + tuple(_f(x) for x in v)))
    if filas:
        push('TABLE:  "JOINT LOADS - FORCE"')
        L.extend(filas)
        blank()
    filas = []
    for p in V.patrones:
        for k, w in sorted(V.cb[p["orig"]].items()):
            a, b = m.elements[k]
            Lb = math.dist(m.nodes[a], m.nodes[b])
            for d, x in zip("XYZ", w):
                if abs(x) > 1e-12:
                    filas.append("   Frame=%d   LoadPat=%s   CoordSys=GLOBAL   Type=Force   Dir=%s   DistType=RelDist   RelDistA=0   RelDistB=1"
                                 "   AbsDistA=0   AbsDistB=%s   FOverLA=%s   FOverLB=%s" % (k + 1, _q(p["nombre"]), d, _f(Lb), _f(x), _f(x)))
    if filas:
        push('TABLE:  "FRAME LOADS - DISTRIBUTED"')
        L.extend(filas)
        blank()
    filas = []
    for p in V.patrones:
        for k, q in sorted(V.ca[p["orig"]].items()):
            if abs(q) > 1e-15:
                filas.append("   Area=%d   LoadPat=%s   CoordSys=GLOBAL   Dir=Z   UnifLoad=%s" % (k + 1, _q(p["nombre"]), _f(q)))
    if filas:
        push('TABLE:  "AREA LOADS - UNIFORM"')
        L.extend(filas)
        blank()
    if V.combos:
        push('TABLE:  "COMBINATION DEFINITIONS"')
        for c in V.combos:
            for j, (caso, sf) in enumerate(c["items"]):
                if j == 0:
                    push('   ComboName=%s   ComboType="%s"   AutoDesign=No   CaseType="Linear Static"   CaseName=%s   ScaleFactor=%s   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None'
                         % (_q(c["nombre"]), c["tipo"], _q(caso), _f(sf)))
                else:
                    push('   ComboName=%s   CaseType="Linear Static"   CaseName=%s   ScaleFactor=%s' % (_q(c["nombre"]), _q(caso), _f(sf)))
        blank()

    # solidos y materiales
    if V.solidos:
        inc = "Yes" if ei.solid_incompatible else "No"
        mm = sorted({V.mat_de[k] for k in V.solidos})
        push('TABLE:  "SOLID PROPERTY DEFINITIONS"')
        for j, mt in enumerate(mm):
            push("   SolidProp=SOL%d   Material=%s   MatAngleA=0   MatAngleB=0   MatAngleC=0   InComp=%s   Color=Yellow" % (j + 1, _q(mt), inc))
        blank()
        push('TABLE:  "SOLID PROPERTY ASSIGNMENTS"')
        for k in V.solidos:
            push("   Solid=%d   SolidProp=SOL%d" % (k + 1, mm.index(V.mat_de[k]) + 1))
        blank()
    push('TABLE:  "MATERIAL PROPERTIES 01 - GENERAL"')
    for nom in V.materiales:
        push("   Material=%s   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green" % _q(nom))
    blank()
    push('TABLE:  "MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES"')
    for nom, (E, nu, rho) in V.materiales.items():
        G_ = E / (2 * (1 + nu))
        push("   Material=%s   UnitWeight=%s   UnitMass=%s   E1=%s   G12=%s   U12=%s   A1=9.9E-06" % (
            _q(nom), _f(rho * 9.80665), _f(rho), _f(E), _f(G_), _f(nu)))
    blank()
    push('TABLE:  "MATERIAL PROPERTIES 03B - CONCRETE DATA"')
    for nom in V.materiales:
        push('   Material=%s   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0   CoupModType="Modified Darwin-Pecknold"' % _q(nom))
    blank()
    push('TABLE:  "PROGRAM CONTROL"')
    push('   ProgramName=SAP2000   Version=24.1.0   CurrUnits="KN, m, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"   AlumCode="AA 2015"   ColdCode=AISI-16   RegenHinge=Yes')
    blank()
    push("END TABLE DATA")
    push("")
    texto = "\r\n".join(L)
    if ruta:
        with open(ruta, "w", encoding="ascii", errors="replace", newline="") as fh:
            fh.write(texto)
    return texto, avisos
