# -*- coding: utf-8 -*-
"""
ETABS forense robusto: lanza thread que cierra dialogs modales automaticamente.
Extrae reacciones de los 3 casos.
"""
import os, time, json, sys, threading
import comtypes.client
import ctypes
from ctypes import wintypes

EDB_DIR = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_3cases"
E2K_DIR = EDB_DIR
ETABS_EXE = r"C:\Program Files\Computers and Structures\ETABS 22\ETABS.exe"
CASES = ["steelOnly", "filled", "concreteOnly"]

# ===== Win32 dialog auto-closer =====
user32 = ctypes.windll.user32
WM_CLOSE = 0x0010
BM_CLICK = 0x00F5
WM_COMMAND = 0x0111

def find_and_close_dialogs():
    """Find ETABS modal dialogs and click their default button."""
    closed = []
    def enum_proc(hwnd, lparam):
        length = user32.GetWindowTextLengthW(hwnd)
        if length > 0:
            buf = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(hwnd, buf, length + 1)
            title = buf.value
            if user32.IsWindowVisible(hwnd) and title == "ETABS":
                # Es un dialog ETABS modal - enviar Enter (default = Aceptar)
                user32.SendMessageW(hwnd, 0x0100, 0x0D, 0)  # WM_KEYDOWN VK_RETURN
                user32.SendMessageW(hwnd, 0x0101, 0x0D, 0)  # WM_KEYUP VK_RETURN
                closed.append((hwnd, title))
        return True
    EnumWindowsProc = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
    user32.EnumWindows(EnumWindowsProc(enum_proc), 0)
    return closed

class DialogCloser(threading.Thread):
    def __init__(self):
        super().__init__(daemon=True)
        self.stop_event = threading.Event()
    def run(self):
        while not self.stop_event.is_set():
            time.sleep(2)
            try:
                closed = find_and_close_dialogs()
                if closed:
                    for hwnd, title in closed:
                        print(f"  [DIALOG] Cerrado: HWND={hwnd} '{title}'", flush=True)
            except Exception:
                pass

def connect():
    helper = comtypes.client.CreateObject('ETABSv1.Helper')
    helper = helper.QueryInterface(comtypes.gen.ETABSv1.cHelper)
    obj = None
    try:
        obj = helper.GetObject("CSI.ETABS.API.ETABSObject")
        if obj is None: raise RuntimeError("None")
        print("[OK] Conectado a ETABS abierto", flush=True)
    except Exception:
        print(f"  [..] Lanzando ETABS via ProgID...", flush=True)
        try:
            obj = helper.CreateObjectProgID("CSI.ETABS.API.ETABSObject")
            obj.ApplicationStart(); time.sleep(8)
            print("[OK] Lanzado", flush=True)
        except Exception:
            obj = helper.CreateObject(ETABS_EXE)
            obj.ApplicationStart(); time.sleep(8)
            print("[OK] Lanzado via EXE", flush=True)
    return obj.SapModel

def inspect(SapModel, case_id):
    print(f"\n{'='*70}\n{case_id}\n{'='*70}", flush=True)
    # Reload from e2k each time to ensure fresh state
    e2k = os.path.join(E2K_DIR, f"case_{case_id}.e2k")
    edb_fresh = os.path.join(EDB_DIR, f"case_{case_id}_fresh.EDB")
    print(f"  [..] Loading e2k: {os.path.basename(e2k)}", flush=True)
    SapModel.SetPresentUnits(6)
    SapModel.File.OpenFile(e2k)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    SapModel.File.Save(edb_fresh)
    SapModel.File.OpenFile(edb_fresh)
    SapModel.SetPresentUnits(6)
    SapModel.SetModelIsLocked(False)
    print(f"  [..] RunAnalysis", flush=True)
    SapModel.Analyze.RunAnalysis()
    print(f"  [OK] Analysis done", flush=True)

    # Joints
    NumberNames=0; MyName=[]
    nj = SapModel.PointObj.GetNameList(NumberNames, MyName)
    all_joints = list(nj[1])
    print(f"  Total joints: {nj[0]}", flush=True)

    # Reactions
    SapModel.Results.Setup.DeselectAllCasesAndCombosForOutput()
    SapModel.Results.Setup.SetCaseSelectedForOutput("Dead")

    print(f"  Reacciones (Dead):", flush=True)
    print(f"  {'joint':>6s} | {'Fx':>10s} {'Fy':>10s} {'Fz':>10s} | {'Mx':>10s} {'My':>10s} {'Mz':>10s}", flush=True)

    sumF = [0]*6
    reactions = {}
    for j in all_joints:
        try:
            NR=0; Obj=[]; Elm=[]; ACase=[]; ST=[]; SN=[]
            F1=[]; F2=[]; F3=[]; M1=[]; M2=[]; M3=[]
            rl = SapModel.Results.JointReact(j, 0, NR, Obj, Elm, ACase, ST, SN, F1, F2, F3, M1, M2, M3)
            n = rl[0]
            if n > 0:
                fx, fy, fz = rl[6][0], rl[7][0], rl[8][0]
                mx, my, mz = rl[9][0], rl[10][0], rl[11][0]
                magnitude = abs(fx)+abs(fy)+abs(fz)+abs(mx)+abs(my)+abs(mz)
                if magnitude > 1e-6:
                    print(f"  {j:>6s} | {fx:>10.4f} {fy:>10.4f} {fz:>10.4f} | {mx:>10.4f} {my:>10.4f} {mz:>10.4f}", flush=True)
                    reactions[j] = dict(Fx=fx, Fy=fy, Fz=fz, Mx=mx, My=my, Mz=mz)
                    sumF[0]+=fx; sumF[1]+=fy; sumF[2]+=fz; sumF[3]+=mx; sumF[4]+=my; sumF[5]+=mz
        except Exception:
            pass
    print(f"  {'SUM':>6s} | {sumF[0]:>10.4f} {sumF[1]:>10.4f} {sumF[2]:>10.4f} | {sumF[3]:>10.4f} {sumF[4]:>10.4f} {sumF[5]:>10.4f}", flush=True)

    return {"case": case_id, "n_joints": nj[0], "reactions": reactions, "sumF": sumF}

def main():
    closer = DialogCloser()
    closer.start()
    print("[OK] Dialog auto-closer started", flush=True)

    SapModel = connect()
    res = []
    for c in CASES:
        try:
            res.append(inspect(SapModel, c))
        except Exception as e:
            import traceback
            traceback.print_exc()
            res.append({"case": c, "error": str(e)})

    closer.stop_event.set()

    # Resumen
    print(f"\n{'='*70}\nRESUMEN: REACCIONES POR CASO\n{'='*70}")
    print(f"{'Case':<14s} | {'sum Fx':>10s} | {'sum Fy':>10s} | {'sum Fz':>10s} | {'max |Fxy|':>10s}", flush=True)
    for r in res:
        if "error" in r:
            print(f"{r['case']}: {r['error']}", flush=True)
            continue
        max_fxy = max((abs(rd['Fx']) + abs(rd['Fy']))/2.0 for rd in r['reactions'].values()) if r['reactions'] else 0
        print(f"{r['case']:<14s} | {r['sumF'][0]:>10.4f} | {r['sumF'][1]:>10.4f} | {r['sumF'][2]:>10.4f} | {max_fxy:>10.4f}", flush=True)

    out = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct-lineal\Benchmark_Placa\composite_cft_columns\etabs_reactions_3cases.json"
    with open(out, "w") as f:
        json.dump(res, f, indent=2, default=str)
    print(f"\n[OK] {out}", flush=True)

if __name__ == "__main__":
    main()
