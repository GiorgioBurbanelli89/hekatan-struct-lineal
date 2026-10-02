/**
 * Combinaciones del espectral (1-oct-2026) contra SAP2000 (juez), edificio del curso (validation/nec-edificio):
 *   modal      CQC · SRSS · ABS  (RSX_<m>, RSY_<m>)        cortante basal y desplazamiento de TODOS los nudos
 *   direccional SRSS · ABS · ABS SF 0.3 (= 100 % + 30 %) · CQC3 (RSXY_<d>, U1 y U2 a la vez, modal CQC)   desplazamientos U1 y U2 de todos los nudos
 * Referencia: validation/nec-edificio/sap_combinaciones.py → sap_combinaciones.json.
 */
import { readFileSync, existsSync } from "node:fs";
import { empaquetar, R, cargarFem } from "../lib/bundle.mjs";

export const nombre = "nec-combinaciones";
export const descripcion = "espectral: combinación modal CQC/SRSS/ABS y direccional SRSS/ABS/CQC3 vs SAP2000";

const V = `${R}/validation/nec-edificio`;
const leer = (f) => JSON.parse(readFileSync(`${V}/${f}`, "utf-8"));

export async function correr() {
  if (!existsSync(`${V}/sap_combinaciones.json`)) return [{ que: "falta sap_combinaciones.json", medido: 1, limite: 0, ok: false, detalle: "" }];
  const D = leer("edif.json"), S = leer("sap_combinaciones.json");
  const m = await empaquetar(`export { pisosDeModelo } from "${R}/examples/src/shared/nec/pisos";
export { espectro, PORTOVIEJO_D } from "${R}/examples/src/shared/nec/estatico";
export { espectralPorPiso, respuestaNudos, combinarDir, combinarDir3, FACTOR_VERTICAL } from "${R}/examples/src/shared/nec/espectral";
export { jointMass, modalCpp } from "${R}/hekatan-fem/src/modalCpp";\n`, "nec-combinaciones");
  await cargarFem();
  const aMap = (o) => new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v]));
  const ei = {}; for (const [k, v] of Object.entries(D.elementInputs)) ei[k] = v && typeof v === "object" && !Array.isArray(v) ? aMap(v) : v;
  const ni = { supports: aMap(D.nodeInputs.supports), diaphragms: aMap(D.nodeInputs.diaphragms) };
  const P = m.pisosDeModelo(D.nodes, D.elements, ni, ei);
  const out = m.modalCpp(D.nodes, D.elements, ni, ei, 12, 0, 0, 1, ni.diaphragms, undefined);
  const masas = m.jointMass(D.nodes, D.elements, ei, { incluyeElementos: 1 });
  const d = m.PORTOVIEJO_D["NEC-15"], Sa = m.espectro(d).Sa, red = 1 / d.R;
  const filas = [], fila = (que, medido, limite, detalle) => filas.push({ que, medido, limite, ok: medido <= limite, detalle });
  const nudos = (c, comp, u) => { let um = 0, pe = 0; for (const [nm, v] of Object.entries(S[c].nudos)) { const i = +nm.slice(1); um = Math.max(um, Math.abs(v[comp])); pe = Math.max(pe, Math.abs(Math.abs(v[comp]) - u[i])); } return [pe / um * 100, um]; };

  for (const mod of ["CQC", "SRSS", "ABS"]) for (const [dir, L] of [[0, "X"], [1, "Y"]]) {
    const c = `RS${L}_${mod}`;
    const e = m.espectralPorPiso(D.nodes, P, out, masas, Sa, red, dir, 1, (n) => ni.diaphragms.has(n), 0.05, true, mod);
    const Vs = Math.abs(S[c].base[dir]);
    fila(`${c} cortante basal vs SAP2000 (%)`, Math.abs(e.V / Vs - 1) * 100, 1e-3, `${e.V.toFixed(2)} / ${Vs.toFixed(2)} kN`);
    const [pe, um] = nudos(c, dir, e.u);
    fila(`${c} u nudo a nudo vs SAP2000 (% del máx)`, pe, 1e-3, `u máx ${(um * 1000).toFixed(3)} mm`);
  }
  // SAP «Absolute» direccional = R1 + SF·R2: SF 1 → ABS, SF 0.3 → 100 % + 30 % (borrador §5.5.1.2a); CQC3 (mismo espectro) = SRSS
  for (const dm of ["SRSS", "ABS", "ABS30", "CQC3"]) {
    const c = `RSXY_${dm}`, metodo = dm === "ABS" ? "ABS" : dm === "ABS30" ? "100-30" : "SRSS";
    for (const comp of [0, 1]) {
      const ux = m.respuestaNudos(D.nodes, out, Sa, red, 0, comp, "CQC"), uy = m.respuestaNudos(D.nodes, out, Sa, red, 1, comp, "CQC");
      const u = ux.map((a, i) => m.combinarDir(a, uy[i], metodo));
      const [pe, um] = nudos(c, comp, u);
      fila(`${c} U${comp + 1} nudo a nudo vs SAP2000 (% del máx)`, pe, 1e-3, `u máx ${(um * 1000).toFixed(3)} mm${dm === "CQC3" ? " (CQC3 = SRSS, mismo espectro)" : dm === "ABS30" ? " (100 % + 30 %)" : ""}`);
    }
  }
  // componente VERTICAL: U3 con el espectro × 2/3, sola y combinada con X e Y
  if (S.RSZ) {
    const uz = m.respuestaNudos(D.nodes, out, Sa, red * m.FACTOR_VERTICAL, 2, 2, "CQC");
    const [pe, um] = nudos("RSZ", 2, uz);
    // Z: los 12 modos son laterales; su Uz es residual (sensible a la 4.ª cifra del vector propio) → 0.02 %
    fila("RSZ (vertical, 2/3) Uz nudo a nudo vs SAP2000 (% del máx)", pe, 2e-2, `u máx ${(um * 1000).toFixed(3)} mm`);
    for (const dm of ["SRSS", "ABS", "ABS30"]) {
      const c = `RSXYZ_${dm}`, metodo = dm === "ABS" ? "ABS" : dm === "ABS30" ? "100-30" : "SRSS";
      if (!S[c]) continue;
      for (const comp of [0, 1, 2]) {
        const r = [0, 1, 2].map((d) => m.respuestaNudos(D.nodes, out, Sa, red * (d === 2 ? m.FACTOR_VERTICAL : 1), d, comp, "CQC"));
        const u = r[0].map((a, i) => m.combinarDir3(a, r[1][i], r[2][i], metodo));
        const [pe2, um2] = nudos(c, comp, u);
        fila(`${c} U${comp + 1} nudo a nudo vs SAP2000 (% del máx)`, pe2, comp === 2 ? 2e-2 : 1e-3, `u máx ${(um2 * 1000).toFixed(3)} mm`);
      }
    }
  }
  return filas;
}
