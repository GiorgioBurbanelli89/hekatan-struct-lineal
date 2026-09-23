# Losas con hueco, ductos, en L, en T e irregulares — Shell-Thin contra 5 programas

22-sep-2026. Losa maciza t = 0.20 m, E = 25e6 kN/m², ν = 0.2, q = −10 kN/m², apoyos puntuales
donde los pone ETABS. **ETABS malla solo** (Auto Mesh de fábrica, 1.25 m → su mallador GENERAL,
Quad_Build, mete triángulos) y los demás resuelven **esa misma malla**.

## Resultado: misma malla, cinco programas

| caso | malla de ETABS | Hekatan | SAP2000 | OpenSees | numpy |
|---|---|---|---|---|---|
| `losa_L_hueco` | 52 Q4 + 13 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `L_sin_hueco` | 54 Q4 + 11 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `rect_con_hueco` | 77 Q4 + 36 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `losa_T` | 46 Q4 + 4 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `losa_ductos` (3 ductos, uno circular) | 96 Q4 + 68 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `pentagono` (lados oblicuos) | 73 Q4 + 14 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |
| `trapecio_hueco_girado` | 103 Q4 + 9 tri | 0.000 % | 0.000 % | 0.000 % | 0.000 % |

Peor nudo, en % del desplazamiento máximo, contra ETABS. Test: `node tests/run.mjs dkt-triangulo` (43/43).

**Ida y vuelta** (prueba el EXPORTADOR): SAP2000 abre el `.s2k` de Hekatan → 0.000 %; ETABS abre el `.e2k`
→ ≤ 0.004 %. ⚠️ El `.e2k` tiene que ir con `OBJMESHTYPE "NOAUTOMESH"`: con `DEFAULT` ETABS remalla los
elementos de más de 1.25 m y se va 2.5 % (y `NONE` no existe en ETABS: lo ignora y remalla igual).
Los cinco usan la misma familia de placa delgada: **DKQ** en cuadriláteros y **DKT** en triángulos.

## FEniCS (la placa CONTINUA): cuánto error tiene la malla de 1.25 m

FEniCS no trae DKQ/DKT: resuelve Kirchhoff continuo (P2 + C0 interior penalty) afinando la malla
(h = 0.5 / 0.25 / 0.125 m), misma geometría, mismos apoyos. Flecha máxima:

| caso | malla ETABS 1.25 m (los 5 programas) | FEniCS h = 0.125 | la malla de 1.25 m es más rígida |
|---|---|---|---|
| L con hueco | 4.754e-3 | 5.134e-3 | 8.0 % |
| L | 3.096e-2 | 3.123e-2 | 0.9 % |
| rect. con hueco | 1.731e-2 | 1.775e-2 | 2.5 % |
| T | 6.004e-3 | 6.451e-3 | 7.4 % |
| ductos | 4.781e-3 | 4.998e-3 | 4.5 % |
| pentágono | 6.307e-2 | 6.488e-2 | 2.9 % |
| trapecio hueco girado | 1.242e-2 | 1.258e-2 | 1.3 % |

Es error de DISCRETIZACIÓN (malla gruesa + apoyos puntuales), el mismo en los cinco programas.
FEniCS todavía sube algo de h = 0.25 a 0.125: la cifra real es un poco mayor.

## Por qué antes no coincidía con ETABS

1. Se comparaba **Shell-Thick** (MITC4): junto a apoyos puntuales y esquinas de hueco, −4 a −5 %.
2. Con **Shell-Thin** los cuadriláteros ya eran DKQ, pero los **triángulos** de Hekatan eran placa
   gruesa (CS-DSG3): hasta 2 %. Ahora son **DKT** (`hekatan-fem/src/cpp/utils/plateDKT.h`).
3. Aparte, la **malla**: si Hekatan malla solo, sus nudos no son los de Quad_Build.

## Carpetas

```
modelos/<caso>/
   <caso>.heks            el modelo de Hekatan (malla de ETABS)
   <caso>.e2k / .s2k / .f2k   exportados por Hekatan (cli/heks_a_csi.mjs) -> ábrelos en ETABS / SAP2000 / SAFE
   <caso>_ETABS.EDB       lo que malló y resolvió ETABS
   <caso>_SAP2000.sdb     SAP2000 sobre la malla de ETABS
   <caso>_OpenSees.tcl    OpenSees (Tcl): OpenSees.exe o el WPF OpenSees-Calcpad
   <caso>_OpenSees.py     el mismo modelo en OpenSeesPy (python <caso>_OpenSees.py)
   <caso>_idavuelta_*.json   SAP2000/ETABS abriendo el .s2k/.e2k de Hekatan
```

En la app: categoría **2️⃣ Shells · ✅ Validación CSI** → «Losas irregulares (malla ETABS)», con
selector de losa (`/workspace/?t=validacion-losas-csi&caso=4`).

## Scripts (en este orden)

| script | qué hace |
|---|---|
| `../../../galpon-bodega-electoral/malla_etabs_poligono.py - <salida.json> --tipo thin --contorno "x,y;…" --hueco "x,y;…\|x,y;…"` | ETABS malla y resuelve |
| `sap_sobre_malla_etabs.py [caso] [--ver]` | SAP2000 sobre la malla (`--ver` lo deja abierto) |
| `opensees_sobre_malla_etabs.py [caso]` | OpenSees (DKGQ/DKGT), escribe `.tcl` y `.py` |
| `numpy_sobre_malla_etabs.py [caso]` | numpy puro (DKQ + DKT propios, con autoprueba) |
| `wsl -d Ubuntu -- python3 fenics_kirchhoff_cip.py [caso]` | FEniCS continuo en la máquina virtual |
| `node generar_modelos.mjs` | `.heks` + `.e2k/.s2k/.f2k` por caso y el módulo del ejemplo de la app |
| `abrir_csi_y_comparar.py sap [caso] [--ver]` | ida y vuelta: SAP2000 abre el `.s2k` de Hekatan (como `.$2k`) |
| `etabs_abre_e2k.py [caso]` | ida y vuelta: ETABS abre el `.e2k` de Hekatan (vía csi-cli; con `OpenFile` a pelo ETABS se queda en un diálogo) |
| `node ../../tests/run.mjs dkt-triangulo` | Hekatan contra todos, nudo a nudo |
