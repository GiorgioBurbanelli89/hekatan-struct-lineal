# Compone un GIF de tutorial desde fotogramas de puppeteer + meta.json (cursor, clic, rótulo):
#   python cli/_gif_componer.py <dir> <salida.gif> [x0 y0 x1 y1] [escala]
# Rótulo arriba (fondo negro), cursor y círculo de clic dibujados, marca «Hekatan Engineers» centrada y translúcida.
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
S, OUT = sys.argv[1], sys.argv[2]
CROP = tuple(int(v) for v in sys.argv[3:7]) if len(sys.argv) >= 7 else (0, 30, 1600, 920)
ESC = float(sys.argv[7]) if len(sys.argv) >= 8 else 0.7
meta = json.load(open(f"{S}/meta.json", encoding="utf-8"))
F = lambda n, b=False: ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf" if b else "C:/Windows/Fonts/segoeui.ttf", n)
W, H = int((CROP[2]-CROP[0])*ESC), int((CROP[3]-CROP[1])*ESC); BAR = 48
marca = Image.new("RGBA", (W, H + BAR), (0, 0, 0, 0)); dm = ImageDraw.Draw(marca)
t = "Hekatan Engineers"; f = F(72, True); bb = dm.textbbox((0, 0), t, font=f)
dm.text(((W - (bb[2]-bb[0]))/2, BAR + (H - (bb[3]-bb[1]))/2 - 20), t, font=f, fill=(255, 255, 255, 40))
frames, durs = [], []
for i, m in enumerate(meta):
    im = Image.open(f"{S}/{m['f']}").convert("RGB"); d = ImageDraw.Draw(im)
    x, y = m["x"], m["y"]
    if m.get("caja"): d.rounded_rectangle(m["caja"], radius=4, outline=(255, 255, 255), width=2)
    if m["clic"]: d.ellipse([x-16, y-16, x+16, y+16], outline=(255, 255, 255), width=3)
    d.polygon([(x, y), (x, y+26), (x+7, y+20), (x+12, y+31), (x+17, y+29), (x+12, y+18), (x+21, y+18)], fill=(255, 255, 255), outline=(0, 0, 0))
    im = im.crop(CROP).resize((W, H), Image.LANCZOS)
    lienzo = Image.new("RGBA", (W, H + BAR), (0, 0, 0, 255)); lienzo.paste(im, (0, BAR))
    ImageDraw.Draw(lienzo).text((14, 9), m["rotulo"], font=F(23, True), fill=(255, 255, 255))
    frames.append(Image.alpha_composite(lienzo, marca).convert("RGB"))
    mov = i and (meta[i-1]["x"], meta[i-1]["y"]) != (x, y)
    durs.append(260 if m["clic"] else 80 if mov else 200)
durs[-1] = 2500
pal = frames[len(frames)//2].quantize(colors=255, method=Image.MEDIANCUT)
q = [fr.quantize(palette=pal, dither=Image.Dither.NONE) for fr in frames]
q[0].save(OUT, save_all=True, append_images=q[1:], duration=durs, loop=0, optimize=True)
# hoja de contacto para revisar (6 fotogramas)
idx = [int(k*(len(frames)-1)/5) for k in range(6)]
hj = Image.new("RGB", (W*3//2, (H+BAR)//2*2 if False else (H+BAR)))
mini = [frames[k].resize((W//2, (H+BAR)//2)) for k in idx]
for k, mm in enumerate(mini): hj.paste(mm, ((k % 3)*(W//2), (k//3)*((H+BAR)//2)))
hj.save(f"{S}/hoja.png")
print(OUT, W, H + BAR, len(frames), "%.2f MB" % (os.path.getsize(OUT)/1e6), "%.1f s" % (sum(durs)/1000))
