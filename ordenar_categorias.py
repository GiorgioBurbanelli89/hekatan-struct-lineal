# -*- coding: utf-8 -*-
u"""Reordena las CATEGORIAS de los ejemplos del workspace en un arbol de dos
niveles donde manda el TIPO DE ELEMENTO.

    1) Frames  2) Shells  3) Solidos  4) Mixtos      (+ Utilidades y Legacy)

y dentro de Frames por GRADOS DE LIBERTAD, que es como se estudia:
1 GDL axial -> 2 GDL flexion -> 3 GDL portico plano -> 6 GDL espacial -> n GDL.

Por que asi y no por familias (Benchmarks / Libros / Iconicos / Edificios):
esas familias respondian a DE DONDE sale el ejemplo, no a QUE es. El mismo
voladizo de acero estaba en tres cajones distintos segun quien lo hubiera
metido, y para encontrar "una placa" habia que mirar en cinco. Los benchmarks
no desaparecen: siguen marcados con el flag `benchmark` (el selector les pone
un 🏁 delante y tiene un filtro que los junta a todos), pero ya no son un
cajon separado del arbol.

El tipo de elemento NO se decidio a ojo: se construyo cada ExampleDef y se
contaron sus elementos por numero de nodos (2 = frame, 3-4 = shell, 8 = solido).
Los `standaloneUrl` del upstream no tienen `build()` y no se pueden medir: van
en el mapa de abajo escritos a mano, con el motivo al lado.

    python ordenar_categorias.py            # dice que haria
    python ordenar_categorias.py --aplicar  # lo escribe

Solo toca el texto de `category:`. NO toca ids, rutas ni calculos, asi que los
enlaces `/id/...` y las paginas standalone siguen valiendo igual.
"""
import io
import os
import re
import sys

RAIZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "examples", "src")

# ── FRAMES ─────────────────────────────────────────────────────────────────
F1 = u"1️⃣ Frames · \U0001f3af 1 GDL Axial"
F2 = u"1️⃣ Frames · \U0001f3af 2 GDL Flexión"
F3 = u"1️⃣ Frames · \U0001f3af 3 GDL Pórtico plano"
F6 = u"1️⃣ Frames · \U0001f3af 6 GDL Espacial"
FN = u"1️⃣ Frames · \U0001f3af n GDL Sistemas"
# ── SHELLS ─────────────────────────────────────────────────────────────────
S_PLACA = u"2️⃣ Shells · \U0001f9f1 Placas"
S_VALID = u"2️⃣ Shells · ✅ Validación CSI"
S_MEMBR = u"2️⃣ Shells · \U0001f578 Membranas"
S_CASCA = u"2️⃣ Shells · \U0001f41a Cáscaras"
S_LAYER = u"2️⃣ Shells · \U0001f95e Layered"
S_CIMEN = u"2️⃣ Shells · \U0001f9f0 Cimentaciones"
S_CONEX = u"2️⃣ Shells · \U0001f529 Conexiones"
# ── SOLIDOS ────────────────────────────────────────────────────────────────
SOL = u"3️⃣ Sólidos"
# ── MIXTOS (barras + cascaras) ─────────────────────────────────────────────
M_EDIF = u"4️⃣ Mixtos · \U0001f3e2 Edificios"
M_CIME = u"4️⃣ Mixtos · \U0001f9f0 Cimentaciones"
M_CONE = u"4️⃣ Mixtos · \U0001f529 Conexiones"
M_PUEN = u"4️⃣ Mixtos · \U0001f309 Puentes e icónicos"
M_SIST = u"4️⃣ Mixtos · \U0001f500 Losas con vigas"
# ── fuera del arbol de calculo ─────────────────────────────────────────────
UTIL = u"\U0001f9ea Utilidades"
LEGA = u"\U0001f5c4 Legacy"

MAPA = {
  # ── FRAMES · 1 GDL axial ────────────────────────────────────────────────
  "W1_barra_axial": F1, "axial-bar": F1, "barra-axial": F1,
  "W2_viga_axial_cantilever": F1, "W2_viga_axial_concrete_cantilever": F1,
  "W2_viga_axial_composite_cantilever": F1,
  "W2_viga_axial_composite_encased_cantilever": F1,
  "columna-cft": F1, "benchmark-cft-cantilever": F1,
  # ── FRAMES · 2 GDL flexion ──────────────────────────────────────────────
  "W2_viga_flexion_steel_cantilever": F2, "W2_viga_flexion_concrete_cantilever": F2,
  "W2_viga_flexion_composite_slab_cantilever": F2,
  "W2_viga_flexion_composite_encased_cantilever": F2,
  "benchmark-steel-beam": F2, "benchmark-steel-cantilever": F2,
  "benchmark-concrete-cantilever": F2, "cantilever-beam": F2,
  "releases-demo": F2, "viga-medio-elastico": F2, "1d-mesh": F2,
  # ── FRAMES · 3 GDL portico plano ────────────────────────────────────────
  "portico-2d": F3, "benchmark-paz-11-1": F3, "benchmark-paz-12-1": F3,
  "benchmark-paz-4-1": F3, "benchmark-paz-6-1": F3, "benchmark-paz-7-1": F3,
  "benchmark-paz-8-1": F3, "benchmark-paz-9-3": F3, "benchmark-paz-10-7": F3,
  "cortante-basal": F3, "espectro-nec": F3,
  # ── FRAMES · 6 GDL espacial ─────────────────────────────────────────────
  "tower-3d": F6, "truss": F6, "advanced-truss": F6, "truss-gen": F6,
  "3d-structure": F6, "benchmark-paz-13-1": F6,
  # ── FRAMES · n GDL sistemas ─────────────────────────────────────────────
  "beams": FN,                       # Paz 6.3 space frame (validacion modal)
  "galpon": FN, "galpon-bodega": FN, "cerramiento": FN,
  "edificio-aporticado": FN, "edificio-frame-nec": FN, "edificio-ladera": FN,
  "edificio-comparativa-fem": FN, "test-m-portico": FN, "edif-nec": FN,
  # ── SHELLS ──────────────────────────────────────────────────────────────
  "validacion-losas-csi": S_VALID,
  "plate-thin": S_PLACA, "plate-thick": S_PLACA, "plate-thick-validacion": S_PLACA,
  "triangular-plate": S_PLACA, "benchmark-safe-ex01-plate": S_PLACA,
  "plate": S_PLACA, "plate-q4": S_PLACA, "2d-mesh": S_PLACA,
  "placa-cantilever-q4": S_PLACA, "cantilever-beam-q4": S_PLACA,
  "plane": S_MEMBR, "membrana": S_MEMBR, "membrana-pstress": S_MEMBR,
  "shell-thick": S_MEMBR, "shear-wall-q4": S_MEMBR, "slope-stability": S_MEMBR,
  "shell-thin": S_CASCA, "viga-doble-t": S_CASCA, "sydney-opera": S_CASCA,
  "layered-shell": S_LAYER,
  "guerra-ej1-zapata-cuadrada": S_CIMEN,
  "guerra-ej2-zapata-rectangular-sismo": S_CIMEN,
  "guerra-ej3-zapata-rectangular-eccentricidad-grande": S_CIMEN,
  "guerra-ej4-zapata-combinada-rectangular": S_CIMEN,
  "guerra-ej5-zapata-combinada-trapezoidal": S_CIMEN,
  "guerra-ej7-viga-cimentacion-new": S_CIMEN, "guerra-ej8-losa-cimentacion": S_CIMEN,
  "viga-cim-guerra-ej7-tinv": S_CIMEN,
  "safe-bench-zapata-combinada": S_CIMEN, "safe-bench-zapata-conectada": S_CIMEN,
  "safe-bench-zapata-comparativa": S_CIMEN,
  "conexion-rbs": S_CONEX, "conexion-bfp": S_CONEX, "conexion-end-plate": S_CONEX,
  "placa-base": S_CONEX, "placa-base-h": S_CONEX, "placa-base-hueca": S_CONEX,
  "placa-base-cft": S_CONEX, "conexion-diafragma-cft": S_CONEX,
  # ── SOLIDOS (H8) ────────────────────────────────────────────────────────
  "solid-cube-fem": SOL, "columna-cft-h8": SOL, "bolt-hole-detail": SOL,
  "bulbo-presiones-suelo": SOL,
  # ── MIXTOS ──────────────────────────────────────────────────────────────
  "edificio-hormigon": M_EDIF, "edificio-acero-v2": M_EDIF, "edificio-mixto": M_EDIF,
  "edificio-muros": M_EDIF, "edificio-dual": M_EDIF, "edificio-con-losa": M_EDIF,
  "edificio-con-muros": M_EDIF, "edif-acero": M_EDIF, "mezanine": M_EDIF,
  "building": M_EDIF, "test-m-dual": M_EDIF, "test-m-losa": M_EDIF,
  "zapata-aislada": M_CIME, "zapata-viga-amarre": M_CIME,
  "zapata-aislada-validacion": M_CIME, "safe-bench-losa-cimentacion": M_CIME,
  "safe-bench-viga-cimentacion": M_CIME, "guerra-ej6-zapata-unida-viga-amarre": M_CIME,
  "viga-cim-guerra-ej7": M_CIME, "benchmark-safe-ex04-plate-beams": M_CIME,
  "zapata-viga-amarre-2": M_CIME,
  "tablero-puente": M_PUEN, "cable-stayed-bridge": M_PUEN, "gateway-arch": M_PUEN,
  "burj-khalifa": M_PUEN, "twisted-tower": M_PUEN, "diagrid": M_PUEN,
  "pergola": M_PUEN,
  "plate-with-beams": M_SIST, "slab-beams-columns": M_SIST, "membrana-csi": M_SIST,
  "mesa-torsion": M_SIST, "benchmark-3way": M_SIST, "benchmark-cft": M_SIST,
  "drilling-dof": M_SIST, "benchmark-paz-vs-hekatan": M_SIST,
  # ── fuera del arbol ─────────────────────────────────────────────────────
  "new-blank": UTIL, "csi-importer": UTIL, "cad-draw": UTIL, "cad-editor": UTIL,
  "calc-editor": UTIL, "slab-designer": UTIL, "cli-modeler": UTIL,
  "workspace": UTIL, "inicio": UTIL, "test": UTIL, "tutorials": UTIL,
  "color-map": LEGA, "curves": LEGA, "drawing": LEGA, "tables": LEGA,
  "fem-explained": LEGA, "report": LEGA,
}

RE_CAT = re.compile(u'(\\bcategory:\\s*)"([^"]*)"')
RE_ID = re.compile(u'(\\bid:\\s*)"([^"]*)"')
# Los ejemplos heredados del upstream no escriben `category:`: se registran con
# `legacy("id", "nombre", "categoria")` en legacyAwatif.ts. Si no se toca aqui,
# la mitad del arbol se queda con los nombres viejos y el desplegable sale con
# dos taxonomias mezcladas (comprobado abriendo el bundle: salian "Puentes",
# "Geotecnico", "Columnas FEM 3D"... al lado de las nuevas).
RE_LEGACY = re.compile(u'(legacy\\(\\s*"([^"]+)"\\s*,\\s*"(?:[^"\\\\]|\\\\.)*"\\s*,\\s*)"([^"]*)"')


# `shared/moreExamples.ts` define 14 ejemplos mas (eiffel, muro-q4, talud,
# viga-alta...) y NO lo importa nadie: no esta en el registry, asi que no sale
# en el workspace. Se salta para no recategorizar codigo muerto — y queda
# apuntado, porque o se conecta o se borra.
SALTAR = {"moreExamples.ts"}


def archivos():
    for carpeta, _dirs, ficheros in os.walk(RAIZ):
        for f in ficheros:
            if f in SALTAR:
                continue
            if f.endswith(".ts") or f.endswith(".mts"):
                yield os.path.join(carpeta, f)


def main():
    aplicar = "--aplicar" in sys.argv
    cambios, sin_mapa, tocados = [], [], 0

    for ruta in archivos():
        txt = io.open(ruta, encoding="utf-8").read()
        if "category:" not in txt:
            continue
        nuevo = txt
        # El id del ExampleDef manda; se busca el `id:` mas cercano ANTES de
        # cada `category:` para no confundirlo con las carpetas de parametros
        # de Tweakpane, que tambien usan la palabra `category`.
        for m in list(RE_CAT.finditer(txt)):
            trozo = txt[:m.start()]
            ids = RE_ID.findall(trozo)
            if not ids:
                continue
            eid = ids[-1][1]
            destino = MAPA.get(eid)
            if destino is None:
                if m.group(2) and not m.group(2).startswith((u"1️", u"2️",
                                                             u"3️", u"4️")):
                    sin_mapa.append((eid, m.group(2), os.path.basename(ruta)))
                continue
            if m.group(2) == destino:
                continue
            cambios.append((eid, m.group(2), destino))
            nuevo = nuevo.replace(u'%s"%s"' % (m.group(1), m.group(2)),
                                  u'%s"%s"' % (m.group(1), destino), 1)
        # ── los `legacy("id", "nombre", "categoria")` ──
        for m in list(RE_LEGACY.finditer(nuevo)):
            eid, viejo = m.group(2), m.group(3)
            destino = MAPA.get(eid)
            if destino is None:
                sin_mapa.append((eid, viejo, os.path.basename(ruta)))
                continue
            if viejo == destino:
                continue
            cambios.append((eid, viejo, destino))
            nuevo = nuevo.replace(m.group(0), u'%s"%s"' % (m.group(1), destino), 1)

        if nuevo != txt:
            tocados += 1
            if aplicar:
                io.open(ruta, "w", encoding="utf-8").write(nuevo)

    for eid, viejo, nuevo in sorted(cambios):
        print(u"  %-42s %-34s -> %s" % (eid, viejo[:34], nuevo))
    print(u"\n%d ejemplos recategorizados en %d ficheros" % (len(cambios), tocados))
    if sin_mapa:
        print(u"\nSIN MAPA (se quedan como estan) - %d:" % len(sin_mapa))
        for eid, cat, f in sorted(set(sin_mapa)):
            print(u"  %-40s %-30s %s" % (eid, cat[:30], f))
    if not aplicar:
        print(u"\n(modo seco: nada escrito. --aplicar para escribirlo)")


if __name__ == "__main__":
    main()
