# -*- coding: utf-8 -*-
"""Compone, SOLO con trozos de la captura real, un cuadro legible a 1280 px: la vista 3D del programa
(con su barra de colores) a la izquierda y su barra de estado / tabla con el número, ampliada, a la derecha.
    python componer_csi.py captura.png salida.png vista=x0,y0,x1,y1 numero=x0,y0,x1,y1 [titulo=...]"""
import sys
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]
kw = dict(a.split("=", 1) for a in sys.argv[3:])
cap = Image.open(src).convert("RGB")
v = [int(x) for x in kw["vista"].split(",")]; n = [int(x) for x in kw["numero"].split(",")]
W, H = 1600, 900
c = Image.new("RGB", (W, H), (21, 24, 30))
vista = cap.crop(v); s = min(820 / vista.width, (H - 20) / vista.height)
vista = vista.resize((int(vista.width * s), int(vista.height * s)), Image.LANCZOS); c.paste(vista, (10, 10))
num = cap.crop(n); s2 = min((W - vista.width - 50) / num.width, 3.0)
num = num.resize((int(num.width * s2), int(num.height * s2)), Image.LANCZOS)
x2 = vista.width + 30; y2 = H // 2 - num.height // 2
c.paste(num, (x2, y2))
d = ImageDraw.Draw(c); d.text((x2, y2 - 40), kw.get("titulo", "barra de estado del programa (ampliada)"), fill=(200, 200, 200))
c.save(out)
print(out, "número en", [x2, y2, x2 + num.width, y2 + num.height])
