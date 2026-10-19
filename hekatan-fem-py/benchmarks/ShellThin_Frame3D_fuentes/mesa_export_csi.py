"""Mesa de Torsion GENERAL -> ETABS (.e2k) y SAP2000 (.s2k).

    import mesa_modelo as mm, mesa_export_csi as ex
    M = mm.build(dict(nx=2, ny=1, pisos=2, slab="shellthin"))
    ex.to_e2k(M, "mesa.e2k");  ex.to_s2k(M, "mesa.s2k")

Regla de la casa (FEM): la MISMA malla nodo a nodo que resuelve mesa_modelo.
  - cada nudo, cada tramo de viga (N por vano) y cada pano de losa van EXPLICITOS
  - sin brazos rigidos (no se escribe LENGTHOFF*), punto cardinal 10 (defecto), sin diafragma
  - ETABS: vigas AUTOMESH "NO" / MESHATINTERSECTIONS "NO"; losas OBJMESHTYPE "NOAUTOMESH"
    ("NONE" no es valor de ETABS y remalla con DEFAULT: ver cli/heks_a_csi.mjs); ADDRESTRAINT "No"
  - columnas PISO A PISO (LINE una vez + un LINEASSIGN por planta), STORY "Base" ELEV en mm

Cargas NATIVAS de CSI (no el vector nodal de Hekatan):
  Dead = SELFWEIGHT 1 (el material pesa gamma, masa rho). SCP = "Super Dead", Live = "Live".
  Losa con flexion (shellthin / waffle): SCP y Live como carga UNIFORME de area; el peso de la
    losa lo pone CSI por SELFWEIGHT.
  WAFFLE (reticular), como ETABS se la pasa al solver (tests_convergencia/WAFFLE_ETABS_RE.md):
    e2k waffle_mode="native" (defecto): SLABTYPE "Waffle" con OVERALLDEPTH, SLABTHICKNESS,
        SLABRIBWIDTHTOP/BOTTOM, SLABRIBSPACING1/2 -> ETABS calcula SUS modificadores (fase 2: se
        comparan con slabprop["mods"]).
    e2k waffle_mode="mods" (control): ShellThin espesor h + los 10 modificadores de mesa_modelo
        (F11MOD..V23MOD MMOD WMOD).
    s2k: Shell-Thin Thickness = BendThick = h + AREA STIFFNESS MODIFIERS f11..v23 MassMod WeightMod.
  Losa sin flexion (membrane / none): las cargas de BARRA trapeciales de M["loads"][p]["frame"]
    (areas tributarias a 45 grados, ya con el peso de la losa en Dead); las areas membrana van con
    MMOD = WMOD = 0 para no contar dos veces el peso.
  Combinaciones = mesa_modelo.COMBOS (SERV, ULT; D/SCP/L son los propios casos).

Unidades: e2k en N y mm (como el exportador validado de Hekatan Struct), s2k en kN y m.
Sintaxis copiada de ficheros que ETABS 22 / SAP2000 24 ya escribieron o aceptaron
(registros/2026-09-24_mesa_export_csi.md). OJO: los end length offsets AUTOMATICOS de ETABS no
se ven en el e2k; hay que anularlos por OAPI al abrir (tests_convergencia/run_etabs.py).
"""
from __future__ import annotations
import numpy as np

import mesa_modelo as MM

PAT = {"D": "Dead", "SCP": "SCP", "L": "Live"}                 # mesa_modelo -> CSI
PAT_TYPE_E2K = {"D": "Dead", "SCP": "Super Dead", "L": "Live"}
PAT_TYPE_S2K = {"D": "Dead", "SCP": '"Super Dead"', "L": "Live"}
AVISO_RUTA = ("ETABS/SAP2000 fallan al abrir si la ruta tiene ESPACIOS, TILDES u OneDrive: "
              "copiar este fichero a una ruta corta, p.ej. C:\\ETABS\\mesa.e2k (COMO_PROBAR_E2K_EN_ETABS.md)")


def _g(v):
    """numero compacto con 10 cifras significativas (sin notacion rara para CSI)"""
    v = float(v)
    if abs(v) < 1e-300: return "0"
    s = f"{v:.10g}"
    return s


# ------------------------------------------------------------------
#  datos comunes a los dos formatos
# ------------------------------------------------------------------
def _nat(M):
    """Lo que el exportador necesita, derivado SOLO del dict M (sin tocar mesa_modelo)."""
    sl = M["slabprop"]; tipo = sl["tipo"]
    bend = tipo in ("shellthin", "waffle")
    nfr = len(M["frames"])
    # cargas de barra NATIVAS por patron: lista de (idx_barra, segs).
    # En D las primeras nfr entradas son el peso propio de barras (lo pone CSI con SELFWEIGHT):
    # se descartan; lo que queda es el peso de la losa bajado por area tributaria.
    fl = {}
    for p in ("D", "SCP", "L"):
        lst = M["loads"][p]["frame"]
        if p == "D":
            sw, lst = lst[:nfr], lst[nfr:]
            assert all(e == k for k, (e, _) in enumerate(sw)), "orden de peso propio inesperado"
        fl[p] = [(e, segs) for (e, segs) in lst if segs != "col_sw"]
        if bend: assert not fl[p], "losa con flexion no deberia llevar carga de barra"
    area = {p: (M["loads"][p]["area"] if bend else 0.0) for p in ("SCP", "L")}
    # modificador de peso y masa de la losa
    mods = None
    if tipo == "waffle":
        mods = [float(v) for v in sl["mods"]]          # [f11 f22 f12 m11 m22 m12 v13 v23 masa peso]
        wmod = mods[9]
    elif tipo == "membrane":
        wmod = 0.0
    else:
        wmod = 1.0
    model = {"shellthin": "ShellThin", "waffle": "ShellThin", "membrane": "Membrane"}.get(tipo)
    return dict(bend=bend, fl=fl, area=area, wmod=wmod, model=model, t=sl["t"], mods=mods,
                mmod=(mods[8] if mods else wmod))


def _story(M, z):
    H = M["P"]["H"]; k = int(round(z / H)); assert abs(z - k*H) < 1e-9
    return k


def _len(M, f):
    return float(np.linalg.norm(M["nodes"][f["j"]] - M["nodes"][f["i"]]))


# ==================================================================
#  ETABS .e2k
# ==================================================================
MODS_E2K = ["F11MOD", "F22MOD", "F12MOD", "M11MOD", "M22MOD", "M12MOD", "V13MOD", "V23MOD", "MMOD", "WMOD"]


def to_e2k(M, path, waffle_mode="native"):
    """waffle_mode: "native" = SLABTYPE "Waffle" (ETABS calcula los modificadores) ·
    "mods" = ShellThin espesor h + los 10 modificadores de mesa_modelo (control)."""
    assert waffle_mode in ("native", "mods")
    P, mat, secs = M["P"], M["mat"], M["secs"]
    nodes = M["nodes"]; npis = int(P["pisos"]); H = P["H"]
    nat = _nat(M)
    mm = lambda v: v * 1000.0                     # m -> mm
    L = []; A = L.append
    A('$ File   "mesa_torsion.e2k"  saved by Hekatan mesa_export_csi.py (formato ETABS 22.6.0)')
    A(f"$ {AVISO_RUTA}")
    A(f"$ Mesa de Torsion general: nx={P['nx']} ny={P['ny']} pisos={npis} N={M['N']} losa={M['slabprop']['tipo']} "
      f"apoyo={P['support']}  | malla explicita, offsets=0, sin diafragma")
    A("")
    A("$ PROGRAM INFORMATION")
    A('  PROGRAM  "ETABS"  VERSION "22.6.0"  ')
    A("")
    A("$ CONTROLS")
    A('  UNITS  "N"  "MM"  "C"  ')
    A('  TITLE1  "Mesa de Torsion general - Hekatan"  ')
    A("  PREFERENCE  MERGETOL 0.001")
    A("")
    A("$ STORIES - IN SEQUENCE FROM TOP")
    for k in range(npis, 0, -1):
        A(f'  STORY "Story{k}"  HEIGHT {_g(mm(H))} MASTERSTORY "Yes"  ')
    A('  STORY "Base"  ELEV 0 ')
    A("")
    A("$ GRIDS")                                  # solo referencia visual: ejes de columna
    A('  GRIDSYSTEM "G1"  TYPE "CARTESIAN"  BUBBLESIZE 1.25 ')
    for d_, n_ in (("X", int(P["nx"])), ("Y", int(P["ny"]))):
        for i in range(n_ + 1):
            lab = chr(ord("A") + i) if d_ == "X" else str(i + 1)
            A(f'  GRID "G1"  LABEL "{lab}"  DIR "{d_}"  COORD {_g(mm(i*P["Lx"]))}  GRIDTYPE "PRIMARY"  BUBBLELOC "DEFAULT"  GRIDHIDE "NO"  ')
    A("")
    A("$ DIAPHRAGM NAMES")                        # definido (como lo escribe ETABS) pero NO asignado
    A('  DIAPHRAGM "D1"    TYPE RIGID')
    A("")
    A("$ MATERIAL PROPERTIES")
    A(f'  MATERIAL  "CONC"    TYPE "Concrete"    WEIGHTPERVOLUME {_g(mat["gamma"] * 1e-6)}')   # kN/m3 -> N/mm3
    A(f'  MATERIAL  "CONC"    SYMTYPE "Isotropic"  E {_g(mat["E"] * 1e-3)}  U {_g(mat["nu"])}  A 0.00001')
    A('  MATERIAL  "CONC"    FC 28')
    A("")
    A("$ FRAME SECTIONS")
    # CSI: columna vertical -> eje 2 = +X global, D (canto, a lo largo del eje 2) = bC;
    # viga -> eje 2 = vertical, D = hV.  I33 = B*D^3/12 = Iy de Hekatan en los dos casos.
    for nm in ("COL", "VIGA"):
        s = secs[nm]
        D, B = (s["b"], s["h"]) if nm == "COL" else (s["h"], s["b"])
        I33, I22 = s["Iy"], s["Iz"]; As = 5/6*s["A"]
        A(f'  FRAMESECTION  "{nm}"  MATERIAL "CONC"  SHAPE "General"  D {_g(mm(D))} B {_g(mm(B))} '
          f'AREA {_g(s["A"]*1e6)} AS2 {_g(As*1e6)} AS3 {_g(As*1e6)} I33 {_g(I33*1e12)} I22 {_g(I22*1e12)} '
          f'TORSION {_g(s["J"]*1e12)} S33POS {_g(2*I33/D*1e9)} S33NEG {_g(2*I33/D*1e9)} '
          f'S22POS {_g(2*I22/B*1e9)} S22NEG {_g(2*I22/B*1e9)} Z33 {_g(2*I33/D*1e9)} Z22 {_g(2*I22/B*1e9)} '
          f'R33 {_g(np.sqrt(I33/s["A"])*1e3)} R22 {_g(np.sqrt(I22/s["A"])*1e3)} ')
    A("")
    if M["shells"]:
        A("$ SLAB PROPERTIES")
        if nat["mods"] and waffle_mode == "native":
            # gramatica de ETABS.dll 22.6 (ajr.bb / ajs.aj): claves de la losa reticular, en mm
            bt = P["w_bw"]; bb = P.get("w_bb") or bt; s1 = P["w_s"]; s2 = P.get("w_s2") or s1
            A(f'  SHELLPROP  "LOSA"  PROPTYPE  "Slab"  MATERIAL "CONC"  MODELINGTYPE "ShellThin"  SLABTYPE "Waffle"  '
              f'OVERALLDEPTH {_g(mm(P["w_h"]))} SLABTHICKNESS {_g(mm(P["w_tf"]))} SLABRIBWIDTHTOP {_g(mm(bt))} '
              f'SLABRIBWIDTHBOTTOM {_g(mm(bb))} SLABRIBSPACING1 {_g(mm(s1))} SLABRIBSPACING2 {_g(mm(s2))} ')
        else:
            A(f'  SHELLPROP  "LOSA"  PROPTYPE  "Slab"  MATERIAL "CONC"  MODELINGTYPE "{nat["model"]}"  '
              f'SLABTYPE "Slab"  SLABTHICKNESS {_g(mm(nat["t"]))} ')
            if nat["mods"]:                         # waffle_mode="mods": los 10 explicitos (e2k real: "... MMOD 0 WMOD 0")
                A('  SHELLPROP  "LOSA"  ' + " ".join(f"{k} {_g(v)}" for k, v in zip(MODS_E2K, nat["mods"])) + " ")
            elif abs(nat["wmod"] - 1) > 1e-12:      # membrana: no pesa ni masa (su peso va en las TRAPF)
                A(f'  SHELLPROP  "LOSA"  MMOD {_g(nat["wmod"])} WMOD {_g(nat["wmod"])} ')
        A("")

    # ---- puntos de planta ----
    pt = {}
    def ptname(x, y):
        key = (round(x, 6), round(y, 6))
        if key not in pt: pt[key] = str(len(pt) + 1)
        return pt[key]
    nps = [(ptname(n[0], n[1]), _story(M, n[2])) for n in nodes]     # nudo -> (punto, planta)
    stn = lambda k: "Base" if k == 0 else f"Story{k}"
    A("$ POINT COORDINATES")
    for (x, y), nm in sorted(pt.items(), key=lambda kv: int(kv[1])):
        A(f'  POINT "{nm}"  {_g(mm(x))} {_g(mm(y))} ')
    A("")

    # ---- barras: una LINE por posicion en planta, un LINEASSIGN por planta ----
    lines, assigns = [], []
    lname = {}                                    # idx de barra -> (LINE, planta)
    seen = {}
    for e, f in enumerate(M["frames"]):
        (pi, ki), (pj, kj) = nps[f["i"]], nps[f["j"]]
        if f["tipo"] == "col":
            assert pi == pj and kj == ki + 1
            key = ("C", pi)
            if key not in seen:
                seen[key] = f"C{pi}"; lines.append(f'  LINE  "C{pi}"  COLUMN  "{pi}"  "{pi}"  1')
            st = kj
        else:
            assert ki == kj
            key = ("B", pi, pj)
            if key not in seen:
                seen[key] = f"B{len([k for k in seen if k[0] == 'B']) + 1}"
                lines.append(f'  LINE  "{seen[key]}"  BEAM  "{pi}"  "{pj}"  0')
            st = ki
        lname[e] = (seen[key], stn(st))
        assigns.append(f'  LINEASSIGN  "{seen[key]}"  "{stn(st)}"  SECTION "{f["sec"]}"  MINNUMSTA 3 '
                       f'AUTOMESH "NO"  MESHATINTERSECTIONS "NO"  ')
    A("$ LINE CONNECTIVITIES"); L.extend(lines); A("")

    # ---- areas ----
    aname = {}
    if M["shells"]:
        A("$ AREA CONNECTIVITIES")
        seenA = {}
        aassign = []
        for s_i, s in enumerate(M["shells"]):
            pts = tuple(nps[n][0] for n in s["n"]); k = nps[s["n"][0]][1]
            if pts not in seenA:
                seenA[pts] = f"F{len(seenA) + 1}"
                A(f'  AREA "{seenA[pts]}"  FLOOR  4  ' + "  ".join(f'"{p}"' for p in pts) + "  0  0  0  0  ")
            aname[s_i] = (seenA[pts], stn(k))
            aassign.append(f'  AREAASSIGN  "{seenA[pts]}"  "{stn(k)}"  SECTION "LOSA"  OBJMESHTYPE "NOAUTOMESH"  '
                           f'ADDRESTRAINT "No"  CARDINALPOINT "MIDDLE"  TRANSFORMSTIFFNESSFOROFFSETS "No"  ')
        A("")

    A("$ POINT ASSIGNS")
    dofs = ["UX", "UY", "UZ", "RX", "RY", "RZ"]
    for n, r in M["restr"].items():
        p, k = nps[n]
        A(f'  POINTASSIGN  "{p}"  "{stn(k)}"  RESTRAINT "{" ".join(d for d, b in zip(dofs, r) if b)}"  DIAPH "DISCONNECTED"  ')
    A("")
    A("$ LINE ASSIGNS"); L.extend(assigns); A("")
    if M["shells"]:
        A("$ AREA ASSIGNS"); L.extend(aassign); A("")

    A("$ LOAD PATTERNS")
    for p in ("D", "SCP", "L"):
        A(f'  LOADPATTERN "{PAT[p]}"  TYPE  "{PAT_TYPE_E2K[p]}"  SELFWEIGHT  {1 if p == "D" else 0}')
    A("")
    fr = []
    for p in ("D", "SCP", "L"):
        for (e, segs) in nat["fl"][p]:
            a = _len(M, M["frames"][e]); ln, st = lname[e]
            for (s0, s1, q0, q1) in segs:            # kN/m == N/mm ; GRAV positivo hacia abajo
                if s1 - s0 < 1e-12: continue
                fr.append(f'  LINELOAD  "{ln}"  "{st}"  TYPE "TRAPF"  DIR "GRAV"  LC "{PAT[p]}"  '
                          f'FSTART {_g(q0)}  FEND {_g(q1)}  RDSTART {_g(s0/a)}  RDEND {_g(s1/a)}  ')
    if fr:
        A("$ FRAME OBJECT LOADS"); L.extend(fr); A("")
    sh = []
    for p in ("SCP", "L"):
        q = nat["area"][p]
        if q:
            for s_i in range(len(M["shells"])):
                an, st = aname[s_i]
                sh.append(f'  AREALOAD  "{an}"  "{st}"  TYPE "UNIFF"  DIR "GRAV"  LC "{PAT[p]}"  FVAL {_g(q*1e-3)}')
    if sh:
        A("$ SHELL OBJECT LOADS"); L.extend(sh); A("")

    A("$ ANALYSIS OPTIONS")
    A('  ACTIVEDOF "UX UY UZ RX RY RZ"  ')
    A('  PDELTA  METHOD "NONE"  ')
    A("")
    A("$ MASS SOURCE")
    A('  MASSSOURCE  "MsSrc1"    INCLUDEELEMENTS "No"    INCLUDEADDEDMASS "No"    INCLUDELOADS "Yes"    '
      'INCLUDEMOVE "No"    INCLUDELATERALMASS "Yes"    INCLUDEVERTICALMASS "Yes"    LUMPATSTORIES "No"    ISDEFAULT "Yes"  ')
    A('  MASSSOURCELOAD  "MsSrc1"  "Dead"  1 ')
    A("")
    A("$ LOAD CASES")
    for p in ("D", "SCP", "L"):
        A(f'  LOADCASE "{PAT[p]}"  TYPE  "Linear Static"  INITCOND  "PRESET"  ')
        A(f'  LOADCASE "{PAT[p]}"  LOADPAT  "{PAT[p]}"  SF 1 ')
    A('  LOADCASE "Modal"  TYPE  "Modal - Eigen"  INITCOND  "PRESET"  ')
    A('  LOADCASE "Modal"  MAXMODES 12  MINMODES 1  EIGENSHIFTFREQ 0  EIGENCUTOFFFREQ 0  EIGENTOL 1E-09  ALLOWAUTOFREQSHIFT "Yes"  ')
    A("")
    A("$ LOAD COMBINATIONS")
    for cn, items in MM.COMBOS.items():
        if len(items) == 1: continue                 # D, SCP, L = los propios casos
        A(f'  COMBO "{cn}"  TYPE "Linear Add"  ')
        for p, sf in items.items():
            A(f'  COMBO "{cn}"  LOADCASE  "{PAT[p]}"  SF {_g(sf)} ')
    A("")
    A("  END")
    A("$ END OF MODEL FILE")
    with open(path, "w", encoding="ascii", newline="\r\n") as fh:
        fh.write("\n".join(L) + "\n")
    return path


# ==================================================================
#  SAP2000 .s2k  (kN, m)
# ==================================================================
def to_s2k(M, path):
    P, mat, secs = M["P"], M["mat"], M["secs"]
    nodes = M["nodes"]; nat = _nat(M)
    MATN = "CONC"
    L = []; A = L.append
    def T(name): A(f'TABLE:  "{name}"')
    def blank(): A(" ")
    A("File mesa_torsion.s2k was saved on m/d/yy at h:mm:ss")
    A(f"; {AVISO_RUTA}")
    A(f"; Mesa de Torsion general: nx={P['nx']} ny={P['ny']} pisos={P['pisos']} N={M['N']} "
      f"losa={M['slabprop']['tipo']} apoyo={P['support']} | malla explicita, offsets=0, sin diafragma")
    blank()
    T("PROGRAM CONTROL")
    A('   ProgramName=SAP2000   Version=24.1.0   CurrUnits="KN, m, C"   SteelCode="AISC 360-16"   ConcCode="ACI 318-19"')
    blank()
    T("ACTIVE DEGREES OF FREEDOM")
    A("   UX=Yes   UY=Yes   UZ=Yes   RX=Yes   RY=Yes   RZ=Yes")
    blank()
    T("COORDINATE SYSTEMS")
    A("   Name=GLOBAL   Type=Cartesian   X=0   Y=0   Z=0   AboutZ=0   AboutY=0   AboutX=0")
    blank()
    T("MATERIAL PROPERTIES 01 - GENERAL")
    A(f"   Material={MATN}   Type=Concrete   SymType=Isotropic   TempDepend=No   Color=Green")
    blank()
    T("MATERIAL PROPERTIES 02 - BASIC MECHANICAL PROPERTIES")
    A(f"   Material={MATN}   UnitWeight={_g(mat['gamma'])}   UnitMass={_g(mat['rho'])}   E1={_g(mat['E'])}   "
      f"G12={_g(mat['G'])}   U12={_g(mat['nu'])}   A1=9.9E-06")
    blank()
    T("MATERIAL PROPERTIES 03B - CONCRETE DATA")
    A(f"   Material={MATN}   Fc=27579   eFc=27579   LtWtConc=No   SSCurveOpt=Mander   SSHysType=Takeda   "
      f"SFc=0.00222   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0")
    blank()
    T("FRAME SECTION PROPERTIES 01 - GENERAL")
    for nm in ("COL", "VIGA"):
        s = secs[nm]
        t3, t2 = (s["b"], s["h"]) if nm == "COL" else (s["h"], s["b"])
        As = 5/6*s["A"]
        A(f"   SectionName={nm}   Material={MATN}   Shape=General   t3={_g(t3)}   t2={_g(t2)}   Area={_g(s['A'])}   "
          f"TorsConst={_g(s['J'])}   I33={_g(s['Iy'])}   I22={_g(s['Iz'])}   I23=0   AS2={_g(As)}   AS3={_g(As)} _")
        A("        Color=Blue   FromFile=No   AMod=1   A2Mod=1   A3Mod=1   JMod=1   I2Mod=1   I3Mod=1   MMod=1   WMod=1")
    blank()
    if M["shells"]:
        T("AREA SECTION PROPERTIES")
        typ = "Membrane" if nat["model"] == "Membrane" else "Shell-Thin"
        A(f"   Section=LOSA   Material={MATN}   MatAngle=0   AreaType=Shell   Type={typ}   DrillDOF=Yes   "
          f"Thickness={_g(nat['t'])}   BendThick={_g(nat['t'])}   Color=Cyan")
        blank()
    T("JOINT COORDINATES")
    for i, n in enumerate(nodes):
        A(f"   Joint={i+1}   CoordSys=GLOBAL   CoordType=Cartesian   XorR={_g(n[0])}   Y={_g(n[1])}   Z={_g(n[2])}   SpecialJt=No")
    blank()
    T("CONNECTIVITY - FRAME")
    for k, f in enumerate(M["frames"]):
        A(f"   Frame={k+1}   JointI={f['i']+1}   JointJ={f['j']+1}   IsCurved=No")
    blank()
    T("FRAME SECTION ASSIGNMENTS")
    for k, f in enumerate(M["frames"]):
        A(f"   Frame={k+1}   AutoSelect=N.A.   AnalSect={f['sec']}   MatProp=Default")
    blank()
    if M["shells"]:
        T("CONNECTIVITY - AREA")
        for k, s in enumerate(M["shells"]):
            A(f"   Area={k+1}   NumJoints=4   " + "   ".join(f"Joint{c+1}={n+1}" for c, n in enumerate(s["n"])))
        blank()
        T("AREA SECTION ASSIGNMENTS")
        for k in range(len(M["shells"])):
            A(f"   Area={k+1}   Section=LOSA   MatProp=Default")
        blank()
        if abs(nat["wmod"] - 1) > 1e-12 or nat["mods"]:
            # tabla y campos de un .$2k escrito por SAP2000 ("f11 ... v23 MassMod WeightMod")
            T("AREA STIFFNESS MODIFIERS")
            md = nat["mods"] or [1]*8 + [nat["wmod"]]*2
            fila = "   ".join(f"{k}={_g(v)}" for k, v in zip(["f11", "f22", "f12", "m11", "m22", "m12", "v13", "v23", "MassMod", "WeightMod"], md))
            for k in range(len(M["shells"])):
                A(f"   Area={k+1}   {fila}")
            blank()
    T("JOINT RESTRAINT ASSIGNMENTS")
    for n, r in M["restr"].items():
        A(f"   Joint={n+1}   " + "   ".join(f"{d}={'Yes' if b else 'No'}" for d, b in zip(["U1", "U2", "U3", "R1", "R2", "R3"], r)))
    blank()
    T("LOAD PATTERN DEFINITIONS")
    for p in ("D", "SCP", "L"):
        A(f"   LoadPat={PAT[p]}   DesignType={PAT_TYPE_S2K[p]}   SelfWtMult={1 if p == 'D' else 0}")
    blank()
    T("LOAD CASE DEFINITIONS")
    for p in ("D", "SCP", "L"):
        A(f'   Case={PAT[p]}   Type=LinStatic   InitialCond=Zero   DesTypeOpt="Prog Det"   DesignType={PAT_TYPE_S2K[p]}   '
          f'DesActOpt="Prog Det"   DesignAct=Non-Composite   AutoType=None   RunCase=Yes')
    blank()
    T("CASE - STATIC 1 - LOAD ASSIGNMENTS")
    for p in ("D", "SCP", "L"):
        A(f'   Case={PAT[p]}   LoadType="Load pattern"   LoadName={PAT[p]}   LoadSF=1')
    blank()
    fr = []
    for p in ("D", "SCP", "L"):
        for (e, segs) in nat["fl"][p]:
            a = _len(M, M["frames"][e])
            for (s0, s1, q0, q1) in segs:            # Dir=Z global, negativo = hacia abajo
                if s1 - s0 < 1e-12: continue
                fr.append(f"   Frame={e+1}   LoadPat={PAT[p]}   CoordSys=GLOBAL   Type=Force   Dir=Z   DistType=RelDist   "
                          f"RelDistA={_g(s0/a)}   RelDistB={_g(s1/a)}   AbsDistA={_g(s0)}   AbsDistB={_g(s1)}   "
                          f"FOverLA={_g(-q0)}   FOverLB={_g(-q1)}")
    if fr:
        T("FRAME LOADS - DISTRIBUTED"); L.extend(fr); blank()
    ar = []
    for p in ("SCP", "L"):
        q = nat["area"][p]
        if q:
            for k in range(len(M["shells"])):
                ar.append(f"   Area={k+1}   LoadPat={PAT[p]}   CoordSys=GLOBAL   Dir=Z   UnifLoad={_g(-q)}")
    if ar:
        T("AREA LOADS - UNIFORM"); L.extend(ar); blank()
    T("COMBINATION DEFINITIONS")
    for cn, items in MM.COMBOS.items():
        if len(items) == 1: continue
        for k, (p, sf) in enumerate(items.items()):
            if k == 0:
                A(f'   ComboName={cn}   ComboType="Linear Add"   AutoDesign=No   CaseType="Linear Static"   CaseName={PAT[p]}   '
                  f'ScaleFactor={_g(sf)}   SteelDesign=None   ConcDesign=None   AlumDesign=None   ColdDesign=None')
            else:
                A(f'   ComboName={cn}   CaseType="Linear Static"   CaseName={PAT[p]}   ScaleFactor={_g(sf)}')
    blank()
    A("END TABLE DATA")
    with open(path, "w", encoding="ascii", newline="\r\n") as fh:
        fh.write("\n".join(L) + "\n")
    return path


if __name__ == "__main__":
    import sys, os
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    M = MM.build()
    print(to_e2k(M, os.path.join(out, "mesa_1x1x1_shellthin.e2k")))
    print(to_s2k(M, os.path.join(out, "mesa_1x1x1_shellthin.s2k")))
