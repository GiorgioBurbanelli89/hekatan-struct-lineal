# Cercha Warren en Hekatan Struct, paso a paso (como se hizo en el Tutorial 9)

Todo con el mouse, desde la cinta de acceso rápido. App: https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank
(en local: `npm run dev:examples` → http://localhost:4600/workspace/?t=new-blank).

## La cercha

```
luz 12 m · 6 paneles de 2 m · canto 2 m · en el alzado XZ (y = 0)

cordón superior   (−5,2) (−3,2) (−1,2) (1,2) (3,2) (5,2)       ← 6 nudos, sobre el centro de cada panel
                    /\    /\    /\    /\    /\    /\
diagonales        /  \  /  \  /  \  /  \  /  \  /  \          ← zigzag, 12 barras
cordón inferior (−6,0)(−4,0)(−2,0)(0,0)(2,0)(4,0)(6,0)         ← 7 nudos, apoyos en los extremos
```

13 nudos · 23 barras · 2 apoyos · 6 cargas nodales (+ 5 tramos con carga distribuida).
Va centrada en el origen porque «Frente» centra la cámara en (0,0): dibujada de 0 a 12 quedaría medio fuera.

## 1. Preparar la vista

| clic | dónde | qué pasa |
|---|---|---|
| **Frente** (XZ) | cinta, grupo *Vista* | alzado, plano de trabajo XZ |
| **SNAP** | cinta, grupo *Vista · precisión* (también F9 o la barra de abajo) | el cursor cae en la rejilla de 1 m: los clics son exactos |

La cinta tiene **dos filas** (Dibujar · Estructura · Analizar · Vista / Modificar · Rejilla · Cota · Carga). El botón **▴** la pliega; «✏ Dibujar» la abre. Mientras se dibuja, junto al cursor aparece `L = … m ∠ …° · X Y Z` (como AutoCAD).

## 2. Cordón inferior — Polilínea

1. **Polilínea** (cinta, *Dibujar*).
2. 7 clics: (−6,0) (−4,0) (−2,0) (0,0) (2,0) (4,0) (6,0). Con SNAP el readout marca `L = 2.000 m ∠ 0°` en cada tramo.
3. **Enter** termina (no clic derecho: abre el menú contextual).

## 3. Cordón superior — Polilínea

**Polilínea** y 6 clics a 2 m de altura sobre el centro de cada panel: (−5,2) (−3,2) (−1,2) (1,2) (3,2) (5,2). **Enter**.

## 4. Diagonales — una polilínea en zigzag

**Polilínea** y 13 clics alternando abajo/arriba: (−6,0) (−5,2) (−4,0) (−3,2) (−2,0) (−1,2) (0,0) (1,2) (2,0) (3,2) (4,0) (5,2) (6,0). **Enter**.
Un clic sobre un nudo existente **lo reutiliza** (no crea otro encima): por eso siguen siendo 13 nudos.
En la Howe/Pratt, en cambio, van verticales + diagonales con **Línea** (2 clics + Esc cada una).

Secciones por defecto (panel *Sección frames*): cordones 0.30 × 0.50 m (barras horizontales = «viga»), diagonales 0.40 × 0.40 m (inclinadas = «columna»), hormigón E = 25 000 MPa, ν = 0.2.

## 5. Apoyos

1. **Apoyo** (cinta, *Estructura*) y un clic en cada extremo del cordón inferior: (−6,0) y (6,0).
2. **Por defecto se pone EMPOTRADO** (6 GDL: Ux Uy Uz Rx Ry Rz).
3. Para verlo/cambiarlo: **Selec.** + clic en el nudo → panel *Restraints* con las seis casillas marcadas; **△ Articular** deja solo Ux Uy Uz. También con **clic derecho** sobre el nudo: *Assign ▸ Joint ▸ Restraints*.
4. **Esc** cierra el panel.

## 6. Cargas

**Forma puntual (tributaria):** casilla **kN** de la cinta = `−10` (negativo = hacia abajo). **Carga** y un clic en cada nudo del cordón superior (6 clics). −10 kN = 5 kN/m × 2 m de ancho tributario por nudo.

**Forma distribuida (como Frame Distributed Load de ETABS):** casilla **kN/m** = `−5`. **Carga q** y un clic en cada tramo del cordón superior (5 clics). Salen flechas naranjas a lo largo de la barra; por dentro va al solver como empotramiento perfecto (q·L/2 y ±q·L²/12) y al .e2k como `FRAMELOAD`.

**Con apoyos + cargas la app calcula sola** (sin botón): aparecen la deformada y la flecha en la etiqueta del nudo.

## 7. Resultados

Plegar la cinta (**▴**) para que el panel *Settings* quede a la vista. Folder **Analyze**:

| control | ver |
|---|---|
| ☑ **Deformed shape** + slider *Deformed scale* | deformada amplificada (en una cercha hay que subir la escala: es rígida) |
| **Frame results** → Axial Force | barras coloreadas por axil (leyenda a la derecha). ⚠️ «Axial Force (diagram)» es lo mismo en color, **no** un diagrama |
| **📐 Ver diagrama en 2D (alzado / planta)** | **el diagrama de verdad**, como ETABS: alzado XZ, cada barra con su valor en los extremos (axil −40.49 kN en el cordón inferior central con las nodales; M3-3 5.23 kN·m en la diagonal del apoyo). Flechas ◀ ▶ pasan de pórtico; ✕ cierra |
| **📈 Gráfico de la barra designada** | N, V, M a lo largo de una barra (*Diagram for Frame Object*) |
| **Node results** → U (deformations) / R (reactions) | desplazamientos por nudo / reacciones: Fz = 55.00 kN en cada apoyo (ΣFz = 110 = 60 nodales + 50 distribuidas) |
| pasar el cursor por un nudo o una barra | recuadro con ux uy uz, reacciones, N, ΔL, ε |

## 8. Medir

**Medir** (cinta, *Modificar*): clic en (−6,0) y clic en (6,0) → «Distancia 12.000 m · Δx 12.000». **Esc** suelta la regla.

## 9. 3D

**3D** (cinta, *Vista*): perspectiva con la deformada y los colores; arrastrar orbita.

## 10. Guardar

- **Guardar .heks** desde la cinta: botón **▾** (Añadir a la cinta) → escribir `heks` en el buscador → marcar «💾 Guardar .heks» → Esc → queda en *Mis accesos*; un clic y descarga `modelo.heks`.
- **Guardar como…** (barra de arriba, 💾…): pide el nombre → `cercha_warren.heks`; la barra lo muestra y desde ahí **Guardar** (💾) lo reescribe. **Abrir** (📂) lo vuelve a cargar.

El .heks es texto (formato de Hekatan Struct, para guardar y compartir en el grupo):

```
node 1 -6 0 0                # id x y z (m)
…
node 13 5 0 2
frame 1 1 2 25000000 0.15 0.001125 0.003125 0.001134 0.2 2.45   # id i j E(kPa) A I22 I33 J ν ρ(t/m³)
…
support 1 1 1 1 1 1 1        # nudo Ux Uy Uz Rx Ry Rz (1 = fijo)
support 7 1 1 1 1 1 1
load 8 0 0 -10 0 0 0         # nudo Fx Fy Fz Mx My Mz (kN, kN·m)
…
frameload 7 0 0 -5           # barra wx wy wz (kN/m, ejes globales)
solve
```

## 11. Cómo se comprobó (ETABS 22, por CLI)

```bash
node cli/_cercha.mjs warren                    # dibuja la cercha con el cursor en :4600, 10/10 comprobaciones,
                                               # exporta cli/shots/cercha_warren.heks (+ dump.json)
node cli/heks_a_csi.mjs cli/shots/cercha_warren.heks cli/shots/cercha_warren     # → .e2k .s2k .f2k
python csi-cli/hekatan-csi-cli/csi_cli.py --engine etabs --open cli/shots/cercha_warren.e2k --out cli/shots/cercha_warren_etabs.txt
python cli/_boveda_vs_etabs.py cli/shots/cercha_warren_dump.json cli/shots/cercha_warren_etabs.txt   # casa nudos por coordenadas
```

| cercha | nudos | uz máx Hekatan | uz máx ETABS 22 | nudo a nudo |
|---|---|---|---|---|
| Warren | 13 | 0.298 mm | 0.298 mm | 13/13 dentro del 1 % (peor 0.002 %) |
| Howe | 14 | 0.257 mm | 0.257 mm | 14/14 |
| Pratt | 14 | 0.959 mm | 0.959 mm | 14/14 |

(Con solo las 6 cargas nodales: Warren 0.151 mm, Howe 0.128, Pratt 0.449; ΣFz = 60 kN.)

## Howe y Pratt (mismo circuito)

- Cordón superior con **7** nudos, encima de los inferiores: (−6,2)…(6,2).
- **Verticales** en cada nudo interior con **Línea** (2 clics + Esc): (−4,0)-(−4,2) … (4,0)-(4,2).
- **Diagonales**: Howe caen hacia el apoyo (del inferior exterior al superior interior: (−6,0)-(−4,2), (−4,0)-(−2,2), (−2,0)-(0,2) y simétrico); Pratt suben hacia el centro (del superior exterior al inferior interior: (−6,2)-(−4,0)… y simétrico). En la Pratt las diagonales trabajan a tracción; en la Howe a compresión.
- Cargas en los **5** nudos superiores interiores (los de apoyo no).
