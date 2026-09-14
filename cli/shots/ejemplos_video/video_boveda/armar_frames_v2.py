# -*- coding: utf-8 -*-
"""v2 del vídeo de la bóveda: las tomas de HEKATAN se rehacen con la interfaz nueva (Resultado · Modo ·
Animar; la animación sigue al pasar de modo). SAP2000, ETABS, tabla y QR se reutilizan de la v1.
Las tomas de Hekatan salen de frames_tut_comprob_modelo_v2/ (grabador con cursor, pasos.json)."""
import os, json, shutil, subprocess, glob
from PIL import Image
FF = r"C:\Users\j-b-j\AppData\Roaming\Python\Python312\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
OUT = "frames_montaje_v2"; shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
FPS = 10
W, H, HU = 1920, 1080, 960
n = 0; pasos = []
def encaja(im):
    im = im.convert("RGB"); s = min(W / im.width, HU / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    lienzo = Image.new("RGB", (W, H), (0, 0, 0)); lienzo.paste(im, ((W - im.width) // 2, (HU - im.height) // 2)); return lienzo
def paso(rotulo, imgs):
    global n
    d = n
    for im in imgs: encaja(im).save(os.path.join(OUT, "f%03d.png" % n)); n += 1
    pasos.append({"rotulo": rotulo, "desde": d, "hasta": n - 1, "cuadros": n - d}); print("%-50s %4d cuadros" % (rotulo, n - d))
def de_video(mkv, t0, t1, crop):
    tmp = "_tmp_ext"; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
    x, y, w, h = crop
    subprocess.run([FF, "-y", "-v", "error", "-ss", str(t0), "-to", str(t1), "-i", mkv, "-vf", "fps=%d,crop=%d:%d:%d:%d" % (FPS, w, h, x, y), os.path.join(tmp, "e%04d.png")], check=True)
    ims = [Image.open(f).copy() for f in sorted(glob.glob(tmp + "/e*.png"))]; shutil.rmtree(tmp); return ims
CSI = (0, 0, 2560, 1530)
TUT = os.path.join("..", "..", "..", "..", "frames_tut_comprob_modelo_v2")
pt = json.load(open(os.path.join(TUT, "pasos.json"), encoding="utf-8"))
lista = pt["pasos"] if isinstance(pt, dict) else pt
def tut(i):
    p = lista[i]
    # el grabador ya deja 1920x1080 con la franja de abajo: se usan tal cual
    return [Image.open(os.path.join(TUT, "f%03d.png" % k)) for k in range(p["desde"], p["hasta"] + 1)]
for i in range(5):
    paso(lista[i]["rotulo"], tut(i))
paso("6 · SAP2000: deformada Dead Uz", de_video("sap_toma.mkv", 1.5, 19.0, CSI))
paso("7 · SAP2000: modo 1 y animación", de_video("sap_toma.mkv", 19.0, 40.9, CSI))
paso("8 · SAP2000: tabla de masa participativa", de_video("sap_toma.mkv", 40.9, 62.5, CSI))
paso("9 · ETABS: deformada Dead Uz", de_video("etabs_toma.mkv", 1.5, 17.9, CSI))
paso("10 · ETABS: modo 1 y animación", de_video("etabs_toma.mkv", 17.9, 36.7, CSI))
paso("11 · ETABS: tabla de masa participativa", de_video("etabs_toma.mkv", 36.7, 58.0, CSI))
tabla = Image.open("../../boveda_entrega/tabla_confiabilidad.png")
paso("12 · Tabla de confiabilidad", [tabla] * 40)
paso("13 · QR para el celular", [Image.open("tarjeta_qr.png")] * 40)
json.dump({"titulo": "Hekatan Struct · Bóveda de la capilla · comprobado contra SAP2000 y ETABS", "pasos": pasos}, open(os.path.join(OUT, "pasos.json"), "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("total", n, "cuadros")
