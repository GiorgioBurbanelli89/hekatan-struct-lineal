# -*- coding: utf-8 -*-
"""Pone cada PNG de una carpeta sobre 1280x720 negro (arriba), dejando la franja de subtitulo abajo."""
import os, sys
from PIL import Image
d = sys.argv[1]
for f in os.listdir(d):
    if f.endswith(".png"):
        im = Image.open(os.path.join(d, f)).convert("RGB")
        if im.size == (1280, 720): continue
        c = Image.new("RGB", (1280, 720), "black"); c.paste(im, (0, 0)); c.save(os.path.join(d, f))
