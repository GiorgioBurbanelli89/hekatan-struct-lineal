# -*- coding: utf-8 -*-
"""Toma de ETABS con el MOUSE REAL, grabada del escritorio con ffmpeg gdigrab.
    python cli/grabar_etabs_toma.py SALIDA.mkv
Coordenadas FÍSICAS (2560×1600) de ETABS maximizado (medidas el 13-sep-2026, _gui/etabs_*.png)."""
import sys, time, subprocess, warnings
warnings.filterwarnings("ignore")
import pyautogui
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
salida = sys.argv[1]
pyautogui.PAUSE = 0.1
def ir(x, y, d=0.8): pyautogui.moveTo(x, y, duration=d)
def clic(x, y, d=0.8, pausa=0.9): ir(x, y, d); time.sleep(0.25); pyautogui.click(); time.sleep(pausa)
def quieto(s): time.sleep(s)

clic(1878, 1117, 0.3, 0.8)                  # Done: cerrar la tabla que quedó abierta
ir(2048, 1300, 0.3)
rec = subprocess.Popen([FF, "-y", "-v", "error", "-f", "gdigrab", "-framerate", "15", "-draw_mouse", "1", "-i", "desktop",
                        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p", salida], stdin=subprocess.PIPE)
marcas = []; t0 = time.time()
def marca(txt): marcas.append((round(time.time() - t0, 2), txt)); print("%6.2f s  %s" % (time.time() - t0, txt), flush=True)
time.sleep(1.5)
marca("1 · el modelo en ETABS (modo 1 ya mostrado)"); quieto(3)
marca("2 · deformada Dead con contorno Uz")
clic(2048, 1300, 0.5, 0.4); pyautogui.press("f6"); time.sleep(1.8)
clic(1020, 315)                             # Case
clic(1120, 1265, pausa=2.5); quieto(4)      # OK
marca("3 · modo 1 y animación")
pyautogui.press("f6"); time.sleep(1.8)
clic(1402, 315)                             # Mode (modo 1)
clic(1120, 1265, pausa=2.0)
clic(2107, 1507, pausa=0.5); quieto(7)      # Start Animation
clic(2107, 1507, pausa=1.0)                 # parar
marca("4 · tabla de masa participativa")
pyautogui.hotkey("ctrl", "t"); time.sleep(2.5)
clic(705, 768); clic(730, 817); quieto(1.5) # + Structure Output, + Modal Information
clic(1691, 1185, pausa=3.0); quieto(6)      # OK -> la tabla
clic(1878, 1117, pausa=1.5)                 # Done
marca("fin")
rec.stdin.write(b"q"); rec.stdin.flush(); rec.wait(timeout=30)
open(salida + ".marcas.txt", "w", encoding="utf-8").write("\n".join("%.2f\t%s" % m for m in marcas) + "\n")
print("toma:", salida)
