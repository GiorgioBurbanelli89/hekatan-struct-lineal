# -*- coding: utf-8 -*-
"""Prototipo de la REGLA de mallado de losas de ETABS 22, medida (no leída de un manual):
  1. Losa horizontal de cáscara (no membrana/deck) → se corta en las líneas de VIGAS y MUROS del
     mismo piso que la atraviesan y, si el AREAASSIGN dice MESHAT "GRIDS", en los EJES.
  2. Cada trozo se divide en n = ceil(largo / tam) partes iguales por dirección, con
     tam = MAXMESHSIZE del AREAASSIGN (OBJMESHTYPE "AUTOMESH") o FLOORMESHMAXSIZE si "DEFAULT".
  3. Muros rectos sin abertura y losas inclinadas: NO se mallan (1 elemento).
Compara con lo que ETABS generó objeto a objeto (malla_etabs_objetos.json, de _malla_objetos.py).
    python regla_malla.py modelo.e2k malla_etabs_objetos.json
"""
import json, math, re, sys

txt = open(sys.argv[1], encoding="latin-1").read()
etabs = json.load(open(sys.argv[2], encoding="latin-1"))
lin = txt.splitlines()
num = lambda s: float(s)
pts = {m.group(1): (num(m.group(2)), num(m.group(3))) for m in re.finditer(r'POINT\s+"([^"]+)"\s+([-\d.eE+]+)\s+([-\d.eE+]+)', txt)}
stories, elev = [], {}
for m in re.finditer(r'STORY\s+"([^"]+)"\s+(HEIGHT|ELEV)\s+([-\d.eE+]+)', txt): stories.append((m.group(1), m.group(2), num(m.group(3))))
z = 0.0
for nm, k, v in reversed(stories):
    z = v if k == "ELEV" else z + v; elev[nm] = z
grids = {"X": [], "Y": []}
for m in re.finditer(r'GRID\s+"[^"]+"\s+LABEL\s+"[^"]+"\s+DIR\s+"([XY])"\s+COORD\s+([-\d.eE+]+)', txt): grids[m.group(1)].append(num(m.group(2)))
fm = re.search(r'FLOORMESHMAXSIZE\s+([\d.eE+-]+)', txt); FLOOR = num(fm.group(1)) if fm else 1.25
lines = {m.group(1): (m.group(2), m.group(3), m.group(4)) for m in re.finditer(r'LINE\s+"([^"]+)"\s+(BEAM|COLUMN|BRACE)\s+"([^"]+)"\s+"([^"]+)"', txt)}
linasig = {}
for m in re.finditer(r'LINEASSIGN\s+"([^"]+)"\s+"([^"]+)"', txt): linasig.setdefault(m.group(1), []).append(m.group(2))
areas = {}
for m in re.finditer(r'AREA\s+"([^"]+)"\s+(FLOOR|PANEL|AREA)\s+(\d+)\s+((?:"[^"]+"\s+)+)', txt):
    areas[m.group(1)] = (m.group(2), re.findall(r'"([^"]+)"', m.group(4)))
props = {m.group(1): m.group(0) for m in re.finditer(r'SHELLPROP\s+"([^"]+)".*', txt)}
asig = [(m.group(1), m.group(2), m.group(3), m.group(0)) for m in re.finditer(r'AREAASSIGN\s+"([^"]+)"\s+"([^"]+)"\s+SECTION\s+"([^"]+)".*', txt)]

def cortes(story, x0, x1, eje, fijo0, fijo1, conGrids):
    """Coordenadas interiores (x0, x1) donde una viga/muro de ese piso corta la losa (línea a lo largo del otro eje)."""
    c = set()
    for nm, (tipo, a, b) in lines.items():
        if tipo != "BEAM" or story not in linasig.get(nm, []): continue
        pa, pb = pts[a], pts[b]
        k, o = (0, 1) if eje == "X" else (1, 0)
        if abs(pa[k] - pb[k]) < 1e-6 and x0 + 1e-6 < pa[k] < x1 - 1e-6:                # viga ⟂ al eje, dentro
            lo, hi = sorted((pa[o], pb[o]))
            if lo < fijo1 - 1e-6 and hi > fijo0 + 1e-6: c.add(round(pa[k], 6))
    for nm, (tipo, p) in areas.items():                                                    # muros (PANEL) del piso
        if tipo != "PANEL": continue
        if not any(s == nm and st == story for s, st, *_ in asig): continue
        pa, pb = pts[p[0]], pts[p[1]]
        k, o = (0, 1) if eje == "X" else (1, 0)
        if abs(pa[k] - pb[k]) < 1e-6 and x0 + 1e-6 < pa[k] < x1 - 1e-6: c.add(round(pa[k], 6))
    if conGrids:
        for g in grids[eje]:
            if x0 + 1e-6 < g < x1 - 1e-6: c.add(round(g, 6))
    return sorted(c)

def divs(a, b, cs, tam):
    """n.º de divisiones: cada trozo entre cortes, ceil(largo/tam)."""
    xs = [a] + cs + [b]
    return sum(max(1, math.ceil((xs[i + 1] - xs[i]) / tam - 1e-9)) for i in range(len(xs) - 1))

pred, ok, mal = {}, 0, []
etabsPorProp = {}
for r in etabs: etabsPorProp.setdefault((r["prop"].encode("latin-1", "replace"), round(sum(r["lados"]), 2)), []).append(r["nElm"])
res = []
for nm, story, sec, linea in asig:
    if nm not in areas or "OPENING" in linea: continue
    tipo, p = areas[nm]
    prop = props.get(sec, "")
    if tipo != "FLOOR" or len(p) != 4 or re.search(r'MODELINGTYPE\s+"Membrane"|PROPTYPE\s+"Deck"', prop):
        n = 1 if tipo != "FLOOR" or len(p) == 4 else None
    else:
        P = [pts[q] for q in p]
        xs, ys = [q[0] for q in P], [q[1] for q in P]
        x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
        auto = 'OBJMESHTYPE "AUTOMESH"' in linea
        mm = re.search(r'MAXMESHSIZE\s+([\d.eE+-]+)', linea); tam = num(mm.group(1)) if (auto and mm) else FLOOR
        g = auto and 'MESHAT "GRIDS"' in linea
        nx = divs(x0, x1, cortes(story, x0, x1, "X", y0, y1, g), tam)
        ny = divs(y0, y1, cortes(story, y0, y1, "Y", x0, x1, g), tam)
        n = nx * ny
    res.append((nm, story, sec, n))
# comparar con ETABS por el ORDEN de los objetos de área (ETABS los numera en el orden del fichero)
etabsN = [r["nElm"] for r in etabs]
lineasFloor = [r for r in res]
print("objetos", len(res), "ETABS", len(etabsN))
tot = 0
for (nm, story, sec, n), r in zip(res, etabs):
    marca = "ok " if n == r["nElm"] else ("?? " if n is None else "XX ")
    if n == r["nElm"]: ok += 1
    tot += n or 0
    print(marca, nm.ljust(5), story.ljust(8), sec[:14].ljust(14), "regla", n, "ETABS", r["nElm"], r["lados"])
print(f"aciertos {ok}/{len(res)} · elementos regla {tot} vs ETABS {sum(etabsN)}")
