# Hoja de contacto 4x3 de los PNG de una carpeta (para MIRAR el barrido). Uso: python cli/_hoja_contacto.py carpeta
import sys, glob, os
from PIL import Image, ImageDraw
d = sys.argv[1]; fs = sorted(f for f in glob.glob(d + "/*.png") if not os.path.basename(f).startswith("_hoja"))
W, H, C, R = 440, 415, 4, 3
for h in range(0, len(fs), C * R):
    hoja = Image.new("RGB", (W * C, H * R), (20, 20, 20)); dr = ImageDraw.Draw(hoja)
    for k, f in enumerate(fs[h:h + C * R]):
        im = Image.open(f).convert("RGB"); im.thumbnail((W, H - 18))
        x, y = (k % C) * W, (k // C) * H; hoja.paste(im, (x, y + 18)); dr.text((x + 4, y + 3), os.path.basename(f)[:-4], fill=(255, 255, 0))
    hoja.save(f"{d}/_hoja_{h // (C * R):02d}.png"); print(f"{d}/_hoja_{h // (C * R):02d}.png")
