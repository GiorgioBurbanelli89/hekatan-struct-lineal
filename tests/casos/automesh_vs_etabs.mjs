/**
 * `automesh <tam>`: el AUTOMALLADO de ETABS (`AUTOMESHOPTIONS ... FLOORMESHMAXSIZE 1250`, 1.25 m
 * de fábrica) reproducido en Hekatan, contra el modelo de ANÁLISIS de ETABS 22.
 *
 * Por qué existe: Hekatan resuelve LA MALLA QUE SE LE DA. Una losa de 5×5 que llega como UN paño
 * (lo normal en un `.e2k` de ETABS) él la parte en 16 celdas de 1.25 m y Hekatan no: no son el
 * mismo modelo, y la diferencia es de convergencia de malla, no del elemento.
 *
 * Referencia: `validation/isse/automesh/pointelm_noadd.json`, los 25 nudos del modelo de análisis
 * de ETABS (`PointElm`, no `PointObj`: los que crea al mallar no son objetos) del mismo paño.
 *
 * ⚠️ Ese fichero se leyó con el `.e2k` corregido a `ADDRESTRAINT "No"`. Con `"Yes"` —lo que
 * escribía el exportador hasta el 8-sep-2026— ETABS EMPOTRA todos los nudos nuevos del borde que
 * tocan un nudo restringido, y la misma losa sale 7 veces más rígida (4.99e-4 contra 3.58e-3).
 * Es lo que se cazó con este caso, y `"No"` es lo que escribe ETABS en su propio `.$et`.
 *
 * Diagnóstico del 6-oct-2026 (registros/2026-10-05_struct_lo_que_falta_6_casos.md): con Shell-THIN la misma malla
 * da Struct = SAP2000 0.000 %, y ETABS Thick = SAP2000 Thick 0.00000 % (validation/placa_gruesa/sap_misma_malla.json).
 * Lo que queda en Thick (w 4.7 %, giro junto al apoyo 11.9 %) es SOLO el elemento grueso, y en esta losa apoyada en
 * 4 PUNTOS no se puede arbitrar con malla fina: el apoyo puntual de Mindlin es singular y la flecha NO converge en
 * ningún programa (Struct y SAP: 4→32 celdas, 4.7/6.9/6.7/5.8 %). La placa gruesa se juzga en `placa-gruesa-navier`
 * (Navier/Reddy exactas y SAP2000 con malla fina). Aquí: la MALLA (25 nudos) y el Thin nudo a nudo, 6 gdl.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "automesh-vs-etabs";
export const descripcion = "automesh 1.25 m = el automallado de ETABS (paño 5×5 -> 16 celdas, 25 nudos)";

const REF = "validation/isse/automesh/pointelm_noadd.json";
const HEKS = "validation/isse/automesh/losa_sola.heks";
const SAP = "validation/placa_gruesa/sap_misma_malla.json";

export async function correr() {
  if (!existsSync(REF) || !existsSync(HEKS)) {
    return [{ que: "referencia de ETABS", medido: 0, limite: 0, ok: false,
              detalle: `falta ${REF} — ver validation/isse/automesh/` }];
  }
  const E = JSON.parse(readFileSync(REF, "utf-8"));
  const eu = new Map();
  for (const v of Object.values(E)) if (v.u) eu.set([v.x, v.y, v.z].map((c) => c.toFixed(3)).join(","), v.u);
  let wmax = 0;
  for (const u of eu.values()) wmax = Math.max(wmax, Math.abs(u[2]));

  const base = readFileSync(HEKS, "utf-8").replace(/\r?\nsolve\s*$/, "\n");
  const tmp = "validation/isse/automesh/_caso.heks";
  const filas = [];
  const wc = (r) => r.deformOutputs.deformations.get(r.nodes.findIndex((p) => Math.abs(p[0] - 2.5) < 1e-6 && Math.abs(p[1] - 2.5) < 1e-6))[2];
  const SM = JSON.parse(readFileSync(SAP, "utf-8")).modelos;
  const k3 = (p) => p.map((c) => c.toFixed(3)).join(",");
  const sapThin = new Map(SM["losa_4_thin"].nodos.map((p, i) => [k3(p), SM["losa_4_thin"].u[i]]));
  const sapThick = new Map(SM["losa_4_thick"].nodos.map((p, i) => [k3(p), SM["losa_4_thick"].u[i]]));
  // ETABS Thick = SAP2000 Thick, misma malla: la referencia de ETABS ES el elemento grueso de CSI
  { let pe = 0; for (const [k, e] of eu) { const s = sapThick.get(k); for (let q = 0; q < 6; q++) pe = Math.max(pe, Math.abs(s[q] - e[q])); }
    const d = 100 * pe / wmax;
    filas.push({ que: "ETABS Thick = SAP2000 Thick (misma malla, 6 gdl)", medido: d, limite: 1e-3, ok: d <= 1e-3,
                 detalle: `peor ${d.toExponential(2)} % del w máximo: los dos usan el mismo elemento grueso de CSI` }); }
  for (const [etiqueta, dir] of [["sin automesh", ""], ["automesh 1.25", "automesh 1.25\n"], ["thin", "automesh 1.25\nshelltype 1-100 thin\n"]]) {
    writeFileSync(tmp, base + dir + "solve\n", "utf-8");
    const r = await resolverHeks(tmp);
    const nQ4 = r.elements.filter((e) => e.length === 4).length;
    let peor = 0, n = 0;
    r.nodes.forEach((nd, i) => {
      const k = nd.map((c) => c.toFixed(3)).join(",");
      const e = eu.get(k); if (!e) return;
      n++;
      const h = r.deformOutputs.deformations.get(i) ?? [];
      for (let q = 0; q < 6; q++) peor = Math.max(peor, Math.abs((h[q] ?? 0) - e[q]));
    });
    if (etiqueta === "thin") {
      let pt = 0, nt = 0;
      r.nodes.forEach((nd, i) => { const e = sapThin.get(k3(nd)); if (!e) return; nt++;
        const h = r.deformOutputs.deformations.get(i) ?? []; for (let q = 0; q < 6; q++) pt = Math.max(pt, Math.abs((h[q] ?? 0) - e[q])); });
      const d = (100 * pt) / wmax;
      filas.push({ que: "automesh + Shell-Thin: los 25 nudos = SAP2000 Thin (6 gdl)", medido: d, limite: 1e-3,
                   ok: nt === 25 && d <= 1e-3, detalle: `${nt} nudos, peor ${d.toExponential(2)} % ⇒ malla, carga y apoyos = CSI` });
    } else if (dir) {
      filas.push({ que: "automesh: la MALLA es la de ETABS (25 nudos, 16 cáscaras)",
                   medido: r.nodes.length, limite: 25,
                   ok: r.nodes.length === eu.size && nQ4 === 16,
                   detalle: `${r.nodes.length} nudos y ${nQ4} cáscaras (ETABS: ${eu.size} y 16)` });
      const d = (100 * peor) / wmax;
      // INFORMATIVA: diferencia de ELEMENTO grueso (MITC4 de Struct ≠ Shell-Thick de CSI) en un problema sin
      // solución convergida (apoyo puntual). No es un límite que se relaje: no hay número exacto con que juzgarla.
      filas.push({ que: "automesh Thick vs ETABS: diferencia de ELEMENTO (informativa, apoyo puntual no converge)", medido: d.toFixed(2) + " %",
                   limite: "info", ok: n === eu.size, crudo: true,
                   detalle: `${n} nudos; peor ${d.toFixed(2)} % (giro junto al apoyo); flecha central ${(100 * Math.abs(wc(r) / -3.5841e-3 - 1)).toFixed(2)} %. Ver placa-gruesa-navier` });
    } else {
      filas.push({ que: "sin automesh: la malla NO es la de ETABS (por eso hace falta)",
                   medido: r.nodes.length, limite: 25,
                   ok: r.nodes.length === 4 && nQ4 === 1,
                   detalle: `${r.nodes.length} nudos y ${nQ4} cáscara contra los ${eu.size} y 16 de ETABS` });
    }
  }
  return filas;
}
