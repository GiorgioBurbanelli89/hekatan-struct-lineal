# -*- coding: utf-8 -*-
"""FASE B de ETABS 22 — la DEFORMADA MODAL ANIMADA de los modos 1, 2 y 3.
Se engancha al ETABS que YA esta abierto (fase A).

    py -3.12 _v4_etabs_animar.py <carpeta_capturas> [--sonda]

A diferencia de SAP2000, el dialogo «Deformed Shape» de ETABS **es una ventana de
nivel superior con controles WinForms accesibles**: se conduce por CONTROL (radio
«Mode», los dos ComboBox, «OK»), no por coordenadas a ojo. Lo unico que sigue yendo
por coordenadas es «Start Animation», que vive en la barra de estado.

Lo ya medido y que sigue siendo verdad: ETABS no deja conducir su menu (ni Ctrl+T ni
Alt+flechas), y su ventana puede abrirse fuera de pantalla (la fase A la recoloca).
"""
import json, os, sys, time
sys.stdout.reconfigure(encoding="utf-8")
import win32gui, win32con, win32api
from PIL import ImageGrab
from pywinauto import Application, mouse
from pywinauto.keyboard import send_keys

AQUI = os.path.dirname(os.path.abspath(__file__))
CAP = sys.argv[1] if len(sys.argv) > 1 else AQUI
ANIM = os.path.join(CAP, "anim"); os.makedirs(ANIM, exist_ok=True)
NF = int(os.environ.get("V4_FRAMES", "24"))
PREF = os.environ.get("V4_PREF", "etabs")   # otra pasada sin pisar la anterior
CAJA = tuple(json.loads(os.environ["HK_CAJA"])) if os.environ.get("HK_CAJA") else None
t0 = time.time()
def log(s): print("[%5.0f s] %s" % (time.time() - t0, s), flush=True)

def principal():
    r = []
    def cb(hd, _):
        t = win32gui.GetWindowText(hd)
        if win32gui.IsWindowVisible(hd) and t.startswith("ETABS"): r.append((hd, t))
    win32gui.EnumWindows(cb, None)
    return r[0] if r else (None, None)

hd, tit = principal()
if hd is None: sys.exit("no hay ventana de ETABS abierta")
log("ventana %d %r" % (hd, tit))
app = Application(backend="win32").connect(handle=hd)
w = app.window(handle=hd)
def foco():
    try: w.set_focus()
    except Exception as e: log("foco: %r" % e)

def grab(ruta, caja=None):
    im = ImageGrab.grab()
    if caja: im = im.crop(caja)
    im.save(ruta); return im

def dialogo():
    """La ventana de nivel superior «Deformed Shape», si esta abierta."""
    r = []
    def cb(h2, _):
        if win32gui.IsWindowVisible(h2) and h2 != hd and win32gui.GetWindowText(h2) == "Deformed Shape":
            r.append(h2)
    win32gui.EnumWindows(cb, None)
    return r[0] if r else None

def ctrls(h2):
    d = Application(backend="win32").connect(handle=h2).window(handle=h2)
    out = {"botones": {}, "combos": []}
    for c in d.descendants():
        try:
            cl, t, r = c.class_name(), (c.window_text() or ""), c.rectangle()
            if ".Button." in cl and t: out["botones"][t.strip()] = c
            if ".ComboBox." in cl: out["combos"].append(c)
            if ".Edit." in cl: out.setdefault("edits", []).append(c)
        except Exception: pass
    out["combos"].sort(key=lambda c: c.rectangle().left)
    out.setdefault("edits", []).sort(key=lambda c: (c.rectangle().top, c.rectangle().left))
    return d, out

def centro(c):
    r = c.rectangle(); return ((r.left + r.right) // 2, (r.top + r.bottom) // 2)

if "--sonda" in sys.argv:
    foco(); time.sleep(1); send_keys("{F6}"); time.sleep(5)
    grab(os.path.join(CAP, "_v4_etabs_s1_dialogo.png"))
    h2 = dialogo(); print("dialogo:", h2)
    if h2:
        _, cs = ctrls(h2)
        for k, c in cs["botones"].items(): print("  BOTON %-34r %s" % (k, c.rectangle()))
        for c in cs["combos"]: print("  COMBO %-34r %s" % (c.window_text(), c.rectangle()))
    sys.exit(0)

def poner_modo(m):
    """Deja pintada la deformada del modo m (caso Modal) y cierra el dialogo."""
    h2 = dialogo()
    if h2 is None:
        foco(); time.sleep(1); send_keys("{F6}"); time.sleep(5); h2 = dialogo()
    if h2 is None: raise RuntimeError("no se abrio el dialogo Deformed Shape")
    d, cs = ctrls(h2)
    d.set_focus(); time.sleep(1)
    if "Mode" in cs["botones"]:
        mouse.click(coords=centro(cs["botones"]["Mode"])); time.sleep(1.5)
        d, cs = ctrls(h2)                       # los combos cambian de contenido
    c_caso = cs["combos"][0] if cs["combos"] else None
    c_modo = None
    for c in cs["combos"]:
        r = c.rectangle()
        if 1240 < r.left < 1440 and r.top < 400: c_modo = c
    log("caso=%r  modo=%r" % (c_caso.window_text() if c_caso else None,
                              c_modo.window_text() if c_modo else None))
    # ⚠️ el combo de al lado dice «Mode Number» y tiene UN solo elemento: NO es la lista
    # de modos. El numero de modo va en la CAJA DE TEXTO que hay a su derecha (con su
    # flechita). Fijarse solo en el combo dejaba los tres videos en el modo 1 — medido.
    caja = None
    for e in cs.get("edits", []):
        r = e.rectangle()
        if 1380 < r.left < 1500 and r.top < 420: caja = e
    if caja is None:
        raise RuntimeError("no encuentro la caja del numero de modo")
    mouse.double_click(coords=centro(caja)); time.sleep(0.5)
    send_keys("^a"); send_keys("{BACKSPACE}"); send_keys(str(m)); time.sleep(0.5)
    send_keys("{TAB}"); time.sleep(1.5)
    log("caja del modo = %r" % caja.window_text())
    grab(os.path.join(CAP, "_v4_%s_dlg_m%d.png" % (PREF, m)))
    if "OK" in cs["botones"]:
        mouse.click(coords=centro(cs["botones"]["OK"])); time.sleep(6)

def boton_animacion():
    for c in w.descendants():
        try:
            t = (c.window_text() or "")
            if "Animation" in t:
                return centro(c), t
        except Exception: pass
    return None, None

resumen = {}
for m in (1, 2, 3):
    log("── modo %d" % m)
    poner_modo(m)
    grab(os.path.join(CAP, "_v4_%s_10_modo%d.png" % (PREF, m)), CAJA)
    for intento in range(4):
        pos, txt = boton_animacion()
        log("boton: %r en %s (intento %d)" % (txt, pos, intento))
        if txt and "Stop" in txt: break
        if pos: mouse.click(coords=pos)
        time.sleep(2.5)
    t1 = time.time(); vistos = []
    for f in range(NF):
        im = grab(os.path.join(ANIM, "%s_m%d_%03d.png" % (PREF, m, f)), CAJA)
        vistos.append(im.convert("L").resize((64, 64)).tobytes())
        time.sleep(0.15)
    resumen[m] = len(set(vistos))
    log("   %d fotogramas en %.1f s — %d DISTINTOS" % (NF, time.time() - t1, resumen[m]))
    pos2, txt2 = boton_animacion()
    if pos2 and txt2 and "Stop" in txt2: mouse.click(coords=pos2); time.sleep(1.5)
log("distintos por modo: %s" % resumen)
log("ETABS QUEDA ABIERTO")
