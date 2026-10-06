"""Conexión a SAP2000 vivo (o arranque) + armado del modelo de modelo.py + helpers de tablas."""
import os, sys, json
import comtypes.client
import comtypes.gen.SAP2000v1 as S
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from modelo import *
AQUI = os.path.dirname(os.path.abspath(__file__))

def conectar():
    h = comtypes.client.CreateObject("SAP2000v1.Helper").QueryInterface(S.cHelper)
    try:
        o = h.GetObject("CSI.SAP2000.API.SapObject"); o.SapModel.GetModelFilename()
    except Exception:
        o = h.CreateObjectProgID("CSI.SAP2000.API.SapObject"); o.ApplicationStart()
    return o, o.SapModel

def tabla(sm, clave, campos, filas):
    datos = [str(x) for f in filas for x in f]
    r = sm.DatabaseTables.SetTableForEditingArray(clave, 0, campos, len(filas), datos)
    if r[-1] != 0: print("SetTable", clave, r, flush=True)

def aplicar(sm):
    r = sm.DatabaseTables.ApplyEditedTables(True, 0, 0, 0, 0, "")
    log = [x for x in r if isinstance(x, str)]
    print("Apply ret", r[-1], "fatal/err/warn", r[0:3] if not isinstance(r[0], str) else r, flush=True)
    for l in log: print(l, flush=True)
    return r

def armar_viga(sm):
    sm.InitializeNewModel(6); sm.File.NewBlank(); sm.SetPresentUnits(6)
    sm.PropMaterial.SetMaterial("C", 2); sm.PropMaterial.SetMPIsotropic("C", E, NU, 1e-5); sm.PropMaterial.SetWeightAndMass("C", 1, 0.0)
    sm.PropFrame.SetRectangle("R", "C", H, B)
    for q, p in enumerate(NODES): sm.PointObj.AddCartesian(p[0], p[1], p[2], "", "N%d" % q)
    for e, f in enumerate(FRAMES): sm.FrameObj.AddByPoint("N%d" % f[0], "N%d" % f[1], "", "R", "F%d" % e)
    for q, s in APOYOS.items(): sm.PointObj.SetRestraint("N%d" % q, [bool(x) for x in s])
    sm.LoadPatterns.Add("SC", 8, 0, True)
    for q, c in SC.items(): sm.PointObj.SetLoadForce("N%d" % q, "SC", [float(x) for x in c], True)
    r = sm.PropFrame.GetSectProps("R"); return dict(A=r[0], As2=r[1], As3=r[2], J=r[3], I22=r[4], I33=r[5])

def carril(sm, nombre="L1", disc=DX):
    campos = ["Lane", "LaneFrom", "Frame", "Width", "Offset", "LoadGroup", "DiscAlong"]
    tabla(sm, "Lane Definition Data", campos, [[nombre, "Frame", "F%d" % e, 0, 0, "Default", disc] for e in range(len(FRAMES))])

def vehiculos(sm, lista):
    """lista de dict(nombre, ejes kN, sep m, unif [lead, inter..., trail] kN/m, var=(k, dmax)). TODOS en una sola tabla
    (cada SetTableForEditingArray REEMPLAZA lo pendiente de esa tabla)."""
    gen, cargas = [], []
    for V in lista:
        ejes, sep, var = V["ejes"], V["sep"], V.get("var")
        unif = V.get("unif") or [0.0] * (len(ejes) + 1)
        cargas.append([V["nombre"], "Leading Load", unif[0], ejes[0], 0, 0])
        for k in range(1, len(ejes)):
            esvar = bool(var) and var[0] == k - 1
            cargas.append([V["nombre"], "Variable Length" if esvar else "Fixed Length", unif[k], ejes[k], sep[k - 1], var[1] if esvar else 0])
        cargas.append([V["nombre"], "Trailing Load", unif[-1], 0, 0, 0])
        gen.append([V["nombre"], len(ejes) - 1, "No"])
    tabla(sm, "Vehicles 2 - General Vehicles 1 - General", ["VehName", "NumInter", "StayInLane"], gen)
    tabla(sm, "Vehicles 3 - General Vehicles 2 - Loads", ["VehName", "LoadType", "InterUnif", "InterAxle", "InterMinD", "InterMaxD"], cargas)

def vehiculo(sm, nombre, ejes, sep, unif=None, var=None):
    vehiculos(sm, [dict(nombre=nombre, ejes=ejes, sep=sep, unif=unif, var=var)])
