# -*- coding: utf-8 -*-
"""Inventario: qué elemento, de qué fuente, contra qué juez y con qué error (medido; nada estimado).

Estados: "ok" = verificado con datos/tests; "ok_reg" = verificado y anotado en la bitácora, sin datos dentro del
paquete; "pend" = falta medir; "no" = comparado y NO coincide (no es el mismo elemento); "-" = no aplica.
"""

INVENTARIO = [
    dict(elemento="k_membrana_csi", fuente="Allman / ITW 1990 §2-3; proyección Wilson 2005 ec. 9.8; Gauss 2x2; "
         "constantes 0.1 y 5e-5 medidas en CSI",
         SAP2000=("ok", "desplazamientos de 12 mallas ITW 1990 (Tablas I-III), <= 1.2e-10 % [test]; K12 directa: PENDIENTE"),
         ETABS=("ok", "K12 por flexibilidad, 12 celdas (10 Slab + 2 Wall), <= 2.1e-15 relativo [test]"),
         libro=("ok", "ITW 1990 Tabla II regular 0.34500/0.35038/0.35434 vs paper 0.3445/0.3504/0.3543 (<= 0.15 %); "
                      "leyes θθ del cuadrado 1/10, 1/(18-6ν), 2e-4 exactas [test]")),
    dict(elemento="k_shell_thin_dkq", fuente="Batoz y Tahar, IJNME 18 (1982)",
         SAP2000=("ok", "reacciones (campo w = x³/6 + x·y²/2) < 1e-5 %, momentos nodales a 1e-6 [test_placas_batoz]"),
         ETABS=("ok", "K 12x12 directa (k_thin_cuad) 3.5e-14 % [test]"),
         libro=("ok", "Navier, placa cuadrada q uniforme [test_placa_modelo]")),
    dict(elemento="k_shell_thin_dkt", fuente="Batoz, Bathe y Ho, IJNME 15 (1980)",
         SAP2000=("ok", "reacciones < 1e-5 %, momentos a 1e-6 [test_placas_batoz]"),
         ETABS=("ok_reg", "0.000 % (registros/2026-09-22, sin K medida en el paquete)"),
         libro=("ok", "patch test w = x²/2 exacto [hoja LISP / registros 2026-10-30]")),
    dict(elemento="k_shell_thick_cuad", fuente="Wilson 2005 cap. 8 (lados, ec. 8.7, 8.17) + MITC4 simetrizado + "
         "8 puntos CANM 7 ec. 30 + penalización 1000·tr(Db) medida",
         SAP2000=("ok", "K 12x12 directa, 136 celdas <= 5.8e-11 % (+2 artefactos con un solo modificador m11/m22) [test]"),
         ETABS=("ok", "K 12x12 directa, 4 celdas <= 1.0e-12 % [test]; K de 22 GDL antes de condensar 1e-15 (repo privado)"),
         libro=("-", "no publicado por CSI; patch test de flexión exacto [test]")),
    dict(elemento="k_shell_thick_tri", fuente="medido (giros de lado 4·La·Lb, cortante de Wilson por lado, B-barra, "
         "penalización 1000·tr(Db), 15 -> 9)",
         SAP2000=("ok", "reacciones < 1e-5 % (hoja LISP 2.4e-8 %), M y V13/V23 a 1e-6 [test_placas_batoz]"),
         ETABS=("ok_reg", "reacciones 1.1e-5 % (registros/2026-10-30)"),
         libro=("-", "no publicado")),
    dict(elemento="k_dke", fuente="Wilson 2005 ec. 8.21, p. 8-10",
         SAP2000=("ok", "= DKQ a 1e-12 relativo -> mismo juez que Shell-Thin [test_placas_wilson]"),
         ETABS=("ok", "= DKQ -> K Shell-Thin de ETABS 3.5e-14 % [test]"),
         libro=("ok", "Tablas 8.1-8.3 <= 0.15 %; Timoshenko q uniforme 0.2 % [test_placas_wilson]")),
    dict(elemento="k_dse", fuente="Wilson 2005 ec. 8.18-8.19, p. 8-9",
         SAP2000=("no", "NO es el Shell-Thick de CSI: 64-139 % en la K (repo privado, compara_publicadas)"),
         ETABS=("no", "ídem"),
         libro=("ok", "Tablas 8.1-8.3 <= 0.15 % [test_placas_wilson]")),
    dict(elemento="Placa (placa_modelo)", fuente="ensamblado DKT/DKQ/grueso",
         SAP2000=("pend", "modelo multi-elemento sin juez CSI todavía"),
         ETABS=("pend", "ídem"),
         libro=("ok", "Navier y equilibrio ΣR [test_placa_modelo]")),
]

PENDIENTES = [
    "K12 de membrana en SAP2000 (Membrane/Thin/Thick por flexibilidad): script listo en el repo privado "
    "(sap_celda_membrana12.py), falta RAM (~5 GB).",
    "Membrana del TRIÁNGULO de SAP2000: resto 4e-6…5e-5 de |K| en el bloque θθ (registros/2026-10-05).",
    "Cáscara curva (hemisferio ITW, 4x4): la membrana CSI montada en Struct da −2.93 % frente a SAP2000 "
    "(8x8 −1.10 %, 16x16 −0.38 %) (registros/2026-10-25).",
    "Shell-Thick cuadrilátero con UN solo modificador m11 o m22: 0.0095 % / 0.59 % (pivote de redondeo de CSI).",
    "K 9x9 del Shell-Thick triángulo por flexibilidad (hoy solo reacciones y M/V).",
    "Membrana: ν en geometrías no cuadradas en SAP2000, ortótropo, modificadores sobre la 12x12.",
]
