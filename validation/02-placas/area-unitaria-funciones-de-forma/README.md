# El método del ÁREA UNITARIA: leer las funciones de forma de un programa cerrado

La reconstrucción por flexibilidad (**método de la carga unitaria**,
`../celda-12x12-vs-csi/`) da la matriz de **rigidez**, o sea `∫BᵀD B·detJ`. Eso
**no ve las funciones de forma**: solo sus derivadas, y metidas dentro de un
producto con la constitutiva.

El área unitaria sí las ve, y directamente. Se empotran los **cuatro** nudos, se
pone una presión uniforme `q = 1` sobre el elemento y se leen las **reacciones**:

    f = ∫ Nᵀ q dA        con q = 1   →   fᵢ = ∫ Nᵢ dA

* las componentes de `w` dan `∫Nᵢ dA` — **las funciones de forma, integradas**;
* las de `θx` y `θy` dicen si el elemento reparte **momentos** nodales. Un
  Mindlin **bilineal** no reparte ninguno (la presión solo trabaja contra `w`);
  un Kirchhoff discreto tipo DKQ **sí**, porque su `w` no es bilineal. Es lo que
  separa las dos familias por caja negra.

## Autocontroles del ensayo

* `Σf_w = q·A` **exacto** — si no sale, la medida está mal y no vale compararla.
* El mismo cuadrado con `t = 0.02` y con `t = 0.20`: **el reparto no puede
  depender del espesor**. Si depende, hay algo colándose (peso propio, o la
  carga aplicada en otra dirección). Por eso el material va con
  `SetWeightAndMass` a **cero en las dos vías**.
* Las geometrías **distorsionadas** son las que informan: en cuadrado,
  rectángulo y paralelogramo el reparto es `0.25` para cualquier formulación y
  no distingue nada.

## RESULTADO — las `N` son idénticas, `1e-16`

12 casos (6 geometrías × thin/thick), ETABS 22:

| geometría | ETABS (thin **y** thick) | Hekatan | ‖Δf‖/‖f‖ |
|---|---|---|---|
| cuadrado · rectángulo · paralelogramo | `0.250000` ×4 | igual | `2e-16` |
| **trapecio** | `0.273163 · 0.262513 · 0.226837 · 0.237487` | igual dígito a dígito | `5.2e-16` |
| **irregular** | `0.242208 · 0.245378 · 0.257792 · 0.254622` | igual | `3.0e-16` |
| cuadrado t=0.02 | `0.250000` ×4 | igual | `4.5e-16` |

**Momentos nodales: `0.00000e+00` exacto en los 12 casos**, thin y thick. Y
**thin y thick reparten idéntico** entre sí (`0.000e+00`).

Conclusiones:

1. La `N` de CSI es la **bilineal estándar**, en las dos formulaciones.
2. La nuestra es la misma, y también en geometrías distorsionadas — lo que
   valida además el **jacobiano dentro de la integral**.

## ⚠️ QUÉ mide exactamente (corregido)

La primera lectura de este ensayo fue: «sus `N` son bilineales, luego su `w` no
es enriquecida». **Eso es ir demasiado lejos.**

Lo que se mide es la `N` con la que el programa **reparte la carga**, que no
tiene por qué ser la del **campo de desplazamientos** de la formulación. Un DKQ,
por ejemplo, **no interpola `w` en absoluto** —es discreto, solo tiene `B`— y
aun así reparte una presión con las bilineales. Y de hecho aquí el Thin (que
está confirmado como DKQ a 1e-15) reparte exactamente igual que el Thick.

Lo que este ensayo prueba, entonces:

* **repartimos la carga igual que CSI**, hasta 1e-16 y también en geometrías
  distorsionadas (lo que valida el jacobiano dentro de la integral);
* CSI **no** mete momentos nodales al repartir una presión, y nosotros tampoco.

Lo que **no** prueba: que su campo `w` sea bilineal. De hecho el manual dice lo
contrario — ver abajo.

## Lo que este ensayo DESCARTÓ

Se había planteado que el modo `455.454364·D` del Shell-Thick de ETABS —que
tiene `w = 0` en los cuatro nudos y **curvatura cero** con la interpolación
bilineal, y que aun así **escala como `t³`** (nueve cifras iguales de t=0.20 a
t=0.02)— viniera de una `N` **enriquecida**, capaz de «ver» curvatura donde la
bilineal ve cero.

**Medido: falso.** Su `N` es bilineal.

Y el manual de CSI **da la especificación directamente** (Analysis Reference
Manual §10.1.1, sobre su elemento shell):

> «Out-of-plane displacements are **cubic**»

`w` cúbico ⇒ **4 GDL internos, uno por lado**. No es hipótesis: es su
documentación pública. Y encaja con las tres cosas a la vez:

* no tocan el vector de cargas (la presión no trabaja contra ellos) → `N` sale
  bilineal;
* sí entran en la rigidez;
* escalan como `D`, o sea `t³`.

Nosotros también tenemos modos incompatibles: los nuestros dan `156.250000` y
los suyos `455.454364`. **La diferencia son los modos, no las `N`.**

## Cómo se corre

    cd galpon-bodega-electoral
    python -u celda_area_unitaria.py > _area_unitaria.log 2>&1   # ETABS
    python area_comparar.py                                       # la comparacion
    python area_nuestra.py                                        # solo lo nuestro

## Dos trampas de la OAPI que costaron una corrida

* `AddByPoint(n, pts, Name, PropName)` devuelve
  `[('Global','2','3','4'), '1', 0]` — el **nombre del área está en la posición
  1**, no en la 0. Con `[0]` sale la tupla de puntos y `SetLoadUniform` revienta
  con *«unicode string expected instead of tuple instance»*.
* `AddCartesian(X, Y, Z, Name, UserName, CSys)`: el `"Global"` que pasan todos
  los scripts de esa carpeta cae en **UserName**, no en CSys, y por eso el
  primer nudo se llama literalmente `"Global"`. Es inofensivo y se deja igual
  que en `celda_flexion12*.py`, para que los dos ensayos hablen del mismo
  modelo.
