# El modelo dual del artículo de la Revista Politécnica, con SAP2000 de JUEZ

Regla de Jorge (17-sep-2026): **«SIEMPRE es juez SAP2000, no ETABS»**.
El artículo rev2 validaba contra ETABS; aquí está la medida contra SAP2000.

## El modelo

**Test M — Dual** (`examples/src/test-m/testM.ts`), 2×2 vanos × 4 pisos,
losa 0.20 m, muros 0.25 m, columnas 0.40 m, vigas 0.30×0.50 m.
Constructor fiel: el bloque `buildEdificio` de `cli/sweep_case.mjs`.

| | |
|---|---|
| malla del contraste con SAP2000 | **1.0 m → 545 nudos**, la MISMA en los dos |
| malla del contraste con ETABS | Hekatan 0.75 m (1011 nudos) contra el automallado de ETABS (333) |
| masa | completa (las tres direcciones), `lateral = 0` |

## Cómo se corre

```bash
# SAP2000 24, misma malla nudo a nudo, Shell-Thin y Shell-Thick (1 arranque)
python validation/articulo-revista/sap_dual_modal.py
# Hekatan, 8 variantes placa/membrana + el DEFECTO de hoy
node  validation/articulo-revista/hekatan_variantes.mjs
# contra ETABS (ya en la suite)
node  tests/run.mjs modal-participacion-etabs
```

## Lo medido — periodos, juez SAP2000 Shell-Thick (misma malla, 545 nudos)

`sap_dual.json` (`casos.THICK.T`) contra `hekatan_variantes.json`
(variante `H DEFECTO DE HOY (sin-binario)`), medido el 17-sep-2026.

Se compara contra **Shell-Thick** porque el defecto de la plataforma es
MITC4 de placa gruesa: comparar contra Shell-Thin sería comparar dos
formulaciones distintas.

| modo | Hekatan (s) | SAP2000 Thick (s) | dif | SAP2000 Thin (s) | dif |
|---|---|---|---|---|---|
| 1 | 0.4826 | 0.4841 | **−0.30 %** | 0.4869 | −0.87 % |
| 2 | 0.4318 | 0.4299 | **+0.44 %** | 0.4345 | −0.61 % |
| 3 | 0.1542 | 0.1546 | **−0.27 %** | 0.1552 | −0.68 % |
| 4 | 0.1407 | 0.1402 | **+0.33 %** | 0.1413 | −0.43 % |
| 5 | 0.1195 | 0.1180 | **+1.26 %** | 0.1182 | +1.05 % |

Las formas coinciden: participación Ux de los modos 1..5 = 83.6 / 0.1 / 10.3 /
0.1 / 0.0 % en Hekatan y 83.6 / 0.1 / 10.4 / 0.1 / 0.0 % en SAP2000.

## Masa participativa acumulada en 12 modos

| malla | Hekatan ΣUx | Hekatan ΣUy | juez | ΣUx juez | ΣUy juez |
|---|---|---|---|---|---|
| 1.0 m (545 nudos) | 99.27 % | **85.82 %** | SAP2000 Thick | 99.14 % | **85.38 %** |
| 0.75 m (1011 nudos) | 99.25 % | 98.67 % | ETABS 22 (automallado) | 100.00 % | 99.27 % |

⚠️ Con la malla de 1.0 m, **12 modos NO llegan al 90 % en Y** — ni en Hekatan ni
en SAP2000. No es una discrepancia entre programas (0.44 puntos): es que en esa
malla la masa de Y se reparte en más modos. Con 0.75 m sí se pasa (98.67 %).
Quien cite el 90 % de la NEC tiene que decir con qué malla y con cuántos modos.

## Cortante basal y derivas, juez SAP2000 (17-sep-2026)

Mismo modelo, misma malla (545 nudos), misma variante **H**. En los dos programas
la FLE de la NEC se aplica como las MISMAS cargas nodales y el dinámico usa el
MISMO espectro elástico NEC-15 tabulado, CQC, ζ = 5 %, 12 modos.

```bash
node   validation/articulo-revista/hekatan_cortante_derivas.mjs
python validation/articulo-revista/sap_dual_sismo.py dual_2x2x4_sismo.json sap_dual_sismo.json
python validation/articulo-revista/comparar_sismo.py
```

### Cortante basal (tonf)

| Concepto | Hekatan | SAP2000 | dif |
|---|---|---|---|
| W (carga sísmica reactiva) | 356.28 | 356.28 | **0.00 %** |
| Estático FLE, Vest | 32.065 | 32.065 | **0.00 %** |
| Dinámico espectral X | 26.99 | 26.52 | **+1.77 %** |
| Dinámico espectral Y | 16.69 | 16.34 | **+2.14 %** |
| Vdin,X / Vest | 84.2 % | 82.7 % | ≥ 80 % NEC §6.2.2.b |

### Derivas de piso en X, ΔM = 0.75·R·Δe (NEC §6.3.9)

| piso | Hekatan ΔM (%) | SAP2000 ΔM (%) | dif |
|---|---|---|---|
| 4 | 0.269 | 0.271 | −0.42 % |
| 3 | 0.443 | 0.445 | −0.50 % |
| 2 (máx) | 0.548 | 0.550 | −0.41 % |
| 1 | 0.403 | 0.408 | −1.05 % |

Ficheros: `hekatan_cortante_derivas.json`, `sap_dual_sismo.json`,
`dual_2x2x4_sismo.json` (el modelo + el espectro + las fuerzas LX que come SAP).

⚠️ `buildEdificio` de `cli/sweep_case.mjs` fuerza `plateFormulations = 2` y
`drillingTypes = 2` (variante **A**, T₁ = 0.4875 s). Para medir la variante del
artículo (**H**, T₁ = 0.4826 s) hay que VACIAR esos dos mapas.

⚠️ Los parámetros de SALIDA del OAPI no se pasan como marcadores:
`sm.Results.BaseReact(0, [], [], ...)` revienta con *«must be real number, not
list»*. Se llama sin argumentos y comtypes los devuelve. `sap_leer_sismo.py` se
engancha a una instancia YA abierta y repite la lectura sin arrancar SAP2000.
