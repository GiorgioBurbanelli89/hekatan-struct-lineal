# -*- coding: utf-8 -*-
"""Inspect property modifiers and cracking for concreteOnly."""
import os, time, json
import comtypes.client

EDB = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases\case_concreteOnly.EDB"
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
    except Exception:
        obj = helper.CreateObject(ETABS_EXE)
        obj.ApplicationStart()
        time.sleep(5)
    return obj.SapModel

SapModel = connect()
SapModel.File.OpenFile(EDB)
SapModel.SetPresentUnits(6)

# Modifiers per frame section
print("=== Frame section modifiers (concreteOnly) ===")
for sect in ["BeamSec", "ColSec"]:
    Value = [0.0]*8
    r = SapModel.PropFrame.GetModifiers(sect, Value)
    print(f"  {sect}: r={r}")

# Modifiers per shell
print("=== Shell modifiers ===")
Value = [0.0]*10
r = SapModel.PropArea.GetModifiers("Losa", Value)
print(f"  Losa: r={r}")

# Get assigned frame elements and check per-element modifiers
print("=== Per-frame element modifiers ===")
NumberNames = 0; MyName = []
nl = SapModel.FrameObj.GetNameList(NumberNames, MyName)
frame_names = list(nl[1])[:5]  # first 5
for f in frame_names:
    Value = [0.0]*8
    r = SapModel.FrameObj.GetModifiers(f, Value)
    print(f"  Frame {f}: r={r}")

# Per-area
print("=== Per-area element modifiers ===")
NumberNames = 0; MyName = []
nl = SapModel.AreaObj.GetNameList(NumberNames, MyName)
area_names = list(nl[1])[:3]
for a in area_names:
    Value = [0.0]*10
    r = SapModel.AreaObj.GetModifiers(a, Value)
    print(f"  Area {a}: r={r}")

# Check load combinations / design modifiers
print("\n=== Design modifiers (Concrete) ===")
try:
    # ConcreteFrame
    NumberNames=0; MyName=[]
    nl = SapModel.DesignConcrete.GetCode_List(NumberNames, MyName)
    print(f"  Concrete codes: {nl}")
except Exception as e:
    print(f"  Code list err: {e}")

# Check if there's automatic cracking
print("\n=== Self-weight / loads check ===")
SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

# Get all joints - find max
NumberNames = 0; MyName = []
nl = SapModel.PointObj.GetNameList(NumberNames, MyName)
joints = list(nl[1])
max_uz = 0; max_j = None
for j in joints:
    try:
        NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
        U1=[]; U2=[]; U3=[]; R1=[]; R2=[]; R3=[]
        rl = SapModel.Results.JointDispl(j, 0, NR, Obj, Elm, ACase, ST, SN, U1, U2, U3, R1, R2, R3)
        if rl[0] > 0:
            uz = rl[8][0]
            if abs(uz) > abs(max_uz):
                max_uz = uz; max_j = j
    except:
        pass
print(f"  Max |Uz|: joint {max_j} = {max_uz*1000:.4f} mm")

# Check load patterns and self weight
print("\n=== Load patterns ===")
NumberNames=0; MyName=[]
lp = SapModel.LoadPatterns.GetNameList(NumberNames, MyName)
for n in list(lp[1]):
    sw = SapModel.LoadPatterns.GetSelfWTMultiplier(n, 0.0)
    pt = SapModel.LoadPatterns.GetLoadType(n, 0)
    print(f"  Pattern {n}: SelfWtMult={sw}, Type={pt}")
