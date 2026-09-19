# -*- coding: utf-8 -*-
"""Corta los vídeos-tutorial ya montados en CLIPS CORTOS (uno por frase del .es.srt) para el
panel «🎬 Tutorial» de la app, y escribe examples/public/tutoriales/index.json.

    python cli/_tutoriales_cortar.py            # todos los grupos
    python cli/_tutoriales_cortar.py warren     # solo los que lleven «warren» en el id

Cada grupo: id, título, vídeo (+ .es.srt al lado; sin srt = un solo clip), títulos de los clips,
`modelo` (un .heks que se copia a public/tutoriales/ y se abre con workspace/?heks=…) y `hojas`
(hojas de Hekatan LISP web pública que explican el porqué).
"""
import json, os, re, shutil, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(AQUI)
ORIG = os.environ.get("HK_TUT_ORIGEN", os.path.join(os.path.dirname(REPO), "hekatan-struct"))   # donde están los mp4
RAIZ = os.path.dirname(ORIG)                                                                   # «Hekatan Calc 1.0.0»
OUT = os.path.join(REPO, "examples", "public", "tutoriales")

GRUPOS = [
    dict(id="warren", titulo="Cercha Warren, de principio a fin", sub="Todo con el mouse, desde la cinta",
         video=os.path.join(ORIG, "TUT_CERCHA_WARREN.mp4"),
         modelos_fijos=[("Abrir este modelo en Hekatan Struct", "warren.heks")],   # lo escribe cli/_tutoriales_warren_heks.py (13 nudos, 23 barras)
         clips=["Introducción", "La cinta y sus pestañas", "Frente, SNAP y acercar", "Cordón inferior (Polilínea)", "Cordón superior",
                "Diagonales en zigzag", "Apoyos: empotrado y articulado", "Cargas puntuales por nudo", "Carga distribuida (Carga q)",
                "Resultados: deformada y axil", "Momento y reacciones", "Diagrama en 2D", "Medir una distancia", "3D y Encuadrar",
                "Guardar como .heks"],
         hojas=[dict(titulo="De dónde sale la rigidez de una barra (EI y L)", ej="26 De donde sale la rigidez de barra (EI y L, deducida).lisp"),
                dict(titulo="El pórtico: de dónde sale la K (ensamblaje)", ej="24 El portico - de donde sale la K (ensamblaje).lisp"),
                dict(titulo="Deformada de una barra: funciones de Hermite", ej="15 Deformada de un frame - funciones de Hermite.lisp")]),
    dict(id="cupula", titulo="Cúpula y piel del Allianz Arena", sub="Superficies curvas: Revolución y Barrido en alzado",
         video=os.path.join(ORIG, "TUT_CUPULA_ALLIANZ.mp4"), modelo=os.path.join(ORIG, "cli", "shots", "cupula.heks"),
         modelos_extra=[("Abrir la piel del Allianz", os.path.join(ORIG, "cli", "shots", "allianz.heks"))],
         clips=["Introducción", "Pestaña Áreas: tramos y guía", "El meridiano: Arco por 3 puntos", "Seleccionar con ventana",
                "Revolución: 16 sectores", "Apoyos en la base", "La cúpula en 3D", "Allianz: la planta redondeada",
                "La panza: Parábola por 3 puntos", "Barrido", "Apoyos del Allianz", "La piel terminada"],
         hojas=[dict(titulo="El Jacobiano: del cuadrado natural al elemento real", ej="27 El Jacobiano - del cuadrado natural al elemento real.lisp")]),
    dict(id="capilla", titulo="Replicar una estructura real barra por barra", sub="La capilla del modelo de ETABS, por planos de trabajo",
         video=os.path.join(RAIZ, "TUT_CAPILLA_ANALITICA.mp4"),
         clips=["Introducción", "Preparar el lienzo", "Primer eje: plano de trabajo en el alzado", "Los otros ejes",
                "Planos laterales: vigas longitudinales", "Diagonales del entrepiso con OSNAP", "La capilla replicada en 3D"]),
    dict(id="ifc", titulo="Dibujar la estructura sobre un IFC", sub="El IFC de fondo, como un plano de referencia",
         video=os.path.join(RAIZ, "TUT_DIBUJAR_SOBRE_IFC.mp4"),
         clips=["Introducción", "Importar el IFC de referencia", "Corte en elevación", "Tramos del arco en Precisión",
                "Arco de la nave: 3 clics", "Arco del ala", "El entrepiso", "Resultado en isométrica"]),
    dict(id="visor", titulo="Visor de archivos IFC", sub="Ver, ocultar, medir y cortar el modelo",
         video=os.path.join(RAIZ, "TUT_VISOR_IFC.mp4"),
         clips=["El visor IFC", "Importar y Encuadrar", "Objetos: ocultar o aislar", "Panel corredizo", "Medir sobre el modelo",
                "Corte Z desde la cinta", "El edificio abierto"]),
    dict(id="novedades", titulo="Áreas, regla y paneles corredizos", sub="Lo básico del lienzo CAD",
         video=os.path.join(RAIZ, "TUT_NOVEDADES.mp4"),
         clips=["Áreas, regla y paneles", "Paneles corredizos", "Rectángulo: tres celdas", "Rellenar área con un clic",
                "Llenar todas", "Medir y acotar", "3D y Encuadrar", "Plegar la cinta", "Volver al menú"]),
]


def frases(srt):
    s = open(srt, encoding="utf-8").read()
    bl = re.findall(r"\d+\s*\n(\d\d):(\d\d):(\d\d),(\d+) --> (\d\d):(\d\d):(\d\d),(\d+)\s*\n(.+?)(?:\n\n|\Z)", s, re.S)
    t = lambda h, m, x, ms: int(h) * 3600 + int(m) * 60 + int(x) + int(ms) / 1000
    return [(t(*b[0:4]), t(*b[4:8]), b[8].replace("\n", " ").strip()) for b in bl]


def dur(v):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", v]).decode().strip())


# MARCA DE AGUA «Hekatan Struct» (Jorge, 19-sep-2026: todo vídeo, GIF y PNG que se publica la
# lleva). El rótulo oficial (branding/products/struct/hekatan_struct_lockup.png), semitransparente,
# abajo a la IZQUIERDA sobre la franja de subtítulos: ahí no tapa la cinta (arriba) ni el modelo
# (centro) ni el disco de Hekatan de la esquina derecha.
MARCA_PNG = os.path.join(RAIZ, "branding", "products", "struct", "hekatan_struct_lockup.png")
MARCA_ALFA, MARCA_ALTO = 0.6, 38


def marca_struct():
    from PIL import Image
    dst = os.path.join(OUT, "_marca_struct.png")
    im = Image.open(MARCA_PNG).convert("RGBA")
    im = im.resize((round(im.width * MARCA_ALTO / im.height), MARCA_ALTO), Image.LANCZOS)
    a = im.getchannel("A").point(lambda x: int(x * MARCA_ALFA))
    im.putalpha(a); im.save(dst)
    return dst


def cortar(v, a, b, out):
    m = marca_struct()
    filtro = "[0:v]scale=1280:-2[v];[v][1:v]overlay=14:main_h-overlay_h-12"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", v, "-i", m, "-filter_complex", filtro,
                    "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "64k",
                    "-movflags", "+faststart", out], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{(a + b) / 2:.3f}", "-i", v, "-i", m, "-frames:v", "1",
                    "-filter_complex", "[0:v]scale=1280:-2[v];[v][1:v]overlay=14:main_h-overlay_h-12,scale=320:-2", "-q:v", "6",
                    out.replace(".mp4", ".jpg")], check=True)


def copiar_heks(src, dst):
    """Copia el .heks corrigiendo la densidad de las barras dibujadas: el lienzo la llevaba en kN/m3 (24) y el
    .heks la quiere en t/m3 (2.45). Sin `selfweight` no cambia nada; con él pesaría diez veces."""
    t = open(src, encoding="utf-8").read()
    t = re.sub(r"(?m)^(frame .*) 24$", lambda m: m.group(1) + " 2.45", t)
    t = re.sub(r"(?m)^(frame .*) 78$", lambda m: m.group(1) + " 7.85", t)
    open(dst, "w", encoding="utf-8").write(t)


def main():
    filtro = sys.argv[1] if len(sys.argv) > 1 else ""
    os.makedirs(OUT, exist_ok=True)
    idx_path = os.path.join(OUT, "index.json")
    previo = {g.get("id"): g for g in json.load(open(idx_path, encoding="utf-8")).get("grupos", [])} if os.path.exists(idx_path) else {}
    salida = []
    for g in GRUPOS:
        if filtro and filtro not in g["id"]:
            if g["id"] in previo: salida.append(previo[g["id"]])
            continue
        v = g["video"]
        if not os.path.exists(v):
            print("  x falta", v); continue
        srt = v[:-4] + ".es.srt"
        fr = frases(srt) if os.path.exists(srt) else [(0.0, dur(v), "")]
        total = dur(v)
        items = []
        for i, (a, b, txt) in enumerate(fr):
            fin = fr[i + 1][0] if i + 1 < len(fr) else min(total, b + 1.5)
            nombre = f"{g['id']}_{i:02d}.mp4"
            cortar(v, a, fin, os.path.join(OUT, nombre))
            items.append(dict(titulo=g["clips"][i] if i < len(g["clips"]) else f"Paso {i}", video=nombre, poster=nombre.replace(".mp4", ".jpg"),
                              seg=round(fin - a), texto=txt))
        grupo = dict(id=g["id"], titulo=g["titulo"], sub=g.get("sub", ""), items=items)
        modelos = []
        if g.get("modelo") and os.path.exists(g["modelo"]):
            dst = g["id"] + ".heks"; copiar_heks(g["modelo"], os.path.join(OUT, dst)); modelos.append(dict(titulo="Abrir este modelo en Hekatan Struct", heks=dst))
        for tit, ruta in g.get("modelos_extra", []):
            if os.path.exists(ruta):
                dst = os.path.basename(ruta); copiar_heks(ruta, os.path.join(OUT, dst)); modelos.append(dict(titulo=tit, heks=dst))
        for tit, nombre in g.get("modelos_fijos", []):
            if os.path.exists(os.path.join(OUT, nombre)): modelos.insert(0, dict(titulo=tit, heks=nombre))
        if modelos: grupo["modelos"] = modelos
        if g.get("hojas"): grupo["hojas"] = g["hojas"]
        salida.append(grupo)
        mb = sum(os.path.getsize(os.path.join(OUT, it["video"])) for it in items) / 1e6
        print(f"  {g['id']}: {len(items)} clips, {mb:.1f} MB, modelos {len(modelos)}")
    json.dump(dict(grupos=salida), open(idx_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("index.json:", sum(len(g["items"]) for g in salida), "clips en", len(salida), "grupos")


if __name__ == "__main__":
    main()
