#!/usr/bin/env python
"""Valida el flujo SAP IV: corre los ejemplos de SAP-32-64.zip (sap64.exe / sap32.exe) y compara con los .out entregados.
Uso: python cli/sap4_ejemplos.py <carpeta con sap64.exe y exampleN.inp/.out> <carpeta de trabajo> [sap64|sap32]
No copia nada de SAP IV al repo. Metrica: numeros de la salida (sin lineas de tiempos/memoria) y bloque de desplazamientos nodales."""
import re, subprocess, sys
from pathlib import Path

NUM = re.compile(r'[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[EeDd][-+]?\d+)?')
SKIP = re.compile(r'TIME|FILE|DATE|SECOND|CPU|ELAPSED|CAPACITY|STORAGE|=\s*\d+\.\d\d\d\s*$', re.I)


def cargar(p):
    return [l for l in Path(p).read_text(errors="replace").split("\n") if not SKIP.search(l)]


def nums(L):
    return [float(x.replace("D", "E")) for l in L for x in NUM.findall(l)]


def desp(L):
    out, on = [], False
    for l in L:
        if re.search(r'N O D E\s+D I S P L A C E M E N T S', l):
            on = True; continue
        t = l.split()
        if on and len(t) == 8 and t[0].isdigit() and t[1].isdigit():
            out += [float(x.replace("D", "E")) for x in t[2:]]
        elif on and re.search(r'[A-Z]{3}', l) and not re.search(r'NODE|NUMBER|CASE|TRANSLATION|ROTATION|X-|Y-|Z-|DISP', l):
            on = False
    return out


def main(src, trab, exe="sap64"):
    src, trab = Path(src), Path(trab); trab.mkdir(parents=True, exist_ok=True)
    (trab / f"{exe}.exe").write_bytes((src / f"{exe}.exe").read_bytes())
    for n in ("1", "2", "3", "4a", "4b", "5", "6", "7", "8"):
        inp = f"example{n}.inp"; (trab / inp).write_bytes((src / inp).read_bytes())
        r = subprocess.run([str(trab / f"{exe}.exe")], input=f"{inp}\nmy{n}.out\n", text=True, cwd=trab, capture_output=True, timeout=300)
        ref = src / ("example1.out64" if n == "1" else f"example{n}.out")
        A, B = cargar(trab / f"my{n}.out"), cargar(ref)
        a, b = nums(A), nums(B)
        da, db = desp(A), desp(B)
        d = f"dU max {max(abs(x - y) for x, y in zip(da, db)):.1e} (umax {max(map(abs, db)):.3g})" if da and len(da) == len(db) else "sin bloque de desplazamientos comparable"
        rel = f"{max(abs(x - y) for x, y in zip(a, b)) / (max(map(abs, b)) or 1):.1e}" if len(a) == len(b) and a else f"n {len(a)}/{len(b)} (distinto)"
        print(f"ej{n}: rc={r.returncode} numeros {len(a)} relmax {rel}; {d}")


if __name__ == "__main__":
    main(*sys.argv[1:4])
