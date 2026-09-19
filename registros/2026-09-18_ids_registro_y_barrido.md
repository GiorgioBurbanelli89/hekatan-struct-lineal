# Pendientes cerrados: los 37 ids y el barrido

Rama `sin-binario`. **Sin commit, sin deploy.** Motor FEM sin tocar.
Sigue a `registros/2026-09-18_test_animacion_modal.md`.

---

## ✅ 1. Qué eran los 37 ids: NO estaban perdidos, estaban SIN REGISTRAR

Jorge tenía razón: son del FEM Studio / CAD Studio viejo. Y hay una sorpresa
buena — **la mayoría ya están portados al esquema de hoy**.

`examples/src/shared/moreExamples.ts` (786 líneas) tiene **21 `ExampleDef`
completos** —`params` + `build` + `runModal`, hechos con `makeSimpleExample`—
con exactamente esos ids. El fichero **no lo importaba NADIE**: era código
muerto, y por eso `?t=arco` no cargaba. No hay que portar nada: hay que
REGISTRARLOS. Lo dejó dicho el propio repo y nadie lo remató:

> `legacyAwatif.ts:75` — «⚠️ "diagrid" y "pergola" también existen paramétricos
> en shared/moreExamples.ts (18 ejemplos que NO están en el registry)»

### Los 37, clasificados

| grupo | cuántos | ids | veredicto |
|---|---|---|---|
| **A · ya portados, sin registrar** (`shared/moreExamples.ts`) | **19** | arco · burj · col-placa · edif-acero-diag · edif-mixto · edif-muros · eiffel · losa-plana · losa-rect · muro-contencion · muro-q4 · opera · placa-orificios · placa-xy · puente · talud · twisted · viga-alta · viga-q4 | **portable fácil** |
| **B · capítulos del TUTORIAL** (`examples/src/tutorials/tutorialContent.ts`) | 10 | beam_3d · boundary_conditions · intro_fem · modal_analysis · property_modifiers · shape_functions · shell_q4 · static_analysis · stiffness_bar · stiffness_beam | **no son ejemplos** |
| **C · no son ejemplos** | 5 | 1st-floor · 2nd-floor (capas del CAD, `src/drawing/`) · nuevo · releases (órdenes del cliModeler) · assembly (paso de `fem-explained`) | **no aplica** |
| **D · `ExampleDef` huérfanos con carpeta sana** | 2 | `plate-thick-validacion` · `benchmark-steel-beam` | **portable trivial** |
| **E · página suelta** | 1 | `workspace_existent` | **no aplica** |

### Grupo D, con el commit culpable

- **`plate-thick-validacion`** (`examples/src/plate-thick-validacion/`) SÍ estuvo
  registrado. Lo quitó el commit **`6c1d26131`** «Conexiones precalificadas AISC
  358-22: BFP (§7) + End Plate 4E/4ES/8ES» (25-abr-2026), que en el mismo diff
  borró `plateThickValidacion` y `conexionRbs` del array. `conexionRbs` se
  repuso; éste no. **Colateral, no decisión.**
- **`benchmark-steel-beam`** (`examples/src/benchmark-steel-beam/`) nunca estuvo
  (`git log -S` no da ni un commit). Se escribió y se olvidó registrarlo.

Cambio exacto para los dos, si Jorge lo quiere (2 líneas cada uno, **NO aplicado**):

```ts
// examples/src/workspace/exampleRegistry.ts
import { plateThickValidacion } from "../plate-thick-validacion/plateThickValidacion";
import { benchmarkSteelBeam }   from "../benchmark-steel-beam/benchmarkSteelBeam";
// … y en el array:
  plateThickValidacion,
  benchmarkSteelBeam,
```

---

## ✅ 2. Portado UNO como prueba: `arco`

Registrado en `exampleRegistry.ts` (import + entrada en el array). Medido con
puppeteer contra el bundle local:

| comprobación | resultado |
|---|---|
| carga por `?t=arco` | 21 nudos · 20 barras · 0 errores de página |
| resuelve | 21 desplazamientos, flecha máx **0.1313 m** |
| **equilibrio** | **ΣRz = 199.99999999995 kN** contra los 200 kN aplicados |
| modal | 12 modos |
| **animación (el test nuevo)** | `cos(dibujo, φ) = 1.000000` · exceso vs Dead 7.6e-15 · **✅** |

### ⚠️ Lo que costó, y es el aviso para los otros 20

Al registrarlo, `npm test` pasó de 634/643 a **633/643**. El caso
`categorias-arbol` lo cazó:

```
FALLA el tipo de elemento declarado = el MEDIDO   1.000 %  (limite 0.00 %)
  arco: dice "4️⃣ Mixtos" y tiene 20 barras / 0 cáscaras / 0 sólidos → 1️⃣ Frames
```

La raíz del árbol es el TIPO DE ELEMENTO, no el tema. `arco` decía «4️⃣ Mixtos ·
🌉 Puentes e icónicos» y son 20 barras en el plano XZ → **«1️⃣ Frames · 🎯 3 GDL
Pórtico plano»**. Corregido, y `npm test` vuelve a 634/643.

**Y no es el único.** Las categorías de `moreExamples.ts` son de la época vieja.
Medido fichero en mano, de los 21:

- **4** con la raíz `🗽 Icónicos`, que YA NO EXISTE: burj, twisted, diagrid, opera.
- **10** con `🧱 Losas y cáscaras`, otra raíz muerta: losa-rect, viga-alta,
  muro-contencion, muro-q4, viga-q4, col-placa, placa-orificios, placa-xy,
  losa-plana, talud.
- **3** con `4️⃣ Mixtos · 🌉 Puentes e icónicos` a revisar por tipo de elemento
  (eiffel, puente, pergola) — es la que le falló a `arco`.
- **4** (`edif-acero-diag`, `edif-muros`, `edif-mixto`, `opera`) son
  `...edificioAporticado` con `params` cambiados: heredan su categoría, hay que
  mirarla igual.

### Plan para los otros 20 — **NO aplicado, Jorge decide**

Unos 10 min cada uno: import + entrada en el array + categoría a la taxonomía de
hoy + `node cli/check_animacion_modal.mjs <id>` + `node tests/run.mjs categorias`.
Total estimado: **media jornada** para los 20, más los 2 del grupo D. De más
barato a más caro:

1. **Trivial** (barras puras, como `arco`): eiffel, puente, twisted, burj.
2. **Fácil** (Q4 de una pieza): muro-q4, viga-q4, placa-xy, losa-plana, losa-rect,
   viga-alta, col-placa, placa-orificios, muro-contencion, talud.
3. **Con cuidado** (heredan de `edificioAporticado`, arrastran sus params):
   edif-acero-diag, edif-muros, edif-mixto, opera.
4. **Choque de id**: `diagrid` y `pergola` — hay un `legacy(...)` registrado con
   el MISMO id que abre la página standalone. Hay que quitar los dos stubs en la
   misma tacada, o `?t=diagrid` se queda en blanco (ya pasó el 6-sep-2026, está
   anotado en `legacyAwatif.ts:76`).

---

## ✅ 3. `_ids.txt` generado desde el registro

**`cli/gen_ids_deploy.mjs`** (nuevo): lee `window.__hekatanExamples` del bundle
local y reescribe `cli/shots/deploy/_ids.txt`. Con `--ver` solo enseña el diff.

Ese fichero se escribió UNA vez a mano el 9-sep (commit `5c6d1fbc3`) y no se
tocó más. Lo que cambió:

- **140 → 144 líneas.**
- **SALEN 36**: los grupos B, C, D y E de arriba — no son ejemplos del workspace,
  `?t=<id>` no carga ninguno. Se prueban con sus propios arneses
  (`ctl_deploy_cad`, los tutoriales), no con éste.
- **ENTRAN 40 ejemplos REALES que la lista no miraba**: `gateway-arch`,
  `burj-khalifa`, `cable-stayed-bridge`, `slope-stability`, `sydney-opera`,
  `twisted-tower`, `shear-wall-q4`, `cantilever-beam-q4`, `placa-cantilever-q4`,
  `muro-contencion-solido`, `bulbo-presiones-suelo`, `solid-cube-fem`,
  `placa-base-h` / `-hueca` / `-cft`, `columna-cft-h8`, `conexion-diafragma-cft`,
  `tablero-puente`, `viga-doble-t`, `bolt-hole-detail`, `slab-designer`,
  `ifc-viewer`, `calc-editor`, `cad-editor`, `report`, `drawing`, `fem-explained`
  y los legacy de awatif.
- Y `arco`, recién registrado.
- **Con modal: 57** de los 144.

⚠️ Eso quiere decir que **el barrido del deploy (`check_deploy_bugs.mjs`) llevaba
desde el 9-sep sin mirar 40 ejemplos**, y gastando tiempo en 36 páginas que no
existen. Ojo: esos ids de más no son un adorno, son el 25 % de la lista.

---

## Barrido de la animación modal — tabla

**31 ejemplos medidos en esta tanda, 0 fallos.** Ninguno dibuja otra cosa que φ,
y ninguno se queda con el colormap sucio.

| id | nudos | modos | cos(dib, φ) | cos(dib, Dead) | veredicto |
|---|---|---|---|---|---|
| `W1_barra_axial` | 4 | 8 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_axial_cantilever` | 2 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_axial_composite_cantilever` | 2 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_axial_composite_encased_cantilever` | 2 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_axial_concrete_cantilever` | 2 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_flexion_composite_encased_cantilever` | 11 | 6 | 1.000000 | **0.9997** | ✅ |
| `W2_viga_flexion_composite_slab_cantilever` | 11 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_flexion_concrete_cantilever` | 11 | 6 | 1.000000 | 0.0000 | ✅ |
| `W2_viga_flexion_steel_cantilever` | 11 | 6 | 1.000000 | 0.0000 | ✅ |
| `benchmark-cft-cantilever` | 11 | 3 | 1.000000 | 0.0000 | ✅ |
| `benchmark-concrete-cantilever` | 11 | 3 | 1.000000 | 0.0000 | ✅ |
| `benchmark-paz-10-7` | 5 | 4 | 1.000000 | **0.9992** | ✅ |
| `benchmark-paz-11-1` | 3 | 3 | 1.000000 | 0.0000 | ✅ |
| `benchmark-paz-12-1` | 3 | 6 | 1.000000 | **1.0000** | ✅ |
| `benchmark-paz-13-1` | 5 | 6 | 1.000000 | 0.7074 | ✅ |
| `benchmark-paz-7-1` | 6 | 4 | 1.000000 | 0.0000 | ✅ |
| `benchmark-paz-9-3` | 10 | 6 | 1.000000 | 0.0000 | ✅ |
| `benchmark-safe-ex01-plate` | 81 | 12 | 1.000000 | **0.9997** | ✅ |
| `benchmark-safe-ex04-plate-beams` | 81 | 12 | 1.000000 | **0.9992** | ✅ |
| `benchmark-steel-cantilever` | 11 | 3 | 1.000000 | 0.0000 | ✅ |
| `cerramiento` | 8 | 8 | 1.000000 | 0.0000 | ✅ |
| `cli-modeler` | 4 | 12 | 1.000000 | 0.0000 | ✅ |
| `edif-acero` | 1368 | 15 | 1.000000 | 0.0000 | ✅ |
| `edificio-acero-v2` | 1332 | 15 | 1.000000 | 0.4392 | ✅ |
| `edificio-aporticado` | 36 | 15 | 1.000000 | 0.4625 | ✅ |
| `edificio-comparativa-fem` | 64 | 15 | 1.000000 | 0.4799 | ✅ |
| `edificio-con-losa` | 1332 | 15 | 1.000000 | 0.0652 | ✅ |
| `edificio-con-muros` | 3981 | 24 | 1.000000 | 0.6048 | ✅ |
| `edificio-dual` | **6605** | 30 | 1.000000 | 0.5505 | ✅ |
| `edificio-frame-nec` | 72 | 12 | 1.000000 | 0.0000 | ✅ |
| `edificio-hormigon` | 1332 | 15 | 1.000000 | 0.0652 | ✅ |

Más las **8 plantillas** (`tipo` 0..7), `test-m-dual` y `arco`, medidos aparte,
todos ✅ → **41 modelos distintos, 0 fallos.**

Las filas en negrita de `cos(dib, Dead)` (0.9992 · 0.9997 · **1.0000** en
`benchmark-paz-12-1`) siguen demostrando lo mismo: en un voladizo o en una placa
apoyada, **el modo 1 y la deformada de gravedad son casi el mismo vector**. Un
límite fijo «coseno con Dead ≤ 0.2» habría reprobado a cinco ejemplos sanos. El
**exceso** sobre φ da 1e-15 en todos.

### Además: 13 `sin-modal` y 12 `sin-registro`

`sin-modal` = el registro dice `hasModal: false`, no se abren (es un dato, no un
aprobado). `sin-registro` = ids viejos de `_ids.txt`, ya arreglado al
regenerarlo.

### ⏳ Lo que falta del barrido

Quedan ~25 ejemplos con modal por detrás de `edificio-hormigon` (galpón,
membrana, mesa-torsión, placas, muros, zapatas, `test-m-*`, torre, cercha…).
Se paró ahí porque:

- ❌ **El tope de reloj por modelo NO funcionó.** Se le puso `--tope 240`
  (`Promise.race` con un `setTimeout`) y aun así `edificio-dual` estuvo **~50 min**
  antes de devolver su medición —buena, pero 50 min—. Lo que se pasa de tiempo no
  parece ser la medición sino el `cerrarYAbrir()` (relanzar Chrome) o la carga de
  la página; el reloj no las corta. **Hay que arreglarlo antes de la siguiente tanda.**
- Con la máquina descargada un modelo suelto son 20-30 s; encadenados se van a
  minutos. Se sigue por tandas:
  `node cli/check_animacion_modal.mjs --desde 55 --hasta 80`

---

## ✅ Marcadores

- `npm test` → **634/643 en 409 s**. Igual que la base: **+0 fallos nuevos** con
  `arco` registrado. Sin subir un solo límite.
- `node tests/run.mjs categorias` → **3/3**, los 144 del registro.
- `node cli/check_animacion_modal.mjs arco` → **✅**.
- `node tests/run.mjs animacion` → **21/21**.
