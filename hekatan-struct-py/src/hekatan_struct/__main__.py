# -*- coding: utf-8 -*-
"""`python -m hekatan_struct convertir entrada.e2k salida.s2k`; el resto de subcomandos son los de `cli`."""
import sys

if __name__ == "__main__":
    from .cli import main
    sys.exit(main())
