# -*- coding: utf-8 -*-
"""Genera hekatan-ui/src/cad/hojasPlacaLisp.ts a partir de las hojas de Hekatan LISP
(hekatan-school/PLACAS_BATOZ/*.lisp): la tarjeta de K local de Struct enseña la MISMA formulación simbólica
y numérica que esas hojas (DKT, DKQ y triángulo grueso de CSI), con los datos del paño. 30-oct-2026.
Uso: python cli/gen_hojas_placa_lisp.py   (desde hekatan-struct/)"""
import re, os, json
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CARP = os.path.join(RAIZ, "hekatan-school", "PLACAS_BATOZ")
SALIDA = os.path.join(os.path.dirname(__file__), "..", "hekatan-ui", "src", "cad", "hojasPlacaLisp.ts")

def secciones(txt):
    L = txt.split("\n"); cab = []; sec = []; act = None
    for l in L:
        if l.startswith("## "):
            act = [l]; sec.append(act)
        elif act is None: cab.append(l)
        else: act.append(l)
    return cab, sec

def numero(titulo):
    m = re.match(r"## (\d+)", titulo); return int(m.group(1)) if m else None

def plantilla(arch, hasta, simb, datos):
    txt = open(os.path.join(CARP, arch), encoding="utf-8").read().replace("\r\n", "\n")
    cab, sec = secciones(txt)
    sec = [s for s in sec if numero(s[0]) is not None and numero(s[0]) < hasta]
    pendiente = dict(datos)   # nombre -> marca; solo la primera aparición
    def sub(lineas):
        out = []
        for l in lineas:
            m = re.match(r"^([A-Za-z]\w*) = [-0-9.eE+]+(\s*\[[^\]]*\])?(\s*'.*)?$", l)   # con unidades y texto: «Em = 24850000 [kN/m²] 'módulo…»
            if m and m.group(1) in pendiente:
                l = f"{m.group(1)} = %%{pendiente.pop(m.group(1))}%%" + (m.group(2) or "") + (m.group(3) or "")
            out.append(l)
        return out
    S = [sub(s) for s in sec]
    ss = "\n".join(cab + [""] + [l for s in S if numero(s[0]) in simb for l in s + [""]])
    nn = "\n".join(cab[:1] + ["#numerico"] + [""] + [l for s in S if numero(s[0]) not in simb for l in s + [""]])
    if pendiente: raise SystemExit(f"{arch}: sin sustituir {pendiente}")
    return ss.rstrip() + "\n", nn.rstrip() + "\n", cab

dk3 = {"Em": "E", "nu": "nu", "t": "t", "x1": "x1", "y1": "y1", "x2": "x2", "y2": "y2", "x3": "x3", "y3": "y3"}
dk4 = {"Em": "E", "nu": "nu", "t": "t", **{f"{c}{i}": f"{c.lower()}{i}" for i in range(1, 5) for c in "XY"}}
T = {
  "dkt": plantilla("placa_DKT.lisp", 6, {0, 1, 2}, dk3),
  "dkq": plantilla("placa_DKQ.lisp", 6, {0, 1, 3}, dk4),
  "thick-tri": plantilla("placa_thick_triangulo_csi.lisp", 7, {0, 1}, dk3),
}
js = lambda s: json.dumps(s, ensure_ascii=False)
o = ["// GENERADO por cli/gen_hojas_placa_lisp.py desde hekatan-school/PLACAS_BATOZ/*.lisp. No editar a mano.",
     "// Las marcas %%E%%, %%nu%%, %%t%%, %%x1%%… se sustituyen por los datos del paño (ejes del elemento).",
     "export type KindPlaca = \"dkt\" | \"dkq\" | \"thick-tri\";",
     "export const PLANTILLAS: Record<KindPlaca, { simbolica: string; numerica: string }> = {"]
for k, (a, b, _) in T.items():
    o.append(f"  {js(k)}: {{ simbolica: {js(a)}, numerica: {js(b)} }},")
o.append("};")
open(SALIDA, "w", encoding="utf-8").write("\n".join(o) + "\n")
print("escrito", SALIDA, {k: (len(v[0]), len(v[1])) for k, v in T.items()})
