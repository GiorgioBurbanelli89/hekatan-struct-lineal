# Artículo Revista Politécnica: SAP2000 pasa a ser el juez

Rama `sin-binario`. **Sin commit, sin deploy, sin cambio de rama.**
Regla madre de Jorge (17-sep-2026): **«SIEMPRE es juez SAP2000, no ETABS»**.
El artículo rev2 validaba contra ETABS.

| | |
|---|---|
| Original (NO tocado) | `C:\Users\j-b-j\Downloads\Articulo_Revista_Politecnica_Hekatan_rev2.docx` |
| Salida | `C:\Users\j-b-j\Downloads\Articulo_Revista_Politecnica_Hekatan_rev3_SAP.docx` |
| Evidencia archivada en el repo | `validation/articulo-revista/` (52 KB) |

---

## 1) ✅ El modelo del artículo: dónde está

**Test M — Dual**, `examples/src/test-m/testM.ts`. Sus defaults son literalmente
los del artículo: `nbx = 2` vanos, `nFloors = 4`, `tSlab = 0.20`, `tWall = 0.25`,
`bCol = 0.40`, `bBeam = 0.30`, `hBeam = 0.50`, `ms = 0.75` (malla shell).
Constructor fiel headless: el bloque `buildEdificio` de `cli/sweep_case.mjs`.

❌ `examples/src/edificio-dual/edificioDual.ts` **NO** es este modelo (10 pisos,
losa 0.12, con diagonales). Tampoco la plantilla `dual` de
`validation/modelos/plantillas/` (4 vanos, T1 = 0.675 s).

## 2) ✅ Ya estaba medido contra SAP2000 — y se ha vuelto a medir el lado Hekatan

La medida de SAP2000 es del **14-sep-2026** y estaba en un scratchpad temporal
(a un borrado de perderse). **Se ha copiado al repo**: `validation/articulo-revista/`.

Hoy se ha vuelto a correr SOLO el lado Hekatan, sobre `sin-binario`, con el
defecto actual del motor (los números de SAP2000 son de SAP2000, no se recalculan):

```bash
node validation/articulo-revista/hekatan_variantes.mjs     # 8 variantes + el DEFECTO de hoy
node tests/run.mjs modal-participacion-etabs               # 20/20, 1.4 s
```

⚠️ **NO se abrió SAP2000 ni ETABS en esta sesión.** No hacía falta: la medida
existía y es del mismo modelo, misma malla, 545 nudos.

## 3) ✅ LA TABLA: periodos, juez SAP2000 Shell-Thick (misma malla 1.0 m, 545 nudos)

Se compara contra **Shell-Thick** porque el defecto de la plataforma es MITC4 de
placa gruesa; contra Shell-Thin serían dos formulaciones distintas.

| modo | Hekatan hoy (s) | **SAP2000 Thick (s)** | **dif** | SAP2000 Thin (s) | dif |
|---|---|---|---|---|---|
| 1 | 0.4826 | 0.4841 | **−0.30 %** | 0.4869 | −0.87 % |
| 2 | 0.4318 | 0.4299 | **+0.44 %** | 0.4345 | −0.61 % |
| 3 | 0.1542 | 0.1546 | **−0.27 %** | 0.1552 | −0.68 % |
| 4 | 0.1407 | 0.1402 | **+0.33 %** | 0.1413 | −0.43 % |
| 5 | 0.1195 | 0.1180 | **+1.26 %** | 0.1182 | +1.05 % |

Las FORMAS coinciden (no se emparejan por número de orden): participación Ux de
los modos 1..5 = 83.6 / 0.1 / 10.3 / 0.1 / 0.0 % en Hekatan y 83.6 / 0.1 / 10.4 /
0.1 / 0.0 % en SAP2000.

### La vieja (ETABS) contra la nueva (SAP2000)

| modo | rev2: Hek | rev2: ETABS | **rev3: Hek** | **rev3: SAP2000** | **rev3: dif** |
|---|---|---|---|---|---|
| 1 | 0.4825 | 0.4830 | 0.4826 | 0.4841 | −0.30 % |
| 2 | 0.4317 | 0.4390 | 0.4318 | 0.4299 | +0.44 % |
| 3 | 0.1538 | 0.1540 | 0.1542 | 0.1546 | −0.27 % |
| 4 | 0.1404 | 0.1420 | 0.1407 | 0.1402 | +0.33 % |
| 5 | 0.1176 | 0.1160 | 0.1195 | 0.1180 | +1.26 % |

✅ Los números Hekatan del artículo (de jul-2026) **se reproducen** en los modos
1-4. El modo 5 se mueve de 0.1176 a 0.1195 (1.6 %) y se ha actualizado.
✅ El titular «< 1.7 %» pasa a **«< 0.45 % en los modos 1-4 y 1.26 % en el 5»**.

## 4) ✅ Masa participativa — el artículo la tenía mal

| malla | Hek ΣUx | Hek ΣUy | juez | ΣUx juez | ΣUy juez |
|---|---|---|---|---|---|
| 1.0 m (545 nudos) | 99.27 % | **85.82 %** | SAP2000 Thick | 99.14 % | **85.38 %** |
| 0.75 m (1011 nudos) | 99.25 % | 98.67 % | ETABS 22 (automallado, 333 nudos) | 100.00 % | 99.27 % |

❌ El artículo decía Hekatan 97.5 / 96.9 %. Medido: **99.25 / 98.67 %** (malla 0.75).
⚠️ Con la malla de 1.0 m, 12 modos **NO** llegan al 90 % en Y — ni Hekatan ni
SAP2000 (0.44 puntos entre ellos). No es discrepancia entre programas: es que ahí
la masa de Y se reparte en más modos. Se dice en el artículo.

## 5) ✅ Lo que ya estaba medido y entra tal cual

| tema | archivo | qué dice |
|---|---|---|
| OpenSees: era la MASA, no la malla | `validation/opensees/README.md:126-130` | el traductor pedía `-cMass` (consistente); Hekatan y SAP2000 usan CONCENTRADA. Corregido, los 12 modos dentro del **0.43 %**. El estático bajo carga lateral ya coincidía al 0.500 %, lo que excluye la rigidez |
| ETABS trae solo masa LATERAL | `validation/opensees/README.md:68-82` | `INCLUDEVERTICALMASS "No"` por defecto: el «modo 4» era el 6 y salía **−29.7 %**; al encender la vertical, **−0.01 %** |
| Wilson DSE exige borde DURO | `registros/2026-09-17_placa_borde_duro_sap2000.md` §3 | peor desvío vs SAP2000: **5.87 % (blando) → 2.41 % (duro)**; MITC4 **0.78 %** e insensible al borde. Cita: Wilson §8.9.2 |
| Suite completa | `registros/2026-09-17_shellthick_wilson.md:228` | **594/601**, 7 fallos previos, 359.4 s |
| Patch test | `tests/casos/patch_test_sap2000.mjs` + `validation/02-placas/patch-test-sap2000-2001/README.md` | ejemplo **2-001** de SAP2000 = MacNeal & Harder 1985; árbitro = teoría publicada (Timoshenko). Medido: membrana **4e-14 %**, flexión Thin **4e-13 %**, Thick **2e-9 %**, límite del caso **0.01 %** |

## 6) ❌ Lo que NO se pudo verificar

- **El 10⁻¹⁹ del patch test y el «modelo equivalente en Abaqus» (§4.1) NO tienen
  respaldo en el repo.** `grep -i abaqus` sobre `tests/` y `validation/` no
  devuelve ningún patch test. Se han **sustituido** por el caso 2-001 con sus
  números medidos, y la referencia de Abaqus se ha quitado de la bibliografía.
- **Cortante basal (Tabla 3) y derivas (Tabla 4) contra SAP2000: NO medidos.**
  Solo existen contra ETABS (`validacion/etabs-api/etabs_testM_dual_elf_drifts.json`:
  `W_selfweight 356.28`, `V 32.0652`, `Cs 0.09`, `driftMax_inelastic 0.005718`), y
  **sin columna Hekatan volcada a ningún fichero**. Haría falta montar en SAP2000
  los patrones LX/LY de la FLE y un caso de espectro NEC; el puente actual
  (`cli/plantillas_sap2000.py`) no lo hace. En el artículo quedan marcados
  **[COMPLETAR]** y se dice explícitamente que van contra ETABS.
- El «≈ 1 hora de modelado», los precios CSI, los datos de la encuesta y los ORCID
  siguen sin verificar (los ORCID ya estaban [COMPLETAR]).

## 7) ✅ Cierre

| | |
|---|---|
| SAP2000 / ETABS | ✅ **no se abrieron**; `Get-Process` no devuelve nada |
| RAM libre | 4.82 GB al empezar |
| Disco C: | 6.51 GB. Añadidos 52 KB (`validation/articulo-revista/`) |
| ⏳ ganancia fácil | quedan **1.03 GB en 2 820 temporales de SAP2000** (`.K_*`, `.Y*`, `.$2k`, `.msh`) en `validation/` y `cli/` de corridas ANTERIORES. No se borran por iniciativa propia: son de otra sesión. `find validation cli -type f \( -name "*.K_*" -o -name "*.Y*" -o -name "*.\$2k" -o -name "*.msh" \) -delete` |
| rev2 original | ✅ intacto (fecha 16-sep 23:56) |
| rev3 | ✅ validado (`validate.py --original`: PASSED, +3 párrafos) y **renderizado a PDF y mirado** (págs. 4, 7, 8, 10) |
