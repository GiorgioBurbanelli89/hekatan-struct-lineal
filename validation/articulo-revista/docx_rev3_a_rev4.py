# -*- coding: utf-8 -*-
"""rev3 -> rev4: Tablas 3 y 4 medidas contra SAP2000, y el texto que las acompana.

NO se reserializa el documento entero: ElementTree pierde las declaraciones de
namespace locales (wp14, a:) de las figuras y Word lo da por danado. Se localiza
el TROZO de texto de cada <w:p>/<w:tbl> de primer nivel y se sustituye solo ese.
"""
import copy, json, os, re, sys
sys.stdout.reconfigure(encoding="utf-8")
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
WNS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
ET.register_namespace("w", WNS)

UNP, CAMBIOS = sys.argv[1], sys.argv[2]
DOC = os.path.join(UNP, "word", "document.xml")
raw = open(DOC, encoding="utf-8").read()
# Todas las declaraciones de namespace del <w:document>, para envolver los trozos
# (un <w:p> lleva atributos w14:paraId, mc:Ignorable...).
_i = raw.index("<w:document")
DECLS = " ".join(re.findall(r'xmlns:[A-Za-z0-9_]+="[^"]+"', raw[_i:raw.index(">", _i)]))
for _p, _u in re.findall(r'xmlns:([A-Za-z0-9_]+)="([^"]+)"', DECLS): ET.register_namespace(_p, _u)

# ── 1) trocear el <w:body> en sus hijos de primer nivel, con sus posiciones ──
ini = raw.index("<w:body>") + len("<w:body>")
fin = raw.index("</w:body>")
cuerpo = raw[ini:fin]

TAG = re.compile(r"<(/?)(w:p|w:tbl)(\s[^>]*?)?(/?)>")
trozos, pila = [], None
prof = 0
for m in TAG.finditer(cuerpo):
    cierra, tag, _, vacio = m.group(1), m.group(2), m.group(3), m.group(4)
    if vacio:                       # <w:p/> suelto
        if prof == 0: trozos.append((tag, m.start(), m.end()))
        continue
    if not cierra:
        if prof == 0: pila = (tag, m.start())
        prof += 1
    else:
        prof -= 1
        if prof == 0: trozos.append((pila[0], pila[1], m.end()))
assert prof == 0, "etiquetas descuadradas"
print("hijos del body: %d" % len(trozos))

# ── 2) helpers de edicion sobre un elemento ya parseado ─────────────────────
def set_cell(tc, texto):
    ps = tc.findall(W + "p"); p = ps[0]
    for extra in ps[1:]: tc.remove(extra)
    runs = p.findall(W + "r")
    if not runs:
        r = ET.SubElement(p, W + "r"); ET.SubElement(r, W + "t"); runs = [r]
    for extra in runs[1:]: p.remove(extra)
    r = runs[0]
    ts = r.findall(W + "t")
    if not ts: ts = [ET.SubElement(r, W + "t")]
    for extra in ts[1:]: r.remove(extra)
    ts[0].text = texto
    ts[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")

def set_par(p, texto):
    runs = p.findall(W + "r")
    if not runs:
        r = ET.SubElement(p, W + "r"); ET.SubElement(r, W + "t"); runs = [r]
    for extra in runs[1:]: p.remove(extra)
    r = runs[0]
    ts = r.findall(W + "t")
    if not ts: ts = [ET.SubElement(r, W + "t")]
    for extra in ts[1:]: r.remove(extra)
    ts[0].text = texto
    ts[0].set("{http://www.w3.org/XML/1998/namespace}space", "preserve")

def set_tabla(tbl, filas):
    trs = tbl.findall(W + "tr")
    while len(trs) < len(filas):
        nuevo = copy.deepcopy(trs[-1])
        tbl.insert(list(tbl).index(trs[-1]) + 1, nuevo)
        trs = tbl.findall(W + "tr")
    for extra in trs[len(filas):]: tbl.remove(extra)
    for tr, fila in zip(tbl.findall(W + "tr"), filas):
        tcs = tr.findall(W + "tc")
        assert len(tcs) == len(fila), "columnas %d != %d" % (len(tcs), len(fila))
        for tc, txt in zip(tcs, fila): set_cell(tc, txt)

def serializar(el):
    s = ET.tostring(el, encoding="unicode")
    # tostring repite la declaracion de w en el elemento: valida, pero se quita
    # para que el fichero quede igual de limpio que el original.
    for _d in DECLS.split(" "): s = s.replace(" " + _d, "", 1)
    return s

# ── 3) aplicar los cambios, de atras hacia delante para no mover indices ────
C = json.load(open(CAMBIOS, encoding="utf-8"))
tareas = ([(int(k), "tbl", v) for k, v in C["tablas"].items()] +
          [(int(k), "p", v) for k, v in C["parrafos"].items()])
for idx, tipo, dato in sorted(tareas, reverse=True):
    tag, a, b = trozos[idx]
    esperado = "w:tbl" if tipo == "tbl" else "w:p"
    assert tag == esperado, "el hijo %d es %s, no %s" % (idx, tag, esperado)
    el = ET.fromstring("<raiz %s>%s</raiz>" % (DECLS, cuerpo[a:b]))[0]
    if tipo == "tbl":
        set_tabla(el, dato); print("tabla %d -> %d filas" % (idx, len(dato)))
    else:
        set_par(el, dato);  print("parrafo %d -> %d car." % (idx, len(dato)))
    cuerpo = cuerpo[:a] + serializar(el) + cuerpo[b:]

open(DOC, "w", encoding="utf-8", newline="").write(raw[:ini] + cuerpo + raw[fin:])
print("ok ->", DOC)
