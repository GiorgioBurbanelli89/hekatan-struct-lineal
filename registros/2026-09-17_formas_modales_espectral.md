# Formas modales φ en la salida del solver + espectral estilo SAP2000

Rama `sin-binario`. **Sin commit, sin deploy, sin cambio de rama, sin publicar.**
Juez: **SAP2000 24** — `validation/articulo-revista/sap_dual_sismo.json` (medido
14-sep-2026, misma malla nudo a nudo). **NO se abrió SAP2000 en esta sesión**: la
medida ya existía y es del mismo modelo.

Modelo: dual 2x2x4, malla 1.0 m, **545 nudos, 736 elementos**, NEC-15 Z=0.40,
suelo E, Costa, R=8, I=1, ζ=5 %, 12 modos, CQC.

---

## 1) ✅ Las formas modales YA salían — lo que faltaba era la ESCALA

`modal.cpp` ya devolvía `mode_shapes` (numModos × 6·nudos) y `modalCpp.ts` ya las
leía en `ModalOutputs.modeShapes`. Pero salen **normalizadas a máx = 1** («para el
visor», línea 1111 del original). Esa normalización **borra la masa
generalizada**, y sin ella no se puede montar

    uᵢ = Γᵢ · Sa(Tᵢ)/ωᵢ² · φᵢ

porque Γ = φᵀ·M·r depende de cómo esté escalado φ.

Lo que sí se perdía del todo era **Γ**: el motor lo calculaba (línea 1086) y sólo
devolvía `participation = Γ²/(M_gen·M_total)`, o sea el **ratio**, que pierde el
**signo** y la **escala absoluta**.

## 2) ✅ Añadido al solver (añadir, no cambiar)

`hekatan-fem/src/cpp/modal.cpp` — tres punteros de salida NUEVOS al final de
`modal(...)`, **con guarda `!= nullptr`**: los ~12 llamadores viejos
(`cli/*.mjs`, `cli/browser_limit/harness.js`, …) pasan menos argumentos, el wasm
los rellena con 0 y no se escribe nada. Nada de lo anterior cambia de forma ni de
significado.

| salida nueva | forma | qué es |
|---|---|---|
| `participation_factors` | [modo][6] | **Γ_mj = φᵀ·M·r_j** con φ masa-normalizado (φᵀMφ = 1). Con signo. |
| `total_mass` | [6] | M_total_j, la masa que PUEDE participar |
| `mode_scales` | [modo] | s_m tal que **φ_masa-normalizado = modeShapes[m] · s_m** |

`hekatan-fem/src/data-model.ts` → `ModalOutputs` gana `participationFactors`,
`totalMass`, `modeScales` (opcionales).
`hekatan-fem/src/modalCpp.ts` → reserva, pasa y lee los tres punteros.

## 3) ✅ El método espectral estilo SAP2000

`examples/src/shared/responseSpectrum.ts` — **se añade, el viejo no se toca**:

- `modalBaseShearsSAP(modal, exc, Sad, comp)` → cortante de CADA modo
- `baseShearSAP(modal, exc, Sad, {zeta})` → CQC de lo anterior
- `modalDisplacements(φ, escala, f, Γ, Sad)` → **uᵢ por GDL**, los desplazamientos
  del modo, que es lo que pedía la orden

La deducción (no es fórmula inventada, es equilibrio):

    uᵢ = Γᵢ,exc · Sa(Tᵢ)/ωᵢ² · φᵢ
    K·uᵢ = ωᵢ²·M·uᵢ        →  fuerza de inercia del modo fᵢ = ωᵢ²·M·uᵢ
    Vᵢ,k = rₖᵀ·M·uᵢ·ωᵢ² = Γᵢ,exc · Γᵢ,k · Sa(Tᵢ)      (reacción total de la base en k)
    V_k  = CQC sobre los modos de Vᵢ,k

## 4) ✅ LA MEDIDA — el juez es SAP2000

`node validation/articulo-revista/hekatan_espectral_sap.mjs` (nuevo; mismo
`buildEdificio` y mismo camino que `hekatan_cortante_derivas.mjs`).

| dir | VIEJO (tonf) | dif % | **NUEVO (tonf)** | **dif %** | SAP2000 (tonf) |
|---|---|---|---|---|---|
| X | 26.9872 | **+1.773 %** | **26.4804** | **−0.139 %** | 26.5172 |
| Y | 16.6877 | **+2.135 %** | **16.3743** | **+0.217 %** | 16.3389 |

**De ~2 % a ~0.2 %.** El error baja un orden de magnitud.

### ❌ La causa diagnosticada en la orden NO era la causa

La orden decía: «CQC sobre cortantes modales ≠ CQC sobre la respuesta por GDL,
los signos de los modos acoplados no se cancelan igual». **Medido, no es eso.**

Por equilibrio, la reacción de base del modo i vale Γᵢ,ₓ·Γᵢ,ₓ·Sa, que es un
cuadrado: el signo se pierde igual en los dos caminos, y las dos CQC coinciden.
Lo que fallaba era **el peso con el que se escalaba**:

    viejo:  Vᵢ = Sad(Tᵢ) · ratioᵢ · W          con W = Σ ρ·V = 356.2827 tonf
    nuevo:  Vᵢ = Sad(Tᵢ) · Γᵢ² · g             con Γ² · g = masa efectiva · g

y `ratioᵢ·W ≠ Γᵢ²·g` porque el **denominador del ratio es M_total del modal (la
masa LIBRE)** mientras que **W incluye la masa pegada a los apoyos**, que no se
mueve nunca:

```
W (Σ ρ·V)                = 356.2827 tonf   (SAP2000: 356.2827 — idéntico)
M_total·g   X / Y / Z    = 349.5910  349.5910  349.5910 tonf
peso que NO participa    =   6.6917 tonf  =  1.878 %
```

Y 1/(1 − 0.01878) = **1.01914**, que es justo lo que sobraba: 1.773 − (−0.139) =
**1.912 %** en X y 2.135 − 0.217 = **1.918 %** en Y. Cierra a la tercera cifra.
Es el MISMO error que ya se había cazado el 3-sep en el mezanine (M_total libre
vs masa total), sólo que allí se arregló el ratio y aquí seguía en quien lo
multiplicaba por W.

### ⏳ Lo que queda (0.14 % X, 0.22 % Y) y por qué

No es del método: es la diferencia de solver que ya estaba medida. Los periodos
difieren −0.30 % (modo 1), +0.44 % (modo 2), −0.27 % (modo 3)… y la participación
±0.1 punto. Con Sa en la meseta (T1, T2 < Tc) el periodo casi no mueve el
cortante, pero la **participación** sí. Los dos residuos tienen **signo distinto**
(−0.14 en X, +0.22 en Y), que es exactamente el patrón de los periodos (modo 1 de
X por debajo, modo 2 de Y por encima). No hay nada más que rascar sin tocar el
elemento.

### ✅ Regalo: las componentes CRUZADAS, que el método viejo no podía dar

Con Γ con signo salen las reacciones cruzadas, que el ratio (un cuadrado) nunca
podría dar:

```
Vy del caso SPECX = 0.8536 tonf      Vx del caso SPECY = 0.8536 tonf
```

(iguales por simetría del modelo — comprobación barata de que el signo entra bien).

## 5) ✅ WASM recompilado con el script del repo

`bash hekatan-fem/build_wasm.sh`

| | deform.wasm | deform.js |
|---|---|---|
| ANTES | `8bbca81a43edae61c0a765f9ea0b5fe992702565` (834 489 B) | `6838579d0c0963c6bdee421be8397841b2cb248a` |
| DESPUÉS | `a2fd60c2c721e26445efe7e13368f360e72cf393` (1 136 064 B) | `0f28e1da91b00c6b08458099433a9b918865d4d5` |

⚠️ El `.wasm` **crece un 36 %** y eso NO es por las 3 salidas nuevas: el binario
que había se compiló con el `build` de `package.json` (sin `-fexceptions`), y
`build_wasm.sh` —el script documentado, el que manda la orden— sí lo lleva. Se
deja anotado porque es un cambio de bandera, no de código. La suite lo valida.

## 6) ✅ npm test — sin regresión

| | marcador | fallos |
|---|---|---|
| ANTES (registro de hoy, `2026-09-17_shellthick_wilson.md:228`) | 594/601 | 7 |
| **DESPUÉS (medido, 276.7 s)** | **594/601** | **7** |

Los 7 son **exactamente los mismos de antes**, dígito a dígito:

```
automesh: los 25 nudos contra ETABS              11.936 %  (limite 0.00 %)
placa flexible: NODAL vs SAFE muelle de area      3.210 %  (limite 1.50 %)
consistente: Python vs TS/WASM, 25 nudos          5.940 %  (limite 0.00 %)
nodal: Python vs TS/WASM, 25 nudos                6.165 %  (limite 0.00 %)
colgado: Python vs TS/WASM, 8 nudos               6.888 %  (limite 0.00 %)
joints M11/M22/M12 vs SAP2000 (AreaForceShell)   43.109 %  (limite 0.10 %)
M11 en el nudo central vs SAP2000                -2.936 %  (limite 0.10 %)
```

**No se subió ningún límite.** Esto además valida el cambio de banderas del §5:
con `-fexceptions` los 594 siguen dando lo mismo.

## 7) ⏳ Pendiente / decisión de Jorge

- El método nuevo **NO se ha puesto de defecto**: `testM.ts` y
  `hekatan_cortante_derivas.mjs` siguen con el viejo, para poder comparar.
  **Recomendación: sí, que pase a defecto** (de 2 % a 0.2 % contra SAP2000).
- Falta llevarlo a la UI (`panelEspectral.ts`) y a las **derivas dinámicas**: hoy
  las derivas salen del estático equivalente; con `modalDisplacements` ya se
  pueden sacar del espectral por GDL.
- Falta que `deformCpp` combine las fuerzas de elemento modo a modo (hoy sólo
  está el cortante de base y los desplazamientos).
