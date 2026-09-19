/**
 * Levantamiento de zapatas (suelo sin tracción): Das 9.ª ed., ejemplo 6.10 (p. 247), contra SAP2000.
 *
 * Zapata 1.5 × 1.5 m, e_B = 0.15, e_L = 0.30 (e_L/L = 0.2 > 1/6: un borde se levanta), Q = 606 kN.
 * Lo que Das no da y se eligió: t = 0.40 m, columna 0.30, f'c 240, ks = 2000 tonf/m³. Malla 30 × 30.
 * El suelo es un muelle de área «Compression Only» (ley Gap de CSI, CSI Analysis Reference p. 286).
 *
 * Juez: SAP2000 24 con el MISMO .heks exportado a .s2k, caso Nonlinear Static con tolerancia de fuerza
 * 1e-6 (la de fábrica, 1e-4, deja 0.02 % de desequilibrio y eso se ve en el 4.º decimal). SAFE 20 y
 * ETABS 22 van de testigos. Datos: tests/datos/das610_csi.json (validation/zapata-levantamiento/).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolverHeks } from "../lib/heks.mjs";

export const nombre = "zapata-levantamiento-das";
export const descripcion = "Das ej. 6.10: zapata con un borde levantado (suelo sin tracción) vs SAP2000, SAFE y ETABS";

const KS = 2000;   // tonf/m3, el del .heks (en kN/m3 va ×9.80665; la presión se da en tonf/m2)

export async function correr() {
  const D = JSON.parse(readFileSync(new URL("../datos/das610_csi.json", import.meta.url), "utf-8"));
  const ruta = fileURLToPath(new URL("../../examples/src/zapata-excentrica/das_ej610.heks", import.meta.url));
  const H = await resolverHeks(ruta);
  const U = H.deformOutputs.deformations;
  const w = (id) => U.get(+id - 1)[2];
  const filas = [];
  const comparar = (ref, que) => {
    let peor = 0, wmx = 0, contactoIgual = true;
    for (const [id, v] of Object.entries(ref)) {
      wmx = Math.max(wmx, Math.abs(v));
      peor = Math.max(peor, Math.abs(w(id) - v));
      if ((w(id) < 0) !== (v < 0)) contactoIgual = false;
    }
    filas.push({ que: `${que}: U3 nudo a nudo (961 nudos)`, medido: (peor / wmx) * 100, limite: 0.01, ok: (peor / wmx) * 100 <= 0.01,
                 detalle: `peor |Δw| ${peor.toExponential(3)} m de ${wmx.toExponential(4)}` });
    filas.push({ que: `${que}: mismos nudos en contacto`, medido: contactoIgual ? 1 : 0, limite: 1, ok: contactoIgual, crudo: true,
                 detalle: contactoIgual ? "el borde levantado cae en los mismos nudos" : "el contacto NO coincide" });
  };
  comparar(D.U3_NLT, "SAP2000");
  comparar(D.safe_U3_NLT, "SAFE 20");
  comparar(D.etabs_U3_NLT, "ETABS 22");
  // OpenSeesPy, segundo testigo. Su ShellMITC4 NO lleva los modos incompatibles de Wilson que el
  // Shell-Thick de Hekatan/SAP2000 sí: por eso su límite es propio (medido 0.018 %), no el de CSI.
  if (D.opensees_U3) {
    let peor = 0, wmx = 0, igual = true;
    for (const [id, v] of Object.entries(D.opensees_U3)) { wmx = Math.max(wmx, Math.abs(v)); peor = Math.max(peor, Math.abs(w(id) - v)); if ((w(id) < 0) !== (v < 0)) igual = false; }
    filas.push({ que: "OpenSeesPy (ShellMITC4 + ENT): U3 nudo a nudo", medido: peor / wmx * 100, limite: 0.05, ok: peor / wmx * 100 <= 0.05, detalle: "otro elemento de placa (sin modos incompatibles)" });
    filas.push({ que: "OpenSeesPy: mismos nudos en contacto", medido: igual ? 1 : 0, limite: 1, ok: igual, crudo: true });
  }

  let wmin = 0, nC = 0;
  for (let i = 0; i < H.nodes.length; i++) { const v = U.get(i)[2]; wmin = Math.min(wmin, v); if (v < 0) nC++; }
  const qH = -wmin * KS, qS = -Math.min(...Object.values(D.U3_NLT)) * KS;
  filas.push({ que: "q_max vs SAP2000", medido: Math.abs(qH / qS - 1) * 100, limite: 0.01, ok: Math.abs(qH / qS - 1) * 100 <= 0.01,
               detalle: `${qH.toFixed(3)} vs ${qS.toFixed(3)} tonf/m²` });
  // el levantamiento existe: sin él (lineal) la presión máxima sería otra y habría tracción
  const qLin = -Math.min(...Object.values(D.U3_lineal)) * KS;
  filas.push({ que: "hay levantamiento (nudos sin contacto)", medido: H.nodes.length - nC, limite: 1, ok: H.nodes.length - nC > 0, crudo: true,
               detalle: `${nC}/${H.nodes.length} en contacto; q_max lineal ${qLin.toFixed(2)} vs sin tracción ${qH.toFixed(2)} tonf/m²` });
  // y el equilibrio: la suma de reacciones de los muelles activos = Q
  const eq = globalThis.window?.__hekatanCliEquilibrio;
  if (eq) filas.push({ que: "equilibrio ΣFz", medido: eq.pctErr, limite: 0.001, ok: eq.pctErr <= 0.001, detalle: `${eq.sumCargasFz} kN vs ${eq.sumReaccionesFz} kN` });
  return filas;
}
