# -*- coding: utf-8 -*-
"""Escritor de `.f2k` (SAFE) desde un `ModeloHeks`/`ModeloCSI`.

Espejo de `examples/src/shared/f2kExporter.ts`. Las CUATRO leyes medidas de SAFE (20 importaciones):
  1. una tabla `COLUMN OBJECT CONNECTIVITY` borra losas y vigas sin dejar rastro -> TODAS las barras van
     como BEAM, tambien las verticales;
  2. los campos van por NOMBRE (`"Stiffness UZ"`, `"Rigid Factor"`): con la clave SAFE calla y deja su defecto;
  3. una seccion de hormigon sin `"Longitudinal Rebar Material"` valido se rechaza ENTERA;
  4. SAFE analiza las barras con 0.1·J -> se escribe 10·J (`j_factor`), asi SAFE analiza la J del modelo.

SAFE no tiene diafragmas, paredes ni solidos, y los formatos de liberaciones, angulo local y punto de
insercion != 10 no estan medidos: eso se AVISA, no se inventa. La carga de AREA se escribe como carga
nodal consistente (el formato `AREA LOADS` de SAFE no esta medido).
"""
from __future__ import annotations

import math

from ._escribir import Vista, limpio


def _f(v: float) -> str:
    if not math.isfinite(v) or abs(v) < 1e-15:
        return "0"
    if abs(v) >= 1e7 or abs(v) < 1e-4:
        return "%.12e" % v
    return "%.13g" % v


def _yn(b) -> str:
    return "Yes" if b else "No"


def _q(s: str) -> str:
    return '"%s"' % s if (" " in s or "," in s or "=" in s) else s


def fuerzas_area(P, q: float):
    """Vector nodal consistente ∫N_i·q·dA de un Q4 (Gauss 2x2, jacobiano real)."""
    g2 = 1.0 / math.sqrt(3.0)
    f = [0.0] * 4
    for xi, eta in ((-g2, -g2), (g2, -g2), (g2, g2), (-g2, g2)):
        N = (0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta), 0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta))
        dNx = (-0.25 * (1 - eta), 0.25 * (1 - eta), 0.25 * (1 + eta), -0.25 * (1 + eta))
        dNe = (-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi))
        a = [sum(dNx[i] * P[i][c] for i in range(4)) for c in range(3)]
        b = [sum(dNe[i] * P[i][c] for i in range(4)) for c in range(3)]
        cr = (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
        det = math.sqrt(sum(x * x for x in cr))
        for i in range(4):
            f[i] += N[i] * q * det
    return f


def escribir_f2k(modelo, ruta: str | None = None, *, titulo: str | None = None, j_factor: float = 10.0,
                 version_safe: int = 20):
    """→ (texto, avisos)."""
    V = Vista(modelo)
    m, ei, ni = V.m, V.ei, V.ni
    avisos = [a for a in V.avisos if not a.startswith("unión viga-muro")]
    V20 = version_safe == 20
    ids = V.ids
    L: list[str] = []
    push = L.append
    fin = lambda: L.append(" ")

    def tabla(n):
        push('TABLE:  "%s"' % n)

    losas = [k for k in V.shells if not V.vertical(k)]
    omit = [k for k in V.shells if V.vertical(k)]
    if omit:
        avisos.append("%d áreas verticales (muros) no existen en SAFE: omitidas" % len(omit))
    if V.solidos:
        avisos.append("%d sólidos no existen en SAFE: omitidos" % len(V.solidos))
    if ni.diaphragms:
        avisos.append("diafragmas rígidos: SAFE no los tiene; no viajan")
    if any(V.liberaciones(k) for k in V.frames):
        avisos.append("liberaciones de extremo (releases): formato de SAFE no medido; no viajan")
    if any(abs(ei.local_angles.get(k, 0.0)) > 1e-9 for k in V.frames):
        avisos.append("ángulo de eje local de barra: formato de SAFE no medido; no viaja")
    if any(V.cardinal(k) for k in V.frames):
        avisos.append("punto de inserción distinto de 10: formato de SAFE no medido; las barras van al centroide")
    if any(ei.shell_angles.get(k) for k in losas):
        avisos.append("ángulo de cáscara: no viaja a SAFE")
    if any(V.props[V.prop_de[k]]["tipo"] == "Membrane" for k in losas):
        avisos.append("cáscara tipo Membrane: SAFE no la tiene; se escribe Shell-Thin con m11/m22/m12 = 0")
    if any(abs(w[0]) > 1e-12 or abs(w[1]) > 1e-12 for d in V.cb.values() for w in d.values()):
        avisos.append("cargas de barra horizontales (X/Y): solo se escribe la gravedad medida de SAFE")

    push('File "%s.f2k" exportado desde Hekatan Struct (hekatan_struct.archivos_csi)' % limpio(titulo or m.titulo or "Hekatan"))
    push("File contains the same model that goes to .e2k (ETABS) and .s2k (SAP2000): nodes, frames, slabs, restraints, springs, loads.")
    fin()
    tabla("PROGRAM CONTROL")
    push('   ProgramName=SAFE   Version=%s   ProgLevel="Post Tensioning"   CurrUnits="kN, m, C"   CompBmCode="AISC 360-16"   ConcFrmCode="ACI 318-19"   ConcSlbCode="ACI 318-19"'
         % ("20.3.0" if V20 else "22.6.0"))
    fin()
    tabla("MATERIAL PROPERTIES - GENERAL")
    for nom in V.materiales:
        push("   Material=%s   Type=Concrete   SymType=Isotropic   Grade=Hekatan   Color=Gray8Dark" % _q(nom))
    push('   Material=A615Gr60   Type=Rebar   SymType=Uniaxial   Grade="Grade 60"   Color=Green')
    fin()
    tabla("MATERIAL PROPERTIES - BASIC MECHANICAL PROPERTIES")
    for nom, (E, nu, rho) in V.materiales.items():
        push("   Material=%s   DensityType=Weight   UnitWeight=%s   UnitMass=%s   E1=%s   G12=%s   U12=%s   A1=1E-05"
             % (_q(nom), _f(rho * 9.80665), _f(rho), _f(E), _f(E / (2 * (1 + nu))), _f(nu)))
    push("   Material=A615Gr60   DensityType=Weight   UnitWeight=76.9729   UnitMass=7.849047   E1=199947978.8   A1=1.17E-05")
    fin()
    tabla("MATERIAL PROPERTIES - REBAR DATA")
    push("   Material=A615Gr60   Fy=413685.5   Fu=620528.2   Fye=455054   Fue=682581   SSCurveOpt=Simple   SSHysType=Kinematic   SHard=0.01   SCap=0.09   FinalSlope=-0.1")
    fin()
    tabla("MATERIAL PROPERTIES - CONCRETE DATA")
    for nom in V.materiales:
        push("   Material=%s   Fc=27579.03   LtWtConc=No   IsUserFr=No   SSCurveOpt=Mander   SSHysType=Concrete   SFc=0.002219   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0" % _q(nom))
    fin()

    mod1 = '"Area Modifier"=1   "As2 Modifier"=1   "As3 Modifier"=1   "J Modifier"=1   "I33 Modifier"=1   "I22 Modifier"=1   "Mass Modifier"=1   "Weight Modifier"=1'
    if V.secciones:
        tabla("FRAME SECTION PROPERTY DEFINITIONS - SUMMARY")
        for nom, s in V.secciones.items():
            push("   Name=%s   Material=%s   Shape=General   Color=Magenta   Area=%s   J=%s   I33=%s   I22=%s   As2=%s   As3=%s   %s"
                 % (_q(nom), _q(s["mat"]), _f(s["A"]), _f(s["J"] * j_factor), _f(s["I33"]), _f(s["I22"]), _f(s["As2"]), _f(s["As3"]), mod1))
        fin()
        tabla("FRAME SECTION PROPERTY DEFINITIONS - GENERAL")
        for nom, s in V.secciones.items():
            a = s["A"]
            r33 = math.sqrt(s["I33"] / a) if a > 0 else 0.0
            r22 = math.sqrt(s["I22"] / a) if a > 0 else 0.0
            s33 = s["I33"] / (s["D"] / 2) if s["D"] else 0.0
            s22 = s["I22"] / (s["B"] / 2) if s["B"] else 0.0
            push('   Name=%s   Material=%s   Depth=%s   Width=%s   Area=%s   As2=%s   As3=%s   I33=%s   I22=%s   I23=0   S33Pos=%s   S33Neg=%s   S22Pos=%s   S22Neg=%s   R33=%s   R22=%s   Z33=%s   Z22=%s   J=%s'
                 '   "CG Offset3"=0   "CG Offset2"=0   "PNA Offset3"=0   "PNA Offset2"=0   "SC Offset3"=0   "SC Offset2"=0   "Section Type"=Beam   "Longitudinal Rebar Material"=A615Gr60   "Shear Rebar Material"=A615Gr60   "Flange Dimension Option"="Analysis Property"   "Cover Top"=0.06   "Cover Bottom"=0.06   %s   Color=Magenta'
                 % (_q(nom), _q(s["mat"]), _f(s["D"]), _f(s["B"]), _f(a), _f(s["As2"]), _f(s["As3"]), _f(s["I33"]), _f(s["I22"]),
                    _f(s33), _f(s33), _f(s22), _f(s22), _f(r33), _f(r22), _f(s33), _f(s22), _f(s["J"] * j_factor), mod1))
        fin()

    # losas
    props = {n: p for n, p in V.props.items() if not p["vertical"]}
    tipo_sl = {}
    if props:
        tabla("AREA SECTION PROPERTY DEFINITIONS - SUMMARY")
        for nom, p in props.items():
            thin = p["tipo"] != "ShellThick"
            push('   Name=%s   Type=Slab   "Element Type"=%s   Material=%s   "Total Thickness"=%s'
                 % (_q(nom), "Shell-Thin" if thin else "Shell-Thick", _q(p["mat"]), _f(p["t"])))
        fin()
        tabla("SLAB PROPERTY DEFINITIONS")
        con_ks = {V.prop_de[k] for k in losas if k in ni.area_springs}
        for nom, p in props.items():
            md = list(p["mods"])
            thin = p["tipo"] != "ShellThick"
            tp = "Stiff" if min(md[3], md[4]) >= 10 else ("Footing" if V20 else "Mat") if nom in con_ks else "Slab"
            wm = 0 if tp == "Stiff" else 1
            push('   Name=%s   "Modeling Type"=%s   "Property Type"=%s   Material=%s   "Slab Thickness"=%s   "Notional Size Type"=Auto   "Notional Auto Factor"=1'
                 '   "f11 Modifier"=%s   "f22 Modifier"=%s   "f12 Modifier"=%s   "m11 Modifier"=%s   "m22 Modifier"=%s   "m12 Modifier"=%s   "v13 Modifier"=%s   "v23 Modifier"=%s'
                 '   "Mass Modifier"=1   "Weight Modifier"=1   Color=Blue   Orthotropic?=No'
                 % ((_q(nom), "Shell-Thin" if thin else "Shell-Thick", tp, _q(p["mat"]), _f(p["t"])) + tuple(_f(v) for v in md)))
        fin()

    # muelles
    sp_props: dict[tuple, str] = {}
    sp_de: dict[int, str] = {}
    for i, v in sorted(V.muelle_nudo.items()):
        key = tuple(float("%.12g" % x) for x in v)
        if key not in sp_props:
            sp_props[key] = "SPR%d" % (len(sp_props) + 1)
        sp_de[i] = sp_props[key]
    ar_props: dict[float, str] = {}
    ar_de: dict[int, str] = {}
    for k, ks in sorted(ni.area_springs.items()):
        if k not in losas:
            continue
        key = float("%.10g" % ks)
        if key not in ar_props:
            ar_props[key] = "KS%d" % (len(ar_props) + 1)
        ar_de[k] = ar_props[key]
    if ar_props:
        tabla("SPRING PROPERTY DEFINITIONS - AREA SPRINGS")
        for ks, nom in ar_props.items():
            push('   Name=%s   "Subgrade Modulus"=%s   "Nonlinear Option"="None (Linear)"   Color=Cyan' % (nom, _f(ks)) if V20 else
                 '   Name=%s   "Stiffness Option"=User   "Stiffnes U1"=0   "Stiffnes U2"=0   "Stiffnes U3"=%s   "Nonlinear Option for U3"="None (Linear)"   Color=Cyan' % (nom, _f(ks)))
        fin()
    if sp_props:
        tabla("SPRING PROPERTY DEFINITIONS - POINT SPRINGS")
        for key, nom in sp_props.items():
            push('   Name=%s   "Stiffness UX"=%s   "Stiffness UY"=%s   "Stiffness UZ"=%s   "Stiffness RX"=%s   "Stiffness RY"=%s   "Stiffness RZ"=%s   "Nonlinear Option"="None (Linear)"   Color=Green'
                 % ((nom,) + tuple(_f(x) for x in key)))
        fin()

    # cargas
    tabla("LOAD PATTERN DEFINITIONS")
    for p in V.patrones:
        push('   Name=%s   "Is Auto Load"=No   Type=%s   "Self Weight Multiplier"=%s' % (_q(p["nombre"]), _q(p["tipo"]), _f(p["sw"])))
    fin()
    tabla("LOAD CASE DEFINITIONS - SUMMARY")
    for p in V.patrones:
        push('   Name=%s   Type="Linear Static"' % _q(p["nombre"]))
    fin()
    tabla("LOAD CASE DEFINITIONS - LINEAR STATIC")
    for p in V.patrones:
        push('   Name=%s   "Exclude Group"=None   "Mass Source"=MsSrc1   "Initial Condition"=Unstressed   "Load Type"=Load   "Load Name"=%s   "Load SF"=1   "Design Type"="Program Determined"'
             % (_q(p["nombre"]), _q(p["nombre"])))
    fin()
    tabla("MASS SOURCE DEFINITION")
    push('   Name=MsSrc1   "Is Default"=Yes   "Include Lateral Mass?"=No   "Include Vertical Mass?"=Yes   "Lump Mass?"=Yes   "Source Self Mass?"=Yes   "Source Added Mass?"=Yes   "Source Load Patterns?"=No   "Move Mass Centroid?"=No')
    fin()
    if V.combos:
        tabla("COMBINATION DEFINITIONS")
        for c in V.combos:
            for j, (caso, sf) in enumerate(c["items"]):
                if j == 0:
                    push('   Name=%s   Type="%s"   "Is Auto"=No   "Load Name"=%s   "Scale Factor"=%s' % (_q(c["nombre"]), c["tipo"], _q(caso), _f(sf)))
                else:
                    push('   Name=%s   "Load Name"=%s   "Scale Factor"=%s' % (_q(c["nombre"]), _q(caso), _f(sf)))
        fin()

    # geometria
    tabla("POINT OBJECT CONNECTIVITY")
    for i, p in enumerate(m.nodes):
        push('   UniqueName=%d   "Is Auto Point"=No   IsSpecial=Yes   X=%s   Y=%s   Z=%s' % (ids[i], _f(p[0]), _f(p[1]), _f(p[2])))
    fin()
    if V.frames:
        tabla("BEAM OBJECT CONNECTIVITY")
        for k in V.frames:
            a, b = m.elements[k]
            push('   "Unique Name"=B%d   UniquePtI=%d   UniquePtJ=%d   Length=%s' % (k + 1, ids[a], ids[b], _f(math.dist(m.nodes[a], m.nodes[b]))))
        fin()
    if losas:
        tabla("FLOOR OBJECT CONNECTIVITY")
        for k in losas:
            c = m.elements[k]
            per = sum(math.dist(m.nodes[c[j]], m.nodes[c[(j + 1) % 4]]) for j in range(4))
            area = abs(sum((m.nodes[c[j]][0] * m.nodes[c[(j + 1) % 4]][1] - m.nodes[c[(j + 1) % 4]][0] * m.nodes[c[j]][1]) / 2 for j in range(4)))
            push('   "Unique Name"=A%d   %s   Perimeter=%s   Area=%s' % (k + 1, "   ".join("UniquePt%d=%d" % (j + 1, ids[n]) for j, n in enumerate(c)), _f(per), _f(area)))
        fin()
    sup = [(i, fl) for i, fl in sorted(ni.supports.items()) if any(fl)]
    if sup:
        tabla("JOINT ASSIGNMENTS - RESTRAINTS")
        for i, fl in sup:
            push("   UniqueName=%d   UX=%s   UY=%s   UZ=%s   RX=%s   RY=%s   RZ=%s" % ((ids[i],) + tuple(_yn(b) for b in fl)))
        fin()
    if sp_de:
        tabla("JOINT ASSIGNMENTS - SPRINGS")
        for i, nom in sorted(sp_de.items()):
            push("   UniqueName=%d   SpringProp=%s" % (ids[i], nom))
        fin()

    # cargas nodales (+ areas como consistentes) y de barra
    filas = []
    n_area_q = 0
    for p in V.patrones:
        tot: dict[int, list] = {}
        for i, v in V.cn[p["orig"]].items():
            tot[i] = list(v)
        for k, q in V.ca[p["orig"]].items():
            if k not in losas or not q:
                continue
            n_area_q += 1
            c = m.elements[k]
            for n, fz in zip(c, fuerzas_area([m.nodes[x] for x in c], q)):
                tot.setdefault(n, [0.0] * 6)[2] += fz
        for i, f in sorted(tot.items()):
            if any(abs(x) > 1e-12 for x in f):
                filas.append('   UniqueName=%d   "Load Pattern"=%s   FX=%s   FY=%s   FZ=%s   MX=%s   MY=%s   MZ=%s   "X Dimension"=0   "Y Dimension"=0'
                             % ((ids[i], _q(p["nombre"])) + tuple(_f(x) for x in f)))
    if n_area_q:
        avisos.append("%d cargas de área convertidas a fuerzas nodales consistentes" % n_area_q)
    if filas:
        tabla("JOINT LOADS ASSIGNMENTS - FORCE")
        L.extend(filas)
        fin()
    filas = []
    for p in V.patrones:
        for k, w in sorted(V.cb[p["orig"]].items()):
            if k not in V.frames or abs(w[2]) < 1e-12:
                continue
            a, b = m.elements[k]
            Lb = math.dist(m.nodes[a], m.nodes[b])
            filas.append('   UniqueName=B%d   "Load Pattern"=%s   "Load Type"=Force   Direction=Gravity   "Distance Type"=Relative   "Relative Distance A"=0   "Relative Distance B"=1   "Absolute Distance A"=0   "Absolute Distance B"=%s   "Force A"=%s   "Force B"=%s'
                         % (k + 1, _q(p["nombre"]), _f(Lb), _f(-w[2]), _f(-w[2])))
    if filas:
        tabla("FRAME LOADS ASSIGNMENTS - DISTRIBUTED")
        L.extend(filas)
        fin()

    # asignaciones
    if V.frames:
        tabla("FRAME ASSIGNMENTS - SECTION PROPERTIES")
        for k in V.frames:
            push('   UniqueName=B%d   Shape=General   "Auto Select List"=N.A.   "Section Property"=%s' % (k + 1, _q(V.sec_de[k])))
        fin()
        tabla("FRAME ASSIGNMENTS - INSERTION POINT")
        for k in V.frames:
            push('   UniqueName=B%d   "Cardinal Point"="10 (Centroid)"   Mirror2=No   Mirror3=No   "Offset CSys"=Global   XI=0   YI=0   ZI=0   XJ=0   YJ=0   ZJ=0   "No Transform Stiffness"=Yes' % (k + 1))
        fin()
        tabla("FRAME ASSIGNMENTS - END LENGTH OFFSETS")
        for k in V.frames:
            o = V.offsets(k) or (0.0, 0.0, 0.0)
            push('   UniqueName=B%d   "Offset Option"=User   "Offset I"=%s   "Offset J"=%s   "Rigid Factor"=%s   "Self Weight Option"=Auto' % (k + 1, _f(o[0]), _f(o[1]), _f(o[2])))
        fin()
    if losas:
        tabla("AREA ASSIGNMENTS - SECTION PROPERTIES")
        for k in losas:
            push('   UniqueName=A%d   "Section Property"=%s   "Property Type"=Slab' % (k + 1, _q(V.prop_de[k])))
        fin()
        if ar_de:
            tabla("AREA ASSIGNMENTS - AREA SPRINGS")
            for k, nom in sorted(ar_de.items()):
                push('   UniqueName=A%d   "Spring Property"=%s' % (k + 1, nom))
            fin()
        tabla("AREA ASSIGNMENTS - INSERTION POINT")
        for k in losas:
            push('   UniqueName=A%d   "Cardinal Point"=Middle   Transform=No' % (k + 1))
        fin()
        tabla("AREA ASSIGNMENTS - FLOOR AUTO MESH OPTIONS")
        for k in losas:
            push('   UniqueName=A%d   "Mesh Option"=Default   "Add Restraints"=No' % (k + 1))
        fin()
        tabla("AREA ASSIGNMENTS - AUTO EDGE CONSTRAINTS")
        for k in losas:
            push("   UniqueName=A%d   Constraint=%s" % (k + 1, "Yes" if ni.hanging_nodes else "No"))
        fin()
    tabla("ANALYSIS OPTIONS - AUTOMATIC MESH SETTINGS FOR FLOORS")
    push('   "Mesh Option"=Rectangular   "Use Localized Meshing"=Yes   "Merge Joints"=Yes   "Maximum Mesh Size"=100')
    fin()
    tabla("ANALYSIS MODELING OPTIONS")
    push('   "Two Dimensional Only"=No   "Rigid Diaphragm At Top"=No   "Ignore Vertical Offsets"=Yes')
    fin()
    tabla("ANALYSIS OPTIONS - SAPFIRE OPTIONS")
    push('   "Solver Option"=Advanced   "Analysis Process"=Auto   "Number Analysis Threads"=0   "Max File Size"=0')
    fin()
    push("END TABLE DATA")
    texto = "\n".join(L) + "\n"
    if ruta:
        with open(ruta, "w", encoding="ascii", errors="replace", newline="") as fh:
            fh.write(texto)
    return texto, avisos
