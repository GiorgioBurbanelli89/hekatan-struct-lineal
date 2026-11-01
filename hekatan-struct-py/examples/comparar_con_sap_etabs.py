# -*- coding: utf-8 -*-
"""Tabla elemento x juez (SAP2000 / ETABS / libro) de las formulaciones de Wilson y CSI en Python.

    python examples/comparar_con_sap_etabs.py            (desde hekatan-struct-py)

Recalcula los errores con los datos YA medidos (tests/datos_csi/medidas_csi.json.gz); no abre SAP2000 ni ETABS.
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src"))
from hekatan_struct.csi.comparar import main  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main())
