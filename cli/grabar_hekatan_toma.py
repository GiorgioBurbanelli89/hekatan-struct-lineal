# -*- coding: utf-8 -*-
"""Toma de Hekatan Struct en el NAVEGADOR REAL (enlace público, GPU) con el mouse real, gdigrab del escritorio.
    python cli/grabar_hekatan_toma.py SALIDA.mkv
Coordenadas FÍSICAS (2560×1600) medidas el 13-sep-2026 con el enlace ?m=7nF68EUiy5UVJuli&modal=80
(panel Settings abierto a la izquierda, barra de dibujo plegada)."""
import sys, time, subprocess, warnings
warnings.filterwarnings("ignore")
import pyautogui
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
salida = sys.argv[1]
pyautogui.PAUSE = 0.1
def ir(x, y, d=0.8): pyautogui.moveTo(x, y, duration=d)
def clic(x, y, d=0.8, pausa=0.9): ir(x, y, d); time.sleep(0.25); pyautogui.click(); time.sleep(pausa)
def quieto(s): time.sleep(s)
def panel_arriba(): ir(220, 900, 0.4); pyautogui.scroll(900); time.sleep(0.8)

pyautogui.press("esc"); time.sleep(0.4)      # cancelar el rectángulo de selección que quedó a medias
panel_arriba(); ir(1500, 560, 0.4)
rec = subprocess.Popen([FF, "-y", "-v", "error", "-f", "gdigrab", "-framerate", "15", "-draw_mouse", "1", "-i", "desktop",
                        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "18", "-pix_fmt", "yuv420p", salida], stdin=subprocess.PIPE)
marcas = []; t0 = time.time()
def marca(txt): marcas.append((round(time.time() - t0, 2), txt)); print("%6.2f s  %s" % (time.time() - t0, txt), flush=True)
time.sleep(1.5)
marca("1 · el enlace: modelo, modal de 80 modos y su tabla"); quieto(5)
marca("2 · Case results: modo 2")
clic(412, 458); clic(282, 786, pausa=1.5); quieto(5)
marca("3 · Case results: Dead")
clic(412, 458); clic(214, 499, pausa=2.0); quieto(4)
marca("4 · casilla Animar con Dead")
ir(220, 900, 0.5); pyautogui.scroll(-600); time.sleep(1.0)
clic(202, 904, pausa=1.0); quieto(7)
clic(202, 904, pausa=1.0)
marca("5 · vuelta al modo 1")
panel_arriba()
clic(412, 458); clic(282, 750, pausa=1.5); quieto(4)
marca("fin")
rec.stdin.write(b"q"); rec.stdin.flush(); rec.wait(timeout=30)
open(salida + ".marcas.txt", "w", encoding="utf-8").write("\n".join("%.2f\t%s" % m for m in marcas) + "\n")
print("toma:", salida)
