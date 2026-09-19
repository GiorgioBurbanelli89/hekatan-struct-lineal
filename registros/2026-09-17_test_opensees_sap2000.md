# La placa contra OpenSees entra en `npm test`, con SAP2000 de juez (17-sep-2026)

Rama `sin-binario`. Sin commit, sin deploy, sin tocar gh-pages.

## Qué se pedía
Que la validación de la PLACA contra OpenSees deje de correrse a mano y entre
en la suite, **siempre con SAP2000 de oráculo**.

## ✅ Funcionó

- **Caso nuevo**: `tests/casos/placa_opensees_vs_sap2000.mjs`, nombre
  `placa-opensees-vs-sap2000`. **15 filas, 3.3 s.**
  ```
  node tests/run.mjs placa_opensees     → OK: 15/15 en 3.3 s
  ```
- **OpenSees corre DE VERDAD en el test**, no es un número guardado: por cada
  t/L se vuelca el modelo resuelto a un dump temporal y se llama a
  `validation/opensees/heks_a_opensees.py … --elem=ShellMITC4`. openseespy está
  instalado en esta máquina y los 5 casos corren en ~1 s en total.
- **Hekatan corre de verdad**: `resolverHeks` sobre los `pl_<t>.heks` que ya
  existían en `validation/opensees/` (se REUSAN, no se regeneran: son los
  mismos ficheros con los que se midió SAP2000, así que la malla es la misma
  nudo a nudo).
- **SAP2000 = el juez**, leído de `validation/opensees/pl_<t>_sap.json`, la
  medida por OAPI del 17-sep. **No se abrió SAP2000 ni una vez** (no hacía
  falta: la medida ya estaba hecha con el mismo modelo).
- Los 15 números **reproducen exactamente** la tabla del README de
  `validation/opensees/` (+0.574/+0.288 · −0.025/−0.309 · −1.061/−1.320 ·
  +0.367/+0.144 · +1.924/+1.760). O sea: el test no mide otra cosa, mide eso.
- **Se salta limpio**: con `PYTHON=python_que_no_existe` sale
  `ok  OpenSees (ShellMITC4)  SALTADO … Solo se miden las filas de Hekatan` y
  la suite sigue en verde (6/6). Las filas saltadas van con `crudo: true` y
  `ok: true`, así que **no cuentan como fallo** (a diferencia de
  `paridad-py-areaspring-edge`, que devuelve `ok: false` y tumba la suite).
- `tests/run.mjs`: el filtro ahora casa también con el **nombre del fichero**,
  no solo con el del caso. Por qué: los casos se llaman con guion
  (`placa-opensees-vs-sap2000`) y los ficheros con guion bajo, y
  `node tests/run.mjs placa_opensees` no encontraba nada. Comprobado que
  `node tests/run.mjs paz` sigue dando sus 12/12.

## ❌ No funcionó / lo que se descartó y por qué

- **Abrir SAP2000 dentro del test** en cada `npm test`: no. SAP2000 tarda ~95 s
  y 4.6 GB solo en el splash (está anotado en memoria), y son 5 modelos. Una
  suite que necesita SAP2000 para pasar no la corre nadie. El juez entra como
  medida guardada, que es lo que ya hacen `galpon-vs-sap2000-oapi` y
  `placa-thick-thin-sano`.
- **ETABS de juez**: no sirve para este banco. Una losa suelta apoyada en su
  perímetro, sin columnas, no le devuelve ni un nudo (medido, README línea
  «⚠️ ETABS no sirve para este banco»). Por eso SAP2000 y no ETABS.
- **El modal de OpenSees en la placa falla** (`ArpackSolver … Starting vector is
  zero`): la placa no lleva masa. No es un problema — `heks_a_opensees.py` ya
  captura la excepción y sigue, y aquí solo interesa el estático. Se le pasan 1
  modo a propósito.
- **La placa THIN no se pudo meter**: existen los `plthin_<t>.heks` pero **no**
  hay `plthin_<t>_sap.json`. Sin la medida de SAP2000 no hay juez, y no se
  inventa. El README da «Hekatan 1.3e−11 % · OpenSees ShellDKGQ 0.000 %» pero
  ese número no tiene fichero que lo respalde en el repo.

## Los límites, y de dónde salen

De la tabla ya MEDIDA en `validation/opensees/README.md` (17-sep-2026), no de
una idea de lo que «debería» salir. Cada límite = |medido| + ~0.4 % de margen:

| t/L | Hek medido | límite | OS medido | límite | separación medida | límite |
|---|---|---|---|---|---|---|
| 0.001 | +0.574 % | 1.0 | +0.288 % | 0.7 | 0.286 % | 0.5 |
| 0.01 | −0.025 % | 0.5 | −0.309 % | 0.7 | 0.284 % | 0.5 |
| 0.05 | −1.061 % | 1.5 | −1.320 % | 1.8 | 0.259 % | 0.5 |
| 0.1 | +0.367 % | 0.8 | +0.144 % | 0.6 | 0.223 % | 0.5 |
| 0.2 | +1.924 % | 2.5 | +1.760 % | 2.3 | 0.164 % | 0.5 |

No son tolerancias de ingeniería (nadie «acepta» un 2 %): son un **cerco**. Si
alguien toca la placa gruesa y mueve cualquiera de estos números, el test lo
dice. La tercera fila de cada espesor es la afirmación fuerte del banco:
**Hekatan y OpenSees se apartan de CSI con el MISMO signo y a menos de 0.3 %
uno de otro** → la desviación no es un error de Hekatan, es que **la placa
gruesa de CSI no es un MITC4**. Esa fila falla también si cambia el signo.

## ⏳ Falta

1. **La placa THIN con SAP2000 de juez**: hay que correr
   ```
   python validation/opensees/csi_modal_fuerzas.py sap plthin_<t>_dump.json plthin_<t>_sap.json --placa
   ```
   para t/L = 0.001, 0.01, 0.05, 0.1, 0.2 (SAP2000 abierto UNA vez, los 5
   seguidos). Con eso entran 10 filas más: Hekatan DKQ y OpenSees `ShellDKGQ`,
   donde lo esperado es 0.000 % en los dos (el Thin sí es el mismo elemento).
2. **Volver a medir SAP2000 sobre estos mismos .heks** para confirmar que los
   `pl_<t>_sap.json` siguen siendo del modelo actual:
   ```
   node tests/lib/dump_heks.mjs validation/opensees/pl_0.05.heks validation/opensees/pl_0.05_dump.json
   python validation/opensees/csi_modal_fuerzas.py sap validation/opensees/pl_0.05_dump.json validation/opensees/pl_0.05_sap.json --placa
   ```
   Hoy **no se midió**: se reutilizó la medida del 17-sep. Se dice explícito.
3. **`ASDShellQ4` y `ShellDKGQ`** en el mismo banco: el traductor los acepta con
   `--elem=`, y el README ya los tiene medidos. No se metieron para no inflar la
   suite antes de cerrar el punto 1.
4. El `npm test` completo no se volvió a correr entero (261 s); solo el caso
   nuevo y `paz` para comprobar que el cambio del filtro no rompe nada.
