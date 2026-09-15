# banco-elemento — el laboratorio donde se itera antes de tocar el C++

**Para qué es.** Probar una formulación de elemento cuesta **26.5 s** en C++
(compilar Eigen) y **0.42 s** en Python. Sesenta veces. El 19-ago-2026 se
probaron unas quince variantes: en C++ habrían sido siete minutos de espera
pura.

Y el cuello de botella no es *calcular* —estas matrices son 12×12, se resuelven
en microsegundos— sino **escribir la variante y mirar el resultado**. Por eso
esto es Python: `numpy.linalg.eigh`, `lstsq` y `solve` en una línea es
exactamente lo que hizo falta para aislar el drilling de ETABS.

El flujo es:

```
banco-elemento/  (aquí)  →  se valida  →  hekatan-struct-py  →  .cpp  →  WASM
   iterar rápido             la matriz      el motor           producto
```

## Por qué está separado de `hekatan-struct-py/`

Dos razones, y las dos son de convivencia:

1. **El paquete es el motor del producto**; esto es un banco de pruebas. Aquí
   entran variantes que probablemente **no valgan** — y muchas no valieron
   (integrar la penalización, los Δθ relativos de Wilson). Eso no debe vivir en
   `src/`.
2. **Hay otra sesión trabajando en `hekatan-struct-py/`.** Si los dos tocamos
   `src/hekatan_struct/elements/`, chocamos. Aquí se **importa** el paquete, no
   se modifica.

## Qué hay

| archivo | qué hace |
|---|---|
| `medir.py` | la biblioteca: cargar las matrices de ETABS, comparar por bloques, sacar rango y autovectores, ajustar coeficientes |
| `probar.py` | el CLI: mide una variante contra las 10 matrices de ETABS de un tirón |

## Uso

```bash
cd hekatan-struct/banco-elemento

# la formulación de hoy contra las 10 matrices medidas de ETABS
python probar.py --proyeccion

# comparar varias de un golpe
python probar.py --comparar

# de qué está hecho lo que sobra (rango, autovectores)
python probar.py --proyeccion --residuo

# y que el C++ diga lo mismo (necesita kelem_native.exe compilado)
python probar.py --proyeccion --cpp
```

## De dónde salen las referencias

Las **matrices 12×12 de ETABS** están en
`galpon-bodega-electoral/memb12.json` (geometría y material) y
`galpon-bodega-electoral/K12_*.npy` (las matrices). Se reconstruyeron por
**flexibilidad** (caja negra): se fija todo menos 9 grados de libertad,
se mete una carga unidad en cada uno y se leen los desplazamientos — eso es la
flexibilidad, y su inversa es la rigidez. Las 3 filas que faltan salen de que la
rigidez por un movimiento de sólido rígido da cero.

Son 10 geometrías: cuadrado con ν = 0, 0.1, 0.2, 0.3, 0.45, el mismo en
Shell-Thin, dos rectángulos, un paralelogramo y un trapecio.

## La regla que hace útil a este banco

**Comparar MATRICES, no desplazamientos.** Un desplazamiento es la matriz ya
mezclada con apoyos y cargas: si sale mal, no dice **dónde**. La matriz sí — y es
lo que permitió ver que `K_uu` coincidía al 0.00 % mientras `K_uθ` se iba al
328 %, que fue el diagnóstico que desatascó todo.

---

## La primera falsa alarma del banco, y por qué se queda escrita

Nada más estrenarlo, `probar.py --proyeccion --cpp` cantó un **5.4 %** entre C++
y Python en una geometría, cuando las otras nueve daban `1e-13`. Parecía un bug
gordo del elemento. **No lo era, y la persecución vale más que el resultado.**

### Cómo se cazó

**1 · Deformar el cuadrado hacia el que falla, poco a poco.** Cuesta 0.4 s y
parte el problema en dos:

| deformación | C++ vs Python |
|---|---|
| 0.00 (cuadrado) | 1.2e-13 |
| 0.10 | 4.5e-03 |
| 0.50 | 2.4e-02 |
| 1.00 | 5.3e-02 |

**Continuo, sin saltos.** Un salto habría sido una rama de código, un `if`;
continuo es **una fórmula distinta que depende de la geometría**.

**2 · Bisecar el elemento.** Falla igual en los tipos 3, 7, 8 y 9 → no son las
formulaciones nuevas. Falla sin burbuja → no es la burbuja. `K_θθ` coincide al
**0.000 %** → no es el drilling. Queda la membrana pura, que es un Q4 de toda la
vida: eso *no puede* diferir… salvo que las coordenadas no sean las mismas.

**3 · Leer cómo el C++ construye sus ejes locales**, que era el único sitio que
quedaba:

```cpp
Eigen::Vector3d v01 = p1 - p0, v32 = p2 - p3;
Eigen::Vector3d localX = (v01 + v32);      // ← la MEDIA de dos lados
```

y el Python usa **`p1 − p0`** a secas. En un cuadrado, un rectángulo, un
paralelogramo o un trapecio con los lados de arriba y abajo paralelos, esos dos
vectores **son paralelos** y la media apunta igual. En un cuadrilátero
**general** no: aquí se separaban **3.47°**.

### El veredicto

| comparación | resultado |
|---|---|
| Python en globales contra C++ en **sus** ejes | 5.3e-02 ✘ |
| Python **con las coordenadas del C++** contra C++ | **1.7e-13** ✔ |
| K en ejes locales **girada** a globales, contra K en globales | **3.8e-16** ✔ |

Lo tercero es lo que importa: **la formulación es invariante a los ejes
locales**. El elemento está sano; lo que estaba mal era **comparar dos matrices
escritas en sistemas de referencia distintos**.

Arreglado en `medir.py`: `k_del_cpp` devuelve la K **girada a globales** por
defecto, así el error no se puede repetir.

### Las dos lecciones

- **Con cuadrado, rectángulo, paralelogramo y trapecio de lados paralelos, los
  ejes del C++ y los globales coinciden.** Ésas son justo las cuatro geometrías
  del test de paridad, así que la comparación llevaba meses funcionando **por
  casualidad**. Un banco de geometrías sin un cuadrilátero general no prueba lo
  que cree probar.
- **Antes de acusar al código, comprobar que las dos cosas comparadas son
  comparables.** Aquí eran la misma matriz en dos sistemas de referencia.
