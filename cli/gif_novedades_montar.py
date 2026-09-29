"""
Monta el GIF de novedades de Hekatan Struct (29-sep-2026) con los fotogramas de gif_novedades_capturas.mjs.
Rótulo abajo en franja negra (ES grande, EN debajo), recuadro ámbar en lo nuevo, marca «Hekatan Engineers»
centrada y grande, portada y cierre en fondo negro, y una escena con el Fortran exportado y su salida.

  python cli/gif_novedades_montar.py   → cli/shots/gif_novedades/HEKATAN_STRUCT_NOVEDADES_29SEP.gif
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

D = os.path.join(os.path.dirname(__file__), "shots", "gif_novedades")
W, H = 1280, 720
FAJA = 92
F = lambda n, s: ImageFont.truetype(os.path.join(r"C:\Windows\Fonts", n), s)
f_es, f_en, f_tit, f_mono, f_marca = F("segoeuib.ttf", 30), F("segoeui.ttf", 21), F("segoeuib.ttf", 54), F("consola.ttf", 17), F("segoeuib.ttf", 92)
AMBAR = (245, 158, 11)


def marca(im):
    """«Hekatan Engineers» centrada, ~40 % del ancho, semitransparente."""
    capa = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    t = "Hekatan Engineers"
    x0, y0, x1, y1 = d.textbbox((0, 0), t, font=f_marca)
    d.text(((W - (x1 - x0)) / 2, (H - FAJA - (y1 - y0)) / 2 - y0), t, font=f_marca, fill=(255, 255, 255, 30))
    return Image.alpha_composite(im.convert("RGBA"), capa)


def rotulo(im, es, en):
    d = ImageDraw.Draw(im)
    d.rectangle([0, H - FAJA, W, H], fill=(0, 0, 0))
    d.text((W / 2, H - FAJA + 30), es, font=f_es, fill=(255, 255, 255), anchor="mm")
    d.text((W / 2, H - FAJA + 68), en, font=f_en, fill=(170, 180, 195), anchor="mm")


def escena(png, es, en, marco):
    """Acercamiento a lo nuevo (el marco) con contexto alrededor: a 1280 px la pantalla entera no se lee."""
    im = Image.open(os.path.join(D, png)).convert("RGB")
    asp = W / (H - FAJA)
    if marco:
        mx, my, mw, mh = marco
        rw = max(mw + 160, (mh + 120) * asp, 760)
        rw = min(rw, im.width)
        rh = rw / asp
        cx, cy = mx + mw / 2, my + mh / 2
        x0 = min(max(0, cx - rw / 2), im.width - rw)
        y0 = min(max(0, cy - rh / 2), im.height - rh)
    else:
        rw, rh, x0, y0 = im.width, im.width / asp, 0, 0
    esc = W / rw
    im = im.crop((int(x0), int(y0), int(x0 + rw), int(y0 + rh))).resize((W, H - FAJA), Image.LANCZOS)
    lienzo = Image.new("RGB", (W, H), (0, 0, 0))
    lienzo.paste(im, (0, 0))
    if marco:
        x, y, w, h = (marco[0] - x0) * esc, (marco[1] - y0) * esc, marco[2] * esc, marco[3] * esc
        dr = ImageDraw.Draw(lienzo)
        for g in range(4):
            dr.rectangle([x - 6 - g, y - 6 - g, x + w + 6 + g, min(H - FAJA - 2, y + h + 6 + g)], outline=AMBAR)
    lienzo = marca(lienzo)
    rotulo(lienzo, es, en)
    return lienzo.convert("RGB")


def negro(lineas, sub_es, sub_en):
    im = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 120
    for t, f, c in lineas:
        d.text((W / 2, y), t, font=f, fill=c, anchor="mm")
        y += 72
    im = marca(im)
    rotulo(im, sub_es, sub_en)
    return im.convert("RGB")


def fortran():
    """El programa exportado (el trozo que calcula FMax por Mohr) y lo que imprime gfortran."""
    code = open(os.path.join(D, "estribo_FMax.f90"), encoding="utf-8").read().split("\n")
    sal = open(os.path.join(D, "salida.txt"), encoding="utf-8").read().strip()
    i = next(n for n, l in enumerate(code) if "Principal mayor" in l)
    trozo = code[:6] + ["  ..."] + code[i:i + 7] + ["  ..."]
    im = Image.new("RGB", (W, H), (10, 12, 18))
    d = ImageDraw.Draw(im)
    d.text((40, 24), "estribo-puente_resultados.f90  (exportado del sitio público)", font=f_en, fill=AMBAR)
    y = 64
    for l in trozo:
        col = (110, 170, 110) if l.lstrip().startswith("!") else (220, 225, 235)
        d.text((40, y), l[:118], font=f_mono, fill=col)
        y += 23
    y += 14
    d.text((40, y), "> gfortran -O2 estribo_FMax.f90 -o resultados && resultados", font=f_mono, fill=AMBAR)
    d.text((40, y + 28), sal, font=f_mono, fill=(255, 255, 255))
    d.text((40, y + 62), "= el máximo de FMax que da Hekatan Struct en el mismo paño (271.9492 kN/m)", font=f_mono, fill=(34, 197, 94))
    im = marca(im)
    rotulo(im, "Compila con gfortran: FMax por Mohr, igual que en Struct", "Compiles with gfortran: FMax via Mohr, same as Struct")
    return im.convert("RGB")


if __name__ == "__main__":
    esc = json.load(open(os.path.join(D, "escenas.json"), encoding="utf-8"))
    cuadros, tiempos = [], []
    cuadros.append(negro([("Hekatan Struct", f_tit, (255, 255, 255)), ("novedades · 29-sep-2026", f_es, AMBAR)],
                         "GDL del modal · matriz local de placas y barras · Exportar a Fortran",
                         "Modal DOFs · shell & frame local stiffness · Fortran export")); tiempos.append(2400)
    vistos = set()
    for e in esc:
        if (e["f"], e["es"]) in vistos or any(x["es"] == e["es"] and x is not e and esc.index(x) < esc.index(e) for x in esc):
            continue                      # fotograma repetido de la misma escena
        vistos.add((e["f"], e["es"]))
        cuadros.append(escena(e["f"], e["es"], e["en"], e["marco"])); tiempos.append(e["dur"])
    cuadros.append(fortran()); tiempos.append(4200)
    cuadros.append(negro([("Hekatan Struct", f_tit, (255, 255, 255)),
                          ("giorgioburbanelli89.github.io/hekatan-struct-lineal", f_en, (170, 180, 195))],
                         "Ya disponible en el sitio público", "Available now on the public site")); tiempos.append(2600)

    os.makedirs(os.path.join(D, "fotogramas"), exist_ok=True)
    for i, c in enumerate(cuadros):
        c.save(os.path.join(D, "fotogramas", f"f{i:02d}.png"))
    # hoja de contacto para REVISAR (a mí no me sirve el GIF)
    tw, th = 640, 360
    hoja = Image.new("RGB", (tw * 3, th * ((len(cuadros) + 2) // 3)), (40, 40, 40))
    for i, c in enumerate(cuadros):
        hoja.paste(c.resize((tw, th), Image.LANCZOS), ((i % 3) * tw, (i // 3) * th))
    hoja.save(os.path.join(D, "_hoja.png"))
    pal = [c.convert("P", palette=Image.ADAPTIVE, colors=128) for c in cuadros]
    out = os.path.join(D, "HEKATAN_STRUCT_NOVEDADES_29SEP.gif")
    pal[0].save(out, save_all=True, append_images=pal[1:], duration=tiempos, loop=0, optimize=True)
    print(out, len(cuadros), "cuadros", round(os.path.getsize(out) / 2**20, 2), "MB")
