# -*- coding: utf-8 -*-
"""Fotogramas 1280×720 a partir de CAPTURAS REALES de otros programas (terminal de OpenSeesPy, SAP2000,
SAFE, ETABS): la captura tal cual, un recuadro nuestro que APARECE sobre el número del programa y, al
lado, el valor de Hekatan para compararlo. Más la tabla final. Deja pasos.json para montar_tutorial.py.

    python cli/video_capturas.py escenas.json frames_tut_capturas

escenas.json: [{"rotulo", "titulo", "png", "caja": [x0,y0,x1,y1] (en px de la captura), "nota", "n": 40}
               | {"rotulo", "tabla": true, "n": 60}]
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ESC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
for f in os.listdir(OUT):
    if f.endswith(".png"): os.remove(os.path.join(OUT, f))
BASE = os.path.dirname(os.path.abspath(ESC))
W, H, HI = 1280, 720, 610
AMA, ROJ, TX = (255, 212, 0), (255, 92, 92), (232, 232, 232)
def fnt(t, b=True):
    for f in (("C:/Windows/Fonts/segoeuib.ttf" if b else "C:/Windows/Fonts/segoeui.ttf"), "C:/Windows/Fonts/arial.ttf"):
        if os.path.exists(f): return ImageFont.truetype(f, t)
    return ImageFont.load_default()
k, pasos = 0, []


def guardar(im):
    global k
    im.save(os.path.join(OUT, "f%03d.png" % k)); k += 1


def escena(e):
    cap = Image.open(os.path.join(BASE, e["png"])).convert("RGB")
    top = 46
    s = min(W / cap.width, (HI - top) / cap.height)
    cw, ch = int(cap.width * s), int(cap.height * s)
    ox, oy = (W - cw) // 2, top + (HI - top - ch) // 2
    base = Image.new("RGB", (W, H), (21, 24, 30)); base.paste(Image.new("RGB", (W, H - HI), "black"), (0, HI))
    base.paste(cap.resize((cw, ch), Image.LANCZOS), (ox, oy))
    d = ImageDraw.Draw(base); d.text((W // 2, 24), e["titulo"], font=fnt(24), fill=(255, 179, 71), anchor="mm")
    x0, y0, x1, y1 = e["caja"]; bx = [ox + x0 * s, oy + y0 * s, ox + x1 * s, oy + y1 * s]
    n = e.get("n", 40)
    for i in range(n):
        im = base.copy(); dr = ImageDraw.Draw(im, "RGBA")
        f = min(1.0, (i + 1) / 6)
        cx, cy = (bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2
        hw, hh = (bx[2] - bx[0]) / 2 * f + 8, (bx[3] - bx[1]) / 2 * f + 8
        dr.rounded_rectangle([cx - hw, cy - hh, cx + hw, cy + hh], 8, outline=AMA, width=5)
        if f >= 1 and e.get("nota"):
            t = e["nota"]; ft = fnt(20); tw = dr.textlength(t, font=ft)
            ty = min(bx[3] + 46, HI - 40)
            tx = max(10, min(cx - tw / 2, W - tw - 20))
            dr.rounded_rectangle([tx - 12, ty - 6, tx + tw + 12, ty + 32], 8, fill=AMA + (235,))
            dr.text((tx, ty), t, font=ft, fill=(17, 17, 17))
        guardar(im)


def tabla(e):
    filas = [("SAP2000 24 (juez)", "81.914", "—"), ("Hekatan Struct", "81.915", "+0.0002 %"), ("SAFE 20", "81.915", "+0.0002 %"),
             ("ETABS 22", "81.915", "+0.0010 %"), ("OpenSeesPy", "81.915", "+0.0006 %"), ("Das: zapata rígida", "82.211", "+0.36 %"),
             ("Lineal (el suelo tira)", "76.670", "−6.4 %")]
    for i in range(e.get("n", 60)):
        im = Image.new("RGB", (W, H), (21, 24, 30)); im.paste(Image.new("RGB", (W, H - HI), "black"), (0, HI))
        d = ImageDraw.Draw(im)
        d.text((W // 2, 34), "Mismo modelo, misma malla (961 nudos): q_max en tonf/m²", font=fnt(26), fill=(255, 179, 71), anchor="mm")
        vis = min(len(filas), 1 + i // 5)
        y = 90
        for j, (a, b, c) in enumerate(filas[:vis]):
            col = ROJ if j == 6 else ((140, 150, 165) if j == 5 else TX)
            d.text((250, y), a, font=fnt(26, j < 5), fill=col); d.text((760, y), b, font=fnt(26), fill=col, anchor="ra")
            d.text((1010, y), c, font=fnt(24, False), fill=col, anchor="ra"); y += 62
        if vis == len(filas):
            d.text((W // 2, 560), "798 de 961 nudos apoyados en los cinco programas", font=fnt(22, False), fill=(92, 214, 92), anchor="mm")
        guardar(im)


for e in json.load(open(ESC, encoding="utf-8")):
    d0 = k
    (tabla if e.get("tabla") else escena)(e)
    pasos.append({"rotulo": e["rotulo"], "desde": d0, "hasta": k - 1})
json.dump({"pasos": pasos}, open(os.path.join(OUT, "pasos.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(k, "fotogramas,", len(pasos), "pasos")
