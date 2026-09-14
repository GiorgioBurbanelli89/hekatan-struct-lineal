# -*- coding: utf-8 -*-
"""Fotogramas de un vídeo de COMPROBACIÓN (Hekatan vs SAP2000 vs ETABS), para montar_tutorial.py.
Genérico: las tomas de Hekatan salen del grabador con cursor (frames_tut_*/pasos.json) y las de SAP2000 y
ETABS de sus .mkv con las marcas de tiempo (<toma>.mkv.marcas.txt, que escriben grabar_sap_toma.py y
grabar_etabs_toma.py). Cada toma CSI se parte en sus 3 tramos: deformada Dead · modo 1 · tabla.

    python cli/armar_frames_comprobacion.py CARPETA_EJEMPLO FRAMES_TUT TABLA.png QR.png
      CARPETA_EJEMPLO  con sap_toma.mkv(+.marcas.txt) y etabs_toma.mkv(+.marcas.txt); salida en frames_montaje/
      FRAMES_TUT       carpeta del grabador (frames_tut_comprob_<ejemplo>)
"""
import os, sys, json, shutil, subprocess, glob
from PIL import Image
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
CARP, TUT, TABLA, QR = sys.argv[1:5]
OUT = os.path.join(CARP, "frames_montaje"); shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
FPS = 10
W, H, HU = 1920, 1080, 960
CSI = (0, 0, 2560, 1530)          # ventana CSI maximizada, sin la barra de tareas
n = 0; pasos = []

def encaja(im):
    im = im.convert("RGB"); s = min(W / im.width, HU / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    lienzo = Image.new("RGB", (W, H), (0, 0, 0)); lienzo.paste(im, ((W - im.width) // 2, (HU - im.height) // 2)); return lienzo

def paso(rotulo, imgs):
    global n
    d = n
    for im in imgs: encaja(im).save(os.path.join(OUT, "f%03d.png" % n)); n += 1
    pasos.append({"rotulo": rotulo, "desde": d, "hasta": n - 1, "cuadros": n - d}); print("%-48s %4d cuadros" % (rotulo, n - d))

def de_video(mkv, t0, t1):
    tmp = os.path.join(CARP, "_tmp_ext"); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    x, y, w, h = CSI
    subprocess.run([FF, "-y", "-v", "error", "-ss", str(t0), "-to", str(t1), "-i", mkv, "-vf",
                    "fps=%d,crop=%d:%d:%d:%d" % (FPS, w, h, x, y), os.path.join(tmp, "e%04d.png")], check=True)
    ims = [Image.open(f).copy() for f in sorted(glob.glob(tmp + "/e*.png"))]; shutil.rmtree(tmp); return ims

def marcas(mkv):
    """[(t, texto)] de <mkv>.marcas.txt; los tramos van de la marca 2 a la 3, de la 3 a la 4 y de la 4 al fin."""
    filas = [l.rstrip("\n").split("\t", 1) for l in open(mkv + ".marcas.txt", encoding="utf-8") if "\t" in l]
    return [(float(t), s) for t, s in filas]

# 1-5 · Hekatan (grabador con cursor)
pt = json.load(open(os.path.join(TUT, "pasos.json"), encoding="utf-8"))
for p in (pt["pasos"] if isinstance(pt, dict) else pt):
    paso(p["rotulo"], [Image.open(os.path.join(TUT, "f%03d.png" % k)) for k in range(p["desde"], p["hasta"] + 1)])

# 6-11 · SAP2000 y ETABS (tomas reales)
for prog, mkv in (("SAP2000", os.path.join(CARP, "sap_toma.mkv")), ("ETABS", os.path.join(CARP, "etabs_toma.mkv"))):
    # Sin toma de ese programa (p. ej. la cúpula metálica, con ETABS aún abierto): se salta, no se inventa.
    if not os.path.exists(mkv):
        print("sin %s: %s no existe, se salta" % (prog, os.path.basename(mkv))); continue
    m = marcas(mkv)
    t = {s.split(" ")[0]: tt for tt, s in m}          # "2", "3", "4", "fin"
    paso("%s: deformada Dead Uz" % prog, de_video(mkv, t["2"], t["3"]))
    paso("%s: modo 1 y animación" % prog, de_video(mkv, t["3"], t["4"]))
    paso("%s: tabla de masa participativa" % prog, de_video(mkv, t["4"], t["fin"]))

paso("12 · Tabla de confiabilidad", [Image.open(TABLA)] * 40)
paso("13 · QR para el celular", [Image.open(QR)] * 40)
json.dump({"pasos": pasos}, open(os.path.join(OUT, "pasos.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("total", n, "cuadros ->", OUT)
