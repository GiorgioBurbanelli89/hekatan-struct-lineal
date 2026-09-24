# -*- coding: utf-8 -*-
"""FASE B de SAP2000 — la DEFORMADA MODAL ANIMADA de los modos 1, 2 y 3.
Se engancha al SAP2000 que YA esta abierto (fase A). No arranca nada.

    py -3.12 _v4_sap_animar.py <carpeta_capturas> [--sonda]

Camino, medido en la sonda (`_v4_sap_s1_dialogo.png`):
  F6 -> «Display Deformed Shape» -> Case/Combo Name = MODAL -> Step = N -> OK
  -> la barra de estado saca «Start Animation» -> se pulsa y se graban fotogramas.

⚠️ pywinauto pone el proceso DPI-aware: `GetSystemMetrics` pasa a devolver los
2560x1600 FISICOS. Todas las coordenadas de aqui son fisicas, medidas sobre la
captura de la sonda (la de 1280x800 x2).
"""
import json, os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
import win32gui, win32con, win32api
from PIL import ImageGrab, ImageChops
from pywinauto import Application, mouse
from pywinauto.keyboard import send_keys

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1] if len(sys.argv) > 1 else AQUI
ANIM = os.path.join(CAP, "anim"); os.makedirs(ANIM, exist_ok=True)
NF = int(os.environ.get("V4_FRAMES", "24"))
# V4_PREF permite grabar otra pasada (otro encuadre) sin pisar la anterior
PREF = os.environ.get("V4_PREF", "sap")
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

# coordenadas FISICAS del dialogo «Display Deformed Shape»
X_COMBO = (1032, 510)      # Case/Combo Name
X_STEP  = (1102, 682)      # el numero de modo (radio «Step» ya marcado)
X_RSTEP = (648, 686)       # el radio «Step»
X_WIRE  = (1340, 514)      # casilla «Wire Shadow» (se deja la deformada limpia)
X_OK    = (1504, 1076)
X_CLOSE = (1632, 1076)

def principal():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and "SAP2000" in t: r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r[0] if r else (None, None)

hd, tit = principal()
if hd is None: sys.exit("no hay ventana de SAP2000 abierta")
log("ventana %d %r" % (hd, tit))
A, L = win32api.GetSystemMetrics(0), win32api.GetSystemMetrics(1)
log("metricas %dx%d  ImageGrab %s" % (A, L, ImageGrab.grab().size))
app = Application(backend="win32").connect(handle=hd)
w = app.window(handle=hd)
def foco():
    try: w.set_focus()
    except Exception as e: log("foco: %r" % e)
foco(); time.sleep(1)

# la ventana del visor 3-D, que es lo que se graba (no la pantalla entera)
def rect_vista():
    """La ventana de la vista. ⚠️ tras pintar la deformada YA NO se llama «3-D View»
    sino «Deformed Shape (MODAL) - Mode N…»: buscando solo «3-D View» devolvia None y
    se grababa la PANTALLA ENTERA, con la barra de tareas. Se acepta cualquiera de las
    dos, y si no, se recorta el area de cliente del marco.
    HK_CAJA fuerza el recorte a mano."""
    if os.environ.get("HK_CAJA"):
        return tuple(json.loads(os.environ["HK_CAJA"]))
    mejor = None
    for c in w.descendants():
        try:
            t = c.window_text() or ""
            if t == "3-D View" or t.startswith("Deformed Shape"):
                r = c.rectangle()
                if mejor is None or (r.right - r.left) * (r.bottom - r.top) > mejor[4]:
                    mejor = (r.left, r.top, r.right, r.bottom, (r.right - r.left) * (r.bottom - r.top))
        except Exception: pass
    return mejor[:4] if mejor else None

def grab(ruta, caja=None):
    im = ImageGrab.grab()
    if caja: im = im.crop(caja)
    im.save(ruta)
    return im

if "--sonda" in sys.argv:
    send_keys("{F6}"); time.sleep(4)
    grab(os.path.join(CAP, "_v4_sap_s1_dialogo.png"))
    log("sonda: PNG del dialogo; queda ABIERTO"); sys.exit(0)

def dialogo_modo(m):
    """Abre el dialogo y deja pintada la deformada del modo m del caso MODAL."""
    foco(); send_keys("{F6}"); time.sleep(4)
    mouse.click(coords=X_COMBO); time.sleep(1)
    send_keys("MODAL"); time.sleep(1); send_keys("{ENTER}"); time.sleep(2)
    mouse.click(coords=X_RSTEP); time.sleep(1)
    mouse.double_click(coords=X_STEP); time.sleep(0.5)
    send_keys("^a"); send_keys(str(m)); time.sleep(1)
    grab(os.path.join(CAP, "_v4_%s_dlg_m%d.png" % (PREF, m)))
    mouse.click(coords=X_OK); time.sleep(6)

def boton_animacion():
    """«Start Animation» vive en la barra de estado, abajo a la derecha."""
    for c in w.descendants():
        try:
            t = (c.window_text() or "")
            if "Animation" in t:
                r = c.rectangle()
                return ((r.left + r.right) // 2, (r.top + r.bottom) // 2), t
        except Exception: pass
    return None, None

vista = rect_vista()
log("visor 3-D: %s" % (vista,))
resumen = {}
for m in (1, 2, 3):
    log("── modo %d" % m)
    dialogo_modo(m)
    grab(os.path.join(CAP, "_v4_%s_10_modo%d.png" % (PREF, m)), vista)
    # ⚠️ el primer clic sobre «Start Animation» no siempre prende (la ventana acaba
    # de repintarse): se comprueba que el boton pase a decir «Stop» y se reintenta.
    for intento in range(4):
        pos, txt = boton_animacion()
        log("boton: %r en %s (intento %d)" % (txt, pos, intento))
        if txt and "Stop" in txt: break
        if pos: mouse.click(coords=pos)
        time.sleep(2.5)
    t1 = time.time()
    vistos = []
    for f in range(NF):
        im = grab(os.path.join(ANIM, "%s_m%d_%03d.png" % (PREF, m, f)), vista)
        vistos.append(im.convert("L").resize((64, 64)).tobytes())
        time.sleep(0.15)
    distintos = len(set(vistos))
    log("   %d fotogramas en %.1f s — %d DISTINTOS (si es 1, NO se movio)"
        % (NF, time.time() - t1, distintos))
    resumen[m] = distintos
    pos2, txt2 = boton_animacion()   # «Stop Animation» esta en el mismo sitio
    if pos2 and txt2 and "Stop" in txt2:
        mouse.click(coords=pos2); time.sleep(1.5)
log("distintos por modo: %s" % resumen)
log("SAP2000 QUEDA ABIERTO")
