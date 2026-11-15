# Validaciones de shells y placas: autor, obra y dónde encontrarlas

Cada ejemplo del grupo «🧱 Placas» con la marca de benchmark lleva el nombre de la fuente. Los números de referencia salen de los
**manuales de verificación de SAP2000** (`C:\Program Files\Computers and Structures\SAP2000 24\Manuals\Verification\Analysis\Shells\Problem 2-0xx.pdf`),
que a su vez citan los trabajos originales. Struct los repite con todas sus formulaciones (Thin = DKE de Wilson = DKQ de Batoz, DKE literal del libro,
MITC4, DSE de Wilson, placa tipo CSI, DKMQ, Auricchio-Taylor).

| Ejemplo en Struct (`?t=…`) | Autor(es) | Problema | Prueba en el repo | Resultado |
|---|---|---|---|---|
| `macneal-harder-1985-patch-test` | **MacNeal & Harder (1985)** | 5 elementos irregulares, campo de deformación constante impuesto en el borde (SAP2000 2-001) | `tests/casos/patch_test_sap2000.mjs` | 0.000 % en membrana y flexión (Auricchio-Taylor 0.026 %) |
| `macneal-harder-1985-placa-rectangular` | **MacNeal & Harder (1985)**; valores independientes de **Timoshenko & Woinowsky-Krieger (1959)** | Placa 2×2 y 2×10 in, simple y empotrada, carga uniforme y puntual, un cuarto con simetría, mallas 4×4 y 16×16 (SAP2000 2-005) | `tests/casos/placa_rect_sap2000.mjs` | Thin ≤ 0.16 % de SAP2000; Thick CSI = SAP2000 (modelo D 5.865 vs 5.86) |
| `roark-young-1975-placa-anular` | **Roark & Young (1975)** | Placa anular gruesa r = 1.4–2 in, t = 0.5 in, flexión y cortante por separado (SAP2000 2-012) | `tests/casos/anular_shear_sap2000.mjs` | thin −5.218e-3 (flexión), MITC4 −5.345e-3 (suma), cortante 1.25e-4 |
| `benchmark-safe-ex01-plate` | **Timoshenko & Woinowsky-Krieger (1959)** (series de Navier) | Placa rectangular simplemente apoyada (SAFE Ex. 1) | `tests/casos/safe_ex01_placa.mjs` | ver el ejemplo |
| `deep-beam-fea` | **Calcpad** (Mechanics › Finite Elements) | Viga de gran peralte como membrana Q4, SAP2000 `Plane-20x10.s2k` | `registros/deep_beam_fea/` | 54.298 / 125.354 / 164.499 µm = Calcpad y SAP2000 sin modos incompatibles |

Notas de uso: los ejemplos de SAP2000 usan **los números del PDF** (1 in se dibuja como 1 m, 1 psi como 1 kN/m², 1 lb como 1 kN); la leyenda del visor
(«mm») hay que leerla así: −4.06e+3 «mm» = 4.06 in. En el 2-005 E y las cargas van ×1e8 (los desplazamientos no cambian): con t = 1e-4 el elemento
grueso daba un falso «Kaa singular».

## Dónde encontrar los trabajos originales

| Obra | Cita | Dónde |
|---|---|---|
| MacNeal & Harder | «A proposed standard set of problems to test finite element accuracy», *Finite Elements in Analysis and Design* 1(1), 1985, 3–20, DOI 10.1016/0168-874X(85)90003-4 | ScienceDirect (Elsevier); busca el título o el DOI. Trae el patch test, las vigas recta, curva y alabeada, la placa rectangular, la cubierta Scordelis-Lo y el hemisferio: son los problemas 2-001 a 2-007 de SAP2000. |
| Timoshenko & Woinowsky-Krieger | *Theory of Plates and Shells*, 2.ª ed., McGraw-Hill, 1959 | Libro clásico; Internet Archive o biblioteca universitaria. El PDF de SAP2000 da las ecuaciones y tablas usadas (Ec. 3 p. 5, Tabla 8 p. 20, Ec. 147 y Tabla 23 p. 143, Tablas 35 y 37 p. 202 y 206). |
| Roark & Young | *Formulas for Stress and Strain*, 5.ª ed., McGraw-Hill, 1975, p. 376 | Libro de fórmulas; el caso de la placa anular con cortante está en esa página (flexión −0.00521 in, cortante −0.000125 in, suma −0.00534 in). |
| Batoz & Tahar | «Evaluation of a new quadrilateral thin plate bending element», *Int. J. Numer. Methods Eng.* 18(11), 1982, 1655–1677 (DKQ) | Wiley Online Library / tu copia `batoz1982.pdf`. |
| Ibrahimbegović & Wilson | «A unified formulation for triangular and quadrilateral flat shell finite elements with six nodal degrees of freedom», *Commun. Appl. Numer. Methods* 7, 1991, 1–9 | Tu copia `Communication in applied numerical methods.pdf`. |
| Wilson | *Three-Dimensional Static and Dynamic Analysis of Structures* (CSI) — DSE, DKE, membrana con giro | Gratis en https://edwilson.org/bookshelf/edsbook |
| Bathe & Dvorkin | «A four-node plate bending element based on Mindlin/Reissner plate theory and a mixed interpolation», *Int. J. Numer. Methods Eng.* 21(2), 1985, 367–383 (MITC4) | Wiley Online Library. |

## Cómo se busca una validación nueva

1. **Los manuales de verificación de los programas** (`Manuals\Verification` de SAP2000, ETABS y SAFE) traen decenas de problemas con la fuente en el texto
   («MacNeal and Harder 1985», «Roark and Young 1975»): son el atajo para saber QUÉ buscar.
2. Con el autor y el año, buscar el título en **Google Scholar**, **ScienceDirect** o **Wiley** (la mayoría de los artículos de MEF de los 80 salen de
   *IJNME*, *FEAD*, *Computers & Structures*, *CMAME*); el DOI lleva directo.
3. Los libros viejos: **Internet Archive**, bibliotecas universitarias, o el autor (Wilson publica los suyos gratis).
4. Otras colecciones de problemas patrón: los benchmarks de **NAFEMS**, el *Abaqus Benchmarks Manual*, los ejemplos de **OpenSees**.
5. Regla del proyecto: la referencia tiene que ser **otro programa o una solución publicada**, con el mismo modelo y la misma malla; nunca una cuenta a mano sin fuente.
