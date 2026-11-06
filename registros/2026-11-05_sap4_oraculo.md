# SAP IV (1973) como oraculo extra de Hekatan Struct (5-nov-2026)

Herramientas (en el repo, solo scripts y resultados propios): `cli/sap4_correr.py` (genera la entrada de SAP IV desde el `.heks` que escribe `e2kAHeks`, ejecuta `sap64.exe`, lee la salida y compara), `cli/sap4_hekatan.mjs` (lado Hekatan TS: e2k -> .heks -> resuelve -> JSON), `cli/sap4_ejemplos.py` (valida el flujo con los ejemplos), `tests/datos/sap4_resultados.json`.
Binarios y fuente de SAP IV: SOLO en `C:\ETABS\sap4\` (fuera del repo, nunca se comitean). Se pasa la ruta con `--sap4 C:/ETABS/sap4/sap3264/SAP --trab C:/ETABS/sap4/trab`.
Uso: `python cli/sap4_correr.py --sap4 ... --trab ... todo` (28 s, una corrida a la vez) | `viga` | `e2k <ruta.e2k> <Patron>`.

## 1. Los ejemplos de SAP IV (flujo validado)
| Paquete | Corre | Coincide con su .OUT | Desp. max dif. |
|---|---|---|---|
| SAP-32-64: sap64.exe, ej 1-8 | si (8/8) | si | 0 a 1e-5 (= ultimo digito impreso; solo cambian tiempos y memoria) |
| SAP-32-64: sap32.exe, ej 1-8 | si | si | igual; 4a/4b 1.1e-4 relativo en algun valor no-desplazamiento |
| SAP4.zip PCDOS SAMPLE1-8.IN (compilado con gfortran 14) | si (9/9) | si (1-7); el 8 esta truncado en el .OUT entregado (3014 lineas contra 6945) | 0 en todos |
| SAP4.zip FUJITSU TEST1-7.INP (compilado, 115 fuentes) | si (7/7) | si | 0 a 1e-7 (TEST2) |
| SAP4.zip CDC SAP4EX1-7.DAT | NO se compilo (fuente CDC 6600 con OVERLAY, palabra de 60 bit). Sus .DAT por sap64: ej1/2/5 desp. 1e-5, 4e-5, 1e-5 relativo; ej3 no lee; ej4 y ej6 difieren (otra entrada) | parcial | - |
- ✅ Defecto del zip: `example6.out` entregado es la salida del ejemplo 7 (la del 6 sale en `SAMPLE6.OUT` de PCDOS y coincide con la nuestra, 1.8e-9).
- ✅ gfortran si esta (14.2). PCDOS: 2 parches (lee los dos nombres antes de abrir la unidad 5; stub de `timer`). FUJITSU: parches de formato/EQUIVALENCE/DATA de caracteres en 11 ficheros y stubs de `memalloc`/`clock` (el fuente es de otra plataforma). Esos parches NO se guardan en el repo (son codigo de SAP IV).
- Entrada por teclado: nombre de entrada y de salida (maximo 20 caracteres), ficheros de trabajo NT2.. en el directorio actual.

## 2. Elementos de SAP IV y cual representa la cubierta
Leido del fuente (el manual PC-SAP4.pdf y el informe EERC-73-11 son escaneos sin texto, sin OCR en este equipo: las tarjetas salen de las lecturas `READ`/`FORMAT` de `sap.for`).
| Tipo | Elemento | Notas |
|---|---|---|
| 1 | cercha 3D | |
| 2 | **viga 3D**: Timoshenko (A, As2, As3, J, I22, I33), ejes por nudo K (local 2 hacia K), codigos de extremo de 6 digitos (liberaciones), peso propio por multiplicadores X/Y/Z | misma formulacion de cortante que Hekatan (`phi = 12EI/(G As L^2)`); sin brazos rigidos nativos (se hacen con eslabones rigidos) |
| 3 / 4 | tension plana / axisimetrico (2D, plano x-y) | no sirve para una cubierta inclinada en 3D |
| 5 | solido 8-21 nodos | |
| 6 | **placa/lamina delgada (TPLATE/QTSHEL)**: cuadrilatero de 4 CST (membrana de deformacion constante) + LCCT de flexion, 6 gdl por nudo, nodo central condensado | el que representa la membrana |
| 8 | lamina gruesa (SOL21, isoparametrico 8-21) | |
| 11 | tuberia | |
- Cubierta = tipo 6 con espesor `t/s` y matriz constitutiva `s*CM` (s = 20): MISMA rigidez de membrana, flexion /400 (ETABS `Membrane` no flexiona; el tipo 6 no permite flexion nula). Limitacion: formulacion CST distinta de la ITW/Q4 de ETABS y Hekatan; sin drilling propio; sin `edge constraint` ni reparto `ONEWAYLOADDIST` (las cargas de area se toman ya repartidas a nudos desde el .heks de Hekatan, o sea las mismas cargas en los tres programas).
- Cargas de superficie en SAP IV: presion normal con multiplicador (`EL(2)*TLO(1)`) y gravedad X/Y/Z por masa; no hay carga de area en un sentido. No se usaron.
- Reacciones: SAP IV no las imprime; no se comparan (se comparan desplazamientos y axiles).

## 3. Resultados (Hekatan TS vs SAP IV vs ETABS)
Desplazamientos, rms relativo % contra ETABS (`tests/datos/*_ref.json`) y SAP IV contra Hekatan. Detalle en `sap4_resultados.json`.
| Modelo (patron) | Hekatan vs ETABS (x/y/z) | SAP IV vs ETABS | SAP IV vs Hekatan |
|---|---|---|---|
| viga voladizo (analitica) | - | Uz 1.5e-5 % | - |
| portico plano 1 vano Dead / Live | 0.00 / 1.6 / 0.2 | 0.01 / 1.6 / 0.2 | 0.01 / 0.00 / 0.00 |
| portico plano LATX | 0.96 / 1.13 / 1.17 | 0.96 / 1.13 / 1.22 | 1.9 / 2.3 / 2.4 |
| galpon simple plano Dead (Uz) | 0.012 | 0.013 | 0.002 |
| galpon simple plano LATX | 0.14 / 0.31 / 0.14 | 0.19 / 0.42 / 0.19 | 0.34 / 0.73 / 0.34 |
| galpon simple plano LATY (Uy) | 0.0003 | 0.0014 | 0.0013 |
| galpon simple card8 (pendiente 3 %) Dead | 8.1 / 1.3 / 0.08 | 8.1 / 1.5 / 0.07 | 0.8 / 1.3 / 0.06 |
| recorte cercha Dead, membrana sin tiras | 11.4 / 8.6 / 1.3 | 91 / 10 / 3.5 | 103 / 5.6 / 2.4 |
| recorte cercha Dead, membrana CON TIRAS | 11.4 / 8.6 / 1.3 | 11.6 / 12.1 / 1.05 | 3.5 / 4.3 / 0.24 |
(x/y del galpon simple plano y card8 son micras: ruido). "Con tiras" = cada panel de membrana 1x4 se parte en tiras que pasan por todos los nudos de barra que caen en sus aristas (el panel unido a todos sus nudos).

Axiles del recorte de cercha (Dead, kN, + traccion, y = 29, x 78.7-85.7), Pj:
| barra | ETABS | Hekatan TS | SAP IV con tiras | SAP IV sin tiras |
|---|---|---|---|---|
| cordon sup. x 78.7-79.7 | 0.05 | 0.35 | 0.26 | 0.01 |
| 79.7-80.7 | -0.22 | -0.43 | -0.40 | -0.21 |
| 80.7-81.7 | -0.36 | -0.92 | -0.87 | -0.34 |
| 81.7-82.7 | -0.41 | **-1.59** | **-1.37** | -0.38 |
| 82.7-83.7 | -0.37 | -0.39 | -0.37 | -0.32 |
| cordon inf. 79.7-80.7 | 5.40 | 5.30 | 5.3 | 6.87 |
| 80.7-81.7 | 6.28 | 6.17 | 6.2 | 7.38 |
| 81.7-82.7 | 4.98 | 4.86 | 4.9 | 5.69 |

## 4. Conclusion: SAP IV NO explica la diferencia del cordon superior
- ✅ La viga, el portico y el galpon simple: SAP IV = Hekatan = ETABS (0.0x a 1-2 %). El flujo y el elemento viga estan bien.
- ✅ En la cercha, con la membrana unida a todos los nudos de sus aristas, SAP IV (formulacion de 1973: membrana CST, otra a la ITW) REPRODUCE a Hekatan, incluida la compresion grande del cordon superior (-1.37 contra -1.59; ETABS -0.41), el cordon inferior (5.3 / 6.2 / 4.9) y los desplazamientos (3.5 / 4.3 / 0.24 %). O sea que lo que da 1.59 kN no es la formulacion de membrana de Hekatan: dos elementos distintos la dan.
- La diferencia con ETABS esta en como ETABS conecta el panel 1x4 (un solo Q4, `ADDRESTRAINT`/edge constraint) con los nudos de barra de sus aristas, no en el elemento. Sin las tiras (nudos de barra sueltos sobre la arista del panel, sin edge constraint) SAP IV da el cordon superior de ETABS (-0.38) pero deja el inferior 1.4 kN por encima (6.9/7.4 contra 5.4/6.3), asi que ETABS no es ni "todo unido" ni "nada unido": lo que hace con el nudo colgado esta entre las dos cosas. Coherente con lo anotado el 5-nov (escalar la membrana x3-x5 acerca el cordon a ETABS).
- ❌ SAP IV no tiene `edge constraint` por interpolacion (solo esclavo = mismo desplazamiento), asi que no se pudo probar la restriccion exacta de ETABS.
- ⚠️ El Python `hekatan_struct.leer_heks` trata `e2klinea ... CARDINALPT` sin `TRANSFORMSTIFF` como "Yes" (comentario en `heks.py` dice que el TS lo hace), pero el TS y ETABS NO transforman la K: el portico plano daba 3.4 % contra ETABS en SAP IV y 0.96 % sin transformar. En el generador SAP IV se anula la transformacion (`sin_transf`). El motor Python con `resolver_heks` por la misma causa difiere del TS en lateral (portico LATX 130 contra 167 mm); no se toco.

## Bitacora
- ✅ 8 ejemplos de SAP-32-64 con sap64 y sap32; PCDOS (9) y FUJITSU (7) compilados y validados.
- ✅ Viga voladizo contra la analitica 1.5e-5 (confirma: carga en eje local 2 usa I33 y As2).
- ❌ Primer intento de cercha: Ux/Uy 91-113 % de error. Causas halladas una a una: punto de insercion transformado sin que ETABS/TS lo haga; membrana sin los nudos colgados (con tiras 3.5 %).
- ❌ Manual y EERC-73-11: escaneos, sin OCR; se leyo el fuente.
- ❌ CDC no compilado.
- ⏳ Emular el edge constraint de ETABS en SAP IV con eslabones de interpolacion lineal (nudo colgado a media arista) para ver si el cordon queda en -0.4 con el inferior en 5.4.
- ⏳ Reacciones por apoyo (SAP IV no las imprime: sumar fuerzas de extremo).
- ⏳ Avisar que `leer_heks` (Python) y el TS no coinciden en `e2klinea` sin TRANSFORMSTIFF.
