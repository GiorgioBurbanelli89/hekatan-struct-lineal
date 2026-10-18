# GIF del piloto de redibujo: python cli/gif_redibujo.py <carpeta_de_grabar_redibujo> <salida.gif> [ancho]
# Rótulo arriba (ejemplo + qué hace), marca de agua «Hekatan Engineers» centrada, fondo negro.
import json, sys, glob, os
from PIL import Image, ImageDraw, ImageFont
RAIZ, OUT = sys.argv[1], sys.argv[2]; ANCHO = int(sys.argv[3]) if len(sys.argv) > 3 else 960
F = lambda n, b=False: ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf" if b else "C:/Windows/Fonts/segoeui.ttf", n)
BAR = 46
cuadros, dur = [], []
for d in sorted(glob.glob(os.path.join(RAIZ, "*", "meta.json"))):
    m = json.load(open(d, encoding="utf-8")); base = os.path.dirname(d)
    fotos = m["fotos"]
    paso = max(1, len(fotos) // 160)            # como mucho ~160 cuadros por ejemplo
    for i, ft in enumerate(fotos):
        if i % paso and i != len(fotos) - 1 and not ft["texto"].startswith(("✓", "✗")): continue
        im = Image.open(os.path.join(base, f"f{ft['f']:04d}.png")).convert("RGB")
        if os.environ.get("CROP"):   # recorte x0,y0,x1,y1 en px del fotograma (para ver el modelo más grande)
            im = im.crop(tuple(int(v) for v in os.environ["CROP"].split(",")))
        h = round(im.height * ANCHO / im.width); im = im.resize((ANCHO, h), Image.LANCZOS)
        c = Image.new("RGB", (ANCHO, h + BAR), (0, 0, 0)); c.paste(im, (0, BAR))
        dr = ImageDraw.Draw(c)
        dr.text((12, 6), m["id"], font=F(20, True), fill=(125, 211, 252))
        col = (74, 222, 128) if ft["texto"].startswith("✓") else (248, 113, 113) if ft["texto"].startswith("✗") else (226, 232, 240)
        txt = ft["texto"].replace("✓", "OK —").replace("✗", "FALLA —")   # Segoe UI no trae ✓/✗
        dr.text((12 + dr.textlength(m["id"], font=F(20, True)) + 16, 9), txt, font=F(17), fill=col)
        # marca de agua centrada
        capa = Image.new("RGBA", c.size, (0, 0, 0, 0)); dc = ImageDraw.Draw(capa); t = "Hekatan Engineers"; f = F(int(ANCHO / 11), True)
        dc.text(((ANCHO - dc.textlength(t, font=f)) / 2, BAR + h / 2 - ANCHO / 20), t, font=f, fill=(255, 255, 255, 34))
        c = Image.alpha_composite(c.convert("RGBA"), capa).convert("RGB")
        cuadros.append(c.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
        dur.append(1400 if ft["texto"].startswith(("✓", "✗")) and i == len(fotos) - 1 else 110)
cuadros[0].save(OUT, save_all=True, append_images=cuadros[1:], duration=dur, loop=0)
print(OUT, len(cuadros), "cuadros", round(os.path.getsize(OUT) / 1e6, 1), "MB")
