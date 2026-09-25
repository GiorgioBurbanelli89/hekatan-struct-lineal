# -*- coding: utf-8 -*-
"""El Test II del paper (voladizo corto de Ibrahimbegovic, Taylor y Wilson 1990) en ETABS,
importando el .e2k que escribe Hekatan Struct: NO se dibuja nada a mano, que es justo lo que
tarda (Jorge, 22-sep-2026: «solo importar el e2k s2k de Hekatan Struct para no demorarnos
haciendo geometria»).

Para cada malla: abre el .e2k, resuelve, lee Uz del nudo de la PUNTA (el del centro del borde
derecho) y guarda un fotograma de la ventana de ETABS.

    python etabs_itw.py            -> ITW_T2.json + fotogramas etabs_*.png
"""
import json, os, sys, time

import comtypes.client

AQUI = os.path.dirname(os.path.abspath(__file__))
MALLAS = [("4x1", "ITW_T2.e2k"), ("8x2", "ITW_T2_8x2.e2k"), ("16x4", "ITW_T2_16x4.e2k")]
PAPER = {"4x1": 0.3445, "8x2": 0.3504, "16x4": 0.3543}
EXACTO = 0.3553


def foto(nombre):
    """Fotograma de la ventana de ETABS (PrintWindow, aunque esté tapada)."""
    try:
        import win32gui, win32ui
        from PIL import Image
        import ctypes
        h = None
        def cb(w, _):
            nonlocal h
            if win32gui.IsWindowVisible(w) and "ETABS" in win32gui.GetWindowText(w):
                h = h or w
            return True
        win32gui.EnumWindows(cb, None)
        if not h: return
        l, t, r, b = win32gui.GetWindowRect(h)
        wdc = win32gui.GetWindowDC(h); dc = win32ui.CreateDCFromHandle(wdc); mem = dc.CreateCompatibleDC()
        bmp = win32ui.CreateBitmap(); bmp.CreateCompatibleBitmap(dc, r - l, b - t); mem.SelectObject(bmp)
        ctypes.windll.user32.PrintWindow(h, mem.GetSafeHdc(), 2)
        info = bmp.GetInfo(); bits = bmp.GetBitmapBits(True)
        Image.frombuffer("RGB", (info["bmWidth"], info["bmHeight"]), bits, "raw", "BGRX", 0, 1).save(
            os.path.join(AQUI, f"etabs_{nombre}.png"))
        mem.DeleteDC(); dc.DeleteDC(); win32gui.ReleaseDC(h, wdc); win32gui.DeleteObject(bmp.GetHandle())
    except Exception as e:                                   # un fotograma no puede tumbar la medida
        print("  (sin fotograma:", e, ")")


helper = comtypes.client.CreateObject("ETABSv1.Helper").QueryInterface(
    comtypes.gen.ETABSv1.cHelper)
sap = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
sap.ApplicationStart()
S = sap.SapModel
res = {}
for nombre, fich in MALLAS:
    ruta = os.path.join(AQUI, fich)
    print(nombre, ruta, flush=True)
    S.InitializeNewModel(6)                                   # kN, m, C
    if S.File.OpenFile(ruta) != 0:
        print("  no abre"); continue
    S.SetPresentUnits(6)
    S.File.Save(os.path.join(AQUI, os.path.splitext(fich)[0] + ".EDB"))   # sin guardar, ETABS da ceros
    S.Analyze.RunAnalysis()
    # nudo de la PUNTA: el de x maximo y z mas cercano a la mitad del canto
    n = S.PointObj.GetNameList()[1]
    mejor, mejorx, mejorz = None, -1e9, None
    zz = []
    for p in n:
        x, y, z = S.PointObj.GetCoordCartesian(p, 0.0, 0.0, 0.0)[:3]
        zz.append(z)
    zmed = (min(zz) + max(zz)) / 2
    for p in n:
        x, y, z = S.PointObj.GetCoordCartesian(p, 0.0, 0.0, 0.0)[:3]
        if x > mejorx - 1e-9 and (mejor is None or x > mejorx + 1e-9 or abs(z - zmed) < abs(mejorz - zmed)):
            mejor, mejorx, mejorz = p, x, z
    S.Results.Setup.DeselectAllCasesAndCombosForOutput()
    for c in S.RespCombo.GetNameList()[1] or []:
        pass
    for c in S.LoadCases.GetNameList()[1]:
        S.Results.Setup.SetCaseSelectedForOutput(c)
    r = S.Results.JointDispl(mejor, 0, 0, [], [], [], [], [], [], [], [], [], [])
    # r = (n, Obj, Elm, Caso, StepType, StepNum, U1, U2, U3, R1, R2, R3, ret): la flecha del
    # voladizo va en U3, que es el eje del plano del modelo (XZ). Con U2 salia 0 (22-sep-2026).
    uz = abs(r[8][0]) if r[0] > 0 else float("nan")
    res[nombre] = {"nudo": mejor, "x": mejorx, "z": mejorz, "uz": uz,
                   "paper": PAPER[nombre], "dif_%": (uz / PAPER[nombre] - 1) * 100}
    print("  nudo", mejor, "Uz", uz, "paper", PAPER[nombre], flush=True)
    foto(nombre)
json.dump({"exacto": EXACTO, "mallas": res}, open(os.path.join(AQUI, "ITW_T2_etabs.json"), "w"), indent=1)
print(json.dumps(res, indent=1))
sap.ApplicationExit(False)
