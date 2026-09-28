# Analisis Sismico Modal — Guia Comparativa de 3 Metodos

## Contexto

Este documento compara 3 enfoques para analisis modal de estructuras,
implementados o referenciados en este proyecto:

| Metodo | Autor | Origen | Nivel |
|--------|-------|--------|-------|
| Rigidez Lateral (condensada) | Roberto Aguiar Falconi | Libro: Analisis Sismico de Edificios, ESPE Ecuador 2008 | Piso (1-3 DOF/piso) |
| Rigidez Directa 3D | Mario Paz | Libro: Structural Dynamics 6th Ed, Springer 2019 | Nudo (6 DOF/nudo) |
| Hekatan FEM | Motor FEM de Hekatan Struct + modal del usuario | Eigen C++/WASM | Nudo (6 DOF/nudo) |

---

## 1. Metodo Aguiar — Rigidez Lateral Condensada

### Filosofia
Reducir el edificio a **1 DOF lateral por piso** (analisis plano) o **3 DOF por piso** (espacial: ux, uy, rotacion_z). Se asume diafragma rigido.

### Entrada minima
```
sv = [2.93; 4.72; 3.20]   % separacion entre vanos (m)
sp = [3.45; 3.07]          % altura de pisos (m)
Lvi = 0; Lvd = 0;          % volados izq/der (m)
```

### Flujo completo (portico plano)
```
sv, sp, Lvi, Lvd
    |
    v
geometria_volcar()     → nv, np, nudt, nudcol, nudvg, nod, nr
    |
    v
glinea_portico_volcar() → X, Y  (coordenadas de nodos)
    |
    v
gn_portico_volcar()     → NI, NJ  (conectividad: nodo inicial, nodo final)
    |
    v
cg_sismo2()            → CG, ngl  (coordenadas generalizadas, num DOFs)
    |
    v
vc()                   → VC  (vector de colocacion para ensamblaje)
    |
    v
longitud()             → L, seno, coseno  (propiedades geometricas)
    |
    v
krigidez_nudo_rigido_compuesta()  → K global (ngl x ngl)
    |
    v
CONDENSACION ESTATICA:
    kaa = K(1:np, 1:np)          % submatriz lateral
    kab = K(1:np, np+1:ngl)      % acoplamiento
    kbb = K(np+1:ngl, np+1:ngl)  % submatriz rotaciones
    KL  = kaa - kab * inv(kbb) * kba    % RIGIDEZ LATERAL (np x np)
    |
    v
ANALISIS MODAL (modalplanonew):
    M = diag(peso_piso / g)       % masa diagonal (np x np)
    [V, D] = eig(KL, M)          % eigenvalues
    |
    v
    Frecuencias, modos, fuerzas sismicas (espectro CEC-2000)
```

### Para analisis espacial (edificio 3D)
```
Repetir para cada portico en X e Y:
    KL_portico_1, KL_portico_2, ...

Ensamblar K_E espacial (3*np x 3*np):
    K_E = [Kxx    0     Kx_theta ]
          [ 0    Kyy    Ky_theta ]
          [Kthx  Kthy   Kth_theta]

Donde:
    Kxx = sum(KL_i) para porticos en X
    Kyy = sum(KL_j) para porticos en Y
    Kth = sum(KL_i * d_i^2) rigidez torsional (d = distancia al centro de rigidez)

M_E = diag(m, m, I_theta) por piso  (masa + inercia rotacional)

[V, D] = eig(K_E, M_E)   % 3*np eigenvalues
```

### Archivos MATLAB
- `Matlab/geometria_volcar.m`
- `Matlab/glinea_portico_volcar.m`
- `Matlab/gn_portico_volcar.m`
- `Matlab/cg_sismo2.m`
- `Matlab/vc.m`
- `Matlab/longitud.m`
- `Matlab/krigidez_nudo_rigido_compuesta.m`
- `Matlab/kmiembro_nudo_rigido_compuesta.m`
- `Matlab/klateral.m` (todo-en-uno)
- `Matlab/FMAT_Modal_Espectral.m` (ejemplo completo espacial)
- `Matlab/Etabs_portico_plano_irregular_Sistema_mixto_con_columnas_CFT_Sra_Victoria.m`

### Libro de referencia
- `Pdf/txt/ANALISIS_SISMICO_DE_EDIFICIOS.txt` (704 paginas, Aguiar 2008)
- Programa RLAXINFI: linea ~4364
- Programa MODALPLANONEW: linea ~10619
- Programa MODALESPAC IAL3GDLNEW: linea ~10900+
- Teoria superposicion modal: linea ~9382
- Condensacion estatica: linea ~4280

---

## 2. Metodo Mario Paz — Rigidez Directa 3D

### Filosofia
Cada nudo tiene **6 DOF** (ux, uy, uz, rx, ry, rz). No se condensa nada. Se ensamblan K y M globales directas y se resuelve el eigenvalue completo.

### Entrada
Nodos, elementos, propiedades de seccion (E, G, A, Iy, Iz, J, I0, m_bar).

### Flujo (Ejemplo 13.1 — Space Frame)
```
Nodos: [x, y, z] de cada nudo
Elementos: [nodo_i, nodo_j, punto_referencia]
Propiedades: E, G, A, Iy, Iz, J, I0 (por tipo de miembro)
    |
    v
Para cada elemento:
    coord = [nodo_i; nodo_j; ref_point]     (3x3)
    |
    v
    SpaceFrameElement(E, G, Iz, Iy, J, A, coord)
        1. Ejes locales via punto de referencia:
           ex = (n2-n1)/L
           ey = cross(n3-n1, n2-n1) / norm(...)
           ez = cross(ex, ey)
        2. Matriz T de transformacion (12x12, bloque diagonal de H=[ex;ey;ez])
        3. Ke local (12x12, Euler-Bernoulli: EA/L, 12EI/L^3, GJ/L, etc.)
        4. Ke global = T' * Ke * T
    |
    v
    SpaceConsMass(m_bar, I0, A, coord)
        1. Misma T que rigidez
        2. Me local (12x12 consistente, con I0/A para torsion)
        3. Me global = T' * Me * T
    |
    v
Ensamblaje: K(lm, lm) += ke;  M(lm, lm) += me;
    |
    v
Reduccion: eliminar DOFs fijos → Kf, Mf
    |
    v
[V, D] = eig(Kf, Mf)   % TODOS los modos (laterales + torsionales + verticales + axiales)
```

### Diferencia clave en masa torsional
```
Paz:    usa I0 explicito  (I0 dado en tabla, puede ser != Iy+Iz)
Hekatan: usa Ip = Iy + Iz  (perpendicular axis theorem, correcto para secciones reales)

Para secciones reales AISC:  Ip = Iy + Iz  siempre
Para ejemplos pedagogicos:   I0 puede ser un valor ficticio
```

### Archivos
- `Pdf/txt/Structural Dynamics Theory and Computation Sixth Edition Mario Paz Young Hoon.txt`
  - Capitulo 13: linea ~23496 (Dynamic Analysis of 3D Frames)
  - Ejemplo 13.1: linea ~24030
  - SpaceFrameElement MATLAB: linea ~24169
  - SpaceConsMass MATLAB: linea ~24217
- `clon-fork-original/cli_paz13_1.cpp` — implementacion C++ del Ejemplo 13.1 (3 solvers)

---

## 3. Metodo Hekatan — FEM Completo en C++/WASM

### Filosofia
Igual que Paz pero automatizado: transformacion automatica de ejes (sin punto de referencia), matrices sparse, compilado a WASM para browser/Node.js.

### Flujo
```
nodes: [[x,y,z], ...]
elements: [[n1,n2], ...]
supports: Map<node, [tx,ty,tz,rx,ry,rz]>
properties: Map<elem, {E, G, A, Iz, Iy, J, rho}>
    |
    v
getGlobalStiffnessMatrix()     → K sparse
getGlobalMassMatrix()          → M sparse  (Ip = Iy+Iz para torsion)
  o
getGlobalMassMatrixPaz()       → M sparse  (I0 explicito si se provee polarMomentsOfInertia)
    |
    v
getFreeIndices() + getReducedMatrix()  → K_red, M_red
    |
    v
Eigen::GeneralizedSelfAdjointEigenSolver(K, M)
    |
    v
Frecuencias, modos, participacion de masa
```

### Convencion de ejes (Three.js Y-up)
```
Columna vertical (eje local x = global Z):
    local_x = [0, 0, 1]     → eje del elemento
    local_y = [0, 1, 0]     → global Y
    local_z = [-1, 0, 0]    → global -X

Consecuencia:
    momentsOfInertiaZ en Hekatan = eje debil (Iy AISC)
    momentsOfInertiaY en Hekatan = eje fuerte (Iz AISC)
```

### Archivos C++
- `clon-fork-original/hekatan-fem/src/cpp/modal.cpp` — solver modal default
- `clon-fork-original/hekatan-fem/src/cpp/modal_paz.cpp` — solver alternativo (con I0)
- `clon-fork-original/hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp`
- `clon-fork-original/hekatan-fem/src/cpp/utils/getLocalMassMatrix.cpp` — masa con Ip=Iy+Iz
- `clon-fork-original/hekatan-fem/src/cpp/utils/getLocalMassMatrixPaz.cpp` — masa con I0
- `clon-fork-original/hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp`
- `clon-fork-original/hekatan-fem/src/cpp/utils/getGlobalStiffnessMatrix.cpp`
- `clon-fork-original/hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp`
- `clon-fork-original/hekatan-fem/src/cpp/utils/getGlobalMassMatrixPaz.cpp`
- `clon-fork-original/hekatan-fem/src/cpp/data-model.h`

### Archivos TypeScript
- `clon-fork-original/hekatan-fem/src/modalCpp.ts` — wrapper default
- `clon-fork-original/hekatan-fem/src/modalPazCpp.ts` — wrapper alternativo
- `clon-fork-original/hekatan-fem/src/data-model.ts`

### CLI nativos (g++)
- `clon-fork-original/cli_modal_native.cpp` — Ejemplo 6.3 (Paz & Leigh)
- `clon-fork-original/cli_paz13_1.cpp` — Ejemplo 13.1 Mario Paz (3 solvers comparados)

---

## 4. Comparacion Directa

### Tamano del eigenvalue problem para un edificio de 6 pisos, 3 vanos

| Metodo | DOFs en eigenvalue | Modos obtenidos |
|--------|-------------------|-----------------|
| Aguiar plano | 6 (1/piso) | 6 laterales |
| Aguiar espacial | 18 (3/piso) | 18 (lateral X, lateral Y, torsion) |
| Paz/Hekatan | ~168 (28 nudos libres x 6) | 168 (todos: lateral, torsional, vertical, axial, rotacional) |

### Que captura cada uno

| Efecto | Aguiar plano | Aguiar espacial | Paz/Hekatan |
|--------|-------------|----------------|------------|
| Traslacion lateral | Si | Si | Si |
| Torsion de piso | No | Si | Si |
| Deformacion axial | No (rigido) | No (rigido) | Si |
| Rotacion de nudos | Condensada | Condensada | Si |
| Modos verticales | No | No | Si |
| Flexion local de vigas | Condensada | Condensada | Si |

### Precision para diseno sismico de edificios regulares

Los 3 metodos dan **practicamente el mismo resultado** para:
- Frecuencias fundamentales laterales
- Fuerzas sismicas de piso
- Cortante basal
- Derivas de piso

La condensacion estatica de Aguiar es **exacta** para cargas estaticas y
**excelente aproximacion** para los primeros modos dinamicos.

### Cuando se necesita Paz/Hekatan
- Estructura irregular en planta (torsion significativa)
- Estructura sin diafragma rigido
- No es un "edificio" (puente, torre, portico espacial)
- Se requieren modos de orden superior
- Verificacion de resultados de software comercial (ETABS, SAP2000)

---

## 5. Resultados Verificados

### Ejemplo 13.1 Mario Paz (cli_paz13_1.exe)

5 nodos, 4 elementos, nudo central libre (6 DOF).
Ejecutar: `cd "clon-fork-original" && ./cli_paz13_1.exe`

| Modo | Paz exacto (Hz) | Hekatan Ip (Hz) | Hekatan+I0 (Hz) | Diff max |
|------|-----------------|----------------|----------------|----------|
| 1 | 12.7910 | 12.8185 | 12.8293 | 0.30% |
| 2 | 12.8557 | 12.8448 | 12.8557 | 0.09% |
| 3 | 14.0668 | 14.1078 | 14.1142 | 0.34% |
| 4 | 66.4972 | 66.4972 | 66.4972 | 0.00% |
| 5 | 78.1784 | 77.9014 | 77.9153 | 0.35% |
| 6 | 82.5930 | 82.3202 | 82.3465 | 0.33% |

K identica en los 3 (0.00% diferencia).
M difiere 3.17% por I0 vs Ip y orientacion de transformacion.

### Ejemplo 6.3 Paz & Leigh (cli_modal_native.exe)

8 nodos, 8 elementos, 4 columnas + 4 vigas.
Ejecutar: `cd "clon-fork-original" && ./cli_modal_native.exe`

| Modo | Freq (Hz) | Dominante |
|------|-----------|-----------|
| 1 | 9.6780 | Uy (99.8%) |
| 2 | 16.9874 | Rz (torsional) |
| 3 | 26.6149 | Ux (94.3%) |
| 4 | 29.9497 | Antisimetrico |
| 5 | 33.9929 | Rz (14.2%) |
| 6 | 44.9332 | Uz (26.9%) |

Validado con 4 solvers: WASM browser, WASM Node, C++ nativo, Python/SciPy.

---

## 6. Compilacion

### C++ nativo (Ejemplo 13.1 Paz)
```bash
cd "clon-fork-original"
g++ -O2 -std=c++17 -static-libgcc -static-libstdc++ \
    -I hekatan-fem/src/cpp/eigen \
    cli_paz13_1.cpp \
    hekatan-fem/src/cpp/utils/feHelpers.cpp \
    hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp \
    hekatan-fem/src/cpp/utils/getLocalMassMatrix.cpp \
    hekatan-fem/src/cpp/utils/getLocalMassMatrixPaz.cpp \
    hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp \
    hekatan-fem/src/cpp/utils/getGlobalStiffnessMatrix.cpp \
    hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp \
    hekatan-fem/src/cpp/utils/getGlobalMassMatrixPaz.cpp \
    -o cli_paz13_1.exe
```

### WASM (requiere emsdk)
```bash
cd "clon-fork-original/hekatan-fem"
source ../../emsdk/emsdk_env.sh
npm run build
# Exporta: _deform, _modal, _modal_paz
```

---

## 7. Proximos pasos

- [ ] Implementar `buildingFromSpans(sv_x, sv_y, sp)` en Hekatan — genera nodos/elementos 3D a partir de vectores de vanos/pisos (como geometria_volcar pero para el solver completo)
- [ ] Agregar espectro sismico NEC-15 / CEC-2000 como post-proceso del analisis modal
- [ ] Comparar resultados Aguiar condensado vs Hekatan completo para un mismo edificio
- [ ] Implementar combinacion modal CQC/SRSS en Hekatan
