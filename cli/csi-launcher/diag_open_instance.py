# -*- coding: utf-8 -*-
"""Attach a la instancia ETABS abierta y diagnostica modelo + analysis errors."""
import os, time

LOG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "diag_open.log")
if os.path.exists(LOG): os.remove(LOG)
_fh = open(LOG, "w", encoding="utf-8", buffering=1)
def p(*a):
    line = " ".join(str(x) for x in a); print(line, flush=True)
    _fh.write(line + "\n"); _fh.flush()

from pythonnet import load; load("coreclr")
import clr
DLL = r"C:\Program Files\Computers and Structures\ETABS 22\ETABSv1.dll"
clr.AddReference(DLL)
from ETABSv1 import (Helper, cHelper, cOAPI, cSapModel, cFile,
                     cPointObj, cFrameObj, cPropFrame, cPropMaterial,
                     cLoadPatterns, cLoadCases, cAnalyze, eUnits, eItemTypeElm)
import System

p("[1] Attaching a instancia ETABS abierta...")
helper = cHelper(Helper())
try:
    ETABS = cOAPI(helper.GetObject("CSI.ETABS.API.ETABSObject"))
    p("    ✓ OK")
except Exception as ex:
    p(f"    FAIL: {ex}")
    raise SystemExit(1)

sap = cSapModel(ETABS.SapModel)
sap.SetPresentUnits(eUnits(6))  # kN_m_C

# ── Modelo info ──
p("\n[2] Información del modelo activo:")
fn = ""
try:
    fn = sap.GetModelFilename()
except Exception:
    pass
p(f"    Filename: {fn}")

# ── Materiales ──
p("\n[3] Materiales:")
PropMaterial = cPropMaterial(sap.PropMaterial)
NR=0; Names=[]
[ret, NR, Names] = PropMaterial.GetNameList(NR, Names)
for m in list(Names):
    p(f"    - {m}")

# ── Secciones ──
p("\n[4] Frame sections:")
PropFrame = cPropFrame(sap.PropFrame)
NR=0; Names=[]
[ret, NR, Names] = PropFrame.GetNameList(NR, Names)
for s in list(Names):
    p(f"    - {s}")

# ── Points (joints) con sus restraints ──
p("\n[5] Points (joints) — coords + restraints:")
PointObj = cPointObj(sap.PointObj)
NR=0; Names=[]
[ret, NR, Names] = PointObj.GetNameList(NR, Names)
points = list(Names)
p(f"    Total joints: {NR}")
restrained_count = 0
free_count = 0
for pt in points:
    X=0.0; Y=0.0; Z=0.0
    [ret, X, Y, Z] = PointObj.GetCoordCartesian(pt, X, Y, Z)
    Rest = System.Array[bool]([False]*6)
    [ret, Rest] = PointObj.GetRestraint(pt, Rest)
    rest_list = [bool(r) for r in Rest]
    is_restrained = any(rest_list)
    if is_restrained:
        restrained_count += 1
        dofs = []
        if rest_list[0]: dofs.append("UX")
        if rest_list[1]: dofs.append("UY")
        if rest_list[2]: dofs.append("UZ")
        if rest_list[3]: dofs.append("RX")
        if rest_list[4]: dofs.append("RY")
        if rest_list[5]: dofs.append("RZ")
        p(f"    pt={pt!r} ({X:.3f}, {Y:.3f}, {Z:.3f})  RESTRAINT: {' '.join(dofs)}")
    else:
        free_count += 1
p(f"    → {restrained_count} restrained, {free_count} free")

# ── Frames ──
p("\n[6] Frames:")
FrameObj = cFrameObj(sap.FrameObj)
NR=0; Names=[]
[ret, NR, Names] = FrameObj.GetNameList(NR, Names)
frames = list(Names)
p(f"    Total frames: {NR}")
for f in frames[:5]:
    Pt1 = ""; Pt2 = ""
    [ret, Pt1, Pt2] = FrameObj.GetPoints(f, Pt1, Pt2)
    Sec = ""
    [ret, Sec, _] = FrameObj.GetSection(f, Sec)
    p(f"    {f}: {Pt1} → {Pt2}  sec={Sec}")
if len(frames) > 5:
    p(f"    ... ({len(frames)-5} más)")

# ── Load patterns ──
p("\n[7] Load patterns:")
LP = cLoadPatterns(sap.LoadPatterns)
NR=0; LPNames=[]
[ret, NR, LPNames] = LP.GetNameList(NR, LPNames)
for n in list(LPNames):
    sw = 0.0
    try:
        [ret, sw] = LP.GetSelfWtMultiplier(n, sw)
    except Exception:
        pass
    p(f"    - {n}  SW_mult={sw}")

# ── Load cases ──
p("\n[8] Load cases:")
LC = cLoadCases(sap.LoadCases)
NR=0; LCNames=[]
[ret, NR, LCNames] = LC.GetNameList(NR, LCNames)
for n in list(LCNames):
    p(f"    - {n}")

# ── Mass info ──
p("\n[9] Mass source / total weight:")
try:
    # Try to compute total weight from materials × frame volumes
    total_vol_steel = 0.0
    for f in frames:
        L_val = 0.0
        # GetLength: returns end-to-end length
        try:
            [ret, L_val] = FrameObj.GetLength(f, L_val)
        except Exception:
            pass
        Sec = ""
        [ret, Sec, _] = FrameObj.GetSection(f, Sec)
        if Sec:
            A=0; As2=0; As3=0; T=0; I22=0; I33=0; S22=0; S33=0; Z22=0; Z33=0; R22=0; R33=0
            try:
                [ret, A, As2, As3, T, I22, I33, S22, S33, Z22, Z33, R22, R33] = \
                    PropFrame.GetSectProps(Sec, A, As2, As3, T, I22, I33, S22, S33, Z22, Z33, R22, R33)
                total_vol_steel += A * L_val
            except Exception:
                pass
    p(f"    Volumen steel total (∑ A·L): {total_vol_steel*1e6:.1f} cm³  ({total_vol_steel:.6f} m³)")
    p(f"    Peso esperado @ γ=78.488 kN/m³: {total_vol_steel * 78.488:.4f} kN")
except Exception as ex:
    p(f"    Error computing mass: {ex}")

p("\nDONE — diagnóstico completo guardado en diag_open.log")
