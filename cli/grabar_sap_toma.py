# -*- coding: utf-8 -*-
"""Toma de SAP2000 (juez) con el MOUSE REAL, grabada del escritorio con ffmpeg gdigrab.
    python cli/grabar_sap_toma.py SALIDA.mkv
Coordenadas FÍSICAS (2560×1600) de SAP2000 maximizado (medidas el 13-sep-2026, _gui/sap_*.png)."""
import sys, time, subprocess, warnings
warnings.filterwarnings("ignore")
import pyautogui
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
salida = sys.argv[1]
pyautogui.PAUSE = 0.1

def ir(x, y, d=0.8): pyautogui.moveTo(x, y, duration=d)
def clic(x, y, d=0.8, pausa=0.9): ir(x, y, d); time.sleep(0.25); pyautogui.click(); time.sleep(pausa)
def quieto(s): time.sleep(s)

# preparar: cerrar el diálogo de tablas que quedó abierto y dejar SAP2000 al frente
# (15-sep-2026) Antes cerraba con un clic el diálogo de tablas; si NO está abierto ese punto cae
# SOBRE el modelo y selecciona una barra, que sale resaltada en el vídeo. Escape no toca nada.
pyautogui.press('esc'); time.sleep(0.6)
from pywinauto import Desktop
import ctypes
w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith("SAP2000")][0]
ctypes.windll.user32.ShowWindow(w.handle, 3); ctypes.windll.user32.SetForegroundWindow(w.handle); time.sleep(1.0)
ir(1500, 1000, 0.3)

rec = subprocess.Popen([FF, "-y", "-v", "error", "-f", "gdigrab", "-framerate", "15", "-draw_mouse", "1", "-i", "desktop",
                        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p", salida], stdin=subprocess.PIPE)
marcas = []; t0 = time.time()
def marca(txt): marcas.append((round(time.time() - t0, 2), txt)); print("%6.2f s  %s" % (time.time() - t0, txt), flush=True)
time.sleep(1.5)

marca("1 · el modelo en SAP2000 (modo 1 ya mostrado)"); quieto(3)
marca("2 · deformada Dead con contorno Uz")
pyautogui.press("f6"); time.sleep(1.4)
clic(1030, 492); clic(937, 528)            # Case: DEAD
clic(1504, 1059, pausa=2.5); quieto(4)      # OK
marca("3 · modo 1 y animación")
pyautogui.press("f6"); time.sleep(1.4)
clic(1030, 492); clic(937, 559)            # Case: MODAL
clic(1504, 1059, pausa=2.0)
clic(2077, 1513, pausa=0.5); quieto(7)      # Start Animation
clic(2077, 1513, pausa=1.0)                 # parar
marca("4 · tabla de masa participativa")
pyautogui.hotkey("ctrl", "t"); time.sleep(2.0)
# (14-sep-2026) SIN clics de despliegue: SAP2000 recuerda la tabla marcada, y en otro modelo el árbol cae en
# otra posición → el clic en (703, 805) marcaba «DESIGN DATA» y salía la tabla de diseño. Se deja ver el diálogo.
quieto(3.0)
clic(1690, 1222, pausa=3.0); quieto(6)      # OK -> la tabla
clic(1878, 1117, pausa=1.5)                 # Done
marca("fin")
rec.stdin.write(b"q"); rec.stdin.flush(); rec.wait(timeout=30)
open(salida + ".marcas.txt", "w", encoding="utf-8").write("\n".join("%.2f\t%s" % m for m in marcas) + "\n")
print("toma:", salida)
