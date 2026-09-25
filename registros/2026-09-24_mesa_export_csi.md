# 2026-09-24 — Exportadores ETABS (.e2k) / SAP2000 (.s2k) de la Mesa de Torsion general

Regla: NO abrir ETABS/SAP2000 (live con poca RAM). Validar contra los parsers + motor de Hekatan Struct.

## Sintaxis verificada en ficheros REALES (no inventada)
- LINELOAD TRAPF: `LINELOAD "B195" "Entrepiso" TYPE "TRAPF" DIR "GRAV" LC "GRAV" FSTART v FEND v RDSTART 0 RDEND 0.066`
  (galpon_scp.$et, escrito por ETABS; varias lineas por barra = tramos que se suman).
- Modificador de peso/masa de cascara: `SHELLPROP "Stiff1" M11MOD 100 ... MMOD 0 WMOD 0` (e2k real).
- OBJMESHTYPE "NOAUTOMESH" (heks_a_csi.mjs: "NONE" no es valor de ETABS, remalla).
- s2k: `AREA LOADS - UNIFORM` (Dir=Z UnifLoad=-2, $2k de SAP), `FRAME LOADS - DISTRIBUTED` RelDist,
  `AREA STIFFNESS MODIFIERS ... MassMod WeightMod`.

## Bitacora
- ✅ `benchmarks/mesa_export_csi.py` (to_e2k N-mm, to_s2k kN-m). Malla explicita, offsets=0, sin diafragma,
  vigas AUTOMESH NO, losas NOAUTOMESH, columnas piso a piso, cargas nativas (SELFWEIGHT, TRAPF, UNIFF).
- ✅ `tests_convergencia/test_csi_roundtrip.py` + `.mjs` (12 casos x 2 formatos, 17 s):
  - geometria (nudos, barras, areas, coords 1e-15 m, secciones 2.5e-8 %, apoyos): OK en los 24 ficheros.
  - carga que PIDE el fichero (lector propio) = mesa_modelo a 0.0000 % en D/SCP/L, los 24.
  - Variante B (K del parser + F de mesa): Hekatan Struct WASM = mesa_modelo, max 0.010 % (T viga membrana).
- ❌ Variante A (parser puro) NO cierra, y NO es el fichero: son huecos de los PARSERS de Hekatan Struct:
  - e2kParser: no lee `LINELOAD TYPE "TRAPF"` (solo UNIFF) -> membrane/none pierden SCP y L enteros.
  - e2kParser: ignora `MMOD/WMOD` de SHELLPROP -> waffle D +27..33 % (pesa t_eq, no t_peso);
    membrane D: el total cuadra por casualidad (pesa la losa en los nudos en vez de las TRAPF perdidas).
  - e2kParser: peso propio de barras LUMPED (rho A L/2, sin wL2/12) -> shellthin D: V viga -6..-10 %, M ~1 %.
  - s2kParser: ignora `AREA LOADS - UNIFORM` y `SelfWtMult` -> shellthin/waffle L=0 y D=0.
  - s2kParser: `FRAME LOADS - DISTRIBUTED` toma FOverLA en toda la barra (ignora RelDist y FOverLB) -> +36 %.
- ⏳ Fase 2 (con RAM libre): run_etabs.py / run_sap2000.py (preparados, NO ejecutados).

## Arreglo de los 5 huecos de carga en los parsers (pedido del usuario)
- ✅ `examples/src/shared/cargaBarraConsistente.ts` (NUEVO): carga lineal a trozos -> vector nodal consistente
  (Hermite transversal + lineal axial, Gauss 3 = exacto) y su empotramiento. Lo usan los dos parsers.
- ✅ `hekatan-fem/src/analyze.ts` + `data-model.ts`: campo `elementInputs.frameFixedEnd` (12, globales) que
  analyze suma a k·u (TS puro, NO hace falta recompilar WASM).
- ✅ e2kParser: LINELOAD TRAPF (RDSTART/RDEND, varias por barra), UNIFF ahora tambien corrige esfuerzos,
  MMOD/WMOD de SHELLPROP (peso y masa), peso propio de barras consistente (formula del cliModeler, luz libre).
- ✅ s2kParser: AREA LOADS - UNIFORM (∫N dA), SelfWtMult (UnitWeight, WMod/MMod de seccion, WeightMod/MassMod
  de area), FRAME LOADS con RelDist/AbsDist/FOverLB/Dir=Gravity. Bug cazado: Frame=1 y Area=1 comparten
  nombre -> un mapa por tipo.
- ❌->✅ Efecto colateral cazado por `ciclo-csi-ficheros`: e2kExporter modo "auto" restaba solo W/2 del peso
  propio y dejaba el MOMENTO de empotramiento en los POINTLOAD (ETABS lo contaba 2 veces). Arreglado
  (e2kExporter.ts, bloque swDecl): cimentacion 4.24 % -> 0.000 %.
- ✅ Mesa: variante A (parser) = variante B, max 0.0101 % en 12 casos x e2k/s2k (torsion minima con membrana,
  es el elemento, no la carga). Cargas por patron 0.00 % en los 72.
- ⚠️ col_N en D: mesa_modelo da el axil del CENTRO de columna (peso de columna lumped sin corregir);
  el parser consistente da el de EXTREMO (+w/2, como CSI). El test compara contra `resumen_cons`.
- ✅ npm test: antes 654/684, despues 654/684, los MISMOS 30 fallos previos (bundle desactualizado,
  boveda/automesh, test-m-dual 'DEV', muelle de area SAFE, Python vs WASM muelles).

## Waffle como ETABS (tras el cambio de mesa_modelo: t = h + 10 modificadores del RE)
- ✅ `mesa_export_csi.py`: e2k `waffle_mode="native"` (defecto) = `SLABTYPE "Waffle"` OVERALLDEPTH/SLABTHICKNESS/
  SLABRIBWIDTHTOP/BOTTOM/SLABRIBSPACING1/2 (claves del RE); `waffle_mode="mods"` = ShellThin h + F11MOD..V23MOD
  MMOD WMOD. s2k = Shell-Thin Thickness=BendThick=h + `AREA STIFFNESS MODIFIERS` f11..v23 MassMod WeightMod.
- ✅ `examples/src/shared/losaReticular.ts` (NUEVO): espejo TS de `_T_props`/`torsion_J_T`/`waffle_equiv`
  (Prandtl FD 2 mallas + Richardson, CG; round() de Python para la MISMA malla). = Python a 1e-11 (recto y
  trapecial). ⚠️ la malla depende de las cotas absolutas: se calcula en METROS (en mm el trapecio daba 0.3 %).
- ✅ e2kParser: `SLABTYPE "Waffle"` -> espesor h + modificadores que MULTIPLICAN a los del usuario (masa/peso
  con MMOD/WMOD). Ribbed sin tocar (sigue con pesoFactor; el RE dice que ETABS tambien la pasa con mods: ⏳).
- ✅ Roundtrip 12 casos + waffle_mods (15 modelos x e2k/s2k): cargas 3e-9 %, A = B, max 0.0101 %
  (membrana, torsion); waffle max 0.0075 %. mesa_modelo ya da el axil de extremo de columna: `resumen_cons`
  retirado, y la variante B corrige tambien el `col_sw`.
- ✅ npm test 654/684, mismos 30 fallos previos (una pasada intermedia murio por OOM de node en
  mesa-torsion-malla; aislado da 19/19 y la siguiente pasada completa salio limpia).
- ⏳ Fase 2: ETABS con la waffle NATIVA -> leer sus modificadores (sobre todo M12, la J de su FE) y compararlos.
