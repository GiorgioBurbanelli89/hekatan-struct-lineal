# Punto de inserción, brazos rígidos y cubierta de membrana (0.2.0)

Tres formulaciones de CSI que el motor TS/C++ de Hekatan Struct ya tenía; aquí se llaman rápido desde Python.
Todas se comparan con el motor TS/C++ por `cliModeler` leyendo el MISMO `.heks` (`tests/_motor_ts.py`).

## A. Barra con punto de inserción (cardinal points 1-11) — `hekatan_struct.insercion`

```
7 8 9      D = canto (eje local 2)       d2, d3 = posición del CENTROIDE respecto al NUDO, ejes locales
4 5 6      B = ancho (eje local 3)       CP 8 de una viga: d2 = -D/2 (el centroide cuelga D/2 bajo el nudo)
1 2 3      10 centroide · 11 centro de cortante (hay que darlo, si no: ValueError)
```

| firma | qué hace |
|---|---|
| `offsets_punto_cardinal(cp, D, B, *, centroide=(0,0), centro_cortante=None, derecha_es_eje3=True) -> (d2, d3)` | tabla 1-11. `centroide` = (c2, c3) respecto al centro de la caja (T, L, C asimétricas) |
| `asignar_punto_insercion(ei, k, cp, D, B, *, transform=True, ...) -> (d2, d3)` | escribe `ei.insertion_offsets[k]` y `ei.insertion_transform[k]` |
| `posicion_centroide(p_i, p_j, d2, d3, angulo_deg=0)` | eje del centroide en globales (lo único que cambia sin restricción) |
| `frame_insertion_matrix(d2, d3)` (`elements/frame.py`) | R 12×12 local, espejo de `Ri` en `getGlobalStiffnessMatrix.cpp` |

Dos variantes (la casilla «Transform frame stiffness for offsets from centroid» de ETABS; en el e2k
`TRANSFORMSTIFF "Yes"`; **si el e2k no lo dice, ETABS NO transforma**):

```python
asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30)                    # CON restricción rígida
asignar_punto_insercion(ei, k, 8, D=0.60, B=0.30, transform=False)   # SIN: la barra solo se desplaza geométricamente
```

- **Con**: `u_centroide = u_nudo + θ × r`, `r = (0, d2, d3)`; `K = Rᵀ K R`; esfuerzos del centroide = `k·(R u)` (`analyze`).
  Medido: voladizo CP 10/8/2 contra SAP2000 24 (ux, uz, giro, M3) ≤ 1e-9; losa 4×4 con vigas CP 8 contra
  SAP2000 = ETABS (`validation/insercion`) 3e-15; Python = TS 1e-14.
- **Sin**: la K no se toca → resultado idéntico al centroide (CP 10), como mide ETABS (casilla marcada = CP 10).
- ⚠️ Antes `insertion_points`/`apply_cardinal_point_8` usaban `r×ω` (signo contrario al TS) y ponían el desfase en el eje 3.
  `insertion_points` queda como alias de `insertion_offsets`; `apply_cardinal_point_8` ahora pone `(-h/2, 0)`.
- **Lateral (1,3,4,6,7,9)**: signo SUPUESTO (derecha = +eje 3, mirando de I a J, el dibujo de CSI). **No medido** en ETABS:
  `derecha_es_eje3=False` lo invierte. El TS solo hace la parte vertical. **11**: pide `centro_cortante=(e2, e3)`.
- Las cargas de vano NO se trasladan al nudo (igual que el TS): exacto para CP vertical con carga vertical.

`.heks`: `frame … D B` + `e2klinea ID CARDINALPT n [TRANSFORMSTIFF "Yes"|"No"]` o `insercion ID cp [0|1]`.
Sin `TRANSFORMSTIFF` el lector aplica la restricción (**igual que el TS actual**; ETABS no lo haría).

## B. Brazos rígidos por defecto como ETABS — `hekatan_struct.brazos`

La ley ya estaba en el solver (`end_offsets = {k: (offI, offJ, rz)}`): `l = rz·off`, `Lf = L − lI − lJ`, EA/L y GJ/L con L
completa, `K = Rᵀ K(Lf) R`, carga de vano `F = w(Lf/2 + l)`. La **masa/peso** de las VIGAS usa la luz libre
`L − offI − offJ` (columna y diagonal, `L`); SAP2000 no descuenta (sin `end_offsets`).

```python
aplicar_brazos_automaticos(nodes, elements, ei, rz=0.0, cantos={k: 0.5}, anchos={k: 0.3})   # -> nº de barras con brazo
brazos_automaticos_etabs(nodes, elements, clase, lado_columna, canto_viga, rz)               # espejo de brazosAutomaticosETABS
```

Regla: viga (< 20° de la horizontal) = ½ lado de la columna (en su dirección) por extremo con columna; columna (> 70°)
= canto ENTERO de la viga arriba, 0 abajo. RZ = 0 (ETABS) no rigidiza. Sin `cantos/anchos`: rectángulo equivalente
`h = √(12·I33/A)`, `b = √(12·I22/A)`. `.heks`: `rigidzone auto [f]` (tokens D B de `frame`, `isec`, `tubo`, …),
`rigidzone off` manda; `comportamiento etabs` = `etabsjoint 1` + `deck etabs` + `rigidzone auto 0`; `comportamiento sap2000` = sin brazos.
Python = TS a 1e-14 (RZ 0, 0.5, 1).

## C. Cubierta de membrana (`deck etabs`) — `hekatan_struct.cubierta`

Las losas AREA FLOOR de membrana (sin flexión) se conectan a todo nudo que tocan y mandan peso y carga a las vigas de
borde por área tributaria (bisectrices; Hermite consistente). Mismo código que el `deck etabs` del `.heks` y que
`aplicarDeckEtabs` de cliModeler.ts.

```python
c = membrana_deck_etabs(nodos, barras, panos, *, espesor=0.004, rho=7.85, carga_gravedad=0.0, peso_propio=1.0,
                        un_sentido=False, angulo=None, partir_barras=True)
# nodos {id:(x,y,z)} m · barras [(id,nI,nJ)] · panos [(id,n0,n1,n2,n3)] · carga_gravedad kN/m² (+ hacia abajo)
c.panos  c.barras  c.cargas  c.panos_a_barras          # paños y barras partidos; {nudo: [Fx,Fy,Fz,Mx,My,Mz]}
d = cubierta_de_e2k("mercado.e2k", "N7 COL", seccion="Cubierta metalica", areas_sel=None)  # -> dict para **kwargs
```

`un_sentido=True` = `ONEWAYLOADDIST "Yes"` (vano = borde 0→1 girado `angulo[id]`; carga solo a los dos bordes de apoyo).
Mercado: SHELLPROP `Cubierta metalica` = Membrane 4 mm A36, `ONEWAYLOADDIST "Yes"`, AREAASSIGN `ADDRESTRAINT "Yes"`,
`OBJMESHTYPE "DEFAULT"`, Dead 0.392266 kN/m². Planta N7 COL: 344 paños, 1363 barras → ΣFz = −q·A = −1457.289 kN (2081 m²) a 1e-14.
`cubierta_de_e2k` lee la caída del punto (3.er número de `POINT`: z = cota − caída) y los offsets de planta del AREA.
No lee BRACE ni columnas. Los paños solo se parten en nudos YA existentes (no se inventan).
