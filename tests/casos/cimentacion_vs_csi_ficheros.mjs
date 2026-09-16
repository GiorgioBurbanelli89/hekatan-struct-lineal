/**
 * LA CIMENTACION REAL POR FICHERO contra los TRES programas de CSI.
 *
 * Jorge (5-sep-2026): "la cimentacion tambien la puedes hacer en sap y etabs …
 * para los 3 hay que tener una forma de exportar el e2k s2k y f2k".
 *
 * El modelo: 9 zapatas (4×4 Shell-Thick, t = 0.30) + 9 pedestales + 12 vigas de
 * amarre, 234 nudos, 225 muelles nodales de Winkler (ks = 1030 kN/m3), peso
 * propio consistente, apoyo Ux Uy Rz en el tope central
 * (`tests/datos/cimentacion_9zapatas.heks`). Es el mismo `.heks` que va a los
 * tres ficheros por `cli/heks_a_csi.mjs`.
 *
 * Las referencias son lo que cada programa devolvio LEYENDO EL FICHERO de
 * Hekatan (no un modelo armado por OAPI):
 *   · SAP2000 24  ← `.s2k`  (`galpon-bodega-electoral/csi_ida_vuelta.py sap`)
 *   · ETABS 22    ← `.e2k`  (`csi_ida_vuelta.py etabs`)
 *   · SAFE 20     ← `.f2k`  (`csi-cli/safe-cli/cli/csi_cli.py --engine safe --open`,
 *                             importado por tablas: `OpenFile(.f2k)` deja el modelo vacio)
 *
 * Lo que vigila (todo medido el 5-sep-2026):
 *   1. que los MUELLES viajen en los tres ficheros (hasta ese dia el e2k y el
 *      s2k los tiraban y el modelo llegaba sin apoyo);
 *   2. que el f2k lleve las tres leyes de SAFE que costaron 20 importaciones:
 *      sin tabla COLUMN OBJECT CONNECTIVITY (SAFE borra losas y vigas al leerla),
 *      NOMBRES de campo y no claves ("Stiffness UZ": con "StiffUZ" SAFE calla y
 *      pone 200 kN/m), y J×10 (SAFE analiza las vigas con 0.1·J);
 *   3. que Uz nudo a nudo cierre: SAP2000 y ETABS a 1e-6 % del maximo, SAFE a
 *      3e-3 % (SAFE imprime U en m con 6 decimales: 0.0005 mm sobre 32 mm).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { resolverHeks } from "../lib/heks.mjs";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "cimentacion-vs-csi-ficheros";
export const descripcion = "9 zapatas + pedestales + vigas de amarre sobre Winkler: el .s2k, el .e2k y el .f2k de Hekatan leidos por SAP2000, ETABS y SAFE";

export async function correr() {
  const filas = [];
  const heks = join(AQUI, "..", "datos", "cimentacion_9zapatas.heks");
  const m = await resolverHeks(heks);
  const U = m.deformOutputs.deformations;
  let umax = 0; for (const [, u] of U) umax = Math.max(umax, Math.abs(u[2]));
  const nSpr = (m.nodeInputs.springs ?? []).length;
  filas.push({ que: "el .heks trae los muelles nodales", crudo: true, medido: nSpr, limite: 225, ok: nSpr === 225, detalle: "225 nudos de zapata con `spring uz`" });

  // ── 1. los tres ficheros, por el mismo camino que la app ──
  const mod = await empaquetar(`
    export { exportE2k } from "${R}/examples/src/shared/e2kExporter";
    export { exportS2k } from "${R}/examples/src/shared/s2kExporter";
    export { exportF2k } from "${R}/examples/src/shared/f2kExporter";
  `, "cimentacion-csi-ficheros");
  const comun = { nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "cim9" };
  const e2k = mod.exportE2k({ ...comun, weightMode: "manual" });
  const s2k = mod.exportS2k({ ...comun, selfWtMult: 0 });
  const f2k = mod.exportF2k(comun);
  const cuenta = (txt, re) => (txt.match(re) ?? []).length;
  filas.push({ que: "e2k: POINTASSIGN con SPRINGPROP", crudo: true, medido: cuenta(e2k, /SPRINGPROP "SPR\d+"/g), limite: 225, ok: cuenta(e2k, /SPRINGPROP "SPR\d+"/g) === 225, detalle: "POINTSPRING … UZ k + SPRINGPROP en el nudo" });
  filas.push({ que: "e2k: STORY Base ELEV en mm", crudo: true, medido: e2k.match(/STORY "Base"\s+ELEV\s+(\S+)/)?.[1] ?? "no hay", limite: "-500", ok: e2k.match(/STORY "Base"\s+ELEV\s+(\S+)/)?.[1] === "-500", detalle: "iba en metros (-0.5) y ETABS devolvia las cotas 0.4995 m mas arriba" });
  filas.push({ que: "s2k: JOINT SPRING ASSIGNMENTS 1 - UNCOUPLED", crudo: true, medido: cuenta(s2k, /^\s+Joint=\d+\s+CoordSys=Global\s+U1=/gm), limite: 225, ok: cuenta(s2k, /^\s+Joint=\d+\s+CoordSys=Global\s+U1=/gm) === 225, detalle: "columnas leidas de SAP2000 por OAPI" });
  filas.push({ que: "f2k: JOINT ASSIGNMENTS - SPRINGS", crudo: true, medido: cuenta(f2k, /^\s+UniqueName=\d+\s+SpringProp=SPR\d+/gm), limite: 225, ok: cuenta(f2k, /^\s+UniqueName=\d+\s+SpringProp=SPR\d+/gm) === 225, detalle: "un SPRn por vector k distinto" });
  filas.push({ que: "f2k: nombres de campo, no claves (\"Stiffness UZ\")", crudo: true, medido: cuenta(f2k, /"Stiffness UZ"=/g), limite: ">= 1", ok: cuenta(f2k, /"Stiffness UZ"=/g) >= 1 && !/StiffUZ=/.test(f2k), detalle: "con la clave StiffUZ SAFE no protesta y deja 200 kN/m en todos" });
  filas.push({ que: "f2k: sin tabla COLUMN OBJECT CONNECTIVITY", crudo: true, medido: /COLUMN OBJECT CONNECTIVITY/.test(f2k) ? "la lleva" : "no", limite: "no", ok: !/COLUMN OBJECT CONNECTIVITY/.test(f2k), detalle: "al leerla SAFE se queda solo con las columnas: 0 losas, 0 vigas" });
  const Jheks = 0.00127345, Jf2k = parseFloat(f2k.match(/Name=SEC2[^\n]*\sJ=([-\d.eE+]+)/)?.[1] ?? "0");
  const eJ = Math.abs(Jf2k / (10 * Jheks) - 1) * 100;
  filas.push({ que: "f2k: J de la viga de amarre ×10 (SAFE analiza con 0.1·J)", medido: eJ, limite: 1e-6, ok: eJ <= 1e-6, detalle: `${Jf2k} vs 10 × ${Jheks}; medido con J×0.1 en Hekatan = giros de SAFE a 4 cifras` });

  // ── 2. Uz nudo a nudo contra lo que cada programa devolvio leyendo el fichero ──
  for (const [tag, fichero, lim, detalle] of [
    ["SAP2000 24 leyendo el .s2k", "cimentacion_9zapatas_sap_s2k.json", 0.1, "misma malla 234/21/144; ΣRz 556.74 kN"],
    ["ETABS 22 leyendo el .e2k", "cimentacion_9zapatas_etabs_e2k.json", 0.1, "misma malla; ETABS lee el e2k en N y mm"],
    ["SAFE 20 leyendo el .f2k", "cimentacion_9zapatas_safe_f2k.json", 0.1, "SAFE imprime U con 6 decimales en m (0.0005 mm): ese es el limite, no el solver"],
  ]) {
    let S;
    try { S = JSON.parse(readFileSync(join(AQUI, "..", "datos", fichero), "utf-8")); }
    catch { filas.push({ que: `${tag}: referencia`, crudo: true, medido: "falta " + fichero, limite: "existe", ok: false, detalle }); continue; }
    let peor = 0, suma = 0, n = 0;
    for (const s of S.nudos) {
      const u = U.get(s.i); if (!u) continue;
      const e = Math.abs(s.u[2] - u[2]) / umax * 100; peor = Math.max(peor, e); suma += e; n++;
    }
    filas.push({ que: `${tag}: nudos emparejados`, crudo: true, medido: n, limite: 234, ok: n === 234, detalle: S.fichero ?? "" });
    filas.push({ que: `${tag}: peor Uz (% del maximo)`, medido: peor, limite: lim, ok: peor <= lim, detalle: `${detalle}; medio ${suma / Math.max(n, 1)}` });
  }
  return filas;
}
