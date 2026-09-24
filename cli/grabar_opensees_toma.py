# -*- coding: utf-8 -*-
"""Toma de OpenSees con el MOUSE REAL, grabada del escritorio con ffmpeg gdigrab.

    python cli/grabar_opensees_toma.py SALIDA.mkv [script.py]

OpenSees no tiene ventana propia: se le ve por **Hekatan Py**, que abre el script,
lo corre con Python real y pinta el resultado en su panel de salida (el GIF del
modo entra por el marcador `__CPSPY_GIF__`). O sea que la "GUI de OpenSees" en este
vídeo es la de Hekatan Py, y eso es honesto: es donde el usuario lo corre.

Mismo patrón que `grabar_sap_toma.py` y `grabar_etabs_toma.py`: se pone la ventana
al frente, se mueve el ratón de verdad (nada inyectado por código) y se graba el
escritorio. Deja un `.marcas.txt` con el segundo de cada paso para cortar después.
"""
import ctypes
import os
import subprocess
import sys
import time
import warnings

warnings.filterwarnings("ignore")
import pyautogui

FF = os.environ.get("FFMPEG") or os.path.join(
    os.path.expanduser("~"), "AppData", "Roaming", "Python", "Python312", "site-packages",
    "imageio_ffmpeg", "binaries", "ffmpeg-win-x86_64-v7.1.exe")
EXE = r"C:\Program Files\Calcpad Suite Py\HekatanPython3.exe"

salida = sys.argv[1]
guion = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "validation", "opensees", "heks_a_opensees.py")
guion = os.path.abspath(guion)
pyautogui.PAUSE = 0.1

def ir(x, y, d=0.8): pyautogui.moveTo(x, y, duration=d)
def clic(x, y, d=0.8, pausa=0.9):
    ir(x, y, d); time.sleep(0.25); pyautogui.click(); time.sleep(pausa)

# 1. Hekatan Py con el script ya abierto (es su forma normal de abrirlo)
subprocess.Popen([EXE, guion])
from pywinauto import Desktop                   # noqa: E402
# La ventana tarda: arranque + WebView2 + el propio script, que al abrirse se
# ejecuta solo. Se espera hasta 60 s en vez de dar por hecho que ya está.
w = None
for _ in range(60):
    time.sleep(1)
    v = [x for x in Desktop(backend="win32").windows()
         if "hekatan" in x.window_text().lower() and "py" in x.window_text().lower()]
    if v: w = v[0]; break
if w is None:
    print("ventanas visibles:")
    for x in Desktop(backend="win32").windows():
        if x.window_text().strip(): print("   ", x.window_text()[:70])
    sys.exit("no encuentro la ventana de Hekatan Py")
print("ventana:", w.window_text())
time.sleep(6)                                   # que termine de pintar el resultado
ctypes.windll.user32.ShowWindow(w.handle, 3)    # maximizada
ctypes.windll.user32.SetForegroundWindow(w.handle)
time.sleep(1.5)
izq, arr, der, aba = w.rectangle().left, w.rectangle().top, w.rectangle().right, w.rectangle().bottom
print("ventana en %d,%d - %d,%d" % (izq, arr, der, aba), flush=True)
ir((izq + der) // 2, aba - 120, 0.4)

rec = subprocess.Popen([FF, "-y", "-v", "error", "-f", "gdigrab", "-framerate", "15",
                        "-draw_mouse", "1", "-i", "desktop", "-c:v", "libx264",
                        "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p", salida],
                       stdin=subprocess.PIPE)
marcas = []
t0 = time.time()
def marca(txt):
    marcas.append((round(time.time() - t0, 2), txt))
    print("%6.2f s  %s" % (time.time() - t0, txt), flush=True)

time.sleep(1.5)
marca("la ventana con el script de OpenSees")
# 2. recorrer el código con la rueda, para que se vea qué se está corriendo
ir(izq + 400, arr + 400, 0.6)
for _ in range(6):
    pyautogui.scroll(-3); time.sleep(0.55)
marca("el traductor: nudos, barras y cascaras a OpenSees")
for _ in range(6):
    pyautogui.scroll(-3); time.sleep(0.55)
marca("la parte del modal y del dibujo")
# 3. correr: el boton del play (AutoRun) esta arriba, a la izquierda del todo
clic(izq + 893, arr + 99, 1.0, 2.0)
marca("se corre con Python real: openseespy")
time.sleep(38)                                   # el calculo y los tres modos
marca("el resultado: los modos animados dentro del panel")
ir(izq + 1400, arr + 500, 0.8)
time.sleep(14)
marca("los tres modos, uno tras otro")
time.sleep(6)

rec.communicate(b"q")
open(salida + ".marcas.txt", "w", encoding="utf-8").write(
    "\n".join("%7.2f  %s" % m for m in marcas) + "\n")
print("grabado -> %s  (+ .marcas.txt)" % salida)
