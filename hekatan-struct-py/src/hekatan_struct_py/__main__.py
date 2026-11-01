# -*- coding: utf-8 -*-
"""python -m hekatan_struct_py placa --tipo dkt|dkq|thick --nodos … [--png salida.png] [--json]"""
import sys

AYUDA = """Hekatan Struct Py
  placa   K, momentos y mapa PNG de las placas de Batoz (DKT, DKQ) y del triángulo grueso de CSI
          python -m hekatan_struct_py placa --tipo dkt --nodos 0 0 2 0.5 0.5 1.5 --png dkt.png
  (el resto del motor: python -m hekatan_struct.cli --help)"""

if __name__ == "__main__":
    a = sys.argv[1:]
    if a and a[0] == "placa":
        from hekatan_struct.placas import main
        sys.exit(main(a[1:]))
    print(AYUDA); sys.exit(0 if not a or a[0] in ("-h", "--help") else 2)
