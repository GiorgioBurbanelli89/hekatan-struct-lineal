/**
 * Capa NEC sobre el edificio del curso (4 pisos, volados, waffle Shell-Thin, diafragma) contra SAP2000 (juez) y ETABS.
 * Cómo se arma: validation/nec-edificio/COMO_SE_ARMA.txt. Referencias (30-sep-2026):
 *   etabs_cm_nudos.json  masa y CM por piso de «Assembled Joint Masses» de ETABS 22 (etabs_cm_nudos.py)
 *   estatico_d2/etabs_estatico_cr.json  «Centers Of Mass And Rigidity» de ETABS (etabs_cr.py, casilla del CR por la interfaz)
 *   estatico/sap_estatico.json  SAP2000 con las MISMAS cargas nodales NEC-15 en el CM ±5 % (csi_desde_dump.py --pat)
 *   sap_espectral.json   SAP2000 Response Spectrum NEC-15, CQC 5 %, 12 modos (sap_espectral.py)
 */
import { readFileSync } from "node:fs";
import { empaquetar, R, cargarFem } from "../lib/bundle.mjs";

export const nombre = "nec-edificio-csi";
export const descripcion = "capa NEC (pisos, CM, CR, estático, espectral CQC) vs SAP2000 y ETABS";

const V = `${R}/validation/nec-edificio`;
const leer = (f) => JSON.parse(readFileSync(`${V}/${f}`, "utf-8"));

export async function correr() {
  const D = leer("edif.json");
  const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { centrosDeRigidez } from "${R}/examples/src/shared/nec/derivas";
export { espectro, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";
export { espectralPorPiso } from "${R}/examples/src/shared/nec/espectral";
export { jointMass, modalCpp } from "${R}/hekatan-fem/src/modalCpp";\n`, "nec-edificio-csi");
  const { deform } = await cargarFem();
  const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
  const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
  const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) };
  const filas = [];
  const fila = (que, medido, limite, detalle) => filas.push({ que, medido, limite, ok: medido <= limite, detalle });

  // 1. pisos: masa y CM contra ETABS
  const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
  const E = leer("etabs_cm_nudos.json").filter((q) => q.z > 0.1);
  let dm = 0, dc = 0;
  P.forEach((q, i) => { dm = Math.max(dm, Math.abs(q.masa - E[i].masa)); dc = Math.max(dc, Math.hypot(q.cm[0] - E[i].cm[0], q.cm[1] - E[i].cm[1])); });
  fila("masa por piso vs ETABS (t)", dm, 1e-3, P.map((q) => q.masa.toFixed(2)).join(" / "));
  fila("CM por piso vs ETABS (m)", dc, 1e-4, P.map((q) => `(${q.cm[0].toFixed(3)}, ${q.cm[1].toFixed(3)})`).join(" "));

  // 2. CR contra ETABS (misma rigidez; ETABS y SAP difieren 0.15 % en el estático → Y a ~2 mm)
  const CR = m.centrosDeRigidez(D.nodes, P, ni.diaphragms, (loads) => deform(D.nodes, D.elements, { ...ni, loads }, ei).deformations);
  const Ecr = leer("estatico_d2/etabs_estatico_cr.json");
  let dx = 0, dy = 0;
  CR.forEach((c, i) => { dx = Math.max(dx, Math.abs(c[0] - +Ecr[i].XCR)); dy = Math.max(dy, Math.abs(c[1] - +Ecr[i].YCR)); });
  fila("CR x vs ETABS (m)", dx, 2e-4, CR.map((c) => c[0].toFixed(4)).join(" "));
  fila("CR y vs ETABS (m)", dy, 3e-3, CR.map((c) => c[1].toFixed(4)).join(" "));

  // 3. estático NEC-15 con la carga Ey+e (la peor en torsión) contra SAP2000 nudo a nudo
  const Dp = leer("estatico/est_Eype.json"), Sp = leer("estatico/sap_estatico.json").casos.Eype;
  const U = deform(D.nodes, D.elements, { ...ni, loads: aMap(Dp.nodeInputs.loads) }, ei).deformations;
  let umax = 0, peor = 0;
  for (const n of Sp.nudos) { const u = U.get(n.i); for (let c = 0; c < 3; c++) { umax = Math.max(umax, Math.abs(n.u[c])); peor = Math.max(peor, Math.abs(n.u[c] - u[c])); } }
  fila("estático Ey+e vs SAP2000 (% del máx)", peor / umax * 100, 1e-6, `u máx ${(umax * 1000).toFixed(3)} mm`);

  // 4. modal y espectral NEC-15 contra SAP2000
  const S = leer("sap_espectral.json");
  const out = m.modalCpp(D.nodes, D.elements, ni, ei, 12, 0, 0, 1, ni.diaphragms, undefined);
  const dT = Math.max(...S.T.slice(0, 3).map((t, j) => Math.abs(1 / out.frequencies[j] / t - 1) * 100));
  fila("T1..T3 vs SAP2000 (%)", dT, 1e-3, out.frequencies.slice(0, 3).map((f) => (1 / f).toFixed(4)).join(" "));
  const masas = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
  const d = m.PORTOVIEJO_D["NEC-15"];
  for (const [dir, c] of [[0, "RSX"], [1, "RSY"]]) {
    const e = m.espectralPorPiso(D.nodes, P, out, masas, m.espectro(d).Sa, 1 / d.R, dir, d.R, (n) => ni.diaphragms.has(n), 0.05, true);
    const Vs = Math.abs(S[c].base[dir]);
    fila(`${c} cortante basal CQC vs SAP2000 (%)`, Math.abs(e.V / Vs - 1) * 100, 1e-3, `${e.V.toFixed(2)} kN`);
    let um = 0, pe = 0;
    for (const [nm, u] of Object.entries(S[c].nudos)) { const i = +nm.slice(1); um = Math.max(um, Math.abs(u[dir])); pe = Math.max(pe, Math.abs(Math.abs(u[dir]) - e.u[i])); }
    fila(`${c} u CQC nudo a nudo vs SAP2000 (% del máx)`, pe / um * 100, 1e-4, `u máx ${(um * 1000).toFixed(3)} mm`);
  }
  return filas;
}
