# Cómo se hace un vídeo-tutorial de Hekatan Struct (para seguir en otro sitio)

Estado al 13-sep-2026 · Tutorial 9 (cercha Warren) enviado v5 · Howe y Pratt pendientes.

## 0. Lo que salió mal en el Warren y hay que corregir ANTES de grabar Howe/Pratt

| qué | por qué | arreglo |
|---|---|---|
| El paso «Resultados» solo enseña el **colormap** sobre las barras | En *Frame results* la opción «Axial Force (diagram)» **no es un diagrama**: es `contour:normals`, la barra pintada por color (`getSettings.ts:393`). | El diagrama de verdad (como ETABS, con valores en los extremos) es el botón **«📐 Ver diagrama en 2D (alzado / planta)»** del mismo folder *Analyze* → `window.__hekatanDiagrama2D({plano:"XZ", en:0})`, ventana `#hk-diagrama-2d`. Verificado hoy: `cli/_diagrama2d_check.mjs` → `cli/shots/_diagrama2d.png` (axil −40.49 kN en el cordón, con cifras) y `_diagrama2d_m3.png` (M3-3). Hay flechas ◀ ▶ para pasar de pórtico y «Gráfico de la barra designada» (📈) para una barra. |
| Deformada poco visible | `deformScale` automático pequeño en una cercha rígida | En el paso 7 subir *Deformed scale* con `a.ajuste("deformScale", 200)` o marcar el slider con el cursor. |
| 4 grabaciones para un vídeo (≈ 3 h) | Cada toma son **28–32 min** (el grabador mueve el cursor de verdad, ~1 fps) y solo se ve el fallo al revisar los fotogramas: (1) botón «✏ Dibujar» buscado por texto → pillaba la carpeta del panel; (2) «Guardar .heks» escribía 0 KB (guardaba el cuadro CLI vacío); (3) un clic «en vacío» abría una ventana de selección; (4) faltaba «Guardar como…». | **Probar cada paso nuevo con una sonda de 30 s** (`cli/_fold_check.mjs`, `_heks_guardar_check.mjs`, `_guardarcomo_check.mjs`) contra el dev server ANTES de lanzar la grabación de 30 min. Es la regla que no cumplí. |

## 1. Piezas

```
hekatan-struct/
  cli/tutorial_struct.mjs            el GRABADOR (puppeteer): abre la app, ejecuta el capítulo, saca PNG
  cli/tutoriales/<cap>.mjs           el CAPÍTULO: lista de pasos {rotulo, hacer(a)}  (cap19_cercha_warren.mjs …)
  cli/tutoriales/_cercha_comun.mjs   pasos comunes de las 3 cerchas: crear("warren"|"howe"|"pratt")
  cli/guiones/<cap>_es.txt           VOZ (una frase por paso, español)  → misma cantidad de líneas que pasos
  cli/guiones/<cap>_en.txt           SUBTÍTULO inglés (una línea por frase)
  frames_tut_<cap>/                  f000.png … (1920×1080) + pasos.json (rangos de fotogramas por paso)
  website/src/examples/              el bundle que SIRVE el grabador (puerto 4780): hay que hacer build antes
../hekatan-school/montar_tutorial.py el MONTAJE: frames + voz (edge-tts) + subtítulos → mp4
```

## 2. Flujo, en orden

```bash
cd "hekatan-struct"
npm run dev:examples                       # dev server :4600 (para las sondas rápidas)

# 1) sonda de 30 s de cada paso nuevo contra :4600 (¡antes de grabar!)
node cli/_fold_check.mjs                   # ejemplo: plegar/abrir cinta, ▾, Guardar .heks
node cli/_guardarcomo_check.mjs            # ejemplo: Guardar como… con prompt

# 2) build: el grabador sirve website/src/examples (no el dev server)
MSYS_NO_PATHCONV=1 npm run build:deploy    # ~1 min

# 3) grabar (28–32 min; límite por tarea 60 min → UNA grabación por comando)
node cli/tutorial_struct.mjs cap19_cercha_warren > cli/shots/_rec_cap19.log 2>&1
#    el log lista «inicio-fin  N · rótulo» por paso y «x no se ve: …» si un control no apareció

# 4) REVISAR FOTOGRAMAS (obligatorio): hoja de contacto por paso y mirarla
python - <<'EOF'
from PIL import Image, ImageDraw; import os, re
d="frames_tut_cap19_cercha_warren"; fs=sorted([f for f in os.listdir(d) if f.endswith(".png")], key=lambda f:int(re.sub(r"\D","",f)))
idx=list(range(1326,1489,11)); w=480; ims=[(i,Image.open(f"{d}/{fs[i]}").resize((w,270))) for i in idx]
s=Image.new("RGB",(4*w,((len(ims)+3)//4)*284),"black"); dr=ImageDraw.Draw(s)
for k,(i,im) in enumerate(ims): x=(k%4)*w; y=(k//4)*284; s.paste(im,(x,y+14)); dr.text((x+4,y),str(i),fill="yellow")
s.save("cli/shots/_hoja.png")
EOF
#    ⚠️ ordenar por NÚMERO: sorted() a secas pone f1000 antes que f200 y se revisa el paso equivocado

# 5) montar (voz ES + subtítulo EN), ~3 min
HK_FPS_MAX=30 python ../hekatan-school/montar_tutorial.py frames_tut_cap19_cercha_warren \
    cli/guiones/cap19_es.txt TUT_CERCHA_WARREN.mp4 cli/guiones/cap19_en.txt
#    → TUT_CERCHA_WARREN.mp4 (+ .es.srt, .en.srt). Sacar 2-3 fotogramas con ffmpeg y mirarlos.

# 6) deploy público + main (siempre que cambie código de la app)
npx gh-pages --dist website/src/examples --repo https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git --branch gh-pages --dotfiles
git push hekatan-struct main
curl -s https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/ | grep -o 'assets/workspace-[A-Za-z0-9_-]*\.js'   # = el chunk local
```

## 3. API del grabador dentro de un paso (`hacer: async (a) => { … }`)

| llamada | qué hace |
|---|---|
| `a.portada(titulo, sub, seg)` | portada |
| `a.quieto(n, ms)` | n fotogramas quietos |
| `a.pulsar(texto)` | clic en un botón del panel Tweakpane por su texto |
| `a.abrir("Analyze")` | abre un folder del panel |
| `a.marcar("fila", "Deformed shape", nota)` | marca una casilla (cursor + nota) |
| `a.elegir("Frame results", "Axial Force")` | abre la lista desplegable y baja con el cursor hasta la opción |
| `a.ajuste(clave, valor)` | cambia un ajuste sin cursor (último recurso) |
| `a.archivo(nota, {lineas, marcas})` | enseña la última DESCARGA capturada (el `<a download>` se intercepta) |
| `a.sinArchivo()` | quita esa ventana |
| `a.responder("nombre")` | contesta el próximo `prompt()` (Guardar como…) |
| `a.dialogo()` | dibuja un `alert()` capturado |
| `a.pag` | la página de puppeteer (teclado, ratón) |

Ayudantes de `_cercha_comun.mjs`: `cinta(a, "Polilínea", nota)` (botón de la cinta por regex), `clicMundo(a, [x,y,z], nota)` (clic en coordenadas del modelo: se proyectan por la cámara), `rect(a, fn)` (rectángulo de un elemento del DOM → `{x,y,rx,ry,rw,rh}`), `caja(a, rect, nota, seg)` (recuadro + nota), `clicRojo`, `mover`, `panel(a,"izq",true)` (abre/cierra el panel lateral), `vista(a, pos, target)`, `orbita`.

Reglas del grabador: se graban **640 de los 720 px** de alto (la barra de estado de abajo queda FUERA: por eso SNAP/ORTO/OSNAP están también en la cinta); DPR 2 → 1920×1080; `showSaveFilePicker` anulado (camino `prompt`); los diálogos se aceptan solos; los botones **se buscan por id** (`#hk-ribbon-abrir`, `#hk-ribbon-plegar`, `#hk-ribbon-mas`, `#hk-cad-tit button[title="Guardar como"]`), nunca por texto que pueda repetirse en el panel.

## 4. Pasos del Tutorial 9 (los mismos para Howe y Pratt, con `crear(tipo)`)

Portada · 1 cinta (dos filas) + Frente XZ + SNAP · 2 cordón inferior (Polilínea, −6…6 cada 2 m, Enter) · 3 cordón superior · 4 diagonales (Warren: zigzag en una polilínea; Howe/Pratt: verticales + diagonales con Línea+Esc) · 5 Apoyos (empotrado por defecto; Selec. en el nudo → Restraints; Articular) · 6 Cargas −10 kN por nudo (= 5 kN/m × 2 m tributarios) · 6b Carga q −5 kN/m · 7 Resultados con la cinta plegada (**cambiar a: Ver diagrama en 2D**) · 8 Medir · 9 3D · 10 Guardar .heks desde la cinta (▾) y Guardar como… (barra de arriba, nombre `cercha_<tipo>.heks`).

Verificación numérica ya hecha (ETABS 22 por CLI, `cli/_cercha.mjs <tipo>` + `csi_cli.py --engine etabs`): Warren 0.298 mm (13/13 nudos), Howe 0.257 mm (14/14), Pratt 0.959 mm (14/14).

## 5. Qué toca ahora

1. Paso 7 → `a.pulsar("Ver diagrama en 2D")` tras elegir *Frame results* Axial; luego Moment 3-3; cerrar con la ✕ (`#hk-diagrama-2d`); subir *Deformed scale*.
2. Sonda de 30 s del paso 7 nuevo contra :4600. Build. Grabar Warren (30 min). Revisar hoja. Montar. Enviar.
3. Howe (`cap20_cercha_howe`) y Pratt (`cap21_cercha_pratt`): mismo circuito, una grabación por comando.
