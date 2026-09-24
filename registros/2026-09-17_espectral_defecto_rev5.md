# El espectral nuevo pasa a DEFECTO + artículo rev5

**Repo:** `hekatan-struct`, rama `sin-binario`. **Sin commit, sin deploy, sin cambiar de rama, sin publicar.**
**Juez: SAP2000** — `validation/articulo-revista/sap_dual_sismo.json` (SAP2000 24, medido 14-sep-2026,
misma malla nudo a nudo). **NO se abrió SAP2000 en esta sesión**: se reusó esa medida, como pedía la orden.
Continúa `registros/2026-09-17_formas_modales_espectral.md`.

---

## TAREA 1 — El espectral nuevo, por defecto

### ✅ 1) Un solo punto de entrada, y el viejo con nombre propio

`examples/src/shared/responseSpectrum.ts` (+165 líneas, no se borró nada):

| función | qué es |
|---|---|
| `baseShearDynamic(modal, dir, Sad, opt)` | **el DEFECTO**. Si el modal trae `participationFactors` usa el método SAP2000; si no (WASM sin recompilar), cae solo al viejo y lo dice en `metodo`. Devuelve `{V, metodo}` |
| `baseShearRatioW(modal, dir, Sad, W, opt)` | **el VIEJO**, sólo para comparar. `Vᵢ = I·Sad(Tᵢ)·ratioᵢ·W` |
| `modalBaseShearsRatioW(...)` | los cortantes modales del viejo, por si se quiere la tabla modo a modo |

El porqué, escrito en español en la cabecera del bloque: `W = Σρ·V` incluye la masa pegada a los
apoyos (que no vibra) y el denominador del `ratio` es la masa LIBRE del modal; por eso `ratio·W`
sobra ~1.9 %. El nuevo va por `Γ·Γ·Sa·g`, que es masa efectiva × aceleración.

### ✅ 2) Llamadores cambiados (buscados, no supuestos)

Barrido `participation|combineModal|baseShear|cortanteBasal` sobre todo `*.ts|*.mjs|*.js` (sin
`node_modules`): 9 ficheros. De ellos, los que **calculaban** cortante dinámico eran dos.

| fichero | qué se hizo |
|---|---|
| `examples/src/test-m/testM.ts` | el bloque «DINÁMICO» ahora llama a `baseShearDynamic`. La línea de salida dice el método: `(CQC+SRSS, ζ=0.05, Γ modal estilo SAP2000)` |
| `validation/articulo-revista/hekatan_cortante_derivas.mjs` | idem, y **imprime las dos**: la nueva y la vieja al lado. El JSON gana `metodoDinamico` y `viejoRatioW` |
| `examples/src/shared/panelEspectral.ts` | **no calcula nada** (es el panel Tweakpane). Se le añadió el selector `metodoCortante` con **"SAP2000" de fábrica** y "ratio·W (viejo)" como alternativa, documentado en español |
| `hekatan-ui/src/index.ts`, `examples/src/shared/getCad3d.ts`, `espectroNEC.ts` | ❌ falsos positivos del grep: participación de masa modal, no cortante. No se tocan |
| `validation/articulo-revista/hekatan_espectral_sap.mjs` | se deja como estaba: es el banco que compara los dos métodos |

### ✅ 3) La medida, con el defecto nuevo

`node validation/articulo-revista/hekatan_cortante_derivas.mjs` (545 nudos, 736 elementos, malla 1.0 m,
NEC-15 Z=0.40, suelo E, Costa, R=8, I=1, ζ=5 %, 12 modos, CQC):

```
W=356.28 tonf   Sa(T1)=0.7200g   Cs=0.09000   Vest=32.065 tonf
V dinamico CQC [SAP2000]       X=26.4804   Y=16.3743 tonf   (Vx/Vest=82.6 %)
V dinamico CQC [viejo ratioW]  X=26.9872   Y=16.6877 tonf   (solo comparacion)
```

| dir | VIEJO (tonf) | dif % | **NUEVO = DEFECTO** | **dif %** | SAP2000 (tonf) |
|---|---|---|---|---|---|
| X | 26.9872 | +1.7726 | **26.4804** | **−0.1389** | 26.5172 |
| Y | 16.6877 | +2.1352 | **16.3743** | **+0.2169** | 16.3389 |

**Confirmado el ~0.2 %.** Dígito a dígito lo mismo que midió el banco de la sesión anterior.
Fuente de cada número: `validation/articulo-revista/hekatan_cortante_derivas.json` (Hekatan) y
`validation/articulo-revista/sap_dual_sismo.json` (SAP2000).

### ✅ 4) `npm test` — antes y después, en el MISMO árbol

⚠️ **El 594/601 de la bitácora de la mañana ya no es la línea base**: entre medias, el trabajo de
automallado (transfinita + pavimentador, `registros/` del repo padre) añadió **16 comprobaciones** y
2 filas de juez SAP2000 que quedaron fallando a propósito. Para no comparar peras con manzanas se
midió la base **hoy**, revirtiendo mis tres ficheros con `git checkout` y restaurándolos después.

| | marcador | fallos |
|---|---|---|
| **ANTES** (mis 3 ficheros revertidos) | **608/617** en 144.6 s | **9** |
| **DESPUÉS** (defecto nuevo) | **608/617** en 144.6 s | **9** |
| (histórico, árbol de la mañana) | 594/601 | 7 |

Los 9, idénticos en los dos logs:

```
(f) SAP2000 (juez)                                 8.425 %   (limite 0.50 %)   ← NUEVO hoy (pavimentador)
(e) SAP2000 (juez)                                 3.578 %   (limite 0.50 %)   ← NUEVO hoy (bóveda)
automesh: los 25 nudos contra ETABS               11.936 %   (limite 0.00 %)
placa flexible: NODAL vs SAFE muelle de area       3.210 %   (limite 1.50 %)
consistente: Python vs TS/WASM, 25 nudos           5.940 %   (limite 0.00 %)
nodal: Python vs TS/WASM, 25 nudos                 6.165 %   (limite 0.00 %)
colgado: Python vs TS/WASM, 8 nudos                6.888 %   (limite 0.00 %)
joints M11/M22/M12 vs SAP2000 (AreaForceShell)    43.109 %   (limite 0.10 %)
M11 en el nudo central vs SAP2000                 −2.936 %   (limite 0.10 %)
```

**No se subió ningún límite.** Y el cambio SÍ está cubierto: `tests/casos/modal_participacion_etabs.mjs`
empaqueta `testM.ts` y llama a `testMDual.build(...)`, o sea pasa por el camino nuevo — y pasa.

Logs: `…/scratchpad/npmtest_antes_rev5.log` y `npmtest_despues_rev5.log`.

---

## TAREA 2 — Artículo rev5

**Base:** `C:\Users\j-b-j\Downloads\Articulo_Revista_Politecnica_Hekatan_rev4_SAP.docx` (NO se tocó).
**Entrega:** `C:\Users\j-b-j\Downloads\Articulo_Revista_Politecnica_Hekatan_rev5_SAP.docx`.

Método: se descomprime el `.docx` y se sustituye **sólo el trozo XML** de cada `<w:p>`/`<w:tbl>`
afectado (`scratchpad/edit_rev5.py`, heredado del rev4 y ampliado para **insertar** párrafos
clonando el modelo, así hereda estilo). Reserializar el documento entero rompe las figuras.

### ✅ Párrafos cambiados

| hijo del body | sección | qué |
|---|---|---|
| **Tabla 3** (104) | §4.3 | Vdin,X 26.99→**26.48** (dif +1.77→**−0.14**); Vdin,Y 16.69→**16.37** (+2.14→**+0.22**); Vdin,X/Vest 84.2→**82.6 %** |
| 102 | §4.3 | se añade que la respuesta se compone modo a modo con los Γ del modal, **con su signo**, y se combina por CQC, «que es el procedimiento seguido por SAP2000»; y que son doce modos |
| 105 | §4.3 | reescrito: los nuevos −0.14 % / +0.22 % con sus tonf, **y la razón física** — W incluye la masa apoyada que no vibra (6.69 tonf, 1.88 % de W), la respuesta dinámica sólo moviliza la masa efectiva de cada modo; con Γ + CQC la diferencia baja del 2 % al 0.2 % |
| **NUEVO, tras el 99** | §4.2 | el párrafo de **alcance del contraste con ETABS** (abajo) |
| 122 (antes 121) | §4.5 | «superó **608 de 617** comprobaciones» (era 594 de 601, ya caduco) |
| 132 (antes 131) | §5 Conclusiones | «un cortante dinámico dentro del **0.22 %**» (era 2.2 %) |

Revisado y **sin cambios**: resumen (5), abstract (8) y el párrafo 125 de discusión — no citan el
cortante dinámico ni el marcador de la suite.

### ✅ El párrafo nuevo (§4.2) — lo que se iguala con ETABS y lo que queda inconcluso

Redactado como limitación del **contraste**, no como defecto de la plataforma, y sin nombrar
ingeniería inversa («opciones de modelado propias de ese programa y documentadas por él mismo»).
Las tres:

1. **Automallado.** ETABS: interpolación transfinita en paños rectangulares; *auto cookie cut at
   beams and walls* en los de comportamiento membrana, con la carga vertical a vigas y muros por
   área tributaria; y **los paños inclinados no se mallan** (quedan como un elemento equivalente).
   Hekatan reproduce nudo a nudo el paño recto (**25 nudos, 16 cáscaras**, los de ETABS) y también
   el de borde curvo; para paños con abertura o de contorno en L ETABS usa **otro mallador**
   (pavimentado por capas) que no se replica → **las mallas no son las mismas y el contraste
   queda inconcluso**.
2. **Edge constraint.** Activo por defecto en ETABS, desactivado en SAP2000: ata los nudos
   colgados sobre la arista de un paño contiguo cuando las mallas de los dos no coinciden. En los
   modelos analizados las mallas son conformes y la comprobación dio **efecto nulo**; sólo se
   podría cuantificar sobre mallas no coincidentes.
3. **Deck.** ETABS reparte la carga del paño de piso por su cuenta (área tributaria o un solo
   sentido); en Hekatan es una **directiva explícita** del modelo, no un comportamiento implícito.

Cierra diciendo que las tres afectan al alcance del contraste, no a la precisión del solver, y que
por eso la validación cuantitativa se establece frente a SAP2000.

**Fuentes** (todas del repo): `registros/2026-09-17_automesh_etabs_binario.md` (padre) §1–§4 ·
`registros/2026-09-17_automesh_transfinito.md` (curvo) · `registros/2026-09-17_automesh_pavimentador.md`
(hueco y L) · `hekatan-struct/docs/DEFAULTS_CSI.md` §«edge constraint» (el efecto nulo medido) ·
`hekatan-struct/CLAUDE.md` §«deck etabs».

### ✅ Validado y mirado

```
validate.py rev5.docx --original rev4.docx   →  Paragraphs: 309 → 310 (+1) · All validations PASSED!
soffice --convert-to pdf  +  pdftoppm        →  páginas 7, 8 y 9 revisadas a ojo
```
Tabla 3 con sus 6 filas y su formato; el párrafo nuevo en §4.2 con el mismo estilo justificado que
sus vecinos; conclusiones con el 0.22 %; numeración de tablas intacta (Tabla 2…6).

---

## ⚠️ Una diferencia con el enunciado, dicha a la cara

La orden decía escribir que Hekatan «no [malla] los paños con hueco o en L». **Ya no es cierto**:
la bitácora del pavimentador (misma noche, posterior a la del binario) los malla con una directiva
`area`/`hueco` propia, con las áreas exactas a 1e-14 y ΣRz = q·A. Lo que sí queda inconcluso es
**el contraste con ETABS en esa geometría**, porque ETABS usa ahí otro mallador y las mallas no
coinciden. El artículo dice eso, que es lo medido.

## ⏳ Pendiente

- Las **derivas dinámicas** siguen saliendo del estático equivalente; con `modalDisplacements` ya
  se podrían sacar del espectral por GDL (la Tabla 4 del artículo no cambia por eso).
- `deformCpp` aún no combina las fuerzas de ELEMENTO modo a modo (sólo cortante de base y
  desplazamientos).
- El 11.936 % del `automesh` y las dos filas de juez nuevas (8.425 %, 3.578 %) siguen fallando a
  propósito: son del elemento en singularidades y en curvo, no del mallador ni del espectral.
