# GIF de varias partes (fotogramas de puppeteer o de la pantalla + meta.json) con rótulo, cursor, marco y FLECHA a lo
# que se selecciona, tarjetas de texto entre partes y la marca «Hekatan Engineers».
#   python cli/_gif_unir.py salida.gif spec.json
# spec: {"ancho": 1090, "partes": [{"tarjeta": ["línea 1", "línea 2"], "ms": 3000} | {"dir": "...", "crop": [x0,y0,x1,y1], "esc": 1.0}]}
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
OUT, SPEC = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
F = lambda n, b=False: ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf" if b else "C:/Windows/Fonts/segoeui.ttf", n)
W = SPEC["ancho"]; BAR = 52; ROJO = (255, 70, 50)

def flecha(d, x1, y1, x2, y2):
    import math
    d.line([(x1, y1), (x2, y2)], fill=ROJO, width=5)
    a = math.atan2(y2 - y1, x2 - x1)
    for s in (2.6, -2.6): d.line([(x2, y2), (x2 - 22 * math.cos(a - s / 6), y2 - 22 * math.sin(a - s / 6))], fill=ROJO, width=5)

def parte(p):
    meta = json.load(open(f"{p['dir']}/meta.json", encoding="utf-8")); C = p["crop"]; e = p["esc"]
    out = []
    for i, m in enumerate(meta):
        im = Image.open(f"{p['dir']}/{m['f']}").convert("RGB"); d = ImageDraw.Draw(im)
        x, y = m["x"], m["y"]
        cj = m.get("caja")
        if cj:
            d.rounded_rectangle(cj, radius=6, outline=ROJO, width=4)
            fl = m.get("flecha") or ([cj[0] - 110, cj[1] - 70, cj[0] - 4, cj[1] + 6] if cj[0] - C[0] > 140 else [cj[2] + 110, cj[1] - 70, cj[2] + 4, cj[1] + 6])
            flecha(d, *fl)
        if m["clic"]: d.ellipse([x - 18, y - 18, x + 18, y + 18], outline=(255, 255, 255), width=4)
        d.polygon([(x, y), (x, y + 26), (x + 7, y + 20), (x + 12, y + 31), (x + 17, y + 29), (x + 12, y + 18), (x + 21, y + 18)], fill=(255, 255, 255), outline=(0, 0, 0))
        im = im.crop(m.get("crop") or C)
        hmax = p.get("hmax", 10 ** 6); k = min(W / im.width, hmax / im.height)
        im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
        out.append((im, m["rotulo"], 260 if m["clic"] else 80 if i and (meta[i - 1]["x"], meta[i - 1]["y"]) != (x, y) else 200))
    out[-1] = (out[-1][0], out[-1][1], 2200)
    return out

def tarjeta(t, h):
    im = Image.new("RGB", (W, h), (0, 0, 0)); d = ImageDraw.Draw(im)
    y = h // 2 - 40 * len(t["tarjeta"]) // 2
    for k, l in enumerate(t["tarjeta"]):
        f = F(44 if k == 0 else 28, k == 0); bb = d.textbbox((0, 0), l, font=f); d.text(((W - (bb[2] - bb[0])) / 2, y), l, font=f, fill=(255, 255, 255) if k == 0 else (190, 200, 220)); y += 70 if k == 0 else 44
    return [(im, "", t.get("ms", 3000))]

partes = [p for p in SPEC["partes"] if "dir" in p]
cuadros = {id(p): parte(p) for p in partes}
H = max(im.height for c in cuadros.values() for im, _, _ in c)
todo = []
for p in SPEC["partes"]: todo += cuadros[id(p)] if "dir" in p else tarjeta(p, H)
marca = Image.new("RGBA", (W, H + BAR), (0, 0, 0, 0)); dm = ImageDraw.Draw(marca)
t = "Hekatan Engineers"; f = F(72, True); bb = dm.textbbox((0, 0), t, font=f)
dm.text(((W - (bb[2] - bb[0])) / 2, BAR + (H - (bb[3] - bb[1])) / 2 - 20), t, font=f, fill=(255, 255, 255, 38))
frames, durs = [], []
for im, rot, ms in todo:
    lz = Image.new("RGBA", (W, H + BAR), (0, 0, 0, 255)); lz.paste(im, ((W - im.width) // 2, BAR + (H - im.height) // 2))
    ImageDraw.Draw(lz).text((14, 10), rot, font=F(23, True), fill=(255, 255, 255))
    frames.append(Image.alpha_composite(lz, marca).convert("RGB")); durs.append(ms)
pal = frames[len(frames) // 3].quantize(colors=255, method=Image.MEDIANCUT)
q = [fr.quantize(palette=pal, dither=Image.Dither.NONE) for fr in frames]
q[0].save(OUT, save_all=True, append_images=q[1:], duration=durs, loop=0, optimize=True)
idx = [int(k * (len(frames) - 1) / 8) for k in range(9)]
hj = Image.new("RGB", (W * 3 // 2, (H + BAR) * 3 // 2))
for k, i in enumerate(idx): hj.paste(frames[i].resize((W // 2, (H + BAR) // 2)), ((k % 3) * (W // 2), (k // 3) * ((H + BAR) // 2)))
hj.save(os.path.splitext(OUT)[0] + "_hoja.png")
print(OUT, W, H + BAR, len(frames), "%.2f MB" % (os.path.getsize(OUT) / 1e6), "%.1f s" % (sum(durs) / 1000))
