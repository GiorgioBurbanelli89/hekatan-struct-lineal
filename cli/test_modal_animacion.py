#!/usr/bin/env python3
"""
Test de ANIMACIÓN de modos de vibración — Hekatan Struct
========================================================

Verifica PROGRAMÁTICAMENTE que la animación de cada modo realmente SE MUEVE,
analizando los GIF exportados desde el workspace ("📥 Descargar GIF del modo").

Para cada GIF:
  - Extrae todos los frames.
  - Calcula la diferencia media absoluta de píxeles entre frames consecutivos.
  - Si hay movimiento real (diff > umbral) → ANIMA: SÍ.
  - Reporta también que el primer y el pico del ciclo difieren (sway del modo).

Uso:
    python test_modal_animacion.py [carpeta_de_gifs]
    (por defecto busca modo_*.gif en ~/Downloads)

Requiere: pillow, numpy   (pip install pillow numpy)
"""
import sys
import glob
import os
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    from PIL import Image, ImageSequence
    import numpy as np
except ImportError:
    print("Falta pillow/numpy. Instalá:  pip install pillow numpy")
    sys.exit(1)

# Umbral: diferencia media de píxeles (0-255) entre frames para considerar "movimiento".
MOV_THRESHOLD = 0.5


def frames_of(path):
    """Devuelve los frames del GIF como arrays RGB uint8 (todos al mismo tamaño)."""
    im = Image.open(path)
    out = []
    for fr in ImageSequence.Iterator(im):
        out.append(np.asarray(fr.convert("RGB"), dtype=np.int16))
    return out


def test_gif(path):
    frames = frames_of(path)
    n = len(frames)
    if n < 2:
        return {"path": path, "frames": n, "anima": False, "motivo": "menos de 2 frames"}

    # diferencia media entre frames consecutivos
    consec = []
    for i in range(1, n):
        d = np.abs(frames[i] - frames[i - 1]).mean()
        consec.append(d)
    # diferencia entre el frame 0 (reposo) y el de mayor amplitud (~1/4 de ciclo)
    quarter = frames[n // 4] if n >= 4 else frames[-1]
    amp_diff = float(np.abs(quarter - frames[0]).mean())

    max_consec = float(max(consec))
    mean_consec = float(sum(consec) / len(consec))
    anima = max_consec > MOV_THRESHOLD and amp_diff > MOV_THRESHOLD
    return {
        "path": path,
        "frames": n,
        "diff_max_consecutivo": round(max_consec, 3),
        "diff_medio_consecutivo": round(mean_consec, 3),
        "diff_reposo_vs_pico": round(amp_diff, 3),
        "anima": anima,
    }


def main():
    if len(sys.argv) > 1:
        folder = sys.argv[1]
    else:
        folder = str(Path.home() / "Downloads")
    pats = sorted(glob.glob(os.path.join(folder, "modo_*.gif")))
    if not pats:
        print(f"No se encontraron modo_*.gif en {folder}")
        sys.exit(1)

    print(f"== Test de animación modal — {len(pats)} GIF(s) en {folder} ==\n")
    all_ok = True
    for p in pats:
        r = test_gif(p)
        estado = "[ANIMA  OK]" if r.get("anima") else "[ESTATICO!]"
        if not r.get("anima"):
            all_ok = False
        print(f"{estado}  {os.path.basename(p)}")
        print(f"    frames={r.get('frames')}  diff_consec_max={r.get('diff_max_consecutivo')}  "
              f"diff_consec_medio={r.get('diff_medio_consecutivo')}  reposo_vs_pico={r.get('diff_reposo_vs_pico')}")
    print()
    print("RESULTADO:", "TODOS ANIMAN OK" if all_ok else "HAY ESTATICOS!")
    sys.exit(0 if all_ok else 2)


if __name__ == "__main__":
    main()
