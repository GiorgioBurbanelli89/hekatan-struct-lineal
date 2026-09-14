# -*- coding: utf-8 -*-
"""Fotogramas para la versión YOUTUBE (sin subtítulo quemado) a partir de los ya armados.

Los de `armar_frames_comprobacion.py` dejan abajo una franja negra para el inglés (120 px en las tomas
CSI y las tarjetas, ~230 en las del grabador de Hekatan). Sin subtítulo esa franja es un hueco negro.
Aquí, por PASO, se mide el recuadro con contenido (lo que no es negro puro, unión sobre varios
fotogramas del paso: un recuadro por fotograma haría saltar la imagen) y se amplía centrado a 1920×1080.

    python cli/rearmar_frames_youtube.py ENTRADA SALIDA
      ENTRADA  frames_montaje (con pasos.json)      SALIDA  frames_youtube
"""
import os, sys, json, shutil
from PIL import Image, ImageChops

ENT, SAL = sys.argv[1:3]
W, H = 1920, 1080
UMBRAL = 10                      # 0..255: por debajo es la franja / los márgenes negros
shutil.rmtree(SAL, ignore_errors=True); os.makedirs(SAL)
pasos = json.load(open(os.path.join(ENT, "pasos.json"), encoding="utf-8"))["pasos"]


def caja(im):
    g = im.convert("L").point(lambda v: 255 if v > UMBRAL else 0)
    return g.getbbox()


for p in pasos:
    idx = list(range(p["desde"], p["hasta"] + 1))
    muestra = idx[:: max(1, len(idx) // 8)] + [idx[-1]]
    x0 = y0 = 10 ** 9; x1 = y1 = 0
    for k in muestra:
        b = caja(Image.open(os.path.join(ENT, "f%03d.png" % k)))
        if b:
            x0, y0, x1, y1 = min(x0, b[0]), min(y0, b[1]), max(x1, b[2]), max(y1, b[3])
    if x1 <= x0:
        x0, y0, x1, y1 = 0, 0, W, H
    w, h = x1 - x0, y1 - y0
    s = min(W / w, H / h)
    nw, nh = round(w * s), round(h * s)
    for k in idx:
        im = Image.open(os.path.join(ENT, "f%03d.png" % k)).convert("RGB").crop((x0, y0, x1, y1))
        im = im.resize((nw, nh), Image.LANCZOS)
        lienzo = Image.new("RGB", (W, H), (0, 0, 0))
        lienzo.paste(im, ((W - nw) // 2, (H - nh) // 2))
        lienzo.save(os.path.join(SAL, "f%03d.png" % k))
    print("%-44s caja %4dx%-4d -> %4dx%-4d" % (p["rotulo"][:44], w, h, nw, nh))

shutil.copy(os.path.join(ENT, "pasos.json"), os.path.join(SAL, "pasos.json"))
print("->", SAL)
