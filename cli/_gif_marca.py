"""Arma un GIF de fotogramas PNG con la marca de agua «Hekatan Engineers» CENTRADA y grande (~40 % del ancho, ~22 %).
   python cli/_gif_marca.py DIR_FRAMES duraciones.json salida.gif   (también deja DIR_FRAMES/marca_NN.png para revisar)"""
import sys, json, glob, os
from PIL import Image, ImageDraw, ImageFont
d, durf, out = sys.argv[1], sys.argv[2], sys.argv[3]
dur = json.load(open(durf))
fs = sorted(glob.glob(os.path.join(d, "frame_*.png")))
def fuente(px):
    for f in ["C:/Windows/Fonts/georgiab.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f): return ImageFont.truetype(f, px)
    return ImageFont.load_default()
ims = []
for k, f in enumerate(fs):
    im = Image.open(f).convert("RGBA"); W, H = im.size
    capa = Image.new("RGBA", im.size, (0, 0, 0, 0)); dr = ImageDraw.Draw(capa)
    txt = "Hekatan Engineers"; px = 20
    while dr.textlength(txt, font=fuente(px)) < 0.42 * W: px += 2
    ft = fuente(px); w = dr.textlength(txt, font=ft)
    dr.text(((W - w) / 2, H / 2 - px / 2), txt, font=ft, fill=(255, 255, 255, 56))
    m = Image.alpha_composite(im, capa).convert("RGB")
    m.save(os.path.join(d, "marca_%02d.png" % k))
    ims.append(m.quantize(colors=255, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
ims[0].save(out, save_all=True, append_images=ims[1:], duration=dur[:len(ims)], loop=0, optimize=True)
print(out, len(ims), "fotogramas", os.path.getsize(out) // 1024, "KB")
