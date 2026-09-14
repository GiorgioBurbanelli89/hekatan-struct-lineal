# -*- coding: utf-8 -*-
"""Mando de la GUI de ETABS / SAP2000 con el MOUSE REAL, para grabar comprobaciones.

    python cli/csi_gui.py foto SALIDA.png
    python cli/csi_gui.py clic X Y [SALIDA.png]          (coordenadas FÍSICAS 2560×1600)
    python cli/csi_gui.py doble X Y [SALIDA.png]
    python cli/csi_gui.py teclas "texto" [SALIDA.png]
    python cli/csi_gui.py tecla enter|esc|tab… [SALIDA.png]
    python cli/csi_gui.py frente ETABS|SAP2000

El mouse se mueve DESPACIO hasta el sitio (se ve en la grabación) y la foto es del
escritorio entero con el cursor (ffmpeg gdigrab: captura también las vistas OpenGL,
que PrintWindow deja en blanco).
"""
import os, sys, time, subprocess, warnings
warnings.filterwarnings("ignore")
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"


def foto(salida):
    subprocess.run([FF, "-y", "-v", "error", "-f", "gdigrab", "-draw_mouse", "1", "-i", "desktop", "-frames:v", "1", salida], check=True)
    print("foto:", salida)


def main():
    a = sys.argv[1:]
    import pyautogui
    pyautogui.PAUSE = 0.15
    if a[0] == "foto":
        foto(a[1]); return
    if a[0] == "frente":
        import ctypes
        from pywinauto import Desktop
        w = [x for x in Desktop(backend="win32").windows() if x.window_text().startswith(a[1])]
        if not w: print("no hay ventana", a[1]); return
        h = w[0].handle
        ctypes.windll.user32.ShowWindow(h, 3); ctypes.windll.user32.SetForegroundWindow(h)
        time.sleep(1.2); print("al frente:", w[0].window_text()); return
    if a[0] in ("clic", "doble"):
        x, y = int(a[1]), int(a[2])
        pyautogui.moveTo(x, y, duration=0.7)
        time.sleep(0.25)
        (pyautogui.doubleClick if a[0] == "doble" else pyautogui.click)()
        salida = a[3] if len(a) > 3 else None
    elif a[0] == "teclas":
        pyautogui.write(a[1], interval=0.05); salida = a[2] if len(a) > 2 else None
    elif a[0] == "tecla":
        pyautogui.press(a[1]); salida = a[2] if len(a) > 2 else None
    else:
        print("orden desconocida", a[0]); return
    time.sleep(1.0)
    if salida:
        foto(salida)


if __name__ == "__main__":
    main()
