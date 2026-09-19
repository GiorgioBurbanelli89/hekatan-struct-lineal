# -*- coding: utf-8 -*-
"""GIF del Tutor FEM desde cli/shots/gif_tutor/: cursor virtual, rótulo y marca de agua «Hekatan Struct».
   python cli/_gif_tutor_montar.py  -> registros/zapata_levantamiento_png/tutor_fem.gif (+ hoja de contacto PNG)"""
import json, os
from PIL import Image, ImageDraw, ImageFont
D = "cli/shots/gif_tutor"; OUT = "registros/zapata_levantamiento_png"
fr = json.load(open(os.path.join(D, "fotogramas.json"), encoding="utf-8"))
W = 1280
def fuente(t):
    for f in ("C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"):
        if os.path.exists(f): return ImageFont.truetype(f, t)
    return ImageFont.load_default()
F, FM = fuente(24), fuente(18)
def cursor(dr, x, y):
    p = [(x, y), (x, y + 26), (x + 7, y + 20), (x + 12, y + 31), (x + 17, y + 29), (x + 12, y + 18), (x + 21, y + 18)]
    dr.polygon(p, fill="white", outline="black")
cuadros, dur = [], []
for q in fr:
    im = Image.open(q["f"]).convert("RGB")
    dr = ImageDraw.Draw(im, "RGBA")
    if q["cursor"]: cursor(dr, *q["cursor"])
    if q["nota"]:
        w = dr.textlength(q["nota"], font=F)
        dr.rounded_rectangle([800 - w / 2 - 16, 820, 800 + w / 2 + 16, 866], 10, fill=(20, 24, 32, 215))
        dr.text((800 - w / 2, 828), q["nota"], font=F, fill=(211, 165, 60))
    marca = "Hekatan Struct"
    dr.text((1600 - dr.textlength(marca, font=FM) - 18, 900 - 34), marca, font=FM, fill=(255, 255, 255, 110))
    im = im.resize((W, int(900 * W / 1600)), Image.LANCZOS)
    cuadros.append(im.convert("P", palette=Image.ADAPTIVE, colors=200)); dur.append(q["ms"])
g = os.path.join(OUT, "tutor_fem.gif")
cuadros[0].save(g, save_all=True, append_images=cuadros[1:], duration=dur, loop=0, optimize=True)
print(g, os.path.getsize(g) // 1024, "KB,", sum(dur) / 1000, "s")
# hoja de contacto para revisar los fotogramas
tw = 320; th = int(tw * 900 / 1600); hoja = Image.new("RGB", (4 * tw, ((len(cuadros) + 3) // 4) * th), "black")
for i, c in enumerate(cuadros): hoja.paste(c.convert("RGB").resize((tw, th)), ((i % 4) * tw, (i // 4) * th))
hoja.save(os.path.join(OUT, "tutor_fem_gif_hoja.png"))
