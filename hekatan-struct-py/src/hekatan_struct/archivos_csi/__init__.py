# -*- coding: utf-8 -*-
"""Abrir y guardar ficheros de CSI: `.e2k` (ETABS), `.s2k` (SAP2000) y `.f2k` (SAFE).

    import hekatan_struct as hs
    m = hs.abrir("modelo.e2k")             # -> ModeloCSI (un ModeloHeks: el motor Python lo resuelve tal cual)
    r = hs.guardar(m, "modelo.s2k")        # -> Resultado(ruta, formato, avisos, texto)
    r.avisos                               # lo que NO viajo (nada se pierde en silencio)
    hs.convertir("a.e2k", "a.f2k")         # abrir + guardar

El modelo comun es `ModeloHeks`; `ModeloCSI` le anade patrones de carga (con sus cargas), combinaciones,
nombres de seccion/material/planta y los avisos del lector. Se elige el formato por la extension.
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field

from ._comun import ModeloCSI, a_csi, comparar_modelos
from .escribir_e2k import escribir_e2k
from .escribir_f2k import escribir_f2k
from .escribir_s2k import escribir_s2k
from .leer_e2k import leer_e2k
from .leer_f2k import leer_f2k
from .leer_s2k import leer_s2k

FORMATOS = {".e2k": "etabs", ".$et": "etabs", ".s2k": "sap2000", ".$2k": "sap2000", ".f2k": "safe"}


@dataclass
class Resultado:
    ruta: str
    formato: str
    avisos: list = field(default_factory=list)
    texto: str = ""


def _formato(ruta: str) -> str:
    ext = os.path.splitext(ruta)[1].lower()
    if ext not in FORMATOS:
        raise ValueError("extensión %r no soportada (usa .e2k, .s2k o .f2k)" % ext)
    return FORMATOS[ext]


def abrir(ruta: str, *, comportamiento: str | None = None) -> ModeloCSI:
    """Lee un .e2k / .s2k / .f2k (por la extensión) y devuelve el `ModeloCSI`.

    `comportamiento` = "etabs" | "sap2000" | "safe": activa las reglas por defecto de ese programa en el
    motor (brazos automaticos, deck, union viga-muro...). Sin él el modelo se lee tal cual el fichero."""
    f = _formato(ruta)
    return {"etabs": leer_e2k, "sap2000": leer_s2k, "safe": leer_f2k}[f](ruta, comportamiento=comportamiento)


def guardar(modelo, ruta: str, *, titulo: str | None = None) -> Resultado:
    """Guarda `modelo` (ModeloHeks o ModeloCSI) como .e2k / .s2k / .f2k según la extensión."""
    f = _formato(ruta)
    esc = {"etabs": escribir_e2k, "sap2000": escribir_s2k, "safe": escribir_f2k}[f]
    texto, avisos = esc(modelo, ruta, titulo=titulo)
    return Resultado(ruta, f, list(dict.fromkeys(avisos)), texto)


def convertir(entrada: str, salida: str, *, comportamiento: str | None = None) -> Resultado:
    """abrir + guardar; los avisos del lector y del escritor van juntos en `Resultado.avisos`."""
    m = abrir(entrada, comportamiento=comportamiento)
    r = guardar(m, salida)
    r.avisos = list(dict.fromkeys(m.avisos + r.avisos))
    return r


def main(argv=None) -> int:
    """`python -m hekatan_struct convertir entrada.e2k salida.s2k`"""
    import argparse
    p = argparse.ArgumentParser(prog="hekatan_struct convertir",
                                description="Convierte entre .e2k (ETABS), .s2k (SAP2000) y .f2k (SAFE)")
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--comportamiento", choices=("etabs", "sap2000", "safe"), default=None)
    a = p.parse_args(argv)
    r = convertir(a.entrada, a.salida, comportamiento=a.comportamiento)
    print("%s -> %s (%s)" % (a.entrada, a.salida, r.formato))
    for av in r.avisos:
        print("AVISO:", av)
    return 0


__all__ = ["abrir", "guardar", "convertir", "Resultado", "ModeloCSI", "a_csi", "comparar_modelos", "leer_e2k",
           "leer_s2k", "leer_f2k", "escribir_e2k", "escribir_s2k", "escribir_f2k", "main"]
