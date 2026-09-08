# Las 8 plantillas: el `.e2k` en ETABS, y los numeros de Hekatan lineal

Generado con `node cli/plantillas_vs_csi.mjs`. Los datos de ETABS salen de
abrir cada `.e2k` en **ETABS 22 de verdad** (`cli/plantillas_etabs.py`),
guardarlo como `.EDB`, correr `RunAnalysis` y leer por la OAPI.

Cinco capas, y el orden importa: modelo -> masa -> estatico -> modos ->
fuerzas. Cada una solo tiene sentido si la anterior cuadra.

## Capa 1 · el modelo

«Barras» no exige igualdad una a una: el exportador junta una columna de
varios tramos en una sola LINE y ETABS la vuelve a partir. Se pide que cada
barra del modelo este DENTRO de alguna de ETABS. «Sueltos» son los joints que
ETABS crea de mas **y que ademas tocan algo**.

| ✓ | plantilla | joints ETABS | sobre nudo | sueltos | barras | apoyos | ΣFz | seccion | areas E/M |
|---|---|---|---|---|---|---|---|---|---|
| ✓ | `portico-2d` | 72 | 94.4 % | 0 | 100.0 % de 76 | 4/4 | 0.000 % | 0.000 % | 0/0 |
| ✓ | `portico-3d` | 468 | 99.1 % | 0 | 100.0 % de 544 | 16/16 | 0.000 % | 0.000 % | 0/0 |
| ✓ | `portico-losa` | 1044 | 99.6 % | 0 | 100.0 % de 544 | 16/16 | 0.000 % | 0.000 % | 900/900 |
| ✓ | `solo-rejilla` | 84 | 95.2 % | 0 | 100.0 % de 64 | 16/16 | 0.000 % | 0.000 % | 0/0 |
| ✓ | `losa-plana` | 1044 | 99.6 % | 0 | 100.0 % de 64 | 16/16 | 0.000 % | 0.000 % | 900/900 |
| ✓ | `losa-vigas-borde` | 1044 | 99.6 % | 0 | 100.0 % de 304 | 16/16 | 0.000 % | 0.000 % | 900/900 |
| ✓ | `dual` | 1052 | 99.6 % | 0 | 100.0 % de 544 | 24/24 | 0.000 % | 0.000 % | 940/940 |
| ✓ | `arriostrado` | 468 | 99.1 % | 0 | 100.0 % de 560 | 16/16 | 0.000 % | 0.000 % | 0/0 |

## Capa 1b · la propiedad de la cascara

El tipo (`Thin`/`Thick`/`Membrane`) y los diez modificadores. No es
cosmetico: el tipo cambia el ELEMENTO (Kirchhoff contra Mindlin) y un
modificador cambia la rigidez. `ShellType` de ETABS: 1 = ShellThin,
2 = ShellThick, 3 = Membrane.

| ✓ | plantilla | propiedad | clase | t [m] | tipo en ETABS | pedido | modificadores |
|---|---|---|---|---|---|---|---|
| — | `portico-2d` | sin cascaras | | | | | |
| — | `portico-3d` | sin cascaras | | | | | |
| ✓ | `portico-losa` | Losa | Slab | 0.200 | ShellThin | ShellThin | todos 1 |
| — | `solo-rejilla` | sin cascaras | | | | | |
| ✓ | `losa-plana` | Losa | Slab | 0.200 | ShellThin | ShellThin | todos 1 |
| ✓ | `losa-vigas-borde` | Losa | Slab | 0.200 | ShellThin | ShellThin | todos 1 |
| ✓ | `dual` | Losa | Slab | 0.200 | ShellThin | ShellThin | todos 1 |
| ✓ | `dual` | Muro | Wall | 0.250 | ShellThin | ShellThin | todos 1 |
| — | `arriostrado` | sin cascaras | | | | | |

## Capa 2 · la masa

La bascula va ANTES que los modos: el periodo va con la raiz de la masa, asi
que con masas distintas los periodos tienen que salir distintos y compararlos
no informa de nada. Hekatan la saca de `assembled_joint_mass()` (la misma
`ensamblarMasa()` de `modal.cpp`), ETABS de `AssembledJointMass`.

**La masa que cuenta es la de los nudos LIBRES**: la que cae en un apoyo tiene
el GDL fijo y no participa. Comparar solo el total lo esconde.

| plantilla | total Hek [t] | total ETABS | dif | **libre** Hek | **libre** ETABS | dif | en apoyos E/H |
|---|---|---|---|---|---|---|---|
| `portico-2d` | 44.25 | 44.25 | 0.000 % | 41.51 | 20.26 | 51.179 % | 2.7 / 2.7 |
| `portico-3d` | 275.67 | 275.67 | 0.000 % | 264.70 | 162.11 | 38.757 % | 11.0 / 11.0 |
| `portico-losa` | 910.01 | 910.01 | 0.000 % | 910.01 | 771.05 | 15.270 % | 135.7 / 0.0 |
| `solo-rejilla` | 78.31 | 78.31 | 0.000 % | 67.35 | 0.00 | 100.000 % | 11.0 / 11.0 |
| `losa-plana` | 712.66 | 712.66 | 0.000 % | 712.66 | 611.48 | 14.198 % | 98.4 / 0.0 |
| `losa-vigas-borde` | 811.34 | 811.34 | 0.000 % | 811.34 | 692.53 | 14.643 % | 116.0 / 0.0 |
| `dual` | 1001.79 | 1001.79 | 0.000 % | 1001.79 | 844.30 | 15.721 % | 154.6 / 0.0 |
| `arriostrado` | 281.63 | 281.63 | 0.000 % | 269.90 | 162.11 | 39.937 % | 11.7 / 11.7 |

## Capa 3 · estatico (caso `Dead`)

El nudo a nudo se mide contra el **maximo del modelo**, no contra el valor de
cada nudo: un nudo que casi no se mueve da un error relativo enorme sin que
eso signifique nada.

| plantilla | ΣRz Hek [kN] | ΣRz ETABS | dif | Uz Hek [mm] | Uz ETABS | dif | nudos | dentro del 1 % | peor nudo |
|---|---|---|---|---|---|---|---|---|---|
| `portico-2d` | 2160.0 | 2160.0 | 0.000 % | -3.230 | -3.230 | 0.000 % | 68 | 100.0 % | 0.000 % |
| `portico-3d` | 6480.0 | 6480.0 | 0.000 % | -2.277 | -2.277 | 0.000 % | 464 | 100.0 % | 0.000 % |
| `portico-losa` | 6480.0 | 6480.0 | 0.000 % | -2.847 | -2.847 | 0.000 % | 1040 | 100.0 % | 0.000 % |
| `solo-rejilla` | 6480.0 | 6480.0 | 0.000 % | -1.569 | -1.569 | 0.000 % | 80 | 100.0 % | 0.000 % |
| `losa-plana` | 6480.0 | 6480.0 | 0.000 % | -4.769 | -4.769 | 0.000 % | 1040 | 100.0 % | 0.000 % |
| `losa-vigas-borde` | 6480.0 | 6480.0 | 0.000 % | -3.960 | -3.960 | 0.000 % | 1040 | 100.0 % | 0.000 % |
| `dual` | 6480.0 | 6480.0 | 0.000 % | -2.853 | -2.853 | 0.000 % | 1048 | 100.0 % | 0.000 % |
| `arriostrado` | 6480.0 | 6480.0 | 0.000 % | -2.274 | -2.274 | 0.000 % | 464 | 100.0 % | 0.000 % |

## Capa 4 · los modos, emparejados por participacion de masa

**No por numero de orden.** Un portico plano tiene su primer modo FUERA del
plano, y el «modo 1» de un programa puede ser un modo distinto del otro. Cada
modo se cruza con el de ETABS cuyo vector de participacion
`[UX UY UZ RX RY RZ]` mas se le parece (coseno > 0.7).

| plantilla | modo Hek | modo ETABS | cos | T Hek [s] | T ETABS [s] | dif | UX/UY/RZ ETABS |
|---|---|---|---|---|---|---|---|
| `portico-2d` | 1 | 1 | 0.857 | 1.3860 | 1.3860 | 0.00 % | 0/71/0 |
|  | 2 | 2 | 1.000 | 0.6413 | 0.6413 | 0.00 % | 0/0/77 |
|  | 3 | 3 | 0.971 | 0.3229 | 0.3229 | 0.00 % | 88/0/0 |
|  | 4 | - | 0.501 | 0.2272 | - | - | - |
| `portico-3d` | 1 | 2 | 0.980 | 0.4121 | 0.4121 | 0.00 % | 88/0/0 |
|  | 2 | 1 | 0.980 | 0.4121 | 0.4121 | 0.00 % | 0/88/0 |
|  | 3 | 3 | 1.000 | 0.3716 | 0.3716 | 0.00 % | 0/0/89 |
|  | 4 | - | 0.393 | 0.1324 | - | - | - |
| `portico-losa` | 1 | 1 | 0.712 | 0.7000 | 0.7000 | 0.00 % | 1/88/0 |
|  | 2 | 2 | 0.712 | 0.7000 | 0.7000 | 0.00 % | 88/1/0 |
|  | 3 | 3 | 1.000 | 0.5823 | 0.5823 | 0.00 % | 0/0/89 |
|  | 4 | - | 0.343 | 0.2251 | - | - | - |
| `solo-rejilla` | 1 | - | 0.601 | 0.8116 | - | - | - |
|  | 2 | - | 0.601 | 0.8116 | - | - | - |
|  | 3 | 3 | 1.000 | 0.6751 | 0.6751 | 0.00 % | 0/0/72 |
|  | 4 | - | 0.610 | 0.1389 | - | - | - |
| `losa-plana` | 1 | 1 | 0.938 | 1.0205 | 1.0205 | 0.00 % | 82/2/0 |
|  | 2 | 2 | 0.938 | 1.0205 | 1.0205 | 0.00 % | 2/82/0 |
|  | 3 | 3 | 1.000 | 0.8937 | 0.8937 | 0.00 % | 0/0/82 |
|  | 4 | - | 0.328 | 0.2929 | - | - | - |
| `losa-vigas-borde` | 1 | 1 | 0.987 | 0.7611 | 0.7611 | 0.00 % | 88/0/0 |
|  | 2 | 2 | 0.987 | 0.7611 | 0.7611 | 0.00 % | 0/88/0 |
|  | 3 | 3 | 1.000 | 0.5815 | 0.5815 | 0.00 % | 0/0/89 |
|  | 4 | - | 0.338 | 0.2384 | - | - | - |
| `dual` | 1 | 1 | 0.985 | 0.6754 | 0.6754 | 0.00 % | 0/88/0 |
|  | 2 | - | 0.354 | 0.2136 | - | - | - |
|  | 3 | 3 | 0.940 | 0.1777 | 0.1777 | 0.00 % | 77/0/0 |
|  | 4 | 4 | 1.000 | 0.1568 | 0.1568 | 0.00 % | 0/0/77 |
| `arriostrado` | 1 | 1 | 0.979 | 0.4157 | 0.4157 | 0.00 % | 0/88/0 |
|  | 2 | 2 | 1.000 | 0.2780 | 0.2780 | 0.00 % | 0/0/89 |
|  | 3 | 3 | 0.980 | 0.2535 | 0.2535 | 0.00 % | 89/0/0 |
|  | 4 | - | 0.397 | 0.1336 | - | - | - |

## Capa 5 · fuerzas

Las de barra pasan por `tests/lib/comparar.mjs`, que hace las dos
conversiones de la convencion CSI: fuerza de EXTREMO -> DIAGRAMA (en el nudo
i cambia de signo) y el signo de `M2`. Las de cascara se emparejan por
CENTROIDE, porque ETABS renumera las areas al importar, y se comparan en
tres capas contra `AreaForceShell`: el CENTROIDE (media de los 4 joints de
ETABS contra el de Hekatan), JOINT A JOINT (cada joint del elemento, sin
promediar, 3600 por plantilla: M11, M22 y M12) y por NUDO (la media de los
joints de los elementos que tocan el nudo, que es lo que pinta el colormap).
Lo mismo para la MEMBRANA (F11 F22 F12, en % del |F| maximo): centroide y joint a joint.
Signo de CSI en los dos (desde el 8-sep-2026). Todo en % del |M| maximo.

| plantilla | barras emparejadas | peor P | peor V2 | peor M3 | shells | M11 centroide | M22 centroide | M12 centroide | M joint a joint | M nudo (colormap) | F11/F22/F12 centroide | F joint a joint |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `portico-2d` | 36 de 76 | 0.000 % | 0.000 % | 0.000 % | 0 de 0 | 0.000 % | 0.000 % | 0.000 % | - | - | - | - |
| `portico-3d` | 288 de 544 | 0.000 % | 0.000 % | 0.000 % | 0 de 0 | 0.000 % | 0.000 % | 0.000 % | - | - | - | - |
| `portico-losa` | 288 de 544 | 0.000 % | 0.000 % | 0.000 % | 900 de 900 | 0.000 % | 0.000 % | 0.000 % | 0.000 % (3600) | 0.000 % | 0.162 % | 0.387 % (3600) |
| `solo-rejilla` | 64 de 64 | 0.000 % | 0.000 % | 0.000 % | 0 de 0 | 0.000 % | 0.000 % | 0.000 % | - | - | - | - |
| `losa-plana` | 64 de 64 | 0.000 % | 0.000 % | 0.000 % | 900 de 900 | 0.000 % | 0.000 % | 0.000 % | 0.000 % (3600) | 0.000 % | 0.116 % | 0.255 % (3600) |
| `losa-vigas-borde` | 160 de 304 | 0.000 % | 0.000 % | 0.000 % | 900 de 900 | 0.000 % | 0.000 % | 0.000 % | 0.000 % (3600) | 0.000 % | 0.102 % | 0.221 % (3600) |
| `dual` | 288 de 544 | 0.000 % | 0.000 % | 0.000 % | 940 de 940 | 0.000 % | 0.000 % | 0.000 % | 0.000 % (3760) | 0.000 % | 0.000 % | 0.000 % (3760) |
| `arriostrado` | 304 de 560 | 0.000 % | 0.000 % | 0.000 % | 0 de 0 | 0.000 % | 0.000 % | 0.000 % | - | - | - | - |
