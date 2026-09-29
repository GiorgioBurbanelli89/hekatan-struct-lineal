"""
GIF del botón Compartir (29-sep-2026), con los fotogramas de gif_compartir_capturas.mjs. Mismo estilo que el de
novedades (rótulo ES/EN en franja negra, acercamiento con recuadro ámbar, marca «Hekatan Engineers» centrada),
más una escena con la barra de arriba en 4 anchos de pantalla para enseñar que el botón no choca con nada.
  python cli/gif_compartir_montar.py → cli/shots/gif_compartir/HEKATAN_STRUCT_COMPARTIR.gif
"""
import json, os, sys
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(__file__))
import gif_novedades_montar as G   # reutiliza marca(), rotulo(), escena() y las fuentes

D = os.path.join(os.path.dirname(__file__), "shots", "gif_compartir")
G.D = D
W, H, FAJA = G.W, G.H, G.FAJA
datos = json.load(open(os.path.join(D, "escenas.json"), encoding="utf-8"))


def barras():
    """La barra de arriba en 4 anchos, una debajo de otra, con el botón Compartir recuadrado."""
    im = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 40
    for w in (1920, 1280, 900, 800):
        b = Image.open(os.path.join(D, f"barra_{w}.png")).convert("RGB")
        esc = min(1, (W - 60) / b.width)
        b = b.resize((int(b.width * esc), int(b.height * esc * (1 if esc == 1 else 1))), Image.LANCZOS) if esc < 1 else b
        d.text((30, y), f"{w} px", font=G.f_en, fill=G.AMBAR)
        im.paste(b, (30, y + 30))
        y += 30 + b.height + 38
    im = G.marca(im)
    G.rotulo(im, "Sin choques con ningún botón, de 1920 a 800 px de ancho", "No overlap with any button, from 1920 to 800 px wide")
    return im.convert("RGB")


cuadros, tiempos = [], []
cuadros.append(G.negro([("Hekatan Struct", G.f_tit, (255, 255, 255)), ("Compartir un ejemplo", G.f_es, G.AMBAR)],
                       "Un clic y el enlace lleva el ejemplo con tus parámetros", "One click: the link carries the example with your parameters"))
tiempos.append(2400)
for e in datos["esc"]:
    cuadros.append(G.escena(e["f"], e["es"], e["en"], e["marco"])); tiempos.append(e["dur"])
cuadros.append(barras()); tiempos.append(3600)
url = datos["url"]
cuadros.append(G.negro([("Hekatan Struct", G.f_tit, (255, 255, 255)),
                        (url.replace("https://", "")[:70], G.f_en, (170, 180, 195)),
                        (url.replace("https://", "")[70:], G.f_en, (170, 180, 195))],
                       "El enlace que salió en este GIF, del sitio público", "The link produced in this GIF, from the public site"))
tiempos.append(3200)
os.makedirs(os.path.join(D, "fotogramas"), exist_ok=True)
for i, c in enumerate(cuadros):
    c.save(os.path.join(D, "fotogramas", f"f{i:02d}.png"))
tw, th = 640, 360
hoja = Image.new("RGB", (tw * 3, th * ((len(cuadros) + 2) // 3)), (40, 40, 40))
for i, c in enumerate(cuadros):
    hoja.paste(c.resize((tw, th), Image.LANCZOS), ((i % 3) * tw, (i // 3) * th))
hoja.save(os.path.join(D, "_hoja.png"))
pal = [c.convert("P", palette=Image.ADAPTIVE, colors=128) for c in cuadros]
out = os.path.join(D, "HEKATAN_STRUCT_COMPARTIR.gif")
pal[0].save(out, save_all=True, append_images=pal[1:], duration=tiempos, loop=0, optimize=True)
print(out, len(cuadros), "cuadros", round(os.path.getsize(out) / 2**20, 2), "MB")
