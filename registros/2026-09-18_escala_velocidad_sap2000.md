# La animación modal con la escala y la velocidad de SAP2000 · 18-sep-2026

Rama `sin-binario`. **Sin commit, sin deploy.** Motor FEM sin tocar (nada de
`modal.cpp`, nada de recompilar el WASM): esto es **solo visor**.

Encargo de Jorge: «que el número sea el mismo que SAP2000; revisa el binario para
que tanto la VELOCIDAD como la DEFORMADA VISUAL sean iguales».

Regla de método: **extraer del binario, no fabricar**; y si el binario calla,
medir contra el programa corriendo.

---

## ✅ 1 · LO QUE SÍ DICE EL BINARIO DE SAP2000

`SAP2000.exe` v24.1.0 (84 MB) es **.NET ofuscado con Dotfuscator**: los tipos se
llaman `?`, `d`, `ᥑ`… pero los miembros públicos **conservan el nombre**. Con eso
se localizan los tipos por metadatos (`System.Reflection.Metadata`) y se
decompilan uno a uno con `ilspycmd` — no hizo falta decompilar los 84 MB.

| qué | dónde |
|---|---|
| el temporizador que anima | `CSI.SAP2000.ChildForm.AnimationTimer_Tick` (SAP2000.exe) |
| el motor de la animación | `CSI.SAP2000.cAnimate` (SAP2000.exe) |
| el estado de cada ventana | `CSIMDIForm.SAP2000Form.WINDOWSTATEARRAY` (**SAPSharedStructures.dll**, sin ofuscar) |
| el diálogo Display ▸ Deformed Shape | `SAP2000UI.DisplayDeformedShapeViewModel` (**SAP2000 UI.dll**, sin ofuscar) |

### 1.1 · Cuántos fotogramas: **7**

`SAP2000 UI.dll`, `DisplayDeformedShapeViewModel`:

```csharp
public enum eSingleStepIncrementType {
    [cDescription("1 (90 degrees)")]  …
    [cDescription("2 (45 degrees)")]  …
    [cDescription("3 (30 degrees)")]  …      // ← el que sale en pantalla
    [cDescription("4 (22.5 degrees)")] …
    [cDescription("5 (18 degrees)")]  …
    [cDescription("6 (15 degrees)")]  …
}
…
SavedSingleStepIncrementType = eSingleStepIncrementType.Three30Deg;   // ← EL DEFECTO
SavedScalingType             = eScalingType.Auto;                     // ← Scaling = Automatic
```

Y `SAP2000.exe`, `cAnimate.GetNumberRequiredFrames` traduce ese 3 a un número de
cuadros (rama «no Positive Only»):

```csharp
switch (…AnimationSingleStepIncrementType) {
    case 1: return 3;   case 2: return 5;   case 3: return 7;
    case 4: return 9;   case 5: return 11;  case 6: return 13;
}
```

→ incremento **3 = 30° = N = 7 cuadros**. Cuadra con la captura del diálogo que ya
estaba en disco (`capturas_v3/_v4_sap_dlg_m1.png`): **«Cyclic Increments: 3 (30
degrees)»**, «Single Step», «Positive Only» sin marcar, «Scaling: ● Automatic».

### 1.2 · Qué amplitud tiene cada cuadro: un **coseno**

`cAnimate.StartAnimationDefForGDI` (y su gemela para DirectX):

```csharp
// rama normal (Positive Only sin marcar)
escala = Math.Cos((num2 - 1) / (NumberOfAnimationFrames - 1) * Math.PI) * SF;
```

Con N = 7 → fases 0°, 30°, 60°, 90°, 120°, 150°, 180°, o sea
**cos = 1, 0.866, 0.5, 0, −0.5, −0.866, −1**. Es un seno puro, igual que Hekatan.

### 1.3 · Cómo se recorren: **ping-pong, 12 ticks por ciclo**

`ChildForm.AnimationTimer_Tick` sube de 1 a N y baja de N a 1 (`AniInc` cambia de
signo al tocar `±NumberOfAnimationFrames`). Con N = 7: 1…7 y 6…2 = **12 ticks por
ciclo completo**.

### 1.4 · Cuánto dura cada tick — **y el hallazgo que contesta a Jorge**

`cAnimate.SetTimerInterval`, rama `AnimationType == 0` (la cíclica, la del modal):

```csharp
int num = 1100;                         // ms
double num2 = 16.666666666666668;       // 50/3
double num3 = Math.Max(…speed, 0);      // la barra de la barra de estado
if (num3 > 50.0) num3 = 50.0 + 4.0 * (num3 - 50.0);
double num4 = 2.0 * num2 / (num3 + num2);
childForm.AnimationTimer.Interval = (int)Math.Round(num * num4 / (numberOfAnimationFrames - 1));
```

Y el defecto de `speed`, en `SAPSharedStructures.dll`,
`WINDOWSTATEARRAY` (método de inicialización): **`m_speed = 0;`**
(solo lo cambia `MainForm.hsbSpeed_Scroll`, es decir arrastrando la barra).

Con `speed = 0`:

$$\text{num4}=\frac{2\cdot 50/3}{0+50/3}=2 \qquad
\text{Interval}=\operatorname{round}\!\Big(\frac{1100\cdot 2}{7-1}\Big)=367\ \text{ms}$$

$$T_{\text{anim}} = 12 \times 367\ \text{ms} = \mathbf{4.40\ s\ por\ ciclo}$$

Nótese que `Interval · (N−1) = 1100 · num4`: **el periodo no depende de N**, solo
de la barra de velocidad. Y, sobre todo:

> **En ninguna parte de ese cálculo entra la frecuencia ni el periodo del modo.**
> SAP2000 anima el modo 1 (T = 0.484 s) y el modo 3 (T = 0.155 s) **a la misma
> velocidad en pantalla**. Esto sale del binario, no de una suposición.

### ❌ 1.5 · Lo que el binario NO reveló: el factor de escala «Automatic»

El diálogo solo guarda `eScalingType.Auto` y **lee** el número ya calculado
(`CallBackDefinitions.GetCurrentDisplayDeformedShapeScaleFactor(ref scaleFactor)`,
`DisplayDeformedShapeViewModel`). El cálculo en sí vive en el código **ofuscado**
de `SAP2000.exe` (la escala global que `cAnimate` lee como `…᜕`), y **no se
consiguió aislar**. Tampoco lo enseña la interfaz: en las tres capturas de diálogo
que había en disco la casilla «User Defined» está **vacía** con «Automatic»
marcado.

**Así que la amplitud NO se sacó del binario. Se midió.** (Si algún día hace
falta el número exacto: abrir SAP, aplicar con Automatic y reabrir el diálogo —
el ViewModel vuelca ahí el factor calculado.)

---

## ✅ 2 · LA MEDIDA SOBRE SAP2000 CORRIENDO (lo ya grabado)

Fuente: `hekatan-school/VIDEOS/cpp06_cortante_modal_espectral/capturas_v3/v3_sap_modo1_animado.mp4`
(24 capturas de pantalla de SAP2000 animando el modo 1 del dual `test-m-dual`;
modelo 10 × 10 m en planta, 4 pisos × 3 m = 12 m de alto).

### 2.1 · La confirmación de que el binario decía la verdad

De los 24 fotogramas salen **exactamente 7 imágenes distintas** — los 7 cuadros
precalculados de §1.1 — y la secuencia es el ping-pong de §1.3.

Midiendo el centro de la cubierta (media de las dos esquinas extremas del rombo
del techo) en cada una de las 7:

| imagen | desviación en x (px) | esperado = 19·cos |
|---|---|---|
| F1 | **+19.0** | +19.00 |
| F2 | +16.5 | +16.45 |
| F3 | +9.5 | +9.50 |
| F4 | +0.5 | 0 |
| F5 | −9.0 | −9.50 |
| F6 | −16.5 | −16.45 |
| F7 | **−19.0** | −19.00 |

Clava el coseno de §1.2. Y el **punto más bajo del modelo no se mueve ni un
píxel** (x = 960.5 en las 7): la base está empotrada, la medida no tiene deriva.

### 2.2 · De píxeles a metros

La diagonal de planta (10 √2 = 14.142 m) sale **horizontal** en la vista 3-D por
defecto de CSI (las dos esquinas laterales están en la misma y = 322) y mide
**557 px** → **s = 39.386 px/m** sin escorzo. El eje X está a 45° de esa diagonal,
así que 1 m de desplazamiento en X son 39.386 · cos45° = **27.85 px** en pantalla.

$$A_{\text{SAP}} = \frac{19.0\ \text{px}}{27.85\ \text{px/m}} = \mathbf{0.682\ m}$$

Sobre un edificio de 12 m de alto y 18.547 m de diagonal 3-D
($\sqrt{10^2+10^2+12^2}$):

| referencia | fracción |
|---|---|
| altura (12 m) | **5.68 %** |
| diagonal 3-D (18.547 m) | **3.68 %** |

El modo 1 es 83.5 % Ux y 0.05 % Uy, o sea traslación casi pura en X: no hay que
descontar componentes fuera del plano.

### ❌ 2.3 · El periodo NO se puede medir en esos vídeos

Los PNG se tomaron con `time.sleep(0.15)` **más** una captura de pantalla entera
de 2560×1600 por cuadro (`validation/articulo-revista/_v4_sap_animar.py`), o sea
a un ritmo irregular de ~0.3–0.8 s que no tiene nada que ver con los 367 ms del
temporizador de SAP. El mp4 resultante se montó a 8 fps fijos. **Cualquier
«periodo» medido sobre ese vídeo es alias, no es el de SAP.** Por eso el periodo
se toma del binario (§1.4), que sí lo dice exacto.

---

## ✅ 3 · QUÉ SE CAMBIÓ EN HEKATAN (solo visor)

`examples/src/shared/animateMode.ts`:

| | antes | ahora | de dónde sale |
|---|---|---|---|
| amplitud | `scalePercent = 5` (% de la diagonal 3-D) | **3.7** | medido sobre SAP corriendo (§2) |
| velocidad | `visFreq = clamp(f/f₁, 0.5, 3)` Hz | **`periodoVisible = 4.4` s/ciclo, igual para todos los modos** | leído del binario (§1.4) |

Las dos siguen siendo opciones: `scalePercent: 5` y `velocidadPorFrecuencia: true`
devuelven exactamente lo de antes, y los comentarios del fichero llevan la cita y la
medida que respaldan cada número.

`examples/src/workspace/main.ts`: se quitan los dos `scalePercent: 5` clavados a
mano (líneas ~6680 y ~8468) para que mande el defecto.
`runExampleStandalone.ts` ya usaba el defecto y no hubo que tocarlo.

**Nada de `modal.cpp`, nada de recompilar WASM.** El WASM de disco no se tocó.

### La cuenta de la amplitud, en algebraico y luego en números

El animador dibuja, en el nudo de máximo φ,

$$A_{	ext{Hekatan}} = rac{p}{100}\,D \qquad	ext{y en la cubierta}\qquad
A_{	ext{cub}} = rac{p}{100}\,D\,rac{|arphi_{	ext{cub}}|}{|arphi|_{\max}}$$

Medido en el navegador sobre `test-m-dual` (545 nudos):
$D = 18.5472$ m, $|arphi|_{\max} = 1.00096$, $|arphi_{	ext{cub}}| = 0.97812$
(media de los **121** nudos de cubierta) ⇒ la cubierta se mueve **0.18124 m por cada
1 %**. Igualando a los 0.682 m de SAP:

$$p = rac{0.682}{0.18124} = 3.76\ \% \quad\longrightarrow\quad 	extbf{3.7 \%}$$

(3.7 y no 3.76 porque la medida de SAP vale ±19.0 ± 0.5 px, o sea ±2.6 %.)

⚠️ **Trampa en la que se cayó por el camino**: leer la caja del modelo
(`nodes.rawVal`) con la animación CORRIENDO da una diagonal inflada (salió 18.59,
18.65, 18.94 y 18.86 en cuatro pasadas del mismo modelo) porque los nudos ya están
desplazados. `animateMode.ts` NO tiene ese fallo — mide sobre `trueOriginalNodes` —
y se comprueba: el animador publica `amp = 0.68559`, que exige
$18.545 \cdot 0.037 / 1.00096$, la diagonal **verdadera**. El fallo era del guion de
medida, no del producto.

---

## ✅ 4 · LA COMPARACIÓN VISUAL

Guion nuevo: `validation/articulo-revista/_v6_fases_sap.mjs`. Dibuja Hekatan en **las
mismas 7 fases que SAP** (`showStaticPhase` con `cos(kπ/6)`), que es la única forma de
comparar «el mismo instante del ciclo»: grabando contra la animación viva la captura
tarda más que un cuadro y las fases salen a capricho (así se grabaron los v3/v5).

| | `_v6_hoja_7fases_sap_vs_hekatan.png` | las 7 fases, SAP arriba y Hekatan abajo |
|---|---|---|
| | `_v6_hoja_amplitud_sap_vs_hekatan.png` | las dos fases EXTREMAS superpuestas (rojo cos +1, verde cos −1), **a la misma escala px/m** en los dos |

La escala común sale de la diagonal de planta (14.142 m), que en las dos vistas iso
de 45° queda horizontal y sin escorzo: 596 px en SAP y 503 px en Hekatan.

### Los números de los dos

| | SAP2000 24 | Hekatan Struct | dif. |
|---|---|---|---|
| amplitud en la cubierta | **0.682 m** (±19.0 px / 27.85 px·m⁻¹) | **0.670 m** (0.68559 · 0.97812) | **1.8 %** |
| amplitud del nudo máximo | — (no se puede leer) | 0.6856 m | — |
| como % de la altura (12 m) | 5.68 % | 5.58 % | |
| como % de la diagonal 3-D | 3.68 % | 3.70 % | |
| fotogramas por ciclo | 7 distintos, ping-pong de 12 | continuo (seno) | |
| periodo | **4.40 s**, igual en los 3 modos | **4.40 s**, igual en todos | 0 % |
| antes del cambio | — | 0.911 m y 1.00 s (modo 1) | +34 % y ×4.4 |

### ⏳ Lo que se vio de paso y NO se arregló (no es del encargo)

En la hoja de Hekatan, entre una fase y otra **se mueven también la rejilla del suelo
y los apoyos**, que son fijos: la cámara/rejilla se re-encuadra al reescribir
`mesh.nodes`. Está también en la captura del estado **ANTERIOR** (`overlay_antes`),
así que **no lo trajo este cambio**; queda anotado.

---

## ✅ 5 · MARCADORES

- `npx tsc --noEmit -p examples/tsconfig.json`: **166 errores con el cambio y 166 sin
  él** (comprobado con `git stash` de los dos ficheros y recuento). **Cero nuevos.**
  Son los de siempre de este tsconfig (`module` no permite `import()` dinámico) y
  ninguno cae en `animateMode.ts`.
- `npm test`: **634/643 en 368.3 s**. Es EXACTAMENTE la marca de la base de ayer
  (634/643 en 347 s, con sus 9 fallos conocidos): **cero comprobaciones nuevas
  falladas**. Los 21 s de más son el muestreo largo del punto siguiente.
- `node tests/run.mjs animacion` → **21/21 en 80.4 s** con el ciclo de 4.4 s:
  «oscila» da `amp min/max = 0.089 · signos +−` y «amplitud estable» 0.9950 /
  0.9967 / 0.9784. Sin el arreglo del muestreo, esas dos reprobarían.
- Ajuste necesario en el arnés, sin tocar límites: `tests/lib/visor_modal.mjs`
  muestreaba el ciclo durante `muestras · 110 ms` ≈ 2 s. Con el ciclo de SAP (4.4 s)
  eso es MEDIO ciclo y, según la fase de arranque, el seno no cambia de signo: las
  comprobaciones «oscila» y «amplitud estable» reprobarían a un visor correcto. Ahora
  `dt` se calcula solo (`5300 / muestras`) para cubrir un ciclo entero.
  `cli/check_animacion_modal.mjs` pasa a `muestras: 10` sin `dt`.

## Ficheros

```
examples/src/shared/animateMode.ts                       scalePercent 5→3.7, periodoVisible 4.4
examples/src/workspace/main.ts                           fuera los dos scalePercent: 5
tests/lib/visor_modal.mjs                                dt automático = un ciclo entero
cli/check_animacion_modal.mjs                            idem
validation/articulo-revista/_v6_fases_sap.mjs            NUEVO: las 7 fases de SAP en Hekatan
validation/articulo-revista/_v6_hoja_amplitud_*.png      la comparación que se mira
validation/articulo-revista/_v6_hoja_7fases_*.png
validation/articulo-revista/_v6_fases/                   los 7 PNG de Hekatan
validation/articulo-revista/_v6_num_modo1.json           los números del modo
```
