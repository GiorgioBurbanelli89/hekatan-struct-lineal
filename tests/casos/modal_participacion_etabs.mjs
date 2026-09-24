/**
 * Modal y PARTICIPACIÓN DE MASA (UX, UY, RZ) contra ETABS 22 — test-m-dual.
 *
 * ## Por qué faltaba, aunque la referencia llevaba tiempo medida
 *
 * La suite tenía cinco casos de modal: `paz_6_3` (frecuencias contra ETABS),
 * `masa_lump_etabs` (la báscula, nudo a nudo), `modal_as_ang` (que `ang` y `as`
 * lleguen), `modal_todos` (que ningún ejemplo deje el panel vacío) y
 * `unidades_masa` (densidades coherentes).
 *
 * **Ninguno miraba la participación de masa.** Y la referencia estaba ahí desde
 * hacía tiempo, en `validacion/etabs-api/etabs_testM_dual_full.json`: 12 modos
 * con T, UX, UY, UZ, RZ y acumulados, sacados de ETABS 22 sobre el mismo modelo.
 *
 * Eso importa porque la participación **no** se deduce de las frecuencias. Ya
 * hubo un fallo que dejó las frecuencias intactas y hundió la participación un
 * 3.4 % en UX/UY y un 6.1 % en RZ: el divisor usaba la masa TOTAL en vez de la
 * masa de los grados LIBRES, así que la masa agrupada en los apoyos —que no se
 * mueve nunca— entraba al denominador. Está contado en `modal.cpp`. Un caso de
 * frecuencias no lo habría visto.
 *
 * Y es lo que decide un diseño sísmico: la NEC pide el 90 % de masa acumulada.
 *
 * ## Lo medido (2026-08-20)
 *
 * | modo | T Hekatan | T ETABS | dif | UX | UY | RZ |
 * |---|---|---|---|---|---|---|
 * | 1 | 0.48491 | 0.48323 | +0.35 % | 0.8357/0.8422 | 0.0006/0.0011 | 0.0010/0.0016 |
 * | 2 | 0.43277 | 0.43874 | −1.36 % | 0.0011/0.0020 | 0.4307/0.4162 | 0.4209/0.4428 |
 * | 3 | 0.15450 | 0.15426 | +0.16 % | 0.1039/0.1047 | 0.0005/0.0005 | 0.0006/0.0009 |
 * | 4 | 0.14073 | 0.14233 | −1.12 % | 0.0012/0.0014 | 0.0168/0.0210 | 0.1002/0.0914 |
 * | 5 | 0.11846 | 0.11576 | +2.33 % | 0.0000/0.0000 | 0.4010/0.4074 | 0.3208/0.3143 |
 * | 6 | 0.08791 | 0.08805 | −0.17 % | 0.0345/0.0350 | 0.0014/0.0010 | 0.0014/0.0014 |
 *
 * `ΣUX` 0.9924 vs 1.0000 · `ΣUY` 0.9874 vs 0.9927.
 *
 * ## ⚠️ Del modo 10 en adelante NO se puede arbitrar: la MALLA no es la misma
 *
 * Los modos 10–12 se separan 6.8 %, 5.8 % y 4.4 %. **No es la cola sin masa**:
 * el modo 10 lleva `UY = 0.1081` y `RZ = 0.0959`, y es justo el que sube `ΣUY`
 * de 0.8640 a 0.9721 — o sea **el que cruza el 90 % de la NEC**. Importa.
 *
 * Pero **no son el mismo modelo**, y eso invalida la comparación ahí:
 *
 * | | nudos | elementos |
 * |---|---|---|
 * | ETABS 22 | 333 | 260 cáscaras + 291 barras |
 * | Hekatan, `ms` = 0.75 (defecto) | 1011 | 1268 |
 * | Hekatan, `ms` = 1.25 | 356 | 516 |
 *
 * Y no es solo el TAMAÑO, es el **álgebra del mallado**. El script que generó la
 * referencia llama:
 *
 * ```python
 * SetAutoMesh(name, 3, 0, 0, sz, sz, PointOnEdgeFromLine=True,
 *             PointOnEdgeFromPoint=True, ...)
 * ```
 *
 * ETABS hace un **cookie-cut** que mete nudos **donde caen vigas y columnas**;
 * nosotros mallamos en rejilla uniforme. Con eso, los modos globales (1–9)
 * coinciden —esos los manda la rigidez total— y los altos no, porque su forma ya
 * depende de dónde estén los nudos.
 *
 * Lo confirma el barrido, y de la peor manera para una hipótesis de
 * convergencia: **el error del modo 10 BAJA al ENGROSAR** nuestra malla —
 * 7.26 % (ms 0.5) · 6.81 % (0.75) · 6.24 % (1.0) · 5.40 % (1.25) · 1.00 % (2.5).
 * Un error de discretización no hace eso.
 *
 * Y no lo explica ni la placa ni el drilling. Medido con las combinaciones, en
 * `T10`: Thick+HB 6.81 %, Thin+HB 6.85 %, Thin+ITW 6.38 %, DKMQ+ITW 7.79 %,
 * Thick+ITW 6.33 %. **Ninguna baja del 6 %** con la malla por defecto.
 *
 * Por eso este caso arbitra **hasta el modo 9** —donde ETABS tiene `ΣUX` en
 * 1.0000 exacto y nosotros cerramos al 1.7 %— y de ahí en adelante solo REGISTRA,
 * con banda, para que se vea si cambia. Cerrarlo de verdad pide construir el
 * modelo sobre **los nudos de análisis de ETABS**, no sobre una rejilla nuestra.
 *
 * ## Dos cosas del montaje que NO son opcionales
 *
 * 1. **La densidad va dividida por `g`.** Los ejemplos guardan peso específico;
 *    el modal quiere masa. Sin eso las frecuencias salen √9.81 = 3.13 veces mal.
 * 2. **Masa SOLO LATERAL** (el 6º argumento de `modalAnalysis` = 1). Es el
 *    `INCLUDEVERTICALMASS "No"` del mass source de ETABS. Con la vertical dentro
 *    aparecen modos verticales que roban cupos y `ΣUX`/`ΣUY` se quedan cortos en
 *    12 modos — o sea que se compararían dos tablas distintas.
 *
 * ## La tolerancia, y por qué es ABSOLUTA en la participación
 *
 * Un modo con UX = 0.0006 contra 0.0011 es un 45 % de error relativo y no
 * significa nada: los dos son cero a efectos de diseño. Por eso la participación
 * se juzga en **diferencia absoluta**, y solo en los modos que de verdad
 * participan (> 5 %). El acumulado sí va en relativo, que es como lo lee la NEC.
 */
import { empaquetar, R } from "../lib/bundle.mjs";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const REF_JSON = join(AQUI, "..", "..", "..", "validacion", "etabs-api",
                      "etabs_testM_dual_full.json");

const N_MODOS = 12;
// La tolerancia del periodo va atada a la MASA QUE MUEVE el modo, no al numero
// de modo. Un modo que arrastra el 40 % de la masa decide el cortante basal y
// tiene que estar clavado; uno que arrastra el 0.1 % no cambia nada de un diseno
// y ademas es donde cualquier discretizacion se separa antes — la cola alta del
// espectro es lo primero que difiere entre dos mallas equivalentes.
const TOL_T = 3.0;        // % hasta el modo 9 (el peor medido: 2.33)
const ARBITRA_HASTA = 9;  // de aqui en adelante la malla ya no es comparable
// Banda de los modos 10-12: NO es una tolerancia, es un registro. Falla tambien
// si MEJORA, para que el dia que se monte sobre los nudos de ETABS se note.
const BANDA_ALTOS = { 10: [4.0, 9.0], 11: [3.5, 8.0], 12: [2.5, 7.0] };
const TOL_P = 0.035;      // absoluto en UX/UY/RZ (el peor medido: 0.0219 en RZ)
const MIN_P = 0.05;       // por debajo de esto el modo no participa: no se juzga
const TOL_SUM = 2.0;      // % en el acumulado de 12 modos

export const nombre = "modal-participacion-etabs";
export const descripcion =
  "T y participacion UX/UY/RZ de test-m-dual contra ETABS 22 (12 modos)";

export async function correr() {
  const REF = JSON.parse(readFileSync(REF_JSON, "utf8"));
  const { testMDual, modalAnalysis } = await empaquetar(
    `export { testMDual } from "${R}/examples/src/test-m/testM";\n` +
    `export { modalAnalysis } from "${R}/hekatan-fem/src/index";\n`, "modalpart");

  const van = (v) => ({ val: v });
  const st = {
    nodes: van([]), elements: van([]), nodeInputs: van({}), elementInputs: van({}),
    deformOutputs: van({}), analyzeOutputs: van({}), objects3D: van([]),
  };
  const p = Object.fromEntries(
    Object.entries(testMDual.params).map(([k, d]) => [k, d.default]));
  // El panel del workspace no existe fuera del navegador; el modelo sí se monta.
  testMDual.build(p, st, { render() {}, set() {} });

  const ei = st.elementInputs.val;
  const eiMass = { ...ei,
    densities: new Map([...ei.densities].map(([k, v]) => [k, v / 9.80665])) };
  const out = modalAnalysis(st.nodes.val, st.elements.val, st.nodeInputs.val,
                            eiMass, N_MODOS, 1);   // 1 = masa solo lateral
  const f = out.frequencies ?? [], mp = out.massParticipation ?? [];

  const filas = [];
  filas.push({
    que: "el modal resuelve y devuelve los 12 modos con su participacion",
    medido: f.length, limite: N_MODOS, ok: f.length === N_MODOS && mp.length === N_MODOS,
    detalle: `${st.nodes.val.length} nudos · ${st.elements.val.length} elementos`
           + ` · participacion ${mp.length}x${mp[0]?.length ?? 0}`,
    crudo: true,
  });
  if (f.length !== N_MODOS) return filas;

  // ── los periodos, modo a modo ───────────────────────────────────────────
  for (let i = 0; i < N_MODOS; i++) {
    const T = 1 / f[i], Te = REF.T[i];
    const d = Math.abs(T / Te - 1) * 100;
    const masa = (REF.UX[i] ?? 0) + (REF.UY[i] ?? 0) + (REF.RZ[i] ?? 0);
    const banda = BANDA_ALTOS[i + 1];
    if (i + 1 <= ARBITRA_HASTA) {
      filas.push({
        que: `T modo ${i + 1} vs ETABS`,
        medido: d, limite: TOL_T, ok: d <= TOL_T,
        detalle: `${T.toFixed(5)} s vs ${Te.toFixed(5)} s`
               + ` — mueve el ${(masa * 100).toFixed(2)} % (UX+UY+RZ)`,
      });
    } else if (banda) {
      filas.push({
        que: `T modo ${i + 1} [MALLA DISTINTA, ver cabecera] banda ${banda[0]}-${banda[1]} %`,
        medido: d, limite: banda[1], ok: d >= banda[0] && d <= banda[1],
        detalle: d < banda[0]
          ? `MEJORO (${T.toFixed(5)} s): ¿se monto sobre los nudos de ETABS? actualiza la banda`
          : d > banda[1]
          ? `EMPEORO (${T.toFixed(5)} s)`
          : `${T.toFixed(5)} s vs ${Te.toFixed(5)} s — mueve el ${(masa * 100).toFixed(2)} %`,
      });
    }
  }

  // ── la participacion, solo donde el modo PARTICIPA ──────────────────────
  // `massParticipation` viene por columnas [UX, UY, UZ, RX, RY, RZ].
  // Regla de Jorge (18-sep-2026): la participacion se mira con las SEIS direcciones.
  // ETABS solo vuelca UX, UY, UZ y RZ en `etabs_testM_dual_full.json`; RX y RY no
  // tienen referencia, asi que se informan (fila `crudo`) pero no se puntuan.
  for (const [nom, col, ref] of [["UX", 0, REF.UX], ["UY", 1, REF.UY],
                                 ["UZ", 2, REF.UZ], ["RZ", 5, REF.RZ]]) {
    let peor = 0, dondePeor = 0, mirados = 0;
    for (let i = 0; i < N_MODOS; i++) {
      const a = mp[i]?.[col] ?? 0, b = ref[i];
      if (Math.max(a, b) < MIN_P) continue;          // ruido, no participa
      mirados++;
      const d = Math.abs(a - b);
      if (d > peor) { peor = d; dondePeor = i + 1; }
    }
    filas.push({
      que: `${nom} · la peor diferencia ABSOLUTA de los modos que participan`,
      medido: peor, limite: TOL_P, ok: peor <= TOL_P,
      detalle: `${mirados} modos por encima del ${MIN_P * 100} % · peor en el modo `
             + `${dondePeor} (${(mp[dondePeor - 1]?.[col] ?? 0).toFixed(4)} vs `
             + `${ref[dondePeor - 1]?.toFixed(4)})`,
      crudo: true,
    });
  }

  // ── el acumulado: lo que de verdad mira la NEC ──────────────────────────
  for (const [nom, col, ref] of [["ΣUX", 0, REF.SumUX], ["ΣUY", 1, REF.SumUY],
                                 ["ΣUZ", 2, REF.SumUZ]]) {
    const s = mp.slice(0, N_MODOS).reduce((a, r) => a + (r?.[col] ?? 0), 0);
    const se = ref[N_MODOS - 1];
    // ETABS por defecto NO mete masa vertical (INCLUDEVERTICALMASS "No"): su SumUZ vale
    // 0.0000 exacto. Contra un cero no hay razon que calcular ni 90 % que exigir, asi que
    // la fila se INFORMA. No es una tolerancia relajada: es que no hay referencia.
    if (se === 0) {
      filas.push({
        que: `${nom} en ${N_MODOS} modos (Hekatan)`,
        medido: s * 100, limite: 100, ok: true,
        detalle: `${(s * 100).toFixed(2)} % — ETABS trae SumUZ = 0.0000: su fuente de masa `
               + `no incluye la vertical, no hay con que comparar`,
        crudo: true,
      });
      continue;
    }
    const d = Math.abs(s / se - 1) * 100;
    filas.push({
      que: `${nom} en ${N_MODOS} modos vs ETABS`,
      medido: d, limite: TOL_SUM, ok: d <= TOL_SUM,
      detalle: `${s.toFixed(4)} vs ${se.toFixed(4)} — la NEC pide el 90 %`,
    });
    filas.push({
      que: `${nom} pasa del 90 % (el criterio de la NEC)`,
      medido: s * 100, limite: 90, ok: s >= 0.90,
      detalle: col === 2
        ? `${(s * 100).toFixed(2)} % — Z NO es direccion de analisis sismico: informativo`
        : `${(s * 100).toFixed(2)} %`,
      crudo: true,
    });
  }

  // ── las tres sumatorias de ROTACION: sin referencia de ETABS, se INFORMAN ──
  // Jorge, 18-sep-2026: «la participacion de masa hasta sumatoria de Rz».
  for (const [nom, col] of [["ΣRX", 3], ["ΣRY", 4], ["ΣRZ", 5]]) {
    const s = mp.slice(0, N_MODOS).reduce((a, r) => a + (r?.[col] ?? 0), 0);
    filas.push({
      que: `${nom} en ${N_MODOS} modos (Hekatan)`,
      medido: s * 100, limite: 100, ok: true,
      detalle: `${(s * 100).toFixed(2)} % — sin referencia en etabs_testM_dual_full.json`,
      crudo: true,
    });
  }

  return filas;
}
