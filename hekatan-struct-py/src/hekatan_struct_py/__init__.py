# -*- coding: utf-8 -*-
"""Hekatan Struct Py — el motor Python de Hekatan Struct (repo `hekatan-struct-py`).

Nombre público de la librería. El código vive en `hekatan_struct` (los tests y todo lo anterior lo importan); este
paquete lo re-exporta con el nombre que usa Jorge, para que Claude web pueda llamar:

    from hekatan_struct_py import placas
    python -m hekatan_struct_py placa --tipo dkt --nodos 0 0 2 0.5 0.5 1.5 --png dkt.png
"""
from hekatan_struct import *            # noqa: F401,F403  (API base del motor)
from hekatan_struct import placas       # noqa: F401  (DKT, DKQ y el triángulo grueso de CSI)
from hekatan_struct.placas import (k_dkt, k_dkq, k_grueso, rigidez, momentos, campo, campo_patch, png)  # noqa: F401
from hekatan_struct.placa_modelo import Placa  # noqa: F401  (modelo multi-elemento de placas)
from hekatan_struct import placas_wilson  # noqa: F401  (DKE y DSE de Wilson, libro 2005 cap. 8)
from hekatan_struct.placas_wilson import k_dke, k_dse, cuadrante_placa_cuadrada, viga_un_elemento  # noqa: F401
